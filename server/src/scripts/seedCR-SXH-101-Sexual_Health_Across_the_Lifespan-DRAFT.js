// CR-SXH-101 — Sexual Health Across the Lifespan: Assessment and Psychoeducation in Counseling
// 3 CE | clinical | GAITP LLC / NBCC ACEP #7760
// Run: node src/scripts/seedCR-SXH-101-Sexual_Health_Across_the_Lifespan-DRAFT.js (from server/)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = 'sexual-health-across-the-lifespan';

const COURSE = {
  title: 'Sexual Health Across the Lifespan: Assessment and Psychoeducation in Counseling',
  slug: SLUG,
  courseCode: 'CR-SXH-101',
  description: 'This course equips licensed mental health professionals with foundational knowledge and clinical skills for addressing sexual health across developmental stages. Participants will learn evidence-based assessment frameworks, psychoeducational strategies, and ethical considerations for integrating sexual health conversations into routine counseling practice.',
  ceHours: 3,
  ceuHours: 3,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  learningObjectives: [
    'Identify key sexual health milestones across the lifespan from adolescence through older adulthood',
    'Apply evidence-based screening tools to assess sexual health concerns in diverse clinical populations',
    'Demonstrate culturally sensitive psychoeducational approaches for discussing sexual health with clients',
    'Analyze common sexual health presentations in counseling and distinguish clinical from normative variation',
    'Evaluate ethical responsibilities when addressing sexual health topics in the therapeutic relationship',
    'Develop client-centered treatment planning that incorporates sexual health as a dimension of overall wellness'
  ],
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
  approvals: [{ body: 'NBCC', number: '#7760', hourBreakdown: [{ label: 'core', hours: 3 }] }],
  isPublished: false,
  status: 'draft',

  sections: [
    {
      title: 'Introduction: Sexual Health as a Counseling Competency',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction: Sexual Health as a Counseling Competency',
          subtitle: 'Why sexual health belongs in every counselor\'s scope of practice',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>Sexual health is a fundamental dimension of human wellbeing, yet it remains one of the most under-addressed domains in general counseling practice. Research consistently shows that clients want to discuss sexual concerns with their therapists, but they hesitate because they anticipate discomfort, judgment, or dismissal from clinicians who were never trained to hold these conversations with competence. The resulting silence carries real clinical costs: undetected sexual dysfunction, trauma responses misattributed to unrelated causes, relationship distress that goes untreated, and clients who quietly disengage from care when they realize their whole selves are not welcome in the room.</p>
<p>The World Health Organization defines sexual health not merely as the absence of disease or dysfunction, but as "a state of physical, emotional, mental and social well-being in relation to sexuality." This definition is intentionally expansive. It locates sexual health inside the same biopsychosocial framework that guides holistic counseling practice more broadly. It recognizes that sexuality is not a discrete clinical domain owned by sex therapists; it is woven through attachment, identity development, relational patterns, trauma history, cultural formation, and the full arc of human meaning-making across a lifetime. For licensed counselors, social workers, and marriage and family therapists, this means that sexual health competency is not a specialty add-on — it is part of the professional baseline.</p>
<p>Despite this, training gaps remain widespread. National surveys of licensed mental health professionals report that fewer than 20 percent received more than one semester of sexuality content in their graduate programs, and many cite zero formal training in assessment tools, psychoeducational frameworks, or common clinical presentations related to sexual health. Clinicians who were trained before 2010 may have received content that was already outdated by the time they completed their degrees, as the field of sexology was undergoing rapid paradigm shifts driven by the declassification of homosexuality, the expansion of paraphilia conceptualization, and growing empirical attention to female and nonbinary sexual experience.</p>
<p>This course is designed to close that gap at a foundational level. Over three continuing education hours, you will acquire conceptual frameworks, assessment strategies, psychoeducational tools, and clinical language that will allow you to incorporate sexual health into your general counseling practice without requiring a full specialization in sex therapy. You will learn to ask about sexual health in intake and ongoing care, to respond to disclosures without activating client shame, to distinguish presentations that can be addressed within your existing scope from those that warrant referral, and to navigate the ethical terrain that surrounds this inherently sensitive domain.</p>
<p>This course draws on the PLISSIT model developed by Jack Annon (1976), the biopsychosocial-spiritual framework articulated by Engel and expanded by Satcher, the World Health Organization's Sexual Health Framework, and the American Association of Sexuality Educators, Counselors and Therapists (AASECT) competency guidelines. It incorporates current DSM-5-TR diagnostic criteria, recent literature on sexual health across the lifespan, and practice-based evidence for psychoeducational approaches with culturally diverse populations.</p>
<p>A word about language before we begin: this course uses inclusive, affirming terminology throughout. We use the phrase "sexual health" broadly to encompass desire, arousal, identity, relationship patterns, and values alignment around sexuality — not just dysfunction or disease. We use person-first language when discussing conditions, and we use gender-inclusive framing unless discussing research that was conducted with a gender-specific population. When clinical literature has historically excluded LGBTQ+ individuals, people of color, disabled people, or older adults, this course names that exclusion directly rather than presenting the dominant-group research as universal truth. Competent sexual health counseling requires ongoing awareness of whose experiences have shaped our frameworks — and whose have been left out.</p>`
        },
        {
          type: 'callout',
          title: 'AASECT Position on Counselor Competency',
          calloutType: 'clinical',
          content: `<p>The American Association of Sexuality Educators, Counselors and Therapists (AASECT) identifies sexual health literacy as an ethical obligation for all mental health professionals — not only certified sex therapists. Competency includes: the ability to take a sexual history without expressing discomfort; knowledge of normative and non-normative sexual development; familiarity with common sexual dysfunctions and their biopsychosocial contributors; and awareness of when and how to refer. All AASECT-certified providers must demonstrate this foundational competency before pursuing specialty designation.</p>`
        },
        {
          type: 'text',
          content: `<p>To understand why sexual health belongs in the counseling intake, consider what clinicians routinely miss when the topic is avoided. A 2018 study published in the Journal of Sexual Medicine found that 43 percent of women and 31 percent of men presenting for outpatient mental health services were experiencing at least one significant sexual concern — and in 78 percent of those cases, the concern had never been mentioned in treatment because no clinician had asked. These were not minor concerns. Many involved pain, loss of desire, relationship-threatening disconnection, or shame spirals that were directly feeding the depression and anxiety for which clients were ostensibly receiving care. The presenting problem was being treated while its sexual dimension went invisible.</p>
<p>The relationship between sexual health and mental health runs in both directions. Common mental health conditions including major depressive disorder, generalized anxiety disorder, PTSD, bipolar disorder, and obsessive-compulsive disorder all have documented impacts on sexual functioning, desire, and satisfaction. Conversely, sexual dysfunction, chronic sexual shame, and unresolved sexual trauma are among the strongest predictors of relational distress, which itself predicts depression recurrence, increased anxiety, and reduced life satisfaction. The comorbidity is so robust that sexual health screening has been proposed as a standard component of general mental status examinations alongside mood, sleep, appetite, and concentration assessment.</p>
<p>Medication effects are another reason sexual health cannot remain siloed. Selective serotonin reuptake inhibitors (SSRIs) — among the most commonly prescribed psychiatric medications — carry a documented side effect profile that includes decreased libido, delayed orgasm, anorgasmia, and decreased genital sensation in a significant percentage of users. Studies report rates as high as 30-40 percent depending on the specific medication and dosage. Yet survey data shows that mental health prescribers routinely fail to discuss these effects proactively, and clients often do not report them because they assume the sexual change is a symptom of their depression rather than a consequence of its treatment. The clinical cost is treatment non-adherence: clients quietly stop medications that are helping their mood because the sexual side effects are intolerable, without ever telling their prescribing clinician. Therapists who ask about sexual health can catch this pattern and facilitate an informed conversation with the prescriber.</p>
<p>This course begins with this introductory section because the first and most important clinical skill in sexual health counseling is not a technique — it is permission. When a counselor normalizes sexual health as a topic that belongs in therapy, they give clients permission to bring what may be their most private and shame-laden concerns into the room. That permission, extended with warmth and without flinching, is often the most therapeutic thing that happens in the first session related to sexual health. Subsequent sections will build on this foundation with specific knowledge and skills for each major developmental period and clinical domain.</p>
<p>Before proceeding, take a moment to reflect on your own training history. How much formal instruction did you receive in sexual health? What messages did you receive — explicitly or implicitly — about whether sexuality was an appropriate topic for counseling? What assumptions do you carry about which clients are likely to have sexual health concerns, and what populations might you be less comfortable asking? These reflective questions are not merely pedagogical. Research shows that therapist discomfort with sexual topics is one of the strongest predictors of whether sexual health gets addressed in treatment — and therapist self-awareness about that discomfort is the first step toward managing it clinically rather than passing it to clients as shame by proxy.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'The Biopsychosocial-Spiritual Framework Applied to Sexual Health',
              content: `<p>The biopsychosocial-spiritual (BPSS) framework, which is foundational to integrative counseling practice, maps directly onto sexual health assessment. Biological factors include hormonal status (particularly testosterone, estrogen, and oxytocin), neurological function, vascular health, medication effects, chronic illness, pain conditions, and the physical sequelae of trauma. These factors are not solely the province of medicine — a counselor who understands how chronic pain affects desire or how hypothyroidism can mimic hypoactive sexual desire disorder is a better clinician and collaborator.</p>
<p>Psychological factors encompass attachment style, trauma history, mood and anxiety symptoms, body image, sexual self-concept, and the cognitive schemas (particularly shame-based schemas) that organize a person's relationship to their own sexuality. Sociocultural factors include cultural norms about gender roles and sexual behavior, religious messaging, family-of-origin communication about sex, peer influences, media exposure, and the cumulative effects of discrimination for those whose identities fall outside dominant-culture norms. Spiritual factors engage questions of meaning, value alignment, sacred sexuality traditions, guilt around religious prohibition, and the search for connection and transcendence that sexuality can serve. Comprehensive sexual health assessment addresses all four domains — not as a linear checklist, but as an interconnected system in which a change in any domain ripples through the others.</p>`
            },
            {
              title: 'PLISSIT Model: A Framework for Clinical Graduated Response',
              content: `<p>The PLISSIT model (Annon, 1976) organizes sexual health intervention into four levels of intensity, each appropriate for different clinician training levels. Permission (P) involves normalizing sexual health as a topic and creating space for clients to raise concerns — all counselors should operate at this level. Limited Information (LI) means providing accurate psychoeducation about normative sexual development, common concerns, and the biopsychosocial contributors to sexual health — also within general counselor scope. Specific Suggestions (SS) involves tailored recommendations for specific sexual concerns based on assessment — this level requires foundational training in sexual health. Intensive Therapy (IT) is specialized treatment delivered by a certified sex therapist for complex sexual dysfunction, paraphilic disorders, and sexual trauma with significant clinical impact.</p>
<p>This course focuses on building competency at the P and LI levels while providing enough conceptual grounding to identify presentations that require SS or IT level care. Importantly, PLISSIT is not a one-time decision tree — it is a dynamic framework that clinicians revisit throughout treatment as client needs evolve. A client who initially needs only Permission may progress to needing Limited Information, or they may disclose something in session three that reveals a need for Specific Suggestions and possible referral. The model supports counselors in scaling their response to the presenting complexity without overstepping competency boundaries.</p>`
            },
            {
              title: 'Sexual Health History Taking: Core Questions',
              content: `<p>Taking a sexual history does not require a comprehensive sexual intake battery at every first session. What it does require is that counselors develop comfort with a small set of opening questions that signal openness and create space for clients to share. Research-supported opening questions include: "Many people have questions or concerns about sexual health that come up during their life. Is that an area you'd like us to be able to talk about here?" and "As we think about your overall wellbeing, are there any aspects of your sexual health or intimate relationships that feel relevant to the work you want to do?"</p>
<p>For clients who respond affirmatively or who disclose concerns, follow-up questions assess onset, duration, context (relationship or solo), subjective distress, and prior help-seeking. Validated tools such as the Sexual Function Questionnaire (SFQ), the Female Sexual Function Index (FSFI), and the International Index of Erectile Function (IIEF) can be used as supplements, though clinical interview remains primary. The goal is not to complete a questionnaire — it is to understand the client's experience of their sexuality in their own words, using the language they choose, at a depth they find tolerable and useful.</p>`
            },
            {
              title: 'Documentation and Scope of Practice Considerations',
              content: `<p>Documentation of sexual health conversations follows the same principles as documentation of other sensitive clinical content: accurate, clinically relevant, and written with the awareness that the record may be reviewed by others, including the client. Avoid overly clinical or stigmatizing language. Note the client's own framing where possible. Document your clinical reasoning for referral, or for continuing treatment within your scope, explicitly — this protects you and establishes a clear clinical rationale.</p>
<p>Scope of practice in sexual health is determined by your license, your training, and your supervisory context. General counselors, social workers, and MFTs are within scope to take sexual histories, provide psychoeducation, and address the relational and psychological dimensions of common sexual concerns. They are outside scope to provide intensive sex therapy interventions (sensate focus protocol, directed masturbation, systematic desensitization for vaginismus) unless they hold additional certification. When in doubt, consultation with a colleague who holds AASECT certification or equivalent training is appropriate. Supervision records of those consultations should be maintained.</p>`
            },
            {
              title: 'Cultural Humility in Sexual Health Counseling',
              content: `<p>Cultural humility — distinguished from cultural competence by its emphasis on lifelong learning and self-reflection rather than the acquisition of a static knowledge set — is essential in sexual health counseling because cultural, religious, and community norms shape sexual values and behavior in profound ways. Clinicians who approach sexual health with a single standard of "healthy sexuality" risk pathologizing clients whose relationship to sexuality is culturally coherent even when it differs from Western, secular, liberal norms.</p>
<p>Cultural humility in sexual health means asking rather than assuming: "What does your family background say about sex? What messages did your community give you? What role does your faith play in how you understand your sexuality?" It means holding genuine uncertainty about what healthy sexuality looks like for a given client until their own framework is understood. It means being willing to learn from clients about traditions, values, and meanings around sexuality that differ from those in the clinical literature. And it means ongoing self-examination of the biases and assumptions that the clinician brings from their own cultural formation. This is not relativism — clinicians still hold ethical obligations around harm, consent, and client wellbeing. But those obligations are navigated through relationship and curiosity, not through imposition of dominant-culture sexual norms.</p>`
            }
          ]
        },
        {
          type: 'reflection',
          prompt: 'Reflect on your own training and practice history: When a client brings up a sexual concern in session, what do you notice in yourself — in your body, your emotional response, your clinical thinking? What training or support would increase your comfort and competence in this domain?'
        },
        {
          type: 'multipleChoice',
          question: 'According to the World Health Organization\'s definition, sexual health is best described as:',
          options: [
            { text: 'The absence of sexually transmitted infections and dysfunction', isCorrect: false },
            { text: 'A state of physical, emotional, mental and social well-being in relation to sexuality', isCorrect: true },
            { text: 'Healthy reproductive functioning and satisfying sexual activity', isCorrect: false },
            { text: 'Compliance with cultural and religious norms around sexual behavior', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The WHO definition is intentionally expansive, locating sexual health inside a biopsychosocial framework that encompasses well-being across physical, emotional, mental, and social domains — not merely the absence of disease or the presence of reproductive health.'
        },
        {
          type: 'multipleChoice',
          question: 'Which level of the PLISSIT model is within the scope of all licensed mental health counselors, regardless of specialty training?',
          options: [
            { text: 'Specific Suggestions (SS)', isCorrect: false },
            { text: 'Intensive Therapy (IT)', isCorrect: false },
            { text: 'Permission (P) and Limited Information (LI)', isCorrect: true },
            { text: 'Limited Information (LI) and Specific Suggestions (SS)', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'All licensed counselors should be able to operate at the Permission and Limited Information levels — normalizing sexual health as a clinical topic and providing accurate psychoeducation. Specific Suggestions and Intensive Therapy require additional specialized training.'
        }
      ]
    },

    {
      title: 'Sexual Health Across the Lifespan: Developmental Frameworks',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Sexual Health Across the Lifespan: Developmental Frameworks',
          subtitle: 'Understanding normative sexual development from adolescence through older adulthood',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>Sexual development is not a single event or a brief adolescent passage — it is a lifelong process, shaped by biological maturation, relational experience, cultural context, and the accumulation of meaning that each person builds around their own sexuality over decades. Counselors who understand normative sexual development are better positioned to identify what falls outside that range, to communicate with clients about their experiences without inadvertently pathologizing the ordinary, and to contextualize sexual concerns within the broader developmental arc of a client's life. This section surveys key sexual health milestones and clinical considerations across four developmental periods: adolescence, emerging and young adulthood, midlife, and later life.</p>
<p>Adolescence (approximately ages 10-18) is the period of primary biological sexual development: puberty, the emergence of sexual desire, the formation of sexual identity, and the beginning of sexual behavior for many individuals. Pubertal timing has clinical relevance — early-maturing girls in particular show elevated risk for depression, disordered eating, and early sexual debut, a pattern amplified when early maturation occurs in contexts with limited adult support and high peer pressure. For counselors working with adolescents, awareness of pubertal status and its psychological consequences is foundational. Conversations about body changes, desire, and identity belong in adolescent counseling — conducted in age-appropriate ways and with careful attention to what the adolescent finds helpful versus intrusive.</p>
<p>Identity formation is a central developmental task of adolescence, and for LGBTQ+ youth, sexual and gender identity development carries additional complexity and risk. Minority stress research consistently documents that LGBTQ+ adolescents experience elevated rates of depression, anxiety, substance use, suicidality, and homelessness relative to heterosexual, cisgender peers — and that these disparities are substantially mediated by family rejection, school bullying, and internalized stigma rather than by sexual orientation or gender identity itself. Affirming family relationships and affirming counselors dramatically reduce these outcomes. A counselor who can hold a warm, curious, non-anxious presence around questions of sexual orientation and gender identity may be the most protective factor in an LGBTQ+ adolescent's life. This is not a peripheral clinical skill — it is a core harm reduction intervention.</p>
<p>The period of emerging and young adulthood (approximately ages 18-35) involves ongoing sexual identity consolidation, the development of intimate relationships, navigating sexual debut (for those who have not yet had sexual experience), and increasingly, the integration of sexual experience with relational and life values. This period also sees first presentations of many sexual dysfunctions, including premature ejaculation in young men (often anxiety-driven), difficulty with orgasm in young women (often related to inexperience, insufficient stimulation awareness, or shame), and sexual pain disorders including vaginismus and vulvodynia. Early sexual trauma may surface in this period as individuals attempt intimacy and encounter unexpected emotional or physiological responses. The therapeutic task is neither to pathologize these presentations nor to dismiss them, but to provide accurate psychoeducation and, where indicated, appropriate clinical support.</p>
<p>Midlife (approximately ages 35-60) brings hormonal transitions — perimenopause and menopause for people with ovaries, gradual testosterone decline and changes in erectile and ejaculatory function for people with testes — that have direct effects on sexual functioning. These biological changes are significant, but research consistently shows they do not need to end satisfying sexual lives. What matters clinically is whether the individual (and their partner, if partnered) receives accurate information about these changes, whether they interpret the changes as pathological loss or as a normal transition requiring adaptation, and whether they have the relational and communication skills to navigate change in their intimate lives. Counselors who can provide accurate psychoeducation about midlife sexual transitions — and who can help clients grieve real losses while orienting toward continued possibility — provide enormous clinical value.</p>
<p>Later life (ages 60 and beyond) remains the most neglected developmental period in sexual health clinical training, and the most underserved in clinical practice. Studies consistently find that sexual interest and activity persist well into the eighth and ninth decades of life for many people, yet older adults are systematically desexualized by healthcare systems, family assumptions, and institutional environments. The clinical consequences are significant: unaddressed sexual concerns in older adults contribute to depression, relationship distress, and reduced quality of life. Counselors who assume their older clients are not sexual, or who feel uncomfortable addressing sexuality with older adults, are practicing in a way that fails this population. Special considerations in later life include the impact of chronic illness and medication on sexual function, the experience of loss and re-partnering in widowhood, the unique needs of older LGBTQ+ adults who came of age before civil rights protections, and the intersection of cognitive decline with sexual autonomy and consent capacity.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Sexual Development Across the Lifespan: A Clinical Overview',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_sexual_development_lifespan',
          description: 'This video provides a clinical overview of normative sexual development milestones across the lifespan, with particular attention to how developmental stage shapes both presenting concerns and clinical approach in counseling practice.',
          accessibility: { ariaLabel: 'Video: Sexual Development Across the Lifespan', role: 'complementary' }
        },
        {
          type: 'imageText',
          content: `<p>The developmental model of sexual health recognizes that each life stage brings specific biological, psychological, and relational tasks related to sexuality. For clinicians, developmental awareness serves as both a framework for normalizing client experiences and a template for identifying when a presentation diverges from developmental expectation in clinically significant ways. The key clinical principle is that sexual health is not a destination reached at some ideal point — it is a continuous process of integration, adaptation, and meaning-making across a changing body, mind, and relational context.</p>
<p>Research from the Global Study of Sexual Attitudes and Behaviors, which surveyed over 27,000 men and women across 29 countries, found that sexual satisfaction was predicted less by frequency of sexual activity than by emotional closeness with a partner, physical pleasure during sexual activity, and the absence of sexual problems that caused personal distress. This finding is clinically significant: it suggests that sexual health interventions should target quality and meaning rather than frequency, and that relational intimacy is often the more powerful leverage point than sexual technique or function per se. It also underscores the importance of distinguishing between sexual concerns that cause subjective distress versus those that simply diverge from statistical norms but are experienced by the client as perfectly acceptable.</p>`,
          image: '',
          imageAlt: 'Diagram showing sexual health developmental tasks across adolescence, young adulthood, midlife, and later life',
          imagePosition: 'right',
          highlight: false
        },
        {
          type: 'flashcardDeck',
          title: 'Sexual Health Milestones and Clinical Considerations by Developmental Stage',
          cards: [
            { front: 'Adolescence (10-18): Primary sexual development task', back: 'Pubertal maturation, emergence of sexual desire, sexual identity formation, and navigation of early relational and sexual experience within a peer and family context' },
            { front: 'Why does early pubertal timing matter clinically?', back: 'Early-maturing girls are at elevated risk for depression, disordered eating, and early sexual debut. Context moderates risk — early maturation in low-support environments is especially concerning.' },
            { front: 'LGBTQ+ adolescent risk factors: what drives elevated mental health disparities?', back: 'Minority stress research shows disparities are mediated primarily by family rejection, school bullying, and internalized stigma — NOT by sexual orientation or gender identity itself. Affirming relationships are the primary protective factor.' },
            { front: 'Emerging adulthood (18-35): Common sexual health presentations', back: 'Premature ejaculation (often anxiety-driven), difficulty with orgasm (often related to shame or insufficient stimulation awareness), sexual pain disorders (vaginismus, vulvodynia), and first surfacing of sexual trauma responses' },
            { front: 'Midlife sexual transitions: what drives change?', back: 'Hormonal changes — perimenopause/menopause in people with ovaries; gradual testosterone decline and changes in erectile/ejaculatory function in people with testes. Both respond well to accurate information, relational adaptation, and sometimes medical support.' },
            { front: 'What does research show about sexual satisfaction in midlife and later life?', back: 'Satisfaction is predicted by emotional closeness, physical pleasure, and absence of distressing problems — not frequency. Sexual health work in midlife targets quality and relational intimacy more than function restoration.' },
            { front: 'Later life (60+): Most common clinical error by counselors', back: 'Assuming older clients are not sexual (desexualization). Studies show sexual interest and activity persist into the 8th and 9th decades. Failing to ask fails this population.' },
            { front: 'What special considerations apply to older LGBTQ+ adults in sexual health counseling?', back: 'They came of age before civil rights protections, may have experienced decades of legal persecution, often have complicated histories with healthcare systems that pathologized their identities, and face compound minority stress from both ageism and heterosexism/transphobia.' },
            { front: 'Global Study of Sexual Attitudes and Behaviors: key finding for clinical practice', back: 'Sexual satisfaction is predicted by emotional closeness, physical pleasure, and absence of distressing problems — not frequency. Target quality and relational intimacy, not frequency metrics.' },
            { front: 'How does the PLISSIT model apply across developmental stages?', back: 'Permission and Limited Information are appropriate at all stages. The specific content of psychoeducation varies by developmental period. Adolescents need different LI content than midlife adults. The framework is consistent; the clinical knowledge applied within it is stage-specific.' }
          ],
          accessibility: { ariaLabel: 'Flashcard deck on sexual health milestones by developmental stage', role: 'application' }
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each developmental period with its primary sexual health clinical consideration.',
          matchingPairs: [
            { term: 'Adolescence', definition: 'Identity formation, pubertal adjustment, affirming support for LGBTQ+ youth, early sexual experience navigation' },
            { term: 'Emerging adulthood (18-35)', definition: 'Sexual debut, relationship formation, first presentations of dysfunction, early trauma surfacing' },
            { term: 'Midlife (35-60)', definition: 'Hormonal transitions, adapting to physiological changes, relational renegotiation, chronic illness effects' },
            { term: 'Later life (60+)', definition: 'Countering desexualization, widowhood and re-partnering, LGBTQ+ elder needs, cognitive decline and consent capacity' }
          ]
        },
        {
          type: 'multipleChoice',
          question: 'Research on minority stress and LGBTQ+ adolescent mental health consistently shows that elevated rates of depression and suicidality in this population are primarily caused by:',
          options: [
            { text: 'Sexual orientation or gender identity itself', isCorrect: false },
            { text: 'Family rejection, school bullying, and internalized stigma', isCorrect: true },
            { text: 'Biological predispositions associated with sexual minority status', isCorrect: false },
            { text: 'Peer pressure to disclose sexual identity prematurely', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Minority stress research is clear: it is not sexual orientation or gender identity itself that drives poor mental health outcomes, but the social stressors of rejection, bullying, and internalized stigma. This is a critical clinical point because it locates the intervention at the social/environmental level, not at the level of identity change.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are evidence-based predictors of sexual satisfaction across the lifespan? (Select all that apply)',
          options: [
            { text: 'Frequency of sexual activity', isCorrect: false },
            { text: 'Emotional closeness with a partner', isCorrect: true },
            { text: 'Physical pleasure during sexual activity', isCorrect: true },
            { text: 'Absence of sexual problems causing personal distress', isCorrect: true },
            { text: 'Number of lifetime sexual partners', isCorrect: false }
          ],
          explanation: 'The Global Study of Sexual Attitudes and Behaviors found that sexual satisfaction is predicted by emotional closeness, physical pleasure, and absence of distressing problems — not by frequency or partner count. This shifts clinical intervention toward quality and relational factors.'
        }
      ]
    },

    {
      title: 'Assessment: Tools, Frameworks, and Clinical Language',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Assessment: Tools, Frameworks, and Clinical Language',
          subtitle: 'Evidence-based approaches to sexual health assessment in general counseling practice',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>Assessment is the foundation of all clinical intervention, and sexual health assessment is no different. The challenge for general counselors approaching sexual health assessment is threefold: many lack training in the specific tools and frameworks designed for this domain; many carry personal and professional discomfort that shapes how questions get asked (or avoided); and the available literature is fragmented across sexology, medicine, psychology, and public health in ways that make it difficult to navigate without a guide. This section provides a clinically grounded, practically oriented framework for sexual health assessment that general counselors can implement within their existing scope of practice.</p>
<p>The foundation of sexual health assessment is permission-giving and relationship. Before a client will disclose sexual concerns to a therapist, they need to believe that the therapist wants to hear it, can hold it without judgment, and has the clinical capacity to do something useful with what they share. This means that assessment technique matters less than therapeutic alliance in most cases. A counselor who asks a validated screening question with visible discomfort, or who rushes past the answer, will learn less than a counselor who says simply, "I like to make sure we're covering all the dimensions of your wellbeing — is there anything about your sexual health or intimate life that's been on your mind?" and then waits, with genuine interest, for what comes next.</p>
<p>With that relational foundation established, structured assessment tools can add significant clinical value. For general screening, the sexual health dimension of a comprehensive mental status examination can include a brief inquiry: "Have you noticed any changes in your interest in sex or your intimate relationships?" For clients who identify concerns, validated instruments allow for more systematic assessment. The Sexual Function Questionnaire (SFQ-28) is a brief, gender-inclusive measure covering desire, arousal, orgasm, sexual pain, and satisfaction. The Female Sexual Function Index (FSFI) provides detailed assessment of female sexual function across six domains. The International Index of Erectile Function (IIEF) assesses erectile function and sexual satisfaction for people with penises. The Golombok-Rust Inventory of Sexual Satisfaction (GRISS) evaluates sexual satisfaction in partnered relationships. Each of these instruments has established psychometric properties, though all were developed primarily with heterosexual, cisgender, white adult samples — a limitation that counselors should name to clients and hold critically when interpreting results with diverse populations.</p>
<p>Beyond dysfunction-focused instruments, sexual health assessment in counseling often benefits from narrative inquiry — open-ended questions designed to elicit the client's own framework and experience. "What does a satisfying sexual relationship look like to you?" invites the client's values into the conversation. "What messages did you receive growing up about sex?" opens the family-of-origin dimension. "How has your relationship to your own sexuality changed over time?" honors the developmental dimension. "When you think about your sexual self, what feels good and what feels like it needs attention?" allows the client to set the agenda. These narrative questions often yield richer and more clinically relevant information than standardized questionnaires, particularly in early assessment. They also signal the therapist's interest in the whole person, not just the dysfunction.</p>
<p>Assessment should also address the impact dimension: how much distress is the sexual concern causing, and how much is it impacting functioning? DSM-5-TR diagnostic criteria for sexual dysfunctions require that symptoms be present for at least six months, occur in approximately 75-100 percent of sexual encounters, and cause clinically significant distress. The distress criterion is particularly important: a person who has low sexual desire but experiences no distress and whose relationship is not impacted does not have hypoactive sexual desire disorder — they have a variant of normative desire that may or may not match their partner's. A counselor who labels this as a disorder without attending to the client's own subjective experience does clinical harm. Assessment must always ask: whose standard are we applying, and is this person actually suffering?</p>
<p>A complete sexual health assessment in general counseling also attends to safety. Sexual health and intimate partner violence frequently co-occur — research shows that sexual coercion and IPV overlap significantly, and that sexual concerns may be a presenting screen behind which violence is occurring. Trauma history screening that includes sexual trauma is standard of care in mental health intake. When sexual trauma is identified, assessment shifts to trauma-informed frameworks: understanding trauma responses in the sexual context, distinguishing between trauma-related sexual symptoms (hyperarousal, avoidance, intrusion) and primary sexual dysfunctions, and assessing for PTSD comorbidity that will require integrated treatment. The counselor's response to sexual trauma disclosure is itself therapeutic — a warm, grounded, non-reactive presence that communicates "I believe you and I can handle this" is clinically significant.</p>`
        },
        {
          type: 'scenarioTree',
          title: 'Clinical Scenario: Sexual Health Disclosure in an Intake Session',
          description: 'A 34-year-old woman named Maya has come to counseling presenting with "relationship stress." During the intake, she mentions that she and her partner "have been having some issues in the bedroom." How do you proceed?',
          nodes: [
            {
              id: 'start',
              text: 'Maya mentions "some issues in the bedroom" during intake. What is your first clinical response?',
              choices: [
                { text: 'Note it and move on — you\'ll address it when the relationship issues become clearer', nextId: 'avoid' },
                { text: 'Ask a brief, warm follow-up to signal openness and gather more information', nextId: 'open' },
                { text: 'Immediately administer an FSFI screening tool to assess sexual function', nextId: 'jump' }
              ]
            },
            {
              id: 'avoid',
              text: 'You note it and move on. Three sessions later, Maya discloses that the relationship stress is almost entirely about sexual concerns — her partner pressures her for sex she doesn\'t want. She waited to see if you were safe to tell. What does this teach us?',
              isEnd: true
            },
            {
              id: 'open',
              text: 'You say, "I\'m glad you mentioned that — can you tell me a little more about what those issues look like?" Maya pauses, then shares that she has been experiencing pain during intercourse for about a year but has been afraid to bring it up. She\'s relieved you asked. What comes next?',
              choices: [
                { text: 'Provide immediate reassurance that this is very common and treatable', nextId: 'reassure' },
                { text: 'Validate her relief, assess impact and duration, and explore what she wants from addressing this concern', nextId: 'validate' }
              ]
            },
            {
              id: 'jump',
              text: 'Maya looks startled and uncomfortable with the formal questionnaire in session one. She fills it out but provides minimal information. The therapeutic alliance takes a hit. What went wrong?',
              isEnd: true
            },
            {
              id: 'reassure',
              text: 'Immediate reassurance before you have enough information risks minimizing Maya\'s experience or providing inaccurate information. Better to understand her experience fully first. What would be a stronger response to her disclosure?',
              isEnd: true
            },
            {
              id: 'validate',
              text: 'You validate her relief, ask about how long this has been happening, how much distress it\'s causing, and what she hopes to gain from addressing it. Maya shares that she has vulvodynia — diagnosed six months ago by her gynecologist but never addressed because she didn\'t know therapy could help. You identify this as a biopsychosocial presentation requiring collaboration with her medical provider and possible referral for pelvic floor physical therapy. This is excellent clinical assessment. The key: follow, validate, assess impact, then plan.',
              isEnd: true
            }
          ],
          accessibility: { ariaLabel: 'Clinical scenario: responding to sexual health disclosure in intake', role: 'application' }
        },
        {
          type: 'text',
          content: `<p>Cultural considerations in assessment are not an add-on — they are integral to assessment validity. When clinicians use instruments normed on Western, white, heterosexual samples with clients from different cultural backgrounds, they risk misinterpreting normal cultural variation as pathology. For example, cultural norms around female sexuality in some communities specify that women should not experience or express desire actively — a presentation that might score in the clinically concerning range on a desire-focused instrument is actually culturally concordant for some clients. This does not mean we don't address sexual health with these clients; it means we hold assessment findings tentatively, explore meaning with the client, and distinguish between what is causing distress versus what is merely different from the normative sample.</p>
<p>Trauma-informed sexual health assessment deserves special attention because of the high prevalence of sexual trauma in mental health populations and the profound ways that trauma reorganizes the sexual response system. The Window of Tolerance framework (Siegel, 1999; Ogden, 2006) is particularly useful: trauma responses in sexual contexts often involve either hyperarousal (anxiety, hypervigilance, startle responses, pain amplification) or hypoarousal (dissociation, numbness, desire absence, emotional flatness during sexual activity) that reflects the nervous system's defensive response rather than primary dysfunction of desire or arousal. Helping clients understand these responses as adaptive trauma responses — rather than as evidence that they are broken or that intimacy is inherently dangerous — is a central psychoeducational task in trauma-informed sexual health counseling.</p>
<p>Assessment should also encompass the relational context when the client is partnered. Research on sexual satisfaction consistently identifies relational factors — communication quality, emotional safety, trust, and mutual investment in sexual wellbeing — as more powerful predictors of long-term sexual satisfaction than individual sexual function. This means that even when a client presents with what appears to be an individual dysfunction, assessment of the relational context is essential. A client who has low arousal in the context of a relationship where they don't feel emotionally safe has a relational problem, not a primary arousal disorder. A client who experiences premature ejaculation consistently in their current relationship but not in previous relationships may be experiencing performance anxiety specific to relational dynamics. These distinctions matter enormously for treatment planning.</p>
<p>Finally, assessment must be ongoing rather than a one-time intake activity. Sexual health concerns evolve across the course of treatment. Clients who could not name a sexual concern in session one may be able to in session eight when the therapeutic alliance is stronger. Life changes — new relationships, pregnancy, illness, medication changes, menopause, bereavement — introduce new sexual health considerations throughout treatment. Incorporating a brief check-in about sexual health into periodic treatment reviews ("As we look at how things are going across different areas of your life, how is your sexual health and intimate life?") maintains the thread of attention to this dimension across the full course of counseling.</p>`
        },
        {
          type: 'cardSort',
          instructions: 'Sort each assessment approach into the correct category: Appropriate for General Counselors or Requires Specialist Training.',
          categories: ['Appropriate for General Counselors', 'Requires Specialist Training'],
          items: [
            { text: 'Asking open-ended questions about sexual health concerns at intake', category: 'Appropriate for General Counselors' },
            { text: 'Providing psychoeducation about normative sexual development', category: 'Appropriate for General Counselors' },
            { text: 'Administering validated sexual function questionnaires', category: 'Appropriate for General Counselors' },
            { text: 'Conducting sensate focus therapy for sexual dysfunction', category: 'Requires Specialist Training' },
            { text: 'Assessing impact and distress related to a reported sexual concern', category: 'Appropriate for General Counselors' },
            { text: 'Providing directed masturbation instructions for anorgasmia treatment', category: 'Requires Specialist Training' },
            { text: 'Referring to pelvic floor physical therapy for sexual pain disorders', category: 'Appropriate for General Counselors' },
            { text: 'Systematic desensitization protocol for vaginismus', category: 'Requires Specialist Training' },
            { text: 'Screening for sexual trauma history in mental health intake', category: 'Appropriate for General Counselors' },
            { text: 'Psychopharmacological management of medication-induced sexual side effects', category: 'Requires Specialist Training' },
            { text: 'Exploring cultural and family-of-origin messages about sexuality', category: 'Appropriate for General Counselors' },
            { text: 'Providing intensive sex therapy for paraphilic disorders', category: 'Requires Specialist Training' }
          ],
          accessibility: { ariaLabel: 'Card sort: general counselor versus specialist sexual health assessment approaches', role: 'application' }
        },
        {
          type: 'fillInBlank',
          title: 'Assessment Framework Completion Exercise',
          blanks: [
            { prompt: 'DSM-5-TR sexual dysfunction diagnoses require that symptoms are present for at least ___ months and occur in approximately ___-100% of sexual encounters, and cause clinically significant ___.',  answer: 'six; 75; distress', acceptAlternates: ['6; 75; distress'] },
            { prompt: 'The PLISSIT model acronym stands for: ___, Limited Information, Specific Suggestions, and ___.', answer: 'Permission; Intensive Therapy', acceptAlternates: [] },
            { prompt: 'In trauma-informed sexual health assessment, the ___ framework helps distinguish hyperarousal and hypoarousal responses as adaptive ___ responses rather than primary sexual dysfunction.', answer: 'Window of Tolerance; trauma', acceptAlternates: [] }
          ]
        },
        {
          type: 'multipleChoice',
          question: 'A client reports that she rarely experiences sexual desire and has never found this distressing. Her long-term partner has similar low desire and they have a satisfying intimate relationship. What is the most accurate clinical interpretation?',
          options: [
            { text: 'She meets criteria for hypoactive sexual desire disorder (HSDD) and should be referred for sex therapy', isCorrect: false },
            { text: 'She has a normative variant of desire that does not meet DSM-5-TR criteria because it does not cause clinically significant distress', isCorrect: true },
            { text: 'She should be screened for depression, which commonly causes low desire', isCorrect: false },
            { text: 'She likely has unresolved sexual trauma that is suppressing desire', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'DSM-5-TR requires clinically significant distress as a diagnostic criterion for sexual dysfunctions. A client who experiences low desire without distress and within a satisfying relational context does not have a disorder — they have a desire profile that is normative for them. Labeling this as pathology without attending to the client\'s subjective experience is a clinical error.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are components of a trauma-informed approach to sexual health assessment? (Select all that apply)',
          options: [
            { text: 'Distinguishing trauma-related sexual symptoms from primary sexual dysfunctions', isCorrect: true },
            { text: 'Immediately asking detailed questions about sexual trauma history in session one', isCorrect: false },
            { text: 'Understanding the Window of Tolerance and how it applies to sexual response', isCorrect: true },
            { text: 'Responding to disclosure with a warm, grounded, non-reactive presence', isCorrect: true },
            { text: 'Screening for PTSD comorbidity when sexual trauma is identified', isCorrect: true }
          ],
          explanation: 'Trauma-informed sexual health assessment integrates understanding of trauma responses in sexual contexts, attends to nervous system regulation, maintains a non-reactive therapeutic presence, and assesses for comorbid PTSD. Detailed trauma questioning in session one without established safety is contraindicated and can be retraumatizing.'
        }
      ]
    },

    {
      title: 'Common Sexual Health Presentations and Psychoeducational Approaches',
      order: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Common Sexual Health Presentations and Psychoeducational Approaches',
          subtitle: 'Recognizing clinical patterns and delivering evidence-based psychoeducation',
          sectionNumber: 4
        },
        {
          type: 'text',
          content: `<p>General counselors who ask about sexual health will encounter a range of presentations, and having a working framework for the most common ones is essential for providing competent care. This section surveys the sexual health concerns most frequently encountered in general counseling practice, organized around what a counselor needs to know about each: what it looks like, what its biopsychosocial contributors are, what psychoeducational content is most helpful, and when to refer. This is not a comprehensive clinical manual for sex therapy; it is a practitioner's field guide for the front-line counselor who encounters sexual health in the general practice setting.</p>
<p>Desire discrepancy — the experience of partners having meaningfully different levels of sexual desire — is likely the single most common sexual health presenting concern in couples counseling, and it is common as a relational stressor in individual counseling as well. Research estimates that desire discrepancy is present in 80 percent or more of long-term relationships at some point, making it normative rather than pathological as a phenomenon. What varies is how couples respond to it. Couples who avoid direct discussion of desire differences, who attribute them to character flaws or relationship failure, or who engage in an escalating cycle of approach-withdraw around sexual initiation, are likely to experience significant relational distress. Psychoeducational content that normalizes desire discrepancy as a relational management challenge rather than a medical diagnosis or relationship failure often produces rapid reduction in shame and opens space for the collaborative problem-solving that effective resolution requires.</p>
<p>Low sexual desire affecting one or both individuals is a distinct but related presentation. In DSM-5-TR, this can reach diagnostic threshold as Female Sexual Interest/Arousal Disorder (in people with vulvas) or Male Hypoactive Sexual Desire Disorder (in people with penises) when symptoms are persistent, pervasive, and cause clinically significant distress. The biopsychosocial contributors to low desire are extensive: hormonal factors (particularly low testosterone, hypothyroidism, and the hypoestrogenism of menopause); medication effects (SSRIs, antipsychotics, hormonal contraceptives, opioids, and others); psychological factors (depression, anxiety, body image disturbance, sexual shame, and history of trauma); relational factors (unresolved conflict, emotional disconnection, inadequate non-sexual intimacy, and accumulated resentment); and contextual factors (stress, fatigue, parenting demands, and insufficient sexual privacy). Psychoeducation that helps clients identify which of these contributors is most active for them — and that names desire as responsive (requiring conditions) rather than spontaneous (arising independently of context) for many people — is often transformative.</p>
<p>Sexual pain disorders, which include vulvodynia, vaginismus (now termed genito-pelvic pain/penetration disorder in DSM-5-TR), and dyspareunia, affect a significant minority of people with vulvas across the lifespan and represent one of the most undertreated domains in sexual health care. Research suggests that vulvodynia affects 8-16 percent of women at some point in their lives, yet the average person with this condition waits 2-7 years and sees multiple providers before receiving an accurate diagnosis. The psychological sequelae of chronic sexual pain — anxiety anticipating pain, avoidance of intimacy, shame, and relationship strain — are substantial and frequently require both medical and psychological treatment. Counselors who understand this condition can validate client experiences, provide accurate psychoeducation about biopsychosocial contributors (which include central sensitization, pelvic floor hypertonicity, and anxiety-pain amplification cycles), and facilitate referral to the interdisciplinary team of gynecologists, pelvic floor physical therapists, and sex therapists that best-practice management requires.</p>
<p>Orgasm difficulties are among the most commonly reported sexual concerns, particularly among people with vulvas. Research suggests that approximately 70-80 percent of women require direct clitoral stimulation to reach orgasm and do not reliably orgasm from penetration alone — a finding that remains poorly understood even among many clients who experience it as a dysfunction or inadequacy. Psychoeducation that normalizes clitoral anatomy, provides accurate information about the orgasm gap and its sociocultural contributors, and addresses the shame-laden internalized narrative that "something is wrong with me" can be powerfully corrective. For clients who have never experienced orgasm (primary anorgasmia), referral to a sex therapist who can provide the directed masturbation and graduated self-stimulation exercises of established anorgasmia treatment protocols may be appropriate — these are beyond the scope of general counseling but can be explained and normalized by a general counselor who understands the treatment.</p>
<p>Medication-induced sexual dysfunction is common and frequently underdisclosed. SSRIs and SNRIs affect sexual function in a significant percentage of users, primarily by reducing desire, delaying or eliminating orgasm, and decreasing genital sensitivity. Antipsychotics elevate prolactin, which suppresses sexual desire. Opioids reduce testosterone. Beta-blockers are associated with erectile dysfunction. Hormonal contraceptives are associated with decreased libido in some users. Counselors cannot prescribe or adjust medications, but they can do three clinically important things: ask routinely about sexual side effects from medications; validate clients' experiences when these effects are present; and facilitate informed conversation with prescribing providers by helping clients articulate their concerns and understand that medication adjustments are often possible. Many clients quietly discontinue psychiatric medications because of sexual side effects rather than discuss them with their prescriber — counselors can interrupt this pattern.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Psychoeducation for Desire Discrepancy: Key Messages',
              content: `<p>Evidence-based psychoeducation for desire discrepancy begins with normalization: research shows that desire discrepancy is present in the majority of long-term relationships at some point, and it does not indicate relationship failure or incompatibility. The key shift is from framing desire difference as a problem to be fixed to framing it as a relational dynamic to be navigated. Clinical research by Emily Nagoski and others distinguishes between "spontaneous desire" — desire that arises without specific stimulation or context — and "responsive desire" — desire that emerges in response to arousal or intimacy cues. Many people, particularly but not exclusively women, have primarily responsive rather than spontaneous desire, meaning they do not experience desire before sexual activity begins but do experience it once arousal is initiated. Understanding this distinction can dramatically reduce shame and reframe what "wanting sex" looks like.</p>
<p>Additional psychoeducation addresses the role of non-sexual intimacy in creating conditions for desire, the importance of partner behavior in generating the safety that responsive desire requires, and the relationship between stress, fatigue, and desire. Couples benefit from understanding that desire-building activities are relational rather than purely individual — creating conditions for desire to emerge (emotional connection, non-demand physical affection, stress reduction, adequate sleep and nutrition) is a shared project. This psychoeducation can often be delivered at the LI level by a general counselor and does not require sex therapy specialization.</p>`
            },
            {
              title: 'Sexual Pain Disorders: What Counselors Need to Know',
              content: `<p>Genito-pelvic pain/penetration disorder (GPPPD) encompasses the previously separate diagnoses of vaginismus and dyspareunia. The key features are: persistent or recurrent difficulty with penetration, marked vulvovaginal or pelvic pain during penetration or penetration attempts, marked fear or anxiety about pain, and/or marked tensing or tightening of the pelvic floor muscles. The biopsychosocial contributors include pelvic floor hypertonicity (often treatable with physical therapy), central sensitization (in which the nervous system has generalized to anticipate pain in contexts associated with previous pain), trauma history, anxiety, and relational factors.</p>
<p>Counselors working with clients who have sexual pain should understand that best-practice treatment is interdisciplinary: gynecological evaluation to rule out or address organic contributors, pelvic floor physical therapy as a primary treatment for hypertonicity and pain-avoidance cycles, and psychological treatment for anxiety, trauma, and relational dimensions. Sex therapy-level interventions such as progressive vaginal dilation with relaxation and sensate focus are typically needed for full resolution. The counselor's role is to validate the experience, provide accurate psychoeducation, address the shame and relationship distress that often accompany this condition, and facilitate appropriate referral. Clients often feel profound relief when they learn that this is a recognized condition with effective treatment — that relief is itself therapeutic.</p>`
            },
            {
              title: 'Addressing the "Orgasm Gap" in Psychoeducation',
              content: `<p>The "orgasm gap" refers to the well-documented disparity in orgasm rates during partnered sex between men and heterosexual women — a gap that is substantially smaller in lesbian sexual relationships, suggesting that the gap is not anatomically inevitable but is shaped by cultural and relational factors. Research shows heterosexual women orgasm approximately 65% of the time during sex compared to 95% for heterosexual men, with the discrepancy largely explained by the undervaluing of clitoral stimulation in cultural scripts about "sex" that center penetration as the primary or definitive sexual act.</p>
<p>Counselors can provide psychoeducation that: accurately names clitoral anatomy (many adults have significant gaps in accurate anatomical knowledge despite believing otherwise); normalizes the finding that the majority of people with vulvas do not reliably orgasm from penetration alone; validates clients' experiences without framing them as dysfunction; and supports client communication with partners about what feels good. For clients who are experiencing significant distress around orgasm difficulty, psychoeducation also covers the anxiety-arousal interference cycle: performance anxiety about orgasm directly suppresses the parasympathetic nervous system activation that arousal requires, creating a self-defeating loop that can be interrupted with mindfulness-based and self-compassion approaches.</p>`
            },
            {
              title: 'Compulsive Sexual Behavior: Assessment and Psychoeducation',
              content: `<p>Compulsive sexual behavior disorder (CSBD) appears in ICD-11 as an impulse control disorder characterized by persistent failure to control intense, repetitive sexual impulses or urges resulting in repetitive sexual behavior. The DSM-5-TR did not include it, a decision reflecting ongoing scientific debate about its validity as a distinct diagnostic category versus a manifestation of hypersexuality as a symptom of other conditions (bipolar disorder, ADHD, OCD, or substance use disorders). This diagnostic ambiguity has clinical implications: counselors should be cautious about rapid labeling of high sexual interest as disordered, and should assess whether the presentation meets the ICD-11 threshold of clinically significant impairment or distress, is not better explained by another condition, and involves the ego-dystonic quality (distress about the behavior itself) that distinguishes CSBD from high but unproblematic sexual interest.</p>
<p>Psychoeducation for clients who are concerned about their own sexual behavior patterns covers the distinction between high desire (not inherently pathological), compulsive behavior (driven by difficulty regulating distressing urges), and values-inconsistent behavior (behavior that conflicts with the client's own values, religious beliefs, or relationship commitments, which may cause distress without meeting diagnostic threshold). Helping clients clarify which of these applies to them is an important clinical task that precedes any treatment planning.</p>`
            },
            {
              title: 'When to Refer: Clinical Indications for Sex Therapy Specialist Referral',
              content: `<p>General counselors should maintain an active referral network that includes AASECT-certified sex therapists and sex-positive mental health professionals. Referral is indicated when: the presenting sexual concern requires intensive therapy interventions beyond the P and LI PLISSIT levels; the counselor does not have adequate training in a specific area (e.g., paraphilic disorders, sexual trauma with significant clinical complexity, or sexual health in the context of gender transition); the client has a medical component requiring interdisciplinary coordination that the counselor cannot effectively facilitate; or there is a persistent lack of progress despite appropriate psychoeducational work at the general counselor level.</p>
<p>Referral does not necessarily mean termination — in many cases, continued counseling addressing relational, attachment, and psychological dimensions can proceed concurrently with specialized sex therapy or pelvic floor physical therapy. The counselor's role in the interdisciplinary team is to hold the psychological and relational dimensions while specialists address their specific domains. When making referrals, provide clients with specific names where possible rather than "find a sex therapist" — the AASECT therapist locator is the appropriate resource. Brief clients on what sex therapy involves, because many clients carry misconceptions (that it involves physical contact, or that it requires sexual activity in session) that create unnecessary barriers to follow-through.</p>`
            }
          ]
        },
        {
          type: 'sequencing',
          instructions: 'Place these steps in the correct order for a counselor responding to a client who discloses erectile dysfunction that has been affecting his relationship for the past year.',
          steps: [
            { text: 'Validate the client\'s experience and normalize that this is a common concern many men face', order: 1 },
            { text: 'Assess the onset, frequency, context, and subjective distress level of the presenting concern', order: 2 },
            { text: 'Explore biopsychosocial contributors: medical conditions, medications, anxiety, relational factors, and sleep', order: 3 },
            { text: 'Provide psychoeducation about the anxiety-arousal interference cycle and performance anxiety', order: 4 },
            { text: 'Discuss the relational impact and assess partner involvement in treatment if appropriate', order: 5 },
            { text: 'Determine whether medical evaluation, sex therapy referral, or continued general counseling work is indicated', order: 6 }
          ],
          explanation: 'This sequence follows the biopsychosocial assessment framework: establish safety and normalize, then systematically assess biological-psychological-social contributors before determining treatment direction. Jumping to referral or psychoeducation before completing assessment misses contributors that may change the clinical picture.'
        },
        {
          type: 'multipleChoice',
          question: 'A client reports that he has low interest in sex and has been taking escitalopram for depression for three months. He attributes his low desire entirely to his depression. The most clinically appropriate response is:',
          options: [
            { text: 'Agree with his attribution and focus treatment on resolving the depression', isCorrect: false },
            { text: 'Assess whether the low desire predated the medication and provide psychoeducation about SSRI sexual side effects as a possible contributor', isCorrect: true },
            { text: 'Refer immediately to his prescriber to change medications', isCorrect: false },
            { text: 'Reassure him that sexual side effects from SSRIs are temporary and will resolve', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Both depression and SSRIs can cause low sexual desire, and accurate attribution matters for treatment planning. Assessing the timeline (did desire decrease before or after the medication?) and providing psychoeducation about SSRI sexual effects empowers the client to have an informed conversation with his prescriber. Counselors should not dismiss the medication hypothesis or make promises about resolution timeline without basis.'
        },
        {
          type: 'multipleChoice',
          question: 'Which of the following best describes responsive desire, as distinguished from spontaneous desire?',
          options: [
            { text: 'Desire that is triggered by visual or physical stimulation from an attractive person', isCorrect: false },
            { text: 'Desire that arises in response to intimacy or arousal cues, rather than appearing spontaneously without prior stimulation', isCorrect: true },
            { text: 'Desire that is contingent on relationship quality and emotional safety', isCorrect: false },
            { text: 'Desire that is absent until specifically requested by a partner', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Responsive desire (Basson, 2001) emerges in response to arousal or intimacy cues rather than arising spontaneously. Many people — particularly but not exclusively women — experience primarily responsive desire, meaning they don\'t feel desire before sexual activity begins but do experience it once arousal is initiated. Normalizing this as a desire style rather than a dysfunction reduces shame significantly.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are evidence-based biopsychosocial contributors to low sexual desire? (Select all that apply)',
          options: [
            { text: 'Hypothyroidism and hormonal imbalances', isCorrect: true },
            { text: 'SSRI and antipsychotic medications', isCorrect: true },
            { text: 'Unresolved relational conflict and emotional disconnection', isCorrect: true },
            { text: 'Excessive sexual activity depleting "drive"', isCorrect: false },
            { text: 'Depression and anxiety', isCorrect: true },
            { text: 'Chronic stress and sleep deprivation', isCorrect: true }
          ],
          explanation: 'Low sexual desire has multiple documented biopsychosocial contributors including hormonal factors, psychiatric medications, mental health conditions, relational dynamics, and contextual stressors. The depletion myth (that too much sexual activity depletes desire) is not evidence-based. Comprehensive assessment should identify which contributors are active for a given client.'
        }
      ]
    },

    {
      title: 'Ethics, Boundaries, and Integrating Sexual Health into Clinical Practice',
      order: 4,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Ethics, Boundaries, and Integrating Sexual Health into Clinical Practice',
          subtitle: 'Navigating the ethical landscape and building sexual health competency into ongoing practice',
          sectionNumber: 5
        },
        {
          type: 'text',
          content: `<p>Sexual health counseling occupies a distinctive position in the ethical landscape of mental health practice. The inherent vulnerability of sexuality as a domain — its intimate relationship to shame, identity, and relational risk — means that ethical missteps in this area can cause significant harm that may not be immediately visible. At the same time, ethical avoidance — declining to address sexual health because it feels dangerous or uncomfortable — is itself an ethical failure that denies clients competent care. This final section examines the core ethical obligations that shape sexual health counseling practice, addresses the specific ethical challenges that arise most frequently in this domain, and provides a framework for integrating sexual health competency sustainably into clinical practice.</p>
<p>The foundational ethical obligation in sexual health counseling is competence. ACA Code of Ethics Standard C.2.a requires that counselors practice only within the boundaries of their competence, based on their education, training, supervised experience, state and national professional credentials, and appropriate professional experience. For sexual health specifically, this means being honest about what you know and what you don't, operating at the PLISSIT level your training supports, seeking consultation when presentations exceed your knowledge base, and maintaining awareness that sexual health is a complex domain in which overconfidence carries real clinical risk. It also means actively pursuing the training and continuing education needed to maintain and expand sexual health competency over time — something that often requires intentional effort given how underrepresented this content is in mandatory CE requirements.</p>
<p>The duty to avoid sexual exploitation in the therapeutic relationship is absolute and non-negotiable. ACA Code of Ethics Standard A.5 is explicit: sexual and romantic interactions with clients, former clients within a specified period, or close family members of clients are prohibited. These prohibitions exist because of the fundamental power differential in the therapeutic relationship: the relational asymmetry, emotional intimacy, and client vulnerability that make therapy effective also create conditions in which sexual exploitation can occur and can cause severe harm. Counselors who work in sexual health topics — addressing sexuality, discussing intimate experiences, holding space for arousal-related disclosures — must be particularly attuned to boundary maintenance and countertransference. The therapeutic frame should be clear and consistent. If a counselor notices sexual feelings arising in response to a client, supervision is immediately appropriate. These feelings do not make the counselor a bad clinician; how they are managed determines the ethical quality of the care.</p>
<p>Informed consent in sexual health counseling requires attending to several dimensions. Clients should understand the scope and nature of sexual health discussions that may occur in treatment, the counselor's training in this area and its limits, how information about sexual concerns will be documented, and the circumstances under which confidentiality might be limited (mandatory reporting related to sexual abuse, for example). For clients who are receiving treatment that involves specific sexual health exercises or psychoeducation about sexual technique — typically at the Specific Suggestions level — informed consent for those specific interventions is required. Clients who are not comfortable addressing sexual health in treatment have the right to set that limit, and counselors should respect it while ensuring they understand what support is available elsewhere.</p>
<p>Cultural humility intersects with ethics in sexual health counseling in a particularly important way: the counselor's own cultural and religious values about sexuality must not be imposed on clients. ACA Code of Ethics Standard A.4.b explicitly addresses the obligation to avoid imposing values. This is especially relevant for counselors whose own cultural or religious background specifies norms about sexual expression that differ from their clients' values or identities. A counselor who holds religious views about sexuality and marriage does have the right to refer clients whose values or therapeutic goals are fundamentally incompatible with their own — but they do not have the right to communicate disapproval, attempt to shift clients toward their own values, or provide care that is shaped by judgment. Referral must be to a willing, available, and equally qualified provider, and must be executed in a way that does not constitute abandonment or cause harm.</p>
<p>Navigating mandatory reporting obligations in the context of sexual health requires specific knowledge. Counselors are mandated reporters for child sexual abuse — when a client discloses that a child is being sexually abused, or when the counselor has reasonable cause to suspect it, a report to child protective services is required regardless of the therapeutic impact of reporting. For adult sexual assault, mandatory reporting requirements vary by state; counselors must know their jurisdiction's specific obligations. Adult protective services involvement may be required when an older or disabled client discloses sexual exploitation or abuse. When a client discloses their own past experience of childhood sexual abuse, mandatory reporting requirements typically do not apply (the abuse is historical and the victim is now an adult) — but counselors should clarify this with current state statutes, as some states have made modifications. Consultation with a supervisor or ethics consultant when a mandatory reporting question is uncertain is always appropriate.</p>
<p>The path toward sustainable sexual health competency in general counseling practice involves several concrete elements: continuing education in sexual health that goes beyond this foundational course; maintaining an active referral network of AASECT-certified therapists, pelvic floor physical therapists, and sex-positive medical providers; building supervision and consultation structures that provide a place to process countertransference and seek guidance when cases exceed competency; seeking personal therapy or personal development work around one's own sexuality as relevant to clinical presence — not to achieve any particular sexual profile, but to reduce the personal discomfort and unexamined assumptions that impair clinical effectiveness; and joining professional organizations and communities of practice (AASECT, SSTAR, ACA special interest groups) that support ongoing learning. Sexual health competency is not a destination. It is a practice — cultivated over a career, deepened by clinical experience, and sustained by ongoing commitment to the clients who bring us their most private concerns and most profound vulnerabilities.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Ethical Practice in Sexual Health Counseling: Boundaries, Competence, and Cultural Humility',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_ethics_sexual_health_counseling',
          description: 'This video addresses the ethical obligations specific to sexual health counseling practice, including competency limits, boundary maintenance, mandatory reporting, and the integration of cultural humility into ethically grounded care.',
          accessibility: { ariaLabel: 'Video: Ethics in sexual health counseling practice', role: 'complementary' }
        },
        {
          type: 'imageText',
          content: `<p>Integrating sexual health into general counseling practice is a gradual, developmental process. Most clinicians do not become comfortable addressing sexual health overnight; rather, they develop competency through a combination of continuing education, supervised practice, consultation, and accumulated clinical experience. The integration process follows a similar arc to any clinical skill development: conscious incompetence (knowing you lack the skill), conscious competence (applying the skill with deliberate effort), and finally unconscious competence (addressing sexual health as a natural and fluid part of comprehensive clinical care).</p>
<p>One practical integration framework involves identifying three levels of practice change: first-order changes that any counselor can implement immediately regardless of training level (adding sexual health questions to intake forms, including sexual health in treatment review conversations, developing a referral network); second-order changes that require modest additional training (building familiarity with validated assessment tools, developing fluency with psychoeducational content for the most common presentations); and third-order changes that require substantial continuing education or supervised training (developing capacity for Specific Suggestions level work with specific presentations). Most counselors can implement first-order changes in the next session after completing this course. Second-order changes develop over the following months with intentional effort. Third-order changes emerge from sustained professional development over years.</p>`,
          image: '',
          imageAlt: 'Three-tier pyramid showing integration levels of sexual health competency in counseling practice',
          imagePosition: 'left',
          highlight: false
        },
        {
          type: 'callout',
          title: 'ACA Ethics Code: Non-Imposition of Values (A.4.b)',
          calloutType: 'ethics',
          content: `<p>ACA Code of Ethics Standard A.4.b states: "Counselors are aware of — and avoid imposing — their own values, attitudes, beliefs, and behaviors. Counselors respect the diversity of clients, trainees, and research participants and seek training in areas in which they are at risk of imposing their values onto clients, especially when the counselor's values are inconsistent with the client's goals or are discriminatory in nature." In sexual health counseling, this standard is particularly relevant for areas where cultural, religious, or personal values may shape what the counselor regards as healthy or normal. Competent sexual health practice requires ongoing self-examination and willingness to refer when value imposition risk is high.</p>`
        },
        {
          type: 'multipleChoice',
          question: 'A counselor who holds strong personal religious beliefs about sexuality is assigned a client who is working to integrate their identity as a sexually active gay man with their values. The most ethically sound approach is:',
          options: [
            { text: 'Provide treatment while communicating a neutral stance, regardless of personal values', isCorrect: false },
            { text: 'Disclose the counselor\'s religious beliefs so the client can make an informed decision about treatment', isCorrect: false },
            { text: 'Assess whether the counselor\'s values are likely to impair competent treatment, consult with a supervisor, and refer if value imposition risk is high', isCorrect: true },
            { text: 'Accept the client only after securing agreement that sexual lifestyle will not be discussed in treatment', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'ACA Ethics A.4.b requires counselors to be aware of and avoid imposing their values. When a counselor\'s values create a genuine risk of impairing treatment quality or imposing on client identity, referral is ethically required. The key ethical test is not disclosure of values, but honest assessment of whether value imposition risk is high enough to compromise competent care — which requires consultation. Requiring clients to agree not to discuss their identity as a condition of service is a clear ethical violation.'
        },
        {
          type: 'multipleChoice',
          question: 'A counselor notices that they feel sexually attracted to a client with whom they are doing sexual health counseling. The most appropriate immediate response is:',
          options: [
            { text: 'Terminate treatment immediately to prevent harm', isCorrect: false },
            { text: 'Seek supervision to process the countertransference and assess its impact on treatment', isCorrect: true },
            { text: 'Disclose the attraction to the client in the spirit of transparency', isCorrect: false },
            { text: 'Continue treatment as long as the feelings are not acted upon', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Experiencing sexual feelings in response to a client is a countertransference response that warrants supervision — not automatic termination, and absolutely not disclosure to the client. Supervision provides the structure to assess whether the countertransference is manageable, whether treatment can continue ethically, and how to protect both client and counselor. Disclosing sexual attraction to a client is a boundary violation that can cause significant harm.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are appropriate components of a sustainable sexual health competency practice framework for general counselors? (Select all that apply)',
          options: [
            { text: 'Completing continuing education in sexual health beyond foundational training', isCorrect: true },
            { text: 'Maintaining an active referral network including AASECT-certified therapists', isCorrect: true },
            { text: 'Building supervision/consultation structures for sexual health cases', isCorrect: true },
            { text: 'Becoming certified as a sex therapist before addressing any sexual health topics', isCorrect: false },
            { text: 'Participating in professional communities of practice around sexual health', isCorrect: true },
            { text: 'Engaging in personal development work around one\'s own relationship to sexuality as relevant to clinical presence', isCorrect: true }
          ],
          explanation: 'Sustainable sexual health competency requires ongoing CE, active referral networks, supervision/consultation access, and professional community engagement. Waiting for full specialist certification before addressing ANY sexual health topics would deny clients basic Permission and Limited Information level care that is within every counselor\'s scope.'
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each ethical scenario with the most relevant ACA Code of Ethics standard or principle.',
          matchingPairs: [
            { term: 'A counselor addresses sexual health topics beyond their training without seeking consultation', definition: 'Competence (C.2.a): Counselors practice only within boundaries of their competence' },
            { term: 'A counselor attempts to shift a client\'s sexual values to align with the counselor\'s own', definition: 'Non-Imposition of Values (A.4.b): Counselors avoid imposing their own values on clients' },
            { term: 'A counselor develops a sexual relationship with a client they terminated treatment with one year ago', definition: 'Sexual Exploitation Prohibition (A.5): Prohibits sexual interactions with current or recent former clients' },
            { term: 'A counselor fails to explain to a client how sexual health disclosures will be documented', definition: 'Informed Consent (A.2): Clients have the right to know the nature of treatment and its limits' }
          ]
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Sexual Health Across the Lifespan',
          takeaways: [
            'Sexual health is a fundamental dimension of human wellbeing and belongs in every counselor\'s scope of practice at the Permission and Limited Information levels — regardless of specialty training',
            'Sexual development is a lifelong process with stage-specific clinical considerations; counselors who understand normative development can distinguish it from clinical concern without pathologizing the ordinary',
            'Comprehensive sexual health assessment follows a biopsychosocial-spiritual framework, attends to distress and impact, and uses a combination of clinical interview and validated instruments while centering cultural humility',
            'Common presentations in general counseling include desire discrepancy, low desire, sexual pain disorders, orgasm difficulties, and medication-induced dysfunction — each with biopsychosocial contributors and psychoeducational approaches within general counselor scope',
            'Ethical practice in sexual health requires active competence maintenance, vigilance against value imposition, clear boundary management, countertransference supervision, and knowledge of mandatory reporting obligations specific to sexual health contexts',
            'The PLISSIT model provides a practical framework for scaling clinical response: Permission and Limited Information are in scope for all counselors; Specific Suggestions and Intensive Therapy require specialized training and active referral relationships'
          ]
        },
        {
          type: 'resources',
          title: 'Professional Resources: Sexual Health in Counseling Practice',
          resources: [
            { name: 'AASECT Therapist Locator', description: 'Find AASECT-certified sex therapists and sexuality educators by location for client referrals and professional consultation', url: 'https://www.aasect.org/referral-directory' },
            { name: 'World Health Organization: Sexual Health', description: 'WHO policy documents and framework on sexual health as a global public health priority', url: 'https://www.who.int/health-topics/sexual-health' },
            { name: 'ACA Ethics Code (2014)', description: 'American Counseling Association Code of Ethics including Standards A.4.b (non-imposition of values) and A.5 (sexual exploitation prohibitions)', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf' },
            { name: 'SSTAR: Society for Sex Therapy and Research', description: 'Professional organization for sex therapy researchers and practitioners; publishes Journal of Sex and Marital Therapy', url: 'https://www.sstarnet.org' },
            { name: 'Come As You Are — Emily Nagoski', description: 'Evidence-based resource on responsive vs. spontaneous desire, the dual control model, and stress-sex connections — appropriate for clinician reading and as a psychoeducational recommendation for clients', url: 'https://www.emilynagoski.com' }
          ],
          accessibility: { ariaLabel: 'Professional resources for sexual health counseling practice', role: 'complementary' }
        }
      ]
    }
  ],

  assessment: {
    questions: [
      {
        type: 'multipleChoice',
        question: 'The World Health Organization defines sexual health as:',
        options: [
          { text: 'The absence of sexually transmitted infections and reproductive dysfunction', isCorrect: false },
          { text: 'A state of physical, emotional, mental and social well-being in relation to sexuality', isCorrect: true },
          { text: 'Healthy reproductive functioning and age-appropriate sexual behavior', isCorrect: false },
          { text: 'The capacity for sexual activity and satisfaction with a consenting partner', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The WHO definition is expansive and biopsychosocial, locating sexual health within overall well-being rather than limiting it to absence of disease or reproductive health.'
      },
      {
        type: 'multipleChoice',
        question: 'Which PLISSIT levels are within the scope of practice of all licensed mental health counselors regardless of specialty training?',
        options: [
          { text: 'Specific Suggestions and Intensive Therapy', isCorrect: false },
          { text: 'Permission only', isCorrect: false },
          { text: 'Permission and Limited Information', isCorrect: true },
          { text: 'Limited Information and Specific Suggestions', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'All licensed counselors should be able to give Permission (normalize the topic) and provide Limited Information (accurate psychoeducation). SS and IT require additional specialized training.'
      },
      {
        type: 'multipleChoice',
        question: 'Research on LGBTQ+ adolescent mental health disparities shows that elevated rates of depression and suicidality are primarily caused by:',
        options: [
          { text: 'Sexual orientation or gender identity itself', isCorrect: false },
          { text: 'Neurobiological differences associated with minority sexual identities', isCorrect: false },
          { text: 'Family rejection, peer bullying, and internalized stigma', isCorrect: true },
          { text: 'Confusion about sexual identity and delayed identity consolidation', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Minority stress research identifies social stressors — family rejection, bullying, and internalized stigma — not identity itself as the drivers of disparity. This locates effective intervention at the social and environmental level.'
      },
      {
        type: 'multipleChoice',
        question: 'A client reports low sexual desire but states that it does not bother them and their relationship is satisfying. The most accurate clinical interpretation is:',
        options: [
          { text: 'They meet criteria for hypoactive sexual desire disorder and should be referred for sex therapy', isCorrect: false },
          { text: 'They have a normative desire variant that does not meet DSM criteria because there is no clinically significant distress', isCorrect: true },
          { text: 'Their low desire is likely depression-related and should be addressed in treatment', isCorrect: false },
          { text: 'They are in denial about the impact of their low desire on their relationship', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'DSM-5-TR requires clinically significant distress as a diagnostic criterion. Absence of distress means the presentation does not meet diagnostic threshold regardless of desire level. The counselor\'s standard is the client\'s own experience, not a statistical norm.'
      },
      {
        type: 'multipleChoice',
        question: 'Responsive desire, as described by Basson\'s circular sexual response model, refers to:',
        options: [
          { text: 'Desire that arises without specific stimulation or context', isCorrect: false },
          { text: 'Desire that emerges in response to arousal or intimacy cues rather than appearing spontaneously', isCorrect: true },
          { text: 'Desire that is conditional on absence of relationship conflict', isCorrect: false },
          { text: 'Desire that responds to partner-initiated sexual contact', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Responsive desire (Basson, 2001) emerges after arousal is initiated rather than arising spontaneously before sexual activity. Many people — particularly but not exclusively women — have primarily responsive desire, and normalizing this reduces shame and reframes desire as context-dependent rather than deficient.'
      },
      {
        type: 'multipleChoice',
        question: 'Which statement most accurately describes the relationship between SSRIs and sexual functioning?',
        options: [
          { text: 'SSRIs improve sexual function by reducing depression-related low desire', isCorrect: false },
          { text: 'SSRI sexual side effects are rare and resolve spontaneously within weeks', isCorrect: false },
          { text: 'SSRIs can cause decreased libido, delayed orgasm, anorgasmia, and decreased genital sensation in a significant percentage of users', isCorrect: true },
          { text: 'Sexual effects from SSRIs are psychological rather than pharmacological', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'SSRIs have a well-documented sexual side effect profile affecting desire, arousal, and orgasm in a significant percentage of users. Rates as high as 30-40% are reported. These effects are pharmacological, and client non-disclosure is common because clients attribute changes to their depression rather than medication.'
      },
      {
        type: 'multipleChoice',
        question: 'The biopsychosocial-spiritual framework applied to sexual health assessment addresses:',
        options: [
          { text: 'Physical and psychological factors only', isCorrect: false },
          { text: 'Biological, psychological, social, and spiritual dimensions as interconnected contributors', isCorrect: true },
          { text: 'Spiritual and cultural factors as the primary determinants of sexual expression', isCorrect: false },
          { text: 'Medical diagnosis and psychopharmacological management of sexual conditions', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The biopsychosocial-spiritual framework addresses all four interconnected domains: biological (hormones, medications, neurological function), psychological (attachment, trauma, mood, schemas), social/cultural (norms, family messages, discrimination), and spiritual (meaning, values, sacred dimensions of sexuality).'
      },
      {
        type: 'multipleChoice',
        question: 'When a counselor notices sexual attraction to a client during sexual health counseling, the most appropriate immediate response is:',
        options: [
          { text: 'Terminate treatment immediately to prevent boundary violation', isCorrect: false },
          { text: 'Disclose the attraction to maintain therapeutic transparency', isCorrect: false },
          { text: 'Continue without acknowledging the feeling as long as it remains internal', isCorrect: false },
          { text: 'Seek supervision to process the countertransference and assess its impact on treatment', isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: 'Countertransference is a clinical phenomenon requiring supervision, not immediate termination or disclosure to the client. Supervision provides the structure to assess whether treatment can continue ethically and how to protect both parties. Disclosing sexual attraction to a client is a boundary violation.'
      },
      {
        type: 'multipleChoice',
        question: 'Genito-pelvic pain/penetration disorder (GPPPD) in DSM-5-TR encompasses which previously separate diagnoses?',
        options: [
          { text: 'Dyspareunia and female orgasmic disorder', isCorrect: false },
          { text: 'Sexual aversion disorder and vulvodynia', isCorrect: false },
          { text: 'Vaginismus and dyspareunia', isCorrect: true },
          { text: 'Vulvodynia and pelvic inflammatory disease', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'DSM-5-TR combined the previously separate diagnoses of vaginismus and dyspareunia into genito-pelvic pain/penetration disorder (GPPPD), reflecting the clinical overlap between these presentations and the difficulty distinguishing them reliably in clinical practice.'
      },
      {
        type: 'multipleChoice',
        question: 'The Global Study of Sexual Attitudes and Behaviors found that the strongest predictor of sexual satisfaction across the lifespan is:',
        options: [
          { text: 'Frequency of sexual activity', isCorrect: false },
          { text: 'Age and hormonal status', isCorrect: false },
          { text: 'Emotional closeness, physical pleasure, and absence of distressing problems', isCorrect: true },
          { text: 'Partner attractiveness and sexual variety', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The Global Study of Sexual Attitudes and Behaviors (N>27,000 across 29 countries) found sexual satisfaction was predicted by emotional closeness, physical pleasure, and absence of distressing problems — not frequency or demographics. This finding has major clinical implications: sexual health intervention should target quality and relational intimacy, not frequency.'
      },
      {
        type: 'multipleChoice',
        question: 'Under ACA Code of Ethics A.4.b, a counselor whose personal religious values conflict with a client\'s sexual identity is required to:',
        options: [
          { text: 'Disclose their religious values so the client can make an informed decision', isCorrect: false },
          { text: 'Assess whether value imposition risk will impair treatment; refer if it will', isCorrect: true },
          { text: 'Continue treatment with the goal of helping the client reconcile their identity with mainstream values', isCorrect: false },
          { text: 'Require the client to sign an agreement limiting discussion of sexual identity', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'ACA A.4.b requires counselors to avoid imposing values. When personal values create a genuine risk of impairing treatment, referral to a willing, available, qualified provider is ethically required. The test is whether value imposition risk is high — assessed through honest self-reflection and supervision consultation.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following most accurately describes culturally humble practice in sexual health counseling?',
        options: [
          { text: 'Acquiring comprehensive cultural knowledge about clients\' backgrounds before providing care', isCorrect: false },
          { text: 'Applying universal standards of healthy sexuality while acknowledging cultural variation', isCorrect: false },
          { text: 'Ongoing self-reflection about one\'s own cultural biases combined with genuine curiosity about the client\'s framework', isCorrect: true },
          { text: 'Avoiding sexual health discussions with clients whose cultural backgrounds may produce discomfort', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Cultural humility (distinguished from cultural competence) emphasizes ongoing self-reflection and a learning posture rather than acquisition of a static knowledge set. It combines awareness of one\'s own cultural biases with genuine curiosity about the client\'s framework, values, and meanings around sexuality.'
      },
      {
        type: 'multipleChoice',
        question: 'When using validated sexual function instruments with diverse populations, the most important clinical caveat is:',
        options: [
          { text: 'Instruments should only be used with populations for which they were normed', isCorrect: false },
          { text: 'Results should be interpreted tentatively, with cultural context, noting that most instruments were normed on Western, white, heterosexual samples', isCorrect: true },
          { text: 'Validated instruments eliminate the need for clinical interview in sexual health assessment', isCorrect: false },
          { text: 'Higher scores always indicate greater pathology regardless of cultural background', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Most validated sexual function instruments were developed with Western, white, heterosexual, cisgender samples. This limits their validity with diverse populations. Results should be held tentatively, contextual exploration should accompany scoring, and clinicians should name this limitation explicitly rather than treating norm-referenced scores as universal standards.'
      },
      {
        type: 'multipleChoice',
        question: 'Research on vulvodynia and sexual pain disorders suggests that average time from symptom onset to accurate diagnosis is:',
        options: [
          { text: '1-3 months', isCorrect: false },
          { text: '6-12 months', isCorrect: false },
          { text: '2-7 years', isCorrect: true },
          { text: '10+ years', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Research shows that people with vulvodynia wait an average of 2-7 years and see multiple providers before receiving an accurate diagnosis. This delay results in years of unnecessary pain, anxiety, relationship distress, and shame. Counselors who can normalize, validate, and facilitate appropriate referral dramatically reduce this trajectory.'
      },
      {
        type: 'multipleChoice',
        question: 'The "orgasm gap" refers to disparities in orgasm rates primarily between:',
        options: [
          { text: 'Older and younger adults', isCorrect: false },
          { text: 'Heterosexual men and heterosexual women during partnered sex', isCorrect: true },
          { text: 'People with and without sexual dysfunction diagnoses', isCorrect: false },
          { text: 'Partnered and unpartnered individuals', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The orgasm gap documents that heterosexual men orgasm approximately 95% of the time during sex while heterosexual women orgasm approximately 65% of the time. The gap is substantially smaller in lesbian relationships, suggesting cultural and relational factors (specifically the undervaluing of clitoral stimulation) rather than anatomical inevitability as the primary driver.'
      },
      {
        type: 'multipleChoice',
        question: 'In trauma-informed sexual health assessment, hyperarousal and hypoarousal in sexual contexts should primarily be understood as:',
        options: [
          { text: 'Primary sexual dysfunctions requiring referral to a urologist or gynecologist', isCorrect: false },
          { text: 'Adaptive trauma responses of the nervous system rather than primary dysfunction of desire or arousal', isCorrect: true },
          { text: 'Evidence of ongoing intimate partner violence in the current relationship', isCorrect: false },
          { text: 'Symptoms of bipolar disorder requiring medication evaluation', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Window of Tolerance framework helps counselors understand sexual hyperarousal (anxiety, startle, pain amplification) and hypoarousal (dissociation, numbness, flatness) as nervous system defensive responses to trauma cues — adaptive responses to be understood rather than primary dysfunction to be "fixed." This reframe reduces shame and opens therapeutic possibility.'
      },
      {
        type: 'multipleChoice',
        question: 'Which developmental period is most consistently neglected in sexual health clinical training and practice?',
        options: [
          { text: 'Adolescence', isCorrect: false },
          { text: 'Emerging adulthood', isCorrect: false },
          { text: 'Later life (60+)', isCorrect: true },
          { text: 'Midlife perimenopause/andropause period', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Older adults are systematically desexualized by healthcare systems, family assumptions, and institutional environments despite research showing that sexual interest and activity persist well into the eighth and ninth decades. Later life represents the most undertreated developmental period in sexual health care across the clinical literature.'
      },
      {
        type: 'multipleChoice',
        question: 'A counselor has been working with a client on relationship distress for six sessions. The client has never mentioned sexual concerns, but the counselor suspects they may be relevant given the presenting pattern. The most appropriate step is:',
        options: [
          { text: 'Wait for the client to raise sexual concerns in their own time', isCorrect: false },
          { text: 'Introduce a validated sexual function questionnaire as part of a formal re-assessment', isCorrect: false },
          { text: 'Include a brief, warm inquiry about sexual health in the next session\'s treatment review', isCorrect: true },
          { text: 'Refer to a sex therapist since sexual concerns may be beyond general counseling scope', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Sexual health should be revisited throughout treatment, not only at intake. A brief, warm inquiry in a treatment review — "As we look at how things are going, how is the sexual and intimate dimension of your relationship?" — is appropriate for all counselors and may open a door the client has been waiting for permission to walk through.'
      }
    ]
  },

  references: [
    { citation: 'Annon, J. S. (1976). The PLISSIT model: A proposed conceptual scheme for the behavioral treatment of sexual problems. Journal of Sex Education and Therapy, 2(1), 1-15.', url: '' },
    { citation: 'American Association of Sexuality Educators, Counselors and Therapists. (2021). AASECT competency guidelines for sexuality educators, counselors, and therapists. AASECT.', url: 'https://www.aasect.org' },
    { citation: 'American Counseling Association. (2014). ACA code of ethics. ACA.', url: 'https://www.counseling.org' },
    { citation: 'American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). APA.', url: '' },
    { citation: 'Basson, R. (2001). Using a different model for female sexual response to address women\'s problematic low sexual desire. Journal of Sex and Marital Therapy, 27(5), 395-403.', url: '' },
    { citation: 'Brotto, L. A., & Luria, M. (2014). Sexual interest/arousal disorder in women. In Y. M. Binik & K. S. Hall (Eds.), Principles and practice of sex therapy (5th ed., pp. 17-41). Guilford Press.', url: '' },
    { citation: 'Clayton, A. H., & Valladares Juarez, E. M. (2019). Female sexual dysfunction. Psychiatric Clinics of North America, 42(1), 135-158.', url: '' },
    { citation: 'Engel, G. L. (1977). The need for a new medical model: A challenge for biomedicine. Science, 196(4286), 129-136.', url: '' },
    { citation: 'Frederick, D. A., John, H. K. S., Garcia, J. R., & Lloyd, E. A. (2018). Differences in orgasm frequency among gay, lesbian, bisexual, and heterosexual men and women in a U.S. national sample. Archives of Sexual Behavior, 47(1), 273-288.', url: '' },
    { citation: 'Fugl-Meyer, K. S., Bohm-Starke, N., Damsted Petersen, C., Fugl-Meyer, A., Parish, S., & Giraldi, A. (2013). Standard operating procedures for female genital sexual pain. Journal of Sexual Medicine, 10(1), 83-93.', url: '' },
    { citation: 'Laumann, E. O., Paik, A., Glasser, D. B., Kang, J. H., Wang, T., Levinson, B., ... & Gingell, C. (2006). A cross-national study of subjective sexual well-being among older women and men: Findings from the Global Study of Sexual Attitudes and Behaviors. Archives of Sexual Behavior, 35(2), 145-161.', url: '' },
    { citation: 'Meyer, I. H. (2003). Prejudice, social stress, and mental health in lesbian, gay, and bisexual populations: Conceptual issues and research evidence. Psychological Bulletin, 129(5), 674-697.', url: '' },
    { citation: 'Nagoski, E. (2015). Come as you are: The surprising new science that will transform your sex life. Simon and Schuster.', url: '' },
    { citation: 'Ogden, P., Minton, K., & Pain, C. (2006). Trauma and the body: A sensorimotor approach to psychotherapy. Norton.', url: '' },
    { citation: 'Reed, G. M., Drescher, J., Krueger, R. B., Atalla, E., Bhugra, D., First, M. B., ... & Saxena, S. (2016). Disorders related to sexuality and gender identity in the ICD-11. World Psychiatry, 15(3), 205-221.', url: '' },
    { citation: 'Siegel, D. J. (1999). The developing mind: How relationships and the brain interact to shape who we are. Guilford Press.', url: '' },
    { citation: 'Shifren, J. L., Monz, B. U., Russo, P. A., Segreti, A., & Johannes, C. B. (2008). Sexual problems and distress in United States women: Prevalence and correlates. Obstetrics and Gynecology, 112(5), 970-978.', url: '' },
    { citation: 'World Health Organization. (2006). Defining sexual health: Report of a technical consultation on sexual health. WHO.', url: 'https://www.who.int' }
  ]
};

// ── Validation ──────────────────────────────────────────────────────────────
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
  if(b.items)b.items.forEach(i=>t+=stripHTML(typeof i==='string'?i:i.text||'').split(/\s+/).filter(Boolean).length);
}return t;}

function validate(c){
  const wc=countWords(c);
  const required=c.ceHours*6000;
  const errors=[];const warnings=[];
  if(wc<required)errors.push(`CRITICAL: word count ${wc} below required ${required} for ${c.ceHours} CE`);
  const blockTypes=new Set();
  for(const s of c.sections||[])for(const b of s.contentBlocks||[])blockTypes.add(b.type);
  const kcTypes=['multipleChoice','multiSelect','matching','fillInBlank'];
  const hasKC=kcTypes.some(t=>blockTypes.has(t));
  if(!hasKC)errors.push('CRITICAL: No knowledge check blocks found');
  return{wc,e:errors,w:warnings};
}

async function main(){
  await mongoose.connect(MONGODB_URI);
  const db=mongoose.connection.db;
  const col=db.collection('interactivecourses');
  const{wc,e,w}=validate(COURSE);
  COURSE.wordCount=wc;
  console.log(`Word count: ${wc} (required: ${COURSE.ceHours*6000})`);
  if(w.length)w.forEach(x=>console.warn('⚠️',x));
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  const existing=await col.findOne({slug:SLUG});
  if(existing){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated',SLUG);}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted',SLUG);}
  await mongoose.disconnect();process.exit(0);
}
main().catch(e=>{console.error(e);process.exit(1);});
