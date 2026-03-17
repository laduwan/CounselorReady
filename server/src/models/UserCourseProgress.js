/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const userCourseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Enrollment
  enrolledAt: { type: Date, default: Date.now },
  accessExpiresAt: { type: Date }, // For time-limited access
  
  // Progress
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  percentComplete: { type: Number, default: 0 },
  
  // Lesson tracking
  lessonsCompleted: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId },
    completedAt: { type: Date },
    timeSpent: { type: Number } // Seconds
  }],
  
  // Quiz tracking
  quizAttempts: [{
    quizId: { type: mongoose.Schema.Types.ObjectId },
    lessonId: { type: mongoose.Schema.Types.ObjectId },
    attemptNumber: { type: Number },
    score: { type: Number },
    passed: { type: Boolean },
    completedAt: { type: Date },
    answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId },
      selectedAnswer: { type: mongoose.Schema.Types.Mixed },
      correct: { type: Boolean }
    }]
  }],
  
  // Completion
  completedAt: { type: Date },
  certificateId: { type: mongoose.Schema.Types.ObjectId },
  certificateUrl: { type: String },
  
  // CE Compliance
  evaluationCompleted: { type: Boolean, default: false },
  evaluationResponses: [{
    questionIndex: { type: Number },
    response: { type: mongoose.Schema.Types.Mixed } // Number for rating, String for text, Boolean for yes/no
  }],
  evaluationCompletedAt: { type: Date },
  
  attestationCompleted: { type: Boolean, default: false },
  attestationCompletedAt: { type: Date },
  attestationIP: { type: String }, // For audit trail
  
  // Time tracking per lesson (for minimum time enforcement)
  lessonTimeTracking: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId },
    totalSeconds: { type: Number, default: 0 },
    sessions: [{
      startedAt: { type: Date },
      endedAt: { type: Date },
      seconds: { type: Number }
    }]
  }],
  
  // Drip content
  unlockedModules: [{ type: mongoose.Schema.Types.ObjectId }],
  nextUnlockDate: { type: Date },
  
  // Admin manual completion
  adminCompleted: { type: Boolean, default: false },
  adminNote: { type: String },
  adminCompletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminCompletedAt: { type: Date },
  
  // Auto-delete (sparse TTL) — used for smoke-test progress records
  autoDeleteAt: { type: Date, default: null },

  // Last activity
  lastAccessedAt: { type: Date, default: Date.now },
  currentModuleIndex: { type: Number, default: 0 },
  currentLessonIndex: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Compound index for unique enrollment
userCourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
userCourseProgressSchema.index({ userId: 1, status: 1 });
userCourseProgressSchema.index({ autoDeleteAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Check if lesson is completed
userCourseProgressSchema.methods.isLessonCompleted = function(lessonId) {
  return this.lessonsCompleted.some(l => l.lessonId.equals(lessonId));
};

// Mark lesson as complete and update progress
userCourseProgressSchema.methods.completeLesson = async function(lessonId, course) {
  // Don't add if already completed
  if (this.isLessonCompleted(lessonId)) {
    return this;
  }
  
  // Add to completed lessons
  this.lessonsCompleted.push({
    lessonId,
    completedAt: new Date()
  });
  
  // Update status
  if (this.status === 'not_started') {
    this.status = 'in_progress';
  }
  
  // Calculate percent complete
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  this.percentComplete = Math.round((this.lessonsCompleted.length / totalLessons) * 100);
  
  // Check if course is complete
  if (this.percentComplete >= 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
    
    // Update course analytics
    const Course = mongoose.model('Course');
    await Course.findByIdAndUpdate(course._id, {
      $inc: { 
        'analytics.completions': 1 
      }
    });
    
    // Recalculate completion rate
    const enrollments = course.analytics?.enrollments || course.enrollmentCount || 1;
    const completions = (course.analytics?.completions || 0) + 1;
    await Course.findByIdAndUpdate(course._id, {
      $set: {
        'analytics.completionRate': Math.round((completions / enrollments) * 100)
      }
    });
  }
  
  this.lastAccessedAt = new Date();
  
  return this.save();
};

// Get best quiz score for a lesson
userCourseProgressSchema.methods.getBestQuizScore = function(lessonId) {
  const attempts = this.quizAttempts.filter(a => a.lessonId.equals(lessonId));
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map(a => a.score));
};

const UserCourseProgress = mongoose.model('UserCourseProgress', userCourseProgressSchema);

export default UserCourseProgress;
