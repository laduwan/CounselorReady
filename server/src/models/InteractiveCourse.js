import mongoose from 'mongoose';

// ============================================================================
// COURSE SCHEMA - Defines course structure with sections and content blocks
// ============================================================================
const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['accordion', 'matching', 'multipleChoice', 'multiSelect', 'imageText', 'sectionDivider', 'text', 'video'],
    required: true
  },
  order: { type: Number, required: true },
  
  // Accordion content
  accordionItems: [{
    title: String,
    content: String
  }],
  
  // Matching exercise
  matchingPairs: [{
    term: String,
    definition: String
  }],
  matchingInstructions: String,
  
  // Multiple choice / Multi-select questions
  question: String,
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String,
  
  // Image + Text card
  image: String,
  imageAlt: String,
  imagePosition: { type: String, enum: ['left', 'right'], default: 'left' },
  title: String,
  content: String,
  highlight: { type: Boolean, default: false },
  
  // Section divider
  sectionNumber: Number,
  subtitle: String,
  
  // Text block
  textContent: String,
  
  // Video
  videoUrl: String,
  videoDuration: Number // in seconds
});

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  contentBlocks: [ContentBlockSchema],
  
  // Section quiz (optional)
  hasQuiz: { type: Boolean, default: false },
  quizQuestions: [{
    question: String,
    type: { type: String, enum: ['multipleChoice', 'multiSelect', 'trueFalse'] },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    explanation: String
  }],
  quizPassThreshold: { type: Number, default: 0.8 },
  
  // Estimated time in minutes
  estimatedTime: { type: Number, default: 15 }
});

const CourseSchema = new mongoose.Schema({
  // Basic info
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: String,
  
  // CE/Accreditation info
  ceHours: { type: Number, required: true },
  ceProvider: { type: String, default: 'NBCC ACEP #7760' },
  acepNumber: { type: String, default: '7760' },
  
  // Course content
  sections: [SectionSchema],
  
  // Final assessment
  assessment: {
    title: { type: String, default: 'Final Assessment' },
    timeLimit: { type: Number, default: 30 }, // minutes
    passThreshold: { type: Number, default: 0.8 },
    questions: [{
      question: String,
      type: { type: String, enum: ['multipleChoice', 'multiSelect', 'trueFalse'] },
      options: [{
        text: String,
        isCorrect: Boolean
      }],
      explanation: String
    }],
    attemptsAllowed: { type: Number, default: 3 },
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true }
  },
  
  // Target audience and categorization
  targetAudience: [String],
  categories: [String],
  tags: [String],
  
  // Requirements
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  
  // Metadata
  author: String,
  publishedAt: Date,
  updatedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  
  // Calculated fields
  totalEstimatedTime: Number, // in minutes
  totalContentBlocks: Number,
  totalQuizQuestions: Number
  
}, { timestamps: true });

// Pre-save hook to calculate totals
CourseSchema.pre('save', function(next) {
  this.totalEstimatedTime = this.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
  this.totalContentBlocks = this.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
  this.totalQuizQuestions = this.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) 
    + (this.assessment?.questions?.length || 0);
  next();
});

// Index for searching
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Course = mongoose.model('InteractiveCourse', CourseSchema);

// ============================================================================
// COURSE PROGRESS SCHEMA - Tracks user progress through courses
// ============================================================================
const SectionProgressSchema = new mongoose.Schema({
  sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sectionIndex: { type: Number, required: true },
  
  // Content completion
  viewedBlocks: [Number], // indices of viewed content blocks
  completedBlocks: [Number], // indices of completed interactive blocks
  
  // Quiz results
  quizAttempts: [{
    attemptedAt: { type: Date, default: Date.now },
    answers: mongoose.Schema.Types.Mixed, // { questionIndex: selectedOptionIndex }
    score: Number,
    totalQuestions: Number,
    passed: Boolean,
    timeSpent: Number // seconds
  }],
  quizPassed: { type: Boolean, default: false },
  bestQuizScore: Number,
  
  // Timing
  startedAt: Date,
  completedAt: Date,
  timeSpent: { type: Number, default: 0 }, // seconds
  
  // Status
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed'], 
    default: 'not_started' 
  }
});

const CourseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse', required: true },
  
  // Section progress
  sectionProgress: [SectionProgressSchema],
  currentSectionIndex: { type: Number, default: 0 },
  
  // Assessment results
  assessmentAttempts: [{
    attemptedAt: { type: Date, default: Date.now },
    answers: mongoose.Schema.Types.Mixed,
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    passed: Boolean,
    timeUsed: Number, // seconds
    questionOrder: [Number] // if shuffled
  }],
  assessmentPassed: { type: Boolean, default: false },
  bestAssessmentScore: Number,
  assessmentAttemptsRemaining: Number,
  
  // Overall progress
  overallProgress: { type: Number, default: 0 }, // 0-100 percentage
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed', 'certified'], 
    default: 'not_started' 
  },
  
  // Timing
  enrolledAt: { type: Date, default: Date.now },
  startedAt: Date,
  lastAccessedAt: { type: Date, default: Date.now },
  completedAt: Date,
  totalTimeSpent: { type: Number, default: 0 }, // seconds
  
  // Certificate (if completed)
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  certificateIssuedAt: Date

}, { timestamps: true });

// Compound index for efficient lookups
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
CourseProgressSchema.index({ userId: 1, status: 1 });

// Method to calculate overall progress
CourseProgressSchema.methods.calculateOverallProgress = function() {
  if (!this.sectionProgress || this.sectionProgress.length === 0) {
    return 0;
  }
  
  const completedSections = this.sectionProgress.filter(s => s.status === 'completed').length;
  const totalSections = this.sectionProgress.length;
  
  // Weight: 80% sections, 20% final assessment
  const sectionWeight = 0.8;
  const assessmentWeight = 0.2;
  
  const sectionProgress = (completedSections / totalSections) * 100 * sectionWeight;
  const assessmentProgress = this.assessmentPassed ? 100 * assessmentWeight : 0;
  
  return Math.round(sectionProgress + assessmentProgress);
};

// Method to check if eligible for certificate
CourseProgressSchema.methods.isEligibleForCertificate = function() {
  const allSectionsCompleted = this.sectionProgress.every(s => s.status === 'completed');
  return allSectionsCompleted && this.assessmentPassed;
};

const CourseProgress = mongoose.model('InteractiveCourseProgress', CourseProgressSchema);

// ============================================================================
// CONTENT INTERACTION LOG - Detailed tracking for analytics
// ============================================================================
const ContentInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse', required: true },
  sectionIndex: { type: Number, required: true },
  blockIndex: { type: Number, required: true },
  blockType: { type: String, required: true },
  
  // Interaction details
  action: { 
    type: String, 
    enum: ['view', 'expand', 'collapse', 'answer', 'complete', 'retry'],
    required: true 
  },
  
  // For quiz/interactive blocks
  isCorrect: Boolean,
  selectedOptions: [Number],
  score: Number,
  attemptNumber: Number,
  
  // Timing
  timestamp: { type: Date, default: Date.now },
  timeSpent: Number // seconds on this block
  
}, { timestamps: true });

ContentInteractionSchema.index({ userId: 1, courseId: 1, timestamp: -1 });
ContentInteractionSchema.index({ courseId: 1, blockType: 1 });

const ContentInteraction = mongoose.model('ContentInteraction', ContentInteractionSchema);

// ES Module exports
export { Course, CourseProgress, ContentInteraction };
export default { Course, CourseProgress, ContentInteraction };
