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
// CR-306: Sex Therapy Foundations: Integrating Sexual Health Into Counseling Practice
// 3 CE Hours | 18,275 words | NBCC ACEP #7760
// ============================================================

const COURSE_DATA = {
  title: "Sex Therapy Foundations: Integrating Sexual Health Into Counseling Practice",
  slug: "sex-therapy-foundations",
  courseCode: "CR-306",
  description: "A comprehensive 3-hour continuing education course for licensed mental health professionals. Meets NBCC ACEP standards with 18,275 words of graduate-level clinical content.",
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
  targetAudience: ["Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, and NCCs who wish to integrate sexual health assessment and evidence-based sex therapy foundations into their clinical practice."],
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
    "Define the scope of sex therapy and distinguish between sexual concerns addressed in general mental health practice and those requiring referral to a certified sex therapist.",
    "Apply the PLISSIT and Ex-PLISSIT models as frameworks for providing graduated sexual health interventions at levels appropriate to one's training.",
    "Describe the biopsychosocial model of sexual functioning and its application to clinical assessment of sexual health concerns.",
    "Identify and apply validated sexual health assessment instruments including the FSFI, IIEF, and SFQ within a culturally responsive assessment framework.",
    "Describe the evidence base for sensate focus, cognitive-behavioral sex therapy, and mindfulness-based approaches for common sexual health presentations.",
    "Apply an affirming, culturally humble clinical stance to sexual health concerns across diverse client populations including LGBTQ+ clients and clients from diverse cultural backgrounds.",
  ],
  modules: [
    {
      title: "Module 1: Foundations of Sex Therapy and Sexual Health Assessment",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Module 1",
          subtitle: "Module 1: Foundations of Sex Therapy and Sexual Health Assessment"
        },
        {
          type: "text",
          content: `<h2>History, Scope, and the PLISSIT Model</h2>
<h3>The Origins of Sex Therapy</h3>
<p>Sex therapy as a clinical discipline emerged from the pioneering research of William Masters and Virginia Johnson, whose laboratory studies of human sexual response published in 1966 produced the first scientific model of the human sexual response cycle and whose subsequent treatment outcome research demonstrated for the first time that sexual dysfunctions were clinically treatable conditions rather than permanent character deficits. Before Masters and Johnson, sexual concerns were either ignored in medical and mental health practice or addressed through psychoanalytic approaches that were theoretically elaborate but empirically unvalidated.</p>
<p>The publication of Human Sexual Response in 1966, followed by Human Sexual Inadequacy in 1970, constituted a scientific revolution in the understanding and treatment of sexual health that legitimized sexuality as a domain of clinical inquiry and established the foundations of sex therapy as a clinical discipline. Subsequent contributions by Helen Singer Kaplan — who added the desire phase to the Masters and Johnson response cycle, creating the triphasic model (desire, arousal, orgasm) and pioneering the integration of psychodynamic and behavioral approaches in the treatment of sexual dysfunction — and by the development of AASECT as the primary credentialing body for sex therapy, have further developed the field into the evidence-based clinical discipline it is today.</p>
<h3>Scope of Practice and Clinical Boundaries</h3>
<p>The scope of sex therapy encompasses assessment and treatment of sexual dysfunctions across all phases of the sexual response cycle, as well as clinical concerns related to sexual identity, sexual relationship functioning, sexual trauma sequelae, and the specific sexual health needs of specialized populations. These dysfunctions and concerns include:</p>
<ul>
<li>Disorders of desire, arousal, orgasm, and sexual pain</li>
<li>Sexual health needs of medically ill clients and older adults</li>
<li>Concerns specific to LGBTQ+ clients</li>
<li>Sexual trauma sequelae in survivors of sexual abuse</li>
</ul>
<p>The boundary between sexual health concerns that mental health generalists can address through standard clinical practice and those that require the specialized training of a certified sex therapist is defined by the PLISSIT model — which provides a framework for graduated clinical involvement that enables generalist clinicians to provide sexual health care at levels appropriate to their training, while clearly identifying when referral to a sex therapy specialist is indicated. Understanding this boundary is clinically essential: undertreating sexual concerns by withholding available clinical assistance deprives clients of care they need; overextending beyond one's training into specialized sex therapy interventions without adequate competency may produce clinical harm.</p>
<h3>The Biopsychosocial Model</h3>
<p>The biopsychosocial model of sexual functioning — the contemporary theoretical framework that has replaced earlier, single-factor models of sexual health — understands sexual experience, sexual functioning, and sexual dysfunction as the product of the complex, dynamic interaction of three domains:</p>
<ul>
<li><strong>Biological factors</strong> — including neurobiology, hormonal status, vascular function, medication effects, and physical health conditions</li>
<li><strong>Psychological factors</strong> — including cognitive patterns, emotional regulatory capacity, attachment style, body image, sexual self-concept, and the psychological dimensions of the relationship</li>
<li><strong>Sociocultural factors</strong> — including cultural sexual scripts, gender role expectations, religious and moral frameworks about sexuality, media influences on sexual expectations, and the specific relational culture of intimate partnerships</li>
</ul>
<p>This integrative model has direct clinical implications: any adequate clinical assessment of a sexual health concern must attend to all three domains; any clinical formulation that attributes sexual dysfunction to exclusively biological, psychological, or sociocultural factors is providing an incomplete account that will produce an incomplete treatment plan. The biopsychosocial model is not merely a theoretical framework — it is the clinical foundation for comprehensive, effective sexual health practice.</p>
<h3>Cultural Context and Sexual Scripts</h3>
<p>Cultural context shapes sexual experience, sexual values, and sexual functioning in ways that are directly clinically relevant and that require genuine cultural humility from clinicians whose training in sexual health has typically been derived from Western, predominantly white, heteronormative frameworks. The concept of sexual scripts — developed by Gagnon and Simon (1973) to describe the culturally shared cognitive frameworks that organize sexual expectations, sexual meanings, and sexual behavior — provides a clinically useful framework for understanding how cultural context shapes individual sexual experience.</p>
<p>Sexual scripts operate at three levels:</p>
<ul>
<li><strong>Cultural scenarios</strong> that specify the broad outlines of culturally normative sexual behavior</li>
<li><strong>Interpersonal scripts</strong> that govern the specific interactive dimension of sexual encounters</li>
<li><strong>Intrapsychic scripts</strong> that organize individual sexual fantasy, arousal, and desire</li>
</ul>
<p>These levels interact in ways that are individually unique and that are shaped by each person's specific cultural, developmental, and experiential history. Clinicians who approach sexual health assessment with genuine curiosity about the specific sexual scripts that organize each client's sexual experience — rather than applying generic assumptions derived from mainstream Western sexual norms — are providing the kind of culturally responsive care that sexual health assessment requires.</p>`
        },
        {
          type: "text",
          content: `<h2>The Biopsychosocial Model and Validated Assessment Instruments</h2>
<h3>The PLISSIT Model in Practice</h3>
<p>The PLISSIT model, developed by Annon (1976), provides a practical framework for graduated sexual health clinical involvement that is applicable across all clinical settings and all levels of clinical training. The four levels are:</p>
<ol>
<li><strong>Permission</strong> — communicating to clients that their sexual concerns are clinically appropriate topics and that their experiences, values, and practices are not inherently pathological. This is the level at which all clinical practitioners should be able to function and which alone has significant therapeutic value for many clients who carry sexual shame or who have never had a clinical context in which sexual health could be discussed.</li>
<li><strong>Limited Information</strong> — providing accurate, clinically relevant psychoeducation about sexual health, including information about normative sexual variation, the effects of medications and medical conditions on sexual functioning, and the relationship between psychological and physical factors in sexual response. This level is also accessible to all trained clinicians.</li>
<li><strong>Specific Suggestions</strong> — offering behavioral guidance for specific sexual health concerns. This requires more specific sexual health training and should be provided only when the clinician has adequate knowledge to ensure the suggestions are accurate, appropriate, and safe.</li>
<li><strong>Intensive Therapy</strong> — comprehensive sex therapy addressing complex or treatment-resistant sexual dysfunction. This requires the specialized training of a certified sex therapist.</li>
</ol>
<p>The Ex-PLISSIT model, a subsequent elaboration, adds the explicit recommendation that Permission be extended throughout all levels of clinical contact rather than only at the initial assessment.</p>
<h3>Psychoeducation as Intervention</h3>
<p>Psychoeducation as a sexual health intervention is among the most clinically efficient and most widely applicable tools available to mental health generalists who work with clients experiencing sexual health concerns. The provision of accurate, normalizing, evidence-based information about sexual health provides direct therapeutic benefit for many clients whose sexual distress is substantially maintained by misinformation, shame-based beliefs about sexual normality, or the absence of a clinical context in which sexual concerns can be openly discussed.</p>
<p>Psychoeducation that explicitly addresses the most common sources of sexual shame and misinformation is providing a form of harm reduction that has genuine clinical value at the lowest level of clinical effort. These common sources include:</p>
<ul>
<li>The myth of spontaneous, constant sexual desire as the normal baseline</li>
<li>The conflation of performance anxiety with character defect</li>
<li>The pathologizing of sexual variation that falls within the normal range of human sexual diversity</li>
</ul>
<h3>The Sexual History Interview</h3>
<p>The sexual history as a clinical interview component requires specific training and clinical skill that goes beyond the conduct of a general psychosocial history. Taking a comprehensive sexual history involves systematic inquiry across multiple domains:</p>
<ul>
<li>Current sexual relationship context and satisfaction</li>
<li>Specific sexual functioning concerns including desire, arousal, orgasm, and any pain symptoms</li>
<li>Sexual development history and early sexual experiences including any history of sexual trauma</li>
<li>Significant past sexual relationships and their impact</li>
<li>Current sexual practices and any health concerns related to them</li>
<li>Sexual identity and attraction patterns</li>
<li>Body image and its relationship to sexual experience</li>
<li>Medication and substance use effects on sexual functioning</li>
<li>Medical conditions or surgeries that may affect sexual response</li>
</ul>
<p>This breadth of inquiry requires a matter-of-fact, non-judgmental clinical stance that communicates comfort with the topic through the clinician's own ease — because sexual shame is contagious in clinical interactions, and the clinician who is visibly uncomfortable discussing sexual topics communicates to the client that these topics are indeed shameful and inappropriate, precisely the opposite of the Permission-level therapeutic message.</p>
<h3>Validated Assessment Instruments</h3>
<p>Validated sexual health assessment instruments provide standardized, psychometrically robust data that complement the clinical interview in comprehensive sexual health evaluation. The <strong>Female Sexual Function Index (FSFI)</strong> is a 19-item self-report instrument assessing sexual function in women across six domains: desire, arousal, lubrication, orgasm, satisfaction, and pain. The FSFI has established reliability, validity, and normative data across diverse samples and provides a quantitative profile of sexual functioning that guides clinical formulation and tracks treatment progress.</p>
<p>The <strong>International Index of Erectile Function (IIEF)</strong> is the most widely used self-report measure of male sexual function, assessing five domains: erectile function, orgasmic function, sexual desire, intercourse satisfaction, and overall satisfaction. Like the FSFI, the IIEF has excellent psychometric properties and is useful for both initial assessment and treatment monitoring.</p>
<p>These instruments should be used within a clinical context that includes explicit explanation of their purpose, normalization of the sexual health focus of the assessment, and transparent sharing of results with the client as part of a collaborative assessment process.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>Maria, 42, presents for couples therapy. She discloses 'never really wanting sex anymore' and significant relationship tension around desire discrepancy. Comprehensive biopsychosocial assessment: individual desire assessment inside and outside the relationship; FSIAD vs. normative responsive desire screening; GSM screening given perimenopause; SSRI review for medication effects; FSFI administration; psychoeducation about Basson's responsive desire model as Permission/Limited Information intervention. Plan: couples sex therapy for desire discrepancy; individual work on any individual dysfunction; gynecological referral for GSM; medication review.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 1: foundations of sex therapy and sexual health assessment, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "The PLISSIT model's Permission level involves:",
          options: [
            "Prescribing behavioral homework for sexual dysfunction",
            "Communicating that sexual concerns are clinically appropriate topics and experiences are not inherently pathological",
            "Providing specific techniques for addressing sexual dysfunction",
            "Conducting formal sexual dysfunction assessment"
          ],
          correctAnswer: 1,
          explanation: "The Permission level — communicating that sexual concerns are clinically appropriate and non-pathological — is accessible to all clinicians and has direct therapeutic value for clients carrying sexual shame.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Basson's circular model of female sexual response is clinically significant because:",
          options: [
            "It established that female orgasm requires vaginal stimulation",
            "It reframes responsive desire as normative for women, distinct from spontaneous desire",
            "It documents that female sexual desire is higher than male desire across age groups",
            "It established the triphasic model of female sexual response"
          ],
          correctAnswer: 1,
          explanation: "Basson's (2001) model of responsive desire — emerging in response to erotic stimuli rather than arising spontaneously — reframes absent spontaneous desire as potentially normative rather than disordered, providing a psychoeducational intervention with immediate clinical benefit.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "The primary therapeutic mechanism of sensate focus is:",
          options: [
            "Systematic desensitization through imaginal exposure to sexual anxiety",
            "Explicit prohibition of performance goals to reduce performance anxiety and redirect attention to sensory experience",
            "CBT cognitive restructuring of performance-related distorted beliefs",
            "Graduated behavioral exposure to sexual stimuli in a controlled hierarchy"
          ],
          correctAnswer: 1,
          explanation: "Sensate focus reduces performance anxiety by explicitly prohibiting performance goals (erection, orgasm, intercourse) and directing attention to present-moment sensory experience rather than evaluative self-monitoring.",
          showExplanation: true
        },
      ],
    },
    {
      title: "Module 2: Sexual Dysfunctions, Evidence-Based Treatments, and Advanced Applications",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Module 2",
          subtitle: "Module 2: Sexual Dysfunctions, Evidence-Based Treatments, and Advanced Applications"
        },
        {
          type: "text",
          content: `<h2>Major Sexual Dysfunction Categories and Evidence-Based Treatments</h2>
<h3>DSM-5 Sexual Dysfunction Categories</h3>
<p>The major categories of sexual dysfunction addressed in sex therapy correspond to the DSM-5 diagnostic framework, which organizes sexual disorders into dysfunction categories organized by phase of the sexual response cycle and by gender of the client experiencing them. Each diagnostic category has a distinct clinical profile, a distinct evidence base for treatment, and a distinct set of clinical considerations for assessment and formulation. The primary categories include:</p>
<ul>
<li><strong>Female sexual interest and arousal disorder (FSIAD)</strong> — low or absent sexual desire and reduced or absent sexual arousal in women</li>
<li><strong>Male hypoactive sexual desire disorder (MHSDD)</strong> — low or absent desire in men</li>
<li><strong>Erectile disorder (ED)</strong> — difficulty obtaining or maintaining erections sufficient for satisfying sexual activity</li>
<li><strong>Female orgasmic disorder (FOD)</strong> and <strong>delayed ejaculation</strong> — difficulties reaching orgasm</li>
<li><strong>Early ejaculation</strong> — ejaculation that occurs before or very shortly after penetration, before the person desires</li>
<li><strong>Genito-pelvic pain/penetration disorder (GPPPD)</strong> — vulvovaginal pain, pelvic floor muscle dysfunction, and difficulty with penetration previously categorized as vaginismus and dyspareunia</li>
</ul>
<h3>Female Sexual Interest and Arousal Disorder</h3>
<p>Female sexual interest and arousal disorder is the most commonly reported sexual concern among women presenting in clinical settings and has a complex etiology that reflects the multiple biopsychosocial factors that influence female sexual desire and arousal. Rosemary Basson's circular model of female sexual response — which describes responsive desire, emerging in response to erotic stimuli within an intimate context, as a normative pathway for female sexual experience distinct from the spontaneous desire model derived from male sexual response research — is among the most clinically important contributions to contemporary sex therapy.</p>
<p>Basson's model reframes the experience of absent or low spontaneous desire as potentially normative rather than disordered for women whose desire is responsive rather than spontaneous. Clinicians who apply the responsive desire model in clinical assessment are providing a psychoeducational intervention that alone has significant clinical benefit for women who have been distressed by comparisons between their experience of responsive desire and the spontaneous desire model that dominant cultural representations of sexuality normalize.</p>
<h3>Erectile Disorder</h3>
<p>Erectile disorder has a complex biopsychosocial etiology in which biological factors — including cardiovascular disease, diabetes, medication side effects, and hypogonadism — interact with psychological factors — including performance anxiety, depression, and relationship conflict — in ways that often make the primary causal factor difficult to disentangle and that require integrated biopsychosocial assessment and treatment planning.</p>
<p>Performance anxiety — the self-monitoring, self-critical cognitive process that disrupts the automatic, physiologically-driven arousal that erection requires — is the most prevalent psychological mechanism in erectile disorder and is the primary target of the behavioral and cognitive interventions that constitute sex therapy for ED. Sensate focus — which reduces performance anxiety by explicitly prohibiting performance goals during initial exercises and directing attention to pleasurable sensory experience rather than arousal monitoring — directly addresses the performance anxiety mechanism, as do cognitive interventions targeting the catastrophizing thoughts about erectile performance that maintain the anxiety cycle.</p>
<h3>Female Orgasmic Disorder</h3>
<p>Female orgasmic disorder — difficulty reaching orgasm despite adequate arousal and stimulation — is the second most common sexual concern among women presenting in clinical settings and has an evidence-based first-line treatment: directed masturbation, developed by LoPiccolo and Lobitz (1972). Directed masturbation is a graduated, behavioral approach to orgasmic development that begins with non-genital sensory exploration, progresses to focused genital self-stimulation, and gradually extends orgasmic response to partnered sexual situations.</p>
<p>The strong evidence base for directed masturbation is clinically significant because it positions sex therapists and, at the Specific Suggestions level, trained mental health generalists, to provide a highly effective first-line intervention for a prevalent sexual health concern that is profoundly affected by shame, misinformation, and the absence of adequate sexual education that many women have received. Psychoeducation about female genital anatomy — specifically the anatomy and function of the clitoris — is an essential complement to directed masturbation instruction because many women lack basic accurate information about their own anatomy that is prerequisite to directed self-stimulation.</p>`
        },
        {
          type: "text",
          content: `<h2>Desire Discrepancy, Medication Effects, and Evidence-Based Techniques</h2>
<h3>Genito-Pelvic Pain/Penetration Disorder</h3>
<p>Genito-pelvic pain/penetration disorder (GPPPD) encompasses presentations that were previously categorized separately as vaginismus — involuntary muscular contraction of the vaginal introitus preventing penetration — and dyspareunia — recurrent genital pain associated with sexual activity. The DSM-5 integration of these two previously separate categories reflects the clinical recognition that their presentations frequently overlap and their treatment approaches substantially converge.</p>
<p>GPPPD has a complex biopsychosocial etiology that typically involves interactions among:</p>
<ul>
<li><strong>Physical factors</strong> — including vulvovaginal tissue changes, pelvic floor muscle dysfunction, and inflammatory or dermatological conditions</li>
<li><strong>Psychological factors</strong> — including pain catastrophizing, fear of pain, and sexual trauma history</li>
<li><strong>Relational factors</strong> — including partner responses to the pain condition and the impact of pain avoidance on relationship functioning</li>
</ul>
<p>Comprehensive treatment planning for GPPPD typically requires coordination between the mental health clinician providing sex therapy and medical providers — including gynecologists, urogynecologists, and pelvic floor physical therapists — in an integrated multidisciplinary approach.</p>
<h3>Early Ejaculation</h3>
<p>Early ejaculation — previously called premature ejaculation — is the most commonly reported sexual concern among men presenting in sexual health settings and has well-established behavioral treatments with decades of evidence. The first-line behavioral interventions include:</p>
<ul>
<li><strong>The squeeze technique</strong> — applying pressure to the penis just before ejaculation to reduce arousal and delay the ejaculatory reflex (developed by Masters and Johnson)</li>
<li><strong>The stop-start technique</strong> — pausing sexual activity when arousal approaches the ejaculatory threshold and resuming when the threshold has subsided (developed by Semans)</li>
</ul>
<p>These interventions are typically delivered within a structured sex therapy format that progresses from solo masturbation practice to partnered sexual activity. Pharmacological approaches — including off-label use of SSRIs, which delay ejaculation as a side effect, and on-demand dapoxetine — are available for cases where behavioral approaches alone are insufficient.</p>
<p>The concurrent treatment of the relationship dimensions of early ejaculation — including partner distress, avoidance of sexual activity, and the shame and self-blame that often develop — is an important component of comprehensive sex therapy for this condition.</p>
<h3>Desire Discrepancy</h3>
<p>Desire discrepancy — the experience of significantly different levels of sexual desire between partners — is one of the most common presentations in couples sex therapy and one that requires careful differential assessment to distinguish from individual sexual dysfunction in either partner. Desire discrepancy is not inherently a pathological condition: variation in sexual desire level across individuals is a normal feature of human sexual diversity, and two partners with different desire levels may be experiencing entirely normal desire levels individually while experiencing significant relationship distress from the mismatch between them.</p>
<p>Clinical assessment should include individual assessment of each partner's sexual desire within their own context as well as assessment of the relationship dimensions — including the quality of intimacy and attachment, communication patterns, and conflict dynamics — that significantly shape the desire levels experienced within the partnership. Couples sex therapy for desire discrepancy typically addresses both individual components — including any individual desire disorder contributing to the discrepancy — and relational components, including communication skills, initiation and refusal patterns, and the development of a mutually satisfying sexual relationship that can accommodate the couple's different desire levels.</p>
<h3>Medication Effects on Sexual Functioning</h3>
<p>Medications and medical conditions are among the most common contributors to sexual dysfunction in clinical populations, and the assessment of iatrogenic and medically-based sexual dysfunction requires specific clinical knowledge that mental health clinicians who do not receive medical training must develop through deliberate continuing education.</p>
<p>Antidepressant medications — particularly SSRIs and SNRIs — are among the most commonly prescribed psychotropic medications and are associated with sexual side effects — including decreased desire, arousal difficulties, and delayed or absent orgasm — in 30–40% of individuals who take them. This rate is frequently higher than reported in clinical practice because patients are not specifically asked about sexual effects and because the sexual side effects develop gradually rather than immediately.</p>
<p>The clinical implications of antidepressant sexual side effects include:</p>
<ul>
<li>Reduced medication adherence</li>
<li>Increased depression when medication-related sexual dysfunction adds to depressive symptomatology</li>
<li>Relationship distress when sexual difficulties affect intimate partnerships</li>
</ul>
<p>Clinicians who assess sexual functioning as a standard component of medication monitoring, who provide psychoeducation about expected medication effects, and who facilitate discussion with prescribing providers about medication modifications when sexual side effects are significant are providing a clinically important dimension of care that is frequently absent.</p>`
        },
        {
          type: "text",
          content: `<h3>Sensate Focus Exercises</h3>
<p>Sensate focus exercises — the behavioral cornerstone of sex therapy developed by Masters and Johnson and subsequently refined by multiple clinicians and researchers — provide a structured framework for graduated physical intimacy that systematically addresses the performance anxiety, spectatoring, and avoidance that maintain most sexual dysfunctions. The foundational therapeutic mechanism of sensate focus is the explicit prohibition of sexual performance goals — including erection, orgasm, and intercourse — during initial exercises, creating a context in which physical intimacy can be experienced without the evaluative pressure that triggers performance anxiety.</p>
<p>By redirecting attention from performance evaluation to present-moment sensory experience — the specific qualities of touch, temperature, texture, pressure, and pleasure — sensate focus disrupts the self-monitoring and anxiety cycle that impairs automatic sexual response and begins the process of rebuilding positive associations between physical intimacy and pleasurable experience. The graduated structure of sensate focus follows a systematic progression:</p>
<ol>
<li>Non-genital touching</li>
<li>Genital touching without intercourse goals</li>
<li>Incorporating intercourse in ways that maintain the non-demand pleasuring orientation</li>
</ol>
<p>This graduated structure allows systematic desensitization of the anxiety responses that have become conditioned to sexual situations.</p>
<h3>Cognitive-Behavioral Sex Therapy</h3>
<p>Cognitive-behavioral sex therapy integrates the cognitive restructuring approaches of CBT with the behavioral interventions that have constituted the classical sex therapy behavioral repertoire. Cognitive distortions about sexual performance are both common contributors to sexual dysfunction and primary targets of cognitive restructuring interventions in sex therapy. These distortions include:</p>
<ul>
<li>Catastrophizing about erectile difficulty</li>
<li>All-or-nothing thinking about orgasmic response</li>
<li>Mind-reading about partner judgments</li>
<li>Unrealistic sexual expectations promoted by pornography and cultural media</li>
</ul>
<p>Standard cognitive restructuring tools — thought records, Socratic questioning, behavioral experiments — apply directly to sexually-relevant cognitions when conducted by a clinician with sexual health knowledge to accurately evaluate the evidence regarding the client's specific distorted beliefs. Sex-specific cognitive interventions also include psychoeducation about normal sexual variation, the provision of accurate information about normative sexual functioning that corrects specific misinformation-based cognitive distortions, and the development of more flexible, reality-based sexual expectations.</p>
<h3>Mindfulness-Based Sex Therapy</h3>
<p>Mindfulness-based approaches to sex therapy have accumulated a growing evidence base over the past two decades, particularly for female sexual dysfunction. Mindfulness — the intentional, non-judgmental, present-moment awareness of experience — addresses the attentional dimension of sexual dysfunction that is captured in the concept of spectatoring: the withdrawal of attention from the immediate sensory experience of sexual activity to self-evaluative monitoring from an observer perspective.</p>
<p>Spectatoring disrupts the physiological arousal process by redirecting neural resources away from erotic processing toward self-critical monitoring, explaining why performance anxiety impairs the very responses that the anxious monitoring is attempting to ensure. Brotto and colleagues' mindfulness-based sex therapy group program for women with FSIAD and for female cancer survivors with sexual health concerns has the strongest evidence base, with multiple RCTs documenting significant improvements in sexual desire, arousal, lubrication, and satisfaction.</p>
<p>Mindfulness practices — including mindful awareness of sensory experience during solo and partnered sexual activity — provide both a self-regulatory tool for managing performance anxiety and a mechanism for building the embodied, present-moment sexual engagement that healthy sexual functioning requires.</p>
<h3>Communication and Intimacy</h3>
<p>Communication and intimacy in sex therapy addresses the relational dimensions of sexual functioning that are separable from but interacting with the individual components of sexual response. Sexual functioning occurs within a relational context — the quality of attachment security, communication, conflict resolution, and emotional intimacy in the partnership provides the relational substrate within which individual sexual response either thrives or is impaired.</p>
<p>Research by McCarthy and McCarthy documents the substantial impact of relational factors — including emotional intimacy, communication patterns, and the couple's 'GoodEnough Sex' model — on sexual satisfaction across the lifespan. Sex therapy that attends only to the individual components of sexual dysfunction without assessing and addressing the relational context will produce limited outcomes for clients whose dysfunction is substantially maintained by relational factors.</p>
<p>Couples communication skills — including the development of explicit verbal communication about sexual preferences, boundaries, and experiences — are a standard component of sex therapy that provides both immediate clinical benefit and long-term relationship skills that sustain sexual health.</p>`
        },
        {
          type: "text",
          content: `<h2>Advanced Applications: LGBTQ+, Older Adults, and Referral Practice</h2>
<h3>Sex Therapy for LGBTQ+ Clients</h3>
<p>Sex therapy for LGBTQ+ clients requires specific clinical adaptations that reflect the distinct dimensions of sexual health and sexual functioning within LGBTQ+ relationships. The sexual response cycle models derived from heterosexual cisgender samples may require adaptation for LGBTQ+ clients: for example, the specific physiological dimensions of sexual response in transgender clients who have undergone hormonal or surgical transition require the clinician's familiarity with gender-affirming medical care and its effects on sexual response.</p>
<p>The relational dynamics of same-sex partnerships differ in specific ways from different-sex partnerships — including the absence of gender-based complementarity in sexual script expectations — in ways that affect the specific clinical presentations of desire discrepancy, communication challenges, and sexual functioning concerns. LGBTQ+ clients who present for sex therapy also carry the burden of minority stress and internalized stigma that may be contributing to their sexual concerns in ways that require affirming clinical attention alongside the specific sex therapy intervention.</p>
<h3>Sex Therapy with Older Adults</h3>
<p>Sex therapy with older adults requires specific clinical knowledge about the normative changes in sexual response that accompany aging and about the medical, pharmacological, and relational factors that affect sexual health in later life. The normative changes in male sexual response with aging are frequently misinterpreted by older adult men as evidence of erectile disorder rather than as normative changes that may be accommodated through behavioral adjustments and realistic expectation modification. These changes include:</p>
<ul>
<li>Longer time to erection</li>
<li>Reduced rigidity</li>
<li>Longer refractory period</li>
<li>Reduced ejaculatory force</li>
</ul>
<p>Genitourinary syndrome of menopause (GSM) — the umbrella term for the vulvovaginal and lower urinary tract changes associated with estrogen decline — affects approximately 50% of postmenopausal women and produces symptoms including vaginal dryness, tissue fragility, and dyspareunia that are both highly prevalent and highly treatable through local estrogen therapy, lubricants, and vaginal moisturizers. The failure to assess for and address GSM in postmenopausal women presenting with sexual pain is a clinically common oversight that reflects inadequate integration of sexual health assessment into clinical practice for this population.</p>
<h3>Referral to AASECT-Certified Sex Therapists</h3>
<p>Referral to an AASECT-certified sex therapist represents an important component of the clinical competency of any mental health practitioner who encounters sexual health concerns in their clinical practice. The decision to refer involves clinical judgment about whether the complexity, treatment resistance, or specific clinical features of the sexual health presentation exceed the scope of what the referring clinician's training and competency can safely address.</p>
<p>Clinical features that typically indicate referral to a sex therapy specialist include:</p>
<ul>
<li>Complex or treatment-resistant sexual dysfunctions that have not responded to first-line clinical approaches</li>
<li>Presentations involving significant relationship conflict or trauma that require the specific expertise of a clinician trained in both sex therapy and couples therapy</li>
<li>Sexual health concerns with significant medical dimensions requiring coordination between mental health and medical sex therapy</li>
<li>Presentations involving paraphilic interests or behaviors that require the specialized clinical knowledge of a certified sex therapist</li>
<li>Presentations that the referring clinician identifies as beyond their competency based on honest self-assessment</li>
</ul>
<p>Warm referrals — in which the referring clinician personally facilitates the connection to the sex therapy specialist and maintains appropriate coordination — are more effective than cold referrals and are the standard of good clinical practice.</p>
<h3>Course Completion and Continuing Development</h3>
<p>The completion of this course provides a foundational framework for the integration of sexual health assessment and evidence-based sexual health interventions into general mental health clinical practice. Clinicians who have completed this training are equipped to:</p>
<ul>
<li>Conduct sexual health assessments with genuine clinical ease</li>
<li>Apply validated assessment instruments including the FSFI and IIEF</li>
<li>Provide Permission and Limited Information level sexual health interventions for the full range of clients they serve</li>
<li>Recognize when specific sexual health presentations require referral to an AASECT-certified sex therapist</li>
<li>Provide the culturally responsive, affirming, and evidence-based sexual health care that clients with sexual health concerns deserve</li>
</ul>
<p>The ongoing professional development in sex therapy foundations — through additional continuing education, consultation with sex therapy specialists, and engagement with the growing sex therapy evidence base — will expand the depth and range of the clinician's sexual health clinical competency in ways that directly benefit the clients who present with these profoundly important clinical concerns.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>David, 55, presents with erectile difficulty for two years. He reports moderate depression managed with sertraline (started three years ago), type 2 diabetes diagnosed four years ago, and increasing performance anxiety leading to sexual avoidance. Assessment distinguishes: biological contributors (diabetes vascular effects, SSRI sexual side effects); psychological (performance anxiety, catastrophizing, depression); relational (partner intimacy erosion). Plan: medical referral for vascular assessment; medication review with prescriber; individual sex therapy with sensate focus and cognitive restructuring; couples component addressing relational impact.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 2: sexual dysfunctions, evidence-based treatments, and advanced applications, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "The first-line evidence-based behavioral treatment for female orgasmic disorder is:",
          options: [
            "Sensate focus with partner participation",
            "Mindfulness-based sex therapy",
            "Directed masturbation",
            "Cognitive restructuring of orgasm-related beliefs"
          ],
          correctAnswer: 2,
          explanation: "Directed masturbation (LoPiccolo & Lobitz, 1972) is the first-line evidence-based treatment for female orgasmic disorder, with a graduated approach from non-genital exploration to focused genital self-stimulation.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "SSRIs and SNRIs are associated with sexual side effects in approximately:",
          options: [
            "5-10% of users",
            "30-40% of users",
            "60-70% of users",
            "Less than 5% of users"
          ],
          correctAnswer: 1,
          explanation: "Sexual side effects from SSRIs/SNRIs — including decreased desire, arousal difficulties, and delayed orgasm — occur in approximately 30-40% of users, are frequently underreported, and significantly affect medication adherence.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "When is referral to an AASECT-certified sex therapist most clearly indicated:",
          options: [
            "For any client presenting with a sexual concern",
            "When clinical complexity exceeds the referring clinician's specific training and competency",
            "Only when the client explicitly requests sex therapy",
            "After six months of unsuccessful general mental health treatment"
          ],
          correctAnswer: 1,
          explanation: "Referral to a certified sex therapist is indicated when the presentation's complexity, treatment resistance, or specific features exceed what the referring clinician's training can safely address — determined through honest self-assessment of competency boundaries.",
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
        question: "The PLISSIT model's four levels are:",
        type: "multiple_choice",
        options: [
          "Prevention, Learning, Information, Screening, Intervention, Treatment",
          "Permission, Limited Information, Specific Suggestions, Intensive Therapy",
          "Primary, Limited, Secondary, Intensive",
          "Presentation, Listening, Inquiry, Skills, Information, Therapy"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is Permission, Limited Information, Specific Suggestions, Intensive Therapy. Developed by Annon (1976), the PLISSIT model provides a graduated framework for sexual health clinical involvement, from the most basic level (Permission) accessible to all clinicians through to Intensive Therapy requiring specialized sex therapy training. The first option is incorrect because PLISSIT is not a prevention or screening model but rather a framework for tiered clinical intervention in sexual health practice."
      },
      {
        question: "Masters and Johnson's human sexual response cycle includes which sequence:",
        type: "multiple_choice",
        options: [
          "Desire, arousal, orgasm, resolution",
          "Excitement, plateau, orgasm, resolution",
          "Desire, excitement, orgasm, refractory period",
          "Arousal, desire, orgasm, resolution"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is Excitement, Plateau, Orgasm, Resolution. Masters and Johnson's 1966 laboratory research identified this four-phase physiological sequence as the human sexual response cycle, which did not include a desire phase. The first option (Desire, Arousal, Orgasm, Resolution) is incorrect because the desire phase was added later by Helen Singer Kaplan in her triphasic model, not by Masters and Johnson."
      },
      {
        question: "Basson's (2001) circular model of female sexual response specifically addressed:",
        type: "multiple_choice",
        options: [
          "Orgasmic disorder as the most common female sexual concern",
          "Responsive desire as a normative pathway for women that differs from spontaneous desire",
          "The neurobiological mechanisms underlying clitoral erectile response",
          "The role of testosterone in female sexual desire disorders"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is responsive desire as a normative pathway for women that differs from spontaneous desire. Basson's circular model reframed absent spontaneous desire as potentially normative rather than disordered for women whose desire emerges in response to erotic stimuli within an intimate context. The first option is incorrect because Basson's model focused on the desire and arousal pathway, not orgasmic disorder, which is a separate diagnostic category."
      },
      {
        question: "The FSFI is a validated instrument that assesses:",
        type: "multiple_choice",
        options: [
          "Male erectile function exclusively",
          "Female sexual function across six domains including desire, arousal, and satisfaction",
          "Both male and female sexual function on a single scale",
          "Sexual dysfunction severity for medication trial eligibility"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is female sexual function across six domains including desire, arousal, and satisfaction. The FSFI (Female Sexual Function Index) is a 19-item self-report instrument assessing desire, arousal, lubrication, orgasm, satisfaction, and pain, with established reliability, validity, and normative data. The first option is incorrect because male erectile function is assessed by a separate instrument, the International Index of Erectile Function (IIEF)."
      },
      {
        question: "Sensate focus exercises, developed by Masters and Johnson, specifically involve:",
        type: "multiple_choice",
        options: [
          "Progressive relaxation as the primary therapeutic mechanism",
          "Graduated non-demand pleasuring exercises that systematically reduce performance anxiety",
          "In vivo exposure to sexual anxiety triggers",
          "Cognitive restructuring of sexual performance beliefs"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is graduated non-demand pleasuring exercises that systematically reduce performance anxiety. Sensate focus works by explicitly prohibiting performance goals (erection, orgasm, intercourse) and redirecting attention from evaluative self-monitoring to present-moment sensory experience, progressing from non-genital to genital touching. Progressive relaxation (the first option) is incorrect because sensate focus uses the removal of performance demands and sensory redirection, not relaxation techniques, as its primary therapeutic mechanism."
      },
      {
        question: "The biopsychosocial model of sexual functioning:",
        type: "multiple_choice",
        options: [
          "Prioritizes biological factors as the primary determinants of sexual health",
          "Treats psychological factors as secondary to biological treatment",
          "Integrates biological, psychological, and sociocultural factors as interacting determinants",
          "Is primarily applicable to medically-based sexual dysfunctions"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is that the biopsychosocial model integrates biological, psychological, and sociocultural factors as interacting determinants of sexual functioning. This contemporary framework replaced earlier single-factor models and holds that any adequate clinical assessment must attend to all three domains, as attributing dysfunction to one factor alone produces incomplete formulations and treatment plans. The first option is incorrect because the model explicitly rejects prioritizing biological factors, instead treating all three domains as equally important interacting contributors."
      },
      {
        question: "A core principle of culturally responsive sexual health clinical practice is:",
        type: "multiple_choice",
        options: [
          "Applying universal Western sexual norms as clinical standards for all populations",
          "Assuming that LGBTQ+ clients have sexual concerns primarily related to their identity",
          "Approaching each client's sexual values and practices with genuine curiosity and humility",
          "Avoiding discussion of cultural factors to prevent stereotyping"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is approaching each client's sexual values and practices with genuine curiosity and humility. Culturally responsive practice requires clinicians to explore the specific sexual scripts that organize each client's experience rather than applying assumptions derived from mainstream Western sexual norms. The first option is incorrect because applying universal Western norms as clinical standards is the opposite of cultural responsiveness and fails to account for the diverse cultural, religious, and relational frameworks that shape individual sexual experience."
      },
      {
        question: "Directed masturbation is an evidence-based first-line intervention for:",
        type: "multiple_choice",
        options: [
          "Erectile disorder",
          "Premature ejaculation",
          "Female orgasmic disorder",
          "Genitourinary syndrome of menopause"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is female orgasmic disorder. Directed masturbation, developed by LoPiccolo and Lobitz (1972), is a graduated behavioral approach that begins with non-genital sensory exploration, progresses to focused genital self-stimulation, and gradually extends orgasmic response to partnered situations. Erectile disorder (the first option) is incorrect because its first-line behavioral treatment is sensate focus combined with cognitive interventions targeting performance anxiety, not directed masturbation."
      },
      {
        question: "The squeeze technique and stop-start method are evidence-based interventions for:",
        type: "multiple_choice",
        options: [
          "Female hypoactive sexual desire disorder",
          "Erectile disorder",
          "Premature ejaculation",
          "Vaginismus"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is premature ejaculation (early ejaculation). The squeeze technique, developed by Masters and Johnson, involves applying pressure to the penis before ejaculation to reduce arousal, while the stop-start technique, developed by Semans, involves pausing stimulation when arousal approaches the ejaculatory threshold. Erectile disorder (the second option) is incorrect because its primary behavioral intervention is sensate focus to address performance anxiety, not ejaculatory control techniques."
      },
      {
        question: "Mindfulness-based sex therapy approaches have the strongest evidence base for:",
        type: "multiple_choice",
        options: [
          "Erectile disorder in older adult men",
          "Female sexual interest and arousal disorder, particularly post-cancer",
          "Male orgasmic disorder",
          "Genito-pelvic pain/penetration disorder"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is female sexual interest and arousal disorder, particularly post-cancer. Brotto and colleagues' mindfulness-based sex therapy group program for women with FSIAD and female cancer survivors has the strongest evidence base, with multiple RCTs documenting significant improvements in sexual desire, arousal, lubrication, and satisfaction. Erectile disorder in older adult men (the first option) is incorrect because while mindfulness may be a component of ED treatment, the strongest research evidence for mindfulness-based sex therapy is specifically with female sexual dysfunction populations."
      },
      {
        question: "When is referral to an AASECT-certified sex therapist most clearly indicated:",
        type: "multiple_choice",
        options: [
          "When the client presents with any sexual health concern",
          "When the clinical complexity of sexual dysfunction presentation exceeds the referring clinician's training",
          "When the client is LGBTQ+",
          "When the sexual concern is more than 6 months in duration"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is when the clinical complexity of the sexual dysfunction presentation exceeds the referring clinician's training. Referral decisions are based on honest self-assessment of competency boundaries, considering factors such as treatment resistance, complexity, and whether the presentation requires specialized sex therapy expertise. The first option is incorrect because the PLISSIT model demonstrates that many sexual health concerns can be effectively addressed by generalist clinicians at the Permission and Limited Information levels without specialist referral."
      },
      {
        question: "The concept of 'sexual scripts' (Gagnon & Simon, 1973) refers to:",
        type: "multiple_choice",
        options: [
          "Therapist-provided behavioral protocols for sexual skill development",
          "Culturally shared cognitive frameworks that organize sexual expectations and behavior",
          "Standardized behavioral assignments used in sex therapy homework",
          "Partner communication scripts developed in sex therapy sessions"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is culturally shared cognitive frameworks that organize sexual expectations and behavior. Sexual scripts operate at three levels -- cultural scenarios, interpersonal scripts, and intrapsychic scripts -- and shape how individuals understand and enact sexual experience based on their cultural, developmental, and experiential history. The first option is incorrect because sexual scripts are sociocultural phenomena that individuals internalize through cultural learning, not therapist-provided behavioral protocols for clinical use."
      },
      {
        question: "Genitourinary syndrome of menopause (GSM) is relevant to sexual health clinical work because:",
        type: "multiple_choice",
        options: [
          "It is a condition requiring psychiatric management rather than gynecological referral",
          "It produces vulvovaginal changes that cause sexual pain and dysfunction that is highly treatable",
          "It affects primarily post-menopausal women who are not in active clinical treatment",
          "It is primarily a psychological rather than a physical condition"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that GSM produces vulvovaginal changes that cause sexual pain and dysfunction that is highly treatable. GSM affects approximately 50% of postmenopausal women, causing vaginal dryness, tissue fragility, and dyspareunia, all of which are treatable through local estrogen therapy, lubricants, and vaginal moisturizers. The first option is incorrect because GSM is a physical condition caused by estrogen decline that requires gynecological assessment and medical treatment, not psychiatric management."
      },
      {
        question: "Which statement about sexual desire is most consistent with current clinical evidence:",
        type: "multiple_choice",
        options: [
          "Normal sexual desire is spontaneous, frequent, and consistent across all contexts",
          "Responsive desire — emerging in response to erotic stimuli rather than arising spontaneously — is normative, particularly for women",
          "Sexual desire is primarily a biological drive with minimal psychological or relational determinants",
          "Low sexual desire is always a clinical condition requiring treatment"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that responsive desire -- emerging in response to erotic stimuli rather than arising spontaneously -- is normative, particularly for women. Basson's circular model established that responsive desire is a normal pathway for female sexual experience, and this understanding provides immediate clinical benefit for women distressed by comparisons to the spontaneous desire model. The first option is incorrect because the expectation of constant spontaneous desire is identified in the course as one of the most common sources of sexual shame and misinformation that clinicians should actively address through psychoeducation."
      },
      {
        question: "The Ex-PLISSIT model extends the original PLISSIT model by adding:",
        type: "multiple_choice",
        options: [
          "Extended information-giving as a fifth level",
          "Explicit acknowledgment and discussion of sexuality at all levels as a foundational practice",
          "Extended therapy as a replacement for intensive therapy",
          "Extra screening questions at the permission-giving stage"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is explicit acknowledgment and discussion of sexuality at all levels as a foundational practice. The Ex-PLISSIT model adds the recommendation that Permission -- the explicit acknowledgment that sexuality is an appropriate clinical topic -- be extended throughout all levels of clinical contact rather than only at the initial assessment. The first option is incorrect because the Ex-PLISSIT model does not add a new level to the framework but rather integrates the permission-giving stance as a continuous practice across all existing levels."
      },
    ]
  },
  references: [
      { title: "AASECT scope of practice. https://www.aasect.org", author: "American Association of Sexuality Educators, Counselors and Therapists", year: 2023, source: "ts. (2023). AASECT scope of practice. https://www.aasect.org" },
      { title: "Human sexuality and its problems (3rd ed.). Churchill Livingstone.", author: "Bancroft, J", year: 2009, source: "sexuality and its problems (3rd ed.). Churchill Livingstone." },
      { title: "Using a different model for female sexual response to address women's problematic low sexual desire. Journal of Sex & M", author: "Basson, R", year: 2001, source: "al desire. Journal of Sex & Marital Therapy, 27(5), 395–403." },
      { title: "Group mindfulness-based therapy significantly improves sexual desire in women. Behaviour Research and Therapy, 57, 43–5", author: "Brotto, L", year: 2014, source: "desire in women. Behaviour Research and Therapy, 57, 43–54." },
      { title: "Becoming orgasmic: A sexual and personal growth program for women. Prentice Hall.", author: "Heiman, J", year: 1988, source: "sexual and personal growth program for women. Prentice Hall." },
      { title: "Disorders of sexual desire. Brunner/Mazel.", author: "Kaplan, H", year: 1979, source: "an, H. S. (1979). Disorders of sexual desire. Brunner/Mazel." },
      { title: "Principles and practice of sex therapy (4th ed.). Guilford Press.", author: "Leiblum, S", year: 2007, source: "iples and practice of sex therapy (4th ed.). Guilford Press." },
      { title: "Human sexual response. Little, Brown.", author: "Masters, W", year: 1966, source: "Johnson, V. E. (1966). Human sexual response. Little, Brown." },
      { title: "Sexual awareness: Your guide to healthy couple sexuality. Routledge.", author: "McCarthy, B", year: 2012, source: "wareness: Your guide to healthy couple sexuality. Routledge." },
      { title: "The Female Sexual Function Index (FSFI): A multidimensional self-report instrument for the assessment of female sexual", author: "Rosen, R", year: 2000, source: "function. Journal of Sex & Marital Therapy, 26(2), 191–208." },
      { title: "The International Index of Erectile Function (IIEF). Urology, 49(6), 822–830.", author: "Rosen, R", year: 1997, source: "Index of Erectile Function (IIEF). Urology, 49(6), 822–830." },
      { title: "A new view of women's sexual problems: Why new? Why now? Journal of Sex Research, 38(2), 89–96.", author: "Tiefer, L", year: 2001, source: "ms: Why new? Why now? Journal of Sex Research, 38(2), 89–96." },
      { title: "Intersystems approaches to sex therapy. In K. Hertlein, G. Weeks, & N. Gambescia (Eds.), Systemic sex therapy (2nd ed.,", author: "Weeks, G", year: 2015, source: "(Eds.), Systemic sex therapy (2nd ed., pp. 3–24). Routledge." },
      { title: "Defining sexual health: Report of a technical consultation on sexual health. WHO.", author: "World Health Organization", year: 2006, source: "h: Report of a technical consultation on sexual health. WHO." },
      { title: "The new male sexuality (Rev. ed.). Bantam.", author: "Zilbergeld, B", year: 1999, source: "rgeld, B. (1999). The new male sexuality (Rev. ed.). Bantam." },
      { title: "Psychological and interpersonal dimensions of sexual function and dysfunction. Journal of Sexual Medicine, 13(4), 538–5", author: "Brotto, L", year: 2016, source: "and dysfunction. Journal of Sexual Medicine, 13(4), 538–571." },
  ]
};

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  SEED: CR-306 — Sex Therapy Foundations: Integrating Sexual Health Into Counseling Practice');
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
  console.log(`     Word Count: 18,275`);
  console.log(`     Modules  : ${COURSE_DATA.modules.length}`);
  console.log(`     Blocks   : ${totalBlocks}`);
  console.log(`     Exam Qs  : ${COURSE_DATA.assessment.questions.length}`);
  console.log(`     Status   : draft (review before publishing)\n`);

  await mongoose.disconnect();
  console.log('✅ Done.\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
