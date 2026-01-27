import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Menu, X, BookOpen, Clock, Award, 
  CheckCircle2, Circle, Play, Lock, AlertCircle, Download,
  BarChart3, Home, Settings, LogOut, User
} from 'lucide-react';
import {
  Accordion,
  MatchingExercise,
  MultipleChoice,
  MultiSelect,
  ImageTextCard,
  SectionDivider,
  TimedAssessment,
  ProgressTracker
} from './InteractiveCourseComponents';

// ============================================================================
// API SERVICE
// ============================================================================
const API_BASE = '/api/interactive-courses';

const api = {
  async getCourse(slug) {
    const res = await fetch(`${API_BASE}/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  async getProgress(slug) {
    const res = await fetch(`${API_BASE}/${slug}/progress`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async updateSectionProgress(slug, sectionIndex, data) {
    const res = await fetch(`${API_BASE}/${slug}/progress/section/${sectionIndex}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  },

  async submitSectionQuiz(slug, sectionIndex, answers, timeSpent) {
    const res = await fetch(`${API_BASE}/${slug}/progress/section/${sectionIndex}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ answers, timeSpent })
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  async submitAssessment(slug, answers, timeUsed, questionOrder) {
    const res = await fetch(`${API_BASE}/${slug}/progress/assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ answers, timeUsed, questionOrder })
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  },

  async logInteraction(slug, data) {
    fetch(`${API_BASE}/${slug}/progress/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    }).catch(console.error); // Fire and forget
  }
};

// ============================================================================
// CONTENT BLOCK RENDERER
// ============================================================================
function ContentBlockRenderer({ 
  block, 
  blockIndex, 
  sectionIndex,
  courseSlug,
  onComplete,
  isCompleted 
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
        <div className="prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: block.textContent }} />
        </div>
      );

    case 'video':
      return (
        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
          <video 
            src={block.videoUrl} 
            controls 
            className="w-full h-full"
          />
        </div>
      );

    default:
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700">Unknown content type: {block.type}</p>
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
  onProgressUpdate
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
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
          <span>Section {sectionIndex + 1} of {course.sections.length}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {section.estimatedTime} min
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">{section.title}</h1>
        {section.description && (
          <p className="text-slate-600 mt-2">{section.description}</p>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">Section Progress</span>
          <span className="font-semibold text-teal-600">
            {viewedBlocks.size}/{section.contentBlocks.length} viewed
            {interactiveBlockCount > 0 && ` • ${completedBlocks.size}/${interactiveBlockCount} completed`}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all"
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
              />
            </div>
          ))}

          {/* Section Quiz CTA */}
          {section.hasQuiz && !quizPassed && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Section Quiz</h3>
              <p className="text-slate-600 mb-4">
                Complete all content and activities above to unlock the section quiz.
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                disabled={!canTakeQuiz}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  canTakeQuiz
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canTakeQuiz ? 'Take Quiz' : `Complete all content first (${viewedBlocks.size}/${section.contentBlocks.length})`}
              </button>
            </div>
          )}

          {quizPassed && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Section Complete!</h3>
              <p className="text-emerald-600">You passed the section quiz.</p>
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
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {isLastSection && canProceed ? (
          <button
            onClick={() => onNavigate('assessment')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
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
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
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
          results.passed ? 'bg-emerald-100' : 'bg-amber-100'
        }`}>
          {results.passed ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          ) : (
            <AlertCircle className="w-10 h-10 text-amber-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {results.passed ? 'Quiz Passed!' : 'Keep Trying!'}
        </h2>
        <p className="text-slate-600 mb-4">
          You scored {results.score}/{results.totalQuestions} ({results.percentage}%)
        </p>
        <p className="text-sm text-slate-500 mb-6">
          {results.passed 
            ? 'You can now proceed to the next section.'
            : `You need ${Math.round(section.quizPassThreshold * 100)}% to pass.`}
        </p>
        <button
          onClick={() => onComplete(results)}
          className={`px-6 py-3 rounded-xl font-semibold ${
            results.passed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-bold">Section Quiz</h3>
        <span className="text-teal-100 text-sm">
          Question {currentQuestion + 1} of {section.quizQuestions.length}
        </span>
      </div>

      <div className="p-6">
        <p className="text-lg text-slate-800 font-medium mb-6">{question.question}</p>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: index }))}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                answers[currentQuestion] === index
                  ? 'bg-teal-50 border-teal-400'
                  : 'bg-slate-50 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                answers[currentQuestion] === index
                  ? 'bg-teal-500 border-teal-500 text-white'
                  : 'border-slate-300'
              }`}>
                {answers[currentQuestion] === index && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <span className="text-slate-700">{option.text}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-800"
          >
            ← Back to Content
          </button>

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
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
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
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
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Award className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Congratulations!</h1>
        <p className="text-xl text-slate-600 mb-2">You've completed {course.title}</p>
        <p className="text-slate-500 mb-8">
          Final Score: {assessmentResults.score}/{assessmentResults.totalQuestions} ({assessmentResults.percentage}%)
        </p>
        
        {assessmentResults.certificateId && (
          <a
            href={`/api/certificates/${assessmentResults.certificateId}/download`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </a>
        )}
        
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            {course.ceHours} CE Hours • {course.ceProvider}
          </p>
        </div>
      </div>
    );
  }

  if (assessmentResults && !assessmentResults.passed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Not Quite!</h1>
        <p className="text-xl text-slate-600 mb-2">
          You scored {assessmentResults.percentage}%
        </p>
        <p className="text-slate-500 mb-4">
          You need {Math.round(course.assessment.passThreshold * 100)}% to pass.
        </p>
        <p className="text-amber-600 font-medium mb-8">
          {assessmentResults.attemptsRemaining} attempts remaining
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Review Content
          </button>
          {assessmentResults.attemptsRemaining > 0 && (
            <button
              onClick={() => setAssessmentResults(null)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
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
          className="text-slate-600 hover:text-slate-800 flex items-center gap-2"
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
              <h2 className="font-bold text-slate-800 line-clamp-2">{course.title}</h2>
              <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
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
              <span className="text-slate-600">Overall Progress</span>
              <span className="font-bold text-teal-600">{progress?.overallProgress || 0}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
                style={{ width: `${progress?.overallProgress || 0}%` }}
              />
            </div>
          </div>

          {/* Sections */}
          <nav className="flex-1 overflow-y-auto p-4">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-teal-50 text-teal-700'
                          : isLocked
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-teal-500 text-white'
                            : isLocked
                              ? 'bg-slate-100 text-slate-300'
                              : 'bg-slate-200 text-slate-500'
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
                      ? 'bg-emerald-50 text-emerald-700'
                      : progress?.sectionProgress?.every(s => s.status === 'completed')
                        ? 'text-slate-600 hover:bg-slate-50'
                        : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    progress?.assessmentPassed
                      ? 'bg-emerald-500 text-white'
                      : currentView === 'assessment'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Award className="w-4 h-4" />
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Course</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const currentSection = course.sections[progress?.currentSectionIndex || 0];
  const currentSectionProgress = progress?.sectionProgress?.[progress?.currentSectionIndex || 0];

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 lg:hidden text-center">
            <span className="font-medium text-slate-800 text-sm">
              {currentView === 'assessment' ? 'Final Assessment' : currentSection?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a href="/dashboard" className="p-2 text-slate-400 hover:text-slate-600">
              <Home className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
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
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Animation styles
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
