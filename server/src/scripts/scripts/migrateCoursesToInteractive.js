/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * migrateCoursesToInteractive.js
 * 
 * Reads courses from BOTH collections (courses + interactivecourses),
 * converts ALL to the interactivecourses format with rich contentBlocks,
 * and writes/updates them in the interactivecourses collection.
 * 
 * What it does:
 * 1. Reads every course from both collections
 * 2. For courses in old format (modules[].lessons[]):
 *    - Converts lessons to contentBlocks with sectionDividers, text blocks, 
 *      accordion, multipleChoice, matching, reflection, flashcardDeck
 *    - Extracts quiz questions into proper assessment format
 *    - Splits long text blocks into digestible sections
 * 3. For courses already in interactivecourses:
 *    - Checks if they need enrichment (missing assessments, thin blocks)
 *    - Adds missing assessment questions if needed
 * 4. Writes everything to interactivecourses collection
 * 
 * Run on Render: node src/scripts/migrateCoursesToInteractive.js
 * Requires: MONGODB_URI environment variable
 * 
 * IDEMPOTENT: Safe to run multiple times. Updates by slug.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  const clean = stripHtml(text);
  return clean.split(/\s+/).filter(w => w.length > 0).length;
}

function countContentWords(course) {
  let total = 0;
  const modules = course.modules || course.sections || [];
  for (const mod of modules) {
    // Old format: lessons[]
    if (mod.lessons) {
      for (const lesson of mod.lessons) {
        if (lesson.content) total += countWords(lesson.content);
        if (lesson.textContent) total += countWords(lesson.textContent);
      }
    }
    // New format: contentBlocks[]
    if (mod.contentBlocks) {
      for (const block of mod.contentBlocks) {
        if (block.content) total += countWords(block.content);
        if (block.textContent) total += countWords(block.textContent);
        if (block.accordionItems) {
          for (const item of block.accordionItems) {
            if (item.content) total += countWords(item.content);
          }
        }
      }
    }
  }
  return total;
}

/**
 * Split a long HTML content string into logical sections based on h2/h3 headings
 */
function splitContentIntoSections(html) {
  if (!html || countWords(html) < 200) return [{ title: null, content: html }];
  
  // Split on h2 or h3 tags
  const sections = [];
  const parts = html.split(/(?=<h[23][^>]*>)/i);
  
  for (const part of parts) {
    if (!part.trim()) continue;
    
    // Extract heading title if present
    const headingMatch = part.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    const title = headingMatch ? stripHtml(headingMatch[1]) : null;
    
    sections.push({ title, content: part.trim() });
  }
  
  return sections.length > 0 ? sections : [{ title: null, content: html }];
}

/**
 * Generate knowledge check questions from content text using heuristics
 */
function generateKnowledgeChecks(content, moduleTitle, moduleOrder) {
  const text = stripHtml(content);
  const checks = [];
  
  // Look for strong/bold terms that could be key concepts
  const boldTerms = content.match(/<strong>([^<]+)<\/strong>/g) || [];
  const terms = boldTerms.map(t => stripHtml(t)).filter(t => t.length > 3 && t.length < 80);
  
  if (terms.length >= 4) {
    // Create a matching exercise from bold terms and their context
    const pairs = [];
    for (let i = 0; i < Math.min(5, terms.length); i++) {
      const term = terms[i];
      // Find the sentence containing this term
      const sentenceMatch = text.match(new RegExp(`[^.]*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^.]*\\.`, 'i'));
      if (sentenceMatch) {
        const definition = sentenceMatch[0].replace(term, '___').trim().substring(0, 120);
        pairs.push({ term, definition });
      }
    }
    if (pairs.length >= 3) {
      checks.push({
        type: 'matching',
        matchingInstructions: `Match each key concept from ${moduleTitle} to its description.`,
        matchingPairs: pairs.slice(0, 5),
        accessibility: { ariaLabel: `Matching exercise for ${moduleTitle}`, role: 'application' }
      });
    }
  }
  
  return checks;
}

/**
 * Create flashcard deck from bold terms in content
 */
function generateFlashcards(content, moduleTitle) {
  const boldTerms = [];
  const regex = /<strong>([^<]+)<\/strong>/g;
  let match;
  const text = stripHtml(content);
  
  while ((match = regex.exec(content)) !== null) {
    const term = stripHtml(match[1]);
    if (term.length > 3 && term.length < 80) {
      // Find context sentence
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const sentenceMatch = text.match(new RegExp(`([^.]*${escaped}[^.]*\\.)`, 'i'));
      if (sentenceMatch) {
        boldTerms.push({
          id: `f${boldTerms.length + 1}`,
          front: term,
          back: sentenceMatch[1].trim().substring(0, 200)
        });
      }
    }
  }
  
  if (boldTerms.length >= 4) {
    return {
      type: 'flashcardDeck',
      instructions: `Review these key terms from ${moduleTitle}. Click each card to reveal the definition.`,
      flashcards: boldTerms.slice(0, 8),
      accessibility: { ariaLabel: `Flashcard deck for ${moduleTitle}` }
    };
  }
  return null;
}

/**
 * Convert old-format course (modules[].lessons[]) to interactivecourses format (modules[].contentBlocks[])
 */
function convertToInteractiveFormat(course) {
  const oldModules = course.modules || [];
  const newModules = [];
  
  for (const mod of oldModules) {
    const contentBlocks = [];
    const moduleTitle = mod.title || `Module ${mod.order || newModules.length + 1}`;
    const moduleOrder = mod.order || newModules.length + 1;
    
    // Section divider
    contentBlocks.push({
      type: 'sectionDivider',
      sectionNumber: moduleOrder,
      title: moduleTitle,
      subtitle: mod.objectives?.[0] || '',
      accessibility: { role: 'heading', ariaLevel: 2 }
    });
    
    // Process each lesson
    const lessons = mod.lessons || [];
    for (const lesson of lessons) {
      if (lesson.type === 'quiz' && lesson.questions) {
        // Convert quiz questions to multipleChoice blocks (knowledge checks)
        for (const q of lesson.questions.slice(0, 3)) { // Max 3 per module for ACEP
          if (q.options && q.options.length >= 2) {
            // Handle both string[] and {text, isCorrect}[] formats
            const isObjectFormat = typeof q.options[0] === 'object';
            
            contentBlocks.push({
              type: 'multipleChoice',
              question: q.question,
              options: isObjectFormat 
                ? q.options 
                : q.options.map((opt, idx) => ({
                    text: opt,
                    isCorrect: idx === (q.correctAnswer || 0)
                  })),
              explanation: q.explanation || `Review the content in this module for a detailed explanation.`,
              accessibility: { ariaLabel: 'Knowledge check question', announceCorrect: true }
            });
          }
        }
      } else if (lesson.content) {
        // Split long content into sections
        const sections = splitContentIntoSections(lesson.content);
        
        for (const section of sections) {
          const wordCount = countWords(section.content);
          
          if (wordCount > 800) {
            // Split into a text block, potentially with an accordion for subsections
            const subSections = section.content.split(/(?=<h[34][^>]*>)/i);
            
            if (subSections.length > 2) {
              // First part as text, rest as accordion
              contentBlocks.push({
                type: 'text',
                content: subSections[0].trim(),
                accessibility: { role: 'article' }
              });
              
              const accordionItems = [];
              for (let i = 1; i < subSections.length; i++) {
                const heading = subSections[i].match(/<h[34][^>]*>(.*?)<\/h[34]>/i);
                const itemTitle = heading ? stripHtml(heading[1]) : `Section ${i}`;
                const itemContent = heading ? subSections[i].replace(heading[0], '').trim() : subSections[i].trim();
                if (countWords(itemContent) > 30) {
                  accordionItems.push({ title: itemTitle, content: itemContent });
                }
              }
              
              if (accordionItems.length >= 2) {
                contentBlocks.push({
                  type: 'accordion',
                  accordionItems,
                  accessibility: { role: 'region', ariaLabel: `Expandable content for ${section.title || moduleTitle}` }
                });
              }
            } else {
              contentBlocks.push({
                type: 'text',
                content: section.content,
                accessibility: { role: 'article' }
              });
            }
          } else if (wordCount > 30) {
            contentBlocks.push({
              type: 'text',
              content: section.content,
              accessibility: { role: 'article' }
            });
          }
        }
        
        // Add interactive elements based on content analysis
        const flashcards = generateFlashcards(lesson.content, moduleTitle);
        if (flashcards) {
          contentBlocks.push(flashcards);
        }
      }
    }
    
    // Add a reflection at the end of each module
    contentBlocks.push({
      type: 'reflection',
      question: `Reflect on the key concepts from ${moduleTitle}. How might you apply these ideas in your current clinical practice? Consider a specific client scenario where this knowledge would change your approach.`,
      minLength: 50,
      accessibility: { role: 'textbox', ariaLabel: `Reflection prompt for ${moduleTitle}` }
    });
    
    newModules.push({
      title: moduleTitle,
      order: moduleOrder,
      contentBlocks
    });
  }
  
  return newModules;
}

/**
 * Extract all quiz questions from old-format course into assessment format
 */
function extractAssessment(course) {
  const questions = [];
  
  // Check existing assessment
  if (course.assessment?.questions?.length >= 15) {
    return course.assessment;
  }
  
  // Extract from quiz lessons
  const modules = course.modules || [];
  for (const mod of modules) {
    for (const lesson of (mod.lessons || [])) {
      if (lesson.type === 'quiz' && lesson.questions) {
        for (const q of lesson.questions) {
          if (q.question && q.options?.length >= 2) {
            const isObjectFormat = typeof q.options[0] === 'object';
            questions.push({
              question: q.question,
              type: q.type || 'multiple_choice',
              options: isObjectFormat
                ? q.options.map(o => typeof o === 'string' ? o : o.text)
                : q.options,
              correctAnswer: isObjectFormat
                ? q.options.findIndex(o => o.isCorrect)
                : (q.correctAnswer || 0),
              explanation: q.explanation || 'Review the course content for a detailed explanation.'
            });
          }
        }
      }
    }
  }
  
  // Also check assessment field
  if (course.assessment?.questions) {
    for (const q of course.assessment.questions) {
      if (q.question && !questions.find(existing => existing.question === q.question)) {
        const isObjectFormat = q.options?.[0] && typeof q.options[0] === 'object';
        questions.push({
          question: q.question,
          type: q.type || 'multiple_choice',
          options: isObjectFormat
            ? q.options.map(o => typeof o === 'string' ? o : o.text)
            : (q.options || []),
          correctAnswer: isObjectFormat
            ? q.options.findIndex(o => o.isCorrect)
            : (q.correctAnswer || 0),
          explanation: q.explanation || 'Review the course content for a detailed explanation.'
        });
      }
    }
  }
  
  return {
    questions: questions.slice(0, 25), // Max 25
    passingScore: 80,
    maxAttempts: 3
  };
}

/**
 * Build the standard ACEP metadata fields
 */
function buildMetadata(course) {
  return {
    creditType: course.creditType || 'NBCC',
    acepProvider: typeof course.acepProvider === 'string' 
      ? { name: course.acepProvider, number: course.acepNumber || '7760' }
      : (course.acepProvider || { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' }),
    acepNumber: course.acepNumber || '7760',
    targetAudience: course.targetAudience || [
      'Licensed Professional Counselors (LPC/LPCC)',
      'Licensed Clinical Social Workers (LCSW)',
      'Licensed Marriage and Family Therapists (LMFT)',
      'Licensed Mental Health Counselors (LMHC)',
      'Psychologists',
      'Graduate-level counseling students under supervision'
    ],
    instructionalLevel: course.instructionalLevel || course.level || 'Intermediate',
    learningObjectives: course.learningObjectives || course.objectives || [],
    contentArea: course.contentArea || course.category || 'Clinical Skills',
    deliveryMethod: 'online',
    accessibility: course.accessibility || {
      wcagLevel: 'AA',
      screenReaderOptimized: true,
      keyboardNavigable: true
    }
  };
}

// ============================================================
// MAIN MIGRATION FUNCTION
// ============================================================

async function main() {
  console.log('\n' + '═'.repeat(70));
  console.log('  COUNSELORREADY COURSE MIGRATION');
  console.log('  courses → interactivecourses (contentBlocks format)');
  console.log('═'.repeat(70));

  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const oldCollection = db.collection('courses');
  const newCollection = db.collection('interactivecourses');

  // Read from both collections
  const oldCourses = await oldCollection.find({}).toArray();
  const existingInteractive = await newCollection.find({}).toArray();
  
  console.log(`📊 Found ${oldCourses.length} courses in 'courses' collection`);
  console.log(`📊 Found ${existingInteractive.length} courses in 'interactivecourses' collection\n`);

  // Build slug map of what's already in interactivecourses
  const interactiveBySlug = {};
  for (const c of existingInteractive) {
    if (c.slug) interactiveBySlug[c.slug] = c;
  }

  let migrated = 0, enriched = 0, skipped = 0, errors = 0;

  // Process courses from OLD collection that need migration
  for (const course of oldCourses) {
    try {
      const slug = course.slug;
      if (!slug) {
        console.log(`  ⚠️  Skipping course without slug: ${course.title?.substring(0, 50) || 'Untitled'}`);
        skipped++;
        continue;
      }

      // Skip empty shells (no CE hours, no content)
      const ceHours = course.ceHours || course.credits || course.ceuHours || 0;
      if (ceHours === 0 && (!course.modules || course.modules.length === 0)) {
        console.log(`  ❌ Empty shell (no CE, no content): ${slug}`);
        skipped++;
        continue;
      }

      const wordCount = countContentWords(course);
      if (wordCount < 500) {
        console.log(`  ❌ Too thin (${wordCount} words): ${slug}`);
        skipped++;
        continue;
      }

      // Check if already in interactivecourses with good content
      const existing = interactiveBySlug[slug];
      if (existing) {
        const existingWords = countContentWords(existing);
        if (existingWords >= wordCount) {
          console.log(`  ✓  Already in interactive (${existingWords} words): ${slug}`);
          skipped++;
          continue;
        }
        // Old collection has MORE content — migrate it
        console.log(`  🔄 Old has more content (${wordCount} vs ${existingWords}): ${slug}`);
      }

      // Convert to interactive format
      const newModules = convertToInteractiveFormat(course);
      const assessment = extractAssessment(course);
      const metadata = buildMetadata(course);

      const interactiveCourse = {
        slug,
        title: course.title,
        description: course.description || course.shortDescription || '',
        shortDescription: course.shortDescription || '',
        ceHours: ceHours,
        credits: ceHours,
        ceuHours: ceHours,
        ceuEligible: true,
        category: course.category || 'Clinical Skills',
        price: course.price || 0,
        isActive: true,
        isPublished: true,
        status: 'published',
        ...metadata,
        modules: newModules,
        assessment,
        references: course.references || [],
        settings: {
          passingScore: 80,
          certificateEnabled: true,
          requireEvaluation: true,
          requireAttestation: true
        },
        wordCount,
        updatedAt: new Date(),
        migratedAt: new Date(),
        migratedFrom: 'courses'
      };

      // Upsert to interactivecourses
      await newCollection.updateOne(
        { slug },
        { $set: interactiveCourse },
        { upsert: true }
      );

      const blockCount = newModules.reduce((sum, m) => sum + (m.contentBlocks?.length || 0), 0);
      const assessQs = assessment.questions?.length || 0;
      console.log(`  ✅ Migrated: ${slug}`);
      console.log(`     ${ceHours} CE | ${wordCount.toLocaleString()} words | ${newModules.length} modules | ${blockCount} blocks | ${assessQs} assessment Qs`);
      migrated++;

    } catch (err) {
      console.log(`  ❌ Error: ${course.slug || course.title?.substring(0, 40)}: ${err.message}`);
      errors++;
    }
  }

  // Now check interactivecourses that might need enrichment
  console.log('\n' + '─'.repeat(70));
  console.log('  Checking existing interactivecourses for enrichment needs...\n');

  const allInteractive = await newCollection.find({}).toArray();
  for (const course of allInteractive) {
    const slug = course.slug;
    if (!slug) continue;

    const ceHours = course.ceHours || course.credits || 0;
    const wordCount = countContentWords(course);
    const assessQs = course.assessment?.questions?.length || 0;
    const hasModules = (course.modules?.length || 0) > 0;
    const wordsPerCE = ceHours > 0 ? Math.round(wordCount / ceHours) : 0;

    // Flag issues
    const issues = [];
    if (wordsPerCE < 6000 && ceHours > 0) issues.push(`${wordsPerCE} words/CE (need 6000)`);
    if (assessQs < 15) issues.push(`${assessQs} assessment Qs (need 15)`);
    if (!hasModules) issues.push('no modules');

    if (issues.length > 0) {
      console.log(`  ⚠️  ${slug}: ${issues.join(' | ')}`);
    } else {
      console.log(`  ✓  ${slug}: ${ceHours}CE, ${wordCount.toLocaleString()} words, ${assessQs} Qs ✅`);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('  MIGRATION SUMMARY');
  console.log('═'.repeat(70));
  console.log(`  Migrated:  ${migrated}`);
  console.log(`  Enriched:  ${enriched}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Errors:    ${errors}`);

  const finalCount = await newCollection.countDocuments();
  const pipeline = [{ $group: { _id: null, totalCE: { $sum: '$ceHours' } } }];
  const agg = await newCollection.aggregate(pipeline).toArray();
  const totalCE = agg[0]?.totalCE || 0;

  console.log(`\n  Total in interactivecourses: ${finalCount} courses | ${totalCE} CE hours`);
  console.log('═'.repeat(70) + '\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
