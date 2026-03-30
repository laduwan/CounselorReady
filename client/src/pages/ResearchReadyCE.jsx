/**
 * ResearchReadyCE — Learner search page for Researched-N-Ready CE articles.
 * RNR CE design palette + ADA WCAG 2.1 AA compliance.
 * Includes: search, topic chips, Saved Articles tab, posttest flow.
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, BookOpen, Filter, Bookmark, CheckCircle, XCircle } from 'lucide-react';
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

  // Tabs
  const [activeTab, setActiveTab] = useState('search');
  const [savedArticles, setSavedArticles] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

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

  // Posttest
  const [posttestRequest, setPosttestRequest] = useState(null);
  const [posttestAnswers, setPosttestAnswers] = useState({});
  const [posttestResult, setPosttestResult] = useState(null);
  const [submittingPosttest, setSubmittingPosttest] = useState(false);

  // My requests
  const [myRequests, setMyRequests] = useState([]);

  // Screen reader announcements
  const [searchAnnouncement, setSearchAnnouncement] = useState('');

  // Prefill from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
    loadSavedArticles();
    loadMyRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function doSearch(searchQuery = query) {
    if (!searchQuery?.trim()) return;
    setLoading(true);
    setSearchAnnouncement('Searching...');
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
      setSearchAnnouncement(`${(data.results || []).length} results found`);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
      setSearchAnnouncement('Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function loadSavedArticles() {
    try {
      const { data } = await api.get('/research-ready/saved');
      setSavedArticles(data.articles || []);
      setSavedIds((data.articles || []).map(a => a.openAlexId || a._id));
    } catch { /* non-fatal */ }
  }

  async function loadMyRequests() {
    try {
      const { data } = await api.get('/research-ready/my-requests');
      setMyRequests(data.requests || []);
    } catch { /* non-fatal */ }
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
      setTimeout(() => doSearch(), 0);
    }
  }

  // Re-search when filters change
  useEffect(() => {
    if (query.trim()) doSearch();
  }, [yearFrom, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreateCE(article) {
    if (article.wcStatus === 'thin') {
      setThinArticle(article);
      return;
    }

    if (user?.role === 'admin') {
      setBuildingCE(true);
      try {
        const { data } = await api.post('/research-ready/currency-check', {
          title: article.title,
          authors: article.authors,
          journal: article.journal,
          year: article.year,
          abstract: article.abstract,
          fullText: article.fullText || '',
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
        fullText: currencyArticle.fullText || '',
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
      loadMyRequests();
    } catch (err) {
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
        loadMyRequests();
      } catch (err) {
        alert('Paired CE build failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setBuildingCE(false);
      }
    }
  }

  // ── Posttest flow ──

  async function openPosttest(request) {
    // Check engagement
    if (!request.adminNote?.includes('engagement_confirmed')) {
      const proceed = window.confirm(
        'Please read the article before taking the assessment. Have you read the full article?'
      );
      if (proceed) {
        try {
          await api.post(`/research-ready/engagement/${request._id}`);
        } catch { /* non-fatal */ }
      }
    }
    setPosttestRequest(request);
    setPosttestAnswers({});
    setPosttestResult(null);
  }

  async function submitPosttest() {
    if (!posttestRequest) return;
    setSubmittingPosttest(true);
    try {
      const { data } = await api.post(`/research-ready/request/${posttestRequest._id}/complete`, {
        answers: posttestAnswers
      });
      setPosttestResult(data);
      loadMyRequests();
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingPosttest(false);
    }
  }

  return (
    <div className="bg-[#FAF5EC] min-h-screen -m-6 p-6">
      {/* Woodgrain Hero */}
      <div className="bg-gradient-to-br from-[#3D2E18] to-[#2A2520] rounded-xl p-8 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.05em] uppercase bg-[rgba(196,144,64,0.2)] border border-[rgba(196,144,64,0.3)] text-[#C49040] mb-3">
          NBCC ACEP #7760
        </div>
        <h1 className="font-[Georgia,serif] text-[1.75rem] font-bold text-[#FDF8EE] mb-2">Researched-N-Ready CE</h1>
        <p className="font-[Georgia,serif] text-[0.95rem] text-[rgba(221,217,211,0.85)] max-w-xl">
          Current research. Earned credit. Search open-access articles, verify currency, and build CE courses backed by peer-reviewed scholarship.
        </p>
      </div>

      {/* Tabs: Search / Saved */}
      <div className="flex gap-4 mb-5 border-b border-[#DDD9D3]">
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-2 font-[Georgia,serif] text-[13px] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 ${
            activeTab === 'search' ? 'text-[#7B2D3E] border-b-2 border-[#7B2D3E] font-semibold' : 'text-[#5C4D3A]'
          }`}
        >
          <Search className="w-3.5 h-3.5 inline mr-1" /> Search Articles
        </button>
        <button
          onClick={() => { setActiveTab('saved'); loadSavedArticles(); }}
          className={`pb-2 font-[Georgia,serif] text-[13px] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 ${
            activeTab === 'saved' ? 'text-[#7B2D3E] border-b-2 border-[#7B2D3E] font-semibold' : 'text-[#5C4D3A]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 inline mr-1" /> Saved Articles
          {savedArticles.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#F8EEDC] text-[#8B5E2E]">{savedArticles.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'search' && (
        <>
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5EEE0] border border-[#C8C3BC] rounded-xl text-sm text-[#2A1F0E] font-[Georgia,serif] placeholder:text-[#A89880] focus:ring-2 focus:ring-[#7B2D3E]/30 focus:border-[#7B2D3E] outline-none"
                aria-label="Search scholarly articles"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#8B5E2E] text-[#FDF8EE] text-sm font-medium font-[Georgia,serif] rounded-xl hover:bg-[#A5712E] transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Topic Chips */}
          <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-2">Browse by topic</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {TOPIC_CHIPS.map(topic => (
              <button
                key={topic}
                onClick={() => handleChipClick(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-[Georgia,serif] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 ${
                  query === topic
                    ? 'bg-[#FDF8EE] border-[1.5px] border-[#7B2D3E] text-[#7B2D3E]'
                    : 'border border-[#DDD9D3] text-[#5C4D3A] hover:border-[#7B2D3E] hover:text-[#7B2D3E]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#7A6A54]" />
              <select
                value={yearFrom}
                onChange={e => setYearFrom(parseInt(e.target.value))}
                className="text-sm font-[Georgia,serif] bg-[#F5EEE0] border border-[#C8C3BC] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#7B2D3E]/30 outline-none"
                aria-label="Filter by year"
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
              aria-label="Sort results"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Screen reader announcements */}
          <div aria-live="polite" className="sr-only">{searchAnnouncement}</div>

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

          {/* Results */}
          {!loading && results.length > 0 && (
            <>
              <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-3">
                {meta.count} results found
              </p>
              <div className="bg-[#F5EEE0] rounded-xl p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {results.map((article, i) => (
                    <ArticleCard
                      key={article.openAlexId || i}
                      article={article}
                      onCreateCE={handleCreateCE}
                      onSelectForPairing={setPairedArticle}
                      isPairingMode={!!thinArticle}
                      savedArticles={savedIds}
                      onSaveChange={loadSavedArticles}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Empty state */}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 mx-auto text-[#C8C3BC] mb-4" />
              <h2 className="text-lg font-semibold text-[#5C4D3A] mb-2 font-[Georgia,serif]">No articles found</h2>
              <p className="text-sm text-[#7A6A54] font-[Georgia,serif]">Try a different search term or adjust your filters.</p>
            </div>
          )}

          {/* My Requests */}
          {myRequests.length > 0 && (
            <div className="mt-8">
              <h2 className="font-[Georgia,serif] text-[14px] font-semibold text-[#2A1F0E] mb-3">My Requests</h2>
              <div className="space-y-2">
                {myRequests.map(req => {
                  const statusColors = {
                    pending: 'bg-[#F8EEDC] text-[#C49040]',
                    approved: 'bg-green-100 text-green-700',
                    generating: 'bg-purple-100 text-purple-700',
                    test_ready: 'bg-[#FAF5EC] text-[#7B2D3E] border border-[#7B2D3E]',
                    in_progress: 'bg-[#FAF5EC] text-[#7B2D3E] border border-[#7B2D3E]',
                    completed: 'bg-green-100 text-green-700',
                    rejected: 'bg-red-100 text-red-700',
                    error: 'bg-red-100 text-red-700'
                  };
                  return (
                    <div key={req._id} className="flex items-center justify-between p-3 bg-[#FAF5EC] border border-[#DDD9D3] rounded-lg">
                      <div>
                        <p className="font-[Georgia,serif] text-[13px] font-semibold text-[#2A1F0E]">
                          {req.contentArea} · {req.totalCeHours} CE hrs
                        </p>
                        <p className="font-[Georgia,serif] text-[11px] text-[#5C4D3A]">
                          {req.selectedArticles?.length} article(s) · {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium font-[Georgia,serif] ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                        {(req.status === 'test_ready' || req.status === 'in_progress') && (
                          <button
                            onClick={() => openPosttest(req)}
                            className="px-3 py-1 bg-[#7B2D3E] text-[#FAF5EC] rounded text-[11px] font-[Georgia,serif] font-semibold hover:bg-[#9B3A4E] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
                          >
                            Take Posttest
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Saved Articles Tab */}
      {activeTab === 'saved' && (
        <div>
          {savedArticles.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-12 h-12 mx-auto text-[#C8C3BC] mb-4" />
              <h2 className="text-lg font-semibold text-[#5C4D3A] mb-2 font-[Georgia,serif]">No saved articles</h2>
              <p className="text-sm text-[#7A6A54] font-[Georgia,serif]">Save articles from search results to access them later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {savedArticles.map((article, i) => (
                <ArticleCard
                  key={article.openAlexId || article._id || i}
                  article={article}
                  onCreateCE={handleCreateCE}
                  onSelectForPairing={setPairedArticle}
                  isPairingMode={!!thinArticle}
                  savedArticles={savedIds}
                  onSaveChange={loadSavedArticles}
                />
              ))}
            </div>
          )}
        </div>
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

      {/* ── Posttest Modal ── */}
      {posttestRequest && !posttestResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" role="dialog" aria-label="Posttest assessment">
          <div className="bg-[#FAF5EC] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-[Georgia,serif] text-xl font-bold text-[#2A1F0E] mb-1">
              {posttestRequest.courseTitle || 'Posttest Assessment'}
            </h2>
            <p className="font-[Georgia,serif] text-[12px] text-[#5C4D3A] mb-6">
              10 questions · 75% required to pass · {posttestRequest.contentArea}
            </p>

            {(posttestRequest.questions || []).map((q, qi) => (
              <fieldset key={qi} className="mb-6 border border-[#EAE7E2] rounded-lg p-4 bg-[#FDF8EE]">
                <legend className="font-[Georgia,serif] text-[13px] font-semibold text-[#2A1F0E] px-2">
                  {qi + 1}. {q.question}
                </legend>
                <div className="mt-3 space-y-2">
                  {(q.options || []).map((opt, oi) => (
                    <label key={oi} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F5EEE0] cursor-pointer">
                      <input
                        type="radio"
                        name={`q${qi}`}
                        value={oi}
                        checked={posttestAnswers[qi] === oi}
                        onChange={() => setPosttestAnswers(prev => ({ ...prev, [qi]: oi }))}
                        className="mt-0.5 accent-[#7B2D3E]"
                      />
                      <span className="font-[Georgia,serif] text-[12px] text-[#2A1F0E]">{opt}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <div className="flex gap-3 mt-4">
              <button
                onClick={submitPosttest}
                disabled={submittingPosttest || Object.keys(posttestAnswers).length < (posttestRequest.questions?.length || 10)}
                className="flex-1 py-3 bg-[#8B5E2E] text-[#FDF8EE] font-[Georgia,serif] font-bold rounded-xl hover:bg-[#A5712E] disabled:opacity-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
              >
                {submittingPosttest ? 'Submitting...' : 'Submit Assessment'}
              </button>
              <button
                onClick={() => { setPosttestRequest(null); setPosttestAnswers({}); }}
                className="px-6 py-3 border border-[#DDD9D3] text-[#5C4D3A] font-[Georgia,serif] rounded-xl hover:bg-[#F5EEE0] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posttest Result */}
      {posttestResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" role="dialog" aria-label="Posttest result">
          <div className="bg-[#FAF5EC] rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <div aria-live="assertive">
              {posttestResult.passed ? (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h2 className="font-[Georgia,serif] text-xl font-bold text-[#2A1F0E] mb-2">Congratulations!</h2>
                  <p className="font-[Georgia,serif] text-[14px] text-[#5C4D3A] mb-2">
                    Score: {posttestResult.score}% · {posttestResult.ceHours} CE hours earned
                  </p>
                  <p className="font-[Georgia,serif] text-[12px] text-[#7A6A54] mb-4">
                    Certificate: {posttestResult.certificateNumber}
                  </p>
                  <a
                    href="/credentials"
                    className="inline-block px-6 py-2.5 bg-[#8B5E2E] text-[#FDF8EE] font-[Georgia,serif] font-semibold rounded-xl hover:bg-[#A5712E]"
                  >
                    View in Credentials
                  </a>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 mx-auto text-[#7B2D3E] mb-4" />
                  <h2 className="font-[Georgia,serif] text-xl font-bold text-[#2A1F0E] mb-2">Not quite</h2>
                  <p className="font-[Georgia,serif] text-[14px] text-[#5C4D3A] mb-2">
                    Score: {posttestResult.score}% · You need 75% to pass.
                  </p>
                  <p className="font-[Georgia,serif] text-[12px] text-[#7A6A54] mb-4">
                    {posttestResult.attemptsUsed < 2
                      ? 'You may retake once. Review the article and try again.'
                      : 'Please review the article and contact support.'}
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => { setPosttestResult(null); setPosttestRequest(null); setPosttestAnswers({}); }}
              className="mt-4 px-6 py-2 border border-[#DDD9D3] text-[#5C4D3A] font-[Georgia,serif] rounded-xl hover:bg-[#F5EEE0] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
