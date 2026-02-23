import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const c = mongoose.connection.db.collection('interactivecourses');

const slugs = [
  'neurobiology-of-trauma',
  'trauma-informed-care',
  'suicide-risk-assessment',
  'dialectical-behavior-therapy',
  'mandated-reporter',
  'narrative-therapy'
];

for (const slug of slugs) {
  const course = await c.findOne({ slug: { $regex: slug, $options: 'i' } });
  if (!course) {
    // Try by title fragment
    const byTitle = await c.findOne({ title: { $regex: slug.replace(/-/g, '.*'), $options: 'i' } });
    if (byTitle) {
      console.log(`\n${byTitle.title} (slug: ${byTitle.slug})`);
      console.log(`  sections: ${(byTitle.sections || []).length}`);
      console.log(`  modules: ${(byTitle.modules || []).length}`);
      const secWords = (byTitle.sections || []).reduce((s, sec) => s + (sec.contentBlocks || []).reduce((w, b) => {
        const txt = b.textContent || b.content || b.html || b.body || '';
        return w + txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
      }, 0), 0);
      const modWords = (byTitle.modules || []).reduce((s, mod) => {
        let mw = 0;
        (mod.contentBlocks || []).forEach(b => {
          const txt = b.textContent || b.content || '';
          mw += txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
        });
        (mod.lessons || []).forEach(l => {
          const txt = l.content || l.textContent || '';
          mw += txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
        });
        return s + mw;
      }, 0);
      console.log(`  words in sections[]: ${secWords}`);
      console.log(`  words in modules[]: ${modWords}`);
      console.log(`  cached wordCount: ${byTitle.wordCount}`);
    } else {
      console.log(`\n${slug}: NOT FOUND`);
    }
    continue;
  }
  console.log(`\n${course.title} (slug: ${course.slug})`);
  console.log(`  sections: ${(course.sections || []).length}`);
  console.log(`  modules: ${(course.modules || []).length}`);
  const secWords = (course.sections || []).reduce((s, sec) => s + (sec.contentBlocks || []).reduce((w, b) => {
    const txt = b.textContent || b.content || b.html || b.body || '';
    return w + txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
  }, 0), 0);
  const modWords = (course.modules || []).reduce((s, mod) => {
    let mw = 0;
    (mod.contentBlocks || []).forEach(b => {
      const txt = b.textContent || b.content || '';
      mw += txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
    });
    (mod.lessons || []).forEach(l => {
      const txt = l.content || l.textContent || '';
      mw += txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
    });
    return s + mw;
  }, 0);
  console.log(`  words in sections[]: ${secWords}`);
  console.log(`  words in modules[]: ${modWords}`);
  console.log(`  cached wordCount: ${course.wordCount}`);
}

await mongoose.disconnect();
