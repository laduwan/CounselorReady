/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Certificate URL Debug Script
// Run this to see what's actually being generated

import mongoose from 'mongoose';
import Certificate from './src/models/Certificate.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

await mongoose.connect(process.env.MONGODB_URI);

console.log('🔍 DEBUGGING CERTIFICATE URLS');
console.log('==============================\n');

// Get a recent certificate
const cert = await Certificate.findOne({ fileUrl: { $exists: true } }).sort({ _id: -1 });

if (!cert) {
  console.log('❌ No certificates found');
  process.exit(1);
}

console.log('📋 Testing Certificate:', cert._id);
console.log('   fileUrl:', cert.fileUrl);
console.log('   fileKey:', cert.fileKey);

// Test 1: Try the current approach
console.log('\n🧪 TEST 1: Current signed URL generation');
try {
  const cleanPublicId = cert.fileKey.replace(/\.pdf$/, '');
  
  const signedUrl1 = cloudinary.url(cleanPublicId, {
    resource_type: 'image',
    type: 'upload',
    sign_url: true,
    secure: true,
    format: 'pdf',
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  
  console.log('   Generated URL:', signedUrl1);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 2: Try raw resource type
console.log('\n🧪 TEST 2: Using raw resource type');
try {
  const cleanPublicId = cert.fileKey.replace(/\.pdf$/, '');
  
  const signedUrl2 = cloudinary.url(cleanPublicId, {
    resource_type: 'raw',
    type: 'upload',  
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  
  console.log('   Generated URL:', signedUrl2);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 3: Try with original fileKey (including .pdf)
console.log('\n🧪 TEST 3: Using fileKey with .pdf extension');
try {
  const signedUrl3 = cloudinary.url(cert.fileKey, {
    resource_type: 'image',
    type: 'upload',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  
  console.log('   Generated URL:', signedUrl3);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 4: Check if we can access the original URL directly
console.log('\n🧪 TEST 4: Original URL (should fail with 401)');
console.log('   Original URL:', cert.fileUrl);

console.log('\n💡 Next steps:');
console.log('   1. Try each URL above in your browser');
console.log('   2. Check which one (if any) works');
console.log('   3. Report back which test URLs work/fail');

process.exit(0);
