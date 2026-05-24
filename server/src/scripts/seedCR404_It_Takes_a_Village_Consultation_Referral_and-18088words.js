/**
 * seedCR404_It_Takes_a_Village_Consultation_Referral_and-18088words.js
 * Source: It_Takes_a_Village_EXPANDED.md | CE: 3 | WC: 18088
 * NOTE: KC questions flagged ⚠️ need correctAnswer verified before publishing.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');

const course = {
  courseCode: 'CR-404',
  slug: 'it-takes-a-village-consultation-referral',
  title: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
  subtitle: `A Comprehensive 3-Hour CE Course for Licensed Mental Health Professionals`,
  description: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
  ceHours: 3,
  ceuHours: 3,
  accessType: 'subscription',
  status: 'draft',
  isPublished: false,
  category: 'Clinical Skills',
  nbccContentAreas: ['Counseling Theory/Practice'],
  targetAudience: ['Licensed Professional Counselors','Licensed Clinical Social Workers','Licensed Marriage and Family Therapists','National Certified Counselors'],
  objectives: [    `Distinguish between consultation, supervision, and collaborative care models and apply each appropriately in clinical practice.`,
    `Implement ethical procedures for seeking and providing clinical consultation in accordance with ACA Code of Ethics and state licensing requirements.`,
    `Navigate the referral process effectively, including assessment of when to refer, identification of appropriate resources, and warm handoff techniques.`,
    `Coordinate care with other providers while maintaining appropriate confidentiality and professional boundaries.`,
    `Collaborate effectively within interdisciplinary teams, understanding different professional roles and communication styles.`,
    `Apply ethical decision-making frameworks to common dilemmas in consultation and collaboration.`,
    `Utilize consultation as an ongoing professional development and self-care practice.`,
    `Develop systems for maintaining communication and documentation across multiple providers.`],
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', licenseType: 'LPC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', approvalStatus: 'approved', hourBreakdown: [{ label: 'core', hours: 3 }] }],
  assessment: {
    passingScore: 80, maxAttempts: 3, showExplanations: false,
    questions: [
      {
        type: "multipleChoice",
        question: `According to the course, which statement about consultation is TRUE?`,
        options: [
          { text: `The consultant assumes responsibility for the case`, isCorrect: false },
          { text: `Consultation is typically mandated for licensure`, isCorrect: false },
          { text: `The consultee retains clinical and ethical responsibility for the case`, isCorrect: true },
          { text: `Consultation decisions must be followed without modification`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: `The consultee always retains clinical and ethical responsibility`
      },
      {
        type: "multipleChoice",
        question: `A key difference between consultation and supervision is:`,
        options: [
          { text: `Consultation involves a hierarchical relationship with evaluation`, isCorrect: false },
          { text: `Supervision is voluntary while consultation is mandated`, isCorrect: false },
          { text: `In consultation, the consultee retains autonomous decision-making`, isCorrect: true },
          { text: `Supervisees retain more responsibility than consultees`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: `Consultation preserves consultee autonomy; supervision involves direction`
      },
      {
        type: "multipleChoice",
        question: `According to the ACA Code of Ethics, counselors should consult when:`,
        options: [
          { text: `Only when facing imminent client danger`, isCorrect: false },
          { text: `When they have questions regarding ethical obligations or professional practice`, isCorrect: true },
          { text: `Only for medication management decisions`, isCorrect: false },
          { text: `Only during the first year of practice`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `ACA Code C.2.e requires consultation for ethical and professional questions`
      },
      {
        type: "multipleChoice",
        question: `When preparing for consultation, counselors should:`,
        options: [
          { text: `Present every detail of the case regardless of relevance`, isCorrect: false },
          { text: `Clarify their specific question and gather relevant information`, isCorrect: true },
          { text: `Wait until they've already made a decision`, isCorrect: false },
          { text: `Avoid sharing their own thinking about the case`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Effective consultation requires preparation with clear questions`
      },
      {
        type: "multipleChoice",
        question: `The "warm handoff" approach to referral involves:`,
        options: [
          { text: `Simply giving the client a phone number`, isCorrect: false },
          { text: `Directly facilitating connection with the receiving provider`, isCorrect: true },
          { text: `Waiting for the new provider to reach out`, isCorrect: false },
          { text: `Ending all contact with the client immediately`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Warm handoffs directly facilitate connection, improving follow-through`
      },
      {
        type: "multipleChoice",
        question: `When providing consultation to others, consultants should:`,
        options: [
          { text: `Take over clinical decision-making for the consultee`, isCorrect: false },
          { text: `Ask before telling and share thinking, not just conclusions`, isCorrect: true },
          { text: `Refuse to acknowledge any uncertainty`, isCorrect: false },
          { text: `Provide consultation on any topic regardless of expertise`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Good consultants help consultees think rather than taking over`
      },
      {
        type: "multipleChoice",
        question: `Client reactions to referral commonly include all EXCEPT:`,
        options: [
          { text: `Feeling rejected or abandoned`, isCorrect: false },
          { text: `Fear of starting over`, isCorrect: false },
          { text: `Immediate enthusiasm without any concerns`, isCorrect: true },
          { text: `Shame about needing specialized help`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: `Most clients have some concerns about referral; pure enthusiasm is rare`
      },
      {
        type: "multipleChoice",
        question: `When coordinating care with other providers, the FIRST step is:`,
        options: [
          { text: `Sending detailed clinical notes`, isCorrect: false },
          { text: `Obtaining appropriate written releases from the client`, isCorrect: true },
          { text: `Waiting for the other provider to reach out`, isCorrect: false },
          { text: `Discussing the other provider critically with the client`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Written releases must be obtained before sharing information`
      },
      {
        type: "multipleChoice",
        question: `When you disagree with another provider's approach, you should:`,
        options: [
          { text: `Tell the client the other provider is wrong`, isCorrect: false },
          { text: `Seek to understand their reasoning and communicate directly`, isCorrect: true },
          { text: `Immediately stop coordination`, isCorrect: false },
          { text: `File a complaint with their licensing board`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Direct, respectful communication is the first step in disagreement`
      },
      {
        type: "multipleChoice",
        question: `Effective communication with psychiatrists typically requires:`,
        options: [
          { text: `Lengthy narrative descriptions`, isCorrect: false },
          { text: `Concise, factual information focused on clinical relevance`, isCorrect: true },
          { text: `Avoiding all clinical terminology`, isCorrect: false },
          { text: `Only communicating in emergencies`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Medical providers prefer concise, clinically relevant communication`
      },
      {
        type: "multipleChoice",
        question: `When working on interdisciplinary teams, counselors should:`,
        options: [
          { text: `Defer entirely to professionals with more advanced degrees`, isCorrect: false },
          { text: `Contribute their unique perspective while respecting others' expertise`, isCorrect: true },
          { text: `Avoid speaking unless directly asked`, isCorrect: false },
          { text: `Compete aggressively for recognition`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Counselors contribute unique perspectives while respecting other expertise`
      },
      {
        type: "multipleChoice",
        question: `Caplan's consultation models include all EXCEPT:`,
        options: [
          { text: `Client-centered case consultation`, isCorrect: false },
          { text: `Consultee-centered case consultation`, isCorrect: false },
          { text: `Supervisee-centered educational consultation`, isCorrect: true },
          { text: `Program-centered administrative consultation`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: `Caplan's models include client-centered, consultee-centered, and administrative`
      },
      {
        type: "multipleChoice",
        question: `When a client sees multiple providers, the risks WITHOUT coordination include:`,
        options: [
          { text: `Too much communication between providers`, isCorrect: false },
          { text: `Information gaps, contradictory recommendations, and gaps in care`, isCorrect: true },
          { text: `Excessive client involvement in decisions`, isCorrect: false },
          { text: `Over-documentation`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Without coordination, care fragments in multiple ways`
      },
      {
        type: "multipleChoice",
        question: `The ethical principle underlying the requirement for consultation is:`,
        options: [
          { text: `Minimizing clinician workload`, isCorrect: false },
          { text: `Protecting client welfare through informed clinical decision-making`, isCorrect: true },
          { text: `Demonstrating superiority to colleagues`, isCorrect: false },
          { text: `Billing for additional services`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Consultation protects clients through better-informed treatment`
      },
      {
        type: "multipleChoice",
        question: `When communicating with schools about a child client, counselors should:`,
        options: [
          { text: `Use extensive clinical jargon`, isCorrect: false },
          { text: `Share all diagnostic information without consideration`, isCorrect: false },
          { text: `Focus on functional implications and specific recommendations`, isCorrect: true },
          { text: `Refuse any communication regardless of releases`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: `School communications focus on educational implications and recommendations`
      },
      {
        type: "multipleChoice",
        question: `In peer consultation groups, members typically:`,
        options: [
          { text: `Take over each other's cases`, isCorrect: false },
          { text: `Provide mutual input while each retaining responsibility for their own clients`, isCorrect: true },
          { text: `Report each other to licensing boards`, isCorrect: false },
          { text: `Share all client identifying information publicly`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Peer consultation provides mutual input without transferring responsibility`
      },
      {
        type: "multipleChoice",
        question: `Documentation of consultation should include:`,
        options: [
          { text: `Only the consultant's name`, isCorrect: false },
          { text: `Date, consultant, issue consulted about, input received, and your reasoning`, isCorrect: true },
          { text: `Nothing if the consultation was informal`, isCorrect: false },
          { text: `Only documentation by the consultant, not the consultee`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Documentation should include key elements of the consultation`
      },
      {
        type: "multipleChoice",
        question: `When referring a client for specialized services while continuing therapy:`,
        options: [
          { text: `This is called transfer of care`, isCorrect: false },
          { text: `This is called adjunctive referral`, isCorrect: true },
          { text: `This is prohibited by ethical codes`, isCorrect: false },
          { text: `The therapist must stop all contact`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Adding providers while continuing your care is adjunctive referral`
      },
      {
        type: "multipleChoice",
        question: `Power differentials on interdisciplinary teams should be managed by:`,
        options: [
          { text: `Accepting that some perspectives matter more than others`, isCorrect: false },
          { text: `Knowing your value and contributing confidently while building relationships`, isCorrect: true },
          { text: `Avoiding all teams with hierarchies`, isCorrect: false },
          { text: `Only speaking when asked directly`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: `Confidence, relationship-building, and knowing your value manage power dynamics`
      },
      {
        type: "multipleChoice",
        question: `The overall message of this course regarding collaborative care is:`,
        options: [
          { text: `Consultation and coordination are optional extras for advanced clinicians`, isCorrect: false },
          { text: `Solo practice is the ideal model for clinical work`, isCorrect: false },
          { text: `Building a "village" of professional support is essential for effective, ethical practice`, isCorrect: true },
          { text: `Clients prefer providers who work entirely independently`, isCorrect: false },
          { text: `Never reveal they're uncertain`, isCorrect: false },
          { text: `Avoid consulting about countertransference issues`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: `The course emphasizes collaborative practice as essential, not optional`
      },
      {
        type: "multipleChoice",
        question: `Documentation of consultation should include:`,
        options: [
          { text: `Only the consultant's recommendations`, isCorrect: true },
          { text: `Date, consultant credentials, issue consulted, input received, and decisions made`, isCorrect: false },
          { text: `Only cases where you disagreed with the consultant`, isCorrect: false },
          { text: `Personal opinions about the consultant`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `When providing consultation, effective consultants:`,
        options: [
          { text: `Take over decision-making from the consultee`, isCorrect: true },
          { text: `Offer only one correct approach`, isCorrect: false },
          { text: `Ask before telling and respect the consultee's autonomy`, isCorrect: false },
          { text: `Avoid acknowledging uncertainty`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Referral is indicated when:`,
        options: [
          { text: `The client is difficult to work with`, isCorrect: true },
          { text: `The client needs services outside your expertise or scope`, isCorrect: false },
          { text: `The client expresses any dissatisfaction with treatment`, isCorrect: false },
          { text: `You simply prefer not to work with the client`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `A "warm handoff" involves:`,
        options: [
          { text: `Giving the client a phone number and hoping they call`, isCorrect: true },
          { text: `Direct connection with the receiving provider to facilitate transition`, isCorrect: false },
          { text: `Immediate termination without follow-up`, isCorrect: false },
          { text: `Transferring all records without client consent`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `When coordinating care with other providers, counselors should:`,
        options: [
          { text: `Share all case information regardless of relevance`, isCorrect: true },
          { text: `Share information relevant to coordinated care with appropriate releases`, isCorrect: false },
          { text: `Avoid all contact with other providers to protect confidentiality`, isCorrect: false },
          { text: `Only coordinate in writing, never by phone`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `When providers disagree about treatment approaches:`,
        options: [
          { text: `The counselor should always defer to medical providers`, isCorrect: true },
          { text: `The conflict should be hidden from the client`, isCorrect: false },
          { text: `Focus on client welfare and seek to understand different perspectives`, isCorrect: false },
          { text: `Immediately terminate the coordination`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Understanding different professional disciplines is important because:`,
        options: [
          { text: `Some disciplines are inherently superior to others`, isCorrect: true },
          { text: `Different disciplines bring different training, perspectives, and scope of practice`, isCorrect: false },
          { text: `Counselors should compete with other disciplines for clients`, isCorrect: false },
          { text: `All disciplines approach cases identically`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Which is NOT a component of informed consent for coordinated care?`,
        options: [
          { text: `Who is involved in the client's care`, isCorrect: true },
          { text: `What information will be shared`, isCorrect: false },
          { text: `The political views of other providers`, isCorrect: false },
          { text: `The client's right to limit disclosure`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `When should consultation be sought according to the course?`,
        options: [
          { text: `Only during crises`, isCorrect: true },
          { text: `Only for supervisees`, isCorrect: false },
          { text: `As ongoing practice, not just crisis response`, isCorrect: false },
          { text: `Only when required by licensing boards`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `The referral conversation should:`,
        options: [
          { text: `Frame referral as the client's failure`, isCorrect: true },
          { text: `Avoid specific resource information`, isCorrect: false },
          { text: `Frame appropriately, normalize, and provide specific resources`, isCorrect: false },
          { text: `Never involve direct communication with receiving providers`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Releases of information for care coordination should:`,
        options: [
          { text: `Be verbal only`, isCorrect: true },
          { text: `Specify scope, direction, and duration`, isCorrect: false },
          { text: `Be unlimited and permanent`, isCorrect: false },
          { text: `Allow sharing with any provider without specifying`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Effective team meetings:`,
        options: [
          { text: `Allow one discipline to dominate`, isCorrect: true },
          { text: `Have clear purpose, agenda, and result in action items`, isCorrect: false },
          { text: `Avoid conflict at all costs`, isCorrect: false },
          { text: `Don't require documentation`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Managing interprofessional tensions requires:`,
        options: [
          { text: `Avoiding all disagreements`, isCorrect: true },
          { text: `Focusing on client welfare and addressing conflicts directly`, isCorrect: false },
          { text: `Deferring to whichever provider is loudest`, isCorrect: false },
          { text: `Terminating collaboration immediately`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `In the consultation relationship, responsibility for clinical decisions rests with:`,
        options: [
          { text: `The consultant`, isCorrect: true },
          { text: `The consultee`, isCorrect: false },
          { text: `Both equally`, isCorrect: false },
          { text: `Neither`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `What does "It Takes a Village" mean in the context of mental health treatment?`,
        options: [
          { text: `Only community mental health centers should provide care`, isCorrect: true },
          { text: `Complex clients require collaborative care involving multiple providers and systems`, isCorrect: false },
          { text: `Clients should not have individual therapists`, isCorrect: false },
          { text: `Villages should provide mental health care, not professionals`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Following up after a referral involves:`,
        options: [
          { text: `Immediately closing the case with no further contact`, isCorrect: true },
          { text: `Checking if the client connected with the resource and exploring barriers if they didn't`, isCorrect: false },
          { text: `Never contacting the client again`, isCorrect: false },
          { text: `Taking over the client's care from the new provider`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      }
    ]
  },
  references: [    { citation: `American Counseling Association. (2014). 2014 ACA Code of Ethics. Alexandria, VA: Author.` },
    { citation: `Barnett, J. E. (2019). The ethical practice of consultation in professional psychology. Professional Psychology: Research and Practice, 50(3), 157-163.` },
    { citation: `Caplan, G., & Caplan, R. B. (1993). Mental health consultation and collaboration. Waveland Press.` },
    { citation: `Collins, C., Hewson, D. L., Munger, R., & Wade, T. (2010). Evolving models of behavioral health integration in primary care. Milbank Memorial Fund.` },
    { citation: `Health Insurance Portability and Accountability Act of 1996, Pub. L. No. 104-191 (1996).` },
    { citation: `Heath, B., Wise Romero, P., & Reynolds, K. (2013). A review and proposed standard framework for levels of integrated healthcare. SAMHSA-HRSA Center for Integrated Health Solutions.` },
    { citation: `Interprofessional Education Collaborative. (2016). Core competencies for interprofessional collaborative practice: 2016 update. Washington, DC: Author.` },
    { citation: `Kessler, R., & Stafford, D. (Eds.). (2008). Collaborative medicine case studies: Evidence in practice. Springer.` },
    { citation: `McDaniel, S. H., & Fogarty, C. T. (2009). What primary care psychology has to offer the patient-centered medical home. Professional Psychology: Research and Practice, 40(5), 483-492.` },
    { citation: `Reiter, J. T., Dobmeyer, A. C., & Hunter, C. L. (2018). Integrated behavioral health in primary care: A guide to effective implementation (2nd ed.). American Psychological Association.` },
    { citation: `Remley, T. P., & Herlihy, B. (2020). Ethical, legal, and professional issues in counseling (6th ed.). Pearson.` },
    { citation: `Robinson, P. J., & Reiter, J. T. (2016). Behavioral consultation and primary care: A guide to integrating services (2nd ed.). Springer.` },
    { citation: `This course was developed for CounselorReady by GA Integrated Therapeutic Perspectives LLC, NBCC ACEP Provider #7760.` },
    { citation: `© 2024 GAITP LLC. All rights reserved.` }],
  sections: [
    {
      order: 1,
      title: `Module 1: FOUNDATIONS OF CONSULTATION`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 1: FOUNDATIONS OF CONSULTATION`,
              subtitle: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
              sectionNumber: 1,
            },
{
              type: "text",
              order: 2,
              content: `<h2>🎯 Module Learning Objectives</h2>
<p>By the end of this module, participants will be able to:</p>
<ol>
<li>Define consultation and distinguish it from supervision and other professional relationships</li>
<li>Identify the key features that characterize professional consultation</li>
<li>Describe different types of consultation and when each is appropriate</li>
<li>Apply ethical guidelines regarding consultation from the ACA Code of Ethics</li>
<li>Recognize situations that indicate consultation is needed</li>
</ol>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>Defining Consultation</h2>
<p>Consultation is a professional relationship in which one professional (the consultee) seeks assistance from another (the consultant) regarding a work-related problem. While the term is sometimes used loosely, formal consultation has specific characteristics that distinguish it from other professional relationships.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Key Features of Consultation</h2>
<p><strong>Voluntary:</strong> The consultee chooses to seek consultation and retains autonomy over whether to accept recommendations. Unlike supervision, which is often mandated for licensure or employment, consultation is typically initiated by the consultee's recognition that assistance would be helpful. This voluntary nature means the consultee can accept, modify, or reject recommendations—they retain full decision-making authority over their cases.</p>
<p><strong>Expert-based:</strong> The consultant brings specialized knowledge, skill, or perspective that the consultee lacks or wants to access. This might be expertise in a particular diagnosis, population, treatment modality, ethical issue, or clinical situation. The consultant's value lies in having something the consultee needs—whether that's specialized knowledge, years of experience, or simply an outside perspective that helps the consultee see their situation more clearly.</p>
<p><strong>Problem-focused:</strong> Consultation typically addresses specific professional challenges rather than ongoing oversight of practice. You might consult about a particular client, a specific ethical dilemma, a discrete clinical question, or a circumscribed area of practice. This distinguishes consultation from the ongoing, comprehensive oversight characteristic of supervision.</p>
<p><strong>Time-limited:</strong> Unlike supervision, which continues over extended periods (often years), consultation usually addresses discrete situations. You might consult once about a specific question, have a series of consultations about a complex case, or arrange regular consultation for a defined period. But consultation relationships are generally bounded rather than indefinite.</p>
<p><strong>Responsibility retained:</strong> This is crucial: the consultee retains clinical and ethical responsibility for the case. The consultant provides input, perspective, and recommendations, but the consultee makes the final decisions and bears responsibility for outcomes. This differs fundamentally from supervision, where supervisors share legal and ethical responsibility for supervisee practice. If something goes wrong after consultation, the consultee—not the consultant—is accountable.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>The History of Consultation in Mental Health</h2>
<p>Consultation has roots in public health and community mental health movements. Gerald Caplan's seminal work in the 1960s and 1970s established models for mental health consultation that continue to influence current practice. Caplan distinguished between several types of consultation:</p>
<p><strong>Client-centered case consultation:</strong> Focus is on understanding a particular client and developing recommendations for their care.</p>
<p><strong>Consultee-centered case consultation:</strong> Focus is on helping the consultee develop skills or overcome blocks that interfere with effective work with a class of clients.</p>
<p><strong>Program-centered administrative consultation:</strong> Focus is on organizational systems and programs rather than individual clients.</p>
<p><strong>Consultee-centered administrative consultation:</strong> Focus is on helping administrators develop skills for organizational management.</p>
<p>In contemporary practice, case consultation remains the most common form, though organizational and program consultation have grown in importance.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>🎭 Clinical Vignette: Distinguishing Consultation Relationships</h2>
<p><strong>Scenario 1:</strong> Dr. Patterson, a licensed psychologist with 15 years of experience, calls her colleague Dr. Williams monthly to discuss difficult cases. Dr. Williams has specialized training in trauma that Dr. Patterson lacks. Their conversations are informal, between equals, and Dr. Patterson makes her own decisions about how to apply Dr. Williams's input.</p>
<p><strong>Question:</strong> Is this consultation or supervision?</p>
<p><strong>Answer:</strong> This is <strong>consultation</strong>. Key indicators: both are fully licensed, the relationship is voluntary and peer-like, no shared responsibility, no evaluation component, consultee retains full decision-making authority.</p>
<p><strong>Scenario 2:</strong> Maria, a counseling intern, meets weekly with her site supervisor Dr. Chen. Dr. Chen reviews Maria's cases, provides feedback, signs off on treatment plans, and evaluates Maria's progress toward licensure requirements.</p>
<p><strong>Question:</strong> Is this consultation or supervision?</p>
<p><strong>Answer:</strong> This is <strong>supervision</strong>. Key indicators: Maria is not independently licensed, meetings are required, Dr. Chen has authority over Maria's practice, Dr. Chen shares responsibility for cases, evaluative component exists.</p>
<p><strong>Scenario 3:</strong> A licensed counselor pays a DBT expert $200/hour to meet quarterly and discuss DBT cases. The expert provides feedback on the counselor's conceptualization and intervention but has no ongoing involvement in the cases and doesn't share responsibility.</p>
<p><strong>Question:</strong> Is this consultation or supervision?</p>
<p><strong>Answer:</strong> This is <strong>consultation</strong> (paid expert consultation). The licensure status of the consultee, the fee arrangement, and the lack of shared responsibility all indicate consultation rather than supervision.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Why Consultation Matters: Evidence and Ethics</h2>
<p>Consultation isn't just nice to have—it's ethically expected and empirically supported.</p>
<p><strong>Ethical requirements:</strong> The ACA Code of Ethics (C.2.e) states that "Counselors consult with other counselors or related professionals when they have questions regarding their ethical obligations or professional practice." Similar requirements appear in other professional codes. Consultation is positioned not as optional but as a professional expectation.</p>
<p><strong>Benefits of consultation:</strong></p>
<ul>
<li>Reduces isolation common in private practice</li>
<li>Provides outside perspective on cases we're too close to see clearly</li>
<li>Fills gaps in our knowledge and training</li>
<li>Supports ethical decision-making through dialogue</li>
<li>Provides emotional support for difficult work</li>
<li>Improves client outcomes through better-informed treatment decisions</li>
<li>Reduces burnout through shared burden of difficult cases</li>
<li>Creates professional community and learning opportunities</li>
</ul>
<p><strong>When consultation is particularly indicated:</strong></p>
<ul>
<li>Cases outside your typical scope or expertise</li>
<li>High-risk situations (suicidality, violence, abuse)</li>
<li>Ethical dilemmas without clear answers</li>
<li>Cases where your judgment may be impaired (strong countertransference)</li>
<li>Stuck or stalled treatments</li>
<li>New clinical situations or populations</li>
<li>When you need emotional support to continue effective work</li>
<li>Legal entanglement or risk of complaint/lawsuit</li>
</ul>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>📋 Reflection Exercise: Your Consultation History</h2>
<p>Reflect on your use of consultation:</p>
<p><strong>How often do you seek consultation?</strong> ☐ Rarely/never ☐ Only in crisis situations ☐ Monthly or so ☐ Weekly or more frequently</p>
<p><strong>What typically prompts you to seek consultation?</strong> _________________________________</p>
<p><strong>What barriers prevent you from consulting more often?</strong> _________________________________</p>
<p><strong>What would make consultation more accessible for you?</strong> _________________________________</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Consultation vs. Supervision</h2><table class="cr-table">
<tr><th>Feature</th><th>Consultation</th><th>Supervision</th></tr>
<tr><td>Authority</td><td>Advisory only</td><td>Directive authority</td></tr>
<tr><td>Responsibility</td><td>Consultee retains full responsibility</td><td>Supervisor shares responsibility</td></tr>
<tr><td>Duration</td><td>Usually time-limited</td><td>Ongoing, extended</td></tr>
<tr><td>Mandate</td><td>Usually voluntary</td><td>Often mandated</td></tr>
<tr><td>Evaluation</td><td>No evaluation</td><td>Evaluative component</td></tr>
<tr><td>Relationship</td><td>More peer-like</td><td>Hierarchical</td></tr>
</table>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>🎭 Clinical Vignette: Is This Consultation or Supervision?</h2>
<p>Dr. Martinez, a newly licensed counselor, regularly meets with Dr. Chen, a senior colleague. Dr. Martinez brings cases, discusses challenges, and receives feedback. Dr. Chen does not bill for these meetings, does not document them formally, and does not sign off on Dr. Martinez's work. Dr. Martinez is fully licensed and carries her own malpractice insurance.</p>
<p><strong>Decision Point:</strong> Is this relationship consultation or supervision?</p>
<p><strong>Consider:</strong></p>
<ul>
<li>Dr. Martinez is fully licensed (not required to have supervision)</li>
<li>Meetings are voluntary and informal</li>
<li>Dr. Chen has no authority over Dr. Martinez's practice</li>
<li>Dr. Martinez retains full case responsibility</li>
<li>No formal documentation or evaluation occurs</li>
</ul>
<p><strong>Answer:</strong> This is <strong>consultation</strong>, not supervision. The key indicators are: voluntary participation, no shared responsibility, no authority/evaluation, and the consultee's full licensure status.</p>
<p><strong>Why it matters:</strong> If Dr. Martinez makes an error, Dr. Chen is not liable. Dr. Martinez cannot claim she was "following her supervisor's direction." The relationship provides support without creating legal entanglement.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Types of Consultation</h2>
<p><strong>Case consultation:</strong> Seeking input on a specific client situation. "I have a client presenting with X. How might I approach this?"</p>
<p><strong>Collegial consultation:</strong> Informal peer discussion about clinical challenges. Less structured but valuable for processing and problem-solving.</p>
<p><strong>Expert consultation:</strong> Seeking input from someone with specialized expertise—particular diagnoses, populations, or treatment modalities.</p>
<p><strong>Ethics consultation:</strong> Seeking guidance on ethical dilemmas from ethics committees or experts.</p>
<p><strong>Legal consultation:</strong> Seeking guidance on legal questions from attorneys familiar with mental health law.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>When to Seek Consultation</h2>
<p>The ACA Code of Ethics (C.2.e) states: "Counselors consult with other counselors or related professionals when they have questions regarding their ethical obligations or professional practice."</p>
<p>Consultation is indicated when:</p>
<ul>
<li>You're uncertain about diagnosis, treatment approach, or clinical decision</li>
<li>The case is outside your usual scope or expertise</li>
<li>Ethical dilemmas arise</li>
<li>Legal questions arise</li>
<li>You're experiencing significant countertransference</li>
<li>High-risk situations emerge (suicidality, violence)</li>
<li>Treatment isn't progressing as expected</li>
<li>You need support processing difficult cases</li>
</ul>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>✅ Knowledge Check: Module 1</h2>
<ol>
<li>The key difference between consultation and supervision regarding responsibility is:</li>
<p>a) Consultants always share responsibility for cases b) Consultees retain full clinical and ethical responsibility c) There is no difference in responsibility d) Supervisees retain full responsibility</p>
</ol>
<ol>
<li>According to the ACA Code of Ethics, consultation should be sought:</li>
<p>a) Only during the first year of licensure b) When counselors have questions about ethical obligations or professional practice c) Only for high-risk cases d) Only when mandated by employers</p>
</ol>
<ol>
<li>Which is NOT a characteristic of professional consultation?</li>
<p>a) Voluntary participation b) Problem-focused c) Evaluative component d) Time-limited</p>
</ol>`,
            }
      ]
    },
    {
      order: 2,
      title: `Module 2: SEEKING CONSULTATION EFFECTIVELY`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 2: SEEKING CONSULTATION EFFECTIVELY`,
              subtitle: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
              sectionNumber: 2,
            },
{
              type: "text",
              order: 2,
              content: `<h2>🎯 Module Learning Objectives</h2>
<p>By the end of this module, participants will be able to:</p>
<ol>
<li>Prepare effectively for consultation</li>
<li>Choose appropriate consultants</li>
<li>Present cases efficiently</li>
<li>Document consultation appropriately</li>
</ol>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>Before You Consult: Preparation</h2>
<p>Preparation enhances consultation effectiveness:</p>
<p><strong>Clarify your question:</strong> What specifically do you want input on? Diagnosis? Treatment approach? Ethical dilemma? The clearer your question, the more useful the consultation.</p>
<p><strong>Gather relevant information:</strong> Have case details available—history, current presentation, what you've tried, what you're considering.</p>
<p><strong>Consider confidentiality:</strong> What information is necessary to share? What can remain private? Do you need a release for identifying consultation?</p>
<p><strong>Identify appropriate consultants:</strong> Who has the expertise you need? Who do you trust?</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>🛠️ Skill Builder: The Consultation Preparation Checklist</h2>
<p>Before your next consultation, complete this checklist:</p>
<p>☐ <strong>My specific question is:</strong> ________________________________</p>
<p>☐ <strong>Relevant background:</strong> ________________________________</p>
<p>☐ <strong>What I've already tried:</strong> ________________________________</p>
<p>☐ <strong>What I'm considering:</strong> ________________________________</p>
<p>☐ <strong>Confidentiality considerations:</strong> ________________________________</p>
<p>☐ <strong>The consultant I've chosen because:</strong> ________________________________</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Choosing Consultants</h2>
<p>Consider these factors when selecting a consultant:</p>
<p><strong>Expertise:</strong> Does this person have relevant knowledge about the clinical issue, population, or ethical question?</p>
<p><strong>Experience:</strong> Have they dealt with similar situations?</p>
<p><strong>Objectivity:</strong> Can they be objective, or are they too close to the situation?</p>
<p><strong>Trust:</strong> Do you trust their judgment and confidentiality?</p>
<p><strong>Conflicts:</strong> Are there any conflicts of interest?</p>
<p><strong>Availability:</strong> Can they provide timely input?</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>🎭 Clinical Vignette: Choosing the Right Consultant</h2>
<p>Dr. Williams is struggling with a client who has both an eating disorder and a trauma history. The eating disorder is medical concerning, but the client wants to focus on the trauma. Dr. Williams has general training but limited eating disorder experience.</p>
<p><strong>Decision Point:</strong> Who should Dr. Williams consult?</p>
<p><strong>Option A:</strong> Her office mate, who is supportive but has no eating disorder experience <strong>Option B:</strong> An eating disorder specialist she met at a conference <strong>Option C:</strong> The client's previous eating disorder therapist (with client consent) <strong>Option D:</strong> An ethics consultant</p>
<p><strong>Best Answer:</strong> <strong>Option B or C</strong> - She needs clinical expertise in eating disorders, not just support (A) or ethics guidance (D). Option C has the advantage of knowledge about this specific client but may have biases; Option B provides fresh expert perspective.</p>
<p><strong>Key Principle:</strong> Match the consultant to the consultation need.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Presenting the Case</h2>
<p>Present cases efficiently:</p>
<ol>
<li><strong>Brief context:</strong> Client demographics, presenting problem, treatment history (2-3 sentences)</li>
<li><strong>Current situation:</strong> What's happening now that prompted consultation? (2-3 sentences)</li>
<li><strong>Your thinking:</strong> What have you considered? What approaches have you tried? (2-3 sentences)</li>
<li><strong>Your question:</strong> What specifically do you want input on? (1 sentence)</li>
</ol>
<p><strong>Avoid:</strong> Data dumps that overwhelm the consultant. Focus on information relevant to your question.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>🛠️ Skill Builder: Case Presentation Practice</h2>
<p>Practice presenting a current case using this structure:</p>
<p><strong>Context (2-3 sentences):</strong> "I'm seeing a [demographics] client for [presenting problem]. They've been in treatment for [duration]. Relevant history includes [key background]."</p>
<p><strong>Current situation (2-3 sentences):</strong> "What's prompting this consultation is [specific situation]. I've noticed [observations]. This has been happening for [timeframe]."</p>
<p><strong>My thinking (2-3 sentences):</strong> "I've considered [options]. I've tried [interventions]. My hypothesis is [your conceptualization]."</p>
<p><strong>My question (1 sentence):</strong> "What I specifically want input on is [clear question]."</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Receiving and Using Input</h2>
<p><strong>Listen openly:</strong> Even if suggestions differ from your thinking, hear them fully before responding.</p>
<p><strong>Ask clarifying questions:</strong> "Can you say more about why you'd approach it that way?"</p>
<p><strong>Consider multiple perspectives:</strong> If you consult several people, value different viewpoints.</p>
<p><strong>Remember autonomy:</strong> You retain decision-making responsibility. Consultation informs but doesn't dictate.</p>
<p><strong>Document:</strong> Record the consultation, input received, and your clinical reasoning.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Documentation of Consultation</h2>
<p>Document consultation including:</p>
<ul>
<li>Date and time of consultation</li>
<li>Consultant's name and credentials</li>
<li>Issue consulted about</li>
<li>Summary of input received</li>
<li>Your clinical reasoning and decisions</li>
<li>Any follow-up planned</li>
</ul>
<p>This documentation protects you legally and supports continuity of care.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Sample Consultation Documentation</h2>
<p>Here's an example of effective consultation documentation:</p>
<p><strong>Consultation Documentation Entry:</strong></p>
<p><em>Date:</em> [Date] <em>Consultant:</em> Dr. Jane Smith, Licensed Psychologist, OCD/Anxiety specialist</p>
<p><em>Issue consulted about:</em> Treatment sequencing for client with comorbid OCD and trauma history. Client is medically stable but OCD symptoms (checking behaviors, reassurance-seeking) are worsening. Client wants to focus on trauma; I'm uncertain about appropriate sequencing.</p>
<p><em>Summary of input:</em> Dr. Smith recommended prioritizing OCD stabilization before trauma processing for several reasons: (1) OCD symptoms provide avoidance mechanism that may worsen with trauma exposure, (2) ERP skills will be helpful during later trauma work, (3) current symptom escalation suggests destabilization risk. She recommended consulting with a trauma specialist to plan integrated approach if client remains resistant to OCD focus.</p>
<p><em>My reasoning and decisions:</em> I agree with the sequencing rationale. Will discuss with client using the framework Dr. Smith suggested (framing ERP as building skills we'll need for trauma work). Will consult with trauma specialist if client continues to resist this sequencing.</p>
<p><em>Follow-up:</em> Plan to update Dr. Smith in 4 weeks about client response.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Building Ongoing Consultation Relationships</h2>
<p>One-time consultations are useful, but ongoing consultation relationships are even more valuable.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Benefits of Regular Consultation</h2>
<p><strong>Consistency:</strong> The consultant knows you and your work, reducing the need to explain context repeatedly.</p>
<p><strong>Depth:</strong> Over time, the consultant understands your strengths, blind spots, and growth edges.</p>
<p><strong>Accountability:</strong> Regular meetings ensure you actually use consultation rather than letting it slide.</p>
<p><strong>Support:</strong> Ongoing relationships provide emotional support as well as clinical guidance.</p>
<p><strong>Development:</strong> Consistent consultation accelerates professional growth.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Establishing Regular Consultation</h2>
<p><strong>Identify potential consultants:</strong> Who has expertise you want to access? Who do you trust and enjoy working with?</p>
<p><strong>Propose the arrangement:</strong> "Would you be willing to meet monthly to discuss cases? I'd value your input on [area]."</p>
<p><strong>Establish logistics:</strong> How often? Where? How long? Fee arrangement (if applicable)?</p>
<p><strong>Create structure:</strong> Some consultants prefer specific agendas; others prefer free-flowing discussion. Figure out what works for both parties.</p>
<p><strong>Maintain the relationship:</strong> Show up prepared. Be a good consultee. Express appreciation.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Consultation Groups</h2>
<p>Peer consultation groups provide many benefits:</p>
<p><strong>Multiple perspectives:</strong> Several colleagues bring different expertise and viewpoints.</p>
<p><strong>Efficiency:</strong> You get consultation while also providing it to others.</p>
<p><strong>Community:</strong> Groups combat the isolation of clinical work.</p>
<p><strong>Learning:</strong> You learn from cases others present, not just your own.</p>
<p><strong>Accountability:</strong> Scheduled group meetings ensure regular consultation happens.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Starting a Consultation Group</h2>
<p><strong>Recruit members:</strong> 4-8 clinicians with compatible styles and complementary expertise.</p>
<p><strong>Establish structure:</strong></p>
<ul>
<li>How often will you meet? (Monthly is common)</li>
<li>How long? (60-90 minutes typical)</li>
<li>Where? (Rotating locations, video call, or regular space)</li>
<li>How will cases be presented? (Structure vs. free-form)</li>
<li>What are confidentiality expectations?</li>
</ul>
<p><strong>Rotate leadership:</strong> Different members can facilitate each meeting.</p>
<p><strong>Commit to consistency:</strong> The group only works if people actually attend.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>🛠️ Skill Builder: Consultation Relationship Planning</h2>
<p>Assess and plan your consultation relationships:</p>
<p><strong>Current regular consultation arrangements:</strong> _________________________________ _________________________________</p>
<p><strong>Areas where I need more consultation access:</strong> _________________________________</p>
<p><strong>Potential consultants for those areas:</strong> _________________________________</p>
<p><strong>First step to establish new consultation relationship:</strong> _________________________________</p>
<p><strong>Interest in starting or joining a consultation group?</strong> ☐ Yes - potential colleagues: _______________ ☐ Maybe - barriers to address: _______________ ☐ No - already have adequate structure</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>✅ Knowledge Check: Module 2</h2>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>✅ Knowledge Check: Module 2</h2>
<ol>
<li>When preparing for consultation, the FIRST step should be:</li>
<p>a) Identifying a consultant b) Clarifying your specific question c) Gathering all case information d) Getting a release of information</p>
</ol>
<ol>
<li>When presenting a case for consultation, you should:</li>
<p>a) Share every detail to ensure thoroughness b) Focus on information relevant to your specific question c) Let the consultant direct the conversation d) Avoid sharing your own thinking</p>
</ol>
<ol>
<li>After receiving consultation input, you should:</li>
<p>a) Follow recommendations exactly as given b) Consider input while retaining decision-making responsibility c) Dismiss input that differs from your original thinking d) Ask the consultant to make the decision</p>
</ol>`,
            }
      ]
    },
    {
      order: 3,
      title: `Module 3: PROVIDING CONSULTATION TO OTHERS`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 3: PROVIDING CONSULTATION TO OTHERS`,
              subtitle: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
              sectionNumber: 3,
            },
{
              type: "text",
              order: 2,
              content: `<h2>🎯 Module Learning Objectives</h2>
<p>By the end of this module, participants will be able to:</p>
<ol>
<li>Clarify roles and boundaries when providing consultation</li>
<li>Use effective consultation skills including active listening and Socratic questioning</li>
<li>Navigate ethical considerations as a consultant</li>
<li>Handle requests outside your expertise appropriately</li>
<li>Manage common challenges in the consultation role</li>
<li>Know when and how to decline consultation requests</li>
</ol>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>The Role of Consultant</h2>
<p>At some point in your career, colleagues will seek your input. You'll move from being the person who asks questions to being someone others turn to. This shift brings new responsibilities and ethical considerations.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>When You Become a Consultant</h2>
<p>You might find yourself in the consultant role when:</p>
<ul>
<li>A colleague asks about a case that touches your specialty area</li>
<li>A less experienced clinician seeks guidance on a challenging situation</li>
<li>You develop expertise in a particular population, diagnosis, or treatment approach</li>
<li>You're asked to join a consultation group or team</li>
<li>You provide informal guidance to colleagues in your workplace</li>
<li>Former supervisees return with questions after licensure</li>
</ul>
<p>Being sought as a consultant is a professional compliment—it means others value your expertise. But it also means taking on responsibilities that differ from being a consultee.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>The Consultant's Responsibilities</h2>
<p><strong>Clarify the relationship:</strong> Is this formal or informal consultation? What are the boundaries? What's the scope of your input?</p>
<p><strong>Maintain competence boundaries:</strong> Only consult within your actual expertise. If the question is outside your scope, say so.</p>
<p><strong>Respect consultee autonomy:</strong> You're advising, not directing. The consultee makes the final decisions.</p>
<p><strong>Protect confidentiality:</strong> Information shared in consultation should be treated with the same confidentiality as client information.</p>
<p><strong>Avoid conflicts of interest:</strong> Don't consult on situations where you have personal interests that could bias your input.</p>
<p><strong>Recognize limits of the role:</strong> You're not the consultee's therapist, supervisor, or rescuer.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>💡 Myth vs. Fact: Providing Consultation</h2><table class="cr-table">
<tr><th>Myth</th><th>Fact</th></tr>
<tr><td>Good consultants give definitive answers</td><td>Good consultants help consultees think through issues and reach their own conclusions</td></tr>
<tr><td>Consultants should take over when cases are complex</td><td>Consultants advise; consultees retain responsibility and decision-making authority</td></tr>
<tr><td>You should consult on any question you're asked</td><td>You should only consult within your genuine expertise and refer elsewhere when outside your scope</td></tr>
<tr><td>The consultee should follow your recommendations</td><td>The consultee should thoughtfully consider your input while retaining autonomy</td></tr>
<tr><td>Consultation is only for inexperienced clinicians</td><td>Experienced clinicians benefit greatly from consultation; it's a career-long practice</td></tr>
</table>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Effective Consultation Skills</h2>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Ask Before Telling</h2>
<p>The most common consultation mistake is jumping to advice before fully understanding the situation. Effective consultants ask before telling.</p>
<p><strong>Why asking first helps:</strong></p>
<ul>
<li>You may misunderstand the question or situation</li>
<li>The consultee often has relevant insights they haven't fully articulated</li>
<li>Premature advice may miss the real issue</li>
<li>Asking empowers the consultee to think rather than just receive answers</li>
</ul>
<p><strong>Questions to start with:</strong></p>
<ul>
<li>"Tell me more about what's happening."</li>
<li>"What have you considered so far?"</li>
<li>"What's your gut telling you?"</li>
<li>"What approaches have you already tried?"</li>
<li>"What do you think is getting in the way?"</li>
</ul>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Listen Fully</h2>
<p>Listen to understand, not just to prepare your response:</p>
<p><strong>Attend to the whole picture:</strong> Not just the client issue but also the consultee's experience, concerns, and blind spots.</p>
<p><strong>Listen for what's not said:</strong> What is the consultee avoiding? What might they be missing?</p>
<p><strong>Resist the urge to interrupt:</strong> Even when you have ideas, let the consultee finish.</p>
<p><strong>Summarize and clarify:</strong> "So if I'm understanding correctly, the main concern is..."</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Share Thinking, Not Just Conclusions</h2>
<p>Rather than just giving recommendations, share your clinical reasoning:</p>
<p><strong>Instead of:</strong> "You should do exposure therapy."</p>
<p><strong>Try:</strong> "Here's my thinking: It sounds like avoidance is maintaining the anxiety. In my experience, avoidance-maintained anxiety often responds well to exposure-based approaches because they help the client learn that the feared outcome either doesn't happen or is tolerable. What do you think about that conceptualization?"</p>
<p>Sharing thinking:</p>
<ul>
<li>Helps the consultee learn, not just get an answer</li>
<li>Allows the consultee to evaluate your reasoning</li>
<li>Models clinical thinking for less experienced clinicians</li>
<li>Opens space for dialogue and refinement</li>
</ul>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Acknowledge Uncertainty</h2>
<p>You don't have to know everything. Appropriate humility is honest and models good practice:</p>
<p><strong>Honest acknowledgments:</strong></p>
<ul>
<li>"I'm not sure about this, but here's what I'd consider..."</li>
<li>"This is outside my area of expertise, so take this with a grain of salt..."</li>
<li>"There's more than one reasonable approach here..."</li>
<li>"I've seen this go different ways in different cases..."</li>
</ul>
<p>Acknowledging uncertainty doesn't diminish your credibility—it enhances it by demonstrating intellectual honesty.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Offer Multiple Options</h2>
<p>When appropriate, present alternatives rather than single solutions:</p>
<p>"There are a few ways I could see approaching this. One option is... Another possibility is... A third approach might be... What resonates with you?"</p>
<p>Multiple options:</p>
<ul>
<li>Respect consultee autonomy</li>
<li>Acknowledge that clinical situations often don't have single "right" answers</li>
<li>Allow the consultee to choose based on their knowledge of the specific case</li>
<li>Model the kind of flexible thinking good clinicians use</li>
</ul>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Check Understanding</h2>
<p>Before ending consultation, verify that you've addressed the consultee's actual need:</p>
<ul>
<li>"Does that address what you were asking?"</li>
<li>"Is that helpful, or were you hoping for something different?"</li>
<li>"What else would be useful to discuss?"</li>
<li>"Do you have enough to move forward?"</li>
</ul>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>🎭 Clinical Vignette: Effective Consultation</h2>
<p><strong>Scenario:</strong> A colleague approaches you: "I have this client who's driving me crazy. She calls between sessions constantly, shows up early and wants to start before her scheduled time, and last week she brought me a gift. I don't know what to do."</p>
<p><strong>Decision Point:</strong> How do you respond?</p>
<p><strong>Poor response:</strong> "You need to set better boundaries. Tell her calls aren't allowed outside emergencies, return the gift, and be firm about starting on time."</p>
<p><strong>Problems with this response:</strong></p>
<ul>
<li>Jumps immediately to advice</li>
<li>Doesn't explore the consultee's experience or thinking</li>
<li>Doesn't understand the specific client dynamics</li>
<li>May miss important factors</li>
<li>Prescriptive rather than collaborative</li>
</ul>
<p><strong>Better response:</strong> "That sounds exhausting. Before I share my thoughts, can you tell me more? What have you tried so far? And what's your sense of what's driving these behaviors?"</p>
<p><strong>[After the consultee shares more, you learn the client has BPD features and a history of abandonment. The consultee has tried setting limits but feels guilty and sometimes gives in.]</strong></p>
<p><strong>Continued:</strong> "That context is really helpful. It sounds like there are a few things going on—the client's attachment patterns, your own feelings when you try to set limits, and maybe some inconsistency that's reinforcing the behaviors. Here's my thinking..."</p>
<p><strong>[Share conceptualization of BPD dynamics, validate the difficulty, discuss how inconsistent limits can reinforce the behaviors you're trying to reduce, explore the consultee's guilt and what triggers it, and offer specific strategies]</strong></p>
<p>"What do you think? Does that fit with your sense of what's happening?"</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Handling Challenging Consultation Situations</h2>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>When You Don't Know the Answer</h2>
<p>It's okay—even important—to acknowledge the limits of your knowledge:</p>
<p><strong>Responses when you're unsure:</strong></p>
<ul>
<li>"That's a great question, and honestly I'm not sure. Let me think about it and get back to you."</li>
<li>"This isn't really my area of expertise. I could offer some general thoughts, but you might want to consult with someone who specializes in [area]."</li>
<li>"I don't know, but here's how I would go about finding out..."</li>
</ul>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>When You Disagree with the Consultee's Approach</h2>
<p>You may be consulted about a case where you think the consultee is making mistakes. Tread carefully:</p>
<p><strong>Focus on understanding first:</strong> Make sure you fully understand their approach and reasoning before critiquing.</p>
<p><strong>Share perspective without condemnation:</strong> "I see it a bit differently. Here's my concern with that approach..."</p>
<p><strong>Offer alternatives rather than just criticism:</strong> "Have you considered...?"</p>
<p><strong>Remember your role:</strong> You're advising, not supervising. If you have serious concerns about ethics or safety, you may need to escalate—but routine differences in approach can be offered as perspective, not correction.</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>When the Consultee Wants You to Take Over</h2>
<p>Some consultees want you to make decisions for them rather than help them think:</p>
<p><strong>Recognize the dynamic:</strong> "It sounds like you want me to tell you what to do. I understand the appeal of that—this is a hard situation. But my role is to help you think through it, not to make decisions about your client."</p>
<p><strong>Redirect to their authority:</strong> "You know this client. What's your instinct?"</p>
<p><strong>Explore what's driving the request:</strong> "I notice you're wanting me to decide. What's making it hard to trust your own judgment here?"</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>When the Consultee Doesn't Follow Your Advice</h2>
<p>This is their right. They retain autonomy. But it can be frustrating:</p>
<p><strong>Recognize that they may have information you don't:</strong> There may be good reasons for their different choice.</p>
<p><strong>Avoid taking it personally:</strong> Your job was to offer input, not to control outcomes.</p>
<p><strong>Consider whether to follow up:</strong> In some cases, checking back later might be appropriate. "How did that situation resolve?"</p>
<p><strong>Don't withhold future consultation:</strong> They may make different choices than you would, but that doesn't mean consultation is useless.</p>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>🛠️ Skill Builder: Consultation Response Practice</h2>
<p>For each consultation request, write an effective initial response:</p>
<p><strong>1. "I have a client who I think might be bipolar, but I'm not sure. What do you think I should do?"</strong></p>
<p>Your response: _________________________________ _________________________________</p>
<p><strong>Sample answer:</strong> "Tell me what you're seeing that makes you think bipolar. What symptoms have you noticed? And how have you arrived at that diagnostic question?"</p>
<p><strong>2. "This client keeps showing up late and I don't know what to do about it."</strong></p>
<p>Your response: _________________________________ _________________________________</p>
<p><strong>Sample answer:</strong> "That sounds frustrating. Before I offer thoughts—what's your sense of what's driving the lateness? And what have you tried or considered so far?"</p>
<p><strong>3. "I'm dealing with an ethical situation and I need you to tell me what the right thing to do is."</strong></p>
<p>Your response: _________________________________ _________________________________</p>
<p><strong>Sample answer:</strong> "I can hear this is weighing on you. Tell me more about the situation and what ethical concerns have come up. And what options have you considered? I can help you think it through, though ultimately the decision will need to be yours."</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Ethical Considerations When Providing Consultation</h2>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Competence</h2>
<p>Only consult within your genuine expertise:</p>
<p><strong>If you don't know:</strong> "This isn't my area. I'd suggest consulting with someone who specializes in..."</p>
<p><strong>If you're partially informed:</strong> "I have some knowledge about this but I'm not an expert. Here's what I know, but you may want to verify..."</p>
<p><strong>Stay current:</strong> If you hold yourself out as expert in an area, maintain that expertise through continuing education.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Confidentiality</h2>
<p>Treat consultation information appropriately:</p>
<p><strong>Information shared with you in consultation should be protected.</strong> Don't discuss the case with others (unless seeking your own consultation).</p>
<p><strong>Consider whether identifying information is necessary.</strong> Sometimes you can consult using "a client of mine" without revealing details.</p>
<p><strong>Clarify expectations:</strong> "I'll keep what you share with me confidential, just as I would client information."</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Conflicts of Interest</h2>
<p>Avoid consulting when you have conflicts:</p>
<p><strong>Personal relationships:</strong> Don't consult for close friends or family members on professional matters—the dual relationship compromises your objectivity.</p>
<p><strong>Financial interests:</strong> If you have financial interest in a particular recommendation, disclose it or decline.</p>
<p><strong>Prior relationships with the client:</strong> If you know the client, you may have biases that affect your consultation.</p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>Boundaries</h2>
<p>Maintain appropriate consultant boundaries:</p>
<p><strong>Don't become the consultee's therapist:</strong> If personal issues are affecting their clinical work, encourage them to seek their own therapy.</p>
<p><strong>Don't create dependency:</strong> Help consultees develop their own judgment rather than relying on you for all decisions.</p>
<p><strong>Don't take over cases:</strong> The client remains the consultee's client. You're not a shadow therapist.</p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>✅ Knowledge Check: Module 3</h2>
<ol>
<li>When providing consultation, the consultant should:</li>
<p>a) Take over decision-making for the consultee b) Help the consultee think through the issue while respecting their autonomy c) Always give a definitive answer d) Share the case with other colleagues for input</p>
</ol>
<ol>
<li>If a consultee asks about an area outside your expertise:</li>
<p>a) Provide the best answer you can anyway b) Acknowledge the limit and suggest appropriate resources c) Decline to help at all d) Research the answer before the next meeting</p>
</ol>
<ol>
<li>When consultees don't follow your recommendations:</li>
<p>a) Refuse to consult with them in the future b) Recognize they retain autonomy while considering follow-up c) Report them to their licensing board d) Contact the client directly</p>
</ol>
<ol>
<li>Good consultation involves:</li>
<p>a) Telling the consultee exactly what to do b) Asking before telling and sharing thinking, not just conclusions c) Providing as much advice as possible d) Avoiding any uncertainty</p>
</ol>
<ol>
<li>Ethical considerations when providing consultation include:</li>
<p>a) Consulting on any topic regardless of expertise b) Maintaining competence boundaries and treating information confidentially c) Developing dependency in consultees d) Taking over cases that seem interesting</p>
</ol>`,
            },
{
              type: "text",
              order: 27,
              content: `<h2>Advanced Consultation Topics</h2>`,
            },
{
              type: "text",
              order: 28,
              content: `<h2>Consultation vs. Cotherapy</h2>
<p>Sometimes what looks like consultation is actually cotherapy or collaborative treatment:</p>
<p><strong>Consultation:</strong> One clinician seeks input from another. The consultant doesn't have a treatment relationship with the client.</p>
<p><strong>Cotherapy:</strong> Two clinicians jointly treat the same client. Both have direct treatment relationships.</p>
<p><strong>Collaborative treatment:</strong> Multiple clinicians each provide different services to the same client (e.g., you do therapy, psychiatrist does medication). Each has a treatment relationship, but you coordinate.</p>
<p><strong>Why the distinction matters:</strong></p>
<ul>
<li>Different ethical obligations apply</li>
<li>Liability differs</li>
<li>Documentation requirements vary</li>
<li>Client consent needs differ</li>
</ul>`,
            },
{
              type: "text",
              order: 29,
              content: `<h2>Consultation About Legal Issues</h2>
<p>When legal issues arise (potential complaints, subpoenas, lawsuits):</p>
<p><strong>Know the limits of consultation:</strong> Colleagues can provide perspective, but legal questions require legal advice.</p>
<p><strong>When to consult an attorney:</strong></p>
<ul>
<li>You've received a subpoena or court order</li>
<li>A client threatens or files a complaint</li>
<li>You're uncertain about reporting requirements</li>
<li>Dual relationship or boundary issues have legal implications</li>
<li>You're considering terminating a high-risk client</li>
</ul>
<p><strong>Insurance resources:</strong> Your malpractice insurance often includes access to legal consultation. Use it.</p>`,
            },
{
              type: "text",
              order: 30,
              content: `<h2>Consultation for Ethical Decision-Making</h2>
<p>Ethical dilemmas often lack clear answers. Consultation helps you think through options:</p>
<p><strong>Framework for ethical consultation:</strong></p>
<ol>
<li><strong>Identify the ethical issue:</strong> What principles or standards seem to be in conflict?</li>
</ol>
<ol>
<li><strong>Gather information:</strong> What facts are relevant? What's unclear?</li>
</ol>
<ol>
<li><strong>Consider stakeholders:</strong> Who's affected? What are their interests?</li>
</ol>
<ol>
<li><strong>Generate options:</strong> What could you do? List multiple possibilities.</li>
</ol>
<ol>
<li><strong>Evaluate options:</strong> What are the likely consequences of each? Which best honors ethical principles?</li>
</ol>
<ol>
<li><strong>Consult:</strong> Get input on your analysis and options.</li>
</ol>
<ol>
<li><strong>Decide and document:</strong> Make a decision, implement it, and document your reasoning.</li>
</ol>
<ol>
<li><strong>Evaluate outcomes:</strong> Was the decision effective? What would you do differently?</li>
</ol>`,
            },
{
              type: "text",
              order: 31,
              content: `<h2>Consultation Across Jurisdictions</h2>
<p>When you or your consultant are licensed in different states:</p>
<p><strong>Know jurisdictional rules:</strong> Some states have specific requirements about who can provide supervision or consultation.</p>
<p><strong>Telehealth complications:</strong> If you see clients across state lines, consultation may need to account for multiple jurisdictions' standards.</p>
<p><strong>Standard of care varies:</strong> What's considered appropriate practice may differ by location.</p>`,
            },
{
              type: "text",
              order: 32,
              content: `<h2>📋 Reflection Exercise: Your Consultation Practice</h2>
<p>Consider your current consultation practices:</p>
<p><strong>When I last sought consultation, it was for:</strong> _________________________________</p>
<p><strong>What made that consultation helpful (or not):</strong> _________________________________</p>
<p><strong>When I last provided consultation, it was about:</strong> _________________________________</p>
<p><strong>What I do well as a consultant:</strong> _________________________________</p>
<p><strong>What I could improve as a consultant:</strong> _________________________________</p>
<p><strong>Consultation relationship I want to develop:</strong> _________________________________</p>
<ol>
<li>When providing consultation, effective consultants:</li>
<p>a) Give definitive answers immediately b) Take over decision-making for the consultee c) Ask before telling and respect consultee autonomy d) Avoid acknowledging uncertainty</p>
</ol>
<ol>
<li>If asked to consult on a case outside your expertise, you should:</li>
<p>a) Provide consultation anyway to be helpful b) Acknowledge the limits of your expertise and suggest appropriate resources c) Refuse to discuss the case at all d) Research the topic and then provide consultation</p>
</ol>
<ol>
<li>The primary ethical responsibility when providing consultation is:</li>
<p>a) Solving the consultee's problem b) Maintaining appropriate boundaries and competence c) Building a consultation practice d) Documenting everything extensively</p>
</ol>`,
            }
      ]
    },
    {
      order: 4,
      title: `Module 4: THE ART OF ETHICAL REFERRAL`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 4: THE ART OF ETHICAL REFERRAL`,
              subtitle: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
              sectionNumber: 4,
            },
{
              type: "text",
              order: 2,
              content: `<h2>🎯 Module Learning Objectives</h2>
<p>By the end of this module, participants will be able to:</p>
<ol>
<li>Identify when referral is indicated</li>
<li>Navigate referral conversations with clients</li>
<li>Implement warm handoff techniques</li>
<li>Maintain appropriate involvement through transitions</li>
</ol>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>When to Refer</h2>
<p>Referral is indicated when:</p>
<p><strong>Scope of competence:</strong> The client needs services outside your expertise. A client needs EMDR and you're not trained. A client needs psychological testing you can't provide.</p>
<p><strong>Level of care:</strong> The client needs a higher or different level of care than you can provide—residential treatment, intensive outpatient, medication management.</p>
<p><strong>Practical limitations:</strong> You lack availability, or the client's location, finances, or insurance requires different resources.</p>
<p><strong>Client welfare:</strong> Continued treatment with you isn't serving the client's best interests—perhaps due to therapeutic impasse, client request, or recognition of better fit elsewhere.</p>
<p><strong>Ethical conflicts:</strong> The situation creates ethical conflicts that cannot be resolved while continuing treatment.</p>
<p>The ACA Code of Ethics (A.11.b) states: "If counselors determine an inability to be of professional assistance to clients, they avoid entering or continuing counseling relationships."</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>🎭 Clinical Vignette: When to Refer?</h2>
<p>You've been seeing Amanda for three months for depression. Despite good rapport and consistent attendance, her symptoms aren't improving. Her PHQ-9 has actually increased from 14 to 17. She mentions she hasn't been sleeping and her appetite is very poor.</p>
<p><strong>Decision Point:</strong> What should you do?</p>
<p><strong>Option A:</strong> Continue the same approach—it just needs more time <strong>Option B:</strong> Refer for medication evaluation while continuing therapy <strong>Option C:</strong> Refer to a different therapist <strong>Option D:</strong> Intensify treatment (increase session frequency)</p>
<p><strong>Discussion:</strong></p>
<p><strong>Option B is most appropriate.</strong> The combination of worsening symptoms, vegetative signs (sleep, appetite), and lack of response to therapy alone suggests medication evaluation is warranted. This is a referral for additional services, not termination.</p>
<p><strong>Key principle:</strong> Referral doesn't mean ending the relationship—it means recognizing that the client needs something more or different than what you alone can provide.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>The Referral Conversation</h2>
<p>How you discuss referral matters enormously:</p>
<p><strong>Frame appropriately:</strong> "I want to make sure you're getting everything you need. I think adding X could help because..."</p>
<p><strong>Avoid rejection language:</strong> Not "I can't help you" but "I think you'd benefit from someone who specializes in..."</p>
<p><strong>Normalize:</strong> Referral isn't failure; it's appropriate care. "This is actually a sign that I'm paying attention to what you need."</p>
<p><strong>Provide specific resources:</strong> Don't just say "you should see a psychiatrist." Provide names, numbers, information about what to expect.</p>
<p><strong>Discuss transition:</strong> Will you continue seeing them during transition? Will you be available for consultation with the new provider?</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>🛠️ Skill Builder: Referral Language Practice</h2>
<p>Practice these referral conversation starters:</p>
<p><strong>For adding services (continuing your treatment):</strong> "I've been thinking about what might help you make more progress. I'd like to suggest we add [service] because [reason]. I'll continue seeing you, and this would be in addition to our work together."</p>
<p><strong>For specialized referral (transferring care):</strong> "I want to be honest with you about something. The issues you're dealing with really require specialized expertise in [area]. I've been thinking about who would be the best fit for you, and I'd like to recommend [name/practice]. This isn't because I don't care—it's because I do, and I want you to get the best possible help."</p>
<p><strong>For higher level of care:</strong> "I'm concerned about [specific concerns]. I think you need more support than once-weekly therapy can provide right now. Let's talk about [IOP/PHP/residential] options and how to make that happen."</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Warm Handoffs</h2>
<p>A "warm handoff" involves direct connection with the receiving provider, rather than just giving the client information:</p>
<p><strong>With client consent:</strong></p>
<ol>
<li>Contact the receiving provider directly</li>
<li>Introduce the client and their needs</li>
<li>Share relevant history and clinical information</li>
<li>Discuss any concerns or special considerations</li>
<li>Facilitate the client's first contact</li>
</ol>
<p><strong>Why it matters:</strong> Research shows warm handoffs dramatically increase follow-through compared to simply providing referral information. Clients are more likely to engage with providers when the transition is facilitated.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>📋 Reflection Exercise: Your Referral Network</h2>
<p><strong>Psychiatrists/Prescribers I can refer to:</strong> _________________________________</p>
<p><strong>Specialized therapists (trauma, eating disorders, substance use, etc.):</strong> _________________________________</p>
<p><strong>Higher levels of care (IOP, PHP, residential):</strong> _________________________________</p>
<p><strong>Testing/Assessment providers:</strong> _________________________________</p>
<p><strong>Community resources (support groups, social services):</strong> _________________________________</p>
<p><strong>Gaps I need to fill:</strong> _________________________________</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Following Up After Referral</h2>
<p>After making a referral:</p>
<p><strong>Follow up with the client:</strong> Did they connect with the resource? If not, explore barriers and problem-solve.</p>
<p><strong>Determine ongoing role:</strong> Will you continue treatment? Transfer care? Be available for consultation?</p>
<p><strong>Coordinate if continuing:</strong> If both you and the new provider will see the client, establish communication protocols.</p>
<p><strong>Document:</strong> Record the referral, reason, resources provided, and follow-up.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Understanding the Emotional Aspects of Referral</h2>
<p>Referral involves more than logistics—it carries emotional weight for both clinician and client.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>For Clients</h2>
<p><strong>Referral can trigger:</strong></p>
<ul>
<li>Feelings of rejection ("You're sending me away")</li>
<li>Shame ("I must be too much to handle")</li>
<li>Abandonment fears, especially for clients with attachment issues</li>
<li>Relief (sometimes mixed with guilt about feeling relieved)</li>
<li>Anxiety about starting over with someone new</li>
<li>Hope for new possibilities</li>
</ul>
<p><strong>How to address these emotions:</strong></p>
<ul>
<li>Acknowledge directly: "Some people feel rejected when a referral is suggested. I want you to know that's not what this is."</li>
<li>Provide rationale: "I'm suggesting this because I want you to get the best possible help, and that means someone who specializes in exactly what you're dealing with."</li>
<li>Maintain connection through transition when possible</li>
<li>Check in about feelings about the referral</li>
</ul>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>For Clinicians</h2>
<p><strong>Referral can trigger:</strong></p>
<ul>
<li>Feelings of failure ("I couldn't help this person")</li>
<li>Guilt ("Am I abandoning them?")</li>
<li>Relief (followed by guilt about feeling relieved)</li>
<li>Pride (when recognizing limits appropriately)</li>
</ul>
<p><strong>Healthy perspective:</strong> Referral isn't failure—it's appropriate care. Recognizing limits is ethical, not inadequate. Sometimes the most helpful thing we can do is connect someone with someone better suited to their needs.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>🎭 Clinical Vignette: Handling the Emotional Aspects of Referral</h2>
<p><strong>Case:</strong> You've been seeing Amanda for six months for anxiety. Despite good rapport and her consistent attendance, progress has been minimal. You've recently concluded that her symptoms may be better explained by OCD, which requires specialized ERP treatment you don't provide. You need to refer to an OCD specialist.</p>
<p><strong>Decision Point:</strong> How do you frame this referral conversation?</p>
<p><strong>Poor approach:</strong> "I don't think I can help you anymore. You should see an OCD specialist."</p>
<p><strong>Better approach:</strong> "Amanda, I want to talk with you about something I've been thinking about. Over these six months, I've come to understand your experience better, and I think what we're dealing with might be OCD rather than general anxiety. If that's the case—and I think it is—there's a really effective treatment called ERP, but it's specialized work that I'm not trained in. I want to connect you with someone who is, because you deserve the treatment most likely to help. This isn't about me not caring or not wanting to work with you—it's about getting you the right help. How does that land for you?"</p>
<p><strong>Follow-up:</strong> "I'm curious what feelings come up when I say this. Some people feel like they're being passed along or rejected. I want us to be able to talk about that."</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Referral Resources: Building Your Network</h2>
<p>Effective referral requires knowing where to send people. Build your referral network proactively, not in crisis.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Types of Resources to Develop</h2>
<p><strong>Psychiatrists and prescribers:</strong></p>
<ul>
<li>Adult psychiatrists</li>
<li>Child/adolescent psychiatrists</li>
<li>Psychiatric nurse practitioners</li>
<li>Primary care providers willing to prescribe psychiatric medications</li>
</ul>
<p><strong>Specialized therapists:</strong></p>
<ul>
<li>Trauma specialists (EMDR, CPT, PE trained)</li>
<li>OCD and anxiety specialists (ERP trained)</li>
<li>Eating disorder specialists</li>
<li>Substance abuse counselors</li>
<li>Sex therapists</li>
<li>Child and adolescent specialists</li>
<li>Couples and family therapists</li>
<li>DBT providers</li>
</ul>
<p><strong>Higher levels of care:</strong></p>
<ul>
<li>Intensive outpatient programs (IOP)</li>
<li>Partial hospitalization programs (PHP)</li>
<li>Residential treatment centers</li>
<li>Inpatient psychiatric facilities</li>
</ul>
<p><strong>Testing and evaluation:</strong></p>
<ul>
<li>Psychological testing (learning disabilities, ADHD, autism, personality assessment)</li>
<li>Neuropsychological testing</li>
<li>Medical evaluation resources</li>
</ul>
<p><strong>Community resources:</strong></p>
<ul>
<li>Support groups (AA, NAMI, grief groups, etc.)</li>
<li>Crisis lines and services</li>
<li>Social services (housing, food, financial assistance)</li>
<li>Victim advocacy services</li>
<li>Legal resources</li>
</ul>
<p><strong>Peer support:</strong></p>
<ul>
<li>Peer support specialists</li>
<li>Recovery coaches</li>
<li>Mentoring programs</li>
</ul>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Maintaining Your Network</h2>
<p><strong>Keep information current:</strong> Providers move, change insurance panels, and close practices. Update your referral list regularly.</p>
<p><strong>Know your resources personally when possible:</strong> A personal connection makes warm handoffs easier and gives you real knowledge about the provider's style and approach.</p>
<p><strong>Get feedback:</strong> Follow up with clients about referral experiences. This helps you learn which providers are actually effective and a good fit for different presentations.</p>
<p><strong>Diversify:</strong> Have multiple options for common referral needs so you're not stuck if one provider isn't available or isn't a good fit.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>🛠️ Skill Builder: Referral Network Assessment</h2>
<p>Assess your current referral network. Rate each category (1 = no resources, 5 = multiple trusted options):</p><table class="cr-table">
<tr><th>Resource Type</th><th>Rating</th><th>Notes/Names</th></tr>
<tr><td>Psychiatrists (adult)</td><td></td><td></td></tr>
<tr><td>Child psychiatrists</td><td></td><td></td></tr>
<tr><td>Trauma specialists</td><td></td><td></td></tr>
<tr><td>Substance abuse</td><td></td><td></td></tr>
<tr><td>Eating disorders</td><td></td><td></td></tr>
<tr><td>Testing/evaluation</td><td></td><td></td></tr>
<tr><td>IOP programs</td><td></td><td></td></tr>
<tr><td>Crisis services</td><td></td><td></td></tr>
<tr><td>Support groups</td><td></td><td></td></tr>
<tr><td>Social services</td><td></td><td></td></tr>
</table><p><strong>Gaps to address:</strong> _________________________________</p>
<p><strong>First step to fill gaps:</strong> _________________________________</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>✅ Knowledge Check: Module 4</h2>
<ol>
<li>According to the ACA Code of Ethics, counselors should refer when:</li>
<p>a) They find the client difficult b) They determine an inability to be of professional assistance c) The client requests any new service d) Another provider requests the transfer</p>
</ol>
<ol>
<li>A "warm handoff" involves:</li>
<p>a) Giving the client a phone number and hoping they call b) Direct contact with the receiving provider to facilitate transition c) Waiting for the client to make the connection d) Transferring records without discussion</p>
</ol>
<ol>
<li>When discussing referral with a client, you should:</li>
<p>a) Frame it as the client's failure b) Be vague about the reasons c) Provide specific resources and discuss the transition d) End the session immediately after mentioning referral</p>
</ol>`,
            }
      ]
    },
    {
      order: 5,
      title: `Module 5: COORDINATING CARE ACROSS PROVIDERS`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 5: COORDINATING CARE ACROSS PROVIDERS`,
              subtitle: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
              sectionNumber: 5,
            },
{
              type: "text",
              order: 2,
              content: `<h2>🎯 Module Learning Objectives</h2>
<p>By the end of this module, participants will be able to:</p>
<ol>
<li>Identify when care coordination is needed</li>
<li>Obtain and use appropriate releases of information</li>
<li>Communicate effectively with different types of providers</li>
<li>Navigate multi-system involvement effectively</li>
<li>Manage disagreements between providers constructively</li>
<li>Maintain the therapeutic role while coordinating care</li>
<li>Document coordination activities appropriately</li>
</ol>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>The Need for Coordination</h2>
<p>Many clients see multiple providers simultaneously. A single client might interact with:</p>
<p><strong>Mental health providers:</strong></p>
<ul>
<li>Individual therapist (you)</li>
<li>Psychiatrist for medication management</li>
<li>Group therapist</li>
<li>Substance abuse counselor</li>
<li>Previous therapist they're transitioning from</li>
</ul>
<p><strong>Medical providers:</strong></p>
<ul>
<li>Primary care physician</li>
<li>Specialists (pain management, endocrinology, neurology, rheumatology)</li>
<li>Physical therapists and occupational therapists</li>
<li>Visiting nurses or home health aides</li>
</ul>
<p><strong>Social service systems:</strong></p>
<ul>
<li>Case managers</li>
<li>Housing assistance programs</li>
<li>Food assistance programs</li>
<li>Vocational rehabilitation</li>
<li>Disability determination services</li>
</ul>
<p><strong>Educational systems (for children/families):</strong></p>
<ul>
<li>School counselors</li>
<li>Special education coordinators</li>
<li>School psychologists</li>
<li>Teachers and administrators</li>
</ul>
<p><strong>Legal and justice systems:</strong></p>
<ul>
<li>Courts (family, criminal, civil)</li>
<li>Probation and parole officers</li>
<li>Attorneys</li>
<li>Child protective services</li>
<li>Victim advocates</li>
</ul>
<p><strong>Community resources:</strong></p>
<ul>
<li>Peer support specialists</li>
<li>Recovery coaches</li>
<li>Support group facilitators</li>
<li>Family members providing care</li>
</ul>
<p>Without coordination, care fragments in predictable ways:</p>
<p><strong>Information gaps:</strong> Provider A doesn't know what Provider B is doing. Important history isn't shared. Patterns that are obvious when you see the whole picture are invisible when each provider only sees their piece.</p>
<p><strong>Contradictory recommendations:</strong> The therapist emphasizes approach-based coping; the doctor says to avoid stressful situations. The substance counselor recommends AA meetings; the anxiety therapist worries group settings trigger panic.</p>
<p><strong>Redundant efforts:</strong> Multiple providers assess the same issues, ask the same questions, repeat the same psychoeducation. The client is exhausted by repetitive processes.</p>
<p><strong>Gaps in care:</strong> Each provider assumes someone else is handling a particular issue. The depression gets treated, but nobody is addressing the sleep apnea that's maintaining it.</p>
<p><strong>Client burden:</strong> The client becomes the sole coordinator of their own care, responsible for communicating between providers and resolving conflicts—often beyond client capacity when they're unwell.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Principles of Effective Coordination</h2>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Client-Centered</h2>
<p>The client's needs, preferences, and goals drive coordination efforts. Include the client in coordination decisions when possible. Respect autonomy regarding what gets shared with whom.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Role-Respecting</h2>
<p>Each provider has a defined role and scope. Know your piece of the puzzle. Respect others' expertise. Don't over-function or under-function.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Clear and Timely</h2>
<p>Communicate clearly without jargon. Share information when it's relevant—immediately for safety concerns, on a regular schedule for routine updates. Follow through on commitments.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Documented</h2>
<p>Record communications appropriately. Keep releases current. Protect confidentiality while sharing what's necessary.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Releases of Information</h2>
<p>Coordination requires appropriate releases:</p>
<p><strong>Obtain proper authorization:</strong> Written releases meeting HIPAA and state requirements.</p>
<p><strong>Specify scope:</strong> What information can be shared? With whom? For what purpose? For how long?</p>
<p><strong>Clarify direction:</strong> Is the release for you to share information, to receive information, or both?</p>
<p><strong>Renew as needed:</strong> Releases expire. Maintain current authorizations.</p>
<p><strong>Model release elements:</strong></p>
<ul>
<li>Client name and identifying information</li>
<li>Your name and contact information</li>
<li>Recipient name and contact information</li>
<li>Purpose of disclosure</li>
<li>Specific information authorized for release</li>
<li>Expiration date</li>
<li>Client signature and date</li>
<li>Witness signature if required</li>
</ul>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Common Release Mistakes</h2>
<p><strong>Overly broad releases:</strong> "I authorize release of all my medical records" may share more than intended and doesn't clearly identify to whom. Be specific.</p>
<p><strong>Missing expiration dates:</strong> Releases should have clear expiration dates. Don't use releases that have expired.</p>
<p><strong>One-way when you need two-way:</strong> Make sure the release covers both sending and receiving information if you need both.</p>
<p><strong>Missing signature or date:</strong> Incomplete releases aren't valid.</p>
<p><strong>Forgetting to obtain releases proactively:</strong> Don't wait until you urgently need to communicate. Get releases at intake for likely coordination needs.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Communicating with Different Provider Types</h2>
<p>Different providers have different communication cultures. Adapt your approach.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Communicating with Psychiatrists</h2>
<p><strong>What they need:</strong></p>
<ul>
<li>Relevant symptom information (current and changes)</li>
<li>Response to current medications (side effects, effectiveness)</li>
<li>Safety concerns</li>
<li>Treatment compliance issues</li>
<li>Anything affecting medical decision-making</li>
</ul>
<p><strong>Communication style:</strong></p>
<ul>
<li>Brief and focused</li>
<li>Use appropriate clinical terminology</li>
<li>Lead with most important information</li>
<li>Be specific about what you're asking or sharing</li>
<li>Respect their time constraints</li>
</ul>
<p><strong>Sample communication:</strong> "Dr. Johnson, I'm writing to update you on Sarah Thompson (DOB XX/XX). She's been my therapy client for 6 months. Over the past 3 weeks, I've observed increased psychomotor agitation, pressured speech, and decreased sleep (3-4 hours/night). She reports feeling 'amazing' despite concerning behaviors. Given this presentation, I wanted to ensure you were aware before her appointment with you next week. Happy to discuss by phone if helpful. [Contact info]"</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Communicating with Primary Care Physicians</h2>
<p><strong>What they need:</strong></p>
<ul>
<li>Mental health symptoms affecting overall health</li>
<li>Medication concerns (especially if you recommend they discuss with PCP)</li>
<li>Physical symptoms the client has mentioned</li>
<li>Coordination regarding referrals they've made</li>
</ul>
<p><strong>Communication style:</strong></p>
<ul>
<li>Very brief—PCPs have extremely limited time</li>
<li>Focus on what directly affects their care</li>
<li>Don't assume they understand mental health terminology</li>
<li>Be clear about what action, if any, you're requesting</li>
</ul>
<p><strong>Sample communication:</strong> "Dr. Lee, I'm providing mental health treatment to your patient John Davis. John mentioned he's been experiencing significant fatigue and weight gain that started around the time of his antidepressant change 2 months ago. He asked me to let you know. He's scheduled to see you next Tuesday. Please feel free to contact me with questions."</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Communicating with Schools</h2>
<p><strong>What they need:</strong></p>
<ul>
<li>Information relevant to educational functioning</li>
<li>Recommendations for accommodations</li>
<li>Updates on treatment progress relevant to school performance</li>
<li>Safety concerns</li>
</ul>
<p><strong>Communication style:</strong></p>
<ul>
<li>Avoid clinical jargon—write for educators, not clinicians</li>
<li>Focus on functional implications and specific recommendations</li>
<li>Be careful about diagnosis—share what's needed, not more</li>
<li>Understand FERPA requirements as well as HIPAA</li>
</ul>
<p><strong>Sample accommodation letter:</strong> "This letter confirms that Emma Sanchez is receiving mental health treatment for symptoms that affect her academic functioning. Based on her treatment, I recommend the following accommodations: [specific recommendations]. I'm available to participate in a 504 meeting or IEP conference if helpful."</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Communicating with Courts and Legal Systems</h2>
<p><strong>What they need:</strong></p>
<ul>
<li>Court-ordered evaluations or updates</li>
<li>Treatment attendance and compliance</li>
<li>Progress toward court-mandated goals</li>
<li>Safety assessments when ordered</li>
</ul>
<p><strong>Communication style:</strong></p>
<ul>
<li>Extremely careful—legal documentation has legal consequences</li>
<li>Factual and behavioral (what you observed, not interpretations)</li>
<li>Answer only what's asked—don't volunteer additional information</li>
<li>Distinguish fact from opinion clearly</li>
<li>Have the client sign release specifically for court communication</li>
</ul>
<p><strong>Important cautions:</strong></p>
<ul>
<li>Know the limits of your role—you're the treating clinician, not a forensic evaluator</li>
<li>Be careful about predictions (dangerousness, recidivism, custody recommendations)</li>
<li>Document what you share</li>
<li>Consider consulting an attorney when unsure</li>
</ul>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Communicating with Child Protective Services</h2>
<p><strong>What they need:</strong></p>
<ul>
<li>Safety information about children</li>
<li>Parent functioning related to child safety</li>
<li>Treatment compliance with CPS-mandated services</li>
<li>Progress toward reunification or other CPS goals</li>
</ul>
<p><strong>Communication style:</strong></p>
<ul>
<li>Focus on safety and functioning</li>
<li>Be behavioral and specific</li>
<li>Know your mandatory reporting obligations</li>
<li>Clarify your role—you're not an extension of CPS; you're the client's therapist</li>
</ul>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>🛠️ Skill Builder: Provider Communication Templates</h2>
<p>Practice adapting communication for different audiences. For the same client situation (adult client with depression who's been missing work and has mentioned suicidal thoughts that have now resolved):</p>
<p><strong>To psychiatrist:</strong> _________________________________ _________________________________ _________________________________</p>
<p><strong>To primary care physician:</strong> _________________________________ _________________________________ _________________________________</p>
<p><strong>To employer's EAP (if requested by client):</strong> _________________________________ _________________________________ _________________________________</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>🎭 Clinical Vignette: Coordination Dilemma</h2>
<p>You're treating David for anxiety. His psychiatrist, whom you've never met, has just increased his benzodiazepine dosage—the third increase in two months. David mentions this casually. You have concerns about benzodiazepine dependence and think the psychiatrist should know David has a family history of substance abuse that he may not have disclosed.</p>
<p><strong>Decision Point:</strong> What do you do?</p>
<p><strong>Step 1:</strong> Check if you have a release to communicate with the psychiatrist. If not, obtain one from David.</p>
<p><strong>Step 2:</strong> With release in place, contact the psychiatrist. Focus on information sharing, not criticism: "I wanted to share some history that might be relevant to David's care. He mentioned his father had significant alcohol dependence. I wasn't sure if that had come up in your conversations."</p>
<p><strong>Step 3:</strong> Listen to the psychiatrist's perspective—they may have information you don't have, or a treatment rationale you're not aware of.</p>
<p><strong>Step 4:</strong> Document the communication and your clinical reasoning.</p>
<p><strong>Key principle:</strong> Coordinate, don't compete. Share information that improves care without criticizing colleagues or positioning yourself as right.</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Communicating with Different Provider Types</h2>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Communicating with Prescribers</h2>
<p>Coordination with psychiatrists and other prescribers is common and important:</p>
<p><strong>What to communicate:</strong></p>
<ul>
<li>Relevant therapy progress or setbacks</li>
<li>Client-reported observations about medication effects</li>
<li>Behaviors or symptoms affecting medication decisions</li>
<li>Safety concerns</li>
<li>Significant life events</li>
</ul>
<p><strong>What NOT to communicate:</strong></p>
<ul>
<li>Therapy content beyond what's necessary</li>
<li>Your opinions about medication choices unless asked</li>
<li>Criticism of medication management</li>
</ul>
<p><strong>Format:</strong> Brief, focused, respectful of prescriber's time</p>
<p><strong>Sample communication:</strong> "Dr. Singh—I wanted to update you on Leticia's progress. She reports the Lexapro increase has helped her mood somewhat, though she's still struggling with motivation and sleep. We've been working on behavioral activation and coping strategies. Please let me know if there's anything helpful I should be aware of. Thanks, [Your name]"</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Communicating with Medical Providers</h2>
<p>Primary care doctors and specialists may have limited mental health training. Adapt your communication accordingly:</p>
<p><strong>Be concrete:</strong> Avoid jargon. Describe behaviors and functioning rather than using diagnostic labels only.</p>
<p><strong>Be brief:</strong> Medical providers have limited time. Get to the point.</p>
<p><strong>Be relevant:</strong> Focus on information that affects their medical care of the client.</p>
<p><strong>Offer collaboration:</strong> "Please let me know if there are ways I can support your treatment of [client]."</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Communicating with Case Managers and Social Services</h2>
<p>Case managers coordinate practical resources. Your communication supports their work:</p>
<p><strong>Focus on functioning:</strong> What can the client do? What do they need support with?</p>
<p><strong>Provide documentation when appropriate:</strong> Letters confirming treatment engagement, documentation for benefits applications.</p>
<p><strong>Understand their constraints:</strong> Case managers often have high caseloads and limited resources. Be realistic about what they can provide.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Communicating with Schools</h2>
<p>When treating children and adolescents, school coordination is essential:</p>
<p><strong>Know the law:</strong> FERPA vs. HIPAA have different requirements.</p>
<p><strong>Clarify who needs what:</strong> The school counselor may need different information than the classroom teacher.</p>
<p><strong>Support accommodations:</strong> Understand IEPs and 504 plans and how your treatment relates.</p>
<p><strong>Advocate appropriately:</strong> Sometimes your role includes advocating for appropriate school response to student needs.</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Communicating with Legal Systems</h2>
<p>Legal involvement adds complexity:</p>
<p><strong>Clarify your role:</strong> Are you a treating clinician or a forensic evaluator? What can and can't you provide to the court?</p>
<p><strong>Know confidentiality limits:</strong> What are the reporting requirements and subpoena vulnerabilities in legal contexts?</p>
<p><strong>Be careful with documentation:</strong> Records may be subpoenaed. Document with awareness that others may read your notes.</p>
<p><strong>Consider consultation:</strong> Legal contexts often warrant consultation with attorneys familiar with mental health law.</p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>🛠️ Skill Builder: Care Coordination Communication Template</h2>
<p>When contacting another provider:</p>
<p><strong>Introduction:</strong> "Hi, this is [name], [credential]. I'm the outpatient therapist for [client], who I believe you're also seeing for [their service]."</p>
<p><strong>Purpose:</strong> "I'm reaching out to coordinate care. [Client] has signed a release for us to communicate."</p>
<p><strong>Information sharing:</strong> "I wanted to share [relevant information] and to learn [what you need to know from them]."</p>
<p><strong>Coordination planning:</strong> "How would you like to stay in touch about [client]'s care? Would [frequency/method] work for you?"</p>
<p><strong>Closing:</strong> "Thank you for taking the time. Feel free to reach out if you have questions or concerns."</p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>What to Communicate</h2>
<p>Share information relevant to coordinated care:</p>
<ul>
<li>Treatment focus and goals</li>
<li>Relevant history affecting current treatment</li>
<li>Current interventions and approaches</li>
<li>Safety concerns</li>
<li>Medication information when relevant</li>
<li>Progress and challenges</li>
</ul>
<p><strong>Don't share:</strong> Unnecessary personal details. Clients consent to coordination, not gossip.</p>`,
            },
{
              type: "text",
              order: 27,
              content: `<h2>Managing Provider Disagreements</h2>
<p>Providers sometimes disagree about treatment approaches. When this happens:</p>
<p><strong>Focus on client welfare:</strong> The client's best interest is the guiding principle.</p>
<p><strong>Seek to understand:</strong> Before assuming the other provider is wrong, learn their reasoning. They may have information you lack.</p>
<p><strong>Look for common ground:</strong> Even when approaches differ, goals often align. Build from shared objectives.</p>
<p><strong>Communicate directly:</strong> Talk with the other provider, not just through the client.</p>
<p><strong>Involve the client appropriately:</strong> Major treatment decisions should include the client's perspective.</p>
<p><strong>Document:</strong> Document disagreements, reasoning, and resolutions.</p>`,
            },
{
              type: "text",
              order: 28,
              content: `<h2>🎭 Clinical Vignette: Managing Provider Disagreement</h2>
<p>You're treating Maria for depression using CBT. Her psychiatrist calls to say he thinks Maria needs trauma-focused therapy (EMDR) instead of CBT, and he's concerned you're avoiding the trauma work.</p>
<p><strong>Decision Point:</strong> How do you respond?</p>
<p><strong>Poor response:</strong> "I'm the therapist. I know what she needs."</p>
<p><strong>Better response:</strong> "I appreciate you reaching out. Can you tell me more about your concerns? I'd like to understand your perspective."</p>
<p>After listening: "That's helpful. I've been building stabilization skills before addressing the trauma directly—Maria dissociates easily and I've been concerned about her window of tolerance. But I hear your concern that we may be avoiding the core issue. Could we have a three-way conversation with Maria about the treatment plan?"</p>
<p><strong>Key principles:</strong></p>
<ul>
<li>Listen before defending</li>
<li>Share your clinical reasoning</li>
<li>Involve the client in major decisions</li>
<li>Seek collaborative solutions</li>
</ul>`,
            },
{
              type: "text",
              order: 29,
              content: `<h2>✅ Knowledge Check: Module 5</h2>
<p><strong>Information sharing:</strong> "I wanted to share [relevant information] and to learn [what you need to know from them]."</p>
<p><strong>Coordination planning:</strong> "How would you like to stay in touch about [client]'s care? Would [frequency/method] work for you?"</p>
<p><strong>Closing:</strong> "Thank you for taking the time. Feel free to reach out if you have questions or concerns."</p>`,
            },
{
              type: "text",
              order: 30,
              content: `<h2>Managing Provider Disagreements</h2>
<p>Providers sometimes disagree about treatment approaches. When this happens:</p>
<p><strong>Focus on client welfare:</strong> The client's best interest is the guiding principle.</p>
<p><strong>Seek to understand:</strong> Ask about the other provider's reasoning. They may have information you lack.</p>
<p><strong>Look for common ground:</strong> Often disagreements are about approach, not goals. Find shared objectives.</p>
<p><strong>Clarify roles:</strong> Who is responsible for what? Different perspectives may reflect different roles.</p>
<p><strong>Facilitate direct communication:</strong> If possible, talk directly with the other provider rather than through the client.</p>
<p><strong>Involve the client appropriately:</strong> Major treatment decisions should include the client.</p>
<p><strong>Document:</strong> Document disagreements, reasoning, and resolutions.</p>`,
            },
{
              type: "text",
              order: 31,
              content: `<h2>🎭 Clinical Vignette: Provider Disagreement</h2>
<p>You're treating Maria for depression using CBT. Her psychiatrist calls to say he thinks Maria needs trauma-focused therapy (EMDR) instead of CBT, and he's concerned you're avoiding the trauma work.</p>
<p><strong>Decision Point:</strong> How do you respond?</p>
<p><strong>Poor response:</strong> "I'm the therapist. I know what she needs."</p>
<p><strong>Better response:</strong> "I appreciate you reaching out. Can you tell me more about your concerns? I'd like to understand your perspective."</p>
<p>After listening: "That's helpful. I've been building stabilization skills before addressing the trauma directly—Maria dissociates easily and I've been concerned about her window of tolerance. But I hear your concern that we may be avoiding the core issue. Could we have a three-way conversation with Maria about the treatment plan?"</p>
<p><strong>Key principles:</strong></p>
<ul>
<li>Listen before defending</li>
<li>Share your clinical reasoning</li>
<li>Involve the client in major decisions</li>
<li>Seek collaborative solutions</li>
</ul>`,
            },
{
              type: "text",
              order: 32,
              content: `<h2>✅ Knowledge Check: Module 5</h2>
<ol>
<li>Care coordination requires:</li>
<p>a) Verbal permission only b) Written releases meeting HIPAA requirements c) No permission if providers work in the same system d) Court orders</p>
</ol>
<ol>
<li>When communicating with other providers, you should share:</li>
<p>a) All information about the client b) Information relevant to coordinated care c) Your personal opinions about the client d) Only positive information</p>
</ol>
<ol>
<li>When providers disagree about treatment, the first step is:</li>
<p>a) Escalate to supervisors b) Seek to understand the other provider's reasoning c) Defer to the physician d) Ask the client to choose</p>
</ol>`,
            }
      ]
    },
    {
      order: 6,
      title: `Module 6: INTERDISCIPLINARY COLLABORATION`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 6: INTERDISCIPLINARY COLLABORATION`,
              subtitle: `It Takes a Village: Consultation Referral and Collaborative Care in Counseling Practice`,
              sectionNumber: 6,
            },
{
              type: "text",
              order: 2,
              content: `<h2>🎯 Module Learning Objectives</h2>
<p>By the end of this module, participants will be able to:</p>
<ol>
<li>Understand different professional roles and scopes of practice</li>
<li>Communicate effectively across disciplines</li>
<li>Navigate team meetings effectively</li>
<li>Manage interprofessional tensions constructively</li>
<li>Contribute effectively to multidisciplinary treatment teams</li>
<li>Advocate for the counseling perspective within teams</li>
</ol>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>Understanding Different Disciplines</h2>
<p>Effective collaboration requires understanding different professional roles. Each discipline brings unique training, perspective, and scope of practice.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Mental Health Professions</h2>
<p><strong>Psychiatrists (MD/DO):</strong> Medical doctors with specialty training in psychiatry. They complete medical school plus residency in psychiatry. Scope includes psychiatric diagnosis, medication management, and sometimes psychotherapy. Medical perspective means attention to biological factors, medication interactions, and differential diagnosis of medical conditions presenting as psychiatric symptoms. They can order labs, imaging, and other medical tests. Often the highest-paid and scarcest mental health resource.</p>
<p><strong>Psychologists (PhD/PsyD):</strong> Doctoral-level training in psychology, typically 5-7 years post-bachelor's. Clinical psychologists are trained in assessment (psychological testing is unique to this scope), diagnosis, and psychotherapy. Research training varies (stronger in PhD programs). Some states allow prescribing with additional training. Strong training in evidence-based treatments and measurement of outcomes.</p>
<p><strong>Licensed Professional Counselors (LPC/LPCC/LCPC):</strong> Master's-level training in counseling (typically 60+ credit hours). Training emphasizes developmental perspective, wellness orientation, and therapeutic relationship. Scope includes assessment (not psychological testing), diagnosis, and psychotherapy. Often the most numerous mental health providers. Strong training in multicultural competence and advocacy.</p>
<p><strong>Clinical Social Workers (LCSW/LICSW):</strong> Master's-level training in social work with clinical concentration. Training emphasizes person-in-environment perspective, systems thinking, and social justice. Scope includes diagnosis, psychotherapy, and case management. Unique strength in understanding social systems, resources, and navigation. Often work in integrated healthcare settings.</p>
<p><strong>Marriage and Family Therapists (LMFT):</strong> Master's-level training specifically in family systems therapy. Training emphasizes relational and systemic perspective—seeing problems in context of relationships and systems. Scope includes diagnosis and psychotherapy with individuals, couples, and families. Unique strength in working with relationship dynamics.</p>
<p><strong>Psychiatric Nurse Practitioners (PMHNP):</strong> Nursing background (BSN) plus advanced practice nursing degree with psychiatric specialization. Can prescribe medications. Often more accessible than psychiatrists with shorter wait times. May provide therapy in addition to medication management. Nursing perspective emphasizes holistic health and patient education.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Allied Professionals</h2>
<p><strong>Case Managers:</strong> Varied backgrounds (often bachelor's-level social work or human services). Focus on coordinating services, connecting to resources, and helping clients navigate systems. Do not provide therapy but essential for clients with complex practical needs.</p>
<p><strong>Peer Support Specialists:</strong> Individuals with lived experience of mental health or substance use challenges who provide support to others. Unique perspective of "I've been there." Growing evidence base for effectiveness. Work alongside professional providers.</p>
<p><strong>Substance Abuse Counselors (CADC/CASAC):</strong> Certification typically requires specific addiction coursework and supervised experience. May or may not have master's degree. Specialized expertise in addiction treatment. May use different models (12-step, harm reduction) than traditional mental health providers.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>💡 Discipline Comparison: Same Client, Different Lenses</h2>
<p><strong>Client:</strong> James, 35, presenting with depression, anxiety, relationship problems, and job stress.</p>
<p><strong>Psychiatrist perspective:</strong> "What's his sleep architecture like? Any medical conditions that could cause fatigue? Family history of mood disorders? Let's consider whether an SSRI might help while he engages in therapy."</p>
<p><strong>Psychologist perspective:</strong> "What do the assessment measures show about severity and specific symptom patterns? What evidence-based protocols match his presentation? How do we measure progress objectively?"</p>
<p><strong>Counselor perspective:</strong> "What's his developmental history? What strengths does he bring? What meaning is he making of these struggles? How can I use our relationship to facilitate growth?"</p>
<p><strong>Social worker perspective:</strong> "What's happening in his environment? Are there practical stressors we need to address? What resources might help? What systemic barriers is he facing?"</p>
<p><strong>MFT perspective:</strong> "What's happening in his relationships? How does his family system contribute to these patterns? Would couples or family work be beneficial?"</p>
<p><strong>Each perspective is valid.</strong> Comprehensive care often benefits from multiple lenses seeing the same client.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Communication Across Disciplines</h2>
<p>Different disciplines have different languages, cultures, and communication norms. Effective cross-disciplinary communication requires adaptation.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Adapting Your Communication Style</h2>
<p><strong>To medical providers (psychiatrists, physicians):</strong></p>
<ul>
<li>Be concise and factual</li>
<li>Use diagnostic terminology they recognize</li>
<li>Focus on symptoms, functioning, and treatment response</li>
<li>Don't be offended by brief responses—they're busy</li>
<li>Provide specific data (symptom scores, frequency, duration)</li>
</ul>
<p><strong>To psychologists:</strong></p>
<ul>
<li>Comfortable with technical clinical language</li>
<li>Appreciate evidence and data</li>
<li>May want to discuss conceptualization and assessment</li>
<li>Often interested in treatment protocols being used</li>
</ul>
<p><strong>To social workers:</strong></p>
<ul>
<li>Systems language resonates</li>
<li>Interested in environmental factors</li>
<li>Comfortable with advocacy discussion</li>
<li>May focus on practical resources and barriers</li>
</ul>
<p><strong>To case managers:</strong></p>
<ul>
<li>Focus on practical functioning</li>
<li>What does the client need to succeed?</li>
<li>What are barriers to treatment adherence?</li>
<li>How can you support their coordination efforts?</li>
</ul>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Jargon Translation</h2>
<p>Terms may mean different things across disciplines:</p>
<p><strong>"Assessment":</strong> To a psychologist, often means psychological testing. To a counselor, often means clinical interview and evaluation. Clarify what you mean.</p>
<p><strong>"Diagnosis":</strong> Medical providers may focus on differential diagnosis and ruling out medical causes. Mental health providers may focus on DSM criteria. Some counselors avoid diagnostic language when possible.</p>
<p><strong>"Treatment":</strong> To a psychiatrist, often means medication. To a therapist, often means psychotherapy. Be specific about what you're providing.</p>
<p><strong>"Case management":</strong> Can mean different things in different settings. Clarify the specific services being provided.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>🎭 Clinical Vignette: Cross-Disciplinary Communication</h2>
<p><strong>Scenario:</strong> You need to communicate with Dr. Chen, a psychiatrist, about your shared client Sarah. You're concerned that Sarah isn't taking her medication as prescribed and that her depression symptoms are worsening.</p>
<p><strong>Ineffective communication:</strong> "Hi Dr. Chen, I wanted to touch base about Sarah. She's been having a really hard time lately, and I'm worried about her. She seems really down and isn't doing as well as she was. I think we might need to do something different. Let me know what you think!"</p>
<p><strong>Problems:</strong> Too vague. What specifically is happening? What are you asking for? What information does the psychiatrist need?</p>
<p><strong>Effective communication:</strong> "Dr. Chen, I'm writing to share some concerns about Sarah Johnson (DOB XX/XX/XX), whom I see weekly for individual therapy.</p>
<p><strong>Current status:</strong> Sarah's PHQ-9 increased from 12 to 19 over the past month. She reports low energy, sleep disruption (early morning awakening), decreased appetite, and passive suicidal ideation without plan or intent. Functionally, she's missed work twice and is struggling with daily activities.</p>
<p><strong>Medication concern:</strong> Sarah disclosed that she's been taking her Lexapro inconsistently—approximately every other day—due to concerns about sexual side effects. She hadn't mentioned this to you.</p>
<p><strong>Request:</strong> Given the symptom increase and adherence issues, I wanted you to be aware before her next appointment with you on [date]. Happy to discuss by phone if helpful.</p>
<p>Best, [Name, credentials, phone]"</p>
<p><strong>Why this works:</strong> Specific data. Clear observation about adherence. Explicit request. Efficient format.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Effective Team Meetings</h2>
<p>When participating in treatment team meetings or case conferences:</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Before the Meeting</h2>
<p><strong>Review the case:</strong> Know the current status, recent developments, and your questions/concerns.</p>
<p><strong>Prepare your contribution:</strong> What information do you have that others need? What input do you need from others?</p>
<p><strong>Know your role:</strong> Are you presenting the case? Contributing to discussion? Just listening and learning?</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>During the Meeting</h2>
<p><strong>Present efficiently:</strong> Use structured format. Brief background, current status, specific questions.</p>
<p><strong>Listen actively:</strong> You may learn information that changes your understanding.</p>
<p><strong>Ask questions:</strong> Clarify what you don't understand. Don't assume others' expertise.</p>
<p><strong>Share your perspective:</strong> You have valuable information. Don't defer entirely to others just because they have different credentials.</p>
<p><strong>Be collaborative, not competitive:</strong> The goal is best care for the client, not proving your worth.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>After the Meeting</h2>
<p><strong>Clarify action items:</strong> Who is doing what by when?</p>
<p><strong>Document:</strong> Record decisions and your role in implementing them.</p>
<p><strong>Follow through:</strong> Do what you committed to do.</p>
<p><strong>Communicate outcomes:</strong> If you agreed to try something and it worked (or didn't), let the team know.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>🛠️ Skill Builder: Team Meeting Preparation</h2>
<p>For your next team meeting or case consultation, prepare using this structure:</p>
<p><strong>Case:</strong> (2-3 sentences of context) _________________________________</p>
<p><strong>Current status:</strong> (What's happening now?) _________________________________</p>
<p><strong>My contribution:</strong> (What I'm doing, what's working/not working) _________________________________</p>
<p><strong>What I need from the team:</strong> _________________________________</p>
<p><strong>Specific questions:</strong></p>
<ol>
<li>_________________________________</li>
<li>_________________________________</li>
</ol>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Managing Interprofessional Tensions</h2>
<p>Tensions between disciplines are common. Common sources include:</p>
<p><strong>Scope disputes:</strong> "That's not in your scope." "You're overstepping." Particularly common between disciplines with overlapping scopes.</p>
<p><strong>Philosophical differences:</strong> Different disciplines have different philosophical foundations. Medical model vs. wellness model. Individual focus vs. systems focus. These differences can create tension.</p>
<p><strong>Power dynamics:</strong> Psychiatrists are often treated as "in charge" due to medical degree and prescribing authority. This can create resentment and inhibit contribution from others.</p>
<p><strong>Communication styles:</strong> Direct vs. indirect. Brief vs. detailed. Task-focused vs. process-focused. Style mismatches can create friction.</p>
<p><strong>Resource competition:</strong> In agencies, disciplines may compete for limited resources, creating tension.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Strategies for Managing Tension</h2>
<p><strong>Focus on client welfare:</strong> When tensions arise, redirect to "What does this client need? How can we best serve them?"</p>
<p><strong>Clarify roles:</strong> Explicit role clarification reduces scope conflicts. "You're doing X, I'm doing Y, we're both contributing to Z."</p>
<p><strong>Seek to understand:</strong> Before assuming the other discipline is wrong, understand their perspective. They may have information or training you lack.</p>
<p><strong>Address conflict directly:</strong> Indirect conflict (triangulating through the client, passive aggression) makes things worse. Direct, respectful conversation works better.</p>
<p><strong>Find common ground:</strong> Even when approaches differ, goals often align. Build from shared goals.</p>
<p><strong>Know when to escalate:</strong> If conflicts genuinely impair client care, involve supervisors or administration.</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>✅ Knowledge Check: Module 6</h2>
<ol>
<li>Different professional disciplines bring:</li>
<p>a) Essentially identical perspectives b) Different training, perspectives, and scopes of practice c) Competing approaches that can't be integrated d) Interchangeable skills</p>
</ol>
<ol>
<li>When communicating with medical providers, it's generally helpful to:</li>
<p>a) Use counseling jargon to demonstrate expertise b) Be concise and focus on relevant clinical data c) Avoid any diagnostic language d) Defer entirely to their opinions</p>
</ol>
<ol>
<li>Effective participation in team meetings includes:</li>
<p>a) Remaining silent to avoid conflict b) Dominating the conversation c) Sharing your perspective while remaining collaborative d) Agreeing with whatever the physician says</p>
</ol>
<ol>
<li>When you disagree with another provider's approach, you should first:</li>
<p>a) Tell the client the provider is wrong b) Seek to understand the other provider's reasoning through direct communication c) File a complaint with their licensing board d) Stop coordinating care</p>
</ol>
<ol>
<li>Power differentials on interdisciplinary teams should be managed by:</li>
<p>a) Always deferring to those with higher degrees b) Knowing your value, speaking confidently, and building relationships c) Avoiding all teams with hierarchies d) Competing aggressively for recognition</p>
</ol>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Special Considerations in Collaborative Care</h2>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Rural and Underserved Settings</h2>
<p>In rural and underserved areas, collaboration presents unique challenges:</p>
<p><strong>Limited resources:</strong> Fewer providers mean fewer options for referral and consultation.</p>
<p><strong>Multiple relationships:</strong> In small communities, dual relationships are common. The psychiatrist may also be your neighbor.</p>
<p><strong>Geographic barriers:</strong> Travel distances may complicate coordination.</p>
<p><strong>Technology reliance:</strong> Telehealth becomes essential but requires infrastructure.</p>
<p><strong>Creative solutions:</strong> You may need to develop consultation relationships with urban providers, use telehealth creatively, or develop peer networks across distances.</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Private Practice Settings</h2>
<p>Private practitioners face collaboration challenges:</p>
<p><strong>Isolation:</strong> Without colleagues down the hall, isolation is the default.</p>
<p><strong>Financial pressures:</strong> Time spent coordinating isn't directly reimbursable.</p>
<p><strong>Infrastructure:</strong> You may lack systems for secure communication, shared records, or care coordination.</p>
<p><strong>Building networks:</strong> Without organizational placement, you must build your own referral and consultation networks.</p>
<p><strong>Solutions:</strong> Join consultation groups, build relationships with key providers, allocate time for coordination, invest in HIPAA-compliant communication tools.</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Agency and Organizational Settings</h2>
<p>Agencies present different challenges:</p>
<p><strong>Organizational culture:</strong> Some agencies support collaboration; others create silos.</p>
<p><strong>Bureaucratic barriers:</strong> Documentation requirements, approval processes, and protocols may slow coordination.</p>
<p><strong>High caseloads:</strong> Heavy caseloads leave little time for coordination activities.</p>
<p><strong>Turnover:</strong> Frequent staff changes disrupt coordination relationships.</p>
<p><strong>Solutions:</strong> Advocate for collaboration-supportive policies, build relationships despite turnover, make coordination part of routine practice rather than an add-on.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Integrated Care Settings</h2>
<p>Behavioral health integration into primary care creates opportunities and challenges:</p>
<p><strong>Opportunities:</strong> Co-location facilitates coordination. Shared records improve information flow. Warm handoffs are possible.</p>
<p><strong>Challenges:</strong> Different cultures (medical vs. mental health). Time pressures of primary care. Confidentiality complexities with shared records. Role clarity issues.</p>
<p><strong>Keys to success:</strong> Clear role definitions, efficient communication systems, respect for different professional cultures, ongoing relationship-building.</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>🛠️ Skill Builder: Collaboration Self-Assessment</h2>
<p>Rate your collaborative practice (1 = needs development, 5 = strength):</p><table class="cr-table">
<tr><th>Area</th><th>Rating</th></tr>
<tr><td>Having regular consultation relationships</td><td></td></tr>
<tr><td>Building referral networks proactively</td><td></td></tr>
<tr><td>Coordinating care with other providers</td><td></td></tr>
<tr><td>Contributing effectively to teams</td><td></td></tr>
<tr><td>Managing interprofessional conflict</td><td></td></tr>
<tr><td>Advocating for my perspective appropriately</td><td></td></tr>
<tr><td>Adapting communication to different audiences</td><td></td></tr>
<tr><td>Following through on coordination commitments</td><td></td></tr>
<tr><td>Documenting coordination activities</td><td></td></tr>
<tr><td>Maintaining client focus amid coordination complexity</td><td></td></tr>
</table><p><strong>Top three areas to develop:</strong></p>
<ol>
<li>_________________________________</li>
<li>_________________________________</li>
<li>_________________________________</li>
</ol>
<p><strong>First step I'll take this month:</strong> _________________________________</p>
<p># CONCLUSION: BUILDING YOUR VILLAGE</p>
<p>We've explored the many dimensions of collaborative care—consultation, referral, coordination, and interdisciplinary collaboration. Let me leave you with some final thoughts about building the professional villages your clients need and your practice requires.</p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>Key Messages from This Course</h2>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>Isolation Is the Enemy</h2>
<p>The image of the solo practitioner working alone, single-handedly guiding clients toward healing through the power of the therapeutic relationship—it's seductive, but it's a myth. And it's a dangerous one.</p>
<p>Clients with complex needs require more than any one person can provide. Clinicians who work in isolation burn out, miss important clinical issues, and lack the perspective that comes from collegial dialogue.</p>
<p>The antidote to isolation is connection—with consultants, colleagues, supervisors, and the broader professional community. Building these connections isn't a sign of weakness or inadequacy. It's a sign of professional maturity and commitment to excellent care.</p>`,
            },
{
              type: "text",
              order: 27,
              content: `<h2>Consultation Is a Career-Long Practice</h2>
<p>Consultation isn't just for trainees or difficult cases. It's a practice that should continue throughout your career.</p>
<p>Even the most experienced clinicians benefit from:</p>
<ul>
<li>Outside perspective on cases they're too close to see clearly</li>
<li>Input from colleagues with different expertise</li>
<li>The processing function of thinking out loud with someone who understands</li>
<li>Ongoing professional development through learning from peers</li>
<li>The support that comes from shared burden of difficult work</li>
</ul>
<p>If you're not currently using consultation regularly, ask yourself why. What barriers exist? What would need to change? How might you build consultation into your practice as a routine rather than a crisis intervention?</p>`,
            },
{
              type: "text",
              order: 28,
              content: `<h2>Good Referral Is an Art</h2>
<p>Referral is more than giving out a phone number. It's a clinical skill that requires:</p>
<ul>
<li>Recognizing when referral is needed (and when it's not)</li>
<li>Knowing your referral network well enough to match clients with appropriate providers</li>
<li>Having the referral conversation in a way that feels supportive rather than rejecting</li>
<li>Facilitating warm handoffs that increase follow-through</li>
<li>Following up to ensure connections happen</li>
</ul>
<p>Building a robust referral network takes time and intentional effort. But it's an investment that pays dividends throughout your career.</p>`,
            },
{
              type: "text",
              order: 29,
              content: `<h2>Coordination Is Essential for Complex Cases</h2>
<p>When clients see multiple providers, coordination prevents:</p>
<ul>
<li>Information gaps where providers don't know what each other is doing</li>
<li>Contradictory recommendations that leave clients confused</li>
<li>Redundant efforts that waste resources</li>
<li>Gaps where everyone assumes someone else is handling something</li>
</ul>
<p>Learn to communicate effectively across disciplines. Understand different professional cultures and communication styles. Clarify roles and establish communication protocols. Coordinate care while respecting your own role boundaries.</p>`,
            },
{
              type: "text",
              order: 30,
              content: `<h2>Interdisciplinary Teams Are Greater Than the Sum of Parts</h2>
<p>When professionals from different disciplines work together effectively, the results exceed what any individual could achieve alone. Each discipline brings unique training, perspective, and expertise. Combined thoughtfully, these perspectives create comprehensive care that addresses clients holistically.</p>
<p>But interdisciplinary work isn't automatic. It requires:</p>
<ul>
<li>Understanding and respecting different professional roles</li>
<li>Adapting communication to different audiences</li>
<li>Managing tensions when they arise</li>
<li>Contributing your perspective while remaining open to others</li>
<li>Focusing relentlessly on client welfare as the shared goal</li>
</ul>`,
            },
{
              type: "text",
              order: 31,
              content: `<h2>Building Your Village: Practical Steps</h2>
<p>As you return to practice, consider these concrete actions:</p>`,
            },
{
              type: "text",
              order: 32,
              content: `<h2>For Consultation</h2>
<p><strong>If you don't currently have regular consultation:</strong></p>
<ol>
<li>Identify 2-3 colleagues whose expertise you respect</li>
<li>Approach them about informal consultation arrangements</li>
<li>Consider joining or forming a peer consultation group</li>
<li>Explore paid expert consultation for specialized cases</li>
</ol>
<p><strong>If you already use consultation:</strong></p>
<ol>
<li>Evaluate whether your current consultation meets your needs</li>
<li>Consider adding consultation in areas where you're less confident</li>
<li>Ensure you're not just consulting in crisis but routinely</li>
<li>Reflect on whether you're fully using the consultation you have</li>
</ol>`,
            },
{
              type: "text",
              order: 33,
              content: `<h2>For Referral</h2>
<p><strong>Build your network:</strong></p>
<ol>
<li>Identify gaps in your current referral resources</li>
<li>Research providers in those gap areas</li>
<li>Make personal connections when possible</li>
<li>Maintain relationships with key referral partners</li>
</ol>`,
            },
{
              type: "text",
              order: 34,
              content: `<h2>For Coordination</h2>
<p><strong>Establish protocols:</strong></p>
<ol>
<li>Create templates for common provider communications</li>
<li>Develop release of information forms that fit your needs</li>
<li>Establish routines for checking in with key providers</li>
<li>Build time into your schedule for coordination activities</li>
</ol>`,
            },
{
              type: "text",
              order: 35,
              content: `<h2>The Ethical Imperative</h2>
<p>Collaborative care isn't just best practice—it's an ethical requirement. The ACA Code of Ethics makes clear that:</p>
<ul>
<li>We must recognize limits of competence and refer when appropriate</li>
<li>We must consult on ethical obligations and professional practice</li>
<li>We must cooperate with other providers for client welfare</li>
<li>We must work within the boundaries of our competence</li>
</ul>
<p>When we fail to consult, refer, or coordinate, we may be failing our clients and violating our ethical obligations. The village isn't optional.</p>`,
            },
{
              type: "text",
              order: 36,
              content: `<h2>Final Thoughts</h2>
<p>The proverb that inspired our title—"It takes a village"—reminds us that complex human development requires community. No single caregiver provides everything a child needs.</p>
<p>The same is true in clinical practice. No single provider gives everything a complex client needs. By building consultation relationships, developing referral networks, coordinating care effectively, and collaborating across disciplines, we create the villages our clients require.</p>
<p>Thank you for your commitment to collaborative care. Your clients will benefit from the villages you build.</p>`,
            },
{
              type: "text",
              order: 37,
              content: `<h2>📋 Post-Course Pulse Check</h2>
<p>Rate your comfort level now (1 = very uncomfortable, 5 = very comfortable):</p><table class="cr-table">
<tr><th>Situation</th><th>Before</th><th>After</th></tr>
<tr><td>Seeking consultation for a difficult case</td><td></td><td></td></tr>
<tr><td>Telling a client you need to consult</td><td></td><td></td></tr>
<tr><td>Coordinating care with a psychiatrist</td><td></td><td></td></tr>
<tr><td>Making a referral when treatment isn't working</td><td></td><td></td></tr>
<tr><td>Disagreeing with another provider's approach</td><td></td><td></td></tr>
<tr><td>Contributing effectively to treatment teams</td><td></td><td></td></tr>
</table>`,
            },
{
              type: "text",
              order: 38,
              content: `<h2>🛠️ Action Plan: Building Your Village</h2>
<p>Commit to three specific actions to strengthen your collaborative network:</p>
<p><strong>1. Consultation:</strong> I will establish regular consultation with: _________________ Frequency: _________________ First step this week: _________________</p>
<p><strong>2. Referral Network:</strong> I will develop referral relationships for: _________________ First step: _________________ Timeline: _________________</p>
<p><strong>3. Coordination:</strong> I will improve coordination with: _________________ By implementing: _________________ Starting: _________________</p>`,
            }
      ]
    },
    {
      order: 7,
      title: `Course Summary and References`,
      estimatedTime: 10,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Course Summary and References`,
              subtitle: `Key Takeaways and APA 7th Edition References`,
              sectionNumber: 7,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Key Takeaways</h2><p>This course has provided a comprehensive examination of it takes a village: consultation referral and collaborative care in counseling practice. As you apply these concepts with clients, continue to seek consultation and pursue ongoing professional development.</p>`,
            },
{
              type: "reflection",
              order: 3,
              prompt: `Course Reflection`,
              content: `<p>Consider how the concepts presented in this course will inform your clinical work. What specific practices will you implement? What aspects of your current practice might you reconsider?</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<div class="cr-references"><h3>References</h3>
<p class="cr-reference">American Counseling Association. (2014). 2014 ACA Code of Ethics. Alexandria, VA: Author.</p>
<p class="cr-reference">Barnett, J. E. (2019). The ethical practice of consultation in professional psychology. Professional Psychology: Research and Practice, 50(3), 157-163.</p>
<p class="cr-reference">Caplan, G., & Caplan, R. B. (1993). Mental health consultation and collaboration. Waveland Press.</p>
<p class="cr-reference">Collins, C., Hewson, D. L., Munger, R., & Wade, T. (2010). Evolving models of behavioral health integration in primary care. Milbank Memorial Fund.</p>
<p class="cr-reference">Health Insurance Portability and Accountability Act of 1996, Pub. L. No. 104-191 (1996).</p>
<p class="cr-reference">Heath, B., Wise Romero, P., & Reynolds, K. (2013). A review and proposed standard framework for levels of integrated healthcare. SAMHSA-HRSA Center for Integrated Health Solutions.</p>
<p class="cr-reference">Interprofessional Education Collaborative. (2016). Core competencies for interprofessional collaborative practice: 2016 update. Washington, DC: Author.</p>
<p class="cr-reference">Kessler, R., & Stafford, D. (Eds.). (2008). Collaborative medicine case studies: Evidence in practice. Springer.</p>
<p class="cr-reference">McDaniel, S. H., & Fogarty, C. T. (2009). What primary care psychology has to offer the patient-centered medical home. Professional Psychology: Research and Practice, 40(5), 483-492.</p>
<p class="cr-reference">Reiter, J. T., Dobmeyer, A. C., & Hunter, C. L. (2018). Integrated behavioral health in primary care: A guide to effective implementation (2nd ed.). American Psychological Association.</p>
<p class="cr-reference">Remley, T. P., & Herlihy, B. (2020). Ethical, legal, and professional issues in counseling (6th ed.). Pearson.</p>
<p class="cr-reference">Robinson, P. J., & Reiter, J. T. (2016). Behavioral consultation and primary care: A guide to integrating services (2nd ed.). Springer.</p>
<p class="cr-reference">This course was developed for CounselorReady by GA Integrated Therapeutic Perspectives LLC, NBCC ACEP Provider #7760.</p>
<p class="cr-reference">© 2024 GAITP LLC. All rights reserved.</p>
</div>`,
            }
      ]
    }
  ]
};

const existing = await col.findOne({ slug: course.slug });
if (existing) { await col.updateOne({ _id: existing._id }, { $set: course }); console.log(`✅ UPDATED: ${course.title}`); }
else { await col.insertOne(course); console.log(`✅ INSERTED: ${course.title}`); }

const saved = await col.findOne({ slug: course.slug }, { projection: { title:1,ceHours:1,sections:1,'assessment.questions':1 } });
const blocks = (saved.sections||[]).reduce((s,sec)=>s+(sec.contentBlocks||[]).length,0);
const kc_f = (saved.sections||[]).reduce((n,sec)=>n+(sec.contentBlocks||[]).filter(b=>b.type==='multipleChoice'&&(b.explanation||'').includes('⚠️')).length,0);
console.log(`\n=== CR-404 STATS ===`);
console.log(`Sections: ${(saved.sections||[]).length} | Blocks: ${blocks} | Exam Qs: ${(saved.assessment?.questions||[]).length} | KC flagged: ${kc_f}`);
if (kc_f) console.log(`⚠️  ${kc_f} KC questions need correctAnswer set before publishing.`);
await mongoose.disconnect();
