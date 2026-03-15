/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * CReady™ Viewer — © 2026 GAITP LLC
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

// ============================================================================
// API SERVICE
// ============================================================================
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/interactive-courses`
  : 'https://api.counselorready.com/api/interactive-courses';

function authHeaders(extra = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

const api = {
  async getCourse(slug) {
    const res = await fetch(`${API_BASE}/slug/${slug}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Course not found');
    const json = await res.json();
    return json.data || json;
  },

  async getProgress(slug) {
    const res = await fetch(`${API_BASE}/${slug}/progress`, { headers: authHeaders() });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  },

  async updateSectionProgress(slug, sectionIndex, data) {
    const res = await fetch(`${API_BASE}/${slug}/progress/section/${sectionIndex}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update progress');
    const json = await res.json();
    return json.data || json;
  },

  async submitSectionQuiz(slug, sectionIndex, answers, timeSpent) {
    const res = await fetch(`${API_BASE}/${slug}/progress/section/${sectionIndex}/quiz`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers, timeSpent })
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    const json = await res.json();
    return json.data || json;
  },

  async submitAssessment(slug, answers, timeUsed, questionOrder) {
    const res = await fetch(`${API_BASE}/${slug}/assessment`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers, timeUsed, questionOrder })
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    const json = await res.json();
    return json.data || json;
  },

  async logInteraction(slug, interaction) {
    try {
      await fetch(`${API_BASE}/${slug}/progress/interaction`, {
        method: 'POST',
        headers: authHeaders(),
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
  const textSizeClass = a11y?.fontSize === 'x-large' ? 'text-xl' : a11y?.fontSize === 'large' ? 'text-lg' : 'text-base';
  const proseSize = a11y?.fontSize === 'x-large' ? 'prose-xl' : a11y?.fontSize === 'large' ? 'prose-lg' : 'prose-base';

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
          imageBorder={block.imageBorder}
          imageShape={block.imageShape}
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
// BLOCK GROUPING — splits content blocks into digestible pages
// ============================================================================
function groupBlocksIntoPages(blocks, maxPerPage = 3) {
  if (!blocks || blocks.length === 0) return [];
  const pages = [];
  let current = [];

  blocks.forEach((block, i) => {
    // Section dividers always start a new page
    if (block.type === 'sectionDivider' && current.length > 0) {
      pages.push(current);
      current = [];
    }

    current.push({ block, originalIndex: i });

    // Interactive blocks (modals) get their own page
    const isInteractive = ['matching', 'multipleChoice', 'multiSelect', 'cardSort',
      'sequencing', 'hotspot', 'timeline', 'scenarioTree', 'flashcardDeck'].includes(block.type);

    if (isInteractive) {
      pages.push(current);
      current = [];
    } else if (current.length >= maxPerPage) {
      pages.push(current);
      current = [];
    }
  });

  if (current.length > 0) pages.push(current);
  return pages;
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
  a11y,
  pagedMode,
  currentPage,
  onPageChange
}) {
  const [viewedBlocks, setViewedBlocks] = useState(new Set(progress?.viewedBlocks || []));
  const [completedBlocks, setCompletedBlocks] = useState(new Set(progress?.completedBlocks || []));
  const [showQuiz, setShowQuiz] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  if (!section) return null;

  const contentBlocks = section.contentBlocks || [];

  // Paging
  const pages = useMemo(() => groupBlocksIntoPages(contentBlocks), [contentBlocks]);
  const totalPages = pages.length;
  const safePage = Math.min(currentPage || 0, totalPages - 1);

  // Reset page when section changes
  useEffect(() => {
    if (onPageChange) onPageChange(0);
  }, [sectionIndex]);

  // Track block views via intersection observer
  const observerRef = React.useRef(null);

  const interactiveBlockCount = contentBlocks.filter(
    b => ['matching', 'multipleChoice', 'multiSelect'].includes(b.type)
  ).length;

  const allInteractiveComplete = contentBlocks.every((block, i) => {
    if (!['matching', 'multipleChoice', 'multiSelect'].includes(block.type)) return true;
    return completedBlocks.has(i);
  });

  const canTakeQuiz = section.hasQuiz && viewedBlocks.size >= contentBlocks.length && allInteractiveComplete;
  const quizPassed = progress?.quizPassed;

  const isLastSection = sectionIndex === course.sections.length - 1;
  const canProceed = !section.hasQuiz || quizPassed;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Content Blocks — scroll mode default, paged mode optional */}
      {!showQuiz ? (
        <div className="space-y-5">
          {/* Paged mode indicator (only when paged mode active) */}
          {pagedMode && totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border border-forest-100 px-4 py-2">
              <span className="text-xs font-medium text-navy-500">
                Page {safePage + 1} of {totalPages}
              </span>
              <div className="flex gap-1.5">
                {pages.map((_, pi) => (
                  <button
                    key={pi}
                    onClick={() => onPageChange(pi)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      pi === safePage ? 'bg-burgundy-600 scale-125' : pi < safePage ? 'bg-hunter-400' : 'bg-stone-300'
                    }`}
                    aria-label={`Go to page ${pi + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {(pagedMode ? pages[safePage] || [] : contentBlocks.map((block, i) => ({ block, originalIndex: i }))).map(({ block, originalIndex }) => (
            <div
              key={originalIndex}
              data-block-index={originalIndex}
              ref={(el) => el && observerRef.current?.observe(el)}
              className="animate-fadeIn"
            >
              <ContentBlockRenderer
                block={block}
                blockIndex={originalIndex}
                sectionIndex={sectionIndex}
                courseSlug={course.slug}
                onComplete={handleBlockComplete}
                isCompleted={completedBlocks.has(originalIndex)}
                a11y={a11y}
              />
            </div>
          ))}

          {/* Paged navigation (only when paged mode active) */}
          {pagedMode && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => onPageChange(safePage - 1)}
                disabled={safePage === 0}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                  safePage === 0 ? 'opacity-50 cursor-not-allowed text-navy-400' : 'text-navy-600 hover:text-burgundy-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {safePage < totalPages - 1 ? (
                <button
                  onClick={() => { onPageChange(safePage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-2 px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-medium text-hunter-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> All content viewed
                </span>
              )}
            </div>
          )}

          {/* Section Quiz CTA */}
          {(!pagedMode || safePage === totalPages - 1) && section.hasQuiz && !quizPassed && (
            <div className="bg-hunter-50 border border-hunter-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-navy-700">Section Quiz</h3>
                <p className="text-xs text-navy-400 mt-0.5">
                  {canTakeQuiz ? 'Ready to test your knowledge' : `Complete all content first (${viewedBlocks.size}/${contentBlocks.length})`}
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

          {(!pagedMode || safePage === totalPages - 1) && quizPassed && (
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
            // Handle adaptive redirect
            if (results.navigateToSection !== undefined) {
              onProgressUpdate();
              setTimeout(() => onNavigate(results.navigateToSection), 300);
            }
          }}
          onBack={() => setShowQuiz(false)}
        />
      )}

      {/* Section Navigation — simple Previous / Next */}
      <div className="mt-8 pt-6 border-t border-forest-200 flex justify-between">
        <button
          onClick={() => onNavigate(sectionIndex - 1)}
          disabled={sectionIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 transition-colors ${
            sectionIndex === 0
              ? 'opacity-50 cursor-not-allowed text-navy-400'
              : 'text-navy-600 hover:text-burgundy-700'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {isLastSection && canProceed ? (
          <button
            onClick={() => onNavigate('assessment')}
            className="flex items-center gap-2 px-6 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate(sectionIndex + 1)}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
              canProceed
                ? 'bg-burgundy-700 hover:bg-burgundy-800 text-white'
                : 'opacity-50 cursor-not-allowed bg-burgundy-700 text-white'
            }`}
          >
            Next
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
        {results.attemptsRemaining !== undefined && !results.passed && (
          <p className="text-xs text-honey-600 mb-3 font-medium">
            {results.attemptsRemaining > 0
              ? `${results.attemptsRemaining} attempt(s) remaining`
              : 'No attempts remaining'}
          </p>
        )}
        {results.adaptiveAction && (
          <div className="bg-honey-50 border border-honey-200 rounded-xl p-4 mb-4 text-left">
            <p className="text-sm font-semibold text-navy-700 mb-1">
              {results.adaptiveAction.action === 'redirect' && 'Recommended: Review Additional Material'}
              {results.adaptiveAction.action === 'require_review' && 'Review Required'}
              {results.adaptiveAction.action === 'skip_ahead' && 'You May Skip Ahead'}
            </p>
            {results.adaptiveAction.message && (
              <p className="text-xs text-navy-500 mb-3">{results.adaptiveAction.message}</p>
            )}
            <button
              onClick={() => onComplete({ ...results, navigateToSection: results.adaptiveAction.targetSectionIndex })}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-burgundy-700 hover:bg-burgundy-600 text-white transition-all"
            >
              {results.adaptiveAction.action === 'skip_ahead' ? 'Skip Ahead' : 'Go to Review Section'}
            </button>
          </div>
        )}
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
function ProgressRing({ progress, size = 36 }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#D4A855" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
      </svg>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: '#D4A855' }}>
        {progress}%
      </span>
    </div>
  );
}

function CourseSidebar({
  course,
  progress,
  currentView,
  onNavigate,
  isOpen,
  onClose,
  pagedMode,
  currentPage,
  onPageChange
}) {
  const completedCount = progress?.sectionProgress?.filter(s => s.status === 'completed').length || 0;
  const totalCount = course.sections.length;
  const pct = progress?.overallProgress || 0;
  const allComplete = progress?.sectionProgress?.every(s => s.status === 'completed');

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
        fixed top-0 left-0 h-full w-72 z-50
        transform transition-transform duration-300
        lg:relative lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ background: '#F5F5DC', boxShadow: '2px 0 12px rgba(0,0,0,0.06)' }}>
        <div className="h-full flex flex-col">
          {/* Burgundy Gradient Header */}
          <div className="flex-shrink-0" style={{ padding: '16px 18px 14px', background: 'linear-gradient(135deg, #6B1D34, #4A1020)', color: '#fff' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide" style={{ background: 'rgba(255,255,255,.15)', letterSpacing: '0.5px' }}>
                {course.ceHours} CE Hours
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-70">{course.category || ''}</span>
                <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 700, lineHeight: 1.25, margin: '0 0 14px', color: '#fff' }}>
              {course.title}
            </h2>

            <div className="flex items-center gap-3 mb-2.5">
              <ProgressRing progress={pct} />
              <div>
                <div className="text-[11px] font-semibold" style={{ opacity: 0.9 }}>{completedCount} of {totalCount} complete</div>
                <div className="text-[10px]" style={{ opacity: 0.6 }}>
                  {allComplete ? 'All sections complete' : `Section ${(progress?.currentSectionIndex || 0) + 1} in progress`}
                </div>
              </div>
            </div>

            <div className="rounded-sm overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,.15)' }}>
              <div className="h-full rounded-sm transition-all duration-400" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #D4A855, #EACD86)' }} />
            </div>
          </div>

          {/* Sections Nav — card-based modules */}
          <nav className="flex-1 overflow-y-auto p-2.5" aria-label="Course sections">
            {(() => {
              let lastModule = null;
              // Group sections by module
              const modules = [];
              course.sections.forEach((section, index) => {
                const mod = section.module || 'Course Sections';
                if (mod !== lastModule) {
                  modules.push({ name: mod, sections: [] });
                  lastModule = mod;
                }
                modules[modules.length - 1].sections.push({ section, index });
              });

              return modules.map((mod, mi) => {
                const modCompleted = mod.sections.filter(({ index }) => progress?.sectionProgress?.[index]?.status === 'completed').length;
                const modTotal = mod.sections.length;
                const modDone = modCompleted === modTotal;
                const modHasActive = mod.sections.some(({ index }) => currentView === 'section' && progress?.currentSectionIndex === index);

                return (
                  <div key={mi} className="mb-2 rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E2BE' }}>
                    {/* Module header bar */}
                    <div className="flex items-center justify-between px-3.5 py-2" style={{
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                      background: modDone ? 'rgba(74,124,89,0.08)' : 'transparent',
                      color: modDone ? '#4A7C59' : modHasActive ? '#284157' : '#9CA3AF'
                    }}>
                      <span>{mod.name}</span>
                      {modDone ? (
                        <span className="flex items-center justify-center rounded-full text-white" style={{ width: 16, height: 16, background: '#4A7C59', fontSize: 9 }}>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span style={{ fontSize: 9 }}>{modCompleted}/{modTotal}</span>
                      )}
                    </div>

                    {/* Section items */}
                    {mod.sections.map(({ section, index }) => {
                      const sectionProgress = progress?.sectionProgress?.[index];
                      const isCompleted = sectionProgress?.status === 'completed';
                      const isCurrent = currentView === 'section' && progress?.currentSectionIndex === index;
                      const isLocked = index > 0
                        && progress?.sectionProgress?.[index - 1]?.status !== 'completed'
                        && !progress?.sectionProgress?.[index]?.adaptivelyUnlocked;

                      return (
                        <button
                          key={index}
                          onClick={() => !isLocked && onNavigate(index)}
                          disabled={isLocked}
                          aria-current={isCurrent ? 'step' : undefined}
                          className="w-full flex items-center gap-2 text-left transition-colors"
                          style={{
                            padding: '8px 14px',
                            borderTop: '1px solid #EDEDD0',
                            borderLeft: isCurrent ? '3px solid #6B1D34' : '3px solid transparent',
                            background: isCurrent ? '#FDF5F7' : isCompleted ? 'rgba(74,124,89,0.06)' : 'transparent',
                            opacity: isLocked ? 0.5 : 1,
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                            minHeight: 44,
                          }}
                        >
                          <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                            width: 18, height: 18, fontSize: 9, fontWeight: 700,
                            background: isCompleted ? '#4A7C59' : isCurrent ? '#6B1D34' : '#EDEDD0',
                            color: isCompleted || isCurrent ? '#fff' : isLocked ? '#9CA3AF' : '#6B7280',
                          }}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            ) : isLocked ? (
                              <Lock className="w-2 h-2" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <span style={{
                            fontSize: '12.5px',
                            color: isCurrent ? '#6B1D34' : '#284157',
                            fontWeight: isCurrent ? 600 : 400,
                          }} className="line-clamp-2">{section.title}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </nav>

          {/* Take Final Exam button */}
          {allComplete && (
            <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid #E2E2BE', background: '#fff' }}>
              <button
                onClick={() => onNavigate('assessment')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg transition-colors"
                style={{ background: '#6B1D34' }}
                onMouseEnter={e => e.currentTarget.style.background = '#560019'}
                onMouseLeave={e => e.currentTarget.style.background = '#6B1D34'}
              >
                <CheckCircle2 className="w-5 h-5" />
                Take Final Exam
              </button>
            </div>
          )}

          {/* Provider footer */}
          <div className="flex-shrink-0 px-4 py-2.5" style={{ borderTop: '1px solid #E2E2BE', background: '#fff' }}>
            <div className="text-center" style={{ fontSize: 9, color: '#6B7280', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.5px', fontStyle: 'italic' }}>
              NBCC Approved Provider #7760 · GAITP LLC
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// CE TIMER FOOTER
// ============================================================================
function CETimerFooter({ course, progress, onStartAssessment }) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(() => Date.now());

  const requiredSeconds = (course.ceHours || 0) * 3600;
  const allComplete = progress?.sectionProgress?.every(s => s.status === 'completed');
  const timerDone = elapsed >= requiredSeconds;

  useEffect(() => {
    if (!requiredSeconds) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [requiredSeconds, startTime]);

  if (!requiredSeconds) return null;

  const remaining = Math.max(0, requiredSeconds - elapsed);
  const hrs = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;
  const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <footer
      className="ce-timer-footer fixed bottom-0 z-40"
      style={{
        left: 288, right: 0, background: '#fff',
        borderTop: '2px solid #E2E2BE', padding: '0.875rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,.05)',
      }}
    >
      <div className="flex items-center gap-4">
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">&#9201;</span>
        <div>
          <div style={{ fontWeight: 600, color: '#2C2C2C', fontSize: '0.875rem' }}>Required Course Time</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6B1D34', fontVariantNumeric: 'tabular-nums' }} aria-live="polite">
            {timeStr}
          </div>
        </div>
      </div>
      <button
        onClick={onStartAssessment}
        disabled={!allComplete || !timerDone}
        style={{
          background: (!allComplete || !timerDone) ? '#6B7280' : '#6B1D34',
          color: '#fff', border: 'none', padding: '0.75rem 2rem',
          borderRadius: 6, fontWeight: 700, fontSize: '1rem',
          cursor: (!allComplete || !timerDone) ? 'not-allowed' : 'pointer',
          opacity: (!allComplete || !timerDone) ? 0.6 : 1,
          fontFamily: "'Lato', sans-serif", transition: 'all 0.2s',
        }}
      >
        {timerDone ? 'Final Post-Test' : 'Final Post-Test (Locked)'}
      </button>
    </footer>
  );
}

// ============================================================================
// RESOURCE FAB
// ============================================================================
function ResourceFAB({ resources }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed z-50" style={{ bottom: 24, right: 24 }}>
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-lg p-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}>
            <div style={{ fontWeight: 700, color: '#284157', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Course Resources
            </div>
            {resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-md transition-all no-underline"
                style={{ color: '#2C2C2C', minHeight: 44 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F5F5DC'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <Download className="w-5 h-5 flex-shrink-0" style={{ color: '#284157' }} />
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{res.title || res.name || 'Download'}</span>
              </a>
            ))}
          </div>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: 56, height: 56, background: '#284157', color: '#fff',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(40,65,87,.3)',
          fontSize: '1.5rem',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1F3345'; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#284157'; e.currentTarget.style.transform = 'scale(1)'; }}
        aria-label="Open downloadable resources"
      >
        <Download className="w-6 h-6" />
      </button>
    </div>
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
  const [pagedMode, setPagedMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
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
  const fontSizeClass = a11y.fontSize === 'x-large' ? 'text-xl' : a11y.fontSize === 'large' ? 'text-lg' : 'text-base';
  const hcClass = a11y.highContrast ? 'high-contrast' : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5DC' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5DC' }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-700 mb-2">Error Loading Course</h2>
          <p className="text-navy-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!course.sections || course.sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5DC' }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-700 mb-2">Course Content Unavailable</h2>
          <p className="text-navy-500">This course has no sections yet.</p>
        </div>
      </div>
    );
  }

  const currentSection = course.sections[progress?.currentSectionIndex || 0];
  const currentSectionProgress = progress?.sectionProgress?.[progress?.currentSectionIndex || 0];

  return (
    <div className={`min-h-screen flex ${hcClass}`} style={{ background: '#F5F5DC' }}>
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
        pagedMode={pagedMode}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0" id="main-content">
        {/* Top bar — eggshell with serif title */}
        <header className="sticky top-0 z-30 flex items-center justify-center" style={{ background: '#F5F5DC', padding: '1rem 2rem', borderBottom: '2px solid #E5E5DC' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2"
            style={{ color: '#284157' }}
            aria-label="Open course navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="flex-1 text-center m-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 700, color: '#6B1D34' }}>
            {currentView === 'assessment' ? 'Final Assessment' : currentView === 'references' ? 'References' : currentSection?.title}
          </h1>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setPagedMode(!pagedMode)}
              className={`p-2 rounded-lg transition-colors ${pagedMode ? 'bg-burgundy-100 text-burgundy-700' : 'hover:text-burgundy-700'}`}
              style={{ color: pagedMode ? undefined : '#9CA3AF' }}
              aria-label={pagedMode ? 'Switch to scroll mode' : 'Switch to paged mode'}
              title={pagedMode ? 'Scroll mode' : 'Paged mode'}
            >
              <Layers className="w-5 h-5" />
            </button>
            <AccessibilityToolbar settings={a11y} onUpdate={setA11y} />
            <a href="/dashboard" className="p-2 hover:text-burgundy-700 transition-colors" style={{ color: '#9CA3AF' }} aria-label="Return to dashboard">
              <Home className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Content */}
        <div className={`p-6 lg:p-8 pb-24 ${fontSizeClass}`} style={{ background: '#F5F5DC', minHeight: 'calc(100vh - 80px)' }}>
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
              pagedMode={pagedMode}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>

      {/* Vertical References Tab — right edge */}
      {course.references?.length > 0 && currentView !== 'references' && (
        <button
          onClick={() => handleNavigate('references')}
          className="fixed z-50 hover:opacity-90 transition-opacity"
          style={{
            right: 0, top: '50%', transform: 'translateY(-50%)',
            background: '#284157', color: '#fff', border: 'none',
            padding: '16px 10px', borderRadius: '8px 0 0 8px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
            writingMode: 'vertical-rl', textOrientation: 'mixed',
            boxShadow: '-2px 0 8px rgba(0,0,0,.12)',
          }}
          aria-label="Open reference list"
        >
          <BookOpen className="w-3.5 h-3.5 mb-1.5" style={{ transform: 'rotate(90deg)' }} />
          References
        </button>
      )}

      {/* CE Timer Footer */}
      <CETimerFooter
        course={course}
        progress={progress}
        onStartAssessment={() => handleNavigate('assessment')}
      />

      {/* Resource FAB */}
      {course.resources?.length > 0 && <ResourceFAB resources={course.resources} />}
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

/* APA heading hierarchy */
.prose h2, .cr-content h2 {
  font-family: "Cormorant Garamond", serif !important;
  font-weight: 600 !important;
  font-size: 1.75rem !important;
  color: #284157 !important;
  margin: 2rem 0 1rem 0;
}
.prose h3, .cr-content h3 {
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  color: #4A7C59 !important;
  margin: 1.5rem 0 0.75rem 0;
}
.prose h4, .cr-content h4 {
  font-weight: 600 !important;
  font-size: 1.1rem !important;
  color: #284157 !important;
  margin: 1.25rem 0 0.5rem 0;
}

/* Table styling */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.925rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}
.prose th {
  background: #f0f4f1;
  color: #284157;
  font-weight: 700;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #4A7C59;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.prose td {
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #475569;
  line-height: 1.6;
  vertical-align: top;
}
.prose tr:nth-child(even) { background: #fafaf8; }
.prose tr:hover { background: rgba(74, 124, 89, 0.04); }

/* Blockquote / Clinical Vignette */
.prose blockquote {
  border-left: 4px solid #D4A855;
  background: rgba(212, 168, 85, 0.06);
  padding: 16px 20px;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #475569;
}

/* CE Timer responsive */
@media (max-width: 1024px) {
  .ce-timer-footer { left: 0 !important; }
}
@media (max-width: 768px) {
  .ce-timer-footer { flex-direction: column !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; }
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

// React Router redirect — used when navigating to /course/:slug in the SPA
export function CourseViewerRedirect() {
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      window.location.href = '/interactive-course.html?slug=' + slug;
    }
  }, [slug]);

  return null;
}
