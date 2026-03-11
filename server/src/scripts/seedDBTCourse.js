/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * seedDBTCourse.js
 * 
 * Seeds the DBT Skills Training Course (6 CE Hours)
 * Full interactive format with accessibility features
 * 
 * Run: node src/scripts/seedDBTCourse.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// ============================================================
// DBT COURSE DATA - 6 CE HOURS - INTERACTIVE FORMAT
// ============================================================

const DBT_COURSE = {
  title: "Dialectical Behavior Therapy: Foundations, Clinical Applications, and Evidence-Based Integration",
  slug: "dbt-skills-training-comprehensive",
  code: "CR-DBT-001",
  description: "This comprehensive 6-hour continuing education course provides mental health professionals with a thorough understanding of Dialectical Behavior Therapy (DBT). From its theoretical foundations in biosocial theory and dialectical philosophy to practical applications of the four core skill modules—Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness—this course equips clinicians with evidence-based strategies for working with clients who experience emotional dysregulation, self-destructive behaviors, and interpersonal difficulties.",
  ceHours: 6,
  credits: 6,
  category: "Clinical Practice",
  level: "Intermediate",
  contentArea: "Evidence-Based Treatment",
  targetAudience: [
    "Licensed Professional Counselors",
    "Licensed Clinical Social Workers", 
    "Licensed Marriage and Family Therapists",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Counselors-in-Training"
  ],
  objectives: [
    "Articulate the theoretical foundations of DBT, including biosocial theory, dialectical philosophy, and the transaction model of emotion dysregulation",
    "Identify and describe the four core DBT skill modules—Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness",
    "Differentiate DBT from standard Cognitive Behavioral Therapy and identify clinical presentations where DBT is indicated",
    "Describe the four components of comprehensive DBT—individual therapy, group skills training, phone coaching, and consultation team",
    "Apply specific DBT techniques to common clinical scenarios in outpatient practice",
    "Evaluate the empirical evidence supporting DBT across multiple diagnostic categories",
    "Analyze limitations, criticisms, and cultural considerations related to DBT implementation"
  ],
  deliveryMethod: "online",
  status: "draft",
  isPublished: false,
  acepProvider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    number: "7760"
  },
  accessibility: {
    wcagLevel: "AA",
    screenReaderOptimized: true,
    keyboardNavigable: true,
    colorContrastCompliant: true,
    altTextProvided: true
  },
  modules: [
    // MODULE 1: Introduction and Course Overview
    {
      title: "Introduction and Course Overview",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Introduction and Course Overview",
          subtitle: "Understanding the Foundations of Dialectical Behavior Therapy",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Welcome to this comprehensive continuing education course on Dialectical Behavior Therapy (DBT). Over the past three decades, DBT has emerged as one of the most extensively researched and empirically supported psychotherapeutic approaches in the mental health field. What began as a specialized treatment for chronically suicidal individuals diagnosed with Borderline Personality Disorder has evolved into a versatile therapeutic framework applied across a wide range of clinical presentations, treatment settings, and populations.</p>
          <p>As a practicing mental health professional, you almost certainly encounter clients who present with intense emotional volatility, chronic patterns of self-destructive behavior, difficulty maintaining stable interpersonal relationships, or an inability to tolerate distress without resorting to maladaptive coping strategies. These clinical presentations are among the most challenging in outpatient practice, and they often leave clinicians feeling frustrated, overwhelmed, or uncertain about how to proceed.</p>
          <p>This course will take you on a thorough journey through DBT's theoretical foundations, its four core skill modules, the structure of comprehensive DBT programs, the evidence base supporting its use across multiple diagnostic categories, and the very real limitations and criticisms that clinicians and researchers have raised.</p>`,
          accessibility: { role: "article", ariaLabel: "Course introduction" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Who Should Take This Course?",
              content: "This course is designed for licensed and pre-licensed mental health professionals who work directly with clients presenting emotional dysregulation, self-destructive behaviors, or interpersonal difficulties. This includes LPCs, LCSWs, LMFTs, psychologists, psychiatric nurse practitioners, and graduate students in counseling or clinical psychology programs."
            },
            {
              title: "Course Format and Requirements",
              content: "This asynchronous online course consists of 8 content sections with embedded knowledge checks, reflection exercises, and a comprehensive 20-question final assessment. You must achieve 80% or higher on the final assessment to receive CE credit. Estimated completion time is 6 hours."
            },
            {
              title: "How to Get the Most from This Course",
              content: "We recommend completing this course in multiple sittings rather than all at once. Take notes, complete all reflection exercises, and consider how the material applies to your current caseload. The knowledge checks are designed to reinforce learning—take them seriously even though they don't count toward your final grade."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Course details accordion" }
        },
        {
          type: "reflection",
          question: "Before beginning this course, take a moment to consider: What specific clinical challenges have led you to seek training in DBT? What types of clients or presenting problems do you hope to better serve after completing this course?",
          accessibility: { role: "textbox", ariaLabel: "Pre-course reflection prompt" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each DBT component to its primary function.",
          matchingPairs: [
            { term: "Individual Therapy", definition: "Address specific targets using the treatment hierarchy" },
            { term: "Group Skills Training", definition: "Teach the four core skill modules in a classroom format" },
            { term: "Phone Coaching", definition: "Brief real-time skill coaching during crisis situations" },
            { term: "Consultation Team", definition: "Support therapists in maintaining fidelity and preventing burnout" }
          ],
          accessibility: { ariaLabel: "Drag and drop matching exercise for DBT components", role: "application" }
        },
        {
          type: "multipleChoice",
          question: "What fundamental clinical problem led Dr. Marsha Linehan to develop Dialectical Behavior Therapy?",
          options: [
            { text: "Clients with anxiety disorders were not responding to exposure therapy", isCorrect: false },
            { text: "Clients with depression required longer treatment durations than CBT allowed", isCorrect: false },
            { text: "Chronically suicidal clients either dropped out of change-focused therapy or failed to progress in acceptance-only therapy", isCorrect: true },
            { text: "Insurance companies required a manualized treatment protocol for personality disorders", isCorrect: false }
          ],
          explanation: "Dr. Linehan developed DBT after observing that chronically suicidal clients with BPD were not well served by either pure acceptance-based or pure change-based approaches alone. Acceptance-only treatments validated clients but failed to produce behavioral change, while change-focused treatments led to high dropout rates because clients felt invalidated.",
          accessibility: { ariaLabel: "Knowledge check question about DBT origins", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: "What does the term 'dialectical' refer to in the context of DBT?",
          options: [
            { text: "A specific type of journaling technique used in group skills training", isCorrect: false },
            { text: "The synthesis of opposing forces, specifically the balance between acceptance and change", isCorrect: true },
            { text: "A method of diagnosing personality disorders through structured clinical interviews", isCorrect: false },
            { text: "The therapeutic technique of confronting clients about contradictions in their behavior", isCorrect: false }
          ],
          explanation: "The word 'dialectical' comes from dialectical philosophy and refers to the process of finding truth through the synthesis of opposites. In DBT, the primary dialectic is the tension between acceptance (validating the client's current experience) and change (working toward behavioral modification).",
          accessibility: { ariaLabel: "Knowledge check about dialectical meaning", announceCorrect: true }
        },
        {
          type: "multiSelect",
          question: "Which of the following are components of comprehensive DBT? (Select all that apply)",
          options: [
            { text: "Individual therapy", isCorrect: true },
            { text: "Psychopharmacological management", isCorrect: false },
            { text: "Group skills training", isCorrect: true },
            { text: "Inpatient residential stabilization", isCorrect: false },
            { text: "Phone coaching", isCorrect: true },
            { text: "Therapist consultation team", isCorrect: true }
          ],
          explanation: "Comprehensive DBT consists of four components: individual therapy (to address specific targets and apply skills to daily life), group skills training (to teach the four skill modules), phone coaching (to help clients apply skills in real-time crisis situations), and the therapist consultation team (to support therapists in maintaining fidelity and preventing burnout).",
          accessibility: { ariaLabel: "Multi-select question about DBT components", announceCorrect: true }
        }
      ]
    },
    
    // MODULE 2: Theoretical Foundations
    {
      title: "Theoretical Foundations of DBT",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Theoretical Foundations of DBT",
          subtitle: "Biosocial Theory, Dialectics, and the Transaction Model",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p><strong>Biosocial Theory: The Foundation of Understanding</strong></p>
          <p>At the heart of DBT lies biosocial theory, which provides a comprehensive framework for understanding how emotion dysregulation develops and is maintained. According to this model, emotion dysregulation arises from the transaction between biological vulnerability and an invalidating environment.</p>
          <p>Biological vulnerability refers to an individual's innate tendency toward emotional sensitivity. Some people are simply born with nervous systems that react more quickly to emotional stimuli, experience emotions more intensely, and take longer to return to baseline. This is not a character flaw or a choice—it is a neurobiological reality that varies across individuals.</p>
          <p>An invalidating environment is one in which the individual's internal experiences are chronically dismissed, punished, or trivialized. Common forms of invalidation include telling a child they shouldn't feel what they're feeling, punishing emotional expression, oversimplifying the solutions to emotional problems, and intermittently reinforcing emotional escalation.</p>`,
          accessibility: { role: "article", ariaLabel: "Biosocial theory explanation" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Biological Vulnerability Factors",
              content: "High emotional sensitivity (quick reactivity), High emotional intensity (strong reactions), Slow return to emotional baseline, Possible genetic and temperamental factors, May be exacerbated by early trauma or attachment disruption"
            },
            {
              title: "Invalidating Environment Characteristics", 
              content: "Dismissing or trivializing emotional experiences, Punishing emotional expression, Oversimplifying emotional problems, Intermittent reinforcement of escalation, Failure to teach emotion regulation skills"
            },
            {
              title: "Transaction Model",
              content: "The transaction between biological vulnerability and invalidation creates a self-reinforcing cycle. The emotionally vulnerable child has big reactions; the environment invalidates; the child escalates; the environment sometimes gives in (intermittent reinforcement); the child never learns to regulate; dysregulation increases over time."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Biosocial theory components accordion" }
        },
        {
          type: "multipleChoice",
          question: "According to biosocial theory, emotion dysregulation develops from:",
          options: [
            { text: "Poor parenting choices alone", isCorrect: false },
            { text: "Genetic factors that cannot be modified through treatment", isCorrect: false },
            { text: "The transaction between biological vulnerability and an invalidating environment", isCorrect: true },
            { text: "Traumatic experiences in early childhood exclusively", isCorrect: false }
          ],
          explanation: "Biosocial theory emphasizes the transaction between biological predisposition (emotional sensitivity, intensity, slow return to baseline) and environmental factors (chronic invalidation of emotional experiences). Neither factor alone is sufficient; it is the ongoing interaction that creates and maintains emotion dysregulation.",
          accessibility: { ariaLabel: "Knowledge check about biosocial theory", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Think of a current or recent client who presents with significant emotion dysregulation. How might biosocial theory help you understand their developmental history? Can you identify potential biological vulnerabilities and invalidating experiences that may have contributed to their current difficulties?",
          accessibility: { role: "textbox", ariaLabel: "Clinical application reflection" }
        },
        {
          type: "multipleChoice",
          question: "Which of the following is an example of an invalidating response to a child's emotional expression?",
          options: [
            { text: "Acknowledging the child's feelings while setting limits on behavior", isCorrect: false },
            { text: "Telling the child 'You're fine, stop being so dramatic' when they're crying", isCorrect: true },
            { text: "Helping the child label and understand their emotional experience", isCorrect: false },
            { text: "Sitting with the child during a tantrum without judgment", isCorrect: false }
          ],
          explanation: "Invalidation occurs when emotional experiences are dismissed, trivialized, or punished. Telling a child they're 'fine' or 'being dramatic' when they're clearly distressed teaches them that their internal experiences are wrong, untrustworthy, or unacceptable—a core contributor to emotion dysregulation.",
          accessibility: { ariaLabel: "Knowledge check about invalidation", announceCorrect: true }
        }
      ]
    },

    // MODULE 3: Mindfulness Skills
    {
      title: "Core Skill Module: Mindfulness",
      order: 3,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: "Core Skill Module: Mindfulness",
          subtitle: "The Foundation of All DBT Skills",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Mindfulness is considered the foundation of DBT because it underlies and enhances all other skill modules. In DBT, mindfulness is not presented as a spiritual or religious practice (though it can be for those who want it to be); rather, it is framed as a set of practical skills for paying attention to the present moment without judgment.</p>
          <p>DBT mindfulness skills are divided into two sets: the <strong>"What" skills</strong> (Observe, Describe, Participate) and the <strong>"How" skills</strong> (Non-judgmentally, One-mindfully, Effectively). The "What" skills tell us what to do; the "How" skills tell us how to do it.</p>`,
          accessibility: { role: "article", ariaLabel: "Introduction to mindfulness skills" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "OBSERVE: Just Notice",
              content: "Observing means attending to events, emotions, and behaviors without trying to change them. It's like watching clouds pass in the sky—noticing without grabbing. In practice: Notice your breath, notice sensations in your body, notice thoughts arising without getting caught up in them."
            },
            {
              title: "DESCRIBE: Put Words On",
              content: "Describing means putting words on what you observe. It involves labeling thoughts as thoughts, feelings as feelings, and facts as facts. Key principle: Describe only what you directly observe—avoid interpretations, judgments, or assumptions."
            },
            {
              title: "PARTICIPATE: Enter Fully",
              content: "Participating means fully engaging in the current activity without self-consciousness. It's the opposite of being an outside observer of your own life. When participating effectively, you become one with the activity."
            },
            {
              title: "NON-JUDGMENTALLY: Without Evaluating",
              content: "Practice observing and describing without adding evaluations of 'good' or 'bad.' When judgments arise (and they will), simply notice them as judgments. Replace judgments with descriptions of consequences."
            },
            {
              title: "ONE-MINDFULLY: In the Moment",
              content: "Do one thing at a time. When you're eating, eat. When you're walking, walk. When you're worrying, worry completely—then move on. Let go of distractions and return to what you're doing."
            },
            {
              title: "EFFECTIVELY: Focus on What Works",
              content: "Do what works in the situation rather than what's 'fair' or 'right.' Play by the rules of the game. Act as skillfully as you can, not perfectly. Keep your eye on your objectives."
            }
          ],
          accessibility: { role: "region", ariaLabel: "DBT mindfulness skills accordion" }
        },
        {
          type: "multipleChoice",
          question: "The DBT mindfulness skill of 'Observe' involves:",
          options: [
            { text: "Analyzing your thoughts to determine their origins", isCorrect: false },
            { text: "Attending to events, emotions, and behaviors without trying to change them", isCorrect: true },
            { text: "Evaluating whether your emotional response is appropriate", isCorrect: false },
            { text: "Planning how to respond to a difficult situation", isCorrect: false }
          ],
          explanation: "Observing in DBT means simply noticing or attending to internal and external experiences without trying to change, fix, or judge them. It's the foundation of mindful awareness—just noticing what is present in this moment.",
          accessibility: { ariaLabel: "Knowledge check about Observe skill", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Try this brief mindfulness exercise right now: For 60 seconds, practice observing your breath. Notice where you feel the breath most prominently. When your mind wanders (and it will), simply notice that it wandered and gently return attention to the breath. After completing this exercise, reflect: What did you notice? How might you use this type of exercise with your clients?",
          accessibility: { role: "textbox", ariaLabel: "Mindfulness practice reflection" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each DBT mindfulness skill to its correct description.",
          matchingPairs: [
            { term: "Observe", definition: "Attend to events, emotions, and behaviors without trying to change them" },
            { term: "Describe", definition: "Put words on experiences—label thoughts as thoughts, feelings as feelings" },
            { term: "Participate", definition: "Fully engage in the current activity without self-consciousness" },
            { term: "Non-judgmentally", definition: "Notice without evaluating as good or bad" },
            { term: "One-mindfully", definition: "Do one thing at a time with complete attention" },
            { term: "Effectively", definition: "Focus on what works in the situation rather than what is fair or right" }
          ],
          accessibility: { ariaLabel: "Drag and drop matching for mindfulness skills", role: "application" }
        },
        {
          type: "multipleChoice",
          question: "Which 'How' skill involves doing one thing at a time with full attention?",
          options: [
            { text: "Non-judgmentally", isCorrect: false },
            { text: "Effectively", isCorrect: false },
            { text: "One-mindfully", isCorrect: true },
            { text: "Descriptively", isCorrect: false }
          ],
          explanation: "One-mindfully means giving your complete attention to one thing at a time. When eating, just eat. When listening, just listen. This skill counteracts the tendency toward multitasking and distraction that keeps us from being fully present.",
          accessibility: { ariaLabel: "Knowledge check about One-mindfully skill", announceCorrect: true }
        }
      ]
    },

    // MODULE 4: Distress Tolerance Skills
    {
      title: "Core Skill Module: Distress Tolerance",
      order: 4,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 4,
          title: "Core Skill Module: Distress Tolerance",
          subtitle: "Surviving Crisis Without Making Things Worse",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Distress Tolerance skills are designed to help clients survive crisis situations without resorting to self-destructive behaviors. The goal is not to make the distress go away (that comes with emotion regulation skills); the goal is to get through the crisis without making things worse.</p>
          <p>A key concept is <strong>radical acceptance</strong>—fully accepting reality as it is, even when we don't like it. Radical acceptance does not mean approval or resignation; it means acknowledging what is true in this moment so we can respond effectively.</p>`,
          accessibility: { role: "article", ariaLabel: "Introduction to distress tolerance" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "TIPP Skills (Change Body Chemistry)",
              content: "Temperature (cold water on face), Intense exercise, Paced breathing, Progressive muscle relaxation. These skills work quickly by changing body chemistry to reduce emotional intensity."
            },
            {
              title: "ACCEPTS (Distraction)",
              content: "Activities, Contributing, Comparisons, Emotions (different), Pushing away, Thoughts (other), Sensations. Use these to temporarily distract from overwhelming emotions until you can cope more effectively."
            },
            {
              title: "IMPROVE the Moment",
              content: "Imagery, Meaning, Prayer, Relaxation, One thing in the moment, Vacation (brief), Encouragement. These skills help you get through difficult moments by changing your internal experience."
            },
            {
              title: "Radical Acceptance",
              content: "Fully accepting reality as it is—not approval, not resignation, just acknowledgment of what IS true. Suffering = Pain + Non-acceptance. When we stop fighting reality, we can respond effectively."
            },
            {
              title: "Turning the Mind",
              content: "Choosing to accept. Acceptance is not a one-time decision but an ongoing choice. When you notice yourself fighting reality, turn your mind back toward acceptance—again and again."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Distress tolerance skills accordion" }
        },
        {
          type: "multipleChoice",
          question: "The primary goal of Distress Tolerance skills is to:",
          options: [
            { text: "Eliminate negative emotions quickly", isCorrect: false },
            { text: "Analyze the causes of emotional distress", isCorrect: false },
            { text: "Survive crisis situations without making things worse", isCorrect: true },
            { text: "Replace negative thoughts with positive ones", isCorrect: false }
          ],
          explanation: "Distress tolerance skills are crisis survival skills—they help clients get through intense emotional pain without engaging in behaviors that will create additional problems. The goal is not to fix or eliminate the distress but to tolerate it skillfully.",
          accessibility: { ariaLabel: "Knowledge check about distress tolerance goals", announceCorrect: true }
        },
        {
          type: "multiSelect",
          question: "Which of the following are TIPP skills? (Select all that apply)",
          options: [
            { text: "Temperature (cold water on face)", isCorrect: true },
            { text: "Imagery", isCorrect: false },
            { text: "Intense exercise", isCorrect: true },
            { text: "Paced breathing", isCorrect: true },
            { text: "Prayer", isCorrect: false },
            { text: "Progressive muscle relaxation", isCorrect: true }
          ],
          explanation: "TIPP skills (Temperature, Intense exercise, Paced breathing, Progressive/Paired muscle relaxation) work by rapidly changing body chemistry to reduce the intensity of emotions. These are particularly useful in crisis situations because they work quickly.",
          accessibility: { ariaLabel: "Multi-select about TIPP skills", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Think about a time when you or a client struggled to accept a difficult reality. What made acceptance hard? What might have helped? How could radical acceptance have changed the response to that situation?",
          accessibility: { role: "textbox", ariaLabel: "Reflection on radical acceptance" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each distress tolerance skill set to its primary purpose.",
          matchingPairs: [
            { term: "TIPP", definition: "Rapidly change body chemistry to reduce emotional intensity" },
            { term: "ACCEPTS", definition: "Temporarily distract from overwhelming emotions" },
            { term: "IMPROVE the Moment", definition: "Change internal experience to get through difficult moments" },
            { term: "Radical Acceptance", definition: "Fully acknowledge reality as it is without fighting it" },
            { term: "Turning the Mind", definition: "Actively choose acceptance over and over again" }
          ],
          accessibility: { ariaLabel: "Drag and drop matching for distress tolerance skills", role: "application" }
        }
      ]
    },

    // MODULE 5: Emotion Regulation Skills
    {
      title: "Core Skill Module: Emotion Regulation",
      order: 5,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 5,
          title: "Core Skill Module: Emotion Regulation",
          subtitle: "Understanding and Changing Emotional Responses",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>While Distress Tolerance skills help clients survive crises, Emotion Regulation skills help reduce the frequency and intensity of unwanted emotions over time. This module teaches clients to understand their emotions, reduce vulnerability to negative emotions, and change unwanted emotions when they arise.</p>
          <p>A foundational concept is that <strong>emotions are not problems to be eliminated</strong>—they are signals that provide information. The goal is not to never feel negative emotions but to experience emotions without being controlled by them.</p>`,
          accessibility: { role: "article", ariaLabel: "Introduction to emotion regulation" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Understanding Emotions",
              content: "Emotions have components: prompting event, interpretation, physical sensations, action urge, and expression. Understanding this chain helps identify intervention points. All emotions are valid; not all actions prompted by emotions are effective."
            },
            {
              title: "ABC PLEASE (Reduce Vulnerability)",
              content: "Accumulate positive experiences, Build mastery, Cope ahead. PhysicaL illness (treat), Eating (balanced), Avoid mood-altering substances, Sleep (adequate), Exercise. These reduce baseline vulnerability to emotional dysregulation."
            },
            {
              title: "Check the Facts",
              content: "Is my emotion fitting the facts of the situation? Am I assuming threat where none exists? Is my interpretation accurate? What's the most likely outcome? Would a friend see it differently?"
            },
            {
              title: "Opposite Action",
              content: "When an emotion doesn't fit the facts or acting on it would be ineffective, act opposite to the action urge. Fear without threat → approach. Unjustified anger → gently avoid or be kind. Sadness without loss → get active."
            },
            {
              title: "Problem Solving",
              content: "When the emotion fits the facts and the situation can be changed, use problem solving: identify the problem, check the facts, identify your goal, brainstorm solutions, choose a solution, implement, evaluate."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Emotion regulation skills accordion" }
        },
        {
          type: "multipleChoice",
          question: "The emotion regulation skill of 'Opposite Action' is most appropriate when:",
          options: [
            { text: "The emotion fits the facts and the situation can be changed", isCorrect: false },
            { text: "The emotion does not fit the facts or acting on it would be ineffective", isCorrect: true },
            { text: "The client is in a crisis and needs immediate relief", isCorrect: false },
            { text: "The client wants to avoid feeling any negative emotions", isCorrect: false }
          ],
          explanation: "Opposite Action is used when the emotion doesn't match the facts of the situation (e.g., fear when there's no real threat) or when acting on the emotion would make things worse. If the emotion fits the facts and the situation can be changed, problem solving is more appropriate.",
          accessibility: { ariaLabel: "Knowledge check about Opposite Action", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Consider the ABC PLEASE skills for reducing emotional vulnerability. Which of these areas do you think is most frequently overlooked by clients? Which might be most relevant for your own self-care as a clinician?",
          accessibility: { role: "textbox", ariaLabel: "Reflection on reducing vulnerability" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each emotion regulation strategy to its appropriate use.",
          matchingPairs: [
            { term: "Check the Facts", definition: "Evaluate whether your emotional response fits the actual situation" },
            { term: "Opposite Action", definition: "Act counter to the emotion's urge when the emotion doesn't fit the facts" },
            { term: "Problem Solving", definition: "Change the situation when the emotion fits the facts" },
            { term: "ABC PLEASE", definition: "Reduce baseline vulnerability to negative emotions over time" },
            { term: "Accumulate Positives", definition: "Build a life worth living through pleasant activities and values" }
          ],
          accessibility: { ariaLabel: "Drag and drop matching for emotion regulation strategies", role: "application" }
        },
        {
          type: "multipleChoice",
          question: "According to DBT, the goal of emotion regulation is to:",
          options: [
            { text: "Eliminate all negative emotional experiences", isCorrect: false },
            { text: "Always maintain a positive mood", isCorrect: false },
            { text: "Experience emotions without being controlled by them", isCorrect: true },
            { text: "Suppress emotions until they naturally dissipate", isCorrect: false }
          ],
          explanation: "DBT views emotions as valid and functional—they provide important information. The goal is not to eliminate negative emotions but to reduce suffering caused by unregulated emotional responses and to have more control over emotional experiences.",
          accessibility: { ariaLabel: "Knowledge check about emotion regulation goals", announceCorrect: true }
        }
      ]
    },

    // MODULE 6: Interpersonal Effectiveness Skills
    {
      title: "Core Skill Module: Interpersonal Effectiveness",
      order: 6,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 6,
          title: "Core Skill Module: Interpersonal Effectiveness",
          subtitle: "Getting What You Need While Maintaining Relationships and Self-Respect",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Interpersonal Effectiveness skills help clients navigate relationships, ask for what they need, say no when appropriate, and maintain both relationships and self-respect. These skills are particularly important for clients who tend toward passivity, aggression, or passive-aggressive communication patterns.</p>
          <p>DBT identifies three types of interpersonal effectiveness, each with its own skill set: <strong>DEAR MAN</strong> (objectives effectiveness), <strong>GIVE</strong> (relationship effectiveness), and <strong>FAST</strong> (self-respect effectiveness).</p>`,
          accessibility: { role: "article", ariaLabel: "Introduction to interpersonal effectiveness" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "DEAR MAN (Getting What You Want)",
              content: "Describe the situation factually, Express your feelings/opinions, Assert by asking clearly, Reinforce by explaining benefits. Stay Mindful of your goals, Appear confident, Negotiate if needed."
            },
            {
              title: "GIVE (Maintaining the Relationship)",
              content: "Be Gentle (no attacks, threats, or judgments), Act Interested (listen, don't interrupt), Validate the other person's feelings/perspective, Use an Easy manner (smile, be light-hearted when appropriate)."
            },
            {
              title: "FAST (Maintaining Self-Respect)",
              content: "Be Fair to yourself and the other person, No Apologies for making requests or having opinions, Stick to your values, Be Truthful (don't lie or exaggerate)."
            },
            {
              title: "Factors Reducing Effectiveness",
              content: "Not having the skills, Worry thoughts interfering, Emotions getting in the way, Not knowing what you want, Environment not supporting effectiveness, Short-term goals interfering with long-term goals."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Interpersonal effectiveness skills accordion" }
        },
        {
          type: "multipleChoice",
          question: "The DEAR MAN skill is primarily focused on:",
          options: [
            { text: "Maintaining relationships during conflict", isCorrect: false },
            { text: "Protecting your self-respect", isCorrect: false },
            { text: "Getting what you want or need from interactions", isCorrect: true },
            { text: "Validating other people's perspectives", isCorrect: false }
          ],
          explanation: "DEAR MAN is the objectives effectiveness skill—it helps you get what you want or need from interpersonal interactions. GIVE focuses on relationship effectiveness, and FAST focuses on self-respect effectiveness.",
          accessibility: { ariaLabel: "Knowledge check about DEAR MAN", announceCorrect: true }
        },
        {
          type: "multiSelect",
          question: "Which of the following are components of the GIVE skill? (Select all that apply)",
          options: [
            { text: "Be Gentle", isCorrect: true },
            { text: "Act Interested", isCorrect: true },
            { text: "Validate", isCorrect: true },
            { text: "Express feelings", isCorrect: false },
            { text: "Easy manner", isCorrect: true },
            { text: "Negotiate", isCorrect: false }
          ],
          explanation: "GIVE (Gentle, Interested, Validate, Easy manner) focuses on maintaining the relationship during interpersonal interactions. Express and Negotiate are part of DEAR MAN, not GIVE.",
          accessibility: { ariaLabel: "Multi-select about GIVE skill", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Think about a recent interpersonal situation where you (or a client) struggled. Which aspect of effectiveness was most challenging: getting objectives met (DEAR MAN), maintaining the relationship (GIVE), or preserving self-respect (FAST)? What skills might have helped?",
          accessibility: { role: "textbox", ariaLabel: "Reflection on interpersonal effectiveness" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each interpersonal effectiveness acronym letter to its meaning.",
          matchingPairs: [
            { term: "D (DEAR MAN)", definition: "Describe the situation factually" },
            { term: "E (DEAR MAN)", definition: "Express your feelings and opinions" },
            { term: "A (DEAR MAN)", definition: "Assert by asking clearly for what you want" },
            { term: "R (DEAR MAN)", definition: "Reinforce by explaining mutual benefits" },
            { term: "G (GIVE)", definition: "Be Gentle—no attacks, threats, or judgments" },
            { term: "F (FAST)", definition: "Be Fair to yourself and the other person" }
          ],
          accessibility: { ariaLabel: "Drag and drop matching for interpersonal skills", role: "application" }
        }
      ]
    },

    // MODULE 7: DBT Program Structure and Implementation
    {
      title: "DBT Program Structure and Implementation",
      order: 7,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 7,
          title: "DBT Program Structure and Implementation",
          subtitle: "Components of Comprehensive DBT and Adaptations",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Comprehensive DBT includes four treatment modes: individual therapy, group skills training, phone coaching, and therapist consultation team. Each mode serves a specific function, and the interplay between modes is what makes DBT uniquely effective for complex, multi-problem clients.</p>
          <p>However, comprehensive DBT requires significant resources. Many clinicians work in settings where full implementation isn't feasible. This section addresses both the ideal structure and practical adaptations for real-world settings.</p>`,
          accessibility: { role: "article", ariaLabel: "Introduction to DBT program structure" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Individual Therapy",
              content: "Weekly sessions focusing on target hierarchy: (1) life-threatening behaviors, (2) therapy-interfering behaviors, (3) quality-of-life interfering behaviors, (4) skill acquisition. Uses diary cards, behavioral chain analysis, and solution analysis."
            },
            {
              title: "Group Skills Training",
              content: "Weekly 2-2.5 hour groups teaching the four skill modules over approximately 24 weeks. Leader teaches skills didactically, then participants practice through exercises and homework. Ideally led by two co-leaders."
            },
            {
              title: "Phone Coaching",
              content: "Brief calls between sessions to help clients apply skills in real-time crisis situations. NOT for processing feelings or doing therapy—for skill coaching only. Calls are short (5-10 minutes typically)."
            },
            {
              title: "Consultation Team",
              content: "Weekly meeting for therapists to support each other, maintain motivation, and ensure treatment fidelity. The consultation team is 'therapy for the therapist'—essential for preventing burnout with difficult clients."
            },
            {
              title: "DBT-Informed vs. Comprehensive DBT",
              content: "Many clinicians use DBT-informed approaches rather than comprehensive programs. This might include using DBT skills in individual therapy, running skills groups without full program, or incorporating DBT strategies selectively. Research increasingly supports these adaptations."
            }
          ],
          accessibility: { role: "region", ariaLabel: "DBT program components accordion" }
        },
        {
          type: "multipleChoice",
          question: "In the DBT target hierarchy for individual therapy, what is the first priority?",
          options: [
            { text: "Behaviors that interfere with quality of life", isCorrect: false },
            { text: "Life-threatening behaviors", isCorrect: true },
            { text: "Therapy-interfering behaviors", isCorrect: false },
            { text: "Skill acquisition and generalization", isCorrect: false }
          ],
          explanation: "The DBT target hierarchy prioritizes: (1) life-threatening behaviors (including suicidal behavior and non-suicidal self-injury), (2) therapy-interfering behaviors, (3) quality-of-life interfering behaviors, and (4) skill acquisition. Life-threatening behaviors always come first.",
          accessibility: { ariaLabel: "Knowledge check about target hierarchy", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "Consider your current practice setting. What barriers exist to implementing comprehensive DBT? What elements of DBT could realistically be incorporated? What adaptations might be necessary?",
          accessibility: { role: "textbox", ariaLabel: "Reflection on DBT implementation" }
        }
      ]
    },

    // MODULE 8: Evidence Base, Limitations, and Cultural Considerations
    {
      title: "Evidence Base, Limitations, and Cultural Considerations",
      order: 8,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 8,
          title: "Evidence Base, Limitations, and Cultural Considerations",
          subtitle: "What the Research Shows and Where We Must Be Careful",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>DBT has one of the strongest evidence bases of any psychotherapy for complex clinical presentations. Multiple randomized controlled trials have demonstrated its efficacy for Borderline Personality Disorder, and growing research supports its use across numerous other conditions. However, responsible clinicians must also understand the limitations, criticisms, and equity concerns surrounding DBT.</p>`,
          accessibility: { role: "article", ariaLabel: "Introduction to evidence and limitations" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: "Evidence for BPD",
              content: "Multiple RCTs demonstrate DBT reduces suicidal behavior, non-suicidal self-injury, treatment dropout, psychiatric hospitalizations, depression, and hopelessness in BPD. Effect sizes are typically medium to large. Benefits are maintained at follow-up."
            },
            {
              title: "Evidence for Other Conditions",
              content: "Growing support for DBT adaptations in: eating disorders, substance use disorders, treatment-resistant depression, PTSD, ADHD, and adolescent populations. The evidence is strongest for conditions involving emotion dysregulation and impulsive behavior."
            },
            {
              title: "Limitations and Criticisms",
              content: "Resource intensity limits access, most research on white women, treatment requires significant patient commitment, not effective for everyone, some components may be more important than others, some skills may conflict with certain cultural values."
            },
            {
              title: "Cultural Considerations",
              content: "DBT was developed with primarily white, Western populations. Concepts like emotional expression, assertiveness, and individual-focused goals may conflict with collectivist or other cultural values. Adaptations needed for diverse populations."
            },
            {
              title: "Equity and Access",
              content: "Comprehensive DBT programs are expensive and often unavailable in underserved communities. Training requirements create barriers. Private practice implementation is challenging. Insurance coverage varies."
            }
          ],
          accessibility: { role: "region", ariaLabel: "Evidence and limitations accordion" }
        },
        {
          type: "multipleChoice",
          question: "Which of the following is a legitimate criticism of DBT research?",
          options: [
            { text: "No randomized controlled trials have been conducted", isCorrect: false },
            { text: "Most research has been conducted with predominantly white, Western populations", isCorrect: true },
            { text: "DBT has not shown effectiveness for any clinical condition", isCorrect: false },
            { text: "The treatment manual is not publicly available", isCorrect: false }
          ],
          explanation: "A valid criticism of DBT research is that most studies have been conducted with predominantly white, Western populations, raising questions about generalizability across cultures and communities. This limitation is being addressed through ongoing research with diverse populations.",
          accessibility: { ariaLabel: "Knowledge check about DBT limitations", announceCorrect: true }
        },
        {
          type: "multiSelect",
          question: "For which conditions does research support the use of DBT or DBT adaptations? (Select all that apply)",
          options: [
            { text: "Borderline Personality Disorder", isCorrect: true },
            { text: "Eating disorders", isCorrect: true },
            { text: "Specific phobias", isCorrect: false },
            { text: "Substance use disorders", isCorrect: true },
            { text: "Treatment-resistant depression", isCorrect: true },
            { text: "Autism spectrum disorder without emotion dysregulation", isCorrect: false }
          ],
          explanation: "DBT has research support for BPD (strongest evidence), eating disorders, substance use disorders, and treatment-resistant depression. The common thread is emotion dysregulation. Conditions without emotion dysregulation components are not primary targets for DBT.",
          accessibility: { ariaLabel: "Multi-select about DBT evidence", announceCorrect: true }
        },
        {
          type: "reflection",
          question: "As you consider implementing DBT-informed strategies in your practice, what cultural considerations are most relevant for your client population? How might you adapt DBT skills or language to be more culturally responsive?",
          accessibility: { role: "textbox", ariaLabel: "Reflection on cultural considerations" }
        },
        {
          type: "matching",
          matchingInstructions: "Match each DBT skill module to its primary clinical focus.",
          matchingPairs: [
            { term: "Mindfulness", definition: "Paying attention to the present moment without judgment" },
            { term: "Distress Tolerance", definition: "Surviving crisis situations without making things worse" },
            { term: "Emotion Regulation", definition: "Reducing the frequency and intensity of unwanted emotions" },
            { term: "Interpersonal Effectiveness", definition: "Getting needs met while maintaining relationships and self-respect" }
          ],
          accessibility: { ariaLabel: "Drag and drop matching for all four DBT modules", role: "application" }
        },
        {
          type: "resources",
          resources: [
            { title: "DBT Skills Training Handouts and Worksheets (Linehan, 2015)", url: "#", type: "reference" },
            { title: "DBT Skills Training Manual, Second Edition (Linehan, 2015)", url: "#", type: "reference" },
            { title: "Cognitive-Behavioral Treatment of Borderline Personality Disorder (Linehan, 1993)", url: "#", type: "reference" },
            { title: "Building a Life Worth Living (Linehan, 2020)", url: "#", type: "reference" },
            { title: "Behavioral Tech - Official DBT Training Resources", url: "https://behavioraltech.org", type: "website" },
            { title: "DBT Chain Analysis Worksheet", url: "#", type: "worksheet" }
          ],
          accessibility: { ariaLabel: "Course resources and references" }
        }
      ]
    }
  ],

  // FINAL ASSESSMENT - 20 QUESTIONS
  assessment: {
    passThreshold: 0.80,
    questions: [
      {
        question: "According to biosocial theory, emotion dysregulation develops from:",
        options: [
          { text: "Genetic factors alone", isCorrect: false },
          { text: "The transaction between biological vulnerability and an invalidating environment", isCorrect: true },
          { text: "Poor parenting choices", isCorrect: false },
          { text: "Traumatic experiences exclusively", isCorrect: false }
        ],
        explanation: "Biosocial theory emphasizes the transaction between biological predisposition and environmental invalidation."
      },
      {
        question: "The primary dialectic in DBT is the tension between:",
        options: [
          { text: "Individual and group therapy", isCorrect: false },
          { text: "Acceptance and change", isCorrect: true },
          { text: "Therapist and client", isCorrect: false },
          { text: "Skills and insight", isCorrect: false }
        ],
        explanation: "The core dialectic in DBT balances accepting clients as they are while pushing for change."
      },
      {
        question: "Which DBT skill module is considered the foundation for all other skills?",
        options: [
          { text: "Distress Tolerance", isCorrect: false },
          { text: "Emotion Regulation", isCorrect: false },
          { text: "Mindfulness", isCorrect: true },
          { text: "Interpersonal Effectiveness", isCorrect: false }
        ],
        explanation: "Mindfulness is the core skill that underlies and enhances all other DBT modules."
      },
      {
        question: "The TIPP skills are used to:",
        options: [
          { text: "Improve interpersonal communication", isCorrect: false },
          { text: "Rapidly change body chemistry to reduce emotional intensity", isCorrect: true },
          { text: "Analyze the causes of emotional distress", isCorrect: false },
          { text: "Build long-term emotional resilience", isCorrect: false }
        ],
        explanation: "TIPP (Temperature, Intense exercise, Paced breathing, Progressive relaxation) quickly changes body chemistry in crisis."
      },
      {
        question: "Radical acceptance means:",
        options: [
          { text: "Approving of painful situations", isCorrect: false },
          { text: "Giving up and resigning yourself to suffering", isCorrect: false },
          { text: "Fully acknowledging reality as it is without fighting it", isCorrect: true },
          { text: "Accepting that you cannot change", isCorrect: false }
        ],
        explanation: "Radical acceptance is acknowledging what IS true so you can respond effectively—not approval or resignation."
      },
      {
        question: "The DBT 'What' skills include:",
        options: [
          { text: "Non-judgmentally, One-mindfully, Effectively", isCorrect: false },
          { text: "Observe, Describe, Participate", isCorrect: true },
          { text: "DEAR MAN, GIVE, FAST", isCorrect: false },
          { text: "TIPP, ACCEPTS, IMPROVE", isCorrect: false }
        ],
        explanation: "The 'What' skills (Observe, Describe, Participate) tell us what to do; the 'How' skills tell us how to do it."
      },
      {
        question: "Opposite Action is appropriate when:",
        options: [
          { text: "The emotion fits the facts and action would be effective", isCorrect: false },
          { text: "The emotion doesn't fit the facts or action would be ineffective", isCorrect: true },
          { text: "You want to suppress the emotion", isCorrect: false },
          { text: "The situation requires immediate crisis intervention", isCorrect: false }
        ],
        explanation: "Opposite Action is used when emotions don't fit facts or when acting on them would make things worse."
      },
      {
        question: "DEAR MAN is used for:",
        options: [
          { text: "Maintaining relationships", isCorrect: false },
          { text: "Preserving self-respect", isCorrect: false },
          { text: "Getting your objectives met in interactions", isCorrect: true },
          { text: "Tolerating distress", isCorrect: false }
        ],
        explanation: "DEAR MAN is the objectives effectiveness skill for getting what you want or need."
      },
      {
        question: "In the DBT target hierarchy, what is the second priority after life-threatening behaviors?",
        options: [
          { text: "Quality-of-life interfering behaviors", isCorrect: false },
          { text: "Skill acquisition", isCorrect: false },
          { text: "Therapy-interfering behaviors", isCorrect: true },
          { text: "Interpersonal difficulties", isCorrect: false }
        ],
        explanation: "The hierarchy is: (1) life-threatening, (2) therapy-interfering, (3) quality-of-life, (4) skill acquisition."
      },
      {
        question: "Phone coaching in DBT is primarily used for:",
        options: [
          { text: "Processing emotions between sessions", isCorrect: false },
          { text: "Extending individual therapy time", isCorrect: false },
          { text: "Brief skill coaching in real-time situations", isCorrect: true },
          { text: "Crisis hospitalization decisions", isCorrect: false }
        ],
        explanation: "Phone coaching provides brief, focused skill coaching to help clients apply DBT skills in real-time."
      },
      {
        question: "The consultation team in DBT serves to:",
        options: [
          { text: "Supervise new therapists", isCorrect: false },
          { text: "Review client cases for diagnosis", isCorrect: false },
          { text: "Support therapists and maintain treatment fidelity", isCorrect: true },
          { text: "Provide group therapy to clients", isCorrect: false }
        ],
        explanation: "The consultation team is 'therapy for the therapist'—supporting clinicians working with challenging clients."
      },
      {
        question: "Which is NOT a component of comprehensive DBT?",
        options: [
          { text: "Individual therapy", isCorrect: false },
          { text: "Psychopharmacological management", isCorrect: true },
          { text: "Group skills training", isCorrect: false },
          { text: "Phone coaching", isCorrect: false }
        ],
        explanation: "Comprehensive DBT has four components: individual therapy, group skills, phone coaching, and consultation team. Medication management is not a DBT component (though may be used adjunctively)."
      },
      {
        question: "The emotion regulation skill 'Check the Facts' involves:",
        options: [
          { text: "Researching the history of your emotional patterns", isCorrect: false },
          { text: "Evaluating whether your emotional response fits the actual situation", isCorrect: true },
          { text: "Documenting emotions in a diary card", isCorrect: false },
          { text: "Checking with others to validate your emotional experience", isCorrect: false }
        ],
        explanation: "Check the Facts helps determine if emotional intensity matches the reality of the situation."
      },
      {
        question: "ABC PLEASE skills are designed to:",
        options: [
          { text: "Survive crisis situations", isCorrect: false },
          { text: "Reduce vulnerability to negative emotions", isCorrect: true },
          { text: "Improve communication effectiveness", isCorrect: false },
          { text: "Increase mindfulness capacity", isCorrect: false }
        ],
        explanation: "ABC PLEASE reduces emotional vulnerability through positive experiences, mastery, coping ahead, and physical self-care."
      },
      {
        question: "GIVE skills focus on:",
        options: [
          { text: "Getting your needs met", isCorrect: false },
          { text: "Maintaining self-respect", isCorrect: false },
          { text: "Maintaining the relationship", isCorrect: true },
          { text: "Managing crisis situations", isCorrect: false }
        ],
        explanation: "GIVE (Gentle, Interested, Validate, Easy manner) focuses on relationship effectiveness."
      },
      {
        question: "Research on DBT has been criticized for:",
        options: [
          { text: "Lack of randomized controlled trials", isCorrect: false },
          { text: "Studies conducted primarily with white, Western populations", isCorrect: true },
          { text: "No demonstrated effectiveness for any condition", isCorrect: false },
          { text: "Absence of treatment manuals", isCorrect: false }
        ],
        explanation: "A valid criticism is the limited diversity in research populations, raising generalizability questions."
      },
      {
        question: "An invalidating environment is characterized by:",
        options: [
          { text: "Consistent validation of emotional experiences", isCorrect: false },
          { text: "Chronic dismissal or punishment of emotional expression", isCorrect: true },
          { text: "Overprotection from all negative experiences", isCorrect: false },
          { text: "Excessive focus on achievement", isCorrect: false }
        ],
        explanation: "Invalidating environments dismiss, trivialize, or punish emotional experiences, contributing to dysregulation."
      },
      {
        question: "The mindfulness skill 'One-mindfully' means:",
        options: [
          { text: "Meditating once daily", isCorrect: false },
          { text: "Doing one thing at a time with full attention", isCorrect: true },
          { text: "Having one single goal in therapy", isCorrect: false },
          { text: "Using one skill at a time", isCorrect: false }
        ],
        explanation: "One-mindfully means doing one thing at a time with complete attention—the opposite of multitasking."
      },
      {
        question: "FAST skills help maintain:",
        options: [
          { text: "Relationships", isCorrect: false },
          { text: "Objectives", isCorrect: false },
          { text: "Self-respect", isCorrect: true },
          { text: "Emotional stability", isCorrect: false }
        ],
        explanation: "FAST (Fair, no Apologies, Stick to values, Truthful) focuses on self-respect effectiveness."
      },
      {
        question: "DBT-informed treatment differs from comprehensive DBT in that:",
        options: [
          { text: "It uses completely different skills", isCorrect: false },
          { text: "It may not include all four treatment modes", isCorrect: true },
          { text: "It has no research support", isCorrect: false },
          { text: "It can only be used with BPD", isCorrect: false }
        ],
        explanation: "DBT-informed treatment uses DBT strategies selectively without requiring all four comprehensive components."
      }
    ]
  }
};

// ============================================================
// DATABASE SEEDING
// ============================================================

async function seedDBTCourse() {
  console.log('\n🧠 Seeding DBT Skills Training Course...\n');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Course = mongoose.connection.models.Course || 
      mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

    // Check for existing
    const existing = await Course.findOne({
      $or: [
        { slug: DBT_COURSE.slug },
        { title: { $regex: /dialectical behavior therapy/i } }
      ]
    });

    if (existing) {
      await Course.updateOne({ _id: existing._id }, { $set: DBT_COURSE });
      console.log('✏️  Updated existing DBT course');
    } else {
      await Course.create(DBT_COURSE);
      console.log('✅ Created new DBT course');
    }

    // Count content blocks
    let totalBlocks = 0;
    let totalQuestions = 0;
    DBT_COURSE.modules.forEach(m => {
      totalBlocks += m.contentBlocks.length;
      m.contentBlocks.forEach(b => {
        if (b.type === 'multipleChoice' || b.type === 'multiSelect') totalQuestions++;
      });
    });

    console.log(`\n📊 Course Statistics:`);
    console.log(`   Title: ${DBT_COURSE.title}`);
    console.log(`   CE Hours: ${DBT_COURSE.ceHours}`);
    console.log(`   Modules: ${DBT_COURSE.modules.length}`);
    console.log(`   Content Blocks: ${totalBlocks}`);
    console.log(`   Knowledge Check Questions: ${totalQuestions}`);
    console.log(`   Final Assessment Questions: ${DBT_COURSE.assessment.questions.length}`);
    console.log(`   Accessibility: WCAG ${DBT_COURSE.accessibility.wcagLevel} compliant`);

    console.log('\n✅ DBT Course seeded successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDBTCourse();
