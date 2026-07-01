/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * wireDBTResources.js
 * 
 * ALTERNATIVE: If you uploaded the .docx files to Cloudinary manually
 * (via dashboard or CLI), paste the URLs below and run this to wire
 * them into the DBT course in MongoDB.
 * 
 * Run from CounselorReady root:
 *   node src/scripts/wireDBTResources.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DBT_SLUG = 'dbt-skills-training-comprehensive';

// ══════════════════════════════════════════════════════════
// PASTE YOUR CLOUDINARY URLs HERE after uploading
// ══════════════════════════════════════════════════════════
const RESOURCE_URLS = {
  diaryCard:       'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Diary_Card_Template_lfzylp.docx',
  chainAnalysis:   'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Chain_Analysis_Worksheet_kdgv7m.docx',
  distressTol:     'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Distress_Tolerance_Quick_Reference_kvzboc.docx',
  interpersonal:   'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126418/DBT_Interpersonal_Effectiveness_Guide_o846xs.docx',
  checkTheFacts:   'https://res.cloudinary.com/dzfscjhdx/raw/upload/v1773126417/DBT_Check_the_Facts_Worksheet_r22oyd.docx',
};
// ══════════════════════════════════════════════════════════

async function main() {
  // Validate
  const hasPlaceholders = Object.values(RESOURCE_URLS).some(u => u.includes('PASTE_URL'));
  if (hasPlaceholders) {
    console.error('❌ Replace PASTE_URL_HERE with actual Cloudinary URLs first.');
    console.log('\nUpload the 5 .docx files to Cloudinary (resource_type: raw), then paste the secure_urls above.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db;
  const course = await db.collection('interactivecourses').findOne({ slug: DBT_SLUG });

  if (!course) {
    console.error(`❌ Course not found: ${DBT_SLUG}`);
    await mongoose.disconnect();
    return;
  }

  const sectionsField = course.sections ? 'sections' : 'modules';
  const blocksField = course.sections ? 'contentBlocks' : 'contentBlocks';
  const sections = course[sectionsField] || [];

  console.log(`📚 "${course.title}" — ${sections.length} sections\n`);

  // ── Build the master resources block (goes in conclusion) ──
  const allResources = [
    { title: 'DBT Diary Card Template', url: RESOURCE_URLS.diaryCard, type: 'worksheet' },
    { title: 'Behavioral Chain Analysis Worksheet', url: RESOURCE_URLS.chainAnalysis, type: 'worksheet' },
    { title: 'Distress Tolerance Quick Reference (TIPP, ACCEPTS, IMPROVE)', url: RESOURCE_URLS.distressTol, type: 'reference' },
    { title: 'Interpersonal Effectiveness Guide (DEAR MAN, GIVE, FAST)', url: RESOURCE_URLS.interpersonal, type: 'reference' },
    { title: 'Emotion Regulation: Check the Facts Worksheet', url: RESOURCE_URLS.checkTheFacts, type: 'worksheet' },
  ];

  const masterBlock = {
    type: 'resources',
    title: 'Clinical Worksheets & Quick Reference Guides',
    description: 'Downloadable companion materials designed for clinical use with clients.',
    resources: allResources,
    accessibility: { ariaLabel: 'Downloadable clinical resources' },
  };

  // ── Find the conclusion / last section ──
  const lastIdx = sections.length - 1;
  const lastSection = sections[lastIdx];
  const lastBlocks = lastSection[blocksField] || lastSection.blocks || [];

  // Remove any existing resources block in conclusion
  const filtered = lastBlocks.filter(b => b.type !== 'resources');

  // Insert before the very last block (typically references)
  const insertPos = Math.max(filtered.length - 1, 0);
  filtered.splice(insertPos, 0, masterBlock);

  // Write back
  if (lastSection.contentBlocks) {
    sections[lastIdx].contentBlocks = filtered;
  } else {
    sections[lastIdx].blocks = filtered;
  }

  console.log(`➕ Added master resources block to Section ${lastIdx + 1} (conclusion) with ${allResources.length} downloadable items`);

  // ── Save ──
  await db.collection('interactivecourses').updateOne(
    { slug: DBT_SLUG },
    { $set: { [sectionsField]: sections } }
  );

  console.log('\n✅ Done — resources wired into DBT course');
  console.log('   Visit the course player to verify download cards appear.\n');

  await mongoose.disconnect();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
