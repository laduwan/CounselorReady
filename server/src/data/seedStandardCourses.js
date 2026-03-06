/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// seedStandardCourses.js
// Run with: node src/data/seedStandardCourses.js
// Place in: server/src/data/seedStandardCourses.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

// ===========================================
// STANDARD COURSES (10 courses, 30 CE hours, $39.99 each)
// ===========================================

const standardCourses = [
  // ============================================
  // COURSE 1: CBT Toolbox
  // ============================================
  {
    slug: 'cbt-toolbox-core-techniques',
    title: 'The CBT Toolbox: Core Techniques for Clinical Practice',
    subtitle: 'Master essential CBT techniques including cognitive restructuring, behavioral activation, and exposure therapy',
    description: 'Cognitive Behavioral Therapy remains one of the most researched and effective approaches in mental health treatment. This comprehensive 3-hour course provides clinicians with practical, immediately applicable CBT skills. Learn the cognitive model, identify and restructure cognitive distortions, implement behavioral interventions, and structure effective CBT sessions. Through expert instruction and video demonstrations, you\'ll develop the core competencies needed to effectively apply CBT with diverse client presentations.',
    thumbnail: '/images/courses/cbt-toolbox.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Explain the cognitive model and the relationship between thoughts, feelings, and behaviors',
      'Identify common cognitive distortions in client presentations',
      'Apply Socratic questioning techniques to examine automatic thoughts',
      'Implement behavioral activation strategies for depression',
      'Design and conduct exposure hierarchies for anxiety disorders',
      'Utilize cognitive restructuring worksheets effectively',
      'Structure CBT sessions using evidence-based formats',
      'Adapt core CBT techniques for different presenting problems'
    ],
    modules: [
      {
        title: 'The Cognitive Model',
        order: 1,
        objectives: ['Understand the ABC model and cognitive theory'],
        lessons: [
          { title: 'Understanding the ABC Model', type: 'video', content: 'Introduction to the cognitive model and the relationship between activating events, beliefs, and consequences.', videoUrl: 'https://www.youtube.com/watch?v=ZdyOwZ4_RnI', duration: 14, order: 1 }
        ]
      },
      {
        title: 'Identifying Cognitive Distortions',
        order: 2,
        objectives: ['Recognize common cognitive distortions'],
        lessons: [
          { title: 'The 12 Major Cognitive Distortions', type: 'video', content: 'Comprehensive overview of cognitive distortions including all-or-nothing thinking, catastrophizing, and mind reading.', videoUrl: 'https://www.youtube.com/watch?v=7XFLTDQ4JMk', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Socratic Questioning',
        order: 3,
        objectives: ['Apply Socratic questioning in session'],
        lessons: [
          { title: 'The Art of Guided Discovery', type: 'video', content: 'Master Socratic questioning techniques to help clients examine and challenge their thoughts.', videoUrl: 'https://www.youtube.com/watch?v=V5eLt7hy32g', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Behavioral Interventions',
        order: 4,
        objectives: ['Implement behavioral activation and exposure'],
        lessons: [
          { title: 'Behavioral Activation for Depression', type: 'video', content: 'Learn to implement behavioral activation strategies to combat depression through scheduled activities.', videoUrl: 'https://www.youtube.com/watch?v=R0pIvXHwUe0', duration: 15, order: 1 },
          { title: 'Exposure Therapy Principles', type: 'video', content: 'Understanding habituation, building hierarchies, and conducting effective exposures.', videoUrl: 'https://www.youtube.com/watch?v=LdyEJxvWqrs', duration: 17, order: 2 }
        ]
      },
      {
        title: 'Cognitive Restructuring in Practice',
        order: 5,
        objectives: ['Use thought records effectively'],
        lessons: [
          { title: 'The Thought Record', type: 'video', content: 'Using the 7-column thought record for systematic cognitive restructuring.', videoUrl: 'https://www.youtube.com/watch?v=g0wNvsGLOYA', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Structuring CBT Sessions',
        order: 6,
        objectives: ['Structure effective CBT sessions'],
        lessons: [
          { title: 'Session Structure and Key Principles', type: 'video', content: 'How to structure effective CBT sessions including agenda setting, homework review, and skill building.', videoUrl: 'https://www.youtube.com/watch?v=7Xs7ZxsCJow', duration: 12, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'In the cognitive model, the "B" in ABC stands for:', type: 'multiple_choice', options: ['Behavior', 'Beliefs', 'Brain', 'Baseline'], correctAnswer: 1, explanation: 'The B stands for Beliefs - the thoughts and interpretations we have about activating events.' },
              { question: 'Which cognitive distortion involves predicting the future negatively?', type: 'multiple_choice', options: ['Mind reading', 'Fortune telling', 'Labeling', 'Personalization'], correctAnswer: 1, explanation: 'Fortune telling involves predicting negative outcomes without evidence.' },
              { question: 'Behavioral activation is primarily used to treat:', type: 'multiple_choice', options: ['Anxiety disorders', 'Depression', 'Personality disorders', 'Psychosis'], correctAnswer: 1, explanation: 'Behavioral activation is an evidence-based treatment specifically for depression.' },
              { question: 'The purpose of Socratic questioning is to:', type: 'multiple_choice', options: ['Tell clients what to think', 'Guide clients to examine their own thoughts', 'Diagnose disorders', 'Assign homework'], correctAnswer: 1, explanation: 'Socratic questioning uses guided discovery to help clients examine their thoughts.' },
              { question: 'Exposure therapy works through the process of:', type: 'multiple_choice', options: ['Avoidance', 'Habituation', 'Suppression', 'Denial'], correctAnswer: 1, explanation: 'Exposure works through habituation - the natural decrease in anxiety with prolonged exposure.' },
              { question: 'All-or-nothing thinking is also known as:', type: 'multiple_choice', options: ['Catastrophizing', 'Black-and-white thinking', 'Mind reading', 'Overgeneralization'], correctAnswer: 1, explanation: 'All-or-nothing thinking involves seeing things in only two categories rather than on a continuum.' },
              { question: 'A thought record helps clients:', type: 'multiple_choice', options: ['Avoid negative thoughts', 'Identify and challenge automatic thoughts', 'Suppress emotions', 'Predict the future'], correctAnswer: 1, explanation: 'Thought records help clients identify, examine, and restructure automatic thoughts.' },
              { question: 'Core beliefs differ from automatic thoughts in that core beliefs are:', type: 'multiple_choice', options: ['Situation-specific', 'Deep, fundamental beliefs about self/world/others', 'Always accurate', 'Easy to change'], correctAnswer: 1, explanation: 'Core beliefs are deep, fundamental beliefs that shape how we interpret experiences.' },
              { question: 'In an exposure hierarchy, you should start with:', type: 'multiple_choice', options: ['The most feared item', 'Items rated around moderate fear (30-50 SUDS)', 'Only easy items forever', 'Random selection'], correctAnswer: 1, explanation: 'Starting with moderately challenging items builds confidence and momentum.' },
              { question: 'CBT sessions typically include all EXCEPT:', type: 'multiple_choice', options: ['Agenda setting', 'Homework review', 'Free association', 'Skill practice'], correctAnswer: 2, explanation: 'Free association is a psychoanalytic technique, not typically used in CBT.' },
              { question: 'Downward arrow technique is used to:', type: 'multiple_choice', options: ['Reduce anxiety quickly', 'Identify underlying core beliefs', 'Assign homework', 'End sessions'], correctAnswer: 1, explanation: 'The downward arrow asks "what would that mean?" repeatedly to uncover core beliefs.' },
              { question: 'Cognitive restructuring aims to:', type: 'multiple_choice', options: ['Eliminate all negative thoughts', 'Develop more balanced, accurate thinking', 'Think only positively', 'Avoid all emotions'], correctAnswer: 1, explanation: 'The goal is balanced, realistic thinking - not eliminating negative thoughts entirely.' },
              { question: 'Personalization as a cognitive distortion involves:', type: 'multiple_choice', options: ['Predicting the future', 'Taking excessive responsibility for external events', 'Reading others\' minds', 'Labeling oneself'], correctAnswer: 1, explanation: 'Personalization involves blaming yourself for things outside your control.' },
              { question: 'CBT is considered evidence-based because:', type: 'multiple_choice', options: ['It\'s been used for decades', 'Research supports its effectiveness', 'Therapists prefer it', 'It\'s easy to learn'], correctAnswer: 1, explanation: 'CBT has extensive research demonstrating its effectiveness across many conditions.' },
              { question: 'Intermediate beliefs include:', type: 'multiple_choice', options: ['Core beliefs only', 'Rules, attitudes, and assumptions', 'Automatic thoughts only', 'Behavioral responses'], correctAnswer: 1, explanation: 'Intermediate beliefs are the rules, attitudes, and assumptions derived from core beliefs.' },
              { question: 'Activity scheduling in behavioral activation involves:', type: 'multiple_choice', options: ['Avoiding all activities', 'Planning and engaging in valued activities', 'Only pleasurable activities', 'Random activity selection'], correctAnswer: 1, explanation: 'Behavioral activation systematically schedules meaningful and valued activities.' },
              { question: 'The "hot thought" in a thought record is:', type: 'multiple_choice', options: ['Any negative thought', 'The thought most connected to the emotional response', 'The first thought that occurs', 'A positive thought'], correctAnswer: 1, explanation: 'The hot thought is the automatic thought most strongly connected to the emotion.' },
              { question: 'Homework in CBT serves to:', type: 'multiple_choice', options: ['Test client compliance', 'Extend learning between sessions', 'Fill time', 'Reduce session frequency'], correctAnswer: 1, explanation: 'Homework helps clients practice skills and extend learning between sessions.' },
              { question: 'Emotional reasoning involves:', type: 'multiple_choice', options: ['Using logic to understand emotions', 'Taking feelings as evidence for facts', 'Avoiding emotions', 'Expressing emotions freely'], correctAnswer: 1, explanation: 'Emotional reasoning assumes that feelings reflect reality: "I feel it, so it must be true."' },
              { question: 'CBT was developed by:', type: 'multiple_choice', options: ['Sigmund Freud', 'Carl Rogers', 'Aaron Beck', 'B.F. Skinner'], correctAnswer: 2, explanation: 'Aaron Beck developed cognitive therapy, which evolved into CBT.' }
            ],
            shuffleQuestions: true,
            shuffleOptions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Cognitive behavior therapy: Basics and beyond (3rd ed.)', author: 'Beck, J. S.', year: 2021, source: 'Guilford Press' },
      { title: 'Cognitive therapy of depression', author: 'Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G.', year: 1979, source: 'Guilford Press' },
      { title: 'Feeling good: The new mood therapy', author: 'Burns, D. D.', year: 1980, source: 'William Morrow' },
      { title: 'Handbook of cognitive-behavioral therapies (3rd ed.)', author: 'Dobson, K. S. (Ed.)', year: 2010, source: 'Guilford Press' },
      { title: 'Mind over mood (2nd ed.)', author: 'Greenberger, D., & Padesky, C. A.', year: 2016, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 2: DBT Skills in Action
  // ============================================
  {
    slug: 'dbt-skills-in-action',
    title: 'DBT Skills in Action: Practical Applications for Emotional Dysregulation',
    subtitle: 'Master the four DBT skill modules: Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness',
    description: 'Dialectical Behavior Therapy has revolutionized treatment for emotional dysregulation. This practical 3-hour course teaches the four core DBT skill modules through expert instruction and video demonstrations. Whether you\'re implementing comprehensive DBT or integrating skills into existing practice, you\'ll learn to teach mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness to clients struggling with intense emotions.',
    thumbnail: '/images/courses/dbt-skills.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Explain the biosocial model of emotional dysregulation and dialectical philosophy',
      'Describe the structure and components of comprehensive DBT treatment',
      'Teach core mindfulness "what" and "how" skills to clients',
      'Implement distress tolerance techniques including TIPP and crisis survival skills',
      'Apply emotion regulation strategies including ABC PLEASE and opposite action',
      'Utilize interpersonal effectiveness skills (DEAR MAN, GIVE, FAST)',
      'Demonstrate validation at multiple levels in clinical interactions',
      'Integrate DBT skills into non-DBT treatment settings'
    ],
    modules: [
      {
        title: 'DBT Foundations',
        order: 1,
        lessons: [
          { title: 'What is DBT?', type: 'video', content: 'Introduction to DBT, the biosocial model, and dialectical philosophy.', videoUrl: 'https://www.youtube.com/watch?v=Stz--d17ID4', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Mindfulness Skills',
        order: 2,
        lessons: [
          { title: 'DBT Mindfulness Skills', type: 'video', content: 'The "what" and "how" skills of mindfulness and wise mind.', videoUrl: 'https://www.youtube.com/watch?v=_gPcDRVALVo', duration: 20, order: 1 }
        ]
      },
      {
        title: 'Distress Tolerance Skills',
        order: 3,
        lessons: [
          { title: 'TIPP Skills for Crisis', type: 'video', content: 'Changing body chemistry fast with Temperature, Intense exercise, Paced breathing, and Paired muscle relaxation.', videoUrl: 'https://www.youtube.com/watch?v=dKsdy6oGjGM', duration: 4, order: 1 },
          { title: 'Crisis Survival Skills', type: 'video', content: 'ACCEPTS, self-soothing, and radical acceptance for surviving crisis without making it worse.', videoUrl: 'https://www.youtube.com/watch?v=P8_lfJjPN5U', duration: 15, order: 2 }
        ]
      },
      {
        title: 'Emotion Regulation Skills',
        order: 4,
        lessons: [
          { title: 'Emotion Regulation Strategies', type: 'video', content: 'ABC PLEASE, check the facts, and opposite action for managing emotions.', videoUrl: 'https://www.youtube.com/watch?v=nFwAiO22g4Y', duration: 20, order: 1 }
        ]
      },
      {
        title: 'Interpersonal Effectiveness',
        order: 5,
        lessons: [
          { title: 'DEAR MAN Skills', type: 'video', content: 'Getting what you need in relationships while maintaining relationships and self-respect.', videoUrl: 'https://www.youtube.com/watch?v=osROod3Hmpg', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Validation and Integration',
        order: 6,
        lessons: [
          { title: 'The Six Levels of Validation', type: 'text', content: 'Using validation in DBT and integrating skills into non-DBT settings. Level 1: Being Present. Level 2: Accurate Reflection. Level 3: Articulating the Unverbalized. Level 4: Validation in Terms of Past History. Level 5: Validation in Terms of Present Context. Level 6: Radical Genuineness.', duration: 10, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'The biosocial model suggests emotional dysregulation results from:', type: 'multiple_choice', options: ['Biological vulnerability alone', 'Invalidating environment alone', 'Biological vulnerability plus invalidating environment', 'Poor willpower'], correctAnswer: 2 },
              { question: 'The core dialectic in DBT is:', type: 'multiple_choice', options: ['Past vs. future', 'Acceptance vs. change', 'Self vs. others', 'Thoughts vs. feelings'], correctAnswer: 1 },
              { question: 'DBT mindfulness "what" skills include:', type: 'multiple_choice', options: ['Non-judgmentally, one-mindfully, effectively', 'Observe, describe, participate', 'TIPP skills', 'DEAR MAN'], correctAnswer: 1 },
              { question: 'The "T" in TIPP stands for:', type: 'multiple_choice', options: ['Thinking', 'Temperature', 'Time-out', 'Talking'], correctAnswer: 1 },
              { question: 'ACCEPTS is an acronym for:', type: 'multiple_choice', options: ['Mindfulness skills', 'Distraction/crisis survival skills', 'Interpersonal effectiveness skills', 'Emotion regulation skills'], correctAnswer: 1 },
              { question: 'ABC PLEASE addresses:', type: 'multiple_choice', options: ['Crisis survival', 'Reducing emotional vulnerability', 'Asking for what you want', 'Mindful awareness'], correctAnswer: 1 },
              { question: 'Opposite Action involves:', type: 'multiple_choice', options: ['Doing the opposite of what others want', 'Acting opposite to emotion-driven urges when emotion doesn\'t fit facts', 'Opposing all change', 'Disagreeing with the therapist'], correctAnswer: 1 },
              { question: 'DEAR MAN is used for:', type: 'multiple_choice', options: ['Self-soothing', 'Getting objectives met in relationships', 'Crisis survival', 'Mindfulness'], correctAnswer: 1 },
              { question: 'The "V" in GIVE stands for:', type: 'multiple_choice', options: ['Victory', 'Validate', 'Value', 'Voice'], correctAnswer: 1 },
              { question: 'FAST skills help maintain:', type: 'multiple_choice', options: ['Relationships', 'Self-respect', 'Objectives', 'Distraction'], correctAnswer: 1 },
              { question: 'Level 4 validation involves:', type: 'multiple_choice', options: ['Paying attention', 'Accurate reflection', 'Validation in terms of past history', 'Radical genuineness'], correctAnswer: 2 },
              { question: 'Wise Mind is the synthesis of:', type: 'multiple_choice', options: ['Past and present', 'Emotion Mind and Reasonable Mind', 'Self and others', 'Thoughts and behaviors'], correctAnswer: 1 },
              { question: '"One-mindfully" means:', type: 'multiple_choice', options: ['Thinking about one thing', 'Doing one thing at a time with full attention', 'Having one goal', 'Using one skill'], correctAnswer: 1 },
              { question: 'Radical acceptance means:', type: 'multiple_choice', options: ['Approving of everything', 'Accepting reality as it is without fighting it', 'Giving up', 'Agreeing with everyone'], correctAnswer: 1 },
              { question: 'Check the Facts helps clients:', type: 'multiple_choice', options: ['Remember information', 'Verify whether their emotion fits the situation', 'Document progress', 'Communicate with others'], correctAnswer: 1 },
              { question: 'Comprehensive DBT includes:', type: 'multiple_choice', options: ['Individual therapy only', 'Skills group only', 'Individual therapy, skills group, phone coaching, and consultation team', 'Medication only'], correctAnswer: 2 },
              { question: 'Paced breathing involves:', type: 'multiple_choice', options: ['Breathing as fast as possible', 'Holding breath', 'Slow exhale longer than inhale', 'Only breathing through the nose'], correctAnswer: 2 },
              { question: 'DBT was developed by:', type: 'multiple_choice', options: ['Aaron Beck', 'Marsha Linehan', 'Albert Ellis', 'Carl Rogers'], correctAnswer: 1 },
              { question: 'The target hierarchy in DBT individual therapy prioritizes:', type: 'multiple_choice', options: ['Quality of life issues first', 'Life-threatening behaviors first', 'Therapy-interfering behaviors first', 'Skills acquisition first'], correctAnswer: 1 },
              { question: 'DBT skills can be used:', type: 'multiple_choice', options: ['Only in comprehensive DBT programs', 'Only with BPD clients', 'Integrated into non-DBT treatment settings', 'Only by certified DBT therapists'], correctAnswer: 2 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'DBT skills training manual (2nd ed.)', author: 'Linehan, M. M.', year: 2015, source: 'Guilford Press' },
      { title: 'Cognitive-behavioral treatment of borderline personality disorder', author: 'Linehan, M. M.', year: 1993, source: 'Guilford Press' },
      { title: 'The dialectical behavior therapy skills workbook (2nd ed.)', author: 'McKay, M., Wood, J. C., & Brantley, J.', year: 2019, source: 'New Harbinger' },
      { title: 'Doing dialectical behavior therapy: A practical guide', author: 'Koerner, K.', year: 2012, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 3: Motivational Interviewing
  // ============================================
  {
    slug: 'motivational-interviewing-art',
    title: 'The Art of Motivational Interviewing: Evoking Change Through Collaboration',
    subtitle: 'Master the collaborative approach of Motivational Interviewing to help clients resolve ambivalence',
    description: 'Why do some clients embrace change while others dig in their heels? Motivational Interviewing offers a collaborative, person-centered approach that honors client autonomy while skillfully evoking their own motivation to change. This practical 3-hour course teaches the spirit, principles, and techniques of MI through expert instruction and video demonstrations.',
    thumbnail: '/images/courses/motivational-interviewing.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Describe the spirit of MI and how it differs from traditional directive approaches',
      'Explain the four processes of MI: engaging, focusing, evoking, and planning',
      'Demonstrate the core skills of MI using the OARS acronym',
      'Recognize change talk and sustain talk in client statements',
      'Respond strategically to change talk to strengthen motivation',
      'Navigate discord (resistance) without damaging the therapeutic alliance',
      'Utilize the readiness ruler and other MI tools',
      'Integrate MI principles into various clinical contexts'
    ],
    modules: [
      {
        title: 'The Spirit of Motivational Interviewing',
        order: 1,
        lessons: [
          { title: 'What is Motivational Interviewing?', type: 'video', content: 'Introduction to MI, its spirit, and the righting reflex.', videoUrl: 'https://www.youtube.com/watch?v=s3MCJZ7OGRk', duration: 15, order: 1 }
        ]
      },
      {
        title: 'The Four Processes of MI',
        order: 2,
        lessons: [
          { title: 'MI Good Example', type: 'video', content: 'Demonstration of effective MI showing engagement, focusing, evoking, and planning.', videoUrl: 'https://www.youtube.com/watch?v=67I6g1I7Zao', duration: 6, order: 1 }
        ]
      },
      {
        title: 'OARS: The Core Skills',
        order: 3,
        lessons: [
          { title: 'OARS Skills in MI', type: 'video', content: 'Open questions, Affirmations, Reflections, and Summaries.', videoUrl: 'https://www.youtube.com/watch?v=URiKA7CKtfc', duration: 9, order: 1 }
        ]
      },
      {
        title: 'Change Talk and Sustain Talk',
        order: 4,
        lessons: [
          { title: 'Recognizing and Responding to Change Talk', type: 'video', content: 'DARN-CAT types of change talk and how to strengthen motivation.', videoUrl: 'https://www.youtube.com/watch?v=_KNIZ3LVnNU', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Navigating Discord',
        order: 5,
        lessons: [
          { title: 'MI with a Resistant Client', type: 'video', content: 'Rolling with discord and maintaining the alliance.', videoUrl: 'https://www.youtube.com/watch?v=2L0y0s-SoMc', duration: 10, order: 1 },
          { title: 'MI Full Session Demo', type: 'video', content: 'Complete MI conversation from beginning to end.', videoUrl: 'https://www.youtube.com/watch?v=1j4t2v5LGqM', duration: 15, order: 2 }
        ]
      },
      {
        title: 'Applying MI',
        order: 6,
        lessons: [
          { title: 'Integration and Clinical Applications', type: 'text', content: 'Using MI across various clinical contexts and presenting problems.', duration: 10, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'The four elements of MI spirit include all EXCEPT:', type: 'multiple_choice', options: ['Partnership', 'Confrontation', 'Compassion', 'Evocation'], correctAnswer: 1 },
              { question: 'The "righting reflex" refers to:', type: 'multiple_choice', options: ['The client\'s desire to be right', 'The practitioner\'s urge to fix or correct', 'A reflex tested in neurological exams', 'The tendency to change too quickly'], correctAnswer: 1 },
              { question: 'The four processes of MI in order are:', type: 'multiple_choice', options: ['Planning, evoking, focusing, engaging', 'Engaging, focusing, evoking, planning', 'Evoking, engaging, planning, focusing', 'Focusing, engaging, evoking, planning'], correctAnswer: 1 },
              { question: 'OARS stands for:', type: 'multiple_choice', options: ['Open questions, Affirmations, Reflections, Summaries', 'Observations, Arguments, Reasons, Strategies', 'Options, Alternatives, Resources, Solutions', 'Openness, Acceptance, Reflection, Support'], correctAnswer: 0 },
              { question: 'A double-sided reflection:', type: 'multiple_choice', options: ['Is said twice', 'Reflects both sides of ambivalence', 'Should be avoided', 'Focuses only on the negative'], correctAnswer: 1 },
              { question: 'The recommended ratio of reflections to questions in MI is:', type: 'multiple_choice', options: ['1:2 (more questions)', '1:1 (equal)', '2:1 or higher (more reflections)', 'Questions should not be used'], correctAnswer: 2 },
              { question: 'DARN-CAT stands for types of:', type: 'multiple_choice', options: ['Sustain talk', 'Change talk', 'Resistance', 'Discord'], correctAnswer: 1 },
              { question: 'When a client says "I want to quit smoking," this is:', type: 'multiple_choice', options: ['Sustain talk', 'Desire change talk', 'Commitment change talk', 'Discord'], correctAnswer: 1 },
              { question: 'When a client expresses discord, MI suggests:', type: 'multiple_choice', options: ['Confronting it directly', 'Rolling with it', 'Ignoring it', 'Ending the session'], correctAnswer: 1 },
              { question: '"Why are you at a 5 and not a 2?" is designed to:', type: 'multiple_choice', options: ['Make the client defensive', 'Evoke reasons for change', 'Challenge the rating', 'Assess psychopathology'], correctAnswer: 1 },
              { question: 'Discord in MI is seen as:', type: 'multiple_choice', options: ['Client pathology', 'A signal to adjust the practitioner\'s approach', 'Reason to terminate', 'Evidence of denial'], correctAnswer: 1 },
              { question: 'Mobilizing change talk (CAT) includes:', type: 'multiple_choice', options: ['Desire, Ability, Reasons', 'Commitment, Activation, Taking steps', 'Change, Action, Transformation', 'Confidence, Ambivalence, Thoughts'], correctAnswer: 1 },
              { question: 'Affirmations in MI should:', type: 'multiple_choice', options: ['Be excessive compliments', 'Recognize genuine client strengths and efforts', 'Always be positive regardless of accuracy', 'Avoid acknowledging effort'], correctAnswer: 1 },
              { question: 'The planning process should begin when:', type: 'multiple_choice', options: ['The first session', 'The client shows sufficient readiness', 'The practitioner decides', 'Ambivalence is still high'], correctAnswer: 1 },
              { question: '"Only you can decide whether to change" emphasizes:', type: 'multiple_choice', options: ['The practitioner\'s expertise', 'Client autonomy', 'The difficulty of change', 'Hopelessness'], correctAnswer: 1 },
              { question: 'Amplified reflection involves:', type: 'multiple_choice', options: ['Speaking louder', 'Slightly overstating to invite correction toward the middle', 'Repeating exactly what was said', 'Adding extensive interpretation'], correctAnswer: 1 },
              { question: 'Strategic open questions in MI are designed to:', type: 'multiple_choice', options: ['Get yes/no answers', 'Evoke change talk', 'Test knowledge', 'Confront denial'], correctAnswer: 1 },
              { question: 'In MI, the client is considered:', type: 'multiple_choice', options: ['The expert on themselves', 'In denial', 'Unable to change without direction', 'Less knowledgeable than the practitioner'], correctAnswer: 0 },
              { question: 'MI was developed by:', type: 'multiple_choice', options: ['Aaron Beck', 'William Miller and Stephen Rollnick', 'Marsha Linehan', 'Carl Rogers'], correctAnswer: 1 },
              { question: 'MI can be integrated:', type: 'multiple_choice', options: ['Only in substance abuse treatment', 'Only as a standalone approach', 'Into various clinical settings and approaches', 'Only with resistant clients'], correctAnswer: 2 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Motivational interviewing: Helping people change (3rd ed.)', author: 'Miller, W. R., & Rollnick, S.', year: 2013, source: 'Guilford Press' },
      { title: 'Building motivational interviewing skills (2nd ed.)', author: 'Rosengren, D. B.', year: 2018, source: 'Guilford Press' },
      { title: 'Motivational interviewing in health care', author: 'Rollnick, S., Miller, W. R., & Butler, C. C.', year: 2008, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 4: Trauma Foundations
  // ============================================
  {
    slug: 'trauma-informed-care-foundations',
    title: 'Foundations of Trauma-Informed Care: Assessment and Stabilization',
    subtitle: 'Learn trauma\'s impact on the brain, conduct sensitive assessments, and implement stabilization techniques',
    description: 'Trauma affects the majority of clients seeking mental health services. This comprehensive 3-hour course provides foundational knowledge for working with trauma survivors, including understanding trauma\'s impact on the brain and body, conducting sensitive assessments, establishing safety, and implementing stabilization techniques before any processing work begins.',
    thumbnail: '/images/courses/trauma-foundations.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Define trauma and differentiate between types (single-incident, complex, developmental, vicarious)',
      'Explain the neurobiological effects of trauma on the brain and nervous system',
      'Describe the window of tolerance and how it applies to clinical work',
      'Recognize PTSD and complex PTSD presentations',
      'Conduct trauma-informed assessments that minimize retraumatization',
      'Implement grounding techniques for dysregulated clients',
      'Apply phase-oriented treatment principles',
      'Establish safety and stabilization as foundations for recovery'
    ],
    modules: [
      {
        title: 'Understanding Trauma',
        order: 1,
        lessons: [
          { title: 'What is Trauma?', type: 'video', content: 'Types of trauma and why individual response varies.', videoUrl: 'https://www.youtube.com/watch?v=WJRSuis1z_w', duration: 12, order: 1 }
        ]
      },
      {
        title: 'The Neurobiology of Trauma',
        order: 2,
        lessons: [
          { title: 'How Trauma Gets Stuck in the Body', type: 'video', content: 'Brain structures and the trauma response.', videoUrl: 'https://www.youtube.com/watch?v=FeVfBLqkfGE', duration: 15, order: 1 },
          { title: 'The Window of Tolerance', type: 'video', content: 'Understanding optimal arousal zones and dysregulation.', videoUrl: 'https://www.youtube.com/watch?v=Wcm-1FBrFhA', duration: 9, order: 2 }
        ]
      },
      {
        title: 'Recognizing Trauma Presentations',
        order: 3,
        lessons: [
          { title: 'Complex PTSD Overview', type: 'video', content: 'PTSD vs Complex PTSD and presentations that may mask trauma.', videoUrl: 'https://www.youtube.com/watch?v=4APy8wP-edA', duration: 13, order: 1 }
        ]
      },
      {
        title: 'Grounding and Stabilization',
        order: 4,
        lessons: [
          { title: 'Grounding Techniques for PTSD', type: 'video', content: '5-4-3-2-1, body-based grounding, and orientation to present.', videoUrl: 'https://www.youtube.com/watch?v=RybY4zIecQ4', duration: 13, order: 1 },
          { title: 'Safe Place Visualization', type: 'video', content: 'Building internal resources for trauma recovery.', videoUrl: 'https://www.youtube.com/watch?v=sHp98rCCmhc', duration: 10, order: 2 }
        ]
      },
      {
        title: 'Pacing and Readiness',
        order: 5,
        lessons: [
          { title: 'Phases of Trauma Treatment', type: 'video', content: 'Signs of readiness for processing and the art of pacing.', videoUrl: 'https://www.youtube.com/watch?v=1Bh8eU4JBnY', duration: 8, order: 1 }
        ]
      },
      {
        title: 'Trauma-Informed Principles',
        order: 6,
        lessons: [
          { title: 'Creating Trauma-Informed Care', type: 'text', content: 'SAMHSA principles, avoiding retraumatization, and vicarious trauma.', duration: 10, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Trauma is best defined as:', type: 'multiple_choice', options: ['The event itself', 'The response to overwhelming experience', 'Only physical injury', 'Only childhood events'], correctAnswer: 1 },
              { question: 'Complex trauma differs from single-incident trauma in that it:', type: 'multiple_choice', options: ['Is less severe', 'Is repeated and often interpersonal', 'Only affects adults', 'Doesn\'t cause PTSD'], correctAnswer: 1 },
              { question: 'The amygdala\'s role in trauma is:', type: 'multiple_choice', options: ['Storing explicit memories', 'Logical reasoning', 'Threat detection and alarm response', 'Language processing'], correctAnswer: 2 },
              { question: 'The "window of tolerance" refers to:', type: 'multiple_choice', options: ['How much a client can remember', 'The optimal arousal zone for functioning', 'Tolerance for medication', 'Session length'], correctAnswer: 1 },
              { question: 'Hyperarousal symptoms include:', type: 'multiple_choice', options: ['Numbness and shutdown', 'Panic, hypervigilance, and racing thoughts', 'Depression only', 'Memory loss only'], correctAnswer: 1 },
              { question: 'Hypoarousal presents as:', type: 'multiple_choice', options: ['Panic and anxiety', 'Numbness, dissociation, and shutdown', 'Anger only', 'Hyperactivity'], correctAnswer: 1 },
              { question: 'Phase one of trauma treatment focuses on:', type: 'multiple_choice', options: ['Processing traumatic memories', 'Safety and stabilization', 'Termination', 'Medication only'], correctAnswer: 1 },
              { question: 'Grounding techniques are used to:', type: 'multiple_choice', options: ['Help clients return to present moment awareness', 'Process traumatic memories', 'Diagnose PTSD', 'Avoid discussing trauma'], correctAnswer: 0 },
              { question: 'The 5-4-3-2-1 technique uses:', type: 'multiple_choice', options: ['Counting backwards', 'Sensory awareness to anchor in the present', 'Medication', 'Hypnosis'], correctAnswer: 1 },
              { question: 'Before trauma processing, clients should:', type: 'multiple_choice', options: ['Have no coping skills', 'Have adequate stabilization and resources', 'Process immediately', 'Avoid all discussion of trauma'], correctAnswer: 1 },
              { question: 'Signs a client is NOT ready for trauma processing include:', type: 'multiple_choice', options: ['Stable life circumstances', 'Active suicidality or substance abuse', 'Strong coping skills', 'Stable therapeutic alliance'], correctAnswer: 1 },
              { question: '"Pendulation" in trauma work means:', type: 'multiple_choice', options: ['Using a pendulum', 'Moving between activation and resource', 'Avoiding all activation', 'Processing everything at once'], correctAnswer: 1 },
              { question: 'Complex PTSD includes all EXCEPT:', type: 'multiple_choice', options: ['Affect dysregulation', 'Negative self-concept', 'Only one symptom cluster', 'Relationship disturbances'], correctAnswer: 2 },
              { question: 'Vicarious trauma affects:', type: 'multiple_choice', options: ['Only direct trauma survivors', 'Helping professionals exposed to trauma material', 'No one', 'Only children'], correctAnswer: 1 },
              { question: 'Sessions should end with:', type: 'multiple_choice', options: ['Client in highest activation', 'Client regulated and grounded', 'Processing incomplete', 'No closure needed'], correctAnswer: 1 },
              { question: 'The hippocampus in trauma is affected by:', type: 'multiple_choice', options: ['Improved memory function', 'Damage from stress hormones affecting memory consolidation', 'No changes', 'Better time-stamping of memories'], correctAnswer: 1 },
              { question: 'Safe Place visualization is an example of:', type: 'multiple_choice', options: ['Trauma processing', 'Resource building', 'Diagnosis', 'Termination'], correctAnswer: 1 },
              { question: 'Trauma-informed assessment should:', type: 'multiple_choice', options: ['Push for all details immediately', 'Be conducted sensitively with client control', 'Avoid asking about trauma', 'Require detailed narratives in session one'], correctAnswer: 1 },
              { question: 'The container exercise teaches clients to:', type: 'multiple_choice', options: ['Store memories permanently', 'Mentally contain difficult material until ready to process', 'Forget trauma happened', 'Avoid therapy'], correctAnswer: 1 },
              { question: 'SAMHSA\'s trauma-informed principles include:', type: 'multiple_choice', options: ['Confrontation and exposure', 'Safety, trustworthiness, and empowerment', 'Avoiding all trauma discussion', 'Medication as first-line treatment'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'The body keeps the score', author: 'van der Kolk, B. A.', year: 2014, source: 'Viking' },
      { title: 'Trauma and recovery (Rev. ed.)', author: 'Herman, J. L.', year: 2015, source: 'Basic Books' },
      { title: 'Trauma and the body', author: 'Ogden, P., Minton, K., & Pain, C.', year: 2006, source: 'W.W. Norton' },
      { title: 'The developing mind (2nd ed.)', author: 'Siegel, D. J.', year: 2012, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 5: Treating Anxiety
  // ============================================
  {
    slug: 'treating-anxiety-evidence-based',
    title: 'Understanding and Treating Anxiety: Evidence-Based Approaches',
    subtitle: 'Master cognitive restructuring and exposure therapy for treating anxiety disorders',
    description: 'Anxiety disorders are the most common mental health conditions, affecting nearly 30% of adults at some point. This comprehensive 3-hour course provides clinicians with deep understanding of anxiety presentations and evidence-based treatment strategies including cognitive restructuring and exposure therapy—the gold standard treatment.',
    thumbnail: '/images/courses/treating-anxiety.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Differentiate between anxiety disorder presentations (GAD, panic, social anxiety, phobias)',
      'Explain the anxiety cycle and how avoidance maintains anxiety disorders',
      'Apply cognitive restructuring techniques for anxious thoughts',
      'Implement relaxation and physiological interventions appropriately',
      'Design exposure hierarchies collaboratively with clients',
      'Conduct exposure therapy following evidence-based principles',
      'Address safety behaviors and their role in maintaining anxiety',
      'Recognize treatment-resistant presentations'
    ],
    modules: [
      {
        title: 'Understanding Anxiety Disorders',
        order: 1,
        lessons: [
          { title: 'Anxiety Disorders Overview', type: 'video', content: 'Types of anxiety disorders and their presentations.', videoUrl: 'https://www.youtube.com/watch?v=9mPwQTiMSj8', duration: 12, order: 1 }
        ]
      },
      {
        title: 'The Anxiety Cycle',
        order: 2,
        lessons: [
          { title: 'How Anxiety Maintains Itself', type: 'video', content: 'Understanding avoidance and safety behaviors.', videoUrl: 'https://www.youtube.com/watch?v=T85HbCFLW8o', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Cognitive Interventions',
        order: 3,
        lessons: [
          { title: 'CBT for Anxiety - Cognitive Restructuring', type: 'video', content: 'Identifying and modifying anxious thoughts.', videoUrl: 'https://www.youtube.com/watch?v=0Tt1IDjmito', duration: 16, order: 1 }
        ]
      },
      {
        title: 'Physiological Interventions',
        order: 4,
        lessons: [
          { title: 'Progressive Muscle Relaxation', type: 'video', content: 'Teaching relaxation as a tool, not avoidance.', videoUrl: 'https://www.youtube.com/watch?v=1nZEdqcGVzo', duration: 10, order: 1 },
          { title: 'Diaphragmatic Breathing', type: 'video', content: 'Proper breathing technique for anxiety management.', videoUrl: 'https://www.youtube.com/watch?v=8VwufJrUhic', duration: 6, order: 2 }
        ]
      },
      {
        title: 'Exposure Therapy',
        order: 5,
        lessons: [
          { title: 'How to Do Exposure Therapy', type: 'video', content: 'Building hierarchies and conducting effective exposures.', videoUrl: 'https://www.youtube.com/watch?v=rDv-RfQ3N-A', duration: 15, order: 1 }
        ]
      },
      {
        title: 'Special Considerations',
        order: 6,
        lessons: [
          { title: 'Treatment-Resistant Anxiety and Medication', type: 'text', content: 'When to adapt approach or consider referral.', duration: 10, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'The most common mental health conditions are:', type: 'multiple_choice', options: ['Depressive disorders', 'Anxiety disorders', 'Personality disorders', 'Psychotic disorders'], correctAnswer: 1 },
              { question: 'GAD is characterized by:', type: 'multiple_choice', options: ['Recurrent panic attacks', 'Fear of specific objects', 'Excessive worry about multiple life domains', 'Fear of social situations only'], correctAnswer: 2 },
              { question: 'Avoidance maintains anxiety by:', type: 'multiple_choice', options: ['Providing long-term relief', 'Preventing learning that feared outcomes don\'t occur', 'Helping process fear', 'Building confidence'], correctAnswer: 1 },
              { question: 'Exposure therapy works through:', type: 'multiple_choice', options: ['Avoidance', 'Habituation and inhibitory learning', 'Medication only', 'Distraction'], correctAnswer: 1 },
              { question: 'An exposure hierarchy is organized by:', type: 'multiple_choice', options: ['Alphabetical order', 'Random order', 'Level of fear (SUDS ratings)', 'Chronological order'], correctAnswer: 2 },
              { question: 'During exposure, clients should:', type: 'multiple_choice', options: ['Escape when anxiety is highest', 'Use safety behaviors', 'Stay until anxiety decreases', 'Use distraction throughout'], correctAnswer: 2 },
              { question: 'Safety behaviors:', type: 'multiple_choice', options: ['Should be encouraged', 'Should be eliminated as they maintain fear', 'Have no effect', 'Speed up recovery'], correctAnswer: 1 },
              { question: 'Panic disorder includes:', type: 'multiple_choice', options: ['Recurrent unexpected panic attacks plus concern about future attacks', 'Worry about many topics', 'Fear of specific animals', 'Only social fears'], correctAnswer: 0 },
              { question: 'Cognitive restructuring involves:', type: 'multiple_choice', options: ['Examining and modifying anxious thoughts', 'Avoiding all negative thoughts', 'Only positive thinking', 'Ignoring thoughts'], correctAnswer: 0 },
              { question: 'Diaphragmatic breathing emphasizes:', type: 'multiple_choice', options: ['Chest breathing', 'Rapid breathing', 'Belly breathing with extended exhale', 'Holding breath'], correctAnswer: 2 },
              { question: 'Social anxiety involves fear of:', type: 'multiple_choice', options: ['Open spaces', 'Negative evaluation by others', 'Specific objects', 'Physical sensations only'], correctAnswer: 1 },
              { question: 'Decatastrophizing helps clients:', type: 'multiple_choice', options: ['Increase catastrophic thoughts', 'Avoid all thinking', 'Evaluate realistic probability and coping ability', 'Ignore outcomes'], correctAnswer: 2 },
              { question: 'Exposure should begin at:', type: 'multiple_choice', options: ['The most feared item', 'Moderate challenge items, progressing upward', 'Randomly', 'Only easy items forever'], correctAnswer: 1 },
              { question: 'Intolerance of uncertainty is particularly common in:', type: 'multiple_choice', options: ['GAD', 'Specific phobias only', 'No anxiety disorders', 'Panic disorder only'], correctAnswer: 0 },
              { question: 'The anxiety cycle includes:', type: 'multiple_choice', options: ['Trigger → Thought → Symptoms → Avoidance → Relief → Maintenance', 'Only physical symptoms', 'Only cognitive symptoms', 'Permanent resolution through avoidance'], correctAnswer: 0 },
              { question: 'Progressive Muscle Relaxation involves:', type: 'multiple_choice', options: ['Systematic tension and release of muscle groups', 'Constant muscle tension', 'Only relaxation, no tension', 'Cardiovascular exercise'], correctAnswer: 0 },
              { question: 'Cognitive distortions in anxiety include:', type: 'multiple_choice', options: ['Underestimating probability of bad outcomes', 'Overestimating probability and catastrophizing', 'Realistic assessment only', 'Only positive predictions'], correctAnswer: 1 },
              { question: 'Evidence-based treatment for anxiety achieves:', type: 'multiple_choice', options: ['10-20% response rates', '30-40% response rates', '60-80% response rates', '100% response rates'], correctAnswer: 2 },
              { question: 'Interoceptive exposure involves:', type: 'multiple_choice', options: ['Exposure to external situations', 'Exposure to feared internal sensations', 'Avoiding all sensations', 'Only imaginal exposure'], correctAnswer: 1 },
              { question: 'Relaxation techniques should be used:', type: 'multiple_choice', options: ['To avoid feeling anxiety during exposure', 'As tools for general stress management, not avoidance', 'To replace exposure entirely', 'Only with medication'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Anxiety and its disorders (2nd ed.)', author: 'Barlow, D. H.', year: 2004, source: 'Guilford Press' },
      { title: 'Mastery of your anxiety and worry (2nd ed.)', author: 'Craske, M. G., & Barlow, D. H.', year: 2006, source: 'Oxford University Press' },
      { title: 'Exposure therapy for anxiety (2nd ed.)', author: 'Abramowitz, J. S., Deacon, B. J., & Whiteside, S. P. H.', year: 2019, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 6: Suicide Assessment
  // ============================================
  {
    slug: 'suicide-assessment-safety-planning',
    title: 'Suicide Assessment and Safety Planning: Clinical Best Practices',
    subtitle: 'Master suicide risk assessment and the Stanley-Brown Safety Planning Intervention',
    description: 'Suicide is a leading cause of death, and mental health professionals are on the front lines of prevention. This essential 3-hour course provides practical skills for assessing suicide risk, conducting effective safety planning using the evidence-based Stanley-Brown model, and managing suicidal clients in outpatient settings.',
    thumbnail: '/images/courses/suicide-assessment.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Explain current suicide statistics and identify populations at elevated risk',
      'Demonstrate direct, compassionate questioning about suicidal ideation',
      'Distinguish between risk factors and warning signs',
      'Conduct thorough suicide risk assessment including ideation, plan, intent, and access',
      'Evaluate protective factors that mitigate suicide risk',
      'Implement the Stanley-Brown Safety Planning Intervention',
      'Apply lethal means counseling as a prevention strategy',
      'Navigate clinical decision-making regarding level of care'
    ],
    modules: [
      {
        title: 'Understanding Suicide',
        order: 1,
        lessons: [
          { title: 'Suicide: Facts and Myths', type: 'video', content: 'Statistics, risk factors, and common misconceptions.', videoUrl: 'https://www.youtube.com/watch?v=D1QoyTmeAYw', duration: 15, order: 1 }
        ]
      },
      {
        title: 'Asking the Questions',
        order: 2,
        lessons: [
          { title: 'How to Ask About Suicide', type: 'video', content: 'Direct, compassionate questioning techniques.', videoUrl: 'https://www.youtube.com/watch?v=VPfKdCR_0kg', duration: 8, order: 1 }
        ]
      },
      {
        title: 'Conducting the Assessment',
        order: 3,
        lessons: [
          { title: 'Columbia Protocol (C-SSRS)', type: 'video', content: 'Using structured assessment tools.', videoUrl: 'https://www.youtube.com/watch?v=VPRSj0nFVqI', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Safety Planning',
        order: 4,
        lessons: [
          { title: 'Stanley-Brown Safety Planning Intervention', type: 'video', content: 'The six-step evidence-based safety planning model.', videoUrl: 'https://www.youtube.com/watch?v=LivMalMSk4g', duration: 15, order: 1 }
        ]
      },
      {
        title: 'Lethal Means Counseling',
        order: 5,
        lessons: [
          { title: 'Reducing Access to Lethal Means', type: 'video', content: 'Having conversations about means restriction.', videoUrl: 'https://www.youtube.com/watch?v=Ey_s7S1RBGY', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Clinical Management',
        order: 6,
        lessons: [
          { title: 'Managing Suicidal Clients', type: 'video', content: 'Level of care decisions, documentation, and ongoing management.', videoUrl: 'https://www.youtube.com/watch?v=Mx2TbtjVLVg', duration: 13, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Suicide is the leading cause of death for which age group?', type: 'multiple_choice', options: ['5-10 years old', '10-34 years old', '55-65 years old', '75+ years old'], correctAnswer: 1 },
              { question: 'Asking about suicide:', type: 'multiple_choice', options: ['Plants the idea', 'Does not increase risk', 'Should be avoided', 'Only psychiatrists should ask'], correctAnswer: 1 },
              { question: 'The strongest predictor of future suicide attempt is:', type: 'multiple_choice', options: ['Depression diagnosis', 'Male gender', 'Previous suicide attempt', 'Substance use'], correctAnswer: 2 },
              { question: 'Warning signs differ from risk factors in that warning signs:', type: 'multiple_choice', options: ['Are static characteristics', 'Indicate acute, immediate risk', 'Cannot be observed', 'Are not clinically useful'], correctAnswer: 1 },
              { question: 'The first step in Stanley-Brown Safety Planning is:', type: 'multiple_choice', options: ['Listing professional contacts', 'Identifying warning signs', 'Means restriction', 'Calling a crisis line'], correctAnswer: 1 },
              { question: 'Firearms account for approximately what percentage of suicide deaths?', type: 'multiple_choice', options: ['10%', '25%', 'Over 50%', '90%'], correctAnswer: 2 },
              { question: 'Most people who survive a suicide attempt:', type: 'multiple_choice', options: ['Will eventually die by suicide', 'Do not go on to die by suicide', 'Never have suicidal thoughts again', 'Require lifelong hospitalization'], correctAnswer: 1 },
              { question: 'Lethal means counseling focuses on:', type: 'multiple_choice', options: ['Teaching about lethality', 'Reducing access to means of suicide', 'Encouraging clients to keep firearms', 'Only addressing medications'], correctAnswer: 1 },
              { question: 'When a client discloses suicidal ideation, clinicians should:', type: 'multiple_choice', options: ['Show alarm and call 911 immediately', 'Stay calm, thank them, and continue assessment', 'Minimize to avoid escalation', 'End the session'], correctAnswer: 1 },
              { question: 'The C-SSRS is:', type: 'multiple_choice', options: ['A diagnostic tool for depression', 'An evidence-based suicide risk screening tool', 'Only for emergency departments', 'A replacement for clinical judgment'], correctAnswer: 1 },
              { question: 'Internal coping strategies in safety planning involve:', type: 'multiple_choice', options: ['Calling friends', 'Things the client can do alone to cope', 'Contacting professionals', 'Means restriction'], correctAnswer: 1 },
              { question: 'Higher level of care is indicated when:', type: 'multiple_choice', options: ['Risk is low', 'Client has stated intent with access to means and cannot safety plan', 'Protective factors are strong', 'Client engages well in outpatient'], correctAnswer: 1 },
              { question: 'Documentation of suicide assessment should include:', type: 'multiple_choice', options: ['Only the final decision', 'Assessment, clinical reasoning, and interventions', 'Minimal information', 'Only consultation notes'], correctAnswer: 1 },
              { question: 'Protective factors include all EXCEPT:', type: 'multiple_choice', options: ['Reasons for living', 'Access to lethal means', 'Social support', 'Responsibility for children'], correctAnswer: 1 },
              { question: 'The question "What has kept you going?" assesses:', type: 'multiple_choice', options: ['Risk factors', 'Warning signs', 'Protective factors', 'Method of attempt'], correctAnswer: 2 },
              { question: 'Safety planning differs from no-suicide contracts because safety planning:', type: 'multiple_choice', options: ['Is not evidence-based', 'Is collaborative and provides specific coping strategies', 'Guarantees safety', 'Is done without client input'], correctAnswer: 1 },
              { question: 'Active suicidal ideation differs from passive ideation in that active ideation:', type: 'multiple_choice', options: ['Is less concerning', 'Involves thoughts of taking action to end one\'s life', 'Is just wishing to be dead', 'Never requires intervention'], correctAnswer: 1 },
              { question: 'Means restriction is effective because:', type: 'multiple_choice', options: ['Suicidal people will always find another method', 'Time and distance from lethal means can prevent deaths', 'It eliminates all suicidal thoughts', 'It\'s required by law'], correctAnswer: 1 },
              { question: 'After a suicidal crisis passes, clinicians should:', type: 'multiple_choice', options: ['Assume the client is no longer at risk', 'Continue monitoring and address underlying issues', 'Discharge from treatment', 'Avoid discussing the crisis'], correctAnswer: 1 },
              { question: 'When assessing suicidal ideation, clinicians should:', type: 'multiple_choice', options: ['Use euphemisms to avoid distressing the client', 'Ask directly using words like "suicide"', 'Only ask if the client brings it up', 'Assume passive ideation is not concerning'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Safety planning intervention', author: 'Stanley, B., & Brown, G. K.', year: 2012, source: 'Cognitive and Behavioral Practice, 19(2), 256-264' },
      { title: 'Managing suicidal risk (2nd ed.)', author: 'Jobes, D. A.', year: 2016, source: 'Guilford Press' },
      { title: 'Brief cognitive-behavioral therapy for suicide prevention', author: 'Bryan, C. J., & Rudd, M. D.', year: 2018, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 7: Cultural Humility (ETHICS)
  // ============================================
  {
    slug: 'cultural-humility-clinical-practice',
    title: 'Cultural Humility in Clinical Practice: Beyond Cultural Competence',
    subtitle: 'Move beyond cultural competence to develop cultural humility through self-reflection and partnership',
    description: 'This transformative 3-hour ethics course moves beyond checklist approaches to cultural competence toward cultural humility: a lifelong commitment to self-reflection, addressing power imbalances, and developing genuine partnerships with clients across cultural differences.',
    thumbnail: '/images/courses/cultural-humility.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Ethics', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Distinguish between cultural competence and cultural humility frameworks',
      'Examine one\'s own cultural identities, values, and biases',
      'Explain how power dynamics manifest in therapeutic relationships',
      'Apply the ADDRESSING framework for understanding cultural identities',
      'Recognize microaggressions and their impact on therapeutic alliance',
      'Implement culturally humble assessment and treatment practices',
      'Navigate cultural differences and conflicts ethically',
      'Commit to ongoing self-reflection and learning'
    ],
    modules: [
      {
        title: 'From Competence to Humility',
        order: 1,
        lessons: [
          { title: 'What is Cultural Humility?', type: 'video', content: 'The cultural humility framework and its core components.', videoUrl: 'https://www.youtube.com/watch?v=SaSHLbS1V4w', duration: 8, order: 1 }
        ]
      },
      {
        title: 'Examining Your Own Culture',
        order: 2,
        lessons: [
          { title: 'Understanding Implicit Bias', type: 'video', content: 'How unconscious attitudes affect clinical judgment.', videoUrl: 'https://www.youtube.com/watch?v=RZR-xJ3YtYs', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Culture in the Therapy Room',
        order: 3,
        lessons: [
          { title: 'Intersectionality and Mental Health', type: 'video', content: 'How multiple identities interact in clinical contexts.', videoUrl: 'https://www.youtube.com/watch?v=w6dnj2IyYjE', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Microaggressions and Impact',
        order: 4,
        lessons: [
          { title: 'Microaggressions in Therapy', type: 'video', content: 'Recognizing, avoiding, and responding to microaggressions.', videoUrl: 'https://www.youtube.com/watch?v=hDd3bzA7450', duration: 16, order: 1 }
        ]
      },
      {
        title: 'Culturally Humble Practice',
        order: 5,
        lessons: [
          { title: 'Culturally Responsive Therapy', type: 'video', content: 'Assessment, treatment adaptation, and working with interpreters.', videoUrl: 'https://www.youtube.com/watch?v=2o2syH3Dqsk', duration: 9, order: 1 },
          { title: 'Working with Interpreters', type: 'video', content: 'Best practices for language access.', videoUrl: 'https://www.youtube.com/watch?v=RBhmZ8H3RzM', duration: 8, order: 2 }
        ]
      },
      {
        title: 'Commitment and Growth',
        order: 6,
        lessons: [
          { title: 'Ongoing Self-Reflection', type: 'text', content: 'Maintaining cultural humility as lifelong practice.', duration: 10, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Cultural humility differs from cultural competence in that humility:', type: 'multiple_choice', options: ['Suggests a mastery endpoint', 'Emphasizes lifelong learning and self-reflection', 'Requires less effort', 'Focuses only on knowledge'], correctAnswer: 1 },
              { question: 'The three core principles of cultural humility are:', type: 'multiple_choice', options: ['Knowledge, skills, awareness', 'Lifelong learning, addressing power, institutional accountability', 'Assessment, treatment, termination', 'Diversity, inclusion, equity'], correctAnswer: 1 },
              { question: 'Implicit biases are:', type: 'multiple_choice', options: ['Always conscious', 'Only held by prejudiced people', 'Unconscious attitudes affecting behavior', 'Easily eliminated through training'], correctAnswer: 2 },
              { question: 'Privilege refers to:', type: 'multiple_choice', options: ['Earned advantages from hard work', 'Unearned advantages from dominant group membership', 'Wealth only', 'Educational achievement'], correctAnswer: 1 },
              { question: 'Intersectionality recognizes that:', type: 'multiple_choice', options: ['All identities are the same', 'Multiple identities interact to create unique experiences', 'Single identities matter most', 'Race is the only important identity'], correctAnswer: 1 },
              { question: 'Microaggressions are:', type: 'multiple_choice', options: ['Always intentional', 'Brief exchanges communicating negative messages to marginalized groups', 'Only verbal', 'Not harmful'], correctAnswer: 1 },
              { question: 'An example of a microinvalidation is:', type: 'multiple_choice', options: ['Using a slur', '"I don\'t see color"', 'Asking about heritage', 'Making eye contact'], correctAnswer: 1 },
              { question: 'When a clinician commits a microaggression, they should:', type: 'multiple_choice', options: ['Explain their good intentions', 'Acknowledge, apologize, and learn without burdening the client', 'Ignore it', 'Ask the client to educate them'], correctAnswer: 1 },
              { question: 'The ADDRESSING framework helps identify:', type: 'multiple_choice', options: ['Only client culture', 'Multiple cultural dimensions of both clinician and client', 'Only race and ethnicity', 'Only age'], correctAnswer: 1 },
              { question: 'Culturally humble assessment involves:', type: 'multiple_choice', options: ['Applying standard Western frameworks to all', 'Questioning diagnostic assumptions and assessing cultural context', 'Avoiding diagnosis', 'Assuming all clients are the same'], correctAnswer: 1 },
              { question: 'When working with interpreters, clinicians should:', type: 'multiple_choice', options: ['Use family members whenever possible', 'Speak directly to the interpreter', 'Use professional interpreters and speak to the client', 'Avoid using interpreters'], correctAnswer: 2 },
              { question: 'Power dynamics in therapy include:', type: 'multiple_choice', options: ['Only economic power', 'Professional authority, diagnostic power, and often majority-group identities', 'Only client\'s power', 'No relevant power dynamics'], correctAnswer: 1 },
              { question: 'When cultural values conflict between clinician and client:', type: 'multiple_choice', options: ['Clinician\'s values should prevail', 'Conflict should be ignored', 'Curiosity and collaborative negotiation are appropriate', 'Treatment should be terminated'], correctAnswer: 2 },
              { question: 'Cultural humility requires:', type: 'multiple_choice', options: ['One-time training', 'Ongoing self-reflection and learning', 'Mastering all cultures', 'Avoiding clients from different backgrounds'], correctAnswer: 1 },
              { question: 'Adapting evidence-based treatments for cultural relevance involves:', type: 'multiple_choice', options: ['Ignoring the evidence base', 'Maintaining core elements while adapting surface features', 'Using treatments only as written', 'Avoiding evidence-based treatments'], correctAnswer: 1 },
              { question: 'Microinsults are communications that:', type: 'multiple_choice', options: ['Are always deliberate', 'Convey rudeness or insensitivity, often unintentionally', 'Are physical', 'Are not microaggressions'], correctAnswer: 1 },
              { question: 'A culturally humble response to making a mistake is:', type: 'multiple_choice', options: ['Defending your intentions', 'Acknowledging, apologizing, learning, and changing behavior', 'Avoiding the topic', 'Blaming the client'], correctAnswer: 1 },
              { question: 'The DSM-5 Cultural Formulation Interview:', type: 'multiple_choice', options: ['Replaces diagnosis', 'Provides structured cultural assessment', 'Is required for all clients', 'Is only for immigrant clients'], correctAnswer: 1 },
              { question: 'Institutional cultural humility involves:', type: 'multiple_choice', options: ['Individual reflection only', 'Examining organizational policies and practices for bias', 'Ignoring systemic issues', 'Only hiring diverse staff'], correctAnswer: 1 },
              { question: 'Cultural humility is best described as:', type: 'multiple_choice', options: ['A destination to reach', 'An ongoing commitment and practice', 'A checklist to complete', 'Less important than technical skills'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Cultural humility versus cultural competence', author: 'Tervalon, M., & Murray-Garcia, J.', year: 1998, source: 'Journal of Health Care for the Poor and Underserved, 9(2), 117-125' },
      { title: 'Microaggressions in everyday life', author: 'Sue, D. W.', year: 2010, source: 'Wiley' },
      { title: 'Addressing cultural complexities in practice (3rd ed.)', author: 'Hays, P. A.', year: 2016, source: 'APA' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 8: Clinical Documentation (ETHICS)
  // ============================================
  {
    slug: 'clinical-documentation-effective',
    title: 'Clinical Documentation That Works: Efficient, Ethical, and Effective Notes',
    subtitle: 'Master efficient, ethical documentation including SOAP/DAP notes, treatment planning, and risk documentation',
    description: 'Documentation is often viewed as an administrative burden, but good documentation is a clinical tool that supports treatment, protects clients and clinicians, and demonstrates quality care. This practical 3-hour ethics course transforms your approach to documentation.',
    thumbnail: '/images/courses/documentation.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Ethics', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Explain the purposes of clinical documentation for clinical, legal, and ethical functions',
      'Identify legal and ethical requirements governing documentation',
      'Write effective progress notes using structured formats (DAP, SOAP, BIRP)',
      'Develop treatment plans that are measurable, relevant, and useful',
      'Document sensitive topics appropriately',
      'Apply strategies for efficient documentation',
      'Navigate client access to records',
      'Avoid common documentation errors'
    ],
    modules: [
      {
        title: 'The Purposes of Documentation',
        order: 1,
        lessons: [
          { title: 'Why Documentation Matters', type: 'video', content: 'Clinical, legal, and ethical purposes of documentation.', videoUrl: 'https://www.youtube.com/watch?v=xHJ-pn4Fcbw', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Progress Note Formats',
        order: 2,
        lessons: [
          { title: 'Writing Progress Notes - SOAP Format', type: 'video', content: 'Structured approaches to progress notes.', videoUrl: 'https://www.youtube.com/watch?v=X15HhHX8fMs', duration: 13, order: 1 }
        ]
      },
      {
        title: 'Treatment Planning',
        order: 3,
        lessons: [
          { title: 'Effective Treatment Planning', type: 'video', content: 'Creating measurable, useful treatment plans.', videoUrl: 'https://www.youtube.com/watch?v=VKgWHhcZQKg', duration: 14, order: 1 }
        ]
      },
      {
        title: 'Documenting Sensitive Issues',
        order: 4,
        lessons: [
          { title: 'Documenting Suicidal Ideation', type: 'video', content: 'Best practices for high-risk documentation.', videoUrl: 'https://www.youtube.com/watch?v=wY7-u2p4U9g', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Efficient Documentation',
        order: 5,
        lessons: [
          { title: 'Reducing Documentation Burden', type: 'video', content: 'Strategies for sustainable documentation.', videoUrl: 'https://www.youtube.com/watch?v=z3HdJVVnfks', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Legal and Ethical Considerations',
        order: 6,
        lessons: [
          { title: 'Psychotherapy Notes Under HIPAA', type: 'video', content: 'Understanding HIPAA protections and client access.', videoUrl: 'https://www.youtube.com/watch?v=3MQnVNTUJfA', duration: 9, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'The principle "if it isn\'t documented, it didn\'t happen" reflects:', type: 'multiple_choice', options: ['An exaggeration', 'The legal reality that undocumented care is indefensible', 'That only written care matters', 'Insurance company bias'], correctAnswer: 1 },
              { question: 'SOAP notes include all EXCEPT:', type: 'multiple_choice', options: ['Subjective', 'Objective', 'Analysis', 'Assessment'], correctAnswer: 2 },
              { question: 'The "S" in SOAP stands for:', type: 'multiple_choice', options: ['Symptoms', 'Subjective (client report)', 'Summary', 'Status'], correctAnswer: 1 },
              { question: 'A measurable treatment objective should be:', type: 'multiple_choice', options: ['Vague to allow flexibility', 'Specific, measurable, achievable, relevant, and time-bound', 'Only focused on symptoms', 'Written without client input'], correctAnswer: 1 },
              { question: 'When documenting suicide risk, clinicians should include:', type: 'multiple_choice', options: ['Only the final determination', 'Assessment, clinical reasoning, interventions, and follow-up plan', 'Minimal information', 'Only consultation notes'], correctAnswer: 1 },
              { question: 'Psychotherapy notes under HIPAA are:', type: 'multiple_choice', options: ['All mental health notes', 'Narrowly defined notes kept separately documenting conversation content', 'Never protected', 'Always accessible to clients'], correctAnswer: 1 },
              { question: 'When writing about a client who may read the record, clinicians should:', type: 'multiple_choice', options: ['Omit all clinical impressions', 'Use behavioral descriptions and respectful language', 'Write only positive things', 'Never include diagnosis'], correctAnswer: 1 },
              { question: 'An efficient documentation strategy is:', type: 'multiple_choice', options: ['Documenting once weekly in a batch', 'Documenting immediately after sessions', 'Copying previous notes verbatim', 'Minimizing all documentation'], correctAnswer: 1 },
              { question: 'Treatment plan goals differ from objectives in that goals are:', type: 'multiple_choice', options: ['Specific and short-term', 'Broad and long-term', 'Written by the client only', 'Not necessary'], correctAnswer: 1 },
              { question: 'DAP notes include:', type: 'multiple_choice', options: ['Data, Assessment, Plan', 'Diagnosis, Action, Prognosis', 'Description, Analysis, Prescription', 'Detail, Approach, Progress'], correctAnswer: 0 },
              { question: 'Documentation of mandated reports should include:', type: 'multiple_choice', options: ['Only that a report was made', 'Information prompting the report, assessment, and how it was handled', 'Speculation about guilt', 'Nothing'], correctAnswer: 1 },
              { question: 'Common documentation errors include:', type: 'multiple_choice', options: ['Documenting too soon', 'Using behavioral descriptions', 'Late documentation and judgmental language', 'Including clinical reasoning'], correctAnswer: 2 },
              { question: 'Client access to records:', type: 'multiple_choice', options: ['Should be denied routinely', 'Is a right under most circumstances', 'Only applies to medical records', 'Is never permitted for mental health'], correctAnswer: 1 },
              { question: 'The primary purpose of progress notes is:', type: 'multiple_choice', options: ['Billing only', 'Supporting clinical care, communication, and demonstrating standard of care', 'Legal protection only', 'Meeting agency requirements only'], correctAnswer: 1 },
              { question: 'Templates for documentation:', type: 'multiple_choice', options: ['Should never be used', 'Can improve efficiency but shouldn\'t make notes generic', 'Eliminate the need for individualization', 'Are only for intake'], correctAnswer: 1 },
              { question: 'When using copy-forward in EHRs, clinicians should:', type: 'multiple_choice', options: ['Copy everything from previous notes', 'Review carefully to avoid outdated information', 'Copy forward is always best practice', 'Never modify copied content'], correctAnswer: 1 },
              { question: 'Treatment plans should be developed:', type: 'multiple_choice', options: ['Without client involvement', 'Collaboratively with the client', 'Only by supervisors', 'After treatment concludes'], correctAnswer: 1 },
              { question: 'Pejorative language in notes (e.g., "manipulative"):', type: 'multiple_choice', options: ['Is appropriate for certain clients', 'Should be avoided in favor of behavioral descriptions', 'Is required for accurate diagnosis', 'Is protected from client access'], correctAnswer: 1 },
              { question: 'In malpractice cases, good documentation:', type: 'multiple_choice', options: ['Is irrelevant', 'Shows standard of care was met and supports clinician\'s testimony', 'Only matters if you lose', 'Cannot help the clinician'], correctAnswer: 1 },
              { question: 'The optimal documentation goal is:', type: 'multiple_choice', options: ['Maximum length and detail', 'Minimum possible documentation', 'Complete enough to serve purposes, efficient enough to be sustainable', 'Documentation only when required by law'], correctAnswer: 2 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'The psychotherapy documentation primer (3rd ed.)', author: 'Wiger, D. E.', year: 2012, source: 'Wiley' },
      { title: 'Record keeping in psychotherapy and counseling (2nd ed.)', author: 'Luepker, E. T.', year: 2012, source: 'Routledge' },
      { title: 'Documentation in social work', author: 'Reamer, F. G.', year: 2005, source: 'Social Work, 50(4), 325-334' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 9: Ethical Dilemmas (ETHICS)
  // ============================================
  {
    slug: 'navigating-ethical-dilemmas',
    title: 'Navigating Ethical Dilemmas in Clinical Practice',
    subtitle: 'Develop systematic ethical decision-making skills for complex clinical dilemmas',
    description: 'Every clinician faces ethical dilemmas—situations where values, duties, or principles appear to conflict. This essential 3-hour ethics course provides a systematic framework for ethical decision-making, examines common dilemmas, and develops skills for navigating ambiguous situations with integrity.',
    thumbnail: '/images/courses/ethical-dilemmas.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Ethics', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Distinguish between ethical dilemmas and ethical violations',
      'Apply a systematic model for ethical decision-making',
      'Analyze confidentiality dilemmas involving third-party interests',
      'Navigate dual relationship and boundary issues',
      'Address conflicts between laws, ethics codes, and personal values',
      'Implement appropriate consultation and documentation',
      'Recognize signs of ethical drift and burnout affecting judgment',
      'Develop strategies for maintaining ethical practice'
    ],
    modules: [
      {
        title: 'Understanding Ethical Dilemmas',
        order: 1,
        lessons: [
          { title: 'Ethics vs. Law in Therapy', type: 'video', content: 'Core ethical principles and the relationship between ethics and law.', videoUrl: 'https://www.youtube.com/watch?v=ZF1qH3k4Y8E', duration: 13, order: 1 }
        ]
      },
      {
        title: 'Ethical Decision-Making Models',
        order: 2,
        lessons: [
          { title: 'Systematic Decision-Making', type: 'video', content: 'A practical framework for working through ethical dilemmas.', videoUrl: 'https://www.youtube.com/watch?v=HA8n1P9jb7I', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Confidentiality Dilemmas',
        order: 3,
        lessons: [
          { title: 'Confidentiality and Its Limits', type: 'video', content: 'Third-party interests, duty to protect, and gray areas.', videoUrl: 'https://www.youtube.com/watch?v=kQ1xRnm4N-s', duration: 14, order: 1 }
        ]
      },
      {
        title: 'Boundaries and Dual Relationships',
        order: 4,
        lessons: [
          { title: 'Managing Boundaries in Therapy', type: 'video', content: 'Evaluating dual relationships and boundary crossings.', videoUrl: 'https://www.youtube.com/watch?v=Y2xQ8TmNc4g', duration: 11, order: 1 }
        ]
      },
      {
        title: 'When Ethics, Law, and Values Conflict',
        order: 5,
        lessons: [
          { title: 'Navigating Conflicts', type: 'video', content: 'When ethical and legal obligations appear to conflict.', videoUrl: 'https://www.youtube.com/watch?v=TnhFMk2L7lA', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Maintaining Ethical Practice',
        order: 6,
        lessons: [
          { title: 'Self-Care as Ethical Obligation', type: 'video', content: 'Ethical drift, burnout, and sustainable practice.', videoUrl: 'https://www.youtube.com/watch?v=7WNJxT9K3fM', duration: 9, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'An ethical dilemma differs from an ethical violation in that a dilemma:', type: 'multiple_choice', options: ['Has a clear right answer', 'Involves apparent conflict between legitimate principles', 'Is always illegal', 'Requires no consultation'], correctAnswer: 1 },
              { question: 'The principle of autonomy refers to:', type: 'multiple_choice', options: ['Therapist independence', 'Respect for client self-determination', 'Following rules automatically', 'Agency policies'], correctAnswer: 1 },
              { question: 'The first step in ethical decision-making is:', type: 'multiple_choice', options: ['Consulting colleagues', 'Making a decision', 'Identifying the dilemma clearly', 'Reviewing the ethics code only'], correctAnswer: 2 },
              { question: 'Confidentiality may ethically be broken when:', type: 'multiple_choice', options: ['The therapist is curious', 'The client is a danger to identifiable others', 'A family member asks', 'It would make treatment easier'], correctAnswer: 1 },
              { question: 'A dual relationship occurs when:', type: 'multiple_choice', options: ['Two clients know each other', 'The clinician has another relationship with the client', 'The clinician sees couples', 'There are two clinicians'], correctAnswer: 1 },
              { question: 'When ethics and law conflict, clinicians should generally:', type: 'multiple_choice', options: ['Always follow law without question', 'Work to resolve the conflict and take reasonable steps', 'Always follow ethics and ignore law', 'Do nothing'], correctAnswer: 1 },
              { question: 'Ethical drift refers to:', type: 'multiple_choice', options: ['Changing ethics codes', 'Gradual erosion of ethical standards over time', 'Moving to another state', 'New ethical dilemmas'], correctAnswer: 1 },
              { question: 'Self-care is an ethical obligation because:', type: 'multiple_choice', options: ['It\'s required by insurance', 'Impairment affects ability to provide ethical care', 'It\'s enjoyable', 'It\'s not actually an obligation'], correctAnswer: 1 },
              { question: 'A boundary crossing differs from a boundary violation in that a crossing:', type: 'multiple_choice', options: ['Is always harmful', 'May or may not be harmful depending on context', 'Is always sexual', 'Never requires attention'], correctAnswer: 1 },
              { question: 'The "could you defend it?" test asks whether you could explain your decision to:', type: 'multiple_choice', options: ['Only yourself', 'A licensing board, peers, and the client', 'Only the client', 'No one'], correctAnswer: 1 },
              { question: 'When a client\'s values conflict with yours, you should:', type: 'multiple_choice', options: ['Try to change their values', 'Provide unbiased care or refer if unable', 'Terminate immediately', 'Ignore the conflict'], correctAnswer: 1 },
              { question: 'Documentation in ethical decision-making should include:', type: 'multiple_choice', options: ['Only the final decision', 'The process followed, options considered, and reasoning', 'Nothing', 'Only consultation notes'], correctAnswer: 1 },
              { question: 'The principle of beneficence means:', type: 'multiple_choice', options: ['Being financially successful', 'Acting in the client\'s best interest', 'Following agency policy', 'Maintaining confidentiality always'], correctAnswer: 1 },
              { question: 'Consultation in ethical dilemmas is important because:', type: 'multiple_choice', options: ['It\'s required by law in all cases', 'Fresh perspectives reveal blind spots', 'It transfers responsibility', 'It delays decisions'], correctAnswer: 1 },
              { question: 'Small community practice may involve unavoidable dual relationships that:', type: 'multiple_choice', options: ['Should result in refusing all clients', 'Require careful risk management', 'Are never acceptable', 'Don\'t require attention'], correctAnswer: 1 },
              { question: 'Warning signs of clinician impairment include:', type: 'multiple_choice', options: ['Attending continuing education', 'Seeking supervision', 'Difficulty maintaining boundaries and decreased empathy', 'Maintaining self-care'], correctAnswer: 2 },
              { question: 'When you suspect a colleague is behaving unethically:', type: 'multiple_choice', options: ['Ignore it', 'Consider the concern, possibly address informally, consult, and report if serious', 'Always report immediately', 'Never intervene'], correctAnswer: 1 },
              { question: 'Mandated reporting requirements represent:', type: 'multiple_choice', options: ['A gray area', 'A legal requirement overriding confidentiality', 'An optional guideline', 'Something only for new clinicians'], correctAnswer: 1 },
              { question: 'When evaluating whether a dual relationship is acceptable, consider:', type: 'multiple_choice', options: ['Only your personal benefit', 'Whether it\'s avoidable, who benefits, and potential for harm', 'Only the client\'s preference', 'Whether anyone will find out'], correctAnswer: 1 },
              { question: 'The ethics code is best used as:', type: 'multiple_choice', options: ['An ending point resolving all dilemmas', 'A starting point for ethical thinking, not the complete answer', 'Something to ignore', 'Only for students'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Issues and ethics in the helping professions (10th ed.)', author: 'Corey, G., Corey, M. S., Corey, C., & Callanan, P.', year: 2019, source: 'Cengage' },
      { title: 'Ethics in psychotherapy and counseling (5th ed.)', author: 'Pope, K. S., & Vasquez, M. J. T.', year: 2016, source: 'Wiley' },
      { title: 'Ethics in counseling and psychotherapy (6th ed.)', author: 'Welfel, E. R.', year: 2016, source: 'Cengage' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },

  // ============================================
  // COURSE 10: Telehealth Best Practices
  // ============================================
  {
    slug: 'telehealth-best-practices',
    title: 'Telehealth Best Practices: Effective Online Therapy',
    subtitle: 'Master telehealth practice including technology setup, therapeutic presence, and crisis protocols',
    description: 'Telehealth has transformed mental health care delivery. This practical 3-hour course prepares clinicians for effective telehealth practice, addressing platform selection, session management, crisis response, and legal/ethical considerations unique to remote care.',
    thumbnail: '/images/courses/telehealth.jpg',
    accessType: 'paid',
    price: 39.99,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 3.0,
    ceuCategories: [{ category: 'Clinical', hours: 3.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Identify appropriate clients and presenting problems for telehealth',
      'Select HIPAA-compliant platforms and establish secure technology practices',
      'Create a professional telehealth environment and therapeutic presence',
      'Adapt therapeutic techniques for the virtual setting',
      'Develop safety protocols and crisis response plans for remote clients',
      'Navigate legal and ethical requirements across jurisdictions',
      'Address technology failures and session disruptions',
      'Implement informed consent procedures specific to telehealth'
    ],
    modules: [
      {
        title: 'Foundations of Telehealth',
        order: 1,
        lessons: [
          { title: 'Introduction to Telehealth Therapy', type: 'video', content: 'Evidence base and appropriate use of telehealth.', videoUrl: 'https://www.youtube.com/watch?v=FNBqKJ7tCVQ', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Technology and Setup',
        order: 2,
        lessons: [
          { title: 'Setting Up for Telehealth Sessions', type: 'video', content: 'Platform selection, environment setup, and technical requirements.', videoUrl: 'https://www.youtube.com/watch?v=M9I-RtQjA7Y', duration: 13, order: 1 }
        ]
      },
      {
        title: 'Therapeutic Presence Online',
        order: 3,
        lessons: [
          { title: 'Building Rapport Online', type: 'video', content: 'Creating therapeutic connection through the screen.', videoUrl: 'https://www.youtube.com/watch?v=HDJNwqKpE-s', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Adapting Interventions',
        order: 4,
        lessons: [
          { title: 'Adapting Therapy for Telehealth', type: 'video', content: 'Modifying therapeutic interventions for online delivery.', videoUrl: 'https://www.youtube.com/watch?v=s2KfJhVHPz8', duration: 14, order: 1 }
        ]
      },
      {
        title: 'Safety and Crisis Protocols',
        order: 5,
        lessons: [
          { title: 'Crisis Management in Telehealth', type: 'video', content: 'Safety planning and crisis response for remote clients.', videoUrl: 'https://www.youtube.com/watch?v=3BKvPpN6qWE', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Legal and Ethical Considerations',
        order: 6,
        lessons: [
          { title: 'Legal and Ethical Issues in Telehealth', type: 'video', content: 'Jurisdiction, licensure, and informed consent.', videoUrl: 'https://www.youtube.com/watch?v=NvYdKJ8HvZM', duration: 10, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Telehealth therapy outcomes are:', type: 'multiple_choice', options: ['Always inferior to in-person', 'Comparable to in-person for many conditions', 'Superior to in-person', 'Not researched'], correctAnswer: 1 },
              { question: 'A HIPAA-compliant telehealth platform must have:', type: 'multiple_choice', options: ['Free pricing', 'A Business Associate Agreement with the provider', 'The most users', 'Video-only capability'], correctAnswer: 1 },
              { question: 'For licensure purposes in telehealth, clinicians must generally be licensed:', type: 'multiple_choice', options: ['Only where they are located', 'In the state where the client is located during the session', 'In all 50 states', 'Licensure doesn\'t apply'], correctAnswer: 1 },
              { question: 'Creating eye contact on video requires:', type: 'multiple_choice', options: ['Looking at the client\'s image on screen', 'Looking at the camera', 'Avoiding eye contact', 'Closing your eyes'], correctAnswer: 1 },
              { question: 'Before beginning telehealth, you should collect:', type: 'multiple_choice', options: ['Social media handles', 'The client\'s physical address and emergency contact', 'Credit card information only', 'Nothing additional'], correctAnswer: 1 },
              { question: 'If a client is in crisis and disconnects, you should:', type: 'multiple_choice', options: ['Wait for them to call back', 'Document and end your day', 'Attempt to reconnect, call their phone, and contact emergency services if needed', 'Send an email'], correctAnswer: 2 },
              { question: 'Telehealth-specific informed consent should address:', type: 'multiple_choice', options: ['Only fees', 'Technology, privacy, emergency protocols, and limitations', 'Only HIPAA', 'Nothing beyond standard consent'], correctAnswer: 1 },
              { question: 'Good candidates for telehealth include:', type: 'multiple_choice', options: ['Only clients without transportation', 'Clients with transportation barriers, rural clients, and those comfortable with technology', 'Only young clients', 'No one'], correctAnswer: 1 },
              { question: '"Zoom fatigue" can be addressed by:', type: 'multiple_choice', options: ['Longer sessions', 'Shorter sessions, processing time, and screen breaks', 'More intense eye contact', 'Ignoring it'], correctAnswer: 1 },
              { question: 'When adapting exposure therapy for telehealth:', type: 'multiple_choice', options: ['Exposure cannot be done remotely', 'In vivo exposures may require creativity and more client self-direction', 'Only imaginal exposure works', 'Interoceptive exposures are impossible'], correctAnswer: 1 },
              { question: 'For therapeutic presence online, body language should be:', type: 'multiple_choice', options: ['Minimized', 'Slightly amplified as subtle cues get lost', 'Identical to in-person', 'Eliminated'], correctAnswer: 1 },
              { question: 'Standard Zoom, Skype, and FaceTime are:', type: 'multiple_choice', options: ['HIPAA compliant', 'Not HIPAA compliant for clinical use', 'The best options', 'Required by most insurance'], correctAnswer: 1 },
              { question: 'Your telehealth environment should include:', type: 'multiple_choice', options: ['Personal photos and distracting items', 'Neutral background, good lighting, and quality audio', 'Low lighting for mood', 'Background music'], correctAnswer: 1 },
              { question: 'At each telehealth session\'s beginning, you should confirm:', type: 'multiple_choice', options: ['Only the fee', 'The client\'s location and that they are in a private space', 'Nothing—just begin', 'Their social media updates'], correctAnswer: 1 },
              { question: 'Screen sharing during telehealth can be used for:', type: 'multiple_choice', options: ['Showing unrelated content', 'Collaborative work on worksheets and psychoeducation', 'Entertainment only', 'Screen sharing should never be used'], correctAnswer: 1 },
              { question: 'Crisis response in telehealth may require:', type: 'multiple_choice', options: ['Only waiting for stabilization', 'Using a second phone line to contact emergency services while keeping client on video', 'Terminating immediately', 'No adaptation from in-person'], correctAnswer: 1 },
              { question: 'Documentation of telehealth sessions should include:', type: 'multiple_choice', options: ['Only clinical content', 'That the session was via telehealth, platform used, and client location', 'Less than in-person', 'Nothing'], correctAnswer: 1 },
              { question: 'Silence in telehealth sessions:', type: 'multiple_choice', options: ['Feels exactly the same as in-person', 'Can feel more awkward and may need to be used differently', 'Should be avoided entirely', 'Is preferred over speaking'], correctAnswer: 1 },
              { question: 'If a client is traveling to another state:', type: 'multiple_choice', options: ['Sessions can continue regardless', 'Licensure in the client\'s location must be considered', 'Location doesn\'t matter', 'Telehealth must stop permanently'], correctAnswer: 1 },
              { question: 'Telehealth is:', type: 'multiple_choice', options: ['A temporary solution', 'A permanent feature of mental health care requiring specific skills', 'Inferior to all other care', 'Only for certain demographics'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Guidelines for the practice of telepsychology', author: 'APA', year: 2013, source: 'American Psychologist, 68(9), 791-800' },
      { title: 'Videoconferencing psychotherapy: A systematic review', author: 'Backhaus, A., et al.', year: 2012, source: 'Psychological Services, 9(2), 111-131' },
      { title: 'Therapeutic alliance in videoconferencing psychotherapy', author: 'Simpson, S. G., & Reid, C. L.', year: 2014, source: 'Australian Journal of Rural Health, 22(6), 280-299' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  }
];

// ===========================================
// SEED FUNCTION
// ===========================================

const seedStandardCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    let created = 0;
    let skipped = 0;
    
    for (const courseData of standardCourses) {
      const existing = await Course.findOne({ slug: courseData.slug });
      
      if (existing) {
        console.log(`⏭️  Skipping (exists): ${courseData.slug}`);
        skipped++;
        continue;
      }
      
      await Course.create(courseData);
      console.log(`✅ Created: ${courseData.title}`);
      created++;
    }
    
    console.log('\n✨ Seeding complete!');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total CE Hours: ${created * 3}`);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1].includes('seedStandardCourses.js')) {
  seedStandardCourses();
}

export { standardCourses };
export default seedStandardCourses;
