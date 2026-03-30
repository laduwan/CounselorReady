/**
 * ResearchReadyCE — Learner search page for Researched-N-Ready CE articles.
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, BookOpen, Filter, Award, X, CheckCircle, XCircle } from 'lucide-react';
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

  // My requests + posttest
  const [myRequests, setMyRequests] = useState([]);
  const [posttestRequest, setPosttestRequest] = useState(null);
  const [posttestAnswers, setPosttestAnswers] = useState({});
  const [posttestSubmitting, setPosttestSubmitting] = useState(false);
  const [posttestResult, setPosttestResult] = useState(null);

  // Prefill from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load my requests on mount
  useEffect(() => {
    loadMyRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadMyRequests() {
    try {
      const { data } = await api.get('/research-ready/my-requests');
      setMyRequests(data.requests || []);
    } catch { /* non-fatal */ }
  }

  function openPosttest(request) {
    setPosttestAnswers({});
    setPosttestResult(null);
    setPosttestRequest(request);
  }

  async function submitPosttest() {
    if (!posttestRequest) return;
    setPosttestSubmitting(true);
    try {
      const { data } = await api.post(`/research-ready/request/${posttestRequest._id}/complete`, {
        answers: posttestAnswers
      });
      setPosttestResult(data);
      if (data.passed) {
        loadMyRequests();
      }
    } catch (err) {
      alert('Posttest submission failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setPosttestSubmitting(false);
    }
  }

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
      {/* Woodgrain Hero */}
      <div className="rounded-xl p-8 mb-6" style={{ background: 'linear-gradient(135deg, #3D2E18 0%, #2A2520 100%)' }}>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-3"
          style={{ background: 'rgba(196,144,64,0.2)', border: '1px solid rgba(196,144,64,0.3)', color: '#C49040' }}>
          NBCC ACEP #7760
        </span>
        <h1 className="font-[Georgia,serif] text-[1.75rem] font-bold text-[#FDF8EE] mb-2">Researched-N-Ready CE</h1>
        <p className="font-[Georgia,serif] text-[0.95rem] text-[rgba(221,217,211,0.85)] max-w-xl italic">
          Current research. Earned credit. Search open-access articles, verify currency, and build CE courses backed by peer-reviewed scholarship.
        </p>
      </div>

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
        <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-3">
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

      {/* My Requests */}
      {myRequests.length > 0 && (
        <div className="mt-8 border-t border-[#DDD9D3] pt-6">
          <h2 className="font-[Georgia,serif] text-lg font-bold text-[#2A1F0E] mb-4">My Requests</h2>
          <div className="space-y-3">
            {myRequests.map(req => {
              const statusMap = {
                pending: { bg: '#F8EEDC', color: '#8B5E2E' },
                approved: { bg: '#EEF5EA', color: '#2A4A18' },
                test_ready: { bg: '#FDF8EE', color: '#7B2D3E' },
                in_progress: { bg: '#FDF8EE', color: '#7B2D3E' },
                completed: { bg: '#EEF5EA', color: '#2A4A18' },
                rejected: { bg: '#FAF0ED', color: '#7B2D3E' },
                failed: { bg: '#FAF0ED', color: '#8A3020' }
              };
              const s = statusMap[req.status] || statusMap.pending;
              return (
                <div key={req._id} className="flex items-center justify-between bg-[#F5EEE0] border border-[#DDD9D3] rounded-lg p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-[Georgia,serif] text-sm font-semibold text-[#2A1F0E] truncate">{req.contentArea} &middot; {req.totalCeHours} CE hrs</p>
                    <p className="font-[Georgia,serif] text-xs text-[#7A6A54] italic mt-0.5">
                      {req.selectedArticles?.length || 0} article(s) &middot; {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="px-2.5 py-1 rounded text-xs font-semibold font-[Georgia,serif] italic"
                      style={{ background: s.bg, color: s.color }}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                    {['test_ready', 'in_progress'].includes(req.status) && req.questions?.length > 0 && (
                      <button
                        onClick={() => openPosttest(req)}
                        className="px-3 py-1.5 rounded bg-[#7B2D3E] text-[#FAF5EC] text-xs font-semibold font-[Georgia,serif] hover:bg-[#9B3A4E] transition-colors"
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

      {/* Posttest Modal */}
      {posttestRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FAF5EC] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-[#FAF5EC] border-b border-[#DDD9D3] p-5 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="font-[Georgia,serif] text-lg font-bold text-[#2A1F0E]">RNR CE Posttest</h2>
                <p className="font-[Georgia,serif] text-xs text-[#7A6A54] italic mt-0.5">
                  {posttestRequest.contentArea} &middot; 75% required to pass
                </p>
              </div>
              <button onClick={() => { setPosttestRequest(null); setPosttestResult(null); }}
                className="p-1.5 text-[#7A6A54] hover:text-[#2A1F0E] rounded-lg hover:bg-[#EAE7E2]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Result banner */}
            {posttestResult && (
              <div className={`mx-5 mt-4 p-4 rounded-lg border ${posttestResult.passed
                ? 'bg-[#EEF5EA] border-[#4A7C59]'
                : 'bg-[#FAF0ED] border-[#7B2D3E]'}`}>
                <div className="flex items-center gap-3">
                  {posttestResult.passed
                    ? <CheckCircle className="w-6 h-6 text-[#4A7C59]" />
                    : <XCircle className="w-6 h-6 text-[#7B2D3E]" />}
                  <div>
                    <p className="font-[Georgia,serif] font-bold text-[#2A1F0E]">
                      {posttestResult.passed ? 'Congratulations! You passed.' : 'Not yet — review and retry.'}
                    </p>
                    <p className="font-[Georgia,serif] text-sm text-[#5C4D3A]">
                      Score: {posttestResult.score}% ({posttestResult.correctCount}/{posttestResult.totalQuestions} correct)
                    </p>
                    {!posttestResult.passed && (
                      <p className="font-[Georgia,serif] text-xs text-[#7A6A54] mt-1 italic">
                        {posttestResult.message}
                      </p>
                    )}
                  </div>
                </div>
                {posttestResult.passed && (
                  <div className="mt-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#8B5E2E]" />
                    <p className="font-[Georgia,serif] text-xs text-[#8B5E2E] font-semibold">
                      CE credit recorded. View in Credentials.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Questions */}
            {!posttestResult?.passed && (
              <div className="p-5 space-y-6">
                {(posttestRequest.questions || []).map((q, qi) => (
                  <div key={qi} className="bg-[#F5EEE0] border border-[#DDD9D3] rounded-lg p-4">
                    <p className="font-[Georgia,serif] text-sm font-semibold text-[#2A1F0E] mb-3">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, oi) => (
                        <label key={oi}
                          className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                            posttestAnswers[qi] === oi
                              ? 'bg-[#FDF8EE] border-[1.5px] border-[#7B2D3E]'
                              : 'bg-[#FAF5EC] border border-[#EAE7E2] hover:border-[#DDD9D3]'
                          }`}>
                          <input
                            type="radio"
                            name={`q-${qi}`}
                            checked={posttestAnswers[qi] === oi}
                            onChange={() => setPosttestAnswers(prev => ({ ...prev, [qi]: oi }))}
                            className="mt-0.5 accent-[#7B2D3E]"
                          />
                          <span className="font-[Georgia,serif] text-sm text-[#2A1F0E]">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={submitPosttest}
                  disabled={posttestSubmitting || Object.keys(posttestAnswers).length < (posttestRequest.questions?.length || 0)}
                  className="w-full py-3 rounded-lg bg-[#8B5E2E] text-[#FDF8EE] font-[Georgia,serif] font-semibold text-sm hover:bg-[#A5712E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {posttestSubmitting ? 'Submitting...' : 'Submit Posttest'}
                </button>
              </div>
            )}

            {/* Close on pass */}
            {posttestResult?.passed && (
              <div className="p-5 text-center">
                <button
                  onClick={() => { setPosttestRequest(null); setPosttestResult(null); }}
                  className="px-6 py-2.5 rounded-lg bg-[#8B5E2E] text-[#FDF8EE] font-[Georgia,serif] font-semibold text-sm hover:bg-[#A5712E] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
