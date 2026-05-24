/**
 * seedCR201-Ethics_Professional_Boundaries_in_Counseling_Practice-18034words.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Source: Ethics_Professional_Boundaries_3CE.md (courseMarkdown)
 * CE Hours: 3 | Floor: 18,000w | Source WC: 18,034
 * Target collection: interactivecourses
 *
 * Run from Render shell (~/project/src/server):
 *   node src/scripts/seedCR201-Ethics_Professional_Boundaries_in_Counseling_Practice-18034words.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');

const course = {
  courseCode: 'CR-201',
  slug: 'ethics-professional-boundaries-counseling-practice',
  title: 'Ethics and Professional Boundaries in Counseling Practice',
  subtitle: 'A Comprehensive 3-Hour CE Course for Licensed Mental Health Professionals',
  description: 'This comprehensive course examines the ethical foundations essential to professional counseling practice, with particular emphasis on the 2014 ACA Code of Ethics. Participants explore systematic approaches to ethical decision-making, professional boundaries, confidentiality, dual relationships, and mandated reporting requirements.',
  ceHours: 3,
  ceuHours: 3,
  accessType: 'subscription',
  status: 'draft',
  isPublished: false,
  category: 'Ethics',
  nbccContentAreas: ['Counselor Professional Identity and Practice Issues'],
  targetAudience: [
    'Licensed Professional Counselors',
    'Licensed Mental Health Counselors',
    'National Certified Counselors',
    'Licensed Clinical Social Workers',
    'Graduate-level counseling students'
  ],
  objectives: [
    `Identify and articulate the core ethical principles that form the foundation of professional counseling practice, including autonomy, nonmaleficence, beneficence, justice, fidelity, and veracity.`,
    `Apply at least two systematic ethical decision-making models (Kitchener's model, Forester-Miller & Davis model, or Wheeler & Bertram's model) to complex clinical scenarios.`,
    `Differentiate between boundary crossings and boundary violations, and evaluate clinical situations using established criteria for determining appropriateness of boundary decisions.`,
    `Analyze confidentiality requirements and their exceptions, including mandated reporting obligations, duty to warn provisions, and HIPAA considerations in counseling practice.`,
    `Evaluate dual relationship scenarios using ethical guidelines and develop strategies for managing unavoidable multiple relationships in professional practice.`,
    `Develop a comprehensive personal ethical practice plan that addresses proactive strategies for maintaining ethical standards throughout one's career.`
  ],
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC'
  },
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    degree: 'MA',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC'
  },
  approvals: [
    {
      body: 'NBCC',
      providerNumber: '7760',
      approvalStatus: 'approved',
      hourBreakdown: [{ type: 'ethics', hours: 3 }]
    }
  ],
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    showExplanations: false,
    questions: [
      {
        type: "multipleChoice",
        question: `The principle that refers to a counselor's obligation to be honest and avoid deception is:`,
        options: [
          { text: `Fidelity`, isCorrect: false },
          { text: `Veracity`, isCorrect: true },
          { text: `Autonomy`, isCorrect: false },
          { text: `Nonmaleficence`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `According to the Forester-Miller and Davis model, what should a counselor do after generating potential courses of action?`,
        options: [
          { text: `Implement the first option that seems reasonable`, isCorrect: false },
          { text: `Consider the potential consequences of each option`, isCorrect: false },
          { text: `Return to the ACA Code of Ethics`, isCorrect: true },
          { text: `Seek consultation before proceeding`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Which statement about boundary crossings is TRUE?`,
        options: [
          { text: `They are always violations of ethical standards`, isCorrect: false },
          { text: `They may serve therapeutic purposes and are not inherently harmful`, isCorrect: true },
          { text: `They are only acceptable in rural practice settings`, isCorrect: false },
          { text: `They inevitably lead to boundary violations`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `The Tarasoff ruling established that mental health professionals:`,
        options: [
          { text: `Must report all threats made by clients`, isCorrect: true },
          { text: `Have a duty to protect identifiable third parties from serious harm`, isCorrect: false },
          { text: `Cannot be held liable for failing to predict violence`, isCorrect: false },
          { text: `Must hospitalize any client who makes threats`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `According to the ACA Code of Ethics, sexual relationships with former clients are prohibited for a minimum of:`,
        options: [
          { text: `2 years`, isCorrect: false },
          { text: `3 years`, isCorrect: true },
          { text: `5 years`, isCorrect: false },
          { text: `10 years`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `When a counselor faces a conflict between ethical obligations and legal requirements, the first step should be to:`,
        options: [
          { text: `Always follow the law`, isCorrect: false },
          { text: `Always follow ethics`, isCorrect: false },
          { text: `Identify all relevant legal and ethical requirements and seek consultation`, isCorrect: true },
          { text: `Refuse to provide services`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `The ethical principle most directly related to informed consent is:`,
        options: [
          { text: `Beneficence`, isCorrect: false },
          { text: `Autonomy`, isCorrect: true },
          { text: `Justice`, isCorrect: false },
          { text: `Veracity`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Which of the following is the BEST reason to seek consultation when facing an ethical dilemma?`,
        options: [
          { text: `To share responsibility if something goes wrong`, isCorrect: false },
          { text: `To identify considerations you might have overlooked`, isCorrect: true },
          { text: `To delay having to make a decision`, isCorrect: false },
          { text: `To satisfy documentation requirements`, isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `In a small community where some dual relationships are unavoidable, counselors should:`,
        options: [
          { text: `Refuse to practice in that community`, isCorrect: false },
          { text: `Ignore the dual relationships since they are unavoidable`, isCorrect: false },
          { text: `Manage dual relationships thoughtfully and monitor for harm`, isCorrect: true },
          { text: `Report all dual relationships to the licensing board`, isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `An ethical practice plan should include all of the following EXCEPT:`,
        options: [
          { text: `Regular self-assessment of practice`, isCorrect: false },
          { text: `Ongoing consultation arrangements`, isCorrect: false },
          { text: `Self-care commitments`, isCorrect: false },
          { text: `Strategies for avoiding all difficult clients`, isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: ``
      }
    ]
  },
  references: [
    { citation: `American Counseling Association. (2014). ACA code of ethics. Author.` },
    { citation: `Barnett, J. E., & Johnson, W. B. (2015). Ethics desk reference for counselors (2nd ed.). American Counseling Association.` },
    { citation: `Corey, G., Corey, M. S., & Corey, C. (2019). Issues and ethics in the helping professions (10th ed.). Cengage Learning.` },
    { citation: `Cottone, R. R., & Claus, R. E. (2000). Ethical decision-making models: A review of the literature. Journal of Counseling & Development, 78(3), 275-283.` },
    { citation: `Fisher, M. A. (2016). Confidentiality and record keeping. In S. J. Knapp, M. C. Gottlieb, M. M. Handelsman, & L. D. VandeCreek (Eds.), APA handbook of ethics in psychology (Vol. 1, pp. 333-374). American Psychological Association.` },
    { citation: `Forester-Miller, H., & Davis, T. (1996). A practitioner's guide to ethical decision making. American Counseling Association.` },
    { citation: `Gabbard, G. O., & Nadelson, C. (1995). Professional boundaries in the physician-patient relationship. JAMA, 273(18), 1445-1449.` },
    { citation: `Gutheil, T. G., & Brodsky, A. (2008). Preventing boundary violations in clinical practice. Guilford Press.` },
    { citation: `Gutheil, T. G., & Gabbard, G. O. (1993). The concept of boundaries in clinical practice: Theoretical and risk-management dimensions. American Journal of Psychiatry, 150(2), 188-196.` },
    { citation: `Herlihy, B., & Corey, G. (2015). Boundary issues in counseling: Multiple roles and responsibilities (3rd ed.). American Counseling Association.` },
    { citation: `Kitchener, K. S. (1984). Intuition, critical evaluation and ethical principles: The foundation for ethical decisions in counseling psychology. Counseling Psychologist, 12(3), 43-55.` },
    { citation: `Pope, K. S., & Vasquez, M. J. T. (2016). Ethics in psychotherapy and counseling: A practical guide (5th ed.). John Wiley & Sons.` },
    { citation: `Remley, T. P., Jr., & Herlihy, B. (2020). Ethical, legal, and professional issues in counseling (6th ed.). Pearson.` },
    { citation: `Smith, D., & Fitzpatrick, M. (1995). Patient-therapist boundary issues: An integrative review of theory and research. Professional Psychology: Research and Practice, 26(5), 499-506.` },
    { citation: `Tarasoff v. Regents of University of California, 17 Cal. 3d 425 (1976).` },
    { citation: `Welfel, E. R. (2016). Ethics in counseling and psychotherapy: Standards, research, and emerging issues (6th ed.). Cengage Learning.` },
    { citation: `Wheeler, A. M., & Bertram, B. (2022). The counselor and the law: A guide to legal and ethical practice (8th ed.). American Counseling Association.` },
    { citation: `Zur, O. (2017). Boundaries in psychotherapy: Ethical and clinical explorations. American Psychological Association.` }
  ],
  sections: [
    {
      order: 1,
      title: `Module 1: Foundations of Counseling Ethics`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 1: Foundations of Counseling Ethics`,
              subtitle: `Ethics and Professional Boundaries in Counseling Practice`,
              sectionNumber: 1,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Introduction: Why Ethics Matter in Counseling</h2>
<p>The therapeutic relationship represents one of the most intimate and vulnerable interpersonal connections that exists outside of family bonds. Clients enter counseling during periods of psychological distress, often sharing their deepest fears, shameful secrets, traumatic experiences, and most private thoughts with their counselors. This profound level of trust creates an inherent power differential that places significant ethical responsibilities on the counseling professional. Understanding and internalizing ethical principles is not merely about avoiding disciplinary action or malpractice suits—though these are certainly important considerations—but fundamentally about honoring the sacred trust that clients place in us and ensuring that our interventions serve their wellbeing above all else.</p>
<p>The history of mental health treatment provides sobering reminders of what occurs when ethical principles are absent or ignored. From the abuses of state psychiatric institutions in the early twentieth century to the Tuskegee syphilis study's betrayal of African American participants, the helping professions have not always lived up to their stated ideals. These historical failures underscore why contemporary counselors must develop robust ethical frameworks that guide practice decisions and protect vulnerable populations.</p>
<p>Ethics in counseling extends beyond simply following rules established by professional organizations. While codes of ethics provide essential guidance, they cannot anticipate every situation a counselor will encounter. Ethical practice requires the development of moral reasoning capacities that allow practitioners to navigate novel situations, balance competing values, and make decisions that honor both the letter and spirit of ethical principles. This course aims to develop both your knowledge of ethical standards and your capacity for ethical reasoning.</p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>The Nature of Professional Ethics</h2>
<p>Professional ethics differ from personal morality in several important ways. While personal moral beliefs are shaped by individual experiences, cultural backgrounds, religious traditions, and philosophical commitments, professional ethics represent a collective agreement among practitioners about the standards of conduct that define competent and responsible practice within a given field. These standards emerge from the accumulated wisdom of the profession, evolving understanding of what constitutes helpful versus harmful practice, and ongoing dialogue about the values that should guide professional conduct.</p>
<p>The American Counseling Association's Code of Ethics, most recently revised in 2014, represents the primary ethical framework for professional counselors in the United States. This document articulates the profession's core values, establishes standards of conduct across multiple domains of practice, and provides guidance for navigating common ethical dilemmas. However, counselors must recognize that the ACA Code of Ethics exists within a broader ecosystem of ethical requirements, including state licensing board regulations, federal laws such as HIPAA, institutional policies, and specialty area guidelines.</p>
<p>Professional ethics serve multiple functions within the counseling profession. First, they protect clients by establishing minimum standards of conduct and providing mechanisms for accountability when those standards are violated. Second, they protect practitioners by clarifying expectations and providing defensible rationales for clinical decisions. Third, they protect the profession as a whole by maintaining public trust and demonstrating that counselors take seriously their responsibilities to those they serve. Finally, ethical codes serve an aspirational function, articulating the ideals toward which practitioners should strive even when specific rules do not mandate particular behaviors.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>The Six Core Ethical Principles</h2>
<p>Contemporary counseling ethics are built upon six foundational principles that have emerged from philosophical ethics and have been adapted for application in helping relationships. These principles, articulated most influentially by Kitchener (1984) and subsequently elaborated by numerous scholars, provide the conceptual framework within which specific ethical standards operate. Understanding these principles allows counselors to reason through novel situations and to understand the rationale underlying specific code provisions.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Autonomy</h2>
<p>The principle of autonomy recognizes and respects clients' rights to self-determination—their capacity and freedom to make decisions about their own lives, including decisions about their treatment. Autonomy is grounded in respect for the inherent dignity of human beings and acknowledgment that competent adults are generally the best judges of their own interests and values. In counseling practice, autonomy manifests in obtaining informed consent, respecting clients' treatment preferences, supporting clients' decision-making capacities, and avoiding paternalistic interventions that substitute the counselor's judgment for the client's own assessment of what is best for their life.</p>
<p>Informed consent represents the primary mechanism through which counselors honor client autonomy. Before beginning treatment, clients have the right to understand the nature of counseling, the specific approaches the counselor intends to use, the potential benefits and risks of treatment, alternatives to the proposed treatment, the limits of confidentiality, and the counselor's qualifications. This information must be presented in language the client can understand, and the client must have genuine freedom to accept or decline services without coercion.</p>
<p>However, autonomy is not absolute. Counselors may limit client autonomy when clients pose serious risks to themselves or others, when clients lack the capacity to make informed decisions due to severe mental illness or cognitive impairment, or when respecting a client's choices would require the counselor to violate other ethical principles. Even in these situations, counselors should seek to preserve as much client autonomy as possible and should return decision-making authority to clients as soon as circumstances permit.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Nonmaleficence</h2>
<p>Nonmaleficence—the obligation to avoid causing harm—is often considered the most fundamental ethical principle. The Hippocratic injunction to "first, do no harm" applies with particular force in counseling, where interventions target vulnerable individuals and have the potential to cause psychological damage. Nonmaleficence requires counselors to refrain from actions that could harm clients, to practice within the boundaries of their competence, to avoid exploiting the trust and dependency that clients develop in therapy, and to remain vigilant about the potential negative effects of their interventions.</p>
<p>Applying nonmaleficence in practice requires counselors to consider both direct and indirect harms, both intended and unintended consequences. Direct harms might include sexual exploitation of clients, breach of confidentiality, or practicing while impaired. Indirect harms might result from inadequate supervision of trainees, failure to make appropriate referrals, or negligent record-keeping that compromises client welfare in subsequent treatment. Counselors must also consider the harm of inaction—failing to intervene when intervention is warranted may itself constitute a violation of nonmaleficence.</p>
<p>The principle of nonmaleficence extends beyond the immediate therapeutic relationship to encompass broader considerations of who might be affected by counseling-related decisions. When a client discloses intent to harm a third party, the counselor faces a conflict between maintaining confidentiality and protecting potential victims from harm. While specific guidance for such situations varies by jurisdiction, the underlying ethical tension reflects the scope of nonmaleficence obligations.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Beneficence</h2>
<p>While nonmaleficence focuses on avoiding harm, beneficence involves the positive obligation to promote client welfare and contribute to their growth, healing, and wellbeing. Beneficence requires counselors to actively work in clients' best interests, to provide competent services that address clients' presenting concerns, and to advocate for clients when systemic barriers impede their welfare. The combination of nonmaleficence and beneficence reflects a dual commitment: not only must counselors avoid harming clients, but they must actively seek to help them.</p>
<p>Beneficence in counseling practice takes many forms. At the most basic level, it requires counselors to provide effective treatment—to use interventions that have reasonable probability of helping clients achieve their goals. This implies an obligation to stay current with research on effective treatments, to seek supervision and consultation when facing challenging cases, and to make appropriate referrals when clients would be better served by other providers. Beneficence also supports advocacy activities when counselors recognize that their clients face barriers related to systems, policies, or social conditions.</p>
<p>The principle of beneficence can sometimes conflict with autonomy. A counselor might believe that a particular treatment approach would benefit a client, but the client may decline that treatment. In general, respect for autonomy takes precedence—competent clients have the right to make decisions about their own treatment even when counselors disagree with those decisions. However, when clients cannot make informed decisions or when their decisions pose serious risks, beneficence may support more directive interventions.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Justice</h2>
<p>Justice in counseling ethics refers to fairness in the distribution of services, resources, and treatment. The principle of justice requires counselors to treat clients equitably, to advocate for equal access to mental health services, and to recognize and address disparities in treatment that result from discrimination or systemic inequities. Justice also encompasses considerations of fairness in how counselors allocate their own time and resources among clients.</p>
<p>At the individual level, justice requires counselors to provide similar quality of care to all clients regardless of their demographic characteristics, socioeconomic status, or presenting concerns. Counselors must examine their own biases and ensure that personal prejudices do not compromise the care they provide to members of marginalized groups. This includes being aware of both explicit biases and the implicit biases that may influence clinical judgment outside of conscious awareness.</p>
<p>At the systemic level, justice supports counselor involvement in advocacy and social change efforts. Mental health services remain inequitably distributed, with underserved communities often lacking access to quality care. Counselors who work primarily with privileged populations might fulfill their justice obligations through pro bono work, involvement in policy advocacy, or contributions to organizations serving underserved communities. The ACA Code of Ethics explicitly addresses counselors' obligations to promote social justice and advocate for the removal of barriers that impede client welfare.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Fidelity</h2>
<p>Fidelity refers to faithfulness—the obligation to honor commitments, keep promises, and maintain loyalty within relationships. In the counseling context, fidelity encompasses the counselor's duty to honor the explicit and implicit agreements made with clients, to follow through on commitments, and to be trustworthy in the therapeutic relationship. Fidelity is essential for establishing the trust that makes therapeutic work possible.</p>
<p>The concept of fidelity extends to multiple relationships within professional practice. Counselors owe fidelity not only to current clients but also to former clients whose trust they must not betray. Fidelity obligations extend to colleagues, supervisees, the profession as a whole, and the broader community. When these multiple fidelities conflict—as when a colleague's conduct threatens client welfare—counselors must navigate complex terrain where honoring one commitment may require appearing to violate another.</p>
<p>Confidentiality represents perhaps the most significant expression of fidelity in counseling. When clients share private information with counselors, they do so with the expectation that this information will be protected. Maintaining confidentiality honors this implicit promise and demonstrates that the counselor is worthy of the trust clients place in them. Even when confidentiality must be breached to protect clients or others from serious harm, counselors should handle such breaches in ways that preserve as much trust as possible.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Veracity</h2>
<p>Veracity refers to truthfulness—the obligation to be honest in dealings with clients and others. Veracity requires counselors to avoid deception, to provide accurate information, and to acknowledge the limits of their knowledge and abilities. The principle of veracity undergirds informed consent, as clients cannot make autonomous decisions about treatment without accurate information about what treatment entails.</p>
<p>Honesty in counseling practice extends beyond simply avoiding false statements. Counselors must also avoid deception by omission—withholding information that clients need to make informed decisions. This might include information about the counselor's qualifications, the nature of the treatment being provided, the evidence base for particular interventions, or factors that might influence the counselor's objectivity.</p>
<p>Veracity can sometimes conflict with beneficence. A counselor might believe that withholding certain information would spare a client distress or that providing a placebo intervention might help the client. However, contemporary counseling ethics generally prioritize honesty over paternalistic deception, recognizing that trust once violated is difficult to restore and that clients are generally better served by honest engagement than by well-intentioned manipulation.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>The ACA Code of Ethics: Structure and Key Provisions</h2>
<p>The 2014 ACA Code of Ethics represents the culmination of decades of ethical thinking within the counseling profession. The Code is organized into sections addressing different domains of professional practice, each containing specific standards along with introductory material explaining the section's purpose and scope.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Section A: The Counseling Relationship</h2>
<p>Section A addresses fundamental aspects of the therapeutic relationship, including client welfare, informed consent, and avoiding harm. This section establishes that the primary responsibility of counselors is to respect the dignity and promote the welfare of clients. Key provisions address the requirement for informed consent (A.2), the prohibition against abandonment of clients (A.11), and the requirement that counselors practice only within their boundaries of competence (A.4).</p>
<p>Of particular importance in this section are the provisions addressing potentially harmful relationships with clients. Standard A.5 prohibits sexual and romantic relationships with current clients and addresses the prohibition against such relationships with former clients for a period of five years following the last professional contact, with an acknowledgment that even after five years, such relationships may be harmful. Standard A.6 addresses nonsexual boundaries, establishing that counselors should avoid relationships with clients that could impair objectivity or cause harm.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Section B: Confidentiality and Privacy</h2>
<p>Section B provides comprehensive guidance on the protection of client information. The section begins by acknowledging counselors' obligation to respect client privacy and only disclose information when appropriate and necessary (B.1). Specific standards address the circumstances under which confidentiality may or must be breached, including when clients pose a danger to themselves or others (B.2), when abuse or neglect is suspected (B.2.a), and when required by court order (B.2.c).</p>
<p>The section also addresses confidentiality in special circumstances, including group counseling (B.4.a), family counseling (B.4.b), and situations involving minor or incapacitated clients (B.5). Provisions regarding electronic records and transmission of client information (B.3.e) have become increasingly important as counselors incorporate technology into their practices.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Section C: Professional Responsibility</h2>
<p>Section C addresses counselors' obligations regarding professional competence, ethical compliance, and professional conduct. This section establishes that counselors practice only within their boundaries of competence (C.2.a), seek continuing education to maintain competence (C.2.f), and monitor their own effectiveness (C.2.d). The section also addresses impairment, requiring counselors to refrain from providing services when their physical, mental, or emotional problems are likely to harm clients (C.2.g).</p>
<p>Key provisions in this section address the responsibility to address ethical violations. Standard C.2.h encourages counselors to take reasonable steps to address situations in which colleagues' behavior appears to violate ethical standards, beginning with direct communication with the colleague when feasible and potentially including referral to licensure boards or ethics committees.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Section D: Relationships with Other Professionals</h2>
<p>Section D governs counselors' relationships with colleagues, supervisors, employers, and other professionals. The section emphasizes the importance of collaborative relationships that serve client welfare. Key provisions address consultation processes (D.2), interdisciplinary collaboration (D.1.c), and the handling of relationships with employers (D.1.g-h).</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Section E: Evaluation, Assessment, and Interpretation</h2>
<p>Section E provides guidance on the use of assessment instruments in counseling practice. The section establishes that counselors should select assessment instruments appropriate for the client population, use instruments only within their competence, and interpret results with appropriate consideration for the instruments' limitations (E.2). Provisions address informed consent for assessment (E.3), release of assessment data (E.4), and proper diagnosis (E.5).</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Section F: Supervision, Training, and Teaching</h2>
<p>Section F addresses the responsibilities of counselor educators and supervisors. Key provisions establish that supervisors are responsible for the welfare of supervisees' clients (F.1.a), should have training in supervision (F.2.a), and must avoid sexual relationships with supervisees (F.3.b). The section also addresses the evaluation of supervisees and students, requiring that evaluations be fair, transparent, and directly related to counseling competencies (F.9).</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Section G: Research and Publication</h2>
<p>Section G provides guidance for counselors engaged in research activities. The section emphasizes the protection of research participants through informed consent (G.2), confidentiality (G.2.d), and appropriate research design (G.1.c). Provisions address reporting of research results (G.4), including the obligation to report findings accurately without fabrication or falsification.</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Section H: Distance Counseling, Technology, and Social Media</h2>
<p>Section H, a significant addition in the 2014 revision, addresses the ethical challenges posed by technology in counseling practice. The section establishes that counselors who provide distance counseling should develop competence in the technology being used (H.1.a), verify client identity (H.2.a), and inform clients of risks specific to technology-assisted services (H.2.b). Provisions also address the use of social media, advising counselors to maintain appropriate boundaries in virtual interactions (H.6).</p>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Section I: Resolving Ethical Issues</h2>
<p>Section I provides guidance for addressing ethical dilemmas and conflicts between ethics and law. The section encourages counselors to consult with colleagues, supervisors, or ethics committees when facing difficult ethical decisions (I.1.c). Key provisions address the resolution of conflicts between ethics and organizational requirements (I.1.a), the obligation to cooperate with ethics investigations (I.3), and the handling of unfair discrimination claims (I.2).</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Historical Development of Counseling Ethics</h2>
<p>Understanding contemporary counseling ethics requires appreciation of how ethical thinking has evolved within the profession. The counseling profession emerged in the early twentieth century from diverse roots including vocational guidance, mental hygiene, and psychoanalysis. Early practitioners operated without formal ethical codes, relying instead on personal judgment and general moral principles.</p>
<p>The American Personnel and Guidance Association (APGA), a precursor to the American Counseling Association, adopted its first ethical code in 1961. This early code reflected the profession's origins in educational and vocational guidance, with limited attention to clinical practice issues. As counseling expanded into clinical mental health settings, ethical codes evolved to address the more complex dynamics of therapeutic relationships.</p>
<p>Major revisions to the ACA Code of Ethics occurred in 1974, 1981, 1988, 1995, 2005, and 2014. Each revision reflected evolving societal values, emerging challenges in practice, and growing sophistication in ethical thinking. The 2005 revision, for example, significantly expanded attention to multicultural competence and technology issues. The 2014 revision further developed these themes while also addressing end-of-life care, social justice advocacy, and the complexities of multiple relationships.</p>
<p>The evolution of ethical codes reflects broader societal changes in how mental health treatment is understood. Early codes reflected paternalistic assumptions about professional authority and client dependence. Contemporary codes place much greater emphasis on client autonomy, informed consent, and collaborative treatment relationships. This shift mirrors broader movements toward patient rights and shared decision-making in healthcare.</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Ethical Practice as Professional Identity</h2>
<p>Ethical practice is not simply a constraint on counselor behavior but constitutes a fundamental aspect of professional identity. When counselors internalize ethical principles, ethical practice becomes not a burden but an expression of professional values and commitments. This integration of ethics into professional identity serves both individual counselors and the profession as a whole.</p>
<p>For individual practitioners, a strong ethical foundation provides guidance and stability when facing difficult situations. Rather than approaching ethical dilemmas as problems to be managed or obstacles to effective practice, ethically-grounded counselors recognize that how they respond to ethical challenges defines who they are as professionals. This perspective transforms ethical decision-making from a defensive posture into an opportunity for professional expression.</p>
<p>For the profession, widespread commitment to ethical practice builds and maintains public trust. Mental health professions depend on public confidence that practitioners will act in clients' interests and that mechanisms exist to address misconduct when it occurs. When individual counselors violate ethical standards, they harm not only specific clients but also undermine confidence in the profession as a whole.</p>
<p>Developing ethical identity requires more than knowledge of ethical codes. It requires reflection on personal values, understanding of how those values relate to professional commitments, and practice in applying ethical principles to real situations. This course aims to support that developmental process by providing both knowledge and opportunities for application.</p>`,
            },
{
              type: "callout",
              order: 23,
              calloutType: "clinical",
              title: `Case Study: Principles in Conflict`,
              content: `<p>Consider the following scenario that illustrates how ethical principles can conflict in practice:</p>
<p>Dr. Sarah Martinez is treating James, a 28-year-old man with severe depression. James has been making steady progress over six months of treatment, but during a session he discloses that he has decided to discontinue his psychiatric medications without consulting his psychiatrist. He says the medications make him feel "emotionally flat" and interfere with his creativity as a musician. He is aware that stopping medications abruptly could trigger a relapse but states firmly that this is his decision to make.</p>
<p>Dr. Martinez faces a conflict between ethical principles:</p>
<p><strong>Autonomy</strong> supports James's right to make decisions about his own body and treatment, including the decision to discontinue medications. As a competent adult, James has the right to informed self-determination.</p>
<p><strong>Beneficence</strong> creates concern about James's welfare. The medications have contributed to his improvement, and stopping them—especially without psychiatric consultation—could lead to relapse, hospitalization, or worse.</p>
<p><strong>Nonmaleficence</strong> raises questions about harm. Is it harmful to support a decision that could lead to deterioration? Or would it be harmful to undermine James's autonomy through pressure or manipulation?</p>
<p><strong>Fidelity</strong> requires honoring the therapeutic relationship and the trust James has placed in Dr. Martinez by sharing this decision.</p>
<p><strong>Veracity</strong> requires honest communication about the risks of James's choice while respecting his right to make that choice.</p>
<p>There is no simple answer to this dilemma. Dr. Martinez might:</p>
<ul>
<li>Explore James's reasons and feelings about the medication in greater depth</li>
<li>Provide honest information about the risks of discontinuation</li>
<li>Encourage James to consult with his psychiatrist before making a final decision</li>
<li>Respect James's ultimate decision while continuing to monitor his status</li>
<li>Document the conversation and James's informed decision</li>
</ul>
<p>This case illustrates that ethical practice often involves holding multiple principles in tension rather than mechanically applying rules. The principles provide frameworks for thinking through difficult situations, not algorithms that produce automatic answers.</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Virtue Ethics and Professional Character</h2>
<p>Beyond principles and rules, a complete account of counseling ethics must address the character of the ethical counselor. Virtue ethics, with roots in Aristotle's philosophy, emphasizes not just what counselors should do but who counselors should be. From this perspective, ethical practice flows from cultivated character traits rather than simply following external rules.</p>
<p>Key virtues for counseling practice include:</p>
<p><strong>Prudence</strong> (practical wisdom): The capacity to discern the right course of action in particular circumstances. Prudence involves understanding ethical principles and having the judgment to apply them wisely in complex situations.</p>
<p><strong>Integrity</strong>: Consistency between one's values and one's actions. Counselors with integrity practice what they profess and maintain their ethical commitments even when doing so is difficult or costly.</p>
<p><strong>Compassion</strong>: The capacity to be moved by the suffering of others and to respond with care. Compassion motivates ethical action and sustains counselors through the emotional demands of therapeutic work.</p>
<p><strong>Courage</strong>: The willingness to act ethically even when doing so involves personal risk or discomfort. Courage supports counselors in confronting difficult situations, addressing ethical violations, and maintaining boundaries despite pressure.</p>
<p><strong>Humility</strong>: Recognition of one's limitations and openness to correction. Humility supports seeking consultation, acknowledging mistakes, and continuing to learn throughout one's career.</p>
<p><strong>Justice</strong>: Commitment to fairness and equity in one's dealings with clients and others. Justice motivates attention to systemic barriers and advocacy for underserved populations.</p>
<p>Developing these virtues requires more than intellectual understanding. It requires practice, reflection, mentorship, and ongoing commitment to professional growth. The goal is not merely to know what is ethical but to become the kind of person who naturally gravitates toward ethical action.</p>`,
            },
{
              type: "multipleChoice",
              order: 25,
              question: `Which ethical principle recognizes clients' rights to make decisions about their own treatment?`,
              options: [
                { text: `Beneficence`, isCorrect: false },
                { text: `Autonomy`, isCorrect: true },
                { text: `Fidelity`, isCorrect: false },
                { text: `Justice`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 26,
              question: `The obligation to avoid causing harm to clients is known as:`,
              options: [
                { text: `Beneficence`, isCorrect: false },
                { text: `Veracity`, isCorrect: false },
                { text: `Nonmaleficence`, isCorrect: true },
                { text: `Fidelity`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 27,
              question: `Which section of the ACA Code of Ethics addresses the counseling relationship and informed consent?`,
              options: [
                { text: `Section B`, isCorrect: false },
                { text: `Section C`, isCorrect: false },
                { text: `Section A`, isCorrect: true },
                { text: `Section D`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 28,
              question: `The ACA Code of Ethics was most recently revised in:`,
              options: [
                { text: `2005`, isCorrect: false },
                { text: `2010`, isCorrect: false },
                { text: `2014`, isCorrect: true },
                { text: `2019`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 29,
              question: `Which ethical principle requires counselors to be honest and avoid deception with clients?`,
              options: [
                { text: `Autonomy`, isCorrect: false },
                { text: `Veracity`, isCorrect: true },
                { text: `Beneficence`, isCorrect: false },
                { text: `Justice`, isCorrect: false },
              ],
              correctAnswer: 1,
            }
      ]
    },
    {
      order: 2,
      title: `Module 2: Ethical Decision-Making Models`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 2: Ethical Decision-Making Models`,
              subtitle: `Ethics and Professional Boundaries in Counseling Practice`,
              sectionNumber: 2,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Introduction: Why Models Matter</h2>
<p>When counselors encounter ethical dilemmas in practice, they often experience uncertainty, anxiety, and conflicting pressures that can compromise decision-making quality. Systematic ethical decision-making models provide structured approaches for working through complex situations, helping counselors move beyond emotional reactions toward reasoned judgments that can be articulated and defended. Using a model doesn't guarantee reaching the "right" answer—indeed, reasonable practitioners may reach different conclusions even when using the same model—but it does ensure that important considerations receive appropriate attention and that the decision-making process can withstand scrutiny.</p>
<p>Ethical dilemmas arise when ethical principles or standards conflict with each other, when the application of principles to specific situations is unclear, or when ethical obligations conflict with personal values, organizational requirements, or legal mandates. These dilemmas cannot be resolved simply by consulting the code of ethics, though the code provides essential guidance. They require careful analysis, consultation, and judgment.</p>
<p>Consider a scenario that illustrates the complexity of ethical decision-making: A counselor has been seeing a client for depression and relationship difficulties. During a session, the client reveals that she has been having an affair with a colleague of the counselor—someone the counselor knows professionally and interacts with regularly at conferences and committee meetings. The client was unaware of this connection when she began treatment. The counselor now faces multiple competing considerations: maintaining confidentiality about the affair, managing the impact of this knowledge on her professional relationship with the colleague, considering whether the dual connection (client and colleague's affair partner) compromises her objectivity, and determining what, if anything, to disclose to the client about the situation.</p>
<p>This scenario has no obvious "correct" answer. Different counselors might reasonably reach different conclusions. What matters ethically is not only the conclusion reached but the process used to reach it—whether the counselor considered relevant principles, consulted with others, examined alternatives, and made a thoughtful decision based on the facts of the situation.</p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>Kitchener's Model of Ethical Reasoning</h2>
<p>Karen Kitchener's (1984) foundational model of ethical reasoning distinguishes between two levels of moral reasoning that counselors employ when facing ethical decisions. Understanding these levels helps practitioners recognize how they naturally approach ethical questions and how to engage more sophisticated reasoning when simple rule-following proves inadequate.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>The Intuitive Level</h2>
<p>The intuitive level of moral reasoning reflects immediate, often emotional responses to ethical situations based on accumulated life experience and moral development. When counselors encounter potential ethical violations, they often have immediate gut reactions—a sense that something is "not right" even before they can articulate exactly what principle is at stake. These intuitive responses serve important functions: they draw attention to situations requiring ethical consideration, and they often reflect implicit knowledge of ethical principles developed through training and experience.</p>
<p>However, intuitive responses have significant limitations. They may be influenced by personal biases, emotional reactions, or self-interest in ways that the counselor does not consciously recognize. Intuitions developed in one cultural context may not apply appropriately in other contexts. And when ethical situations involve novel circumstances or competing considerations, intuition alone may provide insufficient guidance.</p>
<p>Kitchener's model does not dismiss intuitive responses but recognizes them as starting points for more deliberate reasoning. When a counselor has a strong intuitive reaction to a situation—particularly a sense that something is ethically problematic—that reaction warrants attention and further analysis. At the same time, counselors should not rely solely on intuition, particularly when the stakes are high or when their intuitions might be compromised by personal interests.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>The Critical-Evaluative Level</h2>
<p>When intuitive responses prove inadequate—when counselors face novel situations, competing intuitions, or complex circumstances—they must engage the critical-evaluative level of moral reasoning. This level involves deliberate application of ethical principles, rules, and theories to the situation at hand. Critical-evaluative reasoning requires counselors to step back from immediate reactions, identify the ethical principles at stake, consider alternative courses of action, and evaluate options against ethical standards.</p>
<p>The critical-evaluative level incorporates three components: ethical rules, ethical principles, and ethical theory. Ethical rules are the specific standards articulated in codes of ethics and other professional guidelines. Ethical principles are the foundational concepts—autonomy, nonmaleficence, beneficence, justice, fidelity, and veracity—that underlie specific rules. Ethical theory provides philosophical frameworks for understanding why principles matter and for resolving conflicts between principles.</p>
<p>In most situations, ethical rules provide sufficient guidance. When a client asks a counselor to provide falsified records for an insurance claim, the rule against fraud provides clear direction. However, rules sometimes conflict with each other, leave gray areas unaddressed, or fail to anticipate novel circumstances. In these situations, counselors must reason from principles and, occasionally, from broader ethical theory.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Applying Kitchener's Model</h2>
<p>Kitchener's model suggests a process for working through ethical dilemmas. First, attend to intuitive responses—what feels right or wrong about the situation? Second, identify the ethical rules that might apply. Third, when rules provide insufficient guidance or conflict with each other, examine the underlying principles. Fourth, when principles conflict, consider how ethical theory might help resolve the conflict.</p>
<p>Consider the case of a counselor who learns that a client is having an affair that is causing significant distress to the client but is not disclosed to the client's spouse. The counselor's intuitive response might be disapproval of the deception, but the relevant ethical rules (maintaining confidentiality) point in a different direction. The counselor might then examine principles: autonomy supports the client's right to make decisions about their own relationships; beneficence supports helping the client address the distress; nonmaleficence raises questions about whether the affair is harming the spouse and whether encouraging continued deception contributes to that harm. Working through these considerations, the counselor might conclude that their role is to help the client examine the situation and make their own decisions, not to impose the counselor's moral judgment about the affair.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>The Forester-Miller and Davis Model</h2>
<p>Holly Forester-Miller and Thomas Davis (1996) developed a practitioner-oriented decision-making model that provides step-by-step guidance for working through ethical dilemmas. This model has been widely adopted in counselor education and represents one of the most practical frameworks available for ethical decision-making.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Step 1: Identify the Problem</h2>
<p>The first step requires clearly identifying the nature of the ethical problem. This involves distinguishing ethical issues from clinical issues, legal issues, or matters of personal preference. Not every difficult situation involves an ethical dilemma. Sometimes the challenge is clinical (what intervention will be most effective?), legal (what does the law require?), or personal (how do I feel about this situation?). While these dimensions often overlap, clarity about the ethical component of a problem is essential for appropriate analysis.</p>
<p>Identifying the problem also involves determining whose problem it is. Is this primarily a dilemma for the counselor, for the client, or for some third party? What are the interests at stake for each party? Being clear about these questions helps focus subsequent analysis.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Step 2: Apply the ACA Code of Ethics</h2>
<p>Once the problem is identified, the counselor should review relevant sections of the ACA Code of Ethics (and any other applicable codes, such as specialty area codes or state licensing board rules) to determine whether the code provides clear guidance. In many cases, the code will address the situation directly or provide principles that clearly apply.</p>
<p>When applying the code, counselors should attend to both specific standards and the broader values articulated in the code's introduction and section preambles. The code should be read as a whole, not cherry-picked for provisions that support a predetermined conclusion. When standards seem to conflict, counselors should look for interpretive guidance that might resolve the apparent conflict.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Step 3: Determine the Nature and Dimensions of the Dilemma</h2>
<p>If the code does not provide clear guidance, the counselor should analyze the dilemma in greater depth. This involves identifying the principles at stake (which of the core principles are implicated?), determining the moral foundations (what ethical theories might apply?), considering contextual factors (what aspects of this particular situation affect the analysis?), and examining one's own values and motivations (how might personal factors influence the analysis?).</p>
<p>This step also involves consultation. Seeking input from colleagues, supervisors, or ethics experts helps identify considerations that the individual counselor might overlook and provides reality-testing for proposed courses of action. Consultation should occur before decisions are finalized, not after, and should involve individuals who can provide independent perspectives.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Step 4: Generate Potential Courses of Action</h2>
<p>Having analyzed the dilemma, the counselor should brainstorm possible responses without initially evaluating them. The goal is to identify the full range of options, including options that might initially seem unappealing. Sometimes the best course of action is one that would not have occurred to the counselor without deliberate effort to generate alternatives.</p>
<p>Options might include taking direct action, seeking additional information, involving other parties, delaying decision-making, or declining to act. For each major option, the counselor should also consider variations and refinements that might make the option more appropriate.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Step 5: Consider the Potential Consequences</h2>
<p>For each option identified in Step 4, the counselor should evaluate potential consequences for all parties affected by the decision. This includes the client, the counselor, relevant third parties, and the profession. Consequences to consider include both benefits and harms, both short-term and long-term effects, and both intended and unintended outcomes.</p>
<p>This analysis should be realistic rather than optimistic or pessimistic. Counselors should consider what is likely to happen, not just what they hope will happen. They should also consider how they would defend each option if it were scrutinized by licensing boards, courts, or colleagues.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Step 6: Select the Best Course of Action</h2>
<p>After completing the analysis, the counselor should select the course of action that best balances the competing considerations. This selection should be based on reasoned judgment rather than personal preference or convenience. The counselor should be able to articulate why this option was selected over alternatives.</p>
<p>Sometimes no option seems clearly superior. In these cases, the counselor must make a decision despite uncertainty, recognizing that ethical decision-making often involves choosing among imperfect alternatives. What matters is that the choice is made thoughtfully and can be defended based on ethical principles.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Step 7: Evaluate the Selected Course of Action</h2>
<p>Before implementing the decision, the counselor should evaluate it against several criteria. Forester-Miller and Davis suggest three tests: the test of justice (would I treat others the same in this situation?), the test of publicity (would I be comfortable if my decision were reported in the media?), and the test of universality (would I recommend this course of action to other counselors facing similar situations?).</p>
<p>If the selected course of action fails any of these tests, the counselor should return to earlier steps and reconsider. If it passes, the counselor can proceed with implementation, documenting the decision-making process and remaining alert to new information that might warrant reconsideration.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>The Wheeler and Bertram Legal-Ethical Decision-Making Model</h2>
<p>Anne Marie Wheeler and Burt Bertram developed a model that explicitly integrates legal and ethical considerations, recognizing that counselors often face situations where legal requirements and ethical obligations intersect. Their model, presented in "The Counselor and the Law" (multiple editions, most recently 2022), provides a framework for navigating these complex intersections.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Legal-Ethical Conflict Situations</h2>
<p>Wheeler and Bertram recognize that counselors sometimes face situations where legal requirements appear to conflict with ethical obligations. For example, a counselor might receive a subpoena for client records that the counselor believes would harm the client if disclosed. Or a counselor might face state laws that conflict with ethical obligations to particular client populations.</p>
<p>The ACA Code of Ethics provides some guidance for these situations. Standard I.1.a states that when counselors face conflicts between ethics and law, they should "make known their commitment to the ACA Code of Ethics and take steps to resolve the conflict in a responsible manner." This suggests that counselors should not automatically defer to legal requirements when those requirements conflict with ethical obligations.</p>
<p>However, Wheeler and Bertram emphasize that counselors must also understand the potential legal consequences of prioritizing ethics over law. Counselors who violate legal requirements may face licensure sanctions, civil liability, or criminal penalties. Understanding these risks allows counselors to make informed decisions about how to proceed.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>The Model's Steps</h2>
<p>The Wheeler and Bertram model involves several steps specifically designed for legal-ethical dilemmas:</p>
<p>First, identify all relevant legal requirements, including federal laws, state laws, licensing board regulations, and court orders. Determine which legal authorities have jurisdiction over the situation and what they specifically require or prohibit.</p>
<p>Second, identify all relevant ethical obligations from applicable codes of ethics. Note any apparent conflicts between legal requirements and ethical obligations.</p>
<p>Third, consult with colleagues, supervisors, ethics experts, and legal counsel as appropriate. Legal consultation is particularly important when significant legal issues are involved.</p>
<p>Fourth, consider options for resolving the conflict. These might include seeking modifications to legal requirements (e.g., requesting that a court quash a subpoena), finding ways to comply with both legal and ethical obligations, advocating for changes to laws or regulations that conflict with ethics, or carefully weighing the risks of prioritizing ethics over law or law over ethics.</p>
<p>Fifth, implement the chosen course of action while documenting the decision-making process thoroughly. Documentation should demonstrate that the counselor carefully considered both legal and ethical obligations.</p>
<p>Sixth, follow up to assess outcomes and address any continuing issues.</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Practical Applications</h2>
<p>Wheeler and Bertram's model is particularly valuable for situations involving mandated reporting, court-ordered treatment, subpoenas and court testimony, involuntary hospitalization, and conflicts between state laws and ethical obligations regarding particular populations.</p>
<p>For example, consider a counselor who is subpoenaed to testify about a client in a custody dispute. The counselor faces legal obligations to respond to the subpoena while having ethical obligations to protect client confidentiality and to avoid providing testimony that might harm the client. Using the Wheeler and Bertram model, the counselor would identify the specific legal requirements (what information is being requested, what protections might apply, what are the consequences of noncompliance), identify ethical obligations (confidentiality, nonmaleficence, potential harm from involvement in legal proceedings), consult with legal counsel and ethics experts, consider options (claiming privilege, requesting a protective order, negotiating limited disclosure), and implement a course of action that appropriately balances legal and ethical considerations.</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Integrating Multiple Models</h2>
<p>While each decision-making model has distinct features, they share common elements and can be used in combination. Core elements that appear across models include: identifying the problem clearly, consulting relevant codes and guidelines, considering the principles at stake, generating multiple options, evaluating consequences, making a reasoned decision, and documenting the process.</p>
<p>Experienced practitioners often internalize these steps and move through them fluidly rather than mechanically. However, when facing particularly complex or high-stakes situations, deliberately working through a model step by step can help ensure that important considerations are not overlooked.</p>
<p>The choice of which model to emphasize may depend on the nature of the situation. Kitchener's model provides conceptual depth for understanding levels of moral reasoning. The Forester-Miller and Davis model offers practical step-by-step guidance suitable for most dilemmas. The Wheeler and Bertram model is particularly valuable when legal issues are prominent.</p>`,
            },
{
              type: "callout",
              order: 20,
              calloutType: "clinical",
              title: `Case Study: Applying Decision-Making Models`,
              content: `<p>Dr. Pamela Chen is a licensed professional counselor who has been seeing Mr. David Kowalski, a 34-year-old married man, for treatment of depression and anxiety. Mr. Kowalski works as an accountant at a small firm. During their fourth session, Mr. Kowalski reveals that he has been embezzling funds from his employer to cover gambling debts. He states that he has stolen approximately $50,000 over the past year and that no one at the firm suspects him. He says he is telling Dr. Chen because the guilt is "eating him alive" and contributing to his depression. He explicitly asks Dr. Chen to keep this information confidential, stating that disclosure would "destroy my life, my marriage, everything."</p>
<p>Dr. Chen faces a complex ethical dilemma. Let us work through this case using the Forester-Miller and Davis model.</p>
<p><strong>Step 1: Identify the Problem</strong></p>
<p>The core ethical issue is whether Dr. Chen's obligation to maintain confidentiality is absolute or whether there are grounds for disclosure in this situation. Secondary issues include how to continue treatment therapeutically regardless of the confidentiality decision and how to handle her own emotional reactions to learning of the client's criminal behavior.</p>
<p><strong>Step 2: Apply the ACA Code of Ethics</strong></p>
<p>Reviewing the ACA Code of Ethics, Section B addresses confidentiality. Standard B.1.c states that counselors protect confidential information and do not disclose it without client consent except in specific circumstances. Standard B.2.a identifies circumstances where disclosure is required or permitted, including "to protect clients or identified others from serious and foreseeable harm."</p>
<p>The question is whether the embezzlement constitutes "serious and foreseeable harm" to the employer. The financial harm is real but has already occurred; continuing confidentiality won't cause additional harm in the same way that, for example, maintaining confidentiality about an ongoing threat of violence might. The ACA Code does not clearly require disclosure in this situation.</p>
<p><strong>Step 3: Determine the Nature and Dimensions of the Dilemma</strong></p>
<p>Multiple principles are at stake. Fidelity supports maintaining the confidentiality the client expects. Nonmaleficence raises questions about harm—harm to the client if disclosure destroys his life as he fears, but also potential harm to the employer and its other employees. Justice considerations note that the employer has been victimized and may have legitimate interests. Autonomy suggests respecting the client's choices about how to handle his own situation.</p>
<p>Legally, Dr. Chen is likely not a mandated reporter for financial crimes in most jurisdictions, though she should verify this. The information is protected by counselor-client privilege in most situations, though exceptions might exist.</p>
<p>Contextually, Dr. Chen should consider the client's mental state, the therapeutic implications of various choices, and the realistic consequences of disclosure versus nondisclosure.</p>
<p><strong>Step 4: Generate Potential Courses of Action</strong></p>
<p>Options include: (1) Maintain confidentiality completely; (2) Encourage the client to self-disclose or make restitution, perhaps making continued treatment contingent on his taking responsibility; (3) Disclose to the employer; (4) Seek legal consultation before deciding; (5) Explore the possibility of anonymous restitution; (6) Refer the client to another counselor due to the counselor's discomfort; (7) Set limits on what she can maintain confidentiality about going forward while keeping past disclosures confidential.</p>
<p><strong>Step 5: Consider Potential Consequences</strong></p>
<p>Maintaining confidentiality: Honors the therapeutic relationship; allows continued treatment of depression/anxiety; may enable therapeutic exploration of the client's behavior; does not prevent ongoing harm as the stealing has stopped (as far as is known); the counselor may experience ongoing discomfort.</p>
<p>Encouraging self-disclosure: Puts responsibility on the client; supports his autonomy; may be therapeutically valuable; may result in the client terminating treatment to avoid pressure.</p>
<p>Disclosing without consent: Would likely destroy the therapeutic relationship; would cause significant harm to the client; might expose the counselor to liability; the employer might benefit, but there's no ongoing danger.</p>
<p><strong>Step 6: Select the Best Course of Action</strong></p>
<p>Based on this analysis, maintaining confidentiality while therapeutically exploring the situation appears most consistent with ethical obligations. There is no clear requirement to disclose, significant harm would result from disclosure, and confidentiality serves important therapeutic and relational values. However, Dr. Chen should consult with a colleague or supervisor to reality-test this conclusion.</p>
<p>Dr. Chen might also establish limits going forward, clarifying that she cannot maintain confidentiality about future illegal activity but will keep what has already been disclosed confidential. She should document her decision-making process in her records.</p>
<p><strong>Step 7: Evaluate the Selected Course of Action</strong></p>
<p>Justice test: Would she treat other clients similarly? Yes—she would maintain confidentiality about past criminal behavior that doesn't involve ongoing danger.</p>
<p>Publicity test: Would she be comfortable if her decision were reported? She believes she could defend her reasoning, though she recognizes some would disagree.</p>
<p>Universality test: Would she recommend this to colleagues? Yes, with the caveat that they should also consult and carefully document.</p>`,
            },
{
              type: "multipleChoice",
              order: 21,
              question: `Kitchener's model distinguishes between which two levels of moral reasoning?`,
              options: [
                { text: `Theoretical and practical`, isCorrect: false },
                { text: `Intuitive and critical-evaluative`, isCorrect: true },
                { text: `Personal and professional`, isCorrect: false },
                { text: `Rule-based and principle-based`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 22,
              question: `According to the Forester-Miller and Davis model, what should a counselor do immediately after identifying an ethical problem?`,
              options: [
                { text: `Generate potential courses of action`, isCorrect: false },
                { text: `Consult with colleagues`, isCorrect: false },
                { text: `Apply the ACA Code of Ethics`, isCorrect: true },
                { text: `Consider potential consequences`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 23,
              question: `The Wheeler and Bertram model is specifically designed to address:`,
              options: [
                { text: `Multicultural considerations in ethics`, isCorrect: false },
                { text: `Conflicts between legal and ethical obligations`, isCorrect: true },
                { text: `Supervision dilemmas`, isCorrect: false },
                { text: `Research ethics`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 24,
              question: `Which test is NOT part of the evaluation criteria suggested by Forester-Miller and Davis?`,
              options: [
                { text: `Test of justice`, isCorrect: false },
                { text: `Test of publicity`, isCorrect: false },
                { text: `Test of universality`, isCorrect: false },
                { text: `Test of efficiency`, isCorrect: true },
              ],
              correctAnswer: 3,
            },
{
              type: "multipleChoice",
              order: 25,
              question: `In the case study involving Dr. Chen and the embezzling client, which principle most strongly supported maintaining confidentiality?`,
              options: [
                { text: `Justice`, isCorrect: false },
                { text: `Autonomy`, isCorrect: false },
                { text: `Fidelity`, isCorrect: true },
                { text: `Beneficence`, isCorrect: false },
              ],
              correctAnswer: 2,
            }
      ]
    },
    {
      order: 3,
      title: `Module 3: Professional Boundaries in Therapeutic Relationships`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 3: Professional Boundaries in Therapeutic Relationships`,
              subtitle: `Ethics and Professional Boundaries in Counseling Practice`,
              sectionNumber: 3,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Understanding the Nature of Boundaries</h2>
<p>Professional boundaries define the parameters of the therapeutic relationship, establishing what behaviors are appropriate between counselor and client and what behaviors would compromise the therapeutic process or harm the client. Boundaries serve multiple functions: they protect clients from exploitation, they preserve the unique nature of the therapeutic relationship, they support the counselor's objectivity and effectiveness, and they maintain public trust in the counseling profession.</p>
<p>The concept of boundaries in psychotherapy emerged from psychoanalytic thinking about the "frame" of treatment—the consistent elements that create a safe, predictable space within which therapeutic work can occur. Freud himself understood that the therapeutic relationship involves powerful transference dynamics in which clients may experience intense feelings toward the therapist that reflect earlier relationships. These dynamics create vulnerability to exploitation if appropriate boundaries are not maintained.</p>
<p>Contemporary understanding of boundaries has moved beyond the strict abstinence rules of classical psychoanalysis to a more nuanced approach that considers context, intention, and impact. While certain boundary violations—such as sexual contact with clients—remain absolutely prohibited, other boundary considerations require clinical judgment based on the specific circumstances of each therapeutic relationship.</p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>The Boundary Spectrum: Crossings, Violations, and the Gray Zone</h2>
<p>Smith and Fitzpatrick (1995) introduced the influential distinction between boundary crossings and boundary violations, providing language that allows for nuanced discussion of boundary issues.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Boundary Violations</h2>
<p>Boundary violations are departures from accepted practice that harm or exploit clients. They involve the misuse of the counselor's power for personal benefit, typically at the client's expense. Sexual contact with clients represents the clearest example of a boundary violation—it is always harmful, always exploitative, and always prohibited regardless of circumstances.</p>
<p>Other boundary violations might include financial exploitation (taking advantage of clients financially), dual relationships that compromise the counselor's objectivity and harm the client, disclosure of confidential information for personal gain, abandonment of clients without appropriate referral, and practicing while impaired in ways that harm clients.</p>
<p>Boundary violations are characterized by several features: they serve the counselor's interests rather than the client's, they exploit the power differential in the therapeutic relationship, they cause harm to the client, and they are not justifiable based on therapeutic benefit.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Boundary Crossings</h2>
<p>Boundary crossings are departures from traditional practice that are not inherently harmful and may serve therapeutic purposes. They represent flexibility in the therapeutic frame that is responsive to client needs rather than counselor self-interest. Examples might include accepting a small gift from a client, attending a client's graduation, extending a session during a crisis, using self-disclosure for therapeutic purposes, or making reasonable accommodations to meet with a client in a non-traditional setting.</p>
<p>Boundary crossings share several characteristics: they are motivated by therapeutic considerations rather than counselor self-interest, they are considered in light of the specific client and context, they are not inherently harmful and may be beneficial, and they are documented and can be justified based on clinical reasoning.</p>
<p>Importantly, boundary crossings exist on a continuum and can become violations depending on frequency, context, and cumulative impact. A single instance of extending a session during a crisis might be a reasonable boundary crossing; consistently extending sessions with one client might become problematic. A counselor accepting a small token gift at termination differs significantly from accepting expensive gifts throughout treatment.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>The Gray Zone</h2>
<p>Between clear violations and clearly appropriate boundary crossings lies a gray zone where reasonable practitioners might disagree. Consider the following scenarios:</p>
<p>A client who is a professional photographer offers to take the counselor's professional headshots at no charge. The client explains this is how they express gratitude.</p>
<p>A counselor in a rural area encounters a longtime client at the only local grocery store. The client invites the counselor to join them for coffee at the store's café.</p>
<p>A client experiencing a mental health crisis calls the counselor at home late at night. The counselor answers and provides 20 minutes of support.</p>
<p>Each scenario involves boundary considerations with potential arguments on multiple sides. These gray zone situations require careful analysis of the specific context, the client's needs and vulnerabilities, the counselor's motivations, and the likely impact on the therapeutic relationship.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Factors Affecting Boundary Decisions</h2>
<p>Gutheil and Gabbard (1993) identified multiple factors that counselors should consider when evaluating potential boundary issues:</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Client Factors</h2>
<p>Client diagnosis and dynamics significantly affect boundary considerations. Clients with borderline personality disorder, for example, may experience boundary crossings as confusing or threatening due to difficulties with interpersonal boundaries. Clients with trauma histories may be particularly vulnerable to any behavior that could be experienced as exploitation. Conversely, clients in some cultural contexts may experience strict boundaries as cold or rejecting.</p>
<p>Client vulnerability also matters. The greater the power differential between counselor and client—whether due to severity of mental illness, social marginalization, or other factors—the more carefully boundary decisions must be considered. The client's history with boundary violations in other relationships may also be relevant.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Therapeutic Context</h2>
<p>The type of therapy being provided affects boundary norms. Psychodynamic therapies traditionally maintain stricter boundaries to facilitate transference analysis. Humanistic therapies may involve more personal presence from the counselor. Behavioral therapies might involve real-world interactions such as exposure exercises. The boundary norms of the therapeutic approach should be considered alongside general ethical requirements.</p>
<p>The setting also matters. What is appropriate in private practice might differ from what is appropriate in an agency, hospital, or school setting. Institutional policies may establish boundary expectations that supplement professional ethical codes.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Cultural Context</h2>
<p>Boundary norms vary across cultures. In some cultures, gift-giving is an expected expression of respect, and refusing gifts would be insulting. In some cultures, counselors might be expected to attend significant life events. In some cultures, maintaining the strict professional distance common in mainstream American practice might be experienced as cold or uncaring.</p>
<p>Culturally responsive practice requires counselors to understand their clients' cultural expectations regarding professional relationships while also maintaining ethical standards. This does not mean that anything is acceptable if it can be justified culturally; clear boundary violations such as sexual contact remain prohibited across all cultural contexts. But cultural considerations should inform judgment about practices that fall within the gray zone.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Community Context</h2>
<p>Counselors practicing in small communities, rural areas, or specialized populations face boundary challenges different from those in urban areas with large client pools. In small communities, some dual relationships may be unavoidable. The only dentist in town might also be a former client. The counselor's children might attend school with clients' children. Social events might bring counselors and clients into contact.</p>
<p>The ACA Code of Ethics recognizes these realities, noting that "in some communities and situations it may not be feasible" to avoid nonprofessional interactions with clients and providing guidance for managing unavoidable dual relationships (A.5.d). The key is not to avoid all possible overlaps but to manage them thoughtfully with client welfare as the primary consideration.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Sexual Boundaries: The Absolute Prohibition</h2>
<p>Sexual contact between counselors and clients represents the most serious boundary violation, one that is absolutely prohibited by all professional codes of ethics. This prohibition applies regardless of who initiates the contact, regardless of whether the client consents, regardless of the counselor's intentions, and regardless of any other circumstances. There are no exceptions.</p>
<p>The prohibition extends beyond intercourse to include any sexual touching, romantic kissing, sexual comments or propositions, and other sexualized behaviors. It applies to current clients without exception. Most codes extend the prohibition to former clients for a specified period (the ACA Code specifies five years) and acknowledge that sexual relationships with former clients may be harmful even after that period.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Why Sexual Contact Is Always Harmful</h2>
<p>Sexual contact between counselors and clients is harmful for multiple reasons that operate regardless of the specific circumstances:</p>
<p>The therapeutic relationship involves a fundamental power imbalance that makes genuine consent impossible. Clients share their vulnerabilities, become emotionally dependent on their counselors, and may develop transference feelings that mirror earlier attachment relationships. In this context, clients cannot freely consent to sexual involvement because the relationship dynamics compromise their autonomy.</p>
<p>Sexual involvement destroys the therapeutic relationship and forecloses any possibility of future therapeutic benefit. Clients who have been sexually exploited by therapists often experience difficulty trusting subsequent therapists, compounding the harm.</p>
<p>Sexual exploitation by therapists produces documented psychological harm including depression, suicidal ideation, difficulty with subsequent relationships, shame, and symptoms similar to those experienced by survivors of other forms of sexual abuse.</p>
<p>The prohibition protects not only individual clients but also public trust in the profession. If clients cannot trust that counselors will not exploit them sexually, many people in need of mental health services will avoid seeking help.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Recognizing Warning Signs</h2>
<p>Sexual boundary violations rarely occur suddenly. More typically, they develop through a progression of increasingly problematic boundary crossings. Recognizing early warning signs allows counselors to address problems before they escalate.</p>
<p>Warning signs in the counselor might include: increasing anticipation of sessions with a particular client, sexual thoughts or fantasies about a client, special treatment of a client (scheduling flexibility, reduced fees, extended sessions), self-disclosure beyond therapeutic purposes, minimizing or hiding the nature of the relationship from colleagues or supervisors, feeling that the relationship with this client is "different" or "special," and rationalizing boundary crossings with this client.</p>
<p>Warning signs in the therapeutic process might include: increasingly personal conversations that drift from treatment goals, physical contact that goes beyond what is therapeutically indicated, meetings outside the therapy setting without clear therapeutic rationale, and gift exchanges that escalate in significance.</p>
<p>When counselors recognize these warning signs in themselves, they should seek consultation or supervision immediately. Addressing attraction or problematic dynamics early, while they are still manageable, is essential for protecting both client and counselor.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Managing Sexual Attraction</h2>
<p>Sexual attraction to clients is not inherently unethical. Attraction is a human experience that cannot be fully controlled. What matters ethically is how the counselor responds to attraction—whether they seek appropriate help to manage it or whether they allow it to progress toward harmful behavior.</p>
<p>When a counselor experiences attraction to a client, appropriate responses include: seeking consultation or supervision to process the feelings, examining whether the attraction is interfering with clinical judgment, considering whether referral is in the client's best interest, attending to boundary maintenance with extra care, and exploring in supervision whether the attraction involves countertransference dynamics that provide clinical information.</p>
<p>What is not appropriate is pretending the attraction does not exist (which prevents addressing it), interpreting the attraction as evidence of a special connection that justifies boundary violations, or acting on the attraction in any way.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Documentation of Boundary Decisions</h2>
<p>Careful documentation of boundary-related decisions serves multiple functions. It demonstrates that the counselor engaged in thoughtful decision-making rather than impulsive behavior. It preserves the rationale for decisions in case questions arise later. It provides protection if the counselor's decisions are scrutinized by licensing boards or in legal proceedings. And the process of documentation often helps counselors think through decisions more carefully.</p>
<p>Documentation of boundary crossings should include: description of the boundary issue or departure from standard practice, the clinical rationale for the decision, consideration of alternatives and why they were not selected, consultation sought and received, steps taken to protect the client and the therapeutic relationship, and follow-up plan for monitoring the impact of the decision.</p>
<p>For example, if a counselor decides to attend a client's graduation ceremony, documentation might note: the client's request and its significance in the context of treatment, the counselor's analysis of potential benefits (honoring achievement, therapeutic relationship) and risks (boundary confusion, impact on other clients), consultation with a supervisor who supported attending briefly, the plan for limited attendance followed by discussion in the next session, and the follow-up noting how the client experienced the counselor's attendance and any boundary clarification that occurred.</p>`,
            },
{
              type: "multipleChoice",
              order: 17,
              question: `According to Smith and Fitzpatrick, what distinguishes a boundary crossing from a boundary violation?`,
              options: [
                { text: `Boundary crossings are always beneficial; violations are always harmful`, isCorrect: false },
                { text: `Boundary crossings may be therapeutic and don't exploit clients; violations harm or exploit`, isCorrect: false },
                { text: `Boundary crossings involve physical contact; violations involve emotional contact`, isCorrect: true },
                { text: `Boundary crossings occur outside sessions; violations occur during sessions`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 18,
              question: `Which client factor is MOST important to consider when evaluating a potential boundary crossing?`,
              options: [
                { text: `The client's age`, isCorrect: true },
                { text: `The client's occupation`, isCorrect: false },
                { text: `The client's vulnerability and diagnosis`, isCorrect: false },
                { text: `The client's income level`, isCorrect: false },
              ],
              correctAnswer: 0,
            },
{
              type: "multipleChoice",
              order: 19,
              question: `According to the ACA Code of Ethics, the minimum period during which sexual relationships with former clients are prohibited is:`,
              options: [
                { text: `2 years`, isCorrect: true },
                { text: `5 years`, isCorrect: false },
                { text: `10 years`, isCorrect: false },
                { text: `Forever`, isCorrect: false },
              ],
              correctAnswer: 0,
            },
{
              type: "multipleChoice",
              order: 20,
              question: `A counselor who finds themselves having sexual thoughts about a client should:`,
              options: [
                { text: `Immediately terminate the therapeutic relationship`, isCorrect: false },
                { text: `Seek consultation or supervision to address the attraction appropriately`, isCorrect: true },
                { text: `Disclose the attraction to the client to maintain transparency`, isCorrect: false },
                { text: `Avoid the topic and trust that the feelings will pass naturally`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 21,
              question: `In a small rural community where some dual relationships may be unavoidable, the ACA Code of Ethics advises counselors to:`,
              options: [
                { text: `Refuse to practice in such communities`, isCorrect: false },
                { text: `Ignore the dual relationships as they are unavoidable`, isCorrect: false },
                { text: `Manage dual relationships thoughtfully with client welfare as primary consideration`, isCorrect: true },
                { text: `Report all dual relationships to the licensing board`, isCorrect: false },
              ],
              correctAnswer: 2,
            }
      ]
    },
    {
      order: 4,
      title: `Module 4: Confidentiality, Privilege, and Mandated Reporting`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 4: Confidentiality, Privilege, and Mandated Reporting`,
              subtitle: `Ethics and Professional Boundaries in Counseling Practice`,
              sectionNumber: 4,
            },
{
              type: "text",
              order: 2,
              content: `<h2>The Foundation of Confidentiality</h2>
<p>Confidentiality—the counselor's obligation to protect information disclosed by clients—stands as one of the most fundamental ethical requirements in counseling practice. Without confidence that their disclosures will be protected, clients would be unwilling to share the intimate details necessary for effective treatment. Confidentiality thus serves not only individual clients but the therapeutic enterprise itself.</p>
<p>The obligation of confidentiality has multiple foundations. Ethically, it derives from the principles of fidelity (honoring the implicit promise to protect shared information), autonomy (respecting clients' rights to control their personal information), and nonmaleficence (protecting clients from harm that could result from disclosure). Legally, confidentiality requirements are codified in HIPAA regulations, state licensing laws, and case law establishing the responsibilities of mental health professionals.</p>
<p>While confidentiality and privilege are often discussed together, they represent distinct concepts. Confidentiality is the ethical obligation of the counselor; it belongs to the therapeutic relationship and is the counselor's responsibility to maintain. Privilege is a legal right belonging to the client that protects against compelled disclosure in legal proceedings. A client can waive privilege, allowing the counselor to testify; a counselor cannot waive confidentiality without appropriate authorization or exception.</p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>The Scope of Confidentiality</h2>
<p>The confidentiality obligation extends broadly to encompass all information obtained in the context of the therapeutic relationship. This includes: the content of therapy sessions; diagnostic information and treatment plans; the fact that someone is a client (in most circumstances); historical information shared by the client; information from collateral sources obtained in the course of treatment; psychological testing data and results; and the counselor's observations and clinical impressions.</p>
<p>The ACA Code of Ethics emphasizes that counselors should share confidential information only with appropriate consent or when required to prevent serious and foreseeable harm. Even when disclosure is permitted or required, counselors should disclose only the minimum information necessary for the purpose at hand.</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Information Management in Practice</h2>
<p>Protecting confidentiality requires attention to information management practices. Physical records should be maintained securely with appropriate locks and limited access. Electronic records require passwords, encryption, and secure storage systems. Transmission of client information—whether by fax, email, or other means—requires safeguards appropriate to the sensitivity of the information.</p>
<p>Counselors should also be mindful of less obvious confidentiality risks. Conversations in hallways or waiting rooms can be overheard. Scheduling systems may reveal that someone is a client. Insurance billing may disclose treatment information. Supervision discussions must protect client identity when possible. Social media and electronic communications create new vectors for potential breaches.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Confidentiality with Different Client Populations</h2>
<p>Special considerations arise when working with certain client populations:</p>
<p><strong>Minors</strong>: Parents generally have legal rights to information about their minor children's treatment, but ethical practice involves developmentally appropriate confidentiality that supports the therapeutic relationship while keeping parents appropriately informed. Many counselors establish explicit agreements about what information will and will not be shared with parents.</p>
<p><strong>Couples and Families</strong>: When working with multiple family members, counselors must establish clear policies about whether information shared by one family member will be kept from others. Many counselors adopt a "no secrets" policy; others maintain individual confidentiality. Whatever policy is adopted should be clearly communicated from the outset.</p>
<p><strong>Groups</strong>: Counselors leading groups cannot guarantee the confidentiality of other group members. Counselors should discuss the importance of confidentiality with group members and establish group norms around protecting shared information, while acknowledging that this cannot be absolutely ensured.</p>
<p><strong>Supervisees and trainees</strong>: When counselors-in-training are providing services under supervision, clients should be informed of this arrangement and understand that case material will be discussed with supervisors.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Exceptions to Confidentiality: When Disclosure Is Required or Permitted</h2>
<p>While confidentiality is foundational, it is not absolute. Multiple circumstances may require or permit disclosure of otherwise confidential information. Counselors must understand these exceptions and their applications.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Danger to Self</h2>
<p>When clients present serious and imminent risk of suicide or self-harm, counselors may need to breach confidentiality to protect the client's life. This might involve contacting family members, arranging hospitalization, or notifying emergency services. The specific actions required depend on the level of risk and available resources.</p>
<p>The ethical justification for breaching confidentiality when clients are suicidal derives from the principle of nonmaleficence—the harm from disclosure is judged less than the harm from the client's death. This justification applies when the danger is serious (not merely theoretical) and imminent (not merely possible at some future time).</p>
<p>Counselors should establish understanding about this exception during informed consent, helping clients understand that the counselor will act to protect their life even if this requires sharing information. This preemptive discussion can actually support the therapeutic alliance by demonstrating the counselor's commitment to the client's wellbeing.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Danger to Others: Duty to Warn and Protect</h2>
<p>When clients pose serious threats to identifiable third parties, counselors may have legal duties to warn potential victims or otherwise protect them. These duties emerged from the landmark Tarasoff case in California and have been adopted in various forms in most states.</p>
<p>The Tarasoff case (1976) established that mental health professionals have a duty to protect identifiable victims from serious threats made by their clients. The specific nature of this duty varies by jurisdiction—some states require warning the potential victim, others require notifying police, others allow various protective actions, and some have rejected or limited Tarasoff duties.</p>
<p>Counselors must know the specific requirements in their jurisdiction. When a client makes a threat against an identifiable person, counselors should consult with colleagues and, when possible, legal counsel before deciding on a course of action. Actions taken should be documented thoroughly.</p>
<p>Key questions in evaluating potential duty to warn/protect situations include: Is the threat serious, not merely an expression of frustration or fantasy? Is the threat specific enough to identify a potential victim? Is the danger imminent rather than remote? Does the counselor believe the client has the means and intention to carry out the threat?</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Mandated Reporting of Abuse and Neglect</h2>
<p>All states have laws requiring designated professionals—including counselors in most states—to report suspected abuse or neglect of children, and many states extend reporting requirements to vulnerable adults. These mandates override confidentiality when the specified conditions are met.</p>
<p>For child abuse and neglect, typical requirements specify that mandated reporters must report when they have reasonable suspicion that a child has been abused or neglected. The standard is reasonable suspicion, not certainty—reporters are not expected to investigate or confirm abuse before reporting. Reports typically go to child protective services or law enforcement, depending on the jurisdiction.</p>
<p>Counselors should understand their state's specific definitions of abuse and neglect, reporting procedures and timelines, protections for good-faith reporters, and any penalties for failure to report.</p>
<p>When a mandated report is necessary, counselors should generally inform the client (unless doing so would endanger the child), explain the reporting obligation and the rationale for it, and attempt to maintain the therapeutic relationship through the reporting process when possible.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Client Consent and Authorization</h2>
<p>Clients may authorize disclosure of their confidential information to specified parties for specified purposes. Such authorization should be documented through written release forms that identify the specific information to be released, the purpose of the release, the parties to whom information will be disclosed, a time limit for the authorization, and the client's signature and date.</p>
<p>Even with authorization, counselors should release only the minimum information necessary for the stated purpose. Counselors should also consider whether clients are freely providing consent or whether there might be coercion involved.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Legal Proceedings</h2>
<p>Various legal proceedings may require or permit disclosure of client information. Subpoenas are requests (not orders) for records or testimony; counselors should not automatically comply but should consult with legal counsel and consider asserting privilege. Court orders, unlike subpoenas, carry judicial authority and generally must be obeyed, though counselors may seek to narrow the scope of required disclosure.</p>
<p>When a client is involved in litigation and places their mental health at issue (for example, by claiming emotional damages), they may be deemed to have waived privilege for relevant mental health information. Counselors should obtain legal guidance in such situations.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Special Considerations: Technology and Confidentiality</h2>
<p>The increasing use of technology in counseling practice creates new confidentiality challenges that counselors must address. Electronic health records, email communication, text messaging, video counseling platforms, and social media all present potential risks to client privacy that did not exist when confidentiality standards were first developed.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Electronic Health Records</h2>
<p>While electronic records offer many advantages—accessibility, legibility, efficient storage—they also create vulnerabilities. Data breaches can expose large quantities of confidential information simultaneously. Multiple staff members may have access to records, increasing the risk of unauthorized viewing. Records may be transmitted electronically, creating interception risks. And unlike paper records that can be physically secured, electronic records depend on technological safeguards that may fail or be circumvented.</p>
<p>Counselors who use electronic health records should ensure that their systems include appropriate security measures: strong passwords, encryption, automatic logout, access controls limiting who can view records, and audit trails showing who accessed what information. They should also have policies addressing what happens if a security breach occurs.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Email and Text Communication</h2>
<p>Many clients prefer to communicate via email or text message, and these modalities can support therapeutic work. However, counselors must recognize that email and text are generally not secure—messages can be intercepted, stored on servers, or accessed by others who have access to the client's devices.</p>
<p>Before using email or text with clients, counselors should discuss the confidentiality limitations of these modalities and obtain informed consent for their use. They should establish guidelines about what kinds of information should and should not be communicated electronically. And they should use secure, encrypted platforms when available, particularly for substantive clinical communications.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Telehealth and Video Counseling</h2>
<p>Video counseling has become increasingly common, accelerated by the COVID-19 pandemic. While video platforms can provide effective therapy, they introduce confidentiality considerations. The platform itself must be secure—consumer video applications like Skype or FaceTime may not provide adequate security for clinical use. Both counselor and client must ensure privacy at their respective locations. And the possibility of recording—by either party or by the platform itself—must be addressed.</p>
<p>Counselors providing telehealth services should use platforms designed for clinical use that offer encryption and HIPAA compliance. They should discuss with clients how to ensure privacy on the client's end. And they should establish policies about recording and include telehealth-specific provisions in informed consent documents.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Social Media</h2>
<p>Social media presents unique boundary and confidentiality challenges. Counselors should generally not connect with current clients on social media platforms, as this blurs boundaries and could inadvertently disclose the therapeutic relationship. Even viewing clients' public social media posts raises questions—should information obtained from social media be discussed in therapy? What if concerning content is observed?</p>
<p>Counselors should have clear social media policies that they communicate to clients. These policies should address whether the counselor will accept contact requests from clients, how information from social media will be handled, and what the counselor's public social media presence involves.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>HIPAA and Federal Privacy Requirements</h2>
<p>The Health Insurance Portability and Accountability Act (HIPAA) establishes federal standards for protecting health information, including mental health information. HIPAA applies to covered entities—primarily healthcare providers who transmit information electronically in connection with certain transactions—and their business associates.</p>
<p>HIPAA establishes a Privacy Rule governing the use and disclosure of protected health information (PHI) and a Security Rule establishing safeguards for electronic PHI. Key HIPAA requirements include:</p>
<p><strong>Notice of Privacy Practices</strong>: Covered entities must provide clients with notice of how their information may be used and their rights regarding their information.</p>
<p><strong>Minimum Necessary Standard</strong>: Covered entities should use or disclose only the minimum information necessary for the purpose at hand.</p>
<p><strong>Client Rights</strong>: Clients have rights to access their records, request amendments, receive accounting of disclosures, and request restrictions on uses of their information.</p>
<p><strong>Authorization Requirements</strong>: Uses and disclosures for purposes other than treatment, payment, and healthcare operations generally require written authorization.</p>
<p><strong>Safeguards</strong>: Covered entities must implement administrative, physical, and technical safeguards to protect PHI.</p>
<p>HIPAA provides a federal floor for privacy protections; state laws that are more protective of client privacy remain in effect. Counselors should understand both HIPAA requirements and any more stringent state requirements.</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Ethical Decision-Making About Confidentiality</h2>
<p>When counselors face difficult confidentiality decisions, a systematic approach helps ensure that all relevant considerations receive attention:</p>
<ol>
<li>Identify the specific confidentiality issue and the conflicting values or obligations at stake.</li>
</ol>
<ol>
<li>Determine what legal requirements apply—mandated reporting laws, duty to warn statutes, HIPAA provisions, and state confidentiality laws.</li>
</ol>
<ol>
<li>Consult the ACA Code of Ethics and any other applicable ethical codes.</li>
</ol>
<ol>
<li>Consider the clinical implications—how will different courses of action affect the client and the therapeutic relationship?</li>
</ol>
<ol>
<li>Consult with colleagues, supervisors, legal counsel, or ethics experts as appropriate.</li>
</ol>
<ol>
<li>If disclosure is necessary, disclose only the minimum information required for the purpose.</li>
</ol>
<ol>
<li>Document the decision-making process and the rationale for the chosen course of action.</li>
</ol>
<ol>
<li>When possible, involve the client in the decision-making process and inform them of actions taken.</li>
</ol>`,
            },
{
              type: "callout",
              order: 19,
              calloutType: "clinical",
              title: `Case Study: Confidentiality Dilemma`,
              content: `<p>Marcus, a licensed professional counselor, has been seeing Elaine, a 42-year-old woman, for treatment of anxiety and depression. Elaine is a teacher at a local elementary school. During a session, Elaine tearfully discloses that she has been drinking heavily, often drinking a bottle of wine before work, and that she believes she was intoxicated at school on several occasions in the past month. She states that she is "pretty sure" no one has noticed and that she has never harmed a student. She does not believe she has a drinking problem and is not interested in addressing her alcohol use in therapy; she wants to continue focusing on her anxiety.</p>
<p>Marcus faces a complex confidentiality situation. What are the relevant considerations?</p>
<p><strong>Legal requirements</strong>: Marcus should determine whether his state's mandated reporting laws require reporting based on these facts. Most child abuse reporting laws require reports based on reasonable suspicion of abuse or neglect that has occurred. Elaine's disclosure that she may have been intoxicated while supervising children might raise questions about neglect, though she reports no actual harm to students. Marcus should consult his state's specific statutory language.</p>
<p><strong>Safety concerns</strong>: Elaine supervises young children while impaired. Even if no harm has occurred, there is significant risk of harm. This raises nonmaleficence considerations that might support disclosure.</p>
<p><strong>Professional obligations</strong>: Teachers typically have codes of conduct and employment requirements regarding fitness for duty. Elaine's employer has interests in knowing about potential impairment among staff, though Elaine herself has not authorized Marcus to contact her employer.</p>
<p><strong>Clinical considerations</strong>: Breaking confidentiality will likely damage or destroy the therapeutic relationship. However, maintaining confidentiality while Elaine continues to go to work intoxicated places Marcus in the position of implicitly enabling potentially harmful behavior.</p>
<p><strong>Options</strong>: Marcus might (1) maintain confidentiality and work therapeutically to help Elaine address her alcohol use; (2) inform Elaine that he will need to break confidentiality if she continues going to work intoxicated and give her the opportunity to address the situation herself; (3) make a mandated report if he determines the facts meet reporting requirements; (4) consult with a lawyer and/or ethics expert before deciding; or (5) contact Elaine's employee assistance program anonymously to seek guidance (if this is possible while maintaining her confidentiality).</p>
<p>A reasonable course might include consultation (with a lawyer regarding legal requirements, with a colleague regarding clinical judgment), followed by a direct conversation with Elaine in which Marcus expresses his concerns, discusses the limits of confidentiality as they apply to this situation, and attempts to engage Elaine in addressing both her alcohol use and the safety issues. Marcus should document his reasoning carefully.</p>`,
            },
{
              type: "multipleChoice",
              order: 20,
              question: `What is the primary difference between confidentiality and privilege?`,
              options: [
                { text: `Confidentiality is an ethical obligation; privilege is a legal right`, isCorrect: false },
                { text: `Confidentiality applies to therapy; privilege applies to medical treatment`, isCorrect: false },
                { text: `Confidentiality is absolute; privilege has exceptions`, isCorrect: true },
                { text: `Confidentiality belongs to the therapist; privilege belongs to the state`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 21,
              question: `The Tarasoff case established:`,
              options: [
                { text: `The right of clients to access their records`, isCorrect: true },
                { text: `The duty to protect identifiable third parties from serious threats`, isCorrect: false },
                { text: `The requirement to report child abuse`, isCorrect: false },
                { text: `The standards for maintaining electronic records`, isCorrect: false },
              ],
              correctAnswer: 0,
            },
{
              type: "multipleChoice",
              order: 22,
              question: `According to HIPAA's minimum necessary standard, counselors should:`,
              options: [
                { text: `Never disclose any client information`, isCorrect: false },
                { text: `Disclose only information the client specifically authorizes`, isCorrect: true },
                { text: `Disclose only the minimum information needed for the purpose`, isCorrect: false },
                { text: `Disclose complete records whenever disclosure is required`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 23,
              question: `For mandated reporting of child abuse, the required standard of evidence is typically:`,
              options: [
                { text: `Proof beyond a reasonable doubt`, isCorrect: false },
                { text: `Clear and convincing evidence`, isCorrect: false },
                { text: `Preponderance of evidence`, isCorrect: true },
                { text: `Reasonable suspicion`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 24,
              question: `When faced with a difficult confidentiality decision, a counselor's first step should be to:`,
              options: [
                { text: `Break confidentiality to be safe`, isCorrect: true },
                { text: `Consult with the client's family`, isCorrect: false },
                { text: `Identify the specific issue and conflicting obligations`, isCorrect: false },
                { text: `Contact the licensing board for guidance`, isCorrect: false },
              ],
              correctAnswer: 0,
            }
      ]
    },
    {
      order: 5,
      title: `Module 5: Navigating Dual and Multiple Relationships`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 5: Navigating Dual and Multiple Relationships`,
              subtitle: `Ethics and Professional Boundaries in Counseling Practice`,
              sectionNumber: 5,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Understanding Dual Relationships</h2>
<p>A dual or multiple relationship exists when a counselor is in a professional role with a client while simultaneously being in another relationship with the same person. The "other" relationship might be social, familial, business, financial, or otherwise involve a different kind of connection than the therapeutic relationship. Dual relationships may arise in various ways: they may preexist the counseling relationship (a counselor begins seeing someone they already know), develop during counseling (a counselor and client discover a mutual connection), or occur after counseling ends (a former client becomes a colleague).</p>
<p>The ACA Code of Ethics addresses dual relationships primarily in Standard A.5, which acknowledges their complexity. The Code states that counselors should "avoid entering into nonprofessional relationships with current clients, their romantic partners, or their family members when the interaction could be potentially harmful to the client" and directs counselors to "be aware of their influential positions with respect to clients, and they avoid exploiting the trust and dependency of clients."</p>
<p>Importantly, the Code does not prohibit all dual relationships—only those that are potentially harmful or exploitative. It also acknowledges that some dual relationships may be unavoidable, particularly in small communities, and provides guidance for managing such situations appropriately.</p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>Why Dual Relationships Are Ethically Significant</h2>
<p>Dual relationships raise ethical concerns for several interconnected reasons:</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Power Differential and Exploitation Risk</h2>
<p>The therapeutic relationship involves an inherent power imbalance. Clients share vulnerabilities, develop dependency, and often experience intense transference feelings. When counselors have other relationships with clients, the power dynamics of the therapy can leak into those other contexts, creating opportunities for exploitation. A business relationship with a client might lead to financial exploitation enabled by the client's trust in their counselor.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Objectivity and Therapeutic Effectiveness</h2>
<p>When counselors have other relationships with clients, their ability to maintain therapeutic objectivity may be compromised. A counselor treating a friend may find it difficult to confront problematic behaviors or to explore painful material. A counselor who has business dealings with a client may hesitate to address issues that might jeopardize the business relationship. This compromise of objectivity can harm therapeutic effectiveness.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Blurred Boundaries and Role Confusion</h2>
<p>Multiple relationships can create confusion about roles and expectations. When a client encounters their counselor in a social context, how should they interact? What information from social encounters belongs in therapy? How should the counselor manage confidentiality? This boundary confusion can disrupt the therapeutic frame and compromise treatment.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Harm When Relationships Go Wrong</h2>
<p>When one component of a dual relationship goes badly, it may contaminate the other. If a counselor and former client enter a business relationship that sours, this may damage the therapeutic gains achieved and cause emotional harm to the former client. If a social relationship develops conflict, it may make therapy uncomfortable or untenable.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Categories of Dual Relationships</h2>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Social Relationships</h2>
<p>Social dual relationships occur when counselors and clients interact socially—whether through existing friendship networks, community involvement, or other social connections. In some settings (small towns, religious communities, specialized professional fields), some degree of social overlap may be unavoidable. The key question is whether the social interaction is likely to harm the therapeutic relationship or the client.</p>
<p>Counselors should be cautious about initiating social relationships with clients and should carefully consider the implications before accepting clients who are already part of their social network. When social overlap is unavoidable, the counselor should discuss the situation with the client, establish clear guidelines for managing the dual connection, and monitor for any negative impact on therapy.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Business and Financial Relationships</h2>
<p>Business relationships with clients—such as hiring a client, being hired by a client, entering partnerships, or engaging in commercial transactions—carry significant risks and are generally inadvisable. The financial interests involved can distort therapeutic judgment and create conflicts of interest. The ACA Code of Ethics specifically prohibits counselors from engaging in bartering "unless such arrangements can be clearly justified as beneficial and not exploitative" (A.10.e).</p>
<p>Special considerations apply to practices in which clients may wish to use professional services offered by the counselor outside of counseling (for example, if a counselor also offers coaching, consulting, or education services). Clear boundaries and explicit discussions are necessary to prevent confusion.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Familial and Romantic Relationships</h2>
<p>Treating family members or romantic partners raises immediate concerns about objectivity and creates potential for significant harm. Most counselors avoid treating their own family members, though in emergency situations brief intervention might be appropriate before arranging alternative care.</p>
<p>Romantic relationships with clients are absolutely prohibited. The ACA Code forbids sexual or romantic relationships with current clients and prohibits such relationships with former clients for a minimum of five years. Even after five years, counselors must demonstrate that the relationship is not exploitative.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Professional and Collegial Relationships</h2>
<p>Counselors may find themselves treating colleagues, supervisees, students, or others with whom they have professional relationships. These situations require careful consideration of power dynamics and potential conflicts of interest. Treating one's own students or supervisees is generally inappropriate due to the evaluative component of those relationships.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Community Relationships</h2>
<p>In small communities—whether geographic, religious, ethnic, or professional—counselors may encounter clients in multiple roles. The local counselor may attend the same church, shop at the same stores, and participate in the same community events as clients. These overlapping roles require thoughtful management but do not necessarily preclude effective counseling.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Managing Unavoidable Dual Relationships</h2>
<p>When dual relationships cannot be avoided, the ACA Code provides guidance for managing them ethically:</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Take Responsibility</h2>
<p>Counselors bear responsibility for managing dual relationships appropriately. Even if the client initiates a dual connection or seeks to develop a nonprofessional relationship, the counselor must set appropriate limits.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Document and Consult</h2>
<p>When dual relationships exist or are anticipated, counselors should document the situation, the potential risks, the steps taken to mitigate harm, and any consultations obtained. Seeking consultation from colleagues or supervisors can help identify blind spots and demonstrate appropriate diligence.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Discuss with Clients</h2>
<p>Transparent discussion with clients about dual relationships and their implications supports informed consent and helps establish appropriate boundaries. Clients should understand how the counselor will manage the dual roles and what to expect in various contexts.</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Monitor for Harm</h2>
<p>Counselors should remain vigilant for any signs that the dual relationship is negatively affecting therapy or the client. This includes attending to the client's experience, the therapeutic relationship, and the counselor's own objectivity.</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Set Clear Boundaries</h2>
<p>When dual relationships exist, clear boundaries help maintain the integrity of the therapeutic relationship. This might include agreements about how to interact in social contexts, how to handle confidentiality when others are present, and how to manage situations where the different relationships might conflict.</p>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Practical Strategies for Common Dual Relationship Scenarios</h2>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Incidental Encounters</h2>
<p>Running into clients in public is inevitable for most counselors. Preparing for these encounters helps manage them appropriately:</p>
<p>Before encountering clients in public, counselors should discuss with clients during intake how they prefer such encounters to be handled. Some clients prefer that the counselor not acknowledge them unless the client initiates contact (to protect confidentiality); others prefer a brief acknowledgment. Establishing expectations in advance prevents awkward situations.</p>
<p>When encounters occur, counselors should follow the client's stated preferences if known. If not established, the safest approach is typically to allow the client to initiate any interaction. Counselors should keep any public interaction brief and superficial, avoiding discussion of treatment-related matters.</p>
<p>After encounters, the interaction should be processed in the next therapy session to address any impact on the therapeutic relationship and clarify boundaries for future encounters.</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Gift-Giving</h2>
<p>Clients sometimes offer gifts to their counselors, creating situations that require careful consideration:</p>
<p>The meaning of the gift matters. A small token of appreciation at termination has different implications than an expensive gift early in treatment or a gift given during a period when the client is dissatisfied with therapy. Cultural factors are also relevant—in some cultures, gift-giving is an expected expression of respect.</p>
<p>General guidelines include: accepting inexpensive, culturally-appropriate gifts graciously while declining expensive or inappropriate gifts; exploring the meaning of the gift therapeutically; documenting significant gift situations; and consulting when uncertain.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Social Media and Online Interactions</h2>
<p>The digital age creates new forms of potential dual relationships:</p>
<p>Counselors should generally not accept friend or connection requests from current clients on personal social media accounts. This boundary should be explained during informed consent.</p>
<p>Professional social media presence (LinkedIn, professional Facebook pages) may involve different considerations. Counselors should still carefully consider whether connecting with clients on professional platforms is appropriate.</p>
<p>If clients follow or interact with counselors' public professional content, this should be discussed in therapy to address any boundary implications.</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Small Community Practice</h2>
<p>Practicing in small communities requires accepting that some overlap will occur while maintaining appropriate boundaries:</p>
<p>Before accepting clients, counselors should carefully assess existing relationships and potential for problematic overlap. Some relationships may preclude accepting someone as a client; others may be manageable.</p>
<p>Clear informed consent discussions should address the specific community context and how the counselor will manage overlapping relationships.</p>
<p>Counselors may need to recuse themselves from community roles that would create problematic conflicts—for example, declining to serve on a committee where a client is also a member.</p>
<p>Regular consultation with colleagues outside the community can provide perspective that is harder to achieve from within.</p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>When to Refer: Recognizing Unmanageable Dual Relationships</h2>
<p>Despite best efforts, some dual relationships become unmanageable and require referral to another provider. Signs that referral may be necessary include:</p>
<ul>
<li>The counselor's objectivity is significantly compromised</li>
<li>The dual relationship is causing distress to the client or counselor</li>
<li>The therapeutic relationship has deteriorated due to the dual relationship</li>
<li>The counselor cannot maintain appropriate boundaries</li>
<li>Consultation indicates that the situation is not manageable</li>
</ul>
<p>When referral is necessary, counselors should handle the transition thoughtfully, ensuring continuity of care and processing the termination appropriately with the client.</p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>Role Transitions and Sequential Relationships</h2>
<p>Special considerations arise when the nature of a relationship changes over time. Examples include:</p>
<p><strong>Friend-to-client transitions</strong>: When someone in a counselor's social network seeks to become a client, the counselor must consider whether the existing relationship would compromise therapeutic effectiveness. In many cases, referral to another counselor is appropriate.</p>
<p><strong>Client-to-friend transitions</strong>: After therapy ends, clients and counselors may encounter each other socially or consider developing friendships. These post-therapy social relationships carry risks, particularly if they develop soon after termination when the power differential and transference dynamics may still be significant.</p>
<p><strong>Supervisee-to-client transitions</strong>: When a supervisee seeks personal therapy from their supervisor, the evaluative nature of supervision creates problems. The supervisee may not be able to freely engage in therapy while knowing their clinical work is being evaluated by the same person.</p>
<p><strong>Colleague-to-client transitions</strong>: Treating colleagues or employees raises objectivity concerns and may affect the professional relationship regardless of how therapy proceeds.</p>
<p>In considering any role transition, counselors should evaluate: the time elapsed since the prior relationship; the nature and intensity of the prior relationship; the potential for harm; the client's vulnerability; the availability of alternative arrangements; and whether the transition serves the client's therapeutic interests.</p>`,
            },
{
              type: "callout",
              order: 27,
              calloutType: "clinical",
              title: `Case Study: Multiple Relationship Dilemma`,
              content: `<p>Dr. Rachel Torres is a licensed professional counselor in a small mountain community. She has been seeing Linda for treatment of depression and marital difficulties. One Saturday, Dr. Torres attends a local craft fair where she encounters Linda running a booth selling handmade jewelry. Linda is delighted to see her counselor and enthusiastically shows her the jewelry collection. Linda mentions that she has been struggling financially and that sales at the craft fair are an important source of income.</p>
<p>Dr. Torres notices that Linda makes beautiful pieces and reasonable prices. She genuinely would like to purchase a necklace for her sister's birthday. However, she is aware that purchasing from Linda would create a business transaction within the therapeutic relationship.</p>
<p><strong>Analysis using ethical principles:</strong></p>
<p><strong>Beneficence and nonmaleficence</strong>: Would the purchase benefit Linda without harming her? The financial benefit might be meaningful. However, the purchase might create a sense of obligation, blur boundaries, or affect Linda's ability to freely discuss financial issues in therapy.</p>
<p><strong>Autonomy</strong>: Linda is freely offering her wares; purchasing respects her autonomy as a businessperson. However, the transference dynamics of therapy complicate notions of freedom in this interaction.</p>
<p><strong>Fidelity</strong>: Dr. Torres has an obligation to maintain the therapeutic relationship's integrity. A purchase is unlikely to constitute a significant breach of fidelity, but it does add a layer to the relationship.</p>
<p><strong>Applying codes and guidelines</strong>: The ACA Code doesn't prohibit all business transactions but warns against bartering unless "clearly justified as beneficial and not exploitative." A one-time purchase at market rates differs from an ongoing business relationship or bartering arrangement.</p>
<p><strong>Considering context</strong>: In a small community, some degree of economic overlap with clients may be inevitable. Complete avoidance might require purchasing nothing locally.</p>
<p><strong>Consultation value</strong>: Dr. Torres might consider what a trusted colleague would advise.</p>
<p><strong>Possible courses of action</strong>:</p>
<ol>
<li>Do not make the purchase to maintain strict boundaries</li>
<li>Make the purchase if it can be done naturally without special treatment, then process the encounter in the next session</li>
<li>Acknowledge Linda warmly but explain that she generally keeps her professional and personal life separate, without making a purchase</li>
</ol>
<p>Each option has merits. The key is that Dr. Torres should think through the implications carefully, not act purely on impulse, and be prepared to address the encounter therapeutically.</p>`,
            },
{
              type: "multipleChoice",
              order: 28,
              question: `According to the ACA Code of Ethics, which of the following statements about dual relationships is accurate?`,
              options: [
                { text: `All dual relationships with current clients are prohibited`, isCorrect: true },
                { text: `Counselors should avoid dual relationships that are potentially harmful`, isCorrect: false },
                { text: `Dual relationships are only permitted in rural settings`, isCorrect: false },
                { text: `The prohibition on dual relationships ends immediately when therapy terminates`, isCorrect: false },
              ],
              correctAnswer: 0,
            },
{
              type: "multipleChoice",
              order: 29,
              question: `What is the PRIMARY ethical concern with dual relationships?`,
              options: [
                { text: `They violate HIPAA regulations`, isCorrect: false },
                { text: `They create risk of exploitation due to power differential`, isCorrect: true },
                { text: `They are illegal in most states`, isCorrect: false },
                { text: `They always lead to sexual relationships`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 30,
              question: `When dual relationships are unavoidable, counselors should:`,
              options: [
                { text: `Terminate the therapeutic relationship immediately`, isCorrect: false },
                { text: `Consult, document, discuss with clients, and monitor for harm`, isCorrect: false },
                { text: `Avoid all contact outside of sessions`, isCorrect: true },
                { text: `Report the situation to the licensing board`, isCorrect: false },
              ],
              correctAnswer: 2,
            },
{
              type: "multipleChoice",
              order: 31,
              question: `Which type of relationship with a current client is absolutely prohibited?`,
              options: [
                { text: `Social acquaintance`, isCorrect: false },
                { text: `Business transaction`, isCorrect: true },
                { text: `Sexual or romantic relationship`, isCorrect: false },
                { text: `Religious community membership`, isCorrect: false },
              ],
              correctAnswer: 1,
            },
{
              type: "multipleChoice",
              order: 32,
              question: `In considering whether to accept a friend as a client, the counselor should PRIMARILY consider:`,
              options: [
                { text: `Whether the friend can afford the fees`, isCorrect: false },
                { text: `Whether the existing relationship would compromise therapeutic effectiveness`, isCorrect: false },
                { text: `Whether other friends will also want to become clients`, isCorrect: true },
                { text: `Whether the friend lives in the same neighborhood`, isCorrect: false },
              ],
              correctAnswer: 2,
            }
      ]
    },
    {
      order: 6,
      title: `Module 6: Building Your Ethical Practice Plan`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 6: Building Your Ethical Practice Plan`,
              subtitle: `Ethics and Professional Boundaries in Counseling Practice`,
              sectionNumber: 6,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Introduction: Proactive Ethics</h2>
<p>Throughout this course, we have examined ethical principles, decision-making models, and specific areas of ethical concern. This final module shifts from reactive ethics—responding to dilemmas as they arise—to proactive ethics—developing systems, habits, and commitments that support ethical practice before problems emerge.</p>
<p>Ethical practice is not simply about avoiding disciplinary action or malpractice suits. It is about embodying the values of the profession, honoring the trust clients place in us, and contributing to a professional culture that prioritizes client welfare. Building an ethical practice plan involves reflecting on your current practices, identifying areas for growth, establishing systems that support ethical behavior, and committing to ongoing development.</p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>Components of an Ethical Practice Plan</h2>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>Regular Self-Assessment</h2>
<p>Ethical practitioners regularly examine their own practice for potential concerns. This might involve periodic review of caseload composition (are there clients you avoid or look forward to inappropriately?), examination of boundary practices across clients (are boundaries consistent or do certain clients receive special treatment?), honest appraisal of competence (are you practicing within your areas of expertise?), and attention to personal wellbeing (are you impaired or at risk of impairment?).</p>
<p>Self-assessment should be honest and unflinching. Most counselors will find areas of concern if they look honestly—perhaps a dual relationship that wasn't carefully considered, documentation that has fallen behind, continuing education that has been neglected, or countertransference that has not been addressed. Finding these concerns through self-assessment allows them to be addressed before they become serious problems.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Ongoing Consultation and Supervision</h2>
<p>Even experienced practitioners benefit from regular consultation with colleagues. Consultation provides outside perspectives on clinical and ethical decisions, reality-testing for situations where the counselor may have blind spots, support when facing difficult situations, and modeling of ethical reasoning by respected colleagues.</p>
<p>Building a consultation network—whether through formal supervision, peer consultation groups, or informal relationships with trusted colleagues—should be part of every counselor's practice infrastructure. Counselors should use this network proactively, not waiting until crises emerge.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Continuing Education</h2>
<p>Maintaining competence requires ongoing education. Ethical practice plans should include: staying current with evolving standards and regulations, developing expertise in new treatment approaches, addressing gaps in cultural competence, and learning about emerging ethical challenges (such as those arising from technology).</p>
<p>The commitment to lifelong learning reflects humility about the limits of current knowledge and dedication to providing clients with the best possible care.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Documentation Systems</h2>
<p>Adequate documentation serves multiple functions: clinical (maintaining continuity of care, tracking progress), legal (providing evidence of appropriate practice), and ethical (demonstrating thoughtful decision-making). Ethical practice plans should address documentation of informed consent, treatment planning and progress, consultations obtained, ethical decisions and their rationale, and boundary decisions.</p>
<p>Documentation should be timely, accurate, and sufficient to support clinical care and demonstrate appropriate practice if later questioned.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Self-Care and Impairment Prevention</h2>
<p>The ACA Code of Ethics requires counselors to refrain from practicing when impaired (C.2.g). Preventing impairment requires attention to self-care—maintaining physical health, managing stress, addressing personal emotional issues, maintaining work-life balance, and recognizing early warning signs of burnout or impairment.</p>
<p>Ethical practice plans should include specific self-care commitments: regular exercise, adequate sleep, meaningful relationships outside of work, personal therapy when needed, and reasonable limits on work hours and caseload size.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Creating Your Personal Ethical Practice Plan</h2>
<p>The following questions can guide development of your personal ethical practice plan:</p>
<p><strong>Self-Assessment</strong></p>
<ul>
<li>When will you conduct regular reviews of your practice?</li>
<li>What specific areas will you examine?</li>
<li>What criteria will indicate that a concern needs to be addressed?</li>
</ul>
<p><strong>Consultation</strong></p>
<ul>
<li>Who are the colleagues you will turn to for consultation?</li>
<li>How will you access consultation—formal supervision, peer groups, informal relationships?</li>
<li>What situations will prompt you to seek consultation?</li>
</ul>
<p><strong>Competence</strong></p>
<ul>
<li>What are your current areas of competence?</li>
<li>What areas need development?</li>
<li>What continuing education will you pursue in the coming year?</li>
</ul>
<p><strong>Documentation</strong></p>
<ul>
<li>Are your documentation practices adequate?</li>
<li>What improvements are needed?</li>
<li>How will you ensure documentation remains current?</li>
</ul>
<p><strong>Self-Care</strong></p>
<ul>
<li>What are your current self-care practices?</li>
<li>What warning signs might indicate you are at risk for impairment?</li>
<li>What commitments will you make to maintain your wellbeing?</li>
</ul>
<p><strong>Boundary Management</strong></p>
<ul>
<li>How will you monitor for boundary concerns?</li>
<li>What policies do you have regarding common boundary issues (gifts, contact outside sessions, social media, etc.)?</li>
<li>When do boundary decisions warrant documentation or consultation?</li>
</ul>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Addressing Common Ethical Challenges Proactively</h2>
<p>Experienced counselors know that certain ethical challenges arise repeatedly in practice. Developing policies and approaches for these common situations before they occur reduces stress and supports better decision-making.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Informed Consent Procedures</h2>
<p>Develop a comprehensive informed consent process that covers all elements required by your licensing board and the ACA Code of Ethics. Include information about theoretical orientation, treatment methods, confidentiality limits, fees and billing practices, emergency procedures, and client rights. Consider how you will adapt informed consent for clients with varying literacy levels or language needs. Review and update your informed consent documents annually.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Confidentiality Policies</h2>
<p>Establish clear policies about what information you will release, to whom, and under what circumstances. Develop release of information forms that comply with HIPAA requirements. Know your state's laws regarding confidentiality, privilege, and mandated reporting. Have policies for handling subpoenas and court orders. Plan how you will manage confidentiality in special circumstances (minor clients, couples, groups).</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Record-Keeping Practices</h2>
<p>Develop systematic record-keeping practices that document assessment, treatment planning, interventions, and progress. Establish routines that ensure documentation is completed promptly. Know how long records must be retained under your state's requirements. Have secure storage and destruction practices. Plan for what will happen to your records if you become incapacitated or pass away.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Crisis and Emergency Procedures</h2>
<p>Establish procedures for handling client crises, including suicidal ideation, threats to others, and psychiatric emergencies. Know the resources available in your community. Have clear policies about after-hours contact and emergency coverage. Ensure clients know how to reach help when you are unavailable.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Boundary Policies</h2>
<p>Develop clear policies regarding common boundary issues: gifts, social media contact, incidental encounters, attendance at client life events, and self-disclosure. Having thought through these issues in advance allows you to respond consistently and thoughtfully when they arise.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Continuing Education Planning</h2>
<p>Develop a continuing education plan that addresses not only license renewal requirements but also genuine competence development. Identify gaps in your training and knowledge. Stay current with developments in your specialty areas. Pursue training in emerging ethical challenges (technology, diversity, etc.).</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>The Ethical Decision-Making Toolkit</h2>
<p>As you conclude this course, consider creating a personal toolkit for ethical decision-making that you can reference when facing dilemmas. This toolkit might include:</p>
<ol>
<li><strong>Decision-making model reference</strong>: A summary of your preferred decision-making model (Forester-Miller & Davis, Wheeler & Bertram, or another) that you can work through when facing difficult decisions.</li>
</ol>
<ol>
<li><strong>Code of Ethics access</strong>: Bookmarked links or physical copies of the ACA Code of Ethics and any specialty codes relevant to your practice.</li>
</ol>
<ol>
<li><strong>Consultation contacts</strong>: A list of colleagues you can call for consultation, including contact information and areas of expertise.</li>
</ol>
<ol>
<li><strong>Legal resources</strong>: Contact information for an attorney familiar with mental health law in your jurisdiction, or your professional liability insurance company's consultation line.</li>
</ol>
<ol>
<li><strong>Ethics committee contacts</strong>: Information for ACA's ethics committee and your state licensing board's ethics resources.</li>
</ol>
<ol>
<li><strong>Documentation templates</strong>: Templates for documenting ethical decision-making, boundary decisions, and other ethical matters.</li>
</ol>`,
            },
{
              type: "reflection",
              order: 18,
              prompt: `Reflection Activity: Your Ethical Vision`,
              content: `<p>As a concluding reflection, consider the following questions:</p>
<ol>
<li>What kind of ethical practitioner do you want to be? Beyond simply following rules, what values do you want to embody in your practice?</li>
</ol>
<ol>
<li>What are the greatest ethical challenges you face in your current practice or anticipate facing in the future?</li>
</ol>
<ol>
<li>What resources and supports do you need to practice ethically? What steps will you take to obtain those resources?</li>
</ol>
<ol>
<li>How will you know if you are succeeding in maintaining ethical practice? What indicators will you monitor?</li>
</ol>
<ol>
<li>If you faced a serious ethical dilemma tomorrow, what would you do? Walk through the steps you would take.</li>
</ol>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Conclusion: Ethics as Professional Identity</h2>
<p>This course has covered substantial ground: the foundational principles of counseling ethics, systematic approaches to ethical decision-making, the complexities of professional boundaries, the requirements of confidentiality and its exceptions, and the challenges of multiple relationships. You have engaged with case studies that illustrate how these concepts apply in practice and have been encouraged to reflect on your own ethical development.</p>
<p>As you complete this course, remember that ethics is not simply a set of rules to memorize but a way of being in the counseling profession. Ethical practice emerges from character, from internalized values, from commitment to client welfare, and from the courage to do what is right even when it is difficult.</p>
<p>The ethical challenges you face will not always have clear answers. You will face situations where reasonable counselors might disagree, where competing values pull in different directions, where the stakes are high and the path uncertain. In these moments, the tools you have developed in this course—knowledge of principles and codes, systematic decision-making approaches, commitment to consultation, and self-awareness about your own values and limitations—will serve you well.</p>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>The Integration of Personal and Professional Ethics</h2>
<p>One hallmark of mature ethical practice is the integration of personal values with professional standards. Early in their careers, counselors may experience ethical codes as external constraints—rules imposed from outside that must be followed to avoid sanctions. As counselors develop, they increasingly integrate ethical principles into their professional identity, experiencing ethical practice not as compliance but as authentic expression of their values.</p>
<p>This integration does not mean that personal values always align perfectly with professional requirements. Counselors may hold personal beliefs about topics like abortion, LGBTQ+ issues, or substance use that differ from professional standards of nonjudgmental acceptance. In such cases, professional ethics require that counselors either provide competent, unbiased care or make appropriate referrals—they may not impose their personal values on clients. The integration of personal and professional ethics involves recognizing this boundary while still bringing one's authentic self to therapeutic work.</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Ethics in the Service of Clients</h2>
<p>Ultimately, counseling ethics exist to serve clients. Every provision of the ethical code, every principle discussed in this course, every guideline for decision-making connects to the fundamental commitment to protect and promote client welfare. When ethical requirements seem burdensome or inconvenient, counselors should remember this purpose. The client who trusts their counselor with their deepest vulnerabilities deserves a practitioner who takes ethical obligations seriously.</p>
<p>This client-centered perspective can help resolve ethical dilemmas. When uncertain about the right course of action, counselors can ask: "What serves my client's genuine welfare?" This question does not always yield clear answers—sometimes different aspects of client welfare pull in different directions—but it keeps the focus where it belongs.</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>The Ongoing Journey</h2>
<p>Ethical development does not end with completion of a continuing education course. It is a lifelong journey of learning, reflection, and growth. The counselors who maintain the highest ethical standards throughout their careers are those who remain curious about ethical issues, who continue seeking consultation and supervision, who engage honestly with their own limitations, and who view ethical challenges as opportunities for professional development rather than merely obstacles to navigate.</p>
<p>Thank you for your commitment to ethical practice. Your clients, your colleagues, and the counseling profession are well served by practitioners who take ethics seriously.</p>`,
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
              content: `<h2>Key Takeaways</h2>
<p>This course has examined the ethical foundations essential to professional counseling practice. Across six modules, you have explored the core ethical principles that govern the counseling profession, systematic models for ethical decision-making, the complexities of professional boundaries, the requirements of confidentiality and its legal exceptions, the challenges of multiple relationships, and the practical elements of building a personal ethical practice plan.</p>
<p>Several themes have recurred throughout this course. First, ethical practice is not simply about following rules but about developing the moral reasoning capacity to navigate novel situations where rules provide incomplete guidance. Second, consultation is both an ethical obligation and a practical resource—when facing dilemmas, counselors should seek input from colleagues, supervisors, and professional ethics resources. Third, documentation serves both ethical and practical functions, creating a record of thoughtful decision-making that protects clients and counselors alike. Fourth, self-awareness about personal values, biases, and emotional reactions is essential for ethical practice. What we bring to the therapeutic relationship always shapes how we engage with ethical challenges.</p>
<p>The ACA Code of Ethics provides the primary framework for professional conduct but cannot replace the judgment of an ethically developed practitioner. Use the code as a starting point, not a final answer, when navigating complex situations. Supplement it with systematic decision-making models, consultation, and honest self-reflection.</p>`,
            },
{
              type: "reflection",
              order: 3,
              prompt: `Course-Level Reflection: Your Ethical Practice Commitment`,
              content: `<p>As you complete this course, consider writing a brief personal ethical practice statement that captures your commitments to ethical counseling. What values do you want to embody? What specific practices will you implement to maintain ethical standards? How will you handle situations where ethics and other pressures conflict? Consider sharing this statement with a trusted colleague or supervisor as an act of professional accountability.</p>`,
            },
{
              type: "resources",
              order: 4,
              resources: [
                { title: `ACA Code of Ethics (2014)`, url: `https://www.counseling.org/resources/aca-code-of-ethics.pdf`, type: "pdf" },
                { title: `ACA Ethics Resources`, url: `https://www.counseling.org/knowledge-center/ethics`, type: "website" },
                { title: `NBCC Ethics Resources`, url: `https://www.nbcc.org/Ethics`, type: "website" },
                { title: `Ethics Desk Reference for Counselors (Barnett & Johnson)`, url: `#`, type: "book" },
                { title: `The Counselor and the Law (Wheeler & Bertram)`, url: `#`, type: "book" },
              ],
            },
{
              type: "text",
              order: 5,
              content: `<div class="cr-references"><h3>References</h3>
<p class="cr-reference">American Counseling Association. (2014). ACA code of ethics. Author.</p>
<p class="cr-reference">Barnett, J. E., & Johnson, W. B. (2015). Ethics desk reference for counselors (2nd ed.). American Counseling Association.</p>
<p class="cr-reference">Corey, G., Corey, M. S., & Corey, C. (2019). Issues and ethics in the helping professions (10th ed.). Cengage Learning.</p>
<p class="cr-reference">Cottone, R. R., & Claus, R. E. (2000). Ethical decision-making models: A review of the literature. Journal of Counseling & Development, 78(3), 275-283.</p>
<p class="cr-reference">Fisher, M. A. (2016). Confidentiality and record keeping. In S. J. Knapp, M. C. Gottlieb, M. M. Handelsman, & L. D. VandeCreek (Eds.), APA handbook of ethics in psychology (Vol. 1, pp. 333-374). American Psychological Association.</p>
<p class="cr-reference">Forester-Miller, H., & Davis, T. (1996). A practitioner's guide to ethical decision making. American Counseling Association.</p>
<p class="cr-reference">Gabbard, G. O., & Nadelson, C. (1995). Professional boundaries in the physician-patient relationship. JAMA, 273(18), 1445-1449.</p>
<p class="cr-reference">Gutheil, T. G., & Brodsky, A. (2008). Preventing boundary violations in clinical practice. Guilford Press.</p>
<p class="cr-reference">Gutheil, T. G., & Gabbard, G. O. (1993). The concept of boundaries in clinical practice: Theoretical and risk-management dimensions. American Journal of Psychiatry, 150(2), 188-196.</p>
<p class="cr-reference">Herlihy, B., & Corey, G. (2015). Boundary issues in counseling: Multiple roles and responsibilities (3rd ed.). American Counseling Association.</p>
<p class="cr-reference">Kitchener, K. S. (1984). Intuition, critical evaluation and ethical principles: The foundation for ethical decisions in counseling psychology. Counseling Psychologist, 12(3), 43-55.</p>
<p class="cr-reference">Pope, K. S., & Vasquez, M. J. T. (2016). Ethics in psychotherapy and counseling: A practical guide (5th ed.). John Wiley & Sons.</p>
<p class="cr-reference">Remley, T. P., Jr., & Herlihy, B. (2020). Ethical, legal, and professional issues in counseling (6th ed.). Pearson.</p>
<p class="cr-reference">Smith, D., & Fitzpatrick, M. (1995). Patient-therapist boundary issues: An integrative review of theory and research. Professional Psychology: Research and Practice, 26(5), 499-506.</p>
<p class="cr-reference">Tarasoff v. Regents of University of California, 17 Cal. 3d 425 (1976).</p>
<p class="cr-reference">Welfel, E. R. (2016). Ethics in counseling and psychotherapy: Standards, research, and emerging issues (6th ed.). Cengage Learning.</p>
<p class="cr-reference">Wheeler, A. M., & Bertram, B. (2022). The counselor and the law: A guide to legal and ethical practice (8th ed.). American Counseling Association.</p>
<p class="cr-reference">Zur, O. (2017). Boundaries in psychotherapy: Ethical and clinical explorations. American Psychological Association.</p>
</div>`,
            }
      ]
    }
  ]
};

// ─── UPSERT ─────────────────────────────────────────────────────────────────
const existing = await col.findOne({ slug: course.slug });
if (existing) {
  await col.updateOne({ _id: existing._id }, { $set: course });
  console.log(`✅ UPDATED: ${course.title}`);
} else {
  await col.insertOne(course);
  console.log(`✅ INSERTED: ${course.title}`);
}

// ─── STATS ───────────────────────────────────────────────────────────────────
const saved = await col.findOne({ slug: course.slug }, {
  projection: { title: 1, ceHours: 1, 'sections': 1, 'assessment.questions': 1 }
});
const totalBlocks = (saved.sections || []).reduce((s, sec) => s + (sec.contentBlocks || []).length, 0);
const examQs = (saved.assessment?.questions || []).length;
console.log(`\n=== CR-201 STATS ===`);
console.log(`Sections: ${(saved.sections || []).length} | Blocks: ${totalBlocks} | Exam Qs: ${examQs}`);
console.log(`CE Hours: ${saved.ceHours} | Source words: 18,034`);
console.log(`Status: draft — review before publishing`);

await mongoose.disconnect();
