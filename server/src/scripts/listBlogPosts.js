/**
 * READ-ONLY — no writes. Lists all blog posts with status, tags, and date,
 * so we can see what the auto-gen job has produced since it went live
 * (June 13, 2026) and whether any of it has been reviewed/published yet.
 *
 * Run from ~/project/src/server:
 *   node src/scripts/listBlogPosts.js
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('blogposts');

  const posts = await col.find({}).sort({ createdAt: 1 }).toArray();

  console.log('═'.repeat(90));
  console.log(`BLOG POSTS — ${posts.length} total`);
  console.log('═'.repeat(90));

  const drafts = posts.filter(p => p.status === 'draft');
  const published = posts.filter(p => p.status === 'published');
  const autogen = posts.filter(p => (p.tags || []).some(t => t.startsWith('autogen-')));

  console.log(`\nStatus: ${drafts.length} draft, ${published.length} published`);
  console.log(`Auto-generated (tagged autogen-*): ${autogen.length}\n`);

  posts.forEach(p => {
    const isAuto = (p.tags || []).some(t => t.startsWith('autogen-'));
    const created = p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '?';
    console.log(`  [${p.status.padEnd(9)}] ${created}  ${isAuto ? '(auto) ' : '       '}${p.title}`);
  });

  console.log('\n' + '═'.repeat(90));
  if (drafts.length > 0) {
    console.log(`${drafts.length} draft(s) awaiting review at /admin-blog.html`);
  }
  console.log('═'.repeat(90));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
