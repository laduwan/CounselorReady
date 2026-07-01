/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// scripts/updateEthicsCourse.js
// Expanded Ethics course - 3 CE Hours
// Run: node src/scripts/updateEthicsCourse.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB error:', error.message);
    process.exit(1);
  }
};

const ethicsCourse = {
  title: "Navigating Ethical Dilemmas in Clinical Practice",
  slug: "navigating-ethical-dilemmas",
  description: "This comprehensive 3-hour ethics course equips mental health professionals with systematic decision-making frameworks for navigating complex ethical situations. Through case studies, interactive scenarios, and practical exercises, participants will explore confidentiality and its limits, dual relationships and boundary management, informed consent requirements, documentation best practices, and strategies for ethical consultation. This course meets ethics CE requirements for most state licensing boards and provides actionable tools clinicians can immediately apply in practice.",
  thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
  ceHours: 3,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Clinical Social Workers", "Psychologists", "Marriage and Family Therapists", "Substance Abuse Counselors"],
  categories: ["Ethics", "Professional Practice", "Legal Issues"],
  tags: ["ethics", "confidentiality", "boundaries", "documentation", "informed consent", "dual relationships", "Tarasoff", "HIPAA"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  
  // ACEP REQUIRED: Learning Objectives
  learningObjectives: [
    "Apply a systematic seven-step ethical decision-making framework to complex clinical situations",
    "Identify and apply the five core ethical principles (beneficence, nonmaleficence, autonomy, justice, fidelity) in clinical practice",
    "Distinguish between mandatory and permissive exceptions to confidentiality across different clinical contexts",
    "Evaluate dual relationship scenarios using established risk assessment criteria and document decision-making",
    "Demonstrate understanding of informed consent as an ongoing process and implement best practices",
    "Apply documentation standards that demonstrate appropriate standard of care",
    "Analyze case studies involving ethical dilemmas and formulate appropriate, defensible responses",
    "Identify appropriate consultation resources and understand when consultation is ethically required"
  ],
  
  // ACEP REQUIRED: Instructor Credentials
  instructorCredentials: {
    name: "Kejuiana Johnson, MA, LPC, CPCS, BC-TMH",
    credentials: "Licensed Professional Counselor, Certified Professional Counselor Supervisor, Board Certified in Telemental Health",
    organization: "GA Integrated Therapeutic Perspectives LLC",
    bio: "Kejuiana Johnson is a licensed mental health professional with extensive experience in clinical supervision and ethical practice. She is the founder of CounselorReady, an NBCC-approved continuing education provider dedicated to delivering high-quality professional development for mental health clinicians."
  },
  
  // ACEP REQUIRED: Bibliography/References
  bibliography: [
    { citation: "American Counseling Association. (2014). ACA Code of Ethics. Alexandria, VA: Author.", type: "code" },
    { citation: "Corey, G., Corey, M. S., & Corey, C. (2019). Issues and ethics in the helping professions (10th ed.). Cengage Learning.", type: "book" },
    { citation: "Welfel, E. R. (2016). Ethics in counseling and psychotherapy: Standards, research, and emerging issues (6th ed.). Cengage Learning.", type: "book" },
    { citation: "Pope, K. S., & Vasquez, M. J. T. (2016). Ethics in psychotherapy and counseling: A practical guide (5th ed.). John Wiley & Sons.", type: "book" },
    { citation: "Tarasoff v. Regents of the University of California, 17 Cal. 3d 425, 551 P.2d 334 (1976).", type: "legal" },
    { citation: "Remley, T. P., & Herlihy, B. (2016). Ethical, legal, and professional issues in counseling (5th ed.). Pearson.", type: "book" },
    { citation: "Fisher, M. A. (2016). The ethics of conditional confidentiality: A practice model for mental health professionals. Oxford University Press.", type: "book" },
    { citation: "Barnett, J. E., & Johnson, W. B. (2015). Ethics desk reference for counselors (2nd ed.). American Counseling Association.", type: "book" }
  ],
  
  // ACEP REQUIRED: Completion Requirements
  completionRequirements: {
    passingScore: 80,
    mustCompleteAllModules: true,
    mustPassAssessment: true,
    mustCompleteEvaluation: true,
    description: "To receive CE credit, participants must: (1) Complete all course modules, (2) Pass the final assessment with a score of 80% or higher, and (3) Complete the course evaluation."
  },
  
  // Accessibility & Platform Settings
  settings: {
    linearProgression: false,
    certificateEnabled: true,
    passingScore: 80,
    allowRetakes: true,
    retakePolicy: 'unlimited',
    maxRetakes: 3,
    scorePolicy: 'highest',
    requireEvaluation: true,
    requireAttestation: true,
    narrationEnabled: true,
    narrationVoice: 'nova',
    narrationSpeed: 1.0,
    autoPlayNarration: false,
    translationEnabled: true,
    supportedLanguages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ko', 'vi'],
    defaultLanguage: 'en',
    highContrastSupported: true,
    fontSizeAdjustable: true,
    screenReaderOptimized: true,
    altTextRequired: true
  },
  
  resources: [
    { title: "Ethical Decision-Making Worksheet", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/decision-making-worksheet.pdf", size: "234 KB", description: "Step-by-step worksheet for working through ethical dilemmas" },
    { title: "Confidentiality Exceptions Quick Reference", type: "card", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/confidentiality-exceptions.pdf", size: "178 KB", description: "State-by-state guide to mandatory reporting requirements" },
    { title: "Informed Consent Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/informed-consent-checklist.pdf", size: "156 KB", description: "Comprehensive checklist for informed consent documentation" },
    { title: "Dual Relationship Assessment Tool", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/dual-relationship-assessment.pdf", size: "198 KB", description: "Risk assessment tool for evaluating multiple relationships" },
    { title: "Documentation Audit Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/documentation-audit.pdf", size: "167 KB", description: "Self-audit tool for clinical documentation" }
  ],

  sections: [
    // =========================================================================
    // SECTION 1: FOUNDATIONS OF ETHICAL PRACTICE (35 min)
    // =========================================================================
    {
      title: "Foundations of Ethical Practice",
      description: "Understanding ethical codes, core principles, and systematic decision-making frameworks",
      order: 1,
      estimatedTime: 35,
      thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Foundations of Ethical Practice",
          subtitle: "The Framework for Professional Decision-Making"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Why Ethics Matter in Clinical Practice</h3>
          <p>Ethical practice is the cornerstone of the mental health profession. Our clients come to us in vulnerable states, trusting us with their deepest struggles, their secrets, and often their safety. This trust creates a profound responsibility that goes beyond clinical skill.</p>
          <p>Ethics serve multiple essential functions in our profession:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Client Protection:</strong> Ethical standards exist primarily to protect clients from harm, exploitation, and incompetent practice</li>
            <li><strong>Professional Guidance:</strong> They provide a framework for navigating complex situations where the "right" answer isn't immediately clear</li>
            <li><strong>Public Trust:</strong> Adherence to ethical standards maintains public confidence in the mental health profession</li>
            <li><strong>Legal Protection:</strong> Following ethical guidelines often provides legal protection for practitioners</li>
          </ul>
          <p>Understanding and applying ethical principles is not just about following rules—it's about developing the moral reasoning skills to navigate novel situations that no code could anticipate.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "The Five Core Ethical Principles",
              content: `<p>Five foundational principles guide ethical decision-making across all mental health disciplines:</p>
              <p><strong>1. Beneficence (Do Good):</strong> Acting in the client's best interest. This includes providing competent services, using evidence-based approaches, and actively working toward client welfare. It's not passive—it requires affirmative action to benefit clients.</p>
              <p><strong>2. Nonmaleficence (Do No Harm):</strong> Avoiding actions that could harm clients. This is often considered the primary principle—"first, do no harm." It includes avoiding exploitation, practicing within competence, and recognizing when our limitations might harm clients.</p>
              <p><strong>3. Autonomy (Respect Self-Determination):</strong> Respecting clients' right to make their own decisions, even ones we disagree with. This principle underlies informed consent requirements and the importance of client choice in treatment planning.</p>
              <p><strong>4. Justice (Be Fair):</strong> Treating all people fairly and equitably. This includes providing equal quality of care regardless of ability to pay, background, or personal characteristics. It also involves advocating for systemic changes that affect client welfare.</p>
              <p><strong>5. Fidelity (Be Faithful):</strong> Honoring commitments and maintaining trust. This includes keeping promises, maintaining confidentiality, and being loyal to the therapeutic relationship. Fidelity is the foundation of the therapeutic alliance.</p>`
            },
            {
              title: "Sources of Ethical Guidance",
              content: `<p>When facing ethical questions, clinicians should consult multiple sources:</p>
              <p><strong>Professional Codes of Ethics:</strong></p>
              <ul>
                <li>ACA Code of Ethics (counselors)</li>
                <li>NASW Code of Ethics (social workers)</li>
                <li>APA Ethical Principles (psychologists)</li>
                <li>AAMFT Code of Ethics (marriage and family therapists)</li>
                <li>NAADAC Code of Ethics (addiction professionals)</li>
              </ul>
              <p><strong>State Laws and Regulations:</strong></p>
              <ul>
                <li>Licensing board rules and regulations</li>
                <li>Mandatory reporting statutes</li>
                <li>Scope of practice laws</li>
                <li>Privilege and confidentiality statutes</li>
              </ul>
              <p><strong>Federal Regulations:</strong></p>
              <ul>
                <li>HIPAA (Health Insurance Portability and Accountability Act)</li>
                <li>42 CFR Part 2 (substance abuse records)</li>
                <li>FERPA (educational records)</li>
              </ul>
              <p><strong>Case Law:</strong> Court decisions that interpret and apply ethical and legal standards (e.g., Tarasoff)</p>
              <p><strong>Agency Policies:</strong> Your employer's specific requirements, which may be stricter than general standards</p>
              <p><strong>When sources conflict:</strong> Generally follow the stricter standard. When in doubt, seek consultation.</p>`
            },
            {
              title: "What Constitutes an Ethical Dilemma?",
              content: `<p>A true ethical dilemma exists when:</p>
              <ul>
                <li><strong>Two or more ethical principles conflict</strong> with each other (e.g., client autonomy vs. protection from harm)</li>
                <li><strong>There is no clear "right" answer</strong> that fully satisfies all ethical obligations</li>
                <li><strong>Any choice involves some ethical cost</strong>—something of value must be sacrificed</li>
                <li><strong>Reasonable professionals might disagree</strong> on the best course of action</li>
              </ul>
              <p><strong>Common Types of Dilemmas:</strong></p>
              <ul>
                <li>Confidentiality vs. duty to protect/warn</li>
                <li>Client autonomy vs. beneficence (when client choices seem harmful)</li>
                <li>Fidelity to client vs. third-party interests (parents, courts, insurers)</li>
                <li>Individual client needs vs. organizational policies</li>
                <li>Cultural values vs. professional standards</li>
              </ul>
              <p><strong>Note:</strong> Not all difficult decisions are ethical dilemmas. Sometimes the right action is clear but difficult to implement. True dilemmas involve genuine conflict between competing ethical goods.</p>`
            },
            {
              title: "The Seven-Step Decision-Making Framework",
              content: `<p>When facing an ethical dilemma, use this systematic approach:</p>
              <p><strong>Step 1: IDENTIFY</strong> the ethical issue(s)</p>
              <ul><li>What principles are in conflict?</li><li>Who are all the stakeholders affected?</li><li>What are the potential consequences?</li></ul>
              <p><strong>Step 2: CONSULT</strong> relevant codes, laws, and literature</p>
              <ul><li>What do professional codes say?</li><li>What are the legal requirements?</li><li>What does research or literature suggest?</li></ul>
              <p><strong>Step 3: CONSIDER</strong> all possible courses of action</p>
              <ul><li>Brainstorm multiple options, not just two</li><li>Include "do nothing" as an option to evaluate</li><li>Consider creative alternatives</li></ul>
              <p><strong>Step 4: EVALUATE</strong> each option against principles</p>
              <ul><li>Which principles does each option uphold or violate?</li><li>What are short-term vs. long-term consequences?</li><li>Who benefits and who is harmed by each option?</li></ul>
              <p><strong>Step 5: CONSULT</strong> with colleagues or supervisors</p>
              <ul><li>Get outside perspective</li><li>Check your reasoning</li><li>Consider viewpoints you may have missed</li></ul>
              <p><strong>Step 6: DECIDE</strong> and implement your chosen action</p>
              <ul><li>Make a clear decision</li><li>Act in a timely manner</li><li>Communicate appropriately with stakeholders</li></ul>
              <p><strong>Step 7: DOCUMENT</strong> your reasoning and actions</p>
              <ul><li>Record the dilemma, consultation, and rationale</li><li>Documentation demonstrates standard of care</li><li>Include what you considered, not just what you did</li></ul>`
            },
            {
              title: "Ethics vs. Law vs. Personal Morals",
              content: `<p>These three domains often overlap but are distinct:</p>
              <p><strong>Ethics (Professional Standards):</strong></p>
              <ul>
                <li>What the profession says you <em>should</em> do</li>
                <li>Based on collective professional wisdom</li>
                <li>Enforced by licensing boards and professional associations</li>
                <li>Can be stricter than law</li>
              </ul>
              <p><strong>Law (Legal Requirements):</strong></p>
              <ul>
                <li>What the government <em>requires</em> you to do</li>
                <li>Enforceable through courts and legal penalties</li>
                <li>Represents minimum standards</li>
                <li>Varies by jurisdiction</li>
              </ul>
              <p><strong>Personal Morals (Individual Values):</strong></p>
              <ul>
                <li>What you <em>believe</em> is right based on personal values</li>
                <li>Shaped by culture, religion, upbringing, experience</li>
                <li>May conflict with professional ethics or law</li>
                <li>Not directly enforceable but influences behavior</li>
              </ul>
              <p><strong>When They Conflict:</strong></p>
              <ul>
                <li>Law typically takes precedence over ethics (you can't violate law to follow ethical guidelines)</li>
                <li>Ethics may require more than law demands</li>
                <li>Personal morals should not override professional ethics or law</li>
                <li>When personal morals conflict with professional duties, seek supervision or refer</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600",
          imageAlt: "Professional reviewing documents at desk",
          imagePosition: "right",
          title: "Practical Application: Using the Framework",
          content: `<p>Consider this scenario: A client discloses they occasionally use marijuana to manage their anxiety. Your state has not legalized recreational marijuana use.</p>
          <p><strong>Identify:</strong> Principles in tension include beneficence (the drug may be helping), nonmaleficence (illegal activity, potential harm), autonomy (client's choice), and fidelity (your duty to the therapeutic relationship).</p>
          <p><strong>Consult:</strong> What do codes say about illegal activity? What are your state's reporting requirements? What does research say about cannabis and anxiety?</p>
          <p><strong>Consider options:</strong> Ignore it, explore it therapeutically, insist on cessation, terminate therapy, others?</p>
          <p>This framework helps organize your thinking—it doesn't make decisions easy, but it makes them defensible.</p>`,
          highlight: true
        },
        {
          type: "matching",
          order: 5,
          matchingInstructions: "Match each ethical principle with its core definition:",
          matchingPairs: [
            { term: "Beneficence", definition: "Acting in the client's best interest; doing good" },
            { term: "Nonmaleficence", definition: "Avoiding actions that could harm clients" },
            { term: "Autonomy", definition: "Respecting clients' right to self-determination" },
            { term: "Justice", definition: "Treating all people fairly and equitably" },
            { term: "Fidelity", definition: "Honoring commitments and maintaining trust" }
          ]
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "A true ethical dilemma is characterized by:",
          options: [
            { text: "A clear right answer that is difficult to implement", isCorrect: false },
            { text: "Conflict between two or more ethical principles with no perfect solution", isCorrect: true },
            { text: "A situation where the client disagrees with the clinician", isCorrect: false },
            { text: "Any decision that makes the clinician uncomfortable", isCorrect: false }
          ],
          explanation: "A true ethical dilemma involves conflict between competing ethical principles where any choice involves some ethical cost and reasonable professionals might disagree on the best course of action."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Your Ethical Foundation",
          prompt: "Think about an ethical situation you've faced (or can imagine facing) in clinical practice. Which of the five core principles were in tension? How did you (or would you) work through the dilemma using the seven-step decision-making framework? What sources of guidance did you consult?",
          placeholder: "Reflect on how you apply ethical principles and systematic decision-making in your practice...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Which principle means 'first, do no harm'?",
          type: "multipleChoice",
          options: [
            { text: "Beneficence", isCorrect: false },
            { text: "Nonmaleficence", isCorrect: true },
            { text: "Autonomy", isCorrect: false },
            { text: "Justice", isCorrect: false }
          ],
          explanation: "Nonmaleficence means avoiding harm to clients and is often considered the primary ethical principle."
        },
        {
          question: "When professional ethics and state law conflict, you should generally:",
          type: "multipleChoice",
          options: [
            { text: "Follow your personal moral code", isCorrect: false },
            { text: "Follow the law, as it takes precedence", isCorrect: true },
            { text: "Always follow the ethical code", isCorrect: false },
            { text: "Ask the client which to follow", isCorrect: false }
          ],
          explanation: "While ethics may require more than law demands, you cannot violate law to follow ethical guidelines. Law typically takes precedence."
        },
        {
          question: "The FIRST step in the ethical decision-making framework is to:",
          type: "multipleChoice",
          options: [
            { text: "Consult with a supervisor", isCorrect: false },
            { text: "Document your decision", isCorrect: false },
            { text: "Identify the ethical issues and stakeholders", isCorrect: true },
            { text: "Review relevant laws", isCorrect: false }
          ],
          explanation: "Before anything else, you must clearly identify what ethical principles are in conflict and who will be affected."
        }
      ]
    },

    // =========================================================================
    // SECTION 2: CONFIDENTIALITY AND ITS LIMITS (40 min)
    // =========================================================================
    {
      title: "Confidentiality and Its Limits",
      description: "Understanding when confidentiality must, may, or cannot be broken, and how to navigate these situations",
      order: 2,
      estimatedTime: 40,
      thumbnail: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "Confidentiality and Its Limits",
          subtitle: "Protecting Privacy While Managing Risk"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>The Foundation of Therapeutic Trust</h3>
          <p>Confidentiality is fundamental to the therapeutic relationship. Without assurance that their disclosures will remain private, clients cannot engage in the honest, vulnerable communication that effective therapy requires.</p>
          <p>However, confidentiality is <strong>not absolute</strong>. Every mental health professional must understand:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Mandatory exceptions</strong> — situations where you are legally required to break confidentiality</li>
            <li><strong>Permissive exceptions</strong> — situations where you may choose to break confidentiality</li>
            <li><strong>How to communicate</strong> these limits clearly to clients from the outset</li>
            <li><strong>How to navigate</strong> disclosure ethically when it becomes necessary</li>
          </ul>
          <p>The goal is not to protect confidentiality at all costs, but to protect it appropriately while meeting other ethical and legal obligations.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Mandatory Exceptions: When You MUST Break Confidentiality",
              content: `<p>These are legally required disclosures. Failure to report can result in legal liability and license revocation:</p>
              <p><strong>1. Child Abuse and Neglect</strong></p>
              <ul>
                <li>All 50 states require mental health professionals to report suspected child abuse or neglect</li>
                <li>Report to Child Protective Services (CPS) or designated agency</li>
                <li>"Reasonable suspicion" is the standard—you don't need proof</li>
                <li>Report immediately or within 24-48 hours depending on jurisdiction</li>
                <li>Includes physical abuse, sexual abuse, emotional abuse, and neglect</li>
              </ul>
              <p><strong>2. Elder and Vulnerable Adult Abuse</strong></p>
              <ul>
                <li>Most states require reporting abuse of adults who cannot protect themselves</li>
                <li>Includes physical abuse, financial exploitation, neglect, abandonment</li>
                <li>Report to Adult Protective Services (APS)</li>
                <li>Know your state's specific definitions of "vulnerable adult"</li>
              </ul>
              <p><strong>3. Duty to Warn/Protect (Tarasoff)</strong></p>
              <ul>
                <li>When a client makes a credible threat of serious physical violence</li>
                <li>Against an identifiable potential victim</li>
                <li>That appears imminent and foreseeable</li>
                <li>Actions may include: warning the victim, notifying police, hospitalizing client</li>
                <li>Standards vary significantly by state—know your jurisdiction</li>
              </ul>
              <p><strong>4. Court Orders and Subpoenas</strong></p>
              <ul>
                <li>Valid court orders compelling disclosure must generally be obeyed</li>
                <li>Subpoenas alone may not require disclosure—consult an attorney</li>
                <li>You may be able to limit disclosure or quash inappropriate subpoenas</li>
              </ul>`
            },
            {
              title: "Permissive Exceptions: When You MAY Break Confidentiality",
              content: `<p>These situations allow but do not require disclosure. Use clinical judgment:</p>
              <p><strong>Client Consent</strong></p>
              <ul>
                <li>Written authorization from the client</li>
                <li>Must specify what information, to whom, for what purpose</li>
                <li>Client can revoke consent at any time (with exceptions)</li>
                <li>Review the authorization carefully before disclosing</li>
              </ul>
              <p><strong>Emergency Situations</strong></p>
              <ul>
                <li>Imminent danger to self (even without specific threat to others)</li>
                <li>Medical emergency where client cannot consent</li>
                <li>Disclose only minimum necessary information</li>
              </ul>
              <p><strong>Professional Consultation</strong></p>
              <ul>
                <li>Consulting with colleagues about a case</li>
                <li>Avoid identifying information when possible</li>
                <li>Use only for professional purposes, not casual conversation</li>
              </ul>
              <p><strong>Payment and Insurance</strong></p>
              <ul>
                <li>Submitting claims for payment</li>
                <li>Minimum necessary standard applies</li>
                <li>Client should be informed in advance</li>
              </ul>
              <p><strong>Required Supervision</strong></p>
              <ul>
                <li>Sharing information with clinical supervisors</li>
                <li>Should be disclosed to clients at intake</li>
                <li>Supervisors share confidentiality obligations</li>
              </ul>`
            },
            {
              title: "Tarasoff in Depth: Understanding Duty to Protect",
              content: `<p><strong>The Landmark Case:</strong></p>
              <p>In 1969, Prosenjit Poddar told his therapist at UC Berkeley that he intended to kill Tatiana Tarasoff when she returned from vacation. The therapist notified campus police, who briefly detained Poddar but released him. No one warned Tarasoff. Two months later, Poddar killed her.</p>
              <p>The California Supreme Court ruled that therapists have a duty to protect identifiable third parties from credible threats made by their patients.</p>
              <p><strong>The Standard (varies by state):</strong></p>
              <ul>
                <li><strong>Serious threat</strong> of physical violence (not property damage or general hostility)</li>
                <li><strong>Identifiable victim(s)</strong> (some states extend to foreseeable victims)</li>
                <li><strong>Imminent/foreseeable</strong> threat</li>
                <li>Threat made in the context of treatment</li>
              </ul>
              <p><strong>Appropriate Actions May Include:</strong></p>
              <ul>
                <li>Warning the intended victim directly</li>
                <li>Notifying law enforcement</li>
                <li>Initiating commitment procedures if appropriate</li>
                <li>Intensifying treatment</li>
                <li>Increasing session frequency</li>
              </ul>
              <p><strong>Critical Points:</strong></p>
              <ul>
                <li>Document your assessment and reasoning thoroughly</li>
                <li>Consult with colleagues when possible</li>
                <li>Know your specific state's Tarasoff implementation</li>
                <li>Some states have no duty to warn; some have duty to protect only; some require both</li>
              </ul>`
            },
            {
              title: "HIPAA Fundamentals for Clinicians",
              content: `<p>The Health Insurance Portability and Accountability Act sets federal standards for protecting health information:</p>
              <p><strong>Key HIPAA Requirements:</strong></p>
              <ul>
                <li><strong>Notice of Privacy Practices:</strong> Provide to all clients at intake; explain how their information may be used</li>
                <li><strong>Minimum Necessary Standard:</strong> Disclose only the minimum information needed for the purpose</li>
                <li><strong>Client Rights:</strong>
                  <ul>
                    <li>Right to access their records (with some exceptions)</li>
                    <li>Right to request amendments to records</li>
                    <li>Right to accounting of disclosures</li>
                    <li>Right to request restrictions on use</li>
                  </ul>
                </li>
                <li><strong>Security Requirements:</strong> Protect information in all formats (paper, electronic, verbal)</li>
              </ul>
              <p><strong>HIPAA Permits Disclosure Without Consent For:</strong></p>
              <ul>
                <li>Treatment, payment, and healthcare operations</li>
                <li>Required by law (mandatory reporting)</li>
                <li>Public health activities</li>
                <li>Victims of abuse, neglect, or domestic violence</li>
                <li>Serious threat to health or safety</li>
                <li>Workers' compensation</li>
              </ul>
              <p><strong>Note:</strong> State laws may be stricter than HIPAA. When state and federal requirements differ, follow the stricter standard.</p>`
            },
            {
              title: "Best Practices for Managing Confidentiality",
              content: `<p><strong>At Intake:</strong></p>
              <ul>
                <li>Discuss confidentiality and its limits clearly and specifically</li>
                <li>Don't just hand over forms—have a conversation</li>
                <li>Check understanding: "Can you tell me in your own words when I might have to share information?"</li>
                <li>Document that this discussion occurred</li>
              </ul>
              <p><strong>Ongoing:</strong></p>
              <ul>
                <li>Revisit limits when relevant (e.g., before asking about suicidal ideation)</li>
                <li>Remind clients of limits if they begin disclosing reportable information</li>
                <li>Give advance warning when possible before making a report</li>
              </ul>
              <p><strong>When Breaking Confidentiality:</strong></p>
              <ul>
                <li>Consult first when possible and time permits</li>
                <li>Disclose only minimum necessary information</li>
                <li>Inform the client if possible and safe to do so</li>
                <li>Document thoroughly: what you disclosed, to whom, why, and how you reached the decision</li>
                <li>Follow up with the client about the impact on the therapeutic relationship</li>
              </ul>
              <p><strong>Physical and Digital Security:</strong></p>
              <ul>
                <li>Secure files (locked cabinets, encrypted electronic records)</li>
                <li>Use HIPAA-compliant platforms for telehealth and communication</li>
                <li>Avoid discussing cases in public areas</li>
                <li>Be careful with voicemail messages and email</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600",
          imageAlt: "Lock symbolizing confidentiality protection",
          imagePosition: "left",
          title: "Case Example: Navigating a Threat Disclosure",
          content: `<p><strong>Scenario:</strong> Your client, who has a history of domestic violence, says: "If my wife files those divorce papers, I swear I'll make her regret it. She doesn't know what I'm capable of."</p>
          <p><strong>Your Assessment Must Consider:</strong></p>
          <ul>
            <li>Is this a credible threat of physical violence or venting frustration?</li>
            <li>History of DV suggests higher risk</li>
            <li>Is the victim identifiable? (Yes—the wife)</li>
            <li>Is there a timeline? (When papers are filed)</li>
            <li>Does client have access to means?</li>
          </ul>
          <p><strong>This warrants further assessment and likely action.</strong> Document your assessment thoroughly, consult if possible, and do not dismiss it as "just venting" without careful evaluation.</p>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Under Tarasoff principles, a therapist's duty to protect is typically triggered when:",
          options: [
            { text: "A client expresses general anger toward others", isCorrect: false },
            { text: "A client makes a credible threat of serious physical violence toward an identifiable victim", isCorrect: true },
            { text: "A client has any history of violence", isCorrect: false },
            { text: "A client discusses violent media or entertainment", isCorrect: false }
          ],
          explanation: "Tarasoff duties are triggered by a serious, credible threat of physical violence toward an identifiable potential victim that appears imminent or foreseeable."
        },
        {
          type: "multiSelect",
          order: 6,
          question: "Which of the following are MANDATORY exceptions to confidentiality that require reporting? (Select all that apply)",
          options: [
            { text: "Suspected child abuse or neglect", isCorrect: true },
            { text: "Client requests a letter for their employer", isCorrect: false },
            { text: "Valid court order compelling disclosure", isCorrect: true },
            { text: "Credible threat to an identifiable victim (in Tarasoff states)", isCorrect: true },
            { text: "Client is having an extramarital affair", isCorrect: false },
            { text: "Suspected elder abuse", isCorrect: true }
          ],
          explanation: "Mandatory reporting requirements include child abuse, elder abuse, court orders, and duty to warn/protect situations. An affair is not reportable, and employment letters require client consent."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Navigating Confidentiality",
          prompt: "How do you explain the limits of confidentiality to new clients? Reflect on a time (or imagine a scenario) when you had to weigh breaking confidentiality. What factors guided your decision? How did you balance the therapeutic relationship with legal/ethical obligations?",
          placeholder: "Reflect on your approach to confidentiality discussions and decisions...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "The Tarasoff ruling established that therapists may have a duty to:",
          type: "multipleChoice",
          options: [
            { text: "Report all violent fantasies to authorities", isCorrect: false },
            { text: "Protect identifiable potential victims from credible serious threats", isCorrect: true },
            { text: "Never disclose any client information under any circumstances", isCorrect: false },
            { text: "Hospitalize all clients who express anger", isCorrect: false }
          ],
          explanation: "Tarasoff established a duty to protect identifiable victims from credible threats of serious physical violence."
        },
        {
          question: "Under HIPAA, the 'minimum necessary' standard means:",
          type: "multipleChoice",
          options: [
            { text: "You should never disclose any information", isCorrect: false },
            { text: "Disclose only the information needed for the specific purpose", isCorrect: true },
            { text: "You can disclose anything if you minimize it first", isCorrect: false },
            { text: "Clients must receive the minimum amount of treatment", isCorrect: false }
          ],
          explanation: "The minimum necessary standard requires that you disclose only the minimum amount of information needed to accomplish the purpose of the disclosure."
        },
        {
          question: "A client tells you they sometimes spank their 6-year-old child. You should:",
          type: "multipleChoice",
          options: [
            { text: "Immediately file a child abuse report", isCorrect: false },
            { text: "Assess further to determine if it rises to the level of abuse", isCorrect: true },
            { text: "Tell the client this must remain confidential", isCorrect: false },
            { text: "Terminate the therapeutic relationship", isCorrect: false }
          ],
          explanation: "Corporal punishment exists on a continuum. Further assessment is needed to determine whether it constitutes abuse requiring a report (frequency, severity, injury, objects used, etc.)."
        }
      ]
    },

    // =========================================================================
    // SECTION 3: BOUNDARIES AND DUAL RELATIONSHIPS (35 min)
    // =========================================================================
    {
      title: "Boundaries and Dual Relationships",
      description: "Managing professional boundaries, evaluating multiple relationships, and avoiding exploitation",
      order: 3,
      estimatedTime: 35,
      thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 3,
          title: "Boundaries and Dual Relationships",
          subtitle: "Maintaining Professional Integrity"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Why Boundaries Matter</h3>
          <p>Professional boundaries create the safe container within which therapy occurs. They establish the structure of the therapeutic relationship, protect clients from exploitation, and enable the focused work of treatment.</p>
          <p>Boundary issues exist on a continuum:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Boundary crossings:</strong> Minor deviations from typical practice that may or may not be harmful (e.g., accepting a small gift, extending a session)</li>
            <li><strong>Boundary violations:</strong> Actions that harm the client or exploit the therapeutic relationship (e.g., sexual contact, financial exploitation)</li>
          </ul>
          <p>The key question is not whether every boundary is rigidly maintained, but whether deviations serve the client's therapeutic interests or the clinician's personal interests.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Types of Dual/Multiple Relationships",
              content: `<p>A dual relationship exists when the therapist has another role with the client besides the therapeutic one:</p>
              <p><strong>Social Relationships:</strong></p>
              <ul>
                <li>Friendship, socializing outside therapy</li>
                <li>Attending same social events, clubs, or religious communities</li>
                <li>Social media connections</li>
              </ul>
              <p><strong>Business/Financial Relationships:</strong></p>
              <ul>
                <li>Employing a client or being employed by one</li>
                <li>Business partnerships or investments</li>
                <li>Bartering services for therapy</li>
                <li>Accepting loans or gifts of significant value</li>
              </ul>
              <p><strong>Professional Relationships:</strong></p>
              <ul>
                <li>Teaching/supervising the client in another context</li>
                <li>Treating multiple family members</li>
                <li>Professional colleagues who become clients</li>
              </ul>
              <p><strong>Familial Relationships:</strong></p>
              <ul>
                <li>Treating relatives of other clients</li>
                <li>Treating family members of friends</li>
              </ul>
              <p><strong>Sexual/Romantic Relationships:</strong></p>
              <ul>
                <li><strong>ALWAYS prohibited</strong> with current clients</li>
                <li>Prohibited with former clients for extended periods (often 2-5 years; some codes say never)</li>
                <li>Sexual contact with clients is the most common cause of license revocation</li>
              </ul>`
            },
            {
              title: "Evaluating Dual Relationships: A Decision Framework",
              content: `<p>Not all dual relationships are unethical. Use this framework to evaluate:</p>
              <p><strong>1. Is it avoidable?</strong></p>
              <ul>
                <li>Can the relationship reasonably be avoided?</li>
                <li>In small communities, complete avoidance may be impossible</li>
                <li>If avoidable, why are you considering it?</li>
              </ul>
              <p><strong>2. What is the power differential?</strong></p>
              <ul>
                <li>Therapeutic relationships involve inherent power imbalance</li>
                <li>Greater power differential = greater risk</li>
                <li>This power dynamic can persist even after therapy ends</li>
              </ul>
              <p><strong>3. What is the risk of harm?</strong></p>
              <ul>
                <li>Could this relationship harm the client?</li>
                <li>Could it impair your clinical judgment?</li>
                <li>Could it be perceived as exploitative?</li>
              </ul>
              <p><strong>4. What is the duration and intensity?</strong></p>
              <ul>
                <li>Brief, incidental contact vs. ongoing relationship</li>
                <li>Deeper therapy = more risk in dual relationships</li>
              </ul>
              <p><strong>5. Whose needs are being served?</strong></p>
              <ul>
                <li>Is this for the client's benefit or yours?</li>
                <li>Would you be comfortable if your actions were made public?</li>
                <li>What would a reasonable colleague think?</li>
              </ul>
              <p><strong>6. What is the community context?</strong></p>
              <ul>
                <li>Rural/small community practice has different realities</li>
                <li>Cultural expectations may influence boundaries</li>
                <li>Document the context and your reasoning</li>
              </ul>`
            },
            {
              title: "Sexual Relationships: The Absolute Prohibition",
              content: `<p><strong>Sexual contact with current clients is ALWAYS unethical and often illegal.</strong></p>
              <p>There are no exceptions based on:</p>
              <ul>
                <li>Who initiated the contact</li>
                <li>Whether the client "consented"</li>
                <li>The client's mental status</li>
                <li>Whether the therapy is considered "complete"</li>
                <li>The type of therapy being provided</li>
              </ul>
              <p><strong>With Former Clients:</strong></p>
              <ul>
                <li>Most codes require a minimum waiting period (typically 2-5 years)</li>
                <li>Some professional codes prohibit sexual relationships with former clients forever</li>
                <li>Even after the waiting period, you bear the burden of demonstrating no exploitation</li>
                <li>The power differential may never fully resolve</li>
              </ul>
              <p><strong>Why This Matters:</strong></p>
              <ul>
                <li>Sexual misconduct is the leading cause of malpractice claims against therapists</li>
                <li>It is the most common reason for license revocation</li>
                <li>Harm to clients is well-documented and often severe</li>
                <li>It destroys the therapeutic relationship and client's ability to trust future helpers</li>
              </ul>
              <p><strong>If You're Experiencing Attraction:</strong></p>
              <ul>
                <li>Seek consultation or personal therapy immediately</li>
                <li>This is not unusual, but acting on it is never acceptable</li>
                <li>Consider whether referral is appropriate</li>
              </ul>`
            },
            {
              title: "Small Community and Rural Practice",
              content: `<p>In small or rural communities, dual relationships may be unavoidable. Special considerations apply:</p>
              <p><strong>Realities of Small Community Practice:</strong></p>
              <ul>
                <li>You may be the only provider for many miles</li>
                <li>You will encounter clients in daily life</li>
                <li>Referral options may be extremely limited</li>
                <li>Rigid boundary standards may deprive people of needed services</li>
              </ul>
              <p><strong>Best Practices:</strong></p>
              <ul>
                <li><strong>Discuss at intake:</strong> "In a community this size, we may run into each other. Let's talk about how to handle that."</li>
                <li><strong>Plan for encounters:</strong> Agree on how to handle chance meetings (client's lead on acknowledgment)</li>
                <li><strong>Maintain separation where feasible:</strong> Keep professional and personal lives distinct when possible</li>
                <li><strong>Document carefully:</strong> Note unavoidable dual relationships and your reasoning</li>
                <li><strong>Seek regular consultation:</strong> Discuss challenging situations with colleagues</li>
                <li><strong>Be transparent:</strong> When in doubt, discuss the situation with the client</li>
              </ul>
              <p><strong>Cultural Considerations:</strong></p>
              <ul>
                <li>Some cultures expect more personal involvement from helpers</li>
                <li>Rigid boundaries may be seen as cold or uncaring</li>
                <li>Balance cultural sensitivity with appropriate limits</li>
                <li>Document your cultural reasoning</li>
              </ul>`
            },
            {
              title: "Warning Signs: Recognizing Boundary Drift",
              content: `<p>Boundary violations rarely happen suddenly. Watch for these warning signs:</p>
              <p><strong>In Your Thoughts and Feelings:</strong></p>
              <ul>
                <li>Thinking excessively about a client outside sessions</li>
                <li>Looking forward to seeing a particular client more than others</li>
                <li>Feeling "special" with a client or that they're different</li>
                <li>Fantasizing about friendship or romantic involvement</li>
                <li>Dreading consultation or supervision about a client</li>
              </ul>
              <p><strong>In Your Behaviors:</strong></p>
              <ul>
                <li>Making exceptions you wouldn't make for other clients</li>
                <li>Scheduling this client at special times</li>
                <li>Extending sessions without clinical justification</li>
                <li>Keeping secrets about this client from supervisors</li>
                <li>Self-disclosing more than therapeutically indicated</li>
                <li>Giving or receiving gifts beyond minor tokens</li>
              </ul>
              <p><strong>If You Notice These Signs:</strong></p>
              <ul>
                <li><strong>Don't ignore them.</strong> They are warning signals.</li>
                <li><strong>Seek consultation immediately.</strong> A trusted colleague can provide perspective.</li>
                <li><strong>Consider personal therapy.</strong> Understand what's driving these feelings.</li>
                <li><strong>Evaluate whether referral is needed.</strong> Client welfare comes first.</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
          imageAlt: "Professional maintaining appropriate boundaries",
          imagePosition: "right",
          title: "Case Example: Evaluating a Dual Relationship",
          content: `<p><strong>Scenario:</strong> A client who has been in therapy with you for anxiety asks if you would attend her wedding. You've developed a good therapeutic relationship over 2 years.</p>
          <p><strong>Consider:</strong></p>
          <ul>
            <li>Is this avoidable? (Yes)</li>
            <li>Power differential? (Significant—she values your opinion highly)</li>
            <li>Risk of harm? (Blurring therapeutic boundaries; affecting therapy focus)</li>
            <li>Whose needs served? (Mostly client's social needs, not therapeutic)</li>
          </ul>
          <p><strong>Better approach:</strong> Decline graciously while validating the meaning of the invitation. Process in session what the invitation represents about her progress and the therapeutic relationship.</p>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Sexual relationships with current therapy clients are:",
          options: [
            { text: "Acceptable if the client initiates", isCorrect: false },
            { text: "Acceptable if the therapeutic relationship is strong", isCorrect: false },
            { text: "Always unethical regardless of circumstances", isCorrect: true },
            { text: "Only problematic if the client later complains", isCorrect: false }
          ],
          explanation: "Sexual relationships with current clients are always unethical, regardless of who initiates, the client's mental status, or any other circumstance."
        },
        {
          type: "reflection",
          order: 6,
          title: "Clinical Reflection: Boundary Awareness",
          prompt: "Review the warning signs of boundary issues (thinking excessively about a client, making exceptions, keeping secrets from supervisors). Have you experienced any of these? What systems do you have in place to maintain healthy boundaries and catch potential issues early?",
          placeholder: "Reflect on your boundary maintenance practices and self-awareness...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "The key question when evaluating a potential dual relationship is:",
          type: "multipleChoice",
          options: [
            { text: "Will it benefit the clinician financially?", isCorrect: false },
            { text: "Is the client comfortable with it?", isCorrect: false },
            { text: "Is it potentially exploitative or harmful to the client?", isCorrect: true },
            { text: "Have other therapists done similar things?", isCorrect: false }
          ],
          explanation: "The central question is always whether the dual relationship could harm or exploit the client, not whether it benefits the clinician or whether the client consents."
        },
        {
          question: "A warning sign of potential boundary problems is:",
          type: "multipleChoice",
          options: [
            { text: "Maintaining consistent session times", isCorrect: false },
            { text: "Looking forward to seeing one client more than others", isCorrect: true },
            { text: "Using evidence-based interventions", isCorrect: false },
            { text: "Seeking regular supervision", isCorrect: false }
          ],
          explanation: "Finding one client 'special' or looking forward to them more than others can be an early warning sign of boundary drift requiring attention."
        }
      ]
    },

    // =========================================================================
    // SECTION 4: INFORMED CONSENT AND DOCUMENTATION (35 min)
    // =========================================================================
    {
      title: "Informed Consent and Documentation",
      description: "Implementing informed consent as an ongoing process and maintaining documentation that demonstrates standard of care",
      order: 4,
      estimatedTime: 35,
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Informed Consent and Documentation",
          subtitle: "Protecting Clients and Clinicians"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Informed Consent: More Than a Signature</h3>
          <p>Informed consent is not a one-time form signing—it's an <strong>ongoing process of communication</strong> that continues throughout treatment. It embodies the ethical principle of autonomy: respecting clients' right to make informed decisions about their own care.</p>
          <p>For consent to be valid, three elements must be present:</p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Capacity:</strong> The client has the ability to understand and make decisions</li>
            <li><strong>Information:</strong> The client has received sufficient information to decide</li>
            <li><strong>Voluntariness:</strong> The decision is made freely, without coercion</li>
          </ul>
          <p>Informed consent serves both ethical and legal functions—it respects client autonomy AND provides documentation that appropriate disclosure occurred.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Essential Elements of Informed Consent",
              content: `<p>Comprehensive informed consent should address:</p>
              <p><strong>About the Clinician:</strong></p>
              <ul>
                <li>Credentials, license type, and number</li>
                <li>Areas of expertise and limitations</li>
                <li>Theoretical orientation and approach</li>
                <li>Supervision status (if applicable)</li>
                <li>How to verify credentials</li>
              </ul>
              <p><strong>About Treatment:</strong></p>
              <ul>
                <li>Nature and purpose of therapy</li>
                <li>Expected duration and frequency</li>
                <li>Goals and methods to be used</li>
                <li>Potential benefits and risks</li>
                <li>Alternative treatments available</li>
                <li>What to do if treatment isn't helping</li>
              </ul>
              <p><strong>Practical Matters:</strong></p>
              <ul>
                <li>Fees and payment policies</li>
                <li>Insurance and billing procedures</li>
                <li>Cancellation and no-show policies</li>
                <li>Session length and scheduling</li>
                <li>Between-session contact policies</li>
                <li>Emergency procedures and crisis contacts</li>
              </ul>
              <p><strong>Confidentiality:</strong></p>
              <ul>
                <li>General protections provided</li>
                <li>Specific limits and exceptions</li>
                <li>How records are maintained and protected</li>
                <li>Telehealth-specific privacy considerations</li>
              </ul>
              <p><strong>Client Rights:</strong></p>
              <ul>
                <li>Right to ask questions at any time</li>
                <li>Right to refuse treatment or specific interventions</li>
                <li>Right to terminate therapy</li>
                <li>How to file complaints</li>
              </ul>`
            },
            {
              title: "Informed Consent as Ongoing Process",
              content: `<p>Consent is not "once and done." It should be revisited throughout treatment:</p>
              <p><strong>At Intake:</strong></p>
              <ul>
                <li>Provide written materials AND have a conversation</li>
                <li>Don't just have them sign—ensure understanding</li>
                <li>Check comprehension: "What questions do you have about what I've explained?"</li>
                <li>Document that the discussion occurred</li>
              </ul>
              <p><strong>When Treatment Changes:</strong></p>
              <ul>
                <li>New diagnosis or case formulation</li>
                <li>Adding new treatment modalities</li>
                <li>Changing session frequency or format</li>
                <li>Transition to telehealth or back to in-person</li>
              </ul>
              <p><strong>Before Specific Interventions:</strong></p>
              <ul>
                <li>Trauma processing techniques</li>
                <li>Hypnosis or EMDR</li>
                <li>Touch-based interventions</li>
                <li>Group or family involvement</li>
              </ul>
              <p><strong>When Circumstances Change:</strong></p>
              <ul>
                <li>Changes to your practice or availability</li>
                <li>Adding supervision or consultation relationships</li>
                <li>Client's capacity changes</li>
                <li>Involvement of third parties</li>
              </ul>
              <p><strong>Periodically:</strong></p>
              <ul>
                <li>Review treatment goals and progress</li>
                <li>Check satisfaction and concerns</li>
                <li>Confirm continued consent to treatment approach</li>
              </ul>`
            },
            {
              title: "Documentation: The Clinician's Best Protection",
              content: `<p><strong>The cardinal rule:</strong> "If it isn't documented, it didn't happen."</p>
              <p>In legal and ethical proceedings, your documentation is the primary evidence of what occurred and why. Good documentation:</p>
              <p><strong>What to Document:</strong></p>
              <ul>
                <li><strong>Assessment:</strong> Clinical impressions, diagnosis, case formulation</li>
                <li><strong>Treatment Planning:</strong> Goals, objectives, interventions, rationale</li>
                <li><strong>Session Content:</strong> What was discussed, interventions used, client responses</li>
                <li><strong>Progress/Response:</strong> Changes in symptoms, functioning, progress toward goals</li>
                <li><strong>Risk Assessments:</strong> Suicidality, homicidality, other risks; when and how assessed</li>
                <li><strong>Consultations:</strong> What you discussed, with whom, recommendations received</li>
                <li><strong>Informed Consent:</strong> Discussions, decisions, client questions</li>
                <li><strong>Collateral Contacts:</strong> Communications with others about the client</li>
              </ul>
              <p><strong>How to Document:</strong></p>
              <ul>
                <li><strong>Timely:</strong> As close to the session as possible</li>
                <li><strong>Objective:</strong> Focus on observable behavior, direct quotes</li>
                <li><strong>Relevant:</strong> Include clinically significant information</li>
                <li><strong>Professional:</strong> Assume anyone might read it (client, attorney, judge)</li>
                <li><strong>Legible:</strong> Clear and understandable</li>
                <li><strong>Accurate:</strong> If you make an error, correct it properly (line through, date, initial—never erase)</li>
              </ul>`
            },
            {
              title: "Documentation Red Flags and Common Errors",
              content: `<p><strong>Red Flags That Suggest Problems:</strong></p>
              <ul>
                <li>No documentation or significant gaps in records</li>
                <li>Late entries without notation of when written</li>
                <li>Records that appear to have been altered</li>
                <li>Missing informed consent documentation</li>
                <li>No risk assessments for high-risk clients</li>
                <li>No consultation documentation for complex cases</li>
                <li>Generic notes that could apply to any client</li>
              </ul>
              <p><strong>Common Documentation Errors:</strong></p>
              <ul>
                <li><strong>Too sparse:</strong> "Client discussed anxiety" tells nothing useful</li>
                <li><strong>Too detailed about the wrong things:</strong> Extensive verbatim notes of trauma details create liability</li>
                <li><strong>Judgmental language:</strong> "Manipulative," "resistant," "non-compliant"—use behavioral descriptions instead</li>
                <li><strong>Missing decision rationale:</strong> Document WHY you made clinical decisions, not just WHAT you did</li>
                <li><strong>Inconsistent risk assessment:</strong> High-risk clients need regular, documented assessments</li>
                <li><strong>No treatment plan updates:</strong> Plans should evolve as treatment progresses</li>
              </ul>
              <p><strong>Best Practice:</strong> Periodically audit your own records. Ask: "If I had to justify my treatment decisions based solely on this record, could I?"</p>`
            },
            {
              title: "Special Documentation Considerations",
              content: `<p><strong>Risk Assessment Documentation:</strong></p>
              <ul>
                <li>Document specific risk and protective factors identified</li>
                <li>Note the assessment tools or methods used</li>
                <li>Record your risk level determination AND your reasoning</li>
                <li>Document interventions implemented</li>
                <li>Include follow-up plans</li>
              </ul>
              <p><strong>Consultation Documentation:</strong></p>
              <ul>
                <li>Document consultations even when informal</li>
                <li>Note who you consulted, when, and the topic</li>
                <li>Record recommendations received</li>
                <li>Document your response to recommendations</li>
                <li>If you didn't follow advice, document why</li>
              </ul>
              <p><strong>Ethical Decision Documentation:</strong></p>
              <ul>
                <li>Document the dilemma identified</li>
                <li>Note what sources you consulted</li>
                <li>Record options considered</li>
                <li>Document your reasoning for the chosen action</li>
                <li>Include any consultation obtained</li>
              </ul>
              <p><strong>Telehealth Documentation:</strong></p>
              <ul>
                <li>Document client's location at time of service</li>
                <li>Note technology used and any technical issues</li>
                <li>Document that emergency protocols were reviewed</li>
                <li>Include client's emergency contact and local resources</li>
              </ul>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600",
          imageAlt: "Clinical documentation",
          imagePosition: "left",
          title: "Case Example: Documentation Under Scrutiny",
          content: `<p><strong>Scenario:</strong> A client files a complaint alleging you didn't warn them about treatment risks. Your documentation will be critical.</p>
          <p><strong>Strong documentation would show:</strong></p>
          <ul>
            <li>Signed informed consent with risks listed</li>
            <li>Note from intake session documenting the discussion</li>
            <li>Notes showing risks were revisited when treatment changed</li>
            <li>Client questions and your responses</li>
          </ul>
          <p><strong>Weak documentation:</strong> Only a signature on a form with no evidence of discussion leaves you vulnerable to claims that consent wasn't truly informed.</p>`,
          highlight: true
        },
        {
          type: "resources",
          order: 5,
          title: "Documentation Tools",
          description: "Download these resources to support your documentation practices",
          resources: [
            { title: "Ethical Decision-Making Worksheet", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/decision-making-worksheet.pdf", size: "234 KB" },
            { title: "Informed Consent Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/informed-consent-checklist.pdf", size: "156 KB" },
            { title: "Documentation Audit Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/documentation-audit.pdf", size: "167 KB" }
          ]
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Informed consent is best understood as:",
          options: [
            { text: "A one-time form signed at intake", isCorrect: false },
            { text: "An ongoing process of communication throughout treatment", isCorrect: true },
            { text: "A legal requirement only, with no clinical value", isCorrect: false },
            { text: "Only necessary for medication management", isCorrect: false }
          ],
          explanation: "Informed consent is an ongoing process of communication, not just a document signing. It should be revisited whenever treatment changes or new interventions are introduced."
        },
        {
          type: "reflection",
          order: 7,
          title: "Clinical Reflection: Documentation Practices",
          prompt: "Honestly assess your documentation habits. Are there gaps? Do you document consultations? How timely are your notes? What would you change to better protect yourself and your clients?",
          placeholder: "Reflect on your current documentation practices and areas for improvement...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "Valid informed consent requires:",
          type: "multipleChoice",
          options: [
            { text: "Notarization", isCorrect: false },
            { text: "Capacity, information, and voluntariness", isCorrect: true },
            { text: "Family member signature", isCorrect: false },
            { text: "Insurance pre-approval", isCorrect: false }
          ],
          explanation: "For consent to be valid, the client must have capacity to understand, have received sufficient information, and be deciding voluntarily without coercion."
        },
        {
          question: "The cardinal rule of clinical documentation is:",
          type: "multipleChoice",
          options: [
            { text: "Keep notes as brief as possible", isCorrect: false },
            { text: "If it isn't documented, it didn't happen", isCorrect: true },
            { text: "Never document anything negative", isCorrect: false },
            { text: "Use codes instead of words to save time", isCorrect: false }
          ],
          explanation: "In legal and ethical proceedings, documentation is the primary evidence of what occurred. Undocumented actions are difficult or impossible to demonstrate."
        }
      ]
    },

    // =========================================================================
    // SECTION 5: APPLYING ETHICS TO PRACTICE (35 min)
    // =========================================================================
    {
      title: "Applying Ethics to Practice",
      description: "Case studies, practical application, and developing an ethical practice mindset",
      order: 5,
      estimatedTime: 35,
      thumbnail: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400",
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 5,
          title: "Applying Ethics to Practice",
          subtitle: "Case Studies and Practical Application"
        },
        {
          type: "text",
          order: 2,
          textContent: `<h3>Putting It All Together</h3>
          <p>Ethical knowledge only becomes ethical practice through application. This section provides opportunities to work through realistic scenarios using the frameworks and principles covered throughout this course.</p>
          <p><strong>Remember the key steps:</strong></p>
          <ol style="margin-left: 20px; margin-bottom: 16px;">
            <li>Identify the ethical issues and stakeholders</li>
            <li>Consult codes, laws, and literature</li>
            <li>Consider all possible courses of action</li>
            <li>Evaluate options against principles</li>
            <li>Consult with colleagues</li>
            <li>Decide and implement</li>
            <li>Document your reasoning</li>
          </ol>
          <p>Ethical decision-making improves with practice. The more you use systematic frameworks, the more natural they become.</p>`
        },
        {
          type: "accordion",
          order: 3,
          accordionItems: [
            {
              title: "Case Study 1: The Minor's Secret",
              content: `<p><strong>Scenario:</strong> You're seeing a 16-year-old client for anxiety. During a session, she discloses that she's sexually active with her 18-year-old boyfriend. She begs you not to tell her conservative parents, fearing they'll punish her severely or send her away. The parents are paying for treatment and expect to be informed about significant issues.</p>
              <p><strong>Analysis Questions:</strong></p>
              <ul>
                <li>What are your state's age of consent laws?</li>
                <li>What does your informed consent document say about confidentiality with minors?</li>
                <li>Is there any indication of coercion or abuse?</li>
                <li>What are the potential harms of disclosure vs. non-disclosure?</li>
                <li>How might disclosure affect the therapeutic relationship?</li>
              </ul>
              <p><strong>Considerations:</strong></p>
              <ul>
                <li>The age difference is within legal limits in most states</li>
                <li>There's no indication of abuse or coercion</li>
                <li>Parent expectations don't override minor confidentiality laws</li>
                <li>However, your intake agreement matters—what did you promise?</li>
                <li>The therapeutic relationship is at stake</li>
              </ul>
              <p><strong>Possible Approach:</strong> Clarify your confidentiality policy with the client, explore safety and birth control, work with her on how/whether to discuss with parents, document the clinical reasoning for your approach.</p>`
            },
            {
              title: "Case Study 2: The Small-Town Dilemma",
              content: `<p><strong>Scenario:</strong> You're the only therapist within 60 miles in a rural community. Your daughter's first-grade teacher requests therapy for depression following her divorce. You've met her at school events, and she's been kind to your daughter.</p>
              <p><strong>Analysis Questions:</strong></p>
              <ul>
                <li>Is this dual relationship avoidable? (Refer? Telehealth options?)</li>
                <li>What is the power differential?</li>
                <li>How might treating her affect your daughter's education?</li>
                <li>Could the community context make this relationship acceptable?</li>
                <li>What would happen if treatment doesn't go well?</li>
              </ul>
              <p><strong>Considerations:</strong></p>
              <ul>
                <li>Truly no other options may justify treating, but explore alternatives first</li>
                <li>Document the lack of alternatives</li>
                <li>Consider teletherapy referrals as a real option</li>
                <li>If you proceed, discuss the dual relationship openly</li>
                <li>Extra boundaries may be needed (no school discussions about your daughter)</li>
              </ul>
              <p><strong>Possible Approach:</strong> Research teletherapy options first. If truly no alternatives, document this, discuss the dual relationship explicitly with the teacher, set clear boundaries, and seek regular consultation throughout treatment.</p>`
            },
            {
              title: "Case Study 3: Duty to Warn?",
              content: `<p><strong>Scenario:</strong> Your client has a history of domestic violence. Today he says, "If my wife files those divorce papers like she's threatening, I might have to show her she can't just throw away 20 years. She doesn't know what I'm capable of." He owns several firearms. When you ask directly, he says he's "just venting" and would "never actually hurt her."</p>
              <p><strong>Analysis Questions:</strong></p>
              <ul>
                <li>Is there a serious threat of physical violence?</li>
                <li>Is the victim identifiable?</li>
                <li>Is the threat imminent or foreseeable?</li>
                <li>What is the history of violence?</li>
                <li>Does access to means increase risk?</li>
                <li>Can you trust the denial?</li>
              </ul>
              <p><strong>Considerations:</strong></p>
              <ul>
                <li>History of DV significantly increases risk</li>
                <li>Access to firearms is a major risk factor</li>
                <li>The conditional nature ("if she files") creates foreseeable timeline</li>
                <li>Denial after concerning statements should not be automatically accepted</li>
                <li>The phrase "what I'm capable of" is ominous</li>
              </ul>
              <p><strong>Possible Approach:</strong> This likely warrants protective action. Conduct thorough risk assessment, consider warning the wife, potentially notify law enforcement, assess for hospitalization, discuss means restriction, consult immediately, and document extensively. Do NOT simply accept "just venting" as reassurance given the risk factors.</p>`
            },
            {
              title: "Case Study 4: The Grateful Client",
              content: `<p><strong>Scenario:</strong> A client you've worked with for three years is terminating after significant progress. At your final session, she presents you with an expensive watch worth several hundred dollars, saying "You saved my life. I want you to have this." Refusing would clearly hurt her feelings.</p>
              <p><strong>Analysis Questions:</strong></p>
              <ul>
                <li>What is your agency/practice policy on gifts?</li>
                <li>Is this culturally normative for the client?</li>
                <li>What is the monetary value relative to the client's means?</li>
                <li>What does the gift mean to the client?</li>
                <li>Could accepting affect future treatment (if she returns)?</li>
              </ul>
              <p><strong>Considerations:</strong></p>
              <ul>
                <li>Many ethics codes distinguish small tokens from expensive gifts</li>
                <li>An expensive watch crosses most reasonable gift thresholds</li>
                <li>The therapeutic meaning can be honored without accepting the object</li>
                <li>Cultural considerations may make refusal more complex</li>
                <li>You can refuse the gift while honoring the sentiment</li>
              </ul>
              <p><strong>Possible Approach:</strong> Thank her warmly and honor the meaning of the gesture, but explain that your ethics prevent accepting valuable gifts. Suggest a card or letter instead, which you can keep. Process what it means to her that she wanted to give something, and what the work together has meant to both of you.</p>`
            },
            {
              title: "When to Seek Consultation",
              content: `<p>Consultation is not a sign of weakness—it's a standard of good practice. Seek consultation when you experience:</p>
              <p><strong>Internal Signals:</strong></p>
              <ul>
                <li>Uncertainty about the right course of action</li>
                <li>Feeling isolated with a difficult decision</li>
                <li>Temptation to make exceptions to your usual practice</li>
                <li>Strong emotional reactions to a client or situation</li>
                <li>Any impulse to keep something from supervisors</li>
                <li>Feeling defensive or avoiding thinking about a case</li>
              </ul>
              <p><strong>Situational Triggers:</strong></p>
              <ul>
                <li>Any potential duty to warn situation</li>
                <li>Suicidal or homicidal clients</li>
                <li>Dual relationship questions</li>
                <li>Boundary concerns</li>
                <li>Legal involvement (subpoenas, lawsuits)</li>
                <li>Complaints or threats of complaints</li>
                <li>Client deterioration despite treatment</li>
              </ul>
              <p><strong>Document Your Consultations:</strong></p>
              <ul>
                <li>With whom you consulted</li>
                <li>The issue discussed (without unnecessary identifying information)</li>
                <li>Recommendations received</li>
                <li>Your response to recommendations</li>
              </ul>
              <p><strong>Build Your Consultation Network:</strong> Don't wait for a crisis. Develop relationships with colleagues, supervisors, ethics committees, and legal resources you can call upon when needed.</p>`
            }
          ]
        },
        {
          type: "imageText",
          order: 4,
          image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600",
          imageAlt: "Professionals in ethical consultation",
          imagePosition: "right",
          title: "Key Principles for Ethical Practice",
          content: `<ul>
            <li><strong>Know the codes and laws</strong> — Ignorance is not a defense</li>
            <li><strong>Use a systematic framework</strong> — Don't rely on intuition alone</li>
            <li><strong>Consult, consult, consult</strong> — Don't decide in isolation</li>
            <li><strong>Document your reasoning</strong> — Not just what, but why</li>
            <li><strong>Prioritize client welfare</strong> — When in doubt, ask "What's best for the client?"</li>
            <li><strong>Maintain self-awareness</strong> — Know your biases, limits, and blind spots</li>
            <li><strong>Embrace lifelong learning</strong> — Ethics knowledge needs regular updating</li>
          </ul>`,
          highlight: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "When facing an ethical dilemma, which of the following is TRUE?",
          options: [
            { text: "Consultation is a sign of incompetence", isCorrect: false },
            { text: "Your first instinct is usually the ethical choice", isCorrect: false },
            { text: "Consultation demonstrates professional standard of care", isCorrect: true },
            { text: "Ethical dilemmas always have clear right answers", isCorrect: false }
          ],
          explanation: "Consultation is a hallmark of ethical practice, not a sign of weakness. It demonstrates thoughtfulness and adherence to professional standards of care."
        },
        {
          type: "reflection",
          order: 6,
          title: "Clinical Reflection: Your Ethical Action Plan",
          prompt: "As you complete this course, identify one specific change you will make to strengthen your ethical practice. Will you update your informed consent process? Seek more consultation? Improve documentation? Audit your boundary practices? What's your first concrete action step, and when will you take it?",
          placeholder: "Reflect on concrete changes you will implement in your practice...",
          minLength: 100
        }
      ],
      hasQuiz: true,
      quizPassThreshold: 0.8,
      quizQuestions: [
        {
          question: "When facing a dilemma, the FIRST step should be:",
          type: "multipleChoice",
          options: [
            { text: "Decide quickly to reduce client anxiety", isCorrect: false },
            { text: "Identify the ethical issues and stakeholders", isCorrect: true },
            { text: "Call a lawyer immediately", isCorrect: false },
            { text: "Ask the client what they want you to do", isCorrect: false }
          ],
          explanation: "Before consulting, considering options, or deciding, you must first clearly identify what ethical issues are involved and who will be affected."
        },
        {
          question: "A client with a history of domestic violence makes veiled threats about his wife and owns firearms. You should:",
          type: "multipleChoice",
          options: [
            { text: "Accept his statement that he's 'just venting'", isCorrect: false },
            { text: "Conduct thorough risk assessment and consider protective action", isCorrect: true },
            { text: "Wait to see if he makes more specific threats", isCorrect: false },
            { text: "Terminate treatment to avoid liability", isCorrect: false }
          ],
          explanation: "History of DV plus firearm access plus threatening statements requires thorough risk assessment and likely protective action, not acceptance of minimization."
        }
      ]
    }
  ],

  // =========================================================================
  // FINAL ASSESSMENT - 15 questions
  // =========================================================================
  assessment: {
    title: "Final Assessment: Ethics in Clinical Practice",
    description: "This assessment evaluates your understanding of ethical principles, confidentiality, boundaries, informed consent, and documentation. You must score 80% or higher to receive CE credit.",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Which ethical principle means 'first, do no harm'?",
        type: "multipleChoice",
        options: [
          { text: "Beneficence", isCorrect: false },
          { text: "Nonmaleficence", isCorrect: true },
          { text: "Autonomy", isCorrect: false },
          { text: "Justice", isCorrect: false }
        ],
        explanation: "Nonmaleficence means avoiding harm to clients."
      },
      {
        question: "Mandatory exceptions to confidentiality typically include all of the following EXCEPT:",
        type: "multipleChoice",
        options: [
          { text: "Suspected child abuse", isCorrect: false },
          { text: "Duty to warn an identifiable victim", isCorrect: false },
          { text: "Client request to share records with employer", isCorrect: true },
          { text: "Valid court order", isCorrect: false }
        ],
        explanation: "Client requests to share records are permissive exceptions requiring consent, not mandatory exceptions."
      },
      {
        question: "Sexual relationships with current clients are:",
        type: "multipleChoice",
        options: [
          { text: "Acceptable if the client consents", isCorrect: false },
          { text: "Always unethical regardless of circumstances", isCorrect: true },
          { text: "A matter of personal judgment", isCorrect: false },
          { text: "Only problematic if reported", isCorrect: false }
        ],
        explanation: "Sexual relationships with current clients are always unethical without exception."
      },
      {
        question: "Valid informed consent requires:",
        type: "multipleChoice",
        options: [
          { text: "Notarization", isCorrect: false },
          { text: "Capacity, information, and voluntariness", isCorrect: true },
          { text: "Family approval", isCorrect: false },
          { text: "Insurance authorization", isCorrect: false }
        ],
        explanation: "Valid consent requires capacity to understand, sufficient information, and a voluntary decision."
      },
      {
        question: "The Tarasoff ruling established that therapists may have a duty to:",
        type: "multipleChoice",
        options: [
          { text: "Report all client anger to authorities", isCorrect: false },
          { text: "Protect identifiable victims from serious credible threats", isCorrect: true },
          { text: "Maintain absolute confidentiality in all circumstances", isCorrect: false },
          { text: "Hospitalize all clients who make threats", isCorrect: false }
        ],
        explanation: "Tarasoff established duty to protect identifiable victims from credible serious threats."
      },
      {
        question: "In rural practice, unavoidable dual relationships should be:",
        type: "multipleChoice",
        options: [
          { text: "Ignored since they're unavoidable", isCorrect: false },
          { text: "Managed with documentation, consultation, and clear boundaries", isCorrect: true },
          { text: "Reason to refuse all local clients", isCorrect: false },
          { text: "Reported to the licensing board", isCorrect: false }
        ],
        explanation: "Unavoidable dual relationships require careful management with documentation, consultation, and explicit boundary discussions."
      },
      {
        question: "Documentation protects clinicians primarily by:",
        type: "multipleChoice",
        options: [
          { text: "Guaranteeing lawsuit victories", isCorrect: false },
          { text: "Demonstrating that appropriate standards of care were met", isCorrect: true },
          { text: "Making records legally privileged", isCorrect: false },
          { text: "Preventing all complaints", isCorrect: false }
        ],
        explanation: "Documentation demonstrates that you met professional standards of care, which is crucial in legal or ethics proceedings."
      },
      {
        question: "When professional ethics and law conflict, you should generally:",
        type: "multipleChoice",
        options: [
          { text: "Follow your personal moral code", isCorrect: false },
          { text: "Follow the law, as it takes precedence", isCorrect: true },
          { text: "Always follow ethics codes over law", isCorrect: false },
          { text: "Let the client decide", isCorrect: false }
        ],
        explanation: "While ethics may require more than law, you cannot violate law to follow ethics. Law typically takes precedence."
      },
      {
        question: "A warning sign of potential boundary problems is:",
        type: "multipleChoice",
        options: [
          { text: "Maintaining consistent policies across clients", isCorrect: false },
          { text: "Making exceptions for one client you wouldn't make for others", isCorrect: true },
          { text: "Seeking regular supervision", isCorrect: false },
          { text: "Using evidence-based treatments", isCorrect: false }
        ],
        explanation: "Making special exceptions for particular clients is an early warning sign of boundary drift."
      },
      {
        question: "The minimum necessary standard under HIPAA means:",
        type: "multipleChoice",
        options: [
          { text: "Provide minimum treatment to save costs", isCorrect: false },
          { text: "Disclose only the information needed for the specific purpose", isCorrect: true },
          { text: "Keep notes as brief as possible", isCorrect: false },
          { text: "Use minimum documentation", isCorrect: false }
        ],
        explanation: "The minimum necessary standard requires disclosing only what is needed to accomplish the purpose of a permitted disclosure."
      },
      {
        question: "Informed consent should be revisited when:",
        type: "multipleChoice",
        options: [
          { text: "Never—it's a one-time process", isCorrect: false },
          { text: "Treatment approach, methods, or circumstances change", isCorrect: true },
          { text: "Only if the client asks questions", isCorrect: false },
          { text: "Only at annual reviews", isCorrect: false }
        ],
        explanation: "Informed consent is ongoing and should be revisited whenever treatment changes or new interventions are introduced."
      },
      {
        question: "The FIRST step in the ethical decision-making framework is:",
        type: "multipleChoice",
        options: [
          { text: "Consult the ethics code", isCorrect: false },
          { text: "Document your decision", isCorrect: false },
          { text: "Identify the ethical issues and stakeholders", isCorrect: true },
          { text: "Call a colleague", isCorrect: false }
        ],
        explanation: "Before any other step, you must clearly identify what ethical principles are in conflict and who will be affected."
      },
      {
        question: "Consultation in ethical decision-making:",
        type: "multipleChoice",
        options: [
          { text: "Is a sign of professional weakness", isCorrect: false },
          { text: "Demonstrates appropriate standard of care", isCorrect: true },
          { text: "Should be avoided to maintain independence", isCorrect: false },
          { text: "Is only necessary for new clinicians", isCorrect: false }
        ],
        explanation: "Consultation is a hallmark of ethical practice and demonstrates professional standards of care."
      },
      {
        question: "A client makes veiled threats about their spouse and has access to firearms. The appropriate response is:",
        type: "multipleChoice",
        options: [
          { text: "Accept their assurance they're 'just venting'", isCorrect: false },
          { text: "Conduct thorough risk assessment and consider protective action", isCorrect: true },
          { text: "Terminate treatment immediately", isCorrect: false },
          { text: "Wait to see if threats become more specific", isCorrect: false }
        ],
        explanation: "Threatening statements combined with means access requires thorough assessment and likely action, not acceptance of minimization."
      },
      {
        question: "A true ethical dilemma is characterized by:",
        type: "multipleChoice",
        options: [
          { text: "A clear right answer that's just difficult to implement", isCorrect: false },
          { text: "Conflict between ethical principles where any choice has costs", isCorrect: true },
          { text: "Any situation that makes you uncomfortable", isCorrect: false },
          { text: "Disagreement between client and therapist", isCorrect: false }
        ],
        explanation: "True dilemmas involve competing ethical principles where any choice sacrifices something of value and reasonable professionals might disagree."
      }
    ]
  }
};

// ============================================================================
// UPDATE FUNCTION
// ============================================================================
const updateCourse = async () => {
  await connectDB();
  try {
    ethicsCourse.totalEstimatedTime = ethicsCourse.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
    ethicsCourse.totalContentBlocks = ethicsCourse.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
    ethicsCourse.totalQuizQuestions = ethicsCourse.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) + (ethicsCourse.assessment?.questions?.length || 0);
    
    await mongoose.connection.db.collection('interactivecourses').findOneAndUpdate({ slug: ethicsCourse.slug }, { $set: ethicsCourse }, { upsert: true });
    await mongoose.connection.db.collection('courses').findOneAndUpdate({ slug: ethicsCourse.slug }, { $set: ethicsCourse }, { upsert: true });
    
    console.log('✅ Ethics course updated!');
    console.log(`   Title: ${ethicsCourse.title}`);
    console.log(`   CE Hours: ${ethicsCourse.ceHours}`);
    console.log(`   Total Estimated Time: ${ethicsCourse.totalEstimatedTime} minutes`);
    console.log(`   Sections: ${ethicsCourse.sections.length}`);
    console.log(`   Content Blocks: ${ethicsCourse.totalContentBlocks}`);
    console.log(`   Quiz + Assessment Questions: ${ethicsCourse.totalQuizQuestions}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
};

updateCourse();
