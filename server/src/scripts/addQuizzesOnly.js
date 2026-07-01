/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * ADD QUIZZES ONLY - Does NOT modify lesson content
 * This script surgically adds knowledge checks and final exam
 * to the Active Listening course without touching existing content.
 * 
 * Run: node src/scripts/addQuizzesOnly.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

async function addQuizzesOnly() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database\n');

  const db = mongoose.connection.db;
  const coursesCollection = db.collection('courses');

  // Find the course
  const course = await coursesCollection.findOne({ slug: 'active-listening-skills' });
  if (!course) {
    console.log('Course not found!');
    process.exit(1);
  }

  console.log('Found:', course.title);
  console.log('Current modules:', course.modules?.length);
  console.log('Current final exam questions:', course.assessment?.questions?.length || 0);

  // ============================================
  // MODULE 1 KNOWLEDGE CHECK (5 questions)
  // ============================================
  const module1Questions = [
    {
      question: 'In the SOLER framework for attending behaviors, what does the "O" stand for?',
      type: 'multiple_choice',
      options: [
        { text: 'Observe carefully', isCorrect: false },
        { text: 'Open posture', isCorrect: true },
        { text: 'Orient toward client', isCorrect: false },
        { text: 'Offer feedback', isCorrect: false }
      ],
      explanation: 'In the SOLER framework, O stands for Open posture—avoiding crossed arms or other closed positions that might signal defensiveness.',
      points: 1
    },
    {
      question: 'According to Carl Rogers, empathic listening is one of how many core conditions necessary for therapeutic change?',
      type: 'multiple_choice',
      options: [
        { text: 'Two', isCorrect: false },
        { text: 'Three', isCorrect: true },
        { text: 'Four', isCorrect: false },
        { text: 'Five', isCorrect: false }
      ],
      explanation: 'Carl Rogers identified three core conditions: empathy, unconditional positive regard, and congruence (genuineness).',
      points: 1
    },
    {
      question: 'Which response demonstrates reflection of feeling rather than paraphrasing?',
      type: 'multiple_choice',
      options: [
        { text: 'So you are saying the situation at work has been difficult.', isCorrect: false },
        { text: 'It sounds like you have been dealing with a lot of stress lately.', isCorrect: false },
        { text: 'You feel frustrated and unappreciated when your contributions go unrecognized.', isCorrect: true },
        { text: 'Let me make sure I understand—your manager has not acknowledged your work.', isCorrect: false }
      ],
      explanation: 'Reflection of feeling specifically names the emotions ("frustrated and unappreciated"), while paraphrasing restates content.',
      points: 1
    },
    {
      question: 'Why should clinicians use minimal encouragers sparingly?',
      type: 'multiple_choice',
      options: [
        { text: 'They are considered unprofessional', isCorrect: false },
        { text: 'Overuse can feel mechanical or dismissive', isCorrect: true },
        { text: 'They interrupt the client\'s thought process', isCorrect: false },
        { text: 'Research shows they are ineffective', isCorrect: false }
      ],
      explanation: 'While minimal encouragers are valuable, overuse can feel mechanical or dismissive, as if going through the motions.',
      points: 1
    },
    {
      question: 'The therapeutic alliance accounts for approximately what percentage of treatment outcome variance?',
      type: 'multiple_choice',
      options: [
        { text: '10%', isCorrect: false },
        { text: '20%', isCorrect: false },
        { text: '30%', isCorrect: true },
        { text: '50%', isCorrect: false }
      ],
      explanation: 'Horvath and Symonds\' meta-analysis found that the therapeutic alliance accounts for approximately 30% of outcome variance.',
      points: 1
    }
  ];

  // ============================================
  // MODULE 2 KNOWLEDGE CHECK (5 questions)
  // ============================================
  const module2Questions = [
    {
      question: 'The "3-second pause" technique is primarily used to:',
      type: 'multiple_choice',
      options: [
        { text: 'Give the clinician time to plan an intervention', isCorrect: false },
        { text: 'Ensure the client has finished speaking and allow processing time', isCorrect: true },
        { text: 'Create dramatic effect in the conversation', isCorrect: false },
        { text: 'Allow the clinician to check their notes', isCorrect: false }
      ],
      explanation: 'The pause ensures the client has finished, gives processing time, demonstrates thoughtfulness, and prevents interrupting.',
      points: 1
    },
    {
      question: 'When a client becomes highly emotional during session, the clinician should:',
      type: 'multiple_choice',
      options: [
        { text: 'Quickly change the subject to help calm them down', isCorrect: false },
        { text: 'Offer reassurance that everything will be okay', isCorrect: false },
        { text: 'Stay present and grounded, allowing the emotion to move through', isCorrect: true },
        { text: 'End the session early to give the client time to compose themselves', isCorrect: false }
      ],
      explanation: 'Stay present and grounded, maintain calm steady presence. Emotions need to be witnessed, not managed.',
      points: 1
    },
    {
      question: 'The "Columbo approach" to active listening refers to:',
      type: 'multiple_choice',
      options: [
        { text: 'Asking rapid-fire questions to gather information quickly', isCorrect: false },
        { text: 'Approaching clients with genuine curiosity rather than expertise', isCorrect: true },
        { text: 'Catching clients in inconsistencies in their stories', isCorrect: false },
        { text: 'Using silence as an interrogation technique', isCorrect: false }
      ],
      explanation: 'The Columbo approach means approaching with genuine curiosity rather than expertise, creating safety and eliciting richer information.',
      points: 1
    },
    {
      question: 'When client material triggers your own personal history, you should:',
      type: 'multiple_choice',
      options: [
        { text: 'Share your own experience to build rapport', isCorrect: false },
        { text: 'Ground yourself, refocus on the client, and process in supervision later', isCorrect: true },
        { text: 'Immediately refer the client to another therapist', isCorrect: false },
        { text: 'Suppress the reaction and continue as if nothing happened', isCorrect: false }
      ],
      explanation: 'Ground yourself, refocus on the client, use the reaction as clinical data, and process in supervision afterward.',
      points: 1
    },
    {
      question: 'In telehealth sessions, clinicians should:',
      type: 'multiple_choice',
      options: [
        { text: 'Use fewer verbal encouragers since the client can see them', isCorrect: false },
        { text: 'Use more verbal encouragers since nonverbal cues are harder to see', isCorrect: true },
        { text: 'Avoid eye contact to reduce screen fatigue', isCorrect: false },
        { text: 'Speak more quickly to maintain engagement', isCorrect: false }
      ],
      explanation: 'Use more verbal encouragers in telehealth because nonverbal cues are harder to see through a screen.',
      points: 1
    }
  ];

  // ============================================
  // FINAL EXAM (16 questions - comprehensive)
  // ============================================
  const finalExamQuestions = [
    {
      question: 'Active listening is best defined as:',
      type: 'multiple_choice',
      options: [
        { text: 'Waiting quietly for your turn to speak', isCorrect: false },
        { text: 'A deliberate, focused process of fully engaging with verbal and nonverbal communication', isCorrect: true },
        { text: 'Repeating back exactly what the client said', isCorrect: false },
        { text: 'Asking as many questions as possible to gather information', isCorrect: false }
      ],
      explanation: 'Active listening is a deliberate, focused process of fully engaging with verbal and nonverbal communication.',
      points: 1
    },
    {
      question: 'Which is NOT one of the six core components of active listening?',
      type: 'multiple_choice',
      options: [
        { text: 'Paraphrasing', isCorrect: false },
        { text: 'Interpretation', isCorrect: true },
        { text: 'Summarizing', isCorrect: false },
        { text: 'Minimal encouragers', isCorrect: false }
      ],
      explanation: 'The six components are: attending behaviors, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing.',
      points: 1
    },
    {
      question: 'What does the "E" in the SOLER framework stand for?',
      type: 'multiple_choice',
      options: [
        { text: 'Engage actively', isCorrect: false },
        { text: 'Eye contact', isCorrect: true },
        { text: 'Empathize deeply', isCorrect: false },
        { text: 'Evaluate content', isCorrect: false }
      ],
      explanation: 'E stands for Eye contact—maintaining comfortable, culturally appropriate eye contact.',
      points: 1
    },
    {
      question: 'The primary difference between paraphrasing and reflection of feeling is:',
      type: 'multiple_choice',
      options: [
        { text: 'Paraphrasing is longer than reflection of feeling', isCorrect: false },
        { text: 'Reflection of feeling names emotions while paraphrasing restates content', isCorrect: true },
        { text: 'Paraphrasing requires direct quotes', isCorrect: false },
        { text: 'Reflection of feeling is only used in psychodynamic therapy', isCorrect: false }
      ],
      explanation: 'Reflection of feeling names the emotions underlying words, while paraphrasing restates the message content.',
      points: 1
    },
    {
      question: 'Rogers\' three core conditions for therapeutic change include empathy, unconditional positive regard, and:',
      type: 'multiple_choice',
      options: [
        { text: 'Interpretation', isCorrect: false },
        { text: 'Congruence', isCorrect: true },
        { text: 'Assessment', isCorrect: false },
        { text: 'Boundaries', isCorrect: false }
      ],
      explanation: 'The three core conditions are empathy, unconditional positive regard, and congruence (genuineness).',
      points: 1
    },
    {
      question: 'Why should clinicians avoid "why" questions early in treatment?',
      type: 'multiple_choice',
      options: [
        { text: 'They are grammatically incorrect', isCorrect: false },
        { text: 'They can feel accusatory or push clients toward intellectualization', isCorrect: true },
        { text: 'They take too long to answer', isCorrect: false },
        { text: 'They are not evidence-based', isCorrect: false }
      ],
      explanation: 'Why questions can feel accusatory or push clients toward intellectualization rather than emotional exploration.',
      points: 1
    },
    {
      question: 'Processing silence in therapy may indicate that the client is:',
      type: 'multiple_choice',
      options: [
        { text: 'Being deliberately difficult', isCorrect: false },
        { text: 'Integrating insights or formulating thoughts', isCorrect: true },
        { text: 'Not engaged in therapy', isCorrect: false },
        { text: 'Ready to terminate treatment', isCorrect: false }
      ],
      explanation: 'Processing silence often indicates the client is integrating insights, formulating thoughts, or experiencing intense emotions.',
      points: 1
    },
    {
      question: 'The "Parrot Trap" refers to:',
      type: 'multiple_choice',
      options: [
        { text: 'Talking too much during sessions', isCorrect: false },
        { text: 'Repeating client\'s words verbatim instead of paraphrasing', isCorrect: true },
        { text: 'Using too many minimal encouragers', isCorrect: false },
        { text: 'Asking closed-ended questions', isCorrect: false }
      ],
      explanation: 'The Parrot Trap is repeating exact words instead of paraphrasing in your own words to show genuine processing.',
      points: 1
    },
    {
      question: 'When clients express views that challenge your values, you should:',
      type: 'multiple_choice',
      options: [
        { text: 'Express disagreement immediately to maintain authenticity', isCorrect: false },
        { text: 'Refer the client to a different therapist', isCorrect: false },
        { text: 'Seek to understand their worldview while processing your reactions in supervision', isCorrect: true },
        { text: 'Avoid the topic entirely', isCorrect: false }
      ],
      explanation: 'Seek to understand the client\'s worldview, separate person from belief, and process your reactions in supervision.',
      points: 1
    },
    {
      question: 'The "Reassurance Reflex" is problematic because:',
      type: 'multiple_choice',
      options: [
        { text: 'Reassurance is never appropriate in therapy', isCorrect: false },
        { text: 'It minimizes the client\'s experience rather than validating difficulty', isCorrect: true },
        { text: 'It takes too much session time', isCorrect: false },
        { text: 'Clients don\'t like being reassured', isCorrect: false }
      ],
      explanation: 'The Reassurance Reflex minimizes experience. Better to validate: "This is really hard."',
      points: 1
    },
    {
      question: 'Theme tracking in active listening involves:',
      type: 'multiple_choice',
      options: [
        { text: 'Memorizing every detail the client shares', isCorrect: false },
        { text: 'Listening for recurring patterns in relationships, emotions, and reactions', isCorrect: true },
        { text: 'Keeping detailed written notes during session', isCorrect: false },
        { text: 'Focusing only on the presenting problem', isCorrect: false }
      ],
      explanation: 'Theme tracking means listening for recurring patterns rather than trying to remember every detail.',
      points: 1
    },
    {
      question: 'Active listening builds the therapeutic alliance, which research shows:',
      type: 'multiple_choice',
      options: [
        { text: 'Is helpful but not essential to outcomes', isCorrect: false },
        { text: 'Only matters in person-centered therapy', isCorrect: false },
        { text: 'Strongly predicts positive outcomes across all modalities', isCorrect: true },
        { text: 'Is less important than specific techniques', isCorrect: false }
      ],
      explanation: 'The therapeutic alliance strongly predicts outcomes across all therapy modalities.',
      points: 1
    },
    {
      question: 'When a client is highly emotional, the clinician\'s calm presence helps through:',
      type: 'multiple_choice',
      options: [
        { text: 'Modeling emotional suppression', isCorrect: false },
        { text: 'Co-regulation—your regulated state helps them regulate', isCorrect: true },
        { text: 'Signaling that emotions are not important', isCorrect: false },
        { text: 'Distracting the client from their feelings', isCorrect: false }
      ],
      explanation: 'Co-regulation: the clinician\'s calm, regulated state helps the client\'s nervous system settle.',
      points: 1
    },
    {
      question: 'The best approach to developing active listening skills is:',
      type: 'multiple_choice',
      options: [
        { text: 'Reading extensively about the topic', isCorrect: false },
        { text: 'Watching videos of expert therapists', isCorrect: false },
        { text: 'Deliberate practice with self-evaluation and supervision feedback', isCorrect: true },
        { text: 'Natural talent that cannot be developed', isCorrect: false }
      ],
      explanation: 'Active listening improves through deliberate practice, self-evaluation, and supervision feedback.',
      points: 1
    },
    {
      question: 'Cultural considerations in attending behaviors are important because:',
      type: 'multiple_choice',
      options: [
        { text: 'All clients prefer the same communication style', isCorrect: false },
        { text: 'Eye contact norms vary significantly across cultures', isCorrect: true },
        { text: 'Cultural factors don\'t affect nonverbal communication', isCorrect: false },
        { text: 'The SOLER framework is universally applicable', isCorrect: false }
      ],
      explanation: 'Eye contact norms vary across cultures—some clients may find direct eye contact disrespectful or uncomfortable.',
      points: 1
    },
    {
      question: 'A common barrier to active listening is:',
      type: 'multiple_choice',
      options: [
        { text: 'Using minimal encouragers', isCorrect: false },
        { text: 'Planning your response while the client is still speaking', isCorrect: true },
        { text: 'Paraphrasing too often', isCorrect: false },
        { text: 'Making eye contact', isCorrect: false }
      ],
      explanation: 'Planning your response while the client speaks splits attention and causes you to miss important information.',
      points: 1
    }
  ];

  // ============================================
  // APPLY UPDATES (surgical - only touch quiz fields)
  // ============================================
  
  const updateResult = await coursesCollection.updateOne(
    { slug: 'active-listening-skills' },
    {
      $set: {
        'modules.0.quizQuestions': module1Questions,
        'modules.0.hasQuiz': true,
        'modules.1.quizQuestions': module2Questions,
        'modules.1.hasQuiz': true,
        'assessment.questions': finalExamQuestions,
        'totalQuizQuestions': module1Questions.length + module2Questions.length + finalExamQuestions.length
      }
    }
  );

  console.log('\n✅ UPDATE COMPLETE');
  console.log('Matched:', updateResult.matchedCount);
  console.log('Modified:', updateResult.modifiedCount);
  
  // Verify
  const updated = await coursesCollection.findOne({ slug: 'active-listening-skills' });
  console.log('\nVerification:');
  console.log('- Module 1 quiz questions:', updated.modules[0].quizQuestions?.length || 0);
  console.log('- Module 1 hasQuiz:', updated.modules[0].hasQuiz);
  console.log('- Module 2 quiz questions:', updated.modules[1].quizQuestions?.length || 0);
  console.log('- Module 2 hasQuiz:', updated.modules[1].hasQuiz);
  console.log('- Final exam questions:', updated.assessment?.questions?.length || 0);
  console.log('- Total quiz questions:', updated.totalQuizQuestions);

  await mongoose.disconnect();
  console.log('\nDone!');
}

addQuizzesOnly().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
