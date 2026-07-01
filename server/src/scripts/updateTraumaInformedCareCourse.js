/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// scripts/updateTraumaInformedCareCourse.js
// Enhanced Trauma-Informed Care course with full content and resources
// Run: node src/scripts/updateTraumaInformedCareCourse.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const traumaInformedCareCourse = {
  title: "Trauma-Informed Care: Foundations for Clinical Practice",
  slug: "trauma-informed-care",
  description: "This comprehensive 4-hour course provides mental health professionals with foundational knowledge and practical skills to implement trauma-informed care across clinical settings. Based on SAMHSA's six key principles (Safety, Trustworthiness, Peer Support, Collaboration, Empowerment, and Cultural Sensitivity), participants will learn to recognize trauma's neurobiological impact, create physically and emotionally safe therapeutic environments, avoid re-traumatization through careful clinical practice, and apply evidence-based stabilization and intervention strategies that promote healing and recovery. The course integrates current neuroscience research with practical clinical applications, including detailed guidance on assessment, session structure, grounding techniques, and phase-based treatment approaches.",
  thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
  ceHours: 4,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Clinical Social Workers", "Psychologists", "Marriage and Family Therapists", "Substance Abuse Counselors"],
  categories: ["Trauma", "Clinical Practice", "Evidence-Based Practice"],
  tags: ["trauma-informed care", "TIC", "SAMHSA", "clinical skills", "safety", "empowerment"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),

  // ACEP REQUIRED: Learning Objectives
  learningObjectives: [
    "Define trauma-informed care and describe SAMHSA's six key principles for implementation across clinical settings",
    "Recognize the prevalence and neurobiological impact of trauma across diverse populations using current research",
    "Apply practical strategies to create physical and emotional safety in clinical environments",
    "Demonstrate techniques for building trustworthiness and transparency with trauma survivors over time",
    "Identify common clinical practices that may inadvertently re-traumatize clients and implement alternatives",
    "Utilize stabilization techniques including grounding, breathing, and containment to help clients regulate",
    "Explain the phase-based approach to trauma treatment and assess readiness for processing",
    "Develop personalized self-care strategies to prevent and address vicarious traumatization in your practice"
  ],
  
  // ACEP REQUIRED: Instructor Credentials
  instructorCredentials: {
    name: "Kejuiana Johnson, MA, LPC, CPCS, BC-TMH",
    credentials: "Licensed Professional Counselor, Certified Professional Counselor Supervisor, Board Certified in Telemental Health",
    organization: "GA Integrated Therapeutic Perspectives LLC",
    bio: "Kejuiana Johnson is a licensed mental health professional with extensive experience in trauma-informed care, clinical supervision, and professional development for counselors. She is the founder of CounselorReady, an NBCC-approved continuing education provider (ACEP #7760) dedicated to delivering high-quality, evidence-based professional development for mental health clinicians. With a background spanning direct clinical practice, supervision, and educational technology, she brings a unique perspective that bridges theoretical knowledge with practical application. Her approach to trauma-informed care emphasizes the integration of neuroscience research with compassionate, client-centered practice."
  },
  
  // ACEP REQUIRED: Bibliography/References
  bibliography: [
    {
      citation: "Substance Abuse and Mental Health Services Administration. (2014). SAMHSA's concept of trauma and guidance for a trauma-informed approach. HHS Publication No. (SMA) 14-4884.",
      type: "report"
    },
    {
      citation: "Harris, M., & Fallot, R. D. (Eds.). (2001). Using trauma theory to design service systems. Jossey-Bass.",
      type: "book"
    },
    {
      citation: "Bloom, S. L., & Farragher, B. (2013). Restoring sanctuary: A new operating system for trauma-informed systems of care. Oxford University Press.",
      type: "book"
    },
    {
      citation: "Herman, J. L. (2015). Trauma and recovery: The aftermath of violence—from domestic abuse to political terror. Basic Books.",
      type: "book"
    },
    {
      citation: "Felitti, V. J., et al. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults: The Adverse Childhood Experiences (ACE) Study. American Journal of Preventive Medicine, 14(4), 245-258.",
      type: "journal"
    },
    {
      citation: "Knight, C. (2015). Trauma-informed social work practice: Practice considerations and challenges. Clinical Social Work Journal, 43(1), 25-37.",
      type: "journal"
    },
    {
      citation: "van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking Press.",
      type: "book"
    },
    {
      citation: "Porges, S. W. (2011). The polyvagal theory: Neurophysiological foundations of emotions, attachment, communication, and self-regulation. W. W. Norton & Company.",
      type: "book"
    },
    {
      citation: "Siegel, D. J. (2012). The developing mind: How relationships and the brain interact to shape who we are (2nd ed.). Guilford Press.",
      type: "book"
    },
    {
      citation: "Courtois, C. A., & Ford, J. D. (Eds.). (2009). Treating complex traumatic stress disorders: An evidence-based guide. Guilford Press.",
      type: "book"
    },
    {
      citation: "Pearlman, L. A., & Saakvitne, K. W. (1995). Trauma and the therapist: Countertransference and vicarious traumatization in psychotherapy with incest survivors. W. W. Norton & Company.",
      type: "book"
    },
    {
      citation: "Briere, J., & Scott, C. (2014). Principles of trauma therapy: A guide to symptoms, evaluation, and treatment (2nd ed.). SAGE Publications.",
      type: "book"
    }
  ],
  
  // ACEP REQUIRED: Completion Requirements
  completionRequirements: {
    passingScore: 80,
    requirements: "To receive CE credit for this trauma-informed care course, participants must: (1) Complete all five course modules in their entirety, (2) Pass the final assessment with a score of 80% or higher, and (3) Complete the course evaluation form with feedback on the content and learning experience.",
    mustCompleteAllModules: true,
    mustPassAssessment: true,
    mustCompleteEvaluation: true,
    description: "To receive CE credit, participants must: (1) Complete all course modules, (2) Pass the final assessment with a score of 80% or higher, and (3) Complete the course evaluation."
  },
  
  // Accessibility & Platform Settings
  settings: {
    linearProgression: false,
    certificateEnabled: true,
    passingScore: 80,
    allowRetakes: true,
    retakePolicy: 'unlimited',
    maxRetakes: 3,
    scorePolicy: 'highest',
    requireEvaluation: true,
    requireAttestation: true,
    narrationEnabled: true,
    narrationVoice: 'nova',
    narrationSpeed: 1.0,
    autoPlayNarration: false,
    translationEnabled: true,
    supportedLanguages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ko', 'vi'],
    defaultLanguage: 'en',
    highContrastSupported: true,
    fontSizeAdjustable: true,
    screenReaderOptimized: true,
    altTextRequired: true
  },

  resources: [
    {
      title: "SAMHSA's 6 Principles Quick Reference",
      type: "card",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/samhsa-principles-card.pdf",
      filename: "samhsa-6-principles.pdf",
      size: "198 KB",
      description: "Printable card with all 6 TIC principles"
    },
    {
      title: "Trauma Screening Questions Guide",
      type: "checklist",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/trauma-screening-guide.pdf",
      filename: "trauma-screening-guide.pdf",
      size: "245 KB",
      description: "Sensitive questions for trauma assessment"
    },
    {
      title: "Creating Safety Checklist",
      type: "checklist",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/safety-checklist.pdf",
      filename: "creating-safety-checklist.pdf",
      size: "167 KB",
      description: "Environmental and relational safety audit"
    },
    {
      title: "Avoiding Re-traumatization Guide",
      type: "pdf",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/avoiding-retraumatization.pdf",
      filename: "avoiding-retraumatization.pdf",
      size: "312 KB",
      description: "Common pitfalls and how to avoid them"
    },
    {
      title: "Client Psychoeducation Handout",
      type: "worksheet",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/client-psychoeducation.pdf",
      filename: "trauma-psychoeducation-client.pdf",
      size: "278 KB",
      description: "Client-friendly explanation of trauma responses"
    }
  ],

  sections: [
    // SECTION 1: Understanding Trauma
    {
      title: "Understanding Trauma and Its Impact",
      description: "Foundations of trauma: definitions, prevalence, and effects on individuals and communities",
      order: 1,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Understanding Trauma and Its Impact",
          subtitle: "Foundations for Trauma-Informed Practice"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>What is Trauma?</h3>
          <p>Trauma results from exposure to an event or series of events that are emotionally disturbing or life-threatening. However, <strong>trauma is defined by the individual's experience</strong>, not just the event itself. Two people can experience the same event with vastly different outcomes based on their perception, support systems, coping resources, and prior experiences.</p>
          <p>SAMHSA's definition emphasizes the <strong>Three E's</strong>:</p>
          <ul>
            <li><strong>Events:</strong> The actual occurrence(s) — what happened. This includes obvious traumas (assault, accidents, disasters) as well as experiences that may not seem traumatic to outsiders but are experienced as overwhelming (medical procedures, sudden loss, witnessing violence).</li>
            <li><strong>Experience:</strong> How the individual perceives and processes the event — the subjective meaning. The same event affects different people differently based on age, prior trauma, support available, cultural context, and individual meaning-making.</li>
            <li><strong>Effects:</strong> The lasting adverse impacts on functioning — how it changes the person. These effects may be immediate or delayed, obvious or subtle, and can affect every domain of life including physical health, mental health, relationships, and worldview.</li>
          </ul>
          <p>This definition is crucial because it centers the survivor's experience rather than external judgments about whether an event "should" be traumatic. A clinician's assessment of an event's severity is irrelevant—what matters is how the person experienced it.</p>
          <p><strong>Key Insight:</strong> Trauma is not just about what happened TO a person; it's also about what DIDN'T happen—the absence of protection, comfort, safety, and responsive caregiving when it was needed.</p>`
        },
        {
          type: "imageText",
          order: 3,
          image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600",
          imageAlt: "Diverse group in supportive setting",
          imagePosition: "right",
          title: "The Prevalence of Trauma",
          content: `<p>Trauma exposure is far more common than many clinicians realize. Consider these statistics:</p>
          <ul>
            <li><strong>70% of adults</strong> worldwide have experienced at least one traumatic event in their lifetime</li>
            <li><strong>1 in 4 children</strong> experience abuse or neglect before age 18</li>
            <li><strong>90% of public mental health clients</strong> have significant trauma histories</li>
            <li><strong>61% of adults</strong> report at least one Adverse Childhood Experience (ACE)</li>
            <li><strong>1 in 5 women</strong> and <strong>1 in 71 men</strong> have experienced rape at some point in their lives</li>
            <li><strong>8% of the population</strong> will develop PTSD at some point—but many more experience sub-threshold symptoms</li>
          </ul>
          <p>These statistics underscore a critical point: <strong>every clinical interaction should be trauma-informed</strong>. We must assume trauma may be present even when not disclosed. Many survivors never tell anyone about their experiences—not because they weren't affected, but because of shame, fear, or lack of opportunity.</p>
          <p>This is why trauma-informed care is not a specialty—it's a universal approach that should inform all clinical practice.</p>`,
          highlight: true
        },
        {
          type: "accordion",
          order: 4,
          accordionItems: [
            {
              title: "Types of Trauma",
              content: `<p><strong>Acute Trauma:</strong> Single incident trauma such as an accident, assault, natural disaster, or witnessing violence. While occurring only once, acute trauma can still have profound and lasting effects, particularly if there is loss of life, physical injury, or intense fear for one's life.</p>
              <p><strong>Chronic Trauma:</strong> Repeated, prolonged exposure to traumatic circumstances such as ongoing abuse, domestic violence, war, or living in a violent community. The continuous nature of chronic trauma means the nervous system never has a chance to fully return to baseline, leading to persistent hypervigilance and altered stress responses.</p>
              <p><strong>Complex Trauma:</strong> Multiple traumatic events, often interpersonal in nature and beginning in childhood. Complex trauma frequently involves betrayal by caregivers or trusted figures, creating profound impacts on attachment, identity development, emotional regulation, and the capacity for relationships. Diagnoses like Borderline Personality Disorder often have complex trauma at their root.</p>
              <p><strong>Developmental Trauma:</strong> Trauma occurring during critical developmental periods, particularly early childhood when the brain is rapidly developing. This type of trauma literally shapes brain architecture, affecting stress response systems, emotional regulation circuits, and the capacity for secure attachment. The earlier the trauma, the more pervasive its effects.</p>
              <p><strong>Historical/Intergenerational Trauma:</strong> Trauma passed through generations, affecting entire communities and cultural groups. Examples include the impacts of colonization on Indigenous peoples, slavery on African Americans, the Holocaust on Jewish communities, and forced displacement on refugees. This trauma is transmitted through family dynamics, epigenetic changes, cultural disruption, and ongoing systemic oppression.</p>
              <p><strong>Vicarious Trauma (Secondary Traumatic Stress):</strong> Trauma experienced by helpers exposed to others' trauma stories and suffering. Clinicians, first responders, nurses, social workers, and others in helping professions are at risk. Vicarious trauma can cause symptoms similar to PTSD and lead to changes in worldview, such as increased cynicism or loss of faith in humanity.</p>`
            },
            {
              title: "Adverse Childhood Experiences (ACEs): The Foundational Research",
              content: `<p>The landmark ACE Study (Felitti et al., 1998) examined the relationship between childhood trauma and adult health outcomes in over 17,000 participants. This groundbreaking research forever changed our understanding of trauma's long-term impacts.</p>
              <p><strong>The 10 ACE Categories:</strong></p>
              <p><em>Abuse:</em></p>
              <ul>
                <li>Physical abuse</li>
                <li>Emotional/psychological abuse</li>
                <li>Sexual abuse</li>
              </ul>
              <p><em>Neglect:</em></p>
              <ul>
                <li>Physical neglect</li>
                <li>Emotional neglect</li>
              </ul>
              <p><em>Household Dysfunction:</em></p>
              <ul>
                <li>Mental illness in household</li>
                <li>Substance abuse in household</li>
                <li>Domestic violence</li>
                <li>Incarceration of household member</li>
                <li>Parental separation or divorce</li>
              </ul>
              <p><strong>Key Findings:</strong></p>
              <ul>
                <li>ACEs are extremely common—61% of adults report at least one; 16% report four or more</li>
                <li>ACEs tend to cluster—if you have one, you're likely to have more</li>
                <li>ACEs have a dose-response relationship—more ACEs = greater health risks</li>
                <li>Having 4+ ACEs increases risk of depression by 460%, alcoholism by 700%, and suicide attempt by 1,220%</li>
                <li>ACEs affect physical health too—increased risk of heart disease, cancer, diabetes, autoimmune disorders</li>
              </ul>
              <p><strong>Clinical Implication:</strong> High ACE scores don't determine destiny, but they indicate the need for trauma-informed approaches and attention to both mental and physical health.</p>`
            },
            {
              title: "The Neurobiology of Trauma: How Trauma Changes the Brain",
              content: `<p>Trauma literally changes brain structure and function. Understanding these changes helps clinicians and clients alike make sense of trauma symptoms.</p>
              <p><strong>Key Brain Structures Affected:</strong></p>
              <p><strong>1. Amygdala (Fear/Threat Detection):</strong></p>
              <ul>
                <li>Becomes hyperactive and enlarged after trauma</li>
                <li>Detects threats (real and perceived) more readily</li>
                <li>Triggers fight/flight/freeze responses</li>
                <li>Explains hypervigilance and exaggerated startle response</li>
              </ul>
              <p><strong>2. Hippocampus (Memory Processing):</strong></p>
              <ul>
                <li>Often shrinks with chronic trauma/stress</li>
                <li>Impaired ability to contextualize memories in time and place</li>
                <li>Explains why trauma memories feel "timeless" and present</li>
                <li>Contributes to intrusive memories and flashbacks</li>
              </ul>
              <p><strong>3. Prefrontal Cortex (Executive Function):</strong></p>
              <ul>
                <li>Reduced activity and connectivity after trauma</li>
                <li>Impaired decision-making, planning, and impulse control</li>
                <li>Difficulty modulating emotional responses</li>
                <li>Explains why trauma survivors may make "bad decisions" under stress</li>
              </ul>
              <p><strong>Clinical Implication:</strong> Trauma symptoms are not character flaws or choices—they're the brain's best attempt to protect from danger based on past experience. This knowledge reduces shame and increases self-compassion.</p>`
            },
            {
              title: "The Body Keeps the Score: Somatic Effects of Trauma",
              content: `<p>As Bessel van der Kolk famously wrote, "the body keeps the score." Trauma is stored not just in memory but in the body itself, leading to a wide range of physical symptoms and conditions.</p>
              <p><strong>Nervous System Dysregulation:</strong></p>
              <ul>
                <li>Chronic activation of the stress response (HPA axis)</li>
                <li>Elevated cortisol followed by cortisol depletion</li>
                <li>Autonomic nervous system dysregulation</li>
                <li>Difficulty moving between sympathetic (activation) and parasympathetic (rest) states</li>
              </ul>
              <p><strong>Physical Health Impacts:</strong></p>
              <ul>
                <li>Increased inflammation throughout the body</li>
                <li>Compromised immune function</li>
                <li>Higher rates of autoimmune disorders</li>
                <li>Cardiovascular disease and hypertension</li>
                <li>Chronic pain conditions (fibromyalgia, chronic fatigue)</li>
                <li>Gastrointestinal problems (IBS, ulcers)</li>
                <li>Sleep disorders</li>
                <li>Headaches and migraines</li>
              </ul>
              <p><strong>Somatic Symptoms:</strong></p>
              <ul>
                <li>Chronic muscle tension</li>
                <li>Difficulty breathing or throat constriction</li>
                <li>Digestive disturbances</li>
                <li>Unexplained physical sensations</li>
                <li>Dissociation from bodily experience</li>
              </ul>
              <p><strong>Clinical Implication:</strong> Trauma treatment must address the body, not just thoughts and emotions. Body-based approaches (somatic experiencing, yoga, breathwork) are essential components of comprehensive trauma care.</p>`
            },
            {
              title: "Windows of Tolerance: Understanding Arousal States",
              content: `<p>Dan Siegel's concept of the "Window of Tolerance" describes the zone of arousal within which a person can function effectively. Trauma narrows this window, making it easier to become dysregulated.</p>
              <p><strong>Within the Window of Tolerance:</strong></p>
              <ul>
                <li>Able to think clearly and problem-solve</li>
                <li>Emotions are manageable</li>
                <li>Can engage socially and relationally</li>
                <li>Body feels relatively calm and regulated</li>
                <li>Present-focused and grounded</li>
              </ul>
              <p><strong>Hyperarousal (Above the Window):</strong></p>
              <ul>
                <li>Anxiety, panic, racing thoughts</li>
                <li>Hypervigilance, easily startled</li>
                <li>Anger, irritability, aggression</li>
                <li>Physical tension, rapid heartbeat</li>
                <li>Difficulty sitting still, racing speech</li>
                <li>Associated with fight or flight response</li>
              </ul>
              <p><strong>Hypoarousal (Below the Window):</strong></p>
              <ul>
                <li>Numbness, disconnection, dissociation</li>
                <li>Flat affect, minimal emotional response</li>
                <li>Fatigue, exhaustion, "shutting down"</li>
                <li>Difficulty thinking, foggy mind</li>
                <li>Feeling frozen or collapsed</li>
                <li>Associated with freeze or collapse response</li>
              </ul>
              <p><strong>Trauma Impact:</strong> Trauma survivors often have a very narrow window of tolerance, oscillating rapidly between hyper- and hypoarousal with little middle ground. Treatment aims to widen the window and build capacity to return to regulated states.</p>`
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "According to SAMHSA's definition, which of the 'Three E's' emphasizes how the individual perceives and processes a traumatic event?",
          options: [
            { text: "Events", isCorrect: false },
            { text: "Experience", isCorrect: true },
            { text: "Effects", isCorrect: false },
            { text: "Environment", isCorrect: false }
          ],
          explanation: "Experience refers to how the individual subjectively perceives and processes the event. This is why two people can experience the same event with very different trauma outcomes."
        },
        {
          type: "multiSelect",
          order: 6,
          question: "Which of the following are types of trauma? (Select all that apply)",
          options: [
            { text: "Acute trauma (single incident)", isCorrect: true },
            { text: "Complex trauma (multiple, often interpersonal)", isCorrect: true },
            { text: "Behavioral trauma", isCorrect: false },
            { text: "Historical/intergenerational trauma", isCorrect: true },
            { text: "Vicarious trauma (experienced by helpers)", isCorrect: true }
          ],
          explanation: "Trauma types include acute, chronic, complex, developmental, historical/intergenerational, and vicarious trauma. Each has distinct characteristics and treatment implications."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Trauma Prevalence in Your Practice",
          prompt: "Consider your current caseload or clinical population. What types of trauma are most common among your clients? How might the high prevalence of trauma (70% of adults) change how you approach intake assessments and treatment planning?",
          placeholder: "Reflect on how trauma prevalence impacts your clinical work...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "What percentage of adults worldwide have experienced at least one traumatic event?",
          type: "multipleChoice",
          options: [
            { text: "30%", isCorrect: false },
            { text: "50%", isCorrect: false },
            { text: "70%", isCorrect: true },
            { text: "90%", isCorrect: false }
          ],
          explanation: "Approximately 70% of adults worldwide have experienced at least one traumatic event, highlighting why trauma-informed approaches are essential."
        },
        {
          question: "The ACE Study found that having 4+ Adverse Childhood Experiences:",
          type: "multipleChoice",
          options: [
            { text: "Has no significant health impact", isCorrect: false },
            { text: "Dramatically increases risk for chronic disease and early death", isCorrect: true },
            { text: "Only affects mental health, not physical health", isCorrect: false },
            { text: "Is extremely rare in the general population", isCorrect: false }
          ],
          explanation: "The ACE Study found a dose-response relationship — more ACEs correlate with greater health risks, including chronic disease, mental illness, and early mortality."
        }
      ]
    },

    // SECTION 2: SAMHSA's Six Principles
    {
      title: "SAMHSA's Six Key Principles",
      description: "The foundational principles for implementing trauma-informed care in any setting",
      order: 2,
      estimatedTime: 50,
      thumbnail: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "SAMHSA's Six Key Principles",
          subtitle: "Building Blocks of Trauma-Informed Care"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>The Foundation of Trauma-Informed Practice</h3>
          <p>In 2014, SAMHSA (Substance Abuse and Mental Health Services Administration) published six key principles that guide trauma-informed approaches. These principles have become the gold standard for implementing trauma-informed care across settings—clinical practice, schools, healthcare, criminal justice, child welfare, and organizational development.</p>
          <p>These principles are not techniques or interventions in themselves. Rather, they represent a <strong>fundamental shift in perspective</strong>—a lens through which all interactions, policies, and decisions are filtered. Implementing trauma-informed care means asking at every turn: "How does this align with these six principles? Could this practice inadvertently harm someone with a trauma history?"</p>
          <p><strong>Why These Principles Matter:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>They address the core wounds of trauma: loss of safety, trust, control, and connection</li>
            <li>They prevent re-traumatization by identifying and eliminating harmful practices</li>
            <li>They create environments where healing can occur</li>
            <li>They apply universally—to individuals, organizations, and systems</li>
            <li>They can be implemented regardless of resources or setting</li>
          </ul>
          <p>As you learn each principle, consider: How well does your current practice embody this principle? What small changes could make a significant difference? Remember that trauma-informed care is a journey, not a destination—continuous improvement is the goal.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "1. SAFETY",
              content: `<p><strong>The foundational principle upon which all others rest.</strong></p>
              <p>Safety encompasses both physical and emotional/psychological security. Without safety, no meaningful therapeutic work can occur. Trauma survivors often have compromised ability to accurately detect safety versus danger—their nervous system is calibrated for threat, not security. This means we must be intentional and explicit about creating safety rather than assuming it exists.</p>
              <p><strong>Physical Safety includes:</strong></p>
              <ul>
                <li>Safe, welcoming, clean physical environment</li>
                <li>Clear exits and sightlines—the client should never feel trapped</li>
                <li>Good lighting that isn't harsh—dim lighting can feel unsafe</li>
                <li>Comfortable seating with options for where to sit</li>
                <li>Temperature control and comfort</li>
                <li>Privacy protections—soundproofing, no interruptions</li>
                <li>Predictable routines and schedules—knowing what to expect</li>
                <li>Clear signage and wayfinding</li>
              </ul>
              <p><strong>Emotional Safety includes:</strong></p>
              <ul>
                <li>Consistent, reliable relationships—the clinician shows up the same way each session</li>
                <li>Clear boundaries and expectations—both parties know the rules</li>
                <li>Validating and non-judgmental responses—feelings are accepted without criticism</li>
                <li>Freedom from shaming, blaming, or coercion—no one is made to feel bad about themselves</li>
                <li>Respect for autonomy—the client's decisions are honored</li>
                <li>Cultural sensitivity and humility—differences are respected</li>
              </ul>
              <p><strong>Clinical Application:</strong> Begin each session by checking in about safety. Use language like "I want to make sure you feel safe here. Is there anything I can do to help with that?" Be attentive to subtle signs of discomfort—shifts in body posture, changes in eye contact, voice changes, fidgeting—that may indicate the client is feeling unsafe even if they don't verbalize it. Create a "safety signal" the client can use if they need a break or feel overwhelmed.</p>`
            },
            {
              title: "2. TRUSTWORTHINESS AND TRANSPARENCY",
              content: `<p><strong>Building and maintaining trust through honest, consistent communication.</strong></p>
              <p>Trauma often involves betrayal of trust—by caregivers, institutions, or society. Survivors may expect to be let down, lied to, or exploited. Rebuilding trust requires intentional effort, consistency over time, and tolerance for the testing that often occurs.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li>Be clear about what you can and cannot offer—avoid overpromising</li>
                <li>Explain processes, policies, and decisions openly—no hidden agendas</li>
                <li>Follow through on commitments—do what you say you'll do</li>
                <li>Acknowledge mistakes honestly and work to repair ruptures</li>
                <li>Maintain appropriate boundaries consistently—predictability builds trust</li>
                <li>Be transparent about the rationale for clinical decisions</li>
                <li>Prepare clients for what to expect in treatment</li>
              </ul>
              <p><strong>Clinical Application:</strong> Explain informed consent thoroughly at intake. Be transparent about session structure, confidentiality limits, and what to expect from treatment. If you need to cancel, reschedule, or change something, communicate proactively and honestly. When ruptures occur (and they will), address them directly: "I noticed you seemed upset when I said that. Can we talk about what happened?"</p>
              <p><strong>Remember:</strong> Trust is built in small moments over time. Every interaction either builds or erodes trust.</p>`
            },
            {
              title: "3. PEER SUPPORT",
              content: `<p><strong>The healing power of shared experience.</strong></p>
              <p>Connection with others who have "been there" provides unique validation, understanding, and hope that professional support cannot fully replicate. Peer support demonstrates that recovery is possible because peers embody living proof.</p>
              <p><strong>Benefits of Peer Support:</strong></p>
              <ul>
                <li><strong>Reduces isolation and shame:</strong> "I'm not the only one" is profoundly healing</li>
                <li><strong>Provides hope through lived example:</strong> Seeing others recover makes recovery imaginable</li>
                <li><strong>Offers practical wisdom from experience:</strong> Strategies that worked for people who really understand</li>
                <li><strong>Creates community and belonging:</strong> A tribe of people who "get it"</li>
                <li><strong>Shifts identity:</strong> From "patient" to someone with valuable experience to share</li>
              </ul>
              <p><strong>Forms of Peer Support:</strong></p>
              <ul>
                <li>Support groups (trauma-specific, general mental health)</li>
                <li>12-step and other recovery programs</li>
                <li>Peer specialists and peer counselors</li>
                <li>Online communities and forums</li>
                <li>Survivor advocacy organizations</li>
              </ul>
              <p><strong>Clinical Application:</strong> Assess interest in peer support and make appropriate referrals. Integrate peer support as a complement to professional treatment, not a replacement. Respect client autonomy about when and how much to share their story.</p>`
            },
            {
              title: "4. COLLABORATION AND MUTUALITY",
              content: `<p><strong>Leveling power differences and partnering in the healing process.</strong></p>
              <p>Trauma often involves power imbalances and loss of control. The therapeutic relationship should model healthy power-sharing, not replicate the power dynamics of traumatic relationships.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li><strong>Position yourself as partner, not expert:</strong> The client is the expert on their own life</li>
                <li><strong>Value client expertise:</strong> They know their history, values, and what has and hasn't worked</li>
                <li><strong>Involve clients in treatment planning:</strong> Collaboratively set goals and choose approaches</li>
                <li><strong>Share decision-making genuinely:</strong> Not just asking for input then doing what you planned anyway</li>
                <li><strong>Acknowledge the power inherent in your role:</strong> Don't pretend you're equals—but minimize power differential where possible</li>
                <li><strong>Be humble:</strong> You don't have all the answers; the client may know things you don't</li>
              </ul>
              <p><strong>Language of Collaboration:</strong></p>
              <ul>
                <li>"What would be most helpful for you today?" (vs. "Today we're going to...")</li>
                <li>"What do you think about...?" (vs. "You should...")</li>
                <li>"I have some ideas, but I'd like to hear your thoughts first"</li>
                <li>"Does this make sense to you? Does it fit your experience?"</li>
              </ul>
              <p><strong>Clinical Application:</strong> Check in regularly about whether the approach is working. Be genuinely open to feedback and course correction. When recommending interventions, explain options and invite the client to choose based on what fits for them.</p>`
            },
            {
              title: "5. EMPOWERMENT, VOICE, AND CHOICE",
              content: `<p><strong>Restoring agency and self-determination.</strong></p>
              <p>Trauma takes away choice and control. Survivors often feel helpless, voiceless, and at the mercy of others. Treatment should restore both by recognizing strengths, supporting autonomy, and maximizing opportunities for choice.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li><strong>Recognize and build on client strengths:</strong> Everyone has survived something; identify the skills that got them here</li>
                <li><strong>Offer choices whenever possible:</strong> Where to sit, what to discuss, how to proceed, when to take breaks</li>
                <li><strong>Support self-advocacy skills:</strong> Help clients practice speaking up for themselves</li>
                <li><strong>Celebrate small victories and progress:</strong> Notice and name growth, even small steps</li>
                <li><strong>Avoid doing for clients what they can do themselves:</strong> Support autonomy even when it would be faster to do it for them</li>
                <li><strong>Help clients find their voice:</strong> Encourage expression and support them in being heard</li>
              </ul>
              <p><strong>Examples of Offering Choice:</strong></p>
              <ul>
                <li>"Would you prefer to start with grounding or check in about the week?"</li>
                <li>"We could continue with this topic or shift to something else—what feels right?"</li>
                <li>"Would you like to sit here or over there?"</li>
                <li>"Is it okay if I ask about that, or would you rather not go there today?"</li>
              </ul>
              <p><strong>Clinical Application:</strong> Start by asking what the client wants to work on rather than imposing an agenda. When they seem stuck, ask "What do you need right now?" rather than prescribing a solution. Reflect back their strengths: "You've been through so much and you're still here. What has helped you survive?"</p>`
            },
            {
              title: "6. CULTURAL, HISTORICAL, AND GENDER ISSUES",
              content: `<p><strong>Recognizing the role of culture, history, and context in trauma.</strong></p>
              <p>Trauma does not occur in a vacuum. Culture shapes how trauma is experienced, expressed, coped with, and healed. Historical trauma affects entire communities across generations. Gender influences both exposure to certain traumas and how responses are perceived and treated.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li><strong>Recognize your own cultural biases:</strong> Your assumptions about "normal" trauma responses may be culturally specific</li>
                <li><strong>Understand how culture affects trauma expression:</strong> Somatization, spiritual interpretations, collective vs. individual focus</li>
                <li><strong>Acknowledge historical and ongoing systemic trauma:</strong> Racism, colonization, displacement, persecution</li>
                <li><strong>Adapt approaches to be culturally responsive:</strong> One size does not fit all</li>
                <li><strong>Avoid pathologizing cultural differences:</strong> What looks like "symptoms" may be culturally appropriate responses</li>
                <li><strong>Consider intersectionality:</strong> Multiple identities interact to shape trauma experience</li>
              </ul>
              <p><strong>Historical Trauma Considerations:</strong></p>
              <ul>
                <li>Indigenous peoples: Colonization, forced assimilation, residential schools</li>
                <li>African Americans: Slavery, Jim Crow, ongoing racism and police violence</li>
                <li>Holocaust survivors and descendants</li>
                <li>Refugees and immigrants: Displacement, loss of homeland and culture</li>
                <li>LGBTQ+ communities: Historical and ongoing discrimination and violence</li>
              </ul>
              <p><strong>Clinical Application:</strong> Ask about cultural background and how it influences the client's understanding of their experiences. Be curious rather than assuming. Acknowledge the impact of systemic oppression on mental health. Use culturally adapted evidence-based treatments when available.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
          imageAlt: "Therapist and client in collaborative conversation",
          imagePosition: "left",
          title: "Putting Principles into Practice",
          content: `<p>These six principles work together as an integrated framework:</p>
          <p><strong>Safety</strong> creates the foundation for <strong>Trust</strong>, which enables <strong>Collaboration</strong>.</p>
          <p><strong>Empowerment</strong> is supported by <strong>Peer Support</strong> and validated through <strong>Cultural Responsiveness</strong>.</p>
          <p>When one principle is compromised, the others are weakened. When all are present, healing becomes possible.</p>`,
          highlight: true
        },
        {
          type: "matching",
          order: 5,
          matchingInstructions: "Match each principle with its core focus:",
          matchingPairs: [
            { term: "Safety", definition: "Physical and emotional security" },
            { term: "Trustworthiness", definition: "Honest, transparent communication" },
            { term: "Peer Support", definition: "Healing through shared experience" },
            { term: "Collaboration", definition: "Leveling power differences" },
            { term: "Empowerment", definition: "Restoring voice and choice" },
            { term: "Cultural Issues", definition: "Recognizing context and history" }
          ]
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Which principle of trauma-informed care is considered the foundation upon which all others rest?",
          options: [
            { text: "Trustworthiness", isCorrect: false },
            { text: "Empowerment", isCorrect: false },
            { text: "Safety", isCorrect: true },
            { text: "Collaboration", isCorrect: false }
          ],
          explanation: "Safety (both physical and emotional) is the foundational principle. Without a sense of safety, trauma survivors cannot engage in the healing process."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Implementing the Six Principles",
          prompt: "Choose one of SAMHSA's six principles that you feel you could strengthen in your practice. What specific changes would you make to your office environment, intake process, or session structure to better embody this principle?",
          placeholder: "Reflect on how you can better implement trauma-informed principles...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which principle emphasizes leveling power differences and partnering with clients?",
          type: "multipleChoice",
          options: [
            { text: "Safety", isCorrect: false },
            { text: "Peer Support", isCorrect: false },
            { text: "Collaboration and Mutuality", isCorrect: true },
            { text: "Trustworthiness", isCorrect: false }
          ],
          explanation: "Collaboration and Mutuality focuses on partnering with clients and sharing power in the therapeutic relationship."
        },
        {
          question: "The principle of Empowerment, Voice, and Choice focuses on:",
          type: "multipleChoice",
          options: [
            { text: "The clinician making decisions for the client", isCorrect: false },
            { text: "Restoring agency and self-determination", isCorrect: true },
            { text: "Peer-to-peer connections only", isCorrect: false },
            { text: "Physical safety measures", isCorrect: false }
          ],
          explanation: "Empowerment, Voice, and Choice is about restoring the agency and self-determination that trauma takes away."
        }
      ]
    },

    // SECTION 3: Creating Safety
    {
      title: "Creating Therapeutic Safety",
      description: "Practical strategies for establishing physical and emotional safety in clinical settings",
      order: 3,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 3,
          title: "Creating Therapeutic Safety",
          subtitle: "Building a Foundation for Healing"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Why Safety Must Come First</h3>
          <p>Judith Herman's seminal work identified <strong>safety as the first stage of trauma recovery</strong>. Without establishing safety, deeper trauma processing can be harmful and re-traumatizing. This is not merely a clinical guideline—it reflects fundamental neurobiology.</p>
          <p>For trauma survivors, the nervous system is often stuck in survival mode—constantly scanning for threat, ready to fight, flee, or freeze. The amygdala is hyperactive, the stress response system is dysregulated, and the prefrontal cortex (necessary for reflection, learning, and change) is suppressed.</p>
          <p>Creating safety helps the nervous system downregulate from this hypervigilant state, enabling access to the "thinking brain" necessary for therapeutic work. Without this foundation, any intervention risks overwhelming the client rather than healing them.</p>
          <p><strong>Key Insight:</strong> Safety is not just about the absence of threat; it's about the <strong>active presence of signals that communicate "you are safe here."</strong> In polyvagal terms, we need to activate the client's social engagement system through cues of safety.</p>
          <p>Safety exists on multiple levels that all require attention:</p>
          <ul>
            <li><strong>Physical safety:</strong> The environment, space, and bodies</li>
            <li><strong>Emotional safety:</strong> Relationships, interactions, and responses</li>
            <li><strong>Predictability and control:</strong> Knowing what to expect and having choices</li>
            <li><strong>Relational safety:</strong> The therapeutic relationship itself</li>
          </ul>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Physical Environment Safety",
              content: `<p>The physical environment sends powerful signals about safety that are processed subconsciously. Pay attention to every detail of the space.</p>
              <p><strong>Office/Space Considerations:</strong></p>
              <ul>
                <li><strong>Clear sightlines to exits:</strong> Never position yourself between the client and the door. Trauma survivors need to know they can leave.</li>
                <li><strong>Adequate lighting:</strong> Not harsh (anxiety-provoking) or too dim (can feel unsafe or triggering)</li>
                <li><strong>Comfortable seating with options:</strong> Let clients choose where to sit, how close to you, whether to face you directly</li>
                <li><strong>Minimal clutter:</strong> Visual chaos can increase anxiety; organized space communicates stability</li>
                <li><strong>Temperature control:</strong> A cold room activates the stress response</li>
                <li><strong>Privacy:</strong> Soundproofing so conversations can't be overheard; no interruptions</li>
                <li><strong>Sensory considerations:</strong> Calming colors, plants, no strong scents (can be triggering)</li>
                <li><strong>Personal items:</strong> Some personalizing can help clients see you as human and trustworthy</li>
              </ul>
              <p><strong>Waiting Area:</strong></p>
              <ul>
                <li>Comfortable and welcoming atmosphere</li>
                <li>Clear signage and expectations about process</li>
                <li>Staff interactions are warm, patient, and respectful</li>
                <li>Magazines and reading material that aren't triggering</li>
                <li>Not too crowded or chaotic</li>
              </ul>
              <p><strong>Telehealth Considerations:</strong></p>
              <ul>
                <li>Ensure client has private space for sessions</li>
                <li>Discuss what to do if someone walks in</li>
                <li>Have backup communication method if tech fails</li>
                <li>Your background should be professional and non-distracting</li>
              </ul>`
            },
            {
              title: "Relational Safety",
              content: `<p><strong>Your Presence Matters:</strong></p>
              <ul>
                <li>Calm, regulated nervous system (co-regulation)</li>
                <li>Warm, genuine, non-judgmental demeanor</li>
                <li>Consistent and predictable behavior</li>
                <li>Clear boundaries maintained kindly</li>
              </ul>
              <p><strong>Communication:</strong></p>
              <ul>
                <li>Explain what you're doing and why</li>
                <li>Ask permission before interventions</li>
                <li>Check in about comfort regularly</li>
                <li>Respond to distress with calm validation</li>
              </ul>
              <p><strong>Remember:</strong> You are a "neuroception of safety" — your regulated presence signals safety to the client's nervous system.</p>`
            },
            {
              title: "Predictability and Structure: Creating Containment",
              content: `<p>Trauma often involves chaos, unpredictability, and loss of control. Structure and predictability in therapy provide containment—a sense that things are organized, reliable, and manageable.</p>
              <p><strong>Elements of Predictability:</strong></p>
              <ul>
                <li>Consistent session times and length—same day, same time, same duration</li>
                <li>Clear session structure—clients know what to expect</li>
                <li>Transparent processes—no surprises or hidden agendas</li>
                <li>Advance notice of changes—vacations, schedule changes, policy updates communicated ahead of time</li>
                <li>Reliable follow-through—you do what you say you'll do</li>
                <li>Same physical setup—chair positions, lighting, materials consistently arranged</li>
              </ul>
              <p><strong>Sample Session Structure:</strong></p>
              <ol>
                <li><strong>Opening/Check-in:</strong> How are they arriving? What's happened since last session? Brief grounding if needed</li>
                <li><strong>Bridge:</strong> Connect to previous session—"Last time we discussed..." Creates continuity</li>
                <li><strong>Main work:</strong> The core focus of today's session—skills building, processing, problem-solving</li>
                <li><strong>Processing:</strong> What came up? What does client take away? Integration time</li>
                <li><strong>Closure/Grounding:</strong> Don't end in the middle of difficult material. Ground, contain, plan for the week</li>
              </ol>
              <p><strong>Why Structure Matters:</strong></p>
              <ul>
                <li>Creates sense of safety and control</li>
                <li>Reduces anxiety about "what will happen"</li>
                <li>Models healthy boundaries and containment</li>
                <li>Prevents sessions from becoming chaotic or overwhelming</li>
                <li>Helps clients learn to structure their own lives</li>
              </ul>
              <p><strong>Tip:</strong> Verbalize the structure: "We have about 15 minutes left today, so let's start winding down and think about what you want to hold onto from today."</p>`
            },
            {
              title: "Collaborative Safety Planning: Empowering Clients",
              content: `<p>Safety planning should be a collaborative process that empowers clients to create their own safety rather than having it imposed on them. This collaboration itself is therapeutic—countering the loss of control that characterized their trauma.</p>
              <p><strong>Questions to Explore:</strong></p>
              <ul>
                <li>"What helps you feel safe?" (Listen for what actually works for THIS person)</li>
                <li>"Is there anything about this space that feels uncomfortable?" (Be willing to adjust)</li>
                <li>"What would you like me to do if you become overwhelmed in session?" (Create a plan in advance)</li>
                <li>"What's your signal if you need to pause or stop?" (Establish a clear communication method)</li>
                <li>"What does feeling 'safe' mean to you?" (Definitions vary by person and culture)</li>
                <li>"What helps you feel grounded when you're triggered at home?"</li>
              </ul>
              <p><strong>Creating Safety Plans Together:</strong></p>
              <ul>
                <li><strong>Identify early warning signs:</strong> What are the first indications they're becoming activated? What body sensations, thoughts, or behaviors signal distress?</li>
                <li><strong>List coping strategies that work:</strong> What has helped before? What are they willing to try?</li>
                <li><strong>Identify support people:</strong> Who can they contact? What would they say?</li>
                <li><strong>Plan for crisis:</strong> What to do if things escalate beyond coping skills? Crisis line numbers, emergency contacts, when to seek emergency care.</li>
                <li><strong>Create environmental safety:</strong> Means restriction, safe spaces, items that help them ground.</li>
              </ul>
              <p><strong>Document the Plan:</strong> Write it down—the client should have a copy. Review and update regularly. This becomes their roadmap for managing distress.</p>`
            },
            {
              title: "Managing Therapeutic Pace: Working Within the Window",
              content: `<p>One of the most important trauma-informed skills is pacing—keeping the work within the client's window of tolerance so they can process without being overwhelmed. Too fast leads to flooding; too slow may never address the trauma.</p>
              <p><strong>Window of Tolerance Awareness:</strong></p>
              <p>The window of tolerance is the zone where a person can think, feel, and function effectively. Keep therapeutic work within this window. Signs of leaving the window:</p>
              <ul>
                <li><strong>Hyperarousal (above window):</strong> Agitation, rapid speech, racing thoughts, anxiety, anger, inability to sit still, hypervigilance</li>
                <li><strong>Hypoarousal (below window):</strong> Shutdown, dissociation, flat affect, disconnection, glazed eyes, slowed responses, numbness</li>
              </ul>
              <p><strong>Pacing Strategies:</strong></p>
              <ul>
                <li><strong>Titration:</strong> Work with small doses of difficult material rather than diving into the deep end. Process a piece, ground, process another piece.</li>
                <li><strong>Pendulation:</strong> Intentionally move between distress and resource. Touch the difficult material, then return to safety. This builds capacity over time.</li>
                <li><strong>Grounding:</strong> Ground before, during, and after difficult content. Never let a client leave highly activated.</li>
                <li><strong>Check-ins:</strong> Regularly ask "How are you doing?" "What are you noticing in your body?" "Do we need to slow down?"</li>
                <li><strong>"Slow is fast":</strong> Rushing to process trauma often backfires. Slower, safer work gets better results in the long run.</li>
                <li><strong>Respect client limits:</strong> If they say "I can't go there today," believe them.</li>
              </ul>
              <p><strong>Key Principles:</strong></p>
              <ul>
                <li>"If in doubt, ground it out."</li>
                <li>A session that ends calmly is better than one that processes "more" but leaves the client destabilized.</li>
                <li>Build tolerance gradually—today's edge becomes tomorrow's baseline.</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600",
          imageAlt: "Calming therapy office environment",
          imagePosition: "right",
          title: "The Language of Safety: Words That Heal",
          content: `<p>Words matter deeply to trauma survivors. The language we use can either reinforce safety or trigger defensive responses. Trauma-informed language communicates respect, collaboration, and care.</p>
          <p><strong>Reframes for Common Situations:</strong></p>
          <p><strong>Instead of:</strong> "Why did you..." → <strong>Try:</strong> "Help me understand what happened..."</p>
          <p><strong>Instead of:</strong> "You need to..." → <strong>Try:</strong> "What would feel helpful?" or "One option might be..."</p>
          <p><strong>Instead of:</strong> "Calm down" → <strong>Try:</strong> "I'm here with you. Let's breathe together."</p>
          <p><strong>Instead of:</strong> "That shouldn't bother you" → <strong>Try:</strong> "It makes sense this is hard given what you've been through."</p>
          <p><strong>Instead of:</strong> "You always..." → <strong>Try:</strong> "I've noticed a pattern that..."</p>
          <p><strong>Instead of:</strong> "But..." (negating) → <strong>Try:</strong> "And..." (adding)</p>
          <p><strong>Phrases That Communicate Safety:</strong></p>
          <ul>
            <li>"You're safe here."</li>
            <li>"Take all the time you need."</li>
            <li>"There's no wrong way to feel about this."</li>
            <li>"What would be most helpful right now?"</li>
            <li>"We can slow down or stop whenever you need."</li>
          </ul>`,
          highlight: true
        },
        {
          type: "multiSelect",
          order: 5,
          question: "Which of the following contribute to physical environment safety? (Select all that apply)",
          options: [
            { text: "Clear sightlines to exits", isCorrect: true },
            { text: "Blocking the door to prevent client from leaving", isCorrect: false },
            { text: "Comfortable seating with options", isCorrect: true },
            { text: "Adequate, non-harsh lighting", isCorrect: true },
            { text: "Surprising the client to test their reactions", isCorrect: false }
          ],
          explanation: "Physical safety includes clear exits, comfortable options, and appropriate lighting. Blocking exits or surprising clients would undermine safety."
        },
        {
          type: "reflection",
          order: 6,
          title: "Clinical Reflection: Assessing Your Environment",
          prompt: "Walk through your clinical space (physically or mentally). What elements promote safety and comfort? What might inadvertently trigger or re-traumatize clients? Identify one concrete change you could make to enhance the trauma-informed quality of your environment.",
          placeholder: "Reflect on your clinical environment and potential improvements...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "According to Judith Herman, what is the first stage of trauma recovery?",
          type: "multipleChoice",
          options: [
            { text: "Processing traumatic memories", isCorrect: false },
            { text: "Establishing safety", isCorrect: true },
            { text: "Reconnection with community", isCorrect: false },
            { text: "Cognitive restructuring", isCorrect: false }
          ],
          explanation: "Herman identified safety as the first stage, followed by remembrance/mourning, and then reconnection."
        },
        {
          question: "Signs that a client may be moving into hyperarousal include:",
          type: "multipleChoice",
          options: [
            { text: "Flat affect and disconnection", isCorrect: false },
            { text: "Agitation, rapid speech, and anxiety", isCorrect: true },
            { text: "Falling asleep in session", isCorrect: false },
            { text: "Speaking very slowly", isCorrect: false }
          ],
          explanation: "Hyperarousal signs include agitation, rapid speech, anxiety, and anger — indicating the sympathetic nervous system is activated."
        }
      ]
    },

    // SECTION 4: Avoiding Re-traumatization
    {
      title: "Avoiding Re-traumatization",
      description: "Recognizing and preventing practices that can harm trauma survivors",
      order: 4,
      estimatedTime: 40,
      thumbnail: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Avoiding Re-traumatization",
          subtitle: "First, Do No Harm"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>What is Re-traumatization?</h3>
          <p>Re-traumatization occurs when a person who has experienced trauma is exposed to situations that replicate the dynamics, power imbalances, or feelings of the original trauma. Unlike a "trigger" (which reminds someone of trauma), re-traumatization actually causes new psychological injury by repeating the traumatic dynamic.</p>
          <p><strong>Re-traumatization can be caused by:</strong></p>
          <ul>
            <li><strong>Direct actions:</strong> Coercion, violation of boundaries, use of restraints or seclusion, forced treatment</li>
            <li><strong>Environmental factors:</strong> Institutional settings that feel like captivity, lack of privacy, chaotic or unpredictable environments</li>
            <li><strong>Relational dynamics:</strong> Power imbalances that mirror abusive relationships, betrayal of trust, minimizing or dismissing experiences</li>
            <li><strong>Clinical practices:</strong> Forced disclosure of trauma details, overwhelming processing before stabilization, rigid rules without explanation</li>
            <li><strong>Systemic issues:</strong> Having to retell trauma story repeatedly to different providers, bureaucratic barriers to care, lack of trauma-informed policies</li>
          </ul>
          <p><strong>Why Re-traumatization is So Harmful:</strong></p>
          <ul>
            <li>Reinforces beliefs that the world is unsafe and others cannot be trusted</li>
            <li>Confirms fears that help-seeking is dangerous</li>
            <li>Can cause new trauma symptoms or exacerbate existing ones</li>
            <li>Damages the therapeutic relationship and future willingness to seek help</li>
            <li>Can lead to dropout from treatment</li>
          </ul>
          <p><strong>The Imperative:</strong> Every clinician must be able to recognize practices that risk re-traumatization and have alternatives ready. The goal is not just to treat trauma but to avoid causing additional harm.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Common Clinical Pitfalls",
              content: `<p><strong>Practices that can re-traumatize clients:</strong></p>
              <ul>
                <li><strong>Forcing trauma disclosure:</strong> Pressuring clients to share trauma details before they're ready. The client may comply due to power dynamics but at significant psychological cost.</li>
                <li><strong>Overwhelm:</strong> Processing too much material too fast without adequate stabilization. This can flood the client and cause decompensation rather than healing.</li>
                <li><strong>Rigid rules and policies:</strong> Inflexible policies that don't account for trauma needs—strict no-contact policies, rigid attendance requirements, punitive responses to "non-compliance."</li>
                <li><strong>Power imbalances:</strong> Authoritarian stance, making decisions without client input, not explaining rationale for treatment choices.</li>
                <li><strong>Boundary violations:</strong> Inappropriate self-disclosure, dual relationships, physical touch without consent, using the therapeutic relationship for clinician's emotional needs.</li>
                <li><strong>Dismissing or minimizing:</strong> Statements like "That wasn't that bad" or "You should be over it by now" or "Other people have been through worse."</li>
                <li><strong>Blaming:</strong> Questions like "Why didn't you leave?" or "What were you wearing?" or "Why did you put yourself in that situation?"</li>
                <li><strong>Pathologizing survival strategies:</strong> Labeling trauma responses as "manipulative," "attention-seeking," or "character flaws."</li>
                <li><strong>Surprise interventions:</strong> Introducing exposure or processing without preparation, warning, or consent.</li>
              </ul>
              <p><strong>Common Phrases That Can Re-traumatize:</strong></p>
              <ul>
                <li>"Everything happens for a reason"</li>
                <li>"What doesn't kill you makes you stronger"</li>
                <li>"You need to forgive and move on"</li>
                <li>"Try not to think about it"</li>
                <li>"It could have been worse"</li>
              </ul>`
            },
            {
              title: "Institutional Re-traumatization",
              content: `<p>Systems and institutions can replicate trauma dynamics, even when individual staff members have good intentions. Understanding institutional re-traumatization is essential for advocacy and systemic change.</p>
              <p><strong>Common Institutional Practices That Re-traumatize:</strong></p>
              <ul>
                <li><strong>Loss of control:</strong> Rigid schedules, no choice in treatment, mandatory participation, rules without explanation</li>
                <li><strong>Loss of privacy:</strong> Forced disclosure of trauma details to multiple people, group intake processes, lack of confidentiality</li>
                <li><strong>Power imbalances:</strong> Hierarchical systems where clients have no voice, punitive responses to "non-compliance," staff who use authority coercively</li>
                <li><strong>Unpredictability:</strong> Inconsistent staff, sudden rule changes, unclear expectations, arbitrary consequences</li>
                <li><strong>Isolation:</strong> Separation from support systems, limited contact with family, restriction of communication</li>
                <li><strong>Physical interventions:</strong> Use of restraints, seclusion, or forced medication—practices that can directly replicate abuse dynamics</li>
                <li><strong>Bureaucratic barriers:</strong> Complex paperwork, long wait times, having to "prove" trauma to access services</li>
              </ul>
              <p><strong>Populations at Particular Risk:</strong></p>
              <ul>
                <li>Psychiatric inpatient patients</li>
                <li>Incarcerated individuals</li>
                <li>Children in foster care or residential treatment</li>
                <li>People in homeless shelters</li>
                <li>Individuals seeking asylum or immigration services</li>
                <li>Emergency room patients</li>
              </ul>
              <p><strong>The Advocacy Role:</strong> Trauma-informed clinicians must advocate for systemic change, not just individual treatment. This means speaking up when policies or practices are harmful, participating in organizational change efforts, and using your professional voice to influence systems.</p>
              <p><strong>Questions to Ask:</strong> "How would this policy feel to someone who has been abused or traumatized? Does this practice give people choice and control? What message does this send about whether we trust and respect the people we serve?"</p>`
            },
            {
              title: "Assessment Without Re-traumatization",
              content: `<p>Assessment is often where re-traumatization first occurs. Traditional intake processes can require premature detailed disclosure, feel like interrogation, and trigger trauma responses. Here's how to assess trauma history while minimizing harm:</p>
              <p><strong>Trauma-Informed Assessment Principles:</strong></p>
              <ul>
                <li><strong>Explain why you're asking:</strong> "I'm asking about difficult experiences because it helps me understand how to best support you"</li>
                <li><strong>Explain how information will be used:</strong> "This information is confidential and helps me tailor treatment to your needs"</li>
                <li><strong>Offer choice:</strong> "You can share as much or as little as you'd like. You don't have to tell me everything today."</li>
                <li><strong>Don't require detailed trauma narratives initially:</strong> You need to know trauma exists, not all the details</li>
                <li><strong>Watch for signs of overwhelm:</strong> If the client is becoming activated, pause and offer grounding</li>
                <li><strong>Normalize responses:</strong> "Many people find this difficult to talk about, and that's completely understandable"</li>
                <li><strong>Respect "no":</strong> If someone doesn't want to discuss something, honor that boundary</li>
              </ul>
              <p><strong>Sample Language for Trauma Screening:</strong></p>
              <p>"I'd like to understand more about what brings you here. Many people who seek counseling have experienced difficult or painful events in their past. You don't need to share any details you're not comfortable with—we can go at whatever pace feels right for you."</p>
              <p>"Sometimes our past experiences affect how we feel and function today. Have you had experiences that were frightening, overwhelming, or that still bother you? You don't need to describe them—just knowing they're there helps me understand."</p>
              <p><strong>Validated Screening Tools:</strong></p>
              <ul>
                <li><strong>ACE Questionnaire:</strong> Simple yes/no format, can be self-administered</li>
                <li><strong>PC-PTSD-5:</strong> Brief 5-item screen for PTSD symptoms</li>
                <li><strong>Life Events Checklist (LEC-5):</strong> Comprehensive trauma exposure inventory</li>
                <li><strong>Trauma Symptom Inventory (TSI-2):</strong> More detailed symptom assessment</li>
              </ul>
              <p><strong>Remember:</strong> The goal of initial assessment is to know whether trauma is relevant, not to gather complete details. Detailed trauma processing comes later, after stabilization and rapport are established.</p>`
            },
            {
              title: "When Mistakes Happen: Repair and Recovery",
              content: `<p>Even skilled, trauma-informed clinicians sometimes inadvertently cause harm. What matters is how you recognize and respond to these ruptures. In fact, repair after rupture can actually strengthen the therapeutic relationship—modeling that relationships can survive mistakes.</p>
              <p><strong>Recognizing That a Rupture Has Occurred:</strong></p>
              <ul>
                <li>Client suddenly becomes distant, withdrawn, or shut down</li>
                <li>Client becomes agitated, defensive, or angry</li>
                <li>Client dissociates or "checks out"</li>
                <li>Client changes the subject abruptly</li>
                <li>Client misses the next session or wants to terminate</li>
                <li>You have a gut feeling that something went wrong</li>
              </ul>
              <p><strong>If You Notice a Client Becoming Distressed:</strong></p>
              <ol>
                <li><strong>Pause immediately:</strong> Stop whatever you were doing or saying</li>
                <li><strong>Acknowledge:</strong> "I notice something shifted just now. It seems like this is really hard."</li>
                <li><strong>Offer grounding:</strong> "Let's take a breath together" or "Can you feel your feet on the floor?"</li>
                <li><strong>Check in:</strong> "What do you need right now?"</li>
                <li><strong>Don't push forward:</strong> Follow the client's lead about whether to continue</li>
                <li><strong>Offer to take a break:</strong> "We can pause here if you need to"</li>
              </ol>
              <p><strong>Repairing a Rupture:</strong></p>
              <ul>
                <li><strong>Name what happened honestly:</strong> "I think I pushed too hard there" or "I asked something that felt intrusive"</li>
                <li><strong>Take responsibility:</strong> Acknowledge your role without excessive apologizing—"I'm sorry, that was my mistake"</li>
                <li><strong>Validate their response:</strong> "It makes sense you felt [angry/scared/shut down] when I did that"</li>
                <li><strong>Ask what would help:</strong> "What would help repair this between us?"</li>
                <li><strong>Adjust your approach:</strong> "I'll do that differently going forward"</li>
                <li><strong>Follow through:</strong> Actually change your behavior based on what you learned</li>
              </ul>
              <p><strong>Why Repair Matters:</strong> For many trauma survivors, ruptures in relationships led to abandonment or further harm. Demonstrating that a relationship can survive a rupture—that mistakes can be acknowledged and repaired—is profoundly healing. It contradicts the expectation that conflict means the end of safety.</p>`
            },
            {
              title: "The Importance of Clinician Self-Care: Protecting the Caregiver",
              content: `<p>A dysregulated clinician cannot provide regulated, safe care. Vicarious trauma (also called secondary traumatic stress) is real, common, and can end careers. Self-care is not optional or selfish—it's professionally and ethically necessary.</p>
              <p><strong>Signs of Vicarious Trauma (Pay Attention!):</strong></p>
              <ul>
                <li>Intrusive thoughts about clients' trauma—images, stories replaying in your mind</li>
                <li>Nightmares or disturbed sleep after hearing trauma material</li>
                <li>Increased cynicism, hopelessness, or loss of faith in humanity</li>
                <li>Emotional numbing—feeling less than you used to, difficulty connecting</li>
                <li>Over-identification with clients—blurred boundaries, taking on their emotions</li>
                <li>Hypervigilance in your own life—increased startle response, scanning for danger</li>
                <li>Boundary difficulties—overworking, difficulty saying no, rescuing clients</li>
                <li>Physical symptoms—headaches, GI problems, chronic fatigue, frequent illness</li>
                <li>Increased substance use or other numbing behaviors</li>
                <li>Avoidance of trauma material—dreading certain clients, avoiding topics</li>
                <li>Changes in worldview—seeing danger everywhere, loss of trust in others</li>
              </ul>
              <p><strong>Prevention Strategies:</strong></p>
              <ul>
                <li><strong>Regular clinical supervision:</strong> Essential for processing difficult cases and getting support—not just administrative oversight</li>
                <li><strong>Balanced caseload:</strong> Limit the proportion of trauma-intensive clients; diversify your practice</li>
                <li><strong>Personal therapy:</strong> Work through your own trauma history and current stress—you can't take clients where you haven't gone</li>
                <li><strong>Physical self-care:</strong> Sleep, exercise, nutrition—the basics matter enormously</li>
                <li><strong>Connection outside of work:</strong> Maintain relationships and activities that have nothing to do with trauma</li>
                <li><strong>Boundaries with work:</strong> Limit after-hours contact, take real vacations, leave work at work</li>
                <li><strong>Ongoing professional development:</strong> Learning helps maintain engagement and effectiveness</li>
                <li><strong>Meaning-making:</strong> Stay connected to why this work matters</li>
              </ul>
              <p><strong>Remember:</strong> You cannot pour from an empty cup. Taking care of yourself is taking care of your clients.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600",
          imageAlt: "Supportive therapeutic interaction",
          imagePosition: "left",
          title: "Universal Precautions: Assume Trauma May Be Present",
          content: `<p>Because trauma is so prevalent (affecting 70%+ of adults), adopt <strong>"universal precautions"</strong>—treat everyone as if they may have a trauma history, even if not disclosed. This approach:</p>
          <ul>
            <li>Ensures trauma-sensitive care for ALL clients, not just those who disclose</li>
            <li>Reduces the risk of inadvertent re-traumatization</li>
            <li>Creates environments where disclosure feels safer (if the client chooses)</li>
            <li>Applies good clinical practices universally</li>
          </ul>
          <p><strong>Key Universal Precaution Practices:</strong></p>
          <ul>
            <li><strong>Always ask permission</strong> before physical touch, invasive questions, or potentially triggering interventions</li>
            <li><strong>Explain what you're doing and why</strong>—no surprises or hidden agendas</li>
            <li><strong>Offer choices</strong> whenever possible—where to sit, what to discuss, how to proceed</li>
            <li><strong>Watch for signs of distress</strong> and respond promptly with grounding and support</li>
            <li><strong>Create safety by default</strong>, not just when trauma is known or suspected</li>
          </ul>
          <p><strong>Remember:</strong> Many survivors never disclose—not because they weren't affected, but because of shame, fear, or lack of opportunity. Universal precautions protect everyone.</p>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Which of the following is an example of a clinical practice that could re-traumatize a client?",
          options: [
            { text: "Offering choices about session activities", isCorrect: false },
            { text: "Pressuring a client to share trauma details before they're ready", isCorrect: true },
            { text: "Explaining the rationale for interventions", isCorrect: false },
            { text: "Checking in about the client's comfort level", isCorrect: false }
          ],
          explanation: "Forcing trauma disclosure before a client is ready can replicate the loss of control and violation of boundaries that occurred during the original trauma."
        },
        {
          type: "reflection",
          order: 6,
          title: "Clinical Reflection: Avoiding Re-traumatization",
          prompt: "Think about your current clinical practices. Are there any that might inadvertently re-traumatize clients—even standard practices like requiring detailed intake histories? How might you modify your approach to be more sensitive to the potential for re-traumatization?",
          placeholder: "Reflect on how you can modify practices to prevent re-traumatization...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "'Universal precautions' in trauma-informed care means:",
          type: "multipleChoice",
          options: [
            { text: "Only treating clients with confirmed PTSD diagnoses", isCorrect: false },
            { text: "Assuming every client may have trauma history, even if not disclosed", isCorrect: true },
            { text: "Using the same treatment protocol for all clients", isCorrect: false },
            { text: "Avoiding any discussion of trauma", isCorrect: false }
          ],
          explanation: "Universal precautions means treating everyone in a trauma-informed way by default, since trauma is so prevalent and often undisclosed."
        },
        {
          question: "Signs of vicarious trauma in clinicians include all EXCEPT:",
          type: "multipleChoice",
          options: [
            { text: "Intrusive thoughts about clients' trauma", isCorrect: false },
            { text: "Increased sense of meaning and purpose", isCorrect: true },
            { text: "Emotional numbing", isCorrect: false },
            { text: "Sleep problems", isCorrect: false }
          ],
          explanation: "Vicarious trauma signs include intrusive thoughts, numbing, and sleep problems. Increased meaning and purpose would indicate growth, not trauma."
        }
      ]
    },

    // SECTION 5: Trauma-Informed Interventions
    {
      title: "Trauma-Informed Interventions",
      description: "Evidence-based approaches and practical strategies for trauma treatment",
      order: 5,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 5,
          title: "Trauma-Informed Interventions",
          subtitle: "From Principles to Practice"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Stabilization Before Processing: The Phase-Based Approach</h3>
          <p>Effective trauma treatment follows a phase-based approach. Rushing to trauma processing without adequate stabilization is one of the most common mistakes clinicians make—and one of the most harmful. Judith Herman's three-stage model provides the foundational framework:</p>
          <ol>
            <li><strong>Stage 1: Safety and Stabilization</strong> — Establishing physical and emotional safety, building coping skills and distress tolerance, regulating the nervous system, strengthening the therapeutic alliance, addressing immediate crises, and developing resources for managing trauma-related symptoms.</li>
            <li><strong>Stage 2: Remembrance and Mourning</strong> — Processing traumatic memories using evidence-based approaches, integrating fragmented experiences, grieving losses associated with trauma, challenging trauma-related beliefs, and developing a coherent trauma narrative.</li>
            <li><strong>Stage 3: Reconnection</strong> — Rebuilding life and relationships, developing a future orientation, finding meaning and purpose, engaging more fully with the world, and integrating trauma into one's identity without being defined by it.</li>
          </ol>
          <p><strong>Critical Clinical Point:</strong> Many clinicians—often under pressure from managed care or their own discomfort with "slow" progress—rush to Stage 2 before clients have adequate Stage 1 skills. This frequently leads to:</p>
          <ul>
            <li>Overwhelming flooding rather than therapeutic processing</li>
            <li>Increased symptoms and decompensation</li>
            <li>Dropout from treatment</li>
            <li>Reinforcement of beliefs that they "can't handle" their experiences</li>
            <li>Re-traumatization rather than healing</li>
          </ul>
          <p><strong>Remember:</strong> Stabilization is not "just preparation"—it IS treatment. Many clients achieve significant improvement through Stage 1 work alone and may choose not to pursue explicit trauma processing.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Stabilization Skills: Grounding - Returning to the Present",
              content: `<p><strong>Grounding techniques</strong> help clients return to the present moment when triggered, overwhelmed, or dissociated. They work by engaging the senses and activating the prefrontal cortex, which helps modulate the amygdala's alarm response.</p>
              <p><strong>5-4-3-2-1 Sensory Grounding (Most Widely Used):</strong></p>
              <ul>
                <li><strong>5 things you can see:</strong> Look around and name five specific things</li>
                <li><strong>4 things you can touch/feel:</strong> Notice textures, temperatures, pressure</li>
                <li><strong>3 things you can hear:</strong> Listen for sounds near and far</li>
                <li><strong>2 things you can smell:</strong> Notice any scents in the environment</li>
                <li><strong>1 thing you can taste:</strong> Notice the taste in your mouth</li>
              </ul>
              <p>Why it works: Engages all senses, requires cognitive effort that competes with trauma processing, orients to the present environment.</p>
              <p><strong>Physical Grounding Techniques:</strong></p>
              <ul>
                <li>Feet firmly on floor—press down, notice the pressure and support</li>
                <li>Notice contact with chair—feel your back, legs, arms against the surface</li>
                <li>Hold something cold (ice cube, cold water bottle) or textured (stress ball, rough fabric)</li>
                <li>Splash cold water on face or wrists—activates the dive reflex</li>
                <li>Press palms together firmly—creates sensory input</li>
                <li>Stomp feet or walk around—movement helps discharge activation</li>
                <li>Cross arms and tap alternating shoulders (butterfly hug)</li>
              </ul>
              <p><strong>Cognitive Grounding Techniques:</strong></p>
              <ul>
                <li>State name, date, current location out loud</li>
                <li>Count backwards from 100 by 7s (requires concentration)</li>
                <li>Name categories: 5 colors you can see, 5 types of animals, 5 states</li>
                <li>Describe your environment in detail as if to someone who can't see it</li>
                <li>Mental math or word games</li>
              </ul>
              <p><strong>Teaching Grounding to Clients:</strong></p>
              <ul>
                <li>Practice when calm first—don't wait for crisis to learn skills</li>
                <li>Identify which techniques work best for each individual</li>
                <li>Create a personalized grounding "menu" for quick reference</li>
                <li>Practice regularly to build automatic responses</li>
              </ul>`
            },
            {
              title: "Stabilization Skills: Breathing - Regulating the Nervous System",
              content: `<p><strong>Breathing techniques</strong> directly regulate the autonomic nervous system. The breath is unique in that it's both automatic AND under voluntary control—making it a powerful doorway to nervous system regulation.</p>
              <p><strong>Why Breathing Works:</strong></p>
              <ul>
                <li>Extended exhale activates the parasympathetic nervous system (vagus nerve)</li>
                <li>Slow, deep breathing signals safety to the brain</li>
                <li>Focusing on breath interrupts rumination and worry</li>
                <li>Can be done anywhere, anytime, without anyone noticing</li>
              </ul>
              <p><strong>Extended Exhale (Most Effective for Calming):</strong></p>
              <ul>
                <li>Breathe in for 4 counts</li>
                <li>Breathe out for 6-8 counts (longer exhale is key)</li>
                <li>The longer exhale activates the parasympathetic system</li>
                <li>Repeat 5-10 times</li>
              </ul>
              <p><strong>Box Breathing (Good for Focus):</strong></p>
              <ul>
                <li>Breathe in for 4 counts</li>
                <li>Hold for 4 counts</li>
                <li>Breathe out for 4 counts</li>
                <li>Hold for 4 counts</li>
                <li>Repeat the "box" pattern</li>
              </ul>
              <p><strong>Diaphragmatic Breathing (Belly Breathing):</strong></p>
              <ul>
                <li>Place hand on belly</li>
                <li>Breathe so belly rises (not chest)</li>
                <li>This ensures deeper breaths engaging the diaphragm</li>
                <li>Chest breathing is associated with stress; belly breathing with calm</li>
              </ul>
              <p><strong>Important Cautions:</strong></p>
              <ul>
                <li>Some trauma survivors find breath focus triggering—particularly those with strangulation, suffocation, or drowning experiences</li>
                <li>Focusing on the body can increase dissociation for some clients</li>
                <li>Always offer alternatives if breathing exercises increase distress</li>
                <li>Start with gentle, brief practice and build up gradually</li>
                <li>External focus (count objects while breathing) can help if internal focus is too intense</li>
              </ul>
              <p><strong>Teaching Tip:</strong> Practice breathing exercises WITH the client in session. Model slow, calm breathing. Your regulated breathing can help co-regulate their nervous system.</p>`
            },
            {
              title: "Stabilization Skills: Containment - Managing Overwhelming Material",
              content: `<p><strong>Containment</strong> techniques help clients manage overwhelming traumatic material between sessions. They provide a sense of control over intrusive thoughts, memories, and emotions—which is crucial since trauma often involves loss of control.</p>
              <p><strong>The Container Exercise (Classic Technique):</strong></p>
              <ol>
                <li><strong>Create the container:</strong> Ask the client to imagine a container that can hold anything—any size, any material, with a secure lid or lock. It could be a vault, safe, treasure chest, spaceship, or anything that feels secure to them.</li>
                <li><strong>Use the container:</strong> When distressing material arises (between sessions or at the end of a difficult session), visualize placing the disturbing thoughts, images, or feelings into the container.</li>
                <li><strong>Secure the container:</strong> Close and lock the container. Some clients add additional security features (guards, force fields, etc.).</li>
                <li><strong>Know you can return:</strong> The material isn't gone—it's safely stored. You can open the container when you choose (in therapy, when you have support).</li>
              </ol>
              <p><strong>Variations (Offer Options to Find Best Fit):</strong></p>
              <ul>
                <li><strong>Vault or safe:</strong> Heavy, secure, with combination lock</li>
                <li><strong>Cloud:</strong> Place the material on a cloud and watch it float away</li>
                <li><strong>River:</strong> Put the material on a leaf and watch the river carry it downstream</li>
                <li><strong>Movie theater:</strong> Put the memory on a screen and pause/rewind/fast-forward as needed</li>
                <li><strong>Computer file:</strong> Save and close the file, put it in a password-protected folder</li>
                <li><strong>Drawer or cabinet:</strong> Simple, everyday containment</li>
              </ul>
              <p><strong>Purpose and Benefits:</strong></p>
              <ul>
                <li>Provides sense of control over traumatic material: "I don't have to deal with this right now"</li>
                <li>Reduces flooding between sessions</li>
                <li>Allows clients to engage with daily life without constant intrusion</li>
                <li>Creates boundary between therapy work and regular life</li>
                <li>Builds confidence in ability to manage overwhelming material</li>
              </ul>
              <p><strong>Teaching Tips:</strong></p>
              <ul>
                <li>Practice when calm, not during overwhelming moments</li>
                <li>Help client develop their own personalized container with rich sensory details</li>
                <li>Use at the end of difficult sessions: "Let's put this away before you leave"</li>
                <li>Remind clients between sessions that they have this tool</li>
              </ul>`
            },
            {
              title: "Evidence-Based Trauma Treatments",
              content: `<p><strong>First-Line Treatments for PTSD (Strong Research Support):</strong></p>
              <p><strong>Prolonged Exposure (PE):</strong></p>
              <ul>
                <li>Developed by Edna Foa</li>
                <li>Based on emotional processing theory</li>
                <li>Includes imaginal exposure (revisiting trauma memory in session) and in vivo exposure (confronting avoided situations)</li>
                <li>8-15 sessions typically</li>
                <li>Strong evidence base, particularly for single-incident trauma</li>
              </ul>
              <p><strong>Cognitive Processing Therapy (CPT):</strong></p>
              <ul>
                <li>Developed by Patricia Resick</li>
                <li>Focuses on trauma-related cognitions ("stuck points")</li>
                <li>Uses worksheets to identify and challenge unhelpful beliefs about safety, trust, power, esteem, and intimacy</li>
                <li>12 sessions typically</li>
                <li>Can be done with or without written trauma account</li>
              </ul>
              <p><strong>Eye Movement Desensitization and Reprocessing (EMDR):</strong></p>
              <ul>
                <li>Developed by Francine Shapiro</li>
                <li>Uses bilateral stimulation (eye movements, tapping, or tones) during trauma memory processing</li>
                <li>Based on Adaptive Information Processing model</li>
                <li>8-phase protocol</li>
                <li>Requires specialized training</li>
              </ul>
              <p><strong>Trauma-Focused Cognitive Behavioral Therapy (TF-CBT):</strong></p>
              <ul>
                <li>Developed specifically for children and adolescents</li>
                <li>Includes parallel parent component</li>
                <li>PRACTICE components: Psychoeducation, Relaxation, Affect regulation, Cognitive coping, Trauma narrative, In vivo mastery, Conjoint sessions, Enhancing safety</li>
                <li>12-25 sessions typically</li>
              </ul>
              <p><strong>Other Evidence-Based Approaches:</strong></p>
              <ul>
                <li><strong>Narrative Exposure Therapy (NET):</strong> Particularly effective for multiple/complex trauma and refugees</li>
                <li><strong>Somatic Experiencing (SE):</strong> Body-based approach developed by Peter Levine; focuses on completing incomplete defensive responses</li>
                <li><strong>Sensorimotor Psychotherapy:</strong> Integrates body-based and cognitive approaches</li>
                <li><strong>Internal Family Systems (IFS):</strong> Works with "parts" of the self, including traumatized and protective parts</li>
                <li><strong>Skills Training in Affective and Interpersonal Regulation (STAIR):</strong> Particularly for complex trauma; can be used as precursor to narrative work</li>
              </ul>
              <p><strong>Remember:</strong> No single approach works for everyone. Match treatment to client needs, preferences, cultural background, and readiness. Client choice and collaboration are essential.</p>`
            },
            {
              title: "When to Refer: Knowing Your Limits",
              content: `<p>Effective trauma-informed care includes knowing when a client's needs exceed your expertise, training, or capacity. Referring is not failure—it's ensuring the client gets the best possible care.</p>
              <p><strong>Consider Referral or Consultation When:</strong></p>
              <ul>
                <li><strong>Complex trauma requiring specialized treatment:</strong> Dissociative disorders, severe attachment trauma, ritual abuse—these require specialized training you may not have</li>
                <li><strong>Higher level of care needed:</strong> When outpatient isn't sufficient—intensive outpatient, partial hospitalization, residential treatment, or inpatient may be indicated</li>
                <li><strong>Comorbid conditions requiring expertise:</strong> Severe eating disorders, active substance dependence, bipolar disorder, psychotic symptoms—may need specialized or coordinated care</li>
                <li><strong>Medical issues:</strong> Unexplained physical symptoms, medication needs, neurological concerns</li>
                <li><strong>Lack of progress:</strong> Despite appropriate intervention, client isn't improving—fresh eyes may help</li>
                <li><strong>Your own reactions are interfering:</strong> Countertransference, vicarious trauma, or personal triggers are affecting the work</li>
                <li><strong>Safety concerns you can't manage:</strong> Suicidality or violence risk beyond your competence</li>
                <li><strong>Client needs something outside your scope:</strong> Specific modality like EMDR or neurofeedback you don't provide</li>
              </ul>
              <p><strong>How to Refer Well:</strong></p>
              <ul>
                <li>Frame as getting the client the BEST care, not as rejection or abandonment</li>
                <li>Have specific referral resources ready—don't leave the client to figure it out alone</li>
                <li>Offer to help with the transition (warm handoff, shared session, coordination)</li>
                <li>If possible, maintain the relationship during transition rather than abrupt termination</li>
                <li>Be honest about your reasons in a way that doesn't shame the client</li>
              </ul>
              <p><strong>Sample Language:</strong> "I want to make sure you're getting the best possible care for what you're dealing with. I think you would benefit from working with someone who specializes in [X]. I'd like to help connect you with someone, and I can stay involved during the transition if that would be helpful."</p>
              <p><strong>Remember:</strong> Referring when appropriate is a sign of clinical wisdom and ethical practice—not failure.</p>`
            },
            {
              title: "Psychoeducation: A Key Trauma-Informed Intervention",
              content: `<p>Psychoeducation about trauma is itself a powerful intervention. Helping clients understand what happened to their brain and body normalizes their experience and reduces shame.</p>
              <p><strong>Key Topics for Client Psychoeducation:</strong></p>
              <ul>
                <li><strong>The brain's survival response:</strong> Explain how the amygdala and stress response work, why they can't just "think their way out" of trauma responses</li>
                <li><strong>Window of tolerance:</strong> Help clients recognize their states and early warning signs of dysregulation</li>
                <li><strong>Triggers:</strong> Explain how triggers work neurobiologically—why something "unrelated" can cause intense reactions</li>
                <li><strong>The body keeps the score:</strong> Why trauma affects physical health and why body-based interventions matter</li>
                <li><strong>Neuroplasticity and hope:</strong> The brain can change—recovery is possible</li>
              </ul>
              <p><strong>How to Deliver Psychoeducation:</strong></p>
              <ul>
                <li>Use simple language, not clinical jargon</li>
                <li>Use metaphors and analogies (smoke alarm for amygdala, etc.)</li>
                <li>Offer handouts and resources for review between sessions</li>
                <li>Check understanding—have them explain it back</li>
                <li>Connect to their specific experience</li>
              </ul>
              <p><strong>Sample Script:</strong> "Your brain learned to protect you from danger, and it got really good at it. But now, even when you're safe, that alarm system keeps going off because it was set to be super-sensitive. That's not weakness—that's your brain doing exactly what it was designed to do. The good news is we can recalibrate that alarm system."</p>`
            },
            {
              title: "Co-Regulation: The Clinician's Nervous System as Tool",
              content: `<p>Trauma affects the nervous system, and nervous systems are social—they influence each other. Your regulated presence can help regulate your client.</p>
              <p><strong>How Co-Regulation Works:</strong></p>
              <ul>
                <li>Nervous systems are designed to sync with each other (social baseline theory)</li>
                <li>A calm, regulated person can help an activated person calm down</li>
                <li>This happens largely outside conscious awareness, through facial expressions, voice tone, body posture</li>
                <li>It's how parents soothe infants—and it works for adults too</li>
              </ul>
              <p><strong>Practical Applications:</strong></p>
              <ul>
                <li><strong>Monitor your own state:</strong> You can't co-regulate if you're dysregulated</li>
                <li><strong>Use a calm, low voice:</strong> High pitch signals danger</li>
                <li><strong>Slow your breathing:</strong> Clients may unconsciously match your rhythm</li>
                <li><strong>Relax your body:</strong> Tension in you creates tension in them</li>
                <li><strong>Make eye contact (if culturally appropriate):</strong> Signals social engagement</li>
                <li><strong>Be present:</strong> Your full attention communicates safety</li>
              </ul>
              <p><strong>Key Insight:</strong> Before you can teach self-regulation, you must provide co-regulation. Many trauma survivors never had a safe co-regulating presence—the therapy relationship may be their first experience of this.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
          imageAlt: "Person practicing mindfulness",
          imagePosition: "right",
          title: "Integration: The Goal of Trauma Treatment",
          content: `<p>The goal is not to erase traumatic memories, but to <strong>integrate</strong> them:</p>
          <ul>
            <li>Memories become "past" rather than "present"</li>
            <li>Emotional intensity decreases</li>
            <li>Triggers have less power</li>
            <li>Client can discuss trauma without overwhelm</li>
            <li>Meaning and growth can emerge</li>
          </ul>
          <p><strong>Integration takes time.</strong> Be patient with the process and celebrate incremental progress.</p>`,
          highlight: true
        },
        {
          type: "resources",
          order: 5,
          title: "Clinical Tools & Handouts",
          description: "Download these resources for use with clients",
          resources: [
            {
              title: "SAMHSA's 6 Principles Quick Reference",
              type: "card",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/samhsa-principles-card.pdf",
              size: "198 KB"
            },
            {
              title: "Trauma Screening Questions Guide",
              type: "checklist",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/trauma-screening-guide.pdf",
              size: "245 KB"
            },
            {
              title: "Creating Safety Checklist",
              type: "checklist",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/safety-checklist.pdf",
              size: "167 KB"
            },
            {
              title: "Client Psychoeducation Handout",
              type: "worksheet",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/tic/client-psychoeducation.pdf",
              size: "278 KB"
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "According to Judith Herman's phase-based model, what must be established before processing traumatic memories?",
          options: [
            { text: "Complete trauma disclosure", isCorrect: false },
            { text: "Safety and stabilization", isCorrect: true },
            { text: "Medication stabilization", isCorrect: false },
            { text: "Family involvement", isCorrect: false }
          ],
          explanation: "Herman's model emphasizes that Stage 1 (Safety and Stabilization) must be established before moving to Stage 2 (Processing). Skipping this can overwhelm clients."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Your Trauma-Informed Care Action Plan",
          prompt: "As you complete this course, identify your top three takeaways that will change your practice. What specific steps will you take in the next week, month, and quarter to implement trauma-informed care more fully? How will you address your own self-care to prevent vicarious trauma?",
          placeholder: "Reflect on your action plan for implementing trauma-informed care...",
          minLength: 150
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "The 5-4-3-2-1 technique is an example of what type of skill?",
          type: "multipleChoice",
          options: [
            { text: "Trauma processing", isCorrect: false },
            { text: "Grounding", isCorrect: true },
            { text: "Exposure", isCorrect: false },
            { text: "Cognitive restructuring", isCorrect: false }
          ],
          explanation: "5-4-3-2-1 is a sensory grounding technique that helps clients return to the present moment when triggered or overwhelmed."
        },
        {
          question: "Which of the following are first-line, evidence-based treatments for PTSD?",
          type: "multiSelect",
          options: [
            { text: "Prolonged Exposure (PE)", isCorrect: true },
            { text: "EMDR", isCorrect: true },
            { text: "Cognitive Processing Therapy (CPT)", isCorrect: true },
            { text: "Dream analysis", isCorrect: false }
          ],
          explanation: "PE, EMDR, and CPT all have strong research support as first-line treatments for PTSD."
        }
      ]
    }
  ],

  // Final Assessment
  assessment: {
    title: "Final Assessment: Trauma-Informed Care",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "SAMHSA's definition of trauma emphasizes the 'Three E's.' What are they?",
        type: "multipleChoice",
        options: [
          { text: "Events, Experience, Effects", isCorrect: true },
          { text: "Exposure, Expression, Elimination", isCorrect: false },
          { text: "Evaluation, Evidence, Efficacy", isCorrect: false },
          { text: "Education, Empowerment, Engagement", isCorrect: false }
        ],
        explanation: "SAMHSA defines trauma through Events (what happened), Experience (how it was perceived), and Effects (lasting impact)."
      },
      {
        question: "Which SAMHSA principle is considered the foundation of trauma-informed care?",
        type: "multipleChoice",
        options: [
          { text: "Peer Support", isCorrect: false },
          { text: "Empowerment", isCorrect: false },
          { text: "Safety", isCorrect: true },
          { text: "Collaboration", isCorrect: false }
        ],
        explanation: "Safety (physical and emotional) is the foundational principle upon which all others rest."
      },
      {
        question: "The ACE Study found that Adverse Childhood Experiences are:",
        type: "multipleChoice",
        options: [
          { text: "Rare and affect only a small population", isCorrect: false },
          { text: "Common, cluster together, and have dose-dependent health effects", isCorrect: true },
          { text: "Only relevant to mental health, not physical health", isCorrect: false },
          { text: "Equally distributed across all populations", isCorrect: false }
        ],
        explanation: "ACEs are common (61% have at least one), tend to cluster, and have a dose-response relationship with health outcomes."
      },
      {
        question: "What does 'universal precautions' mean in trauma-informed care?",
        type: "multipleChoice",
        options: [
          { text: "Using identical treatment for all clients", isCorrect: false },
          { text: "Assuming every client may have trauma history", isCorrect: true },
          { text: "Avoiding all discussion of trauma", isCorrect: false },
          { text: "Requiring trauma disclosure from all clients", isCorrect: false }
        ],
        explanation: "Universal precautions means treating everyone in a trauma-informed way by default, since trauma is prevalent and often undisclosed."
      },
      {
        question: "According to Judith Herman, what are the three stages of trauma recovery?",
        type: "multipleChoice",
        options: [
          { text: "Assessment, Treatment, Discharge", isCorrect: false },
          { text: "Safety/Stabilization, Remembrance/Mourning, Reconnection", isCorrect: true },
          { text: "Denial, Anger, Acceptance", isCorrect: false },
          { text: "Exposure, Processing, Integration", isCorrect: false }
        ],
        explanation: "Herman's model: Stage 1 (Safety and Stabilization), Stage 2 (Remembrance and Mourning), Stage 3 (Reconnection)."
      },
      {
        question: "Which of the following could potentially re-traumatize a client?",
        type: "multipleChoice",
        options: [
          { text: "Offering choices about session activities", isCorrect: false },
          { text: "Pressuring detailed trauma disclosure before the client is ready", isCorrect: true },
          { text: "Explaining the rationale for interventions", isCorrect: false },
          { text: "Maintaining consistent session times", isCorrect: false }
        ],
        explanation: "Forcing disclosure replicates the loss of control and boundary violation of the original trauma."
      },
      {
        question: "The principle of Empowerment, Voice, and Choice in TIC focuses on:",
        type: "multipleChoice",
        options: [
          { text: "The clinician making decisions for the client", isCorrect: false },
          { text: "Restoring agency and self-determination", isCorrect: true },
          { text: "Physical environment safety", isCorrect: false },
          { text: "Peer support connections", isCorrect: false }
        ],
        explanation: "Empowerment is about restoring the agency and choice that trauma takes away."
      },
      {
        question: "What is the purpose of 'grounding' techniques in trauma treatment?",
        type: "multipleChoice",
        options: [
          { text: "To process traumatic memories", isCorrect: false },
          { text: "To return the client to the present moment when triggered", isCorrect: true },
          { text: "To induce a dissociative state", isCorrect: false },
          { text: "To assess trauma history", isCorrect: false }
        ],
        explanation: "Grounding helps clients return to the present moment when overwhelmed, triggered, or dissociating."
      },
      {
        question: "Which principle addresses the impact of culture, history, and systemic factors on trauma?",
        type: "multipleChoice",
        options: [
          { text: "Safety", isCorrect: false },
          { text: "Collaboration", isCorrect: false },
          { text: "Trustworthiness", isCorrect: false },
          { text: "Cultural, Historical, and Gender Issues", isCorrect: true }
        ],
        explanation: "This principle recognizes that trauma occurs in cultural context and that historical/systemic trauma affects communities."
      },
      {
        question: "Signs of vicarious trauma in clinicians include:",
        type: "multiSelect",
        options: [
          { text: "Intrusive thoughts about clients' trauma", isCorrect: true },
          { text: "Increased cynicism or hopelessness", isCorrect: true },
          { text: "Improved work-life boundaries", isCorrect: false },
          { text: "Emotional numbing", isCorrect: true },
          { text: "Enhanced sense of meaning", isCorrect: false }
        ],
        explanation: "Vicarious trauma symptoms include intrusive thoughts, cynicism, and numbing. Improved boundaries and meaning would indicate wellness, not trauma."
      }
    ]
  }
};

// Update function
const updateCourse = async () => {
  await connectDB();
  
  try {
    traumaInformedCareCourse.totalEstimatedTime = traumaInformedCareCourse.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
    traumaInformedCareCourse.totalContentBlocks = traumaInformedCareCourse.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
    traumaInformedCareCourse.totalQuizQuestions = traumaInformedCareCourse.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) 
      + (traumaInformedCareCourse.assessment?.questions?.length || 0);
    
    await mongoose.connection.db.collection('interactivecourses').findOneAndUpdate(
      { slug: traumaInformedCareCourse.slug },
      { $set: traumaInformedCareCourse },
      { upsert: true }
    );
    
    await mongoose.connection.db.collection('courses').findOneAndUpdate(
      { slug: traumaInformedCareCourse.slug },
      { $set: traumaInformedCareCourse },
      { upsert: true }
    );
    
    console.log('\n✅ Trauma-Informed Care course updated!');
    console.log(`   Title: ${traumaInformedCareCourse.title}`);
    console.log(`   Sections: ${traumaInformedCareCourse.sections.length}`);
    console.log(`   Content Blocks: ${traumaInformedCareCourse.totalContentBlocks}`);
    console.log(`   Assessment Questions: ${traumaInformedCareCourse.assessment.questions.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await mongoose.disconnect();
};

updateCourse();
