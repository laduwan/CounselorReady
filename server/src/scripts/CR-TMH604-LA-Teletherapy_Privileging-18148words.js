/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// CR-TMH604-LA-Teletherapy_Privileging-18148words.js
// Seed script for CounselorReady interactivecourses collection.
// ADDITIVE ONLY — derived from CR-TMH601 (server/src/scripts/seedCR-TMH601-Batch1-Sections1to4.js
// and seedCR-TMH601-Batch2to4-Sections5to13.js), which hold TMH601's real learner-visible prose,
// and follows the shipped pattern of CR-TMH602-TX-Technology_Assisted_Services-12000words.js and
// CR-TMH603-FL-Telehealth-18000words.js.
// Does NOT modify CR-TMH601, CR-TMH602-TX, CR-TMH603-FL, their slugs, or their templates.
// Deploy: node server/src/scripts/CR-TMH604-LA-Teletherapy_Privileging-18148words.js
// Requires: MONGODB_URI environment variable
//
// ─────────────────────────────────────────────────────────────────────────────
// REGULATORY VERIFICATION STATUS (read before publishing)
// Primary-source verification of LAC Title 46, Part LX, Chapter 5, §505 was NOT
// performed directly against the Louisiana Administrative Code or lpcboard.org's
// live rule text. Findings below are corroborated via secondary sources
// (Telehealth Certification Institute summaries, the Louisiana LPC Board's own
// FAQ page, a Louisiana Register notice of intent, and a rules PDF mirror) but
// were NOT read from the authoritative LAC source in a verified session. Human
// legal/compliance review against the live Board Rules is REQUIRED before
// publish. Flagged with [VERIFY] inline wherever an exact subsection letter,
// figure, timeline, or scope claim could not be pinned to primary text:
//   - Chapter 5, §505 "Teletherapy Guidelines for Licensees": an initial 3-clock-
//     hour training requirement (synchronous or asynchronous), covering topics
//     specified in §505.F, precedes filing a Declaration/Informed Consent for
//     Teletherapy Services addendum with the Board. This course presents a
//     partial list of §505.F content elements drawn from the LPC Board's FAQ
//     page; [VERIFY the FULL, exact enumeration of §505.F sub-items against
//     primary LAC text before treating the list in Section 3 as authoritative
//     or complete].
//   - Board review timeline for the Declaration/Informed Consent addendum: the
//     LPC Board's FAQ page suggests a monthly batch review cadence; [VERIFY this
//     timeline, and whether it has changed, against current Board practice].
//   - 3 CEH-per-renewal teletherapy maintenance requirement: corroborated
//     consistently across the LPC Board's own CEH overview materials and
//     third-party CE providers, but license-type-specific citations diverge in
//     secondary sources — §707 for LPC, §3503 for LMFT, §611 for PLPC, §3315 for
//     PLMFT. [VERIFY each citation against primary text and confirm the
//     requirement's effective date and whether it applies identically to
//     LPC-S and LMFT-S supervisory designations before publish].
//   - Nonresident-into-Louisiana pathway: no registration-only pathway
//     analogous to Florida's §456.47 out-of-state-registration provision was
//     found in the search used to scope this course. This is a NEGATIVE claim
//     (absence of a pathway) and negative claims require primary-source
//     confirmation, not merely absence from secondary sources — [VERIFY this
//     absence directly against LAC Title 46, Part LX and Louisiana Revised
//     Statutes Title 37 before treating "no such pathway exists" as settled].
//   - Louisiana Counseling Compact status: [VERIFY current enactment and
//     operational status at build time — compact status changes year to year,
//     and the same caution applied in the CR-TMH602-TX seed's Compact note
//     applies equally here].
// ─────────────────────────────────────────────────────────────────────────────
//
// SECTION BANNER KEYWORDS (Pexels) — for the course-builder's banner button.
// bannerImage is intentionally left unset below; a human uses the builder's
// Pexels banner button with these keywords after import.
//   Section 1: "louisiana state capitol counseling"
//   Section 2: "clinician filing paperwork document"
//   Section 3: "informed consent form signature client"
//   Section 4: "state border map telehealth jurisdiction"
//   Section 5: "continuing education certificate checklist"

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ No MONGODB_URI environment variable set");
  process.exit(1);
}

// ═══ SECTION 1: Foundations — Louisiana's Board-Approved Privileging Model ═══
const SECTION_1 = {
  title: "Foundations of Teletherapy Privileging in Louisiana",
  order: 1,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 1,
      title: "Section 1",
      subtitle: "Foundations of Teletherapy Privileging in Louisiana",
      bannerAlt: "Clinician reviewing Louisiana licensing board requirements before beginning a teletherapy session",
    },
    {
      type: "text",
      content: `<h2>What "Teletherapy Privileging" Means</h2>
<p>Most states that regulate telehealth for licensed counselors do so by attaching conditions to the license the clinician already holds: complete a specified number of continuing education hours, obtain informed consent that discloses the risks of remote delivery, and the clinician is authorized to proceed. Louisiana does something structurally different. Under LAC Title 46, Part LX, Chapter 5, §505 ("Teletherapy Guidelines for Licensees"), teletherapy is treated as a board-recognized specialty area of practice that a Louisiana Licensed Professional Counselor (LPC), Licensed Marriage and Family Therapist (LMFT), or their provisional-license counterparts must be affirmatively approved to provide. Holding an unencumbered LPC or LMFT license does not, by itself, authorize a clinician to deliver teletherapy in Louisiana. The clinician must complete an initial training requirement and then file a specific document — a Declaration/Informed Consent for Teletherapy Services addendum — with the Louisiana Licensed Professional Counselors Board of Examiners before providing teletherapy services legally. <em>[VERIFY the current Board review timeline for this filing — the Board's FAQ page suggests monthly batch review, but this course was not built against a verified real-time confirmation of that cadence.]</em></p>
<p>This distinction matters more than it might first appear. In a continuing-education model — the kind Georgia uses under Rule 135-11, and the kind this course's companion Texas and Florida seeds describe — a clinician who has not yet completed the required hours is, at worst, out of compliance with a CE mandate. The remedy is straightforward: complete the hours, document them, and the compliance gap closes. Louisiana's privileging model creates a different category of risk. A Louisiana clinician who provides teletherapy without having completed the initial training and filed the Declaration/Informed Consent addendum is not merely behind on a CE requirement — they are practicing outside the scope of what their license currently authorizes them to do. That framing, "out of scope of license," carries different disciplinary and liability implications than a CE deficiency, and it is the single most important distinction this course asks Louisiana clinicians to internalize before anything else.</p>
<p>If you completed CounselorReady's foundational telemental health course (CR-TMH601), you already have a mental model for what a state-level teletherapy rule can require, because Georgia's Rule 135-11 is itself unusually demanding compared to most states: 6 hours of telehealth-specific continuing education within the preceding 5 years, both verbal AND written informed consent documented in the client record, disclosure of third-party vendors with access to client information, and a suitability assessment before beginning teletherapy with a given client. It would be reasonable to assume that Louisiana's model is simply a variation on that same theme — more hours, stricter consent, but still fundamentally a CE-plus-consent framework layered on top of an already-valid license. That assumption would be incorrect, and the difference is the reason this course exists as a separate build rather than a state-adapted copy of the Georgia content. Georgia's Rule 135-11 asks: has this clinician done enough training and disclosed enough to the client? Louisiana's §505 asks a prior question: has this clinician been affirmatively privileged, by the Board, to provide this specific service at all? A Georgia clinician who has not completed the 6-hour requirement is not providing teletherapy correctly. A Louisiana clinician who has not filed the Declaration/Informed Consent addendum is not authorized to provide teletherapy, correctly or otherwise.</p>
<h2>Why a Privileging Model Instead of a CE-Only Model</h2>
<p>The privileging structure reflects a specific regulatory philosophy: that teletherapy is not simply "counseling delivered through a screen" but a distinct clinical and administrative competency requiring its own gatekeeping step, comparable in structure (though not scope) to how some boards handle other specialty designations, such as supervisory credentials. The initial training requirement exists to ensure a baseline of teletherapy-specific knowledge before a clinician begins practicing the modality; the Declaration/Informed Consent addendum filing exists to give the Board an administrative record of which licensees are currently authorized to provide teletherapy, and to make clear to the licensee, in writing, exactly what informed-consent obligations attach to that authorization going forward. Together, these two steps convert "I completed some telehealth training" into "the Board has recorded that I am privileged to provide teletherapy, and I have attested in writing to specific ongoing informed-consent obligations."</p>
<p>This course's central organizing distinction — one that recurs throughout every section — is between two numbers that are both commonly reported as "3 hours" in secondary sources, and that a licensee who conflates them can genuinely get wrong. The <strong>initial training requirement</strong> is a minimum of 3 clock hours, completed once, before a licensee files for teletherapy privileging for the first time. The <strong>ongoing maintenance requirement</strong> is 3 continuing education hours (CEH) per renewal period, completed repeatedly, to retain teletherapy privileging status once granted. These are legally distinct obligations that happen to share the same numeral. A licensee who completes the initial 3-clock-hour training once and never again addresses teletherapy-specific CE has satisfied the entry requirement but not the maintenance requirement — and, depending on how the Board treats lapsed maintenance CE, may be at risk of losing privileged status even though they remember "doing the 3 hours." Section 2 of this course addresses the initial training and filing process in detail; Section 5 addresses the ongoing 3-CEH maintenance requirement and its interaction with a licensee's general CE obligation. Every subsequent reference to "3 hours" in this course will specify which of the two it means, and this course asks you to adopt the same discipline in your own recordkeeping.</p>
<h2>Terminology: "Telehealth," "Telemental Health," and Louisiana's Choice of "Teletherapy"</h2>
<p>It is worth pausing on Louisiana's specific choice of the term "teletherapy" in §505's title, since the broader professional literature uses several overlapping terms that a Louisiana licensee should be able to place correctly relative to the Board's own terminology. Telemental health is the broadest umbrella term, encompassing the delivery of mental health services through any telecommunications technology — synchronous video, telephone, asynchronous text-based intervention, and technology-assisted therapeutic tools alike. Telehealth is a similarly broad term used across the wider healthcare field, of which telemental health is a mental-health-specific subset. Teletherapy, the term Louisiana's rule specifically adopts, is typically understood in the broader literature as somewhat narrower than telemental health — most commonly referring to psychotherapy delivered through synchronous video or audio connections specifically, rather than the full range of asynchronous or technology-assisted modalities that fall under the broader "telemental health" umbrella. <em>[VERIFY whether §505 itself defines "teletherapy" with a specific scope, and whether that definition includes or excludes telephone-only and asynchronous delivery — this course adopts the term as used in the rule's title but did not confirm a precise regulatory definition of its boundaries against primary LAC text.]</em></p>
<p>This terminological precision matters practically: a Louisiana licensee who provides only telephone-based counseling, without any video component, should confirm whether that specific modality falls within §505's scope of "teletherapy" as the rule defines it, rather than assuming the privileging requirement applies uniformly to every technology-mediated modality a licensee might use. This course, consistent with the build convention followed by this platform's other state-specific telehealth courses, uses "teletherapy" to track Louisiana's own regulatory terminology throughout, and flags this open definitional question for verification rather than asserting a specific scope with confidence it has not independently confirmed.</p>
<blockquote><p><strong>Clinical Vignette:</strong> Dr. Okafor, a Louisiana-licensed LPC who relocated from Georgia three years ago, had provided teletherapy under Georgia's Rule 135-11 for most of her career and assumed her Georgia telehealth training would translate directly once she transferred her practice to Louisiana. She continued seeing clients by video the week her Louisiana license became active, reasoning that she was "already trained" and had years of documented telehealth CE on file. When a routine Board inquiry — unrelated to teletherapy — surfaced during her license renewal, she learned that her Georgia telehealth CE hours, however extensive, had never been submitted as Louisiana's specific initial teletherapy training, and she had never filed a Declaration/Informed Consent for Teletherapy Services addendum with the Louisiana Board at all. She had been providing teletherapy in Louisiana, unknowingly, outside the scope of what her Louisiana license currently authorized.</p></blockquote>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Privileging (Louisiana's model)",
          content: `<p>An affirmative, Board-recorded authorization to provide a specific service — here, teletherapy — that a licensee must obtain before providing that service, distinct from and in addition to holding a valid base license. Requires completing prerequisite training and filing a specific document with the Board. Absent this authorization, providing the service is outside the scope of the license.</p>`,
        },
        {
          title: "CE-Contingent Authorization (Georgia's model, for contrast)",
          content: `<p>Under Georgia Rule 135-11, a licensee's authority to provide telemental health flows from their base license plus completion of specified CE hours (6 hours telehealth-specific CE within 5 years) and consent documentation — there is no separate Board filing that converts the clinician into a "privileged" teletherapy provider. Non-compliance is a CE and consent-documentation deficiency, not an absence of authorization to practice the modality at all.</p>`,
        },
        {
          title: "Declaration/Informed Consent for Teletherapy Services Addendum",
          content: `<p>The specific document a Louisiana licensee files with the LPC Board to obtain teletherapy privileging, after completing the initial training. Functions simultaneously as a Board notification (creating the administrative record of privileged status) and a written attestation to specific §505.F informed-consent obligations the licensee commits to meeting with every teletherapy client going forward.</p>`,
        },
        {
          title: "Initial Training vs. Renewal Maintenance — Two Different \"3 Hours\"",
          content: `<p>Initial training: a one-time minimum of 3 clock hours (synchronous or asynchronous), covering §505.F topics, completed before first filing for privileging. Renewal maintenance: 3 CEH per renewal period, completed repeatedly, required to retain privileged status. Same numeral, different legal function, different frequency — conflating them is a documented risk this course addresses directly in Sections 2 and 5. <em>[VERIFY exact renewal-cycle length and license-type-specific citations before publish.]</em></p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>Louisiana Compared to Its Neighbors and Peers</h2>
<p>Placing Louisiana's model alongside the states covered elsewhere on this platform clarifies what makes it distinctive rather than merely different. Texas's technology-assisted-services rule (22 TAC §681.140, addressed in CR-TMH602-TX) requires 2 hours of technology-assisted-services-specific continuing education for LPCs who provide the modality — a CE-contingent model, with no separate Board filing or privileging status. Florida's telehealth statute (§456.47, addressed in CR-TMH603-FL) does not impose a state-mandated telehealth-specific CE-hour count tied to a formal approval step at all; Florida instead alternates a 3-hour ethics-or-telehealth CE requirement under F.A.C. 64B4-6.001(2)(b), and authorization to provide telehealth flows from the underlying license plus statutory standard-of-care and consent obligations. Georgia's Rule 135-11, as described above, sits closer to Texas's model but with materially higher CE and consent thresholds. Louisiana alone, among the states this platform currently covers, requires an affirmative privileging filing as a precondition to lawful practice of the modality — which is also why a Louisiana licensee cannot simply treat out-of-state telehealth CE, however substantial, as satisfying Louisiana's requirement, the way Dr. Okafor in the vignette above assumed she could.</p>
<p>The practical consequence for a multi-state licensee, or for a clinician relocating to Louisiana from a CE-contingent state, is that "I've done telehealth training before" is never sufficient on its own. The relevant question in Louisiana is always: has the specific initial-training content required by §505.F been completed, and has the Declaration/Informed Consent addendum actually been filed with and processed by the Louisiana Board? Prior telehealth experience, prior CE hours from another jurisdiction, and even a strong general understanding of telehealth best practice — all genuinely valuable, and covered in the general teletherapy literature this course draws from — do not substitute for that specific procedural step. This course's remaining four sections walk through what that step actually requires: the content of the initial training and the filing process itself (Section 2), the informed-consent obligations that filing commits a licensee to (Section 3), how privileging interacts with a Louisiana clinician's ability to serve clients located outside Louisiana and Louisiana's rules for clinicians located outside the state (Section 4), and how to maintain privileged status once it is granted, including tracking the separate 3-CEH renewal requirement across license types (Section 5).</p>
<h2>Evidence Base for the Underlying Modality</h2>
<p>None of the procedural distinctiveness above should be read as skepticism about teletherapy's clinical value — the privileging structure exists because Louisiana treats teletherapy as a real, board-recognized specialty area worth gatekeeping carefully, not because the modality itself is regarded as marginal or unproven. The evidence base for synchronous video-based teletherapy is substantial and well established. Meta-analytic research has consistently demonstrated outcome equivalence between video-based and in-person mental health service delivery: Hilty et al. (2013) reviewed over 150 studies and found comparable outcomes across diverse populations and presenting concerns, with particularly strong evidence for depression, anxiety disorders, and post-traumatic stress disorder; Batastini et al. (2021) conducted a meta-analysis of randomized controlled trials comparing video-based to in-person therapy and found no significant differences in outcomes, therapeutic alliance, or client satisfaction. Specific evidence-based treatments — cognitive-behavioral therapy, exposure-based protocols for PTSD and OCD, dialectical behavior therapy skills groups, and adapted EMDR bilateral stimulation techniques — have each been separately validated for teletherapy delivery, discussed at greater length in this platform's foundational telemental health course.</p>
<p>What the Louisiana privileging model adds on top of that general evidence base is a state-specific judgment that clinical competence in face-to-face delivery does not automatically transfer to competence in teletherapy delivery, and that this transfer deserves a formal checkpoint rather than an assumption. This mirrors — and, structurally, goes further than — a principle already familiar from the broader telemental health literature: modality competence and population competence are distinct skill sets that a clinician does not automatically possess simply because they hold a valid license and have delivered excellent in-person care for years. Louisiana's contribution is to make that checkpoint a formal, Board-administered gate rather than a matter of individual professional self-assessment alone.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Competency Standards Underneath the Privileging Requirement</h2>
<p>It is worth asking why Louisiana's regulatory choice — a formal gate rather than a CE-only model — tracks a broader professional consensus about what teletherapy competence actually requires. The Board-Certified TeleMental Health (BC-TMH) credential, developed by the Center for Credentialing and Education (CCE), a subsidiary of the National Board for Certified Counselors (NBCC), identifies nine core competency domains for telemental health practice: the legal, ethical, and regulatory framework of telemental health; evidence-based telehealth clinical practices; the technology of telemental health; dispositions and telepresence; cultural competence and diversity in telehealth; documentation and administrative procedures specific to telehealth; telepractice development; standards of telepractice; and research and trends in telemental health. Notice how closely the first and sixth of these domains — the regulatory framework, and documentation/administrative procedures — map onto exactly what Louisiana's §505 privileging structure asks a licensee to demonstrate before beginning practice: not simply clinical skill transferred from in-person work, but a working command of the state-specific regulatory and documentation apparatus surrounding the modality.</p>
<p>The Telebehavioral Health Institute (TBHI) has articulated a parallel framework organizing telehealth competencies into foundational knowledge areas (history and evidence base, relevant laws and regulations, technology requirements) and applied practice skills (conducting assessments via telehealth, adapting therapeutic techniques for virtual delivery, managing crisis situations remotely, maintaining professional boundaries in the digital environment). Both frameworks converge on the same underlying premise Section 1 introduced: telehealth competence is not a natural extension of in-person clinical competence but a distinct set of skills requiring specialized training and ongoing development. Louisiana's privileging model can be read as one state's attempt to operationalize that premise into an enforceable gate rather than leaving it to individual professional self-assessment — a licensee cannot simply decide, unilaterally, that their years of excellent in-person clinical work qualify them for teletherapy; the Board's approval of the Declaration/Informed Consent addendum is the mechanism that converts a clinician's self-assessment into an actual, recorded authorization.</p>
<h2>Modality Competence and Population Competence, Applied to Louisiana</h2>
<p>Two related competence concepts from the broader telemental health literature deserve explicit mention here because they inform what "meaningful" §505 initial training should accomplish, beyond simply satisfying the clock-hour minimum. Modality competence refers to a clinician's skill in delivering services through a specific technology modality — a clinician highly competent in face-to-face individual therapy is not automatically equally competent delivering that same therapy through video, and the transition should be accompanied by genuine training, not merely a credential obtained to satisfy a filing requirement. Population competence refers to a clinician's knowledge and skill serving specific client populations through virtual modalities — a clinician competent providing in-person services to adolescents, for instance, is not automatically competent providing teletherapy to adolescents, since the virtual environment introduces developmental, behavioral, and logistical considerations (parental supervision of the device, privacy in a shared household, engagement strategies suited to a screen rather than a room) that differ meaningfully from in-person practice.</p>
<p>Neither modality competence nor population competence is something Louisiana's §505 filing, by itself, can guarantee a licensee actually possesses — the Board's review confirms that training was completed and that the informed-consent attestation was made, not that the licensee has internalized genuine clinical skill in the modality. This is precisely why this course, consistent with the broader professional consensus reflected in the BC-TMH and TBHI frameworks above, treats the §505 initial training requirement as a floor rather than a ceiling: a licensee who completes the minimum 3 clock hours and files the addendum has satisfied Louisiana's administrative gate, but genuine teletherapy competence — the kind that protects clients and reduces the clinician's own liability exposure beyond mere regulatory compliance — typically requires ongoing self-assessment, consultation, and ideally training beyond the regulatory minimum, particularly for clinicians extending their practice to populations (children, clients in active crisis, clients with significant cognitive impairment) where the virtual medium introduces the most complexity.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Access Disparities Within Louisiana</h2>
<p>A privileging model, however well-designed, does not by itself address a separate and equally real barrier to teletherapy access: whether a client on the other end of the connection actually has reliable technology and infrastructure to use it. Broadband access in Louisiana is unevenly distributed, with rural parishes — particularly in the northern and central regions of the state, and in areas outside the New Orleans, Baton Rouge, Lafayette, and Shreveport metropolitan corridors — experiencing meaningfully lower rates of reliable high-speed internet access than the state's urban centers. A Louisiana clinician building a teletherapy practice with the expectation of serving clients statewide should factor this disparity into both individual client suitability assessments (the technological-suitability domain discussed further in Section 3) and broader practice planning, since a clinical population drawn heavily from an underserved rural parish may require a higher proportion of telephone-based or hybrid in-person/telehealth service delivery than a practice serving a primarily urban caseload.</p>
<p>Louisiana's exposure to hurricanes and tropical weather systems adds a second, related continuity-of-care consideration, one already familiar from this platform's Florida course but equally relevant here. A teletherapy practice that has planned in advance for storm-season disruption — confirming that cloud-stored clinical records remain accessible from an alternate location, maintaining an offline or easily retrievable current client contact list, and having communicated to clients in advance how the practice will handle scheduling and continuity during a storm event or evacuation — is better positioned to maintain care continuity than a practice that treats disaster planning as a hypothetical exercise. This is not a §505-specific requirement, but it is a practical extension of the same client-location awareness and technology-planning discipline this course asks Louisiana teletherapy providers to build throughout their practice, and it is worth incorporating into the same documentation and practice-planning habits this course recommends for the privileging-specific requirements.</p>
`,
    },
    {
      type: "matching",
      matchingInstructions: "Match each term to its correct definition.",
      matchingPairs: [
        { term: "Teletherapy Privileging", definition: "Louisiana's Board-recorded, affirmative authorization to provide teletherapy — required in addition to holding a valid base LPC/LMFT license" },
        { term: "Initial Training Requirement", definition: "A one-time minimum of 3 clock hours (synchronous or asynchronous) covering §505.F topics, completed before first filing for privileging" },
        { term: "Declaration/Informed Consent for Teletherapy Services Addendum", definition: "The document a Louisiana licensee files with the Board after initial training, creating the privileging record and attesting to §505.F informed-consent obligations" },
        { term: "3 CEH/Renewal Maintenance Requirement", definition: "The separate, recurring continuing-education obligation required to retain teletherapy privileging once granted — not the same requirement as initial training" },
        { term: "Out of Scope of License", definition: "The regulatory characterization of a Louisiana licensee providing teletherapy without having completed privileging — a more serious status than a CE compliance gap" },
        { term: "LAC Title 46, Part LX, Chapter 5, §505", definition: "\"Teletherapy Guidelines for Licensees\" — the Louisiana Administrative Code provision establishing the privileging framework" },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 1 Key Takeaways",
      content: "<p>Louisiana's teletherapy framework is structurally different from the CE-contingent models used in Georgia, Texas, and Florida: it requires an affirmative, Board-recorded privileging status — obtained through initial training plus a Declaration/Informed Consent addendum filing — before a licensee may lawfully provide teletherapy at all. This course's most important recurring distinction is between the one-time 3-clock-hour initial training requirement and the separate, recurring 3-CEH-per-renewal maintenance requirement. They share a numeral; they are not the same obligation.</p>",
      items: [
        "Teletherapy is a board-recognized specialty area in Louisiana requiring formal privileging — not automatic with a base LPC/LMFT license",
        "Practicing teletherapy without completed privileging is characterized as out-of-scope-of-license practice, not merely a CE compliance gap",
        "Out-of-state telehealth training or CE, however extensive, does not substitute for Louisiana's specific initial training and filing requirement",
        "\"3 hours\" appears twice in this course with two different meanings — initial training (one-time) and renewal maintenance (recurring) — and this course tracks the distinction explicitly throughout",
      ],
    },
    {
      type: "reflection",
      question: "If you are Louisiana-licensed and currently provide (or plan to provide) teletherapy, have you confirmed — not assumed — that you have both completed the §505 initial training and filed the Declaration/Informed Consent addendum with the Board? If you are licensed in another state and considering a move to Louisiana, what documentation from your current jurisdiction would you need to gather to demonstrate your training history to the Louisiana Board?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under LAC Title 46, Part LX, Chapter 5, §505, a Louisiana LPC's authority to provide teletherapy comes from:",
      options: [
        { text: "Completing initial training and filing a Declaration/Informed Consent for Teletherapy Services addendum with the Board", isCorrect: true },
        { text: "Holding any unencumbered LPC license, with no additional requirement", isCorrect: false },
        { text: "Simply disclosing to clients that sessions will occur via video", isCorrect: false },
        { text: "Completing 6 hours of telehealth-specific CE, matching Georgia's requirement", isCorrect: false },
      ],
      explanation: "Louisiana requires an affirmative privileging step — initial training plus filing the Declaration/Informed Consent addendum with the Board — that goes beyond simply holding a valid base license.",
    },
    {
      type: "multipleChoice",
      question: "A Louisiana licensee who provides teletherapy without having completed §505 privileging is best described as:",
      options: [
        { text: "Behind on a continuing education requirement, similar to a Georgia Rule 135-11 compliance gap", isCorrect: false },
        { text: "Practicing outside the scope of what their license currently authorizes", isCorrect: true },
        { text: "Fully authorized, since teletherapy privileging is a recommended but optional credential", isCorrect: false },
        { text: "Only at risk if a client formally complains to the Board", isCorrect: false },
      ],
      explanation: "Louisiana's model treats unprivileged teletherapy practice as outside the scope of the license — a different and more serious framing than a CE compliance deficiency.",
    },
    {
      type: "multipleChoice",
      question: "Which of the following correctly distinguishes Louisiana's two \"3 hour\" teletherapy requirements?",
      options: [
        { text: "Both refer to the same one-time requirement, described differently by different sources", isCorrect: false },
        { text: "The 3-clock-hour figure applies only to LMFTs; the 3-CEH figure applies only to LPCs", isCorrect: false },
        { text: "The initial training (3 clock hours, one-time) precedes privileging; the maintenance requirement (3 CEH per renewal) sustains it afterward", isCorrect: true },
        { text: "The maintenance requirement replaces the initial training requirement once a licensee completes their first renewal", isCorrect: false },
      ],
      explanation: "The initial 3-clock-hour training is a one-time prerequisite to first obtaining privileging; the 3-CEH-per-renewal requirement is a separate, recurring obligation to retain that privileged status.",
    },
  ],
};

// ═══ SECTION 2: The Privileging Process ═══
const SECTION_2 = {
  title: "The Privileging Process",
  order: 2,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 2,
      title: "Section 2",
      subtitle: "Initial Training, Filing the Declaration/Informed Consent Addendum, and the Cost of Skipping Either Step",
      bannerAlt: "Clinician completing paperwork to file a teletherapy privileging application with a licensing board",
    },
    {
      type: "text",
      content: `<h2>Step One: The Initial 3-Clock-Hour Training</h2>
<p>Before a Louisiana licensee may file for teletherapy privileging, §505 requires completion of an initial training of at least 3 clock hours. The rule permits either synchronous delivery (a live webinar, workshop, or in-person training session) or asynchronous delivery (a self-paced recorded course, such as this one), provided the training substantively covers the content areas §505 specifies. This is the "initial training requirement" introduced in Section 1 — a one-time prerequisite, not a recurring obligation, and it is measured in clock hours rather than CEH, a distinction that matters when a licensee is comparing this figure against their renewal CE transcript, where hours are typically logged as CEH. <em>[VERIFY whether Louisiana's CE tracking system records this initial training identically to CEH-based renewal credit, or as a separate category entirely — the distinction affects how a licensee should document completion for Board review.]</em></p>
<p>The specific content areas required within the initial training substantially overlap with the informed-consent elements this course addresses in depth in Section 3, because §505.F functions as both a training-content checklist and an informed-consent-document checklist — the same substantive topics that a licensee must learn during initial training are the topics that licensee must then disclose to every teletherapy client going forward. Based on the Louisiana LPC Board's own FAQ materials, the topics include, at minimum: the technology and parameters of teletherapy service delivery (what platform will be used, how sessions will be scheduled and conducted); a technical-failure protocol (what happens if the connection drops mid-session, and how the client will be contacted); billing and reimbursement differences between teletherapy and in-person services; and the ethical and legal limitations that arise specifically from practicing across jurisdictional lines. <em>[This is a partial list drawn from secondary sources, not the full enumerated text of §505.F — VERIFY the complete, authoritative list against primary LAC text before treating this as exhaustive; Section 3 of this course addresses the same caveat in more detail, since the informed-consent document a licensee ultimately produces must reflect the full, verified list rather than this partial summary.]</em></p>
<p>Training content that meets the letter of §505's clock-hour minimum but does not substantively address these required topic areas would not satisfy the requirement, even if a course markets itself broadly as "teletherapy training." A licensee evaluating a training option — including this course — should confirm that the specific content areas §505.F requires are addressed, not merely that the course carries a general telehealth or teletherapy label and meets the 3-clock-hour minimum in duration alone.</p>
<h2>Step Two: Filing the Declaration/Informed Consent Addendum</h2>
<p>Once the initial training is complete, the licensee files the Declaration/Informed Consent for Teletherapy Services addendum with the Louisiana Licensed Professional Counselors Board of Examiners. This document serves two functions simultaneously. First, it is an administrative filing: it notifies the Board that this specific licensee has completed the prerequisite training and is requesting teletherapy privileging status. Second, it is a substantive attestation: by filing it, the licensee formally commits, in writing, to the §505.F informed-consent obligations addressed in depth in Section 3 of this course — verbal and written consent documentation, technology-and-parameters disclosure, technical-failure protocol disclosure, and the jurisdictional and cross-state limitations discussed in Section 4. The addendum is not a formality layered on top of an already-complete process; filing it is the step that actually confers privileged status. A licensee who has completed the initial training but has not yet filed — or whose filing has not yet been processed by the Board — has completed a prerequisite, not the requirement itself.</p>
<p>Secondary sources describing the Board's processing of these filings suggest a monthly batch-review cadence, meaning a licensee's application may not be reflected as approved immediately upon submission. <em>[VERIFY this timeline directly with the Board before advising any licensee on how long to expect the process to take, and before a licensee schedules a first teletherapy session assuming same-day or same-week approval.]</em> This has a direct practical consequence: a licensee who completes initial training and immediately begins offering teletherapy sessions, intending to file the addendum "shortly after," is very likely operating outside the scope of their license during the gap between beginning to practice and the Board's actual approval of the filing — even if the paperwork itself is eventually accepted without issue. The safest sequence is training, then filing, then confirmed Board approval, then the first teletherapy session — in that order, with no step skipped or assumed complete before it is confirmed.</p>
<h2>What "Out of Scope of License" Exposure Actually Means</h2>
<p>Section 1 introduced the framing that unprivileged teletherapy practice in Louisiana is out-of-scope-of-license practice rather than a mere CE deficiency. It is worth making the practical consequences of that framing concrete, because the two categories carry meaningfully different exposure. A CE deficiency is typically remediable — a licensee completes the missing hours, documents them, and the compliance gap closes retroactively in most CE-contingent frameworks, with the Board's response oriented toward compliance restoration rather than discipline for the underlying clinical work already performed. Out-of-scope practice is a different category of finding: it implicates whether the clinical services already delivered were authorized at all, which can expose a licensee to disciplinary action by the Board independent of whether any individual client was harmed, and can also create complications for professional liability insurance coverage, which frequently conditions coverage on the clinician practicing within the scope of their current license. <em>[VERIFY the specific disciplinary consequences and any available cure period with the Board directly — this course states the general risk category, not a specific penalty schedule, which was not confirmed against primary Board disciplinary guidelines.]</em></p>
<p>This is also why the vignette in Section 1 — a clinician who had extensive telehealth experience and CE from another jurisdiction, but had never filed the Louisiana-specific addendum — is a realistic and not a hypothetical risk. The exposure in that scenario does not depend on the clinician's actual competence or on any client complaint; it depends entirely on whether the Board's administrative record shows a completed privileging filing. A clinician can be highly skilled at teletherapy delivery and still be practicing outside the scope of their Louisiana license, because the two questions — is this person good at teletherapy, and is this person authorized by the Louisiana Board to provide it — are answered by entirely different evidence.</p>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Initial Training — Format and Minimum Duration",
          content: `<p>Minimum 3 clock hours. May be synchronous (live) or asynchronous (self-paced, recorded). Must substantively cover §505.F content areas, not merely carry a general "teletherapy" label. Measured in clock hours, not CEH — <em>[VERIFY how the Board's CE-tracking system records this figure relative to CEH-based renewal credit].</em></p>`,
        },
        {
          title: "Filing the Declaration/Informed Consent Addendum",
          content: `<p>Filed with the Louisiana LPC Board after initial training is complete. Functions as both an administrative notice (creating the privileging record) and a written attestation to §505.F informed-consent obligations. Privileged status is conferred upon Board approval of the filing, not merely upon submission.</p>`,
        },
        {
          title: "Board Review Timeline",
          content: `<p>Secondary sources suggest a monthly batch-review cadence. <em>[VERIFY directly with the Board before scheduling a first teletherapy session around an assumed approval date — do not treat submission as equivalent to approval.]</em></p>`,
        },
        {
          title: "Practicing Without Approval — Exposure",
          content: `<p>Characterized as out-of-scope-of-license practice rather than a CE deficiency. May implicate Board disciplinary exposure and professional liability insurance coverage, independent of clinical competence or any client complaint. <em>[VERIFY specific disciplinary consequences and any cure period with the Board.]</em></p>`,
        },
      ],
    },
    {
      type: "scenarioTree",
      scenarioTitle: "Timing the First Teletherapy Session",
      instructions: "You've just completed a 3-clock-hour initial teletherapy training that covers §505.F topics. Decide how to sequence your next steps.",
      startNode: "start",
      nodes: {
        start: {
          text: "You finish the training on a Friday. A long-standing in-person client asks Monday whether you could switch to video sessions temporarily while they recover from a minor injury. What do you do?",
          options: [
            { text: "Agree to start video sessions Monday, and file the Declaration/Informed Consent addendum with the Board that same week", next: "premature" },
            { text: "Tell the client you need to complete the Board filing first, and offer to hold in-person sessions or reschedule until the filing is approved", next: "correct_sequence" },
            { text: "Start the video sessions and plan to file the addendum whenever it's convenient, since you already completed the training", next: "worst_case" },
          ],
        },
        premature: {
          text: "You begin the video sessions and file the addendum the same week. The filing itself is later approved without any issue — but for the two to three weeks between your first video session and the Board's actual approval, you were providing teletherapy before privileged status was conferred.",
          feedback: { message: "Filing promptly is good practice, but filing is not the same as approval. The gap between your first session and Board approval is unprivileged practice, even though the paperwork was eventually accepted. Training and intent to file do not confer privileged status — Board approval does.", type: "negative" },
        },
        correct_sequence: {
          text: "You explain to the client that you're completing a Board filing before offering teletherapy, and offer in-person sessions or a brief pause until approval comes through. The client agrees to wait two weeks.",
          feedback: { message: "This is the safest sequence: training, then filing, then confirmed Board approval, then the first teletherapy session. It costs a short delay but avoids any period of unprivileged practice.", type: "positive" },
        },
        worst_case: {
          text: "You begin offering video sessions immediately and don't get around to filing the addendum for several months. During that period, you are providing teletherapy entirely outside the privileging framework — not merely delayed, but unfiled.",
          feedback: { message: "This is the highest-risk pattern described in this section: treating completed training as sufficient on its own, with no filing at all. It converts a temporary administrative gap into an extended period of out-of-scope practice.", type: "negative" },
        },
      },
    },
    {
      type: "text",
      content: `<h2>Preparing the Filing — What to Gather Before Submitting</h2>
<p>A licensee preparing to file the Declaration/Informed Consent for Teletherapy Services addendum benefits from assembling a specific packet of documentation before submission, rather than discovering gaps mid-process. At minimum, this should include: proof of completion of the initial 3-clock-hour training, specifying the provider, the date, the delivery format (synchronous or asynchronous), and — ideally — a syllabus or outline showing the training substantively addressed the §505.F content areas, in case the Board's review requests this level of detail; current license status documentation confirming the underlying LPC or LMFT license (or provisional equivalent) is active and unencumbered, since privileging is layered on top of, and therefore dependent on, a valid base license in good standing; and a completed draft of the informed-consent content itself, since the addendum functions as an attestation to specific practice commitments, not merely a notice of intent. <em>[VERIFY the Board's current specific submission requirements and any required forms directly — this course describes a prudent preparation posture, not a confirmed, itemized Board submission checklist.]</em></p>
<p>Clinicians should also anticipate that the Board's monthly batch-review cadence, discussed above, means a filing submitted just before a review cutoff may be processed in that cycle, while a filing submitted just after may wait until the following month — a scheduling reality worth accounting for when a licensee is planning to expand their practice to include teletherapy on any kind of timeline tied to client need, a new hire's start date, or a practice-wide service expansion. Building in several weeks of buffer between completing initial training and any planned first teletherapy session is a more realistic operational posture than assuming the process will move as quickly as the licensee would prefer.</p>
<h2>Confirming Approval — Don't Assume Silence Means Yes</h2>
<p>Because the consequence of practicing before approval is out-of-scope exposure rather than a mere paperwork delay, this course recommends that a licensee treat "I haven't heard back" as meaningfully different from "I have been approved," and actively confirm approval status rather than assuming that the passage of a reasonable amount of time implies a positive outcome. A licensee who submitted a filing and has not received explicit confirmation should follow up directly with the Board — by phone or the Board's designated inquiry channel — rather than beginning teletherapy sessions on the assumption that no news is good news. This is a small operational habit with an outsized effect on the risk profile described throughout this section: it converts an assumption into a documented confirmation, which is exactly the kind of record that protects a licensee if their privileging status is ever questioned later.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Distinguishing the Two "3 Hour" Requirements — Reinforced</h2>
<p>Because this distinction is easy to lose track of once a licensee is several renewal cycles into practice, it is worth restating plainly, separate from the surrounding procedural detail: the 3 clock hours discussed in this section is the <strong>one-time initial training</strong> a licensee completes before ever filing for privileging the first time. It is not the same requirement as the 3 CEH per renewal period discussed in Section 5 of this course, which a privileged licensee must complete repeatedly, renewal after renewal, to retain privileged status once it has been granted. A licensee who completed the initial 3-clock-hour training five years ago and has not addressed teletherapy-specific CE since has satisfied the entry requirement permanently — that step does not need to be repeated — but almost certainly has not satisfied several intervening renewal periods' worth of the separate, recurring 3-CEH maintenance obligation. This course treats that gap as one of the more common — and more consequential — points of confusion in Louisiana teletherapy compliance, precisely because both requirements are so often shorthanded as simply "the 3 hours" in casual conversation among licensees and even in some secondary CE-provider marketing materials.</p>
<p>A practical habit that prevents this confusion: label the two obligations differently in your own records from the outset. This course recommends "3-hour initial training" and "3 CEH/renewal maintenance" as consistent, distinguishable labels, and Section 5 provides a recordkeeping template built around exactly that distinction.</p>
`,
    },
    {
      type: "text",
      content: `<h2>What to Retain, and for How Long</h2>
<p>Beyond the specific documents already discussed — proof of initial training completion and the filed, approved Declaration/Informed Consent addendum — a Louisiana teletherapy practice benefits from treating the entire privileging process as a retained-record category, not a one-time task whose paperwork can be discarded once approval comes through. At minimum, this course recommends retaining: the certificate or completion record from the initial training provider, including enough detail (provider name, date, hours, delivery format, and ideally a syllabus or content outline) to demonstrate the training substantively addressed §505.F topics if ever asked; a copy of the filed Declaration/Informed Consent addendum itself, along with any Board correspondence confirming approval and its date; and, on an ongoing basis, the renewal-cycle CEH records discussed further in Section 5. <em>[VERIFY Louisiana's specific record-retention period for these documents against Board rule or Louisiana Revised Statutes — this course recommends indefinite retention as the safer practice given the disciplinary and licensure stakes described above, but did not confirm a specific minimum retention period against primary text.]</em></p>
<p>Retaining these records electronically, in a location separate from routine clinical documentation but still readily retrievable, serves the same purpose the recordkeeping habit in Section 5 serves for renewal CEH: it converts what would otherwise be a licensee's memory of having "done the training a while back" into an actual, producible record — the single most defensible position if a licensee's privileged status is ever questioned by the Board, a malpractice carrier, or opposing counsel in any professional-liability matter.</p>
`,
    },
    {
      type: "callout",
      calloutType: "warning",
      title: "The Same Numeral, Two Different Obligations",
      content: "<p>Louisiana's initial teletherapy training requirement (3 clock hours, one-time) and its renewal maintenance requirement (3 CEH per renewal, recurring) are legally distinct, even though both are commonly reported as \"3 hours.\" Completing one does not satisfy the other. This course tracks the distinction explicitly in every section where the figure appears.</p>",
    },
    {
      type: "cardSort",
      instructions: "Sort each statement into whether it describes the initial training requirement or the renewal maintenance requirement.",
      categories: ["Initial Training Requirement", "Renewal Maintenance Requirement"],
      cards: [
        { id: "la-cs2-1", text: "Minimum 3 clock hours, completed once before first filing for privileging", correctCategory: "Initial Training Requirement" },
        { id: "la-cs2-2", text: "3 CEH per renewal period, required repeatedly to retain privileged status", correctCategory: "Renewal Maintenance Requirement" },
        { id: "la-cs2-3", text: "Precedes filing the Declaration/Informed Consent addendum for the first time", correctCategory: "Initial Training Requirement" },
        { id: "la-cs2-4", text: "Tracked across multiple renewal cycles, potentially under different citations per license type", correctCategory: "Renewal Maintenance Requirement" },
        { id: "la-cs2-5", text: "May be synchronous or asynchronous, covering §505.F content areas", correctCategory: "Initial Training Requirement" },
      ],
      explanation: "The initial training is a one-time entry requirement; the renewal maintenance requirement recurs every renewal period and is tracked separately, discussed further in Section 5.",
    },
    {
      type: "reflection",
      question: "If you were sequencing your own path to teletherapy privileging today, where would you be most tempted to compress the timeline — starting sessions before Board approval, treating training completion as sufficient on its own, or something else? What would help you resist that temptation in practice?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "What is the minimum duration of Louisiana's initial teletherapy training requirement, and what delivery formats satisfy it?",
      options: [
        { text: "6 clock hours, synchronous only", isCorrect: false },
        { text: "3 CEH, synchronous only", isCorrect: false },
        { text: "2 clock hours, asynchronous only", isCorrect: false },
        { text: "3 clock hours, synchronous or asynchronous", isCorrect: true },
      ],
      explanation: "The initial training requirement is a minimum of 3 clock hours and may be completed synchronously or asynchronously, provided it substantively covers §505.F content areas.",
    },
    {
      type: "multipleChoice",
      question: "Teletherapy privileging is conferred upon:",
      options: [
        { text: "Board approval of the filed Declaration/Informed Consent addendum", isCorrect: true },
        { text: "Submission of the Declaration/Informed Consent addendum, regardless of Board review status", isCorrect: false },
        { text: "Completion of the initial 3-clock-hour training alone", isCorrect: false },
        { text: "The licensee's own good-faith determination that they are ready to practice", isCorrect: false },
      ],
      explanation: "Privileged status is conferred when the Board approves the filed addendum — not upon training completion or mere submission of the filing.",
    },
    {
      type: "multipleChoice",
      question: "A Louisiana licensee who begins offering teletherapy immediately after completing initial training, before filing the Declaration/Informed Consent addendum, is:",
      options: [
        { text: "Fully compliant, since training is the substantive requirement and filing is a formality", isCorrect: false },
        { text: "Providing services outside the scope of their license during that period", isCorrect: true },
        { text: "Compliant as long as they file within 30 days", isCorrect: false },
        { text: "Only at risk if the client is a Louisiana resident", isCorrect: false },
      ],
      explanation: "Training alone does not confer privileged status; providing teletherapy before the addendum is filed and approved is out-of-scope practice.",
    },
  ],
};

// ═══ SECTION 3: Informed Consent & Ongoing Practice Standards ═══
const SECTION_3 = {
  title: "Informed Consent and Ongoing Practice Standards",
  order: 3,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 3,
      title: "Section 3",
      subtitle: "§505.F Informed-Consent Elements, Verbal + Written Documentation, and Session-by-Session Client-Location Verification",
      bannerAlt: "Client and clinician reviewing an informed consent document together before a teletherapy session",
    },
    {
      type: "text",
      content: `<h2>Why §505.F Consent Is Not Generic Telehealth Consent</h2>
<p>Every telehealth course on this platform emphasizes that informed consent for remote service delivery must go beyond a general therapy consent form to address the specific risks and parameters of the technology-mediated modality. Louisiana's §505.F consent obligations are that same principle, but with a specific twist introduced by the privileging structure discussed in Sections 1 and 2: because filing the Declaration/Informed Consent addendum is itself an attestation that the licensee will meet these obligations, a Louisiana licensee's informed-consent practice is not simply a matter of professional best practice — it is the substantive content of a commitment already made in writing to the Board. A licensee who files the addendum and then uses a generic, non-Louisiana-specific telehealth consent form with clients has both an ethical gap and a discrepancy between what was attested to the Board and what is actually being practiced.</p>
<p>Based on the Louisiana LPC Board's published FAQ materials, the §505.F content areas include, at minimum: disclosure of the technology and parameters of service delivery (the specific platform used, session scheduling and format, and any limitations of the technology); a technical-failure protocol specifying what happens if the connection is lost mid-session, including how and by what means the clinician will attempt to reconnect with the client; disclosure of billing and reimbursement differences that may apply to teletherapy compared to in-person services; and disclosure of the cross-jurisdictional ethical and legal limitations that arise when providing teletherapy across state lines, addressed in depth in Section 4 of this course. <em>[This list reflects secondary-source summaries of §505.F, not the complete enumerated primary text — VERIFY the full, authoritative list of sub-items against the live LAC before finalizing any consent document based on this course, and before treating this list as sufficient on its own.]</em></p>
<p>The technical-failure protocol element deserves particular attention because it is often the most operationally under-specified element in generic telehealth consent forms, yet it is one of the four areas Louisiana specifically requires. A compliant technical-failure protocol should specify, in writing and reviewed with the client before the first session: the backup contact method if video or audio connection is lost (a specific phone number, not a vague "we'll figure it out"); how long the clinician will wait before attempting to reconnect, and by what method; what happens if reconnection is not possible within a defined window (reschedule, switch to telephone, or another specified fallback); and, critically, what the client should do if a technical failure occurs during a session addressing a safety-relevant topic, distinct from ordinary technical failure.</p>
<h2>Verbal AND Written Consent — Both, Documented</h2>
<p>Consistent with the pattern already familiar from Georgia's Rule 135-11 (which this platform's foundational course addresses at length), Louisiana's teletherapy consent framework is understood, based on secondary-source summaries, to require both a verbal discussion of the §505.F elements AND a written, signed consent document — not one or the other. <em>[VERIFY whether §505 states this dual verbal-and-written requirement explicitly, or whether this is a best-practice inference drawn by secondary sources from the general informed-consent standard combined with the Declaration/Informed Consent addendum's own written-attestation structure — the exact source and force of the "verbal AND written" requirement was not confirmed against primary LAC text for this course.]</em> Regardless of the precise regulatory sourcing, documenting both is the safer practice for two independent reasons: it satisfies the general clinical-ethics expectation that informed consent be an interactive process, not merely a signed form the client may not have meaningfully engaged with, and it creates the clearest possible record if a client's understanding of the teletherapy arrangement is later called into question. A clinical note documenting a verbal informed-consent discussion should specify the date, the specific topics covered (technology and parameters, technical-failure protocol, billing differences, jurisdictional limitations), and confirmation that the client had an opportunity to ask questions — mirroring, deliberately, the level of specificity this platform's Georgia-focused course recommends for that state's own dual verbal-and-written requirement.</p>
<p>A written consent document that merely restates §505.F's topic headings without substantive content under each heading does not meaningfully satisfy either the ethical or the regulatory purpose of the requirement. "You understand teletherapy involves technology risks" is not equivalent to a specific technical-failure protocol; "billing may differ" is not equivalent to disclosing which specific billing differences apply. The Teletherapy Declaration & Informed Consent Addendum worksheet referenced in this course's Section 5 resources is built around this level of specificity, and Board legal review of any final document derived from it is required before clinical use, consistent with this platform's standard practice for every jurisdiction-specific worksheet.</p>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Technology and Parameters Disclosure",
          content: `<p>Which specific platform will be used, how sessions are scheduled, expected session format, and any known technical limitations. Should be specific enough that a client understands exactly what to expect, not a generic reference to "secure video technology."</p>`,
        },
        {
          title: "Technical-Failure Protocol",
          content: `<p>What happens if the connection drops mid-session: the specific backup contact method, how long the clinician waits before attempting reconnection, the fallback plan if reconnection fails, and separate guidance for technical failure during a safety-relevant discussion. Frequently under-specified in generic telehealth consent forms.</p>`,
        },
        {
          title: "Billing and Reimbursement Differences",
          content: `<p>Disclosure of how billing for teletherapy may differ from in-person services — relevant given that payer policies, place-of-service coding, and reimbursement rates for telehealth mental health services can differ meaningfully from in-person billing.</p>`,
        },
        {
          title: "Cross-Jurisdictional Ethical and Legal Limitations",
          content: `<p>Disclosure that teletherapy across state lines carries jurisdictional limitations — addressed at length in Section 4 of this course, including the client-location-governs principle and Louisiana's reciprocal-compliance obligation for out-of-state clients.</p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>Client-Location Verification, Every Session</h2>
<p>Because Louisiana's jurisdictional framework — discussed fully in Section 4 — turns on where the client is physically located at the time of a given session, verifying that location is not a one-time intake task but a recurring clinical and documentation practice that belongs in this section's discussion of ongoing practice standards. A client's physical location can change session to session: travel, temporary relocation, a stay with family out of state, or a permanent move are all realistic scenarios for an active caseload, and a clinician who verifies location only at intake risks providing a session to a client who is, unbeknownst to the clinician, physically located somewhere the clinician is not authorized to provide services.</p>
<p>A defensible client-location verification practice asks the client, at the start of each teletherapy session, to confirm their current physical location — not their mailing address, not their "usual" location, but where they are sitting for that specific session — and documents the answer in the clinical note for that session. This need not be an elaborate procedure; a brief, routine question at the start of the session ("Just confirming — are you in Louisiana right now?") followed by a one-line documentation note is sufficient for the ordinary case, with a more substantive conversation warranted whenever the answer is anything other than the client's usual location. When a client discloses they are temporarily out of state, the clinician should apply the Section 4 framework immediately — determining whether the reciprocal-compliance obligation to the client's current state applies, and whether it is appropriate to proceed with that specific session — rather than treating the disclosure as incidental scheduling information.</p>
<h2>Cultural, Linguistic, and Ethical-Code Consent Considerations</h2>
<p>Louisiana's §505.F elements operate alongside, not instead of, the broader informed-consent obligations already established in professional ethical codes. The ACA Code of Ethics (2014, Section H) specifically addresses distance counseling, technology, and social media, and requires counselors to address, within the consent process, time zone differences, cultural and language considerations that affect a client's ability to access or understand technology-assisted services, and the client's right to know how to appropriately use available technology for services being offered. For a Louisiana teletherapy practice, this means the §505.F content areas discussed above should be understood as a state-specific floor layered on top of this broader ethical obligation, not a substitute for it — a consent process that satisfies §505.F's four content areas but is delivered only in a language the client does not fully understand, or that assumes a level of technological literacy the client does not have, would satisfy the letter of the Louisiana-specific requirement while falling short of the broader ethical standard for genuinely informed consent.</p>
<p>Practically, this means a Louisiana clinician's consent process should include an active check of the client's actual understanding — not merely delivery of the required content — and should be prepared to provide the consent information in the client's preferred language, through a qualified interpreter where needed, and at a pace and level of detail appropriate to the client's technological familiarity. This is especially relevant given Louisiana's linguistic diversity, including Louisiana French and Spanish-speaking communities in various parishes, where a client's primary language may differ from the language in which a licensee's standard teletherapy consent materials were originally drafted.</p>
<h2>Ongoing Practice Standards Beyond Consent</h2>
<p>The §505.F informed-consent elements are the most detailed and most frequently discussed component of Louisiana's teletherapy standards, but the "ongoing practice standards" this section's title references extend somewhat further. Documentation practices should reflect the teletherapy-specific elements at every session, not merely at intake: the platform used, confirmation of client location, and any technical issues encountered should appear in the session note where relevant, creating a running record that would allow a licensee to reconstruct, if ever asked by the Board, exactly how a given course of teletherapy treatment was delivered and where the client was located throughout. Emergency and crisis protocols specific to teletherapy — knowing the nearest emergency resources to the client's actual physical location, not the clinician's location, and having a plan for how to summon local emergency services for a client whose location may differ from the clinician's own city or region — are a practical extension of the same location-awareness principle this section has emphasized throughout, and should be addressed explicitly within the technology-and-parameters and technical-failure-protocol elements of the informed-consent conversation described above, adapted to each new client's disclosed location at intake and updated whenever that location changes.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Clinical Suitability as Part of Ongoing Practice Standards</h2>
<p>Although §505.F's enumerated content areas focus on disclosure — what the client must be told before and during teletherapy — the broader "ongoing practice standards" this section addresses reasonably extend to a clinician's own judgment about whether teletherapy remains clinically appropriate for a given client at a given point in treatment, a judgment that should be revisited periodically rather than made once at intake and never reconsidered. A useful framework, consistent with the general telemental health literature this course draws from, evaluates suitability across three domains: clinical appropriateness (is the client's presenting concern, risk level, and diagnostic picture suited to remote delivery, or does it require in-person contact — an acute crisis presentation, a need for hands-on assessment, or a level of dissociation or disorganization that makes screen-based engagement clinically inadequate), technological suitability (does the client have reliable access to a private device, adequate bandwidth, and basic technical comfort, or would sessions be routinely disrupted in ways that compromise care), and environmental suitability (does the client have a private space for sessions, free from likely interruption or being overheard, especially relevant for clients in shared housing, dormitories, or households where confidentiality cannot otherwise be assured).</p>
<p>None of these three domains is assessed once and considered settled for the life of the treatment relationship. A client whose presenting concern escalates into active crisis, whose living situation changes such that privacy is no longer available, or whose technology access changes (a lost device, a lapsed internet subscription) may shift from clearly suitable to no longer suitable for teletherapy, at least temporarily, and a clinician's ongoing practice standard should include periodic reassessment — not necessarily a formal instrument at every session, but a genuine clinical check-in, particularly at treatment milestones, following any disclosed change in the client's circumstances, or if session quality has been degraded by recurring technical or environmental disruption. Documenting this reassessment, briefly, in the clinical record alongside the client-location verification already discussed above, creates a coherent ongoing record of why teletherapy remained the clinically appropriate delivery method throughout the course of treatment, not merely at its outset.</p>
`,
    },
    {
      type: "flashcardDeck",
      title: "§505.F Consent and Documentation Terminology",
      instructions: "Review these key terms from this section. Flip each card to see the definition.",
      cards: [
        { front: "§505.F Elements", back: "The informed-consent content areas required in Louisiana's teletherapy consent process: technology/parameters, technical-failure protocol, billing differences, and cross-jurisdictional limitations. [VERIFY full enumerated list against primary text.]" },
        { front: "Technical-Failure Protocol", back: "A specific, written plan for what happens if the connection is lost during a teletherapy session — backup contact method, reconnection window, and fallback plan, including a separate provision for safety-relevant discussions." },
        { front: "Dual Verbal-and-Written Consent", back: "The practice of both discussing §505.F elements aloud with the client and documenting that discussion, in addition to obtaining a signed written consent form — not one in place of the other." },
        { front: "Client-Location Verification", back: "Confirming and documenting the client's physical location at the start of every teletherapy session, not only at intake, since location can change and governs which jurisdiction's rules apply to that session." },
        { front: "Cross-Jurisdictional Limitations Disclosure", back: "The §505.F element requiring clients be informed that teletherapy across state lines carries legal and ethical limitations — the consent-document counterpart to the substantive jurisdiction rules covered in Section 4." },
      ],
    },
    {
      type: "text",
      content: `<h2>Refreshing Consent When Circumstances Change</h2>
<p>Informed consent for teletherapy, like informed consent generally, is not a single event that remains valid unchanged for the life of the treatment relationship. Several circumstances specific to teletherapy practice should trigger a licensee to revisit and, where appropriate, re-document consent rather than relying on the original signed form indefinitely: a change in the platform or technology used for sessions (switching videoconferencing vendors, for instance, changes the technology-and-parameters disclosure originally provided); a client's disclosed change in typical physical location, particularly a permanent relocation rather than temporary travel, which may implicate the jurisdictional considerations discussed in Section 4 and warrants a fresh conversation about the practice's teletherapy limitations as they now apply; and any material change to the technical-failure protocol itself, such as a change in the clinician's backup contact method or availability. A brief, documented consent refresh — even a short clinical note confirming the change was discussed and the client's continued agreement obtained — is a proportionate response to these triggers, more practical than requiring a fully re-executed written consent document for every minor change, while still maintaining a defensible record that consent remained current and informed throughout treatment rather than frozen at intake.</p>
`,
    },
    {
      type: "matching",
      matchingInstructions: "Match each documentation practice to what it is meant to protect against.",
      matchingPairs: [
        { term: "Session-by-session client-location confirmation, documented", definition: "A clinician unknowingly providing services to a client physically located outside an authorized jurisdiction" },
        { term: "Written technical-failure protocol reviewed with the client", definition: "Confusion or unsafe delay if the connection drops during a session, especially a safety-relevant one" },
        { term: "Clinical note documenting the verbal consent discussion, by topic", definition: "A later dispute over whether the client actually understood and engaged with the §505.F disclosures" },
        { term: "Consent document with substantive content under each §505.F heading", definition: "A form that restates topic headings without actually disclosing the specific technology, protocol, or billing information required" },
      ],
    },
    {
      type: "reflection",
      question: "Review your own current informed-consent document (or, if you don't yet have one, imagine drafting one). Does it address a specific technical-failure protocol with a real backup contact method and reconnection window, or does it use general language like \"technology risks may occur\"? What would you need to add to make it substantively — not just formally — compliant with §505.F's technical-failure element?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Which of the following is a §505.F informed-consent content area?",
      options: [
        { text: "The client's insurance deductible amount", isCorrect: false },
        { text: "The clinician's personal cell phone carrier", isCorrect: false },
        { text: "A technical-failure protocol specifying backup contact and reconnection procedures", isCorrect: true },
        { text: "The client's employer's telehealth policy", isCorrect: false },
      ],
      explanation: "§505.F requires disclosure of a technical-failure protocol, among other content areas — technology/parameters, billing differences, and cross-jurisdictional limitations.",
    },
    {
      type: "multipleChoice",
      question: "A written consent document that restates §505.F's topic headings without substantive content under each heading:",
      options: [
        { text: "Fully satisfies the requirement, since the topics are named", isCorrect: false },
        { text: "Is sufficient as long as it is paired with any verbal discussion, regardless of content", isCorrect: false },
        { text: "Satisfies the requirement only for LPCs, not LMFTs", isCorrect: false },
        { text: "Does not meaningfully satisfy either the ethical or regulatory purpose of the requirement", isCorrect: true },
      ],
      explanation: "Generic restatement of topic headings without specific disclosures (e.g., naming the actual backup contact method, or the actual billing differences) does not substantively satisfy the requirement.",
    },
    {
      type: "multipleChoice",
      question: "Client-location verification should occur:",
      options: [
        { text: "At the start of every teletherapy session, since location can change", isCorrect: true },
        { text: "Only once, during intake", isCorrect: false },
        { text: "Only when the client explicitly mentions travel", isCorrect: false },
        { text: "Only for new clients, not established ones", isCorrect: false },
      ],
      explanation: "Because jurisdiction is governed by the client's physical location at the time of each session, location should be confirmed and documented at every session, not only at intake.",
    },
  ],
};

// ═══ SECTION 4: Jurisdiction & Multi-State Practice ═══
const SECTION_4 = {
  title: "Jurisdiction and Multi-State Practice",
  order: 4,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 4,
      title: "Section 4",
      subtitle: "Client-Location-Governs, Reciprocal Compliance for Out-of-State Clients, and the Nonresident-Into-Louisiana Question",
      bannerAlt: "Map showing state borders, representing jurisdictional rules for cross-state teletherapy practice",
    },
    {
      type: "text",
      content: `<h2>The Client-Location-Governs Principle</h2>
<p>Louisiana's jurisdictional framework for teletherapy rests on the same foundational principle used across every state this platform currently covers: mental health services are considered to be delivered in the state where the client is physically located at the time of the session, not the state where the clinician is located, not the state where the clinician holds their primary license, and not the state where the client happens to maintain a permanent residence if they are temporarily elsewhere. A Louisiana-licensed clinician sitting in Baton Rouge, providing a session to a client who is physically in Mississippi for that specific session, is — for jurisdictional purposes — providing a service into Mississippi, regardless of where either party's driver's license was issued. This is the same principle Section 3 asked you to operationalize through session-by-session client-location verification, and this section addresses what follows once that location is known.</p>
<p>The client-location-governs principle has two distinct applications for a Louisiana-licensed clinician, and this course addresses them separately because they impose different obligations: first, what happens when a Louisiana clinician's own client is physically located outside Louisiana for a given session (the "reciprocal compliance" scenario below); and second, what happens when a clinician licensed outside Louisiana wants to provide teletherapy to a client physically located in Louisiana (the "nonresident-into-Louisiana" scenario further below). Both scenarios share the same underlying rule but require different action from a Louisiana licensee, and conflating them — assuming that because you understand one direction of the rule you automatically understand the other — is a realistic source of error for a busy clinician managing a mixed caseload.</p>
<h2>Reciprocal Compliance: When Your Client Is Somewhere Else</h2>
<p>When a Louisiana-licensed clinician provides teletherapy to a client who is physically located in another state — even temporarily, even for a single session during travel — the governing principle is that the clinician must comply with that other state's teletherapy regulations for that session, not merely with Louisiana's. This reciprocal-compliance obligation is worth its own dedicated treatment on this platform, given that CounselorReady already serves multi-state licensees whose caseloads routinely include clients who travel, relocate temporarily, or split time between states. It is not enough for a Louisiana clinician to confirm they are personally compliant with §505; the clinician must also determine whether the state where the client is currently sitting permits an out-of-state clinician (i.e., the Louisiana clinician, from that state's perspective) to provide the service at all, and if so, under what conditions.</p>
<p>In practice, this means that when Section 3's session-by-session client-location check reveals a client is temporarily out of state, the clinician's next step is not simply to proceed with the session as usual. The clinician should determine: does the client's current state have a telehealth-specific provision analogous to Florida's out-of-state-registration pathway that would authorize the Louisiana clinician to provide a session into that state, does an applicable interstate compact cover the clinician's license type in both Louisiana and the client's current state (addressed further below), or does that state require the clinician to hold a full license or a distinct registration before providing any service into it at all? Absent a clear affirmative answer to one of these questions, the safer clinical decision is to decline to provide that specific session, document the reason, and offer the client an alternative — rescheduling until the client returns to Louisiana, or a referral to a clinician licensed in the client's current state — rather than assuming Louisiana licensure alone is portable across state lines.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Louisiana-licensed LPC's long-term client calls for a regular teletherapy session and mentions, in passing, that they arrived in a neighboring state the day before for a two-week visit with family. The clinician's first instinct is to proceed with the session as scheduled, since nothing about the client's presenting concerns has changed and the relationship is well established. Applying the reciprocal-compliance principle, the clinician instead pauses to research whether the neighboring state has a telehealth registration pathway, a compact provision covering LPCs, or a strict full-licensure requirement — and finds no time before the scheduled session to reach a confident answer. The clinician reschedules the session for the client's return to Louisiana, explains the reason briefly, and provides local crisis-resource information for the client's current location in case of an urgent need in the interim. The client is mildly inconvenienced by a two-week delay; the clinician has avoided providing a session without having confirmed authorization to do so.</p></blockquote>
`,
    },
    {
      type: "text",
      content: `<h2>Nonresident-Into-Louisiana: Serving a Louisiana Client From Out of State</h2>
<p>The reverse scenario asks whether a clinician licensed in another state — not Louisiana — may provide teletherapy to a client physically located in Louisiana. Some states, Florida among them (addressed in this platform's CR-TMH603-FL course), offer a registration-only pathway that allows a qualifying out-of-state clinician to serve in-state clients without obtaining full local licensure, provided the clinician has no pending discipline or license revocation in any jurisdiction. Louisiana appears not to offer an analogous pathway: based on the search conducted to scope this course, no registration-only mechanism comparable to Florida's §456.47 provision was identified for a nonresident clinician wishing to provide ongoing teletherapy to a Louisiana-located client. <em>[This is a negative claim — the absence of a pathway — and negative claims specifically require primary-source confirmation rather than inference from an absence in secondary search results. VERIFY this directly against LAC Title 46, Part LX and Louisiana Revised Statutes Title 37 before treating "Louisiana has no such pathway" as a settled fact in any learner-facing or client-facing material derived from this course.]</em></p>
<p>If that absence is confirmed, the practical implication is that a nonresident clinician wishing to provide teletherapy into Louisiana on more than an isolated, incidental basis would generally need to obtain full Louisiana licensure (or qualify under an applicable interstate compact provision, addressed below) rather than relying on a lighter-weight registration process. This is a materially different — and more restrictive — posture than the pattern this platform's Florida course describes, and Louisiana clinicians who collaborate with, supervise, or refer to out-of-state colleagues should not assume that a colleague licensed and privileged in another state can simply "pick up" a Louisiana-located client via teletherapy without separately confirming Louisiana authorization, even if that colleague's home-state credentials are impeccable.</p>
<h2>The Counseling Compact — Status Caveat</h2>
<p>Interstate compacts, where enacted and operational, offer a middle path between full separate licensure in every state and no cross-state authorization at all: a clinician licensed in a compact member state can obtain a "privilege to practice" in other member states without a full separate licensure application in each one, subject to compact eligibility criteria (typically an active, unencumbered license; a CACREP-accredited or equivalent graduate program; passage of a national licensing exam; and a clean disciplinary record). Compact enactment and operational status change from year to year as individual state legislatures act and as compact commissions stand up the administrative infrastructure needed to actually process privilege-to-practice applications — enactment on paper and operational readiness to issue privileges are not the same milestone, and a state can be enacted without yet being operational. <em>[VERIFY Louisiana's current Counseling Compact enactment and operational status at build time, directly via counselingcompact.org or the Louisiana LPC Board, before stating a specific status to any learner — this course was not built against a verified real-time confirmation, and the same caution applies here that this platform's Texas course states about the Texas Counseling Compact's own status.]</em></p>
<p>Even where a compact does apply, it is worth noting explicitly that a compact privilege-to-practice is not identical to Louisiana's own teletherapy privileging framework discussed in Sections 1 and 2 of this course, despite the unfortunate terminology overlap between "privilege to practice" (a compact concept) and "teletherapy privileging" (Louisiana's §505 concept). A clinician who obtains a compact privilege to practice in Louisiana from another member state would, under that arrangement, be authorized to practice generally in Louisiana under compact terms — but whether that authorization extends to teletherapy specifically, or whether Louisiana's own §505 teletherapy-specific requirements would still apply to that clinician's teletherapy practice once physically or administratively operating under Louisiana authorization, is a question this course did not confirm against primary compact-implementation text and flags for the same verification standard applied throughout this section. <em>[VERIFY how compact privilege-to-practice interacts with Louisiana's §505 teletherapy-specific privileging requirement, if at all, before advising a compact-privileged clinician that they are exempt from §505.]</em></p>
`,
    },
    {
      type: "text",
      content: `<h2>Emergency Planning Across State Lines</h2>
<p>The client-location-governs principle has a practical safety dimension that extends beyond licensure and privileging: a Louisiana clinician's crisis-response knowledge is typically built around Louisiana-specific resources — local emergency services, the nearest emergency department, familiar mobile crisis teams, and Louisiana's own involuntary-commitment procedures — none of which necessarily transfers when a client is disclosed to be physically located in another state for a given session, even briefly. A clinician who has confirmed a client is temporarily located in a neighboring state for reciprocal-compliance purposes, per the framework above, should also confirm, before proceeding with that session, what local emergency resources are available to that client at that specific location — the applicable crisis line, the nearest emergency facility, and any local mobile crisis or law-enforcement welfare-check procedure — rather than assuming the clinician's usual Louisiana-based crisis protocol will function correctly for a client who is not, at that moment, actually in Louisiana. The 988 Suicide and Crisis Lifeline functions nationally and routes based on the caller's location, which provides a baseline safety net regardless of where a client is physically located, but it does not substitute for a clinician's own working knowledge of more localized resources when the client's location is known to differ from their usual one.</p>
<p>This planning is most efficiently done proactively rather than reactively — building a brief, updatable reference for the states where a clinician's current caseload most commonly travels (family visits, seasonal relocation, work travel), rather than researching crisis resources for the first time in the middle of an active session where a client has just disclosed both an unfamiliar location and a safety concern simultaneously. A clinician's client-location verification practice, discussed in Section 3, and this emergency-planning practice are naturally paired: the same session-opening question that surfaces a change in physical location is the same moment that should trigger a mental (or, ideally, documented) check of whether the clinician's crisis-response knowledge for that location is current.</p>
<h2>Compact Eligibility Criteria, in More Detail</h2>
<p>Where the Counseling Compact is enacted and operational for a given pair of states, the eligibility criteria a clinician must typically satisfy to obtain a privilege to practice include: holding an active, unencumbered license in good standing in the clinician's home state; graduation from a program accredited by CACREP (or, in some compact frameworks, an equivalent accrediting body) or otherwise meeting the compact's education requirements; passage of a national licensing examination recognized by the compact; and a clean disciplinary history, free of any current or pending disciplinary action, license restriction, or criminal history that would disqualify the clinician under the compact's specific standards. A clinician who satisfies these criteria in their home state can, once the relevant compact infrastructure is operational, obtain privileges to practice in other member states more efficiently than pursuing full separate licensure state by state — but, as emphasized above, this privilege-to-practice mechanism is distinct from Louisiana's own §505 teletherapy-specific privileging, and a clinician relying on compact eligibility should not assume it automatically satisfies Louisiana's teletherapy-specific requirements without separate confirmation. <em>[VERIFY current Louisiana Counseling Compact enactment and operational status, and its interaction with §505, before advising any specific clinician on this pathway.]</em></p>
<p>Because compact status, registration pathways, and even the underlying licensing rules in any given state can change between legislative sessions, this course recommends a Louisiana clinician build a habit of checking current status directly — via the relevant state licensing board's website or the compact commission's own site — at the point of need, rather than relying on a static reference sheet compiled once and never revisited. A clinician who serves clients from a small, recurring set of neighboring states (for a Louisiana practice, most commonly Texas, Mississippi, and Arkansas) may find it efficient to maintain a brief, dated reference note for each of those specific states — current compact status, any known registration pathway, and the date it was last checked — updated periodically rather than researched from scratch every time a client happens to travel, while still treating that reference as a starting point for verification rather than a permanent, self-certifying answer.</p>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each scenario into whether a Louisiana-licensed clinician's existing privileging is sufficient, or additional authorization/action is needed.",
      categories: ["Existing Louisiana Privileging Is Sufficient", "Additional Authorization or Action Needed"],
      cards: [
        { id: "la-juris-1", text: "Client is physically located in Louisiana for the entire session", correctCategory: "Existing Louisiana Privileging Is Sufficient" },
        { id: "la-juris-2", text: "Client is a Louisiana resident temporarily visiting family in another state during the session", correctCategory: "Additional Authorization or Action Needed" },
        { id: "la-juris-3", text: "Client permanently relocates from Louisiana to another state", correctCategory: "Additional Authorization or Action Needed" },
        { id: "la-juris-4", text: "Clinician is traveling out of state, but the client remains physically in Louisiana for the session", correctCategory: "Existing Louisiana Privileging Is Sufficient" },
        { id: "la-juris-5", text: "An out-of-state colleague, not Louisiana-licensed, wants to provide ongoing teletherapy to a client physically located in Louisiana", correctCategory: "Additional Authorization or Action Needed" },
      ],
      explanation: "Client location — not clinician location or client residency — determines which state's rules apply. Item 5 needs full Louisiana licensure or an applicable compact privilege, since no Louisiana registration-only pathway analogous to Florida's has been confirmed. [VERIFY before publish.]",
    },
    {
      type: "scenarioTree",
      scenarioTitle: "The Out-of-State Client Call",
      instructions: "Your Louisiana-licensed client calls for their regular teletherapy session and mentions they arrived in a neighboring state yesterday for a two-week family visit.",
      startNode: "start",
      nodes: {
        start: {
          text: "The client sounds fine and wants to keep the appointment as scheduled. What do you do first?",
          options: [
            { text: "Proceed with the session as usual — the therapeutic relationship and clinical need haven't changed", next: "proceed_wrong" },
            { text: "Pause to research whether the client's current state has a telehealth pathway, compact coverage, or a strict licensure requirement for your license type", next: "research" },
          ],
        },
        proceed_wrong: {
          text: "You proceed with the session. Only afterward do you consider whether you were authorized to provide a service into the client's current state.",
          feedback: { message: "Clinical continuity is a real consideration, but it doesn't substitute for confirming authorization. The reciprocal-compliance obligation applies regardless of how routine the session feels.", type: "negative" },
        },
        research: {
          text: "You don't have enough time before the scheduled session to reach a confident answer about the neighboring state's requirements. What's the safest next step?",
          options: [
            { text: "Proceed anyway, since you'll likely find an answer eventually", next: "proceed_wrong" },
            { text: "Reschedule for the client's return to Louisiana, explain briefly, and provide local crisis-resource information for their current location", next: "reschedule" },
          ],
        },
        reschedule: {
          text: "You reschedule and document the reason, along with the crisis resources you provided. The client is mildly inconvenienced but understands.",
          feedback: { message: "This mirrors the recommended approach: when authorization to serve a client in their current location can't be confirmed in time, declining that specific session and documenting the reason protects both the client's safety planning and your own compliance record.", type: "positive" },
        },
      },
    },
    {
      type: "text",
      content: `<h2>Documenting the Reciprocal-Compliance Determination</h2>
<p>When a Louisiana clinician researches whether a client's temporary out-of-state location permits continued teletherapy, the research itself — not just its eventual conclusion — is worth documenting, both as good clinical practice and as a defensible record if the determination is ever questioned later. A brief documentation note for this kind of determination should capture: the date the client's out-of-state location was disclosed and how long the client expected to remain there; which sources were checked (the destination state's licensing board website, a compact-status resource, or direct contact with that state's board) and on what date; the conclusion reached (proceed, decline and reschedule, or refer) and the specific basis for that conclusion; and, if the decision was to proceed, what specific authorization was relied upon (a confirmed compact privilege, a confirmed registration under that state's own provision, or another specific basis — not merely "we checked and it seemed fine"). This level of specificity converts what might otherwise be a quick, undocumented judgment call into a clinical and compliance record that shows the clinician actually applied the reciprocal-compliance framework this section describes, rather than simply proceeding on assumption.</p>
`,
    },
    {
      type: "keyTakeaway",
      title: "Section 4 Key Takeaways",
      content: "<p>Louisiana's jurisdictional framework has three moving parts a Louisiana clinician must keep distinct: the general client-location-governs principle (which state's rules apply depends on where the client sits, not where either party is licensed); the reciprocal-compliance obligation (a Louisiana clinician serving a client temporarily out of state must comply with that state's rules, not just Louisiana's); and the nonresident-into-Louisiana question (Louisiana appears to lack a registration-only pathway comparable to Florida's, meaning out-of-state clinicians generally need full Louisiana licensure or applicable compact coverage to serve Louisiana-located clients — <em>VERIFY before treating as settled</em>).</p>",
      items: [
        "Client physical location at the time of the session, not clinician location or client residency, governs which state's rules apply",
        "A Louisiana clinician serving a client temporarily out of state must separately confirm authorization under that state's rules — Louisiana licensure alone does not automatically travel",
        "No Louisiana registration-only pathway for nonresident clinicians analogous to Florida's §456.47 has been confirmed — VERIFY this absence against primary text before relying on it",
        "Compact privilege-to-practice, where operational, is a distinct concept from Louisiana's own §505 teletherapy privileging, and how the two interact requires separate verification",
      ],
    },
    {
      type: "reflection",
      question: "List every state where your current teletherapy clients might realistically be physically located, even temporarily — travel, family visits, seasonal relocation. For each state outside Louisiana, do you actually know whether you are authorized to provide a session to a client located there? What is your plan for the next time a client discloses they are somewhere unexpected?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under the client-location-governs principle, which state's teletherapy rules apply to a given session?",
      options: [
        { text: "The state where the clinician is physically located", isCorrect: false },
        { text: "The state where the client is physically located at the time of the session", isCorrect: true },
        { text: "The state where the clinician holds their primary license", isCorrect: false },
        { text: "The state where the client maintains permanent residency, regardless of current location", isCorrect: false },
      ],
      explanation: "Services are considered delivered in the state where the client is physically located at the time of the session, regardless of clinician location or client permanent residency.",
    },
    {
      type: "multipleChoice",
      question: "A Louisiana-licensed clinician whose client is temporarily located in another state during a session must:",
      options: [
        { text: "Rely on Louisiana privileging alone, since the clinician is Louisiana-licensed", isCorrect: false },
        { text: "Simply document that the client is traveling, with no further action required", isCorrect: false },
        { text: "Separately confirm compliance with the client's current state's teletherapy requirements for that session", isCorrect: true },
        { text: "Cancel all future sessions with that client permanently", isCorrect: false },
      ],
      explanation: "The reciprocal-compliance obligation requires the Louisiana clinician to confirm authorization under the client's current state's rules, not merely rely on Louisiana privileging.",
    },
    {
      type: "multipleChoice",
      question: "Based on this course's research, does Louisiana offer a registration-only pathway for nonresident clinicians analogous to Florida's §456.47 provision?",
      options: [
        { text: "Yes, confirmed via primary LAC text", isCorrect: false },
        { text: "The question does not apply, since Louisiana has no jurisdictional rules at all", isCorrect: false },
        { text: "Yes, but only for LMFTs", isCorrect: false },
        { text: "No such pathway was identified in the search used to scope this course, but this absence requires primary-source verification before being treated as settled", isCorrect: true },
      ],
      explanation: "This course found no analogous pathway in its secondary-source search, but flags that absence explicitly for primary-source verification rather than presenting it as a confirmed fact.",
    },
  ],
};

// ═══ SECTION 5: Maintaining Privileging & Practice Sustainability ═══
const SECTION_5 = {
  title: "Maintaining Privileging and Practice Sustainability",
  order: 5,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 5,
      title: "Section 5",
      subtitle: "The 3-CEH-Per-Renewal Maintenance Requirement Across License Types, and Building a Recordkeeping Practice That Sustains It",
      bannerAlt: "Clinician tracking continuing education hours and renewal deadlines on a checklist",
    },
    {
      type: "text",
      content: `<h2>The Ongoing 3-CEH-Per-Renewal Requirement</h2>
<p>Sections 1 and 2 established the distinction this course returns to for the final time in this concluding section: the 3-clock-hour initial training is a one-time entry requirement, completed before a licensee first files for teletherapy privileging. Once privileging is granted, retaining it requires a separate, recurring obligation — 3 continuing education hours (CEH) specifically in teletherapy, completed every renewal period. This is the figure most frequently reported by secondary sources and third-party CE providers when they describe "Louisiana's 3-hour teletherapy requirement," and it is worth being explicit that this course has, throughout, used that same shorthand only when referring specifically to this renewal-maintenance obligation — never to the initial training, which this course has consistently labeled separately as the "3-clock-hour initial training." If you take one procedural habit from this course into your own recordkeeping, make it this: label these two obligations differently, every time, in every place you track them.</p>
<p>The renewal-maintenance requirement is well corroborated across the Louisiana LPC Board's own continuing-education overview materials and multiple third-party CE providers, which lends it reasonably high confidence as a real, current requirement. What is less consistently corroborated — and therefore requires the most careful verification before this course's content is relied upon for actual renewal compliance — is the precise Louisiana Revised Statutes citation for this requirement as applied to each specific license type. Secondary sources reviewed in scoping this course associate the following citations with the following license types: <strong>§707 for LPC</strong>, <strong>§3503 for LMFT</strong>, <strong>§611 for PLPC</strong> (provisional LPC), and <strong>§3315 for PLMFT</strong> (provisional LMFT). <em>[VERIFY each of these four citations independently against primary Louisiana Revised Statutes text before publishing or relying on any one of them — secondary sources suggest the citations diverge by license type in exactly this pattern, but this course did not confirm any of the four directly against primary statutory text, and an error here would misdirect a licensee to the wrong statutory provision for their specific license type.]</em></p>
<h2>License-Type-Specific Considerations</h2>
<p>The divergence in citation across license types raises a related question this course flags rather than resolves: whether the substantive content of the 3-CEH renewal-maintenance requirement is identical across LPC, LMFT, PLPC, and PLMFT license types, or whether meaningful differences exist beyond the citation itself — for example, whether provisional licensees (PLPC, PLMFT) face any additional supervisory-notification or co-signature requirement tied to their teletherapy CE that fully licensed practitioners do not. <em>[VERIFY whether the substantive requirement is uniform across these four license types, or whether provisional-license status introduces additional conditions, before advising a PLPC or PLMFT licensee that this course's general description applies to them without modification.]</em> A further open question concerns supervisory designations: whether LPC-S (Licensed Professional Counselor Supervisor) and LMFT-S (Licensed Marriage and Family Therapist Supervisor) credential holders are subject to the identical 3-CEH teletherapy renewal requirement as their non-supervisory counterparts, or whether the supervisory designation carries any distinct teletherapy-specific CE expectation given that supervisors may be responsible for reviewing supervisees' teletherapy practice. <em>[VERIFY this directly with the Board — this course was not able to confirm whether LPC-S/LMFT-S status changes the applicable requirement.]</em></p>
<p>Given this level of citation uncertainty, the practically safest posture for any Louisiana licensee using this course is not to memorize a specific statutory citation from this content and treat it as settled, but to use the citations above as a starting point for the licensee's own direct verification — checking the current Louisiana Revised Statutes text or confirming directly with the Board which specific provision governs their specific license type before their next renewal filing. This course's role is to make clear that the requirement exists, that it is separate from the initial training requirement, and that the citation may differ by license type — not to serve as the final authoritative source for which exact statutory section applies to any individual licensee.</p>
`,
    },
    {
      type: "text",
      content: `<h2>How Teletherapy CE Interacts With the General CE Requirement</h2>
<p>A separate practical question many licensees ask is whether teletherapy-specific CEH counts toward their general continuing-education requirement for license renewal, or whether it is an entirely separate obligation on top of the general requirement. Based on the pattern seen in comparable state frameworks — including Florida's alternating ethics-or-telehealth structure under F.A.C. 64B4-6.001(2)(b), where the telehealth hours satisfy a specific carved-out portion of the general CE total rather than adding to it — it would be reasonable to expect Louisiana's 3-CEH teletherapy requirement functions similarly, as a subset or carve-out within the general CE total rather than a fully additive obligation. <em>[VERIFY this directly against the Louisiana Revised Statutes provisions identified above (§707, §3503, §611, §3315) and any implementing LPC Board rule — this course infers a plausible structure by analogy to Florida's pattern but did not confirm Louisiana's actual treatment of this question against primary text, and the two states are not guaranteed to share the same structure simply because they share a similar figure.]</em> A licensee should not assume the teletherapy CEH is "extra credit" that automatically satisfies part of their general requirement, nor should they assume it is entirely separate and must be completed in addition to a full general CE load, without confirming which structure actually applies.</p>
<p>This uncertainty is precisely the kind of gap a licensee's own recordkeeping system should be built to surface rather than obscure. A licensee who logs teletherapy CEH in a way that makes clear which hours were teletherapy-specific — rather than folding them anonymously into a single undifferentiated CE total — is better positioned to answer this question correctly at renewal time, and better positioned to demonstrate compliance with both the general requirement and the teletherapy-specific requirement if the Board ever asks for documentation of either separately.</p>
<h2>A Practical Recordkeeping System</h2>
<p>Given the density of distinct requirements this course has walked through — a one-time initial training, a recurring renewal-maintenance requirement with license-type-specific citations, an open question about interaction with the general CE requirement, and the jurisdictional obligations from Section 4 that can arise at any point during an active caseload — a Louisiana teletherapy practice benefits from a dedicated tracking system rather than relying on memory or an undifferentiated general CE log. At minimum, such a system should record: the date the initial 3-clock-hour training was completed and the specific provider/course, distinct from any other CE record; the date the Declaration/Informed Consent addendum was filed and the date Board approval was confirmed (not merely the filing date); a running log of teletherapy-specific CEH completed each renewal period, labeled clearly as "teletherapy renewal maintenance CEH" and kept separate from the general CE log even if the two ultimately turn out to overlap; and a note of which statutory citation applies to the licensee's specific license type, confirmed directly against primary source rather than copied from this course without independent verification.</p>
<p>The Teletherapy Privileging Application Checklist referenced in this section's resources below is built around exactly this structure, and is intended as a starting template a licensee customizes and verifies against current Board requirements — not a substitute for that verification. Practice sustainability, in the sense this section's title intends, is less about any single compliance step and more about building a system durable enough that a licensee several renewal cycles from now can still answer, confidently and with documentation, exactly when their initial training was completed, when and how their privileging was approved, and which specific renewal periods' worth of the 3-CEH maintenance requirement have actually been satisfied.</p>
`,
    },
    {
      type: "text",
      content: `<h2>If You Discover a Gap</h2>
<p>A licensee working through this course may realize, partway through, that they have a gap somewhere in this framework — initial training that was never formally documented, a Declaration/Informed Consent addendum that was never actually filed despite years of teletherapy practice, or several renewal cycles' worth of teletherapy-specific CEH that were never separately tracked and may not have been completed at all. Discovering a gap is a materially better position than remaining unaware of it, and this course's closing recommendation for that situation is straightforward: do not attempt to informally "backfill" the record by retroactively characterizing past general telehealth CE as satisfying the specific §505 requirements without confirming that characterization is accurate, and do not continue providing teletherapy while quietly trying to resolve the gap in the background. Instead, pause new teletherapy intakes if the gap concerns current privileging status at all, complete whatever specific training or filing step is actually missing, and consider whether the situation warrants proactive disclosure to the Board or consultation with a healthcare attorney familiar with Louisiana licensing matters, particularly if the gap has persisted for an extended period or involved a substantial volume of teletherapy practice. <em>[VERIFY the Board's current self-disclosure and remediation posture for a licensee who discovers a past gap of this kind — this course was not able to confirm whether Louisiana offers anything resembling a voluntary self-report pathway with mitigated consequences, and a licensee in this situation should seek that answer directly from the Board or qualified counsel rather than assuming either a lenient or a punitive default.]</em></p>
<p>A related, easily overlooked step in this situation is checking the licensee's own professional liability insurance policy language. Many professional liability policies condition coverage on the insured practicing within the scope of their current license, and some policies specifically ask, at application or renewal, whether the insured provides telehealth or teletherapy services and whether any required state-specific authorization has been obtained. A licensee who discovers a privileging gap should review their current policy's specific language on this point — not assume coverage is unaffected — and consider whether the carrier should be notified, consistent with the policy's own disclosure requirements, separate from and in addition to any Board-facing remediation step. This is not a substitute for legal advice specific to the licensee's situation, but it is a concrete, checkable item that is easy to overlook when the immediate focus is on the Board-facing side of a discovered gap.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Building the Habit Into an Existing Renewal Cycle</h2>
<p>Most Louisiana licensees already maintain some form of general CE tracking to satisfy their license renewal requirement — a spreadsheet, a folder of certificates, or a CE-tracking feature built into a professional-liability insurer's member portal. The recommendation in this section is not to build an entirely separate system from scratch, but to add clearly labeled fields to whatever system a licensee already uses: a dedicated row or tag for "teletherapy initial training (one-time)," a separate dedicated row or tag for "teletherapy renewal CEH (recurring, per cycle)," and a note of the Board-confirmed filing and approval dates for the Declaration/Informed Consent addendum. This small addition converts a general CE log into one that can answer, at a glance, every question this course has raised: has initial training been completed, has the addendum been filed and approved, and how many teletherapy-specific CEH has the licensee logged for the current renewal cycle specifically.</p>
<p>A calendar reminder set well before each renewal deadline — not merely on the deadline itself — gives a licensee time to identify and close any teletherapy-CEH gap before it becomes a renewal-blocking problem, rather than discovering the shortfall during the renewal filing process itself, when options for completing additional CE on short notice are more limited and more expensive. Pairing that reminder with the recordkeeping habit described above means a licensee approaching renewal can answer the relevant compliance question confidently, with documentation in hand, rather than reconstructing their teletherapy CE history from memory under time pressure.</p>
<h2>Closing the Loop</h2>
<p>This course has asked Louisiana licensees to hold several distinct requirements in mind simultaneously: a one-time initial training that precedes first-time privileging, a Board filing that must be approved — not merely submitted — before teletherapy may lawfully begin, informed-consent obligations that go substantially beyond a generic telehealth consent form, a jurisdictional framework that depends on session-by-session client-location verification, and a recurring renewal-maintenance requirement whose exact statutory citation depends on license type and requires independent verification. None of these requirements is unusually difficult in isolation. The risk this course has repeatedly flagged is not complexity in any single requirement, but the ease of conflating requirements that share superficial similarities — most of all, the two "3 hour" figures this course has distinguished in every section. A Louisiana teletherapy practice built on clearly separated, well-documented compliance habits for each of these distinct requirements is a sustainable one; a practice built on the assumption that "I did the training" or "I've been doing telehealth for years" is sufficient, without the underlying documentation to demonstrate it, is not.</p>
`,
    },
    {
      type: "callout",
      calloutType: "key",
      title: "Before Your Next Renewal — The Distinction, One Last Time",
      content: "<p>The 3-clock-hour <strong>initial training</strong> (Section 2) is a one-time requirement completed before your first privileging filing — it does not need to be repeated. The 3-CEH <strong>renewal maintenance requirement</strong> (this section) recurs every renewal period and must be completed repeatedly to retain privileged status. Confirm which one you have actually completed for your current renewal cycle before assuming either satisfies the other, and verify the applicable statutory citation for your specific license type (LPC, LMFT, PLPC, or PLMFT) directly with the Board.</p>",
    },
    {
      type: "matching",
      matchingInstructions: "Match each license type to its secondary-source-reported statutory citation for the 3-CEH renewal maintenance requirement (all require independent verification).",
      matchingPairs: [
        { term: "LPC", definition: "§707 [VERIFY against primary Louisiana Revised Statutes text]" },
        { term: "LMFT", definition: "§3503 [VERIFY against primary Louisiana Revised Statutes text]" },
        { term: "PLPC (Provisional LPC)", definition: "§611 [VERIFY against primary Louisiana Revised Statutes text]" },
        { term: "PLMFT (Provisional LMFT)", definition: "§3315 [VERIFY against primary Louisiana Revised Statutes text]" },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 5 Key Takeaways",
      content: "<p>The 3-CEH-per-renewal teletherapy maintenance requirement is a separate, recurring obligation from the one-time 3-clock-hour initial training, well corroborated as a real requirement but with license-type-specific statutory citations that require independent verification before relying on any one of them. Whether this requirement is additive to or a carve-out within a licensee's general CE total is inferred by analogy to Florida's pattern, not confirmed against Louisiana primary text, and should be verified directly. A dedicated, clearly labeled tracking system — separating initial training, privileging filing/approval dates, and renewal-cycle CEH — is the practical foundation for sustaining privileged status across a full career.</p>",
      items: [
        "3 CEH per renewal is a recurring maintenance requirement, distinct from the one-time 3-clock-hour initial training",
        "Statutory citations differ by license type (§707 LPC, §3503 LMFT, §611 PLPC, §3315 PLMFT per secondary sources) — VERIFY each independently",
        "Whether teletherapy CEH counts toward or in addition to the general CE requirement is unconfirmed and should be verified directly with the Board",
        "A dedicated recordkeeping system — not memory, not an undifferentiated general CE log — is the practical safeguard against losing track of either requirement",
      ],
    },
    {
      type: "resources",
      title: "Practice Templates — Louisiana Teletherapy",
      description: "Downloadable worksheets to support Louisiana-compliant teletherapy privileging and practice.",
      resources: [
        {
          title: "Teletherapy Declaration & Informed Consent Addendum — LA §505 Compliant",
          url: "/downloads/CR-TMH604_LA_Teletherapy_Consent.docx",
          type: "worksheet",
          description: "Editable template covering the §505.F informed-consent elements and client-location documentation. Human legal review required before clinical use.",
        },
        {
          title: "Teletherapy Privileging Application Checklist",
          url: "/downloads/CR-TMH604_LA_Privileging_Checklist.docx",
          type: "worksheet",
          description: "Step-by-step checklist for completing initial training, filing the Board declaration, and tracking the 3-CEH/renewal maintenance requirement.",
        },
      ],
    },
    {
      type: "text",
      content: `<div class="cr-references">
<h2>References</h2>
<p class="cr-reference">Acierno, R., Knapp, R., Tuerk, P., Gilmore, A. K., Lejuez, C., Ruggiero, K., Muzzy, W., Egede, L., Hernandez-Tejada, M. A., &amp; Foa, E. B. (2017). A non-inferiority trial of prolonged exposure for posttraumatic stress disorder: In person versus home-based telehealth. <em>Behaviour Research and Therapy, 89</em>, 57–65.</p>
<p class="cr-reference">American Counseling Association. (2014). <em>ACA code of ethics</em>. Author.</p>
<p class="cr-reference">American Psychological Association. (2013). Guidelines for the practice of telepsychology. <em>American Psychologist, 68</em>(9), 791–800.</p>
<p class="cr-reference">Andrews, G., Basu, A., Cuijpers, P., Craske, M. G., McEvoy, P., English, C. L., &amp; Newby, J. M. (2018). Computer therapy for the anxiety and depression disorders is effective, acceptable and practical health care: An updated meta-analysis. <em>Journal of Anxiety Disorders, 55</em>, 70–78.</p>
<p class="cr-reference">Batastini, A. B., Paprzycki, P., Jones, A. C. T., &amp; MacLean, N. (2021). Are videoconferenced mental and behavioral health services just as good as in-person? A meta-analysis of a fast-growing practice. <em>Clinical Psychology Review, 83</em>, 101944.</p>
<p class="cr-reference">Dwyer, T. F. (1973). Telepsychiatry: Psychiatric consultation by interactive television. <em>American Journal of Psychiatry, 130</em>(8), 865–869.</p>
<p class="cr-reference">Hilty, D. M., Ferrer, D. C., Parish, M. B., Johnston, B., Callahan, E. J., &amp; Yellowlees, P. M. (2013). The effectiveness of telemental health: A 2013 review. <em>Telemedicine and e-Health, 19</em>(6), 444–454.</p>
<p class="cr-reference">Lakeman, R., &amp; Crighton, J. (2021). The impact of social distancing on people with borderline personality disorder: The views of dialectical behavioural therapists. <em>Issues in Mental Health Nursing, 42</em>(7), 651–658.</p>
<p class="cr-reference">Lenferink, L. I. M., Meyerbröker, K., &amp; Boelen, P. A. (2020). PTSD treatment in times of COVID-19: A systematic review of the effects of online EMDR. <em>Journal of EMDR Practice and Research, 14</em>(4), 257–270.</p>
<p class="cr-reference">Louisiana Licensed Professional Counselors Board of Examiners. (2024). <em>Teletherapy guidelines for licensees — frequently asked questions</em>. lpcboard.org. [VERIFY current URL and publication date before publish.]</p>
<p class="cr-reference">Louisiana Licensed Professional Counselors Board of Examiners. (n.d.). <em>Teletherapy guidelines for licensees</em> [Rule text]. LAC Title 46, Part LX, Chapter 5, §505. [VERIFY citation directly against the live Louisiana Administrative Code before publish.]</p>
<p class="cr-reference">Louisiana Register. (n.d.). <em>Notice of intent — professional and occupational standards, licensed professional counselors board of examiners, teletherapy</em>. [VERIFY specific issue, volume, and effective date before publish.]</p>
<p class="cr-reference">Luik, A. I., Kyle, S. D., &amp; Espie, C. A. (2017). Digital cognitive behavioral therapy (dCBT) for insomnia: A state-of-the-science review. <em>Current Sleep Medicine Reports, 3</em>(2), 48–56.</p>
<p class="cr-reference">Telehealth Certification Institute. (2024). <em>State-by-state teletherapy requirements: Louisiana summary</em>. telehealthcertificationinstitute.org. [VERIFY current URL and publication date before publish.]</p>
<p class="cr-reference">Thase, M. E., McCrone, P., Barrett, M. S., Eells, T. D., Wisniewski, S. R., Balasubramani, G. K., Brown, G. K., &amp; Wright, J. H. (2020). Improving cost-effectiveness and access to cognitive behavior therapy for depression: Providing remote-ready, computer-assisted psychotherapy in times of crisis and always. <em>Psychotherapy and Psychosomatics, 89</em>(5), 307–313.</p>
<p class="cr-reference">Wittson, C. L., Affleck, D. C., &amp; Johnson, V. (1961). Two-way television in group therapy. <em>Mental Hospitals, 12</em>(11), 22–23.</p>
<p class="cr-reference">Wootton, B. M. (2016). Remote cognitive-behavior therapy for obsessive-compulsive symptoms: A meta-analysis. <em>Clinical Psychology Review, 43</em>, 103–113.</p>
</div>
`,
    },
    {
      type: "reflection",
      question: "Looking across all five sections of this course, which single requirement — initial training, the Declaration/Informed Consent addendum filing, session-by-session client-location verification, reciprocal compliance for out-of-state clients, or renewal-maintenance CEH tracking — are you currently least confident you have fully satisfied? What is the first concrete step you will take this week to verify or close that gap?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "The 3-CEH-per-renewal teletherapy maintenance requirement is:",
      options: [
        { text: "A separate, recurring obligation required to retain teletherapy privileging once granted", isCorrect: true },
        { text: "The same requirement as the one-time 3-clock-hour initial training, described differently", isCorrect: false },
        { text: "Only required in a licensee's very first renewal period after being privileged", isCorrect: false },
        { text: "Optional for licensees who completed the initial training with high marks", isCorrect: false },
      ],
      explanation: "The 3-CEH-per-renewal requirement recurs every renewal period and is legally distinct from the one-time initial training requirement.",
    },
    {
      type: "multipleChoice",
      question: "According to secondary sources reviewed in building this course, which statutory citation is associated with the LMFT teletherapy renewal CEH requirement?",
      options: [
        { text: "§707", isCorrect: false },
        { text: "§3503", isCorrect: true },
        { text: "§611", isCorrect: false },
        { text: "§3315", isCorrect: false },
      ],
      explanation: "Secondary sources associate §3503 with LMFT; §707 with LPC, §611 with PLPC, and §3315 with PLMFT — all four require independent verification against primary statutory text before publish.",
    },
    {
      type: "multipleChoice",
      question: "Whether Louisiana's teletherapy renewal CEH counts toward or in addition to a licensee's general CE requirement is:",
      options: [
        { text: "Explicitly confirmed as additive by this course's primary-source research", isCorrect: false },
        { text: "Not a relevant question, since Louisiana has no general CE requirement", isCorrect: false },
        { text: "Inferred by analogy to Florida's carve-out structure, but not confirmed against Louisiana primary text — requires direct verification", isCorrect: true },
        { text: "Confirmed as fully separate and additive for all four license types", isCorrect: false },
      ],
      explanation: "This course infers a plausible structure by analogy to Florida's alternating CE pattern but explicitly flags that Louisiana's actual treatment of this question was not confirmed against primary text.",
    },
  ],
};

// ═══ ASSESSMENT (18 questions, 80% pass, 3 attempts) ═══
const ASSESSMENT_QUESTIONS = [
  {
    question: "What structurally distinguishes Louisiana's teletherapy framework from the CE-contingent models used in Georgia, Texas, and Florida?",
    options: [
      { text: "Louisiana requires no continuing education at all for teletherapy", isCorrect: false },
      { text: "Louisiana only regulates teletherapy for LMFTs, not LPCs", isCorrect: false },
      { text: "Louisiana's requirements are identical to Georgia's Rule 135-11", isCorrect: false },
      { text: "Louisiana requires an affirmative, Board-recorded privileging status obtained through initial training plus a Board filing, not just CE compliance layered on a base license", isCorrect: true },
    ],
    explanation: "Louisiana's §505 privileging model requires an affirmative Board-recorded authorization, distinct from the CE-contingent models used elsewhere.",
  },
  {
    question: "A Louisiana licensee providing teletherapy without completed §505 privileging is best characterized as:",
    options: [
      { text: "Practicing outside the scope of their current license", isCorrect: true },
      { text: "Behind on a CE requirement, similar to a Georgia Rule 135-11 gap", isCorrect: false },
      { text: "Fully authorized as long as they intend to file eventually", isCorrect: false },
      { text: "Only at risk if a client formally complains", isCorrect: false },
    ],
    explanation: "Louisiana frames unprivileged teletherapy practice as out-of-scope-of-license practice, a more serious category than a CE compliance deficiency.",
  },
  {
    question: "What is the minimum duration and permitted format of Louisiana's initial teletherapy training requirement?",
    options: [
      { text: "6 clock hours, synchronous only", isCorrect: false },
      { text: "3 clock hours, synchronous or asynchronous", isCorrect: true },
      { text: "2 clock hours, asynchronous only", isCorrect: false },
      { text: "3 CEH, synchronous only", isCorrect: false },
    ],
    explanation: "The initial training requirement is a minimum of 3 clock hours and may be completed synchronously or asynchronously.",
  },
  {
    question: "Teletherapy privileging in Louisiana is conferred upon:",
    options: [
      { text: "Completion of the initial 3-clock-hour training alone", isCorrect: false },
      { text: "Mere submission of the Declaration/Informed Consent addendum", isCorrect: false },
      { text: "Board approval of the filed Declaration/Informed Consent addendum", isCorrect: true },
      { text: "The licensee's own determination of readiness", isCorrect: false },
    ],
    explanation: "Privileged status is conferred upon Board approval of the filing, not upon training completion or submission alone.",
  },
  {
    question: "According to secondary sources referenced in this course, the Louisiana Board's review of Declaration/Informed Consent addendum filings appears to follow:",
    options: [
      { text: "Same-day automatic approval", isCorrect: false },
      { text: "No defined review process at all", isCorrect: false },
      { text: "An annual review cycle tied to license renewal", isCorrect: false },
      { text: "A monthly batch-review cadence — VERIFY directly with the Board before relying on this timeline", isCorrect: true },
    ],
    explanation: "Secondary sources suggest a monthly batch-review cadence, but this course flags that timeline for direct verification with the Board.",
  },
  {
    question: "Which of the following is one of the §505.F informed-consent content areas this course discusses?",
    options: [
      { text: "A technical-failure protocol specifying backup contact and reconnection procedures", isCorrect: true },
      { text: "The client's insurance deductible amount", isCorrect: false },
      { text: "The clinician's personal cell phone carrier", isCorrect: false },
      { text: "The client's employer's telehealth policy", isCorrect: false },
    ],
    explanation: "§505.F requires disclosure of a technical-failure protocol, along with technology/parameters, billing differences, and cross-jurisdictional limitations.",
  },
  {
    question: "A written teletherapy consent document that restates §505.F's topic headings without substantive content under each heading:",
    options: [
      { text: "Fully satisfies the requirement, since the topics are named", isCorrect: false },
      { text: "Does not meaningfully satisfy the ethical or regulatory purpose of the requirement", isCorrect: true },
      { text: "Satisfies the requirement only for provisional licensees", isCorrect: false },
      { text: "Is sufficient regardless of content, if signed by the client", isCorrect: false },
    ],
    explanation: "Generic restatement of headings without specific disclosures does not substantively satisfy the informed-consent purpose.",
  },
  {
    question: "Client physical location should be verified and documented:",
    options: [
      { text: "Only once, during intake", isCorrect: false },
      { text: "Only when the client explicitly mentions travel", isCorrect: false },
      { text: "At the start of every teletherapy session", isCorrect: true },
      { text: "Only for clients located outside Louisiana at intake", isCorrect: false },
    ],
    explanation: "Because jurisdiction depends on the client's physical location at the time of each session, location should be confirmed and documented every session.",
  },
  {
    question: "Under the client-location-governs principle, which state's teletherapy rules apply to a given session?",
    options: [
      { text: "The state where the clinician is physically located", isCorrect: false },
      { text: "The state where the clinician holds their primary license", isCorrect: false },
      { text: "The state where the client maintains permanent residency, regardless of current location", isCorrect: false },
      { text: "The state where the client is physically located at the time of the session", isCorrect: true },
    ],
    explanation: "Services are considered delivered in the state where the client is physically located at the time of the session.",
  },
  {
    question: "A Louisiana-licensed clinician whose client is temporarily located in another state during a session must:",
    options: [
      { text: "Separately confirm compliance with that state's teletherapy requirements for that session", isCorrect: true },
      { text: "Rely on Louisiana privileging alone", isCorrect: false },
      { text: "Simply document the travel, with no further action required", isCorrect: false },
      { text: "Permanently terminate the therapeutic relationship", isCorrect: false },
    ],
    explanation: "The reciprocal-compliance obligation requires confirming authorization under the client's current state's rules, not relying on Louisiana privileging alone.",
  },
  {
    question: "Based on this course's research, does Louisiana offer a registration-only pathway for nonresident clinicians comparable to Florida's §456.47 provision?",
    options: [
      { text: "Yes, confirmed via primary LAC text", isCorrect: false },
      { text: "No such pathway was identified, but this absence requires primary-source verification before being treated as settled", isCorrect: true },
      { text: "Yes, but only for provisional licensees", isCorrect: false },
      { text: "The question is inapplicable, since Louisiana has no jurisdictional framework", isCorrect: false },
    ],
    explanation: "This course found no analogous pathway in its secondary-source search and explicitly flags that absence for primary-source verification.",
  },
  {
    question: "A compact \"privilege to practice\" and Louisiana's §505 \"teletherapy privileging\" are:",
    options: [
      { text: "The same concept, described with different terminology", isCorrect: false },
      { text: "Mutually exclusive — a licensee cannot hold both", isCorrect: false },
      { text: "Distinct concepts whose interaction requires separate verification, despite the overlapping terminology", isCorrect: true },
      { text: "Both automatically granted upon Louisiana licensure", isCorrect: false },
    ],
    explanation: "Compact privilege-to-practice and Louisiana's own teletherapy-specific privileging are distinct concepts; how one interacts with the other was not confirmed against primary text.",
  },
  {
    question: "The 3-CEH-per-renewal teletherapy maintenance requirement is:",
    options: [
      { text: "The same requirement as the one-time 3-clock-hour initial training", isCorrect: false },
      { text: "Optional for licensees who scored highly on their initial training assessment", isCorrect: false },
      { text: "Only required in a licensee's very first renewal period after being privileged", isCorrect: false },
      { text: "A separate, recurring obligation required to retain teletherapy privileging once granted", isCorrect: true },
    ],
    explanation: "The 3-CEH-per-renewal requirement recurs every renewal period and is legally distinct from the one-time initial training requirement.",
  },
  {
    question: "According to secondary sources reviewed in building this course, which statutory citation is associated with the LPC teletherapy renewal CEH requirement?",
    options: [
      { text: "§707", isCorrect: true },
      { text: "§3503", isCorrect: false },
      { text: "§611", isCorrect: false },
      { text: "§3315", isCorrect: false },
    ],
    explanation: "Secondary sources associate §707 with LPC; §3503 with LMFT, §611 with PLPC, and §3315 with PLMFT — all four require independent verification.",
  },
  {
    question: "Which statutory citation is associated with the PLMFT (Provisional LMFT) teletherapy renewal CEH requirement, per secondary sources reviewed in this course?",
    options: [
      { text: "§707", isCorrect: false },
      { text: "§3315", isCorrect: true },
      { text: "§611", isCorrect: false },
      { text: "§3503", isCorrect: false },
    ],
    explanation: "Secondary sources associate §3315 with PLMFT — VERIFY against primary Louisiana Revised Statutes text before relying on it.",
  },
  {
    question: "Whether Louisiana's teletherapy renewal CEH counts toward or in addition to a licensee's general CE requirement is:",
    options: [
      { text: "Explicitly confirmed as additive by this course's primary-source research", isCorrect: false },
      { text: "Not a relevant question, since Louisiana has no general CE requirement", isCorrect: false },
      { text: "Inferred by analogy to Florida's carve-out structure, but not confirmed against Louisiana primary text", isCorrect: true },
      { text: "Confirmed as fully separate for all four license types", isCorrect: false },
    ],
    explanation: "This course infers a plausible structure by analogy but explicitly flags that Louisiana's actual treatment was not confirmed against primary text.",
  },
  {
    question: "Which recordkeeping practice does this course recommend to avoid conflating Louisiana's two teletherapy \"3 hour\" requirements?",
    options: [
      { text: "Logging all CE hours in a single undifferentiated total", isCorrect: false },
      { text: "Tracking only the renewal-maintenance requirement, since initial training need not be documented long-term", isCorrect: false },
      { text: "Relying on memory rather than written records", isCorrect: false },
      { text: "Labeling and tracking the initial training and the renewal-maintenance CEH separately and consistently", isCorrect: true },
    ],
    explanation: "This course recommends consistently labeling and separately tracking the one-time initial training and the recurring renewal-maintenance CEH.",
  },
  {
    question: "In what year did the first documented use of telecommunication technology for psychiatric consultation occur, per the general teletherapy evidence base this course draws on?",
    options: [
      { text: "1959 at the Nebraska Psychiatric Institute", isCorrect: true },
      { text: "1972 at Massachusetts General Hospital", isCorrect: false },
      { text: "1995 with the emergence of email-based therapy", isCorrect: false },
      { text: "2001 with the first consumer videoconferencing platforms", isCorrect: false },
    ],
    explanation: "The first documented telepsychiatry consultation occurred in 1959 at the Nebraska Psychiatric Institute, using closed-circuit television.",
  },
];

// ═══ REFERENCES (course.references[] — structured, feeds the player's References tab) ═══
const REFERENCES = [
  { title: "A non-inferiority trial of prolonged exposure for PTSD: In person versus home-based telehealth", author: "Acierno, R., Knapp, R., Tuerk, P., et al.", year: 2017, source: "Behaviour Research and Therapy, 89, 57-65" },
  { title: "ACA code of ethics", author: "American Counseling Association", year: 2014, source: "Author" },
  { title: "Guidelines for the practice of telepsychology", author: "American Psychological Association", year: 2013, source: "American Psychologist, 68(9), 791-800" },
  { title: "Computer therapy for the anxiety and depression disorders is effective", author: "Andrews, G., Basu, A., Cuijpers, P., et al.", year: 2018, source: "Journal of Anxiety Disorders, 55, 70-78" },
  { title: "Are videoconferenced mental and behavioral health services just as good as in-person?", author: "Batastini, A. B., Paprzycki, P., Jones, A. C. T., & MacLean, N.", year: 2021, source: "Clinical Psychology Review, 83, 101944" },
  { title: "Telepsychiatry: Psychiatric consultation by interactive television", author: "Dwyer, T. F.", year: 1973, source: "American Journal of Psychiatry, 130(8), 865-869" },
  { title: "The effectiveness of telemental health: A 2013 review", author: "Hilty, D. M., Ferrer, D. C., Parish, M. B., et al.", year: 2013, source: "Telemedicine and e-Health, 19(6), 444-454" },
  { title: "The impact of social distancing on people with BPD", author: "Lakeman, R., & Crighton, J.", year: 2021, source: "Issues in Mental Health Nursing, 42(7), 651-658" },
  { title: "EMDR online: Can we do it? If so, how?", author: "Lenferink, L. I. M., Meyerbröker, K., & Boelen, P. A.", year: 2020, source: "Journal of EMDR Practice and Research, 14(4), 257-270" },
  { title: "Digital cognitive behavioral therapy for insomnia: A state-of-the-science review", author: "Luik, A. I., Kyle, S. D., & Espie, C. A.", year: 2017, source: "Current Sleep Medicine Reports, 3(2), 48-56" },
  { title: "Improving cost-effectiveness and access to CBT for depression", author: "Thase, M. E., McCrone, P., Barrett, M. S., et al.", year: 2020, source: "Psychotherapy and Psychosomatics, 89(5), 307-313" },
  { title: "Two-way television in group therapy", author: "Wittson, C. L., Affleck, D. C., & Johnson, V.", year: 1961, source: "Mental Hospitals, 12(11), 22-23" },
  { title: "Remote CBT for obsessive-compulsive symptoms: A meta-analysis", author: "Wootton, B. M.", year: 2016, source: "Clinical Psychology Review, 43, 103-113" },
  { title: "Teletherapy guidelines for licensees — frequently asked questions", author: "Louisiana Licensed Professional Counselors Board of Examiners", year: 2024, source: "lpcboard.org [VERIFY current URL/date]" },
  { title: "Teletherapy guidelines for licensees", author: "Louisiana Licensed Professional Counselors Board of Examiners", year: 0, source: "LAC Title 46, Part LX, Chapter 5, §505 [VERIFY against live LAC text]" },
  { title: "Notice of intent — professional and occupational standards, teletherapy", author: "Louisiana Register", year: 0, source: "[VERIFY specific issue, volume, and effective date]" },
  { title: "State-by-state teletherapy requirements: Louisiana summary", author: "Telehealth Certification Institute", year: 2024, source: "telehealthcertificationinstitute.org [VERIFY current URL/date]" },
];

// ═══ COURSE DATA ═══
const COURSE_DATA = {
  slug: "teletherapy-privileging-la-505",
  title: "Teletherapy Privileging for Louisiana Mental Health Professionals",
  subtitle: "LAC Title 46, Part LX §505 • Teletherapy Privileging CE",
  description: "This 3-hour continuing education course prepares Louisiana-licensed counselors and marriage and family therapists to obtain and maintain board-approved teletherapy privileging under LAC Title 46, Part LX, Chapter 5, §505. Covers the initial training and Declaration/Informed Consent addendum filing process, §505.F informed-consent elements, jurisdictional and multi-state practice rules, and the ongoing 3-CEH-per-renewal maintenance requirement — with explicit, recurring attention to how the one-time initial training and the recurring renewal requirement are legally distinct, though both are commonly cited as \"3 hours.\"",
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

  accessType: "paid",
  pricingTier: "standard",

  status: "draft",
  isPublished: false,

  objectives: [
    "Distinguish Louisiana's board-approved teletherapy privileging model — including its one-time initial training and separate ongoing renewal requirement — from the CE-contingent telehealth authorization models used in Georgia, Texas, and Florida.",
    "Describe the LAC §505 initial training content requirements and the process for filing the Declaration/Informed Consent for Teletherapy Services addendum with the Louisiana LPC Board.",
    "Construct an informed-consent process that satisfies §505.F's teletherapy-specific elements alongside verbal-and-written documentation requirements.",
    "Apply the client-location-governs jurisdiction principle to Louisiana teletherapy practice, including the reciprocal-compliance obligation for Louisiana clinicians serving out-of-state clients and the licensure requirement for nonresident clinicians serving Louisiana-located clients.",
    "Track the 3-CEH-per-renewal teletherapy maintenance requirement across license types (LPC, LMFT, PLPC, PLMFT) and build a recordkeeping practice that keeps it distinct from the one-time initial training requirement.",
    "Explain the disciplinary and liability exposure of practicing teletherapy in Louisiana without completed §505 privileging.",
  ],

  targetAudience: [
    "Licensed Professional Counselors (LPC)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Provisional Licensed Professional Counselors (PLPC)",
    "Provisional Licensed Marriage and Family Therapists (PLMFT)",
    "LPC Supervisors (LPC-S) and LMFT Supervisors (LMFT-S)",
    "National Certified Counselors (NCC)",
  ],

  instructionalLevel: "Intermediate",

  categories: ["Telehealth", "Louisiana Requirements", "Professional Practice", "Clinical Skills"],
  tags: ["telehealth", "teletherapy", "Louisiana", "LAC Title 46 Part LX §505", "board privileging", "informed consent", "jurisdiction", "continuing education"],

  sections: [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5],

  assessment: {
    title: "Final Assessment: Teletherapy Privileging for Louisiana Mental Health Professionals",
    passingScore: 80,
    maxAttempts: 3,
    instructions: "This assessment evaluates your understanding of Louisiana's teletherapy privileging framework, the informed-consent requirements under §505.F, jurisdictional and multi-state practice rules, and the ongoing renewal-maintenance requirement. You must score 80% or higher to receive CE credit. You have a maximum of 3 attempts.",
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
  console.log("\n⚠️  DRAFT — human review required before publish, including regulatory citation verification.");
  console.log("   Every [VERIFY] flag in this file's header and content must be resolved against");
  console.log("   primary Louisiana Administrative Code / Revised Statutes text before publish.");
  console.log("\n📁 DEPLOY WORKSHEETS:");
  console.log("   Copy these files to client/public/downloads/ in your GitHub repo:");
  console.log("   - CR-TMH604_LA_Teletherapy_Consent.docx");
  console.log("   - CR-TMH604_LA_Privileging_Checklist.docx");
  console.log("   (Not yet generated — flag for the same verify-then-build flow used for CR-TMH602/603.)");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
