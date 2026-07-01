/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// scripts/rebuildActiveListeningCourse.js
// Rebuilds Active Listening course to match working course format
// EXPANDED VERSION - ~5000+ words for proper 1 CE hour
// Run: node src/scripts/rebuildActiveListeningCourse.js

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
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Licensed Clinical Social Workers", "Marriage and Family Therapists", "Psychologists", "Counseling Students"],
  categories: ["Clinical Skills", "Foundational Skills"],
  tags: ["active listening", "therapeutic communication", "counseling skills", "attending behaviors", "reflection", "paraphrasing"],
  author: "CounselorReady",
  status: "draft",
  
  learningObjectives: [
    "Define active listening and differentiate it from passive hearing in clinical contexts",
    "Identify and demonstrate the six core components of active listening (attending, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing)",
    "Apply active listening techniques in challenging clinical situations including client silence, high emotion, and resistance",
    "Recognize common barriers to active listening and implement strategies to overcome them in clinical practice",
    "Adapt active listening approaches for diverse cultural contexts and communication styles",
    "Develop a personal plan for ongoing skill development in active listening"
  ],
  
  instructorCredentials: {
    name: "CounselorReady",
    credentials: "NBCC-Approved Provider",
    organization: "GA Integrated Therapeutic Perspectives LLC",
    bio: "CounselorReady is an NBCC-approved continuing education provider dedicated to delivering high-quality professional development for mental health clinicians."
  },
  
  bibliography: [
    { citation: "Egan, G. (2014). The skilled helper (10th ed.). Cengage Learning.", type: "book" },
    { citation: "Ivey, A. E., Ivey, M. B., & Zalaquett, C. P. (2018). Intentional interviewing and counseling (9th ed.). Cengage Learning.", type: "book" },
    { citation: "Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2), 95-103.", type: "journal" },
    { citation: "Horvath, A. O., & Symonds, B. D. (1991). Relation between working alliance and outcome in psychotherapy: A meta-analysis. Journal of Counseling Psychology, 38(2), 139-149.", type: "journal" },
    { citation: "Sue, D. W., & Sue, D. (2016). Counseling the culturally diverse: Theory and practice (7th ed.). John Wiley & Sons.", type: "book" },
    { citation: "Weger, H., Castle Bell, G., Minei, E. M., & Robinson, M. C. (2014). The relative effectiveness of active listening in initial interactions. International Journal of Listening, 28(1), 13-31.", type: "journal" },
    { citation: "Bodie, G. D. (2011). The Active-Empathic Listening Scale (AELS): Conceptualization and evidence of validity within the interpersonal domain. Communication Quarterly, 59(3), 277-295.", type: "journal" }
  ],
  
  completionRequirements: {
    passingScore: 80,
    mustCompleteAllModules: true,
    mustPassAssessment: true,
    mustCompleteEvaluation: true,
    description: "To receive CE credit, participants must: (1) Complete all course sections, (2) Pass the final assessment with a score of 80% or higher, and (3) Complete the course evaluation."
  },
  
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
    autoPlayNarration: false
  },

  sections: [
    // =========================================================================
    // SECTION 1: UNDERSTANDING ACTIVE LISTENING (~20 min)
    // =========================================================================
    {
      title: "Understanding Active Listening",
      description: "Foundations, definitions, and core components of active listening in clinical practice",
      order: 1,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Understanding Active Listening",
          subtitle: "The Foundation of Therapeutic Communication"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>What is Active Listening?</h3>
          <p>Active listening is far more than simply hearing words—it is a deliberate, focused process of fully engaging with a client's verbal and nonverbal communication. For mental health professionals, active listening forms the bedrock of therapeutic effectiveness. It is the skill that transforms a conversation into a therapeutic encounter.</p>
          
          <p>The term "active listening" was first coined by psychologists Carl Rogers and Richard Farson in 1957. They described it as a way of listening that requires the listener to fully concentrate, understand, respond, and remember what is being said. Unlike passive hearing—where sound waves enter our ears and we process them automatically—active listening demands intentional effort and full presence.</p>
          
          <p>Consider the difference between hearing and listening. You might hear the hum of an air conditioner without actively processing it. But when a client says, "I don't know if I can keep going like this," active listening means not only hearing those words but attending to the tremor in their voice, the slump in their shoulders, the deeper meaning beneath the surface statement.</p>
          
          <p>Active listening involves several interconnected elements that work together:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Full attention</strong> — Eliminating distractions and being fully present with the client. This means putting away phones, closing unnecessary browser tabs, and mentally setting aside other concerns. It also means managing your internal distractions—your own worries, your next appointment, your mental to-do list.</li>
            <li><strong>Nonverbal engagement</strong> — Maintaining appropriate eye contact, open body posture, and facial expressions that convey genuine interest. Research suggests that up to 93% of communication is nonverbal. Your body language speaks before your words do, and clients are remarkably attuned to whether you're truly present.</li>
            <li><strong>Verbal acknowledgment</strong> — Using brief responses ("I see," "Go on," "Tell me more") to encourage continued sharing without interrupting the client's flow. These minimal encouragers signal that you're tracking and that it's safe to continue.</li>
            <li><strong>Withholding judgment</strong> — Creating a safe space free from criticism or premature interpretation. Clients can sense when they're being evaluated, and judgment—even subtle judgment communicated through a raised eyebrow or slight recoil—shuts down disclosure.</li>
            <li><strong>Reflection and clarification</strong> — Demonstrating understanding through paraphrasing and asking clarifying questions that show you're tracking their narrative. This is where active listening becomes visible to the client.</li>
          </ul>
          
          <h3>Why Active Listening Matters in Therapy</h3>
          <p>Research consistently demonstrates that clients who feel heard and understood show greater treatment engagement and retention, increased willingness to explore difficult emotions, stronger therapeutic alliance, and better treatment outcomes across modalities. The evidence base for active listening spans decades of research.</p>
          
          <p>Carl Rogers, founder of person-centered therapy, identified empathic listening as one of three core conditions necessary for therapeutic change (along with unconditional positive regard and congruence). When clients experience being deeply heard, often for the first time in their lives, it creates a corrective emotional experience that facilitates healing. Many clients have spent years feeling invisible, dismissed, or misunderstood. The experience of genuine listening can be profoundly validating.</p>
          
          <p>A landmark meta-analysis by Horvath and Symonds (1991) found that the therapeutic alliance accounts for approximately 30% of treatment outcome variance—and active listening is fundamental to building that alliance. To put this in perspective, specific therapeutic techniques account for only about 15% of outcome variance. The relationship matters more than the method, and active listening is the primary tool for building that relationship.</p>
          
          <p>More recent research by Weger and colleagues (2014) demonstrated that active listening responses led to significantly greater feelings of being understood compared to simple acknowledgments or giving advice. Participants who received active listening responses also reported greater satisfaction with the conversation and more positive perceptions of the listener.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Common Barriers to Active Listening",
              content: `<p>Even well-trained clinicians can fall into patterns that undermine active listening. Awareness of these barriers is the first step to overcoming them:</p>
              <p><strong>1. Planning your response</strong> while the client is still speaking — This is perhaps the most common barrier. As soon as we hear a client describe a problem, our minds often race to solutions. This splits your attention and causes you to miss important information. The client may still be building toward their main point while you're already formulating your response.</p>
              <p><strong>2. Premature problem-solving</strong> before fully understanding the concern — The urge to help can actually interfere with helping. Many clinicians, particularly early in their careers, feel pressure to demonstrate their value by offering solutions. But a solution offered before the problem is fully understood often misses the mark and can make clients feel unheard.</p>
              <p><strong>3. Personal reactions</strong> that shift focus from client to clinician — Your own emotional responses, while valid, need to be managed. If a client's story triggers your own memories or emotions, you may find yourself attending more to your internal experience than to the client. This doesn't mean suppressing your reactions—it means noticing them and choosing where to direct your attention.</p>
              <p><strong>4. Fatigue or distraction</strong> from a demanding caseload — Burnout erodes listening capacity. After your sixth session of the day, it becomes harder to bring full presence to the seventh. Self-care isn't selfish—it's essential for maintaining the capacity to listen well.</p>
              <p><strong>5. Assumptions</strong> based on previous sessions or client demographics — Each moment is new; avoid operating on autopilot. You may think you know where a client is going based on previous sessions, but assumptions close us off to new information. The client sitting before you today may have shifted in ways you won't discover if you're not listening freshly.</p>
              <p><strong>6. Environmental distractions</strong> — Noise, interruptions, uncomfortable temperature, and poor lighting all compete for attention. While we can't control everything, we can minimize distractions by silencing phones, closing doors, and creating a comfortable therapeutic environment.</p>`
            },
            {
              title: "Active Listening vs. Passive Hearing",
              content: `<p>Understanding the distinction between active listening and passive hearing helps clarify what we're aiming for in clinical practice.</p>
              <p><strong>Passive hearing involves:</strong></p>
              <ul>
                <li>Waiting for your turn to speak</li>
                <li>Surface-level attention to words only</li>
                <li>Focus on content while missing emotion</li>
                <li>Minimal feedback to the speaker</li>
                <li>Judgment or evaluation of what's being said</li>
                <li>Formulating responses while the other speaks</li>
                <li>Selective attention to parts that interest you</li>
              </ul>
              <p><strong>Active listening involves:</strong></p>
              <ul>
                <li>Seeking to understand before seeking to respond</li>
                <li>Deep engagement with the whole person</li>
                <li>Attention to emotion, meaning, and nonverbal cues</li>
                <li>Regular reflection and clarification</li>
                <li>Acceptance, curiosity, and non-judgment</li>
                <li>Suspending your own agenda</li>
                <li>Full attention to everything being communicated</li>
              </ul>
              <p>The difference is immediately perceptible to clients. They know when they're truly being heard versus when someone is merely waiting to respond. Research shows that people can accurately detect whether a listener is truly attending or merely pretending to listen. Clients who feel heard are more likely to continue sharing, go deeper into difficult material, and remain engaged in treatment.</p>`
            },
            {
              title: "The Neuroscience of Being Heard",
              content: `<p>Understanding what happens in the brain when someone feels heard helps explain why active listening is so powerful therapeutically.</p>
              <p>When a person feels genuinely listened to, several neurobiological processes occur:</p>
              <ul>
                <li><strong>Reduced amygdala activation</strong> — The brain's threat detection center calms down when we feel safe and understood, reducing the fight-flight-freeze response</li>
                <li><strong>Increased prefrontal cortex activity</strong> — As threat decreases, higher-order thinking and reflection become more accessible</li>
                <li><strong>Oxytocin release</strong> — The "bonding hormone" is released during positive social connection, promoting trust and attachment</li>
                <li><strong>Nervous system co-regulation</strong> — A calm, regulated clinician helps the client's nervous system settle through social engagement</li>
              </ul>
              <p>This explains why active listening isn't just "nice"—it's neurobiologically necessary for therapeutic change. Clients cannot process trauma, develop insight, or make lasting changes while their nervous systems are in a state of threat. Active listening creates the safety that makes deeper work possible.</p>`
            }
          ]
        },
        {
          type: "text",
          order: 4,
          textContent: `<h3>The Six Core Components of Active Listening</h3>
          <p>Effective active listening integrates multiple skill sets that work together to create a powerful therapeutic presence. Each component builds on the others, and mastery requires developing all six.</p>
          
          <h4>1. Attending Behaviors (The SOLER Framework)</h4>
          <p>Attending behaviors communicate your full presence and interest through nonverbal channels. Gerard Egan's SOLER Framework, introduced in his influential text "The Skilled Helper," provides a useful structure for organizing these behaviors:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>S — Squarely face the client</strong> — Position yourself to face the client directly, or at a slight angle if that feels more comfortable for the client. This physical orientation communicates "I am here with you." Turning away, even partially, can signal disinterest or avoidance.</li>
            <li><strong>O — Open posture</strong> — Avoid crossed arms, crossed legs, or other closed positions that signal defensiveness or disinterest. An open posture communicates receptivity and welcome. Note that what constitutes "open" may vary across cultures and individuals.</li>
            <li><strong>L — Lean slightly forward</strong> — A slight forward lean shows engagement and interest without invading personal space. Leaning back can appear disengaged or overly casual. The key word is "slightly"—leaning too far forward can feel intrusive.</li>
            <li><strong>E — Eye contact</strong> — Maintain comfortable, culturally appropriate eye contact. Eye contact communicates attention and interest. However, unbroken staring can feel aggressive or uncomfortable. Natural eye contact involves periodic breaks and returns.</li>
            <li><strong>R — Relaxed posture</strong> — Appear natural and at ease, not stiff or anxious. Tension in the clinician's body can communicate anxiety or judgment, making the client feel unsafe. A relaxed presence invites the client to relax as well.</li>
          </ul>
          <p><em>Important Cultural Note:</em> Eye contact norms vary significantly across cultures. Some clients may find direct eye contact disrespectful, intrusive, or uncomfortable. In some cultures, avoiding eye contact with authority figures is a sign of respect. Observe client preferences and adapt accordingly. When in doubt, you can ask: "I want to make sure you're comfortable—what works best for you in terms of eye contact?"</p>
          
          <h4>2. Minimal Encouragers</h4>
          <p>Brief verbal and nonverbal responses that encourage continued sharing without interrupting the client's flow. These small signals communicate "I'm with you, keep going." Examples include:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Verbal: "Mm-hmm" / "I see" / "Go on" / "Yes" / "Uh-huh" / "Right"</li>
            <li>Nonverbal: Nodding, leaning in slightly, facial expressions of interest</li>
            <li>Brief prompts: "Tell me more" / "And then?" / "What happened next?"</li>
          </ul>
          <p>Use these naturally and sparingly—overuse can feel mechanical or dismissive, as if you're just going through the motions. The goal is to lubricate the conversation, not to fill every silence. A minimal encourager every 30-60 seconds during a client's narrative is typically sufficient.</p>
          
          <h4>3. Paraphrasing</h4>
          <p>Restating the client's message in your own words serves multiple crucial purposes: it demonstrates understanding, allows correction if you misunderstood, helps clients hear their own thoughts reflected back, and slows down the conversation to allow for deeper processing.</p>
          <p><strong>Effective paraphrasing formulas:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>"So what I'm hearing is..."</li>
            <li>"It sounds like..."</li>
            <li>"Let me see if I understand..."</li>
            <li>"In other words..."</li>
            <li>"So you're saying that..."</li>
          </ul>
          <p><strong>Example exchange:</strong></p>
          <p><em>Client:</em> "I just don't know what to do anymore. My husband keeps saying he'll change but nothing ever does. I'm exhausted from hoping."</p>
          <p><em>Paraphrase:</em> "It sounds like you've been holding onto hope for a long time, and the repeated disappointments have worn you down."</p>
          <p>Notice that the paraphrase captures the essence without repeating the exact words. This shows processing, not just echoing.</p>
          
          <h4>4. Reflection of Feeling</h4>
          <p>Going beyond content to name the emotions underlying the client's words. This is perhaps the most powerful active listening skill because it communicates deep understanding and helps clients connect with their emotional experience.</p>
          <p><strong>Basic formula:</strong> "You feel [emotion] because [situation/reason]"</p>
          <p><strong>Example exchange:</strong></p>
          <p><em>Client:</em> "Every time I try to talk to my mother about this, she changes the subject or makes it about her."</p>
          <p><em>Reflection:</em> "You feel frustrated and perhaps invisible when your mother can't seem to focus on your experience."</p>
          <p>Reflection of feeling requires emotional attunement—reading between the lines to sense what the client is feeling even when they haven't named it directly. This skill develops with practice and helps clients develop their own emotional vocabulary.</p>
          
          <h4>5. Clarifying Questions</h4>
          <p>Open-ended questions that deepen understanding without leading the client toward your assumptions. Good clarifying questions invite exploration rather than closing it down.</p>
          <p><strong>Effective clarifying questions:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>"Can you tell me more about that?"</li>
            <li>"What was that experience like for you?"</li>
            <li>"When you say 'overwhelmed,' what does that feel like in your body?"</li>
            <li>"Help me understand what you mean by..."</li>
            <li>"What stands out most to you about that situation?"</li>
          </ul>
          <p><strong>Questions to avoid early in treatment:</strong> "Why" questions can feel accusatory or push clients toward intellectualization rather than emotional exploration. "Why did you do that?" can sound like "What's wrong with you?" Better to ask "What was going on for you when that happened?"</p>
          
          <h4>6. Summarizing</h4>
          <p>Periodically pulling together main themes and content serves multiple functions: it demonstrates you've been tracking the conversation, helps clients see patterns they might have missed, provides natural transition points in the session, and consolidates the session's work.</p>
          <p><strong>Example summary:</strong> "Let me make sure I'm following. Today we've talked about the conflict with your sister, how it connects to childhood patterns where you felt like the peacekeeper, and the grief you're feeling about potentially losing that relationship. Does that capture it?"</p>
          <p>Always end summaries with a check-in ("Does that capture it?" / "What would you add?" / "Did I miss anything?") to allow the client to correct or add to your understanding. Summaries are collaborative, not pronouncements.</p>`
        }
      ],
      quizQuestions: [
        {
          question: "In the SOLER framework for attending behaviors, what does the 'O' stand for?",
          type: "multipleChoice",
          options: [
            { text: "Observe carefully", isCorrect: false },
            { text: "Open posture", isCorrect: true },
            { text: "Orient toward client", isCorrect: false },
            { text: "Offer feedback", isCorrect: false }
          ],
          explanation: "In the SOLER framework, O stands for Open posture—avoiding crossed arms or other closed positions that might signal defensiveness or disinterest."
        },
        {
          question: "According to Carl Rogers, empathic listening is one of how many core conditions necessary for therapeutic change?",
          type: "multipleChoice",
          options: [
            { text: "Two", isCorrect: false },
            { text: "Three", isCorrect: true },
            { text: "Four", isCorrect: false },
            { text: "Five", isCorrect: false }
          ],
          explanation: "Carl Rogers identified three core conditions necessary for therapeutic change: empathy (empathic listening), unconditional positive regard, and congruence (genuineness)."
        },
        {
          question: "Which response demonstrates reflection of feeling rather than paraphrasing?",
          type: "multipleChoice",
          options: [
            { text: "So you are saying the situation at work has been difficult.", isCorrect: false },
            { text: "It sounds like you have been dealing with a lot of stress lately.", isCorrect: false },
            { text: "You feel frustrated and unappreciated when your contributions go unrecognized.", isCorrect: true },
            { text: "Let me make sure I understand—your manager has not acknowledged your work.", isCorrect: false }
          ],
          explanation: "Reflection of feeling specifically names the emotions underlying the client's words ('frustrated and unappreciated'), while paraphrasing restates the content without naming emotions."
        },
        {
          question: "The therapeutic alliance accounts for approximately what percentage of treatment outcome variance according to research?",
          type: "multipleChoice",
          options: [
            { text: "10%", isCorrect: false },
            { text: "20%", isCorrect: false },
            { text: "30%", isCorrect: true },
            { text: "50%", isCorrect: false }
          ],
          explanation: "Horvath and Symonds' meta-analysis found that the therapeutic alliance accounts for approximately 30% of treatment outcome variance, highlighting the importance of relationship-building skills like active listening."
        },
        {
          question: "Which of the following is a common barrier to active listening?",
          type: "multipleChoice",
          options: [
            { text: "Using minimal encouragers", isCorrect: false },
            { text: "Planning your response while the client is still speaking", isCorrect: true },
            { text: "Maintaining appropriate eye contact", isCorrect: false },
            { text: "Summarizing periodically", isCorrect: false }
          ],
          explanation: "Planning your response while the client is still speaking splits your attention and causes you to miss important information, making it a significant barrier to active listening."
        }
      ]
    },

    // =========================================================================
    // SECTION 2: PRACTICAL APPLICATION (~20 min)
    // =========================================================================
    {
      title: "Applying Active Listening Skills",
      description: "Practical techniques, challenging situations, and skill development strategies",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "Applying Active Listening Skills",
          subtitle: "Techniques for Real-World Practice"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Practical Techniques for Active Listening</h3>
          <p>Moving from understanding active listening concepts to embodying them in session requires deliberate practice. Knowledge alone doesn't create skill—you must practice these techniques repeatedly until they become natural. Here are concrete techniques to develop mastery.</p>
          
          <h4>Technique 1: The 3-Second Pause</h4>
          <p>Before responding to a client, pause for three seconds. This brief delay may feel awkward at first, but it serves multiple important purposes:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Ensures the client has finished speaking (they may have more to say after what seemed like a natural stopping point)</li>
            <li>Gives you time to process what you heard rather than responding reflexively</li>
            <li>Demonstrates thoughtfulness rather than reactivity</li>
            <li>Prevents interrupting, which communicates that your response is more important than their expression</li>
            <li>Creates space for the client to go deeper if they choose</li>
          </ul>
          <p><strong>Practice tip:</strong> Set a subtle reminder (like a small object on your desk) to prompt the pause until it becomes automatic. Count "one-one-thousand, two-one-thousand, three-one-thousand" silently before responding. The pause may feel uncomfortable at first, but clients rarely notice and often appreciate the thoughtful response that follows.</p>
          
          <h4>Technique 2: Listen for the "Music" Behind the Words</h4>
          <p>Communication experts often describe spoken language as having both "lyrics" (the words) and "music" (the paralinguistic elements). Active listeners attend to both. The music often reveals more than the lyrics.</p>
          <p>Pay attention to these paralinguistic cues:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Tone:</strong> Does it match the content? A client saying "I'm fine" with a flat, hollow tone signals incongruence. A client describing a traumatic event with animated excitement may be dissociating from the affect.</li>
            <li><strong>Pace:</strong> Rapid speech may indicate anxiety, mania, or avoidance of deeper feelings. Slow speech may suggest depression, careful consideration, or difficulty finding words for painful experiences.</li>
            <li><strong>Volume:</strong> Softness on certain topics may signal shame, fear, or the sense that something is unspeakable. Increased volume might indicate anger, emphasis, or a need to be heard.</li>
            <li><strong>Emphasis:</strong> What words does the client stress? "He said he LOVED me" versus "He SAID he loved me" communicate very different meanings. Listen for where the emphasis falls.</li>
            <li><strong>Breath:</strong> Held breath, sighing, or changes in breathing pattern often signal emotional shifts before words do.</li>
          </ul>
          
          <h4>Technique 3: Track Themes, Not Just Facts</h4>
          <p>Novice clinicians often try to remember every detail a client shares, which is both exhausting and ultimately less useful than tracking patterns. Instead of trying to catalog facts, listen for recurring themes:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>What relationships keep coming up? Are there patterns in how the client describes different relationships?</li>
            <li>What emotions appear repeatedly? Is there an emotional signature to this client's experience?</li>
            <li>What situations trigger strong reactions? What are the client's "hot buttons"?</li>
            <li>What values seem central to this person? What matters most to them?</li>
            <li>What is absent? What topics does the client avoid or skim over?</li>
          </ul>
          <p>Theme tracking helps you see the forest rather than getting lost in the trees. It also positions you to offer powerful summaries that help clients see patterns they couldn't see themselves.</p>
          
          <h4>Technique 4: The "Columbo" Approach</h4>
          <p>Like the famous TV detective played by Peter Falk, approach clients with genuine curiosity rather than expertise. Detective Columbo solved cases not by pronouncing conclusions but by asking seemingly simple questions with genuine puzzlement. Adopt the stance of someone who truly doesn't know and wants to understand:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>"Help me understand..."</li>
            <li>"I'm curious about..."</li>
            <li>"What was that like for you?"</li>
            <li>"I want to make sure I'm getting this right..."</li>
            <li>"Can you walk me through that?"</li>
          </ul>
          <p>This stance creates safety (you're not the expert pronouncing judgment) and often elicits richer information than direct questioning. It also communicates respect—you're positioning the client as the expert on their own experience.</p>
          
          <h4>Technique 5: Name What You Notice</h4>
          <p>When you observe something—a shift in posture, a change in breathing, a flash of emotion across the face—consider naming it gently:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>"I notice you just took a deep breath when you mentioned your father."</li>
            <li>"Something shifted when you said that. What's happening for you?"</li>
            <li>"You smiled just now, but your eyes look sad."</li>
          </ul>
          <p>This technique brings implicit experience into explicit awareness and communicates that you're paying close attention. Use it sparingly—constant commenting on observations can feel intrusive. But well-timed observations can open important doors.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Common Mistakes to Avoid",
              content: `<p>Even experienced clinicians can fall into these patterns. Awareness is the first step to change.</p>
              <p><strong>The Parrot Trap:</strong> Repeating the client's words verbatim rather than paraphrasing using your own words. "So your mother criticizes you" is parroting. "It sounds like nothing you do is ever good enough for her" is paraphrasing. Parroting can feel mechanical and doesn't demonstrate understanding—only that you heard the words.</p>
              <p><strong>The Interrogation:</strong> Rapid-fire questions that feel like a police interview. Question after question, with no reflection or acknowledgment between them, communicates that you're gathering data rather than connecting. Better approach: One question, then listen fully, reflect, and only then ask another question if needed.</p>
              <p><strong>The Expert Trap:</strong> Jumping to interpretations or solutions before fully understanding. The urge to demonstrate competence can lead us to offer insights prematurely. Stay curious longer—understanding must precede intervention. A brilliant interpretation that comes too soon will fall flat; the same interpretation offered after the client feels fully heard will land.</p>
              <p><strong>The Reassurance Reflex:</strong> Saying "It'll be okay" or "Don't worry" to ease discomfort (yours or theirs). This minimizes the client's experience and can feel dismissive. Better: Validate the difficulty ("This is really hard") without rushing past it. Sit with the discomfort rather than trying to fix it immediately.</p>
              <p><strong>The Autobiography:</strong> Responding to client disclosures with your own similar experiences. "I know exactly what you mean—when I went through my divorce..." The focus should remain on the client. Save self-disclosure for strategic, intentional moments when it truly serves the client.</p>
              <p><strong>The Fix-It Response:</strong> Immediately offering solutions or advice. "Have you tried..." or "You should..." Clients often need to feel heard before they're ready to problem-solve. Premature solutions communicate that you want to move past their pain rather than witness it.</p>`
            },
            {
              title: "Working with Silence",
              content: `<p>Silence can feel uncomfortable, but it often serves important therapeutic functions. Learning to tolerate and even welcome silence is a mark of clinical maturity.</p>
              <p><strong>Types of Therapeutic Silence:</strong></p>
              <ul>
                <li><strong>Processing silence:</strong> The client is integrating insights, making connections, or formulating thoughts. This silence is productive—something is happening internally even though nothing is being said.</li>
                <li><strong>Emotional silence:</strong> Feelings are too intense for words. The client may be on the verge of tears, overwhelmed by sensation, or touching something deep. This silence should be protected, not interrupted.</li>
                <li><strong>Resistant silence:</strong> The client is unsure about sharing, testing whether the therapist can tolerate discomfort, or protecting themselves from vulnerability. This silence invites patient, non-anxious presence.</li>
                <li><strong>Confused silence:</strong> The client doesn't understand a question or doesn't know how to respond. This is the one type of silence that may benefit from gentle intervention.</li>
              </ul>
              <p><strong>Strategies for Working with Silence:</strong></p>
              <ul>
                <li>Tolerate the discomfort—don't rush to fill space. Your ability to sit with silence communicates that all of the client's experience is welcome, including the parts without words.</li>
                <li>Use nonverbal encouragement (gentle nod, open posture, soft facial expression) to communicate continued presence</li>
                <li>After extended silence (30+ seconds), gently inquire: "What's happening for you right now?" or "Where did you go just now?"</li>
                <li>Normalize: "Take your time. There's no rush here."</li>
                <li>Consider whether the silence is productive or stuck—sometimes silence needs protection, sometimes it needs gentle movement</li>
              </ul>
              <p>The ability to sit comfortably with silence is a hallmark of clinical maturity. It communicates confidence and safety.</p>`
            },
            {
              title: "When Clients Are Highly Emotional",
              content: `<p>Intense emotions can pull for action rather than listening. When a client is sobbing, raging, or panicking, the clinician's instinct may be to do something—offer a tissue, say something comforting, suggest a coping skill. But often the most powerful intervention is simply being fully present with the emotion.</p>
              <p><strong>Do:</strong></p>
              <ul>
                <li>Stay present and grounded in your own body. Feel your feet on the floor, your back against the chair. Your groundedness becomes an anchor for the client.</li>
                <li>Offer tissues without comment or interruption—simply make them available</li>
                <li>Maintain calm, steady presence. Your regulated nervous system helps the client's nervous system settle (co-regulation). Breathe slowly and evenly.</li>
                <li>Reflect the emotion when appropriate: "There's so much pain here" or "These tears have been waiting a long time"</li>
                <li>Allow the emotion to move through without trying to stop it. Emotions are like waves—they rise, peak, and recede if allowed to flow</li>
                <li>Trust the client's capacity to handle their own feelings</li>
              </ul>
              <p><strong>Don't:</strong></p>
              <ul>
                <li>Try to stop the tears or calm them down prematurely. "Don't cry" communicates that the emotion is unwelcome.</li>
                <li>Rush to comfort, reassure, or fix the situation. This can communicate that you're uncomfortable with their pain.</li>
                <li>Become dysregulated yourself. If you find yourself getting anxious, breathe and ground.</li>
                <li>Change the subject to something less intense. This communicates that you can't handle their pain.</li>
                <li>Touch without permission—a well-meant hand on the shoulder can feel intrusive to some clients</li>
              </ul>
              <p>Remember: Emotions need to be witnessed, not managed. Often the most healing thing we can offer is our steady, accepting presence in the face of overwhelming feeling.</p>`
            },
            {
              title: "Managing Personal Triggers",
              content: `<p>When client material activates your own history, reactions, or vulnerabilities, it can interfere with active listening. Every clinician has areas of personal sensitivity. The goal isn't to eliminate these reactions but to manage them skillfully.</p>
              <p><strong>In the moment:</strong></p>
              <ul>
                <li>Ground yourself physically (feel feet on floor, notice the texture of the chair, take a slow breath). This activates your parasympathetic nervous system and helps you regulate.</li>
                <li>Refocus attention on the client. Silently remind yourself: "This is about them, not me."</li>
                <li>Use your reaction as clinical data, not direction for intervention. Your strong response may be telling you something about the intensity of the client's experience—but check this carefully.</li>
                <li>If needed, buy time: "Let me make sure I understand what you're saying..." gives you a moment to collect yourself.</li>
              </ul>
              <p><strong>After session:</strong></p>
              <ul>
                <li>Note what was triggered—be specific about what the client said or did and what it activated in you</li>
                <li>Discuss in supervision. This is what supervision is for. Don't suffer in silence.</li>
                <li>Consider personal therapy if patterns emerge. If certain material consistently triggers you, your own therapeutic work may be needed.</li>
                <li>Practice self-compassion. Being triggered doesn't mean you're a bad clinician—it means you're human.</li>
              </ul>
              <p>The most dangerous triggers are the ones we don't recognize. Regular self-reflection and honest supervision help us know ourselves well enough to manage our reactions.</p>`
            },
            {
              title: "Working with Resistance",
              content: `<p>When clients seem unwilling to engage, dismissive, or hostile, our active listening skills are tested. Resistance often looks like one-word answers, topic changes, intellectualization, or overt hostility.</p>
              <p><strong>Reframe resistance as communication:</strong> Rather than seeing resistance as an obstacle, view it as information. The client is telling you something through their reluctance. They may be testing safety, protecting themselves from vulnerability, or expressing ambivalence about change.</p>
              <p><strong>Strategies:</strong></p>
              <ul>
                <li>Name what you notice without judgment: "I notice it's hard to talk about this" or "You seem hesitant today"</li>
                <li>Explore the resistance with curiosity: "What would it mean to let me in on this?"</li>
                <li>Validate the protective function: "It makes sense that you'd be careful about who you trust with this"</li>
                <li>Lower the demand: "You don't have to share anything you're not ready for"</li>
                <li>Stay patient and non-anxious. Your calm persistence communicates that you can handle whatever they bring.</li>
              </ul>
              <p>Remember: Resistance that meets patience and acceptance often melts. Resistance that meets pressure usually hardens.</p>`
            }
          ]
        },
        {
          type: "text",
          order: 4,
          textContent: `<h3>Telehealth Considerations</h3>
          <p>Active listening through a screen requires adaptation. The telehealth environment creates unique challenges: reduced nonverbal information, potential technical issues, and the fatigue of video communication. However, effective active listening is absolutely possible in virtual settings with some adjustments.</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Camera position:</strong> Position your camera at eye level for natural eye contact. Looking down at a laptop camera makes you appear disengaged; looking up makes you appear distracted.</li>
            <li><strong>Background:</strong> Minimize visual distractions in your background. A cluttered or busy background competes for the client's attention.</li>
            <li><strong>Verbal encouragers:</strong> Use verbal encouragers more frequently since nonverbal cues are harder to see. A nod that would communicate engagement in person may not be visible on screen.</li>
            <li><strong>Technical issues:</strong> Name technical issues directly: "I think we had a lag—could you repeat that last part?" This normalizes the technology and ensures you don't miss important content.</li>
            <li><strong>Check-ins:</strong> Check in more often: "I want to make sure I'm following you" or "How are you doing with the video format today?"</li>
            <li><strong>Your own image:</strong> Consider hiding your self-view if watching yourself is distracting. Looking at your own image takes attention away from the client.</li>
            <li><strong>Zoom fatigue:</strong> Acknowledge the fatigue of video sessions and take it into account in session pacing.</li>
          </ul>
          
          <h3>Building a Practice Habit</h3>
          <p>Active listening improves with deliberate practice—not just doing the work, but reflecting on how you're doing it. Research on expertise development shows that improvement requires focused attention on specific skills, not just accumulated hours.</p>
          <ol style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Choose one component to focus on each week.</strong> This week, notice your use of minimal encouragers. Next week, focus on reflection of feeling. Trying to improve everything at once improves nothing.</li>
            <li><strong>Set an intention before each session.</strong> "Today I will pause for three seconds before each response" or "Today I will make at least three reflections of feeling."</li>
            <li><strong>Self-evaluate briefly after sessions.</strong> Take two minutes after each session to note: What went well? What would I do differently? What did I notice about my listening?</li>
            <li><strong>Seek feedback through supervision or peer consultation.</strong> We cannot see ourselves accurately. External feedback helps us recognize blind spots.</li>
            <li><strong>Record sessions (with consent) for self-review.</strong> Watching yourself is uncomfortable but illuminating. You'll notice things you couldn't see in the moment.</li>
          </ol>
          <p>Remember: Mastery comes through mindful repetition, not just understanding concepts. You can read about swimming for years, but you only learn to swim by getting in the water.</p>`
        }
      ],
      quizQuestions: [
        {
          question: "The '3-second pause' technique is recommended primarily to:",
          type: "multipleChoice",
          options: [
            { text: "Give the clinician time to plan an intervention", isCorrect: false },
            { text: "Ensure the client has finished speaking and allow processing time", isCorrect: true },
            { text: "Create dramatic effect in the conversation", isCorrect: false },
            { text: "Allow the clinician to check their notes", isCorrect: false }
          ],
          explanation: "The 3-second pause ensures the client has finished speaking, gives the clinician time to process what was heard, demonstrates thoughtfulness, and prevents interrupting."
        },
        {
          question: "When working with a client who becomes highly emotional during session, the clinician should:",
          type: "multipleChoice",
          options: [
            { text: "Quickly change the subject to help the client calm down", isCorrect: false },
            { text: "Offer reassurance that everything will be okay", isCorrect: false },
            { text: "Stay present and grounded, allowing the emotion to move through", isCorrect: true },
            { text: "End the session early to give the client time to compose themselves", isCorrect: false }
          ],
          explanation: "When clients are highly emotional, clinicians should stay present and grounded, maintain calm steady presence, and allow the emotion to move through. Emotions need to be witnessed, not managed."
        },
        {
          question: "The 'Columbo approach' to active listening refers to:",
          type: "multipleChoice",
          options: [
            { text: "Asking rapid-fire questions to gather information quickly", isCorrect: false },
            { text: "Approaching clients with genuine curiosity rather than expertise", isCorrect: true },
            { text: "Catching clients in inconsistencies in their stories", isCorrect: false },
            { text: "Using silence as an interrogation technique", isCorrect: false }
          ],
          explanation: "The Columbo approach involves approaching clients with genuine curiosity rather than expertise, creating safety and eliciting richer information."
        },
        {
          question: "In telehealth sessions, clinicians should:",
          type: "multipleChoice",
          options: [
            { text: "Use fewer verbal encouragers since the client can see them", isCorrect: false },
            { text: "Use more verbal encouragers since nonverbal cues are harder to see", isCorrect: true },
            { text: "Avoid eye contact to reduce screen fatigue", isCorrect: false },
            { text: "Speak more quickly to maintain engagement", isCorrect: false }
          ],
          explanation: "In telehealth, clinicians should use verbal encouragers more frequently because nonverbal cues are harder to see through a screen."
        },
        {
          question: "The 'Parrot Trap' refers to:",
          type: "multipleChoice",
          options: [
            { text: "Talking too much during sessions", isCorrect: false },
            { text: "Repeating the client's exact words instead of paraphrasing in your own words", isCorrect: true },
            { text: "Using too many clarifying questions", isCorrect: false },
            { text: "Interrupting the client frequently", isCorrect: false }
          ],
          explanation: "The Parrot Trap is repeating the client's exact words verbatim rather than paraphrasing using your own words, which fails to demonstrate genuine understanding and processing."
        }
      ]
    },

    // =========================================================================
    // SECTION 3: CULTURAL CONSIDERATIONS (~15 min)
    // =========================================================================
    {
      title: "Cultural Considerations in Active Listening",
      description: "Adapting active listening for diverse cultural contexts",
      order: 3,
      estimatedTime: 15,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 3,
          title: "Cultural Considerations",
          subtitle: "Listening Across Difference"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>The Foundation of Cultural Humility</h3>
          <p>Effective active listening requires cultural humility and awareness. What communicates presence and engagement in one cultural context may convey disrespect or discomfort in another. A behavior that feels natural and connecting to you might feel intrusive or strange to a client from a different cultural background.</p>
          
          <p>Cultural humility differs fundamentally from cultural competence. While competence implies mastery—a destination at which one arrives—humility acknowledges that we can never fully understand another person's cultural experience. Culture is not a checklist of facts to memorize but a living, complex reality that varies between individuals even within the same cultural group.</p>
          
          <p>Cultural humility involves:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Lifelong learning and self-reflection</strong> — Recognizing that understanding culture is an ongoing process, not a destination. We are always learning, always encountering the limits of our knowledge.</li>
            <li><strong>Recognizing power imbalances</strong> — Acknowledging the inherent power differential in the therapeutic relationship and how this intersects with broader social power dynamics related to race, ethnicity, class, and other identities.</li>
            <li><strong>Client as expert</strong> — Positioning the client as the expert on their own cultural experience rather than assuming our knowledge of their group applies to them as an individual.</li>
            <li><strong>Examining our own cultural lens</strong> — Understanding that our own cultural background shapes what we consider "normal" communication, including our ideas about active listening.</li>
          </ul>
          
          <h3>Eye Contact Across Cultures</h3>
          <p>The SOLER framework emphasizes eye contact as a key attending behavior, but direct gaze carries very different meanings across cultures. What feels like engaged attention in one context may feel like aggressive intrusion in another.</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Western European and American contexts</strong> often interpret direct eye contact as confidence, honesty, and engagement. Averting gaze may be read as evasiveness or disinterest.</li>
            <li><strong>Many Asian cultures</strong> consider prolonged direct eye contact with authority figures or elders to be disrespectful or challenging. Looking down or away may indicate respect, not avoidance.</li>
            <li><strong>Some Indigenous communities</strong> view direct eye contact as aggressive, intrusive, or spiritually inappropriate. Extended eye contact may be reserved for intimate relationships.</li>
            <li><strong>Many African and Caribbean cultures</strong> have nuanced rules about eye contact based on age, gender, and social status. Children may be taught not to look adults in the eye.</li>
            <li><strong>Some Middle Eastern cultures</strong> have different eye contact norms between genders, with prolonged cross-gender eye contact considered inappropriate.</li>
          </ul>
          <p><em>Clinical Implication:</em> Rather than assuming a client who averts their gaze is resistant, dishonest, or disengaged, approach with curiosity. You might ask: "I want to make sure you're comfortable in here. What works best for you in terms of eye contact?" This respects the client's preferences without making assumptions.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Silence Across Cultures",
              content: `<p>Western therapeutic models often interpret silence as resistance, discomfort, or therapeutic "stuck points." However, silence carries very different meanings across cultures:</p>
              <ul>
                <li><strong>Many Native American traditions</strong> value silence as a sign of respect and thoughtfulness. Speaking too quickly after someone else may be seen as not properly considering their words. Extended silence allows for reflection and honors the weight of what was said.</li>
                <li><strong>Some Asian cultures</strong> use silence to process information thoroughly before responding. Immediate responses may be seen as superficial or disrespectful. Silence indicates that the speaker's words are being taken seriously.</li>
                <li><strong>Certain African cultures</strong> incorporate contemplative silence as part of meaningful conversation. Silence is not empty but full—a space for the conversation to breathe.</li>
                <li><strong>Finnish and Scandinavian cultures</strong> are often comfortable with extended silences that might feel awkward in American contexts. Silence is not a problem to be solved.</li>
              </ul>
              <p><em>Clinical Implication:</em> Extend your tolerance for silence when working cross-culturally. If uncertain about the meaning of silence, gently inquire: "I notice we're both quiet. Is this silence helpful for you, or would you like me to say something?" This gives the client control over the pace without imposing your comfort level.</p>`
            },
            {
              title: "Emotional Expression and Display Rules",
              content: `<p>Cultures have different "display rules" governing how, when, and whether emotions should be expressed. These rules shape what clients bring to therapy and how they may respond to emotional exploration.</p>
              <ul>
                <li><strong>Individualistic cultures</strong> often encourage open emotional expression as healthy, authentic, and even necessary for wellbeing. "Getting it out" is seen as therapeutic.</li>
                <li><strong>Collectivistic cultures</strong> may value emotional restraint to maintain group harmony. Strong emotional displays might be seen as burdensome to others or as a loss of face.</li>
                <li><strong>Gender expectations</strong> around emotional expression vary significantly across cultures. What's acceptable for women versus men, or expectations around anger versus sadness, differ widely.</li>
                <li><strong>Somatic expression</strong> of emotion is more common in some cultures than verbal expression. Distress may present as physical symptoms rather than emotional complaints.</li>
              </ul>
              <p><em>Clinical Implication:</em> Avoid pathologizing emotional restraint or assuming that verbal emotional expression is always the goal. A client who presents with flat affect may be adhering to cultural norms rather than experiencing depression or alexithymia. Explore their experience rather than imposing your expectations about how emotions "should" be expressed.</p>`
            },
            {
              title: "High-Context and Low-Context Communication",
              content: `<p>Anthropologist Edward Hall's framework of high-context and low-context communication helps explain differences in communication style that affect active listening.</p>
              <p><strong>High-context cultures</strong> (common in Asia, Middle East, Africa, Latin America, and Southern Europe) rely heavily on:</p>
              <ul>
                <li>Implicit communication and reading between the lines</li>
                <li>Nonverbal cues, tone, and context</li>
                <li>Shared understanding and relationship history</li>
                <li>Indirect expression of disagreement or negative feelings</li>
              </ul>
              <p><strong>Low-context cultures</strong> (common in Northern Europe, United States, Australia, and other English-speaking countries) favor:</p>
              <ul>
                <li>Explicit, direct verbal communication</li>
                <li>Clear, detailed explanations</li>
                <li>Direct expression of opinions and feelings</li>
                <li>Less reliance on shared context</li>
              </ul>
              <p>A high-context communicator may find direct questions intrusive, rude, or unnecessary—"If they were really listening, they would understand without me having to spell it out." A low-context communicator may miss subtle cues and feel frustrated by indirectness.</p>
              <p><em>Clinical Implication:</em> With high-context communicators, pay extra attention to what's NOT being said—the pauses, the implications, the topics avoided. With low-context communicators, don't assume hidden meanings that aren't there—sometimes the direct statement is the whole message. When in doubt, ask about communication preferences.</p>`
            },
            {
              title: "Storytelling and Narrative Styles",
              content: `<p>Cultures differ in how stories are told and what constitutes appropriate narrative structure:</p>
              <ul>
                <li><strong>Linear narrative styles</strong> (common in Western contexts) value chronological progression, clear cause-and-effect, and getting to the point efficiently.</li>
                <li><strong>Circular or spiral narrative styles</strong> (common in many Indigenous, African, and Asian cultures) may include extensive context, return to themes multiple times, and embed the point within a larger web of meaning.</li>
                <li><strong>Communal storytelling</strong> may include multiple voices, interruptions that are seen as collaborative rather than rude, and collective construction of meaning.</li>
              </ul>
              <p><em>Clinical Implication:</em> If a client's narrative style seems circuitous or unfocused by your standards, consider whether your standards are culturally specific. What looks like "going off on tangents" might be essential context-building in the client's cultural framework. Ask yourself: "Am I imposing my narrative preferences, or am I following the client's way of making meaning?"</p>`
            }
          ]
        },
        {
          type: "text",
          order: 4,
          textContent: `<h3>Developing Cultural Humility in Practice</h3>
          <p>Cultural humility is not a credential you earn but a practice you engage in continuously. Here are concrete steps for developing cultural humility in your active listening:</p>
          <ol style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Recognize your own cultural lens</strong> — Your assumptions about "good" communication are culturally shaped. What feels natural to you is not universal. Reflect on how your own cultural background influences your expectations about eye contact, emotional expression, directness, and use of silence.</li>
            <li><strong>Avoid stereotyping</strong> — Culture influences but doesn't determine individual preferences. A client from a high-context culture might personally prefer direct communication. A client from an expressive culture might personally be reserved. Learn about cultural patterns as hypotheses to explore, not facts to assume.</li>
            <li><strong>Ask rather than assume</strong> — Clients are the experts on their own experience. Questions like "How do you prefer to communicate about difficult things?" or "What feels comfortable to you in terms of how we talk together?" invite collaboration. Most clients appreciate being asked.</li>
            <li><strong>Seek ongoing education</strong> — Attend trainings, read literature, consult with colleagues from different backgrounds. Cultural learning is never complete. Be humble about what you don't know.</li>
            <li><strong>Repair ruptures</strong> — When you make cultural missteps (and you will), acknowledge them and learn. "I think I may have made an assumption that didn't fit your experience. Can you help me understand better?" Models humility and strengthens the relationship.</li>
          </ol>
          <p>The goal is not to memorize rules for every culture—an impossible and ultimately othering task—but to approach each client with curiosity, humility, and willingness to adapt your style to their needs. Cultural humility means being comfortable saying "I don't know—teach me."</p>`
        }
      ],
      quizQuestions: [
        {
          question: "Cultural humility differs from cultural competence in that humility:",
          type: "multipleChoice",
          options: [
            { text: "Requires mastering all cultural norms", isCorrect: false },
            { text: "Acknowledges we can never fully understand another's cultural experience", isCorrect: true },
            { text: "Is only necessary when working with specific populations", isCorrect: false },
            { text: "Means avoiding discussion of cultural differences", isCorrect: false }
          ],
          explanation: "Cultural humility acknowledges that we can never fully understand another person's cultural experience and positions the client as the expert on their own culture."
        },
        {
          question: "When a client from a high-context culture communicates indirectly, the clinician should:",
          type: "multipleChoice",
          options: [
            { text: "Insist on direct communication for clarity", isCorrect: false },
            { text: "Pay extra attention to what is NOT being said", isCorrect: true },
            { text: "Interpret indirect communication as resistance", isCorrect: false },
            { text: "Redirect the client to stay on topic", isCorrect: false }
          ],
          explanation: "With high-context communicators, clinicians should pay extra attention to implicit communication, nonverbal cues, and what is not being said directly."
        },
        {
          question: "In many Asian cultures, avoiding direct eye contact with a clinician may indicate:",
          type: "multipleChoice",
          options: [
            { text: "Resistance to treatment", isCorrect: false },
            { text: "Dishonesty or evasiveness", isCorrect: false },
            { text: "Respect for the clinician's authority", isCorrect: true },
            { text: "Lack of engagement in therapy", isCorrect: false }
          ],
          explanation: "In many Asian cultures, avoiding direct eye contact with authority figures is a sign of respect, not evasiveness or disengagement."
        }
      ]
    },

    // =========================================================================
    // SECTION 4: CASE STUDIES & SELF-ASSESSMENT (~15 min)
    // =========================================================================
    {
      title: "Case Studies and Professional Development",
      description: "Apply active listening through case analysis and self-assessment",
      order: 4,
      estimatedTime: 15,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Case Studies and Professional Development",
          subtitle: "Applying What You've Learned"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Case Study 1: The Reluctant Client</h3>
          <p><strong>Background:</strong> Marcus, a 34-year-old man, was mandated to counseling after a DUI. He sits with arms crossed, giving one-word answers. He has made clear he doesn't want to be here.</p>
          
          <p><strong>The exchange:</strong></p>
          <p><strong>Clinician:</strong> "I notice you don't seem excited to be here."</p>
          <p><strong>Marcus:</strong> "Would you be? I have to be here or I go to jail."</p>
          <p><strong>Clinician:</strong> (Leaning back slightly, speaking calmly) "That sounds frustrating—being forced to do something you didn't choose."</p>
          <p><strong>Marcus:</strong> (Slight pause) "Yeah. Everyone keeps telling me I have a problem."</p>
          <p><strong>Clinician:</strong> "One mistake, and suddenly everyone's an expert on your life. That would make me want to shut down too."</p>
          <p><strong>Marcus:</strong> (Uncrosses arms slightly) "Exactly."</p>
          
          <p><strong>Analysis:</strong> The clinician used several key active listening skills:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Naming what was observed</strong> — "I notice you don't seem excited" acknowledges reality without judgment</li>
            <li><strong>Reflection of feeling</strong> — "That sounds frustrating" validates Marcus's emotional experience</li>
            <li><strong>Validating without agreeing</strong> — The clinician didn't argue about whether Marcus has a problem; instead validated his experience of being told what to do</li>
            <li><strong>Joining with resistance</strong> — "That would make me want to shut down too" normalizes his reaction and communicates understanding</li>
          </ul>
          <p>By not pushing an agenda or defending the value of counseling, the clinician created space for Marcus to begin opening up. The uncrossing of arms signals a small but significant shift.</p>
          
          <h3>Case Study 2: When Active Listening Goes Wrong</h3>
          <p><strong>Background:</strong> Sarah, 29, is describing conflict with her critical mother.</p>
          
          <p><strong>The exchange (problematic):</strong></p>
          <p><strong>Sarah:</strong> "She just criticizes everything I do. My apartment, my job, my boyfriend—"</p>
          <p><strong>Clinician:</strong> "Have you tried setting boundaries with her?"</p>
          <p><strong>Sarah:</strong> (Flat tone) "Yeah. Maybe."</p>
          
          <p><strong>Analysis:</strong> The clinician jumped to problem-solving before Sarah felt fully heard. Sarah's flat response ("Yeah. Maybe.") signals disengagement—she's shutting down. The clinician's question implied that the solution is obvious and Sarah just hasn't tried hard enough. Even a good question at the wrong time can rupture connection.</p>
          
          <p><strong>Better Alternative:</strong></p>
          <p><strong>Sarah:</strong> "She just criticizes everything I do. My apartment, my job, my boyfriend—"</p>
          <p><strong>Clinician:</strong> "Criticism from all directions—your home, your work, your relationship. That must be exhausting."</p>
          <p><strong>Sarah:</strong> (Tears forming) "I just want her to be proud of me. Just once."</p>
          
          <p><strong>Analysis:</strong> The reflection of feeling opened a door to the deeper issue—Sarah's longing for maternal approval. This couldn't have emerged if the clinician had stayed at the problem-solving level.</p>
          
          <p><strong>Key Lesson:</strong> Understanding must precede intervention. The urge to help can interfere with helping.</p>
          
          <h3>Case Study 3: Working with Silence</h3>
          <p><strong>Background:</strong> James, 45, is discussing his father's recent death. He stops mid-sentence and stares at the floor.</p>
          
          <p><strong>The exchange (problematic):</strong></p>
          <p><strong>James:</strong> "The last thing I said to him was..." (stops, looks down)</p>
          <p><strong>Clinician:</strong> (After 5 seconds) "What did you say to him?"</p>
          <p><strong>James:</strong> "It doesn't matter. Anyway, about the funeral arrangements..."</p>
          
          <p><strong>The exchange (effective):</strong></p>
          <p><strong>James:</strong> "The last thing I said to him was..." (stops, looks down)</p>
          <p><strong>Clinician:</strong> (Waits silently for 30 seconds, maintaining gentle, open presence)</p>
          <p><strong>James:</strong> (Voice breaking) "I told him I was too busy to visit that weekend. I was too busy." (begins to cry)</p>
          
          <p><strong>Analysis:</strong> In the first exchange, the clinician's quick question interrupted James's process. He retreated to the safer topic of funeral logistics. In the second exchange, the clinician's patient silence allowed James to arrive at the painful core of his grief. The silence wasn't empty—it was full of permission and presence.</p>`
        },
        {
          type: "text",
          order: 3,
          textContent: `<h3>Self-Assessment: Rate Your Active Listening</h3>
          <p>Honest self-assessment is the starting point for growth. Rate yourself on each item using a scale from 1 (Rarely) to 5 (Consistently):</p>
          
          <p><strong>Attending Behaviors:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>I maintain appropriate eye contact adapted to client comfort and cultural context</li>
            <li>My body posture communicates openness and engagement</li>
            <li>I minimize distractions during sessions (phone away, door closed, mind present)</li>
            <li>I notice when my attention wanders and redirect it back to the client</li>
            <li>My facial expressions convey interest and acceptance</li>
          </ul>
          
          <p><strong>Verbal Skills:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>I use minimal encouragers naturally and sparingly</li>
            <li>My paraphrases capture meaning without merely repeating words</li>
            <li>I reflect feelings, not just content</li>
            <li>I summarize periodically to check understanding</li>
            <li>I ask open-ended questions that invite exploration</li>
          </ul>
          
          <p><strong>Challenging Situations:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>I can tolerate extended silence without rushing to fill it</li>
            <li>I remain grounded and present when clients are highly emotional</li>
            <li>I manage my own reactions when triggered by client material</li>
            <li>I adapt my approach for cultural differences in communication</li>
            <li>I resist the urge to problem-solve before fully understanding</li>
          </ul>
          
          <p>Areas where you scored 3 or below are priorities for development. Consider focusing on one skill at a time.</p>
          
          <h3>Creating Your Development Plan</h3>
          <p>Use this framework to structure your ongoing development:</p>
          <ol style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Choose one focus area</strong> — Select the skill you scored lowest on, or the one that feels most important for your current client population. Don't try to work on everything at once.</li>
            <li><strong>Set a specific, measurable goal</strong> — "Use reflection of feeling at least 3 times per session" or "Pause for 3 seconds before responding in every session this week." Vague goals don't drive change.</li>
            <li><strong>Create accountability</strong> — Share your goal with a supervisor, colleague, or consultation group. External accountability increases follow-through.</li>
            <li><strong>Track your practice</strong> — Keep brief notes after sessions on how you did with your focus skill. What worked? What didn't? What did you notice?</li>
            <li><strong>Review monthly</strong> — Assess progress and adjust as needed. Celebrate improvements and recalibrate goals. After one skill feels solid, move to the next.</li>
          </ol>
          
          <h3>Signs of Growth</h3>
          <p>How do you know your active listening is improving? Look for these indicators:</p>
          <p><strong>Client indicators:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Clients open up more readily and share deeper material</li>
            <li>Clients go deeper into emotional material rather than staying surface-level</li>
            <li>Clients express feeling understood ("Yes, exactly!" or "That's it!")</li>
            <li>Fewer "dead ends" in conversation; more natural flow</li>
            <li>Stronger therapeutic alliance; clients seem more trusting</li>
          </ul>
          <p><strong>Self indicators:</strong></p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>You feel more present in sessions, less in your head</li>
            <li>You notice more nuance in client communication</li>
            <li>You are less anxious about silence and can sit with it comfortably</li>
            <li>You catch yourself before falling into old patterns (problem-solving, parroting, etc.)</li>
            <li>Sessions feel less effortful and more natural</li>
          </ul>
          
          <p>Active listening is not a skill you master once—it requires continual attention throughout your career. Like any skill, it can degrade without practice and deepen with attention. Your commitment to this course reflects your dedication to professional excellence. Carry that commitment forward into daily practice, knowing that every session is an opportunity to listen more deeply.</p>`
        }
      ],
      quizQuestions: [
        {
          question: "In Case Study 1 (The Reluctant Client), the clinician's approach was effective because:",
          type: "multipleChoice",
          options: [
            { text: "They confronted Marcus about his minimization of the DUI", isCorrect: false },
            { text: "They validated his experience without pushing an agenda", isCorrect: true },
            { text: "They explained why mandated counseling is important", isCorrect: false },
            { text: "They immediately began a formal assessment", isCorrect: false }
          ],
          explanation: "The clinician used reflection of feeling and validation without agreeing or disagreeing about whether Marcus has a problem. This created space for him to open up."
        },
        {
          question: "In Case Study 2, the clinician's initial mistake was:",
          type: "multipleChoice",
          options: [
            { text: "Not offering enough empathy", isCorrect: false },
            { text: "Jumping to problem-solving before Sarah felt heard", isCorrect: true },
            { text: "Using too many minimal encouragers", isCorrect: false },
            { text: "Making too much eye contact", isCorrect: false }
          ],
          explanation: "The clinician jumped to problem-solving ('Have you tried setting boundaries?') before Sarah felt fully heard, resulting in her disengagement."
        },
        {
          question: "In Case Study 3, the effective clinician responded to James's silence by:",
          type: "multipleChoice",
          options: [
            { text: "Asking what he said to his father", isCorrect: false },
            { text: "Changing the subject to reduce his discomfort", isCorrect: false },
            { text: "Waiting silently while maintaining gentle, open presence", isCorrect: true },
            { text: "Offering reassurance that his father knew he loved him", isCorrect: false }
          ],
          explanation: "The effective clinician waited patiently in silence, allowing James to arrive at the painful core of his grief at his own pace."
        }
      ]
    }
  ],

  // =========================================================================
  // FINAL ASSESSMENT - 15 questions
  // =========================================================================
  assessment: {
    title: "Final Assessment: Active Listening Skills",
    description: "This assessment evaluates your understanding of active listening components, techniques, and applications. You must score 80% or higher to receive CE credit.",
    timeLimit: 20,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Active listening is best defined as:",
        type: "multipleChoice",
        options: [
          { text: "Waiting quietly for your turn to speak", isCorrect: false },
          { text: "A deliberate, focused process of fully engaging with verbal and nonverbal communication", isCorrect: true },
          { text: "Repeating back exactly what the client said", isCorrect: false },
          { text: "Asking as many questions as possible to gather information", isCorrect: false }
        ],
        explanation: "Active listening is a deliberate, focused process of fully engaging with a client's verbal and nonverbal communication."
      },
      {
        question: "Which is NOT one of the six core components of active listening?",
        type: "multipleChoice",
        options: [
          { text: "Paraphrasing", isCorrect: false },
          { text: "Interpretation", isCorrect: true },
          { text: "Summarizing", isCorrect: false },
          { text: "Minimal encouragers", isCorrect: false }
        ],
        explanation: "The six core components are: attending behaviors, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing. Interpretation is a separate intervention skill."
      },
      {
        question: "What does the 'E' in the SOLER framework stand for?",
        type: "multipleChoice",
        options: [
          { text: "Engage actively", isCorrect: false },
          { text: "Eye contact", isCorrect: true },
          { text: "Empathize deeply", isCorrect: false },
          { text: "Evaluate content", isCorrect: false }
        ],
        explanation: "In the SOLER framework, E stands for Eye contact—maintaining comfortable, culturally appropriate eye contact."
      },
      {
        question: "The primary difference between paraphrasing and reflection of feeling is:",
        type: "multipleChoice",
        options: [
          { text: "Paraphrasing is longer", isCorrect: false },
          { text: "Reflection of feeling names emotions while paraphrasing restates content", isCorrect: true },
          { text: "Paraphrasing requires direct quotes", isCorrect: false },
          { text: "Reflection of feeling is only used in psychodynamic therapy", isCorrect: false }
        ],
        explanation: "Reflection of feeling names the emotions underlying the client's words, while paraphrasing restates the message content."
      },
      {
        question: "Rogers' three core conditions for therapeutic change include empathy, unconditional positive regard, and:",
        type: "multipleChoice",
        options: [
          { text: "Interpretation", isCorrect: false },
          { text: "Congruence", isCorrect: true },
          { text: "Assessment", isCorrect: false },
          { text: "Confrontation", isCorrect: false }
        ],
        explanation: "Rogers identified empathy, unconditional positive regard, and congruence (genuineness) as the three core conditions."
      },
      {
        question: "Processing silence in therapy often indicates:",
        type: "multipleChoice",
        options: [
          { text: "The client is being deliberately difficult", isCorrect: false },
          { text: "The client is integrating insights or formulating thoughts", isCorrect: true },
          { text: "The client is not engaged in therapy", isCorrect: false },
          { text: "The therapist has made a mistake", isCorrect: false }
        ],
        explanation: "Processing silence often indicates the client is integrating insights, formulating thoughts, or experiencing emotions too intense for words."
      },
      {
        question: "The 'Parrot Trap' in active listening refers to:",
        type: "multipleChoice",
        options: [
          { text: "Talking too much", isCorrect: false },
          { text: "Repeating client's words verbatim instead of paraphrasing", isCorrect: true },
          { text: "Using too many minimal encouragers", isCorrect: false },
          { text: "Asking closed-ended questions", isCorrect: false }
        ],
        explanation: "The Parrot Trap is repeating the client's exact words instead of paraphrasing using your own words to show genuine processing."
      },
      {
        question: "When clients express views that challenge your values, you should:",
        type: "multipleChoice",
        options: [
          { text: "Express disagreement immediately", isCorrect: false },
          { text: "Refer the client elsewhere", isCorrect: false },
          { text: "Seek to understand their worldview while processing your reactions in supervision", isCorrect: true },
          { text: "Avoid the topic entirely", isCorrect: false }
        ],
        explanation: "Seek to understand the client's worldview, separate the person from the belief, and process your reactions in supervision."
      },
      {
        question: "The 'Reassurance Reflex' is problematic because:",
        type: "multipleChoice",
        options: [
          { text: "Reassurance is never appropriate", isCorrect: false },
          { text: "It minimizes the client's experience rather than validating difficulty", isCorrect: true },
          { text: "It takes too much session time", isCorrect: false },
          { text: "Clients don't like being reassured", isCorrect: false }
        ],
        explanation: "The Reassurance Reflex minimizes experience. Better to validate: 'This is really hard.'"
      },
      {
        question: "Cultural humility in active listening involves:",
        type: "multipleChoice",
        options: [
          { text: "Memorizing cultural norms for all groups", isCorrect: false },
          { text: "Acknowledging we can never fully understand another's cultural experience", isCorrect: true },
          { text: "Treating all clients exactly the same", isCorrect: false },
          { text: "Avoiding discussion of cultural differences", isCorrect: false }
        ],
        explanation: "Cultural humility acknowledges that we can never fully understand another's cultural experience and positions the client as the expert."
      },
      {
        question: "In high-context cultures, communication typically relies more on:",
        type: "multipleChoice",
        options: [
          { text: "Explicit, direct statements", isCorrect: false },
          { text: "Implicit meaning, nonverbal cues, and context", isCorrect: true },
          { text: "Written documentation", isCorrect: false },
          { text: "Formal protocols", isCorrect: false }
        ],
        explanation: "High-context cultures rely heavily on implicit communication, nonverbal cues, and contextual meaning rather than explicit statements."
      },
      {
        question: "When a clinician's personal history is triggered by client material, they should:",
        type: "multipleChoice",
        options: [
          { text: "Share their experience to build rapport", isCorrect: false },
          { text: "Ground themselves, refocus on client, and process in supervision later", isCorrect: true },
          { text: "End the session immediately", isCorrect: false },
          { text: "Suppress all reactions", isCorrect: false }
        ],
        explanation: "Ground yourself, refocus attention on the client, use your reaction as clinical data, and process in supervision afterward."
      },
      {
        question: "The therapeutic alliance accounts for approximately what percentage of outcome variance?",
        type: "multipleChoice",
        options: [
          { text: "10%", isCorrect: false },
          { text: "30%", isCorrect: true },
          { text: "50%", isCorrect: false },
          { text: "70%", isCorrect: false }
        ],
        explanation: "Research by Horvath and Symonds found the therapeutic alliance accounts for approximately 30% of outcome variance."
      },
      {
        question: "Co-regulation in therapy refers to:",
        type: "multipleChoice",
        options: [
          { text: "Following insurance regulations", isCorrect: false },
          { text: "The clinician's calm regulated state helping the client regulate", isCorrect: true },
          { text: "Joint treatment planning", isCorrect: false },
          { text: "Coordinating care with other providers", isCorrect: false }
        ],
        explanation: "Co-regulation means the clinician's calm, regulated nervous system helps the client's nervous system settle."
      },
      {
        question: "The best approach to developing active listening skills is:",
        type: "multipleChoice",
        options: [
          { text: "Reading extensively about the topic", isCorrect: false },
          { text: "Watching expert therapists on video", isCorrect: false },
          { text: "Deliberate practice with self-evaluation and supervision feedback", isCorrect: true },
          { text: "Natural talent that cannot be developed", isCorrect: false }
        ],
        explanation: "Active listening improves through deliberate practice, self-evaluation, and supervision feedback—not just understanding concepts."
      }
    ]
  }
};

async function rebuildCourse() {
  await connectDB();
  
  const db = mongoose.connection.db;
  const interactiveCollection = db.collection('interactivecourses');
  
  // Find existing course
  const existing = await interactiveCollection.findOne({ slug: 'active-listening-skills' });
  
  // Calculate totals
  const totalQuizQuestions = activeListeningCourse.sections.reduce(
    (sum, s) => sum + (s.quizQuestions?.length || 0), 0
  ) + (activeListeningCourse.assessment?.questions?.length || 0);
  
  const totalContentBlocks = activeListeningCourse.sections.reduce(
    (sum, s) => sum + (s.contentBlocks?.length || 0), 0
  );
  
  if (existing) {
    console.log('Found existing course:', existing.title);
    console.log('Current structure: sections =', existing.sections?.length || 0);
    
    // Preserve important fields
    const preserveFields = {
      _id: existing._id,
      createdAt: existing.createdAt,
      enrollmentCount: existing.enrollmentCount || 0,
      analytics: existing.analytics || {},
      ratings: existing.ratings || []
    };
    
    // Build update
    const update = {
      ...activeListeningCourse,
      ...preserveFields,
      status: 'published',
      updatedAt: new Date(),
      totalQuizQuestions,
      totalContentBlocks
    };
    
    // Replace document
    const result = await interactiveCollection.replaceOne(
      { slug: 'active-listening-skills' },
      update
    );
    
    console.log('\n✅ Course updated successfully!');
    console.log('Modified:', result.modifiedCount);
  } else {
    console.log('Course not found in interactivecourses - creating new...');
    
    // Build new document
    const newDoc = {
      ...activeListeningCourse,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalQuizQuestions,
      totalContentBlocks,
      enrollmentCount: 0
    };
    
    const result = await interactiveCollection.insertOne(newDoc);
    
    console.log('\n✅ Course created successfully!');
    console.log('Inserted ID:', result.insertedId);
  }
  console.log('\nNew structure:');
  console.log('- Sections:', activeListeningCourse.sections.length);
  console.log('- Total content blocks:', totalContentBlocks);
  console.log('- Quiz questions per section:', activeListeningCourse.sections.map(s => s.quizQuestions?.length || 0));
  console.log('- Final assessment questions:', activeListeningCourse.assessment?.questions?.length || 0);
  console.log('- Total quiz questions:', totalQuizQuestions);
  console.log('- Status: published');
  
  await mongoose.disconnect();
  console.log('\nDone!');
}

rebuildCourse().catch(console.error);
