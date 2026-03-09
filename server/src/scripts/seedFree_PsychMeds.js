/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUG = 'psychiatric-medications-basics';

const COURSE = {
  title: "Psychiatric Medications: What Every Clinician Needs to Know",
  slug: SLUG,
  courseCode: "CR-105",
  description: "Non-prescribing mental health clinicians play a critical role in medication-related care—recognizing when referral is appropriate, monitoring therapeutic and adverse effects, understanding how medications interact with psychotherapy, and communicating effectively with prescribers. This 1-hour continuing education course provides a practical, clinically relevant overview of the major psychiatric medication classes, their mechanisms of action, common side effects, and the collaborative competencies needed to support clients who are taking or considering psychotropic medication. This course does not train clinicians to prescribe or recommend specific medications; rather, it equips them to function as informed members of integrated treatment teams.",
  ceHours: 1,
  ceuHours: 1,
  ceuEligible: true,
  ceCategory: "General",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  accessType: "free",
  price: 0,
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  level: "Introductory",
  deliveryMethod: "Asynchronous Online",
  objectives: [
    "Identify the major classes of psychiatric medications and their primary clinical indications",
    "Describe basic mechanisms of action for antidepressants, anxiolytics, mood stabilizers, and antipsychotics",
    "Recognize common side effects and adverse reactions that warrant prescriber communication",
    "Articulate the non-prescribing clinician's scope of practice regarding medication discussions",
    "Apply collaborative communication strategies when coordinating care with prescribing providers"
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Counselors-in-Training under supervision"
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia"
  },
  references: [
    { title: "Stahl's essential psychopharmacology: Neuroscientific basis and practical applications (5th ed.)", author: "Stahl, S. M.", year: 2021, source: "Cambridge University Press" },
    { title: "Psychopharmacology for mental health professionals: An integrative approach (3rd ed.)", author: "Sinacola, R. S., & Peters-Strickland, T.", year: 2019, source: "F.A. Davis" },
    { title: "The American Psychiatric Association practice guidelines for the treatment of psychiatric disorders", author: "American Psychiatric Association", year: 2022, source: "APA Publishing" },
    { title: "Clinical psychopharmacology made ridiculously simple (9th ed.)", author: "Preston, J. D., O'Neal, J. H., & Talaga, M. C.", year: 2021, source: "MedMaster" },
    { title: "Collaborating with prescribers: A guide for mental health clinicians", author: "Ingersoll, R. E., & Rak, C. F.", year: 2016, source: "American Counseling Association" },
    { title: "ACA Code of Ethics", author: "American Counseling Association", year: 2014, source: "ACA" },
    { title: "Practice guideline for the treatment of patients with major depressive disorder (3rd ed.)", author: "American Psychiatric Association", year: 2010, source: "APA" }
  ],
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  // ═══════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════
  sections: [

    // ─── SECTION 1 ──────────────────────────────────
    {
      title: "Antidepressants and Anxiolytics: Foundations for Clinical Awareness",
      description: "SSRIs, SNRIs, atypical antidepressants, benzodiazepines, and buspirone—mechanisms, indications, and what clinicians observe",
      module: "Module 1: Antidepressants and Anxiolytics",
      order: 1,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Why Non-Prescribing Clinicians Need Medication Literacy</h2>
<p>Survey data consistently show that a significant proportion of clients in outpatient mental health treatment are taking at least one psychotropic medication. For clinicians who provide psychotherapy, medication literacy is not optional—it is a core competency. You will encounter clients who ask whether they should start medication, clients who want to discontinue medication against medical advice, clients whose therapeutic progress is limited by untreated biological symptoms, and clients whose side effects are being mistaken for psychological resistance.</p>
<p>Medication literacy for non-prescribers does not mean learning to prescribe. It means understanding enough about what medications do, how they work, and what to watch for so that you can: (1) recognize when a medication referral may be clinically appropriate, (2) identify side effects or adverse reactions that warrant communication with the prescriber, (3) support medication adherence through psychoeducation and motivational exploration, and (4) avoid inadvertently undermining the prescriber's treatment plan.</p>
<p>A critical distinction must be made at the outset: <strong>non-prescribing clinicians should never recommend specific medications, suggest dosage changes, or advise clients to start or stop medication</strong>. These actions fall outside the scope of practice for LPCs, LCSWs, LMFTs, and psychologists without prescriptive authority. What we can and should do is educate ourselves about the medications our clients take, ask informed questions, and communicate observations to prescribers.</p>
<h2>Selective Serotonin Reuptake Inhibitors (SSRIs)</h2>
<p>SSRIs remain the most commonly prescribed class of antidepressant worldwide, and for good reason: they have a favorable side-effect profile compared to older antidepressants, a wide therapeutic window (making overdose less dangerous), and demonstrated efficacy across multiple conditions. The SSRIs include <strong>fluoxetine</strong> (Prozac), <strong>sertraline</strong> (Zoloft), <strong>paroxetine</strong> (Paxil), <strong>citalopram</strong> (Celexa), <strong>escitalopram</strong> (Lexapro), and <strong>fluvoxamine</strong> (Luvox).</p>
<p>The basic mechanism of SSRIs involves blocking the reuptake of serotonin in the synaptic cleft, making more serotonin available for neurotransmission. However, it is important for clinicians to understand that this explanation is a simplification. The therapeutic effects of SSRIs take 4–6 weeks to fully develop—a timeline that is inconsistent with simple serotonin increase, which occurs within hours of the first dose. Current neuroscience suggests that the downstream effects of sustained serotonin enhancement—including neuroplasticity changes, receptor downregulation, and alterations in gene expression—are what actually produce the antidepressant effect.</p>
<p>This timeline matters clinically. Clients who begin an SSRI will often experience side effects before they experience therapeutic benefits. Common early side effects include <strong>nausea, headache, gastrointestinal disturbance, increased anxiety, insomnia or hypersomnia, and sexual dysfunction</strong>. Many clients discontinue medication during this window because they feel worse, not better. As a therapist, understanding and normalizing this timeline can significantly support medication adherence. You are not prescribing—you are helping the client understand what their prescriber has already communicated and working through their ambivalence.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Why is it clinically important to understand the 4–6 week onset delay for SSRI therapeutic effects?",
          options: [
            { text: "It helps clinicians determine the correct SSRI dosage for their clients", isCorrect: false },
            { text: "Clients often experience side effects before benefits, leading to premature discontinuation—therapists can normalize this timeline and support adherence", isCorrect: true },
            { text: "It indicates that SSRIs are less effective than other medication classes", isCorrect: false },
            { text: "The delay proves that serotonin is not involved in depression", isCorrect: false }
          ],
          explanation: "The 4–6 week onset delay means clients often experience side effects (nausea, increased anxiety, sleep disruption) before any therapeutic benefit. Understanding this timeline allows non-prescribing clinicians to normalize the experience and support adherence—not to adjust dosing, which is outside their scope."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs)</h2>
<p>SNRIs work on two neurotransmitter systems simultaneously: serotonin and norepinephrine. The primary SNRIs include <strong>venlafaxine</strong> (Effexor), <strong>duloxetine</strong> (Cymbalta), <strong>desvenlafaxine</strong> (Pristiq), and <strong>levomilnacipran</strong> (Fetzima). These medications are often prescribed when SSRIs have been ineffective, when the clinical presentation includes significant fatigue or pain components, or when the client presents with comorbid anxiety and depression.</p>
<p>The dual mechanism is clinically relevant because norepinephrine plays a significant role in energy, concentration, and pain modulation. Clients on SNRIs may report improved energy and motivation earlier than mood improvement. Duloxetine, in particular, has FDA approval for chronic pain conditions including fibromyalgia and diabetic neuropathy, making it a common choice when depression co-occurs with chronic pain.</p>
<p>Side effects of SNRIs overlap with SSRIs but may also include <strong>elevated blood pressure</strong> (particularly with venlafaxine at higher doses), <strong>increased sweating</strong>, and <strong>dry mouth</strong>. The blood pressure concern is especially important: clients on venlafaxine should be having their blood pressure monitored by their prescriber, and a client who reports frequent headaches, dizziness, or visual changes while on venlafaxine should be encouraged to contact their prescriber promptly.</p>
<h2>Atypical Antidepressants</h2>
<p>Several antidepressants do not fit neatly into the SSRI or SNRI categories. <strong>Bupropion</strong> (Wellbutrin) works primarily on dopamine and norepinephrine—notably, it does not affect serotonin. This makes it a useful option for clients who experience intolerable sexual side effects on SSRIs or SNRIs, as bupropion is less likely to cause sexual dysfunction. It also has activating properties, making it useful for depression characterized by low energy and anhedonia. However, bupropion lowers the seizure threshold and is contraindicated in clients with seizure disorders or active eating disorders involving purging.</p>
<p><strong>Mirtazapine</strong> (Remeron) is notable for its sedating properties and appetite stimulation. It is frequently prescribed for clients with depression accompanied by insomnia and significant weight loss. Trazodone, while technically an antidepressant, is prescribed far more frequently as a sleep aid at low doses than as an antidepressant at therapeutic doses.</p>`
        },
        {
          type: "matching",
          order: 4,
          matchingInstructions: "Match each medication or class with its distinguishing clinical characteristic:",
          matchingPairs: [
            { term: "SSRIs (e.g., sertraline)", definition: "Block serotonin reuptake; first-line for depression and anxiety with favorable side-effect profile" },
            { term: "SNRIs (e.g., duloxetine)", definition: "Block serotonin and norepinephrine reuptake; often chosen when fatigue or chronic pain is present" },
            { term: "Bupropion", definition: "Acts on dopamine and norepinephrine; low sexual side effects; contraindicated with seizure disorders" },
            { term: "Mirtazapine", definition: "Sedating with appetite stimulation; used when insomnia and weight loss accompany depression" },
            { term: "Trazodone", definition: "Technically an antidepressant but most commonly prescribed at low doses as a sleep aid" }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "A client with major depressive disorder reports that sertraline was effective for their mood but they discontinued it due to intolerable sexual side effects. Which medication's mechanism makes it the least likely to cause sexual dysfunction?",
          options: [
            { text: "Paroxetine, because it is the most potent SSRI", isCorrect: false },
            { text: "Venlafaxine, because it adds norepinephrine to serotonin activity", isCorrect: false },
            { text: "Bupropion, because it acts on dopamine and norepinephrine without affecting serotonin", isCorrect: true },
            { text: "Escitalopram, because it is the most selective SSRI", isCorrect: false }
          ],
          explanation: "Sexual dysfunction from antidepressants is primarily mediated through serotonergic activity. Bupropion acts on dopamine and norepinephrine without affecting serotonin, making it the least likely to cause sexual side effects. Note: paroxetine actually has the highest rate of sexual side effects among SSRIs."
        },
        {
          type: "text",
          order: 6,
          textContent: `<h2>Benzodiazepines: Rapid Relief with Significant Risks</h2>
<p>Benzodiazepines—including <strong>alprazolam</strong> (Xanax), <strong>lorazepam</strong> (Ativan), <strong>clonazepam</strong> (Klonopin), and <strong>diazepam</strong> (Valium)—are GABA-A receptor agonists that produce rapid anxiolytic, sedative, and muscle-relaxant effects. Unlike SSRIs, which take weeks to work, benzodiazepines provide relief within 30–60 minutes, which is both their primary clinical advantage and their primary risk factor.</p>
<p>The rapid onset creates a powerful reinforcement loop: anxiety → take medication → feel relief within minutes. This conditioning can drive both psychological dependence (the belief that one cannot manage anxiety without the medication) and physiological dependence (tolerance and withdrawal). <strong>Benzodiazepine withdrawal can be medically dangerous</strong>—unlike most psychiatric medications, abrupt discontinuation of benzodiazepines after sustained use can cause seizures, and in severe cases, death. Clients should never be advised to abruptly stop benzodiazepines; tapers must be managed by a prescriber.</p>
<p>For clinicians providing therapy, benzodiazepines present a particular challenge to <strong>exposure-based treatments</strong>. If a client takes a benzodiazepine before an exposure exercise, the learning that occurs during exposure may be state-dependent—meaning it does not transfer to the non-medicated state. Research by Michael Otto and others has demonstrated that benzodiazepine use during exposure therapy can actually undermine long-term treatment outcomes. This does not mean benzodiazepines are never appropriate alongside therapy, but the timing and clinical reasoning must be carefully coordinated with the prescriber.</p>
<h2>Buspirone: The Non-Benzodiazepine Anxiolytic</h2>
<p><strong>Buspirone</strong> (Buspar) is a serotonin 5-HT1A partial agonist that treats generalized anxiety without the sedation, dependence risk, or cognitive impairment associated with benzodiazepines. However, like SSRIs, buspirone takes 2–4 weeks to reach therapeutic effect. Clients who have previously used benzodiazepines often report dissatisfaction with buspirone because they do not experience the immediate relief they associate with effective anxiolytic treatment. Managing these expectations is an important role for the therapist.</p>`
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "Why might benzodiazepine use during exposure therapy be clinically problematic?",
          options: [
            { text: "Benzodiazepines increase anxiety during exposure, making it less tolerable", isCorrect: false },
            { text: "Learning during exposure may become state-dependent, failing to transfer to the non-medicated state", isCorrect: true },
            { text: "Benzodiazepines block all serotonin activity needed for fear extinction", isCorrect: false },
            { text: "Benzodiazepines cause amnesia that prevents any memory formation during exposure", isCorrect: false }
          ],
          explanation: "Research shows that the anxiolytic effects of benzodiazepines during exposure can create state-dependent learning—the fear extinction learned while medicated may not generalize to the unmedicated state. This is why coordination between prescriber and therapist about medication timing and exposure work is essential."
        },
        {
          type: "accordion",
          order: 8,
          title: "Clinical Alert: Medication Topics Non-Prescribers Must Navigate Carefully",
          accordionItems: [
            {
              title: "When Clients Ask 'Should I Take Medication?'",
              content: "This is one of the most common questions clients pose to their therapists. An appropriate response acknowledges the question without prescribing: 'That's a really important question to explore. I'm not able to make medication recommendations—that's outside my scope of practice. What I can do is help you think through what you're hoping medication might do for you, and if you're interested, I can help you connect with a prescriber who can do a thorough evaluation.' This response validates the client, clarifies scope, and offers a concrete next step."
            },
            {
              title: "When Clients Want to Stop Their Medication",
              content: "Clients frequently tell their therapist they want to stop medication before telling their prescriber. The clinician's role is to explore the reasons without encouraging or discouraging discontinuation: 'I hear that you want to stop your medication. Can you tell me more about what's driving that decision? Have you discussed this with Dr. [prescriber]?' If the client is experiencing side effects, validate their experience while emphasizing that medication changes should always be made with prescriber guidance—especially for medications that require tapering."
            },
            {
              title: "The Black Box Warning and Informed Advocacy",
              content: "SSRIs and SNRIs carry an FDA black box warning regarding increased suicidality risk in children, adolescents, and young adults (under 25) during the first weeks of treatment. This does not mean these medications cause suicidal behavior—the current understanding is that as energy and motivation return before mood improves, the risk of acting on existing suicidal ideation temporarily increases. Clinicians should ensure their risk assessment protocols are heightened during the initial weeks of antidepressant treatment for younger clients."
            }
          ]
        },
        {
          type: "reflection",
          order: 9,
          question: "Think about your current or recent caseload. How many of your clients are taking psychotropic medication? For those who are, how confident do you feel in your understanding of what they are taking, why, and what to watch for? What would it mean for your clinical practice to become more medication-literate?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "Which statement best describes the appropriate scope of practice for non-prescribing clinicians regarding psychiatric medications?",
          type: "multipleChoice",
          options: [
            { text: "Non-prescribers should recommend specific medications based on the client's symptoms", isCorrect: false },
            { text: "Non-prescribers should educate themselves about medications clients take, support adherence, and communicate observations to prescribers", isCorrect: true },
            { text: "Non-prescribers should advise clients to stop medications that appear to cause side effects", isCorrect: false },
            { text: "Non-prescribers have no role in medication-related discussions", isCorrect: false }
          ],
          explanation: "Non-prescribing clinicians should be medication-literate: understanding what clients take, monitoring for side effects, supporting adherence, and communicating observations to prescribers—without recommending, adjusting, or discontinuing medications."
        },
        {
          question: "SSRI therapeutic effects typically take 4–6 weeks to develop because:",
          type: "multipleChoice",
          options: [
            { text: "Serotonin takes that long to increase in the synaptic cleft", isCorrect: false },
            { text: "Downstream neuroplasticity changes, receptor downregulation, and gene expression alterations require sustained serotonin enhancement", isCorrect: true },
            { text: "The liver takes 4–6 weeks to metabolize the medication into its active form", isCorrect: false },
            { text: "SSRIs must accumulate to toxic levels before they become therapeutic", isCorrect: false }
          ],
          explanation: "Serotonin levels increase within hours, but the therapeutic effect depends on downstream changes including neuroplasticity, receptor downregulation, and altered gene expression—processes that require weeks of sustained serotonin enhancement."
        },
        {
          question: "Abrupt discontinuation of benzodiazepines after sustained use is medically dangerous because:",
          type: "multipleChoice",
          options: [
            { text: "It causes permanent serotonin depletion", isCorrect: false },
            { text: "It can cause seizures and potentially death due to GABA system rebound", isCorrect: true },
            { text: "It leads to irreversible cognitive impairment", isCorrect: false },
            { text: "It causes dangerous hypertension", isCorrect: false }
          ],
          explanation: "Benzodiazepines enhance GABA inhibition. After sustained use, the nervous system adapts to this enhanced inhibition. Abrupt removal causes rebound excitation, which can produce seizures and, in severe cases, death. This is why benzodiazepine discontinuation must always be managed by a prescriber through gradual tapering."
        }
      ]
    },

    // ─── SECTION 2 ──────────────────────────────────
    {
      title: "Mood Stabilizers and Antipsychotics: Broadening Clinical Awareness",
      description: "Lithium, anticonvulsant mood stabilizers, first- and second-generation antipsychotics, and metabolic monitoring",
      module: "Module 2: Mood Stabilizers and Antipsychotics",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Mood Stabilizers: Lithium and Anticonvulsants</h2>
<p><strong>Lithium</strong> remains the gold standard for mood stabilization in bipolar disorder, despite being one of the oldest psychiatric medications still in use. Discovered in 1949 by John Cade, lithium has a robust evidence base for reducing the frequency and severity of both manic and depressive episodes, and it is the only psychiatric medication with a well-documented <strong>anti-suicidal effect</strong> independent of its mood-stabilizing properties. Multiple meta-analyses have shown that lithium reduces suicide risk by approximately 60% in patients with mood disorders.</p>
<p>For the non-prescribing clinician, the most important thing to understand about lithium is its <strong>narrow therapeutic window</strong>. The difference between a therapeutic blood level and a toxic blood level is small, which is why clients on lithium require regular blood monitoring—typically every 3–6 months once stabilized. <strong>Lithium toxicity</strong> is a medical emergency presenting with tremor, confusion, ataxia, nausea, and in severe cases, seizures, coma, and death. Factors that can precipitate toxicity include dehydration, sodium-restricted diets, certain medications (particularly NSAIDs like ibuprofen), and kidney impairment.</p>
<p>Clinicians should be aware of the signs that may indicate lithium levels are drifting: <strong>increased tremor</strong> (especially if a client reports that a previously fine tremor has worsened), <strong>excessive thirst and urination</strong> (which can also be signs of lithium-related thyroid or kidney effects), <strong>nausea or diarrhea</strong>, and <strong>cognitive dulling</strong> that goes beyond the client's baseline. Any of these observations should prompt the clinician to ask when the client last had their lithium level checked and to communicate the observation to the prescriber.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "What unique therapeutic property distinguishes lithium from other mood stabilizers?",
          options: [
            { text: "It is the only mood stabilizer that treats depression", isCorrect: false },
            { text: "It has a well-documented anti-suicidal effect independent of mood stabilization", isCorrect: true },
            { text: "It works faster than any other psychiatric medication", isCorrect: false },
            { text: "It has no significant side effects compared to anticonvulsants", isCorrect: false }
          ],
          explanation: "Lithium is unique among psychiatric medications in having robust evidence for an independent anti-suicidal effect—approximately 60% reduction in suicide risk in patients with mood disorders, beyond what would be expected from mood stabilization alone."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Anticonvulsant Mood Stabilizers</h2>
<p>Several medications originally developed to treat epilepsy have demonstrated mood-stabilizing properties. <strong>Valproate</strong> (Depakote) is widely used for bipolar mania and mixed episodes. Like lithium, valproate requires blood level monitoring and carries significant risks, including <strong>hepatotoxicity</strong> (liver damage) and <strong>teratogenicity</strong> (birth defects)—it is classified as pregnancy category D and should not be used in women of childbearing age without thorough informed consent about contraceptive planning. Clinicians working with women of childbearing age who are taking valproate should be aware of this concern and ensure the prescriber has addressed it.</p>
<p><strong>Lamotrigine</strong> (Lamictal) has become increasingly popular for bipolar depression maintenance. Unlike most mood stabilizers, which are more effective against mania, lamotrigine's primary utility is in preventing depressive episodes. Its side-effect profile is generally favorable compared to lithium and valproate, but it carries one critical risk: <strong>Stevens-Johnson Syndrome (SJS)</strong>, a rare but potentially fatal skin reaction. This risk is highest during the initial dose titration period, which is why lamotrigine must be started at a low dose and increased very slowly. Clients should be educated that any new rash while starting or increasing lamotrigine warrants immediate medical evaluation.</p>
<p><strong>Carbamazepine</strong> (Tegretol) and <strong>oxcarbazepine</strong> (Trileptal) are used less frequently for mood stabilization but remain options, particularly for clients who have not responded to lithium or valproate. Carbamazepine is notable for its extensive drug interactions, including reducing the effectiveness of oral contraceptives—another critical concern for clinicians to be aware of when working with female clients.</p>`
        },
        {
          type: "matching",
          order: 4,
          matchingInstructions: "Match each mood stabilizer with its most important clinical monitoring concern:",
          matchingPairs: [
            { term: "Lithium", definition: "Narrow therapeutic window requiring regular blood level monitoring; toxicity risk with dehydration or NSAIDs" },
            { term: "Valproate (Depakote)", definition: "Hepatotoxicity and teratogenicity; pregnancy category D requiring contraceptive planning" },
            { term: "Lamotrigine (Lamictal)", definition: "Risk of Stevens-Johnson Syndrome during titration; any new rash requires immediate medical evaluation" },
            { term: "Carbamazepine (Tegretol)", definition: "Extensive drug interactions including reduced effectiveness of oral contraceptives" }
          ]
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "A client on lithium reports increased hand tremor, excessive thirst, and frequent urination over the past two weeks. The most appropriate clinical response is to:",
          options: [
            { text: "Advise the client to reduce their lithium dose until symptoms resolve", isCorrect: false },
            { text: "Ask when the client last had their lithium level checked and promptly communicate observations to the prescriber", isCorrect: true },
            { text: "Reassure the client that these are normal side effects that will resolve on their own", isCorrect: false },
            { text: "Recommend that the client switch to lamotrigine instead", isCorrect: false }
          ],
          explanation: "Worsening tremor with increased thirst and urination may indicate lithium levels are approaching toxicity or lithium-related thyroid/kidney effects. The appropriate role for the non-prescribing clinician is to gather information (when was the last blood draw?) and communicate observations to the prescriber—never to adjust dosing."
        },
        {
          type: "text",
          order: 6,
          textContent: `<h2>Antipsychotic Medications: First and Second Generation</h2>
<p>Antipsychotic medications are broadly divided into <strong>first-generation (typical) antipsychotics</strong> and <strong>second-generation (atypical) antipsychotics</strong>. Understanding this distinction matters clinically because the two groups differ significantly in their side-effect profiles.</p>
<p><strong>First-generation antipsychotics (FGAs)</strong>—including haloperidol (Haldol), chlorpromazine (Thorazine), and fluphenazine (Prolixin)—work primarily by blocking dopamine D2 receptors. They are effective against positive symptoms of psychosis (hallucinations, delusions, disorganized thinking) but carry significant risk of <strong>extrapyramidal symptoms (EPS)</strong>: acute dystonia (sudden, painful muscle contractions), akathisia (an intensely distressing inner restlessness), parkinsonism (rigidity, tremor, bradykinesia), and <strong>tardive dyskinesia (TD)</strong>—involuntary, repetitive movements, typically of the face and tongue, that can become permanent. TD is particularly concerning because it may persist even after medication discontinuation.</p>
<p><strong>Second-generation antipsychotics (SGAs)</strong>—including <strong>risperidone</strong> (Risperdal), <strong>olanzapine</strong> (Zyprexa), <strong>quetiapine</strong> (Seroquel), <strong>aripiprazole</strong> (Abilify), <strong>ziprasidone</strong> (Geodon), <strong>lurasidone</strong> (Latuda), and <strong>clozapine</strong> (Clozaril)—have a lower risk of EPS but introduce a different set of concerns, most notably <strong>metabolic syndrome</strong>: weight gain, dyslipidemia, hyperglycemia, and increased risk of type 2 diabetes. Olanzapine and clozapine carry the highest metabolic risk, with clients sometimes gaining 20–30 pounds in the first few months of treatment.</p>
<p>For the therapist, metabolic changes associated with SGAs are highly relevant. Significant weight gain affects self-esteem, body image, social functioning, and medication adherence. A client who gains 25 pounds on olanzapine may become depressed about their appearance, withdraw socially, and ultimately stop taking the medication that was controlling their psychosis. This cascade is predictable and preventable through proactive metabolic monitoring and supportive therapy that addresses the emotional impact of medication side effects.</p>`
        },
        {
          type: "accordion",
          order: 7,
          title: "Deeper Dive: Special Topics in Antipsychotic Treatment",
          accordionItems: [
            {
              title: "Clozapine: The Most Effective and Most Monitored Antipsychotic",
              content: "Clozapine is the most effective antipsychotic available—it is the only antipsychotic with demonstrated efficacy for treatment-resistant schizophrenia and has a documented anti-suicidal effect. However, it carries a risk of agranulocytosis (a dangerous drop in white blood cells) that requires mandatory blood monitoring through the REMS (Risk Evaluation and Mitigation Strategy) program. Clients on clozapine must have regular blood draws, and lapses in monitoring result in medication being withheld. As a therapist, supporting medication adherence for clozapine clients may include helping them problem-solve transportation to blood draws and processing the burden of mandatory monitoring."
            },
            {
              title: "Off-Label Use of Antipsychotics",
              content: "Second-generation antipsychotics are frequently used off-label for conditions other than psychosis. Quetiapine at low doses is commonly prescribed for insomnia and anxiety. Aripiprazole is FDA-approved as an adjunct to antidepressants for treatment-resistant depression. Olanzapine is sometimes used for severe anxiety or agitation. If a non-psychotic client tells you they are taking an antipsychotic, it does not necessarily mean psychosis has been diagnosed—ask the client (or the prescriber) about the indication."
            },
            {
              title: "Recognizing Akathisia in Session",
              content: "Akathisia—an intensely distressing subjective sense of inner restlessness and the need to move—is one of the most common reasons clients discontinue antipsychotic medication. In session, akathisia may present as a client who cannot sit still, who paces, shifts in their chair, or seems agitated. It is easily mistaken for anxiety or psychomotor agitation. A key clinical question: 'Have you been feeling a kind of inner restlessness, like you can't stay still, since starting or changing your medication?' If the answer is yes, communicate this to the prescriber, as akathisia is treatable with medication adjustments."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 8,
          question: "Which side-effect concern most distinguishes second-generation antipsychotics from first-generation antipsychotics?",
          options: [
            { text: "Second-generation antipsychotics cause more extrapyramidal symptoms", isCorrect: false },
            { text: "Second-generation antipsychotics carry greater metabolic risk, including weight gain, dyslipidemia, and hyperglycemia", isCorrect: true },
            { text: "Second-generation antipsychotics are less effective against positive psychotic symptoms", isCorrect: false },
            { text: "Second-generation antipsychotics require mandatory blood monitoring for all patients", isCorrect: false }
          ],
          explanation: "SGAs have lower EPS risk than FGAs but introduce significant metabolic concerns—weight gain, dyslipidemia, hyperglycemia, and diabetes risk. Mandatory blood monitoring applies specifically to clozapine (for agranulocytosis), not all SGAs."
        },
        {
          type: "reflection",
          order: 9,
          question: "Consider a client who has gained significant weight on an antipsychotic medication that is effectively managing their psychosis. How would you address the emotional and psychological impact of weight gain in therapy while respecting the prescriber's treatment decision? What therapeutic approaches might be helpful?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "A client starting lamotrigine develops a rash during the second week of titration. The appropriate clinical response is:",
          type: "multipleChoice",
          options: [
            { text: "Monitor the rash for two weeks to see if it resolves", isCorrect: false },
            { text: "Recommend the client take an antihistamine", isCorrect: false },
            { text: "Urge immediate medical evaluation due to the risk of Stevens-Johnson Syndrome", isCorrect: true },
            { text: "Reassure the client that rashes are a common and benign side effect of lamotrigine", isCorrect: false }
          ],
          explanation: "Any new rash during lamotrigine titration must be evaluated immediately because of the risk of Stevens-Johnson Syndrome, a rare but potentially fatal skin reaction. The risk is highest during initial dose titration, which is why lamotrigine is started low and titrated slowly."
        },
        {
          question: "Tardive dyskinesia is primarily associated with:",
          type: "multipleChoice",
          options: [
            { text: "SSRIs used long-term", isCorrect: false },
            { text: "Benzodiazepines at high doses", isCorrect: false },
            { text: "First-generation antipsychotics due to dopamine D2 blockade", isCorrect: true },
            { text: "Lithium toxicity", isCorrect: false }
          ],
          explanation: "Tardive dyskinesia—involuntary, repetitive movements, typically of the face and tongue—is primarily associated with prolonged first-generation antipsychotic use due to chronic dopamine D2 receptor blockade. It can become permanent even after medication discontinuation."
        },
        {
          question: "The primary reason valproate requires careful consideration in women of childbearing age is:",
          type: "multipleChoice",
          options: [
            { text: "It causes severe acne", isCorrect: false },
            { text: "It is classified as pregnancy category D due to teratogenicity risk", isCorrect: true },
            { text: "It reduces fertility permanently", isCorrect: false },
            { text: "It interacts with all forms of hormonal contraception", isCorrect: false }
          ],
          explanation: "Valproate is a known teratogen (pregnancy category D) associated with neural tube defects and other birth defects. Women of childbearing age taking valproate require thorough informed consent about contraceptive planning. Note: carbamazepine (not valproate) specifically reduces oral contraceptive effectiveness."
        }
      ]
    },

    // ─── SECTION 3 ──────────────────────────────────
    {
      title: "Collaborative Practice: Scope, Communication, and Client Advocacy",
      description: "Scope of practice boundaries, split-treatment communication, medication adherence support, and integrated care competencies",
      module: "Module 3: Collaboration and Scope of Practice",
      order: 3,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Defining the Non-Prescriber's Role in Medication-Related Care</h2>
<p>The non-prescribing clinician's role in medication-related care exists within a clearly defined scope of practice that varies by licensure but shares common principles across disciplines. The <strong>ACA Code of Ethics (2014)</strong>, the <strong>NASW Code of Ethics</strong>, and APA ethical guidelines all emphasize the importance of practicing within one's competence and making appropriate referrals when client needs exceed one's training. For medication-related matters, this means:</p>
<p><strong>Within scope:</strong> Educating yourself about medications your clients take. Observing and documenting behavioral changes, side effects, and symptom changes. Communicating observations to prescribers. Exploring clients' attitudes, beliefs, and ambivalence about medication. Providing psychoeducation that has been communicated by the prescriber. Supporting medication adherence through motivational strategies. Recognizing when a medication referral is clinically indicated.</p>
<p><strong>Outside scope:</strong> Recommending specific medications. Suggesting dosage adjustments. Advising clients to start, stop, or change medications. Interpreting lab results. Diagnosing medication side effects (you can observe and report, but clinical diagnosis of side effects is a prescriber function). Making clinical judgments about medication effectiveness that override the prescriber's assessment.</p>
<p>This distinction is not merely academic—it has legal and ethical implications. A client who discontinues medication based on their therapist's suggestion, and subsequently decompensates, creates both an ethical violation and a potential liability exposure. Conversely, a therapist who observes significant side effects but fails to communicate them to the prescriber may be failing in their duty to advocate for the client's wellbeing.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Which of the following actions falls WITHIN the scope of practice for a non-prescribing clinician?",
          options: [
            { text: "Recommending that a client with severe depression start an SSRI", isCorrect: false },
            { text: "Advising a client to reduce their antipsychotic dose because of weight gain", isCorrect: false },
            { text: "Observing and documenting behavioral changes and communicating them to the prescriber", isCorrect: true },
            { text: "Interpreting a client's lithium blood level results during a therapy session", isCorrect: false }
          ],
          explanation: "Non-prescribing clinicians can and should observe behavioral changes, document them, and communicate observations to prescribers. Recommending medications, suggesting dose changes, and interpreting lab results all fall outside scope of practice."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Split Treatment: Navigating Shared Care</h2>
<p><strong>Split treatment</strong>—where one provider manages medication and another provides psychotherapy—is the most common treatment arrangement in outpatient mental health care, yet it receives remarkably little attention in clinical training. The challenges of split treatment are well-documented: communication gaps between providers, conflicting treatment recommendations, clients who play one provider against another, and unclear responsibility when adverse events occur.</p>
<p>Effective split treatment requires <strong>proactive communication systems</strong>, not just reactive crisis calls. Best practices include:</p>
<p><strong>Initial coordination:</strong> When a client begins medication management with a prescriber, the therapist should (with the client's consent) contact the prescriber to introduce themselves, share relevant clinical information, and establish a communication protocol. A simple template: "I'm [name], [client]'s therapist. I wanted to let you know I'll be providing weekly therapy for [general clinical focus]. I'll communicate any significant observations regarding medication response, side effects, or clinical changes. What's the best way to reach you?"</p>
<p><strong>Ongoing communication:</strong> Regular updates to the prescriber—not just crisis communications—establish a collaborative relationship. Document observations between prescriber appointments: symptom changes, side effects the client reports, behavioral shifts, sleep and appetite patterns, and any concerns about adherence. A brief, factual message between appointments is far more valuable than waiting until a problem becomes a crisis.</p>
<p><strong>Crisis communication:</strong> When a client presents with signs of medication toxicity, severe side effects, suicidal ideation that may be medication-related, or any acute safety concern, the therapist has a responsibility to communicate directly with the prescriber—not simply to tell the client to contact them. Document the communication attempt and outcome.</p>`
        },
        {
          type: "multiSelect",
          order: 4,
          question: "Which of the following are best practices in split-treatment communication? (Select all that apply)",
          options: [
            { text: "Establishing a communication protocol with the prescriber at the start of shared care", isCorrect: true },
            { text: "Only contacting the prescriber during emergencies to respect their time", isCorrect: false },
            { text: "Sending regular updates documenting symptom changes, side effects, and behavioral observations", isCorrect: true },
            { text: "Waiting for the prescriber to initiate all communication", isCorrect: false },
            { text: "Directly communicating with the prescriber during acute safety concerns rather than relying on the client to relay information", isCorrect: true }
          ],
          explanation: "Effective split treatment requires proactive communication: establishing protocols at the outset, providing regular updates (not just crisis calls), and directly contacting the prescriber during safety concerns. Reactive-only communication leads to gaps in care."
        },
        {
          type: "text",
          order: 5,
          textContent: `<h2>Supporting Medication Adherence Through Therapeutic Skills</h2>
<p>Medication non-adherence is one of the most pervasive challenges in psychiatric treatment. Estimates suggest that 40–60% of clients prescribed psychotropic medication do not take it as prescribed. The reasons are complex and rarely reducible to simple "non-compliance." Understanding and addressing the underlying factors is squarely within the therapist's competence.</p>
<p><strong>Common barriers to medication adherence include:</strong></p>
<p><strong>Side effects:</strong> Weight gain, sexual dysfunction, cognitive dulling, fatigue, and emotional blunting are frequently cited reasons for discontinuation. Clients may not mention side effects unless specifically asked—and they are more likely to disclose them to their therapist, whom they see weekly, than to their prescriber, whom they see monthly or quarterly.</p>
<p><strong>Beliefs and attitudes:</strong> Internalized stigma ("taking medication means I'm crazy"), cultural beliefs about medication, past negative experiences with medication, and philosophical objections to psychopharmacology all influence adherence. These are profoundly therapeutic issues—they involve identity, values, and meaning-making.</p>
<p><strong>Practical barriers:</strong> Cost, lack of insurance, transportation to pharmacy, complex dosing regimens, and forgetting to take medication are all addressable barriers that therapists can help clients problem-solve.</p>
<p><strong>The therapeutic relationship itself:</strong> Clients who feel heard, respected, and involved in treatment decisions are more likely to adhere to medication. A therapist who creates space for the client to express ambivalence, frustration, and concerns about medication—without judgment and without dismissing the prescriber's recommendations—provides a unique and valuable clinical function.</p>
<p><strong>Motivational interviewing strategies</strong> are particularly effective for medication ambivalence. Rather than persuading the client to take medication (which creates reactance), the therapist can explore the discrepancy between the client's values and goals and their medication behavior: "You've said that being present for your children is your highest priority. How does your decision about medication fit with that goal?" This approach respects autonomy while gently illuminating consequences.</p>`
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "A client tells you they stopped taking their antidepressant two weeks ago because 'I should be able to handle this without pills.' The most therapeutically appropriate response is:",
          options: [
            { text: "Explain the neurobiological basis of depression to convince them medication is necessary", isCorrect: false },
            { text: "Respect their autonomy and avoid discussing medication further", isCorrect: false },
            { text: "Explore the beliefs and values underlying their decision while noting the importance of discussing medication changes with their prescriber", isCorrect: true },
            { text: "Contact the prescriber immediately to report non-adherence", isCorrect: false }
          ],
          explanation: "The client's statement reflects beliefs about self-reliance and stigma—these are therapeutic issues worthy of exploration. The clinician should explore the underlying beliefs and values (without arguing) while ensuring the client understands that medication changes should involve the prescriber. Immediately contacting the prescriber without exploring with the client first would damage the therapeutic relationship."
        },
        {
          type: "accordion",
          order: 7,
          title: "Practical Communication Tools for Integrated Care",
          accordionItems: [
            {
              title: "The SBAR Framework for Prescriber Communication",
              content: "SBAR (Situation, Background, Assessment, Recommendation) provides a concise communication structure: Situation: 'I'm calling about our shared client [name] whom I see for weekly therapy.' Background: 'She has been on sertraline 100mg for 6 weeks. She reported initial improvement in weeks 3–4.' Assessment: 'Over the past two sessions, she's described returning depressive symptoms, increased sleep, and loss of motivation despite good therapy engagement.' Recommendation: 'I wanted to share these observations for your consideration at her upcoming medication appointment.' This format keeps communication efficient and clinically relevant."
            },
            {
              title: "Documentation for Split Treatment",
              content: "Document all medication-related observations in your clinical notes: what the client reports about medication effects, behavioral observations that may be medication-related, any communication with the prescriber (including date, method, and content), and the client's reported adherence. This documentation protects both the client and the clinician. If a client decompensates and the therapist had observed warning signs without documenting or communicating them, the documentation gap becomes a liability issue."
            },
            {
              title: "When Prescriber and Therapist Disagree",
              content: "Disagreements between therapist and prescriber do occur—for example, when the therapist believes medication side effects are undermining therapy gains, or when the prescriber believes the client needs medication the therapist sees as unnecessary. The ethical approach is to communicate the disagreement directly to the prescriber (not to the client), seek to understand the prescriber's clinical reasoning, and if the disagreement persists, consider involving the client in a collaborative discussion. Never undermine the prescriber's recommendations to the client, even if you disagree."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 8,
          question: "When using the SBAR framework to communicate with a prescriber, what does the 'A' (Assessment) component include?",
          options: [
            { text: "A diagnosis of the medication side effect", isCorrect: false },
            { text: "A recommendation for medication change", isCorrect: false },
            { text: "The clinician's clinical observations and how they relate to the overall treatment picture", isCorrect: true },
            { text: "The client's complete medical history", isCorrect: false }
          ],
          explanation: "In the SBAR framework, Assessment includes the clinician's clinical observations and interpretation of how they relate to the treatment picture. It does not include diagnosing side effects (prescriber function) or recommending medication changes (outside scope). Background covers the history; Recommendation covers suggested next steps like 'I wanted to share this for your consideration.'"
        },
        {
          type: "reflection",
          order: 9,
          question: "Reflect on your current practice regarding communication with prescribers. Do you have an established protocol? How often do you communicate proactively versus reactively? What is one concrete step you could take this week to strengthen your collaborative practice with prescribing providers?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "In split treatment, the therapist's responsibility regarding medication-related communication includes:",
          type: "multipleChoice",
          options: [
            { text: "Only communicating during psychiatric emergencies", isCorrect: false },
            { text: "Proactively sharing observations about symptom changes, side effects, and adherence with the prescriber", isCorrect: true },
            { text: "Relying on the client to relay all information between providers", isCorrect: false },
            { text: "Deferring all medication-related conversation to the prescriber", isCorrect: false }
          ],
          explanation: "Effective split treatment requires proactive communication from the therapist, who often sees the client more frequently than the prescriber and observes important behavioral and symptomatic changes that inform medication management."
        },
        {
          question: "The most effective therapeutic approach to medication non-adherence involves:",
          type: "multipleChoice",
          options: [
            { text: "Firmly explaining the importance of taking medication as prescribed", isCorrect: false },
            { text: "Exploring the client's beliefs, values, and barriers while supporting prescriber communication", isCorrect: true },
            { text: "Reporting non-adherence to the prescriber without discussing it with the client", isCorrect: false },
            { text: "Respecting autonomy by avoiding any discussion of medication adherence", isCorrect: false }
          ],
          explanation: "Motivational interviewing principles apply: explore ambivalence, understand beliefs and values, address practical barriers, and support autonomy—while ensuring the prescriber is informed. Simply lecturing creates reactance; avoiding the topic abandons the clinical responsibility."
        },
        {
          question: "When a therapist disagrees with a prescriber's medication decision, the ethical approach is to:",
          type: "multipleChoice",
          options: [
            { text: "Share the disagreement with the client so they can make an informed choice", isCorrect: false },
            { text: "Communicate directly with the prescriber, seek to understand their reasoning, and if needed, facilitate a collaborative discussion involving the client", isCorrect: true },
            { text: "Defer entirely to the prescriber's judgment without discussion", isCorrect: false },
            { text: "Document the disagreement and do nothing further", isCorrect: false }
          ],
          explanation: "The ethical approach involves direct communication with the prescriber—not triangulating through the client. Understanding the prescriber's reasoning may resolve the disagreement; if not, a collaborative discussion involving the client respects both professional perspectives and client autonomy."
        }
      ]
    }
  ],

  // ═══════════════════════════════════════════════════
  // FINAL ASSESSMENT
  // ═══════════════════════════════════════════════════
  assessment: {
    passingScore: 80,
    questions: [
      {
        question: "Which of the following best describes the therapeutic onset delay for SSRIs?",
        type: "multipleChoice",
        options: [
          { text: "SSRIs provide therapeutic effects within 24–48 hours of the first dose", isCorrect: false },
          { text: "Therapeutic effects develop over 4–6 weeks as downstream neuroplasticity and receptor changes occur", isCorrect: true },
          { text: "SSRIs take 4–6 months to reach full therapeutic effect", isCorrect: false },
          { text: "The onset delay only applies to the first SSRI prescribed; subsequent trials work immediately", isCorrect: false }
        ],
        explanation: "While serotonin reuptake inhibition begins immediately, the therapeutic antidepressant effect requires 4–6 weeks of sustained changes including neuroplasticity, receptor downregulation, and gene expression alterations."
      },
      {
        question: "A non-prescribing clinician's appropriate role when a client asks 'Should I take medication?' includes:",
        type: "multipleChoice",
        options: [
          { text: "Recommending an SSRI based on the presenting symptoms", isCorrect: false },
          { text: "Discouraging medication to avoid dependency", isCorrect: false },
          { text: "Exploring what the client hopes medication might do and offering to facilitate a prescriber referral", isCorrect: true },
          { text: "Providing a list of medications that have worked for similar clients", isCorrect: false }
        ],
        explanation: "The appropriate response validates the question, explores the client's expectations, and offers a concrete next step (prescriber referral)—without recommending, discouraging, or suggesting specific medications."
      },
      {
        question: "Benzodiazepine use during exposure therapy is clinically concerning primarily because:",
        type: "multipleChoice",
        options: [
          { text: "Benzodiazepines prevent the client from experiencing any anxiety during exposure", isCorrect: false },
          { text: "Fear extinction learning may be state-dependent and fail to generalize to the unmedicated state", isCorrect: true },
          { text: "Benzodiazepines cause memory loss that prevents all learning", isCorrect: false },
          { text: "Benzodiazepines are contraindicated with all anxiety disorders", isCorrect: false }
        ],
        explanation: "Research demonstrates that anxiolytic effects during exposure can create state-dependent learning, meaning fear extinction achieved while medicated may not transfer when the client is in their normal, unmedicated state."
      },
      {
        question: "Lithium's narrow therapeutic window means:",
        type: "multipleChoice",
        options: [
          { text: "It is only effective for a narrow range of diagnoses", isCorrect: false },
          { text: "The difference between therapeutic and toxic blood levels is small, requiring regular monitoring", isCorrect: true },
          { text: "It must be taken within a narrow time window each day", isCorrect: false },
          { text: "It is only effective during a narrow age range", isCorrect: false }
        ],
        explanation: "Lithium's narrow therapeutic window means the blood level required for therapeutic effect is close to the level at which toxicity occurs. This necessitates regular blood level monitoring and awareness of factors that can shift levels (dehydration, NSAIDs, kidney changes)."
      },
      {
        question: "Which psychiatric medication has documented evidence for an independent anti-suicidal effect?",
        type: "multipleChoice",
        options: [
          { text: "Sertraline", isCorrect: false },
          { text: "Quetiapine", isCorrect: false },
          { text: "Lithium", isCorrect: true },
          { text: "Lamotrigine", isCorrect: false }
        ],
        explanation: "Lithium is the only mood stabilizer (and one of very few psychiatric medications) with robust, replicated evidence for an independent anti-suicidal effect—approximately 60% reduction in suicide risk, beyond what mood stabilization alone would predict. Clozapine also has anti-suicidal evidence but among the listed options, lithium is correct."
      },
      {
        question: "The primary side-effect concern distinguishing second-generation antipsychotics from first-generation antipsychotics is:",
        type: "multipleChoice",
        options: [
          { text: "Greater risk of tardive dyskinesia", isCorrect: false },
          { text: "Higher rates of extrapyramidal symptoms", isCorrect: false },
          { text: "Metabolic syndrome including weight gain, dyslipidemia, and hyperglycemia", isCorrect: true },
          { text: "Increased risk of serotonin syndrome", isCorrect: false }
        ],
        explanation: "SGAs carry lower EPS/TD risk than FGAs but introduce metabolic concerns: weight gain, dyslipidemia, hyperglycemia, and increased diabetes risk. Olanzapine and clozapine carry the highest metabolic risk."
      },
      {
        question: "Stevens-Johnson Syndrome is a critical safety concern specifically associated with:",
        type: "multipleChoice",
        options: [
          { text: "Lithium during the first month of treatment", isCorrect: false },
          { text: "Lamotrigine during initial dose titration", isCorrect: true },
          { text: "Valproate at therapeutic doses", isCorrect: false },
          { text: "Carbamazepine when combined with SSRIs", isCorrect: false }
        ],
        explanation: "Stevens-Johnson Syndrome—a rare but potentially fatal skin reaction—is most closely associated with lamotrigine, particularly during the initial titration period. This is why lamotrigine must be started at low doses and increased very slowly, and any new rash warrants immediate medical evaluation."
      },
      {
        question: "A client reports they stopped taking their antipsychotic because 'it made me gain 30 pounds and I hate how I look.' The most appropriate therapeutic response is:",
        type: "multipleChoice",
        options: [
          { text: "Explain that weight gain is a small price to pay for symptom control", isCorrect: false },
          { text: "Validate the distress of weight gain, explore the impact on their identity and functioning, and discuss the importance of communicating with their prescriber about alternatives", isCorrect: true },
          { text: "Agree that the weight gain is unacceptable and support their decision to stop", isCorrect: false },
          { text: "Provide dietary recommendations to manage medication-related weight gain", isCorrect: false }
        ],
        explanation: "The response should validate the client's distress (30 pounds is significant), explore the psychological impact, and bridge to prescriber communication—medication changes that address side effects should be explored before discontinuation. Dismissing the concern or providing dietary advice is outside scope and clinically insufficient."
      },
      {
        question: "In the SBAR communication framework, which component involves sharing clinical observations about the client's current presentation?",
        type: "multipleChoice",
        options: [
          { text: "Situation", isCorrect: false },
          { text: "Background", isCorrect: false },
          { text: "Assessment", isCorrect: true },
          { text: "Recommendation", isCorrect: false }
        ],
        explanation: "Assessment is where the clinician shares their clinical observations and how they relate to the treatment picture. Situation introduces the reason for communication, Background provides relevant history, and Recommendation offers suggested next steps."
      },
      {
        question: "Medication non-adherence in psychiatric treatment affects approximately what percentage of clients?",
        type: "multipleChoice",
        options: [
          { text: "10–20%", isCorrect: false },
          { text: "40–60%", isCorrect: true },
          { text: "80–90%", isCorrect: false },
          { text: "Less than 5%", isCorrect: false }
        ],
        explanation: "Research consistently estimates that 40–60% of clients prescribed psychotropic medication do not take it as prescribed. This high rate underscores the importance of therapists addressing adherence through motivational exploration, barrier identification, and prescriber communication."
      },
      {
        question: "Bupropion (Wellbutrin) is contraindicated in clients with seizure disorders or active eating disorders involving purging because:",
        type: "multipleChoice",
        options: [
          { text: "It increases serotonin levels to dangerous levels in these populations", isCorrect: false },
          { text: "It lowers the seizure threshold, and electrolyte imbalances from purging further increase seizure risk", isCorrect: true },
          { text: "It causes dangerous weight loss in clients with eating disorders", isCorrect: false },
          { text: "It interacts with anticonvulsant medications", isCorrect: false }
        ],
        explanation: "Bupropion lowers the seizure threshold as a known pharmacological effect. In clients with seizure disorders, this directly increases risk. In clients with purging behaviors, electrolyte imbalances (particularly low sodium and potassium) already lower the seizure threshold, and bupropion compounds this risk."
      },
      {
        question: "When a therapist and prescriber disagree about a medication decision, the ethical approach requires:",
        type: "multipleChoice",
        options: [
          { text: "Deferring to the prescriber without question since they have prescriptive authority", isCorrect: false },
          { text: "Sharing concerns with the client so they can advocate for themselves", isCorrect: false },
          { text: "Direct communication with the prescriber, seeking to understand their clinical reasoning, and if needed, facilitating a collaborative discussion", isCorrect: true },
          { text: "Documenting the disagreement in the chart and taking no further action", isCorrect: false }
        ],
        explanation: "The ethical approach involves direct provider-to-provider communication—not triangulating through the client. Understanding the prescriber's reasoning may resolve the disagreement, and if not, a collaborative discussion (which may include the client) respects professional expertise and client autonomy."
      },
      {
        question: "Buspirone differs from benzodiazepines primarily in that it:",
        type: "multipleChoice",
        options: [
          { text: "Is more effective for acute panic attacks", isCorrect: false },
          { text: "Takes 2–4 weeks to reach therapeutic effect and does not carry dependence risk", isCorrect: true },
          { text: "Works on the same GABA receptors but with fewer side effects", isCorrect: false },
          { text: "Is only effective when combined with an SSRI", isCorrect: false }
        ],
        explanation: "Buspirone is a 5-HT1A partial agonist (not a GABA agent) that takes 2–4 weeks to become effective, has no dependence or withdrawal risk, and does not cause sedation—but lacks the immediate relief that benzodiazepines provide, which often leads to client dissatisfaction."
      },
      {
        question: "Clozapine requires mandatory blood monitoring through the REMS program because of the risk of:",
        type: "multipleChoice",
        options: [
          { text: "Liver failure", isCorrect: false },
          { text: "Agranulocytosis—a dangerous drop in white blood cells", isCorrect: true },
          { text: "Kidney toxicity similar to lithium", isCorrect: false },
          { text: "Cardiac arrhythmias", isCorrect: false }
        ],
        explanation: "Clozapine carries a risk of agranulocytosis (dangerous reduction in white blood cells that impairs immune function). The mandatory REMS blood monitoring program ensures early detection. Despite this burden, clozapine is the most effective antipsychotic for treatment-resistant schizophrenia."
      },
      {
        question: "A therapist who observes that their client has developed involuntary, repetitive lip and tongue movements while taking haloperidol should be most concerned about:",
        type: "multipleChoice",
        options: [
          { text: "Akathisia requiring dose adjustment", isCorrect: false },
          { text: "Tardive dyskinesia, which may become permanent and requires prescriber notification", isCorrect: true },
          { text: "Serotonin syndrome from drug interaction", isCorrect: false },
          { text: "Normal medication side effects that resolve with continued treatment", isCorrect: false }
        ],
        explanation: "Involuntary, repetitive movements of the face and tongue are hallmarks of tardive dyskinesia, a serious and potentially irreversible side effect of first-generation antipsychotics like haloperidol. This observation requires prompt prescriber notification as TD can become permanent."
      }
    ]
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('interactivecourses').updateOne(
      { slug: SLUG },
      { $set: { ...COURSE, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(result.upsertedCount ? '✅ Created' : '♻️ Updated', SLUG);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌', err);
    process.exit(1);
  }
}

seed();
