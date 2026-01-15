/**
 * CounselorReady Course Seed Route
 * 
 * Add to server/src/routes/adminSeed.js
 * Then add to server.js: app.use('/api/admin', require('./src/routes/adminSeed'))
 * 
 * Visit: https://your-api.onrender.com/api/admin/seed-courses?key=YOUR_SECRET
 */

import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// Secret key - change this to something only you know!
const SEED_SECRET = process.env.SEED_SECRET || 'counselorready2025';

// Standard evaluation questions for all courses
const standardEvaluation = [
  { question: 'The learning objectives were clearly stated.', type: 'rating', required: true },
  { question: 'The course content was relevant to my practice.', type: 'rating', required: true },
  { question: 'The course content was presented in an organized manner.', type: 'rating', required: true },
  { question: 'The course increased my knowledge of the subject matter.', type: 'rating', required: true },
  { question: 'I will be able to apply what I learned to my practice.', type: 'rating', required: true },
  { question: 'The post-test accurately assessed the learning objectives.', type: 'rating', required: true },
  { question: 'Overall, I was satisfied with this course.', type: 'rating', required: true },
  { question: 'Would you recommend this course to a colleague?', type: 'yes_no', required: true },
  { question: 'How could this course be improved?', type: 'text', required: false }
];

// Standard settings for all courses
const standardSettings = {
  linearProgression: true,
  certificateEnabled: true,
  passingScore: 70,
  enforceMinTime: true,
  minTimePercent: 80,
  requireEvaluation: true,
  requireAttestation: true,
  attestationText: 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance.'
};

// ============================================
// CLINICAL COURSES (10 courses, 3 hours each)
// ============================================
const clinicalCourses = [
  {
    slug: 'crisis-intervention-stop-drop-roll',
    title: 'Stop, Drop, and Roll: A Comprehensive Guide to Crisis Intervention',
    subtitle: 'Evidence-Based Protocols for Client Emergencies',
    description: 'This 3-hour course equips counselors with systematic, evidence-based protocols for responding to client crises including suicide risk assessment, safety planning, de-escalation, and post-crisis follow-up.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: [
      'Implement the Stop, Drop, and Roll crisis response framework',
      'Administer the Columbia Suicide Severity Rating Scale (C-SSRS)',
      'Develop safety plans using the Stanley-Brown model',
      'Apply evidence-based de-escalation techniques',
      'Differentiate between crisis levels requiring different care',
      'Integrate trauma-informed principles in crisis intervention',
      'Document crisis interventions appropriately',
      'Establish post-crisis follow-up protocols'
    ],
    modules: [
      {
        title: 'Foundations of Crisis Intervention', order: 1,
        lessons: [
          { title: 'Introduction: The Stop, Drop, and Roll Framework', type: 'text', duration: 10, order: 1, content: 'STOP = assess systematically. DROP = de-escalate and stabilize. ROLL = implement safety plan and follow-up.' },
          { title: 'Defining Crisis and Crisis States', type: 'text', duration: 15, order: 2, content: 'A crisis is a time-limited state where usual coping mechanisms are overwhelmed. Types include developmental, situational, existential, and psychiatric crises.' },
          { title: 'Trauma-Informed Crisis Response', type: 'text', duration: 10, order: 3, content: 'SAMHSA four Rs: Realize, Recognize, Respond, Resist re-traumatization.' }
        ]
      },
      {
        title: 'STOP: Systematic Risk Assessment', order: 2,
        lessons: [
          { title: 'The Columbia Suicide Severity Rating Scale', type: 'text', duration: 20, order: 1, content: 'C-SSRS assesses five levels of suicidal ideation and suicidal behavior.' },
          { title: 'Risk Factors vs. Warning Signs', type: 'text', duration: 15, order: 2, content: 'Risk factors increase probability over time. Warning signs indicate acute risk.' }
        ]
      },
      {
        title: 'DROP: De-escalation and Stabilization', order: 3,
        lessons: [
          { title: 'The Art of De-escalation', type: 'text', duration: 20, order: 1, content: 'Speak slowly and calmly, validate distress, offer choices. The counselor\'s calm becomes the client\'s calm.' },
          { title: 'Grounding and Containment', type: 'text', duration: 15, order: 2, content: 'Grounding techniques: 5-4-3-2-1 sensory, physical grounding, breathing exercises.' }
        ]
      },
      {
        title: 'ROLL: Safety Planning and Disposition', order: 4,
        lessons: [
          { title: 'Stanley-Brown Safety Planning', type: 'text', duration: 20, order: 1, content: 'Six steps: Warning signs, Internal coping, Social contacts, People to ask for help, Professionals to contact, Making environment safe.' },
          { title: 'Levels of Care and Documentation', type: 'text', duration: 15, order: 2, content: 'Match disposition to risk level. Document assessment, interventions, rationale, and plan.' },
          { title: 'Post-Crisis Follow-Up', type: 'text', duration: 15, order: 3, content: 'First follow-up within 24-72 hours. Caring contacts. Counselor self-care is essential.' }
        ]
      },
      {
        title: 'Post-Test', order: 5,
        lessons: [{
          title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
          questions: [
            { question: 'In the framework, STOP represents:', type: 'multiple_choice', options: ['Start treatment immediately', 'Stop and assess systematically', 'Stop the client from talking', 'Stop all other appointments'], correctAnswer: 1, explanation: 'STOP means systematically assess the situation.' },
            { question: 'On the C-SSRS, highest severity is:', type: 'multiple_choice', options: ['Level 1: Wish to be dead', 'Level 3: Any methods', 'Level 5: Specific plan and intent', 'Level 2: Non-specific thoughts'], correctAnswer: 2, explanation: 'Level 5 indicates specific plan and intent.' },
            { question: 'Strongest predictor of future suicide:', type: 'multiple_choice', options: ['Family history', 'Previous suicide attempt', 'Substance use', 'Social isolation'], correctAnswer: 1, explanation: 'Previous attempt is the strongest predictor.' },
            { question: 'DROP phase focuses on:', type: 'multiple_choice', options: ['Documentation', 'De-escalation and stabilization', 'Diagnosis', 'Medication'], correctAnswer: 1, explanation: 'DROP = de-escalate, stabilize, connect.' },
            { question: 'Asking about suicide directly:', type: 'multiple_choice', options: ['Plants the idea', 'Only after attempt', 'Does not increase risk', 'Only psychiatrists should ask'], correctAnswer: 2, explanation: 'Research shows direct questions do not increase risk.' },
            { question: 'Safety plan Step 2 is:', type: 'multiple_choice', options: ['Warning signs', 'Internal coping strategies', 'Professional contacts', 'Environment safety'], correctAnswer: 1, explanation: 'Step 2 is internal coping strategies.' },
            { question: 'Means restriction works because:', type: 'multiple_choice', options: ['Removes all risk', 'Crises are time-limited', 'Required by law', 'Eliminates other needs'], correctAnswer: 1, explanation: 'Crises are often time-limited.' },
            { question: 'Involuntary hospitalization is appropriate when:', type: 'multiple_choice', options: ['Any suicidal ideation', 'Imminent danger and less restrictive options insufficient', 'Family requests', 'Only after attempt'], correctAnswer: 1, explanation: 'When imminent danger exists and less restrictive alternatives are insufficient.' },
            { question: 'Post-crisis period research shows:', type: 'multiple_choice', options: ['Risk decreases after discharge', 'Weeks after hospitalization are high-risk', 'Follow-up has no impact', 'No contact needed'], correctAnswer: 1, explanation: 'Post-discharge weeks are particularly high-risk.' },
            { question: 'During de-escalation, avoid:', type: 'multiple_choice', options: ['Speaking slowly', 'Validating distress', 'Arguing with perceptions', 'Calm body language'], correctAnswer: 2, explanation: 'Do not argue with perceptions during de-escalation.' },
            { question: 'Caring contacts involve:', type: 'multiple_choice', options: ['Mandatory daily therapy', 'Brief caring messages', 'Intensive case management', 'Involuntary monitoring'], correctAnswer: 1, explanation: 'Brief, caring messages expressing concern.' },
            { question: 'During crisis, which brain region is offline:', type: 'multiple_choice', options: ['Amygdala', 'Prefrontal cortex', 'Hippocampus', 'Brainstem'], correctAnswer: 1, explanation: 'Prefrontal cortex is partially offline during crisis.' },
            { question: 'Internal coping strategies are:', type: 'multiple_choice', options: ['Professional assistance', 'Activities done alone to self-soothe', 'Medications', 'Emergency contacts'], correctAnswer: 1, explanation: 'Activities the person can do alone.' },
            { question: 'Documentation should NOT include:', type: 'multiple_choice', options: ['Risk assessment', 'Interventions used', 'Personal opinions about character', 'Disposition plan'], correctAnswer: 2, explanation: 'Personal opinions do not belong in documentation.' },
            { question: 'Trauma-informed crisis intervention requires:', type: 'multiple_choice', options: ['Avoiding trauma discussion', 'Prioritizing safety and choice', 'Immediately processing trauma', 'Confrontational techniques'], correctAnswer: 1, explanation: 'Prioritize safety and choice while preventing re-traumatization.' },
            { question: 'SAMHSA Four Rs exclude:', type: 'multiple_choice', options: ['Realize', 'Recognize', 'Require disclosure', 'Resist re-traumatization'], correctAnswer: 2, explanation: 'Require is not part of trauma-informed care.' },
            { question: 'Previous attempts and access to means are:', type: 'multiple_choice', options: ['Protective factors', 'Risk factors', 'Warning signs', 'Coping strategies'], correctAnswer: 1, explanation: 'These are risk factors.' },
            { question: 'First follow-up after high-risk crisis should be:', type: 'multiple_choice', options: ['2-4 weeks', '24-72 hours', 'One month', 'Only if requested'], correctAnswer: 1, explanation: 'First follow-up within 24-72 hours.' },
            { question: 'Step 3 social contacts are for:', type: 'multiple_choice', options: ['Deep crisis discussion', 'Positive distraction', 'Professional help', 'Supervision'], correctAnswer: 1, explanation: 'Step 3 is distraction, not in-depth discussion.' },
            { question: 'Counselor self-care after crisis is:', type: 'multiple_choice', options: ['Optional', 'Essential for effectiveness', 'Unnecessary for experienced', 'Only after client death'], correctAnswer: 1, explanation: 'Essential for maintaining capacity to help others.' }
          ]
        }]
      }
    ]
  },
  {
    slug: 'therapeutic-relationship-mirror-mirror',
    title: 'Mirror, Mirror: The Power of the Therapeutic Relationship',
    subtitle: 'Evidence-Based Foundations for Client Connection',
    description: 'The therapeutic relationship accounts for approximately 30% of outcome variance. This 3-hour course examines alliance research, rupture and repair, transference and countertransference, and Rogers\' core conditions.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Analyze research on therapeutic relationship as outcome predictor', 'Identify Bordin\'s three working alliance components', 'Apply rupture and repair strategies', 'Recognize transference and countertransference patterns', 'Implement Rogers\' core conditions', 'Develop self-awareness practices'],
    modules: [
      { title: 'Research Foundation', order: 1, lessons: [
        { title: 'What Research Tells Us', type: 'text', duration: 20, order: 1, content: 'The therapeutic relationship accounts for approximately 30% of outcome variance.' },
        { title: 'Bordin\'s Working Alliance', type: 'text', duration: 20, order: 2, content: 'Three components: Goals, Tasks, Bond.' }
      ]},
      { title: 'Rupture and Repair', order: 2, lessons: [
        { title: 'Understanding Alliance Ruptures', type: 'text', duration: 25, order: 1, content: 'Types: Withdrawal and Confrontation. Ruptures are opportunities.' },
        { title: 'The Repair Process', type: 'text', duration: 25, order: 2, content: 'Steps: Recognition, Acknowledgment, Exploration, Responsibility, Resolution.' }
      ]},
      { title: 'Transference and Countertransference', order: 3, lessons: [
        { title: 'Transference in Modern Practice', type: 'text', duration: 20, order: 1, content: 'Unconscious redirection of feelings from past relationships onto therapist.' },
        { title: 'Working with Countertransference', type: 'text', duration: 20, order: 2, content: 'Objective and subjective countertransference. Clinically useful when managed.' }
      ]},
      { title: 'Rogers\' Core Conditions', order: 4, lessons: [
        { title: 'Empathy, UPR, and Genuineness', type: 'text', duration: 30, order: 1, content: 'Three necessary conditions for therapeutic change.' }
      ]},
      { title: 'Post-Test', order: 5, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Therapeutic relationship accounts for what % of outcome variance?', type: 'multiple_choice', options: ['10%', '30%', '50%', '70%'], correctAnswer: 1, explanation: 'Approximately 30%.' },
          { question: 'Which is NOT a Bordin alliance component?', type: 'multiple_choice', options: ['Goals', 'Tasks', 'Bond', 'Techniques'], correctAnswer: 3, explanation: 'Techniques is not a component.' },
          { question: 'Withdrawal ruptures are characterized by:', type: 'multiple_choice', options: ['Client anger', 'Client becoming distant/compliant', 'Therapist ending early', 'Missing appointments'], correctAnswer: 1, explanation: 'Client becomes distant or compliant.' },
          { question: 'Successfully repaired ruptures:', type: 'multiple_choice', options: ['Indicate therapy should end', 'Sign of incompetence', 'Can strengthen alliance', 'Should be avoided'], correctAnswer: 2, explanation: 'Can strengthen the alliance.' },
          { question: 'Transference is:', type: 'multiple_choice', options: ['Therapist\'s reaction', 'Unconscious redirection from past relationships', 'Conscious manipulation', 'Only in psychoanalysis'], correctAnswer: 1, explanation: 'Unconscious redirection.' },
          { question: 'Which is NOT a Rogers\' core condition?', type: 'multiple_choice', options: ['Empathy', 'UPR', 'Genuineness', 'Interpretation'], correctAnswer: 3, explanation: 'Interpretation is not one.' },
          { question: 'Countertransference is now viewed as:', type: 'multiple_choice', options: ['Always problematic', 'Clinically useful when managed', 'Only in psychoanalysis', 'Poor training sign'], correctAnswer: 1, explanation: 'Clinically useful when managed.' },
          { question: 'First step in rupture repair:', type: 'multiple_choice', options: ['Apologizing immediately', 'Recognition', 'Referring out', 'Avoiding topic'], correctAnswer: 1, explanation: 'Recognition.' },
          { question: 'Wampold\'s research showed:', type: 'multiple_choice', options: ['Techniques most important', 'Common factors outweigh techniques', 'CBT is superior', 'Relationship doesn\'t matter'], correctAnswer: 1, explanation: 'Common factors outweigh techniques.' },
          { question: 'UPR means:', type: 'multiple_choice', options: ['Approving all behaviors', 'Non-judgmental acceptance as a person', 'Never confronting', 'Agreeing with everything'], correctAnswer: 1, explanation: 'Non-judgmental acceptance.' },
          { question: 'Confrontation ruptures involve:', type: 'multiple_choice', options: ['Therapist confronting', 'Client expressing anger/criticism', 'Avoiding eye contact', 'Therapist ending'], correctAnswer: 1, explanation: 'Client expresses anger or criticism.' },
          { question: 'Objective countertransference refers to:', type: 'multiple_choice', options: ['Based on therapist history', 'Reactions most therapists would have', 'Neutral responses', 'Should be ignored'], correctAnswer: 1, explanation: 'Reactions most therapists would have.' },
          { question: 'Genuineness means:', type: 'multiple_choice', options: ['Sharing all personal info', 'Being authentically present', 'Always agreeing', 'Frequent self-disclosure'], correctAnswer: 1, explanation: 'Being authentically present.' },
          { question: 'Alliance ruptures should be viewed as:', type: 'multiple_choice', options: ['Therapy failures', 'Opportunities', 'Signs to terminate', 'Client pathology'], correctAnswer: 1, explanation: 'Opportunities.' },
          { question: 'Managing countertransference requires:', type: 'multiple_choice', options: ['Eliminating reactions', 'Self-awareness and consultation', 'Keeping reactions private', 'Sharing all with client'], correctAnswer: 1, explanation: 'Self-awareness and consultation.' },
          { question: 'Bond component refers to:', type: 'multiple_choice', options: ['Goal agreement', 'Task agreement', 'Emotional connection quality', 'Relationship length'], correctAnswer: 2, explanation: 'Quality of emotional connection.' },
          { question: 'Empathy according to Rogers:', type: 'multiple_choice', options: ['Feeling sorry', 'Accurately understanding client\'s frame of reference', 'Agreeing with perspective', 'Sharing similar experiences'], correctAnswer: 1, explanation: 'Accurately understanding client\'s frame of reference.' },
          { question: 'Common factors research suggests:', type: 'multiple_choice', options: ['Technique doesn\'t matter at all', 'Relationship is primary vehicle of change', 'All therapies equally effective', 'Training unnecessary'], correctAnswer: 1, explanation: 'Relationship is primary vehicle of change.' },
          { question: 'During repair, counselor stance should be:', type: 'multiple_choice', options: ['Defensive', 'Non-defensive and open', 'Apologetic and self-critical', 'Distant'], correctAnswer: 1, explanation: 'Non-defensive and open.' },
          { question: 'Subjective countertransference is based on:', type: 'multiple_choice', options: ['Client presentation', 'Therapist\'s own history', 'Objective observations', 'Supervision recommendations'], correctAnswer: 1, explanation: 'Therapist\'s personal history.' }
        ]
      }]}
    ]
  },
  {
    slug: 'trauma-elephant-in-room',
    title: 'The Elephant in the Room: Trauma-Informed Clinical Practice',
    subtitle: 'Recognizing and Responding to Trauma',
    description: 'This 3-hour course provides a comprehensive framework for trauma-informed practice, from neurobiology to evidence-based interventions.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Define trauma and distinguish types', 'Explain neurobiological impact of trauma', 'Apply SAMHSA\'s four Rs', 'Recognize common trauma presentations', 'Implement stabilization and grounding', 'Identify evidence-based trauma treatments'],
    modules: [
      { title: 'Understanding Trauma', order: 1, lessons: [
        { title: 'Defining Trauma', type: 'text', duration: 25, order: 1, content: 'Types: acute, chronic, complex, historical/intergenerational, developmental.' },
        { title: 'Neurobiology of Trauma', type: 'text', duration: 25, order: 2, content: 'Hyperactive amygdala, underactive prefrontal cortex, hippocampal changes, altered stress response.' }
      ]},
      { title: 'Trauma-Informed Practice', order: 2, lessons: [
        { title: 'SAMHSA\'s Framework', type: 'text', duration: 20, order: 1, content: 'Four Rs and Six Principles.' },
        { title: 'Avoiding Re-traumatization', type: 'text', duration: 20, order: 2, content: 'Power imbalances, pushing disclosure, confrontational approaches, unsafe environments.' }
      ]},
      { title: 'Clinical Application', order: 3, lessons: [
        { title: 'Stabilization and Grounding', type: 'text', duration: 25, order: 1, content: 'Grounding, containment, resource installation, window of tolerance work.' },
        { title: 'Evidence-Based Treatments', type: 'text', duration: 25, order: 2, content: 'EMDR, CPT, PE, TF-CBT, STAIR.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Complex trauma is characterized by:', type: 'multiple_choice', options: ['Single event', 'Multiple traumas in developmental relationships', 'Only adulthood', 'Doesn\'t meet DSM criteria'], correctAnswer: 1, explanation: 'Multiple traumas in developmental relationships.' },
          { question: 'Trauma causes amygdala to become:', type: 'multiple_choice', options: ['Underactive', 'Hyperactive', 'Unchanged', 'Smaller'], correctAnswer: 1, explanation: 'Hyperactive.' },
          { question: 'Which is NOT one of SAMHSA\'s Four Rs?', type: 'multiple_choice', options: ['Realize', 'Recognize', 'Require', 'Resist'], correctAnswer: 2, explanation: 'Require is not part of the Four Rs.' },
          { question: 'Re-traumatization can occur through:', type: 'multiple_choice', options: ['Too much safety', 'Power imbalances replicating abuse', 'Going too slowly', 'Excessive collaboration'], correctAnswer: 1, explanation: 'Power imbalances.' },
          { question: 'Window of tolerance refers to:', type: 'multiple_choice', options: ['Session length tolerance', 'Optimal arousal zone', 'Time since trauma', 'Tolerance for approach'], correctAnswer: 1, explanation: 'Optimal zone of arousal.' },
          { question: 'Brain\'s alarm system is the:', type: 'multiple_choice', options: ['Prefrontal cortex', 'Hippocampus', 'Amygdala', 'Cerebellum'], correctAnswer: 2, explanation: 'Amygdala.' },
          { question: 'Stabilization includes:', type: 'multiple_choice', options: ['Immediately processing worst trauma', 'Grounding and affect regulation', 'Avoiding trauma discussion', 'Prescribing medication'], correctAnswer: 1, explanation: 'Grounding and affect regulation.' },
          { question: 'Intergenerational trauma refers to:', type: 'multiple_choice', options: ['Multiple incidents', 'Collective trauma passed through generations', 'Multiple family members', 'Different age groups'], correctAnswer: 1, explanation: 'Collective trauma passed through generations.' },
          { question: 'Which is evidence-based trauma treatment?', type: 'multiple_choice', options: ['Rebirthing', 'EMDR', 'Past life regression', 'Primal scream'], correctAnswer: 1, explanation: 'EMDR.' },
          { question: 'SAMHSA principles include all except:', type: 'multiple_choice', options: ['Safety', 'Trustworthiness', 'Confrontation', 'Empowerment'], correctAnswer: 2, explanation: 'Confrontation is not a principle.' },
          { question: 'Prefrontal cortex in trauma survivors often shows:', type: 'multiple_choice', options: ['Increased activity', 'Decreased activity', 'No change', 'Complete shutdown'], correctAnswer: 1, explanation: 'Decreased activity.' },
          { question: 'Grounding techniques are used to:', type: 'multiple_choice', options: ['Punish client', 'Bring client to present moment', 'Avoid trauma', 'End session early'], correctAnswer: 1, explanation: 'Bring client to present moment.' },
          { question: 'Developmental trauma occurs:', type: 'multiple_choice', options: ['Only in adulthood', 'During critical developmental periods', 'Only from single incidents', 'Without lasting effects'], correctAnswer: 1, explanation: 'During critical developmental periods.' },
          { question: 'Containment strategies involve:', type: 'multiple_choice', options: ['Physical restraint', 'Imaginal containers for distressing content', 'Avoiding material', 'Forced hospitalization'], correctAnswer: 1, explanation: 'Imaginal containers.' },
          { question: 'About stabilization:', type: 'multiple_choice', options: ['Should be rushed', 'For some clients it IS the treatment', 'Only for severe cases', 'Always 8 sessions'], correctAnswer: 1, explanation: 'For some clients, stabilization is the treatment.' },
          { question: 'Trauma symptoms should be understood as:', type: 'multiple_choice', options: ['Character flaws', 'Manipulation', 'Brain\'s adaptations', 'Weakness'], correctAnswer: 2, explanation: 'Brain\'s adaptations.' },
          { question: 'Chronic trauma is characterized by:', type: 'multiple_choice', options: ['Single incident', 'Repeated, prolonged exposure', 'Only natural disasters', 'Only adult experiences'], correctAnswer: 1, explanation: 'Repeated, prolonged exposure.' },
          { question: 'Hippocampus is involved in:', type: 'multiple_choice', options: ['Fear response', 'Memory processing', 'Movement', 'Language'], correctAnswer: 1, explanation: 'Memory processing.' },
          { question: 'TF-CBT stands for:', type: 'multiple_choice', options: ['Total Focus CBT', 'Trauma-Focused CBT', 'Therapeutic Foundation CBT', 'Time-Focused Brief Therapy'], correctAnswer: 1, explanation: 'Trauma-Focused CBT.' },
          { question: 'Peer support in trauma-informed care involves:', type: 'multiple_choice', options: ['Only professional consultation', 'Support from others with lived experience', 'Avoiding groups', 'Peer review'], correctAnswer: 1, explanation: 'Support from others with lived experience.' }
        ]
      }]}
    ]
  },
  {
    slug: 'family-systems-takes-village',
    title: 'It Takes a Village: Family Systems Theory in Practice',
    subtitle: 'Understanding Individuals in Context',
    description: 'This 3-hour course examines how family systems theory transforms clinical work with individuals, couples, and families.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Apply Bowen Family Systems concepts', 'Construct genograms', 'Assess family structure', 'Implement structural family therapy interventions', 'Recognize triangulation patterns', 'Integrate systems thinking with individual therapy'],
    modules: [
      { title: 'Foundations of Family Systems', order: 1, lessons: [
        { title: 'Systems Thinking', type: 'text', duration: 20, order: 1, content: 'Wholeness, Homeostasis, Circular causality, Equifinality.' },
        { title: 'Bowen Theory', type: 'text', duration: 25, order: 2, content: 'Eight concepts including differentiation, triangles, multigenerational transmission.' }
      ]},
      { title: 'Assessment Tools', order: 2, lessons: [
        { title: 'Constructing Genograms', type: 'text', duration: 30, order: 1, content: 'Visual map of family relationships across generations.' }
      ]},
      { title: 'Structural Family Therapy', order: 3, lessons: [
        { title: 'Structure: Boundaries, Hierarchies, Subsystems', type: 'text', duration: 25, order: 1, content: 'Rigid, clear, and diffuse boundaries.' },
        { title: 'Structural Interventions', type: 'text', duration: 25, order: 2, content: 'Joining, Enactment, Restructuring, Unbalancing, Boundary making.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Circular causality means:', type: 'multiple_choice', options: ['One person causes problems', 'Behaviors influence each other reciprocally', 'Problems go in circles', 'Therapy never ends'], correctAnswer: 1, explanation: 'Behaviors influence each other reciprocally.' },
          { question: 'Differentiation of self refers to:', type: 'multiple_choice', options: ['Being selfish', 'Separating thinking from feeling while remaining connected', 'Cutting off from family', 'Being different from everyone'], correctAnswer: 1, explanation: 'Separating thinking from feeling while remaining connected.' },
          { question: 'A triangle is:', type: 'multiple_choice', options: ['Geometric shape in diagrams', 'Three-person emotional system', 'Three generations', 'Type of boundary'], correctAnswer: 1, explanation: 'Three-person emotional system.' },
          { question: 'Genograms are used to:', type: 'multiple_choice', options: ['Test for genetic diseases', 'Map family relationships across generations', 'Diagnose mental illness', 'Determine custody'], correctAnswer: 1, explanation: 'Map family relationships.' },
          { question: 'Diffuse boundaries are characterized by:', type: 'multiple_choice', options: ['Clear separation', 'Enmeshment and overinvolvement', 'No contact', 'Appropriate hierarchy'], correctAnswer: 1, explanation: 'Enmeshment and overinvolvement.' },
          { question: 'Homeostasis refers to:', type: 'multiple_choice', options: ['Family homogeneity', 'Tendency to resist change', 'Same rules for everyone', 'Living in same home'], correctAnswer: 1, explanation: 'Tendency to resist change.' },
          { question: 'Emotional cutoff involves:', type: 'multiple_choice', options: ['Healthy boundaries', 'Managing anxiety through distance', 'Good communication', 'Effective problem-solving'], correctAnswer: 1, explanation: 'Managing anxiety through distance.' },
          { question: 'In structural therapy, joining means:', type: 'multiple_choice', options: ['Family members joining', 'Therapist building alliance with family', 'Joining support group', 'Combining families'], correctAnswer: 1, explanation: 'Therapist building alliance.' },
          { question: 'Family projection process describes:', type: 'multiple_choice', options: ['Future projections', 'Transmission of parental anxiety to children', 'Projecting images', 'Children projecting onto parents'], correctAnswer: 1, explanation: 'Transmission of parental anxiety to children.' },
          { question: 'Rigid boundaries lead to:', type: 'multiple_choice', options: ['Enmeshment', 'Disengagement and lack of contact', 'Healthy functioning', 'Clear communication'], correctAnswer: 1, explanation: 'Disengagement.' },
          { question: 'Enactment involves:', type: 'multiple_choice', options: ['Role-playing with actors', 'Having family interact in session', 'Acting out symptoms', 'Enacting laws'], correctAnswer: 1, explanation: 'Having family interact in session.' },
          { question: 'Multigenerational transmission explains:', type: 'multiple_choice', options: ['How genes pass down', 'How patterns pass across generations', 'Multi-family therapy', 'Adoption'], correctAnswer: 1, explanation: 'How patterns pass across generations.' },
          { question: 'Family subsystems include:', type: 'multiple_choice', options: ['Only parents', 'Parental, sibling, spousal', 'Only children', 'Only extended family'], correctAnswer: 1, explanation: 'Parental, sibling, spousal.' },
          { question: 'Equifinality means:', type: 'multiple_choice', options: ['All families end up same', 'Different paths can lead to same outcome', 'Endings are final', 'Equal treatment of members'], correctAnswer: 1, explanation: 'Different paths can lead to same outcome.' },
          { question: 'Triangulation occurs when:', type: 'multiple_choice', options: ['Three people meet', 'Two manage anxiety by involving third', 'Triangles drawn on genogram', 'Three generations present'], correctAnswer: 1, explanation: 'Two manage anxiety by involving a third.' },
          { question: 'Unbalancing involves:', type: 'multiple_choice', options: ['Creating instability', 'Supporting one member to shift power dynamics', 'Unbalanced billing', 'Unequal sessions'], correctAnswer: 1, explanation: 'Supporting one member to shift power dynamics.' },
          { question: 'Sibling position concept suggests:', type: 'multiple_choice', options: ['Siblings should be equal', 'Birth order influences personality', 'Specific seating positions', 'Only children are problematic'], correctAnswer: 1, explanation: 'Birth order influences personality.' },
          { question: 'Healthy family structure includes:', type: 'multiple_choice', options: ['Rigid boundaries', 'Diffuse boundaries', 'Clear boundaries with appropriate hierarchy', 'No boundaries'], correctAnswer: 2, explanation: 'Clear boundaries with appropriate hierarchy.' },
          { question: 'Identified patient is:', type: 'multiple_choice', options: ['Sickest member', 'Member carrying symptom for system', 'Person identifying as needing help', 'Patient ID card'], correctAnswer: 1, explanation: 'Member carrying symptom for system.' },
          { question: 'Restructuring aims to:', type: 'multiple_choice', options: ['Rebuild home', 'Change family organization and patterns', 'Structure session', 'Restructure fees'], correctAnswer: 1, explanation: 'Change family organization and patterns.' }
        ]
      }]}
    ]
  },
  {
    slug: 'anxiety-walking-on-eggshells',
    title: 'Walking on Eggshells: Understanding and Treating Anxiety Disorders',
    subtitle: 'Evidence-Based Approaches to Clinical Anxiety',
    description: 'This 3-hour course provides comprehensive training in understanding and treating anxiety disorders.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Differentiate between anxiety disorders', 'Explain neurobiology of anxiety', 'Implement exposure-based interventions', 'Apply cognitive restructuring', 'Utilize acceptance-based approaches', 'Develop comprehensive treatment plans'],
    modules: [
      { title: 'Understanding Anxiety', order: 1, lessons: [
        { title: 'Neurobiology of Anxiety', type: 'text', duration: 25, order: 1, content: 'Amygdala, prefrontal cortex, HPA axis, autonomic nervous system.' },
        { title: 'Differentiating Anxiety Disorders', type: 'text', duration: 25, order: 2, content: 'GAD, Panic Disorder, Social Anxiety, Specific Phobias, Agoraphobia, Separation Anxiety.' }
      ]},
      { title: 'Evidence-Based Interventions', order: 2, lessons: [
        { title: 'Exposure Therapy', type: 'text', duration: 30, order: 1, content: 'In vivo, imaginal, interoceptive. Fear hierarchy. Stay until anxiety decreases.' },
        { title: 'Cognitive Restructuring', type: 'text', duration: 25, order: 2, content: 'Identify thoughts, examine evidence, generate alternatives, behavioral experiments.' }
      ]},
      { title: 'Acceptance-Based Approaches', order: 3, lessons: [
        { title: 'ACT for Anxiety', type: 'text', duration: 25, order: 1, content: 'Acceptance, Defusion, Present moment, Self-as-context, Values, Committed action.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Brain structure most associated with anxiety:', type: 'multiple_choice', options: ['Hippocampus', 'Amygdala', 'Cerebellum', 'Occipital lobe'], correctAnswer: 1, explanation: 'Amygdala.' },
          { question: 'GAD is characterized by:', type: 'multiple_choice', options: ['Panic attacks', 'Specific object fear', 'Chronic diffuse worry across domains', 'Social situation fear'], correctAnswer: 2, explanation: 'Chronic diffuse worry.' },
          { question: 'In exposure therapy, clients should:', type: 'multiple_choice', options: ['Escape when anxiety increases', 'Stay until anxiety decreases', 'Only imagine situations', 'Avoid all feared stimuli'], correctAnswer: 1, explanation: 'Stay until anxiety decreases.' },
          { question: 'Interoceptive exposure involves:', type: 'multiple_choice', options: ['Exposure to feared objects', 'Inducing feared physical sensations', 'Internal reflection', 'Intercepting negative thoughts'], correctAnswer: 1, explanation: 'Inducing feared physical sensations.' },
          { question: 'Catastrophizing is:', type: 'multiple_choice', options: ['Coping strategy', 'Overestimating severity of negative outcomes', 'Relaxation technique', 'Acceptance approach'], correctAnswer: 1, explanation: 'Overestimating severity.' },
          { question: 'A fear hierarchy is:', type: 'multiple_choice', options: ['Random fear list', 'Ranked list from least to most anxiety-provoking', 'Diagnostic tool', 'Medication type'], correctAnswer: 1, explanation: 'Ranked from least to most anxiety-provoking.' },
          { question: 'Social anxiety involves fear of:', type: 'multiple_choice', options: ['Being alone', 'Evaluation and social situations', 'Specific objects', 'Leaving home'], correctAnswer: 1, explanation: 'Evaluation and social situations.' },
          { question: 'In ACT, defusion means:', type: 'multiple_choice', options: ['Arguing with thoughts', 'Changing relationship to thoughts', 'Removing fuses', 'Ignoring all thoughts'], correctAnswer: 1, explanation: 'Changing relationship to thoughts.' },
          { question: 'ACT\'s goal is:', type: 'multiple_choice', options: ['Anxiety elimination', 'Psychological flexibility', 'Cognitive restructuring', 'Childhood insight'], correctAnswer: 1, explanation: 'Psychological flexibility.' },
          { question: 'Panic disorder is characterized by:', type: 'multiple_choice', options: ['Constant worry', 'Recurrent unexpected panic attacks', 'Specific object fear', 'Social avoidance'], correctAnswer: 1, explanation: 'Recurrent unexpected panic attacks.' },
          { question: 'Most effective intervention for anxiety is:', type: 'multiple_choice', options: ['Medication alone', 'Exposure', 'Insight therapy', 'Relaxation only'], correctAnswer: 1, explanation: 'Exposure.' },
          { question: 'Cognitive restructuring involves:', type: 'multiple_choice', options: ['Restructuring brain', 'Examining and challenging anxious thoughts', 'Avoiding negative thinking', 'Positive affirmations only'], correctAnswer: 1, explanation: 'Examining and challenging anxious thoughts.' },
          { question: 'Specific phobias are characterized by:', type: 'multiple_choice', options: ['Fear across domains', 'Circumscribed fear of specific objects/situations', 'Panic attack fear', 'Social evaluation fear'], correctAnswer: 1, explanation: 'Circumscribed fear.' },
          { question: 'Prefrontal cortex in anxiety is often:', type: 'multiple_choice', options: ['Hyperactive', 'Underactive', 'Unchanged', 'Completely inactive'], correctAnswer: 1, explanation: 'Underactive.' },
          { question: 'Values clarification in ACT helps clients:', type: 'multiple_choice', options: ['Eliminate anxiety', 'Identify what matters most to guide behavior', 'Avoid valued activities', 'Value money above all'], correctAnswer: 1, explanation: 'Identify what matters most.' },
          { question: 'Agoraphobia involves fear of:', type: 'multiple_choice', options: ['Spiders', 'Only open spaces', 'Situations where escape might be difficult', 'Social situations'], correctAnswer: 2, explanation: 'Situations where escape might be difficult.' },
          { question: 'Behavioral experiments involve:', type: 'multiple_choice', options: ['Laboratory research', 'Testing predictions through experience', 'Experimenting with medications', 'Animal studies'], correctAnswer: 1, explanation: 'Testing predictions through experience.' },
          { question: 'Intolerance of uncertainty is common in:', type: 'multiple_choice', options: ['Only specific phobias', 'GAD and many anxiety disorders', 'Only panic disorder', 'Non-clinical populations'], correctAnswer: 1, explanation: 'GAD and many anxiety disorders.' },
          { question: 'Imaginal exposure involves:', type: 'multiple_choice', options: ['Real-life confrontation', 'Mental imagery of feared situations', 'Imaging studies', 'Imaginary friends'], correctAnswer: 1, explanation: 'Mental imagery.' },
          { question: 'HPA axis is responsible for:', type: 'multiple_choice', options: ['Visual processing', 'Stress hormone release', 'Language production', 'Motor coordination'], correctAnswer: 1, explanation: 'Stress hormone release.' }
        ]
      }]}
    ]
  },
  {
    slug: 'depression-when-it-rains',
    title: 'When It Rains, It Pours: Comprehensive Depression Treatment',
    subtitle: 'Evidence-Based Approaches to Major Depression',
    description: 'This 3-hour course provides comprehensive training in evidence-based depression treatment.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Differentiate depressive disorders and assess severity', 'Implement Behavioral Activation', 'Apply cognitive therapy techniques', 'Integrate mindfulness approaches', 'Recognize treatment-resistant depression', 'Assess and manage suicide risk'],
    modules: [
      { title: 'Understanding Depression', order: 1, lessons: [
        { title: 'More Than Sadness', type: 'text', duration: 25, order: 1, content: 'Core symptoms: depressed mood, anhedonia, sleep/appetite changes, fatigue, psychomotor changes, worthlessness, concentration difficulties, suicidal ideation.' },
        { title: 'Neurobiology and Models', type: 'text', duration: 20, order: 2, content: 'Neurotransmitter, HPA axis, Neuroplasticity, Behavioral, Cognitive models.' }
      ]},
      { title: 'Behavioral Activation', order: 2, lessons: [
        { title: 'BA: Breaking the Cycle', type: 'text', duration: 30, order: 1, content: 'Action precedes motivation. Activity monitoring, values assessment, activity scheduling, gradual task assignment.' }
      ]},
      { title: 'Cognitive Therapy', order: 3, lessons: [
        { title: 'Beck\'s Cognitive Model', type: 'text', duration: 25, order: 1, content: 'Automatic thoughts, intermediate beliefs, core beliefs. Cognitive triad.' },
        { title: 'Cognitive Techniques', type: 'text', duration: 25, order: 2, content: 'Thought records, examining evidence, alternative perspectives, behavioral experiments, downward arrow.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Anhedonia refers to:', type: 'multiple_choice', options: ['Excessive guilt', 'Loss of pleasure and interest', 'Fear of being alone', 'Excessive sleeping'], correctAnswer: 1, explanation: 'Loss of pleasure and interest.' },
          { question: 'Core principle of Behavioral Activation:', type: 'multiple_choice', options: ['Wait for motivation', 'Action precedes motivation', 'Avoid activities when depressed', 'Focus only on thoughts'], correctAnswer: 1, explanation: 'Action precedes motivation.' },
          { question: 'Beck\'s cognitive triad includes:', type: 'multiple_choice', options: ['Past, present, future', 'Self, world, future', 'Family, friends, work', 'Mind, body, spirit'], correctAnswer: 1, explanation: 'Self, world, future.' },
          { question: 'Core beliefs are:', type: 'multiple_choice', options: ['Surface-level thoughts', 'Deep schemas about self and world', 'Religious beliefs', 'Behavioral patterns'], correctAnswer: 1, explanation: 'Deep schemas.' },
          { question: 'Activity monitoring involves:', type: 'multiple_choice', options: ['Monitoring vital signs', 'Tracking activities and mood', 'Monitoring other people', 'Social media monitoring'], correctAnswer: 1, explanation: 'Tracking activities and mood.' },
          { question: 'Which is NOT a core symptom of depression?', type: 'multiple_choice', options: ['Depressed mood', 'Anhedonia', 'Excessive energy', 'Sleep disturbance'], correctAnswer: 2, explanation: 'Excessive energy is not typical.' },
          { question: 'Automatic thoughts are:', type: 'multiple_choice', options: ['Deep unconscious beliefs', 'Surface-level negative self-talk', 'Always accurate', 'Only about the past'], correctAnswer: 1, explanation: 'Surface-level negative self-talk.' },
          { question: 'Treatment-resistant depression is:', type: 'multiple_choice', options: ['Depression that resists diagnosis', 'Not responding to multiple adequate trials', 'Resistant personality', 'Can\'t be treated'], correctAnswer: 1, explanation: 'Not responding to multiple adequate trials.' },
          { question: 'Downward arrow technique uncovers:', type: 'multiple_choice', options: ['Surface thoughts', 'Underlying core beliefs', 'Future predictions', 'Past trauma'], correctAnswer: 1, explanation: 'Underlying core beliefs.' },
          { question: 'BA addresses depression by:', type: 'multiple_choice', options: ['Increasing medication', 'Addressing withdrawal and inactivity', 'Only focusing on thoughts', 'Hospitalization'], correctAnswer: 1, explanation: 'Addressing withdrawal and inactivity.' },
          { question: 'Values assessment in BA helps:', type: 'multiple_choice', options: ['Increase net worth', 'Identify what matters to guide activities', 'Value themselves more', 'Assess property values'], correctAnswer: 1, explanation: 'Identify what matters.' },
          { question: 'Neurotransmitters implicated in depression:', type: 'multiple_choice', options: ['Only acetylcholine', 'Serotonin, norepinephrine, dopamine', 'Only GABA', 'Only glutamate'], correctAnswer: 1, explanation: 'Serotonin, norepinephrine, dopamine.' },
          { question: 'Thought records help clients:', type: 'multiple_choice', options: ['Remember appointments', 'Capture and examine automatic thoughts', 'Record dreams', 'Take notes in session'], correctAnswer: 1, explanation: 'Capture and examine automatic thoughts.' },
          { question: 'Psychomotor retardation refers to:', type: 'multiple_choice', options: ['Mental retardation', 'Slowed movement and speech', 'Fast movement', 'Normal functioning'], correctAnswer: 1, explanation: 'Slowed movement and speech.' },
          { question: 'MBCT was developed for:', type: 'multiple_choice', options: ['First-episode depression', 'Prevention of depressive relapse', 'Acute mania', 'Anxiety only'], correctAnswer: 1, explanation: 'Prevention of depressive relapse.' },
          { question: 'Intermediate beliefs include:', type: 'multiple_choice', options: ['Deep core schemas', 'Rules and assumptions', 'Automatic thoughts', 'Behavioral patterns'], correctAnswer: 1, explanation: 'Rules and assumptions.' },
          { question: 'Gradual task assignment involves:', type: 'multiple_choice', options: ['Assigning all tasks at once', 'Starting with small, manageable activities', 'Avoiding assignments', 'Only homework'], correctAnswer: 1, explanation: 'Starting with small activities.' },
          { question: 'Depression with psychotic features includes:', type: 'multiple_choice', options: ['Mild symptoms', 'Hallucinations or delusions', 'Only physical symptoms', 'Normal reality testing'], correctAnswer: 1, explanation: 'Hallucinations or delusions.' },
          { question: 'Behavioral model suggests depression maintained by:', type: 'multiple_choice', options: ['Too much reinforcement', 'Reduced reinforcement leading to withdrawal', 'Genetics only', 'Childhood only'], correctAnswer: 1, explanation: 'Reduced reinforcement.' },
          { question: 'Suicide risk assessment should:', type: 'multiple_choice', options: ['Be avoided to prevent planting ideas', 'Be conducted directly and thoroughly', 'Only if family requests', 'Be delegated to psychiatry only'], correctAnswer: 1, explanation: 'Be conducted directly and thoroughly.' }
        ]
      }]}
    ]
  },
  {
    slug: 'change-rome-wasnt-built',
    title: 'Rome Wasn\'t Built in a Day: Stages of Change in Clinical Practice',
    subtitle: 'Motivational Approaches to Behavior Change',
    description: 'This 3-hour course provides comprehensive training in the Transtheoretical Model and Motivational Interviewing.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Identify the six stages of change', 'Match interventions to client stage', 'Implement four processes of MI', 'Apply OARS skills', 'Recognize and respond to sustain talk', 'Integrate motivational approaches'],
    modules: [
      { title: 'Transtheoretical Model', order: 1, lessons: [
        { title: 'Stages of Change', type: 'text', duration: 30, order: 1, content: 'Precontemplation, Contemplation, Preparation, Action, Maintenance, Termination.' },
        { title: 'Stage-Matched Interventions', type: 'text', duration: 25, order: 2, content: 'Match intervention to stage.' }
      ]},
      { title: 'Motivational Interviewing', order: 2, lessons: [
        { title: 'Spirit and Processes', type: 'text', duration: 30, order: 1, content: 'Partnership, Acceptance, Compassion, Evocation. Engaging, Focusing, Evoking, Planning.' },
        { title: 'OARS Skills', type: 'text', duration: 25, order: 2, content: 'Open questions, Affirmations, Reflections, Summaries.' }
      ]},
      { title: 'Advanced MI', order: 3, lessons: [
        { title: 'Working with Resistance', type: 'text', duration: 25, order: 1, content: 'Sustain talk and discord. Roll with rather than confront.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Client seeing no problem is in which stage?', type: 'multiple_choice', options: ['Contemplation', 'Precontemplation', 'Preparation', 'Action'], correctAnswer: 1, explanation: 'Precontemplation.' },
          { question: 'Contemplation is characterized by:', type: 'multiple_choice', options: ['Active change', 'Ambivalence', 'No awareness', 'Sustained change'], correctAnswer: 1, explanation: 'Ambivalence.' },
          { question: 'OARS stands for:', type: 'multiple_choice', options: ['Open questions, Affirmations, Reflections, Summaries', 'Only Ask Relevant Subjects', 'Observe And Respond Sensitively', 'Open Attitudes, Respect, Support'], correctAnswer: 0, explanation: 'Open questions, Affirmations, Reflections, Summaries.' },
          { question: 'Most important OARS skill:', type: 'multiple_choice', options: ['Open questions', 'Affirmations', 'Reflections', 'Summaries'], correctAnswer: 2, explanation: 'Reflections.' },
          { question: 'MI spirit includes all except:', type: 'multiple_choice', options: ['Partnership', 'Confrontation', 'Compassion', 'Evocation'], correctAnswer: 1, explanation: 'Confrontation is not part of MI spirit.' },
          { question: 'Sustain talk is:', type: 'multiple_choice', options: ['Therapist\'s arguments for change', 'Client\'s arguments against change', 'Sustainable conversation', 'Treatment support'], correctAnswer: 1, explanation: 'Client\'s arguments against change.' },
          { question: 'Righting reflex refers to:', type: 'multiple_choice', options: ['Correcting documentation', 'Therapist\'s desire to fix client', 'Writing with right hand', 'Client rights'], correctAnswer: 1, explanation: 'Therapist\'s desire to fix.' },
          { question: 'Change in TTM is:', type: 'multiple_choice', options: ['Linear and predictable', 'Circular with recycling normal', 'Occurring in one session', 'Only forward movement'], correctAnswer: 1, explanation: 'Circular with recycling normal.' },
          { question: 'For precontemplation, appropriate intervention:', type: 'multiple_choice', options: ['Action planning', 'Skills training', 'Raising awareness without pressure', 'Relapse prevention'], correctAnswer: 2, explanation: 'Raising awareness without pressure.' },
          { question: 'Discord in MI refers to:', type: 'multiple_choice', options: ['Musical disagreement', 'Disharmony in therapeutic relationship', 'Client psychopathology', 'Discharge planning'], correctAnswer: 1, explanation: 'Disharmony in therapeutic relationship.' },
          { question: 'Four processes of MI:', type: 'multiple_choice', options: ['Assess, Advise, Agree, Assist', 'Engaging, Focusing, Evoking, Planning', 'Precontemplation, Contemplation, Action, Maintenance', 'Open, Affirm, Reflect, Summarize'], correctAnswer: 1, explanation: 'Engaging, Focusing, Evoking, Planning.' },
          { question: 'Evocation means:', type: 'multiple_choice', options: ['Therapist providing motivation', 'Drawing out client\'s own motivation', 'Evoking emotions', 'Speaking persuasively'], correctAnswer: 1, explanation: 'Drawing out client\'s own motivation.' },
          { question: 'Mismatching interventions to stage:', type: 'multiple_choice', options: ['Accelerates change', 'Increases resistance', 'Has no effect', 'Is recommended'], correctAnswer: 1, explanation: 'Increases resistance.' },
          { question: 'In preparation stage, clients are:', type: 'multiple_choice', options: ['Unaware of problem', 'Ambivalent', 'Intending action, making small changes', 'Maintaining long-term change'], correctAnswer: 2, explanation: 'Intending action.' },
          { question: 'Recommended reflections:questions ratio:', type: 'multiple_choice', options: ['1:2 (more questions)', '2:1 (more reflections)', '1:1 (equal)', 'Questions only'], correctAnswer: 1, explanation: '2:1 (more reflections).' },
          { question: 'Affirmations in MI:', type: 'multiple_choice', options: ['Positive self-statements', 'Recognize client strengths and efforts', 'Affirm therapist expertise', 'Should be avoided'], correctAnswer: 1, explanation: 'Recognize client strengths and efforts.' },
          { question: 'Rolling with resistance means:', type: 'multiple_choice', options: ['Ignoring client concerns', 'Avoiding difficult topics', 'Not confronting but reflecting and exploring', 'Rolling dice in therapy'], correctAnswer: 2, explanation: 'Not confronting but reflecting.' },
          { question: 'Maintenance stage involves:', type: 'multiple_choice', options: ['Making initial change', 'Sustaining change over time', 'Deciding whether to change', 'No effort required'], correctAnswer: 1, explanation: 'Sustaining change over time.' },
          { question: 'Developing discrepancy helps clients:', type: 'multiple_choice', options: ['Feel worse', 'See gap between current behavior and values', 'Create conflict with others', 'Discredit their experiences'], correctAnswer: 1, explanation: 'See gap between behavior and values.' },
          { question: 'Autonomy in MI means:', type: 'multiple_choice', options: ['Therapist makes all decisions', 'Respecting client\'s right to make own choices', 'Automatic responses', 'Working without supervision'], correctAnswer: 1, explanation: 'Respecting client\'s right to choose.' }
        ]
      }]}
    ]
  },
  {
    slug: 'assessment-book-by-cover',
    title: 'Don\'t Judge a Book by Its Cover: Comprehensive Clinical Assessment',
    subtitle: 'Evidence-Based Assessment and Diagnosis',
    description: 'This 3-hour course provides comprehensive training in clinical assessment and diagnosis.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Conduct comprehensive clinical interviews', 'Select and interpret standardized instruments', 'Integrate cultural considerations', 'Formulate accurate DSM-5 diagnoses', 'Develop case conceptualizations', 'Communicate findings effectively'],
    modules: [
      { title: 'The Clinical Interview', order: 1, lessons: [
        { title: 'Intake and Assessment', type: 'text', duration: 30, order: 1, content: 'Presenting problem, psychiatric/medical/family/social history, substance use, MSE, risk assessment.' },
        { title: 'Mental Status Examination', type: 'text', duration: 20, order: 2, content: 'Appearance, Behavior, Speech, Mood/Affect, Thought Process/Content, Perceptions, Cognition, Insight/Judgment.' }
      ]},
      { title: 'Standardized Assessment', order: 2, lessons: [
        { title: 'Common Instruments', type: 'text', duration: 30, order: 1, content: 'PHQ-9, BDI-II, GAD-7, BAI, PCL-5, ACE, AUDIT, DAST.' }
      ]},
      { title: 'Diagnostic Formulation', order: 3, lessons: [
        { title: 'DSM-5 and Diagnosis', type: 'text', duration: 25, order: 1, content: 'Meeting criteria, differential diagnosis, ruling out medical causes, assessing severity.' },
        { title: 'Cultural Considerations', type: 'text', duration: 25, order: 2, content: 'Cultural expressions of distress, culture-bound syndromes, CFI.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'MSE assesses:', type: 'multiple_choice', options: ['Only cognitive function', 'Current mental functioning across domains', 'Historical symptoms', 'Medical conditions only'], correctAnswer: 1, explanation: 'Current mental functioning across domains.' },
          { question: 'PHQ-9 assesses:', type: 'multiple_choice', options: ['Anxiety', 'Depression', 'Trauma', 'Substance use'], correctAnswer: 1, explanation: 'Depression.' },
          { question: 'Affect in MSE refers to:', type: 'multiple_choice', options: ['How client says they feel', 'Observed emotional expression', 'Impact of therapy', 'Affection for therapist'], correctAnswer: 1, explanation: 'Observed emotional expression.' },
          { question: 'GAD-7 screens for:', type: 'multiple_choice', options: ['Depression', 'Generalized anxiety', 'Trauma', 'Psychosis'], correctAnswer: 1, explanation: 'Generalized anxiety.' },
          { question: 'Cultural formulation includes:', type: 'multiple_choice', options: ['Ignoring cultural factors', 'Understanding cultural expressions of distress', 'Applying Western norms to all', 'Assuming all in culture are same'], correctAnswer: 1, explanation: 'Understanding cultural expressions of distress.' },
          { question: 'Differential diagnosis involves:', type: 'multiple_choice', options: ['Different therapists making diagnoses', 'Ruling out other conditions', 'Diagnosing different family members', 'Using different systems'], correctAnswer: 1, explanation: 'Ruling out other conditions.' },
          { question: 'AUDIT screens for:', type: 'multiple_choice', options: ['Depression', 'Anxiety', 'Alcohol use disorders', 'Trauma'], correctAnswer: 2, explanation: 'Alcohol use disorders.' },
          { question: 'Thought process in MSE refers to:', type: 'multiple_choice', options: ['Thought content', 'Organization and coherence of thinking', 'Process of therapy', 'Processing speed'], correctAnswer: 1, explanation: 'Organization and coherence.' },
          { question: 'BDI-II is:', type: 'multiple_choice', options: ['Brief screening', 'Comprehensive depression measure', 'Anxiety assessment', 'Personality test'], correctAnswer: 1, explanation: 'Comprehensive depression measure.' },
          { question: 'Insight in MSE refers to:', type: 'multiple_choice', options: ['Therapist\'s understanding', 'Client\'s awareness of their condition', 'Seeing clearly', 'Insight-oriented approach'], correctAnswer: 1, explanation: 'Client\'s awareness.' },
          { question: 'PCL-5 assesses:', type: 'multiple_choice', options: ['Depression', 'Anxiety', 'PTSD symptoms', 'Personality'], correctAnswer: 2, explanation: 'PTSD symptoms.' },
          { question: 'Mood in MSE is:', type: 'multiple_choice', options: ['What clinician observes', 'What client reports feeling', 'Session atmosphere', 'Mood lighting'], correctAnswer: 1, explanation: 'What client reports feeling.' },
          { question: 'DSM-5 Cultural Formulation Interview:', type: 'multiple_choice', options: ['Should never be used', 'Provides structured guidance for culturally informed assessment', 'Only for non-English speakers', 'Replaces all assessment'], correctAnswer: 1, explanation: 'Provides structured guidance.' },
          { question: 'Standardized instruments:', type: 'multiple_choice', options: ['Replace clinical interview', 'Complement clinical judgment', 'Are always culturally valid', 'Should be avoided'], correctAnswer: 1, explanation: 'Complement clinical judgment.' },
          { question: 'Psychomotor retardation is noted under:', type: 'multiple_choice', options: ['Thought content', 'Behavior', 'Mood', 'Cognition'], correctAnswer: 1, explanation: 'Behavior.' },
          { question: 'ACE assesses:', type: 'multiple_choice', options: ['Anxiety symptoms', 'Adverse childhood experiences', 'Academic performance', 'Alcohol consumption'], correctAnswer: 1, explanation: 'Adverse childhood experiences.' },
          { question: 'Delusions are documented under:', type: 'multiple_choice', options: ['Thought process', 'Thought content', 'Perceptions', 'Behavior'], correctAnswer: 1, explanation: 'Thought content.' },
          { question: 'Culture-bound syndromes:', type: 'multiple_choice', options: ['Don\'t exist', 'Are expressions of distress specific to certain cultures', 'Are same in all cultures', 'Should be ignored'], correctAnswer: 1, explanation: 'Specific to certain cultures.' },
          { question: 'Hallucinations are documented under:', type: 'multiple_choice', options: ['Thought content', 'Thought process', 'Perceptions', 'Cognition'], correctAnswer: 2, explanation: 'Perceptions.' },
          { question: 'Diagnosis should be viewed as:', type: 'multiple_choice', options: ['Label defining person', 'Tool for communication and treatment planning', 'Always permanent', 'Unnecessary'], correctAnswer: 1, explanation: 'Tool for communication and planning.' }
        ]
      }]}
    ]
  },
  {
    slug: 'self-care-stitch-in-time',
    title: 'A Stitch in Time: Preventing Burnout and Compassion Fatigue',
    subtitle: 'Self-Care Strategies for Mental Health Professionals',
    description: 'This 3-hour course addresses occupational hazards of mental health work and sustainable self-care practices.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Clinical', hours: 3 }],
    objectives: ['Differentiate burnout, compassion fatigue, vicarious trauma', 'Identify risk and protective factors', 'Implement evidence-based self-care', 'Develop sustainable practices', 'Recognize when professional help is needed', 'Create personalized self-care plan'],
    modules: [
      { title: 'Understanding the Hazards', order: 1, lessons: [
        { title: 'Burnout, Compassion Fatigue, Vicarious Trauma', type: 'text', duration: 25, order: 1, content: 'Burnout: exhaustion, depersonalization, reduced accomplishment. Compassion fatigue: cost of caring. Vicarious trauma: worldview changes.' },
        { title: 'Risk and Protective Factors', type: 'text', duration: 20, order: 2, content: 'Risk: high caseload, limited control, isolation. Protective: work-life balance, peer support, supervision.' }
      ]},
      { title: 'Evidence-Based Self-Care', order: 2, lessons: [
        { title: 'Physical and Emotional Self-Care', type: 'text', duration: 30, order: 1, content: 'Sleep, exercise, nutrition, relationships, pleasurable activities, mindfulness.' },
        { title: 'Professional Self-Care', type: 'text', duration: 25, order: 2, content: 'Caseload management, boundaries, supervision, continuing education.' }
      ]},
      { title: 'Creating Sustainable Practices', order: 3, lessons: [
        { title: 'Building Your Self-Care Plan', type: 'text', duration: 25, order: 1, content: 'Physical, emotional, professional, spiritual domains.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Three components of burnout:', type: 'multiple_choice', options: ['Sadness, anxiety, anger', 'Emotional exhaustion, depersonalization, reduced accomplishment', 'Tiredness, frustration, boredom', 'Stress, strain, suffering'], correctAnswer: 1, explanation: 'Exhaustion, depersonalization, reduced accomplishment.' },
          { question: 'Compassion fatigue is:', type: 'multiple_choice', options: ['Being tired of clients', 'The cost of caring', 'Character flaw', 'Excuse for poor performance'], correctAnswer: 1, explanation: 'The cost of caring.' },
          { question: 'Vicarious trauma involves:', type: 'multiple_choice', options: ['Being directly traumatized', 'Changes in worldview from client exposure', 'Traumatizing clients', 'Video-based trauma therapy'], correctAnswer: 1, explanation: 'Changes in worldview.' },
          { question: 'Which is a risk factor for burnout?', type: 'multiple_choice', options: ['Work-life balance', 'Peer support', 'High caseload with little control', 'Regular supervision'], correctAnswer: 2, explanation: 'High caseload with little control.' },
          { question: 'Self-care for MH professionals is:', type: 'multiple_choice', options: ['Luxury when there\'s time', 'Professional necessity', 'Selfish', 'Only for new therapists'], correctAnswer: 1, explanation: 'Professional necessity.' },
          { question: 'Depersonalization in burnout:', type: 'multiple_choice', options: ['Losing identity', 'Treating clients as objects', 'Dissociative disorder', 'Personal growth'], correctAnswer: 1, explanation: 'Treating clients as objects.' },
          { question: 'Personal therapy for therapists is:', type: 'multiple_choice', options: ['Sign of weakness', 'Protective factor', 'Never necessary', 'Only for trainees'], correctAnswer: 1, explanation: 'Protective factor.' },
          { question: 'Compassion fatigue can have:', type: 'multiple_choice', options: ['Only gradual onset', 'Rapid onset', 'No onset', 'Onset only at retirement'], correctAnswer: 1, explanation: 'Rapid onset.' },
          { question: 'Caseload management as self-care includes:', type: 'multiple_choice', options: ['Seeing as many as possible', 'Balancing difficulty levels', 'Only seeing easy clients', 'Refusing all new clients'], correctAnswer: 1, explanation: 'Balancing difficulty levels.' },
          { question: 'Protective factor against burnout:', type: 'multiple_choice', options: ['Professional isolation', 'Poor boundaries', 'Regular quality supervision', 'Personal trauma history'], correctAnswer: 2, explanation: 'Regular quality supervision.' },
          { question: 'Boundaries between work and personal life:', type: 'multiple_choice', options: ['Unnecessary for dedicated therapists', 'Essential for sustainable practice', 'Show lack of commitment', 'Should be completely rigid'], correctAnswer: 1, explanation: 'Essential.' },
          { question: 'Physical self-care includes:', type: 'multiple_choice', options: ['Only exercise', 'Sleep, nutrition, exercise, medical care', 'Physical therapy only', 'Physical contact with clients'], correctAnswer: 1, explanation: 'Sleep, nutrition, exercise, medical care.' },
          { question: 'Warning signs of burnout include:', type: 'multiple_choice', options: ['Increased enthusiasm', 'Emotional exhaustion and cynicism', 'Better client outcomes', 'Improved work-life balance'], correctAnswer: 1, explanation: 'Emotional exhaustion and cynicism.' },
          { question: 'Organizational factors in burnout:', type: 'multiple_choice', options: ['Personal trauma history', 'Insufficient support and excessive demands', 'Individual character flaws', 'Client diagnoses'], correctAnswer: 1, explanation: 'Insufficient support and excessive demands.' },
          { question: 'Spiritual/meaning practices in self-care:', type: 'multiple_choice', options: ['Must be religious', 'Can include connection to purpose and values', 'Are irrelevant', 'Are unprofessional'], correctAnswer: 1, explanation: 'Can include connection to purpose and values.' },
          { question: 'Reduced accomplishment in burnout involves:', type: 'multiple_choice', options: ['Actually accomplishing less due to external factors', 'Feeling ineffective even when doing good work', 'Receiving awards', 'Getting promoted'], correctAnswer: 1, explanation: 'Feeling ineffective.' },
          { question: 'Peer support as self-care involves:', type: 'multiple_choice', options: ['Competing with colleagues', 'Connection and shared support', 'Supervising peers', 'Peer pressure'], correctAnswer: 1, explanation: 'Connection and shared support.' },
          { question: 'Continuing education as self-care:', type: 'multiple_choice', options: ['Just a requirement', 'Can prevent stagnation and renew enthusiasm', 'Waste of time', 'Should be avoided'], correctAnswer: 1, explanation: 'Can prevent stagnation.' },
          { question: 'Trauma-heavy caseload:', type: 'multiple_choice', options: ['Has no impact', 'Is risk factor for vicarious trauma', 'Is ideal for all', 'Prevents burnout'], correctAnswer: 1, explanation: 'Risk factor for vicarious trauma.' },
          { question: 'Self-care planning should include:', type: 'multiple_choice', options: ['Only work-related strategies', 'Multiple domains: physical, emotional, professional, spiritual', 'Only physical health', 'Whatever is easiest'], correctAnswer: 1, explanation: 'Multiple domains.' }
        ]
      }]}
    ]
  },
  {
    slug: 'ethics-rock-hard-place',
    title: 'Between a Rock and a Hard Place: Ethical Decision-Making',
    subtitle: 'Navigating Complex Ethical Dilemmas',
    description: 'This 3-hour ethics course provides comprehensive training in ethical decision-making frameworks.',
    ceuHours: 3,
    ceuCategories: [{ category: 'Ethics', hours: 3 }],
    objectives: ['Apply systematic ethical decision-making models', 'Navigate confidentiality exceptions', 'Recognize and manage boundary issues', 'Balance competing ethical obligations', 'Document ethical decision-making', 'Utilize consultation effectively'],
    modules: [
      { title: 'Ethical Foundations', order: 1, lessons: [
        { title: 'Principles and Decision-Making Models', type: 'text', duration: 25, order: 1, content: 'Six principles: Autonomy, Beneficence, Nonmaleficence, Justice, Fidelity, Veracity.' },
        { title: 'Laws, Ethics, and Values', type: 'text', duration: 20, order: 2, content: 'Legal obligations generally take precedence when conflicts arise.' }
      ]},
      { title: 'Confidentiality Challenges', order: 2, lessons: [
        { title: 'Limits and Exceptions', type: 'text', duration: 30, order: 1, content: 'Imminent danger, child/elder abuse, court orders, client consent.' }
      ]},
      { title: 'Boundaries and Relationships', order: 3, lessons: [
        { title: 'Managing Boundaries', type: 'text', duration: 25, order: 1, content: 'Sexual relationships prohibited. Gray areas require judgment and documentation.' },
        { title: 'Multiple Relationships', type: 'text', duration: 25, order: 2, content: 'Not automatically unethical but require careful consideration.' }
      ]},
      { title: 'Post-Test', order: 4, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 30, order: 1,
        questions: [
          { question: 'Principle of autonomy involves:', type: 'multiple_choice', options: ['Therapist\'s independence', 'Respecting client self-determination', 'Automatic responses', 'Automobile safety'], correctAnswer: 1, explanation: 'Respecting client self-determination.' },
          { question: 'Duty to warn/protect is exception when:', type: 'multiple_choice', options: ['Client requests', 'Imminent danger to self or others', 'Therapist is curious', 'Insurance requests'], correctAnswer: 1, explanation: 'Imminent danger.' },
          { question: 'Sexual relationships with current clients are:', type: 'multiple_choice', options: ['Acceptable if consent', 'Absolutely prohibited', 'Gray area', 'Acceptable after termination'], correctAnswer: 1, explanation: 'Absolutely prohibited.' },
          { question: 'When ethics and law conflict:', type: 'multiple_choice', options: ['Ethics always wins', 'Legal obligations generally take precedence', 'Ignore both', 'Personal values decide'], correctAnswer: 1, explanation: 'Legal obligations generally take precedence.' },
          { question: 'Multiple relationships in small communities:', type: 'multiple_choice', options: ['Always unethical', 'May be unavoidable, require careful management', 'Should never be documented', 'Are preferred'], correctAnswer: 1, explanation: 'May be unavoidable.' },
          { question: 'Nonmaleficence means:', type: 'multiple_choice', options: ['Doing good', 'Avoiding harm', 'Not using males in research', 'Being honest'], correctAnswer: 1, explanation: 'Avoiding harm.' },
          { question: 'Beneficence means:', type: 'multiple_choice', options: ['Receiving benefits', 'Promoting client welfare', 'Beneficial exercises', 'Financial benefit'], correctAnswer: 1, explanation: 'Promoting client welfare.' },
          { question: 'When breaking confidentiality, counselors should:', type: 'multiple_choice', options: ['Disclose everything', 'Disclose minimum necessary', 'Never inform client', 'Avoid documentation'], correctAnswer: 1, explanation: 'Disclose minimum necessary.' },
          { question: 'Self-disclosure by therapists is:', type: 'multiple_choice', options: ['Always helpful', 'Always harmful', 'Boundary issue requiring judgment', 'Required by codes'], correctAnswer: 2, explanation: 'Boundary issue requiring judgment.' },
          { question: 'Fidelity refers to:', type: 'multiple_choice', options: ['Being faithful in marriage', 'Keeping promises and commitments', 'High fidelity audio', 'Faithful attendance'], correctAnswer: 1, explanation: 'Keeping promises and commitments.' },
          { question: 'Ethical decision-making model includes:', type: 'multiple_choice', options: ['Quick gut decisions', 'Systematic steps including consultation and documentation', 'Always following personal values', 'Avoiding difficult decisions'], correctAnswer: 1, explanation: 'Systematic steps.' },
          { question: 'Accepting gifts from clients:', type: 'multiple_choice', options: ['Always acceptable', 'Always prohibited', 'Gray area requiring judgment', 'Should never be discussed'], correctAnswer: 2, explanation: 'Gray area.' },
          { question: 'Child abuse reporting is:', type: 'multiple_choice', options: ['Optional', 'Mandated exception to confidentiality', 'Only if parents consent', 'Never appropriate'], correctAnswer: 1, explanation: 'Mandated exception.' },
          { question: 'Informed consent should address:', type: 'multiple_choice', options: ['Only fees', 'Limits of confidentiality among other elements', 'Nothing about confidentiality', 'Only what therapist wants'], correctAnswer: 1, explanation: 'Limits of confidentiality.' },
          { question: 'When facing ethical dilemma, consultation is:', type: 'multiple_choice', options: ['Sign of weakness', 'Recommended practice', 'Never necessary', 'Only for trainees'], correctAnswer: 1, explanation: 'Recommended practice.' },
          { question: 'Veracity means:', type: 'multiple_choice', options: ['Verification of claims', 'Being truthful', 'Verbal communication', 'Variety in treatment'], correctAnswer: 1, explanation: 'Being truthful.' },
          { question: 'Documentation of ethical decision-making:', type: 'multiple_choice', options: ['Is unnecessary', 'Should include rationale and process', 'Should be avoided', 'Only for legal cases'], correctAnswer: 1, explanation: 'Should include rationale and process.' },
          { question: 'Social media connections with clients are:', type: 'multiple_choice', options: ['Always acceptable', 'Always prohibited', 'Boundary issue requiring careful consideration', 'Required for modern practice'], correctAnswer: 2, explanation: 'Boundary issue.' },
          { question: 'Justice in ethics refers to:', type: 'multiple_choice', options: ['Legal system', 'Treating clients fairly and equitably', 'Justifying actions', 'Justice Department'], correctAnswer: 1, explanation: 'Treating clients fairly.' },
          { question: 'Personal values conflicting with client needs should:', type: 'multiple_choice', options: ['Be imposed on client', 'Lead to automatic referral', 'Be managed through consultation, not imposition', 'Be hidden from client'], correctAnswer: 2, explanation: 'Managed through consultation.' }
        ]
      }]}
    ]
  }
];

// ============================================
// ETHICS COURSES (9 courses, 1 hour each)
// ============================================
const ethicsCourses = [
  {
    slug: 'aca-ethics-section-a-counseling-relationship',
    title: 'Building Ethical Counseling Relationships',
    subtitle: 'ACA Code of Ethics Section A',
    description: 'This 1-hour CE course provides an in-depth understanding of Section A of the ACA Code of Ethics.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Identify core professional values', 'Apply informed consent procedures', 'Distinguish acceptable and prohibited relationships', 'Implement appropriate termination practices'],
    modules: [
      { title: 'Client Welfare and Informed Consent', order: 1, lessons: [
        { title: 'Core Values and Client Welfare', type: 'text', duration: 15, order: 1, content: 'Five core values and six principles.' },
        { title: 'Informed Consent Process', type: 'text', duration: 15, order: 2, content: 'Ongoing process including purpose, goals, techniques, credentials, confidentiality limits.' }
      ]},
      { title: 'Boundaries and Termination', order: 2, lessons: [
        { title: 'Avoiding Harm and Boundaries', type: 'text', duration: 15, order: 1, content: 'Sexual relationships prohibited. Document boundary extensions.' },
        { title: 'Termination and Referral', type: 'text', duration: 15, order: 2, content: 'Terminate when services no longer needed. Provide referrals.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Primary responsibility of counselors:', type: 'multiple_choice', options: ['Maintain documentation', 'Respect dignity and promote welfare', 'Follow state regulations', 'Provide evidence-based treatments'], correctAnswer: 1 },
          { question: 'Which is NOT a fundamental ethical principle?', type: 'multiple_choice', options: ['Autonomy', 'Profitability', 'Veracity', 'Fidelity'], correctAnswer: 1 },
          { question: 'Sexual relationships with former clients prohibited for:', type: 'multiple_choice', options: ['Two years', 'Three years', 'Five years minimum', 'Permanently'], correctAnswer: 2 },
          { question: 'When extending boundaries, counselors must:', type: 'multiple_choice', options: ['Get board permission', 'Document rationale and consequences', 'Wait until after termination', 'Avoid all extensions'], correctAnswer: 1 },
          { question: 'Informed consent is:', type: 'multiple_choice', options: ['One-time event', 'Ongoing process', 'Only for minors', 'Optional'], correctAnswer: 1 },
          { question: 'When client cannot give consent:', type: 'multiple_choice', options: ['Refuse services', 'Get parent consent only', 'Seek assent and include appropriately', 'Rely on school consent'], correctAnswer: 2 },
          { question: 'Bartering is:', type: 'multiple_choice', options: ['Always prohibited', 'Permitted if non-harmful and accepted practice', 'Encouraged', 'Only for non-payers'], correctAnswer: 1 },
          { question: 'Counselors should terminate when:', type: 'multiple_choice', options: ['Client disagrees', 'Services no longer needed or beneficial', 'Want to date client', 'Insurance stops paying'], correctAnswer: 1 },
          { question: 'Regarding personal values, counselors should:', type: 'multiple_choice', options: ['Impose them on clients', 'Refrain from imposing and seek training', 'Terminate with differing clients', 'Never discuss values'], correctAnswer: 1 },
          { question: 'Group counseling screening should:', type: 'multiple_choice', options: ['Accept all who want to participate', 'Select those compatible with goals', 'Let group decide', 'Only screen for payment'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-b-confidentiality',
    title: 'Confidentiality and Privacy in Counseling',
    subtitle: 'ACA Code of Ethics Section B',
    description: 'This 1-hour CE course examines Section B covering confidentiality, exceptions, and record management.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Explain confidentiality as fundamental client right', 'Apply exceptions appropriately', 'Manage information sharing ethically', 'Maintain proper record-keeping'],
    modules: [
      { title: 'Confidentiality Foundations', order: 1, lessons: [
        { title: 'The Right to Confidentiality', type: 'text', duration: 20, order: 1, content: 'Clients have right to confidentiality. Limits must be discussed.' },
        { title: 'Exceptions and Mandated Disclosure', type: 'text', duration: 20, order: 2, content: 'Serious harm, child/elder abuse, court orders.' }
      ]},
      { title: 'Information Management', order: 2, lessons: [
        { title: 'Records and Documentation', type: 'text', duration: 20, order: 1, content: 'Maintain for required period. Store securely. Proper disposal.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Confidentiality limits should be discussed:', type: 'multiple_choice', options: ['Only when issues arise', 'At outset and as needed throughout', 'Only in writing', 'Only with minors'], correctAnswer: 1 },
          { question: 'Confidentiality belongs to:', type: 'multiple_choice', options: ['Counselor', 'Client', 'Agency', 'Insurance company'], correctAnswer: 1 },
          { question: 'When breaking confidentiality for harm prevention:', type: 'multiple_choice', options: ['Disclose everything', 'Disclose minimum necessary', 'Refuse to document', 'End relationship'], correctAnswer: 1 },
          { question: 'Mandatory reporting includes:', type: 'multiple_choice', options: ['Client request', 'Child and elder abuse suspicion', 'Insurance requests', 'Family curiosity'], correctAnswer: 1 },
          { question: 'Records should be maintained for:', type: 'multiple_choice', options: ['1 year', 'Required period, typically 7 years', '20 years minimum', 'Forever'], correctAnswer: 1 },
          { question: 'When court orders records:', type: 'multiple_choice', options: ['Immediately provide everything', 'Seek to limit scope', 'Refuse entirely', 'Destroy records'], correctAnswer: 1 },
          { question: 'Electronic records require:', type: 'multiple_choice', options: ['No special security', 'Secure storage and transmission', 'Paper backup', 'Public accessibility'], correctAnswer: 1 },
          { question: 'Client access to records:', type: 'multiple_choice', options: ['Should never be allowed', 'Is a right with limited exceptions', 'Determined by counselor alone', 'Requires court order'], correctAnswer: 1 },
          { question: 'When consulting about a case:', type: 'multiple_choice', options: ['Share all identifying info', 'Minimize identifiable information', 'Never consult', 'Get written consent for all'], correctAnswer: 1 },
          { question: 'Proper record disposal involves:', type: 'multiple_choice', options: ['Regular trash', 'Secure destruction methods', 'Giving to client', 'Keeping forever'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-c-professional-responsibility',
    title: 'Professional Responsibility and Competence',
    subtitle: 'ACA Code of Ethics Section C',
    description: 'This 1-hour CE course covers competence, advertising, credentials, and impairment.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Identify boundaries of competence', 'Apply ethical standards for advertising', 'Recognize signs of impairment', 'Implement ongoing professional development'],
    modules: [
      { title: 'Competence and Credentials', order: 1, lessons: [
        { title: 'Practicing Within Competence', type: 'text', duration: 20, order: 1, content: 'Only accept positions for which qualified. Obtain training.' },
        { title: 'Credentials and Advertising', type: 'text', duration: 20, order: 2, content: 'Claim only earned credentials. No false advertising.' }
      ]},
      { title: 'Impairment', order: 2, lessons: [
        { title: 'Recognizing and Addressing Impairment', type: 'text', duration: 20, order: 1, content: 'Self-monitor. Refrain when impaired. Seek assistance.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Counselors should practice:', type: 'multiple_choice', options: ['Any approach they find interesting', 'Within competence areas', 'Only evidence-based approaches', 'Whatever clients request'], correctAnswer: 1 },
          { question: 'Before working with new population:', type: 'multiple_choice', options: ['Just try it', 'Obtain appropriate training', 'Refuse the work', 'Consult after problems'], correctAnswer: 1 },
          { question: 'When advertising services:', type: 'multiple_choice', options: ['Exaggerate for marketing', 'Make factual, non-misleading claims', 'Promise specific outcomes', 'Avoid all advertising'], correctAnswer: 1 },
          { question: 'Counselors should claim:', type: 'multiple_choice', options: ['Credentials working toward', 'Only credentials earned', 'Whatever sounds impressive', 'No credentials publicly'], correctAnswer: 1 },
          { question: 'When impaired:', type: 'multiple_choice', options: ['Continue working', 'Refrain from practice and seek assistance', 'Ignore if clients don\'t notice', 'Only take easy cases'], correctAnswer: 1 },
          { question: 'Continuing education is:', type: 'multiple_choice', options: ['Optional for experienced', 'Required to maintain competence', 'Only for new counselors', 'Waste of time'], correctAnswer: 1 },
          { question: 'If colleague appears impaired:', type: 'multiple_choice', options: ['Ignore it', 'Address appropriately', 'Report immediately without conversation', 'Compete for their clients'], correctAnswer: 1 },
          { question: 'Cultural competence means:', type: 'multiple_choice', options: ['Treating everyone the same', 'Understanding and respecting diverse backgrounds', 'Only seeing clients from your culture', 'Imposing cultural values'], correctAnswer: 1 },
          { question: 'Sources of impairment include:', type: 'multiple_choice', options: ['Only substance abuse', 'Substance use, mental health, burnout, crises', 'Only physical illness', 'Only relationships'], correctAnswer: 1 },
          { question: 'When situation exceeds competence:', type: 'multiple_choice', options: ['Try anyway', 'Refer or seek consultation', 'Pretend competence', 'Never admit limits'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-d-professional-relationships',
    title: 'Relationships with Professionals and Employers',
    subtitle: 'ACA Code of Ethics Section D',
    description: 'This 1-hour CE course examines relationships with colleagues, employers, and professionals.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Navigate colleague and employer relationships', 'Apply consultation standards', 'Handle disagreements professionally', 'Understand referral ethics'],
    modules: [
      { title: 'Colleague and Employer Relations', order: 1, lessons: [
        { title: 'Working with Colleagues', type: 'text', duration: 20, order: 1, content: 'Respect different approaches. Appropriate referrals. Address ethics violations.' },
        { title: 'Employer Relationships', type: 'text', duration: 20, order: 2, content: 'Understand conditions. Negotiate for ethical practice. Alert employers to conflicts.' }
      ]},
      { title: 'Consultation and Fees', order: 2, lessons: [
        { title: 'Consultation and Referral Ethics', type: 'text', duration: 20, order: 1, content: 'No fee-splitting. Refer based on client needs.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'When disagreeing with employer policies:', type: 'multiple_choice', options: ['Quit immediately', 'Work through proper channels', 'Ignore policies', 'Publicly criticize'], correctAnswer: 1 },
          { question: 'Fee-splitting for referrals is:', type: 'multiple_choice', options: ['Encouraged', 'Prohibited', 'Required in groups', 'Client\'s choice'], correctAnswer: 1 },
          { question: 'Using agency position to recruit for private practice:', type: 'multiple_choice', options: ['Good business', 'Prohibited', 'Encouraged', 'Client\'s right'], correctAnswer: 1 },
          { question: 'On interdisciplinary teams:', type: 'multiple_choice', options: ['Counselors\' opinions prevail', 'Roles should be clearly defined', 'Confidentiality doesn\'t apply', 'Only team leader decides'], correctAnswer: 1 },
          { question: 'Regarding colleague ethics violations:', type: 'multiple_choice', options: ['Always ignore', 'Address appropriately', 'Only report serious ones', 'Mind your business'], correctAnswer: 1 },
          { question: 'Consultation should be:', type: 'multiple_choice', options: ['Within consultant\'s competence', 'On any topic', 'Avoided entirely', 'Only for legal issues'], correctAnswer: 0 },
          { question: 'Commission payments for referrals are:', type: 'multiple_choice', options: ['Expected', 'Prohibited', 'Tax deductible', 'Client\'s decision'], correctAnswer: 1 },
          { question: 'Referral decisions should be based on:', type: 'multiple_choice', options: ['Financial benefit', 'Client needs and welfare', 'Who refers back', 'Personal friendships'], correctAnswer: 1 },
          { question: 'Soliciting clients from other counselors is:', type: 'multiple_choice', options: ['Good marketing', 'Generally prohibited', 'Required for growth', 'Client\'s right'], correctAnswer: 1 },
          { question: 'When employer policies conflict with ethics:', type: 'multiple_choice', options: ['Employer policies win', 'Work to resolve conflicts appropriately', 'Ethics codes irrelevant in agencies', 'Quit without discussion'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-e-evaluation-assessment',
    title: 'Evaluation, Assessment, and Interpretation',
    subtitle: 'ACA Code of Ethics Section E',
    description: 'This 1-hour CE course addresses assessment competence, informed consent, and cultural considerations.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Demonstrate assessment competence', 'Obtain appropriate informed consent', 'Select culturally appropriate instruments', 'Interpret results ethically'],
    modules: [
      { title: 'Assessment Competence', order: 1, lessons: [
        { title: 'Training and Selection', type: 'text', duration: 20, order: 1, content: 'Training in specific instruments. Understand psychometric properties.' },
        { title: 'Informed Consent for Assessment', type: 'text', duration: 20, order: 2, content: 'Nature/purpose, how results used, who has access, confidentiality limits.' }
      ]},
      { title: 'Interpretation', order: 2, lessons: [
        { title: 'Ethical Interpretation', type: 'text', duration: 20, order: 1, content: 'Consider validity. Account for cultural factors. Recognize limitations.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Before using assessment instrument:', type: 'multiple_choice', options: ['Just read the manual', 'Have appropriate training', 'Ask client how to score', 'Use any available'], correctAnswer: 1 },
          { question: 'Informed consent for assessment should include:', type: 'multiple_choice', options: ['Only test name', 'Purpose, use of results, confidentiality limits', 'Warning results might be negative', 'Nothing needed'], correctAnswer: 1 },
          { question: 'Cultural factors in assessment:', type: 'multiple_choice', options: ['Are irrelevant', 'Should be considered in selection and interpretation', 'Only matter for non-English speakers', 'Are client\'s problem'], correctAnswer: 1 },
          { question: 'Assessment results should be:', type: 'multiple_choice', options: ['Shared only with insurance', 'Interpreted considering validity for individual', 'Presented without context', 'Kept secret from clients'], correctAnswer: 1 },
          { question: 'Test security requires:', type: 'multiple_choice', options: ['Sharing items freely', 'Maintaining integrity of materials', 'Publishing answer keys', 'Giving tests to anyone'], correctAnswer: 1 },
          { question: 'When results may be invalid:', type: 'multiple_choice', options: ['Report as valid anyway', 'Note limitations in interpretation', 'Blame client', 'Administer more tests'], correctAnswer: 1 },
          { question: 'Multiple data sources:', type: 'multiple_choice', options: ['Unnecessary', 'Should be used when appropriate', 'Confuse interpretation', 'Required for all'], correctAnswer: 1 },
          { question: 'Obsolete test instruments:', type: 'multiple_choice', options: ['Continue using', 'Should not be used; stay current', 'Use because familiar', 'Sell to others'], correctAnswer: 1 },
          { question: 'Clients have right to:', type: 'multiple_choice', options: ['Never know results', 'Know results in understandable language', 'Demand any test', 'Change results'], correctAnswer: 1 },
          { question: 'Psychometric properties include:', type: 'multiple_choice', options: ['Only cost', 'Reliability and validity information', 'Only length', 'Who published'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-f-supervision',
    title: 'Supervision, Training, and Teaching',
    subtitle: 'ACA Code of Ethics Section F',
    description: 'This 1-hour CE course covers ethical supervision practices and gatekeeping responsibilities.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Apply ethical standards for supervision', 'Implement appropriate supervisory relationships', 'Evaluate supervisee competence ethically', 'Understand gatekeeping responsibilities'],
    modules: [
      { title: 'Supervision Ethics', order: 1, lessons: [
        { title: 'Supervisor Responsibilities', type: 'text', duration: 20, order: 1, content: 'Competence in supervision. Clear informed consent. Regular evaluation.' },
        { title: 'Boundaries in Supervision', type: 'text', duration: 20, order: 2, content: 'Sexual relationships prohibited. Avoid being supervisee\'s therapist.' }
      ]},
      { title: 'Gatekeeping', order: 2, lessons: [
        { title: 'Gatekeeping Responsibilities', type: 'text', duration: 20, order: 1, content: 'Ongoing evaluation. Address skill deficiencies and personal issues affecting practice.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Supervisors should have:', type: 'multiple_choice', options: ['Only clinical experience', 'Training and competence in supervision specifically', 'More years than supervisees', 'A PhD'], correctAnswer: 1 },
          { question: 'Sexual relationships in supervision are:', type: 'multiple_choice', options: ['Acceptable if both consent', 'Prohibited', 'Gray area', 'Encouraged for learning'], correctAnswer: 1 },
          { question: 'Supervisors should provide feedback:', type: 'multiple_choice', options: ['Only at end', 'Regularly throughout', 'Never', 'Only when negative'], correctAnswer: 1 },
          { question: 'If supervisee is impaired:', type: 'multiple_choice', options: ['Ignore it', 'Address as gatekeeping responsibility', 'End supervision without discussion', 'Let them continue'], correctAnswer: 1 },
          { question: 'Supervisor should NOT be supervisee\'s:', type: 'multiple_choice', options: ['Mentor', 'Teacher', 'Personal therapist', 'Role model'], correctAnswer: 2 },
          { question: 'Gatekeeping protects:', type: 'multiple_choice', options: ['Only the supervisor', 'Clients and the profession', 'Only the supervisee', 'Insurance companies'], correctAnswer: 1 },
          { question: 'Evaluation criteria should be:', type: 'multiple_choice', options: ['Kept secret', 'Clear from the start', 'Developed at the end', 'Determined by supervisee'], correctAnswer: 1 },
          { question: 'Dismissal from training is:', type: 'multiple_choice', options: ['Never appropriate', 'Appropriate when necessary', 'Always unfair', 'Only for criminal behavior'], correctAnswer: 1 },
          { question: 'Multicultural competence in supervision means:', type: 'multiple_choice', options: ['Ignoring cultural differences', 'Addressing diversity in supervisory process', 'Only supervising same culture', 'Avoiding diversity topics'], correctAnswer: 1 },
          { question: 'Informed consent in supervision includes:', type: 'multiple_choice', options: ['Nothing specific', 'Expectations, evaluation methods, policies', 'Only fees', 'Whatever supervisor decides'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-g-research-publication',
    title: 'Research and Publication Ethics',
    subtitle: 'ACA Code of Ethics Section G',
    description: 'This 1-hour CE course covers research ethics, participant protection, and publication standards.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Apply ethical standards for research', 'Protect research participants', 'Follow publication ethics', 'Understand informed consent for research'],
    modules: [
      { title: 'Research Ethics', order: 1, lessons: [
        { title: 'Research Responsibilities', type: 'text', duration: 20, order: 1, content: 'Protect participant welfare. Get IRB approval. Ensure informed consent.' },
        { title: 'Participant Rights', type: 'text', duration: 20, order: 2, content: 'Right to know purpose. Right to withdraw. Protection from harm.' }
      ]},
      { title: 'Publication Ethics', order: 2, lessons: [
        { title: 'Authorship and Publication', type: 'text', duration: 20, order: 1, content: 'Credit contributions accurately. Avoid plagiarism.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Before conducting research:', type: 'multiple_choice', options: ['Just start collecting data', 'Obtain IRB approval', 'Only need supervisor permission', 'IRB approval is optional'], correctAnswer: 1 },
          { question: 'Research participants have right to:', type: 'multiple_choice', options: ['Never withdraw', 'Withdraw at any time', 'Only withdraw if harmed', 'Withdraw only with permission'], correctAnswer: 1 },
          { question: 'Informed consent for research includes:', type: 'multiple_choice', options: ['Only study title', 'Purpose, procedures, risks, benefits, right to withdraw', 'Nothing specific', 'Whatever researcher decides'], correctAnswer: 1 },
          { question: 'Authorship credit should:', type: 'multiple_choice', options: ['Go only to senior researcher', 'Reflect actual contributions', 'Be determined alphabetically', 'Go to supervisor regardless'], correctAnswer: 1 },
          { question: 'Debriefing participants:', type: 'multiple_choice', options: ['Is optional', 'Should occur after participation', 'Is never appropriate', 'Only when harm occurred'], correctAnswer: 1 },
          { question: 'Plagiarism is:', type: 'multiple_choice', options: ['Acceptable in research', 'Using others\' work without credit', 'Only wrong in student papers', 'Allowed with paraphrasing'], correctAnswer: 1 },
          { question: 'Research data confidentiality:', type: 'multiple_choice', options: ['Is not important', 'Must be maintained', 'Only for sensitive topics', 'Is optional'], correctAnswer: 1 },
          { question: 'Publishing same data as original in multiple journals:', type: 'multiple_choice', options: ['Is good practice', 'Is prohibited', 'Is encouraged', 'Is researcher\'s choice'], correctAnswer: 1 },
          { question: 'Minimizing risks to participants:', type: 'multiple_choice', options: ['Is optional', 'Is a researcher responsibility', 'Is impossible', 'Is IRB\'s job only'], correctAnswer: 1 },
          { question: 'Manuscript review should be:', type: 'multiple_choice', options: ['Based on personal relationships', 'Fair and objective', 'Always positive', 'Done quickly without care'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-h-distance-technology',
    title: 'Distance Counseling and Technology Ethics',
    subtitle: 'ACA Code of Ethics Section H',
    description: 'This 1-hour CE course addresses telehealth, technology use, and social media in counseling.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Apply ethical standards for distance counseling', 'Ensure technology security', 'Navigate social media ethics', 'Address jurisdictional considerations'],
    modules: [
      { title: 'Distance Counseling', order: 1, lessons: [
        { title: 'Telehealth Standards', type: 'text', duration: 20, order: 1, content: 'Determine client suitability. Specific informed consent. Verify identity. Emergency procedures.' },
        { title: 'Technology Security', type: 'text', duration: 20, order: 2, content: 'Use secure, encrypted platforms. Protect client data.' }
      ]},
      { title: 'Social Media', order: 2, lessons: [
        { title: 'Social Media Ethics', type: 'text', duration: 20, order: 1, content: 'Maintain professional boundaries online. Don\'t search for client info without consent.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'Before distance counseling, assess:', type: 'multiple_choice', options: ['Only payment ability', 'Client suitability for this modality', 'Nothing specific', 'Only technical skills'], correctAnswer: 1 },
          { question: 'Informed consent for telehealth should include:', type: 'multiple_choice', options: ['Only regular consent items', 'Specific risks and limitations of technology', 'Nothing additional', 'Only platform information'], correctAnswer: 1 },
          { question: 'Technology platforms should be:', type: 'multiple_choice', options: ['Any free platform', 'Secure and encrypted', 'Most convenient', 'Client\'s choice regardless of security'], correctAnswer: 1 },
          { question: 'Jurisdictional laws for telehealth:', type: 'multiple_choice', options: ['Don\'t apply', 'Must be known and followed', 'Only apply to out-of-state', 'Are the same everywhere'], correctAnswer: 1 },
          { question: 'Emergency procedures for distance counseling:', type: 'multiple_choice', options: ['Aren\'t needed', 'Must be established', 'Are same as in-person', 'Are client\'s responsibility only'], correctAnswer: 1 },
          { question: 'Social media connections with clients:', type: 'multiple_choice', options: ['Are always appropriate', 'Require careful boundary consideration', 'Are encouraged', 'Are required by modern standards'], correctAnswer: 1 },
          { question: 'Searching for client information online:', type: 'multiple_choice', options: ['Is always appropriate', 'Should generally not be done without consent', 'Is required for thorough assessment', 'Is the same as asking client'], correctAnswer: 1 },
          { question: 'Backup plans for technology failures:', type: 'multiple_choice', options: ['Aren\'t necessary', 'Should be in place', 'Are client\'s responsibility', 'Are impossible to create'], correctAnswer: 1 },
          { question: 'Verifying client identity in telehealth:', type: 'multiple_choice', options: ['Is unnecessary', 'Is important for security', 'Violates privacy', 'Is client\'s responsibility only'], correctAnswer: 1 },
          { question: 'Professional and personal online presence:', type: 'multiple_choice', options: ['Should be the same', 'Should be appropriately separated', 'Don\'t affect counseling', 'Are irrelevant to ethics'], correctAnswer: 1 }
        ]
      }]}
    ]
  },
  {
    slug: 'aca-ethics-section-i-resolving-issues',
    title: 'Resolving Ethical Issues',
    subtitle: 'ACA Code of Ethics Section I',
    description: 'This 1-hour CE course addresses how to identify, address, and resolve ethical issues.',
    ceuHours: 1, ceuCategories: [{ category: 'Ethics', hours: 1 }],
    objectives: ['Identify ethical issues when they arise', 'Apply ethical decision-making models', 'Address colleague ethics violations', 'Understand complaint processes'],
    modules: [
      { title: 'Identifying and Addressing Issues', order: 1, lessons: [
        { title: 'Ethical Awareness', type: 'text', duration: 20, order: 1, content: 'Recognize ethical issues. Know the ethics code. Consult when uncertain.' },
        { title: 'Addressing Colleague Violations', type: 'text', duration: 20, order: 2, content: 'Attempt informal resolution when appropriate. Report when required.' }
      ]},
      { title: 'Complaint Processes', order: 2, lessons: [
        { title: 'Disciplinary Processes', type: 'text', duration: 20, order: 1, content: 'Understand licensing board processes. Cooperate with investigations.' }
      ]},
      { title: 'Post-Test', order: 3, lessons: [{
        title: 'Course Assessment', type: 'quiz', duration: 10, order: 1,
        questions: [
          { question: 'When facing ethical uncertainty:', type: 'multiple_choice', options: ['Ignore it', 'Consult with colleagues or experts', 'Just make a quick decision', 'Avoid the situation entirely'], correctAnswer: 1 },
          { question: 'Knowledge of ethics code is:', type: 'multiple_choice', options: ['Optional', 'Essential professional responsibility', 'Only for ethics specialists', 'Only for supervisors'], correctAnswer: 1 },
          { question: 'First step when colleague has minor violation:', type: 'multiple_choice', options: ['Immediately report to board', 'Attempt informal resolution', 'Ignore it', 'Tell other colleagues'], correctAnswer: 1 },
          { question: 'Serious ethical violations by colleagues:', type: 'multiple_choice', options: ['Can be ignored', 'May require reporting', 'Are never your concern', 'Should only be gossiped about'], correctAnswer: 1 },
          { question: 'Documenting ethical decisions:', type: 'multiple_choice', options: ['Is unnecessary', 'Is important for protection and accountability', 'Should be avoided', 'Is only for legal issues'], correctAnswer: 1 },
          { question: 'Cooperation with board investigations:', type: 'multiple_choice', options: ['Is optional', 'Is required', 'Should be avoided', 'Is only for guilty parties'], correctAnswer: 1 },
          { question: 'Retaliation against ethics complainants:', type: 'multiple_choice', options: ['Is acceptable', 'Is prohibited', 'Is expected', 'Is the complainant\'s risk'], correctAnswer: 1 },
          { question: 'Ethical decision-making models:', type: 'multiple_choice', options: ['Are unnecessary', 'Provide systematic approach to dilemmas', 'Are only for researchers', 'Are too complicated to use'], correctAnswer: 1 },
          { question: 'When ethics code conflicts with organization policy:', type: 'multiple_choice', options: ['Always follow organization', 'Work to resolve conflict appropriately', 'Always quit', 'Ignore both'], correctAnswer: 1 },
          { question: 'Knowing your rights in disciplinary process:', type: 'multiple_choice', options: ['Is unimportant', 'Is part of professional responsibility', 'Shows guilt', 'Is only for lawyers'], correctAnswer: 1 }
        ]
      }]}
    ]
  }
];

// ============================================
// SEED ROUTE
// ============================================
router.get('/seed-courses', async (req, res) => {
  // Check secret key
  const providedKey = req.query.key;
  if (providedKey !== SEED_SECRET) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or missing key. Add ?key=YOUR_SECRET to the URL' 
    });
  }

  try {
    const allCourses = [...clinicalCourses, ...ethicsCourses];
    let created = 0;
    let updated = 0;
    let errors = [];

    for (const courseData of allCourses) {
      try {
        // Add standard fields
        courseData.ceuEligible = true;
        courseData.approvingBody = 'NBCC';
        courseData.approvalNumber = 'ACEP #7760';
        courseData.applicability = 'national';
        courseData.accessType = 'subscription';
        courseData.accessTier = 'starter';
        courseData.instructor = 'GA Integrated Therapeutic Perspectives LLC';
        courseData.status = 'published';
        courseData.publishedAt = new Date();
        courseData.settings = standardSettings;
        courseData.evaluationQuestions = standardEvaluation;

        const existing = await Course.findOne({ slug: courseData.slug });
        
        if (existing) {
          await Course.updateOne({ slug: courseData.slug }, courseData);
          updated++;
        } else {
          await Course.create(courseData);
          created++;
        }
      } catch (err) {
        errors.push({ slug: courseData.slug, error: err.message });
      }
    }

    res.json({
      success: true,
      message: 'Course seeding complete!',
      summary: {
        total: allCourses.length,
        created,
        updated,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Seed failed', 
      message: error.message 
    });
  }
});

// Status check route
router.get('/seed-status', async (req, res) => {
  try {
    const count = await Course.countDocuments();
    const courses = await Course.find({}, 'slug title ceuHours status').sort({ ceuHours: -1 });
    res.json({
      totalCourses: count,
      courses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
