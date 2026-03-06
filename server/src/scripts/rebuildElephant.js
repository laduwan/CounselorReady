/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from "mongoose";

// ── CONFIG ──────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!MONGODB_URI) { console.error("No MONGODB_URI"); process.exit(1); }
if (!ANTHROPIC_API_KEY) { console.error("No ANTHROPIC_API_KEY"); process.exit(1); }

const COURSE_SLUG = "the-elephant-in-the-room-navigating-difficult-conversations-in-therapy";
const MODEL = "claude-sonnet-4-5-20250929";
const MAX_TOKENS = 16000;

// ── SOURCE CONTENT (from elephant.pdf) ──────────────────────────────
// This is the foundation the API will expand upon
const SOURCE_MODULES = [
  {
    title: "Introduction: Naming the Elephant",
    sourceContent: `Welcome to "The Elephant in the Room: Mastering Difficult Conversations in Therapy." The expression "elephant in the room" captures those obvious issues that everyone recognizes but nobody addresses. In therapy, elephants are everywhere: The client who consistently arrives late but hasn't been called on it. The therapeutic alliance that feels strained but hasn't been discussed. The cultural difference between therapist and client that affects the work but remains unspoken. The treatment that isn't working but continues without examination. The client's hygiene that's become a barrier to connection. Why do we avoid these conversations? Because they're uncomfortable. Because we fear damaging the relationship. Because we're not sure how to begin. Because we tell ourselves it's not that important or will resolve on its own. But avoidance has costs. The elephant grows larger. The client senses our inauthenticity. Important issues go unaddressed. Treatment effectiveness suffers. And the client misses an opportunity to experience a relationship where truth can be spoken with care.`,
    targetWords: 1800,
    isIntro: true
  },
  {
    title: "Understanding Avoidance",
    sourceContent: `Common elephants in therapy include: Treatment-interfering behaviors (chronic lateness, missed appointments, not completing homework, showing up intoxicated, payment problems), Therapeutic relationship issues (alliance strain, client anger at therapist, therapist frustration with client, attraction in either direction, cultural disconnection), Treatment effectiveness (lack of progress, deterioration, wrong diagnosis or approach, referral needs), Sensitive client issues (hygiene problems, weight-related concerns, substance use the client minimizes, infidelity or secrets), Therapist limitations (countertransference struggles, competence boundaries, personal issues affecting work), Identity and power (racial differences, cultural misunderstandings, socioeconomic disparities, privilege dynamics). Several factors drive avoidance: Discomfort with conflict, Fear of damaging the relationship, Uncertainty about how to proceed, Telling ourselves stories ("It's not that important," "It will resolve on its own"), Countertransference, Concern about power. Avoidance costs include: Treatment suffers, The elephant grows, Modeling avoidance, Inauthenticity, Missed opportunity for corrective emotional experience, Therapist resentment. Benefits of addressing: Treatment improves, Relationship deepens, Modeling courage, Authenticity increases, Client growth.`,
    targetWords: 3200,
    knowledgeCheckCount: 3,
    matchingExercise: true,
    accordionContent: "case examples of common elephants in therapy"
  },
  {
    title: "A Framework for Difficult Conversations",
    sourceContent: `The COMPASS Framework: C - Center yourself (notice anxiety, ground yourself, clarify intention), O - Open with care (acknowledge relationship, frame in terms of service), M - Make observations (share without judgment, describe behaviorally), P - Pause and listen (create space, listen deeply without defending), A - Align on understanding (work toward shared understanding, seek client's perspective), S - Strategize together (collaboratively develop way forward), S - Strengthen connection (reinforce relationship, acknowledge willingness). Preparation includes: Clarify intention, Examine motivation, Anticipate responses, Choose timing, Prepare language. Opening language matters enormously. Poor: "We need to talk about your lateness problem." Better: "I've been thinking about how to bring something up that I care about." Effective openings signal importance without alarm, frame as collaborative, establish caring intention, seek permission.`,
    targetWords: 3200,
    knowledgeCheckCount: 3,
    matchingExercise: true,
    accordionContent: "COMPASS framework steps with clinical examples"
  },
  {
    title: "Addressing Treatment-Interfering Behaviors",
    sourceContent: `DBT concept of therapy-interfering behaviors: Missing or arriving late, Not paying fees, Not completing homework, Showing up intoxicated, Threatening behavior, Excessive crisis calls, Not honestly reporting, Terminating prematurely. Failing to address these: Allows undermining patterns to continue, Misses opportunity for in vivo interpersonal work, Can lead to therapist resentment, Models that boundaries aren't important, May enable dysfunction. Key stance: curious compassion rather than judgment. "What's getting in the way of you getting what you need from treatment?" Behavior is communication. Specific language examples for: chronic lateness, missed appointments, homework non-completion, payment problems. Following through requires: Clear agreements, Follow-up, Willingness to address again, Natural consequences.`,
    targetWords: 3200,
    knowledgeCheckCount: 3,
    reflectionPrompt: true,
    accordionContent: "specific language scripts for different treatment-interfering behaviors"
  },
  {
    title: "Conversations About Progress and Termination",
    sourceContent: `Signs progress isn't occurring: Symptoms not improving on standardized measures, Same issues repeating, Client reporting no change, Therapist feeling stuck. Opening the conversation about lack of progress: "I want to check in about how you feel our work is going. From my perspective, I've been noticing that despite our efforts, things don't seem to be shifting the way I'd hoped. What's your sense?" Explore together: Is diagnosis accurate? Is treatment approach right? Are there barriers unaddressed? Does client need something different? Discussing termination types: Mutual termination, Therapist-initiated termination, Client avoidance of termination, Premature termination. For therapist-initiated: "I don't think I'm the right therapist for what you need..." Requires: Clear explanation, Care for response, Appropriate referrals, Transition support, Leaving door open. When client wants premature termination: "I want to respect your decision. And I want to share my honest perspective that I'm concerned about ending now."`,
    targetWords: 3200,
    knowledgeCheckCount: 3,
    reflectionPrompt: true,
    accordionContent: "case scenarios for progress conversations and termination discussions"
  },
  {
    title: "Navigating Culture, Identity, and Power",
    sourceContent: `Elephants of difference: Racial differences, Cultural disconnection, Socioeconomic disparities, Gender/sexuality/religion differences, Privilege dynamics, Microaggressions. Cultural humility framework: Lifelong learning, Self-reflection, Power awareness, Institutional accountability, Openness to being taught. Opening conversations about difference - examples for naming racial difference, acknowledging limits of understanding, checking cultural fit, naming privilege, inviting feedback. Responding to cultural missteps: Don't become defensive, Listen fully, Thank for feedback, Acknowledge impact, Commit to doing better, Follow through. "Thank you for telling me that. I can hear that what I said landed as minimizing your experience. That wasn't my intent, but intent doesn't erase impact." Addressing power dynamics: "I'm aware that in this relationship, I have certain kinds of power. I want us to think together about how that power shows up."`,
    targetWords: 3200,
    knowledgeCheckCount: 3,
    matchingExercise: true,
    accordionContent: "language scripts for navigating cultural conversations"
  },
  {
    title: "Repairing Ruptures",
    sourceContent: `Ruptures: moments of tension, breach, or disconnection. Range from subtle to dramatic. Normal and inevitable. Safran and Muran's two types: Withdrawal ruptures (client becomes distant, compliant, disengaged) and Confrontation ruptures (client expresses dissatisfaction directly). Withdrawal ruptures easier to miss. Signs of rupture: Shift in engagement/affect, Sudden compliance, Indirect dissatisfaction, Challenges to therapist, Your own sense something shifted. Trust your gut. Repair process: Noticing and naming ("I'm sensing something shifted"), Creating space for exploration, Listening non-defensively, Acknowledging your part, Exploring deeper meaning, Working toward repair. Language examples for rupture repair. Why repair matters: Clients experience conflict doesn't destroy relationship, Clients feel heard in conflict, Alliance strengthened, Healthier relational patterns internalized, Treatment outcomes improve. Research shows rupture-repair episodes predict positive outcomes.`,
    targetWords: 3200,
    knowledgeCheckCount: 3,
    reflectionPrompt: true,
    accordionContent: "withdrawal vs confrontation rupture examples with repair strategies"
  }
];

// ── REFERENCES (from PDF bibliography) ──────────────────────────────
const REFERENCES = [
  { title: "A review of therapist characteristics and techniques negatively impacting the therapeutic alliance", author: "Ackerman, S. J., & Hilsenroth, M. J.", year: 2001, source: "Psychotherapy, 38(2), 171-185" },
  { title: "Alliance rupture repair", author: "Eubanks, C. F., Muran, J. C., & Safran, J. D.", year: 2018, source: "Psychotherapy, 55(4), 450-459" },
  { title: "Addressing cultural complexities in practice: Assessment, diagnosis, and therapy (3rd ed.)", author: "Hays, P. A.", year: 2016, source: "American Psychological Association" },
  { title: "Cultural humility: Measuring openness to culturally diverse clients", author: "Hook, J. N., Davis, D. E., Owen, J., Worthington, E. L., & Utsey, S. O.", year: 2013, source: "Journal of Counseling Psychology, 60(3), 353-366" },
  { title: "Addressing microaggressions in racially charged patient-provider interactions", author: "Kanter, J. W., Rosen, D. C., Manbeck, K. E., et al.", year: 2020, source: "BMC Medical Education, 20, Article 88" },
  { title: "DBT skills training manual (2nd ed.)", author: "Linehan, M. M.", year: 2015, source: "Guilford Press" },
  { title: "Crucial conversations: Tools for talking when stakes are high (2nd ed.)", author: "Patterson, K., Grenny, J., McMillan, R., & Switzler, A.", year: 2012, source: "McGraw-Hill" },
  { title: "Negotiating the therapeutic alliance: A relational treatment guide", author: "Safran, J. D., & Muran, J. C.", year: 2000, source: "Guilford Press" },
  { title: "Repairing alliance ruptures", author: "Safran, J. D., Muran, J. C., & Eubanks-Carter, C.", year: 2011, source: "Psychotherapy, 48(1), 80-87" },
  { title: "Difficult conversations: How to discuss what matters most", author: "Stone, D., Patton, B., & Heen, S.", year: 2010, source: "Penguin Books" },
  { title: "Microaggressions in everyday life: Race, gender, and sexual orientation", author: "Sue, D. W.", year: 2010, source: "John Wiley & Sons" },
  { title: "Counseling the culturally diverse: Theory and practice (7th ed.)", author: "Sue, D. W., & Sue, D.", year: 2016, source: "John Wiley & Sons" },
  { title: "Cultural humility versus cultural competence", author: "Tervalon, M., & Murray-García, J.", year: 1998, source: "Journal of Health Care for the Poor and Underserved, 9(2), 117-125" },
  { title: "Therapeutic communication: Knowing what to say when (2nd ed.)", author: "Wachtel, P. L.", year: 2011, source: "Guilford Press" },
  { title: "One size does not fit all: Examining heterogeneity and identifying moderators", author: "Zilcha-Mano, S., & Errázuriz, P.", year: 2015, source: "Journal of Counseling Psychology, 62(4), 579-591" }
];

// ── EXAM QUESTIONS (from PDF, reformatted for schema) ───────────────
const FINAL_EXAM = {
  questions: [
    { question: "According to the course, 'elephants in the room' in therapy refer to:", type: "multiple_choice", options: ["Decorative elements in the therapy office", "Obvious issues that everyone recognizes but nobody addresses", "Symbolic representations in client dreams", "Large emotional reactions"], correctAnswer: 1, explanation: "Elephants in the room are obvious issues that everyone recognizes but nobody addresses." },
    { question: "Which is NOT a common reason therapists avoid difficult conversations?", type: "multiple_choice", options: ["Fear of damaging the therapeutic relationship", "Uncertainty about how to proceed", "Excessive confidence in their confrontation skills", "Countertransference making certain topics uncomfortable"], correctAnswer: 2, explanation: "Excessive confidence is not a common reason for avoidance; most therapists avoid because of discomfort and uncertainty." },
    { question: "In the COMPASS framework, what does the 'C' represent?", type: "multiple_choice", options: ["Confront the client directly", "Center yourself before the conversation", "Criticize behavior immediately", "Close the session early"], correctAnswer: 1, explanation: "C stands for Center yourself—noticing your anxiety, grounding yourself, and clarifying your intention." },
    { question: "According to the course, when clients sense therapist avoidance:", type: "multiple_choice", options: ["They appreciate the therapist's sensitivity", "Trust may erode due to inauthenticity", "Treatment outcomes improve", "The therapeutic alliance strengthens"], correctAnswer: 1, explanation: "When clients sense avoidance, trust erodes because they perceive inauthenticity in the relationship." },
    { question: "Treatment-interfering behaviors include all EXCEPT:", type: "multiple_choice", options: ["Missing sessions", "Not completing homework", "Active engagement in treatment", "Showing up intoxicated"], correctAnswer: 2, explanation: "Active engagement is the opposite of treatment-interfering behavior." },
    { question: "The recommended stance for addressing treatment-interfering behaviors is:", type: "multiple_choice", options: ["Judgmental confrontation", "Curious compassion", "Ignoring the behavior until it stops", "Immediate termination"], correctAnswer: 1, explanation: "Curious compassion approaches behavior as communication rather than defiance." },
    { question: "Which opening is MOST effective for a difficult conversation?", type: "multiple_choice", options: ["'We need to talk about your problem.'", "'I've noticed something I'd like to understand better. Is this a good time to discuss something that might be uncomfortable?'", "'You're doing something wrong.'", "'Other clients don't have this issue.'"], correctAnswer: 1, explanation: "This opening signals importance, frames collaboratively, and seeks permission." },
    { question: "When addressing lack of treatment progress, the therapist should:", type: "multiple_choice", options: ["Blame the client for not trying hard enough", "Avoid the topic to prevent discouragement", "Open dialogue about what's not working and explore alternatives together", "Continue the same approach indefinitely"], correctAnswer: 2, explanation: "Opening collaborative dialogue allows both parties to explore what's not working." },
    { question: "Cultural humility involves all EXCEPT:", type: "multiple_choice", options: ["Lifelong learning about cultural differences", "Self-reflection on one's own biases", "Claiming expertise in all cultures", "Recognizing power imbalances"], correctAnswer: 2, explanation: "Claiming cultural expertise contradicts the humble, learning-oriented stance of cultural humility." },
    { question: "When a client provides feedback about a cultural misstep, the therapist should:", type: "multiple_choice", options: ["Defend their intentions immediately", "Listen non-defensively, acknowledge impact, and commit to doing better", "Explain why the client misunderstood", "Change the subject"], correctAnswer: 1, explanation: "Non-defensive listening, acknowledging impact, and committing to change models healthy repair." },
    { question: "According to Safran and Muran, withdrawal ruptures involve:", type: "multiple_choice", options: ["The client becoming hostile and confrontational", "The client becoming distant, compliant, or disengaged", "The therapist ending treatment abruptly", "Physical violence"], correctAnswer: 1, explanation: "Withdrawal ruptures are characterized by the client becoming distant, overly compliant, or disengaged." },
    { question: "The rupture-repair sequence is therapeutically valuable because:", type: "multiple_choice", options: ["It shows clients that relationships cannot survive conflict", "It demonstrates that conflict doesn't destroy relationship and alliance can strengthen", "It proves the therapist is always right", "It ends treatment faster"], correctAnswer: 1, explanation: "Successful rupture-repair teaches clients that relationships can survive and grow through conflict." },
    { question: "Which statement about addressing elephants is TRUE?", type: "multiple_choice", options: ["Clients are usually unaware of the issues therapists avoid", "The elephant is always visible to the client too", "Avoidance has no impact on treatment", "Only experienced therapists should attempt difficult conversations"], correctAnswer: 1, explanation: "Clients typically sense what therapists are avoiding; naming it usually creates relief." },
    { question: "Treatment-interfering behaviors should be understood as:", type: "multiple_choice", options: ["Deliberate attempts to sabotage therapy", "Communication that may reveal important patterns", "Character flaws requiring punishment", "Reasons for immediate termination"], correctAnswer: 1, explanation: "Viewing behavior as communication opens productive exploration of underlying patterns." },
    { question: "When initiating difficult conversations about progress, the therapist should:", type: "multiple_choice", options: ["Present conclusions without seeking client perspective", "Wait until the client brings it up", "Open dialogue and collaboratively explore what's happening", "Immediately recommend termination"], correctAnswer: 2, explanation: "Collaborative exploration respects the client's perspective and promotes shared understanding." },
    { question: "In the COMPASS framework, 'Pause and listen' follows:", type: "multiple_choice", options: ["Strengthening connection", "Making observations", "Aligning on understanding", "Strategizing together"], correctAnswer: 1, explanation: "After making observations (M), the next step is to pause and listen (P) for the client's response." },
    { question: "Regarding therapist discomfort with difficult conversations:", type: "multiple_choice", options: ["Discomfort should always be avoided", "Discomfort often signals something important needs attention", "Only uncomfortable therapists should address difficult topics", "Discomfort indicates the conversation shouldn't happen"], correctAnswer: 1, explanation: "Discomfort is often a signal that something important needs to be addressed." },
    { question: "According to the course, surviving difficult conversations in therapy:", type: "multiple_choice", options: ["Weakens the therapeutic alliance", "Can strengthen alliance and provide corrective emotional experience", "Should be avoided whenever possible", "Always leads to termination"], correctAnswer: 1, explanation: "Successfully navigating difficult conversations often strengthens the therapeutic relationship." },
    { question: "The course recommends building skill in difficult conversations by:", type: "multiple_choice", options: ["Avoiding all uncomfortable topics", "Starting with smaller elephants and building capacity", "Only addressing major crises", "Reading about conversations without practicing"], correctAnswer: 1, explanation: "Starting with smaller challenges and building capacity is the recommended approach." },
    { question: "When discussing power dynamics in therapy, therapists should:", type: "multiple_choice", options: ["Pretend power differences don't exist", "Use power to control the client", "Name power dynamics and navigate them in service of the client", "Avoid the topic entirely"], correctAnswer: 2, explanation: "Naming and navigating power dynamics transparently serves the therapeutic relationship." }
  ],
  passingScore: 80,
  maxAttempts: 3
};

// ── API CALL HELPER ─────────────────────────────────────────────────
async function callClaude(systemPrompt, userPrompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API ${res.status}: ${errText}`);
      }
      
      const data = await res.json();
      const text = data.content.map(c => c.text || "").join("");
      
      // Log token usage
      console.log(`    Tokens: ${data.usage?.input_tokens || '?'} in / ${data.usage?.output_tokens || '?'} out`);
      
      return text;
    } catch (err) {
      console.error(`    Attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// ── SECTION BUILDER PROMPT ──────────────────────────────────────────
const SYSTEM_PROMPT = `You are writing a continuing education course for CounselorReady, an NBCC-approved CE platform for licensed mental health professionals. Your output must be a valid JSON array of contentBlocks.

VOICE AND NARRATIVE FLOW — THIS IS THE MOST IMPORTANT INSTRUCTION:
You are writing ONE continuous narrative, not assembling separate pieces. The course should read like a single expert presenter speaking directly to the learner, building ideas across the entire course. Specifically:

1. CONTINUITY: Every section opens by connecting to what came before. Use phrases like "Now that we've explored...", "With that understanding in place...", "This brings us to a critical next question..." Never start a section cold as if nothing preceded it.

2. FORWARD REFERENCES: Tease upcoming content naturally. "We'll return to exactly how to navigate this in Section 5." "The framework you'll learn in the next section gives you language for this." This creates momentum and makes the learner feel guided.

3. VOICE — AUTHORITATIVE AND SUPPORTIVE: Write as a respected expert instructor delivering graduate-level professional development. The tone blends:
   - AUTHORITATIVE: Present information with scholarly confidence. State findings definitively. Use precise clinical language. Reference research as evidence, not decoration. Write like someone who has trained hundreds of clinicians and knows exactly what they need to hear.
   - SUPPORTIVE: Acknowledge the real challenges clinicians face. Normalize difficulty without excusing avoidance. Frame growth as achievable. Use "you" to speak directly to the learner, but as a mentor guiding professional development — not a peer chatting over coffee.
   - OBJECTIVE: Present concepts with clinical precision. Avoid cheerleading, motivational-speaker energy, or overly conversational asides. Let the evidence and clinical reasoning speak. When you make a strong claim, ground it in research or observable clinical reality.
   THE WRONG TONE: "Here's the thing — we've all been there, right?" or "Let's be real for a sec..."
   THE RIGHT TONE: "Research consistently demonstrates that therapist avoidance correlates with poorer outcomes (Safran & Muran, 2000). Understanding the mechanisms behind this pattern is essential for clinical growth."

4. NARRATIVE FLOW INTO INTERACTIVE ELEMENTS: Before every accordion, matching exercise, or reflection, include a brief transitional sentence in the preceding text block that naturally leads into it. Examples:
   - "Let's pause here and look at how this plays out in real clinical situations."
   - "Before we move on, test your grasp of these avoidance patterns."
   - "Turn the lens inward for a moment."
   NEVER just drop an interactive block after a text block with no transition.

5. NARRATIVE FLOW OUT OF INTERACTIVE ELEMENTS: After accordions or exercises, the next text block should reference what the learner just explored. "Those scenarios illustrate something critical..." or "With those patterns in mind, let's examine..."

6. NO REDUNDANCY: Don't restate the section title inside the first text block. Don't repeat learning objectives. Don't begin with "In this section, we will..." — just begin teaching.

7. PROSE OVER LISTS: Default to flowing paragraphs. Use lists only when comparing discrete items (like a table of examples). Never use bullet points where a sentence would work.

8. CLINICAL DEPTH: Write for licensed professionals. Cite research inline (author, year). Include nuanced case examples that feel real, not generic. Every paragraph should teach something the learner can use Monday morning.

BRAND COLORS for HTML styling:
- Burgundy: #6B1D34 — section dividers, alerts, warnings
- Hunter Green: #4A7C59 — key concept callouts, buttons
- Honey/Gold: #D4A855 — heading underlines, clinical example boxes, blockquote borders
- Navy: #284157 — subheadings, tables, body emphasis

CONTENT BLOCK TYPES:
1. "sectionDivider" - { type: "sectionDivider", title: "Section Title", sectionNumber: N }
2. "text" - { type: "text", textContent: "<html content>" }
3. "accordion" - { type: "accordion", accordionTitle: "Title", panels: [{ header: "...", content: "<html>..." }] }
4. "multipleChoice" - { type: "multipleChoice", question: "...", options: [{ text: "...", isCorrect: true/false }], explanation: "..." }
5. "multiSelect" - { type: "multiSelect", question: "...", options: [{ text: "...", isCorrect: true/false }], explanation: "..." }
6. "matching" - { type: "matching", matchingInstructions: "...", matchingPairs: [{ term: "...", definition: "..." }], accessibility: { ariaLabel: "...", role: "application" } }
7. "reflection" - { type: "reflection", reflectionPrompt: "...", reflectionPlaceholder: "Type your response..." }

HTML FORMATTING for text blocks:
- Headings: <h2 style="color:#284157; border-bottom-width:2px; border-bottom-style:solid; border-bottom-color:#D4A855; padding-bottom:8px; margin-top:40px; margin-bottom:18px; font-size:1.5rem; font-weight:700;">
- Subheadings: <h3 style="color:#6B1D34; margin-top: 28px; font-weight: 700;">
- Key concept box: <div style="background: linear-gradient(135deg, rgba(74,124,89,0.08), rgba(74,124,89,0.03)); border-left: 4px solid #4A7C59; padding: 20px 24px; border-radius: 8px; margin: 24px 0;"><span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#4A7C59; display:block; margin-bottom:8px;">💡 Key Concept</span>...</div>
- Clinical warning: <div style="background: rgba(107,29,52,0.06); border-left: 4px solid #6B1D34; padding: 20px 24px; border-radius: 8px; margin: 24px 0;"><span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#6B1D34; display:block; margin-bottom:8px;">⚠️ Watch for This</span>...</div>
- Clinical example: <div style="background: rgba(212,168,85,0.08); border-left: 4px solid #D4A855; padding: 20px 24px; border-radius: 8px; margin: 24px 0;"><span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#96782E; display:block; margin-bottom:8px;">📋 Clinical Example</span>...</div>
- Blockquotes: <blockquote style="border-left: 3px solid #D4A855; padding: 14px 20px; margin: 24px 0; font-style: italic; color: #284157; background: rgba(212,168,85,0.04); border-radius: 0 8px 8px 0;">
- Tables: <table style="width:100%; border-collapse:collapse; margin:24px 0; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);"><thead style="background:#284157; color:#fff;">
- Paragraphs: substantive (4-6 sentences), flowing, with <strong> on key terms at first use

CRITICAL: Return ONLY the JSON array. No markdown fences. No preamble. Start with [ and end with ].`;

// ── BUILD SECTION ───────────────────────────────────────────────────
async function buildSection(module, sectionIndex) {
  console.log(`\n  Building Section ${sectionIndex + 1}: ${module.title}...`);
  
  // Build narrative context so the API knows where it sits in the story
  const prevSection = sectionIndex > 0 ? SOURCE_MODULES[sectionIndex - 1].title : null;
  const nextSection = sectionIndex < SOURCE_MODULES.length - 1 ? SOURCE_MODULES[sectionIndex + 1].title : "the Final Examination";
  
  const SECTION_MAP = SOURCE_MODULES.map((m, i) => `${i+1}. ${m.title}`).join("\n");
  
  let blockRequirements = `Generate a JSON array of contentBlocks for this course section.

FULL COURSE OUTLINE (so you know where this section fits):
${SECTION_MAP}
8. Final Examination

YOU ARE WRITING SECTION ${sectionIndex + 1}: "${module.title}"
${prevSection ? `PREVIOUS SECTION WAS: "${prevSection}" — open by connecting to what was just covered.` : "This is the opening section — set the tone and hook the learner immediately."}
NEXT SECTION WILL BE: "${nextSection}" — end by naturally leading toward that topic.

TARGET WORD COUNT: ${module.targetWords} words minimum across all text blocks and accordion panel content combined.

SOURCE CONTENT (use as your foundation — expand with clinical depth, research citations, case examples, and practical application):
${module.sourceContent}

REQUIRED BLOCKS in this exact order:`;

  // Section divider
  blockRequirements += `\n1. A sectionDivider block with title "${module.title}" and sectionNumber ${sectionIndex + 1}`;
  
  // Main text content
  if (module.isIntro) {
    blockRequirements += `\n2. One or two text blocks (totaling ${module.targetWords}+ words) that welcome the learner, establish the course premise, preview what they'll learn across all sections, and build urgency for why this material matters. Write in a warm, direct voice — like an experienced clinician speaking to a colleague. End by naturally leading into Section 2's topic.`;
  } else {
    blockRequirements += `\n2. Two to three text blocks with professionally formatted HTML. CRITICAL FLOW RULES:
   - The first text block must open by connecting to the previous section (not by restating the section title)
   - The last text block before the accordion should end with a brief transitional sentence leading into the interactive element (e.g., "Let's look at how this plays out in real clinical situations.")
   - After the accordion, the next text block should reference what was just explored (e.g., "Those scenarios illustrate...")
   - Before the matching/reflection, include a brief transition
   - End the final text block by leading toward the next section's topic
   Each text block: 600-1000 words. Use callout boxes, tables, blockquotes — but embedded naturally in flowing prose, not as standalone widgets.`;
  }

  // Accordion (not for intro)
  if (module.accordionContent) {
    blockRequirements += `\n3. An accordion block with 3-4 panels containing ${module.accordionContent}. Each panel: 150-250 words. Give each panel a character name and scenario (e.g., "Marcus — Late Again" not "Case Study 1"). End each panel by connecting back to the section's main point or forward-referencing a later section.`;
  }

  // After-accordion text bridge (if accordion exists)
  if (module.accordionContent) {
    blockRequirements += `\n4. A short text block (100-200 words) that bridges from the accordion cases back into the narrative — synthesize what the cases illustrated and transition toward the matching or reflection exercise.`;
  }

  // Matching
  if (module.matchingExercise) {
    blockRequirements += `\n5. A matching exercise with 4-5 term/definition pairs directly relevant to this section's concepts. Make the terms concrete (real rationalizations, real behaviors, real language) not abstract.`;
  }

  // Reflection
  if (module.reflectionPrompt) {
    blockRequirements += `\n6. A reflection prompt that asks the learner to apply THIS section's concepts to their own caseload. Be specific — reference the concepts taught. Start with "Think about..." or "Consider a client on your current caseload..."`;
  }

  // Knowledge checks
  if (module.knowledgeCheckCount) {
    blockRequirements += `\n7. ${module.knowledgeCheckCount} multipleChoice knowledge checks. Before them, include a brief text block that says something like "Check your understanding before continuing to the next section." Each question must:
   - Test a specific concept from THIS section (not general knowledge)
   - Have 4 options (objects with text and isCorrect)
   - Include a 1-2 sentence explanation that reinforces the teaching point
   - Feel like a natural checkpoint, not a gotcha`;
  }

  blockRequirements += `\n\nREMEMBER: Return ONLY the raw JSON array. No code fences. No preamble. Start with [ end with ].`;

  const result = await callClaude(SYSTEM_PROMPT, blockRequirements);
  
  // Parse JSON - handle potential code fences
  let cleaned = result.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  
  try {
    const blocks = JSON.parse(cleaned);
    
    // Count words in text blocks
    let wordCount = 0;
    for (const b of blocks) {
      if (b.type === "text" && b.textContent) {
        wordCount += b.textContent.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(w => w).length;
      }
      if (b.type === "accordion" && b.panels) {
        for (const p of b.panels) {
          wordCount += (p.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(w => w).length;
        }
      }
    }
    
    console.log(`    ✅ ${blocks.length} blocks, ~${wordCount} words`);
    return { blocks, wordCount };
  } catch (parseErr) {
    console.error(`    ❌ JSON parse failed. First 200 chars: ${cleaned.substring(0, 200)}`);
    // Try to salvage by finding the array
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        const blocks = JSON.parse(arrayMatch[0]);
        console.log(`    ⚠️ Salvaged ${blocks.length} blocks from response`);
        return { blocks, wordCount: 0 };
      } catch (e2) {
        throw new Error(`Cannot parse API response: ${parseErr.message}`);
      }
    }
    throw parseErr;
  }
}



// ── MAIN ────────────────────────────────────────────────────────────
async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  COUNSELORREADY COURSE REBUILD: Elephant in the Room    ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`Model: ${MODEL}`);
  console.log(`Target: 18,000+ words (3 CE hours × 6,000 words/hr)\n`);

  // Build all sections via API
  const sections = [];
  let totalWords = 0;
  let totalCost = { input: 0, output: 0 };

  for (let i = 0; i < SOURCE_MODULES.length; i++) {
    const { blocks, wordCount } = await buildSection(SOURCE_MODULES[i], i);
    
    sections.push({
      title: SOURCE_MODULES[i].title,
      contentBlocks: blocks
    });
    totalWords += wordCount;
    
    // Rate limit pause between API calls
    if (i < SOURCE_MODULES.length - 1) {
      console.log("    Waiting 2s...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }


  console.log(`\n${"═".repeat(60)}`);
  console.log(`CONTENT GENERATION COMPLETE`);
  console.log(`Total sections: ${sections.length}`);
  console.log(`Total words in text: ~${totalWords}`);
  console.log(`Target: 18,000 words`);
  console.log(`Status: ${totalWords >= 18000 ? "✅ MEETS REQUIREMENT" : `⚠️ ${totalWords}/18000 (${Math.round(totalWords/180)}%)`}`);
  console.log(`${"═".repeat(60)}\n`);

  // Append APA references to last content section
  const refsHTML = `<h2 style="color:#284157; border-bottom-width:2px; border-bottom-style:solid; border-bottom-color:#D4A855; padding-bottom:8px; margin-top:40px; font-size:1.5rem; font-weight:700;">References</h2><ol style="line-height:2; color:#475569; font-size:14px; padding-left:20px;">${REFERENCES.map(r => `<li>${r.author} (${r.year}). ${r.title}. <em>${r.source}</em>.</li>`).join("")}</ol>`;
  sections[sections.length - 1].contentBlocks.push({ type: "text", textContent: refsHTML });

  // ── ASSEMBLE COURSE DOCUMENT ────────────────────────────────────
  const courseDoc = {
    slug: COURSE_SLUG,
    title: "The Elephant in the Room: Navigating Difficult Conversations in Therapy",
    subtitle: "Frameworks, Language, and Courage for the Conversations That Matter Most",
    description: "Every therapy room has elephants — the obvious issues that both therapist and client recognize but neither addresses. These unspoken topics erode trust, stall progress, and deprive clients of corrective emotional experiences that are often more therapeutic than the planned interventions themselves. This 3-hour continuing education course examines why clinicians avoid difficult conversations and what that avoidance costs in terms of treatment outcomes, alliance quality, and professional integrity. Participants will learn the COMPASS framework — a structured, evidence-based approach for preparing, initiating, and navigating conversations about treatment-interfering behaviors, stalled progress, cultural dynamics, and therapeutic ruptures. The course draws on the work of Safran and Muran, Linehan, Sue, and other leading researchers to ground each strategy in empirical evidence. Through detailed clinical scenarios, matching exercises, and guided reflections, participants will practice translating these concepts into language and interventions they can apply immediately in their own clinical work.",
    courseCode: "CR-DC-301",
    instructor: "GA Integrated Therapeutic Perspectives LLC",
    
    // CE Metadata
    ceHours: 3,
    ceCategory: "Clinical",
    ceuHours: 3,
    ceuEligible: true,
    approvingBody: "NBCC",
    approvalNumber: "#7760",
    
    // Access
    accessType: "paid",
    price: 39.99,
    pricingTier: "standard",
    
    // Status
    status: "draft",
    isPublished: false,
    
    // Learning Objectives
    objectives: [
      "Identify common avoidance patterns in clinical practice and their impact on treatment outcomes",
      "Apply the COMPASS framework to prepare for, initiate, and navigate difficult therapeutic conversations",
      "Address treatment-interfering behaviors using curious compassion rather than confrontation",
      "Navigate conversations involving cultural differences, power dynamics, and identity with humility and precision",
      "Repair therapeutic alliance ruptures using evidence-based strategies from Safran and Muran's research"
    ],
    
    // Sections (interactive course format)
    sections: sections,
    
    // References
    references: REFERENCES,
    
    // Assessment — transform to player format: type "multipleChoice", options as {text} objects
    assessment: {
      questions: FINAL_EXAM.questions.map(q => ({
        ...q,
        type: "multipleChoice",
        options: q.options.map((opt, i) => ({ text: opt, originalIndex: i }))
      })),
      passingScore: 80,
      maxAttempts: 3
    },
    
    // Settings
    settings: {
      passingScore: 80,
      certificateEnabled: true,
      requireEvaluation: true,
      requireAttestation: true
    },
    
    // Provider metadata
    provider: {
      name: "GA Integrated Therapeutic Perspectives LLC",
      number: "#7760",
      approvalBody: "NBCC"
    },
    presenter: {
      name: "Kejuiana Johnson, LPC, NCC, BC-TMH, CPCS",
      credentials: "Licensed Professional Counselor, National Certified Counselor, Board Certified TeleMental Health Provider, Certified Professional Counselor Supervisor",
      licenseNumber: "LPC009587",
      licenseState: "GA"
    },
    
    // Metadata
    targetAudience: "Licensed Professional Counselors, Licensed Mental Health Counselors, Marriage and Family Therapists, Clinical Social Workers, and counselors-in-training",
    courseLevel: "Intermediate to Advanced",
    lastUpdated: new Date(),
    createdAt: new Date()
  };

  // ── SAVE TO DATABASE ──────────────────────────────────────────────
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const ic = db.collection("interactivecourses");

  // Check for existing
  const existing = await ic.findOne({ slug: COURSE_SLUG });
  if (existing) {
    console.log(`Found existing course (${existing._id}). Replacing...`);
    await ic.updateOne(
      { slug: COURSE_SLUG },
      { $set: courseDoc }
    );
    console.log("✅ Course UPDATED in interactivecourses");
  } else {
    await ic.insertOne(courseDoc);
    console.log("✅ Course CREATED in interactivecourses");
  }

  // Verify
  const saved = await ic.findOne({ slug: COURSE_SLUG });
  const savedWords = (saved.sections || []).reduce((total, s) => {
    return total + (s.contentBlocks || []).reduce((st, b) => {
      if (b.type === "text" && b.textContent) {
        return st + b.textContent.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(w => w).length;
      }
      if (b.type === "accordion" && b.panels) {
        return st + b.panels.reduce((pt, p) => pt + (p.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(w => w).length, 0);
      }
      return st;
    }, 0);
  }, 0);

  const kcCount = (saved.sections || []).reduce((t, s) => 
    t + (s.contentBlocks || []).filter(b => b.type === "multipleChoice" || b.type === "multiSelect").length, 0);
  const matchCount = (saved.sections || []).reduce((t, s) => 
    t + (s.contentBlocks || []).filter(b => b.type === "matching").length, 0);
  const accordionCount = (saved.sections || []).reduce((t, s) => 
    t + (s.contentBlocks || []).filter(b => b.type === "accordion").length, 0);
  const reflectionCount = (saved.sections || []).reduce((t, s) => 
    t + (s.contentBlocks || []).filter(b => b.type === "reflection").length, 0);

  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║  REBUILD COMPLETE                                       ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  Title: ${saved.title}`);
  console.log(`║  Slug: ${saved.slug}`);
  console.log(`║  Status: ${saved.status}`);
  console.log(`║  CE Hours: ${saved.ceHours}`);
  console.log(`║  Sections: ${saved.sections?.length || 0}`);
  console.log(`║  Total Words: ${savedWords} / 18,000 required`);
  console.log(`║  Knowledge Checks: ${kcCount}`);
  console.log(`║  Matching Exercises: ${matchCount}`);
  console.log(`║  Accordions: ${accordionCount}`);
  console.log(`║  Reflections: ${reflectionCount}`);
  console.log(`║  Final Exam: ${saved.assessment?.questions?.length || 0} questions`);
  console.log(`║  References: ${saved.references?.length || 0}`);
  console.log(`║  Objectives: ${saved.objectives?.length || 0}`);
  console.log(`╚══════════════════════════════════════════════════════════╝`);

  if (savedWords < 18000) {
    console.log(`\n⚠️  Word count is ${savedWords}. May need a second pass to reach 18,000.`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
