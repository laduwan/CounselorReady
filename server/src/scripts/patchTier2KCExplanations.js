/**
 * patchTier2KCExplanations.js
 * Self-contained fix: replaces the legacy ⚠️ placeholder explanations on the
 * multiple-choice knowledge checks in CR-401 and CR-402 with their real
 * explanations (carried inline below), directly in the live DB. Idempotent.
 * Run: node src/scripts/patchTier2KCExplanations.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { countCourseWords } from '../utils/courseWordCount.js';
dotenv.config();
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUGS = { '401': 'elephant-in-the-room-difficult-conversations', '402': 'walking-on-eggshells-high-conflict-clients' };
const EXPL = {"401":{"According to the course, avoidance of difficult conversations:":"Avoidance feels safer in the moment but carries real costs — eroded effectiveness, an inauthenticity the client senses, therapist resentment, and a missed corrective experience.","When elephants accumulate in therapy without being addressed:":"Unaddressed elephants accumulate and progressively constrain the work, shaping the therapy from the background.","Which factor does NOT typically contribute to therapist avoidance of difficult conversations?":"Temperament, countertransference, and skills gaps all drive avoidance; excessive confrontation in training is not a typical contributor.","Which is the most effective opening for a difficult conversation?":"An effective opening signals importance without alarm, frames collaboratively, and seeks permission — unlike accusatory or label-laden openers.","After making an observation, the recommended next step is to:":"After an observation, the COMPASS step is to Pause and listen — creating space for the client’s response rather than rushing to solutions or defense.","The final \"S\" in COMPASS (Strengthen Connection) involves:":"Strengthen Connection means expressing appreciation and reaffirming the shared commitment, reinforcing the relationship.","The recommended stance for addressing treatment-interfering behaviors is:":"The recommended stance is curious compassion — treating the behavior as communication to be understood, not misconduct to be punished.","When a client is chronically late, the therapist should first:":"The therapist first explores what the lateness may be communicating rather than jumping to consequences.","After addressing a treatment-interfering behavior, the therapist should:":"Addressing a behavior is not a one-time event; the therapist follows through consistently and checks in about changes.","When treatment isn't progressing, the therapist should:":"A lack of progress is addressed directly, with the reasons explored collaboratively rather than avoided or met with abrupt termination.","When a client wants to terminate prematurely, the therapist should:":"The therapist shares honest concerns about premature termination while respecting the client’s autonomy to decide.","Therapist-initiated termination is appropriate when:":"Therapist-initiated termination is appropriate when the client needs services outside the therapist’s competence — an ethical referral, not a convenience.","When treatment has failed, the ethical response is to:":"When treatment has failed, the ethical response is honest acknowledgment and exploration of alternatives, including referral.","When naming racial difference, the therapist should:":"The therapist names racial difference and invites the client’s perspective rather than pretending not to notice.","When receiving feedback about a cultural misstep, the therapist should:":"Effective repair means thanking the client, acknowledging impact regardless of intent, and committing to do better — not defending.","Naming power dynamics in therapy:":"Naming power dynamics, done in service of the client, can be helpful rather than destabilizing.","Which statement reflects cultural humility?":"Cultural humility is an ongoing posture of learning from the client while recognizing the limits of one’s own understanding.","Withdrawal ruptures are characterized by:":"Withdrawal ruptures involve the client moving away — becoming distant, compliant, or superficially engaged — rather than confronting directly.","When a client criticizes the therapist during a rupture, the therapist should:":"When criticized during a rupture, the therapist listens non-defensively to understand the client’s experience.","Repaired ruptures in therapy:":"Successfully repaired ruptures strengthen the alliance and predict positive outcomes."},"402":{"\"High-conflict\" is best described as:":"High-conflict is a behavioral description of challenging patterns, not a diagnosis or a synonym for any one disorder.","Which is NOT typically a characteristic of high-conflict clients?":"All-or-nothing thinking, blame externalization, and recurrent conflict are typical; consistent self-reflection about one’s own contribution is not.","Disorganized attachment develops when:":"Disorganized attachment develops when the caregiver is simultaneously the source of fear and comfort, leaving the child without a coherent strategy.","Compared to borderline presentations, narcissistic presentations typically involve:":"Narcissistic presentations typically involve heightened sensitivity to perceived criticism and shame, contrasted with the borderline fear of abandonment.","Testing behaviors are best understood as:":"Testing behaviors are usually unconscious processes checking whether the therapist is different from earlier caregivers — not deliberate manipulation.","When a client tests boundaries, the therapist should:":"When boundaries are tested, the therapist maintains the boundary clearly and kindly — neither rigid and punitive nor abandoning it.","The feelings therapists experience through projective identification:":"Feelings evoked through projective identification are data about the client’s internal world, to be noticed and used rather than enacted or dismissed.","Validation differs from agreement in that:":"Validation acknowledges emotional experience without necessarily endorsing the client’s interpretations or behaviors — it is not agreement.","The word \"and\" in validation statements:":"“And” connects validation to behavioral guidance without negating either, unlike “but,” which cancels the validation.","Radical genuineness (Level 6) involves:":"Radical genuineness means relating to the client as a capable, equal person rather than from behind the professional role or as if fragile.","When a client is escalating emotionally, the therapist should:":"With escalation, the therapist validates the emotion while setting limits on the behavior — staying regulated rather than matching intensity.","Boundaries in high-conflict work are important because:":"Boundaries provide containment, safety, and reality testing; they are care for the work, not punishment or distance.","Pseudo-emergencies should be handled by:":"Pseudo-emergencies are met by validating the distress while redirecting to skills — neither treating them as true emergencies nor dismissing them.","Countertransference reactions with high-conflict clients:":"Countertransference reactions are normal responses to genuinely difficult work, to be noticed and used rather than taken as signs of inadequacy.","When emotionally activated during a session, the first step is:":"The first in-session step when activated is to notice what you’re feeling — awareness precedes regulation and any disclosure.","Caseload management with high-conflict clients should include:":"Sustainable caseloads balance high-intensity clients with lower-intensity ones rather than concentrating high-conflict cases.","Treatment frame elements include all EXCEPT:":"Frame elements include clear expectations, goals, and session parameters; unlimited between-session access is not part of a healthy frame.","Session structure helps high-conflict work by:":"Structure contains chaos and maximizes productive use of time, supporting rather than controlling the client.","Referral is appropriate when:":"Referral is appropriate when the client needs treatment outside one’s scope or the fit isn’t working — a clinical decision, not a reaction to difficulty.","Burnout warning signs include:":"Burnout warning signs are chronic exhaustion, cynicism, and depersonalization — distinct from ordinary tiredness or healthy self-care."}};

const flag = '\u26A0';
const hasWarn = s => /⚠/.test(s || '');

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');
for (const code of ['401','402']) {
  const slug = SLUGS[code];
  const doc = await col.findOne({ slug });
  if (!doc) { console.log('CR-' + code + ': NOT FOUND (' + slug + ')'); continue; }
  const map = EXPL[code] || {};
  let before = 0, after = 0, matched = 0, fallback = 0;
  (doc.sections || []).forEach(sec => (sec.contentBlocks || []).forEach(b => {
    if (b.type === 'multipleChoice' && hasWarn(b.explanation)) {
      before++;
      const clean = map[(b.question || '').trim()];
      if (clean) { b.explanation = clean; matched++; }
      else {
        const correct = (b.options || []).find(o => o.isCorrect === true);
        b.explanation = correct ? ('The correct response is: ' + (correct.text || '').replace(/s+/g,' ').trim() + '. Review the course material for the full rationale.') : (b.explanation || '').replace(/⚠️?/g,'').trim();
        fallback++;
      }
    }
  }));
  (doc.sections || []).forEach(sec => (sec.contentBlocks || []).forEach(b => { if (b.type === 'multipleChoice' && hasWarn(b.explanation)) after++; }));
  doc.wordCount = countCourseWords(doc);
  await col.updateOne({ _id: doc._id }, { $set: { sections: doc.sections, wordCount: doc.wordCount } });
  console.log('CR-' + code + ': flagged before=' + before + ' (matched ' + matched + ', fallback ' + fallback + ') | flagged after=' + after + ' | wordCount=' + doc.wordCount);
}
// ---- read-only check: confirm references persisted on the sexual-health courses ----
const SH = {
  '303': 'sexual-health-across-the-lifespan',
  '304': 'sexuality-identity-mental-health',
  '305': 'sexual-trauma-assessment-treatment',
  '306': 'sex-therapy-foundations',
  '307': 'compulsive-sexual-behavior',
};
console.log('--- sexual-health references in DB ---');
for (const code of ['303','304','305','306','307']) {
  const c = await col.findOne({ slug: SH[code] }, { projection: { references: 1, wordCount: 1 } });
  console.log('CR-' + code + ': references=' + (c && c.references ? c.references.length : 'MISSING') + ' | wordCount=' + (c ? c.wordCount : '?'));
}

await mongoose.disconnect();
console.log('Done.');
