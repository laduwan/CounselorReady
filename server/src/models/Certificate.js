import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    required: true,
    trim: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  ceHours: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['General', 'Ethics', 'Supervision', 'Telehealth', 'Cultural Diversity', 'Trauma', 'Substance Abuse', 'Other'],
    default: 'General'
  },
  nbccApproved: {
    type: Boolean,
    default: false
  },
  acepNumber: {
    type: String,
    trim: true
  },
  certificateNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  credentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCredential'
  }],
  fileUrl: {
    type: String
  },
  fileKey: {
    type: String
  },
  fileName: {
    type: String
  },
  fileType: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['upload', 'platform', 'import'],
    default: 'upload'
  },
  // CE Broker integration
  ceBrokerStatus: {
    type: String,
    enum: ['not_reported', 'pending', 'reported', 'failed'],
    default: 'not_reported'
  },
  ceBrokerConfirmation: {
    type: String
  },
  ceBrokerReportedAt: {
    type: Date
  }
}, {
  timestamps: true
});

certificateSchema.index({ userId: 1, completionDate: -1 });
certificateSchema.index({ userId: 1, courseId: 1 });

export default mongoose.model('Certificate', certificateSchema);
