/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
//
// emailService.js — Day 3 redemption email templates
//
// NOTE on module format: the original Day 3 patch md described this file as
// CommonJS, but the repo is ESM throughout (server/package.json has
// "type": "module") and every other email service in server/src/services/
// uses ESM imports. This file follows the repo convention. The default
// import pattern used by consumers — `import emailService from './...';
// const { x } = emailService;` — works against the `export default { ... }`
// at the bottom of this file.

import { Resend } from 'resend';
import { generateICS } from '../utils/generateICS.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';

// Compact, filename-safe date (YYYY-MM-DD) used in the .ics filename and the
// instructor subject line.
function fmtDate(value) {
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return 'date';
  }
}

/**
 * Format a vendor enum value into a display name
 */
export function formatVendorName(vendor) {
  const map = {
    amazon:                       'Amazon',
    doordash:                     'DoorDash',
    celestial_spa_atlanta:        'Celestial Spa (Atlanta)',
    wellness_spot_college_park:   'The Wellness Spot (College Park)',
    noir_pearl_smyrna:            'Noir Pearl Spa (Smyrna)',
    healing_oasis_augusta:        'A Healing Oasis (Augusta)',
    blessed_hands_augusta:        'Blessed Hands (Augusta)',
    hetep_retreat_columbus:       'Hetep Retreat (Columbus)',
    honey_pot_macon:              'Honey Pot (Macon)',
    culler_massage_macon:         'Culler Massage (Macon)',
    odomi_medical_savannah:       'Odomí Medical Spa (Savannah)',
  };
  return map[vendor] || vendor;
}

/**
 * Send redemption confirmation to user (fires immediately on /redeem)
 * Different copy for Stripe credit (auto-fulfilled) vs gift card (pending).
 */
export async function sendRedemptionConfirmation(user, redemption) {
  try {
    const isStripeCredit = redemption.type !== 'giftcard_25';
    const firstName = user.profile?.firstName || 'there';
    const dollarValue = redemption.dollarValue;
    const pointsCost = redemption.pointsCost;

    const subject = isStripeCredit
      ? `Your $${dollarValue} subscription credit has been applied`
      : `Your $${dollarValue} ${formatVendorName(redemption.vendor)} gift card request received`;

    const ctaBody = isStripeCredit
      ? `<p style="margin: 16px 0;"><strong>Your credit has been applied.</strong> It will automatically discount your next subscription invoice. No further action needed.</p>`
      : `<p style="margin: 16px 0;"><strong>Your gift card request is being processed.</strong> You'll receive a follow-up email with the gift card code within 1-2 business days.</p>`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #2A2620; max-width: 600px; margin: 0 auto; padding: 24px; background: #F8F7F4; }
          .container { background: #FFFFFF; border-radius: 14px; padding: 32px; }
          .header { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #6B1D34; margin: 0 0 16px; }
          .summary { background: rgba(74, 124, 89, 0.06); border-left: 3px solid #4A7C59; padding: 16px 20px; border-radius: 4px; margin: 16px 0; }
          .footer { color: #284157; font-size: 13px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Redemption confirmed</h1>
          <p>Hi ${firstName},</p>
          <p>You redeemed <strong>${pointsCost} Mastery Mark Points</strong> for ${
            isStripeCredit
              ? `a $${dollarValue} credit on your CounselorReady subscription`
              : `a $${dollarValue} gift card to ${formatVendorName(redemption.vendor)}`
          }.</p>
          ${ctaBody}
          <div class="summary">
            <p style="margin: 0; font-size: 13px; color: #284157;">Summary</p>
            <p style="margin: 4px 0 0;"><strong>Redeemed:</strong> ${pointsCost} MMP</p>
            <p style="margin: 4px 0 0;"><strong>Value:</strong> $${dollarValue}</p>
            ${redemption.vendor ? `<p style="margin: 4px 0 0;"><strong>Vendor:</strong> ${formatVendorName(redemption.vendor)}</p>` : ''}
          </div>
          <p>Thank you for investing in your professional growth and self-care.</p>
          <div class="footer">
            <p>— The CounselorReady Team</p>
            <p style="font-size: 11px; color: #888;">Mastery Mark Points (MMPs) are earned through course engagement and may be redeemed for subscription credit or gift cards. <a href="https://counselorready.com/achievements.html" style="color: #4A7C59;">View your balance</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject,
      html,
    });

    if (error) {
      console.error('[EMAIL] redemption confirmation failed:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL] sendRedemptionConfirmation error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send admin alert when a new gift card redemption is created (needs fulfillment)
 */
export async function sendRedemptionAdminAlert(redemption, user) {
  try {
    const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'hello@counselorready.com';
    const userName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;

    const subject = `[REWARDS] New gift card redemption: ${formatVendorName(redemption.vendor)} ($${redemption.dollarValue})`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #2A2620; max-width: 600px; margin: 0 auto; padding: 24px; }
          .container { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 8px; padding: 24px; }
          .urgent { background: rgba(212, 168, 85, 0.15); border-left: 3px solid #D4A855; padding: 12px 16px; border-radius: 4px; margin: 12px 0; }
          .data-row { padding: 6px 0; border-bottom: 1px solid #EEE; }
          .label { color: #284157; font-weight: bold; display: inline-block; min-width: 120px; }
          .cta { display: inline-block; padding: 10px 20px; background: #6B1D34; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 style="color: #6B1D34; margin: 0 0 12px;">New gift card redemption awaiting fulfillment</h2>
          <div class="urgent">A user has redeemed Mastery Mark Points for a gift card. Action required: purchase code and fulfill in admin queue.</div>
          <div class="data-row"><span class="label">User:</span> ${userName}</div>
          <div class="data-row"><span class="label">Email:</span> ${user.email}</div>
          <div class="data-row"><span class="label">Vendor:</span> ${formatVendorName(redemption.vendor)}</div>
          <div class="data-row"><span class="label">Value:</span> $${redemption.dollarValue}</div>
          <div class="data-row"><span class="label">Cost:</span> ${redemption.pointsCost} MMP</div>
          <div class="data-row"><span class="label">Requested:</span> ${new Date().toLocaleString()}</div>
          <div class="data-row"><span class="label">Redemption ID:</span> ${redemption._id || '(pending)'}</div>
          <a href="https://counselorready.com/admin-rewards.html" class="cta">Fulfill in Admin Queue →</a>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Set ADMIN_ALERT_EMAIL env var to change recipient. Default: hello@counselorready.com.</p>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject,
      html,
    });

    if (error) {
      console.error('[EMAIL] redemption admin alert failed:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL] sendRedemptionAdminAlert error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send gift card code to user (fires when admin marks redemption fulfilled)
 */
export async function sendGiftCardCode(user, redemption) {
  try {
    const firstName = user.profile?.firstName || 'there';
    const vendorName = formatVendorName(redemption.vendor);
    const code = redemption.giftcardCode || '';
    const codeNotes = redemption.giftcardCodeNotes || '';

    const subject = `Your $${redemption.dollarValue} ${vendorName} gift card`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #2A2620; max-width: 600px; margin: 0 auto; padding: 24px; background: #F8F7F4; }
          .container { background: #FFFFFF; border-radius: 14px; padding: 32px; }
          .header { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; color: #6B1D34; margin: 0 0 8px; }
          .subhead { color: #4A7C59; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; }
          .gift-card { background: linear-gradient(135deg, #F5F5DC 0%, #FFFFFF 100%); border: 2px solid #6B1D34; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
          .vendor-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #284157; margin: 0; }
          .amount { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; color: #6B1D34; font-weight: bold; margin: 8px 0 16px; }
          .code-box { background: #FFFFFF; border: 1px dashed #4A7C59; border-radius: 8px; padding: 14px; margin: 12px auto; max-width: 320px; word-break: break-all; font-family: 'Courier New', monospace; font-size: 18px; color: #284157; font-weight: bold; }
          .notes { color: #284157; font-size: 13px; margin-top: 12px; font-style: italic; }
          .footer { color: #284157; font-size: 13px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Your gift card is ready</h1>
          <div class="subhead">Earned through dedication — ${redemption.pointsCost} Mastery Mark Points</div>
          <p>Hi ${firstName},</p>
          <p>Thank you for the work you put in. Here's your reward:</p>
          <div class="gift-card">
            <p class="vendor-name">${vendorName}</p>
            <p class="amount">$${redemption.dollarValue}</p>
            <p style="font-size: 12px; color: #284157; margin: 0 0 8px;">Gift Card Code:</p>
            <div class="code-box">${code}</div>
            ${codeNotes ? `<p class="notes">${codeNotes}</p>` : ''}
          </div>
          <p><strong>Save this email.</strong> Keep this code in a safe place — you'll need it to redeem.</p>
          <p>Use it to take care of yourself. You've earned it.</p>
          <div class="footer">
            <p>— The CounselorReady Team</p>
            <p style="font-size: 11px; color: #888;">If you have any issues redeeming this code, reply to this email and we'll help. <a href="https://counselorready.com/achievements.html" style="color: #4A7C59;">View your balance</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject,
      html,
    });

    if (error) {
      console.error('[EMAIL] gift card code email failed:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL] sendGiftCardCode error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send the live-session registration confirmation to the learner — with an
 * .ics calendar invite attached (RFC 5545, METHOD:REQUEST, 1-hour reminder).
 *
 * Then, for live-course sessions only (never supervision), send a separate
 * "[New Registration]" copy to the instructor (ADMIN_EMAIL) with the same
 * .ics — the instructor is the ORGANIZER, so they get the calendar block too.
 *
 * Fire-and-forget from the register route: email failures must never block or
 * roll back a registration, so this always resolves (returns success:false on
 * error) rather than throwing.
 *
 * @param {object} user     the registering user (email, profile)
 * @param {object} session  the LiveSession (title, slug, scheduledStart/End, presenter, sessionType, capacity, registrants)
 * @param {object} [opts]   { seatsRemaining?: number, roomUrl?: string }
 */
export async function sendLiveSessionRegistrationConfirmation(user, session, opts = {}) {
  try {
    const firstName = user.profile?.firstName || 'there';
    const attendeeName =
      `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;

    const baseUrl = process.env.CLIENT_URL || 'https://counselorready.com';
    const roomUrl = opts.roomUrl || `${baseUrl}/live-room.html?session=${session.slug}`;
    const organizerName = session.presenter?.name || 'Kejuiana Johnson';
    // Ke is the organizer; ADMIN_EMAIL is already configured on Render.
    const organizerEmail = process.env.ADMIN_EMAIL || 'hello@counselorready.com';

    const whenLabel = new Date(session.scheduledStart).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/New_York',
    }) + ' ET';

    // ── Build the .ics once; both learner and instructor attach the same one. ──
    const icsString = generateICS({
      title: session.title,
      description: `Your CounselorReady live session. Join in your browser at ${roomUrl}`,
      location: roomUrl,
      startUTC: session.scheduledStart,
      endUTC: session.scheduledEnd,
      uid: `${session._id}-${user._id}@counselorready.com`,
      organizerEmail,
      organizerName,
      attendeeEmail: user.email,
      attendeeName,
    });
    const icsBase64 = Buffer.from(icsString).toString('base64');
    const icsFilename = `${session.slug}-${fmtDate(session.scheduledStart)}.ics`;
    const icsAttachment = {
      filename: icsFilename,
      content: icsBase64, // Resend requires a base64 STRING, not a Buffer
      type: 'text/calendar; method=REQUEST',
      disposition: 'attachment',
    };

    // ── Learner confirmation ──
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #2A2620; max-width: 600px; margin: 0 auto; padding: 24px; background: #F8F7F4; }
          .container { background: #FFFFFF; border-radius: 14px; padding: 32px; }
          .header { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #6B1D34; margin: 0 0 16px; }
          .summary { background: rgba(40, 65, 87, 0.06); border-left: 3px solid #284157; padding: 16px 20px; border-radius: 4px; margin: 16px 0; }
          .cta { display: inline-block; padding: 12px 24px; background: #6B1D34; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 8px; }
          .footer { color: #284157; font-size: 13px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">You're registered</h1>
          <p>Hi ${firstName},</p>
          <p>Your seat is confirmed for this live, NBCC-approved session. A calendar invite (.ics) is attached — open it to add the session to your calendar with a 1-hour reminder.</p>
          <div class="summary">
            <p style="margin: 0 0 4px; font-size: 13px; color: #284157;">Session details</p>
            <p style="margin: 4px 0 0;"><strong>${session.title}</strong></p>
            <p style="margin: 4px 0 0;"><strong>When:</strong> ${whenLabel}</p>
            <p style="margin: 4px 0 0;"><strong>Presenter:</strong> ${organizerName}</p>
          </div>
          <p>Join live in your browser — no downloads required:</p>
          <p><a href="${roomUrl}" class="cta">Join the session room</a></p>
          <div class="footer">
            <p>— The CounselorReady Team</p>
            <p style="font-size: 11px; color: #888;">NBCC ACEP Provider #7760. If the button doesn't work, paste this link into your browser: ${roomUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `You're registered: ${session.title}`,
      html,
      attachments: [icsAttachment],
    });
    if (error) {
      console.error('[EMAIL] live session registration confirmation failed:', error);
    }

    // ── Instructor copy: live-course sessions only (never supervision) ──
    if (session.sessionType !== 'supervision') {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const seatsRemaining = typeof opts.seatsRemaining === 'number'
          ? opts.seatsRemaining
          : Math.max(0, (session.capacity || 0) - (session.registrants?.length || 0));
        const text =
          `New live session registration.\n\n` +
          `Attendee: ${attendeeName}\n` +
          `Email: ${user.email}\n` +
          `Session: ${session.title}\n` +
          `When: ${whenLabel}\n` +
          `Seats remaining after this registration: ${seatsRemaining}\n`;
        await resend.emails.send({
          from: FROM_EMAIL,
          to: adminEmail,
          subject: `[New Registration] ${attendeeName} — ${session.title} ${fmtDate(session.scheduledStart)}`,
          text,
          attachments: [icsAttachment],
        }).catch(err => console.error('[EMAIL] instructor registration copy failed:', err.message));
      }
    }

    return { success: !error, data };
  } catch (err) {
    console.error('[EMAIL] sendLiveSessionRegistrationConfirmation error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Notify a registrant their seat(s) were cancelled and refunded — used when
 * an admin removes registration(s) and issues a refund via a script (e.g.
 * refundLateSeriesRegistrant.js), rather than the learner cancelling
 * themselves. Pass `opts.sessions` (array) when one refund covers multiple
 * occurrences (e.g. a recurring weekly session) so the email lists every
 * cancelled date against the single total refund, instead of implying a
 * separate refund per session. Falls back to the single `session` param
 * when only one occurrence is involved.
 */
export async function sendLiveSessionCancellationRefundEmail(user, session, opts = {}) {
  try {
    const firstName = user.profile?.firstName || 'there';
    const sessions = (opts.sessions && opts.sessions.length ? opts.sessions : [session]).filter(Boolean);
    const fmtWhen = (s) => s?.scheduledStart
      ? new Date(s.scheduledStart).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'America/New_York',
        }) + ' ET'
      : 'TBD';
    const title = sessions[0]?.title || session?.title || 'your session';
    const refundLabel = typeof opts.refundAmountCents === 'number'
      ? `$${(opts.refundAmountCents / 100).toFixed(2)}`
      : null;
    const baseUrl = process.env.CLIENT_URL || 'https://counselorready.com';
    const browseUrl = `${baseUrl}/live-sessions.html`;

    const occurrenceRows = sessions.map(s => `
      <p style="margin: 4px 0 0;"><strong>${title === s.title ? 'Date' : s.title}:</strong> ${fmtWhen(s)}</p>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #2A2620; max-width: 600px; margin: 0 auto; padding: 24px; background: #F8F7F4; }
          .container { background: #FFFFFF; border-radius: 14px; padding: 32px; }
          .header { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #6B1D34; margin: 0 0 16px; }
          .summary { background: rgba(40, 65, 87, 0.06); border-left: 3px solid #284157; padding: 16px 20px; border-radius: 4px; margin: 16px 0; }
          .cta { display: inline-block; padding: 12px 24px; background: #6B1D34; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 8px; }
          .footer { color: #284157; font-size: 13px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Your seat${sessions.length > 1 ? 's have' : ' has'} been cancelled</h1>
          <p>Hi ${firstName},</p>
          <p>Registration for ${sessions.length > 1 ? `the ${sessions.length} dates below had` : 'the session below had'} already closed at the time you were enrolled, so we're not able to hold ${sessions.length > 1 ? 'those seats' : 'that seat'}.${refundLabel ? ` A full refund of <strong>${refundLabel}</strong> has been issued to your original payment method — please allow a few business days for it to appear.` : ' A refund has been issued to your original payment method.'}</p>
          <div class="summary">
            <p style="margin: 0 0 4px; font-size: 13px; color: #284157;">${sessions.length > 1 ? 'Cancelled sessions' : 'Cancelled session'}</p>
            <p style="margin: 4px 0 0;"><strong>${title}</strong></p>
            ${occurrenceRows}
          </div>
          <p>Please select an upcoming date to join instead:</p>
          <p><a href="${browseUrl}" class="cta">Browse upcoming sessions</a></p>
          <p>We're sorry for the inconvenience — reach out anytime at support@counselorready.com with questions.</p>
          <div class="footer">
            <p>— The CounselorReady Team</p>
            <p style="font-size: 11px; color: #888;">NBCC ACEP Provider #7760</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Cancelled & refunded: ${title}`,
      html,
    });
    if (error) {
      console.error('[EMAIL] live session cancellation/refund email failed:', error);
    }
    return { success: !error, data };
  } catch (err) {
    console.error('[EMAIL] sendLiveSessionCancellationRefundEmail error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Notify admin of a new suggestion-box submission (from any platform).
 * Fire-and-forget from the caller's perspective — never throws.
 */
export async function sendSuggestionNotification(suggestion) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('[EMAIL] ADMIN_EMAIL not set — skipping suggestion notification');
      return { success: false, error: 'ADMIN_EMAIL not set' };
    }

    const platformLabel = {
      counselorready: 'CounselorReady',
      passreadyprep: 'PassReady Prep',
      gaitp: 'GA Integrated Therapeutic Perspectives',
    }[suggestion.platform] || suggestion.platform;

    const text =
      `New suggestion submitted — ${platformLabel}\n\n` +
      `Category: ${suggestion.category}\n` +
      (suggestion.name ? `Name: ${suggestion.name}\n` : '') +
      (suggestion.email ? `Email: ${suggestion.email}\n` : '') +
      `Page: ${suggestion.pageUrl || 'n/a'}\n\n` +
      `Message:\n${suggestion.message}\n`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `[Suggestion] ${platformLabel} — ${suggestion.category}`,
      text,
    });

    if (error) throw new Error(error.message || 'Resend error');
    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL] sendSuggestionNotification error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send the weekly auto-generated blog draft to Ke for one-click
 * approve/reject via email — no login required. Links embed the post's
 * one-time reviewToken; the /api/blog/:id/approve and /reject GET routes
 * verify it and clear it after use.
 */
export async function sendBlogDraftForApproval(post, baseUrl) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('[EMAIL] ADMIN_EMAIL not set — skipping blog draft approval email');
      return { success: false, error: 'ADMIN_EMAIL not set' };
    }

    const approveUrl = `${baseUrl}/api/blog/${post._id}/approve?token=${post.reviewToken}`;
    const rejectUrl = `${baseUrl}/api/blog/${post._id}/reject?token=${post.reviewToken}`;

    // Very light Markdown → HTML: just enough for a readable email body.
    // This is not the site's renderer — the published post still goes
    // through whatever the blog page normally uses.
    const bodyHtml = post.content
      .split('\n\n')
      .map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('## ')) {
          return `<h3 style="margin:20px 0 8px;color:#6B1D34;">${trimmed.slice(3)}</h3>`;
        }
        return `<p style="margin:0 0 14px;line-height:1.6;">${trimmed}</p>`;
      })
      .join('\n');

    const html = `
      <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;">
        <p style="color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">New auto-generated draft — ${post.category}</p>
        <h2 style="color:#6B1D34;margin:4px 0 4px;">${post.title}</h2>
        <p style="color:#888;font-size:13px;margin:0 0 20px;">${post.wordCount} words · ${post.readingTime} min read</p>
        ${bodyHtml}
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;">
          <a href="${approveUrl}" style="display:inline-block;background:#4A7C59;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;margin-right:10px;">Approve & Publish</a>
          <a href="${rejectUrl}" style="display:inline-block;background:#f5f5f5;color:#6B1D34;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">Reject & Discard</a>
        </div>
        <p style="color:#aaa;font-size:11px;margin-top:16px;">Or review it in the admin dashboard: ${baseUrl}/admin-blog.html</p>
      </div>`;

    const text =
      `New auto-generated blog draft: "${post.title}"\n\n` +
      `${post.wordCount} words · Category: ${post.category}\n\n` +
      `${post.content}\n\n` +
      `Approve & publish: ${approveUrl}\n` +
      `Reject & discard: ${rejectUrl}\n`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `[Blog Draft] ${post.title}`,
      html,
      text,
    });

    if (error) throw new Error(error.message || 'Resend error');
    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL] sendBlogDraftForApproval error:', err.message);
    return { success: false, error: err.message };
  }
}

// Default export for the `import emailService from '...'; const { x } = emailService;`
// pattern used by routes/rewards.js and routes/adminRewards.js.
export default {
  formatVendorName,
  sendRedemptionConfirmation,
  sendRedemptionAdminAlert,
  sendGiftCardCode,
  sendLiveSessionRegistrationConfirmation,
  sendLiveSessionCancellationRefundEmail,
  sendSuggestionNotification,
  sendBlogDraftForApproval,
};
