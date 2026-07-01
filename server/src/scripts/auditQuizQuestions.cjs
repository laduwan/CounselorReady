// auditQuizQuestions.cjs
// Audits all quiz questions for potential issues
// Run: node src/scripts/auditQuizQuestions.cjs

const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;

// Patterns that often indicate confusing questions
const redFlags = {
  negativeWording: [
    /\bNOT\b/,
    /\bEXCEPT\b/,
    /\bnot\s+a\b/i,
    /\bnone\s+of\b/i,
    /\bwouldn't\b/i,
    /\bshouldn't\b/i,
    /\bisn't\b/i,
    /\baren't\b/i,
    /\bdoes\s+not\b/i,
    /\bdo\s+not\b/i,
    /\bincorrect\b/i,
    /\bfalse\b/i,
    /\bwrong\b/i,
  ],
  doubleNegatives: [
    /not.*not/i,
    /never.*not/i,
    /NOT.*incorrect/i,
    /NOT.*false/i,
  ],
  allOfAbove: [
    /all\s+of\s+the\s+above/i,
    /none\s+of\s+the\s+above/i,
    /both\s+a\s+and\s+b/i,
    /a\s+and\s+b\s+only/i,
  ],
  vagueWording: [
    /\bsometimes\b/i,
    /\busually\b/i,
    /\boften\b/i,
    /\brarely\b/i,
    /\bmay\s+or\s+may\s+not\b/i,
    /\bcould\s+be\b/i,
  ],
  extremeWording: [
    /\balways\b/i,
    /\bnever\b/i,
    /\bevery\b/i,
    /\ball\b/i,
    /\bnone\b/i,
    /\bonly\b/i,
  ]
};

async function auditQuestions() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!\n');
  
  const db = mongoose.connection.db;
  const coursesCollection = db.collection('courses');
  
  const courses = await coursesCollection.find({}).toArray();
  
  const issues = [];
  let totalQuestions = 0;
  
  for (const course of courses) {
    if (!course.modules) continue;
    
    for (const module of course.modules) {
      if (!module.lessons) continue;
      
      for (const lesson of module.lessons) {
        if (lesson.type !== 'quiz' || !lesson.questions) continue;
        
        for (let q = 0; q < lesson.questions.length; q++) {
          const question = lesson.questions[q];
          totalQuestions++;
          
          const questionIssues = [];
          
          // Check for negative wording
          for (const pattern of redFlags.negativeWording) {
            if (pattern.test(question.question)) {
              questionIssues.push('⚠️ NEGATIVE WORDING (NOT/EXCEPT)');
              break;
            }
          }
          
          // Check for double negatives
          for (const pattern of redFlags.doubleNegatives) {
            if (pattern.test(question.question)) {
              questionIssues.push('🚨 DOUBLE NEGATIVE');
              break;
            }
          }
          
          // Check for "all of the above" type answers
          for (const option of (question.options || [])) {
            for (const pattern of redFlags.allOfAbove) {
              if (pattern.test(option)) {
                questionIssues.push('⚠️ "ALL OF ABOVE" OPTION');
                break;
              }
            }
          }
          
          // Check if correct answer seems like a "wrong" option
          const correctIdx = question.correctAnswer;
          if (typeof correctIdx === 'number' && question.options?.[correctIdx]) {
            const correctOption = question.options[correctIdx];
            // If the question asks what's NOT correct, but the answer sounds positive
            if (/\bNOT\b/.test(question.question)) {
              questionIssues.push('🔍 REVIEW: NOT question - verify answer is truly incorrect');
            }
          }
          
          // Check for multiple potentially correct answers in NOT questions
          if (/\bNOT\b/.test(question.question) && question.options) {
            const negativeOptions = question.options.filter(opt => 
              /\bwithout\b/i.test(opt) || 
              /\bfreely\b/i.test(opt) ||
              /\bany\b/i.test(opt) ||
              /\bno\b/i.test(opt)
            );
            if (negativeOptions.length > 1) {
              questionIssues.push('🚨 MULTIPLE NEGATIVE OPTIONS in NOT question');
            }
          }
          
          // Check for very short questions (might lack context)
          if (question.question.length < 30) {
            questionIssues.push('⚠️ VERY SHORT QUESTION');
          }
          
          // Check for answer index issues
          if (question.correctAnswer === undefined || question.correctAnswer === null) {
            questionIssues.push('🚨 NO CORRECT ANSWER SET');
          } else if (question.correctAnswer >= (question.options?.length || 0)) {
            questionIssues.push('🚨 CORRECT ANSWER INDEX OUT OF RANGE');
          }
          
          // If issues found, add to report
          if (questionIssues.length > 0) {
            issues.push({
              course: course.title.substring(0, 50),
              quiz: lesson.title,
              questionNum: q + 1,
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
              correctText: question.options?.[question.correctAnswer] || 'N/A',
              issues: questionIssues
            });
          }
        }
      }
    }
  }
  
  // Print report
  console.log('========================================');
  console.log('        QUIZ QUESTION AUDIT REPORT');
  console.log('========================================\n');
  console.log(`Total questions scanned: ${totalQuestions}`);
  console.log(`Questions with issues: ${issues.length}`);
  console.log(`Issue rate: ${((issues.length / totalQuestions) * 100).toFixed(1)}%\n`);
  
  // Group by severity
  const critical = issues.filter(i => i.issues.some(x => x.startsWith('🚨')));
  const warnings = issues.filter(i => !i.issues.some(x => x.startsWith('🚨')));
  
  if (critical.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (require immediate fix):');
    console.log('─'.repeat(50));
    critical.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. ${issue.course}...`);
      console.log(`   Quiz: ${issue.quiz}`);
      console.log(`   Q${issue.questionNum}: "${issue.question.substring(0, 60)}..."`);
      console.log(`   Correct: (${issue.correctAnswer}) ${issue.correctText?.substring(0, 40)}...`);
      console.log(`   Issues: ${issue.issues.join(', ')}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n\n⚠️ WARNINGS (review recommended):');
    console.log('─'.repeat(50));
    warnings.slice(0, 20).forEach((issue, idx) => {
      console.log(`\n${idx + 1}. ${issue.course}...`);
      console.log(`   Quiz: ${issue.quiz}`);
      console.log(`   Q${issue.questionNum}: "${issue.question.substring(0, 60)}..."`);
      console.log(`   Issues: ${issue.issues.join(', ')}`);
    });
    if (warnings.length > 20) {
      console.log(`\n   ... and ${warnings.length - 20} more warnings`);
    }
  }
  
  // Save full report to file
  const reportPath = '/tmp/quiz-audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
  console.log(`\n\n📄 Full report saved to: ${reportPath}`);
  
  console.log('\n========================================');
  console.log('              AUDIT COMPLETE');
  console.log('========================================\n');
  
  await mongoose.disconnect();
}

auditQuestions()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
