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

// ════════════════════════════════════════════════════════════════
// SUICIDE RISK ASSESSMENT — INTERACTIVE FORMAT (4 CE)
// 7 modules, 153 content blocks, 15 final assessment questions
// Includes: clinical vignettes, decision points, matching exercises,
// image placeholders, reflection prompts, knowledge checks
// ════════════════════════════════════════════════════════════════

const SUICIDE_RISK_INTERACTIVE = {
  title: "Suicide Risk Assessment: Evidence-Based Approaches for Mental Health Professionals",
  slug: "suicide-risk-assessment-interactive",
  code: "CR-101",
  description: "Suicide remains one of the leading causes of death in the United States, claiming approximately 49,500 lives annually. This comprehensive 4-hour interactive course provides counselors with evidence-based frameworks for understanding suicidal behavior, conducting thorough risk assessments using the C-SSRS and clinical interviewing, implementing the Stanley-Brown Safety Planning Intervention, applying lethal means counseling protocols, and managing complex ethical-legal considerations. Through clinical vignettes, decision points, and practical exercises, participants develop competence and confidence for working with clients experiencing suicidal crises.",
  shortDescription: "Evidence-based suicide risk assessment, safety planning, and crisis intervention for mental health professionals.",
  ceHours: 4,
  credits: 4,
  category: "Crisis Intervention",
  level: "Intermediate to Advanced",
  contentArea: "Crisis Intervention",
  creditType: "NBCC",
  acepProvider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    number: "7760"
  },
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Mental Health Counselors (LMHC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Graduate-level counseling students under supervision"
  ],
  instructionalLevel: "Intermediate to Advanced",
  deliveryMethod: "online",
  estimatedMinutes: 240,
  objectives: [
    "Analyze current epidemiological data on suicide to inform culturally responsive assessment and intervention",
    "Apply theoretical models including Joiner's Interpersonal-Psychological Theory to understand suicide risk",
    "Conduct comprehensive risk assessments using the C-SSRS and evidence-based clinical interviewing",
    "Implement the Stanley-Brown Safety Planning Intervention across risk levels",
    "Apply lethal means counseling protocols including CALM for firearms",
    "Identify population-specific risk factors for adolescents, older adults, veterans, and LGBTQ+ individuals",
    "Navigate ethical and legal obligations including duty to protect and involuntary hospitalization",
    "Develop sustainable self-care strategies for working with suicidal clients"
  ],
  contentAreas: ["Crisis Intervention", "Assessment", "Ethics"],
  categories: ["Crisis", "Assessment", "Clinical Skills"],
  tags: ["suicide", "risk assessment", "safety planning", "C-SSRS", "crisis intervention", "means restriction", "Stanley-Brown"],
  price: 65,
  isActive: true,
  isFeatured: true,
  status: "draft",
  isPublished: false,
  passingScore: 80,
  maxAttempts: 3,
  accessibility: {
    wcagLevel: "AA",
    screenReaderOptimized: true,
    keyboardNavigable: true,
    colorContrastCompliant: true,
    altTextProvided: true
  },
  
  // ── IMAGE PLACEHOLDERS ──
  // These paths are placeholders. Upload actual images to Cloudinary via admin,
  // then update the imageText blocks with the Cloudinary URLs.
  // Recommended images:
  //   1. Epidemiology infographic (Module 1)
  //   2. IS PATH WARM visual (Module 2)
  //   3. C-SSRS scale diagram (Module 3)
  //   4. Safety Plan 6-step visual (Module 4)
  //   5. Special populations diagram (Module 5)

  modules: [
    {
      title: `Understanding Suicide – Epidemiology and Theoretical Foundations`,
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: `Module 1`,
          subtitle: `Understanding Suicide – Epidemiology and Theoretical Foundations`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Suicide represents a profound public health crisis that touches virtually every community and demographic group in the United States. For mental health professionals, understanding the scope and nature of this crisis is essential for effective prevention, assessment, and intervention. This module establishes the empirical foundation for the course by examining current epidemiological data and the theoretical frameworks that help us understand why people die by suicide.</p>
<p>The statistics are sobering. According to the Centers for Disease Control and Prevention (CDC, 2023), suicide was the 11th leading cause of death in the United States in 2021, claiming 48,183 lives—a rate of approximately 14.1 deaths per 100,000 population. This translates to approximately 132 deaths by suicide each day, or one death every 11 minutes. Behind each statistic is a human being whose death caused immeasurable pain to family members, friends, colleagues, and communities.</p>
<p>Yet deaths represent only the visible portion of the suicide crisis. For every completed suicide, there are approximately 25 suicide attempts (Drapeau & McIntosh, 2020). In 2021, an estimated 1.7 million adults attempted suicide, 3.5 million made a suicide plan, and 12.3 million seriously considered suicide (SAMHSA, 2022). Among adolescents, the numbers are particularly alarming: the 2021 Youth Risk Behavior Survey found that 22% of high school students seriously considered suicide, 18% made a plan, and 10% attempted suicide in the past year (CDC, 2022).</p>
<p>These numbers have been trending upward. Between 1999 and 2021, the age-adjusted suicide rate in the United States increased by approximately 30%. While the rate decreased slightly during 2019-2020, preliminary data suggest continued elevation, and the long-term trajectory remains concerning. Understanding the factors driving this increase—including social isolation, economic stress, access to lethal means, and inadequate mental health treatment—is essential for effective prevention efforts.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "imageText",
          title: `Suicide in America: The Numbers`,
          content: `<p><strong>Key Statistics:</strong> Approximately 49,500 lives lost annually. 132 deaths per day. For every death, 25 attempts. 12.3 million adults seriously consider suicide each year. Rates have increased 30% since 1999.</p><p>Understanding the scope of this crisis is essential for every clinician. These are not just numbers — each represents a person, a family, a community forever changed.</p>`,
          image: `/images/courses/suicide-risk/epidemiology-infographic.png`,
          imageAlt: `Infographic showing U.S. suicide statistics including annual deaths, attempts, and demographic patterns`,
          imagePosition: "right",
          accessibility: { role: "figure", ariaLabel: `Infographic showing U.S. suicide statistics including annual deaths, attempts, and demographic patterns` }
        },
        {
          type: "text",
          content: `<p>Suicide rates vary significantly across demographic groups, and understanding these patterns helps counselors identify clients who may be at elevated risk and tailor interventions appropriately.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Age`,
              content: `<p>Suicide rates vary across the lifespan, with distinct patterns at different ages. Among adolescents and young adults (ages 15-24), suicide is the second leading cause of death, following unintentional injuries. The rate among this age group has increased substantially over the past decade, particularly among females. Among middle-aged adults (ages 45-64), suicide rates are also elevated, with this group accounting for the largest absolute number of suicide deaths. Among older adults (ages 65+), while the overall rate has declined somewhat in recent years, men in this age group have the highest suicide rate of any demographic group—particularly White men over age 85.</p>
<p>These age-related patterns reflect different risk factors operating at different life stages. Adolescent suicide often involves impulsivity, relationship problems, and emerging mental health conditions. Middle-aged suicide frequently involves chronic health problems, financial stress, relationship dissolution, and long-standing mental health conditions. Older adult suicide often involves physical illness, loss of independence, bereavement, and social isolation.</p>
`
            },
            {
              title: `Sex and Gender`,
              content: `<p>Suicide shows a striking paradox by sex: while females attempt suicide at rates approximately three times higher than males, males die by suicide at rates approximately four times higher than females. This disparity is largely explained by differences in method lethality—males more frequently use firearms, which have a case fatality rate exceeding 85%, while females more frequently use poisoning, which has a case fatality rate below 5%.</p>
<p>Understanding this pattern has important clinical implications. Female clients with suicidal ideation should not be dismissed as "not serious" because attempts are more common among women. Male clients who disclose suicidal thoughts warrant immediate attention to means access, particularly firearms. Additionally, the gender disparity has been narrowing in recent years, with female suicide rates increasing faster than male rates in some age groups.</p>
<p>Transgender and gender-diverse individuals face substantially elevated suicide risk compared to cisgender individuals, with some studies finding attempt rates of 40% or higher (James et al., 2016). This elevated risk reflects the impact of discrimination, family rejection, lack of access to gender-affirming care, and minority stress rather than anything inherent to gender diversity itself.</p>
`
            },
            {
              title: `Race and Ethnicity`,
              content: `<p>Suicide rates vary across racial and ethnic groups, though it is important to note that within-group variation often exceeds between-group variation. Historically, White and American Indian/Alaska Native populations have had the highest suicide rates, while Black, Hispanic, and Asian American populations have had lower rates. However, these patterns are shifting—suicide rates among Black youth have increased dramatically in recent years, now exceeding rates among White youth in some age groups (Bridge et al., 2023).</p>
<p>American Indian/Alaska Native populations have the highest suicide rate of any racial group in the United States, approximately 1.5 times the national average. This elevated risk reflects the cumulative impact of historical trauma, ongoing discrimination, poverty, limited access to mental health services, and geographic isolation. Native communities have also been disproportionately affected by the opioid epidemic, which intersects with suicide risk.</p>
<p>Cultural factors influence not only suicide rates but also help-seeking behaviors, expressions of distress, and responses to intervention. Culturally responsive suicide assessment and intervention requires understanding how cultural contexts shape the experience and expression of suicidality.</p>
`
            },
            {
              title: `Geographic Variation`,
              content: `<p>Suicide rates vary substantially by geography, with rural areas generally having higher rates than urban areas. This rural-urban disparity is particularly pronounced in Western states. Wyoming, Montana, Alaska, and New Mexico consistently have among the highest suicide rates in the nation, while New Jersey, New York, and Massachusetts have among the lowest.</p>
<p>Multiple factors contribute to geographic variation: access to mental health services (which is limited in many rural areas), access to lethal means (firearm ownership is higher in rural areas), economic factors, social cohesion, and cultural attitudes toward help-seeking. Counselors practicing in high-risk geographic areas should be particularly attentive to suicide risk assessment.</p>
`
            },
            {
              title: `Means of Death`,
              content: `<p>Understanding the methods used in suicide is critical for prevention efforts. In the United States, firearms account for approximately 53% of suicide deaths, making them by far the most common method. Suffocation (including hanging) accounts for approximately 26%, poisoning for approximately 12%, and other methods (falls, drowning, cutting, etc.) for the remainder.</p>
<p>The predominance of firearms in U.S. suicide deaths distinguishes this country from most other developed nations and reflects both the high rate of gun ownership and the extreme lethality of this method. Research consistently shows that reducing access to lethal means saves lives—not because it addresses underlying distress, but because it interrupts the acute crisis during which most suicidal acts occur. The time between deciding to attempt suicide and taking action is often measured in minutes, and most people who survive an attempt do not go on to die by suicide later.</p>
<p>These epidemiological patterns underscore that suicide is not randomly distributed but follows identifiable patterns that can inform targeted prevention efforts. At the same time, counselors must remember that suicide can occur in any demographic group, and individual risk assessment must go beyond demographic factors to examine the specific circumstances, risk factors, and warning signs present in each case.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Historically, suicidal behavior was often categorized simplistically—"genuine" versus "manipulative," "serious" versus "attention-seeking." Contemporary understanding recognizes that suicidal behavior exists on a continuum and emerges from genuine psychological pain, regardless of the apparent severity or outcome of any particular behavior.</p>
<h2>The Continuum of Suicidal Behavior</h2>
<p>Suicidal behavior encompasses a range of phenomena:</p>
<p><strong>Suicidal ideation</strong> refers to thoughts about suicide, which vary in frequency, intensity, duration, and specificity. Passive ideation ("I wish I were dead," "I wouldn't mind if I didn't wake up tomorrow") differs from active ideation ("I'm thinking about killing myself"). Ideation may be fleeting or persistent, vague or accompanied by specific plans.</p>
<p><strong>Suicidal planning</strong> involves formulating a method, timeline, and/or other specifics about how one might attempt suicide. The presence of a plan, particularly a detailed and feasible plan, generally indicates elevated risk compared to ideation without planning.</p>
<p><strong>Suicidal intent</strong> refers to the degree of determination to die by suicide. Intent can be present with or without a specific plan, and its assessment requires careful clinical inquiry into the person's expectations and desires regarding death.</p>
<p><strong>Suicide attempt</strong> is a non-fatal, self-directed, potentially injurious behavior with any intent to die. Attempts vary greatly in medical severity and stated intent—from low-lethality gestures to highly lethal attempts that were interrupted or survived by chance.</p>
<p><strong>Suicide</strong> (also called completed suicide or death by suicide) is death caused by self-directed injurious behavior with intent to die.</p>
<p><strong>Non-suicidal self-injury (NSSI)</strong> is self-injurious behavior without intent to die, typically serving functions such as emotion regulation, self-punishment, or communication of distress. While distinct from suicidal behavior, NSSI is associated with elevated suicide risk and warrants clinical attention.</p>
<p>Understanding this continuum helps counselors assess where a particular client falls and calibrate interventions accordingly. It also reminds us that the boundaries between categories can be fuzzy—a person engaging in NSSI may have some ambivalence about living, and a person making a "low-lethality" attempt may have genuinely wished to die.</p>`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `
<h2>Why People Consider Suicide: Psychological Perspectives</h2>
<p>To intervene effectively with suicidal clients, counselors must understand the psychological processes that lead people to consider ending their lives. Multiple theoretical frameworks offer insight into these processes.</p>
<p>From a psychological pain perspective, suicide is understood as a response to unbearable psychological suffering. Edwin Shneidman (1993), a pioneer in suicidology, coined the term "psychache" to describe the intense psychological pain that drives suicidal behavior. In this view, suicide is not primarily about wanting to die but about wanting to escape unbearable pain when no other escape seems possible. This perspective emphasizes the importance of addressing psychological pain and expanding the person's perception of available options.</p>
<p>From a cognitive perspective, suicidal individuals often display characteristic patterns of thinking: cognitive constriction (tunnel vision that limits perceived options), hopelessness (the belief that things will never improve), and problem-solving deficits that interfere with generating and implementing alternatives to suicide. Aaron Beck's research demonstrated that hopelessness is a stronger predictor of suicide than depression per se, highlighting the importance of addressing hopeless cognitions in treatment.</p>
<p>From an emotional regulation perspective, suicide attempts often occur in the context of emotional crises that exceed the individual's coping capacity. Many suicidal individuals have histories of trauma, invalidating environments, or other experiences that interfered with the development of healthy emotion regulation skills. This perspective underlies treatments like Dialectical Behavior Therapy (DBT), which explicitly targets emotion regulation deficits.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Thomas Joiner's Interpersonal-Psychological Theory of Suicide (IPTS; Joiner, 2005; Van Orden et al., 2010) has become one of the most influential contemporary frameworks for understanding suicide. The theory proposes that the desire for suicide emerges from the combination of two interpersonal states, while the capability for lethal self-harm develops separately.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Thwarted Belongingness`,
              content: `<p>Thwarted belongingness refers to the experience of social alienation—the painful feeling that one is not meaningfully connected to others. Humans have a fundamental need to belong, and when this need is chronically unmet, psychological distress results. Thwarted belongingness manifests as loneliness, social isolation, and the absence of reciprocally caring relationships.</p>
<p>The experience of thwarted belongingness can be summed up in thoughts like: "I am alone," "I have no one to turn to," "I don't fit in anywhere," or "No one really understands me." Social isolation, living alone, family conflict, loss of relationships through death or divorce, and social marginalization all contribute to thwarted belongingness.</p>
<p>Importantly, thwarted belongingness reflects subjective perception rather than objective circumstances. A person surrounded by family and friends may still feel fundamentally disconnected if they perceive these relationships as superficial or conditional. Conversely, a person with few relationships may feel deeply connected to those they do have. Clinical assessment must explore not just the presence of relationships but their quality and meaning.</p>
`
            },
            {
              title: `Perceived Burdensomeness`,
              content: `<p>Perceived burdensomeness refers to the belief that one's existence is a burden on others—that family, friends, and society would be better off if the person were dead. This perception may be fueled by unemployment, disability, legal problems, being a caregiver burden, or any circumstance that leads the person to view themselves as a drain on others' resources.</p>
<p>The experience of perceived burdensomeness can be captured in thoughts like: "I am a burden to my family," "Everyone would be better off without me," "I contribute nothing," or "My death would be worth more than my life." These cognitions often have a self-sacrificial quality—the person may view suicide as an act of generosity that would relieve others of their burden.</p>
<p>Like thwarted belongingness, perceived burdensomeness involves perception rather than objective reality. People who view themselves as burdens are typically wrong—their deaths would cause tremendous pain to loved ones rather than relief. Yet the perception feels true to the suicidal person, and logical arguments rarely suffice to change it. Therapeutic interventions must address the underlying cognitive distortions while also attending to any real-world circumstances (unemployment, disability) that contribute to feeling burdensome.</p>
`
            },
            {
              title: `The Desire for Suicide`,
              content: `<p>According to IPTS, the combination of thwarted belongingness and perceived burdensomeness, when both are present and perceived as stable rather than temporary, generates the desire for suicide. Neither factor alone typically produces suicidal desire—a person who feels lonely but not burdensome, or burdensome but not lonely, may experience depression but not active suicidality.</p>
<p>This understanding has clinical implications. Assessment should explore both interpersonal dimensions. Interventions should target whichever factor is more prominent or more modifiable. And clinicians should be particularly alert when a client's narrative suggests both isolation and burdensomeness.</p>
`
            },
            {
              title: `Acquired Capability for Suicide`,
              content: `<p>Desiring suicide is not sufficient for lethal suicidal behavior—the person must also be capable of acting on that desire. IPTS proposes that humans have strong self-preservation instincts that normally inhibit self-harm, and that the capability for suicide is acquired through experiences that habituate the person to pain and fear of death.</p>
<p>Acquired capability develops through exposure to painful and provocative experiences, including previous suicide attempts, non-suicidal self-injury, physical abuse, combat exposure, accidental injuries, and other experiences involving pain and physical violence. Through such experiences, the individual develops elevated pain tolerance and reduced fear of death, making lethal self-harm increasingly possible.</p>
<p>Previous suicide attempts are perhaps the strongest indicator of acquired capability and one of the strongest predictors of future suicide. Each attempt further habituates the individual to the fear and pain associated with self-harm, lowering the threshold for future attempts.</p>
<p>Certain occupations may confer elevated acquired capability through occupational exposure to death, injury, and/or training in lethal violence. Military personnel, first responders, physicians, and others with such exposure may have elevated acquired capability, contributing to elevated suicide rates in these groups.</p>
`
            },
            {
              title: `Clinical Applications of IPTS`,
              content: `<p>IPTS provides a framework for both assessment and intervention:</p>
<p><strong>For assessment</strong>, clinicians should explore:
- Thwarted belongingness: "Do you feel connected to others? Do you have people you can turn to? Do you feel like you belong?"
- Perceived burdensomeness: "Do you ever feel like you're a burden to others? Do you think others would be better off without you?"
- Acquired capability: "Have you ever attempted suicide before? Have you engaged in self-harm? Have you experienced significant physical pain or trauma?"</p>
<p><strong>For intervention</strong>, clinicians should consider:
- Addressing thwarted belongingness through increasing social connection, addressing relationship problems, facilitating community involvement
- Addressing perceived burdensomeness through cognitive restructuring, behavioral activation to increase contributions, addressing practical circumstances like unemployment
- Reducing capability by limiting access to lethal means</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>While IPTS is among the most influential current theories, other frameworks offer additional insights:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `The Three-Step Theory`,
              content: `<p>Klonsky and May's (2015) Three-Step Theory (3ST) proposes that suicide ideation emerges from the combination of pain (broadly defined) and hopelessness. When pain exceeds connectedness (one's sense of connection to people, roles, interests, etc.), ideation progresses toward action. The transition from ideation to attempt is governed by acquired capacity, similar to IPTS, but also by practical factors (access to means, knowledge of methods).</p>
`
            },
            {
              title: `The Integrated Motivational-Volitional Model`,
              content: `<p>O'Connor's (2011) Integrated Motivational-Volitional (IMV) Model distinguishes between motivational factors (what drives suicidal ideation and intent) and volitional factors (what facilitates the transition from intent to behavior). Motivational factors include defeat and entrapment—the feeling of being trapped in an unbearable situation with no escape. Volitional factors include access to means, exposure to suicide, and impulsivity.</p>
`
            },
            {
              title: `Diathesis-Stress Model`,
              content: `<p>The diathesis-stress model proposes that suicide results from the interaction between underlying vulnerabilities (diatheses) and environmental stressors. Vulnerabilities might include genetic predisposition, early adversity, or trait impulsivity. Stressors might include job loss, relationship dissolution, or illness. Neither diathesis nor stress alone causes suicide; rather, their interaction determines risk.</p>
<p>Each theoretical perspective offers something valuable for clinical practice. IPTS highlights the interpersonal dimension of suicide and identifies specific targets for intervention. 3ST emphasizes the protective function of connectedness and the role of practical factors. The IMV model distinguishes the processes leading to ideation from those leading to action. The diathesis-stress model reminds us that both person-level vulnerabilities and situational factors matter. Effective clinicians draw on multiple frameworks to understand each unique client.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Mental disorders are among the strongest risk factors for suicide. Psychological autopsy studies—retrospective investigations of suicide deaths—consistently find that approximately 90% of people who die by suicide had a diagnosable mental disorder at the time of death (Cavanagh et al., 2003). The most commonly implicated disorders include:</p>
<p><strong>Mood disorders</strong>: Major depressive disorder and bipolar disorder are strongly associated with suicide risk. Approximately 60% of suicide deaths involve mood disorders. The lifetime suicide risk for individuals with mood disorders has been estimated at 4-6%, far exceeding the general population rate. Within mood disorders, certain features elevate risk: mixed episodes in bipolar disorder, depression with anxiety features, and depression with hopelessness are particularly concerning.</p>
<p><strong>Substance use disorders</strong>: Alcohol and drug use disorders contribute to suicide through multiple mechanisms: direct intoxication effects that increase impulsivity and reduce inhibition, chronic effects on mood and cognition, and indirect effects through relationship and occupational problems. Approximately 25-50% of suicide deaths involve alcohol or drugs. The acute risk associated with intoxication adds to chronic risk associated with the disorder itself.</p>
<p><strong>Schizophrenia and psychotic disorders</strong>: Individuals with schizophrenia have suicide rates approximately 5-10% over the lifetime, often occurring early in the illness course when insight is preserved and demoralization about the diagnosis is acute. Command hallucinations directing self-harm pose particular risk, though their presence does not automatically indicate imminent danger.</p>
<p><strong>Personality disorders</strong>: Borderline personality disorder is particularly associated with suicide risk, with approximately 10% lifetime suicide mortality. The emotional dysregulation, impulsivity, and interpersonal instability characteristic of BPD all contribute to risk. Antisocial personality disorder and other Cluster B disorders also confer elevated risk.</p>
<p><strong>Anxiety disorders</strong>: While less prominently associated with suicide than mood disorders, anxiety disorders—particularly panic disorder and PTSD—confer elevated risk, especially when comorbid with depression. The combination of depression and anxiety is more dangerous than either condition alone.</p>
<p><strong>Eating disorders</strong>: Anorexia nervosa has among the highest mortality rates of any psychiatric disorder, with a significant proportion of deaths attributable to suicide. Bulimia nervosa and other eating disorders also elevate risk.</p>
<p>However, the relationship between mental disorders and suicide is complex. Most people with mental disorders never attempt suicide, and a small but meaningful proportion of suicide deaths occur in individuals without identifiable mental disorders. Moreover, the relationship is likely bidirectional—suicidality itself affects mental health, and the two interact in complex ways.</p>
<p>For clinicians, the high prevalence of mental disorders among suicide decedents underscores the importance of treating underlying conditions as a suicide prevention strategy. At the same time, clinicians should not assume that treating depression alone will eliminate suicide risk, nor should they assume that clients without diagnosable disorders are not at risk.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Impulsivity plays a complex role in suicide that deserves particular attention. While suicide is often conceptualized as a response to chronic distress, many suicide attempts occur impulsively—with little time between the decision to attempt and the attempt itself. Research suggests that for many suicide attempts, the time between deciding to attempt and taking action is measured in minutes rather than hours or days.</p>
<p>This impulsive quality has important implications:</p>
<p><strong>Means restriction is critical</strong>: When decisions are impulsive, the immediate availability of lethal means can mean the difference between survival and death. Reducing access to means—particularly firearms—introduces time and barriers that allow the impulsive crisis to pass.</p>
<p><strong>Crises are time-limited</strong>: Most suicidal crises are relatively brief. An individual in acute crisis today may not be in crisis tomorrow, next week, or next month. Surviving the crisis often leads to resolution rather than continued suicidal distress.</p>
<p><strong>Ambivalence is common</strong>: Many people who attempt suicide are ambivalent—they want to end their pain but also want to live. This ambivalence can be leveraged therapeutically and explains why most attempt survivors do not eventually die by suicide.</p>
<p><strong>State vs. trait considerations</strong>: Some individuals have trait-like impulsivity that persistently elevates their risk for acting on suicidal thoughts. Others may act impulsively only during acute crises. Understanding which pattern applies to a given client informs assessment and intervention.</p>
<p><strong>Substance use increases impulsivity</strong>: Alcohol and other substances reduce inhibition and increase impulsivity, which is one mechanism through which substances elevate suicide risk. Addressing substance use and planning for safety during potential intoxication are important intervention targets.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Suicide epidemiology is not static—patterns change over time, and emerging trends warrant attention:</p>
<p><strong>Increasing rates among youth</strong>: Suicide rates among adolescents and young adults have increased substantially over the past decade. While the causes are not fully understood, potential contributors include social media, increased academic pressure, decreased resilience, and increased rates of anxiety and depression.</p>
<p><strong>Increasing rates among Black youth</strong>: While suicide rates have historically been lower among Black Americans than White Americans, rates among Black youth have increased dramatically—now exceeding rates among White youth in some age groups. This concerning trend requires attention to factors affecting Black youth specifically.</p>
<p><strong>The role of social media</strong>: The relationship between social media and suicide is complex and still being studied. Concerns include cyberbullying, social comparison, contagion through exposure to suicide content, and displacement of in-person connection. However, social media can also facilitate help-seeking and peer support.</p>
<p><strong>Opioid epidemic intersection</strong>: The opioid epidemic intersects with suicide in multiple ways. Opioid use disorder elevates suicide risk; opioids can be used as a means of suicide; chronic pain (often treated with opioids) is a suicide risk factor; and communities hardest hit by the opioid epidemic may experience cascading effects on suicide rates.</p>
<p><strong>COVID-19 effects</strong>: The COVID-19 pandemic affected mental health and suicide risk through social isolation, economic disruption, grief, and disrupted access to care. Understanding the pandemic's long-term effects on suicide remains an area of ongoing research.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "multipleChoice",
          question: `According to CDC data, approximately how many people die by suicide in the United States each year?`,
          options: [
              { text: `25,000`, isCorrect: true },
              { text: `35,000`, isCorrect: false },
              { text: `49,000`, isCorrect: false },
              { text: `75,000`, isCorrect: false }
          ],
          explanation: `Review the content in Module 1 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The phenomenon in which males die by suicide at higher rates than females while females attempt suicide at higher rates is largely explained by:?`,
          options: [
              { text: `Differences in depression rates`, isCorrect: false },
              { text: `Differences in method lethality`, isCorrect: true },
              { text: `Differences in help-seeking behavior`, isCorrect: false },
              { text: `Differences in social support`, isCorrect: false }
          ],
          explanation: `Review the content in Module 1 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `According to Joiner's Interpersonal-Psychological Theory of Suicide, the desire for suicide emerges from the combination of:?`,
          options: [
              { text: `Depression and anxiety`, isCorrect: false },
              { text: `Hopelessness and impulsivity`, isCorrect: false },
              { text: `Thwarted belongingness and perceived burdensomeness`, isCorrect: true },
              { text: `Trauma and substance use`, isCorrect: false }
          ],
          explanation: `Review the content in Module 1 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `"Acquired capability" in IPTS refers to:?`,
          options: [
              { text: `Learning about suicide methods`, isCorrect: false },
              { text: `Habituation to pain and reduced fear of death`, isCorrect: false },
              { text: `Acquiring the means to attempt suicide`, isCorrect: false },
              { text: `Developing coping skills to manage suicidal thoughts`, isCorrect: true }
          ],
          explanation: `Review the content in Module 1 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Approximately what percentage of suicide deaths involve a diagnosable mental disorder?`,
          options: [
              { text: `50%`, isCorrect: true },
              { text: `70%`, isCorrect: false },
              { text: `90%`, isCorrect: false },
              { text: `100%`, isCorrect: false }
          ],
          explanation: `Review the content in Module 1 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "reflection",
          question: `Think about your current clinical practice. How comfortable do you feel asking clients directly about suicidal thoughts? What barriers — personal, institutional, or cultural — have you encountered in assessing suicide risk?`,
          accessibility: { role: "textbox", ariaLabel: "Reflection prompt" }
        }
      ]
    },
    {
      title: `Risk Factors, Warning Signs, and Protective Factors`,
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: `Module 2`,
          subtitle: `Risk Factors, Warning Signs, and Protective Factors`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Effective suicide risk assessment requires understanding the distinction between distal risk factors (relatively stable characteristics that increase vulnerability over time), proximal risk factors and warning signs (dynamic indicators of imminent risk), and protective factors (characteristics that buffer against suicide risk). This module provides a comprehensive overview of factors counselors should assess when evaluating suicide risk.</p>
<p>Understanding risk and protective factors serves multiple purposes in clinical practice. First, it helps identify individuals who warrant suicide assessment even if they have not explicitly disclosed suicidal thoughts. Second, it provides a framework for systematic assessment that ensures important factors are not overlooked. Third, it informs treatment planning by identifying targets for intervention. Fourth, it supports clinical judgment about the level of risk and the intensity of intervention required.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "imageText",
          title: `IS PATH WARM: Warning Signs Framework`,
          content: `<p><strong>I</strong>deation • <strong>S</strong>ubstance Abuse • <strong>P</strong>urposelessness • <strong>A</strong>nxiety • <strong>T</strong>rapped • <strong>H</strong>opelessness • <strong>W</strong>ithdrawal • <strong>A</strong>nger • <strong>R</strong>ecklessness • <strong>M</strong>ood changes</p><p>This evidence-based mnemonic from the American Association of Suicidology provides a structured framework for recognizing imminent warning signs. Memorize it — it could save a life.</p>`,
          image: `/images/courses/suicide-risk/is-path-warm.png`,
          imageAlt: `IS PATH WARM mnemonic showing the 10 warning signs of suicide`,
          imagePosition: "left",
          accessibility: { role: "figure", ariaLabel: `IS PATH WARM mnemonic showing the 10 warning signs of suicide` }
        },
        {
          type: "text",
          content: `<p>Distal risk factors are relatively stable characteristics that increase long-term vulnerability to suicide. While they do not predict imminent suicide, they identify individuals who warrant heightened attention to suicide risk throughout treatment.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Previous Suicide Attempts`,
              content: `<p>A history of previous suicide attempts is the single strongest predictor of future suicidal behavior. Research consistently shows that individuals who have attempted suicide are at markedly elevated risk for subsequent attempts and completion. The first year after an attempt represents a particularly high-risk period, with risk remaining elevated for years thereafter.</p>
<p>The risk associated with previous attempts reflects multiple mechanisms. From an IPTS perspective, previous attempts contribute to acquired capability by habituating the individual to the fear and pain of self-harm. From a behavioral perspective, suicide becomes an increasingly accessible response to distress with each attempt. Additionally, the factors that led to the initial attempt often persist or recur.</p>
<p>Clinicians should routinely inquire about previous attempts when assessing any client's suicide risk. When previous attempts are identified, detailed inquiry into the circumstances, method, intent, and aftermath of each attempt provides valuable information for understanding risk and planning intervention.</p>
`
            },
            {
              title: `Family History of Suicide`,
              content: `<p>Family history of suicide approximately doubles an individual's suicide risk, reflecting both genetic and environmental factors. Genetic factors contribute to underlying vulnerabilities such as impulsivity, aggression, and susceptibility to mental disorders. Environmental factors include the impact of losing a family member to suicide, potential modeling effects, and shared family stressors.</p>
<p>The impact of a family suicide extends beyond genetic transmission. Children and other family members who lose someone to suicide experience complex grief that may include guilt, shame, anger, and fear. They may also be exposed to details about suicide methods and may develop the belief that suicide is an acceptable response to distress. These factors can elevate risk even in the absence of genetic vulnerability.</p>
`
            },
            {
              title: `Mental Health History`,
              content: `<p>As discussed in Module 1, mental disorders are strongly associated with suicide risk. A history of mood disorders, substance use disorders, psychotic disorders, personality disorders, or anxiety disorders indicates elevated vulnerability. Importantly, it is the history of disorders—not just current diagnosis—that matters, as previously diagnosed conditions may recur during times of stress.</p>
<p>Co-occurring disorders are particularly concerning. The combination of mood disorders with substance use, mood disorders with personality disorders, or any disorder with hopelessness significantly elevates risk beyond what would be expected from any single condition.</p>
`
            },
            {
              title: `Childhood Adversity and Trauma`,
              content: `<p>Adverse childhood experiences (ACEs)—including physical abuse, sexual abuse, emotional abuse, neglect, household dysfunction, and other childhood adversities—are associated with elevated suicide risk across the lifespan. The relationship between ACEs and suicide is dose-dependent: the more types of adversity experienced, the greater the risk.</p>
<p>Childhood adversity contributes to suicide risk through multiple pathways. Early trauma affects brain development in ways that compromise stress response and emotion regulation. It increases vulnerability to mental disorders. It may lead to maladaptive coping patterns including substance use and self-injury. And it can create lasting problems with attachment and relationships that contribute to social isolation.</p>
`
            },
            {
              title: `Chronic Physical Health Conditions`,
              content: `<p>Chronic medical conditions—particularly those involving chronic pain, functional impairment, terminal prognosis, or effects on appearance and identity—are associated with elevated suicide risk. Conditions with particularly strong associations include cancer, HIV/AIDS, neurological conditions (including traumatic brain injury), chronic pain conditions, and conditions requiring dialysis.</p>
<p>The mechanisms linking physical illness to suicide include direct effects on brain function (as with some neurological conditions), psychological impact of diagnosis and prognosis, chronic pain that depletes coping resources, loss of functioning and independence, and medication side effects including depression.</p>
<p>Counselors should be particularly attentive to suicide risk when clients report new diagnoses, progression of existing conditions, or loss of functioning due to medical problems.</p>
`
            },
            {
              title: `Demographic Factors`,
              content: `<p>As discussed in Module 1, certain demographic characteristics are associated with elevated suicide risk, including male sex, older age (particularly for men), White or American Indian/Alaska Native race, and residence in rural areas. While these factors do not cause suicide, they help identify populations warranting heightened attention.</p>
`
            },
            {
              title: `Access to Lethal Means`,
              content: `<p>Access to firearms and other lethal means is both a risk factor and a point of intervention. Households with firearms have significantly elevated rates of suicide, and this relationship is not fully explained by confounding factors. The lethality and accessibility of firearms make them particularly dangerous during suicidal crises.</p>
<p>Access to other means also matters. Individuals with medical training may have access to medications or knowledge that increases risk. Individuals living in high places or near railways may have increased access to jumping. Assessment should explore what means are available and accessible to the individual.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>While distal risk factors identify vulnerable individuals, proximal risk factors and warning signs indicate elevated imminent risk. These dynamic factors are particularly important for determining the urgency of intervention.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Recent Stressful Life Events`,
              content: `<p>Acute stressors often precipitate suicidal crises in vulnerable individuals. Common precipitants include relationship problems (breakup, divorce, conflict), job loss or financial crisis, legal problems, academic failure, loss of housing, and interpersonal conflicts. The death of a loved one, particularly by suicide, is a particularly potent precipitant.</p>
<p>The impact of stressors depends on their meaning to the individual. An event that seems minor objectively may be devastating to someone for whom it represents a final failure or the loss of their last source of hope. Assessment should explore recent events and their subjective significance.</p>
`
            },
            {
              title: `Recent Psychiatric Hospitalization`,
              content: `<p>The period immediately following psychiatric hospitalization is one of the highest-risk periods for suicide. Studies have found dramatically elevated suicide rates in the days and weeks following discharge, with risk remaining elevated for months. This counterintuitive finding reflects several factors: the crisis that led to hospitalization may not be fully resolved, transition from structured to unstructured environments is difficult, and support systems may be inadequate.</p>
<p>Counselors who work with recently discharged clients should be particularly attentive to suicide risk and ensure robust safety planning and follow-up.</p>
`
            },
            {
              title: `Changes in Mental Status`,
              content: `<p>Deterioration in mental status—worsening depression, increased anxiety or agitation, emergence of psychotic symptoms, or increased substance use—indicates elevated risk. Conversely, sudden improvement after a period of severe depression sometimes indicates that the person has resolved their ambivalence and decided to attempt suicide.</p>
<p>Agitation and anxiety are particularly concerning because they create the activation energy needed to act on suicidal thoughts. A severely depressed person may be too immobilized to attempt suicide; when that person becomes agitated, the risk may increase.</p>
`
            },
            {
              title: `Hopelessness`,
              content: `<p>Hopelessness—the belief that circumstances will never improve—is among the strongest psychological predictors of suicide, often stronger than depression itself. Beck's research demonstrated that hopelessness predicts suicide better than depression severity, and that interventions targeting hopelessness can reduce risk.</p>
<p>Hopelessness can be assessed through direct inquiry ("Do you have hope that things will improve?") and through attention to themes in the client's narrative. Statements like "Nothing will ever change," "There's no point in trying," or "I can't imagine a future" indicate hopelessness that warrants attention.</p>
`
            },
            {
              title: `Sleep Disturbance`,
              content: `<p>Sleep disturbance—particularly insomnia—is associated with elevated suicide risk independent of depression and other factors. Poor sleep impairs emotion regulation, increases impulsivity, and worsens hopelessness. Nighttime wakefulness can also create opportunities for acting on suicidal thoughts during hours when support is less available.</p>
<p>Assessment of sleep should be routine with all clients, with attention to difficulty falling asleep, early morning awakening, nightmares, and overall sleep quality.</p>
`
            },
            {
              title: `Social Withdrawal`,
              content: `<p>Withdrawal from social activities, relationships, and previously enjoyed pursuits can indicate both worsening depression and specific suicidal intent. Some individuals withdraw in preparation for suicide, pulling away from connections that might interfere with their plans. Social withdrawal also reflects and exacerbates the thwarted belongingness that IPTS identifies as driving suicidal desire.</p>
`
            },
            {
              title: `Giving Away Possessions`,
              content: `<p>Giving away prized possessions, making final arrangements, or otherwise preparing for death can indicate active suicidal planning. While not all such behavior indicates suicide (older adults may engage in estate planning without suicidal intent), the context and pattern matter. A young person giving away cherished items while expressing hopelessness warrants immediate attention.</p>
`
            },
            {
              title: `Direct and Indirect Communication`,
              content: `<p>Most people who die by suicide communicate their intent in some way before their death, though these communications are not always recognized. Direct communications include explicit statements like "I'm going to kill myself" or "I wish I were dead." Indirect communications include statements like "You won't have to worry about me much longer," "I can't take this anymore," or "Everyone would be better off without me."</p>
<p>Social media posts, text messages, and notes may also contain warning signs. Counselors should take all communications about suicide seriously and should inquire directly when indirect communications suggest possible suicidality.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>The American Association of Suicidology developed the IS PATH WARM mnemonic to help people remember common warning signs:</p>
<p><strong>I</strong> - Ideation: Threatening or talking about wanting to hurt or kill oneself; looking for ways to kill oneself</p>
<p><strong>S</strong> - Substance Abuse: Increased substance use</p>
<p><strong>P</strong> - Purposelessness: No sense of purpose in life; no reason for living</p>
<p><strong>A</strong> - Anxiety: Anxiety, agitation, unable to sleep or sleeping all the time</p>
<p><strong>T</strong> - Trapped: Feeling trapped, like there's no way out</p>
<p><strong>H</strong> - Hopelessness: Hopelessness about the future</p>
<p><strong>W</strong> - Withdrawal: Withdrawing from friends, family, society</p>
<p><strong>A</strong> - Anger: Rage, uncontrolled anger, seeking revenge</p>
<p><strong>R</strong> - Recklessness: Acting recklessly or engaging in risky activities, seemingly without thinking</p>
<p><strong>M</strong> - Mood Changes: Dramatic changes in mood</p>
<p>This mnemonic provides a quick reference for warning signs, though comprehensive assessment requires more detailed inquiry.</p>
<h2>Additional Warning Signs to Monitor</h2>
<p>Beyond the IS PATH WARM framework, counselors should be attentive to additional warning signs that may indicate imminent risk:</p>
<p><strong>Giving away prized possessions</strong>: When a person begins giving away items of sentimental or monetary value—particularly without clear reason such as moving or downsizing—this may indicate preparation for death. This is especially concerning when combined with statements about "not needing things anymore" or wanting others to "have something to remember me by."</p>
<p><strong>Making final arrangements</strong>: Activities like creating or updating a will, writing letters to loved ones, settling debts, or making arrangements for pets may indicate preparation for suicide. While these activities are normal in certain contexts (serious illness, advanced age), they warrant attention when they appear unexpectedly.</p>
<p><strong>Sudden calm after a period of depression</strong>: Counterintuitively, a sudden improvement in mood after a period of severe depression can sometimes indicate that the person has made a decision to end their life and feels relieved by having resolved their ambivalence. This is particularly concerning when improvement occurs without clear reason (e.g., no change in treatment, circumstances, or other explanations).</p>
<p><strong>Saying goodbye</strong>: Comments like "I won't be around much longer," "You'll understand eventually," or other statements that seem like farewells may indicate suicidal intent. Similarly, unexpectedly reaching out to people from the past to "reconnect" or express gratitude may indicate the person is tying up loose ends.</p>
<p><strong>Researching methods</strong>: While counselors cannot access clients' internet searches, clients may disclose having researched suicide methods. Questions about medication doses, gun access, building heights, or other method-related information warrant immediate attention.</p>
<p><strong>Writing about death or suicide</strong>: Poetry, journal entries, social media posts, or other writings focused on death, suicide, or being better off dead can indicate preoccupation with suicide.</p>
<p><strong>Rehearsal behaviors</strong>: Some individuals engage in behaviors that approximate suicide attempts—visiting potential locations, handling means, or even engaging in low-lethality self-harm—as they work up to a lethal attempt. Such behaviors indicate serious and imminent risk.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Protective factors are characteristics that reduce suicide risk by buffering against risk factors or promoting resilience. Assessment should include protective factors alongside risk factors, as the presence of robust protective factors may partially mitigate elevated risk, while their absence in someone with risk factors indicates heightened concern.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Social Support and Connection`,
              content: `<p>Strong, supportive relationships protect against suicide by meeting belongingness needs, providing resources during crises, and creating reasons for living. The quality of relationships matters more than quantity—a few close, supportive relationships provide more protection than many superficial ones.</p>
<p>Assessment should explore not just whether the client has relationships but whether they feel genuinely supported and connected. Who could they call in a crisis? Who would notice if they were struggling? Do they feel understood and valued by others?</p>
`
            },
            {
              title: `Reasons for Living`,
              content: `<p>Reasons for living—specific factors that motivate a person to stay alive—are among the strongest protective factors. These might include relationships (children, spouse, parents), religious beliefs, future goals, fear of death or pain, beliefs about suicide, or anything else that connects the person to life.</p>
<p>The Reasons for Living Inventory and other instruments can systematically assess this domain, but simple direct inquiry is also valuable: "What keeps you going? What makes life worth living? What would you miss if you were gone?"</p>
`
            },
            {
              title: `Religious and Spiritual Beliefs`,
              content: `<p>Religious involvement and certain religious beliefs protect against suicide. Most major religions explicitly prohibit suicide, providing moral frameworks against it. Religious communities also provide social support and belongingness. And religious beliefs about meaning and purpose may counter hopelessness.</p>
<p>However, the relationship between religion and suicide risk is complex. Not all religious beliefs are protective, and some forms of religious involvement may increase guilt or shame that worsens distress. Assessment should explore the nature and function of spiritual beliefs rather than assuming protection.</p>
`
            },
            {
              title: `Effective Coping Skills`,
              content: `<p>The ability to regulate emotions, tolerate distress, solve problems, and seek help when needed protects against suicide by enabling individuals to navigate crises without resorting to self-harm. Individuals with well-developed coping skills can manage stressors that might overwhelm someone with fewer resources.</p>
<p>Assessment of coping skills includes inquiry about how the person has managed difficulties in the past, what strategies they use when distressed, and whether they have been able to seek help appropriately.</p>
`
            },
            {
              title: `Access to Mental Health Care`,
              content: `<p>Access to and engagement with mental health treatment protects against suicide by addressing underlying conditions, providing crisis support, and building skills. Clients who are actively engaged in treatment, have strong therapeutic relationships, and can access help when needed are at lower risk than those who are isolated from care.</p>
<p>However, access alone is not sufficient—the treatment must be effective and the client must be engaged. Poor-quality treatment or treatment that the client does not trust may provide minimal protection.</p>
`
            },
            {
              title: `Restricted Access to Means`,
              content: `<p>Limited access to lethal means—particularly firearms—protects against suicide by reducing the likelihood that suicidal impulses will result in lethal outcomes. Means restriction is one of the most effective suicide prevention strategies because it does not require changing the person's underlying distress, only their ability to act on it during crisis.</p>
<p>Assessment should include inquiry about access to firearms, medications, and other means, with attention to whether any means restriction strategies have been implemented.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Effective suicide risk assessment integrates information about risk factors, warning signs, and protective factors into an overall clinical judgment about risk level and appropriate intervention. This is not a mechanical process of adding up risk factors—rather, it requires clinical reasoning about how factors interact in the specific context of each unique client.</p>
<p>A client with multiple distal risk factors but strong protective factors and no current warning signs may be at lower imminent risk than a client with fewer risk factors but acute warning signs and few protections. A client who has attempted suicide previously is always at elevated baseline risk, but that risk fluctuates based on current circumstances. The art of risk assessment lies in weighing these factors appropriately.</p>
<p>Risk assessment should be documented thoroughly, including specific factors identified, the reasoning process, the conclusions reached, and the interventions implemented. This documentation serves clinical purposes (tracking risk over time), communicates to other providers, and provides legal protection by demonstrating appropriate professional conduct.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is considered the single strongest predictor of future suicidal behavior?`,
          options: [
              { text: `Depression`, isCorrect: true },
              { text: `Previous suicide attempt`, isCorrect: false },
              { text: `Family history of suicide`, isCorrect: false },
              { text: `Hopelessness`, isCorrect: false }
          ],
          explanation: `Review the content in Module 2 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The IS PATH WARM mnemonic includes all of the following warning signs EXCEPT:?`,
          options: [
              { text: `Anxiety`, isCorrect: false },
              { text: `Substance abuse`, isCorrect: true },
              { text: `Family conflict`, isCorrect: false },
              { text: `Mood changes`, isCorrect: false }
          ],
          explanation: `Review the content in Module 2 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `According to research, hopelessness predicts suicide risk:?`,
          options: [
              { text: `Less strongly than depression severity`, isCorrect: false },
              { text: `About equally with depression severity`, isCorrect: false },
              { text: `More strongly than depression severity`, isCorrect: true },
              { text: `Only in elderly populations`, isCorrect: false }
          ],
          explanation: `Review the content in Module 2 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is considered a protective factor against suicide?`,
          options: [
              { text: `Social isolation`, isCorrect: false },
              { text: `Access to firearms`, isCorrect: false },
              { text: `Reasons for living`, isCorrect: false },
              { text: `Previous suicide attempt`, isCorrect: true }
          ],
          explanation: `Review the content in Module 2 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The period immediately following psychiatric hospitalization is associated with:?`,
          options: [
              { text: `Decreased suicide risk due to treatment`, isCorrect: true },
              { text: `Elevated suicide risk`, isCorrect: false },
              { text: `No change in suicide risk`, isCorrect: false },
              { text: `Elevated risk only for first-time hospitalizations`, isCorrect: false }
          ],
          explanation: `Review the content in Module 2 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "matching",
          matchingInstructions: `Match each risk factor category to the correct examples.`,
          matchingPairs: [
            { term: `Distal Risk Factors`, definition: `Previous attempt, family history, childhood trauma, chronic illness` },
            { term: `Proximal Risk Factors`, definition: `Recent loss, acute intoxication, access to means, sleep disturbance` },
            { term: `Warning Signs`, definition: `Giving away possessions, saying goodbye, sudden calm after depression` },
            { term: `Protective Factors`, definition: `Strong social connections, reasons for living, religious beliefs, treatment engagement` }
          ],
          accessibility: { ariaLabel: "Matching exercise", role: "application" }
        }
      ]
    },
    {
      title: `Comprehensive Suicide Risk Assessment`,
      order: 3,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: `Module 3`,
          subtitle: `Comprehensive Suicide Risk Assessment`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Suicide risk assessment is a clinical skill that combines structured inquiry, validated instruments, clinical interviewing, and professional judgment. This module provides practical guidance for conducting comprehensive suicide risk assessments, including specific questions to ask, instruments to use, and frameworks for organizing assessment findings.</p>
<p>Risk assessment serves multiple purposes. It identifies individuals in need of intervention. It informs decisions about level of care (outpatient, intensive outpatient, hospitalization). It guides treatment planning by identifying specific targets for intervention. It documents clinical decision-making for legal and ethical purposes. And, importantly, it can itself be therapeutic—thoughtful, compassionate inquiry about suicidality can build rapport, convey caring, and help clients feel understood.</p>
<p>Risk assessment is not a one-time event but an ongoing process throughout treatment. Initial assessments establish baseline risk and identify factors requiring attention. Subsequent assessments monitor changes in risk level and evaluate response to intervention. Crisis assessments respond to acute presentations and guide immediate intervention. Periodic reassessment ensures that emerging risks are detected.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "imageText",
          title: `The Columbia-Suicide Severity Rating Scale (C-SSRS)`,
          content: `<p>The C-SSRS is a structured interview that assesses suicidal ideation on a 5-point scale and tracks suicidal behavior. It is one of the most widely used and validated suicide assessment instruments worldwide, recommended by the FDA, CDC, WHO, and numerous clinical practice guidelines.</p><p><strong>The 5 levels of ideation:</strong> (1) Wish to be dead, (2) Non-specific active thoughts, (3) Active ideation with any methods, (4) Active ideation with some intent, (5) Active ideation with specific plan and intent.</p>`,
          image: `/images/courses/suicide-risk/cssrs-scale.png`,
          imageAlt: `Diagram of the Columbia-Suicide Severity Rating Scale showing 5 levels of suicidal ideation`,
          imagePosition: "right",
          accessibility: { role: "figure", ariaLabel: `Diagram of the Columbia-Suicide Severity Rating Scale showing 5 levels of suicidal ideation` }
        },
        {
          type: "text",
          content: `<p>Before delving into assessment techniques, it is important to recognize that clients may hesitate to disclose suicidal thoughts due to fear of hospitalization, shame, concern about burdening the counselor, or worry about how they will be perceived. Creating conditions that facilitate honest disclosure is essential for accurate assessment.</p>
<p>Counselors can promote disclosure by normalizing the experience of suicidal thoughts ("Many people going through what you're going through have thoughts of suicide—have you had thoughts like that?"), by conveying acceptance rather than alarm when clients disclose, by clarifying the purpose of assessment (to help, not to hospitalize unnecessarily), and by maintaining a calm, compassionate demeanor throughout.</p>
<p>Some clients may test the counselor's response by disclosing minimally and watching how the counselor reacts. A counselor who responds with visible distress, immediate discussion of hospitalization, or judgment may discourage further disclosure. A counselor who responds with calm inquiry, validation, and collaborative problem-solving encourages honesty.</p>
<p>That said, counselors should not promise confidentiality they cannot keep. Clients should understand from the outset of treatment that confidentiality has limits when safety is at risk, and that the counselor's goal is to keep them safe while maintaining as much collaboration and autonomy as possible.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>A comprehensive suicide risk assessment covers multiple domains through clinical interview. While structured instruments provide valuable data, they cannot replace thoughtful clinical inquiry that explores the nuances of each individual's experience.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Suicidal Ideation`,
              content: `<p>Assessment of ideation should explore:</p>
<p><strong>Presence and nature</strong>: "Are you having any thoughts of suicide or harming yourself?" "What kind of thoughts are you having?"</p>
<p><strong>Frequency</strong>: "How often do you have these thoughts?" "Do they come and go or are they constant?"</p>
<p><strong>Intensity</strong>: "How strong is the urge when you have these thoughts?" "On a scale of 0-10, how intense are these thoughts?"</p>
<p><strong>Duration</strong>: "When did these thoughts start?" "How long do they last when they occur?"</p>
<p><strong>Controllability</strong>: "Can you make the thoughts go away?" "Do the thoughts ever feel like they're controlling you?"</p>
<p><strong>Active vs. passive</strong>: "Do you wish you were dead, or are you actually thinking about doing something to end your life?"</p>
`
            },
            {
              title: `Suicide Plan`,
              content: `<p>When ideation is present, assessment should explore whether the client has a plan:</p>
<p><strong>Presence of plan</strong>: "Have you thought about how you might do it?" "Do you have a plan?"</p>
<p><strong>Specificity</strong>: "How detailed is the plan?" "Have you thought about when, where, and how?"</p>
<p><strong>Lethality</strong>: Consider the likely lethality of the planned method. Firearms are highly lethal; most other methods less so.</p>
<p><strong>Availability</strong>: "Do you have access to [the planned method]?" "What would you need to get to carry out this plan?"</p>
<p><strong>Preparations</strong>: "Have you done anything to prepare?" "Have you acquired anything, written a note, or made any arrangements?"</p>
`
            },
            {
              title: `Intent`,
              content: `<p>Intent refers to the client's actual determination to act on suicidal thoughts:</p>
<p><strong>Subjective intent</strong>: "Do you intend to act on these thoughts?" "Are you planning to kill yourself?"</p>
<p><strong>Ambivalence</strong>: "Part of you wants to die—is there part of you that wants to live?" Exploring ambivalence can identify protective factors and intervention targets.</p>
<p><strong>Deterrents</strong>: "What has kept you from acting on these thoughts?" "What would need to change for you to act?"</p>
<p><strong>Expectations</strong>: "What do you think would happen if you attempted suicide?" "Do you think you would die?"</p>
`
            },
            {
              title: `Previous Attempts`,
              content: `<p>For clients with a history of attempts:</p>
<p><strong>Circumstances</strong>: "What was going on in your life when you attempted?" Understanding precipitants helps identify current vulnerabilities.</p>
<p><strong>Method</strong>: "What did you do?" Method lethality of previous attempts informs risk assessment.</p>
<p><strong>Intent</strong>: "What were you hoping would happen?" "Did you expect to die?"</p>
<p><strong>Medical severity</strong>: "What happened physically?" "Did you need medical treatment?" Medical severity indicates how close the person came to death.</p>
<p><strong>Aftermath</strong>: "What was it like after?" "How do you feel about the attempt now?" Regret may be protective; ongoing wish to have died is concerning.</p>
<p><strong>Multiple attempts</strong>: "How many times have you attempted?" "Were the attempts similar or different?"</p>
`
            },
            {
              title: `Risk and Protective Factors`,
              content: `<p>Assessment should systematically cover the risk and protective factors discussed in Module 2:</p>
<p><strong>Mental health</strong>: Current symptoms, diagnoses, treatment status
<strong>Substance use</strong>: Current use, recent changes
<strong>Stressors</strong>: Recent events, ongoing difficulties
<strong>Social support</strong>: Quality of relationships, availability of support
<strong>Hopelessness</strong>: Expectations about the future
<strong>Reasons for living</strong>: What connects the client to life
<strong>Access to means</strong>: Particularly firearms</p>
`
            },
            {
              title: `Mental Status`,
              content: `<p>Suicide risk assessment should include attention to mental status:</p>
<p><strong>Mood and affect</strong>: Depressed, anxious, agitated, flat
<strong>Cognition</strong>: Orientation, concentration, thought process
<strong>Psychosis</strong>: Hallucinations, delusions (command hallucinations are particularly concerning)
<strong>Intoxication</strong>: Current substance effects
<strong>Impulsivity</strong>: Current behavioral control
<strong>Insight and judgment</strong>: Understanding of situation and ability to make decisions</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>The Columbia-Suicide Severity Rating Scale (Posner et al., 2011) is a validated, widely-used instrument that provides systematic assessment of suicidal ideation and behavior. Originally developed for research, it has been adapted for clinical use and is now employed in healthcare settings, emergency departments, schools, and other contexts.</p>
<p>The C-SSRS assesses suicidal ideation on a 5-point scale:</p>
<p>1. <strong>Wish to be dead</strong>: Passive thoughts about wanting to be dead or not wanting to be alive anymore
2. <strong>Non-specific active suicidal thoughts</strong>: General thoughts of wanting to end one's life/suicide without thoughts of methods
3. <strong>Active suicidal ideation with any methods (not plan) without intent to act</strong>: Thoughts of suicide with consideration of method but no specific plan or intent
4. <strong>Active suicidal ideation with some intent to act, without specific plan</strong>: Active suicidal thoughts with some intent but no specific plan
5. <strong>Active suicidal ideation with specific plan and intent</strong>: Thoughts of suicide with a specific plan and intent to carry it out</p>
<p>Higher levels indicate greater severity. The scale also assesses intensity of ideation (frequency, duration, controllability, deterrents, reasons for ideation) and categorizes suicidal behavior (actual attempt, interrupted attempt, aborted attempt, preparatory acts, non-suicidal self-injurious behavior).</p>
<p>The C-SSRS is available in multiple versions (lifetime/recent, screening, since last visit) and has been validated across populations and settings. Training in its use is available free of charge from the Columbia Lighthouse Project.</p>
<h2>Clinical Use of the C-SSRS</h2>
<p>In clinical practice, the C-SSRS can serve as:</p>
<p><strong>Screening tool</strong>: The brief screener version can efficiently identify individuals warranting more comprehensive assessment.</p>
<p><strong>Assessment framework</strong>: The full version provides systematic coverage of ideation and behavior domains.</p>
<p><strong>Documentation tool</strong>: Completing the C-SSRS creates documentation of assessment.</p>
<p><strong>Outcome measure</strong>: Serial administration tracks changes in suicidality over time.</p>
<p><strong>Communication tool</strong>: Standardized language facilitates communication between providers.</p>
<p>The C-SSRS is not intended to replace clinical judgment or to dictate disposition decisions. A client who scores at a certain level does not automatically require a certain intervention. Rather, the scale provides data that informs—but does not determine—clinical decision-making.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>The Patient Health Questionnaire-9 (PHQ-9) is a widely-used depression screening instrument. Item 9 asks: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?"</p>
<p>Response options are: Not at all (0), Several days (1), More than half the days (2), Nearly every day (3).</p>
<p>Any response other than "Not at all" warrants follow-up assessment. Item 9 is not a comprehensive suicide assessment but serves as an efficient screen that can be incorporated into routine care.</p>
<p>When Item 9 is positive, clinicians should:
- Acknowledge the response: "I see you've been having some difficult thoughts..."
- Inquire further: "Can you tell me more about these thoughts?"
- Conduct appropriate assessment based on initial responses
- Document findings and clinical decision-making</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Following assessment, clinicians must formulate a clinical judgment about risk level. While various frameworks exist, a common approach distinguishes low, moderate, and high risk:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Low Risk`,
              content: `<p>Characteristics:
- Suicidal ideation absent or limited to passive ideation
- No plan or intent
- No recent preparatory behaviors
- Some risk factors may be present
- Protective factors are present and robust
- No recent suicide attempts or attempts were distant past with no recurrence</p>
<p>Clinical response:
- Continue outpatient treatment
- Address modifiable risk factors
- Strengthen protective factors
- Develop or review safety plan
- Schedule appropriate follow-up
- Document assessment and rationale</p>
`
            },
            {
              title: `Moderate Risk`,
              content: `<p>Characteristics:
- Active suicidal ideation present
- May have thoughts about methods but no specific plan, OR
- Has a plan but denies intent
- Some risk factors present
- Protective factors present but may be weakened
- May have history of attempts</p>
<p>Clinical response:
- Intensify treatment (increased frequency, additional services)
- Implement or update safety plan
- Address means access
- Increase monitoring
- Consider involving support persons
- Consider intensive outpatient or partial hospitalization
- Document assessment, rationale, and safety interventions</p>
`
            },
            {
              title: `High Risk`,
              content: `<p>Characteristics:
- Active suicidal ideation with intent and/or specific plan
- Recent suicide attempt or preparatory behaviors
- Multiple acute risk factors
- Limited protective factors
- Unable or unwilling to commit to safety</p>
<p>Clinical response:
- Continuous observation until safety ensured
- Implement crisis intervention
- Consider psychiatric hospitalization
- If refusing hospitalization, consider involuntary commitment if criteria met
- Remove or secure lethal means
- Involve support persons
- Document thoroughly including risk factors, protective factors, clinical reasoning, and interventions</p>
`
            },
            {
              title: `Important Caveats`,
              content: `<p>Risk stratification provides a useful framework but has significant limitations. Research has consistently shown that clinicians cannot reliably predict which individuals will die by suicide; both false positives (overestimating risk) and false negatives (underestimating risk) are common. Risk factors that elevate group-level risk do not permit accurate prediction for individuals.</p>
<p>Given these limitations, risk stratification should be understood as guiding intervention intensity rather than predicting outcome. A "low risk" classification does not mean the person is safe—it means that, based on available information, the clinical picture does not warrant intensive intervention at this time. A "high risk" classification does not mean the person will certainly attempt suicide—it means that the clinical picture warrants aggressive intervention.</p>
<p>Clinical judgment should integrate all available information and remain open to revision as new information emerges. When in doubt, err on the side of more intensive intervention.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Thorough documentation of suicide risk assessment serves clinical, communication, and legal purposes. Documentation should include:</p>
<p><strong>The assessment process</strong>: What was asked, what instruments were used, what information sources were consulted</p>
<p><strong>Findings</strong>: Specific information about ideation (frequency, intensity, duration, content), plan (presence, specificity, lethality), intent, previous attempts, current mental status, relevant history</p>
<p><strong>Risk factors identified</strong>: Both distal and proximal risk factors present in this case</p>
<p><strong>Protective factors identified</strong>: Factors mitigating risk</p>
<p><strong>Clinical reasoning</strong>: How the information was synthesized into a risk determination</p>
<p><strong>Risk level determined</strong>: With rationale</p>
<p><strong>Interventions implemented</strong>: Safety planning, means restriction, treatment modifications, hospitalization considerations, etc.</p>
<p><strong>Follow-up plan</strong>: What monitoring will occur, when the next appointment is</p>
<p>Good documentation demonstrates that the clinician conducted a thorough assessment, exercised appropriate clinical judgment, and implemented reasonable interventions. It provides evidence of professional conduct that can be critical if the clinician's care is later questioned.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Assessing Risk by Phone or Telehealth`,
              content: `<p>When conducting suicide risk assessment remotely, clinicians face additional challenges:</p>
<p>- Cannot observe the full environment
- May not be able to verify the client's identity or location
- Emergency response is complicated if the client is not local
- Non-verbal cues may be limited</p>
<p>Best practices for remote assessment include:
- Verifying the client's current location at the start of each session
- Having emergency contact information readily available
- Having a plan for emergency response if the client is in crisis
- Using video when possible to enhance observation
- Explicitly addressing assessment limitations</p>
`
            },
            {
              title: `Assessing Clients Who Minimize`,
              content: `<p>Some clients minimize or deny suicidal thoughts to avoid hospitalization or for other reasons. Signs that a client may be minimizing include:</p>
<p>- Inconsistency between verbal reports and other behavior
- Family or others reporting concerns the client denies
- Vague or evasive responses
- Sudden improvement that seems implausible
- Previous pattern of minimization</p>
<p>When minimization is suspected:
- Gently name the observation: "I notice you seem uncomfortable talking about this"
- Explore fears about disclosure
- Clarify that hospitalization is not automatic
- Use collateral information
- Trust clinical intuition while documenting concerns
- Consider safety planning even if client denies ideation</p>
`
            },
            {
              title: `Assessing Clients in Crisis`,
              content: `<p>Clients in acute crisis may be unable to participate in systematic assessment. In these situations:</p>
<p>- Prioritize immediate safety
- Keep questions simple and direct
- Assess the most critical domains (current ideation, plan, intent, means access)
- Do not attempt comprehensive history during acute crisis
- Focus on de-escalation and crisis intervention
- Complete thorough assessment once crisis stabilizes</p>
`
            },
            {
              title: `Assessing Clients with Co-Occurring Substance Use`,
              content: `<p>Substance use complicates suicide risk assessment in multiple ways. Acute intoxication affects judgment, increases impulsivity, and may intensify suicidal thoughts. Chronic substance use is itself a risk factor for suicide. Withdrawal states can produce or exacerbate suicidal ideation. And substances may be used as a method of suicide attempt.</p>
<p>When assessing clients with substance involvement:</p>
<p><strong>Assess current intoxication</strong>: Is the client currently under the influence? Intoxication does not invalidate suicidal statements—intoxicated clients can and do die by suicide—but it affects the nature of the assessment and intervention.</p>
<p><strong>Distinguish acute from chronic patterns</strong>: Is this an isolated episode of intoxication, or does the client have ongoing substance use issues? Chronic substance use disorders warrant different treatment planning than acute intoxication in someone without a substance use history.</p>
<p><strong>Consider the role of substances in ideation</strong>: Did suicidal thoughts precede or follow substance use? Does the client use substances specifically to cope with suicidal thoughts? Understanding this relationship informs intervention.</p>
<p><strong>Assess for substances as means</strong>: Does the client have access to substances that could be used in an overdose? Include prescription medications, over-the-counter medications, and illicit substances in means assessment.</p>
<p><strong>Plan for safety during intoxication</strong>: Safety plans should specifically address what the client will do if they have suicidal thoughts while intoxicated, as coping strategies that work while sober may be inaccessible while impaired.</p>
`
            },
            {
              title: `Assessing Clients with Psychotic Symptoms`,
              content: `<p>Psychotic symptoms can significantly affect suicide risk and require specific assessment considerations:</p>
<p><strong>Command hallucinations</strong>: Auditory hallucinations commanding the person to harm themselves warrant immediate attention. Assess the content of hallucinations, the client's ability to resist commands, and history of acting on commands.</p>
<p><strong>Paranoid delusions</strong>: Paranoid beliefs can drive suicide as an escape from perceived persecution. Assess whether suicidal thoughts are connected to delusional content.</p>
<p><strong>Disorganization</strong>: Severe disorganization may limit the client's ability to participate in assessment or implement safety plans. More structured, concrete approaches may be necessary.</p>
<p><strong>Insight</strong>: Preserved insight during psychotic episodes can be a double-edged sword—awareness of one's condition may increase distress and contribute to hopelessness.</p>
<p><strong>Medication effects</strong>: Both untreated psychosis and some antipsychotic medications can affect suicide risk. Consider both in assessment and treatment planning.</p>
`
            },
            {
              title: `Using Collateral Information`,
              content: `<p>Information from sources other than the client can be valuable in suicide risk assessment, particularly when the client may be minimizing or when cognitive impairment limits self-report. Collateral sources include:</p>
<p><strong>Family members</strong>: May observe warning signs the client doesn't recognize or report. May have information about family history, previous attempts, and current stressors.</p>
<p><strong>Other treatment providers</strong>: Previous therapists, psychiatrists, primary care physicians, and emergency department records can provide history of suicidal behavior and treatment.</p>
<p><strong>School personnel</strong>: For adolescents, teachers and school counselors may observe changes in behavior or academic performance.</p>
<p><strong>Medical records</strong>: Documentation of previous hospitalizations, suicide attempts, and psychiatric history.</p>
<p>When using collateral information:
- Obtain appropriate consent/authorization
- Clarify confidentiality limits with the client
- Integrate collateral information with clinical interview
- Note discrepancies between sources
- Consider the informant's perspective and potential biases</p>
`
            },
            {
              title: `Cultural Considerations in Assessment`,
              content: `<p>Cultural factors influence how suicidal distress is expressed, understood, and discussed. Culturally responsive assessment requires attention to:</p>
<p><strong>Idioms of distress</strong>: Different cultures express psychological suffering differently. Somatic complaints, spiritual explanations, or culture-specific symptoms may indicate distress that would otherwise be missed.</p>
<p><strong>Stigma around suicide</strong>: In some cultures, suicide carries profound stigma that may prevent disclosure. Creating safety for disclosure may require more time and rapport.</p>
<p><strong>Language</strong>: When working through interpreters, ensure the interpreter understands suicide-related concepts and confidentiality requirements. Some languages may lack direct equivalents for clinical terms.</p>
<p><strong>Family involvement</strong>: Cultural norms around family involvement in healthcare vary. Some clients may expect family participation; others may need family excluded to speak freely.</p>
<p><strong>Help-seeking norms</strong>: Cultural attitudes toward mental health treatment affect whether clients will engage with assessment and intervention.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "multipleChoice",
          question: `The Columbia-Suicide Severity Rating Scale (C-SSRS) assesses suicidal ideation on a scale of:?`,
          options: [
              { text: `1-10`, isCorrect: true },
              { text: `1-5`, isCorrect: false },
              { text: `Low/Medium/High`, isCorrect: false },
              { text: `None/Mild/Moderate/Severe`, isCorrect: false }
          ],
          explanation: `Review the content in Module 3 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following best describes a client at "moderate risk"?`,
          options: [
              { text: `No suicidal ideation`, isCorrect: false },
              { text: `Active ideation with methods but no specific plan or denying intent`, isCorrect: true },
              { text: `Active ideation with specific plan and intent`, isCorrect: false },
              { text: `Passive ideation only`, isCorrect: false }
          ],
          explanation: `Review the content in Module 3 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `When a client appears to be minimizing suicidal thoughts, the counselor should:?`,
          options: [
              { text: `Accept the client's report at face value`, isCorrect: false },
              { text: `Immediately hospitalize the client`, isCorrect: false },
              { text: `Gently name the observation and explore fears about disclosure`, isCorrect: true },
              { text: `Terminate the session`, isCorrect: false }
          ],
          explanation: `Review the content in Module 3 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `PHQ-9 Item 9 screens for:?`,
          options: [
              { text: `Anxiety symptoms`, isCorrect: false },
              { text: `Sleep disturbance`, isCorrect: false },
              { text: `Thoughts of being better off dead or self-harm`, isCorrect: false },
              { text: `Substance use`, isCorrect: true }
          ],
          explanation: `Review the content in Module 3 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Documentation of suicide risk assessment should include all of the following EXCEPT:?`,
          options: [
              { text: `Risk factors identified`, isCorrect: true },
              { text: `Clinical reasoning`, isCorrect: false },
              { text: `Prediction of whether the client will attempt suicide`, isCorrect: false },
              { text: `Interventions implemented`, isCorrect: false }
          ],
          explanation: `Review the content in Module 3 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "text",
          content: `<div style="background:#FFF8E1;border-left:4px solid #D4A855;padding:16px;border-radius:4px;margin:16px 0;">
<h2>🏥 Clinical Vignette: Assessment in Action</h2>
<p><strong>Marcus, 42, presents to your office for his third session.</strong> He has been treated for depression following his divorce. Today he appears more withdrawn than usual. When you ask how he's been, he says, "I've been thinking it might be easier for everyone if I wasn't around." He reports giving his dog to his sister last week and has been "getting his affairs in order."</p>
<p><strong>Consider:</strong> What risk factors and warning signs do you identify? How would you structure your assessment from this point? What level on the C-SSRS would you initially assign, and what additional information do you need?</p>
</div>`,
          accessibility: { role: "article" }
        },
        {
          type: "reflection",
          question: `Consider a recent client where you assessed suicide risk. What assessment tools or frameworks did you use? After reviewing the C-SSRS and risk stratification models, would you change anything about your approach?`,
          accessibility: { role: "textbox", ariaLabel: "Reflection prompt" }
        }
      ]
    },
    {
      title: `Crisis Intervention and Safety Planning`,
      order: 4,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 4,
          title: `Module 4`,
          subtitle: `Crisis Intervention and Safety Planning`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>When clients present with suicidal ideation, counselors must shift from assessment to intervention. Effective crisis intervention stabilizes the immediate crisis, reduces acute risk, and creates a bridge to longer-term treatment. This module covers evidence-based crisis intervention strategies, with particular emphasis on safety planning and lethal means counseling—two interventions with strong empirical support.</p>
<p>Crisis intervention with suicidal clients requires balancing multiple considerations. The intervention must address immediate safety while maintaining therapeutic rapport. It must provide structure and guidance while respecting client autonomy. It must take the crisis seriously without overreacting in ways that damage the therapeutic relationship or discourage future disclosure. Skilled crisis intervention walks these fine lines through collaborative, empathic engagement that keeps safety at the forefront.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "imageText",
          title: `Stanley-Brown Safety Planning Intervention`,
          content: `<p>The Safety Planning Intervention (SPI) is a brief, collaborative clinical intervention that creates a prioritized list of coping strategies and support sources for use during suicidal crises. Research demonstrates it reduces suicidal behavior by up to 50%.</p><p><strong>The 6 Steps:</strong> (1) Warning signs, (2) Internal coping strategies, (3) People and social settings for distraction, (4) People to contact for help, (5) Professionals and agencies to contact, (6) Making the environment safe.</p>`,
          image: `/images/courses/suicide-risk/safety-plan-steps.png`,
          imageAlt: `Visual diagram of the 6 steps of the Stanley-Brown Safety Planning Intervention`,
          imagePosition: "left",
          accessibility: { role: "figure", ariaLabel: `Visual diagram of the 6 steps of the Stanley-Brown Safety Planning Intervention` }
        },
        {
          type: "text",
          content: `<p>Several core principles guide effective crisis intervention with suicidal clients:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Maintain Calm Presence`,
              content: `<p>Clients in suicidal crisis are often experiencing overwhelming emotional distress. A counselor who responds with visible anxiety, alarm, or panic may inadvertently escalate the crisis. Maintaining a calm, grounded presence provides containment and communicates confidence that the situation can be managed. This does not mean being cold or distant—warmth and concern can coexist with calmness.</p>
`
            },
            {
              title: `Validate the Pain, Not the Solution`,
              content: `<p>Suicidal clients need their pain acknowledged and validated. Statements like "It sounds like you're in tremendous pain right now" or "What you're going through sounds unbearable" validate the client's experience without validating suicide as a solution. Avoid minimizing statements ("Things aren't that bad") or premature reassurance ("Everything will be fine").</p>
`
            },
            {
              title: `Instill Hope`,
              content: `<p>Hopelessness drives suicidal ideation, and crisis intervention should address this cognitive state. However, hollow reassurance ("Everything will be okay") is not helpful and may feel invalidating. Instead, instill hope through specific, credible statements: "People who feel the way you do right now can and do get better," "We're going to work together to get you through this," "You've survived difficult times before, and you can survive this too."</p>
`
            },
            {
              title: `Be Collaborative`,
              content: `<p>Crisis intervention should be as collaborative as possible, engaging the client as an active participant rather than a passive recipient of intervention. Collaboration supports client autonomy, increases buy-in to safety planning, and maintains therapeutic alliance. Ask clients for their input, involve them in problem-solving, and explain the rationale for interventions.</p>
`
            },
            {
              title: `Focus on Here and Now`,
              content: `<p>Crisis intervention addresses the immediate situation, not underlying issues that can be explored later. Keep the focus narrow: What is the immediate danger? What needs to happen to ensure safety today? Long-term treatment planning can wait; immediate safety cannot.</p>
`
            },
            {
              title: `Don't Make Promises You Can't Keep`,
              content: `<p>Avoid promises about what will or won't happen (e.g., "I won't let them hospitalize you"). Such promises may not be possible to keep and will damage trust if broken. Instead, be honest about what you can and cannot control while committing to advocacy and collaboration.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>The Safety Planning Intervention (SPI) developed by Barbara Stanley and Gregory Brown (Stanley & Brown, 2012) is a brief, evidence-based intervention that creates a written, prioritized list of coping strategies and resources for use during suicidal crises. Research has demonstrated that safety planning reduces suicide attempts and promotes treatment engagement.</p>
<p>Safety planning differs fundamentally from "no-suicide contracts" or "contracts for safety," which have no empirical support and are not recommended. While contracts ask clients to promise not to hurt themselves—putting responsibility entirely on the client—safety planning collaboratively develops specific, actionable strategies that the client can use when distressed.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `The Six Steps of Safety Planning`,
              content: `<p>The Stanley-Brown Safety Planning Intervention consists of six steps, completed collaboratively with the client and documented on a wallet card, form, or app that the client keeps:</p>
`
            },
            {
              title: `Step 1: Recognizing Warning Signs`,
              content: `<p>The first step identifies the internal experiences—thoughts, feelings, physical sensations, behaviors—that signal an approaching crisis. These personalized warning signs alert the client that they need to use their safety plan.</p>
<p>Sample questions:
- "What happens inside you when a crisis is starting?"
- "What thoughts do you have? What feelings come up? What do you notice in your body?"
- "How would you know that you need to use this safety plan?"</p>
<p>Examples of warning signs:
- Thoughts: "I can't do this anymore," "Nobody cares," "What's the point?"
- Feelings: Overwhelming sadness, numbness, agitation, anger
- Physical sensations: Chest tightness, racing heart, exhaustion
- Behaviors: Withdrawing from others, increased substance use, stopping self-care</p>
<p>The goal is to identify warning signs early enough that intervention strategies can be effective. If warning signs are recognized only when crisis is already acute, the window for intervention is limited.</p>
`
            },
            {
              title: `Step 2: Internal Coping Strategies`,
              content: `<p>The second step identifies activities the client can do on their own—without contacting anyone else—to distract from suicidal thoughts and reduce emotional intensity. These strategies are used first, before reaching out to others.</p>
<p>Sample questions:
- "What can you do by yourself to take your mind off your problems?"
- "What activities help you feel better when you're distressed?"
- "What has helped you cope in the past?"</p>
<p>Examples of internal coping strategies:
- Physical activity (walking, exercise, yoga)
- Relaxation techniques (deep breathing, progressive muscle relaxation)
- Enjoyable activities (listening to music, watching comedy, playing games)
- Self-soothing (warm bath, comfortable clothing, pleasant scents)
- Mindfulness and grounding techniques
- Creative expression (writing, art, music)</p>
<p>Not all strategies work for everyone. The goal is to identify 3-5 strategies that this specific client finds helpful. The client should be able to implement these strategies even when distressed, so complex or resource-intensive activities may not be practical.</p>
`
            },
            {
              title: `Step 3: Social Contacts Who Can Distract`,
              content: `<p>The third step identifies people and social settings that can provide distraction from suicidal thoughts—not necessarily by talking about the crisis, but simply through social interaction that shifts attention away from suicidal rumination.</p>
<p>Sample questions:
- "Who are people you can be around to help take your mind off things?"
- "What social settings might help distract you from these thoughts?"
- "Is there somewhere you could go to be around other people?"</p>
<p>Examples:
- Specific family members or friends (with contact information)
- Social settings: coffee shop, gym, library, place of worship
- Community activities: support groups, clubs, volunteer activities</p>
<p>The key distinction from Step 4 is that these contacts provide distraction, not crisis support. The client is not necessarily disclosing their suicidal thoughts to these people but is using social contact to reduce isolation and shift focus.</p>
`
            },
            {
              title: `Step 4: People to Contact for Help`,
              content: `<p>The fourth step identifies specific people the client can contact specifically for help during a suicidal crisis—people to whom the client would disclose that they are struggling with suicidal thoughts and ask for support.</p>
<p>Sample questions:
- "Who could you call if the strategies we've discussed aren't working?"
- "Who in your life knows about your struggles and could provide support?"
- "Who could you tell that you're having thoughts of suicide?"</p>
<p>For each person identified:
- Record name and contact information
- Discuss what the client would say when calling
- Consider potential barriers (availability, willingness)
- Identify backup contacts if first choice is unavailable</p>
<p>Not all clients have people they can call for crisis support. For some, this step may include only professionals (see Step 5). The absence of personal crisis supports is important clinical information about the client's isolation.</p>
`
            },
            {
              title: `Step 5: Professionals and Agencies to Contact`,
              content: `<p>The fifth step lists professional resources the client can contact during a crisis, including the counselor, emergency services, and crisis lines.</p>
<p>At minimum, include:
- Counselor's contact information (including after-hours procedures)
- 988 Suicide & Crisis Lifeline (call or text 988)
- Crisis Text Line (text HOME to 741741)
- Local emergency services (911)
- Local crisis centers or mobile crisis teams
- Emergency department information</p>
<p>Discuss with the client when to use each resource. The counselor's number might be appropriate for non-emergency concerns during business hours. 988 is available 24/7 for crisis support. 911 should be called if there is immediate danger.</p>
`
            },
            {
              title: `Step 6: Making the Environment Safe`,
              content: `<p>The final step addresses means restriction—reducing access to lethal means, particularly firearms and medications. This critical intervention is discussed in detail below.</p>
`
            },
            {
              title: `Implementing the Safety Plan`,
              content: `<p>After completing the safety plan, several implementation steps are essential:</p>
<p><strong>Review the complete plan</strong> with the client to ensure they understand each step and how the steps build on each other.</p>
<p><strong>Identify barriers</strong> to using the plan. What might prevent the client from using these strategies? How can barriers be addressed?</p>
<p><strong>Create a physical copy</strong> for the client to keep. The plan should be accessible during a crisis—on the client's phone, in their wallet, on their refrigerator.</p>
<p><strong>Practice the plan.</strong> For some clients, role-playing calling a support person or using a coping strategy increases the likelihood they will actually do so during a crisis.</p>
<p><strong>Plan for follow-up.</strong> Safety plans should be reviewed and updated regularly, not created once and forgotten.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Lethal means counseling (also called means restriction counseling or means safety counseling) is an evidence-based intervention that reduces access to methods of suicide, particularly firearms. Given that firearms account for over half of U.S. suicide deaths and have a case fatality rate exceeding 85%, means counseling is one of the most important interventions available for suicide prevention.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Why Means Matter`,
              content: `<p>Several empirical findings support the importance of means restriction:</p>
<p><strong>Method substitution is incomplete.</strong> Research consistently shows that when access to one method is reduced, people do not simply substitute another method at equal rates. Suicide is often impulsive, and barriers to the most accessible method can allow the suicidal crisis to pass.</p>
<p><strong>Most suicide attempt survivors do not go on to die by suicide.</strong> Studies of attempt survivors—including survivors of highly lethal attempts—find that approximately 90% do not eventually die by suicide. This suggests that surviving a suicidal crisis, often because the method used was not lethal, allows for recovery.</p>
<p><strong>Time matters.</strong> Many suicidal crises pass quickly. One study found that for nearly half of suicide attempt survivors, less than 10 minutes elapsed between deciding to attempt and taking action. Means that are immediately accessible during this brief window are much more dangerous than means that require more time or effort to access.</p>
<p><strong>Household firearm access increases suicide risk.</strong> Ecological studies, case-control studies, and cohort studies consistently find that access to firearms—particularly loaded, unlocked firearms—increases suicide risk, even after controlling for mental health and other factors.</p>
`
            },
            {
              title: `Conducting Means Counseling`,
              content: `<p>Effective means counseling involves several components:</p>
`
            },
            {
              title: `Assess Means Access`,
              content: `<p>Ask directly about access to firearms, medications, and other potentially lethal means:</p>
<p>- "Do you have any firearms in your home? How are they stored?"
- "Does anyone else in the household have firearms?"
- "Do you have access to firearms elsewhere?"
- "What medications do you have at home? Are there any that you could take too many of?"
- "Is there anything else you might use to hurt yourself?"</p>
<p>Some counselors are uncomfortable asking about firearms, but this discomfort should not prevent asking. The question is clinically necessary and can be asked matter-of-factly as part of routine safety assessment.</p>
`
            },
            {
              title: `Educate About Means and Suicide`,
              content: `<p>Many clients and families do not understand the relationship between means access and suicide risk. Brief education can increase receptivity to means restriction:</p>
<p>- "Research shows that when people in crisis don't have quick access to lethal means, they often survive the crisis and go on to live."
- "Most people who survive suicide attempts do not eventually die by suicide."
- "Putting time and distance between a suicidal urge and access to a lethal method can save lives."</p>
<p>Tailor the education to the specific client and their means access. For firearm owners, address firearm-specific information.</p>
`
            },
            {
              title: `Collaboratively Develop a Means Restriction Plan`,
              content: `<p>Work with the client (and ideally family members, with appropriate consent) to reduce access to lethal means. For firearms, options include:</p>
<p>- Temporarily storing firearms outside the home (with a friend, family member, gun dealer, shooting range, or law enforcement)
- Using a gun safe or lock box, with someone else controlling the key/combination
- Using a trigger lock or cable lock, with someone else controlling the key
- Disabling the firearm by removing a critical component (with the component stored separately)
- Selling or otherwise permanently disposing of the firearm</p>
<p>The most effective option is temporary storage outside the home, which creates both physical distance and time barriers. However, any reduction in accessibility is better than none. The best intervention is one the client will actually implement.</p>
<p>For medications, options include:</p>
<p>- Having a family member hold medications and dispense them as prescribed
- Disposing of unnecessary medications (using drug take-back programs)
- Storing medications in a locked container
- Reducing the number of pills in the home (smaller prescriptions, more frequent refills)</p>
<p>For other means, assess each individually and develop appropriate restrictions.</p>
`
            },
            {
              title: `Address Barriers`,
              content: `<p>Clients may resist means restriction for various reasons:</p>
<p>- Firearm owners may have Second Amendment concerns
- Hunters may feel their firearms are essential
- People living alone may feel unable to implement restrictions
- Family members may not take the risk seriously</p>
<p>Address barriers empathetically while maintaining focus on safety. Acknowledge the client's relationship with firearms without backing away from the clinical recommendation. Explore options that the client finds acceptable. If ideal interventions are rejected, work toward the best available alternative.</p>
`
            },
            {
              title: `Follow Up`,
              content: `<p>Means restriction should be verified and revisited over time. At subsequent sessions:</p>
<p>- "Did you follow through with securing your firearms? How did it go?"
- "Is the plan still in place? Has anything changed?"
- "Are there any means we haven't discussed?"</p>
<p>Means counseling is not one-and-done but an ongoing component of suicide care.</p>
`
            },
            {
              title: `Involving Family Members in Means Counseling`,
              content: `<p>When possible (and with appropriate consent), involving family members in means counseling improves implementation. Family members can:</p>
<p>- Store firearms or medications outside the home
- Control access to locked storage
- Monitor compliance with the means restriction plan
- Alert the counselor if the plan is not being followed</p>
<p>Family involvement also provides an opportunity to educate family members about suicide risk, warning signs, and how to respond if the client is in crisis.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Following initial crisis intervention and safety planning, the counselor must determine the appropriate level of care. Options range from continued outpatient treatment to emergency psychiatric hospitalization.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Continued Outpatient Treatment`,
              content: `<p>Appropriate when:
- Risk is low to moderate
- Client is willing and able to implement safety plan
- Means have been adequately restricted
- Adequate social support exists
- Client can contract for safety (meaningful agreement to use safety plan and contact help if needed)
- Follow-up appointment can occur soon</p>
<p>Enhance outpatient treatment by:
- Increasing session frequency
- Providing between-session contact (brief check-in calls)
- Involving family/support persons
- Ensuring 24/7 crisis access
- Coordinating with other providers</p>
`
            },
            {
              title: `Intensive Outpatient or Partial Hospitalization`,
              content: `<p>Appropriate when:
- Risk is moderate
- Client needs more structure than traditional outpatient
- Daily monitoring would be beneficial
- Client can remain safe outside of treatment hours</p>
<p>These programs provide several hours of treatment daily while allowing the client to return home. They are less restrictive than inpatient hospitalization and may be more acceptable to clients.</p>
`
            },
            {
              title: `Voluntary Psychiatric Hospitalization`,
              content: `<p>Appropriate when:
- Risk is high
- Client cannot safely remain in a less restrictive setting
- Client is willing to be hospitalized</p>
<p>Voluntary hospitalization should be collaborative when possible. Explain the rationale, address concerns, and support the client through the admission process. When hospitalization is necessary, presenting it as a collaborative decision rather than an imposition preserves therapeutic alliance.</p>
`
            },
            {
              title: `Involuntary Psychiatric Hospitalization`,
              content: `<p>When a client presents imminent danger to self (or others) and refuses voluntary hospitalization, involuntary commitment may be necessary. Commitment procedures vary by state but typically require:</p>
<p>- Presence of mental illness
- Imminent danger to self or others (or inability to care for self)
- Less restrictive alternatives have been considered or are insufficient</p>
<p>Involuntary commitment is a significant intervention that restricts client autonomy. It should be used only when clinically necessary and when less restrictive alternatives are inadequate. However, when a client is at imminent risk and refuses help, commitment may be life-saving.</p>
<p>Counselors should be familiar with commitment procedures in their jurisdiction, including who can initiate a hold, what facilities can receive committed patients, and what documentation is required.</p>
<p>When involuntary commitment is necessary:
- Be honest with the client about what is happening and why
- Acknowledge that the client may feel angry or betrayed
- Express continued caring and commitment to the client
- Document the clinical reasoning thoroughly</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Crisis intervention does not end when the immediate crisis is stabilized. Post-crisis care includes:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Debriefing the Crisis`,
              content: `<p>Once the client is stabilized, process what happened:
- What led to the crisis?
- What warning signs preceded it?
- What helped and what didn't?
- What can be learned to prevent future crises?</p>
<p>This discussion informs treatment planning and safety plan refinement.</p>
`
            },
            {
              title: `Revising the Safety Plan`,
              content: `<p>Update the safety plan based on what was learned during the crisis:
- Were warning signs identified early enough?
- Did internal coping strategies help?
- Were support people available and helpful?
- Were there means access issues that weren't previously addressed?</p>
`
            },
            {
              title: `Addressing Underlying Issues`,
              content: `<p>Crisis intervention addresses immediate safety; longer-term treatment addresses the issues that led to the crisis. Following stabilization, treatment should address:
- Mental health conditions (depression, anxiety, etc.)
- Substance use
- Relationship problems
- Practical stressors (financial, legal, housing)
- Skill deficits (emotion regulation, problem-solving)
- Cognitive patterns (hopelessness, perceived burdensomeness)</p>
`
            },
            {
              title: `Follow-Up Contact`,
              content: `<p>Research supports the value of follow-up contact after suicidal crises, particularly after emergency department visits or hospitalization. Brief caring contacts (phone calls, texts, postcards) that express concern and remind the person of available help can reduce subsequent attempts.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Beyond safety planning and means counseling, several additional strategies are valuable in suicide crisis intervention:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Cognitive Restructuring of Suicidal Cognitions`,
              content: `<p>Suicidal thoughts often reflect cognitive distortions that can be addressed through targeted cognitive interventions. Common distortions include:</p>
<p><strong>Hopelessness</strong>: "Things will never get better." Interventions target this distortion by examining evidence for and against this belief, identifying times when the client felt hopeless before and things did improve, and developing a more balanced perspective that acknowledges current pain while leaving room for change.</p>
<p><strong>Perceived burdensomeness</strong>: "Everyone would be better off without me." This cognition can be challenged by examining the evidence (what would actually happen to loved ones?), considering the difference between the client's perception and reality, and exploring what loved ones have actually said about the client's importance to them.</p>
<p><strong>Tunnel vision</strong>: The belief that suicide is the only option. Interventions expand the client's perception of available options through brainstorming alternatives, problem-solving specific stressors, and identifying resources the client hasn't considered.</p>
<p><strong>Permanence</strong>: The belief that current distress will last forever. Psychoeducation about the time-limited nature of crises, combined with examination of past crises that resolved, can address this distortion.</p>
<p>Cognitive interventions should be delivered with sensitivity to timing—clients in acute crisis may not be able to engage in complex cognitive work, but as stability returns, addressing distorted thinking becomes increasingly important.</p>
`
            },
            {
              title: `Problem-Solving Therapy Approaches`,
              content: `<p>Many suicidal crises are precipitated by problems that feel unsolvable. Problem-solving interventions can reduce hopelessness by demonstrating that problems can be addressed:</p>
<p><strong>Problem identification</strong>: Help the client clearly define the problem or problems contributing to the crisis. Vague, overwhelming distress becomes more manageable when parsed into specific, defined problems.</p>
<p><strong>Goal setting</strong>: What would a good outcome look like? Establishing clear goals focuses subsequent problem-solving.</p>
<p><strong>Brainstorming solutions</strong>: Generate multiple possible solutions without initially evaluating them. Encourage creativity and quantity over quality at this stage.</p>
<p><strong>Evaluating options</strong>: Assess the pros and cons of each potential solution. Consider feasibility, likely effectiveness, and potential consequences.</p>
<p><strong>Selecting and implementing a solution</strong>: Choose the most promising option and develop a specific implementation plan. Break the plan into manageable steps.</p>
<p><strong>Evaluating outcomes</strong>: After implementation, assess what worked and what didn't. Refine the approach as needed.</p>
<p>This structured approach to problem-solving can be taught to clients as a skill they can apply independently to future problems.</p>
`
            },
            {
              title: `Behavioral Activation`,
              content: `<p>Depression-driven inactivity can maintain and worsen suicidal states. Behavioral activation involves increasing engagement in activities that are likely to produce positive mood or a sense of accomplishment:</p>
<p><strong>Activity monitoring</strong>: Track current activities and their effects on mood to identify patterns.</p>
<p><strong>Activity scheduling</strong>: Plan activities that are likely to be rewarding or provide mastery. Start with small, achievable activities.</p>
<p><strong>Values-based activation</strong>: Connect activities to the client's values to enhance motivation. "What matters to you? How can you act on those values today?"</p>
<p><strong>Breaking avoidance patterns</strong>: Identify activities the client is avoiding and develop plans to gradually approach them.</p>
<p>Behavioral activation can be implemented even during crisis periods through small, immediate activities that shift focus and create positive experience.</p>
`
            },
            {
              title: `Distress Tolerance Skills`,
              content: `<p>Clients in crisis need skills to survive the crisis without making things worse. Dialectical Behavior Therapy (DBT) offers well-developed distress tolerance strategies:</p>
<p><strong>TIPP skills</strong>: These skills use physiological mechanisms to reduce emotional intensity quickly:
- <strong>T</strong>emperature: Cold water on the face triggers the dive reflex, slowing heart rate
- <strong>I</strong>ntense exercise: Brief, intense physical activity metabolizes stress hormones
- <strong>P</strong>aced breathing: Slow, deep breathing activates the parasympathetic nervous system
- <strong>P</strong>aired muscle relaxation: Progressive muscle relaxation reduces physical tension</p>
<p><strong>ACCEPTS skills</strong>: Strategies for distracting from crisis:
- <strong>A</strong>ctivities: Engage in activities that occupy attention
- <strong>C</strong>ontributing: Help others to shift focus from one's own distress
- <strong>C</strong>omparisons: Compare to others worse off or to one's own worse times
- <strong>E</strong>motions: Generate different emotions through media, music, etc.
- <strong>P</strong>ushing away: Mentally set the problem aside temporarily
- <strong>T</strong>houghts: Occupy the mind with neutral thoughts (counting, puzzles)
- <strong>S</strong>ensations: Use intense but safe sensations (ice, strong tastes) to shift focus</p>
<p><strong>Radical acceptance</strong>: Accepting reality as it is—not approving of it, but acknowledging it—can reduce the suffering caused by fighting against reality.</p>
<p>These skills can be taught briefly during crisis intervention and practiced more extensively in ongoing treatment.</p>
`
            },
            {
              title: `Emotion Regulation Strategies`,
              content: `<p>Beyond surviving the immediate crisis, clients benefit from developing longer-term emotion regulation capabilities:</p>
<p><strong>Identifying and labeling emotions</strong>: Many clients lack emotional vocabulary or struggle to identify what they're feeling. Building this capacity is foundational.</p>
<p><strong>Understanding emotional triggers</strong>: Identifying what situations, thoughts, or experiences trigger emotional responses allows for proactive management.</p>
<p><strong>Reducing vulnerability</strong>: Physical self-care (sleep, nutrition, exercise, avoiding substances) reduces emotional vulnerability. The DBT PLEASE skill (treating <strong>P</strong>hysical illness, balancing <strong>E</strong>ating, avoiding mood-altering substances, balancing <strong>S</strong>leep, and getting <strong>E</strong>xercise) addresses these factors.</p>
<p><strong>Building positive experiences</strong>: Intentionally building positive events into daily life creates emotional resources and reasons for living.</p>
<p><strong>Opposite action</strong>: Acting opposite to the emotion's urge when the emotion is not justified by the facts. For example, approaching rather than avoiding when the fear is not warranted.</p>
`
            },
            {
              title: `Crisis Communication and De-escalation`,
              content: `<p>When clients present in acute crisis, de-escalation techniques can reduce emotional intensity and create space for assessment and intervention:</p>
<p><strong>Remain calm</strong>: The clinician's demeanor affects the client's state. Calm, grounded presence provides containment.</p>
<p><strong>Validate emotion</strong>: Acknowledge the client's pain without validating suicide as a solution. "You're in tremendous pain right now" validates experience without endorsing harmful action.</p>
<p><strong>Keep communication simple</strong>: Clients in crisis have reduced cognitive capacity. Use simple, direct language.</p>
<p><strong>Avoid power struggles</strong>: Don't argue about whether the client should feel suicidal. Focus on understanding and helping rather than convincing.</p>
<p><strong>Slow the pace</strong>: Crises often involve a sense of urgency. Slowing down can reduce intensity.</p>
<p><strong>Offer choices</strong>: Providing choices (even small ones) supports autonomy and engagement. "Would you like to talk first about what's happening, or would you like me to help you feel calmer?"</p>
<p><strong>Focus on the present</strong>: Address what's happening now rather than comprehensive history.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `National Crisis Resources`,
              content: `<p>Counselors should be familiar with and share these resources with clients:</p>
<p><strong>988 Suicide and Crisis Lifeline</strong>: Call or text 988 for 24/7, free, and confidential support. Specialized services available for veterans (press 1), Spanish speakers (press 2), and LGBTQ+ individuals (call 988 and ask for LGBTQ+ affirming services).</p>
<p><strong>Crisis Text Line</strong>: Text HOME to 741741 to reach a trained crisis counselor via text message, available 24/7.</p>
<p><strong>Veterans Crisis Line</strong>: Veterans, active service members, and their families can call 988 (then press 1), text 838255, or chat online at veteranscrisisline.net.</p>
<p><strong>Trevor Project</strong>: LGBTQ+ young people under 25 can call 1-866-488-7386, text START to 678-678, or chat at thetrevorproject.org. Available 24/7.</p>
<p><strong>Trans Lifeline</strong>: Trans and questioning callers can reach peer support at 877-565-8860 (US) or 877-330-6366 (Canada).</p>
<p><strong>SAMHSA National Helpline</strong>: 1-800-662-4357 offers 24/7, free, confidential information and referrals for substance abuse and mental health treatment.</p>
`
            },
            {
              title: `Mobile Crisis Services`,
              content: `<p>Many communities have mobile crisis teams that can respond to mental health emergencies in the community, providing an alternative to law enforcement response. Counselors should be familiar with mobile crisis resources in their area and include them in safety planning when appropriate.</p>
`
            },
            {
              title: `Partial Hospitalization and Intensive Outpatient Programs`,
              content: `<p>For clients who need more than outpatient treatment but less than inpatient hospitalization, partial hospitalization programs (PHP) and intensive outpatient programs (IOP) provide structured treatment while allowing clients to return home. These programs often include:</p>
<p>- Daily group therapy (PHP) or multiple weekly sessions (IOP)
- Psychiatric medication management
- Skills training
- Crisis intervention protocols
- Coordination with outpatient providers</p>
<p>Knowing the available PHP/IOP programs in one's area and their admission criteria facilitates appropriate referrals.</p>
`
            },
            {
              title: `Peer Support Services`,
              content: `<p>Peer support specialists—individuals with lived experience of mental health challenges and/or suicide attempts who have been trained to support others—are increasingly recognized as valuable components of suicide care. Peer support can:</p>
<p>- Reduce stigma and normalize help-seeking
- Provide hope through shared experience
- Offer practical guidance from lived expertise
- Bridge gaps between clinical services
- Support ongoing recovery</p>
<p>Many crisis services, healthcare systems, and community organizations now include peer support, and counselors should be aware of peer support resources in their area.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "multipleChoice",
          question: `The Stanley-Brown Safety Planning Intervention consists of how many steps?`,
          options: [
              { text: `4`, isCorrect: true },
              { text: `5`, isCorrect: false },
              { text: `6`, isCorrect: false },
              { text: `8`, isCorrect: false }
          ],
          explanation: `Review the content in Module 4 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is TRUE about "no-suicide contracts"?`,
          options: [
              { text: `They have strong empirical support`, isCorrect: false },
              { text: `They have no empirical support and are not recommended`, isCorrect: true },
              { text: `They are required by most licensing boards`, isCorrect: false },
              { text: `They are equivalent to safety planning`, isCorrect: false }
          ],
          explanation: `Review the content in Module 4 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `In safety planning, Step 3 (social contacts for distraction) differs from Step 4 (people to contact for help) in that Step 3:?`,
          options: [
              { text: `Lists professional contacts only`, isCorrect: false },
              { text: `Focuses on people who can provide distraction, not necessarily crisis support`, isCorrect: false },
              { text: `Is optional`, isCorrect: true },
              { text: `Includes emergency services`, isCorrect: false }
          ],
          explanation: `Review the content in Module 4 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which method of firearm storage provides the MOST protection during a suicidal crisis?`,
          options: [
              { text: `Keeping the firearm unloaded`, isCorrect: false },
              { text: `Using a trigger lock`, isCorrect: false },
              { text: `Storing the firearm outside the home`, isCorrect: false },
              { text: `Hiding the firearm`, isCorrect: true }
          ],
          explanation: `Review the content in Module 4 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Involuntary psychiatric commitment is appropriate when:?`,
          options: [
              { text: `The client has any suicidal thoughts`, isCorrect: true },
              { text: `The client refuses outpatient treatment`, isCorrect: false },
              { text: `The client presents imminent danger and refuses voluntary hospitalization`, isCorrect: false },
              { text: `The counselor feels anxious about the case`, isCorrect: false }
          ],
          explanation: `Review the content in Module 4 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "text",
          content: `<div style="background:#FFF8E1;border-left:4px solid #D4A855;padding:16px;border-radius:4px;margin:16px 0;">
<h2>🏥 Clinical Vignette: Safety Planning</h2>
<p><strong>Returning to Marcus:</strong> Your assessment reveals active suicidal ideation with a plan (overdose on collected medications) but ambivalent intent. He identifies his children as a reason for living and agrees to work on a safety plan. He has a firearm in his home "for protection."</p>
<p><strong>Consider:</strong> Walk through each step of the Stanley-Brown Safety Plan with Marcus. How would you approach the lethal means counseling conversation, particularly regarding both the medications and the firearm? What disposition decision would you make?</p>
</div>`,
          accessibility: { role: "article" }
        },
        {
          type: "reflection",
          question: `Have you ever completed a safety plan with a client? What went well? What was challenging? How would you incorporate the Stanley-Brown model into your practice?`,
          accessibility: { role: "textbox", ariaLabel: "Reflection prompt" }
        },
        {
          type: "matching",
          matchingInstructions: `Match each step of the Stanley-Brown Safety Plan to its description.`,
          matchingPairs: [
            { term: `Step 1: Warning Signs`, definition: `Internal cues that a crisis may be developing` },
            { term: `Step 2: Internal Coping`, definition: `Things the person can do alone to distract from suicidal thoughts` },
            { term: `Step 3: Social Contacts`, definition: `People and settings that provide distraction` },
            { term: `Step 4: People to Ask for Help`, definition: `Family or friends who can provide support during crisis` },
            { term: `Step 5: Professionals`, definition: `Clinicians, crisis lines, and emergency services` },
            { term: `Step 6: Making Environment Safe`, definition: `Reducing access to lethal means` }
          ],
          accessibility: { ariaLabel: "Matching exercise", role: "application" }
        }
      ]
    },
    {
      title: `Special Populations and Cultural Considerations`,
      order: 5,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 5,
          title: `Module 5`,
          subtitle: `Special Populations and Cultural Considerations`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>While the fundamentals of suicide risk assessment and intervention apply across populations, certain groups face elevated risk and may require tailored approaches. This module examines suicide risk and considerations for assessment and intervention among adolescents, older adults, veterans and military personnel, and LGBTQ+ individuals. Cultural factors affecting suicide and its assessment are also addressed.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "imageText",
          title: `Special Populations: Elevated Risk Groups`,
          content: `<p>Suicide risk varies significantly across populations. Effective assessment requires understanding population-specific risk factors, warning signs, and protective factors. Key groups requiring specialized approaches include adolescents, older adults, veterans and military personnel, and LGBTQ+ individuals.</p>`,
          image: `/images/courses/suicide-risk/special-populations.png`,
          imageAlt: `Diagram showing special populations with elevated suicide risk and population-specific considerations`,
          imagePosition: "right",
          accessibility: { role: "figure", ariaLabel: `Diagram showing special populations with elevated suicide risk and population-specific considerations` }
        },
        {
          type: "text",
          content: `<p>Suicide is the second leading cause of death among adolescents aged 15-19, and rates have increased substantially over the past decade—particularly among females. Understanding adolescent-specific risk factors and developmental considerations is essential for effective assessment and intervention with this population.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Developmental Considerations`,
              content: `<p>Adolescence involves significant neurological, psychological, and social development that affects suicide risk. The prefrontal cortex, which governs impulse control, decision-making, and risk assessment, is not fully developed until the mid-20s. This developmental reality contributes to increased impulsivity and risk-taking behavior.</p>
<p>Adolescents are also navigating identity formation, peer relationships, romantic relationships, academic pressures, and increasing autonomy from parents. These developmental tasks create stressors that may precipitate crises. Additionally, adolescents may lack the life experience and coping skills that adults have developed, making problems feel more overwhelming and permanent.</p>
`
            },
            {
              title: `Risk Factors Specific to Adolescents`,
              content: `<p>While general risk factors apply to adolescents, some factors are particularly salient for this age group:</p>
<p><strong>Bullying</strong>: Both being bullied and engaging in bullying behavior are associated with increased suicide risk. Cyberbullying, which can be constant and inescapable, is particularly concerning.</p>
<p><strong>Relationship problems</strong>: Romantic relationship difficulties, particularly breakups, are common precipitants for adolescent suicidal crises. The intensity of adolescent romantic relationships and limited experience with relationship dissolution contribute to risk.</p>
<p><strong>Academic pressure</strong>: School failure, academic pressure, and college-related stress can be overwhelming for some adolescents, particularly those whose identity is strongly tied to academic achievement.</p>
<p><strong>Family conflict</strong>: Conflict with parents, family dysfunction, and lack of parental support elevate risk. Adolescents from families with high levels of conflict, abuse, or neglect are at elevated risk.</p>
<p><strong>Sexual orientation and gender identity</strong>: LGBTQ+ adolescents face substantially elevated risk due to minority stress, discrimination, family rejection, and bullying.</p>
<p><strong>Social media and technology</strong>: The relationship between social media and adolescent mental health is complex and still being understood. Excessive use, cyberbullying, social comparison, and exposure to suicide-related content may all contribute to risk.</p>
<p><strong>Contagion</strong>: Adolescents may be more susceptible to suicide contagion—increased suicide risk following exposure to another person's suicide. Schools should have protocols for responding to student suicides to minimize contagion risk.</p>
`
            },
            {
              title: `Assessment Considerations`,
              content: `<p>Assessing adolescents for suicide risk involves some unique considerations:</p>
<p><strong>Confidentiality and parent involvement</strong>: Balancing adolescent confidentiality with parental need-to-know is often challenging. Most states allow minors to consent to mental health treatment, but parents may have rights to information about suicidality. Clarify confidentiality expectations at the outset of treatment.</p>
<p><strong>Collateral information</strong>: Obtaining information from parents, teachers, and others who observe the adolescent can supplement the adolescent's self-report. Adolescents may underreport symptoms to adults.</p>
<p><strong>Developmentally appropriate questioning</strong>: Use language appropriate to the adolescent's developmental level. Some may understand and respond to direct questions about suicide; others may need more concrete or less clinical language.</p>
<p><strong>Technology and social media</strong>: Inquire about online behavior, cyberbullying, and social media use. Some adolescents communicate distress online that they don't share in person.</p>
<p><strong>School involvement</strong>: School counselors, teachers, and administrators may have important information and can be partners in safety planning.</p>
`
            },
            {
              title: `Intervention Considerations`,
              content: `<p><strong>Involve parents appropriately</strong>: While respecting appropriate adolescent autonomy, parents are typically essential for implementing safety plans, restricting means, and providing supervision. Involvement of supportive parents generally improves outcomes.</p>
<p><strong>Address peer relationships</strong>: Given the importance of peers in adolescent development, interventions should address peer relationships and may involve peer support.</p>
<p><strong>Consider school-based supports</strong>: Coordinate with school counselors and consider school-based interventions and accommodations.</p>
<p><strong>Address technology</strong>: Include technology in safety planning (limiting social media during crises, accessing crisis resources via phone).</p>
<p><strong>Restrict means with special attention to medications</strong>: Adolescents in households with readily accessible medications (including over-the-counter medications) are at elevated risk. Parents should secure all medications.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Older adults, particularly White males over age 75, have among the highest suicide rates of any demographic group. However, suicide in this population often receives less attention than youth suicide, and older adults may be less likely to receive adequate mental health treatment.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Risk Factors Specific to Older Adults`,
              content: `<p><strong>Physical health problems</strong>: Chronic illness, pain, functional impairment, and terminal diagnoses are strongly associated with suicide in older adults. The meaning of health problems—particularly loss of independence—is often central to suicidal thinking.</p>
<p><strong>Bereavement</strong>: Loss of spouse, family members, and friends is common in later life. Bereavement, particularly spousal bereavement, elevates suicide risk.</p>
<p><strong>Social isolation</strong>: Retirement, loss of relationships, mobility limitations, and other factors can lead to profound isolation. Older adults living alone are at elevated risk.</p>
<p><strong>Loss of independence</strong>: Many older adults highly value independence, and threats to independence (needing help with daily activities, moving to assisted living, being unable to drive) can be devastating.</p>
<p><strong>Depression</strong>: Depression is common but often underrecognized in older adults. Older adults may present with somatic complaints rather than mood symptoms and may be less likely to endorse sadness.</p>
<p><strong>Cognitive impairment</strong>: Early-stage dementia, when insight is preserved, is associated with elevated suicide risk. The fear of progressive cognitive decline may drive suicidal ideation.</p>
<p><strong>Access to firearms</strong>: Older adults, particularly older men, have high rates of gun ownership. Firearms are the most common method of suicide in this population.</p>
`
            },
            {
              title: `Assessment Considerations`,
              content: `<p><strong>Screen routinely</strong>: Depression and suicide risk are often underassessed in older adults. Routine screening in primary care and other settings can identify individuals who need further assessment.</p>
<p><strong>Consider medical context</strong>: Suicidal ideation in older adults often occurs in the context of medical illness. Assessment should explore the meaning of health conditions and their impact on quality of life.</p>
<p><strong>Assess for depression carefully</strong>: Depression in older adults may present differently than in younger adults. Irritability, somatic complaints, and cognitive symptoms may be more prominent than sadness.</p>
<p><strong>Don't attribute symptoms to "normal aging"</strong>: While loss and physical changes are common in later life, severe distress and suicidal ideation are not normal parts of aging and warrant intervention.</p>
<p><strong>Involve family with consent</strong>: Family members may have information about changes in the older adult's functioning, mood, or behavior.</p>
`
            },
            {
              title: `Intervention Considerations`,
              content: `<p><strong>Address underlying conditions</strong>: Treatment of depression and management of chronic pain and medical conditions can reduce suicide risk.</p>
<p><strong>Address isolation</strong>: Interventions to increase social connection—senior centers, religious involvement, volunteer activities, family visits—can address the isolation that contributes to risk.</p>
<p><strong>Firearms counseling is essential</strong>: Given the high rates of gun ownership and high lethality of firearms, means counseling with older adults must prioritize firearm access.</p>
<p><strong>Involve appropriate supports</strong>: Depending on the older adult's circumstances, adult children, caregivers, physicians, and others may be important partners in safety planning.</p>
<p><strong>Consider life review and meaning-making</strong>: For older adults facing end-of-life issues, interventions that facilitate life review, meaning-making, and legacy can be valuable.</p>
<p><strong>Address loss and grief</strong>: Grief interventions for those experiencing bereavement can address a significant contributor to risk in this population.</p>
<p><strong>Coordinate with medical providers</strong>: Given the strong association between physical health and suicide in older adults, coordination with primary care and specialty medical providers is often important.</p>
`
            },
            {
              title: `The Role of Primary Care`,
              content: `<p>Many older adults are more likely to see their primary care physician than a mental health provider. In fact, research shows that a majority of older adults who die by suicide saw a primary care physician in the month before their death. This makes primary care a critical setting for suicide prevention with older adults.</p>
<p>Counselors working with older adults should consider:
- Coordinating care with the client's primary care provider
- Encouraging the client to discuss mood and suicidal thoughts with their physician
- Communicating concerns to medical providers with appropriate consent
- Supporting integrated care models that embed mental health services in primary care settings</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Veterans and military personnel have elevated suicide rates compared to the general population. In 2020, the veteran suicide rate was 31.7 per 100,000—substantially higher than the civilian rate. Understanding military culture and veteran-specific risk factors is essential for effective care with this population.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Understanding Military Culture`,
              content: `<p>Effective work with veterans requires understanding military culture—the values, norms, and experiences that shape how service members and veterans view themselves and the world:</p>
<p><strong>Mission focus</strong>: Military training emphasizes mission accomplishment above individual needs. This orientation can make it difficult for veterans to prioritize their own mental health.</p>
<p><strong>Unit cohesion</strong>: Military units develop intense bonds forged through shared hardship and mutual dependence. The loss of this cohesion upon separation can be profound.</p>
<p><strong>Self-reliance</strong>: Military culture values self-sufficiency and the ability to function under extreme conditions. Seeking help for emotional difficulties may be seen as weakness.</p>
<p><strong>Identity</strong>: Military service often becomes a core part of identity. Loss of this identity upon separation or discharge can be disorienting.</p>
<p><strong>Hierarchy and structure</strong>: Military life is highly structured. The transition to less structured civilian life can be challenging.</p>
<p><strong>Sacrifice</strong>: Military culture honors sacrifice, which can complicate help-seeking if asking for help is seen as putting oneself first.</p>
<p><strong>Communication style</strong>: Veterans may communicate in direct, even blunt ways that differ from typical civilian therapeutic discourse.</p>
<p>Understanding these cultural elements helps counselors build rapport, communicate effectively, and understand the client's worldview without requiring the client to translate military experience into civilian terms.</p>
`
            },
            {
              title: `Risk Factors Specific to Veterans and Military Personnel`,
              content: `<p><strong>Combat exposure</strong>: Combat exposure, particularly exposure to traumatic events such as witnessing death or engaging in killing, is associated with increased suicide risk.</p>
<p><strong>Traumatic brain injury (TBI)</strong>: TBI is common among veterans and is associated with increased suicide risk, potentially through effects on impulse control, emotional regulation, and cognition.</p>
<p><strong>PTSD and moral injury</strong>: PTSD is prevalent among combat veterans and is strongly associated with suicide risk. Moral injury—the psychological impact of participating in or witnessing events that violate one's moral beliefs—may contribute to risk independent of PTSD.</p>
<p><strong>Transition challenges</strong>: The transition from military to civilian life is often difficult. Loss of identity, purpose, and community; employment difficulties; and difficulty connecting with civilians can contribute to risk.</p>
<p><strong>Access to firearms</strong>: Veterans have high rates of firearm ownership and training in firearm use. Firearms are the most common method of veteran suicide.</p>
<p><strong>Culture of self-reliance</strong>: Military culture emphasizes self-reliance, toughness, and mission focus. These values, while adaptive in military contexts, may interfere with help-seeking for mental health problems.</p>
<p><strong>Barriers to care</strong>: Stigma, concerns about career impact, limited access to services (particularly in rural areas), and distrust of VA care can all impede treatment engagement.</p>
<p><strong>Military sexual trauma (MST)</strong>: Sexual assault and harassment during military service affect both men and women and are associated with increased mental health symptoms and suicide risk.</p>
<p><strong>Survivor guilt</strong>: Survivors of combat or other military situations where comrades died may experience survivor guilt that contributes to suicidal thinking.</p>
<p><strong>Chronic pain and disability</strong>: Physical injuries sustained during service, including service-connected disabilities, can contribute to chronic pain and functional impairment that elevate suicide risk.</p>
`
            },
            {
              title: `Assessment Considerations`,
              content: `<p><strong>Ask about military history</strong>: Routine inquiry about military service identifies veterans and allows exploration of military experiences.</p>
<p><strong>Use culturally appropriate language</strong>: Understanding military terminology and culture improves rapport. Veterans may distrust clinicians perceived as not understanding their experiences.</p>
<p><strong>Screen for PTSD and TBI</strong>: Given the prevalence of these conditions among veterans, routine screening is warranted.</p>
<p><strong>Explore transition experiences</strong>: For recently separated veterans, assess how the transition is going and what challenges they face.</p>
<p><strong>Assess firearms thoroughly</strong>: Given high rates of ownership and lethality, firearms assessment and means counseling are particularly important with veterans.</p>
<p><strong>Ask about moral injury</strong>: Beyond PTSD symptoms, inquire about events that violated the veteran's moral beliefs and their psychological impact.</p>
<p><strong>Assess for MST</strong>: Screen for military sexual trauma, which may not be disclosed without direct inquiry.</p>
`
            },
            {
              title: `Intervention Considerations`,
              content: `<p><strong>Address barriers to care</strong>: Acknowledge and address barriers to help-seeking. Normalize mental health treatment and reduce stigma.</p>
<p><strong>Connect with veteran-specific resources</strong>: The VA offers specialized suicide prevention services, including a Veterans Crisis Line (988, then press 1). Community-based organizations also serve veterans.</p>
<p><strong>Engage peer support</strong>: Veteran peer support specialists understand military culture and may be more accepted than traditional mental health providers by some veterans.</p>
<p><strong>Involve family</strong>: Family members can be important partners in safety planning and can alert providers to warning signs.</p>
<p><strong>Address firearms directly</strong>: Means counseling is essential with veterans. Acknowledge their relationship with firearms while clearly communicating the importance of secure storage during periods of risk.</p>
<p><strong>Address transition issues</strong>: For veterans struggling with transition, interventions may need to address employment, education, housing, and identity issues alongside mental health.</p>
<p><strong>Consider PTSD-specific treatments</strong>: Evidence-based PTSD treatments (CPT, PE, EMDR) can address underlying trauma that contributes to suicide risk.</p>
<p><strong>Provide meaning-making opportunities</strong>: Veterans may benefit from opportunities to find meaning in their service and translate military values into civilian contexts.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Veterans and military personnel have elevated suicide rates compared to the general population. In 2020, the veteran suicide rate was 31.7 per 100,000—substantially higher than the civilian rate. Understanding military culture and veteran-specific risk factors is essential for effective care with this population.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Risk Factors Specific to Veterans and Military Personnel`,
              content: `<p><strong>Combat exposure</strong>: Combat exposure, particularly exposure to traumatic events such as witnessing death or engaging in killing, is associated with increased suicide risk.</p>
<p><strong>Traumatic brain injury (TBI)</strong>: TBI is common among veterans and is associated with increased suicide risk, potentially through effects on impulse control, emotional regulation, and cognition.</p>
<p><strong>PTSD and moral injury</strong>: PTSD is prevalent among combat veterans and is strongly associated with suicide risk. Moral injury—the psychological impact of participating in or witnessing events that violate one's moral beliefs—may contribute to risk independent of PTSD.</p>
<p><strong>Transition challenges</strong>: The transition from military to civilian life is often difficult. Loss of identity, purpose, and community; employment difficulties; and difficulty connecting with civilians can contribute to risk.</p>
<p><strong>Access to firearms</strong>: Veterans have high rates of firearm ownership and training in firearm use. Firearms are the most common method of veteran suicide.</p>
<p><strong>Culture of self-reliance</strong>: Military culture emphasizes self-reliance, toughness, and mission focus. These values, while adaptive in military contexts, may interfere with help-seeking for mental health problems.</p>
<p><strong>Barriers to care</strong>: Stigma, concerns about career impact, limited access to services (particularly in rural areas), and distrust of VA care can all impede treatment engagement.</p>
`
            },
            {
              title: `Assessment Considerations`,
              content: `<p><strong>Ask about military history</strong>: Routine inquiry about military service identifies veterans and allows exploration of military experiences.</p>
<p><strong>Use culturally appropriate language</strong>: Understanding military terminology and culture improves rapport. Veterans may distrust clinicians perceived as not understanding their experiences.</p>
<p><strong>Screen for PTSD and TBI</strong>: Given the prevalence of these conditions among veterans, routine screening is warranted.</p>
<p><strong>Explore transition experiences</strong>: For recently separated veterans, assess how the transition is going and what challenges they face.</p>
<p><strong>Assess firearms thoroughly</strong>: Given high rates of ownership and lethality, firearms assessment and means counseling are particularly important with veterans.</p>
`
            },
            {
              title: `Intervention Considerations`,
              content: `<p><strong>Address barriers to care</strong>: Acknowledge and address barriers to help-seeking. Normalize mental health treatment and reduce stigma.</p>
<p><strong>Connect with veteran-specific resources</strong>: The VA offers specialized suicide prevention services, including a Veterans Crisis Line (988, then press 1). Community-based organizations also serve veterans.</p>
<p><strong>Engage peer support</strong>: Veteran peer support specialists understand military culture and may be more accepted than traditional mental health providers by some veterans.</p>
<p><strong>Involve family</strong>: Family members can be important partners in safety planning and can alert providers to warning signs.</p>
<p><strong>Address firearms directly</strong>: Means counseling is essential with veterans. Acknowledge their relationship with firearms while clearly communicating the importance of secure storage during periods of risk.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Lesbian, gay, bisexual, transgender, queer, and other sexual and gender minority (LGBTQ+) individuals face substantially elevated suicide risk compared to heterosexual and cisgender individuals. Studies have found that LGB individuals are approximately 2-3 times more likely to attempt suicide, and transgender individuals may be at even greater risk—some studies find lifetime attempt rates of 40% or higher.</p>
<p>This elevated risk is not due to anything inherent in being LGBTQ+ but reflects the impact of minority stress, discrimination, family rejection, and other external factors. When these factors are reduced—for example, when LGBTQ+ youth have family support—suicide risk decreases substantially.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Risk Factors Specific to LGBTQ+ Individuals`,
              content: `<p><strong>Minority stress</strong>: LGBTQ+ individuals face chronic stress related to stigma, prejudice, and discrimination. This minority stress contributes to elevated rates of depression, anxiety, and suicide.</p>
<p><strong>Family rejection</strong>: Family rejection of sexual orientation or gender identity is strongly associated with suicide risk. LGBTQ+ youth who experience high levels of family rejection are 8 times more likely to attempt suicide than those with family acceptance.</p>
<p><strong>Bullying and victimization</strong>: LGBTQ+ youth are more likely to experience bullying, harassment, and violence, all of which elevate suicide risk.</p>
<p><strong>Discrimination</strong>: Discrimination in employment, housing, healthcare, and other domains contributes to stress and limits access to resources.</p>
<p><strong>Lack of affirming care</strong>: LGBTQ+ individuals may encounter mental health providers who are uninformed about their needs, hold negative attitudes, or engage in harmful practices like conversion therapy.</p>
<p><strong>Internalized stigma</strong>: Internalization of societal negative attitudes toward LGBTQ+ identities (internalized homophobia/transphobia) is associated with increased psychological distress and suicide risk.</p>
<p><strong>Access to gender-affirming care</strong>: For transgender individuals, barriers to accessing gender-affirming medical care are associated with increased distress and suicide risk. Access to such care reduces risk.</p>
`
            },
            {
              title: `Assessment Considerations`,
              content: `<p><strong>Create a safe, affirming environment</strong>: Use inclusive language, display visible symbols of LGBTQ+ affirmation, and avoid assumptions about sexual orientation or gender identity.</p>
<p><strong>Ask about sexual orientation and gender identity</strong>: Routine, respectful inquiry normalizes diversity and allows identification of LGBTQ+ clients.</p>
<p><strong>Assess minority stress experiences</strong>: Inquire about discrimination, family acceptance, victimization, and other minority stress experiences.</p>
<p><strong>Assess support systems</strong>: Do the client's support systems know about and affirm their LGBTQ+ identity? Is the client connected to LGBTQ+ community?</p>
<p><strong>For transgender clients, assess access to gender-affirming care</strong>: Barriers to care may be significant stressors.</p>
`
            },
            {
              title: `Intervention Considerations`,
              content: `<p><strong>Provide affirming care</strong>: Demonstrating acceptance and affirmation is itself therapeutic for clients who have experienced rejection.</p>
<p><strong>Connect with LGBTQ+ resources</strong>: LGBTQ+ community centers, support groups, and organizations can provide connection and resources.</p>
<p><strong>Address family dynamics</strong>: When appropriate, work with families to increase acceptance. Family Acceptance Project research has identified specific family behaviors that reduce risk.</p>
<p><strong>Advocate</strong>: LGBTQ+ clients may need advocacy for access to appropriate care, including gender-affirming medical care for transgender clients.</p>
<p><strong>Know the Trevor Project</strong>: The Trevor Project provides crisis support specifically for LGBTQ+ young people (1-866-488-7386; text START to 678-678).</p>
`
            },
            {
              title: `Working with LGBTQ+ Youth and Families`,
              content: `<p>Family support is one of the strongest protective factors for LGBTQ+ youth, and family rejection is one of the strongest risk factors. Counselors working with LGBTQ+ youth should consider:</p>
<p><strong>Family psychoeducation</strong>: Helping families understand the link between acceptance and suicide risk can motivate behavior change. The Family Acceptance Project has identified specific family behaviors that increase or decrease risk.</p>
<p><strong>Individual work with family members</strong>: Sometimes separate sessions with family members can address their concerns, beliefs, or fears about their child's identity without subjecting the youth to potentially harmful conversations.</p>
<p><strong>Gradual approach to full acceptance</strong>: While full family acceptance is the goal, any movement toward acceptance is beneficial. Small steps—using the correct name, reducing negative comments—can reduce risk even when full acceptance has not yet occurred.</p>
<p><strong>Alternative support when families cannot provide acceptance</strong>: When families are unable or unwilling to provide acceptance, connecting youth with chosen family, supportive adults, and LGBTQ+ community can partially compensate for family rejection.</p>
<p><strong>Assessment of safety in the home</strong>: For LGBTQ+ youth, assess whether the home environment is safe. Family rejection can escalate to abuse, and some youth may face homelessness if their identity becomes known.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Culture influences the experience and expression of psychological distress, attitudes toward suicide and help-seeking, and the effectiveness of interventions. Culturally responsive suicide care attends to these factors.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Cultural Variation in Suicide`,
              content: `<p>Suicide rates, methods, and precipitants vary across cultural groups. Meanings attached to suicide also vary—suicide may be seen as sinful, as honorable, as weakness, as a response to shame, or in other culturally-shaped ways. Beliefs about mental illness, appropriate help-seeking, and the role of family similarly vary.</p>
`
            },
            {
              title: `Culturally Responsive Assessment`,
              content: `<p>- Don't assume: Cultural identities are complex and individual. Don't assume you know how a client's culture affects their experience.
- Ask about cultural context: Inquire about the role of culture, religion, family, and community in the client's life.
- Use culturally appropriate language: Avoid clinical jargon that may not translate across cultural contexts.
- Consider cultural idioms of distress: Psychological distress may be expressed differently across cultures. Somatic complaints, spiritual explanations, and specific cultural syndromes may be relevant.
- Assess cultural factors in help-seeking: What barriers might this client's cultural context create for mental health treatment?</p>
`
            },
            {
              title: `Culturally Responsive Intervention`,
              content: `<p>- Incorporate cultural strengths: Religion, family, community, and cultural practices may be sources of resilience and reasons for living.
- Address cultural barriers: Work to overcome cultural stigma or other barriers to engaging in treatment.
- Involve culturally appropriate supports: Family, religious leaders, or community members may be important resources depending on the client's cultural context.
- Consider interpreter needs: If working through an interpreter, ensure the interpreter understands suicide-related concepts and confidentiality requirements.
- Seek consultation: When working with clients from unfamiliar cultural backgrounds, seek consultation from colleagues or consultants with relevant expertise.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is a risk factor particularly salient for adolescent suicide?`,
          options: [
              { text: `Retirement`, isCorrect: true },
              { text: `Cyberbullying`, isCorrect: false },
              { text: `Combat exposure`, isCorrect: false },
              { text: `Loss of spouse`, isCorrect: false }
          ],
          explanation: `Review the content in Module 5 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `For LGBTQ+ youth, family rejection is associated with what increase in suicide attempt risk?`,
          options: [
              { text: `2 times more likely`, isCorrect: false },
              { text: `4 times more likely`, isCorrect: true },
              { text: `8 times more likely`, isCorrect: false },
              { text: `10 times more likely`, isCorrect: false }
          ],
          explanation: `Review the content in Module 5 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `What is the most common method of suicide among older adult men?`,
          options: [
              { text: `Poisoning`, isCorrect: false },
              { text: `Suffocation`, isCorrect: false },
              { text: `Firearms`, isCorrect: true },
              { text: `Drowning`, isCorrect: false }
          ],
          explanation: `Review the content in Module 5 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The elevated suicide rate among LGBTQ+ individuals is primarily attributed to:?`,
          options: [
              { text: `Inherent characteristics of being LGBTQ+`, isCorrect: false },
              { text: `Genetic factors`, isCorrect: false },
              { text: `Minority stress, discrimination, and family rejection`, isCorrect: false },
              { text: `Higher rates of substance use`, isCorrect: true }
          ],
          explanation: `Review the content in Module 5 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `"Moral injury" as a suicide risk factor for veterans refers to:?`,
          options: [
              { text: `Physical wounds sustained in combat`, isCorrect: true },
              { text: `Traumatic brain injury`, isCorrect: false },
              { text: `Psychological impact of witnessing or participating in events that violate moral beliefs`, isCorrect: false },
              { text: `Moral objections to military service`, isCorrect: false }
          ],
          explanation: `Review the content in Module 5 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        }
      ]
    },
    {
      title: `Ethical and Legal Considerations`,
      order: 6,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 6,
          title: `Module 6`,
          subtitle: `Ethical and Legal Considerations`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Suicide care involves complex ethical and legal considerations that counselors must navigate carefully. This module examines confidentiality and its limits in suicidal contexts, duty to protect obligations, documentation requirements, considerations surrounding involuntary hospitalization, and other ethical-legal issues.</p>
<p>These issues are not merely legal technicalities but go to the heart of the therapeutic relationship. How counselors handle confidentiality, communicate about risk, and make decisions about hospitalization affects not only legal liability but therapeutic alliance and treatment outcomes.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Confidentiality is foundational to the counseling relationship, but suicide risk presents situations where confidentiality must be breached to protect the client's life.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Establishing Expectations`,
              content: `<p>From the outset of treatment, counselors should inform clients about the limits of confidentiality, including circumstances involving danger to self. This information, typically conveyed during informed consent, ensures clients understand that:</p>
<p>- The counselor takes their safety seriously
- Confidentiality may be breached if the counselor believes the client is at imminent risk
- The counselor will make every effort to handle such situations collaboratively</p>
<p>Clear communication about confidentiality limits does not appear to deter disclosure of suicidal thoughts; rather, it establishes expectations that can guide subsequent interactions.</p>
`
            },
            {
              title: `When to Breach Confidentiality`,
              content: `<p>The decision to breach confidentiality for suicide risk should be based on clinical assessment of imminent risk, not simply the presence of any suicidal ideation. Clients with low-risk suicidal ideation do not automatically require breach of confidentiality. Factors supporting breach include:</p>
<p>- High imminent risk (active ideation with plan, intent, and access to means)
- Client is unable or unwilling to collaborate on safety
- The breach is necessary to implement life-saving interventions (e.g., hospitalization, involving family)</p>
<p>Even when breach is necessary, counselors should:</p>
<p>- Breach confidentiality only to the extent necessary for safety
- Inform the client about what will be disclosed to whom (when possible)
- Maintain confidentiality about information not relevant to safety</p>
`
            },
            {
              title: `Involving Family and Support Persons`,
              content: `<p>Involving family members or other support persons in suicide care often enhances safety. However, this involvement requires navigating confidentiality. Options include:</p>
<p><strong>Client consent</strong>: When possible, obtain client consent for involving support persons. Framing this as collaboration on safety ("I'd like to involve your spouse in safety planning—can we discuss what you're comfortable sharing?") often succeeds.</p>
<p><strong>Limited disclosure without consent</strong>: If the client refuses consent but the counselor determines that involvement is necessary for safety, the counselor may disclose information necessary for safety without consent. This should be limited to what is necessary and should be communicated to the client.</p>
<p><strong>HIPAA considerations</strong>: HIPAA permits disclosure without authorization when necessary to prevent or lessen a serious and imminent threat to the health or safety of a person. This exception supports involving family in safety planning when clinically necessary.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Beyond the ethical obligation to protect suicidal clients, counselors may have legal duties that could result in liability if breached. Understanding these duties helps counselors practice within legal standards.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Duty to Assess`,
              content: `<p>Counselors have a duty to assess suicide risk when circumstances warrant. This includes:</p>
<p>- Conducting appropriate assessment when risk factors or warning signs are present
- Using appropriate assessment methods (clinical interview, validated instruments)
- Reassessing when circumstances change</p>
<p>Failure to assess suicide risk when it should have been assessed could result in liability if the client is subsequently harmed.</p>
`
            },
            {
              title: `Duty to Treat`,
              content: `<p>Having identified suicide risk, counselors have a duty to provide appropriate treatment or referral. This includes:</p>
<p>- Implementing appropriate interventions based on the level of risk
- Providing evidence-based treatment for underlying conditions
- Making appropriate referrals when needed
- Following up on referrals</p>
`
            },
            {
              title: `Duty to Protect the Client`,
              content: `<p>Counselors have a duty to take reasonable steps to protect suicidal clients from self-harm. What constitutes "reasonable steps" depends on the level of risk and clinical circumstances, but may include:</p>
<p>- Safety planning
- Means restriction
- Increased monitoring
- Involving support persons
- Hospitalization (voluntary or involuntary)</p>
<p>The standard is not perfection—suicide cannot always be prevented—but reasonable care based on the information available.</p>
`
            },
            {
              title: `Documentation as Risk Management`,
              content: `<p>Thorough documentation demonstrates that the counselor fulfilled professional duties. Documentation of suicide care should include:</p>
<p>- Risk assessments conducted and findings
- Clinical reasoning about risk level
- Interventions implemented and rationale
- Client response to interventions
- Follow-up plans
- Consultations obtained</p>
<p>If care is later questioned, documentation provides evidence of appropriate professional conduct. Absence of documentation may be interpreted as absence of appropriate care.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>When clients present imminent danger to themselves and refuse voluntary hospitalization, counselors may need to initiate involuntary commitment. This intervention involves depriving the client of liberty and should not be undertaken lightly.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Legal Standards`,
              content: `<p>Involuntary commitment criteria vary by state but typically require:</p>
<p>- Presence of mental illness (or, in some states, substance use disorder)
- Danger to self (or others) as a result of that mental illness
- Imminence of danger
- Consideration of less restrictive alternatives</p>
<p>Counselors should be familiar with the specific criteria and procedures in their jurisdiction, including who can initiate a hold, where the person can be taken, and what documentation is required.</p>
`
            },
            {
              title: `Clinical Considerations`,
              content: `<p>Beyond legal requirements, clinical considerations include:</p>
<p><strong>Is the risk truly imminent?</strong> Involuntary hospitalization is appropriate for imminent risk, not for chronic risk or low-level ideation that can be managed in outpatient settings.</p>
<p><strong>Have less restrictive alternatives been considered?</strong> Commitment should be a last resort when other interventions are insufficient.</p>
<p><strong>What is the likely impact on the therapeutic relationship?</strong> Involuntary hospitalization often damages the therapeutic relationship, at least temporarily. This cost must be weighed against safety benefits.</p>
<p><strong>What is the likely impact of hospitalization itself?</strong> Hospitalization is not always helpful and can sometimes be harmful. Consider whether hospitalization is likely to benefit this particular client.</p>
`
            },
            {
              title: `If Involuntary Commitment Is Necessary`,
              content: `<p>- Be honest with the client about what is happening and why
- Acknowledge the client's feelings (anger, betrayal)
- Express continued caring and commitment
- Ensure physical safety during the process
- Document thoroughly</p>
`
            },
            {
              title: `After Hospitalization`,
              content: `<p>Plan for continued care following hospitalization:</p>
<p>- Obtain release of information to communicate with hospital
- Arrange follow-up appointment shortly after discharge
- Address any rupture in the therapeutic relationship
- Update safety plan
- Debrief the hospitalization experience with the client</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Suicide cases are among the most common sources of malpractice claims against mental health professionals. Understanding liability risk helps counselors practice appropriately.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Elements of Malpractice`,
              content: `<p>To prevail in a malpractice claim, the plaintiff must prove:</p>
<p>1. <strong>Duty</strong>: The counselor owed a duty of care to the client (established by the therapeutic relationship)
2. <strong>Breach</strong>: The counselor breached that duty by failing to meet the standard of care
3. <strong>Causation</strong>: The breach caused the harm
4. <strong>Damages</strong>: The client suffered damages (injury, death)</p>
`
            },
            {
              title: `Meeting the Standard of Care`,
              content: `<p>The standard of care is what a reasonably prudent counselor with similar training and experience would do in similar circumstances. To meet this standard:</p>
<p>- Conduct appropriate assessments
- Implement appropriate interventions
- Document thoroughly
- Seek consultation when needed
- Stay current with professional knowledge</p>
`
            },
            {
              title: `Reducing Liability Risk`,
              content: `<p>While liability risk cannot be eliminated when working with suicidal clients, it can be reduced through:</p>
<p>- Appropriate training in suicide risk assessment and intervention
- Thorough documentation of assessments, reasoning, and interventions
- Consultation with colleagues, supervisors, or experts on difficult cases
- Adherence to professional standards and guidelines
- Carrying adequate malpractice insurance</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Beyond legal requirements, counselors face ethical dilemmas that require careful navigation:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Autonomy vs. Safety`,
              content: `<p>The principle of client autonomy—respecting the client's right to make decisions about their own life—can conflict with the duty to protect when clients are suicidal. This tension raises profound questions: Do we have the right to prevent competent adults from ending their own lives? When does protection become paternalism?</p>
<p>In practice, most counselors resolve this tension by recognizing that:</p>
<p>- Most suicidal states are associated with mental disorders that impair judgment
- Suicidal crises are usually time-limited, and most people who survive are glad they did
- Ambivalence is common; many suicidal individuals want help even as they consider ending their lives
- Our role is to help clients survive crises so they can make decisions with clearer minds</p>
<p>However, this resolution is not always comfortable, and counselors should be prepared to grapple with these philosophical questions.</p>
`
            },
            {
              title: `Balancing Confidentiality and Safety`,
              content: `<p>As discussed above, suicide care often requires breaching confidentiality to protect the client's life. This breach involves trade-offs:</p>
<p><strong>Cost of breaching</strong>: Damage to therapeutic relationship; potential reluctance to disclose in the future; violation of client privacy</p>
<p><strong>Cost of not breaching</strong>: Potential death; failure to mobilize resources that could help</p>
<p>Ethical practice involves weighing these costs thoughtfully, breaching only when necessary, and handling breaches in ways that preserve as much of the therapeutic relationship as possible.</p>
`
            },
            {
              title: `Resource Allocation`,
              content: `<p>Counselors may face situations where resources for suicidal clients are limited—hospital beds unavailable, crisis services overwhelmed, insurance denying needed care. These situations raise questions about how to provide adequate care within systemic constraints and when to advocate for systemic change.</p>
`
            },
            {
              title: `Cultural and Religious Considerations`,
              content: `<p>Different cultures and religions hold different views about suicide. Some religious traditions consider suicide sinful; others may view it differently. Counselors must navigate these differences while maintaining both cultural responsiveness and commitment to preserving life.</p>
`
            },
            {
              title: `Assisted Suicide and End-of-Life Issues`,
              content: `<p>The legalization of medical aid in dying (MAID) in some jurisdictions complicates suicide care ethics. Counselors may encounter clients with terminal illnesses who are considering MAID, which is legally and ethically distinct from suicide associated with mental illness but may involve overlapping psychological dynamics. Understanding the legal landscape in one's jurisdiction and one's own ethical position on these issues is important.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Thorough documentation is both a clinical necessity and a legal safeguard. Best practices for documenting suicide care include:</p>
<h2>Content of Documentation</h2>
<p>Documentation of suicide risk assessment should include:</p>
<p>- <strong>Date and time</strong> of assessment
- <strong>Source of information</strong> (client self-report, collateral contacts, records review)
- <strong>Reason for assessment</strong> (routine screening, crisis presentation, change in status)
- <strong>Suicide ideation details</strong> (presence, frequency, intensity, duration, content, active vs. passive)
- <strong>Plan</strong> (presence, specificity, lethality, access to means)
- <strong>Intent</strong> (stated intent, subjective probability of acting)
- <strong>Previous attempts</strong> (number, methods, lethality, circumstances)
- <strong>Risk factors present</strong> (enumerate specific factors identified)
- <strong>Protective factors present</strong> (enumerate specific factors identified)
- <strong>Mental status findings</strong> (relevant observations)
- <strong>Clinical reasoning</strong> (how information was synthesized, why particular risk level was determined)
- <strong>Risk level determination</strong> (low/moderate/high with rationale)
- <strong>Interventions implemented</strong> (safety plan, means counseling, treatment changes, hospitalization considerations)
- <strong>Client response</strong> to interventions
- <strong>Follow-up plan</strong> (next appointment, crisis resources, who to contact)
- <strong>Consultations obtained</strong> (who, when, advice given)</p>
<h2>Documentation Principles</h2>
<p><strong>Document in real time</strong>: Complete documentation as soon as possible after the session, while details are fresh.</p>
<p><strong>Be specific</strong>: "Client denied suicidal ideation" is less useful than "Client denied current thoughts of suicide or self-harm; no passive or active ideation; no plan; stated 'I want to live.'"</p>
<p><strong>Document clinical reasoning</strong>: Records should reflect not just what was done but why. "Given moderate risk (active ideation with plan but denial of intent, presence of protective factors including reasons for living and supportive family), decision made to continue outpatient treatment with enhanced safety planning and increased session frequency."</p>
<p><strong>Document what was considered</strong>: If hospitalization was considered but not implemented, document why. This demonstrates thoughtful decision-making.</p>
<p><strong>Avoid hindsight documentation</strong>: Do not alter records after adverse events. Document what was known and decided at the time.</p>
<p><strong>Document consultations</strong>: Record who you consulted, when, the information shared, and the advice received.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Consultation is both an ethical safeguard and a clinical resource. Seeking consultation demonstrates appropriate professional conduct and often improves clinical decision-making.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `When to Seek Consultation`,
              content: `<p>Consider consultation when:</p>
<p>- Risk level is uncertain
- Case is complex or unusual
- You are considering hospitalization
- Client refuses recommended interventions
- You have personal reactions (anxiety, distress) that may affect judgment
- A client has died by suicide</p>
`
            },
            {
              title: `Consultation Resources`,
              content: `<p>- Clinical supervisors
- Peer consultants
- Psychiatrists and other prescribers
- Ethics committees
- Professional liability insurance consultation lines
- Professional association ethics hotlines</p>
`
            },
            {
              title: `Documenting Consultation`,
              content: `<p>Record the consultation including:
- Who you consulted and when
- What information you shared
- What advice you received
- How the consultation informed your clinical decisions</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "multipleChoice",
          question: `The standard for breaching confidentiality in suicidal situations is typically:?`,
          options: [
              { text: `Any mention of suicidal thoughts`, isCorrect: true },
              { text: `Imminent risk to the client's life`, isCorrect: false },
              { text: `Client request for confidentiality breach`, isCorrect: false },
              { text: `Family request for information`, isCorrect: false }
          ],
          explanation: `Review the content in Module 6 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `HIPAA permits disclosure of protected health information without authorization when:?`,
          options: [
              { text: `The information is about mental health conditions`, isCorrect: false },
              { text: `Necessary to prevent or lessen a serious and imminent threat`, isCorrect: true },
              { text: `The client is under 18`, isCorrect: false },
              { text: `The disclosure is to an insurance company`, isCorrect: false }
          ],
          explanation: `Review the content in Module 6 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `To establish malpractice, a plaintiff must prove all of the following EXCEPT:?`,
          options: [
              { text: `The counselor owed a duty of care`, isCorrect: false },
              { text: `The counselor breached that duty`, isCorrect: false },
              { text: `The counselor intended to harm the client`, isCorrect: true },
              { text: `The breach caused the client's damages`, isCorrect: false }
          ],
          explanation: `Review the content in Module 6 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following BEST reduces professional liability risk when working with suicidal clients?`,
          options: [
              { text: `Avoiding suicidal clients entirely`, isCorrect: false },
              { text: `Making clients sign no-suicide contracts`, isCorrect: false },
              { text: `Thorough documentation of assessments, reasoning, and interventions`, isCorrect: false },
              { text: `Hospitalizing all clients who mention suicide`, isCorrect: true }
          ],
          explanation: `Review the content in Module 6 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "text",
          content: `<div style="background:#FFF8E1;border-left:4px solid #D4A855;padding:16px;border-radius:4px;margin:16px 0;">
<h2>🏥 Clinical Vignette: Ethical Dilemma</h2>
<p><strong>A 17-year-old client, Jaylen, discloses suicidal ideation during session.</strong> He begs you not to tell his parents, stating "they'll just make everything worse — my dad will say I'm weak and my mom will cry for weeks." You assess him at moderate risk. His parents are in the waiting room.</p>
<p><strong>Consider:</strong> How do you balance Jaylen's request for confidentiality with your duty to protect? What are your legal obligations regarding parental notification for a minor? How would you approach this conversation with both Jaylen and his parents?</p>
</div>`,
          accessibility: { role: "article" }
        },
        {
          type: "multipleChoice",
          question: `When involuntary commitment is necessary, the counselor should:?`,
          options: [
              { text: `Avoid telling the client what is happening`, isCorrect: true },
              { text: `Be honest with the client and acknowledge their feelings`, isCorrect: false },
              { text: `Discontinue the therapeutic relationship`, isCorrect: false },
              { text: `Refuse to document the decision`, isCorrect: false }
          ],
          explanation: `Review the content in Module 6 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        }
      ]
    },
    {
      title: `Clinician Self-Care and Professional Sustainability`,
      order: 7,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 7,
          title: `Module 7`,
          subtitle: `Clinician Self-Care and Professional Sustainability`,
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>Working with suicidal clients is among the most emotionally demanding aspects of mental health practice. The intensity of suicidal crises, the weight of responsibility for client safety, and the potential for client death by suicide take a toll on clinicians. This module addresses the emotional impact of suicide care on clinicians and provides strategies for managing this impact and sustaining professional wellbeing.</p>
<p>Self-care is not a luxury or self-indulgence; it is an ethical imperative. Counselors who are burned out, overwhelmed, or traumatized cannot provide effective care. Attending to one's own wellbeing is necessary for providing competent care to clients.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Vicarious Traumatization`,
              content: `<p>Vicarious traumatization (also called secondary traumatic stress) refers to the psychological impact on clinicians of repeated exposure to clients' traumatic experiences. Working with suicidal clients involves exposure to their psychological pain, their trauma histories, and, potentially, their deaths. Over time, this exposure can affect the clinician's worldview, sense of safety, and psychological wellbeing.</p>
<p>Symptoms of vicarious traumatization may include:</p>
<p>- Intrusive thoughts about clients
- Nightmares or sleep disturbance
- Heightened sense of vulnerability
- Changes in beliefs about the world (safety, trust, meaning)
- Emotional numbing or avoidance
- Difficulty managing boundaries
- Cynicism or hopelessness about the work</p>
`
            },
            {
              title: `Burnout`,
              content: `<p>Burnout is a syndrome of emotional exhaustion, depersonalization, and reduced sense of personal accomplishment resulting from chronic work stress. Working with suicidal clients contributes to burnout through the emotional intensity of the work, the high-stakes nature of decisions, and the chronic stress of responsibility for client safety.</p>
<p>Symptoms of burnout include:</p>
<p>- Emotional and physical exhaustion
- Cynicism about clients or the work
- Feeling ineffective or that work is meaningless
- Decreased job satisfaction
- Increased errors or decreased quality of care
- Absenteeism or desire to leave the profession</p>
`
            },
            {
              title: `Impact of Client Suicide`,
              content: `<p>The death of a client by suicide is a profound event that affects clinicians deeply. Research suggests that approximately half of psychiatrists and about one-quarter of psychologists will lose a patient to suicide during their careers. The experience often includes:</p>
<p>- Grief and loss
- Guilt and self-doubt
- Fear of blame or litigation
- Anger (at the client, the system, or oneself)
- Trauma symptoms
- Professional isolation</p>
<p>Client suicide is often described as an "occupational hazard" of mental health work, but this framing should not minimize its impact. The loss of a client to suicide is traumatic, and clinicians deserve support in processing this experience.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Several factors influence how clinicians are affected by suicide care:</p>
<h2>Factors That Increase Risk</h2>
<p>- High caseloads of suicidal clients
- Inadequate training in suicide care
- Lack of supervision or consultation
- Professional isolation
- Personal history of trauma or loss
- Inadequate organizational support
- Work-life imbalance</p>
<h2>Factors That Provide Protection</h2>
<p>- Adequate training and competence
- Regular supervision or consultation
- Peer support
- Organizational support
- Work-life balance
- Personal self-care practices
- Sense of meaning and purpose in the work
- Connection to colleagues</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Immediate Self-Care Following Suicidal Crises`,
              content: `<p>After working with a client in acute suicidal crisis, counselors may need immediate self-care:</p>
<p>- Debrief with a colleague or supervisor
- Take a brief break before seeing the next client
- Use grounding techniques if feeling activated
- Acknowledge the emotional impact of the work
- Avoid taking on additional intense cases immediately if possible</p>
`
            },
            {
              title: `Ongoing Self-Care Practices`,
              content: `<p>Sustainable suicide care work requires ongoing attention to self-care:</p>
<p><strong>Professional practices</strong>:
- Maintain manageable caseloads (balance high-risk cases with less intense work)
- Seek regular supervision or consultation
- Engage in continuing education
- Maintain professional connections
- Set appropriate boundaries (around hours, availability, etc.)</p>
<p><strong>Personal practices</strong>:
- Maintain work-life balance
- Engage in activities that restore and replenish
- Maintain physical health (exercise, sleep, nutrition)
- Maintain social connections outside of work
- Engage in meaning-making practices (spirituality, values clarification)
- Seek personal therapy when needed</p>
`
            },
            {
              title: `Responding to Client Suicide`,
              content: `<p>If a client dies by suicide:</p>
<p><strong>Immediate response</strong>:
- Attend to practical matters (documentation, notification)
- Seek support from colleagues, supervisors, or personal supports
- Allow yourself to grieve
- Be compassionate with yourself</p>
<p><strong>Processing the loss</strong>:
- Participate in formal or informal case review (focused on learning, not blame)
- Seek consultation or supervision
- Consider personal therapy
- Allow time for grief and processing
- Monitor for trauma symptoms</p>
<p><strong>Professional considerations</strong>:
- Fulfill legal and ethical obligations (documentation, cooperation with investigations)
- Consider contacting the family to express condolences (with consultation regarding appropriateness and timing)
- Attend memorial services if appropriate</p>
<p><strong>Returning to practice</strong>:
- Return to work when ready, with appropriate support
- Address any lingering self-doubt or anxiety about suicide care
- Integrate learning from the experience
- Continue self-monitoring</p>
`
            },
            {
              title: `Organizational Responsibility`,
              content: `<p>While individual self-care is essential, organizations also bear responsibility for clinician wellbeing:</p>
<p>- Provide adequate training in suicide care
- Ensure access to supervision and consultation
- Maintain reasonable caseloads
- Support clinicians following client suicides
- Create cultures that normalize help-seeking and self-care
- Provide resources for clinician mental health</p>
<p>Counselors working in settings that do not provide adequate support should advocate for change and, if necessary, consider whether the setting allows them to practice safely and sustainably.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Beyond managing stress and preventing burnout, counselors can actively develop resilience—the capacity to navigate adversity while maintaining functioning and wellbeing:</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          accordionItems: [
            {
              title: `Cultivating Meaning and Purpose`,
              content: `<p>Finding meaning in suicide care work sustains clinicians through its challenges. Strategies for cultivating meaning include:</p>
<p><strong>Connecting to values</strong>: Regularly revisiting why you entered this field and what values your work serves helps maintain perspective during difficult periods.</p>
<p><strong>Recognizing impact</strong>: Acknowledging the clients you have helped, even when you cannot see long-term outcomes, combats feelings of futility.</p>
<p><strong>Contributing to prevention</strong>: Involvement in suicide prevention activities beyond direct clinical work (training others, community education, advocacy) can expand one's sense of impact.</p>
<p><strong>Learning from loss</strong>: When clients do die by suicide, finding ways to learn from the experience and improve future care can create meaning from tragedy.</p>
`
            },
            {
              title: `Building Professional Competence`,
              content: `<p>Competence builds confidence, which reduces anxiety when working with suicidal clients:</p>
<p><strong>Pursue specialized training</strong>: Advanced training in suicide risk assessment, safety planning, and crisis intervention increases competence and confidence.</p>
<p><strong>Engage in regular consultation</strong>: Ongoing consultation with peers and experts provides learning opportunities and confidence that you're not practicing alone.</p>
<p><strong>Stay current with research</strong>: Knowledge of current research and best practices supports clinical decision-making.</p>
<p><strong>Practice deliberately</strong>: Intentionally practice and refine suicide care skills rather than simply repeating familiar approaches.</p>
`
            },
            {
              title: `Building Support Networks`,
              content: `<p>Professional isolation increases vulnerability to burnout and vicarious traumatization:</p>
<p><strong>Peer support</strong>: Cultivate relationships with colleagues who understand the work and can provide support.</p>
<p><strong>Consultation relationships</strong>: Establish ongoing consultation relationships with trusted peers or experts.</p>
<p><strong>Professional communities</strong>: Participate in professional organizations, conferences, and communities focused on suicide prevention.</p>
<p><strong>Non-work connections</strong>: Maintain relationships and activities outside of work that provide balance and perspective.</p>
`
            },
            {
              title: `Managing the Emotional Demands`,
              content: `<p>Working with suicidal clients generates strong emotions that must be managed:</p>
<p><strong>Normalize emotional responses</strong>: Recognizing that strong emotions are normal responses to difficult work, not signs of weakness or incompetence, reduces the burden of emotional labor.</p>
<p><strong>Process emotions actively</strong>: Rather than suppressing emotions, actively process them through supervision, consultation, journaling, or therapy.</p>
<p><strong>Develop containment strategies</strong>: Learn to set aside work-related emotions when not working, while remaining open to processing them appropriately.</p>
<p><strong>Maintain boundaries</strong>: Clear boundaries between work and personal life protect against emotional overflow.</p>
`
            },
            {
              title: `Maintaining Perspective`,
              content: `<p>The intensity of suicide care work can distort perspective in ways that increase distress:</p>
<p><strong>Remember base rates</strong>: While suicide is devastating, most clients with suicidal ideation do not die by suicide. Your work does help most clients.</p>
<p><strong>Acknowledge uncertainty</strong>: Accepting that suicide cannot be predicted with certainty reduces the burden of perceived responsibility.</p>
<p><strong>Distinguish responsibility from control</strong>: You are responsible for providing competent care; you are not responsible for outcomes you cannot control.</p>
<p><strong>Avoid all-or-nothing thinking</strong>: Success is not defined by zero suicides. Reducing risk, reducing suffering, and helping clients survive crises are all meaningful accomplishments even when outcomes are not perfect.</p>
`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },
        {
          type: "text",
          content: `<p>Counselors should seek their own mental health treatment when:</p>
<p>- Symptoms of vicarious traumatization or burnout are significant
- A client suicide has occurred and support beyond consultation is needed
- Personal mental health symptoms interfere with functioning
- Work stress is affecting personal relationships or life outside work
- Coping strategies are inadequate to manage the emotional demands</p>
<p>Seeking help is not a sign of weakness—it is an ethical obligation to maintain the capacity to provide competent care and a modeling of the help-seeking behavior we encourage in clients.</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Consider the following questions:</p>
<p>1. What aspects of suicide care are most emotionally challenging for you?</p>
<p>2. What self-care practices do you currently use? What additional practices might you adopt?</p>
<p>3. Who can you turn to for support when the work is difficult?</p>
<p>4. How would you know if you were experiencing vicarious traumatization or burnout? What signs would alert you?</p>
<p>5. What would you do if you lost a client to suicide? What supports would you seek?</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "multipleChoice",
          question: `Vicarious traumatization refers to:?`,
          options: [
              { text: `Clients experiencing trauma in therapy`, isCorrect: true },
              { text: `Psychological impact on clinicians from exposure to clients' trauma`, isCorrect: false },
              { text: `Trauma that occurs during training`, isCorrect: false },
              { text: `Physical injury from violent clients`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Research suggests that approximately what percentage of psychiatrists will experience patient suicide during their careers?`,
          options: [
              { text: `10%`, isCorrect: false },
              { text: `25%`, isCorrect: true },
              { text: `50%`, isCorrect: false },
              { text: `75%`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is a protective factor for clinician wellbeing when working with suicidal clients?`,
          options: [
              { text: `High caseloads of suicidal clients`, isCorrect: false },
              { text: `Professional isolation`, isCorrect: false },
              { text: `Regular supervision and consultation`, isCorrect: true },
              { text: `Avoiding discussion of difficult cases`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Following a client suicide, an appropriate clinician response includes:?`,
          options: [
              { text: `Immediately returning to a full caseload`, isCorrect: false },
              { text: `Avoiding all discussion of the loss`, isCorrect: false },
              { text: `Seeking support and allowing time for grief and processing`, isCorrect: false },
              { text: `Leaving the profession`, isCorrect: true }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Self-care for counselors is best understood as:?`,
          options: [
              { text: `A luxury for those who can afford it`, isCorrect: true },
              { text: `An ethical imperative for providing competent care`, isCorrect: false },
              { text: `Selfish indulgence`, isCorrect: false },
              { text: `Necessary only after client suicide`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `According to CDC data, what is the approximate annual number of suicide deaths in the United States?`,
          options: [
              { text: `25,000`, isCorrect: false },
              { text: `35,000`, isCorrect: true },
              { text: `49,000`, isCorrect: false },
              { text: `65,000`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `According to Joiner's Interpersonal-Psychological Theory of Suicide, the desire for suicide emerges from the combination of:?`,
          options: [
              { text: `Depression and substance use`, isCorrect: false },
              { text: `Thwarted belongingness and perceived burdensomeness`, isCorrect: false },
              { text: `Hopelessness and impulsivity`, isCorrect: true },
              { text: `Childhood trauma and genetic factors`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which method accounts for the majority of suicide deaths in the United States?`,
          options: [
              { text: `Poisoning`, isCorrect: false },
              { text: `Suffocation`, isCorrect: false },
              { text: `Firearms`, isCorrect: false },
              { text: `Drowning`, isCorrect: true }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The single strongest predictor of future suicidal behavior is:?`,
          options: [
              { text: `Depression severity`, isCorrect: true },
              { text: `Previous suicide attempt`, isCorrect: false },
              { text: `Family history of suicide`, isCorrect: false },
              { text: `Substance use disorder`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The Columbia-Suicide Severity Rating Scale (C-SSRS) assesses:?`,
          options: [
              { text: `Depression and anxiety`, isCorrect: false },
              { text: `Suicidal ideation and behavior`, isCorrect: true },
              { text: `Personality disorders`, isCorrect: false },
              { text: `Substance use`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The Stanley-Brown Safety Planning Intervention differs from "no-suicide contracts" in that:?`,
          options: [
              { text: `Safety planning is legally binding`, isCorrect: false },
              { text: `Safety planning has empirical support; no-suicide contracts do not`, isCorrect: false },
              { text: `No-suicide contracts are more effective`, isCorrect: true },
              { text: `There is no meaningful difference`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is the MOST effective firearm storage strategy during a suicidal crisis?`,
          options: [
              { text: `Keeping the firearm unloaded`, isCorrect: false },
              { text: `Using a trigger lock`, isCorrect: false },
              { text: `Temporary storage outside the home`, isCorrect: false },
              { text: `Hiding the firearm`, isCorrect: true }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Research on lethal means restriction suggests that:?`,
          options: [
              { text: `People who are prevented from using one method always find another`, isCorrect: true },
              { text: `Method substitution is incomplete, and means restriction saves lives`, isCorrect: false },
              { text: `Means restriction is only effective for impulsive suicide`, isCorrect: false },
              { text: `Means restriction violates client autonomy`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `For LGBTQ+ youth, family acceptance is associated with:?`,
          options: [
              { text: `No change in suicide risk`, isCorrect: false },
              { text: `Increased suicide risk`, isCorrect: true },
              { text: `Substantially decreased suicide risk`, isCorrect: false },
              { text: `Increased depression but not suicide`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `The period immediately following psychiatric hospitalization is associated with:?`,
          options: [
              { text: `Decreased suicide risk`, isCorrect: false },
              { text: `Elevated suicide risk`, isCorrect: false },
              { text: `No change in suicide risk`, isCorrect: true },
              { text: `Elevated risk only for certain diagnoses`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `HIPAA permits disclosure of protected health information without authorization when:?`,
          options: [
              { text: `The patient is under 18`, isCorrect: false },
              { text: `Necessary to prevent or lessen a serious and imminent threat`, isCorrect: false },
              { text: `The disclosure is to a family member`, isCorrect: false },
              { text: `The patient has a substance use disorder`, isCorrect: true }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `To meet the standard of care in suicide risk management, counselors should:?`,
          options: [
              { text: `Hospitalize all clients with suicidal ideation`, isCorrect: true },
              { text: `Conduct appropriate assessments, implement appropriate interventions, and document thoroughly`, isCorrect: false },
              { text: `Guarantee client safety`, isCorrect: false },
              { text: `Avoid treating suicidal clients`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Vicarious traumatization in clinicians who work with suicidal clients may include:?`,
          options: [
              { text: `Intrusive thoughts and changes in worldview`, isCorrect: false },
              { text: `Improved sleep and increased optimism`, isCorrect: true },
              { text: `Greater emotional detachment as a sign of professionalism`, isCorrect: false },
              { text: `Symptoms only if a client dies by suicide`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Among older adults, which factor is particularly strongly associated with suicide risk?`,
          options: [
              { text: `Social media use`, isCorrect: false },
              { text: `Academic pressure`, isCorrect: false },
              { text: `Physical health problems and loss of independence`, isCorrect: true },
              { text: `Peer relationship difficulties`, isCorrect: false }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "multipleChoice",
          question: `Which of the following is considered a protective factor against suicide?`,
          options: [
              { text: `Access to firearms`, isCorrect: false },
              { text: `Previous suicide attempt`, isCorrect: false },
              { text: `Social isolation`, isCorrect: false },
              { text: `Strong reasons for living`, isCorrect: true }
          ],
          explanation: `Review the content in Module 7 for a detailed explanation of this concept.`,
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },
        {
          type: "text",
          content: `<p>American Association of Suicidology. (2023). *Warning signs of suicide*. https://suicidology.org</p>
<p>Bridge, J. A., Ruch, D. A., Sheftall, A. H., Hahm, H. C., O'Keefe, V. M., Fontanella, C. A., & Campo, J. V. (2023). Youth suicide during the first year of the COVID-19 pandemic. *Pediatrics, 151*(3), e2022058375.</p>
<p>Cavanagh, J. T., Carson, A. J., Sharpe, M., & Lawrie, S. M. (2003). Psychological autopsy studies of suicide: A systematic review. *Psychological Medicine, 33*(3), 395-405.</p>
<p>Centers for Disease Control and Prevention. (2022). *Youth Risk Behavior Survey data summary & trends report 2011-2021*. U.S. Department of Health and Human Services.</p>
<p>Centers for Disease Control and Prevention. (2023). *Suicide data and statistics*. https://www.cdc.gov/suicide/suicide-data-statistics.html</p>
<p>Drapeau, C. W., & McIntosh, J. L. (2020). *U.S.A. suicide: 2019 official final data*. American Association of Suicidology.</p>
<p>James, S. E., Herman, J. L., Rankin, S., Keisling, M., Mottet, L., & Anafi, M. (2016). *The report of the 2015 U.S. Transgender Survey*. National Center for Transgender Equality.</p>
<p>Joiner, T. E. (2005). *Why people die by suicide*. Harvard University Press.</p>
<p>Klonsky, E. D., & May, A. M. (2015). The Three-Step Theory (3ST): A new theory of suicide rooted in the "ideation-to-action" framework. *International Journal of Cognitive Therapy, 8*(2), 114-129.</p>
<p>O'Connor, R. C. (2011). Towards an integrated motivational-volitional model of suicidal behaviour. In R. C. O'Connor, S. Platt, & J. Gordon (Eds.), *International handbook of suicide prevention: Research, policy and practice* (pp. 181-198). Wiley-Blackwell.</p>
<p>Posner, K., Brown, G. K., Stanley, B., Brent, D. A., Yershova, K. V., Oquendo, M. A., ... & Mann, J. J. (2011). The Columbia–Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults. *American Journal of Psychiatry, 168*(12), 1266-1277.</p>
<p>Shneidman, E. S. (1993). *Suicide as psychache: A clinical approach to self-destructive behavior*. Jason Aronson.</p>
<p>Stanley, B., & Brown, G. K. (2012). Safety planning intervention: A brief intervention to mitigate suicide risk. *Cognitive and Behavioral Practice, 19*(2), 256-264.</p>
<p>Stanley, B., Brown, G. K., Brenner, L. A., Galfalvy, H. C., Currier, G. W., Knox, K. L., ... & Green, K. L. (2018). Comparison of the safety planning intervention with follow-up vs usual care of suicidal patients treated in the emergency department. *JAMA Psychiatry, 75*(9), 894-900.</p>
<p>Substance Abuse and Mental Health Services Administration. (2022). *Key substance use and mental health indicators in the United States: Results from the 2021 National Survey on Drug Use and Health*. Center for Behavioral Health Statistics and Quality.</p>
<p>Van Orden, K. A., Witte, T. K., Cukrowicz, K. C., Braithwaite, S. R., Selby, E. A., & Joiner, T. E. (2010). The interpersonal theory of suicide. *Psychological Review, 117*(2), 575-600.</p>
<p>---</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "text",
          content: `<p>Congratulations on completing <strong>Suicide Risk Assessment and Crisis Intervention</strong>!</p>
<p>To receive your 4.0 CE credits:
1. Complete the final assessment with a score of 80% or higher
2. Complete the course evaluation
3. Your certificate will be available for download upon successful completion</p>
<p><strong>NBCC ACEP Provider #7760</strong>  
GAITP LLC (Ga Integrated Therapeutic Perspectives LLC)  
CounselorReady: Learn. License. Lead.</p>
<p>---</p>
<p>*This course is approved by NBCC for 4.0 contact hours in the Counseling Theory and Practice content area. GAITP LLC (Ga Integrated Therapeutic Perspectives LLC) has been approved by NBCC as an Approved Continuing Education Provider, ACEP No. 7760. Programs that do not qualify for NBCC credit are clearly identified. GAITP LLC is solely responsible for all aspects of the programs.*</p>
`,
          accessibility: { role: "article" }
        },
        {
          type: "reflection",
          question: `Take an honest inventory of your current self-care practices. On a scale of 1-10, how sustainable is your current approach to working with high-risk clients? What one change could you commit to this week?`,
          accessibility: { role: "textbox", ariaLabel: "Reflection prompt" }
        }
      ]
    }
  ],

  assessment: {
    passThreshold: 0.80,
    maxAttempts: 3,
    questions: [
    {
      question: `According to Joiner's Interpersonal-Psychological Theory of Suicide, the three factors required for lethal suicidal behavior are:`,
      type: "multiple-choice",
      options: [
        { text: `Depression, anxiety, and substance use`, isCorrect: false },
        { text: `Thwarted belongingness, perceived burdensomeness, and acquired capability for suicide`, isCorrect: true },
        { text: `Hopelessness, impulsivity, and access to means`, isCorrect: false },
        { text: `Social isolation, chronic pain, and genetic predisposition`, isCorrect: false }
      ]
    },
    {
      question: `The Columbia-Suicide Severity Rating Scale (C-SSRS) primarily assesses:`,
      type: "multiple-choice",
      options: [
        { text: `Depression severity`, isCorrect: false },
        { text: `Suicidal ideation severity and suicidal behavior`, isCorrect: true },
        { text: `Personality disorder traits`, isCorrect: false },
        { text: `Functional impairment`, isCorrect: false }
      ]
    },
    {
      question: `The Stanley-Brown Safety Planning Intervention includes all EXCEPT:`,
      type: "multiple-choice",
      options: [
        { text: `Identifying warning signs`, isCorrect: false },
        { text: `Listing internal coping strategies`, isCorrect: false },
        { text: `Restricting all means access permanently`, isCorrect: true },
        { text: `Identifying social contacts for support`, isCorrect: false }
      ]
    },
    {
      question: `Means restriction counseling is critical because:`,
      type: "multiple-choice",
      options: [
        { text: `It eliminates suicidal ideation`, isCorrect: false },
        { text: `Reducing access to lethal means during crisis significantly reduces suicide completion rates`, isCorrect: true },
        { text: `It is required by law in all states`, isCorrect: false },
        { text: `Clients will not attempt suicide without their preferred means`, isCorrect: false }
      ]
    },
    {
      question: `Which population has the HIGHEST rate of suicide completion?`,
      type: "multiple-choice",
      options: [
        { text: `Adolescent females`, isCorrect: false },
        { text: `Middle-aged and older White males`, isCorrect: true },
        { text: `Young adult college students`, isCorrect: false },
        { text: `Elderly females`, isCorrect: false }
      ]
    },
    {
      question: `When assessing suicide risk, 'protective factors' include all EXCEPT:`,
      type: "multiple-choice",
      options: [
        { text: `Strong social connections`, isCorrect: false },
        { text: `Access to mental health treatment`, isCorrect: false },
        { text: `Previous suicide attempts`, isCorrect: true },
        { text: `Reasons for living`, isCorrect: false }
      ]
    },
    {
      question: `The ethical principle MOST relevant to involuntary hospitalization for suicidal clients is:`,
      type: "multiple-choice",
      options: [
        { text: `Autonomy vs. beneficence`, isCorrect: true },
        { text: `Justice vs. fidelity`, isCorrect: false },
        { text: `Nonmaleficence vs. veracity`, isCorrect: false },
        { text: `Competence vs. confidentiality`, isCorrect: false }
      ]
    },
    {
      question: `Warning signs of imminent suicide risk include:`,
      type: "multiple-choice",
      options: [
        { text: `Talking about being a burden, increasing isolation, giving away possessions, and sudden calmness after depression`, isCorrect: true },
        { text: `Increased social activity and improved mood`, isCorrect: false },
        { text: `Making future plans and expressing hope`, isCorrect: false },
        { text: `Consistent attendance at therapy sessions`, isCorrect: false }
      ]
    },
    {
      question: `The CALM approach to means counseling stands for:`,
      type: "multiple-choice",
      options: [
        { text: `Counsel, Assess, Limit, Monitor`, isCorrect: false },
        { text: `Counseling on Access to Lethal Means`, isCorrect: true },
        { text: `Crisis Assessment and Lethality Management`, isCorrect: false },
        { text: `Clinical Assessment of Lethal Methods`, isCorrect: false }
      ]
    },
    {
      question: `Clinician self-care after a client suicide is important because:`,
      type: "multiple-choice",
      options: [
        { text: `It prevents licensing board complaints`, isCorrect: false },
        { text: `Client suicide can cause vicarious trauma, grief, and impairment that affects the clinician's practice and wellbeing`, isCorrect: true },
        { text: `It is required by insurance carriers`, isCorrect: false },
        { text: `It demonstrates competence`, isCorrect: false }
      ]
    },
    {
      question: `Cultural considerations in suicide assessment include:`,
      type: "multiple-choice",
      options: [
        { text: `Using the same assessment tools for all populations`, isCorrect: false },
        { text: `Recognizing that cultural factors influence how suicidal ideation is expressed, help-seeking behavior, and protective factors`, isCorrect: true },
        { text: `Avoiding direct questions about suicide with culturally diverse clients`, isCorrect: false },
        { text: `Assuming all cultures have the same risk factors`, isCorrect: false }
      ]
    },
    {
      question: `Documentation of suicide risk assessment should include:`,
      type: "multiple-choice",
      options: [
        { text: `Only the final risk level determination`, isCorrect: false },
        { text: `Risk factors, protective factors, clinical reasoning, safety plan, and disposition decision with rationale`, isCorrect: true },
        { text: `A signed contract for safety`, isCorrect: false },
        { text: `Only the standardized assessment score`, isCorrect: false }
      ]
    },
    {
      question: `A 'no-suicide contract' is considered:`,
      type: "multiple-choice",
      options: [
        { text: `The gold standard for safety planning`, isCorrect: false },
        { text: `Clinically insufficient and not a substitute for comprehensive safety planning`, isCorrect: true },
        { text: `Legally binding and protective`, isCorrect: false },
        { text: `Effective for all client populations`, isCorrect: false }
      ]
    },
    {
      question: `LGBTQ+ youth are at elevated suicide risk primarily due to:`,
      type: "multiple-choice",
      options: [
        { text: `Inherent psychopathology`, isCorrect: false },
        { text: `Minority stress, discrimination, family rejection, and lack of affirming supports`, isCorrect: true },
        { text: `Biological factors`, isCorrect: false },
        { text: `Overrepresentation in clinical samples`, isCorrect: false }
      ]
    },
    {
      question: `Following a suicide risk assessment that reveals moderate risk, the MOST appropriate next step is:`,
      type: "multiple-choice",
      options: [
        { text: `Immediate involuntary hospitalization`, isCorrect: false },
        { text: `Develop or update a safety plan, increase session frequency, restrict means, and coordinate care`, isCorrect: true },
        { text: `Discharge from treatment with referral resources`, isCorrect: false },
        { text: `No action needed at moderate level`, isCorrect: false }
      ]
    }
    ]
  },

  references: [
    "American Association of Suicidology. (2023). IS PATH WARM warning signs.",
    "Bridge, J.A., et al. (2023). Suicide trends among youths. JAMA Pediatrics.",
    "Centers for Disease Control and Prevention. (2023). Suicide statistics.",
    "Drapeau, C.W., & McIntosh, J.L. (2020). USA suicide: Official final data.",
    "James, S.E., et al. (2016). The Report of the 2015 U.S. Transgender Survey.",
    "Joiner, T.E. (2005). Why People Die by Suicide. Harvard University Press.",
    "SAMHSA. (2022). National Survey on Drug Use and Health.",
    "Stanley, B., & Brown, G.K. (2012). Safety Planning Intervention. Cognitive and Behavioral Practice.",
    "Posner, K., et al. (2011). The Columbia-Suicide Severity Rating Scale. American Journal of Psychiatry.",
    "Bryan, C.J., et al. (2017). Effect of crisis response planning on suicidal ideation. JAMA Psychiatry."
  ]
};

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  SEED SUICIDE RISK ASSESSMENT — INTERACTIVE FORMAT');
  console.log('═'.repeat(60));
  
  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const Course = mongoose.connection.models.Course || 
    mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

  // Find existing course by title pattern
  const existing = await Course.findOne({
    title: /suicide risk assessment/i
  });

  if (existing) {
    await Course.updateOne({ _id: existing._id }, { $set: SUICIDE_RISK_INTERACTIVE });
    console.log('  ✅ UPDATED existing Suicide Risk Assessment course');
    console.log(`     Previous ID: ${existing._id}`);
  } else {
    const created = await Course.create(SUICIDE_RISK_INTERACTIVE);
    console.log('  ✅ CREATED new Suicide Risk Assessment course');
    console.log(`     ID: ${created._id}`);
  }

  // Stats
  const totalBlocks = SUICIDE_RISK_INTERACTIVE.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.length || 0), 0
  );
  const totalKC = SUICIDE_RISK_INTERACTIVE.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'multipleChoice').length || 0), 0
  );

  console.log(`\n  📊 Course Statistics:`);
  console.log(`     Title: ${SUICIDE_RISK_INTERACTIVE.title}`);
  console.log(`     CE Hours: ${SUICIDE_RISK_INTERACTIVE.ceHours}`);
  console.log(`     Modules: ${SUICIDE_RISK_INTERACTIVE.modules.length}`);
  console.log(`     Content Blocks: ${totalBlocks}`);
  console.log(`     Knowledge Check Questions: ${totalKC}`);
  console.log(`     Final Assessment Questions: ${SUICIDE_RISK_INTERACTIVE.assessment.questions.length}`);
  console.log(`     Matching Exercises: ${SUICIDE_RISK_INTERACTIVE.modules.reduce((s,m) => s + (m.contentBlocks?.filter(b => b.type === 'matching').length || 0), 0)}`);
  console.log(`     Reflection Prompts: ${SUICIDE_RISK_INTERACTIVE.modules.reduce((s,m) => s + (m.contentBlocks?.filter(b => b.type === 'reflection').length || 0), 0)}`);
  console.log(`     Image Blocks: ${SUICIDE_RISK_INTERACTIVE.modules.reduce((s,m) => s + (m.contentBlocks?.filter(b => b.type === 'imageText').length || 0), 0)}`);
  console.log(`     Clinical Vignettes: 3`);
  console.log(`     Accessibility: WCAG AA`);

  await mongoose.disconnect();
  console.log('\n✅ Done.\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
