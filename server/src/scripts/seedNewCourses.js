/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * seedNewCourses.js
 * Seeds 5 additional courses: Suicide x2, Ethics, Addiction, MI
 * Run: node src/scripts/seedNewCourses.js
 */

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedNewCourses.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSE_METADATA = {
  'Suicide_Risk_Assessment_4CE.md': {
    title: 'Suicide Risk Assessment: Evidence-Based Approaches for Mental Health Professionals',
    ceHours: 4,
    category: 'Crisis',
    level: 'Intermediate',
    contentArea: 'Crisis Intervention'
  },
  'Suicide_Crisis_Course_Full.md': {
    title: 'Crisis Intervention and Suicide Prevention: A Comprehensive Clinical Guide',
    ceHours: 4,
    category: 'Crisis',
    level: 'Intermediate',
    contentArea: 'Crisis Intervention'
  },
  'Ethics_Professional_Boundaries_3CE.md': {
    title: 'Ethics and Professional Boundaries in Counseling Practice',
    ceHours: 3,
    category: 'Ethics',
    level: 'Intermediate',
    contentArea: 'Ethics'
  },
  'Course_6_28_Days_Later_Addiction_Counseling_3CE.md': {
    title: '28 Days Later: Understanding Addiction and Recovery',
    ceHours: 3,
    category: 'Clinical Practice',
    level: 'Intermediate',
    contentArea: 'Addiction Counseling'
  },
  'course3_motivational_interviewing.md': {
    title: 'Motivational Interviewing: From Ambivalence to Action',
    ceHours: 3,
    category: 'Clinical Practice',
    level: 'Intermediate',
    contentArea: 'Clinical Skills'
  }
};

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function markdownToHtml(md) {
  return md
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h2>$1</h2>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hdo\/])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>')
    .replace(/<p>\s*<\/p>/g, '');
}

function parseMarkdownCourse(content, filename) {
  const metadata = COURSE_METADATA[filename] || {};
  
  // Extract description
  let description = '';
  const descMatch = content.match(/\*\*Course Description[:\*]*\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|\n##)/i);
  if (descMatch) description = descMatch[1].trim().substring(0, 1000);

  // Extract learning objectives
  const objectives = [];
  const objSection = content.match(/LEARNING OBJECTIVES[\s\S]*?(?=\n##|\n---)/i);
  if (objSection) {
    const objLines = objSection[0].match(/^\d+\.\s+.+$/gm) || [];
    objectives.push(...objLines.map(l => l.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim()));
  }

  // Parse modules
  const modules = [];
  const moduleRegex = /^#{1,2}\s*MODULE\s*(\d+)[:\s]*(.+)$/gim;
  const moduleHeaders = [];
  let mm;
  while ((mm = moduleRegex.exec(content)) !== null) {
    moduleHeaders.push({ num: parseInt(mm[1]), title: mm[2].trim(), index: mm.index });
  }

  moduleHeaders.forEach((mod, i) => {
    const nextMod = moduleHeaders[i + 1];
    let endIdx = nextMod ? nextMod.index : content.length;
    
    const boundaries = ['# CONCLUSION', '# POST-TEST', '# BIBLIOGRAPHY', '# FINAL'];
    boundaries.forEach(b => {
      const idx = content.indexOf(b, mod.index + 10);
      if (idx > mod.index && idx < endIdx) endIdx = idx;
    });

    const moduleContent = content.substring(mod.index, endIdx);
    
    modules.push({
      title: mod.title.replace(/^\*\*|\*\*$/g, ''),
      order: mod.num,
      lessons: [{
        title: mod.title,
        content: markdownToHtml(moduleContent),
        textContent: moduleContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        order: 1,
        type: 'text'
      }]
    });
  });

  // If no modules found, create one big module
  if (modules.length === 0) {
    modules.push({
      title: 'Course Content',
      order: 1,
      lessons: [{
        title: metadata.title || 'Course Content',
        content: markdownToHtml(content),
        textContent: content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        order: 1,
        type: 'text'
      }]
    });
  }

  // Parse post-test questions
  const questions = [];
  const postTestMatch = content.match(/POST-TEST|FINAL ASSESSMENT|FINAL EXAM/i);
  if (postTestMatch) {
    const qMatches = content.matchAll(/(\d+)\.\s+(.+?)\n\s*[aA]\)/gs);
    for (const qm of qMatches) {
      questions.push({
        question: qm[2].trim(),
        options: [],
        type: 'multiple-choice'
      });
    }
  }

  return {
    title: metadata.title || filename.replace('.md', ''),
    slug: generateSlug(metadata.title || filename),
    description,
    ceHours: metadata.ceHours || 3,
    credits: metadata.ceHours || 3,
    category: metadata.category || 'Clinical Practice',
    level: metadata.level || 'Intermediate',
    contentArea: metadata.contentArea || 'Clinical Practice',
    targetAudience: ['Licensed Professional Counselors', 'Licensed Clinical Social Workers', 'Licensed Marriage and Family Therapists', 'Psychologists'],
    objectives,
    modules,
    assessment: { questions, passThreshold: 0.80 },
    isPublished: false,
    status: 'draft',
    deliveryMethod: 'online',
    acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' }
  };
}

async function main() {
  console.log('\n🚀 Seeding 5 New Courses...\n');
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const Course = mongoose.connection.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
  
  const mdDir = path.join(__dirname, 'courseMarkdown');
  const files = Object.keys(COURSE_METADATA);
  
  let created = 0, updated = 0, errors = 0;

  for (const filename of files) {
    const filepath = path.join(mdDir, filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  Not found: ${filename}`);
      errors++;
      continue;
    }

    console.log(`📄 Processing: ${filename}`);
    const content = fs.readFileSync(filepath, 'utf-8');
    const courseData = parseMarkdownCourse(content, filename);
    
    const wordCount = content.split(/\s+/).length;
    console.log(`   Title: ${courseData.title}`);
    console.log(`   CE Hours: ${courseData.ceHours}`);
    console.log(`   Modules: ${courseData.modules.length}`);
    console.log(`   Words: ${wordCount.toLocaleString()}`);

    const existing = await Course.findOne({
      $or: [
        { slug: courseData.slug },
        { title: courseData.title }
      ]
    });

    if (existing) {
      await Course.updateOne({ _id: existing._id }, { $set: courseData });
      console.log(`   ✏️  Updated\n`);
      updated++;
    } else {
      await Course.create(courseData);
      console.log(`   ✅ Created\n`);
      created++;
    }
  }

  console.log('═══════════════════════════════════════');
  console.log(`Created: ${created} | Updated: ${updated} | Errors: ${errors}`);
  console.log('═══════════════════════════════════════\n');

  await mongoose.disconnect();
}

main().catch(console.error);
