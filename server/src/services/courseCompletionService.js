// services/courseCompletionService.js
// Handles course completion workflow: certificate generation + email notification
// =============================================================================

import Certificate from '../models/Certificate.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import User from '../models/User.js';
import { generateCertificatePDF } from '../utils/certificate.js';
import { sendCertificateEmail } from './courseEmailService.js';

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
    const userName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;
    
    const pdfResult = await generateCertificatePDF({
      recipientName: userName,
      courseName: course.title,
      ceHours: course.ceuHours || course.ceHours,
      completionDate: progress.completedAt || new Date(),
      certificateNumber,
      providerNumber: course.approvalNumber || '#7760'
    });

    // 5. Create certificate record
    const certificate = new Certificate({
      certificateNumber,
      user: userId,
      course: courseId,
      completionDate: progress.completedAt || new Date(),
      ceHours: course.ceuHours || course.ceHours,
      nbccProgramNumber: course.ceuApprovalNumber,
      providerNumber: course.approvalNumber || '7760',
      pdfUrl: pdfResult.url,
      cloudinaryPublicId: pdfResult.publicId
    });

    await certificate.save();

    // 6. Update progress with certificate reference
    progress.certificateId = certificate._id;
    progress.certificateIssuedAt = new Date();
    progress.status = 'certified';
    await progress.save();

    // 7. Send email notification (async - don't wait)
    sendCompletionEmail(user, course, certificate, pdfResult.url).catch(err => {
      console.error('Failed to send certificate email:', err);
    });

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
