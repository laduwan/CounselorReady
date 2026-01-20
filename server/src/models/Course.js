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
  pricingTier: {
    type: String,
    enum: ['standard', 'premium'],
    default: 'standard'
  }, // Premium for Ethics, Telehealth, Supervision
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
  
  // Multi-Approval Body Support (for courses approved by multiple organizations)
  approvals: [{
    body: {
      type: String,
      enum: ['NBCC', 'GCSCW', 'ACA', 'NASW', 'APA', 'ASWB', 'AAMFT', 'GA-LPC-Board', 'GA-LCSW-Board', 'GA-LMFT-Board', 'State Board', 'Other'],
      required: true
    },
    providerNumber: { type: String }, // e.g., '#7760' for NBCC ACEP
    providerName: { type: String }, // Display name for the provider
    status: {
      type: String,
      enum: ['approved', 'pending', 'expired', 'not-applied'],
      default: 'approved'
    },
    approvalDate: { type: Date },
    expirationDate: { type: Date },
    notes: { type: String } // Any special notes about this approval
  }],
  
  // Legacy fields (retained for backward compatibility - will be deprecated)
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
  stateCompliance: [{
    type: String // State codes this course is compliant with
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
    
    // Quiz/Test Retake Settings
    allowRetakes: { type: Boolean, default: true }, // Allow quiz retakes at all
    retakePolicy: { 
      type: String, 
      enum: ['unlimited', 'limited', 'first_final'], 
      default: 'unlimited' 
    },
    maxRetakes: { type: Number, default: 3 }, // If 'limited', how many attempts
    retakeCooldown: { type: Number, default: 0 }, // Hours between retakes (0 = immediate)
    scorePolicy: { 
      type: String, 
      enum: ['highest', 'latest', 'first', 'average'], 
      default: 'highest' 
    }, // Which score counts
    
    // Anti-speedrun / Pacing controls
    enforceMinTime: { type: Boolean, default: false }, // Require minimum time on lessons
    minTimePercent: { type: Number, default: 80 }, // % of estimated duration required (e.g., 80% of 10min = 8min)
    
    // CE Compliance
    requireEvaluation: { type: Boolean, default: true }, // Require course evaluation before certificate
    requireAttestation: { type: Boolean, default: true }, // Require attestation statement
    attestationText: { 
      type: String, 
      default: 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance.'
    },
    
    // Narration / Text-to-Speech
    narrationEnabled: { type: Boolean, default: false },
    narrationVoice: { 
      type: String, 
      enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'browser'], 
      default: 'nova' 
    }, // OpenAI voices or browser TTS
    narrationSpeed: { type: Number, default: 1.0 }, // 0.5 to 2.0
    autoPlayNarration: { type: Boolean, default: false } // Auto-start when lesson loads
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
  
  // NBCC Compliance: Reference List (Section J.6.a.5)
  references: [{
    title: { type: String, required: true },
    author: { type: String },
    year: { type: Number },
    source: { type: String }, // Journal name, publisher, URL, etc.
    doi: { type: String },
    url: { type: String }
  }],
  
  // NBCC Compliance: Presenter/Author Information (Section F)
  presenter: {
    name: { type: String },
    credentials: { type: String }, // e.g., "MA, LPC, CPCS, BC-TMH"
    degree: { type: String }, // e.g., "Master of Arts in Professional Counseling"
    institution: { type: String }, // Degree-granting institution
    licenseNumber: { type: String },
    licenseState: { type: String },
    bio: { type: String },
    presenterCategory: {
      type: String,
      enum: ['category1', 'category2', 'category3'],
      default: 'category1'
    }, // NBCC presenter qualification category
    qualificationStatement: { type: String } // Statement of qualification for subject matter
  },
  
  // NBCC Content Area (Section G) - Required for mapping courses to NBCC categories
  nbccContentArea: {
    type: String,
    enum: [
      'counseling-theory-practice',      // 1. Counseling Theory/Practice
      'human-growth-development',         // 2. Human Growth and Development
      'social-cultural-foundations',      // 3. Social and Cultural Foundations
      'group-dynamics-counseling',        // 4. Group Dynamics and Counseling
      'career-development-counseling',    // 5. Career Development and Counseling
      'assessment',                        // 6. Assessment
      'research-program-evaluation',      // 7. Research and Program Evaluation
      'professional-identity-practice',   // 8. Professional Identity and Practice Issues
      'wellness-prevention'               // 9. Wellness and Prevention
    ]
  },
  nbccContentAreaDisplay: { type: String }, // Human-readable content area name
  
  // Metadata (legacy field retained for backward compatibility)
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

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

// Virtual to check if course has NBCC approval
courseSchema.virtual('hasNBCCApproval').get(function() {
  if (this.approvals && this.approvals.length > 0) {
    return this.approvals.some(a => a.body === 'NBCC' && a.status === 'approved');
  }
  // Fallback to legacy field
  return this.approvingBody === 'NBCC' || this.approvingBody === 'ACEP';
});

// Virtual to get all active approvals
courseSchema.virtual('activeApprovals').get(function() {
  if (!this.approvals || this.approvals.length === 0) {
    // Create legacy approval object for backward compatibility
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
  // Fallback to legacy
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

const Course = mongoose.model('Course', courseSchema);

export default Course;
