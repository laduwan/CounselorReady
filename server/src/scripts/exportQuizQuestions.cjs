// exportQuizQuestions.cjs
// Exports all quiz questions to a reviewable format
// Run: node src/scripts/exportQuizQuestions.cjs

const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;

async function exportQuestions() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!\n');
  
  const db = mongoose.connection.db;
  const coursesCollection = db.collection('courses');
  
  const courses = await coursesCollection.find({}).toArray();
  
  let csvContent = 'Course,Quiz,Question #,Question Type,Question,Option A,Option B,Option C,Option D,Correct Answer,Correct Letter,Has Explanation\n';
  let totalQuestions = 0;
  
  for (const course of courses) {
    if (!course.modules) continue;
    
    for (const module of course.modules) {
      if (!module.lessons) continue;
      
      for (const lesson of module.lessons) {
        if (lesson.type !== 'quiz' || !lesson.questions) continue;
        
        console.log(`📝 ${course.title.substring(0, 40)}... - ${lesson.title}`);
        
        for (let q = 0; q < lesson.questions.length; q++) {
          const question = lesson.questions[q];
          totalQuestions++;
          
          const opts = question.options || [];
          const correctIdx = question.correctAnswer;
          const correctLetter = typeof correctIdx === 'number' ? String.fromCharCode(65 + correctIdx) : 'N/A';
          const correctText = opts[correctIdx] || 'N/A';
          const qType = Array.isArray(correctIdx) ? 'MULTI' : 'SINGLE';
          
          // Escape CSV fields
          const escapeCSV = (str) => {
            if (!str) return '';
            str = String(str);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
          };
          
          csvContent += [
            escapeCSV(course.title),
            escapeCSV(lesson.title),
            q + 1,
            qType,
            escapeCSV(question.question),
            escapeCSV(opts[0] || ''),
            escapeCSV(opts[1] || ''),
            escapeCSV(opts[2] || ''),
            escapeCSV(opts[3] || ''),
            escapeCSV(correctText),
            correctLetter,
            question.explanation ? 'Yes' : 'No'
          ].join(',') + '\n';
        }
      }
    }
  }
  
  // Save CSV
  const csvPath = '/tmp/all-quiz-questions.csv';
  fs.writeFileSync(csvPath, csvContent);
  
  // Also create a more readable text report
  let textReport = '';
  textReport += '═'.repeat(80) + '\n';
  textReport += '                    COUNSELORREADY QUIZ QUESTION EXPORT\n';
  textReport += '═'.repeat(80) + '\n\n';
  
  for (const course of courses) {
    if (!course.modules) continue;
    
    let courseHasQuizzes = false;
    
    for (const module of course.modules) {
      if (!module.lessons) continue;
      
      for (const lesson of module.lessons) {
        if (lesson.type !== 'quiz' || !lesson.questions || lesson.questions.length === 0) continue;
        
        if (!courseHasQuizzes) {
          textReport += '\n' + '━'.repeat(80) + '\n';
          textReport += `📚 ${course.title}\n`;
          textReport += '━'.repeat(80) + '\n';
          courseHasQuizzes = true;
        }
        
        textReport += `\n📋 ${lesson.title}\n`;
        textReport += '─'.repeat(60) + '\n';
        
        for (let q = 0; q < lesson.questions.length; q++) {
          const question = lesson.questions[q];
          const opts = question.options || [];
          const correctIdx = question.correctAnswer;
          const isMulti = Array.isArray(correctIdx);
          
          textReport += `\n${q + 1}. ${question.question}\n`;
          
          opts.forEach((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            let marker = '   ';
            
            if (isMulti) {
              if (correctIdx.includes(i)) marker = ' ✓ ';
            } else {
              if (i === correctIdx) marker = ' ✓ ';
            }
            
            textReport += `   ${marker}${letter}) ${opt}\n`;
          });
          
          if (isMulti) {
            textReport += `   [MULTI-SELECT: ${correctIdx.map(i => String.fromCharCode(65 + i)).join(', ')}]\n`;
          }
        }
      }
    }
  }
  
  const textPath = '/tmp/all-quiz-questions.txt';
  fs.writeFileSync(textPath, textReport);
  
  console.log('\n========================================');
  console.log(`✅ Exported ${totalQuestions} questions`);
  console.log(`📄 CSV: ${csvPath}`);
  console.log(`📄 Text: ${textPath}`);
  console.log('========================================\n');
  
  // Print instructions
  console.log('To download these files, run:');
  console.log('  cat /tmp/all-quiz-questions.csv');
  console.log('  cat /tmp/all-quiz-questions.txt');
  console.log('\nOr copy them to your local machine.\n');
  
  await mongoose.disconnect();
}

exportQuestions()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
