import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const ic = db.collection('interactivecourses');

  // Sample 5 published courses with the worst formatting
  const samples = [
    'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide',
    'beyond-the-uniform-first-responder-families',
    'ethics-and-professional-boundaries-in-counseling-practice',
    '28-days-later-understanding-addiction-and-recovery',
    'motivational-interviewing-from-ambivalence-to-action'
  ];

  for (const slug of samples) {
    const course = await ic.findOne({ slug });
    if (!course) { console.log(`\n❌ ${slug} NOT FOUND\n`); continue; }

    console.log('\n' + '='.repeat(100));
    console.log(`COURSE: ${course.title} (${slug})`);
    console.log(`Sections: ${course.sections?.length || 0}`);
    console.log('='.repeat(100));

    const sections = course.sections || [];
    for (let si = 0; si < Math.min(sections.length, 2); si++) {
      const section = sections[si];
      console.log(`\n--- SECTION ${si+1}: "${section.title}" ---`);
      console.log(`ContentBlocks: ${section.contentBlocks?.length || 0}`);

      const blocks = section.contentBlocks || [];
      for (let bi = 0; bi < blocks.length; bi++) {
        const b = blocks[bi];
        console.log(`\n  BLOCK ${bi+1} [${b.type}]:`);

        if (b.type === 'text') {
          const txt = b.textContent || b.content || '';
          // Show first 500 chars to understand format
          const preview = txt.substring(0, 500);
          const hasHTML = /<[a-z][\s\S]*>/i.test(txt);
          const hasMarkdown = /^#{1,3}\s|^\*\*|^---$/m.test(txt);
          const hasEmbeddedQuiz = /correct answer|rationale:|A\)|B\)|C\)|D\)/i.test(txt);
          const hasModuleHeader = /module \d+:|module duration:|learning objectives:/i.test(txt);
          const wordCount = txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(w => w).length;

          console.log(`    Words: ${wordCount}`);
          console.log(`    Has HTML tags: ${hasHTML}`);
          console.log(`    Has Markdown: ${hasMarkdown}`);
          console.log(`    Has embedded quiz: ${hasEmbeddedQuiz}`);
          console.log(`    Has module metadata: ${hasModuleHeader}`);
          console.log(`    PREVIEW: ${preview.replace(/\n/g, '\\n').substring(0, 400)}...`);
        } else if (b.type === 'multipleChoice' || b.type === 'multiSelect') {
          console.log(`    Question: ${(b.question || '').substring(0, 100)}`);
          console.log(`    Options: ${b.options?.length || 0}`);
          const optFormat = b.options?.[0];
          console.log(`    Option format: ${typeof optFormat === 'object' ? 'OBJECT {text,isCorrect}' : 'STRING'}`);
        } else {
          console.log(`    (${b.type} block - skipped detail)`);
        }
      }
    }
  }

  // Now get a count of content patterns across ALL courses
  console.log('\n\n' + '='.repeat(100));
  console.log('PATTERN ANALYSIS ACROSS ALL COURSES');
  console.log('='.repeat(100) + '\n');

  const allCourses = await ic.find({}).toArray();
  let stats = {
    totalTextBlocks: 0,
    htmlFormatted: 0,
    plainText: 0,
    markdownStyle: 0,
    embeddedQuizzes: 0,
    moduleMetadata: 0,
    emptyBlocks: 0,
    avgWordsPerBlock: 0,
    totalWords: 0,
    coursesWithOnlyTextAndDividers: 0,
    coursesWithInteractiveBlocks: 0
  };

  for (const c of allCourses) {
    let hasInteractive = false;
    for (const s of (c.sections || [])) {
      for (const b of (s.contentBlocks || [])) {
        if (b.type === 'text') {
          stats.totalTextBlocks++;
          const txt = b.textContent || b.content || '';
          if (!txt.trim()) { stats.emptyBlocks++; continue; }
          
          const words = txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(w => w).length;
          stats.totalWords += words;

          if (/<[a-z][\s\S]*>/i.test(txt)) stats.htmlFormatted++;
          else if (/^#{1,3}\s|^\*\*/m.test(txt)) stats.markdownStyle++;
          else stats.plainText++;

          if (/correct answer|rationale:|A\)\s|B\)\s|C\)\s|D\)\s/i.test(txt)) stats.embeddedQuizzes++;
          if (/module \d+:|module duration:|learning objectives:/i.test(txt)) stats.moduleMetadata++;
        }
        if (['multipleChoice', 'multiSelect', 'matching', 'reflection', 'accordion', 'imageText'].includes(b.type)) {
          hasInteractive = true;
        }
      }
    }
    if (hasInteractive) stats.coursesWithInteractiveBlocks++;
    else stats.coursesWithOnlyTextAndDividers++;
  }

  stats.avgWordsPerBlock = stats.totalTextBlocks > 0 ? Math.round(stats.totalWords / stats.totalTextBlocks) : 0;

  console.log(`Total text blocks: ${stats.totalTextBlocks}`);
  console.log(`  HTML formatted: ${stats.htmlFormatted}`);
  console.log(`  Plain text: ${stats.plainText}`);
  console.log(`  Markdown-style: ${stats.markdownStyle}`);
  console.log(`  Empty: ${stats.emptyBlocks}`);
  console.log(`  With embedded quizzes: ${stats.embeddedQuizzes}`);
  console.log(`  With module metadata: ${stats.moduleMetadata}`);
  console.log(`  Avg words per block: ${stats.avgWordsPerBlock}`);
  console.log('');
  console.log(`Courses with interactive blocks: ${stats.coursesWithInteractiveBlocks}`);
  console.log(`Courses with ONLY text+dividers: ${stats.coursesWithOnlyTextAndDividers}`);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
