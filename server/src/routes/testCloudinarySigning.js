/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Test Different Cloudinary Signing Approaches
// Put this in your server directory and run: node testCloudinarySigning.js

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const testPublicId = 'v1770709314/certificates/695810fa77585ec7a2c97ec2/cert_1770709313957.pdf';

console.log('🧪 TESTING DIFFERENT CLOUDINARY SIGNING APPROACHES');
console.log('==================================================\n');

console.log('📋 Test PublicId:', testPublicId);

// Test 1: Image resource type (current approach)
console.log('\n🧪 TEST 1: Image resource type');
try {
  const url1 = cloudinary.url(testPublicId, {
    resource_type: 'image',
    type: 'upload',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  console.log('Generated URL:', url1);
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 2: Raw resource type
console.log('\n🧪 TEST 2: Raw resource type');
try {
  const url2 = cloudinary.url(testPublicId, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  console.log('Generated URL:', url2);
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 3: Without .pdf extension
console.log('\n🧪 TEST 3: Without .pdf extension');
try {
  const cleanPublicId = testPublicId.replace('.pdf', '');
  const url3 = cloudinary.url(cleanPublicId, {
    resource_type: 'image',
    type: 'upload',
    sign_url: true,
    secure: true,
    format: 'pdf',
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  console.log('Generated URL:', url3);
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 4: Try auto resource type
console.log('\n🧪 TEST 4: Auto resource type');
try {
  const url4 = cloudinary.url(testPublicId, {
    resource_type: 'auto',
    type: 'upload',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  console.log('Generated URL:', url4);
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n💡 NEXT STEPS:');
console.log('1. Test each URL above in your browser');
console.log('2. See which one (if any) works');
console.log('3. Report back which test succeeds');

process.exit(0);
