/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

// ============================================================
// CR-303: Sexual Health Across the Lifespan: Assessment and Evidence-Based Clinical Practice
// 3 CE Hours | 18,006 words | NBCC ACEP #7760
// ============================================================

const COURSE_DATA = {
  title: "Sexual Health Across the Lifespan: Assessment and Evidence-Based Clinical Practice",
  slug: "sexual-health-across-the-lifespan",
  courseCode: "CR-303",
  description: "A comprehensive 3-hour continuing education course for licensed mental health professionals. Meets NBCC ACEP standards with 18,006 words of graduate-level clinical content.",
  ceHours: 3,
  credits: 3,
  category: "Clinical",
  ceCategory: "Clinical",
  ceuHours: 3,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  creditType: "NBCC",
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  targetAudience: ["Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, NCCs, and psychiatric NPs who address sexual health concerns across the lifespan in clinical practice."],
  accessType: "paid",
  price: 59.99,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  isActive: true,
  passingScore: 80,
  maxAttempts: 3,
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },
  objectives: [
    "Apply a biopsychosocial framework to sexual health assessment across childhood, adolescence, adulthood, and later life.",
    "Identify normative sexual development milestones and distinguish them from clinical concerns requiring assessment or mandated reporting.",
    "Implement evidence-based, affirming approaches to sexual health clinical conversations across diverse client populations.",
    "Recognize and respond clinically to sexual health concerns presenting in the context of chronic illness, disability, and aging.",
    "Apply cultural humility in sexual health clinical practice with LGBTQ+ clients and clients from diverse cultural backgrounds.",
    "Utilize validated assessment tools and referral pathways for sexual health concerns requiring specialist intervention.",
  ],
  modules: [
    {
      title: "Module 1: Sexual Health Foundations and Developmental Perspectives",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Module 1",
          subtitle: "Module 1: Sexual Health Foundations and Developmental Perspectives"
        },
        {
          type: "text",
          content: `<h2>Foundations of Sexual Health: The Biopsychosocial Model and Clinical Practice</h2>
<h3>Defining Sexual Health</h3>
<p>Sexual health is a fundamental dimension of human wellbeing that mental health professionals encounter across every clinical setting — yet it remains one of the most consistently undertreated dimensions of practice, largely due to the shame, discomfort, and inadequate training that prevent both clients and clinicians from raising sexual health concerns directly. The World Health Organization's (2006) definition of sexual health as 'a state of physical, emotional, mental, and social wellbeing in relation to sexuality' positions sexual health not as the absence of dysfunction but as the presence of positive sexual experience — including pleasure, safety, respect, and self-determination.</p>
<p>This comprehensive definition has direct clinical implications: effective practice addresses both the remediation of dysfunction and the positive dimensions of sexual experience that constitute genuine sexual wellbeing.</p>
<h3>The Biopsychosocial Framework</h3>
<p>The biopsychosocial model — the integrative framework that has replaced single-factor models of sexual functioning — understands sexual experience as the product of the dynamic interaction of:</p>
<ul>
<li><strong>Biological factors</strong>: hormonal status, vascular health, neurological function, medication effects</li>
<li><strong>Psychological factors</strong>: cognitive patterns, emotional regulation, attachment, body image, sexual self-concept</li>
<li><strong>Sociocultural factors</strong>: cultural sexual scripts, gender role expectations, religious and moral frameworks, relationship context</li>
</ul>
<p>No single domain is sufficient to explain the full range of presentations that clinicians encounter. Clinical formulation attending to all three domains is substantially more useful than any single-factor account.</p>
<h3>Lifespan Developmental Framework</h3>
<p>The lifespan developmental framework recognizes that sexuality is not a static adult attribute but a developmental process beginning in infancy and continuing through late life. Each developmental stage presents characteristic concerns, normative milestones, and specific clinical considerations.</p>
<p>Infant and toddler development involves discovery of genital sensation through exploratory behavior that is a developmentally expected component of bodily self-discovery. Early childhood involves curiosity about bodies, genital exploration, and beginning gender awareness. Middle childhood brings internalization of cultural messages about sexuality and gender. Adolescent development involves the integration of physical sexual maturation, sexual identity development, and beginning sexual experimentation in a period that is simultaneously one of the most powerful in sexual development and one of the most clinically sensitive.</p>
<h3>Sexual Health Disparities</h3>
<p>Sexual health disparities — the systematic differences in sexual health outcomes and access to care that affect marginalized populations — are a public health concern with direct clinical implications. Populations disproportionately affected include:</p>
<ul>
<li><strong>LGBTQ+ individuals</strong>: experience higher rates of sexual dysfunction, sexual trauma, and sexual health concerns alongside substantially lower rates of genuinely affirming clinical attention</li>
<li><strong>BIPOC individuals</strong>: face both higher rates of certain sexual health concerns and lower-quality clinical attention to their sexual health</li>
<li><strong>Individuals with disabilities</strong>: face systematic exclusion from sexual health services reflecting ableist assumptions about who is a sexual being</li>
</ul>
<p>Clinicians who actively work to provide equitable, affirming sexual health care contribute to the reduction of a significant dimension of health inequality.</p>`
        },
        {
          type: "text",
          content: `<h3>The Clinical Conversation: Permission-Giving</h3>
<p>The clinical conversation about sexual health requires a specific clinical stance that many mental health professionals have not developed because their training did not include sexual health as a clinical competency. The most foundational skill in sexual health practice is Permission-giving: the explicit, matter-of-fact communication that sexual health concerns are clinically appropriate topics, that the clinician is comfortable discussing them, and that the client's experiences are not inherently pathological.</p>
<p>This is enacted through direct inquiry about sexual health rather than waiting for clients to raise it, through clinical ease with sexual topics, and through non-judgmental responses to disclosed concerns. The clinician who takes a routine sexual health history at intake — with the same ease they bring to medication history or family history — models the clinical normalization of sexual health that most clients have never experienced.</p>
<h3>Validated Assessment Instruments</h3>
<p>Validated assessment instruments provide standardized data complementing clinical interview in comprehensive sexual health evaluation. Key instruments include:</p>
<ul>
<li><strong>FSFI</strong>: provides a multidimensional assessment of female sexual functioning across six domains — desire, arousal, lubrication, orgasm, satisfaction, and pain</li>
<li><strong>IIEF</strong>: assesses male sexual function across five domains</li>
</ul>
<p>These instruments should be administered within a clinical context that includes explicit normalization of the sexual health assessment, transparent sharing of results with the client, and integration with clinical interview data in a comprehensive biopsychosocial formulation. Their use should not be limited to specialty sexual health settings — any clinician conducting comprehensive mental health intake or treatment planning can appropriately integrate these brief instruments into standard assessment practice.</p>
<h3>The Sexual Health–Mental Health Connection</h3>
<p>The relationship between sexual health and overall mental health is bidirectional and clinically significant in ways justifying systematic sexual health assessment as a standard component of general clinical practice. Depression, anxiety, PTSD, and most psychiatric conditions are associated with sexual health concerns through both the direct effects of the conditions and through the sexual side effects of their pharmacological treatments.</p>
<p>Antidepressants — particularly SSRIs and SNRIs — produce sexual side effects in 30–40% of users, with reduced desire, arousal difficulties, and delayed orgasm among the most common. These side effects significantly affect medication adherence and quality of life, yet are frequently not assessed because clinicians do not routinely inquire. The clinician who monitors sexual health as a component of ongoing medication management is providing a dimension of clinical attention that substantially improves both medication adherence and overall treatment outcomes.</p>
<h3>Cultural Context and Sexual Scripts</h3>
<p>Cultural context shapes sexual experience, values, and functioning in ways requiring genuine cultural humility from clinicians whose training has typically derived from Western, predominantly white, heteronormative frameworks. The concept of sexual scripts — culturally shared cognitive frameworks that organize sexual expectations, meanings, and behavior (Gagnon & Simon, 1973) — provides a useful framework for understanding how cultural context shapes individual sexual experience.</p>
<p>Clinicians who approach sexual health assessment with genuine curiosity about the specific scripts organizing each client's sexual experience — rather than applying mainstream Western sexual norms as universal standards — are providing the culturally responsive care that sexual health assessment requires. This cultural humility applies not only to clients from non-Western backgrounds but to all clients, recognizing that every individual's sexuality is shaped by the specific cultural, developmental, and experiential history that is uniquely theirs.</p>`
        },
        {
          type: "text",
          content: `<h2>Childhood and Adolescent Sexual Development</h2>
<h3>Normative Childhood Sexual Behavior</h3>
<p>Childhood sexual development follows a predictable progression that clinicians must understand to distinguish normative sexual behavior from behavior warranting clinical assessment or mandated reporting. Sexual curiosity — including genital self-exploration, curiosity about others' bodies, and 'playing doctor' with same-age peers — is developmentally normative from approximately ages 3–7.</p>
<p>The clinical distinction between normative sexual play and concerning behavior involves assessment of:</p>
<ul>
<li>Age-appropriateness</li>
<li>Presence of coercion or significant age disparity</li>
<li>Specific content (which can reveal adult sexual exposure)</li>
<li>The child's emotional response</li>
<li>Broader developmental and family context</li>
</ul>
<p>Normative sexual exploration is typically mutual, occasional, associated with curiosity rather than secrecy or distress, and ceases when redirected by adults.</p>
<h3>Adolescent Sexual Development</h3>
<p>Adolescence encompasses physical maturation of puberty, development of sexual identity and attraction patterns, initiation of sexual experimentation, and the social challenges of navigating sexuality in a culture that simultaneously sexualizes adolescents and restricts their access to accurate information. Comprehensive sexuality education — addressing human development, relationships, personal skills, sexual behavior, sexual health, and society as integrated dimensions of sexual literacy — is associated with delayed sexual initiation, increased protective behavior, and better sexual health outcomes.</p>
<p>Mental health clinicians working with adolescents have a responsibility to provide developmentally appropriate sexual health information and to identify barriers to care access that are remediable through clinical advocacy.</p>
<h3>Gender-Diverse Youth</h3>
<p>The sexual development of transgender and gender-diverse youth involves dimensions requiring specific clinical knowledge for affirming practice. Gender dysphoria — distress accompanying the incongruence between gender identity and sexed body — has direct implications for sexual health and development, including body image disruptions affecting sexual development.</p>
<p>The WPATH Standards of Care Version 8 (Coleman et al., 2022) provides current clinical guidance emphasizing an affirming, individualized approach supporting the adolescent's own gender development. Clinicians providing sexual health care to gender-diverse youth should be familiar with these standards and should approach gender-affirming care as evidence-based clinical practice requiring competency development.</p>
<h3>Sexual Trauma in Childhood and Adolescence</h3>
<p>Sexual trauma in childhood and adolescence — child sexual abuse and adolescent sexual trauma including peer assault and dating violence — has pervasive developmental consequences shaping sexual health across the lifespan. The betrayal trauma model (Freyd, 1996) is particularly relevant for abuse perpetrated by caregivers, predicting that survival dependence on the perpetrator requires motivated not-knowing that produces specific dissociative and attachment disruptions.</p>
<p>Clinicians providing sexual health care to adult clients must routinely screen for childhood and adolescent trauma history, recognizing that unaddressed childhood sexual trauma is among the most significant contributors to adult sexual health concerns. Sexual health education as a clinical intervention — providing accurate, developmental, normalizing information — has direct clinical benefit accessible to all mental health clinicians regardless of specialized training level.</p>`
        },
        {
          type: "text",
          content: `<h3>Late Adolescent Sexual Development</h3>
<p>Late adolescent sexual development involves the consolidation of sexual identity, the development of capacity for sexual intimacy within romantic relationships, and the navigation of the specific sexual health risks and decisions that accompany early adult sexual activity.</p>
<p>Comprehensive sexual health assessment with late adolescent clients should include:</p>
<ul>
<li>Assessment of consent knowledge and communication skills</li>
<li>STI prevention knowledge and behavior</li>
<li>Contraceptive knowledge and access</li>
<li>Screening for sexual coercion and relationship violence</li>
<li>Assessment of sexual orientation and gender identity development</li>
<li>Identification of any sexual concerns that warrant clinical intervention or referral</li>
</ul>
<p>The clinician who provides these assessments routinely and matter-of-factly creates the clinical context in which adolescent clients can access the sexual health information and support they need without shame or judgment.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>A school counselor receives a referral for 8-year-old Marcus who has been 'acting out sexually' with peers. Assessment reveals mutual genital-touching play with a same-age classmate. Clinical framework: distinguish normative exploration (mutual, age-consistent, curiosity-driven, ceases when redirected) from concerning behavior (coercion, adult content, age disparity). No mandated reporting threshold met. Response: parent psychoeducation about normative development; child guidance about privacy; monitoring for changes. Document assessment rationale clearly.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 1: sexual health foundations and developmental perspectives, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "The PLISSIT Permission level is therapeutically valuable because:",
          options: [
            "It establishes diagnosis",
            "It communicates that sexual concerns are appropriate clinical topics, reducing shame",
            "It identifies clients needing referral",
            "It provides specific techniques"
          ],
          correctAnswer: 1,
          explanation: "Permission-giving communicates that sexual health is a legitimate clinical topic and reduces the shame that prevents many clients from accessing help.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Basson's responsive desire model is clinically important because:",
          options: [
            "It applies only to women with sexual dysfunction",
            "It reframes responsive desire as normative for many women, reducing distress",
            "It establishes hormonal treatment as first-line",
            "It applies only to postmenopausal women"
          ],
          correctAnswer: 1,
          explanation: "Basson's (2001) model reframes desire emerging in response to erotic stimuli as normative rather than disordered for many women.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "GSM is best described as:",
          options: [
            "A psychological adjustment disorder",
            "Treatable vulvovaginal/urinary symptoms from estrogen decline",
            "Normal aging requiring no intervention",
            "A condition affecting only previously sexually active women"
          ],
          correctAnswer: 1,
          explanation: "GSM affects approximately 50% of postmenopausal women and responds to local estrogen, lubricants, and vaginal moisturizers.",
          showExplanation: true
        },
      ],
    },
    {
      title: "Module 2: Adult and Later-Life Sexual Health Assessment and Affirming Practice",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Module 2",
          subtitle: "Module 2: Adult and Later-Life Sexual Health Assessment and Affirming Practice"
        },
        {
          type: "text",
          content: `<h2>Adult Sexual Health: Assessment and Midlife Transitions</h2>
<h3>Comprehensive Adult Assessment</h3>
<p>Adult sexual health assessment encompasses the full range of concerns presenting across the adult lifespan — from early adulthood sexual relationship establishment through midlife hormonal and relational transitions through later-life adaptations to illness and aging. Validated instruments including the FSFI and IIEF provide standardized data that guide formulation and treatment monitoring.</p>
<p>Clinical interview must attend to:</p>
<ul>
<li>The specific nature and duration of the presenting concern</li>
<li>Biopsychosocial contributors</li>
<li>Developmental and relational context</li>
<li>Relevant medical, pharmacological, or trauma history</li>
<li>The client's own goals for their sexual health</li>
</ul>
<p>This breadth requires both clinical knowledge and the clinical ease to conduct it — an ease the clinician investing in sexual health training can develop.</p>
<h3>Women's Sexual Health in Midlife</h3>
<p>Sexual health in midlife involves both challenges and opportunities. The hormonal transitions of perimenopause and menopause — occurring between ages 45–55 — produce effects including estrogen-decline-related vulvovaginal changes (GSM), changes in arousal patterns and lubrication, and variable effects on desire reflecting the interaction of hormonal, psychological, and relational factors.</p>
<p>These changes are not universally negative: many women report increased sexual freedom and satisfaction following menopause. The clinical task is to provide accurate information about expected midlife sexual changes, assess and address distress-causing changes, and affirm the genuine possibilities for continued sexual health and satisfaction across midlife and the later decades.</p>
<h3>Male Sexual Health in Midlife</h3>
<p>Male sexual health in midlife involves a gradual hormonal transition — the progressive testosterone decline beginning around age 30–40 — with direct effects on desire, erectile function, and ejaculatory response. The normative age-related changes — longer time to erection, reduced rigidity, longer refractory period — are frequently misinterpreted as erectile disorder.</p>
<p>Providing psychoeducation about normative age-related changes alongside genuine clinical assessment to distinguish these from clinical erectile disorder is among the most practically beneficial clinical communications available for midlife male clients. Cardiovascular screening is essential, as erectile disorder is now recognized as an early marker of cardiovascular disease that may precede cardiac events by years.</p>
<h3>Sexual Health in Later Life</h3>
<p>Sexual health in later life is a clinical area transformed by research documenting that sexual interest and activity continue for many individuals well into the seventh, eighth, and ninth decades. Lindau and colleagues' (2007) landmark study found that 73% of those aged 57–64, 53% aged 65–74, and 26% aged 75–85 reported sexual activity in the past year — with most reporting sex remained important to their quality of life.</p>
<p>The clinical implications are straightforward: sexual health should be assessed routinely across all ages, including older adult clients whose concerns may include GSM, erectile dysfunction, desire changes, chronic illness and medication impacts, and the sexual relationship implications of partner illness or cognitive decline.</p>`
        },
        {
          type: "text",
          content: `<h3>Disability and Chronic Illness</h3>
<p>Disability and chronic illness have direct effects on sexual health that clinicians must address competently because persons with disabilities and chronic illness are sexual beings whose needs are frequently ignored by both medical and mental health providers.</p>
<p>Specific conditions with significant sexual health implications include:</p>
<ul>
<li><strong>Spinal cord injury</strong>: affects genital sensation and sexual response through neurological mechanisms</li>
<li><strong>Multiple sclerosis</strong>: produces variable sexual symptoms from neurological effects</li>
<li><strong>Cancer and its treatments</strong>: affects sexual health through direct tissue effects, hormonal disruption, and psychological impacts</li>
<li><strong>Cardiovascular disease</strong>: affects functioning through vascular mechanisms and fear of cardiac events</li>
<li><strong>Diabetes</strong>: produces sexual dysfunction through both vascular and neurological pathways</li>
</ul>
<p>Clinicians who assess sexual health routinely for clients with these conditions are providing attention that substantially improves quality of life.</p>`
        },
        {
          type: "text",
          content: `<h2>Sexual Health with Older Adults, Chronic Illness, and Diverse Populations</h2>
<h3>Affirming Practice with LGBTQ+ Clients</h3>
<p>Sexual health with LGBTQ+ clients requires specific clinical competencies that go beyond the application of mainstream sexual health frameworks. Same-sex relationships have specific dynamics — including the absence of gender-based complementarity in sexual script expectations — that affect the specific presentations of desire discrepancy, communication challenges, and sexual functioning concerns that present in clinical settings.</p>
<p>LGBTQ+ clients bring to sexual health clinical work both the specific dimensions of their sexual and gender identity experience and the accumulated effects of minority stress, internalized stigma, and healthcare discrimination that may have shaped their relationship with clinical care. Affirming sexual health practice with LGBTQ+ clients requires both specific clinical knowledge and the genuine clinical ease that communicates that LGBTQ+ sexualities are fully normal, fully legitimate, and fully worthy of the same quality of clinical attention as heterosexual cisgender sexuality.</p>
<h3>Transgender and Gender-Diverse Clients</h3>
<p>Transgender and gender-diverse clients who are receiving gender-affirming hormonal or surgical treatment have specific sexual health needs that require clinical knowledge of the effects of these treatments on sexual response:</p>
<ul>
<li><strong>Estrogen therapy in trans women</strong>: affects erectile function and ejaculatory response, may reduce spontaneous desire, and produces changes in erogenous sensitivity</li>
<li><strong>Testosterone therapy in trans men</strong>: produces clitoral enlargement, increased spontaneous desire, and changes in arousal patterns that are clinically significant</li>
<li><strong>Genital affirmation surgery</strong>: creates specific post-surgical sexual health considerations that require specialized knowledge and ideally coordination with the surgical team</li>
</ul>
<p>Clinicians providing sexual health care to transgender clients should seek specialized consultation and training rather than extrapolating from cisgender clinical knowledge alone.</p>
<h3>Cultural Humility in Sexual Health Practice</h3>
<p>Sexual health clinical practice with clients from diverse cultural backgrounds requires the cultural humility that approaches each client's sexual values, practices, and concerns with genuine curiosity rather than assumptions derived from majority cultural frameworks. Religious and spiritual contexts shape sexual values and sexual health concerns in ways that require respectful engagement rather than implicit or explicit challenge.</p>
<p>A client for whom sexual activity outside marriage is profoundly morally significant experiences sexual health concerns in a cultural and moral framework that is different from — but equally valid to — a secular framework that places fewer constraints on sexual expression. The clinician's role is not to adjudicate the client's values but to provide clinical support within the value framework the client has chosen — which may include referral to religious counselors or pastoral care when the intersection of sexual health and spiritual concerns exceeds the clinician's specific competency.</p>
<h3>Integrating Sexual Health into Standard Practice</h3>
<p>The integration of sexual health into standard mental health clinical practice — making sexual health assessment and basic intervention a routine component of comprehensive mental health care rather than a specialty available only to clients who seek out specialized sexual health services — is a professional development priority with significant public health implications. The majority of sexual health concerns presenting in clinical populations are never addressed because they are never assessed.</p>
<p>The clinician who develops the basic competencies required for Permission and Limited Information level sexual health practice — a matter-of-fact clinical ease with sexual health topics, basic sexual health knowledge, and the willingness to inquire directly and non-judgmentally — has developed the capacity to identify and address a dimension of clinical need that is almost universally present in mental health caseloads and almost universally underserved. That capacity, applied consistently across clinical practice, constitutes a genuine contribution to the sexual health and overall wellbeing of every client the clinician serves.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>Elena, 54, presents for anxiety. Sexual history inquiry reveals GSM symptoms — vaginal dryness and dyspareunia — developing over 18 months, leading to complete avoidance of sexual activity with her partner of 22 years. She states: 'I thought it was just aging and nothing could be done.' Clinical response: normalize GSM as treatable; FSFI administration; psychoeducation about local estrogen, lubricants, pelvic floor PT; gynecological referral; couples component addressing intimacy avoidance; permission-giving that sexual health concerns at any age are clinically appropriate.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 2: adult and later-life sexual health assessment and affirming practice, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "Cultural humility in sexual health practice involves:",
          options: [
            "Mastering specific cultural knowledge about each client group",
            "A lifelong learning stance of genuine curiosity rather than expertise claims",
            "Applying only to non-Western clients",
            "Deferring assessment to clients from minority backgrounds"
          ],
          correctAnswer: 1,
          explanation: "Cultural humility — a lifelong orientation of genuine curiosity and self-reflection — differs from competence models suggesting fixed cultural knowledge can be mastered.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Adolescent sexual health assessment requires attention to:",
          options: [
            "Avoiding sexual topics to prevent premature sexualization",
            "Normative context, trauma screening, and confidentiality limits",
            "Mandatory parental disclosure of all sexual activity",
            "Referral to endocrinology for development questions"
          ],
          correctAnswer: 1,
          explanation: "Adolescent sexual health assessment must contextualize within normative development, screen for trauma, and carefully navigate confidentiality.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Referral to an AASECT sex therapist is most clearly indicated when:",
          options: [
            "Any sexual concern is disclosed",
            "Clinical complexity exceeds the generalist's training and competency",
            "Six months of treatment have passed without success",
            "The client explicitly requests sex therapy"
          ],
          correctAnswer: 1,
          explanation: "Referral is indicated when presentation complexity or features exceed the referring clinician's specific training and competency.",
          showExplanation: true
        },
      ],
    },
  ],
  assessment: {
    isExam: true,
    passingScore: 80,
    maxAttempts: 3,
    showExplanations: false,
    questions: [
      {
        question: "The biopsychosocial model of sexual health understands sexual functioning as:",
        type: "multiple_choice",
        options: [
          "Primarily determined by biological factors",
          "The product of interacting biological, psychological, and sociocultural factors",
          "Primarily a psychological phenomenon",
          "Stable across the lifespan unless disrupted by illness"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that sexual functioning is the product of interacting biological, psychological, and sociocultural factors. The biopsychosocial model replaced single-factor models by recognizing that hormonal status, cognitive patterns, attachment, cultural scripts, and relationship context all dynamically interact to shape sexual experience. Viewing sexual functioning as primarily biological is incorrect because it ignores the well-documented psychological and sociocultural contributors that are central to comprehensive clinical formulation."
      },
      {
        question: "Basson's circular model of female sexual response describes:",
        type: "multiple_choice",
        options: [
          "Spontaneous desire as universal baseline",
          "Responsive desire as a normative female pathway distinct from spontaneous desire",
          "The primacy of vaginal orgasm in female response",
          "Hormonal determinants of female desire across the menstrual cycle"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that Basson's model describes responsive desire as a normative female pathway. Basson (2001) proposed a circular model in which desire can emerge in response to erotic stimuli rather than preceding arousal spontaneously, reframing this pattern as normal rather than disordered for many women. The option identifying spontaneous desire as a universal baseline reflects the older linear Masters and Johnson model, which Basson's work specifically challenged."
      },
      {
        question: "A developmentally normative sexual behavior in early childhood includes:",
        type: "multiple_choice",
        options: [
          "Mutual genital touching lasting more than 30 minutes",
          "Genital self-touching during bathing",
          "Sexual role-playing involving penetration",
          "Seeking pornographic material"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is genital self-touching during bathing. The course identifies genital self-exploration as a developmentally expected component of bodily self-discovery in early childhood, typically driven by curiosity rather than sexual intent. Sexual role-playing involving penetration would be a concerning behavior suggesting possible exposure to adult sexual content, which is one of the clinical red flags distinguishing normative exploration from behavior warranting assessment."
      },
      {
        question: "The Permission level of the PLISSIT model involves:",
        type: "multiple_choice",
        options: [
          "Providing specific behavioral techniques",
          "Communicating sexual concerns are clinically appropriate and non-pathological",
          "Conducting formal sexual dysfunction assessment",
          "Referring to an AASECT-certified sex therapist"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is communicating that sexual concerns are clinically appropriate and non-pathological. The Permission level of PLISSIT involves explicitly signaling that sexual health is a legitimate clinical topic, reducing shame and opening the door for clients to discuss concerns. Providing specific behavioral techniques corresponds to the Specific Suggestions level of the model, not the Permission level."
      },
      {
        question: "Genitourinary syndrome of menopause produces:",
        type: "multiple_choice",
        options: [
          "Only psychological effects on sexual functioning",
          "Vulvovaginal changes causing sexual pain that is treatable",
          "Symptoms in fewer than 10% of postmenopausal women",
          "Irreversible changes requiring surgical management"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that GSM produces vulvovaginal changes causing sexual pain that is treatable. GSM results from estrogen decline and affects approximately 50% of postmenopausal women, producing symptoms that respond well to local estrogen therapy, lubricants, and vaginal moisturizers. The option stating it affects fewer than 10% of postmenopausal women significantly underestimates its prevalence and contradicts the course's emphasis on GSM as a common, clinically important condition."
      },
      {
        question: "Sexual health clinical practice with LGBTQ+ clients requires:",
        type: "multiple_choice",
        options: [
          "Applying heteronormative models with minor modifications",
          "Affirming identities while applying culturally humble individualized assessment",
          "Focusing exclusively on identity-related concerns",
          "Automatic referral to LGBTQ+-specialized providers"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is affirming identities while applying culturally humble individualized assessment. The course emphasizes that LGBTQ+ clients require both affirmation of their sexual and gender identities and individualized clinical attention that accounts for minority stress and healthcare discrimination experiences. Applying heteronormative models with minor modifications is incorrect because same-sex and gender-diverse relationships have specific dynamics that mainstream frameworks do not adequately address."
      },
      {
        question: "The most clinically reliable predictor of sexual satisfaction in long-term partnerships is:",
        type: "multiple_choice",
        options: [
          "Frequency of sexual activity",
          "Absence of sexual dysfunction",
          "Quality of emotional intimacy and communication",
          "Matching desire levels between partners"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is quality of emotional intimacy and communication. Research consistently shows that relational factors, particularly emotional connection and open communication about sexual needs, are more predictive of sexual satisfaction than frequency or the absence of dysfunction. Frequency of sexual activity is a common but incorrect assumption, as couples with strong emotional intimacy report high satisfaction even with lower frequency."
      },
      {
        question: "When a child discloses sexual abuse, the immediate clinical obligation is:",
        type: "multiple_choice",
        options: [
          "Conduct a forensic interview first",
          "Contact parents before reporting",
          "Make a mandated report to CPS without delay",
          "Refer to a forensic interviewer before reporting"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is to make a mandated report to CPS without delay. Mental health professionals are mandated reporters, and upon disclosure of child sexual abuse, the legal and ethical obligation is to report immediately to Child Protective Services. Conducting a forensic interview first is incorrect because forensic interviewing is the role of trained forensic specialists, and delaying the report to conduct one would violate mandated reporting requirements."
      },
      {
        question: "Erectile concerns in a 58-year-old man with type 2 diabetes most likely reflect:",
        type: "multiple_choice",
        options: [
          "Exclusively psychological factors",
          "Exclusively vascular factors",
          "A biopsychosocial presentation requiring integrated assessment",
          "Normal aging changes not requiring assessment"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is a biopsychosocial presentation requiring integrated assessment. Diabetes produces sexual dysfunction through both vascular and neurological pathways, while age-related changes, psychological factors such as performance anxiety, and medication effects all interact. Attributing the concern exclusively to vascular factors is incorrect because it ignores the neurological, psychological, and pharmacological contributors that the biopsychosocial model identifies as essential to comprehensive formulation."
      },
      {
        question: "Directed masturbation is the evidence-based first-line intervention for:",
        type: "multiple_choice",
        options: [
          "Erectile disorder",
          "Male hypoactive sexual desire disorder",
          "Female orgasmic disorder",
          "Genito-pelvic pain/penetration disorder"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is female orgasmic disorder. Directed masturbation is a structured, progressive self-stimulation protocol that is well-established as the first-line evidence-based treatment for female orgasmic disorder, with high efficacy rates. Genito-pelvic pain/penetration disorder is incorrect because its first-line treatments typically involve pelvic floor physical therapy, graduated exposure, and pain management rather than directed masturbation."
      },
      {
        question: "The most common medication class associated with sexual dysfunction is:",
        type: "multiple_choice",
        options: [
          "Antihypertensives",
          "Antidepressants (SSRIs/SNRIs)",
          "Antipsychotics",
          "Benzodiazepines"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is antidepressants, specifically SSRIs and SNRIs. The course identifies that these medications produce sexual side effects in 30-40% of users, including reduced desire, arousal difficulties, and delayed orgasm, significantly affecting medication adherence and quality of life. Antihypertensives can also cause sexual dysfunction but are not as frequently associated with it as SSRIs/SNRIs in clinical mental health populations."
      },
      {
        question: "Comprehensive sexual health assessment includes:",
        type: "multiple_choice",
        options: [
          "Sexual functioning only",
          "Sexual functioning, identity, relationship context, and relevant medical/psychosocial history",
          "Sexual history excluding trauma",
          "Current concerns only, without developmental context"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is sexual functioning, identity, relationship context, and relevant medical/psychosocial history. The course emphasizes that comprehensive assessment must attend to the specific nature and duration of concerns, biopsychosocial contributors, developmental and relational context, and medical, pharmacological, and trauma history. Assessing sexual functioning only is incorrect because it omits the identity, relational, and psychosocial dimensions that are essential to biopsychosocial formulation."
      },
      {
        question: "GSM is relevant to clinical practice because:",
        type: "multiple_choice",
        options: [
          "It affects only women with prior sexual dysfunction",
          "Many postmenopausal women experience it and it is highly treatable",
          "It resolves spontaneously in most cases",
          "It is primarily a psychological condition"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that many postmenopausal women experience GSM and it is highly treatable. Approximately 50% of postmenopausal women are affected, and symptoms respond well to local estrogen, lubricants, vaginal moisturizers, and pelvic floor therapy. The option that it affects only women with prior sexual dysfunction is incorrect because GSM is caused by estrogen decline during menopause and can affect any postmenopausal woman regardless of prior sexual functioning."
      },
      {
        question: "Sexual interest and activity in older adults:",
        type: "multiple_choice",
        options: [
          "Typically ceases after age 65",
          "Continues for many individuals into the seventh and eighth decades",
          "Is clinically irrelevant to mental health practice",
          "Should not be assessed to respect older adults' privacy"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that sexual interest and activity continues for many individuals into the seventh and eighth decades. Lindau et al. (2007) found that 73% of adults aged 57-64 and 53% aged 65-74 reported sexual activity in the past year, with most reporting sex remained important to quality of life. The option that it typically ceases after age 65 reflects ageist assumptions contradicted by research documenting ongoing sexual interest and activity well into later life."
      },
      {
        question: "Normative adolescent sexual development includes:",
        type: "multiple_choice",
        options: [
          "Complete sexual abstinence as developmentally appropriate until adulthood",
          "Development of sexual identity and beginning sexual experimentation",
          "Exclusively same-sex attraction as a transitional phase",
          "Sexual activity with older adults as exploration"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is development of sexual identity and beginning sexual experimentation. The course identifies adolescence as encompassing physical maturation, sexual identity development, initiation of sexual experimentation, and navigating sexuality socially, all as normative developmental processes. Complete sexual abstinence as the only developmentally appropriate path until adulthood is incorrect because the course notes that comprehensive sexuality education supporting healthy development is associated with better outcomes than abstinence-only approaches."
      },
    ]
  },
  references: [
      { title: "Human sexuality and its problems (3rd ed.). Churchill Livingstone.", author: "Bancroft, J", year: 2009, source: "sexuality and its problems (3rd ed.). Churchill Livingstone." },
      { title: "Using a different model for female sexual response to address women's problematic low sexual desire. Journal of Sex and", author: "Basson, R", year: 2001, source: "desire. Journal of Sex and Marital Therapy, 27(5), 395–403." },
      { title: "Group mindfulness-based therapy significantly improves sexual desire in women. Behaviour Research and Therapy, 57, 43–5", author: "Brotto, L", year: 2014, source: "desire in women. Behaviour Research and Therapy, 57, 43–54." },
      { title: "Sexual health. https://www.cdc.gov/sexualhealth", author: "Centers for Disease Control and Prevention", year: 2023, source: "ion. (2023). Sexual health. https://www.cdc.gov/sexualhealth" },
      { title: "World Professional Association for Transgender Health standards of care, version 8. International Journal of Transgende", author: "Coleman, E", year: 2022, source: "nternational Journal of Transgender Health, 23(S1), S1–S259." },
      { title: "Seeking medical help for sexual concerns in mid and later life. Journal of Sex Research, 48(2–3), 106–117.", author: "Hinchliff, S", year: 2011, source: "d and later life. Journal of Sex Research, 48(2–3), 106–117." },
      { title: "Disorders of sexual desire. Brunner/Mazel.", author: "Kaplan, H", year: 1979, source: "an, H. S. (1979). Disorders of sexual desire. Brunner/Mazel." },
      { title: "A study of sexuality and health among older adults in the United States. New England Journal of Medicine, 357(8), 762–7", author: "Lindau, S", year: 2007, source: "ed States. New England Journal of Medicine, 357(8), 762–774." },
      { title: "Human sexual response. Little, Brown.", author: "Masters, W", year: 1966, source: "Johnson, V. E. (1966). Human sexual response. Little, Brown." },
      { title: "The Female Sexual Function Index (FSFI). Journal of Sex and Marital Therapy, 26(2), 191–208.", author: "Rosen, R", year: 2000, source: "(FSFI). Journal of Sex and Marital Therapy, 26(2), 191–208." },
      { title: "Guidelines for comprehensive sexuality education (3rd ed.). SIECUS.", author: "Sexuality Information and Education Council of the United States", year: 2004, source: "nes for comprehensive sexuality education (3rd ed.). SIECUS." },
      { title: "A new view of women's sexual problems. Journal of Sex Research, 38(2), 89–96.", author: "Tiefer, L", year: 2001, source: "en's sexual problems. Journal of Sex Research, 38(2), 89–96." },
      { title: "Defining sexual health: Report of a technical consultation. WHO.", author: "World Health Organization", year: 2006, source: "ning sexual health: Report of a technical consultation. WHO." },
      { title: "The new male sexuality (Rev. ed.). Bantam.", author: "Zilbergeld, B", year: 1999, source: "rgeld, B. (1999). The new male sexuality (Rev. ed.). Bantam." },
      { title: "AASECT scope of practice. https://www.aasect.org", author: "American Association of Sexuality Educators, Counselors and Therapists", year: 2023, source: "ts. (2023). AASECT scope of practice. https://www.aasect.org" },
  ]
};

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  SEED: CR-303 — Sexual Health Across the Lifespan: Assessment and Evidence-Based Clinical Practice');
  console.log('='.repeat(60));
  
  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB');

  const Course = mongoose.connection.models.InteractiveCourse ||
    mongoose.model('InteractiveCourse', new mongoose.Schema({}, { strict: false }, 'interactivecourses'));

  const existing = await Course.findOne({ slug: COURSE_DATA.slug });
  if (existing) {
    await Course.updateOne({ _id: existing._id }, { $set: COURSE_DATA });
    console.log('  ✅ UPDATED:', COURSE_DATA.title);
  } else {
    await Course.create(COURSE_DATA);
    console.log('  ✅ CREATED:', COURSE_DATA.title);
  }

  const totalBlocks = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.length || 0), 0
  );
  console.log(`\n  📊 Stats:`);
  console.log(`     CE Hours : 3`);
  console.log(`     Word Count: 18,006`);
  console.log(`     Modules  : ${COURSE_DATA.modules.length}`);
  console.log(`     Blocks   : ${totalBlocks}`);
  console.log(`     Exam Qs  : ${COURSE_DATA.assessment.questions.length}`);
  console.log(`     Status   : draft (review before publishing)\n`);

  await mongoose.disconnect();
  console.log('✅ Done.\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
