/**
 * CE Word Count Utility
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * Canonical word count for CE hour calculation.
 * 1 CE hour = 6,000 words. Always round DOWN to nearest 0.5.
 *
 * Include: article body (intro, methods, results, discussion, conclusion),
 *   section headings, in-text citations, figure/table captions, block quotes,
 *   substantive footnotes/endnotes.
 *
 * Exclude: XML/HTML tags, article metadata (title, authors, affiliations, DOI,
 *   funding, conflict statements, dates, journal name), reference/bibliography
 *   section, acknowledgments, supplementary material labels, copyright/license
 *   boilerplate, running headers/footers.
 */

/**
 * Strip sections that should be excluded from CE word count.
 * @param {string} text - Raw extracted article text
 * @param {'pdf'|'html'|'plain'} format - Source format hint
 * @returns {string} Instructional prose only
 */
function stripExcludedContent(text, format = 'plain') {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Strip HTML/XML tags
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');

  // Strip reference/bibliography section (everything after "References", "Bibliography", "Works Cited", "Literature Cited")
  const refPattern = /\n\s*(References|Bibliography|Works Cited|Literature Cited|REFERENCES|BIBLIOGRAPHY)\s*\n[\s\S]*$/i;
  cleaned = cleaned.replace(refPattern, '');

  // Strip acknowledgments section
  const ackPattern = /\n\s*(Acknowledgments?|ACKNOWLEDGMENTS?)\s*\n[\s\S]*?(?=\n\s*[A-Z][a-z]|\n\s*$)/i;
  cleaned = cleaned.replace(ackPattern, '\n');

  // Strip supplementary material labels
  cleaned = cleaned.replace(/\n\s*(Supplementary|Supporting)\s+(Materials?|Information|Data|Files?)\s*\n[\s\S]*?(?=\n\s*[A-Z]|\n\s*$)/gi, '\n');

  // Strip copyright/license boilerplate
  cleaned = cleaned.replace(/©\s*\d{4}[\s\S]*?(?:All rights reserved|Creative Commons|CC BY|license)[\s\S]*?(?:\.\s|\n)/gi, ' ');
  cleaned = cleaned.replace(/This (article|work) is licensed under[\s\S]*?(?:\.\s|\n)/gi, ' ');

  // Strip common metadata patterns (DOI, email, affiliations at top)
  cleaned = cleaned.replace(/https?:\/\/doi\.org\/\S+/g, ' ');
  cleaned = cleaned.replace(/DOI:\s*\S+/g, ' ');
  cleaned = cleaned.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, ' ');

  // Strip "Received: ... Accepted: ... Published: ..." date lines
  cleaned = cleaned.replace(/(Received|Accepted|Published|Revised)\s*:?\s*\d{1,2}\s+\w+\s+\d{4}/gi, ' ');

  // Strip funding/conflict statements
  cleaned = cleaned.replace(/\n\s*(Funding|Conflict of Interest|Declaration of Interest|Competing Interests?|Financial Disclosure)\s*[:\n][\s\S]*?(?=\n\s*[A-Z][a-z]|\n\s*$)/gi, '\n');

  return cleaned;
}

/**
 * Count instructional words in article text.
 * @param {string} text - Full article text
 * @param {'pdf'|'html'|'plain'} format - Source format hint
 * @returns {{ instructionalWordCount: number, rawWordCount: number }}
 */
export function ceWordCount(text, format = 'plain') {
  if (!text || typeof text !== 'string') {
    return { instructionalWordCount: 0, rawWordCount: 0 };
  }

  // Raw count before exclusions
  const rawTokens = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w.length > 0);
  const rawWordCount = rawTokens.length;

  // Instructional prose after exclusions
  const instructional = stripExcludedContent(text, format);
  const collapsed = instructional.replace(/\s+/g, ' ').trim();
  const tokens = collapsed.split(/\s+/).filter(w => w.length > 0);
  const instructionalWordCount = tokens.length;

  return { instructionalWordCount, rawWordCount };
}

/**
 * Calculate CE hours from instructional word count.
 * Always rounds DOWN to nearest 0.5.
 * @param {number} wordCount
 * @returns {number}
 */
export function calculateCEHoursFromWordCount(wordCount) {
  return Math.floor((wordCount / 6000) * 2) / 2;
}

export default ceWordCount;
