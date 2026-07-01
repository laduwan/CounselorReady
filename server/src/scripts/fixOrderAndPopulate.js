/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

async function populateActiveListening() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!\n');

  const course = await Course.findOne({ slug: 'active-listening-skills' });
  if (!course) {
    console.log('Course not found');
    process.exit(1);
  }

  console.log('Found: ' + course.title);

  // ACEP Metadata
  course.description = 'This course provides mental health professionals with foundational knowledge and practical skills in active listening—the cornerstone of effective therapeutic communication. Participants will explore the difference between passive hearing and active engagement, master core components including attending behaviors, paraphrasing, and reflection of feelings, and learn to apply these skills in challenging clinical situations including silence, high emotion, and resistance.';
  
  course.targetAudience = 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, Psychologists, and other mental health professionals seeking to enhance their foundational clinical skills.';
  
  course.learningObjectives = [
    'Define active listening and differentiate it from passive hearing in clinical contexts',
    'Identify and demonstrate the six core components of active listening (attending, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing)',
    'Apply active listening techniques in challenging clinical situations including client silence, high emotion, and resistance',
    'Recognize common barriers to active listening and implement strategies to overcome them in clinical practice'
  ];
  
  course.providerNumber = '7760';
  course.passingScore = 80;
  course.ceHours = 1;

  // FULL CONTENT MODULES
  course.modules = [
    {
      title: 'Module 1: Understanding Active Listening',
      order: 0,
      lessons: [
        {
          title: 'What is Active Listening?',
          type: 'text',
          order: 0,
          content: `# What is Active Listening?

Active listening is far more than simply hearing words—it is a deliberate, focused process of fully engaging with a client's verbal and nonverbal communication. For mental health professionals, active listening forms the bedrock of therapeutic effectiveness.

## Defining Active Listening in Clinical Practice

Active listening involves several key elements:

**Full attention** - Eliminating distractions and being fully present with the client. This means putting away phones, closing unnecessary browser tabs, and mentally setting aside other concerns.

**Nonverbal engagement** - Maintaining appropriate eye contact, open body posture, and facial expressions that convey genuine interest. Your body language speaks before your words do.

**Verbal acknowledgment** - Using brief responses ("I see," "Go on," "Tell me more") to encourage continued sharing without interrupting the client's flow.

**Withholding judgment** - Creating a safe space free from criticism or premature interpretation. Clients can sense when they're being evaluated.

**Reflection and clarification** - Demonstrating understanding through paraphrasing and asking clarifying questions that show you're tracking their narrative.

## Why Active Listening Matters in Therapy

Research consistently demonstrates that clients who feel heard and understood show greater treatment engagement and retention, increased willingness to explore difficult emotions, stronger therapeutic alliance, and better treatment outcomes across modalities.

Carl Rogers, founder of person-centered therapy, identified empathic listening as one of three core conditions necessary for therapeutic change (along with unconditional positive regard and congruence). When clients experience being deeply heard, often for the first time in their lives, it creates a corrective emotional experience that facilitates healing.

A meta-analysis by Horvath and Symonds (1991) found that the therapeutic alliance accounts for approximately 30% of treatment outcome variance—and active listening is fundamental to building that alliance.

## Common Barriers to Active Listening

Even well-trained clinicians can fall into patterns that undermine active listening:

1. **Planning your response** while the client is still speaking - This splits your attention and causes you to miss important information.

2. **Premature problem-solving** before fully understanding the concern - The urge to help can actually interfere with helping.

3. **Personal reactions** that shift focus from client to clinician - Your own emotional responses, while valid, need to be managed.

4. **Fatigue or distraction** from a demanding caseload - Burnout erodes listening capacity.

5. **Assumptions** based on previous sessions or client demographics - Each moment is new; avoid operating on autopilot.

## Active Listening vs. Passive Hearing

Passive hearing involves waiting for your turn to speak, surface-level attention, focus on content only, minimal feedback, and judgment or evaluation.

In contrast, active listening involves seeking to understand, deep engagement, attention to emotion and meaning, regular reflection and clarification, and acceptance and curiosity.

The difference is immediately perceptible to clients. They know when they're truly being heard versus when someone is merely waiting to respond.`
        },
        {
          title: 'Core Components of Active Listening',
          type: 'text',
          order: 1,
          content: `# Core Components of Active Listening

Effective active listening integrates multiple skill sets that work together to create a powerful therapeutic presence. This lesson breaks down each component for focused skill development.

## 1. Attending Behaviors

Attending behaviors communicate your full presence and interest through nonverbal channels. The SOLER Framework (Egan, 2014) provides a useful structure:

**S - Square:** Face the client directly (or at a slight angle if more comfortable for the client)
**O - Open posture:** Avoid crossed arms or other closed positions that signal defensiveness
**L - Lean:** Slightly forward to show engagement and interest
**E - Eye contact:** Maintain comfortable, culturally appropriate eye contact
**R - Relaxed:** Appear natural and at ease, not stiff or anxious

**Cultural Considerations:** Eye contact norms vary significantly across cultures. Some clients may find direct eye contact disrespectful, intrusive, or uncomfortable. Observe client preferences and adapt accordingly.

## 2. Minimal Encouragers

Brief verbal and nonverbal responses that encourage continued sharing without interrupting flow:

- "Mm-hmm"
- "I see"
- "Go on"
- "Yes"
- Nodding
- "Tell me more"
- "And then?"

Use these naturally and sparingly—overuse can feel mechanical or dismissive, as if you're just going through the motions.

## 3. Paraphrasing

Restating the client's message in your own words serves multiple purposes: it demonstrates understanding, allows correction if you misunderstood, and helps clients hear their own thoughts reflected back.

**Formula:** "So what I'm hearing is..." or "It sounds like..."

**Example:**
Client: "I just don't know what to do anymore. My husband keeps saying he'll change but nothing ever does. I'm exhausted from hoping."
Paraphrase: "It sounds like you've been holding onto hope for a long time, and the repeated disappointments have worn you down."

Notice how the paraphrase captures both the content and the emotional undertone without simply repeating the client's exact words.

## 4. Reflection of Feeling

Going beyond content to name the emotions underlying the client's words. This is perhaps the most powerful active listening skill.

**Formula:** "You feel [emotion] because [situation]"

**Example:**
Client: "Every time I try to talk to my mother about this, she changes the subject or makes it about her."
Reflection: "You feel frustrated and perhaps invisible when your mother can't focus on your experience."

Effective reflection of feeling requires emotional vocabulary and attunement to subtle cues in tone, posture, and word choice.

## 5. Clarifying Questions

Open-ended questions that deepen understanding without leading the client toward your assumptions:

- "Can you tell me more about that?"
- "What was that experience like for you?"
- "When you say 'overwhelmed,' what does that feel like?"
- "Help me understand what you mean by..."

Avoid "why" questions early in treatment, as they can feel accusatory or push clients toward intellectualization.

## 6. Summarizing

Periodically pulling together main themes and content serves to demonstrate you've been tracking the conversation, help clients see patterns they might have missed, provide natural transition points in the session, and consolidate the session's work at the end.

**Example:** "Let me make sure I'm following. Today we've talked about the conflict with your sister, how it connects to childhood patterns, and the grief you're feeling about potentially losing that relationship. Does that capture it?"

Always end summaries with a check-in to allow the client to correct or add to your understanding.`
        }
      ],
      knowledgeCheck: [
        {
          question: 'In the SOLER framework for attending behaviors, what does the "O" stand for?',
          options: [{ text: 'Observe carefully', isCorrect: false }, { text: 'Open posture', isCorrect: true }, { text: 'Orient toward client', isCorrect: false }, { text: 'Offer feedback', isCorrect: false }],
          explanation: 'In the SOLER framework, O stands for Open posture—avoiding crossed arms or other closed positions that might signal defensiveness or disinterest.'
        },
        {
          question: 'According to Carl Rogers, empathic listening is one of how many core conditions necessary for therapeutic change?',
          options: [{ text: 'Two', isCorrect: false }, { text: 'Three', isCorrect: true }, { text: 'Four', isCorrect: false }, { text: 'Five', isCorrect: false }],
          explanation: 'Carl Rogers identified three core conditions necessary for therapeutic change: empathy (empathic listening), unconditional positive regard, and congruence (genuineness).'
        },
        {
          question: 'Which of the following is an example of reflection of feeling rather than paraphrasing?',
          options: [{ text: 'So you are saying the situation at work has been difficult.', isCorrect: false }, { text: 'It sounds like you have been dealing with a lot of stress lately.', isCorrect: false }, { text: 'You feel frustrated and unappreciated when your contributions go unrecognized.', isCorrect: true }, { text: 'Let me make sure I understand—your manager has not acknowledged your work.', isCorrect: false }],
          explanation: 'Reflection of feeling specifically names the emotions underlying the client\'s words ("frustrated and unappreciated"), while paraphrasing restates the content.'
        },
        {
          question: 'Why should clinicians use minimal encouragers "sparingly"?',
          options: [{ text: 'They are considered unprofessional in clinical settings', isCorrect: false }, { text: 'Overuse can feel mechanical or dismissive', isCorrect: true }, { text: 'They interrupt the client\'s thought process', isCorrect: false }, { text: 'Research shows they are ineffective', isCorrect: false }],
          explanation: 'While minimal encouragers are valuable tools, overuse can feel mechanical or dismissive, as if the clinician is going through the motions rather than genuinely engaging.'
        },
        {
          question: 'According to research by Horvath and Symonds, the therapeutic alliance accounts for approximately what percentage of treatment outcome variance?',
          options: [{ text: '10%', isCorrect: false }, { text: '20%', isCorrect: false }, { text: '30%', isCorrect: true }, { text: '50%', isCorrect: false }],
          explanation: 'The meta-analysis found that the therapeutic alliance accounts for approximately 30% of treatment outcome variance, highlighting the importance of relationship-building skills like active listening.'
        }
      ]
    },
    {
      title: 'Module 2: Applying Active Listening Skills',
      order: 1,
      lessons: [
        {
          title: 'Practical Techniques and Exercises',
          type: 'text',
          order: 0,
          content: `# Practical Techniques and Exercises

Moving from understanding active listening concepts to embodying them in session requires deliberate practice. This lesson provides concrete techniques and exercises to develop mastery.

## Technique 1: The 3-Second Pause

Before responding to a client, pause for three seconds. This brief delay:
- Ensures the client has finished speaking (they may have more to say)
- Gives you time to process what you heard
- Demonstrates thoughtfulness rather than reactivity
- Prevents interrupting

**Practice:** Set a subtle reminder (like a small object on your desk) to prompt the pause until it becomes automatic. The pause may feel awkward at first, but clients rarely notice and often appreciate the thoughtful response that follows.

## Technique 2: Listen for the "Music" Behind the Words

Pay attention to paralinguistic cues:
- **Tone**: Does it match the content? Flat tone with "I'm fine" signals incongruence.
- **Pace**: Rapid speech may indicate anxiety; slow may suggest depression or careful consideration.
- **Volume**: Softness on certain topics may signal shame or fear.
- **Emphasis**: What words does the client stress? These often reveal what matters most.

**Exercise:** Listen to a podcast or recorded conversation. Write down observations about the speaker's emotional state based only on vocal qualities, not content.

## Technique 3: Track Themes, Not Just Facts

Instead of trying to remember every detail, listen for recurring patterns:
- What relationships keep coming up?
- What emotions appear repeatedly?
- What situations trigger strong reactions?
- What values seem central to this person?

Theme tracking helps you see the forest rather than getting lost in the trees.

## Technique 4: The "Columbo" Approach

Like the famous TV detective, approach clients with genuine curiosity rather than expertise. Adopt the stance of someone who truly doesn't know and wants to understand:

- "Help me understand..."
- "I'm curious about..."
- "What was that like for you?"
- "I want to make sure I'm getting this right..."

This stance creates safety and often elicits richer information than direct questioning.

## Technique 5: Notice Your Internal Reactions

Your reactions provide clinical data but can also interfere with listening. Practice:

1. **Notice** the reaction (boredom, anxiety, irritation, sadness)
2. **Bracket** it—set it aside temporarily without suppressing it
3. **Return** full attention to the client
4. **Reflect** later on what the reaction might mean

## Common Mistakes to Avoid

**The Parrot Trap:** Repeating client's words verbatim rather than paraphrasing using your own words to show genuine processing.

**The Interrogation:** Rapid-fire questions that feel like a police interview. Better: One question, then listen fully before the next.

**The Expert Trap:** Jumping to interpretations or solutions before fully understanding. Stay curious longer—understanding must precede intervention.

**The Reassurance Reflex:** Saying "It'll be okay" or "Don't worry" to ease discomfort. Better: Validate the difficulty ("This is really hard") without minimizing.

## Building a Practice Habit

Active listening improves with deliberate practice:
1. Choose one component to focus on each week
2. Set an intention before each session
3. Self-evaluate briefly after sessions
4. Seek feedback through supervision or peer consultation
5. Record sessions (with consent) for self-review

Remember: Mastery comes through mindful repetition, not just understanding concepts.`
        },
        {
          title: 'Active Listening in Challenging Situations',
          type: 'text',
          order: 1,
          content: `# Active Listening in Challenging Situations

Even skilled clinicians encounter situations that test their active listening abilities. This lesson addresses common challenges and provides strategies for maintaining therapeutic presence.

## Working with Silence

Silence can feel uncomfortable but often serves important therapeutic functions:

**Types of Therapeutic Silence:**
- **Processing silence**: Client is integrating insights or formulating thoughts
- **Emotional silence**: Feelings are too intense for words
- **Resistant silence**: Client is unsure about sharing or testing the therapist
- **Confused silence**: Client doesn't understand a question

**Strategies:**
- Tolerate the discomfort—don't rush to fill space
- Use nonverbal encouragement (gentle nod, open posture)
- After extended silence, gently inquire: "What's happening for you right now?"
- Normalize: "Take your time. There's no rush."

The ability to sit comfortably with silence is a hallmark of clinical maturity.

## When Clients Are Highly Emotional

Intense emotions can pull for action rather than listening.

**Do:**
- Stay present and grounded in your own body
- Offer tissues without comment or interruption
- Maintain calm, steady presence (your regulation helps them regulate)
- Reflect the emotion: "There's so much pain here"
- Allow the emotion to move through without trying to stop it

**Don't:**
- Try to stop the tears or calm them down
- Rush to comfort or fix the situation
- Become dysregulated yourself
- Change the subject to something less intense

Remember: Emotions need to be witnessed, not managed.

## Working with Tangential or Verbose Clients

Some clients struggle with focus or use excessive detail as a defense:

**Strategies:**
- Summarize to redirect: "So the main issue seems to be..."
- Gently interrupt with curiosity: "Let me pause you there—I want to make sure I understand this part"
- Reflect the underlying need: "It seems like there's a lot you want me to understand"
- Set structure: "We have 20 minutes left. What's most important to address today?"

## When You Disagree or Feel Judgmental

Clients may express views that challenge your values:

**Process:**
1. Notice your reaction without acting on it
2. Remind yourself of unconditional positive regard
3. Seek to understand the client's worldview and context
4. Separate the person from the behavior or belief
5. Process your reactions in supervision

Remember: Your job is to understand, not agree. Understanding doesn't equal endorsement.

## Managing Personal Triggers

When client material activates your own history:

**In the moment:**
- Ground yourself (feel feet on floor, take a breath)
- Refocus attention on client
- Use your reaction as clinical data, not direction for intervention

**After session:**
- Note what was triggered
- Discuss in supervision
- Consider personal therapy if patterns emerge

## Telehealth Considerations

Active listening through a screen requires adaptation:
- Position camera at eye level for natural eye contact
- Minimize visual distractions in your background
- Use verbal encouragers more frequently (nonverbal cues harder to see)
- Name technical issues: "I think we had a lag—could you repeat that?"
- Check in more often: "I want to make sure I'm following you"

## Key Takeaways

1. Challenging situations are opportunities to demonstrate unwavering presence
2. Your ability to stay regulated helps clients regulate (co-regulation)
3. Supervision is essential for processing difficult moments
4. Active listening is most powerful when it's most difficult
5. Every client teaches us something about expanding our capacity`
        }
      ],
      knowledgeCheck: [
        {
          question: 'The "3-second pause" technique is recommended primarily to:',
          options: [{ text: 'Give the clinician time to plan an intervention', isCorrect: false }, { text: 'Ensure the client has finished speaking and allow processing time', isCorrect: true }, { text: 'Create dramatic effect in the conversation', isCorrect: false }, { text: 'Allow the clinician to check their notes', isCorrect: false }],
          explanation: 'The 3-second pause ensures the client has finished speaking, gives the clinician time to process what was heard, demonstrates thoughtfulness, and prevents interrupting.'
        },
        {
          question: 'When working with a client who becomes highly emotional during session, the clinician should:',
          options: [{ text: 'Quickly change the subject to help the client calm down', isCorrect: false }, { text: 'Offer reassurance that everything will be okay', isCorrect: false }, { text: 'Stay present and grounded, allowing the emotion to move through', isCorrect: true }, { text: 'End the session early to give the client time to compose themselves', isCorrect: false }],
          explanation: 'When clients are highly emotional, clinicians should stay present and grounded, maintain calm steady presence, and allow the emotion to move through. Emotions need to be witnessed, not managed.'
        },
        {
          question: 'The "Columbo approach" to active listening refers to:',
          options: [{ text: 'Asking rapid-fire questions to gather information quickly', isCorrect: false }, { text: 'Approaching clients with genuine curiosity rather than expertise', isCorrect: true }, { text: 'Catching clients in inconsistencies in their stories', isCorrect: false }, { text: 'Using silence as an interrogation technique', isCorrect: false }],
          explanation: 'The Columbo approach involves approaching clients with genuine curiosity rather than expertise, creating safety and eliciting richer information.'
        },
        {
          question: 'When a client\'s material triggers the clinician\'s own personal history, the clinician should:',
          options: [{ text: 'Share their own experience to build rapport', isCorrect: false }, { text: 'Ground themselves, refocus on the client, and process in supervision later', isCorrect: true }, { text: 'Immediately refer the client to another therapist', isCorrect: false }, { text: 'Suppress the reaction and continue as if nothing happened', isCorrect: false }],
          explanation: 'When triggered, clinicians should ground themselves, refocus attention on the client, use the reaction as clinical data, and process in supervision afterward.'
        },
        {
          question: 'In telehealth sessions, clinicians should:',
          options: [{ text: 'Use fewer verbal encouragers since the client can see them', isCorrect: false }, { text: 'Use more verbal encouragers since nonverbal cues are harder to see', isCorrect: true }, { text: 'Avoid eye contact to reduce screen fatigue', isCorrect: false }, { text: 'Speak more quickly to maintain engagement', isCorrect: false }],
          explanation: 'In telehealth, clinicians should use verbal encouragers more frequently because nonverbal cues are harder to see through a screen.'
        }
      ]
    }
  ];

  // COMPREHENSIVE FINAL EXAM - 16 questions
  course.finalExam = [
    {
      question: 'Active listening is best defined as:',
      options: [{ text: 'Waiting quietly for your turn to speak', isCorrect: false }, { text: 'A deliberate, focused process of fully engaging with verbal and nonverbal communication', isCorrect: true }, { text: 'Repeating back exactly what the client said', isCorrect: false }, { text: 'Asking as many questions as possible to gather information', isCorrect: false }],
      explanation: 'Active listening is a deliberate, focused process of fully engaging with a client\'s verbal and nonverbal communication.'
    },
    {
      question: 'According to research by Horvath and Symonds, the therapeutic alliance accounts for approximately what percentage of treatment outcome variance?',
      options: [{ text: '10%', isCorrect: false }, { text: '20%', isCorrect: false }, { text: '30%', isCorrect: true }, { text: '50%', isCorrect: false }],
      explanation: 'Research shows the therapeutic alliance accounts for approximately 30% of treatment outcome variance.'
    },
    {
      question: 'Which of the following is NOT one of the six core components of active listening discussed in this course?',
      options: [{ text: 'Paraphrasing', isCorrect: false }, { text: 'Interpretation', isCorrect: true }, { text: 'Summarizing', isCorrect: false }, { text: 'Minimal encouragers', isCorrect: false }],
      explanation: 'The six core components are: attending behaviors, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing. Interpretation is a separate intervention skill.'
    },
    {
      question: 'What does the "E" in the SOLER framework stand for?',
      options: [{ text: 'Engage actively', isCorrect: false }, { text: 'Eye contact', isCorrect: true }, { text: 'Empathize deeply', isCorrect: false }, { text: 'Evaluate content', isCorrect: false }],
      explanation: 'In the SOLER framework, E stands for Eye contact—maintaining comfortable, culturally appropriate eye contact.'
    },
    {
      question: 'The primary difference between paraphrasing and reflection of feeling is:',
      options: [{ text: 'Paraphrasing is longer than reflection of feeling', isCorrect: false }, { text: 'Reflection of feeling names emotions while paraphrasing restates content', isCorrect: true }, { text: 'Paraphrasing requires direct quotes', isCorrect: false }, { text: 'Reflection of feeling is used only in psychodynamic therapy', isCorrect: false }],
      explanation: 'Reflection of feeling goes beyond content to name the emotions underlying the client\'s words, while paraphrasing restates the message content.'
    },
    {
      question: 'Carl Rogers identified empathic listening as one of three core conditions for therapeutic change. What are the other two?',
      options: [{ text: 'Interpretation and confrontation', isCorrect: false }, { text: 'Unconditional positive regard and congruence', isCorrect: true }, { text: 'Assessment and treatment planning', isCorrect: false }, { text: 'Boundaries and structure', isCorrect: false }],
      explanation: 'Rogers\' three core conditions are empathy (empathic listening), unconditional positive regard, and congruence (genuineness).'
    },
    {
      question: 'When using clarifying questions, clinicians are advised to avoid "why" questions early in treatment because:',
      options: [{ text: 'They are grammatically incorrect', isCorrect: false }, { text: 'They can feel accusatory or push clients toward intellectualization', isCorrect: true }, { text: 'They take too long to answer', isCorrect: false }, { text: 'They are not evidence-based', isCorrect: false }],
      explanation: 'Why questions can feel accusatory or push clients toward intellectualization rather than emotional exploration.'
    },
    {
      question: 'Processing silence in therapy may indicate that the client is:',
      options: [{ text: 'Being deliberately difficult', isCorrect: false }, { text: 'Integrating insights or formulating thoughts', isCorrect: true }, { text: 'Not engaged in therapy', isCorrect: false }, { text: 'Ready to terminate treatment', isCorrect: false }],
      explanation: 'Processing silence often indicates the client is integrating insights, formulating thoughts, or experiencing emotions too intense for words.'
    },
    {
      question: 'The "Parrot Trap" in active listening refers to:',
      options: [{ text: 'Talking too much during sessions', isCorrect: false }, { text: 'Repeating client\'s words verbatim instead of paraphrasing in your own words', isCorrect: true }, { text: 'Using too many minimal encouragers', isCorrect: false }, { text: 'Asking closed-ended questions', isCorrect: false }],
      explanation: 'The Parrot Trap is repeating the client\'s exact words instead of paraphrasing using your own words to show genuine processing.'
    },
    {
      question: 'When a client expresses views that challenge the clinician\'s values, the clinician should:',
      options: [{ text: 'Express disagreement immediately to maintain authenticity', isCorrect: false }, { text: 'Refer the client to a different therapist', isCorrect: false }, { text: 'Seek to understand the client\'s worldview while processing reactions in supervision', isCorrect: true }, { text: 'Avoid the topic entirely', isCorrect: false }],
      explanation: 'Clinicians should seek to understand the client\'s worldview, separate the person from the belief, and process their own reactions in supervision.'
    },
    {
      question: 'In telehealth sessions, active listening requires adaptation including:',
      options: [{ text: 'Using fewer verbal encouragers since the client can see you', isCorrect: false }, { text: 'Using more verbal encouragers since nonverbal cues are harder to see', isCorrect: true }, { text: 'Avoiding eye contact to reduce screen fatigue', isCorrect: false }, { text: 'Speaking more quickly to maintain engagement', isCorrect: false }],
      explanation: 'In telehealth, clinicians should use verbal encouragers more frequently because nonverbal cues are harder to see through a screen.'
    },
    {
      question: 'The "Reassurance Reflex" is problematic because:',
      options: [{ text: 'Reassurance is never appropriate in therapy', isCorrect: false }, { text: 'It minimizes the client\'s experience rather than validating difficulty', isCorrect: true }, { text: 'It takes too much session time', isCorrect: false }, { text: 'Clients don\'t like being reassured', isCorrect: false }],
      explanation: 'The Reassurance Reflex minimizes the client\'s experience. Better to validate difficulty: "This is really hard."'
    },
    {
      question: 'Theme tracking in active listening involves:',
      options: [{ text: 'Memorizing every detail the client shares', isCorrect: false }, { text: 'Listening for recurring patterns in relationships, emotions, and reactions', isCorrect: true }, { text: 'Keeping detailed written notes during session', isCorrect: false }, { text: 'Focusing only on the presenting problem', isCorrect: false }],
      explanation: 'Theme tracking means listening for recurring patterns: What relationships keep coming up? What emotions appear repeatedly?'
    },
    {
      question: 'Which statement best describes the relationship between active listening and therapeutic outcomes?',
      options: [{ text: 'Active listening is helpful but not essential to outcomes', isCorrect: false }, { text: 'Active listening only matters in person-centered therapy', isCorrect: false }, { text: 'Active listening builds the alliance that strongly predicts positive outcomes across modalities', isCorrect: true }, { text: 'Active listening is less important than specific techniques', isCorrect: false }],
      explanation: 'Active listening is fundamental to building the therapeutic alliance, which research shows strongly predicts outcomes across all modalities.'
    },
    {
      question: 'When a client is highly emotional, the clinician\'s calm presence helps the client because:',
      options: [{ text: 'It models emotional suppression', isCorrect: false }, { text: 'The clinician\'s regulation helps the client regulate (co-regulation)', isCorrect: true }, { text: 'It signals that emotions are not important', isCorrect: false }, { text: 'It distracts the client from their feelings', isCorrect: false }],
      explanation: 'Co-regulation: the clinician\'s calm, regulated state helps the client\'s nervous system settle.'
    },
    {
      question: 'The best approach to developing active listening skills is:',
      options: [{ text: 'Reading extensively about the topic', isCorrect: false }, { text: 'Watching videos of expert therapists', isCorrect: false }, { text: 'Deliberate practice with self-evaluation and supervision feedback', isCorrect: true }, { text: 'Natural talent that cannot be developed', isCorrect: false }],
      explanation: 'Active listening improves through deliberate practice: choosing components to focus on, setting intentions, self-evaluating, and seeking supervision feedback.'
    }
  ];

  await course.save();
  console.log('\n✅ SUCCESS: Active Listening course fully updated!');
  console.log('   - 2 Modules with full content');
  console.log('   - 4 Lessons with comprehensive clinical material');
  console.log('   - 10 Knowledge Check questions (5 per module)');
  console.log('   - 16 Final Exam questions');
  
  await mongoose.disconnect();
}

populateActiveListening().catch(console.error);
