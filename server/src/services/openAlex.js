/**
 * OpenAlex API Service for Research Ready CE
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * Searches open-access scholarly articles and decodes abstracts.
 *
 * NOTE: OpenAlex only provides article abstracts (~150-300 words).
 * Full clinical practice content (6,200+ words / 1 CE) is generated
 * by articleContentGenerator.js after admin approval. Word counts
 * shown in search results reflect the generated content, not the abstract.
 */

const OPENALEX_BASE = 'https://api.openalex.org/works';
const MAILTO = process.env.CROSSREF_MAILTO || 'contact@gaintegrated.com';


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
 * Map a single OpenAlex work object to our result format.
 */
function mapWork(work, desiredHours = 1.0) {
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

  const ceHours = desiredHours;
  const wordCount = ceHours * 6000; // target, not actual
  const researchHours = calculateResearchHours(ceHours);

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
    // Abstract quality indicator
    abstractWordCount,
    abstractStatus: getAbstractStatus(abstractWordCount),
    oaUrl,
    topic,
    wcStatus: ceHours <= 3 ? 'sufficient' : 'extended',
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

  const params = new URLSearchParams({
    search: q,
    filter: `is_oa:true,publication_year:${year_from}-2025,type:article`,
    'per-page': String(per_page),
    page: String(page),
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
  let results = (data.results || []).map(w => mapWork(w, desired_hours || 1.0));

  // Filter out articles with no abstract (thin abstracts produce poor content)
  results = results.filter(r => r.abstractWordCount >= 50);

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
  return (data.results || []).map(w => mapWork(w, 1.0));
}
