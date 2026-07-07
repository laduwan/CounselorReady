/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// CR-TMH603-FL-Telehealth-18000words.js
// Seed script for CounselorReady interactivecourses collection.
// ADDITIVE ONLY — derived from CR-TMH601 (server/src/scripts/seedCR-TMH601-Batch1-Sections1to4.js
// and seedCR-TMH601-Batch2to4-Sections5to13.js), which hold TMH601's real learner-visible prose.
// Does NOT modify CR-TMH601, its slug, or its templates.
// Deploy: node server/src/scripts/CR-TMH603-FL-Telehealth-18000words.js
// Requires: MONGODB_URI environment variable
//
// ─────────────────────────────────────────────────────────────────────────────
// REGULATORY VERIFICATION STATUS (read before publishing)
// Primary-source verification (leg.state.fl.us, flsenate.gov, flrules.org) was
// blocked by this environment's egress policy. The citations below are
// corroborated via secondary search results (Florida Senate statute mirrors,
// Florida Board of Clinical Social Work/MFT/MHC telehealth page summaries,
// aggregator CE sites) but were NOT read directly from the primary source.
// Human legal/compliance review against the live Florida Statutes and F.A.C.
// is REQUIRED before publish.
//   - FL Statute §456.47 (Use of Telehealth to Provide Services): telehealth
//     excludes audio-only telephone calls, email, and fax; standard of care
//     equals in-person care; out-of-state providers may register with the
//     applicable board absent pending discipline or revocation. Corroborated
//     via Florida Senate statute-text search results.
//   - F.A.C. 64B4-6.001(2)(b): 30 CE hours per renewal; 3 hours on professional
//     ethics/boundary issues OR telehealth, alternating — the same course
//     subject may not repeat in consecutive renewal periods. Corroborated via
//     secondary CE-provider summaries; [VERIFY subsection letter against the
//     live F.A.C. text at flrules.org].
//   - F.A.C. 64B4-2.002: registered interns may provide telehealth psychotherapy
//     under a written telehealth protocol/safety plan with their qualified
//     supervisor (who must be readily available during the session), where
//     both determine electronic delivery is not detrimental to the patient.
//     Corroborated via the Florida Board of Clinical Social Work, Marriage &
//     Family Therapy and Mental Health Counseling's own telehealth page.
//   - "Public-facing platform" caution: this is FEDERAL HIPAA/OCR guidance
//     (2020 COVID-era enforcement discretion, expired May 11, 2023), NOT a
//     distinct Florida board rule. This course presents it as a general HIPAA
//     principle rather than fabricating an FL-specific rule citation — the
//     build prompt's characterization of this as "distinctive FL" appears to
//     be a misconception; flag for Ke's awareness.
// ─────────────────────────────────────────────────────────────────────────────
//
// SECTION BANNER KEYWORDS (Pexels) — for the course-builder's banner button.
// bannerImage is intentionally left unset below; a human uses the builder's
// Pexels banner button with these keywords after import.
//   Section 1: "telehealth video counseling"
//   Section 2: "data security laptop lock"
//   Section 3: "consent form signature"
//   Section 4: "therapist taking notes video call"
//   Section 5: "florida state map"

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ No MONGODB_URI environment variable set");
  process.exit(1);
}

// ═══ SECTION 1: Foundations of Telehealth Practice ═══
const SECTION_1 = {
  title: "Foundations of Telehealth Practice",
  order: 1,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 1,
      title: "Section 1",
      subtitle: "Foundations of Telehealth Practice",
      bannerAlt: "Clinician conducting a telehealth video counseling session with client visible on screen",
    },
    {
      type: "text",
      content: `<h2>The Historical Arc of Distance-Based Mental Health Services</h2>
<p>The delivery of mental health services through electronic communication technologies represents one of the most significant paradigm shifts in the history of the counseling profession. While many clinicians associate telehealth with the rapid adoption forced by the COVID-19 pandemic beginning in March 2020, the conceptual and practical foundations of distance-based therapeutic intervention extend back more than six decades, rooted in early experiments with telecommunications technology that preceded the internet by several generations.</p>
<p>The first documented use of telecommunication technology for psychiatric consultation occurred in 1959 at the Nebraska Psychiatric Institute, where clinicians utilized closed-circuit television to provide group therapy, long-term therapy, and consultation-liaison services to patients at Norfolk State Hospital, located approximately 112 miles away. This pioneering effort, led by Dr. Cecil Wittson, demonstrated that meaningful therapeutic interactions could occur through a video medium, challenging the prevailing assumption that physical co-presence was an absolute prerequisite for effective mental health treatment. The Nebraska project continued for over a decade, producing some of the earliest empirical data on the feasibility and acceptability of technology-mediated psychiatric services (Wittson et al., 1961).</p>
<p>Throughout the 1960s and 1970s, additional pilot programs emerged, most notably at Massachusetts General Hospital, where Dr. Thomas Dwyer and colleagues established a microwave-based television link between the hospital and a medical station at Boston Logan International Airport. This system, operational from 1968 through the mid-1970s, provided psychiatric consultations to travelers and airport employees, demonstrating the practical utility of telemedicine in addressing mental health needs in nontraditional settings (Dwyer, 1973). These early programs established several foundational principles that continue to guide telehealth practice today: the importance of technology reliability, the need for clinician training in the medium, and the recognition that therapeutic rapport can develop through electronic communication.</p>
<p>The emergence of the internet in the 1990s catalyzed a transformation in the possibilities for distance-based mental health services. Email-based therapeutic exchanges, online support groups, and eventually text-based chat counseling expanded the modalities through which clinicians could reach clients. However, bandwidth limitations and the absence of affordable videoconferencing technology constrained the growth of synchronous video-based teletherapy throughout this period. It was not until the widespread availability of broadband internet access in the 2000s, combined with the development of consumer-grade videoconferencing platforms, that synchronous video-based telehealth became a practical reality for independent practitioners and community mental health agencies.</p>
<h2>Defining Telehealth: Terminology and Scope</h2>
<p>The terminology surrounding technology-mediated mental health services has evolved considerably and remains a source of some confusion within the profession. Multiple terms circulate in professional literature, regulatory documents, and colloquial usage, often with overlapping but distinct meanings. Establishing definitional clarity is essential for Florida-licensed clinicians seeking to practice competently under the Florida Board of Clinical Social Work, Marriage and Family Therapy, and Mental Health Counseling's rules and Florida Statute §456.47.</p>
<p>Telemental health refers broadly to the delivery of mental health services using telecommunications technologies. This umbrella term encompasses a wide range of modalities including synchronous video-based therapy, telephone-based counseling, asynchronous text-based interventions, mobile health applications, and technology-assisted therapeutic tools. The American Counseling Association (ACA) adopted this terminology in its 2014 Code of Ethics and subsequent position statements, defining distance counseling as the provision of clinical mental health services through electronic means when counselor and client are in separate physical locations (ACA, 2014).</p>
<p>Florida Statute §456.47, the statutory backbone for telehealth practice by Florida-regulated health professionals, defines telehealth in a way that is narrower than the general clinical usage of the term: it specifically excludes audio-only telephone calls, email messages, and facsimile transmissions from the statutory definition of telehealth. This distinction matters considerably for Florida clinicians, discussed in depth in Section 3 of this course, because it means that a large share of the general "telemental health" literature — which routinely treats telephone counseling as a form of telehealth — describes a modality that Florida's own governing statute treats differently for regulatory purposes.</p>
<p>Teletherapy is often used interchangeably with telemental health but typically refers more specifically to the provision of psychotherapy through synchronous video or audio connections. Telemedicine is a broader medical term encompassing all healthcare services delivered through telecommunications, of which telemental health is a subspecialty. Telepsychology refers specifically to psychological services delivered via telecommunications, as defined by the American Psychological Association (APA, 2013). Telebehavioral health is another inclusive term used by organizations such as the Substance Abuse and Mental Health Services Administration (SAMHSA) to encompass mental health and substance use disorder treatment through technology.</p>
<p>For the purposes of this course, "telehealth" will serve as the primary term, encompassing all technology-mediated mental health services delivered by Florida-licensed clinical social workers, marriage and family therapists, mental health counselors, and related professionals under Chapter 491 of the Florida Statutes. When discussing specific modalities such as synchronous video sessions, telephone sessions, or asynchronous interventions, those terms will be specified explicitly, and the audio-only exclusion discussed above will be flagged wherever it materially changes the regulatory analysis.</p>
<blockquote><p><strong>Clinical Vignette:</strong> Dr. Ramirez, a Florida-licensed LMHC with 15 years of in-person practice experience, transitioned to telehealth during the COVID-19 pandemic. Despite her extensive clinical expertise, she initially struggled with managing therapeutic presence through a screen, navigating technology troubleshooting during sessions, and adapting her signature experiential interventions for virtual delivery. She was also surprised to learn, on reviewing Florida Statute §456.47 in detail, that the many phone-only check-ins she had been billing and documenting as "telehealth sessions" fell outside the statute's telehealth definition entirely, requiring her to re-examine how she documented and framed audio-only contact with clients going forward.</p></blockquote>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Synchronous Video-Based Therapy",
          content: `<p>The modality most closely approximating face-to-face counseling. Clients and clinicians connect through HIPAA-compliant videoconferencing platforms in real time, enabling visual and auditory communication. Supports observation of nonverbal cues, facial expressions, and environmental context, though with limitations related to camera angle, screen size, and bandwidth. This is the modality that squarely falls within Florida Statute §456.47's definition of telehealth.</p>`,
        },
        {
          title: "Telephone-Based Counseling",
          content: `<p>Therapeutic services through voice-only communication. Has a substantial evidence base and remains critical for clients who lack reliable internet, experience video-related anxiety, or present with conditions where video may be contraindicated. Crisis counseling has relied on telephone intervention for decades. IMPORTANT for Florida clinicians: audio-only telephone calls are explicitly EXCLUDED from the §456.47 statutory definition of telehealth — see Section 3 of this course.</p>`,
        },
        {
          title: "Asynchronous Text-Based Therapy",
          content: `<p>Therapeutic exchanges through secure messaging platforms where communication does not occur in real time. Clients compose messages; therapists respond within 24-48 hours. Offers unique advantages including reflective composition, a written therapeutic record clients can revisit, and scheduling flexibility. Florida's §456.47 telehealth definition includes store-and-forward/asynchronous technology, distinguishing it from the audio-only exclusion.</p>`,
        },
        {
          title: "Technology-Assisted Therapeutic Tools",
          content: `<p>Includes mobile applications, virtual reality environments, biofeedback devices, and other technologies that supplement therapeutic interventions. May be used within synchronous sessions or as between-session supports. Examples: mindfulness apps prescribed as homework, VR exposure therapy for anxiety, and home-based biofeedback devices for self-regulation skills.</p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>The Evidence Base for Telehealth Efficacy</h2>
<p>A robust and growing body of empirical research supports the clinical efficacy of telemental health across multiple treatment modalities, presenting concerns, and client populations. Understanding this evidence base is essential for clinicians seeking to practice with confidence in the virtual environment and to communicate the value of telehealth services to clients, payers, and regulatory bodies.</p>
<p>Meta-analytic research has consistently demonstrated equivalence between telemental health and in-person service delivery for a range of presenting concerns. Hilty et al. (2013) conducted a comprehensive review of over 150 studies and concluded that telemental health achieves comparable outcomes to face-to-face care across diverse populations and settings, with particularly strong evidence in the treatment of depression, anxiety disorders, and post-traumatic stress disorder. More recently, Batastini et al. (2021) published a meta-analysis of randomized controlled trials comparing video-based therapy to in-person therapy and found no significant differences in treatment outcomes, therapeutic alliance, or client satisfaction across studies.</p>
<p>Specific evidence-based treatments have been adapted and validated for telehealth delivery. Cognitive-behavioral therapy (CBT) has been studied extensively in the telehealth context, with multiple randomized controlled trials demonstrating equivalent or superior outcomes compared to in-person CBT for depression (Thase et al., 2020), anxiety disorders (Andrews et al., 2018), and insomnia (Luik et al., 2017). Exposure-based treatments, initially thought to be poorly suited to telehealth, have shown strong efficacy virtually, including prolonged exposure therapy for PTSD (Acierno et al., 2017) and exposure and response prevention for obsessive-compulsive disorder (Wootton, 2016). Dialectical behavior therapy (DBT) skills groups have been successfully conducted via telehealth, with preliminary evidence suggesting comparable skill acquisition and symptom reduction (Lakeman & Crighton, 2021) — the teaching component adapts well using screen-sharing, and diary cards can be maintained digitally. EMDR bilateral stimulation has been adapted through therapist-guided eye movements via video screen, client self-administered butterfly-hug tapping, and technology-assisted bilateral stimulation applications (Lenferink, Meyerbröker, & Boelen, 2020) — though a therapist physically guiding the client's eye movements requires in-person contact and does not transfer to telehealth. Beyond individual psychotherapy, telehealth has demonstrated effectiveness for psychiatric medication management, group therapy, couples and family therapy, substance use disorder treatment, and crisis intervention services.</p>
<h3>Competency Standards for Telehealth Practitioners</h3>
<p>As telehealth has matured from an emergency adaptation to a permanent component of mental health service delivery, professional organizations have increasingly articulated specific competency standards for clinicians who provide virtual services. These standards represent an evolving professional consensus about the knowledge, skills, and attitudes necessary for competent telehealth practice and provide a framework for both self-assessment and formal credentialing.</p>
<p>The Board-Certified TeleMental Health (BC-TMH) credential, developed by the Center for Credentialing and Education (CCE), a subsidiary of the National Board for Certified Counselors (NBCC), identifies nine core competency domains for telemental health practice: the legal, ethical, and regulatory framework of telemental health; evidence-based telehealth clinical practices; the technology of telemental health; dispositions and telepresence; cultural competence and diversity in telehealth; documentation and administrative procedures specific to telehealth; telepractice development; standards of telepractice; and research and trends in telemental health. Together, these nine domains define a comprehensive scope of knowledge that extends well beyond basic clinical competence to encompass the unique demands of technology-mediated practice.</p>
<p>The Telebehavioral Health Institute (TBHI) has developed a similar competency framework that organizes telehealth competencies into foundational knowledge areas and applied practice skills. The foundational areas include understanding the history and evidence base of telehealth, familiarity with relevant laws and regulations, and knowledge of technology requirements and options. Applied practice skills include conducting clinical assessments via telehealth, adapting therapeutic techniques for virtual delivery, managing crisis situations remotely, and maintaining professional boundaries in the digital environment. Both frameworks emphasize that telehealth competence is not a natural extension of in-person clinical competence but a distinct set of skills that requires specialized training and ongoing development — a principle reflected directly in Florida's own alternating ethics/telehealth continuing-education structure, discussed later in this course. Self-assessment tools such as the Telehealth Readiness Checklist developed by the Telehealth Certification Institute allow clinicians to evaluate their own competence across multiple domains and identify areas where additional training may be needed; these self-assessment instruments are not formal competency evaluations, but they can guide professional development planning and highlight gaps in knowledge or skill that might otherwise go unrecognized, particularly for clinicians who transitioned to telehealth rapidly during the pandemic without the benefit of structured training.</p>
<h2>The Neuroscience of Therapeutic Presence Through Screens</h2>
<p>Recent advances in interpersonal neuroscience have begun to illuminate the mechanisms through which therapeutic connection occurs and how these mechanisms operate in the telehealth environment. The concept of co-regulation, in which the nervous system of one individual influences and is influenced by the nervous system of another through interpersonal interaction, has significant implications for understanding the therapeutic process in both in-person and virtual settings. Porges's polyvagal theory posits that the human autonomic nervous system is organized into three hierarchical subsystems: the ventral vagal complex, which supports social engagement and connection; the sympathetic nervous system, which mobilizes fight-or-flight responses; and the dorsal vagal complex, which mediates immobilization and shutdown responses. In the therapeutic relationship, the clinician's calm, regulated nervous system state serves as a co-regulatory anchor that supports the client's capacity to access their own ventral vagal social engagement system.</p>
<p>The critical question for telehealth practice is whether these co-regulatory processes can operate effectively through a digital medium. Emerging research suggests that they can, though with some attenuation compared to in-person interaction. The auditory channel preserves prosodic information (vocal tone, rhythm, and inflection) that is central to ventral vagal activation. The visual channel preserves facial expression information, though with limitations related to camera angle, screen size, and potential latency. What is lost in the telehealth medium is the full-body somatic resonance that occurs when two nervous systems occupy the same physical space, including the subtle proprioceptive and kinesthetic information that influences interpersonal attunement. Clinicians can compensate for these limitations by attending intentionally to the co-regulatory dimensions of their virtual presence: monitoring and regulating their own autonomic state before and during sessions, using deliberate prosodic techniques such as warm vocal tone, measured pacing, and intentional pauses, positioning the camera to maximize facial expressivity and eye contact, and creating a visual environment that conveys warmth, safety, and professionalism. Mirror neuron research provides additional insight into the mechanisms of empathic connection in telehealth; research on mirror neuron activation in response to video-mediated stimuli suggests that mirror neuron systems respond to facial expressions and gestures observed through video, though the response may be somewhat attenuated compared to in-person observation, supporting the feasibility of empathic connection through telehealth while acknowledging that clinicians may need to work more intentionally to access and convey empathy in the virtual environment.</p>
<h2>Disparities in Telehealth Adoption</h2>
<p>While aggregate data on telemental health adoption paint a picture of rapid and widespread growth, these aggregate figures mask significant disparities in both provider adoption and client access. Understanding these disparities is essential for clinicians who aim to provide equitable and accessible virtual services, as unexamined assumptions about universal technology access can inadvertently reproduce and amplify existing inequities in mental health service delivery.</p>
<p>Provider adoption of telehealth varies by discipline, practice setting, geographic location, and clinician demographics. Research conducted during and after the COVID-19 pandemic revealed that psychiatrists and psychologists adopted telehealth at higher rates than counselors and social workers, urban providers adopted at higher rates than rural providers, younger providers adopted more quickly than older providers, and providers in private practice settings adopted more readily than those in community mental health centers and hospital-based settings. Client access to telehealth is shaped by the intersection of multiple social determinants, including income, education, race, ethnicity, age, disability status, geographic location, immigration status, and language proficiency. The Pew Research Center has documented persistent disparities in broadband access and smartphone ownership across these demographic categories, with lower-income households, older adults, rural residents, and racial and ethnic minority groups consistently reporting lower rates of technology access and digital literacy. In Florida, this disparity is particularly acute in rural North Florida and the Panhandle, as well as in parts of the state that experience recurring hurricane-related infrastructure disruption — a consideration with practical implications for telehealth continuity planning that Florida clinicians should not overlook.</p>
<h2>Telehealth and the Scope of Practice Continuum</h2>
<p>The integration of telehealth into mental health practice raises important questions about scope of practice that clinicians must address thoughtfully. Scope of practice defines the boundaries of professional activity for licensed practitioners, specifying what services a practitioner is qualified and authorized to provide. Modality competence refers to the clinician's skills and training in delivering services through specific technology modalities; a clinician who is highly competent in face-to-face individual therapy may not be equally competent in delivering the same therapy through video, and the transition between modalities should be accompanied by appropriate training, supervision, or consultation. The same principle applies to asynchronous text-based therapy, telephone counseling, and technology-assisted interventions, each of which demands distinct skills and clinical adaptations; the ethical principle of competence requires clinicians to practice within the boundaries of their competence and to seek training, supervision, or referral when a situation demands skills or knowledge beyond their current capabilities.</p>
<p>Population competence in telehealth refers to the clinician's knowledge and skills in serving specific client populations through virtual modalities — a clinician who is competent in providing in-person services to children may not be automatically competent in providing telehealth services to children, as the virtual environment introduces developmental, behavioral, and logistical considerations that differ from in-person practice. Similarly, a clinician experienced in individual therapy may not possess the group facilitation skills needed for telehealth group therapy, or the family systems knowledge needed for telehealth family therapy. Honest self-assessment of population-specific telehealth competence is essential for ethical practice under Florida's professional standards, and is a routine part of the peer consultation and supervision process for Florida clinicians building out a telehealth practice.</p>
<p>These disparities in provider adoption have implications for clients served by different provider types and in different settings, as clients whose providers have not adopted telehealth may face reduced access to care during periods when in-person services are disrupted — a consideration of particular relevance in Florida given the state's periodic hurricane-related disruptions to in-person service delivery, during which telehealth-adopting practices can maintain continuity of care while non-adopting practices cannot. Addressing these disparities requires action at multiple levels: at the practice level, clinicians can offer multiple modalities to accommodate clients with varying levels of technology access; at the community level, partnerships with libraries, community centers, and faith-based organizations can create shared technology access points; and at the policy level, advocacy for expanded broadband infrastructure and equitable reimbursement for telephone-based services can address structural barriers. Clinicians who are aware of these disparities and actively work to mitigate them contribute to a more equitable mental health care system — and, for Florida clinicians specifically, contribute to genuine continuity-of-care planning rather than an assumption that telehealth access is uniform across the state's diverse geography and demographics.</p>
<h2>International Perspectives — A Boundary Consideration</h2>
<p>While this course focuses on Florida-specific requirements, clinicians should be aware that American licensure does not authorize practice in foreign countries, and the legal framework for cross-national telehealth is largely undefined. Clinicians whose Florida-based clients travel internationally — a not-infrequent occurrence given Florida's large population of seasonal residents, international students, and clients with dual citizenship or family ties abroad — should establish clear policies regarding service provision during international travel and should consult with legal counsel regarding the legal risks and options associated with cross-national virtual practice. The client-location principle discussed in Section 5 of this course applies with even greater force, and less regulatory clarity, once a client crosses an international border.</p>
`,
    },
    {
      type: "matching",
      matchingInstructions: "Match each term to its correct definition.",
      matchingPairs: [
        { term: "Telemental Health", definition: "Broad umbrella term for all mental health services delivered via telecommunications technologies" },
        { term: "Telehealth (Fla. Stat. §456.47)", definition: "Florida's statutory term — health care services delivered via synchronous or asynchronous telecommunications, EXCLUDING audio-only phone calls, email, and fax" },
        { term: "Teletherapy", definition: "Psychotherapy specifically delivered through synchronous video or audio connections" },
        { term: "Telepsychology", definition: "Psychological services delivered via telecommunications, as defined by the APA (2013)" },
        { term: "BC-TMH", definition: "Board-Certified TeleMental Health credential — nine competency domains, offered by CCE/NBCC" },
        { term: "Store-and-Forward", definition: "Asynchronous transmission of clinical information for later review — included in Florida's telehealth definition" },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 1 Key Takeaways",
      content: "<p>Telehealth has more than six decades of practice history and a substantial evidence base supporting its clinical efficacy across most treatment modalities. But Florida clinicians need one calibration that the general telemental-health literature does not supply on its own: Florida Statute §456.47 defines \"telehealth\" more narrowly than everyday clinical usage, explicitly excluding audio-only telephone contact. Every general statement this course makes about \"telehealth\" evidence, competency, and best practice should be read with that Florida-specific carve-out in mind, especially where phone-only contact is part of a clinician's practice.</p>",
      items: [
        "Telehealth has a robust, modality-specific evidence base — not merely an assumption of equivalence to in-person care",
        "Competence in telehealth is a distinct skill set, not an automatic extension of in-person clinical competence",
        "Florida's §456.47 excludes audio-only contact from its telehealth definition — a distinction carried through every later section of this course",
      ],
    },
    {
      type: "reflection",
      question: "Reflect on your own transition to telehealth. What competency gaps did you discover when you first began providing virtual services? What resources or training helped you address those gaps? What areas still need development?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "In what year did the first documented use of telecommunication technology for psychiatric consultation occur?",
      options: [
        { text: "1972 at Massachusetts General Hospital", isCorrect: false },
        { text: "1959 at the Nebraska Psychiatric Institute", isCorrect: true },
        { text: "1995 with the emergence of email-based therapy", isCorrect: false },
        { text: "2001 with the first consumer videoconferencing platforms", isCorrect: false },
      ],
      explanation: "The first documented telepsychiatry consultation occurred in 1959 at the Nebraska Psychiatric Institute, where clinicians used closed-circuit television to provide group therapy and consultation to patients at Norfolk State Hospital, 112 miles away.",
    },
    {
      type: "multipleChoice",
      question: "Under Florida Statute §456.47, which of the following is explicitly EXCLUDED from the definition of \"telehealth\"?",
      options: [
        { text: "Synchronous video counseling sessions", isCorrect: false },
        { text: "Store-and-forward (asynchronous) transmission of clinical information", isCorrect: false },
        { text: "Audio-only telephone calls, email messages, and facsimile transmissions", isCorrect: true },
        { text: "Sessions conducted through a HIPAA-compliant platform", isCorrect: false },
      ],
      explanation: "Florida Statute §456.47 explicitly excludes audio-only telephone calls, email messages, and facsimile transmissions from its definition of telehealth.",
    },
  ],
};

// ═══ SECTION 2: HIPAA and Secure Technology (universal — reused from CR-TMH601 Section 3) ═══
const SECTION_2 = {
  title: "HIPAA and Secure Technology",
  order: 2,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 2,
      title: "Section 2",
      subtitle: "HIPAA Compliance and Secure Technology Infrastructure",
      bannerAlt: "Laptop screen showing a padlock icon over a secure data connection, representing telehealth data security",
    },
    {
      type: "text",
      content: `<h2>Understanding HIPAA in the Telehealth Context</h2>
<p>The Health Insurance Portability and Accountability Act of 1996 (HIPAA) provides the regulatory backbone for privacy and security in healthcare, and its requirements take on particular significance in the telehealth environment where clinical information traverses digital networks and is stored on electronic devices. For Florida telemental health practitioners, HIPAA compliance is not a one-time achievement but an ongoing practice that requires vigilance, documentation, and periodic reassessment as technology evolves and practice patterns change. HIPAA does not specifically address telehealth as a distinct service delivery modality; rather, its Privacy Rule, Security Rule, and Breach Notification Rule apply equally to health information transmitted or maintained through any medium, including electronic communications used in telehealth.</p>
<p>The HIPAA Privacy Rule establishes standards for the use and disclosure of protected health information (PHI) by covered entities, which include most healthcare providers who transmit health information electronically. The minimum necessary standard requires that clinicians limit the PHI they access, use, or disclose to the minimum amount needed to accomplish the intended purpose — a principle with direct implications for screen sharing, recording practices, and the storage of session-related communications in telehealth practice. The HIPAA Security Rule establishes requirements for safeguarding electronic PHI (ePHI) through three categories of safeguards: administrative, physical, and technical. The Breach Notification Rule establishes requirements for notifying affected individuals, the Department of Health and Human Services, and in some cases the media, when a breach of unsecured PHI occurs, without unreasonable delay and no later than 60 days from discovery.</p>
<h2>The Business Associate Agreement Requirement</h2>
<p>One of the most critical and frequently misunderstood elements of HIPAA compliance in telehealth practice is the Business Associate Agreement (BAA) requirement. Under HIPAA, a business associate is any entity that creates, receives, maintains, or transmits PHI on behalf of a covered entity. The platform vendor through which sessions are conducted is typically classified as a business associate because the platform transmits PHI — the audiovisual content of therapy sessions and any associated data.</p>
<p>The BAA is a legally binding contract between the covered entity (the clinician or practice) and the business associate (the platform vendor) that establishes the permitted and required uses and disclosures of PHI by the business associate, provides that the business associate will not use or further disclose PHI other than as permitted by the agreement, requires the business associate to implement appropriate safeguards to protect PHI, and establishes procedures for reporting security incidents and data breaches. A clinician who conducts telehealth sessions through a platform that has not executed a BAA is in violation of HIPAA, regardless of whether a breach actually occurs. This requirement effectively eliminates consumer-grade communication platforms such as standard Skype, FaceTime, Facebook Messenger, Google Hangouts, and consumer Zoom from consideration as telehealth delivery vehicles unless those platforms offer healthcare-specific versions with BAA availability.</p>
<p>During the COVID-19 public health emergency, the Office for Civil Rights (OCR) within the Department of Health and Human Services exercised enforcement discretion and announced that it would not impose penalties for HIPAA violations related to the good-faith provision of telehealth services through non-public-facing audio or video communication products. Under that same guidance, OCR distinguished "public-facing" platforms — Facebook Live, Twitch, TikTok, and similar applications designed for open or indiscriminate audience access — from "non-public-facing" platforms such as Zoom, Skype, and FaceTime, which by default admit only the intended participants. This enforcement discretion was temporary and expired May 11, 2023; the full requirements of HIPAA, including the BAA mandate, have been fully reinstated. The public-facing/non-public-facing distinction, however, remains a durable and useful principle for evaluating any platform, in Florida or elsewhere: it is a federal HIPAA/OCR concept, not a state-specific rule, but no Florida-licensed clinician should ever deliver clinical content over a public-facing platform.</p>
<h2>Administrative Safeguards for Solo and Small Group Practices</h2>
<p>Administrative safeguards encompass the policies, procedures, and organizational structures that a practice implements to manage the selection, development, implementation, and maintenance of security measures. For solo practitioners and small group practices, which constitute the majority of telemental health providers, administrative safeguards include the designation of a security officer responsible for developing and implementing HIPAA security policies, the completion of a risk analysis to identify vulnerabilities in the practice's electronic systems and workflows, the development of a risk management plan to address identified vulnerabilities, the implementation of workforce training programs to ensure that all employees with access to ePHI understand their security responsibilities, and the creation of contingency plans for responding to data breaches, natural disasters, or technology failures that could compromise ePHI. Florida clinicians should give particular attention to the contingency-planning component, given the state's recurring exposure to hurricanes and other severe-weather events that can disrupt power, internet connectivity, and physical office access for extended periods.</p>
<p>The risk analysis requirement deserves particular emphasis because it is both the most fundamental and the most frequently neglected administrative safeguard. A risk analysis involves a systematic examination of all systems and processes that create, receive, maintain, or transmit ePHI to identify threats and vulnerabilities that could result in unauthorized access, use, disclosure, modification, or destruction of ePHI. For a telehealth practice, the risk analysis should encompass the telehealth platform, the electronic health record system, email and messaging systems used for client communication, cloud storage services, mobile devices, and any other technology that handles clinical information. The risk analysis should be documented in writing, reviewed and updated periodically, and revised whenever significant changes occur in the practice's technology environment.</p>
<p>A structured approach to the risk analysis involves five steps. First, identify all systems that create, receive, maintain, or transmit ePHI — for a telehealth practice, this typically includes the telehealth platform, EHR system, email system, scheduling software, billing system, cloud storage, backup systems, and all devices used for clinical purposes. Second, identify the threats to each system, which may include unauthorized access by hackers, malware infection, phishing attacks, insider threats from staff or family members with device access, physical threats such as device theft or natural disaster (a category deserving particular attention in Florida, given hurricane exposure), and technical failures such as hardware malfunction or software corruption. Third, assess the current security measures in place for each system and evaluate whether they adequately address the identified threats, considering both the likelihood that each threat will materialize and the potential impact if it does. Fourth, assign risk levels (high, medium, low) to each identified vulnerability based on the combination of likelihood and impact. Fifth, develop a risk management plan specifying the actions to be taken to address each identified risk, the implementation timeline, and the individual responsible for each action. The completed risk analysis and risk management plan should be documented in writing and retained as part of the practice's HIPAA compliance records.</p>
<blockquote><p><strong>Clinical Vignette:</strong> During a risk analysis of her home-based telehealth practice, a Florida LMHC discovered that her family shared a single Wi-Fi network, her teenage son had installed a file-sharing application that created network vulnerabilities, her laptop hard drive was not encrypted, and she had been using her personal Gmail account to send appointment reminders containing client names. Each of these findings represented a security vulnerability that, individually, might not have caused a breach but collectively created a risk profile well below HIPAA standards. The risk analysis prompted her to segment her home network, enable full-disk encryption, switch to a HIPAA-compliant scheduling system, and conduct security training for all family members with access to the shared home network — remediation steps she documented in writing as part of her compliance records.</p></blockquote>
<h2>Physical Safeguards for the Virtual Office</h2>
<p>Physical safeguards address the protection of electronic information systems and related equipment from natural and environmental hazards and unauthorized intrusion. Clinicians conducting telehealth sessions from a home office must ensure that the space provides adequate visual and auditory privacy — family members, roommates, or visitors should not be able to see the computer screen during sessions or overhear session content. The use of a dedicated room with a locking door is strongly recommended; when a dedicated room is not available, clinicians should implement alternative measures such as privacy screens for monitors, noise-masking devices, and scheduling sessions during times when others are not present in the home.</p>
<p>Device security is a critical component of physical safeguards. Laptops, tablets, and smartphones used for telehealth should be password-protected with strong passwords that are changed periodically, configured to auto-lock after a brief period of inactivity, encrypted using full-disk encryption, maintained with current operating system and security updates, protected by current antivirus and anti-malware software, and physically secured when not in use, particularly in shared living environments. The use of shared or public computers for telehealth sessions should be strictly avoided.</p>
<h2>Technical Safeguards and Encryption Requirements</h2>
<p>Technical safeguards are the technology-based mechanisms that a practice uses to control access to ePHI and to protect ePHI during transmission over electronic networks. Access controls ensure that only authorized individuals can access ePHI: unique user identification for each individual who accesses the telehealth platform or EHR, strong passwords or multi-factor authentication, automatic logoff procedures, and encryption and decryption mechanisms. Multi-factor authentication has become an industry standard for healthcare applications and is strongly recommended for all telehealth-related systems.</p>
<p>Encryption is arguably the single most important technical safeguard in telemental health practice. Encryption converts readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and an encryption key. In the telehealth context, encryption must be applied both to data in transit and to data at rest. End-to-end encryption (E2EE) is the gold standard: data is encrypted on the sending device and decrypted only on the receiving device, meaning that even the platform vendor cannot access the unencrypted content of the communication. This is distinguished from transport-layer encryption (TLS), in which data is encrypted during transmission but may be decrypted and re-encrypted at intermediate servers. The Advanced Encryption Standard with 256-bit key length (AES-256) is the current encryption standard recommended by the National Institute of Standards and Technology (NIST) for healthcare data.</p>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Administrative Safeguards",
          content: `<p>Policies, procedures, and organizational structures for security management. For solo/small practices: designate a security officer, complete a risk analysis to identify vulnerabilities, develop a risk management plan, implement workforce training, and create contingency plans for breaches, tech failures, and — in Florida — hurricane/severe-weather disruption. The risk analysis is the most fundamental and most frequently neglected safeguard.</p>`,
        },
        {
          title: "Physical Safeguards",
          content: `<p>Protection of electronic systems and equipment. In home-based telehealth: ensure visual and auditory privacy (dedicated room with locking door), use privacy screens, employ noise-masking devices, schedule sessions when others are absent. Device security: password protection, auto-lock, full-disk encryption (BitLocker/FileVault), current security updates, antivirus software, physical security when not in use.</p>`,
        },
        {
          title: "Technical Safeguards",
          content: `<p>Technology-based access controls and transmission security. Key elements: unique user IDs, multi-factor authentication, automatic logoff, encryption (AES-256 for data at rest, E2EE for data in transit). End-to-end encryption (E2EE) is the gold standard — data encrypted on sending device, decrypted only on receiving device. Even the platform vendor cannot access content.</p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>A Framework for Platform Evaluation</h2>
<p>Selecting a telehealth platform is one of the most consequential decisions a clinician makes when establishing a virtual practice. The platform serves as the digital equivalent of the physical therapy office: it mediates every clinical interaction and carries responsibility for the security of deeply sensitive personal information. A comprehensive platform evaluation should assess candidates across security and compliance, clinical functionality, client accessibility, reliability and performance, and cost structure. At minimum, an acceptable platform must offer encryption of data in transit using TLS 1.2 or higher, provide end-to-end encryption for video and audio content, execute a Business Associate Agreement, maintain SOC 2 Type II compliance or an equivalent security certification, implement role-based access controls, provide audit logging of system access and events, and offer configurable data retention policies. The evaluation should be documented and retained as part of the practice's HIPAA compliance records.</p>
<p>Several platforms have emerged as leading options for HIPAA-compliant telemental health delivery, and Florida clinicians evaluating options should weigh the following in-depth comparisons, each of which reflects publicly available pricing and feature information subject to change. <strong>Doxy.me</strong> is a browser-based platform requiring no client-side download — sessions run entirely through a web browser link. Its free tier includes HIPAA-compliant video with a BAA, making it the most accessible entry point for solo practitioners, though the free tier lacks a virtual waiting room and advanced features such as screen sharing and group sessions are reserved for paid tiers (roughly $35–$50/month); it also lacks integrated scheduling, EHR, or billing, requiring separate systems for those functions. <strong>Zoom for Healthcare</strong> is the HIPAA-compliant version of the widely used Zoom platform, distinct from consumer Zoom, which lacks a BAA; most clients are already familiar with the interface, and it offers strong group-session support with breakout rooms, screen sharing, whiteboard tools, clinician-controlled recording, and end-to-end encryption when enabled, at a cost of roughly $13–$18/month, though it lacks integrated EHR, scheduling, or billing.</p>
<p><strong>SimplePractice</strong> is an all-in-one practice management platform combining telehealth with EHR, scheduling, billing, insurance claim filing, secure messaging, and a client portal in a single system with a single BAA — the client portal supports intake paperwork, consent forms, scheduling, and payments, and the platform includes customizable telehealth-specific consent templates, at a cost of roughly $29–$99/month depending on tier; the tradeoff is a steeper learning curve and single-vendor dependency, where an outage disrupts scheduling, documentation, billing, and telehealth simultaneously. <strong>TherapyNotes</strong> emphasizes clinical documentation, with robust note templates and diagnostic prompts, built-in (not add-on) telehealth, and strong billing/claims management with ERA/EOB processing, at a competitive price of roughly $49/month for a solo provider; its interface prioritizes function over aesthetics, and its client-facing portal is less polished than SimplePractice's. <strong>Jane App</strong>, originally designed for multidisciplinary health clinics, offers excellent online booking, integrated telehealth without client downloads, and strong insurance billing support, making it well-suited to practices with multiple provider types, at a starting cost of roughly $54/month scaling with provider count; some mental-health-specific documentation templates feel less developed than on platforms built specifically for behavioral health, and the platform is based in Canada, which may raise data-residency considerations. Regardless of which platform a clinician selects, thorough documentation of the selection process — including the BAA, the evaluation of security features, and the rationale for the selection — should be maintained as part of the practice's HIPAA compliance records.</p>
<h2>Client-Side Technology Troubleshooting</h2>
<p>Technology difficulties on the client's side are among the most common disruptions in telehealth practice, and the clinician's ability to guide clients through basic troubleshooting can significantly improve the telehealth experience. Audio problems are the most frequently reported issue, commonly caused by incorrect audio device selection, muted microphones, Bluetooth headphones paired with the wrong device, unauthorized browser microphone permissions, or background applications monopolizing audio; a systematic approach begins with verifying the correct audio device, checking mute status, and then escalating to permission checks and device restart. Video quality problems may stem from insufficient bandwidth (manifesting as pixelation, freezing, or dropped frames, addressable by closing other bandwidth-consuming applications or switching to a wired connection) or poor lighting (addressable by repositioning the client so the primary light source is in front of them rather than behind, since backlighting causes auto-exposure to darken the face). Connection stability can be assessed using speed-test tools before sessions, with a minimum of 1.5 Mbps upload/download recommended and 5 Mbps or higher preferred for HD quality; clients with marginal connections should position their device near the router, minimize simultaneous device use during sessions, and have a cellular phone available as a backup — a particularly relevant contingency for Florida clients whose connectivity may be affected by seasonal severe weather.</p>
<h2>Telehealth Room Setup and Professional Environment</h2>
<p>The clinician's physical environment during telehealth sessions communicates professionalism and therapeutic presence. Camera positioning should place the lens at approximately eye level, creating a natural conversational perspective — cameras positioned too high create a looking-down effect that may read as authoritative or dismissive, while cameras positioned too low can be unflattering and may subtly undermine professional presentation. Lighting is one of the most impactful and frequently overlooked elements: the primary light source should be positioned in front of the clinician, at approximately face height, with natural window light or a front-facing panel light providing even, flattering illumination, while backlighting from windows behind the clinician should be managed with curtains or blinds to prevent a silhouetting effect. The visible background should project professionalism without being distracting — a bookshelf, a neutral wall, or simple artwork creates an appropriate backdrop, while overly artificial virtual backgrounds can appear unprofessional. Audio quality is at least as important as video quality: external microphones or headsets generally provide significantly better audio than built-in laptop microphones, which often pick up keyboard sounds, fan noise, and room echo.</p>
<h2>Network Security for Home-Based Practice</h2>
<p>The majority of telemental health practitioners conduct sessions from home offices, using residential internet connections that were not designed with healthcare security requirements in mind. Securing the home network requires configuring the wireless router with WPA3 encryption (or WPA2 at minimum), with the default administrator password changed to a strong, unique password, and establishing a separate guest network for non-clinical devices such as smart home devices, gaming consoles, and family members' personal devices, isolating clinical traffic from general household internet use. A Virtual Private Network (VPN) adds an additional layer of security by encrypting all internet traffic from the clinician's device, which is particularly important when conducting sessions from a location other than the primary home office — a consideration Florida clinicians should plan for in advance of hurricane season, when sessions may need to be conducted from a temporary or evacuation location. Firewall configuration, both at the router level and on individual devices, provides an additional security layer by blocking unauthorized incoming connections and monitoring outgoing traffic for suspicious patterns. Most modern operating systems include built-in firewall capabilities that should be enabled and properly configured; third-party firewall solutions may offer additional features such as application-level filtering and intrusion detection, though they add complexity to the technology environment that must be managed by a solo practitioner rather than a dedicated IT department.</p>
<h2>Device Management and Mobile Security</h2>
<p>The proliferation of mobile devices in clinical practice introduces both convenience and risk. Full-disk encryption should be enabled on all devices used for clinical purposes — both Windows (BitLocker) and macOS (FileVault) offer built-in full-disk encryption, and mobile devices (iOS and Android) encrypt their storage by default when a passcode is enabled. Encryption ensures that if a device is lost or stolen, the data stored on it cannot be accessed without the encryption key or passcode. Mobile device management (MDM) considerations are particularly relevant for practices where multiple clinicians share devices or where personal devices are used for clinical work (a practice known as BYOD, or Bring Your Own Device); MDM policies should address device encryption, passcode complexity and change frequency, remote wipe capability in case of device loss or theft, restrictions on application installation, automatic operating system and security updates, and separation of personal and clinical data on the device. Remote wipe capability deserves particular emphasis for Florida practices, since a device lost or damaged during an evacuation is a realistic scenario that a solo practitioner's device-management policy should account for in advance rather than improvise in the moment.</p>
<h2>Email and Messaging Security</h2>
<p>Between-session communication with clients through email or messaging platforms presents significant HIPAA compliance challenges. Standard email protocols do not provide end-to-end encryption, meaning that email content may be accessible at multiple points during transmission and storage; using standard email services such as Gmail, Outlook, or Yahoo Mail to communicate clinical information, including session summaries, assessment results, or appointment confirmations that identify the client as a mental health client, creates HIPAA compliance risk. The preferred approach is to use a secure client portal integrated with the practice EHR system, which provides encrypted messaging within a HIPAA-compliant environment. When clients initiate contact through unsecured channels such as standard email or text messaging, clinicians should limit their responses to scheduling logistics and avoid including clinical content in the reply. Standard SMS messages are not encrypted and can be intercepted, stored by mobile carriers, and accessed through device backups; a clear communication policy, included in the informed consent document, should specify the channels through which clinical communication will and will not occur.</p>
<h2>Cloud Storage and Data Backup Planning</h2>
<p>The storage and management of clinical data in the cloud introduces both convenience and complexity. Cloud-based storage services offer automatic backup, device-independent access, and disaster recovery — a set of advantages of particular relevance for Florida practices that face periodic evacuation or extended power-outage scenarios. Not all cloud storage services are suitable for storing PHI: consumer-grade services such as personal Dropbox, Google Drive, and iCloud do not provide BAAs and therefore cannot be used for PHI storage in a HIPAA-compliant manner, while enterprise and healthcare-specific tiers of these services may offer BAAs and enhanced security features that make them appropriate. When evaluating cloud storage, clinicians should assess encryption standards for data at rest and in transit, the physical location of data centers (data should be stored within the United States unless international storage is specifically authorized and disclosed — and ideally outside Florida's own hurricane-exposure footprint, for redundancy), the vendor's data retention and deletion policies, and the terms of the BAA, including indemnification and termination procedures. A comprehensive backup plan — required under HIPAA's contingency-plan provision — should specify what data is backed up, how frequently, where it is stored, how it is encrypted, and how regularly backup restoration is tested, since untested backups provide false assurance.</p>
<p>Data lifecycle management encompasses the creation, storage, access, sharing, archiving, and eventual destruction of clinical data — including data generated by the telehealth platform (session metadata, chat logs, connection records), clinical documentation stored in the EHR, communications exchanged through secure messaging systems, and assessment data collected through electronic administration. Each category of data should be subject to defined retention schedules, access controls, and destruction procedures that comply with Florida record-retention law, HIPAA requirements, and professional ethical standards. For Florida practices specifically, disaster-recovery planning should be tested not merely as a theoretical HIPAA compliance exercise but as an operational plan the clinician has actually rehearsed — confirming, before hurricane season each year, that cloud-stored records remain accessible from an alternate location, that a current client contact list is available offline, and that clients have been informed in advance of how the practice will communicate about session continuity or cancellation during a storm event.</p>
<h2>Emerging Cybersecurity Threats in Healthcare</h2>
<p>The healthcare sector has become one of the most targeted industries for cyberattacks, driven by the high value of healthcare data on illicit markets and the relative vulnerability of many healthcare organizations to sophisticated attacks. Ransomware attacks, in which malicious software encrypts an organization's data and demands payment for the decryption key, have increased dramatically in the healthcare sector; the average cost of a healthcare ransomware attack, including ransom payments, system downtime, recovery costs, and regulatory penalties, exceeded $1.5 million in 2023. For a solo or small group telemental health practice, a ransomware attack could result in complete loss of access to clinical records, scheduling systems, and billing data, effectively shutting down the practice until systems are restored. Prevention strategies include maintaining current software updates and security patches, implementing robust backup systems with offline or air-gapped copies, training all staff and family members with device access to recognize phishing attempts, and deploying endpoint detection and response (EDR) solutions.</p>
<p>Credential theft attacks, including phishing, credential stuffing, and brute-force password attacks, target the login credentials of healthcare providers to gain unauthorized access to clinical systems. Multi-factor authentication is the single most effective defense against credential theft, as it requires a second verification factor in addition to the password, making stolen credentials alone insufficient for unauthorized access.</p>
<h2>Advanced Technical Safeguards</h2>
<p>Beyond the foundational technical safeguards of encryption, access controls, and audit logging, telehealth practitioners should be aware of advanced security measures that provide additional protection for clinical data. Zero-trust architecture represents a security paradigm that assumes no user, device, or network should be inherently trusted, even if they are within the organization's network perimeter; under a zero-trust model, every access request is verified through multiple authentication factors, access is granted on a least-privilege basis, and all network traffic is monitored and logged regardless of its origin. While full zero-trust implementation is typically associated with larger organizations, solo and small group practices can adopt elements of the approach by implementing multi-factor authentication on all systems, limiting administrative access to essential functions, and monitoring access logs for anomalous activity. Data loss prevention (DLP) technologies monitor data flows within an organization to detect and prevent unauthorized transmission or extraction of sensitive information, identifying PHI within emails, file transfers, and other communications and blocking or flagging transmissions that violate security policies; cloud-based DLP solutions are available at price points accessible to smaller practices. Security information and event management (SIEM) systems aggregate log data from multiple sources and use correlation rules and analytics to identify potential security incidents; cloud-based SIEM services offer simplified security monitoring that can alert practitioners to suspicious activity such as failed login attempts or unusual access patterns without requiring in-house security expertise.</p>
<h2>Implementing a HIPAA Compliance Program</h2>
<p>A comprehensive HIPAA compliance program encompasses policies, procedures, training, documentation, and ongoing monitoring that together ensure the practice meets its obligations under the Privacy Rule, Security Rule, and Breach Notification Rule. For solo practitioners, the compliance program need not be elaborate, but it must address the core requirements in a documented and systematic manner: a written set of HIPAA policies and procedures tailored to the specific practice environment, workforce training documented with completion records for anyone with access to PHI, and retention of the risk analysis, risk management plan, written policies, training records, business associate agreements, and incident/breach logs for at least six years from the date of creation or the date the document was last in effect, whichever is later, as required by HIPAA.</p>
<p>Workforce training is required under HIPAA for all individuals who have access to PHI, which in a home-based telehealth practice may include the clinician alone or may extend to billing staff, virtual assistants, or family members who have access to devices containing PHI. Training should cover the practice's HIPAA policies, the identification and reporting of security incidents, the proper handling of PHI in electronic and physical formats, and the consequences of non-compliance; training should be documented, with records of completion maintained for each individual who receives it. Documentation of the compliance program serves both regulatory and practical purposes — a well-documented compliance program demonstrates due diligence in the event of a breach investigation or complaint review, and the documentation itself (the risk analysis, policies, training records, BAAs, and incident logs) is often the first thing a licensing board or OCR investigator will request if a complaint or breach is reported.</p>
<h2>Reimbursement and Billing Considerations</h2>
<p>The financial viability of a telehealth practice depends significantly on payer reimbursement policies, which vary across Medicare, Medicaid, commercial insurance carriers, and self-pay arrangements. Medicare reimbursement for telehealth mental health services underwent transformative changes during and after the COVID-19 pandemic: prior to the pandemic, Medicare covered telehealth mental health services only when the patient was located at a designated originating site such as a rural health clinic, and the patient was not permitted to receive services from home. The Consolidated Appropriations Act of 2021 and subsequent legislation permanently removed the originating-site requirement for mental health services, allowing Medicare beneficiaries to receive telehealth counseling and psychotherapy from their homes; Medicare reimburses telehealth mental health services at the same rate as in-person services, using the same CPT codes with the addition of modifier 95 to indicate synchronous telehealth delivery. Florida Medicaid covers telehealth mental health services for eligible beneficiaries, with specific policies governing eligible provider types, covered services, and documentation requirements; clinicians billing Florida Medicaid managed-care organizations for telehealth services must use the appropriate place-of-service code (POS 02 for a patient located in their home, POS 10 for an originating site) and must document the modality of service delivery in the clinical record — and, per the discussion in Section 3, must be attentive to whether a given contact meets the §456.47 telehealth definition or was audio-only, since billing and documentation obligations may differ.</p>
<p>Commercial insurance payers have adopted varying policies regarding telehealth reimbursement, and these policies continue to evolve; many major commercial insurers expanded telehealth coverage during the pandemic and have maintained at least some level of permanent coverage, though reimbursement rates, covered services, eligible modalities, and documentation requirements vary across carriers and plans. Common billing pitfalls in telehealth practice include failing to verify client identity and location at the beginning of each session, billing for audio-only sessions using codes that require audiovisual communication (a particular risk given Florida's audio-only exclusion from the telehealth definition), providing services to clients located in states where the clinician is not licensed or registered and submitting claims referencing a Florida address, and failing to document the specific modality used in the clinical record. Each of these errors can result in claim denial, overpayment recoupment, or, in serious cases, allegations of fraud. The GT modifier was historically used to indicate that a service was delivered via interactive audio and video telecommunication, but it has been largely superseded by modifier 95 and the use of place-of-service codes; some payers continue to require the GT modifier, so clinicians should verify current requirements with each payer rather than assuming a single billing convention applies universally across Medicare, Florida Medicaid, and commercial carriers.</p>
<h2>The Federal Regulatory Layer Beneath State Rules</h2>
<p>Telemental health practice in Florida operates within a layered regulatory environment that encompasses federal statutes and regulations, the Florida Board's own rules, professional ethical codes, and payer-specific policies. HIPAA provides the federal floor for privacy and security requirements — it applies equally to health information transmitted or maintained through any medium and does not itself distinguish "telehealth" as a separate service category, which is why Florida's own statutory definition in §456.47 does the work of defining what specifically counts as telehealth for state regulatory purposes. Understanding this layered structure — federal privacy/security floor, state-specific service-delivery and licensure rules, and professional ethical codes stacked on top of both — helps clinicians correctly locate which rule governs a given compliance question, rather than assuming any single source (HIPAA, §456.47, or the ACA Code of Ethics) covers the entire regulatory landscape on its own. A useful diagnostic question when a compliance question arises is simply: is this a question about who may see the information (HIPAA), a question about whether and how the service may be delivered at all (§456.47 and F.A.C. 64B4), or a question about the clinician's professional judgment and conduct in delivering it (the ACA Code of Ethics and analogous codes)? Most telehealth compliance questions map cleanly onto one of these three layers once framed this way.</p>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each platform or practice into whether it satisfies HIPAA requirements for telehealth.",
      categories: ["HIPAA-Compliant for Clinical Use", "NOT HIPAA-Compliant for Clinical Use"],
      cards: [
        { id: "fl-cs-1", text: "Doxy.me (with signed BAA)", correctCategory: "HIPAA-Compliant for Clinical Use" },
        { id: "fl-cs-2", text: "Zoom for Healthcare (with BAA, E2EE enabled)", correctCategory: "HIPAA-Compliant for Clinical Use" },
        { id: "fl-cs-3", text: "SimplePractice / TherapyNotes / Jane App", correctCategory: "HIPAA-Compliant for Clinical Use" },
        { id: "fl-cs-4", text: "Consumer Zoom (standard free version, no BAA)", correctCategory: "NOT HIPAA-Compliant for Clinical Use" },
        { id: "fl-cs-5", text: "Personal Gmail account for appointment reminders with client names", correctCategory: "NOT HIPAA-Compliant for Clinical Use" },
        { id: "fl-cs-6", text: "Facebook Live or other public-facing livestream platforms", correctCategory: "NOT HIPAA-Compliant for Clinical Use" },
      ],
      explanation: "HIPAA-compliant clinical use requires a signed BAA, non-public-facing architecture, and encryption controlled by the clinician — not merely a familiar consumer app.",
    },
    {
      type: "callout",
      calloutType: "donot",
      title: "Public-Facing Platforms Are Never Appropriate for Clinical Content",
      content: "<p>Federal HHS Office for Civil Rights (OCR) guidance distinguishes <strong>public-facing</strong> video communication products (Facebook Live, Twitch, TikTok, and similar applications designed for open or indiscriminate audience access) from <strong>non-public-facing</strong> products (Zoom, Skype, FaceTime, Doxy.me) that by default admit only the intended participants. Only non-public-facing platforms — with a signed BAA — may be used for clinical telehealth services. Note: this is a federal HIPAA/OCR principle, not a Florida-specific board rule, though it applies fully to Florida practice.</p>",
    },
    {
      type: "matching",
      matchingInstructions: "Match each security concept to its correct definition.",
      matchingPairs: [
        { term: "AES-256", definition: "NIST-recommended encryption standard for healthcare data — 256-bit key length" },
        { term: "End-to-End Encryption (E2EE)", definition: "Gold standard: data encrypted on sending device, decrypted only on receiving device — even the vendor cannot read it" },
        { term: "Business Associate Agreement (BAA)", definition: "Contract required with any vendor that creates, receives, maintains, or transmits PHI on the practice's behalf" },
        { term: "Non-Public-Facing Platform", definition: "A remote communication product that, by default, admits only the intended participants — required for clinical use" },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 2 Key Takeaways",
      content: "<p>HIPAA compliance for Florida telehealth practice rests on three pillars: a signed Business Associate Agreement with every vendor touching PHI, encryption of data both in transit and at rest (AES-256 as the NIST benchmark, end-to-end encryption as the gold standard), and a documented risk analysis that is revisited whenever the practice's technology environment changes. None of these is a one-time task — the compliance program is a living set of practices, not a folder of paperwork completed once and forgotten.</p>",
      items: [
        "No platform without a signed BAA — regardless of how familiar or convenient it is for clients",
        "Public-facing platforms (Facebook Live, TikTok, Twitch) are never appropriate for clinical content",
        "Florida's hurricane exposure makes tested backup and continuity planning a practical necessity, not just a HIPAA checkbox",
      ],
    },
    {
      type: "reflection",
      question: "Conduct a mental inventory of every device and system that touches your client data: telehealth platform, EHR, email, scheduling, cloud storage, mobile devices, backup systems. For each, ask: Is it encrypted? Do I have a BAA? Who else has access? Where is your biggest vulnerability? Do you have a hurricane-season contingency plan for continuity of care?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "What encryption standard does NIST recommend for healthcare data?",
      options: [
        { text: "RSA-1024", isCorrect: false },
        { text: "SSL 3.0", isCorrect: false },
        { text: "TLS 1.0", isCorrect: false },
        { text: "AES-256", isCorrect: true },
      ],
      explanation: "AES-256 (Advanced Encryption Standard with 256-bit key length) is the NIST-recommended standard for healthcare data encryption.",
    },
    {
      type: "multipleChoice",
      question: "Under HIPAA's Breach Notification Rule, affected individuals must be notified of a breach of unsecured PHI within:",
      options: [
        { text: "24 hours of discovery", isCorrect: false },
        { text: "30 days of discovery", isCorrect: false },
        { text: "90 days of discovery", isCorrect: false },
        { text: "60 days of discovery", isCorrect: true },
      ],
      explanation: "HIPAA requires notification without unreasonable delay and no later than 60 days from the discovery of the breach.",
    },
  ],
};

// ═══ SECTION 3: Informed Consent (456.47) ═══
const SECTION_3 = {
  title: "Informed Consent Under Florida Statute §456.47",
  order: 3,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 3,
      title: "Section 3",
      subtitle: "Informed Consent Under Florida Statute §456.47",
      bannerAlt: "Client reviewing and signing a telehealth informed consent form on a tablet",
    },
    {
      type: "text",
      content: `<h2>The Enhanced Informed Consent Requirement</h2>
<p>Informed consent is a foundational ethical and legal requirement in all mental health practice, but telehealth delivery introduces a constellation of additional risks, limitations, and considerations that must be addressed in the consent process. The ACA Code of Ethics (2014, Section H) specifically addresses technology-assisted services and requires counselors to inform clients of the benefits and limitations of technology-assisted counseling, the potential for technology failure, alternative methods of service delivery, emergency procedures, time zone differences, and cultural and language considerations specific to virtual service delivery.</p>
<p>For Florida-licensed clinicians, this ethical obligation operates within the specific statutory framework of Florida Statute §456.47, "Use of Telehealth to Provide Services." Section 456.47 establishes that a telehealth provider has the duty to practice in a manner consistent with their scope of practice and the prevailing professional standard of practice for a health care professional who provides in-person health care services in Florida — telehealth delivery does not lower the applicable clinical standard. The statute also permits a telehealth provider to perform a patient evaluation via telehealth, and if that evaluation is sufficient to diagnose and treat the patient, the provider is not required to separately research the patient's medical history or conduct an in-person physical examination before using telehealth to provide services.</p>
<h2>The Audio-Only Exclusion — Why It Matters for Consent</h2>
<p>The single most distinctive feature of Florida's telehealth statute, and one with direct implications for informed consent documentation, is its definition of telehealth: §456.47 explicitly excludes audio-only telephone calls, email messages, and facsimile transmissions from what counts as "telehealth" under Florida law. This means that when a Florida clinician conducts a session by telephone only — with no video component — that session falls outside the statutory telehealth framework entirely, even though the clinical literature and most other states' regulations would still describe it as a form of telemental health service.</p>
<p>The practical consequence for informed consent is significant: a Florida clinician's telehealth-specific informed consent document should clearly distinguish which modalities are being consented to under the §456.47 telehealth framework (synchronous video, and asynchronous store-and-forward technology) and should separately address the clinician's policy on audio-only telephone contact, since that contact is not "telehealth" for Florida regulatory purposes but may still carry its own clinical, billing, and documentation implications. Clinicians who rely on telephone check-ins as a fallback modality — for clients with unreliable video access, for example — should not assume that their telehealth consent automatically covers that practice; a separate or supplemental disclosure addressing audio-only contact is the more defensible approach.</p>
<h2>Out-of-State Provider Registration</h2>
<p>Florida Statute §456.47 also establishes a distinctive mechanism for out-of-state providers: a health care professional who is not licensed in Florida may provide health care services, including mental health services, to a patient physically located in Florida using telehealth, if the health care professional registers with the applicable Florida board. A health care professional may NOT register under this provision if their license to provide health care services is subject to a pending disciplinary investigation or action, or has been revoked, in any state or jurisdiction. This registration pathway is a notable feature of Florida's regulatory approach — it does not require full Florida licensure for qualifying out-of-state providers, but it does require an affirmative registration step, and it is unavailable to providers with pending discipline or a revocation history anywhere. Florida clinicians who supervise or collaborate with out-of-state colleagues serving Florida clients should confirm that registration, not mere licensure in the provider's home state, has been completed.</p>
<h2>Essential Elements of Telehealth Informed Consent</h2>
<p>A thorough telehealth informed consent should address the following domains, each of which encompasses considerations that differ from or extend beyond those addressed in standard in-person consent documents. <strong>Nature of telehealth services:</strong> the consent should describe the specific modalities through which services will be delivered, explicitly distinguishing §456.47 telehealth (video, store-and-forward) from audio-only telephone contact, and the technology platform or platforms that will be used, written in plain language accessible to clients without technical backgrounds. <strong>Benefits and risks:</strong> benefits include increased access to services, elimination of travel time, and flexibility in scheduling; risks include the possibility of technology failure during sessions, potential limitations in the clinician's ability to observe nonverbal cues, risks to privacy if the client's location is not adequately private, and the inability of the clinician to provide direct physical intervention in the event of a clinical emergency.</p>
<p><strong>Technology requirements:</strong> the consent should specify minimum technology requirements, including internet bandwidth recommendations, supported devices and browsers, and any software the client will need to install. <strong>Privacy and confidentiality:</strong> the consent should address the client's selection of a private location, recommendations for headphones and screen privacy, and the platform's data handling practices. <strong>Recording policies:</strong> the consent should state whether sessions may be recorded, under what circumstances, and what consent requirements apply — Florida is a two-party (all-party) consent state for recording oral communications, so both the clinician and client must consent to any session recording. <strong>Emergency procedures:</strong> the consent must document the client's physical address at the time of each session, the name and contact information of a local emergency contact person, the address and phone number of the nearest emergency department, the local emergency services dispatch number, and the clinician's crisis response protocol. <strong>Interstate and out-of-state disclosure:</strong> if the clinician is providing services under the §456.47 out-of-state registration pathway, or if the client is physically located outside Florida during a session, the consent should disclose the relevant licensing and registration basis for the services being provided.</p>
<h2>Verifying Client Identity in Telehealth</h2>
<p>Identity verification is a foundational element of competent telehealth practice that is easy to overlook once a therapeutic relationship is well established, but that deserves explicit attention at intake and periodic reaffirmation thereafter. At the first telehealth session, clinicians should verify the client's identity through a government-issued photo ID displayed to the camera, cross-checked against the name and demographic information on file, and should separately confirm the client's current physical location and emergency contact information as discussed above. For subsequent sessions, a verbal confirmation of name and location at the start of the session, documented in the session note, is generally sufficient absent some specific reason for heightened concern (such as a session initiated from an unfamiliar device or a video connection where the person on screen cannot be clearly identified). This practice protects against the narrow but real risk of a telehealth session being used by someone other than the intended client — a risk with no in-person analogue, since a physical office visit inherently involves the clinician observing who has arrived for the appointment.</p>
<h2>Clinical Documentation Standards</h2>
<p>Clinical documentation for telehealth sessions must meet the same professional and regulatory standards as documentation for in-person sessions, with additional elements specific to the virtual modality. Each session note should specify the modality of service delivery — explicitly noting whether the session meets the §456.47 telehealth definition or was an audio-only telephone contact — the technology platform used, the client's physical location at the time of the session, verification of client identity at the beginning of the session, and any technology difficulties experienced and how they were managed. The clinical content of the session note follows the same documentation standards as in-person sessions; however, clinicians should be attentive to the ways in which the modality may affect the scope and quality of clinical observations, and these limitations should be acknowledged in the documentation rather than omitted, as thorough documentation of both what was observed and what could not be adequately assessed demonstrates clinical diligence and protects the clinician in the event of a malpractice claim.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Telehealth-Specific Documentation Templates</h2>
<p>Many electronic health record systems now include telehealth-specific templates that prompt clinicians to document the required telehealth elements alongside standard clinical documentation. For clinicians whose EHR systems do not include such templates, developing a custom telehealth addendum that captures the modality-specific elements — including whether the session met Florida's §456.47 telehealth definition — can ensure consistent documentation compliance. Documentation of the informed consent process should also be maintained, including the date the telehealth consent was provided to the client, the date it was reviewed verbally, and the client's signature or electronic acknowledgment; if the consent is updated to reflect changes in technology, emergency procedures, or other elements, the updated consent should be documented as well.</p>
<h2>Managing Consent Across Changing Circumstances</h2>
<p>Informed consent is not a single event but an ongoing process that must be revisited when circumstances change. Several types of changes may necessitate updating the informed consent, including changes in the technology platform used for service delivery, changes in the client's location (particularly if the client relocates to a different state), changes in the clinician's privacy practices or security measures, changes in regulatory requirements, and changes in the scope or nature of services provided. Documentation of the consent update process should include the date of the update, the specific elements that were changed, the method by which the updated consent was communicated to the client, and the client's acknowledgment of the updated terms.</p>
<blockquote><p><strong>Clinical Vignette:</strong> When a counselor in Tampa transitioned from Doxy.me to SimplePractice for her telehealth platform, she updated her informed consent documents, sent the revised consent to all active clients through the new platform's secure messaging feature, discussed the change during the next scheduled session with each client, and documented the consent update in each client's clinical record. Three months later, when a client questioned the change, the counselor was able to demonstrate that the client had been fully informed and had acknowledged the updated consent.</p></blockquote>
<p>The legal doctrine of informed consent varies by state, with some states applying a "reasonable patient" standard (what a reasonable patient would want to know) and others applying a "reasonable physician" standard (what a reasonable physician would disclose). The concept of therapeutic transparency, in which the clinician proactively shares information about their clinical reasoning, treatment approach, and practice procedures, is particularly important in telehealth practice, since clients engaging virtually may have less contextual information about the clinician's practice than clients who visit a physical office. Periodic consent reviews provide opportunities to assess the client's continued satisfaction with the modality, identify any emerging concerns related to technology use or privacy, update emergency contact information and the client's physical location, and address any new regulatory requirements that affect service delivery.</p>
<h2>State-Specific Consent Requirements Beyond Florida</h2>
<p>While the general principles of informed consent apply across all jurisdictions, individual states may impose specific requirements regarding the form, content, and timing of telehealth informed consent that a Florida clinician serving an out-of-state client — or relying on the §456.47 out-of-state registration pathway in the other direction — must satisfy in addition to Florida requirements. Some states require written, signed informed consent specifically acknowledging the telehealth nature of services; others accept verbal consent documented in the clinical record. Some states mandate that specific topics be addressed, such as the right to receive in-person services as an alternative to telehealth, or the specific technology platform that will be used. The Telehealth Policy Connector maintained by the Center for Connected Health Policy provides state-by-state summaries of telehealth consent requirements that can help clinicians identify the specific obligations applicable to their practice. For clinicians serving clients in multiple states, the recommended approach is to develop a comprehensive informed consent document that meets or exceeds the requirements of the most stringent state in which the clinician provides services, reviewed and updated at least annually to reflect any changes in state requirements.</p>
<h2>Documentation of the Consent Process Itself</h2>
<p>Beyond the content of the consent document, clinicians should maintain a clear record of the consent process: the date the telehealth consent was first provided, the date it was reviewed verbally with the client, whether the review addressed the §456.47 audio-only exclusion explicitly, and the client's signature or electronic acknowledgment. Electronic signature platforms that timestamp and store consent documents provide a convenient and defensible method for managing this documentation, and are generally preferable to a purely verbal consent process precisely because they create a durable, dateable record that can be produced if a licensing board or malpractice inquiry later questions when and how a client was informed.</p>
<h2>Client Technology Orientation and Onboarding</h2>
<p>A structured technology orientation process for new telehealth clients can significantly reduce the frequency and severity of technology-related disruptions during clinical sessions and can improve client comfort and confidence with the virtual modality. An effective orientation begins with a pre-session checklist verifying that the client has a working camera, microphone, and speaker or headphones; that the client has tested their internet connection speed; that the client has identified a private location; and that the client has the clinician's contact information for use during a technology disruption. A brief technology test session, conducted 10 to 15 minutes before the first clinical session, provides an opportunity for the client to practice connecting to the platform, adjust their camera and audio settings, and experience the telehealth interface without the pressure of clinical content. For clients with limited technology experience, written technology guides with step-by-step instructions and screenshots can supplement the orientation session, written in plain, non-technical language and available in formats accessible to clients with visual impairments or limited literacy.</p>
`,
    },
    {
      type: "callout",
      calloutType: "warning",
      title: "Audio-Only Calls Are Excluded From Florida's Telehealth Definition",
      content: "<p>Florida Statute §456.47 explicitly excludes audio-only telephone calls, email messages, and facsimile transmissions from its definition of \"telehealth.\" A session conducted purely by phone, without video, does not fall within the statutory telehealth framework — clinicians should not assume their telehealth informed consent automatically covers this practice, and should address audio-only contact separately in consent and documentation. This distinction is not a mere technicality: it affects which consent language governs the contact, how the session should be documented in the clinical record, and potentially how the contact should be billed, since payer telehealth modifiers and place-of-service codes generally presuppose an audiovisual encounter rather than a voice-only one.</p>",
    },
    {
      type: "callout",
      calloutType: "key",
      title: "Out-of-State Provider Registration Under §456.47",
      content: "<p>A health care professional not licensed in Florida may provide telehealth services to a Florida-located patient by registering with the applicable Florida board — but may NOT register if their license is subject to pending disciplinary action or has been revoked in any jurisdiction. This is a registration requirement, not full licensure, and is distinct from the client-location doctrine discussed in Section 5.</p>",
      items: [
        "Confirm registration status for any out-of-state colleague serving Florida clients",
        "Registration is unavailable if discipline is pending or a revocation exists anywhere",
        "Document the registration basis in the client's informed consent",
      ],
    },
    {
      type: "flashcardDeck",
      instructions: "Flip through the essential informed consent elements for Florida telehealth practice.",
      flashcards: [
        { id: "fl-fc-1", front: "Nature of Services", back: "Describe specific modalities and explicitly distinguish §456.47 telehealth (video, store-and-forward) from audio-only telephone contact, which is excluded from the statutory definition." },
        { id: "fl-fc-2", front: "Standard of Care (§456.47)", back: "A telehealth provider must practice consistent with the prevailing professional standard of practice for in-person care in Florida — telehealth does not lower the applicable standard." },
        { id: "fl-fc-3", front: "Out-of-State Registration", back: "A non-Florida-licensed provider may serve a Florida-located patient by registering with the applicable board — unavailable if discipline is pending or a license has been revoked anywhere." },
        { id: "fl-fc-4", front: "Recording Policies", back: "Florida is a two-party (all-party) consent state for recording oral communications — both clinician and client must consent to any session recording." },
        { id: "fl-fc-5", front: "Emergency Procedures", back: "Document: client's physical address each session, local emergency contact person, nearest ED address/phone, local dispatch number, clinician's crisis response protocol." },
        { id: "fl-fc-6", front: "Audio-Only Disclosure", back: "Because phone-only contact is excluded from §456.47's telehealth definition, address it separately in consent and documentation rather than assuming telehealth consent covers it." },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 3 Key Takeaways",
      content: "<p>Florida's informed consent obligations layer the general ACA ethical requirements for technology-assisted services on top of §456.47's specific statutory demands — and the single most distinctive feature to get right is the audio-only exclusion: a phone-only contact is not \"telehealth\" under Florida law, so a clinician's consent, documentation, and billing practices should never quietly assume that a telehealth consent form covers a telephone check-in.</p>",
      items: [
        "Distinguish §456.47 telehealth (video, store-and-forward) from audio-only contact in consent and documentation",
        "Florida requires two-party consent for recording — both clinician and client must agree",
        "Out-of-state registration (not licensure) is the relevant authorization when a non-Florida provider serves a Florida client",
      ],
    },
    {
      type: "reflection",
      question: "Pull up your current telehealth informed consent document right now. Does it explicitly distinguish §456.47 telehealth (video, store-and-forward) from audio-only telephone contact? Does it address Florida's two-party recording-consent requirement? Are there gaps?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under Florida Statute §456.47, a telehealth provider's standard of care is:",
      options: [
        { text: "Relaxed to reflect the limitations of remote technology", isCorrect: false },
        { text: "The same as the prevailing professional standard of practice for in-person care in Florida", isCorrect: true },
        { text: "Set entirely by the technology platform's terms of service", isCorrect: false },
        { text: "Not yet defined under Florida law", isCorrect: false },
      ],
      explanation: "Section 456.47 requires a telehealth provider to practice consistent with the prevailing professional standard of practice for in-person care — telehealth delivery does not lower the applicable clinical standard.",
    },
    {
      type: "multipleChoice",
      question: "A health care professional not licensed in Florida may provide telehealth services to a Florida-located patient if they:",
      options: [
        { text: "Obtain a full Florida license before the first session", isCorrect: false },
        { text: "Register with the applicable Florida board, provided no pending discipline or revocation exists in any jurisdiction", isCorrect: true },
        { text: "Simply disclose their out-of-state license to the client", isCorrect: false },
        { text: "Complete 2 hours of Florida-specific continuing education", isCorrect: false },
      ],
      explanation: "Section 456.47 allows an out-of-state health care professional to register with the applicable Florida board to provide telehealth services to a Florida-located patient — registration is unavailable if the provider's license is subject to pending discipline or has been revoked in any jurisdiction.",
    },
    {
      type: "multipleChoice",
      question: "Which of the following is EXCLUDED from Florida's statutory definition of telehealth under §456.47?",
      options: [
        { text: "Synchronous video sessions", isCorrect: false },
        { text: "Store-and-forward technology", isCorrect: false },
        { text: "Audio-only telephone calls", isCorrect: true },
        { text: "Sessions using a HIPAA-compliant platform", isCorrect: false },
      ],
      explanation: "Florida Statute §456.47 explicitly excludes audio-only telephone calls (along with email and fax) from its definition of telehealth.",
    },
  ],
};

// ═══ SECTION 4: Clinical Assessment via Telehealth ═══
const SECTION_4 = {
  title: "Clinical Assessment Adaptations for Telehealth",
  order: 4,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 4,
      title: "Section 4",
      subtitle: "Clinical Assessment Adaptations for Telehealth",
      bannerAlt: "Therapist taking notes while conducting a video counseling call, representing clinical assessment via telehealth",
    },
    {
      type: "text",
      content: `<h2>The Assessment Challenge in Virtual Practice</h2>
<p>Clinical assessment lies at the heart of competent mental health practice, informing diagnostic formulation, treatment planning, risk evaluation, and outcome monitoring. The transition from in-person to telehealth delivery fundamentally alters the assessment environment in ways that clinicians must understand, acknowledge, and address through intentional adaptation of assessment methods and procedures. Florida Statute §456.47 reinforces this obligation directly: because a telehealth provider is held to the same standard of care as in-person practice, any limitations the virtual medium introduces into the assessment process must be actively managed, not simply accepted as an unavoidable cost of convenience.</p>
<p>The most significant change involves the scope of behavioral observation available to the clinician. In an in-person setting, the clinician has access to the client's full physical presentation, including gait and psychomotor activity upon entering the office, body posture and positioning throughout the session, hand movements and fidgeting behaviors, odor indicators that may suggest substance use or self-care deficits, and the overall quality of hygiene and grooming. In a video-based telehealth session, the clinician's view is typically limited to the client's face and upper torso, constrained by camera angle, lighting conditions, and screen resolution. Information that would be readily observable in person may be entirely invisible in the virtual environment. This limitation does not render assessment impossible through telehealth, but it does require clinicians to adapt their assessment strategies to maximize the information available through the virtual medium, to explicitly acknowledge the limitations of virtual assessment in their documentation, and to supplement virtual assessment with additional data sources when clinical concerns warrant a more comprehensive evaluation.</p>
<h2>Adapting the Mental Status Examination for Video</h2>
<p>The mental status examination (MSE) is a structured assessment of the client's current mental functioning that provides a snapshot of their cognitive, emotional, and behavioral presentation at the time of the clinical encounter. Adapting the MSE for telehealth delivery requires attention to both what can be adequately assessed through video and what requires modification or supplementation, and Florida's §456.47 standard-of-care requirement means this is not an optional refinement — it is the mechanism by which an MSE conducted over video meets the same standard as one conducted in person. <strong>Appearance:</strong> assessment through video is limited to what is visible within the camera frame — clinicians can observe grooming of the hair and face, clothing visible above the waist, visible injuries or skin changes, and the general impression of self-care, but cannot assess full body presentation, hygiene indicators detected through smell, or clothing below the camera frame; these limitations should be documented. <strong>Behavior and psychomotor activity:</strong> video observation permits assessment of facial expressions, eye contact with the camera, head movements, upper body restlessness, and hand gestures visible in the frame; lower body psychomotor activity (leg bouncing, pacing, inability to remain seated) typically cannot be assessed through standard video presentation.</p>
<p><strong>Speech:</strong> assessment of speech characteristics is generally well-preserved in telehealth delivery, assuming adequate audio quality — rate, rhythm, volume, tone, and articulation can be assessed comparably to in-person evaluation, though audio latency or compression artifacts may occasionally mimic speech abnormalities. <strong>Mood and affect:</strong> the client's reported mood can be assessed identically through telehealth as in person; affect assessment can be conducted reasonably well through video, though intensity and range of affective expression may be somewhat attenuated on video due to camera angle, lighting, and screen resolution. <strong>Thought process and content:</strong> primarily conducted through the verbal exchange and therefore well-suited to telehealth delivery — tangentiality, circumstantiality, loose associations, thought blocking, suicidal ideation, homicidal ideation, delusions, obsessions, and phobias are all assessable through clinical interview techniques that transfer directly to the telehealth environment. <strong>Cognition:</strong> brief cognitive screening, including orientation, attention, concentration, memory, and executive function, can be adapted for telehealth delivery — orientation questions can be asked verbally without modification, attention and concentration can be assessed through digit span or serial subtraction tasks, and short-term memory can be assessed through word recall tasks; clock drawing and other visually-mediated cognitive screens present greater challenges but can be adapted by asking the client to hold their drawing up to the camera or using screen-sharing features.</p>
<h2>Standardized Assessment Administration in Telehealth</h2>
<p>The administration of standardized assessment instruments through telehealth raises several methodological and ethical considerations. Many widely used psychological and clinical assessment instruments were developed and normed for in-person administration, and the validity of their scores when administered in a virtual environment has not always been established through independent research. Self-report measures that clients complete independently, such as the PHQ-9, GAD-7, PCL-5, and similar screening instruments, can generally be administered through telehealth without significant validity concerns, provided electronic administration occurs through a secure, HIPAA-compliant channel and completed assessments are integrated into the clinical record. Clinician-administered assessments that involve specific stimuli, timing requirements, or behavioral observation components may require more substantial adaptation for telehealth use, and when standardized instruments are administered via telehealth with modifications to the standard administration procedure, these modifications should be documented in the clinical record, with the potential impact on validity acknowledged in the interpretation of results.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Risk Assessment in the Virtual Environment</h2>
<p>Risk assessment, particularly for suicide and violence, is arguably the most critical clinical function affected by the transition to telehealth delivery. Suicide risk assessment through telehealth can be conducted effectively using structured approaches such as the Columbia-Suicide Severity Rating Scale (C-SSRS), the Suicide Assessment Five-step Evaluation and Triage (SAFE-T), or other validated frameworks; the verbal interview components of these frameworks transfer well to telehealth delivery. Several telehealth-specific considerations apply: the clinician should verify the client's physical location at the beginning of every session, since this information is essential for coordinating emergency response if a safety concern arises; the clinician should have current contact information for emergency services in the client's jurisdiction; the client's emergency contact person should be identified and their contact information maintained in an accessible location; and the clinician should develop a clear internal protocol for managing situations in which a client discloses imminent suicidal intent during a telehealth session.</p>
<p>Safety planning through telehealth requires adaptation of traditional safety planning approaches. Collaborative safety plans can be developed using screen-sharing features, shared documents, or the clinician sharing their screen while typing the plan in real time; the completed safety plan should be transmitted to the client through a secure channel at the conclusion of the session. Clinicians should discuss with clients the means-restriction component of safety planning in the context of the client's home environment, recognizing that the clinician cannot directly observe the client's environment or accompany them in implementing means restriction strategies. A well-constructed telehealth safety plan should include the client's identified warning signs that a crisis may be developing, internal coping strategies the client can use independently, social contacts and settings that provide distraction and support, family members or friends who can be contacted for help, professional resources including the clinician's own contact information and crisis hotline numbers, and specific strategies for making the home environment safer by removing or restricting access to lethal means — each element documented in the clinical record alongside the suitability assessment discussed later in this section, since a client's risk profile is itself one of the inputs to the clinical-appropriateness domain of that assessment.</p>
<h2>Screening for Telehealth Suitability: A Structured Framework</h2>
<p>Florida Statute §456.47's standard-of-care requirement, together with the general professional obligation of competence, elevates suitability screening from a best practice to a de facto regulatory expectation for Florida telehealth clinicians: because telehealth-delivered services must meet the same standard as in-person care, a clinician who fails to assess whether a given client can be adequately served through the virtual modality is exposed to the same standard-of-care scrutiny as a clinician who fails to conduct any other clinically indicated assessment.</p>
<h2>The Three-Domain Suitability Framework</h2>
<p>A comprehensive telehealth suitability screening should evaluate the client across three interrelated domains: clinical appropriateness, technological capacity, and environmental suitability. All three domains must be satisfactorily addressed for telehealth to be an appropriate service delivery modality. Deficiency in any single domain may indicate that in-person services are more appropriate, or it may indicate that specific accommodations or interventions are needed before telehealth can proceed safely and effectively.</p>
<p><strong>Domain 1 — Clinical Appropriateness:</strong> whether the client's presenting concerns, clinical acuity, cognitive capacity, and treatment needs can be adequately addressed through the telehealth modality. The assessment should consider the nature and severity of the presenting condition, the client's current level of functioning and clinical stability, the specific therapeutic interventions planned and their suitability for virtual delivery, the client's history of crisis events and current risk level, the availability of in-person crisis resources in the client's geographic area, and any comorbid conditions that may complicate virtual assessment or treatment. Presentations that may be less suitable include active psychosis with significant disorganization, severe cognitive impairment that prevents independent navigation of telehealth platforms, active suicidal crisis with imminent risk and limited local emergency resources, severe substance intoxication during sessions, and conditions requiring physical examination or in-person assessment components that cannot be adequately conducted via video. These are not absolute contraindications, but presentations that require heightened clinical judgment.</p>
<p><strong>Domain 2 — Technological Capacity:</strong> whether the client possesses or has access to the technology, connectivity, and digital literacy needed to participate effectively — access to a device with camera, microphone, and adequate screen size; reliable internet connectivity (minimum 1.5 Mbps upload/download for video, 5+ Mbps preferred); comfort and proficiency with videoconferencing technology; and the availability of technical support for clients with limited digital literacy. When technological capacity barriers are identified, clinicians should explore accommodations — a pre-session technology orientation, simplifying the connection process, switching to a telephone modality (with the §456.47 audio-only caveat discussed in Section 3 clearly documented), connecting the client with community technology access points such as libraries or community health centers, or involving a family member or caregiver in technology setup with the client's consent — before concluding that telehealth is inappropriate. The technology domain is often the most tractable of the three: unlike clinical acuity or environmental privacy, technological barriers frequently respond to a relatively modest, one-time intervention (a device loan, a data-plan adjustment, a brief orientation session) rather than requiring an ongoing accommodation, which is one reason clinicians should not treat an initial technology gap as a reason to decline telehealth outright without first exploring whether it is readily solvable.</p>
<p><strong>Domain 3 — Environmental Suitability:</strong> whether the client's physical environment supports confidential, safe, and therapeutically productive telehealth engagement — availability of a private space, the safety of the client's home environment (particularly for clients with histories of domestic violence or family conflict), the presence of potential distractions, adequate lighting and seating, and the client's ability to maintain session boundaries in a non-clinical environment. Environmental barriers are among the most common reasons that telehealth may be inappropriate for specific clients, and in each scenario the clinician must weigh environmental barriers against the benefits of telehealth access and determine whether in-person services, hybrid arrangements, or environmental modifications can adequately address the concerns. A client living in a one-room apartment with a partner and young children may have no realistic option for private telehealth participation; a client experiencing domestic violence may face safety risks if an abusive partner becomes aware of the therapeutic content discussed during sessions; a client in active recovery from substance use may find it difficult to maintain clinical focus in a home environment associated with past substance use. Each of these scenarios calls for the same weighing process — environmental barriers against telehealth access benefits — rather than a reflexive determination in either direction.</p>
<h2>Documenting the Suitability Assessment</h2>
<p>The suitability assessment must be documented in the clinical record, both to satisfy the §456.47 standard-of-care obligation and to demonstrate clinical due diligence. Documentation should include the date of the suitability assessment, the domains evaluated, the specific findings in each domain, the clinical determination regarding telehealth appropriateness (suitable, suitable with modifications, or not suitable), the rationale for the determination, any accommodations or modifications recommended, and a plan for reassessment if the client's circumstances change. Suitability should be reassessed whenever significant changes occur in the client's clinical status, living situation, or technology access — a client who was initially suitable for telehealth may become less suitable if their clinical acuity increases, if they relocate to an environment with inadequate privacy, or if they lose access to reliable technology; conversely, a client initially determined to be unsuitable may become appropriate for telehealth if barriers are addressed, such as obtaining a personal device, improving internet connectivity, or stabilizing a clinical condition that previously precluded virtual engagement.</p>
<h2>When Suitability Screening Reveals Unsuitability</h2>
<p>Not every client is a good candidate for telehealth, and the professional obligation created by Florida's standard-of-care requirement cuts both ways: just as a clinician must not passively accept an inadequate virtual assessment, a clinician must also be willing to conclude, when the evidence supports it, that a given client should be transitioned to in-person care rather than continued via telehealth indefinitely. Where accommodations across the three domains have been explored and documented and the client remains unsuitable — for example, a client in active psychiatric crisis with no reliable technology access and no private space — the clinically and ethically appropriate response is a documented referral to in-person services or a higher level of care, not a continuation of telehealth on the theory that some service is better than none. Florida clinicians should build this possibility into their intake and informed-consent conversations from the outset, so that a later determination of unsuitability is experienced by the client as a planned clinical contingency rather than an abrupt termination of care.</p>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each item into the correct suitability assessment domain.",
      categories: ["Clinical Appropriateness", "Technological Capacity", "Environmental Suitability"],
      cards: [
        { id: "fl-suit-1", text: "Severity of current psychotic symptoms", correctCategory: "Clinical Appropriateness" },
        { id: "fl-suit-2", text: "Current suicide risk level and local crisis resources", correctCategory: "Clinical Appropriateness" },
        { id: "fl-suit-3", text: "Cognitive capacity to navigate the telehealth platform", correctCategory: "Clinical Appropriateness" },
        { id: "fl-suit-4", text: "Client's internet speed (minimum 1.5 Mbps)", correctCategory: "Technological Capacity" },
        { id: "fl-suit-5", text: "Access to a device with working camera and microphone", correctCategory: "Technological Capacity" },
        { id: "fl-suit-6", text: "Availability of tech support (family member, caregiver)", correctCategory: "Technological Capacity" },
        { id: "fl-suit-7", text: "Private room where the client cannot be overheard", correctCategory: "Environmental Suitability" },
        { id: "fl-suit-8", text: "Safety of home environment (domestic violence screening)", correctCategory: "Environmental Suitability" },
        { id: "fl-suit-9", text: "Household distractions (children, pets, TV)", correctCategory: "Environmental Suitability" },
      ],
      explanation: "All three domains — clinical, technological, and environmental — must be satisfactorily addressed for telehealth to be an appropriate delivery modality.",
    },
    {
      type: "callout",
      calloutType: "clinical",
      title: "The Three-Domain Suitability Model",
      content: "<p>Clinical appropriateness + technological capacity + environmental suitability. A deficiency in one domain doesn't automatically rule out telehealth — explore accommodations first (telephone modality, community access points, scheduling around household privacy) before concluding in-person care is required. Because Florida's §456.47 standard-of-care requirement applies equally to telehealth and in-person services, this three-domain assessment functions as the practical mechanism by which a clinician demonstrates that a given client's telehealth care actually meets that standard, rather than merely assuming it does because a session technically took place.</p>",
    },
    {
      type: "text",
      content: `<h2>Integrating Collateral Information in Telehealth Assessment</h2>
<p>Given the inherent limitations of virtual clinical observation, telehealth clinicians should develop strategies for supplementing direct assessment with collateral information from appropriate sources. Collateral contacts with family members, previous treatment providers, primary care physicians, and other individuals who can provide relevant clinical information can compensate for some of the observational limitations of the virtual environment. When conducting telehealth intake assessments, clinicians should routinely discuss with clients the potential value of collateral contacts and obtain appropriate releases of information; this is particularly important for clients presenting with conditions that may involve limited insight, such as substance use disorders, bipolar disorder, or personality disorders, where the discrepancy between self-report and collateral information may have significant diagnostic and treatment planning implications.</p>
<p>Environmental assessment represents another opportunity unique to telehealth practice: because the client is typically in their home environment during sessions, the clinician may have a window into the client's living conditions that would not be available during an office-based visit. The condition of the visible living space, the presence of other individuals, audible background sounds, and the client's choice of location within the home can all provide clinically relevant information. A client who consistently participates in sessions from a dark, cluttered room may be demonstrating behavioral symptoms of depression that would not be apparent in an office setting where the physical environment is controlled by the clinician.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Florida telehealth counselor noticed that her client, who presented with anxiety and denied substance use concerns, was consistently surrounded by empty beer cans visible on the desk behind him during afternoon sessions. Rather than confronting the observation directly, the counselor used the environmental cue as an opening for a broader discussion about coping strategies and substance use patterns, which eventually revealed a problematic drinking pattern that the client had not initially disclosed. This collateral environmental information, available only because of the telehealth modality, proved clinically significant and informed the subsequent treatment plan and the documented suitability reassessment discussed earlier in this section.</p></blockquote>
<h2>Assessment of Treatment Progress in Telehealth</h2>
<p>Monitoring treatment progress is a core clinical responsibility that requires adaptation in the telehealth context. Routine outcome monitoring (ROM), which involves the systematic administration of standardized outcome measures at regular intervals throughout treatment, provides an evidence-based framework for tracking client progress. The Outcome Rating Scale (ORS) and Session Rating Scale (SRS), developed as part of the Partners for Change Outcome Management System (PCOMS), are brief four-item measures that can be administered at the beginning (ORS) and end (SRS) of each session — their brevity makes them particularly practical for telehealth, where administrative activities should be minimized to preserve session time for clinical work. The PHQ-9 for depression and the GAD-7 for anxiety are widely used outcome measures that can be administered through secure client portals before each session, allowing the clinician to review scores and track trajectories before the session begins.</p>
<p>Clinicians should be attentive to the phenomenon of "response shift" in telehealth outcome monitoring, in which changes in the measurement context (such as the shift from in-person to telehealth administration) may influence scores independently of actual clinical change. Acknowledging this potential confound and using multiple data sources — standardized measures, clinical observation, client self-report, and functional outcome tracking — provides a more robust picture of treatment progress. The PTSD Checklist for DSM-5 (PCL-5), a 20-item self-report measure of PTSD symptom severity, is similarly well-suited to electronic administration and useful for tracking trauma treatment progress in telehealth, while the Columbia-Suicide Severity Rating Scale (C-SSRS) discussed earlier in this section serves a parallel function for risk monitoring — its structured-interview format transfers well to telehealth, provided the clinician has verified the client's current location as part of the same session, consistent with the risk-assessment practices already described.</p>
<h2>Functional Assessment in the Home Environment</h2>
<p>One unique advantage of telehealth is the opportunity it provides for observing client functioning in their natural environment, an assessment dimension that is rarely available in office-based practice. Environmental observations during telehealth sessions can provide clinically meaningful data about the client's functioning level, coping capacity, and treatment engagement — the organization and cleanliness of the visible living space may reflect cognitive functioning, motivation, and self-care capacity, and changes in the environment over time may signal changes in mental health status. The presence of specific items in the environment, such as medication bottles, alcohol containers, exercise equipment, or creative projects, may provide context for discussions about treatment adherence, coping behaviors, and progress toward treatment goals. Interpersonal observations are also uniquely available in the telehealth context: family members may come into view during sessions, children may interrupt with requests, or partners may be heard in the background, providing a rich contextual layer that can inform clinical formulation while clinicians attend to these cues without invading the client's privacy beyond what is clinically relevant.</p>
<p>Some clinicians have developed structured approaches to telehealth-based functional assessment that systematically incorporate environmental observation into the assessment process. For example, a clinician conducting a home-based assessment for an elderly client being evaluated for independent living capacity might ask the client to give a brief tour of their kitchen, bathroom, and medication storage area via video, providing direct observational data about the client's self-care environment that would otherwise require a separate home visit. This application of telehealth technology expands the scope of clinical assessment beyond what is possible in either traditional office-based practice or traditional home health visit models — provided, consistent with the standard-of-care principle discussed throughout this section, that the clinician documents both what this expanded observation revealed and the limits of what a video tour can substitute for an in-person environmental assessment.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Florida telehealth counselor conducted a suitability assessment for a new client requesting video sessions. The clinical domain revealed stable depression with no current suicidal ideation — suitable for telehealth. The technology domain revealed that the client owned only a smartphone with a prepaid data plan offering 2GB monthly data, insufficient for regular video sessions. The environmental domain revealed that the client shared a small apartment with three roommates and had no consistently private space. Rather than declining telehealth outright, the counselor implemented accommodations: scheduled video sessions during hours when roommates were at work, kept sessions brief to conserve data, and discussed — separately from the §456.47 telehealth consent — a clearly documented policy for occasional audio-only telephone check-ins between sessions. The suitability assessment, accommodations, and rationale were documented in the clinical record.</p></blockquote>
`,
    },
    {
      type: "flashcardDeck",
      instructions: "Flip through the MSE domains as adapted for video-based assessment.",
      flashcards: [
        { id: "fl-mse-1", front: "Appearance", back: "Preserved: face, hair, upper torso grooming, visible injuries. Limited: full body presentation, hygiene by smell, clothing below camera frame." },
        { id: "fl-mse-2", front: "Behavior & Psychomotor Activity", back: "Preserved: facial expressions, eye contact (camera proxy), head movements, upper body restlessness. Limited: lower body activity (leg bouncing, pacing)." },
        { id: "fl-mse-3", front: "Speech", back: "Well-preserved assuming adequate audio. Caveat: audio latency or compression may mimic speech abnormalities." },
        { id: "fl-mse-4", front: "Mood and Affect", back: "Reported mood: identical to in-person. Observed affect: reasonably assessed via video, though intensity may be attenuated on screen." },
        { id: "fl-mse-5", front: "Thought Process & Content", back: "Well-suited to telehealth — primarily verbal. Suicidal/homicidal ideation, delusions, obsessions assessed through interview techniques that transfer directly." },
        { id: "fl-mse-6", front: "Cognition", back: "Orientation: verbal. Attention/concentration: digit span, serial subtraction. Memory: word recall. Clock drawing: hold up to camera or use screen-sharing." },
      ],
    },
    {
      type: "keyTakeaway",
      title: "Section 4 Key Takeaways",
      content: "<p>Florida's §456.47 standard-of-care requirement means the three-domain suitability framework (clinical, technological, environmental) is not merely good clinical practice — it is the practical evidence that a clinician's telehealth-delivered care actually meets the same standard the statute requires for in-person care. Document the assessment, document the accommodations explored before ruling telehealth out, and be willing to conclude that a given client needs in-person care when the domains genuinely cannot be satisfied.</p>",
      items: [
        "The virtual medium limits some MSE domains (psychomotor activity, full-body appearance) more than others (speech, thought content)",
        "All three suitability domains must be addressed — a deficiency in one calls for accommodation, not automatic exclusion from telehealth",
        "Collateral information and environmental observation are uniquely available (and clinically valuable) in telehealth, not just limitations to work around",
      ],
    },
    {
      type: "reflection",
      question: "Think about a client you currently see via telehealth. Walk through the Three-Domain Suitability Framework: Clinical Appropriateness, Technological Capacity, Environmental Suitability. Would they pass on all three? Have you documented whether any of your contact with them is audio-only and therefore outside Florida's §456.47 telehealth definition?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Which MSE domain is MOST limited by the standard video telehealth format?",
      options: [
        { text: "Thought process and content", isCorrect: false },
        { text: "Speech characteristics", isCorrect: false },
        { text: "Psychomotor activity below the camera frame", isCorrect: true },
        { text: "Mood as reported by the client", isCorrect: false },
      ],
      explanation: "Lower body psychomotor activity typically cannot be assessed through standard video, which shows only face and upper torso.",
    },
    {
      type: "multipleChoice",
      question: "A comprehensive telehealth suitability screening should evaluate the client across which domains?",
      options: [
        { text: "Clinical appropriateness only", isCorrect: false },
        { text: "Financial ability and insurance coverage", isCorrect: false },
        { text: "Clinical appropriateness and technology access", isCorrect: false },
        { text: "Clinical, technological, and environmental suitability", isCorrect: true },
      ],
      explanation: "A comprehensive suitability screening evaluates clinical appropriateness, technological capacity, and environmental suitability — all three must be satisfactorily addressed.",
    },
    {
      type: "multipleChoice",
      question: "What is the minimum recommended upload/download speed for basic video-based telehealth?",
      options: [
        { text: "256 Kbps", isCorrect: false },
        { text: "1.5 Mbps (5+ Mbps preferred for HD)", isCorrect: true },
        { text: "10 Mbps", isCorrect: false },
        { text: "50 Mbps", isCorrect: false },
      ],
      explanation: "1.5 Mbps is the minimum for basic video telehealth, with 5+ Mbps preferred for HD quality.",
    },
  ],
};

// ═══ SECTION 5: Florida Registration and Jurisdiction ═══
const SECTION_5 = {
  title: "Florida Registration and Jurisdictional Requirements",
  order: 5,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 5,
      title: "Section 5",
      subtitle: "Florida Registration and Jurisdictional Requirements",
      bannerAlt: "Outline map of Florida representing jurisdictional and registration rules for telehealth practice",
    },
    {
      type: "text",
      content: `<h2>The Client-Location Rule</h2>
<p>One of the most legally consequential principles in telehealth practice is the client-location rule: mental health services are considered to be delivered in the state where the client is physically located at the time of the session, regardless of where the clinician is physically located. This means that a Florida-licensed clinician providing telehealth services to a client who is physically located in another state at the time of the session is, legally, practicing in that state and must be licensed or otherwise authorized to practice there. There is no general reciprocity: a Florida license does not, by itself, authorize practice with a client physically located in another state.</p>
<p>Florida's own statutory framework, however, takes a distinctive approach to the reverse situation — an out-of-state clinician serving a client physically located in Florida. As discussed in Section 3, §456.47 permits a health care professional not licensed in Florida to provide telehealth services to a Florida-located patient through a board registration process, rather than requiring full Florida licensure, provided the out-of-state professional has no pending disciplinary action or revocation in any jurisdiction. This registration pathway is one of the more permissive mechanisms among the states for inbound out-of-state telehealth practice, and Florida clinicians who collaborate with, supervise, or receive referrals from out-of-state colleagues should understand that registration — not licensure — is the operative authorization for those colleagues.</p>
<h2>Documenting the Client-Location Determination</h2>
<p>Because the client-location rule turns on a fact — where the client is physically sitting during the session — rather than on a fixed characteristic like the client's home address or the clinician's license, Florida clinicians should build location verification into their standard session workflow rather than treating it as a one-time intake question. A simple, sustainable practice is to ask the client to confirm their current physical location verbally at the start of every session, note it in the session documentation alongside the modality used (video versus the audio-only contact discussed in Section 3), and flag any change from the client's usual location for a brief follow-up conversation about how long the change is expected to last and whether it affects the clinician's ability to continue services. This is a low-friction habit, but it is also the single most defensible piece of evidence a clinician can produce if a licensure board or malpractice inquiry later questions whether a given session was properly authorized. Florida clinicians who work with a substantial seasonal-resident or "snowbird" population should pay particular attention to this practice, since clients who split time between Florida and another state on a recurring seasonal basis create exactly the kind of location ambiguity the rule is designed to address.</p>
<h2>Florida's Continuing Education Structure: 64B4-6.001(2)(b)</h2>
<p>Florida Administrative Code Rule 64B4-6.001 establishes the continuing education requirements for licensees regulated by the Florida Board of Clinical Social Work, Marriage and Family Therapy, and Mental Health Counseling — Licensed Clinical Social Workers (LCSW), Licensed Marriage and Family Therapists (LMFT), and Licensed Mental Health Counselors (LMHC). Licensees must complete 30 hours of approved continuing education per renewal, including 2 hours on the prevention of medical errors, and — within six months of initial licensure and every third renewal thereafter — a 2-hour course on domestic violence.</p>
<p>The distinctive feature most relevant to this course is 64B4-6.001(2)(b): <strong>3 hours relating to professional ethics and boundary issues OR telehealth</strong>, which may be taken in any order, but <strong>the same course subject may not be taken in consecutive renewal periods</strong>. In practice, this means a licensee who satisfies this 3-hour requirement with a telehealth course in one biennial renewal period must satisfy it with an ethics/boundary-issues course in the next renewal period, and vice versa — the two subject areas alternate. This structure is the direct source of this course's 3-CE-hour design: it is intended to satisfy the "telehealth" half of that alternating requirement, and Florida licensees should track which subject area they used in their most recent renewal to confirm this course is the one they need for the current cycle rather than a repeat of the same subject. <em>[VERIFY the exact current subsection lettering and hour totals against the live Florida Administrative Code at flrules.org before publish.]</em></p>
<h2>Registered Interns and Telehealth: 64B4-2.002</h2>
<p>Florida Administrative Code Rule 64B4-2.002 addresses the use of telehealth by registered interns working toward LCSW, LMFT, or LMHC licensure. A registered intern may provide face-to-face psychotherapy by electronic methods if the registered intern has a written telehealth protocol and safety plan in place with their current qualified supervisor, and that protocol must include the provision that the qualified supervisor be readily available during the electronic therapy session. The registered intern and their qualified supervisor must also determine, through their professional judgment, that providing psychotherapy by electronic methods is not detrimental to the patient, is necessary to protect the health, safety, or welfare of the patient, the registered intern, or both, and does not violate any existing statute or regulation. Clinical hours obtained via electronic/telehealth psychotherapy sessions count toward the intern's internship-hour requirements on the same basis as in-person hours. The same rule permits qualified supervisors to use electronic methods — including telephone-only communication — to conduct supervisory sessions, under the same professional-judgment standard.</p>
`,
    },
    {
      type: "text",
      content: `<h2>The Public-Facing Platform Principle</h2>
<p>Florida licensees should be aware of a durable federal HIPAA/OCR principle that is sometimes described in continuing-education materials as a "distinctive Florida rule" but is, in fact, a national HIPAA standard rather than a Florida-specific board rule: covered health care providers, including Florida telehealth clinicians, should never use public-facing video communication applications — Facebook Live, Twitch, TikTok, and similar platforms designed for open or indiscriminate audience access — to deliver clinical services. This principle traces to 2020 HHS Office for Civil Rights enforcement-discretion guidance (which itself expired May 11, 2023, restoring full HIPAA enforcement) and to the general HIPAA requirement, discussed in Section 2 of this course, that any platform handling PHI have a signed Business Associate Agreement, which public-facing platforms categorically do not offer. Whatever its precise regulatory label, the practical rule for Florida clinicians is unambiguous: clinical content must never be delivered over a public-facing platform, and this course flags it here because the underlying prohibition is real and important even though its origin is federal rather than Florida-specific.</p>
<h2>Alternative Interstate Practice Authorization Models</h2>
<p>For Florida clinicians serving clients across state lines, several models exist beyond the state's own out-of-state-registration mechanism. <strong>Individual state licensure</strong> — obtaining a separate license in each state where the clinician wishes to provide services — is the most straightforward but most burdensome approach, requiring compliance with each state's education, examination, supervised-experience, and continuing-education requirements. <strong>Temporary practice provisions</strong>, offered by some states, allow out-of-state clinicians to provide services on a limited basis without full licensure; the scope and requirements vary widely by state and must be individually researched. <strong>Supervision arrangements</strong>, in which a clinician provides services in another state under the supervision of a clinician licensed there, are more commonly used for pre-licensure counselors but may be applicable in limited circumstances. None of these alternative models is a substitute for the specific research a Florida clinician must do before serving a client physically located in a new state: the existence of a registration or temporary-practice option in one state does not imply that a similar option exists in the next state a client happens to travel to, and each pathway typically comes with its own notification, fee, or documentation requirements that must be satisfied before, not after, services begin.</p>
<p>Interstate telehealth practice also introduces additional considerations regarding professional liability insurance. Standard professional liability policies may or may not provide coverage for services delivered to clients in other states, depending on the specific policy language. Malpractice claims arising from telehealth services may be governed by the law of the state where the client is located, the state where the clinician is located, or both, depending on the circumstances and applicable conflict-of-laws principles — a jurisdictional uncertainty that creates risk for clinicians who may find themselves subject to legal proceedings in a distant state with unfamiliar malpractice standards, damage caps, and procedural requirements. The disciplinary authority of state licensing boards adds another layer of complexity: a clinician who provides services to a client in another state may be subject to disciplinary action by both the Florida board and the licensing board of the state where the client is located.</p>
<h2>Related Interstate Compact Models</h2>
<p>Related mental health professions have developed interstate practice authorization mechanisms distinct from Florida's own §456.47 out-of-state-registration approach. The Counseling Compact, developed by the Council of State Governments and supported by NBCC, allows eligible licensed professional counselors to obtain a privilege to practice in other member states without separate licensure in each one; eligibility generally requires an active, unencumbered license, a graduate degree from an accredited program, passage of a recognized national examination, and a clean disciplinary record. The Psychology Interjurisdictional Compact (PSYPACT) performs a similar function for psychologists and has been enacted by over 40 states and territories, operating through a certification system administered by the PSYPACT Commission that allows telepsychology and temporary in-person practice in member states. The Social Work Licensure Compact, developed in collaboration with the Association of Social Work Boards, follows a similar privilege-to-practice model and has been introduced in multiple state legislatures.</p>
<p>Because Florida's LCSW, LMFT, and LMHC licensure categories are regulated under Chapter 491 of the Florida Statutes — distinct from the professional-counselor licensure category that the Counseling Compact addresses in other states — Florida licensees should verify which compact, if any, currently applies to their specific license type and whether Florida has enacted it, rather than assuming coverage based on general familiarity with compact models in adjacent professions. A multidisciplinary Florida group practice that employs LCSWs, LMFTs, LMHCs, and psychologists may find that different providers can serve out-of-state clients under different authorization models — a psychologist under PSYPACT, a social worker under an eventual Social Work Compact, and an LMHC under neither — which makes tracking compact status by license type, not merely by practice, an operational necessity rather than a one-time research task.</p>
<h2>Regulatory Monitoring for Florida Clinicians</h2>
<p>Given the dynamic nature of telehealth regulation, clinicians need systematic approaches to monitoring regulatory changes that affect their practice. Relying on ad hoc awareness or informal professional networks is insufficient, as regulatory changes may occur with limited public notice. Effective regulatory monitoring strategies include subscribing to updates from the Florida Board of Clinical Social Work, Marriage and Family Therapy and Mental Health Counseling, which typically provide notice of rule changes, proposed regulations, and board meeting agendas; monitoring professional-association regulatory tracking resources; and reviewing risk-management bulletins distributed by professional liability insurance carriers. The American Telemedicine Association maintains a comprehensive state policy database, and the Center for Connected Health Policy provides state telehealth policy comparison tools — both valuable resources for Florida clinicians who serve clients in multiple states.</p>
<p>A basic compliance-tracking system should document the specific regulatory requirements applicable to the practice, organized by jurisdiction and regulatory body; the status of compliance with each requirement (compliant, pending, or non-compliant); the dates of regulatory changes and the actions taken to implement them; the schedule for periodic compliance reviews; and the documentation supporting compliance with each requirement, including which CE subject (ethics/boundaries or telehealth) satisfied the alternating 64B4-6.001(2)(b) requirement in the most recent renewal period. Annual compliance reviews, conducted either internally or by an external consultant, provide a structured opportunity to identify and address compliance gaps before they result in regulatory violations or disciplinary action.</p>
<h2>Liability, Malpractice, and Disciplinary Exposure in Interstate Practice</h2>
<p>Interstate telehealth practice introduces additional considerations regarding professional liability insurance that Florida clinicians should not overlook. Standard professional liability policies may or may not provide coverage for services delivered to clients physically located in other states at the time of the session, depending on the specific policy language and the regulatory environment of the state involved. Clinicians should review their liability insurance policies carefully and contact their carriers directly to verify that coverage extends to telehealth services delivered across state lines, since a coverage gap discovered only after a claim arises is far more costly than confirming coverage in advance. Malpractice claims arising from telehealth services may be governed by the law of the state where the client is located, the state where the clinician is located, or both, depending on the circumstances and applicable conflict-of-laws principles; this jurisdictional uncertainty creates risk for clinicians who may find themselves subject to legal proceedings in a distant state with unfamiliar malpractice standards, damage caps, and procedural requirements. The disciplinary authority of state licensing boards adds another layer of complexity: a Florida clinician who provides telehealth services to a client in another state may be subject to disciplinary action by both the Florida board and the board of the state where the client is located, underscoring the importance of maintaining compliance with the most restrictive applicable requirements and documenting that compliance carefully.</p>
<h2>Preparing for Interstate Practice Changes</h2>
<p>For Florida clinicians anticipating changes in interstate authorization — whether a future compact enactment relevant to their license type, or simply an expansion of their own out-of-state client base — several preparatory steps can facilitate a smooth transition. First, clinicians should verify eligibility for any applicable compact or authorization model likely to apply to their license type, including an active, unencumbered license and a clean disciplinary record, and should proactively resolve any licensing complications or disciplinary matters, since resolving these after an authorization pathway becomes available may create delays. Second, clinicians should begin developing knowledge of the regulatory environments in states where they anticipate providing services, since even under a compact or registration model, clinicians typically remain subject to each state's informed consent, mandatory reporting, and scope-of-practice requirements. Third, clinicians should review and update their professional liability insurance to confirm coverage extends to all anticipated practice states. Fourth, clinicians should update their informed consent documents to address interstate practice, disclosing the jurisdictions in which they are authorized to practice, the legal or registration basis for that authorization, and any limitations that apply — a step of particular relevance given Florida's own distinctive §456.47 registration pathway for inbound out-of-state providers, discussed earlier in this section.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Florida-licensed LMHC's established client received notice of a job relocation from Orlando to Georgia in six weeks. Rather than continuing services under her Florida license once the client physically relocated, the counselor researched Georgia's telehealth requirements and temporary-practice provisions, confirmed she did not hold a Georgia license and that no applicable compact covered her license type in both states, and — finding no timely path to authorization — planned a warm transition: she provided referrals to a Georgia-licensed clinician, coordinated a records transfer with the client's consent, and scheduled a termination session. She documented the entire process, including her research into Georgia's rules, in the clinical record.</p></blockquote>
`,
    },
    {
      type: "callout",
      calloutType: "key",
      title: "The Client-Location Rule",
      content: "<p>Services are legally delivered in the state where the client is physically located at the time of the session — not the state where the clinician is licensed. A Florida license does not authorize practice with a client physically located outside Florida; conversely, §456.47's out-of-state registration pathway (not full licensure) is what authorizes a non-Florida clinician to serve a Florida-located client.</p>",
      items: [
        "Verify the client's physical location at the start of every session",
        "Document location changes (travel, relocation, dual residence) in the clinical record",
        "Confirm registration (not just home-state licensure) for any out-of-state colleague serving Florida clients",
      ],
    },
    {
      type: "callout",
      calloutType: "protocol",
      title: "Florida's Alternating Ethics/Telehealth CE Requirement",
      content: "<p>F.A.C. 64B4-6.001(2)(b) requires 3 hours on professional ethics/boundary issues OR telehealth per renewal — but the SAME subject may not be used in consecutive renewal periods. Track which subject you used last renewal before assuming this course satisfies your current-cycle requirement. <em>[VERIFY exact subsection and current hour totals against the live F.A.C. before publish.]</em></p>",
    },
    {
      type: "callout",
      calloutType: "donot",
      title: "Public-Facing Platforms — A Federal Rule, Not a Florida-Specific One",
      content: "<p>Never deliver clinical content over a public-facing platform (Facebook Live, TikTok, Twitch). This is federal HIPAA/OCR guidance, not a distinct Florida board rule — but it applies fully to Florida practice regardless of its origin.</p>",
    },
    {
      type: "scenarioTree",
      scenarioTitle: "The Relocating Client",
      instructions: "Your Florida-licensed LMHC client calls for their regular session. They mention they relocated to Georgia last month for a new job and plan to stay long-term.",
      startNode: "start",
      nodes: {
        start: {
          text: "Your client is now permanently located in Georgia. What is your first consideration?",
          options: [
            { text: "Continue sessions as usual — they're my established client", next: "wrong_continue", feedback: "Services are legally delivered where the client is physically located. Continuing without Georgia authorization risks practicing without a license there." },
            { text: "Check whether I'm authorized to provide services in Georgia", next: "correct_check", feedback: "Correct — the client-location rule requires this determination before continuing services." },
          ],
        },
        wrong_continue: {
          text: "Once the client is physically and permanently located in Georgia, services are legally delivered in Georgia. Your Florida license does not authorize practice there.",
          options: [{ text: "What should I do instead?", next: "correct_check" }],
        },
        correct_check: {
          text: "Correct. You need to determine your authorization options. What should you explore?",
          options: [
            { text: "Check whether any interstate compact covers my license type in both states", next: "compact_check" },
            { text: "Look into Georgia licensure or temporary-practice provisions", next: "ga_license" },
          ],
        },
        compact_check: {
          text: "Good instinct — but remember, Florida's LCSW/LMFT/LMHC licensure under Chapter 491 is a different category than the professional-counselor licensure the Counseling Compact addresses in many states. Verify which compact, if any, actually applies to YOUR license type in both Florida and Georgia before assuming coverage.",
          options: [{ text: "What if no compact applies?", next: "ga_license" }],
        },
        ga_license: {
          text: "Georgia licensure or a temporary-practice exemption would take time to arrange, and a 'long-term' relocation makes a temporary provision a poor long-term fit. What is the safest approach?",
          options: [{ text: "Plan a warm transition to a Georgia-licensed provider", next: "transition" }],
        },
        transition: {
          text: "Correct. Provide referrals to a Georgia-licensed clinician, coordinate a records transfer with the client's consent, schedule a termination session, and document the entire research and decision process in the clinical record — this protects both you and the client.",
          options: [],
        },
      },
    },
    {
      type: "cardSort",
      instructions: "Sort each scenario into whether the Florida-licensed clinician may continue providing services under their existing Florida license alone, or needs additional authorization.",
      categories: ["Florida License Alone Is Sufficient", "Additional Authorization Needed"],
      cards: [
        { id: "fl-juris-1", text: "Client is physically located in Florida for the entire session", correctCategory: "Florida License Alone Is Sufficient" },
        { id: "fl-juris-2", text: "Client is a Florida resident temporarily traveling in Georgia during the session", correctCategory: "Additional Authorization Needed" },
        { id: "fl-juris-3", text: "Client permanently relocates from Florida to another state", correctCategory: "Additional Authorization Needed" },
        { id: "fl-juris-4", text: "Client is physically located in Florida but the clinician is traveling out of state during the session", correctCategory: "Florida License Alone Is Sufficient" },
        { id: "fl-juris-5", text: "An out-of-state clinician wants to provide ongoing telehealth services to a client physically located in Florida, with no pending discipline anywhere", correctCategory: "Additional Authorization Needed" },
      ],
      explanation: "Client-location — not clinician location or client residency — determines which state's licensure or registration requirements apply. Note that item 5 needs 'additional authorization' in the form of §456.47 board registration, not full licensure.",
    },
    {
      type: "keyTakeaway",
      title: "Section 5 Key Takeaways",
      content: "<p>Florida's jurisdictional framework has three moving parts that Florida clinicians must keep separate: the general client-location rule (which state's law applies is determined by where the client sits, not where either party is licensed), Florida's own distinctive §456.47 out-of-state registration pathway (which authorizes qualifying out-of-state providers to serve Florida-located clients without full Florida licensure), and the alternating 64B4-6.001(2)(b) continuing-education requirement (which determines whether this course's telehealth-hour designation is the one a given licensee needs this renewal cycle, or whether they need an ethics/boundaries course instead).</p>",
      items: [
        "Client-location, not clinician license, governs which state's rules apply to a given session",
        "§456.47 registration authorizes qualifying out-of-state providers to serve Florida clients — it is not a substitute for full licensure in the other direction",
        "64B4-6.001(2)(b) alternates ethics/boundaries and telehealth every renewal — verify which one you used last cycle",
        "Document the client's physical location every session; it is the single most defensible record if authorization is later questioned",
      ],
    },
    {
      type: "resources",
      title: "Practice Templates — Florida Telehealth",
      description: "Downloadable worksheets to support Florida-compliant telehealth practice.",
      resources: [
        {
          title: "Telehealth Informed Consent — Florida Statute §456.47 Compliant",
          url: "/downloads/CR-TMH603_FL_456-47_Consent.docx",
          type: "worksheet",
          description: "Editable informed-consent template distinguishing §456.47 telehealth from audio-only contact, documenting the standard-of-care and out-of-state-registration disclosures. Human legal review required before clinical use.",
        },
        {
          title: "Telehealth Suitability Screening Form — 3-Domain Assessment",
          url: "/downloads/CR-TMH603_FL_Suitability_Screening.docx",
          type: "worksheet",
          description: "Structured worksheet for documenting the clinical, technological, and environmental suitability domains for a Florida telehealth client.",
        },
      ],
    },
    {
      type: "reflection",
      question: "List every state where your current clients might be physically located, even temporarily. For each, do you know whether you are authorized to serve a client there? Which CE subject (ethics/boundaries or telehealth) satisfied your 64B4-6.001(2)(b) requirement last renewal — and does that mean this course is the one you need this cycle?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under the client-location rule, which state's licensure requirements govern a telehealth counseling session?",
      options: [
        { text: "The state where the clinician is physically located", isCorrect: false },
        { text: "The state where the clinician holds their primary license", isCorrect: false },
        { text: "The state where the client is physically located at the time of the session", isCorrect: true },
        { text: "The state where the telehealth platform's servers are located", isCorrect: false },
      ],
      explanation: "Mental health services are considered to be delivered in the state where the client is physically located at the time of the session.",
    },
    {
      type: "multipleChoice",
      question: "F.A.C. 64B4-6.001(2)(b) requires 3 hours of continuing education on ethics/boundary issues OR telehealth. What is the key restriction on satisfying this requirement?",
      options: [
        { text: "Both subjects must be completed every renewal", isCorrect: false },
        { text: "The same subject may not be taken in consecutive renewal periods", isCorrect: true },
        { text: "Only telehealth counts; ethics/boundaries do not satisfy this rule", isCorrect: false },
        { text: "The requirement applies only to registered interns", isCorrect: false },
      ],
      explanation: "The rule requires alternating subjects — the same course subject (ethics/boundaries or telehealth) may not be used to satisfy this requirement in consecutive renewal periods.",
    },
    {
      type: "multipleChoice",
      question: "Under F.A.C. 64B4-2.002, a registered intern may provide face-to-face psychotherapy by electronic methods if:",
      options: [
        { text: "The intern has completed at least one year of supervised practice", isCorrect: false },
        { text: "A written telehealth protocol and safety plan is in place with the qualified supervisor, who must be readily available during the session", isCorrect: true },
        { text: "The client provides written consent only, with no supervisor involvement required", isCorrect: false },
        { text: "The intern has obtained the BC-TMH credential", isCorrect: false },
      ],
      explanation: "64B4-2.002 requires a written telehealth protocol and safety plan with the qualified supervisor, who must be readily available during the electronic session, and a professional-judgment determination that electronic delivery is appropriate.",
    },
    {
      type: "multipleChoice",
      question: "The prohibition on using public-facing platforms (Facebook Live, TikTok, Twitch) for clinical telehealth content is best understood as:",
      options: [
        { text: "A distinctive Florida-specific board rule found in F.A.C. 64B4", isCorrect: false },
        { text: "A federal HIPAA/OCR principle that applies nationally, including in Florida", isCorrect: true },
        { text: "A rule that only applies to registered interns", isCorrect: false },
        { text: "A rule that no longer applies after May 2023", isCorrect: false },
      ],
      explanation: "The public-facing/non-public-facing distinction originates from federal HHS Office for Civil Rights HIPAA guidance, not a Florida-specific board rule — though the underlying prohibition on using public-facing platforms for PHI remains fully applicable to Florida practice.",
    },
  ],
};

// ═══ ASSESSMENT (16 questions, 80% pass, 3 attempts) ═══
const ASSESSMENT_QUESTIONS = [
  {
    question: "Under Florida Statute §456.47, which of the following is explicitly EXCLUDED from the definition of \"telehealth\"?",
    options: [
      { text: "Synchronous video counseling sessions", isCorrect: false },
      { text: "Store-and-forward (asynchronous) transmission of clinical information", isCorrect: false },
      { text: "Audio-only telephone calls, email messages, and facsimile transmissions", isCorrect: true },
      { text: "Sessions conducted through a HIPAA-compliant platform", isCorrect: false },
    ],
    explanation: "Florida Statute §456.47 explicitly excludes audio-only telephone calls, email messages, and facsimile transmissions from its definition of telehealth.",
  },
  {
    question: "Under Florida Statute §456.47, a telehealth provider's standard of care is:",
    options: [
      { text: "Relaxed to reflect the limitations of remote technology", isCorrect: false },
      { text: "The same as the prevailing professional standard of practice for in-person care in Florida", isCorrect: true },
      { text: "Set entirely by the technology platform's terms of service", isCorrect: false },
      { text: "Not yet defined under Florida law", isCorrect: false },
    ],
    explanation: "Section 456.47 requires a telehealth provider to practice consistent with the prevailing professional standard for in-person care.",
  },
  {
    question: "A health care professional not licensed in Florida may provide telehealth services to a Florida-located patient if they:",
    options: [
      { text: "Obtain a full Florida license before the first session", isCorrect: false },
      { text: "Register with the applicable Florida board, provided no pending discipline or revocation exists in any jurisdiction", isCorrect: true },
      { text: "Simply disclose their out-of-state license to the client", isCorrect: false },
      { text: "Complete 2 hours of Florida-specific continuing education", isCorrect: false },
    ],
    explanation: "Section 456.47 allows an out-of-state provider to register with the applicable Florida board — unavailable if discipline is pending or a license has been revoked anywhere.",
  },
  {
    question: "F.A.C. 64B4-6.001(2)(b) requires 3 hours of continuing education on ethics/boundary issues OR telehealth. What is the key restriction?",
    options: [
      { text: "Both subjects must be completed every renewal", isCorrect: false },
      { text: "The same subject may not be taken in consecutive renewal periods", isCorrect: true },
      { text: "Only telehealth counts toward this requirement", isCorrect: false },
      { text: "The requirement applies only to registered interns", isCorrect: false },
    ],
    explanation: "The rule requires alternating subjects across renewal periods — the same subject may not repeat consecutively.",
  },
  {
    question: "Under F.A.C. 64B4-2.002, a registered intern may provide face-to-face psychotherapy by electronic methods if:",
    options: [
      { text: "The intern has completed at least one year of supervised practice", isCorrect: false },
      { text: "A written telehealth protocol and safety plan is in place with the qualified supervisor, who must be readily available during the session", isCorrect: true },
      { text: "The client provides written consent only, with no supervisor involvement required", isCorrect: false },
      { text: "The intern has obtained the BC-TMH credential", isCorrect: false },
    ],
    explanation: "64B4-2.002 requires a written telehealth protocol and safety plan with the qualified supervisor, who must be readily available during the session.",
  },
  {
    question: "Under the client-location rule, which state's licensure requirements govern a telehealth counseling session?",
    options: [
      { text: "The state where the clinician is physically located", isCorrect: false },
      { text: "The state where the clinician holds their primary license", isCorrect: false },
      { text: "The state where the client is physically located at the time of the session", isCorrect: true },
      { text: "The state where the telehealth platform's servers are located", isCorrect: false },
    ],
    explanation: "Services are considered delivered in the state where the client is physically located.",
  },
  {
    question: "The prohibition on using public-facing platforms (Facebook Live, TikTok, Twitch) for clinical telehealth content is best understood as:",
    options: [
      { text: "A distinctive Florida-specific board rule found in F.A.C. 64B4", isCorrect: false },
      { text: "A federal HIPAA/OCR principle that applies nationally, including in Florida", isCorrect: true },
      { text: "A rule that only applies to registered interns", isCorrect: false },
      { text: "A rule that no longer applies after May 2023", isCorrect: false },
    ],
    explanation: "This is federal HHS OCR HIPAA guidance, not a Florida-specific board rule, though the underlying prohibition remains fully applicable to Florida practice.",
  },
  {
    question: "Which platform arrangement satisfies HIPAA requirements for delivering clinical telehealth services?",
    options: [
      { text: "Consumer Zoom without a BAA", isCorrect: false },
      { text: "A public-facing livestream platform", isCorrect: false },
      { text: "A non-public-facing platform with a signed Business Associate Agreement (BAA)", isCorrect: true },
      { text: "Any video app the client is already comfortable using", isCorrect: false },
    ],
    explanation: "HIPAA-compliant clinical use requires a non-public-facing platform and a signed BAA.",
  },
  {
    question: "What encryption standard does NIST recommend for healthcare data?",
    options: [
      { text: "RSA-1024", isCorrect: false },
      { text: "SSL 3.0", isCorrect: false },
      { text: "TLS 1.0", isCorrect: false },
      { text: "AES-256", isCorrect: true },
    ],
    explanation: "AES-256 is the NIST-recommended standard for healthcare data encryption.",
  },
  {
    question: "Under HIPAA's Breach Notification Rule, affected individuals must be notified of a breach of unsecured PHI within:",
    options: [
      { text: "24 hours of discovery", isCorrect: false },
      { text: "30 days of discovery", isCorrect: false },
      { text: "90 days of discovery", isCorrect: false },
      { text: "60 days of discovery", isCorrect: true },
    ],
    explanation: "HIPAA requires notification without unreasonable delay and no later than 60 days from discovery.",
  },
  {
    question: "Which MSE domain is MOST limited by the standard video telehealth format?",
    options: [
      { text: "Thought process and content", isCorrect: false },
      { text: "Speech characteristics", isCorrect: false },
      { text: "Psychomotor activity below the camera frame", isCorrect: true },
      { text: "Mood as reported by the client", isCorrect: false },
    ],
    explanation: "Lower body psychomotor activity typically cannot be assessed through standard video.",
  },
  {
    question: "A comprehensive telehealth suitability screening should evaluate the client across which domains?",
    options: [
      { text: "Clinical appropriateness only", isCorrect: false },
      { text: "Financial ability and insurance coverage", isCorrect: false },
      { text: "Clinical appropriateness and technology access", isCorrect: false },
      { text: "Clinical, technological, and environmental suitability", isCorrect: true },
    ],
    explanation: "All three domains — clinical, technological, and environmental — must be satisfactorily addressed.",
  },
  {
    question: "What is the minimum recommended upload/download speed for basic video-based telehealth?",
    options: [
      { text: "256 Kbps", isCorrect: false },
      { text: "1.5 Mbps (5+ Mbps preferred for HD)", isCorrect: true },
      { text: "10 Mbps", isCorrect: false },
      { text: "50 Mbps", isCorrect: false },
    ],
    explanation: "1.5 Mbps is the minimum for basic video telehealth, with 5+ Mbps preferred for HD quality.",
  },
  {
    question: "Florida is what type of consent state for recording oral communications, relevant to telehealth session recording policy?",
    options: [
      { text: "One-party consent — only the clinician needs to consent", isCorrect: false },
      { text: "Two-party (all-party) consent — both clinician and client must consent", isCorrect: true },
      { text: "No consent is required for recording in Florida", isCorrect: false },
      { text: "Consent requirements do not apply to telehealth recordings", isCorrect: false },
    ],
    explanation: "Florida is a two-party (all-party) consent state for recording oral communications, so both the clinician and client must consent to any session recording.",
  },
  {
    question: "In what year did the first documented use of telecommunication technology for psychiatric consultation occur?",
    options: [
      { text: "1972 at Massachusetts General Hospital", isCorrect: false },
      { text: "1959 at the Nebraska Psychiatric Institute", isCorrect: true },
      { text: "1995 with the emergence of email-based therapy", isCorrect: false },
      { text: "2001 with the first consumer videoconferencing platforms", isCorrect: false },
    ],
    explanation: "The first documented telepsychiatry consultation occurred in 1959 at the Nebraska Psychiatric Institute.",
  },
  {
    question: "A registered intern's clinical hours obtained via electronic/telehealth psychotherapy sessions under 64B4-2.002:",
    options: [
      { text: "Do not count toward internship-hour requirements", isCorrect: false },
      { text: "Count toward internship-hour requirements on the same basis as in-person hours", isCorrect: true },
      { text: "Count only at half the rate of in-person hours", isCorrect: false },
      { text: "Require separate board pre-approval for each session", isCorrect: false },
    ],
    explanation: "64B4-2.002 provides that clinical hours obtained via electronic/telehealth psychotherapy count toward internship-hour requirements on the same basis as in-person hours.",
  },
];

// ═══ REFERENCES (subset of TMH601's APA 7th Edition list, retained sections only) ═══
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
  { title: "Use of Telehealth to Provide Services", author: "Florida Legislature", year: 2023, source: "Florida Statutes §456.47" },
  { title: "Continuing Education Requirements", author: "Florida Board of Clinical Social Work, Marriage and Family Therapy and Mental Health Counseling", year: 2024, source: "Fla. Admin. Code R. 64B4-6.001" },
  { title: "Definition of \"Supervision\" for Clinical Social Work, Marriage and Family Therapy and Mental Health Counseling", author: "Florida Board of Clinical Social Work, Marriage and Family Therapy and Mental Health Counseling", year: 2020, source: "Fla. Admin. Code R. 64B4-2.002" },
  { title: "Notification of Enforcement Discretion for Telehealth Remote Communications", author: "U.S. Department of Health and Human Services, Office for Civil Rights", year: 2020, source: "HHS.gov" },
];

// ═══ COURSE DATA ═══
const COURSE_DATA = {
  slug: "telehealth-fl-456-47-64b4",
  title: "Telehealth for Florida Mental Health Professionals",
  subtitle: "Florida Statute 456.47 & Rule 64B4 • Telehealth CE",
  description: "This 3-hour continuing education course provides Florida-licensed mental health professionals with the knowledge needed to deliver telehealth in compliance with Florida Statute §456.47, F.A.C. 64B4-6.001, and F.A.C. 64B4-2.002. Covers HIPAA compliance, informed consent (including the audio-only exclusion), clinical assessment adaptations, and Florida's distinctive out-of-state registration and client-location framework.",
  courseCode: "CR-TMH603-FL",
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
    "Define telehealth under Florida Statute §456.47, including its explicit exclusion of audio-only telephone calls, email, and facsimile transmissions.",
    "Evaluate telehealth platforms against HIPAA compliance requirements, including encryption standards, Business Associate Agreement provisions, and the public-facing/non-public-facing distinction.",
    "Develop a telehealth informed consent document that satisfies Florida Statute §456.47's standard-of-care and out-of-state-registration disclosures alongside ACA ethical requirements.",
    "Apply the three-domain suitability framework (clinical, technological, environmental) to determine telehealth appropriateness for a given client, consistent with Florida's standard-of-care obligation.",
    "Apply the client-location rule and Florida's distinctive out-of-state provider registration pathway to determine authorization for Florida-located and out-of-state clients.",
    "Identify Florida's alternating continuing-education structure under F.A.C. 64B4-6.001(2)(b) and the registered-intern telehealth protocol requirements under F.A.C. 64B4-2.002.",
  ],

  targetAudience: [
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Licensed Mental Health Counselors (LMHC)",
    "Registered Interns (LCSW/LMFT/LMHC track)",
    "National Certified Counselors (NCC)",
  ],

  instructionalLevel: "Intermediate",

  categories: ["Telehealth", "Florida Requirements", "Professional Practice", "Clinical Skills"],
  tags: ["telehealth", "Florida", "456.47", "64B4-6.001", "64B4-2.002", "HIPAA", "informed consent", "suitability screening", "client-location rule"],

  sections: [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5],

  assessment: {
    title: "Final Assessment: Telehealth for Florida Mental Health Professionals",
    passingScore: 80,
    maxAttempts: 3,
    instructions: "This assessment evaluates your understanding of Florida telehealth requirements, HIPAA compliance, informed consent, clinical assessment adaptations, and jurisdictional rules. You must score 80% or higher to receive CE credit. You have a maximum of 3 attempts.",
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
  console.log("\n📁 DEPLOY WORKSHEETS:");
  console.log("   Copy these files to client/public/downloads/ in your GitHub repo:");
  console.log("   - CR-TMH603_FL_456-47_Consent.docx");
  console.log("   - CR-TMH603_FL_Suitability_Screening.docx");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
