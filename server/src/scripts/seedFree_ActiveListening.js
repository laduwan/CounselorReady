/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUG = 'active-listening-skills';

const COURSE = {
  title: "Active Listening: The Foundation of Effective Therapy",
  slug: SLUG,
  courseCode: "CR-102",
  description: "Active listening is the bedrock skill upon which all effective therapy is built. This 1-hour continuing education course moves beyond introductory descriptions to examine the science and practice of therapeutic listening. Clinicians will explore physical attending behaviors, the hierarchy of reflective skills, advanced empathic responding, and common listening errors—with an emphasis on cultural responsiveness and the research linking listening quality to therapeutic outcomes.",
  ceHours: 1,
  ceuHours: 1,
  ceuEligible: true,
  ceCategory: "Clinical",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  accessType: "free",
  price: 0,
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  level: "Introductory",
  deliveryMethod: "Asynchronous Online",
  objectives: [
    "Identify the components of physical and psychological attending and their impact on the therapeutic relationship",
    "Apply a hierarchy of reflective skills—from paraphrasing to reflection of meaning—with clinical precision",
    "Demonstrate effective use of clarification, summarization, and strategic silence",
    "Recognize common listening errors and their impact on client experience",
    "Adapt attending and listening skills for cultural responsiveness"
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Counselors-in-Training under supervision"
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia"
  },
  references: [
    { title: "The skilled helper: A problem-management and opportunity-development approach (11th ed.)", author: "Egan, G., & Reese, R. J.", year: 2019, source: "Cengage Learning" },
    { title: "Intentional interviewing and counseling (9th ed.)", author: "Ivey, A. E., Ivey, M. B., & Zalaquett, C. P.", year: 2018, source: "Cengage Learning" },
    { title: "On becoming a person: A therapist's view of psychotherapy", author: "Rogers, C. R.", year: 1961, source: "Houghton Mifflin" },
    { title: "Therapeutic communication (2nd ed.)", author: "Wachtel, P. L.", year: 2011, source: "Guilford Press" },
    { title: "Helping skills: Facilitating exploration, insight, and action (5th ed.)", author: "Hill, C. E.", year: 2020, source: "American Psychological Association" },
    { title: "Motivational interviewing: Helping people change (3rd ed.)", author: "Miller, W. R., & Rollnick, S.", year: 2013, source: "Guilford Press" }
  ],
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  sections: [
    // ─── SECTION 1 ──────────────────────────────────
    {
      title: "The Art of Attending: Creating a Facilitative Presence",
      description: "Physical and psychological attending, the SOLER model, and cultural considerations",
      module: "Module 1: Attending",
      order: 1,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Why Attending Matters</h2>
<p>Before a single word of therapeutic intervention is spoken, the clinician's physical and psychological presence communicates volumes. Research on therapeutic alliance consistently demonstrates that clients' perceptions of being heard and understood are among the strongest predictors of treatment outcome—regardless of theoretical orientation. Lambert's (2013) meta-analytic work estimates that common factors, particularly the therapeutic relationship, account for approximately 30% of outcome variance, while specific techniques account for only about 15%. The way a clinician listens may matter more than what they say.</p>
<p>Attending is the foundation upon which all other clinical skills are built. Without effective attending, reflections miss the mark, interpretations fall flat, and interventions feel mechanical. Gerard Egan's model of attending—widely taught in counselor education—distinguishes between <strong>physical attending</strong> (the observable behaviors that communicate presence) and <strong>psychological attending</strong> (the internal state of focused, non-judgmental awareness). Both are necessary; neither alone is sufficient.</p>
<h2>The SOLER Model and Beyond</h2>
<p>Egan's SOLER acronym provides a useful starting framework for physical attending: <strong>S</strong>quare facing (orienting your body toward the client), <strong>O</strong>pen posture (uncrossed arms and legs communicating receptivity), <strong>L</strong>eaning forward slightly (conveying engagement), <strong>E</strong>ye contact (appropriate, culturally sensitive visual connection), and <strong>R</strong>elaxed presence (communicating comfort rather than tension). Later, Egan and Reese (2019) expanded this to SOLVER, adding <strong>V</strong>isibly attending—being intentional about demonstrating through observable behavior that you are tracking the client's communication.</p>
<p>While SOLER provides a useful starting point, experienced clinicians recognize that rigid adherence to any attending formula can itself become a barrier to genuine presence. A clinician who is mentally running through a checklist of attending behaviors is not fully present with the client. The goal is to internalize these behaviors so thoroughly that they become automatic, freeing the clinician's conscious attention for the more demanding work of tracking content, emotion, meaning, and process simultaneously.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Research on therapeutic outcomes suggests that common factors, particularly the therapeutic relationship, account for approximately what percentage of outcome variance?",
          options: [
            { text: "5%", isCorrect: false },
            { text: "15%", isCorrect: false },
            { text: "30%", isCorrect: true },
            { text: "60%", isCorrect: false }
          ],
          explanation: "Lambert's meta-analytic work estimates that common factors—especially the therapeutic relationship—account for approximately 30% of outcome variance, while specific techniques account for only about 15%. This underscores why listening skills matter so much."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Cultural Considerations in Attending</h2>
<p>The SOLER model was developed within a Western cultural framework, and its universal application can be problematic. Eye contact norms vary significantly across cultures. In many Native American, African, Asian, and Latino cultures, sustained direct eye contact with an authority figure may be considered disrespectful rather than engaged. Similarly, physical proximity, touch, and body orientation carry different meanings across cultural contexts. A clinician who insists on maintaining steady eye contact with a client from a culture where averted gaze signals respect may inadvertently create discomfort and rupture the developing alliance.</p>
<p><strong>Psychological attending</strong>—the internal state of focused awareness—is arguably more important than any specific physical behavior. Carl Rogers (1961) described this quality as the therapist's capacity to "enter the private perceptual world of the other and become thoroughly at home in it." This requires temporarily setting aside one's own frame of reference, suspending judgment, and committing one's full cognitive and emotional resources to understanding the client's experience from the inside out. It is an active, demanding, disciplined practice—not the passive receptivity that the word "listening" might suggest.</p>
<p>Psychological attending also requires managing one's own internal noise. The clinician's personal worries, hunger, fatigue, reactions to the client, and premature hypotheses all compete for attention. Mindfulness research suggests that the capacity for sustained, focused attention is trainable—and that clinicians who cultivate a personal mindfulness practice demonstrate improved therapeutic presence and empathic accuracy.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "A clinician working with a client from a culture where direct eye contact with authority figures is considered disrespectful should:",
          options: [
            { text: "Insist on eye contact as a necessary component of therapeutic engagement", isCorrect: false },
            { text: "Adapt attending behaviors to align with the client's cultural norms while maintaining psychological presence", isCorrect: true },
            { text: "Avoid all eye contact throughout the session", isCorrect: false },
            { text: "Explain that Western attending norms are therapeutically necessary", isCorrect: false }
          ],
          explanation: "Cultural humility in attending means adapting physical behaviors to the client's cultural context. The SOLER model is a starting framework, not a universal prescription. Psychological attending—genuine internal presence—matters more than any specific physical behavior."
        },
        {
          type: "accordion",
          order: 5,
          title: "Deepening Your Attending Practice",
          accordionItems: [
            {
              title: "The Therapist's Internal Noise",
              content: "Every clinician brings internal noise into sessions—personal worries, physical discomfort, emotional reactions to the client, countertransference, and the temptation to plan interventions rather than listen. Managing this noise is not about eliminating it (which is impossible) but about noticing it and gently redirecting attention to the client. When you notice your mind has wandered, the simple act of returning attention—without self-criticism—is itself a practice of psychological attending."
            },
            {
              title: "Mindfulness and Therapeutic Presence",
              content: "Research by Geller and Greenberg (2012) on therapeutic presence demonstrates that therapists who practice mindfulness meditation show improved empathic accuracy, more attuned emotional responsiveness, and stronger therapeutic alliances. The mechanism is straightforward: mindfulness trains exactly the kind of sustained, non-judgmental attention that effective attending requires. Even brief daily mindfulness practice (10-15 minutes) can enhance a clinician's capacity for therapeutic presence."
            },
            {
              title: "Attending in Telehealth Settings",
              content: "Telehealth creates unique attending challenges. The camera angle, screen position, and physical environment all affect the client's experience of the clinician's presence. Best practices include: positioning the camera at eye level, looking at the camera (not the screen) when speaking to simulate eye contact, minimizing on-screen distractions, ensuring adequate lighting on your face, and using slightly exaggerated head nods and facial expressions to compensate for the flattening effect of video."
            }
          ]
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each SOLER component with its meaning:",
          matchingPairs: [
            { term: "S - Squarely face", definition: "Orient your body toward the client to communicate engagement" },
            { term: "O - Open posture", definition: "Uncrossed arms and legs signaling receptivity and accessibility" },
            { term: "L - Lean forward", definition: "Slight forward lean conveying interest and involvement" },
            { term: "E - Eye contact", definition: "Culturally appropriate visual connection demonstrating attention" },
            { term: "R - Relaxed", definition: "Comfortable, natural presence rather than tense or rigid positioning" }
          ]
        },
        {
          type: "reflection",
          order: 7,
          question: "Think about a recent session where you felt fully present with a client, and one where you were distracted. What internal or external factors contributed to the difference? What specific practices might help you cultivate more consistent psychological attending?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The 'V' in Egan's expanded SOLVER model stands for:",
          type: "multipleChoice",
          options: [
            { text: "Verbal tracking", isCorrect: false },
            { text: "Visibly attending", isCorrect: true },
            { text: "Validating the client", isCorrect: false },
            { text: "Voice modulation", isCorrect: false }
          ],
          explanation: "Egan and Reese (2019) expanded SOLER to SOLVER, adding 'V' for Visibly attending—being intentional about demonstrating through observable behavior that you are tracking the client's communication."
        },
        {
          question: "Psychological attending, as described by Rogers, involves:",
          type: "multipleChoice",
          options: [
            { text: "Maintaining a rigid physical posture", isCorrect: false },
            { text: "Entering the client's private perceptual world and setting aside one's own frame of reference", isCorrect: true },
            { text: "Planning the next intervention while the client speaks", isCorrect: false },
            { text: "Focusing primarily on diagnostic assessment", isCorrect: false }
          ],
          explanation: "Rogers described psychological attending as entering the client's private perceptual world 'and becoming thoroughly at home in it'—temporarily suspending one's own frame of reference to understand the client's experience from the inside."
        },
        {
          question: "The SOLER model should be applied:",
          type: "multipleChoice",
          options: [
            { text: "Rigidly and identically with every client", isCorrect: false },
            { text: "As a starting framework adapted for cultural context and individual client needs", isCorrect: true },
            { text: "Only with clients from Western cultures", isCorrect: false },
            { text: "Only during intake sessions", isCorrect: false }
          ],
          explanation: "SOLER provides a useful starting framework, but rigid universal application is problematic. Eye contact, proximity, and body orientation carry different meanings across cultures—effective attending adapts to the client's context."
        },
        {
          question: "Research on mindfulness and therapeutic presence shows that therapists who practice mindfulness demonstrate:",
          type: "multipleChoice",
          options: [
            { text: "No measurable improvement in clinical skills", isCorrect: false },
            { text: "Improved empathic accuracy, emotional attunement, and stronger alliances", isCorrect: true },
            { text: "Better diagnostic accuracy only", isCorrect: false },
            { text: "Faster session pace", isCorrect: false }
          ],
          explanation: "Geller and Greenberg's research demonstrates that mindfulness practice trains exactly the kind of sustained, non-judgmental attention that effective attending requires, leading to improved empathic accuracy, emotional responsiveness, and alliance quality."
        },
        {
          question: "When a clinician notices their mind has wandered during a session, the best response is to:",
          type: "multipleChoice",
          options: [
            { text: "Criticize themselves for not paying attention", isCorrect: false },
            { text: "Gently redirect attention to the client without self-criticism", isCorrect: true },
            { text: "End the session early", isCorrect: false },
            { text: "Disclose the distraction to the client immediately", isCorrect: false }
          ],
          explanation: "Managing internal noise is about noticing when attention has wandered and gently redirecting it—without self-criticism. This is itself a practice of psychological attending, parallel to the non-judgmental awareness cultivated in mindfulness practice."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 2 ──────────────────────────────────
    {
      title: "The Hierarchy of Reflective Skills",
      description: "Paraphrasing, reflection of feeling, reflection of meaning, and advanced empathic responding",
      module: "Module 2: Reflection",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>From Paraphrasing to Reflection of Meaning</h2>
<p>Reflective skills exist on a hierarchy of depth, and understanding this hierarchy is essential for deploying the right level of reflection at the right moment. At the most basic level, <strong>paraphrasing</strong> (or reflection of content) involves restating the essence of the client's communication in the clinician's own words. A good paraphrase is concise, accurate, and demonstrates that the clinician has tracked the factual content of what was said. It is not parroting—which involves repeating the client's exact words back to them—but a genuine restatement that confirms understanding: "So you've been applying for jobs for three months without getting any callbacks."</p>
<p><strong>Reflection of feeling</strong> moves beyond content to name the emotional experience underlying the client's communication. This requires the clinician to listen not just to what the client is saying, but to how they are saying it—attending to tone, pace, facial expression, body language, and the emotional subtext that may not be explicitly stated. A skilled reflection of feeling captures both the emotion and its intensity: "You're not just disappointed—you're starting to feel hopeless about the whole job search." The accuracy of the feeling word and the precision of intensity are what distinguish a helpful reflection from one that misses the mark.</p>
<p><strong>Reflection of meaning</strong> is the deepest level of the reflective hierarchy. It connects the client's feelings and experiences to their underlying values, beliefs, and sense of significance. When a clinician reflects meaning, they are communicating understanding not just of what happened and how the client feels, but of what it means to them—why it matters in the context of their life narrative and personal values: "The job rejection isn't just about the job—it's challenging your belief that hard work pays off, a value that has been central to how you see yourself."</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "A client says: 'I've been trying to get my mother to listen to me for thirty years.' Which response best illustrates reflection of meaning?",
          options: [
            { text: "'You've been trying to communicate with your mother for a long time.'", isCorrect: false },
            { text: "'That sounds really frustrating.'", isCorrect: false },
            { text: "'Being heard by your mother represents something fundamental about whether you matter in your own family.'", isCorrect: true },
            { text: "'Have you tried different approaches to communicating with her?'", isCorrect: false }
          ],
          explanation: "Reflection of meaning connects feelings to underlying values and significance. The correct response captures not just the content (trying to communicate) or the feeling (frustration) but the deeper meaning—what being heard by her mother represents about her worth and belonging."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Advanced Empathic Responding</h2>
<p>Rogers identified <strong>empathy</strong> as one of the three core conditions for therapeutic change, alongside unconditional positive regard and congruence. But Rogers' concept of empathy was far more sophisticated than the popular understanding suggests. He described empathic understanding as sensing "the client's private world as if it were your own, but without ever losing the 'as if' quality." This "as if" distinction is critical: empathy requires entering the client's experience without losing oneself in it—a balance that distinguishes therapeutic empathy from emotional fusion or sympathy.</p>
<p><strong>Additive empathy</strong> goes beyond reflecting what the client has explicitly communicated to articulate what the client is experiencing but has not yet put into words. This is the clinical application of what Rogers called "sensing meanings of which the client is scarcely aware." Additive empathy might sound like: "I notice that when you talk about your success at work, your voice gets quieter and you look away—as if part of you isn't sure you deserve it." This kind of response can be powerfully deepening when accurate, and deeply rupturing when off-base. It requires a strong foundation of trust and careful calibration to the client's readiness.</p>
<p>Miller and Rollnick (2013), in their Motivational Interviewing framework, distinguish between <strong>simple reflections</strong> (staying close to what the client has said) and <strong>complex reflections</strong> (adding meaning, continuing the paragraph, or making a guess about what the client has not yet said). They note that a higher ratio of complex to simple reflections is a marker of clinical proficiency and is associated with better client outcomes. The skilled clinician moves fluidly between simple and complex reflections based on the moment-to-moment needs of the therapeutic conversation.</p>`
        },
        {
          type: "matching",
          order: 4,
          matchingInstructions: "Match each reflective skill with its definition and clinical function:",
          matchingPairs: [
            { term: "Paraphrasing", definition: "Restating the factual content in clinician's own words to confirm understanding" },
            { term: "Reflection of feeling", definition: "Naming the emotional experience underlying the client's communication with appropriate intensity" },
            { term: "Reflection of meaning", definition: "Connecting feelings to underlying values, beliefs, and personal significance" },
            { term: "Additive empathy", definition: "Articulating what the client is experiencing but has not yet put into words" },
            { term: "Complex reflection (MI)", definition: "Adding meaning or continuing the paragraph beyond what the client explicitly stated" }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Rogers' concept of therapeutic empathy requires:",
          options: [
            { text: "Feeling exactly what the client feels without any distance", isCorrect: false },
            { text: "Sensing the client's private world as if it were your own while maintaining the 'as if' quality", isCorrect: true },
            { text: "Sympathizing with the client's situation", isCorrect: false },
            { text: "Agreeing with the client's perspective on their problems", isCorrect: false }
          ],
          explanation: "Rogers distinguished empathy from emotional fusion by emphasizing the 'as if' quality—entering the client's experience without losing oneself in it. This maintains the therapeutic stance that allows the clinician to be helpful rather than overwhelmed."
        },
        {
          type: "accordion",
          order: 6,
          title: "Common Reflection Errors",
          accordionItems: [
            {
              title: "Parroting vs. Paraphrasing",
              content: "Parroting—repeating the client's exact words back to them—is one of the most common errors beginning clinicians make. It creates the impression of a tape recorder rather than a thinking, feeling human being who is genuinely working to understand. Effective paraphrasing involves genuine cognitive processing: taking in the client's words, extracting the essential meaning, and expressing that meaning in your own language. The shift from parroting to genuine paraphrasing marks a significant developmental milestone in clinician training."
            },
            {
              title: "Undershooting and Overshooting Emotion",
              content: "Reflections of feeling can miss the mark in two directions. Undershooting—using a word that is too weak for the client's emotional experience (saying 'annoyed' when the client is 'enraged')—communicates that the clinician doesn't fully grasp the depth of the experience. Overshooting—using a word that is too strong (saying 'devastated' when the client is 'disappointed')—can feel invalidating in a different way, as if the clinician is dramatizing or mischaracterizing the experience. Calibrating emotional intensity is a skill that develops with practice and honest feedback."
            },
            {
              title: "The Question Trap",
              content: "Many clinicians default to asking questions when they should be reflecting. While questions have their place, an over-reliance on questions creates an interrogation-like dynamic that places the clinician in the expert position and the client in the respondent position. Research in Motivational Interviewing shows that a higher reflection-to-question ratio is associated with better outcomes. As a general guideline, aim for at least two reflections for every question asked."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "In Motivational Interviewing research, which pattern is associated with better client outcomes?",
          options: [
            { text: "More questions than reflections", isCorrect: false },
            { text: "Equal numbers of questions and reflections", isCorrect: false },
            { text: "A higher ratio of complex reflections to simple reflections", isCorrect: true },
            { text: "Avoiding reflections entirely in favor of interpretations", isCorrect: false }
          ],
          explanation: "MI research identifies a higher ratio of complex to simple reflections as a marker of clinical proficiency associated with better outcomes. Complex reflections add meaning beyond what the client explicitly stated."
        },
        {
          type: "reflection",
          order: 8,
          question: "Think about your own reflection skills. Do you tend toward paraphrasing, reflection of feeling, or reflection of meaning? Where on the hierarchy do you feel most comfortable, and where do you want to develop? Consider recording a practice session (with consent) and counting your reflection types."
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The key difference between paraphrasing and parroting is:",
          type: "multipleChoice",
          options: [
            { text: "Paraphrasing uses the client's exact words; parroting uses the clinician's words", isCorrect: false },
            { text: "Paraphrasing involves cognitive processing to restate meaning in the clinician's own words", isCorrect: true },
            { text: "There is no meaningful difference", isCorrect: false },
            { text: "Parroting is more effective clinically", isCorrect: false }
          ],
          explanation: "Paraphrasing involves genuine cognitive processing—extracting meaning from the client's words and expressing it in the clinician's own language. Parroting merely repeats the client's exact words, creating a tape-recorder effect."
        },
        {
          question: "Additive empathy involves:",
          type: "multipleChoice",
          options: [
            { text: "Simply repeating what the client said", isCorrect: false },
            { text: "Articulating experiences the client is having but has not yet verbalized", isCorrect: true },
            { text: "Agreeing with everything the client says", isCorrect: false },
            { text: "Adding your own opinions to the client's narrative", isCorrect: false }
          ],
          explanation: "Additive empathy goes beyond reflecting explicit content to sense and articulate what the client is experiencing at the edge of their awareness—what Rogers called 'sensing meanings of which the client is scarcely aware.'"
        },
        {
          question: "'Undershooting' in reflection of feeling means:",
          type: "multipleChoice",
          options: [
            { text: "Using an emotion word that is too weak for the client's actual experience", isCorrect: true },
            { text: "Using an emotion word that is too strong", isCorrect: false },
            { text: "Reflecting content instead of feeling", isCorrect: false },
            { text: "Asking a question instead of reflecting", isCorrect: false }
          ],
          explanation: "Undershooting uses a feeling word that underestimates the client's emotional intensity (e.g., 'annoyed' when they are 'enraged'), communicating that the clinician hasn't fully grasped the depth of the experience."
        },
        {
          question: "A recommended guideline for the reflection-to-question ratio is:",
          type: "multipleChoice",
          options: [
            { text: "One reflection for every three questions", isCorrect: false },
            { text: "At least two reflections for every question asked", isCorrect: true },
            { text: "Questions and reflections should be equal", isCorrect: false },
            { text: "Only use reflections, never questions", isCorrect: false }
          ],
          explanation: "MI research and clinical best practice suggest aiming for at least a 2:1 reflection-to-question ratio. Over-reliance on questions creates an interrogation dynamic that undermines the collaborative therapeutic relationship."
        },
        {
          question: "Rogers' three core conditions for therapeutic change are:",
          type: "multipleChoice",
          options: [
            { text: "Assessment, diagnosis, and treatment planning", isCorrect: false },
            { text: "Empathy, unconditional positive regard, and congruence", isCorrect: true },
            { text: "Attending, reflecting, and summarizing", isCorrect: false },
            { text: "Challenge, support, and confrontation", isCorrect: false }
          ],
          explanation: "Rogers identified empathy, unconditional positive regard (accepting the client without conditions), and congruence (therapist genuineness) as the necessary and sufficient conditions for therapeutic personality change."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 3 ──────────────────────────────────
    {
      title: "Clarifying, Summarizing, and the Discipline of Silence",
      description: "Advanced listening skills, common errors, and building a deliberate listening practice",
      module: "Module 3: Advanced Skills",
      order: 3,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Art of Clarification</h2>
<p>Clarification serves a dual purpose: it ensures accurate understanding and communicates to the client that the clinician cares enough about precision to ask. Effective clarifying questions are <strong>brief, specific, and arise from genuine uncertainty</strong> rather than from a desire to redirect the conversation. "When you say your partner 'shut down,' can you help me understand what that looked like?" is a clarifying question that deepens understanding. "Did your partner shut down because they were angry?" is a leading question disguised as clarification that imposes the clinician's hypothesis.</p>
<p>The distinction between <strong>open and closed questions</strong> is fundamental to clinical communication. Open questions invite exploration and expansion: "What was that experience like for you?" Closed questions seek specific information and can typically be answered in a word or two: "How many times has this happened?" Both have their place, but beginning clinicians often default to closed questions because they feel safer and more controlled. The paradox is that the clinician who asks fewer, better questions and reflects more often typically gathers richer clinical information than one who conducts a rapid-fire interview.</p>
<h2>Summarization: Creating Coherence</h2>
<p>Summarization is among the most powerful and underutilized listening skills. Where a reflection captures a moment, a summary captures a pattern, a theme, or the arc of a narrative. Effective summaries serve several clinical functions: they demonstrate sustained attention across time, they organize disparate material into coherent themes, they help clients see connections they may have missed, and they create natural transition points in the session.</p>
<p>Miller and Rollnick (2013) identify three types of summaries: <strong>collecting summaries</strong> (gathering together several things the client has said), <strong>linking summaries</strong> (connecting current material to something said earlier), and <strong>transitional summaries</strong> (wrapping up one topic and bridging to the next). Skilled clinicians use all three types strategically throughout sessions. A well-timed collecting summary in the middle of a session can be remarkably validating: "Let me make sure I'm tracking everything you've shared. You're dealing with the stress of the new job, the distance you're feeling from your partner, and the grief that's resurfaced since your father's anniversary. That's a lot to be carrying."</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Which of the following is the best example of an effective clarifying question?",
          options: [
            { text: "'Did that make you angry?'", isCorrect: false },
            { text: "'When you say your partner shut down, can you help me understand what that looked like?'", isCorrect: true },
            { text: "'Why did you react that way?'", isCorrect: false },
            { text: "'Don't you think you should have responded differently?'", isCorrect: false }
          ],
          explanation: "Effective clarification is brief, specific, and arises from genuine uncertainty. It invites the client to expand on their experience without imposing the clinician's framework. The correct response asks for elaboration without leading."
        },
        {
          type: "matching",
          order: 3,
          matchingInstructions: "Match each summary type (from Miller & Rollnick) with its function:",
          matchingPairs: [
            { term: "Collecting summary", definition: "Gathering together several things the client has said into one statement" },
            { term: "Linking summary", definition: "Connecting current material to something the client said earlier in the session or in previous sessions" },
            { term: "Transitional summary", definition: "Wrapping up one topic and creating a bridge to the next area of discussion" }
          ]
        },
        {
          type: "text",
          order: 4,
          textContent: `<h2>Silence as a Clinical Intervention</h2>
<p>Perhaps no listening skill is as undervalued—or as anxiety-provoking for clinicians—as <strong>therapeutic silence</strong>. In a culture that equates silence with awkwardness, many clinicians feel compelled to fill every pause. Yet silence serves multiple clinical functions: it gives clients space to process emotions, formulate thoughts, and sit with difficult material. It communicates that the clinician is comfortable with whatever the client is experiencing. And it often elicits deeper material than any question could—because the client, given space, will frequently go to the place that matters most.</p>
<p>There are different types of therapeutic silence. <strong>Reflective silence</strong> follows a powerful reflection or interpretation, giving the client time to absorb and respond. <strong>Expectant silence</strong> communicates that the clinician is waiting for the client to continue and trusts the client's capacity to do so. <strong>Processing silence</strong> occurs naturally when a client is working through something internally. The clinician's task in all cases is to resist the urge to rescue the client from the discomfort of silence, while also remaining attuned to whether the silence is productive or whether the client is stuck and needs support.</p>
<h2>Common Listening Errors</h2>
<p>Even experienced clinicians fall into predictable listening traps. <strong>Premature problem-solving</strong>—jumping to solutions before the client feels fully heard—is perhaps the most common error, particularly among clinicians who feel pressured to demonstrate their expertise or who are uncomfortable sitting with a client's pain. <strong>Autobiographical listening</strong>—filtering the client's experience through one's own similar experiences—substitutes the clinician's story for the client's. <strong>Evaluative listening</strong>—mentally judging whether the client's responses are "right" or "healthy"—creates a subtle but palpable atmosphere of assessment rather than acceptance. And <strong>rehearsal listening</strong>—planning what to say next while the client is still speaking—diverts attention from the present moment to the future, ensuring that the clinician misses the most nuanced aspects of the client's communication.</p>`
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "A clinician who is mentally formulating their next intervention while the client is speaking is engaging in:",
          options: [
            { text: "Efficient clinical practice", isCorrect: false },
            { text: "Evaluative listening", isCorrect: false },
            { text: "Rehearsal listening", isCorrect: true },
            { text: "Premature problem-solving", isCorrect: false }
          ],
          explanation: "Rehearsal listening involves planning what to say next while the client is still talking. It diverts attention from present-moment attending to future performance, causing the clinician to miss nuanced aspects of the client's communication."
        },
        {
          type: "accordion",
          order: 6,
          title: "Building a Deliberate Listening Practice",
          accordionItems: [
            {
              title: "Minimal Encouragers: Small Signals, Big Impact",
              content: "Minimal encouragers—brief verbal responses like 'mm-hmm,' 'yes,' 'go on,' 'tell me more,' and 'and then?'—serve as the connective tissue of the therapeutic conversation. They communicate continued attention without interrupting the client's narrative flow. Used skillfully, minimal encouragers can also be directive: repeating a key word the client used ('Trapped?') invites them to explore that specific aspect of their experience more deeply. The key is naturalness—mechanical or rhythmic use of minimal encouragers ('uh-huh, uh-huh, uh-huh') communicates the opposite of presence."
            },
            {
              title: "Recording and Reviewing Your Sessions",
              content: "One of the most powerful ways to improve listening skills is to audio or video record sessions (with informed consent) and review them with a supervisor or consultant. Most clinicians are surprised by what they hear: missed opportunities for reflection, questions that led rather than opened, silences they interrupted prematurely, and moments of genuine connection they didn't notice in real time. Systematic review using tools like the Motivational Interviewing Treatment Integrity (MITI) coding system provides objective feedback on specific listening behaviors."
            },
            {
              title: "The Lifelong Practice of Listening",
              content: "Effective listening is not a skill that is mastered once and then maintained automatically. Like any complex clinical competency, it requires ongoing practice, feedback, and refinement throughout one's career. Senior clinicians can become complacent about their listening skills, falling into habitual patterns that once served them well but have become stale. The commitment to ongoing development of listening skills—through supervision, peer consultation, recording review, and self-reflection—is a commitment to clinical excellence at every career stage."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "Therapeutic silence is valuable because it:",
          options: [
            { text: "Saves the clinician from having to respond", isCorrect: false },
            { text: "Gives clients space to process emotions and often elicits deeper material than questions", isCorrect: true },
            { text: "Demonstrates the clinician's authority", isCorrect: false },
            { text: "Should be used to fill time when the clinician is unsure what to say", isCorrect: false }
          ],
          explanation: "Therapeutic silence serves multiple functions: it gives clients processing space, communicates comfort with difficult material, and often elicits deeper content than any question could. It is an active, intentional clinical intervention—not the absence of one."
        },
        {
          type: "reflection",
          order: 8,
          question: "Which common listening error do you fall into most often—premature problem-solving, autobiographical listening, evaluative listening, or rehearsal listening? What triggers this pattern for you, and what might help you catch it in the moment?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The three types of summaries identified by Miller and Rollnick are:",
          type: "multipleChoice",
          options: [
            { text: "Brief, moderate, and comprehensive", isCorrect: false },
            { text: "Collecting, linking, and transitional", isCorrect: true },
            { text: "Simple, complex, and additive", isCorrect: false },
            { text: "Content, feeling, and meaning", isCorrect: false }
          ],
          explanation: "Miller and Rollnick identify collecting summaries (gathering things said), linking summaries (connecting current and earlier material), and transitional summaries (bridging from one topic to the next)."
        },
        {
          question: "Premature problem-solving as a listening error involves:",
          type: "multipleChoice",
          options: [
            { text: "Waiting too long before offering clinical suggestions", isCorrect: false },
            { text: "Jumping to solutions before the client feels fully heard", isCorrect: true },
            { text: "Refusing to ever offer advice", isCorrect: false },
            { text: "Solving problems that aren't real", isCorrect: false }
          ],
          explanation: "Premature problem-solving skips past the client's need to feel heard and understood, jumping to solutions. This is especially common among clinicians who feel pressured to demonstrate expertise or who are uncomfortable sitting with a client's pain."
        },
        {
          question: "Repeating a key word a client used (e.g., 'Trapped?') is an example of:",
          type: "multipleChoice",
          options: [
            { text: "Parroting", isCorrect: false },
            { text: "A directive minimal encourager that invites deeper exploration", isCorrect: true },
            { text: "An evaluative response", isCorrect: false },
            { text: "A clarifying question", isCorrect: false }
          ],
          explanation: "Repeating a key word as a minimal encourager invites the client to explore that specific aspect of their experience more deeply. Unlike parroting (repeating entire statements), this targeted technique is directive and purposeful."
        },
        {
          question: "The best way to objectively assess and improve listening skills over time is:",
          type: "multipleChoice",
          options: [
            { text: "Self-assessment alone", isCorrect: false },
            { text: "Recording sessions and reviewing them with a supervisor using structured coding tools", isCorrect: true },
            { text: "Reading more textbooks about listening", isCorrect: false },
            { text: "Asking clients if they feel heard", isCorrect: false }
          ],
          explanation: "Systematic review of recorded sessions using tools like the MITI coding system provides objective feedback on specific listening behaviors. Most clinicians are surprised by what they discover in recordings—missed opportunities and patterns invisible in real time."
        },
        {
          question: "Effective clarifying questions are characterized by being:",
          type: "multipleChoice",
          options: [
            { text: "Long, detailed, and leading", isCorrect: false },
            { text: "Brief, specific, and arising from genuine uncertainty", isCorrect: true },
            { text: "Used frequently to maintain control of the session", isCorrect: false },
            { text: "Closed-ended to get specific information", isCorrect: false }
          ],
          explanation: "Effective clarification is brief, specific, and motivated by genuine uncertainty—not a desire to redirect the conversation or impose the clinician's hypothesis on the client's experience."
        }
      ],
      quizPassThreshold: 0.8
    }
  ],

  // ═══════════════════════════════════════════════════
  // FINAL ASSESSMENT
  // ═══════════════════════════════════════════════════
  assessment: {
    title: "Final Assessment",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "According to Lambert's research, common factors including the therapeutic relationship account for approximately what percentage of treatment outcome variance?",
        type: "multipleChoice",
        options: [
          { text: "10%", isCorrect: false },
          { text: "30%", isCorrect: true },
          { text: "50%", isCorrect: false },
          { text: "75%", isCorrect: false }
        ],
        explanation: "Lambert's meta-analytic work estimates common factors account for approximately 30% of outcome variance, while specific techniques account for only about 15%—underscoring the importance of the therapeutic relationship and listening quality."
      },
      {
        question: "The SOLER model was developed by:",
        type: "multipleChoice",
        options: [
          { text: "Carl Rogers", isCorrect: false },
          { text: "Gerard Egan", isCorrect: true },
          { text: "Allen Ivey", isCorrect: false },
          { text: "William Miller", isCorrect: false }
        ],
        explanation: "Gerard Egan developed the SOLER model of physical attending behaviors as part of his Skilled Helper approach. He later expanded it to SOLVER with Robert Reese."
      },
      {
        question: "Psychological attending, as described by Rogers, is best characterized as:",
        type: "multipleChoice",
        options: [
          { text: "Passive receptivity to whatever the client shares", isCorrect: false },
          { text: "An active, demanding discipline of entering the client's perceptual world", isCorrect: true },
          { text: "Maintaining perfect eye contact throughout the session", isCorrect: false },
          { text: "Formulating diagnostic impressions while listening", isCorrect: false }
        ],
        explanation: "Rogers described psychological attending as actively entering the client's private perceptual world—an effortful, disciplined practice of focused awareness, not the passive receptivity that 'listening' might suggest."
      },
      {
        question: "Reflection of meaning differs from reflection of feeling in that it:",
        type: "multipleChoice",
        options: [
          { text: "Uses more emotional vocabulary", isCorrect: false },
          { text: "Connects the client's experience to their underlying values and personal significance", isCorrect: true },
          { text: "Is simpler and more direct", isCorrect: false },
          { text: "Requires less clinical skill", isCorrect: false }
        ],
        explanation: "Reflection of meaning is the deepest level of the reflective hierarchy—it connects feelings and experiences to the client's values, beliefs, and life narrative, communicating understanding of why something matters, not just what happened or how they feel."
      },
      {
        question: "The 'as if' quality in Rogers' definition of empathy refers to:",
        type: "multipleChoice",
        options: [
          { text: "Pretending to understand the client", isCorrect: false },
          { text: "Maintaining distinction between the client's experience and one's own while deeply entering their world", isCorrect: true },
          { text: "Acting as if you care even when you don't", isCorrect: false },
          { text: "Imagining hypothetical scenarios", isCorrect: false }
        ],
        explanation: "The 'as if' quality distinguishes empathy from emotional fusion—the clinician enters the client's experience deeply while maintaining awareness that it is the client's experience, not their own. This preserves the therapeutic stance."
      },
      {
        question: "A higher ratio of complex to simple reflections is associated with:",
        type: "multipleChoice",
        options: [
          { text: "Longer session duration", isCorrect: false },
          { text: "Better client outcomes in MI research", isCorrect: true },
          { text: "Increased client resistance", isCorrect: false },
          { text: "Less therapeutic alliance", isCorrect: false }
        ],
        explanation: "Motivational Interviewing research identifies a higher complex-to-simple reflection ratio as a marker of clinical proficiency associated with better outcomes. Complex reflections add meaning beyond what the client explicitly stated."
      },
      {
        question: "Autobiographical listening involves:",
        type: "multipleChoice",
        options: [
          { text: "Asking the client about their autobiography", isCorrect: false },
          { text: "Filtering the client's experience through the clinician's own similar experiences", isCorrect: true },
          { text: "Taking notes during the session", isCorrect: false },
          { text: "Reflecting the client's life story back to them", isCorrect: false }
        ],
        explanation: "Autobiographical listening substitutes the clinician's own experience for the client's—mentally comparing the client's situation to one's own rather than staying with the client's unique perspective."
      },
      {
        question: "Therapeutic silence is best understood as:",
        type: "multipleChoice",
        options: [
          { text: "An awkward gap to be filled quickly", isCorrect: false },
          { text: "An active clinical intervention that gives space for processing and deeper exploration", isCorrect: true },
          { text: "A sign that the clinician doesn't know what to say", isCorrect: false },
          { text: "Only appropriate at the end of sessions", isCorrect: false }
        ],
        explanation: "Therapeutic silence is an intentional, active intervention—not the absence of one. It gives clients space to process emotions, formulate thoughts, and access deeper material that questions alone cannot reach."
      },
      {
        question: "A collecting summary involves:",
        type: "multipleChoice",
        options: [
          { text: "Connecting current material to previous sessions", isCorrect: false },
          { text: "Gathering together several things the client has said into one cohesive statement", isCorrect: true },
          { text: "Transitioning from one topic to another", isCorrect: false },
          { text: "Collecting intake information", isCorrect: false }
        ],
        explanation: "A collecting summary gathers multiple pieces of what the client has shared into one cohesive statement, demonstrating sustained attention and helping clients see the full picture of what they've communicated."
      },
      {
        question: "When a clinician feels compelled to fill every silence in session, this most likely reflects:",
        type: "multipleChoice",
        options: [
          { text: "Excellent clinical instincts", isCorrect: false },
          { text: "The clinician's own discomfort with silence rather than the client's needs", isCorrect: true },
          { text: "Appropriate pacing for all clients", isCorrect: false },
          { text: "Advanced training in brief therapy", isCorrect: false }
        ],
        explanation: "The urge to fill silence typically reflects the clinician's anxiety rather than the client's needs. Clients given space often go to the material that matters most—interrupting this process to manage one's own discomfort undermines the therapeutic work."
      },
      {
        question: "The MITI coding system is used to:",
        type: "multipleChoice",
        options: [
          { text: "Diagnose mental health conditions", isCorrect: false },
          { text: "Provide objective feedback on specific therapeutic listening and communication behaviors", isCorrect: true },
          { text: "Measure client satisfaction", isCorrect: false },
          { text: "Assess burnout in clinicians", isCorrect: false }
        ],
        explanation: "The Motivational Interviewing Treatment Integrity (MITI) coding system provides objective feedback on specific clinician behaviors including reflection types, question patterns, and listening skill proficiency."
      },
      {
        question: "The recommended reflection-to-question ratio in clinical practice is:",
        type: "multipleChoice",
        options: [
          { text: "1:1 (equal reflections and questions)", isCorrect: false },
          { text: "At least 2:1 (two reflections for every question)", isCorrect: true },
          { text: "1:2 (one reflection for every two questions)", isCorrect: false },
          { text: "Questions should always be avoided", isCorrect: false }
        ],
        explanation: "Best practice suggests at least a 2:1 reflection-to-question ratio. Over-reliance on questions creates an interrogation dynamic. Paradoxically, fewer questions and more reflections typically yield richer clinical information."
      },
      {
        question: "Adapting eye contact norms for cultural responsiveness is an example of:",
        type: "multipleChoice",
        options: [
          { text: "Abandoning evidence-based practice", isCorrect: false },
          { text: "Applying cultural humility to physical attending behaviors", isCorrect: true },
          { text: "Being unprofessional", isCorrect: false },
          { text: "Avoiding eye contact with all clients", isCorrect: false }
        ],
        explanation: "Eye contact norms vary significantly across cultures. Adapting attending behaviors to the client's cultural context—rather than rigidly applying Western norms—demonstrates cultural humility while maintaining genuine psychological presence."
      },
      {
        question: "Additive empathy should be used:",
        type: "multipleChoice",
        options: [
          { text: "Frequently from the very first session", isCorrect: false },
          { text: "Only after establishing trust, with careful calibration to client readiness", isCorrect: true },
          { text: "Instead of basic reflections", isCorrect: false },
          { text: "Only with highly verbal clients", isCorrect: false }
        ],
        explanation: "Additive empathy—articulating what the client hasn't yet verbalized—can be powerfully deepening when accurate but deeply rupturing when off-base. It requires a strong foundation of trust and careful attention to whether the client is ready for this depth."
      },
      {
        question: "Effective listening skills are best maintained through:",
        type: "multipleChoice",
        options: [
          { text: "Mastery during graduate training that persists automatically", isCorrect: false },
          { text: "Ongoing practice, feedback, and refinement throughout one's career", isCorrect: true },
          { text: "Annual reading of listening skills textbooks", isCorrect: false },
          { text: "Natural talent that cannot be developed", isCorrect: false }
        ],
        explanation: "Like any complex clinical competency, listening skills require ongoing practice, feedback, and refinement at every career stage. Senior clinicians can become complacent, falling into habitual patterns. The commitment to lifelong development is essential."
      }
    ]
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('interactivecourses').updateOne(
      { slug: SLUG },
      { $set: { ...COURSE, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(result.upsertedCount ? '✅ Created' : '♻️ Updated', SLUG);
    await mongoose.disconnect();
  } catch (err) { console.error('❌', err); process.exit(1); }
}

seed();
