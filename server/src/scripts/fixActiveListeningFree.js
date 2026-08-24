/**
 * fixActiveListeningFree.js
 *
 * Patches the free Active Listening course (slug: active-listening-skills)
 * which the ACEP audit found has:
 *   - 0 references (needs 6+)
 *   - 0 learning objectives (needs 4+)
 *   - 0 in-section KCs (needs proper multipleChoice blocks in sections)
 *   - Only 4326 words counted (stale DB vs seed)
 *
 * Strategy: the existing seed script (seedFree_ActiveListening.js) has all
 * the correct data. This script applies a targeted $set on the missing fields
 * WITHOUT touching ceHours, assessment, or the existing published status.
 *
 * Usage:
 *   node src/scripts/fixActiveListeningFree.js          # dry-run
 *   node src/scripts/fixActiveListeningFree.js --apply  # write
 *
 * Run from: ~/project/src/server (Render shell)
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY = !APPLY;
const SLUG = 'active-listening-skills';

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// ─────────────────────────────────────────────────────────
// PATCH DATA — sourced from seedFree_ActiveListening.js
// ─────────────────────────────────────────────────────────

const REFERENCES = [
  { title: 'The skilled helper: A problem-management and opportunity-development approach (11th ed.)', author: 'Egan, G., & Reese, R. J.', year: 2019, source: 'Cengage Learning' },
  { title: 'Intentional interviewing and counseling (9th ed.)', author: 'Ivey, A. E., Ivey, M. B., & Zalaquett, C. P.', year: 2018, source: 'Cengage Learning' },
  { title: 'On becoming a person: A therapist\'s view of psychotherapy', author: 'Rogers, C. R.', year: 1961, source: 'Houghton Mifflin' },
  { title: 'Therapeutic communication (2nd ed.)', author: 'Wachtel, P. L.', year: 2011, source: 'Guilford Press' },
  { title: 'Helping skills: Facilitating exploration, insight, and action (5th ed.)', author: 'Hill, C. E.', year: 2020, source: 'American Psychological Association' },
  { title: 'Motivational interviewing: Helping people change (3rd ed.)', author: 'Miller, W. R., & Rollnick, S.', year: 2013, source: 'Guilford Press' },
];

const OBJECTIVES = [
  'Identify and apply the physical and psychological components of effective therapeutic attending using the SOLER/SOLVER framework and its cultural adaptations',
  'Demonstrate the three-stage reflective listening continuum — paraphrase, reflection of feeling, and reflection of meaning — and explain how each level deepens client exploration',
  'Apply the OARS framework (Open questions, Affirmations, Reflections, Summaries) to clinical encounters and distinguish MI-consistent from MI-inconsistent responses',
  'Recognize and manage common barriers to active listening including countertransference, cognitive load, confirmation bias, and environmental distractions',
];

// Sections with properly structured KC blocks — sourced from seed script
// These replace (or add to) the existing sections if KCs are missing
const SECTIONS = [
  {
    title: 'The Art of Attending: Creating a Facilitative Presence',
    description: 'Physical and psychological attending, the SOLER model, and cultural considerations',
    order: 1,
    contentBlocks: [
      {
        type: 'text',
        order: 1,
        content: `<h2>Why Attending Matters</h2>
<p>Before a single word of therapeutic intervention is spoken, the clinician's physical and psychological presence communicates volumes. Research on therapeutic alliance consistently demonstrates that clients' perceptions of being heard and understood are among the strongest predictors of treatment outcome — regardless of theoretical orientation. Lambert's (2013) meta-analytic work estimates that common factors, particularly the therapeutic relationship, account for approximately 30% of outcome variance, while specific techniques account for only about 15%. The way a clinician listens may matter more than what they say.</p>
<p>Attending is the foundation upon which all other clinical skills are built. Without effective attending, reflections miss the mark, interpretations fall flat, and interventions feel mechanical. Gerard Egan's model of attending distinguishes between <strong>physical attending</strong> — the observable behaviors that communicate presence — and <strong>psychological attending</strong> — the internal state of focused, non-judgmental awareness. Both are necessary; neither alone is sufficient.</p>
<h2>The SOLER Model</h2>
<p>Egan's SOLER acronym provides a useful starting framework: <strong>S</strong>quare facing (orienting your body toward the client), <strong>O</strong>pen posture (uncrossed arms and legs), <strong>L</strong>eaning forward slightly (conveying engagement), <strong>E</strong>ye contact (appropriate, culturally sensitive), and <strong>R</strong>elaxed presence (communicating comfort). Later updated to SOLVER, adding <strong>V</strong>isibly attending — being intentional about demonstrating through observable behavior that you are tracking the client's communication.</p>
<p>Cultural sensitivity is essential in applying any attending framework. Eye contact, for instance, carries dramatically different meanings across cultures: in many Indigenous communities, prolonged eye contact may be experienced as aggressive or disrespectful; in some East Asian contexts, sustained eye contact with an authority figure may feel confrontational; in certain Middle Eastern traditions, cross-gender eye contact carries social meanings that clinical eye contact does not intend to convey. The culturally competent clinician does not apply SOLER as a universal prescription but as a flexible set of principles whose specific behavioral expression must be calibrated to the individual client.</p>`,
      },
      {
        type: 'multipleChoice',
        order: 2,
        question: 'Research on therapeutic outcomes suggests that common factors, particularly the therapeutic relationship, account for approximately what percentage of outcome variance?',
        options: [
          { text: '15%, the same as specific techniques', isCorrect: false },
          { text: '30%, substantially more than specific techniques', isCorrect: true },
          { text: '50%, making techniques essentially irrelevant', isCorrect: false },
          { text: '10%, less than client factors alone', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Lambert\'s (2013) meta-analytic work finds common factors — especially the therapeutic relationship — account for approximately 30% of outcome variance, while specific techniques account for only about 15%. This evidence base supports the clinical priority of relational skills like active listening.',
      },
      {
        type: 'multipleChoice',
        order: 3,
        question: 'A client from an East Asian background averts their gaze during emotionally intense disclosures. According to culturally sensitive attending, the clinician should:',
        options: [
          { text: 'Maintain direct eye contact to communicate engagement, as this is the SOLER standard', isCorrect: false },
          { text: 'Interpret gaze aversion as resistance and address it therapeutically', isCorrect: false },
          { text: 'Recognize that sustained direct eye contact may feel confrontational in this cultural context and adapt accordingly', isCorrect: true },
          { text: 'Refer the client for cultural consultation before proceeding', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'SOLER is a framework, not a prescription. Eye contact carries different meanings across cultures. Adapting attending behaviors to the individual client\'s cultural context is a core competency of culturally responsive counseling.',
      },
      {
        type: 'matching',
        order: 4,
        title: 'SOLER Components',
        matchingInstructions: 'Match each SOLER component to its attending behavior.',
        matchingPairs: [
          { term: 'S — Square facing', definition: 'Orienting your body toward the client to communicate full attention' },
          { term: 'O — Open posture', definition: 'Uncrossed arms and legs signaling receptivity and non-defensiveness' },
          { term: 'L — Leaning in', definition: 'Slight forward lean conveying engagement and interest' },
          { term: 'E — Eye contact', definition: 'Culturally adapted visual connection communicating presence' },
          { term: 'R — Relaxed', definition: 'Communicating comfort with the material and the client' },
        ],
      },
    ],
  },
  {
    title: 'The Reflective Listening Continuum',
    description: 'Paraphrase, reflection of feeling, and reflection of meaning',
    order: 2,
    contentBlocks: [
      {
        type: 'text',
        order: 1,
        content: `<h2>Three Levels of Reflection</h2>
<p>Reflective listening exists on a continuum from surface to depth. At the surface, paraphrase restates the factual content of what the client said in slightly different words, demonstrating that the clinician has accurately received the message. At the middle level, reflection of feeling identifies and names the emotional experience embedded in the client's communication — often the emotion the client has implied but not directly stated. At the deepest level, reflection of meaning reaches beneath the surface feeling to the values, beliefs, or identity-level concerns that give those feelings their full significance.</p>
<p>Each level of reflection serves a distinct clinical function. Paraphrase establishes the foundation of accurate communication and prevents the misunderstandings that derail therapeutic progress before it begins. Reflection of feeling communicates that the clinician sees the client as an emotional person, not simply a presenting problem, and creates the conditions under which clients feel safe enough to explore what they actually feel rather than what they think they should feel. Reflection of meaning reaches toward the core of therapeutic work: the client's sense of self, their fundamental values, and the meaning structures through which they interpret their experience.</p>
<h2>Empathic Accuracy</h2>
<p>Research on empathic accuracy — the degree to which a clinician's reflection matches the client's actual internal experience — shows that accurate empathy is associated with better therapeutic outcomes, greater client disclosure, and stronger therapeutic alliance. Importantly, inaccurate empathy is not neutral: an off-target reflection can make clients feel misunderstood, can introduce distortion into their self-understanding if accepted uncritically, and can damage the alliance if it occurs repeatedly.</p>
<p>The solution to empathic inaccuracy is not greater certainty in reflections but greater tentativeness. Reflections framed as hypotheses ("It sounds like you might be feeling...") invite correction without defensiveness, model epistemic humility, and position the client as the expert on their own experience — which they are. The clinician who reflects tentatively and adjusts readily teaches the client that being known is possible and safe.</p>`,
      },
      {
        type: 'multipleChoice',
        order: 2,
        question: 'A client says, "I got the promotion I\'ve been working toward for three years, but I just feel kind of empty." A reflection of meaning response would be:',
        options: [
          { text: '"You got the promotion but you feel empty." (paraphrase)', isCorrect: false },
          { text: '"You\'re feeling disappointed." (reflection of feeling)', isCorrect: false },
          { text: '"It sounds like the achievement matters less than you expected — maybe because you were hoping it would change something deeper." (reflection of meaning)', isCorrect: true },
          { text: '"Have you considered that your standards might be too high?" (interpretation)', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Reflection of meaning reaches beneath the named feeling (emptiness) to the values and identity-level concerns underneath — in this case, the client\'s apparent belief that the external achievement would fulfill an internal need. This level of reflection invites deeper exploration of the client\'s meaning-making.',
      },
      {
        type: 'multipleChoice',
        order: 3,
        question: 'Research on empathic accuracy suggests that clinicians should:',
        options: [
          { text: 'Frame reflections as certainties to project confidence and establish therapeutic authority', isCorrect: false },
          { text: 'Avoid reflecting feelings until the client explicitly labels them to prevent projection', isCorrect: false },
          { text: 'Frame reflections tentatively ("It sounds like...") and invite correction, positioning the client as the expert on their own experience', isCorrect: true },
          { text: 'Reserve deep reflections for the final third of a session after rapport is fully established', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Tentative reflections invite correction without defensiveness, model epistemic humility, and position the client as the expert on their own experience. Inaccurate empathy delivered with certainty can feel invalidating and damage the alliance.',
      },
    ],
  },
  {
    title: 'OARS and MI-Consistent Listening',
    description: 'Open questions, affirmations, reflections, summaries',
    order: 3,
    contentBlocks: [
      {
        type: 'text',
        order: 1,
        content: `<h2>The OARS Framework</h2>
<p>Motivational Interviewing organizes active listening skills into the OARS acronym: Open questions, Affirmations, Reflections, and Summaries. Together, these four skills constitute the micro-skills of MI practice and represent a specific application of active listening to the clinical context of facilitating behavior change motivation. Each skill serves a distinct function within the MI encounter.</p>
<p><strong>Open questions</strong> invite elaboration rather than yes/no answers, creating space for clients to explore their ambivalence rather than defend a position. "What brings you in today?" invites a narrative; "Are you thinking about quitting?" invites a binary response that often elicits defensiveness. The ratio of open to closed questions is itself a fidelity indicator in MI: high-fidelity MI practice maintains a substantial majority of open questions throughout the session.</p>
<p><strong>Affirmations</strong> are statements that recognize the client's strengths, efforts, and inherent worth — not praise ("Good job!") but genuine acknowledgment of what the clinician observes about the person: "You've kept this appointment even though you weren't sure you wanted to be here — that took something." Genuine affirmations shift the relational dynamic from clinician-as-expert-evaluating-client to clinician-as-witness-recognizing-person.</p>
<p><strong>Reflections</strong> in the MI context are deployed strategically: reflecting change talk amplifies motivation; reflecting sustain talk selectively (without dwelling on it) acknowledges ambivalence without reinforcing resistance. The MI practitioner's ear is tuned to the change/sustain talk ratio and reflects accordingly.</p>
<p><strong>Summaries</strong> collect and organize what the client has communicated, serving multiple functions: demonstrating attentiveness, connecting disparate elements into a coherent picture, amplifying change talk when summaries deliberately emphasize it, and marking transitions within the session structure.</p>`,
      },
      {
        type: 'multipleChoice',
        order: 2,
        question: 'Which of the following BEST exemplifies an MI-consistent affirmation?',
        options: [
          { text: '"I\'m really proud of you for trying to quit smoking."', isCorrect: false },
          { text: '"You\'ve been dealing with a lot of pressure, and you still showed up today — that\'s not nothing."', isCorrect: true },
          { text: '"Great job identifying your triggers! That\'s step one."', isCorrect: false },
          { text: '"You seem to really want to change, which is the most important thing."', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Genuine affirmations recognize the client\'s strengths and efforts without evaluative praise ("proud of you," "great job"). Option B acknowledges specific observable evidence of resilience without positioning the clinician as judge. Affirmations in MI shift the dynamic from expert-evaluating-client to witness-recognizing-person.',
      },
      {
        type: 'multipleChoice',
        order: 3,
        question: 'In MI-consistent practice, when a client produces sustain talk ("I\'m not sure I really have a problem with drinking"), the clinician should:',
        options: [
          { text: 'Reflect the sustain talk back to reinforce the client\'s awareness of it', isCorrect: false },
          { text: 'Immediately shift to psychoeducation about alcohol use disorder criteria', isCorrect: false },
          { text: 'Acknowledge the ambivalence without dwelling on the sustain talk, then shift focus toward change talk', isCorrect: true },
          { text: 'Ask a series of closed questions to establish objective evidence of the problem', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'MI deploys reflections strategically. Sustain talk is acknowledged (not ignored or dismissed) but not amplified. Dwelling on sustain talk or arguing against it activates the righting reflex in the client, pushing them to defend the status quo. The skilled MI practitioner acknowledges ambivalence and then shifts toward change talk.',
      },
      {
        type: 'multipleChoice',
        order: 4,
        question: 'Which type of summary is MOST strategically useful when a client has been expressing mixed feelings about change throughout the session?',
        options: [
          { text: 'A collecting summary that neutrally recapitulates all content discussed', isCorrect: false },
          { text: 'A transitional summary that marks the shift to a new topic', isCorrect: false },
          { text: 'A bouquet summary that deliberately collects and emphasizes the client\'s own change talk', isCorrect: true },
          { text: 'A linking summary that connects the current session to previous ones', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'A "bouquet summary" (Miller & Rollnick term) deliberately collects the client\'s own change talk statements and presents them back, amplifying motivation by having the client hear their own expressed reasons for change. This is a high-leverage MI technique at points of ambivalence.',
      },
    ],
  },
  {
    title: 'Barriers and Sustained Practice',
    description: 'Managing barriers to listening and developing lifelong skill',
    order: 4,
    contentBlocks: [
      {
        type: 'text',
        order: 1,
        content: `<h2>Internal Barriers to Active Listening</h2>
<p>Even skilled clinicians encounter internal barriers that compromise active listening in practice. Understanding these barriers is the first step toward managing them. <strong>Countertransference</strong> — the clinician's own emotional reactions to the client's material — is perhaps the most clinically significant. When a client's story activates the clinician's own unresolved experiences, the clinician may withdraw from full presence, prematurely redirect the conversation, or respond to their own emotional state rather than the client's. Regular supervision and personal therapy are the professional standard for identifying and working through countertransference reactions.</p>
<p><strong>Cognitive load and simultaneous processing demands</strong> represent a structural challenge: the clinician must simultaneously attend to verbal content, vocal tone, nonverbal communication, the client's history, clinical hypotheses, theoretical frameworks, documentation requirements, and their own internal state. This cognitive demand is greatest with novice clinicians and in high-stakes situations (first sessions, crisis presentations, culturally unfamiliar material). Strategies include reducing documentation cognitive load (structured note-taking systems, EHR templates), developing routinized assessment protocols that become automatic, and seeking supervision or consultation for cases that feel overwhelming.</p>
<p><strong>Confirmation bias</strong> — the tendency to hear material that confirms existing hypotheses while missing material that challenges them — is documented in clinical judgment research and represents a specific threat to active listening quality. Once a clinician has formed a diagnostic hypothesis or case conceptualization, subsequent listening is filtered through that lens. The safeguard is deliberate hypothesis-disconfirmation practice: explicitly searching for evidence against one's current formulation and maintaining conceptual flexibility.</p>
<h2>Environmental Factors</h2>
<p>Physical environment affects listening quality in ways that are often underestimated. Interruptions, noise, uncomfortable temperatures, poor lighting, and technology intrusions (notification sounds, visible screens) all compromise both clinician and client engagement. The clinician who controls their environment controls an important variable in listening quality. This includes proactive management of technology: phones silenced and out of sight, computer screens positioned away from the client's gaze, notification systems disabled during sessions.</p>`,
      },
      {
        type: 'multipleChoice',
        order: 2,
        question: 'A clinician notices that when working with clients who have experienced childhood neglect, she becomes emotionally withdrawn and finds it difficult to maintain warm engagement. This pattern is MOST likely explained by:',
        options: [
          { text: 'Compassion fatigue from working with traumatized populations', isCorrect: false },
          { text: 'Countertransference activating the clinician\'s own unresolved material in response to the client\'s experience', isCorrect: true },
          { text: 'Confirmation bias leading the clinician to misinterpret the client\'s presentation', isCorrect: false },
          { text: 'Cognitive overload from the complexity of trauma cases', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Countertransference specifically refers to the clinician\'s emotional reactions that are activated by the client\'s material — often connecting to the clinician\'s own history or unresolved experiences. The pattern of withdrawal in response to neglect-related material is a classic countertransference presentation. Regular supervision and personal therapy are the professional standard for working through these reactions.',
      },
      {
        type: 'multipleChoice',
        order: 3,
        question: 'Research on clinical judgment suggests that confirmation bias in listening can be mitigated through:',
        options: [
          { text: 'Forming diagnostic hypotheses only after the third session when sufficient data has been gathered', isCorrect: false },
          { text: 'Restricting clinical listening to session content only, avoiding theoretical frameworks during the session', isCorrect: false },
          { text: 'Deliberately searching for evidence that disconfirms one\'s current formulation and maintaining conceptual flexibility', isCorrect: true },
          { text: 'Structuring sessions so that the clinician asks only open-ended questions', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Confirmation bias is mitigated through deliberate hypothesis-disconfirmation practice — actively looking for evidence that challenges one\'s current formulation rather than only evidence that supports it. This requires a metacognitive discipline that must be cultivated intentionally.',
      },
      {
        type: 'multipleChoice',
        order: 4,
        question: 'Effective listening skills are best maintained through:',
        options: [
          { text: 'Mastery during graduate training that persists automatically', isCorrect: false },
          { text: 'Ongoing practice, feedback, and refinement throughout one\'s career', isCorrect: true },
          { text: 'Annual reading of listening skills textbooks', isCorrect: false },
          { text: 'Natural talent that cannot be developed', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Like any complex clinical competency, listening skills require ongoing practice, feedback, and refinement at every career stage. Senior clinicians can become complacent, falling into habitual patterns. The commitment to lifelong development is essential.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  const course = await col.findOne({ slug: SLUG });
  if (!course) {
    console.error(`❌ Course not found: ${SLUG}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`fixActiveListeningFree — ${DRY ? 'DRY RUN' : '⚠️  APPLYING WRITES'}`);
  console.log(`Course: ${course.title} (${SLUG})`);
  console.log(`Status: ${course.status} | CE: ${course.ceHours} | Sections: ${(course.sections || []).length}`);
  console.log(`Current refs: ${(course.references || []).length} | Objectives: ${(course.objectives || []).length}`);
  console.log('═'.repeat(70) + '\n');

  // Count existing in-section KCs
  const existingKCs = (course.sections || [])
    .flatMap(s => s.contentBlocks || [])
    .filter(b => ['multipleChoice', 'multiSelect', 'matching', 'fillInBlank', 'knowledgeCheck'].includes(b.type));

  console.log(`Existing in-section KC blocks: ${existingKCs.length}`);

  // Determine what needs patching
  const needsRefs       = !course.references || course.references.length === 0;
  const needsObjectives = !course.objectives || course.objectives.length === 0;
  const needsKCs        = existingKCs.length === 0;

  console.log(`Needs refs:       ${needsRefs}`);
  console.log(`Needs objectives: ${needsObjectives}`);
  console.log(`Needs KCs:        ${needsKCs}`);

  if (!needsRefs && !needsObjectives && !needsKCs) {
    console.log('\n✅ Course already has refs, objectives, and KCs — nothing to patch');
    await mongoose.disconnect();
    process.exit(0);
  }

  // Build $set payload — only include what's actually missing
  const setPayload = { updatedAt: new Date() };

  if (needsRefs) {
    setPayload.references = REFERENCES;
    console.log(`\n→ Adding ${REFERENCES.length} references`);
  }

  if (needsObjectives) {
    setPayload.objectives = OBJECTIVES;
    console.log(`→ Adding ${OBJECTIVES.length} objectives`);
  }

  if (needsKCs) {
    // Replace sections entirely with the proper section data (prose + KCs)
    // If existing sections have MORE prose content, we keep existing sections
    // but inject KC blocks into each section.
    const existingSections = course.sections || [];

    if (existingSections.length > 0 && existingSections.length === SECTIONS.length) {
      // Matching section count — inject KCs into existing sections
      const patchedSections = existingSections.map((existingSec, i) => {
        const templateSec = SECTIONS[i];
        if (!templateSec) return existingSec;

        const existingBlocks = existingSec.contentBlocks || [];
        const kcBlocks = (templateSec.contentBlocks || []).filter(b =>
          ['multipleChoice', 'multiSelect', 'matching', 'fillInBlank'].includes(b.type)
        );

        // Find max order in existing blocks
        const maxOrder = existingBlocks.reduce((m, b) => Math.max(m, b.order || 0), 0);
        const newKCs = kcBlocks.map((b, idx) => ({ ...b, order: maxOrder + idx + 1 }));

        const updatedBlocks = [...existingBlocks, ...newKCs]
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((b, i) => ({ ...b, order: i + 1 }));

        console.log(`  Section ${i + 1}: injected ${newKCs.length} KC blocks`);
        return { ...existingSec, contentBlocks: updatedBlocks };
      });
      setPayload.sections = patchedSections;
    } else {
      // Different section count or no sections — use template sections
      console.log(`  No matching existing sections — using template sections with ${SECTIONS.reduce((t, s) => t + (s.contentBlocks || []).length, 0)} blocks`);
      setPayload.sections = SECTIONS;
    }
  }

  if (DRY) {
    console.log('\n[DRY RUN] Would $set:');
    if (setPayload.references) console.log(`  references: [${setPayload.references.length} items]`);
    if (setPayload.objectives) console.log(`  objectives: [${setPayload.objectives.length} items]`);
    if (setPayload.sections)   console.log(`  sections:   [${setPayload.sections.length} sections, ${setPayload.sections.reduce((t,s)=>t+(s.contentBlocks||[]).length,0)} blocks total]`);
    console.log('\n  → Re-run with --apply to write changes');
  } else {
    const result = await col.updateOne(
      { _id: course._id },
      { $set: setPayload }
    );

    if (result.modifiedCount === 1) {
      console.log('\n✅ WRITTEN to DB');
    } else {
      console.error('\n❌ Write failed (modifiedCount=0)');
    }

    // Read-back verify
    const rb = await col.findOne({ _id: course._id }, {
      projection: { references: 1, objectives: 1, sections: 1 }
    });
    const rbKCs = (rb.sections || [])
      .flatMap(s => s.contentBlocks || [])
      .filter(b => ['multipleChoice', 'multiSelect', 'matching', 'fillInBlank', 'knowledgeCheck'].includes(b.type));

    console.log('\nRead-back verification:');
    console.log(`  References:  ${(rb.references || []).length}`);
    console.log(`  Objectives:  ${(rb.objectives || []).length}`);
    console.log(`  KC blocks:   ${rbKCs.length}`);
    console.log(`  Sections:    ${(rb.sections || []).length}`);
  }

  console.log('\n' + '═'.repeat(70));
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
