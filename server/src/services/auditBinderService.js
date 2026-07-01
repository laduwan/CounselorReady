/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * auditBinderService — one-click compliance audit binder (ZIP).
 *
 * NEW additive service. A report template over data CR already holds. Builds:
 *   compliance-summary.pdf            (org rollup, generated date, ACEP #7760 footer)
 *   <Member Name>/training-record.csv (name, topic, date, hours — the §9 spreadsheet)
 *   <Member Name>/credentials.csv     (license/insurance/CPR with expiry + evidence URL)
 *   <Member Name>/attestations.csv    (policy acknowledgements)
 *   <Member Name>/supervision.csv     (dual-signoff hour summary)
 *   <Member Name>/certificates.csv    (issued certificate references)
 *
 * Uses adm-zip + pdfkit (already in dependencies). Certificate / evidence PDFs
 * are referenced by URL (the locked cert pipeline owns the binaries); this
 * binder is the index auditors ask for.
 */
import AdmZip from 'adm-zip';
import PDFDocument from 'pdfkit';
import Assignment from '../models/Assignment.js';
import OrgCredential from '../models/OrgCredential.js';
import Attestation from '../models/Attestation.js';
import PolicyDoc from '../models/PolicyDoc.js';
import OrgSupervisionLog from '../models/OrgSupervisionLog.js';
import Certificate from '../models/Certificate.js';

function csvEscape(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(headers, rows) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const r of rows) lines.push(r.map(csvEscape).join(','));
  return lines.join('\n');
}
function safeFolder(name) {
  return String(name || 'member').replace(/[^a-z0-9 _-]/gi, '').trim() || 'member';
}
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString() : '';
}

// Build the rollup summary PDF into a Buffer.
function buildSummaryPdf(org, memberSummaries) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Compliance Audit Binder', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(14).text(org.name || 'Organization', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor('#555')
        .text(`Generated ${new Date().toLocaleString()}`, { align: 'center' })
        .text(`Compliance layer: ${org.settings?.segment === 'dbhdd_agency' ? 'DBHDD/DCH Agency' : 'Private Practice'}`, { align: 'center' });
      doc.fillColor('#000').moveDown(1);

      const compliant = memberSummaries.filter(m => m.status === 'compliant').length;
      const atRisk = memberSummaries.filter(m => m.status === 'at_risk').length;
      const nonCompliant = memberSummaries.filter(m => m.status === 'non_compliant').length;

      doc.fontSize(12).text(`Members: ${memberSummaries.length}`);
      doc.text(`Fully compliant: ${compliant}`);
      doc.text(`At risk (due soon): ${atRisk}`);
      doc.text(`Non-compliant (overdue/expired): ${nonCompliant}`);
      doc.moveDown(0.8);

      doc.fontSize(13).text('Per-member status', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10);
      for (const m of memberSummaries) {
        doc.text(`• ${m.name} — ${m.status.replace('_', ' ')} · ${m.completed}/${m.total} trainings · ${m.openCredentials} credentials${m.recoupmentRisk ? ' · ⚠ BILLING AT RISK' : ''}`);
      }

      doc.moveDown(2);
      doc.fontSize(8).fillColor('#777')
        .text('GA Integrated Therapeutic Perspectives LLC · NBCC ACEP Provider #7760', { align: 'center' })
        .text('This binder indexes compliance records held by CounselorReady. Certificate and evidence files are referenced by URL.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generate the audit binder ZIP for an organization.
 * @param {Organization} org - a loaded Organization document
 * @returns {Promise<{ buffer: Buffer, filename: string }>}
 */
export async function generateAuditBinder(org) {
  const zip = new AdmZip();
  const activeSeats = (org.seats || []).filter(s => s.status === 'active' && s.userId);
  const userIds = activeSeats.map(s => s.userId);

  const [assignments, credentials, attestations, policies, supervision, certificates] = await Promise.all([
    Assignment.find({ orgId: org._id }).populate('userId', 'email profile').lean(),
    OrgCredential.find({ orgId: org._id }).lean(),
    Attestation.find({ orgId: org._id }).lean(),
    PolicyDoc.find({ orgId: org._id }).lean(),
    OrgSupervisionLog.find({ orgId: org._id }).lean(),
    Certificate.find({ userId: { $in: userIds } }).lean()
  ]);

  const policyById = new Map(policies.map(p => [String(p._id), p]));
  const memberSummaries = [];

  for (const seat of activeSeats) {
    const uid = String(seat.userId);
    const seatId = String(seat._id);
    const aRows = assignments.filter(a => String(a.userId) === uid);
    const cRows = credentials.filter(c => String(c.seatId) === seatId || String(c.userId) === uid);
    const tRows = attestations.filter(a => String(a.userId) === uid);
    const sRows = supervision.filter(s => String(s.superviseeUserId) === uid);
    const certRows = certificates.filter(c => String(c.userId) === uid);

    const name = seat.title
      ? `${seat.email} (${seat.title})`
      : seat.email;
    const folder = safeFolder(name) + '/';

    // §9 training record spreadsheet: name, topic, date, hours
    zip.addFile(folder + 'training-record.csv', Buffer.from(toCsv(
      ['Member', 'Topic / Course', 'Status', 'Due', 'Completed', 'Hours', 'Delivery', 'Manual Version'],
      aRows.map(a => [seat.email, a.label || a.courseCode, a.status, fmtDate(a.dueDate), fmtDate(a.completedAt), a.creditedHours || a.hours || 0, a.deliveryMode, a.manualVersion || ''])
    ), 'utf-8'));

    zip.addFile(folder + 'credentials.csv', Buffer.from(toCsv(
      ['Type', 'Label', 'State', 'Identifier', 'Level', 'Issuing Body', 'Issued', 'Expires', 'Verified', 'Evidence URL'],
      cRows.map(c => [c.type, c.label || '', c.state || '', c.identifier || '', c.level || '', c.issuingBody || '', fmtDate(c.issuedAt), fmtDate(c.expiresAt), c.verifiedAt ? 'yes' : 'no', c.fileUrl || ''])
    ), 'utf-8'));

    zip.addFile(folder + 'attestations.csv', Buffer.from(toCsv(
      ['Policy', 'Version', 'Signed At', 'Signature', 'IP'],
      tRows.map(t => [policyById.get(String(t.policyDocId))?.title || t.policyDocId, t.policyVersion, fmtDate(t.signedAt), t.signatureName || '', t.ip || ''])
    ), 'utf-8'));

    zip.addFile(folder + 'supervision.csv', Buffer.from(toCsv(
      ['Date', 'Hours', 'Format', 'Modality', 'Form', 'Supervisor', 'Supervisee Signed', 'Supervisor Signed'],
      sRows.map(s => [fmtDate(s.date), s.hours, s.format, s.modality, s.formType, s.supervisorName || '', fmtDate(s.superviseeSignedAt), fmtDate(s.supervisorSignedAt)])
    ), 'utf-8'));

    zip.addFile(folder + 'certificates.csv', Buffer.from(toCsv(
      ['Title', 'Provider', 'CE Hours', 'Completion Date', 'Certificate #', 'Verification', 'File URL'],
      certRows.map(c => [c.title, c.provider, c.ceHours, fmtDate(c.completionDate), c.certificateNumber || '', c.verificationCode || '', c.fileUrl || ''])
    ), 'utf-8'));

    const total = aRows.length;
    const completed = aRows.filter(a => a.status === 'completed' || a.status === 'waived').length;
    const overdue = aRows.filter(a => a.status === 'overdue').length;
    const recoupmentRisk = aRows.some(a => a.recoupmentRisk);
    const expiredCreds = cRows.filter(c => c.expiresAt && new Date(c.expiresAt) < new Date()).length;
    const status = (overdue > 0 || expiredCreds > 0) ? 'non_compliant'
      : (total > completed) ? 'at_risk' : 'compliant';

    memberSummaries.push({ name, status, total, completed, openCredentials: cRows.length, recoupmentRisk });
  }

  const summaryPdf = await buildSummaryPdf(org, memberSummaries);
  zip.addFile('compliance-summary.pdf', summaryPdf);

  const slug = safeFolder(org.name).replace(/\s+/g, '-').toLowerCase() || 'organization';
  return {
    buffer: zip.toBuffer(),
    filename: `audit-binder-${slug}-${new Date().toISOString().slice(0, 10)}.zip`
  };
}

export default { generateAuditBinder };
