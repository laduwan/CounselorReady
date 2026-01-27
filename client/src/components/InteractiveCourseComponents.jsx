import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronDown, ChevronUp, Check, X, GripVertical, 
  Clock, Award, BookOpen, AlertCircle, CheckCircle2,
  ArrowRight, RotateCcw, Play, Pause, Info
} from 'lucide-react';

// ============================================================================
// COLOR PALETTE - CounselorReady Brand
// ============================================================================
const colors = {
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
  },
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  }
};

// ============================================================================
// 1. EXPANDABLE ACCORDION COMPONENT
// ============================================================================
export function Accordion({ items, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div 
          key={index}
          className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-teal-50 to-white hover:from-teal-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                openItems.has(index) ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-600'
              }`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800">{item.title}</span>
            </div>
            <div className={`transform transition-transform duration-300 ${openItems.has(index) ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-500" />
            </div>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openItems.has(index) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-5 py-4 bg-white border-t border-slate-100">
              <div className="prose prose-slate max-w-none">
                {typeof item.content === 'string' ? (
                  <p className="text-slate-600 leading-relaxed">{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 2. DRAG-AND-DROP MATCHING EXERCISE
// ============================================================================
export function MatchingExercise({ 
  pairs, // Array of { term, definition }
  instructions = "Drag each term to its matching definition",
  onComplete 
}) {
  const [terms, setTerms] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [matches, setMatches] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Shuffle both arrays independently
    const shuffledTerms = [...pairs].sort(() => Math.random() - 0.5);
    const shuffledDefs = [...pairs].sort(() => Math.random() - 0.5);
    setTerms(shuffledTerms.map((p, i) => ({ ...p, id: `term-${i}` })));
    setDefinitions(shuffledDefs.map((p, i) => ({ ...p, id: `def-${i}` })));
  }, [pairs]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, definition) => {
    e.preventDefault();
    if (draggedItem && !matches[definition.id]) {
      setMatches(prev => ({
        ...prev,
        [definition.id]: draggedItem
      }));
    }
    setDraggedItem(null);
  };

  const removeMatch = (defId) => {
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[defId];
      return newMatches;
    });
  };

  const checkAnswers = () => {
    let correct = 0;
    definitions.forEach(def => {
      const matchedTerm = matches[def.id];
      if (matchedTerm && matchedTerm.term === def.term) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
    setIsComplete(true);
    if (onComplete) {
      onComplete(correct, pairs.length);
    }
  };

  const reset = () => {
    setMatches({});
    setShowResults(false);
    setIsComplete(false);
    setScore(0);
  };

  const matchedTermIds = Object.values(matches).map(t => t?.id);
  const availableTerms = terms.filter(t => !matchedTermIds.includes(t.id));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <GripVertical className="w-5 h-5" />
          Matching Exercise
        </h3>
        <p className="text-teal-100 text-sm mt-1">{instructions}</p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Terms Column */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm">T</span>
              Terms
            </h4>
            <div className="space-y-2">
              {availableTerms.map((item) => (
                <div
                  key={item.id}
                  draggable={!isComplete}
                  onDragStart={(e) => handleDragStart(e, item)}
                  className={`px-4 py-3 bg-teal-50 border-2 border-teal-200 rounded-lg cursor-grab 
                    active:cursor-grabbing hover:bg-teal-100 hover:border-teal-300 transition-all
                    ${isComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="font-medium text-teal-800">{item.term}</span>
                </div>
              ))}
              {availableTerms.length === 0 && !showResults && (
                <p className="text-slate-400 text-sm italic py-2">All terms matched!</p>
              )}
            </div>
          </div>

          {/* Definitions Column */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">D</span>
              Definitions
            </h4>
            <div className="space-y-2">
              {definitions.map((def) => {
                const matchedTerm = matches[def.id];
                const isCorrect = showResults && matchedTerm?.term === def.term;
                const isIncorrect = showResults && matchedTerm && matchedTerm.term !== def.term;
                
                return (
                  <div
                    key={def.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, def)}
                    className={`min-h-[60px] px-4 py-3 rounded-lg border-2 border-dashed transition-all
                      ${matchedTerm 
                        ? isCorrect 
                          ? 'bg-emerald-50 border-emerald-400' 
                          : isIncorrect 
                            ? 'bg-red-50 border-red-400' 
                            : 'bg-amber-50 border-amber-300'
                        : 'bg-slate-50 border-slate-300 hover:border-teal-400 hover:bg-teal-50'
                      }`}
                  >
                    <p className="text-sm text-slate-600 mb-2">{def.definition}</p>
                    {matchedTerm && (
                      <div className={`flex items-center justify-between px-3 py-1.5 rounded-md ${
                        isCorrect ? 'bg-emerald-100' : isIncorrect ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        <span className={`font-medium text-sm ${
                          isCorrect ? 'text-emerald-700' : isIncorrect ? 'text-red-700' : 'text-amber-700'
                        }`}>
                          {matchedTerm.term}
                        </span>
                        {!isComplete && (
                          <button 
                            onClick={() => removeMatch(def.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {showResults && (
                          isCorrect 
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            : <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions & Results */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          {showResults ? (
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                score === pairs.length ? 'bg-emerald-100' : score >= pairs.length * 0.8 ? 'bg-amber-100' : 'bg-red-100'
              }`}>
                <Award className={`w-5 h-5 ${
                  score === pairs.length ? 'text-emerald-600' : score >= pairs.length * 0.8 ? 'text-amber-600' : 'text-red-600'
                }`} />
                <span className="font-semibold">
                  Score: {score}/{pairs.length} ({Math.round(score/pairs.length*100)}%)
                </span>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={checkAnswers}
                disabled={Object.keys(matches).length !== definitions.length}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  Object.keys(matches).length === definitions.length
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                Check Answers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. MULTIPLE CHOICE QUESTION
// ============================================================================
export function MultipleChoice({
  question,
  options, // Array of { text, isCorrect }
  explanation,
  onAnswer
}) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected !== null && options[selected]?.isCorrect;

  const handleSubmit = () => {
    setSubmitted(true);
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const reset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <h3 className="text-white font-bold text-lg">Question</h3>
      </div>
      
      <div className="p-6">
        <p className="text-lg text-slate-800 font-medium mb-6">{question}</p>
        
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selected === index;
            const showCorrect = submitted && option.isCorrect;
            const showIncorrect = submitted && isSelected && !option.isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => !submitted && setSelected(index)}
                disabled={submitted}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  showCorrect
                    ? 'bg-emerald-50 border-emerald-400'
                    : showIncorrect
                      ? 'bg-red-50 border-red-400'
                      : isSelected
                        ? 'bg-teal-50 border-teal-400'
                        : 'bg-slate-50 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  showCorrect
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : showIncorrect
                      ? 'bg-red-500 border-red-500 text-white'
                      : isSelected
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'border-slate-300'
                }`}>
                  {showCorrect ? (
                    <Check className="w-4 h-4" />
                  ) : showIncorrect ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      {String.fromCharCode(65 + index)}
                    </span>
                  )}
                </div>
                <span className={`font-medium ${
                  showCorrect ? 'text-emerald-700' : showIncorrect ? 'text-red-700' : 'text-slate-700'
                }`}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {submitted && explanation && (
          <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <div className="flex items-start gap-3">
              <Info className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div>
                <p className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isCorrect ? 'Correct!' : 'Explanation'}
                </p>
                <p className={`text-sm mt-1 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
          {submitted ? (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                selected !== null
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MULTI-SELECT QUESTION
// ============================================================================
export function MultiSelect({
  question,
  options, // Array of { text, isCorrect }
  explanation,
  onAnswer
}) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleOption = (index) => {
    if (submitted) return;
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctAnswers = options.map((o, i) => o.isCorrect ? i : -1).filter(i => i >= 0);
    const selectedArray = Array.from(selected);
    const isFullyCorrect = 
      correctAnswers.length === selectedArray.length &&
      correctAnswers.every(i => selected.has(i));
    
    if (onAnswer) {
      onAnswer(isFullyCorrect);
    }
  };

  const reset = () => {
    setSelected(new Set());
    setSubmitted(false);
  };

  const correctCount = options.filter((o, i) => o.isCorrect && selected.has(i)).length;
  const totalCorrect = options.filter(o => o.isCorrect).length;
  const incorrectSelected = options.filter((o, i) => !o.isCorrect && selected.has(i)).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <h3 className="text-white font-bold text-lg">Select All That Apply</h3>
      </div>
      
      <div className="p-6">
        <p className="text-lg text-slate-800 font-medium mb-2">{question}</p>
        <p className="text-sm text-slate-500 mb-6">Select all correct answers</p>
        
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selected.has(index);
            const showCorrect = submitted && option.isCorrect;
            const showIncorrect = submitted && isSelected && !option.isCorrect;
            const missedCorrect = submitted && option.isCorrect && !isSelected;
            
            return (
              <button
                key={index}
                onClick={() => toggleOption(index)}
                disabled={submitted}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  showCorrect && isSelected
                    ? 'bg-emerald-50 border-emerald-400'
                    : showIncorrect
                      ? 'bg-red-50 border-red-400'
                      : missedCorrect
                        ? 'bg-amber-50 border-amber-400'
                        : isSelected
                          ? 'bg-teal-50 border-teal-400'
                          : 'bg-slate-50 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  showCorrect && isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : showIncorrect
                      ? 'bg-red-500 border-red-500 text-white'
                      : missedCorrect
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : isSelected
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'border-slate-300'
                }`}>
                  {(isSelected || missedCorrect) && <Check className="w-4 h-4" />}
                </div>
                <span className={`font-medium ${
                  showCorrect && isSelected ? 'text-emerald-700' 
                    : showIncorrect ? 'text-red-700' 
                    : missedCorrect ? 'text-amber-700'
                    : 'text-slate-700'
                }`}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className={`mt-6 p-4 rounded-xl ${
            correctCount === totalCorrect && incorrectSelected === 0 ? 'bg-emerald-50' : 'bg-amber-50'
          }`}>
            <div className="flex items-start gap-3">
              <Info className={`w-5 h-5 mt-0.5 ${
                correctCount === totalCorrect && incorrectSelected === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`} />
              <div>
                <p className={`font-semibold ${
                  correctCount === totalCorrect && incorrectSelected === 0 ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {correctCount === totalCorrect && incorrectSelected === 0 
                    ? 'Perfect!' 
                    : `${correctCount}/${totalCorrect} correct answers selected`}
                </p>
                {explanation && (
                  <p className={`text-sm mt-1 ${
                    correctCount === totalCorrect && incorrectSelected === 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
          {submitted ? (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                selected.size > 0
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. IMAGE + TEXT CARD
// ============================================================================
export function ImageTextCard({ 
  image, 
  imageAlt, 
  title, 
  content, 
  imagePosition = 'left',
  highlight = false 
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-lg overflow-hidden ${
      highlight ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
    }`}>
      <div className={`flex flex-col ${imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* Image */}
        <div className="md:w-2/5 relative">
          <div className="aspect-video md:aspect-auto md:h-full bg-gradient-to-br from-teal-100 to-slate-100 flex items-center justify-center">
            {image ? (
              <img 
                src={image} 
                alt={imageAlt || title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6">
                <BookOpen className="w-12 h-12 text-teal-300 mx-auto" />
                <p className="text-sm text-slate-400 mt-2">Course Content</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="md:w-3/5 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
          <div className="prose prose-slate max-w-none">
            {typeof content === 'string' ? (
              <p className="text-slate-600 leading-relaxed">{content}</p>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. SECTION DIVIDER
// ============================================================================
export function SectionDivider({ 
  title, 
  subtitle, 
  sectionNumber, 
  icon: Icon = BookOpen 
}) {
  return (
    <div className="relative py-12">
      {/* Decorative line */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-slate-200"></div>
      </div>
      
      {/* Content */}
      <div className="relative flex justify-center">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl px-8 py-6 shadow-xl">
          <div className="flex items-center gap-4">
            {sectionNumber && (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{sectionNumber}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-teal-200" />
                <h2 className="text-xl font-bold text-white">{title}</h2>
              </div>
              {subtitle && (
                <p className="text-teal-100 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. TIMED ASSESSMENT
// ============================================================================
export function TimedAssessment({
  title = "Final Assessment",
  questions, // Array of { question, options: [{ text, isCorrect }], explanation }
  timeLimit = 30, // minutes
  passThreshold = 0.8,
  onComplete
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isStarted && !isComplete && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, isComplete, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const finishAssessment = () => {
    setIsComplete(true);
    clearInterval(timerRef.current);
    
    const correctCount = questions.reduce((count, q, i) => {
      const selectedOption = answers[i];
      if (selectedOption !== undefined && q.options[selectedOption]?.isCorrect) {
        return count + 1;
      }
      return count;
    }, 0);

    if (onComplete) {
      onComplete({
        score: correctCount,
        total: questions.length,
        percentage: correctCount / questions.length,
        passed: correctCount / questions.length >= passThreshold,
        timeUsed: timeLimit * 60 - timeRemaining
      });
    }
  };

  const getScore = () => {
    return questions.reduce((count, q, i) => {
      const selectedOption = answers[i];
      if (selectedOption !== undefined && q.options[selectedOption]?.isCorrect) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  if (!isStarted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
          <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-teal-600" />
          </div>
          <h4 className="text-2xl font-bold text-slate-800 mb-2">Ready to Begin?</h4>
          <div className="text-slate-600 space-y-2 mb-8">
            <p><strong>{questions.length}</strong> questions</p>
            <p><strong>{timeLimit}</strong> minutes time limit</p>
            <p><strong>{Math.round(passThreshold * 100)}%</strong> required to pass</p>
          </div>
          <button
            onClick={() => setIsStarted(true)}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const score = getScore();
    const percentage = score / questions.length;
    const passed = percentage >= passThreshold;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className={`px-6 py-4 ${passed ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : 'bg-gradient-to-r from-red-600 to-red-500'}`}>
          <h3 className="text-white font-bold text-xl">Assessment Complete</h3>
        </div>
        <div className="p-8 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-emerald-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Award className="w-12 h-12 text-emerald-600" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          <h4 className={`text-3xl font-bold mb-2 ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
            {passed ? 'Congratulations!' : 'Not Quite'}
          </h4>
          <p className="text-slate-600 mb-6">
            {passed ? 'You passed the assessment!' : `You need ${Math.round(passThreshold * 100)}% to pass.`}
          </p>
          
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-slate-800 mb-2">
              {Math.round(percentage * 100)}%
            </div>
            <p className="text-slate-500">
              {score} of {questions.length} correct
            </p>
          </div>

          {!passed && (
            <button
              onClick={() => {
                setIsComplete(false);
                setIsStarted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setTimeRemaining(timeLimit * 60);
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Assessment
            </button>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const timeWarning = timeRemaining < 300; // Less than 5 minutes

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header with timer */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeWarning ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white'
        }`}>
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200">
        <div 
          className="h-full bg-teal-500 transition-all"
          style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Question counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-slate-500">
            {Object.keys(answers).length} answered
          </span>
        </div>

        {/* Question */}
        <p className="text-lg text-slate-800 font-medium mb-6">{question.question}</p>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === index;
            
            return (
              <button
                key={index}
                onClick={() => selectAnswer(currentQuestion, index)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'bg-teal-50 border-teal-400'
                    : 'bg-slate-50 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : 'border-slate-300'
                }`}>
                  <span className="text-sm font-semibold">
                    {isSelected ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span className="font-medium text-slate-700">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentQuestion === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Previous
          </button>

          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                  i === currentQuestion
                    ? 'bg-teal-600 text-white'
                    : answers[i] !== undefined
                      ? 'bg-teal-100 text-teal-600'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={finishAssessment}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. PROGRESS TRACKER
// ============================================================================
export function ProgressTracker({
  sections, // Array of { title, completed, current }
  currentSection,
  completedSections,
  totalTimeEstimate = "4 hours"
}) {
  const completionPercentage = Math.round((completedSections.length / sections.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Course Progress</h3>
          <span className="text-teal-100 text-sm">{totalTimeEstimate}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Overall Progress</span>
            <span className="text-sm font-bold text-teal-600">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Section list */}
        <div className="space-y-2">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(index);
            const isCurrent = currentSection === index;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isCurrent
                    ? 'bg-teal-50 border border-teal-200'
                    : isCompleted
                      ? 'bg-emerald-50'
                      : 'bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${
                    isCurrent ? 'text-teal-700' : isCompleted ? 'text-emerald-700' : 'text-slate-600'
                  }`}>
                    {section.title}
                  </span>
                </div>
                {isCurrent && (
                  <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEMO COMPONENT - Shows all components in action
// ============================================================================
export default function InteractiveCourseDemo() {
  const [completedSections, setCompletedSections] = useState([0, 1]);
  
  const accordionItems = [
    { 
      title: "Safety", 
      content: "Ensuring physical and emotional safety for clients is the foundation of Trauma-Informed Care. This includes creating a welcoming environment and validating clients' experiences." 
    },
    { 
      title: "Trustworthiness and Transparency", 
      content: "Building trust with clients through transparency in operations and decision-making processes is essential for effective therapeutic relationships." 
    },
    { 
      title: "Peer Support", 
      content: "Utilizing peer support and mutual self-help as integral to the organizational and service delivery approach enhances recovery outcomes." 
    },
  ];

  const matchingPairs = [
    { term: "Acute Trauma", definition: "Results from a single incident" },
    { term: "Chronic Trauma", definition: "Repeated and prolonged exposure to stressful events" },
    { term: "Complex Trauma", definition: "Exposure to multiple traumatic events, often interpersonal" },
  ];

  const multipleChoiceQuestion = {
    question: "Which principle of Trauma-Informed Care emphasizes the importance of creating a safe environment?",
    options: [
      { text: "Collaboration", isCorrect: false },
      { text: "Safety", isCorrect: true },
      { text: "Trustworthiness", isCorrect: false },
      { text: "Empowerment", isCorrect: false },
    ],
    explanation: "Safety is the foundational principle that ensures physical and emotional safety for all clients, which is essential before any other therapeutic work can begin."
  };

  const multiSelectQuestion = {
    question: "Which of the following are core components of Trauma-Informed Care?",
    options: [
      { text: "Empowerment", isCorrect: true },
      { text: "Trustworthiness", isCorrect: true },
      { text: "Safety", isCorrect: true },
      { text: "Isolation", isCorrect: false },
    ],
    explanation: "Empowerment, Trustworthiness, and Safety are three of SAMHSA's six key principles of TIC. Isolation is the opposite of what TIC promotes."
  };

  const assessmentQuestions = [
    {
      question: "What percentage of adults have experienced at least one traumatic event according to WHO?",
      options: [
        { text: "50%", isCorrect: false },
        { text: "60%", isCorrect: false },
        { text: "70%", isCorrect: true },
        { text: "80%", isCorrect: false },
      ]
    },
    {
      question: "Which type of trauma involves exposure to multiple traumatic events?",
      options: [
        { text: "Acute Trauma", isCorrect: false },
        { text: "Chronic Trauma", isCorrect: false },
        { text: "Complex Trauma", isCorrect: true },
        { text: "Simple Trauma", isCorrect: false },
      ]
    },
    {
      question: "Which organization provides the six key principles for TIC?",
      options: [
        { text: "APA", isCorrect: false },
        { text: "CDC", isCorrect: false },
        { text: "SAMHSA", isCorrect: true },
        { text: "WHO", isCorrect: false },
      ]
    },
  ];

  const courseSections = [
    { title: "Introduction to Trauma-Informed Care" },
    { title: "Core Components of TIC" },
    { title: "Applying TIC in Clinical Settings" },
    { title: "Prevalence and Impact of Trauma" },
    { title: "TIC Principles (Interactive)" },
    { title: "Challenges and Considerations" },
    { title: "Key Trauma Assessments" },
    { title: "Conclusion" },
    { title: "Final Assessment" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            CounselorReady Interactive Components
          </h1>
          <p className="text-slate-600">
            Preview of all 8 interactive course features
          </p>
        </div>

        {/* Progress Tracker */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">8. Progress Tracker</h2>
          <ProgressTracker
            sections={courseSections}
            currentSection={2}
            completedSections={completedSections}
            totalTimeEstimate="4 CE Hours"
          />
        </section>

        {/* Section Divider */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">6. Section Divider</h2>
          <SectionDivider
            sectionNumber={3}
            title="Applying TIC in Clinical Settings"
            subtitle="Assessment tools and treatment planning"
          />
        </section>

        {/* Accordion */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">1. Expandable Accordion</h2>
          <Accordion items={accordionItems} allowMultiple={true} />
        </section>

        {/* Image + Text Card */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">5. Image + Text Card</h2>
          <ImageTextCard
            title="Understanding Trauma Responses"
            content="Trauma can alter brain structures like the amygdala, hippocampus, and prefrontal cortex, leading to changes in stress response, memory, and emotional regulation. Understanding these biological effects is crucial for effective clinical practice."
            highlight={true}
          />
        </section>

        {/* Multiple Choice */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">3. Multiple Choice Question</h2>
          <MultipleChoice {...multipleChoiceQuestion} />
        </section>

        {/* Multi-Select */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">4. Multi-Select Question</h2>
          <MultiSelect {...multiSelectQuestion} />
        </section>

        {/* Matching Exercise */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">2. Drag-and-Drop Matching</h2>
          <MatchingExercise pairs={matchingPairs} />
        </section>

        {/* Timed Assessment */}
        <section>
          <h2 className="text-xl font-bold text-slate-700 mb-4">7. Timed Assessment</h2>
          <TimedAssessment
            title="Module Quiz"
            questions={assessmentQuestions}
            timeLimit={5}
            passThreshold={0.8}
            onComplete={(results) => console.log('Assessment complete:', results)}
          />
        </section>
      </div>
    </div>
  );
}
