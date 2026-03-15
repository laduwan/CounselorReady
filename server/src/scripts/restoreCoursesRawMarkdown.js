#!/usr/bin/env node
/**
 * restoreCoursesRawMarkdown.js
 * 
 * Reads original MD source files and stores them as rawMarkdown
 * in the interactivecourses collection. The viewer parses client-side.
 * No pipeline. No conversion. No word loss.
 * 
 * Run on Render: node src/scripts/restoreCoursesRawMarkdown.js
 * 
 * IMPORTANT: Push this file + the /courseMarkdown/ folder to GitHub first.
 * Place MD files in: server/src/scripts/courseMarkdown/
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// ── Course mapping: filename → slug + metadata ──
const COURSES = [
  // RESTORE: DB version damaged, source is better
  {
    file: 'Suicide_Risk_Assessment_4CE.md',
    slug: 'suicide-risk-assessment-evidence-based-approaches',
    title: 'Suicide Risk Assessment: Evidence-Based Approaches for Mental Health Professionals',
    ceHours: 4, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'Suicide_Crisis_Course_Full.md',
    slug: 'crisis-intervention-suicide-prevention-comprehensive',
    title: 'Crisis Intervention and Suicide Prevention: A Comprehensive Clinical Guide',
    ceHours: 4, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'Inside_Out_Neurobiology_of_Trauma_3CE.md',
    slug: 'neurobiology-of-trauma',
    title: 'The Neurobiology of Trauma',
    ceHours: 4, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'course3_motivational_interviewing.md',
    slug: 'motivational-interviewing-ambivalence-to-action',
    title: 'Motivational Interviewing: From Ambivalence to Action',
    ceHours: 3, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'Trauma_Informed_Care_PTSD_3CE.md',
    slug: 'trauma-informed-care-foundations-clinical-practice',
    title: 'Trauma-Informed Care: Foundations for Clinical Practice',
    ceHours: 4, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'When_It_Rains_It_Pours_EXPANDED.md',
    slug: 'when-it-rains-it-pours-multiple-stressors',
    title: 'When It Rains, It Pours: Treating Clients with Multiple Stressors and Comorbidities',
    ceHours: 3, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'It_Takes_a_Village_EXPANDED.md',
    slug: 'it-takes-a-village-consultation-referral',
    title: 'It Takes a Village: Consultation, Referral, and Collaborative Care',
    ceHours: 3, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'Walking_on_Eggshells_EXPANDED.md',
    slug: 'walking-on-eggshells-high-conflict-clients',
    title: 'Walking on Eggshells: Working with High-Conflict and Emotionally Dysregulated Clients',
    ceHours: 3, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'Elephant_in_the_Room_EXPANDED.md',
    slug: 'elephant-in-the-room-difficult-conversations',
    title: 'The Elephant in the Room: Navigating Difficult Conversations in Therapy',
    ceHours: 3, contentArea: 'Clinical Practice', mode: 'restore'
  },
  {
    file: 'Course_6_28_Days_Later_Addiction_Counseling_3CE.md',
    slug: '28-days-later-understanding-addiction-recovery',
    title: '28 Days Later: Understanding Addiction and Recovery',
    ceHours: 3, contentArea: 'Addiction Counseling', mode: 'restore'
  },
  {
    file: 'Ethics_Professional_Boundaries_3CE.md',
    slug: 'ethics-professional-boundaries-counseling',
    title: 'Ethics and Professional Boundaries in Counseling Practice',
    ceHours: 3, contentArea: 'Ethics', mode: 'restore'
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');
  
  const mdDir = path.join(__dirname, 'courseMarkdown');
  
  let restored = 0, skipped = 0, errors = 0;
  
  for (const c of COURSES) {
    const filePath = path.join(mdDir, c.file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  SKIP: ${c.file} not found in ${mdDir}`);
      skipped++;
      continue;
    }
    
    const rawMd = fs.readFileSync(filePath, 'utf8');
    const words = rawMd.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
    
    // Find existing course by slug (try variations)
    let existing = await col.findOne({ slug: c.slug });
    if (!existing) {
      // Try partial slug match
      const slugWords = c.slug.split('-').slice(0, 3).join('.*');
      existing = await col.findOne({ slug: { $regex: new RegExp(slugWords, 'i') } });
    }
    
    if (existing) {
      // Check if rawMarkdown would be an improvement
      let existingWords = 0;
      (existing.sections || []).forEach(s => {
        (s.contentBlocks || []).forEach(b => {
          if (b.type === 'text') existingWords += (b.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
        });
      });
      
      if (words > existingWords) {
        await col.updateOne(
          { _id: existing._id },
          { $set: { rawMarkdown: rawMd, updatedAt: new Date() } }
        );
        console.log(`✅ RESTORED: ${existing.title}`);
        console.log(`   DB had: ${existingWords.toLocaleString()} words → rawMarkdown: ${words.toLocaleString()} words (+${(words - existingWords).toLocaleString()})`);
        restored++;
      } else {
        console.log(`⏭️  SKIP: ${existing.title} — DB version (${existingWords.toLocaleString()}w) >= source (${words.toLocaleString()}w)`);
        skipped++;
      }
    } else {
      // Course not in DB — create with rawMarkdown
      const newCourse = {
        title: c.title,
        slug: c.slug,
        rawMarkdown: rawMd,
        ceHours: c.ceHours,
        contentArea: c.contentArea,
        status: 'draft',
        isPublished: false,
        sections: [], // Empty — viewer will parse rawMarkdown client-side
        provider: {
          name: 'GA Integrated Therapeutic Perspectives LLC',
          shortName: 'GAITP LLC',
          acepNumber: '7760',
          approvalBody: 'NBCC'
        },
        presenter: {
          name: 'Kejuiana Johnson',
          credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
          licenseNumber: 'LPC009587',
          licenseState: 'Georgia'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await col.insertOne(newCourse);
      console.log(`🆕 CREATED: ${c.title} (${words.toLocaleString()} words, ${c.ceHours} CE)`);
      restored++;
    }
  }
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Restored: ${restored} | Skipped: ${skipped} | Errors: ${errors}`);
  console.log(`${'═'.repeat(60)}`);
  
  process.exit();
}

run().catch(e => { console.error('❌', e); process.exit(1); });
