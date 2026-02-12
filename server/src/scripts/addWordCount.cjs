// addWordCount.cjs
// ================================================================
// ONE-TIME SCRIPT: Pre-compute wordCount for all courses in MongoDB
// Run on Render shell: node addWordCount.cjs
// ================================================================
// This adds a `wordCount` field to every course document so the
// admin API can return it without sending full content.
// ================================================================

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://CounselorReady:QvizqheuvcU38k9v@counselorready.ouorgry.mongodb.net/counselorready?retryWrites=true&w=majority&appName=CounselorReady";

function countWords(text) {
  if (!text) return 0;
  return text.toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}

function countCourseWords(course) {
  let total = 0;

  // Count in modules → lessons → contentBlocks
  if (course.modules && Array.isArray(course.modules)) {
    for (const mod of course.modules) {
      total += countWords(mod.title);
      total += countWords(mod.description);

      if (mod.lessons && Array.isArray(mod.lessons)) {
        for (const lesson of mod.lessons) {
          total += countWords(lesson.title);
          total += countWords(lesson.content);

          if (lesson.contentBlocks && Array.isArray(lesson.contentBlocks)) {
            for (const block of lesson.contentBlocks) {
              total += countWords(block.content);
              total += countWords(block.text);
              total += countWords(block.question);
              total += countWords(block.explanation);
              if (block.options && Array.isArray(block.options)) {
                for (const opt of block.options) {
                  total += countWords(typeof opt === 'string' ? opt : opt.text || opt.label || '');
                }
              }
              if (block.items && Array.isArray(block.items)) {
                for (const item of block.items) {
                  total += countWords(typeof item === 'string' ? item : item.title || '');
                  total += countWords(typeof item === 'object' ? item.content || item.text || '' : '');
                }
              }
              if (block.pairs && Array.isArray(block.pairs)) {
                for (const pair of block.pairs) {
                  total += countWords(pair.term || pair.left || '');
                  total += countWords(pair.definition || pair.right || '');
                }
              }
            }
          }
        }
      }

      // Also check mod.contentBlocks (some courses use this structure)
      if (mod.contentBlocks && Array.isArray(mod.contentBlocks)) {
        for (const block of mod.contentBlocks) {
          total += countWords(block.content);
          total += countWords(block.text);
          total += countWords(block.question);
          total += countWords(block.explanation);
          if (block.options && Array.isArray(block.options)) {
            for (const opt of block.options) {
              total += countWords(typeof opt === 'string' ? opt : opt.text || opt.label || '');
            }
          }
          if (block.items && Array.isArray(block.items)) {
            for (const item of block.items) {
              total += countWords(typeof item === 'string' ? item : item.title || '');
              total += countWords(typeof item === 'object' ? item.content || item.text || '' : '');
            }
          }
        }
      }
    }
  }

  // Count in top-level lessons
  if (course.lessons && Array.isArray(course.lessons)) {
    for (const lesson of course.lessons) {
      total += countWords(lesson.title);
      total += countWords(lesson.content);
      if (lesson.contentBlocks && Array.isArray(lesson.contentBlocks)) {
        for (const block of lesson.contentBlocks) {
          total += countWords(block.content);
          total += countWords(block.text);
          total += countWords(block.question);
          total += countWords(block.explanation);
        }
      }
    }
  }

  // Count in sections
  if (course.sections && Array.isArray(course.sections)) {
    for (const section of course.sections) {
      total += countWords(section.title);
      total += countWords(section.content);
      total += countWords(section.text);
      if (section.lessons && Array.isArray(section.lessons)) {
        for (const lesson of section.lessons) {
          total += countWords(lesson.title);
          total += countWords(lesson.content);
        }
      }
    }
  }

  // Top-level content
  total += countWords(course.description);
  total += countWords(course.overview);
  total += countWords(course.content);

  return total;
}

async function addWordCounts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('counselorready');

    for (const collName of ['interactivecourses', 'courses']) {
      const coll = db.collection(collName);
      const allCourses = await coll.find({}).toArray();

      if (allCourses.length === 0) {
        console.log(`⏭️  ${collName}: 0 documents\n`);
        continue;
      }

      console.log(`\n${'═'.repeat(60)}`);
      console.log(`📋 ${collName.toUpperCase()}: ${allCourses.length} courses`);
      console.log(`${'═'.repeat(60)}\n`);

      let updated = 0;
      for (const course of allCourses) {
        const wordCount = countCourseWords(course);
        const moduleCount = course.modules ? course.modules.length : 0;
        const ceHours = course.ceHours || course.ceuHours || 0;
        const targetWords = ceHours * 6000;
        const pct = targetWords > 0 ? Math.round((wordCount / targetWords) * 100) : 0;

        await coll.updateOne(
          { _id: course._id },
          {
            $set: {
              wordCount: wordCount,
              moduleCount: moduleCount,
              wordCountUpdatedAt: new Date()
            }
          }
        );

        const bar = targetWords > 0
          ? `${'█'.repeat(Math.min(20, Math.round(pct / 5)))}${'░'.repeat(Math.max(0, 20 - Math.round(pct / 5)))} ${pct}%`
          : '(no CE hrs)';

        console.log(`  ${wordCount > 0 ? '✅' : '📦'} ${course.title}`);
        console.log(`     ${wordCount.toLocaleString()} words | ${moduleCount} modules | ${ceHours} CE hrs | ${bar}`);
        updated++;
      }

      console.log(`\n📊 Updated ${updated} courses in ${collName}`);
    }

    console.log('\n🎉 Done! All courses now have wordCount and moduleCount fields.');
    console.log('   The admin API will return these in the $project stage.\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

addWordCounts();
