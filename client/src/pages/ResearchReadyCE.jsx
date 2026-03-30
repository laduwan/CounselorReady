/**
 * ResearchReadyCE — Learner search page for Researched-N-Ready CE articles.
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, BookOpen, Filter, X, CheckCircle, XCircle } from 'lucide-react';
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

  // Posttest
  const [posttestCourse, setPosttestCourse] = useState(null);
  const [posttestAnswers, setPosttestAnswers] = useState({});
  const [posttestSubmitted, setPosttestSubmitted] = useState(false);
  const [posttestScore, setPosttestScore] = useState(null);
  const [posttestPassed, setPosttestPassed] = useState(false);
  const [posttestRetryAvailable, setPosttestRetryAvailable] = useState(true);
  const [posttestSubmitting, setPosttestSubmitting] = useState(false);

  // My requests
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    loadMyRequests();
  }, []);

  async function loadMyRequests() {
    try {
      const { data } = await api.get('/research-ready/my-requests');
      setMyRequests(data.requests || []);
    } catch { /* non-fatal */ }
  }

  function openPosttest(course) {
    setPosttestCourse(course);
    setPosttestAnswers({});
    setPosttestSubmitted(false);
    setPosttestScore(null);
    setPosttestPassed(false);
  }

  async function submitPosttest() {
    if (!posttestCourse) return;
    const questions = posttestCourse.questions || [];
    if (Object.keys(posttestAnswers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setPosttestSubmitting(true);
    const correct = questions.filter((q, i) => posttestAnswers[i] === q.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 75;

    setPosttestScore(score);
    setPosttestPassed(passed);
    setPosttestSubmitted(true);

    if (passed) {
      try {
        await api.post(`/research-ready/request/${posttestCourse._id}/complete`, {
          answers: Object.values(posttestAnswers),
          score
        });
        loadMyRequests();
      } catch (err) {
        console.error('Completion POST failed:', err);
      }
    } else {
      if (!posttestRetryAvailable) {
        // No more retries
      } else {
        setPosttestRetryAvailable(false);
      }
    }
    setPosttestSubmitting(false);
  }

  function retryPosttest() {
    setPosttestAnswers({});
    setPosttestSubmitted(false);
    setPosttestScore(null);
    setPosttestPassed(false);
  }

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
    <div className="bg-[#FAF5EC] min-h-screen -m-6">
      {/* Woodgrain Header */}
      <div style={{ background: 'linear-gradient(135deg, #3D2E18 0%, #2A2520 100%)' }} className="px-6 py-8 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em] mb-3" style={{ background: 'rgba(196,144,64,0.2)', border: '1px solid rgba(196,144,64,0.3)', color: '#C49040' }}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5C21 20 16.97 22 12 22S3 20 3 17.5a12.083 12.083 0 012.84-6.922L12 14z"/></svg>
          NBCC ACEP #7760
        </div>
        <h1 className="font-[Georgia,serif] text-[1.75rem] font-bold text-[#FDF8EE] mb-2">Researched-N-Ready CE</h1>
        <p className="font-[Georgia,serif] text-[0.95rem]" style={{ color: 'rgba(221,217,211,0.85)' }}>
          Current research. Earned credit. Search open-access articles, verify currency, and build CE courses backed by peer-reviewed scholarship.
        </p>
      </div>

      <div className="px-6 pb-6">

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
          className="px-6 py-2.5 bg-[#8B5E2E] text-[#FDF8EE] text-sm font-medium font-[Georgia,serif] rounded-xl hover:bg-[#A5712E] transition-colors disabled:opacity-50"
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

      {/* My Requests */}
      {myRequests.length > 0 && (
        <div className="mt-8">
          <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-3">My Requests</p>
          <div className="space-y-2">
            {myRequests.map(r => (
              <div key={r._id} className="flex items-center justify-between bg-[#F5EEE0] border border-[#DDD9D3] rounded-lg px-4 py-3">
                <div>
                  <p className="font-[Georgia,serif] text-[13px] font-semibold text-[#2A1F0E]">{r.contentArea} &middot; {r.totalCeHours} CE hrs</p>
                  <p className="font-[Georgia,serif] text-[11px] italic text-[#5C4D3A]">{r.selectedArticles?.length} article(s) &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold font-[Georgia,serif] ${
                    r.status === 'pending' ? 'bg-[#F8EEDC] text-[#C49040]' :
                    r.status === 'completed' ? 'bg-green-100 text-green-700' :
                    r.status === 'rejected' ? 'bg-[#FAF0ED] text-[#7B2D3E]' :
                    'bg-[#FAF6F4] text-[#7B2D3E]'
                  }`}>{r.status.replace(/_/g, ' ')}</span>
                  {['approved', 'posttest_ready', 'test_ready'].includes(r.status) && r.questions?.length > 0 && (
                    <button
                      onClick={() => openPosttest(r)}
                      className="px-3 py-1.5 bg-[#7B2D3E] text-[#FAF5EC] rounded font-[Georgia,serif] text-[11px] font-semibold hover:bg-[#9B3A4E] transition-colors"
                    >
                      Take Posttest
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {/* Posttest Modal */}
      {posttestCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setPosttestCourse(null)} />
            <div className="relative bg-[#FAF5EC] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-[#FAF5EC] border-b border-[#DDD9D3] px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-[Georgia,serif] text-lg font-bold text-[#2A1F0E]">Posttest Assessment</h2>
                  <p className="font-[Georgia,serif] text-[12px] text-[#5C4D3A] italic">{posttestCourse.courseTitle || posttestCourse.contentArea} &middot; {posttestCourse.totalCeHours} CE hrs</p>
                </div>
                <button onClick={() => setPosttestCourse(null)} className="text-[#7A6A54] hover:text-[#2A1F0E] p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Score result */}
                {posttestSubmitted && (
                  <div className={`mb-6 p-4 rounded-xl border ${posttestPassed ? 'bg-green-50 border-green-200' : 'bg-[#FAF0ED] border-red-200'}`}>
                    <div className="flex items-center gap-3">
                      {posttestPassed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-[#7B2D3E]" />
                      )}
                      <div>
                        <p className="font-[Georgia,serif] text-[15px] font-bold text-[#2A1F0E]">
                          Score: {posttestScore}% {posttestPassed ? '— Passed!' : '— Did not pass'}
                        </p>
                        <p className="font-[Georgia,serif] text-[12px] text-[#5C4D3A]">
                          {posttestPassed
                            ? 'Congratulations! Your CE certificate has been generated.'
                            : posttestRetryAvailable
                              ? 'You need 75% to pass. You have one retry available.'
                              : 'No retries remaining. Please contact support.'}
                        </p>
                      </div>
                    </div>
                    {!posttestPassed && posttestRetryAvailable && (
                      <button
                        onClick={retryPosttest}
                        className="mt-3 px-4 py-2 bg-[#8B5E2E] text-[#FDF8EE] rounded font-[Georgia,serif] text-[12px] font-semibold hover:bg-[#A5712E] transition-colors"
                      >
                        Retry Posttest
                      </button>
                    )}
                  </div>
                )}

                {/* Questions */}
                {!posttestSubmitted && (
                  <div className="space-y-6">
                    {(posttestCourse.questions || []).map((q, qi) => (
                      <div key={qi} className="bg-[#F5EEE0] border border-[#DDD9D3] rounded-xl p-4">
                        <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.1em] text-[#C49040] font-semibold mb-1">{q.tag}</p>
                        <p className="font-[Georgia,serif] text-[13px] text-[#2A1F0E] font-medium mb-3">{qi + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <label
                              key={oi}
                              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                                posttestAnswers[qi] === oi
                                  ? 'bg-[#FDF8EE] border-[1.5px] border-[#7B2D3E]'
                                  : 'bg-[#FAF5EC] border border-[#DDD9D3] hover:border-[#C49040]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${qi}`}
                                checked={posttestAnswers[qi] === oi}
                                onChange={() => setPosttestAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className="accent-[#7B2D3E]"
                              />
                              <span className="font-[Georgia,serif] text-[12px] text-[#2A1F0E]">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t border-[#DDD9D3]">
                      <p className="font-[Georgia,serif] text-[11px] italic text-[#5C4D3A]">
                        {Object.keys(posttestAnswers).length} of {(posttestCourse.questions || []).length} answered &middot; 75% required to pass
                      </p>
                      <button
                        onClick={submitPosttest}
                        disabled={posttestSubmitting || Object.keys(posttestAnswers).length < (posttestCourse.questions || []).length}
                        className="px-6 py-2.5 bg-[#8B5E2E] text-[#FDF8EE] rounded-lg font-[Georgia,serif] text-[13px] font-semibold hover:bg-[#A5712E] transition-colors disabled:opacity-50"
                      >
                        {posttestSubmitting ? 'Submitting...' : 'Submit Assessment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>{/* end px-6 content wrapper */}
    </div>
  );
}
