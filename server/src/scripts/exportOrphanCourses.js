/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import fs from 'fs';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const ic = db.collection('interactivecourses');

  // These 7 courses have no seed script or source file
  const orphanSlugs = [
    'existential-theory-in-clinical-practice-applications-and-interventions-mkheuark',
    'motivational-interviewing-in-first-sessions-empowering-clients-for-change-mkhedkoc',
    'mental-health-billing-essentials-for-licensed-professional-counselors-mkjas300',
    'ethical-uses-of-ai-in-mental-health-counseling-mkjbmj7a',
    'mindfulness-introduction',
    'therapeutic-rapport',
    'psychiatric-medications-basics',
    'cultural-humility-clinical-practice',
  ];

  console.log('Exporting orphan courses from interactivecourses...\n');

  for (const slug of orphanSlugs) {
    const course = await ic.findOne({ slug });
    if (!course) {
      console.log(`❌ ${slug} — NOT FOUND, checking legacy...`);
      const legacy = await db.collection('courses').findOne({ slug });
      if (legacy) {
        console.log(`  Found in legacy courses: ${legacy.title}`);
        await exportCourse(legacy, slug, 'legacy');
      } else {
        console.log(`  Not found anywhere.`);
      }
      continue;
    }
    await exportCourse(course, slug, 'interactive');
  }

  // Also export from legacy courses collection for completeness
  console.log('\n\nChecking legacy courses collection for same slugs...');
  for (const slug of orphanSlugs) {
    const legacy = await db.collection('courses').findOne({ slug });
    if (legacy) {
      console.log(`  Legacy: ${slug} → ${legacy.title} (${legacy.modules?.length || 0} modules)`);
    }
  }

  await mongoose.disconnect();
  console.log('\n✅ Export complete. Check /tmp/orphan-exports/');
}

async function exportCourse(course, slug, collection) {
  const dir = '/tmp/orphan-exports';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Save full JSON
  const jsonPath = `${dir}/${slug}.json`;
  fs.writeFileSync(jsonPath, JSON.stringify(course, null, 2));
  console.log(`✅ ${course.title} (${collection})`);
  console.log(`   Sections: ${course.sections?.length || 0}, Modules: ${course.modules?.length || 0}`);
  
  const wordCount = countWords(course);
  console.log(`   Words: ~${wordCount}`);
  console.log(`   Saved: ${jsonPath}`);

  // Also generate a seed script
  const seedPath = `${dir}/seed_${slug.replace(/-/g, '_').substring(0, 50)}.js`;
  const seedContent = generateSeedScript(course, collection);
  fs.writeFileSync(seedPath, seedContent);
  console.log(`   Seed: ${seedPath}`);

  // Also save as markdown for human review
  const mdPath = `${dir}/${slug}.md`;
  const mdContent = generateMarkdown(course);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`   Markdown: ${mdPath}`);
}

function countWords(course) {
  let text = '';
  if (course.sections) {
    for (const s of course.sections) {
      for (const b of (s.contentBlocks || [])) {
        text += ' ' + (b.content || b.textContent || b.question || '');
      }
    }
  }
  if (course.modules) {
    for (const m of course.modules) {
      for (const l of (m.lessons || [])) {
        text += ' ' + (l.content || l.textContent || '');
      }
    }
  }
  return text.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(w => w).length;
}

function generateSeedScript(course, collection) {
  // Remove internal MongoDB fields
  const clean = { ...course };
  delete clean._id;
  delete clean.__v;
  delete clean.createdAt;
  delete clean.updatedAt;
  delete clean.enrolledCount;
  
  return `import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('${collection === 'interactive' ? 'interactivecourses' : 'courses'}');

  const course = ${JSON.stringify(clean, null, 2)};

  // Upsert by slug
  const result = await collection.updateOne(
    { slug: course.slug },
    { $set: course },
    { upsert: true }
  );
  
  console.log(result.upsertedCount ? '✅ Created' : '✅ Updated', course.title);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
`;
}

function generateMarkdown(course) {
  let md = `# ${course.title}\n\n`;
  md += `**Slug:** ${course.slug}\n`;
  md += `**CE Hours:** ${course.ceHours || course.creditHours || 'N/A'}\n`;
  md += `**Status:** ${course.status}\n\n`;
  md += `---\n\n`;

  if (course.sections) {
    for (let si = 0; si < course.sections.length; si++) {
      const s = course.sections[si];
      md += `## Section ${si + 1}: ${s.title}\n\n`;
      for (const b of (s.contentBlocks || [])) {
        if (b.type === 'text') {
          // Strip HTML for readable markdown
          const text = (b.content || b.textContent || '')
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
            .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
          md += text + '\n\n';
        } else if (b.type === 'multipleChoice') {
          md += `**Knowledge Check:** ${b.question}\n`;
          (b.options || []).forEach((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const text = typeof opt === 'object' ? opt.text : opt;
            const correct = typeof opt === 'object' ? opt.isCorrect : (i === b.correctAnswer);
            md += `${letter}) ${text}${correct ? ' ✓' : ''}\n`;
          });
          if (b.explanation) md += `*Rationale: ${b.explanation}*\n`;
          md += '\n';
        } else if (b.type === 'accordion') {
          md += `**Accordion:**\n`;
          (b.accordionItems || []).forEach(item => {
            md += `<details><summary>${item.title}</summary>\n${item.content || ''}\n</details>\n`;
          });
          md += '\n';
        }
      }
    }
  }

  if (course.modules) {
    for (let mi = 0; mi < course.modules.length; mi++) {
      const m = course.modules[mi];
      md += `## Module ${mi + 1}: ${m.title}\n\n`;
      for (const l of (m.lessons || [])) {
        md += `### ${l.title}\n\n`;
        const text = (l.content || l.textContent || '')
          .replace(/<[^>]+>/g, '')
          .trim();
        md += text + '\n\n';
      }
    }
  }

  return md;
}

main().catch(err => { console.error(err); process.exit(1); });
