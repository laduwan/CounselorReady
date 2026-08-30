/**
 * Article Content Generator Service for Research Ready CE
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * Generates 6,200+ word clinical practice articles from scholarly
 * article metadata (title, abstract, journal, etc.) using Claude API.
 *
 * Chunked generation: 3 sections × ~2,100 words = 6,300+ words.
 * Each chunk gets its own API call to maintain quality.
 *
 * FILE: server/src/services/articleContentGenerator.js
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

const WORDS_PER_CE_HOUR = 6000;
const WORDS_BUFFER = 200;

// ── Claude helper ──
async function callClaude(systemPrompt, userPrompt, maxTokens = 5000) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

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
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown');
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';
}

// ── Word counter ──
function countWords(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(w => w.length > 0).length;
}

// ── System prompt (shared across all chunks) ──
function getSystemPrompt(contentArea) {
  return `You are a senior clinical educator writing continuing education content for CounselorReady, an NBCC ACEP-approved CE provider (#7760).

AUDIENCE: Licensed mental health professionals (LPCs, LMHCs, LCSWs, LMFTs, NCCs, psychologists, psychiatric NPs).
REGISTER: Graduate/professional level. Assume readers hold master's or doctoral degrees in counseling or related fields.
CONTENT AREA: ${contentArea}

WRITING REQUIREMENTS:
- Write EXACTLY the section assigned. Do not repeat introductions or conclusions from other sections.
- Target 2,100 words minimum for this section. Count carefully. Do NOT stop early.
- Use clinical depth: include theoretical frameworks, evidence-based interventions, assessment considerations, and ethical dimensions.
- Include at least 2 detailed clinical vignettes or case examples per section (3-5 sentences each, using pseudonyms).
- Reference specific therapeutic modalities, assessment tools, diagnostic considerations, and treatment protocols by name.
- Integrate multicultural and social justice perspectives throughout.
- Write in clear prose paragraphs. Use subheadings (<h3>) to organize. Use <p> for paragraphs, <strong> for emphasis, <ul>/<li> for lists when appropriate.
- Format as clean HTML. No markdown. No code fences.
- Do NOT include references/citations lists — those are handled separately.
- Do NOT write fewer than 2,000 words. If you find yourself wrapping up early, add another subsection with clinical application detail.`;
}

// ── Build article metadata string ──
function buildArticleContext(articles) {
  return articles.map((a, i) => {
    const parts = [`Article ${i + 1}: "${a.title}"`];
    if (a.authors) parts.push(`Authors: ${a.authors}`);
    if (a.journal) parts.push(`Journal: ${a.journal} (${a.year || 'n.d.'})`);
    if (a.abstract) parts.push(`Abstract: ${a.abstract}`);
    if (a.topic) parts.push(`Topic: ${a.topic}`);
    return parts.join('\n');
  }).join('\n\n---\n\n');
}

// ── Section prompts ──

function getSection1Prompt(articleContext, contentArea, format) {
  const formatNote = format === 'comparative'
    ? 'This is a COMPARATIVE review — contrast how the articles approach the topic differently, noting methodological and theoretical differences.'
    : format === 'integrative'
      ? 'This is an INTEGRATIVE review — synthesize the articles into a unified clinical framework.'
      : 'This is a standalone clinical practice review based on the scholarly research below.';

  return `SECTION 1 OF 3: FOUNDATIONS & LITERATURE CONTEXT
Target: 2,100 words minimum. Write ONLY this section.

${formatNote}

SCHOLARLY SOURCE(S):
${articleContext}

Write Section 1 with the following structure:

<h2>Introduction: Clinical Relevance and Scope</h2>
- Open with a compelling clinical scenario (4-5 sentences) that illustrates why this topic matters in everyday practice.
- Establish the prevalence, impact, and urgency of the topic for practicing counselors.
- State what clinicians will gain from this review.
- ~400 words

<h3>Theoretical Foundations</h3>
- Present the primary theoretical frameworks that ground this research (e.g., attachment theory, CBT model, systems theory, multicultural counseling theory).
- Explain how each framework conceptualizes the presenting concern.
- Include a clinical vignette showing how theoretical orientation shapes case conceptualization.
- ~500 words

<h3>Current State of the Literature</h3>
- Summarize the key findings, methodology, and contributions of the source article(s).
- Contextualize within the broader research landscape — what do we know, what gaps remain?
- Discuss the strength of the evidence base (RCTs, meta-analyses, qualitative studies).
- ~500 words

<h3>Defining Key Constructs</h3>
- Define and operationalize the central clinical constructs.
- Discuss how these constructs manifest across diverse populations.
- Include a clinical vignette illustrating construct complexity (e.g., how cultural context changes presentation).
- ~500 words

<h3>Implications for Clinical Training</h3>
- How should counselor education programs address this topic?
- What competencies does the literature suggest are essential?
- ~200 words

Remember: 2,100 words minimum. Do not summarize or stop early.`;
}

function getSection2Prompt(articleContext, contentArea, section1Summary) {
  return `SECTION 2 OF 3: CLINICAL APPLICATIONS & CASE CONCEPTUALIZATION
Target: 2,100 words minimum. Write ONLY this section.

CONTEXT: You already wrote Section 1 covering foundations and literature. Here is a brief summary of what was covered:
${section1Summary}

SCHOLARLY SOURCE(S):
${articleContext}

Write Section 2 with the following structure:

<h2>Clinical Applications: From Research to Practice</h2>

<h3>Assessment and Screening Considerations</h3>
- Which validated instruments or clinical interviews are relevant?
- How should clinicians approach differential diagnosis or problem identification?
- Cultural considerations in assessment (bias in instruments, alternative approaches).
- Include a clinical vignette: a counselor navigating assessment with a client from a marginalized population.
- ~500 words

<h3>Evidence-Based Intervention Strategies</h3>
- Detail 3-4 specific therapeutic interventions or techniques supported by the research.
- For each: describe the technique, the evidence supporting it, session-level implementation, and expected outcomes.
- Include adaptations for telehealth delivery where relevant.
- ~600 words

<h3>Extended Case Conceptualization</h3>
- Present a detailed case study (pseudonym, demographics, presenting concern, history, cultural context).
- Walk through the conceptualization using the theoretical frameworks from Section 1.
- Show treatment planning: goals, interventions selected, rationale for each.
- Discuss anticipated challenges and therapeutic ruptures.
- ~500 words

<h3>Working with Diverse Populations</h3>
- How do intersecting identities (race, gender, sexuality, disability, SES, immigration status) shape clinical presentation and treatment response?
- Specific adaptations or culturally responsive modifications to standard protocols.
- Include a clinical vignette showing culturally responsive practice.
- ~300 words

<h3>Common Clinical Pitfalls</h3>
- What mistakes do clinicians frequently make with this population or presenting concern?
- How to recognize and recover from therapeutic missteps.
- ~200 words

Remember: 2,100 words minimum. Do not summarize or stop early.`;
}

function getSection3Prompt(articleContext, contentArea, section1Summary, section2Summary) {
  return `SECTION 3 OF 3: PRACTICE IMPLICATIONS, ETHICS & INTEGRATION
Target: 2,100 words minimum. Write ONLY this section.

CONTEXT: Sections 1 and 2 have been written. Summaries:
Section 1 (Foundations): ${section1Summary}
Section 2 (Clinical Applications): ${section2Summary}

SCHOLARLY SOURCE(S):
${articleContext}

Write Section 3 with the following structure:

<h2>Ethical, Legal, and Professional Considerations</h2>

<h3>Ethical Decision-Making</h3>
- Apply the ACA Code of Ethics (or relevant professional code) to specific dilemmas raised by this topic.
- Walk through an ethical decision-making model (e.g., Kitchener's principles, Forester-Miller & Davis model).
- Present an ethical dilemma scenario and analyze it step-by-step.
- ~500 words

<h3>Legal and Regulatory Landscape</h3>
- Relevant laws, regulations, or scope-of-practice considerations.
- Mandated reporting obligations if applicable.
- Telehealth-specific legal considerations if relevant.
- State-by-state variability clinicians should be aware of.
- ~300 words

<h3>Supervision and Consultation</h3>
- When and how should clinicians seek supervision or consultation on this topic?
- Models for peer consultation groups.
- How supervisors can support supervisees working with these presenting concerns.
- Include a supervision vignette.
- ~300 words

<h3>Self-Care and Vicarious Trauma Prevention</h3>
- Specific risks for clinicians working in this area.
- Evidence-based self-care strategies beyond generic wellness advice.
- Organizational and systemic supports.
- ~300 words

<h3>Integrative Summary: Bridging Research and Practice</h3>
- Synthesize the key takeaways across all three sections.
- Provide a practical clinical checklist or framework clinicians can implement immediately.
- Discuss limitations of the current evidence and areas needing further research.
- ~400 words

<h3>Future Directions and Emerging Trends</h3>
- What new research questions emerge from this topic?
- How are technology, policy changes, or demographic shifts likely to impact practice?
- Call to action for clinicians: continuing professional development in this area.
- ~300 words

Remember: 2,100 words minimum. Do not summarize or stop early.`;
}

// ── Summarize a section for context-passing between chunks ──
function summarizeSection(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  // Take first 500 chars as summary
  return text.substring(0, 500) + (text.length > 500 ? '...' : '');
}


// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT: Generate full article content
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a 6,200+ word clinical practice article from article metadata.
 *
 * @param {Object} opts
 * @param {Array} opts.articles - Array of { title, authors, journal, year, abstract, topic }
 * @param {String} opts.contentArea - NBCC content area
 * @param {String} opts.format - 'standalone' | 'comparative' | 'integrative'
 * @param {String} [opts.courseTitle] - Optional course title
 * @returns {Promise<{ content: String, wordCount: Number, sections: Number }>}
 */
export async function generateArticleContent({ articles, contentArea, format = 'standalone', courseTitle = '', targetCeHours = 1.0 }) {
  if (!articles || articles.length === 0) {
    throw new Error('At least one article is required');
  }

  // Target: 6,000 words per CE hour + 200 word buffer
  const targetWords = Math.round(targetCeHours * WORDS_PER_CE_HOUR) + WORDS_BUFFER;
  // One section per CE hour, minimum 3
  const sectionsNeeded = Math.max(3, Math.ceil(targetCeHours * 3));
  const wordsPerSection = Math.ceil(targetWords / sectionsNeeded);

  const systemPrompt = getSystemPrompt(contentArea);
  const articleContext = buildArticleContext(articles);

  console.log(`[RNR Content] Generating ${sectionsNeeded}-section article ` +
    `(${targetCeHours} CE hrs = ${targetWords} words target) ` +
    `for: ${courseTitle || articles[0].title}`);
  console.log(`[RNR Content] Format: ${format}, Content area: ${contentArea}`);

  // ── Section 1 ──
  console.log('[RNR Content] Generating Section 1/3: Foundations & Literature...');
  const section1 = await callClaude(
    systemPrompt,
    getSection1Prompt(articleContext, contentArea, format),
    5000
  );
  const s1Words = countWords(section1);
  console.log(`[RNR Content] Section 1 complete: ${s1Words} words`);

  const s1Summary = summarizeSection(section1);

  // ── Section 2 ──
  console.log('[RNR Content] Generating Section 2/3: Clinical Applications...');
  const section2 = await callClaude(
    systemPrompt,
    getSection2Prompt(articleContext, contentArea, s1Summary),
    5000
  );
  const s2Words = countWords(section2);
  console.log(`[RNR Content] Section 2 complete: ${s2Words} words`);

  const s2Summary = summarizeSection(section2);

  // ── Section 3 ──
  console.log('[RNR Content] Generating Section 3/3: Ethics & Integration...');
  const section3 = await callClaude(
    systemPrompt,
    getSection3Prompt(articleContext, contentArea, s1Summary, s2Summary),
    5000
  );
  const s3Words = countWords(section3);
  console.log(`[RNR Content] Section 3 complete: ${s3Words} words`);

  // ── Combine ──
  const divider = '<hr style="margin:2em 0;border:none;border-top:2px solid #4A7C59;">';
  const contentParts = [section1, divider, section2, divider, section3];
  let currentSectionCount = 3;
  let prevSummaries = `${s1Summary} ... ${s2Summary}`;

  // ── Additional sections if sectionsNeeded > 3 ──
  if (sectionsNeeded > 3) {
    for (let i = 4; i <= sectionsNeeded; i++) {
      console.log(`[RNR Content] Generating Section ${i}/${sectionsNeeded}: Supplemental...`);
      const additional = await callClaude(
        systemPrompt,
        `SUPPLEMENTAL SECTION ${i} OF ${sectionsNeeded}: Write an additional ${wordsPerSection}+ words expanding on clinical application of the research below. Include another detailed case vignette and specific intervention techniques. Do NOT repeat content from previous sections.

SCHOLARLY SOURCE(S):
${articleContext}

Previously covered (do not repeat): ${prevSummaries}

Write clean HTML with <h3> subheadings and <p> paragraphs. Target: ${wordsPerSection} words minimum.`,
        5000
      );
      const addWords = countWords(additional);
      console.log(`[RNR Content] Section ${i} complete: ${addWords} words`);
      contentParts.push(divider, additional);
      prevSummaries += ' ... ' + summarizeSection(additional);
      currentSectionCount++;
    }
  }

  const fullContent = contentParts.join('\n');
  const totalWords = countWords(fullContent);

  console.log(`[RNR Content] Total: ${totalWords} words across ${currentSectionCount} sections`);

  // ── Safety check: if under target, generate a supplemental section ──
  if (totalWords < targetWords) {
    console.log(`[RNR Content] Under ${targetWords} words — generating supplemental section...`);
    const deficit = targetWords - totalWords + WORDS_BUFFER;
    const supplemental = await callClaude(
      systemPrompt,
      `SUPPLEMENTAL SECTION: Write an additional ${deficit}+ words expanding on clinical application of the research below. Include another detailed case vignette and specific intervention techniques. Do NOT repeat content from previous sections.

SCHOLARLY SOURCE(S):
${articleContext}

Previously covered (do not repeat): ${prevSummaries}

Write clean HTML with <h3> subheadings and <p> paragraphs. Target: ${deficit} words minimum.`,
      3000
    );
    const suppWords = countWords(supplemental);
    console.log(`[RNR Content] Supplemental section: ${suppWords} words`);

    const finalContent = [fullContent, divider, supplemental].join('\n');
    const finalWords = countWords(finalContent);
    console.log(`[RNR Content] Final total: ${finalWords} words`);

    return {
      content: finalContent,
      wordCount: finalWords,
      sections: sectionsNeeded
    };
  }

  return {
    content: fullContent,
    wordCount: totalWords,
    sections: sectionsNeeded
  };
}

export default { generateArticleContent };
