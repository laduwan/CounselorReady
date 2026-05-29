import { Resend } from 'resend';
import mongoose from 'mongoose';
import UserCredential from '../models/UserCredential.js';
import Certificate from '../models/Certificate.js';
import { CourseProgress } from '../models/InteractiveCourse.js';

const resend = new Resend(process.env.RESEND_API_KEY);

async function compileUserData(user) {
  const userId = user._id;

  const [credentials, certificates, courseProgress, ceLogs] = await Promise.all([
    UserCredential.find({ userId }).lean(),
    Certificate.find({ userId }).lean(),
    CourseProgress.find({ userId }).lean(),
    mongoose.connection.collection('celogs').find({ user: userId }).toArray(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id:    user._id.toString(),
      email: user.email,
      profile: user.profile,
      subscription: user.subscription,
      notifications: user.notifications,
      createdAt:     user.createdAt,
    },
    credentials,
    certificates,
    ceLogs,
    courseProgress,
    metadata: {
      counts: {
        credentials:    credentials.length,
        certificates:   certificates.length,
        ceLogs:         ceLogs.length,
        courseProgress: courseProgress.length,
      },
      privacyNote:
        'This export contains all data CounselorReady stores about you. ' +
        'It does not include data shared with third parties (Stripe payment records, ' +
        'NBCC ACEP attendance reports). Contact support@counselorready.com for those.',
    },
  };
}

export async function generateUserDataExport(user) {
  try {
    const data = await compileUserData(user);
    const json = JSON.stringify(data, null, 2);
    const filename = `counselorready-data-export-${user._id}-${Date.now()}.json`;

    await resend.emails.send({
      from:    'CounselorReady <noreply@counselorready.com>',
      to:      user.email,
      subject: 'Your CounselorReady data export',
      html: `
        <p>Hi ${user.profile?.firstName || 'there'},</p>
        <p>Attached is the data export you requested. The JSON file contains your profile, credentials, certificates, CE log, and course completion records.</p>
        <p>If you didn't request this, please change your password immediately and contact support.</p>
        <p>— The CounselorReady Team</p>
      `,
      attachments: [{
        filename,
        content: Buffer.from(json, 'utf-8'),
      }],
    });

    console.log(`[dataExport] sent export for user ${user._id} (${json.length} bytes)`);
    return { success: true, bytes: json.length };
  } catch (err) {
    console.error('[dataExport] failed:', err);
    try {
      await resend.emails.send({
        from:    'CounselorReady <noreply@counselorready.com>',
        to:      user.email,
        subject: 'CounselorReady data export — issue',
        html:    '<p>We hit a problem generating your data export. Please try again from Settings, or reply to this message and we will investigate.</p>',
      });
    } catch { /* swallow */ }
    return { success: false, error: err.message };
  }
}
