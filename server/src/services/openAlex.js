/**
 * OpenAlex API Service for Research Ready CE
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * Searches open-access scholarly articles, fetches full text via
 * PDF → landing page → PMC → abstract fallback chain, and computes
 * CE-eligible instructional word count.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import * as cheerio from 'cheerio';
import { ceWordCount } from '../utils/ceWordCount.js';

const OPENALEX_BASE = 'https://api.openalex.org/works';
const MAILTO = process.env.CROSSREF_MAILTO || 'contact@gaintegrated.com';


/**
 * COUNSELING_CONCEPTS — OpenAlex concept ID filter
 *
 * What these are:
 *   C15744967   Psychology         — broad psychology umbrella; catches most
 *                                    counseling-adjacent research
 *   C2776903    Counseling         — clinical counseling, psychotherapy,
 *                                    therapeutic alliance, counselor education
 *   C118552586  Clinical Psychology — assessment, diagnosis, evidence-based
 *                                    treatment, CBT, DBT, trauma-focused therapy
 *
 * How to use:
 *   Add or remove concept IDs using the pipe-separated format: 'Cxxx|Cyyy|Czzz'
 *   Find concept IDs at: https://api.openalex.org/concepts?search=<term>
 *   The filter matches any article tagged with AT LEAST ONE of the listed concepts.
 *   Broader concepts (Psychology) return more results; narrower ones filter tighter.
 *
 * Expected outcome:
 *   Search results and currency checks will only return open-access journal
 *   articles that OpenAlex has classified under Psychology, Counseling, or
 *   Clinical Psychology. Articles outside these domains (e.g. pure neuroscience,
 *   medical research, social work without a counseling angle) will be excluded.
 *   Removing a concept widens the filter; adding one narrows it.
 */
const COUNSELING_CONCEPTS = 'C15744967|C2776903|C118552586';

/**
 * Fetch PDF buffer from a URL with timeout.
 */
async function fetchPdfBuffer(url) {
  if (!url) throw new Error('No PDF URL');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/pdf' }
    });
    if (!response.ok) throw new Error(`PDF fetch failed: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Scrape article body text from a landing page URL.
 */
async function scrapeLandingPage(url) {
  if (!url) throw new Error('No landing page URL');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'text/html' }
    });
    if (!response.ok) throw new Error(`Landing page fetch failed: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $('nav, header, footer, aside, script, style, .sidebar, .nav, .menu, .advertisement, .cookie-banner').remove();

    // Try common article body selectors
    const selectors = [
      'article .fulltext', 'article .body', '.article-body', '.article-content',
      '.fulltext-view', '#article-body', '.main-content article',
      '[role="main"] article', '.prose', 'article'
    ];
    let bodyText = '';
    for (const sel of selectors) {
      const el = $(sel);
      if (el.length && el.text().trim().length > 500) {
        bodyText = el.text();
        break;
      }
    }
    if (!bodyText) {
      bodyText = $('main').text() || $('body').text();
    }
    return bodyText.replace(/\s+/g, ' ').trim();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Try to fetch full text from PubMed Central via DOI.
 */
async function fetchFromPMC(doi) {
  if (!doi) throw new Error('No DOI for PMC lookup');
  const cleanDoi = doi.replace('https://doi.org/', '');

  // Step 1: Resolve DOI to PMCID
  const idConvUrl = `https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=${encodeURIComponent(cleanDoi)}&format=json`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const idRes = await fetch(idConvUrl, { signal: controller.signal });
    if (!idRes.ok) throw new Error('PMC ID conversion failed');
    const idData = await idRes.json();
    const pmcid = idData.records?.[0]?.pmcid;
    if (!pmcid) throw new Error('No PMCID found for DOI');

    // Step 2: Fetch article XML from PMC OA
    const oaUrl = `https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.fcgi?id=${pmcid}`;
    const oaRes = await fetch(oaUrl, { signal: controller.signal });
    if (!oaRes.ok) throw new Error('PMC OA fetch failed');
    const oaText = await oaRes.text();

    // Extract PDF or text link from OA response
    const pdfMatch = oaText.match(/href="(https?:\/\/[^"]+\.pdf)"/);
    if (pdfMatch) {
      const pdfBuffer = await fetchPdfBuffer(pdfMatch[1]);
      const pdfData = await pdfParse(pdfBuffer);
      return pdfData.text;
    }

    throw new Error('No PDF link in PMC OA response');
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Attempt full-text retrieval using fallback chain:
 * PDF → Landing Page → PMC → Abstract
 */
async function fetchFullText(work, decodedAbstract) {
  const pdfUrl = work.best_oa_location?.pdf_url || work.primary_location?.pdf_url;
  const landingPageUrl = work.best_oa_location?.landing_page_url || work.primary_location?.landing_page_url;
  const doi = work.doi || work.ids?.doi;

  // Step A: PDF from best_oa_location
  if (pdfUrl) {
    try {
      const pdfBuffer = await fetchPdfBuffer(pdfUrl);
      const pdfData = await pdfParse(pdfBuffer);
      if (pdfData.text && pdfData.text.trim().length > 500) {
        return {
          fullText: pdfData.text,
          fullTextSource: 'pdf',
          fullTextUrl: pdfUrl,
          abstractOnlyFlag: false
        };
      }
    } catch (err) {
      console.warn(`[OpenAlex] PDF fetch failed for ${work.title?.substring(0, 40)}: ${err.message}`);
    }
  }

  // Step B: Landing page scrape
  if (landingPageUrl) {
    try {
      const text = await scrapeLandingPage(landingPageUrl);
      if (text && text.length > 500) {
        return {
          fullText: text,
          fullTextSource: 'landing_page',
          fullTextUrl: landingPageUrl,
          abstractOnlyFlag: false
        };
      }
    } catch (err) {
      console.warn(`[OpenAlex] Landing page scrape failed for ${work.title?.substring(0, 40)}: ${err.message}`);
    }
  }

  // Step C: PubMed Central via DOI
  if (doi) {
    try {
      const text = await fetchFromPMC(doi);
      if (text && text.trim().length > 500) {
        return {
          fullText: text,
          fullTextSource: 'pmc',
          fullTextUrl: `https://www.ncbi.nlm.nih.gov/pmc/articles/?term=${encodeURIComponent(doi)}`,
          abstractOnlyFlag: false
        };
      }
    } catch (err) {
      console.warn(`[OpenAlex] PMC fetch failed for ${work.title?.substring(0, 40)}: ${err.message}`);
    }
  }

  // Step D: Abstract fallback — no CE hours for abstract-only
  return {
    fullText: decodedAbstract || '',
    fullTextSource: 'abstract_only',
    fullTextUrl: '',
    abstractOnlyFlag: true
  };
}


/**
 * Decode OpenAlex abstract_inverted_index into plain text.
 * The inverted index maps words → arrays of positions.
 */
export function decodeAbstractInvertedIndex(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== 'object') return '';

  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.filter(w => w !== undefined).join(' ');
}

/**
 * Calculate CE hours from word count.
 * Always rounds DOWN to nearest 0.5.
 */
export function calculateCEHours(wordCount) {
  return Math.floor((wordCount / 6000) * 2) / 2;
}

/**
 * Calculate Research hours from CE hours.
 * 0.5 × CE hours, minimum 0.5, rounded down to nearest 0.5.
 */
export function calculateResearchHours(ceHours) {
  if (ceHours <= 0) return 0;
  const raw = ceHours * 0.5;
  const rounded = Math.floor(raw * 2) / 2;
  return Math.max(0.5, rounded);
}

/**
 * Determine word count status based on abstract availability.
 * Since full content is AI-generated, this now reflects abstract quality
 * (better abstracts → better generated content).
 */
export function getAbstractStatus(abstractWordCount) {
  if (abstractWordCount >= 150) return 'strong';    // Rich abstract → best generation
  if (abstractWordCount >= 50) return 'adequate';    // Usable abstract
  return 'thin';                                      // May produce lower-quality generation
}

/**
 * Map a single OpenAlex work object to our result format (basic — no full text).
 * Full text is fetched separately for performance (only when needed).
 */
function mapWorkBasic(work) {
  const abstract = decodeAbstractInvertedIndex(work.abstract_inverted_index);
  const abstractWordCount = abstract ? abstract.split(/\s+/).filter(w => w.length > 0).length : 0;

  const journal = work.primary_location?.source?.display_name || 'Unknown Journal';
  const authors = (work.authorships || [])
    .map(a => a.author?.display_name)
    .filter(Boolean)
    .join(', ') || 'Unknown Authors';
  const oaUrl = work.open_access?.oa_url
    || work.primary_location?.landing_page_url
    || '';
  const topic = work.primary_topic?.display_name || '';
  const doi = work.doi || work.primary_location?.source?.id || '';

  return {
    openAlexId: work.id,
    title: work.title || 'Untitled',
    year: work.publication_year,
    journal,
    authors,
    abstract,
    abstractWordCount,
    abstractStatus: getAbstractStatus(abstractWordCount),
    oaUrl,
    topic,
    citedByCount: work.cited_by_count || 0,
    doi,
    // PDF/landing page URLs for full-text fetch
    pdfUrl: work.best_oa_location?.pdf_url || work.primary_location?.pdf_url || '',
    landingPageUrl: work.best_oa_location?.landing_page_url || work.primary_location?.landing_page_url || '',
    _rawWork: work // keep raw work for full-text fetch
  };
}

/**
 * Enrich a basic article with full text + CE word count.
 * Call this after search when building CE content.
 */
export async function enrichWithFullText(article) {
  const work = article._rawWork || {};
  const { fullText, fullTextSource, fullTextUrl, abstractOnlyFlag } = await fetchFullText(work, article.abstract);

  const { instructionalWordCount, rawWordCount } = ceWordCount(fullText, fullTextSource === 'pdf' ? 'pdf' : 'plain');
  const ceHours = abstractOnlyFlag ? 0 : calculateCEHours(instructionalWordCount);
  const researchHours = calculateResearchHours(ceHours);

  const enriched = { ...article };
  delete enriched._rawWork;
  enriched.fullText = fullText;
  enriched.fullTextSource = fullTextSource;
  enriched.fullTextUrl = fullTextUrl;
  enriched.abstractOnlyFlag = abstractOnlyFlag;
  enriched.instructionalWordCount = instructionalWordCount;
  enriched.rawWordCount = rawWordCount;
  enriched.wordCount = instructionalWordCount;
  enriched.ceHours = ceHours;
  enriched.researchHours = researchHours;
  enriched.wcStatus = abstractOnlyFlag ? 'thin' : (instructionalWordCount >= 6000 ? 'sufficient' : (instructionalWordCount >= 3000 ? 'borderline' : 'thin'));

  return enriched;
}

/**
 * Search OpenAlex for open-access articles.
 * Filters: is_oa:true, type:article, psychology/counseling concepts.
 */
export async function searchArticles({
  q,
  year_from = 2020,
  sort = 'publication_date:desc',
  page = 1,
  per_page = 8,
  desired_hours = null
}) {
  if (!q || q.trim().length === 0) {
    return { results: [], meta: { count: 0, page: 1 } };
  }

  const filter = `is_oa:true,publication_year:${year_from}-2025,type:article,concepts.id:${COUNSELING_CONCEPTS}`;

  const params = new URLSearchParams({
    search: q,
    filter,
    'per-page': String(per_page),
    page: String(page),
    sort,
    select: 'id,doi,title,publication_year,primary_location,best_oa_location,authorships,abstract_inverted_index,primary_topic,cited_by_count,open_access',
    mailto: MAILTO
  });

  const url = `${OPENALEX_BASE}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenAlex API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  let results = (data.results || []).map(w => {
    const basic = mapWorkBasic(w);
    // For search results, set preliminary word count from desired hours
    // Full text + real word count fetched on demand (when building CE)
    const dh = desired_hours || 1.0;
    basic.wordCount = dh * 6000;
    basic.ceHours = dh;
    basic.researchHours = calculateResearchHours(dh);
    basic.wcStatus = 'sufficient';
    return basic;
  });

  // Filter out articles with no abstract (thin abstracts produce poor content)
  results = results.filter(r => r.abstractWordCount >= 50);

  // Strip _rawWork from search results (not needed in API response)
  results = results.map(r => {
    const { _rawWork, ...rest } = r;
    return rest;
  });

  return {
    results,
    meta: {
      count: data.meta?.count || 0,
      page
    }
  };
}

/**
 * Fetch newer articles on a topic for currency checking.
 */
export async function fetchNewerArticles({ topic, title, yearAfter }) {
  const searchTerms = topic || title.split(' ').slice(0, 5).join(' ');
  const params = new URLSearchParams({
    search: searchTerms,
    filter: `is_oa:true,publication_year:${yearAfter}-2025,type:article,concepts.id:${COUNSELING_CONCEPTS}`,
    'per-page': '5',
    sort: 'publication_date:desc',
    select: 'id,doi,title,publication_year,primary_location,best_oa_location,authorships,abstract_inverted_index,open_access,primary_topic,cited_by_count',
    mailto: MAILTO
  });

  const url = `${OPENALEX_BASE}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenAlex API error (${response.status})`);
  }

  const data = await response.json();
  return (data.results || []).map(w => {
    const basic = mapWorkBasic(w);
    basic.wordCount = 6000;
    basic.ceHours = 1.0;
    basic.researchHours = 0.5;
    basic.wcStatus = 'sufficient';
    const { _rawWork, ...rest } = basic;
    return rest;
  });
}

/**
 * Fetch a single article by OpenAlex ID with full text.
 */
export async function fetchArticleWithFullText(openAlexId) {
  const url = `${OPENALEX_BASE}/${encodeURIComponent(openAlexId)}?mailto=${MAILTO}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OpenAlex fetch failed: ${response.status}`);
  const work = await response.json();
  const basic = mapWorkBasic(work);
  return enrichWithFullText(basic);
}
