/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * CR-613: "Seasoned & Struggling" — Substance Use Disorders in Older Adults
 * CE Hours: 2.0 | NBCC ACEP #7760
 */
import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedCR613-Seasoned_and_Struggling_Substance_Use_Older_Adults-12000words.js
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

const COURSE = {
  title: "Seasoned and Struggling: Substance Use Disorders in Older Adults",
  slug: "seasoned-and-struggling-substance-use-disorders-older-adults",
  courseCode: "CR-613",
  description: "A vintage wine aging badly doesn't announce itself — the bottle still looks distinguished, the label still reads well, and the person who pours it may not realize something has gone wrong until the glass is empty and the familiar taste is simply not there. Substance use disorders in older adults operate by a similar concealment: behind decades of apparent functionality, a quiet problem may be deepening — more dangerous because of altered physiology, more hidden because of generational stigma, and more missed because clinicians aren't looking. This 2-CE course equips mental health professionals to recognize, assess, and treat alcohol and prescription medication misuse in older adults — the clinical populations they are most likely to encounter in geriatric practice.",
  ceHours: 2,
  ceuHours: 2,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  category: "Clinical",
  ceCategory: "Clinical",
  contentArea: "Addiction Counseling",
  level: "Intermediate",
  accessType: "paid",
  price: 39.99,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  targetAudience: ["Licensed Professional Counselors (LPC/LPCC)", "Licensed Clinical Social Workers (LCSW)", "Licensed Marriage and Family Therapists (LMFT)", "Licensed Mental Health Counselors (LMHC)", "Psychologists", "Psychiatric Nurse Practitioners"],
  objectives: [
    "Identify the prevalence, trajectory patterns, and physiological mechanisms by which substance use — particularly alcohol and prescription medications — causes disproportionate harm in older adult populations",
    "Apply validated screening instruments appropriate for geriatric substance use assessment, adapting clinical interviewing techniques to address the stigma and cohort-specific presentation patterns of older adults",
    "Distinguish late-onset from early-onset substance use disorders in older adults and describe the clinical and prognostic implications of each trajectory",
    "Implement evidence-based brief interventions and appropriate treatment referral strategies for older adults with alcohol misuse and prescription medication disorders"
  ],
  tags: ["substance use", "older adults", "alcohol", "prescription medications", "benzodiazepines", "opioids", "geriatric", "screening", "brief intervention"],
  references: [
    { title: "Substance use disorders in older adults: A review and update", author: "Kuerbis, A., Sacco, P., Blazer, D. G., & Moore, A. A.", year: 2014, source: "Aging and Mental Health, 18(2), 148–161" },
    { title: "Alcohol and aging: The double jeopardy of older adults with alcohol use disorder", author: "Substance Abuse and Mental Health Services Administration (SAMHSA)", year: 2020, source: "SAMHSA Publication PEP20-06-04-002" },
    { title: "The AUDIT: An adaptable tool for detecting alcohol misuse in older adults", author: "Babor, T. F., et al.", year: 2001, source: "World Health Organization" },
    { title: "Prescription drug misuse among older adults", author: "Simoni-Wastila, L., & Yang, H. K.", year: 2006, source: "The American Journal of Geriatric Pharmacotherapy, 4(4), 380–394" },
    { title: "Brief intervention and motivational interviewing for older adults with alcohol problems", author: "Fleming, M. F., et al.", year: 1999, source: "JAMA, 282(12), 1165–1170" },
    { title: "Benzodiazepine use in older adults: Dangers, management, and alternative treatments", author: "Lader, M.", year: 2011, source: "Current Psychiatry Reports, 13(1), 1–7" }
  ],
  assessment: { passingScore: 80, maxAttempts: 3 },
  modules: [
    {
      title: "Module 1: When Age Concentrates the Problem — Epidemiology and Clinical Recognition",
      order: 1,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 1, title: "When Age Concentrates the Problem", subtitle: "Epidemiology and Clinical Recognition of Geriatric Substance Use" },
        {
          type: "text",
          content: `<h2>The Invisible Epidemic: Substance Use in Older Adults</h2>
<p>Substance use disorders in older adults represent what public health researchers have called a "hidden epidemic" — large in scale, significant in consequences, and dramatically underrecognized by clinicians, family members, and the older adults themselves. The demographic projections make this an increasingly urgent clinical priority: as the Baby Boomer cohort — a generation characterized by higher rates of substance use than previous generations — ages into their 70s and 80s, the prevalence of substance use disorders among older adults is projected to increase substantially over the coming decade.</p>

<p>Alcohol use disorder is the most prevalent substance use disorder in adults over 65. Current estimates suggest that approximately 2 to 4 percent of older adults meet diagnostic criteria for alcohol use disorder, while a much larger proportion — approximately 10 to 15 percent — engage in at-risk or hazardous drinking that, while not meeting diagnostic criteria, poses significant health risks given the altered physiology of aging. The challenge is that even these statistics likely undercount the true prevalence, because older adults are less likely to self-report substance use, less likely to be asked about it by healthcare providers, and less likely to exhibit the social and occupational consequences that make substance use visible in working-age adults.</p>

<p>Prescription medication misuse — particularly involving benzodiazepines and opioid analgesics — is a growing and underrecognized concern in older adult populations. Older adults receive a disproportionate share of benzodiazepine prescriptions, often initiated for anxiety or insomnia in middle adulthood and continued without reassessment across decades. The physiological changes of aging dramatically increase both the sensitivity to and the duration of action of benzodiazepines — a medication that was clinically appropriate for a 45-year-old may be producing significant sedation, cognitive impairment, and fall risk by the time the same person reaches 75. Opioid prescribing for chronic pain is also disproportionately concentrated in older adult populations, where the intersection of legitimate pain management need and addiction vulnerability creates complex clinical terrain.</p>

<h2>Physiology of Aging and Substance Effects: Why the Problem Gets Worse</h2>
<p>The clinical principle underlying geriatric substance use assessment is simple but not intuitively obvious: equal amounts of substance produce greater and longer-lasting effects in older adults than in younger adults, even when the older adult's use has remained stable over time. This "pharmacological aging" effect means that an older adult who has drunk the same amount for thirty years may be experiencing clinically significant alcohol-related harm today that they did not experience at 50 — not because their drinking has increased, but because their body has changed.</p>

<p>The mechanisms include: reduced total body water (meaning higher blood alcohol concentration per unit of alcohol consumed), decreased liver enzyme activity that slows alcohol metabolism, reduced renal function affecting medication clearance, increased sensitivity of brain receptors to CNS depressants, reduced physiological resilience that decreases recovery capacity, and the accumulating organ damage of decades of use. The result is a double jeopardy: the same substance produces stronger effects while the body's capacity to handle those effects diminishes simultaneously.</p>

<p>This physiological reality has a direct clinical implication: the "low and slow" drinking pattern that an older adult confidently reports as "moderate" may actually be producing clinically significant intoxication and withdrawal effects. The NIAAA (National Institute on Alcohol Abuse and Alcoholism) defines low-risk drinking for adults over 65 as no more than seven standard drinks per week and no more than three drinks on any single occasion — significantly lower than the thresholds for younger adults. Clinicians should use these age-specific thresholds, not general adult standards, when evaluating older adult drinking patterns.</p>

<h2>Trajectory Patterns: Early-Onset versus Late-Onset</h2>
<p>Understanding the trajectory of substance use is clinically important because early-onset and late-onset presentations carry different clinical profiles, different prognoses, and different treatment considerations.</p>

<p><strong>Early-onset substance use disorders</strong> (onset before age 65) in older adults represent a continuation and often an escalation of longstanding use. These individuals have typically faced multiple negative consequences over decades — relationship disruption, occupational difficulties, health consequences, legal problems, failed treatment attempts. They are more likely to have significant comorbid mental health conditions, more severe physiological dependence, more entrenched cognitive distortions about their use, and longer histories of recovery attempts. Treatment is more complex and typically requires more intensive intervention, but these individuals are also not new to the recovery process and may have significant accumulated insight about their own patterns.</p>

<p><strong>Late-onset substance use disorders</strong> (onset after age 65) are frequently triggered by identifiable stressors — retirement, bereavement, chronic illness, loneliness, or loss of independence. These individuals often had decades of controlled or absent use and may be genuinely surprised to find themselves struggling with alcohol or medication use in later life. They tend to have fewer social and occupational consequences, better social support, and fewer comorbid psychiatric conditions — factors that are associated with more positive treatment outcomes. Brief interventions are often highly effective for late-onset presentations, because the individual has not yet organized their identity around substance use and may have strong internal motivation to return to the functional pattern they maintained for most of their lives.</p>

<h2>Why Geriatric Substance Use Goes Unrecognized</h2>
<p>The barriers to recognition of substance use disorders in older adults operate at multiple levels — the individual, the family, and the clinical system.</p>

<p>At the individual level, older adults are shaped by cohort norms that carry significant stigma about substance use and mental health treatment. The generation of adults currently over 75 came of age in a cultural context that understood alcoholism as a moral failing, a character defect, or a source of family shame — not a medical condition with evidence-based treatment options. Disclosure to a clinician is thus not merely a clinical conversation but a fundamental violation of deeply held values about privacy, self-reliance, and social propriety. Clinicians must approach the topic with explicit recognition of this cultural context and with the kind of non-judgmental curiosity that creates safety for disclosure.</p>

<p>At the family level, the adult children of older adults with substance use problems may have normalized the behavior over decades, may themselves be managing significant guilt and ambivalence about the relationship, or may be actively enabling the behavior through denial and facilitation. Family members are also less likely to recognize the signs of problematic substance use in an older adult — the person is retired and home, so sleep disruption and social withdrawal look less alarming; the "few glasses of wine in the evening" fits the cultural script of relaxed retirement living; the prescribed medications look legitimate because a physician authorized them.</p>

<p>At the clinical level, providers — including mental health professionals — consistently under-screen for substance use in older adult patients. When screening does occur, it tends to rely on instruments that were normed on younger populations and that ask about occupational and social consequences that are less relevant for retired, socially reduced older adults. A clinician who asks whether the client's drinking has affected their job performance will not receive useful information from a retired 78-year-old.</p>

<h2>Assessment: Age-Appropriate Screening Tools</h2>
<p>The standard Alcohol Use Disorders Identification Test (AUDIT) and its brief version AUDIT-C have been validated for use in older adults and provide useful dimensional assessment of alcohol use. However, clinicians should supplement structured screening with direct conversation using language and concepts that resonate with older adult clients: "Do you use alcohol to help you sleep?" "Do you find yourself looking forward to your evening drink more than you used to?" "Has your doctor ever mentioned concern about your drinking?"</p>

<p>The Short Michigan Alcoholism Screening Test — Geriatric Version (SMAST-G) was specifically developed and validated for older adult populations and includes items that capture the social and psychological dimensions of geriatric alcohol misuse — including drinking to cope with loneliness, bereavement, and physical discomfort — that general adult screening tools miss.</p>

<p>For prescription medication misuse, clinicians should assess: the medications prescribed and by whom; the pattern of use relative to prescription instructions; whether the older adult is obtaining medications from multiple providers; whether they have attempted to obtain medications outside the prescription system; and whether they experience distress when a medication is not available. The Prescription Drug Use Questionnaire (PDUQ) and the Drug Abuse Screening Test (DAST-10) provide structured formats for assessing prescription medication misuse.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 1",
          showExplanations: true,
          questions: [
            {
              question: "The NIAAA defines low-risk drinking for adults over 65 as no more than:",
              type: "multiple_choice",
              options: [
                "14 standard drinks per week and no more than 4 drinks per occasion, equivalent to the standard adult threshold",
                "7 standard drinks per week and no more than 3 drinks on any single occasion",
                "5 standard drinks per week with no single-occasion limit",
                "1 standard drink per day with no weekly limit"
              ],
              correctAnswer: 1,
              explanation: "NIAAA sets age-specific thresholds for older adults that are significantly lower than for younger adults — a maximum of 7 drinks per week and 3 drinks per occasion — reflecting the altered physiology of aging that produces greater and longer-lasting effects from alcohol even when consumption remains stable over time."
            },
            {
              question: "An older adult who has maintained stable drinking patterns for 30 years may now be experiencing alcohol-related harm for which primary physiological reason?",
              type: "multiple_choice",
              options: [
                "Psychological tolerance has increased their desire for alcohol without changing physiological response",
                "Aging reduces total body water and liver enzyme activity, producing higher blood alcohol concentration per unit consumed and slower metabolism — generating more effect from the same amount",
                "Social isolation amplifies the emotional effects of alcohol",
                "Chronic use has permanently damaged liver function in ways that suddenly become symptomatic in late life"
              ],
              correctAnswer: 1,
              explanation: "The physiological changes of aging — reduced total body water, decreased liver enzyme activity, reduced renal clearance, and increased CNS receptor sensitivity — produce greater and longer-lasting effects from the same amount of alcohol. This 'pharmacological aging' effect means that an older adult who has not increased their drinking may be experiencing clinically significant harm that they did not experience at a younger age."
            },
            {
              question: "Late-onset alcohol use disorder (onset after age 65) is MOST commonly associated with:",
              type: "multiple_choice",
              options: [
                "Genetic vulnerability to addiction that has remained dormant until late life",
                "Lifelong, progressively escalating use that finally crosses diagnostic thresholds in late life",
                "Identifiable stressors — retirement, bereavement, chronic illness, loneliness — and carries a relatively positive prognosis with appropriate intervention",
                "Comorbid personality disorders that emerge in late life"
              ],
              correctAnswer: 2,
              explanation: "Late-onset presentations are frequently triggered by identifiable late-life stressors and are associated with fewer comorbidities, better social support, and relatively positive treatment outcomes. Brief interventions are often highly effective because the individual has not organized their identity around substance use and has decades of controlled use as a reference point for recovery."
            }
          ]
        }
      ]
    },
    {
      title: "Module 2: Clearing the Cellar — Evidence-Based Intervention and Treatment",
      order: 2,
      contentBlocks: [
        { type: "sectionDivider", sectionNumber: 2, title: "Clearing the Cellar", subtitle: "Evidence-Based Intervention and Treatment for Geriatric Substance Use" },
        {
          type: "text",
          content: `<h2>Brief Interventions: Highly Effective in Older Adults</h2>
<p>The evidence base for brief interventions in geriatric alcohol misuse is robust and offers clinicians a practical, time-efficient, and effective tool. The FRAMES model (Feedback, Responsibility, Advice, Menu of options, Empathy, Self-efficacy) provides a structured brief intervention framework that can be delivered in as little as 10 to 15 minutes and has demonstrated significant reductions in alcohol consumption in older adult primary care patients.</p>

<p>Fleming and colleagues' landmark 1999 Project GOAL (Guiding Older Adult Lifestyles) trial demonstrated that two brief physician counseling visits with older adult patients who engaged in at-risk drinking produced significant reductions in alcohol consumption that were maintained at 12-month follow-up. This finding — that even minimal intervention with motivated older adults produces meaningful clinical change — has important implications for how mental health professionals approach older adult clients with mild to moderate alcohol misuse.</p>

<p>Motivational Interviewing (MI) is particularly well-suited to older adult substance use treatment because it is non-confrontational, respects autonomy, and begins from an honest exploration of the client's own ambivalence — which older adults often experience acutely between their lifelong identity as responsible, functional adults and the reality of their current use. The MI spirit of compassion, partnership, evocation, and acceptance translates directly to the clinical respect and non-judgment that older adults require to disclose stigmatized behavior.</p>

<p>The assessment-feedback component of brief intervention deserves particular attention with older adults. Providing concrete, personalized feedback — "Your drinking is above the level that is considered safe for someone your age, and it may be contributing to your sleep problems and the falls you've been having" — connects the abstract concern about drinking to the specific health consequences the older adult is already experiencing and cares about. Older adults are often motivated by health concerns and by the desire to maintain independence — framing reduced drinking as a pathway to better sleep, reduced fall risk, improved cognitive clarity, and maintained independence leverages these specific motivations effectively.</p>

<h2>Prescription Medication Misuse: The Benzodiazepine Problem</h2>
<p>Benzodiazepine misuse in older adults represents a clinical crisis that differs qualitatively from illicit drug use in its origin and presentation. The vast majority of older adults who misuse benzodiazepines received their initial prescription from a legitimate medical provider and have been using the medication as directed for years or decades — often for anxiety or insomnia that was once clinically appropriate to treat pharmacologically. The misuse has often developed gradually and without conscious awareness: the medication stopped working as well, the dose was gradually increased, attempts to reduce use produced intolerable anxiety or insomnia, and the medication gradually became not a treatment for symptoms but a driver of them.</p>

<p>The Beers Criteria, maintained by the American Geriatrics Society, explicitly identifies benzodiazepines as potentially inappropriate medications for older adults due to their association with falls, hip fractures, motor vehicle accidents, delirium, and cognitive impairment. Despite this, benzodiazepine prescribing in older adult populations remains dramatically elevated — reflecting the inertia of long-standing prescriptions, provider reluctance to deprescribe, and the genuine difficulty of managing the discontinuation syndrome in long-term users.</p>

<p>The clinical role of the mental health professional in benzodiazepine misuse is primarily one of recognition, psychoeducation, supportive assistance through the deprescription process, and treatment of the underlying anxiety or insomnia with non-pharmacological evidence-based approaches — particularly Cognitive Behavioral Therapy for Insomnia (CBT-I), which has demonstrated superiority to medication for chronic insomnia in older adults, and CBT-based anxiety treatment. The deprescription of benzodiazepines must be managed medically through gradual tapering — abrupt discontinuation of long-term benzodiazepine use can cause life-threatening withdrawal seizures and must be medically supervised.</p>

<h2>Opioid Misuse in Older Adults</h2>
<p>Opioid prescribing for chronic pain is disproportionately concentrated in older adult populations, and the intersection of legitimate pain management need with the addiction vulnerability of this population creates complex clinical terrain. Older adults with chronic pain — from arthritis, neuropathy, postherpetic neuralgia, cancer, and other conditions — may have genuine, substantial analgesic needs that require pharmacological management. The question is not whether pain should be treated but whether the treatment is producing dependence, misuse, or addiction alongside analgesia.</p>

<p>Signs of opioid misuse in older adults include: requesting early prescription refills; reporting medication loss or theft repeatedly; obtaining prescriptions from multiple providers; escalating use beyond prescribed parameters; continuing use despite adverse consequences including falls or cognitive impairment; and visible distress when the medication is unavailable. These signs may be attributed to pain escalation or to legitimate need without careful clinical assessment that includes objective indicators alongside subjective report.</p>

<p>The CAGE-AID (CAGE Adapted to Include Drugs) provides a brief, validated screen for opioid misuse that can be incorporated into routine clinical assessment. As with alcohol misuse, a non-judgmental, health-focused conversational approach — connecting reduced opioid use to specific health goals the older adult values — is more effective than confrontational or accusatory approaches that activate shame and defensiveness.</p>

<h2>Treatment Considerations and Referral</h2>
<p>Older adults who require more intensive treatment than brief intervention can provide face specific access and engagement challenges that clinicians must address proactively. Traditional substance use treatment programs — intensive outpatient, residential, 12-step groups — were developed for and normed on younger adult populations and may be experienced by older adults as culturally inappropriate, physically inaccessible, and insufficiently attentive to their specific clinical needs (particularly the co-occurring depression, grief, chronic illness, and social isolation that often drive geriatric substance use).</p>

<p>Age-specific treatment groups, where available, consistently outperform mixed-age programs for older adult substance use treatment — generating higher engagement, lower dropout rates, and superior outcomes. The peer cohesion and shared cultural context of same-generation groups reduces shame, normalizes the treatment experience, and allows for discussion of the specific losses, health concerns, and meaning-making challenges that characterize late-life substance use presentations.</p>

<p>Community and digital resources are increasingly important in the geriatric substance use treatment landscape. SMART Recovery offers a secular, science-based alternative to 12-step programs that some older adults find more accessible. Telephone and video-based counseling options expand treatment access for older adults with transportation or mobility limitations. Coordination with primary care providers — to address the medical dimensions of alcohol and medication misuse, to facilitate the deprescription of inappropriate medications, and to manage withdrawal safely — is essential in comprehensive geriatric substance use treatment.</p>

<p>Relapse prevention in older adult substance use treatment must address the specific triggers of late-life use — grief, loneliness, pain, boredom, loss of purpose — that differ from the environmental and social triggers that dominate treatment for younger adults. Building a life that is worth staying sober for is the foundational relapse prevention task, and for older adults this means directly engaging the depression, social isolation, and meaning-deficits that drove the substance use in the first place. Treating the substance use without treating the underlying depression and loneliness is treating the symptom while leaving the cause unaddressed.</p>

<h2>Family Involvement and System-Level Considerations</h2>
<p>Family members play a critical role in both the identification and the treatment of geriatric substance use disorders. Adult children who have observed a parent's drinking pattern for years may be simultaneously aware of the problem, emotionally conflicted about addressing it, practically uncertain about how to help, and burdened by their own responses to the parent's behavior. Family psychoeducation — explaining the physiological realities of age-related sensitivity to alcohol, the medical consequences of continued use, and the availability of effective treatment — can shift family members from helpless observers to active participants in the treatment process.</p>

<p>Family members' own codependent patterns — enabling behaviors including purchasing alcohol for the older adult, excusing consequences, or protecting the older adult from the natural outcomes of their use — require direct clinical attention. Al-Anon and similar family support resources offer peer-based support for family members that complements professional clinical intervention and provides sustained community that extends beyond the treatment episode.</p>`,
        },
        {
          type: "knowledgeCheck",
          title: "Knowledge Check — Module 2",
          showExplanations: true,
          questions: [
            {
              question: "The FRAMES model for brief intervention with older adults who engage in at-risk drinking includes which of the following core components?",
              type: "multiple_choice",
              options: [
                "Feedback, Restriction, Abstinence, Medical referral, Education, and Support",
                "Feedback, Responsibility, Advice, Menu of options, Empathy, and Self-efficacy",
                "Facts, Relationships, Assessment, Motivation, Education, and Support",
                "Functional assessment, Referral, Addiction education, Medical collaboration, Empathy, and Safety planning"
              ],
              correctAnswer: 1,
              explanation: "FRAMES stands for Feedback (personalized information about current use and consequences), Responsibility (emphasizing the client's autonomy and personal responsibility for change), Advice (clear clinical guidance about recommended behavior change), Menu (a range of options for making change), Empathy (a warm, non-judgmental therapeutic style), and Self-efficacy (support for the client's belief in their capacity to change)."
            },
            {
              question: "Cognitive Behavioral Therapy for Insomnia (CBT-I) is preferred over continued benzodiazepine prescription for older adults with chronic insomnia because:",
              type: "multiple_choice",
              options: [
                "CBT-I is faster to implement and requires fewer clinical sessions than medication management",
                "CBT-I has demonstrated superiority to medication for chronic insomnia in older adults, while benzodiazepines carry significant risks including falls, cognitive impairment, and delirium",
                "Benzodiazepines are not approved for insomnia treatment in any age group",
                "CBT-I eliminates the need for any future mental health treatment"
              ],
              correctAnswer: 1,
              explanation: "CBT-I has demonstrated efficacy that equals or exceeds pharmacotherapy for chronic insomnia in older adults, with the significant advantage of not carrying the risks associated with benzodiazepines — including falls, hip fractures, delirium, and cognitive impairment that are specifically identified in the Beers Criteria as potentially inappropriate for older adults."
            },
            {
              question: "Age-specific substance use treatment groups consistently outperform mixed-age programs for older adults primarily because:",
              type: "multiple_choice",
              options: [
                "Older adults learn better in smaller group formats",
                "Mixed-age programs do not accept clients over 65",
                "Same-generation peer cohesion reduces shame, allows discussion of age-specific issues, and is experienced as more culturally appropriate by older adult clients",
                "Older adults are distracted by younger clients' technology use in mixed-age groups"
              ],
              correctAnswer: 2,
              explanation: "Age-specific treatment groups generate higher engagement, lower dropout, and superior outcomes for older adults by providing culturally appropriate peer context, reducing shame through normalization among peers, and allowing discussion of the specific losses, health concerns, and meaning-deficits that characterize late-life substance use — topics that may feel irrelevant or inappropriate in mixed-age settings."
            }
          ]
        },
        {
          type: "text",
          content: `<h2>Preparing for the Final Assessment</h2><p>Review the key themes from both modules: the epidemiology and physiological basis of geriatric substance use harm, age-specific screening tools, the distinction between early-onset and late-onset trajectories, the FRAMES model and Motivational Interviewing for brief intervention, benzodiazepine and opioid misuse in older adults, treatment considerations and referral, and family system involvement. A score of 80% or higher is required for CE credit. Three attempts are permitted.</p>`
        },
        {
          type: "quiz",
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          shuffleQuestions: true,
          showExplanations: false,
          title: "Final Assessment — CR-613: Seasoned and Struggling",
          questions: [
            { question: "The SMAST-G (Short Michigan Alcoholism Screening Test — Geriatric Version) is preferred over standard adult screening tools for older adults because:", type: "multiple_choice", options: ["It is shorter and faster to administer", "It includes items specific to geriatric presentations such as drinking to cope with loneliness and bereavement, and avoids occupational consequence items that are irrelevant for retired older adults", "It produces legally defensible diagnostic determinations", "It includes neuropsychological testing items"], correctAnswer: 1, explanation: "The SMAST-G was specifically developed and validated for older adults, capturing the social and psychological dimensions of geriatric alcohol misuse — including drinking to cope with grief and isolation — that general adult instruments miss. Standard tools asking about occupational and social consequences are less relevant for retired, socially reduced older adults." },
            { question: "The Beers Criteria specifically identifies benzodiazepines as potentially inappropriate for older adults primarily because of:", type: "multiple_choice", options: ["Their potential for abuse and diversion to illegal markets", "Their association with falls, hip fractures, delirium, cognitive impairment, and motor vehicle accidents in older adult populations", "Their high cost relative to other anxiolytic medications", "Their documented ineffectiveness for anxiety after age 65"], correctAnswer: 1, explanation: "The Beers Criteria, maintained by the American Geriatrics Society, lists benzodiazepines as potentially inappropriate for older adults due to their association with significant adverse outcomes including falls, hip fractures, delirium, cognitive impairment, and motor vehicle accidents — all of which are amplified by the increased CNS sensitivity and reduced drug clearance of aging." },
            { question: "Which of the following physiological changes of aging MOST directly explains why older adults achieve higher blood alcohol concentrations from the same amount of alcohol compared to younger adults?", type: "multiple_choice", options: ["Increased gastric absorption of alcohol due to reduced stomach acid", "Reduced total body water, so the same amount of alcohol is distributed through a smaller water compartment", "Increased liver enzyme activity that paradoxically converts more alcohol to acetaldehyde", "Reduced sensitivity of brain receptors that requires higher blood levels to achieve equivalent intoxication"], correctAnswer: 1, explanation: "Reduced total body water with aging means that the same amount of alcohol is distributed through a smaller aqueous compartment, producing a higher blood alcohol concentration per standard drink. Combined with reduced liver metabolism and increased receptor sensitivity, this produces greater effect from the same consumption." },
            { question: "Project GOAL (Guiding Older Adult Lifestyles) demonstrated that:", type: "multiple_choice", options: ["Intensive residential treatment is required for older adult alcohol use disorder", "Even two brief counseling visits with at-risk drinking older adults produced significant, sustained reductions in alcohol consumption", "Brief interventions are ineffective for older adults and must be supplemented with pharmacotherapy", "Older adults require specialized neuropsychological testing before any substance use intervention"], correctAnswer: 1, explanation: "Fleming et al.'s Project GOAL demonstrated that two brief counseling visits with at-risk drinking older adults in primary care produced significant reductions in alcohol consumption maintained at 12-month follow-up — establishing that even minimal intervention is effective for this population when delivered with age-appropriate framing." },
            { question: "Abrupt discontinuation of long-term benzodiazepine use should be avoided in older adults primarily because:", type: "multiple_choice", options: ["It causes immediate cognitive improvement that can be psychologically destabilizing", "It can cause life-threatening withdrawal seizures, requiring medically supervised gradual tapering", "It violates the prescribing physician's authority to manage medications", "It causes irreversible neurological damage in older adults"], correctAnswer: 1, explanation: "Long-term benzodiazepine dependence requires gradual, medically supervised tapering — abrupt discontinuation can precipitate life-threatening withdrawal seizures. Mental health clinicians should never advise or facilitate abrupt discontinuation but should coordinate with medical providers to ensure safe deprescription." },
            { question: "The primary motivation most effective for engaging older adults in reducing alcohol use is:", type: "multiple_choice", options: ["Abstract concern about long-term liver damage", "Desire to be a good role model for grandchildren", "Concrete connection between reduced use and specific health goals they already value — better sleep, reduced fall risk, improved cognitive clarity, maintained independence", "Social pressure from family members"], correctAnswer: 2, explanation: "Older adults are highly motivated by health and independence. Connecting reduced drinking to specific health outcomes they are already experiencing and concerned about — sleep improvement, reduced fall risk, better cognitive clarity, maintained independence — leverages existing motivations effectively and is more persuasive than abstract or future-oriented health concerns." },
            { question: "An older adult client who has been prescribed opioids for chronic arthritis pain requests prescription refills significantly before they are due and reports the medication was 'lost.' The MOST appropriate clinical response includes:", type: "multiple_choice", options: ["Accept the explanation at face value and provide a referral for the next refill", "Terminate the client from treatment for drug-seeking behavior", "Conduct a thorough opioid misuse assessment including the CAGE-AID, coordinate with prescribing physician, and explore the client's pain management and potential misuse in a non-judgmental clinical framework", "Report the client to law enforcement for potential prescription fraud"], correctAnswer: 2, explanation: "Repeated early refill requests and reports of lost medication are indicators of potential opioid misuse that warrant formal assessment, coordination with prescribing providers, and a careful clinical exploration in a non-judgmental framework. Unilateral termination or legal reporting without thorough assessment is clinically inappropriate." },
            { question: "Motivational Interviewing (MI) is particularly well-suited to geriatric substance use treatment because:", type: "multiple_choice", options: ["It is faster than other evidence-based approaches and requires fewer sessions", "Its non-confrontational, autonomy-respecting spirit aligns with older adults' need for non-judgment in discussing stigmatized behavior, and it effectively engages ambivalence", "It is the only evidence-based approach validated specifically for older adult populations", "It requires no specialized training and can be implemented immediately by any clinician"], correctAnswer: 1, explanation: "The MI spirit of compassion, partnership, evocation, and acceptance is particularly congruent with the clinical needs of older adults who carry significant stigma about substance use and require a non-judgmental space to disclose and explore problematic behavior. MI's respect for autonomy is also important for a population that highly values independence." },
            { question: "Late-onset substance use disorder in older adults carries a relatively positive prognosis because:", type: "multiple_choice", options: ["Older adults are more biologically resilient to substance effects than younger adults", "The disorder has not had decades to develop entrenched patterns, identity organization, or severe comorbidities — and the individual has a long reference history of controlled use", "Late-onset presentations respond better to pharmacotherapy than psychosocial intervention", "Family members are more involved and supportive in late-onset cases"], correctAnswer: 1, explanation: "Late-onset presentations are associated with fewer psychiatric comorbidities, better social support, no longstanding identity organization around substance use, and the older adult's own reference experience of decades of controlled or absent use — factors that support positive treatment outcomes, particularly with appropriate brief intervention and motivational approaches." },
            { question: "Relapse prevention with older adult clients is MOST effectively oriented toward:", type: "multiple_choice", options: ["Identifying and avoiding the social and environmental cues that trigger use in younger adults", "Addressing the depression, loneliness, grief, and meaning-deficits that typically drive late-life substance use", "Developing contingency management systems with family member reinforcement", "Residential monitoring in sober living communities designed for older adults"], correctAnswer: 1, explanation: "The late-life drivers of substance use — grief, loneliness, loss of purpose, depression, and pain — must be directly treated as part of relapse prevention. Treating substance use without treating its underlying drivers leaves the clinical cause unaddressed and greatly increases relapse risk." },
            { question: "Which statement BEST describes the ethical framing of substance use assessment with older adult clients who carry significant generational stigma?", type: "multiple_choice", options: ["Clinicians should confront the stigma directly by explaining that addiction is not a moral failing", "Assessment should be framed in moralistic terms that resonate with the client's own value system", "Assessment should be approached with non-judgmental curiosity that acknowledges the cultural context while creating safety for honest disclosure", "Clinicians should avoid the topic entirely until the client spontaneously raises it"], correctAnswer: 2, explanation: "Older adults shaped by cohort norms that equate substance use with moral failure require clinical engagement that explicitly creates non-judgmental space for disclosure. This does not mean ignoring the cultural context — which should be acknowledged — but rather ensuring that the clinical frame communicates that the clinician is an ally in the client's health, not a moral arbiter." },
            { question: "Family psychoeducation in geriatric substance use treatment MOST appropriately focuses on:", type: "multiple_choice", options: ["Providing detailed clinical records from the treatment sessions to family members", "Explaining the physiological realities of age-related sensitivity, medical consequences of continued use, and availability of effective treatment — shifting family from helpless observers to active supporters", "Encouraging family members to implement consequences for continued use without clinical guidance", "Excluding family members from the treatment process to protect client autonomy"], correctAnswer: 1, explanation: "Effective family involvement in geriatric substance use treatment includes psychoeducation about the physiological dimensions of aging and substance use, guidance on supportive (rather than enabling) responses, and referral to family support resources like Al-Anon — transforming family members from helpless or inadvertently enabling bystanders into active therapeutic allies." },
            { question: "Cognitive Behavioral Therapy for Insomnia (CBT-I) addresses the underlying mechanisms of insomnia in older adults through which primary approach?", type: "multiple_choice", options: ["Pharmacological modulation of sleep architecture", "Modification of dysfunctional sleep-related cognitions and behaviors — including sleep restriction, stimulus control, and cognitive restructuring about sleep expectations", "Relaxation training exclusively, without addressing cognitive factors", "Hypnotic induction techniques that restore natural sleep patterns"], correctAnswer: 1, explanation: "CBT-I addresses the cognitive and behavioral factors that perpetuate insomnia — including dysfunctional beliefs about sleep, behaviors that undermine sleep homeostasis, and conditioned arousal associated with the sleep environment — through techniques including sleep restriction, stimulus control, relaxation training, and cognitive restructuring." },
            { question: "The CAGE-AID instrument is used in geriatric practice to screen for:", type: "multiple_choice", options: ["Cognitive impairment associated with alcohol use", "Alcohol and drug use disorders, adapted to include prescription drug misuse", "Geriatric depression associated with substance use", "Withdrawal severity in older adults discontinuing alcohol"], correctAnswer: 1, explanation: "The CAGE-AID (CAGE Adapted to Include Drugs) extends the classic CAGE alcohol screening questions to include prescription and illicit drug misuse, making it particularly useful in older adult populations where prescription medication misuse is a significant clinical concern alongside alcohol." },
            { question: "Which barrier to treatment MOST commonly prevents older adults with substance use disorders from accessing appropriate care?", type: "multiple_choice", options: ["Cost of treatment programs, which insurance typically does not cover for older adults", "Lack of available treatment programs in most geographic areas", "Generational stigma, programs not designed for older adult needs, and clinicians who fail to screen or refer", "Physical inability to attend treatment due to advanced age"], correctAnswer: 2, explanation: "The most significant barriers are generational stigma that prevents disclosure and help-seeking; substance use treatment programs that were designed for younger adults and are experienced as inappropriate by older clients; and systematic under-screening and under-referral by healthcare providers who do not routinely assess for substance use in older adult patients." }
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
  console.log('  SEEDING CR-613: Seasoned and Struggling');
  console.log('═'.repeat(60));
  const existing = await Course.findOne({ slug: COURSE.slug });
  if (existing) { await Course.findOneAndReplace({ slug: COURSE.slug }, COURSE, { new: true }); console.log('✅ Updated'); }
  else { await Course.create(COURSE); console.log('✅ Created'); }
  console.log(`   ${COURSE.courseCode} | ${COURSE.ceHours} CE Hours | ${COURSE.modules.length} Modules`);
  await mongoose.disconnect();
}
seed().catch(err => { console.error('❌', err); process.exit(1); });
