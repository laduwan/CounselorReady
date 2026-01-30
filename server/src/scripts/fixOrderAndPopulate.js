import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

async function fixAndPopulate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!\n');

  const course = await Course.findOne({ slug: 'active-listening-skills' });
  if (!course) {
    console.log('Course not found');
    process.exit(1);
  }

  console.log('Found: ' + course.title);

  course.description = 'This course provides mental health professionals with foundational knowledge and practical skills in active listening.';
  course.targetAudience = 'Licensed Professional Counselors, LCSWs, MFTs, Psychologists';
  course.learningObjectives = [
    'Define active listening and differentiate it from passive hearing',
    'Identify the six core components of active listening',
    'Apply active listening in challenging clinical situations',
    'Recognize barriers to active listening'
  ];
  course.providerNumber = '7760';
  course.passingScore = 80;

  course.modules = [
    {
      title: 'Module 1: Understanding Active Listening',
      order: 0,
      lessons: [
        { title: 'What is Active Listening?', type: 'text', order: 0, content: '# What is Active Listening?\n\nActive listening is a deliberate process of fully engaging with communication.' },
        { title: 'Core Components', type: 'text', order: 1, content: '# Core Components\n\nSOLER Framework and six key skills.' }
      ]
    },
    {
      title: 'Module 2: Applying Active Listening',
      order: 1,
      lessons: [
        { title: 'Practical Techniques', type: 'text', order: 0, content: '# Practical Techniques\n\nThe 3-second pause and theme tracking.' },
        { title: 'Challenging Situations', type: 'text', order: 1, content: '# Challenging Situations\n\nWorking with silence and high emotion.' }
      ]
    }
  ];

  course.finalExam = [
    { question: 'What does L in SOLER stand for?', options: ['Listen', 'Lean forward', 'Look', 'Lead'], correctAnswer: 1, explanation: 'Lean forward.' },
    { question: 'Rogers identified how many core conditions?', options: ['2', '3', '4', '5'], correctAnswer: 1, explanation: 'Three conditions.' },
    { question: 'Reflection of feeling focuses on?', options: ['Content', 'Emotions', 'Behavior', 'History'], correctAnswer: 1, explanation: 'Emotions.' },
    { question: '3-second pause helps?', options: ['Plan', 'Ensure client finished', 'Drama', 'Notes'], correctAnswer: 1, explanation: 'Ensure finished.' },
    { question: 'With high emotion, you should?', options: ['Change subject', 'Reassure', 'Stay grounded', 'End session'], correctAnswer: 2, explanation: 'Stay grounded.' },
    { question: 'Telehealth needs?', options: ['Fewer encouragers', 'More encouragers', 'No encouragers', 'Written only'], correctAnswer: 1, explanation: 'More verbal encouragers.' },
    { question: 'Parroting means?', options: ['Talking too much', 'Repeating verbatim', 'Too many encouragers', 'Closed questions'], correctAnswer: 1, explanation: 'Repeating verbatim.' },
    { question: 'Alliance predicts what % of outcome?', options: ['10%', '20%', '30%', '50%'], correctAnswer: 2, explanation: 'About 30%.' },
    { question: 'E in SOLER?', options: ['Engage', 'Eye contact', 'Empathize', 'Evaluate'], correctAnswer: 1, explanation: 'Eye contact.' },
    { question: 'Processing silence means client is?', options: ['Difficult', 'Integrating', 'Disengaged', 'Done'], correctAnswer: 1, explanation: 'Integrating insights.' },
    { question: 'Reassurance reflex is bad because?', options: ['Never appropriate', 'Minimizes experience', 'Takes time', 'Clients dislike'], correctAnswer: 1, explanation: 'Minimizes.' },
    { question: 'Theme tracking involves?', options: ['Memorizing all', 'Recurring patterns', 'Detailed notes', 'Only presenting problem'], correctAnswer: 1, explanation: 'Patterns.' },
    { question: 'Co-regulation means?', options: ['Suppression', 'Your calm helps client regulate', 'Emotions unimportant', 'Distraction'], correctAnswer: 1, explanation: 'Your regulation helps theirs.' },
    { question: 'Best skill development?', options: ['Reading', 'Videos', 'Deliberate practice with supervision', 'Talent'], correctAnswer: 2, explanation: 'Practice with feedback.' },
    { question: 'Active listening builds?', options: ['Nothing', 'Alliance predicting outcomes', 'Only person-centered', 'Compliance'], correctAnswer: 1, explanation: 'Alliance.' }
  ];

  await course.save();
  console.log('SUCCESS: Active Listening course updated!');
  await mongoose.disconnect();
}

fixAndPopulate().catch(console.error);
