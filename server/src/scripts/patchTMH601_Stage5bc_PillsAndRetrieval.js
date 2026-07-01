/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_Stage5bc_PillsAndRetrieval.js
 * ─────────────────────────────────────────
 * Stage 5b + 5c combined.
 *
 * PASS 1 — Inline pills      ({{callout:id}} from the 56-entry CALLOUT_LIBRARY)
 * PASS 2 — Custom block-level callouts (988, 164.512(j), ERPO, CAP, Baker Act, 5150, GCAL, Childhelp)
 * PASS 3 — Inline alert badges ({{alert:donot}}, {{alert:mandatory}}, {{alert:document}})
 * PASS 4 — Interleaved retrieval checks (mid-section knowledge checks with varied question types)
 *
 * Targets BOTH slugs. Every pass is idempotent — safe to re-run.
 *
 *   DRY RUN:  node src/scripts/patchTMH601_Stage5bc_PillsAndRetrieval.js
 *   APPLY:    APPLY=1 node src/scripts/patchTMH601_Stage5bc_PillsAndRetrieval.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const APPLY = process.env.APPLY === '1';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUGS = [
  'mastering-telemental-health',
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
];

// ══════════════════════════════════════════════════════════════════════════
// PASS 1 — Inline pill mappings
// Order: longest/most-specific patterns FIRST (to avoid partial-token matches)
// ══════════════════════════════════════════════════════════════════════════
const PILL_MAPPINGS = [
  // Acronyms with hyphens / specific scales
  [/\bColumbia[- ]Suicide Severity Rating Scale\b/g, 'c-ssrs'],
  [/\bC-SSRS\b/g, 'c-ssrs'],
  [/\bDSM-5(?:-TR)?\b/g, 'dsm-5'],
  [/\bICD-11\b/g, 'icd-11'],
  [/\bPCL-5\b/g, 'pcl-5'],
  [/\bPHQ-9\b/g, 'phq-9'],
  [/\bGAD-7\b/g, 'gad-7'],
  [/\bACE score(?:s)?\b/g, 'ace-score'],
  [/\bBAA(?:s)?\b/g, 'baa'],
  [/\bePHI\b/g, 'phi'],
  [/\bPHI\b/g, 'phi'],
  [/\bFERPA\b/g, 'ferpa'],
  [/\bHIPAA-compliant\b/g, 'hipaa-compliant'],
  [/\bHIPAA\b/g, 'hipaa'],
  [/\bBC-TMH\b/g, 'bc-tmh'],
  [/\bBoard[- ]Certified TeleMental Health\b/g, 'bc-tmh'],
  [/\bPSYPACT\b/g, 'psypact'],
  [/\bCounseling Compact\b/g, 'counseling-compact'],
  [/\bGCSCW\b/g, 'gcscw'],
  [/\bNBCC\b/g, 'nbcc-standard'],
  [/\bGA 1013\b/g, '1013-form'],
  [/\bForm 1013\b/g, '1013-form'],
  [/\bGeorgia (?:Composite Board )?Rule 135-11(?:-?\.01)?\b/g, 'telehealth-rule'],
  [/\bGA Rule 135\b/g, 'telehealth-rule'],
  [/\bACA Code of Ethics\b/g, 'aca-code'],
  [/\bNASW Code(?: of Ethics)?\b/g, 'nasw-code'],

  // Frameworks & approaches
  [/\bTF-CBT\b/g, 'tf-cbt'],
  [/\bEMDR\b/g, 'emdr'],
  [/\bCPT\b/g, 'cpt'],
  [/\bDEAR MAN\b/g, 'dear-man'],
  [/\bTIPP\b/g, 'tipp'],
  [/\bOARS\b/g, 'oars'],
  [/\bCAMS\b/g, 'cams'],
  [/\bStanley[- ]Brown\b/g, 'stanley-brown'],

  // Multi-word terms (case-insensitive)
  [/\bduty to warn\b/gi, 'duty-to-warn'],
  [/\bTarasoff\b/g, 'duty-to-warn'],
  [/\binformed consent\b/gi, 'informed-consent'],
  [/\bmandatory reporting\b/gi, 'mandatory-report'],
  [/\btreatment plan(?:s|ning)?\b/gi, 'treatment-plan'],
  [/\bSOAP note(?:s)?\b/gi, 'soap-note'],
  [/\bRelease of Information\b/g, 'roi'],
  [/\bdual relationship(?:s)?\b/gi, 'dual-relationship'],
  [/\bcultural humility\b/gi, 'cultural-humility'],
  [/\bmicroaggression(?:s)?\b/gi, 'microaggression'],
  [/\bracial trauma\b/gi, 'racial-trauma'],
  [/\bintersectionality\b/gi, 'intersectionality'],
  [/\bsafety plan(?:ning|s)?\b/gi, 'safety-plan'],
  [/\blethal means(?: counseling)?\b/gi, 'lethal-means'],
  [/\bpolyvagal(?: theory)?\b/gi, 'polyvagal'],
  [/\bwindow of tolerance\b/gi, 'window-tolerance'],
  [/\bvicarious trauma\b/gi, 'vicarious-trauma'],
  [/\bcountertransference\b/gi, 'countertransference'],
  [/\bwise mind\b/gi, 'wise-mind'],
  [/\bradical acceptance\b/gi, 'radical-acceptance'],
  [/\bopposite action\b/gi, 'opposite-action'],
  [/\bchange talk\b/gi, 'change-talk'],
  [/\bsustain talk\b/gi, 'sustain-talk'],
];

// ══════════════════════════════════════════════════════════════════════════
// PASS 2 — Block-level custom callout extensions
// For each entry, find blocks in the target section whose content matches
// the anchor regex and attach block.callouts = { ...customs }.
// These custom callouts will only be usable IF the text block also contains
// {{callout:id}} syntax referencing them — which we add in the same step.
// ══════════════════════════════════════════════════════════════════════════
const BLOCK_CUSTOM_CALLOUTS = [
  // §9 Crisis section — first text block mentioning 988
  {
    sectionTitleMatch: /Crisis Intervention/i,
    blockContentMatch: /988/,  // catch the first crisis block referencing 988
    addCallouts: {
      '988': {
        label: '988',
        type: 'reference',
        body: '988 Suicide & Crisis Lifeline. Call, text, or chat 24/7. Veterans press 1; LGBTQ+ press 3; Spanish & ASL routing built in. Launched July 2022 as the universal US mental-health crisis number.'
      },
      '164-512j': {
        label: '45 CFR 164.512(j)',
        type: 'ethics',
        body: 'HIPAA emergency disclosure exception. Authorizes good-faith disclosure of PHI to prevent or lessen a serious and imminent threat to health or safety. Recipient must be reasonably able to prevent or lessen the threat. Minimum-necessary standard still applies.'
      },
      'gcal': {
        label: 'GCAL',
        type: 'reference',
        body: 'Georgia Crisis & Access Line. 1-800-715-4225. 24/7 behavioral-health crisis dispatch, including mobile crisis teams. The first call for Georgia clients in acute crisis.'
      },
      'erpo': {
        label: 'ERPO',
        type: 'warning',
        body: 'Extreme Risk Protection Order ("red flag law"). Civil court order temporarily removing firearm access from a person determined to be a risk to self or others. 21 states + DC have ERPO statutes as of 2024; 8 of those allow mental-health professionals to petition directly.'
      },
      'cap-laws': {
        label: 'CAP laws',
        type: 'warning',
        body: 'Child Access Prevention laws. Criminalize negligent firearm storage when a minor accesses the weapon. 16 states + DC have CAP statutes; useful additional lever when a suicidal parent is in the home with minors.'
      },
      'baker-act': {
        label: 'Baker Act',
        type: 'reference',
        body: 'Florida Mental Health Act §394.463. Authorizes 72-hour involuntary examination for mental illness with imminent risk of self-harm or harm to others. Initiated by physician, mental-health professional, or law enforcement.'
      },
      '5150': {
        label: '5150',
        type: 'reference',
        body: 'California Welfare & Institutions Code §5150. Authorizes 72-hour involuntary psychiatric hold for danger to self, danger to others, or grave disability due to mental disorder.'
      },
      'childhelp': {
        label: 'Childhelp',
        type: 'reference',
        body: 'Childhelp National Child Abuse Hotline. 1-800-422-4453. Routes callers to the appropriate state child-welfare reporting agency 24/7. Single number to memorize for cross-jurisdictional child-abuse reporting.'
      },
      'trevor': {
        label: 'The Trevor Project',
        type: 'reference',
        body: 'LGBTQ+ youth crisis support (ages 13–24). 1-866-488-7386; text START to 678-678; chat at thetrevorproject.org. Trained for identity-related distress.'
      },
      'crisis-text': {
        label: 'Crisis Text Line',
        type: 'reference',
        body: 'Text HOME to 741741 — 24/7 crisis support via text. Critical for clients who cannot speak aloud (DV survivors in shared homes, hearing impaired without video access, after-hours discretion).'
      },
      'veterans-line': {
        label: 'Veterans Crisis Line',
        type: 'reference',
        body: '988 → press 1, or text 838255. Active duty, veterans, and family members. Staffed by VA-trained responders. Distinct routing from the main 988 line.'
      },
    },
    insertPillsAt: {
      // Replace first {{callout-target}} occurrence in this block
      // text → "{{callout:id}}" inline
      '988': /\b988(?! (?:Suicide|Lifeline|→|press|text))/,
      '164-512j': /\b164\.512\(j\)\b/,
      'gcal': /\bGCAL\b/,
      'erpo': /\bERPO\b/,
      'cap-laws': /\bCAP[- ]law\b/i,
      'baker-act': /\bBaker Act\b/,
      '5150': /\b5150\b/,
      'childhelp': /\bChildhelp\b/,
      'trevor': /\bThe Trevor Project\b/,
      'crisis-text': /\bCrisis Text Line\b/,
      'veterans-line': /\bVeterans Crisis Line\b/,
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════
// PASS 3 — Inline alert badges (used sparingly — high-signal moments only)
// ══════════════════════════════════════════════════════════════════════════
const ALERT_INSERTIONS = [
  // Format: { sectionTitleMatch, contentMatch (must appear), insertBefore: regex, badge: 'donot'|'mandatory'|'document'|'protocol'|'ethics'|'legal' }

  // §9 Crisis — "Document the disclosure" → {{alert:document}} prefix
  {
    sectionTitleMatch: /Crisis Intervention/i,
    contentAnchor: /Document the disclosure under 45 CFR 164\.512\(j\)/,
    skip: true, // already covered by block-level Disclosure callout; don't double-badge
  },
];

// ══════════════════════════════════════════════════════════════════════════
// PASS 4 — Interleaved retrieval checks
// One mid-section knowledge check per section, varied question types.
// Inserted AFTER a specific anchor text-block to break up the wall.
// Idempotency: skipped if a block with the same `title` already exists.
// ══════════════════════════════════════════════════════════════════════════
const RETRIEVAL_CHECKS = [
  // §1 — Foundations: fillInBlank on terminology
  {
    sectionTitleMatch: /Foundations of Telemental Health/i,
    afterBlockContaining: /Telemental health refers broadly|terminology surrounding/i,
    block: {
      type: 'fillInBlank',
      title: 'Quick check — terminology',
      blanks: [
        { prompt: 'The credential that validates telemental health competency (3 letters with hyphen):',
          answer: 'BC-TMH', acceptAlternates: ['bctmh', 'BC TMH', 'Board Certified TeleMental Health'] },
        { prompt: 'The umbrella term the ACA adopted in its 2014 Code for technology-mediated mental-health services:',
          answer: 'distance counseling', acceptAlternates: ['distance-counseling'] },
      ],
    },
  },

  // §2 — Regulatory: multiSelect on federal/state framework
  {
    sectionTitleMatch: /Regulatory Landscape/i,
    afterBlockContaining: /HIPAA Privacy Rule|HIPAA Security Rule|covered entit/i,
    block: {
      type: 'multiSelect',
      question: 'Which of the following are HIPAA Security Rule safeguard categories? (Select all that apply)',
      options: [
        { text: 'Administrative safeguards', isCorrect: true },
        { text: 'Physical safeguards', isCorrect: true },
        { text: 'Technical safeguards', isCorrect: true },
        { text: 'Financial safeguards', isCorrect: false },
        { text: 'Legal safeguards', isCorrect: false },
      ],
      explanation: 'The HIPAA Security Rule organizes ePHI protections into three categories: administrative (policies, training, designated security officer), physical (facility access, device security), and technical (access controls, encryption, audit logs). Financial and legal are not Security Rule categories.',
    },
  },

  // §3 — HIPAA: cardSort on safeguard categorization
  {
    sectionTitleMatch: /HIPAA Compliance|HIPAA.*Technology/i,
    afterBlockContaining: /Security Rule|administrative safeguard/i,
    block: {
      type: 'cardSort',
      instructions: 'Drag (or tap on mobile) each item to its correct HIPAA Security Rule safeguard category.',
      categories: ['Administrative', 'Physical', 'Technical'],
      cards: [
        { id: 'so', text: 'Designate a Security Officer',          correctCategory: 'Administrative' },
        { id: 'wt', text: 'Workforce HIPAA training annually',     correctCategory: 'Administrative' },
        { id: 'cp', text: 'Contingency / disaster recovery plan',  correctCategory: 'Administrative' },
        { id: 'fa', text: 'Locked office door at home practice',   correctCategory: 'Physical' },
        { id: 'sd', text: 'Encrypted hard drive on laptop',         correctCategory: 'Physical' },
        { id: 'ws', text: 'Workstation positioned away from window', correctCategory: 'Physical' },
        { id: 'ac', text: 'Unique user IDs and access controls',   correctCategory: 'Technical' },
        { id: 'al', text: 'Audit logs of PHI access',              correctCategory: 'Technical' },
        { id: 'en', text: 'End-to-end encryption of video sessions', correctCategory: 'Technical' },
      ],
      explanation: 'Administrative = the policies and people. Physical = doors, devices, and rooms. Technical = the digital safeguards built into systems.',
    },
  },

  // §4 — Platforms: 2-option multipleChoice on platform selection
  {
    sectionTitleMatch: /Platform Selection|Digital Security/i,
    afterBlockContaining: /BAA|business associate/i,
    block: {
      type: 'multipleChoice',
      question: 'A colleague offers to share their Zoom Pro account so you can save on platform costs. They confirm Zoom has end-to-end encryption. Is this HIPAA-compliant for telehealth?',
      options: [
        { text: 'Yes — encryption is the key HIPAA requirement', isCorrect: false },
        { text: 'No — you need your own BAA in your own name, regardless of encryption', isCorrect: true },
      ],
      explanation: 'Encryption is one Security Rule requirement, but the BAA is non-negotiable. A BAA is a contract between YOUR practice and the platform vendor — it does not transfer between accounts. Sharing an account would also create privacy collisions with the colleague\'s clients.',
    },
  },

  // §5 — Consent: sequencing on consent process
  {
    sectionTitleMatch: /Informed Consent|Clinical Documentation/i,
    afterBlockContaining: /informed consent|consent document/i,
    block: {
      type: 'sequencing',
      instructions: 'Put these steps of a telehealth informed-consent process in the order a clinician should address them with a new client.',
      steps: [
        { order: 1, text: 'Verify client identity and current physical location' },
        { order: 2, text: 'Review modality-specific risks (privacy, technology failure, recording)' },
        { order: 3, text: 'Establish emergency contact and nearest ED address' },
        { order: 4, text: 'Discuss limits of confidentiality, including mandatory reporting and HIPAA emergency disclosure' },
        { order: 5, text: 'Confirm client comprehension and obtain documented consent' },
      ],
      explanation: 'Identity and location verification come FIRST — you cannot meaningfully consent a person whose identity or jurisdiction you have not verified. Limits-of-confidentiality precedes signature because consent must be informed.',
    },
  },

  // §6 — Populations: matching on special populations to considerations
  {
    sectionTitleMatch: /Special Populations|Cultural Considerations/i,
    afterBlockContaining: /digital divide|disparit|underserved/i,
    block: {
      type: 'matching',
      matchingInstructions: 'Match each special population to its primary telehealth consideration.',
      matchingPairs: [
        { term: 'Geriatric clients',              definition: 'Larger fonts, slower pacing, simplified platform interfaces, screen-reader compatibility' },
        { term: 'Pediatric clients (ages 5–10)',  definition: 'Parental presence calibration, shorter sessions, on-screen play tools, attention to caregiver dynamics in the home' },
        { term: 'LGBTQ+ clients in unaffirming households', definition: 'Signal phrases for safety, headphones, scheduled times when adversarial family is not home' },
        { term: 'Rural clients with poor broadband', definition: 'Audio-only fallback protocol, lower-bandwidth platform options, phone-session reimbursement parity' },
        { term: 'Deaf / hard-of-hearing clients',  definition: 'Video with ASL interpreter on screen, written backup channel, lower latency requirement' },
      ],
    },
  },

  // §7 — Assessment: fillInBlank on validated instruments
  {
    sectionTitleMatch: /Clinical Assessment Adaptations|Assessment.*Telehealth/i,
    afterBlockContaining: /PHQ-9|GAD-7|standardized screening/i,
    block: {
      type: 'fillInBlank',
      title: 'Quick check — instruments',
      blanks: [
        { prompt: 'Validated suicide risk assessment (5 chars with hyphen):', answer: 'C-SSRS', acceptAlternates: ['CSSRS', 'C SSRS', 'Columbia'] },
        { prompt: 'Depression screen — 9 items, score 0–27:', answer: 'PHQ-9', acceptAlternates: ['PHQ9', 'PHQ 9'] },
        { prompt: 'Anxiety screen — 7 items, mild/moderate/severe at 5/10/15:', answer: 'GAD-7', acceptAlternates: ['GAD7', 'GAD 7'] },
      ],
    },
  },

  // §8 — Treatment modifications: multipleChoice 4-opt
  {
    sectionTitleMatch: /Evidence-Based Treatment|Treatment Modifications/i,
    afterBlockContaining: /CBT|exposure therapy|evidence-based/i,
    block: {
      type: 'multipleChoice',
      question: 'Which evidence-based PTSD treatment has the strongest empirical support for virtual delivery, including telehealth-specific RCTs?',
      options: [
        { text: 'EMDR — though most studies are pre-pandemic and in-person',         isCorrect: false },
        { text: 'Prolonged Exposure (PE) — RCT-validated via telehealth',           isCorrect: true },
        { text: 'Generic supportive therapy with weekly check-ins',                  isCorrect: false },
        { text: 'Group CBT only — individual PTSD treatment is not telehealth-suitable', isCorrect: false },
      ],
      explanation: 'Prolonged Exposure (Acierno et al., 2017) has direct RCT validation via telehealth. EMDR also has growing evidence for telehealth use, but the strongest empirical base for virtually-delivered PTSD treatment is currently PE. Group-only is not supported by the evidence.',
    },
  },

  // §9 — Crisis: sequencing — the graduated reconnect protocol
  {
    sectionTitleMatch: /Crisis Intervention/i,
    afterBlockContaining: /Technology Failure During Crisis|video connection drops/i,
    block: {
      type: 'sequencing',
      instructions: 'Put the graduated reconnect protocol in correct order. You are mid-crisis and your video connection just dropped.',
      steps: [
        { order: 1, text: 'Attempt to reconnect through the telehealth platform' },
        { order: 2, text: 'Call the client directly on their phone' },
        { order: 3, text: "Contact the client's designated emergency contact" },
        { order: 4, text: "Initiate a welfare check via the CLIENT'S local non-emergency dispatch" },
      ],
      explanation: 'The graduated protocol moves from least-intrusive to most. Calling 911 from your own location is NEVER step 1 in a cross-jurisdiction crisis — it routes to YOUR local dispatch, not the client\'s. Always use the pre-collected local non-emergency dispatch number for the client\'s jurisdiction.',
    },
  },

  // §9 — Crisis: multiSelect on 164.512(j) — cross-references §3 HIPAA
  {
    sectionTitleMatch: /Crisis Intervention/i,
    afterBlockContaining: /164\.512\(j\)|emergency disclosure exception/i,
    block: {
      type: 'multiSelect',
      title: 'Cross-section check — HIPAA in crisis',
      question: 'From the HIPAA material in §3 + the crisis exception in §9 — which of these disclosures are PERMISSIBLE under 45 CFR 164.512(j) without client authorization? (Select all that apply)',
      options: [
        { text: "Telling 911 dispatch the client's location and that there is a firearm in the home", isCorrect: true },
        { text: "Telling the client's emergency contact 'I need you to go check on Marcus right now'", isCorrect: true },
        { text: "Posting on a clinician peer forum to ask 'has anyone dealt with a 9 PM crisis call?'", isCorrect: false },
        { text: "Briefing a CIT-trained officer on the client's known weapon access and substance use", isCorrect: true },
        { text: "Texting the client's mother a copy of last week's session notes for context",      isCorrect: false },
      ],
      explanation: '164.512(j) permits disclosure to persons "reasonably able to prevent or lessen the threat" — emergency dispatch, responding officers, and designated emergency contacts qualify. Peer forums and full-record disclosures do NOT — they violate minimum-necessary even in a crisis frame.',
    },
  },

  // §10 — Ethics: vignette callback to §1 Dr. Martinez
  {
    sectionTitleMatch: /Ethical Decision-Making|Ethics in Digital/i,
    afterBlockContaining: /ethical decision|ACA Code|decision-making framework/i,
    block: {
      type: 'multipleChoice',
      title: 'Vignette callback — Dr. Martinez',
      question: 'Recall Dr. Martinez from §1 — the LPC with 15 years of in-person experience who transitioned to telehealth during COVID. Which of the nine BC-TMH competency domains best describes her INITIAL gap before training?',
      options: [
        { text: 'Cultural competence and diversity in telehealth',     isCorrect: false },
        { text: 'Dispositions and telepresence',                       isCorrect: true },
        { text: 'Legal, ethical, and regulatory framework',            isCorrect: false },
        { text: 'Research and trends in telemental health',            isCorrect: false },
      ],
      explanation: 'Dr. Martinez had legal/ethical knowledge from her years of in-person practice — what she was missing was telepresence: the deliberate adaptation of camera positioning, voice modulation, and session structure for the virtual medium. "Dispositions and telepresence" is the BC-TMH domain that names this skill set.',
    },
  },

  // §11 — Interstate: matching on jurisdictional mechanisms
  {
    sectionTitleMatch: /Interstate Practice|Jurisdictional/i,
    afterBlockContaining: /Counseling Compact|PSYPACT|interstate/i,
    block: {
      type: 'matching',
      matchingInstructions: 'Match each scenario to the correct interstate-practice mechanism.',
      matchingPairs: [
        { term: 'A Georgia LPC wants to continue seeing a client who moved to North Carolina (Compact state)',
          definition: 'Counseling Compact privilege to practice — apply for the compact privilege through your home licensing board' },
        { term: 'A Georgia-licensed psychologist (not LPC) wants to see clients in 8 different states',
          definition: 'PSYPACT — psychology-specific compact, separate from Counseling Compact, with E.Passport credential' },
        { term: 'A Georgia LPC takes a 2-week vacation in Florida and a current client requests a session',
          definition: "Florida-specific temporary-practice rule — check FL Board's emergency / temporary-practice provisions before agreeing" },
        { term: 'A Georgia LPC wants to start a permanent practice serving California clients',
          definition: 'Full California licensure required — California is not in the Counseling Compact' },
      ],
    },
  },

  // §12 — Practice building: reflection
  {
    sectionTitleMatch: /Building.*Telehealth Practice|Sustaining/i,
    afterBlockContaining: /burnout|sustainability|business planning|professional development/i,
    block: {
      type: 'reflection',
      question: 'Reflect — Based on everything in this course, name two specific changes you will make to your current (or planned) telehealth practice within 30 days, and how you will know each change is working.',
      minLength: 100,
    },
  },

  // §13 — Conclusion: multipleChoice synthesis
  {
    sectionTitleMatch: /Conclusion|Integrating Competent Virtual/i,
    afterBlockContaining: /integrat|conclusion|sustain/i,
    block: {
      type: 'multipleChoice',
      question: 'A Georgia LPC providing telehealth to a client physically located in Florida discovers mid-session that the client is in acute suicidal crisis. The client refuses voluntary ED transport. The clinician should:',
      options: [
        { text: 'Call 911 from her Georgia office phone immediately',
          isCorrect: false },
        { text: "Use Florida's Baker Act provision via the pre-collected local non-emergency dispatch in the client's Florida county, brief them on the safety concern, and remain in continuous video contact",
          isCorrect: true },
        { text: 'End the session and document her assessment that the client refused care',
          isCorrect: false },
        { text: "Call Florida's main licensing board to ask for guidance",
          isCorrect: false },
      ],
      explanation: 'The correct path uses jurisdictional emergency dispatch (NOT 911 from the clinician\'s location — that routes to Georgia), invokes Florida\'s Baker Act because Florida is the client\'s physical location, and maintains continuous presence — which is itself an evidence-based intervention. Ending the session breaks the duty of care; calling the licensing board mid-crisis is a category error.',
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════

/**
 * Apply inline pill replacements to an HTML string.
 * - First occurrence per pattern per block
 * - Skips replacements inside <h*>, <strong>, <em>, <code>, <a>, and existing pill/alert syntax
 * Returns { html, replacementsCount }
 */
function applyPillsToHtml(html) {
  if (!html || typeof html !== 'string') return { html, replacementsCount: 0 };

  // If block already has pill or alert syntax, skip entirely (idempotency)
  if (/\{\{(?:callout|alert):/.test(html)) {
    return { html, replacementsCount: 0, skipped: true };
  }

  // Tokenize: separate "protected" segments (inside tags we won't touch) from replaceable ones
  // Protected: <h1>...</h1>, <h2>...</h2>, ..., <strong>...</strong>, <em>...</em>, <a ...>...</a>, <code>...</code>
  // Replaceable: everything else
  // We do this by walking through the string and tagging segments.
  const PROTECTED_RE = /<(h[1-6]|strong|em|code|a)\b[^>]*>[\s\S]*?<\/\1>/gi;
  const segments = [];
  let lastIdx = 0;
  let m;
  while ((m = PROTECTED_RE.exec(html)) !== null) {
    if (m.index > lastIdx) segments.push({ text: html.slice(lastIdx, m.index), protected: false });
    segments.push({ text: m[0], protected: true });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < html.length) segments.push({ text: html.slice(lastIdx), protected: false });

  let totalReplacements = 0;

  // Track which calloutIds have been used (first-occurrence-per-block)
  const usedIds = new Set();

  for (const [regex, calloutId] of PILL_MAPPINGS) {
    if (usedIds.has(calloutId)) continue;
    // Apply only to the FIRST non-protected segment that contains a match
    for (const seg of segments) {
      if (seg.protected) continue;
      // Reset regex's lastIndex
      regex.lastIndex = 0;
      if (regex.test(seg.text)) {
        // Replace the first match only
        regex.lastIndex = 0;
        seg.text = seg.text.replace(regex, (match, _offset) => {
          // Only the first match for this pattern
          if (usedIds.has(calloutId)) return match;
          usedIds.add(calloutId);
          totalReplacements++;
          return `{{callout:${calloutId}}}`;
        });
        break;
      }
    }
  }

  return { html: segments.map(s => s.text).join(''), replacementsCount: totalReplacements };
}

function sectionHasBlockTitled(section, title) {
  return (section.contentBlocks || []).some(b => b.title === title);
}

function sectionHasBlockMatching(section, predicate) {
  return (section.contentBlocks || []).some(predicate);
}

function findBlockIdxMatching(section, predicate) {
  return (section.contentBlocks || []).findIndex(predicate);
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = db.collection('interactivecourses');

  console.log('═'.repeat(78));
  console.log(`  Stage 5b+c — Pills, Custom Callouts, Alert Badges, Retrieval Checks`);
  console.log(`  Mode: ${APPLY ? 'APPLY (writing changes)' : 'DRY RUN (no writes)'}`);
  console.log('═'.repeat(78));

  for (const slug of SLUGS) {
    console.log(`\n── ${slug.slice(0, 70)}${slug.length > 70 ? '…' : ''}`);
    const course = await courses.findOne({ slug });
    if (!course) { console.log('   ❌ not found'); continue; }
    console.log(`   ${course.sections?.length || 0} sections`);

    let stats = {
      pass1_pillsInserted: 0,
      pass1_blocksTouched: 0,
      pass1_blocksSkipped: 0,
      pass2_customCalloutsAttached: 0,
      pass2_pillsFromCustoms: 0,
      pass3_alertBadgesInserted: 0,
      pass4_retrievalChecksInserted: 0,
      warnings: [],
    };

    // ───────── PASS 1: Inline pills via existing CALLOUT_LIBRARY ─────────
    for (const section of (course.sections || [])) {
      for (const block of (section.contentBlocks || [])) {
        if (block.type !== 'text') continue;
        if (!block.content || typeof block.content !== 'string') continue;

        const { html, replacementsCount, skipped } = applyPillsToHtml(block.content);
        if (skipped) {
          stats.pass1_blocksSkipped++;
          continue;
        }
        if (replacementsCount > 0) {
          block.content = html;
          stats.pass1_pillsInserted += replacementsCount;
          stats.pass1_blocksTouched++;
        }
      }
    }
    console.log(`   PASS 1 pills:     +${stats.pass1_pillsInserted} pill insertions across ${stats.pass1_blocksTouched} blocks  (${stats.pass1_blocksSkipped} blocks already had pills, skipped)`);

    // ───────── PASS 2: Block-level custom callouts ─────────
    for (const entry of BLOCK_CUSTOM_CALLOUTS) {
      const section = (course.sections || []).find(s => entry.sectionTitleMatch.test(s.title || ''));
      if (!section) {
        stats.warnings.push(`PASS 2: section not found for ${entry.sectionTitleMatch}`);
        continue;
      }
      // Find the first text block whose content matches the anchor regex
      const blockIdx = findBlockIdxMatching(section, b =>
        b.type === 'text' && b.content && entry.blockContentMatch.test(b.content)
      );
      if (blockIdx === -1) {
        stats.warnings.push(`PASS 2: anchor block not found in ${section.title}`);
        continue;
      }
      const block = section.contentBlocks[blockIdx];
      block.callouts = block.callouts || {};
      let attachedThisBlock = 0;
      let pillsFromCustomsThisBlock = 0;

      for (const [id, def] of Object.entries(entry.addCallouts)) {
        if (block.callouts[id]) continue; // already attached
        block.callouts[id] = def;
        attachedThisBlock++;
      }

      // Insert pills using the custom IDs (first occurrence per pattern)
      if (entry.insertPillsAt) {
        for (const [id, pat] of Object.entries(entry.insertPillsAt)) {
          // Skip if block already has a pill for this id
          if (new RegExp(`\\{\\{callout:${id}\\}\\}`).test(block.content)) continue;
          pat.lastIndex = 0;
          if (pat.test(block.content)) {
            pat.lastIndex = 0;
            // Replace first occurrence
            block.content = block.content.replace(pat, () => {
              pillsFromCustomsThisBlock++;
              return `{{callout:${id}}}`;
            });
          }
        }
      }

      if (attachedThisBlock || pillsFromCustomsThisBlock) {
        stats.pass2_customCalloutsAttached += attachedThisBlock;
        stats.pass2_pillsFromCustoms += pillsFromCustomsThisBlock;
      }
    }
    console.log(`   PASS 2 customs:   +${stats.pass2_customCalloutsAttached} custom callout defs attached, +${stats.pass2_pillsFromCustoms} pills wired from those customs`);

    // ───────── PASS 3: Alert badges (skip — placeholders only this round) ─────────
    console.log(`   PASS 3 alerts:    +${stats.pass3_alertBadgesInserted} alert badges (no alert insertions configured this pass; held for future)`);

    // ───────── PASS 4: Interleaved retrieval checks ─────────
    for (const entry of RETRIEVAL_CHECKS) {
      const section = (course.sections || []).find(s => entry.sectionTitleMatch.test(s.title || ''));
      if (!section) {
        stats.warnings.push(`PASS 4: section not found for ${entry.sectionTitleMatch}`);
        continue;
      }
      // Idempotency: skip if a block with the same title already exists in this section
      const existingTitle = entry.block.title || entry.block.question?.slice(0, 50);
      const alreadyHas = (section.contentBlocks || []).some(b => {
        if (entry.block.title && b.title === entry.block.title) return true;
        if (b.question && entry.block.question && b.question === entry.block.question) return true;
        return false;
      });
      if (alreadyHas) continue;

      // Find anchor — block whose content matches anchor regex
      const anchorIdx = (section.contentBlocks || []).findIndex(b =>
        b.type === 'text' && b.content && entry.afterBlockContaining.test(b.content)
      );
      if (anchorIdx === -1) {
        // Fallback: insert before the first reflection or final multipleChoice (i.e., at section end before existing checks)
        const fallbackIdx = (section.contentBlocks || []).findIndex(b => b.type === 'reflection' || b.type === 'multipleChoice');
        const insertAt = fallbackIdx >= 0 ? fallbackIdx : section.contentBlocks.length;
        section.contentBlocks.splice(insertAt, 0, entry.block);
        stats.pass4_retrievalChecksInserted++;
        stats.warnings.push(`PASS 4: anchor not found in ${section.title}; inserted at fallback position ${insertAt}`);
      } else {
        section.contentBlocks.splice(anchorIdx + 1, 0, entry.block);
        stats.pass4_retrievalChecksInserted++;
      }
    }
    console.log(`   PASS 4 retrieval: +${stats.pass4_retrievalChecksInserted} new mid-section knowledge checks`);

    if (stats.warnings.length) {
      console.log('   Warnings:');
      for (const w of stats.warnings) console.log(`     • ${w}`);
    }

    // ───────── Final verification (counts after passes) ─────────
    let totalPills = 0, totalAlerts = 0, totalChecks = 0;
    for (const s of (course.sections || [])) {
      for (const b of (s.contentBlocks || [])) {
        if (typeof b.content === 'string') {
          totalPills += (b.content.match(/\{\{callout:/g) || []).length;
          totalAlerts += (b.content.match(/\{\{alert:/g) || []).length;
        }
        if (['multipleChoice', 'multiSelect', 'fillInBlank', 'matching', 'sequencing', 'cardSort', 'reflection', 'knowledgeCheck'].includes(b.type)) {
          totalChecks++;
        }
      }
    }
    console.log(`   POST-PASS COUNTS — pills: ${totalPills}  alerts: ${totalAlerts}  knowledge-checks: ${totalChecks}`);

    if (APPLY) {
      const res = await courses.updateOne({ slug }, { $set: { sections: course.sections } });
      console.log(`   ✓ ${res.modifiedCount > 0 ? 'WROTE' : 'no-op'} (matched ${res.matchedCount}, modified ${res.modifiedCount})`);
    } else {
      console.log('   DRY RUN — not writing');
    }
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });
