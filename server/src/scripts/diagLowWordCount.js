import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const col = db.collection('interactivecourses');
const slugs = ['lost-in-translation','pursuit-of-happyness'];
for (const slug of slugs) {
  const c = await col.findOne({slug: {$regex: slug}});
  if (!c) { console.log(slug, 'NOT FOUND'); continue; }
  console.log('\n' + c.title);
  console.log('sections:', c.sections?.length);
  const s = c.sections?.[0];
  if (s) {
    console.log('  s[0] blocks:', s.contentBlocks?.length);
    const b = s.contentBlocks?.[0];
    if (b) console.log('  b[0] keys:', Object.keys(b).join(', '));
    if (b) console.log('  b[0] type:', b.type);
    const contentField = b?.textContent ? 'textContent' : b?.content ? 'content' : b?.html ? 'html' : 'NONE';
    if (b) console.log('  b[0] content field:', contentField, '| length:', (b[contentField]||'').length);
  }
}
await mongoose.disconnect();
