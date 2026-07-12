/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// CR-TMH604-LA-Teletherapy_Specialty_Approval-19100words.js
// Seed script for CounselorReady interactivecourses collection.
// ADDITIVE ONLY — derived from CR-TMH601's real prose (server/src/scripts/
// seedCR-TMH601-Batch1-Sections1to4.js and seedCR-TMH601-Batch2to4-Sections5to13.js),
// following the shipped structural pattern of CR-TMH602-TX-Technology_Assisted_Services-12000words.js
// and CR-TMH603-FL-Telehealth-18000words.js. Does NOT modify CR-TMH601, CR-TMH602, CR-TMH603,
// their slugs, or their templates.
// Deploy: node server/src/scripts/CR-TMH604-LA-Teletherapy_Specialty_Approval-19100words.js
// Requires: MONGODB_URI environment variable
//
// ─────────────────────────────────────────────────────────────────────────────
// REGULATORY VERIFICATION STATUS (read before publishing) — REVISION 2 (2026-07-09)
// Primary-source verification performed 2026-07-09 against:
//   - LAC Title 46, Part LX, Chapter 5, §505 "Teletherapy Guidelines for Licensees
//     (Formerly Diagnosing for Serious Mental Illnesses)" — read via Cornell LII's
//     mirror of the Louisiana Administrative Code
//     (law.cornell.edu/regulations/louisiana/La-Admin-Code-tit-46-SS-LX-505).
//   - Louisiana LPC Board of Examiners official FAQ, Teletherapy section
//     (lpcboard.org/page/frequently-asked-questions).
//   - Louisiana Register Vol. 46 No. 12 (Dec 20, 2020), confirming the LAC 46:LX.503
//     and 505 rulemaking history; rule effective since March 2019, updated Dec 2020.
//   - Statutory authority: R.S. 37:1101 and R.S. 37:1116 (promulgation note:
//     R.S. 37:1101–1123).
// Status: citations VERIFIED. No open-flag items remain on the items below. Standard
// human compliance review before publish still applies per platform policy, but no
// open statutory questions block the build.
//
// TERMINOLOGY DISCIPLINE (this changed from a prior prompt revision — read before
// editing any section title, quiz item, or worksheet name in this file): the Board's
// own FAQ states teletherapy is NOT a "privileging designation" — it is a "Specialty
// Area/Area of Expertise" that "does require Board approval." §505.E's own rule text,
// however, still uses the legacy phrase "licensees privileged in teletherapy." This
// course uses "specialty area requiring Board approval" as its primary framing
// throughout, and surfaces the legacy §505.E phrase in exactly one learner-facing
// callout (Section 1) so learners who encounter the rule text aren't confused. No
// section, quiz item, or worksheet in this file is titled "Teletherapy Privileging."
// ─────────────────────────────────────────────────────────────────────────────
//
// SECTION BANNER KEYWORDS (Pexels) — for the course-builder's banner button.
// bannerImage is intentionally left unset below; a human uses the builder's
// Pexels banner button with these keywords after import.
//   Section 1: "Louisiana state capitol building"
//   Section 2: "laptop padlock secure data HIPAA"
//   Section 3: "online training certificate laptop"
//   Section 4: "map with pin interstate travel remote work"
//   Section 5: "therapist video call clipboard notes"

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ No MONGODB_URI environment variable set");
  process.exit(1);
}

// ═══ SECTION 1: Teletherapy as a Louisiana Board-Approved Specialty Area ═══
const SECTION_1 = {
  title: "Teletherapy as a Louisiana Board-Approved Specialty Area",
  order: 1,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 1,
      title: "Section 1",
      subtitle: "Teletherapy as a Louisiana Board-Approved Specialty Area",
      bannerAlt: "Louisiana state capitol building representing the state regulatory framework governing teletherapy",
    },
    {
      type: "text",
      content: `<h2>A Brief History of Distance-Based Mental Health Services</h2>
<p>The delivery of mental health services through electronic communication technologies has more than six decades of practice history, considerably longer than most clinicians assume. The first documented use of telecommunication technology for psychiatric consultation occurred in 1959 at the Nebraska Psychiatric Institute, where clinicians used closed-circuit television to provide group therapy, long-term therapy, and consultation-liaison services to patients at Norfolk State Hospital, roughly 112 miles away (Wittson, Affleck, & Johnson, 1961). Throughout the 1960s and 1970s, additional pilot programs emerged, including a microwave-based television link between Massachusetts General Hospital and a medical station at Boston Logan International Airport, providing psychiatric consultations to travelers and airport employees (Dwyer, 1973). These early programs established principles that continue to guide telehealth practice today: the importance of technology reliability, the need for clinician training specific to the medium, and the recognition that therapeutic rapport can develop through electronic communication.</p>
<p>The widespread availability of broadband internet and consumer-grade videoconferencing in the 2000s made synchronous video-based teletherapy a practical reality for independent practitioners, and the COVID-19 pandemic accelerated adoption dramatically beginning in March 2020. A substantial evidence base now supports telemental health's clinical efficacy across a range of presenting concerns, treatment modalities, and populations. Hilty et al. (2013) reviewed more than 150 studies and concluded that telemental health achieves outcomes comparable to face-to-face care, with particularly strong evidence for depression, anxiety, and post-traumatic stress disorder. Batastini et al. (2021) published a meta-analysis of randomized controlled trials finding no significant differences between video-based and in-person therapy in outcomes, therapeutic alliance, or client satisfaction. This evidence base is the backdrop against which Louisiana's own regulatory framework for teletherapy should be understood: the Louisiana Licensed Professional Counselors (LPC) Board of Examiners has not treated teletherapy as an unregulated extension of ordinary practice, but as a distinct area of competence requiring a formal, documented approval process before a licensee may provide it.</p>
<h2>Louisiana's Regulatory Architecture: Where Teletherapy Rules Live</h2>
<p>Louisiana's teletherapy framework sits within Title 46 of the Louisiana Administrative Code (LAC), Part LX (governing counselors and marriage and family therapists), Chapter 5. The operative rule is LAC 46:LX.505, titled "Teletherapy Guidelines for Licensees" — a title that itself carries a small piece of regulatory history worth knowing: the rule text bears the parenthetical "(Formerly Diagnosing for Serious Mental Illnesses)," reflecting that §505's numbering slot was previously occupied by different subject matter before teletherapy guidelines were promulgated into it. The current teletherapy rule has been in effect since March 2019, with an update captured in the Louisiana Register, Volume 46, Number 12 (December 20, 2020), which confirmed the rulemaking history for both LAC 46:LX.503 (definitions, including "Internet Counseling," discussed later in this section) and LAC 46:LX.505 itself. The Board's rulemaking authority for this framework derives from Louisiana Revised Statutes (R.S.) 37:1101 and R.S. 37:1116, part of the broader statutory scheme at R.S. 37:1101 through 37:1123 governing the licensure and regulation of professional counselors and marriage and family therapists in Louisiana.</p>
<p>Because §505 is an administrative rule promulgated under this statutory authority, it carries the force of law for Louisiana LPCs, PLPCs (Provisional Licensed Professional Counselors), LMFTs, and any other licensee category the Board regulates — practicing outside its requirements is not a matter of informal professional preference but a licensure compliance issue. The Louisiana LPC Board of Examiners also maintains a public-facing FAQ (lpcboard.org/page/frequently-asked-questions) with a dedicated Teletherapy section that restates and clarifies the rule in plain language for licensees; this course draws on both the rule text itself and the Board's FAQ, and flags the handful of places where the FAQ's plain-language framing and the rule's original text diverge — most importantly, the terminology question addressed next.</p>
<h2>Specialty Area, Not a Legacy Credentialing Label</h2>
<p>Every Louisiana licensee arriving at this course with prior exposure to teletherapy CE materials from other states, or with familiarity with the Board's separate Appraisal credentialing framework, should pause on one point of vocabulary before going further: the Louisiana LPC Board's own FAQ is explicit that teletherapy does not carry that older credentialing label — instead, the Board's FAQ describes teletherapy as a <strong>"Specialty Area/Area of Expertise"</strong> that "does require Board approval." This course adopts the Board's current framing — "specialty area requiring Board approval" — as its primary language throughout, and that is also the correct way to describe the credential to colleagues, supervisees, and clients going forward. The one place this course surfaces the older rule-text wording directly, and explains exactly how it differs, is the callout immediately below.</p>
<p>At the same time, licensees who go on to read §505's actual rule text directly — which this course encourages, since primary-source familiarity is good professional practice — will encounter language that has not caught up to the FAQ's current terminology: §505.E itself still refers to "licensees privileged in teletherapy." This is not a drafting error this course needs to correct or paper over; it is simply legacy rule language that predates, or has not been harmonized with, the Board's more recent public position. Learners should expect to see both terms in circulation — the Board's current "specialty area" framing in FAQ materials and Board communications, and the rule's own "privileged in teletherapy" phrasing if they read §505.E directly — and should understand that both refer to the same underlying approval status. The distinction matters enough that this course flags it explicitly in the callout below, rather than silently picking one term and leaving the other unexplained.</p>
`,
    },
    {
      type: "callout",
      calloutType: "key",
      title: "Terminology: \"Specialty Area\" (Current) vs. \"Privileged in Teletherapy\" (Legacy Rule Text)",
      content: "<p>The Louisiana LPC Board's FAQ states directly that teletherapy is <strong>not</strong> a privileging designation like Appraisal privileging — it is a Specialty Area/Area of Expertise that requires Board approval. That is the terminology this course uses throughout. However, §505.E's own rule text still says \"licensees privileged in teletherapy.\" Both phrases describe the same approval status; the FAQ language is simply more current. If you read the rule text directly and see \"privileged,\" you have not found a different or additional requirement — you have found the same specialty-area approval described in older rule language.</p>",
      items: [
        "Use \"specialty area requiring Board approval\" when describing this credential to colleagues, supervisees, or clients",
        "§505.E's own text says \"privileged in teletherapy\" — legacy phrasing, not a separate credential",
        "This course does not title any section, quiz item, or worksheet \"Teletherapy Privileging\"",
      ],
    },
    {
      type: "text",
      content: `<h2>Why Louisiana's Model Differs From a Simple CE-Hour Requirement</h2>
<p>Clinicians who have taken telehealth continuing education in other states sometimes arrive expecting Louisiana's teletherapy framework to work the way many states' frameworks do: complete some hours of CE, keep records, and that satisfies the requirement. Louisiana's model is more structured than that, and understanding the difference up front will save considerable confusion later in this course. Louisiana requires <strong>two separate things</strong> before a licensee may lawfully provide teletherapy, and getting them out of order — or conflating them — is one of the most common compliance mistakes this course exists to prevent.</p>
<p>First, teletherapy is a <strong>board-recognized specialty area</strong> that requires <strong>formal Board approval</strong> before a licensee may practice it — approval is not automatic upon obtaining a base LPC, PLPC, or LMFT license, no matter how experienced the licensee is in face-to-face practice. Second, once approved, ongoing practice is subject to its own maintenance requirements, including a continuing-education obligation tied specifically to teletherapy that recurs at every license renewal. Section 3 of this course walks through the approval mechanics in detail; Section 4 walks through the ongoing maintenance requirements, including a numeric coincidence — two different "three-hour" figures in Louisiana's teletherapy framework — that causes more licensee confusion than almost any other detail in this rule, and that this course addresses head-on rather than leaving licensees to discover the hard way.</p>
<h2>Who This Framework Applies To</h2>
<p>LAC 46:LX.505 governs teletherapy practice by counselors and marriage and family therapists regulated by the Louisiana LPC Board of Examiners — Licensed Professional Counselors (LPC), Provisional Licensed Professional Counselors (PLPC), and Licensed Marriage and Family Therapists (LMFT), together with the Board's provisional MFT category where applicable. The Board's FAQ confirms that both fully licensed and provisionally licensed individuals may pursue teletherapy approval, provided §505's requirements are met — a point this course returns to in Section 4, because an older definition elsewhere in the Administrative Code says something different, and reconciling the two matters for any PLPC taking this course. The framework also extends, through a distinct registration mechanism, to clinicians licensed in other states who wish to provide teletherapy to clients physically located in Louisiana — a pathway this course confirms is genuinely available (Section 4), correcting an earlier assumption in prior course-development materials that Louisiana lacked such a pathway.</p>
<h2>Definitional Groundwork: Terms This Course Will Use Precisely</h2>
<p>Because Louisiana's rule framework uses specific, defined terms, this course is deliberate about vocabulary from the outset. <strong>Teletherapy</strong>, for purposes of this course, refers to the delivery of psychotherapy and related counseling services through synchronous or asynchronous telecommunications technology, consistent with LAC 46:LX.505's guidelines. <strong>Specialty area approval</strong> refers to the Board-granted authorization described in Section 3 of this course — the outcome of completing initial training, submitting the required documentation, and receiving Board sign-off. <strong>The Declaration/Statement of Practice</strong> refers to the updated practice-statement filing, including the Teletherapy Declaration/Informed Consent addendum, that a licensee submits as part of the approval process (Section 3). <strong>Registration</strong> refers to the distinct process by which an out-of-state clinician establishes standing with the Louisiana Board in order to pursue teletherapy approval for Louisiana-located clients (Section 4) — registration is not equivalent to full Louisiana licensure, a distinction this course returns to more than once because it is easy to blur.</p>
<h2>The Evidence Base Behind the Regulatory Structure</h2>
<p>It is worth briefly connecting Louisiana's structured approval requirement back to the clinical literature that motivates it, because the requirement is not merely procedural. The Board-Certified TeleMental Health (BC-TMH) credential, developed by the Center for Credentialing and Education (CCE), a subsidiary of the National Board for Certified Counselors (NBCC), identifies nine core competency domains for telemental health practice, including the legal, ethical, and regulatory framework of telemental health; evidence-based telehealth clinical practices; the technology of telemental health; dispositions and telepresence; cultural competence in telehealth; documentation specific to telehealth; telepractice development and standards; and research and trends in the field. The consistent theme across BC-TMH and comparable frameworks, such as the Telebehavioral Health Institute's competency model, is that telehealth competence is not a natural extension of in-person clinical competence — it is a distinct skill set requiring dedicated training. Louisiana's §505 approval process, with its eight specified topic areas covered in Section 3 of this course, is essentially a regulatory codification of that same principle: the Board does not assume that a licensee competent in face-to-face practice is automatically competent in teletherapy, and it built a formal checkpoint — initial training plus Board review — into the license before authorizing the specialty area.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Louisiana LPC with twelve years of in-person practice experience began providing video sessions to several established clients during a temporary office closure, assuming her general clinical competence and her clients' existing consent to treatment covered the shift in modality. Several months later, while researching Louisiana's specific teletherapy rules for an unrelated CE requirement, she discovered that LAC 46:LX.505 required formal Board approval — completed initial training, an uploaded certificate, and a submitted Declaration/Informed Consent addendum — before she could lawfully provide teletherapy at all, and that she had been practicing outside the scope of her license for the entire period. She had assumed, incorrectly, that Louisiana's approach mirrored the simpler "just take some CE hours" model she had encountered in a prior state's requirements.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Modalities Recognized Under §505</h2>
<p>LAC 46:LX.505's teletherapy guidelines are written broadly enough to encompass more than a single delivery format, and understanding the range of recognized modalities is foundational before the approval mechanics in Section 3 make sense. Synchronous video-based sessions — the modality most closely approximating in-person counseling, in which the licensee and client connect through a secure videoconferencing platform in real time — are the modality most licensees have in mind when they think of teletherapy, and the one this course's HIPAA/HITECH discussion in Section 2 focuses on most directly. Asynchronous, or store-and-forward, technology — the transmission of clinical information for later review rather than real-time exchange — is also contemplated within the broader teletherapy framework, though its clinical use is comparatively limited for ongoing psychotherapy relative to intake documentation, secure messaging, and between-session communication. Telephone-only contact occupies a more ambiguous position: because §505 does not draw the same sharp audio-only exclusion that some other states' telehealth statutes draw, a Louisiana licensee should not assume telephone-only contact is either automatically included in or automatically excluded from their approved teletherapy practice without checking the specific delivery-mode disclosures in their own Declaration/Informed Consent addendum, discussed in Section 3 — the addendum, not a general assumption, is where a licensee's own modality boundaries are actually documented.</p>
<p>Technology-assisted therapeutic tools — mobile applications, structured self-report measures administered electronically, and similar supplements to live sessions — may also factor into a teletherapy practice, whether used within synchronous sessions or as between-session supports. A licensee incorporating any of these tools into their teletherapy practice should evaluate them against the same HIPAA/HITECH compliance standard discussed in Section 2, since a mobile app or electronic assessment tool that transmits or stores PHI is just as subject to the BAA and encryption requirements as the primary videoconferencing platform itself. The breadth of "modes of delivery" as one of the eight required initial-training topic areas (Section 3) reflects this same point: a licensee's training, and by extension their Declaration/Informed Consent addendum, should account for the actual range of technology the licensee intends to use, not just the primary synchronous-video modality.</p>
<h2>Rural Access and the Practical Value of a Structured Approval Process</h2>
<p>Louisiana's geography and demographics give the teletherapy specialty area particular practical significance. Large stretches of rural Louisiana — much of the northern and central portions of the state, as well as areas outside the New Orleans, Baton Rouge, Lafayette, and Shreveport metropolitan corridors — face persistent shortages of licensed mental health providers, a pattern documented broadly in federal Health Professional Shortage Area designations. For clients in these areas, teletherapy is frequently not a convenience but the only realistic path to consistent access to a Louisiana-licensed counselor or marriage and family therapist. Louisiana's hurricane exposure compounds this access consideration in the other direction: teletherapy also functions as a continuity-of-care mechanism when storm-related evacuation or infrastructure disruption makes in-person sessions temporarily impossible, provided the licensee has planned for that contingency in advance, as discussed further in Section 2's disaster-recovery content.</p>
<p>Set against this backdrop, the Board's decision to require a structured approval process — rather than simply permitting teletherapy on the strength of a base license — should be understood as a deliberate quality-assurance mechanism rather than an access barrier for its own sake. Because rural and underserved clients often have fewer realistic alternatives if a teletherapy relationship goes wrong, the eight-topic initial-training requirement and the suitability-screening obligations detailed in Section 5 function as protections precisely for the client population most likely to depend on teletherapy as their primary or only access point. A licensee who treats the approval process as a bureaucratic hurdle to move past as quickly as possible, rather than genuine preparation for delivering competent virtual care to a client who may have no easy in-person alternative, has misread the purpose the requirement actually serves.</p>
<h2>Competency Frameworks Behind the Eight Topic Areas</h2>
<p>Section 3 of this course maps its content directly onto the eight §505-specified initial-training topic areas, and it is worth noting briefly that those eight areas are not an idiosyncratic Louisiana invention — they track closely with competency frameworks already established in the broader telemental health field. The Board-Certified TeleMental Health (BC-TMH) credential's nine domains, introduced earlier in this section, and the Telebehavioral Health Institute's foundational-and-applied competency framework both organize telehealth competence around substantially the same content: legal/regulatory knowledge, technology and platform competence, clinical adaptation and risk management, and crisis response. Louisiana's eight topic areas can be read as a state-specific, regulatorily binding compression of this same general competency consensus — which is one reason a licensee who already holds a credential like BC-TMH, while not thereby exempted from Louisiana's own approval process, will likely find much of this course's content clinically familiar even where the regulatory specifics (the four-step approval pathway, the two separate three-hour requirements, the §505.D contact-and-document duty) are distinctly Louisiana's own.</p>`,
    },
    {
      type: "text",
      content: `<h2>Why the Evidence Base Matters to a Skeptical Reading of §505</h2>
<p>A licensee encountering Louisiana's four-step approval process for the first time could reasonably ask whether the structure is worth the administrative effort it requires, particularly given the monthly Board review cycle discussed in Section 3. The clinical evidence base summarized earlier in this section is the answer to that question. Because telemental health's efficacy is now well established across most presenting concerns and delivery modalities — not merely assumed to be equivalent to in-person care by default — the open clinical question for any given licensee is not "does teletherapy work in general," but "is this particular licensee, using this particular technology setup, competently delivering it to this particular client." Louisiana's approval structure is built to answer exactly that narrower, more clinically meaningful question: the eight-topic initial training addresses competent delivery in general; the Declaration/Informed Consent addendum addresses a specific licensee's specific technology and consent practices; and the ongoing clinical/operational standards in Section 5 address competent delivery to a specific client, session by session. None of this replaces individual clinical judgment — it scaffolds it.</p>
<p>This framing also explains why Louisiana's structure devotes comparatively more regulatory attention to teletherapy than a simple CE-hours requirement would: a licensee who has merely accumulated hours of teletherapy-adjacent coursework, without a documented technology-compliance program, a specific Declaration/Informed Consent addendum, and demonstrated competence across the eight topic areas, has satisfied a much thinner version of "competence" than one who has moved through Louisiana's full approval process. Licensees who find the process more demanding than teletherapy CE requirements they may have encountered in other states should understand that this is a deliberate design choice tracking the same competency literature discussed above, not administrative excess.</p>`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "LAC 46:LX.505 — \"Teletherapy Guidelines for Licensees\"",
          content: `<p>The operative rule. Governs the requirements for a Louisiana LPC, PLPC, or LMFT to obtain and maintain teletherapy approval, including initial training, documentation, client-location practice standards, and specific clinical/operational requirements covered in Section 5 of this course. Rule title carries the parenthetical "(Formerly Diagnosing for Serious Mental Illnesses)" — a numbering-history artifact, not a substantive cross-reference.</p>`,
        },
        {
          title: "LAC 46:LX.503 — Definitions",
          content: `<p>Contains Louisiana's definitional framework, including the term "Licensure," defined broadly enough to include "any license, certification, or registration ... approved by the board" — the definitional hook that reconciles §505.D's "must be licensed by the board" language with the out-of-state registration pathway discussed in Section 4. Also contains an older "Internet Counseling" definition with legacy language about provisional licensees, discussed in Section 4.</p>`,
        },
        {
          title: "R.S. 37:1101 &amp; R.S. 37:1116",
          content: `<p>Statutory authority underlying the Board's teletherapy rulemaking, part of the broader licensure statute at R.S. 37:1101–1123 governing professional counselors and marriage and family therapists in Louisiana. These are the enabling statutes that give LAC 46:LX.505 its force of law.</p>`,
        },
        {
          title: "Louisiana LPC Board of Examiners FAQ — Teletherapy Section",
          content: `<p>The Board's own plain-language restatement of the teletherapy approval process, including the "specialty area requiring Board approval" framing this course adopts, the approval-mechanics checklist covered in Section 3, and confirmation of the out-of-state registration pathway covered in Section 4. Where the FAQ's plain language and the rule's original text diverge, this course flags the divergence rather than picking silently.</p>`,
        },
      ],
    },
    {
      type: "matching",
      matchingInstructions: "Match each Louisiana regulatory term or source to its correct description.",
      matchingPairs: [
        { term: "LAC 46:LX.505", definition: "The operative rule — \"Teletherapy Guidelines for Licensees\" — governing approval, documentation, and clinical/operational requirements" },
        { term: "LAC 46:LX.503", definition: "Definitions section, including the broad \"Licensure\" definition that reconciles the registration pathway with §505.D" },
        { term: "R.S. 37:1101 & 37:1116", definition: "Statutory authority for the Board's teletherapy rulemaking, within the broader R.S. 37:1101–1123 licensure statute" },
        { term: "Specialty Area/Area of Expertise", definition: "The Board FAQ's current term for the teletherapy credential — a Board-approval status, not the older credentialing label described in the terminology callout" },
        { term: "\"Privileged in Teletherapy\"", definition: "Legacy phrase used in §505.E's own rule text, referring to the same approval status as \"specialty area\"" },
        { term: "Declaration/Statement of Practice", definition: "The updated practice filing, including a Teletherapy Declaration/Informed Consent addendum, submitted as part of approval" },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 1 Key Takeaways",
      content: "<p>Louisiana treats teletherapy as a board-recognized specialty area requiring formal Board approval — not an automatic extension of a base LPC, PLPC, or LMFT license, and not a CE-hours-only requirement like some other states use. The Board's current FAQ language is \"specialty area requiring Board approval,\" while §505.E's own rule text still says \"privileged in teletherapy\" — both describe the same status, and this course uses the current terminology throughout except where it flags the legacy phrase explicitly.</p>",
      items: [
        "Teletherapy approval in Louisiana requires a formal Board process — it is not automatic upon base licensure",
        "\"Specialty area requiring Board approval\" is the Board's current terminology; \"privileged in teletherapy\" is legacy rule language with the same meaning",
        "The regulatory authority chain is R.S. 37:1101/37:1116 → LAC 46:LX.503 (definitions) → LAC 46:LX.505 (teletherapy guidelines)",
      ],
    },
    {
      type: "reflection",
      question: "Before starting this course, how would you have described the teletherapy credential to a colleague — as a \"privilege,\" a \"certification,\" something else? Now that you've read the Board's actual FAQ framing, does that change how you'd describe your own approval status once you have it?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "According to the Louisiana LPC Board's own FAQ, teletherapy is best described as:",
      options: [
        { text: "The same style of credential as the Board's separate Appraisal credentialing framework", isCorrect: false },
        { text: "A Specialty Area/Area of Expertise that requires Board approval", isCorrect: true },
        { text: "An automatic extension of any active LPC, PLPC, or LMFT license", isCorrect: false },
        { text: "A federal credential administered by NBCC, not the Louisiana Board", isCorrect: false },
      ],
      explanation: "The Board's FAQ explicitly distinguishes teletherapy from that older credentialing label — it is a Specialty Area/Area of Expertise that does require Board approval.",
    },
    {
      type: "multipleChoice",
      question: "The phrase \"licensees privileged in teletherapy\" appears in:",
      options: [
        { text: "The Board's current FAQ, as its primary term for the credential", isCorrect: false },
        { text: "§505.E's own rule text — legacy language describing the same approval status the FAQ now calls a specialty area", isCorrect: true },
        { text: "R.S. 37:1101, as the statutory definition of teletherapy", isCorrect: false },
        { text: "No official Louisiana source uses this phrase", isCorrect: false },
      ],
      explanation: "§505.E's own rule text retains the legacy \"privileged in teletherapy\" phrasing, even though the Board's current FAQ describes the same status as a specialty area requiring Board approval.",
    },
    {
      type: "multipleChoice",
      question: "Which statutes provide the underlying rulemaking authority for LAC 46:LX.505?",
      options: [
        { text: "R.S. 37:1101 and R.S. 37:1116", isCorrect: true },
        { text: "Only federal HIPAA statutes", isCorrect: false },
        { text: "The NBCC ACEP accreditation standards", isCorrect: false },
        { text: "Louisiana's telehealth parity statute for physicians", isCorrect: false },
      ],
      explanation: "R.S. 37:1101 and R.S. 37:1116, part of the broader R.S. 37:1101–1123 licensure statute, provide the Board's rulemaking authority for LAC 46:LX.505.",
    },
  ],
};

// ═══ SECTION 2: HIPAA and Secure Technology for Louisiana Teletherapy ═══
const SECTION_2 = {
  title: "HIPAA and Secure Technology for Louisiana Teletherapy",
  order: 2,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 2,
      title: "Section 2",
      subtitle: "HIPAA and Secure Technology for Louisiana Teletherapy",
      bannerAlt: "Laptop screen showing a padlock icon over a secure data connection, representing HIPAA-compliant teletherapy technology",
    },
    {
      type: "text",
      content: `<h2>Why HIPAA/HITECH Compliance Is Named Directly in §505</h2>
<p>Unlike some states' telehealth rules, which leave HIPAA compliance to be inferred as a general federal backdrop, LAC 46:LX.505 names technology compliance with HIPAA and HITECH standards as one of its explicit requirements for teletherapy practice. This is not merely a restatement of a federal obligation every licensee already has regardless of modality — by writing it directly into the teletherapy rule, the Board makes HIPAA/HITECH technology compliance a specific condition of maintaining specialty-area approval, meaning a documented compliance failure in this area is a §505 issue for a Louisiana teletherapy-approved licensee, not only a generic federal HIPAA matter. This section covers the practical compliance program a Louisiana licensee needs to satisfy that requirement, adapted from established HIPAA compliance practice for telemental health delivery generally.</p>
<h2>The Health Insurance Portability and Accountability Act in the Teletherapy Context</h2>
<p>The Health Insurance Portability and Accountability Act of 1996 (HIPAA) provides the regulatory backbone for privacy and security in healthcare, and its requirements take on particular significance in teletherapy, where clinical information traverses digital networks and is stored on electronic devices. HIPAA compliance is not a one-time achievement but an ongoing practice requiring vigilance, documentation, and periodic reassessment as technology evolves. The HIPAA Privacy Rule establishes standards for the use and disclosure of protected health information (PHI); the minimum necessary standard requires clinicians to limit the PHI they access, use, or disclose to the minimum amount needed to accomplish the intended purpose, with direct implications for screen sharing, recording practices, and storage of session-related communications. The HIPAA Security Rule establishes requirements for safeguarding electronic PHI (ePHI) through administrative, physical, and technical safeguards. The Health Information Technology for Economic and Clinical Health (HITECH) Act, referenced by name in §505, strengthened HIPAA's enforcement mechanisms and extended certain security and breach-notification obligations directly to business associates, not just covered entities — relevant to any Louisiana teletherapy licensee who contracts with a platform vendor, billing service, or EHR provider.</p>
<h2>The Business Associate Agreement Requirement</h2>
<p>One of the most critical and frequently misunderstood elements of HIPAA/HITECH compliance in teletherapy practice is the Business Associate Agreement (BAA) requirement. A business associate is any entity that creates, receives, maintains, or transmits PHI on behalf of a covered entity; the platform vendor through which teletherapy sessions are conducted is typically a business associate because it transmits the audiovisual content of therapy sessions and any associated data. The BAA is a legally binding contract establishing the permitted and required uses and disclosures of PHI by the business associate, requiring appropriate safeguards, and establishing procedures for reporting security incidents and breaches. A licensee who conducts teletherapy sessions through a platform that has not executed a BAA is out of HIPAA/HITECH compliance regardless of whether a breach actually occurs — this effectively eliminates consumer-grade communication platforms such as standard Skype, FaceTime, Facebook Messenger, and consumer Zoom from consideration as teletherapy delivery vehicles unless those platforms offer healthcare-specific versions with BAA availability.</p>
<h2>No Social Media in Teletherapy Delivery</h2>
<p>§505 contains a clinical/operational prohibition covered in more depth in Section 5 of this course that belongs here as well, because it is fundamentally a technology-platform issue: social media platforms and functions — tweets, blogs, networking-site posts — may not be used in the delivery of teletherapy, and clients may not be referenced, generally or specifically, on such formats. This prohibition is broader than the HIPAA/HITECH BAA requirement discussed above; even a social media platform that theoretically offered some form of business associate agreement would still fall outside what §505 permits for teletherapy delivery. Licensees should treat "is this platform designed and marketed as social media" as a categorical exclusion question distinct from, and prior to, the ordinary HIPAA compliance evaluation applied to conventional telehealth platforms.</p>
<h2>Administrative Safeguards for Solo and Small-Group Practices</h2>
<p>Administrative safeguards encompass the policies, procedures, and organizational structures a practice implements to manage security. For solo practitioners and small group practices — the majority of Louisiana teletherapy providers — this includes designating a security officer responsible for HIPAA security policies, completing a risk analysis to identify vulnerabilities in electronic systems and workflows, developing a risk management plan to address identified vulnerabilities, implementing workforce training so anyone with access to ePHI understands their security responsibilities, and creating contingency plans for data breaches, natural disasters, or technology failures — a category of particular relevance in Louisiana given the state's recurring exposure to hurricanes and severe weather that can disrupt power, connectivity, and physical office access.</p>
<p>The risk analysis deserves emphasis because it is both the most fundamental and the most frequently neglected administrative safeguard. It involves a systematic examination of all systems that create, receive, maintain, or transmit ePHI — for a teletherapy practice, this typically includes the teletherapy platform, the EHR system, email and messaging systems, cloud storage, and any device that handles clinical information — to identify threats and vulnerabilities. A structured approach involves five steps: identify all systems handling ePHI; identify threats to each system (unauthorized access, malware, phishing, insider risk, device theft, natural disaster, technical failure); assess current safeguards against each threat; assign risk levels based on likelihood and impact; and develop a documented risk management plan specifying remediation actions, timelines, and responsible individuals.</p>
<blockquote><p><strong>Clinical Vignette:</strong> While completing a risk analysis as part of preparing her teletherapy approval documentation, a Louisiana PLPC discovered that her home Wi-Fi network was shared with roommates who had installed file-sharing software, her laptop's hard drive was unencrypted, and she had been using a personal email account to send appointment reminders that referenced clients by name. None of these findings alone would necessarily have caused a breach, but together they created a security posture well below what §505's HIPAA/HITECH compliance requirement calls for. She segmented her home network, enabled full-disk encryption, and switched to a secure client-portal messaging system before submitting her approval documentation — and kept the completed risk analysis as part of her compliance file.</p></blockquote>
`,
    },
    {
      type: "text",
      content: `<h2>Mobile Device Management and Device Security for Teletherapy</h2>
<p>The proliferation of mobile devices in clinical practice introduces both convenience and risk that a Louisiana teletherapy licensee's compliance program should address directly. Full-disk encryption should be enabled on all devices used for clinical purposes — both major desktop operating systems offer built-in full-disk encryption, and mobile devices encrypt their storage by default once a passcode is enabled, so ensuring every clinical device actually has a passcode set is a simple but essential first step. Encryption ensures that if a device is lost or stolen — a realistic scenario during a hurricane evacuation, when a licensee may be moving quickly and carrying devices in less controlled conditions than usual — the data stored on it cannot be accessed without the encryption key or passcode.</p>
<p>Mobile device management considerations become particularly relevant for practices where multiple clinicians share devices, or where personal devices are used for clinical work under a "bring your own device" arrangement. A basic device-management policy should address device encryption, passcode complexity and change frequency, remote wipe capability in case of device loss or theft, restrictions on unapproved application installation on any device used for teletherapy, and separation of personal and clinical data on the device. Remote wipe capability deserves particular emphasis for Louisiana practices specifically: a device lost, damaged, or left behind during a rapid evacuation is a realistic scenario, and a licensee's device-management policy should account for that possibility in advance — verifying remote-wipe capability is actually configured and tested — rather than improvising a response after a device is already unaccounted for.</p>`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Physical Safeguards for the Virtual Office",
          content: `<p>Ensure visual and auditory privacy — family members, roommates, or visitors should not see the screen or overhear session content. A dedicated room with a locking door is strongly recommended; where unavailable, use privacy screens, noise-masking devices, and schedule around household activity. Device security: password protection, auto-lock after inactivity, full-disk encryption, current OS/security updates, antivirus software, and physical security when not in use.</p>`,
        },
        {
          title: "Technical Safeguards and Encryption",
          content: `<p>Access controls (unique user IDs, multi-factor authentication, automatic logoff) and encryption are the core technical safeguards. Encryption must apply both to data in transit and data at rest. End-to-end encryption (E2EE) is the gold standard — data encrypted on the sending device, decrypted only on the receiving device, so even the platform vendor cannot access content. AES-256 is the NIST-recommended standard for healthcare data at rest.</p>`,
        },
        {
          title: "Platform Evaluation Checklist",
          content: `<p>At minimum: TLS 1.2+ encryption in transit, end-to-end encryption for video/audio, a signed BAA, SOC 2 Type II or equivalent security certification, role-based access controls, audit logging, and configurable data retention policies. Document the evaluation and retain it as part of the practice's HIPAA/HITECH compliance records — the same records file that supports §505's technology-compliance requirement.</p>`,
        },
        {
          title: "Cloud Storage and Louisiana-Specific Disaster Planning",
          content: `<p>Consumer-grade cloud storage (personal Dropbox, Google Drive, iCloud) does not provide a BAA and cannot be used for PHI. Enterprise/healthcare tiers may qualify. For Louisiana practices specifically, disaster-recovery planning should be rehearsed, not theoretical — confirm before hurricane season each year that cloud-stored records remain accessible from an alternate location, that a current client contact list is available offline, and that clients have been informed of how the practice will communicate about session continuity during a storm event.</p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>Client Identity and Location Verification as a Technology Practice</h2>
<p>Identity verification is a foundational element of competent teletherapy that is easy to overlook once a therapeutic relationship is well established. At the first teletherapy session, licensees should verify the client's identity through a government-issued photo ID displayed to the camera, cross-checked against intake information, and should separately confirm the client's current physical location and emergency contact information. For subsequent sessions, a verbal confirmation of name and location at the start of the session, documented in the session note, is generally sufficient absent a specific reason for heightened concern. This practice matters doubly in Louisiana's framework, because the client-location documentation duty discussed in Section 4 depends on the licensee actually knowing, session by session, where the client physically is.</p>
<h2>Encryption, Records, and the Bridge to Section 5</h2>
<p>§505 also requires that licensees inform clients how records are maintained, including the type of encryption or security used and the duration of archival storage — a requirement covered in full in Section 5's discussion of records standards, but worth flagging here because it depends directly on the technical safeguards described in this section. A licensee cannot accurately disclose "how records are maintained" to a client unless the underlying technology stack — the EHR, the teletherapy platform, the cloud backup system — actually has documented encryption standards and a defined retention schedule. Building the technology compliance program described in this section is therefore a prerequisite to satisfying the records-disclosure requirement in Section 5, not a parallel, unrelated task.</p>
<h2>Network Security for Home-Based Practice</h2>
<p>The majority of Louisiana teletherapy practitioners conduct sessions from home offices using residential internet connections not originally designed with healthcare security requirements in mind. Securing the home network requires WPA3 encryption (or WPA2 at minimum) with a changed default administrator password, and a separate guest network isolating clinical traffic from smart-home devices, gaming consoles, and family members' personal devices. A Virtual Private Network (VPN) adds an additional layer of security, particularly important when conducting sessions from a location other than the primary home office — a consideration Louisiana clinicians should plan for in advance of hurricane season, when sessions may need to shift to a temporary or evacuation location on short notice.</p>
<h2>A Practical HIPAA/HITECH Compliance Program</h2>
<p>For solo practitioners, a HIPAA/HITECH compliance program satisfying §505's technology-compliance requirement need not be elaborate, but it must be documented and systematic: a written set of policies and procedures tailored to the specific practice environment; workforce training documented with completion records for anyone with access to PHI; and retention of the risk analysis, risk management plan, written policies, training records, business associate agreements, and incident/breach logs for at least six years from the date of creation or the date last in effect, whichever is later, as required by HIPAA. This documentation serves a dual purpose in Louisiana's framework: it satisfies the general federal HIPAA/HITECH obligation every covered entity carries, and it is the evidentiary record a licensee would produce if the Board ever had occasion to review compliance with §505's technology-compliance requirement specifically.</p>
`,
    },
    {
      type: "text",
      content: `<h2>A Framework for Platform Evaluation</h2>
<p>Selecting a teletherapy platform is one of the most consequential decisions a Louisiana licensee makes when pursuing specialty-area approval, since the platform choice bears directly on both the HIPAA/HITECH compliance requirement §505 names and the technology-parameters disclosure required in the Declaration/Informed Consent addendum covered in Section 3. A comprehensive evaluation should assess candidates across security and compliance, clinical functionality, client accessibility, reliability, and cost. At minimum, an acceptable platform must offer encryption of data in transit using TLS 1.2 or higher, end-to-end encryption for video and audio content where available, a signed Business Associate Agreement, and audit logging of system access and events. The evaluation itself should be documented and retained as part of the practice's compliance records — the same records a licensee would want on hand if a question ever arose about which platform was used and why it was selected.</p>
<p>Several platforms have emerged as common choices among mental health practices generally, and Louisiana teletherapy licensees evaluating options should weigh comparable factors. Browser-based platforms requiring no client-side download can lower the technology barrier for clients with limited digital literacy — directly relevant to the rural-access considerations discussed in Section 1 — though free tiers of such platforms often lack a virtual waiting room or advanced features. Full practice-management platforms that combine teletherapy with EHR, scheduling, billing, and a client portal in a single system with a single BAA reduce vendor-management complexity, at the cost of single-vendor dependency, where an outage disrupts scheduling, documentation, billing, and teletherapy simultaneously — a risk worth weighing explicitly for a solo practitioner without redundant systems. Whichever platform a licensee selects, the technology-parameters item in the Declaration/Informed Consent addendum should name it specifically rather than describing "a HIPAA-compliant platform" in the abstract, since the addendum functions as both a regulatory filing and the actual disclosure a client relies on.</p>
<h2>Advanced Technical Safeguards and Emerging Threats</h2>
<p>Beyond the foundational technical safeguards of encryption, access controls, and audit logging, teletherapy practitioners should be aware of the broader cybersecurity threat landscape facing the healthcare sector, which has become one of the most targeted industries for cyberattacks given the high value of healthcare data on illicit markets. Ransomware attacks, in which malicious software encrypts an organization's data and demands payment for the decryption key, have increased dramatically in the healthcare sector; for a solo or small-group teletherapy practice, a ransomware attack could result in complete loss of access to clinical records, scheduling systems, and billing data, effectively shutting down the practice until systems are restored. Prevention strategies include maintaining current software updates and security patches, implementing robust backup systems with offline or air-gapped copies, and training all staff and family members with device access to recognize phishing attempts.</p>
<p>Credential theft attacks, including phishing, credential stuffing, and brute-force password attacks, target the login credentials of healthcare providers to gain unauthorized access to clinical systems. Multi-factor authentication is the single most effective defense against credential theft, since it requires a second verification factor beyond the password, making stolen credentials alone insufficient for unauthorized access. For a Louisiana teletherapy practice specifically, the stakes of a credential-theft-driven breach are compounded by §505's records-disclosure requirement discussed above: a licensee who has told clients a specific story about how their records are secured has an added reason — beyond the general HIPAA/HITECH obligation — to make sure that story remains true in practice, not merely on paper.</p>
<h2>Email, Messaging, and Between-Session Communication</h2>
<p>Between-session communication with clients through email or messaging platforms presents its own HIPAA/HITECH compliance considerations distinct from the live-session platform discussed above. Standard email protocols do not provide end-to-end encryption, meaning that email content may be accessible at multiple points during transmission and storage; using standard consumer email services to communicate clinical information, including session summaries or appointment confirmations that identify the client as a mental health client, creates compliance risk. The preferred approach is a secure client portal integrated with the practice's EHR system, providing encrypted messaging within a HIPAA-compliant environment. When clients initiate contact through unsecured channels such as standard email or text messaging, licensees should limit their responses to scheduling logistics and avoid including clinical content in the reply — and should document, in the technology-parameters item of their Declaration/Informed Consent addendum, exactly which channels are and are not approved for clinical communication, so the boundary is clear to the client from the outset rather than negotiated reactively message by message.</p>
<h2>Billing and Reimbursement: Feeding the Declaration Addendum's Payor Item</h2>
<p>Section 3 of this course flags the billing and third-party-payor item of the Declaration/Informed Consent addendum as one that should describe a licensee's actual billing practice rather than a generic statement that billing "may differ" for teletherapy — this subsection provides the background a licensee needs to write that item concretely. Louisiana Medicaid managed-care organizations and most major commercial payors now reimburse teletherapy mental health services delivered by LPCs, PLPCs, and LMFTs at rates and under billing codes that have continued to evolve since the COVID-19 pandemic prompted broad expansion of telehealth coverage; place-of-service coding and modality-specific modifiers are the mechanism by which a claim signals that a session was delivered via teletherapy rather than in person. Because these codes and modifiers are payor-specific and continue to change, a licensee should verify current requirements directly with each payor they bill rather than assuming a single convention applies universally — and should build that verification into the same regulatory-monitoring habit discussed in Section 4, rather than treating it as a one-time setup task.</p>
<p>Common billing pitfalls in teletherapy practice include failing to verify and document the client's physical location at the start of each session (directly relevant to correct place-of-service coding, and to the §505.D contact-and-document duty discussed in Section 4), billing a session using codes that presuppose audiovisual communication when the actual contact was audio-only, and providing services to a client physically located in a state where the licensee has not completed the §505.D contact-and-document process and submitting a claim that implicitly represents otherwise. Each of these errors can result in claim denial, overpayment recoupment, or, in serious cases, allegations of billing fraud — consequences that make the addendum's billing item more than a formality: a client who understands, from the addendum, how their teletherapy sessions will be billed and what to expect from their insurer is less likely to be blindsided by a denied claim, and a licensee who has thought through these scenarios in advance is less likely to bill incorrectly in the first place.</p>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each platform or practice into whether it satisfies §505's HIPAA/HITECH technology-compliance requirement for teletherapy.",
      categories: ["Satisfies §505 Technology Compliance", "Does NOT Satisfy §505 Technology Compliance"],
      cards: [
        { id: "la-cs-1", text: "A HIPAA-compliant videoconferencing platform with a signed BAA", correctCategory: "Satisfies §505 Technology Compliance" },
        { id: "la-cs-2", text: "An EHR/practice-management platform with encryption at rest and in transit, BAA in place", correctCategory: "Satisfies §505 Technology Compliance" },
        { id: "la-cs-3", text: "Consumer Zoom (standard free version, no BAA)", correctCategory: "Does NOT Satisfy §505 Technology Compliance" },
        { id: "la-cs-4", text: "Delivering a teletherapy session over a social media platform's video-call function", correctCategory: "Does NOT Satisfy §505 Technology Compliance" },
        { id: "la-cs-5", text: "Personal, unencrypted email for appointment reminders naming the client", correctCategory: "Does NOT Satisfy §505 Technology Compliance" },
        { id: "la-cs-6", text: "A password-protected, encrypted secure client portal for between-session messaging", correctCategory: "Satisfies §505 Technology Compliance" },
      ],
      explanation: "§505 names HIPAA/HITECH compliance directly and separately prohibits social media platforms/functions in teletherapy delivery — a platform must clear both bars.",
    },
    {
      type: "callout",
      calloutType: "donot",
      title: "Social Media Platforms Are Categorically Excluded From Teletherapy Delivery",
      content: "<p>§505 prohibits using social media platforms or functions — tweets, blogs, networking-site posts — in the delivery of teletherapy, and prohibits referencing clients, generally or specifically, on such formats. This is a categorical exclusion, separate from and in addition to the ordinary HIPAA/HITECH platform-evaluation process described above. Do not evaluate a social media platform's video-call feature as though it were a conventional telehealth platform candidate.</p>",
    },
    {
      type: "keyTakeaway",
      title: "Section 2 Key Takeaways",
      content: "<p>§505 names HIPAA and HITECH compliance directly as a condition of teletherapy practice, which makes a Louisiana licensee's technology compliance program part of §505 compliance, not merely a separate federal obligation running in parallel. The same rule separately excludes social media platforms and functions from teletherapy delivery entirely, and requires that licensees be able to tell clients how records are encrypted, secured, and archived — a disclosure this section's compliance program makes possible and Section 5 covers in full.</p>",
      items: [
        "A signed BAA and end-to-end/at-rest encryption are the floor for any teletherapy platform under §505's HIPAA/HITECH requirement",
        "Social media platforms and functions are categorically excluded from teletherapy delivery — not merely disfavored",
        "Document the risk analysis, risk management plan, and BAAs — this is the compliance record §505's technology requirement implicitly demands",
      ],
    },
    {
      type: "reflection",
      question: "Walk through your current teletherapy technology stack — platform, EHR, messaging, cloud storage. For each, do you have a signed BAA? Could you tell a client, accurately and specifically, how your records are encrypted and how long they're archived?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "§505 names which two federal frameworks directly as a technology-compliance requirement for Louisiana teletherapy?",
      options: [
        { text: "HIPAA and HITECH", isCorrect: true },
        { text: "FERPA and COPPA", isCorrect: false },
        { text: "SOC 2 and ISO 27001", isCorrect: false },
        { text: "GDPR and CCPA", isCorrect: false },
      ],
      explanation: "§505 explicitly requires technology used for teletherapy to comply with HIPAA and HITECH standards.",
    },
    {
      type: "multipleChoice",
      question: "Under §505, which of the following is categorically prohibited for teletherapy delivery, regardless of any BAA that might theoretically be available?",
      options: [
        { text: "A HIPAA-compliant videoconferencing platform", isCorrect: false },
        { text: "Social media platforms and functions (tweets, blogs, networking sites)", isCorrect: true },
        { text: "An encrypted secure client portal", isCorrect: false },
        { text: "A BAA-covered EHR system", isCorrect: false },
      ],
      explanation: "§505 categorically excludes social media platforms and functions from teletherapy delivery and prohibits referencing clients on such formats — a separate, additional bar beyond ordinary HIPAA platform evaluation.",
    },
  ],
};

// ═══ SECTION 3: The Louisiana Approval Pathway ═══
const SECTION_3 = {
  title: "The Louisiana Approval Pathway",
  order: 3,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 3,
      title: "Section 3",
      subtitle: "The Louisiana Approval Pathway",
      bannerAlt: "Clinician completing an online training certificate on a laptop, representing the initial teletherapy approval training",
    },
    {
      type: "text",
      content: `<h2>Overview: Four Steps From Base License to Approved Teletherapy Provider</h2>
<p>The Louisiana LPC Board's FAQ answers the question "How can I be approved to provide Teletherapy?" with a sequence that this course organizes into four steps: (a) complete initial training meeting specific content requirements; (b) upload the certificate of completion to the CEH tab of the licensee's Board dashboard; (c) submit an updated Declaration/Statement of Practice, including a Teletherapy Declaration/Informed Consent addendum; and (d) wait for Board staff review, which occurs on a monthly cycle, before beginning to practice teletherapy. Each step is addressed in turn below. The overarching caution that frames all four steps, and that this course states plainly and repeats at the end of this section, is that a licensee should not provide teletherapy until approval is actually granted — practicing teletherapy before approval is practicing outside the scope of the license, not a minor procedural lapse.</p>
<h2>Step A: Initial Training — Three Clock Hours, Eight Topic Areas</h2>
<p>The Board's initial-training requirement is a <strong>minimum of three clock hours</strong> of instruction, which may be completed synchronously or asynchronously, provided the training meets the Board's continuing-education standards. This course — a 3 CE hour offering — is designed to meet that three-clock-hour minimum. The content of the initial training is not left to the provider's discretion: §505 specifies eight topic areas the training must cover, and this course maps its own structure directly onto them so a licensee completing this course can be confident every required topic was addressed.</p>
<p>The eight §505-specified topic areas are: <strong>(i) appropriateness of teletherapy</strong> — covered in this course's Section 5 discussion of suitability screening and the Board's specific sensory-deficit and dismiss-and-refer requirements; <strong>(ii) theory and practice of teletherapy</strong> — covered across Sections 1 and 5, including the evidence base and clinical adaptation considerations; <strong>(iii) theory integration</strong> — the application of the licensee's existing theoretical orientation to a teletherapy delivery context, covered in Section 5; <strong>(iv) modes of delivery</strong> — synchronous video, asynchronous/store-and-forward, and the platform-evaluation content in Section 2; <strong>(v) risk management</strong> — covered in Section 5 alongside informed consent and records standards; <strong>(vi) managing emergencies</strong> — covered in Section 5's discussion of crisis protocols within the suitability and informed-consent framework; <strong>(vii) legal/ethical issues</strong> — covered across Sections 1, 3, and 4, including the approval process itself, the terminology discipline issue, and multi-state practice; and <strong>(viii) HIPAA compliance</strong> — covered in full in Section 2, including the HITECH-specific technology requirement.</p>
<h2>Step B: Uploading the Certificate to the CEH Dashboard Tab</h2>
<p>Completing the initial training is not, by itself, sufficient — the Board's FAQ specifies that the licensee must <strong>upload the certificate of completion to the CEH tab of their Board dashboard</strong>. This is a licensee-initiated administrative step, not something the training provider or the Board completes automatically on the licensee's behalf. Licensees should retain their own copy of the certificate of completion independent of the dashboard upload, since a technical issue with the upload, or a need to demonstrate training completion in a context outside the dashboard (a malpractice inquiry, an employer credentialing request, an out-of-state registration application), may call for producing the original certificate directly.</p>
<h2>Step C: The Updated Declaration/Statement of Practice</h2>
<p>The third step is substantively the most demanding: the licensee must submit an <strong>updated Declaration/Statement of Practice</strong>, which includes a <strong>Teletherapy Declaration/Informed Consent addendum</strong> covering the eleven items specified in §505.F(a) through (k). This addendum is not identical to a licensee's general informed consent document — it is teletherapy-specific, and among the eleven items it must address are: the mode and parameters of the technology-assisted media that will be used, together with the licensee's protocol for technical failure during a session; the differences in billing and third-party payor treatment that may apply to teletherapy versus in-person services; and the client's ethical and legal rights, responsibilities, and limitations both within Louisiana and across state lines or international boundaries. The full eleven-item checklist — including the items not individually detailed in this course's regulatory-verification header — is the organizing structure of the accompanying Teletherapy Declaration Checklist worksheet, which walks a licensee through drafting a compliant addendum item by item and is intended to be used alongside this course rather than as a substitute for reading §505.F directly.</p>
<h2>Step D: Monthly Board Review — And the Rule About Not Practicing Yet</h2>
<p>Once the training certificate is uploaded and the Declaration/Statement of Practice addendum is submitted, <strong>Board staff review submissions on a monthly cycle</strong>. This means a licensee should build a realistic timeline into their planning — submitting materials does not produce same-day or same-week approval, and a licensee planning to begin teletherapy on a specific date should submit well in advance of that date, accounting for the monthly review cadence. Most importantly: the Board's guidance is that the licensee should <strong>not provide teletherapy until approval is actually granted</strong>. This is not a suggestion or a best practice — practicing teletherapy before receiving Board approval constitutes practicing outside the scope of the license, with the same seriousness as any other scope-of-practice violation. A licensee eager to begin virtual sessions before formal approval arrives should hold off, not "start now and formalize later."</p>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        { title: "(i) Appropriateness of Teletherapy", content: `<p>Determining when teletherapy is and is not a clinically appropriate delivery modality for a given client — the foundation for the suitability-screening obligations detailed in Section 5.</p>` },
        { title: "(ii) Theory and Practice of Teletherapy", content: `<p>The evidence base and general practice principles of technology-mediated mental health service delivery, distinct from any single theoretical orientation.</p>` },
        { title: "(iii) Theory Integration", content: `<p>Adapting the licensee's own established theoretical orientation and interventions to function effectively within a teletherapy delivery format.</p>` },
        { title: "(iv) Modes of Delivery", content: `<p>Synchronous video, asynchronous/store-and-forward technology, and the platform characteristics and evaluation criteria that distinguish acceptable modes from non-compliant ones.</p>` },
        { title: "(v) Risk Management", content: `<p>General clinical and legal risk-management principles specific to virtual service delivery, including documentation, consent, and liability considerations.</p>` },
        { title: "(vi) Managing Emergencies", content: `<p>Crisis identification and response protocols adapted for a context where the clinician cannot physically intervene or accompany the client.</p>` },
        { title: "(vii) Legal/Ethical Issues", content: `<p>The regulatory and ethical framework governing teletherapy practice, including licensure/registration requirements, multi-jurisdictional considerations, and professional codes of ethics.</p>` },
        { title: "(viii) HIPAA Compliance", content: `<p>The HIPAA/HITECH technology-compliance requirement §505 names directly — covered in full in Section 2 of this course.</p>` },
      ],
    },
    {
      type: "callout",
      calloutType: "warning",
      title: "Do Not Practice Teletherapy Before Board Approval Is Granted",
      content: "<p>Completing initial training and submitting your Declaration/Statement of Practice addendum does not itself authorize you to practice teletherapy. Board staff review submissions monthly. Practicing teletherapy before approval is granted is practicing outside the scope of your license — plan your timeline around the monthly review cycle, and do not begin virtual sessions on the assumption that submission alone is sufficient.</p>",
    },
    {
      type: "text",
      content: `<h2>Common Pitfalls in the Approval Process</h2>
<p>A handful of avoidable mistakes account for most of the friction licensees report when pursuing Louisiana teletherapy approval, and naming them explicitly is more useful than a generic exhortation to "follow the process carefully." The most common is sequencing: a licensee completes initial training and, in the excitement of finishing a CE requirement, begins offering virtual sessions before either uploading the certificate or submitting the Declaration/Informed Consent addendum, let alone receiving confirmation of Board approval. The scenario walked through later in this section illustrates exactly this pitfall and how to avoid it. A second common mistake is treating the Declaration/Informed Consent addendum as boilerplate — copying language from a template or another licensee's document without adapting the technology-parameters, billing, and cross-jurisdictional items to the licensee's own actual practice, which risks both an addendum that does not accurately describe the licensee's practice and a Board review that flags generic, unverifiable content.</p>
<p>A third pitfall is underestimating the monthly review cycle's effect on timeline planning — submitting materials with an expectation of rapid, days-long turnaround, then either practicing prematurely out of impatience or leaving clients in limbo without a clear communication plan for the waiting period. A fourth, more subtle pitfall specific to licensees who already hold out-of-state credentials or experience is assuming that competence and training obtained elsewhere substitutes for Louisiana's specific process; §505's eight topic areas and the Declaration/Informed Consent addendum are Louisiana-specific requirements that an out-of-state credential, however rigorous, does not by itself satisfy. Avoiding these four pitfalls — sequencing, addendum genericness, timeline mismanagement, and assuming out-of-state equivalence — resolves the large majority of avoidable delays in the approval process.</p>`,
    },
    {
      type: "flashcardDeck",
      instructions: "Flip through the four steps of the Louisiana teletherapy approval pathway.",
      flashcards: [
        { id: "la-approval-1", front: "Step A", back: "Complete a minimum of 3 clock hours of initial training (sync or async) covering the 8 §505-specified topic areas, meeting Board CE standards." },
        { id: "la-approval-2", front: "Step B", back: "Upload the certificate of completion to the CEH tab of your Board dashboard. Retain your own copy of the certificate as well." },
        { id: "la-approval-3", front: "Step C", back: "Submit an updated Declaration/Statement of Practice, including a Teletherapy Declaration/Informed Consent addendum covering the eleven §505.F(a)–(k) items." },
        { id: "la-approval-4", front: "Step D", back: "Board staff review submissions on a monthly cycle. Do NOT provide teletherapy until approval is granted — practicing before approval is practicing outside the scope of your license." },
      ],
    },
    {
      type: "text",
      content: `<h2>Building a Compliant Declaration/Informed Consent Addendum</h2>
<p>Because Step C's Declaration/Informed Consent addendum is the most substantive of the four approval steps, it is worth expanding on what a licensee is actually producing. The addendum functions as both a regulatory filing (submitted to the Board as part of the approval process) and a clinical document (the informed-consent instrument a client actually reviews and signs before receiving teletherapy). These two functions pull in the same direction, but licensees sometimes draft a document that satisfies one and not the other — a Board-facing checklist recitation that a client would find impenetrable, or a client-friendly consent form that omits language the Board's review is checking for. The addendum should be written so that both audiences — the Board reviewer confirming §505.F(a)–(k) coverage, and the client actually deciding whether to consent to teletherapy — can each get what they need from the same document.</p>
<p>Among the eleven items, three deserve particular drafting attention because they are easy to treat too generically. The <strong>technology-assisted-media and technical-failure item</strong> should specify, concretely, which platform(s) the licensee uses, and should describe an actual failure protocol — what happens, step by step, if the connection drops mid-session, including how the client and clinician will re-establish contact and what the fallback communication channel is. The <strong>billing and third-party-payor item</strong> should not simply state that billing "may differ" for teletherapy; it should describe, specifically, how this licensee's practice bills teletherapy sessions, what a client should expect regarding insurance coverage for virtual visits, and what to do if a claim is denied on modality grounds. The <strong>cross-jurisdictional rights and limitations item</strong> should connect directly to the client-location and multi-state practice content in Section 4 of this course — a client should understand, from reading the addendum, that their location during a session has legal significance, not merely a technical or scheduling one.</p>
<h2>Timing the Approval Process Around a Practice Transition</h2>
<p>Licensees planning a transition into teletherapy practice — whether launching a new virtual-only practice, adding teletherapy to an existing in-person practice, or responding to a practice disruption that makes virtual delivery suddenly necessary — should build the monthly Board review cycle into their planning horizon from the outset, not discover it after submitting materials and expecting rapid turnaround. A reasonable planning approach is to complete initial training and assemble the Declaration/Statement of Practice addendum well in advance of any target start date, submit as early in a monthly review cycle as practical, and treat the interim period as time to finish other preparation — the technology infrastructure described in Section 2, the suitability-screening protocol described in Section 5 — rather than idle waiting.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Louisiana LMFT completed her three-hour initial training in early January and intended to begin offering teletherapy to a waitlisted client the following week. She had not yet uploaded her certificate to the CEH dashboard tab or drafted her Declaration/Informed Consent addendum, and once she did submit both, Board staff review — occurring on a monthly cycle — did not confirm her approval until the following month. Rather than beginning sessions in the interim on the assumption that her training alone was sufficient, she offered the waitlisted client interim in-person sessions and was transparent about the timeline, beginning teletherapy only once her Board approval was actually confirmed.</p></blockquote>
`,
    },
    {
      type: "text",
      content: `<h2>The Remaining Declaration Addendum Items in Context</h2>
<p>The three items highlighted above are not the only ones a licensee must address; §505.F(a)–(k) spans eleven items in total, and this course's accompanying Declaration Checklist worksheet walks through the full set. In general terms, beyond the technology/failure-protocol, billing/payor, and cross-jurisdictional-rights items already discussed, the remaining items cluster around several recurring themes common to this style of teletherapy-specific consent addendum: the scope and nature of services being offered via teletherapy specifically (as distinct from the licensee's general scope of practice); the client's right to request in-person services as an alternative where clinically appropriate; emergency-contact and crisis-response procedures tailored to the virtual modality, tying directly into the eighth §505 initial-training topic area on managing emergencies; the client's right to decline or discontinue teletherapy at any point without penalty; and confidentiality and recording policies specific to the technology being used. A licensee drafting the addendum should treat each item as requiring an actual, specific answer for their own practice — not a generic recitation lifted from a template without adaptation — since the addendum is what the Board reviews and what the client actually relies on.</p>
<h2>Coordinating the Addendum With the General Informed Consent Process</h2>
<p>Section 5 of this course covers §505's separate, ongoing informed-consent requirement — the clinical obligation to obtain and document a given client's consent before beginning teletherapy with them. The Declaration/Informed Consent addendum discussed here is the document submitted to the Board as part of securing approval in the first place. In practice, the most efficient and defensible approach is for a licensee to draft a single, comprehensive teletherapy consent document that simultaneously satisfies both functions: the content required for Board review under §505.F(a)–(k), and the client-facing informed consent content required under §505's ongoing consent obligation. Maintaining two separate, only loosely related documents — a Board-facing addendum drafted once and never revisited, and a client-facing consent form that evolves independently — creates a documentation-drift risk in which the two no longer accurately reflect the same practice. Reviewing and, where necessary, updating both together, on the same schedule, is a straightforward way to avoid that drift.</p>
`,
    },
    {
      type: "scenarioTree",
      scenarioTitle: "The Eager Launch",
      instructions: "A Louisiana PLPC has just completed the required 3-hour initial teletherapy training and is excited to start offering virtual sessions to reduce no-show rates among her rural clients.",
      startNode: "start",
      nodes: {
        start: {
          text: "She has her training certificate in hand. What should she do next?",
          options: [
            { text: "Start scheduling teletherapy sessions immediately — the training is the hard part", next: "wrong_start", feedback: "Training completion alone does not confer approval. She still needs to upload the certificate, submit her Declaration/Informed Consent addendum, and wait for Board approval." },
            { text: "Upload the certificate to the CEH tab of her Board dashboard", next: "correct_upload", feedback: "Correct — this is Step B of the four-step approval pathway." },
          ],
        },
        wrong_start: {
          text: "Practicing teletherapy before Board approval is granted is practicing outside the scope of her license — a serious compliance issue, not a minor procedural gap. What should she do instead?",
          options: [{ text: "Complete the remaining approval steps first", next: "correct_upload" }],
        },
        correct_upload: {
          text: "She uploads the certificate. What is her next required step?",
          options: [
            { text: "Wait for the Board to automatically generate her Declaration addendum", next: "wrong_wait" },
            { text: "Submit an updated Declaration/Statement of Practice with the Teletherapy Declaration/Informed Consent addendum", next: "correct_declaration" },
          ],
        },
        wrong_wait: {
          text: "The Declaration/Statement of Practice addendum is not automatically generated — it is a document the licensee drafts and submits, covering the eleven §505.F(a)–(k) items.",
          options: [{ text: "What should she do?", next: "correct_declaration" }],
        },
        correct_declaration: {
          text: "She drafts and submits the addendum. What happens next, and what should she do while she waits?",
          options: [{ text: "Wait for monthly Board staff review, and hold off on providing teletherapy until approval is confirmed", next: "resolution" }],
        },
        resolution: {
          text: "Correct. Board staff review submissions on a monthly cycle. She should not provide teletherapy to any client until she has actually received confirmation of approval — even though the delay is inconvenient for her rural clients experiencing scheduling difficulty.",
          options: [],
        },
      },
    },
    {
      type: "text",
      content: `<h2>What Happens After Approval Is Granted</h2>
<p>It is worth briefly looking past the approval moment itself, since the four steps covered in this section are the entry point into a broader compliance relationship with the Board, not a one-time hurdle after which teletherapy practice runs on autopilot. Once approval is confirmed, a licensee's teletherapy-specific obligations continue on two tracks this course covers in the sections that follow: a recurring continuing-education track (Section 4), under which the licensee must accrue three clock hours of teletherapy CE every renewal period to maintain approval, and an ongoing clinical/operational track (Section 5), under which the suitability-screening, informed-consent, records, and telesupervision standards apply to every teletherapy client the licensee sees going forward, not merely to the initial approval application.</p>
<p>Approved status is also not necessarily permanent in a passive sense — a licensee who lets the recurring CE requirement lapse, or whose Declaration/Informed Consent addendum becomes stale relative to their actual practice (a new platform adopted without updating the technology-parameters item, for example), has approval on paper that no longer accurately reflects a Board-compliant practice. Treating the Declaration/Informed Consent addendum as a living document — reviewed and updated whenever the licensee's technology, billing arrangements, or practice footprint materially change, not merely filed away after initial approval — is the practical habit that keeps approval and actual practice aligned over time.</p>`,
    },
    {
      type: "keyTakeaway",
      title: "Section 3 Key Takeaways",
      content: "<p>Louisiana's approval pathway has four concrete steps — initial training on eight specified topics, a dashboard certificate upload, a substantive Declaration/Informed Consent addendum covering eleven items, and monthly Board review — and none of the first three steps confers authorization on their own. The Board's guidance is unambiguous that a licensee should not provide teletherapy until approval is actually granted, and licensees should plan their transition timeline around the monthly review cycle rather than assuming rapid turnaround.</p>",
      items: [
        "Initial training must cover all eight §505-specified topic areas and meet a 3-clock-hour minimum",
        "The certificate upload (CEH dashboard tab) and the Declaration/Informed Consent addendum submission are two separate, licensee-initiated steps",
        "Board review is monthly — plan timelines accordingly, and do not begin teletherapy before approval is confirmed",
      ],
    },
    {
      type: "reflection",
      question: "If you were assembling your own Declaration/Informed Consent addendum today, could you write a concrete, specific answer (not a generic placeholder) for the technology/technical-failure item and the billing/third-party-payor item? What would you need to research first?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "What is the minimum initial-training requirement to pursue Louisiana teletherapy approval?",
      options: [
        { text: "One clock hour, synchronous only", isCorrect: false },
        { text: "Three clock hours, synchronous or asynchronous, covering eight specified topic areas", isCorrect: true },
        { text: "Ten clock hours over a full CE renewal cycle", isCorrect: false },
        { text: "No formal training is required, only the Declaration addendum", isCorrect: false },
      ],
      explanation: "The Board's FAQ specifies a minimum of three clock hours of initial training, synchronous or asynchronous, covering the eight §505-specified topic areas.",
    },
    {
      type: "multipleChoice",
      question: "After completing initial training, what must a licensee do with the certificate of completion?",
      options: [
        { text: "Nothing — the training provider notifies the Board automatically", isCorrect: false },
        { text: "Upload it to the CEH tab of their Board dashboard", isCorrect: true },
        { text: "Mail a paper copy to the Board office only", isCorrect: false },
        { text: "Submit it only if audited", isCorrect: false },
      ],
      explanation: "The certificate of completion must be uploaded to the CEH tab of the licensee's Board dashboard as Step B of the approval process.",
    },
    {
      type: "multipleChoice",
      question: "How often does Board staff review teletherapy approval submissions?",
      options: [
        { text: "Same-day", isCorrect: false },
        { text: "Weekly", isCorrect: false },
        { text: "Monthly", isCorrect: true },
        { text: "Only quarterly, at Board meetings", isCorrect: false },
      ],
      explanation: "Board staff review submissions on a monthly cycle — licensees should plan their timeline accordingly.",
    },
    {
      type: "multipleChoice",
      question: "A licensee has completed initial training and submitted the Declaration/Informed Consent addendum, but has not yet received confirmation of Board approval. She should:",
      options: [
        { text: "Begin providing teletherapy immediately, since both required documents are submitted", isCorrect: false },
        { text: "Wait until approval is actually granted before providing teletherapy", isCorrect: true },
        { text: "Provide teletherapy only to established clients, but not new clients, while waiting", isCorrect: false },
        { text: "Provide teletherapy for up to 30 days while the review is pending", isCorrect: false },
      ],
      explanation: "The Board's guidance is that a licensee should not provide teletherapy until approval is actually granted — practicing before approval is practicing outside the scope of the license.",
    },
  ],
};

// ═══ SECTION 4: Ongoing Compliance, Renewal, and Multi-State Practice ═══
const SECTION_4 = {
  title: "Ongoing Compliance, Renewal, and Multi-State Practice",
  order: 4,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 4,
      title: "Section 4",
      subtitle: "Ongoing Compliance, Renewal, and Multi-State Practice",
      bannerAlt: "Map with a location pin representing interstate teletherapy practice and client-location requirements",
    },
    {
      type: "text",
      content: `<h2>The Two "Three-Hour" Requirements — And Why They Get Confused</h2>
<p>Section 3 of this course covered the one-time, initial three-clock-hour training required to become approved to provide teletherapy in the first place. Once approved, a Louisiana licensee faces an entirely separate, recurring obligation: §505.E requires <strong>three clock hours of continuing education in teletherapy during each renewal period</strong>, and Louisiana's LPC renewal period is two years. These are two different requirements that happen to share the same number — three — and that shared number is precisely why licensees conflate them more often than almost any other detail in this rule. Most secondary sources describing Louisiana's teletherapy CE requirements report only one of the two figures, reinforcing the confusion for a licensee who has only encountered a summary rather than the rule itself.</p>
<p>To state the distinction as plainly as possible: <strong>the initial three clock hours (Section 3 of this course) get you approved to practice teletherapy in the first place, one time.</strong> <strong>The renewal three clock hours (this section) are a recurring obligation you must satisfy every two-year renewal period for as long as you continue to hold teletherapy approval.</strong> Completing this course satisfies the initial-training requirement if you are pursuing approval for the first time; it can also satisfy a given renewal period's three-hour teletherapy CE requirement if you are already approved and simply need to accrue your recurring hours — but it does not satisfy both obligations simultaneously across time. A licensee who takes this course as their initial training in Year 1 will still need a fresh three hours of teletherapy CE (this course again, or a different qualifying course) by the end of their Year 1–2 renewal period, and again every renewal period thereafter.</p>
`,
    },
    {
      type: "callout",
      calloutType: "warning",
      title: "Disambiguating Louisiana's Two \"3-Hour\" Teletherapy Requirements",
      content: "<p>Louisiana has TWO separate 3-hour teletherapy requirements that are easy to conflate because the numbers are identical: (1) a ONE-TIME 3-clock-hour <em>initial training</em> requirement to become approved to provide teletherapy at all (§505's approval process, covered in Section 3); and (2) a RECURRING 3-clock-hour <em>continuing education</em> requirement every renewal period (Louisiana's LPC renewal period is two years) to maintain approval, once granted (§505.E). Completing this course can satisfy either one — but not both across time. Track which one you're satisfying and when your next renewal-period teletherapy CE is due.</p>",
      items: [
        "Initial training: one-time, required BEFORE you may provide teletherapy at all",
        "Renewal CE: recurring, 3 hours every 2-year renewal period, required to MAINTAIN approval",
        "The identical \"3\" is a coincidence of drafting, not a sign the two requirements are the same obligation",
      ],
    },
    {
      type: "text",
      content: `<h2>Out-of-State Registration: A Confirmed Pathway</h2>
<p>Louisiana does have a Florida-style pathway allowing appropriately qualified out-of-state clinicians to provide teletherapy to Louisiana-located clients — and this course's build process specifically revisited and confirmed this point, correcting a prior, more tentative assumption that Louisiana lacked such a mechanism. Per the Board's FAQ, an out-of-state licensee "must be registered with the Louisiana LPC Board," and "any individual licensed in the state of Louisiana or registered as an out-of-state licensee" may provide teletherapy if they meet all of §505's requirements and their training is Board-approved. The Board also provides a <strong>30-day temporary exclusion</strong> while a registration application is pending — a grace window for a specific administrative step, not a license to practice teletherapy generally before either registration or the full §505 approval process is complete.</p>
<h2>How the Registration Pathway Reconciles With §505.D's Licensure Language</h2>
<p>A careful reader of §505.D will notice language requiring that a teletherapy provider "must be licensed by the board" — language that, read in isolation, might seem to conflict with a registration-based pathway for out-of-state clinicians who do not hold a Louisiana license. The reconciliation is found in LAC 46:LX.503's own definitions section: §503 defines "Licensure" broadly enough to include "any license, certification, or registration ... approved by the board." Under this definition, a Board-approved registration is itself a form of "Licensure" for purposes of §505.D's requirement — the registration pathway is not an exception carved out of the licensure requirement, it is one of the forms that licensure can take under the Board's own defined terms. Louisiana clinicians who supervise or collaborate with out-of-state colleagues serving Louisiana clients should understand this reconciliation precisely: the correct description of an out-of-state colleague's authorization is "registered with the Louisiana Board and §505-compliant," not "fully licensed in Louisiana" — the two are different things even though §503's definition allows the registration to satisfy §505.D's licensure language.</p>
<h2>What the Registration Pathway Is Not</h2>
<p>It is worth being precise about scope here, because "registration pathway" can sound, at a glance, like reciprocal licensure — it is not. An out-of-state clinician using this pathway does not receive a full Louisiana counseling license; they receive Board-approved registration status specifically tied to teletherapy practice under §505's requirements. This distinction matters for scope-of-practice questions beyond teletherapy: a registered out-of-state clinician's authorization to serve Louisiana-located clients via teletherapy does not, by itself, authorize any other form of practice in Louisiana that a full license might. The FAQ's own phrasing — "registered with the Louisiana LPC Board," not "fully licensed in Louisiana" — reflects this distinction deliberately, and licensees should preserve that same precision when describing the pathway to colleagues.</p>
`,
    },
    {
      type: "callout",
      calloutType: "key",
      title: "The Registration Pathway: Registration + §505 Compliance + Board Approval — Not Full Licensure",
      content: "<p>An out-of-state clinician may provide teletherapy to a Louisiana-located client by: registering with the Louisiana LPC Board, meeting all of §505's requirements, and having Board-approved training. A 30-day temporary exclusion applies while a registration application is pending. §503's broad \"Licensure\" definition — which includes Board-approved registration — is what reconciles this pathway with §505.D's \"must be licensed by the board\" language. This is registration, not full reciprocal Louisiana licensure.</p>",
      items: [
        "Confirm registration status (not mere home-state licensure) for any out-of-state colleague serving Louisiana clients",
        "The 30-day temporary exclusion covers a pending registration application — it is not a general grace period for unapproved teletherapy",
        "Registration authorizes teletherapy under §505 specifically — it does not confer a general Louisiana counseling license",
      ],
    },
    {
      type: "text",
      content: `<h2>The Out-of-State Client Rule: A Contact-and-Document Duty</h2>
<p>Section 1 of this course introduced the client-location principle in general terms; §505.D gives it a specific, affirmative operational form for Louisiana licensees. A licensee provides teletherapy services consistent with the licensing laws of <strong>both</strong> the jurisdiction where the licensee is physically located <strong>and</strong> the jurisdiction where the client is physically located at the time of service. When a Louisiana licensee sees a client who is physically located in another state — whether the client has relocated, is traveling, or maintains a genuinely dual residence — §505.D imposes something stronger than a passive compliance expectation: the licensee must <strong>contact the licensing board in the client's state</strong> and <strong>document all relevant teletherapy regulations</strong> that apply there. This is an affirmative research-and-documentation duty, not merely an obligation to avoid violating the other state's rules if the licensee happens to already know them.</p>
<p>This contact-and-document duty is stronger than the framing many licensees may have encountered in other states' telehealth CE materials, which sometimes describe the client-location principle in more general "be aware of the other state's requirements" terms without specifying an affirmative contact step. For a platform serving multi-state licensees, this duty deserves its own operational habit, not just conceptual awareness: every time a Louisiana licensee's teletherapy client is confirmed to be physically located in a state other than Louisiana — even temporarily — the licensee should contact that state's licensing board (or consult that board's published telehealth regulations directly, where contact is not the board's preferred first step) and create a dated record of what was found. The accompanying Out-of-State Client Compliance Log worksheet is built specifically around this duty: client, state, board contacted, date, relevant regulations documented, and authorization status.</p>
<h2>Provisional Licensees and Teletherapy — Current Position vs. Legacy Language</h2>
<p>The Board's FAQ states that both licensed and provisionally licensed individuals may provide teletherapy if §505's requirements are met, and it provides specific submission instructions for PLPCs pursuing approval. This is the current, operative position, and it is the one this course follows. Licensees — particularly PLPCs researching this question independently — may nonetheless encounter an older definition in LAC 46:LX.503: the "Internet Counseling" definition, which predates §505's current form, states that no provisional licensee may engage in internet counseling. That older §503 language predates the December 2020 rule update reflected in the Louisiana Register, Volume 46, Number 12, and has not been the Board's operative position since. A PLPC who finds the older §503 "Internet Counseling" language should understand it as superseded legacy text, not a live prohibition — but should also expect that, consistent with the general PLPC framework, teletherapy practice as a provisional licensee occurs under Board-approved supervision, alongside full §505 compliance, exactly as the FAQ's PLPC-specific submission instructions contemplate.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Louisiana LPC's established client relocated temporarily to Mississippi for a six-month work assignment, intending to return to Louisiana afterward. Rather than assuming her Louisiana license alone continued to authorize the relationship, the clinician contacted the Mississippi licensing board governing professional counselors, documented Mississippi's specific telehealth practice requirements for an out-of-state provider serving a Mississippi-located client, confirmed she met those requirements (or, where she did not, adjusted her practice accordingly), and recorded the entire research process — board contacted, date, findings, authorization basis — in a compliance log. When the client's assignment was extended by another six months, she treated it as a prompt to re-verify rather than assuming the original research remained sufficient indefinitely.</p></blockquote>
`,
    },
    {
      type: "text",
      content: `<h2>Interstate Compacts and Where Louisiana's LPC/LMFT Licensure Fits</h2>
<p>Beyond Louisiana's own §505.D contact-and-document duty and its confirmed out-of-state registration pathway, licensees serving clients across state lines should be aware of the broader interstate-compact landscape developing in the counseling and marriage and family therapy professions, even though these compacts operate independently of, and do not substitute for, §505's own requirements. The Counseling Compact, developed by the Council of State Governments and supported by NBCC, allows eligible licensed professional counselors to obtain a privilege to practice in other member states without separate licensure in each one, once a sufficient number of member states have both enacted the compact and stood up its operational data system. Eligibility generally requires an active, unencumbered license, a graduate degree from an accredited program, passage of a recognized national examination, and a clean disciplinary record. Louisiana licensees should verify the compact's current implementation status and whether it has been enacted in Louisiana before assuming it provides an alternative to the §505.D contact-and-document duty for a specific out-of-state client — a compact privilege-to-practice, once operational, still requires compliance with the destination state's applicable practice requirements, similar in spirit to how Louisiana's own out-of-state registration pathway requires §505 compliance rather than dispensing with jurisdiction-specific rules entirely.</p>
<p>A parallel compact for marriage and family therapists, developed in collaboration with associations representing the profession, follows a broadly similar privilege-to-practice model and may become relevant to Louisiana LMFTs serving out-of-state clients as its own enactment status progresses. Because compact status changes over time as additional states enact and implement these frameworks, licensees should treat compact eligibility as something to re-verify periodically — at minimum, at each license renewal — rather than a fact established once and assumed permanent. The regulatory-monitoring habit this implies is the same one Section 1 of this course connected to the broader theme of Louisiana's structured approval process: teletherapy and multi-state practice compliance is not a "set it and forget it" credential, in Louisiana or in the compact landscape surrounding it.</p>
<h2>Professional Liability Considerations in Multi-State Teletherapy</h2>
<p>Interstate teletherapy practice raises professional liability insurance considerations that Louisiana licensees should not overlook. Standard professional liability policies may or may not provide coverage for services delivered to clients physically located in other states, depending on the specific policy language; a licensee relying on the §505.D contact-and-document pathway for an out-of-state client should confirm with their liability carrier, in advance and in writing, that coverage extends to that state, rather than discovering a coverage gap only after a claim arises. Malpractice claims arising from teletherapy services may be governed by the law of the state where the client is located, the state where the licensee is located, or both, depending on applicable conflict-of-laws principles — a jurisdictional uncertainty that underscores why the §505.D documentation habit (client, state, board contacted, date, regulations documented, authorization status) is valuable well beyond the moment of initial compliance: it is also the record a licensee would want available if a liability question arose from services delivered to that client months or years later.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Building a Renewal-Cycle Compliance Tracking Habit</h2>
<p>Given how many distinct, date-sensitive obligations this section has covered — the recurring 3-hour teletherapy CE requirement every 2-year renewal period, the out-of-state registration pathway's 30-day temporary exclusion window, and the §505.D contact-and-document duty that can be triggered by any single out-of-state session — a Louisiana teletherapy licensee benefits from a simple, sustainable tracking system rather than relying on memory. A basic compliance-tracking record should document, at minimum: the date the current renewal-period teletherapy CE hours were completed and by what course; every out-of-state client contact-and-document entry, organized by state and date; the status of any pending out-of-state registration application, including when the 30-day temporary exclusion window opened and closes; and the date the Declaration/Informed Consent addendum was last reviewed or updated. None of this needs to be an elaborate system — a single spreadsheet or document, reviewed at a fixed interval such as the start of each renewal period, is sufficient for most solo and small-group practices, provided it is actually reviewed on that schedule rather than created once and forgotten.</p>
<p>Regulatory monitoring is the companion habit to compliance tracking: because the Board's FAQ, rule text, and compact landscape can all change over time, licensees should periodically confirm that the specific facts this course relies on — the eight training topics, the four-step approval process, the confirmed registration pathway, the §505.D duty, the uncapped telesupervision allowance — remain current, rather than treating a single CE course as a permanent source of truth. Checking the Louisiana LPC Board's own FAQ periodically, particularly before a renewal cycle or before taking on a new out-of-state client, is a low-effort way to catch a regulatory change before it becomes a compliance gap.</p>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each scenario into whether a Louisiana teletherapy licensee needs to contact and document the other state's board under §505.D's out-of-state client rule.",
      categories: ["Contact-and-Document Duty Applies", "Contact-and-Document Duty Does Not Apply"],
      cards: [
        { id: "la-oos-1", text: "Client is physically located in Louisiana for the entire session", correctCategory: "Contact-and-Document Duty Does Not Apply" },
        { id: "la-oos-2", text: "Client is temporarily traveling in Texas during a scheduled session", correctCategory: "Contact-and-Document Duty Applies" },
        { id: "la-oos-3", text: "Client has relocated permanently to Alabama", correctCategory: "Contact-and-Document Duty Applies" },
        { id: "la-oos-4", text: "Client maintains a genuine dual residence, splitting time between Louisiana and Georgia", correctCategory: "Contact-and-Document Duty Applies" },
        { id: "la-oos-5", text: "Clinician is traveling out of state, but the client remains in Louisiana", correctCategory: "Contact-and-Document Duty Does Not Apply" },
      ],
      explanation: "§505.D's contact-and-document duty is triggered by the CLIENT's physical location at the time of service, not the clinician's location or the nature/permanence of the client's presence in the other state.",
    },
    {
      type: "matching",
      matchingInstructions: "Match each Louisiana multi-state practice term to its correct description.",
      matchingPairs: [
        { term: "§505.E Renewal CE", definition: "3 clock hours of teletherapy CE required every 2-year renewal period to MAINTAIN approval — recurring, not one-time" },
        { term: "§505.D Contact-and-Document Duty", definition: "Affirmative obligation to contact the client's state licensing board and document applicable regulations when the client is physically located outside Louisiana" },
        { term: "30-Day Temporary Exclusion", definition: "Grace window while an out-of-state clinician's registration application with the Louisiana Board is pending" },
        { term: "§503 \"Licensure\" Definition", definition: "Broad definition including \"any license, certification, or registration ... approved by the board\" — reconciles the registration pathway with §505.D" },
        { term: "Legacy §503 \"Internet Counseling\" Definition", definition: "Older provision stating provisional licensees may not engage in internet counseling — superseded by the current FAQ/2020 rule position" },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 4 Key Takeaways",
      content: "<p>Louisiana licensees face a recurring 3-hour teletherapy CE requirement every renewal period — a separate obligation from the one-time initial training covered in Section 3, despite the identical numeral. The out-of-state registration pathway is real and confirmed, reconciled with §505.D's licensure language through §503's broad \"Licensure\" definition, and out-of-state clients trigger an affirmative contact-and-document duty with the client's home-state board, not merely passive awareness. Provisional licensees may pursue teletherapy approval under the Board's current position, notwithstanding older, superseded §503 language.</p>",
      items: [
        "Track the recurring 3-hour renewal CE requirement separately from the one-time initial training",
        "Out-of-state registration + §505 compliance + Board approval authorizes non-Louisiana clinicians — it is not full reciprocal licensure",
        "When a client is physically located outside Louisiana, contact and document that state's board requirements — an affirmative duty, not passive awareness",
      ],
    },
    {
      type: "reflection",
      question: "Do you know, for every current teletherapy client, which state they were physically located in during your most recent session with them? If any were outside Louisiana, have you contacted and documented that state's requirements per §505.D?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "The recurring teletherapy CE requirement under §505.E is:",
      options: [
        { text: "3 clock hours, one time only, identical to the initial-training requirement", isCorrect: false },
        { text: "3 clock hours every renewal period (Louisiana's LPC renewal period is 2 years)", isCorrect: true },
        { text: "6 clock hours every renewal period", isCorrect: false },
        { text: "No recurring requirement — only the one-time initial training applies", isCorrect: false },
      ],
      explanation: "§505.E requires 3 clock hours of teletherapy CE during each renewal period, a recurring obligation separate from the one-time initial training.",
    },
    {
      type: "multipleChoice",
      question: "How does an out-of-state clinician become authorized to provide teletherapy to a Louisiana-located client?",
      options: [
        { text: "Full reciprocal Louisiana licensure is required — no other pathway exists", isCorrect: false },
        { text: "Registering with the Louisiana LPC Board, meeting all §505 requirements, and having Board-approved training", isCorrect: true },
        { text: "Simply disclosing their home-state license to the client is sufficient", isCorrect: false },
        { text: "No mechanism exists for out-of-state clinicians in Louisiana", isCorrect: false },
      ],
      explanation: "Per the Board's FAQ, an out-of-state clinician may provide teletherapy to a Louisiana-located client by registering with the Board and meeting all §505 requirements with Board-approved training — this is registration, not full reciprocal licensure.",
    },
    {
      type: "multipleChoice",
      question: "Under §505.D, when a Louisiana licensee's client is physically located in another state during a session, the licensee must:",
      options: [
        { text: "Do nothing differently, since the licensee's Louisiana license governs regardless of client location", isCorrect: false },
        { text: "Contact the licensing board in the client's state and document all relevant teletherapy regulations", isCorrect: true },
        { text: "Terminate services immediately", isCorrect: false },
        { text: "Only document the client's location, with no obligation to contact the other state's board", isCorrect: false },
      ],
      explanation: "§505.D requires the licensee to contact the licensing board in the client's state and document all relevant teletherapy regulations — an affirmative contact-and-document duty, not passive awareness.",
    },
    {
      type: "multipleChoice",
      question: "How does LAC 46:LX.503's definition of \"Licensure\" reconcile with §505.D's requirement that a teletherapy provider \"must be licensed by the board\"?",
      options: [
        { text: "It doesn't — the two provisions genuinely conflict and remain unresolved", isCorrect: false },
        { text: "§503 defines \"Licensure\" broadly to include any license, certification, or registration approved by the board, so Board-approved registration counts as licensure", isCorrect: true },
        { text: "§505.D's licensure requirement only applies to Louisiana residents, not out-of-state registrants", isCorrect: false },
        { text: "The registration pathway is a court-created exception, not a Board rule", isCorrect: false },
      ],
      explanation: "§503's broad \"Licensure\" definition includes any license, certification, or registration approved by the board — which is how the registration pathway satisfies §505.D's licensure language.",
    },
  ],
};

// ═══ SECTION 5: Clinical and Operational Standards Under §505 ═══
const SECTION_5 = {
  title: "Clinical and Operational Standards Under §505",
  order: 5,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 5,
      title: "Section 5",
      subtitle: "Clinical and Operational Standards Under §505",
      bannerAlt: "Therapist taking notes during a video counseling call, representing clinical and operational teletherapy standards",
    },
    {
      type: "text",
      content: `<h2>Suitability Screening: A §505 Requirement, Not Just Best Practice</h2>
<p>§505 requires licensees to affirm that a client can be properly diagnosed and treated via teletherapy before proceeding, including specific attention to appropriateness for clients with sensory deficits. Where a client cannot be properly served via teletherapy, the rule is direct about the required response: the client "shall be dismissed and treated in person and/or terminated with appropriate referrals." This is stronger language than a general best-practice recommendation to "consider whether telehealth is appropriate" — it is a Board-mandated screening obligation with a specified consequence when the screening fails.</p>
<p>A useful organizing structure for this screening — adapted from the general clinical literature on telehealth suitability, and consistent with the "appropriateness of teletherapy" topic area required in initial training (Section 3) — evaluates the client across clinical appropriateness, technological capacity, and environmental suitability. §505's explicit sensory-deficit language belongs within the clinical-appropriateness domain: a client with a significant hearing impairment may need captioning or an alternative communication accommodation before teletherapy is suitable; a client with a significant visual impairment may need screen-reader-compatible platforms or a different delivery mode; a client with combined sensory deficits may, after reasonable accommodation is explored and found insufficient, be a client for whom in-person services are the only clinically appropriate option. The rule's framing — assess, and if the client cannot be properly served, dismiss and refer — means accommodation should be explored first, but the licensee must be willing to reach and act on a negative determination when accommodation genuinely is not sufficient, not indefinitely continue teletherapy with a client the assessment shows cannot be adequately served that way.</p>
<h2>Documenting the Suitability Determination</h2>
<p>Because §505 frames this as an affirmative requirement — the licensee must affirm the client can be properly diagnosed and treated via teletherapy — the determination should be documented in the clinical record with the same rigor as any other clinically significant assessment: the date of the determination, the specific factors considered (including any sensory-deficit accommodation explored), the clinical conclusion, and, where the conclusion is that the client cannot be properly served, the specific dismissal-and-referral or in-person-transition action taken. This documentation serves the same dual purpose described in Section 3 for the Declaration/Informed Consent addendum — it is both good clinical practice and the evidentiary record a licensee would need to produce if the Board ever reviewed a specific case for §505 compliance.</p>
<h2>Informed Consent: Verbal and/or Written, Documented, E-Signatures Permitted</h2>
<p>§505 requires informed consent at the onset of teletherapy, which may be verbal and/or written, and must be documented in the client's record. Electronic signatures are explicitly permitted, which matters practically for a modality where the client and licensee may never be in the same physical room to exchange a wet-ink signature. This informed-consent requirement is distinct from, but closely related to, the Declaration/Informed Consent addendum discussed in Section 3: the addendum is the document a licensee submits to the Board as part of securing specialty-area approval in the first place, while the informed consent discussed here is the ongoing clinical obligation to obtain and document a given client's consent before beginning teletherapy with them specifically. In practice, most licensees will build their client-facing informed consent form directly from the content of their approved addendum, so the two documents are closely related in substance even though they serve different procedural functions.</p>
`,
    },
    {
      type: "callout",
      calloutType: "clinical",
      title: "§505's Suitability Standard: Assess, Accommodate, and Be Willing to Dismiss-and-Refer",
      content: "<p>§505 requires licensees to affirm a client can be properly diagnosed and treated via teletherapy — with explicit attention to appropriateness for clients with sensory deficits — and requires that a client who cannot be properly served via teletherapy be dismissed and treated in person and/or terminated with appropriate referrals. Explore accommodation first; but be willing to reach and act on a negative determination when accommodation is genuinely insufficient.</p>",
    },
    {
      type: "text",
      content: `<h2>Termination and Referral Procedures When Suitability Fails</h2>
<p>§505's dismiss-and-refer language sets an outcome, not a process — the rule states what must happen when a client cannot be properly served via teletherapy, but the licensee is responsible for carrying that outcome out in a clinically and ethically sound way. A well-handled dismiss-and-refer situation shares several features regardless of the specific reason suitability failed: it is planned rather than abrupt wherever possible, since the informed-consent conversation discussed elsewhere in this section should already have set the expectation that in-person transition is a possible outcome, not a surprise; it includes a specific, actionable referral rather than a general suggestion to "seek in-person services," ideally to a named provider or practice with actual capacity to accept the client; and it includes a warm handoff where feasible — coordinating records transfer with the client's consent and, where appropriate, direct communication between the licensee and the receiving provider — rather than leaving the client to restart the search for care entirely on their own.</p>
<p>The clinical record should document the referral itself: to whom the client was referred, when, and what information (with appropriate consent) was transferred to support continuity of care. Where a client's suitability failure stems from a temporary or resolvable barrier — a technology gap that a device loan could fix, an environmental privacy issue that might resolve with a scheduling change — the dismiss-and-refer determination should be understood as reflecting the client's circumstances at that point in time, not a permanent judgment; a licensee who documents the specific barrier clearly leaves the door open to reassess and potentially resume teletherapy later if circumstances change, consistent with the general principle that suitability determinations should be revisited when a client's situation changes materially.</p>`,
    },
    {
      type: "text",
      content: `<h2>Documentation Templates for the Suitability and Consent Requirements</h2>
<p>Because §505 imposes specific, affirmative documentation duties for both suitability screening and informed consent, many Louisiana teletherapy practices find it worthwhile to build structured documentation templates rather than relying on free-text session notes to capture these elements consistently. A suitability-screening template should prompt for the date of assessment, the specific clinical, technological, and environmental factors considered, explicit attention to sensory-deficit accommodation where relevant, the determination reached, and — where the determination is negative — the specific dismiss-and-refer action taken and to whom the client was referred. A consent template should prompt for whether consent was obtained verbally, in writing, or both; the date; whether an electronic signature was used; and confirmation that the technology-parameters, billing, and cross-jurisdictional-rights content from the Declaration/Informed Consent addendum was specifically reviewed with this client, not merely referenced in the abstract.</p>
<p>Many electronic health record systems used by Louisiana practices now include telehealth-specific note templates that can be adapted to prompt for these §505-specific elements alongside standard clinical documentation. For practices whose EHR does not include such templates, a custom addendum field or a standardized checklist appended to the intake note serves the same function. The goal in either case is the same one that runs through this entire section: making the §505 documentation duties a routine, low-friction part of the existing clinical workflow, rather than a separate compliance exercise a licensee has to remember to perform on top of ordinary charting.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Records: Disclosure, Encryption, Archival, and Standards Equal to In-Person</h2>
<p>§505 requires licensees to inform clients how their records are maintained, including the type of encryption or security used and the duration of archival storage — a disclosure obligation that depends directly on the technology-compliance program described in Section 2 of this course. A licensee cannot make this disclosure meaningfully without first having a documented, specific answer: which encryption standard protects records at rest, how long records are archived before destruction, and what security measures govern access, transmission, and eventual destruction of teletherapy records. §505's baseline standard for all of this — documentation, maintenance, access, transmission, and destruction — is that teletherapy records must meet standards equal to in-person records. Teletherapy is not an occasion to relax documentation rigor; if anything, the additional technology layer means there are more points in the records lifecycle (platform-generated session metadata, chat logs, cloud backup copies) that need to be accounted for to meet that equal standard.</p>
<h2>No Social Media in Delivery — Restated as a Clinical/Operational Rule</h2>
<p>Section 2 of this course covered the social media prohibition as a technology-platform issue; §505 also frames it as a clinical/operational standard directly: social media platforms and functions — tweets, blogs, networking-site posts — may not be used in the delivery of teletherapy, and clients may not be referenced, generally or specifically, on such formats. The clinical dimension of this rule extends beyond platform selection: a licensee should also avoid referencing clients, even in de-identified or seemingly innocuous form, in professional social media content discussing their teletherapy practice, since §505's prohibition on referencing clients "generally or specifically" on social media formats reads naturally to cover more than just live session delivery.</p>
<h2>Telesupervision: 100 Percent of Hours May Be Delivered Virtually</h2>
<p>§505.K addresses telesupervision directly, and it contains one of the more distinctive features of Louisiana's framework relative to many other states: <strong>100 percent of total supervision hours may be delivered via telesupervision</strong>, using synchronous video and audio, with no percentage cap requiring some minimum proportion of in-person supervision. Many states' supervision rules impose a cap — permitting telesupervision for some defined share of total hours while requiring the remainder to occur in person — and Louisiana's approach of allowing telesupervision to satisfy the entire supervision-hour requirement is a meaningful differentiator worth flagging explicitly for PLPCs and supervisors planning a supervision arrangement. This does not mean telesupervision is unregulated: it must still be synchronous (real-time video and audio, not asynchronous or recorded review alone) and otherwise consistent with the Board's general supervision standards; it means only that the modality itself is not subject to a numeric ceiling the way it is in many other jurisdictions.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Louisiana PLPC working with a supervisor in a different parish, several hours away by car, had assumed — based on a prior supervisory relationship in another state — that some portion of her required supervision hours would need to occur in person regardless of how the rest were structured. After reviewing §505.K directly as part of pursuing her own teletherapy approval, she confirmed that Louisiana permits the full supervision-hour requirement to be satisfied via telesupervision, provided the sessions are synchronous video and audio. She and her supervisor restructured their arrangement entirely around telesupervision, eliminating a travel burden that had been a genuine barrier to consistent, frequent supervision meetings.</p></blockquote>
<h2>Bringing the Clinical/Operational Standards Together</h2>
<p>The five requirements covered in this section — suitability screening with its sensory-deficit and dismiss-and-refer mandate, informed consent with permitted e-signatures, records standards equal to in-person practice, the social media exclusion, and telesupervision — are not a random assortment; together with the HIPAA/HITECH technology-compliance requirement from Section 2, they constitute the full body of ongoing clinical/operational obligations a Louisiana teletherapy-approved licensee carries once approval is granted. Approval under Section 3's four-step process is the entry point; the standards in this section, together with the renewal CE and multi-state practice obligations from Section 4, are the substance of what it means to remain in compliance afterward.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Adapting Clinical Assessment to the Teletherapy Format</h2>
<p>The "appropriateness of teletherapy" and "theory and practice of teletherapy" topic areas required in initial training (Section 3) rest on a practical foundation: a licensee's ability to conduct meaningful clinical assessment through a video connection. The transition from in-person to virtual delivery changes the scope of behavioral observation available — in an in-person setting, gait, full-body posture, and hygiene indicators detected by presence in the room are all available to the clinician; in a standard video session, observation is typically limited to the face and upper torso, constrained by camera angle, lighting, and screen resolution. This is not a reason to avoid teletherapy, but it is a reason for a Louisiana licensee's suitability screening, discussed earlier in this section, to weigh clinical presentation against what the virtual medium can and cannot adequately capture, and to document explicitly where the medium's limitations affected what could be assessed in a given session.</p>
<p>Standardized, self-report screening instruments — depression, anxiety, and trauma-symptom measures a client completes independently — generally translate to electronic administration without significant validity concerns, provided administration occurs through a secure, HIPAA-compliant channel consistent with Section 2's technology standards, and results are integrated into the clinical record with the same rigor as any other assessment data. Clinician-administered assessments involving specific stimuli, timing requirements, or behavioral-observation components may require more substantial adaptation; where a licensee modifies a standardized instrument's administration procedure for teletherapy delivery, that modification should be documented, with any potential impact on the instrument's validity acknowledged in the interpretation of results — the same documentation discipline §505 already requires for records generally.</p>
<h2>Crisis and Emergency Management Through a Screen</h2>
<p>The sixth §505 initial-training topic area, managing emergencies, deserves particular attention because it is the topic area with the highest stakes if a licensee is unprepared. When a client in acute distress is separated from the licensee by miles rather than a hallway, the licensee's ability to intervene directly is fundamentally constrained — there is no ability to physically accompany the client to an emergency department or remove means of self-harm from the client's immediate environment. Effective teletherapy crisis preparation is therefore front-loaded rather than improvised in the moment: verifying the client's physical location at the start of every session (connecting directly to the client-location documentation practice from Section 4); maintaining current emergency-contact information and the address/phone number of the nearest emergency department for the client's actual location, which may change if the client is temporarily out of state; and having a clear internal protocol, developed and rehearsed in advance, for what the licensee will do if a client discloses imminent risk during a virtual session, including how to coordinate emergency response with a location the licensee cannot see or physically reach.</p>
<p>A well-constructed teletherapy safety plan — developed collaboratively with the client, ideally using screen-sharing so the client can see the plan take shape rather than simply being told what it will contain — should include the client's identified warning signs, internal coping strategies, social contacts who provide distraction and support, and specific means-restriction steps appropriate to the client's home environment, recognizing that the licensee cannot directly observe or assist with implementing those steps the way an in-person clinician might. The completed plan should be transmitted to the client through a secure channel at the session's conclusion and documented in the clinical record alongside the crisis-related portion of the session note, consistent with the equal-to-in-person documentation standard §505 requires generally.</p>
<blockquote><p><strong>Clinical Vignette:</strong> During a teletherapy session, a Louisiana LPC's client — whom the licensee had confirmed at session start was physically located at her usual residence — disclosed escalating suicidal ideation with access to a firearm in the home. Because the licensee had verified the client's location at the outset and already had current emergency-contact and local emergency-department information on file for that residence from the client's most recent suitability-screening update, she was able to move immediately into her rehearsed crisis protocol: engaging the client in a means-restriction conversation, contacting the identified emergency contact with the client's cooperation, and coordinating with local emergency services for the client's confirmed physical address — rather than losing critical time discovering, mid-crisis, that her location and emergency-contact information were outdated.</p></blockquote>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each requirement into the correct §505 clinical/operational category.",
      categories: ["Suitability Screening", "Informed Consent", "Records Standards", "Telesupervision"],
      cards: [
        { id: "la-clin-1", text: "Affirm the client can be properly diagnosed and treated via teletherapy, including appropriateness for sensory deficits", correctCategory: "Suitability Screening" },
        { id: "la-clin-2", text: "Dismiss and treat in person and/or terminate with appropriate referrals if the client cannot be properly served", correctCategory: "Suitability Screening" },
        { id: "la-clin-3", text: "Obtain consent verbal and/or written, documented in the record; electronic signatures permitted", correctCategory: "Informed Consent" },
        { id: "la-clin-4", text: "Inform clients how records are maintained, including encryption/security type and archival duration", correctCategory: "Records Standards" },
        { id: "la-clin-5", text: "Documentation, maintenance, access, transmission, and destruction standards equal to in-person records", correctCategory: "Records Standards" },
        { id: "la-clin-6", text: "100 percent of total supervision hours may be delivered via synchronous video/audio telesupervision", correctCategory: "Telesupervision" },
      ],
      explanation: "§505 organizes distinct clinical/operational obligations across suitability screening, informed consent, records standards, and telesupervision — each with its own specific requirements.",
    },
    {
      type: "text",
      content: `<h2>Cultural and Linguistic Considerations Within Suitability Screening</h2>
<p>§505's suitability-screening requirement, discussed earlier in this section, focuses explicitly on sensory deficits as a named accommodation category, but the underlying "can this client be properly served via teletherapy" question extends naturally to cultural and linguistic considerations as well, particularly given Louisiana's demographic diversity, including its historically significant French- and Creole-speaking populations in parts of Acadiana and Southeast Louisiana. A client whose primary language is not English, or whose cultural background shapes expectations about mental health treatment and the therapeutic relationship in ways that differ from the licensee's own frame of reference, presents suitability considerations that belong in the same clinical-appropriateness domain as sensory deficits — not because the rule names language or culture explicitly, but because both raise the same underlying question of whether this client, through this modality, can be properly served.</p>
<p>Practical accommodation strategies include working with a qualified interpreter integrated into the teletherapy platform (verified, consistent with Section 2's technology standards, to itself meet HIPAA/HITECH requirements if the interpretation service handles PHI), adjusting session structure to accommodate cultural communication norms that may not translate naturally to a video format, and being attentive to whether cultural stigma around mental health treatment interacts with the added visibility or perceived formality of a video connection in ways that differ from an in-person office visit. As with sensory-deficit accommodation, the standard is to explore reasonable accommodation first, and to document the suitability determination — including cultural and linguistic factors considered — with the same rigor §505 requires for the suitability assessment generally.</p>`,
    },
    {
      type: "callout",
      calloutType: "key",
      title: "Telesupervision Under §505.K: No Percentage Cap",
      content: "<p>Louisiana permits 100 percent of total supervision hours to be delivered via telesupervision, using synchronous video and audio — unlike many states that cap the proportion of supervision hours that may occur virtually. The modality must still be synchronous and otherwise meet the Board's general supervision standards; there is simply no numeric ceiling on how much of the total may be delivered this way.</p>",
    },
    {
      type: "resources",
      title: "Practice Templates — Louisiana Teletherapy Approval",
      description: "Downloadable worksheets to support Louisiana §505-compliant teletherapy approval and multi-state practice.",
      resources: [
        {
          title: "Teletherapy Declaration/Informed Consent Addendum Checklist — §505.F(a)–(k)",
          url: "/downloads/CR-TMH604-LA_Teletherapy_Declaration_Checklist.docx",
          type: "worksheet",
          description: "Item-by-item worksheet for drafting the Declaration/Statement of Practice addendum required for Board approval, including the CEH dashboard upload step and the monthly-review/do-not-practice-until-approved timing caution. Human legal/compliance review required before submission.",
        },
        {
          title: "Out-of-State Client Compliance Log — §505.D Contact-and-Document Worksheet",
          url: "/downloads/CR-TMH604-LA_OutOfState_Client_Compliance_Log.docx",
          type: "worksheet",
          description: "Structured log for documenting the client's state, the board contacted, the date, the relevant regulations documented, and the authorization status for each out-of-state teletherapy client.",
        },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 5 Key Takeaways",
      content: "<p>§505's clinical/operational requirements — suitability screening with a mandatory dismiss-and-refer consequence, informed consent with permitted e-signatures, records standards equal to in-person practice, the social media exclusion, and uncapped telesupervision — are the substance of ongoing compliance for an approved Louisiana teletherapy licensee. None of these are optional refinements; each is a specific, affirmative rule requirement with a documented compliance expectation.</p>",
      items: [
        "Suitability screening must affirmatively address sensory deficits and require dismiss-and-refer when a client cannot be properly served",
        "Records standards must equal in-person standards across documentation, maintenance, access, transmission, and destruction",
        "Telesupervision may satisfy 100 percent of supervision hours — a genuine differentiator from many other states' percentage caps",
      ],
    },
    {
      type: "reflection",
      question: "Does your current teletherapy informed consent process document verbal and/or written consent, with a clear record of when it occurred? If you supervise or are supervised via telehealth, does that arrangement rely on §505.K's uncapped telesupervision allowance, and is it structured as synchronous video/audio?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under §505, what must a licensee do if a suitability screening determines a client cannot be properly served via teletherapy?",
      options: [
        { text: "Continue teletherapy but document the limitation", isCorrect: false },
        { text: "Dismiss and treat the client in person and/or terminate with appropriate referrals", isCorrect: true },
        { text: "Refer the client to a different teletherapy platform", isCorrect: false },
        { text: "No specific action is required beyond documentation", isCorrect: false },
      ],
      explanation: "§505 requires that a client who cannot be properly served via teletherapy be dismissed and treated in person and/or terminated with appropriate referrals.",
    },
    {
      type: "multipleChoice",
      question: "Under §505, informed consent for teletherapy must be:",
      options: [
        { text: "Written only, with wet-ink signature required", isCorrect: false },
        { text: "Verbal and/or written, documented in the record, with electronic signatures permitted", isCorrect: true },
        { text: "Obtained only once, at the time of initial licensure", isCorrect: false },
        { text: "Not required if the client has previously received in-person services", isCorrect: false },
      ],
      explanation: "§505 permits verbal and/or written informed consent, documented in the client's record, with electronic signatures explicitly permitted.",
    },
    {
      type: "multipleChoice",
      question: "What proportion of total clinical supervision hours may be delivered via telesupervision under §505.K?",
      options: [
        { text: "Up to 50 percent, with the remainder required in person", isCorrect: false },
        { text: "Up to 75 percent", isCorrect: false },
        { text: "100 percent, provided sessions are synchronous video and audio", isCorrect: true },
        { text: "Telesupervision is not permitted under Louisiana rules", isCorrect: false },
      ],
      explanation: "§505.K permits 100 percent of total supervision hours to be delivered via synchronous video/audio telesupervision — no percentage cap requiring in-person hours.",
    },
    {
      type: "multipleChoice",
      question: "§505's records-disclosure requirement obligates a licensee to inform clients about all of the following EXCEPT:",
      options: [
        { text: "How records are maintained", isCorrect: false },
        { text: "The type of encryption or security used", isCorrect: false },
        { text: "The duration of archival storage", isCorrect: false },
        { text: "The specific salary of the licensee's IT support staff", isCorrect: true },
      ],
      explanation: "§505 requires disclosure of how records are maintained, the encryption/security type, and archival duration — not unrelated business details like staff compensation.",
    },
  ],
};

// ═══ FINAL ASSESSMENT QUESTIONS ═══
const ASSESSMENT_QUESTIONS = [
  {
    question: "According to the Louisiana LPC Board's own FAQ, teletherapy is best described as:",
    options: [
      { text: "The same style of credential as the Board's separate Appraisal credentialing framework", isCorrect: false },
      { text: "A Specialty Area/Area of Expertise that requires Board approval", isCorrect: true },
      { text: "An automatic extension of any active LPC, PLPC, or LMFT license", isCorrect: false },
      { text: "A federal credential administered by NBCC, not the Louisiana Board", isCorrect: false },
    ],
    explanation: "The Board's FAQ explicitly distinguishes teletherapy from that older credentialing label — it is a Specialty Area/Area of Expertise that does require Board approval.",
  },
  {
    question: "The phrase \"licensees privileged in teletherapy\" is:",
    options: [
      { text: "The Board's current, preferred term for the credential", isCorrect: false },
      { text: "Legacy language in §505.E's own rule text, referring to the same status the FAQ calls a specialty area", isCorrect: true },
      { text: "A phrase found only in out-of-state secondary sources, not any Louisiana source", isCorrect: false },
      { text: "The statutory term used in R.S. 37:1101", isCorrect: false },
    ],
    explanation: "§505.E's own rule text retains the legacy \"privileged in teletherapy\" phrasing, describing the same approval status the Board's current FAQ calls a specialty area.",
  },
  {
    question: "Which statutes provide the Board's underlying rulemaking authority for LAC 46:LX.505?",
    options: [
      { text: "R.S. 37:1101 and R.S. 37:1116", isCorrect: true },
      { text: "Only federal HIPAA statutes", isCorrect: false },
      { text: "The NBCC ACEP accreditation standards", isCorrect: false },
      { text: "Louisiana's telehealth parity statute for physicians", isCorrect: false },
    ],
    explanation: "R.S. 37:1101 and R.S. 37:1116, part of the broader R.S. 37:1101–1123 licensure statute, provide the Board's rulemaking authority.",
  },
  {
    question: "§505 names which two federal frameworks directly as a technology-compliance requirement?",
    options: [
      { text: "HIPAA and HITECH", isCorrect: true },
      { text: "FERPA and COPPA", isCorrect: false },
      { text: "SOC 2 and ISO 27001", isCorrect: false },
      { text: "GDPR and CCPA", isCorrect: false },
    ],
    explanation: "§505 explicitly requires technology used for teletherapy to comply with HIPAA and HITECH standards.",
  },
  {
    question: "Under §505, which of the following is categorically prohibited for teletherapy delivery?",
    options: [
      { text: "A HIPAA-compliant videoconferencing platform", isCorrect: false },
      { text: "Social media platforms and functions (tweets, blogs, networking sites)", isCorrect: true },
      { text: "An encrypted secure client portal", isCorrect: false },
      { text: "A BAA-covered EHR system", isCorrect: false },
    ],
    explanation: "§505 categorically excludes social media platforms and functions from teletherapy delivery and prohibits referencing clients on such formats.",
  },
  {
    question: "What is the minimum initial-training requirement to pursue Louisiana teletherapy approval?",
    options: [
      { text: "One clock hour, synchronous only", isCorrect: false },
      { text: "Three clock hours, synchronous or asynchronous, covering eight specified topic areas", isCorrect: true },
      { text: "Ten clock hours over a full CE renewal cycle", isCorrect: false },
      { text: "No formal training is required, only the Declaration addendum", isCorrect: false },
    ],
    explanation: "The Board's FAQ specifies a minimum of three clock hours of initial training, covering the eight §505-specified topic areas.",
  },
  {
    question: "After completing initial training, what must a licensee do with the certificate of completion?",
    options: [
      { text: "Nothing — the training provider notifies the Board automatically", isCorrect: false },
      { text: "Upload it to the CEH tab of their Board dashboard", isCorrect: true },
      { text: "Mail a paper copy to the Board office only", isCorrect: false },
      { text: "Submit it only if audited", isCorrect: false },
    ],
    explanation: "The certificate of completion must be uploaded to the CEH tab of the licensee's Board dashboard.",
  },
  {
    question: "How often does Board staff review teletherapy approval submissions?",
    options: [
      { text: "Same-day", isCorrect: false },
      { text: "Weekly", isCorrect: false },
      { text: "Monthly", isCorrect: true },
      { text: "Only quarterly, at Board meetings", isCorrect: false },
    ],
    explanation: "Board staff review submissions on a monthly cycle — licensees should plan their timeline accordingly.",
  },
  {
    question: "A licensee has submitted all required approval materials but has not yet received confirmation of Board approval. She should:",
    options: [
      { text: "Begin providing teletherapy immediately, since both required documents are submitted", isCorrect: false },
      { text: "Wait until approval is actually granted before providing teletherapy", isCorrect: true },
      { text: "Provide teletherapy only to established clients while waiting", isCorrect: false },
      { text: "Provide teletherapy for up to 30 days while the review is pending", isCorrect: false },
    ],
    explanation: "The Board's guidance is that a licensee should not provide teletherapy until approval is actually granted.",
  },
  {
    question: "The recurring teletherapy CE requirement under §505.E is:",
    options: [
      { text: "3 clock hours, one time only, identical to the initial-training requirement", isCorrect: false },
      { text: "3 clock hours every renewal period (Louisiana's LPC renewal period is 2 years)", isCorrect: true },
      { text: "6 clock hours every renewal period", isCorrect: false },
      { text: "No recurring requirement applies once initial approval is granted", isCorrect: false },
    ],
    explanation: "§505.E requires 3 clock hours of teletherapy CE during each 2-year renewal period, separate from the one-time initial training.",
  },
  {
    question: "How does an out-of-state clinician become authorized to provide teletherapy to a Louisiana-located client?",
    options: [
      { text: "Full reciprocal Louisiana licensure is required — no other pathway exists", isCorrect: false },
      { text: "Registering with the Louisiana LPC Board, meeting all §505 requirements, and having Board-approved training", isCorrect: true },
      { text: "Simply disclosing their home-state license to the client is sufficient", isCorrect: false },
      { text: "No mechanism exists for out-of-state clinicians in Louisiana", isCorrect: false },
    ],
    explanation: "An out-of-state clinician may provide teletherapy to a Louisiana-located client by registering with the Board and meeting all §505 requirements — registration, not full reciprocal licensure.",
  },
  {
    question: "Under §505.D, when a Louisiana licensee's client is physically located in another state during a session, the licensee must:",
    options: [
      { text: "Do nothing differently, since the licensee's Louisiana license governs regardless of client location", isCorrect: false },
      { text: "Contact the licensing board in the client's state and document all relevant teletherapy regulations", isCorrect: true },
      { text: "Terminate services immediately", isCorrect: false },
      { text: "Only document the client's location, with no obligation to contact the other state's board", isCorrect: false },
    ],
    explanation: "§505.D requires the licensee to contact the licensing board in the client's state and document all relevant teletherapy regulations.",
  },
  {
    question: "How does LAC 46:LX.503's definition of \"Licensure\" reconcile with §505.D's requirement that a provider \"must be licensed by the board\"?",
    options: [
      { text: "It doesn't — the two provisions genuinely conflict and remain unresolved", isCorrect: false },
      { text: "§503 defines \"Licensure\" broadly to include any license, certification, or registration approved by the board", isCorrect: true },
      { text: "§505.D's licensure requirement only applies to Louisiana residents, not out-of-state registrants", isCorrect: false },
      { text: "The registration pathway is a court-created exception, not a Board rule", isCorrect: false },
    ],
    explanation: "§503's broad \"Licensure\" definition, which includes Board-approved registration, is what reconciles the registration pathway with §505.D's licensure language.",
  },
  {
    question: "Under §505, what must a licensee do if a suitability screening determines a client cannot be properly served via teletherapy?",
    options: [
      { text: "Continue teletherapy but document the limitation", isCorrect: false },
      { text: "Dismiss and treat the client in person and/or terminate with appropriate referrals", isCorrect: true },
      { text: "Refer the client to a different teletherapy platform", isCorrect: false },
      { text: "No specific action is required beyond documentation", isCorrect: false },
    ],
    explanation: "§505 requires that a client who cannot be properly served via teletherapy be dismissed and treated in person and/or terminated with appropriate referrals.",
  },
  {
    question: "Under §505, informed consent for teletherapy must be:",
    options: [
      { text: "Written only, with wet-ink signature required", isCorrect: false },
      { text: "Verbal and/or written, documented in the record, with electronic signatures permitted", isCorrect: true },
      { text: "Obtained only once, at the time of initial licensure", isCorrect: false },
      { text: "Not required if the client has previously received in-person services", isCorrect: false },
    ],
    explanation: "§505 permits verbal and/or written informed consent, documented in the client's record, with electronic signatures explicitly permitted.",
  },
  {
    question: "What proportion of total clinical supervision hours may be delivered via telesupervision under §505.K?",
    options: [
      { text: "Up to 50 percent, with the remainder required in person", isCorrect: false },
      { text: "Up to 75 percent", isCorrect: false },
      { text: "100 percent, provided sessions are synchronous video and audio", isCorrect: true },
      { text: "Telesupervision is not permitted under Louisiana rules", isCorrect: false },
    ],
    explanation: "§505.K permits 100 percent of total supervision hours to be delivered via synchronous video/audio telesupervision.",
  },
  {
    question: "May a Louisiana provisional licensee (PLPC) pursue teletherapy approval?",
    options: [
      { text: "No — only fully licensed LPCs may pursue teletherapy approval", isCorrect: false },
      { text: "Yes, per the Board's current FAQ position, provided §505's requirements are met", isCorrect: true },
      { text: "Only with special legislative approval", isCorrect: false },
      { text: "Only if the PLPC has completed 100% of supervision hours in person", isCorrect: false },
    ],
    explanation: "The Board's FAQ confirms that licensed or provisionally licensed individuals may provide teletherapy if §505's requirements are met, and provides PLPC-specific submission instructions.",
  },
  {
    question: "What was §505's numbering slot formerly used for, per the rule's own title parenthetical?",
    options: [
      { text: "\"Diagnosing for Serious Mental Illnesses\"", isCorrect: true },
      { text: "\"Appraisal Credentialing Requirements\"", isCorrect: false },
      { text: "\"Continuing Education Requirements\"", isCorrect: false },
      { text: "\"Supervision Standards for Provisional Licensees\"", isCorrect: false },
    ],
    explanation: "LAC 46:LX.505's title carries the parenthetical \"(Formerly Diagnosing for Serious Mental Illnesses),\" reflecting the numbering slot's regulatory history.",
  },
];

// ═══ REFERENCES ═══
const REFERENCES = [
  { title: "Teletherapy Guidelines for Licensees", author: "Louisiana Board of Examiners of Licensed Professional Counselors", year: 2020, source: "LAC 46:LX.505 (Louisiana Administrative Code, via Cornell LII)" },
  { title: "Definitions", author: "Louisiana Board of Examiners of Licensed Professional Counselors", year: 2020, source: "LAC 46:LX.503 (Louisiana Administrative Code)" },
  { title: "Licensed Professional Counselors", author: "Louisiana Legislature", year: 2024, source: "La. Rev. Stat. §37:1101–1123, esp. §37:1101 & §37:1116" },
  { title: "Frequently Asked Questions — Teletherapy", author: "Louisiana LPC Board of Examiners", year: 2026, source: "lpcboard.org/page/frequently-asked-questions" },
  { title: "Rules — Professional Counselors", author: "Louisiana Register", year: 2020, source: "Louisiana Register, Vol. 46, No. 12 (December 20, 2020)" },
  { title: "A non-inferiority trial of prolonged exposure for PTSD: In person versus home-based telehealth", author: "Acierno, R., Knapp, R., Tuerk, P., et al.", year: 2017, source: "Behaviour Research and Therapy, 89, 57-65" },
  { title: "ACA code of ethics", author: "American Counseling Association", year: 2014, source: "Author" },
  { title: "Are videoconferenced mental and behavioral health services just as good as in-person?", author: "Batastini, A. B., Paprzycki, P., Jones, A. C. T., & MacLean, N.", year: 2021, source: "Clinical Psychology Review, 83, 101944" },
  { title: "Telepsychiatry: Psychiatric consultation by interactive television", author: "Dwyer, T. F.", year: 1973, source: "American Journal of Psychiatry, 130(8), 865-869" },
  { title: "The effectiveness of telemental health: A 2013 review", author: "Hilty, D. M., Ferrer, D. C., Parish, M. B., et al.", year: 2013, source: "Telemedicine and e-Health, 19(6), 444-454" },
  { title: "Two-way television in group therapy", author: "Wittson, C. L., Affleck, D. C., & Johnson, V.", year: 1961, source: "Mental Hospitals, 12(11), 22-23" },
  { title: "Notification of Enforcement Discretion for Telehealth Remote Communications", author: "U.S. Department of Health and Human Services, Office for Civil Rights", year: 2020, source: "HHS.gov" },
  { title: "Health Information Technology for Economic and Clinical Health (HITECH) Act", author: "U.S. Congress", year: 2009, source: "Pub. L. 111-5, Title XIII" },
];

// ═══ COURSE DATA ═══
const COURSE_DATA = {
  slug: "teletherapy-specialty-approval-la-505",
  title: "Teletherapy Specialty Approval for Louisiana Licensees",
  subtitle: "LAC 46:LX.505 • Louisiana Teletherapy Specialty Area CE",
  description: "This 3-hour continuing education course provides Louisiana-licensed counselors and marriage and family therapists with the knowledge needed to pursue and maintain teletherapy specialty-area approval under LAC 46:LX.505. Covers the four-step Board approval pathway, HIPAA/HITECH technology compliance, the two separate 3-hour requirements (one-time initial training vs. recurring renewal CE), the confirmed out-of-state registration pathway, the §505.D out-of-state client contact-and-document duty, and §505's clinical/operational standards including suitability screening, informed consent, records, and telesupervision.",
  courseCode: "CR-TMH604-LA",
  instructor: "GA Integrated Therapeutic Perspectives LLC",

  ceHours: 3,
  ceuHours: 3,
  ceCategory: "Telehealth",
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  ceProvider: "NBCC ACEP #7760",
  acepNumber: "7760",
  approvalBody: "NBCC",

  approvals: [
    {
      body: "NBCC",
      providerNumber: "7760",
      providerName: "GA Integrated Therapeutic Perspectives LLC",
      status: "approved",
      hourBreakdown: [{ label: "core", hours: 3 }],
    },
  ],

  accessType: "paid",
  pricingTier: "standard",

  status: "draft",
  isPublished: false,

  objectives: [
    "Distinguish the Louisiana LPC Board's current 'specialty area requiring Board approval' terminology from §505.E's legacy 'privileged in teletherapy' rule language, and describe the four-step approval pathway under LAC 46:LX.505.",
    "Evaluate teletherapy technology against LAC 46:LX.505's explicit HIPAA/HITECH compliance requirement and its categorical exclusion of social media platforms and functions from teletherapy delivery.",
    "Apply the eight §505-specified initial-training topic areas and complete the four approval steps: initial training, CEH dashboard certificate upload, Declaration/Informed Consent addendum submission, and awaiting monthly Board review.",
    "Disambiguate Louisiana's two separate 3-hour teletherapy requirements — the one-time initial training and the recurring per-renewal continuing education under §505.E — and apply the confirmed out-of-state registration pathway and §505.D out-of-state client contact-and-document duty.",
    "Apply §505's suitability-screening standard, including its sensory-deficit and dismiss-and-refer requirements, alongside its informed consent, records, and uncapped telesupervision standards.",
    "Identify how LAC 46:LX.503's broad 'Licensure' definition reconciles §505.D's licensure language with the out-of-state registration pathway, and how current Board FAQ guidance supersedes legacy §503 provisional-licensee language.",
  ],

  targetAudience: [
    "Licensed Professional Counselors (LPC)",
    "Provisional Licensed Professional Counselors (PLPC)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "National Certified Counselors (NCC)",
    "Out-of-state clinicians pursuing Louisiana teletherapy registration",
  ],

  instructionalLevel: "Intermediate",

  categories: ["Telehealth", "Louisiana Requirements", "Professional Practice", "Clinical Skills"],
  tags: ["teletherapy", "Louisiana", "LAC 46:LX.505", "specialty approval", "HIPAA", "HITECH", "informed consent", "suitability screening", "out-of-state registration", "telesupervision"],

  sections: [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5],

  assessment: {
    title: "Final Assessment: Teletherapy Specialty Approval for Louisiana Licensees",
    passingScore: 80,
    maxAttempts: 3,
    instructions: "This assessment evaluates your understanding of Louisiana's teletherapy specialty-area approval pathway, HIPAA/HITECH technology compliance, the two separate 3-hour CE requirements, multi-state practice rules, and §505's clinical/operational standards. You must score 80% or higher to receive CE credit. You have a maximum of 3 attempts.",
    questions: ASSESSMENT_QUESTIONS,
  },

  references: REFERENCES,

  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    degree: "MA",
    licenseNumber: "LPC009587",
    licenseState: "Georgia",
    licenseType: "LPC",
    category: "category1",
  },

  settings: {
    linearProgression: true,
    enforceMinTime: false,
    narrationEnabled: false,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true,
    allowRetake: true,
    retakeCooldownDays: 0,
  },

  createdAt: new Date(),
  updatedAt: new Date(),
};

// ═══ SEED FUNCTION (idempotent by slug) ═══
async function main() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  const collection = db.collection("interactivecourses");

  const existing = await collection.findOne({ slug: COURSE_DATA.slug });

  if (existing) {
    await collection.updateOne(
      { slug: COURSE_DATA.slug },
      { $set: { ...COURSE_DATA, updatedAt: new Date() } }
    );
    console.log(`✅ Updated: ${COURSE_DATA.title}`);
  } else {
    await collection.insertOne(COURSE_DATA);
    console.log(`✅ Created: ${COURSE_DATA.title}`);
  }

  const totalQuestions = COURSE_DATA.assessment.questions.length;
  const totalSections = COURSE_DATA.sections.length;
  const totalRefs = COURSE_DATA.references.length;

  console.log("\n📊 Course Statistics:");
  console.log(`   Title: ${COURSE_DATA.title}`);
  console.log(`   Code: ${COURSE_DATA.courseCode}`);
  console.log(`   CE Hours: ${COURSE_DATA.ceHours}`);
  console.log(`   Sections: ${totalSections}`);
  console.log(`   Assessment: ${totalQuestions} questions (80% pass, 3 attempts)`);
  console.log(`   References: ${totalRefs} (APA 7th Edition)`);
  console.log(`   Status: ${COURSE_DATA.status}`);
  console.log(`   Slug: ${COURSE_DATA.slug}`);
  console.log("\n⚠️  DRAFT — human review required before publish, per standard platform policy.");
  console.log("\n📁 DEPLOY WORKSHEETS (follow-up commit, after render checks):");
  console.log("   Copy these files to client/public/downloads/ in your GitHub repo:");
  console.log("   - CR-TMH604-LA_Teletherapy_Declaration_Checklist.docx");
  console.log("   - CR-TMH604-LA_OutOfState_Client_Compliance_Log.docx");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
