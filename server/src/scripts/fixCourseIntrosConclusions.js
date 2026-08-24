/**
 * fixCourseIntrosConclusions.js
 *
 * Patches courses where description = just the title (not real content)
 * and where the final section conclusion is a single generic placeholder sentence.
 *
 * Courses targeted:
 *   CR-101  suicide-risk-assessment-crisis-intervention
 *   CR-302  motivational-interviewing-from-ambivalence-to-action
 *   CR-102  crisis-intervention-and-suicide-prevention-... (verify only)
 *
 * What gets patched:
 *   1. course.description — replaced with substantive, clinician-facing prose
 *   2. course.subtitle    — sharpened from generic to course-specific
 *   3. Final section's conclusion text block — replaced with a strong clinical synthesis
 *
 * Uses raw updateOne/$set — never .save()
 *
 * Usage:
 *   node src/scripts/fixCourseIntrosConclusions.js          # dry-run
 *   node src/scripts/fixCourseIntrosConclusions.js --apply  # write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// ── Patch definitions ────────────────────────────────────────────────────────

const PATCHES = [
  {
    slug: 'suicide-risk-assessment-crisis-intervention',
    label: 'CR-101 Suicide Risk Assessment',
    description: `Suicide is the second leading cause of death among Americans aged 10–34, and every licensed mental health professional will encounter suicidal clients. Yet most clinicians report feeling undertrained in the specific skills that move a client from crisis toward safety. This 3-hour continuing education course provides a comprehensive, evidence-based foundation in suicide risk assessment, risk formulation, safety planning, and crisis intervention — grounded in the major theoretical frameworks that explain why people attempt suicide and what helps them survive it. You will learn structured assessment approaches including the Columbia Suicide Severity Rating Scale and the SAFE-T protocol, how to conduct risk formulation that translates clinical data into actionable decisions, and how to build collaborative safety plans that extend your clinical reach beyond the session. Special attention is paid to high-risk populations including veterans, LGBTQ+ youth, rural clients, and older adults. This course meets Georgia CE requirements and is aligned with ACA ethical standards for competent, life-saving care.`,
    subtitle: `Evidence-Based Assessment, Risk Formulation, and Crisis Intervention`,
    conclusionSectionTitle: 'Course Summary and References',
    conclusionContent: `<h2>Synthesizing the Work: What You Now Carry Into Every Session</h2>
<p>Suicide risk assessment is not a one-time event, a checklist, or a liability management exercise. It is an ongoing clinical stance — attentive, collaborative, theoretically grounded — that you bring to every session with every client, because suicidal crises do not announce themselves. What this course has given you is not a script but a framework: a way of hearing your clients more completely, formulating their risk more accurately, and responding with both clinical rigor and genuine human presence.</p>
<p>You leave this course understanding that suicidal desire arises from specific, identifiable psychological states — perceived burdensomeness, thwarted belongingness, intolerable psychological pain, entrapment without exit — and that naming these states precisely gives you clinical leverage that generic crisis protocols cannot. You understand that acquired capability distinguishes those at highest risk for lethal action, and that this distinction shapes both your assessment questions and your intervention targets. You understand that a collaborative safety plan is a clinical intervention in itself — not a document for the chart, but a living agreement that extends your presence into the hours and days you are not in the room.</p>
<p>Perhaps most importantly, you now hold the evidence that asking directly about suicide does not plant ideas. It communicates that you can handle the conversation, that the client's inner life is not too dangerous to explore, and that they are not alone with what they are carrying. That permission — extended clearly and without flinching — is itself therapeutic.</p>
<p>Bring consultation forward, not backward. The moment a case begins to feel heavy is the moment to call a colleague, not after the session. Maintain your own crisis protocol as a living document, reviewed with your supervisor, because the clinician who has rehearsed their response is the clinician who can stay regulated enough to be helpful when the moment arrives. Pursue advanced training in CAMS, DBT, or safety planning as your caseload develops — the investment pays in lives.</p>
<p>The clients who are most at risk are often the ones who have learned that disclosing their inner experience brings consequences, judgment, or the threat of hospitalization. Your greatest clinical asset in this work is a relationship in which the client believes that telling you the truth is safer than concealing it. Every clinical skill in this course serves that relationship. That relationship saves lives.</p>`,
  },
  {
    slug: 'motivational-interviewing-from-ambivalence-to-action',
    label: 'CR-302 Motivational Interviewing',
    description: `Ambivalence is not resistance — it is the normal human experience of wanting two incompatible things at once. Motivational Interviewing is the evidence-based clinical approach developed to work with ambivalence rather than against it, drawing out a client's own motivations for change instead of supplying them from outside. This 3-hour continuing education course provides a comprehensive grounding in MI theory, spirit, and practice — from the foundational constructs of partnership, acceptance, compassion, and evocation through the four-process model of Engaging, Focusing, Evoking, and Planning. You will learn to hear and respond strategically to change talk and sustain talk, to use OARS (Open questions, Affirmations, Reflections, Summaries) with clinical precision, and to recognize and manage the righting reflex that undermines so many clinician-client conversations about change. This course is relevant across populations and presenting problems — addiction, health behavior, mental health, therapeutic resistance — and includes fidelity measurement tools for ongoing self-assessment. CE eligible for licensed professional counselors, social workers, and related mental health professionals.`,
    subtitle: `The Four-Process Model, OARS, Change Talk, and Clinical Fidelity`,
    conclusionSectionTitle: 'Course Summary and References',
    conclusionContent: `<h2>From Practice to Proficiency: Carrying MI Forward</h2>
<p>Motivational Interviewing is not a technique to be applied from the outside. It is a way of being with clients in the face of ambivalence — a stance of genuine curiosity about what they want, what they value, and what they already know about why change might matter to them. The clinician who has internalized MI's spirit is not mining for change talk; they are genuinely interested in the person across from them, and change talk emerges from that genuine interest as a natural byproduct.</p>
<p>You leave this course with specific tools: the four-process model to orient your work across the arc of the session, OARS to structure your moment-to-moment responses, change talk recognition to calibrate your reflective strategy, and the MITI to measure your own fidelity and growth. These tools will take time to internalize. The research on MI acquisition is consistent on this point: reading about MI or attending a training produces initial behavior change, but sustained proficiency requires deliberate practice with feedback — which means recording sessions, seeking supervision with someone trained in fidelity measurement, and using the MITI's reflection ratio and complex reflection benchmarks as honest mirrors of where you are.</p>
<p>Watch for the righting reflex in yourself. The impulse to argue for change, to supply reasons, to present the evidence, is deeply embedded in clinician training and in human nature. Every time you catch yourself preparing to make the case for change and choose instead to ask what the client already knows, you are practicing MI. The discipline is internal first, behavioral second.</p>
<p>Notice where ambivalence is treated as pathology in your clinical environment — labeled as denial, resistance, or noncompliance — and gently offer a different reading: ambivalence means the person is thinking about it, and thinking about it is where change begins. Your role is not to resolve the ambivalence for them but to create conditions in which they can resolve it for themselves, toward something they actually want. That is the work. That is what endures.</p>`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isWeakDescription(desc, title) {
  if (!desc || desc.trim() === '') return true;
  // Description that is just the title or subtitle
  const cleaned = desc.trim().toLowerCase();
  const titleClean = (title || '').trim().toLowerCase();
  if (cleaned === titleClean) return true;
  if (cleaned.length < 80) return true;
  return false;
}

function isWeakConclusion(text) {
  if (!text || text.length < 50) return true;
  // The placeholder sentences both courses have
  if (/this course has provided a comprehensive examination.*continue to seek consultation/i.test(text)) return true;
  if (text.replace(/<[^>]+>/g, '').trim().length < 150) return true;
  return false;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n' + '='.repeat(72));
  console.log('fixCourseIntrosConclusions — ' + (DRY ? 'DRY RUN' : 'APPLYING WRITES'));
  console.log('='.repeat(72) + '\n');

  for (const patch of PATCHES) {
    const course = await col.findOne({ slug: patch.slug });
    if (!course) {
      console.log('NOT FOUND: ' + patch.slug);
      continue;
    }

    console.log('=== ' + patch.label + ' ===');
    console.log('  Current description (' + (course.description || '').length + ' chars): ' + (course.description || '(empty)').slice(0, 80) + '...');

    const setPayload = {};
    const actions = [];

    // 1. Description
    if (isWeakDescription(course.description, course.title)) {
      setPayload.description = patch.description;
      actions.push('description: ' + (course.description || '(empty)').slice(0, 40) + ' → ' + patch.description.slice(0, 60) + '...');
    } else {
      console.log('  description: OK (not replacing)');
    }

    // 2. Subtitle
    if (patch.subtitle && (!course.subtitle || course.subtitle.includes('Comprehensive') && course.subtitle.includes('3-Hour CE'))) {
      setPayload.subtitle = patch.subtitle;
      actions.push('subtitle: → ' + patch.subtitle);
    }

    // 3. Final section conclusion text block
    const sections = course.sections || [];
    const lastSection = sections[sections.length - 1];
    if (lastSection && patch.conclusionSectionTitle &&
        lastSection.title && lastSection.title.toLowerCase().includes(patch.conclusionSectionTitle.toLowerCase().split(' ')[0].toLowerCase())) {

      const blocks = lastSection.contentBlocks || [];
      const conclusionBlock = blocks.find(b => b.type === 'text' && isWeakConclusion(b.content));

      if (conclusionBlock) {
        // Build patched sections array
        const patchedSections = sections.map((sec, si) => {
          if (si !== sections.length - 1) return sec;
          const patchedBlocks = (sec.contentBlocks || []).map(b => {
            if (b === conclusionBlock || (b.type === 'text' && isWeakConclusion(b.content))) {
              return { ...b, content: patch.conclusionContent };
            }
            return b;
          });
          return { ...sec, contentBlocks: patchedBlocks };
        });
        setPayload.sections = patchedSections;
        actions.push('conclusion text block: replaced weak placeholder with full clinical synthesis');
      } else {
        console.log('  conclusion: no weak text block found in last section — checking manually');
        // Check if ANY text block in last section is weak
        const allWeak = blocks.filter(b => b.type === 'text').every(b => isWeakConclusion(b.content));
        console.log('  conclusion: all text blocks weak? ' + allWeak);
      }
    } else {
      console.log('  Last section title: ' + (lastSection ? lastSection.title : '(none)'));
    }

    if (actions.length === 0) {
      console.log('  Nothing to patch — already strong\n');
      continue;
    }

    actions.forEach(a => console.log('  PATCH: ' + a));

    if (!DRY) {
      setPayload.updatedAt = new Date();
      const result = await col.updateOne({ _id: course._id }, { $set: setPayload });
      if (result.modifiedCount === 1) {
        const rb = await col.findOne({ _id: course._id }, { projection: { description: 1, subtitle: 1, sections: 1 } });
        const rbDesc = (rb.description || '').length;
        const rbLastSec = (rb.sections || []).slice(-1)[0];
        const rbConclBlock = (rbLastSec && rbLastSec.contentBlocks || []).find(b => b.type === 'text');
        const rbConclLen = rbConclBlock ? (rbConclBlock.content || '').length : 0;
        console.log('  WRITTEN & verified: description=' + rbDesc + ' chars, conclusion block=' + rbConclLen + ' chars');
      } else {
        console.error('  WRITE FAILED');
      }
    }
    console.log();
  }

  // Verify CR-102 description while we're here
  console.log('=== CR-102 Crisis Intervention (verify only) ===');
  const cr102 = await col.findOne({ slug: 'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide' });
  if (cr102) {
    console.log('  description (' + (cr102.description || '').length + ' chars): ' + (cr102.description || '(empty)').slice(0, 100));
    const lastSec102 = (cr102.sections || []).slice(-1)[0];
    const lastBlock102 = lastSec102 && (lastSec102.contentBlocks || []).find(b => b.type === 'text');
    const concLen = lastBlock102 ? (lastBlock102.content || '').replace(/<[^>]+>/g, '').length : 0;
    console.log('  Last section: ' + (lastSec102 ? lastSec102.title : '(none)'));
    console.log('  Conclusion text length (stripped): ' + concLen + ' chars');
    if (isWeakDescription(cr102.description, cr102.title)) console.log('  ⚠️  description is weak — needs manual patch');
    else console.log('  ✅ description looks OK');
  } else {
    console.log('  NOT FOUND');
  }

  console.log('\n' + '='.repeat(72));
  if (DRY) console.log('Re-run with --apply to write.');
  console.log('='.repeat(72) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
