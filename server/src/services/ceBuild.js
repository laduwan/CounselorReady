/**
 * CE Build Service for Research Ready CE
 * Uses Anthropic to generate learning objectives and posttest.
 */

import { ceWordCount, calculateCEHoursFromWordCount } from '../utils/ceWordCount.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5';

async function callClaude(prompt) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      thinking: { type: 'disabled' },
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

/**
 * Generate CE content (objectives + posttest) for an article.
 * Now accepts fullText for more accurate AI generation.
 */
export async function buildCE({
  title, authors, journal, year, abstract, fullText, topic,
  wordCount, ceHours, researchHours, format
}) {
  // Use full text if available; compute instructional word count
  const textForAI = fullText
    ? fullText.substring(0, 15000)
    : abstract || '';
  const textLabel = fullText
    ? 'FULL ARTICLE TEXT (truncated to 15,000 words)'
    : 'Abstract';

  // Compute instructional word count if full text provided
  let instructionalWordCount = wordCount;
  if (fullText) {
    const wc = ceWordCount(fullText);
    instructionalWordCount = wc.instructionalWordCount;
    ceHours = calculateCEHoursFromWordCount(instructionalWordCount);
  }

  const prompt = `You are a CE course designer for CounselorReady, an NBCC ACEP-approved provider (#7760).

${title.includes(' | ') ? `Articles:\n${title.split(' | ').map((t, i) => `  ${i+1}. "${t.trim()}"`).join('\n')}\nAuthors: ${authors}\nJournals: ${journal}` : `Article: "${title}" (${authors}, ${journal}, ${year})`}
Topic area: ${topic}
CE Hours: ${ceHours} (${researchHours} Research)
Format: ${format}

${textLabel}:
${textForAI}

Respond ONLY in valid JSON — no markdown:
{
  "course_title": "Professional CE course title max 80 chars — rules below",
  "content_areas": ["array of NBCC content area strings"],
  "objectives": ["4 NBCC-compliant learning objectives using Bloom's taxonomy action verbs"],
  "questions": [
    {
      "tag": "Research Methods | Clinical Application | Research Literacy | Supervision Models | Ethics",
      "question": "string",
      "options": ["A. string", "B. string", "C. string", "D. string"],
      "correct": 0,
      "rationale": "1-sentence explanation"
    }
  ]
}

Generate exactly 10 questions. Map content areas to NBCC domains. Use action verbs (identify, describe, apply, evaluate, analyze, compare) in objectives.

course_title rules:
- Standalone article: trim and reformat the article title as a professional CE course name. Drop filler openings like "A study of...", "An analysis of...", etc. Example: "The supervisory working alliance and counselor development: A longitudinal study of LPC trainees" → "Supervisory Alliance and Counselor Development: A CE Review"
- Comparative format: "Then and Now: Evolution of [Topic]" or "Comparative Analysis: [Topic]"
- Integrative format: "Integrative Review: [Topic Area]"
- Multiple articles: synthesize the shared themes into one unified academic title. Example: articles about supervision models + ethical gatekeeping → "Clinical Supervision and Ethical Gatekeeping: A Meta-Analytic Review". Never join article titles with | or &. Find the conceptual thread.
- Max 80 characters.`;

  const rawResponse = await callClaude(prompt);

  let ceContent;
  try {
    ceContent = JSON.parse(rawResponse);
  } catch {
    throw new Error(`Failed to parse CE build response: ${rawResponse.substring(0, 200)}`);
  }

  // Validate structure
  if (!ceContent.content_areas || !ceContent.objectives || !ceContent.questions) {
    throw new Error('CE build response missing required fields (content_areas, objectives, questions)');
  }

  if (ceContent.questions.length !== 10) {
    console.warn(`CE build returned ${ceContent.questions.length} questions instead of 10`);
  }

  // Ensure course_title exists — fall back to truncated article title
  if (!ceContent.course_title) {
    ceContent.course_title = title.substring(0, 80);
  }

  return ceContent;
}
