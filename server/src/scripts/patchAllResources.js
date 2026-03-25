import { MongoClient } from 'mongodb';

const client = await MongoClient.connect(process.env.MONGODB_URI);
const db = client.db();
const col = db.collection('interactivecourses');

// ── Neurobiology of Trauma ──
const neuroResources = [
  { title: 'Brain Structures Quick Reference Card', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1769534520/brain-structures-card_cwsegs.pdf',
    description: 'Printable reference card for key brain structures in trauma' },
  { title: 'Window of Tolerance Worksheet', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1769535553/window-of-tolerance-worksheet_nf5jco.pdf',
    description: 'Client worksheet for tracking nervous system regulation states' },
  { title: 'Polyvagal State Assessment Checklist', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1769535549/polyvagal-checklist_svfqs2.pdf',
    description: 'Quick checklist for identifying client nervous system states' },
  { title: 'Grounding Techniques Handout', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1769535547/grounding-techniques_iyj5it.pdf',
    description: 'Client handout with 15+ regulation techniques' },
  { title: 'Trauma Memory vs Normal Memory Comparison', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1769535547/memory-comparison-card_ui6fge.pdf',
    description: 'Visual comparison chart for client psychoeducation' },
];

// ── Mastering TeleMental Health (CR-TMH601) ──
const tmhResources = [
  { title: 'TMH Suitability Framework', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773136318/TMH_Suitability_Framework_v2_fivltr.png',
    description: 'Visual framework for assessing client telehealth suitability' },
  { title: 'Therapeutic Presence in TeleMental Health', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773136659/TMH_Therapeutic_Presence_v2_yvns9p.png',
    description: 'Guide to maintaining therapeutic presence via telehealth' },
  { title: 'Zoom Fatigue — Clinical Considerations', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773136661/TMH_Zoom_Fatigue_v2_f3jc6f.png',
    description: 'Reference for identifying and addressing video fatigue in clients' },
  { title: 'TMH Suitability Assessment Worksheet', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773131853/TMH_Suitability_Assessment_Worksheet_kam65a.pdf',
    description: 'Structured worksheet for documenting telehealth suitability' },
  { title: 'TMH Session Checklist', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773131852/TMH_Session_Checklist_hqngsi.pdf',
    description: 'Pre/during/post session checklist for telehealth compliance' },
  { title: 'HIPAA Quick Reference for Telehealth', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773131847/TMH_HIPAA_Quick_Reference_lfswtz.pdf',
    description: 'Key HIPAA requirements specific to telehealth practice' },
  { title: 'TMH Crisis Intervention Protocol', type: 'pdf',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773131845/TMH_Crisis_Intervention_Protocol_bjhjdl.pdf',
    description: 'Step-by-step crisis response protocol for remote sessions' },
];

// ── Suicide Risk Assessment ──
const suicideResources = [
  { title: 'Special Populations — Suicide Risk Reference', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003508/special_populations_jjjabo.svg',
    description: 'Clinical reference for suicide risk across special populations' },
  { title: 'Columbia Suicide Severity Rating Scale (C-SSRS)', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003505/cssrs_scale_zohehi.svg',
    description: 'Evidence-based suicide severity rating scale' },
  { title: 'Suicide Epidemiology Overview', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003508/suicide_epidemiology_ex88fx.svg',
    description: 'Key epidemiological data on suicide rates and risk factors' },
  { title: 'Safety Plan Steps', type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003507/safety_plan_steps_vqxcno.svg',
    description: 'Step-by-step safety planning framework' },
];

const patches = [
  { regex: /neurobiology of trauma/i, resources: neuroResources, label: 'Neurobiology of Trauma' },
  { regex: /telemental health/i,       resources: tmhResources,     label: 'Mastering TeleMental Health' },
  { regex: /suicide risk assessment/i, resources: suicideResources, label: 'Suicide Risk Assessment' },
  { regex: /dialectical behavior therapy/i, resources: [],          label: 'DBT (clear undefined)' },
];

for (const p of patches) {
  const r = await col.findOneAndUpdate(
    { title: { $regex: p.regex } },
    { $set: { resources: p.resources } },
    { returnDocument: 'after' }
  );
  console.log(`✅ ${p.label}: ${r?.resources?.length ?? 'NOT FOUND'} resources`);
}

await client.close();
console.log('Done.');
