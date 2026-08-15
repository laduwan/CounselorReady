/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Blog Auto-Generation Job
 *
 * Picks the next topic from BLOG_TOPICS that has not yet been generated,
 * calls the Claude API to draft a 700–900 word Markdown post, saves it as a
 * draft BlogPost, and emails Ke the full draft with one-click Approve/Reject
 * links (no login required) so review doesn't require opening the admin
 * dashboard. This protects clinical accuracy and keeps Ke's voice consistent
 * while keeping review to a single email action.
 *
 * Topic tracking: each generated post is tagged `autogen-<topicId>`. The job
 * skips any topic whose ID appears in an existing post's tags array.
 * When all topics have been generated, the cycle restarts from the beginning.
 *
 * Scheduled via node-cron — see server/src/index.js.
 * Schedule: Tuesdays at 6 AM ET (0 6 * * 2, America/New_York)
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY   — required
 *   BLOG_GEN_MODEL      — optional, defaults to claude-haiku-4-5-20251001
 *   ADMIN_EMAIL         — required for the approval email to send
 *   CLIENT_URL          — base URL used to build approve/reject links
 */

import crypto from 'crypto';
import BlogPost from '../models/BlogPost.js';
import { BLOG_TOPICS } from '../data/blogTopicQueue.js';
import { sendBlogDraftForApproval } from '../services/emailService.js';

const LOG = '[BlogAutoGen]';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

// ── Claude call ──────────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const model = process.env.BLOG_GEN_MODEL || DEFAULT_MODEL;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'unknown');
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';
}

// ── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt() {
  return `You are writing blog posts for CounselorReady, authored by Kejuiana Johnson, LPC, NCC, CPCS, BC-TMH — a licensed professional counselor, approved clinical supervisor, and NBCC ACEP provider in Georgia.

Voice and tone:
- Direct, warm, and clinically authoritative. Write as a practicing LPC who has navigated these systems firsthand.
- No fluff. No generic motivational language. No "in today's world" openers.
- Respect the reader's intelligence — they are licensed mental health professionals.
- Conversational but precise. Short paragraphs. No passive voice where active works.

Compliance rules — follow these exactly:
- CounselorReady is an NBCC Approved Continuing Education Provider (ACEP #7760). Use this exact phrase when referencing provider status.
- NEVER say "NBCC-approved CE" or "NBCC-accredited" as standalone phrases.
- NEVER imply NBCC endorses or sponsors CounselorReady. The approved entity is GA Integrated Therapeutic Perspectives LLC, not CounselorReady itself.
- NEVER make claims about CE credits without specifying the provider context.

Structure rules:
- Do NOT include an H1 title — the post title is handled separately.
- Start with a brief hook paragraph (2–3 sentences) that states the problem or question.
- Use H2 subheadings (## in Markdown) to organize the body — 3 to 5 subheadings.
- End with a short closing paragraph that reinforces the key takeaway and includes the internal link naturally.
- Target 700–900 words total. Do not exceed 1,000 words.

Output rules:
- Return ONLY the Markdown content, starting with the hook paragraph.
- Do NOT include the title, frontmatter, YAML, or any meta fields.
- Do NOT include explanatory text before or after the post.
- Do NOT wrap the output in code fences.`;
}

// ── Content prompt for a specific topic ──────────────────────────────────────

function buildUserPrompt(topic) {
  return `Write a blog post for CounselorReady with the following brief:

Title: ${topic.title}
Category: ${topic.category}
Target keywords (weave in naturally, do not stuff): ${topic.targetKeywords.join(', ')}
Content brief: ${topic.brief}

Internal link to include: Link to ${topic.internalLinkPath} using the anchor text "${topic.internalLinkAnchor}". Place this link naturally in the final paragraph or a relevant section — not forced.

${topic.partnerAngle
  ? 'Audience: CE providers, counseling educators, training directors, and LPC supervisors who want to offer CE courses — not learners.'
  : 'Audience: Licensed counselors (LPCs, LMFTs, LCSWs, LMHCs, NCCs) managing CE requirements for license renewal.'}

Write the post now.`;
}

// ── Topic selection ───────────────────────────────────────────────────────────

async function selectNextTopic() {
  const existingPosts = await BlogPost.find({
    tags: { $regex: /^autogen-/ }
  }).select('tags').lean();

  const usedIds = new Set(
    existingPosts.flatMap(p => p.tags.filter(t => t.startsWith('autogen-')).map(t => t.replace('autogen-', '')))
  );

  const activeTopic = BLOG_TOPICS.find(t => !t.retired && !usedIds.has(t.id));
  if (activeTopic) return activeTopic;

  console.log(`${LOG} All ${BLOG_TOPICS.length} topics generated. Restarting cycle.`);

  const allAutogenPosts = await BlogPost.find({
    tags: { $regex: /^autogen-/ }
  }).select('tags createdAt').sort({ createdAt: 1 }).lean();

  if (allAutogenPosts.length === 0) return BLOG_TOPICS[0];

  const oldestTag = allAutogenPosts[0].tags.find(t => t.startsWith('autogen-'));
  const oldestId = oldestTag?.replace('autogen-', '');
  const recycled = BLOG_TOPICS.find(t => t.id === oldestId);
  return recycled || BLOG_TOPICS[0];
}

// ── Main runner ───────────────────────────────────────────────────────────────

export async function runBlogAutoGen() {
  console.log(`${LOG} Starting blog auto-generation run...`);

  const stats = { topic: null, saved: false, error: null };

  try {
    const topic = await selectNextTopic();
    stats.topic = topic.id;
    console.log(`${LOG} Selected topic: "${topic.title}"`);

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(topic);

    console.log(`${LOG} Calling Claude (${process.env.BLOG_GEN_MODEL || DEFAULT_MODEL})...`);
    const content = await callClaude(systemPrompt, userPrompt);

    if (!content || content.trim().length < 200) {
      throw new Error(`Claude returned suspiciously short content (${content?.length ?? 0} chars)`);
    }

    const firstPara = content.split('\n\n').find(p => p.trim() && !p.startsWith('#'));
    const excerpt = (firstPara || '').replace(/[#*_[\]()]/g, '').trim().substring(0, 280);
    const metaDescription = excerpt.substring(0, 155);
    const metaTitle = topic.title.substring(0, 70);

    const post = new BlogPost({
      title: topic.title,
      content,
      excerpt: excerpt || topic.brief.substring(0, 280),
      author: 'Kejuiana Johnson, LPC, NCC, CPCS, BC-TMH',
      category: topic.category,
      tags: [
        `autogen-${topic.id}`,
        ...(topic.partnerAngle ? ['partner', 'ce-provider'] : ['ce-renewal', 'licensed-counselors']),
        ...topic.targetKeywords.slice(0, 2).map(k => k.replace(/\s+/g, '-').toLowerCase())
      ],
      metaTitle,
      metaDescription,
      targetKeywords: topic.targetKeywords,
      status: 'draft',
      reviewToken: crypto.randomBytes(24).toString('hex')
    });

    await post.save();
    stats.saved = true;

    console.log(
      `${LOG} Draft saved: "${topic.title}" (${post.wordCount} words, slug: ${post.slug})`
    );

    const baseUrl = (process.env.CLIENT_URL || 'https://counselorready.com').replace(/\/$/, '');
    const emailResult = await sendBlogDraftForApproval(post, baseUrl);
    stats.emailed = emailResult.success;
    if (!emailResult.success) {
      console.warn(`${LOG} Draft saved but approval email failed: ${emailResult.error}`);
    }
  } catch (err) {
    stats.error = err.message;
    console.error(`${LOG} Error:`, err.message);
  }

  console.log(`${LOG} Complete:`, stats);
  return stats;
}
