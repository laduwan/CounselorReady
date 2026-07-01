/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Quick Certificate Database Fix
// Put this file in your server directory and run: node fixCertificates.js

import mongoose from 'mongoose';
import Certificate from './src/models/Certificate.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

console.log('🔧 Fixing certificate fileKey values...');

// Find certificates with incorrect fileKey
const certificates = await Certificate.find({
  fileUrl: { $exists: true, $ne: null }
});

console.log(`Found ${certificates.length} certificates to check`);

for (const cert of certificates) {
  if (!cert.fileUrl) continue;
  
  try {
    // Extract correct publicId from fileUrl
    const url = new URL(cert.fileUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    
    if (uploadIndex !== -1) {
      // Get full path after 'upload/' including version and filename
      const correctFileKey = pathParts.slice(uploadIndex + 1).join('/');
      
      // Update if different
      if (cert.fileKey !== correctFileKey) {
        await Certificate.findByIdAndUpdate(cert._id, {
          fileKey: correctFileKey
        });
        console.log(`✅ Fixed ${cert.certificateNumber || cert._id}: ${correctFileKey}`);
      } else {
        console.log(`✓ Already correct ${cert.certificateNumber || cert._id}`);
      }
    }
  } catch (error) {
    console.log(`❌ Failed to fix ${cert.certificateNumber || cert._id}: ${error.message}`);
  }
}

console.log('🎉 Certificate fix completed!');
process.exit(0);
