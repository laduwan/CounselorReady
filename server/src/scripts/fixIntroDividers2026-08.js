/**
 * fixIntroDividers2026-08.js — one-time structural fix for course intros.
 *
 * Audit (2026-08-28) found 38 live courses whose section 1 either has no
 * `sectionDivider` as its first content block, or has one missing a
 * `subtitle` — both required by §2 of the Seed Script Structure Reference.
 * This script closes that gap only. It does not touch conclusions, body
 * prose, assessments, or any other field.
 *
 * Two operations, both idempotent (safe to re-run):
 *   - insert   : section 1's first block isn't a sectionDivider. Insert one
 *                (title reused from the section's existing title, or a
 *                short section-specific title where the original was a
 *                placeholder like "Section 1"; subtitle is the course's own
 *                already-authored description, trimmed to its first
 *                sentence — no invented clinical content). Every existing
 *                block's `order` shifts +1 to stay behind it.
 *   - subtitle : section 1 already opens with a sectionDivider but it has
 *                no subtitle. Add one, sourced the same way. Nothing else
 *                on the block changes.
 *
 * Usage (from server/):
 *   node src/scripts/fixIntroDividers2026-08.js            # dry run, no writes
 *   node src/scripts/fixIntroDividers2026-08.js --apply    # writes via doc.save()
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const FIXES = [
  { op: 'insert', slug: 'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide', courseCode: 'CR-102', title: 'When the Moment Arrives', subtitle: 'Mental health professionals encounter crisis presentations daily — and the stakes of an inadequate response are measured in lives.' },
  { op: 'insert', slug: 'suicide-assessment-safety-planning', courseCode: 'CR-103', title: 'Epidemiology and Frameworks', subtitle: 'Suicide assessment is one of the most critical competencies for mental health professionals.' },
  { op: 'insert', slug: 'suicide-risk-assessment-interactive', courseCode: 'CR-104', title: 'Understanding Suicide – Epidemiology and Theoretical Foundations', subtitle: 'Suicide remains one of the leading causes of death in the United States, claiming approximately 49,500 lives annually.' },
  { op: 'insert', slug: 'ethics-and-professional-boundaries-in-counseling-practice', courseCode: 'CR-201', title: 'Foundations of Counseling Ethics', subtitle: 'This comprehensive course examines the ethical foundations essential to professional counseling practice, with particular emphasis on the 2014 ACA Code of Ethics and its practical applications in contemporary clinical settings.' },
  { op: 'insert', slug: 'mandated-reporter-duty', courseCode: 'CR-202', title: 'Course Introduction', subtitle: 'Mandated reporting is a critical legal and ethical duty for many professionals, established to protect vulnerable populations—such as children, the elderly, and dependent adults—from harm.' },
  { op: 'insert', slug: 'mental-health-billing-essentials', courseCode: 'CR-204', title: 'Module 1: Mental Health Billing Fundamentals', subtitle: 'This comprehensive 1-hour continuing education course provides licensed professional counselors with essential knowledge and skills in mental health billing practices.' },
  { op: 'insert', slug: 'cultural-humility-clinical-practice', courseCode: 'CR-303', title: 'From Competence to Humility', subtitle: 'Cultural competence has long been the standard framework for multicultural training in counseling, but the research on effective cross-cultural practice increasingly points to a different construct: cultural humility — an ongoing orientation of curiosity, self-reflection, and openness to learning from clients about their own cultural experience.' },
  { op: 'insert', slug: 'beyond-the-uniform-first-responder-families', courseCode: 'CR-304', title: 'Understanding First Responder Culture and Barriers to Help-Seeking', subtitle: 'First responders — law enforcement, firefighters, emergency medical personnel, military — face occupational stressors that create distinctive mental health profiles in both the individual and the family system.' },
  { op: 'insert', slug: 'small-warriors-big-battles-parental-incarceration', courseCode: 'CR-305', title: 'Scope, Demographics, and Developmental Impact of Parental Incarceration', subtitle: 'An estimated 2.7 million American children have a parent who is currently incarcerated — a population whose psychological needs are largely invisible to the systems designed to serve them.' },
  { op: 'insert', slug: 'lost-in-translation-bridging-cultural-divides', courseCode: 'CR-308', title: 'Course Introduction & Overview', subtitle: 'In the acclaimed film Lost in Translation, two Americans adrift in Tokyo discover that meaningful connection transcends language barriers—yet genuine understanding requires intentional effort, humility, and willingness to sit with discomfort.' },
  { op: 'insert', slug: 'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities', courseCode: 'CR-403', title: 'Course Introduction & Overview', subtitle: 'Life rarely delivers challenges one at a time — clients often arrive drowning in multiple simultaneous stressors, layered diagnoses, and cascading crises.' },
  { op: 'insert', slug: 'it-takes-a-village-collaborative-care', courseCode: 'CR-404', title: 'Course Introduction & Overview', subtitle: 'The African proverb "It takes a village to raise a child" captures a fundamental truth about human flourishing—we cannot do it alone.' },
  { op: 'insert', slug: 'therapeutic-rapport', courseCode: 'CR-408', title: 'The Alliance Matters', subtitle: 'The therapeutic alliance is the most consistent predictor of positive outcomes across all therapeutic approaches.' },
  { op: 'insert', slug: 'dbt-skills-in-action', courseCode: 'CR-410', title: 'DBT Foundations', subtitle: 'Dialectical Behavior Therapy has revolutionized treatment for emotional dysregulation.' },
  { op: 'insert', slug: 'narrative-therapy-techniques', courseCode: 'CR-411', title: 'The Story Behind the Story: Narrative Therapy Foundations', subtitle: "Every client walks in with a story — and most of the time, it's the wrong one." },
  { op: 'insert', slug: 'cbt-toolbox-core-techniques', courseCode: 'CR-412', title: 'Introduction', subtitle: 'Cognitive Behavioral Therapy remains one of the most researched and effective approaches in mental health treatment.' },
  { op: 'insert', slug: 'motivational-interviewing-in-first-sessions', courseCode: 'CR-413', title: 'Foundations of Motivational Interviewing in First Sessions', subtitle: 'This comprehensive 1-hour continuing education course explores the effective application of motivational interviewing (MI) techniques during initial counseling sessions.' },
  { op: 'insert', slug: 'existential-theory-in-clinical-practice', courseCode: 'CR-414', title: 'Foundations of Existential Theory', subtitle: 'This comprehensive 1-hour course provides licensed professional counselors with an in-depth exploration of existential theory and its practical applications in mental health treatment.' },
  { op: 'insert', slug: 'neurobiology-of-trauma', courseCode: 'CR-418', title: 'What the Brain Remembers', subtitle: 'Trauma does not live only in memory — it lives in the body, the nervous system, and the brain structures that regulate safety, emotion, and meaning.' },
  { op: 'insert', slug: 'trauma-informed-care', courseCode: 'CR-419', title: 'Foundations of Trauma-Informed Care', subtitle: 'This comprehensive 4-hour course provides mental health professionals with foundational knowledge and practical skills to implement trauma-informed care across clinical settings.' },
  { op: 'insert', slug: 'trauma-informed-care-foundations', courseCode: 'CR-420', title: 'Understanding Trauma', subtitle: 'Trauma is not a specialty — it is a context that shapes every clinical encounter.' },
  { op: 'insert', slug: 'mindfulness-introduction', courseCode: 'CR-423', title: 'Understanding Mindfulness', subtitle: 'Mindfulness has moved from the meditation cushion into the clinical office — and the research supporting its integration into mental health treatment is now substantial.' },
  { op: 'insert', slug: 'good-will-hunting-trauma-attachment', courseCode: 'CR-434', title: 'Introduction: Clinical Teaching Through Film', subtitle: "This continuing education course uses the critically acclaimed film 'Good Will Hunting' as a clinical teaching tool to explore complex trauma, attachment disruption, and the healing power of the therapeutic relationship." },
  { op: 'insert', slug: 'black-swan', courseCode: 'CR-435', title: 'Black Swan: Perfectionism and Anxiety Disorders in Clinical Practice', subtitle: 'Perfectionism and clinical anxiety exist on a spectrum from adaptive striving to a level of rigidity that is genuinely disabling — and clinicians who cannot distinguish between them miss the treatment target.' },
  { op: 'insert', slug: 'ordinary-people', courseCode: 'CR-436', title: 'Ordinary People: Family Systems and Grief in Clinical Practice', subtitle: 'Grief and family systems interact in ways that are often invisible until the pressure becomes unbearable — and understanding that interaction is essential for effective clinical work with bereaved families.' },
  { op: 'insert', slug: 'sixth-sense', courseCode: 'CR-437', title: 'The Sixth Sense: Clinical Intuition and Assessment in Counseling', subtitle: 'Clinical intuition is real, it is research-supported, and it is trainable — yet most clinicians neither understand its mechanisms nor use it deliberately.' },
  { op: 'insert', slug: 'psychopharmacology-for-counselors', courseCode: 'CR-501', title: 'Why Counselors Need Psychopharmacology Knowledge', subtitle: 'Non-prescribing mental health professionals increasingly work with clients who take psychiatric medications.' },
  { op: 'insert', slug: 'psychiatric-medications-basics', courseCode: 'CR-502', title: 'Antidepressants', subtitle: 'Mental health professionals who understand psychopharmacology collaborate more effectively with prescribers, support clients in making informed treatment decisions, and recognize medication-related clinical presentations that require coordination or referral.' },
  { op: 'insert', slug: 'the-pursuit-of-happyness-treating-anxiety-and-depression', courseCode: 'CR-PHY', title: 'Course Introduction & Overview', subtitle: 'Anxiety and depressive disorders represent the most prevalent mental health conditions encountered in clinical practice, affecting approximately 40 million and 21 million American adults respectively each year.' },
  { op: 'insert', slug: 'cr-theo-604-solution-focused-brief-therapy', courseCode: 'CR-THEO-604', title: 'Introduction: A Different Kind of Listening', subtitle: 'This course provides a comprehensive exploration of Solution-Focused Brief Therapy (SFBT) with a specific focus on application within community mental health settings.' },
  { op: 'insert', slug: 'cr-add-701-co-occurring-disorders', courseCode: 'CR-ADD-701', title: 'Introduction and Learning Objectives', subtitle: 'This three-hour continuing education course prepares licensed mental health professionals to identify, assess, and treat clients presenting with co-occurring substance use and mental health disorders using an integrated treatment framework.' },
  { op: 'insert', slug: 'cr-cli-603-internal-family-systems', courseCode: 'CR-CLI-603', title: 'Introduction: Why the Mind is Multiple', subtitle: 'This 3-hour continuing education course introduces licensed counselors to the Internal Family Systems (IFS) model developed by Richard C. Schwartz.' },

  { op: 'subtitle', slug: '28-days-later-understanding-addiction-and-recovery', courseCode: 'CR-301', subtitle: 'Addiction is not a moral failure — it is a complex neurobiological condition with powerful psychological, social, and environmental dimensions.' },
  { op: 'subtitle', slug: 'beyond-the-surface-multicultural-competence-in-clinical-practice', courseCode: 'CR-302', subtitle: 'Multicultural competence is not a credential earned through a single training — it is built through sustained self-examination, practice across difference, and an ongoing commitment to understanding how culture shapes every clinical encounter.' },
  { op: 'subtitle', slug: 'motivational-interviewing-from-ambivalence-to-action', courseCode: 'CR-307', subtitle: 'Ambivalence about change is not resistance — it is a normal human experience that Motivational Interviewing is specifically designed to navigate.' },
  { op: 'subtitle', slug: 'cultural-competence-ethics-risk-reduction-cr601', courseCode: 'CR-CULTR-601', subtitle: 'The intersection of cultural competence and ethical practice is not incidental — it is where the most consequential clinical decisions are made.' },
  { op: 'subtitle', slug: 'the-elephant-in-the-room-navigating-difficult-conversations-in-therapy', courseCode: 'CR-415', subtitle: 'Every therapy room has elephants — the obvious issues that both therapist and client recognize but neither addresses.' },
];

async function run() {
  const apply = process.argv.includes('--apply');
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(apply ? '=== APPLY MODE (writing) ===' : '=== DRY RUN (no writes; pass --apply to write) ===');

  const results = [];

  for (const fix of FIXES) {
    const doc = await Course.findOne({ slug: fix.slug });
    if (!doc) { results.push({ ...fix, status: 'ERROR: course not found' }); continue; }
    if (!doc.sections || !doc.sections[0]) { results.push({ ...fix, status: 'ERROR: no sections[0]' }); continue; }

    const section0 = doc.sections[0];
    const blocks = section0.contentBlocks;
    if (!blocks || blocks.length === 0) { results.push({ ...fix, status: 'ERROR: sections[0] has no contentBlocks' }); continue; }

    if (fix.op === 'insert') {
      if (blocks[0].type === 'sectionDivider') {
        results.push({ ...fix, status: 'SKIP: already has a leading sectionDivider' });
        continue;
      }
      // shift everything else down to make room, then insert the divider at position 0
      blocks.forEach((b) => { b.order = (b.order || 0) + 1; });
      blocks.unshift({
        type: 'sectionDivider',
        title: fix.title,
        subtitle: fix.subtitle,
        sectionNumber: 1,
        order: 1,
      });
      results.push({ ...fix, status: apply ? 'INSERTED' : 'WOULD INSERT' });
    } else if (fix.op === 'subtitle') {
      const first = blocks[0];
      if (first.type !== 'sectionDivider') {
        results.push({ ...fix, status: 'ERROR: expected leading sectionDivider, found ' + first.type });
        continue;
      }
      if (first.subtitle && first.subtitle.trim()) {
        results.push({ ...fix, status: 'SKIP: subtitle already present' });
        continue;
      }
      first.subtitle = fix.subtitle;
      results.push({ ...fix, status: apply ? 'SUBTITLE SET' : 'WOULD SET SUBTITLE' });
    }

    if (apply) {
      doc.markModified('sections');
      try {
        await doc.save();
      } catch (e) {
        results[results.length - 1].status = 'ERROR on save: ' + e.message;
      }
    }
  }

  console.log('\n' + results.map(r => `${(r.status || '').padEnd(34)} ${r.courseCode.padEnd(14)} ${r.slug}`).join('\n'));
  const errors = results.filter(r => r.status.startsWith('ERROR'));
  console.log(`\n${results.length} total | ${errors.length} errors`);
  if (errors.length) process.exitCode = 1;

  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(e => { console.error('SCRIPT ERROR:', e.message); process.exit(1); });
}
