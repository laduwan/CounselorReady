import mongoose from 'mongoose';

// Quiz question schema
const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['multiple_choice', 'true_false', 'multiple_select'],
    default: 'multiple_choice'
  },
  options: [{ type: String }], // For multiple choice
  correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Index for MC, boolean for T/F, array for multi-select
  explanation: { type: String }, // Shown after answering
  points: { type: Number, default: 1 }
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'download'],
    default: 'text'
  },
  content: { type: String }, // HTML for text, URL for video/download
  videoUrl: { type: String },
  duration: { type: Number }, // Minutes
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false }, // Preview lesson?
  resources: [{ // Downloadable resources/handouts
    title: { type: String },
    url: { type: String },
    type: { type: String, enum: ['pdf', 'doc', 'worksheet', 'slides', 'other'], default: 'pdf' }
  }],
  transcript: { type: String }, // Plain text transcript for accessibility
  
  // Quiz-specific fields
  questions: [quizQuestionSchema],
  shuffleQuestions: { type: Boolean, default: false },
  shuffleOptions: { type: Boolean, default: false },
  showExplanations: { type: Boolean, default: true }, // Show correct answer explanations after quiz
  timeLimit: { type: Number } // Minutes, null = no limit
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  objectives: [{ type: String }], // Learning objectives for this module
  lessons: [lessonSchema]
});

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
  description: { type: String, required: true },
  thumbnail: { type: String },
  
  // External/Imported course fields
  isExternal: { type: Boolean, default: false },
  externalUrl: { type: String },
  importType: { 
    type: String, 
    enum: ['native', 'external', 'scorm', 'starter'],
    default: 'native'
  },
  source: { 
    type: String, 
    enum: ['native', 'external', 'scorm', 'lti', 'xapi'],
    default: 'native'
  },
  
  // Learning objectives
  objectives: [{ type: String }], // Course-level learning objectives
  
  // Pricing
  accessType: {
    type: String,
    enum: ['free', 'paid', 'subscription'],
    default: 'paid'
  },
  price: { type: Number }, // One-time price if applicable
  stripePriceId: { type: String },
  accessTier: { 
    type: String, 
    enum: ['free', 'professional', 'vip'], 
    default: 'free' 
  }, // Which subscription tier can access
  
  // CEU info (for continuing ed courses)
  ceuEligible: { type: Boolean, default: false },
  ceuHours: { type: Number },
  ceuCategories: [{
    category: { type: String },
    hours: { type: Number }
  }],
  ceuApprovalNumber: { type: String },
  
  // Approving Body & Applicability (for CE tracking)
  approvingBody: {
    type: String,
    enum: ['NBCC', 'ACEP', 'ACA', 'NASW', 'APA', 'ASWB', 'AAMFT', 'LPCAGA', 'State Board', 'Other'],
    default: 'NBCC'
  },
  approvingBodyOther: { type: String }, // If "Other" selected
  approvalNumber: { type: String }, // ACEP#, provider#, etc.
  applicability: {
    type: String,
    enum: ['national', 'state-specific'],
    default: 'national'
  },
  applicableStates: [{ 
    type: String // State codes: "GA", "FL", etc. Empty = all states
  }],
  
  // Content
  modules: [moduleSchema],
  
  // Settings
  settings: {
    linearProgression: { type: Boolean, default: false }, // Must complete lessons in order
    dripEnabled: { type: Boolean, default: false },
    dripSchedule: [{
      moduleId: { type: mongoose.Schema.Types.ObjectId },
      daysAfterEnrollment: { type: Number }
    }],
    certificateEnabled: { type: Boolean, default: true },
    passingScore: { type: Number, default: 70 },
    
    // Anti-speedrun / Pacing controls
    enforceMinTime: { type: Boolean, default: false }, // Require minimum time on lessons
    minTimePercent: { type: Number, default: 80 }, // % of estimated duration required (e.g., 80% of 10min = 8min)
    
    // CE Compliance
    requireEvaluation: { type: Boolean, default: true }, // Require course evaluation before certificate
    requireAttestation: { type: Boolean, default: true }, // Require attestation statement
    attestationText: { 
      type: String, 
      default: 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance.'
    }
  },
  
  // Course Evaluation Questions (customizable per course)
  evaluationQuestions: [{
    question: { type: String },
    type: { type: String, enum: ['rating', 'text', 'yes_no', 'scale_10', 'multiple_choice'], default: 'rating' },
    options: [{ type: String }], // For multiple_choice type
    required: { type: Boolean, default: true }
  }],
  
  // Analytics & Popularity Tracking
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // completions / enrollments * 100
    avgTimeToComplete: { type: Number, default: 0 }, // Hours
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    recommendRate: { type: Number, default: 0 }, // % who would recommend
  },
  
  // Individual ratings for calculating averages
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    wouldRecommend: { type: Boolean },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Metadata
  instructor: { type: String, default: 'CounselorReady' },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: { type: Date },
  
  // Stats
  enrollmentCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ accessType: 1 });

// Virtual for total lessons (with null safety)
courseSchema.virtual('totalLessons').get(function() {
  if (!this.modules || !Array.isArray(this.modules)) return 0;
  return this.modules.reduce((total, mod) => total + (mod.lessons?.length || 0), 0);
});

// Virtual for total duration (with null safety)
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

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
