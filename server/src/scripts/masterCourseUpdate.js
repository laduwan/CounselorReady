/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * masterCourseUpdate.js
 * 
 * MASTER SCRIPT - Updates existing courses with expanded content
 * and adds new courses from markdown files.
 * 
 * WHAT IT DOES:
 * 1. Updates 5 idiom courses with expanded content (Elephant, Eggshells, Village, Rains, Beyond)
 * 2. Updates Ethics course with fuller version (17,582 → 18,034 words)
 * 3. Updates Suicide Risk course with fuller version 
 * 4. Adds Polyvagal Theory (1CE) as new course
 * 5. Adds CR-601 Cultural Competence (3CE) as new course
 * 
 * SETUP: Place these files in server/src/scripts/courseMarkdown/:
 *   - Elephant_in_the_Room_EXPANDED.md
 *   - Walking_on_Eggshells_EXPANDED.md
 *   - It_Takes_a_Village_EXPANDED.md
 *   - When_It_Rains_It_Pours_EXPANDED.md
 *   - Beyond_the_Surface_Multicultural_Competence_3CE.md
 *   - Ethics_Professional_Boundaries_3CE.md
 *   - Suicide_Risk_Assessment_4CE.md
 *   - CR-601_Cultural_Competence_Ethics_Risk_Reduction_3CE.md
 * 
 * And place this file in server/src/scripts/courseMarkdown/:
 *   - polyvagal_theory.json
 * 
 * RUN: node src/scripts/masterCourseUpdate.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIGURATION: Files to process
// ============================================================

const UPDATE_COURSES = [
  {
    filename: 'Elephant_in_the_Room_EXPANDED.md',
    matchTitle: 'The Elephant in the Room',
    metadata: { ceHours: 3, category: 'Clinical Practice', contentArea: 'Clinical Skills' }
  },
  {
    filename: 'Walking_on_Eggshells_EXPANDED.md',
    matchTitle: 'Walking on Eggshells',
    metadata: { ceHours: 3, category: 'Clinical Practice', contentArea: 'Clinical Skills' }
  },
  {
    filename: 'It_Takes_a_Village_EXPANDED.md',
    matchTitle: 'It Takes a Village',
    metadata: { ceHours: 3, category: 'Clinical Practice', contentArea: 'Collaborative Care' }
  },
  {
    filename: 'When_It_Rains_It_Pours_EXPANDED.md',
    matchTitle: 'When It Rains, It Pours',
    metadata: { ceHours: 3, category: 'Clinical Practice', contentArea: 'Clinical Skills' }
  },
  {
    filename: 'Beyond_the_Surface_Multicultural_Competence_3CE.md',
    matchTitle: 'Beyond the Surface',
    metadata: { ceHours: 3, category: 'Cultural Competence', contentArea: 'Cultural Competence' }
  },
  {
    filename: 'Ethics_Professional_Boundaries_3CE.md',
    matchTitle: 'Ethics and Professional Boundaries',
    metadata: { ceHours: 3, category: 'Ethics', contentArea: 'Ethics' }
  },
  {
    filename: 'Suicide_Risk_Assessment_4CE.md',
    matchTitle: 'Suicide Risk Assessment',
    metadata: { ceHours: 4, category: 'Crisis', contentArea: 'Crisis Intervention' }
  },
];

const NEW_COURSES = [
  {
    filename: 'CR-601_Cultural_Competence_Ethics_Risk_Reduction_3CE.md',
    metadata: {
      title: 'Foundations of Cultural Competence, Ethics, and Risk Reduction',
      code: 'CR-601',
      ceHours: 3,
      category: 'Ethics & Cultural Competence',
      contentArea: 'Cultural Competence and Ethics'
    }
  },
];

// ============================================================
// PARSING FUNCTIONS
// ============================================================

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function markdownToHtml(md) {
  return md
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>');
}

function parseModules(content) {
  const modules = [];
  const moduleRegex = /^#{1,2}\s*MODULE\s*(\d+)[:\s]*(.+)$/gim;
  const headers = [];
  let mm;
  while ((mm = moduleRegex.exec(content)) !== null) {
    headers.push({ num: parseInt(mm[1]), title: mm[2].trim().replace(/^\*\*|\*\*$/g, ''), index: mm.index });
  }

  headers.forEach((mod, i) => {
    const next = headers[i + 1];
    let endIdx = next ? next.index : content.length;
    
    ['# CONCLUSION', '# POST-TEST', '# BIBLIOGRAPHY', '# FINAL ASSESSMENT', '# FINAL EXAM', '# REFERENCES', '# SUPPLEMENTAL'].forEach(b => {
      const idx = content.indexOf(b, mod.index + 10);
      if (idx > mod.index && idx < endIdx) endIdx = idx;
    });

    const moduleContent = content.substring(mod.index, endIdx);
    
    modules.push({
      title: mod.title,
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

  return modules;
}

function parseAssessment(content) {
  const questions = [];
  const assessStart = content.search(/FINAL ASSESSMENT|POST-TEST|FINAL EXAM/i);
  if (assessStart === -1) return { questions, passThreshold: 0.80 };
  
  const section = content.substring(assessStart);
  const qRegex = /\*?\*?(\d+)\.?\*?\*?\s+(.+?\?)\s*\n\s*a\)\s*(.+)\n\s*b\)\s*(.+)\n\s*c\)\s*(.+)\n\s*d\)\s*(.+?)(?=\n\s*\*?\*?Correct|\n\s*---|\n\s*\*?\*?\d+\.)/gis;
  
  let match;
  while ((match = qRegex.exec(section)) !== null) {
    const afterMatch = section.substring(match.index, match.index + match[0].length + 200);
    const correctMatch = afterMatch.match(/Correct\s*Answer:\s*([a-d])\)/i);
    const correctIdx = correctMatch ? 'abcd'.indexOf(correctMatch[1].toLowerCase()) : 0;
    
    questions.push({
      question: match[2].replace(/\*\*/g, '').trim(),
      options: [
        { text: match[3].trim(), isCorrect: correctIdx === 0 },
        { text: match[4].trim(), isCorrect: correctIdx === 1 },
        { text: match[5].trim(), isCorrect: correctIdx === 2 },
        { text: match[6].replace(/\n.*/s, '').trim(), isCorrect: correctIdx === 3 },
      ],
      type: 'multiple-choice'
    });
  }
  
  return { questions, passThreshold: 0.80, maxAttempts: 3 };
}

function extractDescription(content) {
  const match = content.match(/(?:Course Description|COURSE DESCRIPTION)[:\s]*\n\n?([\s\S]*?)(?=\n\n---|\n\n##|\n\n\*\*Learning)/i);
  return match ? match[1].trim().substring(0, 1500) : '';
}

function extractObjectives(content) {
  const match = content.match(/(?:Learning Objectives|LEARNING OBJECTIVES)[\s\S]*?(?=\n\n---|\n\n##(?!#)|\n\n\*\*Course Outline)/i);
  if (!match) return [];
  const lines = match[0].match(/^\d+\.\s+.+$/gm) || [];
  return lines.map(l => l.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim());
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  COUNSELORREADY MASTER COURSE UPDATE');
  console.log('  ' + new Date().toISOString().split('T')[0]);
  console.log('═'.repeat(60));
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const Course = mongoose.connection.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
  const mdDir = path.join(__dirname, 'courseMarkdown');
  
  let updated = 0, created = 0, skipped = 0;

  // ── PHASE 1: Update existing courses with expanded content ──
  console.log('━'.repeat(60));
  console.log('PHASE 1: Updating courses with expanded content');
  console.log('━'.repeat(60) + '\n');

  for (const course of UPDATE_COURSES) {
    const filepath = path.join(mdDir, course.filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`  ⚠️  Not found: ${course.filename}`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const wordCount = content.split(/\s+/).filter(w => w).length;
    const modules = parseModules(content);
    const assessment = parseAssessment(content);
    const description = extractDescription(content);
    const objectives = extractObjectives(content);

    // Find existing course by partial title match
    const existing = await Course.findOne({
      title: { $regex: course.matchTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
    });

    if (existing) {
      const oldWordCount = (existing.modules || []).reduce((sum, m) => {
        return sum + (m.lessons || []).reduce((s, l) => {
          return s + (l.content || l.textContent || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(x => x).length;
        }, 0);
      }, 0);

      const updateData = { modules };
      if (description) updateData.description = description;
      if (objectives.length > 0) updateData.objectives = objectives;
      if (assessment.questions.length > 0) updateData.assessment = assessment;
      updateData.ceHours = course.metadata.ceHours;
      updateData.credits = course.metadata.ceHours;

      await Course.updateOne({ _id: existing._id }, { $set: updateData });
      console.log(`  ✅ UPDATED: ${existing.title.substring(0, 50)}`);
      console.log(`     ${oldWordCount.toLocaleString()} → ${wordCount.toLocaleString()} words | ${modules.length} modules | ${assessment.questions.length} assessment Qs\n`);
      updated++;
    } else {
      console.log(`  ❌ No match for: "${course.matchTitle}" — skipping`);
      skipped++;
    }
  }

  // ── PHASE 2: Add new courses ──
  console.log('━'.repeat(60));
  console.log('PHASE 2: Adding new courses');
  console.log('━'.repeat(60) + '\n');

  for (const course of NEW_COURSES) {
    const filepath = path.join(mdDir, course.filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`  ⚠️  Not found: ${course.filename}`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const wordCount = content.split(/\s+/).filter(w => w).length;
    const modules = parseModules(content);
    const assessment = parseAssessment(content);
    const description = extractDescription(content);
    const objectives = extractObjectives(content);

    // Check if already exists
    const existing = await Course.findOne({
      $or: [
        { title: course.metadata.title },
        { code: course.metadata.code },
        { slug: generateSlug(course.metadata.title) }
      ]
    });

    if (existing) {
      console.log(`  ⏭️  Already exists: ${course.metadata.title}`);
      skipped++;
      continue;
    }

    const courseData = {
      title: course.metadata.title,
      slug: generateSlug(course.metadata.title),
      code: course.metadata.code || '',
      description,
      ceHours: course.metadata.ceHours,
      credits: course.metadata.ceHours,
      category: course.metadata.category || 'Clinical Practice',
      level: 'Intermediate',
      contentArea: course.metadata.contentArea || 'Clinical Practice',
      targetAudience: [
        'Licensed Professional Counselors',
        'Licensed Clinical Social Workers',
        'Licensed Marriage and Family Therapists',
        'Psychologists',
        'Licensed Mental Health Counselors'
      ],
      objectives,
      modules,
      assessment,
      isPublished: false,
      status: 'draft',
      deliveryMethod: 'online',
      acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' }
    };

    await Course.create(courseData);
    console.log(`  ✅ CREATED: ${course.metadata.title}`);
    console.log(`     ${wordCount.toLocaleString()} words | ${modules.length} modules | ${assessment.questions.length} assessment Qs\n`);
    created++;
  }

  // ── PHASE 3: Add Polyvagal Theory from JSON ──
  console.log('━'.repeat(60));
  console.log('PHASE 3: Adding Polyvagal Theory course');
  console.log('━'.repeat(60) + '\n');

  const pvPath = path.join(mdDir, 'polyvagal_theory.json');
  if (fs.existsSync(pvPath)) {
    const pvData = JSON.parse(fs.readFileSync(pvPath, 'utf-8'));
    
    const pvExisting = await Course.findOne({
      title: { $regex: /polyvagal/i }
    });

    if (pvExisting) {
      console.log(`  ⏭️  Already exists: ${pvExisting.title}`);
      skipped++;
    } else {
      // Convert JSON modules to courses format
      const pvModules = (pvData.modules || [])
        .filter(m => m.title !== 'References')
        .map((m, i) => {
          const lessonContent = (m.blocks || []).map(b => {
            if (typeof b === 'string') return b;
            return b.content || b.text || '';
          }).join('\n\n');
          
          return {
            title: m.title,
            order: i + 1,
            lessons: [{
              title: m.title,
              content: lessonContent,
              textContent: lessonContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
              order: 1,
              type: 'text'
            }]
          };
        });

      // Build assessment from JSON
      const pvAssessment = {
        questions: (pvData.assessment?.questions || []).map(q => ({
          question: q.question || q.text || '',
          options: (q.options || []).map(o => ({
            text: typeof o === 'string' ? o : (o.text || ''),
            isCorrect: typeof o === 'string' ? false : (o.isCorrect || o.correct || false)
          })),
          type: 'multiple-choice'
        })),
        passThreshold: 0.80,
        maxAttempts: 3
      };

      const pvCourse = {
        title: pvData.title || 'Polyvagal Theory: Evidence-Based Approaches',
        slug: generateSlug(pvData.title || 'polyvagal-theory'),
        description: pvData.description || '',
        ceHours: pvData.ceHours || 1,
        credits: pvData.ceHours || 1,
        category: 'Clinical Practice',
        level: pvData.level || 'Introductory',
        contentArea: 'Clinical Theory',
        targetAudience: pvData.targetAudience || [
          'Licensed Professional Counselors',
          'Licensed Clinical Social Workers',
          'Psychologists'
        ],
        objectives: pvData.objectives || [],
        modules: pvModules,
        assessment: pvAssessment,
        isPublished: false,
        status: 'draft',
        deliveryMethod: 'online',
        acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' }
      };

      await Course.create(pvCourse);
      console.log(`  ✅ CREATED: ${pvCourse.title}`);
      console.log(`     1 CE | ${pvModules.length} modules | ${pvAssessment.questions.length} assessment Qs\n`);
      created++;
    }
  } else {
    console.log(`  ⚠️  polyvagal_theory.json not found in courseMarkdown/`);
    skipped++;
  }

  // ── SUMMARY ──
  console.log('═'.repeat(60));
  console.log('  RESULTS');
  console.log('═'.repeat(60));
  console.log(`\n  Updated: ${updated}`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);

  // Final count
  const allCourses = await Course.find({});
  let totalCE = 0;
  let acepReady = 0;
  allCourses.forEach(c => {
    const ce = c.ceHours || 0;
    totalCE += ce;
    let w = 0;
    (c.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        w += (l.content || l.textContent || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(s => s).length;
      });
    });
    if (ce > 0 && w >= ce * 5000) acepReady++;
  });

  console.log(`\n  Total courses in DB: ${allCourses.length}`);
  console.log(`  Total CE hours: ${totalCE}`);
  console.log(`  Near ACEP-ready: ${acepReady}`);
  
  console.log('\n  REMAINING TODO:');
  console.log('  • Run updateNeurobiologyCourse.js (adds Neurobiology of Trauma 4CE)');
  console.log('  • Run updateTraumaInformedCareCourse.js (adds Trauma-Informed Care 4CE)');
  console.log('  • Run rebuildActiveListening_ModulesFormat.js (adds Active Listening 1CE)');
  console.log('  • Regenerate 3 Handoff courses: Good/Bad/Boundary, Saving Lives, Inside Out');
  
  await mongoose.disconnect();
  console.log('\n✅ Done.\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
