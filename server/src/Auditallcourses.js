/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Quick DB audit - paste into Render shell
// Checks BOTH content structures: lessons[] AND contentBlocks/sections

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const courses = await mongoose.connection.collection('interactivecourses')
    .find({}).sort({ title: 1 }).toArray();

  let totalWords = 0;
  let totalCE = 0;
  let published = 0;
  let passing = 0;

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("COUNSELORREADY COURSE AUDIT — interactivecourses collection");
  console.log("═══════════════════════════════════════════════════════════════\n");

  courses.forEach(c => {
    let words = 0;

    // Method 1: modules[].lessons[].content (standard schema)
    (c.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        if (l.type === 'text' && l.content) {
          words += l.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w).length;
        }
      });
      // Method 2: modules[].contentBlocks[].content
      (m.contentBlocks || []).forEach(b => {
        if (b.content && typeof b.content === 'string') {
          words += b.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w).length;
        }
      });
    });

    // Method 3: sections[].contentBlocks[].content
    (c.sections || []).forEach(s => {
      (s.contentBlocks || []).forEach(b => {
        if (b.content && typeof b.content === 'string') {
          words += b.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w).length;
        }
      });
    });

    // Fallback: use stored wordCount if computed words = 0
    const storedWC = c.wordCount || 0;
    const displayWords = words > 0 ? words : storedWC;
    const source = words > 0 ? 'calc' : (storedWC > 0 ? 'stored' : 'none');

    const ce = c.ceHours || c.ceuHours || 0;
    const req = ce * 6000;
    const pct = req > 0 ? Math.round(displayWords / req * 100) : 0;
    const pass = req > 0 && displayWords >= req;
    const pub = c.isPublished ? '🟢' : '⬜';
    const status = req === 0 ? '⚠️' : (pass ? '✅' : '❌');

    if (c.isPublished) published++;
    if (pass) passing++;
    totalWords += displayWords;
    totalCE += ce;

    // Count questions
    let examQs = 0;
    let kcQs = 0;
    (c.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        if (l.type === 'quiz' && l.questions) {
          if (l.isExam) examQs += l.questions.length;
          else kcQs += l.questions.length;
        }
      });
    });
    // Also check assessment
    const assessQs = (c.assessment && c.assessment.questions) ? c.assessment.questions.length : 0;
    if (assessQs > examQs) examQs = assessQs;

    const refs = (c.references || []).length;
    const mods = (c.modules || c.sections || []).length;

    console.log(`${pub} ${status} ${c.title}`);
    console.log(`   ${ce || '?'}CE | ${displayWords.toLocaleString()}/${req.toLocaleString()} words (${pct}%) [${source}] | ${mods} mods | Exam:${examQs} KC:${kcQs} | Refs:${refs}`);
    console.log(`   slug: ${c.slug}`);
    if (!pass && c.isPublished) console.log(`   ⚠️  PUBLISHED BUT NOT COMPLIANT`);
    console.log();
  });

  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`Total: ${courses.length} courses | Published: ${published} | Passing: ${passing}`);
  console.log(`Total words: ${totalWords.toLocaleString()} | Total CE: ${totalCE}`);
  console.log("═══════════════════════════════════════════════════════════════");

  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
