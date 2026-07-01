// fixConfusingQuestions.cjs
// Fixes specific confusing quiz questions
// Run: node src/scripts/fixConfusingQuestions.cjs

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Questions to fix - identified as confusing
const questionFixes = [
  {
    coursePattern: /Mastering TeleMental/i,
    quizPattern: /Module 2 Quiz/i,
    oldQuestion: "Which of the following is NOT a key requirement under HIPAA for telemental health?",
    newQuestion: "Which of the following IS a key HIPAA requirement for telemental health?",
    newOptions: [
      "Sharing client information freely with other professionals",
      "Using encryption and secure storage to protect patient information",
      "Using any video conferencing tool available",
      "Conducting teletherapy without encryption"
    ],
    newCorrectAnswer: 1,
    explanation: "HIPAA requires protecting patient information through encryption and secure storage. The other options represent violations or poor practices."
  },
  {
    coursePattern: /Mirror.*Therapeutic/i,
    quizPattern: /Course Assessment/i,
    oldQuestion: "Which is NOT a Bordin alliance component?",
    newQuestion: "Which of the following IS one of Bordin's three working alliance components?",
    newOptions: [
      "Interpretation",
      "Bond",
      "Goals",
      "Tasks"
    ],
    newCorrectAnswer: 1, // Bond is a component (along with Goals and Tasks)
    explanation: "Bordin identified three components of the working alliance: Bond (the emotional connection), Goals (agreement on treatment objectives), and Tasks (agreement on therapeutic activities). Interpretation is a technique, not an alliance component."
  },
  {
    coursePattern: /Mirror.*Therapeutic/i,
    quizPattern: /Course Assessment/i,
    oldQuestion: "Which is NOT a Rogers' core condition?",
    newQuestion: "Which of the following IS one of Carl Rogers' core conditions for therapeutic change?",
    newOptions: [
      "Interpretation",
      "Empathy",
      "Unconditional Positive Regard",
      "Genuineness"
    ],
    newCorrectAnswer: 1, // Empathy is a core condition
    explanation: "Rogers identified three core conditions: Empathy, Unconditional Positive Regard (UPR), and Genuineness/Congruence. Interpretation is a psychodynamic technique, not a Rogerian core condition."
  },
  {
    coursePattern: /Elephant.*Trauma/i,
    quizPattern: /Course Assessment/i,
    oldQuestion: "Which is NOT one of SAMHSA's Four Rs?",
    newQuestion: "Which of the following IS one of SAMHSA's Four Rs of trauma-informed care?",
    newOptions: [
      "Rescue",
      "Realize",
      "Recognize",
      "Respond"
    ],
    newCorrectAnswer: 1, // Realize is one of the Four Rs
    explanation: "SAMHSA's Four Rs are: Realize (understand trauma's impact), Recognize (identify signs), Respond (apply TIC principles), and Resist Re-traumatization. 'Rescue' is not one of the Four Rs."
  },
  {
    coursePattern: /Stop.*Drop.*Roll.*Crisis/i,
    quizPattern: /Course Assessment/i,
    oldQuestion: "Documentation should NOT include:",
    newQuestion: "Which of the following should be INCLUDED in crisis documentation?",
    newOptions: [
      "Personal opinions about the client's character",
      "Risk assessment findings and clinical reasoning",
      "Speculation about future behavior",
      "Judgmental language about client choices"
    ],
    newCorrectAnswer: 1,
    explanation: "Crisis documentation should include objective risk assessment findings, clinical reasoning, interventions used, and safety plan details. Personal opinions, speculation, and judgmental language should be avoided."
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
