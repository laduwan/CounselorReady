import mongoose from 'mongoose';

// ============================================================================
// COURSE SCHEMA - Defines course structure with sections and content blocks
// ============================================================================
const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['accordion', 'matching', 'multipleChoice', 'multiSelect', 'imageText', 'sectionDivider', 'text', 'video', 'reflection', 'resources'],
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
  videoDuration: Number, // in seconds
  
  // Reflection
  minLength: Number,
  
  // Resources
  resources: [{
    title: String,
    url: String,
    type: String
  }]
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
  
  // Learning objectives (ACEP required)
  objectives: [String],
  
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
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse' }],
  
  // Presenter/Author info (ACEP required)
  presenter: {
    name: String,
    credentials: String,
    degree: String,
    licenseNumber: String,
    licenseState: String,
    qualificationStatement: String,
    category: { type: String, enum: ['category1', 'category2', 'category3'] } // ACEP categories
  },
  
  // References (ACEP required)
  references: [String],
  
  // Metadata
  author: String,
  publishedAt: Date,
  updatedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  
  // Delivery & compliance
  deliveryFormat: { 
    type: String, 
    enum: ['async', 'live', 'hybrid'], 
    default: 'async' 
  },
  nbccContentAreas: [{
    type: String,
    enum: [
      'Counseling Theory/Practice',
      'Human Growth and Development',
      'Social and Cultural Foundations',
      'Group Dynamics',
      'Career Development',
      'Assessment',
      'Research/Program Evaluation',
      'Professional Identity',
      'Wellness and Prevention'
    ]
  }],
  accessType: {
    type: String,
    enum: ['free', 'subscription', 'purchase'],
    default: 'subscription'
  },
  approvalBody: { type: String, default: 'NBCC' },
  price: Number,

  // Calculated fields
  totalEstimatedTime: Number, // in minutes
  totalContentBlocks: Number,
  totalQuizQuestions: Number,
  wordCount: Number // pre-computed for admin dashboard
  
}, { timestamps: true });

// Pre-save hook to calculate totals
CourseSchema.pre('save', function(next) {
  this.totalEstimatedTime = this.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
  this.totalContentBlocks = this.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
  this.totalQuizQuestions = this.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) 
    + (this.assessment?.questions?.length || 0);
  // Calculate word count from all content blocks
  let wc = 0;
  this.sections.forEach(s => {
    (s.contentBlocks || []).forEach(b => {
      const txt = b.textContent || b.content || b.html || b.body || '';
      const plain = txt.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
      if (plain) wc += plain.split(/\s+/).filter(w => w.length > 0).length;
    });
  });
  this.wordCount = wc;
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
  
  // =====================================
  // NEW: Evaluation tracking
  // =====================================
  evaluationSubmitted: { type: Boolean, default: false },
  evaluationSubmittedAt: Date,
  evaluationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' },
  
  // =====================================
  // NEW: Attestation tracking
  // =====================================
  attestationAgreed: { type: Boolean, default: false },
  attestationAgreedAt: Date,
  attestationText: { 
    type: String, 
    default: 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance. I understand that falsifying this attestation may result in revocation of CE credits.'
  },
  
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
  
  // Weight: 60% sections, 20% assessment, 10% evaluation, 10% attestation
  const sectionWeight = 0.6;
  const assessmentWeight = 0.2;
  const evaluationWeight = 0.1;
  const attestationWeight = 0.1;
  
  const sectionProgress = (completedSections / totalSections) * 100 * sectionWeight;
  const assessmentProgress = this.assessmentPassed ? 100 * assessmentWeight : 0;
  const evaluationProgress = this.evaluationSubmitted ? 100 * evaluationWeight : 0;
  const attestationProgress = this.attestationAgreed ? 100 * attestationWeight : 0;
  
  return Math.round(sectionProgress + assessmentProgress + evaluationProgress + attestationProgress);
};

// Method to check if eligible for certificate
CourseProgressSchema.methods.isEligibleForCertificate = function() {
  const allSectionsCompleted = this.sectionProgress.every(s => s.status === 'completed');
  return allSectionsCompleted && 
         this.assessmentPassed && 
         this.evaluationSubmitted && 
         this.attestationAgreed;
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
