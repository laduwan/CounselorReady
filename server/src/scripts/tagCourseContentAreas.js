#!/usr/bin/env node
/**
 * tagCourseContentAreas.js
 * 
 * Tags every course in interactivecourses with a proper contentArea
 * based on title/content keywords. Maps to NBCC Content Areas + 
 * state-specific categories (Supervision, Telehealth).
 * 
 * Run: node src/scripts/tagCourseContentAreas.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// Content area mapping rules — order matters (first match wins)
const RULES = [
  { pattern: /ethic|boundar|dual.relat|consent|confidential|mandated.report|professional.practice/i, area: 'Ethics', nbcc: 8 },
  { pattern: /supervis|cpcs|acs|mentor|oversight/i, area: 'Supervision', nbcc: 8 },
  { pattern: /telehealth|telement|virtual.practice|online.therap|remote.counsel/i, area: 'Telehealth', nbcc: 1 },
  { pattern: /suicid|crisis|safety.plan|1013|involuntary|baker.act|5150|risk.assess/i, area: 'Crisis & Safety', nbcc: 1 },
  { pattern: /trauma|ptsd|neuro|brain|inside.out|wound|resilience/i, area: 'Trauma & Neuroscience', nbcc: 1 },
  { pattern: /cultur|multicult|divers|immigr|refugee|competenc|translat|racial|lgbtq|equity/i, area: 'Multicultural & Social Justice', nbcc: 3 },
  { pattern: /addict|substance|recovery|28.days|sobriet|alcohol|opioid/i, area: 'Addiction & Recovery', nbcc: 1 },
  { pattern: /dbt|dialectic|cbt|cognitive.behav|mindful|accept|behav.therap/i, area: 'Evidence-Based Treatment', nbcc: 1 },
  { pattern: /geriatr|older.adult|aging|dementia|elder|retire|long.goodbye|final.chapter/i, area: 'Geriatric Mental Health', nbcc: 2 },
  { pattern: /couple|marriage|family|relat|attach|intimacy|reconnect/i, area: 'Couples & Family', nbcc: 1 },
  { pattern: /career|vocational|occupation|job|employ/i, area: 'Career Development', nbcc: 5 },
  { pattern: /assess|diagnos|dsm|testing|measure|psychometric/i, area: 'Assessment & Diagnosis', nbcc: 6 },
  { pattern: /motivat|interview|ambival|mi.skill|change.talk/i, area: 'Clinical Skills', nbcc: 1 },
  { pattern: /psychopharm|medicat|prescrib|pharmacol/i, area: 'Psychopharmacology', nbcc: 1 },
  { pattern: /document|billing|superbill|insurance|coding|icd|cpt/i, area: 'Documentation & Billing', nbcc: 8 },
  { pattern: /narrat|therap.technique|rapport|listen|session|eggshell|elephant|village|rain/i, area: 'Clinical Skills', nbcc: 1 },
  { pattern: /beautiful.mind|good.will|pursuit|black.swan|sixth.sense|ordinary.people|eternal.sunshine/i, area: 'Clinical Skills', nbcc: 1 },
  { pattern: /self.care|burnout|wellness|prevent/i, area: 'Wellness & Prevention', nbcc: 9 },
  { pattern: /ai.in|artificial.intell|technology/i, area: 'Ethics', nbcc: 8 },
];

const DEFAULT_AREA = 'Clinical Practice';
const DEFAULT_NBCC = 1;

function detectContentArea(title, description) {
  var text = (title + ' ' + (description || '')).toLowerCase();
  for (var rule of RULES) {
    if (rule.pattern.test(text)) {
      return { area: rule.area, nbccArea: rule.nbcc };
    }
  }
  return { area: DEFAULT_AREA, nbccArea: DEFAULT_NBCC };
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  var db = mongoose.connection.db;
  var col = db.collection('interactivecourses');
  
  var courses = await col.find({}).toArray();
  console.log('Courses: ' + courses.length + '\n');
  
  var updated = 0, unchanged = 0;
  
  for (var c of courses) {
    var detected = detectContentArea(c.title || '', c.description || '');
    var current = c.contentArea || c.ceCategory || c.category || '';
    
    if (current === detected.area) {
      console.log('✓ ' + c.title.substring(0, 55) + ' → ' + current);
      unchanged++;
    } else {
      await col.updateOne(
        { _id: c._id },
        { $set: { 
          contentArea: detected.area, 
          nbccContentArea: detected.nbccArea,
          updatedAt: new Date() 
        }}
      );
      console.log('✏️  ' + c.title.substring(0, 55) + ' → ' + detected.area + (current ? ' (was: ' + current + ')' : ' (was empty)'));
      updated++;
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log('Updated: ' + updated + ' | Already correct: ' + unchanged);
  console.log('═'.repeat(50));
  
  // Summary by category
  var tagged = await col.find({}).toArray();
  var counts = {};
  for (var t of tagged) {
    var a = t.contentArea || 'UNTAGGED';
    counts[a] = (counts[a] || 0) + 1;
  }
  console.log('\nContent Area Distribution:');
  Object.entries(counts).sort(function(a,b) { return b[1] - a[1]; }).forEach(function(e) {
    console.log('  ' + e[1] + 'x ' + e[0]);
  });
  
  process.exit();
}

run().catch(function(e) { console.error('❌', e); process.exit(1); });
