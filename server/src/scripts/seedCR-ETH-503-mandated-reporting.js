import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-eth-503-mandated-reporting';

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DATA
// ─────────────────────────────────────────────────────────────────────────────

const COURSE = {
  courseCode: 'CR-ETH-503',
  title: 'Mandated Reporting: Gray Areas and Clinical Decision-Making',
  slug: 'cr-eth-503-mandated-reporting',
  ceHours: 3,
  category: 'ethics',
  difficulty: 'intermediate',
  isPublished: false,
  status: 'draft',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  description: 'This course provides a comprehensive examination of mandated reporting obligations for licensed mental health professionals. Through case examples, legal analysis, and clinical decision-making frameworks, participants will gain confidence navigating ambiguous disclosures, diverse client populations, and the ethical tensions inherent in mandatory reporting. The course emphasizes practical tools for documentation, consultation, and therapeutic alliance repair.',
  learningObjectives: [
    'Identify the federal and state legal foundations underpinning mandatory reporting obligations for mental health professionals.',
    'Apply the "reasonable suspicion" standard to ambiguous clinical disclosures involving child abuse, elder abuse, dependent adult abuse, and domestic violence.',
    'Distinguish between mandatory and permissive reporting jurisdictions for domestic violence and articulate how each framework affects clinical decision-making.',
    'Implement structured consultation and documentation protocols before, during, and after filing a mandated report.',
    'Adapt reporting practices for special populations including LGBTQ+ youth, undocumented clients, and clients with disabilities.',
    'Develop therapeutic strategies to maintain and repair the working alliance following a mandated report.',
  ],
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC',
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC',
  },
  approvals: [
    {
      body: 'NBCC',
      number: '#7760',
      hourBreakdown: [{ label: 'core', hours: 3 }],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────────
  // SECTIONS
  // ───────────────────────────────────────────────────────────────────────────
  sections: [
    // =========================================================================
    // SECTION 0 — Introduction
    // =========================================================================
    {
      title: 'Introduction: The Clinician at the Crossroads',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction: The Clinician at the Crossroads',
          subtitle: 'Legal obligations, ethical tensions, and the weight of the report',
          sectionNumber: 1,
          bannerImage: '',
          bannerAlt: '',
        },
        {
          type: 'text',
          content: `<p>Every licensed mental health professional will eventually reach the same uncomfortable moment: a client discloses something that may — or may not — cross the threshold that triggers a legal duty to report{{alert:mandatory:mandatory-report}}. Perhaps a child mentions that her stepfather "gets really angry and hits things." Perhaps an elderly man admits that his caregiver sometimes forgets to bring his medication. Perhaps a woman describes a violent altercation at home and then insists it was a "one-time thing" and begs you not to call anyone.</p>

<p>These are not hypothetical edge cases. They are the daily reality of clinical work, and they illustrate why mandated reporting{{callout:mandatory-report}} is one of the most ethically complex areas of mental health practice. The law is unambiguous in one direction — clinicians are required to report — but maddeningly vague about when exactly that obligation activates. The result is a gap between legal mandate and clinical judgment that every practitioner must navigate alone, often in real time, with incomplete information and a therapeutic relationship in the balance.</p>

<p>This course was designed to help you close that gap. We will examine the legal foundations of mandatory reporting at the federal and state levels, explore the clinical gray areas where most reporting decisions actually live, and give you structured frameworks for consultation, documentation, and alliance repair. We will also address the populations most frequently overlooked in standard training: LGBTQ+ youth, undocumented clients, clients with disabilities, and clients who have been reported before and carry deep mistrust of the system as a result.</p>

<p>Mandatory reporting is not a disruption to therapy — it is an act of therapy when approached with intention, transparency, and a commitment to the client's long-term safety. The goal of this course is not to make you fearless about reporting; appropriate caution is clinically healthy. The goal is to make you competent, confident, and consistent so that when the moment arrives, you are ready to do the right thing in the right way for the right reasons.</p>

<p>As you move through this material, you will encounter case vignettes, decision frameworks, interactive activities, and knowledge checks designed to reinforce both the factual content and the clinical application. Take your time with the reflection exercises — the discomfort they surface is exactly the productive tension that mandated reporting training is meant to create.</p>`,
        },
        {
          type: 'videoEmbed',
          title: 'Overview: Navigating Mandatory Reporting in Clinical Practice',
          videoUrl: '',
          videoProvider: 'youtube',
          description: 'This introductory video frames the central ethical tensions in mandated reporting and previews the clinical decision-making tools covered throughout the course.',
        },
        {
          type: 'imageText',
          title: 'The Four Pillars of Mandated Reporting Competence',
          content: `<p>Competent mandated reporting rests on four interconnected pillars that we will develop across this course. <strong>Legal literacy</strong> means understanding not just that you are required to report, but the specific statutory thresholds, timelines, immunity provisions, and penalties in your jurisdiction. <strong>Clinical judgment</strong> is the capacity to apply the "reasonable suspicion" standard to ambiguous disclosures without waiting for certainty that may never come. <strong>Process integrity</strong> encompasses documentation, consultation, and the mechanics of making the report itself — steps that protect both your client and your license. Finally, <strong>relational repair</strong> refers to the therapeutic skills needed to rebuild trust after a report, because clients who feel betrayed are clients who disengage from services they desperately need.</p>

<p>These four pillars are not sequential; they operate simultaneously in every mandated reporting situation. A clinician with strong legal literacy but poor relational skills may make technically correct reports that nonetheless drive clients out of treatment. A clinician with excellent therapeutic instincts but shaky legal knowledge may delay reporting in ways that expose them to liability and, more importantly, leave clients in harm's way. This course asks you to develop all four competencies in parallel.</p>`,
          image: '',
          imageAlt: 'Four interlocking pillars representing legal literacy, clinical judgment, process integrity, and relational repair in mandated reporting practice',
          imagePosition: 'right',
        },
        {
          type: 'text',
          content: `<p>Before we move into the legal architecture, it is worth naming the emotional reality that surrounds this work, because that reality shapes how clinicians actually behave in the moment of decision. Mandated reporting is rarely experienced as a neutral administrative task. It activates the clinician's own anxiety about being wrong, about damaging a relationship they have worked hard to build, about exposing a family to a system whose outcomes they cannot control, and about facing the consequences of a misjudgment in either direction. These feelings are not signs of professional weakness; they are the predictable human response to being asked to make a high-stakes decision under conditions of genuine uncertainty. A central aim of this course is to give those feelings a place to live alongside competent action rather than allowing them to drive avoidance, paralysis, or impulsive over-reaction.</p>

<p>It also helps to understand why the law was constructed the way it was. The mandatory reporting framework that exists across the United States today emerged from a specific historical recognition: that abuse and neglect of children and vulnerable adults were chronically invisible to the systems that could intervene, precisely because the professionals most likely to encounter signs of harm had no clear obligation to act, and often had powerful incentives — confidentiality, fear of being wrong, reluctance to intrude on family life — not to. The mandated reporter laws were a deliberate policy choice to convert a permissible response into a required one, shifting the default from silence to disclosure. Understanding this history reframes the obligation: it is not an imposition on the therapeutic relationship invented by overzealous regulators, but a societal decision that certain harms are too consequential to leave to individual discretion.</p>

<p>This course is organized around the recognition that competent reporting is learnable and that the difficulty lies less in the rare obvious case than in the common ambiguous one. Across the sections that follow, we move deliberately from the legal foundations that define the obligation, into the gray areas where clinical judgment must be exercised, and finally into the documentation, consultation, and relational practices that turn a legally adequate report into a clinically excellent one. Each section builds on the last, and each is designed to leave you not merely informed about your duties but genuinely more capable of carrying them out under pressure.</p>

<p>One organizing principle deserves to be stated at the outset and returned to throughout: the goal of mandated reporting is the safety and wellbeing of a vulnerable person, and every framework, checklist, and decision rule in this course is in service of that goal. When the rules feel abstract or the documentation feels burdensome, returning to that purpose clarifies the work. The child who is being hit, the elder who is being defrauded, the dependent adult who is being neglected — these are the people the system exists to protect, and the clinician's report is frequently the single hinge on which their access to protection turns.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'How to Use This Course',
              content: `<p>This course interleaves expository teaching with interactive elements designed to consolidate learning: case vignettes that place you in realistic decision points, knowledge checks that test factual recall, reflection prompts that ask you to examine your own clinical instincts, and decision-tree scenarios that let you experience the branching consequences of different choices. Engage with each element rather than skimming to the assessment. The reflection prompts in particular are not busywork — research on adult learning consistently shows that retrieval practice and personally meaningful application produce far more durable learning than passive reading. When a reflection asks you to recall a past clinical situation, take the time to do so; the discomfort that surfaces is the productive friction that makes the material stick.</p>`,
            },
            {
              title: "Why the 'Gray Areas' Framing Matters",
              content: `<p>Most mandated reporting training is built around clear-cut examples: the child with cigarette burns, the elder with stacks of unpaid bills and a caregiver who has emptied their bank account. These cases are important, but they are not where clinicians actually struggle. The struggle lives in the ambiguous disclosure — the offhand comment, the partial story, the recantation, the culturally unfamiliar parenting practice, the client who begs you not to call. By foregrounding these gray areas rather than the obvious cases, this course aims to build skill where skill is actually needed. A clinician who can navigate ambiguity competently can certainly handle the clear case; the reverse is not true.</p>`,
            },
            {
              title: 'A Note on Jurisdictional Variation',
              content: `<p>Throughout this course you will encounter the repeated caution that specific statutory requirements vary by state. This is not an evasion; it is an accurate description of the legal landscape and a deliberate teaching choice. Rather than memorizing the details of any one state's law — which may be irrelevant to your practice and may change — you will learn the universal principles that apply everywhere and the method for researching the specific requirements of any jurisdiction in which you practice. This approach is far more durable and far more useful for the multi-state, telehealth-enabled reality of contemporary mental health practice. Where this course gives general figures or timeframes, treat them as typical ranges to verify against your own state's statute, not as authoritative legal advice.</p>`,
            },
            {
              title: 'The Relationship Between Confidentiality and the Duty to Report',
              content: `<p>Many clinicians experience mandated reporting as a violation of the confidentiality that sits at the heart of the therapeutic relationship, and that tension is real but resolvable. Confidentiality has never been absolute. From the earliest articulations of professional ethics, confidentiality has been understood to yield in defined circumstances where its protection would enable serious harm — the duty to warn or protect, the response to imminent risk of suicide, and the obligation to report abuse of the vulnerable. Mandated reporting is one of these recognized limits, and it is disclosed to clients as part of informed consent precisely so that confidentiality and its boundaries are understood from the outset. Framed this way, reporting does not betray the therapeutic contract; it honors the explicit terms of a contract that was always bounded by the safety of others. The skill the clinician must develop is the ability to hold both commitments at once — a deep, genuine respect for the client's privacy and a clear, non-apologetic understanding that this respect operates within limits the client was told about and that exist to protect those who cannot protect themselves.</p>`,
            },
          ],
        },
      
{ type: 'multipleChoice', question: "The legal threshold that triggers a mandated report of suspected child abuse in most U.S. jurisdictions is:", options: [{ text: "Proof beyond a reasonable doubt", isCorrect: false }, { text: "The client’s explicit admission", isCorrect: false }, { text: "Reasonable suspicion", isCorrect: true }, { text: "A court order compelling the report", isCorrect: false }], correctAnswer: 2, explanation: "Mandated reporting statutes require a report when the clinician has reasonable cause to suspect abuse or neglect—not proof, not certainty, and not a client admission." },
{ type: 'multipleChoice', question: "When a counselor is unsure whether an ambiguous disclosure meets the reporting threshold, the best practice is to:", options: [{ text: "Wait indefinitely until certainty is achieved", isCorrect: false }, { text: "Never report, to preserve the therapeutic alliance", isCorrect: false }, { text: "Consult, document the reasoning, and report when reasonable suspicion exists", isCorrect: true }, { text: "Ask the client to decide whether a report should be filed", isCorrect: false }], correctAnswer: 2, explanation: "Consultation and contemporaneous documentation support sound clinical judgment; once reasonable suspicion exists the duty to report attaches regardless of alliance concerns." }
],
    },

    // =========================================================================
    // SECTION 1 — Legal Foundations and the Duty to Report
    // =========================================================================
    {
      title: 'Legal Foundations and the Duty to Report',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Legal Foundations and the Duty to Report',
          subtitle: 'Federal mandates, state variation, and who bears the obligation',
          sectionNumber: 2,
          bannerImage: '',
          bannerAlt: '',
        },
        {
          type: 'text',
          content: `<p>The legal architecture of mandatory reporting in the United States is a layered structure built on federal floors and state ceilings, meaning that federal law establishes minimum standards and states are free — and have generally chosen — to enact broader protections. Understanding this architecture is not merely an academic exercise; it has direct clinical implications because your specific obligations depend entirely on the statutes in force in the state where you are licensed and where you practice.</p>

<p>The federal foundation was laid with the <strong>Child Abuse Prevention and Treatment Act (CAPTA)</strong>, first enacted in 1974 and reauthorized most recently through the CAPTA Reauthorization Act of 2010. CAPTA conditions federal funding to states on the enactment of mandatory child abuse and neglect reporting laws, effectively nationalizing the concept of the mandated reporter. The law defines child abuse and neglect at a minimum threshold but explicitly gives states latitude to adopt more expansive definitions. This is why child abuse reporting requirements vary so substantially from state to state: what counts as reportable in one jurisdiction may fall below the reporting threshold in another.</p>

<p>At the federal level, the <strong>Elder Justice Act of 2010</strong> — embedded in the Affordable Care Act — similarly established a national framework for elder abuse reporting, though unlike CAPTA it does not uniformly mandate reporting for all categories of professionals. Instead, it establishes grant programs and infrastructure while leaving mandatory reporting obligations largely to state law. This creates an important asymmetry: virtually every state has a robust child abuse mandatory reporting statute that explicitly names mental health professionals, but elder abuse and dependent adult abuse statutes are far more variable in their coverage and requirements.</p>

<p>For domestic violence, the federal landscape is shaped primarily by the <strong>Violence Against Women Act (VAWA)</strong>, first enacted in 1994 and most recently reauthorized in 2022. VAWA does not itself mandate reporting by mental health professionals; rather, it funds services, training, and legal protections for survivors. Mandatory domestic violence reporting laws, where they exist, are entirely creatures of state statute, and they represent one of the most contentious areas in mental health ethics precisely because they can conflict directly with survivor autonomy and safety planning.</p>

<p>Mental health professionals in every state are enumerated as mandated reporters for child abuse. The legal standard that activates the duty is critical: you do not need <em>proof</em> of abuse. You do not need a confession. You need <strong>reasonable suspicion</strong>{{callout:reasonable-suspicion}} — a subjective but legally defined threshold that asks whether a reasonable person with your training and experience, upon receiving the information you have received, would suspect that abuse or neglect has occurred or is occurring. Proof is for courts; suspicion is for clinicians. This distinction, while conceptually clear, is persistently difficult to apply in practice, which is why the gray areas explored throughout this course matter so much.</p>

<p>Mandatory reporting is also, critically, a <strong>personal obligation</strong>. You cannot satisfy your duty by telling your supervisor and relying on them to report. Many states explicitly provide that each mandated reporter who has reasonable suspicion must make their own report. Consulting your supervisor{{alert:supervisor}} is clinically appropriate and often required by agency policy; it does not, however, transfer your legal obligation. If your supervisor disagrees that a report is warranted and you still have reasonable suspicion, you face a genuine ethical and legal dilemma that must be resolved in favor of the reporting obligation. This is not hypothetical: practitioners have faced licensing board sanctions for failing to report after being told by a supervisor that reporting was unnecessary.</p>

<p>Understanding the immunity provisions embedded in most mandatory reporting statutes is equally important. All 50 states provide some form of immunity from civil and criminal liability for mandated reporters who make good-faith reports, even if the report is ultimately not substantiated. "Good faith" in this context means the report was made based on genuine reasonable suspicion, not malice or fabrication. This immunity does not protect bad-faith reports designed to harass or retaliate against a client; it protects the clinician acting within their professional and legal role. Fear of being wrong — a common reason clinicians hesitate — is addressed directly by the immunity framework.</p>`,
          callouts: {
            'reasonable-suspicion': {
              label: 'Reasonable Suspicion',
              type: 'definition',
              body: 'The legal threshold that activates the duty to report: a belief, grounded in the mandated reporter\'s training and experience, that abuse or neglect has occurred or is occurring. It does not require proof, a confession, or certainty.',
            },
          },
        },
        {
          type: 'callout',
          calloutType: 'ethics',
          title: 'Ethical Imperative: The Duty Is Not Discretionary',
          content: `<p>A common misconception among new clinicians is that mandatory reporting is a judgment call — that the duty activates only when the clinician is sufficiently convinced that abuse has occurred. This is incorrect as a matter of law and ethics. The American Counseling Association (ACA) Code of Ethics (B.2.a) and the NASW Code of Ethics both recognize that when legal duties conflict with confidentiality, the legal duty prevails. The NBCC Code of Ethics similarly requires compliance with applicable laws. The duty to report is not a clinical recommendation that you weigh against other factors; it is a legal mandate with specific penalties — including loss of licensure — for non-compliance. The gray areas in mandated reporting concern the <em>threshold</em> for reasonable suspicion, not whether to comply once that threshold is reached.</p>`,
        },
        {
          type: 'text',
          content: `<p>The population-specific dimensions of mandated reporting law are among the most practically important for licensed clinicians to understand. Most training focuses on child abuse because CAPTA made it universal, but mental health professionals increasingly serve populations where elder abuse, dependent adult abuse, and domestic violence reporting obligations are equally relevant.</p>

<p><strong>Elder abuse</strong> affects an estimated one in ten Americans over the age of 60, according to the National Council on Aging, and is significantly underreported even by mandated reporters. Elder abuse takes multiple forms: physical abuse, emotional or psychological abuse, sexual abuse, financial exploitation, abandonment, and neglect. For clinicians, neglect cases are often the most difficult because they frequently involve self-neglect — a category most states recognize but that creates significant tension with client autonomy principles that run throughout mental health ethics. When an older adult with capacity refuses services, does that constitute neglect? When cognitive impairment compromises capacity, the calculus shifts — but determining capacity in outpatient settings is itself a complex clinical and legal process.</p>

<p><strong>Dependent adult abuse</strong> is typically defined to include adults between 18 and 64 who have a physical or mental limitation that restricts their ability to carry out normal activities or protect their own rights. This category is particularly important for mental health clinicians whose clients may include adults with severe mental illness, intellectual disabilities, or traumatic brain injuries. A client with schizophrenia who is being financially exploited by a family member, or a client with an intellectual disability who describes physical abuse by a paid caregiver, falls squarely within dependent adult abuse statutes in most states — even though many clinicians default to child-abuse-only thinking when the word "abuse" comes up in supervision.</p>

<p>The mechanics of the actual reporting process deserve clinical attention. Most states have a designated reporting hotline for child protective services (CPS), often operated at the county level. Many states also have a parallel adult protective services (APS) hotline for elder and dependent adult abuse. Clinicians should know the specific hotline numbers for their county of practice <em>before</em> the moment of crisis, not during it. Most states require an oral report immediately upon forming reasonable suspicion, followed by a written report within 24 to 72 hours{{alert:protocol}}, depending on jurisdiction. Knowing which form to use and where to send it are not trivial logistical details — they are part of the reporting obligation, and failing to submit the written follow-up can constitute a separate violation even when the oral report was made.</p>

<p>Finally, clinicians should understand that the failure to report is not merely a licensing risk — it can constitute a criminal offense in many states. Several states have enacted misdemeanor or felony provisions for mandatory reporters who knowingly fail to report. While prosecutions of mental health professionals are rare, they have occurred, and the existence of criminal exposure is a powerful illustration of how seriously legislatures regard this obligation. The ethical counselor does not need the threat of criminal prosecution to motivate compliance; the threat exists as a signal of the moral weight society has assigned to protecting vulnerable populations from abuse.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'CAPTA and Child Abuse Reporting: What the Law Actually Requires',
              content: `<p>The Child Abuse Prevention and Treatment Act (CAPTA) requires states to enact laws that mandate reporting by designated professionals — including mental health providers — when there is reasonable suspicion of child abuse or neglect. The statute defines "child abuse and neglect" to include any recent act or failure to act by a parent or caretaker resulting in death, serious physical or emotional harm, sexual abuse or exploitation, or an act that presents an imminent risk of serious harm. States may and do adopt broader definitions. CAPTA also requires states to maintain a statewide child abuse registry and to conduct investigations of reported abuse. Critically, CAPTA mandated reporters are not permitted to conduct their own investigation before reporting — the obligation attaches at the point of reasonable suspicion, and the investigation is the responsibility of CPS, not the clinician.</p>`,
            },
            {
              title: 'Elder Justice Act and Adult Protective Services: The Patchwork Problem',
              content: `<p>Unlike CAPTA's uniform national framework for child abuse, elder abuse mandatory reporting exists in a patchwork of state laws with wildly divergent scopes, thresholds, and covered reporters. As of 2023, approximately 42 states have mandatory reporting laws for elder abuse, but the category of "mandated reporter" varies: some states name all adults; others specify healthcare professionals, long-term care employees, or law enforcement; still others include mental health professionals explicitly. Clinicians must look up the specific statute in their state rather than relying on generalizations. The National Center on Elder Abuse (ncea.acl.gov) maintains a state-by-state resource directory. The Elder Justice Act of 2010 created the Elder Justice Coordinating Council and the Adult Protective Services Social Services Block Grant, but it did not create a uniform federal mandatory reporting standard for mental health providers.</p>`,
            },
            {
              title: 'Immunity Provisions: Good Faith Protects You',
              content: `<p>Every state provides statutory immunity from civil and criminal liability for mandated reporters who make good-faith reports of suspected abuse or neglect. In most states this immunity applies even when the report is not substantiated after investigation. "Good faith" is generally construed to mean the reporter genuinely believed they had reasonable suspicion at the time of the report — not that they were correct. The immunity does not protect false reports made with knowledge of their falsity or with malicious intent. Practically speaking, this means that clinicians who are uncertain but have legitimate clinical reasons to suspect abuse are legally better protected by reporting than by not reporting. The immunity framework was specifically designed to remove the chilling effect of potential liability from the decision to report.</p>`,
            },
            {
              title: 'Failure to Report: Consequences for Mental Health Professionals',
              content: `<p>Failing to make a mandated report can result in multiple overlapping consequences. At the licensing level, most state licensing boards for counselors, social workers, and marriage and family therapists treat failure to report as a violation of professional standards and ethical codes, potentially resulting in reprimand, suspension, or revocation of licensure. At the criminal level, a majority of states have enacted misdemeanor provisions for knowing failure to report; some states classify the offense as a felony for cases involving serious bodily harm or death. Civil liability to the abused person or their family is also possible in some jurisdictions, though the availability of civil suits against mandated reporters varies by state. Finally, employment consequences — including termination — are common when agency policies require reporting and the clinician did not comply.</p>`,
            },
          ],
        },
        {
          type: 'imageText',
          title: 'Who Is a Mandated Reporter? The Scope of the Obligation',
          content: `<p>In all 50 states, licensed mental health professionals — including licensed professional counselors (LPCs), licensed clinical social workers (LCSWs), licensed marriage and family therapists (LMFTs), psychologists, and psychiatrists — are enumerated mandated reporters for child abuse and neglect. The obligation attaches to the professional role, not the employment setting, which means a therapist in private practice has the same reporting duty as one employed by a hospital or school. Graduate students and interns operating under supervision are generally covered as well, although the specific statutory language varies.</p>

<p>For elder abuse and dependent adult abuse, the picture is more complex. Not all states explicitly name mental health professionals as mandated reporters in their adult abuse statutes; practitioners should never assume their coverage status without reading the actual statute. Several national professional associations, including the ACA and NASW, have published jurisdiction-specific guidance on who is covered under adult protective services reporting laws. When in doubt, consulting with your professional association's ethics hotline or a licensed attorney familiar with mental health law in your state is the appropriate step.</p>`,
          image: '',
          imageAlt: 'A diagram showing the categories of licensed mental health professionals designated as mandated reporters under state and federal law',
          imagePosition: 'left',
        },
        {
          type: 'text',
          content: `<p>Because the core obligation is uniform but its details are not, every clinician needs a reliable method for researching the specific reporting law of any state in which they hold a license or serve a client. This skill has become essential rather than optional in the telehealth era, when a single practice may touch clients in three or four states within a single week. The good news is that the relevant statutes are public, freely accessible, and summarized by authoritative bodies in formats designed for exactly this purpose. The clinician's task is not to read raw statutory text — though that is the ultimate source of truth — but to know where to find reliable, current summaries and how to verify them.</p>

<p>The most efficient starting point for child abuse reporting is the Child Welfare Information Gateway, a service of the U.S. Children's Bureau, which publishes a state-by-state summary of mandatory reporting statutes updated annually. For each state, these summaries identify who is a mandated reporter, what standard triggers the duty, the required content and timing of reports, the designated agency to receive them, and the penalties for failure to report. For elder and dependent adult abuse, the National Center on Elder Abuse maintains a parallel directory of state resources and reporting numbers. For domestic violence reporting — the most variable category — the relevant state coalition against domestic violence and the state's statutes themselves are the most reliable sources, because national summaries of domestic violence reporting law are less consistently maintained.</p>

<p>Knowing where the summaries live is only half the method; verification is the other half. Statutory summaries can lag behind legislative change, and a clinician's reliance on an outdated summary will not excuse a reporting failure. Best practice is to corroborate any summary against at least one additional authoritative source — the state licensing board's published guidance, the state's official statute database, or direct consultation with the state agency that receives reports. When a clinician is uncertain about a specific obligation in a specific state, calling that state's reporting hotline and asking the intake staff is both appropriate and informative; intake workers field these questions routinely and can clarify procedural requirements. Documenting the date and source of any law research the clinician relies upon converts a private effort into a defensible professional practice.</p>

<p>The practical workflow for a clinician entering practice in a new state, or onboarding a telehealth client in an unfamiliar jurisdiction, can be reduced to a short sequence. First, locate the state's mandatory reporting summary on the Child Welfare Information Gateway and, where relevant, the National Center on Elder Abuse. Second, identify the specific hotline numbers for both child protective services and adult protective services in the client's county of residence, not merely the statewide number, because intake is frequently routed at the county level. Third, note the timing requirements for oral and written reports and the form or portal used for the written report. Fourth, confirm the state's stance on domestic violence reporting — mandatory, permissive, or governed by general confidentiality exceptions. Fifth, record this information in a place the clinician can access quickly during a crisis, and date it so it can be refreshed at least annually. A clinician who completes this workflow before the moment of crisis is dramatically better positioned than one who attempts to research the law while a frightened client sits across from them.</p>

<p>Telehealth has not merely complicated the geography of reporting; it has introduced genuinely novel questions that existing statutes were not written to answer. When a clinician in one state observes, over video, a sign of possible abuse in a child who wanders into the frame of a client's session in another state, where does the obligation lie and to whom is the report made? When a client discloses ongoing abuse occurring in a third state where neither the clinician nor the client currently resides, which jurisdiction's hotline is appropriate? These questions rarely have crisp statutory answers, and the prudent course is to err toward reporting in the jurisdiction where the vulnerable person is located and to consult both the relevant state agency and a knowledgeable attorney or ethics resource. The principle that resolves most of these dilemmas is that the obligation follows the vulnerable person and the location of the harm, not the convenience of the clinician. When the jurisdictional analysis is genuinely unclear, making a report to the agency in the location of the alleged victim, while documenting the reasoning, is the defensible default.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Researching Your Own State: A Step-by-Step Method',
              content: `<p>To establish your obligations in any state, work through a consistent sequence. Begin with the Child Welfare Information Gateway state statute summary for child abuse reporting, then locate the National Center on Elder Abuse resource page for adult protective services. Identify whether your profession is explicitly named as a mandated reporter in both the child and adult abuse statutes — do not assume coverage carries over from one category to the other. Record the standard that triggers the duty, the oral and written reporting timeframes, the designated receiving agency, and the county-level hotline numbers. Check the penalty provisions so you understand the stakes. Finally, verify everything against your state licensing board's published guidance, because the board's interpretation governs your license. Treat this as an annual maintenance task, not a one-time effort, and keep a dated record of when you last reviewed each state's requirements.</p>`,
            },
            {
              title: 'Reporting Across State Lines in Telehealth',
              content: `<p>The governing principle for telehealth is that the mandatory reporting obligation generally attaches to the law of the state where the client is physically located at the time of service, because that is where the protective interest and the receiving agency exist. A clinician licensed in one state who serves clients in several others is therefore responsible for understanding and complying with each of those states' reporting laws, not merely the law of the state where they sit. This has concrete operational consequences: the clinician should know each client's physical location at the start of every session, maintain a reference of each relevant state's hotlines and timeframes, and address the applicable reporting law in the informed consent for each client. When a disclosure concerns abuse occurring in yet another state — for example, a client describes harm to a relative who lives elsewhere — the report is generally directed to the agency in the location of the alleged victim. Where the analysis is genuinely ambiguous, consult the relevant state agency and document the reasoning behind the jurisdiction chosen.</p>`,
            },
            {
              title: 'Why County-Level Hotlines Matter',
              content: `<p>Many clinicians know their state's general reporting number but discover, in the moment of crisis, that intake is actually routed through county departments of social services or county child protective units. Calling the wrong number can introduce delay precisely when speed matters, and in some systems the statewide line will simply redirect the caller to the appropriate county, consuming time. The remedy is to identify, in advance, the specific child protective services and adult protective services intake numbers for the county where each client resides, and to keep them readily accessible. For telehealth practices spanning multiple counties or states, maintaining a simple reference document of these numbers — refreshed periodically — is a small investment that pays off precisely when the clinician is least able to research it calmly.</p>`,
            },
            {
              title: 'When Statutes Are Silent or Ambiguous',
              content: `<p>No statute can anticipate every situation a clinician will encounter, and the telehealth era has generated scenarios that existing laws simply do not address cleanly. When the statutory text does not clearly resolve whether or where to report, the clinician should not treat the ambiguity as permission to do nothing. The governing values remain constant even when the rules are unclear: protect the vulnerable person, act in good faith, consult appropriately, and document thoroughly. Practically, this means erring toward reporting rather than withholding, directing the report to the agency in the location of the alleged victim, seeking guidance from the relevant state agency or a knowledgeable attorney, and recording the reasoning that led to the chosen course. Good-faith immunity is designed precisely for situations of uncertainty, and a documented good-faith effort to comply protects the clinician far more reliably than an unexamined decision to wait.</p>`,
            },
          ],
        },
        {
          type: 'text',
          content: `<p>A final dimension of the legal foundation that clinicians frequently overlook is the interaction between mandatory reporting obligations and the requirements imposed by other bodies of law, most notably health information privacy rules and the consent frameworks that govern minors. Mandated reporting is a recognized exception to health information privacy protections, which permit and indeed require disclosure to the appropriate authorities when reporting is legally mandated. A clinician should never decline to report out of a misplaced concern that doing so would violate a client's privacy rights; the privacy framework expressly accommodates legally required disclosures. The clinician's obligation is to disclose only what is necessary to make the report — the relevant facts that establish the concern — rather than the entirety of the clinical record, and to continue protecting the remainder of the client's information under ordinary confidentiality rules.</p>

<p>The consent landscape for minor clients adds another layer that interacts with reporting. In many jurisdictions, adolescents may consent to certain categories of mental health treatment on their own, and the scope of what a parent is entitled to know varies accordingly. None of this alters the mandated reporting obligation, but it shapes the surrounding clinical conversation: a clinician working with an adolescent who has consented to their own treatment must still report suspected abuse, and must navigate the resulting disclosures to parents, guardians, and protective services in a way that respects both the reporting duty and the adolescent's treatment-consent rights. These intersections are precisely the kind of nuance that benefits from consultation and from a clear, documented understanding of the specific rules in the clinician's jurisdiction.</p>

<p>It is also worth emphasizing that the duty to report is forward-looking as well as backward-looking. Reasonable suspicion of abuse that has already occurred triggers the duty, but so does information indicating that a child or vulnerable adult is at imminent risk of harm that has not yet occurred. A disclosure that a caregiver has threatened serious harm, or that conditions in a household are deteriorating toward danger, can establish a reportable concern even in the absence of a completed act of abuse. The protective purpose of the mandatory reporting framework is to intervene before harm becomes irreversible, and the reasonable suspicion standard accommodates this forward-looking function. Clinicians who think of reporting only in terms of harm that has already happened may miss the situations where a timely report can prevent harm altogether — arguably the situations where the report matters most.</p>`,
        },
        {
          type: 'multipleChoice',
          question: 'Under most state mandatory reporting laws, when is a licensed mental health professional required to report suspected child abuse?',
          options: [
            { text: 'Only when the client has directly confirmed that abuse occurred', isCorrect: false },
            { text: 'When the clinician has reasonable suspicion based on observations or disclosures, even without confirmation', isCorrect: true },
            { text: 'Only after the clinician has conducted their own investigation and found corroborating evidence', isCorrect: false },
            { text: 'Only when the suspected perpetrator is a family member living in the same household', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The legal threshold for mandatory reporting is "reasonable suspicion," not certainty or proof. Clinicians are not investigators — the obligation to report is triggered by a reasonable belief that abuse may have occurred, and the investigation is the responsibility of child protective services, not the mental health professional.',
        },
        {
          type: 'text',
          content: `<p>One of the most practically important — and frequently misunderstood — aspects of mandatory reporting law is the distinction between the <strong>oral report</strong> and the <strong>written report</strong>. Most states require both, with the oral report due immediately upon forming reasonable suspicion and the written report due within 24 to 72 hours, depending on jurisdiction. These are not redundant steps; they serve different functions in the CPS or APS intake process. The oral report initiates the agency's response timeline; the written report provides the documentation that the agency uses for case planning, investigation assignment, and record-keeping.</p>

<p>Mental health clinicians frequently make the oral report correctly — they call the hotline, report their suspicion, and receive a case reference number — and then fail to complete the written report, either because they do not know it is required, because their agency has an administrative process that obscures the individual obligation, or because the urgency of the oral report dissipates once the call is made and the follow-up falls through the cracks. Failure to submit the written report is a separate legal violation in most states, even when the oral report was made, and it can have licensing and criminal consequences independent of the oral reporting obligation.</p>

<p>Documentation of the entire process — from the initial disclosure, through the decision to report, through the report itself, through the client conversation about the report — is a critical professional practice standard that we will examine in detail in later sections of this course. For now, the essential point is that your clinical record must reflect not only that you reported, but what information led you to report, when you called, who you spoke with, what case number or reference was assigned, and what steps you took next with the client. This level of documentation protects you, your client, and the integrity of the reporting process.</p>`,
        },
        {
          type: 'flashcardDeck',
          instructions: 'Review these key legal terms and concepts. Click each card to reveal the definition, then mark whether you knew it before moving on.',
          flashcards: [
            {
              front: 'Reasonable Suspicion Standard',
              back: 'The legal threshold activating the duty to report. A mandated reporter must report when, based on their training and experience, they have reasonable grounds to believe abuse or neglect has occurred or is occurring. Proof and certainty are NOT required.',
            },
            {
              front: 'CAPTA (Child Abuse Prevention and Treatment Act)',
              back: 'Federal law enacted in 1974 conditioning federal funding to states on the enactment of mandatory child abuse reporting laws. Defines minimum standards for abuse and neglect; states may adopt broader definitions.',
            },
            {
              front: 'Elder Justice Act of 2010',
              back: 'Federal legislation embedded in the ACA that established national infrastructure for elder abuse prevention and response, including grant programs and coordinating councils. Does NOT create a uniform federal mandatory reporting standard for mental health providers — state statutes govern.',
            },
            {
              front: 'Good Faith Immunity',
              back: 'Statutory protection available in all 50 states shielding mandated reporters from civil and criminal liability for reports made with genuine reasonable suspicion, even when the report is not substantiated. Does not protect knowingly false or malicious reports.',
            },
            {
              front: 'Dependent Adult',
              back: 'Typically defined as an adult age 18–64 who has a physical or mental limitation restricting their ability to carry out normal activities or protect their own rights. Mental health professionals may be mandatory reporters of dependent adult abuse under applicable state law.',
            },
            {
              front: 'Written Report Requirement',
              back: 'A follow-up to the oral report required by most states, typically due within 24–72 hours. Failure to submit the written report is a separate legal violation even when the oral report was made correctly.',
            },
            {
              front: 'Personal Reporting Obligation',
              back: 'The duty to report is individual — telling a supervisor does not transfer or satisfy the clinician\'s legal obligation. If the clinician has reasonable suspicion, they must report personally, even if the supervisor disagrees.',
            },
            {
              front: 'Self-Neglect',
              back: 'A category of elder and dependent adult abuse in most states where an individual is unable or unwilling to care for their own health and safety. Creates ethical tension with client autonomy principles; the obligation to report self-neglect depends on state statute and the client\'s decision-making capacity.',
            },
          ],
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are potential consequences of failing to make a mandated report of suspected child abuse? Select ALL that apply.',
          options: [
            { text: 'Criminal prosecution for a misdemeanor or felony offense', isCorrect: true },
            { text: 'Disciplinary action by the state licensing board, potentially including license revocation', isCorrect: true },
            { text: 'Automatic immunity from civil liability because the report was never filed', isCorrect: false },
            { text: 'Employment termination for violating agency reporting policies', isCorrect: true },
            { text: 'Civil liability to the abused person or their family in some jurisdictions', isCorrect: true },
          ],
          explanation: 'Failure to report can trigger consequences across four domains simultaneously: criminal (misdemeanor or felony in most states), licensing (board discipline), civil (liability in some jurisdictions), and employment (termination for policy violation). Automatic civil immunity does not exist for non-reporters — immunity provisions protect good-faith reporters, not those who fail to report.',
        },
        {
          type: 'reflection',
          question: 'Think about a time — in a placement, clinical role, or supervision — when you encountered a disclosure that made you uncertain whether a report was required. What was the source of your uncertainty? Was it the legal standard, the clinical presentation, or concern about the impact on the therapeutic relationship? How did you ultimately resolve it, and what would you do differently with the legal framework you have just studied?',
          minLength: 100,
        },
        {
          type: 'keyTakeaway',
          title: 'Section 1 Key Takeaways: Legal Foundations',
          takeaways: [
            'CAPTA established the federal floor for mandatory child abuse reporting; elder and dependent adult reporting obligations are governed primarily by state law and vary significantly by jurisdiction.',
            'The duty to report activates at reasonable suspicion — a belief based on training and experience that abuse may have occurred. You are not required to have proof, conduct an investigation, or wait for a disclosure.',
            'The reporting obligation is personal. Consulting your supervisor is appropriate; relying on your supervisor to report in your place is not sufficient.',
            'All 50 states provide good-faith immunity for mandated reporters, even when reports are not substantiated. Fear of being wrong is not a legally valid reason to delay or forgo reporting.',
            'Most states require both an oral report (immediate) and a written report (within 24–72 hours). Failure to submit the written report is a separate violation.',
            'Failure to report can result in criminal charges, licensing board action, civil liability, and employment consequences — sometimes simultaneously.',
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Gray Areas: Clinical Decision-Making at the Threshold
    // =========================================================================
    {
      title: 'Gray Areas: Clinical Decision-Making at the Threshold',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Gray Areas: Clinical Decision-Making at the Threshold',
          subtitle: 'Ambiguous disclosures, cultural context, and the calculus of reasonable suspicion',
          sectionNumber: 3,
          bannerImage: '',
          bannerAlt: '',
        },
        {
          type: 'text',
          content: `<p>If mandatory reporting were simply a matter of recognizing obvious cases of abuse and picking up the phone, there would be no need for advanced training. The genuine clinical challenge — and the source of most mandated reporting errors, both over-reporting and under-reporting — lies in the gray zone between clear evidence of abuse and the complete absence of it. This zone is where most real disclosures live, and navigating it competently requires not only legal knowledge but sophisticated clinical judgment, cultural humility, and a structured decision-making process.</p>

<p>The gray zone is created by several interacting factors. First, the nature of abuse disclosures: clients often reveal abuse incrementally, in fragments, across multiple sessions, sometimes testing the clinician's response before fully disclosing. A child may say "sometimes my uncle gets too rough" without elaborating. An elderly woman may describe her son as "not very patient" when helping her bathe. A client with an intellectual disability may describe something that sounds like sexual contact using language that is indirect or metaphorical. These disclosures create real clinical uncertainty — uncertainty that must be resolved in favor of reporting when reasonable suspicion exists, but that requires clinical judgment to even recognize as potential abuse.</p>

<p>Second, disclosures are frequently partial or recanted. A client may disclose abuse one week and deny it the next, insisting they exaggerated or misremembered. Recantation is extremely common in child sexual abuse cases — research suggests that a majority of children who disclose sexual abuse will recant at some point, often in response to family pressure, fear of disrupting the family system, or distress at the consequences of the initial disclosure. For clinicians, the critical question is whether the original disclosure met the threshold for reasonable suspicion at the time it was made. If it did, the recantation does not eliminate the duty to report — the duty attached when the suspicion formed. What the recantation may do is change the clinical picture in ways that inform the CPS investigation; CPS investigators are trained to handle recantations and do not expect disclosures to be unwavering.</p>

<p>Third, cultural factors profoundly shape both the presentation of potential abuse and the clinician's interpretation of it. Discipline practices that one culture considers normal child-rearing may meet the legal definition of physical abuse in the state where the family lives. Intergenerational living arrangements where an elder is wholly dependent on family caregivers may mask financial exploitation or neglect in ways that are difficult to see without cultural knowledge. The intersection of cultural humility and mandatory reporting is one of the most sensitive and contested areas in mental health ethics, because the risk cuts in both directions: under-reporting based on cultural bias ("that's just how they discipline their children") is a real problem, but so is over-reporting based on failure to distinguish between cultural difference and abuse. The legal standard is the same for all clients — reasonable suspicion of harm — but the clinical skill required to apply that standard equitably across cultural contexts is considerably more demanding.</p>

<p>The question of what constitutes <strong>neglect</strong> deserves particular attention because it is the most common form of child maltreatment reported to CPS and yet the hardest for clinicians to recognize and operationalize. Physical neglect — failure to provide adequate food, clothing, shelter, or supervision — is the most common subtype, but the line between poverty-driven inadequacy and neglect is clinically and legally complex. A family living in a single room with insufficient food is not necessarily neglecting their children if the parents are doing everything in their power to provide — but it may still require a report if children are suffering from inadequate nutrition or living in unsafe conditions. Clinicians are required to report the harm, not to adjudicate the cause. CPS has the capacity to connect families with resources; the clinician's role is to flag the concern.</p>

<p>Emotional neglect and psychological maltreatment are even harder to operationalize. Most states recognize emotional neglect and emotional abuse as reportable, but the definitional thresholds vary considerably. Consistent rejection, terrorizing, isolating, corrupting, or ignoring a child to the degree that it impairs the child's development falls within most statutory definitions — but proving that harm rises to the statutory level from an outpatient counseling session is difficult. Clinicians who see signs of emotional neglect — such as a child who presents as hypervigilant, anxious around adults, starved for attention, or who describes a home environment of constant criticism and emotional unavailability — should consult with supervisors and document their clinical reasoning carefully, even when they ultimately conclude the threshold has not been crossed.</p>

<p>Educational neglect — failure to enroll a child in school or permit them to attend — is recognized by most states and is sometimes overlooked by mental health professionals whose training focuses on physical and emotional harm. For school-age clients who are chronically absent, or for adolescent clients who mention that they have not been in school for months, educational neglect is a potential reporting trigger that merits clinical attention.</p>`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Clinical Caution: Recantation Does Not Erase Reasonable Suspicion',
          content: `<p>One of the most common errors in mandated reporting practice is treating a client's recantation of an abuse disclosure as negating the duty to report. Legally, the duty attaches when reasonable suspicion forms — not after the client's subsequent account is weighed and evaluated. If a child disclosed on Tuesday that her father hit her with a belt and left visible bruises, and on Wednesday she says she "made it up," the reporting duty that attached on Tuesday is not retroactively erased. Research on child sexual abuse disclosure consistently shows recantation rates of 22–40% or higher, most often driven by family loyalty, fear of consequences, or secondary victimization by adults' responses to the disclosure. Clinicians who decline to report based on recantation alone may be in violation of their legal obligation and are certainly leaving the underlying concern unaddressed by the system designed to address it.</p>`,
        },
        {
          type: 'text',
          content: `<p>Domestic violence reporting represents a distinct and particularly complex subset of mandatory reporting ethics, because it involves an additional dimension that child and elder abuse reporting does not: the explicit tension between the reporter's legal obligation and the victim's <strong>autonomy and safety</strong>. In child abuse cases, the child is presumed unable to fully protect their own interests, and the state's parens patriae interest in protecting children is largely uncontested. In domestic violence cases, the victim is an adult with legal capacity, and their assessment of their own safety must be taken seriously in a way that a child's assessment of parental behavior cannot be.</p>

<p>This tension has produced a significant policy debate and genuine legislative variation. The United States currently has a patchwork of domestic violence reporting laws: some states have enacted <strong>mandatory reporting</strong> requirements for domestic violence injuries (often requiring healthcare providers to report injuries believed to be caused by domestic violence, while leaving mental health professionals in a more ambiguous position); others have <strong>permissive reporting</strong> frameworks that allow but do not require clinicians to report to law enforcement; and still others treat domestic violence disclosures as subject to standard confidentiality protections with the same exceptions that apply to other information (e.g., imminent threat of serious bodily harm or death).</p>

<p>The safety planning model developed by the domestic violence advocacy field explicitly recognizes that mandatory reporting to law enforcement can, in some circumstances, increase rather than decrease danger to survivors. Perpetrators who learn that their partner has involved law enforcement may escalate violence, particularly when the report was made without the victim's consent and the victim is not prepared to leave or seek legal protection. This is not a hypothetical concern — the lethality literature on domestic violence consistently identifies police involvement as a precipitant of escalation in some cases, particularly when the perpetrator perceives it as a loss of control. The clinical implication is that when mandatory reporting applies to domestic violence, the conversation with the client about the report must include explicit safety planning and lethality assessment, not merely notification that the report will be made.</p>

<p>For clinicians in permissive-reporting jurisdictions — where domestic violence reporting is allowed but not required — the clinical decision involves balancing multiple factors: the lethality of the current situation (assessed using validated tools such as the Danger Assessment developed by Jacquelyn Campbell), the client's own safety assessment and plan, the presence of children in the home who may be separately reportable as witnesses or victims, and the impact of a report on the therapeutic relationship and the client's future help-seeking behavior. Documentation of this clinical reasoning is essential regardless of the reporting decision reached.</p>

<p>Special populations within the domestic violence context require additional clinical attention. LGBTQ+ survivors face systemic barriers to reporting — including fear of bias in law enforcement responses, lack of culturally competent shelter and services, and reluctance to disclose the nature of the relationship — that can make mandatory reporting more harmful without careful navigation. Undocumented clients may fear that any law enforcement contact creates immigration consequences for themselves or their partner, even when neither party is the perpetrator. Clients with disabilities may face additional access barriers and may be more dependent on the abusive partner for caregiving, making separation more complex and dangerous. These factors do not eliminate reporting obligations where they exist; they require that reporting, when it occurs, be accompanied by culturally informed and individualized safety planning.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'The Reasonable Suspicion Calculus: A Clinical Framework',
              content: `<p>When a disclosure creates uncertainty about whether to report, clinicians benefit from applying a structured framework rather than relying solely on intuition. Consider the following five-factor analysis: (1) <em>Specificity of the disclosure</em> — Does the information point to a specific type of harm to a specific person? Generic statements ("things aren't great at home") require more clinical probing before suspicion can reasonably form; specific details ("he hit me in the face twice last Tuesday") are more directly actionable. (2) <em>Consistency across sessions</em> — Has the client returned to this theme in multiple sessions, even in different forms? Consistency suggests the underlying reality is not a one-time misstatement. (3) <em>Behavioral indicators</em> — Are there observable signs (age-inappropriate sexual knowledge in a child, unexplained injuries, trauma symptoms, hypervigilance) that corroborate the verbal disclosure? (4) <em>Context and vulnerability</em> — Is the alleged victim in a particularly vulnerable position (young age, disability, dependency on the alleged perpetrator)? Vulnerability lowers the threshold for reasonable suspicion appropriately. (5) <em>Professional consultation</em> — What does a peer, supervisor, or ethics consultant believe when presented with the same information? Consultation is not a decision-transfer; it is a data point that informs your own judgment. Applying all five factors does not guarantee certainty, but it produces a reasoned clinical position that can be documented and defended.</p>`,
            },
            {
              title: 'Distinguishing Cultural Practice from Reportable Abuse',
              content: `<p>Cultural humility in mandated reporting does not mean tolerating abuse in the name of cultural respect; it means bringing accurate cultural knowledge to bear on the interpretive process of determining what a disclosure means. The legal standard — whether the child or vulnerable adult has experienced or is at risk of physical or emotional harm — applies uniformly across cultures, but the facts that establish harm may look different across cultural contexts. A disciplinary practice that uses a switch or belt may be normalized within a family's cultural tradition and still constitute physical abuse under the law if it produces injury or significant pain. Conversely, a family's decision to rely on extended family networks for childcare rather than formal schooling may initially appear to be educational neglect but upon investigation reflect a community-based educational approach. The clinician's role is not to apply a culturally assimilationist lens but to assess whether harm is occurring or at risk of occurring and to report when reasonable suspicion exists. Consultation with culturally informed colleagues, cultural liaisons, or professional organizations serving specific communities is appropriate when cultural context is a genuine source of interpretive uncertainty.</p>`,
            },
            {
              title: 'Ambiguous Disclosures: When to Probe and When to Report',
              content: `<p>The question of whether to ask follow-up questions before reporting — and how many — is one of the most practically contested issues in mandated reporting training. On one hand, asking clarifying questions helps the clinician understand the disclosure well enough to make an informed report and to describe the circumstances accurately to CPS. On the other hand, extensive therapeutic interviewing of a child before a CPS report may contaminate the child's testimony and complicate the subsequent forensic interview, which must be conducted by trained investigators using standardized protocols. The professional consensus, endorsed by most major child welfare organizations, is that clinicians should ask only the minimum questions necessary to understand the nature and immediate safety implications of a disclosure, avoid leading or suggestive questions, document the child's exact words rather than interpretations, and then report. The detailed forensic interview is not the clinician's task. Similarly, for elder and dependent adult disclosures, the clinician's job is to report, not to conduct an investigation.</p>`,
            },
            {
              title: 'Medical Neglect: A Special Category',
              content: `<p>Medical neglect — the failure of a parent or caregiver to provide necessary medical treatment for a child or dependent adult — is a reportable form of neglect in all states, but it creates particular ethical complexity when the refusal of treatment is religiously motivated. A majority of states include religious exemption provisions in their child medical neglect statutes, creating a situation where religiously motivated refusal of treatment may be legally exempt from reporting obligations in some circumstances, even when the child is in genuine medical danger. Mental health professionals who encounter such situations should consult with legal counsel or the state licensing board before concluding that a religious exemption applies, because the scope and validity of these exemptions varies by state and has been challenged in court in several jurisdictions. When life-threatening medical neglect is involved — for example, a diabetic child whose parents refuse insulin on religious grounds — the ethical imperative is clear even when the legal landscape is murky, and consultation should not cause undue delay in reporting.</p>`,
            },
          ],
        },
        {
          type: 'imageText',
          title: 'Domestic Violence in Clinical Practice: Mandatory vs. Permissive Reporting States',
          content: `<p>Mental health clinicians practicing across state lines — a reality in the telehealth era — must understand that domestic violence reporting obligations are determined by the law of the state where the client is located at the time of service, not where the clinician is licensed. This creates a significant compliance challenge for teletherapy providers: a clinician licensed in a permissive-reporting state may be providing services to a client in a mandatory-reporting state and may not realize their obligation differs. Before beginning telehealth services with any client, clinicians should verify the applicable law for domestic violence reporting in the client's state of residence and document that verification in the record.</p>

<p>In mandatory-reporting states for domestic violence, the obligation typically applies to healthcare providers who observe or treat injuries reasonably attributable to domestic violence. Whether this obligation extends to mental health professionals who receive verbal disclosures without observable injury is a nuanced legal question that varies by the specific statutory language. When in doubt, the appropriate response is to consult with a licensed attorney in the client's state or with your professional association's ethics hotline, document the consultation, and err toward reporting. The immunity provisions that protect child abuse reporters generally apply to domestic violence reporters as well in mandatory-reporting states.</p>`,
          image: '',
          imageAlt: 'A split map of the United States illustrating mandatory versus permissive domestic violence reporting jurisdictions for mental health professionals',
          imagePosition: 'right',
        },
        {
          type: 'text',
          content: `<p>Elder abuse and dependent adult abuse occupy a distinct gray zone that deserves more attention than standard mandated reporting training typically provides, because the clinical and legal calculus differs in important ways from child abuse. The central complicating factor is capacity. A child is presumed unable to consent to or protect themselves from maltreatment, and the state's interest in protection is largely uncontested. An older adult or a dependent adult, by contrast, may retain full legal capacity and the right to make decisions others consider unwise — including the decision to remain in a situation that a clinician finds alarming. The mandated reporting analysis for these populations must therefore hold two truths simultaneously: that vulnerable adults are at elevated risk of exploitation and harm, and that competent adults retain autonomy that the law and ethics protect.</p>

<p>Financial exploitation is the form of elder abuse most likely to present in subtle ways that clinicians miss. Unlike physical abuse, it leaves no bruise, and unlike neglect, it may not produce visible deterioration until substantial damage has been done. A client may mention, almost in passing, that a grandchild has moved in and is "helping" with the banking, that a new acquaintance has become very involved in their financial affairs, or that they have changed their will under pressure they describe with ambivalence. These disclosures sit squarely in the gray zone: they may reflect ordinary family arrangements, or they may signal exploitation by a person in a position of trust. The clinician's role is not to investigate the finances but to recognize the pattern, assess whether it meets the threshold for reasonable suspicion under the applicable adult protective services statute, and report when it does. Because financial exploitation statutes and their coverage of mental health professionals vary considerably by state, this is an area where knowing the specific local law is especially important.</p>

<p>Self-neglect presents perhaps the sharpest tension between protection and autonomy in the entire field of mandated reporting. Most states recognize self-neglect as a reportable category, but applying it requires the clinician to navigate the boundary between a competent adult's right to live as they choose and a genuinely impaired person's inability to meet their own basic needs. An older client who lives in cluttered conditions, eats poorly, and declines medical care may be exercising autonomy, or may be in the grip of cognitive decline, depression, or a disorder that compromises their capacity to care for themselves. The pivotal variable is decision-making capacity, which is itself a clinical determination that outpatient providers are often not positioned to make definitively. When capacity is genuinely in question and the risk to the client is serious, a report to adult protective services is appropriate; APS is equipped to assess the situation and connect the person with services, and reporting does not strip the client of autonomy so much as bring additional eyes and resources to a concerning picture.</p>

<p>Clients with disabilities — including intellectual and developmental disabilities, serious mental illness, and acquired conditions such as traumatic brain injury — warrant specific clinical attention because abuse against them is both more common and more frequently overlooked. Research consistently indicates that people with disabilities experience abuse at substantially higher rates than the general population, yet their disclosures are more likely to be discounted, misattributed to their condition, or missed entirely because they do not conform to the disclosure patterns clinicians are trained to recognize. A client with an intellectual disability may describe abuse in concrete, fragmentary, or unexpected language; a client with a serious mental illness may report mistreatment that a clinician is tempted to attribute to symptomatology rather than to take at face value. The discipline required here is to apply the same reasonable suspicion standard that applies to any client, while bringing heightened awareness that this population is at elevated risk and that their accounts deserve to be taken seriously rather than reflexively reframed as symptoms.</p>

<p>The dependency dynamic that frequently surrounds clients with disabilities adds a further layer of complexity. When the alleged abuser is also the client's primary caregiver — a parent, spouse, paid attendant, or group home staff member — the client may face a wrenching practical reality: reporting the abuse could jeopardize the very care they depend on for daily survival. This dynamic parallels the dependency seen in domestic violence and elder abuse, and it has the same chilling effect on disclosure. Clinicians must recognize that a client's reluctance to have a report made may reflect not denial but an accurate assessment of how precarious their situation is. This recognition does not eliminate the reporting obligation where reasonable suspicion exists, but it should shape the surrounding clinical work: the report must be paired with attention to continuity of care, safety planning, and connection to disability-competent advocacy and protective resources so that the act of protection does not inadvertently destabilize the client's life.</p>`,
        },
        {
          type: 'text',
          content: `<p>Cultural humility deserves sustained attention in any serious treatment of mandated reporting gray areas, because bias operates in both directions and both directions cause harm. The first failure mode is under-reporting driven by cultural relativism — the clinician who declines to report a clear instance of harm because they have categorized it as a cultural practice rather than abuse. The legal standard does not bend to culture: a child who is being injured is being injured regardless of the cultural framework within which the injury occurs, and a clinician who withholds a report on the grounds that "this is normal in their community" has substituted a stereotype for an individualized assessment of harm. The second failure mode is over-reporting driven by cultural unfamiliarity — the clinician who interprets an unfamiliar but benign parenting practice, family structure, or caregiving arrangement as evidence of abuse or neglect because it diverges from the clinician's own cultural expectations. This failure mode is well documented in the disproportionate representation of families from certain communities in the child welfare system, and it inflicts real harm: investigations are intrusive and frightening, and an unfounded report can rupture a family's trust in the very systems meant to help them.</p>

<p>Navigating between these failure modes requires the clinician to hold a clear conceptual distinction: the question is always whether harm has occurred or is at risk of occurring, not whether the family's practices match the clinician's own. Culture informs the interpretation of facts; it does not change the standard. When a clinician encounters a culturally unfamiliar situation and is genuinely uncertain whether it constitutes harm, the appropriate response is neither reflexive reporting nor reflexive dismissal, but consultation — with culturally informed colleagues, with cultural liaisons or community organizations, or with supervisors who can help disentangle cultural difference from genuine risk. This consultation should be documented, and it should focus the analysis back on the concrete question of harm. The goal is equitable application of a single standard: the same vigilance for harm regardless of the family's background, and the same restraint against acting on bias regardless of how unfamiliar a practice may seem.</p>

<p>Bias in mandated reporting is not only cultural; it is also shaped by class, by the clinician's own history, and by structural features of the systems clinicians interact with. Families living in poverty are more visible to reporting systems and more likely to have the conditions of poverty — inadequate housing, food insecurity, lack of childcare — interpreted as neglect. A clinician committed to equitable practice must be able to distinguish the harms that genuinely require a report from the deprivations of poverty that require resources rather than investigation, while recognizing that severe deprivation can itself rise to the level of reportable neglect. This is difficult terrain, and it is precisely why documentation of clinical reasoning matters so much: a clinician who can articulate, in the record, exactly what harm they observed and why it met or did not meet the threshold has practiced thoughtfully, whatever the outcome. The antidote to bias is not the abandonment of judgment but the disciplined, documented, consultation-informed exercise of it.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Elder and Dependent Adult Abuse: Recognizing the Less Visible Forms',
              content: `<p>Physical abuse of an elder or dependent adult is the form most clinicians are primed to detect, but it is frequently not the most common. Financial exploitation, emotional abuse, and neglect — including self-neglect — often present more subtly and require deliberate attention. Indicators that warrant clinical curiosity include unexplained changes in financial circumstances, a caregiver who controls access to the client or speaks for them, sudden changes to legal or financial arrangements made under apparent pressure, withdrawal and fearfulness in the presence of a particular person, unmet medical or hygiene needs in a person who has resources to meet them, and a caregiver who appears overwhelmed, resentful, or impaired. None of these indicators alone proves abuse, but in combination or in context they may establish the reasonable suspicion that triggers a report to adult protective services. Because adult abuse statutes vary substantially in their coverage of mental health professionals, confirm your specific obligation under the applicable state law.</p>`,
            },
            {
              title: 'Capacity and Autonomy in Adult Protective Reporting',
              content: `<p>The single most important conceptual tool in elder and dependent adult abuse work is the distinction between a capacitated adult's autonomous choice and an impaired adult's inability to protect themselves. A competent adult has the right to make decisions others find unwise, including remaining in difficult circumstances; a clinician's discomfort is not, by itself, grounds for a report. When capacity is intact and the adult declines intervention, the clinician's role centers on offering resources, safety planning, and continued engagement rather than overriding the person's choices. When capacity is genuinely in question — because of cognitive decline, severe mental illness, or another condition that compromises judgment — and the risk is serious, the calculus shifts toward reporting, because the autonomy that would otherwise be controlling may be compromised. Capacity is a clinical determination that should be made carefully, documented, and, where the stakes are high and the picture unclear, supported by consultation and by referral to adult protective services, which has the authority and resources to assess capacity more definitively.</p>`,
            },
            {
              title: 'Abuse of Clients with Disabilities: Heightened Risk, Discounted Voices',
              content: `<p>People with disabilities experience abuse at markedly higher rates than the general population, and yet their disclosures are disproportionately discounted. A clinician working with a client who has an intellectual or developmental disability, a serious mental illness, or a significant communication difference must resist two related errors: attributing a credible disclosure to the client's condition rather than treating it as a report of real events, and demanding that the disclosure conform to a "standard" narrative before forming reasonable suspicion. The reasonable suspicion standard does not require a polished account; it requires reasonable grounds for concern. Communication adaptations — allowing more time, using concrete language, accepting nonverbal or fragmentary disclosures, and involving communication specialists where appropriate — help the clinician recognize disclosures that might otherwise be missed. When the alleged abuser is also the client's caregiver, the report must be coordinated with attention to continuity of care and connection to disability-competent advocacy so that protection does not destabilize the client.</p>`,
            },
            {
              title: 'Cultural Humility Without Cultural Relativism',
              content: `<p>Cultural humility in mandated reporting means bringing accurate cultural knowledge to the interpretation of facts while applying a single, uniform standard of harm to every client. It is not cultural relativism, which would tolerate harm in the name of respect, and it is not cultural assimilationism, which would treat any departure from the clinician's own norms as suspect. The discipline is to ask, in every case, whether harm has occurred or is at risk — and to ensure that the answer is driven by the facts of harm rather than by the familiarity or unfamiliarity of the family's practices. When cultural context genuinely clouds the analysis, consult culturally informed colleagues or community resources, refocus on the concrete question of harm, and document the reasoning. Equity is achieved not by reporting more or less based on a family's background, but by applying the same vigilance and the same restraint to every client regardless of background.</p>`,
            },
            {
              title: 'Avoiding the Poverty-as-Neglect Trap',
              content: `<p>One of the most consequential biases in the child welfare system is the conflation of poverty with neglect. Inadequate housing, food insecurity, lack of childcare, and untreated medical conditions can all be products of poverty rather than parental failure, and reporting them as neglect when the underlying issue is deprivation can subject struggling families to intrusive investigation while doing nothing to address the actual problem. At the same time, severe deprivation can cross into reportable neglect when a child is genuinely endangered. The clinician's task is to assess whether the child is being harmed or endangered and, where the issue is poverty rather than maltreatment, to mobilize resources — referrals, concrete support, connection to community services — rather than reflexively initiating a report. Documenting the distinction the clinician drew, and the reasoning behind it, is essential both for the family's protection and for the clinician's own defensible practice.</p>`,
            },
          ],
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each type of neglect or abuse with its most accurate clinical description. Drag or select each term to align it with the corresponding definition.',
          matchingPairs: [
            { term: 'Physical neglect', definition: 'Failure to provide adequate food, clothing, shelter, or supervision to a degree that harms or endangers the child or dependent adult' },
            { term: 'Emotional neglect', definition: 'Persistent failure to meet a child\'s basic emotional needs — including affection, belonging, and emotional responsiveness — impairing psychological development' },
            { term: 'Educational neglect', definition: 'Failure to enroll a school-age child in school, chronic permitted absenteeism, or refusal to provide legally mandated special education services' },
            { term: 'Medical neglect', definition: 'Failure to provide or seek necessary medical treatment for a child or dependent adult, including immunizations, medications, and emergency care' },
            { term: 'Financial exploitation', definition: 'Unauthorized or improper use of an elder\'s or dependent adult\'s funds, property, or assets by a caregiver or person in a position of trust' },
            { term: 'Self-neglect', definition: 'An elder or dependent adult\'s inability or refusal to provide adequate food, clothing, shelter, or healthcare for themselves, creating a risk of serious harm' },
          ],
        },
        {
          type: 'text',
          content: `<p>Working with clients who have been previously reported — and who enter therapy carrying the weight of that experience — is one of the most clinically demanding dimensions of mandated reporting practice. For these clients, disclosure does not feel like the first step toward safety; it feels like the first step toward a familiar and often traumatic sequence of events: the report, the investigation, the possible removal, the court appearances, the fractured family system. Clinicians who do not understand this history may inadvertently replicate the dynamics that made previous reports harmful — moving quickly, minimizing the client's perspective, focusing on compliance rather than collaboration.</p>

<p>Repair work with previously-reported clients begins with the therapeutic relationship and with transparency about the clinician's legal obligations. Explaining mandatory reporting clearly and completely at the outset of therapy — including what triggers a report, what happens after a report is made, and what the clinician will do to support the client through the process — is both an ethical obligation (informed consent{{callout:informed-consent}}) and a clinical strategy that can meaningfully shift how clients engage with the disclosure process. When clients understand that the clinician is bound by a legal duty and that the duty exists to protect them rather than to punish them, some of the sting of a previous report experience can be metabolized in a more adaptive way.</p>

<p>Validation is the cornerstone of this work. Clients who have experienced previous reports that they experienced as harmful, unjust, or destructive need the clinician to acknowledge that their experience was real, that the system that responded to the report may have caused additional harm, and that the legal obligation to report does not mean the clinician is indifferent to what that process is like for the client. At the same time, validation does not mean agreement that the previous report was wrong; it means empathizing with the impact of the experience while maintaining the clinician's own ethical and legal position.</p>`,
        },
        {
          type: 'scenarioTree',
          scenarioTitle: 'The Recanting Adolescent: A Clinical Decision Point',
          instructions: 'Read each stage of this unfolding clinical scenario and choose the most appropriate clinical and legal response. Your choices will branch into different clinical pathways. Take your time — there is no time pressure.',
          startNode: 'node1',
          nodes: [
            {
              id: 'node1',
              text: 'Destiny is a 15-year-old you have been seeing for six weeks for anxiety and school avoidance. In today\'s session, she discloses that her stepfather "sometimes hits her when she doesn\'t do her chores" and that "last week he left a bruise on my arm." She seems scared and asks you "not to tell anyone." What is your immediate clinical response?',
              choices: [
                { text: 'Acknowledge her courage in sharing this, explain your legal duty to report, and begin the reporting process after the session', nextNode: 'node2a' },
                { text: 'Ask her to describe what happened in more detail so you fully understand before deciding whether to report', nextNode: 'node2b' },
                { text: 'Tell her you cannot promise to keep this secret and need to think about what to do, then consult your supervisor before acting', nextNode: 'node2c' },
              ],
            },
            {
              id: 'node2a',
              text: 'You acknowledge Destiny\'s trust and explain clearly that you have a legal duty to report what she has shared because you are concerned about her safety. She becomes upset and says she "made it up" to see how you\'d react. How do you proceed?',
              choices: [
                { text: 'Treat the recantation as the most recent account and decline to report since she now says the disclosure was false', nextNode: 'node3a' },
                { text: 'Acknowledge her distress, explore what prompted the recantation without pressuring her, and proceed with the report based on the original disclosure', nextNode: 'node3b' },
                { text: 'Ask her to show you the bruise before deciding whether to report despite the recantation', nextNode: 'node3c' },
              ],
            },
            {
              id: 'node2b',
              text: 'You ask follow-up questions. Destiny provides additional details that strengthen your concern, but you are now 30 minutes into the session and she is distressed. She then says, "Please just forget I said anything." How do you respond?',
              choices: [
                { text: 'You must still report — the additional details have strengthened reasonable suspicion, and the client\'s request to "forget it" does not eliminate the legal duty', nextNode: 'node3b' },
                { text: 'Honor her request and document the conversation for the next session, when she may be more ready to discuss it', nextNode: 'node3a' },
              ],
            },
            {
              id: 'node2c',
              text: 'You tell Destiny you need to think about what to do and consult your supervisor. Your supervisor, after hearing the details, says "It\'s really a borderline case — wait and see if she brings it up again." What is the legally and ethically correct action?',
              choices: [
                { text: 'Follow your supervisor\'s advice — they have more experience and may be right that this is ambiguous', nextNode: 'node3a' },
                { text: 'Report independently — the supervisor\'s advice does not transfer your legal obligation, and the disclosure met the threshold for reasonable suspicion', nextNode: 'node3b' },
              ],
            },
            {
              id: 'node3a',
              text: 'INCORRECT PATH: This response is a reporting error. Recantation does not eliminate reasonable suspicion that formed at the time of the original disclosure. A supervisor\'s advice that a case is "borderline" does not transfer the clinician\'s personal reporting obligation. Treating a client\'s request to "forget it" as a reason not to report leaves the underlying concern unaddressed. In each of these scenarios, the correct action is to proceed with the report based on the original disclosure.',
              choices: [
                { text: 'Return to the beginning and reconsider', nextNode: 'node1' },
              ],
            },
            {
              id: 'node3b',
              text: 'CORRECT PATH: You make the report based on the original disclosure, which clearly met the reasonable suspicion threshold. You document the disclosure, the recantation, your clinical reasoning, the consultation (if applicable), the time and case number of the report, and the follow-up conversation with Destiny. You spend the remaining session time on safety planning and explaining what Destiny can expect from the CPS process. This is the legally and clinically correct response in each of these scenarios.',
              choices: [
                { text: 'Continue to debrief: what would you say to Destiny after making the report?', nextNode: 'node4' },
              ],
            },
            {
              id: 'node3c',
              text: 'CAUTION: Asking to observe an injury can be appropriate for assessing current safety, but it should not be the determining factor in whether to report — verbal disclosure of physical harm with a specific description already meets reasonable suspicion. If the bruise is not visible (healed, covered, or Destiny refuses to show you), that does not negate the reporting obligation. Proceed to the correct path.',
              choices: [
                { text: 'Proceed to make the report regardless of bruise visibility', nextNode: 'node3b' },
              ],
            },
            {
              id: 'node4',
              text: 'After making the report, Destiny is upset and says she hates you and will never come back. Which response best supports the therapeutic relationship while remaining ethically grounded?',
              choices: [
                { text: '"I understand you\'re angry with me. I did what I was legally required to do, and I\'m sorry it hurts."', nextNode: 'node5a' },
                { text: '"I hear how angry you are. I made the report because the law requires it and because I care about your safety — even when that means doing something you didn\'t want me to do. I\'m not going anywhere."', nextNode: 'node5b' },
                { text: '"Let\'s talk about something else today — I don\'t want to make this worse."', nextNode: 'node5a' },
              ],
            },
            {
              id: 'node5a',
              text: 'This response is clinically thin. It acknowledges the legal obligation but does not convey relational investment or model the therapeutic stance needed for alliance repair. A better response includes acknowledgment of the client\'s emotional experience, affirmation of the clinician\'s care for her, and a clear message that the relationship continues.',
              choices: [
                { text: 'See the stronger response', nextNode: 'node5b' },
              ],
            },
            {
              id: 'node5b',
              text: 'OPTIMAL RESPONSE: This response validates Destiny\'s anger, explains the reporting in relational terms (care for safety), and signals continuity of the relationship. It does not apologize for making the report — doing so would undermine the appropriateness of the action — but it does acknowledge that the action has an emotional impact. This is the model for alliance repair after a mandated report: empathy for the experience, clarity about the reason, and an unambiguous message that the therapist remains present.',
              choices: [],
            },
          ],
        },
        {
          type: 'fillInBlank',
          title: 'Key Concepts: Fill in the Blank',
          blanks: [
            {
              prompt: 'The legal standard that activates the duty to report in all 50 states is ________, which means you do not need proof or a confession — only a belief based on your training and experience that abuse may have occurred.',
              answer: 'reasonable suspicion',
              acceptAlternates: ['reasonable suspicion standard', 'the reasonable suspicion standard'],
            },
            {
              prompt: 'When a child recants an abuse disclosure, the reporting obligation that attached at the time of the original disclosure is NOT ________ by the recantation.',
              answer: 'eliminated',
              acceptAlternates: ['negated', 'erased', 'removed', 'extinguished', 'canceled'],
            },
            {
              prompt: 'The consultation process with a supervisor does not ________ the clinician\'s personal legal reporting obligation — each mandated reporter must make their own report when they have reasonable suspicion.',
              answer: 'transfer',
              acceptAlternates: ['satisfy', 'replace', 'eliminate', 'remove', 'discharge'],
            },
            {
              prompt: 'In states with ________ domestic violence reporting laws, clinicians are permitted but not required to report domestic violence disclosures to law enforcement, giving greater weight to survivor autonomy and safety planning.',
              answer: 'permissive',
              acceptAlternates: ['permissive reporting', 'optional', 'discretionary'],
            },
            {
              prompt: 'Research on child sexual abuse disclosure suggests that recantation occurs in a ________ of cases, most often driven by family loyalty, fear of consequences, or secondary victimization by adults\' responses.',
              answer: 'majority',
              acceptAlternates: ['significant number', 'large number', 'large proportion', 'high proportion', '22-40%', '22 to 40 percent'],
            },
          ],
        },
        {
          type: 'reflection',
          question: 'Consider a client from a cultural background different from your own who discloses something that might — or might not — constitute reportable neglect or abuse. What specific steps would you take to ensure that your assessment is informed by cultural knowledge rather than cultural bias? Who would you consult, and what resources would you use? How would you document your cultural reasoning in the clinical record?',
          minLength: 120,
        },
        {
          type: 'keyTakeaway',
          title: 'Section 2 Key Takeaways: Gray Areas and Clinical Decision-Making',
          takeaways: [
            'Most mandatory reporting decisions do not involve obvious cases — they involve ambiguous disclosures, partial information, and the need to apply the reasonable suspicion standard to fragmentary evidence.',
            'Recantation does not eliminate the reporting duty that attached when reasonable suspicion first formed. Research shows that most child sexual abuse disclosures are recanted at some point, often under family or social pressure.',
            'Cultural humility in mandated reporting means applying cultural knowledge accurately to the interpretive process — not tolerating harm in the name of cultural respect. The legal standard is the same for all clients.',
            'Domestic violence reporting laws vary by state — some are mandatory, most are permissive. In mandatory-reporting states, the obligation attaches regardless of survivor consent; safety planning must accompany the report.',
            'Neglect is the most commonly reported form of child maltreatment and takes multiple forms: physical, emotional, educational, and medical. Poverty-driven inadequacy may warrant a report even when the cause is systemic rather than intentional.',
            'Clients with prior reporting experiences require explicit therapeutic attention to the therapeutic relationship, transparency about current reporting obligations, and validation of their historical experience.',
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Documentation, Consultation, and Clinical Practice Standards
    // =========================================================================
    {
      title: 'Documentation, Consultation, and Clinical Practice Standards',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Documentation, Consultation, and Clinical Practice Standards',
          subtitle: 'Protecting your client, your license, and the integrity of the reporting process',
          sectionNumber: 4,
          bannerImage: '',
          bannerAlt: '',
        },
        {
          type: 'text',
          content: `<p>The moment a clinician forms reasonable suspicion of abuse or neglect, a process begins that has legal, clinical, and ethical dimensions extending far beyond the phone call to the reporting hotline. How that process is managed — from the first documentation of the concerning disclosure through the therapeutic work that follows the report — determines whether the clinician has met their full professional obligation or whether they have satisfied only the most visible piece of a larger duty.</p>

<p>Documentation{{alert:document}} is the foundation of competent mandated reporting practice. In the event of a licensing board complaint, a lawsuit, a criminal investigation, or a CPS inquiry, the clinical record is the primary evidence of what the clinician knew, when they knew it, what they decided, and why. Sparse or absent documentation — a common pattern in anxiety-driven reporting situations, where clinicians are so focused on making the call that they neglect the record — is a significant professional liability exposure even when the reporting itself was handled correctly.</p>

<p>The documentation that should appear in the clinical record surrounding a mandated report falls into four distinct phases. The first is <strong>pre-report documentation</strong>, which captures the specific information that triggered the reasonable suspicion. This should include the client's verbatim statements (or as close to verbatim as possible), the date and session context in which the disclosure occurred, any behavioral indicators observed, prior session entries that provide context for the current disclosure, and the clinician's preliminary clinical reasoning about why the threshold appears to have been met. Pre-report documentation should never be edited or altered after the report is made — it must reflect the state of knowledge at the time the suspicion formed, not the state of knowledge after the investigation has concluded.</p>

<p>The second phase is <strong>consultation documentation</strong>. If the clinician consulted a supervisor, peer, or ethics consultant before reporting — as is appropriate in ambiguous cases — the record should reflect that a consultation occurred, who was consulted, the substance of what was discussed, and the outcome of the consultation. Crucially, if the consultation conclusion differed from the clinician's own assessment (for example, if a supervisor recommended waiting while the clinician assessed the threshold as met), the record should document both positions and the clinician's independent decision to proceed with the report. This documentation is essential protection in the event of a later dispute about whether reporting was appropriate.</p>

<p>The third phase is <strong>report documentation</strong>, which captures the mechanics of making the report itself. This should include the date and exact time of the oral report, the specific hotline called, the name of the intake worker (if provided), the case number or intake reference assigned, a brief summary of what was reported, and any guidance or instructions received from the intake worker about next steps. This documentation should be entered into the clinical record the same day the report is made. The written report — the formal document submitted to CPS or APS within the statutory timeframe — should also be documented, including the date submitted and the method of submission.</p>

<p>The fourth phase is <strong>post-report clinical documentation</strong>, which captures the conversation with the client about the report and the therapeutic work that follows. This is often the most neglected phase of reporting documentation because it feels more "clinical" and less like a legal obligation — but the post-report session is where the therapeutic alliance is most at risk, where clients may make important disclosures about their response to the reporting, and where the clinical record must reflect that the clinician remained attentive to the client's wellbeing through the reporting process. It should also reflect any safety planning conducted in conjunction with the report.</p>

<p>Consultation protocols deserve expanded attention because they serve multiple functions simultaneously. Consultation is both a risk-management tool and a clinical quality tool — it reduces the likelihood of reporting errors (both over-reporting and under-reporting), it provides the clinician with a documented second opinion that supports the reporting decision, and it models the collegial approach to ethical dilemmas that characterizes mature professional practice. Most professional ethics codes require consultation when facing ethical dilemmas, and mandated reporting gray areas constitute ethical dilemmas by definition.</p>

<p>The appropriate consultation hierarchy depends on the practice setting. In agency settings, the protocol generally requires consultation with a direct supervisor and may also require agency legal counsel notification. In private practice, the consultation may be with a peer consultant, a clinical supervisor retained for this purpose, the state licensing board's ethics consultation line, or the professional association's ethics resource. Clinicians in private practice who lack a regular consultation relationship are at significantly greater risk of reporting errors and licensing complaints than those who maintain ongoing supervisory or peer consultation. The investment in a regular consultation relationship is one of the most cost-effective risk management strategies available to private practitioners.</p>

<p>Special populations create specific consultation needs. For cases involving LGBTQ+ youth, consultation with a provider experienced in this population can help the clinician understand how family rejection, bullying, and conversion therapy practices may complicate the clinical picture and whether additional reporting obligations apply. For undocumented clients, consultation with an immigration advocate or attorney can help the clinician understand how reporting may interact with the client's immigration status and what safety planning must account for that dimension. For clients with intellectual or developmental disabilities, consultation with a provider experienced in this population can assist with capacity assessment, communication adaptations, and the specific indicators of abuse that may present differently than in neurotypical clients.</p>

<p>State-by-state variation in mandatory reporting law is a persistent source of compliance risk for mental health professionals, particularly in the telehealth era. While the core obligation — report when you have reasonable suspicion of child abuse — is uniform across all states, many details vary: the specific hotline to call, the timeframe for the written report, the definition of who qualifies as a dependent adult, the specific categories of reportable maltreatment, whether domestic violence is mandatory or permissive, and the penalties for non-compliance. Clinicians who practice in multiple states or who provide telehealth services across state lines bear the responsibility of understanding the specific requirements of each state where their clients are located. This is not a hypothetical burden — the National Conference of State Legislatures (NCSL), the Child Welfare Information Gateway (childwelfare.gov), and most state licensing boards maintain current summaries of reporting requirements that are freely accessible and should be reviewed at least annually.</p>`,
        },
        {
          type: 'callout',
          calloutType: 'protocol',
          title: 'Clinical Protocol: The Four-Phase Documentation Standard',
          content: `<p>Every mandated report should be accompanied by clinical documentation in four phases: (1) <strong>Pre-report</strong> — verbatim disclosure, behavioral indicators, prior session context, preliminary clinical reasoning. Enter immediately after the session in which the disclosure occurs. (2) <strong>Consultation</strong> — who was consulted, when, what was discussed, outcome. Document both the consultant's position and your own if they differ. (3) <strong>Report</strong> — date, time, hotline called, intake worker name, case reference number, summary of what was reported, written report submission date and method. Enter the same day as the report. (4) <strong>Post-report</strong> — client conversation about the report, client response, safety planning, therapeutic plan for the next session. This documentation is as legally important as the pre-report entry. A complete four-phase record protects the clinician, the client, and the integrity of the process.</p>`,
        },
        {
          type: 'text',
          content: `<p>Repairing the therapeutic alliance after a mandated report is one of the most clinically demanding tasks in mental health practice, and it is one that receives comparatively little attention in standard training. Most mandated reporting courses focus on the decision to report and the mechanics of reporting; they rarely address what comes next. Yet what comes next — the client's response to the report, the ongoing therapeutic relationship, and the clinician's capacity to remain present and engaged through the client's distress — determines whether the report ultimately serves the client's long-term wellbeing or drives them out of treatment.</p>

<p>The alliance repair literature suggests several evidence-based principles that apply directly to post-reporting work. The first is <strong>metacommunication</strong> — explicitly discussing what happened between the clinician and client as a relational event, not just as a procedural occurrence. This means naming the rupture directly: "I reported to CPS what you told me, and I know that changed something between us. I want to understand what it's like for you right now." Metacommunication requires the clinician to tolerate the client's anger, grief, or sense of betrayal without defensiveness or premature reassurance — to stay with the discomfort long enough for the client to feel genuinely heard.</p>

<p>The second principle is <strong>transparency about the ongoing obligation</strong>. Clients who do not understand that the clinician remains a mandated reporter going forward — that the same obligation that produced this report will produce another one if warranted — are at risk of either over-disclosing (testing the relationship) or under-disclosing (protecting themselves from further reports) in ways that compromise the therapeutic work. Clarity about the continuing obligation, delivered with empathy and in the context of the therapeutic relationship, is more protective of the alliance than avoidance of the topic.</p>

<p>The third principle is <strong>validation of the client's historical experience</strong>. Many clients who react strongly to a mandated report are responding not only to the current event but to a prior experience with the reporting system that was harmful, dismissive, or traumatizing. Validating that prior experience — acknowledging that the system did not serve the client well in the past, that the current report may feel like repetition of that harm, and that the client's response makes complete sense given their history — is an essential therapeutic act that must precede any other alliance repair work. Validation is not agreement that the prior report was wrong; it is empathic acknowledgment that the experience was painful and real.</p>

<p>LGBTQ+ youth require particular attention in the post-report context. When a mandated report involves family violence or abuse and the youth's LGBTQ+ identity is a factor — either as the trigger for the abuse or as a complicating factor in their safety planning — the clinician must be prepared to address the report's impact on the client's sense of safety and identity simultaneously. For a youth whose parents are abusive specifically because of their sexual orientation or gender identity, a CPS report may feel like it exposes them further to the family system they are trying to navigate, rather than providing protection. The appropriate response is individualized safety planning that accounts for the specific risks created by the intersection of the abuse and the client's identity, in consultation with LGBTQ+-competent protective service providers where available.</p>

<p>Undocumented clients present a distinct and often underappreciated challenge in post-report alliance work. For these clients, any contact with government authorities — including CPS and APS — may carry perceived or actual immigration risk, either for themselves or for family members who may also be undocumented. Clinicians serving undocumented populations should be familiar with the immigration-related guidance from both the federal government and their state child welfare agency, which often address the limits of information sharing between CPS and immigration enforcement. This knowledge is essential for providing accurate psychoeducation to clients who fear that a CPS report will trigger immigration consequences — fears that are often catastrophic in their intensity even when the actual risk is limited.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Informed Consent and Mandatory Reporting: What Clients Must Know From Day One',
              content: `<p>The ethical obligation to obtain informed consent before beginning therapy includes a clear explanation of confidentiality and its limits, of which mandated reporting is one of the most important. Clients have the right to know before they begin sharing sensitive information that certain categories of disclosure will obligate the clinician to report to an outside authority. The informed consent discussion should cover: which types of abuse and neglect trigger mandatory reporting in the relevant jurisdiction; who the report would be made to (CPS, APS, law enforcement); the approximate timeline of the reporting process; the clinician's practice of discussing a report with the client before making it whenever safety permits; and the therapeutic resources available to the client after a report is made. Clients who receive this information at the outset are better prepared to make autonomous decisions about what to share and when — and clinicians who have documented this disclosure are better protected if a client later claims they did not know their disclosure would be reported.</p>`,
            },
            {
              title: 'When NOT to Notify the Client Before Reporting',
              content: `<p>The clinical best practice of discussing a pending report with the client before making it — to preserve the alliance, give the client agency, and support safety planning — is appropriate in most situations but has important exceptions. Clinicians should NOT notify the client before reporting when: (1) the notification would create an immediate safety risk, such as when the alleged perpetrator is present in the session or could be notified by the client in a way that leads to immediate escalation; (2) the client's notification would interfere with the protective function of the report, for example in cases where a parent might destroy evidence or move a child before investigators can respond; (3) the client has expressly threatened to retaliate against the alleged victim if a report is made. In these circumstances, the clinician should make the report without prior notification, document the specific safety reasons for doing so, and then disclose to the client at the earliest clinically safe opportunity. The timing of client notification is a clinical judgment within the legal framework; the legal obligation to report is not affected by whether the client is notified first.</p>`,
            },
            {
              title: 'Consultation Resources: Where to Turn When You\'re Uncertain',
              content: `<p>When facing a mandatory reporting gray area, clinicians have access to multiple consultation resources. The most immediate is a direct supervisor or supervisor of record, who can provide both clinical and agency-policy guidance. For clinicians in private practice, peer consultation groups, paid supervisory arrangements, or the ethics hotlines offered by national professional associations (ACA at 1-800-347-6647; NASW ethics consultation at nasw.org; NBCC ethics resources at nbcc.org) are appropriate first contacts. State licensing boards often offer informal consultation services for ethics and legal questions — these calls are not confidential but provide authoritative guidance on state-specific obligations. The Child Welfare Information Gateway (childwelfare.gov) maintains state-by-state reporting requirement summaries updated annually. For cases involving cultural complexity, relevant professional associations (the Association for Multicultural Counseling and Development; the National Association of Black Social Workers; the Association of LGBTQ+ Psychiatrists; the American Association on Intellectual and Developmental Disabilities) may have member consultation services or published guidance. Document every consultation — who you spoke with, when, what was discussed, and what conclusion was reached.</p>`,
            },
            {
              title: 'False Reports and Liability: The Risk in Both Directions',
              content: `<p>One of the most persistent misconceptions about mandatory reporting is that the greater liability risk lies in over-reporting. In fact, the liability calculus runs in both directions. Under-reporting — failing to make a report when the threshold of reasonable suspicion has been met — exposes the clinician to criminal charges, licensing board action, and civil liability that the good-faith immunity provisions explicitly do not cover. Over-reporting — making a report in bad faith, with knowledge of falsity, or with malicious intent — similarly falls outside the immunity provision and can result in civil liability and criminal exposure for false reporting. Good-faith over-reporting — reporting based on genuine reasonable suspicion that turns out not to be substantiated — is fully protected by the immunity provision in all 50 states. Clinicians who are managing the anxiety of uncertain cases should recognize that the immunity framework is designed precisely to support good-faith reporting under uncertainty; the protection it provides is real, not theoretical, and applies even when the report does not result in a founded case.</p>`,
            },
          ],
        },
        {
          type: 'imageText',
          title: 'Special Populations: Tailoring Reporting Practice to Individual Client Needs',
          content: `<p>Standard mandated reporting training was historically developed with a normative client profile in mind: a cisgender, English-speaking, citizen-status child or adult presenting in a traditional outpatient setting. The reality of contemporary mental health practice is significantly more diverse, and clinicians serving populations that diverge from this normative profile face additional layers of complexity in both the identification and reporting of abuse.</p>

<p>Clients with intellectual or developmental disabilities require specific attention to communication adaptations in the disclosure process. These clients may describe abuse in non-standard terms, may be less likely to use the specific vocabulary that adults expect from abuse disclosures, and may have been socialized not to question authority figures in ways that make reporting feel threatening. Clinicians should not require "standard" disclosure language before forming reasonable suspicion with this population; the legal standard is the same, but the clinical skills required to recognize the disclosure as such are more demanding.</p>

<p>For clients receiving services in rural settings, the intersection of limited anonymity, small-town social networks, and limited CPS investigation capacity can create additional challenges. A clinician in a small community where the alleged perpetrator is known to the CPS intake worker, or where the client's family is prominent in the community, must navigate these factors without letting them override the legal obligation to report. Documentation of the clinical reasoning in these situations is particularly important.</p>`,
          image: '',
          imageAlt: 'A diverse group of mental health clients including youth, elders, and adults with disabilities, representing the range of special populations in mandated reporting practice',
          imagePosition: 'left',
        },
        {
          type: 'text',
          content: `<p>Having addressed documentation and consultation in principle, it is worth walking through the concrete mechanics of actually filing a report, because clinicians who have never done it often discover that uncertainty about the process itself contributes to hesitation. The report begins with a phone call to the appropriate intake line — child protective services for child abuse, adult protective services for elder or dependent adult abuse — generally at the county level where the alleged victim resides. The clinician should make this call as soon as reasonable suspicion forms, not after the workday ends or the week's notes are caught up; most statutes require the oral report immediately or as soon as practicable, and delay both increases risk to the vulnerable person and exposes the clinician to liability. Before placing the call, it helps to have the essential information assembled, but the clinician should never delay reporting in order to gather information that is not readily available. A report made with partial information is far preferable to a report withheld pending completeness.</p>

<p>Intake workers will typically ask for a defined set of information, and knowing what they will ask reduces anxiety and improves the quality of the report. Expect to provide identifying information about the alleged victim — name, age or approximate age, address or location, and the setting in which the clinician encountered them; the nature of the concern, described concretely and, where possible, in the client's own words; the identity of the alleged perpetrator and their relationship to the victim, if known; any information about immediate safety and whether the victim is in present danger; and the clinician's own identifying and contact information. The clinician should also be prepared to describe what is known about the family or household composition, whether other children or vulnerable adults may be at risk, and any prior history the clinician is aware of. If a piece of information is unknown, the appropriate answer is simply that it is unknown; the clinician is not expected to have investigated.</p>

<p>During the call, the clinician should record the date and exact time, the name or identification of the intake worker, the case or reference number if one is assigned, and any guidance the worker provides about next steps — including whether a written report is required, in what timeframe, and through what mechanism. Many states require a written follow-up report within a defined window, frequently in the range of twenty-four to seventy-two hours, submitted on a designated form or through an online portal. The clinician should complete this written report promptly and document its submission, because, as noted earlier, failure to submit the required written report is an independent violation in many jurisdictions even when the oral report was made correctly. Knowing the form and the portal in advance, as part of the law-research workflow described earlier, removes a common point of failure.</p>

<p>A frequent source of clinician distress is uncertainty about what happens after the report is filed, and being able to give the client accurate psychoeducation about the process is itself a clinical skill. After intake, the agency screens the report to determine whether it meets the criteria for investigation; not every report results in an investigation, and the clinician should not interpret a screen-out as evidence that the report was unwarranted. If the report is accepted for investigation, an investigator will typically attempt to make contact within a timeframe defined by the agency's assessment of risk, ranging from immediate response in cases of imminent danger to several days for lower-risk reports. The investigation may involve interviews, home visits, and coordination with other systems. The clinician's role after filing is generally limited: they may be contacted by the investigator for additional information, and they should respond cooperatively while continuing to document, but they do not conduct or direct the investigation and should not attempt to. The clinician's continuing responsibility is to the therapeutic relationship and the client's ongoing wellbeing, not to the outcome of the investigation, which lies outside their control.</p>

<p>Good-faith immunity is the legal backstop that makes this entire process tolerable for clinicians, and it deserves to be understood clearly rather than as a vague reassurance. Every state provides statutory immunity from civil and criminal liability for mandated reporters who make reports in good faith, and in most states this protection holds even when the report is ultimately not substantiated. Good faith means the clinician genuinely believed, based on the information available, that reasonable suspicion existed — not that the clinician turned out to be correct. The immunity does not extend to reports made with knowledge of their falsity or with malicious intent, which is appropriate; the protection exists to enable honest reporting under uncertainty, not to shield abuse of the system. Understood properly, the immunity framework directly answers the most common reason clinicians give for hesitating — the fear of being wrong. The law has already decided that the cost of a good-faith report that turns out to be unfounded is one society is willing to bear, and it has structured liability to make the protective choice the safe one. A clinician who reports in good faith and documents that good faith is on firm legal ground regardless of the investigation's outcome.</p>`,
        },
        {
          type: 'text',
          content: `<p>Perhaps no single practice does more to protect both the clinician and the client through a reporting situation than disciplined management of clinical uncertainty through consultation and documentation. Uncertainty is the normal condition of mandated reporting, not an aberration to be eliminated before acting. The clinician who waits for certainty will wait too long, and the clinician who acts on every fleeting worry without reflection will over-report and erode trust. Between these poles lies the disciplined middle path: forming a reasoned judgment about whether the reasonable suspicion threshold has been met, consulting when the case is genuinely ambiguous, acting on the judgment, and documenting the reasoning so that the decision can be understood and defended later. This is not a path that eliminates discomfort; it is a path that channels discomfort into competent action.</p>

<p>Consultation is the clinician's primary tool for managing uncertainty, and its value is both clinical and protective. Clinically, a second perspective frequently surfaces considerations the clinician missed, corrects distortions introduced by the clinician's own anxiety or bias, and improves the quality of the reporting decision in either direction. Protectively, a documented consultation demonstrates that the clinician exercised the diligence that professional standards require. It is essential to understand, however, what consultation does and does not accomplish. Consultation informs the clinician's judgment; it does not transfer the obligation. If, after consulting, the clinician still holds reasonable suspicion, the clinician must report — even if the consultant advised otherwise. A supervisor's contrary opinion is a data point, not a shield. The record should reflect both the consultation and the clinician's independent decision, particularly when the two diverge, because that documentation is exactly what protects the clinician if the decision is later questioned.</p>

<p>Documentation, finally, is the thread that runs through every phase of competent reporting and the practice most often neglected under the pressure of the moment. The clinician's contemporaneous record is the primary evidence of what was known, when it was known, what was decided, and why. It should capture the disclosure in the client's own words wherever possible, the behavioral indicators observed, the clinical reasoning that led to the suspicion, the consultations conducted, the mechanics of the report, and the post-report clinical work — and it should never be retroactively edited to align with what an investigation later revealed. A record that reflects the clinician's honest state of knowledge at the time, including the uncertainty that was present, is both more truthful and more legally protective than a tidied-up narrative. When uncertainty was genuine, the record should say so; documenting that the clinician recognized the ambiguity, consulted about it, and made a reasoned good-faith decision is precisely the picture of competent practice that licensing boards and courts look for. In mandated reporting, the clinician's defense is rarely that they were certain; it is that they were thoughtful, diligent, and honest under conditions of uncertainty.</p>`,
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'The Report-Filing Workflow: What to Do, Step by Step',
              content: `<p>When reasonable suspicion forms, move through a consistent workflow. First, assess immediate safety — is the vulnerable person in present danger requiring an emergency response? Second, assemble the information you readily have, but do not delay the call to gather more. Third, call the appropriate county-level intake line (child protective services or adult protective services) as soon as practicable. Fourth, provide the information the intake worker requests: the alleged victim's identity and location, the nature of the concern in concrete terms, the alleged perpetrator and their relationship to the victim, present safety, and your own contact information; answer "unknown" where you do not know. Fifth, record the date, time, intake worker, case number, and any guidance received. Sixth, complete and submit the required written report within the state's timeframe, and document the submission. Seventh, turn to the post-report clinical work — the conversation with the client, safety planning, and alliance repair. Document each phase contemporaneously.</p>`,
            },
            {
              title: 'What Information the Intake Worker Will Ask For',
              content: `<p>Intake workers follow a structured protocol and will generally ask for: identifying information about the alleged victim (name, age, address or location, and how you came to know them); a concrete description of the concern, ideally including the client's own words; the identity of and relationship to the alleged perpetrator, if known; whether the victim is in immediate danger and any known safety concerns; the composition of the household and whether other children or vulnerable adults may be at risk; any relevant history you are aware of; and your own name, role, and contact information. You are not expected to have investigated or to know everything — "unknown" is an acceptable and honest answer. Having this list in mind before you call reduces anxiety and helps you give a clear, useful report. Remember that the intake worker handles these calls routinely and can guide you through the process if you are uncertain.</p>`,
            },
            {
              title: 'After the Report: What Happens and What the Client Can Expect',
              content: `<p>Being able to explain the post-report process accurately is a clinical skill that reduces client fear and supports the alliance. After intake, the agency screens the report to decide whether it meets the criteria for investigation; not every report is investigated, and a screen-out does not mean the report was wrong. If accepted, an investigator is assigned and attempts contact within a timeframe set by the assessed level of risk — immediate for imminent danger, longer for lower-risk reports. The investigation may include interviews, home visits, and coordination with schools, medical providers, or law enforcement. Outcomes range from no further action, to the provision of voluntary or court-ordered services, to, in serious cases, removal of the child or protective intervention for the adult. The clinician's role after filing is limited and largely cooperative: respond to investigator inquiries, continue documenting, and keep the therapeutic focus on the client. The clinician does not control and is not responsible for the investigation's outcome.</p>`,
            },
            {
              title: 'Good-Faith Immunity and Liability in Both Directions',
              content: `<p>The liability landscape of mandated reporting is frequently misunderstood, and clarity reduces unnecessary fear while preserving appropriate caution. Good-faith immunity protects clinicians who report based on genuine reasonable suspicion, in every state, typically even when the report is not substantiated; the test is the clinician's honest belief at the time, not the ultimate accuracy of the report. This protection specifically addresses the fear of being wrong. The immunity does not protect knowingly false or malicious reports, which can themselves generate liability. On the other side of the ledger, failing to report when the threshold has been met carries substantial exposure — criminal penalties in many states, licensing discipline, civil liability in some jurisdictions, and employment consequences — and good-faith immunity offers no shelter to the non-reporter. The practical lesson is that, under genuine uncertainty, the good-faith report is the legally safer choice, and the law has been deliberately structured to make protection of the vulnerable person the path of least risk for the clinician.</p>`,
            },
            {
              title: 'Managing Clinical Uncertainty: The Disciplined Middle Path',
              content: `<p>Uncertainty is the ordinary condition of mandated reporting, not a problem to be solved before acting. The clinician who waits for certainty endangers the client and risks liability; the clinician who reports every passing worry erodes trust and over-burdens the system. The disciplined middle path is to form a reasoned judgment about whether reasonable suspicion exists, consult when the case is genuinely ambiguous, act on that judgment, and document the reasoning thoroughly — including the uncertainty itself. Consultation informs but does not transfer the obligation: if reasonable suspicion remains after consulting, the clinician must report regardless of a consultant's contrary view, and the record should reflect both. The clinician's strongest protection is rarely a claim of certainty; it is a documented record showing that they recognized the ambiguity, sought consultation, and made a thoughtful, good-faith decision. That record is the picture of competent practice that boards and courts look for.</p>`,
            },
          ],
        },
        {
          type: 'multiSelect',
          question: 'Which of the following should be included in clinical documentation surrounding a mandated report? Select ALL that apply.',
          options: [
            { text: 'The client\'s verbatim (or near-verbatim) disclosure language', isCorrect: true },
            { text: 'The specific hotline number called, the intake worker\'s name (if given), and the assigned case reference number', isCorrect: true },
            { text: 'The clinician\'s retrospective judgment, after the CPS investigation, about whether the report was warranted', isCorrect: false },
            { text: 'Documentation of any consultation conducted, including who was consulted and the substance of the discussion', isCorrect: true },
            { text: 'The post-report conversation with the client, their emotional response, and the safety planning conducted', isCorrect: true },
            { text: 'The date and time of the written report submission and the method of delivery', isCorrect: true },
          ],
          explanation: 'Clinical documentation for a mandated report should span four phases: pre-report (verbatim disclosure, behavioral indicators), consultation (who, when, what, outcome), report mechanics (hotline, worker, case number, written report submission), and post-report (client conversation, response, safety planning). The record reflects the state of knowledge at the time — retrospective revisions based on investigation outcomes are not appropriate and can compromise the legal integrity of the documentation.',
        },
        {
          type: 'text',
          content: `<p>Staying current on reporting requirements in your jurisdiction is not a one-time task accomplished at licensure — it is an ongoing professional obligation. State laws change, and they have changed significantly in the past decade: several states have expanded their mandated reporter categories to include previously excluded professions; multiple states have modified their definitions of reportable neglect in response to child welfare research; and the telehealth expansion accelerated by the COVID-19 pandemic created new multi-jurisdictional practice situations that existing mandatory reporting frameworks were not designed to address.</p>

<p>Professional associations provide periodic updates on legislative changes affecting mental health practice, but these updates are typically broadcast rather than targeted — they may not flag changes in a specific state that is relevant to your practice unless you are enrolled in that state's licensing board mailing list or actively monitoring the state legislature's website. The most reliable approach is to incorporate an annual review of mandatory reporting requirements into your continuing education planning, using authoritative sources such as the Child Welfare Information Gateway, the National Center on Elder Abuse, and your state licensing board's published guidance.</p>

<p>Telehealth-specific considerations deserve special attention in this review. When providing services to clients in other states, the client's state law governs the mandatory reporting obligation for events occurring in that state, even when the clinician is physically located in a different state. This means that a clinician licensed in Georgia who provides telehealth services to a client in South Carolina must understand South Carolina's mandatory reporting requirements, not just Georgia's, and must be prepared to make reports through South Carolina's hotline system. The practical implications extend to informed consent: clients receiving telehealth services across state lines should be informed of which state's mandatory reporting law applies to their services and what that law requires.</p>`,
        },
        {
          type: 'sequencing',
          instructions: 'Arrange the following steps in the correct order for responding to a mandated reporting situation in clinical practice. Drag each step to its proper position in the sequence.',
          steps: [
            { text: 'Receive the disclosure or observe behavioral indicators that create reasonable suspicion of abuse or neglect', order: 1 },
            { text: 'Document the disclosure in the clinical record using verbatim language and noting the session date, time, and context', order: 2 },
            { text: 'Consult with a supervisor or peer consultant if the case presents genuine clinical ambiguity about whether the threshold has been met', order: 3 },
            { text: 'Make the oral report to the appropriate CPS or APS hotline within the timeframe required by state law', order: 4 },
            { text: 'Document the oral report, including the hotline called, intake worker name, case reference number, time, and summary of what was reported', order: 5 },
            { text: 'Submit the written report within the state-mandated timeframe and document the submission date and method', order: 6 },
            { text: 'Discuss the report with the client (when clinically safe to do so), including what was reported, what the client can expect from the CPS or APS process, and safety planning', order: 7 },
            { text: 'Document the post-report conversation, the client\'s response, and the safety planning conducted', order: 8 },
            { text: 'Plan the next session to address alliance repair, ongoing safety, and the therapeutic work continuing in the context of the reporting process', order: 9 },
          ],
          explanation: 'The mandated reporting sequence moves from identification through documentation, consultation (when warranted), oral report, written report, client conversation, post-report documentation, and ongoing therapeutic planning. The oral report should be made immediately upon forming reasonable suspicion — not after extensive investigation. The written report follows within the statutory timeframe. The client conversation should occur as soon as clinically safe, not after the process is entirely complete.',
        },
        {
          type: 'multipleChoice',
          question: 'A clinician in private practice has reasonable suspicion of child abuse and consults their peer supervisor, who advises that the case is ambiguous and recommends waiting to see if the client discloses more in future sessions. What is the clinician\'s legal and ethical obligation?',
          options: [
            { text: 'Follow the supervisor\'s advice because they have more clinical experience', isCorrect: false },
            { text: 'Wait two sessions as the supervisor suggested, then re-evaluate whether to report', isCorrect: false },
            { text: 'Make the report independently, because the consultation does not transfer the clinician\'s personal legal reporting obligation', isCorrect: true },
            { text: 'Document the supervisor\'s recommendation and use it as a basis for not reporting in good faith', isCorrect: false },
          ],
          correctAnswer: 2,
          explanation: 'The duty to report is a personal legal obligation that cannot be transferred, delegated, or negated by a supervisor\'s contrary advice. If the clinician has independently formed reasonable suspicion, they must report — even if their supervisor disagrees. The clinician should document both the supervisor\'s position and their own decision to proceed with the report. The supervisor\'s advice may be a well-intentioned clinical judgment, but it is not a legal shield against the consequences of failing to report when the statutory threshold was met.',
        },
        {
          type: 'reflection',
          question: 'Imagine you have just made a mandated report for the first time in your clinical career. Your client, whom you have been seeing for eight months and with whom you have worked hard to build a strong therapeutic alliance, is devastated and says the report felt like a betrayal. Write out — as specifically as you can — what you would say to this client in the next session. What would you prioritize? What would you be careful to avoid? How would you balance the legal and relational dimensions of this conversation?',
          minLength: 150,
        },
        {
          type: 'keyTakeaway',
          title: 'Section 3 Key Takeaways: Documentation, Consultation, and Practice Standards',
          takeaways: [
            'Documentation spans four phases: pre-report (disclosure and clinical reasoning), consultation (who, what, outcome), report mechanics (hotline, case number, written report submission), and post-report (client conversation, response, safety planning). Each phase has independent legal significance.',
            'Consultation is both a clinical quality tool and a risk management strategy. Every gray-area reporting case should be accompanied by a documented consultation with a supervisor, peer, or ethics resource.',
            'The therapeutic alliance is most at risk in the period immediately following a mandated report. Alliance repair requires explicit metacommunication about the reporting event, validation of the client\'s experience, and transparency about ongoing reporting obligations.',
            'Clients from special populations — LGBTQ+ youth, undocumented individuals, clients with intellectual disabilities, rural clients — require tailored approaches to both the reporting process and the therapeutic repair work that follows.',
            'Telehealth clinicians must understand mandatory reporting requirements in the client\'s state of location, not just the state of licensure. This is a separate, ongoing compliance obligation.',
            'Mandatory reporting law changes over time. An annual review of jurisdiction-specific requirements, using authoritative sources such as the Child Welfare Information Gateway and state licensing board publications, is a professional obligation.',
          ],
        },
        {
          type: 'resources',
          title: 'References and Resources',
          resources: [
            {
              name: 'Child Welfare Information Gateway — Mandatory Reporters of Child Abuse and Neglect',
              url: 'https://www.childwelfare.gov/topics/systemwide/laws-policies/statutes/manda/',
              description: 'State-by-state summaries of mandatory reporting statutes, updated annually by the U.S. Children\'s Bureau. The authoritative free resource for jurisdiction-specific reporting requirements.',
            },
            {
              name: 'National Center on Elder Abuse (NCEA)',
              url: 'https://ncea.acl.gov/',
              description: 'Federal resource center for elder abuse prevention, with state-by-state reporting resources, research summaries, and professional training materials.',
            },
            {
              name: 'ACA Ethics Resources — Mandatory Reporting',
              url: 'https://www.counseling.org/knowledge-center/ethics',
              description: 'The American Counseling Association\'s ethics knowledge center, including guidance on mandatory reporting obligations under the ACA Code of Ethics.',
            },
            {
              name: 'NASW — Ethics and Mandatory Reporting',
              url: 'https://www.socialworkers.org/About/Ethics',
              description: 'National Association of Social Workers ethics resources, including the NASW Code of Ethics provisions related to confidentiality limits and mandatory reporting.',
            },
            {
              name: 'National Domestic Violence Hotline — Safety Planning Resources',
              url: 'https://www.thehotline.org/',
              description: 'Resources for clinicians supporting survivors of domestic violence, including safety planning frameworks, lethality assessment guidance, and survivor-centered approaches.',
            },
            {
              name: 'Danger Assessment — Jacquelyn Campbell (Johns Hopkins University)',
              url: 'https://www.dangerassessment.org/',
              description: 'The validated Danger Assessment tool for evaluating lethality risk in domestic violence cases, with clinician training resources and research support.',
            },
            {
              name: 'National Child Traumatic Stress Network — Mandated Reporting Toolkit',
              url: 'https://www.nctsn.org/resources/mandated-reporting-child-abuse-and-neglect',
              description: 'Clinical toolkit for mental health professionals navigating mandated reporting, including case examples, decision frameworks, and guidance on trauma-informed reporting practice.',
            },
            {
              name: 'LGBTQ+ Youth Affirming Practice — Trevor Project Resources for Clinicians',
              url: 'https://www.thetrevorproject.org/resources/trevor-support-center/',
              description: 'Clinician-focused resources for working with LGBTQ+ youth, including guidance on navigating mandated reporting in the context of family rejection and LGBTQ+-specific abuse.',
            },
          ],
        },
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────────
  // ASSESSMENT
  // ───────────────────────────────────────────────────────────────────────────
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'The federal law that established the national framework for mandatory child abuse reporting by conditioning federal funding to states on the enactment of reporting statutes is:',
        options: [
          { text: 'The Violence Against Women Act (VAWA)', isCorrect: false },
          { text: 'The Child Abuse Prevention and Treatment Act (CAPTA)', isCorrect: true },
          { text: 'The Elder Justice Act of 2010', isCorrect: false },
          { text: 'The Adoption and Safe Families Act (ASFA)', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'CAPTA, first enacted in 1974, is the federal law that established the mandatory child abuse reporting framework by conditioning federal funding to states on the enactment of mandatory reporting statutes. The Elder Justice Act governs elder abuse infrastructure; VAWA governs domestic violence services; ASFA governs adoption and permanency planning.',
      },
      {
        type: 'multipleChoice',
        question: 'Under mandatory reporting law, a mental health clinician is required to report when they have:',
        options: [
          { text: 'Confirmed through their own investigation that abuse has occurred', isCorrect: false },
          { text: 'Received a direct verbal confession from the alleged perpetrator', isCorrect: false },
          { text: 'Reasonable suspicion based on their training and experience that abuse may have occurred', isCorrect: true },
          { text: 'Observed physical evidence of abuse during the clinical session', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'The legal standard in all 50 states is "reasonable suspicion" — a belief based on the clinician\'s training and experience that abuse may have occurred. Proof, confession, or observed physical evidence are not required. The purpose of this standard is to activate the duty before it is too late to protect the victim.',
      },
      {
        type: 'multipleChoice',
        question: 'A client discloses child abuse in session and then recants the disclosure the following week, insisting she "made it up." What is the clinician\'s legal obligation?',
        options: [
          { text: 'The recantation eliminates the reporting duty that formed at the time of the original disclosure', isCorrect: false },
          { text: 'The clinician should wait for another disclosure before reporting, to see if the pattern is consistent', isCorrect: false },
          { text: 'The reporting duty attached when reasonable suspicion formed; recantation does not eliminate it', isCorrect: true },
          { text: 'The clinician must ask the child to write a statement confirming or denying the disclosure before deciding', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Recantation is common — research suggests it occurs in 22–40%+ of child sexual abuse disclosures — but it does not retroactively eliminate the reporting duty. The duty attached when reasonable suspicion formed. The CPS investigation is equipped to handle recantations; the clinician\'s role is to report the original disclosure.',
      },
      {
        type: 'multipleChoice',
        question: 'A clinician\'s supervisor advises against reporting a suspected abuse case, saying it is "too ambiguous." What should the clinician do?',
        options: [
          { text: 'Follow the supervisor\'s guidance because they bear professional responsibility for the clinician\'s decisions', isCorrect: false },
          { text: 'Document the supervisor\'s recommendation and use it to demonstrate good faith in not reporting', isCorrect: false },
          { text: 'Report independently because the duty to report is a personal legal obligation that cannot be transferred', isCorrect: true },
          { text: 'Wait until the next supervision session to re-evaluate before taking any action', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'The mandatory reporting obligation is personal — each mandated reporter who has reasonable suspicion must report independently. Consulting a supervisor is appropriate, but the supervisor\'s contrary advice does not transfer or negate the legal obligation. Clinicians have faced licensing sanctions for failing to report after being advised by a supervisor not to do so.',
      },
      {
        type: 'multipleChoice',
        question: 'Good-faith immunity provisions in mandatory reporting statutes protect clinicians from civil and criminal liability when:',
        options: [
          { text: 'A report is made and later determined to be substantiated by CPS', isCorrect: false },
          { text: 'A report is made based on genuine reasonable suspicion, even if the report is not substantiated', isCorrect: true },
          { text: 'A clinician declines to report after consulting with a supervisor who advises against it', isCorrect: false },
          { text: 'A clinician reports and the alleged perpetrator is ultimately convicted', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Good-faith immunity protects mandated reporters who make reports based on genuine reasonable suspicion — regardless of whether the report is substantiated. The immunity was specifically designed to remove the chilling effect of potential liability from the decision to report under uncertainty. It does not protect knowingly false or malicious reports, and it does not protect clinicians who fail to report.',
      },
      {
        type: 'multipleChoice',
        question: 'A clinician makes a verbal report to CPS. What additional obligation typically exists under most state mandatory reporting laws?',
        options: [
          { text: 'A follow-up phone call to confirm the report was received', isCorrect: false },
          { text: 'A formal written report submitted within the state-mandated timeframe, typically 24–72 hours', isCorrect: true },
          { text: 'A notarized statement of the disclosure signed by both the client and the clinician', isCorrect: false },
          { text: 'No additional obligation — the oral report satisfies the legal duty', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'Most states require both an oral report (made immediately upon forming reasonable suspicion) and a written report (submitted within 24–72 hours, depending on jurisdiction). Failure to submit the written report is a separate legal violation even when the oral report was correctly made.',
      },
      {
        type: 'multipleChoice',
        question: 'In which of the following states is a domestic violence disclosure by a mental health therapy client most likely to trigger a MANDATORY reporting obligation to law enforcement?',
        options: [
          { text: 'States with permissive reporting frameworks for domestic violence', isCorrect: false },
          { text: 'All states equally — domestic violence reporting obligations are uniform nationally', isCorrect: false },
          { text: 'States that have enacted mandatory domestic violence reporting statutes that specifically include mental health professionals', isCorrect: true },
          { text: 'States where VAWA has been implemented with the most restrictive provisions', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Domestic violence reporting obligations for mental health professionals are entirely creatures of state law, with no uniform federal standard. Some states have enacted mandatory reporting statutes for domestic violence (often focused on healthcare providers treating injuries); most have permissive frameworks. VAWA funds services but does not itself create mandatory reporting obligations for therapists.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes the clinician\'s appropriate response when a client\'s partial disclosure creates genuine uncertainty about whether the reporting threshold has been met?',
        options: [
          { text: 'Conduct a thorough forensic interview to gather enough information to be certain before reporting', isCorrect: false },
          { text: 'Ask only the minimum questions needed to understand the immediate safety concern, document carefully, consult if appropriate, and report if reasonable suspicion exists', isCorrect: true },
          { text: 'Wait for additional disclosures across subsequent sessions before making a determination', isCorrect: false },
          { text: 'Refer the client to another provider who can conduct a proper abuse assessment', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'When a disclosure is partial or ambiguous, the appropriate response is to ask only what is needed to understand immediate safety (not conduct a forensic interview, which is CPS\'s role), document accurately, consult if the clinical picture warrants it, and report if reasonable suspicion exists. Waiting for more disclosures is not clinically or legally appropriate when the current information already meets the threshold.',
      },
      {
        type: 'multipleChoice',
        question: 'A clinician is providing telehealth services to a client physically located in a state different from where the clinician is licensed. Which state\'s mandatory reporting law governs?',
        options: [
          { text: 'The state where the clinician holds their license', isCorrect: false },
          { text: 'The state with the most restrictive mandatory reporting requirements', isCorrect: false },
          { text: 'The state where the client is physically located at the time of service', isCorrect: true },
          { text: 'The state where the abuse is alleged to have occurred', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'In telehealth practice, the mandatory reporting obligation is governed by the law of the state where the client is physically located during the session — not where the clinician is licensed. This means telehealth clinicians serving clients in multiple states must understand each state\'s specific reporting requirements.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is the most appropriate clinical response when a client who has experienced a previous CPS report expresses terror about disclosing ongoing concerns in therapy?',
        options: [
          { text: 'Assure the client that their current disclosures will be kept fully confidential', isCorrect: false },
          { text: 'Avoid asking about abuse to protect the therapeutic alliance', isCorrect: false },
          { text: 'Validate their historical experience, be transparent about current reporting obligations, and explain how the clinician will support them through any future reporting process', isCorrect: true },
          { text: 'Tell the client that CPS has changed significantly since their previous experience', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Clients with prior reporting experiences need validation of their historical experience, transparency about current legal obligations (not false assurances of confidentiality), and explicit information about how the clinician will support them through the reporting process if it occurs. Avoidance of the topic or false assurances of confidentiality would be ethically inappropriate and clinically counterproductive.',
      },
      {
        type: 'multiSelect',
        question: 'Which of the following constitute forms of child neglect that are reportable under most state mandatory reporting statutes? Select ALL that apply.',
        options: [
          { text: 'Physical neglect — failure to provide adequate food, clothing, shelter, or supervision', isCorrect: true },
          { text: 'Educational neglect — failure to enroll a child in school or permit them to attend', isCorrect: true },
          { text: 'Emotional neglect — persistent failure to meet a child\'s basic emotional needs that impairs development', isCorrect: true },
          { text: 'Poverty — a family\'s inability to afford adequate housing or nutrition', isCorrect: false },
          { text: 'Medical neglect — failure to provide necessary medical treatment', isCorrect: true },
        ],
        explanation: 'All four types of neglect — physical, educational, emotional, and medical — are reportable under most state mandatory reporting statutes. Poverty alone is not abuse or neglect; however, the resulting conditions (inadequate nutrition, unsafe housing, failure to provide medical care) may rise to the level of reportable neglect based on the specific circumstances. Clinicians are required to report the harm, not to adjudicate its cause.',
      },
      {
        type: 'multiSelect',
        question: 'Which of the following clinical documentation practices are legally and professionally appropriate surrounding a mandated report? Select ALL that apply.',
        options: [
          { text: 'Recording the client\'s verbatim (or near-verbatim) disclosure language in the clinical record', isCorrect: true },
          { text: 'Documenting the outcome of any supervision or peer consultation conducted', isCorrect: true },
          { text: 'Revising the pre-report documentation after the CPS investigation to reflect what the investigation found', isCorrect: false },
          { text: 'Recording the date, time, hotline called, and case reference number for the oral report', isCorrect: true },
          { text: 'Documenting the post-report conversation with the client and any safety planning conducted', isCorrect: true },
          { text: 'Omitting the consultation documentation if the supervisor advised against reporting', isCorrect: false },
        ],
        explanation: 'All five affirmative practices are appropriate. Revising pre-report documentation after the investigation to match its findings is NOT appropriate — it must reflect the state of knowledge at the time the suspicion formed. Omitting consultation documentation when the supervisor\'s advice differed from the clinician\'s action is also inappropriate; both positions should be documented, along with the clinician\'s independent decision.',
      },
      {
        type: 'multiSelect',
        question: 'Which of the following factors should a clinician in a permissive domestic violence reporting jurisdiction consider when deciding whether to make a report? Select ALL that apply.',
        options: [
          { text: 'Lethality assessment using a validated tool such as the Danger Assessment', isCorrect: true },
          { text: 'The client\'s own safety assessment and capacity for safety planning', isCorrect: true },
          { text: 'The presence of children in the home who may be separately reportable as witnesses or victims', isCorrect: true },
          { text: 'The clinician\'s personal discomfort with the disclosure', isCorrect: false },
          { text: 'The potential impact of a law enforcement report on the therapeutic relationship and future help-seeking', isCorrect: true },
          { text: 'Whether the clinician believes the client is telling the truth', isCorrect: false },
        ],
        explanation: 'In permissive-reporting jurisdictions, the clinical decision involves lethality assessment, survivor safety assessment and planning, child welfare considerations, and the therapeutic relationship implications. The clinician\'s personal discomfort and personal credibility judgments are not appropriate factors in the reporting decision — the focus is on the client\'s safety and the documented clinical assessment.',
      },
      {
        type: 'multiSelect',
        question: 'Which of the following special population considerations are clinically important when navigating mandated reporting with LGBTQ+ youth? Select ALL that apply.',
        options: [
          { text: 'The client\'s sexual orientation or gender identity may itself be the trigger for the abuse', isCorrect: true },
          { text: 'Fear of bias in law enforcement and CPS responses can create barriers to disclosure and reporting', isCorrect: true },
          { text: 'The LGBTQ+ identity of the client eliminates the mandatory reporting obligation', isCorrect: false },
          { text: 'Safety planning must account for the specific risks created by the intersection of abuse and LGBTQ+ identity', isCorrect: true },
          { text: 'Consultation with LGBTQ+-competent protective service providers is appropriate when available', isCorrect: true },
        ],
        explanation: 'LGBTQ+ youth face unique challenges in the mandated reporting context: the abuse may be directly related to their identity, systemic barriers exist in law enforcement and CPS responses, and safety planning must account for identity-specific risks. None of these factors eliminate the reporting obligation — they require that reporting, when it occurs, be accompanied by culturally competent, individualized safety planning.',
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are potential consequences of a mental health professional\'s failure to make a required mandated report? Select ALL that apply.',
        options: [
          { text: 'Criminal prosecution for a misdemeanor or felony offense', isCorrect: true },
          { text: 'Good-faith immunity because the professional consulted a supervisor', isCorrect: false },
          { text: 'Licensing board disciplinary action, potentially including license revocation', isCorrect: true },
          { text: 'Civil liability to the victim or their family in some jurisdictions', isCorrect: true },
          { text: 'Employment termination for violating agency mandatory reporting policies', isCorrect: true },
        ],
        explanation: 'Failure to report exposes clinicians to criminal, licensing, civil, and employment consequences simultaneously. Good-faith immunity is available only to reporters who make good-faith reports — it specifically does not protect clinicians who fail to report. Consulting a supervisor does not constitute a report and does not transfer the legal obligation.',
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are appropriate steps in alliance repair after making a mandated report? Select ALL that apply.',
        options: [
          { text: 'Explicitly discussing the reporting event with the client as a relational occurrence, not just a procedural one', isCorrect: true },
          { text: 'Apologizing for having made the report to reduce the client\'s distress', isCorrect: false },
          { text: 'Validating the client\'s emotional response to the report without requiring it to be "reasonable"', isCorrect: true },
          { text: 'Being transparent with the client about the ongoing mandatory reporting obligation', isCorrect: true },
          { text: 'Validating the client\'s prior negative experiences with reporting, if applicable', isCorrect: true },
          { text: 'Avoiding discussion of the report to allow the therapeutic relationship to return to normal', isCorrect: false },
        ],
        explanation: 'Effective alliance repair after a mandated report involves metacommunication (discussing it as a relational event), validation of the client\'s experience, transparency about ongoing obligations, and acknowledgment of prior negative experiences. Apologizing for making the report — or avoiding the topic — are both contraindicated: apologizing implies the report was wrong; avoidance prevents the therapeutic processing that repair requires.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following best describes the ethical status of "medical neglect" when it results from a family\'s sincere religious beliefs about medical treatment?',
        options: [
          { text: 'Religious medical neglect is universally exempt from mandatory reporting under the First Amendment', isCorrect: false },
          { text: 'Religious motivation eliminates the harm to the child, so reporting is not required', isCorrect: false },
          { text: 'Some states have religious exemption provisions in their medical neglect statutes, but these vary in scope and legal validity; clinicians should consult legal counsel before assuming an exemption applies', isCorrect: true },
          { text: 'Only physicians, not mental health professionals, are required to report religiously motivated medical neglect', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: 'Religious exemption provisions in child medical neglect statutes exist in some states but vary significantly in scope and have been challenged in court. Clinicians should not assume a religious exemption applies without confirming the specific statutory provision in their state. When life-threatening medical neglect is involved, the ethical imperative is clear regardless of legal complexity, and consultation with legal counsel or the licensing board should not cause undue delay in reporting.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // REFERENCES
  // ───────────────────────────────────────────────────────────────────────────
  references: [
    {
      citation: 'Campbell, J. C., Webster, D., Koziol-McLain, J., Block, C., Campbell, D., Curry, M. A., Gary, F., Glass, N., McFarlane, J., Sachs, C., Sharps, P., Ulrich, Y., Wilt, S. A., Manganello, J., Xu, X., Schollenberger, J., Frye, V., & Laughon, K. (2003). Risk factors for femicide in abusive relationships: Results from a multisite case control study. <em>American Journal of Public Health, 93</em>(7), 1089–1097. https://doi.org/10.2105/ajph.93.7.1089',
    },
    {
      citation: 'Child Welfare Information Gateway. (2023). <em>Mandatory reporters of child abuse and neglect</em>. U.S. Department of Health and Human Services, Administration for Children and Families, Children\'s Bureau. https://www.childwelfare.gov/topics/systemwide/laws-policies/statutes/manda/',
    },
    {
      citation: 'Crenshaw, D. A., & Mordock, J. B. (2005). <em>Understanding and treating the aggression of children: Fawns in gorilla suits</em>. Jason Aronson.',
    },
    {
      citation: 'Delaronde, S., King, G., Bendel, R., & Reece, R. (2000). Opinions among mandated reporters toward child maltreatment reporting policies. <em>Child Abuse & Neglect, 24</em>(7), 901–910. https://doi.org/10.1016/S0145-2134(00)00143-4',
    },
    {
      citation: 'Dettlaff, A. J., & Rycraft, J. R. (2010). Factors contributing to disproportionality in the child welfare system: Views from the front line. <em>Social Work, 55</em>(3), 213–224. https://doi.org/10.1093/sw/55.3.213',
    },
    {
      citation: 'Dombo, E. A., & Gray, C. (2013). Engaging spirituality in addressing vicarious trauma in clinical social workers: A self-care model. <em>Social Work and Christianity, 40</em>(1), 89–104.',
    },
    {
      citation: 'English, D. J., Upadhyaya, M. P., Litrownik, A. J., Marshall, J. M., Runyan, D. K., Graham, J. C., & Dubowitz, H. (2005). Maltreatment\'s wake: The relationship of maltreatment dimensions to child outcomes. <em>Child Abuse & Neglect, 29</em>(5), 597–619. https://doi.org/10.1016/j.chiabu.2004.12.008',
    },
    {
      citation: 'Fallon, B., Trocmé, N., Fluke, J., MacLaurin, B., Tonmyr, L., & Yuan, Y.-Y. (2010). Methodological challenges in measuring child maltreatment. <em>Child Abuse & Neglect, 34</em>(1), 70–79. https://doi.org/10.1016/j.chiabu.2009.08.008',
    },
    {
      citation: 'Fontes, L. A. (2005). <em>Child abuse and culture: Working with diverse families</em>. Guilford Press.',
    },
    {
      citation: 'Goodman-Brown, T. B., Edelstein, R. S., Goodman, G. S., Jones, D. P. H., & Gordon, D. S. (2003). Why children tell: A model of children\'s disclosure of sexual abuse. <em>Child Abuse & Neglect, 27</em>(5), 525–540. https://doi.org/10.1016/S0145-2134(03)00037-1',
    },
    {
      citation: 'Kohl, P. L., Edleson, J. L., English, D. J., & Barth, R. P. (2005). Domestic violence and pathways into child welfare services: Findings from the National Survey of Child and Adolescent Well-Being. <em>Children and Youth Services Review, 27</em>(11), 1167–1182. https://doi.org/10.1016/j.childyouth.2005.04.003',
    },
    {
      citation: 'Lau, A. S., Leeb, R. T., English, D., Graham, J. C., Briggs, E. C., Brody, K. E., & Marshall, J. M. (2005). What\'s in a name? A comparison of methods for classifying predominant type of maltreatment. <em>Child Abuse & Neglect, 29</em>(5), 533–551. https://doi.org/10.1016/j.chiabu.2003.06.001',
    },
    {
      citation: 'McTavish, J. R., MacGregor, J. C. D., Wathen, C. N., & MacMillan, H. L. (2016). Children\'s exposure to intimate partner violence: An overview. <em>International Review of Psychiatry, 28</em>(5), 504–518. https://doi.org/10.1080/09540261.2016.1205001',
    },
    {
      citation: 'Nuttall, R., & Jackson, H. (1994). Personal history of childhood abuse among clinicians. <em>Child Abuse & Neglect, 18</em>(5), 455–472. https://doi.org/10.1016/0145-2134(94)90030-2',
    },
    {
      citation: 'Sedlak, A. J., Mettenburg, J., Basena, M., Petta, I., McPherson, K., Greene, A., & Li, S. (2010). <em>Fourth national incidence study of child abuse and neglect (NIS-4): Report to Congress</em>. U.S. Department of Health and Human Services, Administration for Children and Families. https://www.acf.hhs.gov/sites/default/files/documents/opre/nis4_report_congress_full_pdf_jan2010.pdf',
    },
    {
      citation: 'Wiehe, V. R. (1996). <em>Working with child abuse and neglect: A primer</em>. SAGE Publications.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function stripHTML(h) {
  return (h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(c) {
  let t = 0;
  for (const s of c.sections || []) {
    for (const b of s.contentBlocks || []) {
      if (b.content) t += stripHTML(b.content).split(/\s+/).filter(Boolean).length;
      if (b.question) t += stripHTML(b.question).split(/\s+/).filter(Boolean).length;
      if (b.explanation) t += stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
      if (b.accordionItems) b.accordionItems.forEach(a => {
        t += stripHTML(a.title).split(/\s+/).filter(Boolean).length;
        t += stripHTML(a.content).split(/\s+/).filter(Boolean).length;
      });
      if (b.options) b.options.forEach(o => t += stripHTML(typeof o === 'string' ? o : o.text || '').split(/\s+/).filter(Boolean).length);
      if (b.cards || b.flashcards) (b.cards || b.flashcards || []).forEach(c => {
        t += stripHTML(c.front).split(/\s+/).filter(Boolean).length;
        t += stripHTML(c.back).split(/\s+/).filter(Boolean).length;
      });
      if (b.nodes) b.nodes.forEach(n => {
        t += stripHTML(n.text).split(/\s+/).filter(Boolean).length;
        if (n.choices) n.choices.forEach(ch => t += stripHTML(ch.text).split(/\s+/).filter(Boolean).length);
      });
      if (b.matchingPairs) b.matchingPairs.forEach(p => {
        t += stripHTML(p.term).split(/\s+/).filter(Boolean).length;
        t += stripHTML(p.definition).split(/\s+/).filter(Boolean).length;
      });
      if (b.steps) b.steps.forEach(s => t += stripHTML(s.text).split(/\s+/).filter(Boolean).length);
      if (b.takeaways) b.takeaways.forEach(tk => t += stripHTML(tk).split(/\s+/).filter(Boolean).length);
      if (b.blanks) b.blanks.forEach(bl => {
        t += stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;
        t += stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;
      });
      if (b.resources) b.resources.forEach(r => {
        t += stripHTML(r.name || '').split(/\s+/).filter(Boolean).length;
        t += stripHTML(r.description || '').split(/\s+/).filter(Boolean).length;
      });
      if (b.title && b.type !== 'sectionDivider') t += stripHTML(b.title).split(/\s+/).filter(Boolean).length;
      if (b.subtitle) t += stripHTML(b.subtitle).split(/\s+/).filter(Boolean).length;
      if (b.matchingInstructions) t += stripHTML(b.matchingInstructions).split(/\s+/).filter(Boolean).length;
      if (b.instructions) t += stripHTML(b.instructions).split(/\s+/).filter(Boolean).length;
    }
  }
  return t;
}

function validate(c) {
  const e = [];
  const wc = countWords(c);
  if (wc < c.ceHours * 6000) e.push(`CRITICAL:words (${wc}/${c.ceHours * 6000})`);

  for (const [i, s] of (c.sections || []).entries()) {
    const t = (s.contentBlocks || []).map(b => b.type);
    if (!t.includes('sectionDivider')) e.push(`S${i + 1}:divider`);
    if (t.filter(x => ['multipleChoice', 'multiSelect', 'matching', 'fillInBlank'].includes(x)).length < 2) e.push(`S${i + 1}:KC<2`);
    if (t.filter(x => ['flashcardDeck', 'scenarioTree', 'cardSort', 'sequencing'].includes(x)).length < 1 && i > 0 && i < c.sections.length - 1) e.push(`S${i + 1}:activity`);
    for (const b of s.contentBlocks || []) {
      if (b.options?.length && typeof b.options[0] === 'string') e.push('CRITICAL:flat_options');
    }
  }

  if ((c.assessment?.questions?.length || 0) < 15) e.push('CRITICAL:exam<15');
  if ((c.references?.length || 0) < 15) e.push('CRITICAL:refs<15');
  return { wc, e };
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────────────────────────────────────

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
