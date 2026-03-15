/**
 * OpenAlex API Service for Research Ready CE
 * Searches open-access scholarly articles and decodes abstracts.
 */

const OPENALEX_BASE = 'https://api.openalex.org/works';
const MAILTO = 'contact@gaintegrated.com';

const wordCountRanges = {
  0.5: { min: 250, max: 5999 },
  1.0: { min: 6000, max: 8999 },
  1.5: { min: 9000, max: 11999 },
  2.0: { min: 12000, max: Infinity }
};

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
 * Determine word count status.
 */
export function getWordCountStatus(wordCount) {
  if (wordCount >= 250) return 'sufficient';
  if (wordCount >= 100) return 'borderline';
  return 'thin';
}

/**
 * Map a single OpenAlex work object to our result format.
 */
function mapWork(work) {
  const abstract = decodeAbstractInvertedIndex(work.abstract_inverted_index);
  const wordCount = abstract ? abstract.split(/\s+/).filter(w => w.length > 0).length : 0;
  const ceHours = calculateCEHours(wordCount);
  const researchHours = calculateResearchHours(ceHours);

  const journal = work.primary_location?.source?.display_name || 'Unknown Journal';
  const authors = (work.authorships || [])
    .map(a => a.author?.display_name)
    .filter(Boolean)
    .join(', ') || 'Unknown Authors';
  const oaUrl = work.open_access?.oa_url
    || work.primary_location?.landing_page_url
    || '';
  const topic = work.primary_topic?.display_name || '';

  return {
    openAlexId: work.id,
    title: work.title || 'Untitled',
    year: work.publication_year,
    journal,
    authors,
    abstract,
    wordCount,
    ceHours,
    researchHours,
    oaUrl,
    topic,
    wcStatus: getWordCountStatus(wordCount),
    citedByCount: work.cited_by_count || 0,
    doi: work.primary_location?.source?.id || ''
  };
}

/**
 * Search OpenAlex for open-access articles.
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

  // When filtering by desired_hours, fetch more to compensate for filtering
  const fetchCount = desired_hours ? 25 : per_page;

  const params = new URLSearchParams({
    search: q,
    filter: `is_oa:true,publication_year:${year_from}-2025,type:article`,
    'per-page': String(fetchCount),
    page: String(desired_hours ? 1 : page),
    sort,
    select: 'id,title,publication_year,primary_location,authorships,abstract_inverted_index,primary_topic,cited_by_count,open_access',
    mailto: MAILTO
  });

  const url = `${OPENALEX_BASE}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenAlex API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  let results = (data.results || []).map(mapWork);

  // Filter by desired hours if specified
  if (desired_hours) {
    const hours = parseFloat(desired_hours);
    const range = wordCountRanges[hours];
    if (range) {
      results = results
        .filter(r => r.wordCount >= range.min && r.wordCount <= range.max)
        .map(r => ({ ...r, desiredHoursMatch: true }));
    }
    results = results.slice(0, 8);
  }

  return {
    results,
    meta: {
      count: desired_hours ? results.length : (data.meta?.count || 0),
      page: desired_hours ? 1 : page
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
    filter: `is_oa:true,publication_year:${yearAfter}-2025,type:article`,
    'per-page': '5',
    sort: 'publication_date:desc',
    select: 'title,publication_year,primary_location,authorships,abstract_inverted_index,open_access',
    mailto: MAILTO
  });

  const url = `${OPENALEX_BASE}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenAlex API error (${response.status})`);
  }

  const data = await response.json();
  return (data.results || []).map(mapWork);
}
