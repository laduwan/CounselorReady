/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * seedGeriatricSeries_CR610.js
 * CR-610: "Unretiring the Self" — Identity, Purpose & Depression in Later Life
 * CE Hours: 3.0 | NBCC ACEP Provider #7760
 * Run: node src/scripts/seedGeriatricSeries_CR610.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

const COURSE = {
  title: "Unretiring the Self: Identity, Purpose, and Depression in Later Life",
  slug: "unretiring-the-self-identity-purpose-depression-older-adults",
  courseCode: "CR-610",
  description: "Think of a beloved public library: the books haven't changed, the knowledge is all still there — but when the doors close, something vital is lost. For many older adults, retirement, bereavement, and physical decline create exactly this experience: a rich interior world suddenly shuttered from the outside. This course teaches counselors to reopen those doors. Through evidence-based frameworks, cultural considerations, and practical clinical tools, participants will learn to assess and treat depression in geriatric clients, restore identity and purpose, and help older adults write new chapters rather than simply wait for the story to end.",
  ceHours: 3,
  ceuHours: 3,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  category: "Clinical",
  ceCategory: "Clinical",
  contentArea: "Geriatric Mental Health",
  level: "Intermediate",
  accessType: 'subscription',
  price: 54.99,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Licensed Mental Health Counselors (LMHC)",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Counselors working in geriatric, hospital, or community mental health settings"
  ],
  objectives: [
    "Distinguish normative aging processes from clinically significant depression in geriatric clients using validated screening instruments",
    "Apply identity-based theoretical frameworks, including role theory and Erik Erikson's integrity vs. despair stage, to conceptualize late-life psychological distress",
    "Implement at least three evidence-based intervention strategies — including behavioral activation, life review therapy, and meaning-centered approaches — for older adults presenting with depression and loss of purpose",
    "Identify cultural, racial, and socioeconomic factors that shape depression presentation, help-seeking behavior, and treatment engagement among diverse older adult populations",
    "Develop individualized treatment plans that address the intersecting domains of physical health, social connection, identity loss, and existential meaning in geriatric clients"
  ],
  tags: ["geriatric", "older adults", "depression", "identity", "retirement", "life review", "aging", "behavioral activation", "meaning-making"],
  references: [
    { title: "Handbook of the Psychology of Aging (8th ed.)", author: "Birren, J. E., & Schaie, K. W. (Eds.)", year: 2016, source: "Academic Press" },
    { title: "Late-life depression: Evidence base for treatment", author: "Alexopoulos, G. S.", year: 2019, source: "Dialogues in Clinical Neuroscience, 21(2), 135–145" },
    { title: "Life review therapy: A treatment manual", author: "Haight, B. K., & Webster, J. D.", year: 2002, source: "Brunner-Routledge" },
    { title: "Behavioral activation for depression: A clinician's guide", author: "Martell, C. R., Addis, M. E., & Jacobson, N. S.", year: 2001, source: "Guilford Press" },
    { title: "Meaning-centered psychotherapy for older adults", author: "Breitbart, W., & Poppito, S.", year: 2014, source: "Oxford University Press" },
    { title: "The PHQ-9: Validity of a brief depression severity measure", author: "Kroenke, K., Spitzer, R. L., & Williams, J. B.", year: 2001, source: "Journal of General Internal Medicine, 16(9), 606–613" },
    { title: "Geriatric Depression Scale: Recent evidence and development of a shorter version", author: "Sheikh, J. I., & Yesavage, J. A.", year: 1986, source: "Clinical Gerontologist, 5(1-2), 165–173" },
    { title: "Depression in older adults", author: "Fiske, A., Wetherell, J. L., & Gatz, M.", year: 2009, source: "Annual Review of Clinical Psychology, 5, 363–389" }
  ],
  assessment: { passingScore: 80, maxAttempts: 3 },
  modules: [
    {
      title: "Module 1: The Closed Library — Understanding Late-Life Identity Loss and Depression",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "The Closed Library",
          subtitle: "Understanding Late-Life Identity Loss and Depression"
        },
        {
          type: "text",
          content: `<h2>When the Doors Close: A Framework for Late-Life Depression</h2>
<p>Imagine a public library that has served a community for fifty years. The card catalog holds tens of thousands of entries. Every shelf is full. The reference librarian knows where everything is — every cross-reference, every obscure volume, every connection between disparate ideas. The building is structurally sound. The books haven't changed. And yet, when the funding dries up and the doors are locked, something irreplaceable is lost to the community — not because the knowledge disappeared, but because access was severed.</p>

<p>This metaphor captures what happens for many older adults when they encounter the cascade of losses that can accompany aging: retirement from a career that organized their sense of self, the death of a spouse or lifelong friends, the narrowing of physical capacity, the gradual erosion of social roles. The knowledge, the history, the relational depth — it's all still there. But the pathways through which that richness engaged with the world have been systematically reduced. The result, for a clinically significant percentage of older adults, is depression — not a "normal" response to aging, but a treatable condition that too often goes unrecognized and unaddressed.</p>

<p>This course is designed to help you reopen those doors. As a mental health professional working with or likely to work with geriatric clients, you operate at a unique intersection of clinical expertise and human companionship. You have the opportunity to recognize what others — including the older adult themselves — may dismiss as "just getting old." You have evidence-based tools that work. And perhaps most importantly, you have the ability to sit with an older adult in the fullness of their history and help them discover that the story isn't over — it's simply entering a new chapter that requires a different kind of courage.</p>

<h2>Prevalence and the Recognition Problem</h2>
<p>The epidemiology of late-life depression tells a story of a population that is both large and underserved. Clinically significant depressive symptoms affect approximately 15 to 20 percent of community-dwelling older adults, rising to 25 to 40 percent among those in nursing homes and long-term care settings (Fiske, Wetherell, & Gatz, 2009). Major Depressive Disorder affects roughly 1 to 4 percent of older adults in the community, while minor depression and dysthymia affect significantly more. When we account for the population of adults over 65 — currently approximately 55 million in the United States and projected to exceed 80 million by 2040 — these percentages represent millions of people living with untreated or undertreated depression.</p>

<p>Despite these numbers, late-life depression is diagnosed and treated at lower rates than depression in younger populations. Several converging factors explain this recognition problem. First, older adults themselves are less likely to spontaneously report depressive symptoms, particularly subjective sadness or emotional distress. Shaped by cohorts that valued stoicism, self-reliance, and emotional privacy — especially for men — many older adults interpret and communicate their distress through somatic channels. The presenting complaint is fatigue, not sadness. It is appetite loss, not anhedonia. It is "I just don't have the energy I used to" rather than "I feel hopeless." A clinician who relies on the emotional vocabulary of depression as expressed by younger adults will miss these presentations repeatedly.</p>

<p>Second, primary care providers — who are most older adults' first and often only clinical contact — routinely under-screen for depression in geriatric patients. When depression is identified, it is frequently under-treated, with medication-only approaches neglecting the psychosocial dimensions that are often central to late-life depression. The integration of mental health professionals into primary care settings represents a significant opportunity, but remains incompletely realized in most health systems.</p>

<p>Third — and perhaps most damaging — is the ageism that pervades even clinical settings. The implicit assumption that sadness, withdrawal, and loss of interest are "natural" in old age creates a diagnostic filter that normalizes pathology. When a 35-year-old presents with pervasive loss of interest, hopelessness, and sleep disturbance, the clinician thinks depression. When a 78-year-old presents with the same symptoms, the clinician — or the older adult, or their family — may think "well, that's just getting old." This internalized and institutionalized ageism is, arguably, the single greatest barrier to adequate geriatric mental health care.</p>

<h2>What Late-Life Depression Actually Looks Like</h2>
<p>Understanding the clinical presentation of depression in older adults requires appreciation of how the phenomenology of the disorder shifts with age. The DSM-5 criteria remain technically applicable, but their expression changes in ways that demand clinical flexibility and geriatric-specific knowledge.</p>

<p><strong>Somatic prominence:</strong> As noted, older adults more frequently lead with physical complaints when experiencing depression. Chronic pain, gastrointestinal symptoms, fatigue, sleep disturbance, and cognitive difficulties may all reflect underlying depression. The relationship between physical health and depression in older adults is bidirectional and complex — chronic illness contributes to depression, and depression worsens chronic illness outcomes. Disentangling primary depression from illness-related mood changes requires careful clinical judgment.</p>

<p><strong>Irritability and anxiety as predominant features:</strong> Rather than presenting with sad affect, many depressed older adults present with irritability, agitation, worry, or anxiety. The previously mild-mannered client becomes difficult to please. The normally sociable client becomes suspicious or accusatory. These presentations are often misinterpreted as personality change, early dementia, or simple "grumpiness" — all of which delay appropriate treatment.</p>

<p><strong>Cognitive symptoms:</strong> Late-life depression often presents with significant cognitive complaints — difficulty concentrating, memory lapses, slowed processing, executive dysfunction. The clinical challenge is distinguishing depressive pseudodementia from true neurocognitive disorders such as Alzheimer's disease, particularly in older adults who may have both. In general, cognitive symptoms of depression tend to be more fluctuating, more responsive to attention and effort, and more closely tied temporally to the depressive episode than those of primary neurocognitive disorders. A thorough neuropsychological evaluation is often warranted when the picture is unclear.</p>

<p><strong>Psychomotor changes:</strong> Psychomotor retardation — slowed movements, delayed speech, reduced spontaneous activity — is more common in late-life depression than in younger-onset presentations. This can be confused with the natural slowing of advanced age or attributed to medical conditions. Psychomotor agitation — visible restlessness, hand-wringing, inability to sit still — is also common, particularly in anxious or psychotic variants of late-life depression.</p>

<p><strong>Psychotic features:</strong> Depression with psychotic features occurs at higher rates in older adults than in younger populations. Nihilistic delusions (belief that one's organs are failing, that one has caused terrible harm, that one's family has been destroyed), somatic delusions, and persecutory beliefs can accompany severe late-life depression. Psychotic depression is a psychiatric emergency requiring intensive treatment and should not be dismissed as simple cognitive decline.</p>

<h2>The Identity Architecture of Late Life</h2>
<p>To effectively treat depression in older adults, we must understand what depression is actually disrupting. In middle adulthood, identity is typically organized around multiple, mutually reinforcing roles: professional identity, spousal or partner identity, parental identity, community memberships, physical self-concept. These roles provide what sociologist Peter Berger called "plausibility structures" — the social contexts that make our sense of who we are feel real, stable, and confirmed by others.</p>

<p>Late life systematically dismantles many of these structures. Retirement eliminates professional identity and, with it, the daily structure, social network, sense of competence, and purpose that work provides. For clients whose careers were central to their identity — physicians, attorneys, military officers, teachers — the transition from defined role to undefined "retiree" can be profoundly destabilizing. One client described it this way: "For forty years, when I woke up in the morning, I knew exactly who I was and what I was for. Now I wake up and I'm just... this. A person with a past."</p>

<p>Erik Erikson's eighth stage of psychosocial development — integrity vs. despair — provides a foundational framework for understanding this territory. Erikson proposed that the central psychological task of late life is the integration of one's life narrative into a coherent whole that can be accepted, even embraced, as the life one actually lived. Successful navigation yields integrity — a sense of meaning, acceptance, and willingness to pass the baton to the next generation. Failed navigation yields despair — a sense that life was wasted, that the choices made were wrong, that it is too late to change, and that death approaches with the account still unsettled.</p>

<p>What Erikson's framework helps us see is that late-life depression is often, at its core, an existential crisis. It is not simply about neurochemistry or loss events in isolation — it is about the terrifying possibility that the self that one spent a lifetime constructing was contingent on roles and relationships that have now dissolved. When the library closes, the question isn't just "what do I do now?" but "who am I now?" — and for many older adults, the answer feels frighteningly empty.</p>

<h2>Risk Factors and Protective Factors: A Clinical Map</h2>
<p>A comprehensive understanding of late-life depression requires familiarity with both risk factors that clinicians should assess and protective factors they should actively cultivate. The research literature identifies a relatively consistent set of both.</p>

<p><strong>Risk factors for late-life depression include:</strong> history of depression at any life stage, chronic physical illness (particularly cardiovascular disease, stroke, diabetes, Parkinson's disease, and chronic pain), functional disability and loss of independence, recent bereavement, social isolation and loneliness, cognitive impairment, caregiving burden, financial strain, institutional placement, sleep disturbance, and a history of trauma including childhood adversity and combat exposure. For older adults who belong to marginalized communities — racial and ethnic minorities, LGBTQ+ individuals, immigrants, those with low socioeconomic status — structural disadvantage compounds individual risk factors in ways that are both additive and multiplicative.</p>

<p><strong>Protective factors include:</strong> strong social support network, religious and spiritual engagement, sense of purpose and meaning, physical activity and mobility, mastery beliefs (the conviction that one's efforts affect outcomes), psychological flexibility, engagement in valued activities, financial security, and access to quality healthcare. The clinical implication is clear: effective treatment of late-life depression is not merely about symptom reduction, but about actively building and strengthening the protective architecture that sustains wellbeing in the face of the genuine losses of aging.</p>

<h2>Assessment: Opening the Diagnostic Conversation</h2>
<p>Given the somatic presentation and communication patterns discussed above, assessment of depression in older adults requires a specific set of skills and tools. The most important of these is the clinical relationship itself — older adults, particularly those shaped by stoic cultural norms, are unlikely to disclose emotional distress to a clinician they do not trust. Building sufficient rapport to hear the truth of a client's experience requires time, patience, genuine curiosity, and the willingness to follow tangents that may initially appear irrelevant.</p>

<p>Beyond the therapeutic relationship, validated screening tools are essential. The Geriatric Depression Scale (GDS) was developed specifically for older adults and avoids the somatic items that can produce false positives in medically complex populations. The 30-item GDS and its validated 15-item short form use yes/no responses that are accessible for clients with mild cognitive impairment. A score of 5 or above on the GDS-15 warrants further clinical evaluation.</p>

<p>The Patient Health Questionnaire-9 (PHQ-9) is more commonly used in integrated primary care settings and provides a dimensional assessment of symptom severity using DSM-aligned criteria. While the somatic items of the PHQ-9 can complicate interpretation in older adults with significant physical illness, the PHQ-9 remains a clinically useful tool when interpreted in context.</p>

<p>The Cornell Scale for Depression in Dementia (CSDD) is specifically designed for assessment of depression in individuals with neurocognitive disorders, where self-report measures are unreliable. It integrates clinician observation with collateral history from caregivers to construct a comprehensive picture of depressive symptoms.</p>

<p>Beyond formal screening tools, a thorough clinical interview should explore: current functioning across social, occupational, and self-care domains; recent and cumulative losses; sleep patterns and appetite changes; cognitive status; history of depression and treatment response; current medications (many commonly prescribed medications have depressive side effects); substance use; and spiritual or existential concerns. The question "What do you live for?" — asked gently and with genuine interest — can open entire dimensions of clinical conversation that structured assessments miss entirely.</p>`
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 1",
          showExplanations: true,
          questions: [
            {
              question: "A 74-year-old retired physician presents to your practice complaining of fatigue, appetite loss, and difficulty concentrating. He denies feeling 'sad' and attributes his symptoms to 'just getting old.' What is the most clinically appropriate response?",
              type: "multipleChoice",
              options: [
              { text: "Accept his explanation and focus on psychoeducation about healthy aging", isCorrect: false },
              { text: "Administer a validated geriatric depression screening tool and conduct a thorough clinical interview exploring somatic symptoms as possible depressive equivalents", isCorrect: true },
              { text: "Refer immediately to his primary care physician, as these are exclusively medical concerns", isCorrect: false },
              { text: "Begin supportive counseling without formal assessment, as older adults often resist diagnostic labels", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Late-life depression frequently presents with somatic symptoms rather than emotional distress, particularly in older adult men and in cohorts socialized toward stoicism. Fatigue, appetite change, and cognitive difficulties are common presentations of depression in older adults. The clinical response is to use a validated screening tool (such as the GDS-15 or PHQ-9) and conduct a thorough clinical interview, not to dismiss symptoms as age-related without assessment."
            },
            {
              question: "According to Erikson's psychosocial theory, the central developmental task of late life involves:",
              type: "multipleChoice",
              options: [
              { text: "Autonomy vs. shame and doubt, focused on developing independence from caregivers", isCorrect: false },
              { text: "Generativity vs. stagnation, focused on contributing to future generations", isCorrect: false },
              { text: "Integrity vs. despair, focused on accepting one", isCorrect: true },
              { text: ",
                ", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "Erikson's eighth stage, integrity vs. despair, is the central psychosocial task of late life. Successful navigation yields a sense of meaning and acceptance of one's lived experience. Failed navigation yields despair — the sense that life was wasted and that it is too late to find meaning. This framework is particularly useful for understanding the existential dimensions of late-life depression."
            },
            {
              question: "Which screening tool was specifically developed for older adult populations and is particularly useful for clients with comorbid medical conditions because it minimizes somatic items?",
              type: "multipleChoice",
              options: [
              { text: "Beck Depression Inventory-II (BDI-II)", isCorrect: false },
              { text: "Patient Health Questionnaire-9 (PHQ-9)", isCorrect: false },
              { text: "Geriatric Depression Scale (GDS)", isCorrect: true },
              { text: "Hamilton Rating Scale for Depression (HAM-D)", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "The Geriatric Depression Scale (GDS) was designed specifically for older adults. Its yes/no response format is accessible for clients with mild cognitive impairment, and it avoids the somatic items (appetite, sleep, fatigue) that can produce false positives when older adults have comorbid physical health conditions. The GDS-15 (short form) is widely used in clinical and research settings."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Cultural Dimensions of Late-Life Depression</h2>
<p>Depression in older adults does not occur in a cultural vacuum, and culturally competent care requires attention to how age, culture, race, ethnicity, gender, religion, and socioeconomic position intersect to shape both the experience and expression of distress and the older adult's willingness to seek and engage with treatment.</p>

<p><strong>Race and ethnicity:</strong> Older Black adults carry disproportionate exposure to the chronic stressors of structural racism, including lifetime experiences of discrimination, economic disadvantage, limited access to quality healthcare, and elevated exposure to traumatic events. Research consistently documents that older Black adults are less likely to be diagnosed with depression despite equivalent or greater prevalence of depressive symptoms compared to non-Hispanic White adults — a disparity driven by provider bias, cultural presentation differences, and systemic underutilization of mental health services. Older Black adults are also more likely to have internalized messages that mental health treatment is stigmatizing, shameful, or "not for us." Clinicians must actively address these barriers through culturally humble engagement, exploration of the client's explanatory model of their distress, and willingness to work collaboratively with trusted community resources including Black churches and community organizations.</p>

<p><strong>Latino/Hispanic older adults</strong> navigate the complex intersection of familismo (strong family orientation), personalismo (preference for warm, relationship-based interactions), and machismo or marianismo (gendered norms about emotional expression) that can both protect against and complicate depression treatment. Familismo, for example, is a genuine protective factor — older Latino adults frequently live in multigenerational households with strong social support networks. However, familismo can also delay individual treatment-seeking when family members serve as gatekeepers who redirect distress through family channels rather than professional ones. Language barriers for older Latino immigrants add additional complexity, as does acculturative stress and the grief associated with leaving one's country of origin.</p>

<p><strong>Asian American older adults</strong> represent an extraordinarily diverse population spanning dozens of national origins, languages, immigration generations, and cultural frameworks. The common thread, clinically relevant, is the degree to which many older Asian Americans present depression through somatic channels that reflect both cultural norms discouraging emotional expression and traditional medicine frameworks that conceptualize distress in bodily rather than psychological terms. The term neurasthenia — a somatic expression of psychological distress — remains in active use in many Asian cultural contexts and provides a face-saving vocabulary for distress that the term "depression" does not.</p>

<p><strong>Gender and late-life depression:</strong> Women are diagnosed with depression at higher rates across the lifespan, and this pattern continues in old age. However, older men present particular risks that are often underappreciated. Older men are less likely to seek mental health treatment, more likely to use alcohol to manage emotional distress, and dramatically more likely to die by suicide when depression is present — particularly older White men, who represent the highest-risk demographic for completed suicide in the United States. The stoic, self-reliant identity scripts that many older men have internalized make depression both more likely to go undetected and more dangerous when present. Clinicians working with older male clients must learn to assess depression through the back door — through exploration of physical complaints, alcohol use, changes in activity, and relationship difficulties, rather than direct emotional inquiry.</p>

<p><strong>LGBTQ+ older adults</strong> represent a population shaped by decades of systemic stigma, pathologization, and discrimination. Many older LGBTQ+ adults came of age when homosexuality was classified as a mental disorder, when same-sex relationships had no legal recognition, and when the cost of visibility was severe. The HIV/AIDS crisis devastated the social networks of many older gay and bisexual men. The cumulative effect of these minority stressors — including the internalized shame that persists even decades after an individual has come to terms with their own identity — contributes to elevated rates of depression and suicidality in older LGBTQ+ populations. Clinicians must create explicitly affirming spaces and avoid heteronormative assumptions in intake and assessment procedures.</p>

<h2>The Intersection of Physical Health and Depression in Older Adults</h2>
<p>No discussion of geriatric depression is clinically complete without sustained attention to the relationship between physical health and mental health in older adults. This relationship is not tangential — it is central. Approximately 80% of adults over 65 have at least one chronic health condition, and approximately 50% have two or more. The most common of these — cardiovascular disease, diabetes, chronic obstructive pulmonary disease, musculoskeletal conditions, and cancer — are all associated with significantly elevated rates of depression.</p>

<p>The mechanisms through which physical illness contributes to depression are multiple and interacting. Inflammatory pathways appear to play a significant role — many chronic conditions produce systemic inflammation that directly affects brain chemistry and mood regulation. Physical limitation and loss of independence are psychologically devastating for older adults who have organized their identities around activity, competence, and self-sufficiency. Pain — particularly chronic, unrelenting pain — is one of the most potent predictors of depressive symptoms at any age. The fear of progressive disability and dependency, the anticipatory grief of watching one's capacities erode, and the existential confrontation with one's own mortality that serious illness precipitates all contribute to the depressogenic potential of physical illness.</p>

<p>Equally important is the bidirectional nature of this relationship. Depression worsens physical health outcomes — depressed older adults have poorer adherence to medical regimens, higher rates of cardiovascular events, slower recovery from surgery and illness, higher rates of disability, and elevated mortality. In some contexts, particularly following stroke and myocardial infarction, depression is a stronger predictor of mortality than the index medical event itself. This clinical fact should invest the treatment of geriatric depression with appropriate urgency: treating depression in an older adult with chronic illness is not a secondary or supplementary concern — it may be the most important medical intervention available.</p>

<p>Medication side effects represent another critical intersection point. Many medications commonly prescribed to older adults — including beta-blockers, some antihypertensives, corticosteroids, benzodiazepines, and certain antibiotics — have depressive side effects. A thorough medication review is an essential component of the clinical assessment of any older adult presenting with depressive symptoms. Collaboration with prescribing physicians to identify and address medication contributors to depression is both clinically appropriate and ethically imperative.</p>`
        }
      ]
    },
    {
      title: "Module 2: Reopening the Doors — Evidence-Based Interventions for Late-Life Depression",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Reopening the Doors",
          subtitle: "Evidence-Based Interventions for Late-Life Depression"
        },
        {
          type: "text",
          content: `<h2>The Evidence Base for Treating Late-Life Depression</h2>
<p>The news for clinicians working with depressed older adults is unambiguously encouraging: late-life depression responds to treatment. Multiple meta-analyses and systematic reviews have established that both pharmacological and psychosocial interventions demonstrate efficacy in geriatric populations. The question is not whether to treat, but how — and which modalities best suit the individual client's presentation, preferences, cultural background, cognitive status, and treatment history.</p>

<p>Psychotherapy — specifically, Cognitive Behavioral Therapy (CBT), Problem-Solving Therapy (PST), Behavioral Activation (BA), Life Review Therapy (LRT), and Interpersonal Therapy (IPT) — has robust support for the treatment of late-life depression. A 2019 meta-analysis by Cuijpers and colleagues found effect sizes for psychotherapy in older adults comparable to those in younger populations, with moderate to large effects across multiple modalities. This is clinically important given older adults' frequently strong preference for psychotherapy over medication, concerns about polypharmacy, and the reality that cognitive effects of antidepressants can be particularly problematic in elderly patients.</p>

<p>Pharmacotherapy, when indicated, remains an important component of comprehensive care — particularly for moderate to severe depression or cases with prominent neurovegetative features. Selective Serotonin Reuptake Inhibitors (SSRIs) are the first-line pharmacological choice in older adults, with citalopram, sertraline, and escitalopram demonstrating acceptable tolerability profiles. Prescribers must be attentive to the increased sensitivity of older adults to medication side effects, the risk of falls associated with sedating antidepressants, drug-drug interactions in patients taking multiple medications, and the generally lower starting and maintenance doses appropriate for elderly patients. Collaboration between mental health professionals and prescribing physicians is essential in medication-assisted treatment of geriatric depression.</p>

<h2>Behavioral Activation: Starting Where the Client Is</h2>
<p>Behavioral Activation (BA) emerged from research examining the active ingredients of Cognitive Behavioral Therapy for depression. The core premise — elegantly simple, clinically powerful — is that depression is maintained by behavioral avoidance and disengagement from rewarding activities, and that systematically increasing engagement with value-consistent activities can interrupt the depressive cycle regardless of whether cognitive content has changed. For older adults, BA is particularly valuable because it requires no literacy or sophisticated psychological mindedness, is culturally flexible, targets the social isolation and inactivity that are common in geriatric depression, and produces visible, concrete results that build self-efficacy.</p>

<p>The BA approach with older adults begins with a thorough activity assessment. What activities did this person find meaningful, pleasurable, or purposeful before depression emerged? What activities are they currently engaging in, and at what frequency? The therapist then collaborates with the client to identify specific, achievable behavioral goals — not vague aspirations, but concrete activities with when, where, and how specified. The goals must be calibrated to the client's actual functional capacity, which may be significantly reduced by physical health conditions or mobility limitations.</p>

<p>A common clinical pitfall with BA in older adults is selecting activities that are inaccessible due to physical, transportation, or financial barriers. An 80-year-old with moderate arthritis who can no longer play golf — a beloved former activity — needs help identifying alternative activities that provide comparable rewards (outdoor time, physical movement, social engagement, mastery experience) through different means. This requires creative problem-solving and deep listening to what the client actually valued in the activity, not just the activity itself.</p>

<p>Particularly important for older adults is the inclusion of <strong>socially embedded activities</strong> in the activation plan. Social isolation is one of the most potent risk factors for late-life depression, and research on loneliness in older adults finds that subjective loneliness — feeling disconnected even in the presence of others — is a stronger predictor of adverse health outcomes than objective social isolation. BA that increases social contact must attend to the <em>quality</em> of that contact, not merely its frequency. Helping an older adult reconnect with meaningful relationships, or build new ones through volunteer work, faith community, or interest-based groups, is often the most powerful element of behavioral intervention.</p>

<h2>Life Review Therapy: Rereading the Library's Catalog</h2>
<p>Life review therapy, developed by Robert Butler in the 1960s and subsequently manualized by Barbara Haight, operationalizes Erikson's integrity-despair framework into a structured therapeutic intervention. The premise is that the reminiscence process, if guided therapeutically, can facilitate the integration of one's life narrative — the transformation of regrets, losses, and failures from sources of despair into meaningful elements of a coherent life story.</p>

<p>Returning to our library metaphor: if depression is the experience of a library with its doors closed, life review therapy is the process of walking back through the stacks — not to live in the past, but to retrieve what was valuable and understand how the collection was assembled. The client who has been the head librarian of their own life story for seventy-five years often has profound insight into themes, patterns, and meanings that a more crisis-focused intervention might bypass entirely.</p>

<p>Life review therapy typically unfolds across six to twelve sessions, using structured prompts across the lifecycle — childhood, adolescence, young adulthood, middle age, and late life — to elicit autobiographical narrative. The therapist's role is to listen deeply, reflect themes, help the client contextualize difficult periods within larger meaning structures, and identify previously unacknowledged strengths, accomplishments, and sources of pride. The therapeutic process explicitly addresses regrets — not to dismiss them, but to help the client achieve what Butler called a "reconciliation" with their actual life as distinct from the idealized life they may have imagined.</p>

<p>Research on life review therapy consistently demonstrates efficacy for late-life depression. Meta-analyses find moderate to large effect sizes comparable to other active treatments. Particularly notable is life review's cultural accessibility — the valuing of elder wisdom and storytelling is not a Western cultural construct but a cross-cultural human universal. For older adults from cultures that prioritize respect for elders and communal narrative traditions (many African, Latino, Asian, and Indigenous cultures), the invitation to tell one's story is not a therapeutic technique but a recognition of cultural standing that may itself be therapeutically meaningful.</p>

<h2>Problem-Solving Therapy: Building Agency in the Face of Constraint</h2>
<p>Problem-Solving Therapy (PST) is a structured, brief intervention with strong evidence for the treatment of late-life depression, particularly in primary care settings and in older adults with co-occurring medical conditions. PST is grounded in the observation that depression impairs problem-solving ability, and that restoring effective problem-solving — the capacity to approach life's challenges methodically rather than avoiding or surrendering to them — reduces depressive symptoms and improves functioning.</p>

<p>The PST protocol involves seven stages: defining the problem clearly, establishing goals for its resolution, generating a range of possible solutions, evaluating the pros and cons of each solution, selecting the optimal solution, implementing the chosen approach, and evaluating the results. This structured process is particularly valuable for older adults facing the very real practical problems that often contribute to depression — navigating healthcare systems, managing functional limitations, addressing financial concerns, dealing with family conflict around caregiving, or coping with the logistics of widowhood.</p>

<p>PST is appealing to older adults who are skeptical of "talk therapy" or who have internalized narratives about self-reliance that make emotional processing feel shameful. The practical, structured, problem-focused approach can be framed as "working on solutions" rather than "talking about feelings" — a reframe that increases engagement for many older clients. It is also adaptable to shorter sessions and is effective when delivered by trained non-specialists, making it particularly suitable for collaborative care settings where the mental health professional consults with primary care teams.</p>

<h2>Meaning-Centered Psychotherapy: Rewriting the Card Catalog</h2>
<p>Meaning-Centered Psychotherapy (MCP), originally developed by William Breitbart for cancer patients and subsequently adapted by Breitbart and Poppito for older adults, draws from Victor Frankl's logotherapy and existential philosophy to address the existential dimensions of late-life depression. The premise is that suffering — including the suffering of aging, illness, and loss — is endurable and even transformable when it is meaningful, and that the therapeutic task is to help clients discover, create, and maintain sources of meaning even in the face of unavoidable limitation.</p>

<p>MCP identifies four primary sources of meaning: attitudinal values (the freedom to choose one's attitude toward unavoidable suffering — exemplified by Frankl's own experience in Nazi concentration camps), creative values (what one creates, contributes, or leaves for others), experiential values (love, beauty, truth, connection — what one has received and continues to receive from life), and historical values (the meaning embedded in one's life story and legacy). The therapeutic work involves helping clients identify and deepen their connection to these sources of meaning, even as other sources of meaning — work, physical capacity, relationships — have been lost or diminished.</p>

<p>For the depressed older adult who says "there's no point anymore," meaning-centered work begins with the question: "What has mattered to you?" — not "what matters to you now," which may feel overwhelming, but what has mattered — a question that connects them to a lifetime of values and commitments that haven't disappeared simply because circumstances have changed. The creative value of writing one's life story, the attitudinal value of facing illness with dignity, the experiential value of connection with grandchildren, the historical value of knowing that one's contributions had lasting effects — these are not trivial consolations but genuine sources of psychological sustenance that MCP helps older adults access and articulate.</p>

<h2>Interpersonal Therapy and Late Life Transitions</h2>
<p>Interpersonal Therapy (IPT) targets the relational context of depression, identifying and addressing interpersonal problem areas — grief, role disputes, role transitions, and interpersonal deficits — that maintain depressive episodes. For older adults, role transitions and grief are the most commonly relevant IPT problem areas, often occurring simultaneously or in rapid succession.</p>

<p>The role transition from worker to retiree, from independent person to partially dependent care recipient, from spouse to widow, from parent to care-provider for one's own adult children — each of these represents a fundamental renegotiation of identity and relational scripts. IPT helps clients mourn the role that has been lost, identify and build on the strengths they bring to the new role, and develop new relational patterns appropriate to changed circumstances.</p>

<p>Grief in IPT refers specifically to uncomplicated bereavement that has become complicated — where the normal mourning process has stalled, where grief has become chronic and impairing, or where the bereaved person cannot access the mourning process at all. For older adults who have experienced multiple losses — spouse, siblings, close friends, contemporaries — the cumulative grief load can become overwhelming, and the therapeutic relationship may be the first space in which the full weight of these losses has been acknowledged and honored.</p>

<h2>Group Therapy: Reopening Doors Together</h2>
<p>Group therapy represents an underutilized but highly effective modality for late-life depression. Psychoeducational groups, supportive therapy groups, and structured CBT or BA groups all demonstrate efficacy in older adult populations and offer unique advantages that individual therapy cannot fully replicate. The universality experience — the recognition that one's suffering is shared, not shameful or unique — is particularly powerful for older adults who have internalized their depression as personal failure or weakness. The peer support and social connection offered by group formats directly addresses the social isolation that drives much late-life depression.</p>

<p>Groups specifically designed for older adults — grief groups, caregiver support groups, retirement transition groups — provide both structure and community that many older adults find more natural and less threatening than the dyadic intensity of individual therapy. For clinicians working in senior centers, assisted living facilities, or community mental health organizations, group-based approaches offer the additional advantage of reaching more clients with fewer resources — a practical consideration given the scale of unmet need in geriatric mental health.</p>`
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 2",
          showExplanations: true,
          questions: [
            {
              question: "A 70-year-old retired engineer is reluctant to engage in 'talk therapy,' stating he prefers practical solutions to 'wallowing in feelings.' Which evidence-based intervention would MOST align with his stated preferences while effectively targeting his depressive symptoms?",
              type: "multipleChoice",
              options: [
              { text: "Psychodynamic therapy focusing on early developmental experiences", isCorrect: false },
              { text: "Problem-Solving Therapy (PST), which uses a structured approach to resolving life challenges", isCorrect: true },
              { text: "Non-directive supportive counseling emphasizing emotional reflection", isCorrect: false },
              { text: "Psychoeducational group therapy focused on CBT concepts", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Problem-Solving Therapy is highly suitable for clients who are skeptical of emotional processing and who prefer practical, structured approaches. PST's seven-stage methodology emphasizes defining problems, generating solutions, and implementing strategies — a framework that many older adults, particularly those from professional or technical backgrounds, find compatible with their preferred problem-solving style. It is empirically supported for late-life depression and widely used in primary care settings."
            },
            {
              question: "Life Review Therapy is grounded primarily in which theoretical framework?",
              type: "multipleChoice",
              options: [
              { text: "Aaron Beck", isCorrect: false },
              { text: ",
                ", isCorrect: true },
              { text: "s integrity vs. despair stage and Robert Butler", isCorrect: false },
              { text: ",
                ", isCorrect: false },
              { text: " person-centered theory of unconditional positive regard", isCorrect: false },
              { text: "Viktor Frankl", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Life Review Therapy draws from Erik Erikson's eighth psychosocial stage (integrity vs. despair) and Robert Butler's foundational work on therapeutic reminiscence. Butler proposed that life review — the natural process by which older adults reflect on and evaluate their lives — could be guided therapeutically to facilitate integration, resolve regrets, and promote a sense of meaning and acceptance. The approach was manualized by Barbara Haight and has strong empirical support for late-life depression."
            },
            {
              question: "When implementing Behavioral Activation with an 82-year-old client who used to enjoy hiking but now has significant arthritis, the MOST therapeutically appropriate approach is:",
              type: "multipleChoice",
              options: [
              { text: "Encourage the client to push through the pain and attempt shorter hikes to maintain continuity with valued activities", isCorrect: false },
              { text: "Focus exclusively on indoor, sedentary activities to prevent physical injury", isCorrect: false },
              { text: "Identify what specifically the client valued about hiking — fresh air, movement, nature, solitude, achievement — and collaboratively identify alternative activities that provide similar rewards within current functional capacity", isCorrect: true },
              { text: "Defer activity planning until the arthritis is better managed medically", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "Effective Behavioral Activation requires understanding what the client actually valued in specific activities, not just the activity itself. For a client with arthritis who valued hiking, the clinician should explore whether what was most meaningful was the physical exertion, outdoor environment, sense of accomplishment, or solitude — and then collaboratively identify alternative activities that deliver those specific rewards within current functional constraints. Deferring activation or forcing painful activities both undermine the therapeutic goals."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Adapting Evidence-Based Treatments for Cognitively Impaired Older Adults</h2>
<p>Depression is not exclusively a problem of cognitively intact older adults — in fact, the co-occurrence of depression and neurocognitive disorders represents one of the most clinically complex and underaddressed challenges in geriatric mental health. Approximately 20 to 30 percent of persons with Alzheimer's disease experience clinically significant depression, and the prevalence is even higher in vascular dementia. The bidirectional relationship complicates both assessment (using self-report depression measures in someone who cannot reliably report their experience) and treatment (delivering psychotherapy to someone with memory and executive function impairment).</p>

<p>However, the presence of cognitive impairment does not eliminate the potential for meaningful psychotherapeutic intervention. Simplified, present-focused versions of behavioral activation, validation therapy, reminiscence approaches using concrete prompts (photographs, music, objects), and supportive presence-based interventions have all demonstrated value for depressed individuals with mild to moderate dementia. The therapeutic relationship itself — the experience of being seen, valued, and accompanied — has genuine psychological benefit that does not require intact memory to be real.</p>

<p>For clinicians working with depressed older adults who also have cognitive impairment, several adaptations are generally appropriate: shorter and more frequent sessions, concrete and simple language, heavy reliance on written summaries and between-session prompts, active involvement of family caregivers when appropriate (with the client's consent), emphasis on sensory and experiential rather than verbal interventions, and consistent scheduling to minimize the disorientation that novel or unpredictable environments can produce in individuals with dementia.</p>

<h2>The Role of Family Systems in Late-Life Depression Treatment</h2>
<p>Older adults do not exist in clinical isolation — they are embedded in family systems that have their own histories, patterns, roles, and pain. The family's response to an older adult's depression can either facilitate recovery or profoundly impede it. Family members who minimize symptoms ("You've got so much to be grateful for, what do you have to be depressed about?"), overprotect the depressed older adult in ways that increase dependency and decrease self-efficacy, or dismiss mental health treatment as shameful or unnecessary, all create clinical obstacles that must be addressed.</p>

<p>On the other side of the ledger, family members who are educated about late-life depression, who actively participate in treatment planning, who provide consistent encouragement for behavioral activation goals, and who maintain their own emotional wellbeing and relational connection with the depressed older adult are powerful therapeutic allies. Psychoeducation with family members — explaining that depression is a medical condition, not weakness or choice, that treatment works, and that their engagement matters — is one of the highest-yield interventions available to clinicians working with geriatric depression.</p>

<p>It is also essential to screen family caregivers for their own depression and caregiver burnout. The emotional labor of caring for a depressed older adult — particularly one who is also physically ill or cognitively impaired — is enormous, and caregiver depression is significantly elevated in this population. A clinician who treats the older adult while ignoring the caregiver's deteriorating wellbeing is addressing only half of the clinical system. Referrals to caregiver support groups, respite care, and individual therapy for family caregivers are often as clinically important as the treatment delivered to the identified client.</p>`
        }
      ]
    },
    {
      title: "Module 3: New Hours, New Catalog — Treatment Planning, Ethics, and Clinical Integration",
      order: 3,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: "New Hours, New Catalog",
          subtitle: "Treatment Planning, Ethics, and Clinical Integration"
        },
        {
          type: "text",
          content: `<h2>Comprehensive Treatment Planning for Geriatric Depression</h2>
<p>Effective treatment planning for late-life depression is not simply the application of a depression protocol to an older client — it is the construction of a genuinely individualized clinical roadmap that honors the complexity of the person, the layered nature of their situation, and the realistic goals that are clinically appropriate given their history, values, and life stage.</p>

<p>The starting point is a thorough biopsychosocial-spiritual assessment. The biological domain encompasses physical health status, current medications and potential depressogenic side effects, neurological and cognitive status, sleep patterns, nutritional status, and any acute medical concerns that require coordination with other providers. The psychological domain encompasses the current depressive presentation, history of depression and other mental health conditions, cognitive style, coping patterns, trauma history, and psychological resources. The social domain encompasses social network composition and quality, family dynamics, living situation, financial resources, community connections, and cultural and religious affiliations. The spiritual domain — often omitted from conventional psychiatric assessment but profoundly important for older adults confronting mortality and meaning — encompasses beliefs about life's purpose, religious and spiritual practices, existential concerns, and the client's framework for understanding suffering.</p>

<p>Treatment goals should be collaboratively established with the client, calibrated to realistic expectations, and oriented toward what the client actually values — not what the clinician assumes they should value. For a 75-year-old client whose primary goal is "to stop being a burden to my family," the clinician who immediately begins cognitive restructuring of the "burden" cognition without first understanding what this belief means in the client's cultural and relational context has skipped several essential steps. Does this belief reflect depressive distortion, or does it reflect genuine dependence that has become distressing in a cultural context that values independence? Is it amenable to cognitive challenge, or is it better addressed through behavioral change that actually reduces caregiving demands on family? Only careful, curious listening can answer these questions.</p>

<h2>Navigating Ethical Complexities in Geriatric Mental Health</h2>
<p>Clinical work with older adults involves a distinctive set of ethical challenges that clinicians must be prepared to navigate thoughtfully, collaboratively, and with appropriate consultation.</p>

<p><strong>Autonomy and decision-making capacity:</strong> Respect for client autonomy is a foundational ethical principle, but its application in geriatric work is complicated by the question of decision-making capacity. Capacity is not a binary or global attribute — a client may have intact capacity to make some decisions (where to live, what to eat, whether to attend therapy) and impaired capacity for others (complex financial or medical decisions). Capacity assessment is situation-specific and should not be conflated with a diagnosis of dementia or cognitive impairment. The ethical default is always to support the client's autonomous decision-making to the greatest extent possible, using the least restrictive means available.</p>

<p>When genuine capacity questions arise, the clinician's role is to facilitate — not substitute — decision-making. Involving trusted family members, using supported decision-making frameworks, simplifying and repeating information across sessions, and consulting with neuropsychology colleagues are all tools available before resorting to legal mechanisms like guardianship, which should be the last resort and represents a profound restriction of civil rights.</p>

<p><strong>Confidentiality and mandatory reporting:</strong> Mandatory reporting obligations regarding elder abuse and neglect vary by state but apply to all licensed mental health professionals working with older adults. Clinicians must be familiar with their jurisdiction's specific definitions and reporting requirements, must develop competency in recognizing indicators of abuse and neglect (including financial exploitation, a form of elder abuse that is underrecognized but extremely common), and must navigate the complex clinical and relational dimensions of reporting when an abuser is also the client's primary caregiver.</p>

<p>Confidentiality is particularly complex in geriatric work because family members are often intensively involved and have both legitimate concerns and potential conflicts of interest. Clinicians should establish clear confidentiality parameters early in treatment, discussing explicitly with older adult clients what information they do and do not consent to share with family members, and documenting these agreements carefully. The clinical instinct to "keep the family in the loop" must be disciplined by the ethical imperative to protect the client's privacy and autonomous decision-making rights.</p>

<p><strong>Telehealth and technology access:</strong> The COVID-19 pandemic dramatically accelerated the adoption of telehealth in mental health services, and telehealth has emerged as a genuinely important modality for older adults — particularly those with transportation barriers, mobility limitations, rural residence, or care responsibilities. However, telehealth also introduces a digital divide that can exacerbate existing health inequities. Older adults with limited technological literacy, those who do not own appropriate devices, and those with sensory impairments that make video conferencing difficult are all at risk of being left behind by a telehealth-first service delivery model. Ethical practice requires active assessment of each client's telehealth readiness and the provision of alternatives — including in-person and telephone options — for those for whom telehealth is inaccessible or clinically inappropriate.</p>

<h2>Collaborative Care: The Library as Community Resource</h2>
<p>No single clinician can address the full complexity of geriatric depression alone. The most effective care models are collaborative — integrating mental health professionals with primary care physicians, geriatricians, social workers, pharmacists, occupational therapists, chaplains, and community organizations into coordinated care teams where the older adult's wellbeing is the shared priority.</p>

<p>The collaborative care model, originally developed for depression in primary care and subsequently validated specifically for geriatric depression through landmark studies like IMPACT (Improving Mood: Promoting Access to Collaborative Treatment), demonstrates significantly better outcomes than usual care — including higher rates of depression treatment, more complete treatment response, and sustained improvement over follow-up periods of up to two years. The IMPACT model integrated a depression care manager (typically a social worker or nurse) into primary care settings to provide active care coordination, brief psychosocial interventions, and consultation with a supervising psychiatrist.</p>

<p>For clinicians in private practice, collaborative care principles can be operationalized through systematic coordination with clients' primary care and specialist physicians, the use of standardized assessment measures that can be shared across providers, participation in care conferences when clients are managing complex medical and psychiatric needs simultaneously, and active cultivation of referral relationships with geriatric specialists, social services, and community organizations that serve older adults.</p>

<h2>Building the New Catalog: Prevention and Positive Aging</h2>
<p>The final dimension of clinical competence with geriatric depression extends beyond treatment to prevention. Mental health professionals working with older adults have the opportunity — and arguably the obligation — to support the development and maintenance of the psychological resources that protect against depression, not merely to intervene when depression is already established.</p>

<p>The positive aging framework, informed by research on resilience and wellbeing in older adults, identifies several evidence-based domains of preventive intervention. Regular physical activity — even moderate walking — has robust protective effects against both depression and cognitive decline. Social engagement and the maintenance of meaningful relationships are among the strongest predictors of positive aging. Cognitive stimulation through learning, creative engagement, and intellectually demanding activities supports both mood and cognition. Mindfulness practice has emerging evidence for benefit in older adults, and has the advantage of being culturally adaptable and accessible regardless of physical limitation. Volunteer work — particularly work that provides a sense of purpose and social connection — has been associated with significant mental health benefits in older populations.</p>

<p>For clinicians with opportunities to offer psychoeducational programming in senior centers, faith communities, assisted living facilities, or community health settings, evidence-based prevention programs like the Healthy IDEAS (Identifying Depression, Empowering Activities for Seniors) program and the PEARLS (Program to Encourage Active, Rewarding Lives for Seniors) home-based program offer structured approaches to reaching older adults with depression prevention before the library doors close entirely.</p>

<h2>Professional Self-Care: Sustaining the Clinician</h2>
<p>Work with geriatric populations is clinically rewarding and, simultaneously, emotionally demanding in distinctive ways. The repeated encounter with loss — including the loss through death of clients with whom deep, sustained relationships have been built — extracts a particular kind of professional toll. Clinicians who work extensively with older adults must attend carefully to their own aging anxiety, their own unresolved grief and loss experiences, and the ways in which clients' existential confrontations may activate their own.</p>

<p>Supervision and consultation are not luxuries in geriatric mental health — they are clinical necessities. The opportunity to process the emotional dimensions of this work with a trusted colleague, to receive feedback on complex cases, and to maintain perspective on the inevitable losses that accompany depth work with older adults is essential to sustained competence and professional wellbeing. Clinicians who absorb the grief of their geriatric clients without adequate outlets for processing it are at significant risk of compassion fatigue and, paradoxically, reduced capacity for the very presence and attunement that makes this work most effective.</p>

<h2>When the Doors Reopen: Clinical Optimism as Evidence-Based Practice</h2>
<p>We began with the image of a library whose doors had closed — the books unchanged, the knowledge intact, but the connection between inner richness and outer world severed by the accumulating losses of late life. We end with a simpler image: a key in the door. Late-life depression is treatable. Older adults are capable of profound change, growth, and meaning-making. The therapeutic relationship — attentive, warm, genuine, and clinically skilled — is itself a key that can reopen the doors of engagement, connection, and purpose.</p>

<p>The clinician who brings both evidence-based tools and genuine human curiosity to this work will encounter, repeatedly, the transformative potential of late life. Clients who find new purpose through volunteer work or creative expression. Clients who achieve peace with losses they had carried for decades. Clients who, confronting their own mortality with honesty and support, discover an authentic depth of aliveness they had not previously known. The library, it turns out, has always been open — it was waiting for someone to turn the lights back on.</p>`
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 3",
          showExplanations: true,
          questions: [
            {
              question: "The IMPACT collaborative care model for geriatric depression demonstrated which of the following outcomes compared to usual care?",
              type: "multipleChoice",
              options: [
              { text: "Equivalent outcomes to usual care but at lower cost", isCorrect: false },
              { text: "Higher rates of depression treatment, more complete treatment response, and sustained improvement over follow-up periods", isCorrect: true },
              { text: "Better outcomes only in the immediate post-treatment period with no long-term differences", isCorrect: false },
              { text: "Significant improvement only for clients with mild, not moderate, depression", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "The IMPACT (Improving Mood: Promoting Access to Collaborative Treatment) study demonstrated significantly superior outcomes for the collaborative care model compared to usual primary care — including higher rates of active depression treatment, more complete symptom response, and sustained improvement at two-year follow-up. The model integrated a depression care manager into primary care settings with consultant psychiatrist support."
            },
            {
              question: "When working with an older adult client who has impaired decision-making capacity, the ethically appropriate default position is:",
              type: "multipleChoice",
              options: [
              { text: "Transfer all decision-making authority to the client", isCorrect: false },
              { text: ",
                ", isCorrect: false },
              { text: "s safety", isCorrect: true },
              { text: "Support the client", isCorrect: false },
              { text: ",
                ", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "The ethical default in working with cognitively impaired older adults is always to support autonomous decision-making to the greatest possible extent, using the least restrictive means. Capacity is situation-specific, not global. Supported decision-making frameworks, family involvement (with client consent), simplified communication, and repeated information provision should all be pursued before legal mechanisms like guardianship, which represents a significant restriction of civil rights and should be a last resort."
            },
            {
              question: "According to the biopsychosocial-spiritual assessment model for geriatric depression, which of the following is categorized in the SPIRITUAL domain?",
              type: "multipleChoice",
              options: [
              { text: "History of previous depressive episodes", isCorrect: false },
              { text: "Current medication list and potential depressogenic side effects", isCorrect: false },
              { text: "Family dynamics and caregiver involvement", isCorrect: false },
              { text: "Beliefs about life", isCorrect: true }
            ], correctAnswer: 3,
              explanation: "The spiritual domain of comprehensive geriatric assessment encompasses beliefs about meaning and purpose, religious and spiritual practices, existential concerns about mortality and legacy, and the client's framework for understanding suffering. This domain is often omitted from conventional psychiatric assessment but is profoundly important for older adults confronting their own mortality and seeking to understand the meaning of their lives."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Final Assessment Preparation</h2>
<p>Before completing the final assessment for this course, take a moment to review the key themes we have covered across the three modules. Late-life depression is both highly prevalent and significantly undertreated, driven by ageist assumptions, somatic presentation patterns, and systemic barriers to access. The clinical presentation of depression in older adults differs meaningfully from younger-onset presentations, requiring specific assessment tools and culturally attuned clinical interviewing skills. Evidence-based treatments — including Behavioral Activation, Life Review Therapy, Problem-Solving Therapy, Meaning-Centered Psychotherapy, and Interpersonal Therapy — are effective in geriatric populations and should be tailored to each client's individual needs, cultural background, cognitive status, and treatment preferences. Effective geriatric care is collaborative, ethically complex, and sustained by the clinician's own self-care and reflective practice.</p>
<p>The final assessment consists of 15 questions covering all three modules. A score of 80% or higher is required to receive CE credit. You have three attempts available.</p>`
        },
        {
          type: "quiz",
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          shuffleQuestions: true,
          showExplanations: false,
          title: "Final Assessment — CR-610: Unretiring the Self",
          questions: [
            {
              question: "Approximately what percentage of community-dwelling older adults experience clinically significant depressive symptoms?",
              type: "multipleChoice",
              options: [
              { text: "3 to 5 percent", isCorrect: false },
              { text: "15 to 20 percent", isCorrect: true },
              { text: "35 to 40 percent", isCorrect: false },
              { text: "50 to 60 percent", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Research estimates that 15–20% of community-dwelling older adults experience clinically significant depressive symptoms, rising to 25–40% in nursing home and long-term care settings."
            },
            {
              question: "Which of the following is the MOST common reason older adults under-report depressive symptoms to healthcare providers?",
              type: "multipleChoice",
              options: [
              { text: "Older adults genuinely experience less severe depression than younger adults", isCorrect: false },
              { text: "Cultural cohort norms of stoicism lead older adults to express distress through somatic channels rather than emotional language", isCorrect: true },
              { text: "Older adults are better at regulating emotions and therefore experience less distress", isCorrect: false },
              { text: "Most older adults are satisfied with their lives and do not develop clinical depression", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Many older adults were socialized in cohorts that valued emotional stoicism and self-reliance. They are more likely to express depressive distress through somatic complaints (fatigue, appetite change, pain) than through emotional language, leading to under-recognition by providers relying on emotional self-report."
            },
            {
              question: "The Geriatric Depression Scale (GDS) is preferred over other depression measures in older adults primarily because:",
              type: "multipleChoice",
              options: [
              { text: "It provides a diagnosis rather than a symptom severity rating", isCorrect: false },
              { text: "It has a longer format with more comprehensive coverage of depressive symptoms", isCorrect: false },
              { text: "It minimizes somatic items that can produce false positives in medically complex older adults and uses an accessible yes/no response format", isCorrect: true },
              { text: "It is the only depression measure validated in older adult populations", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "The GDS was designed specifically for older adults and avoids somatic items (sleep, appetite, fatigue) that can reflect physical illness rather than depression, reducing false positives. The yes/no format is also more accessible for older adults with mild cognitive impairment."
            },
            {
              question: "An older adult client presents with nihilistic delusions — believing that her internal organs are rotting and that she has irreparably harmed her family — alongside severe depression. This presentation is MOST consistent with:",
              type: "multipleChoice",
              options: [
              { text: "Generalized Anxiety Disorder with somatic features", isCorrect: false },
              { text: "Early-onset Alzheimer", isCorrect: false },
              { text: ",
                ", isCorrect: true },
              { text: ",
                ", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "Depression with psychotic features — particularly nihilistic delusions about physical decay, personal culpability, or family harm — occurs at higher rates in older adults than in younger populations. This is a psychiatric emergency requiring intensive treatment and should not be attributed to cognitive decline."
            },
            {
              question: "The protective factor with the strongest research support for preventing late-life depression is:",
              type: "multipleChoice",
              options: [
              { text: "Financial wealth", isCorrect: false },
              { text: "Living in a urban rather than rural environment", isCorrect: false },
              { text: "Strong social support network and meaningful social connection", isCorrect: true },
              { text: "Having adult children involved in the older adult", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "Strong social support and meaningful social connection consistently emerge as the most robust protective factors against late-life depression across multiple research designs and populations. Subjective loneliness — feeling disconnected even in the presence of others — is a stronger predictor of adverse outcomes than objective social isolation."
            },
            {
              question: "Behavioral Activation (BA) is effective for late-life depression primarily because it:",
              type: "multipleChoice",
              options: [
              { text: "Requires cognitive restructuring of depressive beliefs before behavioral change can occur", isCorrect: false },
              { text: "Interrupts the depression-maintaining cycle of behavioral avoidance and disengagement from rewarding activities", isCorrect: true },
              { text: "Focuses on resolving early childhood trauma that underlies adult depression", isCorrect: false },
              { text: "Uses medication to restore neurochemical balance before behavioral interventions can work", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "BA is grounded in the finding that depression is maintained by behavioral avoidance and withdrawal from value-consistent activities. Systematically increasing engagement with meaningful activities interrupts this cycle and improves mood, regardless of whether cognitive content has changed. It is particularly well-suited to older adults because it is practical, culturally flexible, and accessible without sophisticated psychological mindedness."
            },
            {
              question: "Which intervention specifically targets the integration of one's life narrative to achieve acceptance and meaning in late life?",
              type: "multipleChoice",
              options: [
              { text: "Cognitive Behavioral Therapy (CBT)", isCorrect: false },
              { text: "Life Review Therapy (LRT)", isCorrect: true },
              { text: "Problem-Solving Therapy (PST)", isCorrect: false },
              { text: "Motivational Interviewing (MI)", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Life Review Therapy, developed from Robert Butler's work on therapeutic reminiscence and Erikson's integrity vs. despair stage, uses structured autobiographical narrative to help clients integrate their life story, reconcile regrets, and discover meaning in the life they actually lived — the core psychosocial task of late life."
            },
            {
              question: "When working with an older Latino client experiencing depression, the clinician's awareness that familismo may affect treatment engagement MOST appropriately leads to:",
              type: "multipleChoice",
              options: [
              { text: "Automatically involving family members in all treatment sessions without the client", isCorrect: false },
              { text: ",
                ", isCorrect: true },
              { text: ",
                ", isCorrect: false },
              { text: "s family will serve as an adequate substitute for professional treatment", isCorrect: false },
              { text: "Avoiding discussion of family dynamics to maintain a focus on individual cognitive and behavioral targets", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Familismo — the strong family orientation prevalent in many Latino cultures — can be both a protective resource and a barrier to individual treatment-seeking. The clinically appropriate response is to explore with the client how family relationships factor into their experience and preferences, neither automatically involving family without consent nor ignoring this central cultural value."
            },
            {
              question: "The Cornell Scale for Depression in Dementia (CSDD) is preferred over self-report measures like the GDS when:",
              type: "multipleChoice",
              options: [
              { text: "The client is over age 85", isCorrect: false },
              { text: "The client has a neurocognitive disorder that impairs reliable self-report", isCorrect: true },
              { text: "The client is in long-term care rather than community settings", isCorrect: false },
              { text: "The clinician wants to compare results with medical records", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "The CSDD integrates clinician observation and caregiver-provided collateral information to assess depression in individuals whose cognitive impairment compromises reliable self-report. It was specifically designed for this clinical population and is preferred when the individual cannot reliably describe their own mood and experience."
            },
            {
              question: "Which of the following physical health conditions is MOST strongly associated with late-life depression?",
              type: "multipleChoice",
              options: [
              { text: "Osteoporosis without functional limitation", isCorrect: false },
              { text: "Managed hypertension with no cardiovascular events", isCorrect: false },
              { text: "Cardiovascular disease, stroke, chronic pain, and Parkinson", isCorrect: true },
              { text: ",
                ", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "Conditions including cardiovascular disease, stroke, Parkinson's disease, and chronic pain are among those most strongly associated with late-life depression, through both inflammatory pathways and the psychological impact of functional limitation, loss of independence, and confrontation with mortality."
            },
            {
              question: "The IMPACT collaborative care model for geriatric depression is BEST characterized as:",
              type: "multipleChoice",
              options: [
              { text: "A hospital-based intensive outpatient program for severe geriatric depression", isCorrect: false },
              { text: "Integration of a depression care manager into primary care settings with psychiatrist consultation support", isCorrect: true },
              { text: "A telehealth-only program for older adults with transportation barriers", isCorrect: false },
              { text: "A pharmacological-first protocol emphasizing antidepressant optimization", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "IMPACT integrated a trained depression care manager (typically a social worker or nurse) into primary care settings, who provided active care coordination, brief psychosocial interventions, and consultation with a supervising psychiatrist. This collaborative model significantly outperformed usual primary care in multiple outcomes."
            },
            {
              question: "Older adult male clients present particular clinical risks regarding depression because:",
              type: "multipleChoice",
              options: [
              { text: "They experience depression at higher rates than older adult women", isCorrect: false },
              { text: "They are more likely to use alcohol to manage emotional distress, less likely to seek treatment, and at dramatically higher risk of completed suicide when depression is present", isCorrect: true },
              { text: "Their depression is more treatment-resistant than that of older women", isCorrect: false },
              { text: "They tend to over-report symptoms, making accurate assessment difficult", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Older men — particularly older White men — are less likely to seek mental health treatment, more likely to use alcohol as a coping mechanism, and represent the highest-risk demographic for completed suicide in the United States. Their socialization toward stoicism makes depression more likely to go undetected and more dangerous when present."
            },
            {
              question: "In Meaning-Centered Psychotherapy for older adults, 'attitudinal values' refers to:",
              type: "multipleChoice",
              options: [
              { text: "The client", isCorrect: false },
              { text: ",
                ", isCorrect: true },
              { text: "s attitude toward unavoidable suffering", isCorrect: false },
              { text: "Cognitive attitudes that maintain depressive episodes", isCorrect: false },
              { text: "Cultural values that shape the expression of distress", isCorrect: false }
            ], correctAnswer: 1,
              explanation: "Drawing from Viktor Frankl's logotherapy, MCP identifies attitudinal values as one of four primary sources of meaning. Attitudinal values refer to the inherent human freedom to choose one's attitude toward unavoidable circumstances — exemplified by Frankl's own experience in Nazi concentration camps. Even when suffering cannot be eliminated, meaning can be found in how it is faced."
            },
            {
              question: "A clinician who normalizes an older client's depression as 'just part of getting old' is demonstrating:",
              type: "multipleChoice",
              options: [
              { text: "Culturally responsive care that honors the client", isCorrect: false },
              { text: ",
                ", isCorrect: false },
              { text: ",
                ", isCorrect: false },
              { text: "s own self-understanding", isCorrect: true },
              { text: "Ageism that normalizes pathology without adequate clinical assessment", isCorrect: false }
            ], correctAnswer: 3,
              explanation: "Ageism — the implicit assumption that depression, sadness, and loss of interest are 'natural' in old age — is arguably the single greatest barrier to adequate geriatric mental health care. When a clinician normalizes clinical depression as aging, they fail to offer available, effective treatments to a client who is suffering unnecessarily. Depression is not a normal part of aging; it is a treatable condition at any age."
            },
            {
              question: "Which of the following is the MOST clinically appropriate approach to caregiver involvement in the treatment of a depressed older adult?",
              type: "multipleChoice",
              options: [
              { text: "Exclude family members entirely to protect client confidentiality", isCorrect: false },
              { text: "Involve family members in all decisions, as older adults with depression cannot make autonomous choices", isCorrect: false },
              { text: "Establish explicit confidentiality agreements with the client, assess caregiver wellbeing and provide referrals when needed, and engage family as treatment allies with the client", isCorrect: true },
              { text: ",
                ", isCorrect: false },
              { text: " perceptions as the primary clinical data source, as they are most reliable", isCorrect: false }
            ], correctAnswer: 2,
              explanation: "Effective, ethical geriatric depression treatment requires clear confidentiality agreements with the client about what can be shared with family, active screening of family caregivers for their own depression and burnout, and engagement of family as informed treatment allies — all with the older adult's informed consent and in a manner that preserves their autonomy."
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================
// DATABASE OPERATIONS
// ============================================================

const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('\n' + '═'.repeat(60));
  console.log('  SEEDING CR-610: Unretiring the Self');
  console.log('═'.repeat(60));

  const existing = await Course.findOne({ slug: COURSE.slug });
  if (existing) {
    await Course.findOneAndReplace({ slug: COURSE.slug }, COURSE, { new: true });
    console.log('✅ Updated existing course');
  } else {
    await Course.create(COURSE);
    console.log('✅ Created new course');
  }
  console.log(`   Title: ${COURSE.title}`);
  console.log(`   Code: ${COURSE.courseCode} | CE Hours: ${COURSE.ceHours}`);
  console.log(`   Modules: ${COURSE.modules.length}`);
  await mongoose.disconnect();
  console.log('\n✅ Done. Deploy seed: Render will auto-deploy from GitHub.\n');
}

seed().catch(err => { console.error('❌ Error:', err); process.exit(1); });
