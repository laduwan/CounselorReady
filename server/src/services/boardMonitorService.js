/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// services/boardMonitorService.js
// Automated monitoring of state licensing board websites and RSS feeds
// for rule changes. Detected changes are parsed by AI and saved as
// draft (unpublished) BoardAlerts for admin review.
// ====================================================================

import cron from 'node-cron';
import crypto from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import BoardSource from '../models/BoardSource.js';
import BoardAlert from '../models/BoardAlert.js';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'CounselorReady <noreply@counselorready.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const PLATFORM_URL = process.env.PLATFORM_URL || 'https://counselorready.com';

const xmlParser = new XMLParser({ ignoreAttributes: false });

// ─── Utility: hash content for change detection ───
function hashContent(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// ─── Utility: strip HTML to plain text ───
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Fetch RSS feed and extract entries ───
async function fetchRssFeed(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'CounselorReady Board Monitor/1.0' },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);

  const xml = await response.text();
  const parsed = xmlParser.parse(xml);

  // Handle both RSS 2.0 and Atom feeds
  const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
  const entries = (Array.isArray(items) ? items : [items]).map(item => ({
    title: item.title || '',
    description: stripHtml(item.description || item.summary || item.content || ''),
    link: item.link?.['@_href'] || item.link || '',
    pubDate: item.pubDate || item.published || item.updated || ''
  }));

  return {
    fullText: entries.map(e => `${e.title}\n${e.description}`).join('\n\n'),
    entries
  };
}

// ─── Fetch webpage and extract text content ───
async function fetchWebpage(url, contentSelector) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'CounselorReady Board Monitor/1.0' },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Webpage fetch failed: ${response.status}`);

  const html = await response.text();

  // If a CSS selector hint is provided, try to isolate that section
  // We do a simple regex-based extraction since we don't have a DOM parser
  let targetHtml = html;
  if (contentSelector) {
    // Try to find content by id or class name hint
    const idMatch = html.match(new RegExp(`<[^>]+(?:id|class)="[^"]*${contentSelector}[^"]*"[^>]*>[\\s\\S]*?(?=<\\/(?:div|section|main|article)>)`, 'i'));
    if (idMatch) targetHtml = idMatch[0];
  }

  return { fullText: stripHtml(targetHtml) };
}

// ─── Use Claude to analyze detected changes ───
async function analyzeChangesWithAI(source, oldContent, newContent) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[BoardMonitor] ANTHROPIC_API_KEY not set, skipping AI analysis');
    return null;
  }

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

  const prompt = `You are analyzing a state licensing board website for changes relevant to mental health counselors.

**State:** ${source.state}
**Board:** ${source.boardName}
**Credential types monitored:** ${source.credentialTypes.join(', ') || 'All'}

**PREVIOUS content:**
${(oldContent || '(no previous content — first check)').substring(0, 8000)}

**CURRENT content:**
${newContent.substring(0, 8000)}

Identify any meaningful regulatory changes (rule amendments, CE requirement changes, fee changes, renewal process changes, scope of practice updates, new regulations, deadlines, supervision changes).

For each change found, respond with a JSON array. If no meaningful changes, respond with an empty array [].

Each item should have:
- "title": Short descriptive title of the change
- "summary": 1-2 sentence plain-language summary of what changed
- "details": Longer explanation if needed, or null
- "category": One of: ce_requirement_change, renewal_process, fee_change, scope_of_practice, new_regulation, deadline, supervision, other
- "severity": "info" for routine updates, "important" for notable changes, "urgent" for imminent deadlines or major rule changes
- "effectiveDate": ISO date string if mentioned, or null

Respond ONLY with the JSON array, no other text.`;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content[0]?.text?.trim();
    if (!text) return [];

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`[BoardMonitor] AI analysis failed for ${source.boardName}:`, error.message);
    return null;
  }
}

// ─── Check a single source for changes ───
async function checkSource(source) {
  console.log(`[BoardMonitor] Checking: ${source.boardName} (${source.state}) — ${source.feedType}`);

  let result;
  try {
    if (source.feedType === 'rss') {
      result = await fetchRssFeed(source.url);
    } else if (source.feedType === 'webpage') {
      result = await fetchWebpage(source.url, source.contentSelector);
    } else {
      // Email type is handled separately via inbound webhook
      return { checked: false, reason: 'email sources not checked via polling' };
    }
  } catch (error) {
    // Track consecutive failures, disable after 5
    source.consecutiveFailures = (source.consecutiveFailures || 0) + 1;
    source.lastCheckedAt = new Date();
    if (source.consecutiveFailures >= 5) {
      source.isActive = false;
      console.warn(`[BoardMonitor] Disabled ${source.boardName} after 5 consecutive failures`);
    }
    await source.save();
    return { checked: false, error: error.message };
  }

  const newHash = hashContent(result.fullText);
  const hasChanged = source.lastContentHash && source.lastContentHash !== newHash;

  const outcome = {
    checked: true,
    changed: hasChanged,
    draftsCreated: 0
  };

  if (hasChanged) {
    console.log(`[BoardMonitor] Change detected: ${source.boardName} (${source.state})`);

    // Use AI to analyze what changed
    const changes = await analyzeChangesWithAI(source, source.lastContent, result.fullText);

    if (changes && changes.length > 0) {
      // Create draft alerts for admin review
      for (const change of changes) {
        await BoardAlert.create({
          state: source.state,
          boardName: source.boardName,
          credentialTypes: source.credentialTypes,
          title: change.title,
          summary: change.summary,
          details: change.details || undefined,
          category: change.category || 'other',
          severity: change.severity || 'info',
          effectiveDate: change.effectiveDate ? new Date(change.effectiveDate) : undefined,
          sourceUrl: source.url,
          isPublished: false // Draft — admin must review and publish
        });
        outcome.draftsCreated++;
      }

      // Notify admin
      await notifyAdminOfDrafts(source, changes.length);
    }
  }

  // Update source tracking
  source.lastCheckedAt = new Date();
  source.lastContentHash = newHash;
  source.lastContent = result.fullText.substring(0, 50000); // Cap storage
  source.consecutiveFailures = 0;
  await source.save();

  return outcome;
}

// ─── Notify admin that new draft alerts need review ───
async function notifyAdminOfDrafts(source, count) {
  if (!ADMIN_EMAIL || !process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[CounselorReady] ${count} draft board alert${count > 1 ? 's' : ''} need review — ${source.boardName} (${source.state})`,
      html: `
        <h2>Board Rule Change Detected</h2>
        <p><strong>${source.boardName}</strong> (${source.state}) has ${count} new change${count > 1 ? 's' : ''} detected.</p>
        <p>${count} draft alert${count > 1 ? 's have' : ' has'} been created and ${count > 1 ? 'are' : 'is'} awaiting your review.</p>
        <p><a href="${PLATFORM_URL}/admin/board-alerts">Review Draft Alerts →</a></p>
        <p style="color: #666; font-size: 12px;">Source: <a href="${source.url}">${source.url}</a></p>
      `,
      text: `Board Rule Change Detected\n\n${source.boardName} (${source.state}) has ${count} new change(s).\n${count} draft alert(s) awaiting review at ${PLATFORM_URL}/admin/board-alerts`
    });
  } catch (error) {
    console.error('[BoardMonitor] Failed to send admin notification:', error.message);
  }
}

// ─── Run the full monitoring cycle ───
export async function runBoardMonitorCycle() {
  console.log('[BoardMonitor] Starting monitoring cycle...');

  const sources = await BoardSource.find({
    isActive: true,
    feedType: { $in: ['rss', 'webpage'] },
    $or: [
      { lastCheckedAt: null },
      { lastCheckedAt: { $lt: new Date(Date.now() - 1000 * 60 * 60) } } // At least 1hr since last check
    ]
  }).sort({ lastCheckedAt: 1 }); // Check oldest first

  // Further filter by each source's own checkFrequencyHours
  const due = sources.filter(s => {
    if (!s.lastCheckedAt) return true;
    const hoursSince = (Date.now() - s.lastCheckedAt.getTime()) / (1000 * 60 * 60);
    return hoursSince >= (s.checkFrequencyHours || 24);
  });

  console.log(`[BoardMonitor] ${due.length} source(s) due for check`);

  let checked = 0, changed = 0, drafts = 0;

  for (const source of due) {
    try {
      const result = await checkSource(source);
      if (result.checked) checked++;
      if (result.changed) changed++;
      drafts += result.draftsCreated || 0;

      // Polite delay between requests to avoid rate limiting
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`[BoardMonitor] Unexpected error for ${source.boardName}:`, error.message);
    }
  }

  console.log(`[BoardMonitor] Cycle complete: ${checked} checked, ${changed} changed, ${drafts} drafts created`);
}

// ─── Handle inbound email (called from webhook route) ───
export async function processInboundBoardEmail({ from, subject, bodyText, bodyHtml }) {
  // Find email-type sources that might match this sender
  const sources = await BoardSource.find({ feedType: 'email', isActive: true });

  for (const source of sources) {
    // Simple matching: check if the email is from a domain related to the source URL
    const sourceDomain = new URL(source.url).hostname;
    if (!from.toLowerCase().includes(sourceDomain.replace('www.', ''))) continue;

    const content = bodyText || stripHtml(bodyHtml || '');
    const newHash = hashContent(content);

    if (source.lastContentHash === newHash) continue; // Duplicate email

    const changes = await analyzeChangesWithAI(source, source.lastContent, content);

    if (changes && changes.length > 0) {
      for (const change of changes) {
        await BoardAlert.create({
          state: source.state,
          boardName: source.boardName,
          credentialTypes: source.credentialTypes,
          title: change.title,
          summary: change.summary,
          details: change.details || undefined,
          category: change.category || 'other',
          severity: change.severity || 'info',
          effectiveDate: change.effectiveDate ? new Date(change.effectiveDate) : undefined,
          sourceUrl: source.url,
          isPublished: false
        });
      }
      await notifyAdminOfDrafts(source, changes.length);
    }

    source.lastCheckedAt = new Date();
    source.lastContentHash = newHash;
    source.lastContent = content.substring(0, 50000);
    source.consecutiveFailures = 0;
    await source.save();
  }
}

// ─── Initialize the scheduler ───
export function initializeBoardMonitor() {
  // Run every 6 hours (each source has its own frequency that's checked within the cycle)
  cron.schedule('0 */6 * * *', () => {
    runBoardMonitorCycle().catch(err => {
      console.error('[BoardMonitor] Cycle failed:', err.message);
    });
  });

  console.log('[BoardMonitor] Scheduler initialized — runs every 6 hours');
}
