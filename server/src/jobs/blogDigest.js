/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Blog Digest Job
 *
 * Weekly email summarizing all draft BlogPost documents awaiting review,
 * with one-click Approve/Reject links per draft (signed JWT, no login
 * required to click from the email). Read-only against BlogPost except
 * for token generation, which does not mutate documents.
 *
 * Scheduled via node-cron — see server/src/index.js.
 * Schedule: Wednesdays at 8 AM ET (0 8 * * 3, America/New_York) — one day
 * after the Tuesday 6 AM blog auto-gen job, so drafts have landed first.
 *
 * Also invocable directly: node src/scripts/runBlogDigest.js
 * (for use as a Render Cron Job command, independent of app sleep state).
 *
 * Environment variables:
 *   JWT_SECRET          — required, reused from existing auth middleware
 *   RESEND_API_KEY       — required, reused from existing emailService
 *   ADMIN_ALERT_EMAIL    — optional, defaults to 'info@counselorready.com'
 *   APP_BASE_URL          — optional, defaults to 'https://api.counselorready.com'
 */

import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import BlogPost from '../models/BlogPost.js';

const LOG = '[BlogDigest]';
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://api.counselorready.com';
const TOKEN_TTL = '14d';

const CATEGORY_LABELS = {
  'state-guide': 'State Guide',
  'problem-solution': 'Problem-Solution',
  'authority': 'Authority',
  'clinical': 'Clinical',
  'news': 'News'
};

function signReviewToken(postId, action) {
  return jwt.sign(
    { postId: String(postId), action, purpose: 'blog-review' },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function draftCardHtml(post) {
  const approveToken = signReviewToken(post._id, 'approve');
  const rejectToken = signReviewToken(post._id, 'reject');
  const approveUrl = `${APP_BASE_URL}/api/blog/quick-review/${approveToken}`;
  const rejectUrl = `${APP_BASE_URL}/api/blog/quick-review/${rejectToken}`;
  const readUrl = `${APP_BASE_URL.replace('api.', '')}/admin-blog.html?post=${post._id}`;
  const label = CATEGORY_LABELS[post.category] || post.category;
  const excerpt = (post.excerpt || '').slice(0, 220);

  return `
    <div style="padding: 20px 0; border-bottom: 1px solid #eee;">
      <div style="font-size: 11px; letter-spacing: 0.5px; color: #8B7355; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">${label}</div>
      <div style="font-size: 18px; font-weight: 700; color: #6B1D34; margin-bottom: 8px;">${post.title}</div>
      <div style="font-size: 14px; color: #444; line-height: 1.5; margin-bottom: 8px;">${excerpt}</div>
      <div style="font-size: 12px; color: #888; margin-bottom: 14px;">${post.wordCount || 0} words &middot; ${post.readingTime || 1} min read</div>
      <div>
        <a href="${approveUrl}" style="display:inline-block; padding:8px 16px; background:#6B1D34; color:#fff; text-decoration:none; border-radius:4px; font-size:13px; font-weight:600; margin-right:8px;">Approve & Publish</a>
        <a href="${rejectUrl}" style="display:inline-block; padding:8px 16px; background:#f5f5f5; color:#6B1D34; text-decoration:none; border-radius:4px; font-size:13px; font-weight:600; margin-right:8px; border:1px solid #ddd;">Reject & Discard</a>
        <a href="${readUrl}" style="font-size:13px; color:#4A7C59; text-decoration:underline;">Read full draft</a>
      </div>
    </div>
  `;
}

export async function runBlogDigest() {
  try {
    const drafts = await BlogPost.find({ status: 'draft' }).sort({ createdAt: 1 });

    if (drafts.length === 0) {
      console.log(`${LOG} No drafts pending — skipping send.`);
      return { sent: false, count: 0 };
    }

    const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'info@counselorready.com';
    const cardsHtml = drafts.map(draftCardHtml).join('');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `[Blog Digest] ${drafts.length} draft${drafts.length === 1 ? '' : 's'} awaiting review`,
      html: `
        <div style="max-width: 640px; margin: 0 auto; font-family: -apple-system, Arial, sans-serif;">
          <h1 style="color: #6B1D34; font-size: 22px; margin-bottom: 4px;">Blog Drafts Awaiting Review</h1>
          <p style="color: #666; font-size: 14px; margin-top: 0;">${drafts.length} draft${drafts.length === 1 ? '' : 's'} pending — one click to approve or reject each.</p>
          ${cardsHtml}
        </div>
      `
    });

    if (error) {
      console.error(`${LOG} Resend error:`, error);
      return { sent: false, count: drafts.length, error };
    }

    console.log(`${LOG} Digest sent — ${drafts.length} drafts, email id ${data?.id}`);
    return { sent: true, count: drafts.length };
  } catch (err) {
    console.error(`${LOG} Job error:`, err.message);
    throw err;
  }
}
