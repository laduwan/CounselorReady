import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const Course = mongoose.connection.collection('courses');
  const course = await Course.findOne({ slug: 'mandated-reporter-duty' });

  if (!course) {
    console.error('❌ Course not found');
    process.exit(1);
  }

  console.log(`Found: ${course.title}`);
  console.log(`Modules: ${course.modules?.length}`);

  // For each module, build a lessons array from its contentBlocks
  const updatedModules = course.modules.map((mod, modIdx) => {
    const blocks = mod.contentBlocks || [];

    // Collect all HTML content from text, accordion, and imageText blocks
    let htmlContent = '';
    const questions = [];

    blocks.forEach(block => {
      if (block.type === 'text' && block.content) {
        htmlContent += block.content + '\n';
      }
      if (block.type === 'imageText' && block.content) {
        htmlContent += `<h3>${block.title || ''}</h3>\n` + block.content + '\n';
      }
      if (block.type === 'accordion' && block.accordionItems) {
        block.accordionItems.forEach(item => {
          htmlContent += `<h4>${item.title}</h4>\n${item.content}\n`;
        });
      }
      if (block.type === 'sectionDivider') {
        // skip — structural only
      }
      if ((block.type === 'multipleChoice' || block.type === 'multiSelect') && block.question) {
        // Convert contentBlocks knowledge checks to lesson questions format
        const opts = (block.options || []).map(opt => ({
          text: opt.text || opt,
          isCorrect: opt.isCorrect || false
        }));
        questions.push({
          question: block.question,
          type: 'multiple_choice',
          options: opts,
          explanation: block.explanation || ''
        });
      }
    });

    // Create one main content lesson + optional quiz lesson
    const lessons = [
      {
        title: mod.title,
        type: 'text',
        order: 1,
        content: htmlContent,
        textContent: htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      }
    ];

    if (questions.length > 0) {
      lessons.push({
        title: `${mod.title} — Knowledge Check`,
        type: 'quiz',
        order: 2,
        questions: questions,
        shuffleQuestions: false,
        showExplanations: true
      });
    }

    return {
      ...mod,
      lessons
    };
  });

  await Course.updateOne(
    { slug: 'mandated-reporter-duty' },
    { $set: { modules: updatedModules } }
  );

  console.log('\n✅ Lessons added to all modules:');
  updatedModules.forEach((m, i) => {
    console.log(`  Module ${i+1}: "${m.title}" → ${m.lessons.length} lesson(s)`);
  });

  await mongoose.disconnect();
  console.log('\n✅ Done.');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
