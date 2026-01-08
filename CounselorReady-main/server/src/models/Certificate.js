import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  nbccApproved: {
    type: Boolean,
    default: false
  },
  acepNumber: {
    type: String,
    trim: true
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
  }
}, {
  timestamps: true
});

certificateSchema.index({ userId: 1, completionDate: -1 });

export default mongoose.model('Certificate', certificateSchema);
