/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// rebuildActiveListening_ModulesFormat.js
// Rebuilds Active Listening course in COURSE collection with modules/lessons format
// This works with course-player.html (what learners use)
// Run: node src/scripts/rebuildActiveListening_ModulesFormat.js

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

const activeListeningCourse = {
  title: "Active Listening: The Foundation of Effective Therapy",
  slug: "active-listening-skills",
  subtitle: "Master attending, reflecting, clarifying, and summarizing skills",
  description: "This course provides mental health professionals with foundational knowledge and practical skills in active listening—the cornerstone of effective therapeutic communication. Participants will explore the difference between passive hearing and active engagement, master core components including attending behaviors, paraphrasing, and reflection of feelings, and learn to apply these skills in challenging clinical situations including silence, high emotion, and resistance.",
  thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
  ceHours: 1,
  ceType: "core",
  provider: "NBCC ACEP #7760",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Licensed Clinical Social Workers", "Marriage and Family Therapists", "Psychologists", "Counseling Students"],
  categories: ["Clinical Skills", "Foundational Skills"],
  tags: ["active listening", "therapeutic communication", "counseling skills", "attending behaviors", "reflection", "paraphrasing"],
  author: "CounselorReady",
  status: "published",
  isFree: false,
  
  learningObjectives: [
    "Define active listening and differentiate it from passive hearing in clinical contexts",
    "Identify and demonstrate the six core components of active listening",
    "Apply active listening techniques in challenging clinical situations",
    "Recognize common barriers to active listening and implement strategies to overcome them",
    "Adapt active listening approaches for diverse cultural contexts",
    "Develop a personal plan for ongoing skill development in active listening"
  ],
  
  settings: {
    passingScore: 80,
    allowRetakes: true,
    showCorrectAnswers: true,
    requireVideoCompletion: false
  },
  
  modules: [
    {
      title: "Understanding Active Listening",
      description: "Foundations and neuroscience of therapeutic listening",
      order: 1,
      lessons: [
        {
          title: "What Is Active Listening?",
          type: "text",
          order: 1,
          duration: 8,
          content: `
<h3>Defining Active Listening in Clinical Practice</h3>
<p>Active listening is far more than simply hearing the words your client speaks. It is a dynamic, intentional process that involves fully concentrating on, understanding, responding to, and remembering what the client communicates—both verbally and nonverbally. In therapeutic contexts, active listening forms the foundation upon which all other clinical skills are built.</p>

<p>The distinction between <strong>passive hearing</strong> and <strong>active listening</strong> is critical for clinicians to understand. Passive hearing is the automatic, effortless process of sound waves entering our ears and being processed by our auditory system. It requires no intention or effort—it simply happens. Active listening, by contrast, is a deliberate choice that demands our full cognitive and emotional engagement.</p>

<h3>The Neuroscience of Listening</h3>
<p>When we engage in active listening, multiple brain regions work in concert. The auditory cortex processes the sounds of speech, while Broca's and Wernicke's areas decode language meaning. The prefrontal cortex engages in executive functions like maintaining attention and inhibiting distractions. Perhaps most importantly for therapeutic work, the limbic system—including the amygdala and insula—processes the emotional content of what we hear.</p>

<p>Research in interpersonal neurobiology has demonstrated that when a listener is fully attuned to a speaker, their brain activity begins to synchronize—a phenomenon called <strong>neural coupling</strong>. This synchronization is associated with better understanding and stronger interpersonal connection. In therapy, this neural coupling may be one mechanism through which the therapeutic alliance develops and deepens.</p>

<p>The hormone oxytocin, sometimes called the "bonding hormone," is released during positive social interactions characterized by attentive listening. This neurochemical response helps explain why clients who feel truly heard often report feeling safer, more connected, and more willing to engage in the vulnerable work of therapy.</p>

<h3>Why Active Listening Matters in Therapy</h3>
<p>Research consistently demonstrates that the quality of the therapeutic relationship is one of the strongest predictors of positive treatment outcomes—often more predictive than the specific therapeutic modality used. Active listening is the primary tool through which therapists build and maintain this crucial relationship.</p>

<p>When clients feel genuinely heard, several important therapeutic processes are facilitated:</p>
<ul>
  <li><strong>Trust development:</strong> Clients are more likely to disclose sensitive information and engage authentically</li>
  <li><strong>Emotional regulation:</strong> The experience of being heard helps regulate the client's nervous system through co-regulation</li>
  <li><strong>Insight generation:</strong> Reflective listening helps clients hear their own thoughts and feelings in new ways</li>
  <li><strong>Behavior change:</strong> Clients who feel understood are more motivated to engage in the work of change</li>
</ul>

<h3>The SOLER Framework</h3>
<p>Gerard Egan's SOLER model provides a useful framework for the physical aspects of active listening:</p>
<ul>
  <li><strong>S - Squarely face the client:</strong> Orient your body toward the client to communicate full attention. This doesn't mean rigid positioning, but rather a general orientation that says "I am here with you."</li>
  <li><strong>O - Open posture:</strong> Avoid crossed arms or legs that might communicate defensiveness or disengagement. An open posture invites open communication.</li>
  <li><strong>L - Lean slightly forward:</strong> A slight forward lean communicates interest and engagement. Leaning back, conversely, can communicate disinterest or emotional distance.</li>
  <li><strong>E - Eye contact:</strong> Appropriate eye contact communicates attention and respect. The key is "appropriate"—too little may seem disinterested, while too much can feel intrusive.</li>
  <li><strong>R - Relax:</strong> A relaxed presence helps put clients at ease. Tension in the therapist's body can be sensed by clients and may increase their own anxiety.</li>
</ul>

<p>While SOLER provides helpful guidance, cultural considerations are essential. Direct eye contact and forward leaning may be appropriate in some cultural contexts but could be experienced as aggressive or disrespectful in others.</p>
          `
        },
        {
          title: "Section 1 Quiz",
          type: "quiz",
          order: 2,
          questions: [
            {
              question: "What distinguishes active listening from passive hearing?",
              options: [
                "Active listening requires hearing aids while passive hearing does not",
                "Active listening is a deliberate, intentional process requiring full cognitive and emotional engagement",
                "Passive hearing is more effective in therapeutic settings",
                "There is no meaningful difference between the two"
              ],
              correctAnswer: 1,
              explanation: "Active listening is distinguished by its intentional, deliberate nature requiring full engagement, while passive hearing is automatic and effortless."
            },
            {
              question: "Neural coupling during attentive listening refers to:",
              options: [
                "The synchronization of brain activity between speaker and listener",
                "The physical connection of neurons in the auditory cortex",
                "A type of hearing loss",
                "The coupling of verbal and nonverbal communication"
              ],
              correctAnswer: 0,
              explanation: "Neural coupling describes the synchronization of brain activity between speaker and listener during attuned communication."
            },
            {
              question: "In the SOLER framework, what does the 'L' stand for?",
              options: [
                "Look directly at the client",
                "Listen without interrupting",
                "Lean slightly forward",
                "Lower your voice"
              ],
              correctAnswer: 2,
              explanation: "The 'L' in SOLER stands for 'Lean slightly forward,' which communicates interest and engagement."
            },
            {
              question: "Which hormone is released during positive social interactions characterized by attentive listening?",
              options: [
                "Cortisol",
                "Adrenaline",
                "Oxytocin",
                "Dopamine"
              ],
              correctAnswer: 2,
              explanation: "Oxytocin, sometimes called the 'bonding hormone,' is released during positive social interactions including attentive listening."
            },
            {
              question: "Why is the therapeutic relationship considered so important in treatment outcomes?",
              options: [
                "It determines which techniques the therapist can use",
                "Research shows it is often more predictive of outcomes than specific modalities",
                "Insurance companies require documentation of the relationship",
                "It is not actually that important compared to technique"
              ],
              correctAnswer: 1,
              explanation: "Research consistently demonstrates that the quality of the therapeutic relationship is one of the strongest predictors of positive treatment outcomes."
            }
          ]
        }
      ]
    },
    {
      title: "Core Components and Techniques",
      description: "Practical skills for therapeutic listening",
      order: 2,
      lessons: [
        {
          title: "The Six Core Components",
          type: "text",
          order: 1,
          duration: 10,
          content: `
<h3>The Six Core Components of Active Listening</h3>
<p>Effective active listening in therapeutic contexts involves six interrelated components, each serving a distinct purpose in facilitating client exploration and building therapeutic rapport.</p>

<h3>1. Attending Behaviors</h3>
<p>Attending behaviors are the nonverbal signals that communicate your presence and attention to the client. These include appropriate eye contact, open body posture, and minimal physical barriers between you and the client. Your facial expressions should be responsive to the emotional content of what clients share—not artificially warm or falsely neutral, but genuinely responsive.</p>

<h3>2. Minimal Encouragers</h3>
<p>Minimal encouragers are brief verbal and nonverbal cues that communicate "I'm with you, please continue." These include head nods, brief vocalizations ("mm-hmm," "uh-huh"), and short verbal prompts ("yes," "I see," "go on"). The key is using these authentically and at appropriate moments—overuse can seem mechanical, while underuse may leave clients feeling unheard.</p>

<h3>3. Paraphrasing</h3>
<p>Paraphrasing involves restating the content of what the client has said in your own words. This serves multiple purposes: it demonstrates that you are listening and understanding, it gives clients a chance to hear their thoughts reflected back, and it allows for clarification if your understanding is incomplete or inaccurate.</p>
<p><strong>Example:</strong> Client says "I've been trying to talk to my husband about our finances, but every time I bring it up he just shuts down and walks away." Therapist paraphrases: "So when you attempt to discuss money matters, your husband becomes unresponsive and leaves the conversation."</p>

<h3>4. Reflection of Feeling</h3>
<p>While paraphrasing focuses on content, reflection of feeling addresses the emotional experience underlying the client's words. This component requires you to identify and name the emotions—both those explicitly stated and those implied—in what clients share.</p>
<p><strong>Example:</strong> Following the same client statement, a reflection of feeling might be: "It sounds like you're feeling frustrated and perhaps dismissed when he walks away from these conversations."</p>

<h3>5. Clarifying Questions</h3>
<p>Clarifying questions help you gather additional information and demonstrate your genuine interest in understanding the client's experience. Effective clarifying questions are open-ended, non-leading, and focused on the client's perspective.</p>
<p>The "Columbo Approach" can be useful here: approach with genuine curiosity rather than assuming you already know. "Help me understand..." or "I'm curious about..." invites exploration without judgment.</p>

<h3>6. Summarizing</h3>
<p>Summarizing involves bringing together the key themes, feelings, and content from a longer segment of client communication. Summaries are typically used at transition points in the session or when wrapping up. They help organize information for both therapist and client, and can highlight patterns the client may not have noticed.</p>

<h3>Five Practical Techniques</h3>

<p><strong>The 3-Second Pause:</strong> After a client finishes speaking, count to three silently before responding. This creates space for clients to add more, demonstrates thoughtful consideration, and prevents you from interrupting with premature responses.</p>

<p><strong>Listen for the Music, Not Just the Words:</strong> Pay attention to tone, pace, volume, and rhythm of speech. A client who says "I'm fine" in a flat, quiet tone is communicating something very different from one who says it brightly and energetically.</p>

<p><strong>Track the Themes:</strong> Notice recurring topics, metaphors, or concerns across sessions. When you reflect these patterns back to clients, you demonstrate deep listening that goes beyond the current moment.</p>

<p><strong>Name What You Notice:</strong> Observations like "I notice your voice softened when you mentioned your mother" can help clients access their own experience more fully.</p>

<p><strong>Build Habits, Not Just Skills:</strong> Create rituals that help you transition into "listening mode" before sessions. This might be a brief meditation, reviewing notes, or simply taking three deep breaths.</p>
          `
        },
        {
          title: "Handling Challenging Situations",
          type: "text",
          order: 2,
          duration: 8,
          content: `
<h3>Working with Silence</h3>
<p>Silence often feels uncomfortable, but it can be one of the most powerful elements of therapeutic communication. Silence gives clients time to think, to feel, and to decide what to share next. It communicates that you are not rushing them, that there is space for whatever emerges.</p>

<p>Practice tolerating progressively longer silences. Notice your own urge to fill the quiet and gently resist it. Often, the most meaningful material emerges after a period of silence.</p>

<p>Not all silences are the same. A "processing silence" (client is thinking) requires different handling than an "avoidant silence" (client is avoiding difficult material) or a "connected silence" (a moment of shared understanding that needs no words).</p>

<h3>Managing High Emotion</h3>
<p>When clients experience intense emotions, your steady, attuned presence is more important than any particular technique. Avoid the urge to immediately fix or soothe—sometimes clients need to fully experience their emotions before moving toward resolution.</p>

<p>Phrases like "I'm here with you" or simply naming what you observe ("There are tears") can provide grounding without dismissing or minimizing the emotional experience. Your regulated presence helps clients regulate their own nervous system through co-regulation.</p>

<h3>Navigating Resistance</h3>
<p>When clients seem reluctant to engage, active listening becomes even more crucial. Resistance often signals that something important is being protected. Rather than pushing harder, use reflection to acknowledge the resistance itself: "It seems like there's some hesitation about going into this topic."</p>

<p>Remember that resistance is information. What might the client be protecting? What has made it unsafe to explore this area before?</p>

<h3>Personal Triggers</h3>
<p>Every therapist has topics, dynamics, or client presentations that trigger personal reactions. Self-awareness is essential. Know your triggers and have strategies for managing them—whether that's a grounding technique you can use in session, a commitment to discuss certain topics in supervision, or recognition that some clients may need referral.</p>

<h3>Telehealth Considerations</h3>
<p>Active listening in telehealth requires adaptation. Position your camera at eye level and look into the camera (not at the client's image) when you want to simulate eye contact. Be more explicit with minimal encouragers since nonverbal cues may be harder to see. Consider having clients position their camera to show more than just their face—hand movements and body posture provide important information.</p>

<p>Technical issues can disrupt the flow of listening. Have a plan for how to handle these disruptions, and name them when they happen: "It looks like we lost connection for a moment—what were you saying about your sister?"</p>
          `
        },
        {
          title: "Section 2 Quiz",
          type: "quiz",
          order: 3,
          questions: [
            {
              question: "What is the primary difference between paraphrasing and reflection of feeling?",
              options: [
                "Paraphrasing is longer than reflection of feeling",
                "Paraphrasing focuses on content while reflection of feeling addresses emotions",
                "Reflection of feeling requires advanced training",
                "Paraphrasing is only used with cognitive-behavioral approaches"
              ],
              correctAnswer: 1,
              explanation: "Paraphrasing restates the content of what the client said, while reflection of feeling addresses the emotional experience underlying the words."
            },
            {
              question: "What is the purpose of the '3-Second Pause' technique?",
              options: [
                "To give you time to think of your next question",
                "To make the client uncomfortable so they talk more",
                "To create space for clients to add more and demonstrate thoughtful consideration",
                "To meet insurance documentation requirements"
              ],
              correctAnswer: 2,
              explanation: "The 3-second pause creates space for clients to add more, demonstrates thoughtful consideration, and prevents premature responses."
            },
            {
              question: "Which approach is recommended when clients experience intense emotions?",
              options: [
                "Immediately redirect them to more comfortable topics",
                "Offer advice on how to manage their feelings",
                "Maintain steady, attuned presence without rushing to fix or soothe",
                "End the session early to let them compose themselves"
              ],
              correctAnswer: 2,
              explanation: "During intense emotions, a steady, attuned presence is more important than trying to immediately fix or soothe."
            },
            {
              question: "In telehealth sessions, where should you look when you want to simulate eye contact?",
              options: [
                "At the client's image on screen",
                "At your notes",
                "At the camera",
                "At a spot behind your computer"
              ],
              correctAnswer: 2,
              explanation: "Looking at the camera, rather than the client's image, simulates eye contact from the client's perspective."
            },
            {
              question: "How should resistance from a client be understood?",
              options: [
                "As a sign the client is not motivated for treatment",
                "As information about something important being protected",
                "As an indication therapy should end",
                "As manipulative behavior"
              ],
              correctAnswer: 1,
              explanation: "Resistance often signals that something important is being protected. It provides valuable clinical information."
            }
          ]
        }
      ]
    },
    {
      title: "Cultural Considerations",
      description: "Adapting active listening across diverse contexts",
      order: 3,
      lessons: [
        {
          title: "Cultural Humility in Listening",
          type: "text",
          order: 1,
          duration: 7,
          content: `
<h3>Cultural Humility as Foundation</h3>
<p>Effective active listening across cultural differences requires cultural humility—an ongoing process of self-reflection and self-critique, combined with a genuine desire to understand each client's unique cultural context. Cultural humility differs from cultural competence in that it recognizes we can never be fully "competent" in another's cultural experience; we can only approach it with openness and willingness to learn.</p>

<p>Culture shapes communication in profound ways—affecting everything from how emotions are expressed to what topics are considered appropriate for discussion with a professional. The effective listener approaches each client curious about their individual relationship with their cultural background(s).</p>

<h3>Eye Contact Across Cultures</h3>
<p>In mainstream American culture, direct eye contact is often associated with honesty, confidence, and engagement. However, in many cultures, direct eye contact—particularly with authority figures—may be considered disrespectful or aggressive.</p>

<p>Rather than assuming your typical eye contact patterns are universally appropriate, pay attention to your client's comfort level and adjust accordingly. If a client consistently averts their gaze, this may be cultural respect rather than discomfort or evasion.</p>

<h3>Silence in Cultural Context</h3>
<p>The meaning and comfort level of silence varies dramatically across cultures. In some Indigenous cultures and many East Asian contexts, silence is valued as a time for reflection and is a natural part of conversation. In other cultural contexts, silence may feel awkward or may signal disapproval.</p>

<p>A client who is comfortable with longer silences may experience a therapist's quick responses as intrusive or pressuring. Conversely, a client from a culture where rapid verbal exchange is the norm may experience silence as cold or disinterested.</p>

<h3>Emotional Expression</h3>
<p>Cultures differ significantly in norms around emotional expression. Some cultures value emotional restraint and may view open displays of emotion as immature or inappropriate. Other cultures embrace expressive emotional communication as authentic and connecting.</p>

<p>Be careful not to pathologize cultural differences in emotional expression. A client who appears "flat" may be demonstrating culturally appropriate restraint, while a client who seems "dramatic" may be communicating in a culturally congruent way.</p>

<h3>High-Context vs. Low-Context Communication</h3>
<p>Edward Hall's concept of high-context and low-context communication is useful here. In high-context cultures (many Asian, African, and Latin American cultures), much of the meaning is conveyed through context, nonverbal cues, and what is left unsaid. In low-context cultures (including mainstream American culture), meaning is conveyed more explicitly through direct verbal communication.</p>

<p>Active listening with clients from high-context backgrounds may require greater attention to nonverbal cues, more patience with indirect communication, and recognition that directly asking about certain topics may feel intrusive.</p>

<h3>Storytelling and Narrative Styles</h3>
<p>Communication styles differ in how information is organized and shared. Some cultures favor linear, chronological narratives; others use circular or associative patterns where meaning emerges through accumulated images and stories rather than direct statements.</p>

<p>If a client's storytelling style differs from your expectations, resist the urge to redirect them toward "getting to the point." The way they tell their story may be as important as the content itself.</p>

<h3>Ask, Don't Assume</h3>
<p>Ultimately, the most important cultural skill is the willingness to ask clients about their preferences and experiences. Questions like "What's it like for you when there's silence in our conversations?" or "In your family, how did people typically communicate when something was bothering them?" invite clients to educate you about their cultural context.</p>
          `
        },
        {
          title: "Section 3 Quiz",
          type: "quiz",
          order: 2,
          questions: [
            {
              question: "What distinguishes cultural humility from cultural competence?",
              options: [
                "Cultural humility is less effective than cultural competence",
                "Cultural humility recognizes we can never be fully competent in another's cultural experience",
                "Cultural competence requires more training",
                "They are the same concept with different names"
              ],
              correctAnswer: 1,
              explanation: "Cultural humility recognizes we can never be fully 'competent' in another's cultural experience; we can only approach it with openness and willingness to learn."
            },
            {
              question: "In high-context communication cultures, meaning is primarily conveyed through:",
              options: [
                "Direct verbal statements",
                "Written documentation",
                "Context, nonverbal cues, and what is left unsaid",
                "Formal presentations"
              ],
              correctAnswer: 2,
              explanation: "High-context cultures convey meaning through context, nonverbal cues, and what is left unsaid, rather than explicit verbal statements."
            },
            {
              question: "When a client's storytelling style differs from linear expectations, the therapist should:",
              options: [
                "Redirect them to 'get to the point'",
                "Recognize that the way they tell their story may be as important as the content",
                "Document the client as having disorganized thinking",
                "Explain the preferred communication style"
              ],
              correctAnswer: 1,
              explanation: "Different narrative styles are culturally influenced, and the way a client tells their story may be as meaningful as the content itself."
            }
          ]
        }
      ]
    },
    {
      title: "Application and Growth",
      description: "Case studies and ongoing development",
      order: 4,
      lessons: [
        {
          title: "Case Studies in Active Listening",
          type: "text",
          order: 1,
          duration: 8,
          content: `
<h3>Case Study 1: The Reluctant Client</h3>
<p><strong>Scenario:</strong> Marcus, a 34-year-old man, was mandated to therapy following a DUI. In the first session, he sits with arms crossed, giving one-word answers and frequently checking his phone.</p>

<p><strong>Ineffective Approach:</strong> Confronting the resistance ("You need to put your phone away and engage in this process") or becoming passive ("If you don't want to talk, we can just sit here").</p>

<p><strong>Active Listening Approach:</strong> The therapist names what she observes without judgment: "I notice this doesn't seem like somewhere you want to be." Marcus responds with a sarcastic "What gave it away?" Rather than taking the bait, she reflects: "Sounds like you've had enough of people telling you what to do." This acknowledgment of his experience, rather than another demand, creates a small opening. Over several sessions, the therapist continues to listen for and reflect what matters to Marcus, gradually building enough trust for genuine engagement.</p>

<h3>Case Study 2: Active Listening Gone Wrong</h3>
<p><strong>Scenario:</strong> Sarah tells her therapist about a conflict with her mother. The therapist, eager to demonstrate understanding, says "So you're feeling angry at your mother for being controlling." Sarah responds defensively: "I never said I was angry. I love my mother."</p>

<p><strong>What Went Wrong:</strong> The therapist moved too quickly to interpretation and used language ("controlling," "angry") that Sarah wasn't ready for. Even if the therapist's assessment was accurate, leading with it shut down Sarah's own exploration.</p>

<p><strong>Better Approach:</strong> "It sounds like that conversation with your mother really affected you. What was that like for you?" This invites Sarah to identify her own experience rather than accepting or rejecting the therapist's label.</p>

<h3>Case Study 3: Working with Silence</h3>
<p><strong>Scenario:</strong> During the fifth session, James suddenly stops mid-sentence while talking about his deceased father. His eyes fill with tears, and he falls silent, staring at the floor.</p>

<p><strong>Less Effective Approach:</strong> Immediately offering tissues and asking "What are you feeling right now?" or filling the silence with reassurance: "It's okay, take your time."</p>

<p><strong>Active Listening Approach:</strong> The therapist remains quietly present, her posture open and slightly forward, her face showing gentle attentiveness. After about 30 seconds, James looks up briefly, then back down. The therapist softly says, "I'm here." James nods slightly. Another minute passes before he speaks: "I never really let myself miss him." The silence had made space for this crucial realization.</p>

<h3>Developing Your Active Listening Skills</h3>

<p><strong>Self-Assessment Questions:</strong></p>
<ul>
  <li>When do I find it hardest to listen attentively? (Certain topics? Client presentations? Times of day?)</li>
  <li>What internal experiences (thoughts, feelings, physical sensations) pull me away from listening?</li>
  <li>How comfortable am I with silence? With intense emotion? With conflict?</li>
  <li>What cultural assumptions do I bring to my listening?</li>
  <li>How do I typically know when I've truly understood a client versus when I'm assuming I understand?</li>
</ul>

<p><strong>Development Plan Framework:</strong></p>
<ol>
  <li>Identify one specific component of active listening to focus on this month</li>
  <li>Set a concrete, measurable goal (e.g., "I will practice tolerating silence for 10 seconds before responding in 3 sessions this week")</li>
  <li>Build in accountability—a peer, supervisor, or self-review of recordings</li>
  <li>Reflect weekly on what you're learning</li>
</ol>

<p><strong>Signs of Growth:</strong></p>
<ul>
  <li>Clients share more deeply and spontaneously</li>
  <li>You catch yourself preparing responses and can let go, returning to listening</li>
  <li>Silence feels less uncomfortable</li>
  <li>You notice more nuance in clients' communications</li>
  <li>Clients comment on feeling heard or understood</li>
  <li>Your reflections and paraphrases land more accurately</li>
</ul>

<p>Active listening is not a skill you master once; it is a practice you continually refine throughout your career. Each client, each session, offers new opportunities to deepen your capacity for therapeutic presence.</p>
          `
        },
        {
          title: "Section 4 Quiz",
          type: "quiz",
          order: 2,
          questions: [
            {
              question: "In Case Study 2, what was the therapist's primary error?",
              options: [
                "Not making enough eye contact",
                "Moving too quickly to interpretation using language the client wasn't ready for",
                "Being too passive",
                "Not asking enough questions"
              ],
              correctAnswer: 1,
              explanation: "The therapist moved too quickly to interpretation and used language ('controlling,' 'angry') that Sarah wasn't ready for, shutting down her own exploration."
            },
            {
              question: "In the silence case study, what made the therapist's approach effective?",
              options: [
                "Immediately asking about feelings",
                "Remaining quietly present and letting the client determine when to speak",
                "Offering tissues and reassurance",
                "Ending the session early"
              ],
              correctAnswer: 1,
              explanation: "The therapist's quiet presence made space for the client's crucial realization that emerged after the silence."
            },
            {
              question: "Which of the following is identified as a sign of growth in active listening?",
              options: [
                "Clients requiring shorter sessions",
                "Never experiencing silence in session",
                "Clients commenting on feeling heard or understood",
                "Being able to predict what clients will say"
              ],
              correctAnswer: 2,
              explanation: "Clients commenting on feeling heard or understood is one indicator that active listening skills are developing."
            }
          ]
        }
      ]
    }
  ],
  
  // Final Assessment
  finalAssessment: {
    title: "Active Listening Final Assessment",
    passingScore: 80,
    questions: [
      {
        question: "What is the primary distinction between passive hearing and active listening?",
        options: [
          "Passive hearing requires more energy than active listening",
          "Active listening is a deliberate process requiring full cognitive and emotional engagement",
          "Passive hearing is only possible with hearing aids",
          "There is no meaningful difference between the two"
        ],
        correctAnswer: 1
      },
      {
        question: "Which brain regions are involved in processing the emotional content of what we hear?",
        options: [
          "Only the auditory cortex",
          "The limbic system, including the amygdala and insula",
          "Only Broca's area",
          "The cerebellum"
        ],
        correctAnswer: 1
      },
      {
        question: "In the SOLER framework, what does maintaining an 'Open posture' communicate to clients?",
        options: [
          "Professional distance",
          "That the session is almost over",
          "An invitation for open communication without defensiveness",
          "Disapproval of what the client is sharing"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the primary purpose of minimal encouragers in active listening?",
        options: [
          "To fill silence",
          "To communicate 'I'm with you, please continue'",
          "To show you are smarter than the client",
          "To end the conversation quickly"
        ],
        correctAnswer: 1
      },
      {
        question: "When paraphrasing, the therapist should:",
        options: [
          "Repeat the client's exact words",
          "Restate the content in their own words to demonstrate understanding",
          "Add their own interpretations and advice",
          "Change the subject to something more positive"
        ],
        correctAnswer: 1
      },
      {
        question: "What distinguishes reflection of feeling from paraphrasing?",
        options: [
          "Reflection of feeling is longer",
          "Reflection of feeling addresses emotional experience while paraphrasing focuses on content",
          "Paraphrasing is only used in CBT",
          "There is no difference"
        ],
        correctAnswer: 1
      },
      {
        question: "The 'Columbo Approach' to clarifying questions involves:",
        options: [
          "Interrogating clients intensively",
          "Approaching with genuine curiosity rather than assuming you already know",
          "Only asking yes/no questions",
          "Avoiding questions entirely"
        ],
        correctAnswer: 1
      },
      {
        question: "Why might silence be therapeutically valuable?",
        options: [
          "It saves the therapist's energy",
          "It creates space for clients to think, feel, and decide what to share",
          "Insurance companies require documentation of silence",
          "It demonstrates the therapist's disapproval"
        ],
        correctAnswer: 1
      },
      {
        question: "When clients experience intense emotions, the therapist should:",
        options: [
          "Immediately change the subject",
          "Maintain steady, attuned presence without rushing to fix or soothe",
          "End the session immediately",
          "Tell them to calm down"
        ],
        correctAnswer: 1
      },
      {
        question: "Resistance from a client should be understood as:",
        options: [
          "A sign the client is manipulative",
          "Information about something important being protected",
          "A reason to terminate therapy",
          "The client being deliberately difficult"
        ],
        correctAnswer: 1
      },
      {
        question: "Cultural humility differs from cultural competence in that:",
        options: [
          "Cultural humility requires less training",
          "Cultural humility recognizes we can never be fully competent in another's cultural experience",
          "Cultural competence is more effective",
          "They are the same concept"
        ],
        correctAnswer: 1
      },
      {
        question: "In high-context communication cultures, meaning is primarily conveyed through:",
        options: [
          "Explicit verbal statements",
          "Context, nonverbal cues, and what is left unsaid",
          "Written documentation",
          "Raised voices"
        ],
        correctAnswer: 1
      },
      {
        question: "When a client's storytelling style differs from linear expectations, the therapist should:",
        options: [
          "Redirect them to get to the point",
          "Recognize that how they tell their story may be as important as the content",
          "Document disorganized thinking",
          "End the session"
        ],
        correctAnswer: 1
      },
      {
        question: "In Case Study 1 (The Reluctant Client), what made the therapist's approach effective?",
        options: [
          "Confronting the resistance directly",
          "Acknowledging the client's experience without making another demand",
          "Ignoring the client's behavior",
          "Ending therapy immediately"
        ],
        correctAnswer: 1
      },
      {
        question: "Which of the following is a sign that active listening skills are developing?",
        options: [
          "Clients requiring fewer sessions",
          "Never experiencing silence",
          "Clients commenting on feeling heard or understood",
          "Being able to predict everything clients will say"
        ],
        correctAnswer: 2
      }
    ]
  }
};

const CourseSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  subtitle: String,
  description: String,
  thumbnail: String,
  ceHours: Number,
  ceType: String,
  provider: String,
  acepNumber: String,
  targetAudience: [String],
  categories: [String],
  tags: [String],
  author: String,
  status: { type: String, default: 'draft' },
  isFree: { type: Boolean, default: false },
  learningObjectives: [String],
  settings: {
    passingScore: Number,
    allowRetakes: Boolean,
    showCorrectAnswers: Boolean,
    requireVideoCompletion: Boolean
  },
  modules: [{
    title: String,
    description: String,
    order: Number,
    lessons: [{
      title: String,
      type: { type: String, enum: ['video', 'text', 'quiz'] },
      order: Number,
      duration: Number,
      content: String,
      videoUrl: String,
      questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
      }],
      resources: [{
        title: String,
        type: String,
        url: String
      }]
    }]
  }],
  finalAssessment: {
    title: String,
    passingScore: Number,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }]
  }
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);

const rebuildCourse = async () => {
  try {
    await connectDB();
    
    // Find existing course by slug
    const existing = await Course.findOne({ slug: activeListeningCourse.slug });
    
    if (existing) {
      console.log('Found existing course:', existing.title);
      console.log('Current structure: modules =', existing.modules?.length || 0);
      
      // Update the course
      const result = await Course.updateOne(
        { slug: activeListeningCourse.slug },
        { $set: activeListeningCourse }
      );
      
      console.log('✅ Course rebuilt successfully!');
      console.log('Modified:', result.modifiedCount);
    } else {
      // Create new course
      const newCourse = new Course(activeListeningCourse);
      await newCourse.save();
      console.log('✅ New course created successfully!');
    }
    
    // Verify
    const updated = await Course.findOne({ slug: activeListeningCourse.slug });
    console.log('New structure:');
    console.log('- Modules:', updated.modules.length);
    console.log('- Total lessons:', updated.modules.reduce((sum, m) => sum + m.lessons.length, 0));
    console.log('- Final assessment questions:', updated.finalAssessment?.questions?.length || 0);
    console.log('- Status:', updated.status);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Done!');
    process.exit(0);
  }
};

rebuildCourse();
