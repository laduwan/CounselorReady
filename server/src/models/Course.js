import mongoose from 'mongoose';

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
  isFree: { type: Boolean, default: false } // Preview lesson?
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
    linearProgression: { type: Boolean, default: false },
    dripEnabled: { type: Boolean, default: false },
    dripSchedule: [{
      moduleId: { type: mongoose.Schema.Types.ObjectId },
      daysAfterEnrollment: { type: Number }
    }],
    certificateEnabled: { type: Boolean, default: true },
    passingScore: { type: Number, default: 70 }
  },
  
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

// Virtual for total lessons
courseSchema.virtual('totalLessons').get(function() {
  return this.modules.reduce((total, mod) => total + mod.lessons.length, 0);
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  let total = 0;
  this.modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
      if (lesson.duration) total += lesson.duration;
    });
  });
  return total;
});

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
