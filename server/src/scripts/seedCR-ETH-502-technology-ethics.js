import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-eth-502-technology-ethics';

const COURSE = {
  courseCode: 'CR-ETH-502',
  title: 'Ethical Use of Technology in Clinical Practice',
  slug: SLUG,
  ceHours: 2,
  ceuHours: 2,
  category: 'ethics',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  isPublished: false,
  status: 'draft',
  learningObjectives: [
    "Apply the requirements of the ACA Code of Ethics Section H (Distance Counseling, Technology, and Social Media) to common technology decisions in clinical practice.",
    "Construct a telehealth informed-consent process that addresses the distinctive risks, benefits, and limitations of remote care.",
    "Evaluate the privacy, security, and HIPAA obligations that govern electronic protected health information, including encryption, business associate agreements, and breach response.",
    "Analyze licensure and jurisdictional constraints that determine where a clinician may lawfully and ethically deliver telehealth services.",
    "Develop clear, written policies governing social media boundaries, texting, email, and other forms of electronic communication with clients.",
    "Use a structured digital-ethics decision-making framework to resolve novel dilemmas involving emerging tools such as artificial intelligence and cloud-based recordkeeping."
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia",
    licenseType: "LPC"
  },
  provider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    shortName: "GAITP LLC",
    acepNumber: "7760",
    approvalBody: "NBCC"
  },
  approvals: [
    {
      body: "NBCC",
      number: "#7760",
      hourBreakdown: [{ label: "core", hours: 2 }]
    }
  ],
  sections: [
    {
      title: "Foundations of Technology Ethics in Clinical Practice",
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: "Foundations of Technology Ethics in Clinical Practice",
          subtitle: "Why digital tools demand a renewed ethical lens",
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>Technology has moved from the periphery of clinical practice to its center. Where once a counselor might have debated whether to keep paper charts in a locked cabinet, today nearly every practice relies on electronic health records, online scheduling, video platforms, encrypted messaging, and cloud storage. The convenience is undeniable, and for many clients the option to meet remotely is the difference between receiving care and going without it. Yet each new tool introduces new ethical obligations. The core principles of our profession have not changed: we are still bound to protect confidentiality, to obtain informed consent, to practice within our competence, and to avoid harm. What has changed is the terrain on which we apply those principles. A single misconfigured setting, an unencrypted email, or an offhand reply to a client on social media can compromise client welfare in ways that were not possible a generation ago.</p>
<p>The ethical use of technology is not a niche specialty reserved for clinicians who advertise themselves as telehealth providers. It is a baseline competency for every licensed professional. Even a counselor who sees all clients in person must decide how to store records, how to respond to a text message requesting an appointment change, and how to handle a friend request from a former client. These are not technical questions for an information-technology department to resolve; they are ethical questions that determine whether we are protecting our clients or exposing them. The profession has responded by codifying expectations. The American Counseling Association devotes an entire section of its Code of Ethics, Section H, to Distance Counseling, Technology, and Social Media. That section does not exist to discourage the use of technology. It exists to ensure that when we adopt a tool, we have first considered its implications for confidentiality, consent, competence, and the therapeutic relationship.</p>
<p>It helps to begin by naming the enduring ethical principles that technology decisions must serve. Autonomy requires that clients understand and freely consent to the way care is delivered, including the risks unique to digital formats. Beneficence and nonmaleficence require that we choose tools that help rather than harm, and that we anticipate failure modes before they injure a client. Fidelity requires that we keep the promises implicit in the therapeutic relationship, including the promise of confidentiality. Justice requires that we consider whether a tool widens or narrows access for the clients we serve. When a clinician evaluates a new app, platform, or workflow, these principles are the questions to ask: Does this preserve the client's right to make an informed choice? Does it reduce the risk of harm? Does it honor confidentiality? Does it serve the people who most need care?</p>
<p>This course is organized around three movements. First, we establish the foundations: the ethical principles, the regulatory landscape, and the standard of competence that technology demands. Second, we examine the central domains of digital practice in detail, including telehealth informed consent, privacy and security, licensure and jurisdiction, and the management of electronic communication and social media. Third, we build a practical, structured decision-making framework you can apply to dilemmas that no code has yet addressed, including the rapidly emerging use of artificial intelligence in clinical settings. Throughout, the goal is not to memorize rules but to develop the disciplined habit of asking the right questions before adopting any tool.</p>`
        },
        {
          type: 'text',
          content: `<p>Competence is the foundation on which every other technology obligation rests. The ACA Code of Ethics, in Section H.1, makes clear that counselors who deliver services through technology must develop knowledge and skills regarding the specific technologies they use. This is a meaningful standard. It is not enough to know how to conduct a session in person and then assume those skills transfer seamlessly to a video platform. Distance counseling introduces distinct dynamics: the loss of full-body nonverbal information, the possibility of technical disruption mid-session, the difficulty of managing a crisis when the client is not physically present, and the challenge of confirming that the client is alone and in a private space. A competent telehealth clinician has thought through each of these contingencies in advance and has procedures ready when they occur.</p>
<p>Technological competence has two faces. The first is clinical competence: the ability to build rapport, assess risk, and intervene effectively in a remote modality. Research on telebehavioral health has matured considerably, and the evidence base supports the effectiveness of remote care for many presentations, particularly when clinicians adapt their methods thoughtfully rather than simply transplanting in-person techniques. The second face is technical competence: a working understanding of the tools themselves. A clinician does not need to be an engineer, but does need to understand, at a functional level, what encryption protects, what a business associate agreement obligates a vendor to do, what settings on a video platform reduce the risk of an uninvited participant, and how to verify that a storage service meets regulatory standards. When a clinician cannot answer basic questions about how a tool protects client information, that is a signal that competence has not yet been established and that consultation or training is needed before the tool is used with clients.</p>
<p>Competence also requires honest self-assessment about the limits of remote care. Some clients and some presentations are poorly suited to distance counseling. A client in acute crisis, a client without reliable access to a private space, or a client whose clinical needs require in-person assessment may be better served by referral or by an in-person arrangement. Part of ethical technology use is recognizing when a tool is the wrong fit and being willing to forgo convenience in favor of client welfare. The decision to offer telehealth is itself a clinical decision that must be revisited as a client's circumstances change. A modality that served a client well during a stable period may become inadequate during an acute episode, and the clinician must be prepared to adjust the plan accordingly.</p>
<p>Finally, competence is not a one-time achievement. Technology evolves, regulations are updated, and the threats to client information shift constantly. A platform that was secure last year may have a newly discovered vulnerability this year. A clinician who established competence with one tool inherits a continuing obligation to stay current as that tool changes and as new tools enter practice. This is why technology ethics is properly understood as an ongoing discipline rather than a checklist completed once. The clinician who treats it as a living responsibility, reviewed regularly and updated as conditions change, is the clinician best positioned to protect clients in a digital environment.</p>`
        },
        {
          type: 'text',
          content: `<p>It is worth pausing to consider how the four foundational principles of biomedical and counseling ethics translate into concrete technology choices, because the translation is not always obvious. Take autonomy. In an in-person setting, autonomy is honored largely through a conversation about the goals and methods of treatment. In a digital setting, autonomy extends to choices the client may not even know they are making: which platform will host their most private disclosures, where their records will be stored, whether their session might be recorded, and what happens to their data if the clinician changes vendors or closes the practice. A client cannot exercise autonomy over risks they have never been told about. The ethical clinician therefore treats disclosure of technology-specific risks as part of honoring autonomy, not as a bureaucratic add-on. The client should leave the consent conversation understanding, in plain language, what protections are in place and what residual risks remain.</p>
<p>Beneficence and nonmaleficence ask the clinician to weigh benefits against harms, and technology sharpens this calculus in both directions. The benefits of digital tools are real and sometimes profound: a client in a rural area with no local provider, a client with a disability that makes travel difficult, a client whose work schedule precludes daytime appointments, and a client who feels safer disclosing from home can all receive care that would otherwise be inaccessible. These are genuine goods that a clinician should not dismiss out of an excess of caution. At the same time, the harms are also real: a confidentiality breach can damage a client's relationships, employment, or legal standing in ways that therapy cannot easily repair. The ethical task is not to maximize one principle at the expense of the other but to hold them in tension, choosing tools and workflows that capture the access benefits while minimizing the confidentiality risks.</p>
<p>Justice, the fourth principle, is easy to overlook in technology decisions but deeply relevant. The digital divide is real: not every client has reliable broadband, a private space, a current device, or the digital literacy to navigate a video platform. A practice that offers only telehealth may inadvertently exclude the very clients who most need flexible access, while a practice that refuses telehealth entirely may exclude others. Justice asks the clinician to consider the population served and to design offerings that widen rather than narrow access. It also asks the clinician to be attentive to how technology choices affect different groups differently, recognizing that a tool that works well for one client may be a barrier for another. Thinking about justice keeps technology decisions from defaulting to the clinician's convenience alone.</p>
<p>Fidelity, finally, is the principle most directly tied to confidentiality, which is the promise at the heart of the therapeutic relationship. When a client discloses something painful, they do so trusting that it will be held in confidence. Every technology decision either honors or strains that trust. A clinician who uses an unsecured consumer app for sessions, who lets clinical notes accumulate on a personal phone, or who replies to sensitive questions over standard email is straining the promise of confidentiality even if no breach ever occurs, because the protection the client was promised is not actually in place. Fidelity asks the clinician to make the promise of confidentiality real in the architecture of the practice, not merely in its intentions. The principles, taken together, give the clinician a coherent lens: every tool should preserve choice, do more good than harm, widen access, and keep the promise of confidentiality.</p>`
        },
        {
          type: 'text',
          content: `<p>A common misconception deserves direct correction: many clinicians assume that if a tool is widely used by the public, or even widely used by other clinicians, it must be acceptable for clinical work. This assumption is dangerous. Popularity is a measure of convenience and market success, not of regulatory compliance or clinical suitability. A messaging app used by hundreds of millions of people may offer no business associate agreement and may store messages in ways that do not meet HIPAA standards. The fact that colleagues use a particular tool tells you that it is convenient and perhaps that it has not yet caused a visible problem; it does not tell you that it protects client information or that it would withstand scrutiny in a complaint or audit. The ethical clinician evaluates each tool on its merits, asking specific questions about security, business associate agreements, and data handling, rather than relying on the comfort of the crowd.</p>
<p>Another misconception is that responsibility for protecting client information can be delegated entirely to a vendor. When a clinician contracts with a secure platform, it is tempting to assume that the vendor has now taken over the confidentiality obligation and that the clinician can stop worrying. This is only partly true. The vendor assumes contractual obligations through the business associate agreement, but the clinician remains the covered entity with ultimate responsibility for the client's information. The clinician must still configure the tool correctly, use strong authentication, train any staff, control physical access to devices, and respond appropriately if something goes wrong. Vendors handle part of the work, but they cannot relieve the clinician of professional responsibility. Accountability, in the end, rests with the licensed professional who chose the tool and uses it with clients.</p>
<p>It also bears emphasizing that documentation is part of competence. Throughout this course, the recurring instruction to document a determination, whether of a client's location, a consent conversation, or a technology decision, is not mere bureaucratic caution. Documentation serves the client by creating a record of the deliberate process that protected them, and it serves the clinician by demonstrating, if ever questioned, that decisions were made thoughtfully and in accordance with applicable standards. A clinician who confirmed a client's location, recognized a jurisdictional issue, consulted about it, and documented the resolution has a far stronger position than one who handled the same situation well but kept no record. In technology ethics, the deliberation and its documentation are two halves of the same professional act.</p>
<p>Finally, it helps to frame technology competence as a posture of curiosity rather than fear. Clinicians sometimes approach new tools with anxiety, worried that they will inadvertently violate a rule they do not fully understand. That anxiety is understandable, but it can lead either to paralysis, where the clinician avoids beneficial tools, or to denial, where the clinician adopts tools without examining them. A better posture is disciplined curiosity: a willingness to ask how a tool works, what it does with client data, and whether it meets applicable standards, combined with a readiness to seek consultation when the answers are unclear. The clinician who cultivates this posture neither avoids technology nor adopts it carelessly, but engages it with the same thoughtful attention they bring to any clinical decision. This is the mindset the rest of the course aims to build.</p>`
        },
        {
          type: 'text',
          content: `<p>The relationship among the three layers of regulation, federal law, state law, and the profession's ethics code, repays a closer look, because clinicians frequently misjudge how they fit together. A useful way to picture the relationship is as a set of overlapping minimums, each of which the clinician must satisfy. HIPAA sets a national floor for protecting health information, but it explicitly does not preempt state laws that are more protective of privacy. This means that in many states, the operative standard is stricter than HIPAA alone, particularly for mental health and substance use records, which often carry heightened confidentiality protections under both state law and specialized federal regulations. A clinician who studies only HIPAA and concludes that a practice is permissible may still be violating a stricter state rule. The disciplined habit is to ask, for any given decision, what the most protective applicable standard requires, and to meet that, rather than stopping at the federal floor.</p>
<p>The ethics code adds yet another layer, and it operates differently from law. Where law tells the clinician what is permitted or prohibited and is enforced by courts and agencies, the ethics code articulates the standard of conduct the profession expects and is enforced through licensing boards and professional associations. A practice can be legally permissible yet ethically questionable. For instance, the law might not specifically prohibit a particular use of a client's social media information, but the ethics code's emphasis on respecting client privacy and avoiding harm may render that use inappropriate. Conversely, the ethics code sometimes calls for protections that the law does not yet require, anticipating harms that legislation has not caught up with. The conscientious clinician treats the ethics code not as a redundant restatement of the law but as an independent and often higher standard.</p>
<p>This layered structure has a practical consequence worth internalizing: compliance is not a single checkbox but a set of questions asked from multiple angles. For any technology decision, the clinician should ask what HIPAA requires, what the relevant state law requires, and what the ethics code requires, recognizing that the answer to the overall question is whichever of these is most protective of the client. This sounds laborious, but with practice it becomes a quick mental habit, and for recurring decisions, such as choosing a video platform or setting a communication policy, the analysis need only be done once and then revisited as conditions change. The investment in understanding the layered framework pays dividends in confidence: a clinician who knows how the layers fit together can make technology decisions without the nagging worry of having overlooked an applicable rule.</p>
<p>It is also worth noting that the layered framework is not static. Laws are amended, agencies issue new guidance, and ethics codes are periodically revised to address developments such as social media and, increasingly, artificial intelligence. The clinician's obligation to stay current, discussed earlier as part of competence, includes staying current with this evolving regulatory landscape. This does not require becoming a legal expert, but it does require maintaining awareness, consulting reliable sources, and seeking guidance when a significant change occurs. The professional associations, licensing boards, and federal agencies that govern practice all publish guidance, and a clinician who periodically checks these sources, especially when adopting a new tool or facing an unfamiliar situation, will be far better protected than one who assumes that the rules learned years ago still fully apply today.</p>`
        },
        {
          type: 'imageText',
          content: `<p>The regulatory landscape that governs technology in clinical practice is layered. At the broadest level sits the Health Insurance Portability and Accountability Act, which establishes federal standards for protecting health information. Beneath HIPAA sit state laws, which frequently impose stricter requirements and which always govern licensure. Alongside both sit professional ethics codes, which articulate the standards the profession holds itself to regardless of what the law minimally requires. A clinician must satisfy all three. Compliance with HIPAA does not excuse a violation of state law, and meeting the legal minimum does not necessarily satisfy the higher bar set by the profession's ethics code. The prudent approach is to identify, for any given decision, the most protective standard among the applicable rules and to meet that standard.</p>`,
          image: "",
          imageAlt: "Layered diagram showing federal HIPAA rules, state laws, and professional ethics codes overlapping as the combined regulatory framework for technology in clinical practice",
          imagePosition: 'left'
        },
        {
          type: 'videoEmbed',
          title: "Orientation: The Ethics of Technology in Counseling",
          videoUrl: "https://www.youtube.com/embed/PLACEHOLDER_technologyethics",
          description: "A brief orientation to how enduring ethical principles apply to the tools of digital clinical practice, framing the topics developed throughout this course.",
          accessibility: { ariaLabel: "Orientation video on the ethics of technology in counseling", role: 'complementary' }
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: "What does ACA Section H actually cover?",
              content: `<p>Section H of the ACA Code of Ethics addresses Distance Counseling, Technology, and Social Media. It covers the clinician's responsibility to develop competence with the technologies used, the laws and statutes that apply across jurisdictions, the need for informed consent specific to distance services, confidentiality and security obligations, the limits of distance counseling, the use of records and web maintenance, and the management of social media. It is the most comprehensive single source within the code for technology questions and should be the first reference a clinician consults.</p>`
            },
            {
              title: "Is HIPAA the only law I need to worry about?",
              content: `<p>No. HIPAA establishes a federal floor for protecting health information, but state laws frequently add stricter requirements, particularly around the confidentiality of mental health and substance use records, the handling of minors' records, and breach notification. State licensure laws also determine where and how you may practice. A clinician must satisfy HIPAA, applicable state law, and the profession's ethics code, defaulting to whichever standard is most protective of the client.</p>`
            },
            {
              title: "Does technological competence mean I need to be an IT expert?",
              content: `<p>No, but it does mean you must understand your tools well enough to protect clients. You should be able to explain, at a functional level, what encryption protects, what a business associate agreement obligates a vendor to do, how to configure a platform to reduce risk, and how to verify that a service meets regulatory standards. When you cannot answer these questions, that is a signal to seek consultation or training before using the tool with clients.</p>`
            },
            {
              title: "When is telehealth the wrong choice?",
              content: `<p>Telehealth may be inappropriate when a client is in acute crisis, lacks a reliable private space, or has clinical needs that require in-person assessment or intervention. The decision to offer distance services is itself a clinical decision that must be revisited as the client's circumstances change. Ethical practice sometimes means declining the convenient option in favor of a referral or an in-person arrangement that better serves the client.</p>`
            }
          ]
        },
        {
          type: 'callout',
          title: "Competence Comes First",
          calloutType: 'ethics',
          content: `<p>Before adopting any new tool, ask whether you have the clinical and technical competence to use it safely. ACA Section H.1 requires counselors to understand the specific technologies they employ. When you cannot explain how a tool protects client information or how you would manage a crisis within it, competence has not yet been established and the tool should not be used with clients until it has.</p>`
        },
        {
          type: 'multipleChoice',
          question: "According to the ACA Code of Ethics, which section specifically addresses distance counseling, technology, and social media?",
          options: [
            { text: "Section A: The Counseling Relationship", isCorrect: false },
            { text: "Section H: Distance Counseling, Technology, and Social Media", isCorrect: true },
            { text: "Section C: Professional Responsibility", isCorrect: false },
            { text: "Section F: Supervision, Training, and Teaching", isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: "Section H of the ACA Code of Ethics is devoted to Distance Counseling, Technology, and Social Media. It addresses competence, applicable laws, informed consent, confidentiality and security, limits of distance counseling, records, and social media. It should be a clinician's first reference for technology-related ethical questions."
        },
        {
          type: 'multiSelect',
          question: "Which of the following are components of technological competence as discussed in this section? (Select all that apply.)",
          options: [
            { text: "The clinical ability to build rapport and assess risk in a remote modality", isCorrect: true },
            { text: "A functional understanding of what encryption and business associate agreements accomplish", isCorrect: true },
            { text: "The ability to recognize when telehealth is the wrong fit for a client", isCorrect: true },
            { text: "A guarantee that no technical disruption will ever occur during a session", isCorrect: false },
            { text: "An ongoing commitment to stay current as tools and regulations change", isCorrect: true }
          ],
          explanation: "Technological competence includes clinical competence in the remote modality, functional technical understanding, sound judgment about when telehealth is inappropriate, and an ongoing commitment to stay current. No clinician can guarantee that disruptions will never occur; competence means being prepared for them, not eliminating them."
        },
        {
          type: 'flashcardDeck',
          title: "Core Concepts: Foundations of Technology Ethics",
          cards: [
            { front: "Autonomy in technology decisions", back: "The client's right to understand and freely consent to the way care is delivered, including the risks unique to digital formats." },
            { front: "Nonmaleficence in technology decisions", back: "The obligation to anticipate failure modes and choose tools that avoid harm before they can injure a client." },
            { front: "The three-layer regulatory framework", back: "Federal HIPAA standards, state laws (often stricter), and professional ethics codes. A clinician must satisfy the most protective applicable standard." },
            { front: "ACA Section H.1", back: "Requires counselors to develop knowledge and skills regarding the specific technologies they use before delivering services through them." },
            { front: "Competence as an ongoing discipline", back: "Technology and threats evolve; establishing competence with a tool creates a continuing obligation to stay current as it changes." }
          ],
          accessibility: { ariaLabel: "Flashcard deck reviewing core concepts of technology ethics foundations", role: 'application' }
        },
        {
          type: 'reflection',
          prompt: "Consider the technologies you currently use in your practice, including any you use only occasionally. For which of them could you clearly explain how client information is protected? Identify one tool where your understanding is incomplete and describe the step you will take to close that gap."
        },
        {
          type: 'keyTakeaway',
          title: "Key Takeaways",
          takeaways: [
            "The enduring ethical principles of autonomy, beneficence, nonmaleficence, fidelity, and justice still govern practice; technology changes the terrain on which we apply them, not the principles themselves.",
            "Technology ethics is a baseline competency for every clinician, not a specialty reserved for those who advertise telehealth.",
            "ACA Section H is the profession's comprehensive reference for distance counseling, technology, and social media.",
            "A clinician must satisfy federal law, state law, and the ethics code, defaulting to the most protective applicable standard.",
            "Competence has both a clinical and a technical face, and it is an ongoing obligation rather than a one-time achievement."
          ]
        }
      ]
    },
    {
      title: "Telehealth Consent, Privacy, Security, and Jurisdiction",
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: "Telehealth Consent, Privacy, Security, and Jurisdiction",
          subtitle: "The central duties of remote and digital care",
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>Informed consent is the ethical cornerstone of telehealth. The general principle of informed consent is familiar to every clinician: clients have the right to understand the nature of the services they will receive and to agree to them freely. Distance counseling expands what must be disclosed. ACA Section H.2 requires that, in addition to the usual elements of consent, clinicians address the distinctive features of distance services. Clients must understand the benefits of remote care, such as increased access and convenience, but they must also understand its limitations and risks. These include the possibility of technology failure during a session, the differences in how confidentiality is protected, the procedures the clinician will follow if the connection is lost, and the boundaries of emergency response when the client is not physically present.</p>
<p>A robust telehealth informed-consent process is not a single signature on a generic form. It is a conversation, documented appropriately, that covers several concrete areas. First, the client should understand which platform will be used and what the clinician has done to secure it. Second, the client should know what to do if the technology fails mid-session, including a pre-arranged fallback such as a phone number to call. Third, the client should understand the clinician's emergency procedures: what happens if a crisis arises during a remote session, how the clinician will reach emergency services in the client's location, and why it is essential that the clinician always know the client's physical location at the start of each session. Fourth, the client should understand any limits on the modality, including that the clinician may recommend transitioning to in-person care if remote services prove inadequate. Each of these elements protects the client and protects the clinician, and each should be revisited rather than assumed to be settled by an initial agreement.</p>
<p>Confirming the client's physical location at the start of every session deserves special emphasis because it serves two purposes at once. Clinically, knowing where the client is allows the clinician to direct emergency services if a crisis emerges. Legally and ethically, the client's location determines which jurisdiction's laws apply and whether the clinician is licensed to provide services there. A client who has traveled to another state, even temporarily, may have moved outside the clinician's authorized practice area. The simple habit of asking, at the beginning of each session, where the client is physically located is one of the most important risk-management practices in telehealth. It is easy to overlook precisely because it feels routine, but its routine nature is what makes it reliable.</p>
<p>Consent must also be revisited over time. A client who consented to telehealth during a stable period may face new circumstances, such as a deterioration in symptoms, a change in living situation that eliminates a private space, or a move to a different state. Each of these changes can alter the appropriateness or even the legality of continuing remote care. Treating consent as a living agreement, reviewed when circumstances change rather than filed away after the first session, is the mark of a clinician who understands that telehealth ethics is dynamic. The clinician who documents these check-ins demonstrates a deliberate, ongoing process rather than a one-time formality.</p>`
        },
        {
          type: 'text',
          content: `<p>Privacy and security obligations form the second central domain of digital practice. HIPAA establishes the federal framework for protecting electronic protected health information, and its requirements have direct, practical implications for everyday clinical decisions. The Security Rule requires covered entities to implement administrative, physical, and technical safeguards. Administrative safeguards include written policies, workforce training, and risk analysis. Physical safeguards include controlling access to the devices and spaces where information is stored. Technical safeguards include access controls, audit controls, and encryption. For most clinicians, the most consequential technical safeguard is encryption, which renders information unreadable to anyone who intercepts it without the key. Encryption applies both to data in transit, such as a video session or an email crossing the internet, and to data at rest, such as records stored on a laptop or in the cloud.</p>
<p>A central HIPAA concept that every clinician using technology must understand is the business associate agreement. When a clinician uses a third-party service that will create, receive, maintain, or transmit protected health information, such as a video platform, a cloud storage provider, or an email service, that vendor becomes a business associate. HIPAA requires a written business associate agreement that obligates the vendor to safeguard the information and to comply with applicable rules. A consumer-grade tool that is not willing to enter into a business associate agreement is not appropriate for handling protected health information, no matter how convenient or popular it may be. The willingness of a vendor to sign a business associate agreement is one of the clearest signals of whether a tool is suitable for clinical use.</p>
<p>Breach response is the part of privacy practice that clinicians most hope never to need and most regret not having prepared. A breach is, broadly, an unauthorized acquisition, access, use, or disclosure of protected health information that compromises its security or privacy. HIPAA's Breach Notification Rule requires covered entities to notify affected individuals, and in some cases the Department of Health and Human Services and the media, when a breach occurs. The notification requirements are time-sensitive. A clinician who has thought through breach response in advance, who knows what constitutes a breach, who maintains an inventory of where protected information lives, and who has a written response plan, is far better positioned than one who must improvise in a crisis. Prevention is the priority, but a response plan is the necessary backstop.</p>
<p>Encryption, business associate agreements, and breach planning are not abstractions; they translate into concrete daily choices. Choosing a video platform that offers a business associate agreement and transport encryption, declining to send substantive clinical content over unencrypted email, storing records only in services that meet HIPAA standards, and using strong authentication on every device that touches client information are all expressions of the same underlying obligation. The clinician who internalizes these practices protects clients not through occasional heroic effort but through consistent, unremarkable habits that hold up under scrutiny.</p>`
        },
        {
          type: 'text',
          content: `<p>Licensure and jurisdiction constitute the third central domain, and they are among the most frequently misunderstood aspects of telehealth. The governing principle is straightforward to state but easy to violate in practice: in general, a clinician must be licensed in the state where the client is physically located at the time of service, not merely in the state where the clinician sits. This is because the practice of counseling is regulated by the states, and a state's licensing board has authority over services delivered to people within its borders. A clinician licensed only in one state who provides telehealth to a client who has traveled to or relocated in another state may be practicing without authorization in that second state, with serious professional and legal consequences.</p>
<p>This principle has practical implications that recur constantly in telehealth. A client who travels for work or to visit family, a college student who moves between a home state and a school state, or a client who relocates permanently can all move outside the clinician's authorized jurisdiction. The clinician's obligation is to know where the client is and to determine whether services may lawfully be provided there. When the client moves outside the clinician's licensure, the options include obtaining licensure in the new state, using a recognized interstate arrangement if one applies, arranging a referral to a clinician licensed where the client is, or pausing services until the client returns. What is not an option is simply continuing as though location did not matter.</p>
<p>The profession has worked to reduce the friction of multi-state practice. Interstate compacts, which are agreements among participating states to recognize one another's licenses under defined conditions, have emerged for several professions to facilitate practice across state lines. These arrangements can expand a clinician's authorized practice area, but they apply only among states that participate and only under the conditions the compact specifies. A clinician who wishes to rely on such an arrangement must verify that both the home state and the client's state participate and that the clinician meets the compact's requirements. Compacts are a genuine advance, but they are not a blanket permission to practice anywhere, and they do not eliminate the need to track where each client is located.</p>
<p>Because licensure rules vary and continue to evolve, the practical posture for a telehealth clinician is one of verification rather than assumption. Before initiating services with a new client, the clinician should confirm the client's location and the clinician's authority to practice there. When a client's location changes, the clinician should re-verify. Documenting these determinations protects the client and the clinician alike, and it demonstrates the deliberate attention to jurisdiction that distinguishes competent telehealth from careless convenience. Jurisdiction is not a bureaucratic afterthought; it is a precondition of lawful and ethical care.</p>`
        },
        {
          type: 'text',
          content: `<p>To make the telehealth consent process concrete, it helps to walk through the elements a clinician should cover in a first telehealth conversation and revisit thereafter. The clinician should describe the platform that will be used and explain, in plain terms, what makes it appropriate for clinical work, including that the vendor has signed a business associate agreement and that sessions are encrypted. The clinician should explain the plan for technology failure: if the video freezes or the connection drops, what should the client do, and how will the clinician re-establish contact. A common practice is to agree in advance that if the connection is lost, the clinician will call the client at a designated phone number, and that if contact cannot be restored within a few minutes, the session will be rescheduled. Naming this plan in advance prevents confusion and reassures the client that a dropped connection is a manageable event rather than a crisis.</p>
<p>Emergency planning is the part of telehealth consent that clinicians most often underdevelop, yet it is the most consequential when it matters. Because the client is not in the room, the clinician cannot directly intervene in a crisis and cannot easily summon help to the client's side. The clinician should therefore know, at the start of every session, exactly where the client is, and should have on hand the means to contact emergency services in the client's location if needed. The clinician and client should discuss in advance who else might be contacted in an emergency, such as an emergency contact or a local crisis resource, and the client should understand the limits of what the clinician can do remotely. This conversation is not meant to frighten the client; it is meant to ensure that, should a crisis arise, both parties already know the plan rather than improvising at the worst possible moment.</p>
<p>Privacy on the client's end is another element that distinguishes telehealth consent from in-person consent. In an office, the clinician controls the environment and can guarantee a private, soundproofed space. In telehealth, the client's environment is outside the clinician's control. A client may be in a shared apartment, a parked car, or a room where others can overhear. The clinician should discuss with the client the importance of finding a private space, using headphones, and ensuring that the session will not be overheard, and should be alert to signs that the client is not actually alone or private. When a client's environment cannot reliably be made private, that is a meaningful limitation on the suitability of telehealth for that client, and it should factor into the ongoing decision about whether remote care remains appropriate.</p>
<p>Finally, telehealth consent should address recording and documentation. Clients should understand whether sessions will be recorded, and if so, why, where the recordings will be stored, who can access them, and how long they will be kept. As a general matter, recording a therapy session introduces significant confidentiality risk and should be undertaken only with a clear clinical or supervisory rationale and the client's explicit, informed consent. Clients should also understand that the clinician keeps clinical records of telehealth sessions just as for in-person sessions, that those records are protected, and how the client may access them. Covering these elements transforms consent from a signature on a form into a genuine, shared understanding of how the remote relationship will work.</p>`
        },
        {
          type: 'text',
          content: `<p>Returning to privacy and security, it is worth examining the HIPAA Security Rule's three categories of safeguards in a bit more depth, because each maps onto practical habits. Administrative safeguards are the policies and procedures that govern how a practice handles protected health information. They include conducting a risk analysis to identify where information is vulnerable, designating responsibility for security, training anyone who handles information, and having written procedures for routine operations and for incidents. For a solo practitioner, administrative safeguards may feel like overkill, but even a one-person practice benefits from having thought through, and written down, how it protects information and what it will do if something goes wrong. The act of writing a simple security policy forces the clinician to confront questions that are easy to defer.</p>
<p>Physical safeguards concern the tangible world: the devices, the spaces, and the media where information lives. A laptop left unattended in a coffee shop, a phone without a passcode, a backup drive in an unlocked drawer, or a printout left on a desk are all physical vulnerabilities. Physical safeguards include locking devices, controlling who can enter the spaces where information is kept, and securely disposing of any physical media that contains protected information. In a home office, physical safeguards extend to keeping family members and visitors away from work devices and records. These measures are unglamorous but essential, because the most sophisticated encryption is useless if an unlocked, logged-in device is simply picked up by someone who should not have it.</p>
<p>Technical safeguards are the digital protections built into the tools themselves. Access controls ensure that only authorized people can reach the information, typically through unique user accounts and strong authentication. Audit controls record who accessed what and when, creating accountability and a means to detect misuse. Transmission security, primarily encryption, protects information as it moves across networks. And integrity controls ensure that information is not improperly altered or destroyed. For most clinicians, the practical expression of technical safeguards is choosing tools that offer these protections by default, enabling features such as multi-factor authentication, and resisting the temptation to disable security features for the sake of convenience. A small inconvenience at login is a reasonable price for protecting a client's most sensitive disclosures.</p>
<p>Understanding these categories also clarifies why a single secure tool does not make a practice secure. A clinician might use an excellent encrypted video platform yet undermine it by emailing session notes to a personal account, storing a client list in an unprotected spreadsheet, or leaving a workstation logged in and unattended. Security is a property of the whole system, not of any single component. The clinician who thinks in terms of administrative, physical, and technical safeguards across the entire workflow, rather than fixating on one impressive tool, is the clinician whose practice actually protects clients. The goal is not perfection, which is unattainable, but a coherent, defensible set of habits that reduce risk across every place client information lives.</p>`
        },
        {
          type: 'text',
          content: `<p>The jurisdictional dimension of telehealth merits one further illustration, because the principle that a clinician must be licensed where the client is located generates situations that are not always intuitive. Consider a few recurring patterns. A college student begins therapy at home over the summer and then returns to school in another state; unless the clinician is licensed in the school's state or a compact applies, continuing the same telehealth relationship during the school year may not be permissible. A client takes an extended business trip or vacation to another state and wants to keep regular sessions; even though the relationship is established and the client has not moved, the client's physical presence in another state at the time of each session raises the same licensure question. A client who works remotely splits time between two states across the week; the clinician must know, for each session, where the client actually is. None of these patterns is exotic, and each illustrates why confirming location is not a formality but a substantive determination that can change the answer about whether a session may proceed.</p>
<p>When a client's location moves outside the clinician's licensure, the clinician has several legitimate paths, and choosing among them is itself an exercise of clinical and ethical judgment. The clinician might pursue licensure in the client's state, which is the most durable solution for clients who will be there long term, though it requires time and meets the requirement only once granted. The clinician might rely on an applicable interstate arrangement, after verifying that it covers the specific states and circumstances. The clinician might arrange a referral to a provider licensed where the client is, which best serves a client who has relocated permanently. Or the clinician might pause services until the client returns to a state where the clinician is authorized, which can work for short absences when continuity can be safely maintained through a brief gap and an appropriate safety plan. What unites all these paths is that they take the licensure constraint seriously; what is never acceptable is to proceed as though the constraint did not exist.</p>
<p>There is also a temptation, when a long-standing client travels briefly, to treat a single session as too minor to matter. This temptation should be resisted. The licensure requirement does not contain an exception for established relationships or for sessions that feel routine, and a board investigating a complaint is unlikely to be persuaded that the rules should bend because the clinician and client knew each other well. Moreover, the very session that seems routine could be the one in which a crisis emerges, and a clinician operating outside their authorized jurisdiction is in a far weaker position to respond, both practically and legally. The safest and most ethical posture is consistency: apply the same location check and the same jurisdictional analysis to every session, so that the rare consequential case is never missed because the routine cases lulled the clinician into inattention.</p>
<p>Documentation, once again, is the clinician's ally in all of this. A brief note confirming the client's location at the start of each session, and a fuller note whenever a jurisdictional question arose and how it was resolved, creates a record that the clinician took the issue seriously and handled it appropriately. Such documentation protects the client by ensuring continuity of thoughtful care, and it protects the clinician by demonstrating diligence. In a domain where the rules vary by state and continue to evolve, a clinician cannot guarantee a perfect outcome in every novel situation, but can guarantee a careful, well-documented process. That process, applied consistently, is what distinguishes responsible telehealth from the careless convenience that puts both client and clinician at risk.</p>`
        },
        {
          type: 'text',
          content: `<p>Breach response warrants its own focused treatment, because it is the scenario in which prior preparation most sharply distinguishes the clinician who copes from the clinician who flounders. The first step in being prepared is understanding what a breach actually is. Under HIPAA, a breach is generally an impermissible acquisition, access, use, or disclosure of protected health information that compromises its security or privacy. Not every mishap rises to this level; for instance, information that was properly encrypted and remains inaccessible may not constitute a reportable breach because the data is unreadable. This is one of the practical reasons encryption matters so much: it can mean the difference between a stolen laptop being a reportable breach of every client's records and being a contained incident in which the encrypted data was never exposed. Knowing this distinction in advance shapes how a clinician prepares and responds.</p>
<p>The second step is maintaining an inventory of where protected information lives. A clinician cannot protect, or properly assess a breach affecting, information whose locations are unknown. The inventory should account for the electronic health record, the video platform, email and messaging tools, cloud storage, local devices, backups, and any other place client information is created or kept. This inventory is itself a security safeguard, because the act of compiling it often reveals forgotten copies and unsecured locations that can then be addressed before any incident occurs. When a potential breach does happen, the inventory allows the clinician to determine quickly which information may have been affected and which clients may need to be notified, rather than scrambling to reconstruct where data was held.</p>
<p>The third step is a written response plan that specifies what to do when an incident is suspected. The plan should cover containing the incident, such as disabling a compromised account or recovering a lost device; assessing what information was involved and whether it was secured; determining notification obligations under applicable law; and carrying out any required notifications within the required timeframes. Because HIPAA's notification requirements are time-sensitive, a clinician who must research the rules from scratch in the middle of a crisis is at a serious disadvantage. A plan prepared in calmer times, even a simple one, ensures that the clinician knows the steps and can act promptly. The plan should also identify whom to consult, such as legal counsel or a privacy professional, since breach determinations can be technical and the consequences of getting them wrong are significant.</p>
<p>The fourth and most important step is prevention, which renders the response plan a backstop rather than a frequently used tool. The same safeguards discussed throughout this section, encryption, strong authentication, controlled physical access, careful vendor selection, and disciplined habits about where information is stored and sent, are what prevent most breaches from occurring in the first place. A clinician who encrypts devices, uses unique strong passwords with multi-factor authentication, keeps client information out of insecure consumer tools, and limits the places data resides has dramatically reduced the likelihood and the potential scope of a breach. Prevention and preparation work together: prevention reduces how often incidents occur, and preparation ensures that when one does occur despite best efforts, the clinician responds in a way that protects clients and complies with the law. Together they express the same underlying commitment to safeguarding the information clients have entrusted to the clinician's care.</p>`
        },
        {
          type: 'imageText',
          content: `<p>A useful mental model for telehealth jurisdiction is to picture the client's physical location as the place where the service is legally rendered. Imagine a clinician sitting in one state and a client sitting in another; the service is treated as occurring where the client is, which is why the clinician must be authorized to practice in the client's state. This is also why confirming location at the start of each session is not a clerical task but a substantive one: it establishes which body of law governs the encounter and whether the clinician may proceed at all.</p>`,
          image: "",
          imageAlt: "Illustration of a clinician and client in two different states connected by a video link, with the client's state highlighted to show that service is legally rendered at the client's location",
          imagePosition: 'right'
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: "What must a telehealth informed-consent process include?",
              content: `<p>Beyond the usual elements of consent, a telehealth process should address the benefits and limitations of remote care, the platform used and its security, a fallback plan if the technology fails mid-session, emergency procedures including how the clinician will reach emergency services in the client's location, the importance of confirming the client's physical location each session, and the possibility of transitioning to in-person care if remote services prove inadequate.</p>`
            },
            {
              title: "Why confirm the client's location at the start of every session?",
              content: `<p>Confirming location serves two purposes. Clinically, it allows the clinician to direct emergency services if a crisis arises. Legally and ethically, the client's location determines which jurisdiction's laws apply and whether the clinician is licensed to provide services there. A client who has traveled may be outside the clinician's authorized practice area, so this simple habit is one of telehealth's most important risk-management practices.</p>`
            },
            {
              title: "What is a business associate agreement and when is it required?",
              content: `<p>A business associate agreement is a written contract required by HIPAA whenever a third-party vendor will create, receive, maintain, or transmit protected health information on the clinician's behalf. This includes video platforms, cloud storage, and email services that handle client information. The agreement obligates the vendor to safeguard the information. A tool whose vendor will not sign one is not appropriate for handling protected health information.</p>`
            },
            {
              title: "Where must a telehealth clinician be licensed?",
              content: `<p>In general, the clinician must be licensed in the state where the client is physically located at the time of service, because the states regulate the practice of counseling within their borders. Interstate compacts may expand a clinician's authorized practice area among participating states under defined conditions, but they do not eliminate the need to track each client's location and verify authority to practice there.</p>`
            },
            {
              title: "What does HIPAA require for breach response?",
              content: `<p>HIPAA's Breach Notification Rule requires covered entities to notify affected individuals when a breach of unsecured protected health information occurs, and in some cases the Department of Health and Human Services and the media. The notifications are time-sensitive. A clinician who maintains an inventory of where protected information lives and a written response plan is far better positioned than one who must improvise in a crisis.</p>`
            }
          ]
        },
        {
          type: 'callout',
          title: "Location Determines Everything",
          calloutType: 'clinical',
          content: `<p>Confirm the client's physical location at the start of every session. It tells you where to direct emergency services in a crisis and which jurisdiction's laws govern the encounter. A client who has traveled may have moved outside your licensure. This single habit, repeated routinely, is among the most powerful risk-management practices in telehealth.</p>`
        },
        {
          type: 'matching',
          matchingInstructions: "Match each telehealth and privacy concept to its correct description.",
          matchingPairs: [
            { term: "Business associate agreement", definition: "A written HIPAA-required contract obligating a third-party vendor to safeguard protected health information it handles for the clinician." },
            { term: "Encryption at rest", definition: "Protection that renders stored data, such as records on a laptop or in the cloud, unreadable without the key." },
            { term: "Confirming client location", definition: "The session-opening practice that establishes emergency response and determines which jurisdiction's laws apply." },
            { term: "Interstate compact", definition: "An agreement among participating states to recognize one another's licenses under defined conditions to facilitate multi-state practice." },
            { term: "Breach Notification Rule", definition: "The HIPAA provision requiring time-sensitive notification of affected individuals when unsecured protected health information is compromised." }
          ]
        },
        {
          type: 'fillInBlank',
          title: "Key Terms in Telehealth Privacy and Jurisdiction",
          blanks: [
            { prompt: "Encryption protects data in two states: data in transit and data at ____.", answer: "rest", acceptAlternates: [] },
            { prompt: "In general, a clinician must be licensed in the state where the ____ is physically located at the time of service.", answer: "client", acceptAlternates: ["patient"] },
            { prompt: "A third-party vendor that handles protected health information must sign a business ____ agreement.", answer: "associate", acceptAlternates: [] }
          ]
        },
        {
          type: 'scenarioTree',
          title: "Decision Practice: The Traveling Client",
          description: "A long-term telehealth client logs on for a session and mentions she is visiting family in another state for two weeks. You are licensed only in your home state. Work through the decision.",
          nodes: [
            { id: 'start', text: "Your client is physically located in a state where you are not licensed. What is your first step?", choices: [
              { text: "Confirm her exact location and pause clinical services until you determine your authority to practice there.", nextId: 'a' },
              { text: "Proceed with the session as planned since she is your established client.", nextId: 'b' }
            ] },
            { id: 'a', text: "Correct. You confirm her location, explain the licensure issue transparently, and explore options together. Because she will return in two weeks, you discuss a referral for any urgent needs, agree on a safety plan, and resume regular sessions when she is back in your jurisdiction, documenting the determination.", isEnd: true },
            { id: 'b', text: "Proceeding risks practicing without authorization in the client's state. The ethical and lawful step is to confirm location, recognize the jurisdictional limit, and determine your authority before continuing. Continuing as though location did not matter is not an available option.", isEnd: true }
          ],
          accessibility: { ariaLabel: "Interactive scenario about a telehealth client traveling out of state", role: 'application' }
        },
        {
          type: 'reflection',
          prompt: "Review your own telehealth informed-consent process, or imagine designing one if you do not yet offer remote services. Which of the elements discussed in this section, such as the technology-failure fallback, emergency procedures, and location confirmation, are clearly addressed, and which would you strengthen?"
        },
        {
          type: 'keyTakeaway',
          title: "Key Takeaways",
          takeaways: [
            "Telehealth informed consent must address the distinctive benefits, limitations, and risks of remote care, including technology failure and emergency procedures.",
            "Confirming the client's physical location at the start of every session protects both emergency response and jurisdictional compliance.",
            "HIPAA requires administrative, physical, and technical safeguards; encryption and business associate agreements are the most consequential for everyday practice.",
            "In general, a clinician must be licensed where the client is physically located at the time of service, and interstate compacts expand but do not eliminate this requirement.",
            "Consent and jurisdiction are living determinations that must be revisited whenever the client's circumstances change."
          ]
        }
      ]
    },
    {
      title: "Digital Boundaries, Emerging Tools, and a Decision Framework",
      order: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: "Digital Boundaries, Emerging Tools, and a Decision Framework",
          subtitle: "Social media, communication policies, AI, and structured ethical reasoning",
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>Social media and digital boundaries present some of the most subtle ethical challenges in contemporary practice because they blur lines that were once naturally separate. Before the rise of social platforms, the personal and professional lives of a clinician rarely intersected with those of a client outside the consulting room. Now a client may discover a clinician's personal profile, send a friend request, comment on a public post, or research the clinician online before the first session. The clinician, in turn, may be tempted to look up a client's public posts. ACA Section H.6 addresses social media directly, emphasizing that clinicians should maintain separate professional and personal presences, should clarify in informed consent how social media will and will not be used in the professional relationship, and should respect client privacy by not searching for client information online without consent and a clinical rationale.</p>
<p>The most practical protection against social media boundary problems is a clear, written policy that is shared with clients at the outset. Such a policy explains that the clinician maintains a professional presence distinct from any personal accounts, that the clinician will not accept friend or connection requests from clients on personal platforms, that the clinician will not initiate searches of a client's online activity without a clear clinical reason and the client's awareness, and that the professional relationship will be conducted through agreed-upon channels rather than social media. Articulating these expectations in advance prevents the awkward and potentially harmful situations that arise when a clinician must improvise a response to a friend request or an unexpected online interaction. A policy stated clearly at the beginning is far easier to uphold than a boundary defended after the fact.</p>
<p>Searching for a client online deserves particular caution. There can be legitimate clinical reasons to look up information about a client, such as a safety concern, but routine curiosity is not one of them. When a clinician searches for a client without a clinical rationale and without the client's knowledge, the clinician acquires information the client did not choose to share within the therapeutic relationship, which can distort the clinical picture and undermine trust. The disciplined default is to refrain from such searches, to be transparent if a search is clinically warranted, and to document the rationale. The same caution applies to what clinicians post about themselves: a personal post that seems innocuous can have professional implications if a client encounters it, so clinicians benefit from thinking about their digital footprint as part of their professional presentation.</p>
<p>Boundaries in the digital age also extend to the simple question of how clinician and client communicate between sessions. The convenience of texting and email is genuine, but these channels carry risks that must be managed through clear policies. A client who texts a clinician at midnight in distress, a clinician who replies to substantive clinical questions over unencrypted email, or a record of clinical content scattered across personal devices all illustrate how casual communication can create ethical and security problems. The remedy, again, is a policy established in advance: what channels are used, for what purposes, with what expectations about response time, and with what security protections. The next section examines these communication policies in detail.</p>`
        },
        {
          type: 'text',
          content: `<p>Electronic communication policies translate the abstract duty of confidentiality into the texture of daily practice. Texting and email are now the default ways many people communicate, and clients naturally expect to reach their clinicians the same way. Yet standard texting and standard email are generally not secure channels for protected health information. A thoughtful clinician therefore decides in advance how these channels may be used and communicates those decisions clearly. A common and defensible approach is to permit texting and email only for administrative purposes, such as confirming or rescheduling appointments, while directing all substantive clinical content to a secure platform or to scheduled sessions. This preserves convenience for logistics while protecting sensitive information from insecure transmission.</p>
<p>A complete communication policy addresses several questions. Which channels are approved, and for what purposes? What are realistic expectations about response time, so that a client in crisis does not rely on a text message that the clinician may not see for hours? What should a client do in an emergency, given that no asynchronous channel is appropriate for crisis response? How will the clinician handle the documentation of electronic communications, recognizing that texts and emails relevant to care may become part of the clinical record? And what security measures protect any electronic communication that does occur, such as encrypted platforms or secure portals? Addressing these questions in advance and reviewing them as part of informed consent gives both clinician and client a shared, predictable understanding.</p>
<p>Cloud storage and recordkeeping raise parallel concerns. Storing records in the cloud can improve security and reliability compared with a single local device, but only if the service meets regulatory standards and the clinician has configured it correctly. The same principles that govern other vendors apply: the service must be willing to sign a business associate agreement, the data should be encrypted at rest and in transit, access should be controlled with strong authentication, and the clinician should understand how the service handles backups, retention, and deletion. Records must also be retained for the period required by applicable law and the ethics code, and they must be disposed of securely when that period ends. Convenience features that sync records across personal devices can quietly expand the number of places protected information lives, so clinicians should know exactly where their records reside and ensure each location is secure.</p>
<p>The emergence of artificial intelligence tools introduces a new frontier that existing codes address only by extension. Clinicians are encountering AI in many forms: tools that draft or summarize clinical notes, chatbots that interact with clients, scheduling and triage assistants, and general-purpose systems that a clinician might be tempted to use for documentation or consultation. These tools can offer real efficiencies, but they raise pressing questions. Does the tool transmit protected health information to a third party, and if so, is there a business associate agreement and adequate security? Could the tool introduce bias or error into clinical reasoning? Does the client understand and consent to the use of AI in their care? Who is accountable for the output, recognizing that the clinician remains professionally responsible regardless of what tool produced a note or recommendation? AI does not change the underlying obligations; it intensifies the need to apply them deliberately, because the convenience is seductive and the risks are not always visible on the surface.</p>`
        },
        {
          type: 'text',
          content: `<p>Because technology evolves faster than ethics codes can be revised, clinicians need more than a list of rules; they need a reliable method for reasoning through novel dilemmas. A structured digital-ethics decision-making framework provides that method. The framework does not replace professional judgment or consultation; it organizes them so that important considerations are not overlooked. The version offered here proceeds through a sequence of questions that can be applied to any technology decision, from adopting a new platform to responding to an unexpected client request.</p>
<p>The first step is to identify the decision and the stakeholders. What exactly is being decided, and who is affected? The client is always central, but other parties, such as the client's family, third-party vendors, and the broader public, may also be implicated. The second step is to gather the relevant standards. What do the ethics code, applicable laws, and regulations say? For technology, this means consulting ACA Section H, HIPAA, and relevant state law, and recognizing that the most protective standard governs. The third step is to assess the risks and benefits. What are the realistic benefits of the tool or action, and what are its risks to confidentiality, to the therapeutic relationship, and to client welfare? The fourth step is to consider whether competence is adequate. Does the clinician understand the tool well enough to use it safely, or is consultation or training needed first?</p>
<p>The fifth step is to examine informed consent and transparency. Does the client understand what is being proposed, and has the client freely agreed? Transparency is often the dividing line between an acceptable and an unacceptable use of technology; a practice that the clinician would be uncomfortable disclosing to the client is a practice that deserves scrutiny. The sixth step is to seek consultation when the answer is unclear. Technology dilemmas are frequently novel, and a trusted colleague, supervisor, or ethics resource can illuminate considerations the clinician has missed. The seventh step is to decide, act, and document. The clinician makes a reasoned choice, implements it, and records the rationale so that the deliberation is visible and defensible. The eighth and final step is to review the outcome and adjust. Because technology and circumstances change, a decision that was sound when made may need revisiting, and the clinician who builds in review treats ethics as an ongoing practice rather than a series of isolated verdicts.</p>
<p>Applied consistently, this framework turns the anxiety of new technology into a manageable process. A clinician confronted with an unfamiliar AI documentation tool, for example, would identify the decision and stakeholders, consult the relevant standards, weigh benefits against confidentiality risks, honestly assess competence, examine whether clients can be informed and consent, seek consultation about the tool's data handling, decide and document, and plan to review as the tool and its terms change. The same sequence works for a friend request from a former client, a request to communicate by an insecure channel, or a proposal to adopt a new cloud storage provider. The value of the framework is not that it dictates a single answer but that it ensures the right questions are asked before any answer is reached.</p>`
        },
        {
          type: 'text',
          content: `<p>The arrival of artificial intelligence in clinical settings deserves a closer look, because it is the area where existing ethics codes offer the least specific guidance and where the temptation to adopt tools quickly is strongest. AI tools now promise to draft progress notes from a session recording, to summarize a client's history, to suggest interventions, to triage incoming clients, and even to interact with clients directly through chatbots. Each of these applications can save time and reduce administrative burden, and the appeal is understandable for clinicians stretched thin by documentation demands. But each also raises questions that the convenience can obscure. The first and most pressing is what happens to client data. Many AI tools transmit the text or audio they process to remote servers, and some use that data to improve their models. If a tool sends a client's protected health information to a third party without a business associate agreement and adequate security, using it is a confidentiality problem regardless of how helpful the output is.</p>
<p>A second concern with AI is accuracy and bias. AI systems generate plausible-sounding output that can be subtly or seriously wrong. An AI-drafted note may misrepresent what occurred in a session; an AI summary may omit or distort clinically important details; an AI suggestion may reflect biases embedded in its training data, potentially disadvantaging clients from particular backgrounds. Because the output looks authoritative, a busy clinician may be tempted to accept it without careful review. The ethical safeguard is to treat AI output as a draft to be verified, never as a finished product to be trusted. The clinician remains the author of the clinical record and the source of clinical judgment, fully responsible for accuracy, regardless of what tool produced the first draft. AI can assist, but it cannot assume professional responsibility, and a clinician who lets it do so has abdicated a core duty.</p>
<p>A third concern is transparency and consent. Clients have a legitimate interest in knowing whether AI is involved in their care, particularly if a tool processes recordings of their sessions or interacts with them directly. A client who believes they are speaking confidentially with their clinician may feel differently if they learn that an AI system recorded and analyzed the conversation. Honesty about the use of AI is an extension of the informed-consent obligation: clients should understand, at a level appropriate to the situation, how technology is being used in their care and should have the opportunity to consent or object. A useful test is whether the clinician would be comfortable disclosing the AI use to the client. If the honest answer is no, that discomfort is a signal that the practice deserves reconsideration rather than quiet continuation.</p>
<p>None of this means AI has no legitimate place in clinical practice. Used thoughtfully, with attention to data handling, accuracy, and transparency, some AI tools may genuinely help clinicians serve clients better. The point is that AI does not introduce new ethical principles; it intensifies the application of existing ones. Confidentiality, competence, informed consent, and professional responsibility all apply with full force, and the novelty of the technology is no excuse for relaxing them. The clinician who runs each prospective AI use through the decision framework, asking the same disciplined questions they would ask of any tool, is well positioned to capture the benefits without compromising the client. As AI capabilities expand, this disciplined posture will only become more important, not less.</p>`
        },
        {
          type: 'text',
          content: `<p>Recordkeeping in the digital age extends beyond cloud storage to the entire lifecycle of a clinical record, from creation through retention to eventual destruction. The lifecycle begins when a record is created, and even at creation, technology choices matter: a note typed into a secure electronic health record is handled differently from one dictated into a consumer voice app or jotted into a personal notes application that syncs to multiple devices. The clinician should ensure that records are created within systems designed to protect them, rather than in convenient but unprotected tools that quietly copy sensitive information to places the clinician does not control. The convenience of capturing a quick note in whatever app is open can scatter protected information across a clinician's digital life in ways that are difficult to track and secure.</p>
<p>Retention is governed by a combination of law, regulation, and the ethics code, and the required period varies by jurisdiction and by the type of record and client. Clinicians must know the retention requirements that apply to their practice and must keep records securely for the full required period. Digital storage makes long retention easy, but it also means that more sensitive information accumulates over time, increasing the stakes of any breach. The clinician should therefore retain what is required, store it securely, and avoid hoarding information beyond what is necessary and required. Thoughtful retention is a balance between meeting obligations and not creating an ever-growing pool of risk.</p>
<p>Destruction is the often-neglected final stage. When the retention period ends, records should be disposed of securely so that the information cannot be recovered. For paper, this means shredding; for digital records, it means secure deletion that actually removes the data rather than merely hiding it, and it requires attention to backups and synced copies that may persist after the primary record is deleted. A clinician who deletes a file from a laptop but leaves copies in a cloud backup or on an old device has not actually destroyed the record. Planning for secure destruction, and understanding where all copies of a record live, is part of responsible digital recordkeeping. The same sync features that make records convenient to access also make them difficult to fully delete, and the clinician must account for this.</p>
<p>One more dimension of digital recordkeeping deserves mention: continuity planning. Clients' records must remain protected and accessible even if something happens to the clinician or the practice. What happens to a solo practitioner's electronic records if the clinician becomes incapacitated, closes the practice, or dies? Clients have a right to expect that their records will be handled appropriately under such circumstances, and ethical practice includes a plan, sometimes called a professional will or a custodian arrangement, for who will take responsibility for records and how clients will be served. In a digital practice, this plan must address access credentials, vendor relationships, and the secure handling of electronic records. Thinking through continuity is part of the fidelity owed to clients, ensuring that the promise of confidentiality and continuity outlasts any single circumstance and that clients are not left stranded by an event the clinician could have anticipated.</p>`
        },
        {
          type: 'videoEmbed',
          title: "Applying a Digital-Ethics Decision Framework",
          videoUrl: "https://www.youtube.com/embed/PLACEHOLDER_decisionframework",
          description: "A walkthrough of the structured decision-making framework, illustrating how its sequence of questions applies to emerging tools such as AI and to everyday digital-boundary dilemmas.",
          accessibility: { ariaLabel: "Video walkthrough of the digital-ethics decision-making framework", role: 'complementary' }
        },
        {
          type: 'imageText',
          content: `<p>The decision framework is best visualized as a loop rather than a straight line. The clinician moves from identifying the decision, through gathering standards, weighing risks and benefits, assessing competence, examining consent, seeking consultation, and deciding and documenting, and then returns to review the outcome and adjust. The loop reflects the reality that technology and client circumstances keep changing, so even a well-reasoned decision must be revisited. Picturing the process as a cycle reinforces the habit of treating digital ethics as continuous rather than a one-time judgment.</p>`,
          image: "",
          imageAlt: "Circular diagram showing the eight steps of the digital-ethics decision-making framework arranged as a continuous loop that returns to outcome review",
          imagePosition: 'left'
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: "How should I handle a friend request from a client?",
              content: `<p>The most reliable approach is a written social media policy, shared at the outset, that states you will not accept friend or connection requests from clients on personal platforms and that you maintain a professional presence separate from personal accounts. ACA Section H.6 supports maintaining distinct professional and personal presences. A boundary stated clearly in advance is far easier to uphold than one improvised after a request arrives.</p>`
            },
            {
              title: "Can I text or email my clients?",
              content: `<p>You can, but standard texting and email are generally not secure for protected health information. A defensible approach is to permit these channels for administrative purposes such as scheduling while directing substantive clinical content to a secure platform or to sessions. Your policy should specify approved channels, purposes, response-time expectations, emergency instructions, and security measures, and it should be reviewed as part of informed consent.</p>`
            },
            {
              title: "Is cloud storage acceptable for client records?",
              content: `<p>Yes, when it meets regulatory standards. The service should sign a business associate agreement, encrypt data at rest and in transit, control access with strong authentication, and handle backups, retention, and deletion appropriately. Know exactly where your records reside, because sync features can quietly expand the number of locations holding protected information, and retain and dispose of records according to applicable law and the ethics code.</p>`
            },
            {
              title: "What should I ask before using an AI tool in my practice?",
              content: `<p>Ask whether the tool transmits protected health information to a third party and, if so, whether there is a business associate agreement and adequate security; whether the tool could introduce bias or error; whether the client understands and consents to its use; and who is accountable for the output. You remain professionally responsible regardless of what tool produced a note or recommendation, so AI intensifies rather than reduces your obligations.</p>`
            },
            {
              title: "What are the steps of the digital-ethics decision framework?",
              content: `<p>Identify the decision and stakeholders; gather the relevant standards; assess risks and benefits; evaluate competence; examine informed consent and transparency; seek consultation when unclear; decide, act, and document; and review the outcome and adjust. The framework organizes professional judgment so that important considerations are not overlooked, and its closing review step keeps digital ethics a continuous practice.</p>`
            }
          ]
        },
        {
          type: 'callout',
          title: "When the Tool Is New, the Risks May Be Hidden",
          calloutType: 'warning',
          content: `<p>Emerging tools, especially AI systems, can transmit protected health information to third parties, introduce bias, or obscure who is accountable for clinical output. The convenience is visible; the risks often are not. Run any new tool through the decision framework before adopting it, and never assume that a popular or polished product is therefore safe for clinical use.</p>`
        },
        {
          type: 'cardSort',
          instructions: "Sort each electronic communication into the channel that best protects client confidentiality: an insecure channel suitable only for administrative logistics, or a secure channel appropriate for clinical content.",
          categories: ["Insecure - administrative only", "Secure - clinical content allowed"],
          items: [
            { text: "Standard text message confirming an appointment time", category: "Insecure - administrative only" },
            { text: "Detailed clinical update sent through an encrypted client portal", category: "Secure - clinical content allowed" },
            { text: "Standard unencrypted email asking the client to reschedule", category: "Insecure - administrative only" },
            { text: "Session conducted on a HIPAA-compliant video platform with a business associate agreement", category: "Secure - clinical content allowed" },
            { text: "Substantive treatment discussion typed into a regular SMS thread", category: "Insecure - administrative only" },
            { text: "Message exchanged through a secure messaging feature inside the electronic health record", category: "Secure - clinical content allowed" }
          ],
          accessibility: { ariaLabel: "Card sort categorizing electronic communications as secure or insecure channels", role: 'application' }
        },
        {
          type: 'sequencing',
          instructions: "Arrange the steps of the digital-ethics decision-making framework in the correct order.",
          steps: [
            { text: "Identify the decision and the stakeholders affected by it.", order: 1 },
            { text: "Gather the relevant ethics standards, laws, and regulations, defaulting to the most protective.", order: 2 },
            { text: "Assess the realistic risks and benefits to confidentiality and client welfare.", order: 3 },
            { text: "Evaluate whether your competence with the tool is adequate or whether training is needed.", order: 4 },
            { text: "Examine informed consent and transparency with the client.", order: 5 },
            { text: "Seek consultation when the answer is unclear.", order: 6 },
            { text: "Decide, act, and document the rationale.", order: 7 },
            { text: "Review the outcome and adjust as circumstances change.", order: 8 }
          ],
          explanation: "The framework moves from identifying the decision and stakeholders, through gathering standards, weighing risks and benefits, assessing competence, examining consent, and seeking consultation, to deciding and documenting, and finally to reviewing and adjusting. The closing review step makes the process a continuous loop rather than a one-time judgment."
        },
        {
          type: 'multipleChoice',
          question: "A clinician wants to use a popular general-purpose AI tool to draft clinical notes. According to the decision framework and the principles in this section, what is the most important question to resolve first?",
          options: [
            { text: "Whether the tool is widely used by other clinicians", isCorrect: false },
            { text: "Whether the tool transmits protected health information to a third party without a business associate agreement and adequate security", isCorrect: true },
            { text: "Whether the tool produces grammatically polished notes", isCorrect: false },
            { text: "Whether the tool is free or low cost", isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: "Popularity, polish, and cost do not establish that a tool is safe for clinical use. The threshold question is whether the tool transmits protected health information to a third party and, if so, whether there is a business associate agreement and adequate security. The clinician remains professionally responsible for the output regardless of the tool used."
        },
        {
          type: 'multiSelect',
          question: "Which practices help maintain appropriate digital boundaries with clients? (Select all that apply.)",
          options: [
            { text: "Maintaining a professional presence separate from personal social media accounts", isCorrect: true },
            { text: "Declining friend or connection requests from clients on personal platforms", isCorrect: true },
            { text: "Searching a client's social media routinely out of curiosity", isCorrect: false },
            { text: "Establishing a written communication policy specifying approved channels and their purposes", isCorrect: true },
            { text: "Directing substantive clinical content to secure channels rather than standard text or email", isCorrect: true }
          ],
          explanation: "Appropriate digital boundaries involve separating professional and personal presences, declining personal friend requests, establishing clear communication policies, and reserving secure channels for clinical content. Routinely searching a client online without a clinical rationale and the client's awareness undermines trust and is not an appropriate practice."
        },
        {
          type: 'text',
          content: `<p>As this course draws toward its close, it is worth synthesizing the threads into a coherent picture of the ethically technology-literate clinician. Such a clinician does not treat technology as a separate domain governed by separate rules, but as one more arena in which the enduring obligations of the profession apply. When this clinician considers a new tool, the questions that arise are familiar ones, simply applied to a new object: Does this protect confidentiality? Does the client understand and consent? Am I competent to use it? Does it serve the client's welfare? What does the most protective applicable standard require? The technology may be novel, but the moral questions are old, and the clinician who keeps that in view is not disoriented by each new product but equipped to evaluate it.</p>
<p>The practical habits that flow from this stance are unglamorous and powerful. Confirming a client's location at the start of each session. Insisting on a business associate agreement before entrusting a vendor with client information. Reserving insecure channels for logistics and routing clinical content through secure ones. Keeping professional and personal digital presences separate and declining to search clients online without a clinical reason. Documenting consent conversations and jurisdictional determinations. Treating AI output as a draft to be verified rather than a product to be trusted. Reviewing technology decisions as conditions change. None of these habits is heroic, and that is precisely their virtue: they protect clients reliably, through consistent practice, rather than through occasional bursts of caution that fade between crises.</p>
<p>It is also important to hold realistic expectations. No clinician can eliminate every risk, master every tool, or anticipate every dilemma that emerging technology will pose. The goal is not perfection but a defensible, deliberate process. A clinician who has thought carefully, consulted when uncertain, chosen the most protective reasonable option, and documented the reasoning has met the profession's expectations even if a tool later proves to have a flaw that no one foresaw. Conversely, a clinician who adopted a tool carelessly, without examining its data handling or confirming its suitability, has fallen short even if no harm ever results. Ethics is judged by the quality of the process as much as by the outcome, and a sound process is within every clinician's reach regardless of technical sophistication.</p>
<p>Finally, the disposition that ties everything together is a willingness to keep learning. Technology will continue to change, sometimes dramatically, and the specific tools discussed in this course will be supplemented and eventually replaced by others. What will not change is the underlying framework: the principles, the layered regulatory structure, the standard of competence, and the disciplined habit of asking the right questions before adopting any tool. The clinician who carries this framework forward, applying it with curiosity rather than fear and revisiting it as the landscape shifts, will be prepared not only for the tools of today but for those not yet imagined. That preparedness, grounded in unchanging ethical commitments and expressed through evolving practical habits, is the enduring goal of ethical technology use in clinical practice.</p>`
        },
        {
          type: 'reflection',
          prompt: "Think of a recent or anticipated technology decision in your practice, such as adopting a new tool or responding to a client's request to communicate in a particular way. Walk it through the eight-step decision framework. At which step did you gain the most clarity, and what would you do differently as a result?"
        },
        {
          type: 'resources',
          title: "Authoritative Resources for Technology Ethics in Practice",
          resources: [
            { name: "American Counseling Association (ACA)", description: "Home of the ACA Code of Ethics, including Section H on Distance Counseling, Technology, and Social Media, plus practice and ethics resources.", url: "https://www.counseling.org" },
            { name: "American Psychological Association (APA)", description: "Guidance and resources on telepsychology, technology, and professional ethics applicable to behavioral health practice.", url: "https://www.apa.org" },
            { name: "U.S. Department of Health and Human Services - HIPAA", description: "Official HIPAA Privacy, Security, and Breach Notification Rule guidance, including business associate requirements.", url: "https://www.hhs.gov/hipaa" },
            { name: "Substance Abuse and Mental Health Services Administration (SAMHSA)", description: "Federal resources on behavioral health, including telehealth practice and the confidentiality of substance use records.", url: "https://www.samhsa.gov" },
            { name: "National Institute of Mental Health (NIMH)", description: "Authoritative information on mental health conditions, treatment, and research relevant to clinical practice.", url: "https://www.nimh.nih.gov" },
            { name: "HHS Telehealth Resource", description: "Federal guidance on delivering telehealth safely and lawfully, including privacy and best-practice considerations.", url: "https://telehealth.hhs.gov" },
            { name: "HealthIT.gov", description: "Federal resources on health information technology, security, and the protection of electronic health information.", url: "https://www.healthit.gov" }
          ],
          accessibility: { ariaLabel: "List of authoritative resources for technology ethics in clinical practice", role: 'complementary' }
        },
        {
          type: 'keyTakeaway',
          title: "Key Takeaways",
          takeaways: [
            "Social media requires separate professional and personal presences, a written policy shared with clients, and restraint about searching clients online without a clinical rationale.",
            "Standard texting and email are generally insecure; reserve them for administrative logistics and route clinical content through secure channels.",
            "Cloud storage is acceptable only when it meets regulatory standards, including a business associate agreement, encryption, access controls, and sound retention practices.",
            "Emerging AI tools intensify rather than reduce ethical obligations; the clinician remains responsible for output regardless of the tool used.",
            "A structured eight-step decision framework lets clinicians reason through novel technology dilemmas that no code has yet addressed."
          ]
        }
      ]
    }
  ],
  assessment: {
    title: "Final Assessment — CR-ETH-502: Technology Ethics",
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: "Which section of the ACA Code of Ethics most directly governs distance counseling, technology, and social media?",
        options: [
          { text: "Section A", isCorrect: false },
          { text: "Section H", isCorrect: true },
          { text: "Section C", isCorrect: false },
          { text: "Section E", isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: "Section H of the ACA Code of Ethics is specifically devoted to Distance Counseling, Technology, and Social Media and should be a clinician's first reference for technology questions."
      },
      {
        type: 'multipleChoice',
        question: "When a clinician uses a third-party video platform that handles protected health information, HIPAA generally requires which of the following?",
        options: [
          { text: "A signed business associate agreement with the vendor", isCorrect: true },
          { text: "Nothing additional if the platform is popular", isCorrect: false },
          { text: "A verbal assurance from the vendor", isCorrect: false },
          { text: "Approval from the client's insurance company", isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: "A vendor that creates, receives, maintains, or transmits protected health information is a business associate, and HIPAA requires a written business associate agreement obligating the vendor to safeguard the information."
      },
      {
        type: 'multipleChoice',
        question: "In general, where must a clinician be licensed to lawfully provide telehealth services?",
        options: [
          { text: "Only in the state where the clinician is physically located", isCorrect: false },
          { text: "In the state where the client is physically located at the time of service", isCorrect: true },
          { text: "In any state, as long as the clinician holds one valid license", isCorrect: false },
          { text: "Only in the state where the clinician was originally trained", isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: "Because states regulate the practice of counseling within their borders, the clinician generally must be licensed where the client is physically located at the time of service."
      },
      {
        type: 'multipleChoice',
        question: "Why is confirming the client's physical location at the start of every telehealth session important?",
        options: [
          { text: "It determines emergency response and which jurisdiction's laws apply", isCorrect: true },
          { text: "It is only a billing formality with no clinical relevance", isCorrect: false },
          { text: "It is required only for the first session", isCorrect: false },
          { text: "It is necessary only when the client mentions traveling", isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: "Confirming location lets the clinician direct emergency services in a crisis and establishes which jurisdiction's laws apply and whether the clinician is authorized to practice there."
      },
      {
        type: 'multipleChoice',
        question: "Encryption protects information in which two states?",
        options: [
          { text: "Data in transit and data at rest", isCorrect: true },
          { text: "Data in print and data on screen", isCorrect: false },
          { text: "Data in summary and data in full", isCorrect: false },
          { text: "Data in transit and data on paper", isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: "Encryption applies both to data in transit, such as a video session crossing the internet, and to data at rest, such as records stored on a device or in the cloud."
      },
      {
        type: 'multiSelect',
        question: "Which of the following belong in a telehealth informed-consent process? (Select all that apply.)",
        options: [
          { text: "The benefits and limitations of remote care", isCorrect: true },
          { text: "A fallback plan if the technology fails mid-session", isCorrect: true },
          { text: "Emergency procedures, including reaching services in the client's location", isCorrect: true },
          { text: "A promise that no technical disruption will ever occur", isCorrect: false },
          { text: "The importance of confirming the client's physical location", isCorrect: true }
        ],
        explanation: "Telehealth consent should address the benefits and limitations of remote care, a technology-failure fallback, emergency procedures, and location confirmation. No clinician can promise that disruptions will never occur."
      },
      {
        type: 'multipleChoice',
        question: "Which standard should a clinician follow when HIPAA, state law, and the ethics code differ on a technology question?",
        options: [
          { text: "Whichever standard is easiest to implement", isCorrect: false },
          { text: "Only the federal HIPAA standard", isCorrect: false },
          { text: "The most protective applicable standard", isCorrect: true },
          { text: "Only the state standard", isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: "A clinician must satisfy all applicable rules and should default to the most protective standard, since meeting a legal minimum does not necessarily satisfy the higher bar of the profession's ethics code."
      },
      {
        type: 'multipleChoice',
        question: "Regarding searching for a client's information online, the disciplined default is to:",
        options: [
          { text: "Search routinely to stay informed about all clients", isCorrect: false },
          { text: "Search only social media but not other sites", isCorrect: false },
          { text: "Refrain from searching absent a clinical rationale and transparency", isCorrect: true },
          { text: "Search whenever curious about the client's life", isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: "The disciplined default is to refrain from searching, to be transparent if a search is clinically warranted, and to document the rationale. Routine curiosity is not a legitimate reason."
      },
      {
        type: 'multipleChoice',
        question: "A defensible approach to texting and email with clients is to:",
        options: [
          { text: "Use them freely for any clinical discussion", isCorrect: false },
          { text: "Prohibit all electronic communication entirely", isCorrect: false },
          { text: "Allow clinical content by email but not by text", isCorrect: false },
          { text: "Permit them for administrative logistics and route clinical content to secure channels", isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: "Standard texting and email are generally insecure, so a defensible policy permits them for administrative purposes such as scheduling while directing substantive clinical content to secure platforms or sessions."
      },
      {
        type: 'multipleChoice',
        question: "Before using a new AI tool to draft clinical notes, the most important threshold question is whether:",
        options: [
          { text: "The tool transmits protected health information to a third party without adequate safeguards", isCorrect: true },
          { text: "The tool is popular among colleagues", isCorrect: false },
          { text: "The tool produces polished writing", isCorrect: false },
          { text: "The tool is inexpensive", isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: "Popularity, polish, and cost do not make a tool safe. The threshold question is whether it transmits protected health information to a third party and, if so, whether there is a business associate agreement and adequate security."
      },
      {
        type: 'multiSelect',
        question: "Which practices support appropriate digital boundaries on social media? (Select all that apply.)",
        options: [
          { text: "Maintaining separate professional and personal presences", isCorrect: true },
          { text: "Declining personal friend requests from clients", isCorrect: true },
          { text: "Stating social media expectations in informed consent", isCorrect: true },
          { text: "Searching every new client online before the first session", isCorrect: false },
          { text: "Being mindful of one's own professional digital footprint", isCorrect: true }
        ],
        explanation: "Separating professional and personal presences, declining personal friend requests, clarifying expectations in consent, and minding one's digital footprint all support healthy boundaries. Routinely searching clients online without a clinical rationale does not."
      },
      {
        type: 'multipleChoice',
        question: "Which of the following best describes the requirement of technological competence under ACA Section H.1?",
        options: [
          { text: "Clinicians must become certified information technology professionals", isCorrect: false },
          { text: "Competence transfers automatically from in-person to remote practice", isCorrect: false },
          { text: "Clinicians must develop knowledge and skills regarding the specific technologies they use", isCorrect: true },
          { text: "Competence is established once and never needs updating", isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: "Section H.1 requires counselors to develop knowledge and skills regarding the specific technologies they use. Competence does not transfer automatically and must be maintained as tools change."
      },
      {
        type: 'multipleChoice',
        question: "Which is the correct first step of the digital-ethics decision-making framework?",
        options: [
          { text: "Decide and document immediately", isCorrect: false },
          { text: "Identify the decision and the stakeholders", isCorrect: true },
          { text: "Seek consultation before defining the problem", isCorrect: false },
          { text: "Review the outcome before acting", isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: "The framework begins by identifying the decision and the stakeholders affected, so that subsequent steps address the right problem and the right parties."
      },
      {
        type: 'multipleChoice',
        question: "Cloud storage of client records is acceptable when which condition is met?",
        options: [
          { text: "The service is free of charge", isCorrect: false },
          { text: "The service is the most popular consumer option", isCorrect: false },
          { text: "The service meets regulatory standards, including a business associate agreement and encryption", isCorrect: true },
          { text: "The clinician backs up records to a personal device as well", isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: "Cloud storage is acceptable only when the service meets regulatory standards, including willingness to sign a business associate agreement, encryption at rest and in transit, access controls, and sound retention practices."
      },
      {
        type: 'multipleChoice',
        question: "Interstate compacts for licensure primarily serve to:",
        options: [
          { text: "Grant blanket permission to practice in any state", isCorrect: false },
          { text: "Eliminate the need to track client location", isCorrect: false },
          { text: "Replace state licensing boards entirely", isCorrect: false },
          { text: "Facilitate multi-state practice among participating states under defined conditions", isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: "Compacts facilitate practice across participating states under defined conditions. They do not grant universal permission and do not remove the need to track each client's location and verify authority to practice."
      },
      {
        type: 'multipleChoice',
        question: "HIPAA's Breach Notification Rule requires that, when unsecured protected health information is compromised, a clinician:",
        options: [
          { text: "Take no action unless the client complains", isCorrect: false },
          { text: "Wait one year before notifying anyone", isCorrect: false },
          { text: "Provide time-sensitive notification to affected individuals", isCorrect: true },
          { text: "Notify only the vendor responsible", isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: "The Breach Notification Rule requires time-sensitive notification of affected individuals, and in some cases the Department of Health and Human Services and the media, when unsecured protected health information is compromised."
      },
      {
        type: 'multiSelect',
        question: "Which questions should a clinician ask when evaluating any new technology tool? (Select all that apply.)",
        options: [
          { text: "Does it protect client confidentiality and meet applicable security standards?", isCorrect: true },
          { text: "Do I have the competence to use it safely, or do I need training first?", isCorrect: true },
          { text: "Can clients be informed and give meaningful consent to its use?", isCorrect: true },
          { text: "Is it the most fashionable option available?", isCorrect: false },
          { text: "Who is accountable for the output or outcome it produces?", isCorrect: true }
        ],
        explanation: "Evaluating a tool means asking about confidentiality and security, the clinician's competence, client consent, and accountability for outcomes. Fashionability is not a relevant ethical criterion."
      },
      {
        type: 'multipleChoice',
        question: "Why should informed consent for telehealth be treated as a living agreement?",
        options: [
          { text: "Because forms expire automatically every month", isCorrect: false },
          { text: "Because a client's circumstances, such as location or symptoms, can change in ways that affect appropriateness or legality", isCorrect: true },
          { text: "Because the law forbids any permanent agreement", isCorrect: false },
          { text: "Because clients cannot remember the first conversation", isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: "Changes in a client's symptoms, living situation, or location can alter whether continuing remote care is appropriate or even lawful, so consent should be revisited rather than filed away after the first session."
      },
      {
        type: 'multipleChoice',
        question: "A client logs on for a telehealth session from a state where the clinician is not licensed. The most appropriate response is to:",
        options: [
          { text: "Proceed because the client is already established", isCorrect: false },
          { text: "Continue and address the issue at the next session", isCorrect: false },
          { text: "Ignore location because telehealth crosses borders freely", isCorrect: false },
          { text: "Confirm the location and pause clinical services until authority to practice is determined", isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: "When a client is in a state where the clinician is not licensed, the lawful and ethical step is to confirm location, recognize the jurisdictional limit, and determine authority before continuing, rather than proceeding as though location did not matter."
      }
    ]
  },
  references: [
    { citation: "American Counseling Association. (2014). ACA code of ethics. American Counseling Association.", url: "https://www.counseling.org/resources/aca-code-of-ethics.pdf" },
    { citation: "American Counseling Association. (n.d.). Ethics and professional standards. American Counseling Association.", url: "https://www.counseling.org" },
    { citation: "American Psychological Association. (2013). Guidelines for the practice of telepsychology. American Psychologist.", url: "https://www.apa.org/practice/guidelines/telepsychology" },
    { citation: "American Psychological Association. (2017). Ethical principles of psychologists and code of conduct. American Psychological Association.", url: "https://www.apa.org/ethics/code" },
    { citation: "U.S. Department of Health and Human Services. (n.d.). HIPAA for professionals. HHS.gov.", url: "https://www.hhs.gov/hipaa/for-professionals" },
    { citation: "U.S. Department of Health and Human Services. (n.d.). The HIPAA Security Rule. HHS.gov.", url: "https://www.hhs.gov/hipaa/for-professionals/security" },
    { citation: "U.S. Department of Health and Human Services. (n.d.). Breach notification rule. HHS.gov.", url: "https://www.hhs.gov/hipaa/for-professionals/breach-notification" },
    { citation: "U.S. Department of Health and Human Services. (n.d.). Business associates. HHS.gov.", url: "https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates" },
    { citation: "U.S. Department of Health and Human Services. (n.d.). Telehealth best practice guide. Telehealth.HHS.gov.", url: "https://telehealth.hhs.gov/providers/best-practice-guides" },
    { citation: "Substance Abuse and Mental Health Services Administration. (n.d.). Telehealth for the treatment of behavioral health conditions. SAMHSA.", url: "https://www.samhsa.gov" },
    { citation: "Substance Abuse and Mental Health Services Administration. (n.d.). Confidentiality regulations (42 CFR Part 2). SAMHSA.", url: "https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs" },
    { citation: "National Institute of Mental Health. (n.d.). Mental health information. NIMH.", url: "https://www.nimh.nih.gov/health" },
    { citation: "National Institute of Mental Health. (n.d.). Technology and the future of mental health treatment. NIMH.", url: "https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment" },
    { citation: "Office of the National Coordinator for Health Information Technology. (n.d.). Privacy and security resources. HealthIT.gov.", url: "https://www.healthit.gov/topic/privacy-security-and-hipaa" },
    { citation: "American Counseling Association. (n.d.). Distance counseling, technology, and social media resources. American Counseling Association.", url: "https://www.counseling.org" },
    { citation: "U.S. Department of Health and Human Services. (n.d.). Summary of the HIPAA Privacy Rule. HHS.gov.", url: "https://www.hhs.gov/hipaa/for-professionals/privacy" },
    { citation: "American Psychological Association. (n.d.). Telehealth resources for practitioners. American Psychological Association.", url: "https://www.apa.org/practice/programs/dmhi/research-information/telehealth" }
  ]
};

function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.cards||b.flashcards)(b.cards||b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front).split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back).split(/\s+/).filter(Boolean).length;});
  if(b.nodes)b.nodes.forEach(n=>{t+=stripHTML(n.text).split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text).split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.blanks)b.blanks.forEach(bl=>{t+=stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;t+=stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;});
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.name||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
}return t;}
function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words');
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(t.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:activity`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push('CRITICAL:flat_options');}
if((c.assessment?.questions?.length||0)<15)e.push('CRITICAL:exam<15');
if((c.references?.length||0)<15)e.push('CRITICAL:refs<15');return{wc,e};}
async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode}|${wc}w/${COURSE.ceHours*6000}req|${COURSE.sections.length}sec|${COURSE.assessment?.questions?.length}exam|${COURSE.references?.length}refs`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('⚠️',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated');}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted');}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
