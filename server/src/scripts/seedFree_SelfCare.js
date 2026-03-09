/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUG = 'self-care-clinicians';

const COURSE = {
  title: "Self-Care for Clinicians: Preventing Burnout and Compassion Fatigue",
  slug: SLUG,
  courseCode: "CR-101",
  description: "Mental health professionals face unique occupational hazards including burnout, compassion fatigue, and vicarious traumatization. This essential 1-hour continuing education course examines these constructs through the lens of current research, provides validated self-assessment frameworks, and equips clinicians with evidence-based self-care strategies that go beyond surface-level wellness advice. Participants will learn to recognize warning signs of impairment, understand self-care as an ethical obligation, and develop a personalized sustainability plan grounded in the Professional Quality of Life model.",
  ceHours: 1,
  ceuHours: 1,
  ceuEligible: true,
  ceCategory: "Ethics",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  accessType: "free",
  price: 0,
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  level: "Introductory",
  deliveryMethod: "Asynchronous Online",
  objectives: [
    "Distinguish between burnout, compassion fatigue, vicarious traumatization, and secondary traumatic stress",
    "Recognize personal, professional, and organizational warning signs of clinician impairment",
    "Articulate self-care as an ethical obligation grounded in professional codes of ethics",
    "Implement evidence-based self-care strategies across professional, personal, and cognitive domains",
    "Develop a personalized self-care plan using the Professional Quality of Life framework"
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Counselors-in-Training under supervision"
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia"
  },
  references: [
    { title: "Treating compassion fatigue", author: "Figley, C. R.", year: 2002, source: "Brunner-Routledge" },
    { title: "The burnout challenge: Managing people's relationships with their jobs", author: "Maslach, C., & Leiter, M. P.", year: 2022, source: "Harvard University Press" },
    { title: "The resilient practitioner (3rd ed.)", author: "Skovholt, T. M., & Trotter-Mathison, M.", year: 2016, source: "Routledge" },
    { title: "Professional quality of life: Compassion satisfaction and fatigue version 5 (ProQOL)", author: "Stamm, B. H.", year: 2010, source: "ProQOL.org" },
    { title: "Trauma and the therapist: Countertransference and vicarious traumatization", author: "Pearlman, L. A., & Saakvitne, K. W.", year: 1995, source: "W.W. Norton" },
    { title: "Compassion fatigue: Coping with secondary traumatic stress disorder (2nd ed.)", author: "Figley, C. R. (Ed.)", year: 1995, source: "Brunner/Mazel" },
    { title: "ACA Code of Ethics", author: "American Counseling Association", year: 2014, source: "ACA" }
  ],
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  // ═══════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════
  sections: [

    // ─── SECTION 1 ──────────────────────────────────
    {
      title: "Understanding the Occupational Hazards of Clinical Work",
      description: "Burnout, compassion fatigue, vicarious traumatization, and the ProQOL model",
      module: "Module 1: The Hazards",
      order: 1,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Cost of Caring</h2>
<p>Mental health professionals enter the field driven by a desire to alleviate suffering. Yet the very qualities that make clinicians effective—empathy, emotional attunement, the capacity to sit with another's pain—also make them vulnerable to a set of occupational hazards that are distinct from the stress experienced in other professions. These hazards are not signs of weakness or professional failure. They are predictable consequences of sustained empathic engagement with people in distress, and understanding them is the first step toward prevention.</p>
<p>Christina Maslach's groundbreaking research, spanning more than four decades, identified <strong>burnout</strong> as a syndrome with three core dimensions: <strong>emotional exhaustion</strong> (the depletion of emotional resources), <strong>depersonalization</strong> (developing cynical, detached attitudes toward clients), and <strong>reduced personal accomplishment</strong> (a declining sense of competence and meaning in one's work). Burnout develops gradually through chronic workplace stress—excessive caseloads, administrative burden, lack of autonomy, and insufficient organizational support. It is not specific to helping professions; anyone in a demanding work environment can experience burnout. What distinguishes clinician burnout is how depersonalization manifests: the very people we are ethically obligated to serve with care become the targets of our detachment.</p>
<p><strong>Compassion fatigue</strong>, a term introduced by Charles Figley in 1995, describes something qualitatively different. Where burnout develops gradually from cumulative workplace stress, compassion fatigue can emerge suddenly after exposure to particularly distressing client material. Figley defined it as "the cost of caring"—the emotional residue that accumulates from working with trauma survivors and individuals in acute distress. A clinician who has maintained energy and engagement for years may develop compassion fatigue rapidly after working with a particularly harrowing case or a cluster of difficult presentations.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "What is the key distinction between burnout and compassion fatigue?",
          options: [
            { text: "Burnout is more serious than compassion fatigue", isCorrect: false },
            { text: "Burnout develops gradually from chronic workplace stress, while compassion fatigue can emerge suddenly from empathic engagement with suffering", isCorrect: true },
            { text: "Compassion fatigue only affects new clinicians", isCorrect: false },
            { text: "Burnout is specific to helping professions while compassion fatigue is not", isCorrect: false }
          ],
          explanation: "Burnout develops gradually through chronic workplace stressors and can affect anyone in a demanding job. Compassion fatigue is specific to helping professions and can emerge suddenly after exposure to distressing client material—it is the emotional cost of sustained empathic engagement."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Vicarious Traumatization and Secondary Traumatic Stress</h2>
<p><strong>Vicarious traumatization</strong>, a construct developed by Pearlman and Saakvitne (1995), describes deeper, more enduring changes in the clinician's inner experience. Unlike compassion fatigue, which primarily involves emotional and physical symptoms, vicarious traumatization involves fundamental shifts in the clinician's cognitive schemas—their beliefs about safety, trust, control, esteem, and intimacy. A therapist who works extensively with sexual assault survivors may find their own sense of safety in the world permanently altered. A clinician treating combat veterans may develop a pervasive distrust of institutions. These changes are cumulative, often subtle, and can persist long after the clinician has left the clinical setting.</p>
<p><strong>Secondary traumatic stress (STS)</strong> refers to the acute stress response that clinicians experience from indirect exposure to traumatic material. The symptoms of STS mirror those of post-traumatic stress disorder—intrusive thoughts about client material, avoidance of trauma-related stimuli, hyperarousal, and emotional numbing—but arise from secondary rather than primary exposure. A clinician who cannot stop thinking about a client's abuse disclosure, who begins avoiding certain case types, or who startles easily after hearing about a client's violent experience is exhibiting secondary traumatic stress.</p>
<p>Beth Hudnall Stamm's <strong>Professional Quality of Life (ProQOL)</strong> model provides the most comprehensive framework for understanding these constructs together. The ProQOL model identifies three dimensions of professional quality of life: <strong>compassion satisfaction</strong> (the pleasure derived from doing clinical work well), <strong>burnout</strong>, and <strong>secondary traumatic stress</strong>. Healthy clinical practice involves high compassion satisfaction with low burnout and low secondary traumatic stress. When this balance shifts—when satisfaction diminishes while burnout or STS increases—the clinician is at risk.</p>`
        },
        {
          type: "matching",
          order: 4,
          matchingInstructions: "Match each construct with its defining characteristic:",
          matchingPairs: [
            { term: "Burnout", definition: "Gradual emotional exhaustion, depersonalization, and reduced accomplishment from chronic workplace stress" },
            { term: "Compassion fatigue", definition: "Sudden emotional cost of empathic engagement with suffering clients" },
            { term: "Vicarious traumatization", definition: "Enduring shifts in clinician's cognitive schemas about safety, trust, and control" },
            { term: "Secondary traumatic stress", definition: "PTSD-like symptoms from indirect exposure to client trauma material" },
            { term: "Compassion satisfaction", definition: "The pleasure and fulfillment derived from doing clinical work effectively" }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "A clinician who has worked with domestic violence survivors for ten years notices she no longer feels safe walking to her car at night and has developed a pervasive distrust of men she doesn't know. This most likely reflects:",
          options: [
            { text: "Burnout from excessive caseload", isCorrect: false },
            { text: "Vicarious traumatization involving changes to her cognitive schemas about safety and trust", isCorrect: true },
            { text: "Secondary traumatic stress with acute symptom presentation", isCorrect: false },
            { text: "Normal professional development in trauma work", isCorrect: false }
          ],
          explanation: "Vicarious traumatization involves deep, enduring changes to the clinician's worldview and cognitive schemas—particularly beliefs about safety, trust, control, esteem, and intimacy. The gradual shift in this clinician's sense of safety and trust in others over years of trauma work is the hallmark of vicarious traumatization, not acute STS or general burnout."
        },
        {
          type: "accordion",
          order: 6,
          title: "Deeper Dive: The ProQOL Model",
          accordionItems: [
            {
              title: "How Compassion Satisfaction Protects",
              content: "Research consistently shows that compassion satisfaction serves as a buffer against both burnout and secondary traumatic stress. Clinicians who experience high levels of meaning, purpose, and competence in their work are more resilient to the negative effects of empathic engagement. This finding has important implications: interventions that increase compassion satisfaction—such as celebrating clinical successes, engaging in meaningful supervision, and reconnecting with professional purpose—may be as important as interventions that directly target stress reduction."
            },
            {
              title: "When Multiple Constructs Overlap",
              content: "In clinical reality, burnout, compassion fatigue, vicarious traumatization, and secondary traumatic stress rarely present in isolation. A clinician may simultaneously experience emotional exhaustion from an unsustainable caseload (burnout), intrusive thoughts about a recent crisis case (STS), and a growing sense that the world is fundamentally unsafe (VT). Effective self-assessment requires examining all dimensions rather than attributing distress to a single cause."
            },
            {
              title: "Organizational vs. Individual Factors",
              content: "While much self-care literature focuses on individual strategies, Maslach's research emphasizes that burnout is primarily an organizational problem—not an individual failing. Excessive caseloads, inadequate supervision, lack of autonomy, unclear role expectations, and insufficient organizational support are stronger predictors of burnout than any individual characteristic. This means that individual self-care strategies, while necessary, are insufficient without organizational change."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "According to Stamm's ProQOL model, the three dimensions of professional quality of life are:",
          options: [
            { text: "Burnout, compassion fatigue, and vicarious traumatization", isCorrect: false },
            { text: "Compassion satisfaction, burnout, and secondary traumatic stress", isCorrect: true },
            { text: "Emotional exhaustion, depersonalization, and reduced accomplishment", isCorrect: false },
            { text: "Empathy, resilience, and professional competence", isCorrect: false }
          ],
          explanation: "Stamm's ProQOL model identifies compassion satisfaction, burnout, and secondary traumatic stress as the three dimensions. Note that the third option describes Maslach's three dimensions of burnout specifically, not the broader ProQOL framework."
        },
        {
          type: "reflection",
          order: 8,
          question: "Consider your own professional quality of life right now. On a scale from 1-10, how would you rate your current compassion satisfaction? Your burnout level? Your secondary traumatic stress? What patterns do you notice, and what might be contributing to the current balance?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "Maslach's three dimensions of burnout include all of the following EXCEPT:",
          type: "multipleChoice",
          options: [
            { text: "Emotional exhaustion", isCorrect: false },
            { text: "Depersonalization", isCorrect: false },
            { text: "Changes in worldview and cognitive schemas", isCorrect: true },
            { text: "Reduced personal accomplishment", isCorrect: false }
          ],
          explanation: "Changes in worldview and cognitive schemas describe vicarious traumatization, not burnout. Maslach's three burnout dimensions are emotional exhaustion, depersonalization (cynicism/detachment), and reduced personal accomplishment."
        },
        {
          question: "Which construct can develop suddenly rather than gradually?",
          type: "multipleChoice",
          options: [
            { text: "Burnout", isCorrect: false },
            { text: "Compassion fatigue", isCorrect: true },
            { text: "Vicarious traumatization", isCorrect: false },
            { text: "Organizational stress", isCorrect: false }
          ],
          explanation: "Compassion fatigue can emerge suddenly after exposure to particularly distressing client material, unlike burnout and vicarious traumatization which develop gradually over time."
        },
        {
          question: "Secondary traumatic stress symptoms most closely mirror:",
          type: "multipleChoice",
          options: [
            { text: "Major depressive disorder", isCorrect: false },
            { text: "Generalized anxiety disorder", isCorrect: false },
            { text: "Post-traumatic stress disorder", isCorrect: true },
            { text: "Adjustment disorder", isCorrect: false }
          ],
          explanation: "STS symptoms parallel PTSD—intrusive thoughts, avoidance, hyperarousal, and emotional numbing—but arise from indirect rather than direct trauma exposure."
        },
        {
          question: "In the ProQOL model, what serves as a buffer against burnout and STS?",
          type: "multipleChoice",
          options: [
            { text: "Years of clinical experience", isCorrect: false },
            { text: "Compassion satisfaction", isCorrect: true },
            { text: "Personal therapy", isCorrect: false },
            { text: "Reduced caseload alone", isCorrect: false }
          ],
          explanation: "Research consistently shows that compassion satisfaction—the pleasure and meaning derived from doing clinical work well—serves as a protective buffer against both burnout and secondary traumatic stress."
        },
        {
          question: "Maslach's research emphasizes that burnout is primarily:",
          type: "multipleChoice",
          options: [
            { text: "An individual failing requiring personal resilience", isCorrect: false },
            { text: "A personality disorder", isCorrect: false },
            { text: "An organizational problem requiring systemic solutions", isCorrect: true },
            { text: "Inevitable in clinical work", isCorrect: false }
          ],
          explanation: "Maslach's decades of research consistently shows that organizational factors—caseload, autonomy, support, role clarity—are stronger predictors of burnout than individual characteristics, making it fundamentally an organizational rather than individual problem."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 2 ──────────────────────────────────
    {
      title: "Recognizing Warning Signs and Ethical Obligations",
      description: "Personal and professional indicators of impairment, self-assessment, and the ethical mandate for self-care",
      module: "Module 2: Warning Signs",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Personal Warning Signs</h2>
<p>Recognizing impairment requires honest self-assessment—a practice that becomes increasingly difficult as impairment progresses. The insidious nature of burnout, compassion fatigue, and vicarious traumatization is that they erode the very self-awareness needed to detect them. Clinicians must therefore develop the habit of systematic self-monitoring before impairment sets in, rather than relying on their ability to notice problems in real time.</p>
<p><strong>Physical indicators</strong> are often the earliest signs. Chronic fatigue that doesn't resolve with rest, disrupted sleep patterns (difficulty falling asleep, frequent waking, or sleeping excessively), changes in appetite and weight, frequent headaches or gastrointestinal distress, and increased susceptibility to illness all signal that the body is registering stress the mind may be minimizing. Clinicians who find themselves getting sick during every vacation—a phenomenon so common it has been called "leisure sickness"—may be operating at unsustainable stress levels that their body can only address when the demands finally pause.</p>
<p><strong>Emotional indicators</strong> include persistent irritability or emotional flatness, a growing sense of dread before sessions, difficulty feeling empathy for clients, emotional numbness or frequent tearfulness, increased cynicism about the possibility of change, and a pervasive sense of helplessness or hopelessness. Perhaps the most telling emotional sign is the loss of what drew you to the work: when a clinician who entered the field because of deep caring for human suffering finds they no longer care, something has fundamentally shifted.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "A clinician notices she has been calling in sick more often, dreads Monday mornings, and has started making sarcastic comments about her clients during team meetings. These symptoms are most consistent with:",
          options: [
            { text: "Normal work stress that will resolve on its own", isCorrect: false },
            { text: "Burnout, particularly the depersonalization and emotional exhaustion dimensions", isCorrect: true },
            { text: "Secondary traumatic stress from a specific case", isCorrect: false },
            { text: "A personality change unrelated to work", isCorrect: false }
          ],
          explanation: "The gradual pattern of physical avoidance (calling in sick), emotional exhaustion (dreading work), and depersonalization (sarcastic comments about clients) is the classic burnout profile described by Maslach. STS would present with more specific trauma-related symptoms tied to particular client material."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Professional Warning Signs</h2>
<p><strong>Behavioral indicators in clinical practice</strong> are particularly important because they directly affect client welfare. Watch for: chronically running late or ending sessions early, poor preparation for sessions, difficulty remembering client details, rigid or formulaic interventions rather than responsive clinical work, boundary erosion (excessive self-disclosure, dual relationships, or loosening of frame), avoidance of certain client issues or populations, overidentification with clients, and difficulty maintaining appropriate emotional distance.</p>
<p><strong>Cognitive indicators</strong> include difficulty concentrating during sessions, intrusive thoughts about client material outside of work, impaired clinical judgment, black-and-white thinking about clients or treatment, loss of creativity in clinical conceptualization, and preoccupation with worst-case scenarios. Clinicians experiencing cognitive impairment often describe a narrowing of their clinical vision—they become less able to see multiple perspectives, generate creative interventions, or tolerate the ambiguity inherent in clinical work.</p>
<h2>Self-Care as an Ethical Obligation</h2>
<p>Self-care is not a luxury or an act of self-indulgence—it is an ethical mandate. The ACA Code of Ethics (2014) states in Section C.2.g: "Counselors monitor themselves for signs of impairment from their own physical, mental, or emotional problems and refrain from offering or providing professional services when impaired." The NASW Code of Ethics similarly requires social workers to monitor their own competence and not practice when impaired. The APA Ethics Code addresses impairment in Standard 2.06, requiring psychologists to be alert to signs of problems and take appropriate action.</p>
<p>The ethical logic is straightforward: clinicians have an obligation to provide competent services. Impairment compromises competence. Therefore, preventing and addressing impairment is an ethical obligation, not a personal preference. When a clinician ignores warning signs and continues practicing while impaired, they are engaging in an ethical violation as surely as if they had breached confidentiality or engaged in a dual relationship. Framing self-care as an ethical obligation rather than optional self-indulgence removes the guilt that many clinicians feel about prioritizing their own needs. You are not taking time away from clients when you practice self-care—you are ensuring that the time you spend with clients is clinically effective.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "According to the ACA Code of Ethics, clinician self-care is best understood as:",
          options: [
            { text: "A personal choice that enhances but is not required for professional practice", isCorrect: false },
            { text: "An ethical obligation to monitor impairment and ensure competent service delivery", isCorrect: true },
            { text: "Only necessary after a formal complaint has been filed", isCorrect: false },
            { text: "The responsibility of the clinician's supervisor, not the clinician", isCorrect: false }
          ],
          explanation: "ACA Code of Ethics Section C.2.g explicitly requires counselors to monitor themselves for signs of impairment and refrain from providing services when impaired. This makes self-care an ethical obligation directly tied to competent service delivery."
        },
        {
          type: "accordion",
          order: 5,
          title: "Self-Assessment Tools and Practices",
          accordionItems: [
            {
              title: "The Professional Quality of Life Scale (ProQOL-5)",
              content: "The ProQOL-5, developed by Beth Hudnall Stamm, is the most widely used and validated measure of professional quality of life for helping professionals. It produces scores on three subscales: compassion satisfaction, burnout, and secondary traumatic stress. The 30-item self-report measure can be completed in minutes and is freely available at proqol.org. Clinicians should consider completing the ProQOL-5 quarterly as a structured self-monitoring practice, tracking their scores over time to detect gradual shifts that might otherwise go unnoticed."
            },
            {
              title: "Structured Peer Check-Ins",
              content: "Regular peer check-ins with trusted colleagues provide an external perspective that compensates for the self-awareness deficits that accompany impairment. These check-ins work best when they are structured, reciprocal, and scheduled proactively rather than reactively. A simple framework: each participant shares one clinical success (building compassion satisfaction), one current challenge, and one honest self-assessment of their current wellbeing. The partner's role is to reflect what they hear, ask gentle probing questions, and share their own observations."
            },
            {
              title: "Supervision as Self-Care",
              content: "Quality supervision is one of the most powerful self-care practices available—yet it is often underutilized by experienced clinicians who no longer require it for licensure. Supervision focused on the clinician's internal experience, not just case management, provides space to process the emotional impact of the work, normalize reactions, and receive support in addressing impairment. Clinicians at all career stages benefit from regular consultation or supervision that explicitly includes attention to clinician wellbeing."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Which self-assessment tool is the most widely validated measure of professional quality of life for helping professionals?",
          options: [
            { text: "The Maslach Burnout Inventory (MBI)", isCorrect: false },
            { text: "The Professional Quality of Life Scale (ProQOL-5)", isCorrect: true },
            { text: "The Beck Depression Inventory (BDI-II)", isCorrect: false },
            { text: "The Perceived Stress Scale (PSS)", isCorrect: false }
          ],
          explanation: "While the MBI measures burnout specifically, the ProQOL-5 is the most widely used and validated measure that captures all three dimensions of professional quality of life: compassion satisfaction, burnout, and secondary traumatic stress—making it the most comprehensive self-assessment tool for clinicians."
        },
        {
          type: "matching",
          order: 7,
          matchingInstructions: "Match each warning sign category with its example:",
          matchingPairs: [
            { term: "Physical indicator", definition: "Chronic fatigue that doesn't resolve with rest and frequent illness" },
            { term: "Emotional indicator", definition: "Growing dread before sessions and loss of empathy for clients" },
            { term: "Behavioral indicator", definition: "Chronically running late, poor session preparation, boundary erosion" },
            { term: "Cognitive indicator", definition: "Difficulty concentrating in sessions and black-and-white thinking about clients" }
          ]
        },
        {
          type: "reflection",
          order: 8,
          question: "Review the warning signs described in this section. Which categories—physical, emotional, behavioral, or cognitive—resonate most with your current experience? Are there specific warning signs you have noticed but minimized? What would it take for you to act on these signals rather than push through them?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "Which of the following is a behavioral warning sign of clinician impairment?",
          type: "multipleChoice",
          options: [
            { text: "Feeling tired after a long day", isCorrect: false },
            { text: "Difficulty remembering client details and chronically running late for sessions", isCorrect: true },
            { text: "Occasionally feeling frustrated with a difficult case", isCorrect: false },
            { text: "Taking a personal day off", isCorrect: false }
          ],
          explanation: "Behavioral warning signs directly affect clinical practice: poor preparation, lateness, difficulty tracking client information, and boundary erosion are all indicators that impairment is affecting professional functioning."
        },
        {
          question: "The ACA Code of Ethics Section C.2.g requires counselors to:",
          type: "multipleChoice",
          options: [
            { text: "Attend personal therapy monthly", isCorrect: false },
            { text: "Monitor themselves for signs of impairment and refrain from practice when impaired", isCorrect: true },
            { text: "Take at least two weeks of vacation per year", isCorrect: false },
            { text: "Report impaired colleagues to their licensing board", isCorrect: false }
          ],
          explanation: "Section C.2.g specifically requires self-monitoring for impairment and refraining from professional services when impaired, establishing self-care as an ethical obligation."
        },
        {
          question: "Structured peer check-ins are valuable because they:",
          type: "multipleChoice",
          options: [
            { text: "Replace the need for formal supervision", isCorrect: false },
            { text: "Provide external perspective that compensates for impairment-related self-awareness deficits", isCorrect: true },
            { text: "Are required by most licensing boards", isCorrect: false },
            { text: "Guarantee prevention of burnout", isCorrect: false }
          ],
          explanation: "As impairment progresses, it erodes the very self-awareness needed to detect it. Peer check-ins provide an external perspective from trusted colleagues who can notice changes the clinician may be minimizing."
        },
        {
          question: "A clinician who finds herself engaging in more self-disclosure than usual and loosening session boundaries is exhibiting:",
          type: "multipleChoice",
          options: [
            { text: "Good rapport-building skills", isCorrect: false },
            { text: "A behavioral warning sign of impairment", isCorrect: true },
            { text: "An effective clinical strategy", isCorrect: false },
            { text: "Normal professional growth", isCorrect: false }
          ],
          explanation: "Boundary erosion—including excessive self-disclosure, dual relationships, and loosening of the therapeutic frame—is a key behavioral indicator that a clinician's professional functioning is being compromised by impairment."
        },
        {
          question: "How frequently should clinicians complete the ProQOL-5 for ongoing self-monitoring?",
          type: "multipleChoice",
          options: [
            { text: "Only when feeling burned out", isCorrect: false },
            { text: "Once at the start of their career", isCorrect: false },
            { text: "Quarterly, tracking scores over time to detect gradual shifts", isCorrect: true },
            { text: "Only when required by a supervisor", isCorrect: false }
          ],
          explanation: "Quarterly administration allows clinicians to track their professional quality of life scores over time, detecting gradual shifts in compassion satisfaction, burnout, and STS that might otherwise go unnoticed."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 3 ──────────────────────────────────
    {
      title: "Building a Sustainable Self-Care Practice",
      description: "Evidence-based strategies across professional, personal, and cognitive domains",
      module: "Module 3: Sustainable Practice",
      order: 3,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Professional Self-Care Strategies</h2>
<p>Effective self-care is not a checklist of pleasant activities appended to an otherwise unsustainable professional life. It is a fundamental restructuring of how clinicians approach their work, their relationships, and their own wellbeing. The research literature identifies strategies across three domains—professional, personal, and cognitive—that together form a comprehensive approach to clinician sustainability.</p>
<p><strong>Caseload management</strong> is the single most impactful professional self-care strategy. Research consistently shows that caseload size and composition are among the strongest predictors of clinician burnout and compassion fatigue. Strategies include: maintaining a diverse caseload rather than concentrating exclusively in high-acuity work, setting firm limits on total client hours, scheduling buffer time between sessions for processing and documentation, and building protected time for non-clinical professional activities that provide variety and restore energy.</p>
<p><strong>Quality supervision and consultation</strong> serves multiple self-care functions simultaneously. It provides a space to process the emotional impact of clinical work, normalizes the experience of occupational hazards, supports clinical decision-making during periods of reduced cognitive capacity, and offers an external check on impairment. Clinicians at all career stages benefit from ongoing supervision or consultation—not just those who are required to have it for licensure. The most effective supervision for self-care explicitly includes attention to the clinician's internal experience, not just case management and skill development.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Research identifies which factor as the single most impactful professional self-care strategy?",
          options: [
            { text: "Attending annual conferences", isCorrect: false },
            { text: "Caseload management—size, composition, and scheduling", isCorrect: true },
            { text: "Changing theoretical orientations regularly", isCorrect: false },
            { text: "Limiting documentation time", isCorrect: false }
          ],
          explanation: "Research consistently shows that caseload size and composition are among the strongest predictors of burnout and compassion fatigue. Managing caseload diversity, setting limits on client hours, and building buffer time are the most impactful professional strategies."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Personal Wellness Strategies</h2>
<p><strong>Physical self-care</strong> forms the biological foundation for emotional resilience. Regular physical activity has robust evidence for reducing stress, improving mood, and enhancing cognitive function—all of which directly support clinical effectiveness. Sleep hygiene is equally critical: chronic sleep deprivation impairs empathy, emotional regulation, and decision-making, all essential clinical capacities. Nutritional adequacy, hydration, and regular medical care complete the physical foundation. These are not luxuries—they are prerequisites for competent clinical practice.</p>
<p><strong>Relational self-care</strong> involves maintaining meaningful connections outside the therapeutic relationship. Clinicians who derive all of their relational satisfaction from client relationships are at heightened risk for boundary violations and emotional depletion. Investing in friendships, family relationships, romantic partnerships, and community connections provides relational nourishment that is qualitatively different from—and complementary to—the satisfaction of clinical work. This also means protecting personal time from clinical intrusion: not checking work email during family dinner, not processing client material with non-clinical friends (which also raises confidentiality concerns), and maintaining clear boundaries between professional and personal roles.</p>
<p><strong>Meaning-making and spiritual practice</strong>—broadly defined—addresses the existential dimension of clinical work. Clinicians regularly confront suffering, injustice, loss, and the limits of human capacity to heal. Without frameworks for making meaning of these encounters, the accumulation of suffering can lead to despair. For some clinicians, this meaning-making comes through religious or spiritual practice. For others, it comes through philosophy, art, nature, activism, or the conscious cultivation of gratitude and awe. The specific practice matters less than the commitment to regularly engaging with questions of meaning and purpose.</p>`
        },
        {
          type: "accordion",
          order: 4,
          title: "Cognitive Self-Care Strategies",
          accordionItems: [
            {
              title: "Cognitive Boundaries: Containing the Work",
              content: "One of the most challenging aspects of clinical work is learning to leave it at the office. Cognitive self-care involves developing intentional practices for containing clinical material: transition rituals between work and personal life (changing clothes, taking a different route home, brief mindfulness practice), conscious decisions to postpone clinical thinking until work hours, and journaling or other processing practices that externalize clinical material rather than carrying it internally. These strategies don't mean suppressing legitimate clinical concerns—they mean creating structured times and places for clinical thinking rather than allowing it to permeate all areas of life."
            },
            {
              title: "Challenging Perfectionism and the Savior Complex",
              content: "Many clinicians carry implicit beliefs that they should be able to help everyone, that client outcomes are entirely their responsibility, and that feeling distressed by the work means they are failing. These cognitive patterns—perfectionism, the savior complex, and emotional stoicism—are among the strongest individual risk factors for burnout. Cognitive self-care involves systematically identifying and challenging these beliefs: recognizing that therapeutic outcomes are co-created, that some clients will not improve despite excellent care, and that being affected by human suffering is a sign of healthy empathy rather than professional weakness."
            },
            {
              title: "Maintaining Professional Identity Beyond the Clinical Role",
              content: "Clinicians who define their entire identity through their professional role are more vulnerable to burnout because any threat to professional functioning threatens their core sense of self. Maintaining diverse sources of identity—as an artist, athlete, parent, community member, learner—provides psychological resilience when clinical work becomes difficult. This diversity of identity also models for clients the importance of not placing all psychological eggs in one basket."
            },
            {
              title: "Continuing Education as Renewal",
              content: "Learning new clinical approaches, attending conferences, reading current literature, and engaging in professional development can counteract the stagnation and reduced accomplishment that characterize burnout. When continuing education is approached as genuine intellectual engagement rather than a compliance obligation, it can renew clinical curiosity and restore the sense of professional growth that fuels compassion satisfaction."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Which cognitive pattern is identified as one of the strongest individual risk factors for clinician burnout?",
          options: [
            { text: "Intellectual curiosity about new treatment approaches", isCorrect: false },
            { text: "Healthy emotional boundaries with clients", isCorrect: false },
            { text: "Perfectionism and the belief that client outcomes are entirely the clinician's responsibility", isCorrect: true },
            { text: "Regular consultation with colleagues", isCorrect: false }
          ],
          explanation: "Perfectionism and the savior complex—believing one should be able to help everyone and that outcomes are entirely the clinician's responsibility—are among the strongest individual risk factors for burnout. These beliefs set impossible standards that guarantee a sense of failure."
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each self-care domain with its key strategy:",
          matchingPairs: [
            { term: "Professional self-care", definition: "Caseload management, quality supervision, and professional development" },
            { term: "Physical self-care", definition: "Regular exercise, adequate sleep, proper nutrition, and medical care" },
            { term: "Relational self-care", definition: "Maintaining meaningful connections outside therapeutic relationships" },
            { term: "Cognitive self-care", definition: "Transition rituals, challenging perfectionism, and diverse identity sources" },
            { term: "Meaning-making", definition: "Engaging with questions of purpose through spirituality, philosophy, art, or activism" }
          ]
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "A clinician who derives all relational satisfaction from client relationships is at heightened risk for:",
          options: [
            { text: "Enhanced clinical effectiveness", isCorrect: false },
            { text: "Boundary violations and emotional depletion", isCorrect: true },
            { text: "Improved therapeutic alliance", isCorrect: false },
            { text: "Greater compassion satisfaction", isCorrect: false }
          ],
          explanation: "When clinicians rely on client relationships for their primary relational nourishment, they are at heightened risk for boundary violations (seeking personal needs through professional relationships) and emotional depletion (overinvesting in relationships that are inherently one-directional)."
        },
        {
          type: "reflection",
          order: 8,
          question: "Based on what you have learned in this course, draft a brief personal self-care plan. Identify one specific strategy in each domain—professional, physical, relational, cognitive, and meaning-making—that you will commit to implementing this week. What barriers might you encounter, and how will you address them?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The most effective supervision for clinician self-care explicitly includes:",
          type: "multipleChoice",
          options: [
            { text: "Focus exclusively on case management and skill development", isCorrect: false },
            { text: "Attention to the clinician's internal experience, not just case management", isCorrect: true },
            { text: "Only administrative oversight", isCorrect: false },
            { text: "Discussion limited to clinical techniques", isCorrect: false }
          ],
          explanation: "While case management and skill development are important supervision functions, supervision that supports self-care must also address the clinician's emotional experience of the work—processing the impact of clinical encounters and normalizing occupational hazards."
        },
        {
          question: "Transition rituals between work and personal life are an example of:",
          type: "multipleChoice",
          options: [
            { text: "Physical self-care", isCorrect: false },
            { text: "Relational self-care", isCorrect: false },
            { text: "Cognitive self-care aimed at containing clinical material", isCorrect: true },
            { text: "Professional self-care", isCorrect: false }
          ],
          explanation: "Transition rituals—changing clothes, taking a different route home, brief mindfulness—are cognitive strategies that help clinicians create boundaries between work and personal life, preventing clinical material from permeating all areas of life."
        },
        {
          question: "Clinicians who define their entire identity through their professional role are:",
          type: "multipleChoice",
          options: [
            { text: "More committed to their clients", isCorrect: false },
            { text: "More vulnerable to burnout when professional functioning is threatened", isCorrect: true },
            { text: "Better therapists overall", isCorrect: false },
            { text: "Less likely to experience compassion fatigue", isCorrect: false }
          ],
          explanation: "When professional identity is the sole source of self-worth, any threat to clinical functioning (a bad outcome, a complaint, burnout symptoms) threatens the clinician's core sense of self. Diverse identity sources provide psychological resilience."
        },
        {
          question: "Evidence-based self-care requires strategies across which domains?",
          type: "multipleChoice",
          options: [
            { text: "Only physical wellness", isCorrect: false },
            { text: "Professional, personal (physical/relational), cognitive, and meaning-making", isCorrect: true },
            { text: "Only professional development", isCorrect: false },
            { text: "Only stress reduction techniques", isCorrect: false }
          ],
          explanation: "Comprehensive self-care spans multiple domains: professional strategies (caseload, supervision), personal wellness (physical health, relationships), cognitive practices (containment, challenging perfectionism), and meaning-making. Strategies in just one domain are insufficient."
        },
        {
          question: "Individual self-care strategies are best understood as:",
          type: "multipleChoice",
          options: [
            { text: "Sufficient on their own to prevent all occupational hazards", isCorrect: false },
            { text: "Unnecessary if the organization provides adequate support", isCorrect: false },
            { text: "Necessary but insufficient without organizational-level changes", isCorrect: true },
            { text: "Less important than organizational interventions", isCorrect: false }
          ],
          explanation: "Maslach's research shows that burnout is primarily an organizational problem. Individual self-care strategies are essential but cannot compensate for unsustainable organizational conditions. Both individual and organizational approaches are needed."
        }
      ],
      quizPassThreshold: 0.8
    }
  ],

  // ═══════════════════════════════════════════════════
  // FINAL ASSESSMENT
  // ═══════════════════════════════════════════════════
  assessment: {
    title: "Final Assessment",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Burnout differs from compassion fatigue primarily in that burnout:",
        type: "multipleChoice",
        options: [
          { text: "Develops gradually from chronic workplace stress and is not specific to helping professions", isCorrect: true },
          { text: "Only affects new clinicians", isCorrect: false },
          { text: "Involves changes to worldview and cognitive schemas", isCorrect: false },
          { text: "Cannot be prevented", isCorrect: false }
        ],
        explanation: "Burnout develops gradually from chronic workplace stressors and can affect anyone in a demanding job. Compassion fatigue is specific to helping professions and involves the emotional cost of empathic engagement with suffering clients."
      },
      {
        question: "Vicarious traumatization is characterized by:",
        type: "multipleChoice",
        options: [
          { text: "Physical exhaustion from excessive work hours", isCorrect: false },
          { text: "Enduring changes in the clinician's cognitive schemas about safety, trust, and control", isCorrect: true },
          { text: "Acute stress reactions following a single session", isCorrect: false },
          { text: "Administrative frustration with organizational policies", isCorrect: false }
        ],
        explanation: "Pearlman and Saakvitne defined vicarious traumatization as involving fundamental, enduring shifts in the clinician's worldview—particularly beliefs about safety, trust, control, esteem, and intimacy—from cumulative exposure to client trauma material."
      },
      {
        question: "The ProQOL model identifies which three dimensions of professional quality of life?",
        type: "multipleChoice",
        options: [
          { text: "Empathy, resilience, and professional identity", isCorrect: false },
          { text: "Compassion satisfaction, burnout, and secondary traumatic stress", isCorrect: true },
          { text: "Emotional exhaustion, depersonalization, and reduced accomplishment", isCorrect: false },
          { text: "Self-care, supervision, and consultation", isCorrect: false }
        ],
        explanation: "Stamm's ProQOL model measures compassion satisfaction, burnout, and secondary traumatic stress. The third option describes Maslach's three components of burnout specifically."
      },
      {
        question: "Secondary traumatic stress symptoms most closely resemble:",
        type: "multipleChoice",
        options: [
          { text: "Major depressive disorder", isCorrect: false },
          { text: "Generalized anxiety disorder", isCorrect: false },
          { text: "Post-traumatic stress disorder from indirect trauma exposure", isCorrect: true },
          { text: "Substance use disorder", isCorrect: false }
        ],
        explanation: "STS symptoms parallel PTSD—intrusive thoughts, avoidance, hyperarousal, and numbing—but arise from secondary exposure to trauma through clinical work rather than direct personal experience."
      },
      {
        question: "According to the ACA Code of Ethics, clinician self-care is:",
        type: "multipleChoice",
        options: [
          { text: "A personal preference with no ethical implications", isCorrect: false },
          { text: "An ethical obligation requiring self-monitoring for impairment", isCorrect: true },
          { text: "Required only for clinicians working with trauma", isCorrect: false },
          { text: "The responsibility of the clinician's employer", isCorrect: false }
        ],
        explanation: "ACA Code Section C.2.g requires counselors to monitor themselves for impairment and refrain from providing services when impaired, establishing self-care as an ethical obligation integral to competent practice."
      },
      {
        question: "The most commonly identified physical warning sign of clinician impairment is:",
        type: "multipleChoice",
        options: [
          { text: "Chronic fatigue that doesn't resolve with rest", isCorrect: true },
          { text: "Improved physical fitness", isCorrect: false },
          { text: "Increased appetite", isCorrect: false },
          { text: "Enhanced sleep quality", isCorrect: false }
        ],
        explanation: "Chronic, unrelenting fatigue is often the earliest physical indicator of clinician impairment. When fatigue persists despite adequate rest, the body is signaling unsustainable stress levels."
      },
      {
        question: "Depersonalization in the context of clinician burnout involves:",
        type: "multipleChoice",
        options: [
          { text: "Losing one's sense of personal identity", isCorrect: false },
          { text: "Developing cynical, detached attitudes toward the clients one serves", isCorrect: true },
          { text: "A dissociative experience during sessions", isCorrect: false },
          { text: "Difficulty with personal relationships only", isCorrect: false }
        ],
        explanation: "In Maslach's burnout framework, depersonalization specifically refers to developing cynicism and emotional detachment toward clients—the people the clinician is ethically obligated to serve with care and empathy."
      },
      {
        question: "Maslach's research demonstrates that burnout is primarily:",
        type: "multipleChoice",
        options: [
          { text: "An individual character flaw", isCorrect: false },
          { text: "An organizational problem requiring systemic solutions", isCorrect: true },
          { text: "Inevitable for all clinicians", isCorrect: false },
          { text: "Caused exclusively by high caseloads", isCorrect: false }
        ],
        explanation: "Maslach's decades of research consistently show that organizational factors—excessive caseloads, inadequate support, lack of autonomy—are stronger predictors of burnout than any individual trait. Burnout is fundamentally a systemic issue."
      },
      {
        question: "The single most impactful professional self-care strategy identified in the research is:",
        type: "multipleChoice",
        options: [
          { text: "Meditation practice", isCorrect: false },
          { text: "Annual vacations", isCorrect: false },
          { text: "Caseload management—size, composition, and scheduling", isCorrect: true },
          { text: "Changing jobs regularly", isCorrect: false }
        ],
        explanation: "Research consistently identifies caseload size and composition as among the strongest predictors of burnout and compassion fatigue, making thoughtful caseload management the most impactful professional self-care strategy."
      },
      {
        question: "Quality supervision supports self-care by:",
        type: "multipleChoice",
        options: [
          { text: "Providing space to process emotional impact and offering external check on impairment", isCorrect: true },
          { text: "Focusing exclusively on administrative compliance", isCorrect: false },
          { text: "Replacing the need for personal self-care practices", isCorrect: false },
          { text: "Requiring clinicians to demonstrate perfect clinical performance", isCorrect: false }
        ],
        explanation: "Supervision that addresses the clinician's internal experience—not just case management—provides emotional processing, normalization, and external perspective on impairment, serving multiple self-care functions simultaneously."
      },
      {
        question: "Clinicians at heightened risk for boundary violations include those who:",
        type: "multipleChoice",
        options: [
          { text: "Maintain diverse relational connections outside of work", isCorrect: false },
          { text: "Derive primary relational satisfaction from client relationships", isCorrect: true },
          { text: "Engage in regular peer consultation", isCorrect: false },
          { text: "Have diverse sources of professional identity", isCorrect: false }
        ],
        explanation: "When clinicians rely on client relationships for their primary relational nourishment, they are at risk for boundary violations—seeking personal needs through professional relationships—and emotional depletion from the inherently one-directional nature of therapeutic relationships."
      },
      {
        question: "Cognitive self-care strategies include all of the following EXCEPT:",
        type: "multipleChoice",
        options: [
          { text: "Transition rituals between work and personal life", isCorrect: false },
          { text: "Challenging perfectionism and the savior complex", isCorrect: false },
          { text: "Increasing total client contact hours", isCorrect: true },
          { text: "Maintaining diverse sources of identity beyond the clinical role", isCorrect: false }
        ],
        explanation: "Increasing client contact hours is the opposite of self-care—it increases exposure to occupational hazards. Cognitive self-care involves containment strategies, challenging unhelpful beliefs, and maintaining identity diversity."
      },
      {
        question: "Compassion satisfaction is best defined as:",
        type: "multipleChoice",
        options: [
          { text: "The absence of burnout symptoms", isCorrect: false },
          { text: "The pleasure and fulfillment derived from doing clinical work effectively", isCorrect: true },
          { text: "Feeling sorry for one's clients", isCorrect: false },
          { text: "Satisfaction with one's salary and benefits", isCorrect: false }
        ],
        explanation: "In the ProQOL model, compassion satisfaction refers specifically to the positive aspects of helping—the sense of meaning, purpose, and competence derived from effective clinical work. It serves as a protective buffer against burnout and STS."
      },
      {
        question: "The ProQOL-5 should be administered how often for effective ongoing self-monitoring?",
        type: "multipleChoice",
        options: [
          { text: "Once at the beginning of one's career", isCorrect: false },
          { text: "Only when experiencing symptoms", isCorrect: false },
          { text: "Quarterly, with tracking of scores over time", isCorrect: true },
          { text: "Annually during license renewal", isCorrect: false }
        ],
        explanation: "Quarterly administration allows clinicians to track trends in their compassion satisfaction, burnout, and STS scores over time, detecting gradual shifts that might otherwise go unnoticed until they become severe."
      },
      {
        question: "An effective self-care plan should include strategies across:",
        type: "multipleChoice",
        options: [
          { text: "Only the professional domain", isCorrect: false },
          { text: "Only physical wellness", isCorrect: false },
          { text: "Professional, personal, cognitive, and meaning-making domains", isCorrect: true },
          { text: "Only stress reduction techniques", isCorrect: false }
        ],
        explanation: "Comprehensive self-care requires strategies across multiple domains—professional (caseload, supervision), personal (physical health, relationships), cognitive (containment, challenging beliefs), and meaning-making. No single domain is sufficient on its own."
      }
    ]
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('interactivecourses').updateOne(
      { slug: SLUG },
      { $set: { ...COURSE, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(result.upsertedCount ? '✅ Created' : '♻️ Updated', SLUG);
    await mongoose.disconnect();
  } catch (err) { console.error('❌', err); process.exit(1); }
}

seed();
