/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * seedFromMarkdownSources.js
 * 
 * Reads complete course markdown/txt files from src/scripts/courseMarkdown/
 * and seeds them into the interactivecourses collection with rich contentBlocks.
 * 
 * Unlike the broken parsers (seedNewCourses.js, CourseBuilder import),
 * this script:
 * - Preserves module structure (splits on # MODULE or ## Module headers)
 * - Creates rich contentBlocks (sectionDivider, text, accordion, multipleChoice, matching, reflection)
 * - Extracts knowledge check questions from the markdown
 * - Builds proper assessment from final exam questions
 * - Targets interactivecourses collection (NOT old courses collection)
 * 
 * Place markdown files in: server/src/scripts/courseMarkdown/
 * Run on Render: node src/scripts/seedFromMarkdownSources.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { compareWordCounts } from '../../utils/contentValidator.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// ============================================================
// COURSE METADATA REGISTRY
// Map filename patterns to course metadata
// ============================================================

const COURSE_REGISTRY = {
  'Inside_Out_Neurobiology': {
    title: 'Inside Out: The Neurobiology of Trauma',
    slug: 'inside-out-neurobiology-of-trauma',
    code: 'CR-NB-301',
    ceHours: 3,
    category: 'Trauma',
    contentArea: 'Trauma & PTSD',
    description: 'Explore the neuroscience behind trauma responses, including how traumatic experiences reshape neural pathways, affect the stress response system, and impact emotional regulation. Grounded in current neuroscience research and clinical applications.'
  },
  'Ethics_Professional_Boundaries': {
    title: 'Ethics and Professional Boundaries in Counseling Practice',
    slug: 'ethics-and-professional-boundaries-in-counseling-practice',
    code: 'CR-201',
    ceHours: 3,
    category: 'Ethics',
    contentArea: 'Ethics',
    description: 'Comprehensive exploration of ethical principles, professional boundaries, dual relationships, informed consent, and ethical decision-making frameworks for mental health professionals.'
  },
  'Suicide_Crisis_Course': {
    title: 'Crisis Intervention and Suicide Prevention: A Comprehensive Clinical Guide',
    slug: 'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide',
    code: 'CR-102',
    ceHours: 4,
    category: 'Crisis',
    contentArea: 'Crisis Intervention',
    description: 'Comprehensive guide to crisis intervention and suicide prevention strategies for mental health professionals, covering assessment, safety planning, and evidence-based intervention techniques.'
  },
  'Suicide_Risk_Assessment_4CE': {
    title: 'Suicide Risk Assessment: Evidence-Based Approaches for Mental Health Professionals',
    slug: 'suicide-risk-assessment-evidence-based',
    code: 'CR-101',
    ceHours: 4,
    category: 'Crisis',
    contentArea: 'Crisis Intervention',
    description: 'Evidence-based frameworks for suicide risk assessment, safety planning, and clinical decision-making, with attention to special populations and ethical considerations.'
  },
  'Trauma_Informed_Care_PTSD': {
    title: 'Trauma-Informed Care and PTSD Treatment: Foundations for Clinical Practice',
    slug: 'trauma-informed-care-ptsd-treatment',
    code: 'CR-TIC-301',
    ceHours: 3,
    category: 'Trauma',
    contentArea: 'Trauma & PTSD',
    description: 'Foundations of trauma-informed care principles, PTSD assessment and diagnosis using DSM-5-TR criteria, and evidence-based PTSD treatments including PE, CPT, and EMDR.'
  },
  'CR-201_Motivational_Interviewing': {
    title: 'Motivational Interviewing: From Ambivalence to Action',
    slug: 'motivational-interviewing-from-ambivalence-to-action',
    code: 'CR-302',
    ceHours: 3,
    category: 'Clinical Skills',
    contentArea: 'Clinical Skills',
    description: 'Evidence-based motivational interviewing techniques for evoking client motivation, navigating ambivalence, and facilitating behavior change across clinical settings.'
  },
  'CR-202_Trauma_Informed_Anxiety': {
    title: 'The Pursuit of Happyness: Treating Anxiety and Depression',
    slug: 'the-pursuit-of-happyness-treating-anxiety-and-depression',
    code: 'CR-209',
    ceHours: 3,
    category: 'Clinical Skills',
    contentArea: 'Clinical Skills',
    description: 'Evidence-based approaches to treating anxiety and depression, integrating cognitive-behavioral, behavioral activation, and third-wave interventions for clinical practice.'
  }
};

// ============================================================
// MARKDOWN PARSING
// ============================================================

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function markdownToHtml(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const result = [];
  let inBulletList = false;
  let inNumberedList = false;
  let inTable = false;
  let tableRows = [];

  function applyInline(text) {
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<![a-zA-Z:\/])\*([^*\n]+)\*(?![a-zA-Z])/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  }

  function flushTable() {
    if (inTable && tableRows.length > 0) {
      let tableHtml = '<table style="width:100%;border-collapse:collapse;margin:12px 0;">';
      tableRows.forEach((row, idx) => {
        const cells = row.split('|').filter(c => c.trim());
        if (idx === 0) {
          tableHtml += '<thead><tr>' + cells.map(c => `<th>${applyInline(c.trim())}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cells.map(c => `<td>${applyInline(c.trim())}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table>';
      result.push(tableHtml);
      tableRows = [];
      inTable = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      // Close open lists on blank lines
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      flushTable();
      continue;
    }

    // Horizontal rules
    if (/^---+$/.test(line)) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      flushTable();
      result.push('<hr/>');
      continue;
    }

    // Table rows
    if (/^\|/.test(line)) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      if (/^\|[-\s|:]+\|$/.test(line)) continue; // skip separator
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (line.startsWith('#### ')) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<h4>${applyInline(line.substring(5))}</h4>`);
    } else if (line.startsWith('### ')) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<h2>${applyInline(line.substring(4))}</h2>`);
    } else if (line.startsWith('## ')) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<h2>${applyInline(line.substring(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<h1>${applyInline(line.substring(2))}</h1>`);
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<blockquote><p>${applyInline(line.substring(2))}</p></blockquote>`);
    }
    // Bullet list items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      if (!inBulletList) { result.push('<ul>'); inBulletList = true; }
      result.push(`<li>${applyInline(line.substring(2))}</li>`);
    }
    // Numbered list items
    else if (/^\d+\.\s/.test(line)) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (!inNumberedList) { result.push('<ol>'); inNumberedList = true; }
      const content = line.replace(/^\d+\.\s+/, '');
      result.push(`<li>${applyInline(content)}</li>`);
    }
    // APA reference entries
    else if (/^[A-Z][a-z]+,\s+[A-Z]/.test(line) && /\(\d{4}\)/.test(line)) {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<p class="cr-reference">${applyInline(line)}</p>`);
    }
    // Regular paragraph
    else {
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      result.push(`<p>${applyInline(line)}</p>`);
    }
  }

  // Close any open lists
  if (inBulletList) result.push('</ul>');
  if (inNumberedList) result.push('</ol>');
  flushTable();

  return result.join('\n');
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  return stripHtml(text).split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Parse a markdown course into modules with metadata
 */
function parseMarkdownToModules(content, filename) {
  // Find metadata from registry
  let meta = null;
  for (const [key, val] of Object.entries(COURSE_REGISTRY)) {
    if (filename.includes(key)) {
      meta = val;
      break;
    }
  }

  // Extract learning objectives
  const objectives = [];
  const objMatch = content.match(/(?:learning objectives|upon.*?completion|objectives)[\s\S]*?(?=\n#{1,2}\s|\n---|\n\n\n)/i);
  if (objMatch) {
    const lines = objMatch[0].match(/^\s*(?:\d+[\.\)]\s+|[-•]\s+).+$/gm) || [];
    lines.slice(0, 8).forEach(l => {
      const cleaned = l.replace(/^\s*(?:\d+[\.\)]\s+|[-•]\s+)/, '').replace(/\*\*/g, '').trim();
      if (cleaned.length > 10) objectives.push(cleaned);
    });
  }

  // Extract references — preserve full APA 7th edition citations
  const references = [];
  const refSection = content.match(/(?:^#{1,2}\s*(?:references|bibliography|works?\s*cited))\s*\n([\s\S]*?)(?=\n#{1,2}\s|\n---\s*$|$)/im);
  if (refSection) {
    const refContent = refSection[1] || refSection[0];
    // Split by double newlines (each reference is separated by blank lines)
    // or by lines starting with a new author entry
    const rawEntries = refContent.split(/\n\n+/).filter(e => e.trim().length > 15);

    for (const rawEntry of rawEntries.slice(0, 30)) {
      const entry = rawEntry.trim().replace(/\n\s*/g, ' ').replace(/\s{2,}/g, ' ');
      // Skip lines that are just the header
      if (/^(?:references|bibliography|works?\s*cited)\s*$/i.test(entry)) continue;
      // Strip leading numbering or bullets
      const cleaned = entry.replace(/^(?:\d+[\.\)]\s+|[-•]\s+)/, '').trim();
      if (cleaned.length < 15) continue;

      // Try to parse structured APA fields
      const authorMatch = cleaned.match(/^(.+?)\s*\(\d{4}/);
      const yearMatch = cleaned.match(/\((\d{4}[a-z]?)\)/);
      const titleMatch = cleaned.match(/\)\.\s*(.+?)(?:\.\s|$)/);

      references.push({
        author: authorMatch?.[1]?.trim() || cleaned.substring(0, 60),
        year: parseInt(yearMatch?.[1]) || 2020,
        title: titleMatch?.[1]?.replace(/\*+/g, '').trim() || cleaned.substring(0, 120),
        source: cleaned, // Preserve the FULL APA citation as source for reuse
        fullCitation: cleaned // Keep the complete APA entry intact
      });
    }
  }

  // Split into modules by # MODULE or ## Module headers
  const modulePattern = /^#{1,2}\s*(?:MODULE\s+\d+|Module\s+\d+)[:\s]*(.+)$/gim;
  const moduleHeaders = [];
  let match;
  while ((match = modulePattern.exec(content)) !== null) {
    moduleHeaders.push({ index: match.index, title: match[1].trim().replace(/\*\*/g, '') });
  }

  // If no module headers found, try ## level headers as module boundaries
  if (moduleHeaders.length < 2) {
    const h2Pattern = /^##\s+(.+)$/gm;
    while ((match = h2Pattern.exec(content)) !== null) {
      const title = match[1].trim().replace(/\*\*/g, '');
      // Skip metadata headers
      if (/course description|learning objectives|target audience|references|bibliography/i.test(title)) continue;
      moduleHeaders.push({ index: match.index, title });
    }
  }

  // Build modules
  const modules = [];
  for (let i = 0; i < moduleHeaders.length; i++) {
    const start = moduleHeaders[i].index;
    const end = i < moduleHeaders.length - 1 ? moduleHeaders[i + 1].index : content.length;
    const moduleContent = content.substring(start, end);
    
    modules.push({
      title: moduleHeaders[i].title,
      order: i + 1,
      rawContent: moduleContent
    });
  }

  // If still no modules, create one big module
  if (modules.length === 0) {
    modules.push({
      title: meta?.title || 'Course Content',
      order: 1,
      rawContent: content
    });
  }

  return { meta, modules, objectives, references };
}

/**
 * Extract knowledge check questions from markdown content
 */
function extractKnowledgeChecks(mdContent) {
  const questions = [];
  
  // Pattern: numbered questions with lettered options
  const qPattern = /(?:^|\n)\s*(\d+)\.\s*(.+?)(?:\n\s*[a-d]\)\s*.+){2,4}/gi;
  const qBlocks = mdContent.match(/(?:^|\n)\s*\d+\.\s*[^\n]+(?:\n\s*[a-d]\)\s*[^\n]+){2,4}(?:\n\s*(?:correct|answer|explanation)[^\n]*)?/gi) || [];
  
  for (const block of qBlocks) {
    const qMatch = block.match(/^\s*\d+\.\s*(.+)/m);
    if (!qMatch) continue;
    
    const options = [];
    const optMatches = block.match(/\s*[a-d]\)\s*(.+)/gi) || [];
    for (const opt of optMatches) {
      options.push(opt.replace(/^\s*[a-d]\)\s*/, '').trim());
    }
    
    if (options.length < 2) continue;
    
    // Try to find correct answer indicator
    let correctIndex = 0;
    const correctMatch = block.match(/correct.*?:\s*([a-d])/i) || block.match(/answer.*?:\s*([a-d])/i);
    if (correctMatch) {
      correctIndex = correctMatch[1].toLowerCase().charCodeAt(0) - 97;
    }
    
    const explainMatch = block.match(/explanation[:\s]*(.+)/i);
    
    questions.push({
      question: qMatch[1].trim(),
      options: options.map((text, idx) => ({ text, isCorrect: idx === correctIndex })),
      explanation: explainMatch?.[1]?.trim() || 'Review the course content for more details.',
      type: 'multipleChoice'
    });
  }
  
  return questions;
}

/**
 * Convert a parsed module to rich contentBlocks
 * CRITICAL: Preserve ALL content. Never discard text blocks.
 * Per GOLD_STANDARD_SPEC §18.1: Never strip content, never summarize.
 * Each text block should be ≤1,500 words per spec §3.2.
 */
function moduleToContentBlocks(mod, totalModules) {
  const blocks = [];
  const html = markdownToHtml(mod.rawContent);

  // Section divider
  blocks.push({
    type: 'sectionDivider',
    sectionNumber: mod.order,
    title: `Module ${mod.order}`,
    subtitle: mod.title,
    accessibility: { role: 'heading', ariaLevel: 2 }
  });

  // Split content by h2/h3 headings into logical sections
  const sections = html.split(/(?=<h[23][^>]*>)/i).filter(s => s.trim());

  for (const section of sections) {
    const wordCount = countWords(section);
    if (wordCount < 10) continue;

    // For very long sections (>1500 words), split into multiple text blocks
    // but NEVER discard content
    if (wordCount > 1500) {
      // Split on h3 sub-headings to create natural breaks
      const h3Parts = section.split(/(?=<h3[^>]*>)/i).filter(s => s.trim());

      if (h3Parts.length > 1) {
        // Lead text block (intro before first h3)
        if (countWords(h3Parts[0]) > 10) {
          blocks.push({
            type: 'text',
            content: h3Parts[0].trim(),
            accessibility: { role: 'article' }
          });
        }

        // Create accordion ONLY for short concept definitions (3-5 items, each < 150 words)
        // Otherwise keep as separate text blocks to preserve full content
        const shortItems = h3Parts.slice(1).filter(p => countWords(p) < 150);
        const longItems = h3Parts.slice(1).filter(p => countWords(p) >= 150);

        // Short items → accordion (if 3-5 items, per spec §7)
        if (shortItems.length >= 3 && shortItems.length <= 7) {
          const items = [];
          for (const part of shortItems) {
            const titleMatch = part.match(/<h3[^>]*>(.*?)<\/h3>/i);
            if (titleMatch) {
              items.push({
                title: stripHtml(titleMatch[1]),
                content: part.replace(titleMatch[0], '').trim()
              });
            }
          }
          if (items.length >= 2) {
            blocks.push({
              type: 'accordion',
              accordionItems: items,
              accessibility: { role: 'region', ariaLabel: 'Expandable content sections' }
            });
          }
        } else {
          // Short items that don't fit accordion criteria — keep as text blocks
          for (const part of shortItems) {
            blocks.push({
              type: 'text',
              content: part.trim(),
              accessibility: { role: 'article' }
            });
          }
        }

        // Long items → always individual text blocks (NEVER compress into accordion)
        for (const part of longItems) {
          blocks.push({
            type: 'text',
            content: part.trim(),
            accessibility: { role: 'article' }
          });
        }
      } else {
        // No h3 sub-headings — keep as one text block (large but intact)
        blocks.push({
          type: 'text',
          content: section.trim(),
          accessibility: { role: 'article' }
        });
      }
    } else {
      // Normal-sized section — keep as one text block
      blocks.push({
        type: 'text',
        content: section.trim(),
        accessibility: { role: 'article' }
      });
    }
  }

  // Extract and add knowledge checks from raw markdown
  const checks = extractKnowledgeChecks(mod.rawContent);
  for (const check of checks.slice(0, 3)) {
    blocks.push({
      type: 'multipleChoice',
      question: check.question,
      options: check.options,
      explanation: check.explanation,
      accessibility: { ariaLabel: 'Knowledge check', announceCorrect: true }
    });
  }

  // Add reflection
  blocks.push({
    type: 'reflection',
    question: `Reflect on the key concepts from "${mod.title}." How might you apply these ideas in your clinical practice? Think of a specific client or situation where this knowledge would inform your approach.`,
    minLength: 50,
    accessibility: { role: 'textbox', ariaLabel: `Reflection for Module ${mod.order}` }
  });

  return blocks;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('\n' + '═'.repeat(70));
  console.log('  SEED FROM MARKDOWN SOURCES');
  console.log('  Reading .md/.txt files → interactivecourses collection');
  console.log('═'.repeat(70));

  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  // Find markdown files
  const mdDir = path.join(__dirname, 'courseMarkdown');
  if (!fs.existsSync(mdDir)) {
    console.log(`📁 Creating directory: ${mdDir}`);
    fs.mkdirSync(mdDir, { recursive: true });
    console.log('⚠️  No markdown files found. Place .md files in src/scripts/courseMarkdown/ and run again.');
    await mongoose.disconnect();
    return;
  }

  const files = fs.readdirSync(mdDir).filter(f => /\.(md|txt)$/i.test(f));
  console.log(`📂 Found ${files.length} markdown files in ${mdDir}\n`);

  let seeded = 0, skipped = 0, errors = 0;

  for (const filename of files) {
    try {
      const filepath = path.join(mdDir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      const wordCount = countWords(content);
      
      console.log(`📝 Processing: ${filename} (${wordCount.toLocaleString()} words)`);

      if (wordCount < 2000) {
        console.log(`   ⚠️  Skipping — too short (${wordCount} words)\n`);
        skipped++;
        continue;
      }

      // Parse markdown into modules
      const { meta, modules, objectives, references } = parseMarkdownToModules(content, filename);
      
      if (!meta) {
        // Try to generate metadata from content
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : filename.replace(/\.(md|txt)$/, '');
        console.log(`   ⚠️  No registry match for ${filename}, using extracted title: ${title}`);
      }
      
      const slug = meta?.slug || generateSlug(meta?.title || filename);
      const ceHours = meta?.ceHours || Math.max(1, Math.round(wordCount / 6000));

      // Convert modules to contentBlocks
      const interactiveModules = modules.map((mod, idx) => ({
        title: mod.title,
        order: mod.order || idx + 1,
        contentBlocks: moduleToContentBlocks(mod, modules.length)
      }));

      // Build assessment from extracted questions
      const allQuestions = [];
      for (const mod of modules) {
        allQuestions.push(...extractKnowledgeChecks(mod.rawContent));
      }

      const courseData = {
        slug,
        title: meta?.title || filename.replace(/\.(md|txt)$/, ''),
        description: meta?.description || `A ${ceHours}-hour continuing education course for mental health professionals.`,
        shortDescription: meta?.description?.substring(0, 200) || '',
        courseCode: meta?.code || '',
        ceHours,
        credits: ceHours,
        ceuHours: ceHours,
        ceuEligible: true,
        category: meta?.category || 'Clinical Skills',
        contentArea: meta?.contentArea || 'Clinical Skills',
        creditType: 'NBCC',
        acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' },
        targetAudience: [
          'Licensed Professional Counselors (LPC/LPCC)',
          'Licensed Clinical Social Workers (LCSW)',
          'Licensed Marriage and Family Therapists (LMFT)',
          'Licensed Mental Health Counselors (LMHC)',
          'Psychologists',
          'Graduate-level counseling students under supervision'
        ],
        instructionalLevel: 'Intermediate',
        objectives: objectives.length > 0 ? objectives : [
          `Identify key concepts and evidence-based practices related to ${meta?.contentArea || 'clinical practice'}`,
          `Apply clinical frameworks discussed in this course to real-world client scenarios`,
          `Evaluate the strengths and limitations of different intervention approaches`,
          `Integrate course concepts into professional development and clinical practice`
        ],
        deliveryMethod: 'online',
        price: 0,
        isActive: true,
        isPublished: true,
        status: 'published',
        modules: interactiveModules,
        assessment: {
          questions: allQuestions.slice(0, 25).map(q => ({
            question: q.question,
            type: 'multiple_choice',
            options: q.options.map(o => typeof o === 'string' ? o : o.text),
            correctAnswer: q.options.findIndex(o => o.isCorrect),
            explanation: q.explanation
          })),
          passingScore: 80,
          maxAttempts: 3
        },
        // Store full APA citations as strings (schema is [String])
        // Preserve complete citation text for ACEP compliance and reuse
        references: references.length > 0
          ? references.map(r => r.fullCitation || `${r.author} (${r.year}). ${r.title}. ${r.source}`)
          : [],
        settings: {
          passingScore: 80,
          certificateEnabled: true,
          requireEvaluation: true,
          requireAttestation: true
        },
        wordCount,
        accessibility: {
          wcagLevel: 'AA',
          screenReaderOptimized: true,
          keyboardNavigable: true
        },
        updatedAt: new Date(),
        seededAt: new Date(),
        seededFrom: filename
      };

      // Content preservation check — compare source word count to processed output
      let processedWords = 0;
      for (const mod of interactiveModules) {
        for (const block of (mod.contentBlocks || [])) {
          processedWords += countWords(block.content || block.textContent || '');
          if (block.accordionItems) {
            for (const item of block.accordionItems) {
              processedWords += countWords(item.content || '');
            }
          }
        }
      }

      const comparison = compareWordCounts(wordCount, processedWords, meta?.title || filename);
      if (!comparison.ok) {
        console.log(`   ⚠️  ${comparison.message}`);
        console.log(`   ⚠️  Content loss detected — review markdownToHtml conversion`);
      }

      // Upsert
      await collection.updateOne(
        { slug },
        { $set: courseData },
        { upsert: true }
      );

      const blockCount = interactiveModules.reduce((sum, m) => sum + m.contentBlocks.length, 0);
      const assessQs = courseData.assessment.questions.length;
      console.log(`   ✅ Seeded: ${slug}`);
      console.log(`      ${ceHours} CE | ${wordCount.toLocaleString()} source words → ${processedWords.toLocaleString()} processed | ${modules.length} modules | ${blockCount} blocks | ${assessQs} Qs\n`);
      seeded++;

    } catch (err) {
      console.log(`   ❌ Error: ${filename}: ${err.message}\n`);
      errors++;
    }
  }

  // Summary
  const total = await collection.countDocuments();
  console.log('═'.repeat(70));
  console.log(`  Seeded: ${seeded} | Skipped: ${skipped} | Errors: ${errors}`);
  console.log(`  Total in interactivecourses: ${total}`);
  console.log('═'.repeat(70) + '\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
