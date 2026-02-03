#!/usr/bin/env node
/**
 * seedMovieCourses.js - FULL VERSION
 * 
 * Self-contained seeder for 4 movie-themed courses (12 CE total)
 * All content embedded - no external files needed
 * 
 * Run: node src/scripts/seedMovieCourses.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ═══════════════════════════════════════════════════════════════════
// COURSE 1: ELEPHANT IN THE ROOM
// ═══════════════════════════════════════════════════════════════════

const ELEPHANT_COURSE = {
  title: 'The Elephant in the Room: Mastering Difficult Conversations in Therapy',
  slug: 'elephant-in-the-room-difficult-conversations',
  ceHours: 3,
  credits: 3,
  category: 'Clinical Practice',
  contentArea: 'Clinical Skills',
  level: 'Intermediate',
  description: 'Every therapy room has elephants—the topics that everyone sees but nobody wants to address. Whether it\'s confronting a client about treatment-interfering behavior, discussing deteriorating progress, addressing cultural differences, delivering difficult news, or navigating ruptures in the therapeutic alliance, these conversations separate adequate clinicians from exceptional ones. This comprehensive 3-hour course equips counselors with frameworks, language, and courage to address the elephants in the room. Through case examples, clinical vignettes, and practical strategies, participants will develop competence in initiating and navigating the conversations that matter most.',
  targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
  objectives: [
    'Identify common "elephants" in therapy across five categories and recognize personal patterns of avoidance',
    'Apply the COMPASS framework for preparing, initiating, and navigating difficult conversations',
    'Utilize specific language patterns that promote openness while minimizing defensiveness',
    'Address treatment-interfering behaviors directly using curious compassion',
    'Navigate conversations about lack of progress, treatment failure, and termination',
    'Discuss cultural differences with authenticity and cultural humility',
    'Repair therapeutic alliance ruptures using evidence-based strategies',
    'Manage personal anxiety and countertransference when approaching difficult topics'
  ],
  modules: [
    {
      title: 'Understanding Avoidance',
      order: 1,
      lessons: [
        {
          title: 'Why We Avoid Difficult Conversations',
          order: 1,
          type: 'text',
          content: '<h3>The Avoidance Instinct</h3><p>Difficult conversations trigger our own discomfort. We worry about damaging the relationship, being seen as critical, or making things worse. We rationalize: "Maybe it will resolve on its own." "The client isn\'t ready." "It\'s not that important."</p><h3>Common Avoidance Patterns</h3><p><strong>The Hint-and-Hope:</strong> Dropping subtle suggestions instead of direct communication.</p><p><strong>The Postponement:</strong> Waiting for the "right moment" that never comes.</p><p><strong>The Redirect:</strong> Steering away from uncomfortable territory when it arises.</p><p><strong>The Normalization:</strong> Telling yourself the issue isn\'t significant enough to address.</p><h3>The Five Categories of Elephants</h3><p>1. <strong>Treatment-Interfering Behaviors:</strong> Lateness, no-shows, non-compliance, dishonesty</p><p>2. <strong>Progress and Outcomes:</strong> Lack of improvement, treatment failure, termination</p><p>3. <strong>The Therapeutic Relationship:</strong> Ruptures, transference, therapist errors</p><p>4. <strong>Cultural and Identity Issues:</strong> Race, gender, sexuality, religion, class</p><p>5. <strong>Sensitive Content:</strong> Suicide, abuse, sexuality, substance use</p>'
        },
        {
          title: 'The Cost of Avoidance',
          order: 2,
          type: 'text',
          content: '<h3>Client Costs</h3><p>When we avoid difficult conversations, clients lose opportunities for growth. They don\'t receive honest feedback. Problems that could be addressed early become entrenched. The therapy models avoidance rather than healthy confrontation.</p><h3>Therapist Costs</h3><p>Avoidance creates cumulative stress. Unaddressed issues fester. Resentment builds. Burnout accelerates. We lose confidence in our ability to handle challenging situations.</p><h3>Relationship Costs</h3><p>Paradoxically, avoiding difficult conversations to "protect" the relationship often damages it. Clients sense inauthenticity. Important issues remain underground. The relationship becomes superficial.</p><h3>Research on Avoidance</h3><p>Studies consistently show that addressing difficult issues directly, when done skillfully, strengthens rather than weakens therapeutic alliance. Clients report greater trust in therapists who are willing to have hard conversations.</p>'
        }
      ],
      quiz: {
        title: 'Module 1 Knowledge Check',
        questions: [
          { question: 'Which avoidance pattern involves dropping subtle suggestions instead of direct communication?', options: [{ text: 'The Postponement', isCorrect: false }, { text: 'The Hint-and-Hope', isCorrect: true }, { text: 'The Redirect', isCorrect: false }, { text: 'The Normalization', isCorrect: false }], explanation: 'The Hint-and-Hope involves indirect communication hoping the client gets the message.' },
          { question: 'What is a common cost of avoiding difficult conversations for therapists?', options: [{ text: 'Improved client outcomes', isCorrect: false }, { text: 'Stronger therapeutic alliance', isCorrect: false }, { text: 'Cumulative stress and burnout', isCorrect: true }, { text: 'Increased confidence', isCorrect: false }], explanation: 'Avoidance creates stress as unaddressed issues fester.' },
          { question: 'Which category includes chronic lateness and no-shows?', options: [{ text: 'Progress and Outcomes', isCorrect: false }, { text: 'Treatment-Interfering Behaviors', isCorrect: true }, { text: 'Cultural Issues', isCorrect: false }, { text: 'Sensitive Content', isCorrect: false }], explanation: 'Lateness and no-shows are therapy-interfering behaviors.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'The COMPASS Framework',
      order: 2,
      lessons: [
        {
          title: 'Introducing COMPASS',
          order: 1,
          type: 'text',
          content: '<h3>The COMPASS Framework</h3><p>COMPASS provides a structured approach for difficult conversations:</p><p><strong>C - Center Yourself:</strong> Before the conversation, regulate your own nervous system. Notice anxiety, breathe, ground yourself.</p><p><strong>O - Observe Specifically:</strong> Identify concrete, behavioral observations rather than interpretations or judgments.</p><p><strong>M - Motivation Check:</strong> Clarify your intention. Is this conversation in service of the client? Are you addressing something that matters for treatment?</p><p><strong>P - Permission and Framing:</strong> Set up the conversation with transparency. Ask permission when appropriate.</p><p><strong>A - Address Directly:</strong> State the issue clearly, without excessive softening that obscures the message.</p><p><strong>S - Space for Response:</strong> After stating the issue, stop talking. Allow the client to respond.</p><p><strong>S - Stay Engaged:</strong> Remain present regardless of the response. Don\'t retreat, defend, or attack.</p>'
        },
        {
          title: 'Applying COMPASS',
          order: 2,
          type: 'text',
          content: '<h3>COMPASS in Practice</h3><p><strong>Example: Addressing Chronic Lateness</strong></p><p><em>Center:</em> Before Marcus arrives, you take three deep breaths and remind yourself this conversation is an act of care.</p><p><em>Observe:</em> "In our last six sessions, you\'ve arrived 10-15 minutes late."</p><p><em>Motivation:</em> You want to understand the pattern and ensure he gets full benefit from sessions.</p><p><em>Permission:</em> "I\'d like to talk about something I\'ve noticed. Is now a good time?"</p><p><em>Address:</em> "I\'ve noticed you\'ve been arriving late consistently. I want to understand what\'s happening and whether there\'s something we need to address."</p><p><em>Space:</em> Stop. Wait. Let Marcus respond.</p><p><em>Stay:</em> Whatever he says, remain curious and engaged.</p><h3>Language Patterns</h3><p>"I\'ve noticed..." (observation without judgment)</p><p>"I\'m curious about..." (invites exploration)</p><p>"Help me understand..." (collaborative stance)</p><p>"I want to name something..." (direct but not attacking)</p>'
        }
      ],
      quiz: {
        title: 'Module 2 Knowledge Check',
        questions: [
          { question: 'What does the "C" in COMPASS stand for?', options: [{ text: 'Confront', isCorrect: false }, { text: 'Center Yourself', isCorrect: true }, { text: 'Collaborate', isCorrect: false }, { text: 'Communicate', isCorrect: false }], explanation: 'Center Yourself - regulate your nervous system before the conversation.' },
          { question: 'Why is "Space for Response" important in COMPASS?', options: [{ text: 'To fill awkward silence', isCorrect: false }, { text: 'To allow the client to process and respond', isCorrect: true }, { text: 'To end the conversation quickly', isCorrect: false }, { text: 'To show dominance', isCorrect: false }], explanation: 'Giving space allows clients to process and respond authentically.' },
          { question: 'Which language pattern is recommended for difficult conversations?', options: [{ text: '"You always..."', isCorrect: false }, { text: '"I\'ve noticed..."', isCorrect: true }, { text: '"You should..."', isCorrect: false }, { text: '"Everyone thinks..."', isCorrect: false }], explanation: '"I\'ve noticed..." offers observation without judgment.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Addressing Treatment-Interfering Behaviors',
      order: 3,
      lessons: [
        {
          title: 'Identifying Treatment-Interfering Behaviors',
          order: 1,
          type: 'text',
          content: '<h3>What Are Treatment-Interfering Behaviors?</h3><p>Treatment-interfering behaviors (TIBs) are client behaviors that prevent effective therapy. They include:</p><p><strong>Attendance Issues:</strong> Chronic lateness, frequent cancellations, no-shows</p><p><strong>Session Behaviors:</strong> Dissociation, topic avoidance, excessive intellectualization</p><p><strong>Between-Session Issues:</strong> Not completing homework, substance use that undermines progress</p><p><strong>Relationship Behaviors:</strong> Hostility, boundary violations, excessive dependency</p><h3>The DBT Approach</h3><p>In DBT, TIBs are prioritized right after life-threatening behaviors. The logic: if therapy isn\'t happening effectively, nothing else can happen. Addressing TIBs is essential, not optional.</p>'
        },
        {
          title: 'Having the Conversation',
          order: 2,
          type: 'text',
          content: '<h3>Curious Compassion</h3><p>The stance for addressing TIBs is curious compassion—genuine interest in understanding the behavior without judgment, combined with clear communication that the behavior is affecting treatment.</p><h3>Sample Language</h3><p>"I\'ve noticed you\'ve canceled three of our last five sessions. I\'m not bringing this up to criticize—I\'m bringing it up because I\'m concerned. What\'s happening?"</p><p>"When you check your phone during session, I notice I feel disconnected from you. I\'m curious what\'s going on in those moments."</p><p>"I want to name something I\'ve observed: when we get close to talking about your father, you often change the subject. I\'m not saying that\'s wrong—I\'m curious if you\'ve noticed that too."</p><h3>Behavioral Chain Analysis</h3><p>When a TIB occurs, trace the chain: What happened before? What were you thinking and feeling? What was the consequence? This collaborative analysis often reveals important clinical material.</p>'
        }
      ],
      quiz: {
        title: 'Module 3 Knowledge Check',
        questions: [
          { question: 'In DBT, where do treatment-interfering behaviors fall in the treatment hierarchy?', options: [{ text: 'Lowest priority', isCorrect: false }, { text: 'Right after life-threatening behaviors', isCorrect: true }, { text: 'Only addressed if time permits', isCorrect: false }, { text: 'Not addressed at all', isCorrect: false }], explanation: 'DBT prioritizes TIBs second only to life-threatening behaviors.' },
          { question: 'What is the recommended stance for addressing TIBs?', options: [{ text: 'Confrontational and direct', isCorrect: false }, { text: 'Avoidant and gentle', isCorrect: false }, { text: 'Curious compassion', isCorrect: true }, { text: 'Clinical detachment', isCorrect: false }], explanation: 'Curious compassion combines genuine interest with clear communication.' },
          { question: 'What is a behavioral chain analysis?', options: [{ text: 'A punishment technique', isCorrect: false }, { text: 'Analysis of events before, during, and after a behavior', isCorrect: true }, { text: 'A termination procedure', isCorrect: false }, { text: 'A billing method', isCorrect: false }], explanation: 'Chain analysis traces the sequence of events around a behavior.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Conversations About Progress and Termination',
      order: 4,
      lessons: [
        {
          title: 'Discussing Lack of Progress',
          order: 1,
          type: 'text',
          content: '<h3>Recognizing Stalled Treatment</h3><p><strong>Objective indicators:</strong> Symptom measures plateau or worsen. Goals remain unmet session after session.</p><p><strong>Process indicators:</strong> Sessions feel repetitive. You dread appointments. There\'s a sense of spinning wheels.</p><p><strong>Relationship indicators:</strong> Connection feels superficial. Important topics seem off-limits.</p><h3>Opening the Discussion</h3><p>"I want to step back and look at how our work is going. I\'ve noticed that despite our efforts, we haven\'t seen the changes we were hoping for. I want to talk about that openly so we can figure out what might help."</p><h3>Collaborative Exploration</h3><p>Frame it as a joint puzzle: "What do you think might be getting in the way?" "Is there something we\'re missing?" "Are the goals we set still the right ones?"</p>'
        },
        {
          title: 'Navigating Termination',
          order: 2,
          type: 'text',
          content: '<h3>Types of Termination Conversations</h3><p><strong>Successful completion:</strong> Goals met, celebrating progress</p><p><strong>Plateau:</strong> Progress stalled, considering options</p><p><strong>Poor fit:</strong> Acknowledging the relationship isn\'t working</p><p><strong>Therapist-initiated:</strong> Leaving practice, ethical concerns</p><h3>Referral Conversations</h3><p>When referring out: "I want to be honest with you. I think you might benefit from working with someone who specializes in [area]. This isn\'t about giving up—it\'s about getting you the best help possible."</p><h3>Endings as Clinical Material</h3><p>How a client handles termination often mirrors how they handle endings generally. The termination conversation itself can be therapeutic.</p>'
        }
      ],
      quiz: {
        title: 'Module 4 Knowledge Check',
        questions: [
          { question: 'Which is an objective indicator of stalled treatment?', options: [{ text: 'Therapist dreads sessions', isCorrect: false }, { text: 'Symptom measures plateau or worsen', isCorrect: true }, { text: 'Sessions feel repetitive', isCorrect: false }, { text: 'Connection feels superficial', isCorrect: false }], explanation: 'Objective indicators are measurable outcomes like symptom scores.' },
          { question: 'How should lack of progress be framed?', options: [{ text: 'As client failure', isCorrect: false }, { text: 'As therapist failure', isCorrect: false }, { text: 'As a joint puzzle to solve together', isCorrect: true }, { text: 'As reason to terminate immediately', isCorrect: false }], explanation: 'Collaborative framing reduces defensiveness.' },
          { question: 'When referring a client to another provider, you should:', options: [{ text: 'Avoid discussing reasons', isCorrect: false }, { text: 'Be honest about why the referral might help', isCorrect: true }, { text: 'Present it as punishment', isCorrect: false }, { text: 'Never refer clients', isCorrect: false }], explanation: 'Honest, caring communication about referrals serves clients best.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Navigating Culture, Identity, and Power',
      order: 5,
      lessons: [
        {
          title: 'Naming Cultural Differences',
          order: 1,
          type: 'text',
          content: '<h3>The Elephant of Difference</h3><p>When therapist and client differ in race, ethnicity, religion, sexual orientation, gender identity, or other significant identities, the difference is often visible but unspoken. This silence can impede treatment.</p><h3>Why We Avoid</h3><p>Therapists fear saying the wrong thing, revealing bias, or making the client uncomfortable. But silence often communicates its own message: "I don\'t see you" or "This topic is off-limits."</p><h3>Naming the Difference</h3><p>"I\'m aware that I\'m a [identity] therapist working with you as a [identity] client. I want to acknowledge that openly and invite you to tell me if anything I say or do doesn\'t fit with your experience."</p><p>"I don\'t want to make assumptions based on your [identity]. Please help me understand your unique perspective."</p>'
        },
        {
          title: 'Cultural Humility in Action',
          order: 2,
          type: 'text',
          content: '<h3>Three Pillars of Cultural Humility</h3><p><strong>Lifelong learning:</strong> Recognition that cultural competence is never "achieved"—it\'s an ongoing process.</p><p><strong>Self-reflection:</strong> Examining your own cultural identity, biases, and assumptions.</p><p><strong>Power dynamics:</strong> Acknowledging the power differential inherent in therapy and how cultural differences may amplify it.</p><h3>When You Make a Mistake</h3><p>Cultural missteps happen. When they do:</p><p>1. Notice it (even if the client doesn\'t call it out)</p><p>2. Name it: "I think what I just said may not have landed well..."</p><p>3. Apologize genuinely: "I\'m sorry. That wasn\'t what I meant to communicate."</p><p>4. Learn: "Can you help me understand how that affected you?"</p><p>5. Don\'t over-apologize or make it about you.</p>'
        }
      ],
      quiz: {
        title: 'Module 5 Knowledge Check',
        questions: [
          { question: 'When cultural differences exist between therapist and client, silence often communicates:', options: [{ text: 'Respect', isCorrect: false }, { text: '"I don\'t see you" or "This is off-limits"', isCorrect: true }, { text: 'Cultural competence', isCorrect: false }, { text: 'Nothing at all', isCorrect: false }], explanation: 'Silence about differences can communicate invisibility or avoidance.' },
          { question: 'Cultural humility includes:', options: [{ text: 'Achieving complete cultural competence', isCorrect: false }, { text: 'Lifelong learning and self-reflection', isCorrect: true }, { text: 'Ignoring cultural differences', isCorrect: false }, { text: 'Treating everyone identically', isCorrect: false }], explanation: 'Cultural humility involves ongoing learning and reflection.' },
          { question: 'When you make a cultural misstep, you should:', options: [{ text: 'Ignore it and move on', isCorrect: false }, { text: 'Over-apologize extensively', isCorrect: false }, { text: 'Notice, name, apologize genuinely, and learn', isCorrect: true }, { text: 'Terminate therapy', isCorrect: false }], explanation: 'Acknowledge the error, apologize genuinely, and use it as learning.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Repairing Ruptures',
      order: 6,
      lessons: [
        {
          title: 'Understanding Alliance Ruptures',
          order: 1,
          type: 'text',
          content: '<h3>What Is a Rupture?</h3><p>A rupture is a breakdown in the therapeutic alliance—a deterioration of the collaborative relationship. Ruptures are inevitable in therapy and, when repaired, often strengthen the alliance.</p><h3>Two Types of Ruptures (Safran & Muran)</h3><p><strong>Withdrawal ruptures:</strong> Client becomes distant, disengaged, compliant but not connected. They may agree with everything, give short answers, or seem to "go through the motions."</p><p><strong>Confrontation ruptures:</strong> Client expresses dissatisfaction directly—criticism of the therapist, anger, complaints about treatment.</p><h3>Signs of Rupture</h3><p>Changes in engagement, increased resistance, superficiality, missed sessions, hostile undercurrents, topic avoidance, or the client seems to be "performing" rather than authentic.</p>'
        },
        {
          title: 'The Repair Process',
          order: 2,
          type: 'text',
          content: '<h3>Repairing Withdrawal Ruptures</h3><p>The challenge: client won\'t tell you directly something is wrong.</p><p>"I notice you seem a bit quieter today. I\'m wondering if something has shifted between us."</p><p>"I have a sense that something may be off in our connection. Am I reading that right?"</p><h3>Repairing Confrontation Ruptures</h3><p>The challenge: staying non-defensive when being criticized.</p><p>1. Validate the client\'s experience (not necessarily their interpretation)</p><p>2. Explore without defending: "Tell me more about what happened from your perspective"</p><p>3. Take responsibility for your part</p><p>4. Collaborate on moving forward</p><h3>Rupture Repair as Therapeutic</h3><p>Successfully navigating ruptures teaches clients that relationships can survive conflict, that their feelings matter, and that repair is possible. For many clients, this is a corrective emotional experience.</p>'
        }
      ],
      quiz: {
        title: 'Module 6 Knowledge Check',
        questions: [
          { question: 'A withdrawal rupture is characterized by:', options: [{ text: 'Direct criticism of the therapist', isCorrect: false }, { text: 'Client becoming distant and disengaged', isCorrect: true }, { text: 'Aggressive confrontation', isCorrect: false }, { text: 'Immediate termination', isCorrect: false }], explanation: 'Withdrawal ruptures involve the client becoming distant rather than directly confrontational.' },
          { question: 'When facing a confrontation rupture, the therapist should first:', options: [{ text: 'Defend their approach', isCorrect: false }, { text: 'Validate the client\'s experience', isCorrect: true }, { text: 'Terminate treatment', isCorrect: false }, { text: 'Ignore the criticism', isCorrect: false }], explanation: 'Validation comes first, even before exploring or explaining.' },
          { question: 'Successful rupture repair can be therapeutic because it:', options: [{ text: 'Proves the therapist is always right', isCorrect: false }, { text: 'Teaches that relationships can survive conflict', isCorrect: true }, { text: 'Demonstrates client weakness', isCorrect: false }, { text: 'Ends the therapy relationship', isCorrect: false }], explanation: 'Repair teaches that conflict doesn\'t destroy relationships.' }
        ],
        passingScore: 0.80
      }
    }
  ],
  assessment: {
    passThreshold: 0.80,
    questions: [
      { question: 'Which avoidance pattern involves steering away from uncomfortable topics when they arise?', options: [{ text: 'The Hint-and-Hope', isCorrect: false }, { text: 'The Postponement', isCorrect: false }, { text: 'The Redirect', isCorrect: true }, { text: 'The Normalization', isCorrect: false }], explanation: 'The Redirect involves smoothly transitioning away from discomfort.' },
      { question: 'In the COMPASS framework, what does the first "S" stand for?', options: [{ text: 'Stay Engaged', isCorrect: false }, { text: 'Space for Response', isCorrect: true }, { text: 'Stop Talking', isCorrect: false }, { text: 'Summarize', isCorrect: false }], explanation: 'Space for Response - allowing the client time to process and respond.' },
      { question: 'According to DBT, treatment-interfering behaviors should be addressed:', options: [{ text: 'Only if they persist for months', isCorrect: false }, { text: 'Right after life-threatening behaviors in priority', isCorrect: true }, { text: 'After all other issues are resolved', isCorrect: false }, { text: 'Never directly', isCorrect: false }], explanation: 'DBT hierarchy places TIBs second only to life-threatening behaviors.' },
      { question: 'What is the recommended approach when discussing lack of progress?', options: [{ text: 'Blame the client for not trying', isCorrect: false }, { text: 'Avoid the topic to protect the alliance', isCorrect: false }, { text: 'Frame it as a joint puzzle to solve collaboratively', isCorrect: true }, { text: 'Immediately terminate treatment', isCorrect: false }], explanation: 'Collaborative exploration reduces defensiveness and promotes problem-solving.' },
      { question: 'Cultural humility involves:', options: [{ text: 'Achieving complete cultural competence', isCorrect: false }, { text: 'Lifelong learning, self-reflection, and attention to power dynamics', isCorrect: true }, { text: 'Treating all clients identically', isCorrect: false }, { text: 'Avoiding discussion of cultural differences', isCorrect: false }], explanation: 'Cultural humility is ongoing, not a destination to reach.' },
      { question: 'A withdrawal rupture is characterized by:', options: [{ text: 'Direct criticism of the therapist', isCorrect: false }, { text: 'Client becoming distant or disengaged', isCorrect: true }, { text: 'Aggressive behavior', isCorrect: false }, { text: 'Requests for more sessions', isCorrect: false }], explanation: 'Withdrawal ruptures involve emotional distancing, not direct confrontation.' },
      { question: 'When a cultural misstep occurs, the therapist should:', options: [{ text: 'Ignore it and move on', isCorrect: false }, { text: 'Make extensive apologies that center the therapist\'s feelings', isCorrect: false }, { text: 'Notice, name, apologize genuinely, and learn from it', isCorrect: true }, { text: 'Terminate the therapy', isCorrect: false }], explanation: 'Acknowledge the error, apologize authentically, and use it as a learning opportunity.' },
      { question: 'The cost of avoiding difficult conversations includes:', options: [{ text: 'Stronger therapeutic alliance', isCorrect: false }, { text: 'Better client outcomes', isCorrect: false }, { text: 'Cumulative therapist stress and superficial relationships', isCorrect: true }, { text: 'Increased confidence in handling challenges', isCorrect: false }], explanation: 'Avoidance creates stress and prevents authentic connection.' },
      { question: 'When using COMPASS, "O" stands for:', options: [{ text: 'Open ended questions', isCorrect: false }, { text: 'Observe Specifically', isCorrect: true }, { text: 'Offer solutions', isCorrect: false }, { text: 'Overcome resistance', isCorrect: false }], explanation: 'Observe Specifically - use concrete observations rather than interpretations.' },
      { question: 'In a confrontation rupture, the client:', options: [{ text: 'Becomes withdrawn and silent', isCorrect: false }, { text: 'Expresses dissatisfaction directly', isCorrect: true }, { text: 'Terminates without explanation', isCorrect: false }, { text: 'Increases compliance', isCorrect: false }], explanation: 'Confrontation ruptures involve direct expression of dissatisfaction.' },
      { question: 'Which is an example of a treatment-interfering behavior?', options: [{ text: 'Making progress on goals', isCorrect: false }, { text: 'Chronic lateness to sessions', isCorrect: true }, { text: 'Completing homework', isCorrect: false }, { text: 'Open emotional expression', isCorrect: false }], explanation: 'Chronic lateness prevents full use of session time.' },
      { question: 'The phrase "I\'ve noticed..." is recommended because it:', options: [{ text: 'Sounds more authoritative', isCorrect: false }, { text: 'Offers observation without judgment', isCorrect: true }, { text: 'Avoids addressing the issue', isCorrect: false }, { text: 'Places blame on the client', isCorrect: false }], explanation: '"I\'ve noticed" shares observations without interpretation or blame.' },
      { question: 'When a client doesn\'t improve after months of treatment, the therapist should:', options: [{ text: 'Continue the same approach indefinitely', isCorrect: false }, { text: 'Address it directly and explore collaboratively', isCorrect: true }, { text: 'Blame the client for resistance', isCorrect: false }, { text: 'Pretend improvement is happening', isCorrect: false }], explanation: 'Honest discussion of lack of progress is essential.' },
      { question: 'Rupture repair often strengthens the alliance because:', options: [{ text: 'It proves the therapist is infallible', isCorrect: false }, { text: 'It demonstrates that relationships can survive conflict', isCorrect: true }, { text: 'It establishes therapist dominance', isCorrect: false }, { text: 'It eliminates future ruptures', isCorrect: false }], explanation: 'Successful repair teaches that conflict doesn\'t destroy relationships.' },
      { question: 'The recommended stance for addressing treatment-interfering behaviors is:', options: [{ text: 'Critical confrontation', isCorrect: false }, { text: 'Curious compassion', isCorrect: true }, { text: 'Complete avoidance', isCorrect: false }, { text: 'Punitive response', isCorrect: false }], explanation: 'Curious compassion combines interest with clear communication.' },
      { question: 'When ending therapy due to poor fit, the therapist should:', options: [{ text: 'Blame the client', isCorrect: false }, { text: 'Disappear without explanation', isCorrect: false }, { text: 'Be honest while maintaining care and offering referrals', isCorrect: true }, { text: 'Pretend treatment was successful', isCorrect: false }], explanation: 'Honest, caring termination with appropriate referrals serves clients best.' },
      { question: 'Naming cultural differences directly in therapy:', options: [{ text: 'Should always be avoided', isCorrect: false }, { text: 'Can help create safety and authenticity', isCorrect: true }, { text: 'Is inappropriate in all cases', isCorrect: false }, { text: 'Damages the alliance', isCorrect: false }], explanation: 'Addressing cultural differences openly often enhances the relationship.' },
      { question: 'Before a difficult conversation, "Center Yourself" involves:', options: [{ text: 'Preparing a lecture for the client', isCorrect: false }, { text: 'Regulating your own nervous system', isCorrect: true }, { text: 'Avoiding all emotion', isCorrect: false }, { text: 'Rehearsing criticism', isCorrect: false }], explanation: 'Centering means grounding yourself emotionally before the conversation.' },
      { question: 'Behavioral chain analysis helps by:', options: [{ text: 'Assigning blame', isCorrect: false }, { text: 'Tracing events before, during, and after a behavior', isCorrect: true }, { text: 'Punishing unwanted behavior', isCorrect: false }, { text: 'Avoiding the topic', isCorrect: false }], explanation: 'Chain analysis explores the full context of behaviors.' },
      { question: 'The primary reason therapists avoid difficult conversations is:', options: [{ text: 'Lack of training', isCorrect: false }, { text: 'Fear of their own discomfort and damaging the relationship', isCorrect: true }, { text: 'Client preference', isCorrect: false }, { text: 'Ethical requirements', isCorrect: false }], explanation: 'Personal discomfort is the main driver of avoidance.' }
    ]
  },
  references: [
    'Safran, J. D., & Muran, J. C. (2000). Negotiating the therapeutic alliance: A relational treatment guide. Guilford Press.',
    'Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press.',
    'Sue, D. W., & Sue, D. (2016). Counseling the culturally diverse: Theory and practice (7th ed.). John Wiley & Sons.',
    'Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press.',
    'Eubanks, C. F., Muran, J. C., & Safran, J. D. (2018). Alliance rupture repair: A meta-analysis. Psychotherapy, 55(4), 508-519.',
    'Hook, J. N., Davis, D. E., Owen, J., Worthington Jr, E. L., & Utsey, S. O. (2013). Cultural humility: Measuring openness to culturally diverse clients. Journal of Counseling Psychology, 60(3), 353-366.'
  ]
};

// ═══════════════════════════════════════════════════════════════════
// COURSE 2: WALKING ON EGGSHELLS
// ═══════════════════════════════════════════════════════════════════

const EGGSHELLS_COURSE = {
  title: 'Walking on Eggshells: Working with High-Conflict and Emotionally Dysregulated Clients',
  slug: 'walking-on-eggshells-high-conflict-clients',
  ceHours: 3,
  credits: 3,
  category: 'Clinical Practice',
  contentArea: 'Clinical Skills',
  level: 'Intermediate',
  description: 'Working with emotionally dysregulated and high-conflict clients challenges even experienced clinicians. This course provides practical strategies drawn from DBT, mentalization-based approaches, and alliance research. Participants will learn to maintain therapeutic boundaries while providing validating, effective treatment that neither enables dysfunction nor abandons clients in distress.',
  targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
  objectives: [
    'Identify characteristics of high-conflict and emotionally dysregulated presentations',
    'Apply validation strategies from DBT to reduce client reactivity',
    'Set and maintain therapeutic boundaries without damaging the alliance',
    'Manage therapist emotional reactions and prevent burnout',
    'Navigate challenging scenarios including suicidal communications and splitting',
    'Build sustainable practices for working with difficult clients long-term'
  ],
  modules: [
    {
      title: 'Understanding High-Conflict Presentations',
      order: 1,
      lessons: [
        {
          title: 'Characteristics of Emotional Dysregulation',
          order: 1,
          type: 'text',
          content: '<h3>What Is Emotional Dysregulation?</h3><p>Emotional dysregulation refers to difficulty managing emotional responses—emotions that are too intense, too fast, too slow to return to baseline. Characteristics include:</p><p><strong>High sensitivity:</strong> Reacting to stimuli others might not notice</p><p><strong>High reactivity:</strong> Strong emotional responses that others might consider disproportionate</p><p><strong>Slow return to baseline:</strong> Extended time to recover from emotional activation</p><h3>Understanding, Not Judging</h3><p>These patterns often develop as adaptations to invalidating or traumatic environments. The behaviors that frustrate clinicians made sense in the contexts where they developed. Understanding this doesn\'t mean accepting all behaviors—but it provides essential compassion.</p>'
        },
        {
          title: 'High-Conflict Patterns',
          order: 2,
          type: 'text',
          content: '<h3>Common High-Conflict Patterns</h3><p><strong>Black-and-white thinking:</strong> People are all good or all bad. You\'re the best therapist ever—until you\'re the worst.</p><p><strong>Fear of abandonment:</strong> Intense reactions to perceived rejection, ending, or distance.</p><p><strong>Interpersonal sensitivity:</strong> Reading negative intent into neutral actions.</p><p><strong>Push-pull dynamics:</strong> Simultaneously seeking closeness and pushing away.</p><p><strong>Crisis as communication:</strong> Escalation when other communication fails.</p><h3>What Clients Need</h3><p>These clients need connection AND boundaries, validation AND accountability, flexibility AND consistency. The dialectical approach holds both.</p>'
        }
      ],
      quiz: {
        title: 'Module 1 Knowledge Check',
        questions: [
          { question: 'Emotional dysregulation includes:', options: [{ text: 'Only low emotional responses', isCorrect: false }, { text: 'High sensitivity, high reactivity, and slow return to baseline', isCorrect: true }, { text: 'Normal emotional responses', isCorrect: false }, { text: 'Only anger', isCorrect: false }], explanation: 'Dysregulation involves multiple aspects of emotional processing.' },
          { question: 'Black-and-white thinking in high-conflict clients means:', options: [{ text: 'Seeing colors literally', isCorrect: false }, { text: 'People are perceived as all good or all bad', isCorrect: true }, { text: 'Preference for clear communication', isCorrect: false }, { text: 'Cognitive impairment', isCorrect: false }], explanation: 'Splitting results in polarized views of others.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'The Power of Validation',
      order: 2,
      lessons: [
        {
          title: 'What Validation Is and Isn\'t',
          order: 1,
          type: 'text',
          content: '<h3>Validation Defined</h3><p>Validation is acknowledging and accepting another person\'s internal experience as understandable. It does NOT mean:</p><p>• Agreeing with everything they say</p><p>• Approving of all their behaviors</p><p>• Telling them they\'re right</p><p>• Giving in to demands</p><h3>Why Validation Matters</h3><p>For many dysregulated clients, invalidation was a core developmental experience. They were told their feelings were wrong, excessive, or manipulative. Validation provides a corrective experience while also paradoxically reducing escalation.</p>'
        },
        {
          title: 'The Six Levels of Validation',
          order: 2,
          type: 'text',
          content: '<h3>DBT\'s Validation Levels</h3><p><strong>Level 1 - Being Present:</strong> Listening attentively, staying engaged.</p><p><strong>Level 2 - Accurate Reflection:</strong> Summarizing what you heard without interpretation.</p><p><strong>Level 3 - Articulating the Unverbalized:</strong> Naming emotions or experiences the client hasn\'t expressed directly.</p><p><strong>Level 4 - Validating in Terms of History:</strong> "Given what you\'ve been through, this makes sense."</p><p><strong>Level 5 - Validating in Terms of Present Context:</strong> "Anyone in this situation would feel this way."</p><p><strong>Level 6 - Radical Genuineness:</strong> Treating the person as capable and equal, not as fragile.</p>'
        }
      ],
      quiz: {
        title: 'Module 2 Knowledge Check',
        questions: [
          { question: 'Validation means:', options: [{ text: 'Agreeing with everything the client says', isCorrect: false }, { text: 'Acknowledging internal experience as understandable', isCorrect: true }, { text: 'Approving of all behaviors', isCorrect: false }, { text: 'Giving in to demands', isCorrect: false }], explanation: 'Validation acknowledges experience without necessarily agreeing with conclusions or approving behaviors.' },
          { question: 'Level 6 validation (radical genuineness) involves:', options: [{ text: 'Treating the client as fragile', isCorrect: false }, { text: 'Treating the person as capable and equal', isCorrect: true }, { text: 'Complete agreement', isCorrect: false }, { text: 'Avoiding difficult topics', isCorrect: false }], explanation: 'Radical genuineness respects client capability.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Dialectical Strategies',
      order: 3,
      lessons: [
        {
          title: 'The Core Dialectic',
          order: 1,
          type: 'text',
          content: '<h3>Acceptance AND Change</h3><p>The core dialectic in DBT is acceptance AND change. Clients need to feel accepted as they are while also being pushed toward change. This both/and approach reduces polarization.</p><p>When we only push change: Clients feel invalidated and resist more.</p><p>When we only accept: Clients feel stuck and hopeless about change.</p><p>When we do both: Clients feel understood AND motivated to grow.</p><h3>Dialectical Language</h3><p>Replace "but" with "and": "I understand you\'re in pain AND I want us to find better ways to cope."</p><p>"Two things are true...": "Two things are true: you\'re doing your best AND your best isn\'t working right now."</p>'
        },
        {
          title: 'Balancing Strategies',
          order: 2,
          type: 'text',
          content: '<h3>When to Lean Into Validation</h3><p>When the client is escalated, when emotions are high, when they feel unheard, when you\'ve been pushing change.</p><h3>When to Lean Into Change</h3><p>When client is stable enough to problem-solve, when validation has been received, when avoiding change would be harmful.</p><h3>Reading the Client</h3><p>Watch for signs of validation landing: softening, deeper breathing, "yes, exactly." Watch for signs of needing change focus: resignation, hopelessness, "but what do I do?"</p>'
        }
      ],
      quiz: {
        title: 'Module 3 Knowledge Check',
        questions: [
          { question: 'The core dialectic in DBT is:', options: [{ text: 'Right versus wrong', isCorrect: false }, { text: 'Acceptance AND change', isCorrect: true }, { text: 'Past versus present', isCorrect: false }, { text: 'Client versus therapist', isCorrect: false }], explanation: 'DBT holds both acceptance and change simultaneously.' },
          { question: 'When a client is highly escalated, you should typically:', options: [{ text: 'Push harder for change', isCorrect: false }, { text: 'Lean into validation', isCorrect: true }, { text: 'Terminate the session', isCorrect: false }, { text: 'Ignore the escalation', isCorrect: false }], explanation: 'Validation helps de-escalate before change work.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Boundaries as Therapeutic Tools',
      order: 4,
      lessons: [
        {
          title: 'Why Boundaries Matter',
          order: 1,
          type: 'text',
          content: '<h3>The Paradox of Boundaries</h3><p>High-conflict clients often desperately seek connection while engaging in behaviors that push people away. They may test boundaries to see if you\'ll abandon them like others have.</p><p>Paradoxically, clear boundaries often INCREASE felt safety. A therapist who maintains limits demonstrates that they won\'t be overwhelmed or destroyed by the client\'s intensity.</p><h3>Limits vs. Punishment</h3><p>Limits are necessary parameters that protect the therapy. Punishment is designed to cause suffering. The difference is in intention and delivery.</p><p><strong>Limit:</strong> "I care about being able to help you, and to do that, I need our sessions to start on time."</p><p><strong>Punishment:</strong> "Since you were late again, we\'re ending early."</p>'
        },
        {
          title: 'Setting Boundaries with Compassion',
          order: 2,
          type: 'text',
          content: '<h3>The AND Framework</h3><p>Use "and" instead of "but" to connect validation and limits:</p><p>"I understand you\'re in crisis AND I\'m not available between sessions except for emergencies."</p><p>"I care about you AND I need to end on time."</p><h3>When Boundaries Are Tested</h3><p>Expect testing. It\'s not personal—it\'s the client\'s way of determining if you\'re safe. Respond with consistency, warmth, and firmness.</p><p>"I notice you\'re pushing against the boundary we set. I\'m curious what\'s happening for you right now."</p>'
        }
      ],
      quiz: {
        title: 'Module 4 Knowledge Check',
        questions: [
          { question: 'Clear boundaries with high-conflict clients often:', options: [{ text: 'Damage the relationship', isCorrect: false }, { text: 'Increase felt safety', isCorrect: true }, { text: 'Cause immediate termination', isCorrect: false }, { text: 'Are unnecessary', isCorrect: false }], explanation: 'Consistent boundaries create safety and predictability.' },
          { question: 'The difference between limits and punishment is:', options: [{ text: 'There is no difference', isCorrect: false }, { text: 'Intention and delivery', isCorrect: true }, { text: 'Limits are stricter', isCorrect: false }, { text: 'Punishment is gentler', isCorrect: false }], explanation: 'Limits protect; punishment intends to cause suffering.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Managing Countertransference',
      order: 5,
      lessons: [
        {
          title: 'Recognizing Your Reactions',
          order: 1,
          type: 'text',
          content: '<h3>Common Countertransference Reactions</h3><p><strong>Rescue fantasies:</strong> Feeling like you\'re the only one who can help</p><p><strong>Aversion:</strong> Dreading sessions, feeling contempt or disgust</p><p><strong>Fear:</strong> Walking on eggshells, avoiding topics</p><p><strong>Overinvolvement:</strong> Thinking about the client constantly, bending rules</p><p><strong>Hopelessness:</strong> Feeling nothing will help, giving up</p><h3>Your Reactions as Data</h3><p>Strong reactions aren\'t signs of failure—they\'re information. What you feel may reflect what others feel around this client, or what the client feels internally.</p>'
        },
        {
          title: 'Self-Care and Sustainability',
          order: 2,
          type: 'text',
          content: '<h3>Sustainable Practice</h3><p>Working with high-conflict clients is demanding. Build in:</p><p><strong>Caseload balance:</strong> Don\'t fill your caseload with only intense clients</p><p><strong>Consultation:</strong> Regular consultation is essential, not optional</p><p><strong>Boundaries on your time:</strong> Protect time for recovery between sessions</p><p><strong>Your own therapy:</strong> Consider your own therapeutic work</p><h3>When You\'re Struggling</h3><p>Signs you need additional support: dreading multiple clients, irritability spilling into personal life, sleep disruption related to cases, feeling hopeless about clinical work generally.</p>'
        }
      ],
      quiz: {
        title: 'Module 5 Knowledge Check',
        questions: [
          { question: 'Rescue fantasies involve:', options: [{ text: 'Appropriate professional boundaries', isCorrect: false }, { text: 'Feeling like you\'re the only one who can help', isCorrect: true }, { text: 'Referring too quickly', isCorrect: false }, { text: 'Healthy therapeutic stance', isCorrect: false }], explanation: 'Rescue fantasies reflect overinvolvement and unrealistic expectations.' },
          { question: 'Countertransference reactions are:', options: [{ text: 'Signs of clinical failure', isCorrect: false }, { text: 'Information about the client and therapeutic relationship', isCorrect: true }, { text: 'Rare occurrences', isCorrect: false }, { text: 'Reasons to terminate', isCorrect: false }], explanation: 'Countertransference provides valuable clinical data.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Crisis and Suicidality',
      order: 6,
      lessons: [
        {
          title: 'Managing Suicidal Communications',
          order: 1,
          type: 'text',
          content: '<h3>Suicidality in High-Conflict Presentations</h3><p>Clients with emotional dysregulation are at elevated suicide risk. This is real and must be taken seriously. AND—suicidal communications can also function as crisis communication when other communication has failed.</p><p>Both things are true. We assess thoroughly AND we understand the function.</p><h3>Assessment</h3><p>Always assess thoroughly: ideation, plan, means, intent, protective factors. Don\'t assume chronic suicidality means lower risk—it doesn\'t.</p>'
        },
        {
          title: 'Between-Session Crises',
          order: 2,
          type: 'text',
          content: '<h3>Crisis Contact Boundaries</h3><p>Establish clear expectations about between-session contact:</p><p>• What constitutes an emergency</p><p>• How to reach you (or crisis services)</p><p>• What response to expect</p><p>• Consequences of misuse (addressed with curiosity, not punishment)</p><h3>When Crises Are Frequent</h3><p>Frequent crises warrant clinical attention: "I\'ve noticed we\'ve had several crises between sessions. I want to understand what\'s happening and figure out how to help you feel more stable."</p><p>Address the pattern, not just each individual crisis.</p>'
        }
      ],
      quiz: {
        title: 'Module 6 Knowledge Check',
        questions: [
          { question: 'With high-conflict clients, suicidal communications:', options: [{ text: 'Should never be taken seriously', isCorrect: false }, { text: 'Represent real risk AND may function as crisis communication', isCorrect: true }, { text: 'Are always manipulative', isCorrect: false }, { text: 'Require immediate hospitalization every time', isCorrect: false }], explanation: 'Both the real risk and the communicative function must be understood.' },
          { question: 'Frequent between-session crises should be:', options: [{ text: 'Ignored to avoid reinforcement', isCorrect: false }, { text: 'Addressed as a pattern in therapy', isCorrect: true }, { text: 'Cause for immediate termination', isCorrect: false }, { text: 'Handled only by crisis services', isCorrect: false }], explanation: 'The pattern itself is clinical material to address.' }
        ],
        passingScore: 0.80
      }
    }
  ],
  assessment: {
    passThreshold: 0.80,
    questions: [
      { question: 'Emotional dysregulation includes all EXCEPT:', options: [{ text: 'High sensitivity', isCorrect: false }, { text: 'High reactivity', isCorrect: false }, { text: 'Immediate return to baseline', isCorrect: true }, { text: 'Slow return to baseline', isCorrect: false }], explanation: 'Dysregulation involves SLOW return to baseline, not immediate.' },
      { question: 'Validation in DBT means:', options: [{ text: 'Agreeing with the client\'s conclusions', isCorrect: false }, { text: 'Acknowledging experience as understandable', isCorrect: true }, { text: 'Approving all behaviors', isCorrect: false }, { text: 'Avoiding any confrontation', isCorrect: false }], explanation: 'Validation acknowledges experience without agreement or approval.' },
      { question: 'The core dialectic in DBT is:', options: [{ text: 'Right vs. wrong', isCorrect: false }, { text: 'Acceptance AND change', isCorrect: true }, { text: 'Client vs. therapist', isCorrect: false }, { text: 'Past vs. present', isCorrect: false }], explanation: 'DBT holds acceptance and change together.' },
      { question: 'When a client tests boundaries, this often reflects:', options: [{ text: 'Personal attack on the therapist', isCorrect: false }, { text: 'Testing whether the therapist will abandon them', isCorrect: true }, { text: 'Reason to terminate', isCorrect: false }, { text: 'Lack of respect', isCorrect: false }], explanation: 'Boundary testing often tests safety and consistency.' },
      { question: 'Level 6 validation involves:', options: [{ text: 'Treating the client as fragile', isCorrect: false }, { text: 'Radical genuineness and treating as capable', isCorrect: true }, { text: 'Complete agreement', isCorrect: false }, { text: 'Avoiding all challenges', isCorrect: false }], explanation: 'Radical genuineness respects the client as capable.' },
      { question: 'Countertransference reactions are:', options: [{ text: 'Signs of therapist incompetence', isCorrect: false }, { text: 'Valuable clinical information', isCorrect: true }, { text: 'Rare occurrences', isCorrect: false }, { text: 'Reasons to terminate', isCorrect: false }], explanation: 'Countertransference provides data about the relationship.' },
      { question: 'With emotionally dysregulated clients, clear boundaries often:', options: [{ text: 'Damage the relationship', isCorrect: false }, { text: 'Increase felt safety', isCorrect: true }, { text: 'Cause immediate dropout', isCorrect: false }, { text: 'Are unnecessary', isCorrect: false }], explanation: 'Consistent boundaries create predictability and safety.' },
      { question: 'When a client is highly escalated:', options: [{ text: 'Push for behavioral change', isCorrect: false }, { text: 'Lean into validation first', isCorrect: true }, { text: 'Terminate the session', isCorrect: false }, { text: 'Ignore the escalation', isCorrect: false }], explanation: 'Validation helps de-escalate before problem-solving.' },
      { question: 'The difference between limits and punishment is:', options: [{ text: 'There is no difference', isCorrect: false }, { text: 'Intention and delivery', isCorrect: true }, { text: 'Limits are harsher', isCorrect: false }, { text: 'Punishment is therapeutic', isCorrect: false }], explanation: 'Limits protect; punishment intends suffering.' },
      { question: 'Suicidal communications in high-conflict clients:', options: [{ text: 'Are never serious', isCorrect: false }, { text: 'Represent real risk AND may serve communicative function', isCorrect: true }, { text: 'Should be ignored', isCorrect: false }, { text: 'Always require hospitalization', isCorrect: false }], explanation: 'Both the risk and the function must be addressed.' },
      { question: 'Dialectical language replaces "but" with:', options: [{ text: 'However', isCorrect: false }, { text: 'And', isCorrect: true }, { text: 'Although', isCorrect: false }, { text: 'Despite', isCorrect: false }], explanation: '"And" holds both truths simultaneously.' },
      { question: 'Black-and-white thinking means:', options: [{ text: 'Clear communication', isCorrect: false }, { text: 'Seeing people as all good or all bad', isCorrect: true }, { text: 'Cognitive clarity', isCorrect: false }, { text: 'Racial awareness', isCorrect: false }], explanation: 'Splitting results in polarized perceptions.' },
      { question: 'Rescue fantasies are a form of:', options: [{ text: 'Good clinical practice', isCorrect: false }, { text: 'Countertransference', isCorrect: true }, { text: 'Appropriate empathy', isCorrect: false }, { text: 'Professional boundary', isCorrect: false }], explanation: 'Rescue fantasies reflect overinvolvement.' },
      { question: 'Frequent between-session crises should be:', options: [{ text: 'Ignored', isCorrect: false }, { text: 'Addressed as a clinical pattern', isCorrect: true }, { text: 'Cause for termination', isCorrect: false }, { text: 'Handled only by emergency services', isCorrect: false }], explanation: 'The pattern itself requires clinical attention.' },
      { question: 'When you dread sessions with a client:', options: [{ text: 'Terminate immediately', isCorrect: false }, { text: 'Seek consultation and examine countertransference', isCorrect: true }, { text: 'Ignore the feeling', isCorrect: false }, { text: 'This is normal and requires no action', isCorrect: false }], explanation: 'Strong reactions warrant professional reflection.' },
      { question: 'Validation reduces escalation because:', options: [{ text: 'It gives clients what they want', isCorrect: false }, { text: 'Feeling understood reduces need for escalation', isCorrect: true }, { text: 'It avoids confrontation', isCorrect: false }, { text: 'It eliminates all conflict', isCorrect: false }], explanation: 'Validation addresses the underlying need to be heard.' },
      { question: 'Sustainable practice with high-conflict clients requires:', options: [{ text: 'Unlimited availability', isCorrect: false }, { text: 'Caseload balance, consultation, and self-care', isCorrect: true }, { text: 'Avoiding difficult clients entirely', isCorrect: false }, { text: 'Working through exhaustion', isCorrect: false }], explanation: 'Sustainability requires intentional balance and support.' },
      { question: 'The phrase "I understand AND" is used to:', options: [{ text: 'Avoid addressing issues', isCorrect: false }, { text: 'Connect validation with limits or change', isCorrect: true }, { text: 'Express complete agreement', isCorrect: false }, { text: 'End conversations', isCorrect: false }], explanation: '"And" holds both validation and necessary limits.' },
      { question: 'When clients push against boundaries, respond with:', options: [{ text: 'Anger and punishment', isCorrect: false }, { text: 'Consistency, warmth, and curiosity', isCorrect: true }, { text: 'Abandoning the boundary', isCorrect: false }, { text: 'Immediate termination', isCorrect: false }], explanation: 'Maintain limits with warmth and explore the testing.' },
      { question: 'High-conflict patterns often developed as:', options: [{ text: 'Conscious manipulation', isCorrect: false }, { text: 'Adaptations to invalidating environments', isCorrect: true }, { text: 'Genetic disorders', isCorrect: false }, { text: 'Random occurrences', isCorrect: false }], explanation: 'These patterns often made sense in developmental context.' }
    ]
  },
  references: [
    'Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press.',
    'Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press.',
    'Bateman, A., & Fonagy, P. (2016). Mentalization-based treatment for personality disorders. Oxford University Press.',
    'Gunderson, J. G., & Links, P. S. (2014). Handbook of good psychiatric management for borderline personality disorder. American Psychiatric Publishing.'
  ]
};

// ═══════════════════════════════════════════════════════════════════
// COURSE 3: WHEN IT RAINS IT POURS
// ═══════════════════════════════════════════════════════════════════

const RAINS_COURSE = {
  title: 'When It Rains, It Pours: Treating Clients with Multiple Stressors and Comorbidities',
  slug: 'when-it-rains-it-pours-complex-presentations',
  ceHours: 3,
  credits: 3,
  category: 'Clinical Practice',
  contentArea: 'Clinical Skills',
  level: 'Intermediate',
  description: 'Most clients in real-world practice present with multiple co-occurring concerns—the client with depression also has anxiety, chronic pain, relationship problems, and financial stress. This course provides frameworks for assessing, prioritizing, and treating complex presentations using evidence-based approaches including the DBT treatment hierarchy, keystone problem identification, and transdiagnostic interventions.',
  targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
  objectives: [
    'Describe the prevalence and nature of comorbidity in clinical populations',
    'Apply systematic assessment frameworks for complex presentations',
    'Use the DBT treatment hierarchy to prioritize treatment targets',
    'Identify keystone problems that affect multiple domains',
    'Implement transdiagnostic interventions targeting shared mechanisms',
    'Coordinate care effectively when multiple providers are involved'
  ],
  modules: [
    {
      title: 'Understanding Complexity',
      order: 1,
      lessons: [
        {
          title: 'The Reality of Comorbidity',
          order: 1,
          type: 'text',
          content: '<h3>Comorbidity Is the Rule</h3><p>Over 45% of individuals with any mental health diagnosis meet criteria for two or more disorders. In treatment-seeking populations, rates exceed 60%. Comorbidity is the norm, not the exception.</p><h3>Why Problems Cluster</h3><p><strong>Shared vulnerability:</strong> Common factors predispose to multiple conditions</p><p><strong>Causal relationships:</strong> One disorder causes or maintains another</p><p><strong>Life stress accumulation:</strong> Multiple stressors compound over time</p><p><strong>Cascade effects:</strong> One problem triggers others in chain reactions</p>'
        },
        {
          title: 'The Allostatic Load Framework',
          order: 2,
          type: 'text',
          content: '<h3>What Is Allostatic Load?</h3><p>Allostatic load refers to the cumulative burden of chronic stress. When stress is ongoing, the body\'s systems remain chronically activated, leading to wear and tear on multiple systems.</p><h3>Clinical Implications</h3><p>High allostatic load helps explain why some clients develop multiple problems while others with similar stressors don\'t. It\'s not weakness—it\'s accumulated physiological burden. This framework encourages compassion and informs treatment priorities.</p>'
        }
      ],
      quiz: {
        title: 'Module 1 Knowledge Check',
        questions: [
          { question: 'What percentage of individuals with mental health diagnoses have comorbid conditions?', options: [{ text: 'Less than 10%', isCorrect: false }, { text: 'About 25%', isCorrect: false }, { text: 'Over 45%', isCorrect: true }, { text: 'Nearly 100%', isCorrect: false }], explanation: 'Research shows over 45% have multiple diagnoses.' },
          { question: 'Allostatic load refers to:', options: [{ text: 'The number of stressors', isCorrect: false }, { text: 'Cumulative burden of chronic stress on the body', isCorrect: true }, { text: 'Amount of work required', isCorrect: false }, { text: 'Treatment complexity', isCorrect: false }], explanation: 'Allostatic load is the wear and tear from chronic stress.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Assessment of Complex Presentations',
      order: 2,
      lessons: [
        {
          title: 'The Four Ps Model',
          order: 1,
          type: 'text',
          content: '<h3>Organizing Complexity</h3><p>The Four Ps provide a framework for organizing complex information:</p><p><strong>Predisposing Factors:</strong> What made this person vulnerable? (genetics, early experiences, temperament)</p><p><strong>Precipitating Factors:</strong> What triggered the current episode? (recent stressors, losses, changes)</p><p><strong>Perpetuating Factors:</strong> What keeps the problems going? (avoidance, substance use, relationship patterns)</p><p><strong>Protective Factors:</strong> What strengths and resources does this person have? (support, coping skills, resilience)</p>'
        },
        {
          title: 'Problem Interaction Mapping',
          order: 2,
          type: 'text',
          content: '<h3>How Problems Interact</h3><p>Problems don\'t exist in isolation. Depression maintains insomnia. Insomnia worsens anxiety. Anxiety drives substance use. Substance use deepens depression.</p><p>Map these interactions: Draw each problem as a node. Draw arrows showing how each affects others. Look for patterns—which problems affect the most others? Which are central to the web?</p><h3>Finding Leverage Points</h3><p>The map reveals leverage points—places where intervention might have outsized impact because addressing one problem will affect multiple others.</p>'
        }
      ],
      quiz: {
        title: 'Module 2 Knowledge Check',
        questions: [
          { question: 'The Four Ps include all EXCEPT:', options: [{ text: 'Predisposing', isCorrect: false }, { text: 'Precipitating', isCorrect: false }, { text: 'Problematic', isCorrect: true }, { text: 'Protective', isCorrect: false }], explanation: 'The Four Ps are Predisposing, Precipitating, Perpetuating, and Protective.' },
          { question: 'Problem interaction mapping helps identify:', options: [{ text: 'Insurance codes', isCorrect: false }, { text: 'Leverage points for intervention', isCorrect: true }, { text: 'Billing rates', isCorrect: false }, { text: 'Session frequency', isCorrect: false }], explanation: 'Mapping shows where intervention can have outsized impact.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Prioritization Strategies',
      order: 3,
      lessons: [
        {
          title: 'The DBT Treatment Hierarchy',
          order: 1,
          type: 'text',
          content: '<h3>What to Address First</h3><p>When everything feels urgent, the DBT hierarchy provides guidance:</p><p><strong>Level 1 - Life-Threatening Behaviors:</strong> Suicidality, self-harm, homicidality. Always first.</p><p><strong>Level 2 - Therapy-Interfering Behaviors:</strong> Anything preventing effective treatment.</p><p><strong>Level 3 - Quality of Life Interfering Behaviors:</strong> Substance use, relationship dysfunction, employment problems, housing instability.</p><p><strong>Level 4 - Skills Acquisition:</strong> Building capabilities for long-term functioning.</p>'
        },
        {
          title: 'Keystone Problems',
          order: 2,
          type: 'text',
          content: '<h3>What Is a Keystone Problem?</h3><p>A keystone problem is one whose improvement would have cascading positive effects on multiple other problems. Like the keystone in an arch, addressing it affects the whole structure.</p><h3>Identifying Keystones</h3><p>Look for problems that:</p><p>• Affect multiple life domains</p><p>• Maintain or worsen other problems</p><p>• Have high centrality in your problem interaction map</p><p>• Are modifiable with available interventions</p><p>Common keystones: sleep, substance use, core beliefs, behavioral avoidance.</p>'
        }
      ],
      quiz: {
        title: 'Module 3 Knowledge Check',
        questions: [
          { question: 'In the DBT hierarchy, what comes first?', options: [{ text: 'Quality of life issues', isCorrect: false }, { text: 'Life-threatening behaviors', isCorrect: true }, { text: 'Skills building', isCorrect: false }, { text: 'Therapy-interfering behaviors', isCorrect: false }], explanation: 'Safety (life-threatening behaviors) always comes first.' },
          { question: 'A keystone problem is one that:', options: [{ text: 'Is the most recent', isCorrect: false }, { text: 'Affects multiple other problems when addressed', isCorrect: true }, { text: 'The client mentions first', isCorrect: false }, { text: 'Is easiest to treat', isCorrect: false }], explanation: 'Keystone problems have cascading effects on other problems.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Transdiagnostic Approaches',
      order: 4,
      lessons: [
        {
          title: 'The Unified Protocol',
          order: 1,
          type: 'text',
          content: '<h3>Targeting Shared Mechanisms</h3><p>The Unified Protocol targets emotional disorders by addressing what they share:</p><p>• Emotional awareness deficits</p><p>• Cognitive rigidity</p><p>• Emotional avoidance</p><p>• Behavioral avoidance</p><p>By targeting these shared mechanisms, one treatment addresses multiple conditions.</p><h3>Other Transdiagnostic Targets</h3><p><strong>Sleep:</strong> Disrupted across most disorders, modifiable, affects everything else.</p><p><strong>Avoidance:</strong> Maintains anxiety, depression, PTSD, substance use.</p><p><strong>Rumination:</strong> Common to depression, anxiety, and many other conditions.</p>'
        },
        {
          title: 'Selecting Interventions',
          order: 2,
          type: 'text',
          content: '<h3>Matching Intervention to Mechanism</h3><p>Rather than asking "what protocol for this diagnosis?", ask "what mechanism maintains these problems?"</p><p>If avoidance maintains multiple conditions → exposure-based intervention</p><p>If cognitive rigidity drives distress → cognitive restructuring</p><p>If sleep disruption affects everything → behavioral sleep intervention</p><h3>Sequencing</h3><p>Start with stabilization (safety, crisis reduction), then address maintaining mechanisms, then build skills for long-term functioning.</p>'
        }
      ],
      quiz: {
        title: 'Module 4 Knowledge Check',
        questions: [
          { question: 'Transdiagnostic approaches target:', options: [{ text: 'Specific diagnoses', isCorrect: false }, { text: 'Shared mechanisms across conditions', isCorrect: true }, { text: 'Insurance requirements', isCorrect: false }, { text: 'Session length', isCorrect: false }], explanation: 'Transdiagnostic approaches address what conditions have in common.' },
          { question: 'Sleep is often a transdiagnostic target because:', options: [{ text: 'It\'s easy to measure', isCorrect: false }, { text: 'It\'s disrupted across disorders and affects everything else', isCorrect: true }, { text: 'Clients always want to discuss it', isCorrect: false }, { text: 'Insurance covers it', isCorrect: false }], explanation: 'Sleep affects multiple conditions and is highly modifiable.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Care Coordination',
      order: 5,
      lessons: [
        {
          title: 'When Multiple Providers Are Involved',
          order: 1,
          type: 'text',
          content: '<h3>The Fragmentation Problem</h3><p>Complex clients often see multiple providers: therapist, psychiatrist, primary care, specialist. Without coordination:</p><p>• Providers don\'t know what others are doing</p><p>• Recommendations may conflict</p><p>• Important information falls through cracks</p><p>• Client becomes sole coordinator of their own care</p><h3>Your Role in Coordination</h3><p>As the therapist, you may see the client most frequently. Consider yourself the hub of communication—reaching out to other providers, integrating information, helping the client navigate the system.</p>'
        },
        {
          title: 'Effective Communication',
          order: 2,
          type: 'text',
          content: '<h3>Releases and Permissions</h3><p>Get appropriate releases at intake for likely coordination needs. Specify who, what information, for what purpose.</p><h3>Communicating with Other Providers</h3><p>Be concise, relevant, and collaborative:</p><p>"I\'m writing to coordinate care for our mutual patient. From my perspective, the key issues are... I\'d appreciate your input on..."</p><h3>Managing Disagreements</h3><p>When you disagree with another provider\'s approach, focus on client welfare. Seek to understand their perspective. Communicate directly rather than through the client.</p>'
        }
      ],
      quiz: {
        title: 'Module 5 Knowledge Check',
        questions: [
          { question: 'Without care coordination, what happens?', options: [{ text: 'Treatment improves', isCorrect: false }, { text: 'Information falls through cracks and recommendations conflict', isCorrect: true }, { text: 'Clients prefer it', isCorrect: false }, { text: 'Costs decrease', isCorrect: false }], explanation: 'Fragmented care leads to gaps and conflicts.' },
          { question: 'The therapist\'s role in coordination is:', options: [{ text: 'To avoid other providers', isCorrect: false }, { text: 'To serve as a hub of communication', isCorrect: true }, { text: 'To compete with other providers', isCorrect: false }, { text: 'To defer all decisions elsewhere', isCorrect: false }], explanation: 'Therapists often see clients most frequently and can integrate information.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Maintaining Focus and Self-Care',
      order: 6,
      lessons: [
        {
          title: 'Session Structure Strategies',
          order: 1,
          type: 'text',
          content: '<h3>When Everything Is Urgent</h3><p>Complex clients often arrive with multiple crises. Without structure, sessions become unfocused fire-fighting.</p><h3>Strategies</h3><p><strong>Agenda setting:</strong> "What\'s most important to focus on today?"</p><p><strong>Parking lot:</strong> Note topics for future sessions rather than trying to address everything.</p><p><strong>Regular check-ins:</strong> Periodically step back—"Are we working on what matters most?"</p><p><strong>Time management:</strong> Reserve time at the end for grounding and next steps.</p>'
        },
        {
          title: 'Clinician Self-Care',
          order: 2,
          type: 'text',
          content: '<h3>The Cost of Complexity</h3><p>Working with complex clients is demanding. Signs of strain: dreading cases, feeling hopeless, difficulty "turning off" work, physical symptoms.</p><h3>Sustainable Practice</h3><p>• Limit the number of highly complex cases in your caseload</p><p>• Build in breaks between intense sessions</p><p>• Maintain regular consultation/supervision</p><p>• Protect personal time and boundaries</p><p>• Consider your own therapy</p><p>• Celebrate small wins—progress with complex clients is often slow</p>'
        }
      ],
      quiz: {
        title: 'Module 6 Knowledge Check',
        questions: [
          { question: 'Agenda setting helps by:', options: [{ text: 'Avoiding all difficult topics', isCorrect: false }, { text: 'Focusing the session on priorities', isCorrect: true }, { text: 'Letting the client talk freely', isCorrect: false }, { text: 'Reducing session length', isCorrect: false }], explanation: 'Agenda setting creates focus amid complexity.' },
          { question: 'Sustainable practice with complex clients requires:', options: [{ text: 'Taking every referral', isCorrect: false }, { text: 'Caseload limits, consultation, and self-care', isCorrect: true }, { text: 'Avoiding breaks', isCorrect: false }, { text: 'Working through burnout', isCorrect: false }], explanation: 'Sustainability requires intentional limits and support.' }
        ],
        passingScore: 0.80
      }
    }
  ],
  assessment: {
    passThreshold: 0.80,
    questions: [
      { question: 'What percentage of mental health clients have comorbid conditions?', options: [{ text: 'Less than 20%', isCorrect: false }, { text: 'About 30%', isCorrect: false }, { text: 'Over 45%', isCorrect: true }, { text: 'Exactly 50%', isCorrect: false }], explanation: 'Research consistently shows over 45%.' },
      { question: 'The DBT treatment hierarchy prioritizes:', options: [{ text: 'Quality of life issues first', isCorrect: false }, { text: 'Life-threatening behaviors first', isCorrect: true }, { text: 'Whatever the client wants', isCorrect: false }, { text: 'Skills building first', isCorrect: false }], explanation: 'Safety always comes first.' },
      { question: 'A keystone problem is characterized by:', options: [{ text: 'Being the most recent', isCorrect: false }, { text: 'Affecting multiple other problems', isCorrect: true }, { text: 'Being mentioned first', isCorrect: false }, { text: 'Being the oldest', isCorrect: false }], explanation: 'Keystones have cascading effects on other problems.' },
      { question: 'Transdiagnostic approaches target:', options: [{ text: 'Specific diagnoses', isCorrect: false }, { text: 'Shared mechanisms across conditions', isCorrect: true }, { text: 'Insurance requirements', isCorrect: false }, { text: 'Individual symptoms', isCorrect: false }], explanation: 'Transdiagnostic approaches address common factors.' },
      { question: 'Allostatic load refers to:', options: [{ text: 'Treatment burden', isCorrect: false }, { text: 'Cumulative stress burden on the body', isCorrect: true }, { text: 'Number of sessions', isCorrect: false }, { text: 'Paperwork requirements', isCorrect: false }], explanation: 'Allostatic load is wear and tear from chronic stress.' },
      { question: 'The Four Ps include:', options: [{ text: 'Predisposing, Precipitating, Perpetuating, Protective', isCorrect: true }, { text: 'Primary, Progressive, Permanent, Preventable', isCorrect: false }, { text: 'Personal, Professional, Practical, Positive', isCorrect: false }, { text: 'Past, Present, Possible, Predicted', isCorrect: false }], explanation: 'The Four Ps organize case conceptualization.' },
      { question: 'Problem interaction mapping helps identify:', options: [{ text: 'Insurance codes', isCorrect: false }, { text: 'Leverage points for intervention', isCorrect: true }, { text: 'Billing requirements', isCorrect: false }, { text: 'Diagnosis dates', isCorrect: false }], explanation: 'Mapping reveals where intervention can have outsized impact.' },
      { question: 'Sleep is often a keystone problem because:', options: [{ text: 'Clients always mention it', isCorrect: false }, { text: 'It affects multiple conditions and is modifiable', isCorrect: true }, { text: 'It\'s easy to assess', isCorrect: false }, { text: 'Insurance covers it', isCorrect: false }], explanation: 'Sleep affects many conditions and responds to intervention.' },
      { question: 'Care coordination is important because:', options: [{ text: 'It increases billing', isCorrect: false }, { text: 'Fragmented care leads to gaps and conflicts', isCorrect: true }, { text: 'Clients prefer it', isCorrect: false }, { text: 'It reduces work', isCorrect: false }], explanation: 'Coordination prevents fragmentation and improves outcomes.' },
      { question: 'Agenda setting in sessions helps by:', options: [{ text: 'Avoiding difficult topics', isCorrect: false }, { text: 'Focusing on priorities amid complexity', isCorrect: true }, { text: 'Shortening sessions', isCorrect: false }, { text: 'Reducing client involvement', isCorrect: false }], explanation: 'Agendas create focus when everything feels urgent.' },
      { question: 'Therapy-interfering behaviors are prioritized:', options: [{ text: 'Last', isCorrect: false }, { text: 'After life-threatening, before quality of life', isCorrect: true }, { text: 'First', isCorrect: false }, { text: 'Only if convenient', isCorrect: false }], explanation: 'TIBs come second in the DBT hierarchy.' },
      { question: 'When providers disagree:', options: [{ text: 'Communicate through the client', isCorrect: false }, { text: 'Communicate directly and focus on client welfare', isCorrect: true }, { text: 'Ignore the disagreement', isCorrect: false }, { text: 'Terminate the client', isCorrect: false }], explanation: 'Direct communication focused on client welfare is best.' },
      { question: 'Signs of clinician strain include:', options: [{ text: 'Excitement about cases', isCorrect: false }, { text: 'Dreading cases and difficulty "turning off"', isCorrect: true }, { text: 'Wanting more clients', isCorrect: false }, { text: 'Feeling underworked', isCorrect: false }], explanation: 'These signs indicate need for additional support.' },
      { question: 'Sustainable practice with complex clients requires:', options: [{ text: 'Taking every referral', isCorrect: false }, { text: 'Caseload balance and regular consultation', isCorrect: true }, { text: 'Working through exhaustion', isCorrect: false }, { text: 'Avoiding self-care', isCorrect: false }], explanation: 'Sustainability requires intentional limits and support.' },
      { question: 'The Unified Protocol targets:', options: [{ text: 'Specific phobias only', isCorrect: false }, { text: 'Shared mechanisms across emotional disorders', isCorrect: true }, { text: 'Only depression', isCorrect: false }, { text: 'Only anxiety', isCorrect: false }], explanation: 'UP addresses mechanisms common to multiple conditions.' },
      { question: 'When starting with a complex client, begin with:', options: [{ text: 'Skills building', isCorrect: false }, { text: 'Stabilization and safety', isCorrect: true }, { text: 'Deep trauma processing', isCorrect: false }, { text: 'Whatever the client prefers', isCorrect: false }], explanation: 'Stabilization comes before other interventions.' },
      { question: 'Complex presentations are:', options: [{ text: 'Rare exceptions', isCorrect: false }, { text: 'The norm in clinical practice', isCorrect: true }, { text: 'Signs of treatment failure', isCorrect: false }, { text: 'Always untreatable', isCorrect: false }], explanation: 'Complexity is typical, not exceptional.' },
      { question: 'The "parking lot" technique involves:', options: [{ text: 'Meeting in parking lots', isCorrect: false }, { text: 'Noting topics for future sessions', isCorrect: true }, { text: 'Ending sessions early', isCorrect: false }, { text: 'Avoiding all planning', isCorrect: false }], explanation: 'The parking lot holds important topics for later.' },
      { question: 'Avoidance is a transdiagnostic target because:', options: [{ text: 'It\'s easy to address', isCorrect: false }, { text: 'It maintains anxiety, depression, PTSD, and other conditions', isCorrect: true }, { text: 'Clients enjoy it', isCorrect: false }, { text: 'It\'s rarely present', isCorrect: false }], explanation: 'Avoidance maintains multiple disorders.' },
      { question: 'Celebrating small wins with complex clients is important because:', options: [{ text: 'Progress is often slow and incremental', isCorrect: true }, { text: 'Large wins are guaranteed', isCorrect: false }, { text: 'It reduces session length', isCorrect: false }, { text: 'It avoids difficult topics', isCorrect: false }], explanation: 'Complex cases require patience and recognition of incremental progress.' }
    ]
  },
  references: [
    'Barlow, D. H., et al. (2017). Unified protocol for transdiagnostic treatment of emotional disorders (2nd ed.). Oxford University Press.',
    'Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press.',
    'Kessler, R. C., et al. (2005). Prevalence, severity, and comorbidity of 12-month DSM-IV disorders. Archives of General Psychiatry, 62(6), 617-627.',
    'Harvey, A. G. (2008). Insomnia, psychiatric disorders, and the transdiagnostic perspective. Current Directions in Psychological Science, 17(5), 299-303.'
  ]
};

// ═══════════════════════════════════════════════════════════════════
// COURSE 4: IT TAKES A VILLAGE
// ═══════════════════════════════════════════════════════════════════

const VILLAGE_COURSE = {
  title: 'It Takes a Village: Consultation, Referral, and Collaborative Care',
  slug: 'it-takes-a-village-collaborative-care',
  ceHours: 3,
  credits: 3,
  category: 'Ethics',
  contentArea: 'Professional Practice',
  level: 'Intermediate',
  description: 'No clinician is an island. This course addresses the essential collaborative skills that support effective clinical practice: seeking and providing consultation, making appropriate referrals, coordinating care across providers, and working effectively on interdisciplinary teams. Both ethical requirements and practical strategies are emphasized.',
  targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
  objectives: [
    'Distinguish between consultation and supervision',
    'Identify situations that warrant consultation',
    'Prepare for and conduct effective consultations',
    'Implement ethical referral practices including warm handoffs',
    'Coordinate care across multiple providers effectively',
    'Contribute effectively to interdisciplinary treatment teams'
  ],
  modules: [
    {
      title: 'Foundations of Consultation',
      order: 1,
      lessons: [
        {
          title: 'What Is Consultation?',
          order: 1,
          type: 'text',
          content: '<h3>Consultation Defined</h3><p>Consultation is a professional relationship in which a counselor seeks expert guidance on a clinical, ethical, or professional matter. Key features:</p><p><strong>Voluntary:</strong> The consultee chooses to seek consultation</p><p><strong>Expert-based:</strong> The consultant brings specialized knowledge</p><p><strong>Problem-focused:</strong> Addresses specific professional challenges</p><p><strong>Responsibility retained:</strong> The consultee retains full responsibility for clinical decisions</p>'
        },
        {
          title: 'Consultation vs. Supervision',
          order: 2,
          type: 'text',
          content: '<h3>Key Differences</h3><p><strong>Supervision:</strong> Hierarchical, evaluative, ongoing, supervisor shares responsibility and liability, often mandated</p><p><strong>Consultation:</strong> Collegial, non-evaluative, often time-limited, consultee retains full responsibility, voluntary</p><h3>Why This Matters</h3><p>Understanding the difference affects liability, autonomy, and the nature of the relationship. In consultation, you retain decision-making authority.</p>'
        }
      ],
      quiz: {
        title: 'Module 1 Knowledge Check',
        questions: [
          { question: 'In consultation, who retains responsibility for clinical decisions?', options: [{ text: 'The consultant', isCorrect: false }, { text: 'The consultee', isCorrect: true }, { text: 'Both equally', isCorrect: false }, { text: 'Neither', isCorrect: false }], explanation: 'The consultee retains full responsibility for decisions.' },
          { question: 'A key difference between consultation and supervision is:', options: [{ text: 'Consultation is mandatory', isCorrect: false }, { text: 'In consultation, the consultee retains autonomy', isCorrect: true }, { text: 'Supervision is voluntary', isCorrect: false }, { text: 'There is no difference', isCorrect: false }], explanation: 'Consultation preserves consultee decision-making authority.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Seeking Consultation Effectively',
      order: 2,
      lessons: [
        {
          title: 'When to Consult',
          order: 1,
          type: 'text',
          content: '<h3>Situations Warranting Consultation</h3><p><strong>Clinical uncertainty:</strong> Cases outside your typical expertise</p><p><strong>Ethical dilemmas:</strong> Situations without clear right answers</p><p><strong>High-risk situations:</strong> Suicidality, violence, abuse</p><p><strong>Strong countertransference:</strong> When your reactions may impair judgment</p><p><strong>Stuck cases:</strong> Treatment not progressing despite your efforts</p><h3>The ACA Requirement</h3><p>ACA Code of Ethics C.2.e: "Counselors consult with other counselors or related professionals when they have questions regarding their ethical obligations or professional practice."</p>'
        },
        {
          title: 'Preparing for Consultation',
          order: 2,
          type: 'text',
          content: '<h3>Coming Prepared</h3><p>Effective consultation requires preparation:</p><p><strong>Clarify your question:</strong> What specifically do you want input on?</p><p><strong>Organize relevant information:</strong> What does the consultant need to know?</p><p><strong>Know your thinking:</strong> What have you already considered?</p><p><strong>Identify your blind spots:</strong> Where might you be missing something?</p><h3>Presenting the Case</h3><p>Be concise: brief context, current situation, your thinking, specific question. Don\'t data-dump; share what\'s relevant to your question.</p>'
        }
      ],
      quiz: {
        title: 'Module 2 Knowledge Check',
        questions: [
          { question: 'The ACA Code requires consultation when:', options: [{ text: 'Only in emergencies', isCorrect: false }, { text: 'When you have questions about ethics or practice', isCorrect: true }, { text: 'Never', isCorrect: false }, { text: 'Only for new counselors', isCorrect: false }], explanation: 'ACA requires consultation when questions arise about ethics or practice.' },
          { question: 'Effective consultation preparation includes:', options: [{ text: 'Sharing every detail about the client', isCorrect: false }, { text: 'Clarifying your specific question', isCorrect: true }, { text: 'Avoiding any preparation', isCorrect: false }, { text: 'Letting the consultant lead entirely', isCorrect: false }], explanation: 'Clear questions lead to useful consultation.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Providing Consultation',
      order: 3,
      lessons: [
        {
          title: 'Being an Effective Consultant',
          order: 1,
          type: 'text',
          content: '<h3>The Consultant\'s Stance</h3><p><strong>Ask before telling:</strong> Understand the situation before offering advice</p><p><strong>Share thinking, not just conclusions:</strong> Help the consultee learn, not just follow orders</p><p><strong>Acknowledge uncertainty:</strong> Be honest about the limits of your expertise</p><p><strong>Promote autonomy:</strong> Help consultees develop their own clinical judgment</p>'
        },
        {
          title: 'Ethical Considerations',
          order: 2,
          type: 'text',
          content: '<h3>Consultation Ethics</h3><p><strong>Competence:</strong> Only consult on topics within your expertise</p><p><strong>Confidentiality:</strong> Treat information shared in consultation confidentially</p><p><strong>Boundaries:</strong> Don\'t slide into supervision or dual roles</p><p><strong>Documentation:</strong> Keep records of consultations you provide</p><h3>When Consultees Don\'t Follow Advice</h3><p>The consultee has the right to accept, modify, or reject your recommendations. Your role is to inform, not dictate.</p>'
        }
      ],
      quiz: {
        title: 'Module 3 Knowledge Check',
        questions: [
          { question: 'When providing consultation, you should:', options: [{ text: 'Dictate what the consultee must do', isCorrect: false }, { text: 'Ask before telling and promote autonomy', isCorrect: true }, { text: 'Take over the case', isCorrect: false }, { text: 'Avoid sharing any expertise', isCorrect: false }], explanation: 'Good consultation promotes consultee growth and autonomy.' },
          { question: 'If a consultee doesn\'t follow your advice:', options: [{ text: 'Report them to their board', isCorrect: false }, { text: 'They have the right to make their own decision', isCorrect: true }, { text: 'Refuse future consultations', isCorrect: false }, { text: 'Contact the client directly', isCorrect: false }], explanation: 'Consultees retain decision-making authority.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'The Art of Referral',
      order: 4,
      lessons: [
        {
          title: 'When to Refer',
          order: 1,
          type: 'text',
          content: '<h3>Referral Indicators</h3><p><strong>Scope of competence:</strong> Client needs services outside your expertise</p><p><strong>Scope of practice:</strong> Client needs services you can\'t legally provide</p><p><strong>Poor fit:</strong> The match isn\'t working despite efforts</p><p><strong>Level of care:</strong> Client needs more intensive services</p><p><strong>Practical limitations:</strong> Geography, insurance, availability</p>'
        },
        {
          title: 'Making Effective Referrals',
          order: 2,
          type: 'text',
          content: '<h3>The Warm Handoff</h3><p>Research shows that warm handoffs—directly facilitating connection with the new provider—dramatically improve follow-through compared to just giving a phone number.</p><p><strong>Steps:</strong></p><p>1. Research appropriate referral options</p><p>2. Discuss the referral openly with the client</p><p>3. Offer to help make the connection</p><p>4. With permission, contact the new provider</p><p>5. Follow up to ensure connection happened</p><h3>Handling Client Reactions</h3><p>Clients may feel rejected, abandoned, or ashamed when referred. Address these feelings directly: "I want to be clear—this isn\'t about me giving up on you. It\'s about getting you the best help possible."</p>'
        }
      ],
      quiz: {
        title: 'Module 4 Knowledge Check',
        questions: [
          { question: 'A warm handoff involves:', options: [{ text: 'Just giving a phone number', isCorrect: false }, { text: 'Directly facilitating connection with the new provider', isCorrect: true }, { text: 'Ending all contact immediately', isCorrect: false }, { text: 'Refusing to make referrals', isCorrect: false }], explanation: 'Warm handoffs improve follow-through significantly.' },
          { question: 'When a client feels rejected by a referral:', options: [{ text: 'Ignore the feeling', isCorrect: false }, { text: 'Address it directly and clarify intentions', isCorrect: true }, { text: 'Cancel the referral', isCorrect: false }, { text: 'Avoid discussing it', isCorrect: false }], explanation: 'Addressing feelings supports successful transitions.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Coordinating Care',
      order: 5,
      lessons: [
        {
          title: 'Why Coordination Matters',
          order: 1,
          type: 'text',
          content: '<h3>The Cost of Fragmentation</h3><p>Without coordination:</p><p>• Providers work at cross purposes</p><p>• Important information isn\'t shared</p><p>• Clients fall through cracks</p><p>• Recommendations conflict</p><p>• Treatment is less effective</p><h3>Your Coordination Role</h3><p>As the therapist, you may see the client most frequently. You\'re well-positioned to serve as a coordinator—reaching out to other providers, integrating information, ensuring coherent care.</p>'
        },
        {
          title: 'Practical Coordination',
          order: 2,
          type: 'text',
          content: '<h3>Building Coordination Infrastructure</h3><p><strong>Releases:</strong> Obtain appropriate releases at intake for likely coordination needs</p><p><strong>Relationships:</strong> Build relationships with providers you commonly coordinate with</p><p><strong>Communication:</strong> Establish regular communication patterns, not just crisis contact</p><p><strong>Documentation:</strong> Document all coordination activities</p><h3>When Providers Disagree</h3><p>Focus on client welfare. Seek to understand the other provider\'s perspective. Communicate directly rather than through the client. Find common ground where possible.</p>'
        }
      ],
      quiz: {
        title: 'Module 5 Knowledge Check',
        questions: [
          { question: 'Without care coordination:', options: [{ text: 'Treatment improves', isCorrect: false }, { text: 'Providers work at cross purposes and clients fall through cracks', isCorrect: true }, { text: 'Clients prefer it', isCorrect: false }, { text: 'Nothing changes', isCorrect: false }], explanation: 'Fragmented care leads to poorer outcomes.' },
          { question: 'When providers disagree, you should:', options: [{ text: 'Communicate through the client', isCorrect: false }, { text: 'Focus on client welfare and communicate directly', isCorrect: true }, { text: 'Ignore the disagreement', isCorrect: false }, { text: 'Terminate the client', isCorrect: false }], explanation: 'Direct communication focused on client welfare is most effective.' }
        ],
        passingScore: 0.80
      }
    },
    {
      title: 'Interdisciplinary Collaboration',
      order: 6,
      lessons: [
        {
          title: 'Understanding Other Disciplines',
          order: 1,
          type: 'text',
          content: '<h3>Common Collaborators</h3><p><strong>Psychiatrists:</strong> Medication management, diagnostic clarification</p><p><strong>Primary care:</strong> Medical issues, medication, referral source</p><p><strong>Social workers:</strong> Case management, systems navigation</p><p><strong>Psychologists:</strong> Testing, specialized treatment</p><h3>Respecting Scope</h3><p>Each discipline has unique training and scope of practice. Effective collaboration means understanding what each brings and respecting boundaries.</p>'
        },
        {
          title: 'Working on Teams',
          order: 2,
          type: 'text',
          content: '<h3>Team Participation Skills</h3><p><strong>Prepare:</strong> Know the cases being discussed and your contribution</p><p><strong>Communicate clearly:</strong> Adapt your language to your audience</p><p><strong>Listen actively:</strong> Other perspectives inform your work</p><p><strong>Advocate appropriately:</strong> Represent your perspective while remaining collaborative</p><p><strong>Follow through:</strong> Do what you commit to do</p><h3>Managing Interprofessional Conflict</h3><p>Conflicts happen. Address them directly and professionally. Focus on client welfare, not winning.</p>'
        }
      ],
      quiz: {
        title: 'Module 6 Knowledge Check',
        questions: [
          { question: 'Effective team participation requires:', options: [{ text: 'Dominating discussions', isCorrect: false }, { text: 'Preparation, clear communication, and following through', isCorrect: true }, { text: 'Avoiding all disagreement', isCorrect: false }, { text: 'Deferring to all other disciplines', isCorrect: false }], explanation: 'Active, prepared participation strengthens team functioning.' },
          { question: 'When interprofessional conflict occurs:', options: [{ text: 'Avoid it entirely', isCorrect: false }, { text: 'Address it directly with focus on client welfare', isCorrect: true }, { text: 'Always defer to physicians', isCorrect: false }, { text: 'Refuse further collaboration', isCorrect: false }], explanation: 'Direct, professional conflict resolution serves clients best.' }
        ],
        passingScore: 0.80
      }
    }
  ],
  assessment: {
    passThreshold: 0.80,
    questions: [
      { question: 'In consultation, who retains responsibility for clinical decisions?', options: [{ text: 'The consultant', isCorrect: false }, { text: 'The consultee', isCorrect: true }, { text: 'Both equally', isCorrect: false }, { text: 'The client', isCorrect: false }], explanation: 'Consultees retain full responsibility.' },
      { question: 'The key difference between consultation and supervision is:', options: [{ text: 'Supervision is voluntary', isCorrect: false }, { text: 'In consultation, the consultee retains autonomy', isCorrect: true }, { text: 'Consultation involves evaluation', isCorrect: false }, { text: 'No difference exists', isCorrect: false }], explanation: 'Consultation preserves consultee decision-making.' },
      { question: 'The ACA Code requires consultation when:', options: [{ text: 'Only for new counselors', isCorrect: false }, { text: 'When you have questions about ethics or practice', isCorrect: true }, { text: 'Never', isCorrect: false }, { text: 'Only in emergencies', isCorrect: false }], explanation: 'ACA requires consultation for ethical and professional questions.' },
      { question: 'Effective consultation preparation includes:', options: [{ text: 'Avoiding any preparation', isCorrect: false }, { text: 'Clarifying your specific question', isCorrect: true }, { text: 'Sharing every possible detail', isCorrect: false }, { text: 'Letting the consultant lead entirely', isCorrect: false }], explanation: 'Clear questions yield useful consultation.' },
      { question: 'When providing consultation, you should:', options: [{ text: 'Dictate solutions', isCorrect: false }, { text: 'Ask before telling and promote autonomy', isCorrect: true }, { text: 'Take over the case', isCorrect: false }, { text: 'Avoid sharing expertise', isCorrect: false }], explanation: 'Good consultation builds consultee capacity.' },
      { question: 'If a consultee doesn\'t follow your advice:', options: [{ text: 'Report them', isCorrect: false }, { text: 'They have the right to decide', isCorrect: true }, { text: 'Refuse future consultations', isCorrect: false }, { text: 'Contact the client', isCorrect: false }], explanation: 'Consultees retain decision-making authority.' },
      { question: 'Referral is indicated when:', options: [{ text: 'You like the client', isCorrect: false }, { text: 'Client needs services outside your scope', isCorrect: true }, { text: 'You want more clients', isCorrect: false }, { text: 'Insurance requires it', isCorrect: false }], explanation: 'Referral addresses scope and fit issues.' },
      { question: 'A warm handoff involves:', options: [{ text: 'Just giving a phone number', isCorrect: false }, { text: 'Directly facilitating the connection', isCorrect: true }, { text: 'Immediate termination', isCorrect: false }, { text: 'Avoiding all follow-up', isCorrect: false }], explanation: 'Warm handoffs improve follow-through.' },
      { question: 'When a client feels rejected by referral:', options: [{ text: 'Ignore the feeling', isCorrect: false }, { text: 'Address it directly', isCorrect: true }, { text: 'Cancel the referral', isCorrect: false }, { text: 'Avoid the topic', isCorrect: false }], explanation: 'Addressing feelings supports transitions.' },
      { question: 'Without care coordination:', options: [{ text: 'Treatment improves', isCorrect: false }, { text: 'Clients fall through cracks', isCorrect: true }, { text: 'Nothing changes', isCorrect: false }, { text: 'Providers work better', isCorrect: false }], explanation: 'Fragmentation harms client care.' },
      { question: 'When providers disagree:', options: [{ text: 'Communicate through the client', isCorrect: false }, { text: 'Communicate directly focusing on client welfare', isCorrect: true }, { text: 'Ignore it', isCorrect: false }, { text: 'Terminate the client', isCorrect: false }], explanation: 'Direct communication serves clients best.' },
      { question: 'Effective team participation requires:', options: [{ text: 'Dominating discussions', isCorrect: false }, { text: 'Preparation and follow-through', isCorrect: true }, { text: 'Complete deference', isCorrect: false }, { text: 'Avoiding all input', isCorrect: false }], explanation: 'Active participation strengthens teams.' },
      { question: 'Consultation is typically:', options: [{ text: 'Mandatory and evaluative', isCorrect: false }, { text: 'Voluntary and non-evaluative', isCorrect: true }, { text: 'Hierarchical', isCorrect: false }, { text: 'Permanent', isCorrect: false }], explanation: 'Consultation differs from supervision in these ways.' },
      { question: 'High-risk situations warrant consultation because:', options: [{ text: 'It reduces liability', isCorrect: false }, { text: 'Multiple perspectives improve decision-making', isCorrect: true }, { text: 'It\'s always required by law', isCorrect: false }, { text: 'Clients expect it', isCorrect: false }], explanation: 'Consultation strengthens clinical decision-making in high-stakes situations.' },
      { question: 'When presenting a case for consultation:', options: [{ text: 'Share every detail', isCorrect: false }, { text: 'Be concise and focus on your question', isCorrect: true }, { text: 'Let the consultant guess', isCorrect: false }, { text: 'Avoid sharing your own thinking', isCorrect: false }], explanation: 'Focused presentations yield useful consultation.' },
      { question: 'Referrals should be discussed:', options: [{ text: 'Never with the client', isCorrect: false }, { text: 'Openly with the client', isCorrect: true }, { text: 'Only with the new provider', isCorrect: false }, { text: 'After they occur', isCorrect: false }], explanation: 'Open discussion supports successful transitions.' },
      { question: 'Building coordination infrastructure includes:', options: [{ text: 'Avoiding all releases', isCorrect: false }, { text: 'Obtaining releases and building relationships', isCorrect: true }, { text: 'Working in isolation', isCorrect: false }, { text: 'Communicating only in crisis', isCorrect: false }], explanation: 'Infrastructure enables smooth coordination.' },
      { question: 'Each professional discipline brings:', options: [{ text: 'Identical perspectives', isCorrect: false }, { text: 'Unique training and scope', isCorrect: true }, { text: 'Competing agendas', isCorrect: false }, { text: 'Nothing unique', isCorrect: false }], explanation: 'Disciplines offer complementary perspectives.' },
      { question: 'Interprofessional conflict should be:', options: [{ text: 'Avoided entirely', isCorrect: false }, { text: 'Addressed directly and professionally', isCorrect: true }, { text: 'Escalated immediately', isCorrect: false }, { text: 'Hidden from clients', isCorrect: false }], explanation: 'Direct resolution serves client welfare.' },
      { question: 'The therapist\'s coordination role often includes:', options: [{ text: 'Avoiding other providers', isCorrect: false }, { text: 'Serving as a hub of communication', isCorrect: true }, { text: 'Competing with other providers', isCorrect: false }, { text: 'Deferring all decisions', isCorrect: false }], explanation: 'Therapists often coordinate due to frequent contact.' }
    ]
  },
  references: [
    'American Counseling Association. (2014). ACA Code of Ethics. Alexandria, VA: Author.',
    'Barnett, J. E., & Johnson, W. B. (2015). Ethics desk reference for counselors (2nd ed.). American Counseling Association.',
    'Caplan, G. (1970). The theory and practice of mental health consultation. Basic Books.',
    'Thomas, J. T. (2014). Ethics of supervision and consultation. American Psychological Association.'
  ]
};

// ═══════════════════════════════════════════════════════════════════
// ALL COURSES ARRAY
// ═══════════════════════════════════════════════════════════════════

const COURSES = [ELEPHANT_COURSE, EGGSHELLS_COURSE, RAINS_COURSE, VILLAGE_COURSE];

// ═══════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════

async function upsertCourse(db, courseData) {
  const collection = db.collection('courses');
  
  let existing = await collection.findOne({ slug: courseData.slug });
  if (!existing) {
    existing = await collection.findOne({ title: courseData.title });
  }

  const baseData = {
    ...courseData,
    isPublished: false,
    status: 'draft',
    acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' },
    presenter: { 
      name: 'CounselorReady', 
      credentials: 'NBCC ACEP #7760',
      qualificationStatement: 'Content developed by licensed mental health professionals.'
    },
    updatedAt: new Date()
  };

  if (existing) {
    await collection.updateOne({ _id: existing._id }, { $set: baseData });
    return { action: 'updated', title: courseData.title, id: existing._id };
  } else {
    baseData.createdAt = new Date();
    baseData.enrollmentCount = 0;
    baseData.analytics = { views: 0, completions: 0 };
    const result = await collection.insertOne(baseData);
    return { action: 'created', title: courseData.title, id: result.insertedId };
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🎬 CounselorReady Movie Course Seeder - FULL VERSION      ║
║                                                              ║
║   4 Courses × 3 CE Hours = 12 Total CE Hours                ║
║                                                              ║
║   1. Elephant in the Room (Difficult Conversations)         ║
║   2. Walking on Eggshells (High-Conflict Clients)           ║
║   3. When It Rains, It Pours (Complex Presentations)        ║
║   4. It Takes a Village (Collaborative Care)                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('  ❌ MONGODB_URI not set\n');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('  ✅ Connected to MongoDB\n');
  const db = mongoose.connection.db;

  const results = [];

  for (const course of COURSES) {
    console.log(`  📄 Processing: ${course.title}`);
    console.log(`     CE Hours: ${course.ceHours}`);
    console.log(`     Modules: ${course.modules.length}`);
    console.log(`     Assessment Questions: ${course.assessment.questions.length}`);
    
    try {
      const result = await upsertCourse(db, course);
      results.push(result);
      console.log(`     ➡️  ${result.action.toUpperCase()} (${result.id})\n`);
    } catch (err) {
      console.error(`     ❌ ERROR: ${err.message}\n`);
      results.push({ action: 'error', title: course.title, error: err.message });
    }
  }

  // Summary
  console.log('  ' + '═'.repeat(60));
  console.log('  SUMMARY');
  console.log('  ' + '═'.repeat(60));
  
  const created = results.filter(r => r.action === 'created').length;
  const updated = results.filter(r => r.action === 'updated').length;
  const errors = results.filter(r => r.action === 'error').length;
  
  console.log(`  Created: ${created} | Updated: ${updated} | Errors: ${errors}`);
  console.log('');
  
  results.forEach(r => {
    const icon = r.action === 'created' ? '🆕' : r.action === 'updated' ? '📝' : '❌';
    console.log(`  ${icon} ${r.action}: ${r.title}`);
  });

  console.log(`
  ✅ Done! Courses saved as drafts.
  
  Next steps:
  1. Review in admin dashboard
  2. Verify content and quizzes
  3. Publish when ready
`);

  await mongoose.disconnect();
}

main().catch(e => {
  console.error('💥 Fatal Error:', e.message);
  process.exit(1);
});
