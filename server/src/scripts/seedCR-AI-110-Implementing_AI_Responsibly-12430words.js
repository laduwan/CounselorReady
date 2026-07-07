import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && !process.env.DRY_RUN) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'implementing-ai-responsibly-in-your-practice';

const COURSE = {
  title: 'Implementing AI Responsibly in Your Practice: Governance and Workflow',
  slug: SLUG, courseCode: 'CR-AI-110',
  subtitle: 'A Practical Framework for Adopting, Governing, and Monitoring AI Tools',
  description: 'A 2-hour intermediate CE course equipping licensed mental health professionals and practice owners to adopt artificial-intelligence tools responsibly through a structured governance framework. Covers building an AI use policy, vendor due diligence, client consent and documentation, and ongoing monitoring, quality improvement, and risk management, grounded in the NIST AI Risk Management Framework, WHO 2021 guidance, HIPAA, and professional ethics codes. 13,000 words.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'Technology & Ethics', ceCategory: 'Technology & Ethics', contentArea: 'Professional Identity',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Professional Identity'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with expertise in practice management and technology governance.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychologists), practice owners, and clinical supervisors planning to adopt artificial-intelligence tools responsibly.'],
  tags: ['practice management', 'governance', 'implementation', 'risk management', 'artificial intelligence'],
  objectives: [
    'Construct a written artificial-intelligence governance framework for a solo or group practice that specifies guiding principles, an acceptable-use policy, and defined roles and responsibilities.',
    'Apply a structured vendor due-diligence checklist to evaluate an artificial-intelligence tool across evidence, security, contracting, data practices, validation, support, and exit and data-portability criteria.',
    'Draft client-facing disclosure and consent language and documentation standards that account for artificial-intelligence-assisted clinical decisions and staff acceptable use.',
    'Design a phased, monitored rollout for an artificial-intelligence tool that defines metrics, error reporting, incident response, and a sunset and deprovisioning plan.',
    'Evaluate the liability, insurance, and ongoing-review implications of artificial-intelligence adoption and identify when a tool must be suspended or retired.',
  ],

  sections: [
    {
      title: 'Building an AI Governance Framework',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '1', title: 'Building an AI Governance Framework', subtitle: 'Why governance matters for solo and group practices, the principles that anchor it, and the policy and roles that make it real', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Why Governance, and Why Now</h2>
<p>Most clinicians first encounter artificial intelligence not as a strategic decision but as a convenience. A documentation app appears in the electronic health record, a colleague recommends a note-drafting tool, or a vendor offers a free trial of a scheduling assistant. Each of these arrives one tool at a time, and each looks small. Governance is the discipline of refusing to let these small, individual decisions accumulate into an ungoverned reality in which client data flows through systems no one has vetted, clinical judgment is quietly shaped by outputs no one has validated, and accountability has diffused to the point that no one is responsible when something goes wrong. Governance does not mean prohibiting artificial intelligence. It means deciding, deliberately and in advance, how a practice will adopt, oversee, and retire these tools, so that the practice governs the technology rather than being governed by it.</p>
<p>The need is acute precisely because behavioral health practices are often small. A solo practitioner or a small group lacks the informatics department, compliance office, and legal counsel that a hospital system deploys to manage technology risk. Yet the obligations are identical. A solo counselor who adopts an artificial-intelligence documentation tool carries the same duties of confidentiality, competence, and informed consent as a large clinic, and the same liability if the tool mishandles protected health information or inserts a fabricated statement into a record. Governance scaled to a small practice is not a bureaucratic luxury; it is the mechanism by which a small practice meets large obligations without a large staff. A modest written framework, consistently applied, substitutes structured judgment for ad hoc improvisation.</p>
<p>There is also a quieter reason governance matters that is easy to overlook in the rush of adoption: it protects the clinician's own professional standing. When a tool errs and a client is harmed, the questions that follow, from a licensing board, a malpractice insurer, or a court, are not whether the technology was sophisticated but whether the clinician exercised reasonable care in adopting and overseeing it. A practice that can produce a written policy, a completed vetting record, a documented consent, and an audit trail can show that it acted as a prudent professional would. A practice that adopted a tool casually, without vetting, consent, or oversight, has no such defense. Governance, in this light, is not only an ethical commitment to clients but a form of professional self-protection, the documented evidence that the clinician took the foreseeable risks seriously and managed them deliberately rather than drifting into them. The same framework that keeps clients safe keeps the clinician defensible, and the two protections are produced by a single discipline.</p>
<p>The National Institute of Standards and Technology released its Artificial Intelligence Risk Management Framework in January 2023, and although it was written for organizations of every size, its core insight applies directly to the smallest practice: trustworthy artificial intelligence is not a property of a tool but a property of the system of people, processes, and decisions surrounding the tool. The framework organizes that system into four functions, govern, map, measure, and manage, and places governance at the foundation because every other function depends on it. Without governance, mapping risks is an academic exercise, measuring performance has no owner, and managing problems has no authority behind it. The practice that begins with governance builds everything else on solid ground.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>The Four Principles That Anchor a Framework</h2>
<p>A governance framework is not a pile of rules; it is the expression of a small number of principles that the rules serve. Four principles, drawn from the convergent guidance of the National Institute of Standards and Technology, the World Health Organization, and professional ethics codes, anchor a sound framework for behavioral health: safety, transparency, accountability, and equity. Naming them explicitly matters, because when a novel situation arises that no rule anticipated, the principles tell the practice how to decide.</p>
<p><strong>Safety</strong> means that no artificial-intelligence tool is permitted to create a foreseeable risk of harm to a client that the practice has not assessed and mitigated. In behavioral health, safety is not abstract: a documentation tool that fabricates a denial of suicidal ideation, a chatbot that fails to escalate a client in crisis, or a risk model that misroutes a high-acuity client to lower-intensity care can each cause concrete harm. The safety principle requires that the practice anticipate failure modes before deployment, not discover them in a crisis. <strong>Transparency</strong> means that the practice can see and explain how a tool is used, what data it touches, and how it influences clinical work, and that clients are told, in understandable terms, when artificial intelligence plays a role in their care. A tool whose operation the practice cannot explain to itself cannot be explained to a client, and a tool that cannot be explained to a client cannot support genuine informed consent.</p>
<p><strong>Accountability</strong> means that for every artificial-intelligence-assisted decision there is an identifiable human being who is responsible for it. Accountability cannot be delegated to a vendor or a model; the clinician remains the author of the record and the maker of the clinical judgment. The accountability principle resists the seductive diffusion of responsibility that technology invites, in which everyone assumes the tool, the vendor, or the supervisor is responsible and therefore no one is. <strong>Equity</strong> means that the practice actively guards against artificial-intelligence tools that perform unequally across the populations it serves, monitoring for disparate performance and being willing to abandon a tool that worsens inequity. These four principles are not independent; they reinforce one another, and a framework that honors all four produces decisions that are defensible, ethical, and aligned with the duties counselors already hold.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Writing the AI Use Policy</h2>
<p>The central artifact of a governance framework is a written artificial-intelligence use policy. It need not be long; a focused policy of a few pages, consistently applied, outperforms an elaborate document no one reads. A sound policy answers a defined set of questions. First, scope: which tools and which uses does the policy cover, and where are the boundaries? A practice may decide, for example, that administrative automation is permitted broadly, that documentation tools are permitted only after vetting and with full clinician review, and that client-facing conversational agents are prohibited until further notice. Stating these tiers in advance prevents case-by-case drift and gives staff a clear default.</p>
<p>Second, the policy states the principles above and translates them into concrete rules: that no tool touching protected health information may be used without a Business Associate Agreement; that no artificial-intelligence-drafted clinical note may be signed without full clinician review against the clinician's own memory of the session; that clients must be informed when artificial intelligence materially assists their care; and that any tool exhibiting biased or unsafe behavior must be reported and suspended. Third, the policy assigns ownership: who approves a new tool, who maintains the inventory of tools in use, who handles incidents, and who reviews the policy itself. Fourth, the policy defines a process for proposing, evaluating, and approving a new tool, so that adoption is a deliberate act rather than an accident of someone clicking a trial button. A policy that names principles, sets tiered rules, assigns owners, and defines a process converts governance from an aspiration into an operating reality.</p>
<p>A frequently overlooked element is the prohibited-use list. Just as important as stating what is allowed is stating, explicitly, what is not. A practice might prohibit pasting identifiable client information into any public, consumer-grade generative tool that lacks a Business Associate Agreement; prohibit using artificial intelligence to make a clinical determination, such as a diagnosis or a risk verdict, without independent clinician judgment; and prohibit adopting any tool that has not completed the practice's vetting process. Explicit prohibitions protect staff by removing ambiguity in exactly the situations where ambiguity is most dangerous, and they protect clients by drawing bright lines around the uses most likely to cause harm.</p>`,
        },
        {
          type: 'text', order: 5,
          content: `<h2>Roles and Responsibilities</h2>
<p>Governance fails when responsibility is everyone's in general and no one's in particular. A framework therefore assigns specific roles, scaled to the size of the practice. In a large group, these may be distinct people; in a solo practice, one clinician wears every hat, but the roles are still named so that each function is consciously performed rather than silently skipped. The first role is the <strong>governance owner</strong>, the person ultimately accountable for the framework, who approves the policy, authorizes new tools, and answers for the practice's artificial-intelligence decisions. In a solo practice this is the practitioner; in a group it is typically the practice owner or a designated clinical director.</p>
<p>The second role is the <strong>tool steward</strong>, responsible for maintaining the inventory of tools in use, tracking each tool's contract, Business Associate Agreement, data practices, and review dates, and ensuring that no tool quietly enters or persists in the practice without oversight. The third role is the <strong>clinical reviewer</strong>, responsible for evaluating whether a tool's clinical outputs are safe and appropriate and for setting the standards of human review that staff must follow. The fourth role is the <strong>incident handler</strong>, responsible for receiving reports of errors, near-misses, or harms involving an artificial-intelligence tool and for triggering the response process. Naming these roles, even when one person fills them all, ensures that when a documentation tool fabricates a symptom or a vendor announces a data breach, there is a defined path of responsibility rather than confusion.</p>
<p>Finally, every staff member, clinical and administrative, holds the role of <strong>frontline user</strong>, responsible for following the policy, reviewing artificial-intelligence outputs before relying on them, and reporting problems. Governance is not the property of leadership alone; it lives or dies in the daily choices of the people using the tools. A framework that engages frontline users as active participants, rather than passive subjects of a policy, is the framework that actually changes behavior. The remaining sections of this course build on this foundation: vendor due diligence determines which tools earn a place in the practice, consent and documentation govern how they touch clients and records, and monitoring and risk management ensure they remain safe over time.</p>
<p>It is worth dwelling on why governance so often fails to materialize even in conscientious practices, because understanding the failure modes helps prevent them. The first failure is the assumption that governance is for someone larger. A solo practitioner may reason that frameworks, policies, and named roles are the apparatus of hospitals and that a one-person practice can rely on good judgment instead. But good judgment is exactly what a framework operationalizes and protects, especially on a hurried day when a tempting tool offers to lift a burden. The framework is not a substitute for judgment; it is judgment written down in advance, made available when attention is scarce and the pull toward an easy shortcut is strongest. The second failure is the assumption that governance must be elaborate to be real. In practice the opposite holds: a brief, living document that staff actually read and follow governs more effectively than a comprehensive manual that sits unread. The discipline that matters is consistency of application, not volume of text.</p>
<p>The third failure is treating governance as a one-time setup rather than an ongoing practice. A framework written once and never revisited drifts out of alignment with the tools actually in use, the regulations actually in force, and the risks actually encountered. Governance is a verb before it is a noun; it is something a practice does continuously, not a binder it produces once. The fourth and most corrosive failure is symbolic governance, in which a practice adopts the appearance of a framework, a policy on file, roles on paper, to satisfy an external expectation, while the daily reality proceeds unchanged. Symbolic governance is arguably worse than none, because it manufactures false confidence. The antidote to all four failures is the same: keep the framework small, keep it living, assign real ownership, and measure whether it actually shapes behavior. A framework that changes what people do is real; one that does not, however elegant, is decoration.</p>`,
        },
        {
          type: 'callout', order: 6, calloutType: 'ethics', title: 'Governance Does Not Transfer Accountability',
          content: '<p>Adopting an artificial-intelligence tool never shifts professional responsibility from the clinician to the vendor or the model. Under the American Counseling Association Code of Ethics and parallel codes, the clinician remains accountable for clinical judgment, confidentiality, and the accuracy of the record. A governance framework formalizes this accountability rather than diluting it: it names who is responsible for each decision so that responsibility cannot evaporate into the technology. If a tool produces a harmful output, the question is never "the algorithm did it" but "which human approved, reviewed, and relied on it, and were our safeguards followed?"</p>',
        },
        {
          type: 'accordion', order: 7, title: 'Components of a Practice AI Use Policy',
          accordionItems: [
            { title: 'Scope and tiers of permitted use', content: '<p>Defines which categories of tools the policy covers and sets default permissions by tier, for example permitting administrative automation broadly, documentation tools only after vetting and with full review, and client-facing conversational agents only with explicit approval. Tiering replaces case-by-case improvisation with a clear default that staff can apply without escalating every decision.</p>' },
            { title: 'Principle-based rules', content: '<p>Translates safety, transparency, accountability, and equity into concrete requirements: a Business Associate Agreement for any tool touching protected health information, mandatory full clinician review of artificial-intelligence-drafted notes, client disclosure when artificial intelligence materially assists care, and suspension of any tool showing biased or unsafe behavior.</p>' },
            { title: 'Prohibited uses', content: '<p>States bright-line prohibitions, such as never pasting identifiable client data into a public consumer tool lacking a Business Associate Agreement, never letting a tool make an unreviewed clinical determination, and never adopting an unvetted tool. Explicit prohibitions remove ambiguity exactly where it is most dangerous.</p>' },
            { title: 'Ownership and roles', content: '<p>Assigns the governance owner, tool steward, clinical reviewer, and incident handler. In a solo practice one person holds all roles, but naming them ensures each function is consciously performed rather than silently skipped.</p>' },
            { title: 'Adoption and review process', content: '<p>Defines how a new tool is proposed, evaluated, approved, and periodically re-reviewed, so adoption is a deliberate act and continued use is a conscious choice rather than inertia. Sets the cadence for revisiting the policy itself as tools and regulations evolve.</p>' },
          ],
        },
        {
          type: 'imageText', order: 8, title: 'Governance as the Foundation',
          content: '<p>The National Institute of Standards and Technology Artificial Intelligence Risk Management Framework arranges trustworthy artificial intelligence around four functions: govern, map, measure, and manage. Governance is drawn as the foundation beneath the other three because mapping risks, measuring performance, and managing problems all require an owner, a policy, and a line of authority to mean anything. A practice that builds governance first gives every later activity, vendor vetting, consent, and monitoring, a stable structure to rest on.</p>',
          image: '', imageAlt: 'Layered diagram showing govern as the foundation beneath map, measure, and manage functions', imagePosition: 'right',
        },
        {
          type: 'videoEmbed', order: 9, videoTitle: 'AI Governance for Small Health Practices',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aigovernance',
          description: 'A short orientation to why governance, rather than tool selection, is the starting point for responsible artificial-intelligence adoption, framed around the four functions of the National Institute of Standards and Technology framework. Use it to anchor the principles introduced in this section.',
        },
        {
          type: 'flashcardDeck', order: 10,
          instructions: 'Review the core governance vocabulary until each term is clear. These concepts recur throughout the course.',
          flashcards: [
            { id: 'f1', front: 'AI governance', back: 'The deliberate system of principles, policies, roles, and processes by which a practice decides how it will adopt, oversee, and retire artificial-intelligence tools. Governance is a property of the system around a tool, not of the tool itself.' },
            { id: 'f2', front: 'The four anchoring principles', back: 'Safety (no unassessed risk of harm), transparency (the practice can see and explain how tools are used and discloses this to clients), accountability (a named human is responsible for every decision), and equity (active guarding against disparate performance across populations).' },
            { id: 'f3', front: 'AI use policy', back: 'The central written artifact of governance, stating scope and tiers, principle-based rules, prohibited uses, ownership, and an adoption and review process. A short policy consistently applied outperforms an elaborate one no one reads.' },
            { id: 'f4', front: 'Governance owner', back: 'The person ultimately accountable for the framework, who approves the policy and authorizes new tools. In a solo practice this is the practitioner; in a group, the owner or clinical director.' },
            { id: 'f5', front: 'NIST AI Risk Management Framework functions', back: 'Govern, map, measure, and manage. Governance is the foundation because mapping, measuring, and managing all require an owner, a policy, and a line of authority to be meaningful.' },
          ],
        },
        {
          type: 'multipleChoice', order: 11,
          question: 'Within the National Institute of Standards and Technology Artificial Intelligence Risk Management Framework, governance is treated as foundational because:',
          options: [
            { text: 'It is the only function that applies to small practices', isCorrect: false },
            { text: 'Mapping risks, measuring performance, and managing problems all require an owner, a policy, and a line of authority to be meaningful', isCorrect: true },
            { text: 'It eliminates the need to evaluate vendors or monitor tools', isCorrect: false },
            { text: 'It transfers accountability for clinical decisions to the tool vendor', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Governance is foundational because every other function depends on it. Without an owner, a policy, and a line of authority, mapping risks is academic, measuring performance has no owner, and managing problems has no force behind it.',
        },
        {
          type: 'multiSelect', order: 12,
          question: 'Which elements belong in a practice artificial-intelligence use policy? (Select all that apply)',
          options: [
            { text: 'Scope and tiered permissions defining which uses are allowed by default', isCorrect: true },
            { text: 'An explicit list of prohibited uses', isCorrect: true },
            { text: 'Named ownership for approval, inventory, clinical review, and incidents', isCorrect: true },
            { text: 'A guarantee that the vendor assumes all clinical liability', isCorrect: false },
            { text: 'A defined process for proposing, evaluating, and re-reviewing tools', isCorrect: true },
          ],
          explanation: 'A sound policy states scope and tiers, principle-based rules, prohibited uses, named ownership, and an adoption and review process. It cannot transfer clinical liability to a vendor; accountability remains with the clinician.',
        },
        {
          type: 'matching', order: 13,
          matchingInstructions: 'Match each governance role to its primary responsibility.',
          matchingPairs: [
            { term: 'Governance owner', definition: 'Ultimately accountable for the framework; approves the policy and authorizes new tools' },
            { term: 'Tool steward', definition: 'Maintains the inventory of tools in use, tracking contracts, agreements, data practices, and review dates' },
            { term: 'Clinical reviewer', definition: 'Evaluates whether a tool\'s clinical outputs are safe and appropriate and sets human-review standards' },
            { term: 'Incident handler', definition: 'Receives reports of errors, near-misses, or harms and triggers the response process' },
          ],
        },
        {
          type: 'reflection', order: 14, question: 'Think about your own practice or agency. How many artificial-intelligence tools are currently in use, and who, if anyone, formally approved each one? Which of the four governance roles, owner, steward, clinical reviewer, incident handler, is currently unfilled, and what would it take to name a person to it?' },
        {
          type: 'keyTakeaway', order: 15, title: 'Key Takeaways',
          takeaways: [
            'Governance means deciding deliberately, in advance, how a practice will adopt, oversee, and retire artificial-intelligence tools, so the practice governs the technology rather than the reverse.',
            'Small practices carry the same confidentiality, competence, and consent obligations as large systems; a modest written framework substitutes structured judgment for improvisation.',
            'Four principles anchor a framework: safety, transparency, accountability, and equity.',
            'The central artifact is a written use policy stating scope and tiers, principle-based rules, prohibited uses, ownership, and an adoption and review process.',
            'Named roles, governance owner, tool steward, clinical reviewer, incident handler, ensure responsibility cannot diffuse into the technology, even when one person fills them all.',
          ],
        },
      ],
    },
    {
      title: 'Vendor Selection and Due Diligence',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '2', title: 'Vendor Selection and Due Diligence', subtitle: 'Evaluating tools across evidence, security, contracting, data practices, validation, and support, recognizing red flags, and planning the exit before you enter', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Why Due Diligence Precedes Adoption</h2>
<p>A governance framework decides that the practice will vet tools before adopting them; vendor due diligence is the act of doing so. The temptation to skip it is strong, because vendor marketing is engineered to make adoption feel easy, urgent, and obviously beneficial. Free trials, polished demonstrations, and testimonials from respected colleagues all lower the perceived stakes of saying yes. Due diligence is the disciplined counterweight: a structured, repeatable evaluation that subjects every prospective tool to the same questions, so that the decision rests on verified facts rather than on the persuasiveness of a sales process. The goal is not to make adoption difficult but to make it deliberate, and to ensure that the practice understands what it is bringing into its clinical and data environment before that tool touches a single client.</p>
<p>Due diligence in behavioral health is distinctive because the stakes are distinctive. The data involved is among the most sensitive a person possesses, the consequences of clinical error are serious, and the regulatory environment, anchored by the Health Insurance Portability and Accountability Act, imposes specific duties on how protected health information is handled and shared. A vendor that processes session content, intake forms, or clinical notes becomes, in regulatory terms, a business associate, and the practice's obligations toward client data extend to that vendor's conduct. Choosing a vendor is therefore not only a product decision but a compliance decision, and a flawed choice can expose the practice to breach, liability, and harm long after the initial enthusiasm has faded.</p>
<p>A useful mental reframe is to treat the vendor not as a product to be purchased but as a partner to be trusted with the practice's most sensitive obligations. When a practice adopts a tool that processes client data, it is effectively extending its circle of confidentiality to include the vendor and the vendor's own subcontractors and infrastructure. The trust the client places in the clinician is, in part, being passed along to a company the client has never met and cannot evaluate. This is why due diligence is an ethical act and not merely a procurement formality: the practice is acting as the client's fiduciary in deciding whose hands the client's information will pass through. Viewed this way, the questions of the vetting process, where data lives, who can see it, how it is protected, what happens if the vendor fails, are not bureaucratic box-checking but the concrete substance of the practice's duty to safeguard what the client has confided.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>The Evaluation Dimensions</h2>
<p>A rigorous vetting process examines a prospective tool across several dimensions, each of which can independently disqualify a vendor. The first is <strong>evidence</strong>. For any tool that touches clinical work, the practice should ask what independent, peer-reviewed evidence supports its claimed benefit for a population resembling the practice's clients. Vendor white papers, engagement statistics, and testimonials are not clinical evidence. A documentation tool need not show a randomized trial, but a tool that claims to improve a clinical outcome, such as detecting risk or improving adherence, should be held to the same evidence hierarchy the practice applies to any intervention. Absence of independent evidence is itself a material finding, not a neutral gap.</p>
<p>The second dimension is <strong>security</strong>. The practice should determine how the vendor protects data in transit and at rest, whether data is encrypted, what authentication and access controls exist, whether the vendor has undergone independent security assessment such as a SOC 2 examination, and what its breach history and breach-notification commitments are. The third dimension is the <strong>Business Associate Agreement</strong>. For any tool processing protected health information, a signed Business Associate Agreement is non-negotiable under the Health Insurance Portability and Accountability Act. The absence of a willingness to sign one is an immediate disqualification, regardless of how useful the tool appears. The agreement should specify permitted uses, safeguards, breach notification, and the handling of data on termination.</p>
<p>The fourth dimension is <strong>data practices</strong>. The practice must learn precisely what the vendor does with the data it processes: where it is stored, who can access it, how long it is retained, whether it is shared with or sold to third parties, and, critically, whether client data is used to train the vendor's models. A tool that improves itself by ingesting client session content raises confidentiality concerns that a Business Associate Agreement alone may not resolve, and the practice should insist on clear, written terms. The fifth dimension is <strong>validation</strong>: how the vendor tested the tool, in what populations, and whether it monitors for performance drift and bias after deployment. The sixth is <strong>support</strong>: what the vendor commits to in uptime, response time, security patching, and clinical or technical assistance, because a tool the practice depends on becomes a single point of failure if the vendor cannot or will not support it.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Red Flags, Total Cost, and the Exit Plan</h2>
<p>Certain vendor behaviors are reliable warning signs. A vendor that cannot or will not sign a Business Associate Agreement, that is evasive about where data is stored or whether it trains models on client content, that substitutes testimonials for evidence when asked about clinical efficacy, that cannot describe its security posture or has an undisclosed breach history, or that locks data in a proprietary format with no export path, each of these is a red flag that should weigh heavily against adoption. A particularly important red flag is contractual: terms that allow the vendor to change data-use practices unilaterally, that disclaim all liability, or that bind the practice to long lock-in periods without performance guarantees. A vendor that resists transparency during the courtship of a sales process will not become more transparent after the contract is signed.</p>
<p>Beyond the headline price, the practice must assess <strong>total cost</strong>: implementation effort, staff training time, integration with existing systems, ongoing per-seat or per-use fees, and the opportunity cost of the clinician hours spent reviewing the tool's outputs. A tool advertised as free may carry substantial hidden costs in training, review, and data risk. Finally, and counterintuitively, the practice should plan the <strong>exit before it enters</strong>. Before adopting a tool, the practice should know how it would leave: whether it can export its data in a usable, standard format, how long the vendor retains data after termination and whether it certifies deletion, and whether the practice would be operationally stranded if the vendor failed or was acquired. Data portability is not a luxury feature; it is the practice's insurance against vendor failure, and a tool that cannot be exited cleanly should rarely be entered. A structured vetting checklist that covers evidence, security, the Business Associate Agreement, data practices, validation, support, red flags, total cost, and exit and portability turns these dimensions into a repeatable discipline that protects the practice on every adoption decision.</p>`,
        },
        {
          type: 'text', order: 5,
          content: `<h2>Operationalizing the Vetting Checklist</h2>
<p>A checklist is only useful if it changes behavior, so the practice should embed it in the adoption process the governance policy defines. When any staff member proposes a new tool, the tool steward initiates the checklist, gathering documentation from the vendor and recording findings dimension by dimension. Each dimension yields one of three outcomes: a clear pass, a clear fail that disqualifies the tool, or a finding that requires follow-up before a decision. A single disqualifying finding, such as refusal to sign a Business Associate Agreement for a tool that processes protected health information, ends the evaluation regardless of how strong the tool is elsewhere; safety and compliance are not averaged against convenience. The completed checklist becomes part of the tool's permanent record, so that the basis for the decision is documented and can be revisited at the tool's scheduled review.</p>
<p>The checklist also disciplines the practice against the most common failure in vendor selection, which is allowing a single attractive feature to override a constellation of risks. A documentation tool may draft beautiful notes and still be unadoptable because it trains its models on client audio without clear consent terms. A scheduling assistant may save hours and still be unadoptable because it cannot export the practice's data. By forcing every dimension to be examined before any decision is reached, the checklist prevents the natural tendency to fall in love with a benefit and rationalize away the risks. It also creates fairness and consistency: every vendor faces the same questions, so the decision reflects the tool's actual merits rather than the persuasiveness of a particular salesperson or the enthusiasm of a particular colleague.</p>
<p>Finally, the checklist should be a living instrument. As regulations evolve, as the practice's understanding of artificial-intelligence risk matures, and as new failure modes are discovered in the field, the checklist's questions should be updated and the updated version applied at each tool's next scheduled review. A tool that passed two years ago under an earlier checklist is not exempt from current standards; the practice re-applies the current checklist at review, because a vendor's data practices, security posture, and contractual terms can all change after adoption. Due diligence, in other words, is not a one-time gate at the threshold of adoption but a recurring discipline that follows a tool throughout its life in the practice, which connects directly to the monitoring and review obligations examined in Section 4.</p>
<p>A further discipline that strengthens vendor selection is requiring the vendor to answer in writing. Verbal assurances from a sales representative, however reassuring, are not commitments the practice can rely on or revisit. When the practice asks where data is stored, whether it is used to train models, what the breach-notification timeline is, and how data is returned on termination, it should obtain those answers in the contract, the Business Associate Agreement, or a written data-processing addendum, not merely in conversation. Written answers serve three purposes: they force the vendor to be precise, they create a record the practice can audit later, and they convert a marketing claim into a contractual obligation the vendor can be held to. A vendor that will say something but will not write it down is signaling that the claim is softer than it sounds, and that gap between what is said and what is committed is itself diagnostic. The practice that insists on written answers learns more about a vendor from the negotiation than from the demonstration.</p>
<p>It also helps to right-size the rigor of due diligence to the risk of the tool, because not every adoption warrants the same depth of scrutiny. A purely administrative scheduling assistant that never touches clinical content can be vetted more lightly than a documentation tool that records sessions or a model that influences clinical decisions. Tiering the depth of due diligence to the tool's clinical proximity and data sensitivity keeps the process proportionate and sustainable; a practice that demands a full clinical-evidence review for a calendar tool will exhaust itself and begin cutting corners everywhere. The governance framework's tiers, introduced in Section 1, map naturally onto this graduated diligence: the closer a tool sits to clinical judgment and to protected health information, the more searching the evaluation, while lower-risk tools clear a lighter, faster gate. Proportionality is what makes rigorous due diligence something a small practice can actually maintain rather than abandon under its own weight.</p>`,
        },
        {
          type: 'callout', order: 6, calloutType: 'warning', title: 'No Business Associate Agreement, No Adoption',
          content: '<p>For any artificial-intelligence tool that processes protected health information, a signed Business Associate Agreement is a non-negotiable requirement under the Health Insurance Portability and Accountability Act. A vendor\'s unwillingness to sign one, or evasiveness about whether it trains models on client data, is an immediate disqualification, no matter how impressive the tool. Convenience never outweighs a compliance failure, and a tool adopted without a required Business Associate Agreement exposes the practice to breach liability and the clients to a confidentiality violation they never consented to.</p>',
        },
        {
          type: 'accordion', order: 7, title: 'The Vendor Vetting Dimensions in Depth',
          accordionItems: [
            { title: 'Evidence', content: '<p>What independent, peer-reviewed evidence supports the tool\'s claimed benefit for a population resembling the practice\'s clients? White papers, engagement statistics, and testimonials are not clinical evidence. Absence of independent evidence is a material finding, not a neutral gap, and tools claiming clinical outcomes face the same evidence hierarchy as any intervention.</p>' },
            { title: 'Security', content: '<p>How is data protected in transit and at rest? Is it encrypted? What authentication and access controls exist? Has the vendor undergone independent assessment such as a SOC 2 examination, and what is its breach history and notification commitment? A vendor that cannot describe its security posture should not be trusted with clinical data.</p>' },
            { title: 'Business Associate Agreement and contracting', content: '<p>For any tool touching protected health information, a signed agreement specifying permitted uses, safeguards, breach notification, and data handling on termination is mandatory. Watch contract terms that allow unilateral changes to data use, disclaim all liability, or impose long lock-in without performance guarantees.</p>' },
            { title: 'Data practices', content: '<p>Where is data stored, who can access it, how long is it retained, is it shared or sold, and is client data used to train the vendor\'s models? A tool that improves itself by ingesting session content raises confidentiality concerns a Business Associate Agreement alone may not resolve. Insist on clear written terms.</p>' },
            { title: 'Validation and support', content: '<p>How was the tool tested, in what populations, and does the vendor monitor for drift and bias after deployment? What does the vendor commit to for uptime, response time, patching, and assistance? A depended-upon tool is a single point of failure if the vendor cannot or will not support it.</p>' },
            { title: 'Total cost and exit / data portability', content: '<p>Account for implementation, training, integration, ongoing fees, and clinician review time beyond the headline price. Plan the exit before entering: can data be exported in a standard format, how long is data retained after termination, is deletion certified, and would the practice be stranded if the vendor failed? A tool that cannot be exited cleanly should rarely be entered.</p>' },
          ],
        },
        {
          type: 'imageText', order: 8, title: 'Plan the Exit Before You Enter',
          content: '<p>Counterintuitively, the strongest moment to evaluate how a practice will leave a vendor is before it signs on. At that point the practice has maximum leverage and no sunk-cost bias. Data portability, retention-after-termination terms, certified deletion, and freedom from proprietary lock-in are all easiest to secure as conditions of entry. A tool whose exit is unclear at the outset becomes a trap that is far harder to escape once client data, staff habits, and workflows have grown around it.</p>',
          image: '', imageAlt: 'Diagram showing an entry gate and an exit gate, with data-portability terms negotiated at entry', imagePosition: 'left',
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'A documentation vendor offers an impressive free tool but declines to sign a Business Associate Agreement and is evasive about whether it trains its models on client audio. The most appropriate response is to:',
          options: [
            { text: 'Adopt it because it is free and the notes are high quality', isCorrect: false },
            { text: 'Disqualify it; for a tool processing protected health information, the absence of a Business Associate Agreement and clarity on data use is an immediate disqualifier', isCorrect: true },
            { text: 'Adopt it provisionally and ask for the agreement later', isCorrect: false },
            { text: 'Let each clinician decide individually whether to use it', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'A signed Business Associate Agreement is non-negotiable for tools processing protected health information under the Health Insurance Portability and Accountability Act, and evasiveness about model training on client data compounds the problem. Convenience never outweighs a compliance failure.',
        },
        {
          type: 'fillInBlank', order: 10, title: 'Name the Vetting Concept',
          blanks: [
            { prompt: 'A signed ____ Agreement is required under the Health Insurance Portability and Accountability Act for any vendor that processes protected health information on the practice\'s behalf.', answer: 'Business Associate', acceptAlternates: ['business associate'] },
            { prompt: 'The ability to export the practice\'s data in a usable, standard format so it is not trapped in a vendor\'s proprietary system is called data ____.', answer: 'portability', acceptAlternates: [] },
            { prompt: 'Looking beyond the headline price to implementation, training, integration, fees, and clinician review time is assessing the ____ cost of a tool.', answer: 'total', acceptAlternates: [] },
            { prompt: 'A vendor behavior that serves as a reliable warning sign against adoption, such as refusing a Business Associate Agreement, is called a red ____.', answer: 'flag', acceptAlternates: [] },
          ],
        },
        {
          type: 'scenarioTree', order: 11,
          scenarioTitle: 'Vetting a Risk-Prediction Tool',
          instructions: 'A vendor pitches a tool that flags clients at elevated risk of crisis. Work through the due-diligence decision.',
          startNode: 'start',
          nodes: {
            start: { text: 'The demo is compelling and a colleague endorses the tool. The vendor offers a 30-day trial starting today. What is your first move?', choices: [{ text: 'Begin the trial immediately to see results before competitors adopt it', nextId: 'rush' }, { text: 'Initiate the vetting checklist and request evidence, security documentation, and a Business Associate Agreement', nextId: 'vet' }] },
            rush: { text: 'Beginning a trial of a clinical risk tool before vetting exposes client data and lets an unvalidated output influence care. Return and run the checklist first; a trial is still an adoption decision.', isEnd: true },
            vet: { text: 'Good. The vendor provides a Business Associate Agreement and security documentation but offers only internal engagement statistics, no independent peer-reviewed evidence that the tool improves outcomes, and no data on performance across different populations. What now?', choices: [{ text: 'Adopt it; the security and agreement are sufficient', nextId: 'rush' }, { text: 'Treat the absence of independent evidence and population-validation data as a material finding and decline or defer pending stronger evidence', nextId: 'good' }] },
            good: { text: 'Correct. For a tool that claims a clinical benefit and could shape care, internal engagement metrics are not clinical evidence, and unknown performance across populations is an equity risk. You protected clients by holding the tool to the evidence hierarchy and refusing to let a compelling demo substitute for validation.', isEnd: true },
          },
        },
        {
          type: 'reflection', order: 12, question: 'Recall the last technology tool your practice adopted. Which of the vetting dimensions, evidence, security, Business Associate Agreement, data practices, validation, support, total cost, exit, were actually examined before adoption, and which were skipped? If you had to exit that vendor tomorrow, do you know how you would retrieve your data?' },
        {
          type: 'keyTakeaway', order: 13, title: 'Key Takeaways',
          takeaways: [
            'Due diligence is the disciplined counterweight to persuasive marketing: a structured, repeatable evaluation applied to every prospective tool.',
            'Evaluate across evidence, security, the Business Associate Agreement, data practices, validation, and support; any one can independently disqualify a vendor.',
            'Red flags include refusal to sign a Business Associate Agreement, evasiveness about model training on client data, testimonials in place of evidence, and proprietary data lock-in.',
            'Assess total cost beyond the headline price, including training, integration, fees, and clinician review time.',
            'Plan the exit before entering: data portability, retention-after-termination, and certified deletion are easiest to secure as conditions of entry and are the practice\'s insurance against vendor failure.',
          ],
        },
      ],
    },
    {
      title: 'Policies, Consent, and Documentation',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '3', title: 'Policies, Consent, and Documentation', subtitle: 'From the written AI policy to client-facing disclosure and consent, documenting AI-assisted decisions, staff acceptable use, and the audit trail', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>From Framework to Operating Policy</h2>
<p>Section 1 established the governance framework and the high-level artificial-intelligence use policy; this section operationalizes the parts of that policy that touch clients and records most directly: disclosure, consent, documentation, staff acceptable use, and audit trails. These are the points at which abstract principles become concrete obligations to the people the practice serves. Transparency and accountability are not satisfied by a policy sitting in a binder; they are satisfied when a client genuinely understands that artificial intelligence assists their care and consents to it, when a record accurately reflects how a decision was reached, and when the practice can reconstruct, after the fact, who used which tool and how.</p>
<p>The written artificial-intelligence policy should make explicit what the framework principles imply for daily practice. It should state when and how clients are informed of artificial-intelligence use, what the standard of human review is for artificial-intelligence-assisted clinical work, how artificial-intelligence involvement is documented in the record, what staff may and may not do with artificial-intelligence tools, and how the practice maintains an audit trail of tool use. The American Counseling Association Code of Ethics, particularly Section H on distance counseling, technology, and social media, and parallel provisions in the codes of allied professions, establishes that the duties of informed consent, confidentiality, and competence extend fully to technology-mediated practice. The artificial-intelligence policy is the practice's translation of those enduring duties into the specifics of artificial-intelligence tools.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Client Disclosure and Consent</h2>
<p>Informed consent is a cornerstone of ethical practice, and it extends to material uses of artificial intelligence in a client's care. The guiding question is whether a reasonable client would want to know that a tool is involved; when the answer is yes, disclosure is required. Disclosure should be proportionate to the tool's clinical proximity. A purely administrative scheduling assistant may warrant a general notice in the practice's policies, whereas a documentation tool that records and transcribes sessions, or any tool that influences clinical decisions, warrants specific, understandable disclosure and, in most cases, affirmative consent. The disclosure should be written in plain language a client can understand, not in technical or legalistic terms that obscure rather than inform.</p>
<p>Effective consent language tells the client, in accessible terms, what tool is used, what it does, what data it touches, how that data is protected, that a human clinician remains responsible for all clinical decisions, and that the client may ask questions or decline. For a session-recording documentation tool, for example, the disclosure might explain that sessions are recorded and processed by a secure, contracted service to help draft clinical notes, that the clinician reviews and finalizes every note, that the client's information is protected under a Business Associate Agreement and is not used to train the vendor's systems, and that the client may decline the use of the tool without affecting their care. Consent should be documented, and the client's right to decline must be genuine, meaning that declining triggers an alternative workflow rather than a loss of service. Consent that cannot be refused is not consent; it is notice dressed as choice.</p>
<p>Disclosure also has limits that must be honored. A client cannot meaningfully consent to a use the practice itself does not understand, which is why transparency to the practice precedes transparency to the client. If the practice cannot explain what a tool does with client data, it is not ready to seek consent for that tool. Likewise, consent does not cure an underlying compliance defect: obtaining a client's signature does not make it acceptable to route protected health information through a vendor lacking a Business Associate Agreement. Consent operates within the boundaries of the practice's other obligations, not as a waiver of them.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Documenting AI-Assisted Decisions and Staff Acceptable Use</h2>
<p>When artificial intelligence assists a clinical decision or the creation of a record, the documentation should reflect that fact with appropriate transparency, and the clinician must remain the author accountable for the content. For documentation tools, the governing rule is that the clinician reviews every artificial-intelligence-drafted note in full, against their own memory of the session, and corrects any error, omission, or fabrication before signing. The signed note is the clinician's note, not the tool's, and the clinician owns its accuracy. Where a tool has materially shaped a clinical decision, such as a risk model that prompted a change in level of care, the record should reflect the clinician's independent reasoning, noting that the tool's output was one input that the clinician evaluated rather than a determination the clinician simply adopted.</p>
<p>Staff acceptable-use provisions translate the policy into the behavior expected of every team member. They specify which tools staff may use for which purposes, prohibit pasting identifiable client information into unapproved or consumer-grade tools, require human review of artificial-intelligence outputs before reliance, and mandate prompt reporting of errors or concerns. Acceptable-use rules protect clients by closing the most common avenues of accidental disclosure, and they protect staff by removing ambiguity about what is permitted. A frequent and serious lapse is a well-meaning clinician pasting a client narrative into a public generative tool to "polish" a note, unaware that the client's protected health information has just left the practice's control and possibly entered a vendor's training data. Clear acceptable-use rules, paired with training, are the practice's defense against this category of error.</p>
<p>Acceptable-use policy also needs an enforcement and education dimension, because a rule no one is trained on and no one monitors is a rule in name only. Staff should be onboarded to the policy, periodically refreshed as tools and rules change, and given a low-friction way to ask whether a particular use is permitted before they act. The aim is not a punitive regime but a culture in which staff understand the reasons behind the rules, recognize the genuine confidentiality stakes, and feel responsible for protecting clients. When staff understand that the prohibition on consumer-grade generative tools exists to keep a client's most private disclosures from leaking into systems beyond the practice's control, the rule becomes something they own rather than something imposed on them.</p>`,
        },
        {
          type: 'text', order: 5,
          content: `<h2>Audit Trails and the Reconstructable Record</h2>
<p>Accountability requires that the practice be able to reconstruct, after the fact, how artificial intelligence was involved in its work. An audit trail is the mechanism that makes this possible. At minimum, the practice should maintain an inventory of every artificial-intelligence tool in use, with its purpose, vendor, Business Associate Agreement status, data practices, approval date, and review date. Where tools themselves log activity, such as which user accessed which client record or which note a documentation tool drafted, those logs should be preserved according to the practice's retention policy. The audit trail answers the questions that arise when something goes wrong: which tool was involved, who used it, what data it touched, whether the required safeguards were in place, and whether the policy was followed.</p>
<p>Audit trails serve several purposes beyond incident response. They support the periodic review of each tool, providing the factual record on which a renew-or-retire decision rests. They support regulatory and accreditation inquiries, demonstrating that the practice governs its tools deliberately. And they support continuous improvement, surfacing patterns, such as a particular tool generating frequent corrections, that signal a problem worth addressing. A practice that cannot reconstruct its own artificial-intelligence use is a practice that cannot truly govern it, because it cannot learn from its history, answer for its decisions, or detect when a tool has begun to fail. The audit trail is the documentary backbone of accountability, and maintaining it is a core governance task rather than an optional administrative nicety. Together, disclosure, consent, documentation, acceptable use, and the audit trail convert the practice's principles into a record that protects clients, staff, and the practice itself, and they set the stage for the monitoring and risk management examined in Section 4.</p>
<p>A practical caution about the audit trail is that it must itself be governed, because the trail can contain sensitive information. Logs of which client records a tool accessed, drafts a documentation tool produced, and reports staff filed about errors are records that hold protected health information and information about the practice's own conduct. They must be stored securely, access-controlled, and retained according to the same standards that govern any clinical record, neither discarded prematurely nor allowed to accumulate indefinitely without purpose. The aim is a trail that is complete enough to reconstruct what happened and protected enough that the reconstruction does not itself become a new exposure. A well-kept audit trail is therefore a balance: thorough where accountability requires it, disciplined in retention, and as carefully secured as the clinical data whose handling it documents.</p>`,
        },
        {
          type: 'callout', order: 6, calloutType: 'protocol', title: 'The Full-Review Standard for AI-Drafted Notes',
          content: '<p>Every artificial-intelligence-drafted clinical note must be read in full by the responsible clinician, against their own memory of the session, and corrected before signing. The signed note is the clinician\'s note, and the clinician owns its accuracy. A generative tool can insert a plausible but false statement, a denied symptom, an unstated plan, an event that never occurred, and once signed, that note is a legal and clinical record the clinician authored. The full-review standard is not optional diligence; it is the safeguard that keeps a documentation tool from quietly corrupting the record.</p>',
        },
        {
          type: 'accordion', order: 7, title: 'Building Client-Facing Disclosure and Consent',
          accordionItems: [
            { title: 'When disclosure is required', content: '<p>The guiding test is whether a reasonable client would want to know the tool is involved. Disclosure scales with clinical proximity: a general notice may suffice for purely administrative tools, while session-recording documentation tools and any tool influencing clinical decisions warrant specific, understandable disclosure and, usually, affirmative consent.</p>' },
            { title: 'What consent language should contain', content: '<p>In plain language: what tool is used, what it does, what data it touches, how that data is protected, that a human clinician remains responsible for all clinical decisions, and that the client may ask questions or decline. Avoid technical or legalistic phrasing that obscures rather than informs.</p>' },
            { title: 'The genuine right to decline', content: '<p>The client\'s right to refuse must be real: declining triggers an alternative workflow rather than a loss of service. Consent that cannot be refused is notice dressed as choice, not informed consent.</p>' },
            { title: 'The limits of consent', content: '<p>A client cannot consent to a use the practice itself does not understand, so transparency to the practice precedes transparency to the client. Consent also does not cure a compliance defect: a signature does not make it acceptable to route protected health information through a vendor lacking a Business Associate Agreement.</p>' },
          ],
        },
        {
          type: 'videoEmbed', order: 8, videoTitle: 'Informed Consent in the Age of AI-Assisted Care',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aiconsent',
          description: 'A practical overview of how informed-consent duties extend to artificial-intelligence-assisted care, with attention to disclosure proportionate to clinical proximity and the genuine right to decline. Reinforces the consent standards introduced in this section.',
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'A practice adopts a session-recording documentation tool. Regarding client consent, the most ethically sound approach is to:',
          options: [
            { text: 'Skip disclosure because the clinician still finalizes the note', isCorrect: false },
            { text: 'Provide plain-language disclosure of what the tool does and how data is protected, obtain affirmative consent, and offer a genuine alternative if the client declines', isCorrect: true },
            { text: 'Bury a notice in the intake paperwork that cannot be refused', isCorrect: false },
            { text: 'Disclose the tool only if the client specifically asks', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'A session-recording tool warrants specific, plain-language disclosure and affirmative consent, with a genuine right to decline that triggers an alternative workflow. Consent that cannot be refused is notice dressed as choice, and clinical finalization does not eliminate the duty to disclose.',
        },
        {
          type: 'multiSelect', order: 10,
          question: 'Which practices belong in a sound staff acceptable-use policy for artificial-intelligence tools? (Select all that apply)',
          options: [
            { text: 'Prohibiting pasting identifiable client information into unapproved or consumer-grade tools', isCorrect: true },
            { text: 'Requiring human review of artificial-intelligence outputs before reliance', isCorrect: true },
            { text: 'Allowing any clinician to adopt any tool they personally find useful', isCorrect: false },
            { text: 'Mandating prompt reporting of errors or concerns involving a tool', isCorrect: true },
            { text: 'Providing onboarding and periodic refresher training on the rules and their reasons', isCorrect: true },
          ],
          explanation: 'Acceptable use prohibits leaking client data into unapproved tools, requires human review before reliance, mandates reporting, and is reinforced through training. Allowing unilateral, unvetted adoption by individual staff defeats the governance framework.',
        },
        {
          type: 'cardSort', order: 11,
          instructions: 'Sort each action into whether it satisfies or violates the practice\'s artificial-intelligence policy.',
          categories: ['Policy-Compliant', 'Policy Violation'],
          cards: [
            { id: 'c1', text: 'Reading an artificial-intelligence-drafted note in full against memory of the session and correcting it before signing', correctCategory: 'Policy-Compliant' },
            { id: 'c2', text: 'Pasting a client\'s narrative into a free public chatbot to polish the wording of a note', correctCategory: 'Policy Violation' },
            { id: 'c3', text: 'Disclosing a session-recording tool to a client in plain language and obtaining affirmative consent', correctCategory: 'Policy-Compliant' },
            { id: 'c4', text: 'Adopting a new documentation app on a personal trial without vetting or approval', correctCategory: 'Policy Violation' },
            { id: 'c5', text: 'Recording artificial-intelligence involvement and the clinician\'s independent reasoning when a tool shaped a decision', correctCategory: 'Policy-Compliant' },
            { id: 'c6', text: 'Treating a risk model\'s flag as a final verdict and changing level of care without independent assessment', correctCategory: 'Policy Violation' },
          ],
        },
        {
          type: 'reflection', order: 12, question: 'If a client asked you today, "Is artificial intelligence being used in my care, and what happens to my information?" could you answer clearly and accurately for every tool your practice uses? Where would your answer be uncertain, and what would you need to learn or document to make it complete?' },
        {
          type: 'keyTakeaway', order: 13, title: 'Key Takeaways',
          takeaways: [
            'Disclosure and consent scale with a tool\'s clinical proximity; the test is whether a reasonable client would want to know the tool is involved.',
            'Consent language should be plain, state what the tool does and how data is protected, affirm clinician responsibility, and preserve a genuine right to decline.',
            'Every artificial-intelligence-drafted note is read in full and corrected before signing; the signed note is the clinician\'s, and the clinician owns its accuracy.',
            'Staff acceptable-use rules prohibit leaking client data into unapproved tools, require human review, mandate reporting, and are reinforced through training.',
            'An audit trail, tool inventory and activity logs, is the documentary backbone of accountability and the factual basis for renew-or-retire decisions.',
          ],
        },
      ],
    },
    {
      title: 'Monitoring, Quality Improvement, and Risk Management',
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '4', title: 'Monitoring, Quality Improvement, and Risk Management', subtitle: 'Phased rollout, metrics, error reporting, incident response, ongoing review, sunset and deprovisioning, and the liability and insurance implications of adoption', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Adoption Is the Beginning, Not the End</h2>
<p>A common and costly misconception treats the decision to adopt a tool as the finish line. In reality, adoption is the starting line of a relationship that must be actively managed for as long as the tool is in use. The National Institute of Standards and Technology framework's measure and manage functions exist precisely because trustworthy artificial intelligence is not established once at deployment but maintained continuously. A model can drift as populations and documentation styles change; a vendor can alter its data practices; a tool that was safe at launch can become unsafe through an update the practice never reviewed. Monitoring is the discipline of catching these changes before they harm a client, and it is as essential to responsible adoption as the vetting that preceded it.</p>
<p>The first principle of safe adoption is to roll out in phases rather than all at once. A <strong>phased or piloted rollout</strong> introduces the tool to a small, well-supported group first, perhaps a single clinician or a single workflow, under close observation, before extending it across the practice. The pilot surfaces problems while the stakes are contained, allows the practice to refine its review standards and training, and builds the practical knowledge needed to support a wider rollout. A practice that deploys a new documentation tool to every clinician on the same day, with no pilot, discovers its failure modes at scale and in production, which is the most expensive and the most dangerous way to learn them. Phasing trades a little speed for a great deal of safety.</p>
<p>A well-designed pilot has features that distinguish it from simply being first to use a tool. It defines, in advance, what success and failure look like, so the practice knows what it is watching for rather than forming a vague impression. It pairs the piloting clinician with heightened review and a direct line to the tool steward and clinical reviewer, so problems are caught and escalated quickly. It runs long enough to encounter the tool's edge cases, not only its everyday behavior, because the dangerous failures often hide in the unusual session, the atypical client, or the rushed afternoon. And it concludes with an explicit decision, expand, adjust, or abandon, made against the predefined criteria rather than against enthusiasm or sunk cost. A pilot without these features is not a pilot but merely an early adoption that exposes the first user to undiagnosed risk; a true pilot is a deliberate experiment whose purpose is to learn safely before the practice commits at scale.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Metrics, Error Reporting, and Incident Response</h2>
<p>What is not measured cannot be managed, so the practice should define, before rollout, the <strong>metrics</strong> that will tell it whether a tool is performing as intended. Metrics should be tied to the tool's purpose and to the practice's principles. For a documentation tool, relevant metrics might include the rate and type of corrections clinicians make to drafted notes, the time saved or added, and any instances of fabricated content caught in review. For a tool with clinical influence, metrics should include indicators of accuracy and, crucially, of equitable performance across the populations the practice serves, because aggregate accuracy can mask serious disparities. Metrics should be reviewed on a defined cadence by a named owner, so that a degrading tool is noticed by design rather than by accident.</p>
<p>A functioning <strong>error-reporting</strong> channel is the practice's early-warning system. Staff must have a low-friction, blame-free way to report when a tool produces an error, a near-miss, or a concerning output, and those reports must reach the incident handler and feed the tool's metrics. A blame-free posture is essential: if staff fear punishment for reporting that a tool fabricated a symptom, they will stop reporting, and the practice will go blind to its tools' failures. The reports that matter most are often near-misses, errors caught before they reached a client, because they reveal a failure mode before it causes harm. A practice that treats near-miss reports as valuable intelligence, rather than as evidence of carelessness, learns continuously and cheaply.</p>
<p><strong>Incident response</strong> is the defined process for what happens when a tool causes or nearly causes harm. A sound process specifies who is notified, how the immediate risk to any affected client is addressed, how the error is contained and corrected in the record, whether the tool should be suspended pending investigation, what is documented, and whether the incident triggers regulatory obligations such as a breach notification. The most important early decision in many incidents is whether to suspend the tool: when a documentation tool is found to be fabricating content or a clinical tool is found to be performing unsafely, the safe default is to suspend its use until the problem is understood and resolved. A practice that has rehearsed its incident-response process in advance responds calmly and effectively; a practice improvising during a crisis compounds the harm.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Ongoing Review, Sunset, and Deprovisioning</h2>
<p>Every tool in use should be subject to <strong>ongoing review</strong> on a defined schedule, at which the practice revisits the tool against the current vetting checklist, examines its accumulated metrics and incident history, confirms that its Business Associate Agreement and data practices remain acceptable, and makes a deliberate renew-or-retire decision. A tool's place in the practice is never permanent; it is renewed by choice at each review. This cadence catches the slow problems, vendors that changed their terms, tools whose performance drifted, products that have been superseded by safer alternatives, that a one-time vetting at adoption would never reveal. Review is the mechanism that keeps the practice's tool inventory current, safe, and justified.</p>
<p>When a tool is retired, whether because it failed review, was superseded, or is no longer needed, the practice executes a <strong>sunset and deprovisioning</strong> plan. Deprovisioning is the disciplined withdrawal of a tool: exporting the practice's data in a usable format, confirming the vendor's deletion of retained data and obtaining certification where possible, revoking the tool's access to systems and the access credentials of staff who used it, updating the tool inventory and client disclosures, and ensuring that any workflow the tool supported transitions cleanly to its replacement or successor process. Sloppy deprovisioning leaves orphaned access, stranded data, and clients still being told a tool is in use when it is not. This is exactly why the exit was planned before entry in Section 2: a tool with clean data portability and clear deletion terms can be deprovisioned cleanly, while a tool without them becomes painful and risky to remove.</p>
<p>Underlying all of this is the practice's <strong>liability and insurance</strong> posture. Adopting artificial intelligence does not transfer the practice's professional liability to the vendor; the clinician remains accountable for clinical judgments and for the accuracy of the record, and the practice remains accountable for protecting client data. Prudent practices review their professional liability and cyber-liability coverage in light of artificial-intelligence adoption, confirm whether their policies address technology-related and data-breach exposures, and understand the limits of vendor indemnification, which is often narrow and capped. The contractual disclaimers vendors favor mean that, in practice, much of the residual risk stays with the practice. Recognizing this, and managing it through governance, monitoring, and appropriate insurance, is the mature posture toward artificial-intelligence risk. Responsible adoption is not the absence of risk; it is the deliberate, ongoing management of risk by people who have named it, measured it, and prepared to respond to it.</p>`,
        },
        {
          type: 'text', order: 5,
          content: `<h2>Building a Culture of Continuous Improvement</h2>
<p>The activities described in this section, piloting, measuring, reporting, responding, reviewing, and retiring, are most effective when they form a continuous loop rather than a checklist completed once. Quality improvement in artificial-intelligence governance borrows directly from the quality-improvement traditions clinicians already know: define a desired outcome, measure performance against it, identify gaps, intervene, and measure again. Applied to a documentation tool, this might mean noticing through metrics that a particular type of fabrication recurs, adjusting the review protocol and training to catch it, and then confirming through subsequent metrics that the correction rate for that error has fallen. The loop turns isolated incidents into systematic learning, and it converts a static governance framework into a living one that improves with experience.</p>
<p>Culture is the decisive variable. A practice can write excellent policies and still fail if its culture punishes the reporting of problems, rewards speed over safety, or treats artificial-intelligence outputs as authoritative rather than provisional. The leaders of a practice set this culture through what they reward and what they tolerate. When leadership visibly values a near-miss report, takes a clinician's safety concern seriously, suspends a tool when warranted despite the inconvenience, and treats the review schedule as a genuine commitment rather than a formality, staff internalize that responsible adoption is the real expectation. When leadership treats governance as paperwork, staff treat it as paperwork too, and the framework becomes decorative. The most sophisticated monitoring infrastructure is worthless without a culture that uses it honestly.</p>
<p>Finally, continuous improvement extends to the governance framework itself. The framework, the use policy, the vetting checklist, the metrics, the incident-response process, should all be revisited periodically and revised in light of experience, new failure modes discovered in the field, evolving regulation, and the maturing understanding of the practice. The field of artificial intelligence in behavioral health is young and moving quickly; a framework frozen at the moment of its writing will steadily fall behind the tools it is meant to govern. A practice that revises its governance as it learns, that treats its own framework as a tool subject to review, embodies the deepest principle of this course: that responsible adoption is not a one-time achievement but an ongoing practice of attention, humility, and accountability, sustained for as long as artificial intelligence remains part of the work.</p>`,
        },
        {
          type: 'callout', order: 6, calloutType: 'tip', title: 'When in Doubt, Suspend the Tool',
          content: '<p>When a tool is found to be fabricating clinical content, performing unsafely, or behaving unequally across populations, the safe default is to suspend its use until the problem is understood and resolved. Suspension is reversible; a harm reaching a client is not. Practices sometimes hesitate to suspend a tool because of the inconvenience of reverting to a prior workflow, but that inconvenience is trivial against the cost of an unsafe tool continuing to shape clinical work. Building the willingness to suspend into the incident-response process, and rehearsing it, removes the hesitation in the moment it matters most.</p>',
        },
        {
          type: 'accordion', order: 7, title: 'The Monitoring and Risk-Management Lifecycle',
          accordionItems: [
            { title: 'Phased / piloted rollout', content: '<p>Introduce a tool to a small, well-supported group or single workflow first, under close observation, before practice-wide deployment. Pilots surface failure modes while stakes are contained and let the practice refine review standards and training before scaling. Deploying to everyone at once means discovering failures at scale and in production.</p>' },
            { title: 'Metrics', content: '<p>Define, before rollout, measures tied to the tool\'s purpose and the practice\'s principles, such as correction rates, time impact, fabrication instances, and equitable performance across populations. Review on a defined cadence by a named owner so a degrading tool is noticed by design.</p>' },
            { title: 'Error reporting', content: '<p>Provide a low-friction, blame-free channel for staff to report errors, near-misses, and concerning outputs. A blame-free posture is essential; punishing reports drives them underground. Near-misses are especially valuable because they reveal failure modes before harm occurs.</p>' },
            { title: 'Incident response', content: '<p>A defined process specifying notification, addressing immediate client risk, containing and correcting the record, deciding whether to suspend the tool, documenting the event, and assessing regulatory obligations such as breach notification. Rehearsed in advance, it produces a calm, effective response.</p>' },
            { title: 'Ongoing review', content: '<p>Re-evaluate each tool on a schedule against the current vetting checklist, its metrics and incident history, and its Business Associate Agreement and data practices, then make a deliberate renew-or-retire decision. A tool\'s place is renewed by choice at each review, never assumed permanent.</p>' },
            { title: 'Sunset and deprovisioning', content: '<p>The disciplined withdrawal of a retired tool: export data, confirm and certify deletion, revoke tool and staff access, update inventory and client disclosures, and transition workflows cleanly. Clean deprovisioning depends on the exit terms negotiated at entry.</p>' },
          ],
        },
        {
          type: 'imageText', order: 8, title: 'The Continuous Governance Loop',
          content: '<p>Monitoring is best understood as a loop, not a line. The practice pilots a tool, measures its performance, reports and responds to errors, reviews the tool on a schedule, and either renews it or retires it through deprovisioning, with each pass feeding lessons back into the framework, the policy, and the vetting checklist. Quality improvement borrows directly from familiar clinical traditions: define an outcome, measure, find gaps, intervene, and measure again. The loop converts isolated incidents into systematic learning and keeps a young, fast-moving field from outrunning the practice that governs it.</p>',
          image: '', imageAlt: 'Circular diagram showing pilot, measure, report, respond, review, and renew-or-retire as a continuous loop feeding back into governance', imagePosition: 'right',
        },
        {
          type: 'multipleChoice', order: 9,
          question: 'A practice discovers, three months after deploying a documentation tool to all clinicians at once, that the tool periodically fabricates denials of suicidal ideation. The deployment approach most likely to have caught this earlier and contained the harm is:',
          options: [
            { text: 'Deploying to every clinician simultaneously to gather more data faster', isCorrect: false },
            { text: 'A phased rollout piloting the tool with one clinician or workflow under close observation before practice-wide deployment', isCorrect: true },
            { text: 'Skipping monitoring once the tool passed initial vetting', isCorrect: false },
            { text: 'Relying solely on the vendor to report any problems', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'A phased, piloted rollout surfaces failure modes while the stakes are contained, allowing detection and correction before practice-wide harm. Deploying to everyone at once means discovering dangerous failures at scale and in production.',
        },
        {
          type: 'sequencing', order: 10,
          instructions: 'Arrange the steps of a sound incident response in the order a practice should follow when a tool is found to be fabricating clinical content.',
          steps: [
            { id: 's1', text: 'Receive and document the error report through the blame-free reporting channel', order: 1 },
            { id: 's2', text: 'Address any immediate risk to affected clients and correct the affected records', order: 2 },
            { id: 's3', text: 'Decide whether to suspend the tool pending investigation, defaulting to suspension when safety is in question', order: 3 },
            { id: 's4', text: 'Investigate the cause, assess scope, and determine any regulatory obligations such as breach notification', order: 4 },
            { id: 's5', text: 'Feed the findings back into metrics, the vetting checklist, training, and the renew-or-retire decision', order: 5 },
          ],
          explanation: 'Incident response moves from receiving the report, to protecting affected clients and the record, to the suspension decision, to investigation and regulatory assessment, and finally to systematic learning that improves the framework. Suspension defaults to yes when safety is genuinely in question.',
        },
        { type: 'multipleChoice', question: "According to this section, what is the safe default when an AI tool is found to be behaving unsafely or unequally across populations?", options: [{ text: "Continue use while quietly monitoring the situation", isCorrect: false }, { text: "Suspend use of the tool until the problem is understood and resolved", isCorrect: true }, { text: "Only restrict use for the specific clients who were affected", isCorrect: false }, { text: "Wait for the vendor to issue a public statement before acting", isCorrect: false }], correctAnswer: 1, explanation: "The course specifies suspension as the safe default: suspension is reversible, while a harm reaching a client may not be, so practices should pause use until the issue is understood and resolved." },
{
          type: 'reflection', order: 11, question: 'For the most clinically significant artificial-intelligence tool in your setting, what would happen right now if it produced a harmful error? Who would be notified, who would decide whether to suspend it, and how would an affected client be protected? If those answers are unclear, what part of an incident-response process would you build first?' },
        {
          type: 'keyTakeaway', order: 12, title: 'Key Takeaways',
          takeaways: [
            'Adoption is the start of an actively managed relationship; the measure and manage functions maintain trustworthiness continuously, not just at launch.',
            'Phased, piloted rollout surfaces failure modes while stakes are contained; define metrics, including equitable performance, before rollout and review them on a cadence.',
            'A blame-free error-reporting channel and a rehearsed incident-response process, with suspension as the safe default, are the practice\'s early-warning and containment systems.',
            'Ongoing scheduled review yields a deliberate renew-or-retire decision; retirement requires clean sunset and deprovisioning, which depends on exit terms set at entry.',
            'Adoption does not transfer professional liability to the vendor; review professional and cyber-liability coverage and recognize that vendor indemnification is often narrow and capped.',
          ],
        },
      ],
    },
    {
      title: 'Summary, Resources, and Commitments',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '5', title: 'Summary, Resources, and Commitments', subtitle: 'Synthesizing the governance framework into practice, curated authoritative resources, and three concrete commitments to carry forward', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Synthesizing the Framework</h2>
<p>This course has moved deliberately from foundation to operation. Section 1 established that responsible artificial-intelligence adoption begins with governance, the deliberate system of principles, policy, and roles by which a practice decides how it will adopt, oversee, and retire tools, anchored in four principles: safety, transparency, accountability, and equity. The central insight, drawn from the National Institute of Standards and Technology framework, is that trustworthy artificial intelligence is a property of the system of people and processes around a tool, not of the tool itself. A solo practice and a large clinic carry the same obligations; a modest written framework, consistently applied, is how a small practice meets large obligations without a large staff.</p>
<p>Section 2 operationalized the framework's commitment to vetting tools through structured vendor due diligence, examining evidence, security, the Business Associate Agreement, data practices, validation, and support, recognizing red flags, assessing total cost, and, distinctively, planning the exit before entering. Section 3 carried governance to the points where it touches clients and records most directly: client disclosure and consent proportionate to a tool's clinical proximity, the full-review standard for artificial-intelligence-drafted notes, staff acceptable-use rules, and the audit trail that makes accountability reconstructable. Section 4 established that adoption is the beginning of an actively managed relationship, sustained through phased rollout, metrics, blame-free error reporting, rehearsed incident response, scheduled review, clean deprovisioning, and a clear-eyed posture toward liability and insurance.</p>
<p>The throughline is a single conviction: that artificial intelligence in behavioral health is neither to be feared nor to be trusted uncritically, but to be governed. Governance is not opposed to innovation; it is what makes innovation safe enough to pursue. The practice that builds a framework, vets its tools, secures genuine consent, documents honestly, monitors continuously, and remains willing to suspend or retire a tool that fails, that practice can adopt artificial intelligence responsibly, capturing its genuine benefits while protecting the clients, the records, and the professional integrity that are the practice's deepest obligations. Responsible adoption is not a one-time achievement but an ongoing practice of attention, humility, and accountability.</p>
<p>It is worth naming, in closing, what this course has not claimed, because the boundaries of the argument matter as much as its content. The course has not claimed that any particular tool is good or bad; it has offered a method for the practice to reach its own well-grounded judgment about any tool it encounters. It has not claimed that artificial intelligence will or will not deliver on its promise in behavioral health; that question remains open and is properly answered by evidence accumulating over time, not by enthusiasm or alarm in the present. And it has not claimed that governance guarantees safety; no framework can eliminate risk entirely, and a practice that believed otherwise would be lulled into exactly the complacency that governance exists to prevent. What governance offers is not certainty but diligence: a disciplined, honest, ongoing attention to the risks a practice is taking on, the safeguards it has put in place, and the moments when a tool must be questioned, paused, or let go. That diligence is squarely within the professional tradition counselors already inhabit, the tradition of fiduciary responsibility, of competence honestly bounded, of client welfare placed first. Adopting artificial intelligence responsibly is, in the end, not a departure from professional identity but an expression of it, carried into a new domain with the same care the profession has always demanded.</p>`,
        },
        {
          type: 'callout', order: 3, calloutType: 'key', title: 'The Course in One Sentence',
          content: '<p>Responsible artificial-intelligence adoption in behavioral health is the deliberate, ongoing governance of tools, anchored in safety, transparency, accountability, and equity, through a written policy and named roles, rigorous vendor due diligence with a planned exit, genuine client consent and honest documentation, and continuous monitoring with the willingness to suspend or retire any tool that fails, so that the practice governs the technology rather than being governed by it.</p>',
        },
        {
          type: 'accordion', order: 4, title: 'A Practical Implementation Sequence',
          accordionItems: [
            { title: 'Start with an inventory and a one-page policy', content: '<p>Before adopting anything new, list every artificial-intelligence tool already in use and who approved it, then draft a focused use policy stating scope and tiers, principle-based rules, prohibited uses, ownership, and an adoption process. A short policy consistently applied beats an elaborate one no one reads.</p>' },
            { title: 'Name the roles, even in a solo practice', content: '<p>Assign the governance owner, tool steward, clinical reviewer, and incident handler. In a solo practice one person holds all four, but naming them ensures each function is consciously performed rather than silently skipped.</p>' },
            { title: 'Build and apply the vetting checklist', content: '<p>Turn the evaluation dimensions, evidence, security, Business Associate Agreement, data practices, validation, support, total cost, and exit, into a repeatable checklist applied to every prospective tool, with a single disqualifying finding ending the evaluation.</p>' },
            { title: 'Write consent and documentation standards', content: '<p>Draft plain-language client disclosures proportionate to clinical proximity, set the full-review standard for artificial-intelligence-drafted notes, and define staff acceptable use and the audit trail.</p>' },
            { title: 'Establish the monitoring loop', content: '<p>Define metrics, a blame-free error-reporting channel, a rehearsed incident-response process, a review schedule, and a deprovisioning plan, then revise the framework itself as the practice learns.</p>' },
          ],
        },
        {
          type: 'flashcardDeck', order: 5,
          instructions: 'Review these synthesis cards consolidating the course\'s central commitments. Each captures a principle to carry into practice.',
          flashcards: [
            { id: 'f1', front: 'The governance-first principle', back: 'Trustworthy artificial intelligence is a property of the people and processes around a tool, not of the tool itself. Responsible adoption begins with governance, not with selecting a product.' },
            { id: 'f2', front: 'The four anchoring principles', back: 'Safety, transparency, accountability, and equity. When a novel situation arises that no rule anticipated, the principles tell the practice how to decide.' },
            { id: 'f3', front: 'Plan the exit before you enter', back: 'Data portability, retention-after-termination, and certified deletion are easiest to secure as conditions of entry and are the practice\'s insurance against vendor failure and the basis for clean deprovisioning.' },
            { id: 'f4', front: 'The full-review standard', back: 'Every artificial-intelligence-drafted clinical note is read in full against the clinician\'s memory of the session and corrected before signing. The signed note is the clinician\'s, and the clinician owns its accuracy.' },
            { id: 'f5', front: 'When in doubt, suspend', back: 'When a tool fabricates content, performs unsafely, or behaves unequally across populations, the safe default is suspension pending investigation. Suspension is reversible; a harm reaching a client is not.' },
          ],
        },
        {
          type: 'multipleChoice', order: 6,
          question: 'A counselor distills the entire course into a single guiding idea to share with a colleague. The most accurate distillation is that responsible artificial-intelligence adoption means:',
          options: [
            { text: 'Choosing the most advanced tool available and trusting its outputs', isCorrect: false },
            { text: 'Deliberately and continuously governing tools through principles, policy, due diligence, consent, and monitoring, so the practice governs the technology rather than the reverse', isCorrect: true },
            { text: 'Avoiding artificial intelligence entirely to eliminate all risk', isCorrect: false },
            { text: 'Transferring responsibility for clinical decisions to the tool vendor', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The course\'s throughline is that artificial intelligence is to be governed, neither feared nor trusted uncritically. Governance through principles, policy, due diligence, consent, and monitoring lets the practice capture benefits while protecting clients, records, and professional integrity.',
        },
        {
          type: 'matching', order: 7,
          matchingInstructions: 'Match each course section to the central capability it builds.',
          matchingPairs: [
            { term: 'Building an AI Governance Framework', definition: 'Establishing principles, a written use policy, and named roles as the foundation of responsible adoption' },
            { term: 'Vendor Selection and Due Diligence', definition: 'Evaluating tools across evidence, security, contracting, data, validation, and support, with a planned exit' },
            { term: 'Policies, Consent, and Documentation', definition: 'Securing genuine client consent, documenting honestly, and maintaining an audit trail of tool use' },
            { term: 'Monitoring, Quality Improvement, and Risk Management', definition: 'Phased rollout, metrics, incident response, review, deprovisioning, and managing liability over time' },
          ],
        },
        {
          type: 'resources', order: 8, title: 'Governance & Implementation Resources',
          resources: [
            { title: 'NIST — AI Risk Management Framework (AI RMF 1.0)', url: 'https://www.nist.gov/itl/ai-risk-management-framework', type: 'link', description: 'The foundational framework organizing trustworthy artificial intelligence around the govern, map, measure, and manage functions used throughout this course.' },
            { title: 'WHO — Ethics and Governance of Artificial Intelligence for Health (2021)', url: 'https://www.who.int/publications/i/item/9789240029200', type: 'pdf', description: 'Core ethical principles for artificial intelligence in health, including human oversight, transparency, accountability, and equity.' },
            { title: 'APA — Guidance and Resources on Technology and Telehealth', url: 'https://www.apaservices.org/practice/clinicians/telehealth', type: 'link', description: 'Professional guidance on technology-mediated practice, applicable to artificial-intelligence-assisted care and informed consent.' },
            { title: 'HHS — HIPAA for Professionals', url: 'https://www.hhs.gov/hipaa/for-professionals/index.html', type: 'link', description: 'Authoritative resource on Health Insurance Portability and Accountability Act obligations, including Business Associate Agreements and breach notification.' },
            { title: 'HHS — Business Associate Contracts (Sample Provisions)', url: 'https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html', type: 'link', description: 'Sample Business Associate Agreement provisions to inform contracting with artificial-intelligence vendors that process protected health information.' },
            { title: 'AMA — Augmented Intelligence in Medicine Policy', url: 'https://www.ama-assn.org/practice-management/digital-health/augmented-intelligence-medicine', type: 'link', description: 'Policy framing of artificial intelligence as augmented intelligence that supports rather than replaces clinician judgment.' },
            { title: 'ONC / ASTP — Health IT and Algorithm Transparency (HTI-1)', url: 'https://www.healthit.gov/topic/laws-regulation-and-policy/health-data-technology-and-interoperability-certification-program', type: 'link', description: 'Federal transparency requirements for predictive algorithms in certified health information technology, relevant to vendor due diligence.' },
            { title: 'ACA — Code of Ethics', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf', type: 'pdf', description: 'Professional ethics code, including Section H on distance counseling, technology, and social media, governing technology-mediated practice.' },
          ],
        },
        {
          type: 'multiSelect', order: 9,
          question: 'Which of the following are concrete commitments a counselor could make after this course to adopt artificial intelligence responsibly? (Select all that apply)',
          options: [
            { text: 'Inventory every artificial-intelligence tool currently in use and confirm a Business Associate Agreement exists for each one touching protected health information', isCorrect: true },
            { text: 'Apply a structured vetting checklist, including a planned exit, before adopting any new tool', isCorrect: true },
            { text: 'Sign all artificial-intelligence-drafted notes without review to save time', isCorrect: false },
            { text: 'Establish plain-language client disclosure and a monitoring loop with a blame-free error-reporting channel', isCorrect: true },
            { text: 'Transfer professional liability for clinical decisions to the tool vendor', isCorrect: false },
          ],
          explanation: 'Responsible commitments include inventorying tools and verifying agreements, vetting with a planned exit, securing client disclosure, and monitoring with blame-free reporting. Signing notes unreviewed and presuming liability transfer both violate the course\'s core standards.',
        },
        {
          type: 'reflection', order: 10, question: 'Of everything in this course, identify the single change that would most improve responsible artificial-intelligence governance in your own setting. What is the first concrete step you will take in the next thirty days, who needs to be involved, and what would success look like?' },
        {
          type: 'keyTakeaway', order: 11, title: 'Key Takeaways',
          takeaways: [
            'Responsible adoption is a system: governance framework, vendor due diligence, consent and documentation, and continuous monitoring, anchored in safety, transparency, accountability, and equity.',
            'Trustworthy artificial intelligence is a property of the people and processes around a tool, and small practices meet large obligations through a modest, consistently applied framework.',
            'Commitment one: inventory every tool in use and confirm a Business Associate Agreement and approval for each, naming the governance roles even in a solo practice.',
            'Commitment two: apply a structured vetting checklist with a planned exit before adopting any new tool, and secure genuine, plain-language client consent.',
            'Commitment three: establish a monitoring loop, metrics, blame-free reporting, rehearsed incident response, scheduled review, and deprovisioning, and remain willing to suspend or retire any tool that fails.',
          ],
        },
      ],
    },
  ],

  assessment: {
    passingScore: 80, passThreshold: 0.8, maxAttempts: 3,
    questions: [
      { question: 'Within the National Institute of Standards and Technology Artificial Intelligence Risk Management Framework, why is governance treated as the foundation beneath map, measure, and manage?', options: [{ text: 'Because it is the only function relevant to small practices', isCorrect: false }, { text: 'Because mapping risks, measuring performance, and managing problems all require an owner, a policy, and a line of authority to be meaningful', isCorrect: true }, { text: 'Because it eliminates the need to monitor tools after adoption', isCorrect: false }, { text: 'Because it shifts accountability to the vendor', isCorrect: false }], correctAnswer: 1, explanation: 'Governance is foundational because every other function depends on an owner, a policy, and a line of authority. Without governance, mapping is academic, measuring has no owner, and managing has no force.' },
      { question: 'Which four principles anchor the governance framework presented in this course?', options: [{ text: 'Speed, scale, novelty, and cost', isCorrect: false }, { text: 'Safety, transparency, accountability, and equity', isCorrect: true }, { text: 'Efficiency, automation, engagement, and convenience', isCorrect: false }, { text: 'Marketing, validation, support, and price', isCorrect: false }], correctAnswer: 1, explanation: 'The four anchoring principles are safety, transparency, accountability, and equity. When no rule anticipates a situation, the principles tell the practice how to decide.' },
      { question: 'In a solo practice, the governance roles of owner, tool steward, clinical reviewer, and incident handler should be:', options: [{ text: 'Ignored, because a solo practice does not need governance', isCorrect: false }, { text: 'Named even though one person fills them all, so each function is consciously performed rather than silently skipped', isCorrect: true }, { text: 'Delegated entirely to the tool vendor', isCorrect: false }, { text: 'Combined into a single undefined responsibility', isCorrect: false }], correctAnswer: 1, explanation: 'Even when one person fills every role, naming the roles ensures each function, approval, inventory, clinical review, and incident handling, is consciously performed rather than silently skipped.' },
      { question: 'A practice AI use policy should include all of the following EXCEPT:', options: [{ text: 'Scope and tiered permissions for different categories of tools', isCorrect: false }, { text: 'An explicit list of prohibited uses', isCorrect: false }, { text: 'A clause transferring all clinical liability to the vendor', isCorrect: true }, { text: 'A defined process for proposing, evaluating, and re-reviewing tools', isCorrect: false }], correctAnswer: 2, explanation: 'A policy states scope and tiers, prohibited uses, ownership, and an adoption and review process. It cannot transfer clinical liability to a vendor; accountability remains with the clinician.' },
      { question: 'For any artificial-intelligence tool that processes protected health information, a signed Business Associate Agreement is:', options: [{ text: 'Optional if the tool is free', isCorrect: false }, { text: 'A non-negotiable requirement under the Health Insurance Portability and Accountability Act, and its absence is an immediate disqualifier', isCorrect: true }, { text: 'Required only after the tool is already in use', isCorrect: false }, { text: 'Unnecessary if the clinician finalizes all notes', isCorrect: false }], correctAnswer: 1, explanation: 'A signed Business Associate Agreement is mandatory for any tool processing protected health information. A vendor\'s unwillingness to sign one is an immediate disqualification regardless of the tool\'s usefulness.' },
      { question: 'During vendor due diligence, a tool claims to improve a clinical outcome but offers only internal engagement statistics with no independent peer-reviewed evidence. The practice should:', options: [{ text: 'Adopt it, since engagement statistics prove clinical benefit', isCorrect: false }, { text: 'Treat the absence of independent evidence as a material finding and decline or defer pending stronger evidence', isCorrect: true }, { text: 'Adopt it because the demo was compelling', isCorrect: false }, { text: 'Let each clinician decide individually', isCorrect: false }], correctAnswer: 1, explanation: 'Engagement statistics are not clinical evidence. For a tool claiming a clinical benefit, absence of independent peer-reviewed evidence is a material finding, and the tool should be held to the evidence hierarchy.' },
      { question: 'Why does the course advise planning the exit from a vendor BEFORE adopting the tool?', options: [{ text: 'Because exit terms are irrelevant once a tool is in use', isCorrect: false }, { text: 'Because data portability, retention, and deletion terms are easiest to secure as conditions of entry and are the practice\'s insurance against vendor failure', isCorrect: true }, { text: 'Because vendors prefer practices that plan to leave', isCorrect: false }, { text: 'Because it allows the practice to skip a Business Associate Agreement', isCorrect: false }], correctAnswer: 1, explanation: 'Before signing, the practice has maximum leverage and no sunk-cost bias. Data portability, retention-after-termination, and certified deletion secured at entry make later deprovisioning clean and protect against vendor failure.' },
      { question: 'A red flag during vendor evaluation includes a vendor that:', options: [{ text: 'Provides independent peer-reviewed evidence and a signed Business Associate Agreement', isCorrect: false }, { text: 'Is evasive about whether it trains its models on client data and locks data in a proprietary format with no export path', isCorrect: true }, { text: 'Documents its security posture and breach-notification commitments', isCorrect: false }, { text: 'Offers clear data-portability terms', isCorrect: false }], correctAnswer: 1, explanation: 'Evasiveness about model training on client data and proprietary lock-in with no export path are reliable red flags. A vendor that resists transparency during the sales process will not become more transparent after the contract is signed.' },
      { question: 'Regarding client disclosure of artificial-intelligence use, the guiding test is:', options: [{ text: 'Whether the tool is expensive', isCorrect: false }, { text: 'Whether a reasonable client would want to know the tool is involved, with disclosure scaled to the tool\'s clinical proximity', isCorrect: true }, { text: 'Whether the clinician finds disclosure convenient', isCorrect: false }, { text: 'Whether the vendor permits disclosure', isCorrect: false }], correctAnswer: 1, explanation: 'Disclosure is required when a reasonable client would want to know a tool is involved, and it scales with clinical proximity: a general notice may suffice for administrative tools, while session-recording and decision-influencing tools warrant specific disclosure and consent.' },
      { question: 'A client\'s right to decline an artificial-intelligence tool used in their care is genuine only when:', options: [{ text: 'Declining results in the client losing access to services', isCorrect: false }, { text: 'Declining triggers an alternative workflow rather than a loss of service', isCorrect: true }, { text: 'The notice is buried in intake paperwork that cannot be refused', isCorrect: false }, { text: 'The clinician decides whether the refusal is reasonable', isCorrect: false }], correctAnswer: 1, explanation: 'Consent that cannot be refused is notice dressed as choice. A genuine right to decline means declining triggers an alternative workflow, not a loss of service.' },
      { question: 'The full-review standard for artificial-intelligence-drafted clinical notes requires that the clinician:', options: [{ text: 'Sign the note without reading it to save time', isCorrect: false }, { text: 'Read every drafted note in full against their own memory of the session and correct any error before signing', isCorrect: true }, { text: 'Rely on the tool\'s confidence that the note is accurate', isCorrect: false }, { text: 'Delegate review to the vendor', isCorrect: false }], correctAnswer: 1, explanation: 'A generative tool can insert plausible but false content, such as a denied symptom or an event that never occurred. The signed note is the clinician\'s, and the clinician owns its accuracy, so full review against memory before signing is mandatory.' },
      { question: 'A serious and common acceptable-use lapse the course warns against is:', options: [{ text: 'Reviewing artificial-intelligence outputs before relying on them', isCorrect: false }, { text: 'Pasting identifiable client information into a public, consumer-grade generative tool to polish a note', isCorrect: true }, { text: 'Reporting a near-miss involving a tool', isCorrect: false }, { text: 'Obtaining client consent before using a documentation tool', isCorrect: false }], correctAnswer: 1, explanation: 'Pasting client information into an unapproved consumer tool can send protected health information out of the practice\'s control and possibly into a vendor\'s training data. Clear acceptable-use rules and training defend against this category of error.' },
      { question: 'The purpose of an audit trail in artificial-intelligence governance is to:', options: [{ text: 'Replace the need for a written policy', isCorrect: false }, { text: 'Allow the practice to reconstruct which tool was involved, who used it, what data it touched, and whether safeguards were followed', isCorrect: true }, { text: 'Transfer accountability to the vendor', isCorrect: false }, { text: 'Eliminate the need for monitoring', isCorrect: false }], correctAnswer: 1, explanation: 'The audit trail, tool inventory plus activity logs, is the documentary backbone of accountability. It answers what tool was involved, who used it, what data it touched, and whether the policy was followed, and it grounds renew-or-retire decisions.' },
      { question: 'Why does the course recommend a phased or piloted rollout of a new tool?', options: [{ text: 'To deploy to every clinician simultaneously and gather data fastest', isCorrect: false }, { text: 'Because piloting with a small group surfaces failure modes while the stakes are contained, before practice-wide deployment', isCorrect: true }, { text: 'Because phasing eliminates the need for monitoring', isCorrect: false }, { text: 'Because vendors require it', isCorrect: false }], correctAnswer: 1, explanation: 'A phased rollout introduces a tool to a small, well-supported group first, surfacing failure modes while stakes are contained and letting the practice refine review standards before scaling. Deploying to everyone at once means discovering failures at scale and in production.' },
      { question: 'A blame-free error-reporting channel is essential because:', options: [{ text: 'It allows the practice to punish staff who report problems', isCorrect: false }, { text: 'If staff fear punishment for reporting tool failures, they will stop reporting and the practice will go blind to its tools\' failures', isCorrect: true }, { text: 'It replaces the need for incident response', isCorrect: false }, { text: 'It transfers liability to the staff member', isCorrect: false }], correctAnswer: 1, explanation: 'A blame-free posture keeps reports flowing. Near-misses, errors caught before reaching a client, are especially valuable because they reveal failure modes before harm, and fear of punishment drives such reports underground.' },
      { question: 'When a documentation tool is found to be fabricating clinical content, the safe default in incident response is to:', options: [{ text: 'Continue using it to avoid the inconvenience of reverting', isCorrect: false }, { text: 'Suspend its use pending investigation, because suspension is reversible but a harm reaching a client is not', isCorrect: true }, { text: 'Wait for the vendor to acknowledge the problem first', isCorrect: false }, { text: 'Let each clinician decide whether to keep using it', isCorrect: false }], correctAnswer: 1, explanation: 'When a tool fabricates content or performs unsafely, the safe default is suspension pending investigation. Suspension is reversible; a harm reaching a client is not, and the inconvenience of reverting is trivial by comparison.' },
      { question: 'Regarding professional liability, adopting an artificial-intelligence tool:', options: [{ text: 'Transfers the clinician\'s liability for clinical judgments to the vendor', isCorrect: false }, { text: 'Does not transfer the clinician\'s professional liability; the clinician remains accountable, and vendor indemnification is often narrow and capped', isCorrect: true }, { text: 'Eliminates the need for professional liability insurance', isCorrect: false }, { text: 'Makes the vendor responsible for protecting client data', isCorrect: false }], correctAnswer: 1, explanation: 'Adoption does not transfer professional liability. The clinician remains accountable for clinical judgments and record accuracy, vendor indemnification is typically narrow and capped, and prudent practices review their professional and cyber-liability coverage.' },
      { question: 'The single conviction that forms the throughline of this course is that artificial intelligence in behavioral health should be:', options: [{ text: 'Feared and avoided entirely', isCorrect: false }, { text: 'Governed, neither feared nor trusted uncritically, so the practice governs the technology rather than being governed by it', isCorrect: true }, { text: 'Trusted uncritically because it is advanced', isCorrect: false }, { text: 'Adopted only by large clinics with informatics staff', isCorrect: false }], correctAnswer: 1, explanation: 'The throughline is that artificial intelligence is to be governed. Governance is not opposed to innovation; it is what makes innovation safe enough to pursue, letting the practice capture benefits while protecting clients, records, and professional integrity.' },
    ],
  },

  references: [
    'National Institute of Standards and Technology. (2023). Artificial intelligence risk management framework (AI RMF 1.0) (NIST AI 100-1). U.S. Department of Commerce.',
    'World Health Organization. (2021). Ethics and governance of artificial intelligence for health: WHO guidance. World Health Organization.',
    'American Counseling Association. (2014). ACA code of ethics. American Counseling Association.',
    'American Psychological Association. (2017). Ethical principles of psychologists and code of conduct (2002, amended effective June 1, 2010, and January 1, 2017). American Psychological Association.',
    'U.S. Department of Health and Human Services, Office for Civil Rights. (2013). HIPAA administrative simplification: Regulation text (45 CFR Parts 160, 162, and 164). U.S. Department of Health and Human Services.',
    'American Medical Association. (2018). Augmented intelligence in health care (Policy H-480.940). American Medical Association.',
    'Office of the National Coordinator for Health Information Technology. (2024). Health data, technology, and interoperability: Certification program updates, algorithm transparency, and information sharing (HTI-1 final rule). U.S. Department of Health and Human Services.',
    'U.S. Food and Drug Administration. (2021). Artificial intelligence/machine learning (AI/ML)-based software as a medical device (SaMD) action plan. U.S. Food and Drug Administration.',
    'Topol, E. (2019). Deep medicine: How artificial intelligence can make healthcare human again. Basic Books.',
    'Char, D. S., Shah, N. H., & Magnus, D. (2018). Implementing machine learning in health care: Addressing ethical challenges. New England Journal of Medicine, 378(11), 981–983.',
    'Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. Science, 366(6464), 447–453.',
    'Torous, J., Bucci, S., Bell, I. H., Kessing, L. V., Faurholt-Jepsen, M., Whelan, P., Carvalho, A. F., & Firth, J. (2021). The growing field of digital psychiatry: Current evidence and the future of apps, social media, chatbots, and artificial intelligence. World Psychiatry, 20(3), 318–335.',
    'Reddy, S., Allan, S., Coghlan, S., & Cooper, P. (2020). A governance model for the application of AI in health care. Journal of the American Medical Informatics Association, 27(3), 491–497.',
    'Luxton, D. D. (2014). Artificial intelligence in psychological practice: Current and future applications and implications. Professional Psychology: Research and Practice, 45(5), 332–339.',
    'Fiske, A., Henningsen, P., & Buyx, A. (2019). Your robot therapist will see you now: Ethical implications of embodied artificial intelligence in psychiatry, psychology, and psychotherapy. Journal of Medical Internet Research, 21(5), e13216.',
    'Rajkomar, A., Dean, J., & Kohane, I. (2019). Machine learning in medicine. New England Journal of Medicine, 380(14), 1347–1358.',
  ],

  resources: [
    { title: 'NIST — AI Risk Management Framework (AI RMF 1.0)', url: 'https://www.nist.gov/itl/ai-risk-management-framework', type: 'link', description: 'The foundational framework organizing trustworthy artificial intelligence around the govern, map, measure, and manage functions.' },
    { title: 'WHO — Ethics and Governance of Artificial Intelligence for Health (2021)', url: 'https://www.who.int/publications/i/item/9789240029200', type: 'pdf', description: 'Core ethical principles for artificial intelligence in health, including human oversight, transparency, accountability, and equity.' },
    { title: 'HHS — HIPAA for Professionals', url: 'https://www.hhs.gov/hipaa/for-professionals/index.html', type: 'link', description: 'Authoritative resource on Health Insurance Portability and Accountability Act obligations, including Business Associate Agreements and breach notification.' },
    { title: 'AMA — Augmented Intelligence in Medicine Policy', url: 'https://www.ama-assn.org/practice-management/digital-health/augmented-intelligence-medicine', type: 'link', description: 'Policy framing of artificial intelligence as augmented intelligence that supports rather than replaces clinician judgment.' },
    { title: 'ACA — Code of Ethics', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf', type: 'pdf', description: 'Professional ethics code, including Section H on distance counseling, technology, and social media.' },
  ],
};

function stripHtml(h){return(h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(s){return stripHtml(s).split(/\s+/).filter(Boolean).length;}
function validate(course){
  const errors=[],warnings=[];
  let total=0;
  (course.sections||[]).forEach(s=>{(s.contentBlocks||[]).forEach(b=>{
    total+=countWords(b.content||'')+countWords(b.question||'')+countWords(b.explanation||'')+countWords(b.subtitle||'')+countWords(b.title||'')+countWords(b.instructions||'')+countWords(b.matchingInstructions||'');
    (b.accordionItems||[]).forEach(a=>{total+=countWords(a.title)+countWords(a.content);});
    (b.flashcards||[]).forEach(f=>{total+=countWords(f.front)+countWords(f.back);});
    (b.matchingPairs||[]).forEach(p=>{total+=countWords(p.term)+countWords(p.definition);});
    (b.options||[]).forEach(o=>{total+=countWords(typeof o==='object'?o.text:o);});
    (b.cards||[]).forEach(c=>{total+=countWords(c.text);});
    (b.takeaways||[]).forEach(t=>{total+=countWords(t);});
    (b.steps||[]).forEach(st=>{total+=countWords(st.text);});
    (b.blanks||[]).forEach(bl=>{total+=countWords(bl.prompt)+countWords(bl.answer);});
    if(b.nodes){const nv=Array.isArray(b.nodes)?b.nodes:Object.values(b.nodes);nv.forEach(n=>{total+=countWords(n.text||'');(n.choices||[]).forEach(ch=>total+=countWords(ch.text||''));});}
  });});
  const req=course.ceHours*6000;
  if(total<req) errors.push(`Word count ${total} < ${req}`);
  else console.log(`✅ Words: ${total.toLocaleString()}/${req.toLocaleString()}`);
  (course.sections||[]).forEach((s,i)=>{
    const b=s.contentBlocks||[];
    if(!b[0]||b[0].type!=='sectionDivider') errors.push(`Sec ${i+1} no sectionDivider first`);
    if(b[0]&&(!b[0].title||!b[0].subtitle)) errors.push(`Sec ${i+1} divider missing title/subtitle`);
    b.forEach((blk,bi)=>{if(blk.type==='multipleChoice'||blk.type==='multiSelect'){if(!Array.isArray(blk.options)||typeof blk.options[0]!=='object') errors.push(`Sec ${i+1} blk ${bi+1}: flat options`);}});
  });
  if((course.assessment?.questions||[]).length<15) errors.push(`Assessment <15 Qs`);
  if(course.assessment?.passingScore!==80) errors.push('passingScore≠80');
  if(course.maxAttempts!==3) errors.push('maxAttempts≠3');
  if((course.references||[]).length<15) errors.push(`Refs: ${(course.references||[]).length}<15`);
  else console.log(`✅ Refs: ${course.references.length}`);
  return{errors,warnings,total};
}
async function main(){
  if(!process.env.MONGODB_URI){ console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  // schema requires an explicit order on every section and content block
  COURSE.sections.forEach((s,si)=>{ if(s.order==null)s.order=si; (s.contentBlocks||[]).forEach((b,bi)=>{ if(b.order==null)b.order=bi; }); });
  let doc = await InteractiveCourse.findOne({ slug: SLUG });
  const action = doc ? 'Updated' : 'Inserted';
  if(doc){ doc.set(COURSE); } else { doc = new InteractiveCourse(COURSE); }
  await doc.save(); // fires pre-save hook -> canonical wordCount, totalContentBlocks; runs schema validation
  const floor = doc.ceHours*6000;
  const flag = doc.wordCount < floor ? '  \u26a0\ufe0f BELOW FLOOR' : '';
  console.log(`\u2705 ${action}: ${doc.courseCode} | ${doc.wordCount}w (floor ${floor}) | ${doc.totalContentBlocks} blocks | ${doc.sections.length} sec${flag}`);
  await mongoose.disconnect();
}
main().catch(e=>{ console.error('\u274c', e.message); process.exit(1); });
