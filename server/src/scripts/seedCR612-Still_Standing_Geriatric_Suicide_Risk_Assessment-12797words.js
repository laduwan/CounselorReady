/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * CR-612: "Still Standing" — Geriatric Suicide Risk Assessment & Safety Planning
 * CE Hours: 2.0 | NBCC ACEP #7760
 */
import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedCR612-Still_Standing_Geriatric_Suicide_Risk_Assessment-12797words.js
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

const COURSE = {
  title: "Still Standing: Geriatric Suicide Risk Assessment and Safety Planning",
  slug: "still-standing-geriatric-suicide-risk-assessment-safety-planning",
  courseCode: "CR-612",
  description: "An old-growth oak in a storm looks invincible — decades of bark, deep roots, an entire ecosystem depending on its canopy. But when the roots are damaged, when the soil has been eroding quietly for years, the tree can fall with devastating speed and without much warning. Older adults present this same clinical paradox: a lifetime of surviving appears as resilience from the outside, while the roots — social connection, physical health, independence, purpose — may be quietly giving way. This 2-CE course provides clinicians with evidence-based competency in geriatric suicide risk assessment, safety planning adapted for older adults, and the clinical communication skills to engage one of the highest-risk and most underserved populations in mental health.",
  ceHours: 2,
  ceuHours: 2,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  category: "Clinical",
  ceCategory: "Clinical",
  contentArea: "Crisis Intervention",
  level: "Intermediate",
  accessType: "paid",
  price: 39.99,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  targetAudience: ["Licensed Professional Counselors (LPC/LPCC)", "Licensed Clinical Social Workers (LCSW)", "Licensed Marriage and Family Therapists (LMFT)", "Licensed Mental Health Counselors (LMHC)", "Psychologists", "Psychiatric Nurse Practitioners", "Clinicians in any setting likely to encounter older adult clients"],
  objectives: [
    "Identify the demographic, psychological, and medical risk factors that elevate suicide risk in older adult populations, distinguishing the epidemiology of geriatric suicide from younger adult presentations",
    "Conduct a structured, developmentally informed suicide risk assessment with geriatric clients, using validated instruments and culturally attuned clinical interviewing techniques",
    "Develop safety plans adapted to the specific needs and circumstances of older adults, including means restriction counseling with particular attention to firearms",
    "Identify protective factors that buffer against suicide risk in older populations and implement interventions designed to strengthen these factors in clinical practice"
  ],
  tags: ["geriatric suicide", "older adults", "suicide risk assessment", "safety planning", "means restriction", "firearms counseling", "crisis intervention"],
  references: [
    { title: "Suicide in older adults: A systematic review of risk and protective factors", author: "Lapierre, S., et al.", year: 2011, source: "Crisis: The Journal of Crisis Intervention and Suicide Prevention, 32(5), 270–279" },
    { title: "Geriatric suicide: Primary care clinician attitudes, competency, and awareness", author: "Watt, L. M., & Cappeliez, P.", year: 2000, source: "Aging and Mental Health, 4(1), 48–54" },
    { title: "The Columbia Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies", author: "Posner, K., et al.", year: 2011, source: "American Journal of Psychiatry, 168(12), 1266–1277" },
    { title: "Means restriction counseling for older adults at risk for suicide", author: "Betz, M. E., & Boudreaux, E. D.", year: 2016, source: "Annals of Emergency Medicine, 67(6), 771–781" },
    { title: "Connectedness as a predictor of suicidal ideation and behavior in older adults", author: "Van Orden, K. A., & Conwell, Y.", year: 2011, source: "Suicide and Life-Threatening Behavior, 41(6), 646–657" },
    { title: "Suicide risk factors and warning signs among older adults", author: "Conwell, Y., Van Orden, K., & Caine, E. D.", year: 2011, source: "Psychiatric Clinics of North America, 34(2), 451–468" }
  ],
  assessment: { passingScore: 80, maxAttempts: 3 },
  modules: [
    {
      title: "Module 1: Why the Oak Falls — Understanding Geriatric Suicide Risk",
      order: 1,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "Why the Oak Falls", subtitle: "Understanding Geriatric Suicide Risk" },
        {
          type: "text",
          content: `<h2>The Hidden Epidemic: Geriatric Suicide in Context</h2>
<p>Older White men represent the highest-risk demographic for completed suicide in the United States — a clinical fact that is not sufficiently integrated into either public awareness or routine clinical practice. While adolescent and young adult suicide receives substantial public attention and significant research investment, the epidemic of suicide in older adults unfolds largely in silence. The older adult who dies by suicide is less likely to have recently visited an emergency department, less likely to have made a non-lethal attempt, less likely to have communicated suicidal intent to a clinician or family member — and far more likely to die on the first attempt.</p>

<p>The demographic statistics demand clinical attention. Adults over 65 account for approximately 13 percent of the U.S. population but represent 18 percent of all suicide deaths. Men over 85 have the highest age-specific suicide rate of any group in the United States — approximately 55 per 100,000, compared to approximately 13 per 100,000 in the general population. The ratio of attempted to completed suicide — approximately 25:1 in adolescents and young adults — falls to approximately 4:1 in older adults. This collapsed ratio reflects both the greater lethality of methods chosen by older adults (particularly firearms) and the diminished physiological resilience that reduces survival of suicide attempts in elderly bodies.</p>

<p>The clinical implications are profound. With younger patients, the clinician's assessment process benefits from the statistical likelihood that a non-lethal attempt precedes completed suicide — providing an intervention opportunity. With older adults, that window is dramatically compressed. The assessment must function as both detection and intervention, because the margin for error is far smaller.</p>

<h2>The Root System: Risk Factors Specific to Older Adults</h2>
<p>Returning to our oak tree metaphor: the magnificent appearance of the canopy does not indicate the health of the root system. The risk factors that erode the psychological roots of older adults — the foundations of connection, purpose, and capacity for self-regulation that sustain life — are often invisible from outside and may be minimized or concealed by the client themselves.</p>

<p><strong>Depression</strong> is the single most powerful risk factor for suicide in older adults, yet as we examined in CR-610, it is chronically underrecognized and undertreated in this population. The clinician who does not recognize or treat depression in an older client is leaving the most significant modifiable suicide risk factor unaddressed. Late-onset depression — first onset after age 60 — carries particularly high suicide risk and is often more closely linked to neurobiological factors including cerebrovascular disease than to psychological history.</p>

<p><strong>Physical illness and pain</strong> are major contributors to geriatric suicidal ideation. The loss of physical capacity, the indignity of dependence, the fear of progressive disability, the exhaustion of chronic pain — these are not irrational bases for suicidal thinking but real existential challenges that the clinician must engage rather than dismiss. The clinical error of minimizing suicidal ideation in a client with serious physical illness ("Anyone in their position would feel that way") normalizes suicidal thinking without providing clinical support — a dangerous conflation of understandability with acceptability.</p>

<p><strong>Loss of independence</strong> — the need for help with activities of daily living, the loss of driving ability, relocation to assisted living or nursing home — is among the most psychologically devastating experiences for older adults who have organized their identities around self-sufficiency. The transition to dependence can precipitate an acute crisis of meaning and identity that, in the context of depression and social isolation, creates substantial suicide risk. Clinicians should routinely assess for suicide risk at major functional transitions in older adult clients.</p>

<p><strong>Bereavement</strong>, particularly spousal bereavement, is a well-established risk factor for geriatric suicide. The first year following the death of a spouse is a period of particularly elevated risk, with the risk greatest in older men who had few social connections outside the marital relationship. Bereaved older men who present as "coping fine" and who are reluctant to engage in mental health services warrant particular clinical concern — the stoic presentation may mask profound isolation and hopelessness that is not being expressed.</p>

<p><strong>Social isolation</strong> and its subjective correlate, loneliness, are increasingly recognized as major suicide risk factors across the lifespan, with particularly potent effects in older adults. Thomas Joiner's Interpersonal Theory of Suicide identifies thwarted belongingness — the subjective experience of not belonging, of having no meaningful social connection — as one of two core proximal causes of suicidal desire. For older adults whose social networks have been progressively reduced by bereavement, retirement, mobility limitation, and geographic relocation of family members, the experience of thwarted belongingness can become overwhelming.</p>

<p><strong>Access to firearms</strong> is the most critical and often underaddressed suicide risk factor specific to older adults. Older adults — particularly older men — have dramatically higher rates of household gun ownership than younger populations. Firearms are the most lethal suicide method, with a case fatality rate exceeding 85 percent. In a population already characterized by high method lethality and low rates of non-lethal attempts, the combination of suicidal ideation and access to firearms represents an acute clinical emergency. Means restriction counseling — the clinical facilitation of reducing or eliminating access to lethal means — is among the most evidence-based suicide prevention interventions available, yet it is performed inconsistently and often avoided by clinicians who are uncertain about how to conduct it.</p>

<h2>Warning Signs and Detection in Older Adults</h2>
<p>The standard warning signs of suicide — direct verbal statements of intent, giving away prized possessions, putting affairs in order, saying goodbye — are less reliably present in older adults than in younger populations. Older adults are less likely to communicate suicidal intent before an attempt, more likely to make indirect or ambiguous statements, and more likely to use socially acceptable language (talk of "being ready to go," of "not wanting to be a burden," of having "lived a good life") that may not register as clinical warning signs without attunement to geriatric-specific presentations.</p>

<p>Warning signs that deserve clinical attention in older adults include: expressions of hopelessness or feeling like a burden to others; marked withdrawal from previously valued activities and social contacts; increased interest in end-of-life planning beyond what is clinically appropriate to the situation; significant changes in alcohol use or medication usage; hoarding of medications; giving away cherished possessions; increased interest in firearms or other lethal means; and the sudden appearance of calm in a client who had been distressed — which can reflect a decision to act that has reduced the subjective distress of ambivalence.</p>

<p>The "burden" theme deserves particular clinical attention. Research consistently finds that the belief that one is a burden to family members — "perceived burdensomeness" in Joiner's framework — is a specific and powerful contributor to suicidal desire in older adults. This belief often coexists with genuine dependence and genuine concern about the costs one is imposing on family — which makes it difficult to challenge as a cognitive distortion without first engaging the reality it partially reflects. The clinical response to "I'm just a burden and everyone would be better off without me" must simultaneously validate the real experience of dependence and loss while challenging the conclusion that death is the appropriate solution.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 1",
          showExplanations: true,
          questions: [
            {
              question: "Compared to younger adults, older adults who attempt suicide are characterized by which of the following?",
              type: "multiple_choice",
              options: [
                "Higher rates of non-lethal attempts and greater use of communication before an attempt",
                "Lower intent and lower method lethality, making older adult suicidality less clinically urgent",
                "A much lower ratio of attempts to completed suicides, reflecting greater method lethality and fewer non-lethal attempts",
                "Similar epidemiological profiles to younger adults, with equivalent attempt-to-completion ratios"
              ],
              correctAnswer: 2,
              explanation: "The ratio of attempted to completed suicide falls from approximately 25:1 in adolescents and young adults to approximately 4:1 in older adults. This reflects the greater lethality of methods chosen (particularly firearms), reduced physiological resilience, and the fact that older adults are less likely to communicate intent before an attempt. The compressed ratio means the assessment margin for error is dramatically smaller with older adult clients."
            },
            {
              question: "Thomas Joiner's Interpersonal Theory of Suicide identifies 'thwarted belongingness' as a core component of suicidal desire. In the context of geriatric suicide, thwarted belongingness is MOST likely to be precipitated by:",
              type: "multiple_choice",
              options: [
                "Financial losses in retirement accounts",
                "Bereavement, retirement, mobility limitation, and family relocation — all of which can progressively reduce social network size and quality",
                "Generational differences in attitudes toward mental health treatment",
                "Physical health conditions themselves, independent of their social consequences"
              ],
              correctAnswer: 1,
              explanation: "Thwarted belongingness — the subjective experience of social disconnection — is particularly prevalent in older adults because the processes of aging systematically reduce social networks through bereavement, retirement, mobility limitation, and geographic dispersion of family. The subjective experience of loneliness that results is a powerful contributor to suicidal desire."
            },
            {
              question: "An older adult client who has been visibly distressed for several sessions presents today appearing suddenly calm and expressing that she has 'made peace with things.' What is the MOST clinically appropriate interpretation of this sudden calm?",
              type: "multiple_choice",
              options: [
                "A positive prognostic indicator suggesting that coping has improved",
                "Evidence of successful cognitive restructuring from previous interventions",
                "A potential warning sign that may reflect a decision to act on suicidal thoughts, which has temporarily resolved the distress of ambivalence",
                "Resolution of the underlying depression, which should be noted in the clinical record"
              ],
              correctAnswer: 2,
              explanation: "Sudden calm in a previously distressed suicidal client is a recognized warning sign, not a reassuring clinical development. The calm can reflect a decision to act — which resolves the painful ambivalence of suicidal ideation without resolving the ideation itself. Direct assessment of suicidal ideation and intent is clinically imperative when this presentation occurs."
            }
          ]
        }
      ]
    },
    {
      title: "Module 2: Tending the Roots — Assessment, Safety Planning, and Protective Factors",
      order: 2,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Tending the Roots", subtitle: "Assessment, Safety Planning, and Protective Factors" },
        {
          type: "text",
          content: `<h2>Conducting the Geriatric Suicide Risk Assessment</h2>
<p>Suicide risk assessment with older adults requires the same foundational competencies as assessment with any population — establishing rapport, asking directly about suicidal ideation, assessing the dimensions of ideation, evaluating plan and access to means, identifying risk and protective factors — while adapting both the content and the clinical style to the specific phenomenology and communication patterns of older adult clients.</p>

<p>The Columbia Suicide Severity Rating Scale (C-SSRS) provides a validated, structured framework for assessing suicidal ideation and behavior that has been tested across diverse populations including older adults. The C-SSRS distinguishes passive ideation (wishes to be dead, without intent to act), active ideation with and without plan and intent, and preparatory behavior — a clinically meaningful hierarchy that informs both risk stratification and intervention planning. Regular administration of the C-SSRS, integrated into clinical sessions rather than reserved for apparent crises, normalizes the conversation about suicidal ideation and provides longitudinal tracking data that supports clinical decision-making.</p>

<p>Direct questioning is essential and non-negotiable. The evidence consistently demonstrates that asking about suicidal ideation does not plant the idea or increase risk — and that clinicians who avoid direct questioning out of discomfort or the fear of "putting ideas in their head" are providing inadequate clinical care. For older adult clients who may not spontaneously disclose suicidal thinking, direct questions — "Have you had thoughts of ending your life?" and "Have you thought about how you might do that?" — are the clinical gateway to accurate assessment.</p>

<p>The clinical interview should assess: the frequency, intensity, and duration of suicidal ideation; the presence and specificity of a plan; the client's access to means specified in any plan; prior history of suicidal ideation and attempts; current level of depression, hopelessness, and social isolation; the presence of the perceived burdensomeness and thwarted belongingness themes; current alcohol and substance use; and the client's experience of reasons for living and any remaining sources of meaning and connection.</p>

<p>Hopelessness deserves specific attention as a predictor of geriatric suicide that may be clinically distinct from depression itself. The Beck Hopelessness Scale provides a validated measure of hopeless thinking that has demonstrated predictive validity for suicide across multiple studies. An older adult who expresses hopelessness about the future — "There's nothing to look forward to," "Things will only get worse," "I've had my time" — is communicating suicidal risk even in the absence of explicit ideation.</p>

<h2>Safety Planning with Older Adults: Adapting the Framework</h2>
<p>The Safety Planning Intervention (SPI), developed by Stanley and Brown, provides a structured, evidence-based approach to collaboratively developing a personalized crisis management plan with clients at risk for suicide. Research on the SPI demonstrates significant reductions in suicidal ideation and behavior and superior outcomes compared to "no-harm contracts" — which lack both theoretical basis and empirical support.</p>

<p>Adapting the Safety Planning Intervention for older adult clients requires attention to the specific clinical features of this population. Several standard components require modification or supplementation.</p>

<p><strong>Warning signs</strong> in the safety plan should reflect the geriatric-specific warning signs identified above, not the general adult warning signs that may be less salient for the individual older adult client. Working collaboratively with the client to identify their personal warning signs — "For you, the first sign that you're heading toward crisis is usually..." — produces a more clinically useful plan than one populated with generic warning signs.</p>

<p><strong>Coping strategies</strong> must be realistically calibrated to the client's physical capacity and social circumstances. A safety plan that lists "go for a walk" for a client who is homebound, or "call a friend" for a client who has outlived most of their peers and has no close friends, is clinically inadequate. The development of coping strategies must begin from an honest assessment of what is actually available and accessible to this particular client in this particular life situation.</p>

<p><strong>Social contacts</strong> are the cornerstone of safety planning — the plan's value depends on the client having someone to contact during a crisis. With older adult clients who are socially isolated, this may require explicit work to expand or maintain social connections as a therapeutic goal in its own right, not merely a component of crisis planning. Identifying at least one person the client can contact — including crisis line numbers — must include confirmation that the client actually has the capacity and willingness to make the contact.</p>

<p><strong>Means restriction</strong> is particularly critical with older adult clients and requires direct, clinical conversation about firearms access. The clinician who does not ask about gun ownership and does not engage in active means restriction counseling with an older adult expressing suicidal ideation is providing demonstrably inadequate care. Research on means restriction consistently demonstrates that reducing access to lethal means — particularly firearms — reduces suicide deaths, because a significant proportion of suicidal crises are time-limited and the presence or absence of means during the crisis window determines survival.</p>

<h2>Firearms Counseling: The Clinical Conversation About Guns</h2>
<p>Many clinicians report discomfort discussing firearms with clients — attributing the discomfort to concern about alienating clients, uncertainty about what to say, or personal unfamiliarity with gun culture. This discomfort, however understandable, does not relieve the clinical obligation: for older adult clients at elevated suicide risk, means restriction counseling about firearms is a clinical essential.</p>

<p>Effective firearms counseling begins with direct inquiry: "Do you have guns in your home?" If the answer is yes: "When we think about keeping you safe, we need to talk about the guns. Who could hold onto them for you temporarily?" The framing — temporary, not permanent; protective, not punitive; collaborative, not coercive — is important for maintaining the therapeutic alliance while achieving the safety goal. The goal is not to confiscate firearms permanently but to create distance between the client and lethal means during the period of elevated risk.</p>

<p>Specific options for temporary means restriction include: having a trusted family member or friend secure the firearms outside the home; using a gun safe with a combination held by someone other than the client; temporary transfer to a licensed firearms dealer for storage; and, where available, use of state-specific "yellow flag" or "red flag" laws that allow temporary firearm removal with judicial oversight. Clinicians should be familiar with the firearms storage options available in their community and should document the means restriction conversation and any agreements reached.</p>

<h2>Protective Factors: Tending the Root System</h2>
<p>Effective geriatric suicide risk management is not only about reducing risk factors — it is equally about identifying and strengthening the protective factors that sustain the will to live in the face of genuine losses and limitations. Research on resilience in older adults identifies several consistently protective factors that clinical intervention can support.</p>

<p><strong>Social connection and belonging</strong> are the most robust protective factors against geriatric suicide. The therapeutic relationship itself is not merely a vehicle for other interventions — it is a direct protective factor that provides the experience of meaningful connection to a person who may have few others. Therapeutic work that expands social connection — facilitating re-engagement with community, faith, family, or interest-based activities — directly addresses the thwarted belongingness that drives suicidal desire.</p>

<p><strong>Reasons for living</strong> — specific, personally meaningful reasons to remain alive — are a clinically powerful resource that explicit clinical attention can strengthen. What does this client live for? Who needs them? What do they still hope to experience, contribute, or witness? Developing and maintaining a personalized reasons-for-living list, adapted from the Reasons for Living Inventory developed by Marsha Linehan, provides both a crisis management resource and a clinical vehicle for exploring meaning and purpose.</p>

<p><strong>Religious and spiritual engagement</strong> is a significant protective factor in older adult populations, buffering against suicidal ideation through multiple pathways — providing social connection, a framework for meaning-making, religious sanctions against suicide, and ritual practices that structure time and connect individuals to community. Clinicians should assess and work within clients' religious and spiritual frameworks rather than treating spirituality as outside the clinical domain.</p>

<p><strong>Sense of purpose and contribution</strong> — the belief that one's existence has value and meaning — directly counteracts the perceived burdensomeness that drives suicidal desire. Therapeutic work that helps older adult clients identify ways in which their presence benefits others — as parents, grandparents, friends, community members, knowledge-holders, and simply as people who are loved — can shift the narrative from burden to contribution in ways that are both clinically meaningful and empirically supported as protective.</p>

<h2>Ethical and Legal Dimensions: Documentation and Duty</h2>
<p>Clinical work with suicidal geriatric clients generates specific ethical and legal obligations that must be managed with care and competence. Documentation of suicide risk assessments — including the clinical reasoning behind the assessed level of risk, the specific risk and protective factors identified, the safety plan developed, and any means restriction discussions and agreements — is both a clinical necessity and a legal protection. A risk assessment that is clinically rigorous but poorly documented provides inadequate legal protection and may result in failure to communicate critical clinical information across providers.</p>

<p>Duty-to-warn and duty-to-protect obligations vary by state but generally require clinicians to take reasonable steps to protect identifiable third parties from serious, imminent harm. In the context of geriatric suicide, these obligations are most commonly relevant when a client's suicidal ideation involves specific intent to harm a spouse, caregiver, or other identified individual as part of a "dyadic" suicide plan — a pattern that is more common in older adults than in younger populations and that requires immediate clinical action.</p>

<p>Hospitalization, when clinically indicated, should be considered carefully and as part of a collaborative clinical plan rather than as a punitive or reflexive response to suicidal ideation. For older adults, hospitalization carries specific risks — including delirium, functional decline, iatrogenic harm, and the disruption of established care relationships — that must be weighed against the protective benefits. The least restrictive clinically appropriate level of care is the ethical standard, and intensive outpatient options should be exhausted before inpatient placement when the clinical picture permits.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 2",
          showExplanations: true,
          questions: [
            {
              question: "Which evidence-based instrument is MOST appropriate for structured suicide risk assessment across clinical settings, including with older adult clients?",
              type: "multiple_choice",
              options: [
                "The Beck Depression Inventory (BDI-II)",
                "The Geriatric Depression Scale (GDS)",
                "The Columbia Suicide Severity Rating Scale (C-SSRS)",
                "The Montreal Cognitive Assessment (MoCA)"
              ],
              correctAnswer: 2,
              explanation: "The Columbia Suicide Severity Rating Scale (C-SSRS) provides a validated, structured framework for assessing suicidal ideation and behavior, distinguishing passive ideation from active ideation with and without plan and intent, and tracking preparatory behavior. It has been tested across diverse populations and age groups and provides clinically meaningful stratification that informs intervention planning."
            },
            {
              question: "The MOST evidence-based framing for firearms counseling with an older adult at elevated suicide risk is:",
              type: "multiple_choice",
              options: [
                "Permanent gun confiscation, which is the only intervention with demonstrated efficacy",
                "Avoidance of the topic to preserve therapeutic alliance with gun-owning clients",
                "Temporary, protective, collaborative means restriction — asking who could hold onto the firearms during the period of elevated risk",
                "Referral to a firearms educator to discuss safe storage options"
              ],
              correctAnswer: 2,
              explanation: "Effective firearms counseling frames means restriction as temporary and protective rather than permanent and punitive. Options include having a trusted person secure firearms outside the home, using a safe with a combination held by someone else, or temporary storage with a licensed dealer. The framing preserves the therapeutic alliance while achieving the safety goal of creating distance between the client and lethal means during the risk period."
            },
            {
              question: "Which of the following is the STRONGEST protective factor against geriatric suicide identified in the research literature?",
              type: "multiple_choice",
              options: [
                "Financial security and stable retirement income",
                "Physical health and absence of chronic disease",
                "Social connection and a subjective sense of belonging",
                "Cognitive integrity and absence of neurocognitive impairment"
              ],
              correctAnswer: 2,
              explanation: "Social connection and a subjective sense of belonging — directly counteracting the thwarted belongingness identified as a core driver of suicidal desire — is the most robustly documented protective factor against geriatric suicide. The therapeutic relationship itself provides meaningful protective connection, while clinical work that expands social networks addresses the risk at its source."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Preparing for the Final Assessment</h2>
<p>Review the key clinical content from both modules before completing the final assessment: the demographic epidemiology of geriatric suicide, the specific risk factors for older adults including depression, physical illness, loss of independence, bereavement, social isolation, and firearm access; warning signs specific to older adult presentations; the Columbia Suicide Severity Rating Scale and structured risk assessment; safety planning adaptations for older adults; firearms counseling; and the protective factors that clinical intervention can strengthen. An 80% score is required for CE credit across 15 questions. Three attempts are permitted.</p>`
        },
        {
          type: "quiz",
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          shuffleQuestions: true,
          showExplanations: false,
          title: "Final Assessment — CR-612: Still Standing",
          questions: [
            { question: "Adults over 65 account for approximately what percentage of all suicide deaths in the United States?", type: "multiple_choice", options: ["5 percent", "18 percent", "35 percent", "50 percent"], correctAnswer: 1, explanation: "Despite representing approximately 13% of the population, adults over 65 account for approximately 18% of all suicide deaths — reflecting the elevated suicide rate in this demographic." },
            { question: "Which demographic group has the highest age-specific suicide rate in the United States?", type: "multiple_choice", options: ["Adolescent females aged 15 to 19", "Men aged 45 to 54", "Men over age 85", "Women over age 75"], correctAnswer: 2, explanation: "Men over 85 have the highest age-specific suicide rate of any demographic group — approximately 55 per 100,000 — reflecting the convergence of depression, physical illness, isolation, and access to lethal means in this population." },
            { question: "The case fatality rate for firearms as a suicide method exceeds:", type: "multiple_choice", options: ["30 percent", "55 percent", "70 percent", "85 percent"], correctAnswer: 3, explanation: "Firearms have a case fatality rate exceeding 85% — the highest of any suicide method. This is clinically critical for older adult populations, who have high rates of gun ownership and low rates of non-lethal attempts, making means restriction an urgent clinical priority." },
            { question: "The 'perceived burdensomeness' construct from Joiner's Interpersonal Theory of Suicide is particularly relevant in geriatric practice because:", type: "multiple_choice", options: ["Older adults exaggerate their dependence as a way to seek attention", "Many older adults genuinely experience increasing dependence and may believe their existence imposes unacceptable costs on family members", "Older adults are legally less responsible for their own care than younger adults", "The burden construct applies only to caregivers, not to care recipients"], correctAnswer: 1, explanation: "Perceived burdensomeness — the subjective belief that one's existence imposes unacceptable costs on others — is a specific, empirically supported driver of suicidal desire. In older adults, this belief often coexists with genuine increasing dependence, making it both clinically powerful and difficult to challenge without first engaging the reality it partially reflects." },
            { question: "A no-harm contract differs from a Safety Planning Intervention (SPI) primarily in that:", type: "multiple_choice", options: ["A no-harm contract is legally binding while an SPI is clinical in nature", "An SPI provides a detailed collaborative crisis plan with specific coping strategies, contacts, and means restriction; a no-harm contract lacks both theoretical basis and empirical support for suicide prevention", "A no-harm contract involves family members while an SPI is an individual intervention", "An SPI is appropriate only for inpatient settings"], correctAnswer: 1, explanation: "The Safety Planning Intervention is evidence-based and provides a personalized, collaborative crisis management plan including warning signs, coping strategies, social contacts, and means restriction. No-harm contracts have no empirical support for reducing suicide and may create false reassurance in both clinician and client." },
            { question: "When an older adult client who has been suicidal suddenly appears calm and says they have 'made peace with things,' the clinician should:", type: "multiple_choice", options: ["Accept this as positive progress and reduce the frequency of sessions", "Document the improvement and continue current treatment", "Conduct an immediate direct suicide risk assessment, as the sudden calm may reflect a decision to act that has resolved the distress of ambivalence", "Refer to psychiatry for medication evaluation, as the improvement may reflect a hypomanic state"], correctAnswer: 2, explanation: "Sudden calm in a previously distressed suicidal client is a recognized warning sign. The resolution of visible distress may reflect a decision to act that has temporarily eliminated the painful ambivalence of suicidal ideation — not genuine clinical improvement. Immediate, direct assessment of suicidal ideation and intent is required." },
            { question: "Which of the following approaches to asking about firearms is MOST likely to preserve therapeutic alliance while achieving means restriction goals?", type: "multiple_choice", options: ["Explaining that you are legally required to report firearms possession to law enforcement", "Framing temporary means restriction as a protective measure — asking collaboratively who could hold onto the guns temporarily during the period of elevated risk", "Avoiding the topic and addressing means restriction only if the client spontaneously raises it", "Requesting that the client permanently surrender all firearms as a condition of continued treatment"], correctAnswer: 1, explanation: "Effective means restriction counseling frames temporary storage as protective and collaborative, not punitive or permanent. This framing maintains the therapeutic alliance while achieving the critical safety goal. Direct inquiry about firearms must occur with all older adult clients expressing suicidal ideation." },
            { question: "The Beck Hopelessness Scale assesses hopeless thinking, which is clinically significant in geriatric suicide risk assessment because:", type: "multiple_choice", options: ["Hopelessness is a trait measure that indicates the client's long-term personality characteristics", "Hopelessness has demonstrated predictive validity for suicide risk that may be independent of the severity of depressive symptoms", "Hopelessness is primarily relevant in younger adult populations and less predictive in older adults", "Hopelessness indicates that the client lacks capacity for safety planning"], correctAnswer: 1, explanation: "Hopelessness — the expectation that things will not improve — has robust predictive validity for suicide risk across multiple studies. In older adults, hopelessness may reflect both a cognitive style and the real accumulation of losses, making it a clinically important target for both assessment and intervention." },
            { question: "Religious and spiritual engagement protects against geriatric suicide through which mechanisms?", type: "multiple_choice", options: ["By providing access to pharmacological support through faith-based healthcare ministries", "By providing social connection, meaning-making frameworks, religious sanctions against suicide, and ritualized community engagement", "By reducing the older adult's awareness of their physical limitations through distraction", "By ensuring that older adults have legal documentation of end-of-life preferences"], correctAnswer: 1, explanation: "Religious and spiritual engagement is a well-documented protective factor against geriatric suicide, operating through multiple pathways including social connection, frameworks for meaning-making and suffering, explicit religious prohibitions against suicide, and the community structure provided by faith practice." },
            { question: "Clinicians avoid asking older adult clients about suicidal ideation because they fear 'planting the idea.' What does the evidence say about this concern?", type: "multiple_choice", options: ["The concern is valid; research shows that asking about suicide increases risk in older adults more than in younger populations", "The concern is clinically important and should guide how directly clinicians ask about suicide", "The concern is not supported by evidence; direct inquiry about suicidal ideation does not increase risk and is clinically essential for accurate assessment", "Research is mixed, so clinicians should follow their clinical judgment about when to ask"], correctAnswer: 2, explanation: "The evidence consistently demonstrates that asking directly about suicidal ideation does not plant the idea or increase risk. Clinicians who avoid direct questioning out of this unfounded concern provide inadequate care. Direct inquiry is the clinical gateway to accurate risk assessment and appropriate intervention." },
            { question: "For older adult clients, hospitalization for suicidal ideation should be considered:", type: "multiple_choice", options: ["Automatically whenever suicidal ideation is expressed, regardless of severity or circumstances", "Only when mandated by law enforcement", "Thoughtfully as part of a clinical plan, considering the specific risks of hospitalization for older adults — including delirium, functional decline, and disruption of care relationships — weighed against protective benefits", "Rarely, as older adults rarely require acute psychiatric care"], correctAnswer: 2, explanation: "Hospitalization carries specific risks for older adults including delirium, functional decline, and disruption of established care relationships. The ethical standard is the least restrictive clinically appropriate level of care. Intensive outpatient options should be considered before inpatient placement when the clinical picture permits." },
            { question: "The first year following spousal bereavement represents a period of elevated suicide risk, particularly for:", type: "multiple_choice", options: ["Older women who had primary responsibility for household management", "Older men who had few social connections outside the marital relationship", "Adults in the 50 to 65 age range who are newly widowed", "Older adults of any gender who have dependent children"], correctAnswer: 1, explanation: "Older bereaved men — particularly those who had narrow social networks centered on the marital relationship — are at particularly elevated suicide risk in the first year of bereavement. Men's socialization toward self-reliance and emotional privatization means they are less likely to seek support and more likely to experience profound isolation following spousal loss." },
            { question: "Documenting suicide risk assessments in clinical records serves which of the following functions?", type: "multiple_choice", options: ["It eliminates the clinician's legal liability if a client dies by suicide", "It provides a legally protected record of clinical reasoning, risk and protective factors identified, safety planning, and means restriction discussions — supporting both continuity of care and professional accountability", "It is only required when the client poses imminent risk and a safety plan has been developed", "It transfers responsibility for the client's safety to the receiving clinical team"], correctAnswer: 1, explanation: "Thorough documentation of suicide risk assessments serves multiple clinical and legal functions: it records the clinical reasoning supporting risk stratification, facilitates communication across providers, supports continuity of care, and provides a record of due diligence that is essential in the event of clinical review or legal proceedings. Documentation does not eliminate liability but demonstrates appropriate standard of care." },
            { question: "Which element of the Safety Planning Intervention MOST commonly requires modification when working with isolated older adult clients?", type: "multiple_choice", options: ["Warning signs, which are the same for all populations", "The crisis line phone numbers, which differ for older adults", "Social contacts and coping strategies, which must be realistically calibrated to the client's actual social circumstances and physical capacity", "The client's signature, which may require family member co-signature for older adults"], correctAnswer: 2, explanation: "Safety planning is only as effective as its realism. Coping strategies that require physical capacity the client doesn't have and social contacts that don't exist are clinically useless. With isolated older adult clients, therapeutic work to expand social contacts may be required as a prerequisite to effective safety planning." },
            { question: "The concept of 'reasons for living' is therapeutically relevant in geriatric suicide risk management because:", type: "multiple_choice", options: ["Reasons for living legally obligate clients not to act on suicidal ideation", "Identifying specific, personally meaningful reasons to remain alive counteracts perceived burdensomeness and thwarted belongingness, and provides a crisis management resource", "Reasons for living are relevant only for younger adults whose future-orientation is stronger", "Documenting reasons for living transfers clinical liability to the client"], correctAnswer: 1, explanation: "The Reasons for Living Inventory and related clinical tools help older adult clients identify specific, personally meaningful reasons to remain alive — directly counteracting the perceived burdensomeness and thwarted belongingness that drive suicidal desire. This material also provides a crisis management resource and a vehicle for exploring meaning and purpose in the therapeutic relationship." }
          ]
        }
      ]
    }
  ]
};

const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('\n' + '═'.repeat(60));
  console.log('  SEEDING CR-612: Still Standing');
  console.log('═'.repeat(60));
  const existing = await Course.findOne({ slug: COURSE.slug });
  if (existing) { await Course.findOneAndReplace({ slug: COURSE.slug }, COURSE, { new: true }); console.log('✅ Updated'); }
  else { await Course.create(COURSE); console.log('✅ Created'); }
  console.log(`   ${COURSE.courseCode} | ${COURSE.ceHours} CE Hours | ${COURSE.modules.length} Modules`);
  await mongoose.disconnect();
}
seed().catch(err => { console.error('❌', err); process.exit(1); });
