// fixConfusingQuestions.cjs
// Fixes specific confusing quiz questions
// Run: node src/scripts/fixConfusingQuestions.cjs

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Questions to fix - identified as confusing
const questionFixes = [
  {
    coursePattern: /Mastering TeleMental/i,
    quizPattern: /Module 1 Quiz/i,
    oldQuestion: "Which of the following is NOT a key requirement under HIPAA for telemental health?",
    newQuestion: "Which of the following IS a key HIPAA requirement for telemental health?",
    newOptions: [
      "Sharing client information freely with other professionals",
      "Using encryption and secure storage to protect patient information",
      "Using any video conferencing tool available",
      "Conducting teletherapy without encryption"
    ],
    newCorrectAnswer: 1, // "Using encryption..." is correct
    explanation: "HIPAA requires protecting patient information through encryption and secure storage. The other options represent violations or poor practices."
  },
  // Add more question fixes here as needed
];

async function fixQuestions() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!\n');
  
  const db = mongoose.connection.db;
  const coursesCollection = db.collection('courses');
  
  let totalFixed = 0;
  
  for (const fix of questionFixes) {
    console.log(`\n🔍 Looking for: "${fix.oldQuestion.substring(0, 50)}..."`);
    
    const courses = await coursesCollection.find({ title: fix.coursePattern }).toArray();
    
    for (const course of courses) {
      if (!course.modules) continue;
      
      for (let m = 0; m < course.modules.length; m++) {
        const module = course.modules[m];
        if (!module.lessons) continue;
        
        for (let l = 0; l < module.lessons.length; l++) {
          const lesson = module.lessons[l];
          
          if (lesson.type !== 'quiz') continue;
          if (!fix.quizPattern.test(lesson.title)) continue;
          if (!lesson.questions) continue;
          
          for (let q = 0; q < lesson.questions.length; q++) {
            const question = lesson.questions[q];
            
            if (question.question === fix.oldQuestion || 
                question.question.includes(fix.oldQuestion.substring(0, 40))) {
              
              console.log(`   ✅ Found in: ${course.title.substring(0, 40)}...`);
              console.log(`      Quiz: ${lesson.title}`);
              console.log(`      Question ${q + 1}`);
              
              // Update the question
              const updatePath = `modules.${m}.lessons.${l}.questions.${q}`;
              await coursesCollection.updateOne(
                { _id: course._id },
                { 
                  $set: { 
                    [`${updatePath}.question`]: fix.newQuestion,
                    [`${updatePath}.options`]: fix.newOptions,
                    [`${updatePath}.correctAnswer`]: fix.newCorrectAnswer,
                    [`${updatePath}.explanation`]: fix.explanation
                  } 
                }
              );
              
              console.log(`      ✅ FIXED!`);
              console.log(`      Old: "${fix.oldQuestion.substring(0, 50)}..."`);
              console.log(`      New: "${fix.newQuestion.substring(0, 50)}..."`);
              totalFixed++;
            }
          }
        }
      }
    }
  }
  
  console.log('\n========================================');
  console.log(`✅ Fixed ${totalFixed} confusing questions`);
  console.log('========================================\n');
  
  await mongoose.disconnect();
}

fixQuestions()
  .then(() => {
    console.log('Complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
