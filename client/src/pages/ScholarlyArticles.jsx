/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, BookOpen, FileText, Award, CheckCircle, Clock, BookmarkPlus, Bookmark, ExternalLink, ChevronRight, ChevronDown, Loader2, AlertCircle, GraduationCap, BarChart3, X } from 'lucide-react';

const CONTENT_AREA_LABELS = {
  'counseling-theory-practice': 'Counseling Theory & Practice',
  'human-growth-development': 'Human Growth & Development',
  'social-cultural-foundations': 'Social & Cultural Foundations',
  'group-dynamics-counseling': 'Group Dynamics & Counseling',
  'career-development-counseling': 'Career Development & Counseling',
  'assessment': 'Assessment',
  'research-program-evaluation': 'Research & Program Evaluation',
  'professional-identity-practice': 'Professional Identity & Practice',
  'wellness-prevention': 'Wellness & Prevention'
};

export default function ScholarlyArticles() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [myArticles, setMyArticles] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [stats, setStats] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [quizArticle, setQuizArticle] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [savingDoi, setSavingDoi] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  // Load library when tab switches
  useEffect(() => {
    if (activeTab === 'library') loadMyArticles();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/scholarly-articles/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    setPage(1);
    try {
      const { data } = await api.get('/scholarly-articles/search', {
        params: { q: searchQuery, page: 1, limit: 10 }
      });
      setSearchResults(data.results);
      setTotalResults(data.totalResults);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setSearching(true);
    try {
      const { data } = await api.get('/scholarly-articles/search', {
        params: { q: searchQuery, page: nextPage, limit: 10 }
      });
      setSearchResults(prev => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const loadMyArticles = async (statusFilter) => {
    setLoadingLibrary(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/scholarly-articles/my-articles', { params });
      setMyArticles(data.articles);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const saveArticle = async (doi) => {
    setSavingDoi(doi);
    try {
      await api.post(`/scholarly-articles/article/${encodeURIComponent(doi)}/save`);
      // Update search results to reflect saved status
      setSearchResults(prev => prev.map(r => r.doi === doi ? { ...r, userStatus: 'saved' } : r));
      loadStats();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSavingDoi(null);
    }
  };

  const unsaveArticle = async (doi) => {
    try {
      await api.delete(`/scholarly-articles/article/${encodeURIComponent(doi)}/save`);
      setMyArticles(prev => prev.filter(a => a.doi !== doi));
      setSearchResults(prev => prev.map(r => r.doi === doi ? { ...r, userStatus: null } : r));
      loadStats();
    } catch (err) {
      console.error('Unsave failed:', err);
    }
  };

  const markAsRead = async (doi) => {
    try {
      await api.patch(`/scholarly-articles/article/${encodeURIComponent(doi)}/read`);
      loadMyArticles();
      loadStats();
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  const startQuiz = async (article) => {
    setQuizArticle(article);
    setQuizLoading(true);
    setQuizResult(null);
    setQuizAnswers({});
    try {
      // Try to generate quiz first (will return cached if already exists)
      await api.post(`/scholarly-articles/article/${encodeURIComponent(article.doi)}/generate-quiz`, {}, { timeout: 120000 });
      // Then fetch the quiz
      const { data } = await api.get(`/scholarly-articles/article/${encodeURIComponent(article.doi)}/quiz`);
      setQuizQuestions(data.questions);
    } catch (err) {
      console.error('Quiz load failed:', err);
      setQuizQuestions([]);
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!quizArticle) return;
    setSubmittingQuiz(true);
    try {
      const { data } = await api.post(`/scholarly-articles/article/${encodeURIComponent(quizArticle.doi)}/quiz/submit`, {
        answers: quizAnswers,
        timeSpent: 0
      });
      setQuizResult(data);
      loadStats();
      if (activeTab === 'library') loadMyArticles();
    } catch (err) {
      console.error('Quiz submit failed:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const closeQuiz = () => {
    setQuizArticle(null);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown authors';
    if (authors.length <= 3) return authors.map(a => `${a.family}, ${a.given?.[0] || ''}.`).join(', ');
    return `${authors[0].family}, ${authors[0].given?.[0] || ''}. et al.`;
  };

  const formatYear = (date) => {
    if (!date) return 'n.d.';
    return new Date(date).getFullYear();
  };

  const tabs = [
    { id: 'search', label: 'Search Articles', icon: Search },
    { id: 'library', label: 'My Library', icon: BookOpen },
    { id: 'completed', label: 'Completed', icon: Award },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Scholarly Articles</h1>
      <p className="text-gray-500 mb-6">Search peer-reviewed counseling research, read articles, and earn CE credit by passing quizzes on what you've read.</p>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-burgundy-50 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-burgundy-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSaved}</p>
                <p className="text-xs text-gray-500">Saved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRead}</p>
                <p className="text-xs text-gray-500">Read</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzesPassed}</p>
                <p className="text-xs text-gray-500">Quizzes Passed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCEHours}</p>
                <p className="text-xs text-gray-500">CE Hours Earned</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-burgundy-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles... (e.g., CBT for anxiety, multicultural counseling, group therapy outcomes)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={searching || !searchQuery.trim()}
              className="px-6 py-3 bg-burgundy-700 text-white rounded-xl hover:bg-burgundy-800 disabled:opacity-50 text-sm font-medium"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{searchError}</p>
            </div>
          )}

          {searchResults.length === 0 && !searching && searchQuery && (
            <div className="bg-white rounded-xl border p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No Results Found</h2>
              <p className="text-gray-500">Try different keywords or broader search terms.</p>
            </div>
          )}

          {searchResults.length === 0 && !searchQuery && (
            <div className="bg-white rounded-xl border p-12 text-center">
              <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Search Scholarly Articles</h2>
              <p className="text-gray-500 mb-2">Search millions of peer-reviewed articles from CrossRef.</p>
              <p className="text-gray-400 text-sm">Save articles, read them, then take an AI-generated quiz to earn 0.5 CE hours each.</p>
            </div>
          )}

          <div className="space-y-3">
            {searchResults.map((article) => (
              <ArticleCard
                key={article.doi}
                article={article}
                expanded={expandedArticle === article.doi}
                onToggle={() => setExpandedArticle(expandedArticle === article.doi ? null : article.doi)}
                onSave={() => saveArticle(article.doi)}
                onUnsave={() => unsaveArticle(article.doi)}
                onStartQuiz={() => startQuiz(article)}
                saving={savingDoi === article.doi}
                showSaveButton
              />
            ))}
          </div>

          {searchResults.length > 0 && searchResults.length < totalResults && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={searching}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {searching ? 'Loading...' : `Load more (${searchResults.length} of ${totalResults.toLocaleString()})`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div>
          {loadingLibrary ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700"></div>
            </div>
          ) : myArticles.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No Saved Articles</h2>
              <p className="text-gray-500 mb-4">Search for articles and save them to your library.</p>
              <button onClick={() => setActiveTab('search')} className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">
                Search Articles
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myArticles.map((item) => (
                <ArticleCard
                  key={item.doi}
                  article={item.article || item.articleId}
                  progress={item}
                  expanded={expandedArticle === item.doi}
                  onToggle={() => setExpandedArticle(expandedArticle === item.doi ? null : item.doi)}
                  onUnsave={() => unsaveArticle(item.doi)}
                  onMarkRead={() => markAsRead(item.doi)}
                  onStartQuiz={() => startQuiz(item.article || item.articleId)}
                  showProgress
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === 'completed' && (
        <div>
          <CompletedTab />
        </div>
      )}

      {/* Quiz Modal */}
      {quizArticle && (
        <QuizModal
          article={quizArticle}
          questions={quizQuestions}
          answers={quizAnswers}
          setAnswers={setQuizAnswers}
          result={quizResult}
          loading={quizLoading}
          submitting={submittingQuiz}
          onSubmit={submitQuiz}
          onClose={closeQuiz}
        />
      )}
    </div>
  );
}

// ─── Article Card Component ──
function ArticleCard({ article, progress, expanded, onToggle, onSave, onUnsave, onMarkRead, onStartQuiz, saving, showSaveButton, showProgress }) {
  if (!article) return null;

  const authors = formatAuthorsShort(article.authors);
  const year = article.publishedDate ? new Date(article.publishedDate).getFullYear() : 'n.d.';
  const isSaved = progress?.status || article?.userStatus;
  const quizPassed = progress?.quizPassed || article?.quizPassed;

  return (
    <div className="bg-white rounded-xl border hover:border-gray-400 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <button onClick={onToggle} className="text-left w-full group">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-burgundy-700 transition-colors leading-snug">
                {article.title}
              </h3>
            </button>
            <p className="text-xs text-gray-500 mt-1">{authors} ({year})</p>
            {article.journal && (
              <p className="text-xs text-gray-400 italic mt-0.5">{article.journal}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {article.nbccContentArea && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-burgundy-50 text-burgundy-700">
                  {CONTENT_AREA_LABELS[article.nbccContentArea] || article.nbccContentArea}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                + Research
              </span>
              {quizPassed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3" /> Quiz Passed
                </span>
              )}
              {showProgress && progress?.status === 'read' && !quizPassed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700">
                  Read — Quiz Available
                </span>
              )}
              {showProgress && progress?.status === 'saved' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  Saved
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {showSaveButton && !isSaved && (
              <button
                onClick={onSave}
                disabled={saving}
                className="p-2 text-gray-400 hover:text-burgundy-700 rounded-lg hover:bg-burgundy-50 transition-colors"
                title="Save to library"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookmarkPlus className="w-5 h-5" />}
              </button>
            )}
            {isSaved && onUnsave && (
              <button
                onClick={onUnsave}
                className="p-2 text-burgundy-700 hover:text-burgundy-800 rounded-lg hover:bg-burgundy-50 transition-colors"
                title="Remove from library"
              >
                <Bookmark className="w-5 h-5 fill-current" />
              </button>
            )}
            <button onClick={onToggle} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-4 py-4 bg-gray-50 rounded-b-xl">
          {article.abstract && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Abstract</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{article.abstract}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
            {article.volume && <span>Vol. {article.volume}</span>}
            {article.issue && <span>Issue {article.issue}</span>}
            {article.pages && <span>pp. {article.pages}</span>}
            {article.doi && <span>DOI: {article.doi}</span>}
          </div>
          <div className="flex items-center gap-3">
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-burgundy-700 border border-burgundy-200 rounded-lg hover:bg-burgundy-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Read Article
              </a>
            )}
            {onMarkRead && !quizPassed && progress?.status !== 'read' && progress?.status !== 'quiz_passed' && (
              <button
                onClick={onMarkRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Mark as Read
              </button>
            )}
            {!quizPassed && (
              <button
                onClick={onStartQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
              >
                <GraduationCap className="w-4 h-4" /> Take Quiz (0.5 CE)
              </button>
            )}
            {quizPassed && progress?.ceHoursEarned > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 bg-green-50 rounded-lg">
                <Award className="w-4 h-4" /> {progress.ceHoursEarned} CE Hours Earned
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Completed Articles Tab ──
function CompletedTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/scholarly-articles/my-articles', {
          params: { status: 'quiz_passed' }
        });
        setArticles(data.articles);
      } catch (err) {
        console.error('Failed to load completed articles:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700"></div></div>;

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-12 text-center">
        <Award className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">No Completed Quizzes Yet</h2>
        <p className="text-gray-500">Read an article and pass its quiz to earn CE hours.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((item) => {
        const article = item.article || item.articleId;
        if (!article) return null;
        return (
          <div key={item.doi} className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatAuthorsShort(article.authors)} ({article.publishedDate ? new Date(article.publishedDate).getFullYear() : 'n.d.'})
                </p>
                {article.journal && <p className="text-xs text-gray-400 italic">{article.journal}</p>}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-700">{item.ceHoursEarned} CE hrs</p>
                  <p className="text-xs text-gray-400">Score: {item.bestQuizScore}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-burgundy-50 text-burgundy-700">
                {CONTENT_AREA_LABELS[item.nbccContentArea] || item.nbccContentArea}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                + Research
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Quiz Modal Component ──
function QuizModal({ article, questions, answers, setAnswers, result, loading, submitting, onSubmit, onClose }) {
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Article Quiz</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{article.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-burgundy-700 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Generating quiz questions from article...</p>
              <p className="text-xs text-gray-400 mt-1">This may take a moment on first attempt</p>
            </div>
          )}

          {!loading && questions.length === 0 && !result && (
            <div className="text-center py-12">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Unable to generate quiz for this article.</p>
              <p className="text-xs text-gray-400 mt-1">The article may lack sufficient abstract data.</p>
            </div>
          )}

          {/* Quiz Result */}
          {result && (
            <div className={`rounded-xl p-6 mb-6 ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="text-center">
                {result.passed ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {result.passed ? 'Quiz Passed!' : 'Not Quite — Try Again'}
                </h3>
                <p className="text-lg font-semibold text-gray-700">
                  Score: {result.score}% ({result.correct}/{result.totalQuestions})
                </p>
                {result.passed && result.ceHoursEarned > 0 && (
                  <p className="text-sm text-green-700 mt-2 font-medium">
                    +{result.ceHoursEarned} CE hours earned and certificate issued!
                  </p>
                )}
                {!result.passed && (
                  <p className="text-sm text-amber-700 mt-2">You need 80% to pass. Review the explanations below and try again.</p>
                )}
              </div>
            </div>
          )}

          {/* Questions */}
          {!loading && questions.length > 0 && (
            <div className="space-y-6">
              {questions.map((q, i) => {
                const questionResult = result?.questionResults?.find(r => r.questionId === q._id);
                return (
                  <div key={q._id || i} className="border rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      <span className="text-burgundy-700 mr-2">Q{i + 1}.</span>
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, j) => {
                        const isSelected = answers[q._id] === j;
                        const showResult = !!result;
                        const isCorrect = questionResult?.correctAnswer === j;
                        const isWrong = showResult && isSelected && !isCorrect;

                        let optionClass = 'border-gray-200 hover:border-burgundy-300';
                        if (isSelected && !showResult) optionClass = 'border-burgundy-500 bg-burgundy-50';
                        if (showResult && isCorrect) optionClass = 'border-green-500 bg-green-50';
                        if (isWrong) optionClass = 'border-red-400 bg-red-50';

                        return (
                          <button
                            key={j}
                            onClick={() => !result && setAnswers({ ...answers, [q._id]: j })}
                            disabled={!!result}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${optionClass}`}
                          >
                            <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + j)}.</span>
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                    {questionResult?.explanation && (
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">
                        <span className="font-semibold">Explanation:</span> {questionResult.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && questions.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 rounded-b-2xl flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {Object.keys(answers).length}/{questions.length} answered
            </p>
            <div className="flex gap-3">
              {result && !result.passed && (
                <button
                  onClick={() => { setAnswers({}); setQuizQuestions(questions); }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Retry Quiz
                </button>
              )}
              {!result && (
                <button
                  onClick={onSubmit}
                  disabled={!allAnswered || submitting}
                  className="px-6 py-2 text-sm bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Answers'}
                </button>
              )}
              {result && result.passed && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatAuthorsShort(authors) {
  if (!authors || authors.length === 0) return 'Unknown authors';
  if (authors.length <= 3) return authors.map(a => `${a.family || ''}, ${(a.given || '')[0] || ''}.`).join(', ');
  return `${authors[0].family || ''}, ${(authors[0].given || '')[0] || ''}. et al.`;
}
