import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'update', 'maintenance', 'promotion', 'urgent'],
    default: 'info'
  },
  audience: {
    type: String,
    enum: ['all', 'free', 'professional', 'vip', 'specific'],
    default: 'all'
  },
  specificUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // For targeting by state
  targetStates: [{
    type: String
  }],
  // For targeting by credential type
  targetCredentials: [{
    type: String
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sendEmail: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Get active announcements for a user
announcementSchema.statics.getForUser = async function(user) {
  const now = new Date();
  
  const query = {
    isActive: true,
    startDate: { $lte: now },
    $or: [
      { endDate: null },
      { endDate: { $gte: now } }
    ]
  };
  
  const announcements = await this.find(query).sort({ isPinned: -1, createdAt: -1 });
  
  // Filter by audience
  return announcements.filter(ann => {
    if (ann.audience === 'all') return true;
    if (ann.audience === 'specific') {
      return ann.specificUsers.some(id => id.toString() === user._id.toString());
    }
    // Match subscription plan
    const plan = user.subscription?.plan || 'free';
    if (ann.audience === 'free' && plan === 'free') return true;
    if (ann.audience === 'professional' && ['professional', 'monthly'].includes(plan)) return true;
    if (ann.audience === 'vip' && ['vip', 'annual_vip', 'lifetime'].includes(plan)) return true;
    return false;
  });
};

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
