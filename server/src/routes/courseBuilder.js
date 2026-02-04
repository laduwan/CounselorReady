/**
 * courseBuilder.js - AI Course Builder API Routes
 * 
 * Generates ACEP-compliant CE courses using Anthropic Claude API
 * 
 * Place in: server/src/routes/courseBuilder.js
 * Add to index.js: import courseBuilderRoutes from './routes/courseBuilder.js';
 *                  app.use('/api/admin/course-builder', courseBuilderRoutes);
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { protect, adminOnly } from '../middleware/auth.js';
import { getAllTemplates, getTemplateById, getModuleStructure } from '../config/courseTemplates.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════
// TEMPLATE ROUTES
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/course-builder/templates
 * Get all available course templates
 */
router.get('/templates', protect, adminOnly, (req, res) => {
  try {
    const templates = getAllTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/course-builder/templates/:id
 * Get a specific template with full details
 */
router.get('/templates/:id', protect, adminOnly, (req, res) => {
  try {
    const template = getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/course-builder/templates/:id/apply
 * Apply a template to generate initial course structure
 */
router.post('/templates/:id/apply', protect, adminOnly, (req, res) => {
  try {
    const { ceHours, customTitle } = req.body;
    const template = getTemplateById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const hours = ceHours || template.defaultCEHours;
    const modules = getModuleStructure(req.params.id, hours);

    res.json({
      title: customTitle || template.name,
      description: template.description,
      ceHours: hours,
      category: template.category,
      level: template.level,
      targetAudience: template.targetAudience,
      objectives: template.suggestedObjectives.slice(0, Math.min(8, template.suggestedObjectives.length)),
      modules: modules,
      coreTopics: template.coreTopics,
      clinicalVignettes: template.clinicalVignettes || [],
      references: template.references
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ACEP Requirements
const WORDS_PER_CE_HOUR = 6000;
const MIN_KNOWLEDGE_CHECKS_PER_MODULE = 3;
const MAX_KNOWLEDGE_CHECKS_PER_MODULE = 5;
const MIN_ASSESSMENT_QUESTIONS = 15;
const PASS_THRESHOLD = 0.80;

/**
 * POST /api/admin/course-builder/outline
 * Generate course outline from topic
 */
router.post('/outline', protect, adminOnly, async (req, res) => {
  try {
    const { title, ceHours, category, level, topic, targetAudience, specialInstructions } = req.body;

    if (!title || !topic || !ceHours) {
      return res.status(400).json({ error: 'Title, topic, and CE hours are required' });
    }

    const moduleCount = Math.max(4, ceHours * 2); // 2 modules per CE hour minimum

    const prompt = `You are an expert instructional designer for mental health continuing education courses. Generate a detailed course outline for NBCC ACEP-compliant CE training.

COURSE PARAMETERS:
- Title: ${title}
- CE Hours: ${ceHours} (requires ${ceHours * WORDS_PER_CE_HOUR}+ words total)
- Category: ${category}
- Level: ${level}
- Target Audience: ${targetAudience?.join(', ') || 'Licensed mental health professionals'}
- Topic Description: ${topic}
${specialInstructions ? `- Special Instructions: ${specialInstructions}` : ''}

Generate a JSON object with this EXACT structure:
{
  "title": "Course title",
  "description": "Comprehensive 2-3 paragraph course description",
  "objectives": [
    "Learning objective 1 (measurable, action-oriented)",
    "Learning objective 2",
    ... (6-8 objectives)
  ],
  "modules": [
    {
      "title": "Module 1: Title Here",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "estimatedWords": 3000
    },
    ... (${moduleCount} modules total)
  ]
}

REQUIREMENTS:
1. Each module should cover ~${Math.round((ceHours * WORDS_PER_CE_HOUR) / moduleCount)} words of content
2. Learning objectives must be measurable (use Bloom's taxonomy verbs)
3. Include clinical application and evidence-based content
4. Progress from foundational concepts to advanced application
5. Include ethics considerations where relevant

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    
    // Parse JSON (handle potential markdown wrapping)
    let outline;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      outline = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ error: 'Failed to parse outline', raw: content });
    }

    // Add metadata
    outline.ceHours = ceHours;
    outline.category = category;
    outline.level = level;
    outline.targetAudience = targetAudience;

    res.json(outline);

  } catch (error) {
    console.error('Outline generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/course-builder/generate
 * Generate full course content from outline
 */
router.post('/generate', protect, adminOnly, async (req, res) => {
  try {
    const { title, ceHours, category, level, targetAudience, outline, specialInstructions } = req.body;

    if (!outline || !outline.modules) {
      return res.status(400).json({ error: 'Outline with modules is required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    const wordsPerModule = Math.round((ceHours * WORDS_PER_CE_HOUR) / outline.modules.length);
    const course = {
      title: outline.title || title,
      slug: slugify(outline.title || title),
      description: outline.description,
      ceHours: ceHours,
      credits: ceHours,
      category: category,
      level: level,
      contentArea: category,
      targetAudience: targetAudience || [],
      objectives: outline.objectives || [],
      deliveryMethod: 'online',
      modules: [],
      assessment: { questions: [], passThreshold: PASS_THRESHOLD },
      references: [],
      isPublished: false,
      status: 'draft',
      acepProvider: {
        name: 'GA Integrated Therapeutic Perspectives LLC',
        number: '7760'
      },
      presenter: {
        name: 'CounselorReady',
        credentials: 'NBCC ACEP #7760',
        qualificationStatement: 'Content developed by licensed mental health professionals with expertise in clinical practice.'
      }
    };

    // Generate each module
    for (let i = 0; i < outline.modules.length; i++) {
      const mod = outline.modules[i];
      console.log(`Generating Module ${i + 1}: ${mod.title}`);

      const moduleContent = await generateModule({
        moduleNumber: i + 1,
        moduleTitle: mod.title,
        topics: mod.topics,
        wordsTarget: wordsPerModule,
        courseTitle: course.title,
        courseDescription: course.description,
        level: level,
        targetAudience: targetAudience
      });

      course.modules.push(moduleContent);
    }

    // Generate final assessment
    console.log('Generating final assessment...');
    course.assessment = await generateAssessment({
      courseTitle: course.title,
      modules: course.modules,
      questionCount: Math.max(MIN_ASSESSMENT_QUESTIONS, ceHours * 7)
    });

    // Generate references
    console.log('Generating references...');
    course.references = await generateReferences({
      courseTitle: course.title,
      category: category,
      topics: outline.modules.map(m => m.title)
    });

    // Calculate word count
    course._wordCount = countCourseWords(course);
    course._requiredWords = ceHours * WORDS_PER_CE_HOUR;
    course._meetsRequirement = course._wordCount >= course._requiredWords * 0.9;

    res.json(course);

  } catch (error) {
    console.error('Course generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate a single module with lessons and quiz
 */
async function generateModule({ moduleNumber, moduleTitle, topics, wordsTarget, courseTitle, courseDescription, level, targetAudience }) {
  const prompt = `You are an expert instructional designer creating content for a mental health CE course.

CONTEXT:
- Course: ${courseTitle}
- Module ${moduleNumber}: ${moduleTitle}
- Topics to cover: ${topics?.join(', ') || 'Based on module title'}
- Target word count: ${wordsTarget} words
- Level: ${level}
- Audience: ${targetAudience?.join(', ') || 'Licensed mental health professionals'}

Generate comprehensive module content as JSON with this EXACT structure:
{
  "title": "${moduleTitle}",
  "order": ${moduleNumber},
  "lessons": [
    {
      "title": "Lesson title",
      "order": 1,
      "type": "text",
      "content": "<h3>Section Header</h3><p>Detailed educational content with multiple paragraphs...</p><h3>Another Section</h3><p>More content...</p>",
      "textContent": "Plain text version for word counting"
    },
    ... (3-5 lessons per module)
  ],
  "quiz": {
    "title": "Module ${moduleNumber} Knowledge Check",
    "questions": [
      {
        "question": "Question text here?",
        "options": [
          { "text": "Option A", "isCorrect": false },
          { "text": "Option B", "isCorrect": true },
          { "text": "Option C", "isCorrect": false },
          { "text": "Option D", "isCorrect": false }
        ],
        "explanation": "Explanation of correct answer"
      },
      ... (${MIN_KNOWLEDGE_CHECKS_PER_MODULE}-${MAX_KNOWLEDGE_CHECKS_PER_MODULE} questions)
    ],
    "passingScore": 0.80
  }
}

CONTENT REQUIREMENTS:
1. Write ${wordsTarget}+ words of educational content across lessons
2. Include clinical examples and case vignettes
3. Use evidence-based information
4. Format content with HTML tags: <h3>, <p>, <strong>, <ul>, <li>
5. Make quiz questions challenging but fair, testing key concepts
6. Each lesson should be substantial (500-1500 words)

Return ONLY valid JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.content[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

/**
 * Generate final assessment questions
 */
async function generateAssessment({ courseTitle, modules, questionCount }) {
  const moduleTopics = modules.map(m => m.title).join(', ');
  
  const prompt = `Generate a final assessment for the CE course "${courseTitle}".

The course covers these modules: ${moduleTopics}

Generate ${questionCount} multiple-choice questions as JSON:
{
  "questions": [
    {
      "question": "Question text?",
      "options": [
        { "text": "Option A", "isCorrect": false },
        { "text": "Option B", "isCorrect": true },
        { "text": "Option C", "isCorrect": false },
        { "text": "Option D", "isCorrect": false }
      ],
      "explanation": "Why B is correct..."
    }
  ],
  "passThreshold": 0.80
}

REQUIREMENTS:
1. Distribute questions evenly across all modules
2. Include application-level questions (not just recall)
3. Make distractors plausible but clearly incorrect
4. Each question should have exactly ONE correct answer
5. Explanations should be educational

Return ONLY valid JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.content[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

/**
 * Generate references
 */
async function generateReferences({ courseTitle, category, topics }) {
  const prompt = `Generate 10-15 scholarly references for a CE course on "${courseTitle}" in the ${category} category.

Topics covered: ${topics.join(', ')}

Return a JSON array of APA-formatted reference strings:
["Reference 1 in APA format", "Reference 2 in APA format", ...]

Include:
- Peer-reviewed journal articles (2018-2024)
- Foundational texts in the field
- Practice guidelines from professional organizations (ACA, APA, NASW)
- Recent systematic reviews or meta-analyses

Return ONLY a JSON array.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = response.content[0].text;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

/**
 * Helper: Count words in course
 */
function countCourseWords(course) {
  let total = 0;
  
  const countWords = (text) => {
    if (!text) return 0;
    return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  };

  total += countWords(course.description);
  course.objectives?.forEach(obj => { total += countWords(obj); });
  
  course.modules?.forEach(mod => {
    total += countWords(mod.title);
    mod.lessons?.forEach(lesson => {
      total += countWords(lesson.textContent || lesson.content);
    });
    mod.quiz?.questions?.forEach(q => {
      total += countWords(q.question);
      q.options?.forEach(o => { total += countWords(o.text); });
      total += countWords(q.explanation);
    });
  });

  course.assessment?.questions?.forEach(q => {
    total += countWords(q.question);
    q.options?.forEach(o => { total += countWords(o.text); });
    total += countWords(q.explanation);
  });

  return total;
}

/**
 * Helper: Generate slug
 */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * POST /api/admin/course-builder/save
 * Save generated course to database
 */
router.post('/save', protect, adminOnly, async (req, res) => {
  try {
    const courseData = req.body;
    
    // Import Course model dynamically
    const Course = (await import('../models/Course.js')).default;
    
    // Clean up internal fields
    delete courseData._wordCount;
    delete courseData._requiredWords;
    delete courseData._meetsRequirement;

    // Check for existing course with same slug
    let existing = await Course.findOne({ slug: courseData.slug });
    
    if (existing) {
      // Update existing
      Object.assign(existing, courseData);
      existing.updatedAt = new Date();
      await existing.save();
      res.json({ success: true, action: 'updated', course: existing });
    } else {
      // Create new
      courseData.createdAt = new Date();
      courseData.updatedAt = new Date();
      courseData.enrollmentCount = 0;
      courseData.analytics = { views: 0, completions: 0 };
      
      const course = new Course(courseData);
      await course.save();
      res.json({ success: true, action: 'created', course });
    }

  } catch (error) {
    console.error('Save course error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
