/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Certificate Diagnostic and Fix Script
// Run this in your server to see what's wrong and fix it

import Certificate from './src/models/Certificate.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Fixed extraction function
function extractPublicIdFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) return null;
  
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');
    
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    const publicIdParts = pathParts.slice(uploadIndex + 1);
    const fullPath = publicIdParts.join('/');
    
    return fullPath; // v1770709313957/certificates/.../cert_xxx.pdf
    
  } catch (error) {
    console.error('Failed to extract public_id from URL:', error);
    return null;
  }
}

// Diagnostic function
async function diagnoseCertificates() {
  console.log('🔍 CERTIFICATE DIAGNOSIS');
  console.log('========================');
  
  try {
    // Find recent certificates
    const certificates = await Certificate.find({}).sort({ _id: -1 }).limit(5);
    
    console.log(`Found ${certificates.length} recent certificates:\n`);
    
    for (const cert of certificates) {
      console.log(`📋 Certificate: ${cert._id}`);
      console.log(`   Title: ${cert.title}`);
      console.log(`   Original fileUrl: ${cert.fileUrl}`);
      console.log(`   Stored fileKey: ${cert.fileKey || 'NULL'}`);
      
      if (cert.fileUrl) {
        const extractedPublicId = extractPublicIdFromUrl(cert.fileUrl);
        console.log(`   Extracted publicId: ${extractedPublicId}`);
        
        // Test signed URL generation
        if (extractedPublicId) {
          try {
            const signedUrl = cloudinary.url(extractedPublicId, {
              resource_type: 'raw',
              sign_url: true,
              secure: true,
              expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
              type: 'upload'
            });
            console.log(`   Generated signed URL: ${signedUrl}`);
          } catch (urlError) {
            console.log(`   ❌ URL generation failed: ${urlError.message}`);
          }
        }
      }
      console.log('   ─────────────────────────────────────\n');
    }
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
}

// Fix function
async function fixCertificateFileKeys() {
  console.log('🔧 FIXING CERTIFICATE FILE KEYS');
  console.log('================================');
  
  try {
    const certificates = await Certificate.find({
      fileUrl: { $exists: true },
      $or: [
        { fileKey: { $exists: false } },
        { fileKey: null },
        { fileKey: '' },
        { fileKey: { $regex: '^certificates/' } } // Fix old incorrect fileKeys
      ]
    });

    console.log(`Found ${certificates.length} certificates to fix`);
    
    for (const cert of certificates) {
      const correctPublicId = extractPublicIdFromUrl(cert.fileUrl);
      
      if (correctPublicId) {
        await Certificate.findByIdAndUpdate(cert._id, {
          fileKey: correctPublicId
        });
        console.log(`✅ Fixed ${cert.certificateNumber}: ${correctPublicId}`);
      } else {
        console.log(`❌ Could not extract publicId for ${cert.certificateNumber}`);
      }
    }
    
    console.log('🎉 Fix completed!');
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

// Run both
async function runDiagnostic() {
  await diagnoseCertificates();
  await fixCertificateFileKeys();
  process.exit(0);
}

runDiagnostic();
