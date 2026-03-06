/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// seedCourses.js
// Run with: node seedCourses.js
// Place in: server/src/data/seedCourses.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

// ===========================================
// FREE COURSES (5 courses, 5 CE hours)
// ===========================================

const freeCourses = [
  {
    slug: 'self-care-clinicians',
    title: 'Self-Care for Clinicians: Preventing Burnout and Compassion Fatigue',
    subtitle: 'Recognize burnout and compassion fatigue, and implement evidence-based self-care strategies',
    description: 'Mental health professionals face unique occupational hazards—absorbing clients\' pain, navigating vicarious trauma, and managing the emotional demands of therapeutic work. This essential 1-hour course examines burnout, compassion fatigue, and vicarious traumatization, providing practical self-care strategies that go beyond bubble baths. Learn to recognize warning signs in yourself and build sustainable practices for a long, healthy career.',
    thumbnail: '/images/courses/self-care.jpg',
    accessType: 'free',
    price: 0,
    pricingTier: 'standard',
    ceuEligible: true,
    ceuHours: 1.0,
    ceuCategories: [{ category: 'Ethics', hours: 1.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{
      body: 'NBCC',
      providerNumber: '#7760',
      providerName: 'GA Integrated Therapeutic Perspectives LLC',
      status: 'approved'
    }],
    objectives: [
      'Distinguish between burnout, compassion fatigue, and vicarious traumatization',
      'Recognize warning signs of impairment in oneself and colleagues',
      'Explain self-care as an ethical obligation, not optional self-indulgence',
      'Implement evidence-based self-care strategies for sustainable practice'
    ],
    modules: [
      {
        title: 'Understanding the Hazards',
        order: 1,
        objectives: ['Define burnout, compassion fatigue, and vicarious trauma'],
        lessons: [
          {
            title: 'Burnout vs Compassion Fatigue',
            type: 'video',
            content: 'Defining and distinguishing between burnout, compassion fatigue, and vicarious trauma.',
            videoUrl: 'https://www.youtube.com/watch?v=1M6sBJRHgNE',
            duration: 11,
            order: 1
          }
        ]
      },
      {
        title: 'Recognizing Warning Signs',
        order: 2,
        objectives: ['Identify warning signs of clinician impairment'],
        lessons: [
          {
            title: 'Vicarious Trauma for Therapists',
            type: 'video',
            content: 'Warning signs and self-assessment for vicarious traumatization.',
            videoUrl: 'https://www.youtube.com/watch?v=SKDpjRmHEEk',
            duration: 9,
            order: 1
          }
        ]
      },
      {
        title: 'Building Sustainable Practices',
        order: 3,
        objectives: ['Implement evidence-based self-care strategies'],
        lessons: [
          {
            title: 'Evidence-Based Self-Care',
            type: 'video',
            content: 'Professional, personal, and cognitive strategies for sustainable practice.',
            videoUrl: 'https://www.youtube.com/watch?v=3P8mNjpvFbM',
            duration: 10,
            order: 1
          },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Burnout is characterized by:', type: 'multiple_choice', options: ['Intrusive thoughts about clients', 'Emotional exhaustion, depersonalization, and reduced accomplishment', 'Sudden onset after a single case', 'Changes in worldview only'], correctAnswer: 1, explanation: 'Burnout involves emotional exhaustion, depersonalization (cynicism), and reduced sense of accomplishment.' },
              { question: 'Compassion fatigue differs from burnout in that it:', type: 'multiple_choice', options: ['Is specific to helping professions and involves absorbing client suffering', 'Only affects new clinicians', 'Is less serious', 'Cannot be prevented'], correctAnswer: 0, explanation: 'Compassion fatigue is specific to helping professions and involves absorbing the suffering of those you help.' },
              { question: 'Self-care is considered:', type: 'multiple_choice', options: ['Optional for experienced clinicians', 'An ethical obligation', 'Selfish', 'Only necessary after impairment'], correctAnswer: 1, explanation: 'Ethics codes require clinicians to monitor their functioning and address impairment—making self-care an ethical obligation.' },
              { question: 'Warning signs of clinician impairment include:', type: 'multiple_choice', options: ['Enjoying supervision', 'Dreading clients and decreased empathy', 'Maintaining boundaries', 'Taking vacation'], correctAnswer: 1, explanation: 'Dreading sessions, decreased empathy, and difficulty maintaining boundaries are warning signs of impairment.' },
              { question: 'Vicarious traumatization primarily involves:', type: 'multiple_choice', options: ['Physical exhaustion', 'Changes in the clinician\'s worldview and beliefs', 'Only burnout symptoms', 'Client complaints'], correctAnswer: 1, explanation: 'Vicarious traumatization involves deeper changes in the clinician\'s worldview, beliefs, and sense of safety.' },
              { question: 'Evidence-based self-care includes:', type: 'multiple_choice', options: ['Only occasional treats', 'Balanced caseload, supervision, and sustainable personal practices', 'Working more hours', 'Avoiding difficult clients entirely'], correctAnswer: 1, explanation: 'Effective self-care includes professional strategies (balanced caseload, supervision) and personal practices.' },
              { question: 'Depersonalization in burnout involves:', type: 'multiple_choice', options: ['Increased empathy', 'Cynicism and detachment from clients', 'Physical illness only', 'Improved boundaries'], correctAnswer: 1, explanation: 'Depersonalization refers to developing cynicism and emotional detachment from clients.' },
              { question: 'Professional self-care strategies include:', type: 'multiple_choice', options: ['Taking on more trauma cases', 'Regular supervision focused on clinician experience', 'Working in isolation', 'Avoiding consultation'], correctAnswer: 1, explanation: 'Regular supervision focused on the clinician\'s experience is a key professional self-care strategy.' },
              { question: 'Compassion fatigue can develop:', type: 'multiple_choice', options: ['Only over many years', 'Suddenly after exposure to difficult material', 'Only in new clinicians', 'Only from personal trauma'], correctAnswer: 1, explanation: 'Unlike burnout which develops gradually, compassion fatigue can develop suddenly after exposure to particularly difficult material.' },
              { question: 'Creating a self-care plan requires:', type: 'multiple_choice', options: ['No effort', 'Intentional assessment of what depletes and restores you', 'Only workplace changes', 'Ignoring warning signs'], correctAnswer: 1, explanation: 'Effective self-care requires intentional assessment of what depletes and restores you.' }
            ],
            shuffleQuestions: true,
            shuffleOptions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Treating compassion fatigue', author: 'Figley, C. R.', year: 2002, source: 'Brunner-Routledge' },
      { title: 'The burnout challenge', author: 'Maslach, C., & Leiter, M. P.', year: 2016, source: 'Harvard University Press' },
      { title: 'The resilient practitioner (3rd ed.)', author: 'Skovholt, T. M., & Trotter-Mathison, M.', year: 2016, source: 'Routledge' }
    ],
    presenter: {
      name: 'CounselorReady',
      credentials: 'NBCC-Approved Provider',
      presenterCategory: 'category1'
    },
    settings: {
      passingScore: 80,
      certificateEnabled: true,
      requireEvaluation: true,
      requireAttestation: true
    },
    status: 'published',
    publishedAt: new Date()
  },
  {
    slug: 'active-listening-skills',
    title: 'Active Listening: The Foundation of Effective Therapy',
    subtitle: 'Master attending, reflecting, clarifying, and summarizing skills',
    description: 'Active listening is the bedrock skill upon which all effective therapy is built. Yet in the demands of clinical work, even experienced clinicians can fall into patterns that diminish their listening effectiveness. This refresher course revisits the essential components of active listening—attending, reflecting, clarifying, and summarizing—with practical techniques to deepen your presence and connection with clients.',
    thumbnail: '/images/courses/active-listening.jpg',
    accessType: 'free',
    price: 0,
    ceuEligible: true,
    ceuHours: 1.0,
    ceuCategories: [{ category: 'Clinical', hours: 1.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Identify the components of active listening and barriers that interfere with it',
      'Demonstrate effective attending behaviors that communicate presence',
      'Apply reflection techniques that deepen client exploration',
      'Utilize clarifying and summarizing skills to enhance understanding'
    ],
    modules: [
      {
        title: 'The Art of Attending',
        order: 1,
        lessons: [
          { title: 'Active Listening Skills', type: 'video', content: 'SOLER and attending behaviors demonstration.', videoUrl: 'https://www.youtube.com/watch?v=7wUCyjiyXdg', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Reflection Skills',
        order: 2,
        lessons: [
          { title: 'Reflection of Feeling', type: 'video', content: 'Reflecting content, feeling, and meaning with Carl Rogers.', videoUrl: 'https://www.youtube.com/watch?v=2nicegVwN1M', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Clarifying and Summarizing',
        order: 3,
        lessons: [
          { title: 'Summarizing in Counseling', type: 'video', content: 'Using clarification and summaries effectively.', videoUrl: 'https://www.youtube.com/watch?v=4VOubVB4CTc', duration: 8, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'The SOLER acronym refers to:', type: 'multiple_choice', options: ['A theoretical orientation', 'Physical attending behaviors', 'A type of intervention', 'Documentation practices'], correctAnswer: 1 },
              { question: 'Active listening differs from passive hearing in that it:', type: 'multiple_choice', options: ['Requires less effort', 'Involves deliberate, skilled presence and engagement', 'Focuses only on content', 'Avoids eye contact'], correctAnswer: 1 },
              { question: 'Reflection of feeling involves:', type: 'multiple_choice', options: ['Repeating exact words', 'Naming the emotion underlying the client\'s communication', 'Asking many questions', 'Giving advice'], correctAnswer: 1 },
              { question: 'A common barrier to effective listening is:', type: 'multiple_choice', options: ['Making eye contact', 'Thinking about what to say next while the client talks', 'Reflecting content', 'Summarizing'], correctAnswer: 1 },
              { question: 'Paraphrasing is:', type: 'multiple_choice', options: ['Repeating verbatim', 'Restating the essence in your own words', 'Changing the subject', 'Interpreting unconscious content'], correctAnswer: 1 },
              { question: 'Clarifying questions should be:', type: 'multiple_choice', options: ['Long and complex', 'Brief, specific, and arising from genuine uncertainty', 'Avoided entirely', 'Interrogating'], correctAnswer: 1 },
              { question: 'Session summaries serve to:', type: 'multiple_choice', options: ['End sessions abruptly', 'Demonstrate listening and create coherence', 'Introduce new topics', 'Avoid reflecting'], correctAnswer: 1 },
              { question: 'Reflection of meaning connects:', type: 'multiple_choice', options: ['Only words to words', 'Feelings to underlying values or significance', 'Nothing important', 'Session to session'], correctAnswer: 1 },
              { question: 'Mental attending involves:', type: 'multiple_choice', options: ['Physical posture only', 'Clearing your mind and being fully present', 'Planning interventions', 'Taking extensive notes'], correctAnswer: 1 },
              { question: 'The therapeutic relationship\'s strength depends significantly on:', type: 'multiple_choice', options: ['The clinician\'s theoretical orientation only', 'The client\'s experience of being heard', 'Session length', 'Diagnosis'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'The skilled helper (10th ed.)', author: 'Egan, G.', year: 2014, source: 'Cengage Learning' },
      { title: 'Intentional interviewing and counseling (9th ed.)', author: 'Ivey, A. E., Ivey, M. B., & Zalaquett, C. P.', year: 2018, source: 'Cengage Learning' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },
  {
    slug: 'mindfulness-introduction',
    title: 'Introduction to Mindfulness in Clinical Practice',
    subtitle: 'Learn foundational mindfulness principles and practical techniques',
    description: 'Mindfulness has moved from contemplative traditions into mainstream mental health treatment, with robust evidence supporting its effectiveness for depression, anxiety, and stress. This introductory 1-hour course provides clinicians with foundational understanding of mindfulness principles and practical techniques for integrating mindfulness into therapy.',
    thumbnail: '/images/courses/mindfulness-intro.jpg',
    accessType: 'free',
    price: 0,
    ceuEligible: true,
    ceuHours: 1.0,
    ceuCategories: [{ category: 'Clinical', hours: 1.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Define mindfulness and its core components from a clinical perspective',
      'Summarize the evidence base for mindfulness-based interventions',
      'Teach basic mindfulness techniques to clients',
      'Integrate brief mindfulness practices into standard therapy sessions'
    ],
    modules: [
      {
        title: 'Understanding Mindfulness',
        order: 1,
        lessons: [
          { title: 'What is Mindfulness?', type: 'video', content: 'Definition, key concepts, and Jon Kabat-Zinn\'s framework.', videoUrl: 'https://www.youtube.com/watch?v=HmEo6RI4Wvs', duration: 10, order: 1 }
        ]
      },
      {
        title: 'The Evidence Base',
        order: 2,
        lessons: [
          { title: 'Mindfulness for Anxiety and Depression', type: 'video', content: 'Research support and mechanisms of change.', videoUrl: 'https://www.youtube.com/watch?v=yMz_UzBd8GM', duration: 12, order: 1 }
        ]
      },
      {
        title: 'Practical Application',
        order: 3,
        lessons: [
          { title: 'Simple Mindfulness Exercises', type: 'video', content: 'Teaching mindfulness to clients and integration tips.', videoUrl: 'https://www.youtube.com/watch?v=SEfs5TJZ6Nk', duration: 9, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Mindfulness is best defined as:', type: 'multiple_choice', options: ['Emptying the mind', 'Paying attention on purpose, in the present moment, non-judgmentally', 'Relaxation only', 'Religious practice'], correctAnswer: 1 },
              { question: 'The three key components of mindfulness are:', type: 'multiple_choice', options: ['Past, present, future', 'Intention, attention, attitude', 'Breathing, sitting, walking', 'Analysis, judgment, action'], correctAnswer: 1 },
              { question: 'MBCT has strong evidence for:', type: 'multiple_choice', options: ['Treating psychosis', 'Preventing depression relapse', 'Curing all anxiety', 'Replacing medication'], correctAnswer: 1 },
              { question: '"Decentering" in mindfulness refers to:', type: 'multiple_choice', options: ['Avoiding all thoughts', 'Seeing thoughts as mental events rather than facts', 'Physical balance', 'Ignoring emotions'], correctAnswer: 1 },
              { question: 'The STOP practice includes:', type: 'multiple_choice', options: ['Stop, Think, Observe, Proceed', 'Stop, Take a breath, Observe, Proceed', 'Sit, Talk, Open, Practice', 'Start, Try, Overcome, Persist'], correctAnswer: 1 },
              { question: 'When teaching mindfulness, clinicians should:', type: 'multiple_choice', options: ['Expect no wandering minds', 'Normalize wandering minds and emphasize gentle return', 'Only teach 30-minute meditations', 'Avoid practicing themselves'], correctAnswer: 1 },
              { question: 'Research on mindfulness shows:', type: 'multiple_choice', options: ['No evidence of effectiveness', 'Moderate effect sizes for anxiety and depression', 'Only placebo effects', 'Harmful outcomes'], correctAnswer: 1 },
              { question: 'Acceptance in mindfulness means:', type: 'multiple_choice', options: ['Approval of everything', 'Willingness to experience what is without fighting it', 'Giving up', 'Ignoring problems'], correctAnswer: 1 },
              { question: 'Mindfulness-Based Stress Reduction (MBSR) is:', type: 'multiple_choice', options: ['A medication', 'An 8-week evidence-based program', 'Only for medical patients', 'Unstructured meditation'], correctAnswer: 1 },
              { question: 'Brief mindfulness practices can be:', type: 'multiple_choice', options: ['Only done in retreats', 'Integrated into standard therapy sessions', 'Never effective', 'Only for Buddhist clients'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Full catastrophe living (Revised ed.)', author: 'Kabat-Zinn, J.', year: 2013, source: 'Bantam Books' },
      { title: 'Mindfulness-based cognitive therapy for depression (2nd ed.)', author: 'Segal, Z. V., Williams, J. M. G., & Teasdale, J. D.', year: 2013, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },
  {
    slug: 'therapeutic-rapport',
    title: 'Building Therapeutic Rapport: The First Sessions',
    subtitle: 'Build trust in first sessions and repair alliance ruptures',
    description: 'The therapeutic alliance is the most consistent predictor of positive outcomes across all therapeutic approaches. This practical 1-hour course focuses on the critical first sessions where rapport is established. Learn specific strategies for building trust, managing client anxiety, navigating the intake process while maintaining connection, and recovering when early sessions go poorly.',
    thumbnail: '/images/courses/therapeutic-rapport.jpg',
    accessType: 'free',
    price: 0,
    ceuEligible: true,
    ceuHours: 1.0,
    ceuCategories: [{ category: 'Clinical', hours: 1.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Explain the research on therapeutic alliance and its impact on outcomes',
      'Implement strategies for building rapport in the first session',
      'Balance information gathering with relationship building during intake',
      'Respond to alliance ruptures early in treatment'
    ],
    modules: [
      {
        title: 'The Alliance Matters',
        order: 1,
        lessons: [
          { title: 'The Therapeutic Alliance', type: 'video', content: 'Research overview and Bordin\'s alliance components.', videoUrl: 'https://www.youtube.com/watch?v=QL4VWT5TGnI', duration: 10, order: 1 }
        ]
      },
      {
        title: 'The First Session',
        order: 2,
        lessons: [
          { title: 'First Session Tips', type: 'video', content: 'Building rapport from the first moments.', videoUrl: 'https://www.youtube.com/watch?v=mqCjGRBz9ic', duration: 12, order: 1 }
        ]
      },
      {
        title: 'When Rapport Falters',
        order: 3,
        lessons: [
          { title: 'Repairing Alliance Ruptures', type: 'video', content: 'Recognizing and repairing ruptures.', videoUrl: 'https://www.youtube.com/watch?v=7MJvPLqhVhk', duration: 9, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'Research shows therapeutic alliance:', type: 'multiple_choice', options: ['Has no impact on outcomes', 'Is a consistent predictor of outcomes across approaches', 'Only matters in psychodynamic therapy', 'Is less important than technique'], correctAnswer: 1 },
              { question: 'Bordin\'s alliance components include:', type: 'multiple_choice', options: ['Bond, goals, and tasks', 'Diagnosis, treatment, and termination', 'Intake, middle phase, ending', 'Rapport, empathy, genuineness'], correctAnswer: 0 },
              { question: 'In the first session, clinicians should:', type: 'multiple_choice', options: ['Focus only on paperwork', 'Balance information gathering with relationship building', 'Avoid asking any questions', 'Diagnose immediately'], correctAnswer: 1 },
              { question: 'A sign of alliance rupture might be:', type: 'multiple_choice', options: ['Client engagement', 'Client withdrawal or expressed dissatisfaction', 'Successful homework', 'On-time attendance'], correctAnswer: 1 },
              { question: 'When a rupture occurs, the therapist should:', type: 'multiple_choice', options: ['Ignore it', 'Notice it, take responsibility if appropriate, and invite feedback', 'Terminate treatment', 'Blame the client'], correctAnswer: 1 },
              { question: 'Orienting clients at the start:', type: 'multiple_choice', options: ['Wastes time', 'Reduces anxiety by explaining what will happen', 'Should be avoided', 'Only applies to children'], correctAnswer: 1 },
              { question: 'Client perception of alliance:', type: 'multiple_choice', options: ['Matters less than therapist perception', 'Matters more than therapist perception for predicting outcomes', 'Is irrelevant', 'Cannot be measured'], correctAnswer: 1 },
              { question: 'When gathering intake information, clinicians should:', type: 'multiple_choice', options: ['Use rapid-fire questions', 'Explain why they\'re asking and acknowledge emotional content', 'Avoid all history', 'Complete all forms before speaking'], correctAnswer: 1 },
              { question: 'Alliance ruptures that are repaired:', type: 'multiple_choice', options: ['Always damage the relationship permanently', 'May actually strengthen the alliance', 'Should never happen', 'Indicate therapist incompetence'], correctAnswer: 1 },
              { question: 'Early alliance (by session 3):', type: 'multiple_choice', options: ['Has no relationship to eventual outcome', 'Predicts eventual treatment outcome', 'Cannot be assessed', 'Only matters for long-term therapy'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Psychotherapy relationships that work III', author: 'Norcross, J. C., & Lambert, M. J.', year: 2018, source: 'Psychotherapy, 55(4), 303-315' },
      { title: 'Negotiating the therapeutic alliance', author: 'Safran, J. D., & Muran, J. C.', year: 2000, source: 'Guilford Press' }
    ],
    presenter: { name: 'CounselorReady', credentials: 'NBCC-Approved Provider', presenterCategory: 'category1' },
    settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
    status: 'published',
    publishedAt: new Date()
  },
  {
    slug: 'psychiatric-medications-basics',
    title: 'Psychiatric Medications: What Non-Prescribers Need to Know',
    subtitle: 'Understand common psychiatric medications and collaborate with prescribers',
    description: 'Many therapy clients take psychiatric medications, yet non-prescribing clinicians often receive minimal training in psychopharmacology. This practical 1-hour course provides foundational knowledge of common psychiatric medications—antidepressants, anxiolytics, mood stabilizers, and antipsychotics. Learn what these medications do, common side effects, and how to collaborate effectively with prescribers.',
    thumbnail: '/images/courses/psych-meds.jpg',
    accessType: 'free',
    price: 0,
    ceuEligible: true,
    ceuHours: 1.0,
    ceuCategories: [{ category: 'Clinical', hours: 1.0 }],
    approvingBody: 'NBCC',
    approvalNumber: '#7760',
    approvals: [{ body: 'NBCC', providerNumber: '#7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved' }],
    objectives: [
      'Identify major classes of psychiatric medications and their primary uses',
      'Recognize common side effects that may affect therapy participation',
      'Explain scope of practice boundaries regarding medication discussions',
      'Collaborate effectively with prescribing providers'
    ],
    modules: [
      {
        title: 'Antidepressants',
        order: 1,
        lessons: [
          { title: 'Antidepressants Explained', type: 'video', content: 'SSRIs, SNRIs, and other antidepressants.', videoUrl: 'https://www.youtube.com/watch?v=OuGt3rgRZzY', duration: 11, order: 1 }
        ]
      },
      {
        title: 'Anxiolytics and Other Medications',
        order: 2,
        lessons: [
          { title: 'Anxiety Medications Overview', type: 'video', content: 'Benzodiazepines, mood stabilizers, and antipsychotics.', videoUrl: 'https://www.youtube.com/watch?v=Hu9ks_yp7lI', duration: 10, order: 1 }
        ]
      },
      {
        title: 'Collaboration and Scope',
        order: 3,
        lessons: [
          { title: 'Working with Prescribers', type: 'video', content: 'Staying in your lane while collaborating effectively.', videoUrl: 'https://www.youtube.com/watch?v=dLVzn_fpJAc', duration: 9, order: 1 },
          {
            title: 'Course Assessment',
            type: 'quiz',
            order: 2,
            questions: [
              { question: 'SSRIs are considered first-line treatment for:', type: 'multiple_choice', options: ['Psychosis', 'Depression and anxiety disorders', 'ADHD only', 'Seizures'], correctAnswer: 1 },
              { question: 'A common side effect of SSRIs is:', type: 'multiple_choice', options: ['Addiction', 'Sexual dysfunction', 'Seizures', 'Psychosis'], correctAnswer: 1 },
              { question: 'Antidepressants typically take how long for full effect?', type: 'multiple_choice', options: ['Hours', 'Days', '2-6 weeks', '6 months'], correctAnswer: 2 },
              { question: 'Benzodiazepines:', type: 'multiple_choice', options: ['Take weeks to work', 'Have no side effects', 'Work quickly but have dependence risk', 'Are first-line for depression'], correctAnswer: 2 },
              { question: 'Non-prescribing clinicians should NOT:', type: 'multiple_choice', options: ['Ask about medication experience', 'Recommend specific medications to clients', 'Coordinate with prescribers', 'Explore medication ambivalence'], correctAnswer: 1 },
              { question: 'Non-prescribing clinicians CAN appropriately:', type: 'multiple_choice', options: ['Advise clients to stop medications', 'Explore side effects and encourage discussion with prescriber', 'Suggest dose changes', 'Prescribe as needed'], correctAnswer: 1 },
              { question: 'Lithium is primarily used for:', type: 'multiple_choice', options: ['Anxiety', 'Bipolar disorder', 'ADHD', 'Insomnia only'], correctAnswer: 1 },
              { question: 'When a client reports problematic side effects, the therapist should:', type: 'multiple_choice', options: ['Tell them to stop the medication', 'Encourage them to discuss it with their prescriber', 'Change the dose', 'Ignore it'], correctAnswer: 1 },
              { question: 'Atypical antipsychotics are sometimes used for:', type: 'multiple_choice', options: ['Only schizophrenia', 'Bipolar disorder and augmenting antidepressants', 'ADHD as first-line treatment', 'Anxiety as first-line treatment'], correctAnswer: 1 },
              { question: 'Coordination with prescribers requires:', type: 'multiple_choice', options: ['No special steps', 'Client consent', 'Prescriber request only', 'Only written communication'], correctAnswer: 1 }
            ],
            shuffleQuestions: true,
            showExplanations: true
          }
        ]
      }
    ],
    references: [
      { title: 'Handbook of clinical psychopharmacology for therapists (8th ed.)', author: 'Preston, J. D., O\'Neal, J. H., & Talaga, M. C.', year: 2017, source: 'New Harbinger' },
      { title: 'Stahl\'s essential psychopharmacology (5th ed.)', author: 'Stahl, S. M.', year: 2021, source: 'Cambridge University Press' }
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

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    let created = 0;
    let skipped = 0;
    
    for (const courseData of freeCourses) {
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
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1].includes('seedCourses.js')) {
  seedCourses();
}

export { freeCourses };
export default seedCourses;
