/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// scripts/updateNeurobiologyCourse.js
// Enhanced Neurobiology of Trauma course with more content and images
// Run: node src/scripts/updateNeurobiologyCourse.js
// ================================================================

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

// Enhanced Neurobiology of Trauma Course
const neurobiologyCourse = {
  title: "The Neurobiology of Trauma",
  slug: "neurobiology-of-trauma",
  description: "This comprehensive 4-hour course explores the neurobiological foundations of trauma, examining how traumatic experiences reshape brain structure, alter neural pathways, and affect the stress response system. Clinicians will gain essential knowledge about the HPA axis, memory consolidation, and neuroplasticity—providing the scientific foundation for trauma-informed clinical practice.",
  thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
  ceHours: 4,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Psychologists", "Clinical Social Workers", "Trauma Specialists", "Marriage and Family Therapists"],
  categories: ["Trauma", "Neuroscience", "Clinical Practice"],
  tags: ["neurobiology", "trauma", "brain science", "stress response", "HPA axis", "amygdala", "neuroplasticity", "PTSD"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  
  // ACEP REQUIRED: Learning Objectives (measurable outcomes)
  learningObjectives: [
    "Identify and describe the key brain structures involved in trauma processing, including the amygdala, hippocampus, and prefrontal cortex",
    "Explain the physiological mechanisms of the HPA axis and its role in the stress response",
    "Differentiate between normal memory consolidation and traumatic memory encoding",
    "Apply knowledge of the Window of Tolerance model to assess client arousal states",
    "Describe at least three evidence-based interventions that target specific neurobiological processes",
    "Utilize psychoeducation scripts to explain brain science concepts to clients in accessible language",
    "Recognize signs of autonomic nervous system dysregulation in clinical presentations"
  ],
  
  // ACEP REQUIRED: Instructor Credentials
  instructorCredentials: {
    name: "Kejuiana Johnson, MA, LPC, CPCS, BC-TMH",
    credentials: "Licensed Professional Counselor, Certified Professional Counselor Supervisor, Board Certified in Telemental Health",
    organization: "GA Integrated Therapeutic Perspectives LLC",
    bio: "Kejuiana Johnson is a licensed mental health professional with extensive experience in trauma-informed care and clinical supervision. She is the founder of CounselorReady, an NBCC-approved continuing education provider dedicated to delivering high-quality professional development for mental health clinicians."
  },
  
  // ACEP REQUIRED: Bibliography/References
  bibliography: [
    {
      citation: "Van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking.",
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
      citation: "Levine, P. A. (2010). In an unspoken voice: How the body releases trauma and restores goodness. North Atlantic Books.",
      type: "book"
    },
    {
      citation: "McEwen, B. S. (2007). Physiology and neurobiology of stress and adaptation: Central role of the brain. Physiological Reviews, 87(3), 873-904.",
      type: "journal"
    },
    {
      citation: "Ogden, P., Minton, K., & Pain, C. (2006). Trauma and the body: A sensorimotor approach to psychotherapy. W. W. Norton & Company.",
      type: "book"
    },
    {
      citation: "Dana, D. (2018). The polyvagal theory in therapy: Engaging the rhythm of regulation. W. W. Norton & Company.",
      type: "book"
    }
  ],
  
  // ACEP REQUIRED: Completion Requirements
  completionRequirements: {
    passingScore: 80,
    mustCompleteAllModules: true,
    mustPassAssessment: true,
    mustCompleteEvaluation: true,
    description: "To receive CE credit, participants must: (1) Complete all course modules, (2) Pass the final assessment with a score of 80% or higher, and (3) Complete the course evaluation."
  },
  
  // Accessibility & Platform Settings
  settings: {
    // Progression
    linearProgression: false,
    certificateEnabled: true,
    passingScore: 80,
    
    // Quiz/Test Settings
    allowRetakes: true,
    retakePolicy: 'unlimited',
    maxRetakes: 3,
    scorePolicy: 'highest',
    
    // CE Compliance
    requireEvaluation: true,
    requireAttestation: true,
    
    // Accessibility - Narration / Text-to-Speech
    narrationEnabled: true,
    narrationVoice: 'nova',
    narrationSpeed: 1.0,
    autoPlayNarration: false,
    
    // Accessibility - Translation
    translationEnabled: true,
    supportedLanguages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ko', 'vi'],
    defaultLanguage: 'en',
    
    // Accessibility - Visual
    highContrastSupported: true,
    fontSizeAdjustable: true,
    
    // Accessibility - Screen Reader
    screenReaderOptimized: true,
    altTextRequired: true
  },
  
  // Downloadable bonus resources
  resources: [
    {
      title: "Brain Structures Quick Reference Card",
      type: "card",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/brain-structures-card.pdf",
      filename: "brain-structures-quick-reference.pdf",
      size: "245 KB",
      description: "Printable reference card for key brain structures in trauma"
    },
    {
      title: "Window of Tolerance Worksheet",
      type: "worksheet",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/window-of-tolerance-worksheet.pdf",
      filename: "window-of-tolerance-worksheet.pdf",
      size: "312 KB",
      description: "Client worksheet for tracking regulation states"
    },
    {
      title: "Polyvagal State Assessment Checklist",
      type: "checklist",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/polyvagal-checklist.pdf",
      filename: "polyvagal-state-checklist.pdf",
      size: "198 KB",
      description: "Quick checklist for identifying client nervous system states"
    },
    {
      title: "Grounding Techniques Handout",
      type: "pdf",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/grounding-techniques.pdf",
      filename: "grounding-techniques-handout.pdf",
      size: "425 KB",
      description: "Client handout with 15+ regulation techniques"
    },
    {
      title: "Neurobiology Psychoeducation Script",
      type: "doc",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/psychoeducation-script.pdf",
      filename: "neurobiology-psychoeducation-script.pdf",
      size: "156 KB",
      description: "Word-for-word scripts for explaining brain science to clients"
    },
    {
      title: "Trauma Memory vs Normal Memory Comparison",
      type: "card",
      url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/memory-comparison-card.pdf",
      filename: "trauma-memory-comparison.pdf",
      size: "178 KB",
      description: "Visual comparison chart for client education"
    }
  ],
  
  sections: [
    // =========================================================================
    // SECTION 1: INTRODUCTION TO TRAUMA NEUROBIOLOGY (45 min)
    // =========================================================================
    {
      title: "Introduction to Trauma Neurobiology",
      description: "Understanding how trauma affects the brain and why neuroscience matters in clinical practice",
      order: 1,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Introduction to Trauma Neurobiology",
          subtitle: "The Brain-Body Connection in Trauma"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Why Neurobiology Matters in Trauma Treatment</h3>
          <p>Understanding the neurobiology of trauma is no longer optional for mental health clinicians—it's essential. When we understand what happens in the brain during and after traumatic experiences, we can:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Better explain symptoms to clients in ways that reduce shame and self-blame</li>
            <li>Select interventions that target specific neurobiological processes</li>
            <li>Instill hope for recovery through understanding neuroplasticity</li>
            <li>Recognize when symptoms indicate neurological dysregulation vs. other issues</li>
          </ul>
          <p>Trauma is not just a psychological phenomenon—it fundamentally alters brain structure and function. These neurobiological changes explain many trauma symptoms that might otherwise seem puzzling, irrational, or even manipulative to uninformed observers.</p>`
        },
        {
          type: "imageText",
          order: 3,
          image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600",
          imageAlt: "Brain scan showing neural activity",
          imagePosition: "right",
          title: "The Paradigm Shift",
          content: `<p>For decades, trauma was viewed primarily through a psychological lens—as a problem of thoughts, beliefs, and emotions. While these aspects remain important, neuroscience has revealed that trauma literally changes the brain.</p>
          <p>Dr. Bessel van der Kolk's groundbreaking research demonstrated that trauma is stored not just in our minds, but in our bodies and brains. His famous phrase <em>"the body keeps the score"</em> captures this essential truth.</p>
          <p>This understanding has revolutionized treatment approaches, leading to the development of body-based interventions like EMDR, Somatic Experiencing, and neurofeedback.</p>`,
          highlight: false
        },
        {
          type: "accordion",
          order: 4,
          accordionItems: [
            {
              title: "The Triune Brain Model: Understanding Brain Hierarchy",
              content: `<p>Paul MacLean's triune brain model, while simplified, provides a useful framework for understanding how trauma affects different levels of brain function and why trauma responses often feel so automatic and overwhelming.</p>
              <p><strong>1. Reptilian Brain (Brainstem) - "The Survival Brain":</strong></p>
              <ul>
                <li>The oldest part of our brain, shared with reptiles (300+ million years old)</li>
                <li>Controls basic survival functions: heart rate, breathing, body temperature, sleep-wake cycles</li>
                <li>Houses the freeze response—the most primitive survival mechanism</li>
                <li>Operates entirely outside conscious awareness</li>
                <li>Cannot be reasoned with or overridden by willpower</li>
                <li>When activated, takes precedence over higher brain functions</li>
              </ul>
              <p><strong>2. Mammalian Brain (Limbic System) - "The Emotional Brain":</strong></p>
              <ul>
                <li>Evolved in early mammals (150+ million years old)</li>
                <li>Processes emotions, attachment, and emotional memory</li>
                <li>Houses key trauma structures: amygdala and hippocampus</li>
                <li>Responsible for fight-or-flight response</li>
                <li>Where trauma is primarily encoded and triggered</li>
                <li>Creates emotional significance and salience of experiences</li>
                <li>Operates faster than conscious thought (milliseconds)</li>
              </ul>
              <p><strong>3. Neocortex (Prefrontal Cortex) - "The Thinking Brain":</strong></p>
              <ul>
                <li>The newest part evolutionarily (only 2-3 million years old in current form)</li>
                <li>Handles rational thought, language, planning, and self-awareness</li>
                <li>Can inhibit lower brain reactions—but only when online</li>
                <li>Goes "offline" during extreme stress or trauma</li>
                <li>This is why trauma survivors often can't think clearly during triggers</li>
              </ul>
              <p><strong>Clinical Implication:</strong> During trauma and triggers, the limbic system takes over while the neocortex goes offline. This explains why traumatic memories are often fragmented, non-verbal, and sensory-dominated—they were encoded by the limbic system without the organizing influence of the prefrontal cortex. It also explains why telling someone to "just calm down and think rationally" doesn't work—their thinking brain isn't accessible in that moment.</p>`
            },
            {
              title: "Key Brain Structures in Trauma: A Deeper Look",
              content: `<p>Understanding these key brain structures helps clinicians recognize what's happening neurologically and select appropriate interventions.</p>
              <p><strong>AMYGDALA - The Brain's Smoke Detector:</strong></p>
              <ul>
                <li>Small, almond-shaped structure deep in the temporal lobes (one in each hemisphere)</li>
                <li>Primary function: Detect threats and trigger protective responses</li>
                <li>Processes incoming sensory information BEFORE the prefrontal cortex—speed over accuracy</li>
                <li>In trauma survivors: becomes hyperactive and enlarged, triggering false alarms</li>
                <li>Explains hypervigilance, exaggerated startle, and "overreacting" to minor triggers</li>
                <li>Cannot distinguish between past and present—a trigger feels like the trauma is happening NOW</li>
              </ul>
              <p><strong>HIPPOCAMPUS - The Brain's Filing Cabinet:</strong></p>
              <ul>
                <li>Seahorse-shaped structure adjacent to amygdala</li>
                <li>Primary function: Process and contextualize memories in time and space</li>
                <li>Stamps memories with "when" and "where"—creating the sense that something is in the past</li>
                <li>In trauma survivors: Often reduced in volume due to cortisol exposure</li>
                <li>Impaired hippocampal function explains why trauma memories lack context and feel "timeless"</li>
                <li>Flashbacks occur because memories weren't properly filed—they're triggered as if happening now</li>
              </ul>
              <p><strong>PREFRONTAL CORTEX (PFC) - The Brain's CEO:</strong></p>
              <ul>
                <li>Located behind the forehead—the most recently evolved brain region</li>
                <li>Primary functions: Executive control, planning, decision-making, emotional regulation</li>
                <li>Can inhibit amygdala activation—"putting the brakes on" fear responses</li>
                <li>In trauma survivors: Often shows reduced activity and volume</li>
                <li>Weakened PFC-amygdala connection means less ability to regulate emotions</li>
                <li>Explains impulsivity, poor decision-making, and emotional dysregulation in trauma survivors</li>
              </ul>
              <p><strong>INSULA - The Brain's Body Reader:</strong></p>
              <ul>
                <li>Deep cortical structure involved in interoception (awareness of internal body states)</li>
                <li>Primary function: Process internal body sensations—heartbeat, breathing, gut feelings</li>
                <li>In trauma survivors: May be overactive (hyperawareness of body sensations) or underactive (dissociation, numbness)</li>
                <li>Explains both somatic symptoms (feeling trauma in the body) and disconnection from the body</li>
              </ul>`
            },
            {
              title: "Why Psychoeducation About the Brain Helps Clients",
              content: `<p>Teaching clients about their neurobiology is therapeutic in itself. Here's why:</p>
              <p><strong>Reduces Shame:</strong> When clients understand their symptoms are normal brain responses to abnormal events, they stop blaming themselves. "There's nothing wrong with you—your brain is doing exactly what it was designed to do."</p>
              <p><strong>Externalizes the Problem:</strong> Instead of "I'm broken," clients can think "My amygdala is overactive." This creates distance from symptoms and enables problem-solving.</p>
              <p><strong>Instills Hope:</strong> Understanding neuroplasticity—the brain's ability to change—gives clients hope that healing is possible. "Your brain changed in response to trauma, and it can change again in response to healing."</p>
              <p><strong>Enhances Treatment Engagement:</strong> Clients who understand why they're doing specific interventions are more motivated and engaged in treatment.</p>`
            },
            {
              title: "The Window of Tolerance",
              content: `<p>Dan Siegel's "Window of Tolerance" concept describes the optimal zone of arousal where a person can function effectively:</p>
              <p><strong>Within the Window:</strong> The person can think clearly, feel emotions without being overwhelmed, and respond flexibly to situations.</p>
              <p><strong>Hyperarousal (Above the Window):</strong> Anxiety, panic, hypervigilance, racing thoughts, anger outbursts. The sympathetic nervous system is dominant.</p>
              <p><strong>Hypoarousal (Below the Window):</strong> Numbness, depression, dissociation, shutdown, collapse. The parasympathetic nervous system is dominant (dorsal vagal state).</p>
              <p>Trauma narrows the window of tolerance, making it easier to be pushed into hyperarousal or hypoarousal. Treatment aims to gradually widen this window through building regulation skills and processing traumatic memories.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 5,
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
          imageAlt: "Medical professional explaining brain concepts",
          imagePosition: "left",
          title: "Clinical Application: Explaining the Brain to Clients",
          content: `<p>Use simple metaphors when explaining neurobiology to clients:</p>
          <p><strong>"Smoke Detector" for the Amygdala:</strong> "Your amygdala is like a smoke detector that's been set too sensitive after a kitchen fire. Now it goes off even when you're just making toast."</p>
          <p><strong>"Filing Cabinet" for the Hippocampus:</strong> "Normally, memories get filed away with a date stamp. But traumatic memories don't get filed properly—they stay in the 'to be processed' pile, feeling like they're happening right now."</p>
          <p><strong>"Hand Model of the Brain" (Dan Siegel):</strong> Make a fist with thumb tucked inside. The wrist is the brainstem, thumb is the limbic system, fingers wrapped over are the prefrontal cortex. "Flipping your lid" is when the fingers fly up—the PFC goes offline during stress.</p>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Which brain structure acts as the brain's 'alarm system' and is often hyperactive in trauma survivors?",
          options: [
            { text: "Hippocampus", isCorrect: false },
            { text: "Amygdala", isCorrect: true },
            { text: "Prefrontal Cortex", isCorrect: false },
            { text: "Cerebellum", isCorrect: false }
          ],
          explanation: "The amygdala constantly scans for threats and triggers the fight-flight-freeze response. In trauma survivors, it often becomes hyperactive, leading to heightened startle responses and hypervigilance even in safe situations."
        },
        {
          type: "matching",
          order: 7,
          matchingInstructions: "Match each brain structure with its primary function in trauma processing:",
          matchingPairs: [
            { term: "Amygdala", definition: "Threat detection and fear response activation" },
            { term: "Hippocampus", definition: "Memory processing and contextualizing experiences in time" },
            { term: "Prefrontal Cortex", definition: "Executive function, emotional regulation, rational thought" },
            { term: "Insula", definition: "Processing internal body sensations (interoception)" }
          ]
        },
        {
          type: "reflection",
          order: 8,
          title: "Clinical Reflection: Your Experience with Trauma Neurobiology",
          prompt: "Think about a client you've worked with who experienced trauma symptoms (hypervigilance, flashbacks, emotional dysregulation, etc.). How might understanding the neurobiological basis of these symptoms change how you explain them to the client? What metaphor or explanation might you use?",
          placeholder: "Reflect on how you might apply neurobiology psychoeducation in your clinical practice...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "According to the triune brain model, which region processes emotions and is primarily affected by trauma?",
          type: "multipleChoice",
          options: [
            { text: "Reptilian brain (brainstem)", isCorrect: false },
            { text: "Mammalian brain (limbic system)", isCorrect: true },
            { text: "Neocortex (thinking brain)", isCorrect: false },
            { text: "Cerebellum", isCorrect: false }
          ],
          explanation: "The limbic system, including the amygdala and hippocampus, is where trauma is primarily processed and stored."
        },
        {
          question: "What happens to the prefrontal cortex during a traumatic event?",
          type: "multipleChoice",
          options: [
            { text: "It becomes hyperactive", isCorrect: false },
            { text: "It goes 'offline' and functioning decreases", isCorrect: true },
            { text: "It processes memories more efficiently", isCorrect: false },
            { text: "It releases cortisol", isCorrect: false }
          ],
          explanation: "During trauma, the prefrontal cortex goes 'offline' while the limbic system takes over, which is why people can't 'think their way out' of trauma responses."
        }
      ]
    },

    // =========================================================================
    // SECTION 2: THE STRESS RESPONSE SYSTEM (45 min)
    // =========================================================================
    {
      title: "The Stress Response System",
      description: "Deep dive into the HPA axis, autonomic nervous system, and fight-flight-freeze responses",
      order: 2,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "The Stress Response System",
          subtitle: "HPA Axis, Autonomic Nervous System, and Survival Responses"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>The Body's Alarm System</h3>
          <p>When the brain detects a threat—real or perceived—it triggers a cascade of neurobiological events designed to ensure survival. This stress response system evolved over millions of years and operates largely outside conscious control. Understanding these systems is essential for trauma-informed clinical practice.</p>
          <p><strong>Why Clinicians Need to Understand the Stress Response:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Recognize stress responses:</strong> Identify when clients (and yourself) are in activated states</li>
            <li><strong>Psychoeducation:</strong> Explain to clients why they can't "just calm down" or "think their way out of it"</li>
            <li><strong>Intervention selection:</strong> Choose approaches that target specific physiological states</li>
            <li><strong>Understand health impacts:</strong> Recognize how chronic stress affects physical health</li>
            <li><strong>Reduce shame:</strong> Help clients understand their responses are normal biology, not weakness</li>
          </ul>
          <p>The two primary systems involved are the <strong>HPA Axis</strong> (hormonal/endocrine system, operating over minutes to hours) and the <strong>Autonomic Nervous System</strong> (neural, operating in milliseconds to seconds). Both systems work together to prepare the body for survival, and both can become dysregulated following trauma.</p>
          <p><strong>Key Insight:</strong> These survival responses happen automatically and unconsciously. The amygdala triggers the stress response before the prefrontal cortex even knows there's a threat. This is why rational arguments ("you're safe now") often fail to calm someone in acute stress—their survival brain is in control.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "The HPA Axis: The Hormonal Stress Response",
              content: `<p>The Hypothalamic-Pituitary-Adrenal (HPA) axis is the body's central stress response system. Understanding this hormonal cascade helps clinicians recognize the physiological underpinnings of trauma symptoms and explains why chronic stress affects physical health.</p>
              <p><strong>The Cascade (Step by Step):</strong></p>
              <p><strong>Step 1 - Hypothalamus (The Integrator):</strong> When the amygdala detects a threat, it signals the hypothalamus—the brain's master regulator. The hypothalamus releases Corticotropin-Releasing Hormone (CRH), beginning the stress cascade.</p>
              <p><strong>Step 2 - Pituitary Gland (The Relay Station):</strong> CRH travels to the pituitary gland (located at the base of the brain), which responds by releasing Adrenocorticotropic Hormone (ACTH) into the bloodstream.</p>
              <p><strong>Step 3 - Adrenal Glands (The Executors):</strong> ACTH travels through the bloodstream to the adrenal glands (sitting on top of the kidneys). The adrenal glands release cortisol (the primary stress hormone) and adrenaline/epinephrine (for immediate energy mobilization).</p>
              <p><strong>Effects of Cortisol:</strong></p>
              <ul>
                <li><strong>Increases blood sugar:</strong> Provides energy for fight or flight</li>
                <li><strong>Suppresses immune function:</strong> Conserves energy for immediate survival (problematic when chronic)</li>
                <li><strong>Enhances memory consolidation:</strong> For survival-relevant information</li>
                <li><strong>At high levels, impairs hippocampal function:</strong> Explains memory problems during and after trauma</li>
                <li><strong>Increases inflammation:</strong> Contributing to chronic health problems</li>
                <li><strong>Disrupts sleep:</strong> Through altered cortisol rhythms</li>
              </ul>
              <p><strong>The Negative Feedback Loop:</strong></p>
              <p>Normally, high cortisol signals the hypothalamus to stop producing CRH, creating a negative feedback loop that turns off the stress response once the threat has passed. However, in chronic trauma, this feedback loop can become dysregulated—either staying constantly activated or becoming blunted and unresponsive.</p>
              <p><strong>Clinical Implications:</strong></p>
              <ul>
                <li>Explains physical health problems in trauma survivors (inflammation, immune dysfunction)</li>
                <li>Helps clients understand why they feel physically exhausted</li>
                <li>Supports importance of stress reduction in trauma treatment</li>
                <li>Explains why trauma affects sleep patterns</li>
              </ul>`
            },
            {
              title: "The Autonomic Nervous System: The Body's Automatic Pilot",
              content: `<p>The autonomic nervous system (ANS) operates automatically, controlling heart rate, breathing, digestion, and arousal level. Unlike the HPA axis (which operates over minutes), the ANS responds in milliseconds—making it the body's first responder to threat.</p>
              <p><strong>Sympathetic Nervous System (SNS) - "The Gas Pedal":</strong></p>
              <ul>
                <li>Activates the fight-or-flight response</li>
                <li>Prepares body for action and energy expenditure</li>
                <li>Increases heart rate and blood pressure</li>
                <li>Dilates pupils (better distance vision) and bronchi (more oxygen)</li>
                <li>Diverts blood from digestion to muscles</li>
                <li>Releases adrenaline and noradrenaline for quick energy</li>
                <li>Inhibits digestion, sexual arousal, and immune function</li>
                <li>Creates feelings of anxiety, agitation, readiness for action</li>
              </ul>
              <p><strong>Parasympathetic Nervous System (PNS) - "The Brake Pedal":</strong></p>
              <ul>
                <li>Promotes rest-and-digest functions</li>
                <li>Activated when we feel safe and connected</li>
                <li>Slows heart rate and lowers blood pressure</li>
                <li>Stimulates digestion and immune function</li>
                <li>Conserves energy and promotes recovery</li>
                <li>Enables social engagement, intimacy, and connection</li>
                <li>Creates feelings of calm, relaxation, groundedness</li>
              </ul>
              <p><strong>Healthy Functioning vs. Trauma Dysregulation:</strong></p>
              <p>In healthy functioning, the ANS flexibly shifts between sympathetic activation (when needed) and parasympathetic recovery. Like a car, you use the gas when you need to move and the brake when you need to slow down.</p>
              <p>After trauma, this system often becomes dysregulated:</p>
              <ul>
                <li>Gas pedal stuck ON: Chronic sympathetic activation (hypervigilance, anxiety, can't relax)</li>
                <li>Gas and brake fighting: Oscillating between activation and collapse</li>
                <li>Brake stuck ON: Chronic parasympathetic dominance (numbness, fatigue, dissociation)</li>
                <li>Difficulty shifting: Can't appropriately activate OR calm down</li>
              </ul>
              <p><strong>Clinical Implication:</strong> Many trauma interventions target ANS regulation—helping clients learn to activate the parasympathetic system (grounding, breathing) and recognize when they're stuck in sympathetic activation.</p>`
            },
            {
              title: "Polyvagal Theory: The Three-State Model",
              content: `<p>Stephen Porges' Polyvagal Theory provides a more nuanced understanding of the stress response by dividing the parasympathetic system into two branches:</p>
              <p><strong>1. Ventral Vagal (Social Engagement):</strong></p>
              <ul>
                <li>The newest evolutionary development</li>
                <li>Enables social connection, communication, and calm</li>
                <li>Associated with feeling safe and connected</li>
                <li>Allows flexible responses to the environment</li>
              </ul>
              <p><strong>2. Sympathetic (Fight/Flight):</strong></p>
              <ul>
                <li>Mobilizes the body for action</li>
                <li>Activated when we perceive danger we can escape or fight</li>
                <li>Increases heart rate, energy, and alertness</li>
              </ul>
              <p><strong>3. Dorsal Vagal (Freeze/Shutdown):</strong></p>
              <ul>
                <li>The oldest evolutionary response</li>
                <li>Activates when fight/flight seems impossible</li>
                <li>Causes immobilization, dissociation, numbness</li>
                <li>Associated with "playing dead" or collapse</li>
              </ul>
              <p><strong>Neuroception:</strong> Porges coined this term for the unconscious process by which the nervous system evaluates safety vs. danger. Trauma can cause faulty neuroception—perceiving danger where there is none.</p>`
            },
            {
              title: "Fight Response",
              content: `<p>The fight response is a sympathetic nervous system activation characterized by aggression, confrontation, or defensive behaviors.</p>
              <p><strong>Physical Signs:</strong></p>
              <ul>
                <li>Increased muscle tension, especially in jaw, shoulders, and fists</li>
                <li>Clenched teeth or fists</li>
                <li>Intense eye contact or glaring</li>
                <li>Flushed face</li>
                <li>Loud or aggressive voice</li>
                <li>Forward body posture</li>
              </ul>
              <p><strong>Psychological Experience:</strong></p>
              <ul>
                <li>Anger, rage, or irritation</li>
                <li>Desire to attack or confront</li>
                <li>Feeling threatened and defensive</li>
                <li>"I need to protect myself/others"</li>
              </ul>
              <p><strong>Clinical Presentation:</strong> Clients may appear hostile, argumentative, or have anger management issues. They may have histories of physical altercations or verbally aggressive behavior.</p>`
            },
            {
              title: "Flight Response",
              content: `<p>The flight response is characterized by escape behaviors, avoidance, or restlessness.</p>
              <p><strong>Physical Signs:</strong></p>
              <ul>
                <li>Increased heart rate and breathing</li>
                <li>Fidgeting, restlessness, inability to sit still</li>
                <li>Legs bouncing or moving</li>
                <li>Eyes scanning for exits</li>
                <li>Pacing</li>
                <li>Urge to run or leave</li>
              </ul>
              <p><strong>Psychological Experience:</strong></p>
              <ul>
                <li>Anxiety, panic, or worry</li>
                <li>Racing thoughts</li>
                <li>Overwhelming urge to escape</li>
                <li>"I need to get out of here"</li>
              </ul>
              <p><strong>Clinical Presentation:</strong> Clients may frequently cancel appointments, avoid certain topics, have panic attacks, or engage in avoidance behaviors (substance use, workaholism, etc.).</p>`
            },
            {
              title: "Freeze Response",
              content: `<p>The freeze response occurs when fight or flight seem impossible. It's a dorsal vagal state characterized by immobilization.</p>
              <p><strong>Physical Signs:</strong></p>
              <ul>
                <li>Decreased heart rate (can drop dramatically)</li>
                <li>Shallow breathing or holding breath</li>
                <li>Muscle immobility or tension</li>
                <li>Pale or cold skin</li>
                <li>Numbness or tingling</li>
                <li>Feeling "frozen" or unable to move</li>
              </ul>
              <p><strong>Psychological Experience:</strong></p>
              <ul>
                <li>Dissociation or feeling detached</li>
                <li>Numbness or emotional blunting</li>
                <li>Feeling trapped or paralyzed</li>
                <li>Time distortion (slowing down)</li>
                <li>"I can't move/think/respond"</li>
              </ul>
              <p><strong>Clinical Presentation:</strong> Clients may appear "shut down," dissociate during sessions, have difficulty accessing emotions, or report feeling numb or empty. This response is often misinterpreted as resistance or lack of engagement.</p>
              <p><strong>Important:</strong> The freeze response is not a choice. It's an automatic survival response that occurs when the brain calculates that fighting or fleeing would be unsuccessful or dangerous.</p>`
            },
            {
              title: "Chronic Stress and HPA Dysregulation",
              content: `<p>Prolonged trauma exposure can dysregulate the HPA axis, leading to long-term changes:</p>
              <p><strong>Hypercortisolism (Too Much Cortisol):</strong></p>
              <ul>
                <li>Common in acute or recent trauma</li>
                <li>Associated with anxiety, hyperarousal, sleep problems</li>
                <li>Can lead to hippocampal damage over time</li>
                <li>Increases risk of metabolic disorders</li>
              </ul>
              <p><strong>Hypocortisolism (Too Little Cortisol):</strong></p>
              <ul>
                <li>Common in chronic/childhood trauma</li>
                <li>Associated with fatigue, depression, chronic pain</li>
                <li>May reflect HPA axis "burnout"</li>
                <li>Linked to autoimmune conditions</li>
              </ul>
              <p><strong>Flattened Cortisol Rhythm:</strong> Normally, cortisol is highest in the morning and lowest at night. Trauma can flatten this rhythm, contributing to sleep problems and fatigue.</p>
              <p><strong>Health Implications:</strong> The ACE (Adverse Childhood Experiences) study demonstrated that chronic early stress dramatically increases risk for physical health problems including heart disease, cancer, autoimmune disorders, and early death.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
          imageAlt: "Person in contemplative state",
          imagePosition: "right",
          title: "Clinical Recognition: Identifying Stress States",
          content: `<p>Learning to recognize which stress state a client is in guides intervention selection:</p>
          <p><strong>Signs of Hyperarousal (Sympathetic Activation):</strong> Rapid speech, fidgeting, scanning the room, difficulty sitting still, anger, anxiety, pressured talking.</p>
          <p><strong>Signs of Hypoarousal (Dorsal Vagal):</strong> Monotone voice, slumped posture, difficulty making eye contact, one-word answers, reports of numbness, "spacing out."</p>
          <p><strong>Signs of Regulation (Ventral Vagal):</strong> Good eye contact, expressive face, flexible vocal tone, engaged in conversation, able to discuss difficult topics without becoming overwhelmed.</p>
          <p>The goal is to help clients return to—and expand—their window of tolerance.</p>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Which hormone is released by the adrenal glands as part of the HPA axis stress response?",
          options: [
            { text: "Dopamine", isCorrect: false },
            { text: "Serotonin", isCorrect: false },
            { text: "Cortisol", isCorrect: true },
            { text: "Oxytocin", isCorrect: false }
          ],
          explanation: "Cortisol, along with adrenaline (epinephrine), is released by the adrenal glands in response to ACTH from the pituitary gland. Cortisol has wide-ranging effects including increasing blood sugar, suppressing immune function, and affecting memory consolidation."
        },
        {
          type: "multiSelect",
          order: 6,
          question: "According to Polyvagal Theory, which of the following are characteristics of the dorsal vagal (freeze) response? (Select all that apply)",
          options: [
            { text: "Immobilization and inability to move", isCorrect: true },
            { text: "Increased heart rate and energy", isCorrect: false },
            { text: "Dissociation and emotional numbness", isCorrect: true },
            { text: "Aggressive or confrontational behavior", isCorrect: false },
            { text: "Shallow breathing or breath holding", isCorrect: true }
          ],
          explanation: "The dorsal vagal response is characterized by immobilization, dissociation, and reduced physiological activity including shallow breathing. It's the body's most primitive survival response, activated when fight or flight seem impossible."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Recognizing Stress States",
          prompt: "Consider your own stress responses. Can you identify a time when you experienced fight, flight, or freeze? How did it manifest in your body? How might recognizing your own patterns help you attune to clients' nervous system states in session?",
          placeholder: "Reflect on your personal experience with stress responses and how this awareness might inform your clinical work...",
          minLength: 100
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
          ],
          explanation: "The HPA axis refers to the Hypothalamic-Pituitary-Adrenal axis, the body's central hormonal stress response system."
        },
        {
          question: "Which stress response is most associated with dissociation and emotional numbness?",
          type: "multipleChoice",
          options: [
            { text: "Fight response", isCorrect: false },
            { text: "Flight response", isCorrect: false },
            { text: "Freeze/dorsal vagal response", isCorrect: true },
            { text: "Social engagement response", isCorrect: false }
          ],
          explanation: "The freeze response (dorsal vagal state) is characterized by immobilization, dissociation, and emotional numbness. It occurs when the brain determines that fight or flight are not viable options."
        }
      ]
    },

    // =========================================================================
    // SECTION 3: TRAUMA AND MEMORY (45 min)
    // =========================================================================
    {
      title: "Trauma and Memory",
      description: "How trauma disrupts memory processing, why traumatic memories are different from ordinary memories, and the clinical implications for assessment and treatment",
      order: 3,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
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
          textContent: `<h3>The Unique Nature of Traumatic Memory</h3>
          <p>Traumatic memories are fundamentally different from ordinary memories in their structure, storage, and retrieval. Understanding these differences is crucial for effective trauma treatment and helps clients understand why they experience flashbacks, intrusive memories, and triggers.</p>
          <p>During trauma, the normal memory consolidation process is disrupted. The overwhelming flood of stress hormones (cortisol and adrenaline), the suppression of the hippocampus, and the hyperactivation of the amygdala cause memories to be encoded in fragmented, sensory-dominated ways rather than as coherent narratives with clear temporal context.</p>
          <p><strong>This is why trauma survivors often:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Experience vivid sensory flashbacks (smells, sounds, images, body sensations) that feel like reliving the trauma</li>
            <li>Have difficulty putting their experience into words—the memory doesn't have a verbal narrative</li>
            <li>Feel like the trauma is happening "right now" when triggered—the memory lacks temporal context</li>
            <li>Have fragmented or incomplete memories of traumatic events—some parts crystal clear, others missing</li>
            <li>Are triggered by seemingly unrelated stimuli that were associated with the trauma</li>
            <li>Experience intrusive memories without consciously trying to remember</li>
          </ul>
          <p><strong>Key Clinical Insight:</strong> Trauma treatment involves helping the brain properly process and integrate traumatic memories—moving them from fragmentary, implicit, "stuck" memories to processed, contextualized memories that are clearly in the past. This is why trauma processing therapies (EMDR, PE, CPT) work: they facilitate the memory consolidation that was disrupted during the original trauma.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Explicit vs. Implicit Memory Systems",
              content: `<p>The brain has two major memory systems, and they are differently affected by trauma:</p>
              <p><strong>Explicit (Declarative) Memory:</strong></p>
              <ul>
                <li>Conscious, verbal, narrative memory</li>
                <li>Includes autobiographical facts and events</li>
                <li>Processed by the hippocampus</li>
                <li>Contains temporal context ("that happened last Tuesday")</li>
                <li>Can be deliberately recalled and described in words</li>
                <li><strong>Often IMPAIRED during trauma</strong> due to hippocampal suppression</li>
              </ul>
              <p><strong>Implicit (Non-declarative) Memory:</strong></p>
              <ul>
                <li>Unconscious, non-verbal, sensory/emotional memory</li>
                <li>Includes procedural memory, emotional associations, body sensations</li>
                <li>Processed by the amygdala and other structures</li>
                <li>Has NO temporal context (feels like "now")</li>
                <li>Activated automatically by triggers</li>
                <li><strong>REMAINS INTACT during trauma</strong>—often enhanced</li>
              </ul>
              <p><strong>Clinical Implication:</strong> Traumatic memories are often stored primarily in implicit memory, which is why they feel so immediate and are triggered by sensory cues rather than being recalled as past events.</p>`
            },
            {
              title: "How Trauma Disrupts Memory Consolidation",
              content: `<p>Memory consolidation is the process by which short-term experiences become long-term memories. Here's how trauma disrupts this process:</p>
              <p><strong>1. Hippocampal Suppression:</strong></p>
              <ul>
                <li>High cortisol levels impair hippocampal function</li>
                <li>The hippocampus cannot properly process and contextualize the experience</li>
                <li>Memories don't get "time-stamped" and filed as past events</li>
              </ul>
              <p><strong>2. Amygdala Enhancement:</strong></p>
              <ul>
                <li>While the hippocampus is suppressed, the amygdala is hyperactive</li>
                <li>Emotional and sensory aspects of the experience are strongly encoded</li>
                <li>Threat-related cues are permanently marked as dangerous</li>
              </ul>
              <p><strong>3. Prefrontal Cortex Offline:</strong></p>
              <ul>
                <li>The thinking brain goes offline during trauma</li>
                <li>Cannot create a coherent narrative of what happened</li>
                <li>Language centers may be suppressed (Broca's area)</li>
              </ul>
              <p><strong>Result:</strong> Traumatic memories are stored as fragmented sensory and emotional impressions without proper temporal context or narrative coherence.</p>`
            },
            {
              title: "Flashbacks and Intrusive Memories: Understanding the Experience",
              content: `<p>Flashbacks are one of the hallmark symptoms of PTSD and result directly from how traumatic memories are stored. Understanding flashbacks neurobiologically helps clinicians and clients make sense of these often terrifying experiences.</p>
              <p><strong>What Happens During a Flashback:</strong></p>
              <ol>
                <li><strong>Trigger activation:</strong> A sensory cue (smell, sound, visual) associated with the trauma is detected by the amygdala</li>
                <li><strong>Amygdala fires:</strong> The alarm system activates as if the threat is present NOW</li>
                <li><strong>Stress response cascade:</strong> The body floods with stress hormones—adrenaline, cortisol—preparing for danger</li>
                <li><strong>Hippocampus offline:</strong> Without hippocampal context, the brain cannot recognize this as a memory</li>
                <li><strong>Re-experiencing:</strong> The person experiences sensations, emotions, and images as if the trauma is happening in the present moment</li>
                <li><strong>Autonomic arousal:</strong> Heart rate increases, breathing changes, muscles tense—the body is responding to a threat that isn't there</li>
              </ol>
              <p><strong>Types of Flashbacks:</strong></p>
              <ul>
                <li><strong>Visual:</strong> Seeing images from the trauma—sometimes full scenes, sometimes fragments</li>
                <li><strong>Auditory:</strong> Hearing sounds associated with the trauma—voices, screams, crashes</li>
                <li><strong>Somatic:</strong> Body sensations from the trauma—pain, pressure, choking, being held down</li>
                <li><strong>Emotional:</strong> Intense emotions without clear memory content—terror, rage, shame appearing "out of nowhere"</li>
                <li><strong>Olfactory:</strong> Smelling scents associated with the trauma—often the most powerful triggers</li>
                <li><strong>Full re-experiencing:</strong> Complete multi-sensory re-living of the event, sometimes with loss of awareness of present surroundings</li>
              </ul>
              <p><strong>Critical Clinical Point:</strong> Flashbacks are not "just memories" or imagination—they involve genuine physiological re-activation. The body doesn't know the difference between remembering danger and experiencing danger. This is why telling someone having a flashback to "just calm down" or "it's not real" is ineffective—to their nervous system, it IS real.</p>
              <p><strong>Helping Clients During Flashbacks:</strong></p>
              <ul>
                <li>Help them orient to the present moment (look around the room, feel the chair)</li>
                <li>Use grounding techniques (cold water, strong sensations)</li>
                <li>Speak calmly and slowly—provide external co-regulation</li>
                <li>Remind them gently where they are and that they're safe</li>
              </ul>`
            },
            {
              title: "Triggers and Trauma Reminders: The Amygdala's Alarm System",
              content: `<p>Triggers are stimuli that activate implicit traumatic memories. Understanding how triggers work neurobiologically helps clinicians explain this phenomenon to clients and guides treatment planning.</p>
              <p><strong>Common Trigger Categories:</strong></p>
              <ul>
                <li><strong>Sensory:</strong> Smells (cologne, smoke, alcohol), sounds (sirens, yelling, certain music), sights (facial expressions, body types, objects), textures (fabrics, restraints), tastes (alcohol, certain foods)</li>
                <li><strong>Environmental:</strong> Locations (hospitals, basements, parking garages), weather (storms, darkness), time of day/year (night, winter), physical spaces (small rooms, crowds)</li>
                <li><strong>Interpersonal:</strong> Certain types of people (authority figures, men/women), behaviors (raised voices, sudden movements), tones of voice (anger, patronizing), facial expressions (anger, disappointment)</li>
                <li><strong>Internal:</strong> Body sensations (rapid heartbeat, feeling hot), emotions (helplessness, shame), thoughts (certain topics, memories), physical positions (lying down, being approached from behind)</li>
                <li><strong>Temporal:</strong> Anniversaries (trauma date, holidays associated with trauma), seasons (when trauma occurred), life stages (children reaching the age of trauma)</li>
              </ul>
              <p><strong>Why Triggers Seem Irrational:</strong></p>
              <p>Triggers are created by the amygdala's threat-learning system, which operates on ASSOCIATION rather than logic. The amygdala doesn't analyze whether something is actually dangerous—it simply notes what was present during danger and flags all similar stimuli as potential threats. If a particular cologne was worn by a perpetrator, ANY similar scent may trigger a fear response—even when worn by a completely safe person in a completely safe situation.</p>
              <p><strong>Trigger Generalization:</strong></p>
              <p>Over time, triggers can generalize to related stimuli. A survivor initially triggered by one person's voice may become triggered by all deep male voices. A person traumatized in one location may become triggered by all similar locations. This generalization is a protective mechanism—the brain is trying to keep the person safe by erring on the side of caution—but it can become debilitating when triggers multiply.</p>
              <p><strong>Clinical Implications:</strong></p>
              <ul>
                <li>Help clients identify their specific triggers through careful exploration</li>
                <li>Explain the neurobiology—triggers are not "craziness" but the amygdala doing its job</li>
                <li>Develop trigger management strategies (grounding, coping plans)</li>
                <li>Consider whether to work on trigger desensitization (exposure approaches)</li>
                <li>Be aware that triggers can emerge over time—new triggers may develop as memories are processed</li>
              </ul>`
            },
            {
              title: "The Role of the Hippocampus in Healing",
              content: `<p>The hippocampus is crucial for trauma recovery because it provides context—"that was then, this is now."</p>
              <p><strong>Hippocampal Functions in Recovery:</strong></p>
              <ul>
                <li>Contextualizes traumatic memories as past events</li>
                <li>Integrates fragments into coherent narratives</li>
                <li>Enables discrimination between past threats and present safety</li>
                <li>Supports new learning that contradicts trauma-based beliefs</li>
              </ul>
              <p><strong>Good News:</strong> The hippocampus is one of the few brain regions that can generate new neurons (neurogenesis) throughout life. Factors that support hippocampal health include:</p>
              <ul>
                <li>Exercise (one of the strongest neurogenesis promoters)</li>
                <li>Sleep (memory consolidation occurs during sleep)</li>
                <li>Stress reduction (chronic cortisol damages the hippocampus)</li>
                <li>Social connection</li>
                <li>Learning new things</li>
                <li>Mindfulness meditation</li>
              </ul>
              <p><strong>Clinical Implication:</strong> Effective trauma treatment helps "wake up" the hippocampus and integrate traumatic memories with temporal context, so they can be experienced as past events rather than present threats.</p>`
            },
            {
              title: "Memory Reconsolidation: A Window for Change",
              content: `<p>Memory reconsolidation is a neurobiological process that offers a window for therapeutic change.</p>
              <p><strong>How Memory Reconsolidation Works:</strong></p>
              <ol>
                <li><strong>Reactivation:</strong> When a memory is recalled, it temporarily becomes unstable</li>
                <li><strong>Lability Window:</strong> For several hours after reactivation, the memory can be modified</li>
                <li><strong>Reconsolidation:</strong> The memory is re-stored, potentially with new information integrated</li>
              </ol>
              <p><strong>Therapeutic Implications:</strong></p>
              <ul>
                <li>Activating traumatic memories in a safe therapeutic context can enable modification</li>
                <li>New corrective experiences during the lability window can be integrated</li>
                <li>This may explain how therapies like EMDR and exposure therapy work</li>
                <li>Timing matters—interventions during the reconsolidation window are most effective</li>
              </ul>
              <p><strong>Key Conditions for Reconsolidation:</strong></p>
              <ul>
                <li>The memory must be activated (but not overwhelmingly so)</li>
                <li>A "prediction error" must occur (something different than expected)</li>
                <li>New learning must take place during the lability window</li>
              </ul>
              <p><strong>Important:</strong> This doesn't erase memories but can modify their emotional charge and associated beliefs.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
          imageAlt: "Person in therapy session",
          imagePosition: "left",
          title: "Clinical Application: Working with Traumatic Memories",
          content: `<p>Understanding memory neurobiology guides treatment:</p>
          <p><strong>Narrative Processing:</strong> Helping clients develop a coherent verbal narrative engages the hippocampus and prefrontal cortex, promoting integration.</p>
          <p><strong>Titration:</strong> Working with small "doses" of traumatic material prevents hippocampal shutdown from overwhelm.</p>
          <p><strong>Dual Awareness:</strong> Maintaining awareness of present safety while processing past trauma ("one foot in the past, one in the present").</p>
          <p><strong>Body-Based Approaches:</strong> Since implicit memories are stored in the body, somatic approaches can access material that verbal approaches cannot.</p>`,
          highlight: true
        },
        {
          type: "multiSelect",
          order: 5,
          question: "Which of the following are characteristics of how traumatic memories are typically stored? (Select all that apply)",
          options: [
            { text: "Fragmented and disorganized", isCorrect: true },
            { text: "Highly emotional and sensory", isCorrect: true },
            { text: "Lacking clear temporal context ('feels like now')", isCorrect: true },
            { text: "Always completely accurate and detailed", isCorrect: false },
            { text: "Easily accessible through verbal recall", isCorrect: false }
          ],
          explanation: "Traumatic memories are typically fragmented, emotionally intense, sensory-based, and lack proper time context due to hippocampal impairment during encoding. They are not always accurate and are often difficult to access verbally because they're stored primarily in implicit memory systems."
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Which type of memory remains intact and is often enhanced during trauma?",
          type: "multipleChoice",
          options: [
            { text: "Explicit (declarative) memory", isCorrect: false },
            { text: "Implicit (non-declarative) memory", isCorrect: true },
            { text: "Working memory", isCorrect: false },
            { text: "Semantic memory", isCorrect: false }
          ],
          explanation: "Implicit memory, which includes emotional associations, body sensations, and sensory impressions, remains intact and is often enhanced during trauma while the hippocampus-dependent explicit memory system is suppressed."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Working with Traumatic Memories",
          prompt: "Think about how understanding the difference between explicit and implicit memory systems might change your approach to trauma work. How might you help a client understand why they have intense body reactions or emotional responses without clear narrative memories? What would you say to normalize their experience?",
          placeholder: "Reflect on how you might explain traumatic memory to clients and adapt your clinical approach...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Why do traumatic memories often feel like they're happening 'right now' rather than in the past?",
          type: "multipleChoice",
          options: [
            { text: "Because the person is imagining things", isCorrect: false },
            { text: "Because the hippocampus didn't properly time-stamp the memory", isCorrect: true },
            { text: "Because the person hasn't tried hard enough to forget", isCorrect: false },
            { text: "Because traumatic events are more recent", isCorrect: false }
          ],
          explanation: "The hippocampus is responsible for giving memories temporal context. During trauma, high stress hormones suppress hippocampal function, preventing proper 'time-stamping' of memories."
        },
        {
          question: "What is memory reconsolidation?",
          type: "multipleChoice",
          options: [
            { text: "The initial formation of a memory", isCorrect: false },
            { text: "Completely erasing traumatic memories", isCorrect: false },
            { text: "A window after memory reactivation when it can be modified", isCorrect: true },
            { text: "Forgetting memories over time", isCorrect: false }
          ],
          explanation: "Memory reconsolidation is the process by which reactivated memories become temporarily unstable and can be modified with new information before being re-stored."
        }
      ]
    },

    // =========================================================================
    // SECTION 4: NEUROPLASTICITY AND RECOVERY (45 min)
    // =========================================================================
    {
      title: "Neuroplasticity and Recovery",
      description: "The brain's capacity for change and the neuroscience of healing",
      order: 4,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Neuroplasticity and Recovery",
          subtitle: "The Neuroscience of Hope and Healing"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>The Brain Can Change</h3>
          <p>Perhaps the most important message from neuroscience is this: <strong>the brain can change throughout life</strong>. This capacity for change—neuroplasticity—provides the biological foundation for trauma recovery and is the reason why therapy works.</p>
          <p>For decades, scientists believed that the adult brain was essentially fixed—that after a certain age, the neural architecture was set and couldn't be significantly altered. We now know this is wrong. The brain continues to form new connections, grow new neurons (particularly in the hippocampus), and reorganize itself throughout the lifespan.</p>
          <p><strong>What This Means for Trauma Recovery:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>The neural pathways created by trauma are not permanent—they can be changed</li>
            <li>The same mechanisms that created trauma responses can create new, healthier patterns</li>
            <li>Recovery is not just "managing symptoms"—it's literally rewiring the brain</li>
            <li>Brain changes can be measured with neuroimaging, providing objective evidence of healing</li>
          </ul>
          <p>For trauma survivors who often feel broken, damaged, or permanently changed, the message of neuroplasticity is profoundly hopeful: <strong>Your brain can heal. The changes that trauma caused can be reversed. Recovery is not just possible—it's biologically supported.</strong></p>
          <p>This knowledge also changes how we frame treatment. We're not just teaching coping skills or providing support (though these matter). We're actually facilitating biological change in the brain's structure and function.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "What is Neuroplasticity?",
              content: `<p>Neuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections throughout life. This includes:</p>
              <p><strong>Structural Plasticity:</strong></p>
              <ul>
                <li>Growing new neurons (neurogenesis, especially in the hippocampus)</li>
                <li>Creating new synaptic connections</li>
                <li>Strengthening or weakening existing connections</li>
                <li>Pruning unused connections</li>
              </ul>
              <p><strong>Functional Plasticity:</strong></p>
              <ul>
                <li>Reorganizing functions from damaged to healthy brain areas</li>
                <li>Changing which neural pathways are used for specific functions</li>
                <li>Shifting patterns of brain activation</li>
              </ul>
              <p><strong>Hebb's Law:</strong> "Neurons that fire together, wire together." This principle means that repeated experiences strengthen the neural pathways involved, while unused pathways weaken over time.</p>
              <p><strong>Implications for Trauma:</strong> Just as trauma created certain neural pathways, new experiences can create new pathways. Recovery involves both weakening trauma-related patterns and strengthening adaptive ones.</p>`
            },
            {
              title: "How Trauma Changes the Brain—And How Healing Reverses It",
              content: `<p>Research using brain imaging has documented both trauma-induced changes and recovery-related improvements:</p>
              <p><strong>Trauma-Related Changes:</strong></p>
              <ul>
                <li><strong>Amygdala:</strong> Increased size and reactivity → <em>Recovery: Decreased reactivity, appropriate threat response</em></li>
                <li><strong>Hippocampus:</strong> Reduced volume and function → <em>Recovery: Volume increase, improved memory contextualization</em></li>
                <li><strong>Prefrontal Cortex:</strong> Reduced activity and volume → <em>Recovery: Increased activity, better emotional regulation</em></li>
                <li><strong>Default Mode Network:</strong> Disrupted connectivity → <em>Recovery: Improved integration and sense of self</em></li>
              </ul>
              <p><strong>Key Finding:</strong> Studies show that effective trauma therapy produces measurable brain changes. EMDR, for example, has been shown to normalize brain function in PTSD patients.</p>
              <p><strong>Timeline:</strong> Neural changes can begin within weeks of starting treatment, though significant structural changes may take months to years of consistent practice.</p>`
            },
            {
              title: "Factors That Promote Neuroplasticity",
              content: `<p>Certain conditions enhance the brain's capacity for change:</p>
              <p><strong>1. Novelty and Challenge:</strong></p>
              <ul>
                <li>New experiences stimulate neural growth</li>
                <li>Learning new skills creates new pathways</li>
                <li>Stepping outside comfort zones (safely) promotes adaptation</li>
              </ul>
              <p><strong>2. Repetition and Practice:</strong></p>
              <ul>
                <li>Repeated practice strengthens new pathways</li>
                <li>Consistency matters more than intensity</li>
                <li>"Use it or lose it"—new skills need regular practice</li>
              </ul>
              <p><strong>3. Emotional Engagement:</strong></p>
              <ul>
                <li>Emotionally significant experiences create stronger memories</li>
                <li>Moderate arousal enhances learning</li>
                <li>Positive emotions support neuroplasticity</li>
              </ul>
              <p><strong>4. Social Connection:</strong></p>
              <ul>
                <li>Safe relationships regulate the nervous system</li>
                <li>Co-regulation supports self-regulation development</li>
                <li>Social engagement activates the ventral vagal system</li>
              </ul>
              <p><strong>5. Physical Health:</strong></p>
              <ul>
                <li>Exercise is one of the most powerful neuroplasticity promoters</li>
                <li>Sleep is essential for consolidating new learning</li>
                <li>Nutrition affects brain function and plasticity</li>
                <li>Stress reduction protects against cortisol-related damage</li>
              </ul>`
            },
            {
              title: "Top-Down and Bottom-Up Approaches to Healing",
              content: `<p>Effective trauma treatment often involves both approaches:</p>
              <p><strong>Top-Down Approaches (Cortex → Limbic System):</strong></p>
              <ul>
                <li>Use cognitive processes to regulate emotions</li>
                <li>Include talk therapy, cognitive restructuring, psychoeducation</li>
                <li>Engage the prefrontal cortex to modulate amygdala activity</li>
                <li>Work with thoughts, beliefs, and narratives</li>
                <li>Examples: CBT, CPT, narrative therapy</li>
              </ul>
              <p><strong>Bottom-Up Approaches (Body → Limbic System → Cortex):</strong></p>
              <ul>
                <li>Work with the body and nervous system directly</li>
                <li>Regulate physiology to calm the limbic system</li>
                <li>Access implicit memories stored in the body</li>
                <li>Work with sensations, movement, and breath</li>
                <li>Examples: Somatic Experiencing, EMDR, yoga, neurofeedback</li>
              </ul>
              <p><strong>Integration:</strong> The most effective treatment often combines both approaches. Some clients respond better to one approach initially—meeting them where they are neurobiologically.</p>
              <p><strong>Clinical Tip:</strong> If a client is hyperaroused or hypoaroused, bottom-up regulation may be needed before top-down processing is possible. "You can't think your way out of a dysregulated nervous system."</p>`
            },
            {
              title: "The Role of Safety and Relationship in Neural Change",
              content: `<p>The therapeutic relationship itself is a powerful agent of neural change:</p>
              <p><strong>Co-Regulation:</strong></p>
              <ul>
                <li>A calm, regulated therapist helps regulate a dysregulated client</li>
                <li>The nervous system "borrows" regulation from safe others</li>
                <li>Over time, co-regulation builds capacity for self-regulation</li>
              </ul>
              <p><strong>Corrective Relational Experience:</strong></p>
              <ul>
                <li>Many trauma survivors learned that relationships are dangerous</li>
                <li>A safe therapeutic relationship provides disconfirming evidence</li>
                <li>New relational experiences create new neural pathways</li>
              </ul>
              <p><strong>Neuroception of Safety:</strong></p>
              <ul>
                <li>The nervous system must detect safety for healing to occur</li>
                <li>Therapist's voice, face, and posture signal safety cues</li>
                <li>Consistent, predictable behavior builds trust neurobiologically</li>
              </ul>
              <p><strong>Research Support:</strong> Studies show that therapeutic alliance predicts outcome across all treatment modalities—suggesting that the relationship itself, not just techniques, drives neural change.</p>`
            },
            {
              title: "Practical Strategies for Promoting Neural Change",
              content: `<p>Evidence-based strategies that harness neuroplasticity:</p>
              <p><strong>1. Mindfulness and Meditation:</strong></p>
              <ul>
                <li>Strengthens prefrontal cortex</li>
                <li>Reduces amygdala reactivity</li>
                <li>Improves interoception (body awareness)</li>
                <li>Even brief daily practice produces measurable changes</li>
              </ul>
              <p><strong>2. Exercise:</strong></p>
              <ul>
                <li>Increases BDNF (brain-derived neurotrophic factor)</li>
                <li>Promotes hippocampal neurogenesis</li>
                <li>Regulates stress hormones</li>
                <li>Improves mood and cognitive function</li>
              </ul>
              <p><strong>3. Sleep Optimization:</strong></p>
              <ul>
                <li>Memory consolidation occurs during sleep</li>
                <li>Glymphatic system clears brain waste during sleep</li>
                <li>Sleep deprivation impairs neuroplasticity</li>
              </ul>
              <p><strong>4. Social Connection:</strong></p>
              <ul>
                <li>Oxytocin release during positive social interaction</li>
                <li>Co-regulation supports nervous system health</li>
                <li>Isolation worsens trauma symptoms</li>
              </ul>
              <p><strong>5. Grounding and Regulation Skills:</strong></p>
              <ul>
                <li>Practice activating the parasympathetic system</li>
                <li>Build "muscle memory" for returning to regulation</li>
                <li>Create new default patterns of nervous system response</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
          imageAlt: "Person meditating at sunrise",
          imagePosition: "right",
          title: "The Message of Hope: Neuroscience Validates Recovery",
          content: `<p>The neuroscience of trauma carries a profound message of hope that clinicians can share with clients:</p>
          <p><strong>"Your brain changed in response to what happened to you. It can change again in response to new experiences."</strong></p>
          <p>This is not just reassurance or positive thinking—it's biological fact supported by decades of research. Neuroimaging studies have shown that effective trauma therapy produces measurable changes in brain structure and function. The hyperactive amygdala calms down. The suppressed prefrontal cortex comes back online. The shrunken hippocampus can regrow neurons. The disrupted connections between brain regions can be rewired.</p>
          <p>Every moment of safety, every regulated connection with another person, every new coping skill practiced, every time a trauma survivor stays present instead of dissociating—all of these experiences are literally rewiring the brain at the cellular level.</p>
          <p>Recovery is not about forgetting the trauma or "getting over it." It's about building new neural pathways that allow the past to be the past while living fully in the present. The trauma memories don't disappear, but they lose their power to hijack the present moment.</p>
          <p><strong>The brain that learned to survive trauma can learn to thrive beyond it.</strong></p>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "What does Hebb's Law state about neurons?",
          options: [
            { text: "Neurons that fire together, die together", isCorrect: false },
            { text: "Neurons that fire together, wire together", isCorrect: true },
            { text: "Neurons cannot change after childhood", isCorrect: false },
            { text: "Neurons only respond to medication", isCorrect: false }
          ],
          explanation: "Hebb's Law states that 'neurons that fire together, wire together.' This means that repeated experiences strengthen the neural pathways involved, forming the basis for both trauma responses and recovery."
        },
        {
          type: "multiSelect",
          order: 6,
          question: "Which of the following factors promote neuroplasticity and brain healing? (Select all that apply)",
          options: [
            { text: "Regular physical exercise", isCorrect: true },
            { text: "Adequate sleep", isCorrect: true },
            { text: "Social isolation", isCorrect: false },
            { text: "Safe social connections", isCorrect: true },
            { text: "Mindfulness practice", isCorrect: true },
            { text: "Chronic stress", isCorrect: false }
          ],
          explanation: "Exercise, sleep, safe social connections, and mindfulness all promote neuroplasticity. Chronic stress and isolation impair the brain's ability to change and heal."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Promoting Neuroplasticity",
          prompt: "How might you incorporate neuroplasticity-promoting factors (exercise, sleep hygiene, social connection, mindfulness) into treatment planning for trauma clients? What barriers might your clients face, and how could you help them overcome these obstacles?",
          placeholder: "Reflect on practical ways to support neuroplasticity in your clinical work...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which approach to trauma treatment works 'from the body up' rather than 'from the mind down'?",
          type: "multipleChoice",
          options: [
            { text: "Top-down approach", isCorrect: false },
            { text: "Bottom-up approach", isCorrect: true },
            { text: "Cognitive approach", isCorrect: false },
            { text: "Analytical approach", isCorrect: false }
          ],
          explanation: "Bottom-up approaches work with the body and nervous system directly (body → limbic system → cortex), while top-down approaches work from cognition down (cortex → limbic system)."
        },
        {
          question: "Which of the following is one of the most powerful promoters of neuroplasticity?",
          type: "multipleChoice",
          options: [
            { text: "Medication alone", isCorrect: false },
            { text: "Avoiding all stress", isCorrect: false },
            { text: "Physical exercise", isCorrect: true },
            { text: "Social isolation", isCorrect: false }
          ],
          explanation: "Exercise is one of the most powerful promoters of neuroplasticity, increasing BDNF and promoting hippocampal neurogenesis."
        }
      ]
    },

    // =========================================================================
    // SECTION 5: CLINICAL APPLICATIONS (45 min)
    // =========================================================================
    {
      title: "Clinical Applications",
      description: "Applying neurobiology knowledge in trauma treatment practice",
      order: 5,
      estimatedTime: 45,
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 5,
          title: "Clinical Applications",
          subtitle: "Integrating Neuroscience into Trauma Treatment"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>From Knowledge to Practice</h3>
          <p>Understanding trauma neurobiology is only valuable if it translates into better clinical practice. This final section focuses on practical applications—how to use neurobiological knowledge to enhance assessment, treatment planning, intervention selection, and client psychoeducation.</p>
          <p>The goal is not to become a neuroscientist, but to be a neurobiologically-informed clinician who can:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Recognize physiological states in clients and respond appropriately</li>
            <li>Explain symptoms in ways that reduce shame and increase engagement</li>
            <li>Select interventions that match the client's neurobiological state</li>
            <li>Track progress through a neurobiological lens</li>
            <li>Know when to use top-down vs. bottom-up approaches</li>
          </ul>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Neurobiologically-Informed Assessment",
              content: `<p>Adding a neurobiological lens to your trauma assessment enhances your understanding and guides intervention selection. Here's how to integrate neuroscience into clinical assessment:</p>
              <p><strong>Observe Physiological State:</strong></p>
              <ul>
                <li>Is the client currently hyperaroused (anxious, agitated, racing thoughts), hypoaroused (flat, disconnected, foggy), or regulated?</li>
                <li>What happens to their physiological state when discussing trauma-related material?</li>
                <li>How quickly can they return to regulation after becoming activated?</li>
                <li>What are their window of tolerance patterns—is it very narrow, or do they have some flexibility?</li>
                <li>Do they tend more toward hyperarousal or hypoarousal, or do they oscillate between both?</li>
              </ul>
              <p><strong>Assess Nervous System Functioning:</strong></p>
              <ul>
                <li><strong>Sleep patterns:</strong> Difficulty falling asleep (hyperarousal), early morning waking (cortisol dysregulation), nightmares (inadequate memory processing)</li>
                <li><strong>Startle response:</strong> Exaggerated startle indicates hyperactive amygdala and heightened threat detection</li>
                <li><strong>Concentration and memory:</strong> Difficulty concentrating and memory problems suggest prefrontal cortex and hippocampus impairment</li>
                <li><strong>Emotional regulation:</strong> Inability to modulate emotions indicates weakened PFC-amygdala connectivity</li>
                <li><strong>Body awareness:</strong> Disconnection from body sensations suggests insula dysfunction and possible dissociation</li>
                <li><strong>Chronic pain or somatic complaints:</strong> May indicate somatization and nervous system dysregulation</li>
              </ul>
              <p><strong>Identify Triggers and Patterns:</strong></p>
              <ul>
                <li>What sensory stimuli, situations, or internal states activate trauma responses?</li>
                <li>What helps the client return to regulation—and do they know how to use these strategies?</li>
                <li>What is their predominant survival response (fight/flight/freeze/fawn)?</li>
                <li>Are triggers primarily external (sensory) or internal (emotions, body sensations)?</li>
              </ul>
              <p><strong>Useful Assessment Tools:</strong></p>
              <ul>
                <li>PCL-5: PTSD symptom severity</li>
                <li>ACE Questionnaire: Childhood adversity history</li>
                <li>Shutdown Dissociation Scale: Dorsal vagal/dissociative responses</li>
                <li>Difficulties in Emotion Regulation Scale (DERS): Emotional regulation capacity</li>
              </ul>`
            },
            {
              title: "Psychoeducation Strategies That Work",
              content: `<p>Effective psychoeducation normalizes symptoms, reduces shame, and instills hope. When clients understand WHY they're experiencing what they're experiencing, everything shifts.</p>
              <p><strong>Key Messages to Convey:</strong></p>
              <ul>
                <li>"Your symptoms are normal responses to abnormal events—there's nothing wrong with you"</li>
                <li>"Your brain is doing exactly what it was designed to do—protect you from danger"</li>
                <li>"Your brain changed in response to trauma, and it can change again through treatment"</li>
                <li>"Healing is possible—we have decades of research and proven treatments"</li>
                <li>"You survived because your brain protected you—these same systems can now learn that you're safe"</li>
              </ul>
              <p><strong>Effective Metaphors (Match to Client's Experience and Learning Style):</strong></p>
              <ul>
                <li><strong>Smoke Detector (Amygdala):</strong> "Your brain's smoke detector got set too sensitive after the trauma. Now it goes off when someone's just making toast—not because there's a fire. We can recalibrate it."</li>
                <li><strong>Filing Cabinet (Hippocampus):</strong> "Normal memories get filed in the 'past' folder. Trauma memories got stuck on your desk, unfiled, so they feel like they're happening now. Treatment helps file them where they belong."</li>
                <li><strong>Hand Model (Brain - Dan Siegel):</strong> Make a fist with thumb inside representing limbic brain, fingers over top representing prefrontal cortex. "When you flip your lid" (fingers up), "your thinking brain goes offline and your emotional brain takes over."</li>
                <li><strong>Gas Pedal/Brake (ANS):</strong> "Your nervous system has a gas pedal (fight/flight) and a brake (rest). After trauma, sometimes the gas gets stuck, or the brake locks up. We're going to tune up your system."</li>
                <li><strong>Window of Tolerance:</strong> "We all have a window where we can think, feel, and function. Trauma narrowed your window—so things that might not bother others push you outside your window. We're going to widen it."</li>
                <li><strong>Car Alarm (Triggers):</strong> "Your alarm system got programmed during the trauma. Now it goes off whenever it detects something that reminds it of danger—even if you're completely safe."</li>
              </ul>
              <p><strong>Timing and Delivery:</strong></p>
              <ul>
                <li>Introduce psychoeducation early in treatment—it often provides immediate relief</li>
                <li>Keep explanations simple and jargon-free</li>
                <li>Check understanding—have clients explain it back to you</li>
                <li>Connect concepts to their specific experience</li>
                <li>Return to these concepts throughout treatment as relevant</li>
                <li>Consider providing handouts or recommending books for interested clients</li>
              </ul>
              <p><strong>Recommended Resources for Clients:</strong> "The Body Keeps the Score" (van der Kolk), "Waking the Tiger" (Levine), "Trauma and Recovery" (Herman)</p>`
            },
            {
              title: "Matching Interventions to Neurobiological State",
              content: `<p>Different interventions target different brain systems. Match your approach to the client's state:</p>
              <p><strong>When Client is Hyperaroused:</strong></p>
              <ul>
                <li>Prioritize calming interventions (grounding, slow breathing, safe place imagery)</li>
                <li>Reduce stimulation in the environment</li>
                <li>Use a calm, slow voice</li>
                <li>Avoid processing traumatic content until regulated</li>
                <li>Focus on parasympathetic activation</li>
              </ul>
              <p><strong>When Client is Hypoaroused/Dissociated:</strong></p>
              <ul>
                <li>Use gentle activation (movement, sensory engagement, eye contact)</li>
                <li>Increase connection and presence</li>
                <li>Use orienting to the present moment</li>
                <li>Consider walking or standing instead of sitting</li>
                <li>Avoid deep relaxation techniques (can increase dissociation)</li>
              </ul>
              <p><strong>When Client is Regulated (Within Window):</strong></p>
              <ul>
                <li>This is the optimal state for processing</li>
                <li>Can engage in narrative work and memory processing</li>
                <li>Can use both top-down and bottom-up approaches</li>
                <li>Can explore and integrate traumatic material</li>
              </ul>
              <p><strong>General Principle:</strong> Regulate first, then process. Trying to process trauma when dysregulated often increases symptoms and can retraumatize.</p>`
            },
            {
              title: "Regulation Techniques Based on Neuroscience",
              content: `<p>These techniques directly target nervous system regulation:</p>
              <p><strong>Breathing Techniques (Vagal Activation):</strong></p>
              <ul>
                <li>Extended exhale breathing (longer exhale than inhale activates PNS)</li>
                <li>Paced breathing (5-6 breaths per minute)</li>
                <li>Diaphragmatic breathing (engages vagus nerve)</li>
              </ul>
              <p><strong>Grounding (Prefrontal Engagement):</strong></p>
              <ul>
                <li>5-4-3-2-1 sensory grounding</li>
                <li>Physical grounding (feet on floor, back against chair)</li>
                <li>Orienting to the environment</li>
              </ul>
              <p><strong>Bilateral Stimulation (Integration):</strong></p>
              <ul>
                <li>Eye movements (as in EMDR)</li>
                <li>Alternating tapping</li>
                <li>Walking (natural bilateral movement)</li>
              </ul>
              <p><strong>Social Engagement (Ventral Vagal):</strong></p>
              <ul>
                <li>Eye contact with safe person</li>
                <li>Listening to calm human voice</li>
                <li>Vocal toning or humming</li>
              </ul>
              <p><strong>Movement (Completing Survival Responses):</strong></p>
              <ul>
                <li>Pushing movements (completing fight response)</li>
                <li>Running in place (completing flight response)</li>
                <li>Shaking/trembling (releasing freeze)</li>
              </ul>`
            },
            {
              title: "Evidence-Based Treatments from a Neurobiological Perspective",
              content: `<p>Understanding how evidence-based treatments work neurobiologically:</p>
              <p><strong>EMDR (Eye Movement Desensitization and Reprocessing):</strong></p>
              <ul>
                <li>Bilateral stimulation may facilitate memory reconsolidation</li>
                <li>Working memory taxation reduces emotional intensity</li>
                <li>Promotes integration of traumatic memories</li>
                <li>Engages both hemispheres of the brain</li>
              </ul>
              <p><strong>Prolonged Exposure (PE):</strong></p>
              <ul>
                <li>Habituation reduces amygdala reactivity over time</li>
                <li>New safety learning competes with fear memories</li>
                <li>Hippocampal engagement contextualizes memories</li>
              </ul>
              <p><strong>Cognitive Processing Therapy (CPT):</strong></p>
              <ul>
                <li>Engages prefrontal cortex for cognitive restructuring</li>
                <li>Challenges trauma-related beliefs</li>
                <li>Written accounts promote narrative integration</li>
              </ul>
              <p><strong>Somatic Experiencing (SE):</strong></p>
              <ul>
                <li>Completes thwarted survival responses</li>
                <li>Releases trapped activation from the body</li>
                <li>Restores healthy nervous system rhythm</li>
              </ul>
              <p><strong>Neurofeedback:</strong></p>
              <ul>
                <li>Directly trains brain wave patterns</li>
                <li>Can improve self-regulation capacity</li>
                <li>Targets specific dysregulated brain areas</li>
              </ul>`
            },
            {
              title: "Self-Care for Trauma Clinicians: Protecting Your Own Nervous System",
              content: `<p>Working with trauma affects the clinician's nervous system too. Apply neurobiology knowledge to your own self-care:</p>
              <p><strong>Vicarious Trauma Prevention:</strong></p>
              <ul>
                <li>Monitor your own window of tolerance throughout the day</li>
                <li>Practice nervous system regulation between sessions</li>
                <li>Limit consecutive trauma-focused sessions when possible</li>
                <li>Maintain a caseload balance (not all high-acuity clients)</li>
              </ul>
              <p><strong>Daily Practices:</strong></p>
              <ul>
                <li>Regular exercise (regulates stress hormones)</li>
                <li>Adequate sleep (essential for neural recovery)</li>
                <li>Mindfulness or meditation practice</li>
                <li>Social connection outside of work</li>
                <li>Activities that bring joy and engagement</li>
              </ul>
              <p><strong>In-Session Self-Regulation:</strong></p>
              <ul>
                <li>Feel your feet on the floor</li>
                <li>Notice your own breathing</li>
                <li>Take brief "micro-breaks" to regulate</li>
                <li>Stay connected to present-moment sensory input</li>
              </ul>
              <p><strong>Remember:</strong> You cannot pour from an empty cup. Taking care of your own nervous system is not selfish—it's essential for providing quality care and sustaining a long career in this field.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
          imageAlt: "Therapist and client in session",
          imagePosition: "left",
          title: "Putting It All Together",
          content: `<p>Neurobiologically-informed trauma treatment integrates understanding of brain function with clinical skill:</p>
          <p><strong>1. Assess</strong> the client's neurobiological state and patterns</p>
          <p><strong>2. Educate</strong> the client about their brain and symptoms</p>
          <p><strong>3. Stabilize</strong> through regulation skills and safety</p>
          <p><strong>4. Process</strong> traumatic memories when the window allows</p>
          <p><strong>5. Integrate</strong> new learning and promote growth</p>
          <p>Throughout, the therapeutic relationship provides the safe relational context that makes neural change possible.</p>`,
          highlight: true
        },
        {
          type: "multiSelect",
          order: 5,
          question: "When a client is in a dissociated (hypoaroused) state, which interventions are most appropriate? (Select all that apply)",
          options: [
            { text: "Gentle movement or walking", isCorrect: true },
            { text: "Deep relaxation techniques", isCorrect: false },
            { text: "Sensory engagement (cold water, strong scents)", isCorrect: true },
            { text: "Processing traumatic memories", isCorrect: false },
            { text: "Orienting to the present environment", isCorrect: true },
            { text: "Eye contact and connection", isCorrect: true }
          ],
          explanation: "When a client is hypoaroused/dissociated, gentle activation is needed—movement, sensory engagement, orienting, and connection. Deep relaxation can increase dissociation, and trauma processing should wait until the client is regulated."
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "According to the principle 'regulate first, then process,' what should a clinician do when a client becomes highly activated while discussing trauma?",
          options: [
            { text: "Push through the activation to complete the trauma narrative", isCorrect: false },
            { text: "Stop the session immediately and end early", isCorrect: false },
            { text: "Pause content discussion and help the client return to regulation", isCorrect: true },
            { text: "Change the subject to something pleasant", isCorrect: false }
          ],
          explanation: "When a client becomes dysregulated, the priority is helping them return to their window of tolerance before continuing with processing. Pushing through can be retraumatizing, while completely avoiding the material prevents progress."
        },
        {
          type: "resources",
          order: 7,
          title: "Clinical Tools & Resources",
          description: "Download these practical tools to use with your clients",
          resources: [
            {
              title: "Brain Structures Quick Reference Card",
              type: "card",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/brain-structures-card.pdf",
              size: "245 KB"
            },
            {
              title: "Window of Tolerance Worksheet",
              type: "worksheet",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/window-of-tolerance-worksheet.pdf",
              size: "312 KB"
            },
            {
              title: "Polyvagal State Assessment Checklist",
              type: "checklist",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/polyvagal-checklist.pdf",
              size: "198 KB"
            },
            {
              title: "Grounding Techniques Handout",
              type: "pdf",
              url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/neurobiology/grounding-techniques.pdf",
              size: "425 KB"
            }
          ]
        },
        {
          type: "reflection",
          order: 8,
          title: "Clinical Reflection: Integrating Neurobiology into Your Practice",
          prompt: "As you complete this course, consider: What is the most significant insight about trauma neurobiology that will change your clinical practice? How will you integrate neurobiological concepts into your assessment, psychoeducation, and intervention selection going forward? What's one specific change you'll make in your next session with a trauma client?",
          placeholder: "Reflect on how this course will influence your trauma-informed practice...",
          minLength: 150
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which approach is most appropriate when a client is in a hyperaroused state?",
          type: "multipleChoice",
          options: [
            { text: "Immediately begin trauma processing to resolve the activation", isCorrect: false },
            { text: "Use calming interventions and help them regulate before processing", isCorrect: true },
            { text: "Use activating interventions to increase their energy", isCorrect: false },
            { text: "End the session since they're not in a state to work", isCorrect: false }
          ],
          explanation: "When hyperaroused, clients need calming interventions to return to their window of tolerance before trauma processing can be effective and safe."
        },
        {
          question: "What is the primary principle behind neurobiologically-informed trauma treatment sequencing?",
          type: "multipleChoice",
          options: [
            { text: "Process first, then regulate", isCorrect: false },
            { text: "Regulate first, then process", isCorrect: true },
            { text: "Avoid all activation", isCorrect: false },
            { text: "Always use the same approach regardless of state", isCorrect: false }
          ],
          explanation: "'Regulate first, then process' reflects the understanding that trauma processing is only effective and safe when the client is within their window of tolerance."
        }
      ]
    }
  ],
  
  // =========================================================================
  // FINAL ASSESSMENT - 4 questions per section (20 total)
  // =========================================================================
  assessment: {
    title: "Final Assessment: The Neurobiology of Trauma",
    timeLimit: 45,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      // =====================================================================
      // SECTION 1: Introduction to Trauma Neurobiology (4 questions)
      // =====================================================================
      {
        question: "Which brain structure acts as the brain's 'alarm system' and is responsible for detecting threats?",
        type: "multipleChoice",
        section: 1,
        options: [
          { text: "Hippocampus", isCorrect: false },
          { text: "Amygdala", isCorrect: true },
          { text: "Prefrontal Cortex", isCorrect: false },
          { text: "Cerebellum", isCorrect: false }
        ],
        explanation: "The amygdala constantly scans for threats and triggers the fight-flight-freeze response."
      },
      {
        question: "According to the triune brain model, which region is primarily affected by trauma and processes emotions?",
        type: "multipleChoice",
        section: 1,
        options: [
          { text: "Reptilian brain (brainstem)", isCorrect: false },
          { text: "Mammalian brain (limbic system)", isCorrect: true },
          { text: "Neocortex (thinking brain)", isCorrect: false },
          { text: "Corpus callosum", isCorrect: false }
        ],
        explanation: "The limbic system, including the amygdala and hippocampus, is where trauma is primarily processed and stored."
      },
      {
        question: "What happens to the prefrontal cortex during a traumatic event?",
        type: "multipleChoice",
        section: 1,
        options: [
          { text: "It becomes hyperactive and processes information faster", isCorrect: false },
          { text: "It goes 'offline' and functioning decreases", isCorrect: true },
          { text: "It releases cortisol directly into the bloodstream", isCorrect: false },
          { text: "It strengthens connections with the amygdala", isCorrect: false }
        ],
        explanation: "During trauma, the prefrontal cortex goes 'offline' while the limbic system takes over, which is why people can't 'think their way out' of trauma responses."
      },
      {
        question: "Dan Siegel's 'Window of Tolerance' concept describes:",
        type: "multipleChoice",
        section: 1,
        options: [
          { text: "The amount of trauma a person can experience before developing PTSD", isCorrect: false },
          { text: "The optimal zone of arousal where a person can function effectively", isCorrect: true },
          { text: "The time period during which trauma memories can be changed", isCorrect: false },
          { text: "The brain's capacity to form new neural connections", isCorrect: false }
        ],
        explanation: "The Window of Tolerance describes the optimal zone of arousal where a person can think clearly, feel emotions without being overwhelmed, and respond flexibly."
      },

      // =====================================================================
      // SECTION 2: The Stress Response System (4 questions)
      // =====================================================================
      {
        question: "What does HPA stand for in the HPA axis?",
        type: "multipleChoice",
        section: 2,
        options: [
          { text: "Hypothalamic-Pituitary-Adrenal", isCorrect: true },
          { text: "Hippocampal-Prefrontal-Amygdala", isCorrect: false },
          { text: "Hormonal-Physiological-Adaptive", isCorrect: false },
          { text: "Hyperarousal-Processing-Activation", isCorrect: false }
        ],
        explanation: "The HPA axis (Hypothalamic-Pituitary-Adrenal) is the body's central hormonal stress response system."
      },
      {
        question: "Which hormone, released by the adrenal glands during stress, can damage the hippocampus when chronically elevated?",
        type: "multipleChoice",
        section: 2,
        options: [
          { text: "Dopamine", isCorrect: false },
          { text: "Serotonin", isCorrect: false },
          { text: "Cortisol", isCorrect: true },
          { text: "Oxytocin", isCorrect: false }
        ],
        explanation: "Cortisol, released during the stress response, can damage the hippocampus when chronically elevated, impairing memory and emotional regulation."
      },
      {
        question: "According to Polyvagal Theory, which response is associated with dissociation and shutdown?",
        type: "multipleChoice",
        section: 2,
        options: [
          { text: "Fight response (sympathetic activation)", isCorrect: false },
          { text: "Flight response (sympathetic activation)", isCorrect: false },
          { text: "Dorsal vagal response (freeze/collapse)", isCorrect: true },
          { text: "Ventral vagal response (social engagement)", isCorrect: false }
        ],
        explanation: "The dorsal vagal response causes immobilization, dissociation, and shutdown when fight or flight seem impossible."
      },
      {
        question: "Which of the following is a characteristic of the flight response?",
        type: "multipleChoice",
        section: 2,
        options: [
          { text: "Clenched fists and aggressive posture", isCorrect: false },
          { text: "Numbness and emotional detachment", isCorrect: false },
          { text: "Restlessness, fidgeting, and urge to escape", isCorrect: true },
          { text: "Slowed heart rate and shallow breathing", isCorrect: false }
        ],
        explanation: "The flight response is characterized by restlessness, fidgeting, scanning for exits, and an overwhelming urge to escape."
      },

      // =====================================================================
      // SECTION 3: Trauma and Memory (4 questions)
      // =====================================================================
      {
        question: "Why do traumatic memories often lack temporal context (feeling like 'now' rather than 'then')?",
        type: "multipleChoice",
        section: 3,
        options: [
          { text: "Because the person doesn't want to remember", isCorrect: false },
          { text: "Because the hippocampus is suppressed during trauma and can't time-stamp memories", isCorrect: true },
          { text: "Because traumatic events are always more recent", isCorrect: false },
          { text: "Because the amygdala actively erases time information", isCorrect: false }
        ],
        explanation: "High cortisol during trauma suppresses hippocampal function, preventing proper contextualization of memories in time and space."
      },
      {
        question: "Which type of memory remains intact during trauma and is responsible for flashbacks?",
        type: "multipleChoice",
        section: 3,
        options: [
          { text: "Explicit (declarative) memory", isCorrect: false },
          { text: "Implicit (non-declarative) memory", isCorrect: true },
          { text: "Working memory", isCorrect: false },
          { text: "Semantic memory", isCorrect: false }
        ],
        explanation: "Implicit memory (emotional, sensory, procedural) remains intact and is often enhanced during trauma while explicit memory is impaired."
      },
      {
        question: "What is memory reconsolidation?",
        type: "multipleChoice",
        section: 3,
        options: [
          { text: "The initial formation of a new memory", isCorrect: false },
          { text: "Completely erasing traumatic memories from the brain", isCorrect: false },
          { text: "A window after memory reactivation when it becomes unstable and can be modified", isCorrect: true },
          { text: "The natural forgetting of memories over time", isCorrect: false }
        ],
        explanation: "Memory reconsolidation is the process by which reactivated memories become temporarily unstable and can be modified with new information before being re-stored."
      },
      {
        question: "Triggers for trauma responses are created by which brain structure's learning system?",
        type: "multipleChoice",
        section: 3,
        options: [
          { text: "Hippocampus", isCorrect: false },
          { text: "Prefrontal cortex", isCorrect: false },
          { text: "Amygdala", isCorrect: true },
          { text: "Cerebellum", isCorrect: false }
        ],
        explanation: "Triggers are created by the amygdala's threat-learning system, which operates on association rather than logic, marking any cue associated with trauma as potentially dangerous."
      },

      // =====================================================================
      // SECTION 4: Neuroplasticity and Recovery (4 questions)
      // =====================================================================
      {
        question: "What does Hebb's Law ('neurons that fire together, wire together') imply about trauma recovery?",
        type: "multipleChoice",
        section: 4,
        options: [
          { text: "Recovery is impossible once neural pathways are formed", isCorrect: false },
          { text: "New experiences can create new neural pathways, enabling change", isCorrect: true },
          { text: "Only medication can change brain wiring", isCorrect: false },
          { text: "Trauma permanently damages all neurons involved", isCorrect: false }
        ],
        explanation: "Hebb's Law means that repeated new experiences can strengthen adaptive neural pathways, just as trauma strengthened maladaptive ones—providing the basis for recovery."
      },
      {
        question: "Which approach to trauma treatment works 'from the body up' rather than 'from the mind down'?",
        type: "multipleChoice",
        section: 4,
        options: [
          { text: "Top-down approach", isCorrect: false },
          { text: "Bottom-up approach", isCorrect: true },
          { text: "Cognitive-only approach", isCorrect: false },
          { text: "Psychoanalytic approach", isCorrect: false }
        ],
        explanation: "Bottom-up approaches work with the body and nervous system directly (body → limbic system → cortex), while top-down approaches work from cognition down."
      },
      {
        question: "Which of the following is one of the most powerful promoters of neuroplasticity?",
        type: "multipleChoice",
        section: 4,
        options: [
          { text: "Medication alone", isCorrect: false },
          { text: "Avoiding all stress", isCorrect: false },
          { text: "Physical exercise", isCorrect: true },
          { text: "Social isolation", isCorrect: false }
        ],
        explanation: "Exercise is one of the most powerful promoters of neuroplasticity, increasing BDNF (brain-derived neurotrophic factor) and promoting hippocampal neurogenesis."
      },
      {
        question: "Research on trauma therapy has shown that effective treatment produces:",
        type: "multipleChoice",
        section: 4,
        options: [
          { text: "No measurable changes in the brain", isCorrect: false },
          { text: "Measurable changes in brain structure and function", isCorrect: true },
          { text: "Permanent damage to the prefrontal cortex", isCorrect: false },
          { text: "Increased amygdala reactivity", isCorrect: false }
        ],
        explanation: "Studies using brain imaging have documented that effective trauma therapy produces measurable improvements in brain function, including normalized amygdala activity and improved prefrontal cortex functioning."
      },

      // =====================================================================
      // SECTION 5: Clinical Applications (4 questions)
      // =====================================================================
      {
        question: "What is the clinical principle 'regulate first, then process' based on?",
        type: "multipleChoice",
        section: 5,
        options: [
          { text: "Processing is only effective when the client is within their window of tolerance", isCorrect: true },
          { text: "Clients should always be in a hyperaroused state for processing", isCorrect: false },
          { text: "Regulation is the same as avoidance", isCorrect: false },
          { text: "Processing should happen regardless of nervous system state", isCorrect: false }
        ],
        explanation: "Trauma processing is most effective and safe when the client is regulated (within their window of tolerance). Trying to process when dysregulated can be retraumatizing."
      },
      {
        question: "When a client is in a dissociated (hypoaroused) state, which intervention is MOST appropriate?",
        type: "multipleChoice",
        section: 5,
        options: [
          { text: "Deep relaxation and guided meditation", isCorrect: false },
          { text: "Immediately processing traumatic memories", isCorrect: false },
          { text: "Gentle movement and sensory engagement", isCorrect: true },
          { text: "Ending the session early", isCorrect: false }
        ],
        explanation: "When hypoaroused/dissociated, gentle activation is needed—movement, sensory engagement, and orienting. Deep relaxation can actually increase dissociation."
      },
      {
        question: "Which metaphor is commonly used to explain amygdala functioning to clients?",
        type: "multipleChoice",
        section: 5,
        options: [
          { text: "Filing cabinet", isCorrect: false },
          { text: "Smoke detector", isCorrect: true },
          { text: "Computer hard drive", isCorrect: false },
          { text: "Traffic light", isCorrect: false }
        ],
        explanation: "The 'smoke detector' metaphor helps clients understand how their amygdala has become overly sensitive: 'Your smoke detector got set too sensitive after a kitchen fire. Now it goes off even when you're just making toast.'"
      },
      {
        question: "Why is psychoeducation about the brain therapeutic for trauma clients?",
        type: "multipleChoice",
        section: 5,
        options: [
          { text: "It makes clients feel intellectually superior", isCorrect: false },
          { text: "It reduces shame by normalizing symptoms as brain responses, not character flaws", isCorrect: true },
          { text: "It replaces the need for other interventions", isCorrect: false },
          { text: "It increases client dependency on the therapist", isCorrect: false }
        ],
        explanation: "Psychoeducation reduces shame ('there's nothing wrong with you—your brain is doing what it was designed to do'), externalizes the problem, and instills hope through understanding neuroplasticity."
      }
    ]
  }
};

// ============================================================================
// UPDATE FUNCTION
// ============================================================================
const updateCourse = async () => {
  await connectDB();
  
  try {
    // Calculate totals
    neurobiologyCourse.totalEstimatedTime = neurobiologyCourse.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
    neurobiologyCourse.totalContentBlocks = neurobiologyCourse.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
    neurobiologyCourse.totalQuizQuestions = neurobiologyCourse.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) 
      + (neurobiologyCourse.assessment?.questions?.length || 0);
    
    // Update in both collections
    const result1 = await mongoose.connection.db.collection('interactivecourses').findOneAndUpdate(
      { slug: neurobiologyCourse.slug },
      { $set: neurobiologyCourse },
      { upsert: true, returnDocument: 'after' }
    );
    
    const result2 = await mongoose.connection.db.collection('courses').findOneAndUpdate(
      { slug: neurobiologyCourse.slug },
      { $set: neurobiologyCourse },
      { upsert: true, returnDocument: 'after' }
    );
    
    console.log('\n✅ Neurobiology of Trauma course updated!');
    console.log(`   Title: ${neurobiologyCourse.title}`);
    console.log(`   CE Hours: ${neurobiologyCourse.ceHours}`);
    console.log(`   Total Estimated Time: ${neurobiologyCourse.totalEstimatedTime} minutes`);
    console.log(`   Sections: ${neurobiologyCourse.sections.length}`);
    console.log(`   Content Blocks: ${neurobiologyCourse.totalContentBlocks}`);
    console.log(`   Assessment Questions: ${neurobiologyCourse.assessment.questions.length}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error updating course:', error.message);
  }
  
 await mongoose.disconnect();
};

updateCourse().catch(err => {
  console.error('Update error:', err);
  process.exit(1);
});
