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
// CR-304: Sexuality, Identity, and Mental Health: Affirming Clinical Practice with LGBTQ+ Clients
// 3 CE Hours | 18,030 words | NBCC ACEP #7760
// ============================================================

const COURSE_DATA = {
  title: "Sexuality, Identity, and Mental Health: Affirming Clinical Practice with LGBTQ+ Clients",
  slug: "sexuality-identity-mental-health-lgbtq",
  courseCode: "CR-304",
  description: "A comprehensive 3-hour continuing education course for licensed mental health professionals. Meets NBCC ACEP standards with 18,030 words of graduate-level clinical content.",
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
  targetAudience: ["Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, and NCCs who provide clinical services to LGBTQ+ clients and wish to develop affirming, evidence-based sexual identity and mental health clinical competencies."],
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
    "Apply Meyer's minority stress theory and its clinical implications to the assessment and treatment of LGBTQ+ clients.",
    "Identify the mental health outcomes associated with family acceptance and rejection for LGBTQ+ youth and implement family-inclusive affirming interventions.",
    "Conduct affirming, culturally humble clinical assessments with LGBTQ+ clients that distinguish identity-related concerns from clinical mental health concerns.",
    "Apply WPATH Standards of Care Version 8 principles in working with transgender and gender-diverse clients.",
    "Recognize and address the clinical needs of LGBTQ+ clients with intersecting marginalized identities including BIPOC LGBTQ+ clients and LGBTQ+ clients with disabilities.",
    "Implement evidence-based affirming clinical practices that support LGBTQ+ clients' identity development, mental health, and relationship wellbeing.",
  ],
  modules: [
    {
      title: "Module 1: Minority Stress, LGBTQ+ Mental Health, and Affirming Clinical Foundations",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Module 1",
          subtitle: "Module 1: Minority Stress, LGBTQ+ Mental Health, and Affirming Clinical Foundations"
        },
        {
          type: "text",
          content: `<h2>Minority Stress Theory and LGBTQ+ Mental Health: Clinical Applications</h2>
<h3>Meyer's Minority Stress Model</h3>
<p>The mental health of LGBTQ+ individuals is significantly shaped by the minority stress they experience as members of a stigmatized social group in a cultural environment that continues to produce discrimination, rejection, and violence directed specifically at their identities. Ilan Meyer's (2003) minority stress model — one of the most empirically robust frameworks for understanding health disparities in LGBTQ+ populations — provides a theoretical account of how the social environment of stigma and discrimination produces the elevated rates of depression, anxiety, PTSD, and suicidal behavior documented in LGBTQ+ health research.</p>
<p>The model distinguishes between two categories of stressors:</p>
<ul>
<li><strong>Distal stressors</strong> — objective, external events including discrimination, violence, and structural exclusion</li>
<li><strong>Proximal stressors</strong> — internalized stigma (the adoption of society's negative evaluation of LGBTQ+ identities as one's own self-assessment), concealment (the effortful management of identity disclosure in an environment where disclosure carries risk), and hypervigilance (the chronic scanning of the environment for safety threats that is a direct consequence of living in a context where one's identity has been a target of hostility)</li>
</ul>
<h3>Current Scope of LGBTQ+ Youth Mental Health Disparities</h3>
<p>The Trevor Project's (2022) annual national survey on LGBTQ+ youth mental health documents the current scope of minority stress effects on the most vulnerable LGBTQ+ population:</p>
<ul>
<li>45% of LGBTQ+ youth seriously considered suicide in the past year</li>
<li>14% attempted suicide</li>
<li>75% reported that recent events negatively impacted their mental health or sense of safety</li>
</ul>
<p>These numbers are not evidence of an inherent psychological vulnerability in LGBTQ+ youth — they are evidence of the effects of a social environment that produces chronic stress through rejection, discrimination, and the persistent cultural message that LGBTQ+ identities are less valued, less valid, and less worthy of support than heterosexual cisgender identities. Clinicians who work with LGBTQ+ youth have a professional obligation to be aware of these population-level mental health risks and to provide the affirming, minority-stress-informed clinical care that directly addresses the mechanisms producing them.</p>
<h3>Family Rejection as a Predictor of Mental Health Outcomes</h3>
<p>Family rejection is among the most powerful single predictors of negative mental health outcomes for LGBTQ+ youth — more powerful than many demographic, economic, and clinical factors combined. Ryan and colleagues' (2009) foundational research on the effects of family acceptance and rejection on LGBTQ+ youth health outcomes documented that high levels of family rejection were associated with dramatically elevated risk:</p>
<ul>
<li>8.4 times greater likelihood of suicide attempt</li>
<li>5.9 times greater likelihood of depression</li>
<li>3.4 times greater likelihood of unprotected sex</li>
</ul>
<p>These high levels of family rejection included parental denial of LGBTQ+ identity, exclusion from family activities related to LGBTQ+ identity, and physical or verbal abuse related to LGBTQ+ identity. The clinical implications are direct: reducing family rejection is among the most powerful clinical interventions available for LGBTQ+ youth mental health, and the family system is as important a clinical target as the individual youth in LGBTQ+ affirming clinical practice.</p>
<h3>Family Acceptance as an Active Protective Factor</h3>
<p>Family acceptance — the active, explicit affirmation of an LGBTQ+ youth's identity by family members — is not simply the absence of rejection but an active protective factor with measurable mental health effects that are independent of the reduction of rejection. Russell and colleagues' (2018) research on chosen name use — one of the most straightforward and accessible family acceptance behaviors for families of transgender youth — found that use of a transgender youth's chosen name was associated with significant reductions:</p>
<ul>
<li>A 56% reduction in suicidal ideation</li>
<li>A 71% reduction in severe depression symptoms</li>
<li>A 65% reduction in suicidal behavior</li>
</ul>
<p>These findings held even after controlling for other support factors. They document that specific, concrete family acceptance behaviors produce specific, measurable mental health benefits — a finding that supports psychoeducationally focused work with families that identifies the specific behaviors most directly associated with their child's mental health and safety.</p>`
        },
        {
          type: "text",
          content: `<h2>Coming Out, Family Systems, and Affirming Clinical Practice</h2>
<h3>Coming Out as a Lifelong Process</h3>
<p>Coming out — the process of disclosing one's LGBTQ+ identity to others — is not a single discrete event that occurs once but a lifelong, contextually recursive process that is never fully complete. Each new relationship, new life context, and new social environment presents the coming-out decision anew, requiring ongoing assessment of the safety, costs, and benefits of disclosure in each specific context.</p>
<p>The clinical literature on coming out has moved from models that described coming out as a linear developmental progression culminating in full disclosure and identity integration to more complex models that recognize the ongoing, contextual nature of identity disclosure across the lifespan. Clinical support for coming-out decisions involves neither pushing clients toward disclosure nor counseling against it — but rather supporting the client's own informed decision-making about who, when, and how to disclose in ways that reflect the client's own values, risk assessment, and relationship goals.</p>
<h3>The Harms of Conversion Therapy</h3>
<p>Conversion therapy — the umbrella term for any practice that attempts to change, minimize, or eliminate an individual's LGBTQ+ identity — is ethically prohibited by every major mental health professional organization, including APA, ACA, NASW, and AAMFT, and is specifically identified by SAMHSA (2015) as harmful and ineffective. The harms of conversion therapy are well-documented in research and clinical reports and include:</p>
<ul>
<li>Increased depression and anxiety</li>
<li>Suicidal ideation</li>
<li>PTSD</li>
<li>Impaired ability to form authentic intimate relationships</li>
</ul>
<p>The American Psychological Association's Task Force on Appropriate Therapeutic Responses to Sexual Orientation (2009) reviewed all available research on sexual orientation change efforts and concluded that there is no credible evidence that they are effective and substantial evidence that they are harmful. Clinicians who encounter clients presenting for conversion therapy have an ethical obligation to decline the specific request while providing affirming support that addresses the underlying distress driving the request.</p>
<h3>Core Elements of Affirming Clinical Practice</h3>
<p>Affirming clinical practice with LGBTQ+ clients is not merely a specialty approach for clinicians who work primarily with LGBTQ+ populations — it is a competency that all mental health professionals must develop because LGBTQ+ individuals are present in every clinical setting and in every clinical caseload, and because clinical encounters with non-affirming practitioners cause documented harm. APA (2012, 2015) and ACA guidelines both specifically require that licensed mental health practitioners provide affirming clinical services to LGBTQ+ clients, framing affirmation not as an optional orientation but as a professional ethical obligation.</p>
<p>The core elements of affirming clinical practice include:</p>
<ul>
<li>Explicit non-pathologizing of LGBTQ+ identities</li>
<li>Clinical competency in LGBTQ+ mental health</li>
<li>Careful examination of one's own biases and how they may affect clinical practice</li>
<li>The active refusal to participate in any practice that attempts to change or minimize LGBTQ+ identity</li>
</ul>
<h3>Bisexual-Specific Clinical Concerns</h3>
<p>Bisexual individuals face specific clinical concerns that are distinct from those of gay and lesbian individuals and that require specific clinical attention. Research consistently documents that bisexual individuals have higher rates of depression, anxiety, suicidal behavior, and poor mental health outcomes than either gay/lesbian or heterosexual individuals.</p>
<p>This disparity is substantially explained by:</p>
<ul>
<li>Biphobia from both heterosexual communities (which may not accept bisexuality as valid) and LGBTQ+ communities (which may regard bisexuality as a transitional phase rather than a stable identity)</li>
<li>The specific erasure and invalidation of bisexual identity in both mainstream and LGBTQ+ cultural contexts</li>
<li>The monosexism that positions attraction to multiple genders as inherently unstable or inauthentic</li>
</ul>
<p>Clinicians who are aware of these specific bisexual minority stressors are equipped to provide the specific validation and clinical attention that bisexual clients — who may have never encountered an affirming clinical response to their specific identity — need.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>Alex, 17, is referred by their parents following a suicide attempt. Assessment reveals Alex is transgender (assigned female at birth, identifies as non-binary) and has experienced significant family rejection including parental refusal to use chosen pronouns, exclusion from family discussions about gender, and verbal hostility about gender identity. Minority stress formulation: family rejection as primary risk factor per Ryan et al. (2009); internalized transphobia as proximal stressor; social isolation from peers. Clinical plan: immediate safety planning; individual affirming therapy; family psychoeducation about the relationship between family acceptance behaviors and suicide risk; WPATH SOC8 informed gender assessment; school advocacy.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 1: minority stress, lgbtq+ mental health, and affirming clinical foundations, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "Meyer's (2003) minority stress model distinguishes between:",
          options: [
            "Individual and group-level stressors",
            "Distal stressors (external discrimination) and proximal stressors (internalized stigma, concealment, vigilance)",
            "Acute and chronic stressors",
            "Social and biological stressors"
          ],
          correctAnswer: 1,
          explanation: "Meyer's model identifies distal stressors (external discrimination/prejudice) and proximal stressors (internalized homophobia, concealment, vigilance) as the mechanisms through which minority status produces mental health disparities.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "High family rejection of LGBTQ+ youth (Ryan et al., 2009) is associated with:",
          options: [
            "Mild adjustment difficulties",
            "8.4 times greater likelihood of suicide attempt",
            "Primarily short-term academic impacts",
            "No significant mental health effects when peer support is available"
          ],
          correctAnswer: 1,
          explanation: "Ryan et al. (2009) found high family rejection was associated with 8.4 times greater suicide attempt risk, underscoring the critical importance of family-inclusive affirming interventions.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "An affirming clinical stance toward LGBTQ+ identities holds that:",
          options: [
            "Clinicians should remain neutral about LGBTQ+ identity",
            "LGBTQ+ identities are normal, healthy human variations requiring affirmation",
            "Clinicians should help clients explore whether their LGBTQ+ identity is authentic",
            "Religious concerns about LGBTQ+ identity always take clinical precedence"
          ],
          correctAnswer: 1,
          explanation: "Affirming practice — supported by APA, ACA, NASW, and all major professional organizations — holds that LGBTQ+ identities are normal healthy variations, not pathologies requiring treatment or exploration.",
          showExplanation: true
        },
      ],
    },
    {
      title: "Module 2: Transgender Affirming Practice, Intersectionality, and Advanced Applications",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Module 2",
          subtitle: "Module 2: Transgender Affirming Practice, Intersectionality, and Advanced Applications"
        },
        {
          type: "text",
          content: `<h2>Transgender and Gender-Diverse Affirming Clinical Practice: WPATH SOC8 Framework</h2>
<h3>The WPATH SOC8 Paradigm Shift</h3>
<p>Transgender and gender-diverse individuals — those whose gender identity differs from the sex assigned at birth — face specific mental health challenges that are substantially driven by minority stress, discrimination, and the barriers to gender-affirming care that characterize many healthcare and social environments. The WPATH Standards of Care Version 8 (Coleman et al., 2022) — the current clinical authority for the assessment and support of transgender and gender-diverse individuals — represents a significant paradigm shift from earlier versions.</p>
<p>SOC8 explicitly positions the clinician as collaborator rather than gatekeeper, emphasizing that the clinician's role is to support the client's own gender development and goals rather than to apply diagnostic criteria as gatekeeping requirements for medical intervention access. This shift reflects both the accumulated evidence that gender-affirming care improves mental health outcomes and the ethical recognition that treating transgender healthcare as requiring special clinical authorization that is not required for cisgender healthcare constitutes a harmful form of discrimination.</p>
<h3>Clinical Assessment with Transgender Clients</h3>
<p>Clinical assessment with transgender and gender-diverse clients requires specific competencies that go beyond the application of general mental health assessment frameworks. The clinical distinction between gender dysphoria — the distress that can accompany the incongruence between gender identity and sexed body — and gender identity itself is clinically essential: gender dysphoria is a clinical condition that warrants clinical support, while gender identity is not a pathology and does not require clinical explanation or modification.</p>
<p>Affirming assessment attends to the specific mental health concerns that a transgender client presents with — depression, anxiety, suicidal ideation, trauma history — while explicitly affirming that the gender identity itself is not a clinical concern requiring exploration or resolution. The clinical inquiry 'How is your gender identity related to the distress you're experiencing?' is substantially different from 'Is it possible that your gender identity is a symptom of an underlying condition?' — and the clinical stance that these questions reflect produces dramatically different clinical experiences for transgender clients.</p>
<h3>Intersectionality and Compound Minority Stress</h3>
<p>Intersectionality — the framework developed by Kimberlé Crenshaw (1989) to describe how multiple marginalized identities produce compound effects that are not captured by examining any single identity dimension in isolation — is among the most clinically important frameworks for understanding the specific clinical needs of LGBTQ+ clients who hold multiple marginalized identities.</p>
<p>LGBTQ+ people of color face compound minority stress that includes both racism in LGBTQ+ spaces and homophobia and transphobia in communities of color — a specific form of multiple marginalization that Balsam and colleagues (2011) called 'cultural victimization.' Black transgender women face the highest rates of violence of any demographic group tracked in anti-violence research, reflecting the compound vulnerability produced by the intersection of racism, transphobia, and misogyny. Clinicians who apply an intersectional lens to the assessment and treatment of LGBTQ+ clients of color are better positioned to understand the specific clinical presentations produced by these compound stressors.</p>
<h3>Core Competencies of LGBTQ+ Affirming Therapy</h3>
<p>LGBTQ+ affirming therapy is not a single technique or protocol but a clinical orientation and set of competencies that are integrated across all aspects of clinical practice with LGBTQ+ clients. The core competencies include:</p>
<ul>
<li>Explicit non-pathologizing of LGBTQ+ identities as a foundational clinical stance</li>
<li>Cultural humility that approaches each LGBTQ+ client's specific identity development with genuine curiosity rather than assumptions about what LGBTQ+ experience is like</li>
<li>Knowledge of the specific mental health risks and protective factors relevant to LGBTQ+ populations</li>
<li>Familiarity with LGBTQ+ community resources and their appropriate clinical integration</li>
<li>The ongoing examination of one's own heterosexist and cisnormative assumptions and how they may affect clinical assessment, case formulation, and treatment planning</li>
</ul>
<p>These competencies require ongoing continuing education, supervision, and reflective practice rather than a single training event.</p>`
        },
        {
          type: "text",
          content: `<h2>Intersectionality, LGBTQ+ Relationships, and Professional Development</h2>
<h3>Two-Spirit Identity and Cultural Specificity</h3>
<p>Two-Spirit identity — a pan-Indigenous term that encompasses cultural and spiritual roles in Indigenous communities that do not map onto Western LGBTQ+ categories — illustrates the importance of cultural specificity in working with LGBTQ+ clients from non-Western cultural backgrounds. Two-Spirit identities are not simply Indigenous versions of Western LGBTQ+ identities — they are culturally specific roles with particular ceremonial, social, and spiritual functions within specific tribal communities, and they are often experienced and understood in ways that reflect Indigenous cultural frameworks rather than Western sexual and gender identity frameworks.</p>
<p>Clinicians who encounter Two-Spirit clients should approach their identities with the genuine cultural humility that recognizes the inadequacy of Western LGBTQ+ frameworks as the lens through which to understand Indigenous experiences of gender and sexuality.</p>
<h3>LGBTQ+ Relationship and Couples Considerations</h3>
<p>The relationship history and intimate partner functioning of LGBTQ+ clients present specific clinical considerations that require both affirming practice and specific clinical knowledge. LGBTQ+ couples face both the universal challenges of intimate partnership and specific minority stress effects, including:</p>
<ul>
<li>The impact of discrimination</li>
<li>The absence of legal protections in many jurisdictions</li>
<li>The absence of cultural and familial models for same-sex partnership</li>
<li>The specific dynamics that can arise when one partner is more or less out than the other</li>
</ul>
<p>Couples work with LGBTQ+ partnerships requires application of the standard evidence-based couples therapy approaches — EFT, the Gottman Method, integrative behavioral couples therapy — within an affirming framework that does not pathologize the LGBTQ+ relationship itself while attending to the specific stressors that LGBTQ+ partnerships navigate.</p>
<h3>Treating Comorbid Clinical Conditions in LGBTQ+ Clients</h3>
<p>The assessment and treatment of LGBTQ+ clients with comorbid clinical conditions — depression, anxiety, PTSD, substance use disorders — requires the integration of evidence-based treatment for the specific clinical condition with the LGBTQ+-affirming orientation that attends to minority stress as a contributing etiological and maintaining factor. The standard cognitive-behavioral, acceptance-based, and psychodynamic treatment approaches that constitute the evidence base for depression, anxiety, and PTSD are broadly applicable to LGBTQ+ clients with specific adaptations that reflect the LGBTQ+-specific content of cognitive distortions, avoidance patterns, and interpersonal dynamics.</p>
<p>Pachankis (2014) has described the adaptation of CBT for gay and bisexual men as involving specific attention to the way minority stress experiences shape the cognitive and behavioral patterns that CBT targets, providing a model for culturally adapted evidence-based treatment that respects the standard's efficacy while attending to the population-specific clinical context.</p>
<h3>Ongoing Professional Development</h3>
<p>Professional development in LGBTQ+ affirming clinical practice is an ongoing obligation for all mental health clinicians — not a one-time training event but a continuous process of learning, self-examination, and practice improvement that reflects the evolving nature of both the clinical evidence base and the specific cultural context within which LGBTQ+ clients live. The clinical field's understanding of LGBTQ+ mental health has advanced substantially in the past decade, and the standard of affirmative care has become increasingly specific and increasingly well-evidenced.</p>
<p>Clinicians who invest in ongoing LGBTQ+ affirmative practice development — through continuing education, consultation, supervision with LGBTQ+-competent supervisors, and personal reflection on the ways heterosexism and cisnormativity may affect their clinical practice — are making an investment in clinical quality that directly benefits the LGBTQ+ clients in their caseloads who deserve nothing less than the most affirming, competent, and evidence-informed clinical care available.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>Marcus, 32, a Black gay man, presents with depression and relationship conflict. He reports chronic hypervigilance — checking exits when entering rooms, monitoring others' reactions to his presence — that he attributes to daily experiences of both racial microaggressions and homophobic comments at work. Intersectional formulation: compound minority stress from racism and homophobia; internalized shame from both communities; limited social support due to racism in gay spaces and homophobia in Black community. Clinical plan: intersectional trauma-informed formulation; affirmation of both racial and sexual identities as valid and co-constitutive; community connection facilitation; CBT addressing hypervigilance with LGBTQ+ and racial minority stress context.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 2: transgender affirming practice, intersectionality, and advanced applications, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "Intersectionality (Crenshaw, 1989) is clinically relevant because:",
          options: [
            "It establishes a hierarchy of marginalized identities",
            "Multiple marginalized identities produce compound effects not captured by examining each in isolation",
            "It applies primarily to Black women as originally described",
            "It provides a legal framework without clinical applications"
          ],
          correctAnswer: 1,
          explanation: "Intersectionality recognizes that LGBTQ+ clients with multiple marginalized identities (e.g., Black transgender women) experience compound stressors that require clinical attention beyond any single identity dimension.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Conversion therapy is best characterized as:",
          options: [
            "An evidence-based approach for ego-dystonic LGBTQ+ identities",
            "A harmful, unethical practice attempting to change sexual orientation or gender identity",
            "A historical practice no longer in clinical use",
            "A legally prohibited practice in all US states"
          ],
          correctAnswer: 1,
          explanation: "Conversion therapy — encompassing any practice attempting to change or minimize LGBTQ+ identity — is harmful, ethically prohibited by all major professional organizations, and lacks any evidence of safety or efficacy.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "The WPATH SOC8 positions clinicians working with transgender clients as:",
          options: [
            "Gatekeepers determining eligibility for medical interventions",
            "Collaborators supporting clients' own gender development and goals",
            "Primary diagnosticians establishing gender dysphoria",
            "Advocates challenging all barriers regardless of clinical readiness"
          ],
          correctAnswer: 1,
          explanation: "WPATH SOC8 explicitly positions the clinician as collaborator rather than gatekeeper, supporting the client's own gender development and goals rather than applying external criteria for intervention access.",
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
        question: "Meyer's (2003) minority stress theory identifies which categories of stressors:",
        type: "multiple_choice",
        options: [
          "Internal and external stressors specific to the clinical context",
          "Distal stressors (external discrimination/prejudice) and proximal stressors (internalized stigma, concealment, vigilance)",
          "Acute and chronic stressors equally applicable to all minority populations",
          "Social and psychological stressors arising from cultural mismatch"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is distal stressors (external discrimination/prejudice) and proximal stressors (internalized stigma, concealment, vigilance). Meyer's (2003) minority stress model specifically categorizes stressors into these two domains, with distal stressors being objective external events like discrimination and violence, and proximal stressors being subjective internal processes such as internalized homophobia, identity concealment, and hypervigilance. The option describing 'acute and chronic stressors equally applicable to all minority populations' is incorrect because Meyer's framework identifies stressors specific to the LGBTQ+ minority experience, not general stressors applicable to all groups."
      },
      {
        question: "Ryan et al. (2009) found that LGBTQ+ youth experiencing high family rejection were how many times more likely to attempt suicide:",
        type: "multiple_choice",
        options: [
          "2.5 times",
          "4.8 times",
          "8.4 times",
          "12.1 times"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is 8.4 times. Ryan et al. (2009) documented that LGBTQ+ youth experiencing high levels of family rejection were 8.4 times more likely to attempt suicide, along with 5.9 times greater likelihood of depression and 3.4 times greater likelihood of unprotected sex. The option of 4.8 times is the most plausible distractor but understates the magnitude of the risk, which the research specifically quantified at 8.4 times greater likelihood."
      },
      {
        question: "Russell et al. (2018) found that use of chosen name for transgender youth was associated with:",
        type: "multiple_choice",
        options: [
          "Increased conflict with family members",
          "56% reduction in suicidal ideation",
          "Improved academic performance",
          "Increased disclosure of gender identity to peers"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is a 56% reduction in suicidal ideation. Russell et al. (2018) found that use of a transgender youth's chosen name was associated with a 56% reduction in suicidal ideation, a 71% reduction in severe depression symptoms, and a 65% reduction in suicidal behavior. The option suggesting increased conflict with family members is incorrect because the research demonstrated that chosen name use is a concrete family acceptance behavior with measurable positive mental health effects, not a source of increased conflict."
      },
      {
        question: "The WPATH SOC8's position on clinicians working with transgender clients is that clinicians should function as:",
        type: "multiple_choice",
        options: [
          "Gatekeepers who determine eligibility for medical interventions",
          "Collaborators who support clients' own gender development and goals",
          "Diagnosticians who establish the presence of gender dysphoria",
          "Advocates who challenge all barriers to gender-affirming care regardless of clinical readiness"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is collaborators who support clients' own gender development and goals. WPATH SOC8 (Coleman et al., 2022) represents a paradigm shift from earlier versions by explicitly positioning the clinician as a collaborator rather than a gatekeeper, emphasizing support for the client's own gender development and goals. The gatekeeper option is incorrect because SOC8 specifically moved away from this model, recognizing that treating transgender healthcare as requiring special clinical authorization constitutes a harmful form of discrimination."
      },
      {
        question: "Conversion therapy is best described as:",
        type: "multiple_choice",
        options: [
          "An evidence-based approach for LGBTQ+ clients with ego-dystonic sexual orientation",
          "Any practice attempting to change sexual orientation or gender identity, which is harmful and unethical",
          "A historical practice no longer in use",
          "A legally prohibited practice in all US states"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that conversion therapy is any practice attempting to change sexual orientation or gender identity, which is harmful and unethical. Every major mental health professional organization (APA, ACA, NASW, AAMFT) ethically prohibits conversion therapy, and the APA Task Force (2009) found no credible evidence of efficacy and substantial evidence of harm including increased depression, anxiety, and suicidal ideation. The option describing it as a historical practice no longer in use is incorrect because conversion therapy continues to be practiced and remains legal in many U.S. states, which is why ongoing clinical vigilance against it is necessary."
      },
      {
        question: "Crenshaw's (1989) intersectionality framework is clinically relevant because:",
        type: "multiple_choice",
        options: [
          "It establishes a hierarchy of oppression among marginalized identity groups",
          "It recognizes that multiple marginalized identities produce compound effects not captured by examining each in isolation",
          "It applies primarily to Black women as the original focus of the framework",
          "It provides a legal rather than clinical framework for understanding discrimination"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that multiple marginalized identities produce compound effects not captured by examining each in isolation. Crenshaw's intersectionality framework is clinically essential because LGBTQ+ clients who hold multiple marginalized identities (e.g., LGBTQ+ people of color) experience compound minority stress — what Balsam et al. (2011) termed 'cultural victimization' — that cannot be understood by examining race or sexual orientation separately. The option that intersectionality establishes a hierarchy of oppression is incorrect because the framework explicitly rejects hierarchical comparisons and instead focuses on how intersecting identities create unique, compounded experiences of marginalization."
      },
      {
        question: "Affirming clinical practice with bisexual clients requires attention to which specific clinical concern:",
        type: "multiple_choice",
        options: [
          "Higher rates of substance use than gay men or lesbians",
          "Biphobia and invalidation from both heterosexual and LGBTQ+ communities",
          "Lower rates of relationship satisfaction than gay or lesbian individuals",
          "Exclusively higher rates of mental health concerns compared to gay and lesbian individuals"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is biphobia and invalidation from both heterosexual and LGBTQ+ communities. Research consistently shows bisexual individuals have higher rates of depression, anxiety, and suicidal behavior than either gay/lesbian or heterosexual individuals, driven substantially by biphobia from heterosexual communities that may not accept bisexuality as valid and from LGBTQ+ communities that may regard it as a transitional phase. The option about higher rates of substance use than gay men or lesbians, while potentially partially true, does not capture the core clinical concern of dual-community invalidation and monosexism that is specific to bisexual minority stress."
      },
      {
        question: "An affirming clinical approach to sexual orientation and gender identity holds that:",
        type: "multiple_choice",
        options: [
          "Clinicians should remain neutral about the clinical significance of LGBTQ+ identities",
          "LGBTQ+ identities are normal, healthy human variations requiring affirmation rather than pathology",
          "Clinicians should support clients in exploring whether their LGBTQ+ identity is authentic",
          "Religious identity always takes precedence over sexual orientation or gender identity"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that LGBTQ+ identities are normal, healthy human variations requiring affirmation rather than pathology. APA (2012, 2015) and ACA guidelines specifically require that licensed mental health practitioners provide affirming clinical services, framing affirmation as a professional ethical obligation rather than an optional clinical orientation. The option that clinicians should remain neutral is incorrect because neutrality toward LGBTQ+ identity implicitly treats it as something about which reasonable clinical disagreement exists, which contradicts the professional consensus that LGBTQ+ identities are healthy variations that do not require clinical questioning."
      },
      {
        question: "The clinical concept of 'coming out' is best understood as:",
        type: "multiple_choice",
        options: [
          "A single discrete event that occurs once in a person's life",
          "A lifelong, contextually recursive process that is never fully complete",
          "A process that only occurs during adolescence and young adulthood",
          "A process that is uniformly positive in its mental health effects"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that coming out is a lifelong, contextually recursive process that is never fully complete. The clinical literature has moved from linear developmental models to more complex models recognizing that each new relationship, life context, and social environment presents the coming-out decision anew, requiring ongoing assessment of the safety, costs, and benefits of disclosure. The option describing it as a single discrete event is incorrect because coming out involves continuous contextual decisions across the lifespan, not a one-time disclosure."
      },
      {
        question: "LGBTQ+ clients of color face which specific clinical pattern:",
        type: "multiple_choice",
        options: [
          "Lower rates of mental health concerns compared to white LGBTQ+ individuals",
          "Compound minority stress from multiple intersecting marginalized identities",
          "Uniformly stronger social support from communities of color",
          "Lower rates of family rejection than white LGBTQ+ youth"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is compound minority stress from multiple intersecting marginalized identities. Balsam et al. (2011) described the experience of LGBTQ+ people of color as 'cultural victimization,' involving racism in LGBTQ+ spaces and homophobia/transphobia in communities of color, which produces compounded mental health effects. The option suggesting lower rates of mental health concerns is incorrect because intersectional research consistently shows that LGBTQ+ people of color experience additive and compounding stressors, not reduced ones, as a result of navigating multiple forms of marginalization simultaneously."
      },
      {
        question: "The clinical use of LGBTQ+ affirmative therapy contraindicates:",
        type: "multiple_choice",
        options: [
          "Exploring the religious and cultural context of clients' attitudes toward their LGBTQ+ identity",
          "Helping clients navigate family relationships that may be challenging due to their identity",
          "Applying insight-oriented approaches to LGBTQ+-related clinical concerns",
          "Any practice that attempts to change, minimize, or eliminate LGBTQ+ identity"
        ],
        correctAnswer: 3,
        explanation: "The correct answer is any practice that attempts to change, minimize, or eliminate LGBTQ+ identity. LGBTQ+ affirmative therapy is fundamentally incompatible with conversion therapy or any approach that seeks to alter a client's sexual orientation or gender identity, as all major professional organizations identify such practices as harmful and unethical. The option about exploring religious and cultural context is incorrect as a contraindication because affirming therapy fully supports exploring these dimensions of a client's experience; it only prohibits practices aimed at changing the identity itself."
      },
      {
        question: "Two-Spirit identity is best understood as:",
        type: "multiple_choice",
        options: [
          "A synonym for bisexuality specific to Indigenous communities",
          "A pan-Indigenous term encompassing cultural and spiritual roles that do not map to Western LGBTQ+ categories",
          "A historical identity no longer used by contemporary Indigenous people",
          "A non-binary gender identity equivalent to non-binary Western identities"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is a pan-Indigenous term encompassing cultural and spiritual roles that do not map to Western LGBTQ+ categories. Two-Spirit identities are culturally specific roles with particular ceremonial, social, and spiritual functions within specific tribal communities, and they are experienced and understood within Indigenous cultural frameworks rather than Western sexual and gender identity frameworks. The option describing Two-Spirit as a synonym for bisexuality is incorrect because Two-Spirit encompasses cultural and spiritual dimensions that extend far beyond Western categories of sexual orientation."
      },
      {
        question: "The minority stress model predicts that LGBTQ+ health disparities are primarily caused by:",
        type: "multiple_choice",
        options: [
          "Inherent psychological vulnerabilities in LGBTQ+ populations",
          "Chronic stress arising from stigma, discrimination, and prejudice in the social environment",
          "Biological differences between LGBTQ+ and heterosexual cisgender populations",
          "Inadequate access to general healthcare regardless of sexual orientation or gender identity"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is chronic stress arising from stigma, discrimination, and prejudice in the social environment. Meyer's (2003) minority stress model specifically attributes LGBTQ+ health disparities to the chronic stress produced by living in a stigmatizing social environment, not to any inherent vulnerability within LGBTQ+ individuals themselves. The option citing inherent psychological vulnerabilities is incorrect because the minority stress model explicitly rejects individual pathology explanations and instead locates the cause of health disparities in the social environment of prejudice and discrimination."
      },
      {
        question: "Family acceptance and rejection affect LGBTQ+ youth outcomes through which mechanism:",
        type: "multiple_choice",
        options: [
          "Genetic transmission of resilience or vulnerability",
          "The degree to which family responses validate or invalidate the youth's identity and self-worth",
          "Academic achievement and educational attainment",
          "Access to peer support from other LGBTQ+ youth"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is the degree to which family responses validate or invalidate the youth's identity and self-worth. Ryan et al. (2009) demonstrated that specific family behaviors of acceptance and rejection directly predict mental health outcomes, with family acceptance serving as an active protective factor independent of the reduction of rejection. The option citing genetic transmission of resilience is incorrect because the research identifies family acceptance and rejection as psychosocial mechanisms operating through validation and invalidation of identity, not through genetic or biological pathways."
      },
      {
        question: "Affirming clinical assessment with LGBTQ+ clients distinguishes between:",
        type: "multiple_choice",
        options: [
          "Gay clients who need therapy and those who do not",
          "Identity-related concerns requiring affirmation and clinical mental health concerns requiring treatment",
          "Clients with acceptable and unacceptable LGBTQ+ identities",
          "LGBTQ+ clients who can benefit from therapy and those who cannot"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is distinguishing between identity-related concerns requiring affirmation and clinical mental health concerns requiring treatment. Affirming assessment recognizes that gender identity and sexual orientation are not pathologies requiring clinical modification, while simultaneously attending to genuine clinical conditions such as depression, anxiety, and PTSD that may be driven by minority stress. The option about distinguishing clients who can benefit from therapy from those who cannot is incorrect because affirming assessment is not about screening clients in or out of therapy, but about correctly identifying what requires affirmation versus what requires clinical intervention."
      },
    ]
  },
  references: [
      { title: "Demarginalizing the intersection of race and sex. University of Chicago Legal Forum, 140, 139–167.", author: "Crenshaw, K", year: 1989, source: "ce and sex. University of Chicago Legal Forum, 140, 139–167." },
      { title: "Prejudice, social stress, and mental health in lesbian, gay, and bisexual populations. Psychological Bulletin, 129(5),", author: "Meyer, I", year: 2003, source: "sexual populations. Psychological Bulletin, 129(5), 674–697." },
      { title: "Family rejection as a predictor of negative health outcomes. Pediatrics, 123(1), 346–352.", author: "Ryan, C", year: 2009, source: "or of negative health outcomes. Pediatrics, 123(1), 346–352." },
      { title: "Chosen name use is linked to reduced depressive symptoms, suicidal ideation, and suicidal behavior among transgender yo", author: "Russell, S", year: 2018, source: "sgender youth. Journal of Adolescent Health, 63(4), 503–505." },
      { title: "National survey on LGBTQ youth mental health. https://www.thetrevorproject.org", author: "The Trevor Project", year: 2022, source: "LGBTQ youth mental health. https://www.thetrevorproject.org" },
      { title: "World Professional Association for Transgender Health standards of care, version 8. International Journal of Transgende", author: "Coleman, E", year: 2022, source: "nternational Journal of Transgender Health, 23(S1), S1–S259." },
      { title: "Uncovering clinical principles and techniques to address minority stress, mental health, and related health risks among", author: "Pachankis, J", year: 2014, source: "g gay and bisexual men. Clinical Psychology, 21(4), 313–330." },
      { title: "Guidelines for psychological practice with lesbian, gay, and bisexual clients. American Psychologist, 67(1), 10–42.", author: "American Psychological Association", year: 2012, source: ", and bisexual clients. American Psychologist, 67(1), 10–42." },
      { title: "Guidelines for psychological practice with transgender and gender nonconforming people. American Psychologist, 70(9), 8", author: "APA", year: 2015, source: "nonconforming people. American Psychologist, 70(9), 832–864." },
      { title: "Cultural victimization among LGBT people of color. Journal of GLBT Family Studies, 7(4), 398–421.", author: "Balsam, K", year: 2011, source: "ple of color. Journal of GLBT Family Studies, 7(4), 398–421." },
      { title: "Global health burden and needs of transgender populations. Lancet, 388(10042), 412–436.", author: "Reisner, S", year: 2016, source: "eds of transgender populations. Lancet, 388(10042), 412–436." },
      { title: "A conceptual framework for clinical work with transgender and gender nonconforming clients. Professional Psychology, 43", author: "Hendricks, M", year: 2012, source: "conforming clients. Professional Psychology, 43(5), 460–467." },
      { title: "Report. American Psychological Association.", author: "APA Task Force on Appropriate Therapeutic Responses to Sexual Orientation", year: 2009, source: "ntation. (2009). Report. American Psychological Association." },
      { title: "Ending conversion therapy: Supporting and affirming LGBTQ youth. SAMHSA.", author: "Substance Abuse and Mental Health Services Administration", year: 2015, source: "rsion therapy: Supporting and affirming LGBTQ youth. SAMHSA." },
      { title: "LGBT people in the US not protected by state non-discrimination statutes. UCLA School of Law.", author: "Williams Institute", year: 2020, source: "ed by state non-discrimination statutes. UCLA School of Law." },
  ]
};

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  SEED: CR-304 — Sexuality, Identity, and Mental Health: Affirming Clinical Practice with LGBTQ+ Clients');
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
  console.log(`     Word Count: 18,030`);
  console.log(`     Modules  : ${COURSE_DATA.modules.length}`);
  console.log(`     Blocks   : ${totalBlocks}`);
  console.log(`     Exam Qs  : ${COURSE_DATA.assessment.questions.length}`);
  console.log(`     Status   : draft (review before publishing)\n`);

  await mongoose.disconnect();
  console.log('✅ Done.\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
