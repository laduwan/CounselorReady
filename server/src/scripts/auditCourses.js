/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// auditCourses.js
// Audits all CounselorReady courses for content completeness and word counts
// Run on Render shell: node auditCourses.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://CounselorReady:QvizqheuvcU38k9v@counselorready.ouorgry.mongodb.net/counselorready?retryWrites=true&w=majority&appName=CounselorReady";

function countWords(text) {
  if (!text) return 0;
  return text.toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}

function countCourseWords(course) {
  let total = 0;
  
  // Count words in modules/lessons/content blocks
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
  
  // Count words in lessons at top level
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
  
  // Count top-level content
  total += countWords(course.description);
  total += countWords(course.overview);
  total += countWords(course.content);
  
  // Count in sections (another possible structure)
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

async function audit() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('counselorready');
    const collections = await db.listCollections().toArray();
    console.log('📦 Collections:', collections.map(c => c.name).join(', '), '\n');
    
    for (const collName of ['interactivecourses', 'courses']) {
      const coll = db.collection(collName);
      const total = await coll.countDocuments();
      
      if (total === 0) {
        console.log(`⏭️  ${collName}: 0 documents\n`);
        continue;
      }
      
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`📋 ${collName.toUpperCase()}: ${total} courses`);
      console.log(`${'═'.repeat(70)}\n`);
      
      const allCourses = await coll.find({}).toArray();
      
      const results = allCourses.map(course => {
        const moduleCount = course.modules ? course.modules.length : 0;
        const lessonCount = course.lessons ? course.lessons.length : 0;
        const ceHours = course.ceHours || course.credits || course.hours || 0;
        const wordCount = countCourseWords(course);
        const targetWords = ceHours * 6000;
        const pct = targetWords > 0 ? Math.round((wordCount / targetWords) * 100) : 0;
        
        let status;
        if (wordCount === 0 && moduleCount === 0 && lessonCount === 0) {
          status = '🔴 EMPTY';
        } else if (targetWords > 0 && wordCount >= targetWords) {
          status = '🟢 MEETS STANDARD';
        } else if (wordCount > 0) {
          status = '🟡 PARTIAL';
        } else {
          status = '🔴 EMPTY';
        }
        
        return {
          title: course.title || '(untitled)',
          modules: moduleCount,
          lessons: lessonCount,
          ceHours,
          wordCount,
          targetWords,
          pct,
          status,
          published: course.published || course.isPublished || false
        };
      });
      
      // Sort: complete first, then partial, then empty
      const order = { '🟢 MEETS STANDARD': 0, '🟡 PARTIAL': 1, '🔴 EMPTY': 2 };
      results.sort((a, b) => (order[a.status] || 9) - (order[b.status] || 9));
      
      // Print each course
      results.forEach((r, i) => {
        const bar = r.targetWords > 0 
          ? `[${'█'.repeat(Math.min(20, Math.round(r.pct / 5)))}${'░'.repeat(Math.max(0, 20 - Math.round(r.pct / 5)))}] ${r.pct}%`
          : '[no CE hours set]';
        
        console.log(`${i + 1}. ${r.status}  ${r.title}`);
        console.log(`   ${r.modules} modules | ${r.lessons} lessons | ${r.ceHours} CE hrs | ${r.wordCount.toLocaleString()} words (need ${r.targetWords.toLocaleString()}) ${bar}`);
        console.log(`   Published: ${r.published ? 'Yes' : 'No'}`);
        console.log('');
      });
      
      // Summary
      const complete = results.filter(r => r.status === '🟢 MEETS STANDARD').length;
      const partial = results.filter(r => r.status === '🟡 PARTIAL').length;
      const empty = results.filter(r => r.status === '🔴 EMPTY').length;
      const totalWords = results.reduce((sum, r) => sum + r.wordCount, 0);
      const totalCE = results.reduce((sum, r) => sum + r.ceHours, 0);
      
      console.log(`${'─'.repeat(70)}`);
      console.log(`SUMMARY for ${collName}:`);
      console.log(`  🟢 Meets 6,000 words/CE hr: ${complete}`);
      console.log(`  🟡 Has content but incomplete: ${partial}`);
      console.log(`  🔴 Empty (no content): ${empty}`);
      console.log(`  📝 Total words across all courses: ${totalWords.toLocaleString()}`);
      console.log(`  🎓 Total CE hours listed: ${totalCE}`);
      console.log(`${'─'.repeat(70)}\n`);
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

audit();
