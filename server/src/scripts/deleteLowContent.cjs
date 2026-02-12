// deleteLowContent.cjs
// Deletes courses under 50% word target AND under 3000 words (no CE hours set)
// Keeps: 13 courses at 50%+ AND 8 courses with significant content but no CE hours

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://CounselorReady:QvizqheuvcU38k9v@counselorready.ouorgry.mongodb.net/counselorready?retryWrites=true&w=majority&appName=CounselorReady";

function countWords(text) {
  if (!text) return 0;
  return text.toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}

function countCourseWords(course) {
  let total = 0;
  
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
  
  total += countWords(course.description);
  total += countWords(course.overview);
  total += countWords(course.content);
  
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
  
  return total;
}

async function deleteLowContent() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('counselorready');
    
    for (const collName of ['interactivecourses', 'courses']) {
      const coll = db.collection(collName);
      const allCourses = await coll.find({}).toArray();
      
      if (allCourses.length === 0) continue;
      
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`📋 ${collName.toUpperCase()}: ${allCourses.length} courses`);
      console.log(`${'═'.repeat(60)}\n`);
      
      const toKeep = [];
      const toDelete = [];
      
      for (const course of allCourses) {
        const ceHours = course.ceHours || course.credits || course.hours || 0;
        const wordCount = countCourseWords(course);
        const targetWords = ceHours * 6000;
        const pct = targetWords > 0 ? Math.round((wordCount / targetWords) * 100) : 0;
        
        let keep = false;
        let reason = '';
        
        if (targetWords > 0 && pct >= 50) {
          keep = true;
          reason = `${pct}% of word target`;
        } else if (targetWords === 0 && wordCount >= 3000) {
          keep = true;
          reason = `${wordCount.toLocaleString()} words (no CE hrs set)`;
        }
        
        if (keep) {
          toKeep.push({ title: course.title, reason, wordCount });
        } else {
          toDelete.push({ title: course.title, _id: course._id, wordCount, pct });
        }
      }
      
      console.log(`✅ KEEPING (${toKeep.length}):`);
      toKeep.forEach((c, i) => {
        console.log(`   ${i+1}. ${c.title} — ${c.reason}`);
      });
      
      console.log(`\n❌ DELETING (${toDelete.length}):`);
      toDelete.forEach((c, i) => {
        console.log(`   ${i+1}. ${c.title} (${c.wordCount} words, ${c.pct}%)`);
      });
      
      if (toDelete.length > 0) {
        const ids = toDelete.map(c => c._id);
        const result = await coll.deleteMany({ _id: { $in: ids } });
        console.log(`\n🗑️  DELETED ${result.deletedCount} courses from ${collName}`);
      }
      
      const remaining = await coll.countDocuments();
      console.log(`📊 ${remaining} courses remaining in ${collName}\n`);
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

deleteLowContent();
