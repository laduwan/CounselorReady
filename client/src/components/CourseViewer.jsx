import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Menu, X, BookOpen, Clock, Award, 
  CheckCircle2, Circle, Play, Lock, AlertCircle, Download,
  BarChart3, Home, Settings, LogOut, User, Type, Eye, Volume2
} from 'lucide-react';
import { safeHTML } from '../utils/sanitize';
import {
  Accordion,
  MatchingExercise,
  MultipleChoice,
  MultiSelect,
  ImageTextCard,
  SectionDivider,
  TimedAssessment,
  ProgressTracker,
  CardSort,
  Sequencing,
  Hotspot,
  Timeline,
  ScenarioTree,
  FlashcardDeck,
  VideoEmbed,
  ImageBlock
} from './InteractiveCourseComponents';

// ============================================================================
// API SERVICE
// ============================================================================
const API_BASE = '/api/interactive-courses';

const api = {
  async getCourse(slug) {
    const res = await fetch(`${API_BASE}/slug/${slug}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Course not found');
    return res.json();
  },
  
  async getProgress(slug) {
    const res = await fetch(`${API_BASE}/${slug}/progress`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  },

  async updateSectionProgress(slug, sectionIndex, data) {
    const res = await fetch(`${API_BASE}/${slug}/sections/${sectionIndex}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  },

  async submitSectionQuiz(slug, sectionIndex, answers, timeSpent) {
    const res = await fetch(`${API_BASE}/${slug}/sections/${sectionIndex}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ answers, timeSpent })
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  async submitAssessment(slug, answers, timeUsed, questionOrder) {
    const res = await fetch(`${API_BASE}/${slug}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ answers, timeUsed, questionOrder })
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  },

  async logInteraction(slug, interaction) {
    try {
      await fetch(`${API_BASE}/${slug}/interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(interaction)
      });
    } catch (err) {
      console.error('Failed to log interaction:', err);
    }
  }
};

// ============================================================================
// ACCESSIBILITY TOOLBAR
// ============================================================================
function AccessibilityToolbar({ settings, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-navy-500 hover:text-burgundy-700 hover:bg-burgundy-50 rounded-lg transition-colors"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
        title="Accessibility Options"
      >
        <Eye className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div 
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-50 p-4"
            role="dialog"
            aria-label="Accessibility settings"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-700 text-sm">Accessibility Options</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-navy-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <label className="text-sm font-medium text-navy-600 mb-2 block">
                <Type className="w-4 h-4 inline mr-1" />
                Text Size
              </label>
              <div className="flex gap-2">
                {[
                  { label: 'A', value: 'normal', size: 'text-sm' },
                  { label: 'A', value: 'large', size: 'text-base' },
                  { label: 'A', value: 'x-large', size: 'text-lg' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ ...settings, fontSize: opt.value })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${opt.size} ${
                      settings.fontSize === opt.value
                        ? 'bg-burgundy-800 text-white'
                        : 'bg-slate-100 text-navy-600 hover:bg-slate-200'
                    }`}
                    aria-label={`${opt.value} text size`}
                    aria-pressed={settings.fontSize === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="mb-4">
              <button
                onClick={() => onUpdate({ ...settings, highContrast: !settings.highContrast })}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  settings.highContrast
                    ? 'bg-navy-800 text-white'
                    : 'bg-slate-100 text-navy-600 hover:bg-slate-200'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  High Contrast
                </span>
                <span className={`w-9 h-5 rounded-full relative transition-colors ${
                  settings.highContrast ? 'bg-hunter-600' : 'bg-slate-300'
                }`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'left-4' : 'left-0.5'
                  }`} />
                </span>
              </button>
            </div>

            {/* Narration / Read Aloud */}
            <div className="mb-2">
              <button
                onClick={() => onUpdate({ ...settings, narration: !settings.narration })}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  settings.narration
                    ? 'bg-navy-800 text-white'
                    : 'bg-slate-100 text-navy-600 hover:bg-slate-200'
                }`}
                role="switch"
                aria-checked={settings.narration}
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Read Aloud (TTS)
                </span>
                <span className={`w-9 h-5 rounded-full relative transition-colors ${
                  settings.narration ? 'bg-hunter-600' : 'bg-slate-300'
                }`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.narration ? 'left-4' : 'left-0.5'
                  }`} />
                </span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
              Settings apply to this session only.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// CONTENT BLOCK RENDERER
// ============================================================================
function ContentBlockRenderer({ 
  block, 
  blockIndex, 
  sectionIndex,
  courseSlug,
  onComplete,
  isCompleted,
  a11y
}) {
  const handleInteractionComplete = useCallback((isCorrect, score) => {
    api.logInteraction(courseSlug, {
      sectionIndex,
      blockIndex,
      blockType: block.type,
      action: 'complete',
      isCorrect,
      score
    });
    onComplete(blockIndex, isCorrect);
  }, [courseSlug, sectionIndex, blockIndex, block.type, onComplete]);

  // TTS: read aloud text content when narration enabled
  const speakText = useCallback((text) => {
    if (!a11y?.narration || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [a11y?.narration]);

  // Font size class
  const textSizeClass = a11y?.fontSize === 'x-large' ? 'text-lg' : a11y?.fontSize === 'large' ? 'text-base' : 'text-sm';
  const proseSize = a11y?.fontSize === 'x-large' ? 'prose-lg' : a11y?.fontSize === 'large' ? 'prose-base' : 'prose';

  switch (block.type) {
    case 'accordion':
      return (
        <Accordion 
          items={block.accordionItems} 
          allowMultiple={true}
        />
      );

    case 'matching':
      return (
        <MatchingExercise
          pairs={block.matchingPairs}
          instructions={block.matchingInstructions}
          onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
        />
      );

    case 'multipleChoice':
      return (
        <MultipleChoice
          question={block.question}
          options={block.options}
          explanation={block.explanation}
          onAnswer={(isCorrect) => handleInteractionComplete(isCorrect, isCorrect ? 1 : 0)}
        />
      );

    case 'multiSelect':
      return (
        <MultiSelect
          question={block.question}
          options={block.options}
          explanation={block.explanation}
          onAnswer={(isCorrect) => handleInteractionComplete(isCorrect, isCorrect ? 1 : 0)}
        />
      );

    case 'imageText':
      return (
        <ImageTextCard
          image={block.image}
          imageAlt={block.imageAlt}
          title={block.title}
          content={block.content}
          imagePosition={block.imagePosition}
          highlight={block.highlight}
        />
      );

    case 'sectionDivider':
      return (
        <SectionDivider
          sectionNumber={block.sectionNumber}
          title={block.title}
          subtitle={block.subtitle}
        />
      );

    case 'text':
      return (
        <div className={`${proseSize} prose-slate max-w-none`}>
          {a11y?.narration && (
            <button 
              onClick={() => speakText(block.textContent || block.content || '')}
              className="mb-2 flex items-center gap-1.5 text-xs font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors"
              aria-label="Read this section aloud"
            >
              <Volume2 className="w-3.5 h-3.5" /> Read Aloud
            </button>
          )}
          <div dangerouslySetInnerHTML={{ __html: safeHTML(block.textContent || block.content || '') }} />
        </div>
      );

    case 'video':
      return (
        <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden">
          <video 
            src={block.videoUrl} 
            controls 
            className="w-full h-full"
          />
        </div>
      );

    case 'cardSort':
      return (
        <CardSort
          categories={block.categories}
          cards={block.cards}
          instructions={block.instructions}
          explanation={block.explanation}
          onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
        />
      );

    case 'sequencing':
      return (
        <Sequencing
          steps={block.steps}
          instructions={block.instructions}
          explanation={block.explanation}
          onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
        />
      );

    case 'hotspot':
      return (
        <Hotspot
          hotspots={block.hotspots}
          hotspotImage={block.hotspotImage}
          imageDescription={block.imageDescription}
          instructions={block.instructions}
          onComplete={(count) => handleInteractionComplete(true, 1)}
        />
      );

    case 'timeline':
      return (
        <Timeline
          events={block.events}
          instructions={block.instructions}
          onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
        />
      );

    case 'scenarioTree':
      return (
        <ScenarioTree
          scenarioTitle={block.scenarioTitle}
          startNode={block.startNode}
          nodes={block.nodes}
          onComplete={() => handleInteractionComplete(true, 1)}
        />
      );

    case 'flashcardDeck':
      return (
        <FlashcardDeck
          flashcards={block.flashcards}
          instructions={block.instructions}
          onComplete={(count) => handleInteractionComplete(true, 1)}
        />
      );

    case 'videoEmbed':
      return (
        <VideoEmbed
          videoUrl={block.videoUrl}
          videoTitle={block.videoTitle}
          videoDuration={block.videoDuration}
          markers={block.markers}
          onComplete={() => handleInteractionComplete(true, 1)}
        />
      );

    case 'image':
      return (
        <ImageBlock
          imageUrl={block.imageUrl}
          imageAltText={block.imageAltText}
          imageCaption={block.imageCaption}
          imageSize={block.imageSize}
          imageAlignment={block.imageAlignment}
          onComplete={() => handleInteractionComplete(true, 1)}
        />
      );

    case 'reflection':
      return (
        <div style={{ background: '#F2F7F3', borderRadius: 16, padding: 24, border: '1px solid rgba(74,124,89,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>💭</span>
            <h3 style={{ fontWeight: 700, color: '#34495E', margin: 0 }}>Reflection</h3>
          </div>
          <p style={{ color: '#34495E', fontWeight: 600, marginBottom: 12 }}>{block.question}</p>
          <textarea
            placeholder="Take a moment to reflect and write your thoughts here..."
            aria-label={`Reflection: ${block.question}`}
            style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 10, border: '1px solid #E8E4DF', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            onChange={(e) => {
              if (e.target.value.length >= (block.minLength || 50)) {
                handleInteractionComplete(true, 1);
              }
            }}
          />
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
            Minimum {block.minLength || 50} characters to complete
          </p>
        </div>
      );

    case 'resources':
      return (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E8E4DF' }}>
          <h3 style={{ fontWeight: 700, color: '#34495E', marginBottom: 16 }}>📎 Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(block.resources || []).map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: '#F7F5F2', textDecoration: 'none', color: '#34495E', border: '1px solid #E8E4DF' }}>
                <span>{r.type === 'pdf' ? '📄' : r.type === 'video' ? '🎬' : '🔗'}</span>
                <span style={{ fontWeight: 600 }}>{r.title}</span>
              </a>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-honey-50 border border-honey-300 rounded-lg">
          <p className="text-honey-700">Unknown content type: {block.type}</p>
        </div>
      );
  }
}

// ============================================================================
// SECTION VIEW
// ============================================================================
function SectionView({ 
  course, 
  section, 
  sectionIndex,
  progress,
  onNavigate,
  onProgressUpdate,
  a11y
}) {
  const [viewedBlocks, setViewedBlocks] = useState(new Set(progress?.viewedBlocks || []));
  const [completedBlocks, setCompletedBlocks] = useState(new Set(progress?.completedBlocks || []));
  const [showQuiz, setShowQuiz] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Track block views via intersection observer
  const observerRef = React.useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockIndex = parseInt(entry.target.dataset.blockIndex);
            if (!isNaN(blockIndex)) {
              setViewedBlocks(prev => new Set([...prev, blockIndex]));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  // Save progress on unmount or section change
  useEffect(() => {
    return () => {
      const timeSpent = Math.round((Date.now() - sessionStartTime) / 1000);
      api.updateSectionProgress(course.slug, sectionIndex, {
        viewedBlocks: Array.from(viewedBlocks),
        completedBlocks: Array.from(completedBlocks),
        timeSpent
      }).then(onProgressUpdate).catch(console.error);
    };
  }, [viewedBlocks, completedBlocks]);

  const handleBlockComplete = useCallback((blockIndex, isCorrect) => {
    if (isCorrect) {
      setCompletedBlocks(prev => new Set([...prev, blockIndex]));
    }
  }, []);

  const interactiveBlockCount = section.contentBlocks.filter(
    b => ['matching', 'multipleChoice', 'multiSelect'].includes(b.type)
  ).length;

  const allInteractiveComplete = section.contentBlocks.every((block, i) => {
    if (!['matching', 'multipleChoice', 'multiSelect'].includes(block.type)) return true;
    return completedBlocks.has(i);
  });

  const canTakeQuiz = section.hasQuiz && viewedBlocks.size >= section.contentBlocks.length && allInteractiveComplete;
  const quizPassed = progress?.quizPassed;

  const isLastSection = sectionIndex === course.sections.length - 1;
  const canProceed = !section.hasQuiz || quizPassed;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 text-sm text-navy-500 mb-2">
          <span>Section {sectionIndex + 1} of {course.sections.length}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {section.estimatedTime} min
          </span>
        </div>
        <h1 className="text-3xl font-bold text-navy-700">{section.title}</h1>
        {section.description && (
          <p className="text-navy-500 mt-2">{section.description}</p>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-navy-600">Section Progress</span>
          <span className="font-semibold text-burgundy-700">
            {viewedBlocks.size}/{section.contentBlocks.length} viewed
            {interactiveBlockCount > 0 && ` • ${completedBlocks.size}/${interactiveBlockCount} completed`}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-burgundy-700 transition-all rounded-full"
            style={{ width: `${(viewedBlocks.size / section.contentBlocks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content Blocks */}
      {!showQuiz ? (
        <div className="space-y-8">
          {section.contentBlocks.map((block, index) => (
            <div 
              key={index}
              data-block-index={index}
              ref={(el) => el && observerRef.current?.observe(el)}
              className="animate-fadeIn"
            >
              <ContentBlockRenderer
                block={block}
                blockIndex={index}
                sectionIndex={sectionIndex}
                courseSlug={course.slug}
                onComplete={handleBlockComplete}
                isCompleted={completedBlocks.has(index)}
                a11y={a11y}
              />
            </div>
          ))}

          {/* Section Quiz CTA */}
          {section.hasQuiz && !quizPassed && (
            <div className="bg-hunter-50 border border-hunter-200 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-navy-700 mb-2">Section Quiz</h3>
              <p className="text-navy-500 mb-4">
                Complete all content and activities above to unlock the section quiz.
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                disabled={!canTakeQuiz}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  canTakeQuiz
                    ? 'bg-hunter-600 hover:bg-hunter-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canTakeQuiz ? 'Take Quiz' : `Complete all content first (${viewedBlocks.size}/${section.contentBlocks.length})`}
              </button>
            </div>
          )}

          {quizPassed && (
            <div className="bg-hunter-50 border border-hunter-200 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-hunter-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-hunter-700 mb-2">Section Complete!</h3>
              <p className="text-hunter-600">You passed the section quiz.</p>
            </div>
          )}
        </div>
      ) : (
        <SectionQuiz
          section={section}
          courseSlug={course.slug}
          sectionIndex={sectionIndex}
          onComplete={(results) => {
            if (results.passed) {
              onProgressUpdate();
            }
            setShowQuiz(false);
          }}
          onBack={() => setShowQuiz(false)}
        />
      )}

      {/* Navigation */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => onNavigate(sectionIndex - 1)}
          disabled={sectionIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            sectionIndex === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-navy-600 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {isLastSection && canProceed ? (
          <button
            onClick={() => onNavigate('assessment')}
            className="flex items-center gap-2 px-6 py-3 bg-hunter-600 hover:bg-hunter-700 text-white font-semibold rounded-xl transition-colors"
          >
            Take Final Assessment
            <Award className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate(sectionIndex + 1)}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              canProceed
                ? 'bg-burgundy-800 hover:bg-burgundy-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? 'Next Section' : 'Complete quiz to continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SECTION QUIZ
// ============================================================================
function SectionQuiz({ section, courseSlug, sectionIndex, onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime] = useState(Date.now());

  const handleSubmit = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    try {
      const result = await api.submitSectionQuiz(courseSlug, sectionIndex, answers, timeSpent);
      setResults(result);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (submitted && results) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          results.passed ? 'bg-hunter-100' : 'bg-honey-100'
        }`}>
          {results.passed ? (
            <CheckCircle2 className="w-10 h-10 text-hunter-600" />
          ) : (
            <AlertCircle className="w-10 h-10 text-honey-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-navy-700 mb-2">
          {results.passed ? 'Quiz Passed!' : 'Keep Trying!'}
        </h2>
        <p className="text-navy-500 mb-4">
          You scored {results.score}/{results.totalQuestions} ({results.percentage}%)
        </p>
        <p className="text-sm text-navy-400 mb-6">
          {results.passed 
            ? 'You can now proceed to the next section.'
            : `You need ${Math.round(section.quizPassThreshold * 100)}% to pass.`}
        </p>
        <button
          onClick={() => onComplete(results)}
          className={`px-6 py-3 rounded-xl font-semibold ${
            results.passed
              ? 'bg-hunter-600 hover:bg-hunter-700 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-navy-600'
          }`}
        >
          {results.passed ? 'Continue' : 'Review Content & Retry'}
        </button>
      </div>
    );
  }

  const question = section.quizQuestions[currentQuestion];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-burgundy-800 px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-bold">Section Quiz</h3>
        <span className="text-burgundy-200 text-sm">
          Question {currentQuestion + 1} of {section.quizQuestions.length}
        </span>
      </div>

      <div className="p-6">
        <p className="text-lg text-navy-700 font-medium mb-6">{question.question}</p>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: index }))}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                answers[currentQuestion] === index
                  ? 'bg-burgundy-50 border-burgundy-500'
                  : 'bg-slate-50 border-slate-200 hover:border-burgundy-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                answers[currentQuestion] === index
                  ? 'bg-burgundy-700 border-burgundy-700 text-white'
                  : 'border-slate-300'
              }`}>
                {answers[currentQuestion] === index && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <span className="text-navy-600">{option.text}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={onBack}
            className="text-navy-500 hover:text-navy-700"
          >
            ← Back to Content
          </button>

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="px-4 py-2 text-navy-600 hover:bg-slate-100 rounded-lg"
              >
                Previous
              </button>
            )}
            
            {currentQuestion < section.quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={answers[currentQuestion] === undefined}
                className={`px-4 py-2 rounded-lg ${
                  answers[currentQuestion] !== undefined
                    ? 'bg-burgundy-800 hover:bg-burgundy-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < section.quizQuestions.length}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  Object.keys(answers).length >= section.quizQuestions.length
                    ? 'bg-hunter-600 hover:bg-hunter-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FINAL ASSESSMENT VIEW
// ============================================================================
function AssessmentView({ course, progress, onComplete, onBack }) {
  const [assessmentResults, setAssessmentResults] = useState(null);

  const handleAssessmentComplete = async (results) => {
    try {
      const serverResults = await api.submitAssessment(
        course.slug,
        results.answers || {},
        results.timeUsed,
        results.questionOrder
      );
      setAssessmentResults(serverResults);
      if (serverResults.courseCompleted) {
        onComplete(serverResults);
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  };

  if (assessmentResults?.passed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 rounded-full bg-hunter-100 flex items-center justify-center mx-auto mb-6">
          <Award className="w-12 h-12 text-hunter-600" />
        </div>
        <h1 className="text-3xl font-bold text-navy-700 mb-4">Congratulations!</h1>
        <p className="text-xl text-navy-500 mb-2">You've completed {course.title}</p>
        <p className="text-navy-400 mb-8">
          Final Score: {assessmentResults.score}/{assessmentResults.totalQuestions} ({assessmentResults.percentage}%)
        </p>
        
        {assessmentResults.certificateId && (
          <a
            href={`/api/certificates/${assessmentResults.certificateId}/download`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-800 hover:bg-burgundy-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </a>
        )}
        
        <div className="mt-6">
          <p className="text-sm text-navy-400">
            {course.ceHours} CE Hours • {course.ceProvider}
          </p>
        </div>
      </div>
    );
  }

  if (assessmentResults && !assessmentResults.passed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 rounded-full bg-honey-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-honey-600" />
        </div>
        <h1 className="text-3xl font-bold text-navy-700 mb-4">Not Quite!</h1>
        <p className="text-xl text-navy-500 mb-2">
          You scored {assessmentResults.percentage}%
        </p>
        <p className="text-navy-400 mb-4">
          You need {Math.round(course.assessment.passThreshold * 100)}% to pass.
        </p>
        <p className="text-honey-600 font-medium mb-8">
          {assessmentResults.attemptsRemaining} attempts remaining
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-navy-600 font-semibold rounded-xl transition-colors"
          >
            Review Content
          </button>
          {assessmentResults.attemptsRemaining > 0 && (
            <button
              onClick={() => setAssessmentResults(null)}
              className="px-6 py-3 bg-burgundy-800 hover:bg-burgundy-700 text-white font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-navy-500 hover:text-navy-700 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Course
        </button>
      </div>
      
      <TimedAssessment
        title={course.assessment.title}
        questions={course.assessment.questions}
        timeLimit={course.assessment.timeLimit}
        passThreshold={course.assessment.passThreshold}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
}

// ============================================================================
// SIDEBAR
// ============================================================================
function CourseSidebar({ 
  course, 
  progress, 
  currentView,
  onNavigate,
  isOpen,
  onClose 
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-slate-200 z-50
        transform transition-transform duration-300
        lg:relative lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-navy-700 line-clamp-2">{course.title}</h2>
              <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-navy-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.round(course.totalEstimatedTime / 60)}h
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {course.ceHours} CE
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-navy-600">Progress</span>
              <span className="font-bold text-burgundy-700">{progress?.overallProgress || 0}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-burgundy-700 transition-all rounded-full"
                style={{ width: `${progress?.overallProgress || 0}%` }}
              />
            </div>
          </div>

          {/* Sections */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Course sections">
            <ul className="space-y-2">
              {course.sections.map((section, index) => {
                const sectionProgress = progress?.sectionProgress?.[index];
                const isCompleted = sectionProgress?.status === 'completed';
                const isCurrent = currentView === 'section' && progress?.currentSectionIndex === index;
                const isLocked = index > 0 && progress?.sectionProgress?.[index - 1]?.status !== 'completed';

                return (
                  <li key={index}>
                    <button
                      onClick={() => !isLocked && onNavigate(index)}
                      disabled={isLocked}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-burgundy-50 text-burgundy-800'
                          : isLocked
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-navy-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-hunter-600 text-white'
                          : isCurrent
                            ? 'bg-burgundy-700 text-white'
                            : isLocked
                              ? 'bg-slate-100 text-slate-300'
                              : 'bg-slate-200 text-navy-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isLocked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <span className="text-xs font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium line-clamp-2">{section.title}</span>
                    </button>
                  </li>
                );
              })}

              {/* Final Assessment */}
              <li className="pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={() => onNavigate('assessment')}
                  disabled={!progress?.sectionProgress?.every(s => s.status === 'completed')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    currentView === 'assessment'
                      ? 'bg-hunter-50 text-hunter-700'
                      : progress?.sectionProgress?.every(s => s.status === 'completed')
                        ? 'text-navy-600 hover:bg-slate-50'
                        : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    currentView === 'assessment'
                      ? 'bg-hunter-600 text-white'
                      : progress?.sectionProgress?.every(s => s.status === 'completed')
                        ? 'bg-honey-400 text-white'
                        : 'bg-slate-100 text-slate-300'
                  }`}>
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium">Final Assessment</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// MAIN COURSE VIEWER
// ============================================================================
export default function CourseViewer({ courseSlug }) {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('section'); // 'section' | 'assessment'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [a11y, setA11y] = useState({
    fontSize: 'normal',
    highContrast: false,
    narration: false,
  });

  useEffect(() => {
    async function loadCourse() {
      try {
        const [courseData, progressData] = await Promise.all([
          api.getCourse(courseSlug),
          api.getProgress(courseSlug)
        ]);
        setCourse(courseData);
        setProgress(progressData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseSlug]);

  // Stop TTS on cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const refreshProgress = useCallback(async () => {
    try {
      const progressData = await api.getProgress(courseSlug);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to refresh progress:', err);
    }
  }, [courseSlug]);

  const handleNavigate = useCallback((target) => {
    if (target === 'assessment') {
      setCurrentView('assessment');
    } else if (typeof target === 'number') {
      setProgress(prev => ({ ...prev, currentSectionIndex: target }));
      setCurrentView('section');
    }
    setSidebarOpen(false);
  }, []);

  // Accessibility: font size class for main content area
  const fontSizeClass = a11y.fontSize === 'x-large' ? 'text-lg' : a11y.fontSize === 'large' ? 'text-base' : 'text-sm';
  const hcClass = a11y.highContrast ? 'high-contrast' : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-700 mb-2">Error Loading Course</h2>
          <p className="text-navy-500">{error}</p>
        </div>
      </div>
    );
  }

  const currentSection = course.sections[progress?.currentSectionIndex || 0];
  const currentSectionProgress = progress?.sectionProgress?.[progress?.currentSectionIndex || 0];

  return (
    <div className={`min-h-screen bg-slate-50 flex ${hcClass}`}>
      {/* Skip to content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-burgundy-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <CourseSidebar
        course={course}
        progress={progress}
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0" id="main-content">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-navy-600 hover:text-navy-800"
            aria-label="Open course navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 lg:hidden text-center">
            <span className="font-medium text-navy-700 text-sm">
              {currentView === 'assessment' ? 'Final Assessment' : currentSection?.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <AccessibilityToolbar settings={a11y} onUpdate={setA11y} />
            <a href="/dashboard" className="p-2 text-navy-400 hover:text-navy-600" aria-label="Return to dashboard">
              <Home className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Content */}
        <div className={`p-6 lg:p-8 ${fontSizeClass}`}>
          {currentView === 'assessment' ? (
            <AssessmentView
              course={course}
              progress={progress}
              onComplete={refreshProgress}
              onBack={() => handleNavigate(course.sections.length - 1)}
            />
          ) : (
            <SectionView
              course={course}
              section={currentSection}
              sectionIndex={progress?.currentSectionIndex || 0}
              progress={currentSectionProgress}
              onNavigate={handleNavigate}
              onProgressUpdate={refreshProgress}
              a11y={a11y}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Animation + High Contrast styles
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .animate-fadeIn { animation: none; }
}

/* High Contrast Mode */
.high-contrast {
  --hc-text: #000;
  --hc-bg: #fff;
  --hc-border: #000;
}
.high-contrast * {
  border-color: #333 !important;
}
.high-contrast p,
.high-contrast span,
.high-contrast li,
.high-contrast td,
.high-contrast th,
.high-contrast label {
  color: #000 !important;
}
.high-contrast h1,
.high-contrast h2,
.high-contrast h3,
.high-contrast h4 {
  color: #000 !important;
}
.high-contrast .prose * {
  color: #000 !important;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
