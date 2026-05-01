/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

// ============================================
// INTERACTIVE CONTENT BLOCK SCHEMAS (NEW)
// ============================================

// Accordion items for expandable content
const accordionItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false });

// Matching pairs for drag-and-drop exercises
const matchingPairSchema = new mongoose.Schema({
  term: { type: String, required: true },
  definition: { type: String, required: true }
}, { _id: false });

// Quiz question schema (enhanced)
const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['multiple_choice', 'true_false', 'multiple_select', 'multipleChoice', 'multiSelect', 'trueFalse'],
    default: 'multiple_choice'
  },
  options: [{
    text: { type: String },
    isCorrect: { type: Boolean, default: false }
  }],
  // Legacy support for old format
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  explanation: { type: String },
  points: { type: Number, default: 1 }
});

// ============================================
// LESSON SCHEMA (ENHANCED)
// ============================================

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: [
      // Original types
      'video', 'text', 'quiz', 'download',
      // New interactive types
      'accordion', 'matching', 'multipleChoice', 'multiSelect', 
      'imageText', 'sectionDivider', 'timedAssessment'
    ],
    default: 'text'
  },
  content: { type: String }, // HTML for text, URL for video/download
  videoUrl: { type: String },
  duration: { type: Number }, // Minutes
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  resources: [{
    title: { type: String },
    url: { type: String },
    type: { type: String, enum: ['pdf', 'doc', 'worksheet', 'slides', 'other'], default: 'pdf' }
  }],
  transcript: { type: String },
  
  // ============================================
  // INTERACTIVE CONTENT FIELDS (NEW)
  // ============================================
  
  // Accordion content
  accordionItems: [accordionItemSchema],
  allowMultipleOpen: { type: Boolean, default: true },
  
  // Matching exercise
  matchingPairs: [matchingPairSchema],
  matchingInstructions: { type: String, default: 'Drag each term to its matching definition' },
  
  // Image + Text card
  image: { type: String },
  imageAlt: { type: String },
  imagePosition: { type: String, enum: ['left', 'right'], default: 'left' },
  highlight: { type: Boolean, default: false },
  
  // Section divider
  sectionNumber: { type: Number },
  subtitle: { type: String },
  
  // Quiz-specific fields (original + enhanced)
  questions: [quizQuestionSchema],
  shuffleQuestions: { type: Boolean, default: false },
  shuffleOptions: { type: Boolean, default: false },
  showExplanations: { type: Boolean, default: true },
  timeLimit: { type: Number }, // Minutes, null = no limit
  passThreshold: { type: Number, default: 0.8 }, // 80% to pass
  
  // For standalone question lessons (multipleChoice, multiSelect types)
  question: { type: String },
  options: [{
    text: { type: String },
    isCorrect: { type: Boolean, default: false }
  }],
  explanation: { type: String }
});

// ============================================
// MODULE SCHEMA
// ============================================

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  objectives: [{ type: String }],
  lessons: [lessonSchema],
  
  // Module-level quiz (optional)
  hasQuiz: { type: Boolean, default: false },
  quizQuestions: [quizQuestionSchema],
  quizPassThreshold: { type: Number, default: 0.8 }
});

// ============================================
// COURSE SCHEMA
// ============================================

const courseSchema = new mongoose.Schema({
  // Basic info
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  courseCode: { type: String, trim: true },
  description: { type: String },
  thumbnail: { type: String },
  
  // External/Imported course fields
  isExternal: { type: Boolean, default: false },
  externalUrl: { type: String },
  importType: { 
    type: String, 
    enum: ['native', 'external', 'scorm', 'starter', 'interactive'],
    default: 'native'
  },
  source: { 
    type: String, 
    enum: ['native', 'external', 'scorm', 'lti', 'xapi'],
    default: 'native'
  },
  
  // Learning objectives
  objectives: [{ type: String }],
  
  // Pricing
  accessType: {
    type: String,
    enum: ['free', 'paid', 'subscription'],
    default: 'paid'
  },
  price: { type: Number },
  pricingTier: {
    type: String,
    enum: ['standard', 'premium'],
    default: 'standard'
  },
  stripePriceId: { type: String },
  accessTier: {
    type: String,
    enum: ['free', 'starter', 'professional', 'vip', 'premium'],
    default: 'free'
  },
  
  // CEU info
  ceuEligible: { type: Boolean, default: false },
  ceuHours: { type: Number },
  ceuCategories: [{
    category: { type: String },
    hours: { type: Number }
  }],
  ceuApprovalNumber: { type: String },
  
  // Multi-Approval Body Support
  approvals: [{
    body: {
      type: String,
      enum: ['NBCC', 'ACEP', 'LPCAGA', 'GSCSW', 'ACA', 'NASW', 'APA', 'ASWB', 'AAMFT', 'State Board', 'Other'],
      required: true
    },
    providerNumber: { type: String },
    providerName: { type: String },
    status: {
      type: String,
      enum: ['approved', 'pending', 'expired', 'not-applied'],
      default: 'approved'
    },
    approvalDate: { type: Date },
    expirationDate: { type: Date },
    notes: { type: String },

    // Per-approval hour-type breakdown (required for LPCAGA + GSCSW
    // certificate compliance — boards audit for explicit core/ethics split)
    coreHours: { type: Number, default: 0, min: 0 },
    ethicHours: { type: Number, default: 0, min: 0 },

    // Delivery format — feeds the LPCA-GA mandatory disclosure sentence
    // template at certificate-generation time. AW/LW/MLW/S/C from LPCA-GA's
    // approval type taxonomy.
    deliveryFormat: {
      type: String,
      enum: [
        'asynchronous',          // AW — on-demand, 1-year validity
        'live-webinar',          // LW — single live online date
        'multi-live-workshop',   // MLW — series of live sessions, 12 mo
        'in-person-single',      // S — one in-person date
        'in-person-conference',  // C — multi-day in-person
      ],
      default: 'asynchronous'
    }
  }],
  
  // Legacy fields (retained for backward compatibility)
  approvingBody: {
    type: String,
    enum: ['NBCC', 'ACEP', 'LPCAGA', 'GSCSW', 'ACA', 'NASW', 'APA', 'ASWB', 'AAMFT', 'State Board', 'Other'],
    default: 'NBCC'
  },
  approvingBodyOther: { type: String },
  approvalNumber: { type: String },
  applicability: {
    type: String,
    enum: ['national', 'state-specific'],
    default: 'national'
  },
  applicableStates: [{ type: String }],
  stateCompliance: [{ type: String }],
  
  // Content
  modules: [moduleSchema],
  
  // ============================================
  // FINAL ASSESSMENT (NEW - for interactive courses)
  // ============================================
  assessment: {
    title: { type: String, default: 'Final Assessment' },
    timeLimit: { type: Number, default: 30 }, // minutes
    passThreshold: { type: Number, default: 0.8 },
    attemptsAllowed: { type: Number, default: 3 },
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },
    questions: [quizQuestionSchema],
    nbccProgramNumber: { type: String }
  },
  
  // Target audience (NEW)
  targetAudience: [{ type: String }],
  categories: [{ type: String }],
  tags: [{ type: String }],
  
  // Settings
  settings: {
    linearProgression: { type: Boolean, default: false },
    dripEnabled: { type: Boolean, default: false },
    dripSchedule: [{
      moduleId: { type: mongoose.Schema.Types.ObjectId },
      daysAfterEnrollment: { type: Number }
    }],
    certificateEnabled: { type: Boolean, default: true },
    certificateCustomization: {
      // Layout
      layout: { type: String, enum: ['classic', 'modern', 'elegant', 'minimal'], default: 'classic' },
      orientation: { type: String, enum: ['landscape', 'portrait'], default: 'landscape' },
      // Colors
      borderColor: { type: String, default: '#10B981' },
      accentColor: { type: String, default: '#06B6D4' },
      headerColor: { type: String, default: '#1e293b' },
      textColor: { type: String, default: '#64748b' },
      backgroundColor: { type: String, default: '#f8fafc' },
      // Branding
      logoUrl: { type: String },
      showNbccLogo: { type: Boolean, default: true },
      signatureUrl: { type: String },
      signerName: { type: String, default: 'CounselorReady' },
      signerTitle: { type: String, default: 'NBCC Provider ACEP #7760' },
      // Content
      certificateTitle: { type: String, default: 'Certificate of Completion' },
      customFooter: { type: String },
      showVerificationCode: { type: Boolean, default: true },
      showCeHours: { type: Boolean, default: true },
      showCompletionDate: { type: Boolean, default: true }
    },
    passingScore: { type: Number, default: 70 },
    
    // Quiz/Test Retake Settings
    allowRetakes: { type: Boolean, default: true },
    retakePolicy: { 
      type: String, 
      enum: ['unlimited', 'limited', 'first_final'], 
      default: 'unlimited' 
    },
    maxRetakes: { type: Number, default: 3 },
    retakeCooldown: { type: Number, default: 0 },
    scorePolicy: { 
      type: String, 
      enum: ['highest', 'latest', 'first', 'average'], 
      default: 'highest' 
    },
    
    // Anti-speedrun / Pacing controls
    enforceMinTime: { type: Boolean, default: false },
    minTimePercent: { type: Number, default: 80 },
    
    // CE Compliance
    requireEvaluation: { type: Boolean, default: true },
    requireAttestation: { type: Boolean, default: true },
    attestationText: { 
      type: String, 
      default: 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance.'
    },
    
    // Adaptive Learning Paths
    adaptiveEnabled: { type: Boolean, default: false },
    adaptiveRules: [{
      sectionIndex: { type: Number, required: true },
      condition: { type: String, enum: ['score_below', 'score_above', 'failed'], required: true },
      threshold: { type: Number, default: 0.7 },
      action: { type: String, enum: ['redirect', 'require_review', 'skip_ahead'], required: true },
      targetSectionIndex: { type: Number, required: true },
      message: { type: String, default: '' }
    }],

    // Narration / Text-to-Speech
    narrationEnabled: { type: Boolean, default: false },
    narrationVoice: { 
      type: String, 
      enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'browser'], 
      default: 'nova' 
    },
    narrationSpeed: { type: Number, default: 1.0 },
    autoPlayNarration: { type: Boolean, default: false }
  },
  
  // Course Evaluation Questions
  evaluationQuestions: [{
    question: { type: String },
    type: { type: String, enum: ['rating', 'text', 'yes_no', 'scale_10', 'multiple_choice'], default: 'rating' },
    options: [{ type: String }],
    required: { type: Boolean, default: true }
  }],
  
  // Analytics & Popularity Tracking
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    avgTimeToComplete: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    recommendRate: { type: Number, default: 0 },
  },
  
  // Individual ratings
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    wouldRecommend: { type: Boolean },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // NBCC Compliance: Reference List
  references: [{
    title: { type: String, required: true },
    author: { type: String },
    year: { type: Number },
    source: { type: String },
    doi: { type: String },
    url: { type: String }
  }],
  
  // NBCC Compliance: Presenter/Author Information
  presenter: {
    name: { type: String },
    credentials: { type: String },
    degree: { type: String },
    institution: { type: String },
    licenseNumber: { type: String },
    licenseState: { type: String },
    bio: { type: String },
    presenterCategory: {
      type: String,
      enum: ['category1', 'category2', 'category3'],
      default: 'category1'
    },
    qualificationStatement: { type: String }
  },
  
  // NBCC Content Area
  nbccContentArea: {
    type: String,
    enum: [
      'counseling-theory-practice',
      'human-growth-development',
      'social-cultural-foundations',
      'group-dynamics-counseling',
      'career-development-counseling',
      'assessment',
      'research-program-evaluation',
      'professional-identity-practice',
      'wellness-prevention'
    ]
  },
  nbccContentAreaDisplay: { type: String },
  
  // Metadata
  instructor: { type: String, default: 'CounselorReady' },
  author: { type: String },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: { type: Date },
  
  // Stats
  enrollmentCount: { type: Number, default: 0 },
  
  // Calculated fields (for interactive courses)
  totalEstimatedTime: { type: Number }, // minutes
  totalContentBlocks: { type: Number },
  totalQuizQuestions: { type: Number }
}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

courseSchema.index({ status: 1 });
courseSchema.index({ accessType: 1 });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// ============================================
// VIRTUALS
// ============================================

// Virtual for total lessons
courseSchema.virtual('totalLessons').get(function() {
  if (!this.modules || !Array.isArray(this.modules)) return 0;
  return this.modules.reduce((total, mod) => total + (mod.lessons?.length || 0), 0);
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  if (!this.modules || !Array.isArray(this.modules)) return 0;
  let total = 0;
  this.modules.forEach(mod => {
    if (mod.lessons && Array.isArray(mod.lessons)) {
      mod.lessons.forEach(lesson => {
        if (lesson.duration) total += lesson.duration;
      });
    }
  });
  return total;
});

// Virtual to check if course has NBCC approval
courseSchema.virtual('hasNBCCApproval').get(function() {
  if (this.approvals && this.approvals.length > 0) {
    return this.approvals.some(a => a.body === 'NBCC' && a.status === 'approved');
  }
  return this.approvingBody === 'NBCC' || this.approvingBody === 'ACEP';
});

// Virtual to get all active approvals
courseSchema.virtual('activeApprovals').get(function() {
  if (!this.approvals || this.approvals.length === 0) {
    if (this.approvingBody) {
      return [{
        body: this.approvingBody === 'ACEP' ? 'NBCC' : this.approvingBody,
        providerNumber: this.approvalNumber || '#7760',
        providerName: 'GA Integrated Therapeutic Perspectives LLC',
        status: 'approved'
      }];
    }
    return [];
  }
  return this.approvals.filter(a => a.status === 'approved');
});

// Virtual to get NBCC approval specifically
courseSchema.virtual('nbccApproval').get(function() {
  if (this.approvals && this.approvals.length > 0) {
    return this.approvals.find(a => a.body === 'NBCC' && a.status === 'approved');
  }
  if (this.approvingBody === 'NBCC' || this.approvingBody === 'ACEP') {
    return {
      body: 'NBCC',
      providerNumber: this.approvalNumber || '#7760',
      providerName: 'GA Integrated Therapeutic Perspectives LLC',
      status: 'approved'
    };
  }
  return null;
});

// Virtual for interactive lesson count
courseSchema.virtual('interactiveLessonCount').get(function() {
  if (!this.modules || !Array.isArray(this.modules)) return 0;
  let count = 0;
  this.modules.forEach(mod => {
    if (mod.lessons && Array.isArray(mod.lessons)) {
      mod.lessons.forEach(lesson => {
        if (['accordion', 'matching', 'multipleChoice', 'multiSelect', 'imageText'].includes(lesson.type)) {
          count++;
        }
      });
    }
  });
  return count;
});

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Calculate totals before saving
courseSchema.pre('save', function(next) {
  // Calculate total estimated time
  let totalTime = 0;
  let totalBlocks = 0;
  let totalQuestions = 0;
  
  if (this.modules && Array.isArray(this.modules)) {
    this.modules.forEach(mod => {
      if (mod.lessons && Array.isArray(mod.lessons)) {
        mod.lessons.forEach(lesson => {
          totalBlocks++;
          if (lesson.duration) totalTime += lesson.duration;
          if (lesson.questions) totalQuestions += lesson.questions.length;
        });
      }
      if (mod.quizQuestions) totalQuestions += mod.quizQuestions.length;
    });
  }
  
  if (this.assessment?.questions) {
    totalQuestions += this.assessment.questions.length;
  }
  
  this.totalEstimatedTime = totalTime;
  this.totalContentBlocks = totalBlocks;
  this.totalQuizQuestions = totalQuestions;
  
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
