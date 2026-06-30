import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = 'cr-cli-606-psychopharmacology';

const COURSE = {
  courseCode: 'CR-CLI-606',
  title: 'Psychopharmacology for Non-Prescribers: What Counselors Need to Know',
  slug: SLUG,
  description: 'This intermediate-level continuing education course equips licensed mental health counselors with essential psychopharmacology knowledge relevant to their clinical practice. Without prescribing authority, counselors nonetheless play a vital role in monitoring medication effects, supporting medication adherence, communicating effectively with prescribing providers, and helping clients navigate the complex intersection of pharmacological and therapeutic treatment. This course covers neurobiological foundations, major psychiatric medication classes, monitoring responsibilities, and collaborative care strategies—all within the scope of practice for non-prescribing mental health professionals.',
  ceHours: 3,
  nbccContentArea: 'human_development',
  deliveryFormat: 'online',
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
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  learningObjectives: [
    'Describe the primary neurotransmitter systems targeted by psychiatric medications and their relevance to mental health treatment.',
    'Identify the major classes of antidepressants, their mechanisms of action, and common side effects relevant to counselor monitoring.',
    'Recognize signs of medication toxicity, particularly for lithium and benzodiazepines, and understand when to refer clients to prescribers.',
    'Explain the role of antipsychotic medications in treating psychotic and mood disorders, including monitoring for EPS and metabolic effects.',
    'Describe medications used in ADHD treatment and medications for substance use disorders, including MAT options.',
    'Apply collaborative care communication strategies when working alongside prescribing providers.',
    'Maintain appropriate scope of practice boundaries while providing psychoeducation and medication adherence support to clients.'
  ],
  sections: [
    // ─── SECTION 0: INTRODUCTION ───────────────────────────────────────────
    {
      title: 'Introduction: Why Psychopharmacology Matters for Counselors',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Welcome to Psychopharmacology for Non-Prescribers',
          subtitle: 'Building your clinical foundation for collaborative care'
        },
        {
          type: 'text',
          title: 'The Counselor\'s Role in Medication-Informed Care',
          body: '<p>As a licensed mental health counselor, you likely see clients every week who are taking psychiatric medications—antidepressants, mood stabilizers, antipsychotics, stimulants, or medications for substance use disorders. Your clients ask you questions about their medications. They tell you about side effects that concern them. They wonder whether their medication is working. They sometimes stop taking prescribed medications without telling their prescriber. And they look to you—their counselor, the person they see most regularly in their treatment—for guidance, support, and clarity.</p><p>This reality places counselors in a uniquely important position within the psychiatric treatment landscape, even though we do not hold prescriptive authority. The therapeutic relationship counselors build with their clients is often deeper and more frequent than the relationship with prescribers, who may see a client for 15-minute medication management appointments once per month. This means counselors are frequently the first to notice that a medication is not working, that a client is experiencing troubling side effects, that a client has stopped their medication, or that new symptoms have emerged that require prescriber attention.</p><p>To fulfill this role effectively, counselors need a working knowledge of psychiatric pharmacology—not to prescribe, adjust, or recommend medications, but to communicate meaningfully with prescribers, provide accurate psychoeducation to clients, monitor for medication effects within our scope, support medication adherence, and recognize when something requires urgent escalation. This course is designed to provide exactly that foundation.</p><p>We will cover the neurobiological systems that psychiatric medications target, the major drug classes used in mental health treatment, and the practical clinical knowledge counselors need to function effectively in integrated and collaborative care settings. Throughout this course, we will consistently reinforce the principle that understanding psychopharmacology enhances—but never replaces—our role as counselors. Our scope of practice does not include diagnosing medication-related problems or recommending medication changes. It does include observing, documenting, communicating, and supporting.</p>'
        },
        {
          type: 'videoEmbed',
          title: 'Overview: The Counselor\'s Role in Collaborative Psychiatric Care',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          caption: 'This introductory video provides an overview of how counselors fit into integrated care teams and why psychopharmacology knowledge strengthens therapeutic practice.'
        },
        {
          type: 'imageText',
          title: 'The Integrated Care Model',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
          imageAlt: 'Medical team discussing patient care around a table',
          imagePosition: 'left',
          body: '<p>Integrated behavioral health care brings together mental health counselors, prescribers, primary care physicians, case managers, and other providers in a coordinated treatment approach. In this model, the counselor is not a passive observer of medication management—they are an active participant in the treatment team.</p><p>Research consistently demonstrates that collaborative care models improve outcomes for clients with depression, anxiety, PTSD, and serious mental illness. A 2019 meta-analysis found that collaborative care significantly outperformed usual care for depression and anxiety disorders, with much of the benefit attributable to between-visit monitoring and patient engagement—tasks that counselors are ideally positioned to perform.</p><p>This course will help you become a more effective team member by giving you the language and knowledge to communicate precisely with prescribers, recognize clinically significant medication events, and support your clients\' relationship with their pharmacological treatment.'
        }
      ]
    },

    // ─── SECTION 1: NEUROBIOLOGY + ANTIDEPRESSANTS ──────────────────────────
    {
      title: 'Section 1: Neurobiological Foundations and Antidepressant Medications',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Neurobiological Foundations and Antidepressants',
          subtitle: 'Understanding the brain systems that psychiatric medications target'
        },
        {
          type: 'text',
          title: 'The Neurotransmitter Systems: A Counselor\'s Guide',
          body: '<p>Psychiatric medications work by modulating the activity of neurotransmitter systems in the brain. To understand how these medications work—and why their effects and side effects are what they are—counselors benefit from a foundational understanding of the major neurotransmitter systems involved in mood, cognition, anxiety, and psychosis. This section provides that foundation, framed specifically for clinical relevance to non-prescribing counselors. Understanding these systems is not about memorizing biochemistry; it is about developing a coherent mental model that helps you observe medication effects in your clients, ask better questions, and communicate meaningfully with prescribing providers. The more precisely you can describe what you are seeing, the better equipped the treatment team is to make informed clinical decisions.</p><p><strong>Serotonin (5-hydroxytryptamine, 5-HT)</strong> is perhaps the neurotransmitter most associated with psychiatric treatment in the popular imagination—and for good reason. Serotonin is synthesized primarily in the raphe nuclei of the brainstem and projects widely throughout the brain and body, including to the limbic system, prefrontal cortex, basal ganglia, hypothalamus, and the enteric nervous system in the gut. This broad distribution is why serotonin is involved in such a diverse array of functions: mood regulation, emotional processing, sleep architecture (particularly REM sleep), appetite and satiety, pain modulation, sexual function, and gastrointestinal motility. Deficiencies or dysregulation in serotonergic signaling have been implicated in major depressive disorder, anxiety disorders, obsessive-compulsive disorder, post-traumatic stress disorder, eating disorders, and premenstrual dysphoric disorder. This is why the most commonly prescribed class of antidepressants—SSRIs, or Selective Serotonin Reuptake Inhibitors—work by blocking the reuptake of serotonin into the presynaptic neuron, increasing serotonin availability in the synaptic cleft over time. The key word for counselors is "over time"—serotonin availability increases within hours of the first dose, but the downstream receptor-level changes that produce therapeutic effects take weeks to develop. This explains the clinical reality that antidepressants require patience. Counselors who understand this can normalize the delay for clients and reduce premature discontinuation.</p><p>Serotonin\'s widespread distribution also explains the diversity of SSRIs\' side effects. Sexual dysfunction—decreased libido, delayed orgasm, anorgasmia—is one of the most common and most underdisclosed side effects of SSRIs, affecting up to 60% of users. This occurs because serotonin modulates dopamine release in circuits involved in sexual arousal and reward, and increasing serotonergic tone suppresses this dopaminergic signaling. GI disturbance (nausea, diarrhea, loose stools) is common early in treatment because the enteric nervous system is heavily serotonergic. Sleep changes can go either direction—insomnia or somnolence—depending on the specific serotonin receptor subtypes affected and individual variation. Counselors monitoring clients on SSRIs should specifically ask about sexual side effects, because clients are often too embarrassed to raise them spontaneously, and undisclosed sexual dysfunction is a significant driver of unilateral medication discontinuation.</p><p><strong>Dopamine</strong> is perhaps the most clinically complex neurotransmitter for counselors to understand, because it operates through several distinct anatomical pathways, each with different functions and different clinical implications. The <em>mesolimbic pathway</em> runs from the ventral tegmental area (VTA) to the nucleus accumbens and limbic system. This is the reward pathway—dopamine release here creates feelings of pleasure, motivation, and salience. Dysregulation of the mesolimbic system is central to both psychotic disorders (excessive dopaminergic activity contributes to positive symptoms of psychosis) and substance use disorders (drugs of abuse cause massive dopamine release in this pathway, hijacking the reward system). The <em>mesocortical pathway</em> runs from the VTA to the prefrontal cortex, where it is essential for executive function, working memory, attention, and goal-directed behavior. Dopamine hypoactivity in the mesocortical pathway is thought to contribute to the negative and cognitive symptoms of schizophrenia (flat affect, alogia, avolition, cognitive disorganization), as well as to the attention and executive function difficulties in ADHD. The <em>nigrostriatal pathway</em> runs from the substantia nigra to the striatum and is the system involved in motor control. This is the pathway destroyed in Parkinson\'s disease. When antipsychotic medications block dopamine D2 receptors in this pathway, they produce extrapyramidal symptoms (EPS)—parkinsonian tremor, rigidity, bradykinesia, akathisia, and with chronic exposure, tardive dyskinesia. The <em>tuberoinfundibular pathway</em> connects the hypothalamus to the pituitary gland and regulates prolactin secretion; dopamine normally inhibits prolactin release, so dopamine blockade in this pathway causes hyperprolactinemia, which can produce galactorrhea, menstrual irregularities, gynecomastia, and sexual dysfunction.</p><p>Understanding these distinct pathways is clinically valuable for counselors because it explains why antipsychotic medications produce the specific side effects they do. When a client on an antipsychotic reports tremor or restlessness, that is a nigrostriatal effect. When a client reports lactation or menstrual irregularities, that is a tuberoinfundibular effect. When a client reports the medication "helps the voices but doesn\'t help me function"—that likely reflects insufficient mesocortical dopaminergic activity, which antipsychotics do not improve and may worsen. Being able to name and locate these effects in a body system helps counselors communicate more precisely and helps clients feel their observations are being taken seriously.</p><p><strong>Norepinephrine (noradrenaline)</strong> is the neurotransmitter of the stress response, produced primarily in the locus coeruleus—a small but disproportionately influential cluster of neurons in the brainstem that sends noradrenergic projections throughout the brain and spinal cord. Norepinephrine drives arousal, vigilance, and the fight-or-flight response. It narrows attentional focus, increases heart rate and blood pressure, mobilizes glucose, and prepares the organism for immediate action. These effects are adaptive in acute threat situations but become pathological when chronically activated, as in PTSD, generalized anxiety disorder, panic disorder, and chronic stress. Norepinephrine dysregulation is implicated in depression (insufficient noradrenergic drive contributes to fatigue, cognitive slowing, and loss of motivation), PTSD (hyperactive noradrenergic response to triggers drives hyperarousal and startle response), and ADHD (insufficient prefrontal noradrenergic tone impairs executive function and sustained attention). SNRIs, TCAs, and MAOIs all modulate norepinephrine as part of their mechanism. The alpha-2 agonists used in ADHD (guanfacine, clonidine) work by modulating noradrenergic signaling in the prefrontal cortex. Norepinephrine also acts peripherally on the cardiovascular system—which is why medications that increase norepinephrine can elevate blood pressure and heart rate. Counselors working with clients on SNRIs or TCAs should be aware that cardiovascular effects are a monitoring consideration, and blood pressure elevation should be communicated to prescribers.</p><p><strong>GABA (gamma-aminobutyric acid)</strong> is the brain\'s primary inhibitory neurotransmitter, present in approximately 20% of brain neurons. It acts as the fundamental brake on neural excitability across virtually all brain circuits, creating the regulatory counterbalance to the excitatory drive of glutamate. GABA acts on two major receptor types: GABA-A receptors (ionotropic—they directly control chloride ion channels) and GABA-B receptors (metabotropic—they work through second messenger systems). When GABA binds GABA-A receptors, chloride ions flow into the neuron, hyperpolarizing it and making it less likely to fire. GABAergic medications work by enhancing this inhibitory activity. Benzodiazepines act as positive allosteric modulators at GABA-A receptors—they do not activate the receptor directly but increase the frequency with which the channel opens when GABA is present, amplifying inhibitory signaling. Barbiturates work similarly but increase the duration of channel opening and at higher doses can activate the channel directly. Alcohol also acts on GABA-A receptors, which explains the mechanistic overlap between alcohol intoxication and benzodiazepine intoxication—and why benzodiazepines are used in alcohol withdrawal management. The addictive potential of benzodiazepines stems partly from tolerance development: as the brain is repeatedly exposed to enhanced GABAergic signaling, it compensates by downregulating its own GABA-A receptors and reducing endogenous GABA synthesis. Over time, the client needs the benzodiazepine just to achieve baseline neural inhibitory tone. This is the basis for physiological dependence—and for the dangerous withdrawal syndrome that can include seizures when benzodiazepines are stopped abruptly after regular use. Counselors working with clients on benzodiazepines need to understand this mechanism deeply enough to have informed conversations about dependence, to monitor for signs of misuse, and to know why they should never advise abrupt discontinuation.</p><p><strong>Glutamate</strong> is the brain\'s primary excitatory neurotransmitter, present in the majority of synapses in the central nervous system. It acts through ionotropic receptors (AMPA and NMDA) and metabotropic receptors (mGluRs). NMDA receptors are particularly important in psychiatric pharmacology: they require both glutamate and a co-agonist (glycine or D-serine) for activation, and they are voltage-gated in addition to ligand-gated, meaning they only open when the postsynaptic membrane is sufficiently depolarized. This property makes NMDA receptors critical for long-term potentiation (LTP)—the cellular mechanism of learning and memory. Dysregulation of glutamatergic signaling has been implicated in psychosis (the NMDA receptor hypofunction hypothesis), depression (glutamate excitotoxicity and loss of neural plasticity), anxiety, and addiction. Ketamine, originally an anesthetic, produces rapid antidepressant effects through NMDA receptor antagonism—blocking glutamate\'s activity at these receptors leads to a surge in AMPA receptor signaling and downstream neuroplasticity that can lift severe depression within hours. The FDA-approved esketamine (Spravato) is a nasal spray version of the S-enantiomer of ketamine, approved for treatment-resistant depression and major depressive disorder with suicidal ideation. Counselors should be aware that clients may be receiving ketamine or esketamine infusions as part of their treatment and may have questions about it. Glutamate is an active frontier of psychiatric medication development—several NMDA-modulating agents are in clinical development for depression, anxiety, and schizophrenia.</p><p><strong>Acetylcholine</strong>, while not a primary target of most psychiatric medications, is worth mentioning because many psychiatric drugs have significant anticholinergic properties that produce clinically visible side effects. Acetylcholine is involved in memory, cognition, attention, REM sleep regulation, and autonomic functions (heart rate, digestion, saliva production, tear production, urinary function). Medications with anticholinergic effects—TCAs, many first-generation antipsychotics, diphenhydramine, and others—block muscarinic acetylcholine receptors, producing: dry mouth, constipation, urinary retention, blurred vision (impaired near focus), tachycardia, decreased sweating, and in older adults, significantly increased risk of cognitive impairment and delirium. The anticholinergic burden—the cumulative anticholinergic load from multiple medications—is a significant concern in older adults and in polypharmacy situations. Counselors working with older clients should be aware that cognitive changes or confusion may reflect anticholinergic burden from multiple sources, not just psychiatric symptoms, and this should be communicated to the prescribing provider.</p>'
        },
        {
          type: 'text',
          title: 'The Blood-Brain Barrier, Pharmacokinetics, and Why Timing Matters',
          body: '<p>The blood-brain barrier (BBB) is a highly selective semipermeable border of endothelial cells that lines the blood vessels of the central nervous system, preventing most substances from freely crossing from the bloodstream into brain tissue. It is one of the most sophisticated biological barriers in the human body, maintained by tight junctions between endothelial cells, supported by astrocytic end-feet and pericytes, and actively regulated by efflux transporters. Understanding the BBB is clinically relevant for counselors because it explains why psychiatric medications work on the timelines they do—and why some clients may have idiosyncratic responses based on individual differences in drug transport and metabolism.</p><p>For a psychiatric medication to produce its intended effects, it must cross the BBB and reach its target receptors in the brain in adequate concentrations. Several physicochemical properties determine how readily this occurs. <strong>Lipid solubility</strong> (lipophilicity) is the most important factor: highly lipophilic drugs can dissolve in the lipid bilayer of the endothelial cells and diffuse passively across. Most psychiatric medications are designed to be lipophilic. <strong>Molecular size</strong> matters as well—smaller, lower-molecular-weight molecules penetrate more readily. <strong>Protein binding</strong> affects how much free drug is available to cross; many psychiatric medications are highly protein-bound, meaning only the unbound fraction is pharmacologically active. This is clinically significant in states that alter albumin levels (malnutrition, liver disease, renal disease, pregnancy) where more free drug may be available, potentially increasing effects and toxicity risk. <strong>Active transport mechanisms</strong>—including the P-glycoprotein efflux pump—can actively transport some drugs out of the brain, reducing their central effects. Genetic variation in P-glycoprotein expression may partly explain why the same dose of an antidepressant produces robust effects in one person and minimal effects in another.</p><p>For counselors, the most clinically relevant aspect of pharmacokinetics is understanding the concept of <strong>steady state</strong>—the point at which drug absorption and elimination are in equilibrium and plasma concentrations stabilize. For most drugs, steady state is reached in approximately 4–5 half-lives. Fluoxetine has an exceptionally long half-life (2–6 days, and its active metabolite norfluoxetine has a half-life of 4–16 days), meaning it takes weeks to reach steady state—but also that it can be stopped without a taper and discontinuation syndrome is rare. Paroxetine has a very short half-life (approximately 21 hours), meaning it reaches steady state quickly but discontinuation syndrome is common and pronounced. This explains the clinical observation that clients who miss even one or two doses of paroxetine often experience uncomfortable withdrawal symptoms, while clients who skip a day of fluoxetine typically notice nothing.</p><p>The concept of <strong>first-pass metabolism</strong> is also relevant for counselors who have clients switching between oral and non-oral formulations of medications. When a drug is taken orally, it is absorbed through the gastrointestinal tract and enters the portal circulation, passing through the liver before reaching systemic circulation. The liver metabolizes a portion of the drug on this first pass—sometimes substantially—reducing the amount that reaches the brain. This is why some medications have very different dosing requirements depending on whether they are taken orally or administered by another route. Medications that bypass first-pass metabolism (sublingual buprenorphine, transdermal selegiline, injectable depot antipsychotics) have different bioavailability characteristics than their oral equivalents.</p><p>Finally, counselors should have a basic understanding of the <strong>cytochrome P450 (CYP) enzyme system</strong>—the family of liver enzymes primarily responsible for metabolizing psychiatric medications. Drug interactions in psychiatry often occur because one medication inhibits or induces a CYP enzyme that metabolizes another medication, increasing or decreasing its blood levels. For example, fluoxetine is a potent inhibitor of CYP2D6, which means that adding fluoxetine to a TCA regimen can double or triple TCA blood levels, potentially causing TCA toxicity. Fluvoxamine inhibits multiple CYP enzymes and interacts with many medications. Carbamazepine is a potent CYP inducer, causing it to reduce blood levels of many medications co-prescribed with it. Counselors do not need to memorize these interactions, but being aware that drug interactions are a real clinical concern—and that clients starting a new medication or supplement should have their prescriber review all current medications for interactions—is important clinical knowledge. Directing clients to also ask their pharmacist about new drug interactions is a simple, high-value intervention counselors can make.</p>'
        },
        {
          type: 'callout',
          calloutType: 'important',
          title: 'Scope of Practice Reminder',
          body: 'Everything in this course is presented to support your role as a counselor working alongside prescribers. Knowledge of pharmacology helps you observe, document, ask better questions, and communicate more effectively with the treatment team. Counselors do not diagnose medication-related disorders, recommend medication changes, or advise clients to stop or start medications. If a client describes a symptom that may be medication-related, document it and communicate it to the prescribing provider.'
        },
        {
          type: 'accordion',
          title: 'Major Antidepressant Classes: Mechanisms and Counselor Monitoring',
          items: [
            {
              heading: 'SSRIs (Selective Serotonin Reuptake Inhibitors)',
              body: 'SSRIs are the most commonly prescribed antidepressants and are first-line treatment for major depressive disorder, anxiety disorders, OCD, and PTSD. Common SSRIs include fluoxetine (Prozac), sertraline (Zoloft), escitalopram (Lexapro), citalopram (Celexa), paroxetine (Paxil), and fluvoxamine (Luvox). Mechanism: SSRIs block the serotonin transporter (SERT), preventing reuptake of serotonin into the presynaptic neuron and increasing serotonin availability in the synapse. Counselor monitoring: Watch for GI symptoms (nausea, diarrhea) in the first weeks; sexual dysfunction (decreased libido, delayed orgasm) which is often underdisclosed; sleep disturbances; activation/agitation early in treatment (especially in younger clients, where black box warning for suicidality applies); and emotional blunting. SSRIs generally take 4–6 weeks to produce full antidepressant effect. Counsel clients not to stop abruptly—discontinuation syndrome (flu-like symptoms, "brain zaps," mood instability) can occur, particularly with short half-life SSRIs like paroxetine.'
            },
            {
              heading: 'SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)',
              body: 'SNRIs block reuptake of both serotonin and norepinephrine. Common SNRIs include venlafaxine (Effexor), duloxetine (Cymbalta), desvenlafaxine (Pristiq), and levomilnacipran (Fetzima). Indications: depression, generalized anxiety disorder, neuropathic pain, fibromyalgia (duloxetine), social anxiety, panic disorder. Counselor monitoring: The norepinephrine component can elevate blood pressure—clients on SNRIs, especially venlafaxine, should have their blood pressure monitored. Higher doses of venlafaxine have greater norepinephrine effects and higher BP risk. Sexual side effects are similar to SSRIs. Discontinuation syndrome is more pronounced with SNRIs, particularly venlafaxine (short half-life); clients should never stop these abruptly. Watch for increased anxiety or agitation early in treatment. Duloxetine has a hepatic safety concern; it is contraindicated in hepatic impairment and clients should avoid excessive alcohol.'
            },
            {
              heading: 'TCAs (Tricyclic Antidepressants)',
              body: 'Tricyclics are older antidepressants—amitriptyline, nortriptyline, imipramine, desipramine, clomipramine—that block reuptake of both serotonin and norepinephrine but also have significant anticholinergic, antihistaminergic, and alpha-adrenergic blocking effects. They remain in use primarily when first-line antidepressants fail, for certain pain conditions, and for childhood enuresis (imipramine). Counselor monitoring: TCAs are highly lethal in overdose—a one-week supply can be fatal—making them a significant suicide risk concern. Counselors should communicate any suicidal ideation involving clients on TCAs to prescribers immediately. Side effects include dry mouth, constipation, urinary retention, blurred vision (anticholinergic); sedation; dizziness on standing (orthostatic hypotension); and cardiac conduction effects (QTc prolongation). These side effects are often reasons clients stop taking TCAs—exploring barriers to adherence is especially important.'
            },
            {
              heading: 'MAOIs (Monoamine Oxidase Inhibitors)',
              body: 'MAOIs—phenelzine (Nardil), tranylcypromine (Parnate), selegiline (Emsam patch)—inhibit the enzyme monoamine oxidase, which breaks down dopamine, serotonin, norepinephrine, and tyramine. They are highly effective but require strict dietary restrictions (low-tyramine diet) because inhibiting MAO prevents the metabolism of dietary tyramine, which can cause hypertensive crisis—a potentially life-threatening surge in blood pressure. Foods to avoid include aged cheeses, cured meats, fermented foods, red wine, and some beers. Drug interactions are extensive and serious: combining MAOIs with SSRIs, SNRIs, other antidepressants, meperidine, or certain anesthetics can cause serotonin syndrome. Counselors should be aware that clients on MAOIs face these dietary restrictions and may need counseling support around adherence to the dietary protocol. MAOIs are reserved for treatment-resistant depression or atypical depression.'
            },
            {
              heading: 'Atypical Antidepressants: Bupropion, Mirtazapine, Trazodone',
              body: 'Bupropion (Wellbutrin, Zyban) inhibits reuptake of dopamine and norepinephrine without significant serotonergic effects. It has no sexual side effects (often used as augmentation when SSRIs cause sexual dysfunction), promotes weight loss, and is also FDA-approved for smoking cessation. It lowers the seizure threshold—contraindicated in clients with seizure disorders, eating disorders (electrolyte imbalances increase seizure risk), or active alcohol use disorder. Counselors should monitor for activation, anxiety, insomnia, and ask about any personal or family history of seizures before clients start. Mirtazapine (Remeron) blocks alpha-2 autoreceptors and certain serotonin and histamine receptors. Notable for sedation (useful at bedtime) and appetite stimulation—often used for clients with insomnia, low appetite, or when weight gain is desired. May benefit clients with PTSD-related nightmares. Trazodone is used primarily as a sleep aid at low doses due to potent histamine blockade, though it has antidepressant properties at higher doses. Risk of priapism (prolonged painful erection) is rare but documented—male clients should be counseled to seek emergency care if this occurs.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Timeline of Antidepressant Response: What to Tell Clients',
          imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
          imageAlt: 'Calendar and medication pills on a desk',
          imagePosition: 'right',
          body: '<p>One of the most clinically important things counselors can do for clients starting antidepressants is set accurate expectations about the timeline of response. Many clients discontinue medications prematurely because they do not understand that the therapeutic effect takes time to develop—and meanwhile, side effects may be present early.</p><p>Week 1–2: Side effects may emerge (GI symptoms, sleep changes, initial anxiety or activation) before any therapeutic benefit. This is the highest dropout period. Counselors can help clients persist by normalizing these experiences and helping them distinguish early side effects from a sign that the medication "isn\'t working."</p><p>Week 2–4: Sleep often improves first, followed by energy and appetite. Mood improvement typically comes later. Some clients notice improvement in somatic symptoms before emotional ones.</p><p>Week 4–8: Full therapeutic effect on mood, concentration, and anxiety typically emerges. If there is no meaningful response by 8 weeks, prescribers usually consider dose adjustment or medication change.</p><p>Counselors play a critical role in this window by helping clients stay engaged in therapy, reinforcing behavioral activation strategies that can augment medication effects, and maintaining communication with the prescribing team about the client\'s progress.</p>'
        },
        {
          type: 'knowledgeCheck',
          question: 'A client tells you they stopped taking their sertraline (Zoloft) three days ago because they felt better and didn\'t think they needed it anymore. They now report flu-like symptoms, feeling "electric shocks" in their head, and significant irritability. What is the most likely explanation, and what should you do?',
          questionType: 'multipleChoice',
          options: [
            { text: 'The client has developed a new depressive episode; reassure them and continue therapy as usual.', isCorrect: false },
            { text: 'The client is likely experiencing SSRI discontinuation syndrome; document the symptoms and communicate with the prescribing provider promptly.', isCorrect: true },
            { text: 'The client is experiencing serotonin syndrome, which requires emergency treatment; call 911.', isCorrect: false },
            { text: 'This is likely anxiety; prescribe a short-acting benzodiazepine to manage symptoms.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'SSRI discontinuation syndrome commonly presents with flu-like symptoms, paresthesias (the "brain zaps" or electric-shock sensations), dizziness, irritability, and mood changes. It is not dangerous but can be uncomfortable. The counselor\'s role is to document the symptoms and communicate with the prescriber—not to diagnose the problem or advise the client to restart medication. The prescriber will guide tapering. Note: counselors do not prescribe medications.'
        },
        {
          type: 'knowledgeCheck',
          question: 'Which of the following antidepressants carries the most significant risk of lethal overdose and requires particular vigilance regarding suicidal ideation?',
          questionType: 'multipleChoice',
          options: [
            { text: 'Sertraline (Zoloft)', isCorrect: false },
            { text: 'Escitalopram (Lexapro)', isCorrect: false },
            { text: 'Amitriptyline (Elavil) — a tricyclic antidepressant', isCorrect: true },
            { text: 'Bupropion (Wellbutrin)', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Tricyclic antidepressants (TCAs) such as amitriptyline are highly lethal in overdose due to their cardiac conduction effects. A single week\'s supply can be fatal. When working with clients on TCAs who express suicidal ideation, immediate communication with the prescribing provider is essential. SSRIs and bupropion have much greater safety margins in overdose, though no medication is entirely safe in overdose.'
        },
        {
          type: 'knowledgeCheck',
          question: 'A client on phenelzine (an MAOI) mentions they had wine and cheese at a dinner party last night and today has a severe headache and feels their heart racing. What should you do?',
          questionType: 'multipleChoice',
          options: [
            { text: 'Assess severity and treat as a potential hypertensive crisis emergency; contact emergency services if BP-related symptoms are severe.', isCorrect: true },
            { text: 'Normalize the experience as a common MAOI side effect and continue the session.', isCorrect: false },
            { text: 'Advise the client to take an extra dose of their medication to counteract the tyramine.', isCorrect: false },
            { text: 'Document and mention it at the next team meeting next week.', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Hypertensive crisis is a potentially life-threatening emergency associated with tyramine ingestion in clients taking MAOIs. Symptoms include severe headache, palpitations, neck stiffness, sweating, and rapidly elevated blood pressure. This requires immediate assessment and potentially emergency medical attention. Counselors should not dismiss these symptoms or delay response—this is an urgent medical situation.'
        },
        {
          type: 'flashcardDeck',
          title: 'Antidepressant Class Flashcards',
          instructions: 'Review each card to reinforce your knowledge of antidepressant classes, their mechanisms, and key counselor monitoring considerations.',
          flashcards: [
            { front: 'What does SSRI stand for, and what is the mechanism of action?', back: 'Selective Serotonin Reuptake Inhibitor. SSRIs block the serotonin transporter (SERT), preventing serotonin from being reabsorbed into the presynaptic neuron, thereby increasing serotonin availability in the synapse.' },
            { front: 'Name three common SSRIs and a primary counselor monitoring concern.', back: 'Fluoxetine (Prozac), Sertraline (Zoloft), Escitalopram (Lexapro). Key monitoring: watch for sexual dysfunction, GI symptoms early in treatment, activation/agitation (especially in adolescents with black box warning), and discontinuation syndrome if stopped abruptly.' },
            { front: 'How do SNRIs differ from SSRIs, and what unique side effect should counselors monitor?', back: 'SNRIs block reuptake of both serotonin AND norepinephrine. The norepinephrine component can elevate blood pressure—clients on SNRIs (especially venlafaxine at higher doses) should have their BP monitored regularly.' },
            { front: 'Why are tricyclic antidepressants (TCAs) particularly dangerous in clients with suicidal ideation?', back: 'TCAs are highly lethal in overdose due to cardiac conduction toxicity (QTc prolongation, arrhythmias). A one-week supply can be fatal. Any suicidal ideation in a client on a TCA should be communicated to the prescriber immediately, and reducing access to medication may be clinically indicated.' },
            { front: 'What unique dietary restriction do clients on MAOIs need to follow, and why?', back: 'Low-tyramine diet: avoid aged cheeses, cured/smoked meats, fermented foods, certain wines and beers. MAOIs inhibit the enzyme that metabolizes tyramine; when dietary tyramine is not broken down, it can cause a dangerous, potentially life-threatening surge in blood pressure (hypertensive crisis).' },
            { front: 'What makes bupropion (Wellbutrin) distinct from other antidepressants?', back: 'Bupropion inhibits dopamine and norepinephrine reuptake (not serotonin). It has no sexual side effects, can promote weight loss, and is approved for smoking cessation. Key caution: lowers seizure threshold—contraindicated in seizure disorders, eating disorders, and significant alcohol use disorder.' },
            { front: 'Why is mirtazapine often prescribed at bedtime?', back: 'Mirtazapine strongly blocks histamine receptors, producing significant sedation—making bedtime dosing an advantage rather than a burden. It also stimulates appetite and can benefit clients with poor sleep and low appetite. Sometimes used to help clients with PTSD-related nightmares.' }
          ]
        },
        {
          type: 'reflection',
          question: 'Think about a current or recent client who is taking an antidepressant. Based on what you\'ve learned in this section, what is one specific monitoring responsibility you could add to your clinical practice—something you observe, document, or ask about—that could strengthen your collaboration with their prescriber?'
        },
        {
          type: 'keyTakeaway',
          title: 'Section 1 Key Takeaways',
          points: [
            'The major neurotransmitter systems (serotonin, dopamine, norepinephrine, GABA, glutamate) are the targets of psychiatric medications; understanding their roles helps counselors make sense of medication effects and side effects.',
            'SSRIs and SNRIs are first-line antidepressants; counselors should monitor for GI symptoms, sexual dysfunction, activation, sleep changes, and discontinuation syndrome.',
            'TCAs carry high lethality in overdose and require vigilance around suicidal ideation; MAOIs require strict dietary management to prevent hypertensive crisis.',
            'Antidepressants typically require 4–8 weeks for full therapeutic effect; counselors play a critical role in supporting persistence during the early side-effect window.',
            'All medication-related concerns observed by counselors should be documented and communicated to the prescribing provider—not managed independently.'
          ]
        }
      ]
    },

    // ─── SECTION 2: ANXIOLYTICS + MOOD STABILIZERS + ANTIPSYCHOTICS ─────────
    {
      title: 'Section 2: Anxiolytics, Mood Stabilizers, and Antipsychotic Medications',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Anxiolytics, Mood Stabilizers, and Antipsychotics',
          subtitle: 'Monitoring, toxicity signs, and clinical communication strategies'
        },
        {
          type: 'text',
          title: 'Anxiolytic Medications: Benzodiazepines and Alternatives',
          body: '<p>Anxiety disorders are among the most prevalent mental health conditions encountered in counseling practice, and many clients will arrive with existing prescriptions for anxiolytic medications written by their primary care providers, psychiatrists, or other prescribers. The landscape of anxiolytic pharmacology is nuanced: some medications in this class are extraordinarily effective in the short term but carry substantial long-term risks; others are less immediately gratifying but safer and more sustainable. Counselors who understand this landscape are better equipped to support medication adherence, address concerns, and collaborate with prescribers when client presentations raise clinical questions.</p><p><strong>Benzodiazepines</strong> are the most widely prescribed anxiolytics and deserve substantial attention in any discussion of psychopharmacology for counselors. This class includes diazepam (Valium), lorazepam (Ativan), alprazolam (Xanax), clonazepam (Klonopin), chlordiazepoxide (Librium), temazepam (Restoril, prescribed for insomnia), and triazolam (Halcion, prescribed for short-term insomnia). All benzodiazepines share the same mechanism of action: they are positive allosteric modulators at GABA-A receptors, increasing the frequency with which GABA opens chloride channels and thus amplifying the brain\'s inhibitory signaling. The result is rapid, reliable anxiolysis, sedation, muscle relaxation, and anticonvulsant effects. Onset of action after oral dosing is typically 15–60 minutes, with peak effect within 1–2 hours for most agents. This pharmacokinetic profile—rapid onset, clear subjective effect—is precisely what makes benzodiazepines so clinically useful for acute anxiety and panic, and also what makes them vulnerable to misuse and psychological dependence.</p><p>Benzodiazepines differ significantly in their half-lives, which has major clinical implications. Short-acting agents like alprazolam (half-life approximately 11 hours) and triazolam produce rapid onset and offset, which some clients prefer but which also creates more pronounced interdose withdrawal and stronger reinforcement of the drug-taking behavior. Long-acting agents like diazepam (half-life 20–100 hours, plus active metabolites with even longer half-lives) produce more gradual onset and much smoother offset, making them preferable for the management of benzodiazepine withdrawal itself. Clonazepam (half-life 18–50 hours) has intermediate duration and is often used for maintenance treatment of panic disorder and certain anxiety disorders because of its more stable blood levels.</p><p>The risks of benzodiazepines are significant and must be clearly understood. <strong>Tolerance</strong> develops with regular use as the brain compensates for enhanced GABAergic tone by downregulating GABA-A receptors—the same dose produces progressively less anxiolytic effect over time, often within two to four weeks of daily use. <strong>Physical dependence</strong> follows tolerance and is essentially universal with regular daily use for longer than a few weeks. The brain\'s homeostatic adaptation means that discontinuing the medication disrupts neural inhibitory tone, and the rebound is excitatory: anxiety returns, often worse than before (rebound anxiety), sleep disrupts severely, and in more severe cases, seizures and cardiovascular instability can occur. <strong>Benzodiazepine withdrawal is one of the few drug withdrawal syndromes that can be life-threatening</strong>, alongside alcohol withdrawal (which acts on the same receptor systems). Counselors should never—under any circumstances—advise a client to stop taking benzodiazepines abruptly. Any benzodiazepine discontinuation after more than a few weeks of regular use should be supervised by a prescriber, using a structured taper (usually a slow reduction over weeks to months for long-term users).</p><p>Beyond dependence and withdrawal, long-term benzodiazepine use is associated with a range of clinically significant concerns. Cognitive impairment—including memory consolidation deficits, processing speed slowing, and attention difficulties—is well-documented in long-term users, with some studies suggesting effects may persist even after discontinuation. In older adults, benzodiazepines are particularly concerning: they significantly increase fall risk due to sedation and muscle relaxation, and their sedating and disinhibiting effects can worsen cognitive impairment in individuals with or at risk for dementia. The Beers Criteria, published by the American Geriatrics Society, explicitly lists benzodiazepines as medications to avoid in adults over 65. Disinhibition—paradoxical reactions in which benzodiazepines increase agitation, aggression, or impulsivity—occurs in some clients, more commonly those with histories of brain injury, intellectual disabilities, or borderline personality disorder. Counselors working in these populations should be alert to this possibility and communicate any apparent paradoxical behavioral responses to prescribers.</p><p>Benzodiazepine misuse is a significant clinical concern. Clients may take higher doses than prescribed, take doses more frequently than prescribed, combine benzodiazepines with alcohol or opioids (dramatically increasing overdose risk—this combination is responsible for a substantial proportion of prescription drug overdose deaths), or obtain medications from multiple prescribers or illicit sources. Counselors should approach this possibility without accusation, using exploratory, non-judgmental inquiry: "Tell me about how you\'ve been using the Xanax lately—are you finding you need it more, or that you\'re using it differently than prescribed?" Signs that may indicate problematic use include: running out of a monthly prescription well before the next refill date, requesting specific medications or specific doses by name, appearing sedated or intoxicated in sessions, reporting memory gaps, and expressing significant anxiety or distress around the medication supply.</p><p><strong>Buspirone (BuSpar)</strong> is a non-benzodiazepine anxiolytic that represents a fundamentally different pharmacological approach. It acts as a partial agonist at serotonin 5-HT1A receptors—the same receptors involved in the antidepressant effects of some SSRIs—and has some modest activity at dopamine D2 receptors. Because it does not act at GABA receptors, buspirone does not produce sedation, does not impair cognition, has no muscle-relaxing effects, and carries no addiction or dependence risk. It is not a controlled substance. These properties make it particularly well-suited for clients with generalized anxiety disorder, clients with substance use disorder histories for whom benzodiazepines are contraindicated, and clients who need long-term anxiety management without the risks of chronic benzodiazepine use.</p><p>However, buspirone has one significant clinical liability: it requires 2–4 weeks of consistent daily use before producing therapeutic anxiolytic effects. It does not provide acute relief—if a client takes buspirone as needed for acute anxiety episodes, it will not work in that timeframe. This is one of the most important pieces of psychoeducation counselors can provide for clients on buspirone. The other critical piece is expectation management for clients transitioning from benzodiazepines: clients who have been accustomed to the rapid, unmistakable sedation and relief of alprazolam or diazepam will often feel that buspirone "doesn\'t do anything"—because it does not produce the same immediate subjective experience. Helping clients understand that buspirone produces a different, subtler kind of anxiety relief—one that requires patience to appreciate—is a clinical communication task that counselors are ideally positioned to provide.</p><p><strong>Hydroxyzine (Vistaril, Atarax)</strong> is an antihistamine with meaningful anxiolytic properties through its action at histamine H1 receptors and serotonin 5-HT2A receptors. It is not a controlled substance, has no addiction potential, does not produce physiological dependence, and can be used on an as-needed basis because it acts within 30–60 minutes. Sedation is its primary side effect, which is problematic during daytime hours but can be used strategically—hydroxyzine taken at bedtime for clients with anxiety-driven insomnia can address both the anxiety and sleep. Hydroxyzine is increasingly recognized as a valuable non-addictive anxiolytic option for clients who cannot be prescribed benzodiazepines due to substance use disorder histories, where even prescribed benzodiazepines carry significant misuse risk. Counselors working in addiction treatment settings may encounter hydroxyzine prescribed specifically in this context.</p>'
        },
        {
          type: 'text',
          title: 'Mood Stabilizers: Lithium, Valproate, Lamotrigine, and Carbamazepine',
          body: '<p>Mood stabilizers are a pharmacologically diverse group of medications united by their clinical use in bipolar disorder and related conditions. They act by different mechanisms but share the goal of reducing the frequency and severity of manic, hypomanic, and (for some agents) depressive episodes. Counselors working with clients who have bipolar disorder, schizoaffective disorder, cyclothymia, or mood instability from trauma or personality disorder will frequently encounter this medication class.</p><p><strong>Lithium</strong> remains the gold standard mood stabilizer and has the longest evidence base of any psychiatric medication for bipolar disorder. Its exact mechanism of action remains incompletely understood, but it affects multiple intracellular signaling pathways, reduces glutamate excitotoxicity, and promotes neurotrophic factors. Lithium has a narrow therapeutic index—the gap between the therapeutic blood level and the toxic level is small—which makes it critically important for counselors to understand lithium monitoring.</p><p>Lithium requires regular blood level monitoring (typically every 3–6 months when stable, more frequently when starting or adjusting dose). Therapeutic blood levels are generally 0.6–1.2 mEq/L for maintenance; levels above 1.5 mEq/L begin to produce toxicity signs, and levels above 2.0 mEq/L represent severe toxicity requiring emergency intervention. Anything that alters sodium balance and fluid status can affect lithium levels: dehydration (from illness, hot weather, exercise, inadequate fluid intake, diuretics) dramatically increases lithium concentrations. NSAIDs (ibuprofen, naproxen) and certain blood pressure medications (especially ACE inhibitors and thiazide diuretics) also raise lithium levels. Counselors should know the signs of lithium toxicity: nausea, vomiting, diarrhea, tremor, ataxia (unsteady gait), confusion, slurred speech, muscle twitching, and seizures. If a client on lithium reports these symptoms, especially following a period of illness, heat exposure, or medication changes, treat this as a potential emergency and contact the prescribing provider immediately.</p><p>Chronic lithium use also affects the thyroid (hypothyroidism in up to 20–40% of long-term users) and kidneys (reduced concentrating ability, and in some cases, reduced GFR over decades of use). Clients on lithium long-term should have thyroid function and renal function monitored regularly. Counselors may encounter clients who gained weight on lithium (a common side effect), developed hypothyroidism (which can look like depression relapse), or who express concern about kidney damage. These are legitimate concerns to explore and to bring to the prescribing team.</p><p><strong>Valproate (Depakote, Depakene)</strong> is an anticonvulsant with broad mood-stabilizing properties, effective for acute mania, bipolar disorder, and as an augmentation agent. Mechanism: enhances GABAergic activity and affects sodium channels. Counselor monitoring concerns: weight gain and appetite changes are common; liver toxicity is a risk, especially in children and in polypharmacy (liver enzyme monitoring is recommended); polycystic ovarian syndrome (PCOS) is associated with long-term valproate use in women; valproate is teratogenic (causes neural tube defects) and is strongly contraindicated in pregnancy. Counselors should be aware of the pregnancy risk when working with women of childbearing age on valproate—family planning conversations are clinically important and should involve the prescribing provider.</p><p><strong>Lamotrigine (Lamictal)</strong> is unique among mood stabilizers for its particular effectiveness in preventing depressive episodes in bipolar disorder (rather than mania). It blocks voltage-gated sodium channels and modulates glutamate release. The critical counselor-relevant fact about lamotrigine is the risk of serious skin rash, including Stevens-Johnson syndrome—a potentially life-threatening hypersensitivity reaction. The risk is greatest when the dose is increased too rapidly, which is why lamotrigine is titrated very slowly over months. Counselors should know that any new rash in a client on lamotrigine—especially one involving mucous membranes (mouth, eyes, genitals)—is a potential emergency requiring immediate medical evaluation. This is not something to take a "wait and see" approach with.</p><p><strong>Carbamazepine (Tegretol)</strong> is another anticonvulsant used as a mood stabilizer. It is effective for bipolar disorder and has complex drug interactions due to its induction of liver enzymes (cytochrome P450), which can reduce blood levels of numerous other medications. Blood monitoring is required. Rare but serious risks include aplastic anemia and agranulocytosis (bone marrow suppression). Carbamazepine can reduce the effectiveness of hormonal contraceptives—a reproductive health consideration for female clients.</p>'
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Lithium Toxicity: Know the Signs',
          body: 'Lithium toxicity is a medical emergency. Counselors should be familiar with early signs: tremor, nausea, vomiting, diarrhea, thirst, and polyuria. As toxicity progresses: confusion, ataxia (unsteady gait), slurred speech, muscle twitching. At high levels: seizures, coma, cardiovascular instability. Any client on lithium who reports these symptoms—especially after illness with dehydration, prolonged heat exposure, or recent use of NSAIDs or diuretics—requires urgent medical evaluation. Do not dismiss these as general illness. Contact the prescribing provider immediately.'
        },
        {
          type: 'accordion',
          title: 'Antipsychotic Medications: Generations, Indications, and Monitoring',
          items: [
            {
              heading: 'First-Generation (Typical) Antipsychotics',
              body: 'First-generation antipsychotics (FGAs)—including haloperidol (Haldol), chlorpromazine (Thorazine), fluphenazine, perphenazine, and thioridazine—work primarily by blocking dopamine D2 receptors in the mesolimbic pathway, reducing positive symptoms of psychosis (hallucinations, delusions, disorganized thought). However, their lack of selectivity means they also block D2 receptors in the nigrostriatal pathway, producing extrapyramidal symptoms (EPS): akathisia (intense subjective restlessness), acute dystonia (sudden muscle contractions, often in neck and eyes), parkinsonism (tremor, rigidity, bradykinesia), and tardive dyskinesia (TD—a potentially irreversible movement disorder involving repetitive involuntary movements, most commonly of the mouth and tongue, after prolonged use). Counselors monitoring clients on FGAs should watch for these movement side effects and report any new movements promptly. Tardive dyskinesia is particularly serious—it may not be fully reversible once established.'
            },
            {
              heading: 'Second-Generation (Atypical) Antipsychotics',
              body: 'Atypical antipsychotics—including risperidone (Risperdal), olanzapine (Zyprexa), quetiapine (Seroquel), aripiprazole (Abilify), ziprasidone (Geodon), lurasidone (Latuda), clozapine (Clozaril), and paliperidone (Invega)—block both D2 and serotonin 5-HT2A receptors. The 5-HT2A blockade is thought to reduce EPS risk compared to FGAs and may contribute to improved effects on negative symptoms of schizophrenia (flat affect, alogia, avolition). However, atypicals carry significant metabolic risks: weight gain, hyperglycemia, dyslipidemia, and increased risk of type 2 diabetes. Olanzapine and clozapine are particularly associated with metabolic effects. Counselors should be aware that significant weight gain is demoralizing for many clients and is a major driver of medication non-adherence in this class—this is an important therapeutic topic.'
            },
            {
              heading: 'Clozapine: The Special Case',
              body: 'Clozapine is considered the most effective antipsychotic for treatment-resistant schizophrenia and has the best evidence for reducing suicide risk in schizophrenia. However, it carries a rare but potentially fatal risk of agranulocytosis (destruction of white blood cells, eliminating immune function). Because of this, all clients on clozapine must be enrolled in the REMS (Risk Evaluation and Mitigation Strategy) program, requiring regular blood monitoring (initially weekly, then biweekly, then monthly) with results reviewed before each prescription can be filled. Counselors working with clients on clozapine should understand that any signs of infection—fever, sore throat, flu-like illness—require immediate medical evaluation. If agranulocytosis is developing, common illness can become life-threatening. Clozapine is reserved for clients who have not responded to at least two other antipsychotics.'
            },
            {
              heading: 'Monitoring Counselors Should Perform: EPS Assessment',
              body: 'Extrapyramidal symptoms (EPS) are motor side effects of antipsychotics that counselors can observe in sessions. Akathisia: client appears restless, cannot sit still, shifts frequently, may report an internal sense of restlessness that is extremely distressing—sometimes misidentified as anxiety or agitation. Acute dystonia: sudden, sustained muscle contraction, often in the neck (torticollis), jaw, tongue, or eyes (oculogyric crisis)—requires immediate medical attention. Parkinsonism: tremor at rest, stiff gait, flat facial expression, slowed movement. Tardive dyskinesia: repetitive, involuntary movements—lip smacking, tongue protrusion, grimacing, choreiform limb movements. Any new movement abnormality in a client on antipsychotics should be documented and reported to the prescriber at the next available opportunity (or urgently for acute dystonia).'
            },
            {
              heading: 'Metabolic Monitoring: What Counselors Should Know',
              body: 'Many antipsychotics—particularly second-generation agents—cause significant metabolic changes: weight gain, elevated blood sugar, elevated lipids, and increased cardiovascular risk. These changes are not merely cosmetic; they substantially increase the lifetime risk of diabetes and heart disease in an already vulnerable population. Counselors can support metabolic health by encouraging physical activity, healthy eating, and regular medical follow-up. In sessions, counselors may notice clients appear to be gaining weight, report increased thirst or urination (diabetes symptoms), or express shame or frustration about body changes. These are appropriate therapeutic topics, and they are also clinically important information to communicate to the prescribing provider. Documented baseline and follow-up measurements (weight, BMI, blood pressure, labs) should ideally be performed by the prescribing team.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Recognizing Neuroleptic Malignant Syndrome (NMS)',
          imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
          imageAlt: 'Medical alert symbol with prescription bottles',
          imagePosition: 'left',
          body: '<p>Neuroleptic Malignant Syndrome (NMS) is a rare but life-threatening adverse reaction to antipsychotic medications (and some other drugs that block dopamine). The classic tetrad of symptoms includes: hyperthermia (high fever), muscle rigidity (often described as "lead pipe" rigidity), altered mental status (confusion, delirium), and autonomic instability (fluctuating blood pressure, heart rate, diaphoresis).</p><p>NMS can develop at any point during antipsychotic treatment—not just when starting a medication. It is considered a medical emergency with mortality rates historically as high as 10–20%. If a counselor observes or receives a report of a client on antipsychotics with high fever, severe muscle rigidity, confusion, and sweating, this is an immediate emergency referral situation—call 911 or instruct the client (or whoever is present) to seek emergency medical care immediately. Do not attempt to manage NMS in the outpatient counseling setting.</p>'
        },
        {
          type: 'knowledgeCheck',
          question: 'A client on lithium tells you they had severe diarrhea and vomiting for three days from a stomach bug and are now experiencing a tremor, confusion, and "walking weird." What action should you take?',
          questionType: 'multipleChoice',
          options: [
            { text: 'These are common side effects of lithium; recommend they drink more water and follow up with their prescriber at their next scheduled appointment.', isCorrect: false },
            { text: 'This presentation is consistent with lithium toxicity secondary to dehydration; treat this as a potential medical emergency and contact the prescribing provider or emergency services immediately.', isCorrect: true },
            { text: 'Suggest the client stop taking lithium until the stomach illness resolves, then restart.', isCorrect: false },
            { text: 'Schedule the client for more frequent therapy sessions to monitor their symptoms over the next week.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'This presentation is consistent with lithium toxicity. Dehydration from GI illness reduces sodium and fluid volume, dramatically increasing lithium concentrations. Tremor, confusion, and ataxia are signs of lithium toxicity. This is a medical emergency. Advising the client to stop lithium independently is dangerous (could precipitate mania). The counselor must contact the prescribing provider or emergency services immediately. Do not wait for the next scheduled appointment.'
        },
        {
          type: 'knowledgeCheck',
          question: 'Which of the following best describes tardive dyskinesia (TD)?',
          questionType: 'multipleChoice',
          options: [
            { text: 'An acute, reversible muscle spasm that occurs in the first days of antipsychotic treatment.', isCorrect: false },
            { text: 'A potentially irreversible movement disorder characterized by repetitive involuntary movements, most often of the mouth, tongue, and face, associated with long-term antipsychotic use.', isCorrect: true },
            { text: 'A subjective feeling of restlessness and inability to sit still caused by antipsychotics.', isCorrect: false },
            { text: 'A metabolic syndrome caused by dopamine blockade in the tuberoinfundibular pathway.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Tardive dyskinesia (TD) is a movement disorder associated with long-term antipsychotic use, resulting from dopamine receptor supersensitivity in the basal ganglia. It presents with repetitive, involuntary movements—lip smacking, tongue protrusion, grimacing, choreiform limb movements. Unlike acute dystonia or akathisia, TD can be irreversible. Early detection is important; counselors should document any new involuntary movements and report them to the prescriber promptly.'
        },
        {
          type: 'knowledgeCheck',
          question: 'A client on olanzapine (an atypical antipsychotic) reports they have gained 25 pounds over the past year and have stopped taking their medication because they "can\'t stand what it\'s doing to my body." How should the counselor respond?',
          questionType: 'multipleChoice',
          options: [
            { text: 'Validate the client\'s experience, explore the impact of the weight gain on their wellbeing and treatment motivation, and collaborate with the prescribing provider about the client\'s concerns and possible medication adjustments.', isCorrect: true },
            { text: 'Remind the client that medication adherence is essential and they should restart their medication immediately.', isCorrect: false },
            { text: 'Recommend they switch to a different antipsychotic with fewer metabolic effects.', isCorrect: false },
            { text: 'Advise the client to diet and exercise to manage the weight gain without changing their medication.', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Metabolic side effects are among the top reasons clients discontinue antipsychotic medications—and they are legitimate, not trivial concerns. The counselor\'s role is to validate and explore the client\'s experience, understand the impact on their adherence and wellbeing, and communicate these concerns to the prescribing provider. Recommending specific medication changes is outside counselor scope of practice. Directing clients to simply "comply" ignores a real clinical issue and damages the therapeutic alliance.'
        },
        {
          type: 'matching',
          title: 'Match the Medication Category to Its Key Monitoring Concern',
          instructions: 'Match each medication or medication class to the counselor\'s most important monitoring responsibility.',
          pairs: [
            { left: 'Lithium', right: 'Monitor for tremor, ataxia, and confusion—signs of toxicity heightened by dehydration' },
            { left: 'Valproate (Depakote)', right: 'Teratogenic—critical to address family planning in women of childbearing age' },
            { left: 'Lamotrigine (Lamictal)', right: 'Any new rash, especially involving mucous membranes, is a potential emergency' },
            { left: 'Typical antipsychotics (e.g., haloperidol)', right: 'Watch for tardive dyskinesia and other extrapyramidal symptoms' },
            { left: 'Atypical antipsychotics (e.g., olanzapine)', right: 'Metabolic side effects: weight gain, blood sugar elevation, cardiovascular risk' },
            { left: 'Benzodiazepines (e.g., alprazolam)', right: 'Never advise abrupt discontinuation; monitor for signs of dependence or misuse' }
          ]
        },
        {
          type: 'reflection',
          question: 'Have you worked with a client who was non-adherent to a mood stabilizer or antipsychotic medication? Reflecting on what you\'ve learned about the side effect profiles of these medications, what might have been driving the non-adherence? How might you approach that conversation differently now?'
        },
        {
          type: 'keyTakeaway',
          title: 'Section 2 Key Takeaways',
          points: [
            'Benzodiazepines provide rapid anxiolysis but carry significant risks of tolerance, dependence, and dangerous withdrawal—counselors should never advise abrupt discontinuation.',
            'Lithium has a narrow therapeutic index; dehydration (from illness, heat, exercise) can rapidly produce toxicity. Signs include tremor, ataxia, and confusion—treat as a potential medical emergency.',
            'Valproate is teratogenic; lamotrigine carries risk of serious rash (Stevens-Johnson syndrome); carbamazepine has complex drug interactions. Family planning and drug interactions are important counselor topics.',
            'First-generation antipsychotics carry significant EPS risk including tardive dyskinesia; second-generation antipsychotics have less EPS but more metabolic side effects—both require monitoring.',
            'Metabolic side effects (weight gain, diabetes risk) are a leading cause of antipsychotic non-adherence and deserve genuine therapeutic exploration, not dismissal.'
          ]
        }
      ]
    },

    // ─── SECTION 3: ADHD MEDS + MAT + COLLABORATIVE CARE ───────────────────
    {
      title: 'Section 3: ADHD Medications, MAT for Substance Use Disorders, and Collaborative Care',
      order: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'ADHD Medications, MAT, and Collaborative Care',
          subtitle: 'Practical clinical knowledge for integrated treatment settings'
        },
        {
          type: 'text',
          title: 'ADHD Medications: Stimulants and Non-Stimulants',
          body: '<p>Attention-Deficit/Hyperactivity Disorder (ADHD) is one of the most prevalent neurodevelopmental conditions encountered in counseling practice, affecting an estimated 5–7% of children globally and persisting into adulthood in approximately 60–70% of cases—meaning adult ADHD is far more common than once recognized. ADHD involves significant difficulties with sustained attention, inhibitory control, working memory, and executive function—difficulties that are neurobiologically based, not simply a matter of willpower or effort. Medication is a cornerstone of ADHD treatment, with stimulant medications holding the strongest evidence base of any medications in all of psychiatry relative to effect size. Counselors who work with children, adolescents, or adults with ADHD will almost certainly work with clients taking ADHD medications, and understanding this class is essential for supporting treatment planning, monitoring clinical effects, providing psychoeducation, and collaborating with prescribers effectively.</p><p><strong>Stimulant Medications: Mechanisms and Clinical Profiles</strong></p><p>Stimulant medications work by increasing the availability of dopamine and norepinephrine in the synaptic cleft of prefrontal cortical neurons—the brain region most centrally implicated in executive function, working memory, sustained attention, and impulse control. The prefrontal cortex is exquisitely sensitive to the catecholamine environment: too little dopamine and norepinephrine (as in untreated ADHD) results in distracted, impulsive, poorly regulated cognition; optimal levels (achieved by stimulant medications at therapeutic doses) facilitate focused, organized, goal-directed behavior. This dose-response relationship is one reason ADHD medication management requires titration—finding the dose at which the client achieves cognitive optimization without overshooting into anxiety, irritability, or cardiovascular effects.</p><p>The two main stimulant classes are methylphenidate-based medications and amphetamine-based medications. <strong>Methylphenidate</strong> (brand names: Ritalin, Concerta, Metadate, Quillivant, Jornay PM) works primarily by blocking the reuptake transporters for dopamine and norepinephrine, preventing their reabsorption into the presynaptic neuron and increasing their concentration in the synapse. <strong>Amphetamine-based medications</strong> (brand names: Adderall, Adderall XR, Vyvanse, Dexedrine) work both by blocking reuptake and by actively stimulating release of dopamine and norepinephrine from presynaptic vesicles—a more robust catecholaminergic effect than methylphenidate, which explains why some individuals who do not respond to methylphenidate respond to amphetamines, and vice versa. Both classes are available in short-acting (duration 3–6 hours) and extended-release formulations (duration 8–12 hours). Extended-release formulations are strongly preferred for most clients because they provide more consistent therapeutic coverage across the school or work day, reduce the need for midday dosing (which carries stigma for school-aged clients), and generally have smoother on-off transitions without the rebound irritability that can occur as short-acting stimulants wear off.</p><p>Lisdexamfetamine (Vyvanse) represents a particularly notable pharmacological innovation: it is a prodrug—an inactive compound that requires metabolic conversion in the body before becoming active. Lisdexamfetamine must be cleaved by enzymes in red blood cells to release d-amphetamine. Because this conversion process is rate-limited, the drug cannot be absorbed more rapidly by crushing or snorting it, significantly reducing its abuse potential compared to other amphetamines. This makes Vyvanse a preferred choice for clients where stimulant misuse is a concern, and it is FDA-approved for binge eating disorder in addition to ADHD.</p><p>Common side effects of stimulant medications require active counselor monitoring. <strong>Appetite suppression</strong> is among the most common, typically most pronounced during the peak of medication effect (midday) and resolving as the medication wears off. Many clients—especially children—eat minimally during the day and then have rebound appetite in the evening. This can be clinically managed by ensuring a good breakfast before the medication takes effect and a substantial meal in the evening, but weight and growth monitoring in children is important. <strong>Insomnia</strong> is another common concern, particularly with late doses, high doses, or in individuals who are sensitive to stimulant effects on sleep architecture. Counselors should routinely ask about sleep quality in clients taking stimulants and ensure this information is communicated to prescribers, as dosing timing adjustments can often resolve sleep concerns. <strong>Cardiovascular effects</strong>—modest elevations in heart rate and blood pressure—are expected and generally well-tolerated in healthy individuals, but clients with pre-existing cardiovascular conditions, hypertension, structural heart abnormalities, or significant anxiety disorders require prescriber evaluation before starting stimulants. Any client reporting palpitations, chest pain, or racing heart on stimulants should be directed to contact their prescriber.</p><p>In children, there has been longstanding concern about potential effects of long-term stimulant use on growth velocity—height and weight gains over time. Research suggests that growth effects, if they occur, are modest and generally normalize over time, but the question remains an active monitoring consideration. Prescribers typically track height and weight at each visit; counselors can reinforce the importance of these medical check-ins for ADHD-treated children.</p><p>Stimulant medications are Schedule II controlled substances, reflecting their potential for misuse and diversion. In adult populations and particularly in college settings, stimulant diversion—sharing or selling prescribed medications to individuals who do not have ADHD—is a documented and significant concern. Non-medical use of stimulants for studying, work performance enhancement, or weight loss is prevalent. Counselors should maintain clinical awareness of the possibility that clients may be misusing stimulant prescriptions—taking higher doses than prescribed, taking medications for non-ADHD purposes, running out early, or obtaining medications from multiple sources—without approaching this with accusation or suspicion as a default. Signs of stimulant misuse or excessive dosing include: agitation, anxiety, pressured speech, insomnia extending beyond normal adjustment, weight loss beyond what would be expected, mood lability, grandiosity or unusual energy, and cardiovascular symptoms. When diversion or misuse is suspected, the counselor\'s clinical responsibility is to raise it with the client in a non-judgmental, exploratory way and to communicate clinical concerns to the prescribing provider.</p><p><strong>Non-Stimulant ADHD Medications</strong> are used when stimulants are contraindicated (as in clients with certain cardiovascular conditions or histories of stimulant use disorder), when stimulants are ineffective or poorly tolerated, or when parents or clients prefer a non-stimulant approach. <strong>Atomoxetine (Strattera)</strong> is a selective norepinephrine reuptake inhibitor—it increases norepinephrine availability in the prefrontal cortex through a similar mechanism to SNRIs. It is not a controlled substance and carries no abuse or diversion potential, making it an important option for clients with substance use disorder histories or in school settings where stimulant diversion is a concern. Its primary limitation is onset of action: atomoxetine requires 4–6 weeks of consistent daily use to achieve full therapeutic effect, similar to antidepressants. Clients and families accustomed to the nearly immediate effect of stimulants sometimes discontinue atomoxetine prematurely, believing it is not working. Counselors can support persistence through this therapeutic lag with accurate psychoeducation. Importantly, atomoxetine carries a black box warning for increased suicidal ideation in children and adolescents—counselors monitoring pediatric clients on atomoxetine must include specific suicidality screening in their assessment.</p><p><strong>Alpha-2 adrenergic agonists</strong>—guanfacine (Intuniv) and clonidine (Kapvay)—are also FDA-approved as non-stimulant ADHD treatments. They work by binding alpha-2A receptors in the prefrontal cortex, strengthening working memory and reducing hyperactivity and impulsivity through noradrenergic modulation. They are used both as monotherapy and as adjuncts to stimulants when stimulants alone do not adequately control hyperactive/impulsive symptoms. Guanfacine is generally preferred over clonidine in ADHD treatment because it is more selective for alpha-2A receptors and has a longer duration of action with less sedation. Both medications lower blood pressure—they are antihypertensive medications at higher doses—and should not be discontinued abruptly, as rebound hypertension can occur. Sedation is particularly notable with clonidine and can be dose-limiting.</p>'
        },
        {
          type: 'text',
          title: 'Medication-Assisted Treatment (MAT) for Substance Use Disorders',
          body: '<p>Medication-Assisted Treatment (MAT) integrates FDA-approved medications with counseling and behavioral therapies to treat substance use disorders, particularly opioid use disorder (OUD) and alcohol use disorder (AUD). MAT is evidence-based, SAMHSA-endorsed, and has been shown to reduce illicit drug use, overdose deaths, HIV transmission, and criminal activity while improving treatment retention and social functioning. Despite its evidence base, MAT remains stigmatized in some clinical and community settings—sometimes even among counselors. This stigma is a clinical problem, and this section will equip you with accurate knowledge to counter it and support your clients in utilizing MAT effectively.</p><p><strong>Opioid Use Disorder (OUD) — MAT Options:</strong></p><p><strong>Methadone</strong> is a full opioid agonist (it activates the same receptors as heroin and prescription opioids) used as a long-acting, orally administered maintenance treatment for OUD. Because it is a full agonist with long duration of action, it eliminates withdrawal and craving over 24–36 hours without producing euphoria when taken at appropriate maintenance doses. Methadone for OUD can only be dispensed through federally certified opioid treatment programs (OTPs), typically as daily observed dosing. Clients "earn" take-home doses through demonstrated stability. Counselors working with clients on methadone should understand the structure of OTP programs, encourage engagement with counseling components of the program, and coordinate care with the OTP provider.</p><p><strong>Buprenorphine (Suboxone, Subutex, Sublocade)</strong> is a partial opioid agonist with a "ceiling effect"—its opioid effects plateau at higher doses, making it significantly safer in overdose than methadone or full agonists. Suboxone combines buprenorphine with naloxone; the naloxone is included as a deterrent to injection misuse (when taken as sublingual film, naloxone is minimally absorbed, but if injected, it precipitates withdrawal). Since 2023, the X-waiver requirement for physicians to prescribe buprenorphine has been eliminated, allowing any DEA-registered practitioner to prescribe it—significantly expanding access. Counselors working with buprenorphine clients should know that concurrent therapy is essential to optimize outcomes, that missing doses can precipitate withdrawal (clients on buprenorphine are physically dependent), and that buprenorphine dramatically reduces overdose risk for clients with OUD.</p><p><strong>Naltrexone (Vivitrol, oral Revia)</strong> is an opioid antagonist—it blocks opioid receptors completely, so if a client takes opioids while on naltrexone, they experience no effect (no euphoria, no pain relief). The injectable form (Vivitrol, given monthly by injection) removes adherence barriers and is preferred for many clients. Naltrexone works best for clients who are highly motivated and have completed medically supervised withdrawal—it is not appropriate for clients who are still using opioids, as it will precipitate severe withdrawal. Naltrexone is also FDA-approved for alcohol use disorder.</p><p><strong>Alcohol Use Disorder (AUD) — MAT Options:</strong> <strong>Naltrexone</strong> (oral or injectable) reduces the rewarding effects of alcohol, reducing craving and relapse to heavy drinking. It does not require abstinence at initiation and can be effective for clients who are reducing but not yet abstinent. <strong>Acamprosate (Campral)</strong> is thought to work by normalizing glutamate activity disrupted by chronic alcohol use; it reduces post-acute withdrawal symptoms (insomnia, anxiety, dysphoria) that often drive relapse in early recovery. It requires abstinence at initiation and three-times-daily dosing—adherence support is important. <strong>Disulfiram (Antabuse)</strong> is an aversive agent: it blocks the metabolism of acetaldehyde, so if a client drinks alcohol while on disulfiram, they experience a severe unpleasant reaction—flushing, nausea, vomiting, rapid heart rate, headache. Its effectiveness depends entirely on adherence, making it most suitable for clients with high motivation or in supervised administration contexts. Counselors should discuss with clients which MAT option has been prescribed, explore their relationship to the medication, address stigma, and support adherence.</p>'
        },
        {
          type: 'callout',
          calloutType: 'insight',
          title: 'Addressing MAT Stigma in Counseling Practice',
          body: 'Research shows that stigma toward MAT among mental health providers—including counselors—is a real barrier to client access and engagement. Some counselors hold the belief that MAT is "trading one addiction for another" or that clients on MAT are "not really in recovery." This perspective is not supported by evidence and can harm clients. Opioid use disorder is a chronic neurobiological condition; MAT is a legitimate medical treatment that saves lives. A client stabilized on buprenorphine or methadone and engaged in counseling is in active recovery. Counselors should examine their own beliefs about MAT and ensure their practice stance aligns with evidence-based, anti-stigma principles.'
        },
        {
          type: 'accordion',
          title: 'Collaborative Care: Communicating Effectively with Prescribers',
          items: [
            {
              heading: 'Why Collaborative Communication Matters',
              body: 'Studies on integrated care models consistently find that outcomes improve when prescribers and counselors communicate regularly, share information about client progress and concerns, and coordinate treatment planning. In contrast, siloed care—where the counselor sees the client weekly but has no contact with the prescriber—results in medication decisions made without clinical context, and therapeutic work done without knowledge of pharmacological status. Counselors in integrated settings may have structured channels for communication (shared EHR, regular team meetings, direct messaging). In non-integrated settings, counselors often need to be proactive about establishing communication with prescribers, with client consent.'
            },
            {
              heading: 'What to Communicate and How',
              body: 'Effective prescriber communication from counselors includes: (1) Symptom observations—specific, behavioral descriptions of what the counselor is observing in sessions (e.g., "Client reports increased tearfulness and anhedonia over the past three weeks despite being on current medication regimen for four months"); (2) Medication adherence information—whether the client is taking their medication as prescribed, any barriers to adherence, and any self-modification of dosing; (3) New clinical information—substance use, new stressors, medical events, significant side effects reported to you but not to the prescriber; (4) Client questions or concerns about their medication that the client has been reluctant to raise with the prescriber. Written communication (with client consent) via letter, secure message, or shared documentation is preferable to phone tag. Include your contact information and specifically invite the prescriber to reach out.'
            },
            {
              heading: 'Medication Adherence Counseling',
              body: 'Medication non-adherence is extraordinarily common—studies estimate that 50% of patients with chronic conditions are non-adherent to prescribed medications over time. In psychiatric populations, non-adherence rates are even higher, due to side effects, stigma, cost, cognitive impairment, and the nature of conditions like bipolar disorder (where clients in hypomania often feel well and discontinue medication). Counselors can use Motivational Interviewing skills to explore ambivalence about medication, identify specific barriers (cost, forgetfulness, side effects, stigma, lack of perceived benefit), and collaboratively develop adherence strategies (pill organizers, phone alarms, medication as a form of self-care). MI-informed adherence counseling has evidence for improving medication adherence and should be a standard part of counseling with clients taking psychiatric medications.'
            },
            {
              heading: 'Common Medication Questions Clients Ask—and How Counselors Respond',
              body: '"Can I drink alcohol while on this medication?" → Appropriate response: Explain that you cannot advise on medication specifics but that this is an important question to ask their prescriber. Note that alcohol interacts with many psychiatric medications and is generally not recommended. Encourage the client to ask their prescriber directly. "I feel better, can I stop my medication?" → Appropriate response: Validate the positive change, explain that feeling better is often a sign the medication is working (not a sign that it is no longer needed), and encourage the client to have this conversation with their prescriber before making any changes. "My medication isn\'t working" → Appropriate response: Take this seriously. Explore what "not working" means to the client. Document specific observations. Encourage the client to contact their prescriber and offer to assist with that communication. "Is it safe to take this with my thyroid medication?" → Appropriate response: This is a drug interaction question best answered by the prescribing provider or pharmacist. Encourage the client to ask their pharmacist, who is an expert in drug interactions and is an underutilized resource.'
            },
            {
              heading: 'Scope of Practice: Knowing the Boundaries',
              body: 'The core scope-of-practice principle for counselors and psychopharmacology is this: counselors observe, document, educate, support, and communicate. Counselors do NOT: diagnose medication-related conditions, recommend specific medications or doses, advise clients to start, stop, or change medications, or provide specific medication interaction guidance. When in doubt about whether something falls within your scope, ask yourself: "Am I making a clinical decision about medication?" If yes, that decision belongs to the prescribing provider. Your role is to provide the prescriber with accurate, timely information about what you are observing clinically—and to support your client\'s engagement with their pharmacological treatment within that boundary.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Pharmacist: Your Underutilized Collaborative Partner',
          imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
          imageAlt: 'Pharmacist consulting with a patient',
          imagePosition: 'right',
          body: '<p>Pharmacists are among the most accessible and underutilized members of the healthcare team for both clients and counselors. Licensed pharmacists have extensive training in pharmacology and drug interactions and are required by professional standards to counsel patients on their medications. Clients can speak with a pharmacist for free, without an appointment, at any community pharmacy.</p><p>Counselors can empower clients to use pharmacists as a resource for: understanding how their medications work, asking about drug interactions (including with over-the-counter medications, supplements, and herbal products), discussing side effects, and getting clarification on instructions. For counselors, directing clients to their pharmacist for medication-specific questions is an appropriate way to support clients without overstepping scope of practice boundaries.</p><p>In collaborative care settings, clinical pharmacists may be embedded in behavioral health teams, performing medication reconciliation, monitoring for drug interactions, and educating clients. Knowing how to loop in the pharmacist is a clinical skill worth developing.</p>'
        },
        {
          type: 'knowledgeCheck',
          question: 'A client with opioid use disorder tells you they were recently prescribed buprenorphine/naloxone (Suboxone) by their primary care physician but is reluctant to take it because they "don\'t want to be on another drug." What is the most appropriate therapeutic response?',
          questionType: 'multipleChoice',
          options: [
            { text: 'Agree with the client that it is better to pursue abstinence-only recovery without medication.', isCorrect: false },
            { text: 'Validate the client\'s concerns, explore the specific meaning of their reluctance, and provide accurate psychoeducation about how buprenorphine works and the evidence for MAT—while supporting the client\'s autonomy to discuss final treatment decisions with their prescriber.', isCorrect: true },
            { text: 'Tell the client they must take the medication as prescribed or their treatment will not be effective.', isCorrect: false },
            { text: 'Advise the client to try naltrexone instead, as it is not physically addictive.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'MAT stigma—including the belief that medication-assisted recovery is "not real recovery"—is a significant barrier to evidence-based treatment. The counselor\'s role is to validate the client\'s concerns, explore ambivalence (a core MI skill), and provide accurate psychoeducation about what buprenorphine is and does. The research is clear: MAT for OUD significantly reduces overdose mortality, increases treatment retention, and improves functioning. Counselors should not reinforce MAT stigma, and switching medications is a clinical decision for the prescriber—not the counselor.'
        },
        {
          type: 'knowledgeCheck',
          question: 'A 17-year-old client has been prescribed atomoxetine (Strattera) for ADHD. In your next session, you observe the client appears more withdrawn and admits to having thoughts that "it would be better if I weren\'t here." What should you do?',
          questionType: 'multipleChoice',
          options: [
            { text: 'Continue with the session and plan to mention it at your next supervision.', isCorrect: false },
            { text: 'Conduct a thorough suicide risk assessment, notify the prescribing provider of the suicidal ideation in the context of recent atomoxetine initiation, and follow your agency\'s crisis protocol.', isCorrect: true },
            { text: 'Tell the client to stop taking their atomoxetine and call their doctor tomorrow.', isCorrect: false },
            { text: 'Reassure the client that these thoughts are a normal adjustment to the new medication.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Atomoxetine carries a black box warning for increased suicidal ideation in children and adolescents, similar to antidepressants. This is an active safety concern requiring immediate action: thorough suicide risk assessment, prescriber notification (the prescriber needs to know about this in the context of the new medication), and activation of crisis protocols as indicated by risk level. Counselors should not advise stopping medication—that is a prescriber decision. Normalizing suicidal ideation is never appropriate.'
        },
        {
          type: 'knowledgeCheck',
          question: 'Which statement about disulfiram (Antabuse) is most accurate for counselors to understand?',
          questionType: 'multipleChoice',
          options: [
            { text: 'Disulfiram actively reduces alcohol craving by modulating GABA receptors.', isCorrect: false },
            { text: 'Disulfiram produces a severe aversive physical reaction if a client consumes alcohol while taking it, and its effectiveness depends entirely on adherence.', isCorrect: true },
            { text: 'Disulfiram is the first-line MAT for alcohol use disorder.', isCorrect: false },
            { text: 'Disulfiram can be safely stopped at any time without medical supervision.', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Disulfiram (Antabuse) is an aversive agent: it inhibits the enzyme aldehyde dehydrogenase, causing acetaldehyde accumulation if alcohol is consumed. The resulting reaction (flushing, nausea, vomiting, rapid heart rate) is intensely unpleasant and potentially dangerous at high alcohol doses. Disulfiram provides no craving reduction—its mechanism is purely aversive. Adherence is therefore the critical variable; it works well for highly motivated clients and in supervised administration. It is not the first-line agent (naltrexone and acamprosate typically are preferred in current guidelines).'
        },
        {
          type: 'cardSort',
          title: 'Sort Medications by Primary Use Category',
          instructions: 'Drag each medication to the correct primary use category. Some categories may have multiple medications.',
          categories: ['Opioid Use Disorder MAT', 'Alcohol Use Disorder MAT', 'ADHD (Stimulant)', 'ADHD (Non-Stimulant)', 'Mood Stabilizer'],
          cards: [
            { text: 'Buprenorphine/naloxone (Suboxone)', category: 'Opioid Use Disorder MAT' },
            { text: 'Methadone (in OTP programs)', category: 'Opioid Use Disorder MAT' },
            { text: 'Naltrexone injectable (Vivitrol) — for opioid use disorder', category: 'Opioid Use Disorder MAT' },
            { text: 'Acamprosate (Campral)', category: 'Alcohol Use Disorder MAT' },
            { text: 'Disulfiram (Antabuse)', category: 'Alcohol Use Disorder MAT' },
            { text: 'Naltrexone oral (Revia) — for alcohol use disorder', category: 'Alcohol Use Disorder MAT' },
            { text: 'Methylphenidate (Ritalin, Concerta)', category: 'ADHD (Stimulant)' },
            { text: 'Mixed amphetamine salts (Adderall)', category: 'ADHD (Stimulant)' },
            { text: 'Lisdexamfetamine (Vyvanse)', category: 'ADHD (Stimulant)' },
            { text: 'Atomoxetine (Strattera)', category: 'ADHD (Non-Stimulant)' },
            { text: 'Guanfacine (Intuniv)', category: 'ADHD (Non-Stimulant)' },
            { text: 'Lamotrigine (Lamictal)', category: 'Mood Stabilizer' },
            { text: 'Lithium carbonate', category: 'Mood Stabilizer' },
            { text: 'Valproate (Depakote)', category: 'Mood Stabilizer' }
          ],
          explanation: 'Understanding which medications treat which conditions helps counselors provide accurate psychoeducation, ask relevant questions in sessions, and communicate effectively with prescribers. Note that naltrexone appears in two categories (OUD and AUD) — it is FDA-approved for both.'
        },
        {
          type: 'reflection',
          question: 'Consider your current caseload or a typical caseload in your practice setting. Which medication classes covered in this course are you most likely to encounter? What is one gap in your knowledge about those medications that this course has addressed, and how might you apply that knowledge to improve client care in the next 30 days?'
        },
        {
          type: 'keyTakeaway',
          title: 'Section 3 Key Takeaways',
          points: [
            'Stimulants (methylphenidate, amphetamines) are first-line for ADHD; non-stimulants (atomoxetine, guanfacine) are preferred when stimulants are contraindicated or in clients with substance use disorders.',
            'MAT for opioid use disorder (buprenorphine, methadone, naltrexone) is evidence-based and reduces overdose mortality; MAT stigma among counselors is a real barrier to client access and must be examined.',
            'MAT for alcohol use disorder includes naltrexone (reduces reward), acamprosate (reduces post-acute withdrawal), and disulfiram (aversive deterrent); each has different mechanisms and client profiles.',
            'Effective collaborative care requires proactive communication with prescribers: share specific behavioral observations, adherence information, and client concerns—with client consent.',
            'Scope of practice for counselors means observing, documenting, educating, and supporting—not making medication decisions. When in doubt, communicate to the prescribing provider and let them decide.'
          ]
        },
        {
          type: 'resources',
          title: 'Additional Resources for Psychopharmacology Knowledge',
          items: [
            { label: 'SAMHSA: Medications for Opioid Use Disorder (Treatment Improvement Protocol 63)', url: 'https://store.samhsa.gov/product/medications-opioid-use-disorder/PEP21-02-01-002' },
            { label: 'NAMI: Mental Health Medications Guide', url: 'https://www.nami.org/About-Mental-Illness/Treatments/Mental-Health-Medications' },
            { label: 'National Institute on Drug Abuse: Medications to Treat Opioid Use Disorder', url: 'https://nida.nih.gov/publications/research-reports/medications-to-treat-opioid-addiction/overview' },
            { label: 'American Psychiatric Association: Practice Guideline for MDD', url: 'https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890423363' },
            { label: 'SAMHSA: Medication-Assisted Treatment (MAT)', url: 'https://www.samhsa.gov/medication-assisted-treatment' },
            { label: 'Psychiatry.org: Patient Resource on Psychopharmacology', url: 'https://www.psychiatry.org/patients-families/what-is-psychiatry/pharmacological-treatment' },
            { label: 'FDA: Approved Risk Evaluation and Mitigation Strategies (REMS)', url: 'https://www.accessdata.fda.gov/scripts/cder/rems/index.cfm' },
            { label: 'NIMH: Mental Health Medications', url: 'https://www.nimh.nih.gov/health/topics/mental-health-medications' },
            { label: 'Substance Abuse and Mental Health Services Administration: Principles of Drug Addiction Treatment', url: 'https://www.drugabuse.gov/publications/principles-drug-addiction-treatment-research-based-guide-third-edition' },
            { label: 'National Alliance on Mental Illness: Guide to Mood Stabilizers', url: 'https://www.nami.org/About-Mental-Illness/Treatments/Mental-Health-Medications/Types-of-Medication/Mood-Stabilizers' }
          ]
        }
      ]
    }
  ],

  assessment: {
    title: 'Psychopharmacology for Non-Prescribers: Final Assessment',
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        question: 'Which neurotransmitter system is primarily targeted by SSRIs?',
        type: 'multipleChoice',
        options: [
          { text: 'Dopamine', isCorrect: false },
          { text: 'Serotonin', isCorrect: true },
          { text: 'GABA', isCorrect: false },
          { text: 'Glutamate', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'SSRIs (Selective Serotonin Reuptake Inhibitors) block the serotonin transporter (SERT), preventing reuptake of serotonin and increasing its availability in the synapse.'
      },
      {
        question: 'A client on an SSRI suddenly stops taking their medication and begins experiencing "brain zaps," flu-like symptoms, and irritability. The counselor should:',
        type: 'multipleChoice',
        options: [
          { text: 'Diagnose the client with SSRI discontinuation syndrome and provide supportive therapy only.', isCorrect: false },
          { text: 'Document the symptoms and communicate with the prescribing provider promptly.', isCorrect: true },
          { text: 'Advise the client to restart their medication at the previous dose.', isCorrect: false },
          { text: 'Reassure the client this is normal and will pass on its own without prescriber involvement.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Counselors document and communicate—not diagnose or advise medication changes. SSRI discontinuation syndrome is common with abrupt cessation; the prescriber needs to know and will guide the client on restarting with a taper plan.'
      },
      {
        question: 'Which antidepressant class requires clients to follow a strict low-tyramine diet to avoid potentially life-threatening hypertensive crisis?',
        type: 'multipleChoice',
        options: [
          { text: 'SSRIs', isCorrect: false },
          { text: 'SNRIs', isCorrect: false },
          { text: 'MAOIs (Monoamine Oxidase Inhibitors)', isCorrect: true },
          { text: 'Tricyclic antidepressants', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'MAOIs inhibit monoamine oxidase, the enzyme that breaks down tyramine. When clients on MAOIs consume tyramine-rich foods (aged cheeses, cured meats, fermented foods), they can experience a dangerous spike in blood pressure (hypertensive crisis).'
      },
      {
        question: 'A client on lithium becomes ill with severe vomiting and diarrhea for three days. The counselor should:',
        type: 'multipleChoice',
        options: [
          { text: 'Tell the client to double their lithium dose to compensate for any absorbed with the vomiting.', isCorrect: false },
          { text: 'Treat this as a potential lithium toxicity risk and contact the prescribing provider promptly, as dehydration can rapidly elevate lithium concentrations.', isCorrect: true },
          { text: 'Advise the client to skip their lithium while ill and restart when better.', isCorrect: false },
          { text: 'Document and follow up at the next scheduled session.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Dehydration from GI illness reduces sodium and fluid volume, dramatically elevating lithium concentrations toward toxic levels. This is a potential medical emergency—the prescriber must be notified promptly so they can assess the client and provide guidance.'
      },
      {
        question: 'Which of the following best describes akathisia, a side effect of antipsychotic medications?',
        type: 'multipleChoice',
        options: [
          { text: 'Repetitive involuntary movements of the mouth and tongue associated with long-term antipsychotic use.', isCorrect: false },
          { text: 'A sudden, painful sustained muscle contraction in the neck or eyes occurring within the first days of treatment.', isCorrect: false },
          { text: 'An intense, subjective feeling of motor restlessness and inability to remain still.', isCorrect: true },
          { text: 'Elevated blood sugar and weight gain associated with atypical antipsychotics.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Akathisia is an EPS side effect characterized by an intensely distressing inner sense of restlessness—clients feel compelled to move and cannot sit still. It is often misidentified as anxiety or agitation and is a significant driver of antipsychotic non-adherence. It differs from tardive dyskinesia (involuntary movements, chronic) and acute dystonia (sudden muscle contractions).'
      },
      {
        question: 'What is the primary clinical concern with lamotrigine (Lamictal) that counselors should know?',
        type: 'multipleChoice',
        options: [
          { text: 'It lowers the seizure threshold and is contraindicated in clients with eating disorders.', isCorrect: false },
          { text: 'It requires a strict tyramine-free diet to prevent dangerous drug-food interactions.', isCorrect: false },
          { text: 'Any new rash in a client on lamotrigine, especially involving mucous membranes, is a potential medical emergency requiring immediate evaluation.', isCorrect: true },
          { text: 'It is teratogenic and is strongly contraindicated in pregnancy.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Lamotrigine carries risk of Stevens-Johnson syndrome, a potentially life-threatening hypersensitivity skin reaction. The risk is highest when the dose is increased too rapidly. Any new rash—especially involving mucous membranes—should be treated as a potential emergency and the client should receive immediate medical evaluation. Do not take a "wait and see" approach.'
      },
      {
        question: 'A client with opioid use disorder is taking buprenorphine/naloxone (Suboxone) and is participating in your counseling services. They say a family member told them they are "not really in recovery" because they are taking medication. How should the counselor respond?',
        type: 'multipleChoice',
        options: [
          { text: 'Agree that full recovery from opioids should eventually mean being medication-free.', isCorrect: false },
          { text: 'Validate the difficulty of that message, provide accurate psychoeducation about MAT, and affirm that clients on buprenorphine who are engaged in treatment are in active recovery—consistent with the evidence base.', isCorrect: true },
          { text: 'Advise the client to stop taking their buprenorphine to prove to their family they are committed to recovery.', isCorrect: false },
          { text: 'Refer the client to a 12-step program that does not support MAT.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'MAT stigma—including the "trading one addiction for another" narrative—is not supported by evidence and causes harm. Buprenorphine is an evidence-based treatment for OUD that reduces overdose mortality and improves function. A client engaged in treatment and taking prescribed buprenorphine is in recovery. Counselors have a responsibility to counter misinformation and affirm the validity of MAT.'
      },
      {
        question: 'Which of the following is a key difference between methadone and buprenorphine for opioid use disorder treatment?',
        type: 'multipleChoice',
        options: [
          { text: 'Methadone is a partial opioid agonist; buprenorphine is a full agonist.', isCorrect: false },
          { text: 'Buprenorphine is a full opioid agonist that must be dispensed daily at an OTP clinic; methadone can be prescribed in office-based settings.', isCorrect: false },
          { text: 'Methadone is a full opioid agonist dispensed through certified OTPs; buprenorphine is a partial agonist with a ceiling effect that can be prescribed in office-based settings.', isCorrect: true },
          { text: 'Both are partial opioid agonists but differ only in their half-lives.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Methadone is a full opioid agonist requiring dispensing through federally certified opioid treatment programs (OTPs). Buprenorphine is a partial agonist with a ceiling effect (safer in overdose) and since 2023 can be prescribed by any DEA-registered practitioner in office-based settings, significantly improving access.'
      },
      {
        question: 'A client on an atypical antipsychotic has gained 30 pounds over 8 months and is expressing that they want to stop their medication. What is the most appropriate counselor response?',
        type: 'multipleChoice',
        options: [
          { text: 'Tell the client weight gain is a small price to pay for symptom stabilization and they should continue their medication.', isCorrect: false },
          { text: 'Support the client in exploring the impact of the weight gain, validate their concern as clinically significant, and collaborate with the prescriber about the client\'s experience and possible treatment adjustments.', isCorrect: true },
          { text: 'Advise the client to switch to a lower-risk antipsychotic to reduce metabolic side effects.', isCorrect: false },
          { text: 'Tell the client to consult a nutritionist before making any decisions about their medication.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Metabolic side effects are a leading cause of antipsychotic non-adherence and represent a genuine clinical issue, not a trivial complaint. The counselor validates the experience, explores it therapeutically, and ensures the prescriber is informed of the client\'s concerns. Medication changes are prescriber decisions.'
      },
      {
        question: 'Which mood stabilizer is particularly associated with risk of neural tube defects in pregnancy and requires careful attention to family planning counseling?',
        type: 'multipleChoice',
        options: [
          { text: 'Lithium', isCorrect: false },
          { text: 'Lamotrigine', isCorrect: false },
          { text: 'Valproate (Depakote)', isCorrect: true },
          { text: 'Carbamazepine', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Valproate (Depakote) is strongly teratogenic, associated with neural tube defects (spina bifida) and other fetal abnormalities. The FDA has strengthened warnings about valproate use in women of childbearing potential. Counselors working with female clients on valproate should address family planning and ensure this has been discussed with their prescribing provider.'
      },
      {
        question: 'Atomoxetine (Strattera) differs from stimulant ADHD medications in all of the following ways EXCEPT:',
        type: 'multipleChoice',
        options: [
          { text: 'Atomoxetine is not a controlled substance and has no abuse potential.', isCorrect: false },
          { text: 'Atomoxetine requires 4–6 weeks to achieve full therapeutic effect.', isCorrect: false },
          { text: 'Atomoxetine provides immediate symptom relief within 30–60 minutes of dosing.', isCorrect: true },
          { text: 'Atomoxetine is a selective norepinephrine reuptake inhibitor.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Atomoxetine does NOT provide immediate symptom relief—this is the correct "exception." Like antidepressants, atomoxetine requires 4–6 weeks to build to therapeutic effect. All other options correctly describe how atomoxetine differs from stimulants (not controlled, delayed onset, norepinephrine mechanism).'
      },
      {
        question: 'The neurotransmitter GABA is best described as:',
        type: 'multipleChoice',
        options: [
          { text: 'The brain\'s primary excitatory neurotransmitter, involved in learning and memory.', isCorrect: false },
          { text: 'The brain\'s primary inhibitory neurotransmitter, reducing neural excitability.', isCorrect: true },
          { text: 'A neurotransmitter involved primarily in the reward pathway and motivation.', isCorrect: false },
          { text: 'A neurotransmitter that regulates prolactin secretion and motor control.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'GABA (gamma-aminobutyric acid) is the primary inhibitory neurotransmitter in the central nervous system—it reduces neural excitability. Benzodiazepines and barbiturates enhance GABA activity, producing sedation and anxiolysis. Glutamate is the primary excitatory neurotransmitter.'
      },
      {
        question: 'A client who has been taking alprazolam (Xanax) for 2 years for panic disorder says they want to stop taking it because they\'ve been doing well in therapy. The counselor should:',
        type: 'multipleChoice',
        options: [
          { text: 'Encourage the client to stop the medication as soon as possible to avoid continued dependence.', isCorrect: false },
          { text: 'Validate the client\'s progress, acknowledge that discontinuing benzodiazepines is a significant decision, and strongly encourage the client to work with their prescribing provider on a structured taper—never stopping abruptly.', isCorrect: true },
          { text: 'Tell the client to halve their dose immediately for two weeks, then stop.', isCorrect: false },
          { text: 'Advise the client that they may need to stay on benzodiazepines indefinitely given their history of panic disorder.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Benzodiazepine withdrawal can be medically dangerous—including risk of seizures and death—particularly after long-term use. Abrupt discontinuation is never appropriate after 2 years of regular use. The counselor validates the client\'s therapeutic progress, supports the goal of eventually reducing medication, and strongly directs the client to work with their prescriber on a structured taper. Counselors do not advise specific tapering schedules.'
      },
      {
        question: 'Which of the following is a primary counselor responsibility in collaborative medication management, within appropriate scope of practice?',
        type: 'multipleChoice',
        options: [
          { text: 'Determining whether a client\'s medication dose should be increased based on symptom severity.', isCorrect: false },
          { text: 'Prescribing bridging medications when a client cannot reach their psychiatrist.', isCorrect: false },
          { text: 'Documenting and communicating clinical observations about medication effects and adherence to the prescribing provider.', isCorrect: true },
          { text: 'Interpreting blood test results and advising clients on whether their levels are therapeutic.', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The counselor\'s pharmacology-related scope of practice includes observation, documentation, and communication with prescribers—not clinical decisions about dosing, prescribing, or interpreting lab results. Documenting behavioral observations and medication adherence information and sharing it with the treatment team is both within scope and clinically valuable.'
      },
      {
        question: 'A client on clozapine develops a fever of 103°F and a severe sore throat. What should the counselor do?',
        type: 'multipleChoice',
        options: [
          { text: 'Recommend the client take OTC fever reducers and rest; this is likely a common viral illness.', isCorrect: false },
          { text: 'Treat this as a potential medical emergency consistent with possible agranulocytosis; instruct the client to seek immediate medical evaluation and contact the prescribing provider.', isCorrect: true },
          { text: 'Document the symptoms and contact the prescribing provider at the next business day.', isCorrect: false },
          { text: 'Have the client stop their clozapine and restart when the illness resolves.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Clozapine carries risk of agranulocytosis—destruction of white blood cells that eliminates immune function. Signs of infection in a client on clozapine must be treated urgently, as even a common illness can become life-threatening if agranulocytosis is developing. Immediate medical evaluation is required—this is not a wait-and-see situation.'
      },
      {
        question: 'Which of the following statements about bupropion (Wellbutrin) is correct?',
        type: 'multipleChoice',
        options: [
          { text: 'Bupropion is an SSRI with strong serotonergic effects and is the first-line agent for sexual dysfunction.', isCorrect: false },
          { text: 'Bupropion inhibits dopamine and norepinephrine reuptake, has no sexual side effects, and lowers the seizure threshold.', isCorrect: true },
          { text: 'Bupropion is contraindicated in clients with depression and can only be used for smoking cessation.', isCorrect: false },
          { text: 'Bupropion is a safe choice for clients with active alcohol use disorder and eating disorders due to its weight-neutral profile.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Bupropion inhibits dopamine and norepinephrine reuptake (not serotonin), making it unique among antidepressants. It has no sexual side effects and can promote weight loss. However, it lowers the seizure threshold and is contraindicated in seizure disorders, eating disorders (electrolyte imbalances from purging increase seizure risk), and active alcohol use disorder. It is frequently used as augmentation when SSRIs cause sexual dysfunction.'
      },
      {
        question: 'In what way does the dopamine nigrostriatal pathway specifically relate to antipsychotic side effects?',
        type: 'multipleChoice',
        options: [
          { text: 'Dopamine blockade in this pathway reduces positive symptoms of psychosis (hallucinations, delusions).', isCorrect: false },
          { text: 'Dopamine blockade in this pathway causes extrapyramidal symptoms (tremor, rigidity, tardive dyskinesia).', isCorrect: true },
          { text: 'Dopamine blockade in this pathway produces hyperprolactinemia, causing galactorrhea.', isCorrect: false },
          { text: 'Dopamine blockade in this pathway impairs working memory and executive function.', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The nigrostriatal pathway is involved in motor control. When antipsychotics block dopamine D2 receptors in this pathway, they produce extrapyramidal symptoms (EPS): parkinsonism, akathisia, acute dystonia, and with chronic use, tardive dyskinesia. The mesolimbic pathway is where antipsychotic therapeutic effects on positive symptoms occur; the tuberoinfundibular pathway is where prolactin effects occur.'
      }
    ]
  },

  references: [
    'Stahl, S. M. (2021). Stahl\'s essential psychopharmacology: Neuroscientific basis and practical applications (5th ed.). Cambridge University Press.',
    'Preston, J. D., O\'Neal, J. H., & Talaga, M. C. (2021). Handbook of clinical psychopharmacology for therapists (9th ed.). New Harbinger Publications.',
    'SAMHSA. (2021). Medications for opioid use disorder: Treatment improvement protocol (TIP) 63. Substance Abuse and Mental Health Services Administration. https://store.samhsa.gov/product/medications-opioid-use-disorder/PEP21-02-01-002',
    'American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text revision). American Psychiatric Publishing.',
    'Cipriani, A., Furukawa, T. A., Salanti, G., Chaimani, A., Atkinson, L. Z., Ogawa, Y., ... & Geddes, J. R. (2018). Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder: A systematic review and network meta-analysis. The Lancet, 391(10128), 1357–1366. https://doi.org/10.1016/S0140-6736(17)32802-7',
    'Goodman, L. S., Brunton, L. L., Chabner, B., & Knollmann, B. C. (Eds.). (2023). Goodman and Gilman\'s the pharmacological basis of therapeutics (14th ed.). McGraw-Hill Education.',
    'Correll, C. U., & Schooler, N. R. (2020). Negative symptoms in schizophrenia: A review and clinical guide for recognition, assessment, and treatment. Neuropsychiatric Disease and Treatment, 16, 519–534. https://doi.org/10.2147/NDT.S225643',
    'Volkow, N. D., & Boyle, M. (2018). Neuroscience of addiction: Relevance to prevention and treatment. American Journal of Psychiatry, 175(8), 729–740. https://doi.org/10.1176/appi.ajp.2018.17101174',
    'Whiteford, H. A., Degenhardt, L., Rehm, J., Baxter, A. J., Ferrari, A. J., Erskine, H. E., ... & Vos, T. (2013). Global burden of disease attributable to mental and substance use disorders: Findings from the Global Burden of Disease Study 2010. The Lancet, 382(9904), 1575–1586. https://doi.org/10.1016/S0140-6736(13)61611-6',
    'Unutzer, J., Harbin, H., Schoenbaum, M., & Druss, B. (2019). The collaborative care model: An approach for integrating physical and mental health care in Medicaid health homes. Health Home Information Resource Center. https://www.medicaid.gov/sites/default/files/2019-12/collabmodels.pdf',
    'National Institute on Drug Abuse. (2022). Medications to treat opioid use disorder research report. National Institutes of Health. https://nida.nih.gov/publications/research-reports/medications-to-treat-opioid-addiction',
    'Bauer, M., Andreassen, O. A., Geddes, J. R., Vedel Kessing, L., Lewitzka, U., Schulze, T. G., & Vieta, E. (2018). Areas of uncertainties and unmet needs in bipolar disorder: Clinical and research perspectives. The Lancet Psychiatry, 5(11), 930–939. https://doi.org/10.1016/S2215-0366(18)30253-0',
    'DiMatteo, M. R. (2004). Variations in patients\' adherence to medical recommendations: A quantitative review of 50 years of research. Medical Care, 42(3), 200–209. https://doi.org/10.1097/01.mlr.0000114908.90348.f9',
    'Barnett, M. L., Linder, J. A., Frank, R. G., & Lee, N. J. (2015). In pursuit of person-centered care: The role of patient-clinician communication in improving medication adherence in mental health conditions. Psychiatric Services, 66(6), 627–636. https://doi.org/10.1176/appi.ps.201400153',
    'Fazel, S., & Seewald, K. (2012). Severe mental illness in 33,588 prisoners worldwide: Systematic review and meta-regression analysis. The British Journal of Psychiatry, 200(5), 364–373. https://doi.org/10.1192/bjp.bp.111.096370',
    'Kane, J. M., Correll, C. U., & Naber, D. (2011). Optimizing treatment choices to improve adherence and outcomes in schizophrenia. Journal of Clinical Psychiatry, 72(5), e14. https://doi.org/10.4088/JCP.10065tx1c',
    'Wagenaar, B. H., Chirwa, E., Bhatt, N., Mlombe, Y., Haberer, J. E., Carey, J., ... & Pence, B. W. (2018). Collaborative care for people with HIV and depression. Journal of Acquired Immune Deficiency Syndromes, 78(5), 474–481. https://doi.org/10.1097/QAI.0000000000001694'
  ]
};

// ─── VALIDATION UTILITIES ───────────────────────────────────────────────────

function stripHTML(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function getBlockWordCount(block) {
  let words = 0;
  if (block.body) words += countWords(stripHTML(block.body));
  if (block.title) words += countWords(block.title);
  if (block.subtitle) words += countWords(block.subtitle);
  if (block.caption) words += countWords(block.caption);
  if (block.question) words += countWords(block.question);
  if (block.explanation) words += countWords(block.explanation);
  if (block.items && Array.isArray(block.items)) {
    for (const item of block.items) {
      if (item.heading) words += countWords(item.heading);
      if (item.body) words += countWords(stripHTML(item.body));
      if (item.label) words += countWords(item.label);
    }
  }
  if (block.flashcards && Array.isArray(block.flashcards)) {
    for (const card of block.flashcards) {
      if (card.front) words += countWords(card.front);
      if (card.back) words += countWords(card.back);
    }
  }
  if (block.cards && Array.isArray(block.cards)) {
    for (const card of block.cards) {
      if (card.text) words += countWords(card.text);
      if (card.category) words += countWords(card.category);
    }
  }
  if (block.pairs && Array.isArray(block.pairs)) {
    for (const pair of block.pairs) {
      if (pair.left) words += countWords(pair.left);
      if (pair.right) words += countWords(pair.right);
    }
  }
  if (block.options && Array.isArray(block.options)) {
    for (const opt of block.options) {
      if (opt.text) words += countWords(opt.text);
    }
  }
  if (block.points && Array.isArray(block.points)) {
    for (const pt of block.points) words += countWords(pt);
  }
  if (block.instructions) words += countWords(block.instructions);
  if (block.categories && Array.isArray(block.categories)) {
    for (const cat of block.categories) words += countWords(cat);
  }
  return words;
}

function validate(course) {
  const errors = [];
  const REQUIRED_WORD_COUNT = 18000;

  // Count total words
  let totalWords = 0;
  totalWords += countWords(course.title);
  totalWords += countWords(course.description);
  if (course.learningObjectives) {
    for (const obj of course.learningObjectives) totalWords += countWords(obj);
  }

  if (course.sections) {
    for (const section of course.sections) {
      totalWords += countWords(section.title);
      if (section.contentBlocks) {
        for (const block of section.contentBlocks) {
          totalWords += getBlockWordCount(block);
        }
      }
    }
  }

  if (course.assessment && course.assessment.questions) {
    for (const q of course.assessment.questions) {
      totalWords += countWords(q.question);
      if (q.explanation) totalWords += countWords(q.explanation);
      if (q.options) for (const opt of q.options) totalWords += countWords(opt.text || '');
    }
  }

  if (course.references) {
    for (const ref of course.references) totalWords += countWords(ref);
  }

  console.log(`\n📊 Word count: ${totalWords.toLocaleString()} / ${REQUIRED_WORD_COUNT.toLocaleString()} required`);

  if (totalWords < REQUIRED_WORD_COUNT) {
    errors.push(`Word count ${totalWords} is below the required ${REQUIRED_WORD_COUNT} for ${course.ceHours} CE hours.`);
  }

  // Structural checks
  if (!course.slug) errors.push('Missing slug');
  if (!course.courseCode) errors.push('Missing courseCode');
  if (!course.ceHours) errors.push('Missing ceHours');
  if (!course.sections || course.sections.length < 4) errors.push('Must have at least 4 sections (intro + 3 content)');
  if (!course.assessment) errors.push('Missing assessment');
  if (course.assessment && course.assessment.questions && course.assessment.questions.length < 15) {
    errors.push(`Assessment has only ${course.assessment.questions.length} questions; minimum 15 required.`);
  }
  if (!course.references || course.references.length < 15) {
    errors.push(`Only ${(course.references || []).length} references; minimum 15 required.`);
  }

  // Check all MC options are objects with text/isCorrect
  if (course.assessment && course.assessment.questions) {
    for (const q of course.assessment.questions) {
      if (q.options) {
        for (const opt of q.options) {
          if (typeof opt !== 'object' || !('text' in opt) || !('isCorrect' in opt)) {
            errors.push(`Question "${q.question.slice(0, 50)}" has malformed option: ${JSON.stringify(opt)}`);
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, totalWords };
}

// ─── MAIN SEED RUNNER ───────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱 Seeding course: ${COURSE.title}`);
  console.log(`   Slug: ${SLUG}`);

  const { valid, errors, totalWords } = validate(COURSE);

  if (!valid) {
    console.error('\n❌ Validation failed:');
    for (const err of errors) console.error(`   • ${err}`);
    process.exit(1);
  }

  console.log(`\n✅ Validation passed (${totalWords.toLocaleString()} words)`);
  console.log(`   Sections: ${COURSE.sections.length}`);
  console.log(`   Assessment questions: ${COURSE.assessment.questions.length}`);
  console.log(`   References: ${COURSE.references.length}`);

  await mongoose.connect(MONGODB_URI);
  console.log('\n🔗 Connected to MongoDB');

  // Dynamically load the model
  let InteractiveCourse;
  try {
    InteractiveCourse = mongoose.model('InteractiveCourse');
  } catch {
    const { default: model } = await import('../models/InteractiveCourse.js');
    InteractiveCourse = model;
  }

  const existing = await InteractiveCourse.findOne({ slug: SLUG });
  if (existing) {
    await InteractiveCourse.findOneAndUpdate({ slug: SLUG }, COURSE, { new: true, runValidators: true });
    console.log(`\n♻️  Updated existing course (slug: ${SLUG})`);
  } else {
    await InteractiveCourse.create(COURSE);
    console.log(`\n✨ Created new course (slug: ${SLUG})`);
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
  console.log('\n🎉 Seed complete!\n');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
