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
  description: "This comprehensive 4-hour course provides mental health professionals with foundational knowledge and practical skills to implement trauma-informed care. Based on SAMHSA's six key principles, learn to recognize trauma's impact, create safe therapeutic environments, avoid re-traumatization, and apply evidence-based interventions that promote healing and recovery.",
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
          <p>Trauma results from exposure to an event or series of events that are emotionally disturbing or life-threatening. However, <strong>trauma is defined by the individual's experience</strong>, not just the event itself. Two people can experience the same event with vastly different outcomes based on their perception, support systems, and prior experiences.</p>
          <p>SAMHSA's definition emphasizes the <strong>Three E's</strong>:</p>
          <ul>
            <li><strong>Events:</strong> The actual occurrence(s) — what happened</li>
            <li><strong>Experience:</strong> How the individual perceives and processes the event — subjective meaning</li>
            <li><strong>Effects:</strong> The lasting adverse impacts on functioning — how it changes the person</li>
          </ul>
          <p>This definition is crucial because it centers the survivor's experience rather than external judgments about whether an event "should" be traumatic.</p>`
        },
        {
          type: "imageText",
          order: 3,
          image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600",
          imageAlt: "Diverse group in supportive setting",
          imagePosition: "right",
          title: "The Prevalence of Trauma",
          content: `<p>Trauma exposure is far more common than many clinicians realize:</p>
          <ul>
            <li><strong>70% of adults</strong> worldwide have experienced at least one traumatic event</li>
            <li><strong>1 in 4 children</strong> experience abuse or neglect</li>
            <li><strong>90% of public mental health clients</strong> have trauma histories</li>
            <li><strong>61% of adults</strong> report at least one Adverse Childhood Experience (ACE)</li>
          </ul>
          <p>These statistics underscore why <em>every</em> clinical interaction should be trauma-informed — we must assume trauma may be present even when not disclosed.</p>`,
          highlight: true
        },
        {
          type: "accordion",
          order: 4,
          accordionItems: [
            {
              title: "Types of Trauma",
              content: `<p><strong>Acute Trauma:</strong> Single incident (accident, assault, natural disaster)</p>
              <p><strong>Chronic Trauma:</strong> Repeated, prolonged exposure (ongoing abuse, domestic violence, war)</p>
              <p><strong>Complex Trauma:</strong> Multiple traumatic events, often interpersonal and beginning in childhood</p>
              <p><strong>Developmental Trauma:</strong> Trauma occurring during critical developmental periods, affecting brain development</p>
              <p><strong>Historical/Intergenerational Trauma:</strong> Trauma passed through generations (colonization, slavery, genocide)</p>
              <p><strong>Vicarious Trauma:</strong> Trauma experienced by helpers exposed to others' trauma (clinicians, first responders)</p>`
            },
            {
              title: "Adverse Childhood Experiences (ACEs)",
              content: `<p>The landmark ACE Study identified 10 categories of childhood adversity:</p>
              <p><strong>Abuse:</strong> Physical, emotional, sexual</p>
              <p><strong>Neglect:</strong> Physical, emotional</p>
              <p><strong>Household Dysfunction:</strong> Mental illness, substance abuse, incarceration, domestic violence, divorce</p>
              <p><strong>Key Findings:</strong></p>
              <ul>
                <li>ACEs are common — 61% have at least one</li>
                <li>ACEs cluster — if you have one, you likely have more</li>
                <li>ACEs are dose-dependent — more ACEs = greater health risks</li>
                <li>4+ ACEs dramatically increase risk for chronic disease, mental illness, and early death</li>
              </ul>`
            },
            {
              title: "How Trauma Affects the Brain and Body",
              content: `<p>Trauma fundamentally changes the brain and nervous system:</p>
              <p><strong>Brain Changes:</strong></p>
              <ul>
                <li>Hyperactive amygdala (threat detection always on)</li>
                <li>Suppressed prefrontal cortex (difficulty with reasoning, regulation)</li>
                <li>Impaired hippocampus (memory problems, flashbacks)</li>
              </ul>
              <p><strong>Nervous System Dysregulation:</strong></p>
              <ul>
                <li>Chronic activation of stress response (HPA axis)</li>
                <li>Difficulty returning to baseline after stress</li>
                <li>Hypervigilance or shutdown/dissociation</li>
              </ul>
              <p><strong>Physical Health Impacts:</strong></p>
              <ul>
                <li>Increased inflammation and chronic disease</li>
                <li>Compromised immune function</li>
                <li>Higher rates of heart disease, diabetes, autoimmune disorders</li>
              </ul>`
            },
            {
              title: "Trauma Responses Are Adaptations, Not Pathology",
              content: `<p>A trauma-informed perspective reframes symptoms as <strong>survival adaptations</strong>:</p>
              <p><strong>Hypervigilance</strong> = The brain learned to scan for danger to stay safe</p>
              <p><strong>Avoidance</strong> = Protection from overwhelming emotions or triggers</p>
              <p><strong>Dissociation</strong> = The mind's way of escaping unbearable experiences</p>
              <p><strong>Difficulty trusting</strong> = Learned response when trust was violated</p>
              <p><strong>Emotional dysregulation</strong> = Nervous system overwhelm, not character flaw</p>
              <p>This reframe reduces shame and helps clients understand their responses make sense given what they experienced.</p>`
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
          <p>In 2014, SAMHSA (Substance Abuse and Mental Health Services Administration) published six key principles that guide trauma-informed approaches. These principles apply across settings — clinical practice, schools, healthcare, criminal justice, and organizations.</p>
          <p>These principles are not techniques or interventions, but rather a <strong>lens through which all interactions and decisions are filtered</strong>. They represent a fundamental shift in how we think about and respond to people who have experienced trauma.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "1. SAFETY",
              content: `<p><strong>The foundational principle upon which all others rest.</strong></p>
              <p>Safety encompasses both physical and emotional/psychological security. Trauma survivors often have compromised ability to detect safety vs. danger, so we must be intentional about creating safety.</p>
              <p><strong>Physical Safety includes:</strong></p>
              <ul>
                <li>Safe, welcoming physical environment</li>
                <li>Clear exits, good lighting, comfortable seating</li>
                <li>Privacy protections</li>
                <li>Predictable routines and schedules</li>
              </ul>
              <p><strong>Emotional Safety includes:</strong></p>
              <ul>
                <li>Consistent, reliable relationships</li>
                <li>Clear boundaries and expectations</li>
                <li>Validating and non-judgmental responses</li>
                <li>Freedom from shaming, blaming, or coercion</li>
              </ul>
              <p><strong>Clinical Application:</strong> Begin each session by checking in about safety. Use language like "I want to make sure you feel safe here. Is there anything I can do to help with that?"</p>`
            },
            {
              title: "2. TRUSTWORTHINESS AND TRANSPARENCY",
              content: `<p><strong>Building and maintaining trust through honest, consistent communication.</strong></p>
              <p>Trauma often involves betrayal of trust. Rebuilding trust requires intentional effort and consistency over time.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li>Be clear about what you can and cannot offer</li>
                <li>Explain processes, policies, and decisions openly</li>
                <li>Follow through on commitments</li>
                <li>Acknowledge mistakes and repair ruptures</li>
                <li>Maintain appropriate boundaries consistently</li>
              </ul>
              <p><strong>Clinical Application:</strong> Explain informed consent thoroughly. Be transparent about session structure, confidentiality limits, and what to expect. If you need to cancel, reschedule, or change something, communicate proactively and honestly.</p>`
            },
            {
              title: "3. PEER SUPPORT",
              content: `<p><strong>The healing power of shared experience.</strong></p>
              <p>Connection with others who have "been there" provides unique validation and hope. Peer support demonstrates that recovery is possible.</p>
              <p><strong>Benefits of Peer Support:</strong></p>
              <ul>
                <li>Reduces isolation and shame</li>
                <li>Provides hope through lived example</li>
                <li>Offers practical wisdom from experience</li>
                <li>Creates community and belonging</li>
              </ul>
              <p><strong>Clinical Application:</strong> Consider referring to support groups, peer specialists, or recovery communities. Validate the importance of connection while respecting client choice about disclosure.</p>`
            },
            {
              title: "4. COLLABORATION AND MUTUALITY",
              content: `<p><strong>Leveling power differences and partnering in the healing process.</strong></p>
              <p>Trauma often involves power imbalances and loss of control. The therapeutic relationship should model healthy power-sharing.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li>Position yourself as partner, not expert</li>
                <li>Value client expertise about their own life</li>
                <li>Involve clients in treatment planning</li>
                <li>Share decision-making genuinely</li>
                <li>Acknowledge the power inherent in your role</li>
              </ul>
              <p><strong>Clinical Application:</strong> Ask "What would be most helpful for you today?" rather than imposing an agenda. When recommending interventions, explain options and invite the client to choose.</p>`
            },
            {
              title: "5. EMPOWERMENT, VOICE, AND CHOICE",
              content: `<p><strong>Restoring agency and self-determination.</strong></p>
              <p>Trauma takes away choice and control. Treatment should restore both by recognizing strengths and supporting autonomy.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li>Recognize and build on client strengths</li>
                <li>Offer choices whenever possible</li>
                <li>Support self-advocacy skills</li>
                <li>Celebrate small victories and progress</li>
                <li>Avoid doing for clients what they can do themselves</li>
              </ul>
              <p><strong>Clinical Application:</strong> Instead of "We need to work on your anxiety," try "What feels most important for you to focus on?" Offer choices: "Would you prefer to start with grounding or check in about the week?"</p>`
            },
            {
              title: "6. CULTURAL, HISTORICAL, AND GENDER ISSUES",
              content: `<p><strong>Recognizing the role of culture and historical context in trauma.</strong></p>
              <p>Trauma does not occur in a vacuum. Culture shapes how trauma is experienced, expressed, and healed. Historical trauma affects entire communities across generations.</p>
              <p><strong>Key Practices:</strong></p>
              <ul>
                <li>Recognize your own cultural biases and assumptions</li>
                <li>Understand how culture affects trauma expression</li>
                <li>Acknowledge historical and ongoing systemic trauma</li>
                <li>Adapt approaches to be culturally responsive</li>
                <li>Avoid pathologizing cultural differences</li>
              </ul>
              <p><strong>Clinical Application:</strong> Ask about cultural background and how it influences the client's understanding of their experiences. Be aware of how historical trauma (racism, colonization, displacement) may compound individual trauma.</p>`
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
          <p>Judith Herman's seminal work identified <strong>safety as the first stage of trauma recovery</strong>. Without establishing safety, deeper trauma processing can be harmful and re-traumatizing.</p>
          <p>For trauma survivors, the nervous system is often stuck in survival mode — constantly scanning for threat. Creating safety helps the nervous system downregulate, enabling access to the "thinking brain" necessary for therapeutic work.</p>
          <p>Safety is not just about the absence of threat; it's about the <strong>active presence of signals that communicate "you are safe here."</strong></p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Physical Environment Safety",
              content: `<p><strong>Office/Space Considerations:</strong></p>
              <ul>
                <li>Clear sightlines to exits — don't block doors</li>
                <li>Adequate lighting (not harsh, not too dim)</li>
                <li>Comfortable seating with options (distance from clinician, where to sit)</li>
                <li>Minimal clutter and visual chaos</li>
                <li>Temperature control and comfort</li>
                <li>Privacy — soundproofing, no interruptions</li>
                <li>Consider sensory elements (calming colors, plants, minimal strong scents)</li>
              </ul>
              <p><strong>Waiting Area:</strong></p>
              <ul>
                <li>Comfortable and welcoming</li>
                <li>Clear signage and expectations</li>
                <li>Staff interactions are warm and respectful</li>
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
              title: "Predictability and Structure",
              content: `<p>Trauma often involves chaos and unpredictability. Structure provides containment:</p>
              <ul>
                <li>Consistent session times and length</li>
                <li>Clear session structure (beginning, middle, end)</li>
                <li>Transparent about what to expect</li>
                <li>Advance notice of changes (vacations, schedule changes)</li>
                <li>Reliable follow-through on commitments</li>
              </ul>
              <p><strong>Sample Session Structure:</strong></p>
              <ol>
                <li>Check-in and grounding</li>
                <li>Review/connect to previous session</li>
                <li>Main work of session</li>
                <li>Processing/integration time</li>
                <li>Grounding and closure</li>
              </ol>`
            },
            {
              title: "Collaborative Safety Planning",
              content: `<p>Involve clients in creating their own safety:</p>
              <ul>
                <li>"What helps you feel safe?"</li>
                <li>"Is there anything about this space that feels uncomfortable?"</li>
                <li>"What would you like me to do if you become overwhelmed?"</li>
                <li>"What's your signal if you need to pause?"</li>
              </ul>
              <p><strong>Create Safety Plans Together:</strong></p>
              <ul>
                <li>Identify early warning signs of distress</li>
                <li>List coping strategies that work</li>
                <li>Identify support people to contact</li>
                <li>Plan for crisis situations</li>
              </ul>`
            },
            {
              title: "Managing Therapeutic Pace",
              content: `<p><strong>"Window of Tolerance" Awareness:</strong></p>
              <p>Keep work within the client's capacity. Signs of leaving the window:</p>
              <ul>
                <li><strong>Hyperarousal:</strong> Agitation, rapid speech, anxiety, anger</li>
                <li><strong>Hypoarousal:</strong> Shutdown, dissociation, flat affect, disconnection</li>
              </ul>
              <p><strong>Pacing Strategies:</strong></p>
              <ul>
                <li>Titration — small doses of difficult material</li>
                <li>Pendulation — moving between distress and resource</li>
                <li>Grounding before, during, and after difficult content</li>
                <li>"Slow is fast" — rushing increases risk of overwhelm</li>
              </ul>
              <p><strong>Key Principle:</strong> "If in doubt, ground it out."</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600",
          imageAlt: "Calming therapy office environment",
          imagePosition: "right",
          title: "The Language of Safety",
          content: `<p>Words matter. Trauma-informed language:</p>
          <p><strong>Instead of:</strong> "Why did you..." → <strong>Try:</strong> "Help me understand what happened..."</p>
          <p><strong>Instead of:</strong> "You need to..." → <strong>Try:</strong> "What would feel helpful?"</p>
          <p><strong>Instead of:</strong> "Calm down" → <strong>Try:</strong> "I'm here with you. Let's breathe together."</p>
          <p><strong>Instead of:</strong> "That shouldn't bother you" → <strong>Try:</strong> "It makes sense this is hard."</p>`,
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
          <p>Re-traumatization occurs when a person who has experienced trauma is exposed to situations that replicate the dynamics, power imbalances, or feelings of the original trauma. It can be triggered by:</p>
          <ul>
            <li>Direct actions (coercion, violation of boundaries)</li>
            <li>Environmental factors (institutional settings that feel unsafe)</li>
            <li>Relational dynamics (power imbalances, betrayal of trust)</li>
            <li>Clinical practices (forced disclosure, overwhelming processing)</li>
          </ul>
          <p><strong>The goal of trauma-informed care is not just to treat trauma but to avoid causing additional harm.</strong></p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Common Clinical Pitfalls",
              content: `<p><strong>Practices that can re-traumatize:</strong></p>
              <ul>
                <li><strong>Forcing trauma disclosure:</strong> Pressuring clients to share before they're ready</li>
                <li><strong>Overwhelm:</strong> Processing too much too fast without adequate stabilization</li>
                <li><strong>Rigid rules:</strong> Inflexible policies that don't account for trauma needs</li>
                <li><strong>Power imbalances:</strong> Authoritarian stance, making decisions without client input</li>
                <li><strong>Boundary violations:</strong> Inappropriate self-disclosure, dual relationships</li>
                <li><strong>Dismissing/minimizing:</strong> "That wasn't that bad" or "You should be over it by now"</li>
                <li><strong>Blaming:</strong> Questions like "Why didn't you leave?" or "What were you wearing?"</li>
              </ul>`
            },
            {
              title: "Institutional Re-traumatization",
              content: `<p>Systems and institutions can replicate trauma dynamics:</p>
              <ul>
                <li><strong>Loss of control:</strong> Rigid schedules, no choice in treatment</li>
                <li><strong>Loss of privacy:</strong> Forced disclosure, lack of confidentiality</li>
                <li><strong>Power imbalances:</strong> Hierarchical systems, punitive responses</li>
                <li><strong>Unpredictability:</strong> Inconsistent staff, sudden changes</li>
                <li><strong>Isolation:</strong> Separation from support systems</li>
                <li><strong>Physical restraint:</strong> Can replicate abuse dynamics</li>
              </ul>
              <p><strong>Advocacy Role:</strong> Trauma-informed clinicians advocate for system change, not just individual treatment.</p>`
            },
            {
              title: "Assessment Without Re-traumatization",
              content: `<p><strong>Trauma-Informed Assessment Principles:</strong></p>
              <ul>
                <li>Explain why you're asking and how information will be used</li>
                <li>Offer choice: "You can share as much or as little as you'd like"</li>
                <li>Don't require detailed trauma narratives initially</li>
                <li>Watch for signs of overwhelm and pause if needed</li>
                <li>Normalize responses: "Many people find this difficult to talk about"</li>
              </ul>
              <p><strong>Sample Language:</strong></p>
              <p>"I'd like to understand more about what brings you here. You don't need to share any details you're not comfortable with — we can go at whatever pace feels right for you."</p>`
            },
            {
              title: "When Mistakes Happen",
              content: `<p>Even skilled clinicians sometimes inadvertently cause harm. What matters is how you respond:</p>
              <p><strong>If you notice a client becoming distressed:</strong></p>
              <ol>
                <li>Pause immediately</li>
                <li>Acknowledge: "I notice this seems really hard right now"</li>
                <li>Offer grounding: "Let's take a breath together"</li>
                <li>Check in: "What do you need right now?"</li>
                <li>Don't push forward — follow the client's lead</li>
              </ol>
              <p><strong>After a rupture:</strong></p>
              <ul>
                <li>Name what happened honestly</li>
                <li>Take responsibility (without excessive apologizing)</li>
                <li>Ask what would help repair the relationship</li>
                <li>Adjust your approach going forward</li>
              </ul>`
            },
            {
              title: "The Importance of Clinician Self-Care",
              content: `<p>A dysregulated clinician cannot provide regulated, safe care. Vicarious trauma is real.</p>
              <p><strong>Signs of Vicarious Trauma:</strong></p>
              <ul>
                <li>Intrusive thoughts about clients' trauma</li>
                <li>Increased cynicism or hopelessness</li>
                <li>Emotional numbing or over-identification</li>
                <li>Boundary difficulties</li>
                <li>Physical symptoms, sleep problems</li>
              </ul>
              <p><strong>Prevention Strategies:</strong></p>
              <ul>
                <li>Regular clinical supervision</li>
                <li>Balanced caseload</li>
                <li>Personal therapy as needed</li>
                <li>Physical self-care (sleep, exercise, nutrition)</li>
                <li>Connection outside of work</li>
                <li>Ongoing professional development</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600",
          imageAlt: "Supportive therapeutic interaction",
          imagePosition: "left",
          title: "Universal Precautions",
          content: `<p>Because trauma is so prevalent, adopt <strong>"universal precautions"</strong> — assume every client may have trauma history, even if not disclosed:</p>
          <ul>
            <li>Always ask permission before touching or interventions</li>
            <li>Explain what you're doing and why</li>
            <li>Offer choices whenever possible</li>
            <li>Watch for signs of distress and respond</li>
            <li>Create safety by default, not just when trauma is known</li>
          </ul>`,
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
          textContent: `<h3>Stabilization Before Processing</h3>
          <p>Trauma treatment follows a phase-based approach. Judith Herman identified three stages:</p>
          <ol>
            <li><strong>Stage 1: Safety and Stabilization</strong> — Establishing safety, building coping skills, regulating the nervous system</li>
            <li><strong>Stage 2: Remembrance and Mourning</strong> — Processing traumatic memories, grief work</li>
            <li><strong>Stage 3: Reconnection</strong> — Rebuilding life, relationships, and meaning</li>
          </ol>
          <p><strong>Critical Point:</strong> Many clinicians rush to Stage 2 before adequate Stage 1 work. This can overwhelm clients and cause setbacks. Stabilization is not "just preparation" — it is treatment.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Stabilization Skills: Grounding",
              content: `<p><strong>Grounding techniques</strong> help clients return to the present moment when triggered or overwhelmed:</p>
              <p><strong>5-4-3-2-1 Sensory Grounding:</strong></p>
              <ul>
                <li>5 things you can see</li>
                <li>4 things you can touch/feel</li>
                <li>3 things you can hear</li>
                <li>2 things you can smell</li>
                <li>1 thing you can taste</li>
              </ul>
              <p><strong>Physical Grounding:</strong></p>
              <ul>
                <li>Feet firmly on floor</li>
                <li>Notice contact with chair</li>
                <li>Hold something cold or textured</li>
                <li>Splash water on face</li>
              </ul>
              <p><strong>Cognitive Grounding:</strong></p>
              <ul>
                <li>State name, date, location</li>
                <li>Count backwards from 100 by 7s</li>
                <li>Name categories (5 colors, 5 animals)</li>
              </ul>`
            },
            {
              title: "Stabilization Skills: Breathing",
              content: `<p><strong>Breathing techniques</strong> directly regulate the nervous system:</p>
              <p><strong>Extended Exhale:</strong> Breathe in for 4 counts, out for 6-8. Longer exhale activates parasympathetic system.</p>
              <p><strong>Box Breathing:</strong> In for 4, hold for 4, out for 4, hold for 4. Repeat.</p>
              <p><strong>Diaphragmatic Breathing:</strong> Hand on belly, breathe so belly rises (not chest).</p>
              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>Some trauma survivors find breath focus triggering</li>
                <li>Always offer alternatives if breathing exercises increase distress</li>
                <li>Start with gentle, brief practice and build up</li>
              </ul>`
            },
            {
              title: "Stabilization Skills: Containment",
              content: `<p><strong>Containment</strong> techniques help manage overwhelming material between sessions:</p>
              <p><strong>Container Exercise:</strong></p>
              <ol>
                <li>Imagine a container that can hold anything — any size, material, with a secure lid</li>
                <li>When distressing material arises, visualize placing it in the container</li>
                <li>Close and lock the container</li>
                <li>Know you can open it when you choose (in therapy, when supported)</li>
              </ol>
              <p><strong>Variations:</strong></p>
              <ul>
                <li>Vault, safe, treasure chest</li>
                <li>Cloud that floats away</li>
                <li>River carrying material downstream</li>
              </ul>
              <p><strong>Purpose:</strong> Provides sense of control over traumatic material. "I don't have to deal with this right now."</p>`
            },
            {
              title: "Evidence-Based Trauma Treatments",
              content: `<p><strong>First-Line Treatments for PTSD (strong research support):</strong></p>
              <ul>
                <li><strong>Prolonged Exposure (PE):</strong> Gradual, repeated exposure to trauma memories and avoided situations</li>
                <li><strong>Cognitive Processing Therapy (CPT):</strong> Addresses trauma-related beliefs ("stuck points")</li>
                <li><strong>EMDR:</strong> Bilateral stimulation during trauma memory processing</li>
                <li><strong>Trauma-Focused CBT:</strong> Especially for children; includes parent component</li>
              </ul>
              <p><strong>Other Approaches with Research Support:</strong></p>
              <ul>
                <li>Narrative Exposure Therapy (NET)</li>
                <li>Somatic Experiencing (SE)</li>
                <li>Sensorimotor Psychotherapy</li>
                <li>Internal Family Systems (IFS)</li>
              </ul>
              <p><strong>Remember:</strong> No single approach works for everyone. Match treatment to client needs, preferences, and readiness.</p>`
            },
            {
              title: "When to Refer",
              content: `<p><strong>Consider referral or consultation when:</strong></p>
              <ul>
                <li>Complex trauma requiring specialized treatment you're not trained in</li>
                <li>Client needs higher level of care (intensive outpatient, residential)</li>
                <li>Comorbid conditions requiring expertise (dissociative disorders, substance use)</li>
                <li>Lack of progress despite appropriate intervention</li>
                <li>Your own reactions are interfering with treatment</li>
              </ul>
              <p><strong>Referring is not failure</strong> — it's ensuring the client gets the best care. Maintain the relationship during transition when possible.</p>`
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
  
  process.exit(0);
};

updateCourse();
