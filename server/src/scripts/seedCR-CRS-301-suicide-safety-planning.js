/**
 * Seed: CR-CRS-301 — Suicide Safety Planning: From Assessment to Lethal Means Counseling
 * GA Integrated Therapeutic Perspectives LLC · NBCC ACEP #7760
 * 3 CE hours · clinical · intermediate
 *
 * The COURSE object is defined first, then the validation + seed runner at the bottom.
 */

const COURSE = {
  courseCode: 'CR-CRS-301',
  title: 'Suicide Safety Planning: From Assessment to Lethal Means Counseling',
  slug: 'cr-crs-301-suicide-safety-planning',
  ceHours: 3,
  category: 'clinical',
  difficulty: 'intermediate',
  status: 'draft',
  isPublished: false,
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC'
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC'
  },
  approvals: [
    { body: 'NBCC', number: '#7760', hourBreakdown: [{ label: 'core', hours: 3 }] }
  ],
  description: 'A comprehensive, evidence-based clinical training on suicide risk assessment, the Stanley-Brown Safety Planning Intervention, lethal means counseling, and care for special populations. Designed for licensed mental health professionals seeking practical, protocol-driven competence in working with clients at risk of suicide.',
  learningObjectives: [
    'Describe the epidemiology of suicide in the United States and distinguish between suicidal ideation, intent, plan, means, and attempt.',
    'Apply validated risk assessment frameworks including the Columbia Suicide Severity Rating Scale (C-SSRS) and stratify risk into low, moderate, high, and imminent categories.',
    'Implement the six steps of the Stanley-Brown Safety Planning Intervention collaboratively with a client.',
    'Conduct lethal means counseling, including means restriction conversations regarding firearms and medications.',
    'Adapt assessment and safety planning approaches for adolescents, veterans, LGBTQ+ clients, and older adults.',
    'Identify hospitalization criteria and apply clinician self-care and supervision strategies when working with suicidal clients.'
  ],

  sections: [

    // ============================================================
    // SECTION 0 — INTRODUCTION
    // ============================================================
    {
      title: 'Introduction & Course Overview',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction & Course Overview',
          subtitle: 'Foundations of Suicide Risk Assessment and Safety Planning'
        },
        {
          type: 'text',
          content: `<h2>Welcome to Suicide Safety Planning</h2>
<p>Suicide is one of the most consequential clinical encounters a mental health professional will ever face, and it is also one of the most common. Nearly every licensed counselor, social worker, and therapist will, at some point in their career, sit across from a client who is thinking about ending their life. How we respond in those moments&mdash;our composure, our clinical reasoning, our willingness to ask direct questions, and our ability to collaboratively build a plan that keeps a person alive&mdash;can be the difference between a tragedy and a turning point.</p>
<p>This course is designed to move you from a place of general awareness toward genuine clinical competence. Many clinicians complete graduate programs with surprisingly little hands-on training in suicide assessment and intervention. Surveys consistently reveal that practitioners feel underprepared, anxious, and uncertain when faced with disclosures of suicidal thinking. That discomfort is understandable. Yet discomfort, when unaddressed, can lead to avoidance: vague questions, premature reassurance, ineffective &ldquo;no-harm contracts,&rdquo; and a reluctance to probe the very details that determine risk. The goal of this training is to replace that avoidance with structured, evidence-based confidence.</p>
<p>In the United States, suicide claims more than 49,000 lives each year, making it consistently among the top twelve leading causes of death overall and one of the top three causes of death for people between the ages of ten and thirty-four. For every death by suicide, there are many more attempts, and for every attempt, many more individuals who experience serious suicidal ideation. These are not abstract numbers. They represent the clients on your caseload right now&mdash;some of whom have never told anyone what they are thinking.</p>
<p>Over the next three contact hours, this course will guide you through four integrated domains of practice. First, you will learn the epidemiology and the assessment frameworks that allow you to recognize and stratify risk, including the Columbia Suicide Severity Rating Scale, one of the most widely used and well-validated tools in the field. Second, you will master the Stanley-Brown Safety Planning Intervention, a brief, collaborative, evidence-supported protocol that has been shown to reduce suicidal behavior and increase treatment engagement. Third, you will study lethal means counseling&mdash;the practice of helping clients and families reduce access to the methods most likely to be lethal during a crisis. Finally, you will examine the unique needs of special populations and the often-overlooked dimension of clinician self-care.</p>
<p><strong>By the end of this course, you will be able to:</strong></p>
<ul>
<li>Describe the epidemiology of suicide in the United States and distinguish between ideation, intent, plan, means, and attempt.</li>
<li>Apply validated risk assessment frameworks, including the C-SSRS, and stratify risk into clinically meaningful categories.</li>
<li>Implement the six steps of the Stanley-Brown Safety Planning Intervention collaboratively with clients.</li>
<li>Conduct lethal means counseling and facilitate means restriction conversations.</li>
<li>Adapt your approach for adolescents, veterans, LGBTQ+ clients, and older adults.</li>
<li>Identify hospitalization criteria and apply self-care and supervision strategies in this demanding work.</li>
</ul>
<p>This is practical, applied training. You will encounter clinical vignettes, branching scenarios, knowledge checks, and reflection prompts throughout. We encourage you to engage with each one as if a real client were in the room, because the skills you build here are meant to be used at the bedside, in the office, and over telehealth&mdash;wherever a person in pain decides to trust you with the truth.</p>
<h3>A Note on Language and Stance</h3>
<p>Before we proceed, a word about language. The way we speak and write about suicide shapes both our clinical posture and our clients&rsquo; willingness to confide in us. Contemporary best practice has moved decisively away from the phrase &ldquo;committed suicide,&rdquo; which carries connotations of crime and sin rooted in eras when suicide was illegal and morally condemned. We instead say &ldquo;died by suicide&rdquo; or &ldquo;ended their life.&rdquo; Similarly, we avoid characterizing attempts as &ldquo;successful&rdquo; or &ldquo;failed,&rdquo; language that bizarrely frames death as an achievement. These are not mere matters of political correctness; they are clinical tools. A client who senses judgment in our vocabulary will sense judgment in our questions, and judgment is the enemy of disclosure.</p>
<p>The therapeutic stance we cultivate throughout this course is one of <strong>compassionate curiosity paired with calm directness.</strong> Clients who are suicidal are often terrified of their own thoughts and ashamed to voice them. When we respond to a disclosure of suicidal ideation with composure rather than alarm, with curiosity rather than recoil, and with collaborative problem-solving rather than reflexive control, we communicate something profoundly therapeutic: <em>your pain is not too much for me, and you are not alone with it.</em> That message&mdash;more than any single technique&mdash;is what keeps clients engaged and alive.</p>
<h3>The Recovery-Oriented Philosophy</h3>
<p>Modern suicide care is recovery-oriented and collaborative. It rejects the older, custodial model in which the clinician&rsquo;s job was primarily to control the client and remove all agency in the name of safety. Excessive control&mdash;reflexive hospitalization, surveillance, the stripping away of autonomy&mdash;can paradoxically increase risk by deepening hopelessness, shame, and the very sense of entrapment that drives suicide. Instead, the contemporary approach partners <em>with</em> the client to build their capacity to survive a crisis and to construct a life worth living. Safety planning embodies this philosophy: the plan belongs to the client, is written in their words, and equips them to act on their own behalf. Our role is not to take over a life, but to help a person hold on to theirs.</p>
<p>Keep this orientation in mind as you work through the material. Every framework, every step, every conversation we examine is in service of one goal: helping a human being survive the worst hours of their life and find their way back toward hope.</p>`
        },
        {
          type: 'videoEmbed',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoTitle: 'Understanding Suicide Risk: An Evidence-Based Approach',
          description: 'This introductory video orients you to the core concepts of suicide risk assessment and the collaborative, recovery-oriented philosophy that underpins modern safety planning. It frames the clinical mindset you will carry through the remainder of the course.'
        },
        {
          type: 'imageText',
          title: 'The National Burden of Suicide',
          content: `<p>Suicide is a public health crisis hiding in plain sight. According to the Centers for Disease Control and Prevention, suicide rates in the United States rose roughly 30 percent between 2000 and 2018, and after a brief plateau have continued to climb, reaching record highs in recent years. The burden is not evenly distributed: rates are highest among middle-aged and older men, American Indian and Alaska Native communities, and veterans, while suicide attempts are disproportionately common among adolescents, young adults, and LGBTQ+ individuals.</p>
<p>The economic and human costs are staggering. Beyond the lives lost, suicide leaves an estimated 135 people exposed or bereaved per death, rippling through families, schools, workplaces, and communities. Yet the most important fact for a clinician to internalize is this: suicide is often preventable. The crisis that drives a person toward suicide is frequently acute and time-limited. If we can help a client survive the hours and days of greatest danger&mdash;by reducing access to lethal means, mobilizing support, and equipping them with concrete coping steps&mdash;we dramatically increase the odds that they will live to see the crisis pass.</p>
<p>Consider, too, the scale of the iceberg beneath these deaths. National survey data suggest that in a single year more than twelve million American adults seriously think about suicide, well over three million make a plan, and more than one million make an attempt. These individuals are not confined to psychiatric hospitals or emergency rooms; they are sitting in primary care waiting rooms, school counseling offices, employee assistance programs, and routine outpatient therapy sessions. Many will never present to a crisis service at all. This means that the responsibility for suicide prevention does not rest solely with specialists&mdash;it belongs to every clinician who sees clients, including you.</p>
<p>It also bears emphasizing that the trajectory of risk is rarely linear. A person may carry chronic, simmering risk for years and then be tipped into acute danger by a single precipitating event&mdash;a relationship ending, a job lost, a humiliating disclosure, an arrest. Conversely, a client who appears to be in profound crisis today may, with the right support and the passage of time, stabilize and recover fully. The clinician&rsquo;s task is to read these shifting tides accurately and to intervene with neither complacency nor panic. The remainder of this course equips you to do exactly that.</p>`,
          image: '',
          imageAlt: 'Conceptual illustration of the national landscape of suicide as a public health concern',
          imagePosition: 'right'
        },
        {
          type: 'multipleChoice',
          question: 'Approximately how many people in the United States die by suicide each year?',
          options: [
            { text: 'Fewer than 5,000', isCorrect: false },
            { text: 'About 15,000', isCorrect: false },
            { text: 'More than 49,000', isCorrect: true },
            { text: 'More than 500,000', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'More than 49,000 people die by suicide in the United States annually, a rate of roughly 14 per 100,000, making suicide consistently one of the leading causes of death and a major public health crisis. For every death there are many more attempts and far more individuals experiencing serious suicidal ideation.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following accurately describe the contemporary, recovery-oriented approach to suicide care emphasized in this course? (Select all that apply.)',
          options: [
            { text: 'Asking directly and calmly about suicide rather than avoiding the topic', isCorrect: true },
            { text: 'Collaborating with the client to build their capacity to survive a crisis', isCorrect: true },
            { text: 'Relying primarily on no-harm contracts to ensure safety', isCorrect: false },
            { text: 'Using language such as "died by suicide" rather than "committed suicide"', isCorrect: true },
            { text: 'Defaulting to custodial control and removal of the client’s autonomy', isCorrect: false },
            { text: 'Pairing assessment directly with an intervention and safety plan', isCorrect: true }
          ],
          explanation: 'The recovery-oriented approach asks directly and compassionately, collaborates with the client to build survival capacity, uses non-stigmatizing language, and links assessment to intervention. It rejects ineffective no-harm contracts and the older custodial model of reflexive control, which can deepen hopelessness and paradoxically increase risk.'
        }
      ]
    },

    // ============================================================
    // SECTION 1 — UNDERSTANDING SUICIDE RISK
    // ============================================================
    {
      title: 'Understanding Suicide Risk: Epidemiology, Assessment, and Risk Frameworks',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Understanding Suicide Risk',
          subtitle: 'Epidemiology, Assessment, and Risk Frameworks'
        },
        {
          type: 'text',
          content: `<h2>The Epidemiology of Suicide</h2>
<p>To assess suicide risk competently, a clinician must first understand the population-level patterns that shape individual presentations. Epidemiology does not predict any single person&rsquo;s behavior&mdash;no statistic can&mdash;but it sharpens our clinical attention and reminds us where danger tends to cluster.</p>
<p>In the United States, suicide is responsible for more than 49,000 deaths annually, a rate of roughly 14 per 100,000 people. Men die by suicide at nearly four times the rate of women, largely because men more often use highly lethal means such as firearms. Women, however, attempt suicide more frequently than men, often by less immediately lethal methods such as poisoning or overdose. This divergence&mdash;men dying more, women attempting more&mdash;is sometimes called the &ldquo;gender paradox&rdquo; of suicide, and it underscores why method lethality is central to risk assessment.</p>
<p>Age patterns are equally instructive. Suicide is a leading cause of death among adolescents and young adults, yet the highest rates occur among middle-aged adults (45 to 64) and older men (75 and older). American Indian and Alaska Native populations carry the highest rates of any racial or ethnic group, followed by non-Hispanic white populations. Veterans die by suicide at a rate roughly 50 percent higher than non-veteran adults. Geography matters too: rural areas show higher suicide rates than urban areas, driven in part by greater firearm access, social isolation, and reduced access to mental health care.</p>
<p>Temporal patterns add further nuance. Contrary to popular belief, suicides do not peak during the winter holidays; rates are generally highest in late spring and early summer, a counterintuitive finding sometimes attributed to the painful contrast between a brightening external world and persistent internal darkness. Certain occupations carry elevated risk&mdash;construction and extraction workers, farmers, physicians, and first responders among them&mdash;reflecting combinations of stress, access to means, stigma, and culture. Marital status, employment, and the presence of dependent children all modulate risk as well. None of these patterns predicts an individual outcome, but together they form the epidemiological backdrop against which an individual presentation is read.</p>
<h3>Risk Factors and Protective Factors</h3>
<p>Risk factors are characteristics or conditions that increase the statistical likelihood of suicidal behavior. They are commonly grouped into categories. Psychiatric risk factors include depression, bipolar disorder, substance use disorders, post-traumatic stress disorder, and a prior suicide attempt&mdash;the single strongest predictor of future suicide. Psychological factors include hopelessness, perceived burdensomeness, thwarted belonging, impulsivity, and a sense of being trapped with no escape. Social and environmental factors include relationship loss, financial or legal stress, unemployment, social isolation, access to lethal means, and recent exposure to another person&rsquo;s suicide. Historical factors include childhood trauma, family history of suicide, and chronic pain or illness.</p>
<p>Protective factors, by contrast, buffer against risk. These include strong social connections and family support, religious or spiritual beliefs that discourage suicide, responsibility to children or pets, effective clinical care, problem-solving and coping skills, restricted access to lethal means, and reasons for living. A central clinical principle is that protective factors do not cancel out risk factors in a simple arithmetic sense&mdash;a client with many supports can still be at high risk&mdash;but cultivating and activating protective factors is a core therapeutic strategy.</p>
<h3>The Continuum of Suicidality</h3>
<p>One of the most important conceptual skills in this work is the ability to distinguish among the elements of suicidality. <strong>Suicidal ideation</strong> refers to thoughts about ending one&rsquo;s life, ranging from passive (&ldquo;I wish I could go to sleep and not wake up&rdquo;) to active (&ldquo;I think about killing myself&rdquo;). <strong>Intent</strong> refers to the seriousness of a person&rsquo;s wish to die and their resolve to act&mdash;a person may have frequent ideation with little intent, or rare ideation with frightening intent. A <strong>plan</strong> describes a specific method, time, and place. <strong>Means</strong> refers to access to the method&mdash;a client who has a plan to overdose and a stockpiled supply of medication is at higher risk than one with the same plan but no access. An <strong>attempt</strong> is a self-directed, potentially injurious behavior with at least some intent to die. These distinctions are not academic. They map directly onto risk stratification and onto the specific interventions&mdash;like means restriction&mdash;that follow.</p>
<h3>Asking Directly: Overcoming the Clinician&rsquo;s Hesitation</h3>
<p>One of the most persistent and dangerous myths in clinical work is the belief that asking about suicide will &ldquo;plant the idea&rdquo; or push a vulnerable person toward action. Decades of empirical research have thoroughly debunked this notion. Studies in which patients are systematically screened for suicidal ideation consistently show that direct inquiry does not increase suicidal thoughts or behavior; on the contrary, many clients report relief at finally being asked, at being given permission to speak about thoughts they had been carrying in shameful silence. The willingness to ask, plainly and without flinching, is itself therapeutic.</p>
<p>Effective inquiry begins with normalizing, validating language and proceeds to specific, graded questions. A clinician might open with, &ldquo;When people are going through what you&rsquo;re going through, they sometimes have thoughts that life isn&rsquo;t worth living, or thoughts of ending their life. Has anything like that crossed your mind?&rdquo; This framing communicates that such thoughts are understandable and that the clinician is unafraid to hear them. From there, the clinician moves systematically through the continuum: passive versus active ideation, frequency and duration, the presence of a method, access to that method, intent and resolve, any preparatory behavior, and prior attempts. Each answer informs the next question and, ultimately, the risk formulation.</p>
<h3>Non-Suicidal Self-Injury and Its Relationship to Suicide</h3>
<p>Clinicians must also understand non-suicidal self-injury (NSSI)&mdash;deliberate, self-inflicted damage to body tissue without suicidal intent, such as cutting, burning, or scratching. NSSI typically functions to regulate overwhelming emotion, to punish oneself, or to end a state of dissociative numbness. Although NSSI is by definition distinct from a suicide attempt, the two are not unrelated: a history of NSSI is associated with increased risk of future suicide attempts, in part because repeated self-injury can build the acquired capability for lethal self-harm by habituating a person to pain and reducing the instinctive fear of bodily damage. A careful assessment therefore distinguishes the function and intent behind self-injurious behavior while recognizing that NSSI is a warning sign warranting thorough evaluation, never a behavior to be dismissed as merely &ldquo;attention-seeking.&rdquo;</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Columbia Suicide Severity Rating Scale (C-SSRS)',
          content: `<p>The Columbia Suicide Severity Rating Scale, developed by Kelly Posner and colleagues, is among the most widely used and rigorously validated suicide assessment instruments in the world. It is used in clinical settings, research, emergency departments, schools, and primary care because it provides a structured, evidence-based way to ask about suicidal ideation and behavior using plain language.</p>
<p>The C-SSRS assesses <strong>ideation severity</strong> on a five-point continuum: (1) wish to be dead, (2) nonspecific active suicidal thoughts, (3) active ideation with methods but no plan or intent, (4) active ideation with some intent but no specific plan, and (5) active ideation with specific plan and intent. The scale also assesses <strong>ideation intensity</strong> (frequency, duration, controllability, deterrents, and reasons for ideation) and <strong>suicidal behavior</strong> (actual attempts, interrupted attempts, aborted attempts, preparatory behavior, and non-suicidal self-injury).</p>
<p>A practical strength of the C-SSRS is that the answers triage action. A &ldquo;yes&rdquo; to questions four or five&mdash;or any recent suicidal behavior&mdash;signals high acuity and the need for immediate safety measures. The scale moves from less to more severe, so a &ldquo;no&rdquo; to early questions can allow you to skip ahead, making it efficient even in busy settings.</p>
<p>Several practical points enhance the tool&rsquo;s clinical value. First, the C-SSRS is available in numerous validated versions&mdash;screener, full, lifetime/recent, and since-last-visit&mdash;allowing it to be matched to the setting and to repeated administration over the course of treatment. Second, it can be administered by non-clinicians after brief training, which is why it has been deployed so widely in schools, jails, and primary care. Third, and most importantly, the C-SSRS structures but does not replace the clinical interview: a thoughtful clinician uses the client&rsquo;s answers as a springboard for the qualitative inquiry into intent, deterrents, and reasons for living that ultimately drives the risk formulation. Used in this spirit&mdash;as a scaffold for, rather than a substitute for, clinical engagement&mdash;the C-SSRS is among the most valuable instruments a suicide-care clinician can master.</p>`
        },
        {
          type: 'text',
          content: `<h2>Risk Assessment Frameworks</h2>
<p>No single instrument can predict suicide, and clinicians should resist the temptation to treat any score as a substitute for clinical judgment. Rather, structured frameworks organize our thinking and ensure that we do not overlook critical domains. Several frameworks have shaped contemporary practice.</p>
<p>The <strong>SAD PERSONS scale</strong> is a long-standing mnemonic that catalogues risk factors: Sex (male), Age (older or adolescent), Depression, Previous attempt, Ethanol or substance abuse, Rational thinking loss, Social supports lacking, Organized plan, No spouse, and Sickness. While useful as a memory aid and a teaching tool, SAD PERSONS has been criticized for weak predictive validity and should never be used mechanically to make disposition decisions. It is best understood as a checklist that prompts thorough exploration, not a calculator that produces a verdict.</p>
<p>The <strong>Beck Scale for Suicidal Ideation (BSS)</strong> is a 21-item self-report instrument that measures the intensity, pervasiveness, and characteristics of suicidal ideation. Developed by Aaron Beck, it is particularly attentive to the role of hopelessness, which Beck&rsquo;s research identified as a powerful predictor of eventual suicide&mdash;often a stronger predictor than depression severity itself. The companion Beck Hopelessness Scale is frequently used alongside it.</p>
<p>Two additional brief instruments deserve mention because of their practicality. The <strong>Patient Health Questionnaire (PHQ-9)</strong>, a widely used depression screener, includes a ninth item that asks directly about thoughts of being better off dead or hurting oneself; a positive response on this item should always trigger a fuller suicide assessment rather than being noted and passed over. The <strong>Ask Suicide-Screening Questions (ASQ)</strong> tool is a brief, validated four-question screen developed for use in medical settings, including with youth, and is valuable precisely because it can be administered quickly by non-specialists to surface risk that would otherwise go undetected. The key principle across all of these tools is that screening instruments identify <em>who needs a fuller assessment</em>; they do not, by themselves, constitute the assessment or the disposition decision.</p>
<h3>Risk Stratification</h3>
<p>Contemporary practice emphasizes <strong>risk stratification</strong>: synthesizing the data from interview and instruments into a categorical judgment that drives clinical action. While terminology varies, a common scheme distinguishes four levels:</p>
<p><strong>Low risk</strong> describes a client with passive or fleeting ideation, no plan, no intent, no access to lethal means, strong protective factors, and good capacity to engage in treatment. The appropriate response is typically outpatient care, a safety plan, follow-up, and ongoing monitoring.</p>
<p><strong>Moderate risk</strong> describes a client with active ideation, perhaps some thought of method, but limited intent and no immediate plan, often with significant risk factors balanced by protective ones. This warrants increased contact, a robust safety plan, means restriction, mobilization of supports, and possible referral for higher levels of outpatient care.</p>
<p><strong>High risk</strong> describes a client with active ideation, a plan, available means, and meaningful intent, with eroded protective factors. This requires intensive intervention&mdash;safety planning, urgent means restriction, consideration of crisis services, and possible hospitalization.</p>
<p><strong>Imminent risk</strong> describes a client who is in immediate danger&mdash;intent and means and plan converging, perhaps with preparatory behavior already underway. This demands immediate action to ensure safety, which may include emergency services and involuntary hospitalization. Critically, risk is dynamic: a client can move between levels within hours. Stratification is a snapshot, not a forecast, and must be revisited continually.</p>
<h3>The Limits of Prediction and the Primacy of Modifiable Factors</h3>
<p>It is essential to be honest about what risk assessment can and cannot do. No instrument, algorithm, or clinician can reliably predict whether a given individual will die by suicide. Suicide is statistically rare even among high-risk groups, which means that any predictive tool will generate enormous numbers of false positives. Researchers who have pooled decades of prediction studies have concluded that our ability to forecast suicide is little better than chance over the long term. This is a humbling and clinically liberating truth: our job is not to play oracle, but to identify and address the factors we can actually change.</p>
<p>This reorients assessment away from static, unchangeable risk factors (sex, age, family history) and toward <strong>modifiable, dynamic factors</strong>&mdash;the ones that move and that we can influence. Access to lethal means is the prime example: it is a powerful risk factor, and it is changeable. Hopelessness can be targeted with cognitive and behavioral interventions. Social isolation can be reduced by activating supports. Acute precipitants such as intoxication, untreated depression, or an interpersonal crisis can be addressed. A modern risk assessment therefore does not end with a label; it ends with a list of modifiable factors and a plan to address each one. The categorical risk level guides the intensity of the response, but the modifiable factors guide its content.</p>
<h3>Contemporary Frameworks: CAMS and the Therapeutic Risk Assessment</h3>
<p>Beyond the classic instruments, several integrative frameworks have shaped current practice. The Collaborative Assessment and Management of Suicidality (CAMS), developed by David Jobes, reframes assessment itself as a collaborative, therapeutic activity. Rather than the clinician interrogating the client and rendering a verdict, the clinician and client sit side by side and complete the assessment together, using the Suicide Status Form to explore the drivers of suicidality&mdash;psychological pain, stress, agitation, hopelessness, self-hate, and the client&rsquo;s own reasons for living and dying. This collaborative stance builds alliance, reduces the adversarial dynamic that can arise when clients fear hospitalization, and yields richer, more honest information. Whatever specific framework a clinician adopts, the underlying principles converge: assess the full continuum, attend to modifiable factors, collaborate rather than interrogate, and translate the assessment directly into an intervention plan.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Psychological Risk Factors',
              content: `<p>Psychological factors are the internal states and cognitive patterns that drive a person toward suicide. Foremost among them is <strong>hopelessness</strong>&mdash;the belief that the future holds nothing but continued suffering. Beck&rsquo;s research demonstrated that hopelessness predicts eventual suicide even more strongly than the severity of depression. Closely related are the constructs from Thomas Joiner&rsquo;s Interpersonal Theory of Suicide: <strong>perceived burdensomeness</strong> (the belief that one&rsquo;s death is worth more than one&rsquo;s life to others) and <strong>thwarted belongingness</strong> (the painful sense of being alienated and disconnected). When these combine with an <strong>acquired capability</strong> for suicide&mdash;a habituation to pain and fear of death often developed through prior self-injury, trauma, or exposure to violence&mdash;risk rises sharply. Other psychological contributors include impulsivity, rigid problem-solving, perfectionism, intense shame, and a sense of entrapment with no perceived escape. Edwin Shneidman, a founder of modern suicidology, captured the core of the suicidal state in his concept of <em>psychache</em>&mdash;unbearable psychological pain arising from frustrated psychological needs. In his formulation, suicide becomes conceivable when this pain exceeds a person&rsquo;s threshold of tolerance and they can see no other way to make it stop. This framing reminds the clinician that the suicidal client is fundamentally seeking escape from intolerable suffering, not death for its own sake&mdash;and that reducing the pain, even modestly, can dissolve the wish to die.</p>`
            },
            {
              title: 'Biological and Psychiatric Risk Factors',
              content: `<p>The strongest single predictor of death by suicide is a <strong>prior suicide attempt</strong>; the risk is especially elevated in the weeks and months following an attempt or psychiatric discharge. Psychiatric conditions dramatically increase risk, with mood disorders (major depression, bipolar disorder), substance use disorders, psychotic disorders, post-traumatic stress disorder, and borderline personality disorder all strongly implicated. Comorbidity&mdash;particularly the combination of a mood disorder with a substance use disorder&mdash;multiplies risk. Biologically, there is evidence for dysregulation in the serotonergic system and the hypothalamic-pituitary-adrenal axis among individuals who die by suicide, and a family history of suicide confers elevated risk through both genetic and environmental pathways. Chronic pain, traumatic brain injury, and serious medical illness also raise risk. A particularly important clinical nuance concerns the early phase of treatment for depression: as a severely depressed person begins to recover, their energy and capacity for action may return before their mood, hopelessness, and suicidal thinking fully lift&mdash;creating a dangerous window in which a previously immobilized person now has the wherewithal to act. Clinicians must remain especially vigilant during medication initiation and early recovery, not complacent simply because the client appears to be &ldquo;improving.&rdquo;</p>`
            },
            {
              title: 'Social and Environmental Risk Factors',
              content: `<p>Suicide does not occur in a vacuum; it is embedded in a social and environmental context. <strong>Relationship loss</strong>&mdash;divorce, separation, the death of a loved one, or a recent breakup&mdash;is a common precipitant. <strong>Financial, legal, and occupational stressors</strong> such as job loss, bankruptcy, foreclosure, or impending incarceration can create a sense of inescapable defeat. <strong>Social isolation</strong> and the absence of a confiding relationship remove the protective effect of connection. <strong>Access to lethal means</strong>, especially firearms in the home, is among the most modifiable environmental risk factors. <strong>Contagion and exposure</strong>&mdash;learning of another person&rsquo;s suicide, particularly through sensationalized media or within a peer cluster&mdash;can precipitate suicidal behavior in vulnerable individuals. Cultural and societal factors, including stigma that discourages help-seeking and discrimination experienced by marginalized groups, further shape risk. Social connectedness is so protective, and its absence so corrosive, that interventions aimed simply at reducing isolation&mdash;caring contacts, peer support, community engagement&mdash;have demonstrable preventive effects. It is worth distinguishing these enduring contextual risk factors from acute precipitants&mdash;the proximate events that tip a vulnerable person into crisis. A humiliating loss, a sudden legal or financial catastrophe, an episode of acute intoxication, or a painful interpersonal rupture can each act as the spark. The clinician should always ask, &ldquo;Why now? What has changed recently?&rdquo; because the answer often reveals both the precipitant to be addressed and the modifiable circumstances driving the present danger. Crucially, several environmental factors are <em>modifiable</em>, which is what makes them so clinically valuable. We cannot change a client&rsquo;s family history, but we can help secure a firearm, mobilize a support, address an acute precipitant, and reduce isolation. A risk assessment that catalogues social and environmental factors should therefore conclude not with a tally but with an action list: which of these can we change, and how, starting today?</p>`
            },
            {
              title: 'Clinical and Warning-Sign Risk Factors',
              content: `<p>Clinicians must distinguish between long-standing <strong>risk factors</strong> and acute <strong>warning signs</strong> that signal escalating danger in the near term. Warning signs include talking or writing about death and suicide, expressing hopelessness or feeling trapped, increasing substance use, withdrawing from others, dramatic mood changes, reckless behavior, giving away prized possessions, saying goodbye, and acquiring the means to harm oneself. A particularly ominous shift is a sudden, unexplained calm in a previously agitated, depressed client&mdash;this can reflect the relief of having decided to act. Clinically, the periods immediately following hospital discharge, a change in medication, a missed appointment, or an acute interpersonal crisis are high-vigilance windows. Recognizing the transition from chronic risk to acute danger is one of the most important judgments a clinician makes. The American Association of Suicidology has promoted the mnemonic <strong>IS PATH WARM</strong> to help clinicians and gatekeepers recall acute warning signs: Ideation, Substance abuse, Purposelessness, Anxiety, Trapped, Hopelessness, Withdrawal, Anger, Recklessness, and Mood changes. While no mnemonic substitutes for clinical judgment, such tools help ensure that escalating signs are not overlooked. The fundamental skill is temporal: distinguishing the steady, background hum of long-standing vulnerability from the rising pitch of an imminent crisis, and matching the intensity of one&rsquo;s response to the urgency of the moment.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Distinguishing Ideation from Intent',
          content: `<p>A frequent clinical error is collapsing ideation and intent into a single judgment. They are distinct, and the difference governs your response. A client may experience frequent, distressing suicidal thoughts yet have no wish to act on them&mdash;perhaps because of religious conviction, devotion to a child, or fear. Conversely, a client may report only occasional thoughts but, when probed, reveal a chilling resolve and a concrete plan. The frequency of ideation does not reliably indicate danger; the presence of intent and plan does.</p>
<p>This is why direct, specific questioning matters. Asking &ldquo;Are you thinking about suicide?&rdquo; opens the door, but the follow-up questions determine risk: &ldquo;When you have these thoughts, do you want to act on them, or do the thoughts come and go without you wanting to act? Have you thought about how you would do it? Do you have access to that method? Have you taken any steps to prepare?&rdquo; Each answer moves you along the continuum from ideation toward intent, plan, and means&mdash;and toward the corresponding intensity of intervention. Crucially, asking these questions does not plant the idea of suicide; decades of research confirm that direct inquiry reduces distress and does not increase risk.</p>
<p>It is equally important to assess the <em>subjective</em> dimensions that the bare facts can miss. Two clients may both report a plan to overdose, yet one is ambivalent, frightened, and reaching out for help, while the other is resolved, calm, and has begun to put affairs in order. The clinician probes the texture of the ideation: How controllable are the thoughts? What deterrents hold the person back, and how strong are they? What reasons for living remain? Is there a sense of resolve and rehearsal, or a desperate wish for the pain&mdash;not the life&mdash;to end? This qualitative inquiry, layered atop the factual continuum, is what separates a checklist from a genuine clinical assessment and is often where the truest signal of danger or safety resides.</p>`,
          image: '',
          imageAlt: 'Diagram contrasting passive ideation, active ideation, intent, and plan along a continuum',
          imagePosition: 'left'
        },
        {
          type: 'multipleChoice',
          question: 'According to the C-SSRS ideation severity continuum, which response indicates the highest level of severity?',
          options: [
            { text: 'Wish to be dead', isCorrect: false },
            { text: 'Nonspecific active suicidal thoughts', isCorrect: false },
            { text: 'Active suicidal ideation with method but no plan or intent', isCorrect: false },
            { text: 'Active suicidal ideation with a specific plan and intent', isCorrect: true }
          ],
          correctAnswer: 3,
          explanation: 'The C-SSRS ideation severity scale ascends from (1) wish to be dead, to (5) active suicidal ideation with specific plan and intent. A "yes" to level 4 or 5 signals high acuity and an immediate need for safety measures. The convergence of plan and intent is the most severe category on the ideation continuum.'
        },
        {
          type: 'text',
          content: `<h2>Documentation After Risk Assessment</h2>
<p>Thorough documentation is not bureaucratic busywork&mdash;it is a clinical and ethical obligation, a tool for continuity of care, and your most important protection in the event of an adverse outcome. The maxim &ldquo;if it wasn&rsquo;t documented, it wasn&rsquo;t done&rdquo; is especially true in suicide care, where a tragic outcome may later be scrutinized by licensing boards, attorneys, and your own conscience.</p>
<p>A defensible suicide risk note documents <strong>the data you gathered</strong>: the client&rsquo;s reported ideation (passive or active), intent, plan, access to means, prior attempts, and current warning signs, as well as relevant risk and protective factors. It documents <strong>your clinical reasoning</strong>: how you weighed the evidence to arrive at a risk level. Standards of care emphasize that you are judged not on whether you correctly predicted an unpredictable event, but on whether your assessment and decision-making were reasonable given the information available. Therefore, the note must show your <strong>risk formulation</strong>&mdash;a narrative synthesis of risk and protective factors leading to a stratified judgment&mdash;rather than a bare checklist.</p>
<p>Finally, the note documents <strong>your intervention and plan</strong>: the collaborative safety plan you developed, the means restriction steps discussed, the level of care you recommended, the consultations you sought, follow-up arrangements, and crisis resources provided. If the client declined a recommendation, document that, your response, and the steps you took. Note any contacts with family or collateral supports made with appropriate consent. Good documentation tells a coherent story: here is what I learned, here is how I made sense of it, and here is what I did about it. That story protects the client through continuity and protects you through transparency.</p>
<h3>Common Documentation Pitfalls</h3>
<p>Several documentation errors recur in clinical practice and in the malpractice cases that follow adverse outcomes. The first is the <strong>conclusory note</strong>&mdash;writing &ldquo;client denies SI/HI, no acute risk&rdquo; with no supporting data or reasoning. Such a note documents a conclusion without showing the work that led to it, and it offers little protection or clinical value. The second is the <strong>copy-forward note</strong>, in which a clinician electronically duplicates the prior session&rsquo;s risk assessment without updating it, creating a record that appears thorough but reflects no actual reassessment. The third is the <strong>defensive omission</strong>, in which a clinician, fearing liability, fails to document a client&rsquo;s disclosure of ideation or a declined recommendation&mdash;an omission that is far more damaging than honest documentation of a difficult clinical situation.</p>
<p>The antidote to these pitfalls is a habit of contemporaneous, narrative documentation that captures the clinician&rsquo;s actual reasoning. When risk is elevated, the note should explicitly address why the chosen level of care is appropriate and what alternatives were considered. When a client declines a recommendation&mdash;say, refusing to involve a family member in securing a firearm&mdash;the note should record the recommendation, the client&rsquo;s response, the clinician&rsquo;s further efforts, and the rationale for the disposition reached. Documenting a consultation with a supervisor or colleague is especially valuable, as it demonstrates that the clinician&rsquo;s judgment was tested against another professional&rsquo;s. Remember that the legal and ethical standard is reasonableness, not perfection or prophecy.</p>
<h3>Confidentiality, Duty, and Disclosure</h3>
<p>Suicide risk also raises questions about the limits of confidentiality. Clinicians are ethically and, in many jurisdictions, legally permitted to breach confidentiality to protect a client at imminent risk of self-harm&mdash;for example, by contacting emergency services or a family member who can secure means or ensure safety. These disclosures should be limited to what is necessary to address the danger, and, whenever possible, made collaboratively and with the client&rsquo;s knowledge. Proactively discussing the limits of confidentiality at the outset of treatment&mdash;clearly explaining that you may need to act to keep the client safe&mdash;builds trust and prevents the client from feeling betrayed if such action becomes necessary. Knowing your own state&rsquo;s statutes and your professional code&rsquo;s provisions on this point is a core competency for any clinician working with suicidal clients.</p>`
        },
        {
          type: 'flashcardDeck',
          instructions: 'Review these key terms from Section 1. Click each card to reveal the definition, then test your recall.',
          flashcards: [
            { front: 'Passive suicidal ideation', back: 'Thoughts of death or a wish to be dead without a desire to take active steps to end one’s life (e.g., "I wish I wouldn’t wake up tomorrow"). Often a marker of significant distress that warrants further assessment.' },
            { front: 'Active suicidal ideation', back: 'Thoughts of actively ending one’s own life, which may or may not include a method, plan, or intent. Active ideation sits higher on the risk continuum than passive ideation and requires direct probing of intent and plan.' },
            { front: 'Suicidal intent', back: 'The seriousness of a person’s wish to die and their resolve to act on suicidal thoughts. Intent is distinct from ideation frequency and is a central driver of risk stratification.' },
            { front: 'C-SSRS', back: 'The Columbia Suicide Severity Rating Scale, a validated, structured instrument that assesses ideation severity (1–5), ideation intensity, and suicidal behavior using plain language. Widely used to triage action.' },
            { front: 'Lethal means', back: 'The methods a person has access to that could be used to end their life. Access to highly lethal means, especially firearms, is among the most modifiable risk factors and a key target of intervention.' },
            { front: 'Risk stratification', back: 'The synthesis of assessment data into a categorical judgment—commonly low, moderate, high, or imminent—that drives the intensity and type of clinical intervention. Risk is dynamic and must be reassessed continually.' },
            { front: 'Hopelessness', back: 'The belief that the future holds only continued suffering. Beck’s research identified hopelessness as a stronger predictor of eventual suicide than depression severity itself.' },
            { front: 'Acquired capability', back: 'From Joiner’s Interpersonal Theory of Suicide: a habituation to physical pain and a reduced fear of death, often developed through prior self-injury, trauma, or exposure to violence, which makes lethal self-harm possible.' },
            { front: 'Warning signs', back: 'Acute indicators of escalating, near-term danger (e.g., acquiring means, giving away possessions, saying goodbye, sudden calm after agitation), as distinguished from chronic risk factors.' },
            { front: 'Risk formulation', back: 'A narrative synthesis of risk and protective factors and the clinician’s reasoning that produces a stratified risk judgment. The standard of care emphasizes reasonable formulation over accurate prediction.' }
          ]
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are recognized PROTECTIVE factors against suicide? (Select all that apply.)',
          options: [
            { text: 'Strong social connections and family support', isCorrect: true },
            { text: 'Responsibility to children or pets', isCorrect: true },
            { text: 'Access to a firearm in the home', isCorrect: false },
            { text: 'Effective and engaged clinical care', isCorrect: true },
            { text: 'Problem-solving and coping skills', isCorrect: true },
            { text: 'Recent exposure to another person’s suicide', isCorrect: false }
          ],
          explanation: 'Protective factors buffer against suicide risk and include strong social connections, responsibility to others (children, pets), effective clinical care, coping and problem-solving skills, reasons for living, and restricted access to lethal means. Access to a firearm and recent exposure to another’s suicide are risk factors, not protective factors. Cultivating and activating protective factors is a core therapeutic strategy, though they never fully cancel out risk.'
        },
        {
          type: 'reflection',
          question: 'Think about the last time you conducted a suicide risk assessment. What frameworks or tools did you use, and what might you do differently after completing this section?'
        },
        {
          type: 'keyTakeaway',
          title: 'Section 1 Key Takeaways',
          takeaways: [
            'Suicide claims more than 49,000 lives annually in the U.S.; men die more often, women attempt more often, and method lethality is central to understanding the "gender paradox."',
            'Risk factors cluster into psychological, biological/psychiatric, and social/environmental categories; a prior attempt is the single strongest predictor of death by suicide.',
            'Protective factors buffer but do not cancel out risk; cultivating connection, reasons for living, and means restriction are core therapeutic strategies.',
            'Ideation, intent, plan, means, and attempt are distinct concepts; the frequency of ideation does not reliably indicate danger, but the presence of intent and plan does.',
            'The C-SSRS provides a validated, plain-language, severity-graded framework that triages action; "yes" to levels 4 or 5 signals high acuity.',
            'Frameworks such as SAD PERSONS and the Beck scales organize thinking but never replace clinical judgment; hopelessness is an especially powerful predictor.',
            'Risk stratification (low, moderate, high, imminent) drives clinical action, but risk is dynamic and must be continually reassessed.',
            'Documentation must capture data, clinical reasoning, a narrative risk formulation, and the intervention plan; the standard of care is reasonable formulation, not accurate prediction.'
          ]
        }
      ]
    },

    // ============================================================
    // SECTION 2 — STANLEY-BROWN SAFETY PLANNING INTERVENTION
    // ============================================================
    {
      title: 'The Stanley-Brown Safety Planning Intervention: A Step-by-Step Guide',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'The Stanley-Brown Safety Planning Intervention',
          subtitle: 'A Step-by-Step Guide'
        },
        {
          type: 'text',
          content: `<h2>From No-Harm Contracts to Safety Planning</h2>
<p>For decades, well-meaning clinicians relied on the &ldquo;no-suicide contract&rdquo; or &ldquo;no-harm contract&rdquo;&mdash;a verbal or written agreement in which the client promises not to harm themselves. It feels reassuring to obtain such a promise, but the evidence is unambiguous: no-harm contracts do not prevent suicide. They have no demonstrated efficacy, can create a false sense of security for the clinician, may discourage honest disclosure (a client reluctant to &ldquo;break&rdquo; their promise may simply stop talking), and offer no protection&mdash;clinical or legal&mdash;if a tragedy occurs. Worse, they place the burden entirely on the client to resist a crisis, providing no tools, no plan, and no support. There is also an ethical problem at the heart of the no-harm contract: it subtly reframes the clinical relationship as a transaction in which the client is responsible for the clinician&rsquo;s reassurance, rather than the clinician being responsible for the client&rsquo;s care. A client who is ambivalent about living may sign such a contract out of compliance or a wish to please, masking rather than reducing risk. For all these reasons, professional consensus has moved firmly away from no-harm contracts and toward collaborative safety planning, which replaces a hollow promise with a concrete, usable plan.</p>
<p>The <strong>Stanley-Brown Safety Planning Intervention (SPI)</strong>, developed by Barbara Stanley and Gregory Brown, represents a fundamental shift. Rather than extracting a promise, the SPI builds capability. It is a brief (typically 20&ndash;45 minute) collaborative intervention that produces a prioritized, written list of coping strategies and support resources a person can use during a suicidal crisis. It is concrete, personalized, and action-oriented&mdash;a tool the client takes with them and uses when thoughts of suicide arise.</p>
<p>The evidence base is robust and growing. A landmark study by Stanley, Brown, and colleagues found that emergency department patients who received the Safety Planning Intervention combined with structured follow-up contact were approximately half as likely to engage in suicidal behavior over the following six months compared to those receiving usual care, and they were more than twice as likely to engage in outpatient treatment. The SPI has since been adopted across the Veterans Health Administration, emergency departments, crisis lines, schools, and outpatient practices, and it is a cornerstone of the Zero Suicide framework. It is recognized as a best practice by the Suicide Prevention Resource Center and the National Action Alliance for Suicide Prevention.</p>
<h3>Why Safety Plans Work: The Underlying Mechanisms</h3>
<p>It is worth pausing to understand <em>why</em> a brief, written plan can have such an outsized effect. Several mechanisms operate simultaneously. First, the safety plan counteracts the cognitive constriction of the suicidal state. In acute crisis, the suicidal mind narrows&mdash;problem-solving collapses, options vanish from view, and suicide can come to seem like the only solution. A pre-written plan externalizes coping strategies and reasons for living so that the person does not have to generate them from within a constricted, exhausted, despairing state of mind. The plan does the remembering that the crisis would otherwise erase.</p>
<p>Second, the SPI builds and reinforces <strong>self-efficacy</strong>. By beginning with strategies the client can deploy independently, it communicates and proves that the client has the power to influence their own crisis. Each successful use of a coping strategy is a small but potent experience of agency, gradually rebuilding the sense of control that hopelessness erodes. Third, the plan&rsquo;s stepped structure provides a concrete behavioral roadmap precisely when decision-making capacity is most impaired&mdash;there is no need to figure out what to do; one simply moves down the list. Fourth, by explicitly mobilizing social connection and professional resources, the plan attacks the isolation and thwarted belongingness that fuel suicidal desire. And finally, the collaborative process of building the plan itself strengthens the therapeutic alliance, which is among the most reliably protective elements in all of clinical care. Understanding these mechanisms helps the clinician implement the SPI thoughtfully rather than mechanically, attending to the purpose behind each step.</p>
<h3>The Logic of the Six Steps</h3>
<p>The SPI is built on a stepped logic that mirrors how a suicidal crisis unfolds and escalates. The plan begins with strategies the client can use entirely on their own and progresses toward strategies requiring more external support, culminating in professional and emergency resources, and finally the critical step of making the environment safer by reducing access to lethal means. The ordering is deliberate: a person in crisis should be able to start at the top of the plan and move down only as needed, escalating support in proportion to the intensity of the crisis. The six steps are: (1) recognizing warning signs, (2) internal coping strategies, (3) social contacts and settings that provide distraction, (4) people the client can ask for help, (5) professionals and agencies to contact during a crisis, and (6) making the environment safe. Each step is developed collaboratively, in the client&rsquo;s own words, with the clinician&rsquo;s role being to draw out and refine the client&rsquo;s own ideas rather than to prescribe generic strategies.</p>
<h3>Why Collaboration Is Not Optional</h3>
<p>The single most common way that safety planning fails is when the clinician fills out the form <em>for</em> the client rather than <em>with</em> the client. A safety plan composed of the clinician&rsquo;s generic suggestions&mdash;&ldquo;take deep breaths,&rdquo; &ldquo;think positive,&rdquo; &ldquo;call a hotline&rdquo;&mdash;is a worksheet, not an intervention. It will sit forgotten in a drawer because it does not reflect the client&rsquo;s life, language, relationships, or coping repertoire. The therapeutic power of the SPI comes precisely from its collaborative construction: the act of generating one&rsquo;s own warning signs, recalling one&rsquo;s own effective coping strategies, and naming one&rsquo;s own trusted people is itself a rehearsal of survival. When the client later faces a crisis and reads the plan, they are reading their own voice reminding them how to stay alive.</p>
<p>This is why the clinician&rsquo;s posture throughout safety planning is that of a curious collaborator and skilled facilitator. The clinician asks open questions, listens, reflects, and gently troubleshoots&mdash;but does not dictate. When a client struggles to generate ideas, the clinician offers menus of possibilities (&ldquo;Some people find exercise helps, others music, others a hot shower&mdash;does anything like that fit for you?&rdquo;) rather than imposing answers. The finished plan should be unmistakably the client&rsquo;s own, ideally written in their handwriting or saved on their phone, ready to be pulled out in the moment it is needed.</p>
<h3>Format, Accessibility, and Review</h3>
<p>A safety plan is only useful if it is accessible at the moment of crisis. For this reason, clinicians increasingly help clients store the plan where they will actually have it: as a photo on their phone, in a dedicated app such as the official Stanley-Brown Safety Plan app, on a wallet card, or posted somewhere private but visible at home. The plan should be reviewed and revised at subsequent sessions&mdash;not treated as a one-time event. Each review is an opportunity to ask whether the client used the plan, what helped, what fell flat, and what needs updating as circumstances and supports change. A safety plan created in March and never revisited is a stale document; a safety plan that evolves with the client is a living instrument of care.</p>`
        },
        {
          type: 'callout',
          calloutType: 'protocol',
          title: 'The 6 Steps of the Stanley-Brown Safety Planning Intervention',
          content: `<p><strong>Step 1 &mdash; Warning Signs.</strong> Identify the personal thoughts, images, moods, situations, and behaviors that signal a crisis may be developing, so the client knows when to use the plan.</p>
<p><strong>Step 2 &mdash; Internal Coping Strategies.</strong> List things the client can do on their own to take their mind off problems without contacting another person (e.g., going for a walk, listening to music, exercising, breathing exercises). These build a sense of self-efficacy.</p>
<p><strong>Step 3 &mdash; Social Contacts and Settings for Distraction.</strong> Identify people and social settings that provide distraction and a sense of connection&mdash;without necessarily disclosing the crisis (e.g., calling a friend to chat, going to a coffee shop, attending a community group).</p>
<p><strong>Step 4 &mdash; People to Ask for Help.</strong> List trusted family members or friends the client can contact and explicitly tell that they are in crisis and need support.</p>
<p><strong>Step 5 &mdash; Professionals and Agencies to Contact During a Crisis.</strong> Include the names and numbers of clinicians, urgent care, the 988 Suicide and Crisis Lifeline, and local emergency services.</p>
<p><strong>Step 6 &mdash; Making the Environment Safe.</strong> Collaboratively reduce access to lethal means&mdash;securing or removing firearms, limiting access to medications, and removing other identified methods. This step is where safety planning and lethal means counseling intersect.</p>`
        },
        {
          type: 'text',
          content: `<h2>Steps 1 Through 3 in Depth</h2>
<p><strong>Step 1: Recognizing Warning Signs.</strong> The safety plan is only useful if the client knows when to reach for it. Begin by helping the client identify the personal warning signs that a crisis is building. These are idiosyncratic: for one client it may be a racing, self-critical internal monologue; for another, isolating in their bedroom and not answering the phone; for a third, a specific situation such as a conflict with a partner or the arrival of evening. Use the client&rsquo;s own language. Ask, &ldquo;How will you know when the safety plan should be used? What do you notice in your thoughts, your body, your mood, or your behavior right before things get bad?&rdquo; Capturing these early signals allows the client to intervene before the crisis peaks, when coping is still possible.</p>
<p><strong>Step 2: Internal Coping Strategies.</strong> The genius of placing internal coping first is that it cultivates self-efficacy and provides immediate, accessible tools that require no one else. Ask, &ldquo;What can you do, on your own, to help yourself not act on the thoughts and to take your mind off your problems, even for a little while?&rdquo; Strategies might include going for a run, taking a hot shower, listening to a specific playlist, watching a comforting show, journaling, doing a paced-breathing exercise, playing with a pet, or doing a brief mindfulness practice. After the client generates a strategy, probe for obstacles: &ldquo;Is there anything that might get in the way of doing that? How could we make it more likely you&rsquo;d be able to?&rdquo; This collaborative troubleshooting&mdash;often called problem-solving the barriers&mdash;transforms a wish-list into a workable plan.</p>
<p><strong>Step 3: Social Contacts and Settings for Distraction.</strong> If internal strategies are not enough, the next layer engages other people&mdash;but in a low-stakes, distraction-oriented way. The key distinction between Step 3 and Step 4 is disclosure. In Step 3, the client connects with others or goes to a social setting <em>without</em> necessarily revealing the crisis: texting a friend about a shared hobby, going to a gym or library or place of worship, sitting in a busy coffee shop. The therapeutic mechanism is twofold&mdash;distraction interrupts the rumination that fuels suicidal thinking, and connection counteracts the isolation and thwarted belongingness that drive risk. Help the client name specific, realistic people and places, and again troubleshoot barriers (&ldquo;What if that friend doesn&rsquo;t answer? Who else, or where else?&rdquo;).</p>
<h3>A Worked Example of Steps 1 Through 3</h3>
<p>Consider how these three steps come alive with a real client. Imagine a 28-year-old woman, Renee, who has struggled with depression and recently experienced a painful breakup. For Step 1, rather than accepting a vague &ldquo;when I feel down,&rdquo; the clinician helps Renee reconstruct her last bad night in detail. Together they identify her warning signs: &ldquo;When I start scrolling through old photos of us, when I think &lsquo;I&rsquo;ll always be alone,&rsquo; when I can&rsquo;t fall asleep and it&rsquo;s past 2 a.m., and when I pour a second glass of wine.&rdquo; These concrete, self-recognizable cues become her early-warning system.</p>
<p>For Step 2, the clinician asks what has actually helped Renee ride out hard moments before. She mentions a long walk with her dog and a particular comedy podcast. The clinician troubleshoots: the walk is harder at night, so they agree that on bad nights she will instead do a guided breathing exercise on her phone and play the podcast in bed with the lights off. They make it specific&mdash;named podcast, named app&mdash;so there is no decision-making burden in the moment of distress. For Step 3, Renee names her coworker Mia, with whom she can text about their shared love of baking without disclosing the crisis, and a 24-hour diner where she sometimes goes to be around people. The clinician asks about backups: if Mia doesn&rsquo;t respond, Renee will go to the diner or call her cousin. In twenty minutes, Renee has moved from abstract distress to a concrete, personalized, escalating set of tools&mdash;each one hers.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Step 1: Recognizing Warning Signs',
              content: `<p>This step answers the question, <em>&ldquo;When should I use this plan?&rdquo;</em> Warning signs are the personal thoughts, images, thinking styles, moods, behaviors, and situations that precede a suicidal crisis for this particular client. Because they are idiosyncratic, they must be elicited in the client&rsquo;s own words rather than drawn from a generic list. Useful prompts include: &ldquo;Think back to the last time you felt this way&mdash;what was happening just before? What did you notice in your body? What thoughts ran through your mind?&rdquo; Common categories include cognitive signs (hopeless or self-critical thoughts, ruminating about death), emotional signs (overwhelming sadness, rage, numbness, agitation), physical signs (insomnia, fatigue, restlessness), behavioral signs (withdrawing, increased substance use, recklessness), and situational triggers (anniversaries, conflicts, financial news). Identifying warning signs early gives the client a chance to act while coping is still feasible.</p>`
            },
            {
              title: 'Step 2: Internal Coping Strategies',
              content: `<p>Internal coping strategies are activities the client can do entirely on their own to distract from suicidal thoughts and tolerate distress. They are placed second&mdash;immediately after warning signs&mdash;because they foster self-efficacy and are always available. The clinician&rsquo;s role is to elicit the client&rsquo;s own ideas (&ldquo;What has helped you ride out a hard moment before?&rdquo;) and then to <strong>problem-solve barriers</strong>: if the client says &ldquo;going for a walk,&rdquo; the clinician asks what might prevent it and how to make it more likely. Effective strategies are concrete, specific, and matched to the client&rsquo;s life&mdash;not &ldquo;relax&rdquo; but &ldquo;take a hot shower and listen to my workout playlist.&rdquo; Examples include exercise, music, paced breathing, grounding techniques, journaling, cold-water face immersion, and engaging with pets. The aim is to interrupt the crisis cascade before it escalates. A particularly useful family of strategies borrows from dialectical behavior therapy&rsquo;s distress-tolerance skills: intense sensory input that shifts physiology, such as holding ice, splashing cold water on the face, or vigorous exercise, can rapidly down-regulate an overwhelming emotional state. The clinician should help the client assemble a small, concrete menu of two or three reliable strategies rather than an unwieldy list, because in the depths of a crisis, simplicity and specificity are what make a plan usable.</p>`
            },
            {
              title: 'Step 3: Social Contacts and Settings for Distraction',
              content: `<p>This step engages others, but for <strong>distraction and connection rather than disclosure</strong>. The client identifies specific people they can spend time with, or social settings they can go to, that take their mind off the crisis&mdash;without having to talk about suicidal thoughts. Examples include calling a friend to chat about an unrelated topic, going to a coffee shop or library, attending a place of worship, or visiting a relative. The therapeutic logic is that distraction interrupts rumination and that simply being among other people reduces the isolation and sense of disconnection that fuel suicidal thinking. The clinician helps the client name realistic options and plans for contingencies (&ldquo;If that person isn&rsquo;t available, who or where is your backup?&rdquo;).</p>`
            },
            {
              title: 'Step 4: People to Ask for Help',
              content: `<p>When internal strategies and distraction are insufficient, the client turns to trusted people and explicitly asks for help, disclosing that they are in crisis. This step requires identifying individuals who are <strong>supportive, available, and capable</strong> of responding helpfully&mdash;and screening out those who are unsafe, unreliable, or themselves part of the crisis (for example, a partner with whom conflict is the trigger). The clinician helps the client anticipate what they will say (&ldquo;How would you let them know you&rsquo;re struggling?&rdquo;) and, when appropriate and with consent, may involve these supports directly so they understand their role. Naming people the client can lean on directly counters perceived burdensomeness and thwarted belongingness. It is often helpful to coach the client on a brief, concrete script for reaching out, since shame and the fear of being a burden frequently paralyze people at exactly the moment they most need connection. A simple, rehearsed sentence&mdash;&ldquo;I&rsquo;m really struggling tonight and I don&rsquo;t want to be alone right now&rdquo;&mdash;lowers the threshold to action. When safe and consented to, involving these supports directly in a portion of a session allows them to understand the warning signs, learn how to respond calmly and supportively, and, where relevant, take on a role in securing lethal means&mdash;turning a name on a list into an active partner in the client&rsquo;s safety. A practical refinement is to confirm that the people listed are genuinely reachable: the clinician verifies phone numbers, asks about typical availability, and identifies backups so that one unanswered call does not collapse the plan. Where a client has few safe supports, the clinician treats the impoverished network as itself a target of intervention, helping to build connection over time through group treatment, peer support, or community involvement.</p>`
            },
            {
              title: 'Steps 5 & 6: Professional Resources and Making the Environment Safe',
              content: `<p><strong>Step 5 (Professionals and Agencies)</strong> ensures the client has immediate access to professional help. The plan should list the clinician&rsquo;s contact information and after-hours procedures, local urgent care and emergency departments, and crisis resources&mdash;most importantly the <strong>988 Suicide and Crisis Lifeline</strong> (call or text 988) and the Crisis Text Line (text HOME to 741741). Make these entries specific and verify the numbers with the client.</p>
<p><strong>Step 6 (Making the Environment Safe)</strong> is arguably the most powerful step and the intersection of safety planning with lethal means counseling. The clinician and client collaboratively identify the methods the client has access to&mdash;especially firearms and medications&mdash;and develop a concrete plan to limit or remove access during the period of elevated risk. This might mean a family member temporarily storing a firearm, using a gun lock or off-site storage, dispensing medications in limited quantities, or removing a stockpile. Because access to lethal means is a leading modifiable risk factor, this step can be lifesaving. Approached collaboratively and framed as temporary, this step rarely alienates clients; on the contrary, many feel cared for by a clinician willing to help them put concrete distance between themselves and danger. The clinician should be specific and follow through&mdash;agreeing on exactly who will store a firearm or hold the medications, by when, and confirming at the next contact that it was done&mdash;because the gap between a good intention and a completed safety action is precisely where preventable tragedies occur. Step 5 should likewise be made concrete and verified: the plan lists the clinician&rsquo;s number and after-hours procedure, the 988 Suicide and Crisis Lifeline (call or text 988), the Crisis Text Line (text HOME to 741741), and the nearest emergency department, with the client encouraged to save these contacts in their phone during the session so they are instantly available when needed.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Recognizing Warning Signs',
          content: `<p>The safety plan begins with warning signs because timing is everything in a suicidal crisis. Suicidal states are frequently acute and time-limited, peaking and then subsiding over minutes to hours. A client who can recognize the earliest signals&mdash;a particular thought, a sinking mood, a specific situation&mdash;has the opportunity to deploy coping strategies before the crisis overwhelms their capacity to act.</p>
<p>Effective warning-sign work is deeply personal. Generic lists (&ldquo;feeling sad,&rdquo; &ldquo;stress&rdquo;) are too vague to be useful. Instead, the clinician helps the client reconstruct the lead-up to a recent crisis in granular detail: &ldquo;Walk me through the hour before you felt at your worst last week. What were you doing? What were you thinking? What did you feel in your body?&rdquo; The resulting list might read: &ldquo;When I start thinking &lsquo;everyone would be better off without me,&rsquo; when I can&rsquo;t sleep and I&rsquo;m lying awake at 3 a.m., when I stop answering my sister&rsquo;s texts.&rdquo; These specific, self-recognizable cues become the trigger for the rest of the plan.</p>
<p>There is also a quiet therapeutic benefit in the warning-signs work itself. By mapping the anatomy of their crises, clients gain insight and a sense of mastery over experiences that previously felt sudden, random, and overwhelming. What once seemed like an ambush&mdash;&ldquo;it just hit me out of nowhere&rdquo;&mdash;becomes legible as a sequence with recognizable early stages, and therefore as something that can be interrupted. This shift from helpless passenger to informed observer of one&rsquo;s own internal weather is, in miniature, the larger goal of all the work: restoring agency to a person who has come to feel they have none.</p>`,
          image: '',
          imageAlt: 'Illustration of a person recognizing early personal warning signs of a crisis',
          imagePosition: 'right'
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each step of the Stanley-Brown Safety Planning Intervention to its correct description.',
          matchingPairs: [
            { term: 'Step 1: Warning Signs', definition: 'Identifying the personal thoughts, moods, situations, and behaviors that signal a crisis is developing, so the client knows when to use the plan.' },
            { term: 'Step 2: Internal Coping Strategies', definition: 'Activities the client can do alone to distract from suicidal thoughts and build self-efficacy, without contacting another person.' },
            { term: 'Step 3: Social Contacts for Distraction', definition: 'People and settings that provide distraction and connection without requiring the client to disclose the crisis.' },
            { term: 'Step 4: People to Ask for Help', definition: 'Trusted, available individuals the client can contact to explicitly disclose the crisis and request support.' },
            { term: 'Step 5: Professionals and Agencies', definition: 'Clinicians, urgent care, the 988 Lifeline, and emergency services to contact during a crisis.' },
            { term: 'Step 6: Making the Environment Safe', definition: 'Collaboratively reducing access to lethal means, such as securing firearms and limiting medications.' }
          ]
        },
        {
          type: 'text',
          content: `<h2>Reasons for Living and Activating Support</h2>
<p>While the six steps form the backbone of the SPI, two related elements deepen its therapeutic power: the reasons-for-living list and the activation of the social support network.</p>
<p><strong>Building the reasons-for-living list.</strong> Although not always numbered among the six steps, identifying reasons for living is a valuable complement to safety planning and is sometimes incorporated directly into the plan. Reasons for living function as a powerful protective factor and a deterrent in the moment of crisis. Ask the client, gently and without pressure, &ldquo;What are the things&mdash;even small things&mdash;that have kept you going, or that you would miss, or that matter to you?&rdquo; Answers might include children, pets, a future goal, a person who depends on them, faith, or even an experience they want to have. The list should be specific and emotionally resonant; some clients carry it as a written card or a set of photos on their phone. In the moment of crisis, when the suicidal mind narrows and forgets all that is good, a concrete reminder of reasons for living can create the pause that allows the crisis to pass.</p>
<p>The clinician should approach this work with great care and never with pressure or argument. Confronting a hopeless client with a list of reasons they &ldquo;should&rdquo; want to live can backfire, deepening shame and the sense that no one understands the depth of their pain. Instead, the reasons-for-living list emerges gently from curiosity: &ldquo;Even in the middle of all this, is there anything&mdash;a person, a responsibility, a hope, even a small one&mdash;that has kept you here so far?&rdquo; The very fact that the client is alive and in the room is itself evidence that some reason to live, however faint, persists. Drawing it out, naming it, and making it tangible strengthens the part of the client that wants to survive&mdash;the part the clinician is always, ultimately, allied with.</p>
<p><strong>Activating the social support network.</strong> Steps 3 and 4 name supports, but the SPI is most effective when those supports are genuinely activated&mdash;when the people on the plan know their role and are ready to respond. With the client&rsquo;s consent, consider involving a trusted family member or friend in part of the session so they understand the warning signs, know how to respond supportively, and are prepared to assist with means restriction. Research on the SPI emphasizes the synergy of safety planning with <strong>structured follow-up contact</strong>: brief check-ins by phone or message in the days and weeks after a crisis, which convey care, reduce isolation, and prompt re-engagement with treatment. A safety plan is not a static document handed over and forgotten; it is a living tool, reviewed and revised across sessions, and embedded in a network of human connection. The combination of a well-constructed plan, an activated support system, and reliable follow-up is what transforms the SPI from a worksheet into an intervention that saves lives.</p>
<h3>Choosing the Right Supports&mdash;and Screening Out the Wrong Ones</h3>
<p>Not everyone in a client&rsquo;s life belongs on the safety plan. A critical and often-overlooked skill in Steps 3 and 4 is helping the client identify supports who are genuinely safe, available, and capable&mdash;and screening out those who are not. A support person who is themselves the source of the crisis (an abusive partner, a conflictual parent), who is unreliable or frequently unavailable, who minimizes the client&rsquo;s pain, or who would respond with anger or panic can do more harm than good. The clinician should ask gently about each named person: &ldquo;How does this person usually respond when you&rsquo;re struggling? Are they someone who can be calm and supportive? Are they reliably reachable?&rdquo; Sometimes the most important support is not a family member at all but a friend, a sponsor, a faith leader, or a peer.</p>
<p>For Step 4 in particular, the clinician helps the client rehearse what they will actually say. Many people in crisis freeze when it comes to asking for help directly, paralyzed by shame or the fear of burdening others. Practicing a simple script&mdash;&ldquo;I&rsquo;m having a really hard time right now and I need to not be alone&rdquo;&mdash;lowers the barrier. When appropriate and with consent, the clinician can even invite the support person into a portion of the session to clarify their role, so that when the call comes, the support person knows it is part of a plan and responds with steadiness rather than alarm.</p>
<h3>The Evidence for Follow-Up Contact</h3>
<p>The research underscores that what happens <em>after</em> the safety plan is built may matter as much as the plan itself. In the landmark emergency-department study of the Safety Planning Intervention, the protocol that produced roughly a halving of suicidal behavior coupled safety planning with structured telephone follow-up&mdash;brief check-in calls in the days and weeks after the visit. These contacts, sometimes called &ldquo;caring contacts,&rdquo; draw on a long research tradition showing that simple expressions of ongoing concern&mdash;a phone call, a postcard, a text&mdash;reduce suicidal behavior in high-risk individuals. The mechanism is thought to be the counteracting of isolation and the communication of genuine care: the client learns, viscerally, that someone is paying attention and wants them to be okay. For the practicing clinician, this means that a safety plan should always be paired with a concrete follow-up plan&mdash;a scheduled call, a next appointment soon rather than weeks away, and an explicit invitation to reach out before the next session if needed.</p>`
        },
        {
          type: 'scenarioTree',
          scenarioTitle: 'Clinical Scenario: Safety Planning with Marcus',
          instructions: 'Marcus is a 34-year-old Army veteran who served two deployments and now works in logistics. In session, he discloses passive suicidal ideation. Navigate the encounter by choosing how to respond at each step. Some paths reflect best practice; others illustrate common pitfalls. Work through the scenario and reflect on the choices.',
          nodes: [
            {
              id: 'start',
              text: 'Marcus says quietly, "Lately I’ve been thinking the world would be better off without me. I wouldn’t actually do anything… but the thought keeps coming back." He looks down and goes silent. How do you respond?',
              choices: [
                { text: 'Reassure him: "I’m sure that’s not true—you have so much to live for. Let’s talk about something more positive."', nextId: 'reassure' },
                { text: 'Stay calm, validate, and ask directly: "Thank you for trusting me with that. I want to understand it better. When you have that thought, do you ever think about acting on it?"', nextId: 'direct' }
              ],
              isEnd: false
            },
            {
              id: 'reassure',
              text: 'Marcus nods politely but shuts down. He changes the subject and gives short answers for the rest of the session. You have unintentionally signaled that his disclosure was unwelcome, and you have missed the chance to assess risk. Reflecting on this, what is the more therapeutic path?',
              choices: [
                { text: 'Return to the disclosure: "Marcus, before we move on, I want to go back to what you shared. It took courage. Can we talk more about those thoughts?"', nextId: 'direct' }
              ],
              isEnd: false
            },
            {
              id: 'direct',
              text: 'Marcus exhales, relieved to be asked. "No—I don’t want to act on it. It’s more like… I’m so tired. I wish I could just disappear. But I’d never leave my daughter." You now know the ideation is passive and that he has a strong protective factor. What do you assess next?',
              choices: [
                { text: 'Conclude he’s low risk since it’s passive and stop assessing. Move to scheduling the next appointment.', nextId: 'premature' },
                { text: 'Continue assessing the full picture: frequency and duration of thoughts, any plan or method, access to means (including firearms, given his service), prior attempts, and current stressors.', nextId: 'assess_means' }
              ],
              isEnd: false
            },
            {
              id: 'premature',
              text: 'By stopping early, you never learn that Marcus keeps a handgun in his nightstand and that his divorce was finalized last week. Passive ideation can escalate, and you have no safety plan and no means-restriction conversation. This is a critical gap. What should you do?',
              choices: [
                { text: 'Reopen the assessment: explore method, access to means, recent stressors, and prior history before deciding on a plan.', nextId: 'assess_means' }
              ],
              isEnd: false
            },
            {
              id: 'assess_means',
              text: 'You gently continue. Marcus reveals: the thoughts come a few times a week, usually at night; he has no specific plan; he has never attempted; but he does keep a loaded handgun in his nightstand "out of habit from the service." His divorce was just finalized and he sees his daughter only on weekends. How do you proceed?',
              choices: [
                { text: 'Note the firearm but avoid raising it directly—he might feel judged or defensive about his weapon.', nextId: 'avoid_means' },
                { text: 'Acknowledge the elevated risk, propose collaboratively building a safety plan, and prepare to discuss the firearm as part of making his environment safer.', nextId: 'build_plan' }
              ],
              isEnd: false
            },
            {
              id: 'avoid_means',
              text: 'Avoiding the firearm conversation leaves the single most modifiable, lethal risk factor untouched. Means restriction is a core, evidence-based intervention—and respectful, collaborative conversations about firearm storage do not alienate most clients, including veterans. How do you correct course?',
              choices: [
                { text: 'Raise the firearm respectfully and collaboratively as part of safety planning, framing it as a temporary, voluntary step to put time and distance between him and the thoughts.', nextId: 'build_plan' }
              ],
              isEnd: false
            },
            {
              id: 'build_plan',
              text: 'You say, "Marcus, what you’re carrying is heavy, and I’m really glad you told me. I’d like us to build a plan together—something you can use when those night-time thoughts hit." He agrees. You begin with warning signs and internal coping. When you reach the firearm, how do you frame it?',
              choices: [
                { text: '"You need to get rid of your gun." (A directive ultimatum.)', nextId: 'ultimatum' },
                { text: '"Would you be open to making it harder to reach that handgun during these tough weeks—maybe a trusted buddy holds it, or we use a lockbox and store the ammo separately? It just puts time between you and a hard moment."', nextId: 'collaborate' }
              ],
              isEnd: false
            },
            {
              id: 'ultimatum',
              text: 'Marcus stiffens. "That’s my right. You don’t get it." The ultimatum triggered defensiveness and threatened the alliance. Means restriction works best when it is collaborative, temporary, and respectful of the client’s autonomy and values. How do you repair it?',
              choices: [
                { text: 'Step back, validate his autonomy, and offer collaborative options: temporary off-site storage with a fellow veteran, a lockbox with separated ammunition, or a gun lock—his choice, for now.', nextId: 'collaborate' }
              ],
              isEnd: false
            },
            {
              id: 'collaborate',
              text: 'Marcus thinks, then says, "My old squad leader, Dale—he lives close. He could hold it for a while. He’d get it." You affirm the choice, add Dale and the 988 Lifeline to the plan, identify reasons for living (his daughter, a fishing trip he’s planning), and arrange a follow-up call in two days. Marcus leaves with a written plan and a concrete means-restriction step. What did this path demonstrate?',
              choices: [
                { text: 'Direct assessment, full risk exploration, collaborative safety planning, respectful means restriction, activation of support, and structured follow-up—the evidence-based standard of care.', nextId: 'success' }
              ],
              isEnd: false
            },
            {
              id: 'success',
              text: 'You navigated the encounter with Marcus using best practices: you asked directly and stayed calm, you assessed the full continuum of risk including access to lethal means, you built the safety plan collaboratively and in his own words, you approached firearm storage respectfully and temporarily, you activated a trusted support, and you arranged follow-up contact. This is precisely the integrated approach that research shows reduces suicidal behavior and increases treatment engagement.',
              choices: [],
              isEnd: true
            }
          ]
        },
        {
          type: 'fillInBlank',
          title: 'Safety Planning Essentials',
          blanks: [
            { prompt: 'Step 1 of the Stanley-Brown SPI asks the client to identify their personal ____________ that signal a crisis is developing.', answer: 'warning signs', acceptAlternates: ['warning sign', 'warningsigns'] },
            { prompt: 'Step 2 focuses on ____________ coping strategies the client can use alone, without contacting another person.', answer: 'internal', acceptAlternates: ['internal coping', 'self'] },
            { prompt: 'The key difference between Step 3 and Step 4 is that Step 3 provides distraction without ____________ of the crisis, whereas Step 4 involves explicitly asking for help.', answer: 'disclosure', acceptAlternates: ['disclosing', 'telling'] },
            { prompt: 'The national three-digit number for the Suicide and Crisis Lifeline, listed in Step 5, is ____________.', answer: '988', acceptAlternates: ['9-8-8', 'nine eight eight'] },
            { prompt: 'Step 6, "making the environment safe," is the point at which safety planning intersects with ____________ counseling.', answer: 'lethal means', acceptAlternates: ['lethal-means', 'means restriction', 'means'] }
          ]
        },
        {
          type: 'reflection',
          question: 'How comfortable are you initiating conversations about safety planning with clients who express suicidal ideation? What personal or professional barriers might you need to address?'
        },
        {
          type: 'keyTakeaway',
          title: 'Section 2 Key Takeaways',
          takeaways: [
            'No-harm contracts have no demonstrated efficacy, may discourage disclosure, and offer no clinical or legal protection; the field has moved decisively toward collaborative safety planning.',
            'The Stanley-Brown Safety Planning Intervention is a brief, evidence-based protocol shown to roughly halve suicidal behavior and double treatment engagement when paired with follow-up contact.',
            'The six steps progress from self-reliant strategies toward greater external support: warning signs, internal coping, social distraction, asking for help, professional resources, and making the environment safe.',
            'Step 1 (warning signs) must be elicited in the client’s own words and in granular detail so the client knows exactly when to use the plan.',
            'The distinction between Step 3 and Step 4 is disclosure: Step 3 uses people and settings for distraction without revealing the crisis; Step 4 involves explicitly asking for help.',
            'Step 6 (making the environment safe) reduces access to lethal means and is the most powerful step—where safety planning and lethal means counseling intersect.',
            'Reasons for living function as a protective deterrent in the moment of crisis and should be specific, emotionally resonant, and easily accessible.',
            'A safety plan is a living tool best embedded in an activated support network and structured follow-up contact—not a static worksheet handed over and forgotten.'
          ]
        }
      ]
    },

    // ============================================================
    // SECTION 3 — LETHAL MEANS, SPECIAL POPULATIONS, SELF-CARE
    // ============================================================
    {
      title: 'Lethal Means Counseling, Special Populations, and Clinical Self-Care',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Lethal Means Counseling, Special Populations, and Clinical Self-Care',
          subtitle: 'Putting Prevention into Practice'
        },
        {
          type: 'text',
          content: `<h2>Lethal Means Counseling: The Most Powerful Modifiable Intervention</h2>
<p>Of all the interventions available to a clinician, reducing access to lethal means is among the most evidence-based and life-saving&mdash;yet it remains one of the most underused. <strong>Lethal means counseling</strong> (LMC) is the practice of helping at-risk individuals and their families reduce access to the methods most likely to result in death during a suicidal crisis. It rests on two robust empirical findings.</p>
<p>First, <strong>suicidal crises are often brief.</strong> Research on survivors of near-lethal attempts has repeatedly found that the interval between the decision to act and the attempt itself is frequently very short&mdash;in many cases less than an hour, and in a substantial proportion, less than five minutes. The suicidal state is acute and ambivalent; if a person can be prevented from acting during that narrow window, the crisis often passes. This is the &ldquo;time-to-act&rdquo; research, and it is the scientific heart of means restriction.</p>
<p>Second, <strong>method matters enormously.</strong> Methods differ vastly in lethality. Firearms are lethal in roughly 85&ndash;90 percent of attempts; most other methods, including overdose&mdash;the most common method in attempts&mdash;are far less likely to be fatal. Critically, the large majority of people who survive a suicide attempt do <em>not</em> go on to die by suicide; most do not even make another attempt. This means that &ldquo;buying time&rdquo; and reducing the lethality of an available method are not merely delaying tactics&mdash;they save lives outright, because survival of one crisis is often survival, period.</p>
<p>These two findings combine into a simple but profound clinical logic. If crises are brief, and if method matters enormously, then anything that increases the time and effort required to access a lethal method during a crisis&mdash;and reduces the lethality of whatever remains accessible&mdash;buys the person the minutes or hours they need for the acute danger to subside. A person who must retrieve a firearm from a relative across town, or who has only a small quantity of a less-lethal medication, faces friction and delay at the very moment when impulse is strongest and judgment weakest. That friction is not a trivial inconvenience; it is, repeatedly and demonstrably, the margin between life and death. This is why lethal means counseling is not a soft or peripheral intervention but one of the most evidence-based, high-impact tools in the entire field of suicide prevention.</p>
<h3>Firearms and Suicide</h3>
<p>Firearms account for roughly half of all suicide deaths in the United States despite being used in a small minority of attempts, precisely because of their extreme lethality. Access to a firearm in the home is associated with a substantially elevated risk of suicide for everyone in the household, not only the gun owner. Removing or securing firearms during a period of elevated risk is therefore one of the single most impactful steps a clinician can facilitate. This does not require taking a position on gun ownership or rights; it is a clinical, time-limited, safety-oriented intervention. Research consistently finds that household firearm access is associated with substantially higher odds of suicide for all members of the home, and that states and communities with higher rates of firearm ownership have higher rates of firearm suicide&mdash;without corresponding decreases in suicide by other methods. The clinical implication is direct: for an at-risk client with firearm access, a respectful conversation about temporary storage is among the highest-yield interventions available, and it can and should be conducted in a manner that honors the client&rsquo;s values, autonomy, and, where relevant, their identity as a responsible gun owner, hunter, or veteran.</p>
<h3>Medications and Other Means</h3>
<p>Medication overdose is the most common method in non-fatal attempts and a frequent method in deaths, particularly among women. Means restriction for medications includes prescribing limited quantities, recommending lock boxes, encouraging family to store and dispense medications, removing stockpiles of old prescriptions, and using safe medication disposal. Counseling should also address other accessible methods relevant to the individual, such as access to high places, ropes, or toxic substances, though firearms and medications are the highest priorities for most clients.</p>
<p>Specific medication safety measures merit elaboration because overdose is so common and so often involves ordinary household medications. Acetaminophen, in particular, is widely available, frequently used in overdoses, and capable of causing fatal liver failure even when an attempt is initially survived. Counseling families to keep only small quantities of over-the-counter analgesics on hand, to store medications in locked cabinets, and to safely dispose of expired or unused prescriptions at pharmacy take-back programs can meaningfully reduce risk. For clients on psychiatric medications, prescribers can dispense in limited quantities and avoid large stockpiles. The cumulative effect of these unglamorous, practical steps is substantial, because they place friction and delay between a suicidal impulse and a lethal dose&mdash;and in a time-limited crisis, friction and delay save lives.</p>
<h3>How to Approach the Conversation</h3>
<p>The manner of the conversation determines its success. Effective lethal means counseling is <strong>collaborative, non-judgmental, and framed around safety and time.</strong> Rather than issuing directives, the clinician asks permission and explores options: &ldquo;Many people going through what you&rsquo;re facing find it helps to put some time and distance between themselves and the things they might use to hurt themselves. Would you be willing to think through that with me?&rdquo; The clinician normalizes the step (&ldquo;This is something we discuss with everyone going through a hard time&rdquo;), emphasizes that it is temporary (&ldquo;just for these next few weeks while things are intense&rdquo;), and offers concrete, autonomy-preserving choices (a trusted person holds the firearm, off-site storage, a lock box, separated ammunition). Involving family members&mdash;with consent&mdash;is often essential, since they frequently control or can secure the means. Done well, lethal means counseling strengthens rather than threatens the therapeutic alliance.</p>
<h3>Overcoming Clinician Reluctance to Counsel on Means</h3>
<p>Despite its strong evidence base, lethal means counseling remains chronically underused, and the barriers lie as much in the clinician as in the client. Many clinicians feel ill-equipped to raise the subject of firearms, worry about offending clients, hold personal or political ambivalence about guns, or simply forget the step under the press of a busy session. Surveys consistently show that mental health professionals receive little formal training in this area and report low confidence. Yet free, structured trainings such as Counseling on Access to Lethal Means (CALM) demonstrate that the skill is readily learnable and that comfort grows quickly with practice. The first step in becoming effective is recognizing that means counseling is not an optional add-on or a political act&mdash;it is a core clinical responsibility, every bit as essential as assessing mood or prescribing the right intervention.</p>
<p>A useful reframe for the hesitant clinician is to think of lethal means counseling as analogous to other routine safety counseling. We counsel clients about medication interactions, about substance use, about seatbelts and helmets in injury-prevention contexts. Asking a depressed client whether there is a firearm in the home and whether it can be temporarily secured is no more intrusive than these&mdash;and potentially far more consequential. Framing the conversation as standard care (&ldquo;I ask everyone going through a hard time about this&rdquo;) normalizes it for both parties and removes the implication that the client has been singled out as dangerous.</p>
<h3>Engaging Families and Trusted Others</h3>
<p>Because the people who control access to means are often family members rather than the client, lethal means counseling frequently extends beyond the individual session. With the client&rsquo;s consent, the clinician may speak directly with a spouse, parent, or roommate about securing firearms and medications. These conversations should be respectful, concrete, and time-limited in framing: &ldquo;While your son is going through this difficult period, would you be willing to store the firearms at a relative&rsquo;s house, or lock them and keep the key separately, just for the next few weeks?&rdquo; Families are often relieved to be given a clear, actionable way to help. Providing them with specifics&mdash;where to obtain a lockbox, how off-site storage works, how to safely dispose of unused medications&mdash;turns good intentions into completed safety steps. The clinician should follow up to confirm the steps were actually taken, since intention does not always translate into action. When a client is unwilling to remove a firearm entirely, partial measures still help: storing the firearm unloaded, locking it with a cable or trigger lock, keeping ammunition locked separately, or surrendering the key or combination to a trusted other. Each layer of friction adds protective delay. The clinician&rsquo;s goal is not an all-or-nothing victory but the greatest feasible reduction in immediate access, achieved collaboratively and revisited as risk rises or falls.</p>`
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Firearms and Suicide Risk',
          content: `<p><strong>Firearms are the most lethal and most common method of suicide in the United States.</strong> They account for roughly half of all suicide deaths, and an attempt with a firearm is fatal approximately 85&ndash;90 percent of the time&mdash;leaving little opportunity for rescue, intervention, or the natural passing of an acute crisis.</p>
<p>Access to a firearm in the home roughly triples the risk of suicide for all household members, independent of whether they own or use the gun. Because suicidal crises are frequently brief and impulsive, the immediate availability of a firearm can transform a survivable moment into a fatal one.</p>
<p>Securing firearms&mdash;through temporary off-site storage with a trusted person or facility, locking devices, or storing the firearm and ammunition separately&mdash;during periods of elevated risk is a clinical, time-limited safety measure. It is not a political stance and need not be framed as one. For clients who own firearms, including veterans and rural clients, a respectful, collaborative, autonomy-preserving conversation about temporary storage is both feasible and potentially life-saving.</p>`
        },
        {
          type: 'text',
          content: `<h2>Special Populations</h2>
<p>While the core principles of assessment, safety planning, and means restriction apply universally, several populations carry distinct risk profiles and require tailored clinical approaches. Cultural humility and population-specific knowledge improve both engagement and outcomes. The principle is not to memorize a rigid script for each group&mdash;every client is an individual, not a demographic&mdash;but to understand the distinctive pressures, risks, and protective resources that tend to accompany each population, and to let that knowledge inform a genuinely individualized assessment.</p>
<p><strong>Adolescents.</strong> Suicide is a leading cause of death among adolescents, and rates of suicidal ideation and attempts have risen sharply, particularly among adolescent girls. Adolescent suicidality is often impulsive and reactive to acute interpersonal stressors&mdash;conflict with parents or peers, romantic breakups, bullying (including cyberbullying), and academic pressure. Developmentally, adolescents may have limited future orientation and a heightened sensitivity to social rejection. Assessment should engage both the adolescent and caregivers, with attention to confidentiality and its limits. Means restriction necessarily involves parents, who must secure firearms and medications. Social media exposure to self-harm content and contagion within peer groups are important considerations.</p>
<p><strong>Veterans.</strong> Veterans die by suicide at a markedly elevated rate. Contributing factors include combat exposure, post-traumatic stress disorder, traumatic brain injury, moral injury, chronic pain, difficult transitions to civilian life, relationship and occupational disruption, and high rates of firearm ownership and familiarity. Veterans may be reluctant to seek help due to stigma or concerns about career and identity. Firearm-focused means restriction is especially important given high access and familiarity. The Veterans Crisis Line (dial 988 then press 1) is a key resource, and culturally competent care that respects military identity and values improves engagement.</p>
<p><strong>LGBTQ+ clients.</strong> Lesbian, gay, bisexual, transgender, and queer individuals&mdash;especially youth&mdash;experience substantially elevated rates of suicidal ideation and attempts. The driver is not sexual orientation or gender identity itself but <strong>minority stress</strong>: chronic experiences of stigma, discrimination, rejection, victimization, and internalized stigma. Family rejection sharply increases risk, while family and community acceptance is strongly protective. For transgender clients, access to gender-affirming care and the use of affirmed names and pronouns are protective. Clinicians must create explicitly affirming environments and avoid the harm of non-affirming or so-called &ldquo;conversion&rdquo; approaches, which are unethical and dangerous.</p>
<p><strong>Older adults.</strong> Older adults, particularly men aged 75 and older, have among the highest suicide rates of any group, and their attempts are more likely to be lethal&mdash;they use more lethal means, are physically frailer, are more isolated, and are less likely to be rescued. Risk factors include depression (often under-recognized), chronic and painful illness, functional decline, bereavement, social isolation, and perceived burdensomeness. Older adults often present with somatic complaints rather than emotional ones and may not spontaneously disclose suicidal thoughts, making proactive, direct inquiry essential. Their suicidal intent tends to be more determined and less impulsive than that of younger people. Compounding the danger, the warning signs in older adults are often quieter&mdash;less dramatic talk of suicide, more subtle withdrawal, giving away possessions, putting affairs in order, or a deepening resignation that family and even clinicians may mistake for peaceful acceptance. Proactive screening in primary care, treatment of depression and pain, reduction of isolation through meaningful engagement, and securing of firearms and medications together form the backbone of prevention in this high-risk, frequently overlooked population.</p>
<h3>Additional Populations and the Principle of Cultural Humility</h3>
<p>The four populations above are illustrative, not exhaustive. Clinicians will also encounter elevated or distinctive risk among individuals with serious mental illness, people in the perinatal period, those involved in the criminal-legal system, individuals experiencing homelessness, first responders and health-care workers, and members of racial and ethnic groups facing the cumulative stress of discrimination. Notably, suicide rates among Black youth have risen markedly in recent years, challenging older assumptions and underscoring that no community is immune. The common thread is that effective care requires <strong>cultural humility</strong>: the clinician approaches each client as the expert on their own life and context, asks rather than assumes, and tailors assessment, safety planning, and means restriction to the realities of that person&rsquo;s world.</p>
<p>Cultural factors shape not only risk but also the very expression and disclosure of suicidality. Stigma surrounding mental illness and suicide is more intense in some communities than others, suppressing help-seeking and honest disclosure. Religious and spiritual beliefs may serve as powerful protective factors and reasons for living, but they can also be sources of shame for a person who believes their suicidal thoughts are sinful. Language barriers, distrust of health systems rooted in historical mistreatment, and differing cultural idioms of distress can all obscure risk from an inattentive clinician. The skilled practitioner remains curious, asks about the client&rsquo;s own understanding of their suffering, and enlists culturally meaningful supports&mdash;a faith community, an elder, a chosen family&mdash;in the work of staying safe. Acculturation stress, immigration-related trauma and family separation, and intergenerational conflict can all contribute to risk in ways an inattentive clinician may miss entirely. The antidote is humility and inquiry: rather than assuming that a framework developed in one cultural context applies unmodified to another, the clinician asks the client to teach them about their world, their sources of meaning, and the supports&mdash;often communal and spiritual rather than individual and clinical&mdash;that have sustained them through suffering.</p>
<h3>Telehealth and Special Considerations</h3>
<p>Finally, more and more suicide-related care occurs over telehealth, which introduces its own considerations. When a clinician cannot be physically present, knowing the client&rsquo;s exact location, having an emergency contact on file, and pre-establishing local crisis resources become essential safeguards. Safety planning and lethal means counseling are fully feasible by video&mdash;indeed, the clinician can sometimes ask the client to physically secure or move medications during the session&mdash;but the clinician must plan in advance for how to summon help to the client&rsquo;s location should an emergency arise. Documenting these telehealth-specific safety procedures is part of the standard of care. Before the first telehealth session, the clinician should obtain the client&rsquo;s precise physical address for each session, the name and number of an emergency contact, and the relevant local crisis and emergency resources for the client&rsquo;s jurisdiction. The clinician should also discuss in advance what will happen if the connection drops during a crisis and how the clinician would reach help if the client became unsafe. Far from being a barrier, telehealth can extend high-quality suicide care to rural, homebound, and otherwise underserved clients&mdash;provided these safeguards are thoughtfully built in from the outset rather than improvised in an emergency.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Adolescents',
              content: `<p>Adolescent suicidality is frequently <strong>impulsive and reactive</strong> to acute interpersonal stressors&mdash;family or peer conflict, romantic loss, bullying, and academic pressure. Developmental features such as limited future orientation, heightened sensitivity to rejection, and incomplete impulse control shape the clinical picture. <strong>Assessment</strong> should include both the adolescent (ideally interviewed alone for candor) and caregivers, with clear discussion of confidentiality and its safety-related limits. <strong>Means restriction must involve parents</strong>, who are responsible for securing firearms and medications in the home; clinicians should counsel caregivers directly. Be alert to social media exposure to self-harm content, peer contagion, and non-suicidal self-injury, which is common in this age group and elevates risk. Engaging the family system and the school can be pivotal. Confidentiality with minors deserves particular care: the adolescent must understand at the outset what will and will not be shared with parents, and the clinician must balance the youth&rsquo;s need for a private therapeutic space against the parents&rsquo; need-to-know when safety is at stake. Handled clumsily, a confidentiality breach can rupture the alliance with the adolescent; handled thoughtfully, the clinician can often bring the youth and family together around a shared safety plan that the adolescent helps to author, preserving both trust and protection.</p>`
            },
            {
              title: 'Veterans',
              content: `<p>Veterans face elevated suicide risk driven by combat exposure, PTSD, traumatic brain injury, <strong>moral injury</strong>, chronic pain, and challenging transitions to civilian life&mdash;compounded by high rates of firearm ownership and familiarity. Stigma and concerns about identity or career can deter help-seeking. <strong>Firearm-focused lethal means counseling</strong> is especially critical and should be approached collaboratively and respectfully, honoring the veteran’s values and autonomy (e.g., temporary storage with a fellow veteran or a lock box). The <strong>Veterans Crisis Line</strong> (dial 988, then press 1, or text 838255) provides specialized support. Culturally competent care that respects military culture, service, and identity meaningfully improves engagement and trust. The concept of moral injury&mdash;the profound shame, guilt, and loss of meaning that can follow acts that violate one&rsquo;s moral code in combat&mdash;deserves special clinical attention, as it can drive a sense of being irredeemable or unworthy of life that ordinary depression treatment does not fully reach. Clinicians working with veterans should also recognize the protective power of the veteran community itself; connecting an isolated veteran to peer support, veteran service organizations, or a trusted fellow service member can restore the sense of belonging and shared identity that military service once provided and that civilian life may have stripped away.</p>`
            },
            {
              title: 'LGBTQ+ Clients',
              content: `<p>LGBTQ+ individuals, especially youth, experience substantially higher rates of suicidal ideation and attempts. The cause is <strong>minority stress</strong>&mdash;chronic discrimination, rejection, victimization, and internalized stigma&mdash;not identity itself. <strong>Family rejection</strong> dramatically increases risk, while family and community <strong>acceptance is strongly protective</strong>. Clinicians should provide explicitly affirming care: use affirmed names and pronouns, avoid assumptions, support access to gender-affirming care for transgender clients, and never employ non-affirming or "conversion" approaches, which are unethical and increase harm. Connecting clients to affirming peer and community supports, and resources such as the Trevor Project, can be protective and life-saving. A crucial implication of the minority-stress framework is that the clinical goal is never to change the client&rsquo;s identity but to reduce the burden of stigma and to strengthen resilience, connection, and self-acceptance. Even small affirming actions&mdash;an intake form that asks for pronouns, a waiting room with visible signals of inclusion, a clinician who responds to a coming-out disclosure with warmth rather than discomfort&mdash;communicate safety and can meaningfully lower a vulnerable client&rsquo;s distress. For transgender and nonbinary clients in particular, supporting social transition and access to gender-affirming care has been associated with marked reductions in suicidality.</p>`
            },
            {
              title: 'Older Adults',
              content: `<p>Older adults&mdash;particularly men 75 and older&mdash;have among the highest suicide rates, and their attempts are more often <strong>lethal</strong> because they use more lethal means, are physically frailer, are more isolated, and are less likely to be discovered and rescued. Risk factors include under-recognized depression, chronic and painful illness, functional decline, bereavement, social isolation, and perceived burdensomeness. Older adults frequently present with <strong>somatic complaints</strong> rather than emotional distress and may not volunteer suicidal thoughts, so <strong>proactive, direct inquiry is essential</strong>. Their intent tends to be more determined and planned. Addressing isolation, treating depression, managing pain, and securing means (including firearms and medications) are key interventions, often in coordination with primary care. Because most older adults who die by suicide have visited a primary care provider in the weeks before their death, primary care is a critical&mdash;and underutilized&mdash;point of detection. Clinicians should be alert to the way ageism can lead providers to normalize an older adult&rsquo;s wish to die as an understandable response to aging or illness, a stance that can cause genuine, treatable depression and suicidality to go unaddressed. The wish to die in an older adult is not a normal part of aging; it is a clinical sign warranting the same serious assessment and intervention afforded to anyone else.</p>`
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Why Means Restriction Works',
          content: `<p>Skeptics sometimes ask, &ldquo;Won&rsquo;t a person who is truly determined simply find another way?&rdquo; The research answers clearly: <strong>no, not usually.</strong> Means restriction is effective because suicidal crises are typically acute, ambivalent, and time-limited, and because most people do not readily substitute a different method when their preferred method is unavailable.</p>
<p>The classic natural experiments are instructive. When the United Kingdom switched from highly toxic coal gas to non-toxic natural gas in domestic supply, suicide by gas&mdash;then a leading method&mdash;fell dramatically, and the overall national suicide rate dropped substantially without full substitution to other methods. Similarly, installing barriers on bridges and detoxifying domestic gas have produced lasting reductions in suicide. At the individual level, reducing access to firearms and medications during a high-risk period gives the crisis time to pass and preserves the opportunity for treatment and recovery. Because the majority of attempt survivors do not die by suicide, every crisis survived is a meaningful victory&mdash;and means restriction is how we help clients survive the moment.</p>
<p>The data on long-term outcomes are genuinely hopeful and worth sharing with skeptical clients and families. Follow-up studies of people who survived highly lethal attempts&mdash;including survivors of jumps from bridges that were later fitted with barriers&mdash;find that the large majority go on to live out their natural lives and do not die by suicide. Many describe a near-instantaneous regret in the moment of the attempt, a sudden, desperate wish to live. This is perhaps the most powerful argument for means restriction: the suicidal crisis, for all its intensity, is frequently a passing storm, and the person trapped within it almost always retains, somewhere, a desire to survive. Our task is simply to ensure that the most lethal option is not within arm&rsquo;s reach during the brief window when judgment is most impaired and pain is most acute.</p>`,
          image: '',
          imageAlt: 'Illustration depicting how reducing access to lethal means interrupts an acute suicidal crisis',
          imagePosition: 'left'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following reflect best practices in lethal means counseling? (Select all that apply.)',
          options: [
            { text: 'Framing means restriction as a temporary, time-limited safety measure', isCorrect: true },
            { text: 'Approaching the conversation collaboratively and non-judgmentally', isCorrect: true },
            { text: 'Issuing a directive ultimatum that the client must surrender their firearm immediately', isCorrect: false },
            { text: 'Involving trusted family members, with consent, to secure or store the means', isCorrect: true },
            { text: 'Offering concrete, autonomy-preserving options such as off-site storage or lock boxes', isCorrect: true },
            { text: 'Avoiding the topic of firearms to prevent the client from feeling judged', isCorrect: false }
          ],
          explanation: 'Effective lethal means counseling is collaborative, non-judgmental, framed as temporary and safety-oriented, and offers autonomy-preserving options. Involving family with consent is often essential since they may control access to means. Issuing ultimatums damages the alliance and breeds defensiveness, and avoiding firearms altogether leaves the single most lethal and modifiable risk factor untouched.'
        },
        {
          type: 'text',
          content: `<h2>Hospitalization, Countertransference, and Self-Care</h2>
<p><strong>Hospitalization criteria.</strong> Inpatient psychiatric hospitalization is a tool, not a default, and the decision requires careful clinical judgment. Hospitalization is generally indicated when a client is at imminent risk&mdash;active intent with a plan and available means, recent or aborted attempt, an inability to maintain safety, or a crisis that cannot be managed at a lower level of care. <strong>Voluntary hospitalization</strong> is preferred whenever the client agrees, preserving autonomy and the therapeutic alliance. <strong>Involuntary hospitalization</strong> (civil commitment) is reserved for situations in which a client at imminent risk is unwilling or unable to accept voluntary care; criteria vary by jurisdiction but generally require that the person poses a danger to self due to mental illness. Clinicians must know their state&rsquo;s specific statutes and procedures. Importantly, hospitalization is not a cure&mdash;risk is often elevated in the period immediately following discharge, making safety planning, means restriction, and prompt follow-up essential parts of the discharge transition. Clinicians should also weigh the potential harms of hospitalization, which include disruption to work and family, financial cost, stigma, loss of autonomy, and, for some clients, retraumatization. For many clients at moderate or even high risk, intensive outpatient care&mdash;frequent contact, a robust safety plan, means restriction, and mobilized supports&mdash;is both safer and more therapeutic than admission. The decision is therefore a clinical judgment weighing the immediacy of danger against the costs and benefits of each level of care, made collaboratively wherever possible and documented with clear reasoning. When hospitalization is genuinely necessary, the clinician can soften its impact by involving the client in the decision, explaining the rationale honestly, framing it as a temporary, protective measure rather than a punishment or failure, and ensuring that the discharge plan returns the client promptly to supportive outpatient care. Even an involuntary admission can be conducted in a way that preserves dignity and the therapeutic relationship, so that the client experiences the intervention as an act of care rather than coercion&mdash;a distinction that can meaningfully affect their willingness to trust providers and to seek out help again in future crises.</p>
<p><strong>Countertransference.</strong> Working with suicidal clients evokes powerful reactions in clinicians: anxiety, a sense of responsibility, fear of liability, frustration, helplessness, and sometimes&mdash;particularly with chronically suicidal clients&mdash;irritation or even unconscious aversion. These reactions are normal, but unexamined they can distort care, leading to over-restriction (premature hospitalization driven by the clinician&rsquo;s anxiety) or under-engagement (avoidance, minimization, missed cues). Self-awareness is a clinical skill. Naming one&rsquo;s reactions, monitoring their influence, and processing them in supervision protect both the client and the clinician.</p>
<p>Chronically suicidal clients&mdash;those for whom suicidal ideation is an enduring feature of their lives rather than an acute episode&mdash;pose a particular countertransference challenge. Over time, a clinician may grow weary, anxious, or resentful, and may swing between excessive control (repeated hospitalizations that reinforce the client&rsquo;s identity as helpless and dangerous) and detachment (emotional withdrawal that the client experiences as abandonment). Evidence-based approaches such as dialectical behavior therapy were developed precisely for this population, emphasizing validation paired with skills-building, a clear distinction between chronic and acute risk, and a stance that takes suicidality seriously without being controlled by it. Consultation teams, a core component of DBT, exist in part to support the clinician&rsquo;s own regulation and to prevent the burnout that long-term work with high-risk clients can produce.</p>
<p><strong>Self-care and supervision.</strong> Suicide work is emotionally demanding and carries the rare but devastating possibility of losing a client. Clinicians who carry this risk need robust supports: regular consultation and supervision, peer support, manageable caseloads, and personal practices that sustain resilience. Consultation is not a sign of weakness but a standard of care&mdash;documenting that you sought consultation on a difficult case demonstrates sound clinical judgment. Clinicians should also prepare for the possibility of a client death by suicide, which affects most who work in this field at some point; postvention support, processing, and self-compassion are essential. Sustainable suicide prevention practice depends on clinicians who are supported, supervised, and cared for themselves.</p>
<h3>The Standard of Care and Realistic Expectations</h3>
<p>It is worth stating plainly, because it relieves a burden many clinicians carry: you cannot prevent every suicide, and you are not expected to. The standard of care holds clinicians responsible for conducting reasonable assessments, exercising sound clinical judgment, implementing appropriate interventions, and documenting their reasoning&mdash;not for achieving the impossible feat of perfectly predicting and forestalling an inherently unpredictable event. A clinician who assesses carefully, formulates risk thoughtfully, builds a collaborative safety plan, counsels on lethal means, consults when uncertain, and documents the process has met their professional and ethical obligations even if a tragic outcome nonetheless occurs. Internalizing this distinction protects clinicians from both the paralysis of over-responsibility and the moral injury that can follow a loss.</p>
<h3>When a Client Dies: Postvention for the Clinician</h3>
<p>Most clinicians who work with suicidal clients over a career will, at some point, lose a client to suicide. This is one of the most painful experiences in the profession, often accompanied by grief, guilt, self-doubt, fear of blame, and intrusive review of every decision. It deserves the same compassion and support we extend to any bereaved person. Postvention for the clinician&mdash;the structured support that follows a death by suicide&mdash;includes processing the loss with trusted colleagues and supervisors, seeking consultation about any clinical and risk-management questions, allowing oneself to grieve, and resisting the temptation toward either reflexive self-blame or defensive denial. Organizations have a responsibility to support clinicians through such losses rather than abandoning them to isolation and shame. A clinician who is well supported through a client&rsquo;s death is far more likely to remain in the field, continue this vital work, and bring hard-won wisdom and humility to the clients who come after.</p>
<h3>Bringing It All Together</h3>
<p>Across these three sections we have traveled from the population-level patterns of suicide, through the structured assessment of an individual&rsquo;s risk, into the collaborative construction of a safety plan, and onward to the practical work of lethal means counseling, special-population care, and clinician self-care. These are not separate skills but a single, integrated practice. Assessment without intervention is incomplete; a safety plan that ignores access to lethal means leaves the most dangerous door open; intervention without attention to the clinician&rsquo;s own well-being is unsustainable. The competent suicide-care clinician holds all of these together&mdash;asking directly and calmly, formulating risk thoughtfully, building a plan in the client&rsquo;s own words, securing the environment, adapting to the person in front of them, documenting their reasoning, consulting when uncertain, and tending to their own resilience.</p>
<p>Above all, remember the throughline that connects every technique in this course: the suicidal person is in unbearable pain and is seeking escape from that pain, not death for its own sake. Our work is to help them survive the storm long enough for the pain to become bearable and the future to reopen. The tools are concrete and learnable. The stance is one of compassionate, steady, collaborative presence. And the stakes&mdash;a human life&mdash;could not be higher. With the knowledge and skills you have built here, you are better equipped to meet that moment with confidence rather than fear, and to be, for a person at the edge, a reason to stay.</p>
<h3>Building a Sustainable Practice</h3>
<p>The cumulative weight of suicide work&mdash;the vigilance, the high stakes, the emotional intensity&mdash;makes burnout and vicarious traumatization real occupational hazards. Sustainable practice requires deliberate structures: realistic caseloads that do not concentrate too many high-acuity clients with a single clinician, reliable access to consultation and supervision, peer support and community to counter professional isolation, ongoing training to maintain competence and confidence, and attention to one&rsquo;s own physical and emotional well-being outside of work. Clinicians who tend to their own resilience are not being self-indulgent; they are protecting their capacity to show up, again and again, with the steadiness and compassion that suicidal clients so urgently need. Caring for the caregiver is, ultimately, part of caring for the client.</p>`
        },
        {
          type: 'sequencing',
          instructions: 'Place the steps of an effective lethal means counseling conversation in their proper sequence, from beginning to end.',
          steps: [
            { text: 'Establish rapport and normalize the conversation, explaining that you discuss safety and access to means with everyone going through a difficult time.', order: 1 },
            { text: 'Ask permission and assess what potentially lethal means the client has access to, with particular attention to firearms and medications.', order: 2 },
            { text: 'Provide brief education on why putting time and distance between the person and lethal means is protective during an acute crisis.', order: 3 },
            { text: 'Collaboratively generate concrete, autonomy-preserving options for limiting access (e.g., temporary off-site storage, lock boxes, separating ammunition, limited medication supplies).', order: 4 },
            { text: 'Identify and, with consent, involve trusted family or friends who can help secure or store the means.', order: 5 },
            { text: 'Agree on a specific, realistic plan and document it as part of the safety plan (Step 6).', order: 6 },
            { text: 'Arrange follow-up to confirm the means-restriction steps were carried out and to reassess risk.', order: 7 }
          ],
          explanation: 'Effective lethal means counseling moves from rapport and normalization, to assessing access, to brief education on the rationale, to collaborative option-generation, to involving supports, to agreeing on and documenting a concrete plan, and finally to follow-up. Sequencing the conversation this way preserves the alliance, respects autonomy, and translates intention into action.'
        },
        {
          type: 'multipleChoice',
          question: 'Which statement about hospitalization for suicidal clients is most accurate?',
          options: [
            { text: 'Involuntary hospitalization is the default response to any disclosure of suicidal ideation.', isCorrect: false },
            { text: 'Voluntary hospitalization is preferred when the client agrees, and risk is often elevated in the period immediately after discharge.', isCorrect: true },
            { text: 'Hospitalization cures suicidality, so safety planning is unnecessary at discharge.', isCorrect: false },
            { text: 'Once a client is hospitalized, no further means restriction or follow-up is needed.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Hospitalization is a tool reserved primarily for imminent risk, not a default for any ideation. Voluntary hospitalization is preferred when the client agrees because it preserves autonomy and the alliance. Crucially, the post-discharge period is a window of elevated risk, so safety planning, means restriction, and prompt follow-up are essential parts of the discharge transition—hospitalization is not a cure.'
        },
        {
          type: 'reflection',
          question: 'Reflect on your own reactions when working with clients who express suicidal ideation. What emotions or assumptions do you notice, and how might clinician self-awareness improve the therapeutic relationship in these moments?'
        },
        {
          type: 'keyTakeaway',
          title: 'Section 3 Key Takeaways',
          takeaways: [
            'Lethal means counseling is among the most evidence-based, life-saving interventions available; it rests on the findings that suicidal crises are brief and that method lethality varies enormously.',
            'Firearms are the most lethal and most common method of suicide; access to a firearm in the home elevates risk for all household members, making temporary, voluntary securing of firearms a high priority.',
            'Means restriction works because crises are time-limited and most people do not substitute methods; most attempt survivors do not go on to die by suicide.',
            'Adolescents (impulsive, peer-driven), veterans (firearms, PTSD, moral injury), LGBTQ+ clients (minority stress, family rejection), and older adults (lethal, determined, under-recognized) each require tailored approaches.',
            'Lethal means conversations must be collaborative, non-judgmental, temporary in framing, autonomy-preserving, and often involve family with consent—ultimatums damage the alliance.',
            'Hospitalization is reserved primarily for imminent risk; voluntary is preferred, and the post-discharge period is a window of elevated risk requiring safety planning and follow-up.',
            'Countertransference—anxiety, responsibility, frustration, aversion—is normal but, if unexamined, can distort care toward over-restriction or under-engagement.',
            'Sustainable suicide prevention practice requires supervision, consultation, peer support, manageable caseloads, postvention readiness, and clinician self-care.'
          ]
        },
        {
          type: 'resources',
          resources: [
            { name: '988 Suicide and Crisis Lifeline', url: 'https://988lifeline.org', description: 'Free, confidential, 24/7 crisis support by call or text to 988 for anyone in suicidal crisis or emotional distress, plus resources for clinicians and families.', type: 'website' },
            { name: 'Stanley-Brown Safety Plan', url: 'https://suicidesafetyplan.com', description: 'Official site for the Stanley-Brown Safety Planning Intervention, including the safety plan template, training, and the mobile app.', type: 'website' },
            { name: 'Columbia Protocol (C-SSRS)', url: 'https://cssrs.columbia.edu', description: 'Home of the Columbia Suicide Severity Rating Scale, with free versions of the scale, training, and implementation guidance for clinical and community settings.', type: 'website' },
            { name: 'Suicide Prevention Resource Center (SPRC)', url: 'https://www.sprc.org', description: 'A leading national resource center offering best-practice guidance, toolkits, and trainings on suicide prevention for clinicians and organizations.', type: 'website' },
            { name: 'American Foundation for Suicide Prevention (AFSP)', url: 'https://afsp.org', description: 'National nonprofit funding research, education, advocacy, and survivor/loss support, with clinician and public resources on suicide prevention.', type: 'website' },
            { name: 'Zero Suicide Institute', url: 'https://zerosuicide.edc.org', description: 'A framework and toolkit for systematic, safer suicide care within health and behavioral health systems, including safety planning and lethal means resources.', type: 'website' },
            { name: 'SAMHSA Suicide Prevention', url: 'https://www.samhsa.gov/find-help/suicide-prevention', description: 'Federal resources, data, and grant programs supporting suicide prevention, the 988 Lifeline, and behavioral health crisis services.', type: 'website' },
            { name: 'Counseling on Access to Lethal Means (CALM)', url: 'https://www.sprc.org/online-library/calm-counseling-on-access-to-lethal-means', description: 'A free online training that teaches clinicians how to counsel clients and families on reducing access to lethal means, especially firearms and medications.', type: 'training' },
            { name: 'Veterans Crisis Line', url: 'https://www.veteranscrisisline.net', description: 'Specialized 24/7 crisis support for veterans and their families: dial 988 then press 1, text 838255, or chat online.', type: 'website' },
            { name: 'The Trevor Project', url: 'https://www.thetrevorproject.org', description: 'Crisis intervention and suicide prevention services for LGBTQ+ young people, including 24/7 support and clinician resources.', type: 'website' }
          ]
        }
      ]
    }
  ],

  // ============================================================
  // ASSESSMENT
  // ============================================================
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'Which of the following is the single strongest predictor of death by suicide?',
        options: [
          { text: 'A diagnosis of generalized anxiety disorder', isCorrect: false },
          { text: 'A prior suicide attempt', isCorrect: true },
          { text: 'Being employed full-time', isCorrect: false },
          { text: 'Living in an urban area', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'A prior suicide attempt is the single strongest predictor of death by suicide, with risk especially elevated in the weeks and months following an attempt or psychiatric discharge.'
      },
      {
        type: 'multipleChoice',
        question: 'On the C-SSRS ideation severity continuum, which level represents the highest severity?',
        options: [
          { text: 'Wish to be dead', isCorrect: false },
          { text: 'Active ideation with methods but no plan or intent', isCorrect: false },
          { text: 'Active ideation with some intent but no specific plan', isCorrect: false },
          { text: 'Active ideation with a specific plan and intent', isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: 'The C-SSRS ideation severity scale ascends to level 5: active suicidal ideation with a specific plan and intent, which signals the highest acuity and an immediate need for safety measures.'
      },
      {
        type: 'multipleChoice',
        question: 'What is the primary problem with the "no-harm contract" as a suicide prevention strategy?',
        options: [
          { text: 'It takes too long to complete in a session', isCorrect: false },
          { text: 'It has no demonstrated efficacy and may discourage honest disclosure', isCorrect: true },
          { text: 'It is too expensive for most clinics', isCorrect: false },
          { text: 'It can only be used with adolescents', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'No-harm contracts have no demonstrated efficacy, can create false reassurance, may discourage honest disclosure, and offer no clinical or legal protection. The field has moved toward collaborative safety planning instead.'
      },
      {
        type: 'multipleChoice',
        question: 'In the Stanley-Brown SPI, what distinguishes Step 3 (social contacts for distraction) from Step 4 (people to ask for help)?',
        options: [
          { text: 'Step 3 involves professionals while Step 4 involves family', isCorrect: false },
          { text: 'Step 3 provides distraction without disclosing the crisis, while Step 4 involves explicitly asking for help', isCorrect: true },
          { text: 'Step 3 is for adults and Step 4 is for adolescents', isCorrect: false },
          { text: 'There is no meaningful difference between the two steps', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The key distinction is disclosure. In Step 3, the client connects with people or settings for distraction without revealing the crisis; in Step 4, the client explicitly tells trusted people that they are in crisis and need support.'
      },
      {
        type: 'multipleChoice',
        question: 'Approximately what proportion of suicide attempts involving a firearm are fatal?',
        options: [
          { text: 'About 10 percent', isCorrect: false },
          { text: 'About 35 percent', isCorrect: false },
          { text: 'About 50 percent', isCorrect: false },
          { text: 'About 85 to 90 percent', isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: 'Firearm attempts are fatal approximately 85–90 percent of the time, making firearms the most lethal common method and a top priority for means restriction.'
      },
      {
        type: 'multipleChoice',
        question: 'Which framing best reflects evidence-based lethal means counseling?',
        options: [
          { text: '"You must permanently give up your firearm or I cannot treat you."', isCorrect: false },
          { text: '"Would you be open to temporarily putting some time and distance between you and lethal means while things are intense?"', isCorrect: true },
          { text: '"Let’s not talk about your firearm so you don’t feel judged."', isCorrect: false },
          { text: '"Firearms are never relevant to suicide risk."', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Effective lethal means counseling is collaborative, non-judgmental, framed as temporary and safety-oriented, and offers autonomy-preserving options—not ultimatums or avoidance.'
      },
      {
        type: 'multipleChoice',
        question: 'Which population has among the highest suicide rates and tends to use more lethal means with more determined intent?',
        options: [
          { text: 'Older adult men (75 and older)', isCorrect: true },
          { text: 'College-age women', isCorrect: false },
          { text: 'Children under 10', isCorrect: false },
          { text: 'Middle-school students', isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: 'Older adult men, particularly those 75 and older, have among the highest suicide rates; their attempts are more often lethal because they use more lethal means, are frailer and more isolated, and act with more determined intent.'
      },
      {
        type: 'multipleChoice',
        question: 'What primarily drives the elevated suicide risk among LGBTQ+ individuals?',
        options: [
          { text: 'Sexual orientation or gender identity itself', isCorrect: false },
          { text: 'Minority stress: discrimination, rejection, victimization, and internalized stigma', isCorrect: true },
          { text: 'A biological predisposition unique to this group', isCorrect: false },
          { text: 'Higher rates of firearm ownership', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Elevated risk among LGBTQ+ individuals is driven by minority stress—chronic discrimination, rejection, victimization, and internalized stigma—not by identity itself. Family acceptance and affirming care are strongly protective.'
      },
      {
        type: 'multipleChoice',
        question: 'Which is the most accurate statement about the timing of suicidal crises?',
        options: [
          { text: 'Suicidal crises always build slowly over many months', isCorrect: false },
          { text: 'Suicidal crises are often acute and brief, sometimes with very short intervals between decision and action', isCorrect: true },
          { text: 'Suicidal crises never resolve without hospitalization', isCorrect: false },
          { text: 'The duration of a crisis has no relevance to intervention', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Research on attempt survivors shows the interval between deciding to act and acting is frequently very short. Because crises are acute and time-limited, reducing access to lethal means during that window can be life-saving—the scientific basis for means restriction.'
      },
      {
        type: 'multipleChoice',
        question: 'Which statement about documentation of suicide risk assessment is correct?',
        options: [
          { text: 'A bare checklist of risk factors is sufficient', isCorrect: false },
          { text: 'The standard of care is accurate prediction of the outcome', isCorrect: false },
          { text: 'Documentation should capture data, clinical reasoning, a narrative risk formulation, and the intervention plan', isCorrect: true },
          { text: 'Consultation should never be documented', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Defensible documentation captures the data gathered, the clinician’s reasoning, a narrative risk formulation, and the intervention/plan. The standard of care is reasonable formulation and decision-making—not accurate prediction of an unpredictable event.'
      },
      {
        type: 'multipleChoice',
        question: 'When is voluntary hospitalization preferred over involuntary hospitalization?',
        options: [
          { text: 'Never; involuntary is always preferred', isCorrect: false },
          { text: 'Whenever the client agrees, because it preserves autonomy and the therapeutic alliance', isCorrect: true },
          { text: 'Only for clients without insurance', isCorrect: false },
          { text: 'Only when no family is available', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Voluntary hospitalization is preferred whenever the client agrees because it preserves autonomy and the therapeutic alliance. Involuntary commitment is reserved for imminent risk when a client is unwilling or unable to accept voluntary care.'
      },
      {
        type: 'multipleChoice',
        question: 'According to Beck’s research, which factor often predicts eventual suicide even more strongly than the severity of depression?',
        options: [
          { text: 'Hopelessness', isCorrect: true },
          { text: 'Age', isCorrect: false },
          { text: 'Marital status', isCorrect: false },
          { text: 'Educational attainment', isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: 'Beck’s research identified hopelessness—the belief that the future holds only continued suffering—as a stronger predictor of eventual suicide than depression severity itself.'
      },
      {
        type: 'multipleChoice',
        question: 'Why is the period immediately following psychiatric discharge clinically important?',
        options: [
          { text: 'Risk is essentially eliminated after discharge', isCorrect: false },
          { text: 'Risk is often elevated, making safety planning, means restriction, and prompt follow-up essential', isCorrect: true },
          { text: 'Clients are legally prohibited from receiving outpatient care', isCorrect: false },
          { text: 'Insurance always covers six months of inpatient care', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The post-discharge period is a window of elevated risk. Hospitalization is not a cure, so the discharge transition must include safety planning, means restriction, and prompt follow-up contact.'
      },
      {
        type: 'multipleChoice',
        question: 'Which is the FIRST step of the Stanley-Brown Safety Planning Intervention?',
        options: [
          { text: 'Making the environment safe', isCorrect: false },
          { text: 'Recognizing warning signs', isCorrect: true },
          { text: 'Listing professional and crisis resources', isCorrect: false },
          { text: 'Identifying internal coping strategies', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Step 1 is recognizing warning signs, because the plan is only useful if the client knows when to use it. The steps then progress through internal coping, social distraction, asking for help, professional resources, and making the environment safe.'
      },
      {
        type: 'multipleChoice',
        question: 'Which statement about means restriction is best supported by evidence?',
        options: [
          { text: 'People who are blocked from one method always substitute another equally lethal method', isCorrect: false },
          { text: 'Means restriction reduces suicide because crises are time-limited and most people do not substitute methods', isCorrect: true },
          { text: 'Means restriction has never been studied', isCorrect: false },
          { text: 'Means restriction only works for medication overdose', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Natural experiments (e.g., the UK coal-gas detoxification, bridge barriers) and clinical research show means restriction reduces suicide because crises are acute and time-limited and most people do not substitute a different lethal method.'
      },
      {
        type: 'multipleChoice',
        question: 'When working with a suicidal adolescent, means restriction must necessarily involve:',
        options: [
          { text: 'The adolescent acting entirely on their own', isCorrect: false },
          { text: 'Parents or caregivers, who are responsible for securing firearms and medications', isCorrect: true },
          { text: 'The school principal only', isCorrect: false },
          { text: 'No one, since adolescents rarely have access to means', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Because adolescents do not control the household, means restriction must involve parents or caregivers, who are responsible for securing firearms and medications in the home. Clinicians should counsel caregivers directly.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are recognized PROTECTIVE factors against suicide? (Select all that apply.)',
        options: [
          { text: 'Strong social connections and family support', isCorrect: true },
          { text: 'Responsibility to children or pets', isCorrect: true },
          { text: 'Effective and engaged clinical care', isCorrect: true },
          { text: 'Access to a loaded firearm in the home', isCorrect: false },
          { text: 'Reasons for living and effective coping skills', isCorrect: true },
          { text: 'Recent exposure to another person’s suicide', isCorrect: false }
        ],
        explanation: 'Protective factors include strong social connections, responsibility to others, effective clinical care, reasons for living, and coping skills. Firearm access and recent suicide exposure are risk factors, not protective factors.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following reflect best practices in conducting lethal means counseling? (Select all that apply.)',
        options: [
          { text: 'Normalizing the conversation as something discussed with everyone in a difficult time', isCorrect: true },
          { text: 'Framing means restriction as temporary and time-limited', isCorrect: true },
          { text: 'Offering autonomy-preserving options such as off-site storage or lock boxes', isCorrect: true },
          { text: 'Involving trusted family or friends, with consent, to help secure the means', isCorrect: true },
          { text: 'Issuing an ultimatum that the client surrender the firearm permanently', isCorrect: false },
          { text: 'Arranging follow-up to confirm the steps were carried out and reassess risk', isCorrect: true }
        ],
        explanation: 'Best-practice lethal means counseling normalizes the conversation, frames restriction as temporary, offers autonomy-preserving options, involves supports with consent, and includes follow-up. Ultimatums damage the alliance and are not recommended.'
      }
    ]
  },

  // ============================================================
  // REFERENCES (APA 7th)
  // ============================================================
  references: [
    'Stanley, B., & Brown, G. K. (2012). Safety planning intervention: A brief intervention to mitigate suicide risk. Cognitive and Behavioral Practice, 19(2), 256–264. https://doi.org/10.1016/j.cbpra.2011.01.001',
    'Stanley, B., Brown, G. K., Brenner, L. A., Galfalvy, H. C., Currier, G. W., Knox, K. L., Chaudhury, S. R., Bush, A. L., & Green, K. L. (2018). Comparison of the safety planning intervention with follow-up vs usual care of suicidal patients treated in the emergency department. JAMA Psychiatry, 75(9), 894–900. https://doi.org/10.1001/jamapsychiatry.2018.1776',
    'Posner, K., Brown, G. K., Stanley, B., Brent, D. A., Yershova, K. V., Oquendo, M. A., Currier, G. W., Melvin, G. A., Greenhill, L., Shen, S., & Mann, J. J. (2011). The Columbia–Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults. American Journal of Psychiatry, 168(12), 1266–1277. https://doi.org/10.1176/appi.ajp.2011.10111704',
    'Beck, A. T., Steer, R. A., Kovacs, M., & Garrison, B. (1985). Hopelessness and eventual suicide: A 10-year prospective study of patients hospitalized with suicidal ideation. American Journal of Psychiatry, 142(5), 559–563. https://doi.org/10.1176/ajp.142.5.559',
    'Joiner, T. E. (2005). Why people die by suicide. Harvard University Press.',
    'Van Orden, K. A., Witte, T. K., Cukrowicz, K. C., Braithwaite, S. R., Selby, E. A., & Joiner, T. E. (2010). The interpersonal theory of suicide. Psychological Review, 117(2), 575–600. https://doi.org/10.1037/a0018697',
    'Linehan, M. M., Comtois, K. A., Murray, A. M., Brown, M. Z., Gallop, R. J., Heard, H. L., Korslund, K. E., Tutek, D. A., Reynolds, S. K., & Lindenboim, N. (2006). Two-year randomized controlled trial and follow-up of dialectical behavior therapy vs therapy by experts for suicidal behaviors and borderline personality disorder. Archives of General Psychiatry, 63(7), 757–766. https://doi.org/10.1001/archpsyc.63.7.757',
    'Rudd, M. D., Bryan, C. J., Wertenberger, E. G., Peterson, A. L., Young-McCaughan, S., Mintz, J., Williams, S. R., Arne, K. A., Breitbach, J., Delano, K., Wilkinson, E., & Bruce, T. O. (2015). Brief cognitive-behavioral therapy effects on post-treatment suicide attempts in a military sample: Results of a randomized clinical trial with 2-year follow-up. American Journal of Psychiatry, 172(5), 441–449. https://doi.org/10.1176/appi.ajp.2014.14070843',
    'Bryan, C. J., & Rudd, M. D. (2006). Advances in the assessment of suicide risk. Journal of Clinical Psychology, 62(2), 185–200. https://doi.org/10.1002/jclp.20222',
    'Mann, J. J., Apter, A., Bertolote, J., Beautrais, A., Currier, D., Haas, A., Hegerl, U., Lonnqvist, J., Malone, K., Marusic, A., Mehlum, L., Patton, G., Phillips, M., Rutz, W., Rihmer, Z., Schmidtke, A., Shaffer, D., Silverman, M., Takahashi, Y., … Hendin, H. (2005). Suicide prevention strategies: A systematic review. JAMA, 294(16), 2064–2074. https://doi.org/10.1001/jama.294.16.2064',
    'Mann, J. J., & Michel, C. A. (2016). Prevention of firearm suicide in the United States: What works and what is possible. American Journal of Psychiatry, 173(10), 969–979. https://doi.org/10.1176/appi.ajp.2016.16010069',
    'Anestis, M. D., & Houtsma, C. (2018). The association between gun ownership and statewide overall suicide rates. Suicide and Life-Threatening Behavior, 48(2), 204–217. https://doi.org/10.1111/sltb.12346',
    'Barber, C. W., & Miller, M. J. (2014). Reducing a suicidal person’s access to lethal means of suicide: A research agenda. American Journal of Preventive Medicine, 47(3, Suppl. 2), S264–S272. https://doi.org/10.1016/j.amepre.2014.05.028',
    'Drum, D. J., Brownson, C., Burton Denmark, A., & Smith, S. E. (2009). New data on the nature of suicidal crises in college students: Shifting the paradigm. Professional Psychology: Research and Practice, 40(3), 213–222. https://doi.org/10.1037/a0014465',
    'Nock, M. K., Borges, G., Bromet, E. J., Cha, C. B., Kessler, R. C., & Lee, S. (2008). Suicide and suicidal behavior. Epidemiologic Reviews, 30(1), 133–154. https://doi.org/10.1093/epirev/mxn002',
    'Hawton, K., Saunders, K. E. A., & O’Connor, R. C. (2012). Self-harm and suicide in adolescents. The Lancet, 379(9834), 2373–2382. https://doi.org/10.1016/S0140-6736(12)60322-5',
    'Russell, S. T., & Fish, J. N. (2016). Mental health in lesbian, gay, bisexual, and transgender (LGBT) youth. Annual Review of Clinical Psychology, 12, 465–487. https://doi.org/10.1146/annurev-clinpsy-021815-093153',
    'Conwell, Y., Van Orden, K., & Caine, E. D. (2011). Suicide in older adults. Psychiatric Clinics of North America, 34(2), 451–468. https://doi.org/10.1016/j.psc.2011.02.002'
  ]
};

// ============================================================
// VALIDATION + SEED RUNNER (verbatim per task spec)
// ============================================================
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-crs-301-suicide-safety-planning';

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
