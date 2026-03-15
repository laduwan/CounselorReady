/**
 * Scholarly Search Service — Unified CrossRef + OpenAlex search
 * Searches both databases and merges/deduplicates results for
 * meta-analysis and comparative analysis course building.
 */

import { searchArticles as searchOpenAlex, decodeAbstractInvertedIndex } from './openAlex.js';

// ─── CrossRef helpers (reused from scholarlyArticles route) ──
const CROSSREF_BASE = 'https://api.crossref.org/works';
const CROSSREF_MAILTO = process.env.CROSSREF_MAILTO || 'support@counselorready.com';

async function searchCrossRef(query, { page = 1, limit = 10, yearFrom = 2015 } = {}) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    'query.bibliographic': query,
    'filter': `type:journal-article,from-pub-date:${yearFrom}`,
    'rows': String(limit),
    'offset': String(offset),
    'mailto': CROSSREF_MAILTO,
    'select': 'DOI,title,author,abstract,container-title,published-print,published-online,volume,issue,page,URL,subject,link'
  });

  const response = await fetch(`${CROSSREF_BASE}?${params}`);
  if (!response.ok) {
    throw new Error(`CrossRef API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.message.items || []).map(formatCrossRefItem);
}

function formatCrossRefItem(item) {
  const published = item['published-print'] || item['published-online'];
  const dateParts = published?.['date-parts']?.[0];
  const year = dateParts?.[0] || null;

  return {
    source: 'crossref',
    doi: item.DOI,
    title: Array.isArray(item.title) ? item.title[0] : item.title || 'Untitled',
    authors: (item.author || []).map(a => `${a.given || ''} ${a.family || ''}`).filter(n => n.trim()).join(', '),
    abstract: item.abstract ? item.abstract.replace(/<[^>]*>/g, '') : '',
    year,
    journal: Array.isArray(item['container-title']) ? item['container-title'][0] : item['container-title'] || '',
    url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : ''),
    subjects: item.subject || []
  };
}

/**
 * Search both CrossRef and OpenAlex, merge and deduplicate.
 *
 * @param {string} query - Search terms
 * @param {object} opts
 * @param {number} opts.yearFrom - Earliest publication year (default 2015)
 * @param {number} opts.limit - Max results per source (default 10)
 * @param {string} opts.sources - 'both' | 'crossref' | 'openalex'
 * @returns {Promise<Array>} Merged article list
 */
export async function searchScholarlyDatabases(query, {
  yearFrom = 2015,
  limit = 10,
  sources = 'both'
} = {}) {
  const counselingQuery = `${query} counseling psychology`;

  const fetchers = [];

  if (sources === 'both' || sources === 'crossref') {
    fetchers.push(
      searchCrossRef(counselingQuery, { limit, yearFrom })
        .catch(err => {
          console.error('CrossRef search failed:', err.message);
          return [];
        })
    );
  }

  if (sources === 'both' || sources === 'openalex') {
    fetchers.push(
      searchOpenAlex({ q: counselingQuery, year_from: yearFrom, per_page: limit })
        .then(r => r.results.map(item => ({
          source: 'openalex',
          doi: item.doi || '',
          title: item.title,
          authors: item.authors,
          abstract: item.abstract,
          year: item.year,
          journal: item.journal,
          url: item.oaUrl,
          subjects: [],
          wordCount: item.wordCount,
          ceHours: item.ceHours,
          citedByCount: item.citedByCount
        })))
        .catch(err => {
          console.error('OpenAlex search failed:', err.message);
          return [];
        })
    );
  }

  const resultSets = await Promise.all(fetchers);
  const allResults = resultSets.flat();

  // Deduplicate by DOI or title similarity
  const seen = new Map();
  const deduped = [];

  for (const article of allResults) {
    const key = article.doi
      ? article.doi.toLowerCase()
      : article.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);

    if (!seen.has(key)) {
      seen.set(key, true);
      deduped.push(article);
    }
  }

  // Sort: prefer articles with abstracts and higher citation counts
  deduped.sort((a, b) => {
    const aScore = (a.abstract ? 2 : 0) + (a.citedByCount || 0) / 100;
    const bScore = (b.abstract ? 2 : 0) + (b.citedByCount || 0) / 100;
    return bScore - aScore;
  });

  return deduped;
}

/**
 * Fetch a batch of articles for a topic, optimized for synthesis.
 * Returns 5-15 articles with abstracts preferred.
 */
export async function fetchArticlesForSynthesis(topic, {
  yearFrom = 2015,
  minArticles = 5,
  maxArticles = 15
} = {}) {
  const results = await searchScholarlyDatabases(topic, {
    yearFrom,
    limit: maxArticles,
    sources: 'both'
  });

  // Filter to articles that have enough content for synthesis
  const usable = results.filter(a => a.abstract && a.abstract.length > 50);

  if (usable.length < minArticles) {
    // Fall back to including articles without abstracts
    const remaining = results.filter(a => !a.abstract || a.abstract.length <= 50);
    return [...usable, ...remaining].slice(0, maxArticles);
  }

  return usable.slice(0, maxArticles);
}
