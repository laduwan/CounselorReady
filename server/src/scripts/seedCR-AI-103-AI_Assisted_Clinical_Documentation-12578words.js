import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && !process.env.DRY_RUN) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'ai-assisted-clinical-documentation';

const COURSE = {
  title: 'AI-Assisted Clinical Documentation: Promise, Pitfalls, and Compliance',
  slug: SLUG, courseCode: 'CR-AI-103',
  subtitle: 'Using Ambient Scribes and Generative Note Tools Without Compromising the Record',
  description: 'A 2-hour intermediate CE course for licensed mental health professionals examining the rapid adoption of ambient AI scribes and generative note-drafting tools in behavioral health. The course addresses documentation accuracy, model hallucination, the clinician\'s non-delegable review duty, HIPAA and consent-to-record obligations, vendor due diligence, and practical workflow integration. 12,578 words.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'Technology & Ethics', ceCategory: 'Technology & Ethics', contentArea: 'Professional Identity',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Professional Identity'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with expertise in clinical documentation and technology-informed practice.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychologists) who use or are evaluating AI tools for clinical documentation.'],
  tags: ['documentation','artificial intelligence','HIPAA','clinical notes','compliance'],
  objectives: [
    'Describe at least four categories of AI documentation tools used in behavioral health and the administrative-burden problems they are designed to address.',
    'Explain how generative language models produce hallucination, omission, and commission errors, and articulate the clinician\'s non-delegable duty to review and sign the clinical record.',
    'Apply HIPAA Privacy and Security Rule requirements, business associate agreement obligations, and consent-to-record principles to the use of AI documentation vendors.',
    'Evaluate AI documentation vendors using defined criteria for data handling, audit trails, and clinical safety before adoption.',
    'Implement workflow and supervisory best practices that prevent boilerplate, copy-forward, and over-reliance errors in AI-assisted notes.',
  ],

  sections: [
    {
      title: 'The Rise of AI Documentation Tools',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '1', title: 'The Rise of AI Documentation Tools', subtitle: 'Ambient scribes, generative note drafting, and the administrative-burden problem they target', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>The Documentation Burden That Created the Market</h2>
<p>Clinical documentation has long been one of the most time-consuming and least satisfying components of behavioral health practice. For every hour of direct clinical contact, clinicians routinely spend a substantial additional fraction of time writing progress notes, treatment plans, intake summaries, and the administrative records required for billing, utilization review, and continuity of care. Surveys of clinicians across health care consistently identify documentation load as a leading driver of professional burnout, after-hours work commonly described as "pajama time," and reduced capacity to take on new clients. The behavioral health workforce shortage has sharpened this pressure: when there are not enough clinicians to meet demand, every hour a clinician spends typing is an hour not spent in session, in consultation, or in recovery from the emotional labor of the work.</p>
<p>Into this environment has arrived a wave of artificial-intelligence documentation tools promising to return time to the clinician. These tools are marketed under the banner of reducing administrative burden, and the promise is genuinely attractive: a system that listens to or reads a session, drafts a structured note, and hands the clinician a near-complete record to review rather than a blank page to fill. The promise is real, the time savings can be substantial, and the tools are improving rapidly. But the promise carries pitfalls that are specific to the clinical and legal nature of the mental health record, and those pitfalls are the reason this course exists. Understanding what these tools are, how they work, and what they can and cannot do is now a baseline professional competency rather than a niche interest.</p>
<p>It is important to frame AI documentation tools accurately from the outset. They are not autonomous note-writers that replace clinical judgment, and no responsible vendor claims they are. They are drafting assistants. The clinical record remains the clinician's record, authored under the clinician's license, subject to the clinician's professional and legal accountability. The arrival of a capable drafting assistant does not transfer that accountability to a software vendor any more than a word processor's spell-checker transfers responsibility for a misspelled medication. The tools change the workflow; they do not change who is responsible for the result.</p>
<p>The clinical record serves many masters, and any tool that touches it must respect all of them. The note is a clinical instrument that supports continuity of care, allowing the next clinician — or the same clinician weeks later — to reconstruct the trajectory of treatment. It is a communication instrument shared with other providers, supervisors, and sometimes the client. It is a legal instrument that may be examined in litigation, licensing complaints, or risk-management review, where it stands as the contemporaneous account of what occurred. It is a billing instrument that must support the level of service claimed. And it is an ethical instrument that embodies the clinician's accountability to the client and the profession. A drafting tool that produces a note that reads well but serves these functions poorly has not helped; it has created a liability dressed up as a convenience. Holding these multiple purposes in mind is what distinguishes competent use of an AI documentation tool from mere automation of a task whose stakes the user has not fully appreciated.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Four Categories of AI Documentation Tools</h2>
<p>The current landscape of AI documentation tools can be organized into four overlapping categories, and clinicians benefit from understanding the distinctions because each category carries a different risk and privacy profile. The first category is the <strong>ambient AI scribe</strong>{{callout:ambient-scribe}}. An ambient scribe listens to the live session through a microphone, transcribes the spoken conversation, and uses that transcript to generate a structured clinical note. The word "ambient" signals that the tool runs in the background of an ordinary conversation rather than requiring the clinician to dictate to it explicitly. Products in this category — illustratively, tools such as Nuance DAX, Abridge, and Suki are widely discussed in the general health care literature — capture the natural back-and-forth of the encounter and attempt to distill it into a clinically usable note. Ambient scribes are powerful precisely because they require almost nothing of the clinician during the session, but they are also the highest-privacy-risk category because they capture the complete spoken content of a confidential therapeutic conversation.</p>
<p>The second category is <strong>natural language processing (NLP) note generation</strong> from existing text or structured inputs. Here the tool does not necessarily listen to the session; instead it takes clinician-entered fragments, brief bullet points, prior notes, or structured data fields and expands them into prose. A clinician might enter a few shorthand observations and receive a fully formed narrative paragraph in return. These tools reduce typing rather than listening, and they shift the privacy profile because the input is text the clinician chose to enter rather than a full audio recording of the client.</p>
<p>The third category is <strong>automatic transcription</strong> as a stand-alone service. Transcription converts spoken audio to written text but does not, by itself, structure that text into a clinical note. Some clinicians use transcription to capture a verbatim record of a session or a dictated summary, then write the note themselves from the transcript. Transcription alone does not introduce the generative-error risks discussed later in this course because it is not generating new content — but it does introduce the same recording and PHI-capture risks as ambient scribes, and a verbatim transcript of a therapy session is itself a highly sensitive document that must be handled with care.</p>
<p>The fourth category is <strong>generative note drafting in SOAP, DAP, BIRP, or GIRP formats</strong>. This is the capability most clinicians associate with "AI documentation": the production of a complete, formatted progress note following a recognized clinical structure. SOAP (Subjective, Objective, Assessment, Plan){{callout:soap-note}} and DAP (Data, Assessment, Plan) are among the most common formats in behavioral health. A generative tool drafts each section, populating the Subjective or Data section with the client's reported concerns, the Assessment with clinical impressions, and the Plan with next steps. The appeal is obvious; the risk is that the tool may generate plausible-sounding clinical content that was never actually discussed, a problem examined in depth in Section 2.</p>`,
          callouts: { 'ambient-scribe': { label: 'Ambient AI Scribe', type: 'definition', body: 'A tool that captures the spoken session in the background, transcribes it, and generates a structured clinical note — the highest-privacy-risk category because it records the full confidential conversation, including the client\'s voice.' } },
        },
        {
          type: 'imageText', order: 4, title: 'From Conversation to Clinical Note',
          content: `<p>An ambient AI scribe moves through a predictable pipeline: it captures audio, transcribes speech to text, identifies clinically relevant content, and generates a structured draft note in the clinician\'s preferred format. Each stage introduces both a time-saving opportunity and a potential point of error. The clinician sits at the end of the pipeline, not the middle: the tool produces a draft, and the clinician reviews, corrects, and signs. Understanding the pipeline helps clinicians know where to direct their critical attention during review — the assessment and plan sections, which require the most inference, are where generated content most often diverges from what actually occurred.</p>`,
          image: '', imageAlt: 'Diagram of an ambient AI scribe pipeline from audio capture through transcription to a drafted clinical note', imagePosition: 'right',
        },
        {
          type: 'callout', order: 5, calloutType: 'tip', title: 'Drafting Assistant, Not Author of Record',
          content: '<p>The single most important framing for every tool in this course: AI documentation systems are drafting assistants, not authors of the legal record. The clinician who signs a note adopts it as their own professional statement, regardless of how much of the text was machine-generated. Treat every AI-generated draft as you would treat a note drafted by an unlicensed assistant or trainee — useful, time-saving, and absolutely requiring your independent review and sign-off before it becomes part of the record.</p>',
        },
        {
          type: 'accordion', order: 6, title: 'How Ambient Scribes Work Under the Hood',
          accordionItems: [
            { title: 'Audio capture', content: '<p>The tool records the spoken session through a device microphone — a laptop, phone, or dedicated hardware. In telehealth, audio may be captured directly from the platform. This is the moment at which protected health information in its rawest form, the client\'s own voice, enters the vendor\'s system. Consent to record and the handling of that audio are therefore foundational compliance questions, addressed in Section 3.</p>' },
            { title: 'Speech-to-text transcription', content: '<p>An automatic speech recognition (ASR) model converts the audio to a written transcript. ASR accuracy varies with audio quality, accents, overlapping speech, clinical terminology, and background noise. Transcription errors at this stage propagate downstream: a misheard medication name or a misattributed statement can be carried into the generated note. The clinician rarely sees the raw transcript, which is one reason review of the final note matters so much.</p>' },
            { title: 'Content extraction and summarization', content: '<p>A language model identifies clinically relevant content from the transcript and maps it to note sections. This is where the system decides what counts as the presenting concern, what belongs in the assessment, and what the plan should be. It is also where the model exercises inference — filling gaps, smoothing language, and sometimes generating content that was implied but not stated, or that was neither implied nor stated.</p>' },
            { title: 'Draft generation and formatting', content: '<p>The model produces a structured draft in the clinician\'s chosen format (SOAP, DAP, BIRP, GIRP, or a custom template). The output reads like a competent clinical note, which is precisely the source of risk: fluency is not accuracy. A confidently written, well-formatted note can contain fabricated detail that the clinician must catch on review.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'Which category of AI documentation tool listens to the live session in the background and generates a structured note from the spoken conversation?',
          options: [
            { text: 'Stand-alone automatic transcription', isCorrect: false },
            { text: 'The ambient AI scribe', isCorrect: true },
            { text: 'NLP expansion of clinician-entered text fragments', isCorrect: false },
            { text: 'A manual electronic health record template', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The ambient AI scribe runs in the background of an ordinary conversation, transcribes the spoken session, and generates a structured note. It is distinguished from stand-alone transcription (which produces text but not a structured note) and from NLP expansion (which works from clinician-entered text rather than captured audio).',
        },
        {
          type: 'multiSelect', order: 8,
          question: 'Which of the following are categories of AI documentation tools described in this section? (Select all that apply)',
          options: [
            { text: 'Ambient AI scribes that capture and structure live session audio', isCorrect: true },
            { text: 'NLP note generation from clinician-entered fragments or structured inputs', isCorrect: true },
            { text: 'Automatic transcription as a stand-alone service', isCorrect: true },
            { text: 'Autonomous systems that sign and file the legal record without clinician involvement', isCorrect: false },
            { text: 'Generative drafting in SOAP, DAP, BIRP, or GIRP formats', isCorrect: true },
          ],
          explanation: 'Four categories were described: ambient scribes, NLP note generation, stand-alone transcription, and generative SOAP/DAP/BIRP/GIRP drafting. No responsible tool autonomously signs and files the legal record — the clinician\'s review and signature remain non-delegable.',
        },
        {
          type: 'fillInBlank', order: 9, title: 'Note Formats and Pipeline Terms',
          blanks: [
            { prompt: 'The note format whose sections are Subjective, Objective, Assessment, and Plan is abbreviated as:', answer: 'SOAP', acceptAlternates: ['soap'] },
            { prompt: 'The note format whose sections are Data, Assessment, and Plan is abbreviated as:', answer: 'DAP', acceptAlternates: ['dap'] },
            { prompt: 'A documentation tool that runs in the background of an ordinary conversation, rather than requiring explicit dictation, is described as an _____ scribe.', answer: 'ambient', acceptAlternates: ['ambient AI'] },
          ],
        },
        {
          type: 'flashcardDeck', order: 10,
          instructions: 'Review the foundational vocabulary of AI documentation tools.',
          flashcards: [
            { id: 'f1', front: 'Ambient AI scribe', back: 'A tool that captures the spoken session in the background, transcribes it, and generates a structured clinical note. Highest privacy-risk category because it records the full confidential conversation, including the client\'s voice.' },
            { id: 'f2', front: 'Automatic speech recognition (ASR)', back: 'The speech-to-text component that converts audio into a written transcript. Accuracy varies with audio quality, accents, overlapping speech, and clinical terminology; transcription errors propagate into the generated note.' },
            { id: 'f3', front: 'Generative note drafting', back: 'Production of a complete, formatted note (SOAP, DAP, BIRP, GIRP) by a language model. Reads fluently, which is both its appeal and its risk: fluency is not accuracy, and plausible content may be fabricated.' },
            { id: 'f4', front: 'Administrative-burden problem', back: 'The documentation load — progress notes, treatment plans, intake summaries, billing records — that consumes clinician time, drives burnout and after-hours work, and reduces clinical capacity. The problem these tools are designed to address.' },
            { id: 'f5', front: 'Drafting assistant framing', back: 'The principle that AI documentation tools assist drafting but never author the legal record. The clinician who signs adopts the note as their own professional statement and retains full accountability.' },
          ],
        },
        {
          type: 'videoEmbed', order: 11, videoTitle: 'How Ambient AI Scribes Work in Clinical Settings',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aiscribe',
          description: 'An overview of the ambient scribe pipeline — audio capture, transcription, content extraction, and draft generation — and how clinicians fit into the review loop.',
        },
        {
          type: 'text', order: 12,
          content: `<h2>Why This Competency Matters Now</h2>
<p>The adoption curve for AI documentation tools in behavioral health has been steep, and it is accelerating. Large health systems have moved from pilots to enterprise rollouts, and the technology has rapidly diffused into group practices, community mental health agencies, and solo private practices through affordable subscription products. A clinician who has not yet encountered these tools in their own setting is increasingly likely to encounter them at their next employer, in a supervisee's workflow, or in a colleague's recommendation. The question for most clinicians is no longer whether AI documentation will touch their practice but whether they will engage with it deliberately and competently or absorb it passively and uncritically. This course exists to make the engagement deliberate.</p>
<p>Several forces are driving the adoption. The first is the documented severity of the documentation burden and its contribution to a workforce crisis: behavioral health already faces a shortage of clinicians, and anything that returns clinical hours to direct care has obvious appeal to administrators and clinicians alike. The second is the rapid maturation of the underlying language models, which have crossed a threshold of fluency and structure that makes their drafts genuinely usable rather than merely interesting. The third is the competitive pressure within the electronic health record and practice-management software markets, where AI documentation has become a headline feature that vendors are racing to offer. The convergence of clinical demand, technical capability, and commercial momentum has produced an environment in which these tools are becoming a default rather than an exception.</p>
<p>This momentum is precisely why the competency emphasized in this course — disciplined, compliant, accountable use — is so important. When a technology is being adopted under burnout-driven pressure, with impressive demonstrations and strong commercial incentives, the conditions are ripe for clinicians to over-trust it, to skip the diligence, and to relax the review duty in the name of efficiency. The very factors that make these tools attractive are the factors that make careful use difficult. A clinician who understands the categories of tools, the mechanics of hallucination, the privacy and consent framework, and the workflow safeguards is equipped to capture the genuine benefit while avoiding the predictable harms. That equipped, deliberate stance — neither reflexively resistant nor uncritically enthusiastic — is the professional posture this course aims to cultivate, and it is the posture that protects clients, records, and licenses as AI documentation becomes ordinary.</p>
<p>It is also worth situating this competency within the broader trajectory of the profession. Counselors and other behavioral health clinicians have repeatedly absorbed new technologies into practice — the telephone, the electronic health record, telehealth video platforms — and each absorption has required developing new ethical and procedural competencies rather than simply learning to operate a device. The professional codes that govern practice have generally responded by extending existing principles, confidentiality, informed consent, competence, and record integrity, into the new context rather than by inventing wholly new rules. AI documentation fits this pattern. The duties it implicates are not novel; they are the long-standing duties of accurate documentation, protected confidentiality, and informed consent, encountered in a new technological setting that makes them easier to neglect. Approaching the technology this way, as a new context for enduring obligations rather than as a frontier without rules, gives clinicians a stable footing. It means that a clinician who already understands their documentation and confidentiality duties is not starting from zero; they are learning how those familiar duties apply when a generative model drafts the note and an ambient microphone captures the session. That continuity is reassuring, and it is also a reminder that the responsibility remains squarely with the clinician, exactly where it has always been.</p>`,
        },
        { type: 'reflection', order: 13, question: 'Estimate how many hours per week you currently spend on clinical documentation outside of direct session time. If a tool could reduce that time, what specifically would you want to do with the reclaimed hours, and what would you be unwilling to trade for that time savings?' },
        {
          type: 'keyTakeaway', order: 14, title: 'Key Takeaways',
          takeaways: [
            'AI documentation tools fall into four overlapping categories: ambient scribes, NLP note generation, stand-alone transcription, and generative SOAP/DAP/BIRP/GIRP drafting.',
            'These tools target the documentation burden that drives clinician burnout and after-hours work, and the time savings can be real and substantial.',
            'Every tool is a drafting assistant, not an author of the legal record; the clinician who signs adopts the note as their own professional statement.',
            'The ambient scribe is the most powerful and the highest-privacy-risk category because it captures the full confidential conversation, including the client\'s voice.',
          ],
        },
      ],
    },
    {
      title: 'Accuracy, Hallucination, and the Clinician Review Duty',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '2', title: 'Accuracy, Hallucination, and the Clinician Review Duty', subtitle: 'How generative models err, and the non-delegable duty to review and sign the record', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Why Generative Models Hallucinate</h2>
<p>The defining clinical risk of generative AI documentation is the phenomenon commonly called <strong>hallucination</strong>{{callout:hallucination}}: the production of content that is fluent, confident, and plausible but factually wrong or wholly invented. To understand why hallucination happens, it helps to understand what a generative language model is actually doing. These models are trained to predict the most probable continuation of text given everything that came before. They do not possess a database of verified facts that they consult; they generate language statistically, producing what is most likely to come next given the patterns learned from their training data. This makes them remarkably good at producing text that reads like competent clinical writing — and equally capable of producing competent-sounding clinical writing that describes events that never occurred.</p>
<p>In a documentation context, hallucination has a specific and dangerous character. The model is summarizing a real session, so most of its output is grounded in real content. But where the transcript is ambiguous, where the audio was unclear, or where the clinical convention calls for content the session did not explicitly provide, the model may "fill in" with plausible material. It may attribute a statement to the client that the client did not make. It may generate a risk-assessment sentence — "Client denied suicidal ideation" — when the topic was never raised in the session at all. It may invent a mental-status-exam detail, a quoted affect, or a symptom that fits the diagnostic picture but was never observed. Because the surrounding note is accurate and well-written, the fabricated element is camouflaged; it does not announce itself.</p>
<p>This is why hallucination in clinical documentation is more dangerous than ordinary transcription error. A garbled word is obviously wrong and invites correction. A fluent, clinically appropriate sentence that happens to be false reads exactly like the rest of the note. The clinician reviewing quickly, trusting the tool because it has been accurate before, is precisely the clinician most likely to sign off on a fabricated risk assessment or an invented symptom. The very competence of the tool erodes the vigilance that the tool requires.</p>
<p>It is worth dispelling a common misconception: that hallucination is a temporary defect that newer, better models will eliminate. Models do improve, and the frequency of obvious fabrication has fallen as the technology has matured. But hallucination is not a bug that will be fully patched; it is a consequence of how generative models work. A system that produces language by predicting probable continuations will always be capable of producing a probable-sounding statement that is false, because probability and truth are different properties. A more capable model may hallucinate less often and more subtly — which, paradoxically, can make its rare errors harder to catch, because they are embedded in output that is otherwise more trustworthy. The maturation of the technology therefore does not retire the clinician's review duty; if anything, it raises the premium on disciplined review, because the clinician can no longer rely on errors being clumsy enough to notice in passing. Treating any model, however advanced, as a source that must be verified rather than trusted is the durable stance, and it does not become obsolete as the tools improve.</p>`,
          callouts: { 'hallucination': { label: 'Hallucination', type: 'warning', body: 'The production of content that is fluent, confident, and plausible but factually wrong or wholly invented — the defining clinical risk of generative AI documentation.' } },
        },
        {
          type: 'text', order: 3,
          content: `<h2>Omission and Commission Errors</h2>
<p>It is useful to distinguish two families of documentation error introduced by AI tools. <strong>Commission errors</strong> are errors of inclusion: the note states something that is false, fabricated, or unsupported by the session. Hallucinations are commission errors. So is the misattribution of a statement, the insertion of a symptom that was not present, or the generation of a plan element that was never discussed. Commission errors create a record that affirmatively misrepresents the encounter, and they carry the greatest medico-legal danger because the resulting note can later be read as a false statement made under the clinician\'s signature.</p>
<p><strong>Omission errors</strong> are errors of exclusion: the note leaves out something clinically significant that did occur. The model summarizes and condenses, and in condensing it may drop a fleeting but important disclosure, a risk indicator mentioned in passing, a medication change, or a collateral concern. Omission errors are easy to underestimate because the note still reads as complete and coherent — nothing in the note signals that something is missing. A note that omits a client\'s passing mention of a new firearm in the home, or a brief reference to increased drinking, is dangerous precisely because the omission is invisible on review unless the clinician independently recalls the full session.</p>
<p>Both error types underscore the same conclusion: the clinician cannot review an AI-generated note the way they would proofread their own writing. Proofreading checks whether the text says what the writer intended. Reviewing an AI draft requires checking the text against the writer\'s independent memory of what actually happened — confirming that every clinically significant element of the encounter is present (no omission) and that nothing in the note describes something that did not occur (no commission). This is a fundamentally different and more demanding cognitive task, and it must be performed while the session is still fresh in memory.</p>
<p>A useful way to internalize the distinction is to imagine two different reviewers reading the same AI draft. The first reviewer reads only the note and asks, "Does this make sense and read like a competent clinical record?" Almost any AI draft will pass this test, because producing fluent, internally coherent clinical prose is exactly what these tools do well. The second reviewer reads the note while holding the actual session in mind and asks two harder questions: "Is everything stated here true of what occurred?" and "Is everything that mattered from the session represented here?" Only the second reviewer can catch commission and omission errors, because only the second reviewer is comparing the text to reality rather than to a standard of internal plausibility. The clinical-review duty requires the clinician to be the second reviewer every time, and the discipline this demands should not be underestimated: the first kind of reading is faster, easier, and seductively sufficient-feeling, and under time pressure the mind drifts toward it. Naming the difference explicitly — internal coherence versus correspondence to reality — gives the clinician a concrete checkpoint to ask whether they are actually reviewing or merely reading.</p>`,
        },
        {
          type: 'callout', order: 4, calloutType: 'warning', title: 'Fluency Is Not Accuracy',
          content: '<p>The cognitive trap at the center of AI documentation is automation bias: the tendency to over-trust a system that has performed well in the past. A generative note that reads smoothly and uses correct clinical vocabulary triggers a sense that it is reliable. It is not. A fabricated risk statement — "Client contracted for safety and denied current ideation" — in a session where suicide was never discussed is both clinically false and legally perilous. Never let the polish of an AI draft substitute for verification against your own memory of the encounter.</p>',
        },
        {
          type: 'text', order: 5,
          content: `<h2>The Non-Delegable Duty to Review and Sign</h2>
<p>Across the licensing frameworks that govern mental health practice, the clinician who signs a clinical note is professionally and legally responsible for its content. This responsibility is non-delegable{{callout:non-delegable-duty}}: it cannot be transferred to a software vendor, a transcription service, or an algorithm. The American Health Information Management Association (AHIMA) has long held documentation integrity as a core professional value, and the principle predates AI by decades — a note dictated to a human scribe was always the clinician\'s responsibility to review and authenticate. AI changes the speed and the source of the draft; it does not change the locus of accountability. The American Psychological Association\'s record-keeping guidelines similarly emphasize that the psychologist is responsible for the accuracy and adequacy of the record, whatever tools assist its creation.</p>
<p>What does the review duty require in practice? At minimum, the clinician must read the entire AI-generated note before signing — not skim it, not spot-check it, but read it against an independent recollection of the session. The clinician must correct commission errors by removing or revising any content that misrepresents the encounter, and must correct omission errors by adding any clinically significant element the tool dropped. Risk-related content deserves heightened scrutiny: statements about suicidal or homicidal ideation, safety planning, abuse, and substance use must be verified word by word, because these are both the highest-stakes clinical elements and the elements where hallucination is most consequential. Only after this review may the clinician authenticate the note with their signature, at which point it becomes their statement.</p>
<p>It is worth stating plainly what is not permitted. It is not permissible to enable an AI scribe, glance at the output, and sign it because it looks right. It is not permissible to rely on the vendor\'s accuracy claims as a substitute for review. It is not permissible to sign notes in batches at the end of a day or week without verifying each against memory — a practice that AI tools can inadvertently encourage by making notes appear "done." The efficiency the tool provides is real, but it is efficiency in drafting, not in accountability. The review step is the irreducible core of the clinician\'s documentation duty, and it is the step the tool cannot perform.</p>`,
          callouts: { 'non-delegable-duty': { label: 'Non-Delegable Duty', type: 'ethics', body: 'The clinician\'s responsibility to review and sign every AI-generated note before it becomes part of the record; it cannot be transferred to a software vendor, a transcription service, or an algorithm.' } },
        },
        {
          type: 'matching', order: 6,
          matchingInstructions: 'Match each documentation-error concept to its correct description.',
          matchingPairs: [
            { term: 'Commission error', definition: 'The note states something false, fabricated, or unsupported by the session, such as an invented risk statement or a misattributed quote.' },
            { term: 'Omission error', definition: 'The note leaves out a clinically significant element that did occur, such as a passing disclosure of increased drinking or a new safety concern.' },
            { term: 'Hallucination', definition: 'Fluent, confident, plausible content generated by the model that is factually wrong or wholly invented; a form of commission error.' },
            { term: 'Automation bias', definition: 'The tendency to over-trust a system that has performed well before, causing the clinician to relax the vigilance the tool actually requires.' },
          ],
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'A generative tool inserts the sentence "Client denied suicidal ideation" into a note, but suicide was never discussed in the session. This is best classified as:',
          options: [
            { text: 'An omission error, because risk content should have been discussed', isCorrect: false },
            { text: 'A commission error / hallucination, because the note affirmatively states something that did not occur', isCorrect: true },
            { text: 'An acceptable clinical default that requires no correction', isCorrect: false },
            { text: 'A transcription error in the speech-to-text stage', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Stating that the client denied ideation when the topic was never raised is a commission error — the note affirmatively describes an event that did not occur. It is a hallucination and must be removed on review. Because it concerns risk, it is among the most consequential possible errors.',
        },
        {
          type: 'multiSelect', order: 8,
          question: 'The clinician\'s review duty for an AI-generated note requires which of the following? (Select all that apply)',
          options: [
            { text: 'Reading the entire note against an independent recollection of the session', isCorrect: true },
            { text: 'Correcting commission errors by removing or revising misrepresentations', isCorrect: true },
            { text: 'Adding back any clinically significant content the tool omitted', isCorrect: true },
            { text: 'Relying on the vendor\'s accuracy claims in place of personal review', isCorrect: false },
            { text: 'Applying heightened, word-by-word scrutiny to risk-related content', isCorrect: true },
          ],
          explanation: 'The review duty requires reading the full note against memory, correcting both commission and omission errors, and scrutinizing risk content word by word. Relying on vendor accuracy claims is not a substitute for review; the duty is non-delegable.',
        },
        {
          type: 'scenarioTree', order: 9, scenarioTitle: 'The End-of-Day Note Stack',
          instructions: 'You have eight AI-generated notes waiting at the end of a long day. Work through how you handle them.',
          startNode: 'start',
          nodes: {
            start: { text: 'The scribe drafted all eight notes and they look clean. You are tired and want to go home. What do you do?', choices: [ { text: 'Sign all eight quickly since the tool has been accurate lately.', nextId: 'batch' }, { text: 'Read each note against your memory of that session before signing, even if it takes longer.', nextId: 'review' } ] },
            batch: { text: 'Two days later a utilization reviewer flags a note that states a client "contracted for safety" — but that client never discussed safety, and you now cannot recall whether ideation was raised. The fabricated line is under your signature. This is the automation-bias trap.', choices: [ { text: 'Recognize that batch-signing defeated the review duty and return to per-note review.', nextId: 'review' } ] },
            review: { text: 'You read each note while the sessions are still fresh, catch one hallucinated risk statement and one omitted medication change, correct both, and sign. The notes now accurately represent the encounters and your signature is defensible.', isEnd: true },
          },
        },
        {
          type: 'imageText', order: 10, title: 'Two Families of Error',
          content: `<p>Commission errors add false content; omission errors drop true content. Both are invisible in a fluent note. The review task is not proofreading — it is reconciliation against memory. A practical habit is to scan first for the highest-stakes content (risk, safety, medication, abuse, substance use), verify those word by word, then read the remainder for both fabrication and omission. Reviewing while the session is fresh, rather than at the end of the day, is the single most protective workflow choice a clinician can make.</p>`,
          image: '', imageAlt: 'Side-by-side comparison of commission errors adding false content and omission errors dropping true content in a clinical note', imagePosition: 'left',
        },
        {
          type: 'text', order: 11,
          content: `<h2>The Cognitive Conditions That Defeat Review</h2>
<p>Understanding that hallucination exists is necessary but not sufficient; clinicians also need to understand the cognitive conditions under which their own review reliably fails, because those conditions are common and predictable. The first is <strong>time pressure</strong>. A clinician moving between back-to-back sessions, or facing a stack of notes at the end of a long day, is operating under exactly the conditions that degrade careful review. The tool produces a draft that looks finished, and a tired clinician reads "finished" as "correct." The polish of the draft becomes a substitute for verification, and the review collapses into a glance. The countermeasure is structural rather than motivational: build review into the workflow at the point where memory is freshest, ideally immediately after the session, rather than deferring it to a fatigued batch at day's end.</p>
<p>The second condition is <strong>trust calibration drift</strong>. When a tool performs well for days or weeks, the clinician's trust in it rises, and rising trust lowers vigilance precisely as the stakes of a missed error remain constant. This is the mechanism of automation bias: reliability breeds complacency, and complacency is most dangerous in exactly the rare case the tool gets wrong. A clinician cannot rely on remaining suspicious through willpower alone; the suspicion must be operationalized into a fixed habit — for example, a non-negotiable rule that risk-related statements are always verified word by word regardless of how trustworthy the tool has seemed lately. Habits survive the erosion of vigilance that good performance produces; intentions do not.</p>
<p>The third condition is <strong>memory decay and confabulation</strong>. The clinician's own memory of a session is itself imperfect and fades with time, and a confidently written AI draft can actively reshape that memory — reading a fluent account of the session can make the clinician "remember" details the draft supplied rather than details that occurred. This is why reviewing against memory is most reliable when done promptly and why some clinicians keep brief contemporaneous notes during or immediately after a session as an independent anchor against which to check the AI draft. The combination of a fresh review window, a fixed habit of scrutinizing high-stakes content, and an independent memory anchor is the practical antidote to the cognitive conditions that otherwise defeat the review duty and let fabricated or omitted content reach the signed record.</p>`,
        },
        { type: 'reflection', order: 12, question: 'Recall a time you reviewed documentation — your own or a trainee\'s — and caught an error that would have been clinically or legally significant if it had stood. What allowed you to catch it? How would you build that same vigilance into a workflow where an AI tool drafts the first version?' },
        {
          type: 'keyTakeaway', order: 13, title: 'Key Takeaways',
          takeaways: [
            'Generative models predict probable text, not verified facts, so they can produce fluent, confident content that is false — hallucination.',
            'Commission errors add false content; omission errors drop true content; both are invisible in a smoothly written note.',
            'Reviewing an AI draft is reconciliation against the clinician\'s memory of the session, not proofreading of intended text.',
            'The duty to review and sign is non-delegable; risk-related content (ideation, safety, abuse, substance use) demands word-by-word verification.',
          ],
        },
      ],
    },
    {
      title: 'Privacy, HIPAA, and Consent to Record',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '3', title: 'Privacy, HIPAA, and Consent to Record', subtitle: 'PHI capture, business associate agreements, vendor data handling, and client consent', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>AI Tools, PHI, and the HIPAA Framework</h2>
<p>When an AI documentation tool captures a therapy session, it captures protected health information (PHI){{callout:phi}} in some of its most sensitive forms: the client\'s identity, their presenting concerns, their disclosures, and frequently their own recorded voice. The Health Insurance Portability and Accountability Act (HIPAA){{callout:hipaa}}, through its Privacy Rule and Security Rule administered by the U.S. Department of Health and Human Services (HHS) Office for Civil Rights, governs how covered entities and their vendors may use and protect this information. The Privacy Rule restricts the uses and disclosures of PHI; the Security Rule sets administrative, physical, and technical safeguards for electronic PHI. An AI documentation vendor that receives session audio, transcripts, or generated notes is handling electronic PHI and therefore falls squarely within this framework.</p>
<p>The threshold compliance question for any AI documentation tool is whether the vendor is a <strong>business associate</strong>. Under HIPAA, a business associate is a person or entity that creates, receives, maintains, or transmits PHI on behalf of a covered entity to perform a function or service. An AI scribe that processes session audio and returns generated notes is doing exactly that. Before a clinician or practice sends any PHI to such a vendor, the practice must have a signed <strong>business associate agreement (BAA)</strong>{{callout:baa}} in place. The BAA is not a formality; it is the contractual instrument that obligates the vendor to safeguard PHI, restricts the vendor\'s permitted uses, requires breach notification, and extends HIPAA accountability to the vendor. Using an AI documentation tool that will not sign a BAA is, for a covered clinician, generally a HIPAA violation in itself.</p>
<p>It is a common and serious mistake to assume that a consumer AI product — a general-purpose chatbot or transcription app marketed to the public — is acceptable for clinical documentation simply because it is capable of the task. Consumer tools typically do not sign BAAs, often reserve the right to use submitted data to train their models, and may store data in ways incompatible with HIPAA. Pasting a client\'s session content into a general consumer AI tool to "clean up" a note is a disclosure of PHI to a vendor with no BAA and no enforceable safeguards. The capability of a tool says nothing about its compliance posture; those are independent questions, and the compliance question must be answered first.</p>
<p>The temptation to use convenient consumer tools is real and deserves an honest acknowledgment rather than mere prohibition. A clinician drowning in documentation who discovers that a free, widely available chatbot can transform a few bullet points into a polished note has found something genuinely useful, and the impulse to use it is understandable. The problem is not that the clinician is careless but that the convenience obscures a serious compliance failure. The remedy is to channel that legitimate need toward compliant tools: there are vendors that offer the same convenience under a proper BAA with appropriate safeguards, and the practice\'s task is to adopt one of those rather than to improvise with consumer products. Framing the rule positively — use a compliant tool that meets the need, rather than simply forbidding the convenient one — is more likely to produce durable compliance than prohibition alone, because it respects the underlying need that drove the clinician toward the noncompliant tool in the first place.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Vendor Data Handling: The Questions That Matter</h2>
<p>Not all HIPAA-compliant vendors are equal, and the BAA is a floor rather than a ceiling. Clinicians and practices evaluating an AI documentation vendor should examine several specific data-handling practices. The first is <strong>data retention</strong>: how long does the vendor keep session audio, transcripts, and generated notes, and can the practice configure or limit retention? A vendor that immediately discards audio after generating the draft presents a smaller breach surface than one that retains recordings indefinitely. The second is <strong>training use</strong>: does the vendor use client data to train or improve its models, and if so, under what terms? Many clinically oriented vendors contractually commit not to train on customer PHI; this commitment should be verified in writing, not assumed.</p>
<p>The third practice is <strong>encryption</strong>, both in transit and at rest, which the Security Rule effectively requires for electronic PHI. The fourth is <strong>access controls and audit logging</strong> on the vendor side: who within the vendor can access PHI, and is that access logged? The fifth is <strong>sub-processor disclosure</strong>: does the vendor route data through other companies (for example, a third-party speech-recognition or large-language-model provider), and are those sub-processors themselves bound by appropriate agreements? A vendor that relies on a general-purpose model API must ensure that PHI sent to that API is covered by an appropriate BAA or equivalent, or that it is de-identified before transmission. The sixth is <strong>breach notification</strong>: the BAA must require timely notification, and the practice should understand the vendor\'s incident-response commitments.</p>
<p>The Office of the National Coordinator for Health Information Technology (ONC) and HHS provide guidance and resources that frame these expectations, and AHIMA offers documentation-integrity and information-governance standards that translate the legal requirements into operational practice. None of these questions can be answered by a marketing page; they require reviewing the BAA, the data-processing terms, and the vendor\'s security documentation. For a solo practitioner this due diligence can feel daunting, but it is non-negotiable: the practice, not the vendor, bears the regulatory consequence of an inadequate arrangement.</p>
<p>Solo and small-practice clinicians who lack a compliance department are not without recourse. Several practical strategies make the diligence manageable. Professional associations and practice-management consultants increasingly publish vendor-evaluation checklists tailored to behavioral health that translate the legal requirements into plain-language questions. Reputable, clinically oriented vendors will provide their BAA, a security overview, and answers to a standard set of data-handling questions on request, and a vendor's willingness to do so quickly and clearly is itself a useful signal of trustworthiness. A vendor that is evasive about retention, training use, or sub-processors has effectively answered the question. Clinicians can also consult colleagues and peer networks about their experiences, and can ask the vendor for references from similar practices. The point is that diligence does not require legal expertise so much as a willingness to ask specific questions and to treat unsatisfactory answers as disqualifying. The cost of asking these questions is a few hours; the cost of skipping them can be a reportable breach of the most sensitive client information a clinician holds. Framed that way, the diligence is plainly worth it, and it becomes a routine part of adopting any tool rather than an exceptional burden.</p>`,
        },
        {
          type: 'callout', order: 4, calloutType: 'protocol', title: 'No BAA, No PHI',
          content: '<p>Make this a bright-line rule in your practice: no protected health information goes to any AI tool that has not signed a business associate agreement. This single rule eliminates the most common and most serious AI documentation compliance failure — sending session content to consumer AI products that do not sign BAAs and may train on the data. Capability is not compliance. Verify the BAA before the first session is ever recorded or pasted.</p>',
        },
        {
          type: 'text', order: 5,
          content: `<h2>Consent to Record and State Recording Laws</h2>
<p>An ambient scribe records the session, and recording a confidential therapeutic conversation raises both ethical and legal consent obligations that are distinct from the HIPAA questions above. Ethically, clients have a right to know how their information is being captured and used. Informed consent for AI-assisted documentation should be obtained before recording begins and should be explained in plain language: that a tool will record or transcribe the session to assist in writing notes, what the tool does with the recording, how long data is retained, that the clinician reviews and is responsible for the final note, and that the client may decline. Consent that is buried in a dense intake packet and never discussed does not meet the spirit of informed consent for a practice as sensitive as recording therapy.</p>
<p>Legally, recording obligations are governed substantially by state law, and the relevant distinction is between <strong>one-party-consent and two-party (all-party)-consent</strong> jurisdictions. In one-party-consent states, recording a conversation is lawful if at least one party (which can be the clinician) consents. In two-party-consent states, all parties to the conversation must consent to the recording. Because an ambient scribe is unambiguously recording the session, a clinician practicing in an all-party-consent state must obtain and document the client\'s consent to record before activating the tool{{alert:document}}; doing otherwise can violate state wiretapping or eavesdropping law independent of any HIPAA consideration. Clinicians who practice across state lines via telehealth must consider the law of the relevant jurisdiction, which can be the client\'s location.</p>
<p>The prudent and ethically sound default, regardless of whether one practices in a one-party or two-party state, is to obtain explicit, documented client consent to record before using any ambient scribe. This default satisfies the strictest applicable standard, honors the client\'s autonomy over their own recorded voice, and protects the therapeutic alliance by treating the client as a partner in the decision rather than a subject of surveillance. The client\'s right to decline must be real: a client who is uncomfortable being recorded should be able to opt out without penalty, and the clinician should have a fallback documentation workflow ready for that situation.</p>
<p>The consent conversation also offers a clinical opportunity rather than being only a compliance hurdle. How a clinician introduces the topic of recording communicates something about the therapeutic relationship: a transparent, unhurried explanation that invites questions and genuinely welcomes a "no" models the respect for autonomy that good therapy embodies. Conversely, a perfunctory or pressured consent — "we record all sessions, just sign here" — can subtly undermine trust, particularly for clients whose histories include experiences of surveillance, coercion, or having their words used against them. For some populations, including survivors of trauma, clients involved with legal or child-welfare systems, and clients from communities with well-founded reasons to distrust institutions, the presence of a recording device is not a neutral technicality but a potentially activating intrusion. The clinician should be prepared to discuss not only the mechanics of consent but the client\'s feelings about being recorded, and to treat a client\'s hesitation as meaningful clinical information rather than an obstacle to efficient documentation. Handled well, the consent conversation can strengthen the alliance; handled carelessly, it can damage it. This is one more reason consent to record belongs to the clinician\'s clinical judgment and cannot be reduced to a form.</p>`,
        },
        {
          type: 'cardSort', order: 6,
          instructions: 'Sort each practice as HIPAA-Compliant or Non-Compliant when using AI documentation tools.',
          categories: ['Compliant', 'Non-Compliant'],
          cards: [
            { id: 'c1', text: 'Using an AI scribe only after a signed business associate agreement is in place', correctCategory: 'Compliant' },
            { id: 'c2', text: 'Pasting session content into a consumer chatbot that does not sign a BAA', correctCategory: 'Non-Compliant' },
            { id: 'c3', text: 'Confirming in writing that the vendor does not train its models on client PHI', correctCategory: 'Compliant' },
            { id: 'c4', text: 'Recording sessions with an ambient scribe without any client consent', correctCategory: 'Non-Compliant' },
            { id: 'c5', text: 'Obtaining and documenting explicit client consent to record before activating the tool', correctCategory: 'Compliant' },
            { id: 'c6', text: 'Assuming a tool is compliant because it is capable and widely advertised', correctCategory: 'Non-Compliant' },
          ],
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'Before sending any PHI to an AI documentation vendor, a covered clinician must first ensure that:',
          options: [
            { text: 'The vendor has the most advanced model available on the market', isCorrect: false },
            { text: 'A signed business associate agreement (BAA) is in place with the vendor', isCorrect: true },
            { text: 'The client has paid for the premium documentation tier', isCorrect: false },
            { text: 'The vendor is headquartered in the same state as the practice', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'A vendor that creates, receives, maintains, or transmits PHI on the clinician\'s behalf is a business associate. A signed BAA must be in place before any PHI is sent. Using a tool that will not sign a BAA is generally a HIPAA violation in itself.',
        },
        {
          type: 'fillInBlank', order: 8, title: 'HIPAA and Consent Terms',
          blanks: [
            { prompt: 'The HIPAA rule that sets administrative, physical, and technical safeguards for electronic PHI is the _____ Rule.', answer: 'Security', acceptAlternates: ['security'] },
            { prompt: 'The contract that must be signed before a vendor handles PHI on the clinician\'s behalf is the business _____ agreement.', answer: 'associate', acceptAlternates: ['associate (BAA)'] },
            { prompt: 'In a two-party or all-_____ consent state, every party to a recorded conversation must consent to the recording.', answer: 'party', acceptAlternates: ['party consent', 'parties'] },
          ],
        },
        {
          type: 'text', order: 9,
          content: `<h2>De-identification, Minimum Necessary, and Breach Exposure</h2>
<p>Beyond the BAA and consent obligations, several additional privacy principles shape responsible use of AI documentation tools. The HIPAA <strong>minimum necessary</strong> standard directs that uses and disclosures of PHI be limited to the least amount of information needed to accomplish the purpose. Applied to AI documentation, this principle invites clinicians to ask whether a tool needs to capture and retain the full session audio indefinitely to draft a note, or whether a configuration that limits capture, discards audio promptly, or processes only what is necessary would serve the same purpose with a smaller privacy footprint. A tool that hoards data it does not need is creating unnecessary risk, and the minimum-necessary principle gives clinicians a concrete lens for pushing back on excessive data collection.</p>
<p>The related concept of <strong>de-identification</strong> matters when an AI documentation vendor relies on third-party model providers. Some architectures send identifiable session content to a general-purpose model API; others de-identify or tokenize content before it leaves the vendor's controlled environment, reducing the exposure if that downstream provider is breached. Clinicians evaluating a vendor should understand whether and how de-identification is used, because a chain of sub-processors handling identifiable PHI multiplies the points at which a breach can occur. A vendor that cannot clearly explain its data flow and de-identification practices has not earned the trust required to handle therapy-session content.</p>
<p><strong>Breach exposure</strong> is the practical reason all of this matters. A breach of AI documentation data is not an ordinary data breach: it can expose the recorded voices and intimate disclosures of clients in psychotherapy, among the most sensitive categories of health information that exist. The reputational, legal, and human consequences of such a breach are severe, and they fall on the practice as well as the vendor. This is why the privacy diligence in this section is not bureaucratic box-checking but a direct expression of the clinician's duty to protect client confidentiality. Every additional copy of session data, every additional sub-processor, and every additional day of retention is an increment of breach exposure that the clinician is responsible for understanding and minimizing. Choosing tools and configurations that limit data capture, retention, and downstream sharing is the clinician's confidentiality duty operating in a new technological context.</p>`,
        },
        { type: 'reflection', order: 10, question: 'Consider your own practice setting and the state(s) in which your clients are located. What is your current consent-to-record process, and what specifically would you need to add to it before ethically using an ambient AI scribe? Who in your practice is responsible for verifying the BAA?' },
        {
          type: 'callout', order: 11, calloutType: 'ethics', title: 'Consent Is a Conversation, Not a Checkbox',
          content: '<p>Informed consent for AI-assisted documentation is meaningful only when the client genuinely understands what is happening and can decline without penalty. Explain in plain language that a tool will record or transcribe the session, what happens to the data, how long it is kept, and that you review and remain responsible for the final note. Honor opt-outs with a real fallback workflow. Recording a person\'s therapy session is an intimate act; treat consent to it with corresponding seriousness.</p>',
        },
        {
          type: 'keyTakeaway', order: 12, title: 'Key Takeaways',
          takeaways: [
            'AI documentation vendors handle electronic PHI and are typically business associates; a signed BAA must be in place before any PHI is sent.',
            'Capability is not compliance — consumer AI tools that do not sign BAAs and may train on data are not acceptable for clinical documentation.',
            'Vendor due diligence covers retention, training use, encryption, access controls, sub-processors, and breach notification — verified in writing, not assumed.',
            'Obtain and document explicit client consent to record before using an ambient scribe; in all-party-consent states this is legally required, and it is the prudent default everywhere.',
          ],
        },
      ],
    },
    {
      title: 'Workflow Integration and Best Practices',
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '4', title: 'Workflow Integration and Best Practices', subtitle: 'Selecting tools, editing drafts, avoiding copy-forward errors, and supervisory policy', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Selecting a Tool: Beyond the Demo</h2>
<p>Choosing an AI documentation tool is a clinical, legal, and operational decision, not merely a question of which demo looks most impressive. The selection process should integrate the compliance criteria from Section 3 with practical considerations about how the tool will function in real clinical workflow. A useful selection framework asks: Will the vendor sign a BAA, and do its data-handling terms meet our standards? Does the tool support the note formats and templates our practice uses? How accurate is the tool with our actual client population — including clients with accents, clients who speak softly, sessions with emotional or rapid speech, and the clinical vocabulary specific to our specialty? How much editing does a typical draft require, and does the tool make editing easy? Does the tool integrate with our electronic health record, or does it create a separate copy-and-paste step that introduces its own error risk?</p>
<p>Crucially, the evaluation should include a supervised trial with real (consented) sessions before any practice-wide rollout, during which the clinician carefully compares the AI draft to their own recollection and to a self-written note. The metric that matters is not how good the draft looks but how often it contains commission or omission errors and how much trust the clinician can place in it. A tool that produces polished drafts requiring heavy correction may save less time than it appears, and a tool that occasionally fabricates risk content may be unacceptable regardless of its average performance. The trial should also surface the practical friction points — login flow, microphone reliability, telehealth compatibility — that determine whether clinicians will actually use the tool correctly under real-world pressure.</p>
<p>Vendor neutrality is important here. The market includes many capable products, and several are widely discussed in the general health care literature, but this course endorses none of them. The right tool depends on the practice\'s population, specialty, EHR, jurisdiction, and risk tolerance. The discipline is to evaluate any candidate against consistent criteria rather than being persuaded by a polished sales demonstration, which by design shows the tool performing on clean audio with cooperative content rather than on the messy reality of clinical practice.</p>
<p>A structured way to make the decision is to assemble a short, written evaluation rubric before any demos and to score every candidate against it on the same terms. The rubric should weight the compliance criteria as gating items — a vendor that will not sign a BAA or will not commit in writing to not training on PHI fails outright, regardless of how strong it is on other dimensions — and then score the remaining candidates on accuracy in a real-session trial, editing effort, EHR integration, format support, telehealth reliability, and total cost including the clinician time spent correcting drafts. Recording the scores in writing protects the decision from being swayed by the most recent or most charismatic sales presentation and creates a documented basis for the choice that a practice can revisit when the market shifts. It also makes re-evaluation tractable: because these tools evolve quickly, a practice should plan to revisit its choice periodically, and a rubric makes that re-evaluation a matter of re-scoring rather than starting from scratch. Treating tool selection as a repeatable, criteria-driven process rather than a one-time purchase decision is the mark of a practice that intends to use AI documentation responsibly over the long term.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Editing Drafts and Avoiding Copy-Forward Errors</h2>
<p>Once a tool is adopted, the quality of the resulting record depends on disciplined editing habits. The foundational habit, established in Section 2, is reviewing each draft against memory while the session is fresh. Beyond that, several specific editing pitfalls deserve attention. The first is the <strong>boilerplate trap</strong>: AI tools, trained on large corpora of clinical notes, tend to reach for generic, formulaic phrasing — "Client appeared appropriately groomed and oriented to person, place, and time" — that may be inserted whether or not it was actually observed. Boilerplate is dangerous because it looks like documentation while saying nothing verified; a note full of plausible boilerplate can satisfy a quick reviewer while failing to reflect the actual encounter. Clinicians must treat generic clinical phrasing with suspicion and confirm that each such statement is true of this session.</p>
<p>The second pitfall is the <strong>copy-forward (cloning) error</strong>, a long-standing documentation hazard that AI can amplify. Copy-forward occurs when content from a previous note is carried into a new note unchanged, so that the new note describes a prior session rather than the current one. If an AI tool incorporates prior notes as context, it may regenerate stale content — a goal that has since been met, a symptom that has resolved, a plan that has changed — making the record internally inconsistent and clinically misleading. Each note must reflect the session it documents. Reviewing for copy-forward means asking whether anything in the draft is true of an earlier encounter but not this one.</p>
<p>The third pitfall is <strong>over-reliance and skill atrophy</strong>. A clinician who never drafts a note from scratch may gradually lose fluency in the clinical reasoning that documentation exercises — the discipline of formulating an assessment in one\'s own words, of articulating a plan deliberately. Documentation is not merely administrative; the act of writing a note is itself a moment of clinical reflection. Tools that remove that reflection entirely may have a hidden cost. The mitigations are to remain an active editor rather than a passive approver, to periodically draft notes manually to maintain the skill, and to treat the AI draft as raw material to be shaped rather than a finished product to be rubber-stamped.</p>
<p>There is a fourth, subtler pitfall worth naming: <strong>homogenization of the record</strong>. When many clinicians in a practice use the same tool with the same templates, their notes can begin to converge on a uniform house style, losing the individual clinical voice that often carries meaning. A seasoned clinician's idiosyncratic phrasing — the particular way they characterize a client's affect or frame a formulation — can encode clinical nuance that generic generated prose flattens. This is not merely an aesthetic concern. A note written in the clinician's own analytical voice tends to reflect the clinician's actual reasoning, whereas a note assembled from model-generated phrasing may reflect the model's defaults more than the clinician's thinking. Preserving the assessment section in particular as a space for the clinician's own words — even when the rest of the note is heavily AI-assisted — keeps the document anchored to genuine clinical reasoning. The assessment is where the clinician's judgment lives, and it is the section least suited to delegation. Clinicians should treat the AI's draft assessment with the most skepticism and the heaviest editing, rewriting it until it expresses their own clinical impression rather than a plausible-sounding default the model produced.</p>`,
        },
        {
          type: 'callout', order: 4, calloutType: 'clinical', title: 'Edit Like an Author, Not an Approver',
          content: '<p>The clinician\'s relationship to an AI draft should be that of an author working with raw material, not an approver rubber-stamping a finished product. Rewrite the assessment in your own clinical voice. Strip boilerplate that you did not actually observe. Confirm nothing was copied forward from a prior session. Add what the tool missed. The note that results should be one you would have been willing to write yourself — because, once you sign it, you did.</p>',
        },
        {
          type: 'text', order: 5,
          content: `<h2>Audit Trails, Supervision, and Group-Practice Policy</h2>
<p>AI-assisted documentation introduces governance questions that extend beyond the individual clinician, particularly in group practices and agencies. <strong>Audit trails</strong> matter: the record system should reflect that a note was generated with AI assistance and subsequently reviewed and authenticated by the clinician, and the timing of authentication should be capturable. Audit trails protect the clinician by demonstrating that review occurred, and they protect clients by enabling the practice to investigate if a documentation problem is discovered. Practices should understand what their EHR and AI tool log, and should configure logging to support — not undermine — the demonstration that the clinician\'s review duty was met.</p>
<p>One audit-trail nuance deserves emphasis: the timing of authentication can tell a story. A pattern in which dozens of notes are signed within seconds of one another late at night suggests batch-signing without meaningful review, and such a pattern, visible in the metadata, can be damaging in a licensing or malpractice review even if each individual note happens to be accurate. Conversely, a pattern showing notes reviewed and signed shortly after each session supports the inference that the clinician genuinely reviewed each one while it was fresh. Clinicians should be aware that the record system is documenting not only the content of their notes but the manner in which they were produced, and they should let that awareness reinforce, rather than merely perform, the underlying discipline. The goal is not to generate a flattering audit trail; it is to actually conduct the per-note review the trail is supposed to reflect.</p>
<p><strong>Supervision</strong> takes on a specific dimension when supervisees use AI documentation tools. A clinical supervisor responsible for a supervisee\'s notes must ensure the supervisee understands that the AI draft is a starting point, not an endpoint, and that the supervisee\'s review duty is identical to a fully independent clinician\'s. Supervisors should review a sample of AI-assisted notes for signs of automation bias — boilerplate, fabrications that slipped through, copy-forward content — and should make AI tool use an explicit topic in supervision rather than an unexamined background convenience. Trainees who learn documentation primarily by editing AI drafts may never develop the underlying skill; supervisors should ensure supervisees can document competently without the tool.</p>
<p><strong>Group-practice and agency policy</strong> should make the expectations explicit rather than leaving them to individual discretion. A sound AI documentation policy specifies which tools are approved (and the requirement that a BAA be in place), mandates client consent to record and the process for obtaining it, states the non-delegable review-and-sign duty in writing, addresses copy-forward and boilerplate prohibitions, defines retention and breach-response expectations consistent with the vendor agreements, and assigns responsibility for vendor due diligence and ongoing oversight. Such a policy turns the individual best practices in this course into an organizational standard, ensures consistency across clinicians, and provides a defensible governance posture if the practice\'s use of AI documentation is ever scrutinized.</p>
<p>A mature policy also addresses what happens when something goes wrong, because in any system used at scale, something eventually will. The policy should specify how a discovered documentation error — a hallucinated risk statement that reached a signed note, an omission that affected a continuity-of-care decision — is to be reported, corrected, and learned from. Correcting an error in a clinical record has its own conventions: late entries and amendments must be made transparently, with the correction dated and the original preserved rather than silently overwritten, so that the record\'s integrity and audit trail remain intact. The policy should also define the practice\'s response to a vendor security incident, including how clients would be notified if their session data were exposed and who coordinates the breach response. Building these contingencies into policy before they are needed transforms a potential crisis into a managed process and demonstrates the kind of proactive governance that regulators and licensing boards expect of practices using sensitive technology. The goal is not to assume the tools will fail catastrophically but to ensure that the practice has thought through its obligations in advance rather than improvising them under pressure. A practice that can show it anticipated these scenarios and prepared for them is in a far stronger position, ethically and legally, than one that adopted the technology enthusiastically and considered the failure modes only after one occurred.</p>`,
        },
        {
          type: 'sequencing', order: 6,
          instructions: 'Arrange the steps of a sound AI-assisted documentation workflow in the correct order.',
          steps: [
            { id: 's1', text: 'Confirm a signed BAA is in place and the tool is on the approved list before any session.', order: 1 },
            { id: 's2', text: 'Obtain and document the client\'s informed consent to record before activating the scribe.', order: 2 },
            { id: 's3', text: 'Conduct the session while the ambient scribe captures and transcribes the audio.', order: 3 },
            { id: 's4', text: 'Review the generated draft against your memory while the session is fresh, correcting commission and omission errors.', order: 4 },
            { id: 's5', text: 'Strip boilerplate, check for copy-forward content, and rewrite the assessment in your own clinical voice.', order: 5 },
            { id: 's6', text: 'Authenticate the finished note with your signature, adopting it as your own professional statement.', order: 6 },
          ],
          explanation: 'Compliance precedes capture (BAA and consent first), capture precedes review, review and editing precede authentication. Signing is the final step because the signature converts the draft into the clinician\'s legally accountable record.',
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'A new note states that a goal was "in progress," but the client actually met that goal two sessions ago. The AI tool carried the language from an earlier note. This is an example of:',
          options: [
            { text: 'An appropriate use of prior-note context', isCorrect: false },
            { text: 'A copy-forward (cloning) error that makes the record clinically misleading', isCorrect: true },
            { text: 'A transcription error in the speech-to-text stage', isCorrect: false },
            { text: 'A HIPAA Security Rule violation', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Carrying unchanged content from a prior note into a current note is a copy-forward (cloning) error. It makes the record describe a past encounter rather than the current one and is clinically misleading. Each note must reflect the session it documents.',
        },
        {
          type: 'multiSelect', order: 8,
          question: 'A sound group-practice AI documentation policy should specify which of the following? (Select all that apply)',
          options: [
            { text: 'Which tools are approved and that a BAA must be in place', isCorrect: true },
            { text: 'A requirement to obtain and document client consent to record', isCorrect: true },
            { text: 'The non-delegable duty of each clinician to review and sign every note', isCorrect: true },
            { text: 'Permission to batch-sign AI notes without review to save time', isCorrect: false },
            { text: 'Prohibitions on boilerplate and copy-forward content', isCorrect: true },
          ],
          explanation: 'A sound policy approves specific tools (with BAAs), mandates consent to record, states the non-delegable review duty in writing, and prohibits boilerplate and copy-forward. It would never permit batch-signing without review, which defeats the review duty.',
        },
        {
          type: 'videoEmbed', order: 9, videoTitle: 'Best Practices for Editing AI-Generated Clinical Notes',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_aiscribe',
          description: 'A practical walkthrough of reviewing and editing AI drafts: catching boilerplate, checking for copy-forward content, verifying risk statements, and authenticating the final note.',
        },
        {
          type: 'text', order: 10,
          content: `<h2>Telehealth, Accessibility, and Equity Considerations</h2>
<p>Workflow integration raises several considerations that are easy to overlook in the rush to capture time savings. The first is the <strong>telehealth context</strong>. Many behavioral health sessions now occur over video, and AI documentation tools behave differently in that environment. Audio captured through a telehealth platform may be of variable quality, subject to dropouts, lag, and compression that degrade transcription accuracy. The consent-to-record question becomes more salient because the client may be in a different state with different recording laws, and because clients participating from home may have heightened privacy concerns about being recorded in their own space. Practices integrating AI documentation into telehealth must verify that their tool handles platform audio reliably and that their consent process accounts for the client's actual location and circumstances.</p>
<p>The second consideration is <strong>accuracy variation across client populations</strong>, which is a clinical-equity issue and not merely a technical one. Automatic speech recognition has historically performed less accurately for speakers with certain accents, dialects, speech differences, and for non-native speakers of the tool's primary language. If a documentation tool transcribes some clients less accurately than others, it can systematically introduce more errors into the records of already-marginalized populations, compounding existing inequities in care. A clinician serving a linguistically diverse caseload bears a particular responsibility to evaluate how the tool performs across their actual client population and to apply heightened review where accuracy is likely to be lower. Equity in documentation accuracy is part of equitable care.</p>
<p>The third consideration is the <strong>therapeutic-relationship impact</strong> of introducing a recording device into the room. Some clients may speak more guardedly knowing they are being recorded, may be reluctant to disclose sensitive material, or may experience the presence of an AI tool as a third party in what should be a confidential dyad. The clinician must weigh the documentation efficiency against any effect on the therapeutic process and must be prepared to forgo the tool when its presence would undermine the work. This is ultimately a clinical judgment: the documentation tool serves the clinical relationship, not the reverse, and a tool that improves the note while degrading the therapy has made a poor trade. Keeping the clinical relationship primary is the organizing principle that should govern every workflow decision about these tools.</p>`,
        },
        { type: 'reflection', order: 11, question: 'Design the first three lines of an AI documentation policy you would want your practice (or your own solo practice) to follow. What would you make non-negotiable, and why? Where would you allow clinician discretion?' },
        {
          type: 'keyTakeaway', order: 12, title: 'Key Takeaways',
          takeaways: [
            'Select tools against consistent compliance, accuracy, and workflow criteria — with a supervised real-session trial — rather than by demo impressions.',
            'Edit like an author: strip unverified boilerplate, check for copy-forward content, and rewrite the assessment in your own clinical voice.',
            'Guard against over-reliance and skill atrophy by remaining an active editor and periodically drafting notes manually.',
            'Audit trails, supervision of AI tool use, and explicit group-practice policy turn individual best practices into a defensible organizational standard.',
          ],
        },
      ],
    },
    {
      title: 'Summary, Resources, and Practice Commitments',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '5', title: 'Summary, Resources, and Practice Commitments', subtitle: 'Synthesis of the course and your commitments to compliant, accountable AI-assisted documentation', order: 1 },
        {
          type: 'text', order: 2,
          content: `<h2>Bringing It Together</h2>
<p>This course has traced AI-assisted clinical documentation from its market origins through its clinical risks, legal obligations, and practical workflow. The starting point was the genuine problem these tools address: the documentation burden that consumes clinician time, drives burnout, and reduces clinical capacity. Ambient scribes, NLP note generation, transcription, and generative SOAP and DAP drafting all promise to return time to the clinician, and that promise is real. But the central thesis of the course is that the promise must be held alongside the pitfalls, because the mental health record is a clinical and legal document, not merely a chore to be automated. The technology changes the workflow; it does not change who is responsible for the result.</p>
<p>The clinical pitfall is hallucination and the related families of commission and omission error. Generative models produce fluent, confident text that can be false, and in documentation that falseness is camouflaged by the surrounding accurate, well-written note. The protective response is the clinician\'s non-delegable duty to review and sign — to reconcile every draft against an independent memory of the session, to scrutinize risk content word by word, and to correct both fabrications and omissions before authentication. Fluency is not accuracy, and automation bias is the trap that turns a helpful tool into a generator of false records under the clinician\'s signature.</p>
<p>The legal and ethical pitfalls center on privacy and consent. AI documentation vendors handle protected health information and are typically business associates, so a signed BAA must precede any PHI disclosure; capability is never a substitute for compliance, and consumer AI tools that do not sign BAAs are unacceptable. Recording a therapy session triggers consent obligations that, in all-party-consent jurisdictions, are legally required and that are the prudent ethical default everywhere. And the workflow pitfalls — boilerplate, copy-forward errors, over-reliance, and skill atrophy — are managed by disciplined editing, audit trails, supervision, and explicit group-practice policy. Taken together, these practices allow clinicians to capture the real benefits of AI documentation while protecting the integrity of the record, the privacy of the client, and the accountability of their own license.</p>
<p>Several threads run through all five sections and are worth drawing out explicitly. The first is that accountability never moves: from the first session a tool records to the moment a clinician signs a note, the responsibility for the record's accuracy, the client's privacy, and the adequacy of consent remains with the clinician and the practice, never with the vendor. The second is that capability and compliance are independent questions, and the compliance question is answered first; a tool's impressive output is irrelevant if the arrangement to use it is unsound. The third is that the clinician's review is the irreducible safeguard, the one step the technology cannot perform, and that this review is reconciliation against reality rather than a check of internal coherence. The fourth is that the human relationship at the center of the work — the therapeutic alliance, the client's autonomy, the clinician's clinical voice — must remain primary, with the tool serving it rather than reshaping it. A clinician who carries these four threads into their use of any AI documentation tool, present or future, will be equipped to evaluate it soundly even as the specific products change. The principles are durable in a way the products are not.</p>`,
        },
        {
          type: 'text', order: 3,
          content: `<h2>Holding Promise and Pitfalls Together</h2>
<p>The title of this course names three things — promise, pitfalls, and compliance — and the synthesis is the discipline of holding all three at once rather than collapsing into either uncritical enthusiasm or reflexive refusal. The promise is genuine: AI documentation tools can meaningfully reduce the administrative burden that contributes to clinician burnout, and there is no virtue in clinicians grinding themselves down with documentation labor that a tool could ease. A clinician who refuses all such tools on principle may be sacrificing well-being and clinical capacity for no client benefit. The promise deserves to be taken seriously, and clinicians who use these tools well are not cutting corners; they are practicing efficiently in a way that can serve both themselves and their clients.</p>
<p>The pitfalls are equally genuine and are specific to the nature of the clinical record. Hallucination, omission, automation bias, boilerplate, and copy-forward errors are not hypothetical edge cases; they are predictable failure modes of the technology that produce false or misleading records under the clinician's signature. The privacy and consent pitfalls are not bureaucratic technicalities; they protect the recorded voices and intimate disclosures of people in psychotherapy. A clinician who ignores the pitfalls in pursuit of the promise will eventually produce a record that misrepresents a client, or disclose PHI to a vendor that should never have received it, or record a client who never meaningfully consented. The pitfalls deserve to be taken just as seriously as the promise.</p>
<p>Compliance is the bridge between the two. The compliance practices in this course — the BAA, the consent process, the vendor diligence, the non-delegable review duty, the editing discipline, the audit trails, and the policy framework — are precisely what allow a clinician to capture the promise while avoiding the pitfalls. They are not obstacles to using these tools; they are the conditions under which using them is safe, ethical, and defensible. A clinician who internalizes this synthesis approaches AI documentation as a capable assistant to be supervised rather than a replacement to be trusted, keeps their own judgment and accountability at the center, and treats every efficiency gain as something to be earned through diligence rather than assumed. That is the professional stance this course has aimed to build, and it is the stance that will keep clients protected and records trustworthy as these tools become an ordinary part of behavioral health practice.</p>
<p>Looking ahead, clinicians should expect this area to keep moving. The tools will grow more capable, regulatory guidance specific to AI in health care will continue to develop, professional bodies will issue more detailed standards, and the norms of practice will mature as the profession accumulates experience. None of this changes the core obligations this course has emphasized, but it does mean that competence here is not a one-time achievement. A clinician who completes this course is well-prepared for the present landscape, and the way to stay prepared is to treat the authoritative resources — HHS and its Office for Civil Rights, the ONC, AHIMA, the APA, the AMA, and one's own licensing board and professional association — as living references to consult as guidance evolves, rather than as sources read once and set aside. Periodic re-examination of one's tools, one's consent process, one's vendor agreements, and one's review habits is the practical form that ongoing competence takes. The clinician who builds that habit of periodic re-examination will continue to capture the genuine promise of these tools while honoring the duties that protect the people they serve, no matter how the technology develops from here.</p>`,
        },
        {
          type: 'callout', order: 4, calloutType: 'key', title: 'The Course in One Sentence',
          content: '<p>AI documentation tools are powerful drafting assistants that can genuinely reduce administrative burden, but the clinician retains a non-delegable duty to verify every draft against memory, to obtain consent and a BAA before any recording or PHI disclosure, and to edit out hallucination, boilerplate, and copy-forward content before adopting the note as their own signed record.</p>',
        },
        {
          type: 'accordion', order: 5, title: 'Quick-Reference Checklists',
          accordionItems: [
            { title: 'Before adopting a tool', content: '<p>Confirm the vendor will sign a BAA. Review data retention, training-use commitments, encryption, access controls, sub-processors, and breach-notification terms in writing. Run a supervised trial on real consented sessions and measure commission and omission error rates, not demo polish. Confirm the supported note formats and EHR integration.</p>' },
            { title: 'Before each recorded session', content: '<p>Verify a BAA is in place and the tool is approved. Obtain and document the client\'s informed consent to record, explained in plain language, with a real opt-out and a fallback workflow ready. Confirm you are meeting the recording-consent standard of the client\'s jurisdiction.</p>' },
            { title: 'Before signing each note', content: '<p>Read the entire draft against your memory while the session is fresh. Verify risk content (ideation, safety, abuse, substance use) word by word. Remove fabrications and unverified boilerplate, add omitted clinically significant content, and check for copy-forward language. Rewrite the assessment in your own voice, then authenticate.</p>' },
          ],
        },
        {
          type: 'multipleChoice', order: 6,
          question: 'Which statement best captures the relationship between an AI documentation tool and the clinician\'s accountability?',
          options: [
            { text: 'Adopting a capable tool transfers documentation accountability to the vendor', isCorrect: false },
            { text: 'The tool assists drafting, but the clinician who signs retains full, non-delegable accountability for the record', isCorrect: true },
            { text: 'Accountability is shared equally between the clinician and the AI vendor', isCorrect: false },
            { text: 'A signed BAA shifts clinical accountability to the business associate', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'AI tools are drafting assistants. The clinician who signs adopts the note as their own professional statement and retains full, non-delegable accountability. A BAA governs PHI handling; it does not transfer clinical accountability for the content of the record.',
        },
        {
          type: 'flashcardDeck', order: 7,
          instructions: 'Final review of the course\'s core commitments.',
          flashcards: [
            { id: 'f1', front: 'Non-delegable review duty', back: 'The clinician must read every AI draft against memory, correct commission and omission errors, scrutinize risk content word by word, and sign only after verification. This duty cannot be transferred to a vendor or algorithm.' },
            { id: 'f2', front: 'No BAA, no PHI', back: 'No protected health information goes to any AI tool without a signed business associate agreement. Consumer AI products that do not sign BAAs and may train on data are unacceptable for clinical documentation.' },
            { id: 'f3', front: 'Consent to record', back: 'Obtain and document explicit client consent before activating an ambient scribe. Legally required in all-party-consent states; the prudent ethical default everywhere, with a real opt-out and fallback workflow.' },
            { id: 'f4', front: 'Edit, do not approve', back: 'Strip unverified boilerplate, check for copy-forward content, add omissions, and rewrite the assessment in your own voice. The signed note should be one you would have been willing to write yourself.' },
          ],
        },
        {
          type: 'resources', order: 8, title: 'Documentation & Compliance Resources',
          resources: [
            { title: 'HHS HIPAA Privacy Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/index.html', type: 'link', description: 'Official HHS Office for Civil Rights overview of the HIPAA Privacy Rule governing uses and disclosures of PHI.' },
            { title: 'HHS HIPAA Security Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html', type: 'link', description: 'HHS guidance on administrative, physical, and technical safeguards for electronic PHI.' },
            { title: 'HHS Business Associates Guidance', url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html', type: 'link', description: 'HHS explanation of who is a business associate and the requirement for a business associate agreement.' },
            { title: 'ONC — HealthIT.gov', url: 'https://www.healthit.gov/', type: 'link', description: 'Office of the National Coordinator for Health Information Technology resources on health IT, privacy, and security.' },
            { title: 'AHIMA — Health Information Management', url: 'https://www.ahima.org/', type: 'link', description: 'American Health Information Management Association standards on documentation integrity and information governance.' },
            { title: 'APA Record Keeping Guidelines', url: 'https://www.apa.org/practice/guidelines/record-keeping', type: 'link', description: 'American Psychological Association guidelines on the content, retention, and clinician responsibility for clinical records.' },
            { title: 'AMA — Augmented Intelligence in Medicine', url: 'https://www.ama-assn.org/practice-management/digital/augmented-intelligence-medicine', type: 'link', description: 'American Medical Association principles and policy on the responsible use of augmented/artificial intelligence in clinical care.' },
            { title: 'HHS — Filing a HIPAA Complaint', url: 'https://www.hhs.gov/hipaa/filing-a-complaint/index.html', type: 'link', description: 'How clients and clinicians can report potential HIPAA privacy or security violations to the Office for Civil Rights.' },
          ],
        },
        { type: 'multipleChoice', question: "Before adopting an AI ambient scribe or documentation tool, which safeguard is described as non-negotiable?", options: [{ text: "A signed Business Associate Agreement (BAA) with the vendor", isCorrect: true }, { text: "A guarantee from the vendor that the tool never hallucinates", isCorrect: false }, { text: "Client consent is optional as long as the note is accurate", isCorrect: false }, { text: "Encryption is unnecessary if the tool is cloud-based", isCorrect: false }], correctAnswer: 0, explanation: "The course treats a signed BAA, along with documented consent and a supervised trial, as a baseline requirement before any AI documentation tool touches PHI — not an optional enhancement." },
{
          type: 'keyTakeaway', order: 9, title: 'Key Takeaways',
          takeaways: [
            'AI documentation tools can reduce real administrative burden, but they never transfer the clinician\'s non-delegable accountability for the record.',
            'Verify every draft against memory, scrutinize risk content word by word, and edit out hallucination, boilerplate, and copy-forward before signing.',
            'No PHI goes to any tool without a signed BAA; obtain documented client consent to record before using an ambient scribe.',
            'Use the resources above — HHS, ONC, AHIMA, APA, AMA — to ground your practice\'s policy in authoritative standards.',
          ],
        },
        {
          type: 'callout', order: 10, calloutType: 'protocol', title: 'Three Practice Commitments',
          content: '<p><strong>Commitment 1:</strong> I will not send protected health information to any AI documentation tool unless a signed business associate agreement is in place, and I will obtain and document client consent before recording any session. <strong>Commitment 2:</strong> I will read every AI-generated note against my own memory of the session before signing, verifying risk content word by word and removing any hallucination, boilerplate, or copy-forward content. <strong>Commitment 3:</strong> I will treat each draft as raw material I author, not a finished product I approve, and I will periodically document without the tool to maintain my own clinical-writing skill.</p>',
        },
        { type: 'reflection', order: 11, question: 'Write your own version of the three practice commitments above, tailored to your specific role, setting, and jurisdiction. Which one will be hardest for you to keep, and what concrete habit or safeguard will you put in place to keep it?' },
      ],
    },
  ],

  assessment: {
    passingScore: 80, passThreshold: 0.8, maxAttempts: 3,
    questions: [
      { question: 'Which category of AI documentation tool runs in the background of an ordinary conversation, transcribes the session, and generates a structured note?', options: [{ text: 'Stand-alone automatic transcription', isCorrect: false }, { text: 'The ambient AI scribe', isCorrect: true }, { text: 'NLP expansion of clinician-entered text', isCorrect: false }, { text: 'A static EHR template', isCorrect: false }], correctAnswer: 1, explanation: 'The ambient AI scribe captures the spoken session in the background, transcribes it, and generates a structured note. It is the highest-privacy-risk category because it records the full confidential conversation.' },
      { question: 'The primary administrative problem that AI documentation tools are designed to address is:', options: [{ text: 'A shortage of electronic health record software', isCorrect: false }, { text: 'The documentation burden that consumes clinician time and drives burnout', isCorrect: true }, { text: 'A lack of standardized note formats in behavioral health', isCorrect: false }, { text: 'Clients\' difficulty understanding their own records', isCorrect: false }], correctAnswer: 1, explanation: 'These tools target the documentation burden — progress notes, treatment plans, intake summaries, billing records — that consumes clinician time, drives burnout and after-hours work, and reduces clinical capacity.' },
      { question: 'In the context of generative AI, "hallucination" refers to:', options: [{ text: 'A hardware malfunction in the recording device', isCorrect: false }, { text: 'Fluent, confident content generated by the model that is factually wrong or invented', isCorrect: true }, { text: 'A client\'s reported perceptual disturbance documented in the note', isCorrect: false }, { text: 'An intentional fabrication by the clinician', isCorrect: false }], correctAnswer: 1, explanation: 'Hallucination is the model\'s production of fluent, plausible content that is false or invented. Because the surrounding note is accurate and well-written, hallucinated content is camouflaged and easy to miss on review.' },
      { question: 'A note states "Client denied suicidal ideation," but suicide was never discussed in the session. This is best classified as:', options: [{ text: 'An omission error', isCorrect: false }, { text: 'A commission error and hallucination requiring correction', isCorrect: true }, { text: 'A standard clinical default that needs no change', isCorrect: false }, { text: 'A speech-to-text transcription error', isCorrect: false }], correctAnswer: 1, explanation: 'Affirmatively stating something that did not occur is a commission error and a hallucination. Because it concerns risk, it is among the most consequential errors and must be removed on review.' },
      { question: 'An omission error in an AI-generated note is dangerous primarily because:', options: [{ text: 'It makes the note longer than necessary', isCorrect: false }, { text: 'The missing content is invisible on review since the note still reads as complete', isCorrect: true }, { text: 'It always triggers an automatic HIPAA breach', isCorrect: false }, { text: 'It is easily caught by the vendor\'s software', isCorrect: false }], correctAnswer: 1, explanation: 'Omission errors drop clinically significant content that did occur, but the note still reads as complete and coherent. Nothing signals the gap unless the clinician independently recalls the full session.' },
      { question: 'The clinician\'s duty to review and sign an AI-generated note is best described as:', options: [{ text: 'Delegable to the AI vendor once a BAA is signed', isCorrect: false }, { text: 'Non-delegable; it cannot be transferred to a vendor, service, or algorithm', isCorrect: true }, { text: 'Optional when the tool has been historically accurate', isCorrect: false }, { text: 'Satisfied by reading the vendor\'s accuracy claims', isCorrect: false }], correctAnswer: 1, explanation: 'The clinician who signs adopts the note as their own professional statement. This responsibility is non-delegable and cannot be transferred to a vendor, service, or algorithm.' },
      { question: 'Reviewing an AI-generated note differs from proofreading one\'s own writing because it requires:', options: [{ text: 'Checking only spelling and grammar', isCorrect: false }, { text: 'Reconciling the text against an independent memory of what actually happened', isCorrect: true }, { text: 'Trusting the draft because it reads fluently', isCorrect: false }, { text: 'Signing in batches to save time', isCorrect: false }], correctAnswer: 1, explanation: 'Proofreading checks whether text says what the writer intended. Reviewing an AI draft requires reconciliation against memory — confirming no commission errors and no omissions relative to the actual session.' },
      { question: 'An AI documentation vendor that processes session audio and returns generated notes is, under HIPAA, typically a:', options: [{ text: 'Covered entity', isCorrect: false }, { text: 'Business associate', isCorrect: true }, { text: 'Disinterested third party exempt from HIPAA', isCorrect: false }, { text: 'Consumer software provider', isCorrect: false }], correctAnswer: 1, explanation: 'A vendor that creates, receives, maintains, or transmits PHI on the clinician\'s behalf is a business associate, and a signed business associate agreement must be in place before any PHI is sent.' },
      { question: 'Before sending any PHI to an AI documentation vendor, a covered clinician must first ensure that:', options: [{ text: 'The tool uses the most advanced model available', isCorrect: false }, { text: 'A signed business associate agreement (BAA) is in place', isCorrect: true }, { text: 'The vendor is located in the same state', isCorrect: false }, { text: 'The client has upgraded to a premium tier', isCorrect: false }], correctAnswer: 1, explanation: 'No PHI may go to a vendor without a signed BAA. Using a tool that will not sign a BAA is generally a HIPAA violation in itself, regardless of the tool\'s capability.' },
      { question: 'Pasting a client\'s session content into a general consumer AI chatbot to "clean up" a note is problematic mainly because:', options: [{ text: 'Consumer tools are too slow for clinical use', isCorrect: false }, { text: 'It discloses PHI to a vendor with no BAA and no enforceable safeguards', isCorrect: true }, { text: 'Consumer tools cannot produce SOAP notes', isCorrect: false }, { text: 'It violates copyright on the note template', isCorrect: false }], correctAnswer: 1, explanation: 'Consumer AI products typically do not sign BAAs, may use submitted data to train their models, and lack enforceable safeguards. Capability is not compliance; this is a disclosure of PHI without protection.' },
      { question: 'Vendor due diligence for an AI documentation tool should examine all of the following EXCEPT:', options: [{ text: 'Data retention and whether the vendor trains models on client PHI', isCorrect: false }, { text: 'Encryption in transit and at rest, access controls, and sub-processors', isCorrect: false }, { text: 'The marketing slogan and demo polish of the product', isCorrect: true }, { text: 'Breach-notification commitments in the BAA', isCorrect: false }], correctAnswer: 2, explanation: 'Due diligence examines retention, training use, encryption, access controls, sub-processors, and breach notification — verified in writing. Marketing slogans and demo polish are not evidence of a sound compliance posture.' },
      { question: 'In an all-party (two-party) consent state, using an ambient scribe to record a session legally requires:', options: [{ text: 'Only the clinician\'s consent to record', isCorrect: false }, { text: 'Consent to record from all parties, including the client', isCorrect: true }, { text: 'No consent because clinical recording is exempt', isCorrect: false }, { text: 'Consent only if the recording is retained after the session', isCorrect: false }], correctAnswer: 1, explanation: 'In all-party-consent jurisdictions, every party to a recorded conversation must consent. An ambient scribe records the session, so the client\'s documented consent to record is legally required before activating the tool.' },
      { question: 'The prudent default for consent to record before using an ambient scribe is to:', options: [{ text: 'Obtain explicit, documented client consent regardless of state, with a real opt-out', isCorrect: true }, { text: 'Record silently and disclose only if the client asks', isCorrect: false }, { text: 'Bury consent in the intake packet without discussion', isCorrect: false }, { text: 'Rely on the BAA to cover consent automatically', isCorrect: false }], correctAnswer: 0, explanation: 'Obtaining explicit, documented consent with a genuine opt-out satisfies the strictest applicable standard, honors client autonomy, and protects the alliance. A BAA governs vendor PHI handling, not client consent to record.' },
      { question: 'AI tools that insert generic phrasing such as "oriented to person, place, and time" whether or not it was observed create a risk known as the:', options: [{ text: 'Hallucination cascade', isCorrect: false }, { text: 'Boilerplate trap', isCorrect: true }, { text: 'Encryption gap', isCorrect: false }, { text: 'Sub-processor problem', isCorrect: false }], correctAnswer: 1, explanation: 'Boilerplate is generic, formulaic phrasing inserted whether or not it was actually observed. It looks like documentation while saying nothing verified, and clinicians must confirm each such statement is true of the session.' },
      { question: 'A new note describes a goal as "in progress" when the client met it two sessions ago, because the tool carried prior-note language forward. This is:', options: [{ text: 'An appropriate use of context', isCorrect: false }, { text: 'A copy-forward (cloning) error that makes the record misleading', isCorrect: true }, { text: 'A Security Rule violation', isCorrect: false }, { text: 'A transcription error', isCorrect: false }], correctAnswer: 1, explanation: 'Carrying unchanged prior-note content into a current note is a copy-forward (cloning) error. It makes the note describe a past encounter rather than the current one, rendering the record clinically misleading.' },
      { question: 'When evaluating an AI documentation tool before practice-wide rollout, the most meaningful metric is:', options: [{ text: 'How impressive the sales demo appears', isCorrect: false }, { text: 'How often drafts contain commission or omission errors on real consented sessions', isCorrect: true }, { text: 'The number of note templates offered', isCorrect: false }, { text: 'The size of the vendor\'s marketing budget', isCorrect: false }], correctAnswer: 1, explanation: 'A supervised trial on real consented sessions should measure how often drafts contain commission or omission errors and how much trust the clinician can place in the output — not demo polish or template count.' },
      { question: 'A sound group-practice AI documentation policy would NOT include which of the following?', options: [{ text: 'A requirement that approved tools have a signed BAA', isCorrect: false }, { text: 'Permission to batch-sign AI notes without review to save time', isCorrect: true }, { text: 'A mandate to obtain and document consent to record', isCorrect: false }, { text: 'A written statement of the non-delegable review-and-sign duty', isCorrect: false }], correctAnswer: 1, explanation: 'A sound policy mandates BAAs, consent to record, the non-delegable review duty, and prohibitions on boilerplate and copy-forward. It would never permit batch-signing without review, which defeats the clinician\'s core documentation duty.' },
      { question: 'The single best framing of an AI documentation tool\'s role is that it is a:', options: [{ text: 'Replacement for clinical judgment in note-writing', isCorrect: false }, { text: 'Drafting assistant whose output the clinician must review, edit, and adopt as their own', isCorrect: true }, { text: 'Co-author with shared legal accountability for the record', isCorrect: false }, { text: 'Fully autonomous system that signs and files records', isCorrect: false }], correctAnswer: 1, explanation: 'AI documentation tools are drafting assistants, not authors of the legal record. The clinician reviews, edits, and adopts the note as their own signed professional statement, retaining full accountability.' },
    ],
  },

  references: [
    'U.S. Department of Health and Human Services, Office for Civil Rights. (2013). HIPAA Privacy Rule (45 C.F.R. Part 160 and Subparts A and E of Part 164). HHS.',
    'U.S. Department of Health and Human Services, Office for Civil Rights. (2013). HIPAA Security Rule (45 C.F.R. Part 160 and Subparts A and C of Part 164). HHS.',
    'U.S. Department of Health and Human Services. (2024). Business associate contracts and HIPAA. HHS Office for Civil Rights.',
    'Office of the National Coordinator for Health Information Technology. (2023). Health IT privacy and security resources. HealthIT.gov.',
    'American Health Information Management Association. (2021). Integrity of the healthcare record: Best practices for EHR documentation. AHIMA.',
    'American Health Information Management Association. (2020). Copy functionality toolkit: Managing copy-forward and cloned documentation. AHIMA.',
    'American Psychological Association. (2007). Record keeping guidelines. American Psychologist, 62(9), 993–1004.',
    'American Medical Association. (2023). Augmented intelligence in health care: Policy and principles. AMA.',
    'Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. ACM Computing Surveys, 55(12), 1–38.',
    'Tierney, A. A., Gayre, G., Hoberman, B., Mattern, B., Ballesca, M., Kipnis, P., Liu, V., & Lee, K. (2024). Ambient artificial intelligence scribes to alleviate the burden of clinical documentation. NEJM Catalyst Innovations in Care Delivery, 5(3).',
    'Sloss, E. A., Abdul, S., Aboagyewah, M. A., et al. (2024). Toward clinician-informed evaluation of ambient documentation tools. Journal of the American Medical Informatics Association, 31(11), 2638–2647.',
    'Goss, F. R., Blackley, S. V., Ortega, C. A., Kowalski, L. T., Landman, A. B., Lin, C. T., Meteer, M., Bakes, S., Gradwohl, S. C., Bates, D. W., & Zhou, L. (2019). A clinician survey of using speech recognition for clinical documentation in the electronic health record. International Journal of Medical Informatics, 130, 103938.',
    'Topol, E. J. (2019). High-performance medicine: The convergence of human and artificial intelligence. Nature Medicine, 25(1), 44–56.',
    'Sittig, D. F., & Singh, H. (2020). A new sociotechnical model for studying health information technology in complex adaptive healthcare systems. In Cognitive Informatics for Biomedicine (pp. 59–80). Springer.',
    'Bowman, S. (2013). Impact of electronic health record systems on information integrity: Quality and safety implications. Perspectives in Health Information Management, 10(Fall), 1c.',
    'Weiner, J. P., Kfuri, T., Chan, K., & Fowles, J. B. (2007). "e-Iatrogenesis": The most critical unintended consequence of CPOE and other HIT. Journal of the American Medical Informatics Association, 14(3), 387–388.',
    'American Counseling Association. (2014). ACA code of ethics. American Counseling Association.',
  ],

  resources: [
    { title: 'HHS HIPAA for Professionals', url: 'https://www.hhs.gov/hipaa/for-professionals/index.html', type: 'link', description: 'Central HHS Office for Civil Rights hub for HIPAA Privacy and Security Rule guidance.' },
    { title: 'ONC HealthIT.gov Privacy & Security', url: 'https://www.healthit.gov/topic/privacy-security-and-hipaa', type: 'link', description: 'ONC resources on health IT privacy, security, and HIPAA for practitioners.' },
    { title: 'APA Record Keeping Guidelines', url: 'https://www.apa.org/practice/guidelines/record-keeping', type: 'link', description: 'APA guidance on clinical record content, retention, and clinician responsibility.' },
    { title: 'AHIMA Documentation Integrity Resources', url: 'https://www.ahima.org/', type: 'link', description: 'AHIMA standards on documentation integrity, copy-forward management, and information governance.' },
    { title: 'AMA Augmented Intelligence in Medicine', url: 'https://www.ama-assn.org/practice-management/digital/augmented-intelligence-medicine', type: 'link', description: 'AMA principles and policy on responsible AI use in clinical care.' },
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
