/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
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
          textContent: "<h2>What is Trauma-Informed Care?</h2><p>Trauma-Informed Care (TIC) is a treatment framework that involves understanding, recognizing, and responding to the effects of all types of trauma. It emphasizes physical, psychological, and emotional safety for both providers and survivors, and creates opportunities for survivors to rebuild a sense of control and empowerment.</p><p>According to the World Health Organization, approximately <strong>70% of adults</strong> worldwide have experienced at least one traumatic event in their lifetime. This staggering statistic underscores why trauma-informed approaches are essential in clinical practice.</p>"
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
          textContent: "<h2>The Importance of Trauma-Informed Assessment</h2><p>Proper assessment is crucial for identifying trauma history and its effects. Assessment should be conducted in a safe, supportive environment with clear explanation of purpose and how information will be used.</p>"
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
          textContent: "<h2>Moving Toward Implementation</h2><p>Implementing TIC requires organizational commitment, training, and ongoing support. Success depends on leadership buy-in, staff training, policy changes, and continuous quality improvement.</p>"
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
// NEUROBIOLOGY OF TRAUMA COURSE
// ============================================================================
const neurobiologyOfTraumaCourse = {
  title: "The Neurobiology of Trauma",
  slug: "neurobiology-of-trauma",
  description: "This course explores the neurobiological foundations of trauma, including how traumatic experiences affect brain structure and function. Participants will learn about the stress response system, memory consolidation, and the neuroplasticity that enables recovery. Essential knowledge for trauma-informed clinical practice.",
  ceHours: 4,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Psychologists", "Clinical Social Workers", "Trauma Specialists"],
  categories: ["Trauma", "Neuroscience", "Clinical Practice"],
  tags: ["neurobiology", "trauma", "brain", "stress response", "HPA axis", "amygdala", "neuroplasticity"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  
  sections: [
    // SECTION 1: Introduction to Neurobiology
    {
      title: "Introduction to Trauma Neurobiology",
      description: "Understanding how trauma affects the brain",
      order: 1,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Introduction to Trauma Neurobiology",
          subtitle: "The Brain-Body Connection"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h2>Why Neurobiology Matters in Trauma Treatment</h2><p>Understanding the neurobiology of trauma transforms how we approach treatment. When clinicians understand what happens in the brain during and after traumatic experiences, they can better explain symptoms to clients, select appropriate interventions, and instill hope for recovery through neuroplasticity.</p><p>Trauma is not just a psychological phenomenon—it fundamentally alters brain structure and function. These changes explain many trauma symptoms that might otherwise seem puzzling or irrational.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "The Triune Brain Model",
              content: "Paul MacLean's model describes three brain regions: the <strong>reptilian brain</strong> (brainstem - survival functions), the <strong>limbic system</strong> (emotions and memory), and the <strong>neocortex</strong> (rational thought). Trauma primarily affects the limbic system while often bypassing the neocortex."
            },
            {
              title: "Key Brain Structures in Trauma",
              content: "<strong>Amygdala:</strong> The brain's alarm system, detects threats<br><strong>Hippocampus:</strong> Processes and stores memories<br><strong>Prefrontal Cortex:</strong> Executive function, rational thought<br><strong>Hypothalamus:</strong> Regulates stress hormones"
            },
            {
              title: "Why Understanding the Brain Helps Clients",
              content: "Psychoeducation about neurobiology helps clients: (1) Understand that their symptoms are normal responses to abnormal events, (2) Reduce shame and self-blame, (3) Develop hope through understanding neuroplasticity, (4) Engage more effectively in treatment."
            }
          ]
        },
        {
          type: "matching",
          order: 4,
          matchingInstructions: "Match each brain structure with its primary function in trauma",
          matchingPairs: [
            { term: "Amygdala", definition: "Threat detection and fear response" },
            { term: "Hippocampus", definition: "Memory processing and consolidation" },
            { term: "Prefrontal Cortex", definition: "Executive function and rational thought" },
            { term: "Hypothalamus", definition: "Stress hormone regulation" }
          ]
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which brain structure is primarily responsible for detecting threats and triggering the fear response?",
          type: "multipleChoice",
          options: [
            { text: "Hippocampus", isCorrect: false },
            { text: "Amygdala", isCorrect: true },
            { text: "Prefrontal Cortex", isCorrect: false },
            { text: "Cerebellum", isCorrect: false }
          ],
          explanation: "The amygdala acts as the brain's alarm system, constantly scanning for threats and initiating the fear response."
        }
      ]
    },
    
    // SECTION 2: The Stress Response System
    {
      title: "The Stress Response System",
      description: "HPA axis and the fight-flight-freeze response",
      order: 2,
      estimatedTime: 35,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "The Stress Response System",
          subtitle: "HPA Axis and Survival Responses"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h2>The HPA Axis</h2><p>The Hypothalamic-Pituitary-Adrenal (HPA) axis is the body's central stress response system. When the amygdala detects a threat, it triggers a cascade of hormonal responses designed to prepare the body for survival.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "The HPA Axis Cascade",
              content: "1. <strong>Hypothalamus</strong> releases CRH (corticotropin-releasing hormone)<br>2. <strong>Pituitary gland</strong> releases ACTH (adrenocorticotropic hormone)<br>3. <strong>Adrenal glands</strong> release cortisol and adrenaline<br>4. Body prepares for fight, flight, or freeze"
            },
            {
              title: "Fight Response",
              content: "Characterized by aggression, confrontation, or defensive behaviors. Physical signs include increased muscle tension, clenched fists, jaw tightening, and intense eye contact. The body prepares to combat the threat."
            },
            {
              title: "Flight Response",
              content: "Characterized by escape behaviors, avoidance, or restlessness. Physical signs include increased heart rate, rapid breathing, fidgeting, and urge to run. The body prepares to flee from danger."
            },
            {
              title: "Freeze Response",
              content: "Characterized by immobility, dissociation, or shutdown. Physical signs include decreased heart rate, shallow breathing, numbness, and feeling 'stuck.' This response occurs when fight or flight seem impossible."
            },
            {
              title: "Chronic Stress and HPA Dysregulation",
              content: "Prolonged trauma exposure can dysregulate the HPA axis, leading to: chronically elevated or depleted cortisol levels, heightened startle response, difficulty returning to baseline after stress, and long-term health consequences."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Which hormone is released by the adrenal glands as part of the stress response?",
          options: [
            { text: "Dopamine", isCorrect: false },
            { text: "Serotonin", isCorrect: false },
            { text: "Cortisol", isCorrect: true },
            { text: "Oxytocin", isCorrect: false }
          ],
          explanation: "Cortisol, along with adrenaline (epinephrine), is released by the adrenal glands to prepare the body for the stress response."
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "What does HPA stand for in the HPA axis?",
          type: "multipleChoice",
          options: [
            { text: "Hypothalamic-Pituitary-Adrenal", isCorrect: true },
            { text: "Hippocampal-Prefrontal-Amygdala", isCorrect: false },
            { text: "Hormonal-Physiological-Adaptive", isCorrect: false },
            { text: "Hyperarousal-Processing-Activation", isCorrect: false }
          ]
        },
        {
          question: "Which stress response is characterized by immobility and dissociation?",
          type: "multipleChoice",
          options: [
            { text: "Fight", isCorrect: false },
            { text: "Flight", isCorrect: false },
            { text: "Freeze", isCorrect: true },
            { text: "Fawn", isCorrect: false }
          ]
        }
      ]
    },
    
    // SECTION 3: Memory and Trauma
    {
      title: "Trauma and Memory",
      description: "How trauma affects memory processing",
      order: 3,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 3,
          title: "Trauma and Memory",
          subtitle: "Why Traumatic Memories Are Different"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h2>How Trauma Disrupts Memory</h2><p>Traumatic memories are processed differently than ordinary memories. During trauma, the hippocampus (responsible for contextualizing and storing memories) may be impaired by high cortisol levels, while the amygdala (which processes emotional significance) remains hyperactive. This creates fragmented, emotionally intense memories without proper context.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Explicit vs. Implicit Memory",
              content: "<strong>Explicit memory:</strong> Conscious, narrative memory with context (time, place, sequence). Often impaired during trauma.<br><strong>Implicit memory:</strong> Unconscious, sensory, and emotional memory. Remains intact during trauma, leading to intrusive sensations and flashbacks."
            },
            {
              title: "Flashbacks and Triggers",
              content: "Flashbacks occur when implicit traumatic memories are activated without proper contextual information. The person re-experiences sensations, emotions, and images as if the trauma is happening now. Triggers are sensory cues that activate these implicit memories."
            },
            {
              title: "The Role of the Hippocampus",
              content: "The hippocampus helps place memories in time and context ('that was then, this is now'). High cortisol during trauma can suppress hippocampal function, preventing proper memory consolidation and leaving traumatic memories 'frozen in time.'"
            },
            {
              title: "Memory Reconsolidation",
              content: "When memories are recalled, they become temporarily malleable and can be modified before being restored. This provides a window for therapeutic intervention, allowing traumatic memories to be processed and integrated with new, adaptive information."
            }
          ]
        },
        {
          type: "multiSelect",
          order: 4,
          question: "Which of the following are characteristics of traumatic memories? (Select all that apply)",
          options: [
            { text: "Fragmented and disorganized", isCorrect: true },
            { text: "Highly emotional and sensory", isCorrect: true },
            { text: "Lack of temporal context", isCorrect: true },
            { text: "Always completely accurate", isCorrect: false }
          ],
          explanation: "Traumatic memories are often fragmented, emotionally intense, sensory-based, and lack proper time context due to hippocampal impairment during encoding."
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which type of memory remains intact during trauma and contributes to flashbacks?",
          type: "multipleChoice",
          options: [
            { text: "Explicit memory", isCorrect: false },
            { text: "Implicit memory", isCorrect: true },
            { text: "Working memory", isCorrect: false },
            { text: "Semantic memory", isCorrect: false }
          ]
        }
      ]
    },
    
    // SECTION 4: Neuroplasticity and Recovery
    {
      title: "Neuroplasticity and Recovery",
      description: "The brain's capacity for change and healing",
      order: 4,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Neuroplasticity and Recovery",
          subtitle: "Hope Through Brain Change"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h2>The Brain Can Change</h2><p>Neuroplasticity—the brain's ability to reorganize and form new neural connections—provides the foundation for trauma recovery. The same neural mechanisms that created trauma responses can be harnessed to build new, healthier patterns. This is the biological basis for hope in trauma treatment.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "What is Neuroplasticity?",
              content: "Neuroplasticity refers to the brain's ability to change its structure and function in response to experience. 'Neurons that fire together, wire together' (Hebb's Law). This means that repeated experiences strengthen neural pathways, while unused pathways weaken over time."
            },
            {
              title: "Implications for Treatment",
              content: "Evidence-based trauma treatments work by harnessing neuroplasticity: creating new associations with traumatic memories, strengthening prefrontal cortex regulation, building new neural pathways for safety and connection, and gradually reducing amygdala hyperreactivity."
            },
            {
              title: "Bottom-Up and Top-Down Approaches",
              content: "<strong>Bottom-up:</strong> Work with the body and sensations to calm the nervous system (e.g., EMDR, somatic experiencing, yoga)<br><strong>Top-down:</strong> Use cognitive processes to regulate emotions (e.g., CBT, mindfulness, psychoeducation)"
            },
            {
              title: "The Window of Tolerance",
              content: "Dan Siegel's concept describing the optimal zone of arousal where a person can function effectively. Trauma narrows this window. Treatment aims to widen the window through gradual exposure and building regulation skills."
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          title: "Key Factors in Trauma Recovery",
          content: "Research shows several factors promote neuroplastic change and recovery:<br>• <strong>Safety:</strong> Both physical and relational safety<br>• <strong>Social connection:</strong> Co-regulation with attuned others<br>• <strong>Repetition:</strong> Consistent practice of new patterns<br>• <strong>Emotional engagement:</strong> Processing at optimal arousal<br>• <strong>Sleep:</strong> Memory consolidation and restoration",
          imagePosition: "right",
          highlight: true
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "What does Hebb's Law state about neurons?",
          type: "multipleChoice",
          options: [
            { text: "Neurons that fire together, die together", isCorrect: false },
            { text: "Neurons that fire together, wire together", isCorrect: true },
            { text: "Neurons cannot change after childhood", isCorrect: false },
            { text: "Neurons only respond to medication", isCorrect: false }
          ]
        },
        {
          question: "Which approach to trauma treatment focuses on working with body sensations?",
          type: "multipleChoice",
          options: [
            { text: "Top-down approach", isCorrect: false },
            { text: "Bottom-up approach", isCorrect: true },
            { text: "Cognitive approach", isCorrect: false },
            { text: "Analytical approach", isCorrect: false }
          ]
        }
      ]
    },
    
    // SECTION 5: Clinical Applications
    {
      title: "Clinical Applications",
      description: "Applying neurobiology in practice",
      order: 5,
      estimatedTime: 25,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 5,
          title: "Clinical Applications",
          subtitle: "Using Neurobiology in Practice"
        },
        {
          type: "text",
          order: 2,
          textContent: "<h2>Integrating Neuroscience into Treatment</h2><p>Understanding trauma neurobiology transforms clinical practice. Clinicians can use this knowledge to inform assessment, guide intervention selection, provide psychoeducation, and help clients make sense of their experiences.</p>"
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Psychoeducation Strategies",
              content: "Use simple metaphors and visuals to explain brain processes. The 'hand model of the brain' (Dan Siegel), 'smoke detector' for amygdala, and 'thinking cap' for prefrontal cortex help clients understand their experiences without pathologizing them."
            },
            {
              title: "Regulation Techniques",
              content: "Teach techniques that directly target the nervous system: deep breathing (activates parasympathetic system), grounding (orients to present safety), bilateral stimulation (facilitates processing), and progressive muscle relaxation (releases tension)."
            },
            {
              title: "Selecting Evidence-Based Treatments",
              content: "Choose treatments based on neurobiological understanding: EMDR for memory processing, CPT/PE for cognitive restructuring, somatic approaches for body-based symptoms, and neurofeedback for arousal regulation."
            },
            {
              title: "Working with the Window of Tolerance",
              content: "Monitor client arousal and adjust interventions to keep them within their window. When hyperaroused, use calming techniques. When hypoaroused, use gentle activation. Gradually expand the window over time."
            }
          ]
        },
        {
          type: "multiSelect",
          order: 4,
          question: "Which techniques directly target the nervous system for regulation? (Select all that apply)",
          options: [
            { text: "Deep breathing", isCorrect: true },
            { text: "Grounding exercises", isCorrect: true },
            { text: "Progressive muscle relaxation", isCorrect: true },
            { text: "Dream interpretation", isCorrect: false }
          ],
          explanation: "Deep breathing, grounding, and progressive muscle relaxation all directly engage the nervous system to promote regulation."
        }
      ],
      hasQuiz: false
    }
  ],
  
  // FINAL ASSESSMENT
  assessment: {
    title: "Final Assessment: Neurobiology of Trauma",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Which brain structure acts as the brain's 'alarm system' for detecting threats?",
        type: "multipleChoice",
        options: [
          { text: "Hippocampus", isCorrect: false },
          { text: "Amygdala", isCorrect: true },
          { text: "Prefrontal Cortex", isCorrect: false },
          { text: "Cerebellum", isCorrect: false }
        ]
      },
      {
        question: "What does HPA stand for?",
        type: "multipleChoice",
        options: [
          { text: "Hypothalamic-Pituitary-Adrenal", isCorrect: true },
          { text: "Hippocampal-Prefrontal-Amygdala", isCorrect: false },
          { text: "Hormonal-Physiological-Adaptive", isCorrect: false },
          { text: "Hyperarousal-Processing-Activation", isCorrect: false }
        ]
      },
      {
        question: "Which hormone is released by the adrenal glands during stress?",
        type: "multipleChoice",
        options: [
          { text: "Dopamine", isCorrect: false },
          { text: "Serotonin", isCorrect: false },
          { text: "Cortisol", isCorrect: true },
          { text: "Melatonin", isCorrect: false }
        ]
      },
      {
        question: "Which stress response is characterized by immobility and shutdown?",
        type: "multipleChoice",
        options: [
          { text: "Fight", isCorrect: false },
          { text: "Flight", isCorrect: false },
          { text: "Freeze", isCorrect: true },
          { text: "Focus", isCorrect: false }
        ]
      },
      {
        question: "Which type of memory remains intact during trauma?",
        type: "multipleChoice",
        options: [
          { text: "Explicit memory", isCorrect: false },
          { text: "Implicit memory", isCorrect: true },
          { text: "Semantic memory", isCorrect: false },
          { text: "Procedural memory", isCorrect: false }
        ]
      },
      {
        question: "What brain structure is responsible for placing memories in context?",
        type: "multipleChoice",
        options: [
          { text: "Amygdala", isCorrect: false },
          { text: "Hippocampus", isCorrect: true },
          { text: "Thalamus", isCorrect: false },
          { text: "Brainstem", isCorrect: false }
        ]
      },
      {
        question: "What does Hebb's Law state?",
        type: "multipleChoice",
        options: [
          { text: "Neurons that fire together, wire together", isCorrect: true },
          { text: "Neurons cannot change after age 25", isCorrect: false },
          { text: "All neurons die with trauma", isCorrect: false },
          { text: "Neurons only form during sleep", isCorrect: false }
        ]
      },
      {
        question: "Which approach works directly with body sensations?",
        type: "multipleChoice",
        options: [
          { text: "Top-down approach", isCorrect: false },
          { text: "Bottom-up approach", isCorrect: true },
          { text: "Cognitive approach", isCorrect: false },
          { text: "Behavioral approach", isCorrect: false }
        ]
      },
      {
        question: "The 'Window of Tolerance' concept describes:",
        type: "multipleChoice",
        options: [
          { text: "The optimal zone of arousal for functioning", isCorrect: true },
          { text: "How long treatment should last", isCorrect: false },
          { text: "The waiting period between sessions", isCorrect: false },
          { text: "The acceptable level of medication", isCorrect: false }
        ]
      },
      {
        question: "Which are characteristics of traumatic memories? (Select all that apply)",
        type: "multiSelect",
        options: [
          { text: "Fragmented and disorganized", isCorrect: true },
          { text: "Highly emotional and sensory", isCorrect: true },
          { text: "Lack of temporal context", isCorrect: true },
          { text: "Always completely accurate", isCorrect: false }
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
          textContent: "<h2>Why Ethics Matter</h2><p>Ethics form the foundation of professional counseling practice. They protect clients, guide practitioners, and uphold the integrity of the profession. Understanding and applying ethical principles is not just a regulatory requirement—it's essential for client welfare and professional excellence.</p>"
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
          textContent: "<h2>What is a Crisis?</h2><p>A crisis is a state of psychological disequilibrium in which a person's usual coping mechanisms are overwhelmed. Crises are time-limited but can result in significant harm if not properly addressed. Understanding crisis theory is essential for effective intervention.</p>"
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
  
  const courses = [neurobiologyOfTraumaCourse, traumaInformedCareCourse, ethicsCourse, crisisCourse];
  
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
