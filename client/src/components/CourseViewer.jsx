/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
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
  ImageBlock,
  KnowledgeCheckModal
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
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-forest-200 z-50 p-4"
            role="dialog"
            aria-label="Accessibility settings"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-700 text-sm">Accessibility Options</h3>
              <button onClick={() => setIsOpen(false)} className="text-forest-400 hover:text-navy-600">
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
                        : 'bg-stone-100 text-navy-600 hover:bg-stone-200'
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
                    : 'bg-stone-100 text-navy-600 hover:bg-stone-200'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  High Contrast
                </span>
                <span className={`w-9 h-5 rounded-full relative transition-colors ${
                  settings.highContrast ? 'bg-hunter-600' : 'bg-forest-200'
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
                    : 'bg-stone-100 text-navy-600 hover:bg-stone-200'
                }`}
                role="switch"
                aria-checked={settings.narration}
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Read Aloud (TTS)
                </span>
                <span className={`w-9 h-5 rounded-full relative transition-colors ${
                  settings.narration ? 'bg-hunter-600' : 'bg-forest-200'
                }`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.narration ? 'left-4' : 'left-0.5'
                  }`} />
                </span>
              </button>
            </div>

            <p className="text-xs text-forest-400 mt-3 pt-3 border-t border-slate-100">
              Settings apply to this session only.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// COLLAPSIBLE TEXT BLOCK — long text content gets a "Read more" toggle
// ============================================================================
function TextBlock({ rawHTML, isLong, proseSize, a11y, speakText }) {
  const [expanded, setExpanded] = useState(!isLong);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className={`px-6 py-5 ${proseSize} prose-slate max-w-none ${!expanded ? 'max-h-48 overflow-hidden relative' : ''}`}>
        {a11y?.narration && (
          <button
            onClick={() => speakText(rawHTML)}
            className="mb-2 flex items-center gap-1.5 text-xs font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors"
            aria-label="Read this section aloud"
          >
            <Volume2 className="w-3.5 h-3.5" /> Read Aloud
          </button>
        )}
        <div dangerouslySetInnerHTML={{ __html: safeHTML(rawHTML) }} />
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-6 py-3 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900 bg-stone-50 border-t border-stone-200 flex items-center justify-center gap-2 transition-colors"
        >
          {expanded ? (
            <><ChevronLeft className="w-4 h-4 rotate-90" /> Show Less</>
          ) : (
            <><ChevronRight className="w-4 h-4 rotate-90" /> Read More</>
          )}
        </button>
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
        <KnowledgeCheckModal type="matching" completed={isCompleted}>
          <MatchingExercise
            pairs={block.matchingPairs}
            instructions={block.matchingInstructions}
            onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
          />
        </KnowledgeCheckModal>
      );

    case 'multipleChoice':
      return (
        <KnowledgeCheckModal type="multipleChoice" completed={isCompleted}>
          <MultipleChoice
            question={block.question}
            options={block.options}
            explanation={block.explanation}
            onAnswer={(isCorrect) => handleInteractionComplete(isCorrect, isCorrect ? 1 : 0)}
          />
        </KnowledgeCheckModal>
      );

    case 'multiSelect':
      return (
        <KnowledgeCheckModal type="multiSelect" completed={isCompleted}>
          <MultiSelect
            question={block.question}
            options={block.options}
            explanation={block.explanation}
            onAnswer={(isCorrect) => handleInteractionComplete(isCorrect, isCorrect ? 1 : 0)}
          />
        </KnowledgeCheckModal>
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

    case 'text': {
      const rawHTML = block.textContent || block.content || '';
      const isLong = rawHTML.length > 1200;
      return <TextBlock rawHTML={rawHTML} isLong={isLong} proseSize={proseSize} a11y={a11y} speakText={speakText} />;
    }

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
        <KnowledgeCheckModal type="cardSort" completed={isCompleted}>
          <CardSort
            categories={block.categories}
            cards={block.cards}
            instructions={block.instructions}
            explanation={block.explanation}
            onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
          />
        </KnowledgeCheckModal>
      );

    case 'sequencing':
      return (
        <KnowledgeCheckModal type="sequencing" completed={isCompleted}>
          <Sequencing
            steps={block.steps}
            instructions={block.instructions}
            explanation={block.explanation}
            onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
          />
        </KnowledgeCheckModal>
      );

    case 'hotspot':
      return (
        <KnowledgeCheckModal type="hotspot" completed={isCompleted}>
          <Hotspot
            hotspots={block.hotspots}
            hotspotImage={block.hotspotImage}
            imageDescription={block.imageDescription}
            instructions={block.instructions}
            onComplete={(count) => handleInteractionComplete(true, 1)}
          />
        </KnowledgeCheckModal>
      );

    case 'timeline':
      return (
        <KnowledgeCheckModal type="timeline" completed={isCompleted}>
          <Timeline
            events={block.events}
            instructions={block.instructions}
            onComplete={(correct, total) => handleInteractionComplete(correct === total, correct / total)}
          />
        </KnowledgeCheckModal>
      );

    case 'scenarioTree':
      return (
        <KnowledgeCheckModal type="scenarioTree" completed={isCompleted}>
          <ScenarioTree
            scenarioTitle={block.scenarioTitle}
            startNode={block.startNode}
            nodes={block.nodes}
            onComplete={() => handleInteractionComplete(true, 1)}
          />
        </KnowledgeCheckModal>
      );

    case 'flashcardDeck':
      return (
        <KnowledgeCheckModal type="flashcardDeck" completed={isCompleted}>
          <FlashcardDeck
            flashcards={block.flashcards}
            instructions={block.instructions}
            onComplete={(count) => handleInteractionComplete(true, 1)}
          />
        </KnowledgeCheckModal>
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
            <h3 style={{ fontWeight: 700, color: '#284157', margin: 0 }}>Reflection</h3>
          </div>
          <p style={{ color: '#284157', fontWeight: 600, marginBottom: 12 }}>{block.question}</p>
          <textarea
            placeholder="Take a moment to reflect and write your thoughts here..."
            aria-label={`Reflection: ${block.question}`}
            style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 10, border: '1px solid #E8E4DF', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
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
          <h3 style={{ fontWeight: 700, color: '#284157', marginBottom: 16 }}>📎 Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(block.resources || []).map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: '#F7F5F2', textDecoration: 'none', color: '#284157', border: '1px solid #E8E4DF' }}>
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
      <div className="mb-6 bg-white rounded-xl border border-forest-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-navy-600">Section Progress</span>
          <span className="font-semibold text-burgundy-700">
            {viewedBlocks.size}/{section.contentBlocks.length} viewed
            {interactiveBlockCount > 0 && ` • ${completedBlocks.size}/${interactiveBlockCount} completed`}
          </span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-honey-400 transition-all rounded-full"
            style={{ width: `${(viewedBlocks.size / section.contentBlocks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content Blocks */}
      {!showQuiz ? (
        <div className="space-y-5">
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
            <div className="bg-hunter-50 border border-hunter-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-navy-700">Section Quiz</h3>
                <p className="text-xs text-navy-400 mt-0.5">
                  {canTakeQuiz ? 'Ready to test your knowledge' : `Complete all content first (${viewedBlocks.size}/${section.contentBlocks.length})`}
                </p>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                disabled={!canTakeQuiz}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
                  canTakeQuiz
                    ? 'bg-hunter-600 hover:bg-hunter-700 text-white'
                    : 'bg-stone-200 text-forest-400 cursor-not-allowed'
                }`}
              >
                Take Quiz
              </button>
            </div>
          )}

          {quizPassed && (
            <div className="bg-hunter-50 border border-hunter-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-hunter-600 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-hunter-700">Section Complete</span>
                <span className="text-xs text-hunter-600 ml-2">Quiz passed</span>
              </div>
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
      <div className="mt-12 pt-6 border-t border-forest-200 flex items-center justify-between">
        <button
          onClick={() => onNavigate(sectionIndex - 1)}
          disabled={sectionIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            sectionIndex === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-navy-600 hover:bg-stone-100'
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
                : 'bg-stone-200 text-forest-400 cursor-not-allowed'
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
      <div className="bg-burgundy-50/60 rounded-2xl border-l-4 border-burgundy-700 p-6 text-center my-6">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
          results.passed ? 'bg-hunter-100 ring-4 ring-hunter-50' : 'bg-honey-100 ring-4 ring-honey-50'
        }`}>
          {results.passed ? (
            <CheckCircle2 className="w-7 h-7 text-hunter-600" />
          ) : (
            <AlertCircle className="w-7 h-7 text-honey-600" />
          )}
        </div>
        <h2 className="text-xl font-bold text-navy-700 mb-2">
          {results.passed ? 'Quiz Passed!' : 'Keep Trying!'}
        </h2>
        <p className="text-sm text-navy-500 mb-1">
          You scored {results.score}/{results.totalQuestions} ({results.percentage}%)
        </p>
        <p className="text-xs text-navy-400 mb-5">
          {results.passed
            ? 'You can now proceed to the next section.'
            : `You need ${Math.round(section.quizPassThreshold * 100)}% to pass.`}
        </p>
        <button
          onClick={() => onComplete(results)}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            results.passed
              ? 'bg-burgundy-800 hover:bg-burgundy-700 text-white shadow-burgundy-200'
              : 'bg-white hover:bg-stone-50 text-navy-600 border border-forest-200'
          }`}
        >
          {results.passed ? 'Continue' : 'Review Content & Retry'}
        </button>
      </div>
    );
  }

  const question = section.quizQuestions[currentQuestion];

  return (
    <div className="bg-burgundy-50/60 rounded-2xl border-l-4 border-burgundy-700 overflow-hidden my-6">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-burgundy-700 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-burgundy-800 tracking-wide">Check Your Understanding</h3>
        </div>
        <span className="text-burgundy-400 text-xs font-semibold bg-white px-2.5 py-1 rounded-full">
          {currentQuestion + 1} of {section.quizQuestions.length}
        </span>
      </div>

      <div className="px-6 pb-6 pl-16">
        <p className="text-base text-navy-700 font-semibold mb-5 leading-relaxed">{question.question}</p>

        <div className="space-y-3 mb-5">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: index }))}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3.5 text-[15px] ${
                answers[currentQuestion] === index
                  ? 'bg-burgundy-50 border-burgundy-600 shadow-sm shadow-burgundy-100'
                  : 'bg-white border-forest-200 hover:border-burgundy-300 hover:shadow-sm'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                answers[currentQuestion] === index
                  ? 'bg-burgundy-700 border-burgundy-700 text-white'
                  : 'border-forest-300'
              }`}>
                {answers[currentQuestion] === index ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-xs font-bold text-forest-400">{String.fromCharCode(65 + index)}</span>}
              </div>
              <span className="text-navy-600 leading-snug">{option.text}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-burgundy-100">
          <button
            onClick={onBack}
            className="text-xs text-navy-500 hover:text-navy-700 font-medium"
          >
            ← Back to Content
          </button>

          <div className="flex gap-2.5">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="px-4 py-2 text-sm text-navy-600 hover:bg-white rounded-xl border border-forest-200 font-medium transition-all"
              >
                Previous
              </button>
            )}

            {currentQuestion < section.quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={answers[currentQuestion] === undefined}
                className={`px-4 py-2 text-sm rounded-xl font-bold transition-all ${
                  answers[currentQuestion] !== undefined
                    ? 'bg-burgundy-800 hover:bg-burgundy-700 text-white shadow-sm shadow-burgundy-200'
                    : 'bg-stone-200 text-forest-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < section.quizQuestions.length}
                className={`px-5 py-2 text-sm rounded-xl font-bold transition-all ${
                  Object.keys(answers).length >= section.quizQuestions.length
                    ? 'bg-burgundy-800 hover:bg-burgundy-700 text-white shadow-sm shadow-burgundy-200'
                    : 'bg-stone-200 text-forest-400 cursor-not-allowed'
                }`}
              >
                Submit
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
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-navy-600 font-semibold rounded-xl transition-colors"
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
// REFERENCES VIEW
// ============================================================================
function ReferencesView({ course, onBack }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-navy-500 hover:text-navy-700 flex items-center gap-2 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Course
        </button>
        <h1 className="text-3xl font-bold text-navy-700">References</h1>
        <p className="text-navy-500 mt-2">
          {course.references.length} citations supporting this course material
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-forest-200 shadow-sm p-6 lg:p-8">
        <ol className="space-y-4">
          {course.references.map((ref, index) => (
            <li
              key={index}
              className="text-sm text-navy-600 leading-relaxed pl-10"
              style={{ textIndent: '-2.25rem' }}
            >
              {ref}
            </li>
          ))}
        </ol>
      </div>
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
        fixed top-0 left-0 h-full w-80 bg-white border-r border-forest-200 z-50
        transform transition-transform duration-300
        lg:relative lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-forest-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-navy-700 line-clamp-2">{course.title}</h2>
              <button onClick={onClose} className="lg:hidden text-forest-400 hover:text-navy-600">
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
          <div className="p-4 border-b border-forest-200">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-navy-600">Progress</span>
              <span className="font-bold text-burgundy-700">{progress?.overallProgress || 0}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-honey-400 transition-all rounded-full"
                style={{ width: `${progress?.overallProgress || 0}%` }}
              />
            </div>
          </div>

          {/* Sections */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Course sections">
            <ul className="space-y-1">
              {(() => {
                let lastModule = null;
                return course.sections.map((section, index) => {
                  const sectionProgress = progress?.sectionProgress?.[index];
                  const isCompleted = sectionProgress?.status === 'completed';
                  const isCurrent = currentView === 'section' && progress?.currentSectionIndex === index;
                  const isLocked = index > 0 && progress?.sectionProgress?.[index - 1]?.status !== 'completed';

                  const showModuleHeader = section.module && section.module !== lastModule;
                  lastModule = section.module || lastModule;

                  // Count module progress
                  let moduleCompleted = 0;
                  let moduleTotal = 0;
                  if (showModuleHeader) {
                    course.sections.forEach((s, i) => {
                      if (s.module === section.module) {
                        moduleTotal++;
                        if (progress?.sectionProgress?.[i]?.status === 'completed') moduleCompleted++;
                      }
                    });
                  }

                  return (
                    <li key={index}>
                      {showModuleHeader && (
                        <div className={`${index > 0 ? 'mt-4 pt-3 border-t border-forest-100' : ''} mb-2 px-2`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">{section.module}</span>
                            <span className="text-[10px] text-navy-300 font-medium">{moduleCompleted}/{moduleTotal}</span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => !isLocked && onNavigate(index)}
                        disabled={isLocked}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? 'bg-burgundy-50 text-burgundy-800'
                            : isLocked
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-navy-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-hunter-600 text-white'
                            : isCurrent
                              ? 'bg-burgundy-700 text-white'
                              : isLocked
                                ? 'bg-stone-100 text-slate-300'
                                : 'bg-stone-200 text-navy-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isLocked ? (
                            <Lock className="w-2.5 h-2.5" />
                          ) : (
                            <span className="text-[10px] font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-[13px] font-medium line-clamp-2">{section.title}</span>
                      </button>
                    </li>
                  );
                });
              })()}

              {/* References */}
              {course.references?.length > 0 && (
                <li className="pt-4 mt-4 border-t border-forest-200">
                  <button
                    onClick={() => onNavigate('references')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      currentView === 'references'
                        ? 'bg-burgundy-50 text-burgundy-800'
                        : 'text-navy-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      currentView === 'references'
                        ? 'bg-burgundy-700 text-white'
                        : 'bg-stone-200 text-navy-500'
                    }`}>
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium">References</span>
                  </button>
                </li>
              )}

              {/* Final Assessment */}
              <li className="pt-4 mt-4 border-t border-forest-200">
                <button
                  onClick={() => onNavigate('assessment')}
                  disabled={!progress?.sectionProgress?.every(s => s.status === 'completed')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    currentView === 'assessment'
                      ? 'bg-hunter-50 text-hunter-700'
                      : progress?.sectionProgress?.every(s => s.status === 'completed')
                        ? 'text-navy-600 hover:bg-stone-50'
                        : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    currentView === 'assessment'
                      ? 'bg-hunter-600 text-white'
                      : progress?.sectionProgress?.every(s => s.status === 'completed')
                        ? 'bg-honey-400 text-white'
                        : 'bg-stone-100 text-slate-300'
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
  const [currentView, setCurrentView] = useState('section'); // 'section' | 'assessment' | 'references'
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
    } else if (target === 'references') {
      setCurrentView('references');
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
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
    <div className={`min-h-screen bg-stone-50 flex ${hcClass}`}>
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
        <header className="bg-white border-b border-forest-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-navy-600 hover:text-navy-800"
            aria-label="Open course navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 lg:hidden text-center">
            <span className="font-medium text-navy-700 text-sm">
              {currentView === 'assessment' ? 'Final Assessment' : currentView === 'references' ? 'References' : currentSection?.title}
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
          ) : currentView === 'references' ? (
            <ReferencesView
              course={course}
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
