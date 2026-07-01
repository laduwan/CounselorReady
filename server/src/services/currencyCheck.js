/**
 * Currency Check Service for Research Ready CE
 * Uses OpenAlex + Anthropic to verify article currency.
 */

import { fetchNewerArticles } from './openAlex.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

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
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  return text;
}

/**
 * Run currency check on an article.
 * Accepts fullText for more accurate AI verdict — methods, sample, and discussion
 * are in the body, not the abstract.
 */
export async function checkCurrency({ title, authors, journal, year, abstract, fullText, topic }) {
  // Step 1: Find newer articles on the same topic
  const newerArticles = await fetchNewerArticles({
    topic,
    title,
    yearAfter: year + 1
  });

  const newerList = newerArticles.length > 0
    ? newerArticles.map((a, i) => `${i + 1}. "${a.title}" (${a.year})`).join('\n')
    : 'No newer open-access articles found on this topic.';

  // Step 2: Call Anthropic for currency verdict
  // Use full text if available for more accurate analysis
  const textForAI = fullText
    ? fullText.substring(0, 15000)
    : abstract || '';
  const textLabel = fullText
    ? 'FULL ARTICLE TEXT (truncated to 15,000 words)'
    : 'Abstract';

  const prompt = `You are a CE quality reviewer for CounselorReady, an NBCC ACEP-approved provider (#7760).

SOURCE ARTICLE: "${title}" (${authors}, ${journal}, ${year})
${textLabel}: ${textForAI}

NEWER OPEN-ACCESS ARTICLES ON THIS TOPIC (${year + 1}–2025):
${newerList}

Respond ONLY with valid JSON — no markdown, no extra text:
{
  "verdict": "approved" | "approved_with_note" | "replace_suggested" | "hold_for_review",
  "summary": "2-sentence plain-language verdict for an admin reviewer",
  "checks": [
    {"label": "string max 7 words", "status": "pass" | "warn" | "fail", "note": "1 sentence"}
  ],
  "bundle_opportunity": true | false,
  "bundle_note": "1 sentence or null"
}`;

  const rawResponse = await callClaude(prompt);

  let verdict;
  try {
    verdict = JSON.parse(rawResponse);
  } catch {
    throw new Error(`Failed to parse currency check response: ${rawResponse.substring(0, 200)}`);
  }

  return {
    verdict,
    newerArticles: newerArticles.map(a => ({
      title: a.title,
      year: a.year,
      journal: a.journal,
      authors: a.authors,
      oaUrl: a.oaUrl
    }))
  };
}
