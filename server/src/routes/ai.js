/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/ai.js
// AI Generation API for CounselorReady CourseBuilder
// ===================================================
// Proxies requests to Anthropic Claude API with ACEP-compliant system prompts.
// Supports: course outline generation, content generation, block-level AI actions.
//
// Mount in index.js:
//   import aiRoutes from './routes/ai.js';
//   app.use('/api/ai', aiRoutes);
//
// Required env vars:
//   ANTHROPIC_API_KEY=your-key
//   ANTHROPIC_MODEL=claude-sonnet-4-5-20250929 (optional, defaults to Sonnet 4.5)
// ===================================================

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Extend timeout for all AI routes (Anthropic API calls can take 30-90s)
router.use((req, res, next) => {
  req.setTimeout(120000);
  res.setTimeout(120000);
  next();
});

// ─── INLINE AUTH (avoids dependency on auth.js export names) ──
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// ─── CONFIG ────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// ─── ACEP SYSTEM PROMPT ────────────────────────────────────────
const ACEP_SYSTEM_PROMPT = `You are an expert continuing education course developer for CounselorReady, an NBCC Approved Continuing Education Provider (#7760) operated by GA Integrated Therapeutic Perspectives LLC.

ACEP COMPLIANCE REQUIREMENTS (non-negotiable):
- Minimum 6,000 words per CE credit hour
- 2-5 knowledge checks per module (multipleChoice, multiSelect, or matching blocks)
- Final exam: minimum 15 questions, 80% pass threshold
- Every course needs: learning objectives, target audience, references (APA 7th edition)
- Content must be evidence-based with proper citations
- Target audience: LPCs, LMHCs, LCSWs, LMFTs, NCCs, Psychologists, Psychiatric NPs

CONTENT BLOCK TYPES (use these exactly):
- Content: sectionDivider, text, imageText, accordion, resources, videoEmbed, image
- Assessment: multipleChoice, multiSelect, matching, cardSort, sequencing, timeline
- Interactive: reflection, hotspot, scenarioTree, flashcardDeck

BLOCK STRUCTURE (JSON format):
- sectionDivider: { type, title, sectionNumber, subtitle }
- text: { type: "text", content: "<p>HTML content here</p>" }
- accordion: { type, accordionItems: [{ title, content }] }
- multipleChoice: { type, question, options: [{ text, isCorrect }], explanation }
- multiSelect: { type, question, options: [{ text, isCorrect }], explanation }
- matching: { type, matchingPairs: [{ term, definition }], matchingInstructions }
- reflection: { type, question, minLength: 100 }
- resources: { type, resources: [{ title, url, type: "pdf"|"link"|"video" }] }
- flashcardDeck: { type, instructions, flashcards: [{ id, front, back }] }
- scenarioTree: { type, scenarioTitle, instructions, startNode: "start", nodes: { start: { text, choices: [{ text, next }], feedback } } }

COURSE STRUCTURE:
{
  title, description, ceHours, level, category,
  targetAudience: [...],
  objectives: [...],
  modules: [{ id, number, title, estimatedWords, knowledgeChecks, blocks: [...] }],
  totalEstimatedWords,
  references,
  assessment: { questions: [], passThreshold: 0.80 },
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" }
}

BRAND: CounselorReady — "Learn. License. Lead."
Colors: Burgundy #6B1D34, Hunter Green #4A7C59, Gold #D4A855, Navy #284157

When generating content, use HTML formatting in text blocks (<p>, <h2>, <h3>, <strong>, <em>, <ul>, <li>).
Always include proper clinical terminology and evidence-based frameworks.
Reference APA 7th edition style citations where appropriate.`;

// ─── ANTHROPIC API CALL ────────────────────────────────────────
async function callClaude(prompt, systemPrompt, maxTokens = 4096) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt || ACEP_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error(`Claude API error (${response.status}):`, errBody);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content
    ?.filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n') || '';

  return {
    content: text,
    model: data.model,
    usage: data.usage,
  };
}

// ─── POST /api/ai/generate ─────────────────────────────────────
// General purpose AI generation endpoint
// Body: { prompt, systemPrompt?, maxTokens? }

router.post('/generate', protect, requireAdmin, async (req, res) => {
  try {
    const { prompt, systemPrompt, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🤖 AI Generate: ${prompt.substring(0, 80)}...`);

    const result = await callClaude(
      prompt,
      systemPrompt || ACEP_SYSTEM_PROMPT,
      maxTokens || 4096
    );

    console.log(`✅ AI response: ${result.content.length} chars, ${result.usage?.output_tokens || '?'} tokens`);

    res.json(result);
  } catch (error) {
    console.error('❌ AI generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/ai/outline ──────────────────────────────────────
// Generate a course outline from topic + parameters
// Body: { topic, ceHours, level, category, additionalNotes?, uploadedContent? }

router.post('/outline', protect, requireAdmin, async (req, res) => {
  try {
    const { topic, ceHours, level, category, additionalNotes, uploadedContent } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const minWords = ceHours * 6000;
    const moduleCount = Math.max(4, ceHours * 2);

    let prompt = `Generate a detailed course outline for an ACEP-compliant continuing education course.

PARAMETERS:
- Topic: ${topic}
- CE Hours: ${ceHours}
- Level: ${level}
- Category: ${category}
- Minimum total words: ${minWords.toLocaleString()}
- Number of modules: ${moduleCount}
${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}

${uploadedContent ? `EXISTING CONTENT TO BUILD FROM:\n${uploadedContent.substring(0, 8000)}\n\n` : ''}

Return ONLY valid JSON (no markdown, no backticks) in this exact structure:
{
  "title": "Course Title: Subtitle",
  "description": "2-3 sentence course description",
  "ceHours": ${ceHours},
  "level": "${level}",
  "category": "${category}",
  "targetAudience": ["LPCs", "LMHCs", "LCSWs", "LMFTs", "Psychologists", "Psychiatric NPs"],
  "objectives": ["Objective 1...", "Objective 2...", "Objective 3...", "Objective 4...", "Objective 5..."],
  "modules": [
    {
      "number": 1,
      "title": "Module 1: Title Here",
      "estimatedWords": ${Math.ceil(minWords / moduleCount)},
      "knowledgeChecks": 3,
      "blocks": [],
      "objectives": ["Module-specific objective 1", "Module-specific objective 2"]
    }
  ],
  "totalEstimatedWords": ${minWords},
  "references": 15,
  "assessment": { "questions": [], "passThreshold": 0.80 },
  "acepProvider": { "name": "GA Integrated Therapeutic Perspectives LLC", "number": "7760" }
}

Generate exactly ${moduleCount} modules with descriptive titles specific to "${topic}". Each module title should follow the format "Module N: Descriptive Title". Make objectives measurable using Bloom's taxonomy verbs (define, identify, apply, evaluate, develop, analyze, compare).`;

    console.log(`🤖 Generating outline for "${topic}" (${ceHours}CE, ${moduleCount} modules)...`);

    const result = await callClaude(prompt, ACEP_SYSTEM_PROMPT, 4096);

    // Parse JSON from response
    let outline;
    try {
      // Strip any markdown code fences if present
      const cleaned = result.content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      outline = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse outline JSON:', parseErr.message);
      return res.status(500).json({
        error: 'AI returned invalid JSON. Please try again.',
        rawContent: result.content.substring(0, 500),
      });
    }

    // Ensure required fields
    outline.ceHours = ceHours;
    outline.acepProvider = { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' };
    if (!outline.assessment) outline.assessment = { questions: [], passThreshold: 0.80 };
    if (!outline.modules) outline.modules = [];

    // Add IDs to modules
    outline.modules = outline.modules.map((mod, i) => ({
      ...mod,
      id: Math.random().toString(36).slice(2, 9),
      number: i + 1,
      blocks: mod.blocks || [],
      knowledgeChecks: mod.knowledgeChecks || 3,
      estimatedWords: mod.estimatedWords || Math.ceil(minWords / moduleCount),
      expanded: false,
    }));

    console.log(`✅ Outline generated: "${outline.title}" — ${outline.modules.length} modules`);

    res.json({
      outline,
      usage: result.usage,
    });
  } catch (error) {
    console.error('❌ Outline generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/ai/content ──────────────────────────────────────
// Generate content blocks for a single module
// Body: { module: { title, estimatedWords, knowledgeChecks, objectives }, courseTitle, courseTopic, moduleIndex }

router.post('/content', protect, requireAdmin, async (req, res) => {
  try {
    const { module: mod, courseTitle, courseTopic, moduleIndex, sourceContent } = req.body;

    if (!mod?.title) {
      return res.status(400).json({ error: 'Module with title required' });
    }

    const targetWords = mod.estimatedWords || 1500;
    const kcCount = mod.knowledgeChecks || 3;

    let prompt = `Generate the complete content blocks for this course module.

COURSE: ${courseTitle || 'Continuing Education Course'}
MODULE: ${mod.title} (Module ${(moduleIndex || 0) + 1})
TARGET WORD COUNT: ${targetWords} words minimum
KNOWLEDGE CHECKS NEEDED: ${kcCount}
${mod.objectives ? `MODULE OBJECTIVES:\n${mod.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}` : ''}

${sourceContent ? `SOURCE CONTENT TO EXPAND:\n${sourceContent.substring(0, 6000)}\n\nIMPORTANT: If the source content contains questions, quizzes, or knowledge checks, preserve their approximate placement relative to the surrounding content topics. Place each knowledge check after the same content it follows in the original.\n\n` : ''}

Generate content blocks as a JSON array.

CRITICAL LAYOUT RULE: Distribute knowledge checks THROUGHOUT the module — place one after every 2-3 text blocks to reinforce learning as the reader progresses. Do NOT group all knowledge checks together at the end.

Structure pattern to follow:
1. A sectionDivider block at the start
2. 2-3 text blocks with substantial HTML content (~500+ words each)
3. 1 knowledge check block (multipleChoice or multiSelect) testing the PRECEDING content
4. Repeat steps 2-3 until all ${kcCount} knowledge checks are distributed throughout
5. At least 1 accordion block for key concepts (place where natural, e.g. after introducing terminology)
6. 1 reflection block at the end
7. Use <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li> in text content

Return ONLY a valid JSON array of blocks (no markdown, no backticks):
[
  { "type": "sectionDivider", "title": "...", "sectionNumber": ${(moduleIndex || 0) + 1}, "subtitle": "..." },
  { "type": "text", "content": "<h2>...</h2><p>...</p>" },
  { "type": "text", "content": "<h2>...</h2><p>...</p>" },
  { "type": "multipleChoice", "question": "...", "options": [{ "text": "...", "isCorrect": false }, ...], "explanation": "..." },
  { "type": "text", "content": "<h2>...</h2><p>...</p>" },
  { "type": "accordion", "accordionItems": [{ "title": "...", "content": "..." }] },
  { "type": "multiSelect", "question": "...", "options": [{ "text": "...", "isCorrect": false }, ...], "explanation": "..." },
  { "type": "text", "content": "<h2>...</h2><p>...</p>" },
  { "type": "reflection", "question": "...", "minLength": 100 }
]

Make all knowledge check questions clinically relevant with plausible distractors. Include detailed explanations for each question. Each knowledge check should test comprehension of the content immediately BEFORE it, not content that comes later. Content must be evidence-based and appropriate for licensed mental health professionals.`;

    console.log(`🤖 Generating content for "${mod.title}" (${targetWords}w, ${kcCount} KC)...`);

    const result = await callClaude(prompt, ACEP_SYSTEM_PROMPT, 8192);

    // Parse JSON array
    let blocks;
    try {
      const cleaned = result.content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      blocks = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse content blocks JSON:', parseErr.message);
      return res.status(500).json({
        error: 'AI returned invalid JSON for content blocks. Please try again.',
        rawContent: result.content.substring(0, 500),
      });
    }

    if (!Array.isArray(blocks)) {
      return res.status(500).json({ error: 'Expected JSON array of blocks' });
    }

    // Add IDs to all blocks
    blocks = blocks.map(block => ({
      ...block,
      id: Math.random().toString(36).slice(2, 9),
    }));

    console.log(`✅ Content generated: ${blocks.length} blocks`);

    res.json({
      blocks,
      usage: result.usage,
    });
  } catch (error) {
    console.error('❌ Content generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/ai/block-action ─────────────────────────────────
// Per-block AI actions (expand, simplify, generate quiz, etc.)
// Body: { action, block, context? }

router.post('/block-action', protect, requireAdmin, async (req, res) => {
  try {
    const { action, block, context } = req.body;

    if (!action || !block) {
      return res.status(400).json({ error: 'Action and block required' });
    }

    const prompts = {
      'expand': `Expand the following text block content to be more comprehensive. Add clinical examples, research references, and practical applications. Double the word count while maintaining accuracy. Return ONLY the expanded HTML content (no JSON wrapper, no backticks).\n\nCurrent content:\n${block.content || block.question || ''}`,

      'simplify': `Simplify the following text while retaining all key clinical concepts and accuracy. Use clearer language appropriate for practicing clinicians. Return ONLY the simplified HTML content.\n\nCurrent content:\n${block.content || ''}`,

      'add-citations': `Add 3-5 relevant APA 7th edition citations to this text. Integrate them naturally as in-text citations and add a references section at the end. Use real, plausible clinical/counseling references. Return ONLY the updated HTML content.\n\nCurrent content:\n${block.content || ''}`,

      'generate-question': `Generate a clinically relevant multiple choice question for a CE course. Return ONLY valid JSON (no backticks):\n{"question": "...", "options": [{"text": "...", "isCorrect": false}, {"text": "...", "isCorrect": true}, {"text": "...", "isCorrect": false}, {"text": "...", "isCorrect": false}], "explanation": "..."}\n\nContext: ${context || block.content?.substring(0, 500) || 'General clinical practice'}`,

      'improve-options': `Improve this quiz question's answer options to be more clinically nuanced with better distractors. Return ONLY valid JSON with the same structure.\n\nCurrent question: ${JSON.stringify({ question: block.question, options: block.options, explanation: block.explanation })}`,

      'generate-pairs': `Generate 5-6 matching pairs for a clinical CE course matching activity. Return ONLY a valid JSON array (no backticks):\n[{"term": "...", "definition": "..."}]\n\nContext: ${context || 'Clinical counseling concepts'}`,

      'generate-prompt': `Generate a thoughtful clinical reflection prompt for a CE course that encourages self-reflection and clinical application. Return ONLY the reflection question text (no JSON, no backticks).\n\nContext: ${context || 'Clinical practice development'}`,

      'generate-cards': `Generate 6-8 flashcards for a clinical CE course. Return ONLY a valid JSON array (no backticks):\n[{"id": "f1", "front": "Term or concept", "back": "Definition or explanation"}]\n\nContext: ${context || 'Clinical counseling concepts'}`,

      'generate-scenario': `Generate a clinical scenario tree for a CE course. Return ONLY valid JSON (no backticks):\n{"scenarioTitle": "...", "instructions": "...", "startNode": "start", "nodes": {"start": {"text": "...", "choices": [{"text": "...", "next": "option_a"}, {"text": "...", "next": "option_b"}]}, "option_a": {"text": "...", "feedback": "...", "choices": []}, "option_b": {"text": "...", "feedback": "...", "choices": []}}}\n\nContext: ${context || 'Clinical decision-making scenario'}`,

      'ai-write': `Write substantial content for a CE course text block on the given topic. Include clinical detail, evidence-based information, and practical applications. Aim for 400-600 words. Return ONLY HTML content (no JSON, no backticks).\n\nTopic: ${context || block.title || 'Clinical practice concepts'}`,
    };

    const prompt = prompts[action];
    if (!prompt) {
      return res.status(400).json({ error: `Unknown action: ${action}. Supported: ${Object.keys(prompts).join(', ')}` });
    }

    console.log(`🤖 Block action "${action}" on ${block.type} block...`);

    const result = await callClaude(prompt, ACEP_SYSTEM_PROMPT, 4096);

    // Determine if response should be parsed as JSON
    const jsonActions = ['generate-question', 'improve-options', 'generate-pairs', 'generate-cards', 'generate-scenario'];
    let parsedContent = result.content;

    if (jsonActions.includes(action)) {
      try {
        const cleaned = result.content
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        parsedContent = JSON.parse(cleaned);
      } catch (e) {
        // Return raw text if JSON parse fails
        console.warn(`JSON parse failed for ${action}, returning raw text`);
      }
    }

    console.log(`✅ Block action complete`);

    res.json({
      action,
      content: parsedContent,
      usage: result.usage,
    });
  } catch (error) {
    console.error('❌ Block action error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// ---- POST /api/ai/suggest-block ----
// Generate AI content for a specific block type based on surrounding text.
router.post('/suggest-block', protect, requireAdmin, async (req, res) => {
  const { blockType, textBefore, textAfter, courseTitle, moduleTitle } = req.body;

  if (!blockType) return res.status(400).json({ error: 'blockType is required' });
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const trimTo = (text, maxWords) => {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).slice(0, maxWords).join(' ');
  };

  const typePrompts = {
    multipleChoice: 'Generate a knowledge check with 4 options (1 correct). Return JSON: { "question":"...","options":[{"text":"...","isCorrect":false},{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}],"explanation":"..." }',
    multiSelect: 'Generate a multi-select question (2-3 correct out of 5). Return JSON: { "question":"...","options":[{"text":"...","isCorrect":false}...],"explanation":"..." }',
    matching: 'Generate 4-5 term/definition matching pairs. Return JSON: { "matchingPairs":[{"term":"...","definition":"..."}...],"matchingInstructions":"Match each term with its definition." }',
    reflection: 'Generate a clinical reflection prompt. Return JSON: { "question":"...","minLength":50 }',
    accordion: 'Generate 3-4 expandable accordion sections. Return JSON: { "accordionItems":[{"title":"...","content":"..."}...] }',
    flashcardDeck: 'Generate 4-6 flashcards. Return JSON: { "instructions":"Review key concepts","flashcards":[{"id":"f1","front":"...","back":"..."}...] }',
    cardSort: 'Generate card sort with 2 categories and 6+ cards. Return JSON: { "instructions":"...","categories":["A","B"],"cards":[{"id":"c1","text":"...","correctCategory":"A"}...],"explanation":"..." }',
    sequencing: 'Generate 4-6 ordered steps. Return JSON: { "instructions":"...","steps":[{"id":"s1","text":"...","order":1}...],"explanation":"..." }',
    timeline: 'Generate 4-6 chronological events. Return JSON: { "instructions":"...","events":[{"id":"t1","text":"...","year":"...","order":1}...],"explanation":"..." }',
    scenarioTree: 'Generate a clinical scenario with 2 choices. Return JSON: { "scenarioTitle":"...","instructions":"...","startNode":"start","nodes":{"start":{"text":"...","choices":[{"text":"...","next":"a"},{"text":"...","next":"b"}],"feedback":null},"a":{"text":"...","choices":[],"feedback":"excellent"},"b":{"text":"...","choices":[],"feedback":"consider"}} }',
    imageText: 'Generate image+text block. Return JSON: { "title":"...","content":"...","imageAlt":"Suggested: [describe ideal image]","imagePosition":"left","highlight":false }',
    hotspot: 'Generate hotspot diagram. Return JSON: { "instructions":"...","imageDescription":"Suggested: [describe]","hotspots":[{"id":"h1","x":25,"y":30,"label":"...","description":"..."}],"explanation":"..." }',
  };

  const typePrompt = typePrompts[blockType];
  if (!typePrompt) return res.json({ block: {}, message: 'No AI suggestion for ' + blockType });

  try {
    console.log('AI suggest-block:', blockType);
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2000,
        system: 'You are a CE content expert for CounselorReady (NBCC ACEP #7760). Generate clinically accurate graduate-level content for mental health professionals. Return ONLY valid JSON, no markdown fences or preamble.',
        messages: [{ role: 'user', content: `Course: ${courseTitle || 'CE Course'}\nModule: ${moduleTitle || 'Module'}\n\nCONTENT BEFORE:\n${trimTo(textBefore, 800) || '(start)'}\n\nCONTENT AFTER:\n${trimTo(textAfter, 400) || '(end)'}\n\nTASK:\n${typePrompt}\n\nReturn ONLY JSON.` }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic error:', response.status, errText);
      return res.status(500).json({ error: 'AI API error: ' + response.status });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || '';
    let block = {};
    try {
      block = JSON.parse(rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim());
    } catch (e) {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw: rawText });
    }

    console.log('AI suggest-block complete:', blockType);
    res.json({ block, usage: data.usage });
  } catch (error) {
    console.error('AI suggest-block error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/ai/status ────────────────────────────────────────
// Health check — is the AI configured and reachable?

router.get('/status', protect, async (req, res) => {
  res.json({
    configured: !!ANTHROPIC_API_KEY,
    model: ANTHROPIC_MODEL,
    provider: 'anthropic',
  });
});

export default router;
