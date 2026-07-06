/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import Anthropic from '@anthropic-ai/sdk';
import { createLocalClient } from './localAIClient.js';

// AI_BACKEND=local -> generate with your own on-prem model (Ollama), grounded in
// your corpus. Unset (or anything else) -> unchanged cloud behavior via Anthropic.
const USE_LOCAL = process.env.AI_BACKEND === 'local';
const anthropic = USE_LOCAL
  ? createLocalClient()
  : new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getModuleTitle(topic, index) {
  const templates = [
    'Foundations, Definitions, and Theoretical Frameworks',
    'Assessment Tools and Clinical Indicators',
    'Evidence-Based Intervention Strategies',
    'Clinical Application and Case Conceptualization',
    'Special Populations and Cultural Considerations',
    'Ethical and Legal Considerations',
    'Advanced Techniques and Integration',
    'Implementation, Self-Care, and Professional Development',
    'Emerging Research and Future Directions',
    'Comprehensive Review and Clinical Synthesis',
  ];
  return templates[index % templates.length];
}

function parseContentIntoBlocks(content, moduleNumber) {
  const blocks = [];
  blocks.push({
    id: Math.random().toString(36).slice(2, 9),
    type: 'sectionDivider',
    title: `Module ${moduleNumber}`,
    sectionNumber: moduleNumber,
    subtitle: ''
  });

  const sections = content.split(/(?=<h3[^>]*>)/i).filter(s => s.trim());
  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;
    const kcPattern = /(?:Knowledge Check|Question \d+:)/i;
    if (kcPattern.test(trimmed)) {
      const questionMatches = [...trimmed.matchAll(/Question \d+:\s*(.*?)(?=Question \d+:|$)/gs)];
      for (const match of questionMatches) {
        const qText = match[1].trim();
        const optionMatches = [...qText.matchAll(/([A-D])\)\s*(.+?)(?=[A-D]\)|$)/gs)];
        const questionLine = qText.split(/[A-D]\)/)[0]?.trim() || qText;
        if (optionMatches.length >= 2) {
          blocks.push({
            id: Math.random().toString(36).slice(2, 9),
            type: 'multipleChoice',
            question: questionLine,
            options: optionMatches.map((m, idx) => ({ text: m[2].trim(), isCorrect: idx === 0 })),
            explanation: 'Review the course content for the rationale behind this answer.'
          });
        }
      }
      const preKC = trimmed.split(kcPattern)[0]?.trim();
      if (preKC && preKC.length > 50) {
        blocks.push({ id: Math.random().toString(36).slice(2, 9), type: 'text', content: preKC });
      }
    } else {
      blocks.push({ id: Math.random().toString(36).slice(2, 9), type: 'text', content: trimmed });
    }
  }
  return blocks;
}

function extractObjectives(text) {
  const objectives = [];
  for (const line of text.split('\n')) {
    if (line.match(/^[-*•]\s*(.+)|^\d+\.\s*(.+)/)) {
      const obj = line.replace(/^[-*•\d.]\s*/, '').trim();
      if (obj.length > 20 && obj.length < 200) objectives.push(obj);
    }
  }
  return objectives.slice(0, 6);
}

function generateDefaultAssessment() {
  return Array(15).fill(null).map((_, i) => ({
    question: `Assessment question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0,
    explanation: 'Correct answer explanation'
  }));
}

/**
 * Generate a course draft using Claude.
 * Returns { course, usageTotals } where usageTotals = { input_tokens, output_tokens }.
 * Throws on generation failure — caller must NOT charge on throw.
 */
export async function generateCourseDraft({ topic, uploadedContent, ceHours, level, category }) {
  if (!USE_LOCAL && !process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured on server');

  const usageTotals = { input_tokens: 0, output_tokens: 0 };

  // Step 1: outline
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
    messages: [{ role: 'user', content: outlinePrompt }]
  });
  usageTotals.input_tokens += outlineResponse.usage.input_tokens;
  usageTotals.output_tokens += outlineResponse.usage.output_tokens;

  const outlineText = outlineResponse.content[0].text;
  const numModules = Math.ceil(ceHours / 1.5);
  const modules = Array.from({ length: numModules }, (_, i) => ({
    id: Math.random().toString(36).slice(2, 9),
    number: i + 1,
    title: `Module ${i + 1}: ${getModuleTitle(topic || 'this topic', i)}`,
    blocks: [],
    knowledgeChecks: 3
  }));

  const minWordsPerModule = Math.ceil((ceHours * 6000) / numModules);

  // Step 2: per-module content
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const contentPrompt = `Create detailed educational content for "${module.title}" in a course about ${topic || 'this topic'}.

Requirements:
- Write ${minWordsPerModule} words minimum
- Include clinical examples and evidence-based practices
- Use clear headings and paragraphs
- Distribute 3 knowledge check questions throughout the content (place one after every 2-3 paragraphs, NOT all at the end)
- Format as HTML with <h3>, <p>, <ul>, <strong> tags
- Target audience: Licensed mental health professionals`;

    const contentResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: contentPrompt }]
    });
    usageTotals.input_tokens += contentResponse.usage.input_tokens;
    usageTotals.output_tokens += contentResponse.usage.output_tokens;

    module.blocks = parseContentIntoBlocks(contentResponse.content[0].text, module.number);
  }

  // Step 3: assessment
  const questionCount = Math.max(15, Math.ceil(ceHours) * 5);
  const assessmentPrompt = `Create ${questionCount} multiple-choice assessment questions for a ${ceHours}-hour CE course on ${topic || 'this topic'}.

Format each as:
{"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Why this is correct"}

Return ONLY a JSON array of ${questionCount} questions.`;

  const assessmentResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: assessmentPrompt }]
  });
  usageTotals.input_tokens += assessmentResponse.usage.input_tokens;
  usageTotals.output_tokens += assessmentResponse.usage.output_tokens;

  let assessmentQuestions = [];
  try {
    const assessmentText = assessmentResponse.content[0].text
      .replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    assessmentQuestions = JSON.parse(assessmentText);
  } catch {
    assessmentQuestions = generateDefaultAssessment();
  }

  const course = {
    title: topic || `${ceHours}-Hour CE Course`,
    ceHours: parseFloat(ceHours) || 3,
    level,
    category,
    description: `A comprehensive ${ceHours}-hour continuing education course for mental health professionals on ${topic || 'this topic'}.`,
    objectives: extractObjectives(outlineText),
    targetAudience: ['LPCs', 'LMHCs', 'LCSWs', 'LMFTs'],
    modules,
    assessment: { questions: assessmentQuestions, passThreshold: 0.80 },
    acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' }
  };

  return { course, usageTotals };
}

/**
 * Compliance-free course draft generator for partner-owned courses.
 * Partners may train any audience — not necessarily mental health professionals.
 * No ACEP/NBCC word-count minimums, no CR provider stamp, no hardcoded audience.
 */
export async function generatePartnerCourseDraft({ topic, uploadedContent, ceHours, level, category, targetAudience }) {
  if (!USE_LOCAL && !process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured on server');

  const usageTotals = { input_tokens: 0, output_tokens: 0 };
  const audienceLabel = targetAudience || 'adult learners';

  // Step 1: outline
  const outlinePrompt = uploadedContent
    ? `Convert this content into a structured ${ceHours}-hour CE course outline with modules and learning objectives:\n\n${uploadedContent}`
    : `Create a detailed ${ceHours}-hour continuing education course outline on "${topic}". Level: ${level}. Category: ${category}. Include:
- Course title and description
- 4-6 learning objectives
- ${Math.ceil(ceHours / 1.5)} modules with descriptive titles
- Target audience: ${audienceLabel}`;

  const outlineResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: outlinePrompt }]
  });
  usageTotals.input_tokens += outlineResponse.usage.input_tokens;
  usageTotals.output_tokens += outlineResponse.usage.output_tokens;

  const outlineText = outlineResponse.content[0].text;
  const numModules = Math.ceil(ceHours / 1.5);
  const modules = Array.from({ length: numModules }, (_, i) => ({
    id: Math.random().toString(36).slice(2, 9),
    number: i + 1,
    title: `Module ${i + 1}: ${getModuleTitle(topic || 'this topic', i)}`,
    blocks: [],
    knowledgeChecks: 3
  }));

  const minWordsPerModule = Math.ceil((ceHours * 1500) / numModules);

  // Step 2: per-module content
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const contentPrompt = `Create educational content for "${module.title}" in a course about ${topic || 'this topic'}.

Requirements:
- Write ${minWordsPerModule} words minimum
- Include practical examples and evidence-based information
- Use clear headings and paragraphs
- Distribute 3 knowledge check questions throughout the content (place one after every 2-3 paragraphs, NOT all at the end)
- Format as HTML with <h3>, <p>, <ul>, <strong> tags
- Target audience: ${audienceLabel}`;

    const contentResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: contentPrompt }]
    });
    usageTotals.input_tokens += contentResponse.usage.input_tokens;
    usageTotals.output_tokens += contentResponse.usage.output_tokens;

    module.blocks = parseContentIntoBlocks(contentResponse.content[0].text, module.number);
  }

  // Step 3: assessment (proportional, no 15-question minimum from ACEP)
  const questionCount = Math.max(5, Math.ceil(ceHours) * 3);
  const assessmentPrompt = `Create ${questionCount} multiple-choice assessment questions for a ${ceHours}-hour course on ${topic || 'this topic'} aimed at ${audienceLabel}.

Format each as:
{"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Why this is correct"}

Return ONLY a JSON array of ${questionCount} questions.`;

  const assessmentResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: assessmentPrompt }]
  });
  usageTotals.input_tokens += assessmentResponse.usage.input_tokens;
  usageTotals.output_tokens += assessmentResponse.usage.output_tokens;

  let assessmentQuestions = [];
  try {
    const assessmentText = assessmentResponse.content[0].text
      .replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    assessmentQuestions = JSON.parse(assessmentText);
  } catch {
    assessmentQuestions = generateDefaultAssessment();
  }

  const course = {
    title: topic || `${ceHours}-Hour CE Course`,
    ceHours: parseFloat(ceHours) || 3,
    level,
    category,
    description: `A ${ceHours}-hour course for ${audienceLabel} on ${topic || 'this topic'}.`,
    objectives: extractObjectives(outlineText),
    targetAudience: [audienceLabel],
    modules,
    assessment: { questions: assessmentQuestions, passThreshold: 0.70 }
  };

  return { course, usageTotals };
}
