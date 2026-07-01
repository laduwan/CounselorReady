/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// FIX POST-TEST ANSWERS — Multiple Courses
// Sets correct answers from source markdown answer keys.
//
// Usage:
//   DRY RUN:  node src/scripts/fixPostTestAnswersBatch.js
//   APPLY:    node src/scripts/fixPostTestAnswersBatch.js --apply
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');

// Letter to index: a=0, b=1, c=2, d=3
const L = { a: 0, b: 1, c: 2, d: 3 };

// Answer keys per course slug
// Each entry: { sectionTitle, answers: [{ correct: index, explanation }] }
const COURSE_ANSWERS = {

  // ── WHEN IT RAINS, IT POURS ──
  'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities': {
    sections: {
      'Conclusion & Final Assessment': [
        { correct: L.b, explanation: 'Comorbidity is common, occurring in about 45% of cases with any diagnosis.' },
        { correct: L.b, explanation: 'Allostatic load refers to cumulative wear and tear from chronic stress.' },
        { correct: L.c, explanation: 'The cascade effect describes how one stressor triggers additional stressors.' },
        { correct: L.c, explanation: 'Perpetuating factors refers to what maintains problems in the present.' },
        { correct: L.c, explanation: 'Life-threatening behaviors should be addressed first per DBT hierarchy.' },
        { correct: L.b, explanation: 'A keystone problem has outsized influence affecting multiple areas.' },
        { correct: L.b, explanation: 'Transdiagnostic approaches target processes across diagnostic categories.' },
        { correct: L.b, explanation: 'Emotional avoidance appears across depression, anxiety, PTSD, and substance use.' },
        { correct: L.c, explanation: 'The Unified Protocol addresses anxiety, depression, and related disorders through shared mechanisms.' },
        { correct: L.b, explanation: 'Obtain appropriate releases and share information relevant to coordination.' },
        { correct: L.c, explanation: 'Seek to understand different perspectives while focusing on client welfare.' },
        { correct: L.c, explanation: 'Allocate time for crises while maintaining focus on underlying patterns.' },
        { correct: L.b, explanation: 'Session structure includes collaborative agenda setting and the "parking lot" technique.' },
        { correct: L.c, explanation: 'Signs of overwhelm include dreading sessions and feeling hopeless.' },
        { correct: L.b, explanation: 'Balance high-intensity and lower-intensity clients in caseload management.' },
        { correct: L.b, explanation: 'Progress with complex clients is typically nonlinear with expected setbacks.' },
        { correct: L.b, explanation: 'The action-mood relationship applies across multiple conditions.' },
        { correct: L.c, explanation: 'Regularly return to goals while updating the plan as genuinely needed.' },
        { correct: L.b, explanation: 'Self-care is essential for sustainable practice.' },
        { correct: L.b, explanation: 'Clinicians can work effectively with complexity using systematic approaches.' },
      ],
    },
  },

  // ── IT TAKES A VILLAGE ──
  'it-takes-a-village-collaborative-care': {
    sections: {
      'Conclusion & Final Assessment': [
        { correct: L.c, explanation: 'The consultee retains clinical and ethical responsibility.' },
        { correct: L.c, explanation: 'In consultation, the consultee retains autonomous decision-making.' },
        { correct: L.b, explanation: 'Consult when having questions about ethical obligations or professional practice.' },
        { correct: L.b, explanation: 'Clarify the specific question and gather relevant information.' },
        { correct: L.b, explanation: 'Document date, consultant credentials, issue, input, and decisions.' },
        { correct: L.c, explanation: 'Effective consultants ask before telling and respect autonomy.' },
        { correct: L.b, explanation: 'Refer when the client needs services outside your expertise or scope.' },
        { correct: L.b, explanation: 'Warm handoff involves direct connection with the receiving provider.' },
        { correct: L.b, explanation: 'Share relevant information with appropriate releases.' },
        { correct: L.c, explanation: 'Focus on client welfare and seek to understand different perspectives.' },
        { correct: L.b, explanation: 'Different disciplines bring different training and perspectives.' },
        { correct: L.c, explanation: 'Political views of providers are not a component of informed consent.' },
        { correct: L.c, explanation: 'Consultation should be ongoing practice, not just crisis response.' },
        { correct: L.c, explanation: 'Frame appropriately, normalize, and provide specific resources.' },
        { correct: L.b, explanation: 'Releases should specify scope, direction, and duration.' },
        { correct: L.b, explanation: 'Effective meetings have clear purpose, agenda, and action items.' },
        { correct: L.b, explanation: 'Focus on client welfare and address conflicts directly.' },
        { correct: L.b, explanation: 'The consultee retains responsibility for clinical decisions.' },
        { correct: L.b, explanation: 'Complex clients require collaborative care involving multiple providers.' },
        { correct: L.b, explanation: 'Follow up to check if the client connected and explore barriers.' },
      ],
    },
  },

  // ── LOST IN TRANSLATION ──
  'lost-in-translation-bridging-cultural-divides': {
    sections: {
      'Conclusion & Final Assessment': [
        { correct: L.b, explanation: 'Historical context for multicultural counseling emergence.' },
        { correct: L.b, explanation: "Sue's Tripartite Model domains." },
        { correct: L.c, explanation: 'Distinguishing feature of cultural humility.' },
        { correct: L.b, explanation: 'Characteristics of Immersion-Emersion.' },
        { correct: L.b, explanation: 'Purpose of the ADDRESSING framework.' },
        { correct: L.c, explanation: 'The CFI does not assess "cultural intelligence quotient."' },
        { correct: L.b, explanation: "Culturally responsive differentiation." },
        { correct: L.b, explanation: 'Minority stress model explanation.' },
        { correct: L.b, explanation: 'Definition of microinvalidations.' },
        { correct: L.c, explanation: 'Research findings on implicit bias.' },
        { correct: L.c, explanation: 'Invisibility of unearned advantages to those who possess them.' },
        { correct: L.c, explanation: 'Appropriate microaggression repair.' },
        { correct: L.c, explanation: 'Autonomy stage characteristics.' },
        { correct: L.b, explanation: 'Approaching differences with curiosity and willingness to adapt.' },
        { correct: L.b, explanation: 'Understanding multicultural competence development.' },
      ],
    },
  },

  // ── PURSUIT OF HAPPYNESS ──
  'the-pursuit-of-happyness-treating-anxiety-and-depression': {
    sections: {
      'Conclusion & Final Assessment': [
        { correct: L.b, explanation: 'Core cognitive model principle.' },
        { correct: L.c, explanation: 'Prevents extinction learning and maintains fear.' },
        { correct: L.b, explanation: "Beck's cognitive triad." },
        { correct: L.b, explanation: 'Core behavioral activation principle.' },
        { correct: L.d, explanation: 'PHQ-9 severity cutoffs.' },
        { correct: L.b, explanation: 'Socratic method.' },
        { correct: L.a, explanation: 'Behavioral experiment purpose.' },
        { correct: L.b, explanation: 'Inhibitory learning model.' },
        { correct: L.b, explanation: 'Interoceptive exposure definition.' },
        { correct: L.b, explanation: "ACT's primary goal." },
        { correct: L.b, explanation: "MBCT's specific indication." },
        { correct: L.b, explanation: 'MBC benefit.' },
        { correct: L.c, explanation: 'Expected early response trajectory.' },
        { correct: L.b, explanation: 'Relapse prevention components.' },
        { correct: L.b, explanation: 'Stepped care model.' },
      ],
    },
  },
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  console.log(`${DRY_RUN ? '🔍 DRY RUN' : '⚡ APPLYING'} — Fix Post-Test Answers (Batch)\n`);

  let totalFixed = 0;

  for (const [slug, config] of Object.entries(COURSE_ANSWERS)) {
    const course = await collection.findOne({ slug });
    if (!course) { console.log(`⚠️  Course not found: ${slug}\n`); continue; }

    console.log(`📄 ${course.title}`);
    let courseFixed = 0;

    for (const section of (course.sections || [])) {
      const answers = config.sections[section.title];
      if (!answers) continue;

      const mcBlocks = (section.contentBlocks || []).filter(b => b.type === 'multipleChoice');
      
      for (let qi = 0; qi < mcBlocks.length && qi < answers.length; qi++) {
        const block = mcBlocks[qi];
        const ak = answers[qi];

        if (!DRY_RUN) {
          block.options.forEach((opt, i) => { opt.isCorrect = (i === ak.correct); });
          block.explanation = ak.explanation;
        }

        const letter = String.fromCharCode(65 + ak.correct);
        const optText = block.options[ak.correct]?.text?.substring(0, 45) || '?';
        console.log(`   Q${qi + 1}: ${letter}) ${optText}...`);
        courseFixed++;
      }

      if (mcBlocks.length !== answers.length) {
        console.log(`   ⚠️  Expected ${answers.length} questions, found ${mcBlocks.length} in "${section.title}"`);
      }
    }

    if (courseFixed > 0 && !DRY_RUN) {
      await collection.updateOne({ _id: course._id }, { $set: { sections: course.sections } });
      console.log(`   ✅ Fixed ${courseFixed} answers`);
    } else if (courseFixed > 0) {
      console.log(`   → ${courseFixed} answers to fix`);
    }

    totalFixed += courseFixed;
    console.log('');
  }

  console.log(`Total: ${totalFixed} answers ${DRY_RUN ? 'to fix' : 'fixed'}`);
  if (DRY_RUN) console.log('Run with --apply to save');

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
