/**
 * Research Synthesis Service
 * Uses Anthropic Claude to perform meta-analysis and comparative analysis
 * of scholarly articles, then generates CEU course content and assessments.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

async function callClaude(systemPrompt, userPrompt, maxTokens = 8192) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';
}

function parseJSON(text) {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  // Try to find JSON object or array
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  const jsonStr = objMatch ? objMatch[0] : (arrMatch ? arrMatch[0] : cleaned);
  return JSON.parse(jsonStr);
}

/**
 * Format articles into a structured summary for AI prompts.
 */
function formatArticlesForPrompt(articles) {
  return articles.map((a, i) => {
    const parts = [`Article ${i + 1}:`];
    parts.push(`  Title: ${a.title}`);
    if (a.authors) parts.push(`  Authors: ${a.authors}`);
    if (a.journal) parts.push(`  Journal: ${a.journal}`);
    if (a.year) parts.push(`  Year: ${a.year}`);
    if (a.abstract) parts.push(`  Abstract: ${a.abstract}`);
    if (a.doi) parts.push(`  DOI: ${a.doi}`);
    return parts.join('\n');
  }).join('\n\n');
}

/**
 * Perform a meta-analysis synthesis of multiple articles.
 * Returns structured findings suitable for course content generation.
 */
export async function synthesizeMetaAnalysis(articles, topic) {
  const articleText = formatArticlesForPrompt(articles);

  const systemPrompt = `You are a research methodologist specializing in counseling psychology. You perform scholarly meta-analyses and research syntheses at a graduate/professional level. Your analyses must be rigorous, evidence-based, and suitable for licensed counselor continuing education.`;

  const userPrompt = `Perform a meta-analytic synthesis of the following ${articles.length} scholarly articles on the topic: "${topic}"

${articleText}

Analyze these articles and produce a comprehensive synthesis. Return ONLY valid JSON (no markdown fences) in this exact format:
{
  "synthesisType": "meta-analysis",
  "topic": "${topic}",
  "articleCount": ${articles.length},
  "overarchingThemes": [
    {
      "theme": "Theme name",
      "description": "2-3 sentence description of this theme across articles",
      "supportingArticles": [1, 3, 5],
      "strengthOfEvidence": "strong | moderate | emerging"
    }
  ],
  "methodologicalPatterns": {
    "commonDesigns": ["list of research designs used"],
    "sampleCharacteristics": "Summary of typical sample sizes, demographics",
    "measurementApproaches": "Common instruments and measures used",
    "limitations": ["Common methodological limitations across studies"]
  },
  "keyFindings": [
    {
      "finding": "Clear statement of finding",
      "effectDirection": "positive | negative | mixed | null",
      "clinicalSignificance": "How this matters for counseling practice",
      "supportingArticles": [1, 2, 4]
    }
  ],
  "clinicalImplications": [
    "Specific, actionable implication for counseling practice"
  ],
  "researchGaps": [
    "Identified gap in the literature"
  ],
  "suggestedCourseTitle": "Proposed CE course title based on synthesis",
  "suggestedContentAreas": ["NBCC content area 1", "NBCC content area 2"],
  "narrativeSummary": "A 3-4 paragraph narrative summary of the meta-analytic findings suitable for course introduction"
}`;

  const response = await callClaude(systemPrompt, userPrompt);
  return parseJSON(response);
}

/**
 * Perform a comparative analysis of articles.
 * Highlights similarities, differences, and debates in the literature.
 */
export async function synthesizeComparativeAnalysis(articles, topic) {
  const articleText = formatArticlesForPrompt(articles);

  const systemPrompt = `You are a counseling psychology researcher specializing in comparative literature reviews. You identify points of agreement, disagreement, and nuance across studies. Your analyses are suitable for professional continuing education for licensed counselors.`;

  const userPrompt = `Perform a comparative analysis of the following ${articles.length} scholarly articles on the topic: "${topic}"

${articleText}

Compare and contrast these articles' approaches, findings, and conclusions. Return ONLY valid JSON (no markdown fences) in this exact format:
{
  "synthesisType": "comparative-analysis",
  "topic": "${topic}",
  "articleCount": ${articles.length},
  "pointsOfAgreement": [
    {
      "point": "What the studies agree on",
      "supportingArticles": [1, 2, 3],
      "clinicalRelevance": "Why this consensus matters for practice"
    }
  ],
  "pointsOfDisagreement": [
    {
      "point": "Where the studies diverge",
      "perspectives": [
        { "position": "Position A", "supportingArticles": [1, 3] },
        { "position": "Position B", "supportingArticles": [2, 4] }
      ],
      "possibleReasons": "Why perspectives may differ"
    }
  ],
  "methodologicalComparisons": [
    {
      "dimension": "e.g., Sample size, Design type, Measurement",
      "comparison": "How articles differ on this dimension"
    }
  ],
  "evolutionOfThinking": "How understanding of this topic has evolved across the articles",
  "bestPracticeRecommendations": [
    "Evidence-supported recommendation for counseling practice"
  ],
  "suggestedCourseTitle": "Proposed CE course title based on comparative analysis",
  "suggestedContentAreas": ["NBCC content area 1", "NBCC content area 2"],
  "narrativeSummary": "A 3-4 paragraph comparative summary suitable for course introduction"
}`;

  const response = await callClaude(systemPrompt, userPrompt);
  return parseJSON(response);
}

/**
 * Generate a full CEU course from a research synthesis.
 * Takes the output of either meta-analysis or comparative analysis
 * and produces NBCC ACEP-compliant course content.
 */
export async function generateCourseFromSynthesis(synthesis, articles, { ceHours = 2, level = 'Intermediate' } = {}) {
  const articleText = formatArticlesForPrompt(articles);
  const wordsTarget = ceHours * 6000;
  const questionCount = Math.max(15, ceHours * 7);

  const systemPrompt = `You are an expert instructional designer for CounselorReady, an NBCC ACEP-approved continuing education provider (#7760). You create rigorous, evidence-based CEU courses from research syntheses. Courses must meet NBCC standards with Bloom's taxonomy learning objectives, properly structured modules, and clinically relevant assessment questions.`;

  const userPrompt = `Generate a complete CEU course based on this research synthesis.

SYNTHESIS DATA:
${JSON.stringify(synthesis, null, 2)}

SOURCE ARTICLES:
${articleText}

COURSE PARAMETERS:
- CE Hours: ${ceHours} (requires ${wordsTarget}+ words of instructional content)
- Level: ${level}
- Target Audience: Licensed Professional Counselors, Licensed Mental Health Counselors, Licensed Clinical Social Workers
- Synthesis Type: ${synthesis.synthesisType}

Generate a complete course. Return ONLY valid JSON (no markdown) in this format:
{
  "title": "${synthesis.suggestedCourseTitle || 'Course title'}",
  "description": "Comprehensive 2-3 paragraph course description",
  "contentAreas": ${JSON.stringify(synthesis.suggestedContentAreas || ['Research & Program Evaluation'])},
  "objectives": ["8 NBCC-compliant learning objectives using Bloom's taxonomy action verbs (identify, analyze, evaluate, apply, compare, differentiate, implement, synthesize)"],
  "modules": [
    {
      "title": "Module title",
      "order": 1,
      "content": "Full module text content (HTML allowed: <h3>, <p>, <ul>, <li>, <strong>, <em>). Must be ${Math.round(wordsTarget / 4)}+ words. Include clinical vignettes and practice examples.",
      "keyTakeaways": ["3-4 key points from this module"]
    }
  ],
  "assessment": {
    "questions": [
      {
        "tag": "Research Methods | Clinical Application | Research Literacy | Comparative Analysis",
        "question": "Question text?",
        "options": ["A. option", "B. option", "C. option", "D. option"],
        "correct": 0,
        "rationale": "Why this answer is correct, referencing synthesis findings"
      }
    ],
    "passThreshold": 0.80
  },
  "references": ["APA-formatted references from the source articles"],
  "synthesisMetadata": {
    "type": "${synthesis.synthesisType}",
    "articleCount": ${articles.length},
    "yearRange": "earliest-latest year",
    "databases": ["CrossRef", "OpenAlex"]
  }
}

Generate exactly 4 modules and ${questionCount} assessment questions. Each module should be substantial (${Math.round(wordsTarget / 4)}+ words). Questions must test understanding of the synthesis findings, not just individual article facts.`;

  const response = await callClaude(systemPrompt, userPrompt, 16384);
  return parseJSON(response);
}
