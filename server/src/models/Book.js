/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true
  },
  author: {
    type: String,
    default: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH'
  },
  // Long form, HTML allowed
  description: {
    type: String
  },
  // Short, catalog card
  blurb: {
    type: String
  },
  // Cloudinary public URL — cover art is PUBLIC
  coverUrl: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number
  },
  format: {
    type: String,
    enum: ['ebook', 'paperback', 'both'],
    default: 'ebook'
  },
  pageCount: {
    type: Number
  },
  isbn: {
    type: String
  },
  category: {
    type: String
  },
  tags: [{
    type: String
  }],
  assetProvider: {
    type: String,
    enum: ['cloudinary', 's3'],
    default: 'cloudinary'
  },
  // PRIVATE storage key/public_id. NEVER sent to client.
  assetKey: {
    type: String
  },
  assetBytes: {
    type: Number
  },
  // Optional Amazon/retailer link
  externalUrl: {
    type: String
  },
  // VIP/subscriber free access
  memberFree: {
    type: Boolean,
    default: false
  },
  downloadLimit: {
    type: Number,
    default: 5
  },
  downloadWindowDays: {
    type: Number,
    default: 90
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  order: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// The only shape any public endpoint may return.
// Strips the private asset fields so they never reach the client.
BookSchema.methods.toPublicJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.assetKey;
  delete obj.assetProvider;
  delete obj.assetBytes;
  return obj;
};

export default mongoose.model('Book', BookSchema);
