/**
 * Fixes assessment data for CR-301, CR-302, CR-105 in the interactivecourses
 * collection (the LIVE collection — not the dead legacy `courses` collection
 * that an earlier fix attempt mistakenly wrote to).
 *
 * Scope, per course:
 *   CR-301 — replace the full assessment.questions[] array with 15 verified,
 *            correctly-formed questions (the originals were corrupted by a
 *            parser bug that dumped raw page text into the question field
 *            with empty options).
 *   CR-302 — replace ONLY assessment.questions[0] and [1] (the two broken
 *            slots) with 2 verified replacement questions. The other 13
 *            questions are untouched.
 *   CR-105 — remove the one orphaned/broken inline block from the
 *            "Conclusion, Key Principles, and Final Examination" section.
 *            The real 15-question assessment.questions[] is already correct
 *            and is NOT touched.
 *
 * Nothing else on any course document is modified — no sections, no titles,
 * no other fields.
 *
 * DRY RUN by default — prints what it would change without writing.
 * Run from ~/project/src/server:
 *   node src/scripts/fixAssessmentData.js            (dry run, safe)
 *   node src/scripts/fixAssessmentData.js --apply     (writes changes)
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const APPLY = process.argv.includes('--apply');

const CR301_QUESTIONS = [
  { question: "Which brain pathway is most central to the development of addiction?", type: "multipleChoice", options: [{text:"Serotonin reuptake pathway",isCorrect:false},{text:"Mesolimbic dopamine reward pathway",isCorrect:true},{text:"Norepinephrine stress pathway",isCorrect:false},{text:"GABA inhibitory pathway",isCorrect:false}], correctAnswer: 1, explanation: "The mesolimbic dopamine pathway, sometimes called the reward pathway, is central to addiction - substances hijack this system to produce intense reinforcement." },
  { question: "The DSM-5-TR diagnoses substance use disorders on a continuum of:", type: "multipleChoice", options: [{text:"Type A and Type B",isCorrect:false},{text:"Acute and chronic",isCorrect:false},{text:"Mild, moderate, and severe",isCorrect:true},{text:"Primary and secondary",isCorrect:false}], correctAnswer: 2, explanation: "DSM-5-TR rates substance use disorders as mild (2-3 criteria), moderate (4-5 criteria), or severe (6+ criteria)." },
  { question: "Which screening tool uses the mnemonic CAGE to assess alcohol use?", type: "multipleChoice", options: [{text:"AUDIT",isCorrect:false},{text:"DAST",isCorrect:false},{text:"CAGE",isCorrect:true},{text:"MAST",isCorrect:false}], correctAnswer: 2, explanation: "CAGE asks about Cut down, Annoyed, Guilty, and Eye-opener - a brief 4-question screener for alcohol problems." },
  { question: "Medication-Assisted Treatment (MAT) for opioid use disorder includes all EXCEPT:", type: "multipleChoice", options: [{text:"Methadone",isCorrect:false},{text:"Buprenorphine",isCorrect:false},{text:"Naltrexone",isCorrect:false},{text:"Diazepam",isCorrect:true}], correctAnswer: 3, explanation: "Diazepam (a benzodiazepine) is not used for OUD MAT. Methadone, buprenorphine, and naltrexone are FDA-approved for OUD." },
  { question: "The biopsychosocial model of addiction emphasizes:", type: "multipleChoice", options: [{text:"Moral failing as the root cause",isCorrect:false},{text:"Only genetic factors",isCorrect:false},{text:"Interacting biological, psychological, and social factors",isCorrect:true},{text:"Environmental factors alone",isCorrect:false}], correctAnswer: 2, explanation: "The biopsychosocial model views addiction as arising from the interaction of biological vulnerabilities, psychological factors, and social/environmental influences." },
  { question: "Motivational Interviewing is particularly effective with substance use because it:", type: "multipleChoice", options: [{text:"Confronts denial directly",isCorrect:false},{text:"Meets clients where they are and elicits their own motivation for change",isCorrect:true},{text:"Requires clients to acknowledge powerlessness first",isCorrect:false},{text:"Focuses on past trauma before addressing substance use",isCorrect:false}], correctAnswer: 1, explanation: "MI is client-centered and evocative - it draws out the client's own reasons and motivation for change rather than imposing them." },
  { question: "Which stage of the Transtheoretical Model describes a person actively making changes for less than 6 months?", type: "multipleChoice", options: [{text:"Contemplation",isCorrect:false},{text:"Preparation",isCorrect:false},{text:"Action",isCorrect:true},{text:"Maintenance",isCorrect:false}], correctAnswer: 2, explanation: "The Action stage involves active behavioral change. Maintenance begins after 6 months of sustained change." },
  { question: "Relapse should be understood clinically as:", type: "multipleChoice", options: [{text:"Evidence the client is not motivated",isCorrect:false},{text:"A moral failure requiring consequences",isCorrect:false},{text:"A normal part of the recovery process requiring clinical response",isCorrect:true},{text:"Grounds for discharge from treatment",isCorrect:false}], correctAnswer: 2, explanation: "Relapse rates for addiction are similar to other chronic diseases. Relapse is a clinical event requiring assessment and treatment adjustment, not punishment." },
  { question: "Co-occurring disorders (dual diagnosis) refers to:", type: "multipleChoice", options: [{text:"Two different substance use disorders",isCorrect:false},{text:"Substance use disorder alongside a mental health disorder",isCorrect:true},{text:"Physical and mental health conditions",isCorrect:false},{text:"Two mental health disorders without substance involvement",isCorrect:false}], correctAnswer: 1, explanation: "Co-occurring or dual diagnosis refers to the simultaneous presence of a substance use disorder and a mental health disorder." },
  { question: "Cultural humility in addiction treatment requires:", type: "multipleChoice", options: [{text:"Applying universal treatment protocols to all clients",isCorrect:false},{text:"Learning one set of cultural facts about each ethnic group",isCorrect:false},{text:"Ongoing self-reflection and openness to each client's cultural identity",isCorrect:true},{text:"Avoiding discussion of cultural background in sessions",isCorrect:false}], correctAnswer: 2, explanation: "Cultural humility is an ongoing process of self-reflection and learning, recognizing that each client's cultural identity is unique and complex." },
  { question: "Withdrawal from which substance can be medically life-threatening?", type: "multipleChoice", options: [{text:"Cannabis",isCorrect:false},{text:"Opioids",isCorrect:false},{text:"Alcohol",isCorrect:true},{text:"Cocaine",isCorrect:false}], correctAnswer: 2, explanation: "Alcohol withdrawal can cause seizures and delirium tremens, which can be fatal without proper medical management." },
  { question: "The CRAFFT is a screening tool designed specifically for:", type: "multipleChoice", options: [{text:"Older adults",isCorrect:false},{text:"Pregnant women",isCorrect:false},{text:"Adolescents",isCorrect:true},{text:"Veterans",isCorrect:false}], correctAnswer: 2, explanation: "CRAFFT (Car, Relax, Alone, Forget, Friends, Trouble) is validated for screening substance use in adolescents under 21." },
  { question: "Harm reduction approaches differ from abstinence-only approaches in that they:", type: "multipleChoice", options: [{text:"Encourage continued substance use",isCorrect:false},{text:"Accept that some clients may not achieve abstinence and focus on reducing negative consequences",isCorrect:true},{text:"Avoid working with active users",isCorrect:false},{text:"Require completion of detox before engagement",isCorrect:false}], correctAnswer: 1, explanation: "Harm reduction meets clients where they are, prioritizing safety and reduced harm even when abstinence is not the immediate goal." },
  { question: "Which neurotransmitter is most associated with the rewarding effects of substances?", type: "multipleChoice", options: [{text:"Serotonin",isCorrect:false},{text:"GABA",isCorrect:false},{text:"Dopamine",isCorrect:true},{text:"Acetylcholine",isCorrect:false}], correctAnswer: 2, explanation: "Dopamine release in the nucleus accumbens produces the rewarding effects that drive repeated substance use." },
  { question: "A counselor's primary role when working with clients in recovery includes:", type: "multipleChoice", options: [{text:"Making decisions about medication on behalf of the client",isCorrect:false},{text:"Providing a supportive therapeutic relationship and evidence-based interventions",isCorrect:true},{text:"Enforcing abstinence through consequences",isCorrect:false},{text:"Replacing the need for peer support groups",isCorrect:false}], correctAnswer: 1, explanation: "Counselors provide therapeutic support and evidence-based interventions while collaborating with the broader treatment team." }
];

// NOTE: CR-302 in the live DB is "Beyond the Surface: Multicultural
// Competence in Clinical Practice" — NOT Motivational Interviewing.
// Course codes were reshuffled at some point after Feb/May 2026 archival
// research; always verify against the live title before trusting an old
// code mapping. These replacements are sourced directly from this course's
// own docx (Beyond_the_Surface_Multicultural_Competence_3CE.docx).
const CR302_REPLACEMENTS = {
  0: { question: "Sue's Tripartite Model of Multicultural Counseling Competencies (Sue et al., 1992) identifies which three domains a clinician must develop?", type: "multipleChoice", options: [{text:"Empathy, assessment, and diagnosis",isCorrect:false},{text:"Awareness, knowledge, and skills",isCorrect:true},{text:"Trust, rapport, and therapeutic alliance",isCorrect:false},{text:"Screening, referral, and consultation",isCorrect:false}], correctAnswer: 1, explanation: "Sue's Tripartite Model identifies three interrelated domains of multicultural counseling competence: awareness of one's own cultural values and biases, knowledge of culturally diverse worldviews, and skill in developing culturally appropriate intervention strategies. All three domains must be addressed for comprehensive cultural competence." },
  1: { question: "Cultural humility, as distinguished from cultural competence, is best characterized as:", type: "multipleChoice", options: [{text:"A one-time training certification validating the counselor's readiness for multicultural work",isCorrect:false},{text:"A lifelong commitment to critical self-reflection and client-as-expert positioning",isCorrect:true},{text:"Mastery of factual knowledge about major cultural groups in the counselor's practice area",isCorrect:false},{text:"The elimination of all personal cultural biases from clinical decision-making",isCorrect:false}], correctAnswer: 1, explanation: "Cultural humility is a lifelong process of self-reflection and self-critique in which the clinician positions the client as the expert on their own cultural experience, rather than a credential or fixed body of knowledge to be mastered." }
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  console.log('═'.repeat(90));
  console.log(APPLY ? 'APPLYING FIXES' : 'DRY RUN — no writes (pass --apply to commit)');
  console.log('═'.repeat(90));

  // ── CR-301: full replace of assessment.questions ──
  {
    const course = await col.findOne({ courseCode: 'CR-301' });
    if (!course) {
      console.log('CR-301: NOT FOUND — skipping');
    } else {
      const before = (course.assessment?.questions || []).length;
      console.log(`\nCR-301 (${course.title}): assessment.questions ${before} -> ${CR301_QUESTIONS.length}`);
      if (APPLY) {
        await col.updateOne(
          { _id: course._id },
          { $set: { 'assessment.questions': CR301_QUESTIONS } }
        );
        console.log('  -> written');
      }
    }
  }

  // ── CR-302: replace only indices 0 and 1 ──
  {
    const course = await col.findOne({ courseCode: 'CR-302' });
    if (!course) {
      console.log('CR-302: NOT FOUND — skipping');
    } else {
      const qs = course.assessment?.questions || [];
      console.log(`\nCR-302 (${course.title}): replacing indices ${Object.keys(CR302_REPLACEMENTS).join(', ')} of ${qs.length} total`);
      for (const [idxStr, replacement] of Object.entries(CR302_REPLACEMENTS)) {
        const idx = Number(idxStr);
        console.log(`  [${idx}] old question started with: "${(qs[idx]?.question || '').slice(0, 60)}..."`);
        console.log(`  [${idx}] new question: "${replacement.question}"`);
        if (APPLY) {
          await col.updateOne(
            { _id: course._id },
            { $set: { [`assessment.questions.${idx}`]: replacement } }
          );
        }
      }
      if (APPLY) console.log('  -> written');
    }
  }

  // ── CR-105: remove the orphaned inline exam block ──
  {
    const course = await col.findOne({ courseCode: 'CR-105' });
    if (!course) {
      console.log('CR-105: NOT FOUND — skipping');
    } else {
      let removed = 0;
      const newSections = (course.sections || []).map(section => {
        const before = (section.contentBlocks || []).length;
        const filtered = (section.contentBlocks || []).filter(
          b => !(b.isExam === true && b.type === 'multipleChoice' && b.title === 'Final Examination')
        );
        removed += (before - filtered.length);
        return { ...section, contentBlocks: filtered };
      });
      console.log(`\nCR-105 (${course.title}): removing ${removed} orphaned block(s)`);
      if (APPLY && removed > 0) {
        await col.updateOne(
          { _id: course._id },
          { $set: { sections: newSections } }
        );
        console.log('  -> written');
      }
    }
  }

  console.log('\n' + '═'.repeat(90));
  console.log(APPLY ? 'Done — changes written.' : 'Dry run complete. Re-run with --apply to write these changes.');
  console.log('═'.repeat(90));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
