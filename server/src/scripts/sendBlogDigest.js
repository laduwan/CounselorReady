/**
 * One-off: backfills reviewToken on any existing draft BlogPosts that don't
 * have one yet (the 8-post backlog from before the email-approval flow
 * existed), then sends a single digest email covering all of them.
 *
 * Safe to re-run: posts that already have a reviewToken are left alone
 * (their existing approve/reject links stay valid) and are still included
 * in the digest so nothing gets silently dropped. Sending itself only
 * happens with --send, so a plain run just shows what would be included.
 *
 * Run from ~/project/src/server:
 *   node src/scripts/sendBlogDigest.js            (dry run — shows what would be sent)
 *   node src/scripts/sendBlogDigest.js --send      (backfills tokens + sends the email)
 */
import mongoose from 'mongoose';
import crypto from 'crypto';
import BlogPost from '../models/BlogPost.js';
import { sendBlogDraftDigest } from '../services/emailService.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const SEND = process.argv.includes('--send');

async function main() {
  await mongoose.connect(MONGODB_URI);

  const drafts = await BlogPost.find({ status: 'draft' }).sort({ createdAt: 1 });

  console.log('═'.repeat(90));
  console.log(SEND ? 'SENDING DIGEST' : 'DRY RUN — no email sent (pass --send to commit)');
  console.log('═'.repeat(90));
  console.log(`\n${drafts.length} draft(s) found:\n`);

  for (const post of drafts) {
    const needsToken = !post.reviewToken;
    console.log(`  - "${post.title}" ${needsToken ? '(will generate reviewToken)' : '(already has token)'}`);
    if (SEND && needsToken) {
      post.reviewToken = crypto.randomBytes(24).toString('hex');
      await post.save();
    }
  }

  if (!SEND) {
    console.log('\nRe-run with --send to backfill tokens and email the digest.');
    await mongoose.disconnect();
    return;
  }

  const baseUrl = (process.env.CLIENT_URL || 'https://counselorready.com').replace(/\/$/, '');
  const result = await sendBlogDraftDigest(drafts, baseUrl);

  console.log('\n' + '═'.repeat(90));
  console.log(result.success ? 'Digest email sent.' : `Failed to send: ${result.error}`);
  console.log('═'.repeat(90));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
