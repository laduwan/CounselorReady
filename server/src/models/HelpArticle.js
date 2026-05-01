/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const helpArticleSchema = new mongoose.Schema({
  // Basic info
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  
  // Content
  summary: { type: String }, // Short description for listings
  content: { type: String, required: true }, // Markdown or HTML content
  
  // Organization
  category: {
    type: String,
    enum: [
      'getting-started',
      'courses',
      'certificates',
      'credentials',
      'subscriptions',
      'account',
      'technical',
      'integrations',
      'admin',
      'troubleshooting'
    ],
    required: true
  },
  
  // Target audience
  audience: {
    type: String,
    enum: ['user', 'admin', 'both'],
    default: 'user'
  },
  
  // Search & discovery
  searchTags: [{ type: String }],
  relatedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HelpArticle' }],
  
  // Display
  icon: { type: String, default: 'fa-circle-question' }, // FontAwesome icon
  order: { type: Number, default: 0 }, // Sort order within category
  featured: { type: Boolean, default: false }, // Show on main help page
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  // Analytics
  views: { type: Number, default: 0 },
  helpfulYes: { type: Number, default: 0 },
  helpfulNo: { type: Number, default: 0 },
  
  // Tracking
  viewedBy: [{
    visitorId: { type: String }, // Anonymous tracking ID or user ID
    viewedAt: { type: Date, default: Date.now }
  }],
  
  // Feedback
  feedback: [{
    visitorId: { type: String },
    helpful: { type: Boolean },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishedAt: { type: Date }
}, {
  timestamps: true
});

// Indexes
helpArticleSchema.index({ category: 1, status: 1, order: 1 });
helpArticleSchema.index({ audience: 1, status: 1 });
helpArticleSchema.index({ searchTags: 1 });
helpArticleSchema.index({ status: 1, featured: 1 });
helpArticleSchema.index({ '$**': 'text' }); // Full-text search on all string fields

// Auto-generate slug from title
helpArticleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set publishedAt when first published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Static: Get articles for a specific audience
helpArticleSchema.statics.getForAudience = async function(audience, category = null) {
  const query = {
    status: 'published',
    $or: [{ audience }, { audience: 'both' }]
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query)
    .select('-content -viewedBy -feedback') // Exclude heavy fields for listings
    .sort({ category: 1, order: 1, title: 1 });
};

// Static: Search articles
helpArticleSchema.statics.search = async function(searchTerm, audience = 'user') {
  return this.find({
    status: 'published',
    $or: [{ audience }, { audience: 'both' }],
    $text: { $search: searchTerm }
  })
  .select('-viewedBy -feedback')
  .sort({ score: { $meta: 'textScore' } })
  .limit(20);
};

// Static: Get featured articles
helpArticleSchema.statics.getFeatured = async function(audience = 'user') {
  return this.find({
    status: 'published',
    featured: true,
    $or: [{ audience }, { audience: 'both' }]
  })
  .select('-content -viewedBy -feedback')
  .sort({ order: 1 })
  .limit(8);
};

// Static: Get categories with article counts
helpArticleSchema.statics.getCategoryCounts = async function(audience = 'user') {
  return this.aggregate([
    {
      $match: {
        status: 'published',
        $or: [{ audience }, { audience: 'both' }]
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Method: Record a view
helpArticleSchema.methods.recordView = async function(visitorId) {
  // Check if viewed in last 24 hours by this visitor
  const recentView = this.viewedBy.find(v => 
    v.visitorId === visitorId && 
    (new Date() - v.viewedAt) < 24 * 60 * 60 * 1000
  );
  
  if (!recentView) {
    this.views += 1;
    this.viewedBy.push({ visitorId });
    
    // Keep only last 1000 view records
    if (this.viewedBy.length > 1000) {
      this.viewedBy = this.viewedBy.slice(-1000);
    }
    
    await this.save();
  }
  
  return this;
};

// Method: Record feedback
helpArticleSchema.methods.recordFeedback = async function(visitorId, helpful, comment = null) {
  // Check if already gave feedback
  const existingFeedback = this.feedback.find(f => f.visitorId === visitorId);
  
  if (existingFeedback) {
    // Update existing feedback
    if (existingFeedback.helpful !== helpful) {
      if (existingFeedback.helpful) {
        this.helpfulYes -= 1;
      } else {
        this.helpfulNo -= 1;
      }
      
      if (helpful) {
        this.helpfulYes += 1;
      } else {
        this.helpfulNo += 1;
      }
      
      existingFeedback.helpful = helpful;
      existingFeedback.comment = comment;
    }
  } else {
    // New feedback
    if (helpful) {
      this.helpfulYes += 1;
    } else {
      this.helpfulNo += 1;
    }
    
    this.feedback.push({ visitorId, helpful, comment });
  }
  
  // Keep only last 500 feedback records
  if (this.feedback.length > 500) {
    this.feedback = this.feedback.slice(-500);
  }
  
  await this.save();
  return this;
};

// Virtual: Helpfulness score
helpArticleSchema.virtual('helpfulnessScore').get(function() {
  const total = this.helpfulYes + this.helpfulNo;
  if (total === 0) return null;
  return Math.round((this.helpfulYes / total) * 100);
});

// Ensure virtuals are included in JSON
helpArticleSchema.set('toJSON', { virtuals: true });
helpArticleSchema.set('toObject', { virtuals: true });

const HelpArticle = mongoose.model('HelpArticle', helpArticleSchema);

export default HelpArticle;
