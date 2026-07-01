/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Populate 1 CE Standard Courses with ACEP-Compliant Content
 * 
 * NBCC ACEP Structure:
 * - Learning Objectives (measurable)
 * - Target Audience
 * - Course Description/Overview
 * - Content Modules with Knowledge Checks (3-5 per module)
 * - Comprehensive Final Exam (15+ questions)
 * - 80% Pass Threshold
 * 
 * Run with: node src/scripts/populate1CECoursesComplete.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

// ============================================================================
// COURSE 1: ACTIVE LISTENING
// ============================================================================

const ACTIVE_LISTENING = {
  slug: 'active-listening',
  title: 'Active Listening: The Foundation of Effective Therapy',
  ceHours: 1,
  description: 'This course provides mental health professionals with foundational knowledge and practical skills in active listening—the cornerstone of effective therapeutic communication. Participants will explore the difference between passive hearing and active engagement, master core components including attending behaviors, paraphrasing, and reflection of feelings, and learn to apply these skills in challenging clinical situations.',
  targetAudience: 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, Psychologists, and other mental health professionals seeking to enhance their foundational clinical skills.',
  learningObjectives: [
    'Define active listening and differentiate it from passive hearing in clinical contexts',
    'Identify and demonstrate the six core components of active listening (attending, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing)',
    'Apply active listening techniques in challenging clinical situations including client silence, high emotion, and resistance',
    'Recognize common barriers to active listening and implement strategies to overcome them in clinical practice'
  ],
  modules: [
    {
      title: 'Module 1: Understanding Active Listening',
      lessons: [
        {
          title: 'What is Active Listening?',
          type: 'text',
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

The difference is immediately perceptible to clients. They know when they're truly being heard versus when someone is merely waiting to respond.

Developing strong active listening skills requires intentional practice and ongoing self-reflection. The following lessons will provide specific techniques to strengthen this foundational clinical competency.`
        },
        {
          title: 'Core Components of Active Listening',
          type: 'text',
          content: `# Core Components of Active Listening

Effective active listening integrates multiple skill sets that work together to create a powerful therapeutic presence. This lesson breaks down each component for focused skill development.

## 1. Attending Behaviors

Attending behaviors communicate your full presence and interest through nonverbal channels. The SOLER Framework (Egan, 2014) provides a useful structure:

**S - Square:** Face the client directly (or at a slight angle if more comfortable for the client)
**O - Open posture:** Avoid crossed arms or other closed positions that signal defensiveness
**L - Lean:** Slightly forward to show engagement and interest
**E - Eye contact:** Maintain comfortable, culturally appropriate eye contact
**R - Relaxed:** Appear natural and at ease, not stiff or anxious

**Cultural Considerations:** Eye contact norms vary significantly across cultures. Some clients may find direct eye contact disrespectful, intrusive, or uncomfortable. Observe client preferences and adapt accordingly. When in doubt, ask.

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
- Client: "I just don't know what to do anymore. My husband keeps saying he'll change but nothing ever does. I'm exhausted from hoping."
- Paraphrase: "It sounds like you've been holding onto hope for a long time, and the repeated disappointments have worn you down."

Notice how the paraphrase captures both the content and the emotional undertone without simply repeating the client's exact words.

## 4. Reflection of Feeling

Going beyond content to name the emotions underlying the client's words. This is perhaps the most powerful active listening skill.

**Formula:** "You feel [emotion] because [situation]"

**Example:**
- Client: "Every time I try to talk to my mother about this, she changes the subject or makes it about her."
- Reflection: "You feel frustrated and perhaps invisible when your mother can't focus on your experience."

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

Always end summaries with a check-in to allow the client to correct or add to your understanding.

## Putting It Together

Active listening isn't a checklist—it's an integrated way of being with clients. With practice, these components become natural and fluid, creating the safety clients need to do deep therapeutic work.`
        }
      ],
      knowledgeCheck: [
        {
          question: 'In the SOLER framework for attending behaviors, what does the "O" stand for?',
          options: ['Observe carefully', 'Open posture', 'Orient toward client', 'Offer feedback'],
          correctAnswer: 1,
          explanation: 'In the SOLER framework, O stands for Open posture—avoiding crossed arms or other closed positions that might signal defensiveness or disinterest.'
        },
        {
          question: 'According to Carl Rogers, empathic listening is one of how many core conditions necessary for therapeutic change?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correctAnswer: 1,
          explanation: 'Carl Rogers identified three core conditions necessary for therapeutic change: empathy (empathic listening), unconditional positive regard, and congruence (genuineness).'
        },
        {
          question: 'Which of the following is an example of reflection of feeling rather than paraphrasing?',
          options: [
            '"So you\'re saying the situation at work has been difficult."',
            '"It sounds like you\'ve been dealing with a lot of stress lately."',
            '"You feel frustrated and unappreciated when your contributions go unrecognized."',
            '"Let me make sure I understand—your manager hasn\'t acknowledged your work."'
          ],
          correctAnswer: 2,
          explanation: 'Reflection of feeling specifically names the emotions underlying the client\'s words ("frustrated and unappreciated"), while paraphrasing restates the content. The formula is "You feel [emotion] because [situation]."'
        },
        {
          question: 'Why should clinicians use minimal encouragers "sparingly"?',
          options: [
            'They are considered unprofessional in clinical settings',
            'Overuse can feel mechanical or dismissive',
            'They interrupt the client\'s thought process',
            'Research shows they are ineffective'
          ],
          correctAnswer: 1,
          explanation: 'While minimal encouragers are valuable tools, overuse can feel mechanical or dismissive, as if the clinician is going through the motions rather than genuinely engaging with the client.'
        },
        {
          question: 'What is the primary purpose of summarizing during a therapy session?',
          options: [
            'To fill time when the conversation slows',
            'To demonstrate your intelligence to the client',
            'To demonstrate tracking, help clients see patterns, and provide transition points',
            'To redirect clients away from difficult topics'
          ],
          correctAnswer: 2,
          explanation: 'Summarizing demonstrates you\'ve been tracking the conversation, helps clients see patterns they might have missed, provides natural transition points, and consolidates session work.'
        }
      ]
    },
    {
      title: 'Module 2: Applying Active Listening Skills',
      lessons: [
        {
          title: 'Practical Techniques and Exercises',
          type: 'text',
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

**Exercise:** Listen to a podcast or recorded conversation. Write down observations about the speaker's emotional state based only on vocal qualities, not content. This builds your attunement to the "music."

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

This stance creates safety and often elicits richer information than direct questioning. It also protects against the assumption trap.

## Technique 5: Notice Your Internal Reactions

Your reactions provide clinical data but can also interfere with listening. Practice:

1. **Notice** the reaction (boredom, anxiety, irritation, sadness)
2. **Bracket** it—set it aside temporarily without suppressing it
3. **Return** full attention to the client
4. **Reflect** later on what the reaction might mean (countertransference? Important clinical data?)

## Common Mistakes to Avoid

**The Parrot Trap:** Repeating client's words verbatim ("So you're exhausted from hoping") rather than paraphrasing using your own words to show genuine processing ("It sounds like the repeated disappointments have really worn you down").

**The Interrogation:** Rapid-fire questions that feel like a police interview. Better: One question, then listen fully before the next.

**The Expert Trap:** Jumping to interpretations or solutions before fully understanding. Stay curious longer—understanding must precede intervention.

**The Reassurance Reflex:** Saying "It'll be okay" or "Don't worry" to ease discomfort. Better: Validate the difficulty ("This is really hard") without minimizing.

## Building a Practice Habit

Active listening improves with deliberate practice:

1. **Choose one component** to focus on each week
2. **Set an intention** before each session ("Today I'll focus on reflection of feeling")
3. **Self-evaluate** briefly after sessions
4. **Seek feedback** through supervision or peer consultation
5. **Record sessions** (with consent) for self-review

Remember: Mastery comes through mindful repetition, not just understanding concepts. You cannot think your way to better listening—you must practice your way there.`
        },
        {
          title: 'Active Listening in Challenging Situations',
          type: 'text',
          content: `# Active Listening in Challenging Situations

Even skilled clinicians encounter situations that test their active listening abilities. This lesson addresses common challenges and provides strategies for maintaining therapeutic presence.

## Working with Silence

Silence can feel uncomfortable but often serves important therapeutic functions:

**Types of Therapeutic Silence:**
- **Processing silence**: Client is integrating insights or formulating thoughts
- **Emotional silence**: Feelings are too intense for words
- **Resistant silence**: Client is unsure about sharing or testing the therapist
- **Confused silence**: Client doesn't understand a question or where to go next

**Strategies:**
- Tolerate the discomfort—don't rush to fill space
- Use nonverbal encouragement (gentle nod, open posture)
- After extended silence, gently inquire: "What's happening for you right now?"
- Normalize: "Take your time. There's no rush."

The ability to sit comfortably with silence is a hallmark of clinical maturity.

## When Clients Are Highly Emotional

Intense emotions can pull for action rather than listening. The urge to comfort or fix is strong.

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
- Gently interrupt with curiosity: "Let me pause you there—I want to make sure I understand this part before we move on"
- Reflect the underlying need: "It seems like there's a lot you want me to understand"
- Set structure: "We have 20 minutes left. What's most important to address today?"

Balance patience with appropriate structure. Allowing endless tangents isn't therapeutic.

## When You Disagree or Feel Judgmental

Clients may express views that challenge your values:

**Process:**
1. Notice your reaction without acting on it
2. Remind yourself of unconditional positive regard
3. Seek to understand the client's worldview and context
4. Separate the person from the behavior or belief
5. Process your reactions in supervision

**Remember:** Your job is to understand, not agree. Understanding doesn't equal endorsement. You can deeply understand someone's perspective while still disagreeing with it.

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
- Practice self-compassion—triggers are human

## Telehealth Considerations

Active listening through a screen requires adaptation:

- **Position camera** at eye level for natural eye contact
- **Minimize visual distractions** in your background
- **Use verbal encouragers** more frequently (nonverbal cues are harder to see)
- **Name technical issues**: "I think we had a lag—could you repeat that?"
- **Check in more often**: "I want to make sure I'm following you"

The screen is a barrier, but active listening can bridge it.

## Key Takeaways

1. Challenging situations are opportunities to demonstrate unwavering presence
2. Your ability to stay regulated helps clients regulate
3. Supervision is essential for processing difficult moments
4. Active listening is most powerful when it's most difficult
5. Every client teaches us something about expanding our capacity

With practice, challenges become opportunities to deepen the therapeutic relationship and model relational repair.`
        }
      ],
      knowledgeCheck: [
        {
          question: 'The "3-second pause" technique is recommended primarily to:',
          options: [
            'Give the clinician time to plan an intervention',
            'Ensure the client has finished speaking and allow processing time',
            'Create dramatic effect in the conversation',
            'Allow the clinician to check their notes'
          ],
          correctAnswer: 1,
          explanation: 'The 3-second pause ensures the client has finished speaking, gives the clinician time to process what was heard, demonstrates thoughtfulness, and prevents interrupting.'
        },
        {
          question: 'When working with a client who becomes highly emotional during session, the clinician should:',
          options: [
            'Quickly change the subject to help the client calm down',
            'Offer reassurance that everything will be okay',
            'Stay present and grounded, allowing the emotion to move through',
            'End the session early to give the client time to compose themselves'
          ],
          correctAnswer: 2,
          explanation: 'When clients are highly emotional, clinicians should stay present and grounded, maintain calm steady presence, and allow the emotion to move through rather than trying to stop or fix it. Emotions need to be witnessed, not managed.'
        },
        {
          question: 'The "Columbo approach" to active listening refers to:',
          options: [
            'Asking rapid-fire questions to gather information quickly',
            'Approaching clients with genuine curiosity rather than expertise',
            'Catching clients in inconsistencies in their stories',
            'Using silence as an interrogation technique'
          ],
          correctAnswer: 1,
          explanation: 'The Columbo approach involves approaching clients with genuine curiosity rather than expertise, adopting the stance of someone who truly doesn\'t know and wants to understand, which creates safety and elicits richer information.'
        },
        {
          question: 'When a client\'s material triggers the clinician\'s own personal history, the clinician should:',
          options: [
            'Share their own experience to build rapport',
            'Ground themselves, refocus on the client, and process in supervision later',
            'Immediately refer the client to another therapist',
            'Suppress the reaction and continue as if nothing happened'
          ],
          correctAnswer: 1,
          explanation: 'When triggered, clinicians should ground themselves in the moment, refocus attention on the client, use the reaction as clinical data, and process the experience in supervision afterward.'
        },
        {
          question: 'Which technique is recommended for working with tangential or verbose clients?',
          options: [
            'Allow them to speak without interruption for the entire session',
            'Frequently interrupt to keep them on track',
            'Summarize to redirect and set structure for remaining time',
            'Assign homework to practice being concise'
          ],
          correctAnswer: 2,
          explanation: 'For tangential or verbose clients, clinicians should summarize to redirect ("So the main issue seems to be..."), gently interrupt with curiosity, and set structure ("We have 20 minutes left. What\'s most important?").'
        }
      ]
    }
  ],
  finalExam: [
    {
      question: 'Active listening is best defined as:',
      options: [
        'Waiting quietly for your turn to speak',
        'A deliberate, focused process of fully engaging with verbal and nonverbal communication',
        'Repeating back exactly what the client said',
        'Asking as many questions as possible'
      ],
      correctAnswer: 1,
      explanation: 'Active listening is a deliberate, focused process of fully engaging with a client\'s verbal and nonverbal communication, going far beyond simply hearing words.'
    },
    {
      question: 'According to research, the therapeutic alliance accounts for approximately what percentage of treatment outcome variance?',
      options: ['10%', '20%', '30%', '50%'],
      correctAnswer: 2,
      explanation: 'A meta-analysis by Horvath and Symonds (1991) found that the therapeutic alliance accounts for approximately 30% of treatment outcome variance.'
    },
    {
      question: 'Which of the following is NOT one of the six core components of active listening discussed in this course?',
      options: ['Paraphrasing', 'Interpretation', 'Summarizing', 'Minimal encouragers'],
      correctAnswer: 1,
      explanation: 'The six core components are: attending behaviors, minimal encouragers, paraphrasing, reflection of feeling, clarifying questions, and summarizing. Interpretation is a separate intervention skill.'
    },
    {
      question: 'What does the "E" in the SOLER framework stand for?',
      options: ['Engage actively', 'Eye contact', 'Empathize deeply', 'Evaluate content'],
      correctAnswer: 1,
      explanation: 'In the SOLER framework, E stands for Eye contact—maintaining comfortable, culturally appropriate eye contact with the client.'
    },
    {
      question: 'The primary difference between paraphrasing and reflection of feeling is:',
      options: [
        'Paraphrasing is longer than reflection of feeling',
        'Reflection of feeling names emotions while paraphrasing restates content',
        'Paraphrasing requires direct quotes',
        'Reflection of feeling is used only in psychodynamic therapy'
      ],
      correctAnswer: 1,
      explanation: 'Reflection of feeling goes beyond content to name the emotions underlying the client\'s words, while paraphrasing restates the client\'s message content in the clinician\'s own words.'
    },
    {
      question: 'Carl Rogers identified empathic listening as one of three core conditions for therapeutic change. What are the other two?',
      options: [
        'Interpretation and confrontation',
        'Unconditional positive regard and congruence',
        'Assessment and treatment planning',
        'Boundaries and structure'
      ],
      correctAnswer: 1,
      explanation: 'Rogers\' three core conditions are empathy (empathic listening), unconditional positive regard, and congruence (genuineness).'
    },
    {
      question: 'When using clarifying questions, clinicians are advised to avoid "why" questions early in treatment because:',
      options: [
        'They are grammatically incorrect',
        'They can feel accusatory or push clients toward intellectualization',
        'They take too long to answer',
        'They are not evidence-based'
      ],
      correctAnswer: 1,
      explanation: 'Why questions can feel accusatory or push clients toward intellectualization rather than emotional exploration, making them less effective early in treatment.'
    },
    {
      question: 'Processing silence in therapy may indicate that the client is:',
      options: [
        'Being deliberately difficult',
        'Integrating insights or formulating thoughts',
        'Not engaged in therapy',
        'Ready to terminate treatment'
      ],
      correctAnswer: 1,
      explanation: 'Processing silence often indicates that the client is integrating insights, formulating thoughts, or experiencing emotions too intense for words—all potentially valuable therapeutic moments.'
    },
    {
      question: 'The "Parrot Trap" in active listening refers to:',
      options: [
        'Talking too much during sessions',
        'Repeating client\'s words verbatim instead of paraphrasing in your own words',
        'Using too many minimal encouragers',
        'Asking closed-ended questions'
      ],
      correctAnswer: 1,
      explanation: 'The Parrot Trap is repeating the client\'s exact words instead of paraphrasing using your own words to show genuine processing of what was said.'
    },
    {
      question: 'When a client expresses views that challenge the clinician\'s values, the clinician should:',
      options: [
        'Express disagreement immediately to maintain authenticity',
        'Refer the client to a different therapist',
        'Seek to understand the client\'s worldview while processing reactions in supervision',
        'Avoid the topic entirely'
      ],
      correctAnswer: 2,
      explanation: 'Clinicians should notice their reaction, remind themselves of unconditional positive regard, seek to understand the client\'s worldview, separate the person from the belief, and process reactions in supervision.'
    },
    {
      question: 'In telehealth sessions, active listening requires adaptation including:',
      options: [
        'Using fewer verbal encouragers since the client can see you',
        'Using more verbal encouragers since nonverbal cues are harder to see',
        'Avoiding eye contact to reduce screen fatigue',
        'Speaking more quickly to maintain engagement'
      ],
      correctAnswer: 1,
      explanation: 'In telehealth, clinicians should use verbal encouragers more frequently because nonverbal cues are harder to see through a screen.'
    },
    {
      question: 'The "Reassurance Reflex" is problematic because:',
      options: [
        'Reassurance is never appropriate in therapy',
        'It minimizes the client\'s experience rather than validating difficulty',
        'It takes too much session time',
        'Clients don\'t like being reassured'
      ],
      correctAnswer: 1,
      explanation: 'The Reassurance Reflex (saying "It\'ll be okay" or "Don\'t worry") minimizes the client\'s experience. Better to validate the difficulty: "This is really hard."'
    },
    {
      question: 'Theme tracking in active listening involves:',
      options: [
        'Memorizing every detail the client shares',
        'Listening for recurring patterns in relationships, emotions, and reactions',
        'Keeping detailed written notes during session',
        'Focusing only on the presenting problem'
      ],
      correctAnswer: 1,
      explanation: 'Theme tracking means listening for recurring patterns: What relationships keep coming up? What emotions appear repeatedly? What values seem central? This helps see the larger picture.'
    },
    {
      question: 'Which statement best describes the relationship between active listening and therapeutic outcomes?',
      options: [
        'Active listening is helpful but not essential to outcomes',
        'Active listening only matters in person-centered therapy',
        'Active listening builds the alliance that strongly predicts positive outcomes',
        'Active listening is less important than specific interventions'
      ],
      correctAnswer: 2,
      explanation: 'Active listening is fundamental to building the therapeutic alliance, which research shows accounts for approximately 30% of treatment outcome variance across all modalities.'
    },
    {
      question: 'When a client is highly emotional, the clinician\'s calm presence helps the client because:',
      options: [
        'It models emotional suppression',
        'The clinician\'s regulation helps the client regulate (co-regulation)',
        'It signals that emotions are not important',
        'It distracts the client from their feelings'
      ],
      correctAnswer: 1,
      explanation: 'The clinician\'s ability to stay regulated helps clients regulate through co-regulation—the process by which one person\'s calm nervous system helps another person\'s nervous system settle.'
    },
    {
      question: 'The best approach to developing active listening skills is:',
      options: [
        'Reading extensively about the topic',
        'Watching videos of expert therapists',
        'Deliberate practice with self-evaluation and supervision feedback',
        'Natural talent that cannot be developed'
      ],
      correctAnswer: 2,
      explanation: 'Active listening improves through deliberate practice: choosing components to focus on, setting intentions, self-evaluating, seeking supervision feedback, and recording sessions for review.'
    }
  ]
};

// ============================================================================
// COURSE 2: MINDFULNESS IN CLINICAL PRACTICE
// ============================================================================

const MINDFULNESS_CLINICAL = {
  slug: 'mindfulness-introduction',
  title: 'Introduction to Mindfulness in Clinical Practice',
  ceHours: 1,
  description: 'This course introduces mental health professionals to the foundations of mindfulness and its application in clinical settings. Participants will explore evidence-based mindfulness approaches, learn core mindfulness practices, and develop skills for integrating mindfulness techniques into therapeutic work with clients across various presenting concerns.',
  targetAudience: 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, Psychologists, and other mental health professionals interested in incorporating mindfulness-based approaches into their clinical practice.',
  learningObjectives: [
    'Define mindfulness and explain its key components according to Jon Kabat-Zinn\'s definition',
    'Identify at least four evidence-based mindfulness approaches used in clinical practice (MBSR, MBCT, DBT, ACT)',
    'Demonstrate understanding of three core mindfulness practices suitable for clinical application',
    'Apply strategies for introducing and integrating mindfulness in therapy sessions appropriately'
  ],
  modules: [
    {
      title: 'Module 1: Foundations of Mindfulness',
      lessons: [
        {
          title: 'Understanding Mindfulness',
          type: 'text',
          content: `# Understanding Mindfulness

Mindfulness has moved from contemplative traditions into mainstream mental health practice, with robust research supporting its effectiveness across numerous conditions. This lesson provides the foundation for integrating mindfulness into clinical work.

## Defining Mindfulness

Jon Kabat-Zinn's widely accepted definition states that mindfulness is "paying attention in a particular way: on purpose, in the present moment, and nonjudgmentally."

**Key elements include:**

**Intentional attention** - Deliberately directing awareness rather than operating on autopilot. We choose where to place our attention.

**Present-moment focus** - Not dwelling on past regrets or future worries, but engaging with what is happening right now.

**Nonjudgmental observation** - Accepting what is without evaluating it as good or bad, right or wrong. Simply noticing.

**Curiosity** - Approaching experience with openness and interest, as if encountering it for the first time.

## The Science of Mindfulness

Research demonstrates mindfulness practice produces measurable changes across multiple domains:

**Neurological changes:**
- Increased gray matter in areas associated with learning, memory, and emotional regulation (hippocampus, posterior cingulate cortex)
- Reduced amygdala reactivity (less hair-trigger stress response)
- Strengthened prefrontal cortex function (better executive function)
- Enhanced connectivity between brain regions

**Psychological benefits:**
- Reduced symptoms of anxiety and depression
- Improved emotional regulation
- Decreased rumination
- Enhanced attention and concentration
- Greater psychological flexibility

**Physical benefits:**
- Reduced blood pressure
- Improved immune function
- Better sleep quality
- Decreased chronic pain perception

## Evidence-Based Mindfulness Approaches

Several manualized treatments incorporate mindfulness as a core component:

**Mindfulness-Based Stress Reduction (MBSR)** was developed by Jon Kabat-Zinn at the University of Massachusetts Medical Center. It's an 8-week structured program originally designed for chronic pain but now used broadly for stress-related conditions.

**Mindfulness-Based Cognitive Therapy (MBCT)** combines mindfulness practices with cognitive therapy techniques. It has particularly strong evidence for depression relapse prevention and is recommended by NICE (National Institute for Health and Care Excellence) guidelines.

**Dialectical Behavior Therapy (DBT)** includes mindfulness as one of its four core skill modules. It's especially effective for emotion dysregulation and has been adapted for numerous populations including adolescents, eating disorders, and substance abuse.

**Acceptance and Commitment Therapy (ACT)** uses present-moment awareness as one of six core processes. Mindfulness serves the goal of values-based action and has transdiagnostic application.

## Common Misconceptions

**Myth:** Mindfulness means clearing the mind of all thoughts.
**Reality:** Mindfulness involves noticing thoughts, not eliminating them. A busy mind is normal.

**Myth:** Mindfulness is religious or spiritual.
**Reality:** Secular mindfulness practices are distinct from Buddhist traditions and require no spiritual beliefs.

**Myth:** Some people "can't do" mindfulness.
**Reality:** Everyone can learn; expectations may need adjustment. There's no failing at mindfulness.

**Myth:** Mindfulness is always relaxing.
**Reality:** Present-moment awareness can surface difficult emotions. This is part of the process.

## Indications and Contraindications

**Strong evidence supports mindfulness for:**
- Depression (especially relapse prevention)
- Anxiety disorders (GAD, social anxiety, panic)
- Chronic pain
- Stress-related conditions
- Substance use disorders
- Eating disorders

**Use with caution for:**
- Acute trauma or PTSD (may need stabilization first; trauma-sensitive adaptations exist)
- Active psychosis (requires significant adaptation)
- Severe dissociation (may need grounding techniques instead)
- Clients strongly resistant to the approach (forced mindfulness isn't mindful)

## The Clinician's Personal Practice

Research suggests clinicians who practice mindfulness themselves are more effective at teaching it to clients, demonstrate greater therapeutic presence, experience less burnout, and show enhanced empathy.

Personal practice isn't absolutely required but is strongly recommended. You'll teach better what you embody.`
        },
        {
          title: 'Core Mindfulness Practices',
          type: 'text',
          content: `# Core Mindfulness Practices

This lesson introduces fundamental mindfulness exercises you can practice yourself and teach to clients. Each practice targets different aspects of mindful awareness.

## 1. Mindful Breathing

The anchor of most mindfulness practice—using breath as an object of attention.

**Basic Instructions:**
1. Find a comfortable seated position
2. Close eyes or soften gaze downward
3. Bring attention to the natural rhythm of breathing
4. Notice the sensations: air entering nostrils, chest or belly rising, the pause between breaths
5. When mind wanders (it will), gently return attention to breath without judgment
6. No need to control or change breathing—simply observe

**Duration:** Start with 3-5 minutes, gradually increase as comfortable

**Clinical Application:** Excellent entry point for anxiety, panic, and emotional regulation. Can be used as brief intervention in session when client becomes overwhelmed.

## 2. Body Scan

Systematic attention through the body, building interoceptive awareness.

**Basic Instructions:**
1. Lie down or sit comfortably
2. Begin at feet (or head—direction doesn't matter)
3. Notice sensations in each area without trying to change them
4. Move attention progressively through the body
5. Notice areas of tension, numbness, warmth, tingling, or neutrality
6. If no sensation, simply note "neutral" and move on

**Duration:** 15-45 minutes for full practice; abbreviated versions (5-10 minutes) work too

**Clinical Application:** Helpful for chronic pain, somatic symptoms, trauma recovery (with caution), sleep difficulties, and building mind-body connection.

## 3. STOP Practice

A brief informal practice for daily life—easy to remember and use anywhere.

**S** - Stop what you're doing
**T** - Take a breath (just one conscious breath)
**O** - Observe your experience (thoughts, feelings, sensations—without judgment)
**P** - Proceed with awareness (rather than on autopilot)

**Clinical Application:** Perfect for interrupting automatic stress responses, creating space before reacting, and bringing mindfulness into everyday moments. Excellent homework assignment.

## 4. Noting/Labeling

Using brief mental labels to identify present-moment experience, creating distance from thoughts and emotions.

**Basic Instructions:**
1. Sit in meditation posture
2. When thoughts arise, simply note "thinking"
3. When sounds appear, note "hearing"
4. When emotions arise, note the emotion: "anxiety," "sadness," "joy"
5. Return attention to breath or body
6. Keep labels simple, brief, and non-judgmental

**Clinical Application:** Particularly helpful for rumination, overwhelming affect, and building metacognitive awareness. The label creates a small space between experience and reaction.

## 5. Loving-Kindness (Metta)

Cultivating compassion toward self and others through intentional well-wishing.

**Basic Instructions:**
1. Bring to mind someone easy to love (pet, child, beloved friend)
2. Silently offer phrases: "May you be happy. May you be healthy. May you be safe. May you live with ease."
3. Extend to yourself (often the hardest)
4. Extend to neutral people (stranger at the store)
5. Extend to difficult people (start small)
6. Extend to all beings everywhere

**Clinical Application:** Particularly helpful for depression, self-criticism, shame, and relationship difficulties. Builds the "caring muscle."

## Adapting Practices for Clients

Consider these modifications based on client needs:

**Duration:** Start brief (3-5 minutes). Build gradually. Brief daily practice beats occasional long sessions.

**Eyes:** Open may be better for trauma survivors, highly anxious clients, or those who feel vulnerable with eyes closed.

**Position:** Sitting, standing, or walking per client comfort. Lying down may trigger sleep.

**Language:** Adapt to client's vocabulary. Avoid jargon they don't connect with.

**Pacing:** Slower for anxious clients; more engaging for restless or ADHD clients.

## Practice This Week

Choose one practice to do daily for 5 minutes. Notice what you observe about your own experience—this firsthand knowledge will inform your ability to teach and guide clients. You cannot effectively guide someone where you haven't been yourself.`
        }
      ],
      knowledgeCheck: [
        {
          question: 'According to Jon Kabat-Zinn\'s definition, mindfulness involves paying attention in a particular way that includes all of the following EXCEPT:',
          options: ['On purpose', 'In the present moment', 'Nonjudgmentally', 'With the goal of relaxation'],
          correctAnswer: 3,
          explanation: 'Kabat-Zinn\'s definition includes paying attention on purpose, in the present moment, and nonjudgmentally. Relaxation may be a byproduct but is not part of the definition—and sometimes mindfulness surfaces difficult emotions rather than relaxation.'
        },
        {
          question: 'Which evidence-based mindfulness approach was specifically developed for depression relapse prevention?',
          options: ['MBSR (Mindfulness-Based Stress Reduction)', 'MBCT (Mindfulness-Based Cognitive Therapy)', 'DBT (Dialectical Behavior Therapy)', 'ACT (Acceptance and Commitment Therapy)'],
          correctAnswer: 1,
          explanation: 'Mindfulness-Based Cognitive Therapy (MBCT) combines mindfulness with cognitive therapy and has strong evidence specifically for depression relapse prevention, recommended by NICE guidelines.'
        },
        {
          question: 'In the STOP practice, what does the "O" stand for?',
          options: ['Open your eyes', 'Observe your experience', 'Orient to surroundings', 'Overcome resistance'],
          correctAnswer: 1,
          explanation: 'In STOP (Stop, Take a breath, Observe, Proceed), the O stands for Observe your experience—noticing thoughts, feelings, and sensations without judgment.'
        },
        {
          question: 'Mindfulness should be used with caution and may require adaptation for clients with:',
          options: ['Generalized anxiety disorder', 'Chronic pain', 'Severe dissociation', 'Mild depression'],
          correctAnswer: 2,
          explanation: 'Clients with severe dissociation may need grounding techniques rather than traditional mindfulness, as mindfulness practices can potentially worsen dissociative symptoms without proper adaptation.'
        },
        {
          question: 'Research on clinicians who maintain personal mindfulness practice suggests they:',
          options: [
            'Are no different from non-practicing clinicians',
            'Show greater therapeutic presence, less burnout, and enhanced empathy',
            'Should not teach mindfulness to clients',
            'Only practice mindfulness during work hours'
          ],
          correctAnswer: 1,
          explanation: 'Research suggests clinicians who practice mindfulness themselves are more effective at teaching it to clients, demonstrate greater therapeutic presence, experience less burnout, and show enhanced empathy.'
        }
      ]
    },
    {
      title: 'Module 2: Clinical Application',
      lessons: [
        {
          title: 'Integrating Mindfulness in Sessions',
          type: 'text',
          content: `# Integrating Mindfulness in Sessions

Mindfulness can be woven into therapy in multiple ways—from brief in-session practices to structured home practice assignments. This lesson provides practical guidance for clinical integration.

## When to Introduce Mindfulness

**Good timing:**
- Client expresses interest or openness to trying something new
- Anxiety or stress symptoms are prominent presenting concerns
- Rumination is identified as a maintaining factor
- Client has difficulty with emotional regulation
- As adjunct to CBT, DBT, ACT, or other approaches
- For depression maintenance after acute phase resolves

**Consider waiting if:**
- Client is in acute crisis (stabilize first)
- Strong resistance to the concept (explore the resistance)
- Severe dissociation without stabilization (use grounding instead)
- Active psychosis without appropriate adaptation and supervision

## Providing Rationale to Clients

Clients engage better when they understand the "why" behind interventions:

**For anxiety:** "When we're anxious, we tend to get caught up in future worries—what might happen, worst case scenarios. Mindfulness trains the brain to stay in the present moment, where most of the time, things are actually okay. It's like strengthening a muscle that pulls you back from the worry spiral."

**For depression:** "Depression often involves ruminating on the past—replaying regrets, failures, losses. Mindfulness helps us notice these thought loops without getting pulled into them. You can observe the thoughts without believing them or fighting them."

**For emotional regulation:** "Strong emotions can feel overwhelming, like they take over. Mindfulness creates a little space between the trigger and our reaction—enough space to choose how we want to respond rather than just reacting automatically."

**For trauma (when appropriate):** "When we've experienced trauma, our nervous system can get stuck on high alert, always scanning for danger. Mindfulness practices can help signal to your body that you're safe now—we'll go slowly and you're always in control."

## In-Session Practices

**Brief Grounding (1-2 minutes)** - Use when client becomes overwhelmed or dissociative:
- "Let's pause for a moment"
- "Feel your feet on the floor—really feel the ground supporting you"
- "Take a slow breath"
- "Notice three things you can see in this room"

**Opening Centering (3-5 minutes)** - Starting sessions with brief practice:
- Signals transition into therapy space
- Helps clients arrive and settle from their busy day
- Models mindfulness practice
- Provides data about client's current state (how was the practice for them?)

**Mindful Inquiry** - Bringing mindfulness to emotional exploration:
- "As you talk about this, what do you notice in your body?"
- "Where do you feel that emotion physically?"
- "What's happening right now as you consider that possibility?"

**Closing Practice (2-3 minutes)** - Ending with grounding or intention-setting:
- Consolidates session work
- Helps clients transition back to daily life
- Can include self-compassion elements

## Assigning Home Practice

**Guidelines for success:**
- Start small (3-5 minutes daily is better than 30 minutes occasionally)
- Be specific about when, where, how
- Problem-solve barriers in advance
- Provide resources (apps, recordings, written guides)
- Follow up on practice in next session

**Troubleshooting Common Problems:**

*"I can't quiet my mind"*
Response: "That's not the goal—and actually, that's a common misconception. Just notice when your mind wanders and gently guide it back. That noticing IS the practice. A wandering mind isn't failure; noticing it wandered is success."

*"I don't have time"*
Response: "Let's find 3 minutes. What's a reliable daily cue—after brushing teeth? Before bed? During your morning coffee? We're looking for consistency, not duration."

*"It makes me more anxious"*
Response: "Sometimes paying attention surfaces things we've been avoiding—that's actually important information. Let's try a shorter practice with eyes open, focused on something external, and we'll build from there gradually."

*"I fell asleep"*
Response: "That tells us your body needs rest! For mindfulness practice specifically, try sitting up rather than lying down, and perhaps earlier in the day when you're more alert."

## Recommended Resources for Clients

**Apps:** Insight Timer (free, huge library), Headspace (structured courses), Calm (sleep focus), Ten Percent Happier (good for skeptics)

**Books:** "Wherever You Go, There You Are" by Jon Kabat-Zinn (accessible introduction), "The Mindful Way Through Depression" by Williams, Teasdale, Segal & Kabat-Zinn (for depression specifically)

## Documentation

When incorporating mindfulness, document: rationale for inclusion, specific practices used, client response and feedback, home practice assigned, and progress over time.

The most effective mindfulness-informed clinicians maintain their own practice, receive training in evidence-based protocols, practice guiding exercises out loud, start with straightforward presentations before complex cases, and seek supervision when challenges arise.`
        }
      ],
      knowledgeCheck: [
        {
          question: 'Which of the following is the most appropriate response when a client says "I can\'t quiet my mind" during mindfulness practice?',
          options: [
            '"Try harder to focus and push the thoughts away."',
            '"That\'s not the goal. Just notice when your mind wanders and guide it back."',
            '"Perhaps mindfulness isn\'t the right approach for you."',
            '"We should try a different relaxation technique instead."'
          ],
          correctAnswer: 1,
          explanation: 'The goal of mindfulness is not to quiet the mind but to notice when it wanders and gently return attention. This noticing IS the practice—a wandering mind isn\'t failure.'
        },
        {
          question: 'Brief grounding techniques during session (feet on floor, slow breath, notice surroundings) are most appropriate when:',
          options: [
            'Starting every therapy session',
            'The client becomes overwhelmed or dissociative',
            'The client is bored',
            'You need to fill time at the end of session'
          ],
          correctAnswer: 1,
          explanation: 'Brief grounding is most useful when clients become overwhelmed or show signs of dissociation, helping them return to present-moment awareness and the safety of the therapeutic environment.'
        },
        {
          question: 'When providing rationale for mindfulness to a client with anxiety, the most helpful framing emphasizes:',
          options: [
            'Mindfulness will eliminate anxious thoughts',
            'Mindfulness trains the brain to stay present rather than caught in future worries',
            'Anxious people need to relax more',
            'Mindfulness is a cure for anxiety disorders'
          ],
          correctAnswer: 1,
          explanation: 'For anxiety, the helpful rationale is that mindfulness trains the brain to stay in the present moment rather than getting caught up in future worries—not that it eliminates thoughts or cures anxiety.'
        },
        {
          question: 'When assigning mindfulness home practice to clients, the most effective approach is:',
          options: [
            'Assign 30-minute daily practice from the start',
            'Let clients figure out when and how to practice on their own',
            'Start with 3-5 minutes daily with specific time/place and follow up next session',
            'Only recommend apps without discussing practice'
          ],
          correctAnswer: 2,
          explanation: 'Effective home practice assignments start small (3-5 minutes daily), are specific about when/where/how, problem-solve barriers in advance, provide resources, and include follow-up in the next session.'
        },
        {
          question: '"Mindful inquiry" during session involves:',
          options: [
            'Questioning whether mindfulness is right for the client',
            'Asking clients about their body sensations and present-moment experience',
            'Investigating the client\'s mindfulness history',
            'Determining if the client is practicing at home'
          ],
          correctAnswer: 1,
          explanation: 'Mindful inquiry brings mindfulness into emotional exploration through questions like "What do you notice in your body as you talk about this?" and "Where do you feel that emotion physically?"'
        }
      ]
    }
  ],
  finalExam: [
    {
      question: 'Jon Kabat-Zinn\'s definition of mindfulness includes all of the following EXCEPT:',
      options: ['Paying attention on purpose', 'In the present moment', 'Nonjudgmentally', 'With a goal of achieving relaxation'],
      correctAnswer: 3,
      explanation: 'The definition includes attention on purpose, present moment, and nonjudgmental. Relaxation is not part of the definition—sometimes mindfulness surfaces difficult emotions.'
    },
    {
      question: 'Research on mindfulness shows neurological changes including:',
      options: [
        'Decreased gray matter throughout the brain',
        'Increased amygdala reactivity',
        'Reduced amygdala reactivity and strengthened prefrontal cortex',
        'No measurable brain changes'
      ],
      correctAnswer: 2,
      explanation: 'Research shows reduced amygdala reactivity (less stress response) and strengthened prefrontal cortex (better executive function), among other positive neurological changes.'
    },
    {
      question: 'MBSR (Mindfulness-Based Stress Reduction) was developed by:',
      options: ['Carl Rogers', 'Marsha Linehan', 'Jon Kabat-Zinn', 'Aaron Beck'],
      correctAnswer: 2,
      explanation: 'Jon Kabat-Zinn developed MBSR at the University of Massachusetts Medical Center, originally for chronic pain patients.'
    },
    {
      question: 'Which therapy approach includes mindfulness as one of four core skill modules?',
      options: ['CBT', 'DBT', 'Psychodynamic therapy', 'Solution-focused therapy'],
      correctAnswer: 1,
      explanation: 'Dialectical Behavior Therapy (DBT) includes mindfulness as one of its four core skill modules, along with distress tolerance, emotion regulation, and interpersonal effectiveness.'
    },
    {
      question: 'The common misconception that "mindfulness means clearing the mind" is incorrect because:',
      options: [
        'Mindfulness actually increases thinking',
        'Mindfulness involves noticing thoughts, not eliminating them',
        'Only advanced practitioners can clear their minds',
        'Clearing the mind is dangerous'
      ],
      correctAnswer: 1,
      explanation: 'Mindfulness involves noticing thoughts without getting caught up in them—not eliminating them. A busy mind is normal; the practice is in the noticing.'
    },
    {
      question: 'For which condition does MBCT (Mindfulness-Based Cognitive Therapy) have the strongest evidence?',
      options: ['PTSD', 'Depression relapse prevention', 'Schizophrenia', 'Personality disorders'],
      correctAnswer: 1,
      explanation: 'MBCT has particularly strong evidence for depression relapse prevention and is recommended by NICE guidelines for this purpose.'
    },
    {
      question: 'In the body scan practice, when you notice an area with no particular sensation, you should:',
      options: [
        'Keep focusing until you feel something',
        'Note "neutral" and move on',
        'Skip that body part',
        'End the practice early'
      ],
      correctAnswer: 1,
      explanation: 'If no sensation is noticed, simply note "neutral" and move on. Not every body area will have strong sensations, and that\'s normal.'
    },
    {
      question: 'The STOP practice includes all of the following steps EXCEPT:',
      options: ['Stop', 'Take a breath', 'Observe', 'Overcome'],
      correctAnswer: 3,
      explanation: 'STOP stands for Stop, Take a breath, Observe (your experience), and Proceed (with awareness). There is no "Overcome" step.'
    },
    {
      question: 'Loving-kindness (Metta) practice is particularly helpful for:',
      options: [
        'Chronic pain management',
        'Depression, self-criticism, and relationship difficulties',
        'ADHD symptoms',
        'Sleep disorders only'
      ],
      correctAnswer: 1,
      explanation: 'Loving-kindness practice is particularly helpful for depression, self-criticism, shame, and relationship difficulties—building what might be called the "caring muscle."'
    },
    {
      question: 'Mindfulness should be used with caution for clients with severe dissociation because:',
      options: [
        'It\'s not evidence-based for dissociation',
        'Dissociative clients cannot focus',
        'It may worsen dissociative symptoms; grounding may be more appropriate',
        'Mindfulness is contraindicated for all trauma'
      ],
      correctAnswer: 2,
      explanation: 'Traditional mindfulness may worsen dissociative symptoms. Grounding techniques that anchor clients in the present physical environment may be more appropriate initially.'
    },
    {
      question: 'When a client reports that mindfulness practice "makes me more anxious," the best response is:',
      options: [
        'Stop using mindfulness with this client',
        'Acknowledge this can happen, try shorter practice with eyes open, and build gradually',
        'Tell them they\'re doing it wrong',
        'Assign more intensive practice to push through'
      ],
      correctAnswer: 1,
      explanation: 'Sometimes mindfulness surfaces avoided emotions. Acknowledge this, try shorter practice with eyes open (less vulnerable), focused on something external, and build gradually.'
    },
    {
      question: 'Research suggests clinicians who maintain personal mindfulness practice:',
      options: [
        'Have no advantage over non-practicing clinicians',
        'Should not teach mindfulness to clients',
        'Demonstrate greater therapeutic presence and less burnout',
        'Only benefit in their personal lives'
      ],
      correctAnswer: 2,
      explanation: 'Research shows clinicians who practice mindfulness personally demonstrate greater therapeutic presence, less burnout, enhanced empathy, and are more effective at teaching mindfulness.'
    },
    {
      question: 'The primary purpose of "noting" or "labeling" in mindfulness is to:',
      options: [
        'Analyze the content of thoughts',
        'Create distance from thoughts and emotions',
        'Suppress unwanted experiences',
        'Remember what happened in the session'
      ],
      correctAnswer: 1,
      explanation: 'Noting/labeling creates psychological distance from thoughts and emotions. Simply noting "thinking" or "anxiety" creates space between the experience and automatic reaction.'
    },
    {
      question: 'When introducing mindfulness to a depressed client, the most helpful framing is:',
      options: [
        'Mindfulness will make you happy',
        'Mindfulness helps notice rumination without getting pulled into it',
        'Depression means you can\'t do mindfulness',
        'Mindfulness replaces medication'
      ],
      correctAnswer: 1,
      explanation: 'For depression, helpful framing emphasizes that mindfulness helps notice ruminative thought loops without getting pulled into them—observing thoughts without believing them or fighting them.'
    },
    {
      question: 'Starting mindfulness home practice with clients, the recommended duration is:',
      options: ['30 minutes daily', '3-5 minutes daily', '1 hour weekly', 'As long as possible'],
      correctAnswer: 1,
      explanation: 'Starting small (3-5 minutes daily) is more effective than ambitious goals. Consistency matters more than duration, and brief daily practice beats occasional long sessions.'
    },
    {
      question: 'Mindful breathing differs from relaxation breathing because:',
      options: [
        'It requires controlling the breath',
        'It simply observes natural breathing without trying to change it',
        'It only works when lying down',
        'It must be done for 30+ minutes'
      ],
      correctAnswer: 1,
      explanation: 'In mindful breathing, there\'s no need to control or change breathing—you simply observe the natural rhythm. This differs from relaxation techniques that often involve controlled breathing patterns.'
    }
  ]
};

// ============================================================================
// COURSE 3: SELF-CARE FOR CLINICIANS
// ============================================================================

const SELFCARE_CLINICIANS = {
  slug: 'self-care-clinicians',
  title: 'Self-Care for Clinicians: Preventing Burnout and Compassion Fatigue',
  ceHours: 1,
  description: 'This course examines the distinct phenomena of burnout, compassion fatigue, and vicarious trauma that affect mental health professionals. Participants will learn to recognize warning signs, assess their own professional well-being using validated tools, and develop sustainable self-care practices across multiple life domains to maintain effectiveness and longevity in the field.',
  targetAudience: 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, Psychologists, and other mental health professionals who work with clients experiencing distress or trauma.',
  learningObjectives: [
    'Differentiate between burnout, compassion fatigue, and vicarious trauma including their causes, symptoms, and impacts on clinical work',
    'Identify personal warning signs across physical, emotional, cognitive, and behavioral domains using self-assessment frameworks',
    'Apply the six domains of self-care framework to develop a sustainable personal self-care plan',
    'Recognize self-care as an ethical obligation in clinical practice as outlined in the ACA Code of Ethics'
  ],
  modules: [
    {
      title: 'Module 1: Understanding Burnout and Compassion Fatigue',
      lessons: [
        {
          title: 'Defining the Problems',
          type: 'text',
          content: `# Defining the Problems: Burnout, Compassion Fatigue, and Vicarious Trauma

Mental health professionals face unique occupational hazards. Understanding the distinct phenomena of burnout, compassion fatigue, and vicarious trauma is the first step toward prevention and recovery.

## Burnout

**Definition:** A state of chronic workplace stress characterized by emotional exhaustion, depersonalization, and reduced sense of personal accomplishment (Maslach & Jackson, 1981).

**Three Dimensions:**

**Emotional Exhaustion** - Feeling drained, depleted, used up. Difficulty mustering energy for work. Dreading the workday. The sense that you have nothing left to give.

**Depersonalization/Cynicism** - Emotional distancing from clients. Treating clients as objects, cases, or diagnostic labels rather than people. Developing negative, callous attitudes toward the work and those you serve.

**Reduced Personal Accomplishment** - Feeling ineffective despite effort. Sense that work doesn't matter or make a difference. Loss of meaning or purpose. "Why do I bother?"

**Causes of Burnout:**
- Excessive workload
- Lack of control over schedule or decisions
- Insufficient reward (financial, recognition)
- Breakdown in workplace community
- Absence of fairness or equity
- Value conflicts with organization

## Compassion Fatigue

**Definition:** The emotional and physical exhaustion that results from caring for traumatized or suffering individuals over time. Also called secondary traumatic stress or empathy fatigue.

**Characteristics:**
- Emotional blunting—difficulty feeling anything
- Decreased empathy—caring less than you used to
- Difficulty feeling pleasure in work or life
- Intrusive thoughts about clients
- Avoidance of client material or certain client types
- Physical symptoms (fatigue, headaches, GI issues, sleep disturbance)

**Key difference from burnout:** Compassion fatigue is specifically related to the empathic engagement with suffering; it's the cost of caring. Burnout can occur in any high-stress workplace—you could burn out as an accountant. Compassion fatigue is specific to helping professions.

## Vicarious Trauma

**Definition:** The transformation in the clinician's inner experience resulting from empathic engagement with clients' trauma material. Also called secondary traumatic stress disorder.

**Manifestations:**
- Changes in worldview (world now seems more dangerous)
- Disrupted beliefs about safety, trust, control, esteem, intimacy
- Intrusive imagery from client stories—you see what they described
- Hypervigilance in daily life
- Avoidance behaviors
- Emotional numbing
- Disrupted beliefs about self and world

**Key feature:** Vicarious trauma involves cognitive shifts—fundamental changes in how the clinician views themselves, others, and the world. It's not just exhaustion; it's transformation.

## Comparing the Three

Burnout has gradual onset, is caused by work conditions, focuses on exhaustion, and manifests as cynicism and detachment. Recovery involves work changes.

Compassion fatigue can have sudden onset, is caused by empathic engagement, focuses on caring capacity, and manifests as emotional blunting and intrusions. Recovery involves renewal of compassion.

Vicarious trauma has gradual onset, is caused by trauma exposure, focuses on worldview, and manifests as cognitive and belief shifts. Recovery involves processing and meaning-making.

These conditions can co-occur and interact. A clinician may experience burnout, compassion fatigue, and vicarious trauma simultaneously.

## The Ethical Imperative

Self-care isn't selfish—it's an ethical obligation. The ACA Code of Ethics states that counselors "engage in self-care activities to maintain and promote their emotional, physical, mental, and spiritual well-being to best meet their professional responsibilities."

Impaired clinicians risk diminished effectiveness, boundary violations, client harm, ethical complaints and license jeopardy, and premature career exit—losing experienced clinicians the field needs.

Understanding these phenomena is protective. Recognition is the first step toward prevention and intervention.`
        },
        {
          title: 'Assessment and Self-Awareness',
          type: 'text',
          content: `# Assessment and Self-Awareness

Regular self-assessment is critical for early detection and prevention. This lesson provides tools and frameworks for ongoing monitoring of your professional well-being.

## Professional Quality of Life (ProQOL)

The most widely used assessment for helping professionals, the ProQOL (Stamm, 2010) measures three subscales:

**Compassion Satisfaction** - The pleasure derived from doing your work well. Feeling effective, connected, and fulfilled by helping others. This is the positive side of helping.

**Burnout** - Feelings of hopelessness and difficulty dealing with work. Exhaustion, frustration, anger, depression related to work.

**Secondary Traumatic Stress** - Work-related secondary exposure to extremely stressful events. Fear, sleep disturbance, intrusive images, avoidance related to client trauma.

The ProQOL is free and available at proqol.org. Consider taking it:
- Quarterly as routine self-care
- When you notice warning signs
- After particularly difficult cases or periods
- During high-stress organizational times

## Warning Signs Checklist

**Physical Warning Signs:**
- Chronic muscle tension (especially neck, shoulders, jaw)
- Headaches
- GI disturbances
- Frequent illness (lowered immunity)
- Fatigue unrelieved by rest
- Sleep disturbance
- Appetite changes

**Emotional Warning Signs:**
- Irritability, short fuse
- Anxiety
- Depression, hopelessness
- Emotional numbness
- Dread about seeing clients
- Loss of pleasure in work

**Cognitive Warning Signs:**
- Difficulty concentrating
- Forgetfulness
- Cynical thoughts ("why bother")
- Intrusive thoughts about clients
- Hypervigilance
- Changed worldview (more negative)

**Behavioral Warning Signs:**
- Withdrawal from colleagues
- Canceling sessions or avoiding clients
- Poor boundaries (over- or under-involvement)
- Decreased productivity
- Substance use to cope
- Neglecting self-care

## Creating a Personal Warning Signs List

Based on your history and patterns, identify your individual markers:

**My Early Warning Signs** (subtle, first things I notice):
These are your personal early indicators. For some it's disrupted sleep; for others it's irritability with family; for others it's losing interest in hobbies.

**My Moderate Warning Signs** (concerning patterns requiring attention):
These suggest you need to take active steps—increase self-care, adjust caseload, seek supervision.

**My Emergency Signs** (need immediate action):
These indicate significant impairment requiring immediate intervention—therapy, leave, caseload changes, possibly medical attention.

## Feedback Sources

Don't rely solely on self-assessment—we're not always the best judges of our own state:

**Supervision:** Regular case consultation provides outside perspective. A good supervisor will notice changes in you before you do.

**Peer feedback:** Ask trusted colleagues for honest observations. "How have I seemed lately?"

**Family/friends:** They often notice changes before you do—withdrawal, irritability, preoccupation.

**Clients:** While not for your self-care directly, be alert to themes—clients feeling rushed, dismissed, or that you're not fully present.

## Action Thresholds

Decide in advance what level of concern triggers what action:

**Mild:** Increase self-care practices. Be more intentional about basics.

**Moderate:** Discuss in supervision. Consider caseload reduction if possible. Increase support.

**Severe:** Seek personal therapy. Consider medical evaluation. May need leave. Consult ethics guidelines.

The goal is catching concerns early, when intervention is easiest and most effective. Once burnout is severe, recovery takes much longer.`
        }
      ],
      knowledgeCheck: [
        {
          question: 'Which of the following best distinguishes compassion fatigue from burnout?',
          options: [
            'Compassion fatigue develops more slowly over time',
            'Compassion fatigue is specifically related to empathic engagement with suffering',
            'Burnout only affects mental health professionals',
            'Compassion fatigue does not include physical symptoms'
          ],
          correctAnswer: 1,
          explanation: 'Compassion fatigue is specifically related to the empathic engagement with suffering (the cost of caring), while burnout can occur in any high-stress workplace—not just helping professions.'
        },
        {
          question: 'According to Maslach and Jackson, which of the following is NOT one of the three dimensions of burnout?',
          options: [
            'Emotional exhaustion',
            'Depersonalization',
            'Vicarious traumatization',
            'Reduced personal accomplishment'
          ],
          correctAnswer: 2,
          explanation: 'The three dimensions of burnout are emotional exhaustion, depersonalization/cynicism, and reduced personal accomplishment. Vicarious traumatization is a separate phenomenon involving worldview changes.'
        },
        {
          question: 'The ProQOL assessment measures all of the following EXCEPT:',
          options: [
            'Compassion satisfaction',
            'Burnout',
            'Caseload size',
            'Secondary traumatic stress'
          ],
          correctAnswer: 2,
          explanation: 'The ProQOL measures compassion satisfaction, burnout, and secondary traumatic stress. It does not measure caseload size, though caseload can contribute to burnout.'
        },
        {
          question: 'Vicarious trauma is distinguished from other professional impairments primarily by:',
          options: [
            'Its sudden onset',
            'Changes in worldview and cognitive shifts about safety, trust, and control',
            'Physical symptoms',
            'Decreased empathy'
          ],
          correctAnswer: 1,
          explanation: 'Vicarious trauma involves cognitive shifts—fundamental changes in how the clinician views themselves, others, and the world, particularly around themes of safety, trust, and control.'
        },
        {
          question: 'The ACA Code of Ethics addresses clinician self-care by:',
          options: [
            'Stating it is optional but recommended',
            'Stating counselors should engage in self-care to best meet professional responsibilities',
            'Requiring annual burnout assessments',
            'Mandating specific self-care activities'
          ],
          correctAnswer: 1,
          explanation: 'The ACA Code states counselors "engage in self-care activities to maintain and promote their emotional, physical, mental, and spiritual well-being to best meet their professional responsibilities."'
        }
      ]
    },
    {
      title: 'Module 2: Self-Care Strategies',
      lessons: [
        {
          title: 'Building a Sustainable Self-Care Practice',
          type: 'text',
          content: `# Building a Sustainable Self-Care Practice

Effective self-care is not occasional indulgence—it's consistent, intentional practice across multiple domains. "Treat yourself" is not self-care. Self-care is the ongoing maintenance that keeps you functional and effective.

## The Six Domains of Self-Care

**1. Physical Self-Care**

Sleep: Aim for 7-9 hours. Maintain consistent schedule. Create restful environment. Limit screens before bed. Sleep is foundational—everything else suffers without it.

Nutrition: Regular meals. Adequate hydration. Limit caffeine and alcohol. You cannot think clearly or regulate emotions on junk food and coffee.

Movement: Regular exercise (150 min/week moderate activity). Movement throughout the day. Stretching and body awareness. Exercise is as effective as medication for mild depression.

Medical care: Regular checkups. Address health concerns promptly. Don't neglect yourself while caring for others.

**2. Emotional Self-Care**

Processing: Regular supervision with emotional content. Personal therapy when needed. Journaling. You need somewhere to put what you absorb from clients.

Boundaries: Leaving work at work. Saying no when needed. Protecting personal time. Without boundaries, work expands to fill all available space.

Emotional expression: Allowing yourself to feel. Crying, laughing, creating. Not numbing difficult emotions with substances, screens, or busyness.

**3. Social Self-Care**

Connection: Quality time with loved ones. Friendships outside of work. Community involvement. Isolation is both a symptom and cause of burnout.

Professional community: Peer support. Consultation groups. Professional associations. Those who understand your work.

Boundaries: Protecting relationships from work spillover. Being present when with others, not mentally reviewing cases.

**4. Cognitive Self-Care**

Stimulation: Learning outside your field. Reading for pleasure. Creative pursuits. Your brain needs variety, not just clinical content.

Boundaries: Limiting work-related reading outside hours. Engaging with uplifting content. Protecting cognitive resources.

Mindfulness: Present-moment awareness. Disengaging from rumination. Mental rest.

**5. Spiritual Self-Care**

Meaning: Connecting to purpose. Values clarification. Remembering why you do this work. Without meaning, the work becomes soul-crushing.

Practices: Whatever nourishes your spirit—nature, meditation, prayer, art, music.

Community: Spiritual or religious community if relevant. Shared meaning-making with others.

**6. Professional Self-Care**

Boundaries: Manageable caseload. Appropriate scheduling (breaks between heavy sessions). Clear start and end to workday.

Development: Continuing education that energizes (not just requirement-filling). Skill building. Seeking new challenges.

Environment: Comfortable workspace. Resources needed to do job well. Addressing organizational dysfunction.

## Making Self-Care Happen

**Strategies that work:**
- Schedule it (literally put it in your calendar like any appointment)
- Start small (5 minutes is better than nothing—and better than an ambitious plan you won't do)
- Stack habits (add to existing routines—mindfulness after morning coffee)
- Remove barriers (prep in advance—gym clothes out, healthy food prepped)
- Track progress (simple log—builds awareness and momentum)
- Get accountability (peer, partner, therapist—tell someone your plan)
- Expect imperfection (missing once isn't failure—just resume)

**Common obstacles and responses:**

*"I don't have time"* — Start with 5 minutes. Self-care saves time by improving efficiency. You don't have time NOT to do this.

*"I feel guilty"* — Impaired clinicians harm clients. Self-care is ethical. Put your own oxygen mask on first.

*"My clients' needs are greater"* — You can't pour from an empty cup. Your depletion serves no one.

## Compassion Satisfaction

Self-care isn't just preventing the negative—it's cultivating the positive. Compassion satisfaction is the pleasure and fulfillment from helping others.

Nurture compassion satisfaction by:
- Celebrating client progress (notice the wins)
- Remembering meaningful moments
- Connecting to purpose (why did you enter this field?)
- Seeking work that aligns with values
- Finding meaning even in difficult cases

Sustainable careers require both managing demands (self-care) and nurturing rewards (compassion satisfaction).`
        }
      ],
      knowledgeCheck: [
        {
          question: 'The six domains of self-care include all of the following EXCEPT:',
          options: ['Physical', 'Financial', 'Spiritual', 'Cognitive'],
          correctAnswer: 1,
          explanation: 'The six domains are physical, emotional, social, cognitive, spiritual, and professional. Financial well-being matters but isn\'t one of the traditional self-care domains in this framework.'
        },
        {
          question: 'Which strategy is recommended for making self-care practices sustainable?',
          options: [
            'Wait until you feel motivated to start',
            'Begin with long, intensive practice sessions',
            'Schedule self-care like appointments and start small',
            'Focus on only one domain at a time for a year'
          ],
          correctAnswer: 2,
          explanation: 'Effective strategies include scheduling self-care (treating it like appointments), starting small (5 minutes beats nothing), stacking habits onto existing routines, and accepting imperfection.'
        },
        {
          question: 'The response to "I don\'t have time for self-care" should emphasize:',
          options: [
            'Making self-care a low priority until work slows down',
            'That self-care actually saves time by improving efficiency',
            'That only privileged people have time for self-care',
            'Doing self-care only on weekends'
          ],
          correctAnswer: 1,
          explanation: 'Self-care saves time by improving efficiency. The answer to "I don\'t have time" is "start with 5 minutes" and recognize that you don\'t have time NOT to do this—depletion costs more time than prevention.'
        },
        {
          question: 'Compassion satisfaction refers to:',
          options: [
            'Being satisfied that clients are compassionate',
            'The pleasure and fulfillment derived from helping others effectively',
            'A scale measuring burnout levels',
            'Satisfaction with workplace compassion policies'
          ],
          correctAnswer: 1,
          explanation: 'Compassion satisfaction is the positive side of helping work—the pleasure and fulfillment from doing your work well, feeling effective and connected, and making a difference.'
        },
        {
          question: 'Professional self-care includes:',
          options: [
            'Maintaining a manageable caseload and clear work boundaries',
            'Always putting clients first no matter the cost',
            'Working longer hours to serve more people',
            'Avoiding continuing education to reduce stress'
          ],
          correctAnswer: 0,
          explanation: 'Professional self-care includes manageable caseload, appropriate scheduling with breaks, clear start/end to workday, energizing continuing education, and a supportive work environment.'
        }
      ]
    }
  ],
  finalExam: [
    {
      question: 'Burnout, as defined by Maslach and Jackson, includes which three dimensions?',
      options: [
        'Anxiety, depression, and fatigue',
        'Emotional exhaustion, depersonalization, and reduced personal accomplishment',
        'Physical symptoms, cognitive distortions, and behavioral changes',
        'Work stress, relationship problems, and health issues'
      ],
      correctAnswer: 1,
      explanation: 'Maslach and Jackson defined burnout as having three dimensions: emotional exhaustion, depersonalization/cynicism, and reduced sense of personal accomplishment.'
    },
    {
      question: 'Compassion fatigue is most accurately described as:',
      options: [
        'Being tired of showing compassion',
        'The emotional exhaustion from empathic engagement with suffering over time',
        'A lack of compassion from supervisors',
        'Fatigue that is helped by compassionate care'
      ],
      correctAnswer: 1,
      explanation: 'Compassion fatigue is the emotional and physical exhaustion that results from caring for traumatized or suffering individuals over time—sometimes called the cost of caring.'
    },
    {
      question: 'Vicarious trauma differs from burnout primarily in that it involves:',
      options: [
        'Physical symptoms only',
        'Cognitive shifts in worldview regarding safety, trust, and control',
        'Workplace factors',
        'Faster recovery'
      ],
      correctAnswer: 1,
      explanation: 'Vicarious trauma involves transformation in inner experience—cognitive shifts that fundamentally change how clinicians view themselves, others, and the world, particularly around safety, trust, and control.'
    },
    {
      question: 'The ProQOL is recommended for use:',
      options: [
        'Only when problems are suspected',
        'Once per career',
        'Quarterly as routine self-care and after difficult periods',
        'Only for new clinicians'
      ],
      correctAnswer: 2,
      explanation: 'The ProQOL is recommended quarterly as routine self-care, when warning signs are noticed, after difficult cases or periods, and during high-stress organizational times.'
    },
    {
      question: 'According to the ACA Code of Ethics, clinician self-care is:',
      options: [
        'Optional but encouraged',
        'An ethical obligation to best meet professional responsibilities',
        'Only necessary after impairment occurs',
        'The responsibility of employers'
      ],
      correctAnswer: 1,
      explanation: 'The ACA Code of Ethics states counselors "engage in self-care activities to maintain and promote their emotional, physical, mental, and spiritual well-being to best meet their professional responsibilities."'
    },
    {
      question: 'Physical self-care includes all of the following EXCEPT:',
      options: ['Adequate sleep (7-9 hours)', 'Regular exercise', 'Regular medical checkups', 'Working through lunch to see more clients'],
      correctAnswer: 3,
      explanation: 'Physical self-care includes sleep, nutrition, movement, and medical care. Working through lunch is the opposite of self-care—it depletes rather than replenishes.'
    },
    {
      question: 'The most effective approach to implementing self-care is:',
      options: [
        'Waiting until you feel motivated',
        'Starting with intensive daily two-hour practices',
        'Scheduling it, starting small, and expecting imperfection',
        'Focusing on it only during vacations'
      ],
      correctAnswer: 2,
      explanation: 'Effective implementation involves scheduling (like appointments), starting small (5 minutes beats nothing), removing barriers, tracking progress, getting accountability, and expecting imperfection.'
    },
    {
      question: 'Which of the following is a behavioral warning sign of burnout?',
      options: [
        'Feeling anxious',
        'Withdrawal from colleagues and avoiding clients',
        'Chronic headaches',
        'Negative thoughts'
      ],
      correctAnswer: 1,
      explanation: 'Behavioral warning signs include withdrawal from colleagues, canceling/avoiding sessions, poor boundaries, decreased productivity, substance use, and neglecting self-care.'
    },
    {
      question: 'Emotional self-care includes:',
      options: [
        'Working through difficult feelings without support',
        'Regular supervision, personal therapy when needed, and allowing emotional expression',
        'Suppressing emotions to stay professional',
        'Focusing only on positive feelings'
      ],
      correctAnswer: 1,
      explanation: 'Emotional self-care includes processing through supervision and personal therapy, maintaining boundaries, and allowing emotional expression rather than numbing or suppressing.'
    },
    {
      question: 'The rationale for why "I don\'t have time for self-care" is counterproductive is:',
      options: [
        'Everyone has time; it\'s about priorities',
        'Self-care saves time by improving efficiency and preventing costly depletion',
        'You should sacrifice personal time for clients',
        'Self-care only takes 5 minutes anyway'
      ],
      correctAnswer: 1,
      explanation: 'Self-care saves time by improving efficiency. Depletion costs more than prevention—you don\'t have time NOT to engage in self-care. Start with 5 minutes if needed.'
    },
    {
      question: 'Professional self-care includes:',
      options: [
        'Taking on extra cases to help more people',
        'Manageable caseload, clear work boundaries, and energizing continuing education',
        'Working weekends to catch up',
        'Avoiding professional development'
      ],
      correctAnswer: 1,
      explanation: 'Professional self-care includes manageable caseload, appropriate scheduling with breaks, clear work boundaries, development that energizes, and a supportive environment.'
    },
    {
      question: 'Compassion satisfaction is nurtured by:',
      options: [
        'Focusing only on difficult cases',
        'Celebrating client progress and connecting to purpose',
        'Avoiding emotional connection with clients',
        'Working longer hours'
      ],
      correctAnswer: 1,
      explanation: 'Compassion satisfaction is nurtured by celebrating wins, remembering meaningful moments, connecting to purpose, seeking value-aligned work, and finding meaning in difficult cases.'
    },
    {
      question: 'Which domain of self-care specifically addresses "remembering why you entered this field"?',
      options: ['Physical', 'Cognitive', 'Spiritual', 'Social'],
      correctAnswer: 2,
      explanation: 'Spiritual self-care includes connecting to purpose, values clarification, and remembering why you do this work—finding meaning beyond just getting through each day.'
    },
    {
      question: 'When warning signs of burnout are at a "moderate" level, appropriate action includes:',
      options: [
        'Ignoring them since they\'re not severe',
        'Discussing in supervision and considering caseload reduction',
        'Taking a year off work',
        'Immediate hospitalization'
      ],
      correctAnswer: 1,
      explanation: 'Moderate warning signs warrant discussion in supervision, possible caseload reduction if possible, and increased support. Early intervention prevents progression to severe impairment.'
    },
    {
      question: 'Social self-care involves:',
      options: [
        'Discussing cases with family and friends',
        'Quality connection with loved ones and professional community support',
        'Using social media for most interaction',
        'Isolating to protect boundaries'
      ],
      correctAnswer: 1,
      explanation: 'Social self-care includes quality time with loved ones, friendships outside work, peer support, consultation groups, and being present in relationships—connection, not isolation.'
    },
    {
      question: 'The statement "You can\'t pour from an empty cup" relates to the concept of:',
      options: [
        'Having too many clients',
        'Self-care being necessary to maintain capacity to help others',
        'Financial planning',
        'Cup size preferences'
      ],
      correctAnswer: 1,
      explanation: 'This metaphor captures the reality that depleted clinicians cannot effectively help others. Self-care maintains the capacity to serve—it\'s not selfish but necessary for sustainable helping.'
    }
  ]
};

// ============================================================================
// REMAINING COURSE TEMPLATES (abbreviated for file length)
// ============================================================================

// Additional courses would follow the same comprehensive structure.
// For practical purposes, creating templates that can be expanded:

const THERAPEUTIC_RAPPORT = {
  slug: 'therapeutic-rapport',
  title: 'Building Therapeutic Rapport: The First Sessions',
  ceHours: 1,
  description: 'This course focuses on the critical first sessions of therapy and the establishment of therapeutic rapport. Participants will learn evidence-based strategies for creating safety, structuring initial sessions, building the therapeutic alliance that predicts positive treatment outcomes, and repairing early ruptures.',
  targetAudience: 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, Psychologists, and other mental health professionals.',
  learningObjectives: [
    'Explain the research supporting the importance of early alliance in predicting treatment outcomes',
    'Identify key elements clients need in first sessions including safety, being heard, hope, and respect',
    'Structure an effective first session balancing rapport building with essential information gathering',
    'Apply strategies for recognizing and repairing early alliance ruptures'
  ],
  // Content modules would follow same detailed structure...
  modules: [],
  finalExam: []
};

const PSYCHIATRIC_MEDS = {
  slug: 'psychiatric-medications-basics',
  title: 'Psychiatric Medications: What Non-Prescribers Need to Know',
  ceHours: 1,
  description: 'This course provides non-prescribing mental health clinicians with essential knowledge about psychiatric medications. Participants will learn major medication categories, common side effects, and strategies for collaborating effectively with prescribers while maintaining appropriate scope of practice.',
  targetAudience: 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, and other non-prescribing mental health professionals who work with clients on psychiatric medications.',
  learningObjectives: [
    'Identify the major categories of psychiatric medications and their primary clinical uses',
    'Recognize common side effects of antidepressants, anxiolytics, mood stabilizers, and antipsychotics',
    'Distinguish between appropriate and inappropriate roles for non-prescribers regarding medication discussions',
    'Apply strategies for effective coordination with prescribing providers'
  ],
  modules: [],
  finalExam: []
};

const CONFIDENTIALITY = {
  slug: 'confidentiality-privacy',
  title: 'Confidentiality and Privacy in Counseling',
  ceHours: 1,
  description: 'This course examines the ethical and legal frameworks governing client confidentiality in mental health practice. Participants will learn the distinctions between confidentiality, privacy, and privilege, understand exceptions and limits to confidentiality, and apply best practices for protecting client information in various scenarios.',
  targetAudience: 'Licensed Professional Counselors, Licensed Clinical Social Workers, Marriage and Family Therapists, Psychologists, and other mental health professionals.',
  learningObjectives: [
    'Differentiate between confidentiality, privacy, and privilege in clinical practice',
    'Identify mandatory reporting requirements and duty to warn/protect obligations across jurisdictions',
    'Apply confidentiality principles in challenging scenarios including requests from family, other providers, and courts',
    'Implement best practices for protecting client information in electronic communications and records'
  ],
  modules: [],
  finalExam: []
};

// ============================================================================
// ALL COURSES ARRAY
// ============================================================================

const ALL_COURSES = [
  ACTIVE_LISTENING,
  MINDFULNESS_CLINICAL,
  SELFCARE_CLINICIANS,
  THERAPEUTIC_RAPPORT,
  PSYCHIATRIC_MEDS,
  CONFIDENTIALITY
];

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function populate1CECourses() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    for (const courseData of ALL_COURSES) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${courseData.title}`);
      
      // Find the course by slug (try variations)
      let course = await Course.findOne({ 
        $or: [
          { slug: courseData.slug },
          { slug: { $regex: courseData.slug, $options: 'i' } }
        ]
      });
      
      if (!course) {
        // Try partial match on first few words
        const searchTerms = courseData.slug.split('-').slice(0, 2).join('.*');
        course = await Course.findOne({ 
          slug: { $regex: searchTerms, $options: 'i' } 
        });
        if (course) {
          console.log(`   Found via partial match: ${course.slug}`);
        }
      }
      
      if (!course) {
        console.log(`❌ Course not found: ${courseData.slug}`);
        console.log(`   Consider creating this course or checking the slug.`);
        continue;
      }

      console.log(`Found course: ${course.title} (${course.slug})`);
      
      // Update course with ACEP-compliant content
      course.description = courseData.description;
      course.targetAudience = courseData.targetAudience;
      course.learningObjectives = courseData.learningObjectives;
      course.ceHours = courseData.ceHours;
      course.credits = courseData.ceHours;
      course.hours = courseData.ceHours;
      
      if (courseData.modules && courseData.modules.length > 0) {
        course.modules = courseData.modules;
      }
      
      if (courseData.finalExam && courseData.finalExam.length > 0) {
        course.finalExam = courseData.finalExam;
      }
      
      // NBCC ACEP metadata
      course.providerNumber = '7760';
      course.passingScore = 80;
      
      await course.save();
      
      // Calculate stats
      let totalLessons = 0;
      let totalKnowledgeChecks = 0;
      courseData.modules?.forEach(m => {
        totalLessons += m.lessons?.length || 0;
        totalKnowledgeChecks += m.knowledgeCheck?.length || 0;
      });
      
      console.log(`✅ Updated with ACEP-compliant content:`);
      console.log(`   - Learning Objectives: ${courseData.learningObjectives?.length || 0}`);
      console.log(`   - Modules: ${courseData.modules?.length || 0}`);
      console.log(`   - Lessons: ${totalLessons}`);
      console.log(`   - Knowledge Checks: ${totalKnowledgeChecks}`);
      console.log(`   - Final Exam Questions: ${courseData.finalExam?.length || 0}`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('COMPLETE');
    console.log(`${'='.repeat(60)}`);
    
    // Summary
    const complete = ALL_COURSES.filter(c => c.modules.length > 0 && c.finalExam.length >= 15);
    const partial = ALL_COURSES.filter(c => c.modules.length === 0 || c.finalExam.length < 15);
    
    console.log(`\nSummary:`);
    console.log(`  Fully populated: ${complete.length} courses`);
    complete.forEach(c => console.log(`    ✅ ${c.title}`));
    
    if (partial.length > 0) {
      console.log(`  Need content completion: ${partial.length} courses`);
      partial.forEach(c => console.log(`    ⚠️  ${c.title}`));
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from database');

  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

populate1CECourses();
