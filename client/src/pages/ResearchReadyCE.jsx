/**
 * ResearchReadyCE — Learner search page for Researched-N-Ready CE articles.
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, BookOpen, Filter } from 'lucide-react';
import ArticleCard from '../components/researchReady/ArticleCard';
import CEHoursSelector from '../components/researchReady/CEHoursSelector';
import PairingTray from '../components/researchReady/PairingTray';
import CurrencyCheckModal from '../components/researchReady/CurrencyCheckModal';

const TOPIC_CHIPS = [
  'Supervision', 'Supervisory Alliance', 'Ethics & Gatekeeping',
  'Trauma', 'CBT / Depression', 'Motivational Interviewing',
  'Multicultural', 'Telehealth', 'Pharmacology', 'Group Supervision'
];

const YEAR_OPTIONS = [
  { value: 2020, label: '2020+' },
  { value: 2021, label: '2021+' },
  { value: 2022, label: '2022+' },
  { value: 2023, label: '2023+' }
];

const SORT_OPTIONS = [
  { value: 'publication_date:desc', label: 'Newest' },
  { value: 'cited_by_count:desc', label: 'Most Cited' },
  { value: 'relevance_score:desc', label: 'Most Relevant' }
];

export default function ResearchReadyCE() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ count: 0, page: 1 });

  // Filters
  const [desiredHours, setDesiredHours] = useState(null);
  const [yearFrom, setYearFrom] = useState(2020);
  const [sortBy, setSortBy] = useState('publication_date:desc');

  // Pairing
  const [thinArticle, setThinArticle] = useState(null);
  const [pairedArticle, setPairedArticle] = useState(null);

  // Currency check modal
  const [currencyData, setCurrencyData] = useState(null);
  const [currencyArticle, setCurrencyArticle] = useState(null);
  const [buildingCE, setBuildingCE] = useState(false);

  // Prefill from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function doSearch(searchQuery = query) {
    if (!searchQuery?.trim()) return;
    setLoading(true);
    try {
      const params = {
        q: searchQuery.trim(),
        year_from: yearFrom,
        sort: sortBy,
        per_page: 8
      };
      if (desiredHours) params.desired_hours = desiredHours;

      const { data } = await api.get('/research-ready/search', { params });
      setResults(data.results || []);
      setMeta(data.meta || { count: 0, page: 1 });
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e?.preventDefault();
    doSearch();
  }

  function handleChipClick(topic) {
    setQuery(topic);
    doSearch(topic);
  }

  function handleHoursChange(hours) {
    setDesiredHours(hours);
    if (query.trim()) {
      // Re-search with new hours filter
      setTimeout(() => doSearch(), 0);
    }
  }

  // Re-search when filters change (debounced via effect)
  useEffect(() => {
    if (query.trim()) doSearch();
  }, [yearFrom, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreateCE(article) {
    if (article.wcStatus === 'thin') {
      setThinArticle(article);
      return;
    }

    // For admin users, run currency check first
    if (user?.role === 'admin') {
      setBuildingCE(true);
      try {
        const { data } = await api.post('/research-ready/currency-check', {
          title: article.title,
          authors: article.authors,
          journal: article.journal,
          year: article.year,
          abstract: article.abstract,
          topic: article.topic
        });
        setCurrencyData(data);
        setCurrencyArticle(article);
      } catch (err) {
        console.error('Currency check failed:', err);
        alert('Currency check failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setBuildingCE(false);
      }
    }
  }

  async function handleProceedToBuild() {
    if (!currencyArticle) return;
    setBuildingCE(true);
    try {
      const { data } = await api.post('/research-ready/build-ce', {
        title: currencyArticle.title,
        authors: currencyArticle.authors,
        journal: currencyArticle.journal,
        year: currencyArticle.year,
        abstract: currencyArticle.abstract,
        topic: currencyArticle.topic,
        wordCount: currencyArticle.wordCount,
        ceHours: currencyArticle.ceHours,
        researchHours: currencyArticle.researchHours,
        oaUrl: currencyArticle.oaUrl,
        format: 'standalone',
        currencyVerdict: currencyData?.verdict || null
      });
      alert(`CE course created successfully! Course ID: ${data.courseId}\nStatus: Pending admin review`);
      setCurrencyData(null);
      setCurrencyArticle(null);
    } catch (err) {
      console.error('CE build failed:', err);
      alert('CE build failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setBuildingCE(false);
    }
  }

  async function handlePairedConfirm() {
    if (!thinArticle || !pairedArticle) return;
    const format = Math.abs(thinArticle.year - pairedArticle.year) > 3 ? 'comparative' : 'integrative';

    if (user?.role === 'admin') {
      setBuildingCE(true);
      try {
        const { data } = await api.post('/research-ready/build-ce', {
          title: `${thinArticle.title} + ${pairedArticle.title}`,
          authors: `${thinArticle.authors}; ${pairedArticle.authors}`,
          journal: `${thinArticle.journal}; ${pairedArticle.journal}`,
          year: Math.max(thinArticle.year, pairedArticle.year),
          abstract: `${thinArticle.abstract}\n\n---\n\n${pairedArticle.abstract}`,
          topic: thinArticle.topic || pairedArticle.topic,
          wordCount: thinArticle.wordCount + pairedArticle.wordCount,
          ceHours: 3.0,
          researchHours: 1.5,
          oaUrl: thinArticle.oaUrl,
          format,
          pairedArticle: pairedArticle
        });
        alert(`Paired CE course created! Course ID: ${data.courseId}`);
        setThinArticle(null);
        setPairedArticle(null);
      } catch (err) {
        alert('Paired CE build failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setBuildingCE(false);
      }
    }
  }

  return (
    <div className="bg-[#FAF5EC] min-h-screen -m-6 p-6">
      <h1 className="font-[Georgia,serif] text-2xl font-bold text-[#2A1F0E] mb-1">Researched-N-Ready CE</h1>
      <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-6">
        Earn NBCC-approved CE credit by reading peer-reviewed scholarly articles. ACEP #7760
      </p>

      {/* CE Hours Selector */}
      <CEHoursSelector selected={desiredHours} onSelect={handleHoursChange} />

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6A54]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for scholarly articles (e.g., clinical supervision, trauma therapy)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F5EEE0] border border-[#C8C3BC] rounded-xl text-sm font-[Georgia,serif] focus:ring-2 focus:ring-[#7B2D3E]/30 focus:border-[#7B2D3E] outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#7B2D3E] text-[#FAF5EC] text-sm font-medium font-[Georgia,serif] rounded-xl hover:bg-[#9B3A4E] transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Section label */}
      <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-2">Browse by topic</p>

      {/* Topic Chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TOPIC_CHIPS.map(topic => (
          <button
            key={topic}
            onClick={() => handleChipClick(topic)}
            className={`px-3 py-1.5 rounded-full text-xs font-[Georgia,serif] uppercase transition-colors ${
              query === topic
                ? 'bg-[#FDF8EE] border-[1.5px] border-[#7B2D3E] text-[#7B2D3E]'
                : 'bg-[#F5EEE0] border border-[#C8C3BC] text-[#5C4D3A] hover:border-[#7B2D3E] hover:text-[#7B2D3E]'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#7A6A54]" />
          <select
            value={yearFrom}
            onChange={e => setYearFrom(parseInt(e.target.value))}
            className="text-sm font-[Georgia,serif] bg-[#F5EEE0] border border-[#C8C3BC] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#7B2D3E]/30 outline-none"
          >
            {YEAR_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-sm font-[Georgia,serif] bg-[#F5EEE0] border border-[#C8C3BC] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#7B2D3E]/30 outline-none"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Desired Hours Match Notice */}
      {desiredHours && results.length > 0 && (
        <div className="bg-[#FDF8EE] border border-[#DDD9D3] rounded-xl p-3 mb-4 text-sm text-[#5C4D3A] font-[Georgia,serif]">
          Showing articles matching your <strong>{desiredHours} hr</strong> target
          {results.length < 3 && ' — Fewer articles at this length. Try "Any" or broaden your search.'}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B2D3E]"></div>
        </div>
      )}

      {/* Building CE overlay */}
      {buildingCE && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-[#FAF5EC] rounded-2xl p-8 text-center shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7B2D3E] mx-auto mb-4"></div>
            <p className="text-[#2A1F0E] font-medium font-[Georgia,serif]">Processing with AI...</p>
            <p className="text-sm text-[#7A6A54] mt-1 font-[Georgia,serif]">This may take 15-30 seconds</p>
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && results.length > 0 && (
        <p className="font-[Georgia,serif] text-[10px] italic text-[#5C4D3A] mb-3">
          {meta.count} results found
        </p>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {results.map((article, i) => (
            <ArticleCard
              key={article.openAlexId || i}
              article={article}
              onCreateCE={handleCreateCE}
              onSelectForPairing={setPairedArticle}
              isPairingMode={!!thinArticle}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto text-[#C8C3BC] mb-4" />
          <h2 className="text-lg font-semibold text-[#5C4D3A] mb-2 font-[Georgia,serif]">No articles found</h2>
          <p className="text-sm text-[#7A6A54] font-[Georgia,serif]">Try a different search term or adjust your filters.</p>
        </div>
      )}

      {/* Meta */}
      {!loading && results.length > 0 && (
        <p className="font-[Georgia,serif] text-[10px] italic text-[#7A6A54] text-center mb-4">
          {meta.count} total results &middot; Page {meta.page} &middot; Powered by OpenAlex
        </p>
      )}

      {/* Pairing Tray */}
      {thinArticle && (
        <PairingTray
          thinArticle={thinArticle}
          pairedArticle={pairedArticle}
          onCancel={() => { setThinArticle(null); setPairedArticle(null); }}
          onConfirm={handlePairedConfirm}
        />
      )}

      {/* Currency Check Modal */}
      {currencyData && (
        <CurrencyCheckModal
          verdict={currencyData.verdict}
          newerArticles={currencyData.newerArticles}
          onClose={() => { setCurrencyData(null); setCurrencyArticle(null); }}
          onProceed={handleProceedToBuild}
        />
      )}
    </div>
  );
}
