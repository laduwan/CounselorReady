/**
 * seedCR301_28_Days_Later_Understanding_Addiction_and_Re-18313words.js
 * Source: Course_6_28_Days_Later_Addiction_Counseling_3CE.md | CE: 3 | WC: 18313
 * NOTE: KC questions flagged ⚠️ need correctAnswer verified before publishing.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');

const course = {
  courseCode: 'CR-301',
  slug: '28-days-later-addiction-recovery',
  title: `28 Days Later: Understanding Addiction and Recovery`,
  subtitle: `A Comprehensive 3-Hour CE Course for Licensed Mental Health Professionals`,
  description: `28 Days Later: Understanding Addiction and Recovery`,
  ceHours: 3,
  ceuHours: 3,
  accessType: 'subscription',
  status: 'draft',
  isPublished: false,
  category: 'Addiction',
  nbccContentAreas: ['Counseling Theory/Practice'],
  targetAudience: ['Licensed Professional Counselors','Licensed Clinical Social Workers','Licensed Marriage and Family Therapists','National Certified Counselors'],
  objectives: [    `**Differentiate** between substance use, misuse, and substance use disorders using DSM-5-TR diagnostic criteria`,
    `**Explain** the neurobiological mechanisms underlying addiction, including the brain's reward system and neuroadaptation`,
    `**Apply** evidence-based screening and assessment tools for substance use disorders in clinical practice`,
    `**Implement** motivational interviewing techniques and other evidence-based interventions for clients with SUDs`,
    `**Integrate** relapse prevention strategies and recovery support into comprehensive treatment planning`,
    `**Evaluate** co-occurring disorders and develop integrated treatment approaches for dual diagnosis clients`],
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', licenseType: 'LPC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', approvalStatus: 'approved', hourBreakdown: [{ label: 'core', hours: 3 }] }],
  assessment: {
    passingScore: 80, maxAttempts: 3, showExplanations: false,
    questions: [
      {
        type: "multipleChoice",
        question: `The mesolimbic dopamine pathway connects which two brain structures?`,
        options: [
          { text: `Prefrontal cortex and hippocampus`, isCorrect: true },
          { text: `Ventral tegmental area and nucleus accumbens`, isCorrect: false },
          { text: `Amygdala and hypothalamus`, isCorrect: false },
          { text: `Cerebellum and thalamus`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `A client meets 5 DSM-5-TR criteria for cannabis use disorder. This indicates:`,
        options: [
          { text: `Mild severity`, isCorrect: true },
          { text: `Moderate severity`, isCorrect: false },
          { text: `Severe severity`, isCorrect: false },
          { text: `Subthreshold, no diagnosis`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `In motivational interviewing, "sustain talk" refers to:`,
        options: [
          { text: `Client language favoring change`, isCorrect: true },
          { text: `Client language favoring the status quo`, isCorrect: false },
          { text: `Therapist affirmations and reflections`, isCorrect: false },
          { text: `Commitment statements`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Which alcohol withdrawal assessment tool measures severity across 10 clinical parameters?`,
        options: [
          { text: `AUDIT`, isCorrect: true },
          { text: `CAGE`, isCorrect: false },
          { text: `CIWA-Ar`, isCorrect: false },
          { text: `DAST-10`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Buprenorphine is classified as which type of opioid medication?`,
        options: [
          { text: `Full agonist`, isCorrect: true },
          { text: `Partial agonist`, isCorrect: false },
          { text: `Antagonist`, isCorrect: false },
          { text: `Inverse agonist`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `According to the Minority Stress Model, "expectations of rejection" is an example of:`,
        options: [
          { text: `Distal stressor`, isCorrect: true },
          { text: `Proximal stressor`, isCorrect: false },
          { text: `Resilience factor`, isCorrect: false },
          { text: `Protective factor`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Which statement about medication-assisted treatment for pregnant women with opioid use disorder is accurate?`,
        options: [
          { text: `Rapid detoxification is preferred to protect the fetus`, isCorrect: true },
          { text: `All MAT medications are contraindicated during pregnancy`, isCorrect: false },
          { text: `Buprenorphine and methadone are both recommended treatment options`, isCorrect: false },
          { text: `MAT should be discontinued immediately upon discovering pregnancy`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `The ASAM criteria use how many dimensions to determine appropriate level of care?`,
        options: [
          { text: `Three`, isCorrect: true },
          { text: `Four`, isCorrect: false },
          { text: `Six`, isCorrect: false },
          { text: `Ten`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `In relapse prevention, "playing the tape forward" involves:`,
        options: [
          { text: `Recording therapy sessions for later review`, isCorrect: true },
          { text: `Mentally imagining the full consequences that would follow substance use`, isCorrect: false },
          { text: `Documenting substance use history in detail`, isCorrect: false },
          { text: `Recording cravings in a daily diary`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `According to SAMHSA, which is NOT one of the four dimensions of recovery?`,
        options: [
          { text: `Health`, isCorrect: true },
          { text: `Home`, isCorrect: false },
          { text: `Abstinence`, isCorrect: false },
          { text: `Community`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Research on confrontational approaches in addiction treatment shows they:`,
        options: [
          { text: `Are highly effective for breaking through denial`, isCorrect: true },
          { text: `Are associated with poorer outcomes and increased resistance`, isCorrect: false },
          { text: `Work better than empathic approaches for severe SUDs`, isCorrect: false },
          { text: `Are preferred by most clients`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `When distinguishing substance-induced disorders from independent disorders, which factor is most informative?`,
        options: [
          { text: `Severity of symptoms`, isCorrect: true },
          { text: `Client's stated preference for diagnosis`, isCorrect: false },
          { text: `Whether symptoms persist during sustained abstinence`, isCorrect: false },
          { text: `Insurance coverage considerations`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `Which family-based intervention has the strongest evidence base for adolescent SUDs?`,
        options: [
          { text: `Individual psychoanalysis`, isCorrect: true },
          { text: `Multidimensional Family Therapy`, isCorrect: false },
          { text: `Adult-oriented 12-step facilitation`, isCorrect: false },
          { text: `Wilderness therapy`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `A brief intervention for a client screening positive for hazardous alcohol use should typically:`,
        options: [
          { text: `Last 2-3 hours and cover comprehensive history`, isCorrect: true },
          { text: `Last 5-15 minutes and use MI techniques to raise awareness and motivate change`, isCorrect: false },
          { text: `Require immediate commitment to lifelong abstinence`, isCorrect: false },
          { text: `Focus primarily on medical consequences without discussing change`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      },
      {
        type: "multipleChoice",
        question: `According to Gorski's model, relapse warning signs begin with:`,
        options: [
          { text: `Substance use`, isCorrect: true },
          { text: `External circumstances beyond the person's control`, isCorrect: false },
          { text: `Internal changes in thinking and emotional management`, isCorrect: false },
          { text: `Loss of employment`, isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: ``
      }
    ]
  },
  references: [    { citation: `American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). American Psychiatric Publishing.` },
    { citation: `American Society of Addiction Medicine. (2019). Definition of addiction. https://www.asam.org/quality-care/definition-of-addiction` },
    { citation: `Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P., & Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245-258.` },
    { citation: `Gorski, T. T., & Miller, M. (1986). Staying sober: A guide for relapse prevention. Independence Press.` },
    { citation: `Marlatt, G. A., & Gordon, J. R. (Eds.). (1985). Relapse prevention: Maintenance strategies in the treatment of addictive behaviors. Guilford Press.` },
    { citation: `Meyer, I. H. (2003). Prejudice, social stress, and mental health in lesbian, gay, and bisexual populations: Conceptual issues and research evidence. Psychological Bulletin, 129(5), 674-697.` },
    { citation: `Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press.` },
    { citation: `National Institute on Drug Abuse. (2020). Drugs, brains, and behavior: The science of addiction. National Institutes of Health.` },
    { citation: `Substance Abuse and Mental Health Services Administration. (2023). Key substance use and mental health indicators in the United States: Results from the 2022 National Survey on Drug Use and Health. HHS Publication No. PEP23-07-01-006.` },
    { citation: `Volkow, N. D., Koob, G. F., & McLellan, A. T. (2016). Neurobiologic advances from the brain disease model of addiction. New England Journal of Medicine, 374(4), 363-371.` },
    { citation: `White, W. L. (2009). Peer-based addiction recovery support: History, theory, practice, and scientific evaluation. Great Lakes Addiction Technology Transfer Center.` }],
  sections: [
    {
      order: 1,
      title: `Module 1: THE NEUROSCIENCE AND PHENOMENOLOGY OF ADDICTION`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 1: THE NEUROSCIENCE AND PHENOMENOLOGY OF ADDICTION`,
              subtitle: `28 Days Later: Understanding Addiction and Recovery`,
              sectionNumber: 1,
            },
{
              type: "text",
              order: 2,
              content: `<p><strong>Estimated Time: 30 minutes | 3,600+ words</strong></p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>🎯 PRE-MODULE PULSE CHECK</h2>
<p><em>Before beginning this module, rate your current knowledge and confidence:</em></p><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Understanding the brain's reward system</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Explaining neuroadaptation and tolerance</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Differentiating SUD from recreational use</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Applying DSM-5-TR diagnostic criteria</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table><p><em>Return to this pulse check after completing the module to track your growth.</em></p>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>1.1 Defining Addiction: Beyond Moral Failing</h2>
<p>The conceptualization of addiction has evolved dramatically over the past century. What was once viewed primarily through a moral lens—addiction as weakness, sin, or character defect—is now understood as a complex brain disorder with behavioral, cognitive, and physiological components. This paradigm shift has profound implications for how we approach treatment and how we engage with clients who often carry deep shame about their substance use.</p>
<p>The American Society of Addiction Medicine (ASAM, 2019) defines addiction as "a treatable, chronic medical disease involving complex interactions among brain circuits, genetics, the environment, and an individual's life experiences. People with addiction use substances or engage in behaviors that become compulsive and often continue despite harmful consequences."</p>
<p>This definition highlights several critical elements: addiction is treatable (offering hope), chronic (requiring ongoing management rather than cure), medical (reducing stigma), and complex (acknowledging multiple contributing factors). As clinicians, embracing this biopsychosocial model allows us to meet clients where they are without judgment while providing effective, evidence-based interventions.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>The Spectrum of Substance Use</h2>
<p>Not all substance use constitutes a disorder. Understanding the continuum of use helps clinicians accurately assess client presentations:</p>
<p><strong>Abstinence:</strong> No use of substances. While often a treatment goal, abstinence is not the only marker of recovery, and harm reduction approaches recognize other valid endpoints.</p>
<p><strong>Experimental/Recreational Use:</strong> Occasional, controlled use without significant negative consequences. Many individuals use alcohol or cannabis recreationally throughout their lives without developing problematic patterns.</p>
<p><strong>Substance Misuse:</strong> Use that creates problems but does not meet full diagnostic criteria for a disorder. Examples include binge drinking that results in missed work or using prescription medications in ways not prescribed.</p>
<p><strong>Substance Use Disorder (SUD):</strong> A diagnosable condition characterized by a cluster of cognitive, behavioral, and physiological symptoms indicating continued use despite significant substance-related problems.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>⚡ MYTH VS. FACT: ADDICTION FUNDAMENTALS</h2><table class="cr-table">
<tr><th>Myth</th><th>Fact</th></tr>
<tr><td>"Addiction is a choice—people could stop if they really wanted to."</td><td>Addiction involves fundamental changes to brain structure and function that impair impulse control and decision-making. While initial substance use involves choice, continued use in the face of consequences reflects neurobiological changes, not moral weakness.</td></tr>
<tr><td>"You have to hit rock bottom before you can recover."</td><td>Research consistently shows that earlier intervention leads to better outcomes. Waiting for "rock bottom" allows continued damage to health, relationships, and functioning. Motivational interviewing and SBIRT approaches effectively engage individuals at all stages.</td></tr>
<tr><td>"Addiction only affects certain types of people."</td><td>Addiction affects individuals across all demographics, socioeconomic levels, professions, and backgrounds. Genetic factors account for 40-60% of vulnerability, and environmental factors affect everyone regardless of background.</td></tr>
<tr><td>"Medication-assisted treatment just replaces one addiction with another."</td><td>Medications like buprenorphine, methadone, and naltrexone are evidence-based treatments that normalize brain function, reduce cravings, and prevent overdose. They do not produce the euphoric effects of misused substances and enable functional recovery.</td></tr>
</table>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>1.2 The Brain's Reward System: Understanding the Hijacked Circuit</h2>
<p>To effectively treat addiction, clinicians must understand the neurobiological mechanisms that drive compulsive substance use. The brain's reward system—designed to reinforce survival behaviors like eating, social bonding, and reproduction—becomes hijacked by substances that artificially stimulate these circuits far beyond natural rewards.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>The Mesolimbic Dopamine Pathway</h2>
<p>The primary circuit involved in addiction is the mesolimbic dopamine pathway, which connects the ventral tegmental area (VTA) in the midbrain to the nucleus accumbens (NAc) in the basal forebrain. When we engage in pleasurable activities, dopamine neurons in the VTA release dopamine into the NAc, creating feelings of pleasure and reinforcing the behavior.</p>
<p>Natural rewards (food, sex, social connection) produce modest, regulated dopamine increases. Substances of abuse, however, flood the system with dopamine at levels 2-10 times higher than natural rewards:</p><table class="cr-table">
<tr><th>Substance</th><th>Dopamine Increase (Above Baseline)</th></tr>
<tr><td>Food</td><td>50-100%</td></tr>
<tr><td>Sex</td><td>100-200%</td></tr>
<tr><td>Alcohol</td><td>100-200%</td></tr>
<tr><td>Nicotine</td><td>150-200%</td></tr>
<tr><td>Cocaine</td><td>300-400%</td></tr>
<tr><td>Methamphetamine</td><td>1,000%+</td></tr>
</table><p>This supraphysiological dopamine release creates powerful memories linking the substance with pleasure, while simultaneously downregulating the brain's natural reward sensitivity.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Neuroadaptation: The Brain's Attempt to Restore Balance</h2>
<p>The brain constantly seeks homeostasis. When repeatedly flooded with dopamine from substance use, it adapts through two primary mechanisms:</p>
<p><strong>Downregulation:</strong> The brain reduces the number of dopamine receptors (particularly D2 receptors) in the NAc, requiring more substance to achieve the same effect. This is the neurobiological basis of tolerance.</p>
<p><strong>Opponent Process:</strong> The brain activates stress systems (particularly corticotropin-releasing factor and norepinephrine) to counteract the artificial pleasure. When the substance wears off, these stress systems remain active, creating dysphoria, anxiety, and craving. This is the neurobiological basis of withdrawal.</p>
<p>These adaptations mean that over time, individuals with addiction experience diminished pleasure from both substances and natural rewards (anhedonia), while experiencing heightened negative emotional states when not using. They are no longer using substances to "get high" but rather to feel normal—to escape the dysphoric baseline their brain has established.</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>The Prefrontal Cortex: Impaired Executive Control</h2>
<p>Beyond the reward system, addiction involves dysfunction in the prefrontal cortex (PFC), the brain region responsible for executive functions including impulse control, decision-making, and weighing long-term consequences against short-term rewards.</p>
<p>Chronic substance use reduces activity and gray matter volume in the PFC, impairing the individual's ability to:</p>
<ul>
<li>Inhibit impulses to use substances</li>
<li>Consider future consequences</li>
<li>Maintain motivation for recovery goals</li>
<li>Regulate emotional responses to stress</li>
</ul>
<p>This neurobiological impairment explains why individuals continue using despite clearly understanding the consequences—their "brake pedal" is compromised while their "accelerator" (craving) is overactive.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>The Stress System: Allostatic Load and Negative Reinforcement</h2>
<p>While positive reinforcement (seeking pleasure) drives early substance use, negative reinforcement (avoiding discomfort) increasingly dominates as addiction progresses. This shift reflects changes in the brain's stress systems.</p>
<p>The hypothalamic-pituitary-adrenal (HPA) axis and extended amygdala become dysregulated through chronic substance use. Corticotropin-releasing factor (CRF), norepinephrine, and dynorphin are upregulated, creating a persistent state of stress and dysphoria when not using.</p>
<p>Koob and Le Moal (2001) describe this as "allostatic load"—the cumulative cost of repeated deviations from normal homeostatic setpoints. The brain's hedonic setpoint shifts downward, meaning:</p>
<p><strong>Early Use:</strong> Baseline → Intoxication (pleasure) → Return to baseline <strong>Chronic Use:</strong> Lowered baseline (dysphoria) → Intoxication (temporary relief) → Return to lowered baseline</p>
<p>This model explains why individuals in advanced addiction describe using substances not to "get high" but simply to "feel normal" or to escape overwhelming negative emotional states.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Memory Systems and Conditioned Cues</h2>
<p>The hippocampus and amygdala work together to create powerful associative memories linking environmental cues with substance use. Through classical conditioning, previously neutral stimuli (people, places, objects, times, emotional states) become conditioned cues that trigger cravings.</p>
<p>These conditioned responses are remarkably durable and can persist for years after abstinence, explaining why individuals may experience intense cravings when encountering old using environments or associates. Neuroimaging studies show that exposure to drug-related cues activates reward circuits even in individuals who have been abstinent for extended periods.</p>
<p>Clinical implications:</p>
<ul>
<li>Clients should identify and initially avoid high-risk cues when possible</li>
<li>Cue exposure with response prevention may be helpful for some clients</li>
<li>New learning (extinction) does not erase old conditioning—it competes with it</li>
<li>Context matters: Learning in treatment may not transfer to using environments</li>
</ul>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>The Insula: Interoceptive Awareness and Craving</h2>
<p>The insula, a cortical region involved in interoceptive awareness (perceiving internal body states), plays a crucial role in translating bodily sensations into conscious urges to use. The insula integrates signals about heart rate, breathing, gut sensations, and other body states into the subjective experience of craving.</p>
<p>Research on individuals with insula damage has shown dramatically reduced craving and easier smoking cessation, highlighting this region's importance. This has implications for mindfulness-based interventions, which teach clients to observe bodily sensations (including craving) without automatically reacting to them.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>📋 CLINICAL VIGNETTE: MEET DEREK</h2>
<p><strong>Derek</strong> is a 42-year-old African American man referred by his primary care physician after routine bloodwork revealed elevated liver enzymes. Derek works as a regional sales manager and has been married to his wife Keisha for 15 years. They have two children, ages 10 and 13.</p>
<p>During your initial session, Derek appears well-groomed but slightly anxious. He minimizes his drinking, stating, "I just have a few beers to unwind after work. Lots of guys in sales drink more than me." When you ask about quantity, he estimates "maybe 4-5 beers most nights, sometimes more on weekends when watching sports."</p>
<p>Derek reports that Keisha has been "nagging" him about his drinking, and they've had several arguments about it recently. He also mentions he's been "a little foggy" in the mornings and had to start setting multiple alarms to wake up on time. He denies any DUIs or legal problems but admits he's probably driven when he "shouldn't have" a few times.</p>
<p>When you ask how he feels when he doesn't drink, Derek pauses and says, "Honestly? I get kind of edgy. Irritable. Can't really relax until I have that first beer."</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>🔀 DECISION POINT: INITIAL ENGAGEMENT</h2>
<p>Based on Derek's presentation, what is your primary goal for this first session?</p>
<p><strong>Option A:</strong> Confront Derek directly about his denial and help him see the severity of his drinking.</p>
<p><strong>Option B:</strong> Build rapport and gather more assessment information while expressing empathy for his situation.</p>
<p><strong>Option C:</strong> Immediately recommend he attend AA meetings and commit to abstinence.</p>
<p><strong>Option D:</strong> Focus exclusively on the medical findings and defer discussion of drinking patterns.</p>
<p><details> <summary><strong>Click to reveal optimal response and rationale</strong></summary></p>
<p><strong>Optimal Response: Option B</strong></p>
<p>Building rapport and gathering comprehensive assessment information while expressing empathy is the most clinically appropriate initial approach. Research on therapeutic alliance consistently shows that the quality of the counselor-client relationship is one of the strongest predictors of treatment outcome, regardless of therapeutic modality.</p>
<p><strong>Why Option A is suboptimal:</strong> Direct confrontation early in treatment often increases resistance and defensiveness. Derek is already showing ambivalence (he came to the session, after all), and confrontation may push him toward the "resistant" pole of his ambivalence rather than helping him explore change.</p>
<p><strong>Why Option C is suboptimal:</strong> Prescribing a specific recovery pathway (AA, abstinence) before adequate assessment and without collaborative goal-setting violates principles of person-centered care and may alienate Derek before treatment has begun. Additionally, 12-step programs, while effective for many, are not the only evidence-based approach.</p>
<p><strong>Why Option D is suboptimal:</strong> While the medical findings provide a useful entry point, focusing exclusively on physical symptoms misses the opportunity to understand Derek's relationship with alcohol in its full context and to begin building the therapeutic relationship.</p>
<p><strong>Clinical Note:</strong> Meeting clients where they are does not mean avoiding the topic of substance use—it means approaching it with curiosity, empathy, and respect for the client's autonomy while providing accurate information about risks and options.</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>1.3 DSM-5-TR Diagnostic Criteria for Substance Use Disorders</h2>
<p>The DSM-5-TR consolidated previous distinctions between "substance abuse" and "substance dependence" into a single diagnosis of Substance Use Disorder, specified by substance type and severity level. This dimensional approach recognizes addiction as existing on a continuum rather than as a categorical present/absent condition.</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Historical Context: From Moral Model to Medical Model</h2>
<p>Understanding the evolution of diagnostic approaches provides context for current practice. In the DSM-III (1980), substance use problems were divided into "abuse" (social consequences) and "dependence" (physiological symptoms). This binary system created a false hierarchy suggesting physiological dependence was more serious than social problems.</p>
<p>Research demonstrated that individuals with social consequences but no physiological dependence often had equally serious problems and treatment needs. The DSM-5 (2013) eliminated this distinction, creating a single disorder on a severity continuum. This change has important clinical implications:</p>
<ul>
<li>Individuals with "mild" SUD still warrant intervention</li>
<li>Severity can change over time, requiring ongoing assessment</li>
<li>Treatment intensity should match current severity, not historical diagnosis</li>
<li>The focus shifts from labels to specific symptom patterns and functional impairment</li>
</ul>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Diagnostic Criteria</h2>
<p>A diagnosis of SUD requires a problematic pattern of substance use leading to clinically significant impairment or distress, manifested by at least 2 of the following 11 criteria within a 12-month period:</p>
<p><strong>Impaired Control (Criteria 1-4):</strong></p>
<ol>
<li>Taking the substance in larger amounts or over a longer period than intended</li>
<li>Persistent desire or unsuccessful efforts to cut down or control use</li>
<li>Spending a great deal of time obtaining, using, or recovering from the substance</li>
<li>Craving, or a strong desire or urge to use the substance</li>
</ol>
<p><strong>Social Impairment (Criteria 5-7):</strong></p>
<ol>
<li>Recurrent use resulting in failure to fulfill major role obligations at work, school, or home</li>
<li>Continued use despite persistent or recurrent social or interpersonal problems caused or exacerbated by substance effects</li>
<li>Important social, occupational, or recreational activities given up or reduced because of use</li>
</ol>
<p><strong>Risky Use (Criteria 8-9):</strong></p>
<ol>
<li>Recurrent use in situations in which it is physically hazardous</li>
<li>Continued use despite knowledge of having a persistent or recurrent physical or psychological problem likely caused or exacerbated by the substance</li>
</ol>
<p><strong>Pharmacological Indicators (Criteria 10-11):</strong></p>
<ol>
<li>Tolerance, defined by either: (a) need for markedly increased amounts to achieve intoxication or desired effect, or (b) markedly diminished effect with continued use of the same amount</li>
<li>Withdrawal, manifested by either: (a) characteristic withdrawal syndrome for the substance, or (b) the substance (or a closely related substance) is taken to relieve or avoid withdrawal symptoms</li>
</ol>
<p><strong>Important Diagnostic Notes:</strong></p>
<p><em>Criterion 4 (Craving)</em> was added in DSM-5 based on research showing craving predicts relapse and is a distinct clinical phenomenon from other criteria. Craving can be assessed by asking: "Do you have strong urges or desires to use? How often? How intense?"</p>
<p><em>Criteria 10-11 (Tolerance/Withdrawal)</em> should not be counted if they occur only during appropriate medical use of prescribed medications. A patient on stable opioid therapy for chronic pain may develop physiological tolerance without having an SUD.</p>
<p><em>Specifiers</em> include:</p>
<ul>
<li>In early remission: 3-12 months without criteria (except craving)</li>
<li>In sustained remission: 12+ months without criteria (except craving)</li>
<li>On maintenance therapy: Receiving MAT for opioid or tobacco use disorder</li>
<li>In a controlled environment: Where access to substances is restricted</li>
</ul>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Severity Specifiers</h2><table class="cr-table">
<tr><th>Severity</th><th>Criteria Met</th><th>Clinical Implications</th></tr>
<tr><td><strong>Mild</strong></td><td>2-3 criteria</td><td>May respond to brief intervention; lower intensity treatment often sufficient</td></tr>
<tr><td><strong>Moderate</strong></td><td>4-5 criteria</td><td>Typically requires structured outpatient treatment; may benefit from medication</td></tr>
<tr><td><strong>Severe</strong></td><td>6+ criteria</td><td>Often requires intensive outpatient or residential treatment; medication strongly recommended</td></tr>
</table>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Substance-Specific Diagnostic Considerations</h2>
<p>Different substances have unique patterns of criteria presentation:</p>
<p><strong>Alcohol:</strong> All 11 criteria commonly seen; withdrawal can be medically serious; tolerance often develops gradually over years.</p>
<p><strong>Opioids:</strong> Tolerance and withdrawal develop rapidly with regular use; craving is typically intense; "chasing" the high is common; overdose risk is high, especially with fentanyl contamination.</p>
<p><strong>Stimulants (Cocaine, Methamphetamine):</strong> Tolerance develops quickly; withdrawal is psychological (depression, fatigue, anhedonia) rather than medically dangerous; binge patterns common.</p>
<p><strong>Cannabis:</strong> Withdrawal syndrome is now recognized (irritability, sleep disturbance, decreased appetite); tolerance develops with regular use; impaired control and continued use despite problems are common presenting criteria.</p>
<p><strong>Benzodiazepines/Sedatives:</strong> Cross-tolerant with alcohol; withdrawal can be medically dangerous; often co-occurs with other SUDs; may begin with legitimate prescription use.</p>
<p><strong>Tobacco/Nicotine:</strong> Virtually all regular users meet criteria for tolerance and withdrawal; continued use despite physical problems (e.g., COPD) is common; craving is persistent and intense.</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>🛠️ SKILL BUILDER: APPLYING DSM-5-TR CRITERIA TO DEREK</h2>
<p>Review Derek's presentation and identify which DSM-5-TR criteria appear to be present:</p><table class="cr-table">
<tr><th>Criterion</th><th>Evidence from Vignette</th><th>Present?</th></tr>
<tr><td>1. Larger amounts/longer than intended</td><td></td><td>☐</td></tr>
<tr><td>2. Unsuccessful efforts to cut down</td><td></td><td>☐</td></tr>
<tr><td>3. Great deal of time spent</td><td></td><td>☐</td></tr>
<tr><td>4. Craving</td><td></td><td>☐</td></tr>
<tr><td>5. Failure to fulfill role obligations</td><td></td><td>☐</td></tr>
<tr><td>6. Social/interpersonal problems</td><td></td><td>☐</td></tr>
<tr><td>7. Activities given up</td><td></td><td>☐</td></tr>
<tr><td>8. Use in hazardous situations</td><td></td><td>☐</td></tr>
<tr><td>9. Use despite physical/psychological problems</td><td></td><td>☐</td></tr>
<tr><td>10. Tolerance</td><td></td><td>☐</td></tr>
<tr><td>11. Withdrawal</td><td></td><td>☐</td></tr>
</table><p><details> <summary><strong>Click to reveal answer key</strong></summary></p>
<p><strong>Criteria Present in Derek's Presentation:</strong></p>
<p>| Criterion | Evidence | Present | |-----------|----------|---------| | 1. Larger amounts/longer | "4-5 beers most nights, sometimes more" suggests possible escalation | ✓ Likely | | 4. Craving | "Can't really relax until I have that first beer" | ✓ Yes | | 5. Role obligations | "Foggy" mornings, needing multiple alarms suggests possible work impact | ✓ Possible | | 6. Interpersonal problems | Arguments with wife about drinking | ✓ Yes | | 8. Hazardous use | Admits driving when he "shouldn't have" | ✓ Yes | | 9. Use despite physical problems | Continued drinking despite elevated liver enzymes | ✓ Yes | | 10. Tolerance | High nightly consumption with relatively normal presentation | ✓ Likely | | 11. Withdrawal | "Edgy, irritable" when not drinking | ✓ Yes |</p>
<p><strong>Preliminary Assessment:</strong> Derek appears to meet at least 6-7 criteria, suggesting <strong>Alcohol Use Disorder, Severe</strong>. However, a complete assessment would require more detailed inquiry about each criterion area, including criteria not immediately evident in the vignette (time spent, efforts to cut down, activities given up).</p>
<p><strong>Clinical Note:</strong> This is a preliminary formulation. Comprehensive assessment should include validated screening instruments, collateral information (with consent), and exploration of co-occurring mental health conditions.</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>1.4 Risk and Protective Factors</h2>
<p>Understanding the factors that contribute to addiction vulnerability and resilience helps clinicians develop comprehensive case conceptualizations and targeted interventions.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Genetic Factors (40-60% of Vulnerability)</h2>
<p>Family, twin, and adoption studies consistently demonstrate significant heritability for SUDs. Specific genetic variations affecting dopamine receptors (DRD2), alcohol metabolism (ADH, ALDH), and opioid receptors (OPRM1) have been identified. However, genetics alone do not determine destiny—gene-environment interactions are crucial.</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Developmental Factors</h2>
<p><strong>Age of First Use:</strong> Earlier initiation of substance use strongly predicts later SUD development. The adolescent brain is particularly vulnerable to addiction due to ongoing prefrontal cortex development and heightened reward sensitivity.</p>
<p><strong>Adverse Childhood Experiences (ACEs):</strong> The landmark ACE study demonstrated a dose-response relationship between childhood adversity (abuse, neglect, household dysfunction) and adult substance use. Individuals with 4+ ACEs have 7x the risk of alcoholism and 10x the risk of injection drug use compared to those with no ACEs.</p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>Psychological Factors</h2>
<p><strong>Co-occurring Mental Health Disorders:</strong> Approximately 50% of individuals with SUDs have a co-occurring mental health condition. Common pairings include:</p>
<ul>
<li>Depression and alcohol use disorder</li>
<li>Anxiety disorders and benzodiazepine/alcohol use</li>
<li>PTSD and opioid/alcohol use</li>
<li>ADHD and stimulant use</li>
<li>Bipolar disorder and multiple substances</li>
</ul>
<p><strong>Temperament:</strong> High sensation-seeking, impulsivity, and negative emotionality increase vulnerability.</p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>Social and Environmental Factors</h2>
<p><strong>Peer Influence:</strong> Particularly during adolescence, peer substance use strongly predicts individual use.</p>
<p><strong>Availability and Access:</strong> Geographic and economic access to substances affects use patterns.</p>
<p><strong>Cultural Norms:</strong> Societal attitudes toward specific substances influence use patterns (e.g., alcohol acceptance in many Western cultures).</p>
<p><strong>Socioeconomic Factors:</strong> Poverty, unemployment, lack of educational opportunity, and community disinvestment increase SUD risk.</p>`,
            },
{
              type: "text",
              order: 27,
              content: `<h2>🪞 REFLECTION EXERCISE</h2>
<p>Consider your own clinical practice and personal background:</p>
<ol>
<li><strong>What assumptions or biases might you hold about individuals with substance use disorders?</strong> Consider messages you received from family, culture, media, and professional training.</li>
</ol>
<ol>
<li><strong>How might your personal relationship with substances (including alcohol, caffeine, and medications) influence your clinical work?</strong></li>
</ol>
<ol>
<li><strong>What populations with SUDs might you find most challenging to work with, and why?</strong> What steps could you take to address these challenges?</li>
</ol>
<p><em>Take a moment to write your responses before continuing. This self-awareness work is essential for providing ethical, effective care.</em></p>`,
            },
{
              type: "text",
              order: 28,
              content: `<h2>✅ MODULE 1 KNOWLEDGE CHECK</h2>
<p><strong>Complete all 5 questions. You must answer at least 4 correctly (80%) to proceed.</strong></p>
<p><strong>Question 1:</strong> According to the neurobiological model of addiction, which brain structure is primarily responsible for the impaired impulse control seen in individuals with SUDs?</p>
<p>A) Nucleus accumbens B) Ventral tegmental area C) Prefrontal cortex D) Hippocampus</p>
<p><strong>Question 2:</strong> Derek reports needing "4-5 beers most nights" to relax and feeling "edgy and irritable" when he doesn't drink. These symptoms most clearly indicate which DSM-5-TR criteria?</p>
<p>A) Craving and withdrawal B) Tolerance and hazardous use C) Role impairment and social problems D) Time spent and activities given up</p>
<p><strong>Question 3:</strong> A client who meets 4 DSM-5-TR criteria for a substance use disorder would receive which severity specifier?</p>
<p>A) Mild B) Moderate C) Severe D) In early remission</p>
<p><strong>Question 4:</strong> Which statement best reflects current scientific understanding of addiction?</p>
<p>A) Addiction is primarily a moral failing requiring willpower to overcome B) Addiction is a chronic brain disease with behavioral components that is treatable C) Addiction only develops in individuals with genetic predisposition D) Addiction can be cured through 28 days of residential treatment</p>
<p><strong>Question 5:</strong> The ACE study demonstrated that individuals with 4+ adverse childhood experiences have approximately how many times the risk of alcoholism compared to those with no ACEs?</p>
<p>A) 2 times B) 4 times C) 7 times D) 12 times</p>
<p><details> <summary><strong>Click to reveal answers</strong></summary></p>
<ol>
<li><strong>C) Prefrontal cortex</strong> — The PFC is responsible for executive functions including impulse control. The nucleus accumbens and VTA are part of the reward system, while the hippocampus is involved in memory.</li>
</ol>
<ol>
<li><strong>A) Craving and withdrawal</strong> — "Can't relax until I have that first beer" indicates craving; feeling "edgy and irritable" when not drinking indicates withdrawal symptoms.</li>
</ol>
<ol>
<li><strong>B) Moderate</strong> — DSM-5-TR severity: Mild = 2-3 criteria; Moderate = 4-5 criteria; Severe = 6+ criteria.</li>
</ol>
<ol>
<li><strong>B) Addiction is a chronic brain disease with behavioral components that is treatable</strong> — This reflects the current ASAM definition and biopsychosocial understanding of addiction.</li>
</ol>
<ol>
<li><strong>C) 7 times</strong> — The ACE study found 7x risk of alcoholism and 10x risk of injection drug use for those with 4+ ACEs.</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 29,
              content: `<h2>🎯 POST-MODULE PULSE CHECK</h2>
<p><em>Now that you've completed Module 1, rate your knowledge and confidence again:</em></p><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Understanding the brain's reward system</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Explaining neuroadaptation and tolerance</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Differentiating SUD from recreational use</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Applying DSM-5-TR diagnostic criteria</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table><p><em>Compare your pre and post ratings. Areas with less improvement may benefit from review.</em></p>`,
            }
      ]
    },
    {
      order: 2,
      title: `Module 2: SCREENING, ASSESSMENT, AND DIAGNOSIS`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 2: SCREENING, ASSESSMENT, AND DIAGNOSIS`,
              subtitle: `28 Days Later: Understanding Addiction and Recovery`,
              sectionNumber: 2,
            },
{
              type: "text",
              order: 2,
              content: `<p><strong>Estimated Time: 30 minutes | 3,600+ words</strong></p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>🎯 PRE-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Selecting appropriate screening tools</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Conducting comprehensive SUD assessment</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Assessing withdrawal risk and severity</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Identifying co-occurring disorders</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>2.1 The SBIRT Model: Screening, Brief Intervention, and Referral to Treatment</h2>
<p>Screening, Brief Intervention, and Referral to Treatment (SBIRT) is an evidence-based, public health approach to early identification and intervention for individuals with substance use disorders and those at risk of developing them. Originally developed for healthcare settings, SBIRT principles are now widely applied in mental health, social service, and community settings.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Components of SBIRT</h2>
<p><strong>Screening:</strong> Universal, systematic assessment using validated instruments to identify individuals along the spectrum of substance use, from risky use to severe SUD.</p>
<p><strong>Brief Intervention:</strong> For those with risky use or mild SUD, a short conversation using motivational interviewing techniques to raise awareness of risks and motivate change. Brief interventions typically last 5-15 minutes and have been shown effective in reducing hazardous alcohol use.</p>
<p><strong>Referral to Treatment:</strong> For those with moderate to severe SUD, facilitated referral to specialized substance use treatment services, with warm handoffs and follow-up to maximize engagement.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Evidence Base for SBIRT</h2>
<p>Multiple randomized controlled trials and meta-analyses support SBIRT effectiveness, particularly for alcohol use:</p>
<ul>
<li>10-30% reduction in alcohol consumption at 6-12 month follow-up</li>
<li>Cost savings of $3.81 for every $1 invested (SAMHSA analysis)</li>
<li>Effective across medical, behavioral health, and community settings</li>
<li>Less robust evidence for drugs other than alcohol, though still recommended as best practice</li>
</ul>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>2.2 Validated Screening Instruments</h2>
<p>Selecting appropriate screening tools depends on the setting, population, time available, and substances of concern.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>AUDIT (Alcohol Use Disorders Identification Test)</h2>
<p>The AUDIT is a 10-item screening tool developed by the World Health Organization specifically to identify hazardous drinking, harmful drinking, and alcohol dependence.</p>
<p><strong>Scoring:</strong></p>
<ul>
<li>0-7: Low risk</li>
<li>8-15: Hazardous use (brief intervention recommended)</li>
<li>16-19: Harmful use (brief intervention + continued monitoring)</li>
<li>20+: Possible dependence (referral to specialist assessment)</li>
</ul>
<p><strong>Sample Items:</strong></p>
<ol>
<li>How often do you have a drink containing alcohol?</li>
<li>How many drinks containing alcohol do you have on a typical day when you are drinking?</li>
<li>How often do you have 6 or more drinks on one occasion?</li>
</ol>
<p><strong>Strengths:</strong> Well-validated across cultures; public domain; available in multiple languages <strong>Limitations:</strong> Focused on alcohol only; may underdetect problems in heavy-drinking populations</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>AUDIT-C</h2>
<p>A 3-item version using only the consumption questions (items 1-3). Optimal for quick screening in busy settings.</p>
<p><strong>Scoring:</strong> Positive screen at ≥4 for men, ≥3 for women</p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>DAST-10 (Drug Abuse Screening Test)</h2>
<p>A 10-item yes/no screening tool for drug use problems.</p>
<p><strong>Scoring:</strong></p>
<ul>
<li>0: No problems reported</li>
<li>1-2: Low level</li>
<li>3-5: Moderate level</li>
<li>6-8: Substantial level</li>
<li>9-10: Severe level</li>
</ul>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>CAGE (Cut down, Annoyed, Guilty, Eye-opener)</h2>
<p>A 4-item screening tool for alcohol problems. While widely used, the CAGE has lower sensitivity than AUDIT and is better for detecting dependence than hazardous use.</p>
<p><strong>Questions:</strong></p>
<ol>
<li>Have you ever felt you should <strong>Cut down</strong> on your drinking?</li>
<li>Have people <strong>Annoyed</strong> you by criticizing your drinking?</li>
<li>Have you ever felt bad or <strong>Guilty</strong> about your drinking?</li>
<li>Have you ever had a drink first thing in the morning (<strong>Eye-opener</strong>) to steady your nerves or get rid of a hangover?</li>
</ol>
<p><strong>Scoring:</strong> ≥2 "yes" responses = positive screen</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>NIDA Quick Screen</h2>
<p>A single-item initial screen followed by substance-specific follow-up questions (NIDA-Modified ASSIST).</p>
<p><strong>Initial Question:</strong> "In the past year, how many times have you used an illegal drug or used a prescription medication for non-medical reasons?"</p>
<p>Any response >0 triggers follow-up assessment.</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>📋 CLINICAL VIGNETTE: MEET MARISOL</h2>
<p><strong>Marisol</strong> is a 34-year-old Latina woman who presents at a community mental health center with symptoms of depression and anxiety. She is a single mother of a 6-year-old daughter and works two part-time jobs as a home health aide.</p>
<p>During intake, Marisol completes the AUDIT-C and scores 5 (positive screen). When you ask about her alcohol use, she becomes tearful and says, "It's the only thing that helps me sleep. I know I shouldn't, but I'm so exhausted and stressed all the time."</p>
<p>Further inquiry reveals Marisol drinks 2-3 glasses of wine most nights, sometimes finishing a bottle if she's had a "really bad day." She reports difficulty falling asleep without alcohol and has noticed needing more wine to achieve the same effect. She denies any legal problems, DUIs, or drinking at work but admits she sometimes feels guilty when her daughter sees her drinking.</p>
<p>When asked about other substances, Marisol hesitates before disclosing that she occasionally uses her mother's prescription Xanax (alprazolam) "when the anxiety gets really bad—maybe once or twice a week." She does not have her own prescription and acknowledges this is "probably not okay."</p>
<p>Marisol reports a history of sexual abuse by a family member from ages 8-12. She has never received trauma-focused treatment and reports frequent intrusive memories and nightmares about the abuse.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>🔀 DECISION POINT: ASSESSMENT PRIORITIES</h2>
<p>Given Marisol's complex presentation, which assessment priority is most important to address first?</p>
<p><strong>Option A:</strong> Complete a comprehensive substance use assessment including all DSM-5-TR criteria.</p>
<p><strong>Option B:</strong> Assess for imminent safety concerns including suicidality and current intoxication level.</p>
<p><strong>Option C:</strong> Gather detailed history of the childhood sexual abuse to inform trauma treatment planning.</p>
<p><strong>Option D:</strong> Administer additional screening measures for depression (PHQ-9) and anxiety (GAD-7).</p>
<p><details> <summary><strong>Click to reveal optimal response and rationale</strong></summary></p>
<p><strong>Optimal Response: Option B</strong></p>
<p>Safety assessment must always be the first priority. Before proceeding with comprehensive assessment of substance use, trauma history, or mood symptoms, the clinician must assess for:</p>
<ul>
<li>Current intoxication or withdrawal that could impair judgment or require medical attention</li>
<li>Suicidal ideation, intent, or plan (given depression symptoms and trauma history)</li>
<li>Access to lethal means (including prescription medications like Xanax)</li>
<li>Child safety concerns (6-year-old daughter in the home)</li>
<li>Any current domestic violence or safety threats</li>
</ul>
<p><strong>Why Option A is suboptimal:</strong> While comprehensive SUD assessment is important, it should follow safety assessment.</p>
<p><strong>Why Option C is suboptimal:</strong> Gathering detailed trauma history during an intake session, before establishing safety and rapport, risks retraumatization and may overwhelm the client. Trauma assessment should be conducted carefully and with appropriate pacing.</p>
<p><strong>Why Option D is suboptimal:</strong> Additional screening measures are useful but do not take priority over safety assessment.</p>
<p><strong>Clinical Sequence:</strong> Safety → Screening → Comprehensive Assessment → Diagnosis → Treatment Planning</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>2.3 Comprehensive Substance Use Assessment</h2>
<p>Once screening identifies potential substance use concerns, comprehensive assessment provides the detailed information needed for accurate diagnosis and treatment planning.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Addiction Severity Index (ASI)</h2>
<p>The ASI is the gold-standard comprehensive assessment for substance use disorders, covering seven functional domains:</p>
<ol>
<li>Medical status</li>
<li>Employment and support</li>
<li>Drug use</li>
<li>Alcohol use</li>
<li>Legal status</li>
<li>Family/social status</li>
<li>Psychiatric status</li>
</ol>
<p>Each domain is rated on a 0-9 severity scale based on the client's need for treatment in that area. The ASI provides a holistic picture of how substance use has affected the individual's life functioning.</p>
<p><strong>Administration:</strong> Semi-structured interview, approximately 45-60 minutes <strong>Training Required:</strong> Yes, certification available through treatment Research Institute</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Timeline Followback (TLFB)</h2>
<p>The TLFB is a calendar-based method for obtaining detailed retrospective reports of substance use. Using memory cues (holidays, paydays, memorable events), the clinician works backward to document daily use patterns over a specified period (typically 30-90 days).</p>
<p><strong>Strengths:</strong></p>
<ul>
<li>Quantifies specific consumption patterns</li>
<li>Identifies triggers and high-risk situations</li>
<li>Establishes baseline for measuring treatment progress</li>
<li>Client-generated data increases buy-in</li>
</ul>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Essential Assessment Domains</h2>
<p>A comprehensive SUD assessment should address:</p>
<p><strong>Substance Use History:</strong></p>
<ul>
<li>Substances used (including alcohol, prescription medications, illicit drugs)</li>
<li>Age of first use for each substance</li>
<li>Progression of use over time</li>
<li>Current use patterns (frequency, quantity, route of administration)</li>
<li>Periods of abstinence and what contributed to them</li>
<li>Previous treatment episodes and outcomes</li>
</ul>
<p><strong>Consequences of Use:</strong></p>
<ul>
<li>Medical (health problems, overdoses, injuries)</li>
<li>Psychological (mood, anxiety, psychosis, cognitive impairment)</li>
<li>Social/Interpersonal (relationships, family, isolation)</li>
<li>Occupational/Educational (job loss, performance problems)</li>
<li>Legal (arrests, incarceration, current legal status)</li>
<li>Financial (debt, inability to meet basic needs)</li>
</ul>
<p><strong>Readiness for Change:</strong></p>
<ul>
<li>Current motivation level</li>
<li>Perceived pros and cons of substance use</li>
<li>Perceived pros and cons of changing</li>
<li>Previous change attempts</li>
<li>Confidence in ability to change</li>
</ul>
<p><strong>Recovery Capital:</strong></p>
<ul>
<li>Social supports (family, friends, recovery community)</li>
<li>Stable housing</li>
<li>Employment or meaningful activity</li>
<li>Physical health</li>
<li>Mental health</li>
<li>Financial resources</li>
<li>Transportation</li>
<li>Coping skills</li>
</ul>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>2.4 Withdrawal Assessment and Medical Considerations</h2>
<p>Withdrawal from certain substances can be medically dangerous and even life-threatening. Counselors must be able to recognize withdrawal symptoms and understand when medical referral is essential.</p>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Alcohol Withdrawal</h2>
<p>Alcohol withdrawal can range from mild (tremor, anxiety, insomnia) to severe (seizures, delirium tremens). Severity depends on:</p>
<ul>
<li>Duration and intensity of use</li>
<li>Previous withdrawal episodes (kindling effect)</li>
<li>Co-occurring medical conditions</li>
<li>Age (older adults at higher risk)</li>
</ul>
<p><strong>Clinical Institute Withdrawal Assessment for Alcohol (CIWA-Ar)</strong></p>
<p>The CIWA-Ar is a 10-item scale used to assess and monitor alcohol withdrawal severity:</p>
<ul>
<li>Nausea/vomiting</li>
<li>Tremor</li>
<li>Paroxysmal sweats</li>
<li>Anxiety</li>
<li>Agitation</li>
<li>Tactile disturbances</li>
<li>Auditory disturbances</li>
<li>Visual disturbances</li>
<li>Headache</li>
<li>Orientation/clouding of sensorium</li>
</ul>
<p><strong>Scoring:</strong></p>
<ul>
<li><10: Mild withdrawal, may be managed with supportive care</li>
<li>10-18: Moderate withdrawal, medication typically indicated</li>
<li>>18: Severe withdrawal, medical supervision essential</li>
<li>>20+: High risk for complicated withdrawal (seizures, DTs)</li>
</ul>
<p><strong>Delirium Tremens (DTs):</strong> Medical emergency occurring in 3-5% of alcohol withdrawals, typically 48-72 hours after last drink. Characterized by severe confusion, hallucinations, fever, and autonomic instability. Mortality rate of 5-15% without treatment.</p>
<p><strong>Clinical Guideline:</strong> Any client with a history of heavy alcohol use who is planning to stop or reduce drinking significantly should be evaluated for medical withdrawal management. Outpatient detoxification may be appropriate for mild withdrawal in medically stable individuals with social support, but moderate to severe withdrawal requires inpatient medical supervision.</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Opioid Withdrawal</h2>
<p>Opioid withdrawal is intensely uncomfortable but rarely life-threatening in otherwise healthy adults. However, the severity of symptoms often leads to relapse, and medical management significantly improves outcomes.</p>
<p><strong>Clinical Opiate Withdrawal Scale (COWS)</strong></p>
<p>The COWS is an 11-item scale assessing opioid withdrawal severity:</p>
<ul>
<li>Resting pulse rate</li>
<li>Sweating</li>
<li>Restlessness</li>
<li>Pupil size</li>
<li>Bone/joint aches</li>
<li>Runny nose/tearing</li>
<li>GI upset</li>
<li>Tremor</li>
<li>Yawning</li>
<li>Anxiety/irritability</li>
<li>Gooseflesh skin</li>
</ul>
<p><strong>Scoring:</strong> 5-12 = Mild; 13-24 = Moderate; 25-36 = Moderately severe; >36 = Severe</p>
<p><strong>Medical Management:</strong> Buprenorphine or methadone can be initiated during withdrawal, or symptomatic medications (clonidine, anti-emetics, anti-diarrheals, NSAIDs) can be used.</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Benzodiazepine Withdrawal</h2>
<p>Benzodiazepine withdrawal can be dangerous, particularly after prolonged use of high doses. Seizures and severe rebound anxiety are possible. A gradual, medically supervised taper is essential—benzodiazepines should never be stopped abruptly after regular use.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>🛠️ SKILL BUILDER: WITHDRAWAL RISK ASSESSMENT</h2>
<p>For each client scenario, determine the appropriate level of withdrawal management:</p>
<p><strong>Scenario 1:</strong> A 55-year-old man with 20-year history of daily drinking (1 pint of vodka), hypertension, and one previous withdrawal seizure 5 years ago. He had his last drink 8 hours ago and is tremulous with a pulse of 98.</p>
<p>Level of care needed: _______________________</p>
<p><strong>Scenario 2:</strong> A 28-year-old woman who has been using heroin daily for 6 months. She used 12 hours ago and reports feeling "dopesick" with runny nose, goosebumps, and muscle aches. No significant medical history.</p>
<p>Level of care needed: _______________________</p>
<p><strong>Scenario 3:</strong> A 40-year-old man who drinks 6-8 beers on weekends only. No daily drinking. No history of withdrawal symptoms. Wants to stop drinking entirely.</p>
<p>Level of care needed: _______________________</p>
<p><details> <summary><strong>Click to reveal answer key</strong></summary></p>
<p><strong>Scenario 1: Inpatient Medical Detoxification</strong></p>
<p>This client has multiple high-risk factors: heavy daily use, age, hypertension, previous seizure (kindling increases future risk), and early withdrawal symptoms already present. Medical detoxification with benzodiazepine protocol and close monitoring is essential.</p>
<p><strong>Scenario 2: Outpatient or Residential with Medication-Assisted Treatment</strong></p>
<p>This client is experiencing opioid withdrawal, which is uncomfortable but not medically dangerous. She could be initiated on buprenorphine (Suboxone) in an outpatient setting if she has stable housing and support, or in a residential program if more structure is needed. The key is rapid access to medication to prevent relapse.</p>
<p><strong>Scenario 3: No Medical Withdrawal Management Needed</strong></p>
<p>Weekend-only drinking without daily use typically does not produce physiological dependence requiring medical detoxification. This client can safely stop drinking without medication, though counseling support for behavior change would be helpful.</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>2.5 Assessing Co-occurring Disorders</h2>
<p>The high prevalence of co-occurring mental health and substance use disorders necessitates integrated assessment. Clinicians must distinguish between:</p>
<p><strong>Substance-Induced Disorders:</strong> Psychiatric symptoms caused directly by substance intoxication or withdrawal (e.g., cocaine-induced paranoia, alcohol-induced depression). These typically resolve with sustained abstinence.</p>
<p><strong>Independent Disorders:</strong> Psychiatric conditions that exist independent of substance use and require treatment in their own right (e.g., major depressive disorder that preceded substance use and persists during abstinence).</p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>Assessment Strategies for Co-occurring Disorders</h2>
<p><strong>Timeline Analysis:</strong> Determine temporal relationship between psychiatric symptoms and substance use. Ask: "Which came first—the depression or the drinking?"</p>
<p><strong>Symptoms During Abstinence:</strong> Assess whether psychiatric symptoms persist during periods of sustained abstinence (2-4 weeks minimum).</p>
<p><strong>Family History:</strong> Independent disorders often have family history patterns; substance-induced conditions do not.</p>
<p><strong>Symptom Severity:</strong> Substance-induced symptoms typically proportional to use level; independent disorders may fluctuate independently of use.</p>
<p><strong>Clinical Pearl:</strong> When in doubt, treat both. Waiting to "see if symptoms resolve with abstinence" before addressing depression or anxiety often leads to relapse. Integrated treatment of both conditions produces better outcomes than sequential treatment.</p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>✅ MODULE 2 KNOWLEDGE CHECK</h2>
<p><strong>Complete all 5 questions. You must answer at least 4 correctly (80%) to proceed.</strong></p>
<p><strong>Question 1:</strong> In the SBIRT model, which component is most appropriate for an individual who screens positive but has a mild substance use problem?</p>
<p>A) Referral to residential treatment B) Brief intervention using motivational interviewing techniques C) Immediate prescription of medication-assisted treatment D) Mandatory drug testing for 90 days</p>
<p><strong>Question 2:</strong> A client scores 12 on the AUDIT. According to scoring guidelines, this indicates:</p>
<p>A) Low risk, no intervention needed B) Hazardous use, brief intervention recommended C) Severe dependence, immediate referral required D) Invalid response pattern requiring readministration</p>
<p><strong>Question 3:</strong> Which of the following substances has the most medically dangerous withdrawal syndrome?</p>
<p>A) Cannabis B) Heroin C) Alcohol D) Cocaine</p>
<p><strong>Question 4:</strong> A client reports that her depression started when she was 16, several years before she began drinking heavily in college. This history suggests:</p>
<p>A) Substance-induced depressive disorder B) An independent depressive disorder predating SUD C) Normal adolescent development D) Malingering for secondary gain</p>
<p><strong>Question 5:</strong> The CIWA-Ar is used to assess withdrawal severity for which substance?</p>
<p>A) Opioids B) Alcohol C) Benzodiazepines D) Stimulants</p>
<p><details> <summary><strong>Click to reveal answers</strong></summary></p>
<ol>
<li><strong>B) Brief intervention using motivational interviewing techniques</strong> — SBIRT uses brief intervention for risky/mild use and reserves referral to treatment for moderate-severe SUDs.</li>
</ol>
<ol>
<li><strong>B) Hazardous use, brief intervention recommended</strong> — AUDIT scores 8-15 indicate hazardous use warranting brief intervention.</li>
</ol>
<ol>
<li><strong>C) Alcohol</strong> — Alcohol (and benzodiazepine) withdrawal can cause seizures and delirium tremens, which can be fatal. Opioid withdrawal, while very uncomfortable, is rarely life-threatening.</li>
</ol>
<ol>
<li><strong>B) An independent depressive disorder predating SUD</strong> — Depression that begins years before substance use and predates the SUD is likely an independent disorder requiring treatment in its own right.</li>
</ol>
<ol>
<li><strong>B) Alcohol</strong> — CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol, revised) is specifically designed for alcohol withdrawal. COWS is used for opioids.</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 27,
              content: `<h2>🎯 POST-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Selecting appropriate screening tools</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Conducting comprehensive SUD assessment</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Assessing withdrawal risk and severity</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Identifying co-occurring disorders</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            }
      ]
    },
    {
      order: 3,
      title: `Module 3: EVIDENCE-BASED TREATMENT APPROACHES`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 3: EVIDENCE-BASED TREATMENT APPROACHES`,
              subtitle: `28 Days Later: Understanding Addiction and Recovery`,
              sectionNumber: 3,
            },
{
              type: "text",
              order: 2,
              content: `<p><strong>Estimated Time: 30 minutes | 3,600+ words</strong></p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>🎯 PRE-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Applying motivational interviewing</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Implementing CBT for SUDs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Understanding medication-assisted treatment</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Matching treatment to client needs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>3.1 Motivational Interviewing: The Foundation of Engagement</h2>
<p>Motivational Interviewing (MI) is a collaborative, person-centered counseling approach designed to strengthen an individual's own motivation for and commitment to change. Developed by William Miller and Stephen Rollnick, MI has become a foundational skill for addiction treatment and is effective across substances, settings, and populations.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>The Spirit of MI</h2>
<p>More than a set of techniques, MI embodies a particular way of being with clients:</p>
<p><strong>Partnership:</strong> MI is done "with" and "for" clients, never "to" or "on" them. The counselor is a collaborator, not an expert who has all the answers.</p>
<p><strong>Acceptance:</strong> Comprising absolute worth (unconditional positive regard), accurate empathy, autonomy support, and affirmation. Acceptance does not mean approval of harmful behaviors but rather recognition of the person's inherent value and right to self-determination.</p>
<p><strong>Compassion:</strong> Active promotion of the client's welfare; prioritizing their needs.</p>
<p><strong>Evocation:</strong> The assumption that clients have within them what they need for change. The counselor's task is to evoke and strengthen their own motivations, not to install motivation from outside.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Core Skills: OARS</h2>
<p><strong>Open Questions:</strong> Questions that invite elaboration and exploration rather than yes/no responses.</p>
<ul>
<li>Closed: "Do you want to quit drinking?"</li>
<li>Open: "What concerns you about your drinking?" or "How would your life be different if you weren't drinking?"</li>
</ul>
<p><strong>Affirmations:</strong> Statements that recognize client strengths, efforts, and positive attributes. Affirmations build self-efficacy and are distinct from praise (which implies evaluation).</p>
<ul>
<li>Praise: "Good job not drinking this week!"</li>
<li>Affirmation: "You made it through a really stressful week and found ways to cope without alcohol. That took real strength."</li>
</ul>
<p><strong>Reflections:</strong> Statements that mirror back what the client has said, demonstrating understanding and encouraging further exploration. Reflections can be simple (repeating content) or complex (adding meaning, emotion, or the unstated).</p>
<ul>
<li>Client: "I know I should probably cut back on drinking, but it's really the only way I can relax after work."</li>
<li>Simple reflection: "Drinking helps you relax."</li>
<li>Complex reflection: "Alcohol has become your primary stress reliever, and you're not sure what would take its place."</li>
</ul>
<p><strong>Summaries:</strong> Collections of reflections that pull together what the client has said, demonstrate listening, and can strategically emphasize change talk.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>Change Talk and Sustain Talk</h2>
<p>A key MI concept is the distinction between <strong>change talk</strong> (client language favoring change) and <strong>sustain talk</strong> (client language favoring the status quo).</p>
<p><strong>Types of Change Talk (DARN-CAT):</strong></p>
<ul>
<li><strong>Desire:</strong> "I want to stop using"</li>
<li><strong>Ability:</strong> "I could probably cut back if I tried"</li>
<li><strong>Reasons:</strong> "My health is suffering"</li>
<li><strong>Need:</strong> "I have to do something before I lose my job"</li>
<li><strong>Commitment:</strong> "I'm going to quit"</li>
<li><strong>Activation:</strong> "I'm ready to make a change"</li>
<li><strong>Taking steps:</strong> "I poured out the vodka in my house"</li>
</ul>
<p><strong>The MI practitioner's task:</strong> Evoke and reinforce change talk while softening sustain talk. Research shows that increased change talk during sessions predicts behavior change, while increased sustain talk predicts continued use.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>📋 CONTINUING VIGNETTE: DEREK IN SESSION 2</h2>
<p>Derek returns for his second session. He begins by saying: "I've been thinking about what we talked about. Keisha sat me down this week and said she's scared I'm going to end up like my father. He died of liver failure at 58. That... that really hit me."</p>
<p>Derek continues: "But the thing is, I'm not like him. He was a falling-down drunk who couldn't hold a job. I've never missed work because of drinking. I provide for my family. It's not the same thing."</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>🔀 DECISION POINT: MI IN ACTION</h2>
<p>Which response best demonstrates MI principles for this moment in the session?</p>
<p><strong>Option A:</strong> "Derek, you're in denial. Your drinking is more serious than you realize, and if you don't address it, you could end up just like your father."</p>
<p><strong>Option B:</strong> "It sounds like Keisha's words really affected you—the fear that you might follow your father's path. At the same time, you see important differences between his drinking and yours. What else has you concerned?"</p>
<p><strong>Option C:</strong> "You're not like your father yet, but you will be if you don't stop drinking. You need to accept that you have a disease."</p>
<p><strong>Option D:</strong> "I hear that you're a good provider. Let's focus on your strengths and not worry so much about the drinking."</p>
<p><details> <summary><strong>Click to reveal optimal response and rationale</strong></summary></p>
<p><strong>Optimal Response: Option B</strong></p>
<p>This response demonstrates several MI-consistent elements:</p>
<ul>
<li><strong>Complex reflection</strong> of both sides of Derek's ambivalence (concern about father's path AND distinction from father)</li>
<li><strong>Accurate empathy</strong> acknowledging the emotional impact of Keisha's words</li>
<li><strong>Open question</strong> inviting further exploration of Derek's concerns (change talk)</li>
<li><strong>Autonomy support</strong> by not telling Derek what to think or do</li>
</ul>
<p><strong>Why Option A is suboptimal:</strong> Labeling ("denial"), arguing, and warning are MI-inconsistent behaviors that typically increase resistance.</p>
<p><strong>Why Option C is suboptimal:</strong> While less confrontational than A, this response still includes warning and prescribing ("you need to accept"). The concept of being "not like your father yet" may be heard as dismissive.</p>
<p><strong>Why Option D is suboptimal:</strong> This response colludes with sustain talk by affirming Derek's status quo and explicitly suggesting not addressing the drinking. It avoids the client's expressed ambivalence.</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>3.2 Cognitive-Behavioral Therapy for SUDs</h2>
<p>Cognitive-Behavioral Therapy (CBT) for substance use disorders focuses on identifying and modifying the thoughts, beliefs, and behaviors that maintain problematic use. CBT is one of the most extensively researched psychosocial treatments for SUDs with strong evidence of efficacy.</p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Theoretical Foundation</h2>
<p>CBT for SUDs integrates cognitive therapy principles (identifying and modifying maladaptive thoughts) with behavioral principles (learning theory, classical and operant conditioning). The core premise is that substance use is learned behavior maintained by its consequences, and new learning can occur through systematic skill development and cognitive restructuring.</p>
<p>Key assumptions:</p>
<ul>
<li>Substance use behaviors are learned and can be unlearned</li>
<li>Cognitions (thoughts, beliefs, expectations) influence substance use</li>
<li>Skills deficits contribute to continued use</li>
<li>New coping skills can be taught and practiced</li>
<li>Self-efficacy beliefs predict behavior change</li>
</ul>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>Core Components</h2>
<p><strong>Functional Analysis:</strong> Examining the antecedents (triggers) and consequences of substance use to understand its function in the client's life.</p><table class="cr-table">
<tr><th>Antecedents (Triggers)</th><th>Behavior</th><th>Consequences</th></tr>
<tr><td>External: People, places, things, times</td><td>Substance use</td><td>Short-term: Relief, pleasure, escape</td></tr>
<tr><td>Internal: Emotions, thoughts, physical sensations</td><td>Specific pattern (amount, route, setting)</td><td>Long-term: Problems in multiple domains</td></tr>
</table><p>The functional analysis helps both counselor and client understand the "logic" of substance use—why it makes sense given the immediate contingencies, even as it creates long-term harm. This understanding reduces shame and provides targets for intervention.</p>
<p><strong>Identifying and Challenging Cognitive Distortions:</strong> SUDs are associated with specific thinking patterns that maintain use:</p>
<ul>
<li><strong>Permission-giving thoughts:</strong> "I deserve a drink after the day I've had"</li>
<li><strong>Minimization:</strong> "It's just a couple beers, no big deal"</li>
<li><strong>Catastrophizing sobriety:</strong> "I won't be able to handle stress without using"</li>
<li><strong>Romanticizing use:</strong> Remembering only positive aspects of substance use</li>
<li><strong>Selective attention:</strong> Noticing cues to use while missing cues to abstain</li>
<li><strong>All-or-nothing thinking:</strong> "I already slipped once, might as well keep going"</li>
<li><strong>Fortune telling:</strong> "I know I'll relapse eventually, so why try?"</li>
</ul>
<p>The cognitive restructuring process involves:</p>
<ol>
<li>Identifying the automatic thought</li>
<li>Examining evidence for and against the thought</li>
<li>Generating alternative, more balanced thoughts</li>
<li>Testing beliefs through behavioral experiments</li>
</ol>
<p><strong>Coping Skills Training:</strong> Building alternative responses to triggers:</p>
<ul>
<li>Behavioral strategies (leaving the situation, distraction, physical activity)</li>
<li>Cognitive strategies (challenging thoughts, urge surfing, playing the tape forward)</li>
<li>Emotional regulation skills</li>
<li>Interpersonal effectiveness</li>
<li>Problem-solving skills</li>
<li>Assertiveness and refusal skills</li>
</ul>
<p><strong>Relapse Prevention Planning:</strong> Identifying high-risk situations and developing specific coping plans (see Module 5).</p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Session Structure in CBT for SUDs</h2>
<p>A typical CBT session follows a structured format:</p>
<ol>
<li><strong>Check-in and mood/substance use review</strong> (5-10 minutes)</li>
</ol>
<ul>
<li>Review substance use since last session</li>
<li>Assess current mood and stressors</li>
<li>Celebrate successes, explore challenges</li>
</ul>
<ol>
<li><strong>Bridge from previous session</strong> (5 minutes)</li>
</ol>
<ul>
<li>Review homework completion</li>
<li>Connect to current session content</li>
</ul>
<ol>
<li><strong>Set agenda collaboratively</strong> (5 minutes)</li>
</ol>
<ul>
<li>Prioritize issues for today's session</li>
<li>Balance skill-building with crisis management</li>
</ul>
<ol>
<li><strong>Skill-building or cognitive work</strong> (20-30 minutes)</li>
</ol>
<ul>
<li>Introduce new skills or practice existing ones</li>
<li>Analyze specific situations using cognitive model</li>
<li>Role-play or behavioral rehearsal</li>
</ul>
<ol>
<li><strong>Homework assignment</strong> (5-10 minutes)</li>
</ol>
<ul>
<li>Assign practice activities between sessions</li>
<li>Anticipate barriers and problem-solve</li>
</ul>
<ol>
<li><strong>Summary and feedback</strong> (5 minutes)</li>
</ol>
<ul>
<li>Summarize key points</li>
<li>Elicit feedback on session</li>
</ul>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Craving Management Techniques</h2>
<p><strong>Urge Surfing:</strong> Based on mindfulness principles, urge surfing involves observing cravings as waves that rise, peak, and fall, rather than responding to them automatically. Clients learn that cravings, though uncomfortable, are time-limited and survivable without acting on them.</p>
<p>Instructions for urge surfing:</p>
<ol>
<li>Notice the craving without judging it</li>
<li>Observe where you feel it in your body</li>
<li>Notice how the sensations change moment to moment</li>
<li>Imagine the craving as a wave that will rise, peak, and fall</li>
<li>Continue observing until the intensity decreases</li>
</ol>
<p><strong>Playing the Tape Forward:</strong> Rather than stopping at the thought of immediate relief, clients mentally "play forward" the full sequence of consequences that would follow use.</p>
<p>Example prompts:</p>
<ul>
<li>"If I use tonight, what will tomorrow morning look like?"</li>
<li>"How will I feel about myself? How will this affect my relationships?"</li>
<li>"What consequences have followed my use in the past?"</li>
<li>"Is the temporary relief worth these consequences?"</li>
</ul>
<p><strong>HALT:</strong> Checking for basic needs that increase vulnerability—Hungry, Angry, Lonely, Tired. These states lower resistance and increase craving intensity.</p>
<p><strong>Distraction and Substitution:</strong> Engaging in alternative activities that compete with using. Effective distractions are absorbing, readily available, and incompatible with use.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>3.3 Contingency Management</h2>
<p>Contingency Management (CM) is a behavioral intervention that provides tangible reinforcement for objective evidence of behavior change (typically abstinence verified by drug testing). CM has one of the strongest evidence bases of any psychosocial intervention for SUDs, with particularly robust findings for stimulant use disorders where no FDA-approved medications exist.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>Principles of Contingency Management</h2>
<p>CM is based on operant conditioning principles: behaviors followed by positive consequences increase in frequency. While substances provide powerful immediate reinforcement for use, CM introduces competing reinforcement for abstinence.</p>
<p>Key design elements:</p>
<ul>
<li><strong>Immediate reinforcement:</strong> Rewards delivered immediately upon verification of target behavior</li>
<li><strong>Escalating magnitude:</strong> Rewards increase with consecutive successes, enhancing motivation</li>
<li><strong>Reset with slip:</strong> Following a positive drug test, rewards reset to initial value (but client can earn back up quickly)</li>
<li><strong>Clearly defined targets:</strong> Objective, measurable behaviors (negative drug screens, attendance)</li>
</ul>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Implementation Approaches</h2>
<p><strong>Voucher-Based Reinforcement Therapy (VBRT):</strong></p>
<ul>
<li>Clients earn vouchers exchangeable for goods/services</li>
<li>Typical starting value: $2.50 for first negative test</li>
<li>Escalates with consecutive negatives (e.g., +$1.25 each time)</li>
<li>Bonuses for sustained abstinence</li>
<li>Maximum earnings typically $1,000-1,500 over 12 weeks</li>
</ul>
<p><strong>Prize-Based/Fishbowl CM:</strong></p>
<ul>
<li>Lower cost alternative</li>
<li>Clients draw from container for chance at prizes</li>
<li>Prizes range from encouraging message to $100 items</li>
<li>Probability of winning increases with consecutive successes</li>
</ul>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>Evidence Base</h2>
<p>Meta-analyses consistently show CM produces:</p>
<ul>
<li>Larger effect sizes than other psychosocial interventions</li>
<li>Superior outcomes for stimulant use disorders</li>
<li>Improved retention in treatment</li>
<li>Effects across substances, populations, and settings</li>
</ul>
<p>Limitations and considerations:</p>
<ul>
<li>Effects may not persist after incentives end (though some studies show sustained effects)</li>
<li>Requires infrastructure for frequent testing and reward delivery</li>
<li>Some philosophical objections to "paying people not to use drugs"</li>
<li>Cost can be barrier, though cost-effectiveness analyses are favorable</li>
</ul>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>⚡ MYTH VS. FACT: TREATMENT APPROACHES</h2><table class="cr-table">
<tr><th>Myth</th><th>Fact</th></tr>
<tr><td>"AA/NA is the only approach that really works for addiction."</td><td>Multiple evidence-based approaches are effective, including MI, CBT, Contingency Management, Medication-Assisted Treatment, and mutual support groups. No single approach works for everyone, and treatment should be individualized.</td></tr>
<tr><td>"Medications like Suboxone are just substituting one addiction for another."</td><td>Medications like buprenorphine stabilize brain chemistry, reduce cravings, prevent overdose, and enable functional recovery. They do not produce euphoria at therapeutic doses and are recommended as first-line treatment for opioid use disorder.</td></tr>
<tr><td>"Relapse means treatment has failed."</td><td>Relapse is common in chronic conditions and is best understood as a signal that treatment needs adjustment, not abandonment. Many individuals achieve stable recovery after multiple episodes of treatment.</td></tr>
<tr><td>"Confrontational approaches are necessary to break through denial."</td><td>Research consistently shows that confrontational approaches increase resistance and predict poorer outcomes. Empathic, motivational approaches are more effective at resolving ambivalence and promoting change.</td></tr>
</table>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>3.4 Medication-Assisted Treatment (MAT)</h2>
<p>Medication-Assisted Treatment combines FDA-approved medications with counseling and behavioral therapies to provide a "whole patient" approach to treating SUDs. MAT is considered first-line treatment for opioid use disorder and is effective for alcohol use disorder.</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>The Case for MAT: Addressing Myths and Stigma</h2>
<p>Despite overwhelming evidence, MAT remains underutilized due to myths and stigma. Counselors play a crucial role in addressing misconceptions:</p>
<p><strong>"MAT is just substituting one addiction for another"</strong> Reality: Medications like buprenorphine and methadone stabilize brain chemistry at steady levels without producing euphoria at therapeutic doses. Unlike illicit opioid use (with dangerous highs and withdrawal lows), MAT enables normal functioning. Would we say insulin "substitutes one dependency for another" in diabetes?</p>
<p><strong>"True recovery means being drug-free"</strong> Reality: SAMHSA's definition of recovery includes being medication-free for some individuals, but also recognizes medication-supported recovery as equally valid. Many individuals achieve all dimensions of recovery (health, home, purpose, community) while taking MAT.</p>
<p><strong>"MAT is a crutch that prevents real change"</strong> Reality: Research shows MAT recipients are MORE likely to engage in behavioral treatment and mutual support, not less. Stabilizing brain chemistry enables engagement in the psychological work of recovery.</p>
<p><strong>"MAT should only be short-term"</strong> Reality: While some individuals taper successfully, research shows that longer duration of MAT predicts better outcomes. Current guidelines recommend MAT continuation for at least one year, with indefinite continuation for many individuals—similar to recommendations for other chronic conditions.</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Medications for Opioid Use Disorder (MOUD)</h2>
<p><strong>Methadone:</strong></p>
<ul>
<li>Full opioid agonist administered daily in licensed clinics (Opioid Treatment Programs, OTPs)</li>
<li>Eliminates withdrawal, blocks euphoric effects of other opioids, reduces craving</li>
<li>Long half-life (24-36 hours) provides steady state without highs and lows</li>
<li>Highly effective; reduces mortality by ~50%</li>
<li>Requires daily clinic attendance initially, with take-home privileges earned over time</li>
<li>Starting dose typically 20-30mg, titrated to effective dose (often 80-120mg)</li>
<li>Restrictive but provides structure and daily professional contact</li>
</ul>
<p><strong>Buprenorphine (Suboxone, Sublocade, Zubsolv):</strong></p>
<ul>
<li>Partial opioid agonist with "ceiling effect" on respiratory depression</li>
<li>Can be prescribed by certified providers in office-based settings (X-waiver requirement eliminated in 2023)</li>
<li>Available in sublingual film/tablet (Suboxone, Zubsolv), buccal film (Bunavail), and long-acting monthly injection (Sublocade)</li>
<li>Lower overdose risk than methadone due to ceiling effect</li>
<li>Home-based administration allows flexibility and normalcy</li>
<li>Typically combined with naloxone to deter injection (Suboxone formulation)</li>
<li>Starting dose typically 4-8mg, maintenance often 16-24mg daily</li>
<li>Induction can be traditional (wait for withdrawal) or micro-dosing (gradual overlap)</li>
</ul>
<p><strong>Naltrexone (Vivitrol):</strong></p>
<ul>
<li>Opioid antagonist that completely blocks euphoric effects of opioids</li>
<li>Available as daily oral tablet or monthly extended-release injection (Vivitrol)</li>
<li>Requires full detoxification before initiation (7-10 days opioid-free)</li>
<li>No abuse potential; cannot produce dependence</li>
<li>Injectable form improves adherence</li>
<li>Good option for highly motivated individuals, those in criminal justice system, or those preferring non-opioid medication</li>
<li>Limitation: Must maintain abstinence long enough for induction; poor retention on oral form</li>
</ul>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Medications for Alcohol Use Disorder</h2>
<p><strong>Naltrexone:</strong></p>
<ul>
<li>Opioid antagonist that reduces rewarding effects of alcohol</li>
<li>Daily 50mg pill or monthly 380mg injection (Vivitrol)</li>
<li>Works by blocking endogenous opioid release during drinking, reducing pleasure</li>
<li>Evidence strongest for reducing heavy drinking days rather than achieving abstinence</li>
<li>The Sinclair Method uses naltrexone before (not instead of) drinking to extinguish drinking behavior</li>
<li>Generally well-tolerated; hepatotoxicity risk low at therapeutic doses</li>
<li>Can be started without full abstinence</li>
</ul>
<p><strong>Acamprosate (Campral):</strong></p>
<ul>
<li>Modulates glutamate/GABA balance disrupted by chronic alcohol use</li>
<li>May reduce protracted withdrawal symptoms (anxiety, insomnia, dysphoria)</li>
<li>666mg tablets, dosed three times daily (challenging regimen)</li>
<li>Renal excretion; contraindicated in severe renal impairment</li>
<li>No hepatotoxicity concerns (advantage in liver disease)</li>
<li>Works better for maintaining abstinence than initiating it</li>
</ul>
<p><strong>Disulfiram (Antabuse):</strong></p>
<ul>
<li>Inhibits aldehyde dehydrogenase, causing acetaldehyde accumulation if alcohol consumed</li>
<li>Results in highly unpleasant reaction: flushing, nausea, vomiting, headache, palpitations</li>
<li>Works through deterrence/aversion; changes decision-making context</li>
<li>Best for highly motivated individuals with supervised administration</li>
<li>Contraindicated in severe cardiac disease, psychosis, and pregnancy</li>
<li>Typical dose 250mg daily; must be taken consistently</li>
<li>Reaction can occur with alcohol in products (mouthwash, certain foods, medications)</li>
</ul>
<p><strong>Topiramate and Gabapentin:</strong></p>
<ul>
<li>Both show evidence for reducing heavy drinking</li>
<li>Neither FDA-approved for AUD but used off-label</li>
<li>Topiramate: May reduce craving and drinking; cognitive side effects limit tolerability</li>
<li>Gabapentin: May help with mood, sleep, and craving; helpful for co-occurring anxiety</li>
</ul>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Counselor's Role in MAT</h2>
<p>Counselors play a crucial role in MAT by:</p>
<ul>
<li>Providing psychoeducation about medications and addressing misconceptions</li>
<li>Integrating medication with behavioral treatment (MAT plus psychotherapy produces best outcomes)</li>
<li>Monitoring for adherence and side effects</li>
<li>Addressing stigma (from clients, families, and sometimes other providers)</li>
<li>Coordinating care with prescribers</li>
<li>Supporting clients' recovery goals regardless of medication status</li>
<li>Advocating for appropriate access to MAT</li>
<li>Never requiring MAT discontinuation as condition of counseling</li>
</ul>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>3.5 Harm Reduction Approaches</h2>
<p>Harm reduction is a public health philosophy and set of interventions that seek to minimize the negative consequences of substance use, whether or not the person is ready or able to stop using. While sometimes misunderstood as "enabling," harm reduction is pragmatic, compassionate, and evidence-based.</p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>Core Principles of Harm Reduction</h2>
<p><strong>Meeting people where they are:</strong> Accepting that people are at different stages of readiness and that any positive change has value.</p>
<p><strong>Reducing harms is a valid goal:</strong> Recognizing that abstinence is not the only worthwhile outcome. Reducing overdose risk, infectious disease transmission, and other consequences has intrinsic value.</p>
<p><strong>Respecting autonomy:</strong> Affirming the person's right to make decisions about their own body and substance use.</p>
<p><strong>Non-judgmental engagement:</strong> Creating space for honest conversation without moralizing or shaming.</p>
<p><strong>Evidence-based:</strong> Using strategies shown to reduce harm, even when politically controversial.</p>`,
            },
{
              type: "text",
              order: 27,
              content: `<h2>Harm Reduction Interventions</h2>
<p><strong>Naloxone Distribution:</strong> Opioid overdose reversal medication available without prescription in most states. Can be administered by bystanders. Has saved thousands of lives.</p>
<p><strong>Syringe Services Programs (SSPs):</strong> Provide sterile injection equipment to reduce HIV and hepatitis transmission. Research shows SSPs reduce disease spread without increasing drug use, and serve as engagement points for treatment.</p>
<p><strong>Drug Checking Services:</strong> Fentanyl test strips and other tools allow people to test substances for dangerous adulterants.</p>
<p><strong>Safe Use Education:</strong> Teaching safer injection practices, not using alone, recognizing overdose signs.</p>
<p><strong>Low-Barrier Services:</strong> Treatment programs that minimize requirements for entry (no waiting lists, ID requirements, or abstinence prerequisites).</p>
<p><strong>Medication Approaches:</strong> MAT itself is a harm reduction intervention, reducing overdose risk even if person continues using some substances.</p>`,
            },
{
              type: "text",
              order: 28,
              content: `<h2>Integrating Harm Reduction with Clinical Practice</h2>
<p>Counselors can incorporate harm reduction principles by:</p>
<ul>
<li>Discussing safer use even with clients not ready for abstinence</li>
<li>Providing naloxone and overdose prevention education to all clients using opioids</li>
<li>Affirming any positive change, not just abstinence</li>
<li>Not terminating treatment due to continued use</li>
<li>Addressing immediate safety concerns (housing, infection risk) alongside substance use</li>
<li>Recognizing that engagement in care is itself a positive outcome</li>
</ul>`,
            },
{
              type: "text",
              order: 29,
              content: `<h2>🛠️ SKILL BUILDER: FUNCTIONAL ANALYSIS</h2>
<p>Complete a functional analysis for Derek's drinking pattern based on information gathered across sessions:</p>
<p><strong>Triggers (Antecedents):</strong></p>
<p><em>External:</em></p><table class="cr-table">
<tr><th>Trigger</th><th>How does this trigger Derek's drinking?</th></tr>
<tr><td>Work stress</td><td></td></tr>
<tr><td>Arguments with Keisha</td><td></td></tr>
<tr><td>Sports on TV</td><td></td></tr>
<tr><td>Social situations with coworkers</td><td></td></tr>
</table><p><em>Internal:</em> | Trigger | How does this trigger Derek's drinking? | |---------|----------------------------------------| | Anxiety/tension | | | Boredom | | | Negative self-talk | | | Physical craving | |</p>
<p><strong>Consequences:</strong></p>
<p><em>Short-term positives (maintaining use):</em></p>
<ol>
<li>_________________________</li>
<li>_________________________</li>
<li>_________________________</li>
</ol>
<p><em>Long-term negatives:</em></p>
<ol>
<li>_________________________</li>
<li>_________________________</li>
<li>_________________________</li>
</ol>
<p><details> <summary><strong>Click to reveal completed example</strong></summary></p>
<p><strong>External Triggers:</strong> | Trigger | Function | |---------|----------| | Work stress | Drinking used to "unwind" after high-pressure sales job | | Arguments with Keisha | Drinking to avoid/escape conflict and difficult emotions | | Sports on TV | Conditioned association; drinking is part of the ritual | | Social situations with coworkers | Social facilitation; sales culture normalizes drinking |</p>
<p><strong>Internal Triggers:</strong> | Trigger | Function | |---------|----------| | Anxiety/tension | Alcohol's anxiolytic effect provides temporary relief | | Boredom | Alcohol adds stimulation/something to do in the evening | | Negative self-talk | Escape from thoughts about father, fear of failure | | Physical craving | Withdrawal-driven urge for relief |</p>
<p><strong>Short-term Positives:</strong></p>
<ol>
<li>Rapid relaxation and stress relief</li>
<li>Escape from difficult emotions and thoughts</li>
<li>Social connection with coworkers; fits cultural norms</li>
</ol>
<p><strong>Long-term Negatives:</strong></p>
<ol>
<li>Deteriorating health (elevated liver enzymes)</li>
<li>Marital conflict and risk to family relationships</li>
<li>Morning fog affecting work performance</li>
<li>Modeling unhealthy coping for children</li>
<li>Risk of progression to father's pattern</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 30,
              content: `<h2>3.4 Levels of Care: ASAM Criteria</h2>
<p>The American Society of Addiction Medicine (ASAM) Criteria provide a comprehensive, multidimensional assessment framework for determining appropriate level of care. Placement decisions consider six dimensions:</p>
<ol>
<li><strong>Acute Intoxication and/or Withdrawal Potential</strong></li>
<li><strong>Biomedical Conditions and Complications</strong></li>
<li><strong>Emotional, Behavioral, or Cognitive Conditions</strong></li>
<li><strong>Readiness to Change</strong></li>
<li><strong>Relapse, Continued Use, or Continued Problem Potential</strong></li>
<li><strong>Recovery/Living Environment</strong></li>
</ol>`,
            },
{
              type: "text",
              order: 31,
              content: `<h2>ASAM Levels of Care</h2>
<p><strong>Level 0.5: Early Intervention</strong></p>
<ul>
<li>Assessment and education for at-risk individuals</li>
<li>SBIRT implementation</li>
</ul>
<p><strong>Level 1: Outpatient Services</strong></p>
<ul>
<li>Less than 9 hours/week</li>
<li>Individual and/or group counseling</li>
<li>Appropriate for mild SUD with strong recovery environment</li>
</ul>
<p><strong>Level 2.1: Intensive Outpatient (IOP)</strong></p>
<ul>
<li>9-19 hours/week</li>
<li>Structured programming while living at home</li>
<li>Appropriate for moderate SUD with adequate support</li>
</ul>
<p><strong>Level 2.5: Partial Hospitalization</strong></p>
<ul>
<li>20+ hours/week</li>
<li>Day programming with return home evenings</li>
<li>Significant structure while maintaining community connection</li>
</ul>
<p><strong>Level 3.1: Clinically Managed Low-Intensity Residential</strong></p>
<ul>
<li>24-hour living support with less intensive clinical services</li>
<li>Focus on recovery skills in structured environment</li>
</ul>
<p><strong>Level 3.5: Clinically Managed High-Intensity Residential</strong></p>
<ul>
<li>24-hour care with intensive clinical services</li>
<li>For individuals who need stable, structured environment for recovery</li>
</ul>
<p><strong>Level 3.7: Medically Monitored Intensive Inpatient</strong></p>
<ul>
<li>24-hour medical supervision and nursing care</li>
<li>For severe withdrawal or medical complications</li>
</ul>
<p><strong>Level 4: Medically Managed Intensive Inpatient</strong></p>
<ul>
<li>Acute hospital care</li>
<li>For severe, unstable medical/psychiatric conditions</li>
</ul>`,
            },
{
              type: "text",
              order: 32,
              content: `<h2>📋 CONTINUING VIGNETTE: MARISOL'S TREATMENT PLANNING</h2>
<p>Following comprehensive assessment, you have diagnosed Marisol with:</p>
<ul>
<li>Alcohol Use Disorder, Moderate (5 criteria)</li>
<li>Sedative Use Disorder, Mild (unprescribed benzodiazepine use, 2 criteria)</li>
<li>PTSD (related to childhood sexual abuse)</li>
<li>Major Depressive Disorder, current episode moderate</li>
</ul>
<p>Marisol has stable housing, employment, and a supportive mother who is willing to secure her Xanax prescription. She is a single parent and cannot attend residential treatment.</p>`,
            },
{
              type: "text",
              order: 33,
              content: `<h2>🔀 DECISION POINT: LEVEL OF CARE</h2>
<p>Based on ASAM dimensions and Marisol's circumstances, which level of care is most appropriate?</p>
<p><strong>Option A:</strong> Level 1 Outpatient (weekly individual therapy)</p>
<p><strong>Option B:</strong> Level 2.1 Intensive Outpatient Program (IOP) with integrated treatment</p>
<p><strong>Option C:</strong> Level 3.5 Residential treatment with childcare support</p>
<p><strong>Option D:</strong> Level 4 Inpatient hospitalization for psychiatric stabilization</p>
<p><details> <summary><strong>Click to reveal optimal response and rationale</strong></summary></p>
<p><strong>Optimal Response: Option B</strong></p>
<p>Level 2.1 Intensive Outpatient with integrated treatment is most appropriate because:</p>
<ul>
<li><strong>Substance use severity:</strong> Moderate AUD and mild sedative use disorder warrant more structure than weekly sessions</li>
<li><strong>Co-occurring disorders:</strong> PTSD and MDD require integrated treatment addressing both mental health and substance use</li>
<li><strong>Recovery environment:</strong> Stable housing, supportive family member, mother willing to secure medications</li>
<li><strong>Life circumstances:</strong> Single parent cannot attend residential; IOP can accommodate work schedule</li>
<li><strong>Withdrawal risk:</strong> With moderate alcohol use and low-dose benzodiazepine use, medical detox may not be required, but close monitoring is needed</li>
</ul>
<p><strong>Why Option A is suboptimal:</strong> Weekly outpatient alone is likely insufficient given moderate SUD severity and complex co-occurring disorders.</p>
<p><strong>Why Option C is suboptimal:</strong> While residential would provide more structure, it's not feasible given Marisol's parental responsibilities, and her recovery environment is adequate for outpatient level of care.</p>
<p><strong>Why Option D is suboptimal:</strong> Marisol is not in acute psychiatric crisis requiring hospitalization. Her depression is moderate, and there's no indication of imminent suicidality or psychosis.</p>
<p><strong>Integrated Treatment Approach:</strong> Marisol's IOP should address PTSD and depression alongside substance use, as these conditions interact (using alcohol to manage trauma symptoms, depression increasing relapse risk). Evidence-based integrated models like Seeking Safety can address trauma and substance use simultaneously.</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 34,
              content: `<h2>✅ MODULE 3 KNOWLEDGE CHECK</h2>
<p><strong>Complete all 5 questions. You must answer at least 4 correctly (80%) to proceed.</strong></p>
<p><strong>Question 1:</strong> In Motivational Interviewing, the counselor's task regarding client ambivalence is to:</p>
<p>A) Resolve ambivalence by persuading the client toward change B) Evoke and reinforce change talk while softening sustain talk C) Remain neutral and avoid influencing the client's direction D) Confront denial until the client accepts they have a problem</p>
<p><strong>Question 2:</strong> A client says, "I've been thinking that I really need to do something about my drinking before it ruins my marriage." This statement is an example of:</p>
<p>A) Sustain talk B) Resistance C) Change talk (Need) D) Denial</p>
<p><strong>Question 3:</strong> Which medication for opioid use disorder is a partial agonist that can be prescribed in office-based settings?</p>
<p>A) Methadone B) Buprenorphine C) Disulfiram D) Acamprosate</p>
<p><strong>Question 4:</strong> According to CBT for SUDs, "urge surfing" involves:</p>
<p>A) Immediately distracting oneself from cravings B) Observing cravings as time-limited waves that rise and fall C) Giving in to small cravings to prevent larger relapses D) Analyzing the childhood origins of addictive cravings</p>
<p><strong>Question 5:</strong> ASAM Level 2.1 (Intensive Outpatient Program) typically involves how many hours of programming per week?</p>
<p>A) Less than 9 hours B) 9-19 hours C) 20-30 hours D) 40+ hours</p>
<p><details> <summary><strong>Click to reveal answers</strong></summary></p>
<ol>
<li><strong>B) Evoke and reinforce change talk while softening sustain talk</strong> — This is the core MI strategy for resolving ambivalence in the direction of change.</li>
</ol>
<ol>
<li><strong>C) Change talk (Need)</strong> — Statements indicating necessity or need to change ("I need to do something") are change talk.</li>
</ol>
<ol>
<li><strong>B) Buprenorphine</strong> — Buprenorphine is a partial opioid agonist that can be prescribed by certified providers in office settings. Methadone is a full agonist requiring licensed opioid treatment programs.</li>
</ol>
<ol>
<li><strong>B) Observing cravings as time-limited waves that rise and fall</strong> — Urge surfing uses mindfulness to observe cravings without acting on them.</li>
</ol>
<ol>
<li><strong>B) 9-19 hours</strong> — ASAM Level 2.1 IOP involves 9-19 structured hours weekly. Less than 9 is Level 1 outpatient; 20+ is Level 2.5 partial hospitalization.</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 35,
              content: `<h2>🎯 POST-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Applying motivational interviewing</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Implementing CBT for SUDs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Understanding medication-assisted treatment</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Matching treatment to client needs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            }
      ]
    },
    {
      order: 4,
      title: `Module 4: SPECIAL POPULATIONS AND CULTURAL CONSIDERATIONS`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 4: SPECIAL POPULATIONS AND CULTURAL CONSIDERATIONS`,
              subtitle: `28 Days Later: Understanding Addiction and Recovery`,
              sectionNumber: 4,
            },
{
              type: "text",
              order: 2,
              content: `<p><strong>Estimated Time: 30 minutes | 3,600+ words</strong></p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>🎯 PRE-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Applying cultural humility in SUD treatment</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Addressing racial/ethnic disparities</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Working with LGBTQ+ individuals with SUDs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Treating pregnant/parenting women with SUDs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>4.1 Cultural Humility in Addiction Treatment</h2>
<p>Culturally responsive addiction treatment requires moving beyond "cultural competence" (which implies a finite endpoint of mastery) toward "cultural humility"—a lifelong process of self-reflection, learning, and partnership with clients from diverse backgrounds.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Principles of Cultural Humility</h2>
<p><strong>Lifelong Learning and Self-Reflection:</strong> Recognizing that we can never fully understand another person's cultural experience, and committing to ongoing learning about ourselves and others.</p>
<p><strong>Recognizing and Challenging Power Imbalances:</strong> Acknowledging the inherent power differential in therapeutic relationships and actively working to minimize it through partnership and client-centered approaches.</p>
<p><strong>Institutional Accountability:</strong> Advocating for culturally responsive policies and practices within organizations and systems.</p>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Culture and Addiction: Key Considerations</h2>
<p><strong>Substance-Specific Cultural Factors:</strong></p>
<ul>
<li>Alcohol use varies dramatically across cultures, from complete prohibition to integration in daily life</li>
<li>Cannabis legalization has created cultural shifts in norms and perceptions</li>
<li>Traditional or ceremonial use of certain substances (peyote, ayahuasca) has religious/cultural meaning distinct from misuse</li>
<li>Prescription medication attitudes differ across cultures</li>
</ul>
<p><strong>Help-Seeking and Treatment Engagement:</strong></p>
<ul>
<li>Stigma around addiction varies across cultures and may be heightened in some communities</li>
<li>Family involvement expectations differ (some cultures expect family engagement; others emphasize privacy)</li>
<li>Gender role expectations may affect treatment engagement differently for men and women</li>
<li>Immigration status may create barriers to accessing care</li>
<li>Historical trauma and distrust of institutions (healthcare, legal systems) affects engagement</li>
</ul>
<p><strong>Recovery Support:</strong></p>
<ul>
<li>12-step programs reflect particular cultural values (individualism, spiritual orientation) that may or may not fit</li>
<li>Culturally-specific recovery support resources exist (Wellbriety, Recovery Dharma, SMART Recovery)</li>
<li>Family and community may be more central to recovery in some cultures than individual therapy</li>
</ul>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>4.2 Racial and Ethnic Disparities in SUD Treatment</h2>
<p>Significant disparities exist in SUD treatment access, quality, and outcomes across racial and ethnic groups.</p>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>Disparities in Treatment Access</h2>
<p>Despite similar or higher rates of substance use disorders, Black and Latino/a individuals are significantly less likely to receive SUD treatment than White individuals. Barriers include:</p>
<ul>
<li>Lack of insurance and financial resources</li>
<li>Fewer treatment facilities in underserved communities</li>
<li>Transportation challenges</li>
<li>Mistrust of treatment systems</li>
<li>Culturally unresponsive services</li>
</ul>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Disparities in Criminal Justice Response</h2>
<p>The "War on Drugs" has disproportionately affected communities of color:</p>
<ul>
<li>Black Americans are 3.7x more likely to be arrested for marijuana possession than White Americans despite similar use rates</li>
<li>Crack cocaine (associated with Black communities) carried sentences 100x harsher than powder cocaine (associated with White communities) until 2010 reforms</li>
<li>Incarceration disrupts families, communities, and employment, creating barriers to recovery</li>
</ul>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>Treatment Quality and Outcomes</h2>
<p>When individuals from marginalized communities do access treatment, they may receive lower quality care:</p>
<ul>
<li>Less likely to receive evidence-based treatments including MAT</li>
<li>Less likely to be treated by providers who share their racial/ethnic background</li>
<li>Higher dropout rates, potentially due to cultural mismatch</li>
</ul>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>Clinical Implications</h2>
<p><strong>Advocate for equitable access</strong> within your organization and community.</p>
<p><strong>Examine your own biases</strong> using tools like the Implicit Association Test.</p>
<p><strong>Provide culturally responsive care</strong> by asking about cultural identity, involving family as appropriate, and adapting interventions to fit.</p>
<p><strong>Address social determinants</strong> including housing, employment, and legal issues that affect recovery.</p>
<p><strong>Offer medication-assisted treatment</strong> equitably to all clients who could benefit.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>🪞 REFLECTION EXERCISE</h2>
<p>Consider your current practice setting and client population:</p>
<ol>
<li><strong>What racial/ethnic communities do you serve, and what do you know about substance use patterns, help-seeking behaviors, and recovery supports in those communities?</strong></li>
</ol>
<ol>
<li><strong>How does your organization address—or fail to address—disparities in treatment access and quality?</strong></li>
</ol>
<ol>
<li><strong>What is one concrete step you could take in the next month to provide more culturally responsive SUD treatment?</strong></li>
</ol>
<p><em>Write your reflections before continuing. This work is essential for ethical, effective practice.</em></p>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>4.3 Working with LGBTQ+ Individuals</h2>
<p>Lesbian, gay, bisexual, transgender, and queer individuals experience higher rates of substance use disorders than the general population, driven by minority stress, discrimination, and unique psychosocial stressors.</p>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Minority Stress Model</h2>
<p>Meyer's Minority Stress Model explains elevated mental health and substance use risk among LGBTQ+ individuals through:</p>
<p><strong>Distal Stressors (External):</strong></p>
<ul>
<li>Discrimination and violence</li>
<li>Rejection by family, peers, institutions</li>
<li>Lack of legal protections</li>
<li>Microaggressions</li>
</ul>
<p><strong>Proximal Stressors (Internal):</strong></p>
<ul>
<li>Internalized homophobia/transphobia</li>
<li>Concealment stress</li>
<li>Expectations of rejection</li>
<li>Hypervigilance</li>
</ul>
<p>Substance use may develop as a coping mechanism for these stressors.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>Unique Treatment Considerations</h2>
<p><strong>Creating Affirming Environments:</strong></p>
<ul>
<li>Use inclusive intake forms (allowing self-identification of gender and pronouns)</li>
<li>Display affirming materials and symbols</li>
<li>Train all staff in LGBTQ+ affirming practices</li>
<li>Address discrimination if it occurs in group settings</li>
</ul>
<p><strong>Addressing Minority Stress:</strong></p>
<ul>
<li>Explore the role of minority stress in substance use</li>
<li>Distinguish between internalized shame and treatment-resistant denial</li>
<li>Connect clients with LGBTQ+ recovery communities</li>
<li>Address trauma related to rejection, violence, or discrimination</li>
</ul>
<p><strong>Transgender-Specific Considerations:</strong></p>
<ul>
<li>Hormone therapy can interact with some medications—coordinate with prescribers</li>
<li>Some substances affect hormone levels or gender presentation</li>
<li>Avoid conflating gender identity concerns with substance-related "confusion"</li>
<li>Use correct names and pronouns consistently</li>
</ul>
<p><strong>Avoiding Common Mistakes:</strong></p>
<ul>
<li>Don't assume sexual orientation or gender identity is the "cause" of SUD</li>
<li>Don't require clients to disclose identity if they haven't</li>
<li>Don't assume all LGBTQ+ clients have similar experiences</li>
<li>Don't recommend providers or groups that are not affirming</li>
</ul>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>📋 CONTINUING VIGNETTE: DEREK'S CULTURAL CONTEXT</h2>
<p>As treatment progresses, Derek shares more about his experience as a Black man in a predominantly White corporate environment:</p>
<p>"Look, I know you probably don't get this, but in my world, you have to be twice as good to get half as far. I can never let my guard down. And then I come home and Keisha's talking about how I drink too much... It's like, this is the one thing that helps me deal with all of it."</p>
<p>He also mentions that his father's drinking was "just what men did where I grew up" and expresses skepticism about AA: "I went once after Keisha pushed me. I was the only Black face in the room, and they kept talking about their 'higher power.' That's not my thing."</p>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>🔀 DECISION POINT: CULTURALLY RESPONSIVE TREATMENT</h2>
<p>How do you respond to Derek's cultural context and concerns?</p>
<p><strong>Option A:</strong> "Race doesn't really matter in recovery—addiction is an equal opportunity disease. The 12 steps work for everyone if they're willing."</p>
<p><strong>Option B:</strong> "The stress you're describing sounds really significant. Tell me more about how navigating those dynamics affects you day-to-day, and let's think together about what recovery supports would actually work for you."</p>
<p><strong>Option C:</strong> "You should try a Black-specific AA meeting. That would solve the problem."</p>
<p><strong>Option D:</strong> "It sounds like you're making excuses and using race to avoid dealing with your drinking."</p>
<p><details> <summary><strong>Click to reveal optimal response and rationale</strong></summary></p>
<p><strong>Optimal Response: Option B</strong></p>
<p>This response:</p>
<ul>
<li><strong>Validates</strong> Derek's experience of racial stress without dismissing or minimizing it</li>
<li><strong>Shows curiosity</strong> rather than assuming what his experience means</li>
<li><strong>Collaborates</strong> on finding appropriate recovery supports</li>
<li><strong>Maintains focus</strong> on substance use while integrating cultural context</li>
</ul>
<p><strong>Why Option A is harmful:</strong> Dismissing race ("addiction is an equal opportunity disease") invalidates Derek's lived experience, damages the therapeutic alliance, and reflects color-blind ideology that ignores real disparities.</p>
<p><strong>Why Option C is suboptimal:</strong> While Black-specific mutual support groups exist and may be helpful, prescribing a solution without exploration presumes what Derek needs. It also implies his concerns would be resolved simply by attending a different meeting, missing the complexity of his situation.</p>
<p><strong>Why Option D is harmful:</strong> Accusing Derek of "making excuses" is confrontational, dismissive of legitimate stressors, and reflects stereotype of Black men using race as excuse—a microaggression.</p>
<p><strong>Clinical Considerations:</strong> Derek's experience of minority stress is real and clinically relevant. Racism is a chronic stressor with documented health effects, and substance use may serve a protective function. Treatment must address these stressors while supporting recovery, not dismiss them as irrelevant or as excuses.</p>
<p></details></p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>4.4 Pregnant and Parenting Women with SUDs</h2>
<p>Substance use during pregnancy and parenting presents unique clinical, ethical, and legal considerations.</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>Prevalence and Impact</h2>
<p>According to SAMHSA (2023):</p>
<ul>
<li>5.4% of pregnant women aged 15-44 reported past-month illicit drug use</li>
<li>9.5% reported past-month alcohol use</li>
<li>8.5% reported past-month tobacco use</li>
</ul>
<p>Prenatal substance exposure can cause:</p>
<ul>
<li>Fetal Alcohol Spectrum Disorders (FASD)</li>
<li>Neonatal Abstinence Syndrome (NAS) from opioid exposure</li>
<li>Low birth weight, prematurity</li>
<li>Developmental delays</li>
</ul>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>Barriers to Treatment</h2>
<p>Pregnant women face significant barriers to SUD treatment:</p>
<ul>
<li><strong>Stigma and shame:</strong> Intense societal judgment of pregnant women who use substances</li>
<li><strong>Fear of losing children:</strong> Child protective services involvement creates fear of treatment</li>
<li><strong>Punitive legal responses:</strong> Some states criminalize prenatal substance use</li>
<li><strong>Lack of appropriate services:</strong> Few programs accommodate pregnant women or children</li>
<li><strong>Competing demands:</strong> Difficulty attending treatment while caring for existing children</li>
</ul>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>Evidence-Based Approaches</h2>
<p><strong>Medication-Assisted Treatment is Standard of Care for Opioid Use Disorder:</strong></p>
<ul>
<li>Buprenorphine and methadone are both safe and recommended during pregnancy</li>
<li>Abrupt opioid cessation increases risk of miscarriage, preterm labor, and fetal distress</li>
<li>MAT improves prenatal care engagement and outcomes</li>
<li>Neonatal Abstinence Syndrome is treatable and preferable to risks of untreated OUD</li>
</ul>
<p><strong>Comprehensive Services:</strong></p>
<ul>
<li>Prenatal care integration</li>
<li>Parenting education</li>
<li>Childcare during treatment</li>
<li>Trauma-informed care (high rates of trauma history)</li>
<li>Case management for basic needs</li>
</ul>
<p><strong>Harm Reduction Approach:</strong></p>
<ul>
<li>Any reduction in substance use improves outcomes</li>
<li>Non-judgmental engagement keeps women in care</li>
<li>Abstinence is ideal but not required for benefit</li>
</ul>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>4.5 Adolescents and Emerging Adults</h2>
<p>Adolescent brain development creates unique vulnerabilities to addiction and requires developmentally appropriate treatment approaches.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Developmental Considerations</h2>
<p><strong>Brain Development:</strong> The prefrontal cortex (responsible for impulse control, decision-making) continues developing until age 25. The reward system matures earlier, creating an imbalance favoring immediate gratification.</p>
<p><strong>Risk-Taking and Identity:</strong> Experimentation is developmentally normative, but substance use during adolescence significantly increases lifetime SUD risk.</p>
<p><strong>Family System:</strong> Adolescents exist within family contexts that both influence and are influenced by substance use.</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>Evidence-Based Approaches for Adolescents</h2>
<p><strong>Family-Based Interventions:</strong></p>
<ul>
<li>Multidimensional Family Therapy (MDFT)</li>
<li>Brief Strategic Family Therapy</li>
<li>Functional Family Therapy</li>
</ul>
<p>These approaches recognize that adolescent substance use occurs within family systems and that changing family dynamics can reduce use.</p>
<p><strong>Motivational Enhancement Therapy (MET):</strong> Adapted MI for adolescents, typically brief (2-4 sessions), focusing on building intrinsic motivation for change.</p>
<p><strong>Cognitive-Behavioral Therapy:</strong> Teaching coping skills, refusal skills, and addressing cognitive distortions.</p>
<p><strong>Contingency Management:</strong> Using tangible reinforcers for abstinence can be particularly effective with adolescents.</p>
<p><strong>Key Principles:</strong></p>
<ul>
<li>Involve family when appropriate and safe</li>
<li>Address developmental tasks (identity, autonomy, peer relationships)</li>
<li>Use age-appropriate engagement strategies</li>
<li>Consider legal and ethical issues around consent and confidentiality</li>
<li>Screen for and address trauma, mental health conditions</li>
<li>Connect with school, juvenile justice, and other systems as needed</li>
</ul>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>✅ MODULE 4 KNOWLEDGE CHECK</h2>
<p><strong>Complete all 5 questions. You must answer at least 4 correctly (80%) to proceed.</strong></p>
<p><strong>Question 1:</strong> Cultural humility differs from cultural competence in that it:</p>
<p>A) Requires mastery of specific cultural practices B) Emphasizes lifelong learning and self-reflection rather than achieving an endpoint C) Focuses only on racial and ethnic differences D) Is less important in addiction treatment than other clinical areas</p>
<p><strong>Question 2:</strong> According to the Minority Stress Model, which is an example of a proximal (internal) stressor for LGBTQ+ individuals?</p>
<p>A) Workplace discrimination B) Hate crime victimization C) Internalized homophobia D) Lack of legal protections</p>
<p><strong>Question 3:</strong> Which statement about medication-assisted treatment during pregnancy is accurate?</p>
<p>A) Pregnant women should rapidly detox from opioids to protect the fetus B) Buprenorphine and methadone are contraindicated during pregnancy C) MAT with buprenorphine or methadone is standard of care for pregnant women with OUD D) Neonatal Abstinence Syndrome is a reason to avoid MAT during pregnancy</p>
<p><strong>Question 4:</strong> Research on racial disparities in SUD treatment shows that:</p>
<p>A) White, Black, and Latino individuals receive treatment at equal rates B) Black and Latino individuals are less likely to receive treatment despite similar SUD rates C) Disparities exist only in access, not in treatment quality D) The War on Drugs equally affected all racial groups</p>
<p><strong>Question 5:</strong> Which treatment approach is most strongly evidence-based for adolescent substance use disorders?</p>
<p>A) Individual psychodynamic therapy B) Adult-oriented 12-step programs C) Family-based interventions such as Multidimensional Family Therapy D) Confrontational boot camps</p>
<p><details> <summary><strong>Click to reveal answers</strong></summary></p>
<ol>
<li><strong>B) Emphasizes lifelong learning and self-reflection rather than achieving an endpoint</strong> — Cultural humility recognizes that cultural understanding is a process, not a destination.</li>
</ol>
<ol>
<li><strong>C) Internalized homophobia</strong> — Proximal stressors are internal/psychological; distal stressors are external. Internalized negative attitudes represent proximal stress.</li>
</ol>
<ol>
<li><strong>C) MAT with buprenorphine or methadone is standard of care for pregnant women with OUD</strong> — ACOG, SAMHSA, and other authorities recommend MAT over detoxification during pregnancy.</li>
</ol>
<ol>
<li><strong>B) Black and Latino individuals are less likely to receive treatment despite similar SUD rates</strong> — Significant disparities exist in treatment access despite comparable need.</li>
</ol>
<ol>
<li><strong>C) Family-based interventions such as Multidimensional Family Therapy</strong> — Family therapies have the strongest evidence base for adolescent SUDs.</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 26,
              content: `<h2>🎯 POST-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Applying cultural humility in SUD treatment</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Addressing racial/ethnic disparities</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Working with LGBTQ+ individuals with SUDs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Treating pregnant/parenting women with SUDs</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            }
      ]
    },
    {
      order: 5,
      title: `Module 5: RELAPSE PREVENTION AND RECOVERY SUPPORT`,
      estimatedTime: 30,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Module 5: RELAPSE PREVENTION AND RECOVERY SUPPORT`,
              subtitle: `28 Days Later: Understanding Addiction and Recovery`,
              sectionNumber: 5,
            },
{
              type: "text",
              order: 2,
              content: `<p><strong>Estimated Time: 30 minutes | 3,600+ words</strong></p>`,
            },
{
              type: "text",
              order: 3,
              content: `<h2>🎯 PRE-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Understanding the relapse process</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Developing relapse prevention plans</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Supporting long-term recovery</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Facilitating mutual support engagement</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            },
{
              type: "text",
              order: 4,
              content: `<h2>5.1 Understanding Relapse: A Process, Not an Event</h2>
<p>Relapse is one of the most challenging aspects of addiction treatment for both clients and counselors. Reframing relapse as a process rather than a discrete event opens opportunities for prevention and intervention.</p>`,
            },
{
              type: "text",
              order: 5,
              content: `<h2>Marlatt and Gordon's Relapse Prevention Model</h2>
<p>Alan Marlatt and Judith Gordon's classic model (1985) conceptualized relapse as a process involving:</p>
<p><strong>High-Risk Situations:</strong> Environmental or internal triggers that increase vulnerability. The most common categories include:</p>
<ul>
<li>Negative emotional states (anxiety, depression, anger, boredom)</li>
<li>Interpersonal conflict</li>
<li>Social pressure</li>
<li>Celebration/positive emotional states</li>
<li>Physical discomfort or illness</li>
<li>Testing personal control</li>
</ul>
<p><strong>Coping Response:</strong> When encountering a high-risk situation, the individual either uses an effective coping response or does not. Effective coping maintains abstinence and increases self-efficacy.</p>
<p><strong>Decreased Self-Efficacy:</strong> When coping is ineffective, self-efficacy decreases, making use more likely.</p>
<p><strong>Outcome Expectancies:</strong> Positive expectations about substance effects combined with minimization of negative consequences increase relapse risk.</p>
<p><strong>Abstinence Violation Effect (AVE):</strong> If a lapse occurs, cognitive and emotional responses to that lapse determine whether it becomes a full relapse. AVE involves:</p>
<ul>
<li><strong>Attribution:</strong> "This proves I'm an addict who can never change" (stable, global, internal attribution) vs. "I slipped in a difficult situation but can learn from it" (unstable, specific, external attribution)</li>
<li><strong>Emotional response:</strong> Shame, guilt, and hopelessness increase continued use; self-compassion and problem-solving support return to recovery</li>
</ul>`,
            },
{
              type: "text",
              order: 6,
              content: `<h2>Gorski's Developmental Model of Recovery</h2>
<p>Terence Gorski expanded understanding of relapse as involving predictable warning signs that emerge before substance use:</p>
<p><strong>Stage 1 - Internal Change:</strong> Difficulty with thinking, managing emotions, and remembering <strong>Stage 2 - Denial Return:</strong> Concern about well-being but denial that problems are serious <strong>Stage 3 - Avoidance and Defensiveness:</strong> Avoiding people who will tell the truth; becoming defensive <strong>Stage 4 - Crisis Building:</strong> Problems in multiple life areas accumulate <strong>Stage 5 - Immobilization:</strong> Feeling stuck and unable to take action <strong>Stage 6 - Confusion and Overreaction:</strong> Difficulty thinking clearly; emotional overreaction <strong>Stage 7 - Depression:</strong> Feeling hopeless and unmotivated <strong>Stage 8 - Behavioral Loss of Control:</strong> Acting on impulses without considering consequences <strong>Stage 9 - Recognition of Loss of Control:</strong> Recognizing that behavior is out of control but not knowing what to do <strong>Stage 10 - Option Reduction:</strong> Seeing fewer and fewer options; feeling trapped <strong>Stage 11 - Use Episode:</strong> Substance use as the "only option" remaining</p>
<p>Recognizing earlier warning signs allows intervention before use occurs.</p>`,
            },
{
              type: "text",
              order: 7,
              content: `<h2>⚡ MYTH VS. FACT: RELAPSE AND RECOVERY</h2><table class="cr-table">
<tr><th>Myth</th><th>Fact</th></tr>
<tr><td>"Relapse means treatment failure and the person isn't ready for recovery."</td><td>Relapse rates for addiction (40-60%) are similar to other chronic conditions like diabetes (30-50%) and hypertension (50-70%). Relapse signals need for treatment adjustment, not abandonment.</td></tr>
<tr><td>"Once you relapse, you have to start over from the beginning."</td><td>Recovery is not a linear process. Skills learned, relationships built, and progress made are not erased by a lapse. Many individuals achieve stable recovery after multiple treatment episodes.</td></tr>
<tr><td>"Strict abstinence is the only valid recovery goal."</td><td>While abstinence is often optimal, harm reduction approaches recognize that reduced use, safer use, and improved functioning are meaningful outcomes. Rigid abstinence requirements may exclude individuals who could benefit from treatment.</td></tr>
<tr><td>"Willpower is the most important factor in preventing relapse."</td><td>Effective relapse prevention involves skills, supports, lifestyle changes, and often medication—not willpower alone. The brain changes of addiction impair the very self-control systems "willpower" relies on.</td></tr>
</table>`,
            },
{
              type: "text",
              order: 8,
              content: `<h2>5.2 Developing Comprehensive Relapse Prevention Plans</h2>
<p>Effective relapse prevention planning is collaborative, individualized, and specific enough to guide action in high-risk moments.</p>`,
            },
{
              type: "text",
              order: 9,
              content: `<h2>Components of a Relapse Prevention Plan</h2>
<p><strong>1. Personal Warning Signs</strong></p>
<ul>
<li>Internal (thoughts, emotions, physical sensations)</li>
<li>External (behaviors, changes in routine, relationship shifts)</li>
<li>Identified collaboratively based on client's history</li>
</ul>
<p><strong>2. High-Risk Situations</strong></p>
<ul>
<li>Specific triggers identified through functional analysis</li>
<li>Situations graded by risk level</li>
<li>Plans to avoid, escape, or cope with each</li>
</ul>
<p><strong>3. Coping Strategies</strong></p>
<ul>
<li>Behavioral (leaving situation, calling support person, engaging in healthy activity)</li>
<li>Cognitive (challenging thoughts, urge surfing, playing tape forward)</li>
<li>Emotional regulation skills</li>
<li>Emergency strategies for intense cravings</li>
</ul>
<p><strong>4. Support Network</strong></p>
<ul>
<li>Names and contact information for support people</li>
<li>Sponsor or recovery coach</li>
<li>Professional supports (therapist, prescriber)</li>
<li>When and how to reach out</li>
</ul>
<p><strong>5. Recovery Maintenance Activities</strong></p>
<ul>
<li>Meeting attendance schedule</li>
<li>Therapy appointments</li>
<li>Healthy routines (exercise, sleep, nutrition)</li>
<li>Meaningful activities and relationships</li>
</ul>
<p><strong>6. Emergency Plan</strong></p>
<ul>
<li>What to do if a lapse occurs</li>
<li>Who to call immediately</li>
<li>How to prevent lapse from becoming full relapse</li>
<li>Naloxone access and overdose prevention (for opioid use)</li>
</ul>`,
            },
{
              type: "text",
              order: 10,
              content: `<h2>🛠️ SKILL BUILDER: DEREK'S RELAPSE PREVENTION PLAN</h2>
<p>Help Derek complete key sections of his relapse prevention plan:</p>
<p><strong>My Personal Warning Signs (that I'm heading toward relapse):</strong></p>
<p><em>Internal:</em></p>
<ol>
<li>________________________________</li>
<li>________________________________</li>
<li>________________________________</li>
</ol>
<p><em>External/Behavioral:</em></p>
<ol>
<li>________________________________</li>
<li>________________________________</li>
<li>________________________________</li>
</ol>
<p><strong>My Top 3 High-Risk Situations:</strong></p><table class="cr-table">
<tr><th>Situation</th><th>Risk Level (1-10)</th><th>My Plan</th></tr>
<tr><td>1.</td><td></td><td></td></tr>
<tr><td>2.</td><td></td><td></td></tr>
<tr><td>3.</td><td></td><td></td></tr>
</table><p><strong>My Support Network:</strong></p>
<p>| Person | Role | Phone Number | When to Call | |--------|------|--------------|--------------| | | Spouse | | | | | Sponsor/Recovery Coach | | | | | Therapist | | | | | Friend in Recovery | | |</p>
<p><strong>If I slip, I will immediately:</strong></p>
<ol>
<li>________________________________</li>
<li>________________________________</li>
<li>________________________________</li>
</ol>
<p><details> <summary><strong>Click to reveal example responses</strong></summary></p>
<p><strong>Derek's Personal Warning Signs:</strong></p>
<p><em>Internal:</em></p>
<ol>
<li>Feeling increasingly irritable and "on edge" throughout the day</li>
<li>Thoughts like "I deserve a drink" or "One won't hurt"</li>
<li>Physical tension, especially in shoulders and jaw</li>
</ol>
<p><em>External/Behavioral:</em></p>
<ol>
<li>Making excuses to stop by the liquor store</li>
<li>Isolating from Keisha and avoiding conversations about feelings</li>
<li>Skipping therapy sessions or recovery meetings</li>
</ol>
<p><strong>Derek's Top 3 High-Risk Situations:</strong></p>
<p>| Situation | Risk Level | Plan | |-----------|------------|------| | 1. After work on high-stress days | 9/10 | Call Keisha before leaving work. Drive home via route that doesn't pass liquor store. Have non-alcoholic beer available. Take shower and decompress before dinner. | | 2. Watching football on Sundays | 8/10 | Invite sober friend to watch. Keep kitchen stocked with NA beverages. Step outside if cravings hit. Have Keisha check in during halftime. | | 3. Arguments with Keisha | 8/10 | Take a time out rather than escalate. Use "I feel" statements. If overwhelmed, go for walk or call sponsor. Return to discussion when calm. |</p>
<p><strong>Derek's Support Network:</strong></p>
<p>| Person | Role | Phone | When to Call | |--------|------|-------|--------------| | Keisha | Spouse | xxx-xxx-xxxx | Daily check-in; any time struggling | | Marcus | Sponsor | xxx-xxx-xxxx | Before any high-risk situation; when craving | | Dr. Thompson | Therapist | xxx-xxx-xxxx | Weekly session; crisis situations | | Jerome | Friend in recovery | xxx-xxx-xxxx | When need peer support |</p>
<p><strong>If I slip:</strong></p>
<ol>
<li>STOP immediately—do not continue using</li>
<li>Call Marcus (sponsor) within 10 minutes</li>
<li>Tell Keisha the truth that same day</li>
<li>Attend a meeting within 24 hours</li>
<li>Contact Dr. Thompson to schedule extra session</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 11,
              content: `<h2>5.3 Mutual Support Groups and Recovery Community</h2>
<p>Mutual support groups provide ongoing community-based support that complements professional treatment. While 12-step programs are most widely known, multiple options exist.</p>`,
            },
{
              type: "text",
              order: 12,
              content: `<h2>12-Step Programs (AA, NA, CA, etc.)</h2>
<p><strong>Philosophy:</strong> Addiction as a spiritual disease requiring surrender of control, connection with higher power, and working the 12 steps.</p>
<p><strong>Structure:</strong> Regular meetings (open or closed), sponsorship, step work, service</p>
<p><strong>Strengths:</strong></p>
<ul>
<li>Widely available, free, and accessible</li>
<li>Strong social support network</li>
<li>Structured program of recovery</li>
<li>Long-term community engagement</li>
</ul>
<p><strong>Limitations:</strong></p>
<ul>
<li>Spiritual emphasis may not fit all individuals</li>
<li>Abstinence-only philosophy</li>
<li>Variable meeting quality and culture</li>
<li>May not adequately address trauma, mental health</li>
</ul>`,
            },
{
              type: "text",
              order: 13,
              content: `<h2>Secular and Alternative Approaches</h2>
<p><strong>SMART Recovery (Self-Management and Recovery Training):</strong></p>
<ul>
<li>Science-based program using CBT principles</li>
<li>Four-point program: Building motivation, coping with urges, managing thoughts/feelings/behaviors, living a balanced life</li>
<li>Secular, no higher power requirement</li>
<li>Tools-based rather than step-based</li>
</ul>
<p><strong>Refuge Recovery/Recovery Dharma:</strong></p>
<ul>
<li>Buddhist-informed approach</li>
<li>Meditation practice central</li>
<li>Four Noble Truths framework</li>
<li>Secular spirituality focused on mindfulness</li>
</ul>
<p><strong>Wellbriety:</strong></p>
<ul>
<li>Native American approach integrating traditional practices</li>
<li>Addresses historical and intergenerational trauma</li>
<li>Community and cultural connection</li>
<li>Incorporates Native spirituality and healing</li>
</ul>
<p><strong>Celebrate Recovery:</strong></p>
<ul>
<li>Christian-based 12-step program</li>
<li>Christ-centered higher power</li>
<li>Church-affiliated meetings</li>
<li>Addresses multiple "hurts, habits, and hang-ups"</li>
</ul>
<p><strong>Moderation Management:</strong></p>
<ul>
<li>Supports moderation rather than abstinence goals</li>
<li>For individuals with mild-moderate alcohol problems</li>
<li>Not appropriate for those with severe AUD or other drug problems</li>
</ul>`,
            },
{
              type: "text",
              order: 14,
              content: `<h2>Counselor's Role</h2>
<p><strong>Facilitate informed choice:</strong> Present options and help clients identify best fit.</p>
<p><strong>Address barriers:</strong> Explore concerns about meetings (stigma, spirituality, time, childcare) and problem-solve.</p>
<p><strong>Encourage sampling:</strong> Suggest clients try multiple meetings/programs before deciding.</p>
<p><strong>Don't mandate:</strong> Coerced attendance predicts poorer outcomes than voluntary engagement.</p>
<p><strong>Maintain collaboration:</strong> Stay connected with client's mutual support experience and integrate with clinical work.</p>`,
            },
{
              type: "text",
              order: 15,
              content: `<h2>5.4 Long-Term Recovery and Recovery Capital</h2>
<p>Recovery extends far beyond the cessation of substance use. The recovery movement emphasizes that recovery is a process of building a meaningful, satisfying life.</p>`,
            },
{
              type: "text",
              order: 16,
              content: `<h2>SAMHSA's Working Definition of Recovery</h2>
<p>"A process of change through which individuals improve their health and wellness, live a self-directed life, and strive to reach their full potential."</p>
<p><strong>Four Dimensions of Recovery:</strong></p>
<ol>
<li><strong>Health:</strong> Managing disease(s) and making healthy choices</li>
<li><strong>Home:</strong> Having a stable and safe place to live</li>
<li><strong>Purpose:</strong> Meaningful daily activities (job, school, family, volunteering)</li>
<li><strong>Community:</strong> Relationships and social networks providing support, friendship, love, and hope</li>
</ol>`,
            },
{
              type: "text",
              order: 17,
              content: `<h2>Recovery Capital</h2>
<p>Recovery capital refers to the resources—internal and external—that support initiation and maintenance of recovery:</p>
<p><strong>Personal Recovery Capital:</strong></p>
<ul>
<li>Physical health</li>
<li>Mental health stability</li>
<li>Self-efficacy and hope</li>
<li>Coping skills</li>
<li>Spirituality or meaning system</li>
<li>Problem-solving abilities</li>
</ul>
<p><strong>Social Recovery Capital:</strong></p>
<ul>
<li>Supportive family relationships</li>
<li>Sober friendships</li>
<li>Recovery community connections</li>
<li>Pro-social activities and involvement</li>
</ul>
<p><strong>Community Recovery Capital:</strong></p>
<ul>
<li>Access to treatment and healthcare</li>
<li>Recovery-supportive housing</li>
<li>Employment opportunities</li>
<li>Transportation</li>
<li>Recovery community organizations</li>
<li>Faith communities</li>
</ul>
<p><strong>Cultural Recovery Capital:</strong></p>
<ul>
<li>Cultural identity and pride</li>
<li>Connection to cultural community</li>
<li>Culturally-specific recovery resources</li>
<li>Traditional healing practices</li>
</ul>
<p>Effective treatment and recovery support help individuals build recovery capital across all these domains.</p>`,
            },
{
              type: "text",
              order: 18,
              content: `<h2>📋 CONTINUING VIGNETTE: MARISOL'S RECOVERY JOURNEY</h2>
<p>Three months into treatment, Marisol has made significant progress. She has not used unprescribed benzodiazepines since her mother secured the Xanax. She has reduced her alcohol use from nightly to 2-3 times per week, with several weeks of complete abstinence. Her PTSD symptoms have decreased with trauma-informed care, and her depression has improved.</p>
<p>Today, Marisol appears distressed: "I slipped last night. I got in an argument with my daughter's father about child support, and I just wanted to escape. I drank a whole bottle of wine. I feel so ashamed—I thought I was past this."</p>`,
            },
{
              type: "text",
              order: 19,
              content: `<h2>🔀 DECISION POINT: RESPONDING TO RELAPSE</h2>
<p>How do you respond to Marisol's disclosure?</p>
<p><strong>Option A:</strong> "I'm disappointed. After all the progress you've made, why would you throw it away over an argument?"</p>
<p><strong>Option B:</strong> "Thank you for telling me. That took courage. Let's understand what happened and figure out what you can learn from it without losing sight of all the progress you've made."</p>
<p><strong>Option C:</strong> "This is very serious. You need to go back to the beginning of treatment and start over."</p>
<p><strong>Option D:</strong> "It's okay, everyone slips sometimes. Don't worry about it."</p>
<p><details> <summary><strong>Click to reveal optimal response and rationale</strong></summary></p>
<p><strong>Optimal Response: Option B</strong></p>
<p>This response:</p>
<ul>
<li><strong>Affirms honesty:</strong> Acknowledging the courage to disclose builds trust and encourages future disclosure</li>
<li><strong>Avoids shaming:</strong> Shame increases the Abstinence Violation Effect and risk of continued use</li>
<li><strong>Promotes learning:</strong> Frames lapse as opportunity for understanding, not failure</li>
<li><strong>Maintains perspective:</strong> Doesn't minimize but also doesn't catastrophize; acknowledges ongoing progress</li>
</ul>
<p><strong>Why Option A is harmful:</strong> Expressing disappointment triggers shame, reinforces negative self-attribution, and damages the therapeutic alliance.</p>
<p><strong>Why Option C is harmful:</strong> Negating three months of progress reinforces the Abstinence Violation Effect and catastrophizes a single episode.</p>
<p><strong>Why Option D is suboptimal:</strong> While well-intentioned, minimizing ("don't worry about it") misses the opportunity for learning and may communicate that the lapse isn't being taken seriously.</p>
<p><strong>Clinical Follow-Up:</strong></p>
<ul>
<li>Validate Marisol's distress while reducing shame</li>
<li>Explore the chain of events leading to drinking</li>
<li>Identify what she might do differently next time</li>
<li>Update relapse prevention plan to address conflict with ex-partner</li>
<li>Assess current safety (suicidality, continued use)</li>
<li>Reinforce continued engagement and progress made</li>
</ul>
<p></details></p>`,
            },
{
              type: "text",
              order: 20,
              content: `<h2>5.5 Continuing Care and Chronic Disease Management</h2>
<p>Substance use disorders are chronic conditions that often require ongoing monitoring and support, similar to diabetes or hypertension.</p>`,
            },
{
              type: "text",
              order: 21,
              content: `<h2>The Recovery Management Model</h2>
<p>This model shifts from acute care (treat and discharge) to chronic care (ongoing management):</p>
<p><strong>Assessment:</strong> Ongoing rather than one-time <strong>Treatment:</strong> As long as needed, adjusted to current status <strong>Monitoring:</strong> Regular check-ins even during stable periods <strong>Support:</strong> Long-term recovery community involvement <strong>Re-intervention:</strong> Rapid response when warning signs emerge</p>`,
            },
{
              type: "text",
              order: 22,
              content: `<h2>Continuing Care Strategies</h2>
<p><strong>Step-Down Treatment:</strong> Gradual reduction in treatment intensity as stability increases (e.g., IOP → OP → monthly check-ins → peer support).</p>
<p><strong>Recovery Checkups:</strong> Periodic assessments (quarterly or bi-annually) to monitor status and provide brief intervention if needed.</p>
<p><strong>Continuing Care Contracts:</strong> Clear agreements about ongoing participation, checkups, and re-engagement protocols.</p>
<p><strong>Peer Recovery Support Services:</strong> Trained peer recovery coaches provide ongoing, non-clinical support.</p>
<p><strong>Recovery Housing:</strong> Sober living environments provide structure and community during transition.</p>`,
            },
{
              type: "text",
              order: 23,
              content: `<h2>Technology-Assisted Continuing Care</h2>
<p><strong>Recovery Apps:</strong> Smartphone applications for tracking sobriety, managing cravings, connecting with supports</p>
<p><strong>Telehealth:</strong> Video-based continuing care sessions improve access and retention</p>
<p><strong>Text-Based Support:</strong> Automated text messages and/or text exchanges with counselors</p>
<p><strong>Online Meetings:</strong> Virtual mutual support meetings (expanded greatly during COVID-19)</p>`,
            },
{
              type: "text",
              order: 24,
              content: `<h2>✅ MODULE 5 KNOWLEDGE CHECK</h2>
<p><strong>Complete all 5 questions. You must answer at least 4 correctly (80%) to proceed.</strong></p>
<p><strong>Question 1:</strong> According to Marlatt and Gordon's model, the Abstinence Violation Effect (AVE) involves:</p>
<p>A) The physical symptoms of withdrawal after a period of abstinence B) Cognitive and emotional responses to a lapse that determine whether it becomes a full relapse C) The legal violations that occur when substance use resumes D) The effect of mandatory abstinence policies on treatment engagement</p>
<p><strong>Question 2:</strong> Which mutual support approach is secular, science-based, and uses CBT principles?</p>
<p>A) Alcoholics Anonymous B) Celebrate Recovery C) SMART Recovery D) Wellbriety</p>
<p><strong>Question 3:</strong> The four dimensions of recovery according to SAMHSA are:</p>
<p>A) Abstinence, meetings, sponsorship, service B) Health, home, purpose, community C) Physical, mental, social, spiritual D) Detox, treatment, aftercare, maintenance</p>
<p><strong>Question 4:</strong> In Gorski's relapse warning sign model, which stage typically occurs before substance use?</p>
<p>A) Only internal changes in thinking B) A predictable series of stages from internal changes through behavioral loss of control C) No identifiable warning signs—relapse is random D) Only external circumstances beyond the person's control</p>
<p><strong>Question 5:</strong> When a client discloses a relapse, the therapist's primary goal should be to:</p>
<p>A) Express disappointment to prevent future lapses B) Recommend immediate hospitalization C) Explore the circumstances and frame it as a learning opportunity without shaming D) Terminate treatment since the client is not ready</p>
<p><details> <summary><strong>Click to reveal answers</strong></summary></p>
<ol>
<li><strong>B) Cognitive and emotional responses to a lapse that determine whether it becomes a full relapse</strong> — AVE involves how the person thinks about and responds to a slip.</li>
</ol>
<ol>
<li><strong>C) SMART Recovery</strong> — SMART uses CBT-based tools in a secular, science-based format.</li>
</ol>
<ol>
<li><strong>B) Health, home, purpose, community</strong> — These are SAMHSA's four dimensions supporting recovery.</li>
</ol>
<ol>
<li><strong>B) A predictable series of stages from internal changes through behavioral loss of control</strong> — Gorski identified 11 stages of relapse warning signs.</li>
</ol>
<ol>
<li><strong>C) Explore the circumstances and frame it as a learning opportunity without shaming</strong> — Shame increases AVE; exploration supports learning and continued engagement.</li>
</ol>
<p></details></p>`,
            },
{
              type: "text",
              order: 25,
              content: `<h2>🎯 POST-MODULE PULSE CHECK</h2><table class="cr-table">
<tr><th>Competency Area</th><th>Not Confident (1)</th><th>Somewhat (2)</th><th>Confident (3)</th><th>Very Confident (4)</th></tr>
<tr><td>Understanding the relapse process</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Developing relapse prevention plans</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Supporting long-term recovery</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
<tr><td>Facilitating mutual support engagement</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
</table>`,
            }
      ]
    },
    {
      order: 6,
      title: `Course Summary and References`,
      estimatedTime: 10,
      contentBlocks: [
{
              type: "sectionDivider",
              order: 1,
              title: `Course Summary and References`,
              subtitle: `Key Takeaways and APA 7th Edition References`,
              sectionNumber: 6,
            },
{
              type: "text",
              order: 2,
              content: `<h2>Key Takeaways</h2><p>This course has provided a comprehensive examination of 28 days later: understanding addiction and recovery. As you apply these concepts with clients, continue to seek consultation and pursue ongoing professional development.</p>`,
            },
{
              type: "reflection",
              order: 3,
              prompt: `Course Reflection`,
              content: `<p>Consider how the concepts presented in this course will inform your clinical work. What specific practices will you implement? What aspects of your current practice might you reconsider?</p>`,
            },
{
              type: "text",
              order: 4,
              content: `<div class="cr-references"><h3>References</h3>
<p class="cr-reference">American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). American Psychiatric Publishing.</p>
<p class="cr-reference">American Society of Addiction Medicine. (2019). Definition of addiction. https://www.asam.org/quality-care/definition-of-addiction</p>
<p class="cr-reference">Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P., & Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245-258.</p>
<p class="cr-reference">Gorski, T. T., & Miller, M. (1986). Staying sober: A guide for relapse prevention. Independence Press.</p>
<p class="cr-reference">Marlatt, G. A., & Gordon, J. R. (Eds.). (1985). Relapse prevention: Maintenance strategies in the treatment of addictive behaviors. Guilford Press.</p>
<p class="cr-reference">Meyer, I. H. (2003). Prejudice, social stress, and mental health in lesbian, gay, and bisexual populations: Conceptual issues and research evidence. Psychological Bulletin, 129(5), 674-697.</p>
<p class="cr-reference">Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press.</p>
<p class="cr-reference">National Institute on Drug Abuse. (2020). Drugs, brains, and behavior: The science of addiction. National Institutes of Health.</p>
<p class="cr-reference">Substance Abuse and Mental Health Services Administration. (2023). Key substance use and mental health indicators in the United States: Results from the 2022 National Survey on Drug Use and Health. HHS Publication No. PEP23-07-01-006.</p>
<p class="cr-reference">Volkow, N. D., Koob, G. F., & McLellan, A. T. (2016). Neurobiologic advances from the brain disease model of addiction. New England Journal of Medicine, 374(4), 363-371.</p>
<p class="cr-reference">White, W. L. (2009). Peer-based addiction recovery support: History, theory, practice, and scientific evaluation. Great Lakes Addiction Technology Transfer Center.</p>
</div>`,
            }
      ]
    }
  ]
};

const existing = await col.findOne({ slug: course.slug });
if (existing) { await col.updateOne({ _id: existing._id }, { $set: course }); console.log(`✅ UPDATED: ${course.title}`); }
else { await col.insertOne(course); console.log(`✅ INSERTED: ${course.title}`); }

const saved = await col.findOne({ slug: course.slug }, { projection: { title:1,ceHours:1,sections:1,'assessment.questions':1 } });
const blocks = (saved.sections||[]).reduce((s,sec)=>s+(sec.contentBlocks||[]).length,0);
const kc_f = (saved.sections||[]).reduce((n,sec)=>n+(sec.contentBlocks||[]).filter(b=>b.type==='multipleChoice'&&(b.explanation||'').includes('⚠️')).length,0);
console.log(`\n=== CR-301 STATS ===`);
console.log(`Sections: ${(saved.sections||[]).length} | Blocks: ${blocks} | Exam Qs: ${(saved.assessment?.questions||[]).length} | KC flagged: ${kc_f}`);
if (kc_f) console.log(`⚠️  ${kc_f} KC questions need correctAnswer set before publishing.`);
await mongoose.disconnect();
