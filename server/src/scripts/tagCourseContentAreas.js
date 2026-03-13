#!/usr/bin/env node
/**
 * tagCourseContentAreas.js
 *
 * Tags every course in interactivecourses with a proper contentArea
 * based on title/content keywords.
 *
 * Content Areas:
 *   Ethics, Supervision, Telehealth, Crisis & Safety,
 *   Trauma & Neuroscience, Multicultural & Social Justice,
 *   Addiction & Recovery, Evidence-Based Treatment,
 *   Geriatric Mental Health, Clinical Skills, Psychopharmacology,
 *   Documentation & Billing, Career Development, Wellness & Prevention
 *
 * Run: node src/scripts/tagCourseContentAreas.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

// ============================================
// EXPLICIT SLUG MAPPINGS (highest priority)
// ============================================
const SLUG_MAP = {
  // --- Ethics ---
  'navigating-ethical-dilemmas': 'Ethics',
  'digital-mental-health-ethics': 'Ethics',
  'advanced-ethics-clinical-decisions': 'Ethics',
  'ethics-mental-health-counseling': 'Ethics',
  'ethics-essentials': 'Ethics',
  'ethics-professional-boundaries-counseling': 'Ethics',
  'cultural-competence-ethics-risk-reduction-cr601': 'Ethics',
  'mandated-reporter-duty': 'Ethics',

  // --- Supervision ---
  'it-takes-a-village-consultation-referral': 'Supervision',

  // --- Telehealth ---
  'telehealth-best-practices': 'Telehealth',
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo': 'Telehealth',

  // --- Crisis & Safety ---
  'suicide-assessment-safety-planning': 'Crisis & Safety',
  'suicide-risk-assessment-comprehensive': 'Crisis & Safety',
  'crisis-intervention-lpcs': 'Crisis & Safety',
  'suicide-risk-assessment-interactive': 'Crisis & Safety',
  'suicide-risk-assessment-evidence-based-approaches': 'Crisis & Safety',
  'crisis-intervention-suicide-prevention-comprehensive': 'Crisis & Safety',
  'still-standing-geriatric-suicide-risk-assessment-safety-planning': 'Crisis & Safety',
  'walking-on-eggshells-high-conflict-clients': 'Crisis & Safety',

  // --- Trauma & Neuroscience ---
  'trauma-informed-care-foundations': 'Trauma & Neuroscience',
  'trauma-informed-anxiety-treatment': 'Trauma & Neuroscience',
  'tf-cbt-children-adolescents': 'Trauma & Neuroscience',
  'emdr-comprehensive-training': 'Trauma & Neuroscience',
  'sexual-trauma-specialized-treatment': 'Trauma & Neuroscience',
  'sexual-trauma-assessment-treatment': 'Trauma & Neuroscience',
  'neurobiology-of-trauma': 'Trauma & Neuroscience',
  'trauma-informed-care': 'Trauma & Neuroscience',
  'trauma-informed-care-foundations-clinical-practice': 'Trauma & Neuroscience',
  'trauma-informed-anxiety-cr202': 'Trauma & Neuroscience',
  'small-warriors-big-battles-parental-incarceration': 'Trauma & Neuroscience',
  'beyond-the-uniform-first-responder-families': 'Trauma & Neuroscience',
  'when-it-rains-it-pours-multiple-stressors': 'Trauma & Neuroscience',

  // --- Multicultural & Social Justice ---
  'cultural-humility-clinical-practice': 'Multicultural & Social Justice',
  'multicultural-counseling-competencies': 'Multicultural & Social Justice',
  'neurodiversity-affirming-therapy': 'Multicultural & Social Justice',
  'cultural-competency': 'Multicultural & Social Justice',
  'sexuality-identity-mental-health-lgbtq': 'Multicultural & Social Justice',

  // --- Addiction & Recovery ---
  'harm-reduction-substance-use': 'Addiction & Recovery',
  'co-occurring-disorders-treatment': 'Addiction & Recovery',
  'substance-use-recovery-coach-certification': 'Addiction & Recovery',
  '28-days-later-understanding-addiction-recovery': 'Addiction & Recovery',
  'seasoned-and-struggling-substance-use-disorders-older-adults': 'Addiction & Recovery',
  'compulsive-sexual-behavior-intimacy-disorders': 'Addiction & Recovery',

  // --- Evidence-Based Treatment ---
  'cbt-toolbox-core-techniques': 'Evidence-Based Treatment',
  'dbt-skills-in-action': 'Evidence-Based Treatment',
  'motivational-interviewing-art': 'Evidence-Based Treatment',
  'treating-anxiety-evidence-based': 'Evidence-Based Treatment',
  'dbt-complete-skills-training': 'Evidence-Based Treatment',
  'schema-therapy-comprehensive': 'Evidence-Based Treatment',
  'sfbt-couples-therapy': 'Evidence-Based Treatment',
  'personality-disorders-dbt-skills': 'Evidence-Based Treatment',
  'narrative-therapy-fundamentals': 'Evidence-Based Treatment',
  'dbt-skills-training-comprehensive': 'Evidence-Based Treatment',
  'narrative-therapy-techniques': 'Evidence-Based Treatment',
  'motivational-interviewing-core-skills': 'Evidence-Based Treatment',
  'motivational-interviewing-ambivalence-to-action': 'Evidence-Based Treatment',
  'cognitive-reframing-anxiety-cr203': 'Evidence-Based Treatment',
  'systemic-family-therapy': 'Evidence-Based Treatment',
  'attachment-theory-therapy-lifespan': 'Evidence-Based Treatment',
  'eating-disorders-evidence-based-treatment': 'Evidence-Based Treatment',

  // --- Geriatric Mental Health ---
  'unretiring-the-self-identity-purpose-depression-older-adults': 'Geriatric Mental Health',
  'the-long-goodbye-dementia-grief-family-systems': 'Geriatric Mental Health',
  'the-final-chapter-end-of-life-counseling-death-anxiety-meaning-making': 'Geriatric Mental Health',
  'fading-voices-lasting-connections-cr-sp-402': 'Geriatric Mental Health',
  'grief-counseling-lifespan': 'Geriatric Mental Health',
  'grief-bereavement-counseling-certification': 'Geriatric Mental Health',
  'divorce-recovery-support-certification': 'Geriatric Mental Health',

  // --- Clinical Skills ---
  'active-listening-skills': 'Clinical Skills',
  'therapeutic-rapport': 'Clinical Skills',
  'mindfulness-introduction': 'Clinical Skills',
  'clinical-assessment-diagnosis-dsm5': 'Clinical Skills',
  'chronic-pain-mind-body-treatment': 'Clinical Skills',
  'perinatal-mental-health': 'Clinical Skills',
  'elephant-in-the-room-difficult-conversations': 'Clinical Skills',
  'sexual-health-across-the-lifespan': 'Clinical Skills',
  'sex-therapy-foundations': 'Clinical Skills',
  'adoptive-foster-family-support-certification': 'Clinical Skills',
  'blended-family-transition-support-certification': 'Clinical Skills',
  'eating-disorder-recovery-coach-certification': 'Clinical Skills',
  'beautiful-mind': 'Clinical Skills',
  'black-swan': 'Clinical Skills',
  'ordinary-people': 'Clinical Skills',
  'sixth-sense': 'Clinical Skills',
  'good-will-hunting-trauma-attachment': 'Clinical Skills',
  'eternal-sunshine-neuroscience-romantic-reconnection-cr405': 'Clinical Skills',

  // --- Psychopharmacology ---
  'psychiatric-medications-basics': 'Psychopharmacology',
  'psychopharmacology-mental-health': 'Psychopharmacology',
  'psychopharmacology-for-counselors': 'Psychopharmacology',

  // --- Documentation & Billing ---
  'clinical-documentation-effective': 'Documentation & Billing',
  'clinical-documentation': 'Documentation & Billing',

  // --- Career Development ---
  'ncmhce-study-starter': 'Career Development',

  // --- Wellness & Prevention ---
  'self-care-clinicians': 'Wellness & Prevention',
};

// Regex fallback rules for courses not in SLUG_MAP (order matters — first match wins)
const RULES = [
  { pattern: /ethic|boundar|dual.relat|consent|confidential|mandated.report|professional.practice/i, area: 'Ethics' },
  { pattern: /supervis|cpcs|acs|mentor|oversight|consult.*referral|collaborat.*care/i, area: 'Supervision' },
  { pattern: /telehealth|telement|virtual.practice|online.therap|remote.counsel/i, area: 'Telehealth' },
  { pattern: /suicid|crisis|safety.plan|involuntary|risk.assess|high.conflict/i, area: 'Crisis & Safety' },
  { pattern: /trauma|ptsd|neuro.*trauma|emdr|wound|resilience|incarcerat|first.respond/i, area: 'Trauma & Neuroscience' },
  { pattern: /cultur|multicult|divers|immigr|refugee|racial|lgbtq|equity|neurodivers|identity/i, area: 'Multicultural & Social Justice' },
  { pattern: /addict|substance|recovery|sobriet|alcohol|opioid|harm.reduction|co.occur/i, area: 'Addiction & Recovery' },
  { pattern: /cbt|dbt|dialectic|cognitive.behav|motivat.*interview|schema|narrative|solution.focus|exposure|behav.*activ/i, area: 'Evidence-Based Treatment' },
  { pattern: /geriatr|older.adult|aging|dementia|elder|retire|long.goodbye|final.chapter|end.of.life|grief|bereave/i, area: 'Geriatric Mental Health' },
  { pattern: /psychopharm|medicat|prescrib|pharmacol/i, area: 'Psychopharmacology' },
  { pattern: /document|billing|superbill|insurance|coding|icd|cpt/i, area: 'Documentation & Billing' },
  { pattern: /career|vocational|ncmhce|licensure|study.starter/i, area: 'Career Development' },
  { pattern: /self.care|burnout|wellness|prevent|compassion.fatigue/i, area: 'Wellness & Prevention' },
  { pattern: /listen|rapport|mindful|session|assess|diagnos|dsm|couple|family|attach|intimate|sex|perinat/i, area: 'Clinical Skills' },
];

function detectContentArea(slug, title, description) {
  // 1. Try explicit slug mapping
  if (SLUG_MAP[slug]) return SLUG_MAP[slug];

  // 2. Regex fallback on title + description
  const text = (title + ' ' + (description || '')).toLowerCase();
  for (const rule of RULES) {
    if (rule.pattern.test(text)) return rule.area;
  }

  // 3. Default
  return 'Clinical Skills';
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  const courses = await col.find({}).toArray();
  console.log(`Found ${courses.length} courses\n`);

  let updated = 0;
  let unchanged = 0;

  for (const c of courses) {
    const area = detectContentArea(c.slug || '', c.title || '', c.description || '');
    const current = c.contentArea || '';

    if (current === area) {
      console.log(`  [ok] ${(c.title || '').substring(0, 60)} -> ${current}`);
      unchanged++;
    } else {
      await col.updateOne(
        { _id: c._id },
        { $set: { contentArea: area, contentAreaDisplay: area, updatedAt: new Date() } }
      );
      console.log(`  [set] ${(c.title || '').substring(0, 60)} -> ${area}${current ? ` (was: ${current})` : ''}`);
      updated++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Updated: ${updated} | Already correct: ${unchanged}`);
  console.log('='.repeat(50));

  // Distribution
  const tagged = await col.find({}).toArray();
  const counts = {};
  for (const t of tagged) {
    const a = t.contentArea || 'UNTAGGED';
    counts[a] = (counts[a] || 0) + 1;
  }
  console.log('\nContent Area Distribution:');
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([area, count]) => console.log(`  ${count}x ${area}`));

  process.exit();
}

run().catch(e => { console.error('Error:', e); process.exit(1); });
