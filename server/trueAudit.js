/**
 * trueAudit.js
 * 
 * Counts ALL words in every possible field across both sections[] and modules[]
 * to get the TRUE word count for each course.
 * 
 * Usage: node trueAudit.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  const clean = stripHtml(text);
  return clean ? clean.split(/\s+/).filter(w => w.length > 0).length : 0;
}

function countBlockWords(block) {
  let words = 0;
  
  // Main content fields
  words += countWords(block.textContent);
  words += countWords(block.content);
  words += countWords(block.html);
  words += countWords(block.body);
  
  // Avoid double-counting if textContent === content
  if (block.textContent && block.content && block.textContent === block.content) {
    words -= countWords(block.content);
  }
  
  // Accordion items
  if (block.accordionItems && Array.isArray(block.accordionItems)) {
    for (const item of block.accordionItems) {
      words += countWords(item.content);
      words += countWords(item.textContent);
      words += countWords(item.title);
      words += countWords(item.heading);
    }
  }
  
  // Question text
  words += countWords(block.question);
  words += countWords(block.explanation);
  words += countWords(block.feedbackCorrect);
  words += countWords(block.feedbackIncorrect);
  
  // Options
  if (block.options && Array.isArray(block.options)) {
    for (const opt of block.options) {
      if (typeof opt === 'string') words += countWords(opt);
      else if (opt) {
        words += countWords(opt.text);
        words += countWords(opt.explanation);
      }
    }
  }
  
  // Matching items
  if (block.pairs && Array.isArray(block.pairs)) {
    for (const pair of block.pairs) {
      words += countWords(pair.term || pair.left);
      words += countWords(pair.definition || pair.right);
    }
  }
  
  // Scenario/vignette
  words += countWords(block.scenario);
  words += countWords(block.prompt);
  
  // Image text
  words += countWords(block.caption);
  words += countWords(block.description);
  
  // Section divider
  words += countWords(block.title);
  words += countWords(block.subtitle);
  
  return words;
}

function countContainerWords(containers) {
  let total = 0;
  for (const container of (containers || [])) {
    // contentBlocks (interactive format)
    for (const block of (container.contentBlocks || [])) {
      total += countBlockWords(block);
    }
    // lessons (standard format)
    for (const lesson of (container.lessons || [])) {
      total += countWords(lesson.content);
      total += countWords(lesson.textContent);
      total += countWords(lesson.title);
      if (lesson.questions) {
        for (const q of lesson.questions) {
          total += countWords(q.question);
          total += countWords(q.explanation);
          if (q.options) {
            for (const o of q.options) {
              total += countWords(typeof o === 'string' ? o : o.text);
            }
          }
        }
      }
    }
  }
  return total;
}

function countAssessmentWords(assessment) {
  let total = 0;
  if (!assessment || !assessment.questions) return 0;
  for (const q of assessment.questions) {
    total += countWords(q.question);
    total += countWords(q.explanation);
    if (q.options) {
      for (const o of q.options) {
        total += countWords(typeof o === 'string' ? o : o.text);
      }
    }
  }
  return total;
}

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB\n');

const ic = mongoose.connection.db.collection('interactivecourses');
const sc = mongoose.connection.db.collection('courses');

// Get all courses from both collections
const interactive = await ic.find({}).toArray();
const standard = await sc.find({}).toArray();

// Dedupe by slug
const allCourses = new Map();
for (const c of interactive) allCourses.set(c.slug, { ...c, collection: 'interactive' });
for (const c of standard) {
  if (!allCourses.has(c.slug)) allCourses.set(c.slug, { ...c, collection: 'standard' });
}

console.log(`Found ${allCourses.size} unique courses (${interactive.length} interactive + ${standard.length} standard)\n`);

// Audit each course
const results = [];
for (const [slug, course] of allCourses) {
  const sectionWords = countContainerWords(course.sections);
  const moduleWords = countContainerWords(course.modules);
  const assessmentWords = countAssessmentWords(course.assessment);
  const totalWords = Math.max(sectionWords, moduleWords) + assessmentWords;
  
  const ceHours = course.ceHours || course.ceuHours || course.ce_hours || 0;
  const target = ceHours * 6000;
  const pct = target > 0 ? Math.round(totalWords / target * 100) : 0;
  
  const assessmentCount = course.assessment?.questions?.length || 0;
  
  // Count knowledge checks
  let kcCount = 0;
  const containers = (course.sections?.length > 0 ? course.sections : course.modules) || [];
  for (const c of containers) {
    for (const b of (c.contentBlocks || [])) {
      if (['multipleChoice', 'multiSelect', 'matching'].includes(b.type)) kcCount++;
    }
  }
  
  // Count references/resources
  const refCount = (course.references || course.resources || []).length;
  
  results.push({
    title: (course.title || 'Untitled').substring(0, 60),
    slug,
    ceHours,
    totalWords,
    sectionWords,
    moduleWords,
    assessmentWords,
    target,
    pct,
    assessmentCount,
    kcCount,
    refCount,
    collection: course.collection,
    published: course.isPublished || course.status === 'published'
  });
}

// Sort by percentage descending
results.sort((a, b) => b.pct - a.pct);

// Print report
console.log('COURSE'.padEnd(55) + 'CE  Words   Target   %   Asm  KC  Ref  Source');
console.log('═'.repeat(110));

let compliant = 0;
let nearlyThere = 0;
let needsWork = 0;
let totalCE = 0;

for (const r of results) {
  const status = r.pct >= 90 ? '✅' : r.pct >= 70 ? '🟡' : '❌';
  const src = r.sectionWords > r.moduleWords ? 'sec' : r.moduleWords > 0 ? 'mod' : 'emp';
  
  console.log(
    `${status} ${r.title.padEnd(53)}` +
    `${String(r.ceHours).padStart(2)}  ` +
    `${String(r.totalWords).padStart(6)}  ` +
    `${String(r.target).padStart(6)}  ` +
    `${(r.pct + '%').padStart(4)}  ` +
    `${String(r.assessmentCount).padStart(3)}  ` +
    `${String(r.kcCount).padStart(2)}  ` +
    `${String(r.refCount).padStart(3)}  ` +
    `${src}`
  );
  
  if (r.pct >= 90) { compliant++; totalCE += r.ceHours; }
  else if (r.pct >= 70) nearlyThere++;
  else needsWork++;
}

console.log('═'.repeat(110));
console.log(`\nSUMMARY:`);
console.log(`  ✅ ACEP Compliant (≥90%): ${compliant} courses (${totalCE} CE hours)`);
console.log(`  🟡 Nearly there (70-89%): ${nearlyThere} courses`);
console.log(`  ❌ Needs work (<70%):      ${needsWork} courses`);
console.log(`  📊 Total: ${results.length} courses`);

// Flag courses missing references (ACEP requires min 3)
const missingRefs = results.filter(r => r.refCount < 3 && r.pct >= 70);
if (missingRefs.length > 0) {
  console.log(`\n⚠️  ${missingRefs.length} course(s) ≥70% but missing references (need 3+):`);
  for (const r of missingRefs) {
    console.log(`     ${r.title.substring(0, 50)} — ${r.refCount} refs`);
  }
}

// Update cached wordCount for all
console.log('\nUpdating cached word counts...');
let updated = 0;
for (const r of results) {
  const coll = r.collection === 'interactive' ? ic : sc;
  const current = await coll.findOne({ slug: r.slug }, { projection: { wordCount: 1 } });
  if ((current?.wordCount || 0) !== r.totalWords) {
    await coll.updateOne({ slug: r.slug }, { $set: { wordCount: r.totalWords } });
    updated++;
  }
}
console.log(`Updated ${updated} word counts.`);

await mongoose.disconnect();
