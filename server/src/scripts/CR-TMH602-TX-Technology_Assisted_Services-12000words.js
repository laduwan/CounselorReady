/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// CR-TMH602-TX-Technology_Assisted_Services-12000words.js
// Seed script for CounselorReady interactivecourses collection.
// ADDITIVE ONLY — derived from CR-TMH601 (server/src/scripts/seedCR-TMH601-Batch1-Sections1to4.js
// and seedCR-TMH601-Batch2to4-Sections5to13.js), which hold TMH601's real learner-visible prose.
// Does NOT modify CR-TMH601, its slug, or its templates.
// Deploy: node server/src/scripts/CR-TMH602-TX-Technology_Assisted_Services-12000words.js
// Requires: MONGODB_URI environment variable
//
// ─────────────────────────────────────────────────────────────────────────────
// REGULATORY VERIFICATION STATUS (read before publishing)
// Primary-source verification (bhec.texas.gov, texreg.sos.state.tx.us,
// statutes.capitol.texas.gov) was blocked by this environment's egress policy.
// The citations below are corroborated via secondary search results (Cornell LII
// snippets, BHEC-adjacent summaries, Texas Occupations Code aggregators) but were
// NOT read directly from the primary source. Human legal/compliance review
// against the live BHEC LPC rulebook is REQUIRED before publish. Flagged with
// [VERIFY] inline where the exact subsection letter or effective date could not
// be confirmed against primary text.
//   - 22 TAC §681.140 (Requirements for Continuing Education): LPCs complete 24 CE
//     hours per renewal (6 ethics + 3 cultural diversity/competency); licensees who
//     provide technology-assisted services must complete 2 hours of CE specifically
//     in technology-assisted services. [VERIFY exact subsection letter + the
//     1/1/2018 effective date claimed in the build prompt]
//   - 22 TAC §681.41(e) (General Ethical Requirements): practice-standard
//     subsection for technology-assisted services — competence/client-protection,
//     confidentiality/duty-to-warn, impairment prohibition. [VERIFY subsection
//     letter against the live rulebook — "(e)" is corroborated by secondary
//     sources, not read directly]
//   - Texas Occupations Code Chapter 111 (Telemedicine, Teledentistry, and
//     Telehealth): §111.001 definitions, §111.002 informed consent, §111.003
//     confidentiality — corroborated via Justia/texas.public.law mirrors.
//   - Texas Counseling Compact: NOT YET enacted as of the most recent search
//     (2023 session bills HB2557/SB1100/HB5289 did not pass). Status changes
//     year to year — verify current status before publish.
// ─────────────────────────────────────────────────────────────────────────────
//
// SECTION BANNER KEYWORDS (Pexels) — for the course-builder's banner button.
// bannerImage is intentionally left unset below; a human uses the builder's
// Pexels banner button with these keywords after import.
//   Section 1: "online therapy video session"
//   Section 2: "laptop cybersecurity privacy"
//   Section 3: "signing consent document"
//   Section 4: "supportive phone conversation"
//   Section 5: "texas state map"

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ No MONGODB_URI environment variable set");
  process.exit(1);
}

// ═══ SECTION 1: Foundations — What Technology-Assisted Services Are ═══
const SECTION_1 = {
  title: "Foundations of Technology-Assisted Counseling Services",
  order: 1,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 1,
      title: "Section 1",
      subtitle: "Foundations of Technology-Assisted Counseling Services",
      bannerAlt: "Clinician conducting a technology-assisted counseling session via laptop with client visible on screen",
    },
    {
      type: "text",
      content: `<h2>The Historical Arc of Distance-Based Mental Health Services</h2>
<p>The delivery of mental health services through electronic communication technologies represents one of the most significant paradigm shifts in the history of the counseling profession. While many clinicians associate what Texas rule calls "technology-assisted services" with the rapid adoption forced by the COVID-19 pandemic beginning in March 2020, the conceptual and practical foundations of distance-based therapeutic intervention extend back more than six decades, rooted in early experiments with telecommunications technology that preceded the internet by several generations.</p>
<p>The first documented use of telecommunication technology for psychiatric consultation occurred in 1959 at the Nebraska Psychiatric Institute, where clinicians utilized closed-circuit television to provide group therapy, long-term therapy, and consultation-liaison services to patients at Norfolk State Hospital, located approximately 112 miles away. This pioneering effort, led by Dr. Cecil Wittson, demonstrated that meaningful therapeutic interactions could occur through a video medium, challenging the prevailing assumption that physical co-presence was an absolute prerequisite for effective mental health treatment. The Nebraska project continued for over a decade, producing some of the earliest empirical data on the feasibility and acceptability of technology-mediated psychiatric services (Wittson et al., 1961).</p>
<p>Throughout the 1960s and 1970s, additional pilot programs emerged, most notably at Massachusetts General Hospital, where Dr. Thomas Dwyer and colleagues established a microwave-based television link between the hospital and a medical station at Boston Logan International Airport. This system, operational from 1968 through the mid-1970s, provided psychiatric consultations to travelers and airport employees, demonstrating the practical utility of telemedicine in addressing mental health needs in nontraditional settings (Dwyer, 1973). These early programs established several foundational principles that continue to guide technology-assisted practice today: the importance of technology reliability, the need for clinician training in the medium, and the recognition that therapeutic rapport can develop through electronic communication.</p>
<p>The emergence of the internet in the 1990s catalyzed a transformation in the possibilities for distance-based mental health services. Email-based therapeutic exchanges, online support groups, and eventually text-based chat counseling expanded the modalities through which clinicians could reach clients. However, bandwidth limitations and the absence of affordable videoconferencing technology constrained the growth of synchronous video-based teletherapy throughout this period. It was not until the widespread availability of broadband internet access in the 2000s, combined with the development of consumer-grade videoconferencing platforms, that synchronous video-based technology-assisted services became a practical reality for independent practitioners and community mental health agencies.</p>
<h2>Defining Technology-Assisted Services: Terminology and Scope</h2>
<p>The terminology surrounding technology-mediated mental health services has evolved considerably and remains a source of some confusion within the profession. Multiple terms circulate in professional literature, regulatory documents, and colloquial usage, often with overlapping but distinct meanings. Establishing definitional clarity is essential for Texas-licensed clinicians seeking to practice competently and in compliance with the rules of the Texas Behavioral Health Executive Council (BHEC), the umbrella agency housing the Texas State Board of Examiners of Professional Counselors.</p>
<p>Texas Occupations Code Chapter 111 (Telemedicine, Teledentistry, and Telehealth) defines a "telehealth service" as a health service, other than a telemedicine medical service, delivered by a health professional licensed, certified, or otherwise entitled to practice in Texas — acting within the scope of that license, certification, or entitlement — to a patient at a different physical location than the health professional, using telecommunications or information technology (Tex. Occ. Code §111.001). This statutory definition is the umbrella under which the LPC-specific rules of 22 TAC Chapter 681 operate; Texas counseling rules use the term "technology-assisted services" to describe the same category of practice specifically as it applies to licensed professional counselors.</p>
<p>For the purposes of this course, "technology-assisted services" and "telemental health" are used to describe all technology-mediated mental health services delivered by Texas-licensed professional counselors and related mental health professionals. When discussing specific modalities such as synchronous video sessions, telephone sessions, or asynchronous interventions, those terms will be specified explicitly.</p>
<blockquote><p><strong>Clinical Vignette:</strong> Dr. Martinez, a Texas-licensed LPC with 15 years of in-person practice experience, transitioned to technology-assisted services during the COVID-19 pandemic. Despite her extensive clinical expertise, she initially struggled with managing therapeutic presence through a screen, navigating technology troubleshooting during sessions, and adapting her signature experiential interventions for virtual delivery. After completing the Texas-mandated 2-hour technology-assisted services continuing education requirement and pursuing additional voluntary training, she reported that her sessions became significantly more effective, noting that specific techniques such as camera positioning, intentional use of voice modulation, and structured technology orientation for new clients transformed the quality of her virtual practice.</p></blockquote>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Synchronous Video-Based Therapy",
          content: `<p>The modality most closely approximating face-to-face counseling. Clients and clinicians connect through HIPAA-compliant videoconferencing platforms in real time, enabling visual and auditory communication. Supports observation of nonverbal cues, facial expressions, and environmental context, though with limitations related to camera angle, screen size, and bandwidth. This is the most extensively researched and regulated form of technology-assisted service delivery.</p>`,
        },
        {
          title: "Telephone-Based Counseling",
          content: `<p>Therapeutic services through voice-only communication. Has a substantial evidence base and remains critical for clients who lack reliable internet, experience video-related anxiety, or present with conditions where video may be contraindicated (social anxiety disorder, body dysmorphic disorder). Crisis counseling has relied on telephone intervention for decades, with many evidence-based protocols developed specifically for this modality.</p>`,
        },
        {
          title: "Asynchronous Text-Based Therapy",
          content: `<p>Therapeutic exchanges through secure messaging platforms where communication does not occur in real time. Clients compose messages; therapists respond within 24-48 hours. Offers unique advantages including reflective composition, a written therapeutic record clients can revisit, and scheduling flexibility. Platforms like BetterHelp and Talkspace popularized this modality, though it generates ongoing professional debate regarding efficacy and boundary management.</p>`,
        },
        {
          title: "Technology-Assisted Therapeutic Tools",
          content: `<p>Includes mobile applications, virtual reality environments, biofeedback devices, and other technologies that supplement therapeutic interventions. May be used within synchronous sessions or as between-session supports. Examples: mindfulness apps prescribed as homework, VR exposure therapy for anxiety, and home-based biofeedback devices for self-regulation skills.</p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>The Evidence Base for Technology-Assisted Service Efficacy</h2>
<p>A robust and growing body of empirical research supports the clinical efficacy of technology-assisted mental health services across multiple treatment modalities, presenting concerns, and client populations. Understanding this evidence base is essential for clinicians seeking to practice with confidence in the virtual environment and to communicate the value of these services to clients, payers, and regulatory bodies.</p>
<p>Meta-analytic research has consistently demonstrated equivalence between technology-assisted and in-person service delivery for a range of presenting concerns. Hilty et al. (2013) conducted a comprehensive review of over 150 studies and concluded that telemental health achieves comparable outcomes to face-to-face care across diverse populations and settings, with particularly strong evidence in the treatment of depression, anxiety disorders, and post-traumatic stress disorder. More recently, Batastini et al. (2021) published a meta-analysis of randomized controlled trials comparing video-based therapy to in-person therapy and found no significant differences in treatment outcomes, therapeutic alliance, or client satisfaction across studies.</p>
<p>Specific evidence-based treatments have been adapted and validated for delivery via technology-assisted services. Cognitive-behavioral therapy (CBT) has been studied extensively in this context, with multiple randomized controlled trials demonstrating equivalent or superior outcomes compared to in-person CBT for depression (Thase et al., 2020), anxiety disorders (Andrews et al., 2018), and insomnia (Luik et al., 2017). Exposure-based treatments, initially thought to be poorly suited to virtual delivery, have shown strong efficacy in virtual formats, including prolonged exposure therapy for PTSD (Acierno et al., 2017) and exposure and response prevention for obsessive-compulsive disorder (Wootton, 2016). Dialectical behavior therapy (DBT) skills groups have been successfully conducted via technology-assisted delivery, with preliminary evidence suggesting comparable skill acquisition and symptom reduction (Lakeman & Crighton, 2021) — the teaching component adapts well using screen-sharing, and diary cards can be maintained digitally. EMDR bilateral stimulation, once thought to require in-person delivery, has been adapted for virtual formats through therapist-guided eye movements via video screen, client self-administered butterfly-hug tapping, and technology-assisted bilateral stimulation applications; the one adaptation that does not transfer is a therapist physically guiding the client's eye movements, which requires in-person contact (Lenferink, Meyerbröker, & Boelen, 2020). Beyond individual psychotherapy, technology-assisted services have demonstrated effectiveness for psychiatric medication management, group therapy, couples and family therapy, substance use disorder treatment, and crisis intervention services, providing a broad evidentiary foundation for the continued integration of these services into standard mental health practice.</p>
<h3>Competency Standards for Technology-Assisted Practitioners</h3>
<p>As technology-assisted practice has matured from an emergency adaptation to a permanent component of mental health service delivery, professional organizations have increasingly articulated specific competency standards for clinicians who provide virtual services. These standards represent an evolving professional consensus about the knowledge, skills, and attitudes necessary for competent practice and provide a framework for both self-assessment and formal credentialing.</p>
<p>The Board-Certified TeleMental Health (BC-TMH) credential, developed by the Center for Credentialing and Education (CCE), a subsidiary of the National Board for Certified Counselors (NBCC), identifies nine core competency domains: the legal, ethical, and regulatory framework of telemental health; evidence-based telehealth clinical practices; the technology of telemental health; dispositions and telepresence; cultural competence and diversity in telehealth; documentation and administrative procedures specific to telehealth; telepractice development; standards of telepractice; and research and trends in telemental health. Together, these nine domains define a comprehensive scope of knowledge that extends well beyond basic clinical competence to encompass the unique demands of technology-mediated practice.</p>
<p>The Telebehavioral Health Institute (TBHI) has developed a similar competency framework that organizes competencies into foundational knowledge areas and applied practice skills. Both frameworks emphasize that competence in technology-assisted services is not a natural extension of in-person clinical competence but a distinct set of skills that requires specialized training and ongoing development — the foundation for why Texas rule requires dedicated continuing education in this domain, discussed later in this course.</p>
<h2>Disparities in Technology-Assisted Service Adoption</h2>
<p>While aggregate data on adoption paint a picture of rapid and widespread growth, these aggregate figures mask significant disparities in both provider adoption and client access. Understanding these disparities is essential for clinicians who aim to provide equitable and accessible virtual services, as unexamined assumptions about universal technology access can inadvertently reproduce and amplify existing inequities in mental health service delivery.</p>
<p>Client access to technology-assisted services is shaped by the intersection of multiple social determinants, including income, education, race, ethnicity, age, disability status, geographic location, immigration status, and language proficiency. The Pew Research Center has documented persistent disparities in broadband access and smartphone ownership across these demographic categories, with lower-income households, older adults, rural residents, and racial and ethnic minority groups consistently reporting lower rates of technology access and digital literacy. These disparities have clinical consequences: clients who cannot access technology-assisted services may experience delayed or interrupted care, exacerbation of symptoms, and deterioration in functioning. In Texas, this disparity is particularly acute in West Texas, the Rio Grande Valley, and other rural regions where broadband infrastructure lags behind the state's major metropolitan corridors.</p>
<h2>Technology-Assisted Services and the Scope of Practice Continuum</h2>
<p>The integration of technology-assisted delivery into mental health practice raises important questions about scope of practice that clinicians must address thoughtfully. Scope of practice defines the boundaries of professional activity for licensed practitioners, specifying what services a practitioner is qualified and authorized to provide. Modality competence refers to the clinician's skills and training in delivering services through specific technology modalities. A clinician who is highly competent in face-to-face individual therapy may not be equally competent in delivering the same therapy through video, and the transition between modalities should be accompanied by appropriate training, supervision, or consultation. The same principle applies to asynchronous text-based therapy, telephone counseling, and technology-assisted interventions, each of which demands distinct skills and clinical adaptations. The ethical principle of competence requires clinicians to practice within the boundaries of their competence and to seek training, supervision, or referral when a situation demands skills or knowledge beyond their current capabilities.</p>
<p>Population competence refers to the clinician's knowledge and skills in serving specific client populations through virtual modalities. A clinician who is competent in providing in-person services to children may not be automatically competent in providing technology-assisted services to children, as the virtual environment introduces developmental, behavioral, and logistical considerations that differ from in-person practice. Similarly, a clinician experienced in individual therapy may not possess the group facilitation skills needed for virtual group therapy, or the family systems knowledge needed for virtual family therapy. Honest self-assessment of population-specific competence is essential for ethical practice, and is a routine part of the peer consultation and supervision process for Texas clinicians building out a technology-assisted practice.</p>
<p>Provider adoption of technology-assisted services also varies by discipline, practice setting, geographic location, and clinician demographics. Research conducted during and after the COVID-19 pandemic revealed that psychiatrists and psychologists adopted virtual delivery at higher rates than counselors and social workers, urban providers adopted at higher rates than rural providers, and providers in private practice settings adopted more readily than those in community mental health centers and hospital-based settings. These adoption disparities have implications for clients served by different provider types and in different settings, as clients whose providers have not adopted technology-assisted delivery may face reduced access to care during periods when in-person services are disrupted — a consideration of particular relevance in a state as geographically large as Texas, where travel distances to the nearest in-person provider can be substantial.</p>
<h2>The Neuroscience of Therapeutic Presence Through Screens</h2>
<p>Recent advances in interpersonal neuroscience have begun to illuminate the mechanisms through which therapeutic connection occurs and how these mechanisms operate in the technology-assisted environment. The concept of co-regulation, in which the nervous system of one individual influences and is influenced by the nervous system of another through interpersonal interaction, has significant implications for understanding the therapeutic process in both in-person and virtual settings. Porges's polyvagal theory posits that the human autonomic nervous system is organized into three hierarchical subsystems: the ventral vagal complex, which supports social engagement and connection; the sympathetic nervous system, which mobilizes fight-or-flight responses; and the dorsal vagal complex, which mediates immobilization and shutdown responses. In the therapeutic relationship, the clinician's calm, regulated nervous system state serves as a co-regulatory anchor that supports the client's capacity to access their own ventral vagal social engagement system.</p>
<p>The critical question for technology-assisted practice is whether these co-regulatory processes can operate effectively through a digital medium. Emerging research suggests that they can, though with some attenuation compared to in-person interaction. The auditory channel preserves prosodic information (vocal tone, rhythm, and inflection) that is central to ventral vagal activation. The visual channel preserves facial expression information, though with limitations related to camera angle, screen size, and potential latency. What is lost in the virtual medium is the full-body somatic resonance that occurs when two nervous systems occupy the same physical space, including the subtle proprioceptive and kinesthetic information that influences interpersonal attunement. Clinicians can compensate for these limitations by attending intentionally to the co-regulatory dimensions of their virtual presence: monitoring and regulating their own autonomic state before and during sessions, using deliberate prosodic techniques such as warm vocal tone and measured pacing, positioning the camera to maximize facial expressivity and eye contact, and creating a visual environment that conveys warmth, safety, and professionalism.</p>
<h2>International Perspectives — A Boundary Consideration</h2>
<p>While this course focuses on Texas-specific requirements, clinicians should be aware that American licensure does not authorize practice in foreign countries, and the legal framework for cross-national technology-assisted services is largely undefined. Clinicians whose Texas-based clients travel internationally should establish clear policies regarding service provision during international travel and should consult with legal counsel regarding the legal risks and options associated with cross-national virtual practice — the client-location principle discussed in Section 5 of this course applies with even greater force, and less regulatory clarity, once a client crosses an international border.</p>
`,
    },
    {
      type: "matching",
      matchingInstructions: "Match each term to its correct definition.",
      matchingPairs: [
        { term: "Technology-Assisted Services", definition: "Texas counseling-rule term for mental health services delivered via telecommunications technology" },
        { term: "Telehealth Service (Tex. Occ. Code §111.001)", definition: "A health service, other than telemedicine, delivered by a licensed health professional to a patient at a different physical location using telecommunications or information technology" },
        { term: "Teletherapy", definition: "Psychotherapy specifically delivered through synchronous video or audio connections" },
        { term: "Telepsychology", definition: "Psychological services delivered via telecommunications, as defined by the APA (2013)" },
        { term: "BC-TMH", definition: "Board-Certified TeleMental Health credential — nine competency domains, offered by CCE/NBCC" },
      ],
    },
    {
      type: "reflection",
      question: "Reflect on your own transition to technology-assisted services. What competency gaps did you discover when you first began providing virtual services? What resources or training helped you address those gaps? What areas still need development?",
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
      question: "Under Texas Occupations Code §111.001, a \"telehealth service\" is defined as a health service delivered by:",
      options: [
        { text: "Any individual regardless of licensure, using video software", isCorrect: false },
        { text: "A health professional licensed, certified, or otherwise entitled to practice in Texas, acting within scope, to a patient at a different physical location using telecommunications or information technology", isCorrect: true },
        { text: "A telemedicine medical service only, exclusive of mental health services", isCorrect: false },
        { text: "An out-of-state provider without Texas registration", isCorrect: false },
      ],
      explanation: "Texas Occupations Code §111.001 defines a telehealth service as a health service, other than a telemedicine medical service, delivered by a licensed health professional acting within scope to a patient at a different physical location, using telecommunications or information technology.",
    },
  ],
};

// ═══ SECTION 2: HIPAA Compliance and Technology Infrastructure (universal — reused verbatim from CR-TMH601 Section 3) ═══
const SECTION_2 = {
  title: "HIPAA Compliance and Technology Infrastructure",
  order: 2,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 2,
      title: "Section 2",
      subtitle: "HIPAA Compliance and Technology Infrastructure",
      bannerAlt: "Laptop screen showing a lock icon over a secure video call, representing telehealth cybersecurity",
    },
    {
      type: "text",
      content: `<h2>Understanding HIPAA in the Technology-Assisted Services Context</h2>
<p>The Health Insurance Portability and Accountability Act of 1996 (HIPAA) provides the regulatory backbone for privacy and security in healthcare, and its requirements take on particular significance in the technology-assisted services environment where clinical information traverses digital networks and is stored on electronic devices. For Texas mental health practitioners, HIPAA compliance is not a one-time achievement but an ongoing practice that requires vigilance, documentation, and periodic reassessment as technology evolves and practice patterns change. HIPAA does not specifically address technology-assisted services as a distinct service delivery modality; rather, its Privacy Rule, Security Rule, and Breach Notification Rule apply equally to health information transmitted or maintained through any medium, including electronic communications used in virtual sessions.</p>
<p>The HIPAA Privacy Rule establishes standards for the use and disclosure of protected health information (PHI) by covered entities, which include most healthcare providers who transmit health information electronically. The minimum necessary standard requires that clinicians limit the PHI they access, use, or disclose to the minimum amount needed to accomplish the intended purpose — a principle with direct implications for screen sharing, recording practices, and the storage of session-related communications in technology-assisted practice.</p>
<h2>The Business Associate Agreement Requirement</h2>
<p>One of the most critical and frequently misunderstood elements of HIPAA compliance in technology-assisted practice is the Business Associate Agreement (BAA) requirement. Under HIPAA, a business associate is any entity that creates, receives, maintains, or transmits PHI on behalf of a covered entity. The platform vendor through which sessions are conducted is typically classified as a business associate because the platform transmits PHI — the audiovisual content of therapy sessions and any associated data.</p>
<p>The BAA is a legally binding contract between the covered entity (the clinician or practice) and the business associate (the platform vendor) that establishes the permitted and required uses and disclosures of PHI by the business associate, provides that the business associate will not use or further disclose PHI other than as permitted by the agreement, requires the business associate to implement appropriate safeguards to protect PHI, and establishes procedures for reporting security incidents and data breaches. A clinician who conducts sessions through a platform that has not executed a BAA is in violation of HIPAA, regardless of whether a breach actually occurs. This requirement effectively eliminates consumer-grade communication platforms such as standard Skype, FaceTime, Facebook Messenger, Google Hangouts, and consumer Zoom from consideration as service delivery vehicles unless those platforms offer healthcare-specific versions with BAA availability.</p>
<p>During the COVID-19 public health emergency, the Office for Civil Rights (OCR) within the Department of Health and Human Services exercised enforcement discretion and announced that it would not impose penalties for HIPAA violations related to the good-faith provision of telehealth services through non-public-facing audio or video communication products. This enforcement discretion was temporary and expired May 11, 2023; the full requirements of HIPAA, including the BAA mandate, have been fully reinstated.</p>
<h2>Three Categories of HIPAA Safeguards</h2>
<p>The three primary HIPAA rules relevant to technology-assisted practice are the Privacy Rule, the Security Rule, and the Breach Notification Rule. The Security Rule specifically addresses the safeguarding of electronic PHI through three categories of safeguards: administrative, physical, and technical. The Breach Notification Rule establishes requirements for notifying affected individuals, the Department of Health and Human Services, and in some cases the media, when a breach of unsecured PHI occurs.</p>
<h2>Administrative Safeguards for Solo and Small Group Practices</h2>
<p>Administrative safeguards encompass the policies, procedures, and organizational structures that a practice implements to manage the selection, development, implementation, and maintenance of security measures. For solo practitioners and small group practices, which constitute the majority of technology-assisted service providers, administrative safeguards include the designation of a security officer responsible for developing and implementing HIPAA security policies, the completion of a risk analysis to identify vulnerabilities in the practice's electronic systems and workflows, the development of a risk management plan to address identified vulnerabilities, the implementation of workforce training programs to ensure that all employees with access to ePHI understand their security responsibilities, and the creation of contingency plans for responding to data breaches, natural disasters, or technology failures that could compromise ePHI.</p>
<p>The risk analysis requirement deserves particular emphasis because it is both the most fundamental and the most frequently neglected administrative safeguard. A risk analysis involves a systematic examination of all systems and processes that create, receive, maintain, or transmit ePHI to identify threats and vulnerabilities that could result in unauthorized access, use, disclosure, modification, or destruction of ePHI. The risk analysis should be documented in writing, reviewed and updated periodically, and revised whenever significant changes occur in the practice's technology environment.</p>
<h2>Physical Safeguards for the Virtual Office</h2>
<p>Physical safeguards address the protection of electronic information systems and related equipment from natural and environmental hazards and unauthorized intrusion. Clinicians conducting technology-assisted sessions from a home office must ensure that the space provides adequate visual and auditory privacy. This means that family members, roommates, or visitors should not be able to see the computer screen during sessions or overhear session content. The use of a dedicated room with a locking door is strongly recommended.</p>
<p>Device security is a critical component of physical safeguards. Laptops, tablets, and smartphones used for technology-assisted services should be password-protected with strong passwords that are changed periodically, configured to auto-lock after a brief period of inactivity, encrypted using full-disk encryption, maintained with current operating system and security updates, protected by current antivirus and anti-malware software, and physically secured when not in use, particularly in shared living environments.</p>
<h2>Technical Safeguards and Encryption Requirements</h2>
<p>Technical safeguards are the technology-based mechanisms that a practice uses to control access to ePHI and to protect ePHI during transmission over electronic networks. Access controls ensure that only authorized individuals can access ePHI. In this context, this means implementing unique user identification for each individual who accesses the platform or EHR, requiring strong passwords or multi-factor authentication, establishing automatic logoff procedures, and implementing encryption and decryption mechanisms.</p>
<p>Encryption is arguably the single most important technical safeguard in technology-assisted practice. Encryption converts readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and an encryption key. Encryption must be applied both to data in transit and to data at rest. End-to-end encryption (E2EE) is the gold standard: data is encrypted on the sending device and decrypted only on the receiving device, meaning that even the platform vendor cannot access the unencrypted content of the communication. The Advanced Encryption Standard with 256-bit key length (AES-256) is the current encryption standard recommended by the National Institute of Standards and Technology (NIST) for healthcare data.</p>
`,
    },
    {
      type: "accordion",
      accordionItems: [
        {
          title: "Administrative Safeguards",
          content: `<p>Policies, procedures, and organizational structures for security management. For solo/small practices: designate a security officer, complete a risk analysis to identify vulnerabilities, develop a risk management plan, implement workforce training, and create contingency plans for breaches and tech failures. The risk analysis is the most fundamental and most frequently neglected safeguard.</p>`,
        },
        {
          title: "Physical Safeguards",
          content: `<p>Protection of electronic systems and equipment. In home-based practice: ensure visual and auditory privacy (dedicated room with locking door), use privacy screens, employ noise-masking devices, schedule sessions when others are absent. Device security: password protection, auto-lock, full-disk encryption (BitLocker/FileVault), current security updates, antivirus software, physical security when not in use.</p>`,
        },
        {
          title: "Technical Safeguards",
          content: `<p>Technology-based access controls and transmission security. Key elements: unique user IDs, multi-factor authentication, automatic logoff, encryption (AES-256 for data at rest, E2EE for data in transit). End-to-end encryption (E2EE) is the gold standard — data encrypted on sending device, decrypted only on receiving device. Even the platform vendor cannot access content.</p>`,
        },
      ],
    },
    {
      type: "text",
      content: `<h2>Essential Components of the Technology Stack</h2>
<p>The core components of a technology-assisted services stack typically include a videoconferencing platform for synchronous sessions, an electronic health record system for clinical documentation, a scheduling system for appointment management, a billing system for claims processing, a secure messaging platform for between-session client communication, cloud storage for document management, and internet connectivity infrastructure. Each component must individually meet HIPAA requirements, and the data flows between components must be secured.</p>
<p>When evaluating platforms, clinicians should assess several critical features. The platform must offer end-to-end or at minimum transport-layer encryption for all audio, video, and data transmissions. The vendor must be willing to execute a Business Associate Agreement (BAA). The platform should provide a virtual waiting room feature that prevents clients from entering a session before the clinician admits them. Recording capabilities should be controllable by the clinician, not automatically enabled by the platform. A comprehensive platform evaluation should assess candidates across security and compliance, clinical functionality, client accessibility, reliability and performance, and cost structure; at minimum, an acceptable platform must offer TLS 1.2 or higher encryption of data in transit, a signed BAA, SOC 2 Type II compliance or an equivalent certification, role-based access controls, and audit logging of system access and events. Clinicians should request and review the vendor's SOC 2 report and incident response procedures before finalizing a selection, and should evaluate data residency practices and the vendor's business continuity planning, since a vendor that ceases operations or suffers a significant breach can disrupt clinical services and compromise confidentiality.</p>
<h2>Network Security for Home-Based Practice</h2>
<p>The majority of practitioners conduct sessions from home offices using residential internet connections not originally designed with healthcare security requirements in mind. Securing the home network requires configuring the wireless router with WPA3 encryption (or WPA2 at minimum), changing the default administrator password to a strong, unique password, and establishing a separate guest network for non-clinical devices — isolating clinical traffic from general household internet use. A Virtual Private Network (VPN) adds an additional layer of security by encrypting all internet traffic from the clinician's device, which is particularly important when conducting sessions from a location other than the primary home office. Firewall configuration, both at the router level and on individual devices, provides an additional layer by blocking unauthorized incoming connections and monitoring outgoing traffic for suspicious patterns.</p>
<h2>Email and Messaging Security</h2>
<p>Between-session communication with clients through email or messaging platforms presents significant HIPAA compliance challenges. Standard email protocols do not provide end-to-end encryption, meaning email content may be accessible at multiple points during transmission and storage; using standard consumer email services to communicate clinical information — including session summaries, assessment results, or appointment confirmations that identify the client as a mental health client — creates HIPAA compliance risk. The preferred approach is a secure client portal integrated with the practice's EHR system, which provides encrypted messaging within a HIPAA-compliant environment. When clients initiate contact through unsecured channels, clinicians should limit their responses to scheduling logistics and avoid including clinical content in the reply. Standard SMS text messaging presents similar challenges, as messages are not encrypted and can be intercepted, stored by mobile carriers, or accessed through device backups; a clear communication policy, included in the informed consent document, should specify the channels through which clinical communication will and will not occur.</p>
<h2>Evaluating Specific Platform Options</h2>
<p>Several platforms have emerged as leading options for HIPAA-compliant delivery. Doxy.me is a browser-based platform specifically designed for healthcare providers; its free tier offers HIPAA-compliant videoconferencing with a BAA and requires no client-side download. Zoom for Healthcare is the HIPAA-compliant version of the widely used Zoom videoconferencing platform, including a BAA, end-to-end encryption (when enabled), waiting room functionality, host-controlled recording, and screen sharing — it is NOT the same product as consumer Zoom, which lacks a BAA. SimplePractice, TherapyNotes, and Jane App are integrated practice management platforms that combine videoconferencing with EHR, scheduling, billing, and secure messaging in a single system, consolidating ePHI within a single BAA-covered vendor relationship.</p>
<h2>Emerging Cybersecurity Threats in Healthcare</h2>
<p>The healthcare sector has become one of the most targeted industries for cyberattacks, driven by the high value of healthcare data on illicit markets. Ransomware attacks, in which malicious software encrypts an organization's data and demands payment for the decryption key, have increased dramatically in the healthcare sector; the average cost of a healthcare ransomware attack, including ransom payments, system downtime, recovery costs, and regulatory penalties, exceeded $1.5 million in 2023. Prevention strategies include maintaining current software updates and security patches, implementing robust backup systems with offline or air-gapped copies, training all staff and family members with device access to recognize phishing attempts, and deploying endpoint detection and response (EDR) solutions.</p>
<p>Credential theft attacks, including phishing, credential stuffing, and brute-force password attacks, target the login credentials of healthcare providers to gain unauthorized access to clinical systems. Multi-factor authentication is the single most effective defense against credential theft, as it requires a second verification factor in addition to the password, making stolen credentials alone insufficient for unauthorized access.</p>
<h2>Cloud Storage and Data Lifecycle Management</h2>
<p>The storage and management of clinical data in the cloud introduces both convenience and complexity. Cloud-based storage services offer automatic backup, device-independent access, and disaster recovery, but not all cloud storage services are suitable for storing PHI: consumer-grade services such as personal Dropbox, Google Drive, and iCloud do not provide BAAs and therefore cannot be used for PHI storage in a HIPAA-compliant manner, while enterprise and healthcare-specific tiers of these services may offer BAAs and enhanced security features that make them appropriate. When evaluating cloud storage, clinicians should assess encryption standards for data at rest and in transit, the physical location of data centers (data should be stored within the United States unless international storage is specifically authorized and disclosed), the vendor's data retention and deletion policies, and the terms of the BAA, including indemnification provisions and termination procedures.</p>
<p>Data lifecycle management encompasses the creation, storage, access, sharing, archiving, and eventual destruction of clinical data — including data generated by the technology-assisted-services platform, clinical documentation stored in the EHR, communications exchanged through secure messaging systems, and assessment data collected through electronic administration. Each category of data should be subject to defined retention schedules, access controls, and destruction procedures that comply with state law, HIPAA requirements, and professional ethical standards. Backup plans, which HIPAA requires as part of the administrative safeguards' contingency-plan provision, should specify what data is backed up, how frequently, where it is stored (offsite or cloud-based storage protects against physical disasters), how it is encrypted, and how regularly backup restoration is tested, since untested backups provide false assurance.</p>
<h2>Advanced Technical Safeguards</h2>
<p>Beyond the foundational technical safeguards of encryption, access controls, and audit logging, practitioners should be aware of advanced security measures that provide additional protection for clinical data. Zero-trust architecture represents a security paradigm that assumes no user, device, or network should be inherently trusted, even if they are within the organization's network perimeter. Under a zero-trust model, every access request is verified through multiple authentication factors, access is granted on a least-privilege basis, and all network traffic is monitored and logged regardless of its origin. While full zero-trust implementation is typically associated with larger organizations, solo and small group practices can adopt elements of the zero-trust approach by implementing multi-factor authentication on all systems, limiting administrative access to essential functions, and monitoring access logs for anomalous activity.</p>
<p>Data loss prevention (DLP) technologies monitor data flows within an organization to detect and prevent unauthorized transmission or extraction of sensitive information. DLP tools can identify PHI within emails, file transfers, and other communications and block or flag transmissions that violate security policies. Cloud-based DLP solutions are available at price points accessible to smaller practices. Security information and event management (SIEM) systems aggregate log data from multiple sources and use correlation rules and analytics to identify potential security incidents; cloud-based SIEM services offer simplified security monitoring that can alert practitioners to suspicious activity such as failed login attempts or unusual access patterns.</p>
<h2>Implementing a HIPAA Compliance Program</h2>
<p>A comprehensive HIPAA compliance program encompasses policies, procedures, training, documentation, and ongoing monitoring that together ensure the practice meets its obligations under the Privacy Rule, Security Rule, and Breach Notification Rule. For solo practitioners, the compliance program need not be elaborate, but it must address the core requirements in a documented and systematic manner, including a written set of HIPAA policies tailored to the specific practice environment, workforce training documented with completion records for anyone with access to PHI, and retention of the risk analysis, risk management plan, written policies, training records, business associate agreements, and incident/breach logs for at least six years from the date of creation or the date the document was last in effect, whichever is later, as required by HIPAA.</p>
<h2>Reimbursement and Billing Considerations</h2>
<p>The financial viability of a technology-assisted-services practice depends significantly on payer reimbursement policies, which vary across Medicare, Medicaid, commercial insurance carriers, and self-pay arrangements. Medicare reimbursement for telehealth mental health services underwent transformative changes during and after the COVID-19 pandemic: the Consolidated Appropriations Act of 2021 and subsequent legislation permanently removed the originating-site requirement for mental health services, allowing Medicare beneficiaries to receive telehealth counseling and psychotherapy from their homes. Medicare reimburses telehealth mental health services at the same rate as in-person services, using the same CPT codes with the addition of modifier 95 to indicate that the service was delivered via synchronous telehealth.</p>
<p>Proper billing for technology-assisted services requires attention to elements that differ from in-person billing. The use of correct place-of-service codes is critical: POS 02 indicates that the service was delivered to a patient in their home, while POS 10 indicates an originating site. Commercial insurance payers have adopted varying policies regarding coverage, and reimbursement rates, covered services, eligible modalities (video only versus video and telephone), and documentation requirements vary across carriers and across plans within carriers — clinicians should verify coverage and reimbursement parameters with each payer, including Texas Medicaid managed-care organizations, before initiating services to avoid claim denials.</p>
<p>Common billing pitfalls include failing to verify client identity and location at the beginning of each session, billing for telephone-only sessions using codes that require audiovisual communication, providing services to clients physically located in states where the clinician is not licensed and submitting claims referencing a Texas address, and failing to document the specific modality used (synchronous video, telephone, asynchronous) in the clinical record. Each of these errors can result in claim denial, overpayment recoupment, or, in serious cases, allegations of fraud.</p>
`,
    },
    {
      type: "cardSort",
      instructions: "Sort each platform or practice into whether it satisfies HIPAA requirements for technology-assisted services.",
      categories: ["HIPAA-Compliant for Clinical Use", "NOT HIPAA-Compliant for Clinical Use"],
      cards: [
        { id: "tx-cs-1", text: "Doxy.me (with signed BAA)", correctCategory: "HIPAA-Compliant for Clinical Use" },
        { id: "tx-cs-2", text: "Zoom for Healthcare (with BAA, E2EE enabled)", correctCategory: "HIPAA-Compliant for Clinical Use" },
        { id: "tx-cs-3", text: "SimplePractice / TherapyNotes / Jane App", correctCategory: "HIPAA-Compliant for Clinical Use" },
        { id: "tx-cs-4", text: "Consumer Zoom (standard free version, no BAA)", correctCategory: "NOT HIPAA-Compliant for Clinical Use" },
        { id: "tx-cs-5", text: "Personal Gmail account for appointment reminders with client names", correctCategory: "NOT HIPAA-Compliant for Clinical Use" },
        { id: "tx-cs-6", text: "Facebook Live or other public-facing livestream platforms", correctCategory: "NOT HIPAA-Compliant for Clinical Use" },
      ],
      explanation: "HIPAA-compliant use requires a signed BAA, non-public-facing architecture, and encryption controlled by the clinician — not merely a familiar consumer app.",
    },
    {
      type: "callout",
      calloutType: "donot",
      title: "Public-Facing Platforms Are Never Appropriate for Clinical Content",
      content: "<p>Federal HHS Office for Civil Rights (OCR) guidance distinguishes <strong>public-facing</strong> video communication products (Facebook Live, Twitch, TikTok, and similar applications designed for open or indiscriminate audience access) from <strong>non-public-facing</strong> products (Zoom, Skype, FaceTime, Doxy.me) that by default admit only the intended participants. Only non-public-facing platforms — with a signed BAA — may be used for technology-assisted clinical services. This is a federal HIPAA/OCR principle, not a Texas-specific rule, but it applies fully to Texas practice.</p>",
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
      type: "reflection",
      question: "Conduct a mental inventory of every device and system that touches your client data: platform, EHR, email, scheduling, cloud storage, mobile devices, backup systems. For each, ask: Is it encrypted? Do I have a BAA? Who else has access? Where is your biggest vulnerability?",
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

// ═══ SECTION 3: Informed Consent and Documentation (adapted for Texas) ═══
const SECTION_3 = {
  title: "Informed Consent and Clinical Documentation",
  order: 3,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 3,
      title: "Section 3",
      subtitle: "Informed Consent and Clinical Documentation for Technology-Assisted Practice",
      bannerAlt: "Client signing an informed consent document on a tablet before a technology-assisted counseling session",
    },
    {
      type: "text",
      content: `<h2>The Enhanced Informed Consent Requirement</h2>
<p>Informed consent is a foundational ethical and legal requirement in all mental health practice, but delivery via technology-assisted services introduces a constellation of additional risks, limitations, and considerations that must be addressed in the consent process. The ACA Code of Ethics (2014, Section H) specifically addresses technology-assisted services and requires counselors to inform clients of the benefits and limitations of technology-assisted counseling, the potential for technology failure, alternative methods of service delivery, emergency procedures, time zone differences, and cultural and language considerations specific to virtual service delivery.</p>
<p>For Texas-licensed clinicians, this ethical obligation operates alongside two statutory requirements under Texas Occupations Code Chapter 111: <strong>§111.002</strong> requires that a health professional who provides or facilitates telehealth services ensure that the patient's informed consent (or the consent of another individual authorized to make treatment decisions) is obtained before services are provided, and <strong>§111.003</strong> requires that the confidentiality of the patient's medical information be maintained as required by Chapter 159 of the Texas Occupations Code (physician-patient communication confidentiality) or other applicable law. A comprehensive technology-assisted-services informed consent document should explicitly document both of these statutory elements alongside the ethical disclosures required by professional codes.</p>
<h2>Essential Elements of Technology-Assisted Services Informed Consent</h2>
<p>A thorough informed consent for technology-assisted services should address the following domains, each of which encompasses considerations that differ from or extend beyond those addressed in standard in-person consent documents.</p>
<p><strong>Nature of services:</strong> The consent should describe the specific modalities through which services will be delivered (synchronous video, telephone, asynchronous messaging, or a combination), the technology platform or platforms that will be used, and the ways in which technology-assisted services may differ from in-person services, written in plain language accessible to clients without technical backgrounds.</p>
<p><strong>Benefits and risks:</strong> Benefits to be described include increased access to services, elimination of travel time and associated costs, and flexibility in scheduling. Risks to be described include the possibility of technology failure during sessions, potential limitations in the clinician's ability to observe nonverbal cues, risks to privacy if the client's location is not adequately private, and the inability of the clinician to provide direct physical intervention in the event of a clinical emergency.</p>
<p><strong>Technology requirements:</strong> The consent should specify minimum technology requirements, including internet bandwidth recommendations, supported devices and browsers, and any software the client will need to install.</p>
<p><strong>Privacy and confidentiality:</strong> The consent should address the client's selection of a private location, recommendations for headphones and screen privacy, and the platform's data handling practices, consistent with the §111.003 confidentiality obligation.</p>
<p><strong>Recording policies:</strong> The consent should state whether sessions may be recorded, under what circumstances, and what consent requirements apply — Texas is a one-party consent state for recording communications, but clinicians serving clients physically located in other states should apply the more restrictive of the two states' recording laws.</p>
<p><strong>Emergency procedures:</strong> The consent must document the client's physical address at the time of each session (which may change from session to session), the name and contact information of a local emergency contact person, the address and phone number of the nearest emergency department, the local emergency services dispatch number, and the clinician's crisis response protocol.</p>
<p><strong>Client-location and interstate practice disclosure:</strong> If the clinician is not licensed in the state where the client is physically located, the consent should disclose this fact and the legal basis (if any) for providing services across state lines. See Section 5 of this course for the client-location rule governing Texas practice.</p>
<h2>Clinical Documentation Standards</h2>
<p>Clinical documentation for technology-assisted sessions must meet the same professional and regulatory standards as documentation for in-person sessions, with additional elements specific to the virtual modality. Each session note should specify the modality of service delivery, the technology platform used, the client's physical location at the time of the session (including the state or jurisdiction, which is relevant to both licensure compliance and emergency response), verification of client identity at the beginning of the session, and any technology difficulties experienced and how they were managed.</p>
<p>The clinical content of the session note follows the same documentation standards as in-person sessions. However, clinicians should be attentive to the ways in which the modality may affect the scope and quality of clinical observations — for example, a mental status examination conducted via video may have limitations in assessing psychomotor activity below the camera frame. These limitations should be acknowledged in the documentation rather than omitted, as thorough documentation of both what was observed and what could not be adequately assessed demonstrates clinical diligence.</p>
<h2>Technology-Assisted-Services Documentation Templates</h2>
<p>Many electronic health record systems now include technology-assisted-services templates that prompt clinicians to document the required modality-specific elements alongside standard clinical documentation. For clinicians whose EHR systems do not include such templates, developing a custom addendum that captures the modality-specific elements can ensure consistent documentation compliance — structured as a brief checklist that captures the service delivery modality, platform used, client location and identity verification, technology quality assessment, any limitations in clinical observation, and emergency contact information verified. Documentation of the informed consent process should also be maintained, including the date the consent was provided, the date it was reviewed verbally, and the client's signature or electronic acknowledgment; if the consent is updated to reflect changes in technology, emergency procedures, or other elements, the updated consent should be documented as well.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Managing Consent Across Changing Circumstances</h2>
<p>Informed consent is not a single event but an ongoing process that must be revisited when circumstances change. Several types of changes may necessitate updating the informed consent, including changes in the technology platform used for service delivery, changes in the client's location (particularly if the client relocates to a different state), changes in the clinician's privacy practices or security measures, changes in regulatory requirements, and changes in the scope or nature of services provided.</p>
<p>Documentation of the consent update process should include the date of the update, the specific elements that were changed, the method by which the updated consent was communicated to the client, and the client's acknowledgment of the updated terms. Electronic signature platforms that timestamp and store consent documents provide a convenient and defensible method for managing consent documentation.</p>
<blockquote><p><strong>Clinical Vignette:</strong> When a counselor in Austin transitioned from Doxy.me to SimplePractice for her technology-assisted-services platform, she updated her informed consent documents, sent the revised consent to all active clients through the new platform's secure messaging feature, discussed the change during the next scheduled session with each client, and documented the consent update in each client's clinical record. Three months later, when a client questioned the change, the counselor was able to demonstrate that the client had been fully informed and had acknowledged the updated consent.</p></blockquote>
<p>The legal doctrine of informed consent varies by state, with some states applying a "reasonable patient" standard (what a reasonable patient would want to know) and others applying a "reasonable physician" standard (what a reasonable physician would disclose). Clinicians should be aware of the informed consent standard applicable in each state where they provide services, as the legal standard may influence the scope and specificity of the information that must be disclosed.</p>
<h2>Informed Consent as an Ongoing Process</h2>
<p>The conceptualization of informed consent as an ongoing process rather than a single event is particularly relevant in technology-assisted practice, where the technology environment, regulatory landscape, and clinical circumstances may change more frequently than in traditional in-person practice. The initial informed consent establishes the foundation of the therapeutic contract, but the consent process should continue throughout the therapeutic relationship through regular discussions about the client's experience of the modality, changes in technology or procedures, and evolving understanding of the benefits and risks of virtual service delivery. Periodic consent reviews provide opportunities to assess the client's continued satisfaction with the modality, identify any emerging concerns related to technology use or privacy, update emergency contact information and the client's physical location, and address any new regulatory requirements that affect service delivery.</p>
<p>The concept of therapeutic transparency, in which the clinician proactively shares information about their clinical reasoning, treatment approach, and practice procedures, is particularly important in technology-assisted practice. Clients engaging virtually may have less contextual information about the clinician's practice than clients who visit a physical office, where the office environment and other observable cues provide implicit information about professionalism and procedure. Telehealth clinicians can compensate for this by being more explicitly transparent about their qualifications, their approach to therapy, their technology security measures, and their emergency procedures. This transparency builds trust and supports genuinely informed consent.</p>
<h2>State-Specific Consent Requirements Beyond Texas</h2>
<p>While the general principles of informed consent apply across all jurisdictions, individual states may impose specific requirements regarding the form, content, and timing of technology-assisted-services informed consent that a Texas clinician serving an out-of-state client must satisfy in addition to Texas requirements. Some states require written, signed informed consent specifically acknowledging the technology-assisted nature of services; others accept verbal consent documented in the clinical record. Some states mandate that specific topics be addressed, such as the right to receive in-person services as an alternative, or the specific technology platform that will be used. For clinicians serving clients in multiple states, the recommended approach is to develop a comprehensive informed consent document that meets or exceeds the requirements of the most stringent state in which the clinician provides services, reviewed and updated at least annually.</p>
<h2>Client Technology Orientation and Onboarding</h2>
<p>A structured technology orientation process for new clients can significantly reduce the frequency and severity of technology-related disruptions during clinical sessions and can improve client comfort and confidence with the virtual modality. An effective orientation begins with a pre-session checklist verifying that the client has a working camera, microphone, and speaker or headphones; that the client has tested their internet connection speed; that the client has identified a private location; and that the client has the clinician's contact information for use during a technology disruption. Providing this checklist in writing, through email or a secure client portal, allows the client to prepare at their own pace. A brief technology test session, conducted 10 to 15 minutes before the first clinical session, provides an opportunity for the client to practice connecting to the platform, adjust their camera and audio settings, and experience the interface without the pressure of clinical content — during this test session the clinician can assess the client's technology setup, provide guidance on camera positioning and audio quality, and troubleshoot any issues that arise.</p>
<p>For clients with limited technology experience, written technology guides with step-by-step instructions and screenshots can supplement the orientation session, covering how to connect to the platform, adjust audio and video settings, use the platform's chat function, and troubleshoot common problems such as audio echo, frozen video, and connection drops. These guides should be written in plain, non-technical language and should be available in formats accessible to clients with visual impairments or limited literacy. This investment of time at the beginning of the therapeutic relationship pays dividends throughout treatment by reducing technology-related anxiety and session disruptions.</p>
`,
    },
    {
      type: "callout",
      calloutType: "protocol",
      title: "Texas's 2-Hour Technology-Assisted Services CE Requirement",
      content: "<p>22 TAC §681.140 (Requirements for Continuing Education) requires Texas-licensed professional counselors who provide technology-assisted services to complete <strong>2 hours</strong> of continuing education specifically in technology-assisted services, in addition to the general 24-hour CE requirement per renewal (including 6 hours of ethics and 3 hours of cultural diversity/competency). This 2-hour requirement may count toward the overall 24-hour total. <em>[VERIFY the exact subsection and effective date against the live BHEC LPC rulebook at bhec.texas.gov before publish — this course's citation was corroborated via secondary sources, not read directly from the primary rule text.]</em></p>",
    },
    {
      type: "flashcardDeck",
      instructions: "Flip through the essential informed consent elements for Texas technology-assisted practice.",
      flashcards: [
        { id: "tx-fc-1", front: "Nature of Services", back: "Describe specific modalities (video, phone, async), platforms used, and how technology-assisted services differ from in-person. Use plain language — no jargon." },
        { id: "tx-fc-2", front: "Informed Consent (Tex. Occ. Code §111.002)", back: "The health professional must ensure the patient's (or authorized decision-maker's) informed consent is obtained before telehealth/technology-assisted services are provided." },
        { id: "tx-fc-3", front: "Confidentiality (Tex. Occ. Code §111.003)", back: "The health professional must ensure confidentiality of the patient's medical information is maintained per Chapter 159 or other applicable law." },
        { id: "tx-fc-4", front: "Recording Policies", back: "State whether sessions may be recorded, by whom, under what circumstances. Texas is a one-party consent state — but apply the more restrictive law if the client is located elsewhere." },
        { id: "tx-fc-5", front: "Emergency Procedures", back: "Document: client's physical address each session, local emergency contact person, nearest ED address/phone, local dispatch number, clinician's crisis response protocol." },
        { id: "tx-fc-6", front: "Client-Location Disclosure", back: "If not licensed where the client is physically located, disclose this and any legal basis for cross-state services. See Section 5 for the client-location rule." },
      ],
    },
    {
      type: "reflection",
      question: "Pull up your current technology-assisted-services informed consent document right now. Compare it against the flashcard elements above. Does it document both the §111.002 informed-consent and §111.003 confidentiality obligations explicitly? Are there gaps?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under Texas Occupations Code §111.002, a health professional providing telehealth services must ensure:",
      options: [
        { text: "That the patient's informed consent is obtained before services are provided", isCorrect: true },
        { text: "That the patient pays a technology surcharge", isCorrect: false },
        { text: "That the session is recorded for quality assurance", isCorrect: false },
        { text: "That a physician co-signs every session note", isCorrect: false },
      ],
      explanation: "Section 111.002 of the Texas Occupations Code requires that informed consent of the patient (or an authorized decision-maker) be obtained before telehealth or telemedicine services are provided.",
    },
    {
      type: "multipleChoice",
      question: "The legal doctrine of informed consent varies by state using which two standards?",
      options: [
        { text: "Criminal standard vs. civil standard", isCorrect: false },
        { text: "Federal standard vs. state standard", isCorrect: false },
        { text: "Reasonable patient standard vs. reasonable physician standard", isCorrect: true },
        { text: "Written standard vs. verbal standard", isCorrect: false },
      ],
      explanation: "Some states apply a reasonable patient standard (what a reasonable patient would want to know) while others apply a reasonable physician standard (what a reasonable physician would disclose).",
    },
  ],
};

// ═══ SECTION 4: Crisis and Safety Across Distance (adapted for Texas) ═══
const SECTION_4 = {
  title: "Crisis Intervention and Safety Planning Across Distance",
  order: 4,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 4,
      title: "Section 4",
      subtitle: "Crisis Intervention and Safety Planning Across Distance",
      bannerAlt: "Clinician on a supportive phone call, representing crisis intervention across distance",
    },
    {
      type: "text",
      content: `<h2>The Unique Challenge of Remote Crisis Response</h2>
<p>Crisis intervention in the technology-assisted-services environment presents what is arguably the most significant clinical and ethical challenge of virtual mental health practice. When a client in acute distress is separated from the clinician by potentially hundreds of miles — not an unusual distance in a state as large as Texas — the clinician's ability to intervene directly is fundamentally constrained. There is no ability to physically accompany the client to an emergency department, no capacity to remove means of self-harm from the client's immediate environment, and no option to remain physically present until the crisis stabilizes. These limitations do not render remote crisis intervention impossible, but they demand that clinicians develop comprehensive, practiced, and well-documented protocols that maximize the effectiveness of remote crisis response.</p>
<p>Research on crisis intervention through technology-assisted services has demonstrated that virtual modalities can support effective crisis assessment and intervention. Crisis hotlines have relied on telephone-based crisis intervention for decades, and the evidence base for telephone-based crisis counseling is well-established (Gould et al., 2016). Video-based crisis intervention adds the dimension of visual assessment, enabling clinicians to observe behavioral indicators of distress, intoxication, or injury that would be invisible in a telephone-only interaction.</p>
<h2>Pre-Crisis Planning: Building the Safety Infrastructure</h2>
<p>Effective crisis response begins long before a crisis occurs. During the intake process and at the beginning of each subsequent session, clinicians should verify and document the client's current physical address, the name and contact information for at least one local emergency contact person, the nearest emergency department (address and phone number), and the local law enforcement non-emergency dispatch number, which is often the most effective number for requesting a welfare check.</p>
<p>Beyond collecting this information, clinicians should develop a written crisis response protocol that specifies the step-by-step actions to be taken when a client presents with imminent risk during a session: how the clinician will maintain contact with the client while simultaneously contacting emergency services, who will be contacted first, what information will be communicated to emergency responders, how the crisis event will be documented, and how the clinician will follow up after the acute crisis has been managed.</p>
<h2>Managing Active Suicidal Crisis During a Technology-Assisted Session</h2>
<p>When a client discloses active suicidal ideation with intent and plan, the clinician must implement a systematic crisis response that balances maintaining therapeutic connection with mobilizing emergency resources.</p>
<p>First, maintain calm and therapeutic presence. Second, conduct a structured risk assessment using a framework such as the Columbia-Suicide Severity Rating Scale (C-SSRS), assessing the nature, intensity, duration, and frequency of ideation; the presence of a specific plan; access to lethal means; and protective factors. Third, implement means restriction counseling — engaging the client in collaborative discussion about voluntarily restricting access to lethal means, particularly firearms; if the client is unwilling or unable to restrict means independently, the clinician should consider whether involving the emergency contact or emergency services is warranted. Fourth, develop or review the safety plan, including the client's identified warning signs that a crisis may be developing, internal coping strategies, social contacts and settings that provide distraction and support, family members or friends who can be contacted for help, professional resources including the clinician's contact information and crisis hotlines, and specific strategies for making the environment safe by removing or restricting access to lethal means — collaborative safety plans can be developed using screen-sharing features or shared documents, and the completed plan should be transmitted to the client through a secure channel before the session ends. Fifth, determine the appropriate level of intervention: safety plan and outpatient follow-up, notification of the emergency contact, or activation of emergency services. This decision requires clinical judgment that weighs the severity and imminence of risk against the client's autonomy, the availability of community resources, and the practical feasibility of different intervention options in the technology-assisted context.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Technology Failure During Crisis</h2>
<p>One of the most anxiety-provoking scenarios in technology-assisted practice is the loss of connection during a crisis event. If the video connection drops while a client is in acute distress, the clinician should immediately attempt to reconnect through the platform. If reconnection fails, the clinician should attempt to reach the client by telephone. If the client does not answer, the clinician should contact the client's designated emergency contact person. If the emergency contact cannot be reached or confirms that the client is in distress, the clinician should contact emergency services in the client's jurisdiction and request a welfare check.</p>
<p>These contingency procedures should be discussed with the client during the informed consent process and documented in the clinical record.</p>
<h2>Cross-Jurisdictional Emergency Coordination</h2>
<p>When the clinician and client are located in different jurisdictions, coordinating emergency response introduces additional complexity. Emergency services (911) route calls based on the caller's location, not the location of the emergency. A clinician in Texas calling 911 about a client in crisis in another state will reach local Texas dispatch, who may or may not have protocols for transferring the call to that state's emergency services. This delay can be clinically significant in situations requiring immediate intervention.</p>
<p>To address this challenge, clinicians should maintain a current record of the non-emergency dispatch number for law enforcement in each client jurisdiction. When calling to request a welfare check, the clinician should identify themselves as a mental health professional, provide the client's name and address, describe the nature of the clinical concern, note any known risk factors, and request that responding officers be informed that the individual is in a mental health crisis. In jurisdictions that have adopted crisis intervention team (CIT) training for law enforcement officers, requesting a CIT-trained officer for the welfare check can improve the quality and safety of the emergency response; clinicians should familiarize themselves with the availability of CIT-trained officers, mobile crisis teams, and other specialized crisis response resources in the jurisdictions where their clients are located, maintaining this information in a cross-jurisdictional crisis resource directory that can be referenced quickly, since the time pressure of a crisis situation does not permit searching for this information in real time.</p>
<h2>Documenting Crisis Events</h2>
<p>Thorough documentation of crisis events and the clinician's response is essential for clinical continuity, legal protection, and quality assurance. Crisis documentation should include the date, time, and duration of the crisis event; the modality through which the crisis was identified; the specific statements or behaviors that prompted the crisis assessment; a detailed record of the risk assessment conducted; the clinical formulation of risk level; the specific interventions implemented; the names and contact information of any individuals contacted during the crisis response; the client's response to the interventions provided; and the disposition plan. Documentation should be completed as close to the time of the crisis event as possible.</p>
<h2>Involuntary Commitment Across State Lines</h2>
<p>One of the most complex legal issues in remote crisis management involves the initiation of involuntary psychiatric commitment when the clinician and client are in different states. Involuntary commitment laws vary significantly by state in their criteria (imminent danger to self, imminent danger to others, grave disability, or some combination), procedural requirements, and terminology. When a Texas-licensed clinician determines during a technology-assisted session that a client physically located in another state meets criteria for involuntary commitment, the clinician must navigate the commitment laws of the state where the client is physically located — not Texas law. In practice, the most effective approach is often to contact local law enforcement or mobile crisis services in the client's jurisdiction and request a welfare check or crisis evaluation, providing the responding professionals with the clinical information needed to make their own determination about the need for involuntary evaluation. Clinicians who regularly serve clients across state lines should develop a cross-jurisdictional crisis resource directory that includes commitment criteria, mobile crisis team contacts, and required documentation for each relevant state, maintained in an accessible format that can be referenced quickly during a crisis.</p>
<h2>Debriefing and Self-Care After Crisis Events</h2>
<p>Crisis events in technology-assisted practice are emotionally demanding for clinicians, and the absence of in-person collegial support that a physical office environment provides can intensify the emotional impact of remote crisis management. Immediate post-crisis self-care should include completing documentation while the events are fresh, engaging in a deliberate transition activity that signals the shift from crisis mode to normal functioning, and contacting a trusted colleague for debriefing as soon as practical after the crisis. Longer-term processing should include discussion in supervision or peer consultation, self-monitoring for signs of vicarious trauma or burnout, and honest assessment of what went well and what might be improved in the crisis response protocol. Solo practitioners should develop a crisis support network before crises occur — a peer consultation partner available for immediate debriefing, a clinical supervisor who can guide follow-up actions and documentation, and a professional liability insurance risk-management consultant who can advise on documentation and liability considerations.</p>
<blockquote><p><strong>Clinical Vignette:</strong> During a video session with a client who had been progressing well in treatment for depression, a Texas counselor noticed that the client had become increasingly withdrawn and was speaking in a flat, monotone voice. When asked directly about suicidal thoughts, the client disclosed that she had been stockpiling medications over the past two weeks. The counselor maintained video contact with the client while using her cell phone to call the client's designated emergency contact (her sister, who lived 10 minutes away) and simultaneously texting a colleague to contact local emergency services. The sister arrived before emergency services and secured the medications. The counselor documented the entire event, including the timeline of each action taken, within one hour of the session's conclusion.</p></blockquote>
`,
    },
    {
      type: "scenarioTree",
      scenarioTitle: "Connection Lost During Crisis",
      instructions: "During a video session, your client — who has been progressing well in depression treatment — discloses stockpiling medications and writing letters to her children. Mid-disclosure, the video connection drops.",
      startNode: "start",
      nodes: {
        start: {
          text: "The video just went dark. Your client disclosed active suicidal planning with means access moments ago. What do you do first?",
          options: [
            { text: "Immediately call 911", next: "premature_911", feedback: "911 from your location routes to your local dispatch, not the client's — and the graduated protocol prioritizes reconnection first." },
            { text: "Attempt to reconnect through the platform", next: "correct_reconnect", feedback: "Correct — the graduated protocol begins with an attempt to reconnect through the platform." },
            { text: "Wait for the client to call back", next: "wrong_wait", feedback: "Passively waiting is dangerous given the disclosed plan and means access." },
          ],
        },
        premature_911: {
          text: "Calling 911 immediately, without attempting to reestablish contact, may not be warranted yet — the disconnection could be a simple technology failure. Also, calling 911 from YOUR location routes to YOUR local dispatch, not the client's.",
          options: [{ text: "Follow the graduated protocol", next: "correct_reconnect" }],
        },
        wrong_wait: {
          text: "You have an obligation to actively attempt to reestablish contact and, if unsuccessful, to initiate your crisis protocol.",
          options: [{ text: "Attempt to reconnect", next: "correct_reconnect" }],
        },
        correct_reconnect: {
          text: "You attempt to reconnect through the platform — it fails. What next?",
          options: [{ text: "Call the client's phone number", next: "phone_call" }],
        },
        phone_call: {
          text: "You call the client's phone. No answer after two attempts. What now?",
          options: [
            { text: "Contact the client's designated emergency contact", next: "emergency_contact" },
            { text: "Contact emergency services in the client's jurisdiction", next: "both_needed" },
          ],
        },
        emergency_contact: {
          text: "You reach her sister (emergency contact), who lives 10 minutes away. While maintaining phone contact with the sister, you simultaneously text a colleague to contact local emergency services. The sister arrives, secures the medications. Emergency services arrive shortly after. The graduated protocol worked: platform → phone → emergency contact → emergency services.",
          options: [],
        },
        both_needed: {
          text: "Contacting emergency services is appropriate, but remember: you need the non-emergency dispatch number for the CLIENT's jurisdiction, not 911 from your location. Simultaneously contacting the emergency contact (sister, 10 minutes away) provides faster in-person response while EMS is dispatched.",
          options: [{ text: "Contact both simultaneously", next: "emergency_contact" }],
        },
      },
    },
    {
      type: "flashcardDeck",
      instructions: "Flip through the five-step crisis response protocol.",
      flashcards: [
        { id: "tx-crisis-1", front: "Step 1: Maintain Calm & Therapeutic Presence", back: "Your emotional regulation sets the tone. Steady, unhurried voice. Acknowledge distress. Express genuine concern. Avoid alarm, frustration, or judgment." },
        { id: "tx-crisis-2", front: "Step 2: Structured Risk Assessment", back: "Use C-SSRS or SAFE-T framework. Assess nature/intensity/duration/frequency of ideation, specific plans, access to lethal means, protective factors." },
        { id: "tx-crisis-3", front: "Step 3: Means Restriction Counseling", back: "If client has access to lethal means: collaborative discussion about voluntarily restricting access. One of the most effective suicide prevention interventions." },
        { id: "tx-crisis-4", front: "Step 4: Safety Plan Development/Review", back: "Warning signs, internal coping strategies, social contacts, professional resources. Transmit via secure channel before session ends." },
        { id: "tx-crisis-5", front: "Step 5: Determine Intervention Level", back: "Safety plan + outpatient follow-up, notify emergency contact, or contact emergency services for evaluation/potential hospitalization." },
      ],
    },
    {
      type: "reflection",
      question: "Do you have a written crisis response protocol for your technology-assisted practice? If not, draft the three most critical steps you would take RIGHT NOW if a client disclosed imminent suicidal intent during a video session.",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "If the video connection drops during a crisis with a client, the clinician's FIRST action in the graduated protocol should be:",
      options: [
        { text: "Call 911 immediately", isCorrect: false },
        { text: "Contact the client's emergency contact person", isCorrect: false },
        { text: "Attempt to reconnect through the platform", isCorrect: true },
        { text: "Document the disconnection and wait", isCorrect: false },
      ],
      explanation: "The graduated protocol: reconnect via platform → phone → emergency contact → emergency services.",
    },
  ],
};

// ═══ SECTION 5: Texas Jurisdiction and Client Location ═══
const SECTION_5 = {
  title: "Texas Jurisdiction and Client-Location Requirements",
  order: 5,
  contentBlocks: [
    {
      type: "sectionDivider",
      sectionNumber: 5,
      title: "Section 5",
      subtitle: "Texas Jurisdiction and Client-Location Requirements",
      bannerAlt: "Outline map of Texas representing jurisdictional and client-location rules for telehealth practice",
    },
    {
      type: "text",
      content: `<h2>The Client-Location Rule</h2>
<p>One of the most legally consequential principles in technology-assisted practice is the client-location rule: mental health services are considered to be delivered in the state where the client is physically located at the time of the session, regardless of where the clinician is physically located. This means that a Texas-licensed counselor providing technology-assisted services to a client who is physically located in another state at the time of the session is, legally, practicing in that state and must be licensed or otherwise authorized to practice there. There is no general reciprocity: a Texas LPC license does not, by itself, authorize practice with a client physically located in another state, and conversely, a person physically located in Texas must be served by a clinician licensed (or otherwise authorized) to practice in Texas — an out-of-state clinician's home-state license does not authorize them to serve a Texas-located client.</p>
<p>This client-location principle has significant implications for Texas counselors who serve clients who travel, relocate, attend college out of state, or live near the Texas border with Oklahoma, Arkansas, Louisiana, or New Mexico. A Texas-licensed LPC whose client is temporarily located in another state during a family trip is, technically, practicing in that state during the session and must either hold a license there, qualify for an applicable temporary-practice exemption, or decline to provide services during that period. The practical difficulty of enforcing this principle is widely acknowledged, but the legal risk of practicing without authorization in another jurisdiction remains real and can result in disciplinary action by either or both state boards involved.</p>
<h2>Texas Occupations Code Chapter 111 — Statutory Foundation</h2>
<p>Texas Occupations Code Chapter 111 (Telemedicine, Teledentistry, and Telehealth) is the statutory backbone underlying Texas's technology-assisted-services framework. Section 111.001 defines a "telehealth service" as a health service, other than a telemedicine medical service, delivered by a health professional licensed, certified, or otherwise entitled to practice in Texas — acting within the scope of that license — to a patient at a different physical location, using telecommunications or information technology. Section 111.002 requires informed consent before services are provided; Section 111.003 requires that confidentiality of the patient's medical information be maintained as required by Chapter 159 or other applicable law. A health professional providing a service via telehealth is held to the same standard of care that would apply to the same service delivered in person — technology-assisted delivery does not lower the applicable clinical standard.</p>
<h2>The Practice-Standard Rule: 22 TAC §681.41(e)</h2>
<p>Beyond the continuing-education requirement discussed in Section 3 of this course, Texas LPC rules establish practice standards specific to technology-assisted services within 22 TAC §681.41, "General Ethical Requirements." The subsection addressing technology-assisted services requires, among other things, that the licensee take reasonable precautions to protect clients from physical or emotional harm resulting from the use of technology-assisted media, and that a licensee not evaluate any individual's mental, emotional, or behavioral condition unless the licensee has personally interviewed the individual or discloses in the evaluation that no personal interview occurred. The same general-ethics framework permits (but does not require) a licensee to take reasonable action to inform medical or law enforcement personnel when the licensee determines there is a probability of imminent physical injury by the client to the client or to others, or a probability of imminent mental or emotional injury to the client — the same duty-to-warn latitude that applies to in-person practice, carried forward into technology-assisted delivery. <em>[VERIFY the exact subsection letter and current text against the live BHEC LPC rulebook before publish.]</em></p>
<h2>What "Reasonable Precautions" Means in Practice</h2>
<p>The general-ethics language requiring a licensee to take reasonable precautions to protect clients from harm resulting from the use of technology-assisted media is intentionally broad, and Texas clinicians should translate it into concrete, documentable practice behaviors rather than treating it as an abstract aspiration. In practice, reasonable precautions include verifying the client's identity and physical location at the start of every session; confirming that the technology platform in use meets the HIPAA standards discussed in Section 2 of this course; maintaining current emergency-contact and local-dispatch information for every client served remotely; documenting any limitations in clinical observation created by the virtual medium, consistent with the documentation standards discussed in Section 3; and periodically reassessing whether a given client's presenting concerns remain appropriate for technology-assisted delivery rather than requiring in-person care. None of these steps eliminates clinical risk entirely, but each one demonstrates the kind of good-faith diligence that both the ethical standard and a malpractice or disciplinary inquiry would look for after the fact.</p>
<h2>Texas and the Counseling Compact</h2>
<p>The Counseling Compact, developed by the Council of State Governments and supported by the National Board for Certified Counselors (NBCC), is a voluntary interstate agreement that allows eligible licensed counselors to obtain a privilege to practice in other member states without separate licensure in each one. As of the most recent legislative tracking available, <strong>Texas has not yet enacted the Counseling Compact</strong> — bills introduced during the 88th Legislature (2023 session), including HB 2557, SB 1100, and HB 5289, did not pass. Texas counselors should monitor the status of Texas Compact legislation, as its enactment would materially change the client-location analysis for Texas clinicians serving clients who travel to or relocate within other compact member states. Until Texas joins the Compact, the individual state-licensure and client-location principles described above remain the controlling framework for Texas-licensed counselors serving clients outside Texas, and for out-of-state counselors serving clients physically located in Texas.</p>
`,
    },
    {
      type: "text",
      content: `<h2>Documenting the Client-Location Determination</h2>
<p>Because the client-location rule turns on a fact — where the client is physically sitting during the session — rather than on a fixed characteristic like the client's home address or the clinician's license, Texas clinicians should build location verification into their standard session workflow rather than treating it as a one-time intake question. A simple, sustainable practice is to ask the client to confirm their current physical location verbally at the start of every session, note it in the session documentation alongside the modality and platform used (as discussed in Section 3), and flag any change from the client's usual location for a brief follow-up conversation about how long the change is expected to last and whether it affects the clinician's ability to continue services. This is a low-friction habit, but it is also the single most defensible piece of evidence a clinician can produce if a licensure board or malpractice inquiry later questions whether a given session was properly authorized.</p>
<h2>Alternative Interstate Practice Authorization Models</h2>
<p>For Texas clinicians serving clients across state lines while the Compact remains unenacted in Texas, several alternative models exist. <strong>Individual state licensure</strong> — obtaining a separate license in each state where the clinician wishes to provide services — is the most straightforward but most burdensome approach, requiring compliance with each state's education, examination, supervised-experience, and continuing-education requirements. <strong>Temporary practice provisions</strong>, offered by some states, allow out-of-state clinicians to provide services on a limited basis (often capped at a set number of days per year) without full licensure; the scope and requirements vary widely by state and must be individually researched. <strong>Supervision arrangements</strong>, in which a clinician provides services in another state under the supervision of a clinician licensed there, are more commonly used for pre-licensure counselors but may be applicable in limited circumstances.</p>
<p>Interstate technology-assisted practice also introduces additional considerations regarding professional liability insurance. Standard professional liability policies may or may not provide coverage for services delivered to clients in other states, depending on the specific policy language. Clinicians should review their liability insurance policies and confirm with their carriers that coverage extends to technology-assisted services delivered across state lines. Malpractice claims arising from technology-assisted services may be governed by the law of the state where the client is located, the state where the clinician is located, or both, depending on the circumstances and applicable conflict-of-laws principles — a jurisdictional uncertainty that creates risk for clinicians who may find themselves subject to legal proceedings in a distant state with unfamiliar malpractice standards, damage caps, and procedural requirements. The disciplinary authority of state licensing boards adds another layer of complexity: a clinician who provides services to a client in another state may be subject to disciplinary action by both the Texas BHEC and the licensing board of the state where the client is located, underscoring the importance of maintaining compliance with the most restrictive applicable requirements.</p>
<h2>PSYPACT and Related Compact Models</h2>
<p>While the Counseling Compact remains unenacted in Texas, related professions have developed their own interstate practice authorization mechanisms that counselors should understand, both for general knowledge and because these mechanisms may inform the eventual development of Texas's counseling-specific framework. The Psychology Interjurisdictional Compact (PSYPACT) is the most established interstate compact for behavioral health providers, allowing psychologists licensed in compact member states to practice telepsychology and conduct temporary in-person practice in other member states through a system of certification administered by the PSYPACT Commission. The Social Work Licensure Compact, developed by the Council of State Governments in collaboration with the Association of Social Work Boards, follows a similar privilege-to-practice model and has been introduced in multiple state legislatures. Texas counselors should verify the current compact-participation status for each profession and state relevant to their practice, since a multi-disciplinary group practice may find that different providers can serve clients in different states depending on which compacts have been enacted where.</p>
<h2>Regulatory Monitoring for Texas Clinicians</h2>
<p>Given the dynamic nature of technology-assisted-services regulation, Texas clinicians need systematic approaches to monitoring regulatory changes that affect their practice. Relying on ad hoc awareness or informal professional networks is insufficient, as regulatory changes may take effect before clinicians become aware of them through casual channels. Effective strategies include subscribing to BHEC's board-news email updates, which provide notice of rule changes, proposed regulations, and board meeting agendas; monitoring NBCC regulatory communications; and reviewing risk-management bulletins distributed by professional liability insurance carriers, which often address emerging issues in technology-assisted practice. The American Telemedicine Association maintains a comprehensive state policy database that tracks telehealth-related legislation and regulations across all 50 states, and the Center for Connected Health Policy provides state telehealth policy comparison tools that allow clinicians to compare requirements across jurisdictions — both valuable resources for Texas clinicians who serve clients in multiple states.</p>
<p>A basic compliance-tracking system should document the specific regulatory requirements applicable to the practice, organized by jurisdiction and regulatory body; the status of compliance with each requirement (compliant, pending, or non-compliant); the dates of regulatory changes and the actions taken to implement them; the schedule for periodic compliance reviews; and the documentation supporting compliance with each requirement. Annual compliance reviews, conducted either internally or by an external consultant, provide a structured opportunity to identify and address compliance gaps before they result in regulatory violations or disciplinary action.</p>
<h2>Preparing for Changes in Interstate Authorization</h2>
<p>For Texas clinicians anticipating eventual Compact enactment or expanded interstate authorization options, several preparatory steps can facilitate a smooth transition. First, clinicians should verify that they would meet Compact eligibility requirements likely to apply — an active, unencumbered license, graduation from a CACREP-accredited program (or equivalent), passage of a recognized national examination, and a clean disciplinary record — and should proactively resolve any licensing complications, examination deficiencies, or disciplinary matters, since resolving these after a Compact becomes operational may create delays in obtaining a privilege to practice. Second, clinicians should begin developing knowledge of the regulatory environments in states where they anticipate providing services, since even under a future Compact, clinicians would remain subject to each state's informed consent, mandatory reporting, and scope-of-practice requirements. Third, clinicians should review and update their professional liability insurance to confirm coverage extends to all anticipated practice states, since some carriers require notification or policy modification to extend coverage to interstate practice. Fourth, clinicians should update their informed consent documents to address interstate practice, disclosing the jurisdictions in which they are authorized to practice, the legal basis for that authorization, and any limitations that apply.</p>
<blockquote><p><strong>Clinical Vignette:</strong> A Texas-licensed LPC's established client received notice of a job relocation from Houston to Oklahoma City in six weeks. Rather than continuing services under her Texas license once the client physically relocated, the counselor checked the Counseling Compact status for both states (at the time, neither Texas nor the client's understanding of Oklahoma's participation was current), researched Oklahoma's temporary-practice provisions, and — finding no timely path to authorization — planned a warm transition: she provided referrals to an Oklahoma-licensed clinician, coordinated a records transfer with the client's consent, and scheduled a termination session. She documented the entire process, including her research into both states' rules, in the clinical record.</p></blockquote>
`,
    },
    {
      type: "callout",
      calloutType: "key",
      title: "The Client-Location Rule",
      content: "<p>Services are legally delivered in the state where the client is physically located at the time of the session — not the state where the clinician is licensed. A Texas LPC license does not authorize practice with a client physically located outside Texas, and an out-of-state clinician's license does not authorize practice with a client physically located inside Texas, absent Compact participation or another specific authorization.</p>",
      items: [
        "Verify the client's physical location at the start of every session",
        "Document location changes (travel, relocation, dual residence) in the clinical record",
        "Texas has not yet enacted the Counseling Compact — verify current status before assuming a privilege to practice",
      ],
    },
    {
      type: "callout",
      calloutType: "warning",
      title: "Practicing Without Authorization Is a Real Risk — Even When Enforcement Is Rare",
      content: "<p>The practical difficulty of enforcing the client-location rule against traveling or relocating clients is widely acknowledged, but the legal exposure is real: a clinician who continues sessions with a client after the client permanently relocates out of Texas — without licensure, a Compact privilege, or an applicable temporary-practice exemption in the client's new state — risks disciplinary action from both the Texas BHEC and the other state's licensing board.</p>",
    },
    {
      type: "cardSort",
      instructions: "Sort each scenario into whether the Texas-licensed clinician may continue providing services under their existing Texas license alone, or needs additional authorization.",
      categories: ["Texas License Alone Is Sufficient", "Additional Authorization Needed"],
      cards: [
        { id: "tx-juris-1", text: "Client is physically located in Texas for the entire session", correctCategory: "Texas License Alone Is Sufficient" },
        { id: "tx-juris-2", text: "Client is a Texas resident temporarily traveling in New Mexico during the session", correctCategory: "Additional Authorization Needed" },
        { id: "tx-juris-3", text: "Client permanently relocates from Texas to Oklahoma", correctCategory: "Additional Authorization Needed" },
        { id: "tx-juris-4", text: "Client is physically located in Texas but the clinician is traveling out of state during the session", correctCategory: "Texas License Alone Is Sufficient" },
        { id: "tx-juris-5", text: "An out-of-state clinician wants to provide ongoing services to a client physically located in Texas", correctCategory: "Additional Authorization Needed" },
      ],
      explanation: "Client-location — not clinician location or client residency — determines which state's licensure requirements apply.",
    },
    {
      type: "resources",
      title: "Practice Templates — Technology-Assisted Services",
      description: "Downloadable worksheet to support Texas-compliant technology-assisted-services practice.",
      resources: [
        {
          title: "Technology-Assisted Services Informed Consent — Texas Occ. Code Ch. 111 Compliant",
          url: "/downloads/CR-TMH602_TX_Technology_Assisted_Services_Consent.docx",
          type: "worksheet",
          description: "Editable informed-consent template documenting §111.002 consent, §111.003 confidentiality, and client-location disclosure elements. Human legal review required before clinical use.",
        },
      ],
    },
    {
      type: "reflection",
      question: "List every state where your current clients might be physically located, even temporarily (travel, college, relocation). For each, do you know whether you are authorized to serve a client there? What is your plan for verifying and documenting client location at the start of every session?",
      minLength: 50,
    },
    {
      type: "multipleChoice",
      question: "Under the client-location rule, which state's licensure requirements govern a technology-assisted counseling session?",
      options: [
        { text: "The state where the clinician is physically located", isCorrect: false },
        { text: "The state where the clinician holds their primary license", isCorrect: false },
        { text: "The state where the client is physically located at the time of the session", isCorrect: true },
        { text: "The state where the telehealth platform's servers are located", isCorrect: false },
      ],
      explanation: "Mental health services are considered to be delivered in the state where the client is physically located at the time of the session, regardless of clinician location or licensure state.",
    },
    {
      type: "multipleChoice",
      question: "As of the most recent legislative tracking, what is the status of the Counseling Compact in Texas?",
      options: [
        { text: "Texas was among the first states to enact the Compact in 2023", isCorrect: false },
        { text: "Texas has not yet enacted the Compact; 2023-session bills did not pass", isCorrect: true },
        { text: "Texas is legally prohibited from ever joining the Compact", isCorrect: false },
        { text: "The Compact does not apply to licensed professional counselors", isCorrect: false },
      ],
      explanation: "Texas has not yet enacted the Counseling Compact; bills introduced in the 88th Legislature's 2023 session (HB 2557, SB 1100, HB 5289) did not pass. Clinicians should verify current status, as this can change with each legislative session.",
    },
    {
      type: "multipleChoice",
      question: "Under Texas Occupations Code Chapter 111, a health professional delivering a service via telehealth is held to:",
      options: [
        { text: "A relaxed standard of care reflecting the limitations of the technology", isCorrect: false },
        { text: "The same standard of care that would apply to the same service delivered in person", isCorrect: true },
        { text: "No standard of care, since telehealth is not yet fully regulated", isCorrect: false },
        { text: "A standard of care set solely by the technology platform's terms of service", isCorrect: false },
      ],
      explanation: "Texas Occupations Code Chapter 111 holds telehealth-delivered services to the same standard of care that applies to the same service delivered in person.",
    },
    {
      type: "multipleChoice",
      question: "22 TAC §681.140 requires Texas LPCs who provide technology-assisted services to complete how many hours of technology-assisted-services-specific continuing education?",
      options: [
        { text: "1 hour", isCorrect: false },
        { text: "2 hours", isCorrect: true },
        { text: "6 hours", isCorrect: false },
        { text: "10 hours", isCorrect: false },
      ],
      explanation: "22 TAC §681.140 requires 2 hours of continuing education specifically in technology-assisted services for licensees who provide such services, in addition to the general 24-hour CE requirement per renewal.",
    },
  ],
};

// ═══ ASSESSMENT (11 questions, 80% pass, 3 attempts) ═══
const ASSESSMENT_QUESTIONS = [
  {
    question: "22 TAC §681.140 requires Texas LPCs who provide technology-assisted services to complete how many hours of technology-assisted-services-specific continuing education?",
    options: [
      { text: "1 hour", isCorrect: false },
      { text: "2 hours", isCorrect: true },
      { text: "6 hours", isCorrect: false },
      { text: "10 hours", isCorrect: false },
    ],
    explanation: "22 TAC §681.140 requires 2 hours of CE specifically in technology-assisted services, in addition to the general 24-hour CE requirement per renewal.",
  },
  {
    question: "Under the client-location rule, which state's licensure requirements govern a technology-assisted counseling session?",
    options: [
      { text: "The state where the clinician is physically located", isCorrect: false },
      { text: "The state where the clinician holds their primary license", isCorrect: false },
      { text: "The state where the client is physically located at the time of the session", isCorrect: true },
      { text: "The state where the telehealth platform's servers are located", isCorrect: false },
    ],
    explanation: "Services are considered delivered in the state where the client is physically located, regardless of clinician location.",
  },
  {
    question: "Under Texas Occupations Code §111.002, a health professional providing telehealth services must ensure:",
    options: [
      { text: "That the patient's informed consent is obtained before services are provided", isCorrect: true },
      { text: "That the patient pays a technology surcharge", isCorrect: false },
      { text: "That the session is recorded for quality assurance", isCorrect: false },
      { text: "That a physician co-signs every session note", isCorrect: false },
    ],
    explanation: "Section 111.002 requires that informed consent be obtained before telehealth services are provided.",
  },
  {
    question: "Under Texas Occupations Code §111.003, what must a health professional ensure regarding a patient's medical information?",
    options: [
      { text: "That it is shared with all treating providers automatically", isCorrect: false },
      { text: "That its confidentiality is maintained as required by Chapter 159 or other applicable law", isCorrect: true },
      { text: "That it is stored only in paper format", isCorrect: false },
      { text: "That it is deleted after each session", isCorrect: false },
    ],
    explanation: "Section 111.003 requires the health professional to ensure confidentiality of the patient's medical information is maintained per Chapter 159 or other applicable law.",
  },
  {
    question: "As of the most recent legislative tracking, has Texas enacted the Counseling Compact?",
    options: [
      { text: "Yes, effective in 2023", isCorrect: false },
      { text: "No — 2023-session bills (HB 2557, SB 1100, HB 5289) did not pass", isCorrect: true },
      { text: "Yes, but only for LMFTs, not LPCs", isCorrect: false },
      { text: "Texas is exempt from needing to enact the Compact", isCorrect: false },
    ],
    explanation: "Texas has not yet enacted the Counseling Compact. Clinicians must verify current status before assuming a privilege to practice.",
  },
  {
    question: "Which platform arrangement satisfies HIPAA requirements for delivering clinical technology-assisted services?",
    options: [
      { text: "Consumer Zoom without a BAA", isCorrect: false },
      { text: "A public-facing livestream platform", isCorrect: false },
      { text: "A non-public-facing platform with a signed Business Associate Agreement (BAA)", isCorrect: true },
      { text: "Any video app the client is already comfortable using", isCorrect: false },
    ],
    explanation: "HIPAA-compliant clinical use requires a non-public-facing platform and a signed BAA — not merely client familiarity or convenience.",
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
    explanation: "HIPAA requires notification without unreasonable delay and no later than 60 days from discovery of the breach.",
  },
  {
    question: "If the video connection drops during a crisis with a client, the clinician's FIRST action in the graduated protocol should be:",
    options: [
      { text: "Call 911 immediately", isCorrect: false },
      { text: "Contact the client's emergency contact person", isCorrect: false },
      { text: "Attempt to reconnect through the platform", isCorrect: true },
      { text: "Document the disconnection and wait", isCorrect: false },
    ],
    explanation: "The graduated protocol: reconnect via platform → phone → emergency contact → emergency services.",
  },
  {
    question: "Under Texas Occupations Code Chapter 111, a health professional delivering a service via telehealth is held to:",
    options: [
      { text: "A relaxed standard of care reflecting the limitations of the technology", isCorrect: false },
      { text: "The same standard of care that would apply to the same service delivered in person", isCorrect: true },
      { text: "No standard of care", isCorrect: false },
      { text: "A standard of care set solely by the technology platform", isCorrect: false },
    ],
    explanation: "Telehealth-delivered services are held to the same standard of care as in-person delivery.",
  },
  {
    question: "22 TAC §681.41 (General Ethical Requirements) permits a licensee to inform medical or law enforcement personnel when the licensee determines there is:",
    options: [
      { text: "Any disagreement between clinician and client about treatment goals", isCorrect: false },
      { text: "A probability of imminent physical injury by the client to the client or others, or imminent mental or emotional injury to the client", isCorrect: true },
      { text: "A missed appointment", isCorrect: false },
      { text: "A billing dispute", isCorrect: false },
    ],
    explanation: "22 TAC §681.41's general ethical framework permits a licensee to take reasonable action to inform medical or law enforcement personnel of a probability of imminent physical or emotional injury.",
  },
];

// ═══ REFERENCES (subset of TMH601's APA 7th Edition list, retained sections only) ═══
const REFERENCES = [
  { title: "A non-inferiority trial of prolonged exposure for PTSD: In person versus home-based telehealth", author: "Acierno, R., Knapp, R., Tuerk, P., et al.", year: 2017, source: "Behaviour Research and Therapy, 89, 57-65" },
  { title: "ACA code of ethics", author: "American Counseling Association", year: 2014, source: "Author" },
  { title: "Computer therapy for the anxiety and depression disorders is effective", author: "Andrews, G., Basu, A., Cuijpers, P., et al.", year: 2018, source: "Journal of Anxiety Disorders, 55, 70-78" },
  { title: "Are videoconferenced mental and behavioral health services just as good as in-person?", author: "Batastini, A. B., Paprzycki, P., Jones, A. C. T., & MacLean, N.", year: 2021, source: "Clinical Psychology Review, 83, 101944" },
  { title: "Telepsychiatry: Psychiatric consultation by interactive television", author: "Dwyer, T. F.", year: 1973, source: "American Journal of Psychiatry, 130(8), 865-869" },
  { title: "An evaluation of crisis hotline outcomes part 2: Suicidal callers", author: "Gould, M. S., Kalafat, J., Harrismunfakh, J. L., & Kleinman, M.", year: 2016, source: "Suicide and Life-Threatening Behavior, 37(3), 338-352" },
  { title: "The effectiveness of telemental health: A 2013 review", author: "Hilty, D. M., Ferrer, D. C., Parish, M. B., et al.", year: 2013, source: "Telemedicine and e-Health, 19(6), 444-454" },
  { title: "Digital cognitive behavioral therapy for insomnia: A state-of-the-science review", author: "Luik, A. I., Kyle, S. D., & Espie, C. A.", year: 2017, source: "Current Sleep Medicine Reports, 3(2), 48-56" },
  { title: "Improving cost-effectiveness and access to CBT for depression", author: "Thase, M. E., McCrone, P., Barrett, M. S., et al.", year: 2020, source: "Psychotherapy and Psychosomatics, 89(5), 307-313" },
  { title: "Remote CBT for obsessive-compulsive symptoms: A meta-analysis", author: "Wootton, B. M.", year: 2016, source: "Clinical Psychology Review, 43, 103-113" },
  { title: "Two-way television in group therapy", author: "Wittson, C. L., Affleck, D. C., & Johnson, V.", year: 1961, source: "Mental Hospitals, 12(11), 22-23" },
  { title: "Telehealth (Chapter 111 — Telemedicine, Teledentistry, and Telehealth)", author: "Texas Legislature", year: 2023, source: "Texas Occupations Code, Title 3, Subtitle A, Chapter 111" },
  { title: "Requirements for Continuing Education", author: "Texas Behavioral Health Executive Council", year: 2024, source: "22 Tex. Admin. Code §681.140" },
  { title: "General Ethical Requirements", author: "Texas Behavioral Health Executive Council", year: 2024, source: "22 Tex. Admin. Code §681.41" },
  { title: "Notification of Enforcement Discretion for Telehealth Remote Communications", author: "U.S. Department of Health and Human Services, Office for Civil Rights", year: 2020, source: "HHS.gov" },
];

// ═══ COURSE DATA ═══
const COURSE_DATA = {
  slug: "technology-assisted-services-tx-681-140",
  title: "Technology-Assisted Services: Texas-Compliant Telehealth Practice",
  subtitle: "Texas 22 TAC §681.140 • Technology-Assisted Services CE",
  description: "This 2-hour continuing education course provides Texas-licensed mental health professionals with the knowledge needed to deliver technology-assisted services in compliance with 22 TAC §681.140, 22 TAC §681.41, and Texas Occupations Code Chapter 111. Covers HIPAA compliance, informed consent, crisis intervention across distance, and the client-location rule governing Texas jurisdiction.",
  courseCode: "CR-TMH602-TX",
  instructor: "GA Integrated Therapeutic Perspectives LLC",

  ceHours: 2,
  ceuHours: 2,
  ceCategory: "Technology-Assisted Services",
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
    "Define technology-assisted services under Texas Occupations Code Chapter 111 and 22 TAC Chapter 681, and distinguish the terminology from related national frameworks.",
    "Evaluate technology-assisted services platforms against HIPAA compliance requirements, including encryption standards, Business Associate Agreement provisions, and the public-facing/non-public-facing distinction.",
    "Develop a technology-assisted-services informed consent document that satisfies Texas Occupations Code §111.002 and §111.003 alongside ACA ethical requirements.",
    "Implement a structured crisis intervention protocol for technology-assisted sessions, including cross-jurisdictional emergency coordination.",
    "Apply the client-location rule to determine licensure obligations for Texas-licensed clinicians serving clients who travel or relocate, and for out-of-state clinicians serving Texas-located clients.",
    "Identify the current status of the Counseling Compact in Texas and the alternative interstate practice authorization models available in its absence.",
  ],

  targetAudience: [
    "Licensed Professional Counselors (LPC)",
    "Licensed Professional Counselor Associates (LPC-Associate)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "National Certified Counselors (NCC)",
  ],

  instructionalLevel: "Intermediate",

  categories: ["Technology-Assisted Services", "Telehealth", "Texas Requirements", "Professional Practice"],
  tags: ["technology-assisted services", "Texas", "22 TAC 681.140", "HIPAA", "telehealth", "client-location rule", "informed consent", "crisis intervention"],

  sections: [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5],

  assessment: {
    title: "Final Assessment: Technology-Assisted Services (Texas)",
    passingScore: 80,
    maxAttempts: 3,
    instructions: "This assessment evaluates your understanding of Texas technology-assisted-services requirements, HIPAA compliance, informed consent, crisis intervention, and the client-location rule. You must score 80% or higher to receive CE credit. You have a maximum of 3 attempts.",
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
  console.log("\n📁 DEPLOY WORKSHEET:");
  console.log("   Copy this file to client/public/downloads/ in your GitHub repo:");
  console.log("   - CR-TMH602_TX_Technology_Assisted_Services_Consent.docx");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
