/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * partnerAgreementEmail.js — emails a partner a copy of the Partner Marketplace Agreement
 * they accepted, with the acceptance record, the moment they accept it (clickwrap).
 */
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MARKETPLACE_AGREEMENT } from '../config/marketplaceAgreement.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';
// Blind-copy filing address — keeps CounselorReady a copy of every signed agreement.
const ARCHIVE_EMAIL = process.env.AGREEMENT_ARCHIVE_EMAIL || 'legal@counselorready.com';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the published PDF copy of the agreement for a given version, if bundled.
function agreementPdfPath(version) {
  const p = path.join(__dirname, '..', 'assets', 'legal', `partner-marketplace-agreement-v${version}.pdf`);
  return fs.existsSync(p) ? p : null;
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * Send the accepting partner a copy of the agreement + their acceptance record.
 * Fire-and-forget; never throws. `acceptance` is the record appended to the partner.
 */
export async function sendPartnerAgreementCopy({ to, name, partnerName, acceptance, agreement = MARKETPLACE_AGREEMENT, archive = false }) {
  try {
    if (!to) return { sent: false, reason: 'no recipient' };
    if (!process.env.RESEND_API_KEY) {
      console.warn('[partnerAgreement] RESEND_API_KEY not set; skipping copy to', to);
      return { sent: false, reason: 'no api key' };
    }

    const version = acceptance?.version || agreement.version;
    const acceptedAt = acceptance?.at ? new Date(acceptance.at) : new Date();
    const acceptedAtStr = acceptedAt.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
    const programs = acceptance?.programs || {};
    const programLabels = [
      programs.importPlatformCourses ? 'Sell CounselorReady courses (you keep 15%)' : null,
      programs.listInMarketplace ? 'List your courses in the CounselorReady marketplace (you keep 85%)' : null,
    ].filter(Boolean);

    const BURGUNDY = '#6B1D34', HUNTER = '#4A7C59', NAVY = '#284157', MUTE = '#6b6b6b';
    const row = (k, v) => `<tr>
      <td style="padding:6px 12px;color:${MUTE};font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td>
      <td style="padding:6px 12px;color:#232323;font-size:13px"><strong>${v}</strong></td></tr>`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#232323">
        <div style="border-bottom:3px solid ${'#D4A855'};padding-bottom:10px;margin-bottom:18px">
          <span style="font-size:22px;font-weight:bold;color:${BURGUNDY}">Counselor</span><span style="font-size:22px;font-weight:bold;color:${HUNTER}">Ready</span><span style="font-size:12px;color:${HUNTER}">&#8482;</span>
          <div style="color:${NAVY};font-style:italic;font-size:13px">Partner Marketplace Program</div>
        </div>
        <p>Hi ${esc(name || 'there')},</p>
        <p>This confirms that ${partnerName ? `<strong>${esc(partnerName)}</strong> ` : 'you '}accepted the
        <strong>CounselorReady&#8482; Partner Marketplace Agreement (v${esc(version)})</strong>. A copy of the
        agreement is attached for your records, along with the details of your acceptance below.</p>
        <table style="border-collapse:collapse;background:#faf8f4;border:1px solid #eee;border-radius:6px;margin:14px 0">
          ${row('Agreement', `CounselorReady&#8482; Partner Marketplace Agreement v${esc(version)}`)}
          ${row('Accepted on', esc(acceptedAtStr))}
          ${acceptance?.byEmail ? row('Accepted by', esc(acceptance.byEmail)) : ''}
          ${acceptance?.ip ? row('IP address', esc(acceptance.ip)) : ''}
          ${programLabels.length ? row('Programs enabled', programLabels.map(esc).join('<br>')) : ''}
        </table>
        <p>You can read the current agreement any time at
          <a href="${esc(agreement.url)}" style="color:${BURGUNDY}">${esc(agreement.url)}</a>.</p>
        <p style="color:${MUTE};font-size:12px">If you did not authorize this, contact us immediately at legal@counselorready.com.</p>
        <p style="color:${MUTE};font-size:12px;border-top:1px solid #eee;padding-top:10px">
          &copy; 2026 GA Integrated Therapeutic Perspectives, LLC &middot; NBCC ACEP #7760 &middot; PO Box 1417, Hinesville, GA 31310
        </p>
      </div>`;

    const message = {
      from: FROM_EMAIL,
      to,
      subject: `Your copy — CounselorReady™ Partner Marketplace Agreement (v${version})`,
      html,
    };

    // Keep a filed copy of every signed agreement (signing events only, not partner re-requests).
    if (archive && ARCHIVE_EMAIL) message.bcc = ARCHIVE_EMAIL;

    const pdf = agreementPdfPath(version);
    if (pdf) {
      message.attachments = [{
        filename: `CounselorReady-Partner-Marketplace-Agreement-v${version}.pdf`,
        content: fs.readFileSync(pdf),
      }];
    } else {
      console.warn(`[partnerAgreement] no bundled PDF for v${version}; sending link-only copy to ${to}`);
    }

    const { data, error } = await resend.emails.send(message);
    if (error) { console.error('[partnerAgreement] send error:', error); return { sent: false, reason: error.message }; }
    console.log(`[partnerAgreement] sent agreement copy v${version} to ${to}${pdf ? ' (with PDF)' : ''}${message.bcc ? ` (filed to ${message.bcc})` : ''}`);
    return { sent: true, id: data?.id };
  } catch (err) {
    console.error('[partnerAgreement] failed:', err.message);
    return { sent: false, reason: err.message };
  }
}

export default { sendPartnerAgreementCopy };
