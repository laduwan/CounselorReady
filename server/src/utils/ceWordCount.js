/**
 * ceWordCount.js
 * Canonical CE word count for RNR CE pipeline.
 *
 * Counts "instructional prose" — the text a learner must actually read.
 * Strips XML/HTML markup, metadata, references, acknowledgments,
 * supplementary material, and copyright boilerplate before counting.
 *
 * A "word" = any whitespace-delimited token after cleanup.
 * Hyphenated compounds ("evidence-based") = 1 word.
 * Numbers/abbreviations ("DSM-5", "CBT") = 1 word each.
 *
 * Threshold: 6,000 words minimum per CE hour (hard floor, no rounding up).
 *
 * Drop-in path: server/src/utils/ceWordCount.js
 */

const CE_WORDS_PER_HOUR = 6000;

/**
 * Canonical CE word count.
 * @param {string} rawText - Full-text content (XML, HTML, or plain text).
 * @param {'xml'|'html'|'plain'} format - Source format. Defaults to 'xml'.
 * @returns {number} Integer word count of instructional prose only.
 */
function ceWordCount(rawText, format = 'xml') {
  if (!rawText || typeof rawText !== 'string') return 0;

  let text = rawText;

  if (format === 'xml' || format === 'html') {
    // ── 1. Remove reference / bibliography section ──────────────────
    // JATS <ref-list>
    text = text.replace(/<ref-list[\s\S]*?<\/ref-list>/gi, '');
    // Generic HTML/XML section with id="references"
    text = text.replace(
      /<section[^>]*id=["']references["'][\s\S]*?<\/section>/gi,
      ''
    );
    // Back matter that wraps refs in some JATS variants
    text = text.replace(/<back[\s\S]*?<\/back>/gi, '');

    // ── 2. Remove acknowledgments ───────────────────────────────────
    text = text.replace(/<ack[\s\S]*?<\/ack>/gi, '');
    text = text.replace(
      /<section[^>]*id=["']acknowledgm?ents?["'][\s\S]*?<\/section>/gi,
      ''
    );

    // ── 3. Remove metadata blocks ───────────────────────────────────
    text = text.replace(/<front[\s\S]*?<\/front>/gi, '');
    text = text.replace(/<article-meta[\s\S]*?<\/article-meta>/gi, '');
    text = text.replace(/<journal-meta[\s\S]*?<\/journal-meta>/gi, '');
    text = text.replace(/<permissions[\s\S]*?<\/permissions>/gi, '');
    text = text.replace(/<funding-group[\s\S]*?<\/funding-group>/gi, '');
    text = text.replace(/<contrib-group[\s\S]*?<\/contrib-group>/gi, '');
    text = text.replace(/<kwd-group[\s\S]*?<\/kwd-group>/gi, '');
    text = text.replace(/<abstract[\s\S]*?<\/abstract>/gi, '');
    text = text.replace(/<history[\s\S]*?<\/history>/gi, '');
    text = text.replace(/<pub-date[\s\S]*?<\/pub-date>/gi, '');
    text = text.replace(/<volume>[^<]*<\/volume>/gi, '');
    text = text.replace(/<issue>[^<]*<\/issue>/gi, '');
    text = text.replace(/<fpage>[^<]*<\/fpage>/gi, '');
    text = text.replace(/<lpage>[^<]*<\/lpage>/gi, '');

    // ── 4. Remove supplementary material ────────────────────────────
    text = text.replace(
      /<supplementary-material[\s\S]*?<\/supplementary-material>/gi,
      ''
    );
    text = text.replace(/<app-group[\s\S]*?<\/app-group>/gi, '');

    // ── 5. Remove copyright / license boilerplate ───────────────────
    text = text.replace(/<license[\s\S]*?<\/license>/gi, '');
    text = text.replace(
      /<copyright-statement[\s\S]*?<\/copyright-statement>/gi,
      ''
    );

    // ── 6. Strip all remaining tags, keep inner text ────────────────
    text = text.replace(/<[^>]+>/g, ' ');

    // ── 7. Decode common entities ───────────────────────────────────
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, ' ');
  }

  if (format === 'plain') {
    // ── Plain text: strip references by section header ───────────────
    const refIndex = text.search(
      /\n\s*(References|Bibliography|Works Cited)\s*\n/i
    );
    if (refIndex !== -1) {
      text = text.substring(0, refIndex);
    }

    // ── Strip acknowledgments (keep content after next section) ─────
    const ackPattern = /\n\s*Acknowledgm?ents?\s*\n/i;
    const ackMatch = text.match(ackPattern);
    if (ackMatch) {
      const ackIndex = text.search(ackPattern);
      const afterAck = text.substring(ackIndex + ackMatch[0].length);
      // Find the next section heading (line starting with uppercase)
      const nextSection = afterAck.search(/\n\s*[A-Z][A-Za-z ]{2,}\s*\n/);
      text =
        nextSection !== -1
          ? text.substring(0, ackIndex) + afterAck.substring(nextSection)
          : text.substring(0, ackIndex);
    }
  }

  // ── Collapse whitespace → split → count ───────────────────────────
  const tokens = text
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  return tokens.length;
}

/**
 * Maximum CE hours this article qualifies for.
 * Hard floor — 5,999 words = 0 hours. No rounding.
 * @param {number} wordCount - Output of ceWordCount().
 * @returns {number} Integer max CE hours.
 */
function maxCEHours(wordCount) {
  return Math.floor(wordCount / CE_WORDS_PER_HOUR);
}

/**
 * Eligibility check with structured result.
 * @param {string} rawText - Full-text content.
 * @param {'xml'|'html'|'plain'} format - Source format.
 * @param {number} requestedHours - CE hours the learner/system is requesting.
 * @returns {{ eligible: boolean, wordCount: number, maxHours: number, requestedHours: number, message: string }}
 */
function checkCEEligibility(rawText, format = 'xml', requestedHours = 1) {
  const wordCount = ceWordCount(rawText, format);
  const maxHours = maxCEHours(wordCount);
  const eligible = maxHours >= requestedHours;
  const needed = requestedHours * CE_WORDS_PER_HOUR;

  let message;
  if (eligible) {
    message = `Article contains ${wordCount.toLocaleString()} words of instructional content. Qualifies for up to ${maxHours} CE hour${maxHours !== 1 ? 's' : ''}.`;
  } else {
    message = `Article contains ${wordCount.toLocaleString()} words of instructional content. Minimum ${needed.toLocaleString()} words required for ${requestedHours} CE hour${requestedHours !== 1 ? 's' : ''}. Ineligible.`;
  }

  return { eligible, wordCount, maxHours, requestedHours, message };
}

module.exports = { ceWordCount, maxCEHours, checkCEEligibility, CE_WORDS_PER_HOUR };
