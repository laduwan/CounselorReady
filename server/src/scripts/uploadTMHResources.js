/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * uploadTMHResources.js
 * ─────────────────────
 * ALL-IN-ONE: Generates PDFs → Uploads to Cloudinary → Patches MongoDB
 * Run on Render shell: node uploadTMHResources.js
 * 
 * Dependencies already installed: pdfkit, cloudinary, mongoose, dotenv
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ─── Brand Colors ───
const C = {
  burgundy: [107, 29, 52],
  green: [74, 124, 89],
  gold: [212, 168, 85],
  navy: [40, 65, 87],
  white: [255, 255, 255],
  gray: [100, 100, 100],
  lightGray: [200, 200, 200],
  darkText: [51, 51, 51],
};

// ─── PDF Generation Helpers ───
function rgb(arr) { return arr; }

function drawHeader(doc) {
  // Burgundy header bar
  doc.rect(0, 0, 612, 42).fill(`#6B1D34`);
  // Gold accent line
  doc.rect(0, 42, 612, 3).fill(`#D4A855`);
  // Brand text
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF')
    .text('Counselor', 43, 15, { continued: true })
    .fillColor('#4A7C59').text('Ready');
  // Right side
  doc.font('Helvetica').fontSize(7).fillColor('#E0C8CE')
    .text('NBCC ACEP Provider #7760', 380, 14, { width: 190, align: 'right' })
    .text('CR-TMH601 | Mastering TeleMental Health', 380, 25, { width: 190, align: 'right' });
}

function drawFooter(doc, title) {
  const y = doc.page.height - 28;
  doc.rect(0, y, 612, 28).fill('#284157');
  doc.font('Helvetica').fontSize(6.5).fillColor('#AABBCC')
    .text(title, 43, y + 10, { width: 200 });
  doc.fillColor('#D4A855')
    .text('Learn. License. Lead.', 0, y + 10, { width: 612, align: 'center' });
  doc.fillColor('#AABBCC')
    .text('© 2025 GAITP LLC | counselorready.com', 370, y + 10, { width: 200, align: 'right' });
}

function sectionTitle(doc, text, color = '#4A7C59') {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(13).fillColor(color).text(text);
  doc.moveDown(0.3);
}

function subTitle(doc, text) {
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#284157').text(text);
  doc.moveDown(0.2);
}

function body(doc, text) {
  doc.font('Helvetica').fontSize(9).fillColor('#333333').text(text, { lineGap: 3 });
  doc.moveDown(0.3);
}

function check(doc, text) {
  doc.font('Helvetica').fontSize(9).fillColor('#333333')
    .text(`☐  ${text}`, { indent: 12, lineGap: 2 });
}

function goldRule(doc) {
  doc.moveDown(0.3);
  doc.moveTo(43, doc.y).lineTo(569, doc.y).strokeColor('#D4A855').lineWidth(1.5).stroke();
  doc.moveDown(0.4);
}

function greenRule(doc) {
  doc.moveDown(0.3);
  doc.moveTo(43, doc.y).lineTo(569, doc.y).strokeColor('#4A7C59').lineWidth(1).stroke();
  doc.moveDown(0.4);
}

function noteBox(doc, text, bgColor = '#FDF6E8', borderColor = '#D4A855') {
  const startY = doc.y;
  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#284157');
  const h = doc.heightOfString(text, { width: 490 }) + 16;
  doc.rect(43, startY, 526, h).fillAndStroke(bgColor, borderColor);
  doc.fillColor('#284157').text(text, 55, startY + 8, { width: 490 });
  doc.y = startY + h + 8;
}

function initDoc(title) {
  const doc = new PDFDocument({ size: 'LETTER', margins: { top: 55, bottom: 45, left: 43, right: 43 } });
  drawHeader(doc);
  drawFooter(doc, title);
  
  // Add header/footer to new pages
  doc.on('pageAdded', () => {
    drawHeader(doc);
    drawFooter(doc, title);
    doc.y = 55;
  });
  
  return doc;
}

// ─── DOCUMENT BUILDERS ───

function buildSessionChecklist() {
  const title = 'TeleMental Health Session Checklist';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Pre-Session, In-Session, and Post-Session Best Practices');
  goldRule(doc);
  
  sectionTitle(doc, 'Pre-Session Preparation (15–30 min before)');
  subTitle(doc, 'Technology Check');
  check(doc, 'Test internet connection speed (minimum 1.5 Mbps up/down; 5+ Mbps preferred)');
  check(doc, 'Verify camera, microphone, and speakers are functioning');
  check(doc, 'Close unnecessary applications to free bandwidth');
  check(doc, 'Ensure telehealth platform is updated to the latest version');
  check(doc, 'Have backup contact method ready (phone number on desk)');
  doc.moveDown(0.3);
  subTitle(doc, 'Environment Setup');
  check(doc, 'Confirm visual and auditory privacy (door locked, white noise on)');
  check(doc, 'Adjust lighting — face well-lit, no backlighting or harsh shadows');
  check(doc, 'Position camera at eye level; neutral, professional background');
  check(doc, 'Remove any client-identifiable information from camera view');
  check(doc, 'Silence personal devices and notifications');
  doc.moveDown(0.3);
  subTitle(doc, 'Clinical Preparation');
  check(doc, 'Review client chart, progress notes, and treatment plan');
  check(doc, 'Review between-session assignments or homework');
  check(doc, 'Prepare assessment tools or worksheets for screen sharing');
  check(doc, 'Verify client\'s current physical location and emergency contact on file');
  check(doc, 'Have crisis protocol and local emergency numbers accessible');
  
  greenRule(doc);
  sectionTitle(doc, 'In-Session Protocol');
  subTitle(doc, 'Session Opening (First 2–3 minutes)');
  check(doc, 'Verify client identity (visual confirmation on video)');
  check(doc, 'Confirm client\'s current physical address for this session');
  check(doc, 'Confirm client is in a private, safe space');
  check(doc, 'Briefly assess technology quality ("Can you see and hear me clearly?")');
  check(doc, 'For new clients: obtain verbal AND written consent (GA Rule 135-11)');
  doc.moveDown(0.3);
  subTitle(doc, 'Therapeutic Presence');
  check(doc, 'Maintain eye contact by looking at camera (not the screen image)');
  check(doc, 'Use deliberate prosodic techniques: warm tone, measured pacing, intentional pauses');
  check(doc, 'Monitor your own autonomic state — regulate before co-regulation');
  check(doc, 'Attend to nonverbal cues with awareness of video limitations');
  check(doc, 'Note environmental observations (changes in living space, background sounds)');
  doc.moveDown(0.3);
  subTitle(doc, 'Documentation During Session');
  check(doc, 'Document telehealth modality used (synchronous video, phone, etc.)');
  check(doc, 'Note any technology disruptions and how they were managed');
  check(doc, 'Record client\'s location and any safety concerns identified');
  check(doc, 'Administer outcome measures (ORS at start, SRS at end) if using ROM');
  
  greenRule(doc);
  sectionTitle(doc, 'Post-Session Wrap-Up');
  check(doc, 'Complete progress notes promptly (include telehealth-specific elements)');
  check(doc, 'Document Place of Service code: POS 02 (home) or POS 10 (originating site)');
  check(doc, 'Update safety plan if any risk concerns were identified');
  check(doc, 'Send between-session resources via HIPAA-compliant channel only');
  check(doc, 'Log out of telehealth platform completely');
  check(doc, 'Conduct brief self-check: assess fatigue, emotional state, boundaries');
  check(doc, 'Schedule next session and confirm modality preference');
  
  doc.moveDown(0.5);
  noteBox(doc, 'Georgia clinicians: Rule 135-11 requires both verbal AND written informed consent, a documented suitability assessment, and 6 hours of telehealth-specific CE training within the preceding 5 years before providing telemental health services.');
  
  return doc;
}

function buildHIPAAQuickRef() {
  const title = 'HIPAA Compliance Quick Reference';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Essential Requirements for TeleMental Health Practitioners');
  goldRule(doc);
  
  sectionTitle(doc, 'The Three HIPAA Rules');
  body(doc, '• Privacy Rule — Governs use & disclosure of PHI. Key: minimum necessary standard, client rights to access/amend/restrict PHI, Notice of Privacy Practices.');
  body(doc, '• Security Rule — Safeguards for ePHI. Key: administrative, physical, and technical safeguards; risk analysis; encryption; access controls.');
  body(doc, '• Breach Notification Rule — Notify affected individuals within 60 days of discovery. Report to HHS. Document all breaches regardless of size.');
  
  greenRule(doc);
  sectionTitle(doc, 'Administrative Safeguards');
  check(doc, 'Designate a Security Officer (can be yourself in solo practice)');
  check(doc, 'Complete and document a thorough risk analysis annually');
  check(doc, 'Develop a risk management plan addressing identified vulnerabilities');
  check(doc, 'Implement workforce training (includes anyone with ePHI access)');
  check(doc, 'Create contingency plans for data breaches and technology failures');
  
  doc.moveDown(0.3);
  sectionTitle(doc, 'Physical Safeguards');
  check(doc, 'Dedicated room with locking door (or privacy alternatives)');
  check(doc, 'Privacy screen on monitor; white noise machine outside door');
  check(doc, 'Full-disk encryption on all devices used for clinical work');
  check(doc, 'Strong passwords with auto-lock after brief inactivity');
  check(doc, 'Current antivirus/anti-malware software; regular OS updates');
  check(doc, 'No shared or public computers for telehealth sessions — ever');
  
  doc.moveDown(0.3);
  sectionTitle(doc, 'Technical Safeguards');
  check(doc, 'End-to-end encryption (E2EE) on telehealth platform — gold standard');
  check(doc, 'AES-256 encryption for data at rest and in transit (NIST recommended)');
  check(doc, 'Multi-factor authentication (MFA) on all clinical systems');
  check(doc, 'Unique user IDs for each person accessing the system');
  check(doc, 'Automatic logoff procedures configured on all devices');
  check(doc, 'Audit controls and access logging enabled and reviewed periodically');
  
  greenRule(doc);
  sectionTitle(doc, 'Business Associate Agreement (BAA) Checklist');
  noteBox(doc, 'A BAA is required with EVERY vendor that creates, receives, maintains, or transmits ePHI on your behalf. Without a signed BAA, using the service for clinical purposes violates HIPAA.', '#F2E6EB', '#6B1D34');
  check(doc, 'Telehealth platform (Doxy.me, SimplePractice Telehealth, Zoom for Healthcare)');
  check(doc, 'Electronic health record (EHR) system');
  check(doc, 'Email service used for client communication (e.g., Google Workspace with BAA)');
  check(doc, 'Cloud storage (Google Drive, Dropbox Business with BAA)');
  check(doc, 'Billing and claims processing service');
  check(doc, 'Scheduling software if it stores client information');
  check(doc, 'Answering service or virtual assistant with PHI access');
  check(doc, 'IT support or managed service provider with system access');
  
  greenRule(doc);
  sectionTitle(doc, 'Encryption: E2EE vs. Transport-Layer (TLS)');
  body(doc, 'End-to-End (E2EE): Data encrypted on sender device, decrypted only on receiver. Vendor CANNOT access content. Gold standard for clinical use.');
  body(doc, 'Transport-Layer (TLS): Data encrypted in transit but decrypted at server. Vendor CAN access content. Acceptable minimum with BAA + audit logging.');
  body(doc, 'Standard: AES-256 (Advanced Encryption Standard, 256-bit key) — NIST recommended for healthcare.');
  
  return doc;
}

function buildSuitabilityWorksheet() {
  const title = 'Telehealth Suitability Assessment Worksheet';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Three-Domain Screening for TeleMental Health Appropriateness');
  goldRule(doc);
  
  sectionTitle(doc, 'Client Information');
  body(doc, 'Client Name: _____________________________________________');
  body(doc, 'Date of Assessment: ______________________________________');
  body(doc, 'Clinician Name / License #: _______________________________');
  
  greenRule(doc);
  sectionTitle(doc, 'Domain 1: Clinical Appropriateness');
  body(doc, 'Evaluate whether presenting concerns, clinical acuity, cognitive capacity, and treatment needs can be addressed through telehealth.');
  check(doc, 'Nature and severity of presenting condition compatible with virtual delivery');
  check(doc, 'Client is clinically stable with manageable level of acuity');
  check(doc, 'Planned therapeutic interventions suitable for telehealth modality');
  check(doc, 'Client\'s crisis history and current risk level reviewed');
  check(doc, 'Local in-person crisis resources available in client\'s area');
  check(doc, 'No comorbid conditions preventing adequate virtual assessment');
  check(doc, 'Client has sufficient cognitive capacity to engage with technology');
  doc.moveDown(0.3);
  noteBox(doc, 'Clinical Caution Flags: Active psychosis with significant disorganization, severe cognitive impairment, active suicidal crisis with imminent risk, severe substance intoxication, or conditions requiring physical examination.', '#F2E6EB', '#6B1D34');
  body(doc, 'Clinical Notes: __________________________________________');
  body(doc, '___________________________________________________________');
  
  greenRule(doc);
  sectionTitle(doc, 'Domain 2: Technological Capacity');
  body(doc, 'Assess whether the client has or can access the technology, connectivity, and digital literacy needed.');
  check(doc, 'Client has device with camera, microphone, and adequate screen');
  check(doc, 'Internet connection reliable (minimum 1.5 Mbps; 5+ Mbps preferred)');
  check(doc, 'Client comfortable and proficient with videoconferencing');
  check(doc, 'Technical support available (family, caregiver, community resource)');
  check(doc, 'Client can troubleshoot basic technology problems independently');
  doc.moveDown(0.3);
  noteBox(doc, 'Accommodations: Pre-session tech orientation, simplified browser-link connection (e.g., Doxy.me), switch to telephone modality, community tech access points, involve family for setup.', '#E8F0EB', '#4A7C59');
  body(doc, 'Technology Notes / Accommodations: _________________________');
  body(doc, '___________________________________________________________');
  
  greenRule(doc);
  sectionTitle(doc, 'Domain 3: Environmental Suitability');
  body(doc, 'Evaluate whether the client\'s physical environment supports confidential, safe, and productive engagement.');
  check(doc, 'Private space — client will not be overheard or interrupted');
  check(doc, 'Home environment is safe (assessed for DV, family conflict, coercion)');
  check(doc, 'Minimal distractions (children, pets, TV manageable)');
  check(doc, 'Adequate lighting and comfortable seating for sustained video');
  check(doc, 'Client can maintain session boundaries in non-clinical setting');
  body(doc, 'Environmental Notes: ______________________________________');
  body(doc, '___________________________________________________________');
  
  goldRule(doc);
  sectionTitle(doc, 'Clinical Determination', '#6B1D34');
  body(doc, '☐  Suitable for Telehealth — All three domains adequately addressed');
  body(doc, '☐  Suitable with Modifications — Accommodations required (document below)');
  body(doc, '☐  Not Suitable at This Time — In-person services recommended');
  doc.moveDown(0.3);
  body(doc, 'Modifications / Accommodations: ____________________________');
  body(doc, 'Rationale: ________________________________________________');
  body(doc, 'Reassessment Plan: ________________________________________');
  doc.moveDown(0.5);
  body(doc, 'Clinician Signature: ________________________   Date: ____________');
  
  doc.moveDown(0.5);
  noteBox(doc, 'Georgia: Rule 135-11-.01 explicitly requires this suitability assessment using instruments referenced in Rule 135-7-.05. Clients who cannot be properly treated via telehealth must be treated in person or properly terminated with referrals.');
  
  return doc;
}

function buildCrisisProtocol() {
  const title = 'Crisis Intervention Protocol';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Quick Reference for Managing Emergencies During Telehealth Sessions');
  goldRule(doc);
  
  sectionTitle(doc, 'Pre-Crisis Infrastructure (Complete Before Any Crisis)');
  check(doc, 'Client\'s current physical address verified at start of every session');
  check(doc, 'Emergency contact name, relationship, and phone number on file');
  check(doc, 'Nearest emergency department address and phone number documented');
  check(doc, 'Local law enforcement non-emergency dispatch number recorded');
  check(doc, 'Written crisis response protocol developed and accessible during sessions');
  check(doc, 'Backup communication method established (second phone line, colleague on call)');
  check(doc, 'Client informed of crisis procedures during informed consent process');
  
  doc.moveDown(0.3);
  doc.moveTo(43, doc.y).lineTo(569, doc.y).strokeColor('#CC3333').lineWidth(2).stroke();
  doc.moveDown(0.4);
  
  sectionTitle(doc, 'Active Suicidal Crisis — Step-by-Step', '#6B1D34');
  
  const steps = [
    ['Step 1: Maintain Therapeutic Presence', 'Stay calm. Speak steadily. Acknowledge distress with genuine concern. No alarm, frustration, or judgment. Your regulated nervous system is the co-regulatory anchor.'],
    ['Step 2: Structured Risk Assessment', 'Use C-SSRS or equivalent. Assess: ideation (nature, intensity, duration, frequency), specific plans (method, timeline, preparatory behaviors), access to lethal means (especially firearms), protective factors (reasons for living, support, future orientation). Conversational — not a rote checklist.'],
    ['Step 3: Means Restriction Counseling', 'Collaborate on voluntarily restricting access to lethal means. Options: hand weapon to family, lock in safe (combination to someone else), temporary law enforcement storage. If unwilling → consider involving emergency contact or services.'],
    ['Step 4: Safety Planning', 'Develop/review: warning signs, internal coping strategies, social contacts for support, family/friends to call, professional resources & crisis hotlines, strategies for environment safety. Transmit plan via secure channel before session ends.'],
    ['Step 5: Determine Level of Intervention', '(a) Manage via safety plan + outpatient follow-up, (b) Notify emergency contact for in-person support, or (c) Contact emergency services for immediate evaluation. Weigh severity, imminence, client autonomy, available resources.'],
  ];
  
  for (const [stepTitle, stepBody] of steps) {
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#6B1D34').text(stepTitle);
    doc.font('Helvetica').fontSize(8.5).fillColor('#333333').text(stepBody, { lineGap: 2 });
    doc.moveDown(0.4);
  }
  
  doc.moveTo(43, doc.y).lineTo(569, doc.y).strokeColor('#CC3333').lineWidth(2).stroke();
  doc.moveDown(0.4);
  
  sectionTitle(doc, 'Technology Failure During Crisis — Escalation');
  body(doc, '1. Attempt to reconnect via the telehealth platform');
  body(doc, '2. Call client by telephone');
  body(doc, '3. Contact client\'s designated emergency contact');
  body(doc, '4. Contact emergency services in client\'s jurisdiction → request welfare check');
  
  doc.moveDown(0.3);
  noteBox(doc, 'Cross-Jurisdictional: Calling 911 reaches YOUR dispatch, not the client\'s. Maintain the non-emergency dispatch number for law enforcement in each client\'s jurisdiction. Identify yourself as MH professional, provide client name/address, describe concern, note risk factors, request CIT-trained officer.', '#F2E6EB', '#6B1D34');
  
  greenRule(doc);
  sectionTitle(doc, 'Crisis Documentation Requirements');
  check(doc, 'Date, time, and duration of crisis event');
  check(doc, 'Telehealth modality through which crisis was identified');
  check(doc, 'Specific statements or behaviors triggering crisis response');
  check(doc, 'Risk assessment findings (C-SSRS or equivalent)');
  check(doc, 'Interventions implemented and client\'s response to each');
  check(doc, 'Emergency contacts notified and their responses');
  check(doc, 'Emergency services contacted, info provided, outcomes');
  check(doc, 'Follow-up plan and timeline');
  
  return doc;
}

function buildGeorgiaCompliance() {
  const title = 'Georgia Rule 135-11 Compliance Checklist';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Minimum Standards for TeleMental Health in Georgia');
  goldRule(doc);
  
  noteBox(doc, 'IMPORTANT: Noncompliance with Georgia Rule 135-11 constitutes unprofessional conduct under Board Rule 135-7 and may result in disciplinary action including license suspension or revocation. Georgia requirements EXCEED those of most other states.', '#F2E6EB', '#6B1D34');
  
  sectionTitle(doc, '1. Mandatory Training Requirement');
  body(doc, 'Georgia mandates 6 hours of telehealth-specific CE training within the 5 years preceding provision of telemental health services.');
  check(doc, 'Completed 6 hours of telehealth-specific CE training');
  check(doc, 'Training was completed within the past 5 years');
  check(doc, 'Training documentation is on file and accessible');
  check(doc, 'If supervising: completed 3 ADDITIONAL hours of supervisor-specific telehealth training (9 total)');
  
  greenRule(doc);
  sectionTitle(doc, '2. Dual Consent Requirement');
  body(doc, 'Georgia mandates BOTH verbal AND written informed consent before delivering telemental health services.');
  check(doc, 'Verbal consent obtained through real-time discussion of telehealth modality, benefits, risks');
  check(doc, 'Client given opportunity to ask questions during verbal consent');
  check(doc, 'Written consent document signed by client');
  check(doc, 'Both verbal and written consent documented in client record');
  check(doc, 'Consent includes: technology risks, privacy limitations, emergency protocols');
  check(doc, 'Consent includes: recording policies, interstate practice restrictions');
  check(doc, 'Consent includes: disclosure of third-party vendors (billing, records, legal counsel)');
  
  greenRule(doc);
  sectionTitle(doc, '3. Mandatory Suitability Assessment');
  body(doc, 'Rule 135-11-.01 explicitly requires suitability assessment using instruments referenced in Rule 135-7-.05.');
  check(doc, 'Suitability assessment conducted before initiating telehealth');
  check(doc, 'Assessment instruments per Rule 135-7-.05 were used');
  check(doc, 'Clinical appropriateness domain evaluated');
  check(doc, 'Technological capacity domain evaluated');
  check(doc, 'Environmental suitability domain evaluated');
  check(doc, 'Determination documented: suitable / with modifications / not suitable');
  check(doc, 'Rationale clearly documented in clinical record');
  check(doc, 'Unsuitable clients treated in person or properly terminated with referrals');
  check(doc, 'Reassessment plan in place for changing circumstances');
  
  greenRule(doc);
  sectionTitle(doc, '4. Additional Georgia-Specific Requirements');
  check(doc, 'Client identity verified at each session (visual confirmation on video)');
  check(doc, 'Client\'s physical location verified and documented at each session');
  check(doc, 'Services delivered only to clients in states where clinician is licensed');
  check(doc, 'Technology platform is HIPAA-compliant with signed BAA');
  check(doc, 'Emergency protocol and safety plan in place for every telehealth client');
  check(doc, 'Third-party vendor disclosure per Rule 135-11');
  check(doc, 'All documentation includes telehealth-specific elements');
  
  goldRule(doc);
  sectionTitle(doc, 'How Georgia Compares', '#284157');
  body(doc, 'Training: GA = 6 hrs mandatory (9 for supervisors) vs. most states = not required');
  body(doc, 'Consent: GA = verbal AND written vs. most states = written only or verbal only');
  body(doc, 'Suitability: GA = mandatory with specific instruments vs. most states = discretionary');
  body(doc, 'Third-party disclosure: GA = required vs. most states = not specified');
  
  return doc;
}

function buildPlatformScorecard() {
  const title = 'Telehealth Platform Evaluation Scorecard';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Compare Platforms Across Five Critical Domains (Rate 1–5)');
  goldRule(doc);
  
  body(doc, 'Platform A: _______________________  Platform B: _______________________  Platform C: _______________________');
  
  const domains = [
    ['Domain 1: Security & Compliance', ['End-to-end encryption (AES-256)', 'Signed BAA available', 'HIPAA compliance documentation', 'SOC 2 Type II certification', 'Multi-factor authentication', 'Access and audit logging', 'Data residency (U.S.-based servers)']],
    ['Domain 2: Clinical Functionality', ['Video quality and stability', 'Screen sharing capability', 'Waiting room feature', 'Session recording (encrypted)', 'Whiteboard / annotation tools', 'EHR integration options', 'Assessment tool integration']],
    ['Domain 3: Client Accessibility', ['No download required (browser-based)', 'Mobile device compatibility', 'Low-bandwidth mode', 'ADA / accessibility compliance', 'Multi-language support', 'Simple connection process for clients']],
    ['Domain 4: Reliability & Performance', ['Uptime guarantee (99.9%+)', 'Automatic reconnection on drop', 'Bandwidth adaptation', 'Customer support responsiveness']],
    ['Domain 5: Cost Structure', ['Monthly/annual pricing transparency', 'Per-clinician or per-session pricing', 'Free trial or demo available', 'No hidden fees', 'Contract flexibility (month-to-month)']],
  ];
  
  for (const [domainTitle, criteria] of domains) {
    sectionTitle(doc, domainTitle);
    for (const crit of criteria) {
      doc.font('Helvetica').fontSize(8.5).fillColor('#333333')
        .text(`${crit}    A: ___/5    B: ___/5    C: ___/5`, { lineGap: 2 });
    }
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#6B1D34')
      .text('Domain Subtotal:    A: _____    B: _____    C: _____');
    doc.moveDown(0.3);
  }
  
  goldRule(doc);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#6B1D34')
    .text('GRAND TOTAL:    A: _______    B: _______    C: _______', { align: 'center' });
  doc.moveDown(0.5);
  body(doc, 'Selected Platform: ________________________________________');
  body(doc, 'Rationale: ________________________________________________');
  
  return doc;
}

function buildInformedConsentRef() {
  const title = 'Telehealth Informed Consent Elements';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Comprehensive Reference for Building Compliant Consent Documents');
  goldRule(doc);
  
  const sections = [
    ['Nature & Description of Telehealth', ['Definition of telehealth and modalities offered (video, phone, async)', 'How telehealth differs from in-person services', 'Types of services that will/will not be provided via telehealth', 'Credential verification information for the clinician']],
    ['Technology Requirements', ['Minimum hardware (device with camera, mic, speakers/headphones)', 'Minimum internet speed (1.5 Mbps min; 5+ Mbps recommended)', 'Required software or platform and how to access it', 'Client responsibility for maintaining technology']],
    ['Benefits of Telehealth', ['Increased access (eliminates transportation barriers)', 'Scheduling flexibility and reduced travel time', 'Comfort of receiving services from home', 'Continuity of care during travel, illness, or disruption']],
    ['Risks & Limitations', ['Technology failures may disrupt sessions', 'Reduced nonverbal cue observation', 'Potential for unauthorized interception', 'Limitations in comprehensive in-person assessments', 'Possible unsuitability for certain clinical presentations', 'Risk of others overhearing session content']],
    ['Privacy & Confidentiality', ['Encryption methods used by platform', 'HIPAA protections and telehealth application', 'Clinician efforts to ensure privacy', 'Client responsibility for privacy on their end', 'Limitations in shared living spaces', 'Session recording policy']],
    ['Emergency Protocols', ['Crisis procedures during telehealth sessions', 'Current physical address required each session', 'Emergency contact requirements', 'When emergency services may be contacted', 'Technology failure protocol (escalation plan)']],
    ['Georgia-Specific Disclosures (Rule 135-11)', ['Third-party vendors (billing, records, legal counsel)', 'Dual consent: verbal AND written required', 'Suitability assessment will be conducted', 'Right to terminate telehealth for in-person', 'Interstate practice limitations']],
    ['Client Rights', ['Withdraw consent at any time', 'Request in-person services', 'Ask questions about telehealth delivery', 'Access clinical records per HIPAA', 'File complaints about telehealth services']],
    ['Fees & Billing', ['Fee structure for telehealth vs. in-person', 'Insurance billing procedures (POS codes)', 'Payment methods accepted', 'Cancellation/no-show policy']],
  ];
  
  for (const [secTitle, items] of sections) {
    sectionTitle(doc, secTitle);
    for (const item of items) { check(doc, item); }
    doc.moveDown(0.2);
  }
  
  goldRule(doc);
  sectionTitle(doc, 'Consent Documentation');
  body(doc, 'Client Signature: ________________________   Date: ____________');
  body(doc, 'Clinician Signature: ________________________   Date: ____________');
  body(doc, '☐  Verbal consent obtained and documented (date/time: _____________)');
  body(doc, '☐  Written consent signed and filed in client record');
  
  return doc;
}

function buildSelfCareGuide() {
  const title = 'Clinician Self-Care & Zoom Fatigue Prevention';
  const doc = initDoc(title);
  
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#6B1D34').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#284157').text('Evidence-Based Strategies for Sustainable Telehealth Practice');
  goldRule(doc);
  
  sectionTitle(doc, 'Understanding "Zoom Fatigue" (Bailenson, 2021)');
  body(doc, '• Self-Image Monitoring — Constant self-view consumes cognitive resources and increases self-consciousness.');
  body(doc, '• Unnatural Sustained Gaze — Prolonged close-proximity eye contact triggers hyperarousal beyond normal interaction.');
  body(doc, '• Reduced Mobility — Camera frame limits natural movement and self-regulation mechanisms.');
  body(doc, '• Increased Cognitive Effort — Processing nonverbal cues through a screen demands more cognitive resources due to signal degradation.');
  
  greenRule(doc);
  sectionTitle(doc, 'Session Scheduling Strategies');
  check(doc, 'Build 10–15 minute breaks between every session (not just 5)');
  check(doc, 'Limit consecutive video sessions to 3–4 before a longer break');
  check(doc, 'Schedule at least one non-screen activity block per half-day');
  check(doc, 'Offer some sessions via telephone to reduce video fatigue');
  check(doc, 'Avoid scheduling during your lowest energy periods');
  check(doc, 'Block admin time that doesn\'t involve screens');
  
  doc.moveDown(0.3);
  sectionTitle(doc, 'During-Session Strategies');
  check(doc, 'Hide self-view when not clinically necessary');
  check(doc, 'Use speaker view rather than gallery view for individual sessions');
  check(doc, 'Position camera for upper body visibility (allows gesturing)');
  check(doc, 'Take micro-movement breaks: shift weight, stretch hands, roll shoulders');
  check(doc, 'Use external camera at slight distance to reduce hyper-gaze effect');
  check(doc, 'Look at camera intermittently rather than sustained unbroken gaze');
  
  doc.moveDown(0.3);
  sectionTitle(doc, 'Between-Session Recovery');
  check(doc, 'Step away from screen completely during breaks');
  check(doc, 'Brief grounding or mindfulness exercises (2–3 minutes)');
  check(doc, 'Brief physical movement: walk, stretch, stand at window');
  check(doc, 'Hydrate and eat regular meals');
  check(doc, 'Connect briefly with a colleague (non-clinical interaction)');
  
  doc.moveDown(0.3);
  sectionTitle(doc, 'Sustainable Practice Boundaries');
  body(doc, '• Physical: Designate specific workspace. Leave it when the day ends.');
  body(doc, '• Temporal: Firm start/end times. Don\'t extend because "you\'re already home."');
  body(doc, '• Digital: Turn off clinical notifications after hours. Separate devices when possible.');
  body(doc, '• Professional: Maintain consultation groups and peer supervision to combat isolation.');
  
  greenRule(doc);
  sectionTitle(doc, 'Weekly Self-Assessment');
  check(doc, 'Maintained regular breaks between sessions this week');
  check(doc, 'Engaged in physical activity outside of work on most days');
  check(doc, 'Maintained clear start and end times for clinical day');
  check(doc, 'Connected with a colleague for non-clinical interaction');
  check(doc, 'Noticed and addressed signs of fatigue before they became overwhelming');
  check(doc, 'Had at least one full day without clinical screen time');
  check(doc, 'Attended to emotional responses through supervision or reflection');
  
  return doc;
}


// ─── PDF to Buffer ───
function docToBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

// ─── Upload buffer to Cloudinary ───
async function uploadToCloudinary(buffer, publicId, displayName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'counselorready/course-resources/tmh601',
        public_id: publicId,
        resource_type: 'raw',
        format: 'pdf',
        tags: ['tmh601', 'course-resource', 'downloadable'],
        context: `caption=${displayName}|course=CR-TMH601`
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}


// ─── Main ───
async function main() {
  console.log('\n📄 CounselorReady — TMH Course Resources');
  console.log('   Generate → Upload → Patch MongoDB\n');
  
  // Verify Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Missing CLOUDINARY env vars. Check .env or Render environment.');
    process.exit(1);
  }
  console.log(`   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  
  // Define all documents
  const documents = [
    { builder: buildSessionChecklist, id: 'TMH_Session_Checklist', title: 'TeleMental Health Session Checklist', type: 'PDF Worksheet' },
    { builder: buildHIPAAQuickRef, id: 'TMH_HIPAA_Quick_Reference', title: 'HIPAA Compliance Quick Reference', type: 'PDF Handout' },
    { builder: buildSuitabilityWorksheet, id: 'TMH_Suitability_Assessment', title: 'Telehealth Suitability Assessment Worksheet', type: 'PDF Worksheet' },
    { builder: buildCrisisProtocol, id: 'TMH_Crisis_Protocol', title: 'Crisis Intervention Protocol', type: 'PDF Quick Card' },
    { builder: buildGeorgiaCompliance, id: 'TMH_Georgia_135-11', title: 'Georgia Rule 135-11 Compliance Checklist', type: 'PDF Checklist' },
    { builder: buildPlatformScorecard, id: 'TMH_Platform_Scorecard', title: 'Telehealth Platform Evaluation Scorecard', type: 'PDF Scorecard' },
    { builder: buildInformedConsentRef, id: 'TMH_Informed_Consent', title: 'Telehealth Informed Consent Elements', type: 'PDF Reference' },
    { builder: buildSelfCareGuide, id: 'TMH_SelfCare_Guide', title: 'Clinician Self-Care & Zoom Fatigue Prevention Guide', type: 'PDF Guide' },
  ];
  
  const resources = [];
  
  for (const docDef of documents) {
    process.stdout.write(`   Generating ${docDef.id}...`);
    const pdfDoc = docDef.builder();
    const buffer = await docToBuffer(pdfDoc);
    process.stdout.write(` ${(buffer.length / 1024).toFixed(0)}KB → Uploading...`);
    
    const result = await uploadToCloudinary(buffer, docDef.id, docDef.title);
    console.log(` ✅ ${result.secure_url.split('/').pop()}`);
    
    resources.push({
      title: docDef.title,
      url: result.secure_url,
      type: docDef.type
    });
  }
  
  console.log(`\n   All ${resources.length} PDFs uploaded to Cloudinary.\n`);
  
  // ─── Patch MongoDB ───
  console.log('   Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');
  
  // Find TMH course
  let course = await collection.findOne({ slug: 'mastering-telemental-health' });
  if (!course) {
    course = await collection.findOne({ slug: { $regex: /telemental|tmh/i } });
  }
  if (!course) {
    console.log('\n   ⚠️  TMH course not found in interactivecourses. Printing URLs for manual use:\n');
    resources.forEach(r => console.log(`   ${r.title}: ${r.url}`));
    await mongoose.disconnect();
    process.exit(0);
  }
  
  console.log(`   Found: "${course.title}" (${course.sections?.length || 0} sections)`);
  
  const lastIdx = (course.sections?.length || 1) - 1;
  const existingRes = (course.sections?.[lastIdx]?.contentBlocks || []).find(b => b.type === 'resources');
  
  if (existingRes) {
    console.log('   Updating existing resources block...');
    await collection.updateOne(
      { _id: course._id, [`sections.${lastIdx}.contentBlocks.type`]: 'resources' },
      { $set: { [`sections.${lastIdx}.contentBlocks.$[rb].resources`]: resources } },
      { arrayFilters: [{ 'rb.type': 'resources' }] }
    );
  } else {
    console.log('   Adding new resources block to conclusion section...');
    await collection.updateOne(
      { _id: course._id },
      { $push: { [`sections.${lastIdx}.contentBlocks`]: { id: `res_tmh_${Date.now()}`, type: 'resources', resources } } }
    );
  }
  
  // Verify
  const updated = await collection.findOne({ _id: course._id });
  const resBlock = (updated.sections[lastIdx].contentBlocks || []).find(b => b.type === 'resources');
  console.log(`\n   ✅ Done! ${resBlock.resources.length} downloadable resources linked:\n`);
  resBlock.resources.forEach(r => console.log(`   📄 ${r.title}\n      ${r.url}\n`));
  
  await mongoose.disconnect();
  console.log('   MongoDB disconnected. Resources live in the course player!\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
