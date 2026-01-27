// scripts/seedInteractiveCourses.js
// Seeds the interactive courses (TIC, Ethics, Crisis) into MongoDB
// Run: node src/scripts/seedInteractiveCourses.js
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Import the model after connection
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: String,
  ceHours: { type: Number, required: true },
  ceProvider: { type: String, default: 'NBCC ACEP #7760' },
  acepNumber: { type: String, default: '7760' },
  sections: [{
    title: { type: String, required: true },
    description: String,
    order: { type: Number, required: true },
    contentBlocks: [{
      type: { type: String, enum: ['accordion', 'matching', 'multipleChoice', 'multiSelect', 'imageText', 'sectionDivider', 'text', 'video'], required: true },
      order: { type: Number, required: true },
      accordionItems: [{ title: String, content: String }],
      matchingPairs: [{ term: String, definition: String }],
      matchingInstructions: String,
      question: String,
      options: [{ text: String, isCorrect: Boolean }],
      explanation: String,
      image: String,
      imageAlt: String,
      imagePosition: { type: String, enum: ['left', 'right'], default: 'left' },
      title: String,
      content: String,
      highlight: { type: Boolean, default: false },
      sectionNumber: Number,
      subtitle: String,
      textContent: String,
      videoUrl: String,
      videoDuration: Number
    }],
    hasQuiz: { type: Boolean, default: false },
    quizQuestions: [{
      question: String,
      type: { type: String, enum: ['multipleChoice', 'multiSelect', 'trueFalse'] },
      options: [{ text: String, isCorrect: Boolean }],
      explanation: String
    }],
    quizPassThreshold: { type: Number, default: 0.8 },
    estimatedTime: { type: Number, default: 15 }
  }],
  assessment: {
    title: { type: String, default: 'Final Assessment' },
    timeLimit: { type: Number, default: 30 },
    passThreshold: { type: Number, default: 0.8 },
    questions: [{
      question: String,
      type: { type: String, enum: ['multipleChoice', 'multiSelect', 'trueFalse'] },
      options: [{ text: String, isCorrect: Boolean }],
      explanation: String
    }],
    attemptsAllowed: { type: Number, default: 3 },
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true }
  },
  targetAudience: [String],
  categories: [String],
  tags: [String],
  author: String,
  publishedAt: Date,
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  totalEstimatedTime: Number,
  totalContentBlocks: Number,
  totalQuizQuestions: Number
}, { timestamps: true });

// ============================================================================
// TRAUMA-INFORMED CARE COURSE
// ============================================================================
const traumaInformedCareCourse = {
  title: "Introduction to Trauma-Informed Care for Clinical Practice",
  slug: "trauma-informed-care",
  description: "This comprehensive course provides mental health professionals with the foundational knowledge and practical skills to implement trauma-informed care in clinical settings. Based on SAMHSA's six key principles, participants will learn to recognize trauma's impact, create safe environments, and apply evidence-based interventions.",
  ceHours: 4,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Social Workers", "Psychologists", "Marriage and Family Therapists", "Mental Health Counselors"],
  categories: ["Trauma", "Clinical Practice", "Evidence-Based Practice"],
  tags: ["trauma", "TIC", "SAMHSA", "clinical skills", "mental health"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  
  sections: [
    // SECTION 1: Introduction & Overview
    {
      title: "Understanding Trauma-Informed Care",
      description: "Foundations and key principles of trauma-informed approaches",
      order: 1,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Understanding Trauma-Informed Care",
          subtitle: "Foundations and Key Principles"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h3>What is Trauma-Informed Care?</h3><p>Trauma-Informed Care (TIC) is a treatment framework that involves understanding, recognizing, and responding to the effects of all types of trauma. It emphasizes physical, psychological, and emotional safety for both providers and survivors, and creates opportunities for survivors to rebuild a sense of control and empowerment.</p><p>According to the World Health Organization, approximately <strong>70% of adults</strong> worldwide have experienced at least one traumatic event in their lifetime. This staggering statistic underscores why trauma-informed approaches are essential in clinical practice.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "SAMHSA's Definition of Trauma",
              content: "SAMHSA defines trauma as resulting from 'an event, series of events, or set of circumstances that is experienced by an individual as physically or emotionally harmful or life threatening and that has lasting adverse effects on the individual's functioning and mental, physical, social, emotional, or spiritual well-being.'"
            },
            {
              title: "The Three E's of Trauma",
              content: "<strong>Events:</strong> The actual traumatic occurrence(s)<br><strong>Experience:</strong> How the individual perceives and processes the event<br><strong>Effects:</strong> The lasting impact on functioning and well-being"
            },
            {
              title: "Why TIC Matters in Clinical Practice",
              content: "Research shows that trauma exposure is nearly universal among clinical populations. Studies indicate that 90% of public mental health clients have experienced trauma. Without trauma-informed approaches, traditional care can inadvertently re-traumatize clients and impede healing."
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          title: "The Prevalence of Trauma",
          content: "Understanding the widespread nature of trauma helps clinicians approach every client with sensitivity. Key statistics include:<br>• 70% of adults have experienced trauma<br>• 1 in 4 children experience maltreatment<br>• 90% of public mental health clients have trauma history<br>• Trauma costs exceed $100 billion annually in healthcare",
          imagePosition: "left",
          highlight: true
        }
      ],
      hasQuiz: false
    },
    
    // SECTION 2: Six Key Principles
    {
      title: "SAMHSA's Six Key Principles",
      description: "Core principles for implementing trauma-informed care",
      order: 2,
      estimatedTime: 35,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "SAMHSA's Six Key Principles",
          subtitle: "Building Blocks of Trauma-Informed Care"
        },
        {
          type: "accordion",
          order: 2,
          accordionItems: [
            {
              title: "1. Safety",
              content: "Throughout the organization, staff and the people they serve feel physically and psychologically safe. The physical setting is safe and interpersonal interactions promote a sense of safety. Safety is the foundational principle upon which all others rest."
            },
            {
              title: "2. Trustworthiness and Transparency",
              content: "Organizational operations and decisions are conducted with transparency with the goal of building and maintaining trust among staff, clients, and family members of those receiving services. Clear, consistent communication is essential."
            },
            {
              title: "3. Peer Support",
              content: "Peer support and mutual self-help are key vehicles for building trust, establishing safety, and empowerment. Peers who have shared experiences can provide hope and demonstrate that recovery is possible."
            },
            {
              title: "4. Collaboration and Mutuality",
              content: "Importance is placed on partnering and leveling power differences between staff and clients. Healing happens in relationships and in the meaningful sharing of power and decision-making."
            },
            {
              title: "5. Empowerment, Voice, and Choice",
              content: "Throughout the organization and among clients served, individuals' strengths are recognized, built on, and validated. Clients are supported in shared decision-making, choice, and goal-setting."
            },
            {
              title: "6. Cultural, Historical, and Gender Issues",
              content: "The organization actively moves past cultural stereotypes and biases, incorporates policies responsive to the needs of diverse populations, and recognizes historical trauma."
            }
          ]
        },
        {
          type: "matching",
          order: 3,
          matchingInstructions: "Match each principle with its key focus area",
          matchingPairs: [
            { term: "Safety", definition: "Physical and psychological security" },
            { term: "Trustworthiness", definition: "Transparent operations and decisions" },
            { term: "Peer Support", definition: "Shared experiences and mutual help" },
            { term: "Collaboration", definition: "Partnering and leveling power differences" },
            { term: "Empowerment", definition: "Recognizing strengths and supporting choice" },
            { term: "Cultural Issues", definition: "Moving past stereotypes and biases" }
          ]
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which principle of Trauma-Informed Care emphasizes creating a secure environment where clients feel protected?",
          type: "multipleChoice",
          options: [
            { text: "Collaboration", isCorrect: false },
            { text: "Safety", isCorrect: true },
            { text: "Trustworthiness", isCorrect: false },
            { text: "Empowerment", isCorrect: false }
          ],
          explanation: "Safety is the foundational principle that ensures clients feel physically and psychologically secure."
        },
        {
          question: "Which organization developed the six key principles of Trauma-Informed Care?",
          type: "multipleChoice",
          options: [
            { text: "APA", isCorrect: false },
            { text: "CDC", isCorrect: false },
            { text: "SAMHSA", isCorrect: true },
            { text: "WHO", isCorrect: false }
          ],
          explanation: "SAMHSA (Substance Abuse and Mental Health Services Administration) developed these foundational principles."
        }
      ]
    },
    
    // SECTION 3: Types of Trauma
    {
      title: "Types of Trauma and Their Effects",
      description: "Understanding different trauma categories and their impact",
      order: 3,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 3,
          title: "Types of Trauma and Their Effects",
          subtitle: "Recognizing and Understanding Trauma Presentations"
        },
        {
          type: "accordion",
          order: 2,
          accordionItems: [
            {
              title: "Acute Trauma",
              content: "Results from a single incident, such as an accident, natural disaster, or assault. Effects may include shock, denial, and anxiety. With appropriate support, many individuals recover without long-term effects."
            },
            {
              title: "Chronic Trauma",
              content: "Results from repeated and prolonged exposure to highly stressful events, such as domestic violence, ongoing abuse, or war. Effects often include persistent anxiety, hypervigilance, and difficulty trusting others."
            },
            {
              title: "Complex Trauma",
              content: "Exposure to multiple traumatic events, often of an invasive, interpersonal nature. Usually begins in childhood and disrupts development. Associated with difficulties in emotional regulation, self-concept, and relationships."
            },
            {
              title: "Developmental Trauma",
              content: "Occurs during critical periods of brain development in childhood. Can alter neurobiological development and affect attachment, emotional regulation, and cognitive processing throughout the lifespan."
            },
            {
              title: "Intergenerational/Historical Trauma",
              content: "Trauma that is transferred from the first generation of trauma survivors to the second and further generations. Examples include effects of colonization, slavery, and genocide on descendants."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "Which type of trauma involves exposure to multiple traumatic events, often of an invasive, interpersonal nature?",
          options: [
            { text: "Acute Trauma", isCorrect: false },
            { text: "Chronic Trauma", isCorrect: false },
            { text: "Complex Trauma", isCorrect: true },
            { text: "Simple Trauma", isCorrect: false }
          ],
          explanation: "Complex trauma involves multiple, varied traumatic experiences, often interpersonal in nature, and typically begins in childhood."
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Developmental trauma primarily affects which aspect of functioning?",
          type: "multipleChoice",
          options: [
            { text: "Only physical health", isCorrect: false },
            { text: "Only social relationships", isCorrect: false },
            { text: "Neurobiological development and attachment", isCorrect: true },
            { text: "Only memory function", isCorrect: false }
          ],
          explanation: "Developmental trauma affects brain development during critical periods, impacting attachment, emotional regulation, and cognitive processing."
        }
      ]
    },
    
    // SECTION 4: Assessment Tools
    {
      title: "Trauma Assessment Tools and Techniques",
      description: "Evidence-based tools for trauma screening and assessment",
      order: 4,
      estimatedTime: 25,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Trauma Assessment Tools",
          subtitle: "Evidence-Based Screening and Assessment"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h3>The Importance of Trauma-Informed Assessment</h3><p>Proper assessment is crucial for identifying trauma history and its effects. Assessment should be conducted in a safe, supportive environment with clear explanation of purpose and how information will be used.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "PCL-5 (PTSD Checklist for DSM-5)",
              content: "A 20-item self-report measure assessing the 20 DSM-5 symptoms of PTSD. Widely used in clinical and research settings. Cut-off score of 31-33 suggests probable PTSD diagnosis."
            },
            {
              title: "ACE Questionnaire",
              content: "The Adverse Childhood Experiences questionnaire screens for 10 types of childhood trauma. Higher ACE scores correlate with increased health risks. Useful for understanding early trauma exposure."
            },
            {
              title: "TSC-40 (Trauma Symptom Checklist)",
              content: "A 40-item self-report measure evaluating symptomatology in adults arising from childhood or adult traumatic experiences. Assesses anxiety, depression, dissociation, and other trauma-related symptoms."
            },
            {
              title: "CTQ (Childhood Trauma Questionnaire)",
              content: "A 28-item self-report inventory measuring five types of childhood maltreatment: emotional, physical, and sexual abuse, and emotional and physical neglect."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Which assessment tool specifically measures the 20 DSM-5 symptoms of PTSD?",
          options: [
            { text: "ACE Questionnaire", isCorrect: false },
            { text: "PCL-5", isCorrect: true },
            { text: "TSC-40", isCorrect: false },
            { text: "CTQ", isCorrect: false }
          ],
          explanation: "The PCL-5 (PTSD Checklist for DSM-5) directly assesses the 20 symptom criteria for PTSD as defined in the DSM-5."
        }
      ],
      hasQuiz: false
    },
    
    // SECTION 5: Implementation
    {
      title: "Implementing Trauma-Informed Care",
      description: "Practical strategies for TIC implementation",
      order: 5,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 5,
          title: "Implementing Trauma-Informed Care",
          subtitle: "From Theory to Practice"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h3>Moving Toward Implementation</h3><p>Implementing TIC requires organizational commitment, training, and ongoing support. Success depends on leadership buy-in, staff training, policy changes, and continuous quality improvement.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Organizational Readiness",
              content: "Assess current practices, identify gaps, and develop an implementation plan. Leadership commitment is essential. Consider forming a TIC committee to guide implementation efforts."
            },
            {
              title: "Staff Training",
              content: "All staff—clinical and non-clinical—need training on trauma, its effects, and trauma-informed practices. Training should be ongoing, not a one-time event. Include vicarious trauma prevention."
            },
            {
              title: "Environmental Modifications",
              content: "Create physically safe, welcoming environments. Consider lighting, noise levels, privacy, and signage. Ensure waiting areas and treatment spaces feel safe and non-threatening."
            },
            {
              title: "Policy and Procedure Review",
              content: "Examine all policies through a trauma-informed lens. Update intake procedures, crisis protocols, and documentation practices. Ensure policies promote safety, choice, and collaboration."
            }
          ]
        },
        {
          type: "multiSelect",
          order: 4,
          question: "Which of the following are barriers to implementing Trauma-Informed Care? (Select all that apply)",
          options: [
            { text: "Lack of training", isCorrect: true },
            { text: "Resource constraints", isCorrect: true },
            { text: "Vicarious trauma/burnout", isCorrect: true },
            { text: "Excessive funding", isCorrect: false }
          ],
          explanation: "Common barriers include limited training opportunities, resource constraints, and staff burnout/vicarious trauma. Excessive funding would not be a barrier."
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which is the FIRST step in implementing Trauma-Informed Care organizationally?",
          type: "multipleChoice",
          options: [
            { text: "Hiring new staff", isCorrect: false },
            { text: "Assessing organizational readiness", isCorrect: true },
            { text: "Changing the physical environment", isCorrect: false },
            { text: "Purchasing new assessment tools", isCorrect: false }
          ],
          explanation: "Assessing organizational readiness helps identify current strengths, gaps, and priorities before making changes."
        }
      ]
    }
  ],
  
  // FINAL ASSESSMENT
  assessment: {
    title: "Final Assessment: Trauma-Informed Care",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Which principle of Trauma-Informed Care emphasizes creating a safe environment?",
        type: "multipleChoice",
        options: [
          { text: "Collaboration", isCorrect: false },
          { text: "Safety", isCorrect: true },
          { text: "Trustworthiness", isCorrect: false },
          { text: "Empowerment", isCorrect: false }
        ]
      },
      {
        question: "Which best describes the long-term effects of trauma on mental health?",
        type: "multipleChoice",
        options: [
          { text: "Short-term stress", isCorrect: false },
          { text: "Minor mood swings", isCorrect: false },
          { text: "Chronic depression and PTSD", isCorrect: true },
          { text: "Temporary anxiety", isCorrect: false }
        ]
      },
      {
        question: "Trauma-Informed Care only focuses on the psychological effects of trauma.",
        type: "trueFalse",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true }
        ],
        explanation: "TIC addresses biological, psychological, AND social effects of trauma."
      },
      {
        question: "Which are core components of Trauma-Informed Care? (Select all that apply)",
        type: "multiSelect",
        options: [
          { text: "Empowerment", isCorrect: true },
          { text: "Trustworthiness", isCorrect: true },
          { text: "Safety", isCorrect: true },
          { text: "Isolation", isCorrect: false }
        ]
      },
      {
        question: "Which best describes the role of collaboration in Trauma-Informed Care?",
        type: "multipleChoice",
        options: [
          { text: "Focusing solely on clinical outcomes", isCorrect: false },
          { text: "Ignoring client preferences", isCorrect: false },
          { text: "Making decisions without client input", isCorrect: false },
          { text: "Working together with clients to support healing", isCorrect: true }
        ]
      },
      {
        question: "Which tool is commonly used for trauma-informed PTSD assessment?",
        type: "multipleChoice",
        options: [
          { text: "GAD-7", isCorrect: false },
          { text: "PCL-5", isCorrect: true },
          { text: "MMSE", isCorrect: false },
          { text: "BDI", isCorrect: false }
        ]
      },
      {
        question: "What percentage of adults have experienced at least one traumatic event according to WHO?",
        type: "multipleChoice",
        options: [
          { text: "50%", isCorrect: false },
          { text: "60%", isCorrect: false },
          { text: "70%", isCorrect: true },
          { text: "80%", isCorrect: false }
        ]
      },
      {
        question: "Which type of trauma involves exposure to multiple traumatic events, often invasive and interpersonal?",
        type: "multipleChoice",
        options: [
          { text: "Acute Trauma", isCorrect: false },
          { text: "Chronic Trauma", isCorrect: false },
          { text: "Complex Trauma", isCorrect: true },
          { text: "Simple Trauma", isCorrect: false }
        ]
      },
      {
        question: "Which organization provides the six key principles for Trauma-Informed Care?",
        type: "multipleChoice",
        options: [
          { text: "APA", isCorrect: false },
          { text: "CDC", isCorrect: false },
          { text: "SAMHSA", isCorrect: true },
          { text: "WHO", isCorrect: false }
        ]
      },
      {
        question: "Which are barriers to implementing Trauma-Informed Care? (Select all that apply)",
        type: "multiSelect",
        options: [
          { text: "Lack of training", isCorrect: true },
          { text: "Resource constraints", isCorrect: true },
          { text: "Vicarious trauma/burnout", isCorrect: true },
          { text: "Excessive funding", isCorrect: false }
        ]
      }
    ]
  }
};

// ============================================================================
// ETHICS COURSE (ABBREVIATED - ADD FULL CONTENT)
// ============================================================================
const ethicsCourse = {
  title: "Ethics in Mental Health Counseling",
  slug: "ethics-mental-health-counseling",
  description: "This comprehensive ethics course covers the ACA Code of Ethics, ethical decision-making models, boundary issues, confidentiality, dual relationships, and professional responsibilities. Essential for maintaining ethical practice and meeting license renewal requirements.",
  ceHours: 6,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Counseling Students", "Clinical Supervisors"],
  categories: ["Ethics", "Professional Development", "Legal Issues"],
  tags: ["ethics", "ACA", "confidentiality", "boundaries", "professional conduct"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  
  sections: [
    {
      title: "Foundations of Ethical Practice",
      description: "Core ethical principles and the ACA Code of Ethics",
      order: 1,
      estimatedTime: 45,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Foundations of Ethical Practice",
          subtitle: "Core Principles and ACA Code Overview"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h3>Why Ethics Matter</h3><p>Ethics form the foundation of professional counseling practice. They protect clients, guide practitioners, and uphold the integrity of the profession. Understanding and applying ethical principles is not just a regulatory requirement—it's essential for client welfare and professional excellence.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Autonomy",
              content: "Respect for clients' right to self-determination and freedom to make their own choices. Counselors support clients in making informed decisions about their treatment."
            },
            {
              title: "Beneficence",
              content: "The commitment to promoting client welfare and doing good. Counselors actively work toward what is best for their clients."
            },
            {
              title: "Nonmaleficence",
              content: "The obligation to do no harm. Counselors avoid actions that could cause harm to clients, including acts of commission and omission."
            },
            {
              title: "Justice",
              content: "Treating all clients fairly and equitably. Ensuring equal access to services and advocating for societal change when needed."
            },
            {
              title: "Fidelity",
              content: "Being faithful and keeping promises. Honoring commitments made to clients and maintaining trust in the therapeutic relationship."
            },
            {
              title: "Veracity",
              content: "Being truthful and honest with clients. Providing accurate information and avoiding deception."
            }
          ]
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which ethical principle refers to the commitment to do no harm?",
          type: "multipleChoice",
          options: [
            { text: "Autonomy", isCorrect: false },
            { text: "Beneficence", isCorrect: false },
            { text: "Nonmaleficence", isCorrect: true },
            { text: "Justice", isCorrect: false }
          ]
        }
      ]
    }
  ],
  
  assessment: {
    title: "Final Assessment: Ethics in Mental Health Counseling",
    timeLimit: 45,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Which ethical principle emphasizes respect for clients' right to make their own decisions?",
        type: "multipleChoice",
        options: [
          { text: "Autonomy", isCorrect: true },
          { text: "Beneficence", isCorrect: false },
          { text: "Fidelity", isCorrect: false },
          { text: "Justice", isCorrect: false }
        ]
      }
    ]
  }
};

// ============================================================================
// CRISIS INTERVENTION COURSE (ABBREVIATED - ADD FULL CONTENT)
// ============================================================================
const crisisCourse = {
  title: "Crisis Intervention for Licensed Professional Counselors",
  slug: "crisis-intervention-lpcs",
  description: "This course provides essential training in crisis intervention techniques for mental health professionals. Topics include crisis assessment, suicide risk evaluation, safety planning, and intervention strategies. Participants will learn evidence-based approaches to managing acute mental health crises.",
  ceHours: 3,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Crisis Counselors", "Emergency Mental Health Workers"],
  categories: ["Crisis Intervention", "Clinical Practice", "Safety"],
  tags: ["crisis", "suicide prevention", "safety planning", "intervention", "assessment"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  
  sections: [
    {
      title: "Understanding Crisis",
      description: "Definitions, types, and stages of crisis",
      order: 1,
      estimatedTime: 25,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Understanding Crisis",
          subtitle: "Foundations of Crisis Theory"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h3>What is a Crisis?</h3><p>A crisis is a state of psychological disequilibrium in which a person's usual coping mechanisms are overwhelmed. Crises are time-limited but can result in significant harm if not properly addressed. Understanding crisis theory is essential for effective intervention.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Developmental Crises",
              content: "Predictable transitions that occur during normal development, such as adolescence, midlife, or retirement. While expected, they can still overwhelm coping resources."
            },
            {
              title: "Situational Crises",
              content: "Unexpected events that disrupt equilibrium, such as job loss, divorce, illness, or death of a loved one. The suddenness contributes to the overwhelming nature."
            },
            {
              title: "Existential Crises",
              content: "Related to questions of meaning, purpose, and mortality. Often triggered by significant life events or awareness of mortality."
            },
            {
              title: "Psychiatric Emergencies",
              content: "Acute mental health crises including suicidal ideation, psychosis, or severe anxiety. Require immediate intervention and often involve safety concerns."
            }
          ]
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which type of crisis is characterized by unexpected events that disrupt equilibrium?",
          type: "multipleChoice",
          options: [
            { text: "Developmental crisis", isCorrect: false },
            { text: "Situational crisis", isCorrect: true },
            { text: "Existential crisis", isCorrect: false },
            { text: "Maturational crisis", isCorrect: false }
          ]
        }
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
      {
        question: "What is the primary goal of crisis intervention?",
        type: "multipleChoice",
        options: [
          { text: "Long-term personality change", isCorrect: false },
          { text: "Restoration of pre-crisis functioning", isCorrect: true },
          { text: "Complete resolution of all problems", isCorrect: false },
          { text: "Medication management", isCorrect: false }
        ]
      }
    ]
  }
};

// ============================================================================
// MAIN SEEDER FUNCTION
// ============================================================================
const seedCourses = async () => {
  await connectDB();
  
  // Check if model exists, otherwise create it
  let Course;
  try {
    Course = mongoose.model('InteractiveCourse');
  } catch {
    Course = mongoose.model('InteractiveCourse', CourseSchema);
  }
  
  const courses = [traumaInformedCareCourse, ethicsCourse, crisisCourse];
  
  console.log('\n🌱 Seeding Interactive Courses...\n');
  
  for (const courseData of courses) {
    try {
      // Calculate totals
      courseData.totalEstimatedTime = courseData.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
      courseData.totalContentBlocks = courseData.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
      courseData.totalQuizQuestions = courseData.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) 
        + (courseData.assessment?.questions?.length || 0);
      
      const result = await Course.findOneAndUpdate(
        { slug: courseData.slug },
        courseData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      console.log(`✅ ${result.title}`);
      console.log(`   Slug: ${result.slug}`);
      console.log(`   CE Hours: ${result.ceHours}`);
      console.log(`   Sections: ${result.sections.length}`);
      console.log(`   Assessment Questions: ${result.assessment?.questions?.length || 0}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error seeding ${courseData.title}:`, error.message);
    }
  }
  
  console.log('🎉 Seeding complete!\n');
  
  // Show summary
  const count = await Course.countDocuments({ status: 'published' });
  console.log(`Total published interactive courses: ${count}`);
  
  process.exit(0);
};

// Run seeder
seedCourses().catch(err => {
  console.error('Seeder error:', err);
  process.exit(1);
});
