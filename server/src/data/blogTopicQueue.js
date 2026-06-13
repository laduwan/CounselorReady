/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Blog Topic Queue — source list for automated draft generation.
 *
 * The blogAutoGen job picks one topic per run (weekly), generates a draft,
 * and saves it for admin review. Topics rotate in order; each is tagged
 * `autogen-<id>` so the job knows what has already been generated.
 *
 * ADDING TOPICS: append to the array. Never remove or reorder existing entries
 * (it would shift the rotation). To retire a topic, set `retired: true`.
 *
 * CATEGORIES (must match BlogPost schema enum):
 *   state-guide | problem-solution | authority | news | clinical
 *
 * partnerAngle: true  → post is aimed at CE providers, links to /partner
 * partnerAngle: false → post is aimed at licensed counselors, links to /courses
 */

export const BLOG_TOPICS = [
  // ── STATE GUIDES ──────────────────────────────────────────────────────────
  {
    id: 'ce-requirements-georgia-lpc',
    title: 'Georgia LPC CE Requirements: What Every Licensed Counselor Needs to Know',
    category: 'state-guide',
    targetKeywords: ['georgia lpc ce requirements', 'lpc renewal georgia', 'georgia continuing education counselor'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse Georgia-compliant CE courses',
    partnerAngle: false,
    brief: 'Cover Georgia Composite Board CE requirements: 35 hours per renewal cycle, synchronous ethics requirement, telehealth training rule (135-11), and how to stay audit-ready.'
  },
  {
    id: 'ce-requirements-texas-lpc',
    title: 'Texas LPC CE Requirements: Hours, Ethics, and Renewal Deadlines',
    category: 'state-guide',
    targetKeywords: ['texas lpc ce requirements', 'texas counselor renewal', 'lpc ce hours texas'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse CE courses approved for Texas LPCs',
    partnerAngle: false,
    brief: 'Cover Texas State Board of Examiners of Professional Counselors CE requirements: hours per cycle, ethics mandate, jurisprudence exam, and renewal deadlines.'
  },
  {
    id: 'ce-requirements-florida-lmhc',
    title: 'Florida LMHC Continuing Education Requirements: A Complete Renewal Guide',
    category: 'state-guide',
    targetKeywords: ['florida lmhc ce requirements', 'florida mental health counselor renewal', 'lmhc continuing education florida'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse CE courses for Florida LMHCs',
    partnerAngle: false,
    brief: 'Cover Florida Department of Health CE requirements for LMHCs: hours per cycle, HIV/AIDS mandate, domestic violence, medical errors, and renewal process.'
  },
  {
    id: 'ce-requirements-idaho-lpc',
    title: 'Idaho LPC Continuing Education Requirements: What the Board Actually Requires',
    category: 'state-guide',
    targetKeywords: ['idaho lpc ce requirements', 'idaho counselor renewal continuing education', 'idaho lpc renewal hours'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse CE courses for Idaho LPCs',
    partnerAngle: false,
    brief: 'Cover Idaho Counselor Licensing Board CE requirements: hours per renewal, ethics requirements, asynchronous CE eligibility, and audit documentation.'
  },
  {
    id: 'multi-state-ce-tracking',
    title: 'Licensed in Multiple States? How to Manage CE Requirements Without Losing Your Mind',
    category: 'problem-solution',
    targetKeywords: ['multi-state lpc ce requirements', 'counselor license renewal multiple states', 'tracking ce hours multiple licenses'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Track your CE hours across all your licenses',
    partnerAngle: false,
    brief: 'Address the real challenge of managing CE for LPCs licensed in 2+ states with different cycle lengths, ethics mandates, and approved provider rules. Practical tracking strategies and tools.'
  },
  // ── PROBLEM-SOLUTION ──────────────────────────────────────────────────────
  {
    id: 'missing-lpc-renewal-deadline',
    title: 'What Happens If You Miss Your LPC Renewal Deadline — And How to Recover',
    category: 'problem-solution',
    targetKeywords: ['missed lpc renewal deadline', 'lpc license lapsed', 'expired counselor license renewal'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Complete your CE hours before your deadline',
    partnerAngle: false,
    brief: 'Walk through the real consequences of a lapsed LPC: late fees, practice restrictions, board reinstatement steps. Include prevention advice and how to complete CE efficiently at the last minute.'
  },
  {
    id: 'new-lpc-first-ce',
    title: 'First Renewal as an LPC: Which CE Courses Should You Take?',
    category: 'problem-solution',
    targetKeywords: ['first lpc renewal ce courses', 'new lpc continuing education', 'what ce should new counselors take'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse courses built for licensed counselors',
    partnerAngle: false,
    brief: 'Address the overwhelm new LPCs feel at first renewal. Guide on how to balance required categories (ethics, clinical skills) with professional development interests. Emphasis on building a CE identity.'
  },
  {
    id: 'ethics-ce-guide',
    title: 'Ethics CE for Licensed Counselors: What Counts, What Doesn\'t, and Why It Matters',
    category: 'authority',
    targetKeywords: ['ethics ce counselors', 'lpc ethics continuing education', 'nbcc ethics ce requirements'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse ACA Ethics CE courses',
    partnerAngle: false,
    brief: 'Explain the difference between ethics-specific CE and general CE that touches ethical topics. Cover ACA Code of Ethics, state board ethics mandates, and what an ethics course needs to cover to count.'
  },
  {
    id: 'telehealth-ce-requirements',
    title: 'Telehealth CE Requirements for Counselors: What Every State Expects',
    category: 'state-guide',
    targetKeywords: ['telehealth ce requirements counselors', 'telemental health training lpc', 'georgia rule 135-11 ce'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse telemental health CE courses',
    partnerAngle: false,
    brief: 'State-by-state breakdown of telehealth CE mandates for LPCs, focusing on Georgia Rule 135-11 (the most specific in the country), plus general telehealth competency expectations.'
  },
  {
    id: 'nbcc-ce-audit-guide',
    title: 'NBCC CE Audit: What to Keep on File and How to Survive One',
    category: 'authority',
    targetKeywords: ['nbcc ce audit', 'ncc renewal audit documentation', 'nbcc continuing education records'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Get audit-ready certificates instantly',
    partnerAngle: false,
    brief: 'Explain who gets audited, what NBCC asks for, and exactly what documentation to keep: certificates with provider number, course title, CE hours, completion date. Tie into CounselorReady\'s audit-ready certificates.'
  },
  // ── AUTHORITY / NBCC ──────────────────────────────────────────────────────
  {
    id: 'what-is-nbcc-acep',
    title: 'What Is an NBCC ACEP Provider — And Why It Matters for Your CE Credits',
    category: 'authority',
    targetKeywords: ['what is nbcc acep', 'nbcc approved continuing education provider', 'nbcc acep ce credits'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse courses from NBCC Approved CE Provider #7760',
    partnerAngle: false,
    brief: 'Explain the NBCC ACEP designation in plain language: what it means, how a provider gets it, why it matters for LPC and NCC renewal credit, and how to verify a provider before buying.'
  },
  {
    id: 'ncc-vs-lpc-ce',
    title: 'NCC vs. LPC: Does Your CE Count for Both?',
    category: 'authority',
    targetKeywords: ['ncc ce requirements', 'ncc renewal continuing education', 'lpc ncc ce credits same'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse NBCC-approved CE courses that count for both',
    partnerAngle: false,
    brief: 'Address the common confusion: NCC renewal is separate from state LPC renewal. Explain NBCC CE requirements for NCC holders, how ACEP-approved CE can satisfy both, and the NBCC content area categories.'
  },
  {
    id: 'nbcc-content-areas-explained',
    title: 'NBCC Content Areas Explained: How to Choose CE That Builds Your Career',
    category: 'authority',
    targetKeywords: ['nbcc content areas', 'nbcc section g continuing education', 'nbcc ce category requirements'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse CE courses by NBCC content area',
    partnerAngle: false,
    brief: 'Walk through NBCC\'s 9 Section G content areas, explain how each maps to real clinical practice, and help counselors choose CE strategically rather than just by availability.'
  },
  // ── PARTNER-FOCUSED ───────────────────────────────────────────────────────
  {
    id: 'how-to-become-nbcc-acep',
    title: 'How to Become an NBCC ACEP Approved CE Provider: What the Application Actually Requires',
    category: 'authority',
    targetKeywords: ['how to become nbcc acep provider', 'nbcc acep application', 'applying for nbcc ce approval'],
    internalLinkPath: '/partner',
    internalLinkAnchor: 'Host your CE courses on an existing NBCC ACEP platform',
    partnerAngle: true,
    brief: 'Walk through the NBCC ACEP application process honestly: eligibility requirements, policies reviewers scrutinize, timeframes, and ongoing compliance obligations. Position CounselorReady as an alternative path for providers who want to offer NBCC CE without going through the full application.'
  },
  {
    id: 'host-ce-courses-counselors',
    title: 'How to Host CE Courses for Licensed Counselors: A Provider\'s Complete Guide',
    category: 'authority',
    targetKeywords: ['host ce courses online', 'ce provider platform counseling', 'offer ce courses licensed counselors'],
    internalLinkPath: '/partner',
    internalLinkAnchor: 'Launch your CE courses on CounselorReady',
    partnerAngle: true,
    brief: 'Practical guide for counseling educators, supervisors, and organizations who want to offer CE. Cover NBCC ACEP requirements, posttest standards, certificate generation, and platform options. Tie into the CounselorReady partner program as a faster path than building infrastructure from scratch.'
  },
  {
    id: 'ce-posttest-requirements',
    title: 'Creating a CE Posttest That Meets NBCC Standards: What Providers Need to Know',
    category: 'authority',
    targetKeywords: ['ce posttest requirements nbcc', 'continuing education posttest standards', 'how to write ce posttest'],
    internalLinkPath: '/partner',
    internalLinkAnchor: 'CounselorReady handles posttest generation for CE partners',
    partnerAngle: true,
    brief: 'Explain NBCC posttest requirements: minimum 15 questions, 80% passing score, 3 max attempts, question distribution. Address common provider mistakes and explain how built-in posttest tools reduce compliance risk.'
  },
  {
    id: 'white-label-ce-platform',
    title: 'White-Label CE Platforms: What Counseling Organizations Should Ask Before Choosing One',
    category: 'authority',
    targetKeywords: ['white label ce platform counseling', 'continuing education platform for trainers', 'ce platform for mental health organizations'],
    internalLinkPath: '/partner',
    internalLinkAnchor: 'Explore the CounselorReady partner program',
    partnerAngle: true,
    brief: 'Guide for supervisors, training directors, and counseling organizations evaluating CE platforms. Cover: NBCC ACEP status, certificate generation, posttest compliance, learner tracking, and white-label options. Position CounselorReady\'s partner program as the answer.'
  },
  {
    id: 'ce-provider-revenue',
    title: 'Can You Make Money Offering CE Courses? What Counseling Educators Need to Know',
    category: 'problem-solution',
    targetKeywords: ['sell ce courses counselors', 'revenue from continuing education courses', 'ce course business model counseling'],
    internalLinkPath: '/partner',
    internalLinkAnchor: 'Earn on every CE course through the CounselorReady partner program',
    partnerAngle: true,
    brief: 'Honest breakdown of CE course economics for educators: pricing norms, platform fees, ACEP overhead, and realistic revenue expectations. Make the case that the partner/marketplace model reduces overhead and gets to revenue faster than building independently.'
  },
  // ── CLINICAL / PRACTICE ───────────────────────────────────────────────────
  {
    id: 'trauma-informed-ce',
    title: 'Why Trauma-Informed CE Is Worth More Than a Renewal Box to Check',
    category: 'clinical',
    targetKeywords: ['trauma informed ce counselors', 'trauma continuing education lpc', 'trauma informed practice training'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse trauma-informed CE courses',
    partnerAngle: false,
    brief: 'Make the case that trauma CE is not just a renewal requirement but a clinical skill investment. Cover neurobiology of trauma basics, what good trauma CE teaches, and how to evaluate course quality before purchasing.'
  },
  {
    id: 'telemental-health-competency',
    title: 'Telemental Health Competency: What CE Covers and What You Still Need to Practice',
    category: 'clinical',
    targetKeywords: ['telemental health competency training', 'virtual therapy ce courses', 'online counseling continuing education'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse telemental health CE courses',
    partnerAngle: false,
    brief: 'Explain what telehealth CE actually teaches vs. what comes from practice: technology protocols, informed consent specifics, crisis management at a distance, and platform security. Honest about limits of CE for skill-building.'
  },
  {
    id: 'supervision-ce-guide',
    title: 'Supervision CE: What Licensed Supervisors Actually Need Each Renewal Cycle',
    category: 'authority',
    targetKeywords: ['supervision ce lpc', 'clinical supervision continuing education', 'lpc supervisor ce requirements'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse supervision CE courses',
    partnerAngle: false,
    brief: 'Cover supervision CE requirements for LPC-S, CPCS, and AAMFT-Approved Supervisors. Distinguish between supervision CE and general clinical CE. Highlight Georgia CPCS renewal requirements specifically.'
  },
  {
    id: 'cultural-humility-ce',
    title: 'Cultural Humility CE: Why It\'s Different From Cultural Competence Training',
    category: 'clinical',
    targetKeywords: ['cultural humility ce counselors', 'multicultural ce lpc', 'diversity continuing education counseling'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse multicultural and cultural humility CE courses',
    partnerAngle: false,
    brief: 'Explain the conceptual shift from cultural competence (a fixed destination) to cultural humility (an ongoing practice). What good multicultural CE looks like, state board requirements for diversity CE, and how to integrate it into supervision.'
  },
  {
    id: 'ai-in-counseling-ce',
    title: 'AI in Counseling Practice: What CE Is Beginning to Cover (and What It Should)',
    category: 'clinical',
    targetKeywords: ['ai in counseling continuing education', 'technology ce counselors', 'ai ethics mental health ce'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse technology and AI ethics CE courses',
    partnerAngle: false,
    brief: 'Practical look at how AI tools are entering clinical practice (documentation, session analysis, crisis screening) and what CE is emerging to address competency, ethics, and client disclosure. Forward-looking without being alarmist.'
  },
  {
    id: 'clinician-burnout-ce',
    title: 'Clinician Burnout CE: Using Your Renewal Hours to Protect Your Own Practice',
    category: 'clinical',
    targetKeywords: ['counselor burnout ce', 'clinician self-care continuing education', 'burnout prevention lpc training'],
    internalLinkPath: '/courses',
    internalLinkAnchor: 'Browse clinician wellness and burnout prevention CE',
    partnerAngle: false,
    brief: 'Reframe burnout CE as a professional practice investment. Cover what research-based burnout prevention CE includes, how to recognize early warning signs, and how CE on secondary traumatic stress differs from general wellness content.'
  }
];
