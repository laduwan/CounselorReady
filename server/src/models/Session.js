import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tokenHash: {
    type: String,
    required: true,
    index: true,
  },
  browser:  { type: String, default: 'Unknown' },
  os:       { type: String, default: 'Unknown' },
  device:   { type: String, default: 'Unknown' },
  ip:       { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt:  { type: Date, default: Date.now, index: true },
  lastActive: { type: Date, default: Date.now },
  revoked:   { type: Boolean, default: false },
  revokedAt: { type: Date,    default: null },
}, { timestamps: false });

sessionSchema.index({ lastActive: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

sessionSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, revoked: false }).sort({ lastActive: -1 });
};

sessionSchema.statics.revoke = function(sessionId, userId) {
  return this.findOneAndUpdate(
    { _id: sessionId, userId },
    { revoked: true, revokedAt: new Date() },
    { new: true }
  );
};

sessionSchema.statics.revokeAllExcept = function(userId, currentTokenHash) {
  return this.updateMany(
    { userId, tokenHash: { $ne: currentTokenHash }, revoked: false },
    { revoked: true, revokedAt: new Date() }
  );
};

export default mongoose.model('Session', sessionSchema);
