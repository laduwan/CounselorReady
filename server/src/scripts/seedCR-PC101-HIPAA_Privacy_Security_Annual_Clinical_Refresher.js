/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * seedCR-PC101 — HIPAA Privacy & Security: Annual Clinical Refresher (1.5 CE)
 * Practice Compliance module · Tier 1 · ethics/risk-management framing
 *
 * Built on _seedTemplate.js canonical pattern: model-based upsert via doc.save()
 * (fires wordCount pre-save hook + schema validation). UPSERT by slug; no deletes.
 *
 * Ships as STATUS: DRAFT. Owner CE sign-off flips status/isPublished and the
 * ComplianceCourseMeta.ceEligible flag — this script touches neither.
 *
 * BEFORE running, audit (no DB needed):
 *   node src/scripts/auditCourse.js --file src/scripts/seedCR-PC101-HIPAA_Privacy_Security_Annual_Clinical_Refresher.js
 * Run from ~/project/src/server :
 *   node src/scripts/seedCR-PC101-HIPAA_Privacy_Security_Annual_Clinical_Refresher.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const COURSE = {
  title: 'HIPAA Privacy & Security: Annual Clinical Refresher',
  slug: 'cr-pc101-hipaa-privacy-security-annual-clinical-refresher',
  courseCode: 'CR-PC101',
  subtitle: 'Confidentiality decision-making, documentation risk, and the ethics of protected health information in clinical practice',
  description: 'An annual refresher for practicing clinicians that treats HIPAA not as a regulation to memorize but as a clinical ethics and risk-management discipline. Covers the Privacy Rule at the point of care, psychotherapy notes versus the clinical record, client rights and records requests, Security Rule safeguards for modern practice (devices, email, texting, telehealth, home offices), disclosures without authorization, breach response, and an annual self-audit protocol. Built around board-complaint patterns and clinical vignettes drawn from outpatient behavioral health practice.',

  ceHours: 1.5, ceuHours: 1.5, credits: 1.5, ceuEligible: true,
  level: 'Intermediate',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',

  accessType: 'subscription', pricingTier: 'standard',

  status: 'draft', isPublished: false, isActive: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },

  objectives: [
    'Apply the minimum necessary standard and the Privacy Rule use-and-disclosure framework to routine clinical decisions, including treatment coordination, billing, and consultation.',
    'Distinguish psychotherapy notes from the designated record set and apply the correct protection, release, and documentation rules to each.',
    'Implement administrative, physical, and technical safeguards proportionate to a solo, group, or telehealth practice, including device, email, texting, and home-office controls.',
    'Respond to records requests, subpoenas, suspected breaches, and other high-risk events using an ethics-based decision protocol that satisfies both HIPAA and professional codes of ethics.',
  ],
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychologists, psychiatric NPs) and associate-level clinicians under supervision.'],

  sections: [
    // ════════════════════════════════════════════════════════════════════
    // SECTION 1 — Confidentiality as Clinical Ethics
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Confidentiality as Clinical Ethics, Not Paperwork',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '1', title: 'Confidentiality as Clinical Ethics, Not Paperwork', subtitle: 'Why an annual refresher is a clinical discipline rather than a compliance ritual' },

        { type: 'text', order: 2, content: `<h2>The Annual Question</h2>
<p>Every clinician who has practiced for more than a year or two has had the experience: a records request arrives from an attorney, or a parent demands to see a teenager's file, or a colleague asks "did you hear about Marcus's new client?" in the break room, or a laptop bag is left in the back seat of a car that gets broken into. In that moment, the abstract architecture of the Health Insurance Portability and Accountability Act stops being abstract. The question is never "what does 45 CFR Part 164 say?" The question is "what do I do in the next ten minutes?"</p>
<p>This refresher is built for that moment. It is framed as an exercise in clinical ethics and risk management rather than regulatory recitation, for a simple reason: the clinicians who get into trouble with confidentiality are almost never the ones who failed to memorize the regulation. They are the ones who failed to recognize that an ordinary clinical moment had become a confidentiality decision. The skill this course refreshes annually is recognition — seeing the decision point before you are past it — and a repeatable way of reasoning through it once you do.</p>
<p>There is a second reason for the ethics framing. HIPAA is a federal floor, not a professional ceiling. The ACA Code of Ethics (2014), the NBCC Code of Ethics, the NASW Code of Ethics, and the AAMFT Code of Ethics each impose confidentiality duties that are in several places stricter than HIPAA, and state licensing boards discipline clinicians against those codes, not against federal regulation. A disclosure can be perfectly lawful under HIPAA and still be an ethics violation that costs you your license. The reverse is rarer but real: an action your ethics code would tolerate can still be a HIPAA violation carrying civil penalties. Competent practice means holding both frameworks at once and complying with whichever is stricter in the situation at hand.</p>
<h3>What Enforcement Actually Looks Like for Behavioral Health</h3>
<p>It is worth being honest about the enforcement landscape, because it shapes where your real risk lives. The HHS Office for Civil Rights (OCR) enforces HIPAA through complaint investigations, breach-report investigations, and periodic enforcement initiatives. Civil monetary penalties are tiered by culpability — from "did not know" through "willful neglect, not corrected" — and the upper tiers reach into seven figures per violation category per year. OCR has in recent years run a sustained enforcement initiative around the right of access, repeatedly fining small providers, including solo behavioral health practices, for failing to give patients timely copies of their own records. That detail surprises many clinicians: some of the most common OCR enforcement actions against small practices are not about leaking information, but about refusing or delaying lawful access to it.</p>
<p>For a behavioral health clinician, however, the more probable adverse event is not an OCR fine. It is a licensing board complaint. Boards receive confidentiality complaints from clients, from estranged parents in custody disputes, from ex-partners of clients, and from other clinicians. Board investigations are triggered by the kinds of errors this course catalogs: discussing a client in an elevator, confirming to a caller that someone is "a client here," releasing couple's records to one member of the couple without the other's authorization, responding to a negative online review with any detail at all, or texting session content to the wrong number. The dollar penalties of HIPAA make headlines; the board complaint is what ends careers. Annual refresher training is one of the few interventions that demonstrably reduces both, because the failure mode in nearly every case is a habituated practice — a shortcut that hardened into routine — and habits respond to scheduled re-examination.</p>
<h3>The Three Loyalties</h3>
<p>A useful frame for everything that follows: confidentiality decisions sit at the intersection of three loyalties. The first is to the client — the therapeutic promise that what is said in the room stays in the room, which is the precondition for honest disclosure and therefore for treatment itself. The second is to third parties and the public — the narrow, legally defined situations in which someone else's safety outweighs the promise. The third is to the integrity of the record — the duty to document honestly and to protect the documentation, because the record outlives the relationship and will someday be read by people you have never met: an auditor, an attorney, a successor clinician, the client themselves.</p>
<p>Most confidentiality errors are failures to notice that one of these loyalties is in play. The clinician who emails an unencrypted treatment summary to a primary care physician has not weighed the loyalties; the routine of "coordinating care" obscured that a protected disclosure was occurring. The clinician who tells a worried mother "your adult son is safe and attended today" has let compassion for a third party silently override the promise to the client. The refresher discipline is to slow these moments down — to make the decision visible before making it.</p>` },

        { type: 'statCard', order: 3, stats: [
          { value: '$100 – $50,000+', label: 'Per-violation civil penalty range', description: 'HIPAA civil monetary penalties are tiered by culpability, with annual caps per violation category reaching seven figures for willful neglect.' },
          { value: '60 days', label: 'Breach notification outer limit', description: 'Affected individuals must be notified without unreasonable delay and no later than 60 calendar days after discovery of a breach.' },
          { value: '30 days', label: 'Right-of-access clock', description: 'Records access requests must generally be fulfilled within 30 days, with one 30-day extension — a recurring OCR enforcement focus against small practices.' },
        ]},

        { type: 'pullQuote', order: 4, quote: 'The clinicians who get into trouble with confidentiality are almost never the ones who failed to memorize the regulation. They are the ones who failed to recognize that an ordinary clinical moment had become a confidentiality decision.', attribution: 'Course faculty' },

        { type: 'callout', order: 5, calloutType: 'ethics', title: 'Floor and Ceiling', content: 'HIPAA is the federal floor; your professional ethics code is frequently the ceiling. When the two differ, comply with whichever is more protective of the client. Boards discipline against the code, not the regulation.' },

        { type: 'multipleChoice', order: 6,
          question: 'A disclosure of client information is permitted under HIPAA but would violate the ACA Code of Ethics. What is the correct professional posture?',
          options: [
            { text: 'Make the disclosure — federal law preempts professional codes', isCorrect: false },
            { text: 'Decline the disclosure — comply with whichever standard is more protective of the client', isCorrect: true },
            { text: 'Make the disclosure but document an objection in the record', isCorrect: false },
            { text: 'Ask the client to waive their rights under the ethics code', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'HIPAA sets a floor, not a ceiling. Professional codes that are more protective govern your conduct, and licensing boards enforce them. Preemption analysis applies between HIPAA and state law, not between HIPAA and ethics codes — and clients cannot "waive" your professional obligations.' },

        { type: 'reflection', order: 7, question: 'Think of one confidentiality habit in your current practice that you adopted for convenience — a routine email, a voicemail script, a hallway consultation pattern. When did you last examine it deliberately rather than repeat it?' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 2 — The Privacy Rule at the Point of Care
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'The Privacy Rule at the Point of Care',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '2', title: 'The Privacy Rule at the Point of Care', subtitle: 'PHI, the TPO framework, minimum necessary, and when an authorization is actually required' },

        { type: 'text', order: 2, content: `<h2>What Is Actually Protected</h2>
<p>Protected health information (PHI) is individually identifiable health information held or transmitted by a covered entity or its business associate, in any form — spoken, written, or electronic. The definition is broader than most clinicians intuit. The fact that a person is your client is itself PHI. An appointment time is PHI. A voicemail confirming a session is PHI. The diagnosis is PHI, but so is the absence of one. The practical consequence is that the confidentiality perimeter begins at the very existence of the treatment relationship, not at the content of sessions — which is why "I can neither confirm nor deny whether that person receives services here" is the default script for unexpected callers, and why even acknowledging a client in public is the client's move to make, not yours.</p>
<p>De-identified information — data stripped of the eighteen identifiers specified in the Privacy Rule, or certified as de-identified by expert determination — is not PHI and may be used freely, which matters for program evaluation, supervision exercises, and teaching. But de-identification is harder than removing the name. A case description containing "a 34-year-old school principal in a small coastal Georgia town" is not de-identified in any meaningful sense, and informal "disguising" of cases for consultation groups or publication routinely fails this test. When in doubt, get authorization or change details until the client could not recognize themselves.</p>
<h3>The TPO Framework: What You May Do Without Asking</h3>
<p>The Privacy Rule's central engineering decision is the treatment, payment, and health care operations (TPO) framework. Uses and disclosures for TPO purposes are permitted without client authorization, because requiring signed authorization for every routine act of health care would make health care impossible. Treatment includes the provision and coordination of care — consulting a supervisor, coordinating with a prescriber, referring to a higher level of care. Payment includes billing, claims submission, and eligibility verification. Health care operations include quality assurance, training, auditing, and business management.</p>
<p>Two refinements keep clinicians out of trouble here. First, "permitted without authorization" does not mean "invisible to the client." Your Notice of Privacy Practices, acknowledged at intake, is the instrument that tells clients how their information moves for TPO purposes — which is one reason the Notice deserves an annual read-through by you, not just a signature line for them. Second, behavioral health practice sits inside professional ethics codes that often expect consent conversations even where HIPAA permits silent disclosure. Telling a client "I coordinate care with your psychiatrist; here is what I share and why" is not legally required for treatment disclosures, but it is good ethics, good therapy, and excellent risk management, because clients who understand information flow file fewer complaints about it.</p>
<h3>Minimum Necessary: The Standard You Apply Hourly</h3>
<p>For most uses and disclosures other than treatment, the minimum necessary standard applies: share the least information reasonably required for the purpose. The treatment exception is deliberate — clinicians coordinating care should not be parsing sentences for legal sufficiency mid-crisis — but the exception is narrower than it feels. Billing is not treatment: the claim needs the diagnosis code and service code, not the narrative. A disability paperwork request is not treatment: the form needs functional capacity answers, not a chronology of the client's marriage. A school requesting "records" for an IEP meeting needs an attendance-and-recommendations letter far more often than it needs the chart.</p>
<p>The clinical habit that operationalizes minimum necessary is the substitution question: <em>what is the smallest document that satisfies this request?</em> In a striking share of real requests, the answer is a treatment summary letter written for the purpose — dates of service, diagnosis, treatment focus, progress, recommendations — rather than the record itself. Offering the summary first is lawful, faster, kinder to the client, and dramatically lowers the surface area of what leaves your control. (When a client exercises their access right to the full designated record set, that is different — Section 4 — but third-party requests are negotiable in a way access requests are not.)</p>
<h3>When an Authorization Is Actually Required</h3>
<p>Outside TPO and the specific permissions catalogued in Section 6, disclosure requires a valid written authorization. A valid authorization is specific: it names what is to be disclosed, to whom, for what purpose, and until when, and it is signed and dated with revocation rights explained. The recurring failure modes are stale authorizations dragged past their expiration, blanket authorizations ("any and all records to any party") treated as if they covered psychotherapy notes (they do not — psychotherapy notes require their own specific authorization), and authorizations signed by someone without authority to sign — the noncustodial parent without legal decision-making rights, one member of a couple authorizing release of conjoint records, the adult child of a competent older adult. Verifying the signer's authority is part of verifying the authorization.</p>
<p>One more point of hygiene: an authorization permits disclosure; it does not compel it. If you believe a disclosure authorized by the client would harm them — common in custody litigation, where a client authorizes release under pressure — you may counsel the client about the consequences before acting, and ethics codes expect you to. The signature opens the door; clinical judgment still decides how to walk through it.</p>` },

        { type: 'callout', order: 3, calloutType: 'clinical', title: 'The Substitution Question', content: 'Before releasing records to any third party, ask: what is the smallest document that satisfies this request? A purpose-written treatment summary answers most third-party requests better than the chart — and keeps the chart home.' },

        { type: 'flashcardDeck', order: 4, flashcards: [
          { id: 'f1', front: 'PHI', back: 'Individually identifiable health information held or transmitted by a covered entity or business associate in any form — including the bare fact that someone is a client, appointment times, and voicemails.' },
          { id: 'f2', front: 'TPO', back: 'Treatment, Payment, and health care Operations — the categories of use and disclosure permitted without client authorization, described to clients in the Notice of Privacy Practices.' },
          { id: 'f3', front: 'Minimum necessary', back: 'The duty to use or disclose the least PHI reasonably required for the purpose. Applies to most disclosures; treatment disclosures are excepted, but billing, forms, and records requests are not.' },
          { id: 'f4', front: 'Valid authorization', back: 'Written, signed, dated; specifies what, to whom, for what purpose, and an expiration; explains revocation. Blanket authorizations never cover psychotherapy notes.' },
          { id: 'f5', front: 'De-identified information', back: 'Information stripped of all eighteen Privacy Rule identifiers (or expert-certified). Not PHI. Casual "disguising" of cases usually fails this standard.' },
        ]},

        { type: 'multipleChoice', order: 5,
          question: 'A short-term disability insurer sends a signed client authorization and requests "all records." Which response best satisfies both HIPAA and the minimum necessary principle?',
          options: [
            { text: 'Send the complete chart — the authorization makes it lawful', isCorrect: false },
            { text: 'Refuse entirely — disability paperwork is not a permitted purpose', isCorrect: false },
            { text: 'Verify the authorization, then offer a purpose-written treatment summary addressing functional capacity, releasing further records only if genuinely required', isCorrect: true },
            { text: 'Send only the psychotherapy notes, since those address functioning in detail', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'Lawful is not the same as proportionate. A valid authorization permits disclosure but minimum necessary discipline — and good ethics — favors the smallest sufficient document. Psychotherapy notes are the worst possible choice: they require their own specific authorization and are never the responsive document for an insurer.' },

        { type: 'multipleChoice', order: 6,
          question: 'Which of the following is NOT protected health information?',
          options: [
            { text: 'A voicemail reminding a client of Thursday\'s appointment', isCorrect: false },
            { text: 'The fact that a named individual attends therapy at your practice', isCorrect: false },
            { text: 'A case description stripped of all eighteen identifiers and unrecognizable to the client', isCorrect: true },
            { text: 'A client\'s diagnosis shared verbally with a billing service', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'Properly de-identified information is not PHI. Everything else listed is PHI in some form — spoken, written, or electronic — including the bare existence of the treatment relationship.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 3 — Psychotherapy Notes vs. the Clinical Record
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Psychotherapy Notes vs. the Clinical Record',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '3', title: 'Psychotherapy Notes vs. the Clinical Record', subtitle: 'The most misunderstood distinction in behavioral health documentation' },

        { type: 'text', order: 2, content: `<h2>Two Documents, Two Sets of Rules</h2>
<p>No HIPAA concept is more misunderstood in behavioral health than psychotherapy notes, and the misunderstanding cuts both ways: clinicians over-claim the protection for documents that do not qualify, and under-use it for the reflective writing that does. Getting this distinction right changes how you document, what you release, and how you respond to nearly every records request you will ever receive.</p>
<p>Under the Privacy Rule, <strong>psychotherapy notes</strong> are notes recorded by a mental health professional documenting or analyzing the contents of a counseling conversation, that are <em>kept separate from the rest of the individual's medical record</em>. They are the clinician's process notes — hypotheses, countertransference observations, the verbatim fragment you want to think about, the working formulation you are not ready to commit to. The definition explicitly <em>excludes</em>: medication prescription and monitoring, session start and stop times, modalities and frequencies of treatment, results of clinical tests, and any summary of diagnosis, functional status, the treatment plan, symptoms, prognosis, and progress to date.</p>
<p>Read that exclusion list again, because it describes a progress note. Diagnosis, symptoms, treatment plan, progress, session times — the things a payer, an auditor, or a court would want — are by definition <em>not</em> psychotherapy notes, no matter what heading you put on the page. The designated record set — the chart — contains the progress notes, treatment plans, assessments, test results, billing records, and correspondence, and it is what clients may access and what most disclosures draw from. Psychotherapy notes, properly kept, are a separate document with three special properties: they require a <strong>specific, standalone authorization</strong> for almost any disclosure (a general "any and all records" release does not reach them); they are largely <strong>excluded from the client's right of access</strong> under HIPAA (state law may grant more); and a health plan may not condition treatment or payment on obtaining authorization for them.</p>
<h3>The Two-Document Discipline</h3>
<p>The protection is real, but it is earned by practice, not by labeling. Three operating rules make it durable. First, <strong>physical or electronic separation is constitutive</strong>: process notes filed inside the chart are part of the chart. If your EHR has a dedicated psychotherapy-notes section walled off from the record, use it; if not, a separate secured file is the alternative. Second, <strong>the progress note must stand on its own</strong>. The chart has to tell the clinical story completely enough to support continuity of care, medical necessity, and your own defense — date, duration, modality, presentation, interventions, response, risk assessment when indicated, plan. A skeletal chart paired with rich private notes protects neither you nor the client; in litigation it looks like concealment. Third, <strong>write process notes knowing they are discoverable in court</strong>. The HIPAA shield is strong against routine releases and access requests, but a judge's order can reach them, and in some proceedings (notably when a client places their own mental state at issue) privilege arguments fail. The standard is not "no one will ever read this"; it is "I could explain every line to a reasonable colleague."</p>
<h3>Why This Distinction Is Risk Management</h3>
<p>The two-document discipline solves problems before they occur. The custody attorney with a blanket release gets the chart — complete, professional, sufficient — while your formulation notes about the client's relationship with their own mother stay home, lawfully. The client exercising their access right receives a record written to be read, because you wrote it knowing they could. The auditor finds medical necessity documented where it belongs. And you retain a private thinking space, which is not a legal luxury but a clinical one: clinicians who fear their own documentation stop thinking on paper, and their work suffers for it.</p>` },

        { type: 'caseStudy', order: 3,
          caseTitle: 'The Blanket Release',
          caseClient: '"Dana," 41, eight months of individual therapy during divorce proceedings',
          casePresentingConcerns: 'Adjustment disorder with anxiety; sessions frequently process the marriage, the divorce, and Dana\'s ambivalence about custody arrangements.',
          caseBackground: 'Dana\'s attorney sends a signed authorization for "any and all records, notes, and documents" to support Dana\'s custody position. Your chart contains standard progress notes. You also keep separate process notes that include candid exploration of Dana\'s anger, an early hypothesis about parentification you later revised, and verbatim statements made in moments of distress.',
          caseClinicianNotes: 'The authorization is valid on its face for the designated record set. It is NOT a valid authorization for psychotherapy notes, which require a specific authorization naming them. Releasing them anyway would be a disclosure error; releasing them because "the client asked" ignores that the request was drafted by counsel, not the client, and that the contents could be weaponized by opposing counsel against Dana herself.',
          caseDiscussion: 'The sound response: verify and honor the authorization as to the chart; inform Dana (not just the attorney) what the chart contains and discuss likely consequences of release in litigation; explain that process notes are separately protected and would require a specific authorization, and counsel Dana about whether releasing them serves her interests; document the conversation. If a subpoena follows, Section 6\'s subpoena protocol applies — a subpoena is not a court order. The case illustrates all three loyalties at once: the promise to Dana, the integrity of the record, and the recognition that a lawful release can still be a harmful one.' },

        { type: 'callout', order: 4, calloutType: 'donot', title: 'Labeling Is Not Protection', content: 'Writing "psychotherapy note" at the top of a progress note does not make it one. Diagnosis, symptoms, treatment plan, progress, and session times are chart content by definition — and process notes filed inside the chart become the chart.' },

        { type: 'multipleChoice', order: 5,
          question: 'Which item can be part of protected psychotherapy notes under the Privacy Rule?',
          options: [
            { text: 'Session start and stop times', isCorrect: false },
            { text: 'The clinician\'s private working hypothesis about a client\'s relational pattern, kept in a file separate from the chart', isCorrect: true },
            { text: 'A summary of diagnosis and functional status', isCorrect: false },
            { text: 'Medication monitoring entries', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The definition excludes session times, diagnosis/functional summaries, and medication monitoring — those belong to the record. Reflective analysis of the counseling conversation, kept separate, is exactly what the category protects.' },

        { type: 'multipleChoice', order: 6,
          question: 'A client signs a general release of "any and all records" to a new psychiatrist. What does the release cover?',
          options: [
            { text: 'The designated record set, but not separately kept psychotherapy notes', isCorrect: true },
            { text: 'Everything the clinician has ever written about the client', isCorrect: false },
            { text: 'Nothing, until the psychiatrist also signs', isCorrect: false },
            { text: 'Only the intake assessment', isCorrect: false },
          ],
          correctAnswer: 0,
          explanation: 'Psychotherapy notes require their own specific authorization; a general release reaches the chart only. (Treatment coordination with the psychiatrist is separately permitted under TPO — but that permission also does not extend to psychotherapy notes.)' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 4 — Client Rights and the Records Request
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Client Rights and the Records Request',
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '4', title: 'Client Rights and the Records Request', subtitle: 'Access, amendment, restriction, and the requests clinicians most often get wrong' },

        { type: 'text', order: 2, content: `<h2>The Right of Access Is Not Optional</h2>
<p>The single most common HIPAA enforcement pattern against small practices is not a leak; it is a stall. Clients have an enforceable right to inspect and obtain a copy of their designated record set, generally within 30 days of the request (one 30-day extension is available with written notice of the reason). The right covers the format the client requests if readily producible — including electronic copies of electronic records — and permitted fees are limited to reasonable, cost-based charges for copying and postage, not search-and-retrieval fees. Clients may also direct you in writing to transmit their records to a third party of their choosing.</p>
<p>Behavioral health clinicians stall for understandable reasons: worry that the record will be misread, that it will inflame symptoms, that it was written for professionals. None of these is a lawful basis for denial. HIPAA does contain a narrow harm exception — a licensed professional may deny access to a portion of the record if access is reasonably likely to <em>endanger the life or physical safety</em> of the client or another person — but the bar is danger to life or physical safety, not distress, disagreement, or embarrassment, the denial is reviewable, and it must be documented. Psychotherapy notes, as covered in Section 3, sit outside the access right by definition — which is the lawful answer to most of the worry. The chart you must produce; the thinking space you may keep.</p>
<p>The clinically mature posture treats an access request as a clinical event, not just an administrative one. Offer to review the record together; clients reading their own chart with their clinician frequently deepens rather than ruptures the work. And let the access right shape your documentation prospectively: a chart written in respectful, behaviorally specific, jargon-light language is simultaneously better clinical documentation, better legal protection, and a document you will never dread producing.</p>
<h3>Amendment, Restriction, Accounting, and Confidential Communications</h3>
<p>Four more rights complete the set. <strong>Amendment:</strong> clients may request correction of information they believe inaccurate or incomplete. You may deny the request if the record is accurate and complete as written, but the client may then file a statement of disagreement that travels with the record — you do not delete history; you append perspective. <strong>Restriction:</strong> clients may request restrictions on uses and disclosures; you are generally not required to agree, with one mandatory exception every clinician should know: if a client pays for a service in full out of pocket and requests that it not be disclosed to their health plan, you must honor that restriction. Self-pay clients seeking privacy from their own insurer have an absolute right to it. <strong>Accounting of disclosures:</strong> clients may request a list of certain disclosures made outside TPO over the prior six years — one of several reasons a disclosure log is a practice essential. <strong>Confidential communications:</strong> clients may ask to be contacted at alternative locations or by alternative means — the cell phone rather than the home phone, no voicemails, no mail to the house — and reasonable requests must be accommodated. For clients in unsafe relationships this right is a safety plan component, not a courtesy.</p>
<h3>Minors, Personal Representatives, and the Hardest Requests</h3>
<p>The thorniest access questions involve who else may exercise the client's rights. A <strong>personal representative</strong> — a parent with legal authority for a minor, a guardian, a healthcare agent within the scope of their authority — generally stands in the client's shoes. But the parental rule has load-bearing exceptions: where state law permits a minor to consent to their own treatment and the minor has done so, where a court has authorized the minor's care, or where the parent has agreed to confidentiality between the clinician and the minor, the parent is not automatically the representative for that care, and state law controls what they may see. Custody decrees add another layer — legal custody (decision-making authority) is what matters, not physical custody, and you are entitled to see the operative order before treating a parent as authorized. And HIPAA permits you to refuse to treat someone as a personal representative when you reasonably believe the client is subject to abuse or endangerment by that person and recognition is not in the client's best interest. Adolescent work makes these rules a weekly reality: the durable solution is a written confidentiality agreement at intake among clinician, minor, and parents that sets expectations — what stays private, what safety information will always be shared — before the first records request ever arrives.</p>
<p>Finally, the federal information-blocking rules under the 21st Century Cures Act have pushed health care broadly toward immediate electronic access to clinical notes. Behavioral health practices using patient portals should assume notes may be read the day they are written — one more convergence between good documentation and self-protection.</p>` },

        { type: 'accordion', order: 3, accordionItems: [
          { title: 'Access — 30 days, format of choice, cost-based fees only', content: '<p>Produce the designated record set within 30 days (one documented 30-day extension). Electronic copies of electronic records on request. No search-and-retrieval fees. The narrow denial ground is danger to life or physical safety — not distress — and it is reviewable. Psychotherapy notes are excluded from the access right by definition.</p>' },
          { title: 'Amendment — append, never erase', content: '<p>Clients may request corrections. Deny only if the record is accurate and complete; the client may then file a statement of disagreement that is retained with the record. The record\'s integrity is preserved by addition, not deletion.</p>' },
          { title: 'Restriction — the mandatory self-pay rule', content: '<p>Most restriction requests are discretionary, but one is not: when a client pays in full out of pocket and asks that the service not be disclosed to their health plan, the restriction is mandatory. Build a workflow for flagging these services so they never leak into a claim.</p>' },
          { title: 'Confidential communications — privacy as safety planning', content: '<p>Reasonable requests for alternative contact methods or locations must be accommodated. Capture preferences at intake — which numbers may receive voicemail, whether texts are permitted, where mail may be sent — and treat them as standing orders.</p>' },
          { title: 'Personal representatives — authority before access', content: '<p>Verify legal authority before honoring a representative: the custody order\'s legal-custody terms, the guardianship papers, the scope of the healthcare power of attorney. Minor-consent treatment under state law changes the parental default. Suspected abuse by the representative permits refusal.</p>' },
        ]},

        { type: 'multipleChoice', order: 4,
          question: 'A current client requests a complete copy of her record. You believe reading the intake assessment will upset her. Under HIPAA you may:',
          options: [
            { text: 'Deny the request — clinical judgment controls access', isCorrect: false },
            { text: 'Provide a summary instead of the record without her agreement', isCorrect: false },
            { text: 'Deny only any portion reasonably likely to endanger life or physical safety, document the basis, and produce the rest within the access timeline', isCorrect: true },
            { text: 'Require her to attend a session before releasing anything', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'Anticipated distress is not a denial ground; the harm exception requires reasonable likelihood of danger to life or physical safety, applies only to the implicated portion, and is reviewable. Offering to review the record together is good practice — but it is an offer, not a condition.' },

        { type: 'multipleChoice', order: 5,
          question: 'A self-pay client asks that yesterday\'s session never be disclosed to his insurance plan. He paid in full at the time of service. You must:',
          options: [
            { text: 'Honor the restriction — it is mandatory for services paid in full out of pocket', isCorrect: true },
            { text: 'Decline — providers are never required to agree to restrictions', isCorrect: false },
            { text: 'Honor it only if the plan consents', isCorrect: false },
            { text: 'Honor it only for psychotherapy notes', isCorrect: false },
          ],
          correctAnswer: 0,
          explanation: 'This is the one mandatory restriction in the Privacy Rule. The general principle that providers need not agree to requested restrictions has exactly this exception, and practices need a workflow to enforce it at billing time.' },

        { type: 'callout', order: 6, calloutType: 'tip', title: 'Write for the Reader', content: 'Assume every note may be read by the client the day it is written. Respectful, behaviorally specific, jargon-light documentation is better clinically, safer legally, and removes the dread from every future records request.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 5 — The Security Rule in Real Practice
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'The Security Rule in Real Practice',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '5', title: 'The Security Rule in Real Practice', subtitle: 'Administrative, physical, and technical safeguards for the way clinicians actually work now' },

        { type: 'text', order: 2, content: `<h2>Three Kinds of Safeguards, One Kind of Judgment</h2>
<p>The Security Rule governs electronic PHI and is built on a principle small practices should find reassuring: safeguards must be <em>reasonable and appropriate</em> to the size, complexity, and resources of the practice. A solo practitioner is not expected to run a hospital security program. She is expected to have looked at her own risks deliberately — the Rule's foundational requirement is a documented <strong>security risk analysis</strong>, reviewed periodically and after any significant change (a new EHR, a move to telehealth, a stolen device). OCR's most consistent finding against small practices after a breach is not the breach itself but the absence of any risk analysis behind it: the difference between an unfortunate event and willful neglect is whether you had ever looked.</p>
<p><strong>Administrative safeguards</strong> are the policies and people layer: the risk analysis itself; workforce training (this course is part of yours); access management so each staff member sees only what their role requires; sanction policies; a contingency plan with data backup and recovery; and termination procedures that revoke access the day employment ends — the orphaned login of a departed employee is a classic small-practice finding. <strong>Physical safeguards</strong> govern places and devices: locked file storage, screens positioned away from waiting-room sightlines, automatic screen locks, device inventories, and disposal procedures — shredding for paper, genuine wiping (not mere deletion) for hardware that ever held ePHI, including the office copier's internal drive. <strong>Technical safeguards</strong> live in configuration: unique user IDs (shared logins destroy your audit trail), strong authentication with multi-factor wherever available, automatic logoff, audit logging, and encryption in transit and at rest.</p>
<h3>Encryption Is the Cheapest Insurance You Will Ever Buy</h3>
<p>Encryption deserves its own paragraph because of a provision every clinician should know: under the breach notification framework, the loss or theft of <em>properly encrypted</em> ePHI is not a reportable breach, because encrypted data is considered unusable to the thief. Full-disk encryption is built into modern operating systems and takes minutes to enable. The difference between "my laptop was stolen" being a bad afternoon versus a notification event with OCR exposure is a checkbox you can set today. Phones and tablets that touch the EHR, email, or client texts belong inside the same perimeter: device passcode, encryption on, remote-wipe enabled, and removed from the practice ecosystem before they are sold or handed to a family member.</p>
<h3>Email, Texting, and the Channels Clients Actually Use</h3>
<p>Clients want to text. The Security Rule does not flatly forbid unencrypted email or SMS; it requires that you address transmission security, warn clients of the risk, and honor their informed preference — and that <em>you</em> hold the line on content regardless of their preference. The workable architecture for a small practice: secure channels (portal, encrypted email, HIPAA-conscious telehealth platforms) for clinical content; ordinary text/email, with the client's documented informed consent, limited to logistics — scheduling, directions, "running five minutes late." The discipline that fails most often is content creep: the client replies to a scheduling text with clinical material, and the clinician answers in kind. The refresher-proof habit is a standing redirect: acknowledge briefly, move the substance to session or the secure channel, never conduct therapy in SMS. Group practices add one more requirement: staff use practice-controlled accounts and devices or a managed BYOD policy — clinical texts on a personal number in a personal backup are PHI you cannot retrieve, produce, or protect.</p>
<h3>Telehealth, Home Offices, and Business Associates</h3>
<p>Telehealth concentrated every safeguard category into the clinician's home. The technical layer is the platform — chosen for encryption and the vendor's willingness to sign a <strong>business associate agreement (BAA)</strong>. The physical layer is the room: a door that closes, headphones, screens invisible to household members, and a verified-location, privacy-checked client on the other end ("Are you somewhere you can speak freely?" is both clinical and security practice). The administrative layer is policy: written telehealth procedures, an emergency protocol that includes the client's physical location each session, and the state-licensure boundary check. (Your board's telehealth training requirement — in Georgia, the six-hour telemental health prerequisite — is the clinical-competency complement to this security layer.)</p>
<p>Business associates are the perimeter most practices underestimate. Your EHR, your telehealth platform, your billing service, your cloud storage, your appointment-reminder service, your transcription or AI-documentation tool, the IT consultant with server access — each is a business associate, and each requires a signed BAA <em>before</em> PHI flows. A vendor that will not sign a BAA is announcing that it is the wrong vendor for clinical data; free consumer-grade tools are typically in this category. Keep the BAAs in one file, review the list annually as part of the self-audit in Section 7, and remember that a BAA is the start of diligence, not the end of it.</p>` },

        { type: 'tableBlock', order: 3, tableCaption: 'The safeguard map for a small behavioral health practice',
          tableHeaders: ['Safeguard category', 'What it covers', 'Highest-yield small-practice actions'],
          tableRows: [
            ['Administrative', 'Policies, people, training, access management, contingency planning', 'Documented risk analysis reviewed annually; role-based access; same-day access revocation at termination; annual workforce training'],
            ['Physical', 'Facilities, devices, media, disposal', 'Locked storage; screen positioning and auto-lock; device inventory; shred paper, wipe (not delete) retired hardware including copiers'],
            ['Technical', 'Access control, audit, integrity, transmission security', 'Unique logins with MFA; automatic logoff; audit logs on; full-disk encryption on every device that touches ePHI'],
          ]},

        { type: 'callout', order: 4, calloutType: 'protocol', title: 'The Texting Line', content: 'With documented client consent, ordinary text may carry logistics only — scheduling, directions, lateness. Clinical content moves to the secure channel every time, even when the client raises it by text first. Acknowledge, redirect, document.' },

        { type: 'multipleChoice', order: 5,
          question: 'A clinician\'s laptop containing the practice EHR login and locally cached session notes is stolen from her car. Which prior decision most likely determines whether this is a reportable breach?',
          options: [
            { text: 'Whether the laptop had a screensaver', isCorrect: false },
            { text: 'Whether full-disk encryption was enabled', isCorrect: true },
            { text: 'Whether the car was locked', isCorrect: false },
            { text: 'Whether the notes were finished or in draft', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Properly encrypted ePHI that is lost or stolen is treated as unusable and falls outside breach notification. Without encryption, the same theft triggers the full breach analysis and likely notification. The single cheapest, highest-yield safeguard a small practice can adopt.' },

        { type: 'multipleChoice', order: 6,
          question: 'Which vendor relationship requires a business associate agreement before PHI is shared?',
          options: [
            { text: 'The landlord who maintains the office HVAC', isCorrect: false },
            { text: 'The cloud-based appointment reminder service that stores client names and numbers', isCorrect: true },
            { text: 'The coffee supplier with waiting-room access', isCorrect: false },
            { text: 'A client\'s own psychiatrist receiving a coordination call', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'A BAA is required for vendors that create, receive, maintain, or transmit PHI on your behalf — the reminder service plainly qualifies. The psychiatrist is a treatment disclosure between providers, not a business associate relationship; the landlord and supplier never properly touch PHI.' },

        { type: 'reflection', order: 7, question: 'Walk your practice mentally from the parking lot to the chart: where is the weakest point a motivated stranger — or a curious household member — could encounter PHI today? What would it cost to fix this week?' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 6 — Disclosures Without Authorization: The Hard Calls
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Disclosures Without Authorization: The Hard Calls',
      order: 6,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '6', title: 'Disclosures Without Authorization: The Hard Calls', subtitle: 'Emergencies, duties to protect, subpoenas versus court orders, and families on the phone' },

        { type: 'text', order: 2, content: `<h2>The Permission Catalogue — and the Judgment It Requires</h2>
<p>The Privacy Rule permits certain disclosures without authorization beyond TPO, and behavioral health practice lives closer to these provisions than any other specialty. The ones that matter weekly: disclosures <strong>required by law</strong> (mandated abuse and neglect reporting chief among them — your state's reporting statute is a HIPAA-recognized override, and the mandated reporter module in this series covers its mechanics); disclosures to <strong>avert a serious and imminent threat</strong> to the health or safety of a person or the public, made to someone reasonably able to prevent or lessen the threat; disclosures for <strong>judicial and administrative proceedings</strong> under the specific conditions below; and limited disclosures to <strong>family and others involved in care</strong>. Each is a permission with edges, and the edges are where careers are lost — so each gets its own protocol.</p>
<h3>Serious and Imminent Threat — HIPAA Is Not Your Obstacle</h3>
<p>When a client presents a serious and imminent threat to an identifiable person or the public, HIPAA expressly permits disclosure to police, to the potential victim, or to others positioned to prevent harm. The operative law for <em>whether and when you must or may</em> warn is your state's duty-to-protect framework, which varies meaningfully by jurisdiction — some states mandate action, some permit it, and the triggering conditions differ. (This series' duty-to-warn modules carry the state-specific analysis; Georgia clinicians should know their own framework cold.) The HIPAA point for this refresher is narrower and crucial: in a genuine emergency, the federal privacy rule will not be the thing standing in your way. Clinicians who freeze in crisis citing "HIPAA" are misreading it. Disclose what is necessary to the people who can help, no more; document the threat assessment, the disclosure, and the rationale the same day.</p>
<h3>Subpoenas Are Not Court Orders</h3>
<p>No incoming document generates more panicked phone calls than a subpoena, and the entire protocol fits in one distinction. A <strong>court order signed by a judge</strong> compels production of what it specifies: comply with its precise terms — and only its terms — raising any psychotherapy-notes or privilege issues through counsel if the order's scope is unclear. A <strong>subpoena signed by an attorney</strong> is a demand, not an adjudication, and HIPAA forbids responding with PHI unless specific conditions are satisfied: you receive adequate written assurances that the client was notified and given time to object, or that a qualified protective order is in place — or you obtain the client's authorization, or the court rules. The protocol on receipt: do not produce anything reflexively; do not ignore it (non-response can mean contempt); contact the client and your own counsel or malpractice carrier's legal line; assert privilege where it applies; and respond <em>to</em> the subpoena — by producing under satisfied conditions, by objection, or by motion to quash — within its deadline. Most malpractice carriers provide this guidance at no cost precisely because the ten-minute call prevents the six-figure error.</p>
<h3>Families on the Phone</h3>
<p>The daily version of the hard call is softer: a mother asking whether her adult son came to session, a husband "just wanting to help" with his wife's treatment, an adult daughter reporting her father's drinking. The framework has three tiers. With the <strong>client's agreement</strong> — or the client present and not objecting — you may share information relevant to that person's involvement in care; the clean practice is a standing conversation with the client about who may know what, captured in the record. When the client is <strong>incapacitated or in emergency</strong>, you may use professional judgment to share what is in the client's best interest, limited to information relevant to the person's involvement. Absent either, the default holds: neither confirm nor deny, delivered warmly — "I'm not able to share whether anyone is a client here, but if someone you love is in crisis, here is what you can do." And one asymmetry worth teaching every clinician and front-desk staff member: <strong>listening is always permitted</strong>. Receiving collateral information from a worried family member discloses nothing; you may take the call, hear the concern, and decline to confirm the relationship, all at once. What you then do with collateral information is a clinical-judgment question for the record — but answering the phone is never the violation.</p>
<h3>Two Final Edges</h3>
<p><strong>Deceased clients:</strong> confidentiality survives death. HIPAA protects PHI for fifty years after death, with the personal representative of the estate standing in the client's shoes, and disclosures to family members otherwise limited to the involved-in-care framework above. Grief does not create authorization. <strong>Substance use disorder records:</strong> programs subject to 42 CFR Part 2 operate under consent rules stricter than HIPAA, including restrictions on redisclosure. If your practice holds Part 2 records, this entire section is the floor, not the analysis — the Part 2 module in this series governs.</p>` },

        { type: 'caseStudy', order: 3,
          caseTitle: 'The Attorney\'s Subpoena',
          caseClient: '"Robert," 38, completed treatment fourteen months ago for major depressive disorder following a workplace injury',
          casePresentingConcerns: 'Treatment ended with good resolution; no current relationship.',
          caseBackground: 'A subpoena duces tecum arrives from the defense attorney in Robert\'s personal-injury lawsuit, demanding "all records, notes, communications, and billing" within fourteen days. It is signed by the attorney. No court order, no client authorization, and no written assurances of notice to Robert accompany it.',
          caseClinicianNotes: 'Producing records on this document alone would violate HIPAA: an attorney-signed subpoena without satisfactory assurances, a protective order, client authorization, or a judge\'s order does not permit disclosure. Ignoring it also fails — the subpoena requires a response, just not a reflexive production.',
          caseDiscussion: 'The protocol: calendar the deadline immediately; contact Robert to inform him and learn whether his counsel will move to quash or provide authorization; call the malpractice carrier\'s legal consultation line; respond through the correct channel — production if valid conditions are later satisfied (and even then, the designated record set, never psychotherapy notes without their own specific authorization or court order), or a written objection asserting privilege. Document each step. The fourteen-day clock feels urgent; the urgency belongs to the response, not to the production.' },

        { type: 'callout', order: 4, calloutType: 'key', title: 'The One-Line Subpoena Rule', content: 'A judge\'s signature compels; an attorney\'s signature requests. Never produce PHI on an attorney-signed subpoena without satisfied HIPAA conditions, client authorization, or a court ruling — and never ignore the deadline either. Respond; don\'t reflexively produce.' },

        { type: 'multipleChoice', order: 5,
          question: 'A client in session makes a credible, specific threat to seriously harm a named coworker tonight. Regarding HIPAA, the clinician should understand that:',
          options: [
            { text: 'HIPAA prohibits contacting police without a signed authorization', isCorrect: false },
            { text: 'HIPAA permits disclosure to persons able to prevent the harm — including police and the threatened person — limited to what the emergency requires, with state duty-to-protect law governing what is mandated', isCorrect: true },
            { text: 'Only a supervisor may make the disclosure', isCorrect: false },
            { text: 'Disclosure is permitted only after the client leaves the office', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The serious-and-imminent-threat permission exists precisely for this moment. The federal rule is a permission; the obligation analysis comes from state duty-to-protect law. Disclose the minimum necessary to those positioned to help, and document threat assessment, action, and rationale the same day.' },

        { type: 'multipleChoice', order: 6,
          question: 'The adult daughter of a former client who died last month calls asking to "talk through" her father\'s treatment. With no estate representative involved, the clinician\'s best course is to:',
          options: [
            { text: 'Share freely — confidentiality ends at death', isCorrect: false },
            { text: 'Share a summary if she seems genuinely grieving', isCorrect: false },
            { text: 'Express condolences, listen, and explain that the record remains protected, identifying what the estate\'s personal representative could lawfully authorize', isCorrect: true },
            { text: 'Refuse the call entirely', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'PHI remains protected for fifty years after death, with the estate\'s personal representative holding the authority a living client would. Compassionate listening is always permitted; disclosure is not. Grief is a clinical reality and not a legal authorization.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 7 — Breach, Complaint, and the Annual Self-Audit
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Breach, Complaint, and the Annual Self-Audit',
      order: 7,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '7', title: 'Breach, Complaint, and the Annual Self-Audit', subtitle: 'What to do when something goes wrong — and the yearly hour that keeps it from going wrong' },

        { type: 'text', order: 2, content: `<h2>When Something Goes Wrong</h2>
<p>A <strong>breach</strong> is the acquisition, access, use, or disclosure of unsecured PHI in a manner not permitted by the Privacy Rule that compromises its security or privacy. The framework presumes an impermissible disclosure is a breach unless a documented risk assessment demonstrates a low probability of compromise, weighing four factors: the nature and extent of the PHI involved; the unauthorized person who received or used it; whether the PHI was actually acquired or viewed; and the extent to which the risk has been mitigated. The fax that reached a wrong covered entity which confirms destruction may assess out; the chart emailed to a stranger's address does not. Encrypted data lost or stolen is excepted entirely — the Section 5 point returning with force — and narrow exceptions cover certain good-faith internal access and disclosures where the recipient could not reasonably retain the information.</p>
<p>When a breach is established, notification duties follow: <strong>affected individuals</strong> without unreasonable delay and no later than 60 days from discovery, by written notice describing what happened, what information was involved, what you are doing, and what they can do; <strong>HHS</strong> — within 60 days of discovery for breaches affecting 500 or more individuals (with media notice for large breaches in a state or jurisdiction), or via the annual log for smaller breaches, submitted within 60 days of the end of the calendar year. Two postures matter more than memorizing the mechanics. First, <em>the clock starts at discovery</em> — when the incident is known or should reasonably have been known — so an incident-reporting culture inside the practice is itself a compliance control; the assistant who is afraid to report the misdirected fax converts a containable event into willful neglect. Second, the same event frequently triggers parallel duties: your state's breach notification statute, your malpractice carrier's prompt-notice clause, and your cyber policy's requirements. The first call after containment is to your carrier, both for coverage and because carriers supply breach counsel.</p>
<h3>The Violations That Actually Happen to Clinicians</h3>
<p>OCR's headline cases involve hospital systems; the events that actually reach clinicians are smaller and more human. <strong>Snooping</strong> — accessing the record of a family member, a coworker's spouse, an ex, anyone outside your treatment role — is detectable in audit logs, indefensible, and a terminable and reportable act everywhere. <strong>Online reviews:</strong> responding to a negative review with anything that confirms the reviewer was a client — including "we strive to give all our clients excellent care" math that confirms the relationship — has produced OCR enforcement against small behavioral health practices; the only safe public reply contains no acknowledgment of any treatment relationship. <strong>Social media and texting leakage:</strong> the "anonymous" case post that a hometown audience can identify; the session photo with the schedule visible on the desk; the clinical text sent to the number above the client's in the contact list. <strong>Mis-direction:</strong> wrong-number faxes, autocomplete email to the wrong "Jennifer," portal messages in the wrong chart. <strong>Improper disposal:</strong> charts in dumpsters and unwiped devices on resale sites remain perennial enforcement sources. None of these requires malice — which is exactly why annual refresher training, not character, is the control.</p>
<h3>The Annual Self-Audit</h3>
<p>This course closes with the discipline that justifies its annual recurrence: a one-hour self-audit, done with this year's certificate in hand. Walk it as a checklist. <strong>Risk analysis:</strong> is it documented, and has anything material changed since it was written — new EHR, new staff, new telehealth pattern, new device? <strong>Access:</strong> does every login belong to a current workforce member with role-appropriate permissions, and was every departure de-provisioned? <strong>Devices:</strong> inventory current, encryption verified on every machine that touches ePHI, phones passcoded with remote wipe? <strong>BAAs:</strong> does the vendor list match the BAA file — including any tool adopted casually this year? <strong>Client-rights workflows:</strong> can your practice actually produce a record within 30 days, log disclosures, flag mandatory self-pay restrictions, and honor confidential-communication preferences? <strong>Notice of Privacy Practices:</strong> current, posted, and reflecting what you actually do? <strong>Training:</strong> every workforce member current, with certificates filed? <strong>Incident channel:</strong> does everyone in the practice know that reporting a suspected incident immediately is safe and expected? An hour against this list, annually, documented, is the difference OCR and your board both recognize between a practice that had an unlucky day and a practice that was never looking.</p>` },

        { type: 'matching', order: 3, matchingInstructions: 'Match each incident to its correct first-line analysis.',
          matchingPairs: [
            { term: 'Encrypted laptop stolen from a car', definition: 'Not a reportable breach — properly encrypted ePHI is treated as unusable' },
            { term: 'Chart emailed to a stranger\'s address', definition: 'Presumed breach — conduct and document the four-factor risk assessment; notification likely' },
            { term: 'Staff member views her ex-husband\'s record', definition: 'Impermissible access (snooping) — sanctionable, audit-detectable, and reportable' },
            { term: 'Reply to a negative online review saying "we treated you with care"', definition: 'Impermissible disclosure — publicly confirms the treatment relationship' },
            { term: 'Misdirected fax to another clinic that certifies destruction', definition: 'Risk assessment may support low probability of compromise — document the analysis' },
          ]},

        { type: 'keyTakeaway', order: 4, takeaways: [
          'A breach is presumed from any impermissible use or disclosure of unsecured PHI unless a documented four-factor risk assessment shows low probability of compromise.',
          'Notify affected individuals within 60 days of discovery; HHS within 60 days for 500+ breaches, or on the annual log for smaller ones — and call your malpractice carrier first.',
          'The violations that reach clinicians are human-scale: snooping, review replies, social media leakage, misdirection, and disposal. Training, not character, is the control.',
          'Never confirm a treatment relationship in any public reply, in any forum, for any reason.',
          'One documented self-audit hour per year — risk analysis, access, devices, BAAs, client-rights workflows, Notice, training, incident channel — is the practice-level habit that converts this course from a certificate into protection.',
        ]},

        { type: 'multipleChoice', order: 5,
          question: 'A practice discovers that a progress note was emailed to the wrong recipient six weeks ago. The most accurate statement about the notification clock is:',
          options: [
            { text: 'The 60-day clock began when the email was sent', isCorrect: false },
            { text: 'The 60-day clock runs from discovery — when the incident was known or reasonably should have been known — making prompt internal reporting itself a compliance control', isCorrect: true },
            { text: 'No clock applies to breaches affecting a single individual', isCorrect: false },
            { text: 'The clock pauses while the practice investigates', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Notification runs from discovery, with a reasonable-diligence standard — a practice cannot extend its deadline by failing to look. Single-individual breaches still require individual notification within 60 days and inclusion in the annual HHS log. Investigation happens inside the window, not before it.' },

        { type: 'multipleChoice', order: 6,
          question: 'A former client posts a one-star review claiming you "never listened." Which reply is permissible?',
          options: [
            { text: '"We remember your case differently and our notes reflect excellent care."', isCorrect: false },
            { text: '"As your therapist, I encourage you to call so we can resolve this."', isCorrect: false },
            { text: 'A reply that neither confirms nor denies any treatment relationship — e.g., describing the practice\'s general approach and inviting anyone with concerns to contact the office', isCorrect: true },
            { text: 'A factual correction of the review\'s specific claims', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'Any reply that confirms the reviewer was a client — directly or by implication — is an impermissible disclosure, and OCR has fined small behavioral health practices for exactly this. The treatment relationship itself is PHI. General-voice replies that acknowledge nothing about the individual are the ceiling of what is safe.' },

        { type: 'reflection', order: 7, question: 'Schedule it now: pick the date within the next two weeks when you will run the annual self-audit checklist from this section, and decide where the documentation will live. What is the first item you already suspect will fail?' },
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 8 — Conclusion & References
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Conclusion and References',
      order: 8,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '8', title: 'Conclusion', subtitle: 'The recognition habit, renewed' },

        { type: 'text', order: 2, content: `<h2>What You Renewed Today</h2>
<p>This refresher asked you to hold confidentiality as a clinical skill with an annual maintenance schedule rather than a regulation with a signature line. You revisited the architecture — PHI and the TPO framework, minimum necessary as an hourly habit, the authorization rules and their failure modes. You sharpened the most consequential documentation distinction in behavioral health: the designated record set written to be read, and psychotherapy notes earning their protection through genuine separation. You rehearsed the client-rights workflows where small practices most often stumble — the 30-day access clock, the mandatory self-pay restriction, the personal-representative verifications. You mapped the Security Rule onto the practice you actually run: encryption as the cheapest insurance available, the texting line, the telehealth room, the BAA file. You walked the hard calls — threat, subpoena, family, death — with protocols instead of panic. And you left with a dated commitment to a one-hour self-audit, which is the entire course compressed into a practice habit.</p>
<p>The recognition skill decays without renewal; routines accrete; new tools enter the practice unexamined. That is not a personal failing — it is why this training recurs annually, and why the certificate you earn today is best understood as a calendar entry for next year. Between now and then: notice the moments. The break-room mention, the convenient email, the form that asks for more than it needs. Confidentiality is kept or lost in exactly those minutes, and you are now, again, the clinician in the practice most prepared to see them.</p>
<h3>References</h3>
<p>American Counseling Association. (2014). <em>ACA code of ethics</em>. Author.</p>
<p>Health Insurance Portability and Accountability Act, Privacy Rule, 45 C.F.R. Parts 160 and 164, Subparts A and E.</p>
<p>Health Insurance Portability and Accountability Act, Security Rule, 45 C.F.R. Parts 160 and 164, Subparts A and C.</p>
<p>Breach Notification Rule, 45 C.F.R. §§ 164.400–414.</p>
<p>National Board for Certified Counselors. (2023). <em>NBCC code of ethics</em>. Author.</p>
<p>U.S. Department of Health and Human Services, Office for Civil Rights. <em>HIPAA for professionals: Guidance materials on the Privacy, Security, and Breach Notification Rules</em>. https://www.hhs.gov/hipaa</p>
<p>U.S. Department of Health and Human Services, Office for Civil Rights. <em>Guidance on HIPAA and mental health: Sharing information related to mental health</em>. https://www.hhs.gov/hipaa</p>
<p>21st Century Cures Act; ONC Information Blocking Regulations, 45 C.F.R. Part 171.</p>
<p>Confidentiality of Substance Use Disorder Patient Records, 42 C.F.R. Part 2.</p>` },
      ],
    },
  ],

  // ── Final exam — top-level ──────────────────────────────────────────────
  assessment: {
    passingScore: 80,
    questions: [
      { question: 'Which statement best describes the relationship between HIPAA and professional ethics codes?',
        options: [
          { text: 'HIPAA preempts ethics codes, which are advisory only', isCorrect: false },
          { text: 'HIPAA is a federal floor; where an ethics code is more protective of the client, the clinician must meet the stricter standard', isCorrect: true },
          { text: 'Ethics codes apply only when HIPAA is silent', isCorrect: false },
          { text: 'The two never address the same conduct', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'HIPAA establishes minimum federal protections. Licensing boards enforce ethics codes, which are frequently stricter, and clinicians comply with whichever standard is more protective.' },

      { question: 'The bare fact that a named individual receives services at your practice is:',
        options: [
          { text: 'Not PHI, because it contains no clinical content', isCorrect: false },
          { text: 'PHI, protected in spoken, written, and electronic form', isCorrect: true },
          { text: 'PHI only if a diagnosis is attached', isCorrect: false },
          { text: 'Protected only for current clients', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'The existence of the treatment relationship is itself individually identifiable health information — the basis of the neither-confirm-nor-deny default and the online-review rule.' },

      { question: 'The minimum necessary standard does NOT apply to which disclosure?',
        options: [
          { text: 'Records released for a disability claim', isCorrect: false },
          { text: 'Information shared with a billing service', isCorrect: false },
          { text: 'A consultation with the client\'s psychiatrist for treatment purposes', isCorrect: true },
          { text: 'A response to a school\'s records request', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Treatment disclosures are excepted from minimum necessary so care coordination is never legally hesitant. Billing, forms, and third-party requests remain fully subject to it.' },

      { question: 'Which content can never qualify as a psychotherapy note, regardless of labeling or storage?',
        options: [
          { text: 'The clinician\'s working formulation of a relational pattern', isCorrect: false },
          { text: 'A verbatim fragment the clinician is reflecting on', isCorrect: false },
          { text: 'A summary of diagnosis, treatment plan, and progress to date', isCorrect: true },
          { text: 'A countertransference observation', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'The regulatory definition excludes diagnosis, treatment plan, symptoms, prognosis, progress summaries, session times, test results, and medication monitoring — that content belongs to the designated record set wherever it is stored.' },

      { question: 'A client requests an electronic copy of her electronic record. The practice must generally:',
        options: [
          { text: 'Provide it within 30 days, charging only reasonable cost-based fees, with one documented 30-day extension available', isCorrect: true },
          { text: 'Provide a paper summary within 90 days', isCorrect: false },
          { text: 'Require the request to come through an attorney', isCorrect: false },
          { text: 'Decline if the clinician believes the record would distress her', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'The right of access — a sustained OCR enforcement focus against small practices — requires timely production in the requested form if readily producible, with fees limited to cost. Anticipated distress is not a denial ground.' },

      { question: 'The one restriction request a provider MUST honor involves:',
        options: [
          { text: 'Any request concerning a custody dispute', isCorrect: false },
          { text: 'Services paid in full out of pocket that the client asks not be disclosed to their health plan', isCorrect: true },
          { text: 'Any restriction requested in writing', isCorrect: false },
          { text: 'Requests concerning psychotherapy notes', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Restriction requests are generally discretionary with this single mandatory exception — practices need a billing-time workflow to flag self-pay-restricted services so they never reach a claim.' },

      { question: 'A laptop containing unencrypted cached client notes is stolen. The breach analysis:',
        options: [
          { text: 'Ends immediately — theft by a stranger is never a breach', isCorrect: false },
          { text: 'Presumes a breach unless a documented four-factor risk assessment demonstrates low probability of compromise', isCorrect: true },
          { text: 'Applies only if 500 or more clients are affected', isCorrect: false },
          { text: 'Is unnecessary if police recover the laptop within 60 days', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Impermissible acquisition of unsecured PHI is presumptively a breach; the four factors (nature of PHI, recipient, actual acquisition, mitigation) can rebut the presumption only through a documented assessment. Encryption beforehand would have excepted the event entirely.' },

      { question: 'An attorney-signed subpoena for client records arrives with no court order, no client authorization, and no assurances of notice to the client. The clinician should:',
        options: [
          { text: 'Produce the records before the deadline to avoid contempt', isCorrect: false },
          { text: 'Ignore it — attorney subpoenas have no force', isCorrect: false },
          { text: 'Respond by the deadline without producing PHI: notify the client, consult counsel or the malpractice carrier, and require satisfied HIPAA conditions, authorization, or a court ruling before any production', isCorrect: true },
          { text: 'Produce only the psychotherapy notes, since they are most relevant', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'A subpoena demands a response, not reflexive production. HIPAA conditions (assurances or a qualified protective order), client authorization, or a judge\'s order must exist before PHI moves — and psychotherapy notes would additionally require their own specific authorization or court order.' },

      { question: 'A worried father calls asking whether his 26-year-old son attended his appointment today. Without the son\'s agreement and with no emergency, the clinician may:',
        options: [
          { text: 'Confirm attendance only, since it is not clinical content', isCorrect: false },
          { text: 'Listen to the father\'s concerns and decline to confirm or deny any treatment relationship', isCorrect: true },
          { text: 'Share a brief progress update as a courtesy to family', isCorrect: false },
          { text: 'Refuse to take the call at all', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Attendance is PHI, and adult clients control family involvement absent agreement, presence without objection, or incapacity/emergency. Listening, however, discloses nothing and is always permitted — and often clinically valuable.' },

      { question: 'How long does HIPAA protect a deceased client\'s PHI, and who may authorize its release?',
        options: [
          { text: 'Protection ends at death; any family member may authorize release', isCorrect: false },
          { text: 'Fifty years after death; the personal representative of the estate holds the client\'s authority', isCorrect: true },
          { text: 'Ten years after death; the executor and all adult children jointly', isCorrect: false },
          { text: 'Indefinitely; no one may ever authorize release', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'PHI remains protected for fifty years following death, with the estate\'s personal representative standing in the client\'s shoes; family disclosures otherwise run through the involved-in-care framework. Grief is not authorization.' },

      { question: 'Which practice converts the loss or theft of a device from a notification event into a non-reportable incident?',
        options: [
          { text: 'A strong screensaver password', isCorrect: false },
          { text: 'Full-disk encryption properly implemented before the loss', isCorrect: true },
          { text: 'Filing a police report within 24 hours', isCorrect: false },
          { text: 'Storing only draft notes on the device', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Properly encrypted ePHI is "secured" — its loss falls outside breach notification because the data is unusable to the thief. A login password without disk encryption does not protect data accessed by removing the drive.' },

      { question: 'The foundational Security Rule requirement that OCR most consistently finds missing in small-practice investigations is:',
        options: [
          { text: 'A biometric entry system', isCorrect: false },
          { text: 'A documented, periodically reviewed security risk analysis', isCorrect: true },
          { text: 'An in-house IT department', isCorrect: false },
          { text: 'Penetration testing by an outside firm', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Safeguards scale to the practice, but the risk analysis is required of everyone — its documented existence is frequently the line OCR draws between an unfortunate incident and willful neglect.' },
    ],
  },

  references: [
    'American Counseling Association. (2014). ACA code of ethics. Author.',
    'Health Insurance Portability and Accountability Act, Privacy Rule, 45 C.F.R. Parts 160 and 164, Subparts A and E.',
    'Health Insurance Portability and Accountability Act, Security Rule, 45 C.F.R. Parts 160 and 164, Subparts A and C.',
    'Breach Notification Rule, 45 C.F.R. §§ 164.400–414.',
    'National Board for Certified Counselors. (2023). NBCC code of ethics. Author.',
    'U.S. Department of Health and Human Services, Office for Civil Rights. HIPAA for professionals: Guidance materials. https://www.hhs.gov/hipaa',
    'U.S. Department of Health and Human Services, Office for Civil Rights. Guidance on HIPAA and mental health. https://www.hhs.gov/hipaa',
    '21st Century Cures Act; ONC Information Blocking Regulations, 45 C.F.R. Part 171.',
    'Confidentiality of Substance Use Disorder Patient Records, 42 C.F.R. Part 2.',
  ],
};

export default COURSE;

// ── model-based upsert: fires pre-save hook (wordCount) + runs validation ─────
async function seed() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  let doc = await Course.findOne({ slug: COURSE.slug });
  if (doc) {
    doc.set(COURSE);
    console.log('Updating existing:', COURSE.slug);
  } else {
    doc = new Course(COURSE);
    console.log('Inserting new:', COURSE.slug);
  }
  await doc.save();

  console.log(`✅ Saved ${doc.courseCode} — wordCount=${doc.wordCount} (target ${(doc.ceHours || 0) * 6000})`);
  if (doc.wordCount < (doc.ceHours || 0) * 6000) {
    console.warn('⚠ Saved but UNDER target — left as draft. Add content and re-run.');
  }
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error('SEED ERROR:', e.message); process.exit(1); });
}
