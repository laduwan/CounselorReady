import mongoose from 'mongoose';

// ============================================================================
// REMEDIATION SUB-SCHEMA
// ----------------------------------------------------------------------------
// Optional. Attached to KC content blocks (multipleChoice, multiSelect,
// matching) to enable adaptive remediation: when a learner answers wrong,
// CReady Viewer shows a "Review this content" button that jumps back to
// the block that teaches the tested concept.
//
// blockId references the `id` field of another content block within the
// SAME section (seed scripts and CourseBuilder set stable string IDs on
// every block; Mongoose persists them via strict:false on ContentBlockSchema).
// If the referenced block is missing, the viewer silently omits the button.
// ============================================================================
const RemediationSchema = new mongoose.Schema({
  blockId: { type: String, default: '' },
  message: { type: String, default: '' },
  confidence: {
    type: String,
    enum: ['high', 'medium', 'low', ''],
    default: ''
  },
  source: {
    type: String,
    enum: ['manual', 'ai', ''],
    default: ''
  }
}, { _id: false });

// ============================================================================
// COURSE SCHEMA - Defines course structure with sections and content blocks
// ============================================================================
const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'accordion',
      'callout',
      'cardSort',
      'clinicalVignette',
      'deliverables',
      'fillInBlank',
      'flashcardDeck',
      'hotspot',
      'image',
      'imageText',
      'keyTakeaway',
      'knowledgeCheck',
      'matching',
      'multiSelect',
      'multipleChoice',
      'quiz',
      'references',
      'reflection',
      'resources',
      'scenarioTree',
      'sectionDivider',
      'sequencing',
      'text',
      'timeline',
      'video',
      'videoEmbed',
    ],
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

  // ── ADAPTIVE REMEDIATION (optional, KC blocks only) ──
  // Valid on: multipleChoice, multiSelect, matching
  // Ignored by viewer on all other block types.
  // See RemediationSchema above.
  remediation: RemediationSchema,
  
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
  minLength: { type: Number, default: 50 },
  
  // Resources
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'video', 'link', 'article', 'website', 'book', 'xlsx', 'xls', 'csv', 'docx', 'doc', 'pptx', 'ppt', 'zip', 'worksheet', 'toolkit', 'template', 'guide'], default: 'link' }
  }],

  // ── callout ──
  calloutType: { type: String, enum: ['info', 'warning', 'ethics', 'clinical', 'tip', 'key', 'donot', 'protocol'], default: 'info' },
  calloutItems: [String],

  // ── fillInBlank ──
  blanks: [{
    prompt: String,
    answer: String,
    acceptAlternates: [String],
  }],

  // ── keyTakeaway ──
  takeaways: [String],

  // ── video / videoEmbed ──
  videoTitle: String,
  markers: [{
    time: String,
    label: String,
    prompt: String
  }],

  // ── flashcardDeck ──
  flashcards: [{
    id: String,
    front: String,
    back: String
  }],

  // ── scenarioTree ──
  scenarioTitle: String,
  startNode: { type: String, default: 'start' },
  nodes: { type: mongoose.Schema.Types.Mixed },

  // ── cardSort ──
  categories: [String],
  cards: [{
    id: String,
    text: String,
    correctCategory: String
  }],

  // ── sequencing ──
  steps: [{
    id: String,
    text: String,
    order: Number
  }],

  // ── timeline ──
  events: [{
    year: String,
    text: String
  }],

  // ── hotspot ──
  hotspotImage: String,
  imageDescription: String,
  hotspots: [{
    x: Number,
    y: Number,
    label: String,
    info: String,
    description: String
  }],

  // ── image (standalone) ──
  imageUrl: String,
  imageAltText: String,
  imageCaption: String,
  imageSize: { type: String, enum: ['small', 'medium', 'full'], default: 'full' },
  imageAlignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' },

  // ── references ──
  references: [{
    formatted: String,
    title: String,
    author: String,
    year: Number,
    source: String,
    url: String
  }]
}, { _id: false, strict: false });

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

  // Multi-Approval Body Support — mirrors the structure on Course.js
  // (PR #384). Each entry tracks one approval letter with flexible
  // hour-type breakdown and delivery format for audit-compliant
  // certificate rendering. The legacy `approvalBody` field stays as-is
  // for backward compat; new courses populate this array.
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

    // Per-approval hour-type breakdown. Replaces the old coreHours/ethicHours
    // flat fields to support arbitrary categories (ethics, core, telehealth, etc.).
    // Each entry: { label: 'ethics', hours: 3 }
    // Certificate generator reads this array to render the hour breakdown
    // on the PDF for the user's selected approval body.
    hourBreakdown: [{
      label: { type: String, required: true },  // 'core' | 'ethics' | 'telehealth' | any string
      hours: { type: Number, required: true, min: 0 }
    }],

    // Delivery format — feeds the LPCA-GA mandatory disclosure
    // sentence template at certificate-generation time. AW/LW/MLW/S/C
    // from LPCA-GA's approval type taxonomy.
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
  
  // References (ACEP required) — supports strings or {author,year,title,source,citation} objects
  references: [mongoose.Schema.Types.Mixed],
  
  // Supplementary resources (PDFs, worksheets, links)
  resources: [mongoose.Schema.Types.Mixed],
  
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

  // ACA Code of Ethics — subsection-level tagging.
  // Format: section letter A-I + dot + subsection number (e.g. 'A.1', 'B.6').
  // Section-level rollup is computed in code:
  //   course.acaCodeSections.map(s => s.split('.')[0])
  // Powers the platform's content-overlap-prevention feature
  // (showing users courses that don't repeat content they've already covered).
  // Full mapping of subsection → topic is in
  // server/src/reference-taxonomies/aca-code-sections.js
  acaCodeSections: [{
    type: String,
    match: /^[A-I]\.\d+$/
  }],

  accessType: {
    type: String,
    enum: ['free', 'subscription', 'purchase'],
    default: 'subscription'
  },
  approvalBody: { type: String, default: 'NBCC' },
  price: Number,

  // Course delivery rules
  minimumTimeMinutes: { type: Number, default: 0 },
  dripEnabled: { type: Boolean, default: false },
  dripIntervalMinutes: { type: Number, default: 0 },
  dripSectionsPerInterval: { type: Number, default: 1 },
  enforceSectionOrder: { type: Boolean, default: true },
  previousSectionsReviewable: { type: Boolean, default: true },
  narrationEnabled: { type: Boolean, default: false },
  attestationRequired: { type: Boolean, default: true },
  certificateEnabled: { type: Boolean, default: true },
  maxAttempts: { type: Number, default: 3 },

  // Calculated fields
  totalEstimatedTime: Number, // in minutes
  totalContentBlocks: Number,
  totalQuizQuestions: Number,
  wordCount: Number // pre-computed for admin dashboard
  
}, { timestamps: true });

// Pre-save hook to calculate totals
//
// wordCount counts every word of educational content that an ACEP/NBCC
// reviewer would credit toward the seat-time word target — not just the
// prose in text blocks. That includes knowledge-check stems, options,
// and explanations; final-assessment questions; and the references list.
// Block titles and pure metadata (description, objectives, target audience)
// are deliberately excluded because they're not part of the instructional flow.
CourseSchema.pre('save', function(next) {
  this.totalEstimatedTime = this.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
  this.totalContentBlocks = this.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
  this.totalQuizQuestions = this.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0)
    + (this.assessment?.questions?.length || 0);

  // ── word-count helpers ───────────────────────────────────────────────
  const wcOf = (s) => {
    if (typeof s !== 'string' || !s) return 0;
    const plain = s.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
    return plain ? plain.split(/\s+/).filter(w => w.length > 0).length : 0;
  };
  const wcQuestion = (q) => {
    if (!q || typeof q !== 'object') return 0;
    let n = wcOf(q.question || q.prompt || '');
    n += (q.options || []).reduce((sum, o) => sum + wcOf(typeof o === 'string' ? o : (o?.text || '')), 0);
    n += wcOf(q.explanation || q.rationale || '');
    return n;
  };

  let wc = 0;

  // (1) Prose in content blocks (preserves the original behavior)
  this.sections.forEach(s => {
    (s.contentBlocks || []).forEach(b => {
      wc += wcOf(b.textContent || b.content || b.html || b.body || '');

      // (2) Knowledge-check and quiz block questions live inside contentBlocks
      if (Array.isArray(b.questions)) {
        b.questions.forEach(q => { wc += wcQuestion(q); });
      }
    });
  });

  // (3) Final-assessment questions (separate top-level field)
  if (this.assessment && Array.isArray(this.assessment.questions)) {
    this.assessment.questions.forEach(q => { wc += wcQuestion(q); });
  }

  // (4) Section-level quizQuestions array (legacy field, still in schema)
  this.sections.forEach(s => {
    (s.quizQuestions || []).forEach(q => { wc += wcQuestion(q); });
  });

  // (5) References list — scholarly attributions are part of the educational record
  if (Array.isArray(this.references)) {
    this.references.forEach(r => {
      wc += wcOf(r.title) + wcOf(r.author) + wcOf(String(r.year || '')) + wcOf(r.source);
    });
  }

  // (6) Learning objectives — instructional content shown to the learner at course start
  if (Array.isArray(this.objectives)) {
    this.objectives.forEach(o => { wc += wcOf(o); });
  }

  // (7) Section/module titles and divider title/subtitle — these are visible in the
  //     reading flow and contribute to the structural instructional content
  this.sections.forEach(s => {
    wc += wcOf(s.title || '');
    (s.contentBlocks || []).forEach(b => {
      if (b.type === 'sectionDivider') {
        wc += wcOf(b.title || '') + wcOf(b.subtitle || '');
      }
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
