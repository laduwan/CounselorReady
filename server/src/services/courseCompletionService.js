/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// services/courseCompletionService.js
// Handles course completion workflow: certificate generation + email notification
// =============================================================================

import Certificate from '../models/Certificate.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import certificateService from './certificateService.js';
import { sendCertificateEmail } from './courseEmailService.js';
import { triggerCourseCompleted, triggerCertificateReady, triggerCeMilestone } from './notificationTriggerService.js';

/**
 * Main function to process course completion
 * Called when user passes final assessment
 */
export async function processCourseCompletion({ userId, courseId, assessmentScore }) {
  try {
    // 1. Fetch required data
    const [user, course, progress] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId),
      CourseProgress.findOne({ userId, courseId })
    ]);

    if (!user || !course || !progress) {
      throw new Error('Missing user, course, or progress data');
    }

    // 2. Check if certificate already exists
    const existingCert = await Certificate.findOne({ 
      user: userId, 
      course: courseId, 
      isRevoked: false 
    });
    
    if (existingCert) {
      console.log(`Certificate already exists: ${existingCert.certificateNumber}`);
      return {
        success: true,
        certificate: existingCert,
        isNew: false
      };
    }

    // 3. Generate certificate number
    const certificateNumber = await Certificate.getNextCertificateNumber();

    // 4. Generate PDF
    const userName = `${(user.profile?.firstName || '')} ${(user.profile?.lastName || '')}`.trim() || user.email;

    const fileUrl = await certificateService.generatePDF({
      certificateNumber,
      userName,
      courseTitle: course.title,
      completionDate: progress.completedAt || new Date(),
      ceHours: course.ceuHours || course.ceHours,
      nbccNumber: course.nbccProgramNumber || '',
      providerNumber: '7760'
    });

    // 5. Create certificate record
    const certificate = new Certificate({
      certificateNumber,
      userId: userId,
      courseId: courseId,
      title: course.title,
      provider: 'CounselorReady',
      category: course.category || 'General',
      completionDate: progress.completedAt || new Date(),
      ceHours: course.ceuHours || course.ceHours,
      nbccApproved: true,
      acepNumber: course.ceuApprovalNumber || 'ACEP #7760',
      fileUrl,
      source: 'platform'
    });

    await certificate.save();

    // 6. Update progress with certificate reference
    progress.certificateId = certificate._id;
    progress.certificateIssuedAt = new Date();
    progress.status = 'certified';
    await progress.save();

    // 6.5. AUTO-APPLY CE HOURS TO USER'S CREDENTIALS
    try {
      const userCredentials = await UserCredential.find({ 
        userId,
        status: { $in: ['active', 'expiring_soon'] }
      });
      
      if (userCredentials.length > 0) {
        console.log(`Auto-applying CE hours to ${userCredentials.length} credentials`);
        const linkedCredentials = [];
        
        for (const credential of userCredentials) {
          try {
            await credential.addCEU({
              certificateId: certificate._id,
              courseId: courseId,
              hours: certificate.ceHours,
              category: certificate.category || 'General',
              description: `${course.title} - CounselorReady Course`,
              provider: 'CounselorReady',
              date: certificate.completionDate,
              source: 'internal'
            });
            linkedCredentials.push(credential._id);
            console.log(`Applied ${certificate.ceHours} CE hours to credential: ${credential.name}`);
          } catch (credError) {
            console.error(`Error applying CEUs to credential ${credential._id}:`, credError);
          }
        }
        
        // Link credentials to certificate
        if (linkedCredentials.length > 0) {
          certificate.credentials = linkedCredentials;
          await certificate.save();
        }
      }
    } catch (credentialError) {
      console.error('Error auto-applying CE hours:', credentialError);
    }

    // 7. Send email notification (async - don't wait)
    sendCompletionEmail(user, course, certificate, fileUrl).catch(err => {
      console.error('Failed to send certificate email:', err);
    });

    // 8. Fire notification triggers (async - don't wait)
    triggerCourseCompleted(userId, {
      courseTitle: course.title,
      ceHours: course.ceuHours || course.ceHours,
      contentArea: course.category || course.contentArea
    }).catch(err => console.error('triggerCourseCompleted failed:', err));

    triggerCertificateReady(userId, {
      courseTitle: course.title,
      certificateId: certificate._id
    }).catch(err => console.error('triggerCertificateReady failed:', err));

    // Check CE milestones for each credential
    try {
      const updatedCredentials = await UserCredential.find({
        userId,
        status: { $in: ['active', 'expiring_soon'] }
      });
      for (const cred of updatedCredentials) {
        if (cred.totalCEUsRequired > 0) {
          triggerCeMilestone(userId, {
            totalHours: cred.totalCEUsCompleted || 0,
            requiredHours: cred.totalCEUsRequired,
            credentialType: cred.name
          }).catch(err => console.error('triggerCeMilestone failed:', err));
        }
      }
    } catch (milestoneErr) {
      console.error('CE milestone check failed:', milestoneErr);
    }

    console.log(`✓ Course completion processed: ${certificateNumber} for ${user.email}`);

    return {
      success: true,
      certificate,
      isNew: true
    };

  } catch (error) {
    console.error('Error processing course completion:', error);
    throw error;
  }
}

/**
 * Send certificate email to user
 */
async function sendCompletionEmail(user, course, certificate, pdfUrl) {
  try {
    const userName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'there';
    
    const result = await sendCertificateEmail({
      to: user.email,
      firstName: user.profile?.firstName || userName,
      courseTitle: course.title,
      certificateNumber: certificate.certificateNumber,
      ceHours: certificate.ceHours,
      pdfUrl
    });

    // Update certificate with email delivery status
    certificate.emailDelivery = {
      sent: true,
      sentAt: new Date(),
      messageId: result.messageId
    };
    await certificate.save();

    return result;
  } catch (error) {
    // Update certificate with error
    certificate.emailDelivery = {
      sent: false,
      error: error.message
    };
    await certificate.save();
    throw error;
  }
}

/**
 * Resend certificate email
 */
export async function resendCertificateEmail(certificateId) {
  const certificate = await Certificate.findById(certificateId)
    .populate('user')
    .populate('course');

  if (!certificate) {
    throw new Error('Certificate not found');
  }

  return sendCompletionEmail(
    certificate.user,
    certificate.course,
    certificate,
    certificate.pdfUrl
  );
}

/**
 * Verify certificate by verification code
 */
export async function verifyCertificate(verificationCode) {
  const certificate = await Certificate.findOne({ 
    verificationCode,
    isRevoked: false 
  })
  .populate('user', 'profile email')
  .populate('course', 'title ceuHours ceHours');

  if (!certificate) {
    return { valid: false, message: 'Certificate not found or has been revoked' };
  }

  // Increment verification count
  certificate.verificationCount += 1;
  certificate.verifiedAt = new Date();
  await certificate.save();

  const userName = `${certificate.user.profile?.firstName || ''} ${certificate.user.profile?.lastName || ''}`.trim();

  return {
    valid: true,
    certificate: {
      certificateNumber: certificate.certificateNumber,
      recipientName: userName || certificate.user.email,
      courseTitle: certificate.course.title,
      ceHours: certificate.course.ceuHours || certificate.course.ceHours,
      completionDate: certificate.completionDate,
      providerNumber: certificate.providerNumber,
      verificationCount: certificate.verificationCount
    }
  };
}

/**
 * Get completion statistics for a user
 */
export async function getUserCompletionStats(userId) {
  const [completedCourses, totalCEHours, certificates] = await Promise.all([
    CourseProgress.countDocuments({ userId, status: 'certified' }),
    Certificate.aggregate([
      { $match: { user: userId, isRevoked: false } },
      { $group: { _id: null, total: { $sum: '$ceHours' } } }
    ]),
    Certificate.find({ user: userId, isRevoked: false })
      .populate('course', 'title')
      .sort({ completionDate: -1 })
      .limit(5)
  ]);

  return {
    completedCourses,
    totalCEHours: totalCEHours[0]?.total || 0,
    recentCertificates: certificates
  };
}

export default {
  processCourseCompletion,
  resendCertificateEmail,
  verifyCertificate,
  getUserCompletionStats
};
