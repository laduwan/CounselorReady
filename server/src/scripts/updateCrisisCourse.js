// scripts/updateCrisisCourse.js
// Run: node src/scripts/updateCrisisCourse.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB error:', error.message);
    process.exit(1);
  }
};

const crisisCourse = {
  title: "Crisis Intervention: Assessment and Response",
  slug: "crisis-intervention",
  description: "This 3-hour course prepares mental health professionals to effectively assess and respond to clients in crisis. Learn suicide risk assessment, safety planning, de-escalation techniques, and post-crisis follow-up. Essential skills for every clinician.",
  thumbnail: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800",
  ceHours: 3,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Clinical Social Workers", "Psychologists", "Crisis Workers"],
  categories: ["Crisis Intervention", "Clinical Practice", "Risk Assessment"],
  tags: ["crisis", "suicide", "safety planning", "de-escalation", "risk assessment"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  resources: [
    { title: "Suicide Risk Assessment Guide", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/suicide-risk-assessment.pdf", size: "267 KB" },
    { title: "Safety Plan Template", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/safety-plan-template.pdf", size: "198 KB" },
    { title: "De-escalation Techniques Card", type: "card", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/de-escalation-card.pdf", size: "156 KB" },
    { title: "Crisis Resources List", type: "pdf", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/crisis-resources.pdf", size: "178 KB" }
  ],
  sections: [
    {
      title: "Understanding Crisis",
      description: "Defining crisis, types, and theoretical foundations",
      order: 1,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 1, title: "Understanding Crisis", subtitle: "Foundations of Crisis Intervention" },
        { type: "text", order: 2, textContent: "<h3>What is a Crisis?</h3><p>A crisis occurs when a person faces an obstacle to important life goals that cannot be overcome through customary problem-solving. It is a <strong>time-limited state</strong> of disequilibrium.</p><p><strong>Key Characteristics:</strong></p><ul><li>Perception of an overwhelming event</li><li>Disruption of normal coping mechanisms</li><li>Evidence of distress and functional impairment</li><li>Time-limited (typically 4-6 weeks)</li></ul>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Types of Crises", content: "<p><strong>Developmental/Maturational:</strong> Predictable life transitions (adolescence, retirement)</p><p><strong>Situational:</strong> Unexpected events (job loss, accident, diagnosis)</p><p><strong>Existential:</strong> Inner conflicts about meaning and purpose</p><p><strong>Societal/Environmental:</strong> Natural disasters, community violence, pandemics</p>" },
          { title: "Crisis Theory (Caplan & Lindemann)", content: "<ul><li>Crisis is time-limited and self-resolving (for better or worse)</li><li>During crisis, people are more open to change</li><li>Small interventions can have big impact</li><li>Resolution can lead to growth OR deterioration</li><li>Previous crisis responses predict current response</li></ul>" },
          { title: "The Crisis State", content: "<p><strong>Cognitive:</strong> Confusion, poor concentration, difficulty problem-solving</p><p><strong>Emotional:</strong> Anxiety, fear, anger, hopelessness</p><p><strong>Behavioral:</strong> Agitation, withdrawal, impulsivity</p><p><strong>Physical:</strong> Sleep disruption, appetite changes, somatic symptoms</p>" },
          { title: "Crisis vs. Emergency", content: "<p><strong>Crisis:</strong> Psychological disequilibrium; may or may not involve danger</p><p><strong>Emergency:</strong> Immediate threat to life requiring urgent action</p><p>All emergencies are crises, but not all crises are emergencies.</p>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600", imageAlt: "Support during crisis", imagePosition: "right", title: "Crisis as Opportunity", content: "<p>Crisis intervention done well can be a turning point — an opportunity for growth, new coping skills, and positive change.</p><p>Our role is to help people navigate the danger while opening doors to opportunity.</p>", highlight: true },
        { type: "multipleChoice", order: 5, question: "A crisis is typically time-limited, lasting approximately:", options: [{ text: "24-48 hours", isCorrect: false }, { text: "4-6 weeks", isCorrect: true }, { text: "6-12 months", isCorrect: false }, { text: "Indefinitely", isCorrect: false }], explanation: "Crises typically resolve within 4-6 weeks — for better or worse." }
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Which crisis type involves predictable life transitions?", type: "multipleChoice", options: [{ text: "Situational", isCorrect: false }, { text: "Developmental/Maturational", isCorrect: true }, { text: "Existential", isCorrect: false }, { text: "Societal", isCorrect: false }], explanation: "Developmental crises involve predictable transitions." }
      ]
    },
    {
      title: "Suicide Risk Assessment",
      description: "Comprehensive approach to assessing suicide risk",
      order: 2,
      estimatedTime: 45,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 2, title: "Suicide Risk Assessment", subtitle: "Identifying and Evaluating Risk" },
        { type: "text", order: 2, textContent: "<h3>The Importance of Assessment</h3><p>Suicide is the 10th leading cause of death in the US. Every clinician will encounter suicidal clients. Competent risk assessment is not optional — it's essential.</p><p><strong>Key Principle:</strong> Always ask directly about suicide. Research consistently shows that asking does NOT increase risk or 'plant ideas.'</p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Risk Factors", content: "<p><strong>Historical:</strong></p><ul><li>Previous suicide attempts (strongest predictor)</li><li>Family history of suicide</li><li>History of trauma or abuse</li><li>Previous psychiatric hospitalization</li></ul><p><strong>Clinical:</strong></p><ul><li>Depression, hopelessness, anxiety</li><li>Substance use disorders</li><li>Psychosis, especially command hallucinations</li><li>Recent discharge from psychiatric care</li></ul><p><strong>Situational:</strong></p><ul><li>Recent losses (relationship, job, health)</li><li>Access to lethal means (especially firearms)</li><li>Social isolation</li><li>Recent humiliation or shame</li></ul>" },
          { title: "Protective Factors", content: "<ul><li>Reasons for living (children, pets, goals)</li><li>Social support and connection</li><li>Religious/spiritual beliefs against suicide</li><li>Fear of death or dying</li><li>Future orientation and hope</li><li>Problem-solving skills</li><li>Access to mental health care</li><li>Restricted access to lethal means</li></ul><p><strong>Important:</strong> Protective factors do NOT cancel out risk factors. Assess both.</p>" },
          { title: "Warning Signs (Acute)", content: "<p><strong>Immediate Concern:</strong></p><ul><li>Threatening to hurt or kill self</li><li>Seeking access to means (pills, weapons)</li><li>Talking/writing about death or suicide</li><li>Giving away possessions</li><li>Saying goodbye to loved ones</li></ul><p><strong>Behavioral Changes:</strong></p><ul><li>Increased substance use</li><li>Withdrawal from activities/people</li><li>Dramatic mood changes</li><li>Reckless behavior</li><li>Agitation or sleep problems</li></ul>" },
          { title: "The Columbia Protocol (C-SSRS)", content: "<p>Standardized screening questions:</p><ol><li>Have you wished you were dead or wished you could go to sleep and not wake up?</li><li>Have you actually had any thoughts of killing yourself?</li><li>Have you thought about how you might do this?</li><li>Have you had any intention of acting on these thoughts?</li><li>Have you started to work out or worked out the details?</li><li>Have you done anything, started to do anything, or prepared to do anything to end your life?</li></ol><p>Affirmative answers indicate increasing levels of risk.</p>" },
          { title: "Assessing Suicidal Ideation", content: "<p><strong>Explore the 4 P's:</strong></p><ul><li><strong>Plan:</strong> Do they have a specific plan? How detailed?</li><li><strong>Preparation:</strong> Have they taken steps toward the plan?</li><li><strong>Prior attempts:</strong> History of suicide attempts?</li><li><strong>Purpose:</strong> What do they hope to achieve? Escape pain? Punish others?</li></ul><p><strong>Additional Questions:</strong></p><ul><li>Timeline: When do they intend to act?</li><li>Means: Do they have access to lethal means?</li><li>Ambivalence: Any part of them wants to live?</li><li>Deterrents: What has stopped them so far?</li></ul>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600", imageAlt: "Therapeutic conversation", imagePosition: "left", title: "Levels of Risk", content: "<p><strong>Low Risk:</strong> Ideation without plan, strong protective factors, engaged in treatment</p><p><strong>Moderate Risk:</strong> Ideation with plan but no intent or timeline, some protective factors</p><p><strong>High Risk:</strong> Ideation with plan AND intent, access to means, few protective factors, recent attempt or rehearsal</p><p><strong>Imminent Risk:</strong> Plan, intent, timeline, means available, no protective factors — requires immediate action</p>", highlight: true },
        { type: "multipleChoice", order: 5, question: "What is the single strongest predictor of future suicide?", options: [{ text: "Depression diagnosis", isCorrect: false }, { text: "Family history of mental illness", isCorrect: false }, { text: "Previous suicide attempt", isCorrect: true }, { text: "Substance abuse", isCorrect: false }], explanation: "Previous suicide attempt is the strongest predictor of future suicide." }
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Asking directly about suicide:", type: "multipleChoice", options: [{ text: "Increases the risk of suicide", isCorrect: false }, { text: "Plants ideas in the client's head", isCorrect: false }, { text: "Does NOT increase risk and is essential", isCorrect: true }, { text: "Should be avoided with depressed clients", isCorrect: false }], explanation: "Research consistently shows asking about suicide does NOT increase risk." },
        { question: "The 4 P's of suicide assessment include all EXCEPT:", type: "multipleChoice", options: [{ text: "Plan", isCorrect: false }, { text: "Preparation", isCorrect: false }, { text: "Prior attempts", isCorrect: false }, { text: "Personality", isCorrect: true }], explanation: "The 4 P's are Plan, Preparation, Prior attempts, and Purpose." }
      ]
    },
    {
      title: "Safety Planning",
      description: "Creating effective safety plans with clients",
      order: 3,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 3, title: "Safety Planning", subtitle: "Collaborative Crisis Prevention" },
        { type: "text", order: 2, textContent: "<h3>What is a Safety Plan?</h3><p>A safety plan is a prioritized, written list of coping strategies and resources that clients can use during a suicidal crisis. It is <strong>collaborative</strong> — developed WITH the client, not FOR them.</p><p>Safety plans differ from 'no-suicide contracts,' which research shows are ineffective. Safety plans are evidence-based and practical.</p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Step 1: Warning Signs", content: "<p>Help the client identify their personal warning signs that a crisis may be developing:</p><ul><li>Thoughts: 'What thoughts tell you a crisis is building?'</li><li>Feelings: 'What emotions do you notice?'</li><li>Behaviors: 'What do you start doing differently?'</li><li>Physical sensations: 'What does your body feel like?'</li></ul><p><strong>Be specific.</strong> 'Feeling bad' is less helpful than 'Staying in bed past noon, not showering, thoughts of being a burden.'</p>" },
          { title: "Step 2: Internal Coping Strategies", content: "<p>Things the client can do ON THEIR OWN without contacting anyone:</p><ul><li>Distraction activities (TV, games, puzzles)</li><li>Physical activity (walking, exercise)</li><li>Relaxation techniques (breathing, meditation)</li><li>Sensory grounding (cold water, strong tastes)</li></ul><p><strong>Key:</strong> These should be things that have worked before or the client is willing to try. List specific activities, not general categories.</p>" },
          { title: "Step 3: Social Contacts for Distraction", content: "<p>People and places that provide distraction (not necessarily to discuss the crisis):</p><ul><li>Friends or family members to call or visit</li><li>Social settings to go to (coffee shop, gym)</li><li>Online communities</li></ul><p>The goal is connection and normalization, not crisis support.</p>" },
          { title: "Step 4: People to Ask for Help", content: "<p>People the client can tell they're in crisis and ask for support:</p><ul><li>Trusted friends or family (with names and numbers)</li><li>Sponsor, mentor, faith leader</li><li>The clinician (with contact information and availability)</li></ul><p><strong>Important:</strong> Discuss in advance what they might say and what kind of help they're asking for.</p>" },
          { title: "Step 5: Professional Resources", content: "<p>Professional and crisis resources:</p><ul><li><strong>988 Suicide & Crisis Lifeline</strong> (call or text 988)</li><li><strong>Crisis Text Line</strong> (text HOME to 741741)</li><li>Local crisis services and mobile crisis teams</li><li>Nearest emergency department</li><li>Clinician's emergency contact information</li></ul>" },
          { title: "Step 6: Means Restriction", content: "<p>Reducing access to lethal means is one of the most effective suicide prevention strategies.</p><p><strong>Discuss:</strong></p><ul><li>Firearms: Can they be temporarily stored elsewhere?</li><li>Medications: Can quantities be limited?</li><li>Other means specific to client's plan</li></ul><p><strong>Involve family/supports</strong> in means restriction when possible and with client consent.</p>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600", imageAlt: "Collaborative planning", imagePosition: "right", title: "Making Safety Plans Work", content: "<ul><li><strong>Collaborative:</strong> Client's words, not clinician's template</li><li><strong>Specific:</strong> Names, numbers, concrete activities</li><li><strong>Accessible:</strong> Keep it where they'll see it (phone, wallet, fridge)</li><li><strong>Practiced:</strong> Review and rehearse before crisis</li><li><strong>Updated:</strong> Revise as circumstances change</li></ul>", highlight: true },
        { type: "resources", order: 5, title: "Safety Planning Tools", description: "Download these resources", resources: [
          { title: "Safety Plan Template", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/safety-plan-template.pdf", size: "198 KB" },
          { title: "Crisis Resources List", type: "pdf", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/crisis-resources.pdf", size: "178 KB" }
        ]}
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Safety plans differ from 'no-suicide contracts' in that:", type: "multipleChoice", options: [{ text: "They are legally binding", isCorrect: false }, { text: "They are evidence-based and collaborative", isCorrect: true }, { text: "They don't require client input", isCorrect: false }, { text: "They are completed by the clinician alone", isCorrect: false }], explanation: "Safety plans are evidence-based and developed collaboratively with the client." },
        { question: "The most effective suicide prevention strategy is:", type: "multipleChoice", options: [{ text: "No-suicide contracts", isCorrect: false }, { text: "Hospitalization for all suicidal clients", isCorrect: false }, { text: "Means restriction", isCorrect: true }, { text: "Medication only", isCorrect: false }], explanation: "Reducing access to lethal means is one of the most effective strategies." }
      ]
    },
    {
      title: "De-escalation Techniques",
      description: "Skills for managing agitated and distressed clients",
      order: 4,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 4, title: "De-escalation Techniques", subtitle: "Calming Crisis Situations" },
        { type: "text", order: 2, textContent: "<h3>The Goal of De-escalation</h3><p>De-escalation aims to reduce a person's emotional intensity so they can engage their thinking brain and participate in problem-solving. It's about <strong>connection before correction</strong>.</p><p><strong>Remember:</strong> An agitated person's brain is in survival mode. Logic and reasoning won't work until they feel safer.</p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Your Presence Matters", content: "<p><strong>Regulate yourself first.</strong> Your calm is contagious (so is your anxiety).</p><ul><li>Take a breath before engaging</li><li>Lower your voice and slow your speech</li><li>Relax your body posture</li><li>Project calm confidence, not fear or aggression</li></ul><p><strong>Remember:</strong> You cannot de-escalate someone if you're escalated yourself.</p>" },
          { title: "Environmental Factors", content: "<ul><li>Reduce stimulation (noise, lights, people)</li><li>Ensure physical safety (clear path to exit for both of you)</li><li>Remove potential weapons or throwing objects</li><li>Maintain safe distance (arm's length or more)</li><li>Position yourself at an angle, not directly facing</li><li>Avoid cornering the person</li></ul>" },
          { title: "Verbal De-escalation", content: "<p><strong>DO:</strong></p><ul><li>Use a calm, low tone</li><li>Speak slowly and simply</li><li>Use the person's name</li><li>Validate feelings: 'I can see you're really upset'</li><li>Offer choices: 'Would you like to sit or stand?'</li><li>Set clear, simple limits</li></ul><p><strong>DON'T:</strong></p><ul><li>Argue, challenge, or threaten</li><li>Raise your voice or talk fast</li><li>Use jargon or complex explanations</li><li>Make promises you can't keep</li><li>Take insults personally</li></ul>" },
          { title: "The LEAP Approach", content: "<p><strong>L</strong>isten: Give full attention, let them talk</p><p><strong>E</strong>mpathize: Reflect feelings, show understanding</p><p><strong>A</strong>gree: Find something to agree with (even partially)</p><p><strong>P</strong>artner: Work together toward solutions</p><p>This approach validates the person while moving toward resolution.</p>" },
          { title: "When to Call for Help", content: "<p><strong>Call for assistance when:</strong></p><ul><li>Physical violence seems imminent</li><li>Person has a weapon</li><li>Your de-escalation isn't working</li><li>You feel unsafe</li><li>Person needs medical attention</li><li>Involuntary hospitalization may be needed</li></ul><p><strong>There is no shame in calling for help.</strong> Your safety matters too.</p>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600", imageAlt: "Calm professional presence", imagePosition: "left", title: "De-escalation Phrases", content: "<ul><li>'I want to help you.'</li><li>'I can see this is really hard.'</li><li>'You're safe here.'</li><li>'Help me understand what happened.'</li><li>'What would be helpful right now?'</li><li>'Let's figure this out together.'</li></ul><p><strong>Avoid:</strong> 'Calm down' (dismissive), 'You need to...' (controlling), 'That's not true' (argumentative)</p>", highlight: true },
        { type: "multipleChoice", order: 5, question: "The first step in de-escalation is:", options: [{ text: "Tell the person to calm down", isCorrect: false }, { text: "Call security", isCorrect: false }, { text: "Regulate yourself", isCorrect: true }, { text: "Explain the rules", isCorrect: false }], explanation: "You must regulate yourself first — your calm is contagious." }
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Why doesn't logic work with an agitated person?", type: "multipleChoice", options: [{ text: "They're not intelligent enough", isCorrect: false }, { text: "Their brain is in survival mode", isCorrect: true }, { text: "They're being manipulative", isCorrect: false }, { text: "Logic never works in therapy", isCorrect: false }], explanation: "When agitated, the survival brain takes over and the thinking brain goes offline." },
        { question: "LEAP stands for:", type: "multipleChoice", options: [{ text: "Listen, Evaluate, Act, Proceed", isCorrect: false }, { text: "Listen, Empathize, Agree, Partner", isCorrect: true }, { text: "Learn, Educate, Assess, Plan", isCorrect: false }, { text: "Look, Engage, Approach, Protect", isCorrect: false }], explanation: "LEAP: Listen, Empathize, Agree, Partner." }
      ]
    },
    {
      title: "Post-Crisis Follow-Up",
      description: "Care after the crisis and documentation",
      order: 5,
      estimatedTime: 30,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 5, title: "Post-Crisis Follow-Up", subtitle: "Continuity of Care" },
        { type: "text", order: 2, textContent: "<h3>The Critical Period After Crisis</h3><p>The days and weeks following a crisis are a high-risk period. Research shows suicide risk is elevated in the days after psychiatric discharge and after crisis resolution.</p><p><strong>Follow-up is not optional — it's essential care.</strong></p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Immediate Follow-Up (24-72 hours)", content: "<ul><li>Contact client to check on safety</li><li>Review and reinforce safety plan</li><li>Ensure crisis resources are accessible</li><li>Confirm next appointment</li><li>Coordinate with other providers if applicable</li></ul><p><strong>Document the contact</strong> and client's status.</p>" },
          { title: "Short-Term Follow-Up (1-4 weeks)", content: "<ul><li>Increase session frequency if needed</li><li>Process the crisis experience</li><li>Identify triggers and warning signs</li><li>Strengthen coping strategies</li><li>Address underlying issues</li><li>Update safety plan as needed</li></ul>" },
          { title: "Caring Contacts", content: "<p><strong>Caring contacts</strong> are brief, non-demanding outreach to clients after crisis (calls, texts, cards). Research shows they reduce suicide attempts.</p><p><strong>Key elements:</strong></p><ul><li>Express genuine care and concern</li><li>No demands or expectations</li><li>Remind them of resources</li><li>Keep the door open for contact</li></ul><p>Example: 'Hi [name], I've been thinking about you and wanted to check in. I hope you're doing okay. I'm here if you need anything.'</p>" },
          { title: "Documentation Requirements", content: "<p><strong>Document thoroughly:</strong></p><ul><li>Risk assessment findings (specific factors identified)</li><li>Risk level determination and rationale</li><li>Interventions implemented</li><li>Safety plan (or why not created)</li><li>Means restriction discussion</li><li>Consultations obtained</li><li>Follow-up plan</li><li>Client's response to interventions</li></ul><p><strong>Remember:</strong> Documentation protects the client AND you. Be thorough.</p>" },
          { title: "Clinician Self-Care", content: "<p>Working with clients in crisis is taxing. After a crisis:</p><ul><li>Debrief with a colleague or supervisor</li><li>Acknowledge your own emotional response</li><li>Take a break if possible before next client</li><li>Practice your own coping strategies</li><li>Seek consultation if you're second-guessing yourself</li></ul><p><strong>You cannot pour from an empty cup.</strong> Taking care of yourself is professional, not selfish.</p>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600", imageAlt: "Follow-up care", imagePosition: "right", title: "Key Takeaways", content: "<ul><li>Crisis intervention is a core clinical skill</li><li>Always ask directly about suicide</li><li>Use evidence-based risk assessment</li><li>Safety plans are collaborative and specific</li><li>De-escalation starts with your own calm</li><li>Follow-up is essential, not optional</li><li>Document thoroughly</li><li>Take care of yourself too</li></ul>", highlight: true },
        { type: "resources", order: 5, title: "Crisis Resources", description: "Download these tools", resources: [
          { title: "Suicide Risk Assessment Guide", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/suicide-risk-assessment.pdf", size: "267 KB" },
          { title: "Post-Crisis Follow-Up Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/crisis/post-crisis-followup.pdf", size: "145 KB" }
        ]}
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Research shows that 'caring contacts' after crisis:", type: "multipleChoice", options: [{ text: "Have no effect on outcomes", isCorrect: false }, { text: "Reduce suicide attempts", isCorrect: true }, { text: "Increase dependency", isCorrect: false }, { text: "Are unethical boundary violations", isCorrect: false }], explanation: "Research shows caring contacts reduce suicide attempts." },
        { question: "The period of highest suicide risk is:", type: "multipleChoice", options: [{ text: "During acute crisis", isCorrect: false }, { text: "Days/weeks after crisis or discharge", isCorrect: true }, { text: "Years after the event", isCorrect: false }, { text: "Before any crisis occurs", isCorrect: false }], explanation: "Suicide risk is elevated in the days and weeks after crisis resolution or psychiatric discharge." }
      ]
    }
  ],
  assessment: {
    title: "Final Assessment: Crisis Intervention",
    timeLimit: 25,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      { question: "A crisis is typically time-limited, lasting:", type: "multipleChoice", options: [{ text: "24-48 hours", isCorrect: false }, { text: "4-6 weeks", isCorrect: true }, { text: "6-12 months", isCorrect: false }, { text: "Indefinitely", isCorrect: false }], explanation: "Crises typically resolve within 4-6 weeks." },
      { question: "The strongest predictor of future suicide is:", type: "multipleChoice", options: [{ text: "Depression", isCorrect: false }, { text: "Family history", isCorrect: false }, { text: "Previous suicide attempt", isCorrect: true }, { text: "Substance abuse", isCorrect: false }], explanation: "Previous attempt is the strongest predictor." },
      { question: "Asking directly about suicide:", type: "multipleChoice", options: [{ text: "Increases risk", isCorrect: false }, { text: "Plants ideas", isCorrect: false }, { text: "Does NOT increase risk", isCorrect: true }, { text: "Should be avoided", isCorrect: false }], explanation: "Research shows direct questions do not increase risk." },
      { question: "Safety plans should be:", type: "multipleChoice", options: [{ text: "Written by clinician alone", isCorrect: false }, { text: "Collaborative and specific", isCorrect: true }, { text: "Kept in clinical file only", isCorrect: false }, { text: "Generic templates", isCorrect: false }], explanation: "Safety plans are developed collaboratively with specific details." },
      { question: "The most effective suicide prevention strategy is:", type: "multipleChoice", options: [{ text: "No-suicide contracts", isCorrect: false }, { text: "Hospitalization for all", isCorrect: false }, { text: "Means restriction", isCorrect: true }, { text: "Medication only", isCorrect: false }], explanation: "Means restriction is one of the most effective strategies." },
      { question: "The first step in de-escalation is:", type: "multipleChoice", options: [{ text: "Tell them to calm down", isCorrect: false }, { text: "Call security", isCorrect: false }, { text: "Regulate yourself", isCorrect: true }, { text: "Set firm limits", isCorrect: false }], explanation: "Regulate yourself first — your calm is contagious." },
      { question: "LEAP stands for:", type: "multipleChoice", options: [{ text: "Listen, Evaluate, Act, Proceed", isCorrect: false }, { text: "Listen, Empathize, Agree, Partner", isCorrect: true }, { text: "Learn, Educate, Assess, Plan", isCorrect: false }, { text: "Look, Engage, Approach, Protect", isCorrect: false }], explanation: "Listen, Empathize, Agree, Partner." },
      { question: "The period of highest suicide risk is:", type: "multipleChoice", options: [{ text: "During acute crisis", isCorrect: false }, { text: "Days/weeks after crisis or discharge", isCorrect: true }, { text: "Years later", isCorrect: false }, { text: "Before any crisis", isCorrect: false }], explanation: "Risk is elevated after crisis resolution or discharge." },
      { question: "Caring contacts after crisis:", type: "multipleChoice", options: [{ text: "Have no effect", isCorrect: false }, { text: "Reduce suicide attempts", isCorrect: true }, { text: "Are boundary violations", isCorrect: false }, { text: "Increase dependency", isCorrect: false }], explanation: "Research shows caring contacts reduce suicide attempts." },
      { question: "After a crisis intervention, clinicians should:", type: "multipleChoice", options: [{ text: "Move on immediately to next client", isCorrect: false }, { text: "Debrief, acknowledge feelings, and practice self-care", isCorrect: true }, { text: "Avoid thinking about it", isCorrect: false }, { text: "Keep feelings to themselves", isCorrect: false }], explanation: "Self-care and debriefing are essential after crisis work." }
    ]
  }
};

const updateCourse = async () => {
  await connectDB();
  try {
    crisisCourse.totalEstimatedTime = crisisCourse.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
    crisisCourse.totalContentBlocks = crisisCourse.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
    crisisCourse.totalQuizQuestions = crisisCourse.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) + (crisisCourse.assessment?.questions?.length || 0);
    
    await mongoose.connection.db.collection('interactivecourses').findOneAndUpdate({ slug: crisisCourse.slug }, { $set: crisisCourse }, { upsert: true });
    await mongoose.connection.db.collection('courses').findOneAndUpdate({ slug: crisisCourse.slug }, { $set: crisisCourse }, { upsert: true });
    
    console.log('✅ Crisis Intervention course updated!');
    console.log('   Sections:', crisisCourse.sections.length);
    console.log('   Content Blocks:', crisisCourse.totalContentBlocks);
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
};

updateCourse();
