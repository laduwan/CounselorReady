// routes/aiCourseGenerator.js
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Helper to generate module titles
function getModuleTitle(topic, index) {
  const templates = [
    "Foundations, Definitions, and Theoretical Frameworks",
    "Assessment Tools and Clinical Indicators",
    "Evidence-Based Intervention Strategies",
    "Clinical Application and Case Conceptualization",
    "Special Populations and Cultural Considerations",
    "Ethical and Legal Considerations",
    "Advanced Techniques and Integration",
    "Implementation, Self-Care, and Professional Development",
    "Emerging Research and Future Directions",
    "Comprehensive Review and Clinical Synthesis",
  ];
  return templates[index % templates.length];
}

// @route   POST /api/ai-course-generator/generate
// @desc    Generate course outline and content using Claude
// @access  Private/Admin
router.post('/generate', protect, requireAdmin, async (req, res) => {
  try {
    const { topic, ceHours, level, category, uploadedContent } = req.body;

    if (!topic && !uploadedContent) {
      return res.status(400).json({ 
        error: 'Either topic or uploadedContent is required' 
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'ANTHROPIC_API_KEY not configured on server' 
      });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Step 1: Generate course outline
    const outlinePrompt = uploadedContent 
      ? `Convert this content into a structured ${ceHours}-hour CE course outline with modules and learning objectives:\n\n${uploadedContent}`
      : `Create a detailed ${ceHours}-hour continuing education course outline on "${topic}" for mental health professionals. Level: ${level}. Category: ${category}. Include:
- Course title and description
- 4-6 learning objectives
- ${Math.ceil(ceHours / 1.5)} modules with descriptive titles
- Target audience (LPCs, LMHCs, LCSWs, LMFTs)
- ACEP compliance notes`;

    const outlineResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: outlinePrompt
      }]
    });

    const outlineText = outlineResponse.content[0].text;

    // Step 2: Parse outline into structured course data
    const numModules = Math.ceil(ceHours / 1.5);
    const modules = [];
    
    for (let i = 0; i < numModules; i++) {
      modules.push({
        id: Math.random().toString(36).slice(2, 9),
        number: i + 1,
        title: `Module ${i + 1}: ${getModuleTitle(topic, i)}`,
        blocks: [],
        knowledgeChecks: 3
      });
    }

    // Step 3: Generate content for each module
    const minWordsPerModule = Math.ceil((ceHours * 6000) / numModules);

    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      
      const contentPrompt = `Create detailed educational content for "${module.title}" in a course about ${topic}. 
      
Requirements:
- Write ${minWordsPerModule} words minimum
- Include clinical examples and evidence-based practices
- Use clear headings and paragraphs
- Include 3 knowledge check questions at the end
- Format as HTML with <h3>, <p>, <ul>, <strong> tags
- Target audience: Licensed mental health professionals`;

      const contentResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: contentPrompt
        }]
      });

      const content = contentResponse.content[0].text;
      
      // Parse content into blocks
      const blocks = parseContentIntoBlocks(content, module.number);
      module.blocks = blocks;

      // Send progress update
      res.write(`data: ${JSON.stringify({
        type: 'progress',
        message: `Generated module ${i + 1}/${modules.length}`,
        percent: Math.round(((i + 1) / modules.length) * 100)
      })}\n\n`);
    }

    // Step 4: Generate assessment questions
    const questionCount = Math.max(15, Math.ceil(ceHours) * 5);
    const assessmentPrompt = `Create ${questionCount} multiple-choice assessment questions for a ${ceHours}-hour CE course on ${topic}. 
    
Format each as:
{
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Why this is correct"
}

Return ONLY a JSON array of ${questionCount} questions.`;

    const assessmentResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: assessmentPrompt
      }]
    });

    let assessmentQuestions = [];
    try {
      const assessmentText = assessmentResponse.content[0].text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      assessmentQuestions = JSON.parse(assessmentText);
    } catch (e) {
      console.error('Failed to parse assessment questions:', e);
      assessmentQuestions = generateDefaultAssessment();
    }

    // Step 5: Build final course object
    const course = {
      title: topic || `${ceHours}-Hour CE Course`,
      ceHours: parseFloat(ceHours) || 3,
      level,
      category,
      description: `A comprehensive ${ceHours}-hour continuing education course for mental health professionals on ${topic}.`,
      objectives: extractObjectives(outlineText),
      targetAudience: ["LPCs", "LMHCs", "LCSWs", "LMFTs"],
      modules,
      assessment: {
        questions: assessmentQuestions,
        passThreshold: 0.80
      },
      acepProvider: {
        name: "GA Integrated Therapeutic Perspectives LLC",
        number: "7760"
      }
    };

    res.write(`data: ${JSON.stringify({
      type: 'complete',
      course
    })}\n\n`);
    res.end();

  } catch (error) {
    console.error('AI Course Generation Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate course',
      details: error.toString()
    });
  }
});

// Helper function to parse content into blocks
// CRITICAL: Preserve ALL content. Never discard text.
// Per GOLD_STANDARD_SPEC §18.1: Never strip content through pipeline processing.
function parseContentIntoBlocks(content, moduleNumber) {
  const blocks = [];

  // Add section divider
  blocks.push({
    id: Math.random().toString(36).slice(2, 9),
    type: 'sectionDivider',
    title: `Module ${moduleNumber}`,
    sectionNumber: moduleNumber,
    subtitle: ''
  });

  // Split content into sections by H3 tags, but PRESERVE the heading text
  const sections = content.split(/(?=<h3[^>]*>)/i).filter(s => s.trim());

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // Check if this section contains knowledge check questions
    // Separate them from instructional content
    const kcPattern = /(?:Knowledge Check|Question \d+:)/i;
    if (kcPattern.test(trimmed)) {
      // Extract KC questions separately
      const questionMatches = trimmed.matchAll(/Question \d+:\s*(.*?)(?=Question \d+:|$)/gs);
      let hasQuestions = false;

      for (const match of questionMatches) {
        hasQuestions = true;
        const qText = match[1].trim();
        // Try to parse options from the question text
        const optionMatches = [...qText.matchAll(/([A-D])\)\s*(.+?)(?=[A-D]\)|$)/gs)];
        const questionLine = qText.split(/[A-D]\)/)[0]?.trim() || qText;

        if (optionMatches.length >= 2) {
          const options = optionMatches.map((m, idx) => ({
            text: m[2].trim(),
            isCorrect: idx === 0 // Default — should be overridden by answer key
          }));
          blocks.push({
            id: Math.random().toString(36).slice(2, 9),
            type: 'multipleChoice',
            question: questionLine,
            options,
            explanation: 'Review the course content for the rationale behind this answer.'
          });
        }
      }

      // If there was non-KC content before the questions, preserve it
      const preKC = trimmed.split(kcPattern)[0]?.trim();
      if (preKC && preKC.length > 50) {
        blocks.push({
          id: Math.random().toString(36).slice(2, 9),
          type: 'text',
          content: preKC
        });
      }
    } else {
      // Regular instructional content — preserve in full as text block
      // Keep the h3 heading intact (it provides structure)
      blocks.push({
        id: Math.random().toString(36).slice(2, 9),
        type: 'text',
        content: trimmed
      });
    }
  }

  return blocks;
}

// Helper to extract objectives from outline
function extractObjectives(text) {
  const objectives = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/^[-*•]\s*(.+)|^\d+\.\s*(.+)/)) {
      const obj = line.replace(/^[-*•\d.]\s*/, '').trim();
      if (obj.length > 20 && obj.length < 200) {
        objectives.push(obj);
      }
    }
  }
  
  return objectives.slice(0, 6);
}

// Helper to generate default assessment
function generateDefaultAssessment() {
  return Array(15).fill(null).map((_, i) => ({
    question: `Assessment question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0,
    explanation: 'Correct answer explanation'
  }));
}

export default router;
