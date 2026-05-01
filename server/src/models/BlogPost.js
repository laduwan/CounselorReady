import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: String,
    default: 'Kejuiana Johnson, LPC, NCC, CPCS, BC-TMH'
  },
  category: {
    type: String,
    enum: ['state-guide', 'problem-solution', 'authority', 'news', 'clinical'],
    default: 'problem-solution'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metaTitle: {
    type: String,
    maxlength: 70
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  targetKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  featuredImage: {
    type: String
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-generate slug from title
blogPostSchema.pre('validate', function(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
  // Auto-calculate word count and reading time
  if (this.content) {
    const text = this.content.replace(/<[^>]*>/g, '').replace(/[#*_\[\]()>-]/g, '');
    this.wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    this.readingTime = Math.ceil(this.wordCount / 250);
  }
  // Set publishedAt when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // Default metaTitle to title
  if (!this.metaTitle) {
    this.metaTitle = this.title.substring(0, 70);
  }
  next();
});

// Index for public queries
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
