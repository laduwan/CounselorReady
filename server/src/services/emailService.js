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

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';

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

// Default export for the `import emailService from '...'; const { x } = emailService;`
// pattern used by routes/rewards.js and routes/adminRewards.js.
export default {
  formatVendorName,
  sendRedemptionConfirmation,
  sendRedemptionAdminAlert,
  sendGiftCardCode,
};
