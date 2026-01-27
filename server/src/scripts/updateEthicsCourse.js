// scripts/updateEthicsCourse.js
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
  description: "This 3-hour ethics course equips mental health professionals with systematic decision-making frameworks for complex ethical situations. Explore confidentiality, dual relationships, informed consent, and documentation through case studies.",
  thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
  ceHours: 3,
  ceProvider: "NBCC ACEP #7760 - CounselorReady",
  acepNumber: "7760",
  targetAudience: ["Licensed Professional Counselors", "Clinical Social Workers", "Psychologists"],
  categories: ["Ethics", "Professional Practice"],
  tags: ["ethics", "confidentiality", "boundaries", "documentation"],
  author: "CounselorReady",
  status: "published",
  publishedAt: new Date(),
  resources: [
    { title: "Ethical Decision-Making Worksheet", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/decision-making-worksheet.pdf", size: "234 KB" },
    { title: "Confidentiality Exceptions Quick Reference", type: "card", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/confidentiality-exceptions.pdf", size: "178 KB" },
    { title: "Informed Consent Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/informed-consent-checklist.pdf", size: "156 KB" },
    { title: "Dual Relationship Assessment Tool", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/dual-relationship-assessment.pdf", size: "198 KB" }
  ],
  sections: [
    {
      title: "Foundations of Ethical Practice",
      description: "Understanding ethical codes, principles, and decision-making",
      order: 1,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 1, title: "Foundations of Ethical Practice", subtitle: "The Framework for Professional Decision-Making" },
        { type: "text", order: 2, textContent: "<h3>Why Ethics Matter</h3><p>Ethical practice is the cornerstone of the mental health profession. Our clients come to us in vulnerable states, trusting us with their deepest struggles.</p><p><strong>Five Core Principles:</strong></p><ul><li><strong>Beneficence:</strong> Acting in the client's best interest</li><li><strong>Nonmaleficence:</strong> Do no harm</li><li><strong>Autonomy:</strong> Respecting self-determination</li><li><strong>Justice:</strong> Fairness and equitable treatment</li><li><strong>Fidelity:</strong> Honoring commitments and trust</li></ul>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Sources of Ethical Guidance", content: "<p><strong>Professional Codes:</strong> ACA, NASW, APA, AAMFT</p><p><strong>State Laws:</strong> Licensing board rules, mandatory reporting statutes</p><p><strong>Federal Regulations:</strong> HIPAA</p><p><strong>Agency Policies:</strong> Your employer's requirements</p>" },
          { title: "What is an Ethical Dilemma?", content: "<p>A true ethical dilemma exists when:</p><ul><li>Two or more ethical principles conflict</li><li>There is no clear 'right' answer</li><li>Any choice involves some ethical cost</li><li>Reasonable professionals might disagree</li></ul>" },
          { title: "The Decision-Making Framework", content: "<ol><li><strong>Identify</strong> the ethical issue(s) and stakeholders</li><li><strong>Consult</strong> codes, laws, and literature</li><li><strong>Consider</strong> possible courses of action</li><li><strong>Evaluate</strong> consequences of each option</li><li><strong>Consult</strong> with colleagues or supervisors</li><li><strong>Decide</strong> and implement</li><li><strong>Document</strong> your reasoning</li></ol>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", imageAlt: "Professional reviewing documents", imagePosition: "right", title: "Ethics vs. Law vs. Morals", content: "<p><strong>Ethics:</strong> Professional standards — what the profession says you should do</p><p><strong>Law:</strong> Legal requirements — what the government requires</p><p><strong>Morals:</strong> Personal values — what you believe is right</p><p>When these conflict, seek consultation and generally follow the stricter standard.</p>", highlight: true },
        { type: "matching", order: 5, matchingInstructions: "Match each principle with its definition:", matchingPairs: [
          { term: "Beneficence", definition: "Acting in the client's best interest" },
          { term: "Nonmaleficence", definition: "Do no harm" },
          { term: "Autonomy", definition: "Respecting self-determination" },
          { term: "Justice", definition: "Fairness and equitable treatment" },
          { term: "Fidelity", definition: "Honoring commitments and trust" }
        ]}
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Which principle means 'first, do no harm'?", type: "multipleChoice", options: [{ text: "Beneficence", isCorrect: false }, { text: "Nonmaleficence", isCorrect: true }, { text: "Autonomy", isCorrect: false }, { text: "Justice", isCorrect: false }], explanation: "Nonmaleficence means avoiding harm." }
      ]
    },
    {
      title: "Confidentiality and Its Limits",
      description: "Understanding when confidentiality must, may, or cannot be broken",
      order: 2,
      estimatedTime: 40,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 2, title: "Confidentiality and Its Limits", subtitle: "Protecting Privacy While Managing Risk" },
        { type: "text", order: 2, textContent: "<h3>The Foundation of Trust</h3><p>Confidentiality is fundamental to the therapeutic relationship. However, it is <strong>not absolute</strong>. Understanding exceptions and communicating them clearly is essential.</p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Mandatory Exceptions (Must Break)", content: "<ul><li><strong>Child Abuse/Neglect:</strong> Report to CPS</li><li><strong>Elder/Vulnerable Adult Abuse:</strong> Most states require reporting</li><li><strong>Duty to Warn/Protect (Tarasoff):</strong> Serious threat to identifiable person</li><li><strong>Court Orders:</strong> Valid orders compelling disclosure</li></ul>" },
          { title: "Permissive Exceptions (May Break)", content: "<ul><li>Client consent (written authorization)</li><li>Emergency (immediate danger to self)</li><li>Consultation (without identifying info)</li><li>Payment/billing needs</li><li>Required supervision</li></ul>" },
          { title: "Tarasoff and Duty to Warn", content: "<p>The landmark Tarasoff case (1976) established therapists may have a duty to protect potential victims when clients make credible threats.</p><p><strong>Key Elements:</strong></p><ul><li>Serious threat of physical violence</li><li>Identifiable potential victim(s)</li><li>Imminent/foreseeable threat</li></ul><p><strong>Actions:</strong> Warn victim, notify law enforcement, hospitalize if appropriate</p>" },
          { title: "HIPAA Basics", content: "<ul><li>Notice of Privacy Practices</li><li>Minimum necessary standard</li><li>Client right to access records</li><li>Client right to request amendments</li><li>Secure storage and transmission</li></ul>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600", imageAlt: "Lock symbolizing confidentiality", imagePosition: "left", title: "Best Practices", content: "<ul><li>Discuss limits clearly at intake</li><li>Document your reasoning</li><li>Consult when uncertain</li><li>Share only minimum necessary</li><li>Inform client before breaking when possible</li><li>Know your state laws</li></ul>", highlight: true },
        { type: "multipleChoice", order: 5, question: "A client tells you they plan to seriously harm their ex-partner tonight. Under Tarasoff, you may need to:", options: [{ text: "Maintain confidentiality", isCorrect: false }, { text: "Warn the potential victim and/or notify authorities", isCorrect: true }, { text: "Wait to see if they follow through", isCorrect: false }, { text: "Refer to another therapist", isCorrect: false }], explanation: "Duty to warn/protect may require warning the victim and notifying authorities." }
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "The Tarasoff ruling established that therapists may have a duty to:", type: "multipleChoice", options: [{ text: "Report all violent fantasies", isCorrect: false }, { text: "Protect identifiable potential victims from serious threats", isCorrect: true }, { text: "Never disclose any information", isCorrect: false }, { text: "Hospitalize all angry clients", isCorrect: false }], explanation: "Tarasoff established duty to protect identifiable victims from credible threats." }
      ]
    },
    {
      title: "Boundaries and Dual Relationships",
      description: "Managing professional boundaries and multiple relationships",
      order: 3,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 3, title: "Boundaries and Dual Relationships", subtitle: "Maintaining Professional Integrity" },
        { type: "text", order: 2, textContent: "<h3>Why Boundaries Matter</h3><p>Professional boundaries create the safe container for therapy. Violations can cause significant harm and end careers.</p><p><strong>Key distinction:</strong> Boundary crossings (minor deviations) differ from violations (harmful breaches).</p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Types of Dual Relationships", content: "<ul><li><strong>Social:</strong> Friend, community member</li><li><strong>Business:</strong> Employer, partner</li><li><strong>Financial:</strong> Bartering, lending</li><li><strong>Familial:</strong> Treating relatives</li><li><strong>Sexual/Romantic:</strong> ALWAYS prohibited</li></ul><p>Not all dual relationships are unethical—the question is whether they're exploitative or harmful.</p>" },
          { title: "Assessing Dual Relationships", content: "<ol><li>Is it avoidable?</li><li>Power differential?</li><li>Risk of harm?</li><li>Duration and intensity?</li><li>Whose needs are served?</li><li>Community context?</li></ol>" },
          { title: "Sexual Relationships: Absolute Prohibition", content: "<p><strong>Sexual relationships with current clients are ALWAYS unethical and often illegal.</strong></p><p>With former clients: Most codes require 2-5 year minimum wait; some say never.</p><p>Sexual misconduct is the leading cause of malpractice claims and license revocations.</p>" },
          { title: "Rural/Small Community Practice", content: "<p>Dual relationships may be unavoidable. Best practices:</p><ul><li>Discuss overlaps at intake</li><li>Plan for chance encounters</li><li>Maintain separation where feasible</li><li>Document carefully</li><li>Seek regular consultation</li></ul>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600", imageAlt: "Professional boundaries", imagePosition: "right", title: "Warning Signs", content: "<ul><li>Thinking excessively about a client outside sessions</li><li>Making exceptions you wouldn't make for others</li><li>Keeping secrets from supervisors</li><li>Dreading consultation</li><li>Feeling 'special' with a particular client</li></ul><p><strong>If you notice these:</strong> Seek consultation immediately.</p>", highlight: true },
        { type: "multipleChoice", order: 5, question: "Sexual relationships with current therapy clients are:", options: [{ text: "Acceptable if the client initiates", isCorrect: false }, { text: "Acceptable after the relationship is strong", isCorrect: false }, { text: "Always unethical regardless of circumstances", isCorrect: true }, { text: "Only problematic if the client complains", isCorrect: false }], explanation: "Sexual relationships with current clients are always unethical." }
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "The key question when evaluating a dual relationship is:", type: "multipleChoice", options: [{ text: "Will it benefit the clinician?", isCorrect: false }, { text: "Is the client comfortable?", isCorrect: false }, { text: "Is it potentially exploitative or harmful?", isCorrect: true }, { text: "Have others done similar things?", isCorrect: false }], explanation: "The key question is potential for exploitation or harm." }
      ]
    },
    {
      title: "Informed Consent and Documentation",
      description: "Essential elements of consent and clinical documentation",
      order: 4,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 4, title: "Informed Consent and Documentation", subtitle: "Protecting Clients and Clinicians" },
        { type: "text", order: 2, textContent: "<h3>More Than a Signature</h3><p>Informed consent is an ongoing process, not just a form. Valid consent requires:</p><ol><li><strong>Capacity:</strong> Client can understand and decide</li><li><strong>Information:</strong> Sufficient information provided</li><li><strong>Voluntariness:</strong> Decision made freely</li></ol>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Essential Elements of Informed Consent", content: "<p><strong>About the Clinician:</strong> Credentials, approach, supervision status</p><p><strong>About Treatment:</strong> Nature, goals, duration, risks, benefits, alternatives</p><p><strong>Practical Matters:</strong> Fees, cancellation policy, emergencies</p><p><strong>Confidentiality:</strong> General protections and specific limits</p>" },
          { title: "Informed Consent as Ongoing Process", content: "<ul><li>Revisit when treatment changes</li><li>Discuss risks before specific interventions</li><li>Re-consent when circumstances change</li><li>Check understanding periodically</li><li>Document ongoing conversations</li></ul>" },
          { title: "Documentation Best Practices", content: "<p><strong>What to Document:</strong></p><ul><li>Assessment and diagnosis</li><li>Treatment plan and goals</li><li>Session content and interventions</li><li>Progress and response</li><li>Risk assessments</li><li>Consultations obtained</li></ul><p><strong>How:</strong> Timely, objective, relevant, legible</p><p><strong>Remember:</strong> 'If it isn't documented, it didn't happen.'</p>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600", imageAlt: "Documentation", imagePosition: "left", title: "Documentation Red Flags", content: "<ul><li>No documentation or gaps</li><li>Late entries without notation</li><li>Improperly altered records</li><li>Missing risk assessments</li><li>No consultation documentation</li></ul>", highlight: true },
        { type: "resources", order: 5, title: "Documentation Tools", description: "Download these resources", resources: [
          { title: "Ethical Decision-Making Worksheet", type: "worksheet", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/decision-making-worksheet.pdf", size: "234 KB" },
          { title: "Informed Consent Checklist", type: "checklist", url: "https://res.cloudinary.com/dzfscjhdx/raw/upload/resources/ethics/informed-consent-checklist.pdf", size: "156 KB" }
        ]}
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "Informed consent is best understood as:", type: "multipleChoice", options: [{ text: "A one-time form", isCorrect: false }, { text: "An ongoing process", isCorrect: true }, { text: "A legal requirement only", isCorrect: false }, { text: "Only for medication", isCorrect: false }], explanation: "Informed consent is an ongoing process of communication." }
      ]
    },
    {
      title: "Applying Ethics to Practice",
      description: "Case studies and practical application",
      order: 5,
      estimatedTime: 35,
      contentBlocks: [
        { type: "sectionDivider", order: 1, sectionNumber: 5, title: "Applying Ethics to Practice", subtitle: "Case Studies in Action" },
        { type: "text", order: 2, textContent: "<h3>Putting It Together</h3><p>Ethical decision-making improves with practice. Use the framework: Identify → Consult → Consider → Evaluate → Consult → Decide → Document</p>" },
        { type: "accordion", order: 3, accordionItems: [
          { title: "Case Study 1: Confidentiality with Minor", content: "<p><strong>Scenario:</strong> Your 16-year-old client discloses sexual activity with her 18-year-old boyfriend. Parents are conservative. She asks you not to tell.</p><p><strong>Consider:</strong> Age of consent laws, your intake policy, safety concerns, therapeutic relationship</p>" },
          { title: "Case Study 2: Rural Dual Relationship", content: "<p><strong>Scenario:</strong> You're the only therapist in a rural community. Your daughter's teacher requests therapy. No other providers within 60 miles.</p><p><strong>Consider:</strong> Avoidability, power dynamics, impact on child, teletherapy options</p>" },
          { title: "Case Study 3: Duty to Warn", content: "<p><strong>Scenario:</strong> Client with DV history says 'If my wife leaves, I might kill her then myself.' Has guns at home. Says he's 'just venting.'</p><p><strong>Consider:</strong> History, means access, specificity. Do NOT accept minimization at face value.</p>" },
          { title: "When to Seek Consultation", content: "<p>Consult when you feel:</p><ul><li>Uncertain about the right action</li><li>Alone with a difficult decision</li><li>Tempted to make exceptions</li><li>Emotionally reactive</li><li>Like keeping something secret</li></ul><p><strong>Document consultations</strong> — they demonstrate standard of care.</p>" }
        ]},
        { type: "imageText", order: 4, image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600", imageAlt: "Decision-making", imagePosition: "right", title: "Key Takeaways", content: "<ul><li>Know the codes and laws</li><li>Use a systematic framework</li><li>Consult — don't decide alone</li><li>Document your reasoning</li><li>Prioritize client welfare</li><li>Maintain self-awareness</li></ul>", highlight: true }
      ],
      hasQuiz: true, quizPassThreshold: 0.8,
      quizQuestions: [
        { question: "When facing an ethical dilemma, the FIRST step should be:", type: "multipleChoice", options: [{ text: "Decide quickly", isCorrect: false }, { text: "Identify the ethical issues and stakeholders", isCorrect: true }, { text: "Call a lawyer", isCorrect: false }, { text: "Ask the client", isCorrect: false }], explanation: "First identify what issues are involved and who is affected." }
      ]
    }
  ],
  assessment: {
    title: "Final Assessment: Ethics in Clinical Practice",
    timeLimit: 25,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      { question: "Which ethical principle means 'first, do no harm'?", type: "multipleChoice", options: [{ text: "Beneficence", isCorrect: false }, { text: "Nonmaleficence", isCorrect: true }, { text: "Autonomy", isCorrect: false }, { text: "Justice", isCorrect: false }], explanation: "Nonmaleficence means avoiding harm." },
      { question: "Mandatory exceptions to confidentiality include:", type: "multipleChoice", options: [{ text: "Client requests release", isCorrect: false }, { text: "Suspected child abuse and duty to warn", isCorrect: true }, { text: "Insurance requests", isCorrect: false }, { text: "Employer inquiries", isCorrect: false }], explanation: "Mandatory exceptions include abuse reporting and duty to warn situations." },
      { question: "Sexual relationships with current clients are:", type: "multipleChoice", options: [{ text: "Sometimes acceptable", isCorrect: false }, { text: "Always unethical", isCorrect: true }, { text: "A personal decision", isCorrect: false }, { text: "Only sometimes problematic", isCorrect: false }], explanation: "Always unethical without exception." },
      { question: "Valid informed consent requires:", type: "multipleChoice", options: [{ text: "Notarization", isCorrect: false }, { text: "Capacity, information, and voluntariness", isCorrect: true }, { text: "Family signature", isCorrect: false }, { text: "Insurance approval", isCorrect: false }], explanation: "Capacity, information, and voluntariness are required." },
      { question: "The Tarasoff ruling established:", type: "multipleChoice", options: [{ text: "Absolute confidentiality", isCorrect: false }, { text: "Duty to protect identifiable victims from serious threats", isCorrect: true }, { text: "No third-party duties", isCorrect: false }, { text: "Immunity from lawsuits", isCorrect: false }], explanation: "Tarasoff established duty to protect identifiable victims." },
      { question: "In rural practice, unavoidable dual relationships should be:", type: "multipleChoice", options: [{ text: "Ignored", isCorrect: false }, { text: "Managed with documentation and consultation", isCorrect: true }, { text: "Reason to refuse all clients", isCorrect: false }, { text: "Reported to the board", isCorrect: false }], explanation: "Careful management with documentation and consultation is required." },
      { question: "Documentation protects clinicians by:", type: "multipleChoice", options: [{ text: "Guaranteeing lawsuit victories", isCorrect: false }, { text: "Demonstrating standards of care were met", isCorrect: true }, { text: "Making records unseizable", isCorrect: false }, { text: "Preventing complaints", isCorrect: false }], explanation: "Documentation demonstrates appropriate care was provided." },
      { question: "When facing a dilemma, the first step is:", type: "multipleChoice", options: [{ text: "Quick decision", isCorrect: false }, { text: "Identifying issues and stakeholders", isCorrect: true }, { text: "Calling a lawyer", isCorrect: false }, { text: "Asking the client", isCorrect: false }], explanation: "First identify what ethical issues are involved." }
    ]
  }
};

const updateCourse = async () => {
  await connectDB();
  try {
    ethicsCourse.totalEstimatedTime = ethicsCourse.sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0);
    ethicsCourse.totalContentBlocks = ethicsCourse.sections.reduce((sum, s) => sum + s.contentBlocks.length, 0);
    ethicsCourse.totalQuizQuestions = ethicsCourse.sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0) + (ethicsCourse.assessment?.questions?.length || 0);
    
    await mongoose.connection.db.collection('interactivecourses').findOneAndUpdate({ slug: ethicsCourse.slug }, { $set: ethicsCourse }, { upsert: true });
    await mongoose.connection.db.collection('courses').findOneAndUpdate({ slug: ethicsCourse.slug }, { $set: ethicsCourse }, { upsert: true });
    
    console.log('✅ Ethics course updated!');
    console.log('   Sections:', ethicsCourse.sections.length);
    console.log('   Content Blocks:', ethicsCourse.totalContentBlocks);
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
};

updateCourse();
